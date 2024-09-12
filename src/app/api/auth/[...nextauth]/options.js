import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/(models)/User";
import bcrypt from "bcrypt";

export const options = {
  providers: [
    GitHubProvider({
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
        };
      },
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
        };
      },
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const foundUser = await User.findOne({ email: credentials.email })
          .lean()
          .exec();
        if (foundUser) {
          const match = await bcrypt.compare(
            credentials.password,
            foundUser.password
          );
          if (match) {
            return foundUser;
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // Kendi giriş sayfanızın yolu
  },

  callbacks: {
    // Kullanıcı giriş yaptığında tetiklenen callback
    async signIn({ user, profile, account }) {
      // Kullanıcının email adresine göre veritabanında olup olmadığını kontrol et
      const existingUser = await User.findOne({ email: user.email });

      if (account.provider === "google" || account.provider === "github") {
        // OAuth (Google, GitHub) ile giriş yapılıyor
        // Kullanıcı veritabanında yoksa, onu kaydet

        if (!existingUser) {
          const newUser = new User({
            email: user.email,
            name: user.name || profile?.login,
            avatar: profile?.avatar_url || "",
            role: "user", // Varsayılan rol
            provider: account.provider,
            isVerified: true, // OAuth sağlayıcılarında e-posta doğrulama gerekmiyor
          });
          await newUser.save();
        }

        return true; // OAuth kullanıcıları için girişe izin ver
      }
      // E-posta ve şifre ile giriş yapılırken (credentials)
      if (!existingUser) {
        throw new Error("No account found with this email");
      }

      // Kullanıcı doğrulanmamışsa hata fırlat
      if (!existingUser.isVerified) {
        throw new Error("Please verify your email before logging in");
      }

      return true; // Girişe izin ver
    },

    async jwt({ token, user }) {
      if (user) {
        // Kullanıcıyı veritabanında bul
        const foundUser = await User.findOne({ email: user.email });

        if (foundUser) {
          // Kullanıcının rolünü token'a ekle
          token.role = foundUser.role;
          token.isVerified = foundUser.isVerified;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.isVerified = token.isVerified;
      }
      return session;
    },
  },
};
