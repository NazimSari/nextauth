import jwt from "jsonwebtoken";
import User from "@/app/(models)/User"; // Kullanıcı modelinizi uygun path ile import edin
import { NextResponse } from "next/server"; // Next.js 14'te NextResponse kullanımı yaygın

export async function GET(req) {
  const { searchParams } = new URL(req.url); // URL'deki query parametrelerini alır
  const token = searchParams.get("token"); // Token'ı alın

  if (!token) {
    return NextResponse.json({ message: "Token is required" }, { status: 400 });
  }

  try {
    // Token'ı çöz
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanıcıyı bul ve hesabını aktif hale getir
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "Account is already verified" },
        { status: 400 }
      );
    }

    // Hesabı aktif hale getir
    user.isVerified = true;
    await user.save();

    // Kullanıcıyı login sayfasına yönlendirin
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signin`
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 400 }
    );
  }
}
