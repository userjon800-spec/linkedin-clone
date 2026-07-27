"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Bookmark, Users, Newspaper, Calendar } from "lucide-react";
import { IUser } from "@/types";
import AddExperienceModal from "./add_experience_modal";
import { toast } from "sonner";
import api from "@/lib/api";

export default function LeftMenuBar({ user }: { user?: IUser | null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddExperience = async (data: any) => {
    try {
      const res = await api.post("/api/experience", data);
      if (res.data.success) {
        toast.success(res.data.message);
        setIsModalOpen(false);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };
  if (!user) {
    return (
      <aside className="w-full md:w-56.25 lg:w-65 flex flex-col gap-2 shrink-0 animate-pulse select-none">
        <div className="bg-[#1b1f23] border border-[#38434f] rounded-xl overflow-hidden">
          <div className="h-14 w-full bg-[#283038]" />
          <div className="px-3 pb-3 pt-0 relative flex flex-col items-start">
            <div className="-mt-8 mb-2 w-16 h-16 rounded-full border-2 border-[#1b1f23] bg-[#283038]" />
            <div className="h-4 bg-[#283038] rounded w-3/4 mb-2" />
            <div className="h-3 bg-[#283038] rounded w-full mb-1" />
            <div className="h-3 bg-[#283038] rounded w-2/3 mb-2" />
            <div className="h-2.5 bg-[#283038] rounded w-1/3 mt-1" />
            <div className="mt-3 w-full h-7 border border-dashed border-[#38434f] rounded-md bg-[#21262c]" />
          </div>
        </div>
        <div className="bg-[#1b1f23] border border-[#38434f] rounded-xl p-3 flex flex-col gap-2">
          <div className="h-3 bg-[#283038] rounded w-5/6" />
          <div className="flex items-center gap-2 mt-1">
            <div className="w-3 h-3 bg-[#283038] rounded-sm shrink-0" />
            <div className="h-3 bg-[#283038] rounded w-1/2" />
          </div>
        </div>
        <div className="bg-[#1b1f23] border border-[#38434f] rounded-xl p-3 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="h-3 bg-[#283038] rounded w-1/2" />
            <div className="h-3 bg-[#283038] rounded w-6" />
          </div>
          <div className="flex justify-between items-center">
            <div className="h-3 bg-[#283038] rounded w-2/3" />
            <div className="h-3 bg-[#283038] rounded w-6" />
          </div>
        </div>
        <div className="bg-[#1b1f23] border border-[#38434f] rounded-xl py-2 px-3 flex flex-col gap-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-center gap-3 py-1">
              <div className="w-4 h-4 bg-[#283038] rounded" />
              <div className="h-3 bg-[#283038] rounded w-1/2" />
            </div>
          ))}
        </div>
      </aside>
    );
  }
  return (
    <>
      <aside className="w-full md:w-56.25 lg:w-65 flex flex-col gap-2 shrink-0 select-none">
        {/* Profile Card */}
        <div className="bg-[#1b1f23] border border-[#38434f] rounded-xl overflow-hidden relative">
          <div className="h-14 w-full relative bg-linear-to-r from-slate-800 to-slate-900">
            <Image
              src={user.backgroundImage}
              alt="Cover"
              fill
              className="object-cover"
            />
          </div>
          <div className="px-3 pb-3 pt-0 relative flex flex-col items-start">
            <div className="relative -mt-8 mb-2">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#1b1f23] relative">
                <Image
                  src={user.avatar}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <h2 className="text-white font-semibold text-base hover:underline cursor-pointer leading-tight">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-[#939ba2] text-xs mt-1 leading-snug font-normal line-clamp-2">
              {user.bio}
            </p>
            <p className="text-[#66727f] text-xs mt-1 font-normal">
              {user.location}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-3 w-full border border-dashed border-[#66727f] hover:border-white hover:bg-[#2b323a] text-[#a0aab4] hover:text-white rounded-md py-1 px-2.5 flex items-center justify-start gap-1.5 text-xs font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Experience</span>
            </button>
          </div>
        </div>
        {/* Premium Banner */}
        <div className="bg-[#1b1f23] border border-[#38434f] rounded-xl p-3 hover:bg-[#23282e] cursor-pointer transition">
          <p className="text-[#939ba2] text-xs font-normal leading-tight">
            Learn from industry leaders, only with Premium
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-3 h-3 bg-[#e7a33e] rounded-sm shrink-0" />
            <span className="text-white font-semibold text-xs hover:text-blue-400 transition">
              Start 1 month free trial
            </span>
          </div>
        </div>
        {/* Stats */}
        <div className="bg-[#1b1f23] border border-[#38434f] rounded-xl py-2.5 px-3 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs cursor-pointer hover:bg-[#23282e] -mx-3 px-3 py-1 transition">
            <span className="text-white font-medium">Profile viewers</span>
            <span className="text-[#70b5f9] font-bold">15</span>
          </div>
          <div className="flex justify-between items-center text-xs cursor-pointer hover:bg-[#23282e] -mx-3 px-3 py-1 transition">
            <span className="text-white font-medium">Post impressions</span>
            <span className="text-[#70b5f9] font-bold">10</span>
          </div>
        </div>
        {/* Links */}
        <div className="bg-[#1b1f23] border border-[#38434f] rounded-xl py-1.5 flex flex-col">
          <div className="flex items-center gap-3 text-xs font-semibold text-white px-3 py-2.5 hover:bg-[#23282e] cursor-pointer transition">
            <Bookmark className="w-4 h-4 fill-white text-white" />
            <span>Saved items</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-white px-3 py-2.5 hover:bg-[#23282e] cursor-pointer transition">
            <Users className="w-4 h-4 text-white" />
            <span>Groups</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-white px-3 py-2.5 hover:bg-[#23282e] cursor-pointer transition">
            <Newspaper className="w-4 h-4 text-white" />
            <span>Newsletters</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-white px-3 py-2.5 hover:bg-[#23282e] cursor-pointer transition">
            <Calendar className="w-4 h-4 text-white" />
            <span>Events</span>
          </div>
        </div>
      </aside>
      {/* Add Experience Modal */}
      <AddExperienceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddExperience}
      />
    </>
  );
}
