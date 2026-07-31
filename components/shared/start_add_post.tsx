"use client";

import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Newspaper,
  X,
  Smile,
  Image as ImageIcon,
  Sparkles,
  Plus,
  Clock,
  ChevronDown,
  Link as LinkIcon,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { IUser } from "@/types";
import { toast } from "sonner";
import api from "@/lib/api";

export default function StartPost(user: { user: IUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");

  // Rasm bilan ishlash uchun state va ref'lar
  const [image, setImage] = useState<string | File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fayl tanlanganda
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setShowImageOptions(false);
      setShowUrlInput(false);
    }
  };
  // URL orqali rasm biriktirilganda
  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImage(imageUrlInput.trim());
      setImagePreview(imageUrlInput.trim());
      setImageUrlInput("");
      setShowUrlInput(false);
      setShowImageOptions(false);
    }
  };

  // Rasmni o'chirish
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handlePostSubmit = async () => {
    if (!content.trim() && !image) return;

    // So'ralgan ma'lumotlar tuzilmasi
    const postData = {
      author: user.user._id, // Foydalanuvchi ID si
      imageUrl: image, // URL string yoki File obyekti
      content: content, // Post matni (max length 3000)
      likes: [], // Like'lar ro'yxati
      commentsCount: 0, // Izohlar soni
    };

    try {
      const res = await api.post('/api/posts', postData);
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error:any) {
      console.error(error, "Post yuborishda xatolik yuz berdi");
      toast.error(error.response.data.message);
    }

    // Post yuborilgach modalni yopamiz va ma'lumotlarni tozalaymiz
    setContent("");
    setImage(null);
    setImagePreview(null);
    setShowImageOptions(false);
    setShowUrlInput(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* Yashirin File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* 1. Asosiy Start Post Card */}
      <div className="w-full bg-[#1b1f23] text-white border border-[#38434f] rounded-xl p-4 flex flex-col gap-3 font-sans">
        {/* Yuqori qism: Avatar va Input trigger */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#057642] shrink-0">
            <Image
              fill
              src={user.user.avatar}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="w-full text-left bg-[#1b1f23] hover:bg-[#283240] text-[#a0a6ac] hover:text-white font-medium px-5 py-3 rounded-full border border-[#38434f] transition-all text-sm sm:text-base cursor-pointer"
          >
            Start a post
          </button>
        </div>

        {/* Quyi qism: Event va Write article tugmalari */}
        <div className="flex items-center justify-around pt-1 border-t border-[#2d3748]/40">
          <button
            type="button"
            className="flex items-center gap-2.5 hover:bg-[#283240] px-4 py-2.5 rounded-md text-[#c4b5fd] hover:text-white transition-colors cursor-pointer text-sm font-semibold"
          >
            <Calendar className="w-5 h-5 text-[#c4b5fd]" />
            <span>Event</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2.5 hover:bg-[#283240] px-4 py-2.5 rounded-md text-[#fca5a5] hover:text-white transition-colors cursor-pointer text-sm font-semibold"
          >
            <Newspaper className="w-5 h-5 text-[#fca5a5]" />
            <span>Write article</span>
          </button>
        </div>
      </div>

      {/* 2. Modal (Dropdown / Dialog) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="bg-[#1b1f23] border border-[#38434f] text-white w-full max-w-140 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2d3748]">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#057642] shrink-0">
                  <Image
                    fill
                    src={user.user.avatar}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    className="flex items-center gap-1 font-semibold text-base hover:bg-[#283240] px-2 py-0.5 rounded transition-colors"
                  >
                    Javohir Xamdamboyev
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  <p className="text-xs text-gray-400 px-2">Post to Anyone</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-2 hover:bg-[#283240] rounded-full transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body (Textarea & Image Preview & Image Popups) */}
            <div className="p-5 flex-1 min-h-45 flex flex-col justify-between relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={3000}
                placeholder="What do you want to talk about?"
                rows={4}
                className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none text-base sm:text-lg"
                autoFocus
              />

              {/* Rasm ko'rinishi (Preview) */}
              {imagePreview && (
                <div className="relative my-3 rounded-lg overflow-hidden border border-[#38434f] max-h-60 flex items-center justify-center bg-black/40">
                  <Image
                    src={imagePreview}
                    alt="Uploaded preview"
                    fill
                    className="max-h-60 w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* URL Kiritish Oynasi */}
              {showUrlInput && (
                <div className="my-2 p-3 bg-[#283240] rounded-lg border border-[#38434f] flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="Paste image URL here..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="bg-[#70b5f9] text-black px-3 py-1 rounded-md text-xs font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(false)}
                    className="text-gray-400 hover:text-white p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Rasm tanlash popup-menusi */}
              {showImageOptions && (
                <div className="absolute bottom-4 left-5 bg-[#283240] border border-[#38434f] rounded-lg shadow-lg p-2 flex flex-col gap-1 z-10">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-[#38434f] rounded cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4 text-blue-400" />
                    <span>Upload File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUrlInput(true);
                      setShowImageOptions(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-[#38434f] rounded cursor-pointer transition-colors"
                  >
                    <LinkIcon className="w-4 h-4 text-green-400" />
                    <span>Paste Image URL</span>
                  </button>
                </div>
              )}
            </div>

            {/* Emoji Trigger */}
            <div className="px-5 pb-3">
              <button
                type="button"
                className="text-gray-400 hover:text-white p-2 hover:bg-[#283240] rounded-full transition-colors cursor-pointer"
              >
                <Smile className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Tools Footer (Enhance post, Image, Event, va hokazo) */}
            <div className="px-5 py-3 border-t border-[#2d3748] flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1.5 border border-[#38434f] hover:bg-[#283240] px-3 py-1.5 rounded-full text-xs font-semibold text-gray-200 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Enhance post</span>
                </button>

                {/* ImageIcon orqali Rasm menyusini ochish */}
                <button
                  type="button"
                  onClick={() => setShowImageOptions((prev) => !prev)}
                  className="text-gray-300 hover:text-white p-2 hover:bg-[#283240] rounded-full transition-colors cursor-pointer relative"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  className="text-gray-300 hover:text-white p-2 hover:bg-[#283240] rounded-full transition-colors cursor-pointer"
                >
                  <Calendar className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="text-gray-300 hover:text-white p-2 hover:bg-[#283240] rounded-full transition-colors cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="text-gray-300 hover:text-white p-2 hover:bg-[#283240] rounded-full transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Submit & Schedule section */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="text-gray-300 hover:text-white p-2 hover:bg-[#283240] rounded-full transition-colors cursor-pointer"
                >
                  <Clock className="w-5 h-5" />
                </button>
                <button
                  onClick={handlePostSubmit}
                  disabled={!content.trim() && !image}
                  className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all ${
                    content.trim() || image
                      ? "bg-[#70b5f9] text-[#000000] hover:bg-[#388fe7] cursor-pointer"
                      : "bg-[#2d3748] text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
