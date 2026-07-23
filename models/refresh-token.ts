import mongoose, { Schema, Document, InferSchemaType } from "mongoose";
export interface IRefreshToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  deviceInfo?: string;
  createdAt: Date;
  expiresAt: Date;
}
const refreshTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  deviceInfo: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, expires: 0 },
});
export type IToken = InferSchemaType<typeof refreshTokenSchema>;
export const RefreshToken =
  mongoose.models.RefreshToken ||
  mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema);
