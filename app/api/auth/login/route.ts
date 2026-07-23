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
    const { email, password } = await req.json();
    const isExistingUser = await User.findOne({ email });
    if (!isExistingUser) {
      return NextResponse.json(
        { error: "Ushbu elektron pochta mavjud emas" },
        { status: 400 },
      );
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      isExistingUser.password,
    );
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Parol noto'g'ri" }, { status: 400 });
    }
    // 1. Tokenlarni generatsiya qilish
    const accessToken = generateAccessToken(isExistingUser._id.toString());
    const refreshToken = generateRefreshToken(isExistingUser._id.toString());
    // 2. Refresh tokenni alohida collection saqlaymiz
    const userAgent = req.headers.get("user-agent") || undefined;
    await saveRefreshToken(
      isExistingUser._id.toString(),
      refreshToken,
      userAgent,
    );
    // 3. Tokenlarni cookie ga qo'shamiz va response uzatamiz
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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: `Server xatoligi yuz berdi, ${error}` },
      { status: 500 },
    );
  }
}
