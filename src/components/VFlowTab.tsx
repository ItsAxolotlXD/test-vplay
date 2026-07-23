import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Crown,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  Image,
  Video,
  Sparkles,
  Lock,
  Search,
  MoreHorizontal,
  Flame,
  X,
  Plus,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  Globe,
  Film
} from "lucide-react";
import { VerifiedSubState } from "./VerifiedTab";

interface VFlowTabProps {
  onBack: () => void;
  verifiedSub: VerifiedSubState;
  onNavigateToTab: (tab: string) => void;
  vCoins: number;
  setVCoins: React.Dispatch<React.SetStateAction<number>>;
}

export interface VFlowComment {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  isVerified: boolean;
  verifiedType?: "verified" | "verified_plus";
  text: string;
  time: string;
  likes: number;
  isLiked?: boolean;
}

export interface VFlowPost {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  isVerified: boolean;
  verifiedType?: "verified" | "verified_plus";
  time: string;
  content: string;
  tag?: string;
  imageUrl?: string;
  videoUrl?: string;
  likes: number;
  isLiked?: boolean;
  shares: number;
  comments: VFlowComment[];
  isBookmarked?: boolean;
}

const INITIAL_POSTS: VFlowPost[] = [
  {
    id: "post-1",
    author: "Vplay Sports",
    handle: "@vplay_sports",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    isVerified: true,
    verifiedType: "verified_plus",
    time: "10 phút trước",
    content: "🔥 Siêu kinh điển Ngoại Hạng Anh tối nay đã sẵn sàng trên kênh Vplay Sports 1 HD! Anh em bắt kèo đội nào thắng? Tốc độ phát 4K Ultra HD trên Server VIP mượt căng đét nhé!",
    tag: "BóngĐá",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1000&auto=format&fit=crop&q=80",
    likes: 342,
    isLiked: false,
    shares: 48,
    comments: [
      {
        id: "c-1",
        author: "Trần Minh Hoàn",
        handle: "@hoan_vplay",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        isVerified: true,
        verifiedType: "verified",
        text: "Kênh phát mượt lắm ad ơi, 4K sắc nét không delay giây nào!",
        time: "5 phút trước",
        likes: 12,
      },
      {
        id: "c-2",
        author: "Phạm Thu Hà",
        handle: "@thuha_vtv",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        isVerified: true,
        verifiedType: "verified_plus",
        text: "Arsenal win 2-1 chắc chắn luôn 🔥",
        time: "2 phút trước",
        likes: 8,
      }
    ]
  },
  {
    id: "post-2",
    author: "Minh Tuấn Cinema",
    handle: "@minhtuan_movie",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    isVerified: true,
    verifiedType: "verified",
    time: "45 phút trước",
    content: "Vừa xem xong bộ phim chiếu rạp mới trên mục V-Box của ứng dụng Vplay. Chất lượng âm thanh vòm Dolby Atmos cực đỉnh. Anh em Verified nhớ trải nghiệm tính năng này nhé!",
    tag: "PhimẢnh",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1000&auto=format&fit=crop&q=80",
    likes: 189,
    isLiked: true,
    shares: 19,
    comments: [
      {
        id: "c-3",
        author: "Hoàng Yến",
        handle: "@hoangyen_vplay",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        isVerified: true,
        verifiedType: "verified",
        text: "Chuẩn luôn bác ơi, mở loa ngoài nghe sống động như rạp!",
        time: "20 phút trước",
        likes: 5,
      }
    ]
  },
  {
    id: "post-3",
    author: "Vplay Official",
    handle: "@vplay_official",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    isVerified: true,
    verifiedType: "verified_plus",
    time: "2 giờ trước",
    content: "✨ CHÍNH THỨC RA MẮT MẠNG XÃ HỘI V-FLOW CHO HỘI VIÊN VERIFIED!\n\nTự do đăng bài viết, chia sẻ hình ảnh, khoảnh khắc video và giao lưu cùng cộng đồng Vplay VIP. Đừng quên điểm danh hàng ngày để tích lũy V-coins nhận gói Verified 100% miễn phí!",
    tag: "VplayUpdate",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&auto=format&fit=crop&q=80",
    likes: 890,
    isLiked: false,
    shares: 154,
    comments: []
  }
];

