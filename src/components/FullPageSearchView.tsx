import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  X,
  Mic,
  MicOff,
  Tv,
  Gamepad2,
  Crown,
  Megaphone,
  Sliders,
  Sparkles,
  Play,
  Star,
  Layers,
  ArrowRight,
  ExternalLink,
  Compass,
  Check,
  AlertCircle,
  HelpCircle,
  Clock,
  Trash2,
  Tag,
  Radio,
  FileText,
  Settings,
  HardDrive,
  Building2,
  BadgeCheck,
  Puzzle,
  Folder,
  Globe,
} from "lucide-react";
import { Channel, Category } from "../data/channels";
import { NEWS_LIST } from "./NewsView";
import { playPopSound } from "../utils/sound";
import { useFeatureFlags } from "../hooks/useFeatureFlags";

export interface SpotlightSearchSettings {
  fullPageSearch?: boolean;
  categories: boolean;
  vapps: boolean;
  vpremium: boolean;
  news: boolean;
  channels: boolean;
  channelNumbers: boolean;
  toolbox: boolean;
  settings: boolean;
}

interface FullPageSearchViewProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChannel: (channel: Channel) => void;
  onNavigateToTab: (tab: "home" | "live" | "vapps" | "vpremium" | "news" | "settings") => void;
  onNavigateToVApp?: (appId: string, gameId?: string | null) => void;
  onNavigateToVPremium?: (subTab: "vbank" | "storage" | "verified") => void;
  onNavigateToNews?: (articleId?: string) => void;
  onNavigateToSettingSection?: (section: string) => void;
  channels: Channel[];
  categories: Category[];
  spotlightSearchSettings: SpotlightSearchSettings;
  favorites: string[];
  onToggleFavorite: (channelId: string) => void;
  triggerToast: (msg: string) => void;
  onOpenSearchSettings?: () => void;
}

type FilterTab = "all" | "channels" | "vapps" | "vpremium" | "news" | "tabs" | "toolbox" | "settings";

const RECENT_SEARCHES_KEY = "vplay_fullpage_search_recents";

