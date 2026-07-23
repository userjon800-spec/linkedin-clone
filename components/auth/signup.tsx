"use client";
import Image from "next/image";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const [data, setData] = useState<{
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
  }>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const fetchData = async () => {
    try {
      if (!data.email.trim().length || !data.password.trim().length) {
        return alert("Please fill all the fields");
      } else if (data.password !== data.confirmPassword) {
        return alert("Passwords do not match");
      }
      const res = await api.post("/api/auth/register", {
        email: data.email,
        password: data.password,
        firstName: data.name,
      });
      toast.success(res.data.message);
      setTimeout(() => {
        router.refresh();
      }, 3000);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="min-h-screen bg-[#f3f2ef] dark:bg-[#1a1a1a] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-[#242424] w-full max-w-100 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)] p-8 md:p-10 transition-colors duration-300">
        {/* LinkedIn Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/linkedinLogo.png"
            alt="LinkedIn Logo"
            width={72}
            height={72}
            className="object-contain dark:brightness-0 dark:invert"
            priority
          />
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-medium text-center text-[#0a0a0a] dark:text-[#e0e0e0] leading-tight mb-2 transition-colors duration-300">
          Create your account
        </h1>
        <p className="text-center text-[#8f8f8f] dark:text-[#a0a0a0] text-sm mb-6 transition-colors duration-300">
          Join LinkedIn to connect with professionals
        </p>

        {/* Input Fields */}
        <div className="space-y-3 mb-5">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8f8f8f] dark:text-[#888888] transition-colors duration-300" />
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full pl-10 pr-4 py-3 h-12 rounded-md border border-[#8f8f8f] dark:border-[#555555] bg-white dark:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] placeholder:text-[#8f8f8f] dark:placeholder:text-[#888888] focus:border-[#0a66c2] dark:focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20 dark:focus:ring-[#0a66c2]/30 focus:outline-none text-base transition-all duration-300"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8f8f8f] dark:text-[#888888] transition-colors duration-300" />
            <input
              onChange={(e) => setData({ ...data, email: e.target.value })}
              type="email"
              name="email"
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-3 h-12 rounded-md border border-[#8f8f8f] dark:border-[#555555] bg-white dark:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] placeholder:text-[#8f8f8f] dark:placeholder:text-[#888888] focus:border-[#0a66c2] dark:focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20 dark:focus:ring-[#0a66c2]/30 focus:outline-none text-base transition-all duration-300"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8f8f8f] dark:text-[#888888] transition-colors duration-300" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password (8+ characters)"
              name="password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="w-full pl-10 pr-12 py-3 h-12 rounded-md border border-[#8f8f8f] dark:border-[#555555] bg-white dark:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] placeholder:text-[#8f8f8f] dark:placeholder:text-[#888888] focus:border-[#0a66c2] dark:focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20 dark:focus:ring-[#0a66c2]/30 focus:outline-none text-base transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f8f8f] dark:text-[#888888] hover:text-[#0a0a0a] dark:hover:text-[#e0e0e0] transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8f8f8f] dark:text-[#888888] transition-colors duration-300" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              name="confirmPassword"
              onChange={(e) =>
                setData({ ...data, confirmPassword: e.target.value })
              }
              className="w-full pl-10 pr-12 py-3 h-12 rounded-md border border-[#8f8f8f] dark:border-[#555555] bg-white dark:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] placeholder:text-[#8f8f8f] dark:placeholder:text-[#888888] focus:border-[#0a66c2] dark:focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20 dark:focus:ring-[#0a66c2]/30 focus:outline-none text-base transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f8f8f] dark:text-[#888888] hover:text-[#0a0a0a] dark:hover:text-[#e0e0e0] transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="mb-5 px-1">
          <p className="text-xs text-[#8f8f8f] dark:text-[#999999] transition-colors duration-300">
            Password must contain:
          </p>
          <ul className="text-xs text-[#8f8f8f] dark:text-[#999999] list-disc list-inside mt-1 space-y-0.5 transition-colors duration-300">
            <li>At least 8 characters</li>
            <li>One uppercase & one lowercase letter</li>
            <li>At least one number</li>
          </ul>
        </div>

        {/* Agree & Join Button */}
        <button
          onClick={fetchData}
          className="w-full h-12 rounded-full bg-[#0a66c2] hover:bg-[#004182] dark:bg-[#0a66c2] dark:hover:bg-[#004182] text-white font-semibold text-base transition-all duration-200 cursor-pointer"
        >
          Agree & Join
        </button>

        {/* Terms */}
        <p className="text-[10px] text-[#8f8f8f] dark:text-[#999999] text-center mt-3 px-2 leading-relaxed transition-colors duration-300">
          By clicking Agree & Join, you agree to LinkedIn&apos;s{" "}
          <span className="text-[#0a66c2] dark:text-[#4d8fd4] hover:underline cursor-pointer transition-colors">
            User Agreement
          </span>
          ,{" "}
          <span className="text-[#0a66c2] dark:text-[#4d8fd4] hover:underline cursor-pointer transition-colors">
            Privacy Policy
          </span>
          , and{" "}
          <span className="text-[#0a66c2] dark:text-[#4d8fd4] hover:underline cursor-pointer transition-colors">
            Cookie Policy
          </span>
          .
        </p>

        {/* Divider */}
        <div className="relative flex items-center my-5">
          <div className="grow border-t border-[#e0e0e0] dark:border-[#444444] transition-colors duration-300"></div>
          <span className="px-4 text-sm text-[#8f8f8f] dark:text-[#888888] bg-white dark:bg-[#242424] transition-colors duration-300">
            or
          </span>
          <div className="grow border-t border-[#e0e0e0] dark:border-[#444444] transition-colors duration-300"></div>
        </div>

        {/* Google Sign Up Button */}
        <button className="w-full h-12 rounded-full border border-[#8f8f8f] dark:border-[#555555] hover:border-[#0a66c2] dark:hover:border-[#0a66c2] hover:bg-[#f3f6f9] dark:hover:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] font-medium text-base transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer">
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign up with Google
        </button>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-[#0a0a0a] dark:text-[#e0e0e0] text-sm transition-colors duration-300">
            Already have an account ?{" "}
            <Link
              href={"/auth/signin"}
              className="text-[#0a66c2] dark:text-[#4d8fd4] font-semibold hover:underline hover:text-[#004182] dark:hover:text-[#6ba3e0] cursor-pointer transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
