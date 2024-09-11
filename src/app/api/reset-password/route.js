import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "@/app/(models)/User";

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Kullanıcıyı bul
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Yeni şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10);

    // Şifreyi güncelle
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({
      message: "Password has been reset successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
