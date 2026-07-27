import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { RefreshToken } from "@/models/refresh-token";
import { generateAccessToken } from "@/lib/tokens";
import { cookies } from "next/headers";
const isProduction = process.env.NODE_ENV === "production";
export async function POST(req: NextRequest) {
  try {
    // 1. Cookie ichidan refreshToken ni olamiz
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { message: "Refresh token topilmadi, qayta login qiling" },
        { status: 401 },
      );
    }
    // 2. Refresh tokenni JWT orqali tekshiramiz (verify)
    let decoded: jwt.JwtPayload & { userId?: string };
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!,
      ) as jwt.JwtPayload & { userId?: string };
    } catch (error) {
      return NextResponse.json(
        { message: "Refresh token muddati tugagan yoki yaroqsiz" },
        { status: 401 },
      );
    }
    await connectDB();
    // 3. Bazadan ushbu foydalanuvchiga tegishli barcha tokenlarni olamiz
    const savedTokens = await RefreshToken.find({ userId: decoded.userId });
    if (savedTokens.length === 0 || !decoded.userId) {
      return NextResponse.json(
        { error: "Seans topilmadi yoki bekor qilingan" },
        { status: 403 },
      );
    }
    // 4. Kelgan token bazadagi xeshlangan tokenlardan birortasiga mos kelishini tekshiramiz
    let matchedTokenDoc = null;
    for (const tokenDoc of savedTokens) {
      const isMatch = await bcrypt.compare(refreshToken, tokenDoc.token);
      if (isMatch) {
        matchedTokenDoc = tokenDoc;
        break;
      }
    }
    if (!matchedTokenDoc) {
      return NextResponse.json(
        { error: "Ruxsat etilmagan harakat (Token mos kelmadi)" },
        { status: 403 },
      );
    }
    // 5. Yangi Access Token yaratamiz
    const newAccessToken = generateAccessToken(decoded.userId);
    // 6. Javob qaytaramiz va yangi Access Token'ni cookie-ga yozamiz
    const response = NextResponse.json({
      success: true,
      message: "Token muvaffaqiyatli yangilandi",
    });
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 15 * 60,
    });
    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
