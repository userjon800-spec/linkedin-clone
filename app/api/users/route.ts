import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
    const rawPayload = req.headers.get("x-user-payload");
    const { userId } = rawPayload ? JSON.parse(rawPayload) : null;
    if (!userId) {
      return NextResponse.json(
        { message: "Token topilmadi, avtorizatsiyadan o'tilmagan" },
        { status: 401 },
      );
    }
    const users = await User.find({});
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Serverda kutilmagan xatolik yuz berdi" },
      { status: 500 },
    );
  }
}
