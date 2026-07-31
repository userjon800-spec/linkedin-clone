"use client";

export default function LinkedInSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 font-sans animate-pulse select-none">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* ========================================== */}
        {/* 1. CHAP PANEL (Profile / Navigation Sidebar) */}
        {/* ========================================== */}
        <div className="hidden md:block md:col-span-3 space-y-4">
          <div className="bg-[#1b1f23] border border-[#38434f] rounded-xl overflow-hidden">
            {/* Banner */}
            <div className="h-16 bg-[#283240]" />

            {/* Avatar & Info */}
            <div className="p-4 pt-0 relative flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#38434f] border-4 border-[#1b1f23] -mt-8 mb-3" />
              <div className="h-4 bg-[#38434f] rounded-md w-3/4 mb-2" />
              <div className="h-3 bg-[#283240] rounded-md w-1/2 mb-4" />

              <div className="w-full border-t border-[#2d3748] pt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-[#283240] rounded-md w-1/3" />
                  <div className="h-3 bg-[#38434f] rounded-md w-8" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-[#283240] rounded-md w-1/2" />
                  <div className="h-3 bg-[#38434f] rounded-md w-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Mini Groups / Saved Items Card */}
          <div className="bg-[#1b1f23] border border-[#38434f] rounded-xl p-4 space-y-3">
            <div className="h-3 bg-[#38434f] rounded-md w-1/3" />
            <div className="h-3 bg-[#283240] rounded-md w-2/3" />
            <div className="h-3 bg-[#283240] rounded-md w-1/2" />
          </div>
        </div>

        {/* ========================================== */}
        {/* 2. O'RTA PANEL (Start Post & Post Feed)    */}
        {/* ========================================== */}
        <div className="col-span-1 md:col-span-9 lg:col-span-6 space-y-4">
          {/* Start Post Skeleton */}
          <div className="bg-[#1b1f23] border border-[#38434f] rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#38434f] shrink-0" />
              <div className="h-12 bg-[#283240] rounded-full w-full" />
            </div>
            <div className="flex justify-around pt-2 border-t border-[#2d3748]">
              <div className="h-6 bg-[#283240] rounded-md w-24" />
              <div className="h-6 bg-[#283240] rounded-md w-24" />
            </div>
          </div>

          {/* Post Card Skeleton (2-3 ta ko'rsatish uchun loop) */}
          {[1, 2].map((item) => (
            <div
              key={item}
              className="bg-[#1b1f23] border border-[#38434f] rounded-xl p-4 space-y-4"
            >
              {/* User Header */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#38434f] shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-[#38434f] rounded-md w-1/3" />
                  <div className="h-3 bg-[#283240] rounded-md w-1/4" />
                </div>
              </div>

              {/* Post Content Lines */}
              <div className="space-y-2 pt-1">
                <div className="h-3.5 bg-[#283240] rounded-md w-full" />
                <div className="h-3.5 bg-[#283240] rounded-md w-11/12" />
                <div className="h-3.5 bg-[#283240] rounded-md w-4/5" />
              </div>

              {/* Post Image Box Placeholder */}
              <div className="w-full h-52 bg-[#283240] rounded-lg" />

              {/* Post Reaction & Action buttons */}
              <div className="flex justify-between items-center pt-2 border-t border-[#2d3748]">
                <div className="h-8 bg-[#283240] rounded-md w-20" />
                <div className="h-8 bg-[#283240] rounded-md w-20" />
                <div className="h-8 bg-[#283240] rounded-md w-20" />
              </div>
            </div>
          ))}
        </div>

        {/* ========================================== */}
        {/* 3. O'NG PANEL (LinkedIn News / Widgets)    */}
        {/* ========================================== */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="bg-[#1b1f23] border border-[#38434f] rounded-xl p-4 space-y-4">
            <div className="h-4 bg-[#38434f] rounded-md w-1/2 mb-2" />

            {/* News Items */}
            {[1, 2, 3, 4].map((news) => (
              <div key={news} className="space-y-1.5">
                <div className="h-3.5 bg-[#283240] rounded-md w-5/6" />
                <div className="h-2.5 bg-[#283240]/60 rounded-md w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
