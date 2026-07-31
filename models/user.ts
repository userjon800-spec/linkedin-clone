import { defaultImageURL, JOBS_LIST } from "@/lib/constants/jobs";
import { Schema, models, model } from "mongoose";
const ExperienceSchema = new Schema(
  {
    company: { type: String, required: true },
    position: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String },
  },
  { _id: true, timestamps: true },
);
const EducationSchema = new Schema({
  school: { type: String, required: true },
  degree: { type: String },
  field: { type: String },
  startYear: { type: Number },
  endYear: { type: Number },
});
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    posts: { type: [Schema.Types.ObjectId], ref: "Post", default: [] },
    firstName: { type: String, required: true },
    role: { type: String, default: "user", enum: ["user", "admin", "company"] },
    lastName: { type: String },
    age: { type: Number },
    avatar: { type: String, default: "https://github.com/shadcn.png" },
    job: {
      type: String,
      required: true,
      enum: JOBS_LIST,
    },
    backgroundImage: { type: String, default: defaultImageURL },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    website: { type: String, default: "" },
    company: { type: String, default: "" },
    experience: { type: [ExperienceSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    skills: { type: [String], default: [] },
    connections: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    followers: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    following: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
  },
  { timestamps: true },
);
userSchema.index({ firstName: "text", lastName: "text", headline: "text" });
// LEKIN agar Next.js dev serverida schema o'zgargan bo'lsa, uni quyidagicha eksport qiling:
if (process.env.NODE_ENV === "development" && models.User) {
  delete (models as any).User;
}
export const User = models.User || model("User", userSchema);
