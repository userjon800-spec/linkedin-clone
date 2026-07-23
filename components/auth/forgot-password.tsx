"use client";
import Image from "next/image";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] dark:bg-[#1a1a1a] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-[#242424] w-full max-w-100 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)] p-8 md:p-10 transition-colors duration-300">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-[#8f8f8f] dark:text-[#888888] hover:text-[#0a66c2] dark:hover:text-[#4d8fd4] transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm">Back</span>
        </button>

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

        {!isSubmitted ? (
          <>
            {/* Heading */}
            <h1 className="text-2xl md:text-3xl font-medium text-center text-[#0a0a0a] dark:text-[#e0e0e0] leading-tight mb-2 transition-colors duration-300">
              Reset your password
            </h1>
            <p className="text-center text-[#8f8f8f] dark:text-[#a0a0a0] text-sm mb-6 transition-colors duration-300">
              Enter your email address and we&apos;ll send you a link to reset
              your password
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8f8f8f] dark:text-[#888888] transition-colors duration-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="w-full pl-10 pr-4 py-3 h-12 rounded-md border border-[#8f8f8f] dark:border-[#555555] bg-white dark:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] placeholder:text-[#8f8f8f] dark:placeholder:text-[#888888] focus:border-[#0a66c2] dark:focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20 dark:focus:ring-[#0a66c2]/30 focus:outline-none text-base transition-all duration-300"
                />
              </div>

              <button
                type="submit"
                disabled={!email || isLoading}
                className="w-full h-12 rounded-full bg-[#0a66c2] hover:bg-[#004182] dark:bg-[#0a66c2] dark:hover:bg-[#004182] text-white font-semibold text-base transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0a66c2]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </div>
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center my-6">
              <div className="grow border-t border-[#e0e0e0] dark:border-[#444444] transition-colors duration-300"></div>
              <span className="px-4 text-sm text-[#8f8f8f] dark:text-[#888888] bg-white dark:bg-[#242424] transition-colors duration-300">
                or
              </span>
              <div className="grow border-t border-[#e0e0e0] dark:border-[#444444] transition-colors duration-300"></div>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-[#0a0a0a] dark:text-[#e0e0e0] text-sm transition-colors duration-300">
                Remember your password?{" "}
                <span className="text-[#0a66c2] dark:text-[#4d8fd4] font-semibold hover:underline hover:text-[#004182] dark:hover:text-[#6ba3e0] cursor-pointer transition-colors">
                  Sign in
                </span>
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>

              <h2 className="text-xl font-semibold text-[#0a0a0a] dark:text-[#e0e0e0] mb-2 transition-colors duration-300">
                Check your email
              </h2>

              <p className="text-[#8f8f8f] dark:text-[#a0a0a0] text-sm mb-6 transition-colors duration-300">
                We&apos;ve sent a password reset link to{" "}
                <span className="text-[#0a0a0a] dark:text-[#e0e0e0] font-medium">
                  {email}
                </span>
              </p>

              <div className="w-full space-y-3">
                <button
                  onClick={handleReset}
                  className="w-full h-12 rounded-full bg-[#0a66c2] hover:bg-[#004182] dark:bg-[#0a66c2] dark:hover:bg-[#004182] text-white font-semibold text-base transition-all duration-200 cursor-pointer"
                >
                  Send again
                </button>

                <button
                  onClick={() => (window.location.href = "/auth/signin")}
                  className="w-full h-12 rounded-full border border-[#8f8f8f] dark:border-[#555555] hover:border-[#0a66c2] dark:hover:border-[#0a66c2] hover:bg-[#f3f6f9] dark:hover:bg-[#333333] text-[#0a0a0a] dark:text-[#e0e0e0] font-medium text-base transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign in
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
