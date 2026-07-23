import jwt from "jsonwebtoken";
import { connectDB } from "./mongodb";
import bcrypt from "bcryptjs";
import { RefreshToken } from "@/models/refresh-token";
export function generateAccessToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "15m",
  });
}
export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });
}
export async function saveRefreshToken(
  userId: string,
  refreshToken: string,
  userAgent?: string,
) {
  await connectDB();
  const hashedToken = await bcrypt.hash(refreshToken, 10);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await RefreshToken.create({
    userId,
    token: hashedToken,
    deviceInfo: userAgent || "Unkown Device",
    expiresAt,
  });
}
export async function deleteRefreshToken(userId: string, refreshToken: string) {
  await connectDB();
  const userTokens = await RefreshToken.find({ userId });
  for (const tokens of userTokens) {
    const isMatch = await bcrypt.compare(refreshToken, tokens.token);
    if (isMatch) {
      await RefreshToken.findByIdAndDelete(tokens._id);
      break;
    }
  }
}
export async function deleteAllRefreshTokens(userId: string) {
  await connectDB();
  await RefreshToken.deleteMany({ userId });
}
