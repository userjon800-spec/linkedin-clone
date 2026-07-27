"use client";
import Image from "next/image";
import { Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function Signin() {
  const [data, setData] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const router = useRouter();
  const fetchData = async () => {
    try {
      if (!data.email.trim().length || !data.password.trim().length) {
        return alert("Please fill all the fields");
      }
      const res = await api.post("/api/auth/login", data);
      toast.success(res.data.message);
      setTimeout(() => {
        router.refresh()
      }, 3000);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="min-h-screen bg-[#f3f2ef] dark:bg-[#1a1a1a] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-[#242424] w-full max-w-100 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)] p-8 md:p-10 transition-colors duration-300">
        {/* LinkedIn Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="https://static.vecteezy.com/system/resources/previews/018/930/480/non_2x/linkedin-logo-linkedin-icon-transparent-free-png.png"
            alt="LinkedIn Logo"
            width={100}
            height={100}
            className="object-cover"
            priority
          />
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-medium text-center text-[#0a0a0a] dark:text-[#e0e0e0] leading-tight mb-6 transition-colors duration-300">
          Make the most of your professional life
        </h1>

        {/* Input Fields */}
        <div className="space-y-3 mb-5">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8f8f8f] dark:text-[#888888] transition-colors duration-300" />
            <input
              type="email"
              name="email"
              onChange={(e) => setData({ ...data, email: e.target.value })}
              placeholder="Email or phone number"
              className="w-full pl-10 pr-4 py-3 h-12 rounded-md border border-[#8f8f8f] dark:border-[#555555] bg-white dark:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] placeholder:text-[#8f8f8f] dark:placeholder:text-[#888888] focus:border-[#0a66c2] dark:focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20 dark:focus:ring-[#0a66c2]/30 focus:outline-none text-base transition-all duration-300"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8f8f8f] dark:text-[#888888] transition-colors duration-300" />
            <input
              onChange={(e) => setData({ ...data, password: e.target.value })}
              type="password"
              name="password"
              placeholder="Password (6 or more characters)"
              className="w-full pl-10 pr-4 py-3 h-12 rounded-md border border-[#8f8f8f] dark:border-[#555555] bg-white dark:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] placeholder:text-[#8f8f8f] dark:placeholder:text-[#888888] focus:border-[#0a66c2] dark:focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20 dark:focus:ring-[#0a66c2]/30 focus:outline-none text-base transition-all duration-300"
            />
          </div>
        </div>

        {/* Agree & Join Button */}
        <button
          type="submit"
          onClick={fetchData}
          className="w-full h-12 rounded-full bg-[#0a66c2] hover:bg-[#004182] dark:bg-[#0a66c2] dark:hover:bg-[#004182] text-white font-semibold text-base transition-all duration-200 cursor-pointer"
        >
          Agree & Join
        </button>

        {/* Divider */}
        <div className="relative flex items-center my-6">
          <div className="grow border-t border-[#e0e0e0] dark:border-[#444444] transition-colors duration-300"></div>
          <span className="px-4 text-sm text-[#8f8f8f] dark:text-[#888888] bg-white dark:bg-[#242424] transition-colors duration-300">
            or
          </span>
          <div className="grow border-t border-[#e0e0e0] dark:border-[#444444] transition-colors duration-300"></div>
        </div>

        {/* Google Button */}
        <button className="w-full h-12 rounded-full border border-[#8f8f8f] dark:border-[#555555] hover:border-[#0a66c2] dark:hover:border-[#0a66c2] hover:bg-[#f3f6f9] dark:hover:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] font-medium text-base transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer">
          <FcGoogle />
          Sign in with Google
        </button>

        {/* Footer */}
        <div className="mt-6 text-center flex flex-col gap-2">
          <p className="text-[#0a0a0a] dark:text-[#e0e0e0] text-sm transition-colors duration-300">
            Forgot your password{" "}
            <Link
              href="/auth/forgot-password"
              className="text-[#0a66c2] dark:text-[#4d8fd4] font-semibold hover:underline hover:text-[#004182] dark:hover:text-[#6ba3e0] cursor-pointer transition-colors"
            >
              Forgot Password
            </Link>
          </p>
          <p className="text-[#0a0a0a] dark:text-[#e0e0e0] text-sm transition-colors duration-300">
            Don&apos;t have an account ?{" "}
            <Link
              href="/auth/signup"
              className="text-[#0a66c2] dark:text-[#4d8fd4] font-semibold hover:underline hover:text-[#004182] dark:hover:text-[#6ba3e0] cursor-pointer transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
