"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, ArrowRight, Check } from "lucide-react";
import api from "@/lib/api";
import { IUser } from "@/types";

export default function AddedFeed(userId: { userId: string }) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  // Connect so'rovlari holati
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // 1. Tayyor Axios `api` instance orqali userlarni olish
  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsFetching(true);
        const { data } = await api.get<{ succes: true; users: IUser[] }>(
          "/api/users",
        );
        setUsers(data.users);
      } catch (error) {
        console.error("Userlarni olishda xatolik:", error);
      } finally {
        setIsFetching(false);
      }
    }

    fetchUsers();
  }, [userId]);

  // 2. Connect bosilganda `api` orqali so'rov yuborish
  const handleConnect = async (userId: string) => {
    try {
      setLoadingId(userId);

      // await api.post("/users/connect", { targetUserId: userId });

      // Muvaffaqiyatli ketgach pending ro'yxatiga qo'shamiz
      setPendingRequests((prev) => [...prev, userId]);
    } catch (error) {
      console.error("Connect so'rovida xatolik:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full bg-[#1b1f23] text-white border border-[#38434f] rounded-xl p-4 font-sans">
      <h2 className="text-base font-semibold text-[#e8e6e3] mb-4">
        Add to your feed
      </h2>

      {isFetching ? (
        <div className="py-6 text-center text-xs text-[#a0a6ac]">
          Yuklanmoqda...
        </div>
      ) : users.length === 0 ? (
        <div className="py-4 text-center text-xs text-[#a0a6ac]">
          Tavsiyalar topilmadi
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => {
            const userId = user._id;
            const isPending = pendingRequests.includes(userId);
            const isLoading = loadingId === userId;

            // Ism va familiyani birlashtirish
            const fullName =
              `${user.firstName} ${user.lastName}`.trim() ||
              user.company ||
              "User";
            // Headline uchun bio, aks holda company yoki role
            const headline = user.bio || user.company || user.role;
            const job = user.job || "";
            return (
              <div key={userId} className="flex gap-3 items-start">
                <div
                  className={`relative w-12 h-12 shrink-0 overflow-hidden bg-[#283240] ${
                    user.role === "company" ? "rounded-md" : "rounded-full"
                  }`}
                >
                  <Image
                    src={user.avatar || "/avatar.jpg"}
                    alt={fullName}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white leading-tight truncate hover:underline cursor-pointer">
                    {fullName}
                  </h3>
                  <p className="text-xs text-[#a0a6ac] mt-0.5 truncate leading-tight">
                    {job}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleConnect(userId)}
                    disabled={isPending || isLoading}
                    className={`mt-2 inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all cursor-pointer ${
                      isPending
                        ? "border-[#a0a6ac] text-[#a0a6ac] bg-transparent cursor-default"
                        : "border-[#a0a6ac] hover:border-white text-white hover:bg-[#283240] active:scale-95"
                    }`}
                  >
                    {isLoading ? (
                      <span className="text-xs">Connecting...</span>
                    ) : isPending ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Pending</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Connect</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#a0a6ac] hover:text-white hover:bg-[#283240] px-2 py-1 -ml-2 rounded transition-colors cursor-pointer"
        onClick={() => (window.location.href = "/network")}
      >
        <span>View all recommendations</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
