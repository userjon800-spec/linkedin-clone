"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { getPosts } from "@/lib/request.client";
import { IPost } from "@/types";
import {
  MoreHorizontal,
  X,
  Bookmark,
  Link as LinkIcon,
  Code,
  UserX,
  ThumbsDown,
  AlertTriangle,
  Flag,
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  Loader2,
} from "lucide-react";

const POSTS_PER_PAGE = 15;

export default function PostCards() {
  const [allPosts, setAllPosts] = useState<IPost[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<IPost[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Menyusi ochiq turgan post ID'si
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  // Yashirilgan (Dismiss qilingan) postlar state-i: { [postId]: true }
  const [hiddenPosts, setHiddenPosts] = useState<Record<string, boolean>>({});
  // Saqlangan (Saved) postlar ID'lari
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);

  const observerTarget = useRef<HTMLDivElement | null>(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await getPosts();
      const fetchedPosts: IPost[] = res?.posts || [];

      setAllPosts(fetchedPosts);
      setDisplayedPosts(fetchedPosts.slice(0, POSTS_PER_PAGE));
    } catch (error) {
      console.error("getPosts error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const loadMorePosts = useCallback(() => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      const newDisplayed = allPosts.slice(0, nextPage * POSTS_PER_PAGE);
      setDisplayedPosts(newDisplayed);
      return nextPage;
    });
  }, [allPosts]);

  const hasMore = displayedPosts.length < allPosts.length;

  useEffect(() => {
    const target = observerTarget.current;
    if (!target || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, isLoading, loadMorePosts]);

  // Outside click bo'lganda dropdown menyuni yopish
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".post-menu-container")) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Actions
  const handleCopyLink = (postId: string) => {
    const postUrl = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard.writeText(postUrl);
    alert("Post havolasi nusxalandi!");
    setActiveMenuId(null);
  };

  const handleToggleSave = (postId: string) => {
    setSavedPostIds((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId],
    );
    setActiveMenuId(null);
  };

  // Postni yashirish (Dismiss)
  const handleHidePost = (postId: string) => {
    setHiddenPosts((prev) => ({ ...prev, [postId]: true }));
    setActiveMenuId(null);
  };

  // Yashirishni bekor qilish (Undo)
  const handleUndoHide = (postId: string) => {
    setHiddenPosts((prev) => {
      const updated = { ...prev };
      delete updated[postId];
      return updated;
    });
  };

  return (
    <div className="w-full max-w-[75%] mx-auto space-y-4 font-sans text-white mt-4">
      {isLoading && displayedPosts.length === 0 ? (
        <div className="py-8 flex justify-center items-center gap-2 text-sm text-[#a0a6ac] bg-[#1b1f23] rounded-xl border border-[#38434f]">
          <Loader2 className="w-5 h-5 animate-spin text-white" />
          <span>Postlar yuklanmoqda...</span>
        </div>
      ) : (
        displayedPosts.map((post) => {
          const authorName = post.author
            ? `${post.author.firstName} ${post.author.lastName}`.trim() ||
              post.author.company
            : "Noma'lum foydalanuvchi";

          const authorTitle =
            post.author?.job || post.author?.bio || post.author?.role || "";
          const authorAvatar =
            post.author?.avatar || "https://github.com/shadcn.png";
          const isMenuOpen = activeMenuId === post._id;
          const isSaved = savedPostIds.includes(post._id);
          const isHidden = !!hiddenPosts[post._id];

          // AGAR X (DISMISS) BOSILGAN BO'LSA:
          if (isHidden) {
            return (
              <div
                key={post._id}
                className="bg-[#1b1f23] border border-[#38434f] rounded-xl p-4 text-[#e8e6e3] space-y-3"
              >
                {/* Tepadagi xabar va Undo tugmasi */}
                <div className="flex items-center justify-between border-b border-[#283240] pb-3">
                  <span className="text-sm font-medium text-[#e8e6e3]">
                    Post hidden in feed. You'll get less like this.
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUndoHide(post._id)}
                    className="text-sm font-semibold text-[#70b5f9] hover:underline cursor-pointer"
                  >
                    Undo
                  </button>
                </div>

                {/* Rasmingizdagi 3 ta qo'shimcha option */}
                <div className="space-y-1 pt-1">
                  <button
                    type="button"
                    onClick={() => alert(`Unfollowed ${authorName}`)}
                    className="w-full flex items-center gap-3 py-2 px-2 hover:bg-[#283240] rounded-md transition-colors text-sm text-[#e8e6e3] text-left"
                  >
                    <UserX className="w-5 h-5 text-[#a0a6ac]" />
                    <span>Unfollow {authorName}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => alert("Reported AI slop")}
                    className="w-full flex items-center gap-3 py-2 px-2 hover:bg-[#283240] rounded-md transition-colors text-sm text-[#e8e6e3] text-left"
                  >
                    <AlertTriangle className="w-5 h-5 text-[#a0a6ac]" />
                    <span>Seems like AI slop</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => alert("Reported post")}
                    className="w-full flex items-center gap-3 py-2 px-2 hover:bg-[#283240] rounded-md transition-colors text-sm text-[#e8e6e3] text-left"
                  >
                    <Flag className="w-5 h-5 text-[#a0a6ac]" />
                    <span>Report post</span>
                  </button>
                </div>
              </div>
            );
          }

          // ODDIY POST KO'RINISHI:
          return (
            <div
              key={post._id}
              className="bg-[#1b1f23] border border-[#38434f] rounded-xl overflow-hidden text-[#e8e6e3] relative"
            >
              {/* Header */}
              <div className="p-4 flex items-start justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#283240] shrink-0">
                    <Image
                      src={authorAvatar}
                      alt={authorName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white leading-tight hover:underline cursor-pointer">
                      {authorName}
                    </h3>
                    <p className="text-xs text-[#a0a6ac] truncate max-w-70 leading-tight mt-0.5">
                      {authorTitle}
                    </p>
                  </div>
                </div>  

                {/* ... va X tugmalari */}
                <div className="flex items-center gap-1 relative post-menu-container">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(isMenuOpen ? null : post._id);
                    }}
                    className="text-[#a0a6ac] hover:text-white p-1.5 rounded-full hover:bg-[#283240] transition-colors cursor-pointer"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleHidePost(post._id)}
                    className="text-[#a0a6ac] hover:text-white p-1.5 rounded-full hover:bg-[#283240] transition-colors cursor-pointer"
                    title="Dismiss"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* ... Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="absolute right-0 top-9 w-65 bg-[#1b1f23] border border-[#38434f] rounded-xl shadow-2xl z-50 py-2 text-sm text-[#e8e6e3]">
                      <button
                        type="button"
                        onClick={() => handleToggleSave(post._id)}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-[#283240] transition-colors text-left"
                      >
                        <Bookmark
                          className={`w-5 h-5 ${isSaved ? "fill-white" : ""}`}
                        />
                        <span>{isSaved ? "Unsave" : "Save"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyLink(post._id)}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-[#283240] transition-colors text-left"
                      >
                        <LinkIcon className="w-5 h-5" />
                        <span>Copy link to post</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          alert("Embed link olingan status");
                          setActiveMenuId(null);
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-[#283240] transition-colors text-left"
                      >
                        <Code className="w-5 h-5" />
                        <span>Embed this post</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleHidePost(post._id)}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-[#283240] transition-colors text-left"
                      >
                        <UserX className="w-5 h-5" />
                        <span>Unfollow {authorName}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleHidePost(post._id)}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-[#283240] transition-colors text-left"
                      >
                        <ThumbsDown className="w-5 h-5" />
                        <span>Not interested</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          alert("Xabar berildi");
                          setActiveMenuId(null);
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-[#283240] transition-colors text-left"
                      >
                        <AlertTriangle className="w-5 h-5" />
                        <span>Seems like AI slop</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          alert("Report qilindi");
                          setActiveMenuId(null);
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-[#283240] transition-colors text-left"
                      >
                        <Flag className="w-5 h-5" />
                        <span>Report post</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="px-4 py-2 text-sm text-[#e8e6e3] whitespace-pre-line leading-relaxed">
                {post.content}
              </div>

              {/* Image */}
              {post.imageUrl && (
                <div className="relative w-full min-h-62.5 max-h-125 bg-[#111417] mt-2 overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt="Post image"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover max-h-125"
                  />
                </div>
              )}

              {/* Stats */}
              <div className="px-4 py-2 text-xs text-[#a0a6ac] flex justify-between items-center border-b border-[#283240] mt-2">
                <span>{post.likes?.length || 0} ta reaksiyalar</span>
                <span>{post.commentsCount || 0} ta izohlar</span>
              </div>

              {/* Actions */}
              <div className="px-2 py-1 flex items-center justify-between text-[#a0a6ac] text-xs font-semibold">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md hover:bg-[#283240] hover:text-white transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Like</span>
                </button>
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md hover:bg-[#283240] hover:text-white transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Comment</span>
                </button>
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md hover:bg-[#283240] hover:text-white transition-colors"
                >
                  <Repeat2 className="w-4 h-4" />
                  <span>Repost</span>
                </button>
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md hover:bg-[#283240] hover:text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          );
        })
      )}

      {/* Infinite Scroll Trigger */}
      {hasMore && (
        <div
          ref={observerTarget}
          className="py-6 flex justify-center items-center"
        >
          <Loader2 className="w-6 h-6 animate-spin text-[#a0a6ac]" />
        </div>
      )}
    </div>
  );
}
