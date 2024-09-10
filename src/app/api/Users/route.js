import { NextResponse } from "next/server";
import User from "@/app/(models)/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendRegisterMail } from "@/helpers/sendRegisterMail";

export async function POST(req) {
  try {
    const body = await req.json();
    const userData = body.formData;

    if (!userData?.email || !userData?.password) {
      return NextResponse.json(
        { message: "Please provide email and password" },
        { status: 400 }
      );
    }

    const duplicate = await User.findOne({ email: userData.email })
      .lean()
      .exec();

    if (duplicate) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    const newUser = await User.create(userData);

    // Doğrulama linki için JWT token oluştur
    const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Doğrulama linki
    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-email?token=${token}`;

    // Kullanıcıya doğrulama maili gönder
    await sendRegisterMail(
      newUser.email,
      "Verify your email",
      `Please verify your email by clicking the following link: ${verifyUrl}`,
      `<h1>Hello, ${newUser.name}</h1><p>Click <a href="${verifyUrl}">here</a> to verify your email and activate your account.</p>`
    );

    return NextResponse.json(
      {
        message:
          "User created successfully. Please check your email to verify your account.",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(err);
    return NextResponse.json(
      { message: "Internal Server Error", err },
      { status: 500 }
    );
  }
}
