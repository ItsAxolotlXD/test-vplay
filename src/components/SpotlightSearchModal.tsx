import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  X,
  Mic,
  Tv,
  Sparkles,
  Gamepad2,
  Crown,
  Megaphone,
  Check,
  ChevronRight,
  Sliders,
  Radio,
  ExternalLink,
  Layers,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playPopSound } from "../utils/sound";
import { Channel } from "../data/channels";

export interface SpotlightSearchResultsData {
  navTabs: Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    category: string;
    action: () => void;
  }>;
  vapps: Array<{
    id: string;
    title: string;
    category: string;
    subCategory: string;
    badge: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    action: () => void;
  }>;
  vpremium: Array<{
    id: string;
    title: string;
    category: string;
    subCategory: string;
    badge: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    action: () => void;
  }>;
  toolbox: Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    action: () => void;
  }>;
  settings: Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    action: () => void;
  }>;
  news: Array<{
    id: string;
    title: string;
    excerpt: string;
    category?: string;
  }>;
  channels: Channel[];
  total: number;
}

interface SpotlightSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (val: string) => void;
  results: SpotlightSearchResultsData;
  isAllDisabled: boolean;
  onOpenSettings: () => void;
  triggerToast: (msg: string) => void;
  onSelectNews?: (id: string, title: string) => void;
  onSelectChannel?: (ch: Channel) => void;
  selectedChannelId?: string;
}