export default function VFlowTab({
  onBack,
  verifiedSub,
  onNavigateToTab,
  vCoins,
  setVCoins
}: VFlowTabProps) {
  const isVerifiedUser = verifiedSub.plan !== "none";
  const [demoMode, setDemoMode] = useState<boolean>(false);

  // Posts State
  const [posts, setPosts] = useState<VFlowPost[]>(() => {
    const saved = localStorage.getItem("vplay_vflow_posts");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_POSTS;
  });

  useEffect(() => {
    localStorage.setItem("vplay_vflow_posts", JSON.stringify(posts));
  }, [posts]);

  // Composer States
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const [newPostTag, setNewPostTag] = useState("VplayLive");
  const [showImageInput, setShowImageInput] = useState(false);

  // Filter & Search
  const [filterTag, setFilterTag] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Comment Drawer State per post
  const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");

  // Notification Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  // Handle Post Creation
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    if (!isVerifiedUser && !demoMode) {
      showToast("Chỉ tài khoản Verified mới có thể đăng bài viết!");
      return;
    }

    const newPost: VFlowPost = {
      id: "post-" + Date.now(),
      author: verifiedSub.plan === "verified_plus" ? "Vplay Royal VIP" : "Vplay Verified Member",
      handle: "@user_verified",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      isVerified: true,
      verifiedType: verifiedSub.plan === "verified_plus" ? "verified_plus" : "verified",
      time: "Vừa xong",
      content: newPostText,
      tag: newPostTag,
      imageUrl: newPostImage.trim() || undefined,
      likes: 1,
      isLiked: true,
      shares: 0,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostText("");
    setNewPostImage("");
    setShowImageInput(false);
    showToast("Đã đăng bài viết thành công lên V-Flow!");
  };

  // Like Toggle
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newLiked = !p.isLiked;
          return {
            ...p,
            isLiked: newLiked,
            likes: newLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  // Bookmark Toggle
  const handleToggleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newBm = !p.isBookmarked;
          if (newBm) showToast("Đã lưu bài viết vào danh sách yêu thích!");
          return { ...p, isBookmarked: newBm };
        }
        return p;
      })
    );
  };

  // Add Comment
  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;

    const newComment: VFlowComment = {
      id: "c-" + Date.now(),
      author: verifiedSub.plan === "verified_plus" ? "Royal Member" : "Verified Member",
      handle: "@me_verified",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      isVerified: true,
      verifiedType: verifiedSub.plan === "verified_plus" ? "verified_plus" : "verified",
      text: commentInput,
      time: "Vừa xong",
      likes: 0,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );

    setCommentInput("");
  };

  // Filtered Posts
  const filteredPosts = posts.filter((p) => {
    const matchesTag =
      filterTag === "all"
        ? true
        : filterTag === "hot"
        ? p.likes > 200
        : filterTag === "media"
        ? !!p.imageUrl
        : p.tag === filterTag;

    const matchesSearch =
      searchQuery === ""
        ? true
        : p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.handle.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTag && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-[#08090c] text-white p-3 sm:p-6 md:p-8 font-sans relative overflow-x-hidden">
      {/* Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-amber-500/10 via-yellow-600/5 to-transparent blur-[120px] pointer-events-none -z-0" />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[99999] bg-gradient-to-r from-amber-400 to-yellow-300 text-black px-5 py-3 rounded-2xl shadow-2xl font-black text-xs flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 fill-black" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="max-w-4xl mx-auto flex items-center justify-between pb-6 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400 flex items-center justify-center transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-5 h-5 text-amber-300 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
                V-Flow Community
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] font-black text-amber-300 uppercase">
                VERIFIED ONLY
              </span>
            </div>
            <p className="text-xs text-zinc-400">Mạng xã hội truyền hình & giải trí chuẩn VIP</p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2">
          {isVerifiedUser ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 text-xs font-extrabold">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400/20 shrink-0" />
              <span className="hidden sm:inline">Tài Khoản Verified VIP</span>
            </div>
          ) : (
            <button
              onClick={() => onNavigateToTab("verified")}
              className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 text-black text-xs font-black shadow-lg hover:from-amber-300 hover:to-yellow-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Crown className="w-4 h-4 fill-black" />
              <span>Nâng Cấp Verified</span>
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-4xl mx-auto py-6 space-y-6 relative z-10">

        {/* LOCKED SCREEN BANNER IF NOT VERIFIED & NOT IN DEMO MODE */}
        {!isVerifiedUser && !demoMode && (
          <div className="relative rounded-3xl bg-gradient-to-b from-amber-950/60 via-zinc-950 to-zinc-950 border-2 border-amber-500/60 p-6 sm:p-10 shadow-[0_10px_50px_rgba(245,158,11,0.25)] text-center space-y-6 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />
            
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center mx-auto text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)] animate-pulse">
              <Lock className="w-9 h-9" />
            </div>

            <div className="max-w-lg mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold uppercase">
                <BadgeCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Đặc Quyền Dành Cho Hội Viên Verified VIP</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Mở Khóa Mạng Xã Hội V-Flow
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                V-Flow là không gian mạng xã hội độc quyền nơi các Hội viên Verified Vplay tự do đăng bài viết, thảo luận các trận bóng đá, chia sẻ khoảnh khắc video ngắn và tương tác trực tiếp cùng cộng đồng VIP.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
              <button
                onClick={() => onNavigateToTab("verified")}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-black font-black text-sm shadow-[0_10px_30px_rgba(245,158,11,0.4)] transition-all transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
              >
                <Crown className="w-5 h-5 fill-black" />
                <span>Nâng Cấp Verified (Dùng V-pearls Free)</span>
              </button>

              <button
                onClick={() => setDemoMode(true)}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-zinc-200 font-extrabold text-xs border border-white/10 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Xem Thử Demo V-Flow</span>
              </button>
            </div>
          </div>
        )}

        {/* FEED & COMPOSER (SHOW IF VERIFIED OR DEMO MODE) */}
        {(isVerifiedUser || demoMode) && (
          <>
            {demoMode && !isVerifiedUser && (
              <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Bạn đang ở chế độ Xem Thử Demo V-Flow. Nâng cấp Verified để mở khóa tài khoản chính thức.</span>
                </div>
                <button
                  onClick={() => onNavigateToTab("verified")}
                  className="px-3 py-1 rounded-xl bg-amber-400 text-black font-black text-[11px] hover:bg-amber-300 cursor-pointer shrink-0"
                >
                  Nâng Cấp VIP
                </button>
              </div>
            )}

            {/* CREATE POST COMPOSER BOX */}
            <div className="rounded-3xl bg-zinc-950/90 border border-white/10 p-4 sm:p-5 shadow-xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-black">
                    <BadgeCheck className="w-3 h-3 fill-black text-amber-400" />
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <textarea
                    rows={2}
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder="Bạn đang nghĩ gì về các kênh truyền hình & bộ phim Vplay hôm nay?"
                    className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none resize-none"
                  />

                  {/* Image URL preview input if toggled */}
                  {showImageInput && (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900 border border-white/10">
                      <Image className="w-4 h-4 text-zinc-400 shrink-0" />
                      <input
                        type="url"
                        value={newPostImage}
                        onChange={(e) => setNewPostImage(e.target.value)}
                        placeholder="Dán URL hình ảnh (https://...)"
                        className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowImageInput(false)}
                        className="text-zinc-500 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Attachment Bar & Submit Button */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowImageInput(!showImageInput)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          showImageInput
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : "bg-white/5 hover:bg-white/10 text-zinc-300"
                        }`}
                      >
                        <Image className="w-4 h-4 text-emerald-400" />
                        <span>Đính ảnh</span>
                      </button>

                      {/* Tag selector */}
                      <select
                        value={newPostTag}
                        onChange={(e) => setNewPostTag(e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-amber-300 border border-white/10 focus:outline-none cursor-pointer"
                      >
                        <option value="VplayLive" className="bg-zinc-900 text-white">#VplayLive</option>
                        <option value="BóngĐá" className="bg-zinc-900 text-white">#BóngĐá</option>
                        <option value="PhimẢnh" className="bg-zinc-900 text-white">#PhimẢnh</option>
                        <option value="CongDong" className="bg-zinc-900 text-white">#CongDong</option>
                        <option value="Anime" className="bg-zinc-900 text-white">#Anime</option>
                      </select>
                    </div>

                    <button
                      onClick={handleCreatePost}
                      disabled={!newPostText.trim()}
                      className={`px-5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                        newPostText.trim()
                          ? "bg-gradient-to-r from-amber-400 to-yellow-300 text-black shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95"
                          : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Đăng Bài</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* FILTER & SEARCH BAR */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
                <button
                  onClick={() => setFilterTag("all")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    filterTag === "all"
                      ? "bg-amber-500 text-black font-extrabold shadow-md"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilterTag("hot")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                    filterTag === "hot"
                      ? "bg-amber-500 text-black font-extrabold shadow-md"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Xu hướng</span>
                </button>
                <button
                  onClick={() => setFilterTag("media")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    filterTag === "media"
                      ? "bg-amber-500 text-black font-extrabold shadow-md"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  Hình ảnh
                </button>
                <button
                  onClick={() => setFilterTag("BóngĐá")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    filterTag === "BóngĐá"
                      ? "bg-amber-500 text-black font-extrabold shadow-md"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  #BóngĐá
                </button>
                <button
                  onClick={() => setFilterTag("PhimẢnh")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    filterTag === "PhimẢnh"
                      ? "bg-amber-500 text-black font-extrabold shadow-md"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  #PhimẢnh
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-60 shrink-0">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm bài viết..."
                  className="w-full bg-zinc-900/90 border border-white/10 pl-9 pr-3 py-1.5 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
            </div>

            {/* POSTS LIST */}
            <div className="space-y-5">
              {filteredPosts.length === 0 ? (
                <div className="py-12 text-center rounded-3xl bg-zinc-950/60 border border-white/5 text-zinc-500 space-y-2">
                  <MessageSquare className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-sm font-bold">Không tìm thấy bài viết nào phù hợp</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-3xl bg-zinc-950/90 border border-white/10 p-5 shadow-xl space-y-4 hover:border-amber-500/30 transition-all"
                  >
                    {/* Post Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.avatar}
                          alt={post.author}
                          className="w-10 h-10 rounded-full object-cover border border-amber-400/50"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-sm text-white">{post.author}</span>
                            {post.isVerified && (
                              post.verifiedType === "verified_plus" ? (
                                <Crown className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" title="Verified PLUS Royal Member" />
                              ) : (
                                <BadgeCheck className="w-4 h-4 text-amber-400 fill-amber-400/20 shrink-0" title="Verified Member" />
                              )
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                            <span>{post.handle}</span>
                            <span>•</span>
                            <span>{post.time}</span>
                          </div>
                        </div>
                      </div>

                      {post.tag && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                          #{post.tag}
                        </span>
                      )}
                    </div>

                    {/* Post Body */}
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>

                    {/* Post Media */}
                    {post.imageUrl && (
                      <div className="rounded-2xl overflow-hidden border border-white/10 max-h-[400px] bg-black">
                        <img
                          src={post.imageUrl}
                          alt="Post attachment"
                          className="w-full h-full object-cover hover:scale-105 transition duration-500"
                        />
                      </div>
                    )}

                    {/* Engagement Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-zinc-400">
                      <div className="flex items-center gap-4">
                        {/* Like Button */}
                        <button
                          onClick={() => handleToggleLike(post.id)}
                          className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                            post.isLiked ? "text-red-400 font-extrabold" : "hover:text-white"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${post.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                          <span>{post.likes}</span>
                        </button>

                        {/* Comment Button */}
                        <button
                          onClick={() => setOpenCommentPostId(openCommentPostId === post.id ? null : post.id)}
                          className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                            openCommentPostId === post.id ? "text-amber-300 font-bold" : "hover:text-white"
                          }`}
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments.length}</span>
                        </button>

                        {/* Share Button */}
                        <button
                          onClick={() => showToast("Đã sao chép liên kết bài viết!")}
                          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>{post.shares}</span>
                        </button>
                      </div>

                      {/* Bookmark */}
                      <button
                        onClick={() => handleToggleBookmark(post.id)}
                        className={`transition-colors cursor-pointer ${
                          post.isBookmarked ? "text-amber-400 fill-amber-400" : "hover:text-white"
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${post.isBookmarked ? "fill-amber-400 text-amber-400" : ""}`} />
                      </button>
                    </div>

                    {/* COMMENT DRAWER / PANEL */}
                    {openCommentPostId === post.id && (
                      <div className="pt-4 border-t border-white/10 space-y-3">
                        {/* Comments List */}
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                          {post.comments.length === 0 ? (
                            <div className="text-center py-4 text-xs text-zinc-500">
                              Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                            </div>
                          ) : (
                            post.comments.map((comment) => (
                              <div key={comment.id} className="flex items-start gap-2.5 bg-zinc-900/60 p-3 rounded-2xl border border-white/5">
                                <img
                                  src={comment.avatar}
                                  alt={comment.author}
                                  className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                                />
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                      <span className="font-extrabold text-xs text-white">{comment.author}</span>
                                      {comment.isVerified && (
                                        <BadgeCheck className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                                      )}
                                    </div>
                                    <span className="text-[10px] text-zinc-500">{comment.time}</span>
                                  </div>
                                  <p className="text-xs text-zinc-300">{comment.text}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Comment Input */}
                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="text"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                            placeholder="Viết bình luận..."
                            className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            disabled={!commentInput.trim()}
                            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                ))
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
