import { User } from "@/models/user";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Token topilmadi, avtorizatsiyadan o'tilmagan" },
        { status: 401 },
      );
    }
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET!,
    ) as jwt.JwtPayload & { userId: string };
    const user = await User.findById(decoded.userId);
    const { password, ...securedUser } = user.toObject();
    return NextResponse.json({ success: true, user: securedUser });
  } catch (error) {
    console.error(error);
  }
}
