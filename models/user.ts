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
    firstName: { type: String, required: true },
    role: { type: String, default: "user", enum: ["user", "admin", 'company'] },
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
  },
  { timestamps: true },
);
userSchema.index({ firstName: "text", lastName: "text", headline: "text" });
export const User = models.User || model("User", userSchema);
