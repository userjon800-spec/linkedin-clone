import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { deleteAllRefreshTokens } from "@/lib/tokens";
export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: "Seans topilmadi" }, { status: 401 });
    }
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as { userId: string };
    // Ushbu user'ga tegishli BARCHA refresh tokenlarni o'chiramiz
    await deleteAllRefreshTokens(decoded.userId);
    const response = NextResponse.json({
      success: true,
      message: "Barcha qurilmalardan muvaffaqiyatli chiqildi",
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
