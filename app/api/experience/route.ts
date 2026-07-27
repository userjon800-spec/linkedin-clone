import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // middlewaredan decoded bo'lgan token ma'lumotlarini olamiz
    const rawPayload = req.headers.get("x-user-payload");
    // token ma'lumotlarini json dan object aylantirib olamiz
    const { userId } = rawPayload ? JSON.parse(rawPayload) : null;
    if (!userId) {
      return NextResponse.json(
        { message: "Token topilmadi, avtorizatsiyadan o'tilmagan" },
        { status: 401 },
      );
    }
    await User.findByIdAndUpdate(
      userId,
      { $push: { experience: body } },
      { new: true },
    );
    return NextResponse.json({
      success: true,
      message: "Ma'lumotlar muvaffaqiyatli saqlandi",
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Serverda kutilmagan xatolik yuz berdi" },
      { status: 500 },
    );
  }
}
