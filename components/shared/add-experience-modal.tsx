"use client";
import { useState } from "react";
import { X, Lightbulb } from "lucide-react";
interface AddExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }) => void;
}
export default function AddExperienceModal({
  isOpen,
  onClose,
  onSubmit,
}: AddExperienceModalProps) {
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);
  if (!isOpen) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        company,
        position,
        startDate,
        endDate: isCurrentlyWorking ? undefined : endDate,
        description,
      });
    }
    onClose();
    setPosition("");
    setCompany("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setIsCurrentlyWorking(false);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#1b1f23] border border-[#38434f] text-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden relative my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#38434f]">
          <h2 className="text-xl font-semibold text-white">Add experience</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-[#2b323a] transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 flex flex-col gap-5 max-h-[80vh] overflow-y-auto"
        >
          {/* Banner Tip */}
          <div className="bg-[#1d2a3a] border border-[#234870] rounded-lg p-3 flex items-start gap-3 text-sm text-[#70b5f9]">
            <Lightbulb className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
            <span>
              Are you a current student? Fill out the education form instead.
            </span>
          </div>
          <p className="text-xs text-gray-400">* Indicates required</p>
          {/* Position / Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-300 font-medium">
              Title / Position*
            </label>
            <input
              type="text"
              required
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Ex: Retail Sales Manager"
              className="bg-[#14171a] border border-[#38434f] focus:border-blue-500 rounded-md px-3 py-2 text-sm text-white outline-none transition"
            />
          </div>
          {/* Company */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-300 font-medium">
              Company or organization*
            </label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Ex: Microsoft"
              className="bg-[#14171a] border border-[#38434f] focus:border-blue-500 rounded-md px-3 py-2 text-sm text-white outline-none transition"
            />
          </div>
          {/* Currently Working Checkbox */}
          <div className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              id="currentlyWorking"
              checked={isCurrentlyWorking}
              onChange={(e) => setIsCurrentlyWorking(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
            <label
              htmlFor="currentlyWorking"
              className="text-sm text-gray-300 cursor-pointer"
            >
              I am currently working in this role
            </label>
          </div>
          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-300 font-medium">
                Start date*
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-[#14171a] border border-[#38434f] focus:border-blue-500 rounded-md px-3 py-2 text-sm text-white outline-none transition scheme-dark"
              />
            </div>
            {!isCurrentlyWorking && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-300 font-medium">
                  End date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-[#14171a] border border-[#38434f] focus:border-blue-500 rounded-md px-3 py-2 text-sm text-white outline-none transition scheme-dark"
                />
              </div>
            )}
          </div>
          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-300 font-medium">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your responsibilities, achievements, and technology stack..."
              className="bg-[#14171a] border border-[#38434f] focus:border-blue-500 rounded-md px-3 py-2 text-sm text-white outline-none transition resize-none"
            />
          </div>
          {/* Footer Save Button */}
          <div className="flex justify-end pt-4 border-t border-[#38434f] mt-2">
            <button
              type="submit"
              className="bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold text-sm px-5 py-1.5 rounded-full transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