export const SpotlightSearchModal: React.FC<SpotlightSearchModalProps> = ({
  isOpen,
  onClose,
  query,
  onQueryChange,
  results,
  isAllDisabled,
  onOpenSettings,
  triggerToast,
  onSelectNews,
  onSelectChannel,
  selectedChannelId,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeFilterTab, setActiveFilterTab] = useState<string>("all");

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Voice Search Handler
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "vi-VN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      triggerToast("Đang lắng nghe...");
      recognition.start();
      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        const prefix = query.trim() ? query.trim() + " " : "";
        onQueryChange(prefix + speechResult);
        triggerToast("Đã nhập: " + speechResult);
      };
      recognition.onerror = (event: any) => {
        triggerToast("Lỗi nhận diện: " + event.error);
      };
    } else {
      triggerToast("Trình duyệt không hỗ trợ nhận diện giọng nói");
    }
  };

  if (!isOpen) return null;

  const q = query.trim();
  const { navTabs, vapps, vpremium, toolbox, settings, news, channels, total } = results;

  // Filtered by Category Tab
  const showNav = (activeFilterTab === "all" || activeFilterTab === "nav") && navTabs.length > 0;
  const showVApps = (activeFilterTab === "all" || activeFilterTab === "vapps") && vapps.length > 0;
  const showVPrem = (activeFilterTab === "all" || activeFilterTab === "vprem") && vpremium.length > 0;
  const showToolbox = (activeFilterTab === "all" || activeFilterTab === "toolbox") && toolbox.length > 0;
  const showSettings = (activeFilterTab === "all" || activeFilterTab === "settings") && settings.length > 0;
  const showNews = (activeFilterTab === "all" || activeFilterTab === "news") && news.length > 0;
  const showChannels = (activeFilterTab === "all" || activeFilterTab === "channels") && channels.length > 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-start justify-center pt-10 sm:pt-16 md:pt-20 px-3 sm:px-4">
        {/* Backdrop Overlay with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
          onClick={onClose}
        />

        {/* Modal Window in Modern Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -24 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl rounded-3xl bg-[#14121a]/95 backdrop-blur-3xl border border-white/20 p-4 sm:p-5 shadow-[0_24px_70px_rgba(0,0,0,0.85),inset_0.5px_0.5px_0px_rgba(255,255,255,0.4)] text-white font-sans flex flex-col gap-3.5 max-h-[86vh]"
        >
          {/* Top Search Input Row */}
          <div className="relative flex items-center w-full">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-white/50">
              <Search className="w-5 h-5" />
            </div>

            <input
              ref={inputRef}
              type="text"
              placeholder="Spotlight Search (V-Play, V-Apps, Games, V-Premium, Tiện ích, Tin tức...)"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="w-full pl-12 pr-28 py-3 rounded-2xl bg-white/[0.08] border border-white/20 text-sm font-semibold text-white placeholder-white/40 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.25)] focus:outline-none focus:bg-white/[0.12] focus:border-white/30 transition-all text-left"
            />

            {/* Right Action Buttons inside Search Bar */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    onQueryChange("");
                    inputRef.current?.focus();
                  }}
                  className="w-7 h-7 rounded-xl hover:bg-white/15 flex items-center justify-center text-white/50 hover:text-white transition-all cursor-pointer"
                  title="Xóa tìm kiếm"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  playPopSound();
                  handleVoiceSearch();
                }}
                className="w-7 h-7 rounded-xl hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
                title="Tìm kiếm bằng giọng nói"
              >
                <Mic className="w-4 h-4 text-orange-400" />
              </button>

              <div className="hidden sm:flex items-center px-2 py-1 rounded-lg bg-white/10 border border-white/15 text-[10px] font-mono text-white/60 select-none">
                ESC
              </div>
            </div>
          </div>

          {/* Quick Filter Category Chips */}
          {q && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs select-none">
              <button
                type="button"
                onClick={() => {
                  playPopSound();
                  setActiveFilterTab("all");
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 border ${
                  activeFilterTab === "all"
                    ? "bg-white/25 text-white border-white/40 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.4)]"
                    : "bg-white/5 text-white/60 hover:text-white border-white/10"
                }`}
              >
                Tất cả ({total})
              </button>

              {navTabs.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setActiveFilterTab("nav");
                  }}
                  className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 border ${
                    activeFilterTab === "nav"
                      ? "bg-rose-500/30 text-rose-200 border-rose-400/50"
                      : "bg-rose-500/10 text-rose-300/70 hover:text-rose-200 border-rose-500/20"
                  }`}
                >
                  Danh mục ({navTabs.length})
                </button>
              )}

              {vapps.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setActiveFilterTab("vapps");
                  }}
                  className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 border ${
                    activeFilterTab === "vapps"
                      ? "bg-emerald-500/30 text-emerald-200 border-emerald-400/50"
                      : "bg-emerald-500/10 text-emerald-300/70 hover:text-emerald-200 border-emerald-500/20"
                  }`}
                >
                  V-Apps & Games ({vapps.length})
                </button>
              )}

              {vpremium.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setActiveFilterTab("vprem");
                  }}
                  className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 border ${
                    activeFilterTab === "vprem"
                      ? "bg-amber-500/30 text-amber-200 border-amber-400/50"
                      : "bg-amber-500/10 text-amber-300/70 hover:text-amber-200 border-amber-500/20"
                  }`}
                >
                  V-Premium ({vpremium.length})
                </button>
              )}

              {channels.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setActiveFilterTab("channels");
                  }}
                  className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 border ${
                    activeFilterTab === "channels"
                      ? "bg-blue-500/30 text-blue-200 border-blue-400/50"
                      : "bg-blue-500/10 text-blue-300/70 hover:text-blue-200 border-blue-500/20"
                  }`}
                >
                  V-Play Kênh ({channels.length})
                </button>
              )}

              {toolbox.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setActiveFilterTab("toolbox");
                  }}
                  className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 border ${
                    activeFilterTab === "toolbox"
                      ? "bg-purple-500/30 text-purple-200 border-purple-400/50"
                      : "bg-purple-500/10 text-purple-300/70 hover:text-purple-200 border-purple-500/20"
                  }`}
                >
                  Tiện ích ({toolbox.length})
                </button>
              )}

              {settings.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setActiveFilterTab("settings");
                  }}
                  className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 border ${
                    activeFilterTab === "settings"
                      ? "bg-sky-500/30 text-sky-200 border-sky-400/50"
                      : "bg-sky-500/10 text-sky-300/70 hover:text-sky-200 border-sky-500/20"
                  }`}
                >
                  Cài đặt ({settings.length})
                </button>
              )}

              {news.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setActiveFilterTab("news");
                  }}
                  className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 border ${
                    activeFilterTab === "news"
                      ? "bg-amber-500/30 text-amber-200 border-amber-400/50"
                      : "bg-amber-500/10 text-amber-300/70 hover:text-amber-200 border-amber-500/20"
                  }`}
                >
                  Tin tức ({news.length})
                </button>
              )}
            </div>
          )}

          {/* Results Container */}
          <div className="flex-1 max-h-[55vh] overflow-y-auto custom-scrollbar pr-1.5 flex flex-col gap-2">
            {isAllDisabled ? (
              <div className="py-10 px-4 text-center space-y-3 font-sans">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300">
                  <Sliders className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Tất cả mục tìm kiếm đang bị tắt</h4>
                <p className="text-xs text-white/60 max-w-sm mx-auto leading-relaxed">
                  Spotlight Search không thể hiển thị kết quả do bạn đã tắt tất cả các tùy chọn hiển thị.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    onClose();
                    onOpenSettings();
                  }}
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-sky-500/30"
                >
                  Mở Cài Đặt Tìm Kiếm
                </button>
              </div>
            ) : !q ? (
              <div className="py-8 px-4 text-center space-y-4 font-sans">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-white/70 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Gợi ý tìm kiếm nhanh</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
                  {[
                    "V-Play",
                    "V-Apps",
                    "V-Arcade Games",
                    "V-Bank",
                    "V-Cloud VIP",
                    "Cài đặt giao diện",
                    "VTV3",
                    "K+ Sport",
                    "Tin tức",
                  ].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => {
                        playPopSound();
                        onQueryChange(sug);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/15 border border-white/15 text-xs text-white/80 hover:text-white transition-all cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-white/40">
                  Gõ từ khóa bất kỳ để tìm kiếm trực tiếp trong kho nội dung hệ thống.
                </p>
              </div>
            ) : total === 0 ? (
              <div className="py-12 px-4 text-center space-y-2 text-white/50 text-xs font-sans">
                <p>Không tìm thấy kết quả nào phù hợp với &quot;<strong className="text-white">{q}</strong>&quot;</p>
                <p className="text-[11px] text-white/30">Thử tìm kiếm với từ khóa khác như tên kênh, ứng dụng, hoặc cài đặt.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {/* 1. DANH MỤC & ĐIỀU HƯỚNG */}
                {showNav && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-3 py-1 text-[11px] font-extrabold tracking-wider text-rose-400 uppercase font-montserrat">
                      <span>Danh mục & Điều hướng</span>
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-mono">
                        {navTabs.length}
                      </span>
                    </div>
                    {navTabs.map((tab) => {
                      const IconComp = tab.icon;
                      return (
                        <button
                          key={"nav-" + tab.id}
                          onClick={() => {
                            playPopSound();
                            tab.action();
                            onClose();
                          }}
                          className="w-full px-3 py-2.5 rounded-2xl text-left text-xs bg-white/[0.04] hover:bg-white/[0.12] text-white/90 hover:text-white transition-all flex items-center justify-between group gap-2.5 cursor-pointer border border-white/5 hover:border-white/20"
                        >
                          <div className="flex items-center gap-3 truncate min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <IconComp className="w-4 h-4 text-rose-400" />
                            </div>
                            <div className="flex flex-col truncate">
                              <span className="font-bold text-white truncate text-xs sm:text-sm">
                                {tab.title}
                              </span>
                              <span className="text-[11px] text-white/50 truncate">
                                {tab.description}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] bg-rose-500/20 text-rose-300 group-hover:bg-rose-600 group-hover:text-white px-2.5 py-1 rounded-xl font-bold transition-all shrink-0">
                            ĐẾN NGAY
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 2. V-APPS & 5 GAMES ORE UI */}
                {showVApps && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-3 py-1 text-[11px] font-extrabold tracking-wider text-emerald-400 uppercase font-montserrat">
                      <span className="flex items-center gap-1.5">
                        <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>V-Apps & Trò Chơi Ore UI</span>
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                        {vapps.length}
                      </span>
                    </div>
                    {vapps.map((item) => {
                      const IconComp = item.icon;
                      const isGame = item.subCategory === "V-Arcade Game";
                      return (
                        <button
                          key={"vapp-" + item.id}
                          onClick={() => {
                            playPopSound();
                            item.action();
                            onClose();
                          }}
                          className="w-full px-3 py-2.5 rounded-2xl text-left text-xs bg-white/[0.04] hover:bg-white/[0.12] text-white/90 hover:text-white transition-all flex items-center justify-between group gap-2.5 cursor-pointer border border-white/5 hover:border-emerald-500/30"
                        >
                          <div className="flex items-center gap-3 truncate min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <IconComp className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="flex flex-col truncate">
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                                  {item.badge}
                                </span>
                                <span className="font-bold text-white truncate text-xs sm:text-sm">
                                  {item.title}
                                </span>
                              </div>
                              <span className="text-[11px] text-white/50 truncate">
                                {item.description}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-black px-2.5 py-1 rounded-xl font-bold transition-all shrink-0">
                            {isGame ? "CHƠI NGAY" : "MỞ APP"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 3. V-PREMIUM & V-CLOUD */}
                {showVPrem && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-3 py-1 text-[11px] font-extrabold tracking-wider text-amber-400 uppercase font-montserrat">
                      <span className="flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        <span>V-Premium & V-Cloud VIP</span>
                      </span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                        {vpremium.length}
                      </span>
                    </div>
                    {vpremium.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <button
                          key={"vprem-" + item.id}
                          onClick={() => {
                            playPopSound();
                            item.action();
                            onClose();
                          }}
                          className="w-full px-3 py-2.5 rounded-2xl text-left text-xs bg-white/[0.04] hover:bg-white/[0.12] text-white/90 hover:text-white transition-all flex items-center justify-between group gap-2.5 cursor-pointer border border-white/5 hover:border-amber-500/30"
                        >
                          <div className="flex items-center gap-3 truncate min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <IconComp className="w-4 h-4 text-amber-400" />
                            </div>
                            <div className="flex flex-col truncate">
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                                  {item.badge}
                                </span>
                                <span className="font-bold text-white truncate text-xs sm:text-sm">
                                  {item.title}
                                </span>
                              </div>
                              <span className="text-[11px] text-white/50 truncate">
                                {item.description}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 group-hover:bg-amber-500 group-hover:text-black px-2.5 py-1 rounded-xl font-bold transition-all shrink-0">
                            {item.id === "vprem-vbank"
                              ? "GIAO DỊCH"
                              : item.id === "vprem-verified"
                              ? "XÁC MINH"
                              : "MỞ VIP"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 4. V-PLAY KÊNH TRUYỀN HÌNH */}
                {showChannels && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-3 py-1 text-[11px] font-extrabold tracking-wider text-blue-400 uppercase font-montserrat">
                      <span className="flex items-center gap-1.5">
                        <Tv className="w-3.5 h-3.5 text-blue-400" />
                        <span>Kênh Truyền Hình V-Play</span>
                      </span>
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono">
                        {channels.length}
                      </span>
                    </div>
                    {channels.slice(0, 15).map((ch) => {
                      const isPlaying = selectedChannelId === ch.id;
                      return (
                        <button
                          key={"ch-" + ch.id}
                          onClick={() => {
                            playPopSound();
                            onSelectChannel?.(ch);
                            onClose();
                          }}
                          className={`w-full px-3 py-2.5 rounded-2xl text-left text-xs transition-all flex items-center justify-between group gap-2.5 cursor-pointer border ${
                            isPlaying
                              ? "bg-blue-600/30 border-blue-400/50 text-white"
                              : "bg-white/[0.04] hover:bg-white/[0.12] text-white/90 hover:text-white border-white/5 hover:border-blue-500/30"
                          }`}
                        >
                          <div className="flex items-center gap-3 truncate min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 overflow-hidden">
                              {ch.logoImg ? (
                                <img
                                  src={ch.logoImg}
                                  alt={ch.name}
                                  referrerPolicy="no-referrer"
                                  className="w-6 h-6 object-contain"
                                />
                              ) : (
                                <Tv className="w-4 h-4 text-blue-400" />
                              )}
                            </div>
                            <div className="flex flex-col truncate">
                              <div className="flex items-center gap-1.5 truncate">
                                {ch.channelNumber && (
                                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
                                    #{ch.channelNumber}
                                  </span>
                                )}
                                <span className="font-bold text-white truncate text-xs sm:text-sm">
                                  {ch.name}
                                </span>
                              </div>
                              <span className="text-[11px] text-white/50 truncate">
                                {ch.group || "V-Play"} • {ch.quality || "HD"}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] bg-blue-500/20 text-blue-300 group-hover:bg-blue-500 group-hover:text-white px-2.5 py-1 rounded-xl font-bold transition-all shrink-0">
                            {isPlaying ? "ĐANG XEM" : "XEM NGAY"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 5. TOOLBOX & TIỆN ÍCH */}
                {showToolbox && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-3 py-1 text-[11px] font-extrabold tracking-wider text-purple-400 uppercase font-montserrat">
                      <span>Toolbox & Tiện ích</span>
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-mono">
                        {toolbox.length}
                      </span>
                    </div>
                    {toolbox.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <button
                          key={"tb-" + item.id}
                          onClick={() => {
                            playPopSound();
                            item.action();
                            onClose();
                          }}
                          className="w-full px-3 py-2.5 rounded-2xl text-left text-xs bg-white/[0.04] hover:bg-white/[0.12] text-white/90 hover:text-white transition-all flex items-center justify-between group gap-2.5 cursor-pointer border border-white/5 hover:border-purple-500/30"
                        >
                          <div className="flex items-center gap-3 truncate min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <IconComp className="w-4 h-4 text-purple-400" />
                            </div>
                            <div className="flex flex-col truncate">
                              <span className="font-bold text-white truncate text-xs sm:text-sm">
                                {item.title}
                              </span>
                              <span className="text-[11px] text-white/50 truncate">
                                {item.description}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] bg-purple-500/20 text-purple-300 group-hover:bg-purple-600 group-hover:text-white px-2.5 py-1 rounded-xl font-bold transition-all shrink-0">
                            MỞ
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 6. CÀI ĐẶT HỆ THỐNG */}
                {showSettings && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-3 py-1 text-[11px] font-extrabold tracking-wider text-sky-400 uppercase font-montserrat">
                      <span>Cài đặt hệ thống</span>
                      <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-mono">
                        {settings.length}
                      </span>
                    </div>
                    {settings.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <button
                          key={"set-" + item.id}
                          onClick={() => {
                            playPopSound();
                            item.action();
                            onClose();
                          }}
                          className="w-full px-3 py-2.5 rounded-2xl text-left text-xs bg-white/[0.04] hover:bg-white/[0.12] text-white/90 hover:text-white transition-all flex items-center justify-between group gap-2.5 cursor-pointer border border-white/5 hover:border-sky-500/30"
                        >
                          <div className="flex items-center gap-3 truncate min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <IconComp className="w-4 h-4 text-sky-400" />
                            </div>
                            <div className="flex flex-col truncate">
                              <span className="font-bold text-white truncate text-xs sm:text-sm">
                                {item.title}
                              </span>
                              <span className="text-[11px] text-white/50 truncate">
                                {item.description}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] bg-sky-500/20 text-sky-300 group-hover:bg-sky-600 group-hover:text-white px-2.5 py-1 rounded-xl font-bold transition-all shrink-0">
                            CẤU HÌNH
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 7. TIN TỨC & THÔNG BÁO */}
                {showNews && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-3 py-1 text-[11px] font-extrabold tracking-wider text-amber-400 uppercase font-montserrat">
                      <span>Tin tức & Thông báo</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                        {news.length}
                      </span>
                    </div>
                    {news.map((item) => (
                      <button
                        key={"news-" + item.id}
                        onClick={() => {
                          playPopSound();
                          onSelectNews?.(item.id, item.title);
                          onClose();
                        }}
                        className="w-full px-3 py-2.5 rounded-2xl text-left text-xs bg-white/[0.04] hover:bg-white/[0.12] text-white/90 hover:text-white transition-all flex items-center justify-between group gap-2.5 cursor-pointer border border-white/5 hover:border-amber-500/30"
                      >
                        <div className="flex items-center gap-3 truncate min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Megaphone className="w-4 h-4 text-amber-400" />
                          </div>
                          <div className="flex flex-col truncate">
                            <span className="font-bold text-white truncate text-xs sm:text-sm">
                              {item.title}
                            </span>
                            <span className="text-[11px] text-white/50 truncate">
                              {item.excerpt}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 group-hover:bg-amber-500 group-hover:text-black px-2.5 py-1 rounded-xl font-bold transition-all shrink-0">
                          ĐỌC TIN
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Footer Helper Bar */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40 font-mono select-none">
            <div className="flex items-center gap-3">
              <span><strong className="text-white/60">⌘K</strong> Bật/Tắt</span>
              <span><strong className="text-white/60">ESC</strong> Đóng</span>
            </div>
            <div className="text-right">
              <span>Waves Spotlight v2.0</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
