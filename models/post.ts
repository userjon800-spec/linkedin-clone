import { Schema, models, model } from "mongoose";
const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, maxlength: 3000 },
  imageUrl: { type: String, default: "" },
  // Like'lar embed qilingan — soni cheklangan va tez-tez birga o'qiladi
  likes: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
  // Izohlar sonini keshlab qo'yamiz, har safar Comment collection'ni
  // sanashning hojati bo'lmasin (tez ko'rsatish uchun)
  commentsCount: { type: Number, default: 0 },
});
PostSchema.index({ author: 1, createdAt: -1 });
export const Post = models.Post || model("Post", PostSchema);
