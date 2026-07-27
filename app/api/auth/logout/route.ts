import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { deleteRefreshToken } from "@/lib/tokens";
export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (refreshToken) {
      try {
        // refresh tokendan user id ni olish
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET!,
        ) as JwtPayload & { userId: string };
        // bazadan ushbu aniq tokenni o'chirib tashlaymiz
        await deleteRefreshToken(decoded.userId, refreshToken);
      } catch (err) {
        // Token muddati o'tgan yoki yaroqsiz bo'lsa ham cookie'ni tozalashda davom etamiz
        console.error("Token verify error on logout:", err);
      }
    }
    const response = NextResponse.json({
      success: true,
      message: "Logout muvaffaqiyatli amalga oshirildi",
    });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: `Logout jarayonida xatolik yuz berdi, ${error}` },
      { status: 500 },
    );
  }
}