export const FullPageSearchView: React.FC<FullPageSearchViewProps> = ({
  isOpen,
  onClose,
  onSelectChannel,
  onNavigateToTab,
  onNavigateToVApp,
  onNavigateToVPremium,
  onNavigateToNews,
  onNavigateToSettingSection,
  channels,
  categories,
  spotlightSearchSettings,
  favorites,
  onToggleFavorite,
  triggerToast,
  onOpenSearchSettings,
}) => {
  const { flags } = useFeatureFlags();
  const showVoiceSearch = flags.voice_search_integration !== false;
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Recent Searches state
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return ["VTV1 HD", "V-Arcade", "V-Cloud Storage", "Giao diện"];
  });

  const saveRecentSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 8);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const removeRecentSearch = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== text);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearAllRecents = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (e) {}
  };

  // Focus input when opened & setup ESC listener
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setQuery("");
      setActiveFilter("all");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        playPopSound();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Voice Search Speech Recognition
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      triggerToast("Trình duyệt không hỗ trợ nhận diện giọng nói");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "vi-VN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      triggerToast("Đang lắng nghe... Hãy nói từ khóa tìm kiếm");

      recognition.start();

      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setQuery(speechResult);
        saveRecentSearch(speechResult);
        setIsListening(false);
        triggerToast("Đã nhập: " + speechResult);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        triggerToast("Lỗi giọng nói: " + event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } catch (err) {
      setIsListening(false);
      triggerToast("Không thể khởi động micro");
    }
  };

  // Nav Tabs dataset
  const navTabsList = useMemo(() => [
    {
      id: "tab-home",
      title: "Trang Chủ (Home)",
      tab: "home" as const,
      description: "Xem kênh nổi bật, banner tin tức và lịch phát sóng trực tiếp",
      icon: <Compass className="w-5 h-5 text-indigo-400" />,
      color: "from-indigo-500/20 to-blue-500/20",
    },
    {
      id: "tab-live",
      title: "Truyền Hình (V-Play)",
      tab: "live" as const,
      description: "Hơn 70+ kênh truyền hình HD/4K với trình phát m3u8 cao cấp",
      icon: <Tv className="w-5 h-5 text-cyan-400" />,
      color: "from-cyan-500/20 to-teal-500/20",
    },
    {
      id: "tab-vapps",
      title: "Space 360 & Trò chơi",
      tab: "vapps" as const,
      description: "Kho tiện ích & 5 Trò chơi Ore UI V-Arcade, V-Files, V-Learn và Explore VN",
      icon: <Gamepad2 className="w-5 h-5 text-emerald-400" />,
      color: "from-emerald-500/20 to-green-500/20",
    },
    {
      id: "tab-vpremium",
      title: "V-Premium & V-Cloud",
      tab: "vpremium" as const,
      description: "Ví điện tử V-Bank, mua dung lượng lưu trữ 50GB/200GB/2TB và Tích Xanh",
      icon: <Crown className="w-5 h-5 text-amber-400" />,
      color: "from-amber-500/20 to-yellow-500/20",
    },
    {
      id: "tab-news",
      title: "Tin tức & Thông báo",
      tab: "news" as const,
      description: "Cập nhật bản tin thời sự, công nghệ và tính năng mới nhất",
      icon: <Megaphone className="w-5 h-5 text-rose-400" />,
      color: "from-rose-500/20 to-pink-500/20",
    },
    {
      id: "tab-settings",
      title: "Cài đặt hệ thống",
      tab: "settings" as const,
      description: "Tùy biến giao diện, Spotlight Search, phím tắt và Plugin Store",
      icon: <Settings className="w-5 h-5 text-purple-400" />,
      color: "from-purple-500/20 to-violet-500/20",
    },
  ], []);

  // V-Apps dataset
  const vappsList = useMemo(() => [
    {
      id: "v_arcade",
      title: "V-Arcade: 5 Trò Chơi Ore UI",
      description: "Caro XO, Oẳn Tù Tì, Nối Từ Tiếng Việt, Đếm Số và Rắn Săn Mồi đấu với NPC",
      badge: "Game • 5 Trò",
      appId: "v_arcade",
      color: "from-emerald-500/20 to-teal-500/20",
      icon: <Gamepad2 className="w-5 h-5 text-emerald-400" />,
    },
    {
      id: "v_xplore",
      title: "V-Files: File Explorer",
      description: "Quản lý tệp phong cách Windows Explorer, xem trước media, sao lưu M3U8",
      badge: "Tệp tin",
      appId: "v_xplore",
      color: "from-purple-500/20 to-indigo-500/20",
      icon: <Folder className="w-5 h-5 text-purple-400" />,
    },
    {
      id: "explore_vietnam",
      title: "Khám Phá Việt Nam (Explore VN)",
      description: "Bản đồ tương tác, di sản văn hóa, ẩm thực và danh lam thắng cảnh 63 tỉnh thành",
      badge: "Văn Hóa",
      appId: "explore_vietnam",
      color: "from-amber-500/20 to-red-500/20",
      icon: <Compass className="w-5 h-5 text-amber-400" />,
    },
    {
      id: "v_maps",
      title: "Space 360 V-Maps",
      description: "Bản đồ không gian 360 độ, khám phá vệ tinh Trái Đất, toàn cảnh di tích và quỹ đạo ISS",
      badge: "Không Gian",
      appId: "v_maps",
      color: "from-cyan-500/20 to-blue-500/20",
      icon: <Globe className="w-5 h-5 text-cyan-400" />,
    },
    {
      id: "v_learn",
      title: "V-Learn: Học Trực Tuyến",
      description: "Flashcard từ vựng tiếng Anh, bài giảng truyền hình và câu hỏi trắc nghiệm",
      badge: "Giáo Dục",
      appId: "v_learn",
      color: "from-sky-500/20 to-blue-500/20",
      icon: <Sparkles className="w-5 h-5 text-sky-400" />,
    },
    {
      id: "v_calc",
      title: "V-Calc: Máy Tính Thông Minh",
      description: "Máy tính khoa học, chuyển đổi đơn vị đo lường và lịch sử tính toán",
      badge: "Tiện Ích",
      appId: "v_calc",
      color: "from-teal-500/20 to-emerald-500/20",
      icon: <FileText className="w-5 h-5 text-teal-400" />,
    },
  ], []);

  // V-Premium dataset
  const vpremiumList = useMemo(() => [
    {
      id: "vbank",
      title: "V-Bank: Ví Điện Tử & Điểm Ore",
      subTab: "vbank" as const,
      description: "Nạp rút điểm thưởng Ore, quét mã QR thanh toán và quản lý số dư",
      badge: "Ví Điện Tử",
      icon: <Building2 className="w-5 h-5 text-amber-400" />,
      color: "from-amber-500/20 to-yellow-500/20",
    },
    {
      id: "storage-50gb",
      title: "V-Cloud Storage: Gói 50 GB Cơ Bản",
      subTab: "storage" as const,
      description: "Lưu hơn 50+ playlist M3U8, đồng bộ ghi chú V-Notes không giới hạn",
      badge: "19.000đ/tháng",
      icon: <HardDrive className="w-5 h-5 text-sky-400" />,
      color: "from-sky-500/20 to-blue-500/20",
    },
    {
      id: "storage-200gb",
      title: "V-Cloud Storage: Gói 200 GB Tiêu Chuẩn",
      subTab: "storage" as const,
      description: "Ghi lại luồng truyền hình trực tiếp 1080p, chia sẻ tệp tốc độ cao",
      badge: "69.000đ/tháng",
      icon: <HardDrive className="w-5 h-5 text-indigo-400" />,
      color: "from-indigo-500/20 to-cyan-500/20",
    },
    {
      id: "storage-2tb",
      title: "V-Cloud Storage: Gói 2 TB Không Giới Hạn",
      subTab: "storage" as const,
      description: "Bộ nhớ khổng lồ lưu trữ hàng nghìn giờ truyền hình 4K và backup toàn hệ thống",
      badge: "VIP Cloud",
      icon: <HardDrive className="w-5 h-5 text-fuchsia-400" />,
      color: "from-fuchsia-500/20 to-purple-500/20",
    },
    {
      id: "verified",
      title: "Waves Verified: Huy Hiệu Tích Xanh VIP",
      subTab: "verified" as const,
      description: "Huy hiệu xác minh tài khoản, ưu tiên băng thông truyền hình và hỗ trợ 24/7",
      badge: "Tích Xanh",
      icon: <BadgeCheck className="w-5 h-5 text-purple-400" />,
      color: "from-purple-500/20 to-pink-500/20",
    },
  ], []);

  // Toolbox dataset
  const toolboxList = useMemo(() => [
    {
      id: "tool-multiview",
      title: "Multiview Grid: Xem Nhiều Kênh Cùng Lúc",
      description: "Mở 4 màn hình truyền hình song song và điều khiển âm lượng độc lập",
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      action: () => {
        onNavigateToTab("live");
        triggerToast("Đã kích hoạt chế độ xem nhiều kênh (Multiview)");
      },
    },
    {
      id: "tool-custom-m3u8",
      title: "Thêm Luồng Ngoài M3U8",
      description: "Dán liên kết luồng m3u8 của riêng bạn để phát trực tiếp mượt mà",
      icon: <ExternalLink className="w-5 h-5 text-emerald-400" />,
      action: () => {
        onNavigateToTab("live");
        triggerToast("Mở công cụ thêm kênh ngoài");
      },
    },
    {
      id: "tool-plugin-store",
      title: "Cửa Hàng Tiện Ích (Plugin Store)",
      description: "Cài đặt các extension mở rộng tính năng cho Waves TV",
      icon: <Puzzle className="w-5 h-5 text-pink-400" />,
      action: () => {
        if (onNavigateToSettingSection) {
          onNavigateToSettingSection("plugin_store");
        } else {
          onNavigateToTab("settings");
        }
      },
    },
  ], [onNavigateToTab, onNavigateToSettingSection, triggerToast]);

  // Settings dataset
  const settingsList = useMemo(() => [
    {
      id: "set-appearance",
      title: "Cài đặt Giao diện (Appearance)",
      section: "appearance",
      description: "Tùy biến thanh Header Bar, hiệu ứng nền gradient và chế độ hiển thị",
      icon: <Sliders className="w-5 h-5 text-indigo-400" />,
    },
    {
      id: "set-search",
      title: "Cài đặt Tìm kiếm (Spotlight Search)",
      section: "search",
      description: "Bật tắt giao diện full page, tùy chọn danh mục kết quả hiển thị",
      icon: <Search className="w-5 h-5 text-sky-400" />,
    },
    {
      id: "set-accessibility",
      title: "Cài đặt Trợ năng & Auto-Slide",
      section: "accessibility",
      description: "Tự động trượt banner trang chủ và điều chỉnh tốc độ tương tác",
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
    },
    {
      id: "set-plugins",
      title: "Quản lý Tiện ích & Gói mở rộng",
      section: "plugin_store",
      description: "Xem và quản lý các tiện ích mở rộng đang cài đặt trên hệ thống",
      icon: <Puzzle className="w-5 h-5 text-rose-400" />,
    },
  ], []);

  // Filtered & Searched Results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    // 1. Tabs
    let matchedTabs = spotlightSearchSettings.categories
      ? navTabsList.filter(
          (t) =>
            !q ||
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q),
        )
      : [];

    // 2. V-Apps
    let matchedVApps = spotlightSearchSettings.vapps
      ? vappsList.filter(
          (a) =>
            !q ||
            a.title.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q) ||
            a.badge.toLowerCase().includes(q),
        )
      : [];

    // 3. V-Premium
    let matchedVPremium = spotlightSearchSettings.vpremium
      ? vpremiumList.filter(
          (p) =>
            !q ||
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.badge.toLowerCase().includes(q),
        )
      : [];

    // 4. News
    let matchedNews = spotlightSearchSettings.news
      ? NEWS_LIST.filter(
          (n) =>
            !q ||
            n.title.toLowerCase().includes(q) ||
            n.excerpt.toLowerCase().includes(q) ||
            (n.fullContent && n.fullContent.toLowerCase().includes(q)),
        )
      : [];

    // 5. Toolbox
    let matchedToolbox = spotlightSearchSettings.toolbox
      ? toolboxList.filter(
          (t) =>
            !q ||
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q),
        )
      : [];

    // 6. Settings
    let matchedSettings = spotlightSearchSettings.settings
      ? settingsList.filter(
          (s) =>
            !q ||
            s.title.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q),
        )
      : [];

    // 7. Channels & Channel Numbers
    let matchedChannels: Channel[] = [];
    if (spotlightSearchSettings.channels) {
      const numMatch = q.match(/(?:kênh|kenh|ch|#|số|so)?\s*(\d+)/i);
      const searchNum = spotlightSearchSettings.channelNumbers && numMatch ? numMatch[1] : null;

      matchedChannels = channels.filter((ch) => {
        if (!q) return true;
        const nameMatch =
          ch.name.toLowerCase().includes(q) ||
          ch.id.toLowerCase().includes(q) ||
          (ch.group && ch.group.toLowerCase().includes(q));
        if (nameMatch) return true;

        if (searchNum && ch.channelNumber) {
          const chNumInt = parseInt(ch.channelNumber, 10);
          const searchNumInt = parseInt(searchNum, 10);
          if (!isNaN(chNumInt) && !isNaN(searchNumInt) && chNumInt === searchNumInt) {
            return true;
          }
          if (
            ch.channelNumber === searchNum ||
            ch.channelNumber === searchNum.padStart(3, "0") ||
            ch.channelNumber.includes(searchNum)
          ) {
            return true;
          }
        }
        return false;
      });
    }

    const totalCount =
      matchedTabs.length +
      matchedVApps.length +
      matchedVPremium.length +
      matchedNews.length +
      matchedToolbox.length +
      matchedSettings.length +
      matchedChannels.length;

    return {
      tabs: matchedTabs,
      vapps: matchedVApps,
      vpremium: matchedVPremium,
      news: matchedNews,
      toolbox: matchedToolbox,
      settings: matchedSettings,
      channels: matchedChannels,
      totalCount,
    };
  }, [
    query,
    channels,
    spotlightSearchSettings,
    navTabsList,
    vappsList,
    vpremiumList,
    toolboxList,
    settingsList,
  ]);

  const isAllDisabled =
    !spotlightSearchSettings.categories &&
    !spotlightSearchSettings.vapps &&
    !spotlightSearchSettings.vpremium &&
    !spotlightSearchSettings.news &&
    !spotlightSearchSettings.channels &&
    !spotlightSearchSettings.toolbox &&
    !spotlightSearchSettings.settings;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-start overflow-hidden select-none font-sans">
        {/* Deep frosted liquid glass backdrop with subtle ambient light orbs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => {
            playPopSound();
            onClose();
          }}
          className="absolute inset-0 bg-[#07090e]/85 backdrop-blur-[28px] cursor-pointer"
        >
          {/* Ambient Liquid Glass Glowing Lights */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/12 rounded-full blur-[120px] pointer-events-none animate-pulse duration-10000" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-500/12 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        </motion.div>

        {/* Main Glassmorphism Full Page Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-6xl mx-auto h-[94vh] sm:h-[92vh] mt-3 sm:mt-6 mb-3 sm:mb-6 rounded-[28px] sm:rounded-[36px] bg-white/[0.06] backdrop-blur-[40px] border border-white/15 shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.35),0_30px_90px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden text-white"
        >
          {/* Top Bar: Search Input, Voice Button, and Close Button */}
          <div className="p-4 sm:p-6 sm:pb-4 border-b border-white/10 shrink-0 space-y-4">
            <div className="flex items-center justify-between gap-3">
              {/* Logo / Badge */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_18px_rgba(6,182,212,0.45)] border border-cyan-300/30">
                  <Search className="w-5 h-5 text-white stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    Tìm kiếm Toàn Trang
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider">
                      Liquid Glass
                    </span>
                  </h2>
                  <p className="text-xs text-white/50 hidden sm:block">
                    Tra cứu kênh TV, Space 360 & Trò chơi, V-Cloud VIP, Tin tức và Lối tắt hệ thống
                  </p>
                </div>
              </div>

              {/* Close Button with ESC badge */}
              <div className="flex items-center gap-2">
                {onOpenSearchSettings && (
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      onClose();
                      onOpenSearchSettings();
                    }}
                    className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/70 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Cấu hình tùy chọn tìm kiếm"
                  >
                    <Sliders className="w-3.5 h-3.5 text-sky-400" />
                    <span className="hidden sm:inline">Cài đặt tìm kiếm</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    onClose();
                  }}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all flex items-center gap-2 cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-95"
                >
                  <span>Đóng</span>
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-black/40 text-white/70 rounded border border-white/10">
                    ESC
                  </kbd>
                  <X className="w-4 h-4 text-white/70" />
                </button>
              </div>
            </div>

            {/* Giant Glass Search Input */}
            <div className="relative w-full">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <Search className="w-5 h-5 text-cyan-400" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    saveRecentSearch(query);
                    // If there is an exact first channel result, allow pressing enter to play
                    if (results.channels.length > 0) {
                      playPopSound();
                      onSelectChannel(results.channels[0]);
                      onClose();
                    }
                  }
                }}
                placeholder="Nhập tên kênh (VTV1, HBO...), số kênh (#001), trò chơi (Caro, Rắn...), V-Cloud hay từ khóa..."
                className="w-full pl-12 pr-28 py-3.5 sm:py-4 rounded-2xl bg-white/[0.07] border border-white/15 text-sm sm:text-base font-semibold text-white placeholder:text-white/40 shadow-[inset_0_1.5px_0_rgba(255,255,255,0.15)] focus:outline-none focus:bg-white/[0.12] focus:border-cyan-400/50 focus:shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all"
              />

              {/* Action buttons inside input */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    className="p-1.5 rounded-full hover:bg-white/15 text-white/60 hover:text-white transition-all cursor-pointer"
                    title="Xóa tìm kiếm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {showVoiceSearch && (
                  <button
                    type="button"
                    onClick={handleVoiceSearch}
                    className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                      isListening
                        ? "bg-rose-500 text-white animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.6)]"
                        : "bg-white/10 hover:bg-white/20 text-cyan-400 hover:text-cyan-300"
                    }`}
                    title="Tìm kiếm bằng giọng nói"
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills (Liquid Glass Style) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
              {[
                { id: "all" as FilterTab, label: "Tất cả", count: results.totalCount },
                { id: "channels" as FilterTab, label: "Kênh TV", count: results.channels.length, enabled: spotlightSearchSettings.channels },
                { id: "vapps" as FilterTab, label: "Space 360 & Games", count: results.vapps.length, enabled: spotlightSearchSettings.vapps },
                { id: "vpremium" as FilterTab, label: "V-Premium", count: results.vpremium.length, enabled: spotlightSearchSettings.vpremium },
                { id: "news" as FilterTab, label: "Tin tức", count: results.news.length, enabled: spotlightSearchSettings.news },
                { id: "tabs" as FilterTab, label: "Danh mục", count: results.tabs.length, enabled: spotlightSearchSettings.categories },
                { id: "toolbox" as FilterTab, label: "Toolbox", count: results.toolbox.length, enabled: spotlightSearchSettings.toolbox },
                { id: "settings" as FilterTab, label: "Cài đặt", count: results.settings.length, enabled: spotlightSearchSettings.settings },
              ]
                .filter((tab) => tab.id === "all" || tab.enabled)
                .map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setActiveFilter(tab.id);
                    }}
                    className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                      activeFilter === tab.id
                        ? "bg-cyan-500/25 border-cyan-400/60 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.35)]"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        activeFilter === tab.id
                          ? "bg-cyan-400/30 text-white"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
            </div>
          </div>

          {/* Results Scroll Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
            {/* Warning if all search categories disabled */}
            {isAllDisabled ? (
              <div className="py-16 text-center space-y-3">
                <AlertCircle className="w-12 h-12 text-rose-400 mx-auto opacity-70" />
                <h3 className="text-base font-bold text-white">Tất cả danh mục tìm kiếm đang bị tắt</h3>
                <p className="text-xs text-white/60 max-w-md mx-auto">
                  Bạn đã tắt toàn bộ danh mục trong Cài đặt Spotlight. Hãy bật lại ít nhất một mục để xem kết quả.
                </p>
                {onOpenSearchSettings && (
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      onClose();
                      onOpenSearchSettings();
                    }}
                    className="mt-2 px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  >
                    Mở Cài đặt Tìm kiếm
                  </button>
                )}
              </div>
            ) : !query ? (
              /* Initial State when input is empty: Recent searches & Trending quick shortcuts */
              <div className="space-y-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        Tìm kiếm gần đây
                      </h4>
                      <button
                        type="button"
                        onClick={clearAllRecents}
                        className="text-[11px] text-white/40 hover:text-rose-300 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        Xóa lịch sử
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((rec, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            playPopSound();
                            setQuery(rec);
                            inputRef.current?.focus();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-medium text-white/80 hover:text-white flex items-center gap-2 cursor-pointer transition-all group"
                        >
                          <Search className="w-3 h-3 text-white/40 group-hover:text-cyan-400 transition-colors" />
                          <span>{rec}</span>
                          <button
                            type="button"
                            onClick={(e) => removeRecentSearch(rec, e)}
                            className="p-0.5 rounded-full hover:bg-white/20 text-white/40 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending & Suggestions */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Gợi ý tìm kiếm phổ biến
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      {
                        title: "VTV1 HD & Kênh Tin Tức",
                        sub: "Kênh truyền hình trực tiếp quốc gia số #001",
                        icon: <Tv className="w-4 h-4 text-cyan-400" />,
                        action: () => setQuery("VTV1"),
                      },
                      {
                        title: "V-Arcade 5 Trò Chơi Ore UI",
                        sub: "Caro XO, Oẳn Tù Tì, Nối Từ, Đếm Số, Rắn Săn Mồi",
                        icon: <Gamepad2 className="w-4 h-4 text-emerald-400" />,
                        action: () => setQuery("Caro"),
                      },
                      {
                        title: "V-Cloud Storage 50GB / 200GB",
                        sub: "Mở rộng bộ nhớ đám mây cá nhân",
                        icon: <HardDrive className="w-4 h-4 text-sky-400" />,
                        action: () => setQuery("Storage"),
                      },
                      {
                        title: "Giao diện Header Bar & AMOLED",
                        sub: "Tùy biến thanh điều hướng và giao diện",
                        icon: <Sliders className="w-4 h-4 text-indigo-400" />,
                        action: () => setQuery("Giao diện"),
                      },
                      {
                        title: "VTV3 HD - Giải trí tổng hợp",
                        sub: "Chương trình thực tế, phim truyện và gameshow",
                        icon: <Tv className="w-4 h-4 text-rose-400" />,
                        action: () => setQuery("VTV3"),
                      },
                      {
                        title: "Khám Phá Việt Nam (Explore VN)",
                        sub: "Bản đồ tương tác di sản văn hóa 63 tỉnh",
                        icon: <Compass className="w-4 h-4 text-amber-400" />,
                        action: () => setQuery("Explore VN"),
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          playPopSound();
                          item.action();
                          inputRef.current?.focus();
                        }}
                        className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/30 flex items-start gap-3 cursor-pointer transition-all hover:scale-[1.01] group shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                      >
                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/20 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all">
                          {item.icon}
                        </div>
                        <div className="space-y-0.5 text-left min-w-0">
                          <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-white/50 line-clamp-1">
                            {item.sub}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Channels Preview Grid */}
                {spotlightSearchSettings.channels && channels.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Tv className="w-3.5 h-3.5 text-indigo-400" />
                        Kênh truyền hình đề xuất
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          playPopSound();
                          onNavigateToTab("live");
                          onClose();
                        }}
                        className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        Xem tất cả kênh <ArrowRight className="w-3 h-3" />
                      </button>
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {channels.slice(0, 6).map((ch) => {
                        const isFav = favorites.includes(ch.id);
                        return (
                          <div
                            key={ch.id}
                            onClick={() => {
                              playPopSound();
                              saveRecentSearch(ch.name);
                              onSelectChannel(ch);
                              onClose();
                            }}
                            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 flex flex-col items-center text-center gap-2 cursor-pointer transition-all hover:scale-[1.03] group relative overflow-hidden"
                          >
                            <div className="relative w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                              {ch.logoImg ? (
                                <img
                                  src={ch.logoImg}
                                  alt={ch.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-contain filter drop-shadow"
                                />
                              ) : (
                                <span className="text-xs font-bold text-white">
                                  {ch.logoText || ch.name.slice(0, 4)}
                                </span>
                              )}
                            </div>
                            <div className="w-full">
                              <div className="text-xs font-bold text-white truncate group-hover:text-cyan-300">
                                {ch.name}
                              </div>
                              <div className="text-[10px] text-white/50 truncate">
                                {ch.group || "Truyền hình"}
                              </div>
                            </div>
                            {ch.channelNumber && (
                              <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-white/10 text-white/70">
                                #{ch.channelNumber}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : results.totalCount === 0 ? (
              /* Empty Search Results */
              <div className="py-16 text-center space-y-3">
                <AlertCircle className="w-12 h-12 text-white/30 mx-auto" />
                <h3 className="text-base font-bold text-white">
                  Không tìm thấy kết quả nào cho &quot;{query}&quot;
                </h3>
                <p className="text-xs text-white/50 max-w-sm mx-auto">
                  Hãy thử kiểm tra lại chính tả, tìm theo số kênh (#001), tên trò chơi V-Arcade, hoặc từ khóa ngắn gọn hơn.
                </p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
                >
                  Xóa từ khóa tìm kiếm
                </button>
              </div>
            ) : (
              /* Render Filtered Search Results */
              <div className="space-y-6">
                {/* 1. TV Channels Results */}
                {(activeFilter === "all" || activeFilter === "channels") &&
                  results.channels.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                          <Tv className="w-4 h-4" />
                          Kênh truyền hình ({results.channels.length})
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {results.channels.map((ch) => {
                          const isFav = favorites.includes(ch.id);
                          return (
                            <div
                              key={ch.id}
                              onClick={() => {
                                playPopSound();
                                saveRecentSearch(ch.name);
                                onSelectChannel(ch);
                                onClose();
                              }}
                              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 flex items-center justify-between gap-3 cursor-pointer transition-all hover:scale-[1.01] group shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center p-1.5 shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                                  {ch.logoImg ? (
                                    <img
                                      src={ch.logoImg}
                                      alt={ch.name}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-contain filter drop-shadow"
                                    />
                                  ) : (
                                    <span className="text-xs font-bold text-white">
                                      {ch.logoText || ch.name.slice(0, 4)}
                                    </span>
                                  )}
                                </div>
                                <div className="space-y-0.5 min-w-0 text-left">
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                                      {ch.name}
                                    </h5>
                                    {ch.channelNumber && (
                                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                        #{ch.channelNumber}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-white/50 truncate">
                                    {ch.group || "Truyền hình"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playPopSound();
                                    onToggleFavorite(ch.id);
                                  }}
                                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                                    isFav
                                      ? "text-amber-400 bg-amber-400/10 hover:bg-amber-400/20"
                                      : "text-white/40 hover:text-white hover:bg-white/10"
                                  }`}
                                  title={isFav ? "Bỏ yêu thích" : "Yêu thích"}
                                >
                                  <Star
                                    className={`w-4 h-4 ${isFav ? "fill-amber-400" : ""}`}
                                  />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    playPopSound();
                                    saveRecentSearch(ch.name);
                                    onSelectChannel(ch);
                                    onClose();
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                                >
                                  <Play className="w-3.5 h-3.5 fill-black" />
                                  <span className="hidden sm:inline">Phát</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* 2. V-Apps & Games Results */}
                {(activeFilter === "all" || activeFilter === "vapps") &&
                  results.vapps.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4" />
                        Space 360 & 5 Trò Chơi Ore UI ({results.vapps.length})
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {results.vapps.map((app) => (
                          <div
                            key={app.id}
                            onClick={() => {
                              playPopSound();
                              saveRecentSearch(app.title);
                              if (onNavigateToVApp) {
                                onNavigateToVApp(app.appId);
                              } else {
                                onNavigateToTab("vapps");
                              }
                              onClose();
                            }}
                            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/40 flex items-start justify-between gap-3 cursor-pointer transition-all hover:scale-[1.01] group shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                                {app.icon}
                              </div>
                              <div className="space-y-1 text-left min-w-0">
                                <div className="flex items-center gap-2">
                                  <h5 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                                    {app.title}
                                  </h5>
                                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    {app.badge}
                                  </span>
                                </div>
                                <p className="text-xs text-white/60 line-clamp-2">
                                  {app.description}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shrink-0 flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                            >
                              <span>Mở</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* 3. V-Premium & V-Cloud VIP */}
                {(activeFilter === "all" || activeFilter === "vpremium") &&
                  results.vpremium.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        V-Premium & Gói V-Cloud Storage ({results.vpremium.length})
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {results.vpremium.map((prem) => (
                          <div
                            key={prem.id}
                            onClick={() => {
                              playPopSound();
                              saveRecentSearch(prem.title);
                              if (onNavigateToVPremium) {
                                onNavigateToVPremium(prem.subTab);
                              } else {
                                onNavigateToTab("vpremium");
                              }
                              onClose();
                            }}
                            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 flex items-start justify-between gap-3 cursor-pointer transition-all hover:scale-[1.01] group shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                                {prem.icon}
                              </div>
                              <div className="space-y-1 text-left min-w-0">
                                <div className="flex items-center gap-2">
                                  <h5 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                                    {prem.title}
                                  </h5>
                                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    {prem.badge}
                                  </span>
                                </div>
                                <p className="text-xs text-white/60 line-clamp-2">
                                  {prem.description}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shrink-0 flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                            >
                              <span>Xem</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* 4. News Results */}
                {(activeFilter === "all" || activeFilter === "news") &&
                  results.news.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                        <Megaphone className="w-4 h-4" />
                        Tin tức & Bài viết ({results.news.length})
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {results.news.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              playPopSound();
                              saveRecentSearch(item.title);
                              if (onNavigateToNews) {
                                onNavigateToNews(item.id);
                              } else {
                                onNavigateToTab("news");
                              }
                              onClose();
                            }}
                            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-400/40 flex items-start gap-3 cursor-pointer transition-all hover:scale-[1.01] group shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                          >
                            {(item.thumbnail || item.image) && (
                              <img
                                src={item.thumbnail || item.image}
                                alt={item.title}
                                referrerPolicy="no-referrer"
                                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                              />
                            )}
                            <div className="space-y-1 text-left min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                  {item.isFeatured ? "Nổi bật" : "Bản tin"}
                                </span>
                                <span className="text-[10px] text-white/50">{item.date}</span>
                              </div>
                              <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-rose-300 transition-colors line-clamp-1">
                                {item.title}
                              </h5>
                              <p className="text-[11px] text-white/60 line-clamp-2">
                                {item.excerpt}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* 5. Navigation Tabs Results */}
                {(activeFilter === "all" || activeFilter === "tabs") &&
                  results.tabs.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                        <Compass className="w-4 h-4" />
                        Danh mục & Điều hướng ({results.tabs.length})
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {results.tabs.map((tab) => (
                          <div
                            key={tab.id}
                            onClick={() => {
                              playPopSound();
                              saveRecentSearch(tab.title);
                              onNavigateToTab(tab.tab);
                              onClose();
                            }}
                            className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/40 flex items-center justify-between gap-3 cursor-pointer transition-all hover:scale-[1.01] group shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
                                {tab.icon}
                              </div>
                              <div className="space-y-0.5 text-left min-w-0">
                                <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                                  {tab.title}
                                </h5>
                                <p className="text-[11px] text-white/50 truncate">
                                  {tab.description}
                                </p>
                              </div>
                            </div>

                            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-indigo-300 shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* 6. Toolbox & Utilities Results */}
                {(activeFilter === "all" || activeFilter === "toolbox") &&
                  results.toolbox.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        Toolbox & Tiện ích ({results.toolbox.length})
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {results.toolbox.map((tool) => (
                          <div
                            key={tool.id}
                            onClick={() => {
                              playPopSound();
                              saveRecentSearch(tool.title);
                              tool.action();
                              onClose();
                            }}
                            className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 flex items-center justify-between gap-3 cursor-pointer transition-all hover:scale-[1.01] group shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center shrink-0">
                                {tool.icon}
                              </div>
                              <div className="space-y-0.5 text-left min-w-0">
                                <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                                  {tool.title}
                                </h5>
                                <p className="text-[11px] text-white/50 truncate">
                                  {tool.description}
                                </p>
                              </div>
                            </div>

                            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-cyan-300 shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* 7. Settings Results */}
                {(activeFilter === "all" || activeFilter === "settings") &&
                  results.settings.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Cài đặt hệ thống ({results.settings.length})
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {results.settings.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              playPopSound();
                              saveRecentSearch(item.title);
                              if (onNavigateToSettingSection) {
                                onNavigateToSettingSection(item.section);
                              } else {
                                onNavigateToTab("settings");
                              }
                              onClose();
                            }}
                            className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/40 flex items-center justify-between gap-3 cursor-pointer transition-all hover:scale-[1.01] group shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0">
                                {item.icon}
                              </div>
                              <div className="space-y-0.5 text-left min-w-0">
                                <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                                  {item.title}
                                </h5>
                                <p className="text-[11px] text-white/50 truncate">
                                  {item.description}
                                </p>
                              </div>
                            </div>

                            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-purple-300 shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Bottom Footer Bar with Quick Tips & Shortcuts */}
          <div className="px-6 py-3.5 border-t border-white/10 bg-black/20 shrink-0 flex flex-wrap items-center justify-between gap-2 text-xs text-white/60">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-[10px] text-white">
                  ESC
                </kbd>
                <span>Đóng tìm kiếm</span>
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-[10px] text-white">
                  Enter
                </kbd>
                <span>Chọn kết quả đầu tiên</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-white/40">
              <span>Waves Spotlight Full Page Engine</span>
              <span>•</span>
              <span>Glassmorphism / Liquid Glass</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
