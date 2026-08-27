import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Vote,
  Sparkles,
  Flame,
  CheckCircle2,
  ChevronRight,
  Plus,
  TrendingUp,
  Radio,
  Zap,
  Gamepad2,
  Palette,
  MessageSquare,
  Bot,
  Tv,
  Layers,
  ChevronDown,
  ChevronUp,
  Send,
  X,
  Share2,
  Award,
} from "lucide-react";
import { playPopSound } from "../utils/sound";

export interface FeatureItem {
  id: string;
  title: string;
  category: "streaming" | "gaming" | "ai" | "social" | "ui";
  description: string;
  tagline: string;
  votes: number;
  status: "in_progress" | "planned" | "under_review" | "completed";
  author: string;
  icon: any;
  accentGradient: string;
  badgeColor: string;
}

const DEFAULT_FEATURES: FeatureItem[] = [
  {
    id: "feat_turbo_stream",
    title: "V-Stream Turbo & Peer-to-Peer 4K",
    category: "streaming",
    description: "Tăng tốc tải luồng truyền hình M3U8 siêu mượt, giảm độ trễ về 0s, hỗ trợ codec 4K 60FPS mượt mà trên mọi thiết bị.",
    tagline: "Truyền hình 0s độ trễ",
    votes: 428,
    status: "in_progress",
    author: "Waves Core Team",
    icon: Zap,
    accentGradient: "from-amber-500/20 via-orange-500/20 to-red-500/20 border-amber-500/40",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  {
    id: "feat_radio_podcast",
    title: "V-Radio & Waves Podcast Studio",
    category: "streaming",
    description: "Tích hợp hơn 200+ kênh phát thanh FM/AM Việt Nam & Quốc Tế, nghe radio nền và các kênh Podcast chuyên đề.",
    tagline: "Đài phát thanh trực tuyến",
    votes: 364,
    status: "planned",
    author: "Cộng đồng đề xuất",
    icon: Radio,
    accentGradient: "from-sky-500/20 via-blue-500/20 to-indigo-500/20 border-sky-500/40",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  },
  {
    id: "feat_arcade_multiplayer",
    title: "V-Arcade Cloud Multiplayer (PvP Online)",
    category: "gaming",
    description: "Đấu Caro, Rắn săn mồi, Nối từ tiếng Việt trực tuyến với bạn bè qua hệ thống tạo mã phòng hoặc ghép trận ngẫu nhiên.",
    tagline: "Đấu game online thời gian thực",
    votes: 512,
    status: "in_progress",
    author: "Game Dev Group",
    icon: Gamepad2,
    accentGradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border-emerald-500/40",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  {
    id: "feat_watch_party",
    title: "Watch Party & Phòng Xem Chung Bạn Bè",
    category: "social",
    description: "Tạo phòng xem cùng lúc luồng TV trực tiếp với bạn bè, trò chuyện âm thanh (Voice Chat) và nhắn tin reaction sôi nổi.",
    tagline: "Xem TV đồng bộ với bạn bè",
    votes: 295,
    status: "planned",
    author: "Cộng đồng đề xuất",
    icon: MessageSquare,
    accentGradient: "from-purple-500/20 via-fuchsia-500/20 to-pink-500/20 border-purple-500/40",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  {
    id: "feat_ai_epg",
    title: "AI Smart EPG & Lịch Phát Sóng Tự Động",
    category: "ai",
    description: "Trí tuệ nhân tạo tự động nhận diện khung giờ phát sóng, tóm tắt nội dung trận bóng đá / phim truyện và đặt lịch thông báo.",
    tagline: "Lịch phát sóng thông minh AI",
    votes: 388,
    status: "under_review",
    author: "AI Research Lab",
    icon: Bot,
    accentGradient: "from-rose-500/20 via-pink-500/20 to-red-500/20 border-rose-500/40",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  },
  {
    id: "feat_custom_theme",
    title: "Custom Glass Themes & Shaders Mở Rộng",
    category: "ui",
    description: "Tự tạo phối màu Glassmorphism, điều chỉnh độ mờ kính mờ backdrop blur, hình nền động Live Canvas và font chữ yêu thích.",
    tagline: "Cá nhân hóa giao diện không giới hạn",
    votes: 310,
    status: "planned",
    author: "Design System Group",
    icon: Palette,
    accentGradient: "from-violet-500/20 via-indigo-500/20 to-blue-500/20 border-violet-500/40",
    badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  },
];

interface FeaturesVoteBannerProps {
  onNotify?: (msg: string) => void;
  className?: string;
}

export const FeaturesVoteBanner: React.FC<FeaturesVoteBannerProps> = ({
  onNotify,
  className = "",
}) => {
  const [features, setFeatures] = useState<FeatureItem[]>(() => {
    try {
      const saved = localStorage.getItem("waves_features_vote_data");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return DEFAULT_FEATURES;
  });

  const [votedIds, setVotedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("waves_user_voted_features");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return [];
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [filterTab, setFilterTab] = useState<string>("all");
  const [isProposeModalOpen, setIsProposeModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newTagline, setNewTagline] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newCategory, setNewCategory] = useState<FeatureItem["category"]>("streaming");

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem("waves_features_vote_data", JSON.stringify(features));
    } catch (e) {}
  }, [features]);

  useEffect(() => {
    try {
      localStorage.setItem("waves_user_voted_features", JSON.stringify(votedIds));
    } catch (e) {}
  }, [votedIds]);

  // Total votes
  const totalVotesCount = useMemo(() => {
    return features.reduce((acc, curr) => acc + curr.votes, 0);
  }, [features]);

  // Filtered & sorted features
  const sortedFeatures = useMemo(() => {
    let list = [...features];
    if (filterTab === "in_progress") {
      list = list.filter((f) => f.status === "in_progress");
    } else if (filterTab === "planned") {
      list = list.filter((f) => f.status === "planned");
    } else if (filterTab === "top") {
      list.sort((a, b) => b.votes - a.votes);
      return list;
    }
    // Default sort: highest votes first
    list.sort((a, b) => b.votes - a.votes);
    return list;
  }, [features, filterTab]);

  // Highest voted feature
  const topFeature = useMemo(() => {
    return [...features].sort((a, b) => b.votes - a.votes)[0];
  }, [features]);

  // Handle vote click
  const handleVote = (featId: string) => {
    playPopSound();
    const hasVoted = votedIds.includes(featId);

    if (hasVoted) {
      // Unvote
      setVotedIds((prev) => prev.filter((id) => id !== featId));
      setFeatures((prev) =>
        prev.map((f) => (f.id === featId ? { ...f, votes: Math.max(0, f.votes - 1) } : f))
      );
      onNotify?.("Đã hủy lượt bình chọn cho tính năng.");
    } else {
      // Vote
      setVotedIds((prev) => [...prev, featId]);
      setFeatures((prev) =>
        prev.map((f) => (f.id === featId ? { ...f, votes: f.votes + 1 } : f))
      );
      const targetFeat = features.find((f) => f.id === featId);
      onNotify?.(`🎉 Đã bình chọn thành công cho "${targetFeat?.title || "Tính năng"}"!`);
    }
  };

  // Handle submit custom proposal
  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      onNotify?.("Vui lòng nhập tên tính năng đề xuất!");
      return;
    }

    playPopSound();
    const newFeat: FeatureItem = {
      id: `feat_${Date.now()}`,
      title: newTitle.trim(),
      tagline: newTagline.trim() || "Đề xuất mới từ cộng đồng",
      description: newDescription.trim() || "Tính năng được đóng góp và đề xuất bởi người dùng Waves.",
      category: newCategory,
      votes: 1,
      status: "under_review",
      author: "Bạn (Đề xuất)",
      icon: Sparkles,
      accentGradient: "from-fuchsia-500/20 via-purple-500/20 to-pink-500/20 border-fuchsia-500/40",
      badgeColor: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
    };

    setFeatures((prev) => [newFeat, ...prev]);
    setVotedIds((prev) => [...prev, newFeat.id]);
    setIsProposeModalOpen(false);
    setNewTitle("");
    setNewTagline("");
    setNewDescription("");

    onNotify?.("✨ Đề xuất tính năng mới của bạn đã được ghi nhận vào bảng bình chọn!");
  };

  const getStatusBadge = (status: FeatureItem["status"]) => {
    switch (status) {
      case "in_progress":
        return {
          label: "Đang phát triển",
          badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        };
      case "planned":
        return {
          label: "Đã lên kế hoạch",
          badgeClass: "bg-sky-500/20 text-sky-300 border-sky-500/30",
        };
      case "under_review":
        return {
          label: "Đang xét duyệt",
          badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        };
      case "completed":
        return {
          label: "Đã ra mắt",
          badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        };
    }
  };

  return (
    <div
      id="waves-features-vote-banner"
      className={`relative w-full rounded-3xl bg-white/[0.08] backdrop-blur-[24px] saturate-[180%] border border-white/20 shadow-[0_12px_40px_0_rgba(0,0,0,0.35),inset_0.5px_0.5px_0px_rgba(255,255,255,0.4)] p-5 sm:p-7 md:p-8 text-left text-white overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Dynamic ambient background glow orbs */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-16 -translate-y-1/2 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/3 w-60 h-60 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Header & Hero Controls */}
      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Title & Description */}
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-indigo-500 p-0.5 shadow-lg shadow-fuchsia-500/30 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#171228] rounded-[14px] flex items-center justify-center">
                  <Vote className="w-5 h-5 text-fuchsia-300 animate-pulse" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-fuchsia-200">
                Bình Chọn Tính Năng Mới
              </h2>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-200 flex items-center gap-1 shadow-sm">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Community Roadmap</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-sans">
              Cùng quyết định lộ trình phát triển của hệ sinh thái <strong>Waves</strong> & <strong>V-Play</strong>!
              Bình chọn tính năng bạn yêu thích nhất hoặc trực tiếp gửi ý tưởng mới.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap self-start lg:self-center">
            {/* Propose Feature Button */}
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setIsProposeModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[0_4px_20px_rgba(217,70,239,0.35),inset_0.5px_0.5px_0px_rgba(255,255,255,0.4)] transition-all cursor-pointer active:scale-95 border border-white/20"
            >
              <Plus className="w-4 h-4" />
              <span>Đề xuất tính năng</span>
            </button>

            {/* Collapse/Expand Toggle */}
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setIsExpanded(!isExpanded);
              }}
              className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              <span>{isExpanded ? "Thu gọn" : "Mở rộng"}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Global Voting Stats Bar & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs text-white/70 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Tổng phiếu:</span>
              <strong className="text-white font-bold text-sm">
                {totalVotesCount.toLocaleString()}
              </strong>
            </div>
            <div className="h-3 w-px bg-white/20" />
            <div>
              <span>Đang dẫn đầu:</span>{" "}
              <strong className="text-fuchsia-300 font-semibold">
                {topFeature?.title.slice(0, 24)}... ({topFeature?.votes} vote)
              </strong>
            </div>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: "all", label: "Tất cả (" + features.length + ")" },
              { id: "in_progress", label: "Đang phát triển" },
              { id: "planned", label: "Đã lên kế hoạch" },
              { id: "top", label: "Nhiều vote nhất ★" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playPopSound();
                  setFilterTab(tab.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  filterTab === tab.id
                    ? "bg-white/25 text-white border border-white/30 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.5)]"
                    : "bg-white/5 text-white/65 hover:bg-white/15 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Features Interactive Grid */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-3 overflow-hidden"
            >
              {sortedFeatures.map((feat, idx) => {
                const IconComponent = feat.icon;
                const hasVoted = votedIds.includes(feat.id);
                const statusMeta = getStatusBadge(feat.status);
                const percent = Math.min(
                  100,
                  Math.round((feat.votes / (totalVotesCount || 1)) * 100)
                );

                return (
                  <div
                    key={feat.id}
                    className={`group relative rounded-2xl p-5 bg-gradient-to-br ${feat.accentGradient} backdrop-blur-[20px] saturate-[160%] border flex flex-col justify-between shadow-[0_8px_24px_rgba(0,0,0,0.2),inset_0.5px_0.5px_0px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-[1.02] hover:border-white/40 ${
                      hasVoted
                        ? "ring-2 ring-fuchsia-400/50 border-fuchsia-400/60"
                        : "border-white/15"
                    }`}
                  >
                    {/* Top Feature Tag & Rank */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform">
                            <IconComponent className="w-5 h-5 text-white drop-shadow" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">
                              {feat.tagline}
                            </span>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${statusMeta.badgeClass}`}
                            >
                              {statusMeta.label}
                            </span>
                          </div>
                        </div>

                        {/* Vote count pill */}
                        <div className="text-right">
                          <div className="flex items-center gap-1 font-black text-base text-white">
                            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span>{feat.votes}</span>
                          </div>
                          <span className="text-[10px] text-white/50 font-mono">
                            {percent}% tỷ lệ
                          </span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-bold text-base text-white tracking-tight group-hover:text-fuchsia-200 transition-colors mb-1.5 leading-snug">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-white/70 leading-relaxed line-clamp-3 font-sans">
                        {feat.description}
                      </p>
                    </div>

                    {/* Bottom Progress & Vote Action Button */}
                    <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
                      {/* Mini visual progress bar */}
                      <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-fuchsia-500 to-indigo-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, percent * 2.5)}%` }}
                        />
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-white/50 truncate max-w-[130px]">
                          Bởi: {feat.author}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleVote(feat.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-md ${
                            hasVoted
                              ? "bg-fuchsia-500 hover:bg-fuchsia-400 text-white shadow-fuchsia-500/30 border border-fuchsia-300"
                              : "bg-white/15 hover:bg-white/25 text-white border border-white/20 shadow-inner"
                          }`}
                        >
                          {hasVoted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Đã bình chọn</span>
                            </>
                          ) : (
                            <>
                              <Vote className="w-3.5 h-3.5 text-fuchsia-300" />
                              <span>Bình chọn (+1)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PROPOSE NEW FEATURE MODAL */}
      <AnimatePresence>
        {isProposeModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#181226]/95 border border-white/20 rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl flex flex-col gap-4 text-left relative overflow-hidden"
            >
              {/* Decorative glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-400/30 flex items-center justify-center text-fuchsia-300">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Đề Xuất Tính Năng Mới</h3>
                    <p className="text-xs text-white/60">Gửi ý tưởng của bạn cho cộng đồng Waves</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProposeModalOpen(false)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmitProposal} className="space-y-4">
                {/* Feature Name */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Tên tính năng đề xuất <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="VD: Chế độ Picture-in-Picture Mini Player..."
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-fuchsia-400 focus:bg-white/15 transition-all"
                  />
                </div>

                {/* Tagline / Subtitle */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Khẩu hiệu ngắn gọn (Tagline)
                  </label>
                  <input
                    type="text"
                    value={newTagline}
                    onChange={(e) => setNewTagline(e.target.value)}
                    placeholder="VD: Cửa sổ thu nhỏ phát video mọi nơi..."
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-fuchsia-400 focus:bg-white/15 transition-all"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Danh mục tính năng
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "streaming", label: "Truyền hình / Media" },
                      { id: "gaming", label: "Game / V-Arcade" },
                      { id: "ai", label: "Trí tuệ AI" },
                      { id: "social", label: "Cộng đồng / Chat" },
                      { id: "ui", label: "Giao diện / UI" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setNewCategory(cat.id as any)}
                        className={`p-2 rounded-xl text-[11px] font-semibold text-center border transition-all cursor-pointer ${
                          newCategory === cat.id
                            ? "bg-fuchsia-500/30 border-fuchsia-400 text-white"
                            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detailed Description */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Mô tả chi tiết & Cách thức hoạt động
                  </label>
                  <textarea
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Mô tả trải nghiệm người dùng, lợi ích và tính năng cụ thể mà bạn mong muốn..."
                    className="w-full bg-white/10 border border-white/15 rounded-xl p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-fuchsia-400 focus:bg-white/15 transition-all resize-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsProposeModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-fuchsia-600/30 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi Đề Xuất</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
