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

  callbacks: {
    async signIn({ user, profile, account }) {
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        // Eğer kullanıcı veritabanında yoksa, onu kaydet
        const newUser = new User({
          email: user.email,
          name: user.name || profile?.login,
          avatar: profile?.avatar_url || "",
          role: "user", // Varsayılan rol, isterseniz bunu değiştirebilirsiniz
          provider: account?.provider || "credentials",
        });
        await newUser.save();
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        // Kullanıcıyı veritabanında bul
        const foundUser = await User.findOne({ email: user.email });

        if (foundUser) {
          // Kullanıcının rolünü token'a ekle
          token.role = foundUser.role;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.name = token.name;
      }
      return session;
    },
  },
};
