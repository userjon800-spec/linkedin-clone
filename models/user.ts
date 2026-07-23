import { Schema, models, model, InferSchemaType } from "mongoose";
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
    password: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String },
    avatar: { type: String, default: "" },
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
export type IUser = InferSchemaType<typeof userSchema>;
export const User = models.User || model("User", userSchema);
