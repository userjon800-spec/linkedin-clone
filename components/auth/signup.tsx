"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormValues } from "@/lib/validations/auth";
import { JOBS_LIST, JOBS_WITH_SKILLS } from "@/lib/constants/jobs";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  MapPin,
  Building,
  GraduationCap,
  Check,
  ArrowLeft,
  Plus,
  Loader2,
} from "lucide-react";
export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [customSkillInput, setCustomSkillInput] = useState("");

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      job: "",
      age: "",
      location: "",
      company: "",
      school: "",
      degree: "",
      field: "",
      skills: [],
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const selectedJob = watch("job");
  const selectedSkills = watch("skills") || [];

  // Job o'zgarganda mos skill larni tayyorlash
  const handleJobChange = (jobName: string) => {
    setValue("job", jobName, { shouldValidate: true });
    const recommended = JOBS_WITH_SKILLS[jobName] || [];
    setValue("skills", recommended.slice(0, 3));
  };

  // Skill ni tanlash / olib tashlash
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setValue(
        "skills",
        selectedSkills.filter((s) => s !== skill),
      );
    } else {
      setValue("skills", [...selectedSkills, skill]);
    }
  };

  // Yangi custom skill qo'shish
  const addCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setValue("skills", [...selectedSkills, trimmed]);
      setCustomSkillInput("");
    }
  };

  // Next step kontrollerlari (Har bir step validatsiyadan o'tgachgina keyingisiga o'tadi)
  const handleNextStep1 = async () => {
    const isValid = await trigger([
      "firstName",
      "email",
      "password",
      "confirmPassword",
    ]);
    if (isValid) setStep(2);
  };

  const handleNextStep2 = async () => {
    const isValid = await trigger(["job"]);
    if (isValid) setStep(3);
  };

  // Yakuniy Form Yuborish
  const onSubmit = async (data: SignupFormValues) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        age: data.age,
        job: data.job,
        location: data.location,
        confirmPassword: data.confirmPassword,
        company: data.company,
        skills: data.skills,
        education: data.school
          ? [
              {
                school: data.school,
                degree: data.degree,
                field: data.field,
              },
            ]
          : [],
      };
      const res = await api.post("/api/auth/register", payload);
      toast.success(res.data.message || "Muvaffaqiyatli ro'yxatdan o'tdingiz!");
      setTimeout(() => {
        router.push("/auth/signin");
      }, 1500);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  const availableSkills = selectedJob
    ? JOBS_WITH_SKILLS[selectedJob] || []
    : [];

  return (
    <div className="min-h-screen bg-[#f3f2ef] dark:bg-[#1a1a1a] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-[#242424] w-full max-w-md rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)] p-6 md:p-8 transition-colors duration-300">
        {/* Header & Progress */}
        <div className="flex items-center justify-between mb-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as 1 | 2)}
              className="p-1 rounded-full text-[#8f8f8f] hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#333333] transition-all cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <div className="w-6" />
          )}

          <Image
            src="https://static.vecteezy.com/system/resources/previews/018/930/480/non_2x/linkedin-logo-linkedin-icon-transparent-free-png.png"
            alt="LinkedIn Logo"
            width={60}
            height={60}
            className="object-contain dark:brightness-0 dark:invert"
            priority
          />
          <span className="text-xs font-semibold text-[#8f8f8f] dark:text-[#a0a0a0]">
            Step {step} of 3
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mb-6 overflow-hidden">
          <div
            className="bg-[#0a66c2] h-full transition-all duration-300 ease-in-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* STEP 1: Account Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-medium text-center text-[#0a0a0a] dark:text-[#e0e0e0] leading-tight mb-1">
                  Create your account
                </h1>
                <p className="text-center text-[#8f8f8f] dark:text-[#a0a0a0] text-sm mb-4">
                  Join LinkedIn to connect with professionals
                </p>
              </div>

              {/* First Name */}
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8f8f8f]" />
                  <input
                    {...register("firstName")}
                    placeholder="First Name *"
                    className="w-full pl-10 pr-4 h-12 rounded-md border border-[#8f8f8f] dark:border-[#555555] bg-white dark:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] placeholder:text-[#8f8f8f] focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20 focus:outline-none text-base"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1 pl-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8f8f8f]" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="Email address *"
                    className="w-full pl-10 pr-4 h-12 rounded-md border border-[#8f8f8f] dark:border-[#555555] bg-white dark:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] placeholder:text-[#8f8f8f] focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20 focus:outline-none text-base"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1 pl-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8f8f8f]" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password (8+ characters) *"
                    className="w-full pl-10 pr-12 h-12 rounded-md border border-[#8f8f8f] dark:border-[#555555] bg-white dark:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] placeholder:text-[#8f8f8f] focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20 focus:outline-none text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f8f8f] hover:text-black dark:hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1 pl-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8f8f8f]" />
                  <input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password *"
                    className="w-full pl-10 pr-12 h-12 rounded-md border border-[#8f8f8f] dark:border-[#555555] bg-white dark:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] placeholder:text-[#8f8f8f] focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20 focus:outline-none text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f8f8f] hover:text-black dark:hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1 pl-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleNextStep1}
                className="w-full h-12 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold text-base transition-all duration-200 cursor-pointer mt-2"
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2: Profile & Job */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-medium text-center text-[#0a0a0a] dark:text-[#e0e0e0] leading-tight mb-1">
                  Profile Details
                </h1>
                <p className="text-center text-[#8f8f8f] dark:text-[#a0a0a0] text-sm mb-4">
                  Tell us more about your career
                </p>
              </div>

              {/* Last Name */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8f8f8f]" />
                <input
                  {...register("lastName")}
                  placeholder="Last Name"
                  className="w-full pl-10 pr-4 h-12 rounded-md border border-[#8f8f8f] dark:border-[#555555] bg-white dark:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] placeholder:text-[#8f8f8f] focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20 focus:outline-none text-base"
                />
              </div>

              {/* Job Title Select */}
              <div>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8f8f8f]" />
                  <select
                    value={selectedJob}
                    onChange={(e) => handleJobChange(e.target.value)}
                    className="w-full pl-10 pr-4 h-12 rounded-md border border-[#8f8f8f] dark:border-[#555555] bg-white dark:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20 focus:outline-none text-base appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select your Job Title *
                    </option>
                    {JOBS_LIST.map((job) => (
                      <option key={job} value={job}>
                        {job}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.job && (
                  <p className="text-xs text-red-500 mt-1 pl-1">
                    {errors.job.message}
                  </p>
                )}
              </div>

              {/* Age & Location */}
              <div className="flex gap-2">
                <div className="w-1/3">
                  <input
                    {...register("age")}
                    type="number"
                    placeholder="Age"
                    className="w-full px-3 h-12 rounded-md border border-[#8f8f8f] dark:border-[#555555] bg-white dark:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] placeholder:text-[#8f8f8f] focus:border-[#0a66c2] focus:outline-none text-base"
                  />
                </div>
                <div className="w-2/3 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8f8f8f]" />
                  <input
                    {...register("location")}
                    placeholder="Location"
                    className="w-full pl-10 pr-4 h-12 rounded-md border border-[#8f8f8f] dark:border-[#555555] bg-white dark:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] placeholder:text-[#8f8f8f] focus:border-[#0a66c2] focus:outline-none text-base"
                  />
                </div>
              </div>

              {/* Company */}
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8f8f8f]" />
                <input
                  {...register("company")}
                  placeholder="Current Company (optional)"
                  className="w-full pl-10 pr-4 h-12 rounded-md border border-[#8f8f8f] dark:border-[#555555] bg-white dark:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] placeholder:text-[#8f8f8f] focus:border-[#0a66c2] focus:outline-none text-base"
                />
              </div>

              <button
                type="button"
                onClick={handleNextStep2}
                className="w-full h-12 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold text-base transition-all duration-200 cursor-pointer mt-2"
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 3: Education & Dynamic Skills */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-medium text-center text-[#0a0a0a] dark:text-[#e0e0e0] leading-tight mb-1">
                  Education & Skills
                </h1>
                <p className="text-center text-[#8f8f8f] dark:text-[#a0a0a0] text-sm mb-3">
                  Highlight your education and skills
                </p>
              </div>

              {/* School */}
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8f8f8f]" />
                <input
                  {...register("school")}
                  placeholder="University / School"
                  className="w-full pl-10 pr-4 h-11 rounded-md border border-[#8f8f8f] dark:border-[#555555] bg-white dark:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] placeholder:text-[#8f8f8f] focus:border-[#0a66c2] focus:outline-none text-sm"
                />
              </div>

              {/* Degree & Field */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  {...register("degree")}
                  placeholder="Degree (e.g. Bachelor)"
                  className="w-full px-3 h-11 rounded-md border border-[#8f8f8f] dark:border-[#555555] bg-white dark:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] placeholder:text-[#8f8f8f] focus:border-[#0a66c2] focus:outline-none text-sm"
                />
                <input
                  {...register("field")}
                  placeholder="Field of study"
                  className="w-full px-3 h-11 rounded-md border border-[#8f8f8f] dark:border-[#555555] bg-white dark:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] placeholder:text-[#8f8f8f] focus:border-[#0a66c2] focus:outline-none text-sm"
                />
              </div>

              {/* Dynamic Skills */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <label className="block text-xs font-semibold text-[#8f8f8f] dark:text-[#a0a0a0] mb-2">
                  Select Skills for{" "}
                  <span className="text-[#0a66c2] font-bold">
                    {selectedJob}
                  </span>
                  :
                </label>

                {/* Pre-suggested skills tags */}
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 mb-3">
                  {availableSkills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? "bg-[#0a66c2] text-white border-[#0a66c2]"
                            : "bg-gray-100 dark:bg-[#333333] text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-[#0a66c2]"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        {skill}
                      </button>
                    );
                  })}
                </div>

                {/* Custom skill add */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom skill..."
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomSkill();
                      }
                    }}
                    className="grow px-3 h-9 rounded-md border border-[#8f8f8f] dark:border-[#555555] bg-white dark:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] placeholder:text-[#8f8f8f] focus:border-[#0a66c2] focus:outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    className="px-3 h-9 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold text-base transition-all duration-200 cursor-pointer mt-2 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing up...
                  </>
                ) : (
                  "Agree & Complete Signup"
                )}
              </button>
            </div>
          )}
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <p className="text-[#0a0a0a] dark:text-[#e0e0e0] text-sm">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-[#0a66c2] dark:text-[#4d8fd4] font-semibold hover:underline cursor-pointer"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
