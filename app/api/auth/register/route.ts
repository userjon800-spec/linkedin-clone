import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/user";
import {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
} from "@/lib/tokens";
const isProduction = process.env.NODE_ENV === "production";
export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password, firstName } = await req.json();
    const isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      return NextResponse.json(
        { error: "Bu allaqachon email ro'yxatdan o'tgan" },
        { status: 400 },
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
    });
    // 1. Tokenlarni generatsiya qilish
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    // 2. Refresh tokenni alohida collection saqlaymiz
    const userAgent = req.headers.get("user-agent") || undefined;
    await saveRefreshToken(user._id.toString(), refreshToken, userAgent);
    // 3. Tokenlarni cookie ga qo'shamiz va javob beramiz
    const response = NextResponse.json({
      success: true,
      message: "Siz ro'yxatdan muvaffaqiyatli o'tdingiz",
    });
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 15 * 60,
    });
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: `Server xatoligi yuz berdi, ${error}` },
      { status: 500 },
    );
  }
}
