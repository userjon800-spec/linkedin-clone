import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/user";
import { signupSchema } from "@/lib/validations/auth"; // Zod sxemasi (agar bo'lsa)
import {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
} from "@/lib/tokens";
const isProduction = process.env.NODE_ENV === "production";
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    // 1. Zod orqali backend validatsiyasi (tavsiya etiladi)
    const validationResult = signupSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Ma'lumotlar noto'g'ri kiritildi",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const { email, password, confirmPassword, ...otherData } =
      validationResult.data;
    // 2. Email mavjudligini tekshirish
    const isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      return NextResponse.json(
        { message: "Bu email allaqachon ro'yxatdan o'tgan" },
        { status: 400 },
      );
    }
    // 3. Parolni hashlash va foydalanuvchini yaratish
    const hashedPassword = await bcrypt.hash(password, 10);
    // confirmPassword siz faqat kerakli ma'lumotlarni saqlaymiz
    const user = await User.create({
      ...otherData,
      email,
      password: hashedPassword,
    });
    // 4. Tokenlarni generatsiya qilish
    const userId = user._id.toString();
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);
    // 5. Refresh tokenni saqlash
    const userAgent = req.headers.get("user-agent") || undefined;
    await saveRefreshToken(userId, refreshToken, userAgent);
    // 6. Javob qaytarish uchun parolsiz foydalanuvchi obyekti
    const userResponse = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      // boshqa kerakli frontend maydonlari...
    };
    const response = NextResponse.json({
      success: true,
      message: "Siz ro'yxatdan muvaffaqiyatli o'tdingiz",
      user: userResponse,
    });
    // 7. Cookie sozlamalari
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      // Agar backend va frontend bitta domain bo'lsa 'lax' eng xavfsizidir
      sameSite: (isProduction ? "lax" : "lax") as "lax" | "none" | "strict",
      path: "/",
    };
    response.cookies.set("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60, // 15 daqiqa
    });
    response.cookies.set("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7, // 7 kun
    });
    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Serverda kutilmagan xatolik yuz berdi" },
      { status: 500 },
    );
  }
}
