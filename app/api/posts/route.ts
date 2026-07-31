import { connectDB } from "@/lib/mongodb";
import { Post } from "@/models/post";
import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    await connectDB();
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
    const post = await Post.create(body);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { posts: post._id } },
      { new: true }
    );
    return NextResponse.json({
      success: true,
      message: "Post muvaffaqiyatli yaratildi",
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Serverda kutilmagan xatolik yuz berdi" },
      { status: 500 },
    );
  }
}
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
    const posts = await Post.find({}).populate("author");
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Serverda kutilmagan xatolik yuz berdi" },
      { status: 500 },
    );
  }
}
