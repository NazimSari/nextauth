import { NextResponse } from "next/server";
import User from "@/app/(models)/User";
import jwt from "jsonwebtoken";
import { sendRegisterMail } from "@/helpers/sendRegisterMail";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    // Kullanıcı var mı kontrolü
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Şifre sıfırlama için token oluştur
    const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h", // 1 saat geçerli olacak
    });

    // Şifre sıfırlama linki
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/ResetPasswordPage?token=${resetToken}`;

    // Kullanıcıya doğrulama maili gönder
    await sendRegisterMail(
      user.email,
      "Verify your email",
      `Please verify your email by clicking the following link: ${resetUrl}`,
      `<h1>Hello, ${user.name}</h1><p>Click <a href="${resetUrl}">here</a> to verify your email and activate your account.</p>`
    );
    return NextResponse.json({
      message:
        "Şifre sıfırlama talebiniz e-posta adresinize gönderildi, lütfen gelen linke tıklayın ve yeni şifrenizi girin.",
    });
  } catch (error) {
    console.log("Error occurred:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
