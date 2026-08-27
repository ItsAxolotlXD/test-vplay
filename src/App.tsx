import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Power,
  Heart,
  ThumbsUp,
  Sliders,
  Key,
  Sparkles,
  Info,
  Tv,
  Grid,
  HelpCircle,
  Plus,
  X,
  Check,
  RefreshCw,
  Maximize2,
  Upload,
  Play,
  Clock,
  History,
  Settings,
  Package,
  Flame,
  Home,
  Compass,
  Shuffle,
  Radio,
  Signal,
  Star,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Copy,
  MapPin,
  Globe,
  Bell,
  Trash2,
  User,
  LogOut,
  Palette,
  Beaker,
  AlertCircle,
  Pen,
  Crown,
  Menu,
  Pizza,
  Cpu,
  Layers,
  Download,
  ArrowLeft,
  Puzzle,
  ShoppingBag,
  Pin,
  Loader2,
  Share2,
  Minus,
  Send,
  MessageSquare,
  Paintbrush,
  File,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  FolderOpen,
  BookOpen,
  ArrowUpDown,
  SlidersHorizontal,
  HardDrive,
  Megaphone,
  Moon,
  PanelLeft,
  Type,
  Gamepad2,
  GraduationCap,
  Calculator,
  StickyNote,
  Armchair,
  Building2,
  BadgeCheck,
  Cloud,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  CATEGORIES,
  Category,
  Channel,
  processedChannels,
} from "./data/channels";
import ChannelPlayer from "./components/ChannelPlayer";
import NewsView, { NEWS_LIST, NewsFontSize } from "./components/NewsView";
import DigitalClock from "./components/DigitalClock";
import { VAppsView } from "./components/VAppsView";
import { VPremiumView } from "./components/VPremiumView";
import { LocalStorageBar } from "./components/LocalStorageBar";
import { FeaturesVoteBanner } from "./components/FeaturesVoteBanner";
import { SpotlightSearchModal } from "./components/SpotlightSearchModal";

const DiscordIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const Mic = ({ className = "" }: { className?: string }) => {
  return (
    <img
      src="https://raw.githubusercontent.com/andrewtavis/sf-symbols-online/refs/heads/master/glyphs/mic.png"
      alt="Mic"
      className={`${className} object-contain shrink-0 scale-125`}
      style={{ filter: "brightness(0) invert(1)" }}
      referrerPolicy="no-referrer"
    />
  );
};

interface HomeSlideItem {
  id: number;
  titleTop: string;
  titleMain: string;
  titleSub?: string;
  genreText: string;
  subSlogan: string;
  thumbnail: string;
  channelId: string;
  channelPlayName: string;
  ageRating: string;
  ratingText: string;
  vignetteLeft: string;
  vignetteBottom: string;
  vignetteTop: string;
  description: string;
  descriptionNode?: React.ReactNode;
  showCountdown?: boolean;
  logo?: string;
  logos?: string[];
  btnText?: string;
  btnIcon?: string;
}

const homeSlides: HomeSlideItem[] = [
  {
    id: 0,
    titleTop: "Tạm biệt Vplay",
    titleMain: "Chào mừng Waves Community!",
    titleSub: "",
    genreText: "THÔNG BÁO QUAN TRỌNG",
    subSlogan: "HÀNH TRÌNH MỚI CỦA TRẢI NGHIỆM TRUYỀN HÌNH",
    thumbnail:
      "https://static.wikia.nocookie.net/ep-deo/images/2/26/Background.png/revision/latest/scale-to-width-down/1000?cb=20260825071832",
    channelId: "vtv1",
    channelPlayName: "VTV1 HD",
    ageRating: "Thông báo",
    ratingText: "Sáp nhập & Nâng cấp toàn diện | Discord: Waves",
    vignetteLeft: "from-black/90 via-black/55 to-transparent",
    vignetteBottom: "from-[#211f26] via-[#211f26]/85 to-transparent",
    vignetteTop: "from-black/45 via-transparent to-transparent",
    description:
      "Kể từ 20/09/2026, nền tảng xem truyền hình quen thuộc của bạn sẽ bước sang một hành trình hoàn toàn mới. Vplay được hợp nhất để trở thành Waves Community. Ngoài việc cung cấp cho người dùng một hệ thống xem truyền hình đa dạng thể loại các kênh thì trang web mới sau sáp nhập sẽ tập trung thêm cả vào việc cập nhật những tin tức, thông báo mới của server Waves trong Discord. Trân trọng cảm ơn!",
    descriptionNode: (
      <span>
        Kể từ 20/09/2026, nền tảng xem truyền hình quen thuộc của bạn sẽ bước
        sang một hành trình hoàn toàn mới. Vplay được hợp nhất để trở thành{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-fuchsia-500 font-bold">
          Waves Community
        </span>
        . Ngoài việc cung cấp cho người dùng một hệ thống xem truyền hình đa
        dạng thể loại các kênh thì trang web mới sau sáp nhập sẽ tập trung thêm
        cả vào việc cập nhật những tin tức, thông báo mới của server Waves trong
        Discord. Trân trọng cảm ơn!
      </span>
    ),
    showCountdown: false,
    logo: "https://static.wikia.nocookie.net/ep-deo/images/e/e9/Wave.png/revision/latest/scale-to-width-down/1000?cb=20260825072256",
    btnText: "Khám phá ngay",
    btnIcon: "play",
  },
  {
    id: 1,
    titleTop: "Đón chào",
    titleMain: "Firesteel!",
    titleSub: "",
    genreText: "TRỢ LÝ ẢO THÔNG MINH (AI)",
    subSlogan: "TRẢI NGHIỆM TRUYỀN HÌNH THEO PHONG CÁCH TƯƠNG LAI",
    thumbnail:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop",
    channelId: "vintel-trigger",
    channelPlayName: "Firesteel Virtual Assistant",
    ageRating: "Mới",
    ratingText: "Trợ lý đắc lực | Điều khiển thông minh & Tìm kiếm",
    vignetteLeft: "from-black/90 via-black/55 to-transparent",
    vignetteBottom: "from-[#211f26] via-[#211f26]/85 to-transparent",
    vignetteTop: "from-black/45 via-transparent to-transparent",
    logo: "https://static.wikia.nocookie.net/logopedia/images/d/d5/Windows_Copilot_2023.svg/revision/latest/scale-to-width-down/200?cb=20230615034323",
    description:
      "Trợ lý AI thế hệ mới tích hợp sâu vào hệ thống Waves Community giúp bạn tìm kiếm nhanh mọi kênh truyền hình, mở trực tiếp các mục cấu hình cài đặt và tự động hóa các tác vụ giải trí chỉ bằng một thao tác.",
    btnText: "Thử ngay!",
    btnIcon: "compass",
  },
  {
    id: 2,
    titleTop: "VTV6",
    titleMain: "Vì một Việt Nam khỏe mạnh!",
    titleSub: "",
    genreText: "THỂ THAO & SỨC KHỎE QUỐC GIA",
    subSlogan: "ĐỒNG HÀNH KHÁT VỌNG, LAN TỎA SỨC TRẺ VIỆT NAM",
    thumbnail: "https://i.ytimg.com/vi/cXv_D6qIy0s/maxresdefault.jpg",
    channelId: "vtv3",
    channelPlayName: "VTV6 - Vì một Việt Nam khỏe mạnh! (FHD)",
    ageRating: "Tất cả",
    ratingText: "Trực tiếp Thể thao | Bản quyền",
    vignetteLeft: "from-black/90 via-black/55 to-transparent",
    vignetteBottom: "from-[#211f26] via-[#211f26]/85 to-transparent",
    vignetteTop: "from-black/45 via-transparent to-transparent",
    logo: "https://static.wikia.nocookie.net/logos/images/5/56/VTV6_logo_07.06.2026.png/revision/latest?cb=20260608073805&path-prefix=uk",
    description:
      "Các bản tin, chuyên mục, tường thuật về thể thao trong nước và quốc tế do Trung tâm Truyền hình Thể thao sản xuất, với mục tiêu thúc đẩy phong trào thể thao quần chúng, thể thao học đường, thể thao chuyên nghiệp phát triển tại Việt Nam cũng như hướng đến rèn luyện, nâng cao sức khỏe cộng đồng và phát triển toàn diện.",
    btnText: "Xem ngay",
    btnIcon: "play",
  },
  {
    id: 3,
    titleTop: "VIETNAM TODAY",
    titleMain: "Your Window on Vietnam",
    titleSub: "",
    genreText: "ĐỐI NGOẠI & QUỐC TẾ",
    subSlogan: "CỬA SỔ THÔNG TIN RA THẾ GIỚI",
    thumbnail:
      "https://vtv4.vtv.vn/upload/news/3HOPA0OIS_vntoday1-79180073137201066112112-72441177075135673357555.jpg",
    channelId: "vn_today",
    channelPlayName: "Vietnam Today HD",
    ageRating: "Tất cả",
    ratingText: "Chất lượng HD | Đối ngoại quốc gia",
    vignetteLeft: "from-black/90 via-black/55 to-transparent",
    vignetteBottom: "from-[#211f26] via-[#211f26]/85 to-transparent",
    vignetteTop: "from-black/45 via-transparent to-transparent",
    logo: "https://static.wikia.nocookie.net/logos/images/0/06/Vietnam_Today_white%2C_vertical%2C_no_gradient.png/revision/latest/scale-to-width-down/1000?cb=20260527070551&path-prefix=uk",
    description:
      "Cửa sổ thông tin của Việt Nam ra thế giới, phản ánh khách quan và sinh động các vấn đề thời sự, chính trị, kinh tế, văn hóa, du lịch, môi trường, đổi mới sáng tạo, chuyển đổi số và những giá trị đặc trưng, bản sắc, truyền thống và hiện đại của Việt Nam trong công cuộc phát triển đất nước hội nhập quốc tế.",
    btnText: "Xem ngay",
    btnIcon: "play",
  },
];

const formatVIntelMessage = (text: string) => {
  if (!text) return "";
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-extrabold text-[#d0bcff]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

const EventCountdownTimer = React.memo(() => {
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const target = new Date("2026-06-30T00:00:00").getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const secs = Math.floor(diff / 1000);
      const mins = Math.floor(secs / 60);
      const hours = Math.floor(mins / 60);
      const days = Math.floor(hours / 24);

      setCountdown({
        days: String(days).padStart(2, "0"),
        hours: String(hours % 24).padStart(2, "0"),
        minutes: String(mins % 60).padStart(2, "0"),
        seconds: String(secs % 60).padStart(2, "0"),
      });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-1.5 mt-4 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-3 rounded-2xl select-none max-w-xs shadow-lg">
      <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider">
        Thời gian còn lại của sự kiện
      </span>
      <div className="flex items-center gap-1.5 font-mono text-base sm:text-lg font-extrabold text-teal-400">
        <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-lg shadow-inner">
          {countdown.days}d
        </span>
        <span className="text-white/40">:</span>
        <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-lg shadow-inner">
          {countdown.hours}h
        </span>
        <span className="text-white/40">:</span>
        <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-lg shadow-inner">
          {countdown.minutes}m
        </span>
        <span className="text-white/40">:</span>
        <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-lg shadow-inner">
          {countdown.seconds}s
        </span>
      </div>
    </div>
  );
});

export default function App() {
  // Immersive Home Slideshow State
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const [autoSlide, setAutoSlide] = useState<boolean>(() => {
    const saved = localStorage.getItem("glass_tv_auto_slide");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("glass_tv_auto_slide", autoSlide ? "true" : "false");
  }, [autoSlide]);

  const [autoHideSidebar, setAutoHideSidebar] = useState<boolean>(() => {
    const saved = localStorage.getItem("vplay_auto_hide_sidebar");
    return saved !== null ? saved === "true" : false;
  });

  useEffect(() => {
    localStorage.setItem(
      "vplay_auto_hide_sidebar",
      autoHideSidebar ? "true" : "false",
    );
  }, [autoHideSidebar]);

  const [isSidebarHovered, setIsSidebarHovered] = useState<boolean>(false);

  // Favorite channel list horizontal scroll reference
  const favScrollRef = useRef<HTMLDivElement>(null);
  const recoScrollRef = useRef<HTMLDivElement>(null);

  const [recoRefreshTrigger, setRecoRefreshTrigger] = useState<number>(0);

  const recommendedChannels = useMemo(() => {
    if (!processedChannels || processedChannels.length === 0) return [];
    const shuffled = [...processedChannels].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 30);
  }, [recoRefreshTrigger]);

  const scrollFavorites = (direction: "left" | "right") => {
    if (favScrollRef.current) {
      const scrollAmount = 300;
      favScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRecommendations = (direction: "left" | "right") => {
    if (recoScrollRef.current) {
      const scrollAmount = 300;
      recoScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Navigation State
  const [activeTab, setActiveTab] = useState<
    "home" | "live" | "vapps" | "vpremium" | "news" | "settings" | "search" | "fandom_logos"
  >("home");
  const [prevTab, setPrevTab] = useState<"home" | "live" | "news" | "settings">(
    "home",
  );
  const [slideDirection, setSlideDirection] = useState<"forward" | "backward">(
    "forward",
  );
  const lastTabRef = useRef<string>("home");

  useEffect(() => {
    const tabOrder = {
      home: 0,
      live: 1,
      vapps: 2,
      vpremium: 3,
      news: 4,
      search: 4,
      settings: 5,
      fandom_logos: 6,
    };
    const prevIndex =
      tabOrder[lastTabRef.current as keyof typeof tabOrder] ?? 0;
    const currentIndex = tabOrder[activeTab] ?? 0;
    setSlideDirection("forward");
    lastTabRef.current = activeTab;

    if (activeTab !== "search") {
      setPrevTab(activeTab as any);
    }
  }, [activeTab]);

  // Scroll Position Tracking for Floating Header
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const top = window.scrollY || document.documentElement.scrollTop;
          setIsScrolled(top > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Slide auto rotation effect every 5 seconds if enabled
  useEffect(() => {
    if (activeTab !== "home" || !autoSlide) return;
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % homeSlides.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [activeTab, autoSlide]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDateVietnamese = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yy = String(date.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  };

  // Selected Channel State (Defaults to VTV1 HD)
  const defaultChannel = CATEGORIES[0].channels[0];
  const [selectedChannel, setSelectedChannel] = useState<Channel>(() => {
    const saved = localStorage.getItem("glass_tv_last_channel");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.url) return parsed;
      } catch (e) {
        // Fallback
      }
    }
    return defaultChannel;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<any>(null);
  const triggerToast = (message: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, 2500);
  };

  const getPluginName = (id: string): string => {
    const names: Record<string, string> = {
      export_stream: "Xuất luồng",
      multiview: "Multiview Grid",
      pip: "Picture in Picture",
      open_native: "Mở luồng gốc",
      quick_switch: "Chuyển kênh nhanh",
      add_custom: "Thêm kênh mới",
    };
    return names[id] || id;
  };

  const [mergeSearchToDock, setMergeSearchToDock] = useState<boolean>(() => {
    return localStorage.getItem("vplay_merge_search_to_dock") === "true";
  });

  useEffect(() => {
    localStorage.setItem(
      "vplay_merge_search_to_dock",
      String(mergeSearchToDock),
    );
  }, [mergeSearchToDock]);

  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (selectedChannel && selectedChannel.name) {
      setToastMessage(selectedChannel.name);
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [selectedChannel.id]);

  // Favorite Channels State
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("glass_tv_favorites");
    return saved
      ? JSON.parse(saved)
      : ["vtv1", "vtv3", "vl1", "cartoon-network"];
  });

  const isFavorite = (channelId: string) => {
    return favorites.includes(channelId);
  };

  // Player configurations
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem("glass_tv_volume");
    return saved ? parseFloat(saved) : 0.8;
  });

  const [muted, setMuted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showVtv5Popup, setShowVtv5Popup] = useState<boolean>(false);
  const [showEventFeedPopup, setShowEventFeedPopup] = useState<boolean>(false);
  const vtv5Options = useMemo(() => {
    const v5 = processedChannels.find((ch) => ch.id === "vtv5");
    const v5Tnb = processedChannels.find((ch) => ch.id === "vtv5_tnb");
    const v5Tn = processedChannels.find((ch) => ch.id === "vtv5_tn");

    return [
      {
        ...(v5 || {
          id: "vtv5",
          name: "VTV5",
          url: "",
          group: "VTV",
          logoText: "VTV5",
          logoBg: "bg-gradient-to-br from-emerald-600 to-emerald-800",
        }),
        name: "VTV5 Quốc gia",
      },
      {
        ...(v5Tnb || {
          id: "vtv5_tnb",
          name: "VTV5 Tây Nam Bộ",
          url: "",
          group: "VTV",
          logoText: "VTV5 TNB",
          logoBg: "bg-gradient-to-br from-emerald-600 to-emerald-800",
        }),
        name: "VTV5 Tây Nam Bộ",
      },
      {
        ...(v5Tn || {
          id: "vtv5_tn",
          name: "VTV5 Tây Nguyên",
          url: "",
          group: "VTV",
          logoText: "VTV5 TN",
          logoBg: "bg-gradient-to-br from-emerald-600 to-emerald-800",
        }),
        name: "VTV5 Tây Nguyên",
      },
    ];
  }, []);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState<boolean>(false);



  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sidebarFileOpen, setSidebarFileOpen] = useState<boolean>(true);
  const [sidebarPluginsOpen, setSidebarPluginsOpen] = useState<boolean>(true);
  const [sidebarFavoritesOpen, setSidebarFavoritesOpen] =
    useState<boolean>(true);
  const [sidebarHelpOpen, setSidebarHelpOpen] = useState<boolean>(false);
  const [sidebarPowerOpen, setSidebarPowerOpen] = useState<boolean>(false);
  const [sidebarSettingsOpen, setSidebarSettingsOpen] =
    useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showFactoryResetConfirmModal, setShowFactoryResetConfirmModal] =
    useState<boolean>(false);
  const [showResetSplash, setShowResetSplash] = useState<boolean>(false);
  const [resetCountdown, setResetCountdown] = useState<number>(60);

  const startFactoryResetCountdown = () => {
    setShowResetSplash(true);
    setResetCountdown(60);
    const interval = setInterval(() => {
      setResetCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          localStorage.clear();
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  const [showDropdownMenu, setShowDropdownMenu] = useState<boolean>(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuCoords, setMenuCoords] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const updateMenuCoords = () => {
    if (menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setMenuCoords({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
  };

  useEffect(() => {
    if (showDropdownMenu && activeTab === "live") {
      updateMenuCoords();
      const handleScrollAndResize = () => {
        updateMenuCoords();
      };
      window.addEventListener("resize", handleScrollAndResize);
      window.addEventListener("scroll", handleScrollAndResize, {
        capture: true,
        passive: true,
      });
      return () => {
        window.removeEventListener("resize", handleScrollAndResize);
        window.removeEventListener("scroll", handleScrollAndResize, {
          capture: true,
        });
      };
    }
  }, [showDropdownMenu, activeTab]);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [showClock, setShowClock] = useState<boolean>(() => {
    const saved = localStorage.getItem("vplay360_show_clock");
    return saved !== null ? saved === "true" : true;
  });

  const toggleShowClock = () => {
    setShowClock((prev) => {
      const next = !prev;
      localStorage.setItem("vplay360_show_clock", String(next));
      return next;
    });
  };

  const exportChannelsToM3u8 = () => {
    let m3u8Content = "#EXTM3U\n";
    allAvailableCategoryList.forEach((category) => {
      category.channels.forEach((channel) => {
        const tvgId = channel.id;
        const tvgName = channel.name;
        const groupTitle = category.name;
        const logo = channel.logoImg || "";
        m3u8Content += `#EXTINF:-1 tvg-id="${tvgId}" tvg-name="${tvgName}" tvg-logo="${logo}" group-title="${groupTitle}",${channel.name}\n`;
        m3u8Content += `${channel.url}\n`;
      });
    });

    const blob = new Blob([m3u8Content], {
      type: "application/x-mpegurl;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "WavesCommunity_channel.m3u8";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Custom M3U8 Url link adder
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [showRemoteModal, setShowRemoteModal] = useState<boolean>(false);
  const [remoteInputValue, setRemoteInputValue] = useState<string>("");
  const [showCopiedNotify, setShowCopiedNotify] = useState<boolean>(false);
  const [activeSettingSection, setActiveSettingSection] = useState<
    string | null
  >(null);

  // News Font Size Customization State
  const [newsFontSize, setNewsFontSize] = useState<NewsFontSize>(() => {
    const saved = localStorage.getItem("waves_news_font_size");
    return (saved as NewsFontSize) || "normal";
  });

  const handleUpdateNewsFontSize = (size: NewsFontSize) => {
    setNewsFontSize(size);
    localStorage.setItem("waves_news_font_size", size);
    playPopSound();
    const labels: Record<NewsFontSize, string> = {
      small: "Nhỏ (14px)",
      normal: "Tiêu chuẩn (16px)",
      large: "Lớn (18px)",
      huge: "Rất lớn (20px)",
    };
    triggerToast(`Đã chọn cỡ chữ tin tức: ${labels[size]}`);
  };

  // Tab Loading State (2 seconds inline page loading on tab switch)
  const [isTabLoading, setIsTabLoading] = useState<boolean>(false);
  const isFirstTabMount = useRef(true);

  useEffect(() => {
    if (isFirstTabMount.current) {
      isFirstTabMount.current = false;
      return;
    }
    setIsTabLoading(true);
    const timer = setTimeout(() => {
      setIsTabLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [activeTab, activeSettingSection]);

  // Sidebar Loading State (2 seconds AFTER splash screen finishes)
  const [isSidebarLoading, setIsSidebarLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!showSplash) {
      setIsSidebarLoading(true);
      const timer = setTimeout(() => {
        setIsSidebarLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  // Lock scrolling when page is loading
  useEffect(() => {
    if (isTabLoading) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isTabLoading]);

  // Header Bar state (Always On Top header bar)
  const [showHeaderBar, setShowHeaderBar] = useState<boolean>(() => {
    const saved = localStorage.getItem("vplay360_show_header_bar");
    return saved !== null ? saved === "true" : false;
  });

  useEffect(() => {
    localStorage.setItem("vplay360_show_header_bar", String(showHeaderBar));
  }, [showHeaderBar]);

  // Audio Pop Sound Synthesizer (Medium-High pitch pop tone)
  const playPopSound = () => {
    try {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1300, ctx.currentTime + 0.03);
      osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch (e) {
      // Ignore audio context autoplay restriction
    }
  };

  const getShortChannelName = (channel: Channel | null): string => {
    if (!channel || !channel.name) return "";
    let name = channel.name;
    if (name.includes(" - ")) {
      const parts = name.split(" - ");
      name = parts[parts.length - 1].trim();
    } else {
      name = name.replace(/^Truyền hình\s+/i, "").trim();
    }
    return name;
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "home":
        return "HOME";
      case "live": {
        const channelShort = selectedChannel
          ? getShortChannelName(selectedChannel)
          : "";
        return channelShort ? `LIVE TV - ${channelShort}` : "LIVE TV";
      }
      case "news":
        return "NEWS & COMMUNITY";
      case "notifications":
        return "THÔNG BÁO";
      case "settings":
        if (activeSettingSection === "design_system")
          return "DESIGN COMPONENTS";
        if (activeSettingSection === "about") return "VỀ WAVES COMMUNITY";
        return "CÀI ĐẶT";
      case "search":
        return "SPOTLIGHT SEARCH";
      case "plugin_store":
        return "CỬA HÀNG TIỆN ÍCH";
      case "profile":
        return "TÀI KHOẢN & DỮ LIỆU";
      default:
        return activeTab ? activeTab.toUpperCase() : "WAVES COMMUNITY";
    }
  };
  const [playbackError, setPlaybackError] = useState<boolean>(false);
  const [playbackErrorType, setPlaybackErrorType] = useState<
    "standard" | "timeout" | null
  >(null);
  const notifyTimeoutRef = useRef<any>(null);

  // Multiview states
  const [isMultiviewMode, setIsMultiviewMode] = useState<boolean>(false);
  const [multiviewCount, setMultiviewCount] = useState<number>(4);
  const [multiviewChannels, setMultiviewChannels] = useState<
    (Channel | null)[]
  >([]);
  const [showMultiviewSelectorPopup, setShowMultiviewSelectorPopup] =
    useState<boolean>(false);
  const [showMultiviewChannelPickerPopup, setShowMultiviewChannelPickerPopup] =
    useState<boolean>(false);
  const [activeMultiviewSlotIndex, setActiveMultiviewSlotIndex] = useState<
    number | null
  >(null);
  const [pickerSearchQuery, setPickerSearchQuery] = useState<string>("");

  // Picture in Picture states
  const [isPiPActive, setIsPiPActive] = useState<boolean>(false);

  // Waves Community Plugin states
  const [installedPlugins, setInstalledPlugins] = useState<{
    [key: string]: "idle" | "installing" | "installed" | "uninstalling";
  }>(() => {
    const defaultState: {
      [key: string]: "idle" | "installing" | "installed" | "uninstalling";
    } = {
      export_stream: "idle",
      multiview: "idle",
      pip: "idle",
      open_native: "idle",
      quick_switch: "idle",
      add_custom: "idle",
    };
    const saved = localStorage.getItem("vplay_installed_plugins");
    if (saved) {
      try {
        return { ...defaultState, ...JSON.parse(saved) };
      } catch (e) {
        return defaultState;
      }
    }
    return defaultState;
  });
  const [pluginProgress, setPluginProgress] = useState<{
    [key: string]: number;
  }>({});
  const [showPluginRequiredModal, setShowPluginRequiredModal] =
    useState<boolean>(false);
  const [pluginToUninstall, setPluginToUninstall] = useState<any | null>(null);
  const [requiredPluginFeatureName, setRequiredPluginFeatureName] =
    useState<string>("Xuất luồng");
  const [pluginSearchQuery, setPluginSearchQuery] = useState<string>("");
  const [settingsSearchQuery, setSettingsSearchQuery] = useState<string>("");
  const [settingDetailSearchQuery, setSettingDetailSearchQuery] =
    useState<string>("");
  const [showPinChannelPopup, setShowPinChannelPopup] =
    useState<boolean>(false);
  const [pinChannelSearchQuery, setPinChannelSearchQuery] =
    useState<string>("");
  const [pinChannelSelectedCategory, setPinChannelSelectedCategory] =
    useState<string>("all");

  // Initial navigation targets for V-Apps and V-Premium from Spotlight search
  const [vAppsInitialApp, setVAppsInitialApp] = useState<string>("v_arcade");
  const [vArcadeInitialGame, setVArcadeInitialGame] = useState<string | null>(null);
  const [vPremiumInitialSubTab, setVPremiumInitialSubTab] = useState<"vbank" | "storage" | "verified">("vbank");

  const navigateToVApp = (appId: string, gameId: string | null = null) => {
    setVAppsInitialApp(appId);
    setVArcadeInitialGame(gameId);
    setActiveTab("vapps");
  };

  const navigateToVPremium = (subTab: "vbank" | "storage" | "verified" = "vbank") => {
    setVPremiumInitialSubTab(subTab);
    setActiveTab("vpremium");
  };

  // Spotlight Search Customization Settings
  const DEFAULT_SPOTLIGHT_SEARCH_SETTINGS = {
    categories: true, // Danh mục (Tabs & Navigation)
    vapps: true, // V-Apps & 5 Games V-Arcade, V-Files, V-Learn...
    vpremium: true, // V-Premium: Gói V-Cloud Storage, V-Bank, Verified
    news: true, // Tin tức (News & Announcements)
    channels: true, // Truyền hình (TV Channels)
    channelNumbers: true, // Tìm kênh theo số hiệu kênh (mục nhỏ của Truyền hình)
    toolbox: true, // Toolbox (Công cụ & Tiện ích)
    settings: true, // Cài đặt (Cài đặt hệ thống)
  };

  const [spotlightSearchSettings, setSpotlightSearchSettings] = useState(() => {
    const saved = localStorage.getItem("vplay_spotlight_search_settings");
    if (saved) {
      try {
        return { ...DEFAULT_SPOTLIGHT_SEARCH_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SPOTLIGHT_SEARCH_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(
      "vplay_spotlight_search_settings",
      JSON.stringify(spotlightSearchSettings),
    );
  }, [spotlightSearchSettings]);

  const isSpotlightAllDisabled =
    !spotlightSearchSettings.categories &&
    !spotlightSearchSettings.vapps &&
    !spotlightSearchSettings.vpremium &&
    !spotlightSearchSettings.news &&
    !spotlightSearchSettings.channels &&
    !spotlightSearchSettings.toolbox &&
    !spotlightSearchSettings.settings;

  const [dockItems, setDockItems] = useState<
    { id: string; label: string; enabled: boolean }[]
  >(() => {
    const DEFAULT_DOCK_ITEMS = [
      { id: "home", label: "Home", enabled: true },
      { id: "search", label: "Spotlight Search", enabled: true },
      { id: "live", label: "V-Play", enabled: true },
      { id: "vapps", label: "V-Apps", enabled: true },
      { id: "vpremium", label: "V-Premium", enabled: true },
      { id: "news", label: "News", enabled: true },
      { id: "remote", label: "Chuyển kênh", enabled: true },
      { id: "profile", label: "Hồ sơ", enabled: false },
      { id: "plugin_store", label: "Cửa hàng tiện ích", enabled: false },
      { id: "settings", label: "Cài đặt", enabled: true },
      { id: "about", label: "Về ứng dụng này", enabled: false },
      { id: "reload", label: "Tải lại ứng dụng", enabled: false },
      { id: "pin", label: "Ghim kênh bất kỳ", enabled: false },
    ];
    const saved = localStorage.getItem("vplay_dock_items");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const filtered = parsed.filter(
          (it: any) =>
            it.id !== "search" && it.id !== "home" && it.id !== "settings",
        );
        const homeItem = parsed.find((it: any) => it.id === "home") || {
          id: "home",
          label: "Home",
          enabled: true,
        };
        const searchItem = parsed.find((it: any) => it.id === "search") || {
          id: "search",
          label: "Spotlight Search",
          enabled: true,
        };
        const settingsItem = parsed.find((it: any) => it.id === "settings") || {
          id: "settings",
          label: "Cài đặt",
          enabled: true,
        };
        searchItem.label = "Spotlight Search";
        searchItem.enabled = true;

        // Put settings right before about/reload/pin
        const aboutIndex = filtered.findIndex((it: any) => it.id === "about");
        const merged = [homeItem, searchItem];
        if (aboutIndex !== -1) {
          const beforeAbout = filtered.slice(0, aboutIndex);
          const afterAbout = filtered.slice(aboutIndex);
          merged.push(...beforeAbout, settingsItem, ...afterAbout);
        } else {
          const reloadIndex = filtered.findIndex(
            (it: any) => it.id === "reload" || it.id === "pin",
          );
          if (reloadIndex !== -1) {
            const before = filtered.slice(0, reloadIndex);
            const after = filtered.slice(reloadIndex);
            merged.push(...before, settingsItem, ...after);
          } else {
            merged.push(...filtered, settingsItem);
          }
        }

        // Ensure news is inserted right after live if newly added
        if (!merged.find((it: any) => it.id === "news")) {
          const liveIndex = merged.findIndex((it) => it.id === "live");
          if (liveIndex !== -1) {
            merged.splice(liveIndex + 1, 0, {
              id: "news",
              label: "News",
              enabled: true,
            });
          } else {
            merged.push({ id: "news", label: "News", enabled: true });
          }
        }

        DEFAULT_DOCK_ITEMS.forEach((defItem) => {
          if (!merged.find((item) => item.id === defItem.id)) {
            if (defItem.id === "settings") {
              // already there, but let's be safe
            } else {
              const sIndex = merged.findIndex((item) => item.id === "settings");
              if (
                defItem.id === "about" ||
                defItem.id === "reload" ||
                defItem.id === "pin"
              ) {
                merged.push(defItem);
              } else {
                if (sIndex !== -1) {
                  merged.splice(sIndex, 0, defItem);
                } else {
                  merged.push(defItem);
                }
              }
            }
          }
        });
        return merged;
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_DOCK_ITEMS;
  });

  useEffect(() => {
    localStorage.setItem("vplay_dock_items", JSON.stringify(dockItems));
  }, [dockItems]);

  useEffect(() => {
    setSettingDetailSearchQuery("");
  }, [activeSettingSection]);

  const moveDockItem = (index: number, direction: "up" | "down") => {
    const newItems = [...dockItems];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    // Swap
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setDockItems(newItems);
  };

  const toggleDockItem = (id: string) => {
    const item = dockItems.find((it) => it.id === id);
    if (!item) return;

    if (item.enabled) {
      // Trying to disable an item.
      const enabledCount = dockItems.filter((it) => it.enabled).length;
      if (enabledCount <= 1) {
        alert("Bạn phải giữ lại ít nhất một mục hiển thị trên thanh Dock!");
        return;
      }
      setDockItems((prev) =>
        prev.map((it) => {
          if (it.id === id) {
            return { ...it, enabled: false };
          }
          return it;
        }),
      );
    } else {
      // Trying to enable an item.
      const currentRenderedCount = dockItems.filter(
        (it) => it.enabled && (mergeSearchToDock || it.id !== "search"),
      ).length;
      const willBeRendered = mergeSearchToDock || id !== "search";

      if (willBeRendered && currentRenderedCount >= 5) {
        triggerToast("Thanh dock chỉ chứa được 5 mục");
        return;
      }

      setDockItems((prev) =>
        prev.map((it) => {
          if (it.id === id) {
            return { ...it, enabled: true };
          }
          return it;
        }),
      );
    }
  };

  const getDockItemConfig = (id: string) => {
    switch (id) {
      case "home":
        return {
          icon: "https://static.wikia.nocookie.net/ep-deo/images/6/6e/New_hom.png/revision/latest?cb=20260722124341",
          label: "Home",
          isImg: true,
        };
      case "live":
        return { icon: Tv, label: "V-Play", isImg: false };
      case "vapps":
        return { icon: Grid, label: "V-Apps", isImg: false };
      case "vpremium":
        return { icon: Crown, label: "V-Premium", isImg: false };
      case "news":
        return { icon: Megaphone, label: "News", isImg: false };
      case "settings":
        return { icon: Settings, label: "Cài đặt", isImg: false };
      case "search":
        return {
          icon: "https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest/scale-to-width-down/1000?cb=20260717131751",
          label: "Spotlight Search",
          isImg: true,
        };
      case "profile":
        return { icon: User, label: "Hồ sơ", isImg: false };
      case "remote":
        return {
          icon: "https://static.wikia.nocookie.net/ep-deo/images/a/a3/Remote.png/revision/latest?cb=20260629015905",
          label: "Chuyển kênh",
          isImg: true,
        };
      case "plugin_store":
        return { icon: ShoppingBag, label: "Cửa hàng tiện ích", isImg: false };
      case "about":
        return { icon: Info, label: "Giới thiệu", isImg: false };
      case "reload":
        return { icon: RefreshCw, label: "Tải lại", isImg: false };
      case "pin":
        return { icon: Pin, label: "Ghim kênh", isImg: false };
      default:
        return { icon: HelpCircle, label: "Khác", isImg: false };
    }
  };

  const isDockItemActive = (id: string) => {
    switch (id) {
      case "home":
        return activeTab === "home";
      case "live":
        return activeTab === "live";
      case "vapps":
        return activeTab === "vapps";
      case "vpremium":
        return activeTab === "vpremium";
      case "news":
        return activeTab === "news";
      case "settings":
        return activeTab === "settings" && activeSettingSection === null;
      case "search":
        return activeTab === "search";
      case "profile":
        return activeTab === "settings" && activeSettingSection === "profile";
      case "plugin_store":
        return (
          activeTab === "settings" && activeSettingSection === "plugin_store"
        );
      default:
        return false;
    }
  };

  const handleDockItemClick = (id: string) => {
    switch (id) {
      case "home":
        setActiveTab("home");
        break;
      case "live":
        setActiveTab("live");
        break;
      case "vapps":
        setActiveTab("vapps");
        break;
      case "vpremium":
        setActiveTab("vpremium");
        break;
      case "news":
        setActiveTab("news");
        break;
      case "settings":
        setActiveTab("settings");
        setActiveSettingSection(null);
        break;
      case "search":
        if (isSpotlightAllDisabled) {
          setShowSpotlightDisabledModal(true);
          return;
        }
        setPrevTab(activeTab as any);
        setActiveTab("search");
        break;
      case "profile":
        setActiveTab("settings");
        setActiveSettingSection("profile");
        break;
      case "plugin_store":
        setActiveTab("settings");
        setActiveSettingSection("plugin_store");
        break;
      case "remote":
        if (installedPlugins.quick_switch !== "installed") {
          setRequiredPluginFeatureName("Chuyển kênh nhanh");
          setShowPluginRequiredModal(true);
        } else {
          setShowRemoteModal(true);
          setRemoteInputValue("");
        }
        break;
      case "about":
        setShowAboutModal(true);
        break;
      case "reload":
        window.location.reload();
        break;
      case "pin":
        setPinChannelSearchQuery("");
        setPinChannelSelectedCategory("all");
        setShowPinChannelPopup(true);
        break;
      default:
        break;
    }
    if (isMobile) {
      setShowMobileSidebar(false);
    }
  };

  useEffect(() => {
    localStorage.setItem(
      "vplay_installed_plugins",
      JSON.stringify(installedPlugins),
    );
  }, [installedPlugins]);

  // Handle active installation and uninstallation countdowns
  useEffect(() => {
    const activeIds = Object.keys(installedPlugins).filter(
      (id) =>
        installedPlugins[id] === "installing" ||
        installedPlugins[id] === "uninstalling",
    );
    if (activeIds.length === 0) return;

    const interval = setInterval(() => {
      setInstalledPlugins((prev) => {
        const copy = { ...prev };
        let updated = false;

        activeIds.forEach((id) => {
          const status = prev[id];
          const maxTime = status === "installing" ? 30 : 10;
          const currentProgress = pluginProgress[id] ?? maxTime;

          if (currentProgress <= 1) {
            const pluginTitle = getPluginName(id);
            if (status === "installing") {
              triggerToast(
                `Cài đặt thành công gói tiện ích **${pluginTitle}**`,
              );
            } else if (status === "uninstalling") {
              triggerToast(
                `Gỡ cài đặt thành công gói tiện ích **${pluginTitle}**`,
              );
            }
            copy[id] = status === "installing" ? "installed" : "idle";
            setPluginProgress((p) => {
              const cp = { ...p };
              delete cp[id];
              return cp;
            });
            updated = true;
          } else {
            setPluginProgress((p) => ({
              ...p,
              [id]: currentProgress - 1,
            }));
          }
        });

        if (updated) {
          return copy;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [installedPlugins, pluginProgress]);

  const startInstallPlugin = (id: string) => {
    setInstalledPlugins((prev) => ({
      ...prev,
      [id]: "installing",
    }));
    setPluginProgress((prev) => ({
      ...prev,
      [id]: 30,
    }));
  };

  const startUninstallPlugin = (id: string) => {
    setInstalledPlugins((prev) => ({
      ...prev,
      [id]: "uninstalling",
    }));
    setPluginProgress((prev) => ({
      ...prev,
      [id]: 10,
    }));
  };

  const handleOpenMultiviewSelector = () => {
    setShowMultiviewSelectorPopup(true);
  };

  const handleSelectMultiviewCount = (count: number) => {
    setMultiviewCount(count);
    setIsMultiviewMode(true);

    // Initialize multiview channels with existing selectedChannel in slot 0, and null for the rest
    const initialChannels: (Channel | null)[] = Array(count).fill(null);
    if (selectedChannel) {
      initialChannels[0] = selectedChannel;
    }
    setMultiviewChannels(initialChannels);
  };

  const handleOpenChannelPickerForSlot = (index: number) => {
    setActiveMultiviewSlotIndex(index);
    setPickerSearchQuery("");
    setShowMultiviewChannelPickerPopup(true);
  };

  const handleRemoveChannelFromSlot = (index: number) => {
    setMultiviewChannels((prev) => {
      const copy = [...prev];
      copy[index] = null;
      return copy;
    });
  };

  const handleSelectChannelForSlot = (channel: Channel) => {
    if (activeMultiviewSlotIndex !== null) {
      setMultiviewChannels((prev) => {
        const copy = [...prev];
        copy[activeMultiviewSlotIndex] = channel;
        return copy;
      });
    }
  };

  const handleTogglePictureInPicture = () => {
    setIsPiPActive((prev) => !prev);
  };

  useEffect(() => {
    return () => {
      if (notifyTimeoutRef.current) {
        clearTimeout(notifyTimeoutRef.current);
      }
    };
  }, []);
  const [customChannelName, setCustomChannelName] = useState<string>("");
  const [customChannelUrl, setCustomChannelUrl] = useState<string>("");
  const [customChannelGroup, setCustomChannelGroup] = useState<string>("VTV");
  const [customGroupInput, setCustomGroupInput] =
    useState<string>("Nhóm Kênh Mới");
  const [customChannels, setCustomChannels] = useState<Channel[]>(() => {
    const saved = localStorage.getItem("glass_tv_custom_list");
    return saved ? JSON.parse(saved) : [];
  });

  // Ambient lights themes configuration (default: sunset)
  const [bgColor, setBgColor] = useState<
    "cosmic" | "deep" | "aurora" | "sunset"
  >("sunset");
  const [amoledDark, setAmoledDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("glass_tv_amoled_dark");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("glass_tv_amoled_dark", amoledDark ? "true" : "false");
  }, [amoledDark]);

  // Experimental states
  const [expLowLatency, setExpLowLatency] = useState<boolean>(
    () => localStorage.getItem("vplay_exp_lowlatency") === "true",
  );
  const [expCache, setExpCache] = useState<boolean>(
    () => localStorage.getItem("vplay_exp_cache") === "true",
  );
  const [expAmbientGlow, setExpAmbientGlow] = useState<boolean>(
    () => localStorage.getItem("vplay_exp_glow") === "true",
  );
  const [expVIntelligence, setExpVIntelligence] = useState<boolean>(
    () => localStorage.getItem("vplay_exp_vintel") !== "false",
  );

  const [dockToSidebar, setDockToSidebar] = useState<boolean>(() => {
    return localStorage.getItem("vplay_dock_to_sidebar") === "true";
  });
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(() => {
    return localStorage.getItem("vplay_sidebar_expanded") !== "false";
  });
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    localStorage.setItem("vplay_dock_to_sidebar", String(dockToSidebar));
  }, [dockToSidebar]);

  useEffect(() => {
    localStorage.setItem("vplay_sidebar_expanded", String(sidebarExpanded));
  }, [sidebarExpanded]);
  const [testStreamUrl, setTestStreamUrl] = useState<string>("");
  const [directStreamUrl, setDirectStreamUrl] = useState<string>("");

  // Fandom Logos States
  const [showFandomModal, setShowFandomModal] = useState<boolean>(false);
  const [fandomLang, setFandomLang] = useState<"vi" | "uk">("vi");
  const [fandomPageName, setFandomPageName] = useState<string>("");
  const [fandomLoading, setFandomLoading] = useState<boolean>(false);
  const [fandomError, setFandomError] = useState<string | null>(null);
  const [fandomData, setFandomData] = useState<{
    title: string;
    sections: Array<{
      heading: string;
      logos: Array<{ url: string; originalUrl: string; caption: string }>;
    }>;
  } | null>(null);

  const handleFandomInputChange = (value: string) => {
    setFandomPageName(value);

    // Check if user pasted a full fandom link
    if (value.startsWith("http://") || value.startsWith("https://")) {
      try {
        const urlObj = new URL(value);
        if (urlObj.hostname === "logos.fandom.com") {
          const pathParts = urlObj.pathname.split("/").filter(Boolean);
          if (pathParts[0] === "vi" && pathParts[1] === "wiki") {
            setFandomLang("vi");
            setFandomPageName(decodeURIComponent(pathParts[2]));
          } else if (pathParts[0] === "wiki") {
            setFandomLang("uk");
            setFandomPageName(decodeURIComponent(pathParts[1]));
          }
        }
      } catch (err) {
        // Safe to ignore URL parsing errors
      }
    }
  };

  const handleGenerateFandomLogos = async () => {
    if (!fandomPageName.trim()) {
      setFandomError("Vui lòng điền tên trang hoặc đường link.");
      return;
    }

    setFandomLoading(true);
    setFandomError(null);

    let targetUrl = "";
    const cleanName = fandomPageName.trim();
    if (cleanName.startsWith("http://") || cleanName.startsWith("https://")) {
      targetUrl = cleanName;
    } else {
      if (fandomLang === "vi") {
        targetUrl = `https://logos.fandom.com/vi/wiki/${encodeURIComponent(cleanName)}`;
      } else {
        targetUrl = `https://logos.fandom.com/wiki/${encodeURIComponent(cleanName)}`;
      }
    }

    try {
      const response = await fetch("/api/fandom-logos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Không thể tải logo.");
      }

      setFandomData(data);
      setActiveTab("fandom_logos");
      setShowFandomModal(false);
      triggerToast("Đã tải toàn bộ logo thành công!");
    } catch (err: any) {
      setFandomError(err.message || "Đã xảy ra lỗi.");
    } finally {
      setFandomLoading(false);
    }
  };
  const [showPlayUrlModal, setShowPlayUrlModal] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [showThankYouModal, setShowThankYouModal] = useState<boolean>(false);
  const [showTestVplayConfirmModal, setShowTestVplayConfirmModal] =
    useState<boolean>(false);
  const [showSpotlightDisabledModal, setShowSpotlightDisabledModal] =
    useState<boolean>(false);

  // Global Shortcut for Spotlight Search (Cmd+K / Ctrl+K and ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isSpotlightAllDisabled) {
          setShowSpotlightDisabledModal(true);
          return;
        }
        setIsSpotlightOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isSpotlightOpen) {
        e.preventDefault();
        setIsSpotlightOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSpotlightOpen, isSpotlightAllDisabled]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showPowerDropdown, setShowPowerDropdown] = useState<boolean>(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);
  const [isSleepMode, setIsSleepMode] = useState<boolean>(false);
  const [menubarSearchQuery, setMenubarSearchQuery] = useState<string>("");
  const [isSpotlightFocused, setIsSpotlightFocused] = useState<boolean>(false);
  const [spotlightCategoryFilter, setSpotlightCategoryFilter] =
    useState<string>("all");
  const [showSpotlightFilter, setShowSpotlightFilter] =
    useState<boolean>(false);
  const [quickChatInput, setQuickChatInput] = useState<string>("");

  const allChannelsList = useMemo(() => {
    return CATEGORIES.flatMap((cat) => cat.channels);
  }, []);

  // Random Suggestion States
  const [showRandomSuggestModal, setShowRandomSuggestModal] =
    useState<boolean>(false);
  const [randomSuggestCategories, setRandomSuggestCategories] = useState<
    string[]
  >([]);
  const [randomSuggestContents, setRandomSuggestContents] = useState<string[]>(
    [],
  );
  const [randomSuggestLetters, setRandomSuggestLetters] = useState<string[]>(
    [],
  );
  const [openCatDropdown, setOpenCatDropdown] = useState<boolean>(false);
  const [openContentDropdown, setOpenContentDropdown] =
    useState<boolean>(false);
  const [openLetterDropdown, setOpenLetterDropdown] = useState<boolean>(false);

  // V-Intelligence Session Interface
  interface VIntelSession {
    id: string;
    title: string;
    timestamp: string;
    messages: {
      role: string;
      content: string;
      recommendedChannels?: string[];
      action?: any;
    }[];
    mode: "chat" | "search";
  }

  // V-Intelligence panel states
  const [showVIntel, setShowVIntel] = useState<boolean>(false);
  const [vIntelIconSpinning, setVIntelIconSpinning] = useState<boolean>(false);
  const [vIntelMode, setVIntelMode] = useState<
    "chat" | "search" | "settings" | "history"
  >("chat");
  const [vIntelUserName, setVIntelUserName] = useState<string>(
    () => localStorage.getItem("vplay_vintel_user_name") || "",
  );
  const [vIntelSmartAction, setVIntelSmartAction] = useState<boolean>(
    () => localStorage.getItem("vplay_vintel_smart_action") !== "false",
  );
  const [vIntelHistorySearchQuery, setVIntelHistorySearchQuery] =
    useState<string>("");
  const [vIntelSearchTabQuery, setVIntelSearchTabQuery] = useState<string>("");
  const [vIntelToast, setVIntelToast] = useState<{
    message: string;
    id: number;
  } | null>(null);

  const triggerVIntelToast = (message: string) => {
    setVIntelToast({ message, id: Date.now() });
  };

  useEffect(() => {
    if (vIntelToast) {
      const t = setTimeout(() => {
        setVIntelToast(null);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [vIntelToast]);

  const [vIntelSessions, setVIntelSessions] = useState<VIntelSession[]>(() => {
    const saved = localStorage.getItem("vplay_vintel_sessions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: "default",
        title: "Cuộc trò chuyện mặc định",
        timestamp: new Date().toLocaleString("vi-VN"),
        messages: [
          {
            role: "model",
            content:
              "Xin chào! Tôi là Firesteel, trợ lý AI thông minh của bạn tại Waves Community. Tôi có thể giúp gì cho bạn hôm nay?",
          },
        ],
        mode: "chat",
      },
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return localStorage.getItem("vplay_vintel_active_session_id") || "default";
  });

  const [vIntelMessages, setVIntelMessages] = useState<
    {
      role: string;
      content: string;
      recommendedChannels?: string[];
      action?: any;
    }[]
  >(() => {
    const savedSess = localStorage.getItem("vplay_vintel_sessions");
    const activeId =
      localStorage.getItem("vplay_vintel_active_session_id") || "default";
    if (savedSess) {
      try {
        const parsed = JSON.parse(savedSess);
        const activeSess = parsed.find((s: any) => s.id === activeId);
        if (activeSess && activeSess.messages) {
          return activeSess.messages;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        role: "model",
        content:
          "Xin chào! Tôi là Firesteel, trợ lý AI thông minh của bạn tại Waves Community. Tôi có thể giúp gì cho bạn hôm nay?",
      },
    ];
  });

  const [editingMessageIdx, setEditingMessageIdx] = useState<number | null>(
    null,
  );
  const [editingMessageContent, setEditingMessageContent] =
    useState<string>("");

  const [vIntelInput, setVIntelInput] = useState<string>("");
  const [vIntelLoading, setVIntelLoading] = useState<boolean>(false);
  const vIntelFileRef = useRef<HTMLInputElement>(null);
  const [vIntelAttachedFile, setVIntelAttachedFile] = useState<File | null>(
    null,
  );

  useEffect(() => {
    localStorage.setItem("vplay_vintel_user_name", vIntelUserName);
  }, [vIntelUserName]);

  useEffect(() => {
    localStorage.setItem(
      "vplay_vintel_smart_action",
      String(vIntelSmartAction),
    );
  }, [vIntelSmartAction]);

  useEffect(() => {
    localStorage.setItem(
      "vplay_vintel_sessions",
      JSON.stringify(vIntelSessions),
    );
  }, [vIntelSessions]);

  useEffect(() => {
    localStorage.setItem("vplay_vintel_active_session_id", activeSessionId);
  }, [activeSessionId]);

  // Design System Demo states
  const [demoToggleState, setDemoToggleState] = useState<boolean>(false);
  const [activeDockDemoTab, setActiveDockDemoTab] = useState<string>("home");
  const [demoSliderVal, setDemoSliderVal] = useState<number>(0.45);
  const [showDemoDesignSystemModal, setShowDemoDesignSystemModal] =
    useState<boolean>(false);
  const [designSystemThemeColor, setDesignSystemThemeColor] =
    useState<string>("#ff9502");
  const [demoCheckboxState, setDemoCheckboxState] = useState<boolean>(false);
  const [demoInputText, setDemoInputText] = useState<string>(
    "Waves Community Refresh",
  );
  const [demoTooltipVisible, setDemoTooltipVisible] = useState<boolean>(false);
  const [demoSnackbarVisible, setDemoSnackbarVisible] =
    useState<boolean>(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("vplay_exp_lowlatency", String(expLowLatency));
  }, [expLowLatency]);

  useEffect(() => {
    localStorage.setItem("vplay_exp_cache", String(expCache));
  }, [expCache]);

  useEffect(() => {
    localStorage.setItem("vplay_exp_glow", String(expAmbientGlow));
  }, [expAmbientGlow]);

  useEffect(() => {
    localStorage.setItem("vplay_exp_vintel", String(expVIntelligence));
  }, [expVIntelligence]);

  // Filter & Search logic
  // Join general channels and custom channels
  const allAvailableCategoryList = useMemo(() => {
    if (customChannels.length === 0) return CATEGORIES;

    // Find the max channel number among regular channels to continue the sequence
    const regularChannels = CATEGORIES.flatMap((cat) => cat.channels);
    const wildLive = regularChannels.find(
      (ch) => ch.id === "vietnam-wild-live",
    );
    const lastNum =
      wildLive && wildLive.channelNumber
        ? parseInt(wildLive.channelNumber, 10)
        : regularChannels.length;

    const formattedCustomChannels = customChannels.map((ch, idx) => {
      const customNum = String(lastNum + 1 + idx).padStart(3, "0");
      return {
        ...ch,
        channelNumber: customNum,
      };
    });

    // Add custom category dynamically if there are custom channels
    const customCategory: Category = {
      id: "custom",
      name: "Kênh Tự Thêm (Cá Nhân)",
      description: "Danh sách luồng phát m3u8 tự liên kết",
      channels: formattedCustomChannels,
    };
    return [...CATEGORIES, customCategory];
  }, [customChannels]);

  // Flattened channel list for easy global lookup/search
  const flattenedChannels = useMemo(() => {
    return allAvailableCategoryList.flatMap((cat) => cat.channels);
  }, [allAvailableCategoryList]);

  const menubarSearchResults = useMemo(() => {
    const q = menubarSearchQuery.trim().toLowerCase();

    // First, filter by category if a specific category is selected
    let channelsToSearch = allChannelsList;
    if (spotlightCategoryFilter !== "all") {
      const targetCat = allAvailableCategoryList.find(
        (cat) => cat.id === spotlightCategoryFilter,
      );
      if (targetCat) {
        channelsToSearch = targetCat.channels;
      }
    }

    // If no search query and category is "all", return empty so they see "Nhập từ khóa..."
    if (!q && spotlightCategoryFilter === "all") return [];

    // If no search query but a category is selected, return all channels in that category
    if (!q) return channelsToSearch;

    // Otherwise filter by keyword
    return channelsToSearch.filter(
      (ch) =>
        ch.name.toLowerCase().includes(q) || ch.id.toLowerCase().includes(q),
    );
  }, [
    menubarSearchQuery,
    spotlightCategoryFilter,
    allChannelsList,
    allAvailableCategoryList,
  ]);

  const filteredCategoriesForPicker = useMemo(() => {
    if (!pickerSearchQuery.trim()) return allAvailableCategoryList;
    const query = pickerSearchQuery.toLowerCase();
    return allAvailableCategoryList.map((cat) => ({
      ...cat,
      channels: cat.channels.filter(
        (ch) =>
          ch.name.toLowerCase().includes(query) ||
          (ch.logoText && ch.logoText.toLowerCase().includes(query)),
      ),
    }));
  }, [allAvailableCategoryList, pickerSearchQuery]);

  const getGridColsClass = (count: number) => {
    if (count <= 2) return "grid-cols-1 md:grid-cols-2";
    if (count <= 3) return "grid-cols-1 md:grid-cols-3";
    if (count <= 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-2 md:grid-cols-3";
    return "grid-cols-2 lg:grid-cols-4"; // 7, 8, 9
  };

  // Persists states
  useEffect(() => {
    localStorage.setItem("glass_tv_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("glass_tv_volume", volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem(
      "glass_tv_last_channel",
      JSON.stringify(selectedChannel),
    );
  }, [selectedChannel]);

  useEffect(() => {
    localStorage.setItem(
      "glass_tv_custom_list",
      JSON.stringify(customChannels),
    );
  }, [customChannels]);

  // Toggle favorite helper
  const toggleFavorite = (channelId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => {
      let updated: string[];
      if (prev.includes(channelId)) {
        updated = prev.filter((id) => id !== channelId);
        triggerToast("Đã xóa khỏi danh sách yêu thích");
      } else {
        updated = [...prev, channelId];
        triggerToast("Đã thêm vào danh sách yêu thích");
      }
      localStorage.setItem("glass_tv_favorites", JSON.stringify(updated));
      return updated;
    });
  };

  // Switch channel trigger
  const handleSelectChannel = (channel: Channel, bypassVtv5Check = false) => {
    setShowMobileSidebar(false);
    if (channel.id === "vtv5" && !bypassVtv5Check) {
      setShowVtv5Popup(true);
      return;
    }
    if (channel.id === "vietnam-wild-live") {
      setShowEventFeedPopup(true);
    }
    setSelectedChannel(channel);
    setPlaybackError(false);
    setPlaybackErrorType(null);
    // Scroll window smoothly to player on small devices for better viewport coverage
    if (window.innerWidth < 1024) {
      const topEl = document.getElementById("player-anchor");
      if (topEl) {
        topEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Firesteel Session Management Helpers
  const handleCreateNewSession = () => {
    const newId = "sess_" + Date.now();
    const newSession: VIntelSession = {
      id: newId,
      title: "Cuộc trò chuyện mới",
      timestamp: new Date().toLocaleString("vi-VN"),
      messages: [
        {
          role: "model",
          content: vIntelUserName
            ? `Xin chào ${vIntelUserName}! Tôi là Firesteel, trợ lý AI thông minh của bạn tại Waves Community. Tôi có thể giúp gì cho bạn hôm nay?`
            : "Xin chào! Tôi là Firesteel, trợ lý AI thông minh của bạn tại Waves Community. Tôi có thể giúp gì cho bạn hôm nay?",
        },
      ],
      mode: "chat",
    };

    setVIntelSessions((prev) => [...prev, newSession]);
    setActiveSessionId(newId);
    setVIntelMessages(newSession.messages);
    if (vIntelMode === "settings" || vIntelMode === "history") {
      setVIntelMode("chat");
    }
    setEditingMessageIdx(null);
    triggerVIntelToast("Đã tạo cuộc trò chuyện mới!");
  };

  const handleSwitchSession = (sessionId: string) => {
    const sess = vIntelSessions.find((s) => s.id === sessionId);
    if (sess) {
      setActiveSessionId(sessionId);
      setVIntelMessages(sess.messages);
      setEditingMessageIdx(null);
      if (vIntelMode === "settings" || vIntelMode === "history") {
        setVIntelMode("chat");
      }
      triggerVIntelToast(`Đã chuyển sang: ${sess.title}`);
    }
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (vIntelSessions.length <= 1) {
      triggerVIntelToast("Không thể xóa cuộc trò chuyện duy nhất!");
      return;
    }
    const filtered = vIntelSessions.filter((s) => s.id !== sessionId);
    setVIntelSessions(filtered);
    if (activeSessionId === sessionId) {
      const fallback = filtered[filtered.length - 1] || filtered[0];
      setActiveSessionId(fallback.id);
      setVIntelMessages(fallback.messages);
      setEditingMessageIdx(null);
    }
    triggerVIntelToast("Đã xóa cuộc trò chuyện");
  };

  // V-Intelligence Message handler
  const handleSendVIntelMessage = async () => {
    if ((!vIntelInput.trim() && !vIntelAttachedFile) || vIntelLoading) return;

    let userText = vIntelInput.trim();
    if (vIntelAttachedFile) {
      const fileLabel = `📎 [Tệp đính kèm: ${vIntelAttachedFile.name}]`;
      userText = userText ? `${userText}\n${fileLabel}` : fileLabel;
    }

    setVIntelInput("");
    setVIntelAttachedFile(null);

    const newMessages = [
      ...vIntelMessages,
      { role: "user", content: userText },
    ];
    setVIntelMessages(newMessages);
    setVIntelLoading(true);

    // Sync to session history & auto-name session if it is default
    setVIntelSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          const isDefaultOrGenericTitle =
            s.title === "Cuộc trò chuyện mặc định" ||
            s.title.startsWith("Cuộc trò chuyện");
          const titleText = isDefaultOrGenericTitle
            ? userText.length > 25
              ? userText.substring(0, 25) + "..."
              : userText
            : s.title;
          return { ...s, title: titleText, messages: newMessages };
        }
        return s;
      }),
    );

    try {
      const response = await fetch("/api/vintelligence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          mode: vIntelMode === "search" ? "search" : "chat",
          userName: vIntelUserName,
          smartAction: vIntelSmartAction,
        }),
      });

      if (!response.ok) {
        throw new Error("Không thể kết nối với trợ lý ảo Firesteel");
      }

      const data = await response.json();

      const nextMessages = [
        ...newMessages,
        {
          role: "model",
          content: data.reply || "Tôi không nhận được phản hồi phù hợp.",
          recommendedChannels: data.recommendedChannels || [],
          action: data.action || null,
        },
      ];
      setVIntelMessages(nextMessages);
      setVIntelSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId ? { ...s, messages: nextMessages } : s,
        ),
      );

      // Execute returned action if any
      if (vIntelSmartAction && data.action && data.action.type) {
        const { type, target, section } = data.action;

        if (type === "open_channel" && target) {
          const ch = flattenedChannels.find((c) => c.id === target);
          if (ch) {
            handleSelectChannel(ch);
            setActiveTab("live");
            if (window.innerWidth < 640) {
              setShowVIntel(false);
            }
          }
        } else if (type === "switch_tab" && target) {
          setActiveTab(target as any);
          if (target === "settings") {
            setActiveSettingSection(null);
          }
          if (window.innerWidth < 640) {
            setShowVIntel(false);
          }
        } else if (type === "open_settings" && section) {
          setActiveTab("settings");
          setActiveSettingSection(section);
          if (window.innerWidth < 640) {
            setShowVIntel(false);
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setVIntelMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: `Đã xảy ra lỗi: ${err.message || "Không thể tải phản hồi từ trợ lý ảo Firesteel."}`,
        },
      ]);
    } finally {
      setVIntelLoading(false);
    }
  };

  // Helper to match content selections
  const matchesContent = (channel: Channel, contentFilters: string[]) => {
    if (contentFilters.length === 0) return true;
    const nameLower = channel.name.toLowerCase();
    const groupLower = channel.group ? channel.group.toLowerCase() : "";
    return contentFilters.some((filter) => {
      if (filter === "Tin tức") {
        return (
          nameLower.includes("tin tức") ||
          nameLower.includes("thời sự") ||
          nameLower.includes("news") ||
          nameLower.includes("vtv1") ||
          nameLower.includes("cnn") ||
          nameLower.includes("bbc") ||
          nameLower.includes("vov1") ||
          nameLower.includes("quốc hội") ||
          nameLower.includes("nhân dân") ||
          nameLower.includes("vnews")
        );
      }
      if (filter === "Chính trị") {
        return (
          nameLower.includes("chính trị") ||
          nameLower.includes("quốc hội") ||
          nameLower.includes("nhân dân") ||
          nameLower.includes("vnews") ||
          nameLower.includes("vtv1") ||
          nameLower.includes("vov1")
        );
      }
      if (filter === "Văn hóa") {
        return (
          nameLower.includes("văn hóa") ||
          nameLower.includes("vtv4") ||
          nameLower.includes("vtv5") ||
          nameLower.includes("vov2") ||
          nameLower.includes("vov4") ||
          nameLower.includes("vov5")
        );
      }
      if (filter === "Giải trí") {
        return (
          nameLower.includes("giải trí") ||
          nameLower.includes("music") ||
          nameLower.includes("nhạc") ||
          nameLower.includes("vtv3") ||
          nameLower.includes("vtv9") ||
          nameLower.includes("vtv6") ||
          nameLower.includes("vtv8") ||
          nameLower.includes("giaitri") ||
          nameLower.includes("hài") ||
          groupLower.includes("vtvcab")
        );
      }
      if (filter === "Phim truyện") {
        return (
          nameLower.includes("phim") ||
          nameLower.includes("movie") ||
          nameLower.includes("cine") ||
          nameLower.includes("drama")
        );
      }
      if (filter === "Khoa học") {
        return (
          nameLower.includes("khoa học") ||
          nameLower.includes("khcn") ||
          nameLower.includes("discovery") ||
          nameLower.includes("nature") ||
          nameLower.includes("sctv8") ||
          nameLower.includes("vtv2")
        );
      }
      if (filter === "Giáo dục") {
        return (
          nameLower.includes("giáo dục") ||
          nameLower.includes("học") ||
          nameLower.includes("edu") ||
          nameLower.includes("vtv7") ||
          nameLower.includes("vtv2")
        );
      }
      if (filter === "Tiếng Anh") {
        return (
          nameLower.includes("english") ||
          nameLower.includes("tiếng anh") ||
          nameLower.includes("cnn") ||
          nameLower.includes("bbc") ||
          nameLower.includes("nhk") ||
          nameLower.includes("bloomberg") ||
          nameLower.includes("dw") ||
          nameLower.includes("arirang") ||
          nameLower.includes("cna")
        );
      }
      return false;
    });
  };

  // Helper to match letters selection
  const matchesLetters = (channel: Channel, letters: string[]) => {
    if (letters.length === 0) return true;
    const nameLower = channel.name.toLowerCase();
    return letters.some((letter) => nameLower.includes(letter.toLowerCase()));
  };

  // Handle Random Suggestion Generation
  const handleRandomSuggestionGo = () => {
    let candidates = flattenedChannels;

    // Filter 1: Category groups
    if (randomSuggestCategories.length > 0) {
      const selectedCats = allAvailableCategoryList.filter(
        (cat) =>
          randomSuggestCategories.includes(cat.id) ||
          randomSuggestCategories.includes(cat.name),
      );
      candidates = selectedCats.flatMap((cat) => cat.channels);
    }

    // Filter 2: Content types
    if (randomSuggestContents.length > 0) {
      candidates = candidates.filter((ch) =>
        matchesContent(ch, randomSuggestContents),
      );
    }

    // Filter 3: Letters in name
    if (randomSuggestLetters.length > 0) {
      candidates = candidates.filter((ch) =>
        matchesLetters(ch, randomSuggestLetters),
      );
    }

    if (candidates.length === 0) {
      triggerToast("Không tìm thấy kênh nào phù hợp với bộ lọc đã chọn!");
      return;
    }

    const randomIndex = Math.floor(Math.random() * candidates.length);
    const selected = candidates[randomIndex];

    setSelectedChannel(selected);
    setActiveTab("live");
    setShowRandomSuggestModal(false);
    triggerToast(`Đề xuất ngẫu nhiên: Đang mở ${selected.name}`);
  };

  // V-Intelligence Quick Chat handler
  const handleQuickChatSend = async () => {
    const finalVal = quickChatInput.trim();
    if (!finalVal || vIntelLoading) return;

    setQuickChatInput("");
    setShowVIntel(true);
    setVIntelMode("chat");
    setActiveMenu(null);

    const newMessages = [
      ...vIntelMessages,
      { role: "user", content: finalVal },
    ];
    setVIntelMessages(newMessages);
    setVIntelLoading(true);

    // Sync to session history & auto-name session if it is default
    setVIntelSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          const isDefaultOrGenericTitle =
            s.title === "Cuộc trò chuyện mặc định" ||
            s.title.startsWith("Cuộc trò chuyện");
          const titleText = isDefaultOrGenericTitle
            ? finalVal.length > 25
              ? finalVal.substring(0, 25) + "..."
              : finalVal
            : s.title;
          return { ...s, title: titleText, messages: newMessages };
        }
        return s;
      }),
    );

    try {
      const response = await fetch("/api/vintelligence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          mode: "chat",
          userName: vIntelUserName,
          smartAction: vIntelSmartAction,
        }),
      });

      if (!response.ok) {
        throw new Error("Không thể kết nối với trợ lý ảo Firesteel");
      }

      const data = await response.json();

      const nextMessages = [
        ...newMessages,
        {
          role: "model",
          content: data.reply || "Tôi không nhận được phản hồi phù hợp.",
          recommendedChannels: data.recommendedChannels || [],
          action: data.action || null,
        },
      ];
      setVIntelMessages(nextMessages);
      setVIntelSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId ? { ...s, messages: nextMessages } : s,
        ),
      );

      // Execute returned action if any
      if (vIntelSmartAction && data.action && data.action.type) {
        const { type, target, section } = data.action;

        if (type === "open_channel" && target) {
          const ch = flattenedChannels.find((c) => c.id === target);
          if (ch) {
            handleSelectChannel(ch);
            setActiveTab("live");
            if (window.innerWidth < 640) {
              setShowVIntel(false);
            }
          }
        } else if (type === "switch_tab" && target) {
          setActiveTab(target as any);
          if (target === "settings") {
            setActiveSettingSection(null);
          }
          if (window.innerWidth < 640) {
            setShowVIntel(false);
          }
        } else if (type === "open_settings" && section) {
          setActiveTab("settings");
          setActiveSettingSection(section);
          if (window.innerWidth < 640) {
            setShowVIntel(false);
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setVIntelMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: `Đã xảy ra lỗi: ${err.message || "Không thể tải phản hồi từ trợ lý ảo Firesteel."}`,
        },
      ]);
    } finally {
      setVIntelLoading(false);
    }
  };

  const handleNextChannel = () => {
    const currentIndex = flattenedChannels.findIndex(
      (ch) => ch.id === selectedChannel.id,
    );
    if (currentIndex !== -1 && currentIndex < flattenedChannels.length - 1) {
      setSelectedChannel(flattenedChannels[currentIndex + 1]);
    } else {
      setSelectedChannel(flattenedChannels[0]);
    }
  };

  const handlePrevChannel = () => {
    const currentIndex = flattenedChannels.findIndex(
      (ch) => ch.id === selectedChannel.id,
    );
    if (currentIndex !== -1 && currentIndex > 0) {
      setSelectedChannel(flattenedChannels[currentIndex - 1]);
    } else {
      setSelectedChannel(flattenedChannels[flattenedChannels.length - 1]);
    }
  };

  // Ref and handlers for M3U playlist importing/exporting
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sidebarSearchRef = useRef<HTMLInputElement>(null);

  const handleM3uImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const lines = content.split("\n");
      const importedChannels: Channel[] = [];
      let currentChannelName = "";
      let currentChannelLogo = "";
      let currentChannelGroup = "Địa phương";

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith("#EXTINF:")) {
          const nameMatch = line.match(/,\s*(.*)$/);
          if (nameMatch) {
            currentChannelName = nameMatch[1].trim();
          }

          const logoMatch = line.match(/tvg-logo="([^"]+)"/);
          if (logoMatch) {
            currentChannelLogo = logoMatch[1].trim();
          }

          const groupMatch = line.match(/group-title="([^"]+)"/);
          if (groupMatch) {
            currentChannelGroup = groupMatch[1].trim();
          }
        } else if (line.startsWith("http")) {
          if (currentChannelName) {
            importedChannels.push({
              id: `custom-imported-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              name: currentChannelName,
              url: line,
              group: currentChannelGroup,
              logoImg: currentChannelLogo || undefined,
              logoText: currentChannelName.slice(0, 3).toUpperCase(),
              logoBg: "bg-gradient-to-br from-indigo-600 to-fuchsia-700",
            });
            currentChannelName = "";
            currentChannelLogo = "";
            currentChannelGroup = "Địa phương";
          }
        }
      }

      if (importedChannels.length > 0) {
        setCustomChannels((prev) => [...importedChannels, ...prev]);
        triggerVIntelToast(
          `Đã nhập thành công ${importedChannels.length} kênh từ file M3U!`,
        );
      } else {
        triggerVIntelToast("Không tìm thấy kênh hợp lệ trong file M3U!");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleM3uExport = () => {
    if (customChannels.length === 0) {
      triggerVIntelToast("Bạn chưa có kênh tự thêm nào để xuất!");
      return;
    }

    let m3uContent = "#EXTM3U\n";
    customChannels.forEach((ch) => {
      m3uContent += `#EXTINF:-1 tvg-name="${ch.name}"${ch.logoImg ? ` tvg-logo="${ch.logoImg}"` : ""} group-title="${ch.group}",${ch.name}\n${ch.url}\n`;
    });

    const blob = new Blob([m3uContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `waves_community_custom_channels_${Date.now()}.m3u`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerVIntelToast("Đã xuất danh sách kênh tự thêm thành công!");
  };

  // Add Custom Channel Handler
  const handleAddCustomChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customChannelName || !customChannelUrl) return;

    const finalGroup =
      customChannelGroup === "NEW_GROUP"
        ? customGroupInput.trim() || "Kênh Riêng"
        : customChannelGroup;

    const newChannel: Channel = {
      id: `custom-${Date.now()}`,
      name: customChannelName,
      url: customChannelUrl.trim(),
      group: finalGroup,
      logoText: customChannelName.slice(0, 3).toUpperCase(),
      logoBg: "bg-gradient-to-br from-indigo-600 to-fuchsia-700",
    };

    setCustomChannels((prev) => [newChannel, ...prev]);
    setSelectedChannel(newChannel);
    setCustomChannelName("");
    setCustomChannelUrl("");
    setCustomGroupInput("Nhóm Kênh Mới");
    setCustomChannelGroup("VTV");
    setShowCustomModal(false);
  };

  // Delete Custom Channel
  const handleDeleteCustomChannel = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomChannels((prev) => prev.filter((ch) => ch.id !== id));
    if (selectedChannel.id === id) {
      setSelectedChannel(defaultChannel);
    }
  };

  // Share stream link to clipboard
  const handleShareChannel = () => {
    if (!selectedChannel) return;

    navigator.clipboard
      .writeText(selectedChannel.url)
      .then(() => {
        setShowCopiedNotify(true);
        if (notifyTimeoutRef.current) {
          clearTimeout(notifyTimeoutRef.current);
        }
        notifyTimeoutRef.current = setTimeout(() => {
          setShowCopiedNotify(false);
        }, 3000);
      })
      .catch((err) => {
        console.error("Could not copy stream link: ", err);
      });
  };

  // Nav Tabs and Actions for Spotlight Search (Sidebar Tabs matching exact sidebar labels)
  const spotlightNavTabs = useMemo(
    () => [
      {
        id: "home",
        title: "Home",
        category: "Sidebar",
        description: "Xem các chương trình và luồng phát nổi bật",
        icon: Home,
        keywords: ["home", "trang chu", "trangchu", "main", "chinh", "noi bat"],
        action: () => {
          setActiveTab("home");
          triggerToast("Chuyển đến Home");
        },
      },
      {
        id: "live",
        title: "Live TV",
        category: "Sidebar",
        description: "Xem truyền hình trực tiếp Live TV",
        icon: Tv,
        keywords: [
          "live",
          "tv",
          "truyen hinh",
          "kenh",
          "xem live",
          "phat song",
        ],
        action: () => {
          setActiveTab("live");
          triggerToast("Chuyển đến V-Play");
        },
      },
      {
        id: "vapps",
        title: "V-Apps",
        category: "Sidebar",
        description: "Kho tiện ích V-Apps, V-Arcade 5 trò chơi, V-Files, V-Learn, V-Calc & V-Notes",
        icon: Grid,
        keywords: ["vapps", "v-apps", "apps", "arcade", "game", "tien ich", "v-arcade", "vstudy", "v-notes"],
        action: () => {
          setActiveTab("vapps");
          triggerToast("Chuyển đến V-Apps");
        },
      },
      {
        id: "vpremium",
        title: "V-Premium",
        category: "Sidebar",
        description: "Trung tâm V-Premium: Gói V-Cloud Storage, Tài khoản V-Bank & Verified Tích Xanh",
        icon: Crown,
        keywords: ["vpremium", "v-premium", "premium", "vip", "vbank", "storage", "verified", "cloud", "tich xanh"],
        action: () => {
          setActiveTab("vpremium");
          triggerToast("Chuyển đến V-Premium");
        },
      },
      {
        id: "news",
        title: "News",
        category: "Sidebar",
        description: "Thông báo sáp nhập Waves Community & tin mới Discord",
        icon: Megaphone,
        keywords: [
          "news",
          "tin tuc",
          "tintuc",
          "thong bao",
          "waves",
          "discord",
          "su kien",
          "sap nhap",
          "vplay",
        ],
        action: () => {
          setActiveTab("news");
          triggerToast("Chuyển đến News");
        },
      },
      {
        id: "remote",
        title: "Chuyển kênh",
        category: "Sidebar",
        description: "Bàn điều khiển kênh từ xa bằng bàn phím số",
        icon: Radio,
        keywords: [
          "remote",
          "chuyen kenh",
          "dieu khien",
          "dieukhien",
          "ban phim",
          "so kenh",
          "keypad",
        ],
        action: () => {
          setActiveTab("remote");
          setShowRemoteModal(true);
          triggerToast("Mở Chuyển kênh");
        },
      },
      {
        id: "favorites",
        title: "Favorites",
        category: "Sidebar",
        description: "Danh sách các kênh bạn đã đánh dấu yêu thích",
        icon: ThumbsUp,
        keywords: [
          "favorite",
          "favourite",
          "yeu thich",
          "yeuthich",
          "like",
          "da thich",
          "bookmark",
        ],
        action: () => {
          if (!sidebarExpanded && !isMobile) setSidebarExpanded(true);
          setSidebarFavoritesOpen(true);
          triggerToast("Mở Favorites");
        },
      },
      {
        id: "multiview",
        title: "Multiview",
        category: "Sidebar",
        description: "Theo dõi 2 hoặc nhiều luồng cùng một lúc",
        icon: Grid,
        keywords: [
          "multiview",
          "multi",
          "nhieu kenh",
          "chia man hinh",
          "2 kenh",
          "4 kenh",
        ],
        action: () => {
          handleOpenMultiviewSelector();
          triggerToast("Mở Multiview");
        },
      },
      {
        id: "toolbox",
        title: "Toolbox",
        category: "Sidebar",
        description: "Bộ công cụ mở rộng và tiện ích kênh",
        icon: Package,
        keywords: ["toolbox", "cong cu", "tien ich", "mo rong", "file", "m3u"],
        action: () => {
          if (!sidebarExpanded && !isMobile) setSidebarExpanded(true);
          setSidebarFileOpen(true);
          triggerToast("Mở Toolbox");
        },
      },
      {
        id: "help",
        title: "Help",
        category: "Sidebar",
        description: "Trợ giúp, hướng dẫn sử dụng và báo lỗi",
        icon: BookOpen,
        keywords: [
          "help",
          "tro giup",
          "bao loi",
          "feedback",
          "reload",
          "reset",
        ],
        action: () => {
          if (!sidebarExpanded && !isMobile) setSidebarExpanded(true);
          setSidebarHelpOpen(true);
          triggerToast("Mở Help");
        },
      },
      {
        id: "about",
        title: "About",
        category: "Sidebar",
        description: "Thông tin phiên bản, bản quyền và Waves Community",
        icon: Info,
        keywords: [
          "about",
          "gioi thieu",
          "thong tin",
          "waves community",
          "version",
          "phien ban",
          "ve waves",
        ],
        action: () => {
          setActiveTab("settings");
          setActiveSettingSection("about");
          triggerToast("Mở About");
        },
      },
      {
        id: "discord",
        title: "Join Waves on Discord",
        category: "Sidebar",
        description: "Cộng đồng giao lưu, watch party & hỗ trợ kỹ thuật",
        icon: DiscordIcon,
        keywords: [
          "discord",
          "server",
          "cong dong",
          "chat",
          "voice",
          "watch party",
          "waves",
        ],
        action: () => {
          window.open("https://discord.gg/waves", "_blank");
          triggerToast("Đang mở Waves Discord");
        },
      },
      {
        id: "settings",
        title: "Cài đặt",
        category: "Sidebar",
        description: "Tùy chỉnh giao diện, tìm kiếm, âm thanh và hệ thống",
        icon: Settings,
        keywords: [
          "settings",
          "cai dat",
          "caidat",
          "he thong",
          "am thanh",
          "dock",
          "giao dien",
          "tim kiem",
        ],
        action: () => {
          setActiveTab("settings");
          setActiveSettingSection(null);
          triggerToast("Mở Cài đặt");
        },
      },
    ],
    [sidebarExpanded, isMobile],
  );

  // Spotlight Items for V-Apps and Internal Content (5 Games V-Arcade, V-Files, Explore VN, V-Learn, V-Calc, V-Notes...)
  const spotlightVAppsItems = useMemo(
    () => [
      {
        id: "vapp-hub",
        title: "V-Apps Hub (Kho ứng dụng & Tiện ích)",
        category: "V-Apps",
        subCategory: "Kho ứng dụng",
        badge: "V-Apps Hub",
        description: "Trung tâm ứng dụng V-Apps: 5 Games Ore UI, V-Files, Explore VN, V-Learn, V-Calc, V-Reminders, V-Notes, V-Furniture",
        icon: Grid,
        keywords: ["vapps", "v-apps", "kho ung dung", "tien ich", "app store", "he sinh thai vapps"],
        action: () => {
          navigateToVApp("v_arcade");
          triggerToast("Mở kho ứng dụng V-Apps");
        },
      },
      {
        id: "vapp-game-caro",
        title: "Cờ Caro XO (Tic-Tac-Toe 3x3)",
        category: "V-Apps",
        subCategory: "V-Arcade Game",
        badge: "Game Caro XO",
        description: "Đánh X/O giao diện Ore UI pixel art đấu NPC ngẫu nhiên hoặc 2 người chơi",
        icon: Gamepad2,
        keywords: ["caro", "co caro", "tic tac toe", "xo", "game caro", "danh co", "varcade", "v-arcade", "game", "tro choi"],
        action: () => {
          navigateToVApp("v_arcade", "tic_tac_toe");
          triggerToast("Khởi động Cờ Caro XO (V-Arcade)");
        },
      },
      {
        id: "vapp-game-rps",
        title: "Oẳn Tù Tì (Kéo Búa Bao Ore UI)",
        category: "V-Apps",
        subCategory: "V-Arcade Game",
        badge: "Game Oẳn Tù Tì",
        description: "Thử vận may và phản xạ cùng NPC với 3 nước đi Kéo, Búa, Bao kinh điển",
        icon: Gamepad2,
        keywords: ["oan tu ti", "keo bua bao", "rock paper scissors", "bua keo bao", "game oan tu ti", "varcade", "v-arcade", "game"],
        action: () => {
          navigateToVApp("v_arcade", "rock_paper_scissors");
          triggerToast("Khởi động Oẳn Tù Tì (V-Arcade)");
        },
      },
      {
        id: "vapp-game-wordchain",
        title: "Nối Từ Tiếng Việt & Tiếng Anh (Word Chain)",
        category: "V-Apps",
        subCategory: "V-Arcade Game",
        badge: "Game Nối Từ",
        description: "Thử thách nối từ ghép Tiếng Việt và ký tự Tiếng Anh cùng NPC bạn bè",
        icon: Gamepad2,
        keywords: ["noi tu", "word chain", "tieng viet", "tieng anh", "ghep tu", "game noi tu", "varcade", "v-arcade", "game"],
        action: () => {
          navigateToVApp("v_arcade", "word_chain");
          triggerToast("Khởi động Nối Từ (V-Arcade)");
        },
      },
      {
        id: "vapp-game-counting",
        title: "Đếm Số 1 -> N (Phá Chuỗi Reset)",
        category: "V-Apps",
        subCategory: "V-Arcade Game",
        badge: "Game Đếm Số",
        description: "Đếm số phản xạ liên tục từ 1 đến N. Ai đếm sai sẽ bị phá chuỗi và reset từ đầu!",
        icon: Gamepad2,
        keywords: ["dem so", "counting game", "dem so 1 den n", "pha chuoi", "game dem so", "varcade", "v-arcade", "game"],
        action: () => {
          navigateToVApp("v_arcade", "counting_game");
          triggerToast("Khởi động Đếm Số (V-Arcade)");
        },
      },
      {
        id: "vapp-game-snake",
        title: "Rắn Săn Mồi (Retro Snake Ore UI)",
        category: "V-Apps",
        subCategory: "V-Arcade Game",
        badge: "Game Rắn Săn Mồi",
        description: "Điều khiển chú rắn ăn mồi nâng điểm số với bàn phím phím bấm D-Pad Ore UI",
        icon: Gamepad2,
        keywords: ["ran san moi", "snake", "retro snake", "game ran", "an moi", "ran", "varcade", "v-arcade", "game"],
        action: () => {
          navigateToVApp("v_arcade", "snake");
          triggerToast("Khởi động Rắn Săn Mồi (V-Arcade)");
        },
      },
      {
        id: "vapp-files",
        title: "V-Files (Trình quản lý tệp tin V-Xplore)",
        category: "V-Apps",
        subCategory: "Tiện ích hệ thống",
        badge: "Tệp tin & M3U8",
        description: "Quản lý danh sách kênh M3U8, xem trước tệp media và đồng bộ sao lưu V-Cloud",
        icon: FolderOpen,
        keywords: ["v-files", "vfiles", "file explorer", "tep tin", "quan ly tep", "m3u8", "du lieu", "vxplore", "v-xplore"],
        action: () => {
          navigateToVApp("v_xplore");
          triggerToast("Mở trình quản lý tệp V-Files");
        },
      },
      {
        id: "vapp-explore-vn",
        title: "Explore Vietnam (Bản đồ 63 tỉnh thành & Ẩm thực)",
        category: "V-Apps",
        subCategory: "Khám phá văn hóa",
        badge: "63 Tỉnh Thành VN",
        description: "Bản đồ tương tác 63 tỉnh thành, địa danh du lịch, ẩm thực đặc sắc 3 miền Bắc - Trung - Nam",
        icon: MapPin,
        keywords: ["explore vietnam", "viet nam", "63 tinh thanh", "am thuc", "ha noi", "da nang", "sai gon", "dia danh", "du lich", "kham pha"],
        action: () => {
          navigateToVApp("explore_vietnam");
          triggerToast("Mở Explore Vietnam (Khám phá Việt Nam)");
        },
      },
      {
        id: "vapp-vlearn",
        title: "V-Learn / VStudy (Luyện thi CEFR & Ngữ Văn)",
        category: "V-Apps",
        subCategory: "Học tập & Giáo dục",
        badge: "CEFR & Đề thi",
        description: "Kho tài liệu học tập, luyện thi Tiếng Anh CEFR A1-C2 và đề thi Ngữ Văn THPT",
        icon: GraduationCap,
        keywords: ["v-learn", "vlearn", "vstudy", "hoc tap", "cefr", "tieng anh", "ngu van", "de thi", "trac nghiem", "tu vung"],
        action: () => {
          navigateToVApp("v_learn");
          triggerToast("Mở V-Learn / VStudy");
        },
      },
      {
        id: "vapp-vcalc",
        title: "V-Calc (Máy tính & Đổi đơn vị Ore UI)",
        category: "V-Apps",
        subCategory: "Tiện ích tính toán",
        badge: "Máy tính Ore UI",
        description: "Máy tính bỏ túi khoa học, tính lãi suất Ore V-Bank và đổi đơn vị đo lường linh hoạt",
        icon: Calculator,
        keywords: ["v-calc", "vcalc", "may tinh", "calculator", "tinh toan", "doi don vi", "khoa hoc", "lai suat"],
        action: () => {
          navigateToVApp("v_calc");
          triggerToast("Mở máy tính V-Calc");
        },
      },
      {
        id: "vapp-vreminders",
        title: "V-Reminders (Nhắc lịch phát sóng TV & Sự kiện)",
        category: "V-Apps",
        subCategory: "Quản lý thời gian",
        badge: "Nhắc việc & Đếm ngược",
        description: "Đặt lời nhắc lịch phát sóng chương trình TV yêu thích, đếm ngược sự kiện quan trọng",
        icon: Bell,
        keywords: ["v-reminders", "vreminders", "nhac lich", "dem nguoc", "lich trinh", "su kien", "bao thuc", "hen gio"],
        action: () => {
          navigateToVApp("v_reminders");
          triggerToast("Mở V-Reminders");
        },
      },
      {
        id: "vapp-vnotes",
        title: "V-Notes (Sổ tay ghi chú kênh TV & M3U8)",
        category: "V-Apps",
        subCategory: "Ghi chép",
        badge: "Sổ tay V-Notes",
        description: "Lưu trữ danh sách kênh, ghi chép cá nhân, đánh dấu luồng phát TV chất lượng cao",
        icon: StickyNote,
        keywords: ["v-notes", "vnotes", "ghi chu", "so tay", "notes", "luu kenh", "m3u8 notes", "ghi chep"],
        action: () => {
          navigateToVApp("v_notes");
          triggerToast("Mở sổ tay V-Notes");
        },
      },
      {
        id: "vapp-vfurniture",
        title: "V-Furniture (Cửa hàng gia dụng & Nội thất Ore)",
        category: "V-Apps",
        subCategory: "Mua sắm Ore",
        badge: "Gia dụng Ore",
        description: "Mua sắm bàn ghế, thiết bị gia dụng và đồ dùng trang trí online bằng Khoáng Thạch Ore",
        icon: Armchair,
        keywords: ["v-furniture", "vfurniture", "gia dung", "noi that", "mua sam", "ore", "ban ghe", "cua hang", "dien may"],
        action: () => {
          navigateToVApp("v_furniture");
          triggerToast("Mở cửa hàng gia dụng V-Furniture");
        },
      },
      {
        id: "vapp-vbox",
        title: "V-Box (Trung tâm giải trí & Video Hub)",
        category: "V-Apps",
        subCategory: "Giải trí",
        badge: "Media Hub",
        description: "Trung tâm giải trí tổng hợp video, phim ảnh đa nền tảng cho Vplay",
        icon: Tv,
        keywords: ["v-box", "vbox", "giai tri", "video hub", "phim anh", "media", "clip"],
        action: () => {
          navigateToVApp("v_box");
          triggerToast("Mở V-Box Media Hub");
        },
      },
    ],
    [],
  );

  // Spotlight Items for V-Premium (V-Bank, V-Cloud Storage 50GB / 200GB / 2TB, Waves Verified Tích Xanh)
  const spotlightVPremiumItems = useMemo(
    () => [
      {
        id: "vprem-suite",
        title: "V-Premium Suite (Tổng quan đặc quyền VIP)",
        category: "V-Premium",
        subCategory: "Đặc quyền VIP",
        badge: "V-Premium VIP",
        description: "Hệ sinh thái VIP: Ngân hàng số V-Bank, V-Cloud Storage và Huy hiệu Waves Verified",
        icon: Crown,
        keywords: ["vpremium", "v-premium", "premium", "vip", "dac quyen", "goi cuoc", "cao cap", "nang cap"],
        action: () => {
          navigateToVPremium("vbank");
          triggerToast("Chuyển đến V-Premium VIP Suite");
        },
      },
      {
        id: "vprem-vbank",
        title: "V-Bank (Ngân hàng số & Tài khoản Ore)",
        category: "V-Premium",
        subCategory: "Ngân hàng số",
        badge: "Ngân hàng V-Bank",
        description: "Mở tài khoản số đẹp, chuyển tiền Khoáng Thạch Ore, gửi tiết kiệm nhận lãi suất",
        icon: Building2,
        keywords: ["v-bank", "vbank", "ngan hang", "tai khoan", "chuyen tien", "ore", "so dep", "tiet kiem", "lai suat", "sao ke"],
        action: () => {
          navigateToVPremium("vbank");
          triggerToast("Mở ngân hàng số V-Bank");
        },
      },
      {
        id: "vprem-storage-hub",
        title: "V-Cloud Storage (Dung lượng đám mây Quota)",
        category: "V-Premium",
        subCategory: "Đám mây lưu trữ",
        badge: "V-Cloud Storage",
        description: "Quản lý dung lượng lưu trữ Playlist M3U8, video offline và sao lưu hệ thống",
        icon: Cloud,
        keywords: ["v-cloud", "storage", "dung luong", "dam may", "luu tru", "cloud", "quota", "sao luu", "bo nho"],
        action: () => {
          navigateToVPremium("storage");
          triggerToast("Mở quản lý dung lượng V-Cloud Storage");
        },
      },
      {
        id: "vprem-plan-50gb",
        title: "Gói V-Cloud Basic 50 GB (19.000đ / tháng)",
        category: "V-Premium",
        subCategory: "Gói cước Storage",
        badge: "Gói 50GB Basic",
        description: "50 GB đám mây lưu trữ 50+ Playlist M3U8, đồng bộ ghi chú V-Notes và Badge Đồng",
        icon: Cloud,
        keywords: ["50gb", "goi 50gb", "basic 50gb", "19k", "19.000", "storage basic", "goi tiet kiem", "cloud 50gb"],
        action: () => {
          navigateToVPremium("storage");
          triggerToast("Xem gói V-Cloud Basic 50 GB");
        },
      },
      {
        id: "vprem-plan-200gb",
        title: "Gói V-Cloud Pro Ore 200 GB (69.000đ / tháng - Khuyên Dùng)",
        category: "V-Premium",
        subCategory: "Gói cước Storage",
        badge: "Gói 200GB Pro",
        description: "200 GB đám mây siêu tốc độ, lưu video offline HD, Badge V-Bank Gold, x2 tốc độ phát",
        icon: Cloud,
        keywords: ["200gb", "goi 200gb", "pro 200gb", "69k", "69.000", "storage pro", "khuyen dung", "popular", "cloud 200gb"],
        action: () => {
          navigateToVPremium("storage");
          triggerToast("Xem gói V-Cloud Pro Ore 200 GB");
        },
      },
      {
        id: "vprem-plan-2tb",
        title: "Gói V-Cloud Diamond 2.000 GB / 2 TB (225.000đ / tháng)",
        category: "V-Premium",
        subCategory: "Gói cước Storage",
        badge: "Gói 2TB Diamond",
        description: "2 TB VIP không giới hạn, tặng kèm Waves Verified Tích Xanh trọn đời, tải 4K HDR",
        icon: Crown,
        keywords: ["2tb", "2000gb", "diamond", "225k", "225.000", "storage 2tb", "vip diamond", "tich xanh tron doi", "cloud 2tb"],
        action: () => {
          navigateToVPremium("storage");
          triggerToast("Xem gói V-Cloud Diamond 2 TB");
        },
      },
      {
        id: "vprem-verified",
        title: "Waves Verified (Huy hiệu Tích Xanh chính chủ)",
        category: "V-Premium",
        subCategory: "Xác minh & Uy tín",
        badge: "Tích Xanh Verified",
        description: "Xác thực tài khoản chính chủ, mở khóa biểu tượng tích xanh danh giá và phòng chờ VIP",
        icon: BadgeCheck,
        keywords: ["verified", "tich xanh", "xac minh", "chinh chu", "huy hieu", "badge check", "vip badge", "uy tin"],
        action: () => {
          navigateToVPremium("verified");
          triggerToast("Mở trung tâm xác minh Waves Verified");
        },
      },
    ],
    [],
  );

  // Toolbox Items for Spotlight Search
  const spotlightToolboxItems = useMemo(
    () => [
      {
        id: "tb-play-url",
        title: "Xem luồng qua URL",
        category: "Toolbox",
        description: "Phát trực tiếp link HLS (.m3u8) bất kỳ",
        icon: Play,
        keywords: [
          "url",
          "play url",
          "link",
          "m3u8",
          "luong",
          "xem url",
          "phat link",
          "toolbox",
        ],
        action: () => {
          setShowPlayUrlModal(true);
          triggerToast("Mở Xem luồng qua URL");
        },
      },
      {
        id: "tb-custom-channel",
        title: "Thêm luồng kênh",
        category: "Toolbox",
        description: "Thêm kênh tùy biến cá nhân vào ứng dụng",
        icon: Plus,
        keywords: [
          "them kenh",
          "custom",
          "add channel",
          "tao kenh",
          "kenh moi",
          "toolbox",
        ],
        action: () => {
          setShowCustomModal(true);
          triggerToast("Mở Thêm luồng kênh");
        },
      },
      {
        id: "tb-import-m3u",
        title: "Nhập file m3u/m3u8",
        category: "Toolbox",
        description: "Tải danh sách kênh từ file playlist M3U",
        icon: Upload,
        keywords: [
          "import",
          "nhap file",
          "m3u",
          "playlist",
          "tai file",
          "iptv",
          "toolbox",
        ],
        action: () => {
          fileInputRef.current?.click();
          triggerToast("Chọn file M3U");
        },
      },
      {
        id: "tb-export-m3u",
        title: "Xuất file m3u/m3u8",
        category: "Toolbox",
        description: "Tải về danh sách kênh định dạng M3U",
        icon: Download,
        keywords: [
          "export",
          "xuat file",
          "backup",
          "luu file",
          "m3u",
          "toolbox",
        ],
        action: () => {
          handleM3uExport();
          triggerToast("Xuất file M3U");
        },
      },
      {
        id: "tb-multiview",
        title: "Chế độ Multiview",
        category: "Toolbox",
        description: "Xem đồng thời 2-4 kênh trên cùng màn hình",
        icon: Grid,
        keywords: [
          "multiview",
          "multi",
          "xem nhieu kenh",
          "chia man hinh",
          "toolbox",
        ],
        action: () => {
          handleOpenMultiviewSelector();
          triggerToast("Mở Chế độ Multiview");
        },
      },
      {
        id: "tb-pip",
        title: "Picture in Picture (PiP)",
        category: "Toolbox",
        description: "Bật chế độ xem video trong cửa sổ nổi thu nhỏ",
        icon: Maximize2,
        keywords: [
          "pip",
          "picture in picture",
          "cua so noi",
          "thu nho",
          "toolbox",
        ],
        action: () => {
          const video = document.querySelector("video");
          if (video && document.pictureInPictureEnabled) {
            if (document.pictureInPictureElement) {
              document.exitPictureInPicture().catch(console.error);
            } else {
              video.requestPictureInPicture().catch(console.error);
            }
          } else {
            triggerToast("Trình duyệt không hỗ trợ PiP");
          }
        },
      },
    ],
    [],
  );

  // Settings Items for Spotlight Search
  const spotlightSettingsItems = useMemo(
    () => [
      {
        id: "set-appearance",
        title: "Cài đặt Giao diện",
        category: "Cài đặt",
        description: "Tùy biến Header bar, AMOLED Dark, màu nền và thanh Dock",
        icon: Palette,
        keywords: [
          "giao dien",
          "appearance",
          "theme",
          "header bar",
          "glow",
          "dock",
          "sidebar",
          "cai dat",
        ],
        action: () => {
          setActiveTab("settings");
          setActiveSettingSection("appearance");
          triggerToast("Mở Cài đặt Giao diện");
        },
      },
      {
        id: "set-headerbar",
        title: "Header bar",
        category: "Cài đặt",
        description: "Bật/tắt thanh Header bar trắng cố định ở đỉnh màn hình",
        icon: Layers,
        keywords: [
          "header bar",
          "header",
          "thanh header",
          "top bar",
          "always on top",
          "cai dat",
        ],
        action: () => {
          setActiveTab("settings");
          setActiveSettingSection("appearance");
          triggerToast("Cài đặt Header bar");
        },
      },
      {
        id: "set-glow",
        title: "Màu sắc ánh sáng nền (Backdrop Glow)",
        category: "Cài đặt",
        description:
          "Tùy chọn hiệu ứng Cosmic Glow, Tối giản, Cực quang, Sunset",
        icon: Sparkles,
        keywords: [
          "backdrop glow",
          "glow",
          "anh sang nen",
          "cosmic",
          "deep",
          "aurora",
          "sunset",
          "cai dat",
        ],
        action: () => {
          setActiveTab("settings");
          setActiveSettingSection("appearance");
          triggerToast("Cài đặt Ánh sáng nền");
        },
      },
      {
        id: "set-amoled",
        title: "Chế độ AMOLED Dark",
        category: "Cài đặt",
        description:
          "Sử dụng nền đen tuyệt đối giúp tiết kiệm pin cho màn hình OLED",
        icon: Moon,
        keywords: [
          "amoled dark",
          "amoled",
          "nen den",
          "tiet kiem pin",
          "dark mode",
          "cai dat",
        ],
        action: () => {
          setActiveTab("settings");
          setActiveSettingSection("appearance");
          triggerToast("Cài đặt AMOLED Dark");
        },
      },
      {
        id: "set-dock-sidebar",
        title: "Chuyển Dock thành Sidebar",
        category: "Cài đặt",
        description:
          "Chuyển thanh điều hướng dưới cùng sang thanh Sidebar bên trái",
        icon: SlidersHorizontal,
        keywords: [
          "dock to sidebar",
          "sidebar",
          "chuyen dock",
          "thanh ben",
          "cai dat",
        ],
        action: () => {
          setActiveTab("settings");
          setActiveSettingSection("appearance");
          triggerToast("Cài đặt Vị trí thanh điều hướng");
        },
      },
      {
        id: "set-dock-customizer",
        title: "Tùy biến thanh điều hướng Dock",
        category: "Cài đặt",
        description: "Sắp xếp, ẩn hiện các nút trên thanh Dock",
        icon: Layers,
        keywords: [
          "dock customizer",
          "tuy bien dock",
          "sap xep dock",
          "an dock",
          "cai dat",
        ],
        action: () => {
          setActiveTab("settings");
          setActiveSettingSection("appearance");
          triggerToast("Tùy biến thanh Dock");
        },
      },
      {
        id: "set-search-group",
        title: "Cài đặt Tìm kiếm",
        category: "Cài đặt",
        description:
          "Tùy chỉnh các danh mục kết quả hiển thị trong Spotlight Search",
        icon: Search,
        keywords: [
          "cai dat tim kiem",
          "search settings",
          "spotlight search",
          "danh muc",
          "tin tuc",
          "truyen hinh",
          "so hieu kenh",
          "toolbox",
          "cai dat",
        ],
        action: () => {
          setActiveTab("settings");
          setActiveSettingSection("search");
          triggerToast("Mở Cài đặt Tìm kiếm");
        },
      },
      {
        id: "set-accessibility",
        title: "Cài đặt Trợ năng",
        category: "Cài đặt",
        description: "Điều chỉnh tự động trượt banner và tương tác menu",
        icon: Key,
        keywords: [
          "tro nang",
          "accessibility",
          "auto slide",
          "auto hide sidebar",
          "banner",
          "cai dat",
        ],
        action: () => {
          setActiveTab("settings");
          setActiveSettingSection("accessibility");
          triggerToast("Mở Cài đặt Trợ năng");
        },
      },
      {
        id: "set-auto-slide",
        title: "Tự động trượt hình Banner",
        category: "Cài đặt",
        description: "Banner hình ảnh ở trang chủ tự động trượt sau mỗi 5 giây",
        icon: Sliders,
        keywords: [
          "auto slide",
          "truot banner",
          "banner 5 giay",
          "tu dong",
          "cai dat",
        ],
        action: () => {
          setActiveTab("settings");
          setActiveSettingSection("accessibility");
          triggerToast("Cài đặt Tự động trượt banner");
        },
      },
      {
        id: "set-auto-hide",
        title: "Tự động ẩn Sidebar",
        category: "Cài đặt",
        description: "Tự động thu gọn thanh menu khi không di chuột vào",
        icon: Sliders,
        keywords: [
          "auto hide sidebar",
          "an sidebar",
          "thu gon sidebar",
          "cai dat",
        ],
        action: () => {
          setActiveTab("settings");
          setActiveSettingSection("accessibility");
          triggerToast("Cài đặt Tự động ẩn Sidebar");
        },
      },
      {
        id: "set-plugins",
        title: "Cửa hàng tiện ích (Plugin Store)",
        category: "Cài đặt",
        description: "Cài đặt và gỡ bỏ các gói tiện ích mở rộng",
        icon: Puzzle,
        keywords: [
          "cua hang tien ich",
          "plugin store",
          "plugin",
          "extensions",
          "tien ich mo rong",
          "cai dat",
        ],
        action: () => {
          setActiveTab("settings");
          setActiveSettingSection("plugin_store");
          triggerToast("Mở Cửa hàng tiện ích");
        },
      },
      {
        id: "set-dev",
        title: "Tùy chọn nhà phát triển (Design Components)",
        category: "Cài đặt",
        description: "Kiểm tra hệ thống ngôn ngữ thiết kế và thành phần UI",
        icon: Cpu,
        keywords: [
          "tuy chon nha phat trien",
          "developer options",
          "design components",
          "ui design",
          "design system",
          "cai dat",
        ],
        action: () => {
          setActiveTab("settings");
          setActiveSettingSection("design_system");
          triggerToast("Mở Tùy chọn nhà phát triển");
        },
      },
      {
        id: "set-about",
        title: "Về Waves Community",
        category: "Cài đặt",
        description: "Thông tin phiên bản, bản quyền và đội ngũ phát triển",
        icon: Info,
        keywords: [
          "ve waves community",
          "about",
          "gioi thieu",
          "thong tin ung dung",
          "ban quyen",
          "cai dat",
        ],
        action: () => {
          setActiveTab("settings");
          setActiveSettingSection("about");
          triggerToast("Mở Về Waves Community");
        },
      },
      {
        id: "set-reload",
        title: "Tải lại ứng dụng (Reload App)",
        category: "Cài đặt",
        description: "Làm mới và nạp lại toàn bộ trang web",
        icon: RefreshCw,
        keywords: ["reload app", "tai lai", "lam moi", "refresh", "cai dat"],
        action: () => {
          window.location.reload();
        },
      },
      {
        id: "set-reset",
        title: "Khôi phục cài đặt gốc (Factory Reset)",
        category: "Cài đặt",
        description: "Xóa toàn bộ dữ liệu tạm và đưa về cấu hình ban đầu",
        icon: HardDrive,
        keywords: [
          "factory reset",
          "khoi phuc cai dat goc",
          "xoa du lieu",
          "reset",
          "cai dat",
        ],
        action: () => {
          setShowFactoryResetConfirmModal(true);
        },
      },
      {
        id: "set-feedback",
        title: "Gửi phản hồi / Báo lỗi",
        category: "Cài đặt",
        description: "Đóng góp ý kiến và phản hồi chất lượng kênh",
        icon: MessageSquare,
        keywords: [
          "feedback",
          "gui phan hoi",
          "bao loi",
          "dong gop y kien",
          "cai dat",
        ],
        action: () => {
          setShowFeedbackModal(true);
        },
      },
    ],
    [],
  );

  // Unified Spotlight Search across Tabs, V-Apps, V-Premium, Toolbox, Settings, News, and Channels
  const spotlightSearchResults = useMemo(() => {
    const q = menubarSearchQuery.trim().toLowerCase();
    if (!q) {
      return {
        navTabs: [],
        vapps: [],
        vpremium: [],
        toolbox: [],
        settings: [],
        news: [],
        channels: [],
        total: 0,
      };
    }

    // 1. Matched Tabs & Navigation (Danh mục)
    let navTabs: typeof spotlightNavTabs = [];
    if (spotlightSearchSettings.categories) {
      navTabs = spotlightNavTabs.filter(
        (tab) =>
          tab.title.toLowerCase().includes(q) ||
          tab.category.toLowerCase().includes(q) ||
          tab.description.toLowerCase().includes(q) ||
          tab.keywords.some((k) => k.toLowerCase().includes(q)),
      );
    }

    // 2. Matched V-Apps & 5 Games Ore UI (V-Arcade, V-Files, Explore VN, V-Learn, V-Calc, V-Notes...)
    let vapps: typeof spotlightVAppsItems = [];
    if (spotlightSearchSettings.vapps) {
      vapps = spotlightVAppsItems.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.subCategory.toLowerCase().includes(q) ||
          item.badge.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.toLowerCase().includes(q)),
      );
    }

    // 3. Matched V-Premium (Gói V-Cloud Storage 50GB / 200GB / 2TB, V-Bank, Verified Tích Xanh)
    let vpremium: typeof spotlightVPremiumItems = [];
    if (spotlightSearchSettings.vpremium) {
      vpremium = spotlightVPremiumItems.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.subCategory.toLowerCase().includes(q) ||
          item.badge.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.toLowerCase().includes(q)),
      );
    }

    // 4. Matched Toolbox
    let toolbox: typeof spotlightToolboxItems = [];
    if (spotlightSearchSettings.toolbox) {
      toolbox = spotlightToolboxItems.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.toLowerCase().includes(q)),
      );
    }

    // 5. Matched Settings (Cài đặt)
    let settings: typeof spotlightSettingsItems = [];
    if (spotlightSearchSettings.settings) {
      settings = spotlightSettingsItems.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.toLowerCase().includes(q)),
      );
    }

    // 6. Matched News (Tin tức)
    let news: typeof NEWS_LIST = [];
    if (spotlightSearchSettings.news) {
      news = NEWS_LIST.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q) ||
          (item.fullContent && item.fullContent.toLowerCase().includes(q)),
      );
    }

    // 7. Matched Channels (Truyền hình & Số hiệu kênh)
    let channels: Channel[] = [];
    if (spotlightSearchSettings.channels) {
      let channelsToSearch = allChannelsList;
      if (spotlightCategoryFilter !== "all") {
        const targetCat = allAvailableCategoryList.find(
          (cat) => cat.id === spotlightCategoryFilter,
        );
        if (targetCat) {
          channelsToSearch = targetCat.channels;
        }
      }

      // Check if query contains or is a channel number
      const numMatch = q.match(/(?:kênh|kenh|ch|#|số|so)?\s*(\d+)/i);
      const searchNumber =
        spotlightSearchSettings.channelNumbers && numMatch ? numMatch[1] : null;

      channels = channelsToSearch.filter((ch) => {
        // Name, ID, or Group match
        const matchName =
          ch.name.toLowerCase().includes(q) ||
          ch.id.toLowerCase().includes(q) ||
          (ch.group && ch.group.toLowerCase().includes(q));
        if (matchName) return true;

        // Channel Number match
        if (searchNumber && ch.channelNumber) {
          const chNumInt = parseInt(ch.channelNumber, 10);
          const searchNumInt = parseInt(searchNumber, 10);
          if (
            !isNaN(chNumInt) &&
            !isNaN(searchNumInt) &&
            chNumInt === searchNumInt
          ) {
            return true;
          }
          if (
            ch.channelNumber === searchNumber ||
            ch.channelNumber === searchNumber.padStart(3, "0")
          ) {
            return true;
          }
          if (ch.channelNumber.includes(searchNumber)) {
            return true;
          }
        }
        return false;
      });
    }

    return {
      navTabs,
      vapps,
      vpremium,
      toolbox,
      settings,
      news,
      channels,
      total:
        navTabs.length +
        vapps.length +
        vpremium.length +
        toolbox.length +
        settings.length +
        news.length +
        channels.length,
    };
  }, [
    menubarSearchQuery,
    spotlightNavTabs,
    spotlightVAppsItems,
    spotlightVPremiumItems,
    spotlightToolboxItems,
    spotlightSettingsItems,
    allChannelsList,
    spotlightCategoryFilter,
    allAvailableCategoryList,
    spotlightSearchSettings,
  ]);

  // Reusable Spotlight Unified Results Renderer
  const renderSpotlightUnifiedResults = (
    onSelect: () => void,
    isCompact: boolean = false,
  ) => {
    const { navTabs, vapps, vpremium, toolbox, settings, news, channels, total } =
      spotlightSearchResults;
    const q = menubarSearchQuery.trim();

    if (isSpotlightAllDisabled) {
      return (
        <div className="px-4 py-5 text-center space-y-3 font-sans">
          <p className="text-xs text-white/60 leading-relaxed">
            Spotlight Search is not working since every search result options
            are disabled.
          </p>
          <button
            type="button"
            onClick={() => {
              onSelect();
              setShowSpotlightDisabledModal(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#d0bcff] hover:bg-[#c2a8f9] text-[#381e72] text-xs font-bold transition-all cursor-pointer shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.45)]"
          >
            Go to search settings
          </button>
        </div>
      );
    }

    if (!q) {
      return (
        <div className="px-3 py-4 text-center text-xs text-white/40 font-sans leading-relaxed">
          Nhập từ khóa tìm kiếm V-Apps, Games V-Arcade, V-Premium, Tiện ích hoặc Kênh TV...
        </div>
      );
    }

    if (total === 0) {
      return (
        <div className="px-3 py-4 text-center text-xs text-white/50 font-sans">
          Không tìm thấy kết quả nào phù hợp với &quot;{q}&quot;
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1">
        {/* 1. TABS & NAVIGATION (DANH MỤC) */}
        {navTabs.length > 0 && (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between px-2.5 pt-1.5 pb-0.5 text-[10px] font-extrabold tracking-wider text-rose-400 uppercase font-montserrat select-none">
              <span className="flex items-center gap-1.5">
                <span>Danh mục & Điều hướng</span>
              </span>
              <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono font-semibold">
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
                    onSelect();
                  }}
                  className="w-full px-2.5 py-2 rounded-xl text-left text-xs hover:bg-white/10 text-white/90 hover:text-white font-sans transition-all flex items-center justify-between group gap-2 cursor-pointer border border-transparent hover:border-white/10"
                >
                  <div className="flex items-center gap-2.5 truncate min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <IconComp className="w-3.5 h-3.5 text-rose-400" />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="font-semibold text-white/95 truncate">
                        {tab.title}
                      </span>
                      <span className="text-[10px] text-white/50 truncate">
                        {tab.description}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] bg-rose-500/20 text-rose-300 group-hover:bg-rose-600 group-hover:text-white px-2 py-0.5 rounded font-bold transition-all shrink-0">
                    ĐẾN
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 2. V-APPS & 5 GAMES ORE UI */}
        {vapps.length > 0 && (
          <div className="flex flex-col gap-0.5">
            {navTabs.length > 0 && (
              <div className="border-t border-white/10 my-1 mx-1" />
            )}
            <div className="flex items-center justify-between px-2.5 pt-1.5 pb-0.5 text-[10px] font-extrabold tracking-wider text-emerald-400 uppercase font-montserrat select-none">
              <span className="flex items-center gap-1.5">
                <Gamepad2 className="w-3 h-3 text-emerald-400" />
                <span>V-Apps & 5 Trò Chơi Ore UI</span>
              </span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-semibold">
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
                    onSelect();
                  }}
                  className="w-full px-2.5 py-2 rounded-xl text-left text-xs hover:bg-white/10 text-white/90 hover:text-white font-sans transition-all flex items-center justify-between group gap-2 cursor-pointer border border-transparent hover:border-emerald-500/20"
                >
                  <div className="flex items-center gap-2.5 truncate min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <IconComp className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="flex flex-col truncate">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                          {item.badge}
                        </span>
                        <span className="font-semibold text-white/95 truncate">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/50 truncate">
                        {item.description}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white px-2 py-0.5 rounded font-bold transition-all shrink-0">
                    {isGame ? "CHƠI NGAY" : "MỞ APP"}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 3. V-PREMIUM & V-CLOUD VIP */}
        {vpremium.length > 0 && (
          <div className="flex flex-col gap-0.5">
            {(navTabs.length > 0 || vapps.length > 0) && (
              <div className="border-t border-white/10 my-1 mx-1" />
            )}
            <div className="flex items-center justify-between px-2.5 pt-1.5 pb-0.5 text-[10px] font-extrabold tracking-wider text-amber-400 uppercase font-montserrat select-none">
              <span className="flex items-center gap-1.5">
                <Crown className="w-3 h-3 text-amber-400" />
                <span>V-Premium & V-Cloud VIP</span>
              </span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-semibold">
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
                    onSelect();
                  }}
                  className="w-full px-2.5 py-2 rounded-xl text-left text-xs hover:bg-white/10 text-white/90 hover:text-white font-sans transition-all flex items-center justify-between group gap-2 cursor-pointer border border-transparent hover:border-amber-500/20"
                >
                  <div className="flex items-center gap-2.5 truncate min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <IconComp className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="flex flex-col truncate">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                          {item.badge}
                        </span>
                        <span className="font-semibold text-white/95 truncate">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/50 truncate">
                        {item.description}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 group-hover:bg-amber-500 group-hover:text-black px-2 py-0.5 rounded font-bold transition-all shrink-0">
                    {item.id === "vprem-vbank"
                      ? "GIAO DỊCH"
                      : item.id === "vprem-verified"
                      ? "XÁC MINH"
                      : item.subCategory.includes("Gói cước")
                      ? "XEM GÓI"
                      : "MỞ VIP"}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 4. TOOLBOX */}
        {toolbox.length > 0 && (
          <div className="flex flex-col gap-0.5">
            {(navTabs.length > 0 || vapps.length > 0 || vpremium.length > 0) && (
              <div className="border-t border-white/10 my-1 mx-1" />
            )}
            <div className="flex items-center justify-between px-2.5 pt-1.5 pb-0.5 text-[10px] font-extrabold tracking-wider text-purple-400 uppercase font-montserrat select-none">
              <span className="flex items-center gap-1.5">
                <span>Toolbox & Tiện ích</span>
              </span>
              <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono font-semibold">
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
                    onSelect();
                  }}
                  className="w-full px-2.5 py-2 rounded-xl text-left text-xs hover:bg-white/10 text-white/90 hover:text-white font-sans transition-all flex items-center justify-between group gap-2 cursor-pointer border border-transparent hover:border-white/10"
                >
                  <div className="flex items-center gap-2.5 truncate min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <IconComp className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="font-semibold text-white/95 truncate">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-white/50 truncate">
                        {item.description}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] bg-purple-500/20 text-purple-300 group-hover:bg-purple-600 group-hover:text-white px-2 py-0.5 rounded font-bold transition-all shrink-0">
                    MỞ
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 5. CÀI ĐẶT (SETTINGS) */}
        {settings.length > 0 && (
          <div className="flex flex-col gap-0.5">
            {(navTabs.length > 0 ||
              vapps.length > 0 ||
              vpremium.length > 0 ||
              toolbox.length > 0) && (
              <div className="border-t border-white/10 my-1 mx-1" />
            )}
            <div className="flex items-center justify-between px-2.5 pt-1.5 pb-0.5 text-[10px] font-extrabold tracking-wider text-sky-400 uppercase font-montserrat select-none">
              <span className="flex items-center gap-1.5">
                <span>Cài đặt hệ thống</span>
              </span>
              <span className="text-[9px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded font-mono font-semibold">
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
                    onSelect();
                  }}
                  className="w-full px-2.5 py-2 rounded-xl text-left text-xs hover:bg-white/10 text-white/90 hover:text-white font-sans transition-all flex items-center justify-between group gap-2 cursor-pointer border border-transparent hover:border-white/10"
                >
                  <div className="flex items-center gap-2.5 truncate min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <IconComp className="w-3.5 h-3.5 text-sky-400" />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="font-semibold text-white/95 truncate">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-white/50 truncate">
                        {item.description}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] bg-sky-500/20 text-sky-300 group-hover:bg-sky-600 group-hover:text-white px-2 py-0.5 rounded font-bold transition-all shrink-0">
                    CẤU HÌNH
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 6. NEWS & ANNOUNCEMENTS */}
        {news.length > 0 && (
          <div className="flex flex-col gap-0.5">
            {(navTabs.length > 0 ||
              vapps.length > 0 ||
              vpremium.length > 0 ||
              toolbox.length > 0 ||
              settings.length > 0) && (
              <div className="border-t border-white/10 my-1 mx-1" />
            )}
            <div className="flex items-center justify-between px-2.5 pt-1.5 pb-0.5 text-[10px] font-extrabold tracking-wider text-amber-400 uppercase font-montserrat select-none">
              <span className="flex items-center gap-1.5">
                <span>Tin tức & Thông báo</span>
              </span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-semibold">
                {news.length}
              </span>
            </div>
            {news.map((item) => (
              <button
                key={"news-" + item.id}
                onClick={() => {
                  playPopSound();
                  setActiveTab("news");
                  onSelect();
                  triggerToast(`Mở tin tức: ${item.title}`);
                }}
                className="w-full px-2.5 py-2 rounded-xl text-left text-xs hover:bg-white/10 text-white/90 hover:text-white font-sans transition-all flex items-center justify-between group gap-2 cursor-pointer border border-transparent hover:border-white/10"
              >
                <div className="flex items-center gap-2.5 truncate min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Megaphone className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="font-semibold text-white/95 truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-white/40 truncate">
                      {item.date}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 group-hover:bg-amber-500 group-hover:text-black px-2 py-0.5 rounded font-bold transition-all shrink-0">
                  XEM
                </span>
              </button>
            ))}
          </div>
        )}

        {/* 7. TV CHANNELS */}
        {channels.length > 0 && (
          <div className="flex flex-col gap-0.5">
            {(navTabs.length > 0 ||
              vapps.length > 0 ||
              vpremium.length > 0 ||
              toolbox.length > 0 ||
              settings.length > 0 ||
              news.length > 0) && (
              <div className="border-t border-white/10 my-1 mx-1" />
            )}
            <div className="flex items-center justify-between px-2.5 pt-1.5 pb-0.5 text-[10px] font-extrabold tracking-wider text-cyan-400 uppercase font-montserrat select-none">
              <span className="flex items-center gap-1.5">
                <span>Kênh truyền hình</span>
              </span>
              <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono font-semibold">
                {channels.length}
              </span>
            </div>
            {channels.map((ch) => (
              <button
                key={"ch-" + ch.id}
                onClick={() => {
                  playPopSound();
                  handleSelectChannel(ch);
                  setActiveTab("live");
                  onSelect();
                }}
                className="w-full px-2.5 py-2 rounded-xl text-left text-xs hover:bg-white/10 text-white/90 hover:text-white font-sans transition-all flex items-center justify-between group gap-2 cursor-pointer border border-transparent hover:border-white/10"
              >
                <div className="flex items-center gap-2.5 truncate min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Tv className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="flex flex-col truncate">
                    <div className="flex items-center gap-1.5 truncate">
                      {ch.channelNumber && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                          CH {ch.channelNumber}
                        </span>
                      )}
                      <span className="font-semibold text-white/95 truncate">
                        {ch.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-white/40 truncate">
                      {ch.group || "V-Play"}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] bg-red-600/30 text-red-400 group-hover:bg-red-600 group-hover:text-white px-2 py-0.5 rounded font-bold transition-all shrink-0">
                  PHÁT
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Filter channels based on search on selected category
  const filteredCategories = useMemo(() => {
    return allAvailableCategoryList
      .map((category) => {
        // Filter channels inside
        const matchedChannels = category.channels.filter((ch) => {
          // Search filter matches name, group name
          const matchesSearch = searchQuery
            ? ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              ch.group.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

          return matchesSearch;
        });

        return {
          ...category,
          channels: matchedChannels,
        };
      })
      .filter((category) => {
        // Filter final category selection
        if (selectedCategory !== "all" && category.id !== selectedCategory) {
          return false;
        }
        return category.channels.length > 0;
      });
  }, [allAvailableCategoryList, selectedCategory, searchQuery]);

  // Favorites channels filtered selection
  const favoriteChannelsList = useMemo(() => {
    return flattenedChannels.filter((ch) => favorites.includes(ch.id));
  }, [flattenedChannels, favorites]);

  // Ambient backgrounds options config
  const getBgGradient = () => {
    if (amoledDark) {
      return "bg-[#211f26]";
    }
    switch (bgColor) {
      case "cosmic":
        return "bg-gradient-to-tr from-[#211f26] via-[#2c2933] to-[#1a181f]";
      case "deep":
        return "bg-gradient-to-br from-[#211f26] via-[#1c1b21] to-[#121114]";
      case "aurora":
        return "bg-gradient-to-tr from-[#211f26] via-[#1e2421] to-[#2b2126]";
      case "sunset":
        return "bg-gradient-to-tr from-[#211f26] via-[#33212c] to-[#2e261f]";
    }
  };

  const formatResetCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (showResetSplash) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[99999] overflow-hidden select-none font-google">
        {/* Ambient Orange/Red Glow in the corners */}
        <motion.div
          animate={{
            scale: [0.8, 1.4, 0.8],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[250px] h-[250px] sm:w-[380px] sm:h-[380px] bg-red-600/15 rounded-full blur-[80px] sm:blur-[110px] -top-20 -left-20 pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [0.8, 1.4, 0.8],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[250px] h-[250px] sm:w-[380px] sm:h-[380px] bg-orange-600/15 rounded-full blur-[80px] sm:blur-[110px] -bottom-20 -right-20 pointer-events-none"
        />

        {/* Ambient Orange/Red Glow in the center of splash screen */}
        <motion.div
          animate={{
            x: "-50%",
            y: "-50%",
            scale: [0.6, 1.8, 0.6],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] bg-red-600/20 rounded-full blur-[90px] sm:blur-[120px] top-1/2 left-1/2 pointer-events-none"
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-4 bg-red-500/20 rounded-full blur-xl animate-pulse" />
            <img
              src="https://static.wikia.nocookie.net/ep-deo/images/7/72/Monochrom.png/revision/latest/scale-to-width-down/1000?cb=20260825072411"
              alt="Loading..."
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain animate-spin drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-white text-base sm:text-lg font-bold tracking-wide select-none text-center px-4 font-google">
            Resetting your app to default values
          </span>
          <div className="flex flex-col items-center gap-1 mt-2">
            <span className="text-white/45 text-[11px] sm:text-xs font-bold uppercase tracking-widest font-google">
              THỜI GIAN CÒN LẠI
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-red-400 tracking-tighter font-google">
              {Math.round((resetCountdown / 60) * 100)}%
            </span>
            <span className="text-white/40 text-[10px] sm:text-xs font-normal mt-1 font-google italic">
              Do not close your app
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[99999] overflow-hidden select-none font-google">
        {/* Ambient Purple/Indigo Glow in the corners */}
        <motion.div
          animate={{
            scale: [0.8, 1.4, 0.8],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[250px] h-[250px] sm:w-[380px] sm:h-[380px] bg-purple-600/15 rounded-full blur-[80px] sm:blur-[110px] -top-20 -left-20 pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [0.8, 1.4, 0.8],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[250px] h-[250px] sm:w-[380px] sm:h-[380px] bg-indigo-600/15 rounded-full blur-[80px] sm:blur-[110px] -bottom-20 -right-20 pointer-events-none"
        />

        {/* Ambient Purple Glow in the center of splash screen */}
        <motion.div
          animate={{
            x: "-50%",
            y: "-50%",
            scale: [0.6, 1.8, 0.6],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] bg-purple-600/20 rounded-full blur-[90px] sm:blur-[120px] top-1/2 left-1/2 pointer-events-none"
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-4 bg-white/15 rounded-full blur-xl animate-pulse" />
            <img
              src="https://static.wikia.nocookie.net/ep-deo/images/7/72/Monochrom.png/revision/latest/scale-to-width-down/1000?cb=20260825072411"
              alt="Loading..."
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain animate-spin drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-white text-sm sm:text-base font-bold tracking-wide select-none font-google">
            Connecting to services
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen text-white/95 pb-32 transition-all duration-300 overflow-x-clip ${getBgGradient()} ${
        showHeaderBar ? "pt-11" : ""
      } ${
        dockToSidebar
          ? autoHideSidebar
            ? "pl-0"
            : sidebarExpanded
              ? "pl-0 md:pl-72"
              : "pl-0 md:pl-20"
          : ""
      }`}
    >
      {/* Header Bar Always On Top (when showHeaderBar is true) */}
      {showHeaderBar && (
        <header className="fixed top-0 left-0 right-0 z-[100] h-11 bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.35)] flex items-center justify-between px-1 md:px-2 text-white select-none font-sans">
          {/* Left: macOS Traffic Light Circles */}
          <div className="flex items-center gap-2 pl-2 sm:pl-3 py-1">
            {/* Red: Go back */}
            <div className="relative group/tl flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  playPopSound();
                  if (
                    activeSettingSection === "design_system" ||
                    activeSettingSection === "about"
                  ) {
                    setActiveSettingSection(null);
                  } else if (activeTab !== "home") {
                    setActiveTab("home");
                  } else {
                    window.history.back();
                  }
                }}
                className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] active:bg-[#bf4942] border border-[#e0443e] flex items-center justify-center cursor-pointer active:scale-90 transition-all duration-150"
                aria-label="Go back"
              >
                <ChevronLeft className="w-2.5 h-2.5 text-[#4c0000] stroke-[3] opacity-0 group-hover/tl:opacity-100 transition-opacity" />
              </button>
              {/* Glassmorphism Tooltip (Larger, 100% Rounded, No Animation) */}
              <div className="absolute top-full left-0 mt-2.5 px-3.5 py-1.5 rounded-full bg-[#18161e]/90 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] text-xs font-semibold text-white whitespace-nowrap hidden group-hover/tl:block pointer-events-none z-50">
                Go back
              </div>
            </div>

            {/* Yellow: Expand/Collapse Sidebar */}
            <div className="relative group/tl flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  playPopSound();
                  if (dockToSidebar) {
                    if (isMobile) {
                      setShowMobileSidebar(!showMobileSidebar);
                    } else {
                      setSidebarExpanded(!sidebarExpanded);
                    }
                  } else {
                    setDockToSidebar(true);
                    setSidebarExpanded(true);
                  }
                }}
                className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] active:bg-[#bfa222] border border-[#dea123] flex items-center justify-center cursor-pointer active:scale-90 transition-all duration-150"
                aria-label="Expand/Collapse"
              >
                <Minus className="w-2.5 h-2.5 text-[#543500] stroke-[3] opacity-0 group-hover/tl:opacity-100 transition-opacity" />
              </button>
              {/* Glassmorphism Tooltip (Larger, 100% Rounded, No Animation) */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 px-3.5 py-1.5 rounded-full bg-[#18161e]/90 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] text-xs font-semibold text-white whitespace-nowrap hidden group-hover/tl:block pointer-events-none z-50">
                Expand/Collapse
              </div>
            </div>

            {/* Green: Toggle Dock to Sidebar */}
            <div className="relative group/tl flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  playPopSound();
                  const nextVal = !dockToSidebar;
                  setDockToSidebar(nextVal);
                  if (nextVal && !isMobile) {
                    setSidebarExpanded(true);
                  }
                  triggerToast(
                    nextVal
                      ? "Đã bật: Chuyển Dock thành Sidebar bên trái"
                      : "Đã tắt: Chuyển Sidebar thành Dock dưới",
                  );
                }}
                className="w-3.5 h-3.5 rounded-full bg-[#27c93f] active:bg-[#1f9a30] border border-[#1aab29] flex items-center justify-center cursor-pointer active:scale-90 transition-all duration-150"
                aria-label="Chuyển Dock thành Sidebar bên trái"
              >
                <PanelLeft className="w-2 h-2 text-[#003808] stroke-[3] opacity-0 group-hover/tl:opacity-100 transition-opacity" />
              </button>
              {/* Glassmorphism Tooltip (Larger, 100% Rounded, No Animation) */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 px-3.5 py-1.5 rounded-full bg-[#18161e]/90 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] text-xs font-semibold text-white whitespace-nowrap hidden group-hover/tl:block pointer-events-none z-50">
                {dockToSidebar
                  ? "Tắt Sidebar (chuyển về Dock)"
                  : "Chuyển Dock thành Sidebar"}
              </div>
            </div>
          </div>

          {/* Center: Title in Montserrat bold font */}
          <div className="font-extrabold text-[12px] sm:text-[13px] tracking-widest text-white/95 uppercase font-montserrat text-center px-2 truncate">
            {getHeaderTitle()}
          </div>

          {/* Right: Spotlight Search button */}
          <div className="relative flex items-center gap-1 group/search">
            <button
              type="button"
              onClick={() => {
                playPopSound();
                if (isSpotlightAllDisabled) {
                  setShowSpotlightDisabledModal(true);
                  return;
                }
                setIsSpotlightOpen(true);
              }}
              className="w-8 h-8 rounded-lg hover:bg-white/10 active:bg-white/15 flex items-center justify-center text-white/90 hover:text-white active:scale-95 transition-all cursor-pointer"
              aria-label="Spotlight Search"
            >
              <img
                src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest/scale-to-width-down/1000?cb=20260717131751"
                className="w-[15px] h-[15px] object-contain brightness-0 invert opacity-90"
                referrerPolicy="no-referrer"
                alt="Search"
              />
            </button>

            {/* Glassmorphism Tooltip for Spotlight Search */}
            <div className="absolute top-full right-0 mt-2.5 px-3.5 py-1.5 rounded-full bg-[#18161e]/90 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] text-xs font-semibold text-white whitespace-nowrap hidden group-hover/search:block pointer-events-none z-50">
              Spotlight Search (⌘K)
            </div>
          </div>
</header>
      )}

      {/* High-Fidelity Sidebar Left Navigation (Inspired by the design) */}
      {dockToSidebar && (
        <>
          {/* Auto-hide hover trigger zone on left screen edge for desktop */}
          {autoHideSidebar && !isMobile && (
            <div
              onMouseEnter={() => setIsSidebarHovered(true)}
              className={`fixed ${showHeaderBar ? "top-11" : "top-0"} left-0 bottom-0 w-4 z-[65] pointer-events-auto`}
            />
          )}

          {/* Backdrop for mobile sidebar drawer */}
          {isMobile && showMobileSidebar && (
            <div
              className={`fixed ${showHeaderBar ? "top-11" : "top-0"} inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden`}
              onClick={() => setShowMobileSidebar(false)}
            />
          )}

          <aside
            onMouseEnter={() => setIsSidebarHovered(true)}
            onMouseLeave={() => setIsSidebarHovered(false)}
            className={`fixed ${showHeaderBar ? "top-11 h-[calc(100vh-44px)]" : "top-0 h-screen"} left-0 z-[70] bg-[#2c2c2c] border-r-2 border-[#505050] transition-all duration-300 flex flex-col ${
              isMobile
                ? showMobileSidebar
                  ? "translate-x-0 w-full"
                  : "-translate-x-full w-full"
                : autoHideSidebar
                  ? isSidebarHovered
                    ? "translate-x-0 w-72 shadow-2xl"
                    : "-translate-x-full w-72"
                  : sidebarExpanded
                    ? "w-72"
                    : "w-20"
            }`}
          >
            {isSidebarLoading ? (
              <div className="w-full h-full flex items-center justify-center p-4 select-none">
                <img
                  src="https://static.wikia.nocookie.net/ep-deo/images/7/72/Monochrom.png/revision/latest/scale-to-width-down/1000?cb=20260825072411"
                  alt="Loading..."
                  className="w-7 h-7 object-contain animate-spin"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col h-full w-full overflow-hidden"
              >
                {/* Header section with brand logo & collapse button */}
                <div className="h-20 flex items-center justify-between px-4 border-b border-white/5 select-none shrink-0">
                  {sidebarExpanded || isMobile || autoHideSidebar ? (
                    <div className="flex items-center gap-3 pl-2">
                      <img
                        src="https://static.wikia.nocookie.net/ep-deo/images/7/72/Monochrom.png/revision/latest/scale-to-width-down/1000?cb=20260825072411"
                        alt="Waves Community Brand Logo"
                        referrerPolicy="no-referrer"
                        className="h-7 w-auto object-contain"
                      />
                      {showClock && (
                        <div className="flex flex-col pl-3 border-l border-white/15 select-none shrink-0 leading-tight">
                          <DigitalClock variant="sidebar" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mx-auto">
                      <img
                        src="https://static.wikia.nocookie.net/ep-deo/images/7/72/Monochrom.png/revision/latest/scale-to-width-down/1000?cb=20260825072411"
                        alt="Waves Community Brand Logo"
                        referrerPolicy="no-referrer"
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                  )}

                  {isMobile ? (
                    <button
                      type="button"
                      onClick={() => setShowMobileSidebar(false)}
                      className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer shrink-0"
                      title="Đóng Sidebar"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  ) : (
                    !autoHideSidebar &&
                    sidebarExpanded &&
                    !showHeaderBar && (
                      <button
                        type="button"
                        onClick={() => setSidebarExpanded(false)}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] flex items-center justify-center cursor-pointer transition-all bouncy-btn shrink-0"
                        title="Thu nhỏ Sidebar"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )
                  )}
                </div>

                {/* If collapsed, show an expand button at the top (only if header bar is not enabled) */}
                {!autoHideSidebar &&
                  !sidebarExpanded &&
                  !isMobile &&
                  !showHeaderBar && (
                    <div className="flex justify-center py-4 border-b border-white/5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSidebarExpanded(true)}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] flex items-center justify-center cursor-pointer transition-all bouncy-btn"
                        title="Mở rộng Sidebar"
                      >
                        <ChevronRight className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  )}

                {/* Menu Items list */}
                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-5 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {/* Spotlight Search at the absolute top of sidebar (above Home) */}
                  {!showHeaderBar &&
                    dockItems.find((it) => it.id === "search")?.enabled &&
                      (sidebarExpanded || isMobile ? (
                        <div
                          key="sidebar-search-spotlight"
                          className="space-y-1"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              playPopSound();
                              if (isSpotlightAllDisabled) {
                                setShowSpotlightDisabledModal(true);
                                return;
                              }
                              setIsSpotlightOpen(true);
                            }}
                            className="h-10 w-full relative flex items-center justify-between px-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white/85 hover:text-white border border-white/10 transition-all duration-200 cursor-pointer group/sidebar select-none shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest/scale-to-width-down/1000?cb=20260717131751"
                                className="w-4 h-4 brightness-0 invert opacity-80 group-hover/sidebar:opacity-100"
                                referrerPolicy="no-referrer"
                                alt="Search"
                              />
                              <span className="text-xs font-semibold tracking-wide font-sans">
                                Spotlight Search
                              </span>
                            </div>
                            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-white/60 font-mono">
                              ⌘K
                            </kbd>
                          </button>
                        </div>
                      ) : (
                        <div
                          key="sidebar-search-spotlight-collapsed"
                          className="space-y-1"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              playPopSound();
                              if (isSpotlightAllDisabled) {
                                setShowSpotlightDisabledModal(true);
                                return;
                              }
                              setIsSpotlightOpen(true);
                            }}
                            className="h-10 w-full relative flex items-center justify-center rounded-xl border border-transparent text-white/75 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer group/sidebar select-none"
                          >
                            <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#121116] border border-white/10 text-white text-xs font-sans font-medium rounded-lg opacity-0 scale-95 pointer-events-none group-hover/sidebar:opacity-100 group-hover/sidebar:scale-100 transition-none shadow-xl whitespace-nowrap z-50">
                              Spotlight Search (⌘K)
                            </div>
                            <img
                              src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest/scale-to-width-down/1000?cb=20260717131751"
                              className="w-4.5 h-4.5 brightness-0 invert"
                              referrerPolicy="no-referrer"
                              alt="Search"
                            />
                          </button>
                        </div>
                      ))}

                  {dockItems
                    .filter(
                      (item) =>
                        item.enabled &&
                        item.id !== "settings" &&
                        item.id !== "search",
                    )
                    .map((tab) => {
                      const isActive = isDockItemActive(tab.id);
                      const config = getDockItemConfig(tab.id);

                      return (
                        <div key={tab.id} className="space-y-1">
                          <button
                            type="button"
                            onClick={() => handleDockItemClick(tab.id)}
                            className={`h-10 w-full relative flex items-center ${
                              sidebarExpanded || isMobile
                                ? "justify-start px-4"
                                : "justify-center"
                            } rounded-xl transition-all duration-200 cursor-pointer group/sidebar select-none box-border ${
                              isActive
                                ? "bg-[#d946ef] text-white font-bold shadow-lg shadow-fuchsia-500/25 border border-white/20"
                                : "border border-transparent text-white/75 hover:text-white hover:bg-[#d946ef]"
                            }`}
                          >
                            {/* Tooltip when collapsed */}
                            {!(sidebarExpanded || isMobile) && (
                              <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#121116] border border-white/10 text-white text-xs font-sans font-medium rounded-lg opacity-0 scale-95 pointer-events-none group-hover/sidebar:opacity-100 group-hover/sidebar:scale-100 transition-none shadow-xl whitespace-nowrap z-50">
                                {config.label}
                              </div>
                            )}

                            {/* Icon */}
                            {config.isImg ? (
                              <img
                                src={config.icon}
                                className={`${tab.id === "search" ? "w-4.5 h-4.5" : tab.id === "remote" ? "w-6 h-6" : "w-4.5 h-4.5"} object-contain transition-none ${
                                  isActive
                                    ? "scale-105"
                                    : "group-hover/sidebar:scale-105"
                                }`}
                                style={{ filter: "brightness(0) invert(1)" }}
                                alt={config.label}
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              (() => {
                                const IconComponent = config.icon;
                                return (
                                  <IconComponent
                                    className={`w-4.5 h-4.5 text-white transition-none ${
                                      isActive
                                        ? "scale-105 stroke-[2.2]"
                                        : "group-hover/sidebar:scale-105 stroke-[1.8]"
                                    }`}
                                  />
                                );
                              })()
                            )}

                            {/* Text */}
                            {(sidebarExpanded || isMobile) && (
                              <span className="text-xs font-semibold tracking-wide font-sans pl-3.5 flex-1 text-left">
                                {config.label}
                              </span>
                            )}

                            {/* Show Chevron for expandable states in Sidebar */}
                            {(sidebarExpanded || isMobile) &&
                              tab.id === "live" && (
                                <ChevronDown
                                  className={`w-3.5 h-3.5 text-white group-hover/sidebar:text-white transition-transform ${
                                    isActive ? "rotate-180" : ""
                                  }`}
                                />
                              )}
                          </button>

                          {/* Submenu details when sidebar is expanded & active/open */}
                          {(sidebarExpanded || isMobile) &&
                            isActive &&
                            tab.id === "live" && (
                              <div className="border-l border-white/10 ml-7 pl-0 flex flex-col gap-1 mt-2 pr-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    playPopSound();
                                    if (selectedChannel) {
                                      toggleFavorite(selectedChannel.id);
                                    } else {
                                      triggerToast("Vui lòng chọn 1 kênh");
                                    }
                                  }}
                                  className="w-full text-left text-xs font-medium px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2.5 cursor-pointer"
                                >
                                  <ThumbsUp
                                    className={`w-3.5 h-3.5 ${selectedChannel && isFavorite(selectedChannel.id) ? "text-red-500 fill-red-500" : "text-white/70"}`}
                                  />
                                  <span>Thêm vào yêu thích</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    playPopSound();
                                    if (selectedChannel?.url) {
                                      window.open(
                                        selectedChannel.url,
                                        "_blank",
                                      );
                                      triggerToast(
                                        "Đã mở luồng gốc " +
                                          selectedChannel.name,
                                      );
                                    } else {
                                      triggerToast("Vui lòng chọn 1 kênh");
                                    }
                                  }}
                                  className="w-full text-left text-xs font-medium px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2.5 cursor-pointer"
                                >
                                  <ExternalLink className="w-3.5 h-3.5 text-white/70" />
                                  <span>Mở luồng gốc</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    playPopSound();
                                    if (selectedChannel) {
                                      navigator.clipboard?.writeText(
                                        selectedChannel.url ||
                                          window.location.href,
                                      );
                                      triggerToast(
                                        "Đã sao chép liên kết chia sẻ",
                                      );
                                    } else {
                                      triggerToast("Vui lòng chọn 1 kênh");
                                    }
                                  }}
                                  className="w-full text-left text-xs font-medium px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2.5 cursor-pointer"
                                >
                                  <Share2 className="w-3.5 h-3.5 text-white/70" />
                                  <span>Chia sẻ</span>
                                </button>

                                <div className="my-1.5 border-t border-white/10 mx-2" />

                                <button
                                  type="button"
                                  onClick={() => {
                                    playPopSound();
                                    handleOpenMultiviewSelector();
                                  }}
                                  className="w-full text-left text-xs font-medium px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2.5 cursor-pointer"
                                >
                                  <Grid className="w-3.5 h-3.5 text-white/70" />
                                  <span>Chế độ Multiview</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    playPopSound();
                                    handleTogglePictureInPicture();
                                  }}
                                  className="w-full text-left text-xs font-medium px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2.5 cursor-pointer"
                                >
                                  <Maximize2 className="w-3.5 h-3.5 text-white/70" />
                                  <span>Picture in Picture</span>
                                </button>
                              </div>
                            )}
                        </div>
                      );
                    })}

                  {/* Visual separator for extra utility menus */}
                  <div className="border-t border-white/5 my-4" />

                  {/* COLLAPSIBLE SIDEBAR MENU: FAVORITES */}
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (!sidebarExpanded && !isMobile) {
                          setSidebarExpanded(true);
                          setSidebarFavoritesOpen(true);
                        } else {
                          setSidebarFavoritesOpen(!sidebarFavoritesOpen);
                        }
                      }}
                      className={`h-10 w-full relative flex items-center ${
                        sidebarExpanded || isMobile
                          ? "justify-start px-4"
                          : "justify-center"
                      } rounded-xl transition-all duration-200 cursor-pointer group/sidebar select-none box-border border border-transparent ${
                        sidebarFavoritesOpen && (sidebarExpanded || isMobile)
                          ? "text-white font-semibold"
                          : "text-white/75 hover:text-white"
                      }`}
                    >
                      {!(sidebarExpanded || isMobile) && (
                        <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#121116] border border-white/10 text-white text-xs font-sans font-medium rounded-lg opacity-0 scale-95 pointer-events-none group-hover/sidebar:opacity-100 group-hover/sidebar:scale-100 transition-none shadow-xl whitespace-nowrap z-50">
                          Favorites
                        </div>
                      )}
                      <ThumbsUp className="w-4.5 h-4.5 text-white transition-none stroke-[1.8]" />
                      {(sidebarExpanded || isMobile) && (
                        <span className="text-xs font-semibold tracking-wide font-sans pl-3.5 flex-1 text-left">
                          Favorites
                        </span>
                      )}
                      {(sidebarExpanded || isMobile) && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-white group-hover/sidebar:text-white transition-transform ${
                            sidebarFavoritesOpen ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    <AnimatePresence initial={false}>
                      {(sidebarExpanded || isMobile) &&
                        sidebarFavoritesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.15, ease: "easeInOut" }}
                            className="overflow-hidden border-l border-white/10 ml-7 pl-0 flex flex-col gap-2.5 mt-2"
                          >
                            {favoriteChannelsList.length > 0 ? (
                              favoriteChannelsList.map((ch) => (
                                <button
                                  key={ch.id}
                                  type="button"
                                  onClick={() => {
                                    handleSelectChannel(ch);
                                    setActiveTab("live");
                                    triggerToast(
                                      `Phát kênh yêu thích: ${ch.name}`,
                                    );
                                  }}
                                  className={`w-full text-left text-xs font-medium pl-5 pr-2.5 py-1.5 border-l-2 transition-all flex items-center justify-between gap-1 ${
                                    selectedChannel?.id === ch.id &&
                                    activeTab === "live"
                                      ? "border-red-500 text-red-400 font-bold"
                                      : "border-transparent text-white/70 hover:text-red-400 hover:border-red-400"
                                  }`}
                                >
                                  <span className="truncate">{ch.name}</span>
                                  <span
                                    className={`text-[8px] px-1 py-0.5 rounded font-bold shrink-0 ${selectedChannel?.id === ch.id && activeTab === "live" ? "bg-red-500/20 text-red-300" : "bg-white/15 text-white"}`}
                                  >
                                    Phát
                                  </span>
                                </button>
                              ))
                            ) : (
                              <span className="text-[11px] text-white/40 italic pl-5">
                                Chưa có kênh yêu thích
                              </span>
                            )}
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </div>

                  {/* COLLAPSIBLE SIDEBAR MENU: TOOLBOX */}
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (!sidebarExpanded && !isMobile) {
                          setSidebarExpanded(true);
                          setSidebarFileOpen(true);
                        } else {
                          setSidebarFileOpen(!sidebarFileOpen);
                        }
                      }}
                      className={`h-10 w-full relative flex items-center ${
                        sidebarExpanded || isMobile
                          ? "justify-start px-4"
                          : "justify-center"
                      } rounded-xl transition-all duration-200 cursor-pointer group/sidebar select-none box-border border border-transparent ${
                        sidebarFileOpen && (sidebarExpanded || isMobile)
                          ? "text-white font-semibold"
                          : "text-white/75 hover:text-white"
                      }`}
                    >
                      {!(sidebarExpanded || isMobile) && (
                        <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#121116] border border-white/10 text-white text-xs font-sans font-medium rounded-lg opacity-0 scale-95 pointer-events-none group-hover/sidebar:opacity-100 group-hover/sidebar:scale-100 transition-none shadow-xl whitespace-nowrap z-50">
                          Toolbox
                        </div>
                      )}
                      <Package className="w-4.5 h-4.5 text-white transition-none stroke-[1.8]" />
                      {(sidebarExpanded || isMobile) && (
                        <span className="text-xs font-semibold tracking-wide font-sans pl-3.5 flex-1 text-left">
                          Toolbox
                        </span>
                      )}
                      {(sidebarExpanded || isMobile) && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-white group-hover/sidebar:text-white transition-transform ${
                            sidebarFileOpen ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    <AnimatePresence initial={false}>
                      {(sidebarExpanded || isMobile) && sidebarFileOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15, ease: "easeInOut" }}
                          className="overflow-hidden border-l border-white/10 ml-7 pl-0 flex flex-col gap-2.5 mt-2"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setShowPlayUrlModal(true);
                              triggerToast("Mở: Xem luồng kênh qua URL");
                            }}
                            className="w-full text-left text-xs font-medium pl-5 pr-2.5 py-1.5 border-l-2 transition-all flex items-center gap-2 border-transparent text-white/70 hover:text-red-400 hover:border-red-400 group cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 text-white group-hover:text-red-400 shrink-0" />
                            <span>Xem luồng qua URL</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowCustomModal(true);
                              triggerToast("Mở: Thêm luồng kênh");
                            }}
                            className="w-full text-left text-xs font-medium pl-5 pr-2.5 py-1.5 border-l-2 transition-all flex items-center gap-2 border-transparent text-white/70 hover:text-red-400 hover:border-red-400 group cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-white group-hover:text-red-400 shrink-0" />
                            <span>Thêm luồng kênh</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              fileInputRef.current?.click();
                              triggerToast("Mở: Chọn file M3U");
                            }}
                            className="w-full text-left text-xs font-medium pl-5 pr-2.5 py-1.5 border-l-2 transition-all flex items-center gap-2 border-transparent text-white/70 hover:text-red-400 hover:border-red-400 group cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5 text-white group-hover:text-red-400 shrink-0" />
                            <span>Nhập file m3u/m3u8</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleM3uExport();
                              triggerToast("Xuất: Xuất file M3U");
                            }}
                            className="w-full text-left text-xs font-medium pl-5 pr-2.5 py-1.5 border-l-2 transition-all flex items-center gap-2 border-transparent text-white/70 hover:text-red-400 hover:border-red-400 group cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-white group-hover:text-red-400 shrink-0" />
                            <span>Xuất file m3u/m3u8</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* COLLAPSIBLE SIDEBAR MENU: HELP */}
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (!sidebarExpanded && !isMobile) {
                          setSidebarExpanded(true);
                          setSidebarHelpOpen(true);
                        } else {
                          setSidebarHelpOpen(!sidebarHelpOpen);
                        }
                      }}
                      className={`h-10 w-full relative flex items-center ${
                        sidebarExpanded || isMobile
                          ? "justify-start px-4"
                          : "justify-center"
                      } rounded-xl transition-all duration-200 cursor-pointer group/sidebar select-none box-border border border-transparent ${
                        sidebarHelpOpen && (sidebarExpanded || isMobile)
                          ? "text-white font-semibold"
                          : "text-white/75 hover:text-white"
                      }`}
                    >
                      {!(sidebarExpanded || isMobile) && (
                        <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#121116] border border-white/10 text-white text-xs font-sans font-medium rounded-lg opacity-0 scale-95 pointer-events-none group-hover/sidebar:opacity-100 group-hover/sidebar:scale-100 transition-none shadow-xl whitespace-nowrap z-50">
                          Help
                        </div>
                      )}
                      <BookOpen className="w-4.5 h-4.5 text-white transition-none stroke-[1.8]" />
                      {(sidebarExpanded || isMobile) && (
                        <span className="text-xs font-semibold tracking-wide font-sans pl-3.5 flex-1 text-left">
                          Help
                        </span>
                      )}
                      {(sidebarExpanded || isMobile) && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-white group-hover/sidebar:text-white transition-transform ${
                            sidebarHelpOpen ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    <AnimatePresence initial={false}>
                      {(sidebarExpanded || isMobile) && sidebarHelpOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15, ease: "easeInOut" }}
                          className="overflow-hidden border-l border-white/10 ml-7 pl-0 flex flex-col gap-2.5 mt-2"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              window.location.reload();
                            }}
                            className="w-full text-left text-xs font-medium pl-5 pr-2.5 py-1.5 border-l-2 transition-all flex items-center gap-2 border-transparent text-white/70 hover:text-red-400 hover:border-red-400 group cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-white group-hover:text-red-400 shrink-0" />
                            <span>Reload App</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowFactoryResetConfirmModal(true);
                            }}
                            className="w-full text-left text-xs font-medium pl-5 pr-2.5 py-1.5 border-l-2 transition-all flex items-center gap-2 border-transparent text-white hover:text-red-400 hover:border-red-400 group cursor-pointer"
                          >
                            <HardDrive className="w-3.5 h-3.5 text-white group-hover:text-red-400 shrink-0" />
                            <span>Factory Reset</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowFeedbackModal(true);
                            }}
                            className="w-full text-left text-xs font-medium pl-5 pr-2.5 py-1.5 border-l-2 transition-all flex items-center gap-2 border-transparent text-white/70 hover:text-red-400 hover:border-red-400 group cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-white group-hover:text-red-400 shrink-0" />
                            <span>Submit Feedback</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowTestVplayConfirmModal(true);
                            }}
                            className="w-full text-left text-xs font-medium pl-5 pr-2.5 py-1.5 border-l-2 transition-all flex items-center gap-2 border-transparent text-white/70 hover:text-red-400 hover:border-red-400 group cursor-pointer"
                          >
                            <FolderOpen className="w-3.5 h-3.5 text-white group-hover:text-red-400 shrink-0" />
                            <span>Test Waves Community</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* SIDEBAR MENU: ABOUT (MOVED TO ROOT LEVEL) */}
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        playPopSound();
                        setActiveTab("settings");
                        setActiveSettingSection("about");
                        triggerToast("Mở: Về Waves Community");
                      }}
                      className={`h-10 w-full relative flex items-center ${
                        sidebarExpanded || isMobile
                          ? "justify-start px-4"
                          : "justify-center"
                      } rounded-xl transition-all duration-200 cursor-pointer group/sidebar select-none box-border ${
                        activeTab === "settings" &&
                        activeSettingSection === "about"
                          ? "bg-[#d946ef] text-white font-bold shadow-lg shadow-fuchsia-500/25 border border-white/20"
                          : "border border-transparent text-white/75 hover:text-white hover:bg-[#d946ef]"
                      }`}
                    >
                      {!(sidebarExpanded || isMobile) && (
                        <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#121116] border border-white/10 text-white text-xs font-sans font-medium rounded-lg opacity-0 scale-95 pointer-events-none group-hover/sidebar:opacity-100 group-hover/sidebar:scale-100 transition-none shadow-xl whitespace-nowrap z-50">
                          About
                        </div>
                      )}
                      <Info className="w-4.5 h-4.5 text-white transition-none stroke-[1.8]" />
                      {(sidebarExpanded || isMobile) && (
                        <span className="text-xs font-semibold tracking-wide font-sans pl-3.5 flex-1 text-left">
                          About
                        </span>
                      )}
                    </button>
                  </div>

                  {/* SIDEBAR MENU: JOIN WAVES ON DISCORD (UNDER ABOUT) */}
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        playPopSound();
                        window.open("https://discord.gg/waves", "_blank");
                        triggerToast("Đang mở Waves Community Discord");
                      }}
                      className={`h-10 w-full relative flex items-center ${
                        sidebarExpanded || isMobile
                          ? "justify-start px-4"
                          : "justify-center"
                      } rounded-xl transition-all duration-200 cursor-pointer group/sidebar select-none box-border border border-transparent text-white/80 hover:text-white hover:bg-white/10`}
                    >
                      {!(sidebarExpanded || isMobile) && (
                        <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#121116] border border-white/10 text-white text-xs font-sans font-medium rounded-lg opacity-0 scale-95 pointer-events-none group-hover/sidebar:opacity-100 group-hover/sidebar:scale-100 transition-none shadow-xl whitespace-nowrap z-50">
                          Join Waves on Discord
                        </div>
                      )}
                      <DiscordIcon className="w-4.5 h-4.5 text-white group-hover/sidebar:text-white transition-colors" />
                      {(sidebarExpanded || isMobile) && (
                        <span className="text-xs font-semibold tracking-wide font-sans pl-3.5 flex-1 text-left flex items-center justify-between">
                          <span>Join Waves on Discord</span>
                          <ExternalLink className="w-3 h-3 text-white/40 group-hover/sidebar:text-white/80 shrink-0" />
                        </span>
                      )}
                    </button>
                  </div>

                  {/* SIDEBAR MENU: SETTINGS */}
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("settings");
                        setActiveSettingSection(null);
                        triggerToast("Mở: Cài đặt");
                      }}
                      className={`h-10 w-full relative flex items-center ${
                        sidebarExpanded || isMobile
                          ? "justify-start px-4"
                          : "justify-center"
                      } rounded-xl transition-all duration-200 cursor-pointer group/sidebar select-none box-border ${
                        activeTab === "settings" &&
                        activeSettingSection === null
                          ? "bg-[#d946ef] text-white font-bold shadow-lg shadow-fuchsia-500/25 border border-white/20"
                          : "border border-transparent text-white/75 hover:text-white hover:bg-[#d946ef]"
                      }`}
                    >
                      {!(sidebarExpanded || isMobile) && (
                        <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#121116] border border-white/10 text-white text-xs font-sans font-medium rounded-lg opacity-0 scale-95 pointer-events-none group-hover/sidebar:opacity-100 group-hover/sidebar:scale-100 transition-none shadow-xl whitespace-nowrap z-50">
                          Cài đặt
                        </div>
                      )}
                      <Settings className="w-4.5 h-4.5 text-white transition-none stroke-[1.8]" />
                      {(sidebarExpanded || isMobile) && (
                        <span className="text-xs font-semibold tracking-wide font-sans pl-3.5 flex-1 text-left">
                          Cài đặt
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </aside>
        </>
      )}

      {/* Hidden file input for importing M3U playlists */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleM3uImport}
        accept=".m3u,.m3u8,.txt"
        className="hidden"
      />

      {/* Outside click backdrop handler for menu dropdowns */}
      {activeMenu !== null && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setActiveMenu(null)}
        />
      )}

      {/* macOS-style Top Menu Bar (HIDDEN: Merged into the main unified header) */}
      <div className="hidden">
        {/* Left Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Waves Community Logo Menu */}
          <div
            className="relative"
            onMouseEnter={() => activeMenu !== null && setActiveMenu("logo")}
          >
            <button
              onClick={() =>
                setActiveMenu(activeMenu === "logo" ? null : "logo")
              }
              className={`flex items-center h-8 px-2 hover:bg-white/10 rounded-lg transition-all ${activeMenu === "logo" ? "bg-white/10" : ""}`}
            >
              <img
                src="https://static.wikia.nocookie.net/ep-deo/images/e/e9/Wave.png/revision/latest/scale-to-width-down/1000?cb=20260825072256"
                alt="Waves Community Brand Logo"
                referrerPolicy="no-referrer"
                className="h-5 w-auto object-contain"
              />
            </button>
            {activeMenu === "logo" && (
              <div className="absolute left-0 top-full mt-1.5 w-56 rounded-2xl bg-[#161421]/80 backdrop-blur-[10px] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] z-50 py-2 text-white/90 overflow-hidden text-left">
                <button
                  onClick={() => {
                    setShowAboutModal(true);
                    setActiveMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-[13px] hover:bg-white/10 font-sans font-normal transition-colors flex items-center gap-2.5 text-white/90"
                >
                  <Info className="w-4 h-4 text-fuchsia-300" />
                  <span>About Waves Community</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("settings");
                    setActiveSettingSection("plugin_store");
                    setActiveMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-[13px] hover:bg-white/10 font-sans font-normal transition-colors flex items-center gap-2.5 text-white/90"
                >
                  <ShoppingBag className="w-4 h-4 text-purple-300" />
                  <span>Cửa hàng tiện ích</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("settings");
                    setActiveSettingSection(null);
                    setActiveMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-[13px] hover:bg-white/10 font-sans font-normal transition-colors flex items-center gap-2.5 text-white/90"
                >
                  <Settings className="w-4 h-4 text-indigo-300" />
                  <span>Cài đặt</span>
                </button>
                <div className="border-t border-white/10 my-1" />
                <button
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="w-full px-4 py-2 text-left text-[13px] hover:bg-white/10 font-sans font-normal transition-colors flex items-center gap-2.5 text-white/90"
                >
                  <RefreshCw className="w-4 h-4 text-rose-300" />
                  <span>Reload App</span>
                </button>
              </div>
            )}
          </div>

          {/* File Menu */}
          <div
            className="relative"
            onMouseEnter={() => activeMenu !== null && setActiveMenu("file")}
          >
            <button
              onClick={() =>
                setActiveMenu(activeMenu === "file" ? null : "file")
              }
              className={`flex items-center h-8 px-2.5 hover:bg-white/10 rounded-lg transition-all font-google font-normal ${activeMenu === "file" ? "bg-white/10" : ""}`}
            >
              File
            </button>
            {activeMenu === "file" && (
              <div className="absolute left-0 top-full mt-1.5 w-64 rounded-[30px] bg-[#161421]/80 backdrop-blur-[1px] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] z-50 py-2 text-white/90 overflow-hidden text-left">
                <button
                  onClick={() => {
                    setShowPlayUrlModal(true);
                    setActiveMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-[13px] hover:bg-white/10 font-sans font-normal transition-colors flex items-center gap-2.5 text-white/90"
                >
                  <Play className="w-4 h-4 text-emerald-300" />
                  <span>Xem luồng kênh qua URL</span>
                </button>
                <button
                  onClick={() => {
                    setShowCustomModal(true);
                    setActiveMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-[13px] hover:bg-white/10 font-sans font-normal transition-colors flex items-center gap-2.5 text-white/90"
                >
                  <Plus className="w-4 h-4 text-sky-300" />
                  <span>Thêm luồng kênh</span>
                </button>
                <div className="border-t border-white/10 my-1" />
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setActiveMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-[13px] hover:bg-white/10 font-sans font-normal transition-colors flex items-center gap-2.5 text-white/90"
                >
                  <Upload className="w-4 h-4 text-amber-300" />
                  <span>Nhập file m3u/m3u8</span>
                </button>
                <button
                  onClick={() => {
                    handleM3uExport();
                    setActiveMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-[13px] hover:bg-white/10 font-sans font-normal transition-colors flex items-center gap-2.5 text-white/90"
                >
                  <Download className="w-4 h-4 text-teal-300" />
                  <span>Xuất file m3u/m3u8</span>
                </button>
              </div>
            )}
          </div>

          {/* Plugins Menu */}
          <div
            className="relative"
            onMouseEnter={() => activeMenu !== null && setActiveMenu("plugins")}
          >
            <button
              onClick={() =>
                setActiveMenu(activeMenu === "plugins" ? null : "plugins")
              }
              className={`flex items-center h-8 px-2.5 hover:bg-white/10 rounded-lg transition-all font-google font-normal ${activeMenu === "plugins" ? "bg-white/10" : ""}`}
            >
              Plugins
            </button>
            {activeMenu === "plugins" && (
              <div className="absolute left-0 top-full mt-1.5 w-60 rounded-[30px] bg-[#161421]/80 backdrop-blur-[1px] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] z-50 py-2 text-white/90 overflow-hidden text-left">
                <button
                  onClick={() => {
                    setActiveTab("settings");
                    setActiveSettingSection("plugin_store");
                    setActiveMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-[13px] hover:bg-white/10 font-sans font-normal transition-colors flex items-center gap-2.5 text-white/90"
                >
                  <ShoppingBag className="w-4 h-4 text-purple-300" />
                  <span>Mở cửa hàng tiện ích</span>
                </button>
                <div className="border-t border-white/10 my-1.5" />
                <div className="px-4 py-1 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                  Tiện ích đã cài đặt
                </div>
                {Object.entries(installedPlugins)
                  .filter(([_, status]) => status === "installed")
                  .map(([id]) => (
                    <div
                      key={id}
                      className="px-4 py-1.5 text-[12.5px] text-white/80 flex items-center justify-between font-sans font-normal hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Puzzle className="w-4 h-4 text-emerald-400" />
                        <span>
                          {id === "export_stream"
                            ? "Xuất luồng"
                            : id === "multiview"
                              ? "Multiview"
                              : id === "open_native"
                                ? "Mở luồng gốc"
                                : id === "quick_switch"
                                  ? "Chuyển nhanh"
                                  : id === "add_custom"
                                    ? "Thêm kênh mới"
                                    : id}
                        </span>
                      </div>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    </div>
                  ))}
                {Object.entries(installedPlugins).filter(
                  ([_, status]) => status === "installed",
                ).length === 0 && (
                  <div className="px-4 py-1.5 text-[12.5px] text-white/40 italic font-sans font-normal pl-11">
                    Chưa cài đặt tiện ích nào
                  </div>
                )}
                <div className="border-t border-white/10 my-1.5" />
                <div className="px-4 py-1 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                  Tiện ích có sẵn
                </div>
                {[
                  "export_stream",
                  "multiview",
                  "open_native",
                  "quick_switch",
                  "add_custom",
                ].map((id) => (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveTab("settings");
                      setActiveSettingSection("plugin_store");
                      setActiveMenu(null);
                    }}
                    className="w-full px-4 py-1.5 text-left text-[12.5px] text-white/70 hover:bg-white/10 font-sans font-normal transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Puzzle className="w-4 h-4 text-white/40" />
                      <span>
                        {id === "export_stream"
                          ? "Xuất luồng"
                          : id === "multiview"
                            ? "Multiview"
                            : id === "open_native"
                              ? "Mở luồng gốc"
                              : id === "quick_switch"
                                ? "Chuyển nhanh"
                                : id === "add_custom"
                                  ? "Thêm kênh mới"
                                  : id}
                      </span>
                    </div>
                    <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-full font-bold">
                      Store
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Shortcuts Menu */}
          <div
            className="relative"
            onMouseEnter={() =>
              activeMenu !== null && setActiveMenu("shortcuts")
            }
          >
            <button
              onClick={() =>
                setActiveMenu(activeMenu === "shortcuts" ? null : "shortcuts")
              }
              className={`flex items-center h-8 px-2.5 hover:bg-white/10 rounded-lg transition-all font-google font-normal ${activeMenu === "shortcuts" ? "bg-white/10 text-white" : ""}`}
            >
              Favorites
            </button>
            {activeMenu === "shortcuts" && (
              <div className="absolute left-0 top-full mt-1.5 w-64 rounded-[30px] bg-[#161421]/80 backdrop-blur-[1px] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] z-50 py-2 text-white/90 overflow-hidden text-left">
                <div className="px-4 py-1.5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                  Kênh yêu thích
                </div>
                {favoriteChannelsList.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto">
                    {favoriteChannelsList.map((ch) => (
                      <button
                        key={ch.id}
                        onClick={() => {
                          handleSelectChannel(ch);
                          setActiveTab("live");
                          setActiveMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-[13px] hover:bg-white/10 font-sans font-normal transition-colors flex items-center justify-between text-white/90"
                      >
                        <span className="truncate">{ch.name}</span>
                        <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-bold shrink-0">
                          Phát
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-2.5 text-[12.5px] text-white/45 italic font-sans font-normal leading-normal">
                    Thêm một vài kênh vào danh sách yêu thích để hiển thị ở đây.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Help Menu */}
          <div
            className="relative"
            onMouseEnter={() => activeMenu !== null && setActiveMenu("help")}
          >
            <button
              onClick={() =>
                setActiveMenu(activeMenu === "help" ? null : "help")
              }
              className={`flex items-center h-8 px-2.5 hover:bg-white/10 rounded-lg transition-all font-google font-normal ${activeMenu === "help" ? "bg-white/10 text-white" : ""}`}
            >
              Help
            </button>
            {activeMenu === "help" && (
              <div className="absolute left-0 top-full mt-1.5 w-56 rounded-[30px] bg-[#161421]/80 backdrop-blur-[1px] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] z-50 py-2 text-white/90 overflow-hidden text-left">
                <button
                  onClick={() => {
                    setShowAboutModal(true);
                    setActiveMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-[13px] hover:bg-white/10 font-sans font-normal transition-colors flex items-center gap-2.5 text-white/90"
                >
                  <Info className="w-4 h-4 text-fuchsia-300" />
                  <span>About Waves Community</span>
                </button>
                <button
                  onClick={() => {
                    setShowFeedbackModal(true);
                    setActiveMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-[13px] hover:bg-white/10 font-sans font-normal transition-colors flex items-center gap-2.5 text-white/90"
                >
                  <MessageSquare className="w-4 h-4 text-sky-300" />
                  <span>Submit Feedback</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("settings");
                    setActiveSettingSection("design_system");
                    setActiveMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-[13px] hover:bg-white/10 font-sans font-normal transition-colors flex items-center gap-2.5 text-white/90"
                >
                  <Layers className="w-4 h-4 text-amber-300" />
                  <span>Design Components</span>
                </button>
                <div className="border-t border-white/10 my-1" />
                <button
                  onClick={() => {
                    setShowTestVplayConfirmModal(true);
                    setActiveMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-[13px] hover:bg-white/10 font-sans font-semibold transition-colors flex items-center gap-2.5 text-purple-300"
                >
                  <Beaker className="w-4 h-4 text-purple-400" />
                  <span>Switch to Test Waves Community</span>
                </button>
                <div className="border-t border-white/10 my-1" />
                <button
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="w-full px-4 py-2 text-left text-[13px] hover:bg-white/10 font-sans font-normal transition-colors flex items-center gap-2.5 text-rose-300"
                >
                  <RefreshCw className="w-4 h-4 text-rose-300" />
                  <span>Reload App</span>
                </button>
              </div>
            )}
          </div>

          {/* Intelligence Menu Tab */}
          {expVIntelligence && (
            <div
              className="relative"
              onMouseEnter={() =>
                activeMenu !== null && setActiveMenu("intelligence")
              }
            >
              <button
                onClick={() =>
                  setActiveMenu(
                    activeMenu === "intelligence" ? null : "intelligence",
                  )
                }
                className={`flex items-center h-8 px-2.5 hover:bg-white/10 rounded-lg transition-all font-google font-normal text-[#d0bcff] ${activeMenu === "intelligence" ? "bg-white/10 text-white" : ""}`}
              >
                <img
                  src="https://static.wikia.nocookie.net/logopedia/images/d/d5/Windows_Copilot_2023.svg/revision/latest/scale-to-width-down/200?cb=20230615034323"
                  alt="V-Intelligence"
                  referrerPolicy="no-referrer"
                  className="w-4 h-4 mr-1.5 object-contain"
                />
                Intelligence
              </button>
              {activeMenu === "intelligence" && (
                <div className="absolute left-0 top-full mt-1.5 w-72 rounded-[30px] bg-[#161421]/80 backdrop-blur-[1px] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] z-50 py-2.5 text-white/90 overflow-hidden text-left">
                  <button
                    onClick={() => {
                      setShowVIntel(true);
                      setVIntelMode("chat");
                      setActiveMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left text-[13px] hover:bg-white/10 font-sans font-normal transition-colors flex items-center gap-2.5 text-white/90"
                  >
                    <MessageSquare className="w-4 h-4 text-purple-300" />
                    <span>Ask V-Intelligence</span>
                  </button>
                  <button
                    onClick={() => {
                      if (isSpotlightAllDisabled) {
                        setShowSpotlightDisabledModal(true);
                        setActiveMenu(null);
                        return;
                      }
                      setActiveTab("search");
                      setActiveMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left text-[13px] hover:bg-white/10 font-sans font-normal transition-colors flex items-center gap-2.5 text-white/90"
                  >
                    <img
                      src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest/scale-to-width-down/1000?cb=20260717131751"
                      className="w-4 h-4 object-contain brightness-0 invert opacity-80"
                      alt="Search"
                      referrerPolicy="no-referrer"
                    />
                    <span>Open search channels</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("settings");
                      setActiveSettingSection("experimental");
                      setActiveMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left text-[13px] hover:bg-white/10 font-sans font-normal transition-colors flex items-center gap-2.5 text-white/90"
                  >
                    <Settings className="w-4 h-4 text-fuchsia-300" />
                    <span>Cài đặt V-Intelligence</span>
                  </button>

                  <div className="border-t border-white/10 my-2" />

                  {/* Quick Chat Section */}
                  <div className="px-4 py-1.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider">
                        Quick chat
                      </span>
                      <button
                        onClick={() => {
                          setVIntelInput(quickChatInput);
                          setShowVIntel(true);
                          setVIntelMode("chat");
                          setActiveMenu(null);
                        }}
                        className="text-white/40 hover:text-white transition-colors p-1 hover:bg-white/5 rounded"
                        title="Phóng to cuộc trò chuyện"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full pl-3.5 pr-1.5 py-1 focus-within:border-[2.5px] focus-within:border-[#38bdf8] focus-within:ring-[3px] focus-within:ring-[#38bdf8]/30 transition-none">
                      <input
                        type="text"
                        placeholder="Hỏi V-Intelligence..."
                        value={quickChatInput}
                        onChange={(e) => setQuickChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleQuickChatSend();
                          }
                        }}
                        className="bg-transparent border-none text-white text-[12px] focus:outline-none w-full placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
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
                              const speechResult =
                                event.results[0][0].transcript;
                              setQuickChatInput((prev) => {
                                const prefix = prev.trim() ? prev + " " : "";
                                return prefix + speechResult;
                              });
                              triggerToast("Đã nhập: " + speechResult);
                            };
                            recognition.onerror = (event: any) => {
                              triggerToast("Lỗi: " + event.error);
                            };
                          } else {
                            triggerToast(
                              "Trình duyệt không hỗ trợ nhận diện giọng nói",
                            );
                          }
                        }}
                        className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-teal-400 hover:text-teal-300 transition-all cursor-pointer shrink-0 bouncy-btn"
                        title="Nhập bằng giọng nói"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleQuickChatSend()}
                        disabled={!quickChatInput.trim()}
                        className="w-7 h-7 rounded-full bg-[#d0bcff] text-[#381e72] flex items-center justify-center hover:bg-[#c2a8f9] disabled:opacity-30 disabled:hover:bg-[#d0bcff] transition-all cursor-pointer shrink-0"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="hidden sm:flex items-center gap-2.5 sm:gap-4">
          {/* Volume Icon Controller */}
          <div
            className="relative flex items-center group/vol"
            onMouseEnter={() => activeMenu !== null && setActiveMenu("volume")}
          >
            <button
              onClick={() =>
                setActiveMenu(activeMenu === "volume" ? null : "volume")
              }
              className={`p-1.5 hover:bg-white/10 rounded-lg transition-all text-white/80 hover:text-white ${activeMenu === "volume" ? "bg-white/10 text-white" : ""}`}
              title="Volume"
            >
              {muted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : volume < 0.3 ? (
                <Volume className="w-4 h-4" />
              ) : volume < 0.7 ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {/* Hover/Press Volume Dropdown Menu */}
            <div
              className={`absolute right-0 top-full mt-1.5 w-60 rounded-[30px] bg-[#161421]/80 backdrop-blur-[1px] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] z-50 p-4 text-white/90 overflow-hidden text-left flex flex-col gap-3 transition-all duration-200 ${
                activeMenu === "volume"
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none group-hover/vol:opacity-100 group-hover/vol:scale-100 group-hover/vol:pointer-events-auto"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-white/40 uppercase tracking-wider select-none">
                <span>Âm lượng</span>
                <span className="font-mono text-[10px] text-white/60">
                  {muted ? "Tắt tiếng" : `${Math.round(volume * 100)}%`}
                </span>
              </div>

              <div className="flex items-center justify-center py-1.5">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setVolume(v);
                    if (v > 0) setMuted(false);
                  }}
                  className="w-full h-1 rounded-lg appearance-none cursor-default transition-all range-slider-pill outline-none"
                  style={{
                    background: `linear-gradient(to right, #0084ff ${(muted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.2) ${(muted ? 0 : volume) * 100}%)`,
                  }}
                />
              </div>

              <div className="border-t border-white/10 my-0.5" />

              <button
                onClick={() => setMuted(!muted)}
                className="w-full py-2 px-3 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2.5 text-[13px] text-white/90 font-medium"
              >
                {muted ? (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>Bật âm thanh</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-rose-400" />
                    <span>Tắt âm thanh</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Date Time */}
          <DigitalClock
            variant="compact"
            className="bg-white/5 px-2 py-0.5 rounded-md"
          />
        </div>
      </div>

      {/* Decorative ambient glowing circles */}
      {!amoledDark && (
        <>
          <motion.div
            animate={{ scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-24 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1.2, 0.8, 1.2] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 right-10 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[130px] pointer-events-none"
          />
          <motion.div
            animate={{ scale: [0.85, 1.15, 0.85] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none"
          />
        </>
      )}

      {/* TV360 STYLE CINEMATIC HEADER (Floating on Top - Displays on ALL tabs) */}
      {true && (
        <header className="fixed top-0 inset-x-0 h-14 z-50 px-4 sm:px-6 md:px-8 flex items-center justify-between pointer-events-auto select-none transition-all duration-150">
          {/* Progressive background blurs backplate - Only visible when scrolled down or when not on home tab */}
          {activeTab === "live" || activeTab === "search" ? (
            <div
              className={`absolute inset-0 ${amoledDark ? "bg-[#211f26]" : "bg-[#211f26]"} z-0 pointer-events-none border-b border-white/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.3)] opacity-100 visible`}
            />
          ) : (
            <div
              className={`progressive-blur-header z-0 pointer-events-none border-b border-white/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.3)] ${
                isScrolled || activeTab !== "home"
                  ? "opacity-100 visible"
                  : "opacity-0 invisible pointer-events-none"
              }`}
            />
          )}

          <div className="relative z-10 flex items-center gap-3 sm:gap-4 md:gap-6">
            {activeTab === "settings" && activeSettingSection !== null ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveSettingSection(null)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/95 hover:text-white border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] cursor-pointer bouncy-btn transition-colors"
                  title="Quay lại"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                </button>
                <span className="text-white font-semibold text-xs sm:text-sm tracking-tight">
                  {activeSettingSection === "appearance" && "Giao diện"}
                  {activeSettingSection === "search" && "Tìm kiếm"}
                  {activeSettingSection === "profile" && "Tài khoản & Dữ liệu"}
                  {activeSettingSection === "accessibility" && "Trợ năng"}
                  {activeSettingSection === "broadcast" && "Phát sóng"}
                  {activeSettingSection === "experimental" &&
                    "Thử nghiệm & Tính năng mới"}
                  {activeSettingSection === "design_system" &&
                    "Design components"}
                  {activeSettingSection === "plugin_store" &&
                    "Cửa hàng tiện ích"}
                </span>
              </div>
            ) : (
              <>
                {isMobile && dockToSidebar && (
                  <button
                    onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer shrink-0 mr-1.5"
                    title="Menu"
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                )}
                {/* Brand Logo on the Left */}
                <div
                  onClick={() => {
                    setActiveTab("home");
                    setShowMobileSidebar(false);
                  }}
                  className="flex items-center gap-1.5 cursor-pointer group shrink-0"
                >
                  <img
                    src="https://static.wikia.nocookie.net/ep-deo/images/e/e9/Wave.png/revision/latest/scale-to-width-down/1000?cb=20260825072256"
                    alt="Waves Community Brand Logo"
                    referrerPolicy="no-referrer"
                    className="h-5.5 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="hidden xs:inline-block font-sans font-black text-xs bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent uppercase tracking-wider select-none">
                    360
                  </span>
                </div>

                {/* Merged Navigation/Menus from macOS-style bar */}
                {!dockToSidebar && (
                  <div className="flex items-center gap-1">
                    {/* File Menu */}
                    <div
                      className="relative group"
                      onMouseEnter={() =>
                        activeMenu !== null && setActiveMenu("file")
                      }
                    >
                      <button
                        onClick={() =>
                          setActiveMenu(activeMenu === "file" ? null : "file")
                        }
                        className={`relative flex items-center h-7 px-2 hover:text-[#38bdf8] rounded-lg text-[11px] font-google text-white/90 font-normal transition-all ${activeMenu === "file" ? "text-[#38bdf8]" : ""}`}
                      >
                        <FolderOpen className="w-3.5 h-3.5 sm:mr-1 transition-colors group-hover:text-[#38bdf8]" />
                        <span className="hidden sm:inline transition-colors group-hover:text-[#38bdf8]">
                          File
                        </span>
                        <span
                          className={`absolute bottom-0 inset-x-2 h-0.5 bg-[#38bdf8] rounded-full transition-transform duration-200 origin-center ${activeMenu === "file" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                        />
                      </button>
                      <AnimatePresence>
                        {activeMenu === "file" && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setActiveMenu(null)}
                            />
                            <motion.div
                              initial={{ opacity: 0, y: -16, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -16, scale: 0.95 }}
                              transition={{
                                duration: 0.25,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="absolute left-0 top-full mt-2 w-64 rounded-[28px] bg-[#211f26] border border-white/10 shadow-[0_16px_36px_rgba(0,0,0,0.5)] z-50 py-2.5 text-white flex flex-col gap-1 font-google"
                            >
                              <button
                                onClick={() => {
                                  setShowPlayUrlModal(true);
                                  setActiveMenu(null);
                                }}
                                className="relative mx-1.5 pl-7 pr-4 py-2.5 rounded-2xl text-left text-[13px] hover:bg-white/[0.08] active:bg-white/[0.12] text-white/90 hover:text-white font-google font-medium flex items-center gap-2.5 group transition-all duration-150"
                              >
                                <div className="menu-vertical-pill" />
                                <Play className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                                <span>Xem luồng kênh qua URL</span>
                              </button>
                              <button
                                onClick={() => {
                                  setShowCustomModal(true);
                                  setActiveMenu(null);
                                }}
                                className="relative mx-1.5 pl-7 pr-4 py-2.5 rounded-2xl text-left text-[13px] hover:bg-white/[0.08] active:bg-white/[0.12] text-white/90 hover:text-white font-google font-medium flex items-center gap-2.5 group transition-all duration-150"
                              >
                                <div className="menu-vertical-pill" />
                                <Plus className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                                <span>Thêm luồng kênh</span>
                              </button>
                              <div className="border-t border-white/10 mx-1.5 my-1.5" />
                              <button
                                onClick={() => {
                                  fileInputRef.current?.click();
                                  setActiveMenu(null);
                                }}
                                className="relative mx-1.5 pl-7 pr-4 py-2.5 rounded-2xl text-left text-[13px] hover:bg-white/[0.08] active:bg-white/[0.12] text-white/90 hover:text-white font-google font-medium flex items-center gap-2.5 group transition-all duration-150"
                              >
                                <div className="menu-vertical-pill" />
                                <Upload className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                                <span>Nhập file m3u/m3u8</span>
                              </button>
                              <button
                                onClick={() => {
                                  handleM3uExport();
                                  setActiveMenu(null);
                                }}
                                className="relative mx-1.5 pl-7 pr-4 py-2.5 rounded-2xl text-left text-[13px] hover:bg-white/[0.08] active:bg-white/[0.12] text-white/90 hover:text-white font-google font-medium flex items-center gap-2.5 group transition-all duration-150"
                              >
                                <div className="menu-vertical-pill" />
                                <Download className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                                <span>Xuất file m3u/m3u8</span>
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Plugins Menu */}
                    <div
                      className="relative group"
                      onMouseEnter={() =>
                        activeMenu !== null && setActiveMenu("plugins")
                      }
                    >
                      <button
                        onClick={() =>
                          setActiveMenu(
                            activeMenu === "plugins" ? null : "plugins",
                          )
                        }
                        className={`relative flex items-center h-7 px-2 hover:text-[#38bdf8] rounded-lg text-[11px] font-google text-white/90 font-normal transition-all ${activeMenu === "plugins" ? "text-[#38bdf8]" : ""}`}
                      >
                        <Puzzle className="w-3.5 h-3.5 sm:mr-1 transition-colors group-hover:text-[#38bdf8]" />
                        <span className="hidden sm:inline transition-colors group-hover:text-[#38bdf8]">
                          Plugins
                        </span>
                        <span
                          className={`absolute bottom-0 inset-x-2 h-0.5 bg-[#38bdf8] rounded-full transition-transform duration-200 origin-center ${activeMenu === "plugins" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                        />
                      </button>
                      <AnimatePresence>
                        {activeMenu === "plugins" && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setActiveMenu(null)}
                            />
                            <motion.div
                              initial={{ opacity: 0, y: -16, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -16, scale: 0.95 }}
                              transition={{
                                duration: 0.25,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="absolute left-0 top-full mt-2 w-64 rounded-[28px] bg-[#211f26] border border-white/10 shadow-[0_16px_36px_rgba(0,0,0,0.5)] z-50 py-2.5 text-white flex flex-col gap-1 font-google"
                            >
                              <button
                                onClick={() => {
                                  setActiveTab("settings");
                                  setActiveSettingSection("plugin_store");
                                  setActiveMenu(null);
                                }}
                                className="relative mx-1.5 pl-7 pr-4 py-2.5 rounded-2xl text-left text-[13px] hover:bg-white/[0.08] active:bg-white/[0.12] text-white/90 hover:text-white font-google font-medium flex items-center gap-2.5 group transition-all duration-150"
                              >
                                <div className="menu-vertical-pill" />
                                <ShoppingBag className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                                <span>Mở cửa hàng tiện ích</span>
                              </button>
                              <div className="border-t border-white/10 mx-1.5 my-1.5" />
                              <div className="px-7 py-1 text-[10px] font-bold text-white/40 uppercase tracking-wider select-none">
                                Tiện ích đã cài đặt
                              </div>
                              {Object.entries(installedPlugins)
                                .filter(([_, status]) => status === "installed")
                                .map(([id]) => (
                                  <div
                                    key={id}
                                    className="relative mx-1.5 pl-7 pr-4 py-2 rounded-2xl text-[13px] text-white/90 flex items-center justify-between font-google font-medium hover:bg-white/[0.08] group transition-all duration-150"
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <Puzzle className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                                      <span>
                                        {id === "export_stream"
                                          ? "Xuất luồng"
                                          : id === "multiview"
                                            ? "Multiview"
                                            : id === "open_native"
                                              ? "Mở luồng gốc"
                                              : id === "quick_switch"
                                                ? "Chuyển nhanh"
                                                : id === "add_custom"
                                                  ? "Thêm kênh mới"
                                                  : id}
                                      </span>
                                    </div>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                  </div>
                                ))}
                              {Object.entries(installedPlugins).filter(
                                ([_, status]) => status === "installed",
                              ).length === 0 && (
                                <div className="px-7 py-2 text-[13px] text-white/40 italic font-google font-normal select-none">
                                  Chưa cài đặt tiện ích nào
                                </div>
                              )}
                              <div className="border-t border-white/10 mx-1.5 my-1.5" />
                              <div className="px-7 py-1 text-[10px] font-bold text-white/40 uppercase tracking-wider select-none">
                                Tiện ích có sẵn
                              </div>
                              {[
                                "export_stream",
                                "multiview",
                                "open_native",
                                "quick_switch",
                                "add_custom",
                              ]
                                .filter(
                                  (id) => installedPlugins[id] !== "installed",
                                )
                                .map((id) => (
                                  <button
                                    key={id}
                                    onClick={() => {
                                      setActiveTab("settings");
                                      setActiveSettingSection("plugin_store");
                                      setActiveMenu(null);
                                    }}
                                    className="relative mx-1.5 pl-7 pr-4 py-2 rounded-2xl text-left text-[13px] text-white/90 hover:bg-white/[0.08] hover:text-white font-google font-medium flex items-center justify-between group transition-all duration-150"
                                  >
                                    <div className="menu-vertical-pill" />
                                    <div className="flex items-center gap-2.5">
                                      <Puzzle className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                                      <span>
                                        {id === "export_stream"
                                          ? "Xuất luồng"
                                          : id === "multiview"
                                            ? "Multiview"
                                            : id === "open_native"
                                              ? "Mở luồng gốc"
                                              : id === "quick_switch"
                                                ? "Chuyển nhanh"
                                                : id === "add_custom"
                                                  ? "Thêm kênh mới"
                                                  : id}
                                      </span>
                                    </div>
                                    <span className="text-[9px] bg-indigo-500/10 text-indigo-400 group-hover:bg-white/20 group-hover:text-white px-1.5 py-0.5 rounded-full font-bold">
                                      Store
                                    </span>
                                  </button>
                                ))}
                              {[
                                "export_stream",
                                "multiview",
                                "open_native",
                                "quick_switch",
                                "add_custom",
                              ].filter(
                                (id) => installedPlugins[id] !== "installed",
                              ).length === 0 && (
                                <div className="px-7 py-2 text-[13px] text-white/40 italic font-google font-normal select-none">
                                  Không còn tiện ích nào có sẵn
                                </div>
                              )}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Shortcuts Menu */}
                    <div
                      className="relative group"
                      onMouseEnter={() =>
                        activeMenu !== null && setActiveMenu("shortcuts")
                      }
                    >
                      <button
                        onClick={() =>
                          setActiveMenu(
                            activeMenu === "shortcuts" ? null : "shortcuts",
                          )
                        }
                        className={`relative flex items-center h-7 px-2 hover:text-[#38bdf8] rounded-lg text-[11px] font-google text-white/90 font-normal transition-all ${activeMenu === "shortcuts" ? "text-[#38bdf8]" : ""}`}
                      >
                        <Heart className="w-3.5 h-3.5 sm:mr-1 transition-colors group-hover:text-[#38bdf8]" />
                        <span className="hidden sm:inline transition-colors group-hover:text-[#38bdf8]">
                          Favorites
                        </span>
                        <span
                          className={`absolute bottom-0 inset-x-2 h-0.5 bg-[#38bdf8] rounded-full transition-transform duration-200 origin-center ${activeMenu === "shortcuts" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                        />
                      </button>
                      <AnimatePresence>
                        {activeMenu === "shortcuts" && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setActiveMenu(null)}
                            />
                            <motion.div
                              initial={{ opacity: 0, y: -16, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -16, scale: 0.95 }}
                              transition={{
                                duration: 0.25,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="absolute left-0 top-full mt-2 w-64 rounded-[28px] bg-[#211f26] border border-white/10 shadow-[0_16px_36px_rgba(0,0,0,0.5)] z-50 py-2.5 text-white flex flex-col gap-1 font-google"
                            >
                              <div className="px-7 py-1.5 text-[10px] font-bold text-white/40 uppercase tracking-wider select-none">
                                Kênh yêu thích
                              </div>
                              {favoriteChannelsList.length > 0 ? (
                                <div className="max-h-60 overflow-y-auto flex flex-col gap-1 custom-scrollbar">
                                  {favoriteChannelsList.map((ch) => (
                                    <button
                                      key={ch.id}
                                      onClick={() => {
                                        handleSelectChannel(ch);
                                        setActiveTab("live");
                                        setActiveMenu(null);
                                      }}
                                      className="relative mx-1.5 pl-7 pr-4 py-2.5 rounded-2xl text-left text-[13px] hover:bg-white/[0.08] active:bg-white/[0.12] text-white/90 hover:text-white font-google font-medium flex items-center justify-between group transition-all duration-150"
                                    >
                                      <div className="menu-vertical-pill" />
                                      <span className="truncate">
                                        {ch.name}
                                      </span>
                                      <span className="text-[9px] bg-indigo-500/20 text-indigo-300 group-hover:bg-white/20 group-hover:text-white px-1.5 py-0.5 rounded font-bold shrink-0">
                                        Phát
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div className="px-7 py-3 text-[13px] text-white/40 font-google font-normal leading-normal select-none">
                                  Thêm một vài kênh vào danh sách yêu thích để
                                  hiển thị ở đây.
                                </div>
                              )}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Help Menu */}
                    <div
                      className="relative group"
                      onMouseEnter={() =>
                        activeMenu !== null && setActiveMenu("help")
                      }
                    >
                      <button
                        onClick={() =>
                          setActiveMenu(activeMenu === "help" ? null : "help")
                        }
                        className={`relative flex items-center h-7 px-2 hover:text-[#38bdf8] rounded-lg text-[11px] font-google text-white/90 font-normal transition-all ${activeMenu === "help" ? "text-[#38bdf8]" : ""}`}
                      >
                        <BookOpen className="w-3.5 h-3.5 sm:mr-1 transition-colors group-hover:text-[#38bdf8]" />
                        <span className="hidden sm:inline transition-colors group-hover:text-[#38bdf8]">
                          Help
                        </span>
                        <span
                          className={`absolute bottom-0 inset-x-2 h-0.5 bg-[#38bdf8] rounded-full transition-transform duration-200 origin-center ${activeMenu === "help" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                        />
                      </button>
                      <AnimatePresence>
                        {activeMenu === "help" && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setActiveMenu(null)}
                            />
                            <motion.div
                              initial={{ opacity: 0, y: -16, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -16, scale: 0.95 }}
                              transition={{
                                duration: 0.25,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="absolute left-0 top-full mt-2 w-60 rounded-[28px] bg-[#211f26] border border-white/10 shadow-[0_16px_36px_rgba(0,0,0,0.5)] z-50 py-2.5 text-white flex flex-col gap-1 font-google"
                            >
                              <button
                                onClick={() => {
                                  setShowAboutModal(true);
                                  setActiveMenu(null);
                                }}
                                className="relative mx-1.5 pl-7 pr-4 py-2.5 rounded-2xl text-left text-[13px] hover:bg-white/[0.08] active:bg-white/[0.12] text-white/90 hover:text-white font-google font-medium flex items-center gap-2.5 group transition-all duration-150"
                              >
                                <div className="menu-vertical-pill" />
                                <Info className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                                <span>About Waves Community</span>
                              </button>
                              <button
                                onClick={() => {
                                  setShowFeedbackModal(true);
                                  setActiveMenu(null);
                                }}
                                className="relative mx-1.5 pl-7 pr-4 py-2.5 rounded-2xl text-left text-[13px] hover:bg-white/[0.08] active:bg-white/[0.12] text-white/90 hover:text-white font-google font-medium flex items-center gap-2.5 group transition-all duration-150"
                              >
                                <div className="menu-vertical-pill" />
                                <MessageSquare className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                                <span>Submit Feedback</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveTab("settings");
                                  setActiveSettingSection("design_system");
                                  setActiveMenu(null);
                                }}
                                className="relative mx-1.5 pl-7 pr-4 py-2.5 rounded-2xl text-left text-[13px] hover:bg-white/[0.08] active:bg-white/[0.12] text-white/90 hover:text-white font-google font-medium flex items-center gap-2.5 group transition-all duration-150"
                              >
                                <div className="menu-vertical-pill" />
                                <Layers className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                                <span>Design Components</span>
                              </button>
                              <div className="border-t border-white/10 mx-1.5 my-1.5" />
                              <button
                                onClick={() => {
                                  setShowTestVplayConfirmModal(true);
                                  setActiveMenu(null);
                                }}
                                className="relative mx-1.5 pl-7 pr-4 py-2.5 rounded-2xl text-left text-[13px] hover:bg-white/[0.08] active:bg-white/[0.12] text-white/90 hover:text-white font-google font-semibold flex items-center gap-2.5 group transition-all duration-150"
                              >
                                <div className="menu-vertical-pill" />
                                <Beaker className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                                <span>Switch to Test Waves Community</span>
                              </button>
                              <div className="border-t border-white/10 mx-1.5 my-1.5" />
                              <button
                                onClick={() => {
                                  window.location.reload();
                                }}
                                className="relative mx-1.5 pl-7 pr-4 py-2.5 rounded-2xl text-left text-[13px] hover:bg-white/[0.08] active:bg-white/[0.12] text-white/90 hover:text-white font-google font-medium flex items-center gap-2.5 group transition-all duration-150"
                              >
                                <div className="menu-vertical-pill" />
                                <RefreshCw className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                                <span>Reload App</span>
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Real-time Ticking Digital Clock shrunk and moved to the right side container */}

          {/* Right Side: compact clock and profile card */}
          <div className="relative z-10 flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Firesteel AI Button in Menubar */}
            {expVIntelligence && (
              <div className="relative group">
                <button
                  onClick={() => {
                    setShowVIntel(!showVIntel);
                    setShowSearchDropdown(false);
                    setShowPowerDropdown(false);
                  }}
                  className={`relative flex items-center h-7 px-2.5 hover:text-[#ff5e00] rounded-lg text-[11px] font-google text-white/90 font-normal transition-all active:scale-95 cursor-pointer ${showVIntel ? "text-[#ff5e00]" : ""}`}
                >
                  <Flame
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff5e00] drop-shadow-[0_0_8px_rgba(255,94,0,0.5)] ${showVIntel ? "animate-pulse" : ""}`}
                  />
                  <span
                    className={`absolute bottom-0 inset-x-2.5 h-0.5 bg-[#ff5e00] rounded-full transition-transform duration-200 origin-center ${showVIntel ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                  />
                </button>
                {/* Custom tooltip */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 bg-[#161421]/95 backdrop-blur-md border border-white/10 rounded-xl px-2.5 py-1 shadow-2xl text-[10px] text-white/95 whitespace-nowrap z-[100] font-google font-medium">
                  Firesteel
                </div>
              </div>
            )}

            {/* Power Button in Menubar */}
            <div className="relative group">
              <button
                onClick={() => {
                  setShowPowerDropdown(!showPowerDropdown);
                  setShowSearchDropdown(false);
                  setShowVIntel(false);
                }}
                className={`relative flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition-all active:scale-95 cursor-pointer ${showPowerDropdown ? "bg-white/10 text-white" : ""}`}
                title="Hệ thống"
              >
                <Power className="w-4 h-4" />
                <span
                  className={`absolute bottom-0 inset-x-1.5 h-0.5 bg-white rounded-full transition-transform duration-200 origin-center ${showPowerDropdown ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                />
              </button>

              <AnimatePresence>
                {showPowerDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowPowerDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -16, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -16, scale: 0.95 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-[28px] bg-[#1d1b24]/95 backdrop-blur-md border border-white/10 shadow-[0_16px_36px_rgba(0,0,0,0.5)] z-50 py-2 text-white flex flex-col gap-1 font-sans text-left"
                    >
                      <button
                        onClick={() => {
                          setIsSleepMode(true);
                          setShowPowerDropdown(false);
                        }}
                        className="mx-1.5 px-4 py-2.5 rounded-2xl text-xs hover:bg-white/10 active:bg-white/15 text-white/90 hover:text-white font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Power className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>Chế độ ngủ (Sleep)</span>
                      </button>

                      <button
                        onClick={() => {
                          window.location.reload();
                        }}
                        className="mx-1.5 px-4 py-2.5 rounded-2xl text-xs hover:bg-white/10 active:bg-white/15 text-white/90 hover:text-white font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>Khởi động lại (Reload)</span>
                      </button>

                      <div className="border-t border-white/10 mx-1.5 my-1" />

                      <button
                        onClick={() => {
                          setShowPowerDropdown(false);
                          setShowFactoryResetConfirmModal(true);
                        }}
                        className="mx-1.5 px-4 py-2.5 rounded-2xl text-xs hover:bg-red-500/10 active:bg-red-500/20 text-red-400 hover:text-red-300 font-bold flex items-center gap-2.5 transition-colors cursor-pointer animate-pulse"
                      >
                        <Beaker className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Khôi phục cài đặt gốc</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Spotlight Search Button in Menubar */}
            <div className="relative group/menubartooltip">
              <button
                onClick={() => {
                  playPopSound();
                  if (isSpotlightAllDisabled) {
                    setShowSpotlightDisabledModal(true);
                    return;
                  }
                  setIsSpotlightOpen(true);
                  setShowPowerDropdown(false);
                  setShowVIntel(false);
                }}
                className="relative flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition-all active:scale-95 cursor-pointer"
                aria-label="Spotlight Search"
              >
                <img
                  src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest/scale-to-width-down/1000?cb=20260717131751"
                  className="w-4.5 h-4.5 object-contain transition-transform duration-200"
                  style={{ filter: "brightness(0) invert(1)" }}
                  alt="Spotlight Search"
                  referrerPolicy="no-referrer"
                />
                <span
                  className="absolute bottom-0 inset-x-1.5 h-0.5 bg-white rounded-full transition-transform duration-200 origin-center scale-x-0 group-hover/menubartooltip:scale-x-100"
                />
              </button>

              {/* Glassmorphism Tooltip */}
              <div className="absolute top-full right-0 mt-2.5 px-3.5 py-1.5 rounded-full bg-[#18161e]/90 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] text-xs font-semibold text-white whitespace-nowrap hidden group-hover/menubartooltip:block pointer-events-none z-50">
                Spotlight Search (⌘K)
              </div>
            </div>

            {/* Real-time Ticking Digital Clock on the far right (replacing User Profile) */}
            {showClock && !(sidebarExpanded || isMobile) && (
              <DigitalClock variant="compact" className="ml-2" />
            )}
          </div>
        </header>
      )}

      {/* SETTINGS DETAILS HEADER (Floating on Top - Exclusively inside settings sub-sections) */}
      {activeTab === "settings" && activeSettingSection !== null && (
        <header className="fixed top-8 inset-x-0 h-24 z-50 px-4 sm:px-8 md:px-12 flex items-center justify-between pointer-events-auto select-none">
          {/* Progressive background blurs backplate */}
          <div className="progressive-blur-header z-0 pointer-events-none border-b border-white/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.3)] opacity-100 visible" />

          <div className="relative z-10 flex items-center gap-4">
            <button
              onClick={() => setActiveSettingSection(null)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/95 hover:text-white border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] cursor-pointer bouncy-btn"
              title="Quay lại"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <span className="text-white font-semibold text-base sm:text-lg tracking-tight">
              {activeSettingSection === "appearance" && "Giao diện"}
              {activeSettingSection === "search" && "Tìm kiếm"}
              {activeSettingSection === "profile" && "Tài khoản & Dữ liệu"}
              {activeSettingSection === "accessibility" && "Trợ năng"}
              {activeSettingSection === "news" && "Tin tức (News)"}
              {activeSettingSection === "broadcast" && "Phát sóng"}
              {activeSettingSection === "experimental" &&
                "Thử nghiệm & Tính năng mới"}
              {activeSettingSection === "design_system" && "Design components"}
              {activeSettingSection === "plugin_store" && "Cửa hàng tiện ích"}
            </span>
          </div>
        </header>
      )}

      {/* Main Container */}
      <main
        id="player-anchor"
        className="w-full z-10 relative overflow-x-hidden min-h-screen"
      >
        {isTabLoading ? (
          <div className="w-full min-h-[65vh] flex flex-col items-center justify-center py-24 px-4 select-none">
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-4 bg-white/10 rounded-full blur-xl animate-pulse" />
              <img
                src="https://static.wikia.nocookie.net/ep-deo/images/7/72/Monochrom.png/revision/latest/scale-to-width-down/1000?cb=20260825072411"
                alt="Loading..."
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain animate-spin drop-shadow-[0_0_16px_rgba(255,255,255,0.35)]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        ) : (
          <motion.div
            key={`tab-content-${activeTab}-${activeSettingSection || "main"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
          >
            <AnimatePresence mode="wait">
              {activeTab === "live" || activeTab === "search" ? (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full max-w-7xl mx-auto px-4 pt-12 sm:pt-14 lg:pt-16 pb-8"
                >
                  {/* Sticky Player, Action Buttons & Category Filters on Mobile */}
                  <div
                    className={`sticky ${activeTab === "live" ? "top-8" : "top-32"} lg:relative lg:top-auto z-40 ${
                      amoledDark ? "bg-[#211f26]" : "bg-[#211f26]"
                    } lg:bg-transparent lg:backdrop-blur-none -mx-4 px-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 border-b lg:border-none border-white/5 shadow-[0_15px_30px_rgba(0,0,0,0.4)] lg:shadow-none pt-2 pb-2 lg:pb-0 animate-duration-300`}
                  >
                    {/* Solid background on mobile, no progressive-blur-header to ensure content does not peak through */}

                    <div className="relative z-10">
                      {/* Integrated Main Channel Video Player */}
                      {isPiPActive ? (
                        <div className="w-full max-w-5xl mx-auto aspect-video rounded-3xl bg-[#120e24]/40 border border-white/10 flex flex-col items-center justify-center text-white/60 p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
                          <div
                            className="absolute inset-0 bg-cover bg-center opacity-10 filter blur-xl"
                            style={{
                              backgroundImage: `url(${selectedChannel.logoImg || ""})`,
                            }}
                          />
                          <Tv className="w-12 h-12 mb-4 text-indigo-400 animate-pulse" />
                          <p className="text-sm font-semibold text-white/90 mb-1">
                            Đang phát ở chế độ Picture in Picture
                          </p>
                          <p className="text-xs text-white/50 mb-4 font-mono">
                            {selectedChannel.name}
                          </p>
                          <button
                            onClick={() => setIsPiPActive(false)}
                            className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all bouncy-btn shadow-lg cursor-pointer"
                          >
                            Quay lại trình phát chính
                          </button>
                        </div>
                      ) : isMultiviewMode ? (
                        <div className="w-full max-w-5xl mx-auto aspect-video rounded-3xl bg-[#211f26]/40 border border-white/10 p-2 sm:p-4 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                          {/* Multiview top info and action bar */}
                          <div className="flex items-center justify-between mb-3 text-white">
                            <div className="flex items-center gap-2">
                              <Grid className="w-4 h-4 text-indigo-400" />
                              <span className="text-xs sm:text-sm font-medium">
                                Chế độ xem Multiview ({multiviewCount} khung)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  setShowMultiviewSelectorPopup(true)
                                }
                                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-[11px] font-normal transition-colors cursor-pointer"
                              >
                                Đổi số khung
                              </button>
                              <button
                                onClick={() => {
                                  setIsMultiviewMode(false);
                                  setMultiviewChannels([]);
                                }}
                                className="px-3 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[11px] font-normal border border-red-500/30 transition-colors cursor-pointer"
                              >
                                Thoát Multiview
                              </button>
                            </div>
                          </div>

                          {/* Multiview Grid */}
                          <div
                            className={`grid ${getGridColsClass(multiviewCount)} gap-2 flex-1 h-full min-h-0`}
                          >
                            {Array.from({ length: multiviewCount }).map(
                              (_, idx) => {
                                const ch = multiviewChannels[idx];
                                return (
                                  <div
                                    key={idx}
                                    className="relative aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/5 flex flex-col items-center justify-center group"
                                  >
                                    {ch ? (
                                      <div className="w-full h-full relative">
                                        <div className="absolute top-2 left-2 z-30 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white/90 truncate max-w-[60%] font-mono">
                                          Khung {idx + 1}: {ch.name}
                                        </div>
                                        <div className="absolute top-2 right-2 z-30 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleOpenChannelPickerForSlot(
                                                idx,
                                              );
                                            }}
                                            className="p-1 bg-black/70 hover:bg-black/95 text-white rounded text-[10px]"
                                            title="Đổi kênh"
                                          >
                                            <RefreshCw className="w-3 h-3" />
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleRemoveChannelFromSlot(idx);
                                            }}
                                            className="p-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px]"
                                            title="Xóa kênh"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </div>
                                        <ChannelPlayer
                                          channel={ch}
                                          volume={volume}
                                          onVolumeChange={setVolume}
                                          muted={idx === 0 ? muted : true}
                                          onMutedChange={setMuted}
                                        />
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          handleOpenChannelPickerForSlot(idx)
                                        }
                                        className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/50 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] transition-all duration-200 cursor-pointer p-4 select-none"
                                      >
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                          <Plus className="w-5 h-5 text-white/60 group-hover:text-white" />
                                        </div>
                                        <span className="text-xs font-normal">
                                          Khung {idx + 1} trống
                                        </span>
                                        <span className="text-[10px] text-white/40">
                                          Bấm để chọn kênh
                                        </span>
                                      </button>
                                    )}
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>
                      ) : (
                        <ChannelPlayer
                          channel={selectedChannel}
                          volume={volume}
                          onVolumeChange={setVolume}
                          muted={muted}
                          onMutedChange={setMuted}
                          onNextChannel={handleNextChannel}
                          onPrevChannel={handlePrevChannel}
                          isFavorite={favorites.includes(selectedChannel.id)}
                          onToggleFavorite={() =>
                            toggleFavorite(selectedChannel.id)
                          }
                          onPlaybackError={(err, isTimeout) => {
                            setPlaybackError(err);
                            if (err) {
                              setPlaybackErrorType(
                                isTimeout ? "timeout" : "standard",
                              );
                            } else {
                              setPlaybackErrorType(null);
                            }
                          }}
                          onOpenNativeStream={() => {
                            if (installedPlugins.open_native !== "installed") {
                              setRequiredPluginFeatureName("Mở luồng gốc");
                              setShowPluginRequiredModal(true);
                            } else {
                              window.open(selectedChannel.url, "_blank");
                            }
                          }}
                        />
                      )}

                      {/* Integrated Control Row next to Categories - Scrollable together and pushed up as requested */}
                      <div className="w-full max-w-5xl mx-auto px-2 relative mt-1.5 sm:mt-2 lg:mt-2.5">
                        <div className="flex items-center w-full border-b lg:border-none border-white/5 pb-1 lg:pb-2">
                          {/* Entire row is scrollable horizontal container so Menu, Add Channel and Categories scroll together */}
                          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-1 min-w-0 pb-1">
                            {/* Hamburger menu button (3 gạch ngang) with dropdown opening BELOW */}
                            <div className="relative shrink-0">
                              <button
                                ref={menuButtonRef}
                                onClick={() => {
                                  updateMenuCoords();
                                  setShowDropdownMenu((prev) => !prev);
                                }}
                                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#d0bcff] hover:bg-[#bba3f0] active:bg-[#a88ee6] text-[#381e72] border-none flex items-center gap-1 sm:gap-1.5 shrink-0 shadow-lg cursor-default bouncy-btn text-[11px] sm:text-xs font-semibold h-8 sm:h-9"
                              >
                                <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#381e72]" />
                                <span>Menu</span>
                              </button>
                            </div>

                            {/* Back to Home button (Only visible on mobile when bottom dock is hidden) */}
                            <button
                              onClick={() => setActiveTab("home")}
                              className="sm:hidden w-8 h-8 rounded-full bg-[#d0bcff] hover:bg-[#bba3f0] active:bg-[#a88ee6] text-[#381e72] border-none flex items-center justify-center shrink-0 shadow-lg cursor-default bouncy-btn"
                              title="Về Home"
                            >
                              <Home className="w-4 h-4 text-[#381e72]" />
                            </button>

                            {/* Add custom channel button */}
                            <button
                              onClick={() => {
                                if (
                                  installedPlugins.add_custom !== "installed"
                                ) {
                                  setRequiredPluginFeatureName("Thêm kênh mới");
                                  setShowPluginRequiredModal(true);
                                } else {
                                  setShowCustomModal(true);
                                }
                              }}
                              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#ff9502] hover:bg-[#ffa31a] active:bg-[#e08300] text-white border-none flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/15 cursor-default bouncy-btn"
                            >
                              <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300 hover:rotate-90" />
                            </button>

                            {/* Subtle Vertical Divider inside the scrollable view */}
                            <div className="h-6 w-px bg-white/10 shrink-0 self-center mx-1" />

                            {/* Tất cả filter button */}
                            <button
                              onClick={() => setSelectedCategory("all")}
                              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-normal whitespace-nowrap cursor-default bouncy-btn h-8 sm:h-9 flex items-center justify-center ${
                                selectedCategory === "all"
                                  ? "glass-pill-active"
                                  : "glass-pill text-white/60 hover:text-white"
                              }`}
                            >
                              Tất cả ({flattenedChannels.length})
                            </button>

                            {allAvailableCategoryList.map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-normal whitespace-nowrap cursor-default bouncy-btn flex items-center justify-center gap-2 h-8 sm:h-9 ${
                                  selectedCategory === cat.id
                                    ? "glass-pill-active"
                                    : "glass-pill text-white/60 hover:text-white"
                                }`}
                              >
                                {cat.logo ? (
                                  <div className="flex items-center gap-1.5 sm:gap-2">
                                    <img
                                      src={cat.logo}
                                      alt={cat.name}
                                      className="h-3.5 sm:h-4.5 w-auto object-contain select-none max-w-[40px] sm:max-w-[65px]"
                                      referrerPolicy="no-referrer"
                                    />
                                    {(cat.id === "dia-phuong" ||
                                      cat.id === "thiet-yeu" ||
                                      cat.id === "quoc-te") && (
                                      <span>
                                        {cat.name} ({cat.channels.length})
                                      </span>
                                    )}
                                    {!(
                                      cat.id === "dia-phuong" ||
                                      cat.id === "thiet-yeu" ||
                                      cat.id === "quoc-te"
                                    ) && (
                                      <span className="opacity-75">
                                        ({cat.channels.length})
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span>
                                    {cat.name} ({cat.channels.length})
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Dropdown Menu rendered out-of-flow with fixed position to prevent parent overflow cropping */}
                        <AnimatePresence>
                          {showDropdownMenu && (
                            <>
                              {/* Invisible Backdrop for click-away */}
                              <div
                                className="fixed inset-0 z-40 cursor-default"
                                onClick={() => setShowDropdownMenu(false)}
                              />

                              <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.18, ease: "easeOut" }}
                                style={{
                                  position: "fixed",
                                  top: `${menuCoords.top}px`,
                                  left: `${menuCoords.left}px`,
                                }}
                                className="w-56 rounded-[30px] bg-[#1c1c1e] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] z-50 py-2.5 text-white overflow-hidden"
                              >
                                {/* Ask Firesteel */}
                                {expVIntelligence && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setShowDropdownMenu(false);
                                        if (!vIntelIconSpinning) {
                                          setVIntelIconSpinning(true);
                                          setTimeout(() => {
                                            setShowVIntel(true);
                                            setVIntelIconSpinning(false);
                                          }, 300);
                                        } else {
                                          setShowVIntel(true);
                                        }
                                      }}
                                      className="relative w-full pl-7 pr-4 py-2.5 text-left text-[13px] hover:bg-white/[0.08] active:bg-white/[0.12] flex items-center text-[#d0bcff] hover:text-[#e1d5ff] font-sans font-bold cursor-pointer group"
                                    >
                                      <div className="menu-vertical-pill" />
                                      <Sparkles className="w-4 h-4 mr-2 text-[#d0bcff] group-hover:text-[#e1d5ff] stroke-[2] animate-pulse" />
                                      Ask Firesteel
                                    </button>
                                    <div className="border-t border-white/10 my-1" />
                                  </>
                                )}

                                {/* Favorite toggle with checkmark */}
                                {selectedChannel &&
                                  (() => {
                                    const isCurrentChannelFavorite =
                                      favorites.includes(selectedChannel.id);
                                    return (
                                      <button
                                        onClick={() => {
                                          setShowDropdownMenu(false);
                                          toggleFavorite(selectedChannel.id);
                                        }}
                                        className="relative w-full pl-7 pr-4 py-2.5 text-left text-[13px] hover:bg-white/[0.08] active:bg-white/[0.12] flex items-center justify-between font-sans font-medium text-white/90 hover:text-white group"
                                      >
                                        <div className="menu-vertical-pill" />
                                        <div className="flex items-center">
                                          <ThumbsUp
                                            className={`w-4 h-4 mr-2 stroke-[2] ${isCurrentChannelFavorite ? "text-amber-500 fill-amber-500" : "text-white/60"}`}
                                          />
                                          <span>
                                            {isCurrentChannelFavorite
                                              ? "Xóa khỏi yêu thích"
                                              : "Thêm vào yêu thích"}
                                          </span>
                                        </div>
                                        {isCurrentChannelFavorite && (
                                          <Check className="w-4 h-4 text-[#007aff] stroke-[3.5]" />
                                        )}
                                      </button>
                                    );
                                  })()}

                                {/* Mở luồng gốc */}
                                {selectedChannel && (
                                  <a
                                    href={
                                      installedPlugins.open_native ===
                                      "installed"
                                        ? selectedChannel.url
                                        : "#"
                                    }
                                    target={
                                      installedPlugins.open_native ===
                                      "installed"
                                        ? "_blank"
                                        : undefined
                                    }
                                    rel="noopener noreferrer"
                                    onClick={(e) => {
                                      setShowDropdownMenu(false);
                                      if (
                                        installedPlugins.open_native !==
                                        "installed"
                                      ) {
                                        e.preventDefault();
                                        setRequiredPluginFeatureName(
                                          "Mở luồng gốc",
                                        );
                                        setShowPluginRequiredModal(true);
                                      }
                                    }}
                                    className="relative w-full pl-7 pr-4 py-2.5 text-left text-[13px] hover:bg-white/[0.08] active:bg-white/[0.12] flex items-center text-white/90 hover:text-white font-sans font-medium group"
                                  >
                                    <div className="menu-vertical-pill" />
                                    <Tv className="w-4 h-4 mr-2 text-white/60 group-hover:text-white stroke-[2]" />
                                    Mở luồng gốc
                                  </a>
                                )}

                                {/* Chia sẻ kênh */}
                                {selectedChannel && (
                                  <button
                                    onClick={() => {
                                      setShowDropdownMenu(false);
                                      handleShareChannel();
                                    }}
                                    className="relative w-full pl-7 pr-4 py-2.5 text-left text-[13px] hover:bg-white/[0.08] active:bg-white/[0.12] flex items-center text-white/90 hover:text-white font-sans font-medium group"
                                  >
                                    <div className="menu-vertical-pill" />
                                    <Share2 className="w-4 h-4 mr-2 text-white/60 group-hover:text-white stroke-[2]" />
                                    Chia sẻ kênh
                                  </button>
                                )}

                                {/* Divider */}
                                <div className="border-t border-white/10 my-1.5" />

                                {/* Xuất luồng kênh (Only visible on Live tab) */}
                                <button
                                  onClick={() => {
                                    setShowDropdownMenu(false);
                                    if (
                                      installedPlugins.export_stream !==
                                      "installed"
                                    ) {
                                      setRequiredPluginFeatureName(
                                        "Xuất luồng",
                                      );
                                      setShowPluginRequiredModal(true);
                                    } else {
                                      exportChannelsToM3u8();
                                    }
                                  }}
                                  className="relative w-full pl-7 pr-4 py-2.5 text-left text-[13px] hover:bg-white/[0.08] active:bg-white/[0.12] flex items-center text-white/90 hover:text-white font-sans font-medium group"
                                >
                                  <div className="menu-vertical-pill" />
                                  <Download className="w-4 h-4 mr-2 text-white/60 group-hover:text-white stroke-[2]" />
                                  Xuất luồng kênh
                                </button>

                                {/* Multiview & Picture-in-Picture (Only visible on Live tab) */}
                                <button
                                  onClick={() => {
                                    setShowDropdownMenu(false);
                                    if (
                                      installedPlugins.multiview !== "installed"
                                    ) {
                                      setRequiredPluginFeatureName("Multiview");
                                      setShowPluginRequiredModal(true);
                                    } else {
                                      handleOpenMultiviewSelector();
                                    }
                                  }}
                                  className="relative w-full pl-7 pr-4 py-2.5 text-left text-[13px] hover:bg-white/[0.08] active:bg-white/[0.12] flex items-center text-white/90 hover:text-white font-sans font-medium group"
                                >
                                  <div className="menu-vertical-pill" />
                                  <Grid className="w-4 h-4 mr-2 text-white/60 group-hover:text-white stroke-[2]" />
                                  Xem Multiview
                                </button>
                                <button
                                  onClick={() => {
                                    setShowDropdownMenu(false);
                                    if (installedPlugins.pip !== "installed") {
                                      setRequiredPluginFeatureName(
                                        "Picture in Picture",
                                      );
                                      setShowPluginRequiredModal(true);
                                    } else {
                                      handleTogglePictureInPicture();
                                    }
                                  }}
                                  className="relative w-full pl-7 pr-4 py-2.5 text-left text-[13px] hover:bg-white/[0.08] active:bg-white/[0.12] flex items-center text-white/90 hover:text-white font-sans font-medium group"
                                >
                                  <div className="menu-vertical-pill" />
                                  <Layers className="w-4 h-4 mr-2 text-white/60 group-hover:text-white stroke-[2]" />
                                  Picture in Picture
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* CHANNELS ACCORDION LIST matching reference screenshot specs */}
                  <div className="flex flex-col gap-10">
                    {filteredCategories.length === 0 ? (
                      <div className="py-20 text-center glass-panel rounded-2xl border border-white/10 max-w-xl mx-auto">
                        <HelpCircle className="w-12 h-12 text-white/30 mx-auto mb-3" />
                        <p className="text-white/80 font-medium">
                          Không tìm thấy kênh phù hợp
                        </p>
                        <p className="text-white/40 text-xs mt-1">
                          Hãy thử tìm với từ khoá khác hoặc thêm liên kết m3u8
                          mới.
                        </p>
                      </div>
                    ) : (
                      filteredCategories.map((category) => (
                        <div
                          key={category.id}
                          className="relative animate-fade-in-up"
                        >
                          {/* Category Title matching layout like VTV or VTVCAB with Thick vertical bar indicator */}
                          <div className="flex items-center justify-between mb-5 select-none">
                            <div className="flex items-center gap-3">
                              {/* Custom visual thick turquoise or fuchsia vertical colored sidebars */}
                              <div
                                className={`w-1.5 h-7 rounded-full ${
                                  category.id === "vtv"
                                    ? "bg-cyan-400"
                                    : category.id === "vtvcab"
                                      ? "bg-fuchsia-500"
                                      : category.id === "sctv"
                                        ? "bg-red-500"
                                        : category.id === "htv"
                                          ? "bg-orange-500"
                                          : category.id === "quoc-te"
                                            ? "bg-amber-400"
                                            : "bg-pink-500"
                                }`}
                              />
                              {category.logo ? (
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={category.logo}
                                    alt={category.name}
                                    className="h-6 sm:h-7.5 w-auto object-contain select-none max-w-[110px] sm:max-w-[150px]"
                                    referrerPolicy="no-referrer"
                                  />
                                  {(category.id === "dia-phuong" ||
                                    category.id === "thiet-yeu" ||
                                    category.id === "quoc-te") && (
                                    <span className="text-base sm:text-lg font-bold text-white/90 font-sans tracking-tight">
                                      {category.name}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <h2 className="text-xl font-extrabold tracking-tight text-white/95 uppercase drop-shadow-sm font-sans">
                                  {category.name}
                                </h2>
                              )}
                            </div>
                          </div>

                          {/* Channels responsive grid aligned properly: exactly 3 columns on mobile and 5 columns on desktop */}
                          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                            {category.channels.map((ch) => {
                              const isPlaying = selectedChannel.id === ch.id;
                              const isDacBiet = ch.group === "Đặc biệt";

                              return (
                                <div
                                  key={ch.id}
                                  id={`card-${ch.id}`}
                                  onClick={() => handleSelectChannel(ch)}
                                  className={`group relative rounded-xl p-0.5 sm:p-1 cursor-pointer flex items-center justify-center h-[72px] xs:h-[88px] sm:h-[112px] md:h-[128px] select-none ${
                                    isPlaying
                                      ? isDacBiet
                                        ? "bg-amber-400/10 backdrop-blur-lg border-[3.5px] border-amber-400"
                                        : "bg-white/20 backdrop-blur-lg border-[3.5px] border-white shadow-md shadow-pink-500/10"
                                      : isDacBiet
                                        ? "bg-amber-500/5 backdrop-blur-md border-2 border-white/10 hover:border-[3.5px] hover:border-amber-400"
                                        : "bg-white/5 backdrop-blur-md border-2 border-white/10 hover:border-[3.5px] hover:border-white"
                                  }`}
                                >
                                  {/* Custom Tooltip */}
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-1.5 bg-[#1a162b]/95 backdrop-blur-md border border-white/15 text-white text-[11px] sm:text-xs font-sans font-medium rounded-full opacity-0 scale-[0.4] pointer-events-none group-hover:opacity-100 group-hover:scale-100 tooltip-bounce shadow-xl whitespace-nowrap z-50 text-center select-none">
                                    {ch.name}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#1a162b]/95 pointer-events-none" />
                                  </div>

                                  {/* Logo Graphic Container - with vertical split for channel position number */}
                                  <div className="w-full h-full flex items-center select-none overflow-hidden rounded-lg">
                                    {/* Left Part: Channel Number */}
                                    <div className="w-[28%] sm:w-[26%] h-full flex items-center justify-center text-white/80 text-[11px] xs:text-[13px] sm:text-base md:text-lg font-bold tracking-tight font-sans">
                                      {ch.channelNumber || "000"}
                                    </div>
                                    {/* Vertical Divider */}
                                    <div className="w-[1px] h-[45%] sm:h-[55%] bg-white/15 flex-shrink-0" />
                                    {/* Right Part: Logo Container */}
                                    <div className="flex-1 h-full flex justify-center items-center overflow-hidden p-0.5 sm:p-1">
                                      {ch.logoImg ? (
                                        <img
                                          src={ch.logoImg}
                                          alt={ch.name}
                                          referrerPolicy="no-referrer"
                                          className={`object-contain filter drop-shadow-md select-none pointer-events-none ${
                                            ch.id === "vietnam-wild-live"
                                              ? "w-[115%] h-[115%]"
                                              : ch.id.startsWith("vinh_long")
                                                ? "w-[88%] h-[88%]"
                                                : ch.group === "SCTV"
                                                  ? "w-[82%] h-[82%]"
                                                  : ch.group === "VTVcab"
                                                    ? "w-[94%] h-[94%]"
                                                    : "w-[125%] h-[125%] sm:w-[135%] sm:h-[135%]"
                                          }`}
                                        />
                                      ) : (
                                        <div
                                          className={`w-full h-full flex items-center justify-center rounded-lg ${ch.logoBg} shadow-inner border border-white/10 font-bold text-white text-[9px] sm:text-xs tracking-wider text-center px-1`}
                                        >
                                          {ch.logoText}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              ) : activeTab === "home" ? (
                <motion.div
                  key="home"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full"
                >
                  <div className="w-full space-y-0 bg-[#211f26]/60 min-h-screen relative pt-0">
                    {/* TRULY IMMERSIVE HERO BIG BANNER (TV360 STYLE - 100% SCREEN-WIDE BLEED WITH NO ROUNDED CORNERS) */}
                    <div className="relative w-full overflow-hidden bg-black min-h-[520px] sm:min-h-[640px] md:min-h-[720px] lg:min-h-[820px] flex items-end pb-6 sm:pb-8 md:pb-10 lg:pb-12 group/hero">
                      {/* Background cover image representing selected slide */}
                      <div className="absolute inset-0 z-0 overflow-hidden">
                        <AnimatePresence mode="popLayout">
                          <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="absolute inset-0"
                          >
                            <img
                              src={homeSlides[currentSlide].thumbnail}
                              alt={homeSlides[currentSlide].titleMain}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover object-center md:object-right scale-102"
                            />

                            {/* Advanced Multi-Layer Vignette Overlays that match the thumbnail color dynamically */}
                            <div
                              className={`absolute inset-0 bg-gradient-to-r ${homeSlides[currentSlide].vignetteLeft} z-10`}
                            />
                            {/* Removed vignetteBottom shadow to create seamless blending with the content below */}
                            <div
                              className={`absolute inset-x-0 top-0 h-44 bg-gradient-to-b ${homeSlides[currentSlide].vignetteTop} z-10`}
                            />
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* Foreground content details on left - nested in desktop alignment grid */}
                      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 flex flex-col items-start gap-1 justify-end h-full pt-28 sm:pt-36 md:pt-40">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentSlide}
                            initial={{ x: 120, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -120, opacity: 0 }}
                            transition={{
                              duration: 0.5,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="flex flex-col items-start gap-1 w-full"
                          >
                            {/* Calligraphy logo and title text stylistics with Play font */}
                            <div className="flex flex-col select-none mb-3 font-play gap-0">
                              <div className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-normal text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-zinc-300 drop-shadow-[0_4px_15px_rgba(0,0,0,0.95)] font-play block pb-3 px-1">
                                {homeSlides[currentSlide].titleTop}
                              </div>
                              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-normal text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-400 drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)] block font-play pb-4 px-1 -mt-4 xs:-mt-5 sm:-mt-6 md:-mt-8">
                                {homeSlides[currentSlide].titleMain}
                              </div>
                              {homeSlides[currentSlide].titleSub && (
                                <div className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-white drop-shadow tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#00ffcc] to-teal-300 font-play pb-2 px-1 -mt-2 sm:-mt-3">
                                  {homeSlides[currentSlide].titleSub}
                                </div>
                              )}
                            </div>

                            {/* Special Channel Logo instead of slogans */}
                            {homeSlides[currentSlide].logos ? (
                              <div className="mt-1 mb-2 select-none pointer-events-none flex flex-col gap-2">
                                {/* Row 1 */}
                                <div className="flex items-center gap-3">
                                  {homeSlides[currentSlide].logos
                                    .slice(0, 3)
                                    .map((logoUrl, lIdx) => (
                                      <img
                                        key={lIdx}
                                        src={logoUrl}
                                        alt="Channel Logo"
                                        referrerPolicy="no-referrer"
                                        className="h-10 sm:h-14 md:h-16 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]"
                                      />
                                    ))}
                                </div>
                                {/* Row 2 */}
                                {homeSlides[currentSlide].logos.length > 3 && (
                                  <div className="flex items-center gap-3">
                                    {homeSlides[currentSlide].logos
                                      .slice(3)
                                      .map((logoUrl, lIdx) => (
                                        <img
                                          key={lIdx + 3}
                                          src={logoUrl}
                                          alt="Channel Logo"
                                          referrerPolicy="no-referrer"
                                          className="h-10 sm:h-14 md:h-16 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]"
                                        />
                                      ))}
                                  </div>
                                )}
                              </div>
                            ) : homeSlides[currentSlide].logo ? (
                              <div className="mt-1 mb-2 select-none pointer-events-none">
                                <img
                                  src={homeSlides[currentSlide].logo}
                                  alt="Channel Logo"
                                  referrerPolicy="no-referrer"
                                  className="h-10 sm:h-14 md:h-16 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]"
                                />
                              </div>
                            ) : null}

                            {(homeSlides[currentSlide].descriptionNode ||
                              homeSlides[currentSlide].description) && (
                              <p className="text-white/80 text-xs sm:text-sm max-w-2xl mt-4 leading-relaxed drop-shadow select-none">
                                {homeSlides[currentSlide].descriptionNode ||
                                  homeSlides[currentSlide].description}
                              </p>
                            )}

                            {homeSlides[currentSlide].showCountdown && (
                              <EventCountdownTimer />
                            )}

                            {/* Film attributes tags metadata */}
                            <div className="flex items-center gap-1.5 sm:gap-2.5 mt-3 text-[10px] xs:text-xs sm:text-sm font-semibold text-white/90 select-none drop-shadow">
                              <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[9px] uppercase tracking-wider shadow shadow-red-500/25">
                                {homeSlides[currentSlide].ageRating}
                              </span>
                              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                              <span>{homeSlides[currentSlide].ratingText}</span>
                            </div>
                          </motion.div>
                        </AnimatePresence>

                        {/* Elegant big glass play buttons */}
                        <div className="flex items-center gap-3 mt-6 sm:mt-8">
                          <button
                            onClick={() => {
                              const slideObj = homeSlides[currentSlide];
                              if (slideObj.channelId === "vintel-trigger") {
                                if (!vIntelIconSpinning) {
                                  setVIntelIconSpinning(true);
                                  setTimeout(() => {
                                    setShowVIntel(true);
                                    setVIntelIconSpinning(false);
                                    setVIntelMode("chat");
                                  }, 300);
                                }
                                return;
                              }
                              if (slideObj.channelId === "vietnam-wild-live") {
                                setShowEventFeedPopup(true);
                                return;
                              }
                              const targetCh =
                                CATEGORIES.flatMap((cat) => cat.channels).find(
                                  (ch) => ch.id === slideObj.channelId,
                                ) || CATEGORIES[0].channels[0];
                              if (targetCh) {
                                handleSelectChannel({
                                  ...targetCh,
                                  name: slideObj.channelPlayName,
                                });
                              }
                              setActiveTab("live");
                            }}
                            className="px-8 sm:px-10 py-3 sm:py-4 rounded-full bg-[#d0bcff] hover:bg-[#c2a8f9] active:bg-[#b093f4] text-[#381e72] font-bold shadow-xl flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer border border-white/10 bouncy-btn"
                          >
                            {homeSlides[currentSlide].btnIcon === "compass" ? (
                              <Compass className="w-7 h-7 sm:w-8 sm:h-8 text-[#381e72]" />
                            ) : homeSlides[currentSlide].btnIcon ===
                              "remote" ? (
                              <img
                                src="https://static.wikia.nocookie.net/ep-deo/images/a/a3/Remote.png/revision/latest?cb=20260629015905"
                                alt="Remote"
                                referrerPolicy="no-referrer"
                                className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                                style={{
                                  filter:
                                    "brightness(0) saturate(100%) invert(10%) sepia(95%) saturate(3474%) hue-rotate(235deg) brightness(83%) contrast(142%)",
                                }}
                              />
                            ) : (
                              <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-[#381e72] text-[#381e72]" />
                            )}
                            {homeSlides[currentSlide].btnText || "Thử ngay"}
                          </button>

                          {/* Slider indicator arrows and paging inside the banner */}
                          <div className="flex items-center gap-1.5 ml-2">
                            <button
                              onClick={() =>
                                setCurrentSlide(
                                  (prev) =>
                                    (prev - 1 + homeSlides.length) %
                                    homeSlides.length,
                                )
                              }
                              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer flex items-center justify-center border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] bouncy-btn"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                setCurrentSlide(
                                  (prev) => (prev + 1) % homeSlides.length,
                                )
                              }
                              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer flex items-center justify-center border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] bouncy-btn"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Bullet page dot selectors */}
                        <div className="flex items-center gap-1.5 mt-5 sm:mt-7 select-none ml-1">
                          {homeSlides.map((slide, idx) => (
                            <span
                              key={idx}
                              onClick={() => setCurrentSlide(idx)}
                              className={`cursor-pointer transition-all duration-300 rounded-full h-1.5 ${
                                currentSlide === idx
                                  ? "w-5 bg-red-500"
                                  : "w-1.5 bg-white/25 hover:bg-white/40"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* LOWER CONTENT SECTIONS (NESTED SAFELY IN MAX-W-7XL MX-AUTO WITH SPACING FOR PERFECT DESIGN COHESION) */}
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-8 space-y-12">
                      {/* FEATURES VOTE BANNER (GLASSMORPHISM STYLE) */}
                      <FeaturesVoteBanner onNotify={triggerToast} />
                      {/* ROW: "GỢI Ý CHO BẠN" CAROUSEL SLIDER (ADDED ABOVE KÊNH YÊU THÍCH AS REQUESTED) */}
                      {recommendedChannels.length > 0 && (
                        <div className="space-y-4 relative group/reco-carousel animate-fade-in">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-5 rounded bg-blue-500" />
                              <h3 className="text-sm sm:text-base font-bold tracking-tight text-white/95 font-google">
                                Gợi ý cho bạn
                              </h3>
                              <span className="text-xs text-blue-400/80 font-mono mt-1">
                                ({recommendedChannels.length})
                              </span>
                            </div>

                            {/* Navigation Arrows for Carousel */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  setRecoRefreshTrigger((prev) => prev + 1)
                                }
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer flex items-center justify-center border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] mr-1 group/refresh-btn bouncy-btn"
                                title="Làm mới gợi ý"
                              >
                                <RefreshCw className="w-3.5 h-3.5 group-hover/refresh-btn:rotate-180 transition-transform duration-500" />
                              </button>
                              <button
                                onClick={() => scrollRecommendations("left")}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer flex items-center justify-center border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] bouncy-btn"
                                title="Quay lại"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => scrollRecommendations("right")}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer flex items-center justify-center border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] bouncy-btn"
                                title="Xem tiếp theo"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Tiles Container */}
                          <div
                            ref={recoScrollRef}
                            className="flex gap-3 overflow-x-auto pb-2 scroll-smooth scrollbar-none snap-x"
                            style={{
                              scrollbarWidth: "none",
                              msOverflowStyle: "none",
                            }}
                          >
                            {recommendedChannels.map((ch) => {
                              const isPlaying = selectedChannel.id === ch.id;
                              const isFav = favorites.includes(ch.id);
                              return (
                                <div
                                  key={ch.id}
                                  className="snap-start shrink-0"
                                >
                                  <div
                                    onClick={() => {
                                      handleSelectChannel(ch);
                                      setActiveTab("live");
                                    }}
                                    className={`group relative rounded-xl p-0.5 sm:p-1 cursor-pointer flex items-center justify-center w-28 xs:w-34 sm:w-42 md:w-48 h-[56px] xs:h-[68px] sm:h-[84px] md:h-[96px] select-none ${
                                      isPlaying
                                        ? "bg-white/20 backdrop-blur-lg border-[3.5px] border-white shadow-md shadow-pink-500/10"
                                        : "bg-white/5 backdrop-blur-md border-2 border-white/10 hover:border-[3.5px] hover:border-white"
                                    }`}
                                  >
                                    {/* Custom Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-1.5 bg-[#1a162b]/95 backdrop-blur-md border border-white/15 text-white text-[11px] sm:text-xs font-sans font-medium rounded-full opacity-0 scale-[0.4] pointer-events-none group-hover:opacity-100 group-hover:scale-100 tooltip-bounce shadow-xl whitespace-nowrap z-50 text-center select-none">
                                      {ch.name}
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#1a162b]/95 pointer-events-none" />
                                    </div>
                                    {/* Logo Graphic Container - with vertical split for channel position number */}
                                    <div className="w-full h-full flex items-center select-none overflow-hidden rounded-lg">
                                      {/* Left Part: Channel Number */}
                                      <div className="w-[28%] sm:w-[26%] h-full flex items-center justify-center text-white/80 text-[11px] xs:text-[13px] sm:text-base md:text-lg font-bold tracking-tight font-sans">
                                        {ch.channelNumber || "000"}
                                      </div>
                                      {/* Vertical Divider */}
                                      <div className="w-[1px] h-[45%] sm:h-[55%] bg-white/15 flex-shrink-0" />
                                      {/* Right Part: Logo Container */}
                                      <div className="flex-1 h-full flex justify-center items-center overflow-hidden p-0.5 sm:p-1">
                                        {ch.logoImg ? (
                                          <img
                                            src={ch.logoImg}
                                            alt={ch.name}
                                            referrerPolicy="no-referrer"
                                            className={`object-contain filter drop-shadow-md select-none pointer-events-none ${
                                              ch.id.startsWith("vinh_long")
                                                ? "w-[88%] h-[88%]"
                                                : ch.group === "SCTV"
                                                  ? "w-[90%] h-[90%]"
                                                  : ch.group === "VTVcab"
                                                    ? "w-[94%] h-[94%]"
                                                    : "w-[125%] h-[125%] sm:w-[135%] sm:h-[135%]"
                                            }`}
                                          />
                                        ) : (
                                          <div
                                            className={`w-full h-full flex items-center justify-center rounded-lg ${ch.logoBg || "bg-emerald-600"} shadow-inner border border-white/10 font-bold text-white text-[9px] sm:text-xs tracking-wider text-center px-1`}
                                          >
                                            {ch.logoText}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* ThumbsUp/Fav Button overlay (shown on top corner) */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(ch.id, e);
                                      }}
                                      className="absolute top-1 right-1 p-1 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/90 hover:scale-110 active:scale-120 duration-200"
                                      title={
                                        isFav
                                          ? "Xóa khỏi yêu thích"
                                          : "Thêm vào yêu thích"
                                      }
                                    >
                                      <ThumbsUp
                                        className={`w-3.5 h-3.5 ${isFav ? "text-amber-400 fill-amber-400" : "text-white/70 hover:text-white"}`}
                                      />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* ROW: "KÊNH YÊU THÍCH" CAROUSEL SLIDER (ADDED ABOVE XEM TIẾP SECTIONS EXACTLY AS REQUESTED) */}
                      {favoriteChannelsList.length > 0 && (
                        <div className="space-y-4 relative group/fav-carousel animate-fade-in">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-5 rounded bg-amber-400" />
                              <h3 className="text-sm sm:text-base font-bold tracking-tight text-white/95 font-google">
                                Kênh yêu thích
                              </h3>
                              <span className="text-xs text-amber-400/80 font-mono mt-1">
                                ({favoriteChannelsList.length})
                              </span>
                            </div>

                            {/* Navigation Arrows for Carousel */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => scrollFavorites("left")}
                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-120 shadow"
                                title="Quay lại"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => scrollFavorites("right")}
                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-120 shadow"
                                title="Xem tiếp theo"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Tiles Container */}
                          <div
                            ref={favScrollRef}
                            className="flex gap-3 overflow-x-auto pb-2 scroll-smooth scrollbar-none snap-x"
                            style={{
                              scrollbarWidth: "none",
                              msOverflowStyle: "none",
                            }}
                          >
                            {favoriteChannelsList.map((ch) => {
                              const isPlaying = selectedChannel.id === ch.id;
                              return (
                                <div
                                  key={ch.id}
                                  className="snap-start shrink-0"
                                >
                                  <div
                                    onClick={() => {
                                      handleSelectChannel(ch);
                                      setActiveTab("live");
                                    }}
                                    className={`group relative rounded-xl p-0.5 sm:p-1 cursor-pointer flex items-center justify-center w-28 xs:w-34 sm:w-42 md:w-48 h-[56px] xs:h-[68px] sm:h-[84px] md:h-[96px] select-none ${
                                      isPlaying
                                        ? "bg-white/20 backdrop-blur-lg border-[3.5px] border-white shadow-md shadow-pink-500/10"
                                        : "bg-white/5 backdrop-blur-md border-2 border-white/10 hover:border-[3.5px] hover:border-white"
                                    }`}
                                  >
                                    {/* Custom Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-1.5 bg-[#1a162b]/95 backdrop-blur-md border border-white/15 text-white text-[11px] sm:text-xs font-sans font-medium rounded-full opacity-0 scale-[0.4] pointer-events-none group-hover:opacity-100 group-hover:scale-100 tooltip-bounce shadow-xl whitespace-nowrap z-50 text-center select-none">
                                      {ch.name}
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#1a162b]/95 pointer-events-none" />
                                    </div>
                                    {/* Logo Graphic Container - with vertical split for channel position number */}
                                    <div className="w-full h-full flex items-center select-none overflow-hidden rounded-lg">
                                      {/* Left Part: Channel Number */}
                                      <div className="w-[28%] sm:w-[26%] h-full flex items-center justify-center text-white/80 text-[11px] xs:text-[13px] sm:text-base md:text-lg font-bold tracking-tight font-sans">
                                        {ch.channelNumber || "000"}
                                      </div>
                                      {/* Vertical Divider */}
                                      <div className="w-[1px] h-[45%] sm:h-[55%] bg-white/15 flex-shrink-0" />
                                      {/* Right Part: Logo Container */}
                                      <div className="flex-1 h-full flex justify-center items-center overflow-hidden p-0.5 sm:p-1">
                                        {ch.logoImg ? (
                                          <img
                                            src={ch.logoImg}
                                            alt={ch.name}
                                            referrerPolicy="no-referrer"
                                            className={`object-contain filter drop-shadow-md select-none pointer-events-none ${
                                              ch.id.startsWith("vinh_long")
                                                ? "w-[88%] h-[88%]"
                                                : ch.group === "SCTV"
                                                  ? "w-[90%] h-[90%]"
                                                  : ch.group === "VTVcab"
                                                    ? "w-[94%] h-[94%]"
                                                    : "w-[125%] h-[125%] sm:w-[135%] sm:h-[135%]"
                                            }`}
                                          />
                                        ) : (
                                          <div
                                            className={`w-full h-full flex items-center justify-center rounded-lg ${ch.logoBg || "bg-emerald-600"} shadow-inner border border-white/10 font-bold text-white text-[9px] sm:text-xs tracking-wider text-center px-1`}
                                          >
                                            {ch.logoText}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* ThumbsUp/Unfav Button overlay (shown on top corner or toggleable) */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(ch.id, e);
                                      }}
                                      className="absolute top-1 right-1 p-1 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/90 hover:scale-110 active:scale-120 duration-200"
                                      title="Xóa khỏi yêu thích"
                                    >
                                      <ThumbsUp className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* ROW 1: "XEM TIẾP" (CONTINUE WATCHING) EXACTLY AS REQUIRED BY THE MOCK */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-5 rounded bg-pink-500" />
                          <h3 className="text-sm sm:text-base font-bold tracking-tight text-white/95 font-google">
                            Xem tiếp
                          </h3>
                          <span className="text-xs text-white/40 font-mono mt-1">
                            Gần đây
                          </span>
                        </div>

                        {/* Horizontal grid for 3 continue watching cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {[
                            {
                              title: "Thám Tử Lừng Danh Conan (Mùa 1)",
                              desc: "Detective Conan (Season 1) - Tập 15",
                              progress: "24:55",
                              percent: 85,
                              image:
                                "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "Bạch Nhật Đề Đăng",
                              desc: "Love Beyond the Grave - Tập 1",
                              progress: "40:49",
                              percent: 60,
                              image:
                                "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "Gia Đình Điệp Viên (Mùa 3)",
                              desc: "Spy x Family (Season 3) - Tập 2",
                              progress: "23:40",
                              percent: 45,
                              image:
                                "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=80",
                            },
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                // Switch to player with clean mock drama details set
                                const liveChan =
                                  CATEGORIES.flatMap(
                                    (cat) => cat.channels,
                                  ).find(
                                    (ch) =>
                                      ch.id.includes("vtv3") ||
                                      ch.id.includes("vtv1"),
                                  ) || CATEGORIES[0].channels[0];
                                if (liveChan) {
                                  handleSelectChannel({
                                    ...liveChan,
                                    name: `Đang xem tiếp: ${item.title} - ${item.desc.split(" - ").pop()}`,
                                  });
                                }
                                setActiveTab("live");
                              }}
                              className="group relative rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-white/20 shadow-lg hover:shadow-pink-500/5 transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-103 cursor-pointer h-40 xs:h-44 sm:h-36 md:h-44 lg:h-48"
                            >
                              {/* Background thumbnail layout */}
                              <img
                                src={item.image}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover brightness-[0.7] group-hover:brightness-[0.8] transition-transform duration-500 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                              />
                              {/* Beautiful gradient overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                              {/* Left Center: Translucent floating mini play badge */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 group-hover:text-white group-hover:bg-red-600 group-hover:scale-110 active:scale-120 duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] transition-all shadow-md">
                                  <Play className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-white text-white translate-x-0.5" />
                                </div>
                              </div>

                              {/* Progress duration tag on bottom-right inside card */}
                              <span className="absolute bottom-3 right-3 px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-black/75 text-white/90 border border-white/10 shadow select-none">
                                {item.progress}
                              </span>

                              {/* Sized percentage red-bar line at the bottom of thumbnail image */}
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                                <div
                                  className="bg-red-500 h-full transition-all duration-500"
                                  style={{ width: `${item.percent}%` }}
                                />
                              </div>

                              {/* Bottom overlay text details */}
                              <div className="absolute bottom-2.5 left-3 right-12 z-10 pointer-events-none select-none font-play">
                                <h4 className="text-xs sm:text-[13px] font-bold text-white truncate drop-shadow-md">
                                  {item.title}
                                </h4>
                                <p className="text-[10px] text-white/65 truncate drop-shadow text-pink-100/80 font-bold">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ROW 2: "PHIM ĐỀ XUẤT" (RECOMMENDED MOVIES) PORTRAIT CARDS COHESION */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-5 rounded bg-teal-400" />
                          <h3 className="text-sm sm:text-base font-bold tracking-tight text-white/95 font-google">
                            Phim đề xuất
                          </h3>
                          <span className="text-xs text-teal-400/80 font-mono mt-1">
                            Đặc sắc nhất
                          </span>
                        </div>

                        {/* Horizontal grid layout for portrait suggestions */}
                        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
                          {[
                            {
                              title: "Liên Hoa Lâu",
                              tag: "Cổ trang · Kiếm hiệp",
                              rating: "9.2",
                              img: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "Trường Nguyệt Tẫn Minh",
                              tag: "Tiên hiệp · Tình duyên",
                              rating: "9.0",
                              img: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "Khánh Dư Niên 2",
                              tag: "Cung đấu · Mưu quyền",
                              rating: "9.5",
                              img: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "Đặc Chiến Vinh Diệu",
                              tag: "Quân nhân · Hành động",
                              rating: "8.8",
                              img: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "Tây Du Ký 1986",
                              tag: "Kinh điển · Huyền thoại",
                              rating: "9.9",
                              img: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "Thương Lan Quyết",
                              tag: "Huyền huyễn · Ngọt sủng",
                              rating: "9.1",
                              img: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=400&auto=format&fit=crop&q=80",
                            },
                          ].map((movie, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                const v3 =
                                  CATEGORIES.flatMap(
                                    (cat) => cat.channels,
                                  ).find((ch) => ch.id.includes("vtv3")) ||
                                  CATEGORIES[0].channels[0];
                                if (v3) {
                                  handleSelectChannel({
                                    ...v3,
                                    name: `Phim truyện đề xuất: ${movie.title} (HD)`,
                                  });
                                }
                                setActiveTab("live");
                              }}
                              className="group flex flex-col gap-2 cursor-pointer"
                            >
                              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-white/20 transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-104 shadow-md hover:shadow-teal-500/5">
                                <img
                                  src={movie.img}
                                  alt={movie.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                {/* Rating Label Badge inside Card top-right */}
                                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-teal-500 text-white font-mono font-black text-[9px] shadow select-none border border-teal-400/20">
                                  ★ {movie.rating}
                                </span>

                                {/* Overlap zoom play state representation */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                  <div className="w-9 h-9 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-lg hover:scale-115 active:scale-125 transition-transform">
                                    <Play className="w-3.5 h-3.5 fill-white text-white translate-x-0.5" />
                                  </div>
                                </div>
                              </div>
                              {/* Content metadata details */}
                              <div className="px-1 select-none font-play">
                                <h4 className="text-[11px] sm:text-xs font-bold text-white group-hover:text-teal-300 transition-colors duration-200 truncate">
                                  {movie.title}
                                </h4>
                                <p className="text-[10px] text-white/45 truncate mt-0.5 font-bold">
                                  {movie.tag}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ROW 3: PHIM ĐIỆN ẢNH BOM TẤN (16:9 LANDSCAPE WIDESCREEN GRID) */}
                      <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-5 rounded bg-amber-400" />
                          <h3 className="text-sm sm:text-base font-bold tracking-tight text-white/95 font-google">
                            Phim Điện Ảnh Bom Tấn
                          </h3>
                          <span className="text-xs text-amber-400/80 font-mono mt-1">
                            Chất lượng 4K cực nét
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {[
                            {
                              title: "Lật Mặt 7: Một Điều Ước",
                              tag: "Gia đình · Tâm lý",
                              year: "2024",
                              duration: "138 phút",
                              img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "Mai (Trấn Thành)",
                              tag: "Lãng mạn · Bi kịch",
                              year: "2024",
                              duration: "131 phút",
                              img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "Bố Già (The Godfather)",
                              tag: "Kinh điển · Tội phạm",
                              year: "1972",
                              duration: "175 phút",
                              img: "https://images.unsplash.com/photo-1543536448-d209d2d13a1c?w=600&auto=format&fit=crop&q=80",
                            },
                          ].map((movie, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                const v3 =
                                  CATEGORIES.flatMap(
                                    (cat) => cat.channels,
                                  ).find((ch) => ch.id.includes("vtv3")) ||
                                  CATEGORIES[0].channels[0];
                                if (v3) {
                                  handleSelectChannel({
                                    ...v3,
                                    name: `Phim truyện đề xuất: ${movie.title} (HD)`,
                                  });
                                }
                                setActiveTab("live");
                              }}
                              className="group relative rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-white/20 shadow-lg hover:shadow-amber-500/5 transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-103 cursor-pointer"
                            >
                              <div className="relative aspect-[16/9]">
                                <img
                                  src={movie.img}
                                  alt={movie.title}
                                  className="w-full h-full object-cover brightness-[0.7] group-hover:brightness-[0.8] transition-transform duration-500 group-hover:scale-105"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                                {/* Floating Info Tag */}
                                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 text-white font-mono text-[9px] shadow select-none border border-white/10">
                                  {movie.year} · {movie.duration}
                                </span>

                                {/* Overlap Play Icon */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                  <div className="w-11 h-11 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-120 duration-300 transition-all">
                                    <Play className="w-4.5 h-4.5 fill-white text-white translate-x-0.5" />
                                  </div>
                                </div>
                              </div>
                              {/* Content metadata details */}
                              <div className="p-3.5 select-none font-play">
                                <h4 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-amber-300 transition-colors duration-200 truncate">
                                  {movie.title}
                                </h4>
                                <p className="text-[10px] text-white/45 truncate mt-0.5">
                                  {movie.tag}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ROW 4: TOP 10 PHIM HOT THỊNH HÀNH (NETFLIX STYLE OUTLINE NUMBERS CAROUSEL) */}
                      <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-5 rounded bg-pink-500" />
                          <h3 className="text-sm sm:text-base font-bold tracking-tight text-white/95 font-google">
                            Top 10 Phim Thịnh Hành
                          </h3>
                          <span className="text-xs text-pink-400/80 font-mono mt-1">
                            Xếp hạng tuần này
                          </span>
                        </div>

                        {/* Horizontal Scroll Bar */}
                        <div
                          className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x"
                          style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                          }}
                        >
                          {[
                            {
                              rank: 1,
                              title: "Dữ Phượng Hành",
                              tag: "Triệu Lệ Dĩnh · Lâm Canh Tân",
                              img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              rank: 2,
                              title: "Câu Chuyện Hoa Hồng",
                              tag: "Lưu Diệc Phi · Lâm Canh Tân",
                              img: "https://images.unsplash.com/photo-1513829096999-4978602297f7?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              rank: 3,
                              title: "Trường Tương Tư 2",
                              tag: "Dương Tử · Đặng Vi",
                              img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              rank: 4,
                              title: "Khánh Dư Niên 2",
                              tag: "Trương Nhược Quân · Lý Thấm",
                              img: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              rank: 5,
                              title: "Thừa Hoan Ký",
                              tag: "Dương Tử · Hứa Khải",
                              img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&auto=format&fit=crop&q=80",
                            },
                          ].map((movie, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                const v3 =
                                  CATEGORIES.flatMap(
                                    (cat) => cat.channels,
                                  ).find((ch) => ch.id.includes("vtv3")) ||
                                  CATEGORIES[0].channels[0];
                                if (v3) {
                                  handleSelectChannel({
                                    ...v3,
                                    name: `Phim truyện đề xuất: ${movie.title} (HD)`,
                                  });
                                }
                                setActiveTab("live");
                              }}
                              className="relative w-[170px] sm:w-[210px] h-[210px] sm:h-[260px] shrink-0 snap-start group cursor-pointer"
                            >
                              {/* Big ranking background number */}
                              <div className="absolute left-0 bottom-[-15px] sm:bottom-[-20px] text-[110px] sm:text-[140px] font-black leading-none select-none text-white/10 italic font-mono pointer-events-none group-hover:text-pink-500/15 transition-all duration-300">
                                {movie.rank}
                              </div>

                              {/* Movie Card */}
                              <div className="absolute right-2 top-2 bottom-2 left-10 rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 shadow-lg group-hover:scale-102 flex flex-col justify-end bg-black">
                                <img
                                  src={movie.img}
                                  alt={movie.title}
                                  className="absolute inset-0 w-full h-full object-cover brightness-[0.7] group-hover:scale-105 transition-all duration-500"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                {/* Inner Details */}
                                <div className="relative p-3 select-none font-play">
                                  <h4 className="text-[11px] sm:text-xs font-bold text-white group-hover:text-pink-300 truncate">
                                    {movie.title}
                                  </h4>
                                  <p className="text-[9px] text-white/45 truncate mt-0.5">
                                    {movie.tag}
                                  </p>
                                </div>

                                {/* Hot Badge */}
                                <span className="absolute top-2 right-2 px-1 rounded bg-pink-500 text-white font-mono text-[8px] tracking-wide select-none">
                                  TOP {movie.rank}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ROW 5: ANIME & HOẠT HÌNH (LAYOUT 3 - ASPECT 1.5/1 LANDSCAPE CARDS IN ROW) */}
                      <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-5 rounded bg-teal-400" />
                          <h3 className="text-sm sm:text-base font-bold tracking-tight text-white/95 font-google">
                            Vũ Trụ Anime & Hoạt Hình
                          </h3>
                          <span className="text-xs text-teal-400/80 font-mono mt-1">
                            Phiêu lưu kỳ thú
                          </span>
                        </div>

                        {/* Horizontal Scroll Bar */}
                        <div
                          className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x"
                          style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                          }}
                        >
                          {[
                            {
                              title: "One Piece (Đảo Hải Tặc)",
                              tag: "Luffy · Hành trình mới",
                              img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "Doraemon: Bản Giao Hưởng",
                              tag: "Doraemon & Nobita",
                              img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "Mộ Đom Đóm (Ghibli)",
                              tag: "Chiến tranh · Tình anh em",
                              img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "Thám Tử Lừng Danh Conan",
                              tag: "Kudo Shinichi · Edogawa",
                              img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80",
                            },
                          ].map((movie, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                const v3 =
                                  CATEGORIES.flatMap(
                                    (cat) => cat.channels,
                                  ).find((ch) => ch.id.includes("vtv3")) ||
                                  CATEGORIES[0].channels[0];
                                if (v3) {
                                  handleSelectChannel({
                                    ...v3,
                                    name: `Anime đề xuất: ${movie.title} (HD)`,
                                  });
                                }
                                setActiveTab("live");
                              }}
                              className="snap-start shrink-0 group flex flex-col gap-2 cursor-pointer w-[160px] sm:w-[200px]"
                            >
                              <div className="relative aspect-[1.5/1] rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-white/20 transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-104 shadow-md">
                                <img
                                  src={movie.img}
                                  alt={movie.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                {/* Overlap Play Icon */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                  <div className="w-8 h-8 rounded-full bg-teal-400 text-white flex items-center justify-center shadow-lg hover:scale-110 duration-200">
                                    <Play className="w-3.5 h-3.5 fill-white text-white translate-x-0.5" />
                                  </div>
                                </div>
                              </div>
                              {/* Content metadata details */}
                              <div className="px-1 select-none font-play">
                                <h4 className="text-[11px] sm:text-xs font-bold text-white group-hover:text-teal-300 transition-colors duration-200 truncate">
                                  {movie.title}
                                </h4>
                                <p className="text-[10px] text-white/45 truncate mt-0.5">
                                  {movie.tag}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick stats grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center pt-2">
                        {[
                          {
                            label: "Kênh Quốc Gia",
                            value: "13 VTV HD",
                            color: "text-cyan-400",
                          },
                          {
                            label: "Tin Tức & Giải Trí",
                            value: "19 VTVCab",
                            color: "text-fuchsia-400",
                          },
                          {
                            label: "Kênh TP.HCM & Độc Quyền",
                            value: "15 HTV HD",
                            color: "text-orange-400",
                          },
                          {
                            label: "Kênh địa phương & Radio",
                            value: "Gần 70+",
                            color: "text-teal-400",
                          },
                        ].map((stat, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col justify-center"
                          >
                            <span className="text-xs text-white/50">
                              {stat.label}
                            </span>
                            <span
                              className={`text-lg font-extrabold mt-1.5 ${stat.color}`}
                            >
                              {stat.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Feature guides */}
                      <div className="p-6 rounded-2xl glass-panel border border-white/12">
                        <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                          <Compass className="w-5 h-5 text-pink-400" /> Hướng
                          Dẫn Sử Dụng Linh Hoạt
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-white/70">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-white">
                              1. Chọn kênh trực tiếp
                            </h4>
                            <p className="leading-relaxed text-xs text-white/60">
                              Nhấp vào bất kỳ thẻ kênh nào hoặc phim ảnh đề xuất
                              để tải chương trình phát trực tiếp ở mục 'Truyền
                              hình'.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-semibold text-white">
                              2. Thư viện Yêu Thích
                            </h4>
                            <p className="leading-relaxed text-xs text-white/60">
                              Nhấp biểu tượng hình ngôi sao trên mỗi ô kênh để
                              lưu kênh vào mục Yêu Thích, hiển thị tức thì trên
                              Trang Chủ này.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-semibold text-white">
                              3. Tùy biến phát luồng m3u8
                            </h4>
                            <p className="leading-relaxed text-xs text-white/60">
                              Nhấn nút 'Thêm kênh' ở góc phải ô tìm kiếm để dán
                              luồng ngoài m3u8 của riêng bạn cực kì thuận tiện.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : activeTab === "settings" ? (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full max-w-7xl mx-auto px-4 pt-14 pb-8"
                >
                  <div className="max-w-5xl mx-auto font-sans">
                    <AnimatePresence mode="wait">
                      {!activeSettingSection ? (
                        <motion.div
                          key="list"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          className="space-y-3"
                        >
                          {/* Local Storage Indicator & Management Bar */}
                          <LocalStorageBar onNotify={triggerToast} />

                          {/* Project Details Banner */}
                          <div className="bg-white/10 backdrop-blur-[20px] rounded-[15px] p-5 sm:p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] border border-white/10 flex flex-col gap-4 relative overflow-hidden mb-4">
                            <div className="space-y-3 z-10 w-full">
                              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none">
                                Project Waves Community Refresh
                              </h2>
                              <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-white/80">
                                <div className="flex items-center gap-2">
                                  <Pen className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2.5]" />
                                  <span className="font-normal text-white/70">
                                    Version:{" "}
                                    <strong className="text-white font-semibold">
                                      26.8.3 (Beta)
                                    </strong>
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Crown className="w-4 h-4 text-amber-400 shrink-0 stroke-[2.5]" />
                                  <span className="font-normal text-white/70">
                                    Author:{" "}
                                    <strong className="text-white font-semibold">
                                      VNRT
                                    </strong>
                                  </span>
                                </div>
                                <div className="flex items-start gap-2 leading-relaxed">
                                  <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 fill-rose-500/15 stroke-[2.5]" />
                                  <span className="text-white/70">
                                    Supporters:{" "}
                                    <strong className="text-white font-medium">
                                      FTV Official, HMG, DHA, Bsod999, Myyer,
                                      Nquinanh, TV Archive Official, VNTV
                                      Official
                                    </strong>
                                  </span>
                                </div>
                              </div>
                            </div>
                            {/* A subtle absolute glowing visual behind */}
                            <div className="absolute right-0 bottom-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                          </div>

                          {/* Settings Search Section styled exactly like Plugin Store with custom glass icon */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 pt-2">
                            <div className="relative w-full">
                              <input
                                type="text"
                                value={settingsSearchQuery}
                                onChange={(e) =>
                                  setSettingsSearchQuery(e.target.value)
                                }
                                placeholder="Tìm kiếm cài đặt..."
                                className="w-full pl-9.5 pr-10 py-2.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-white placeholder-gray-400 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.3)] focus:outline-none focus:bg-white/15 focus:border-white/20 transition-none text-left"
                              />
                              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                                <img
                                  src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest/scale-to-width-down/1000?cb=20260717131751"
                                  className="w-3.5 h-3.5 brightness-0 invert opacity-70"
                                  referrerPolicy="no-referrer"
                                  alt="Search"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
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
                                      const speechResult =
                                        event.results[0][0].transcript;
                                      setSettingsSearchQuery((prev) => {
                                        const prefix = prev.trim()
                                          ? prev + " "
                                          : "";
                                        return prefix + speechResult;
                                      });
                                      triggerToast("Đã nhập: " + speechResult);
                                    };
                                    recognition.onerror = (event: any) => {
                                      triggerToast("Lỗi: " + event.error);
                                    };
                                  } else {
                                    triggerToast(
                                      "Trình duyệt không hỗ trợ nhận diện giọng nói",
                                    );
                                  }
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white hover:text-white/80 transition-all cursor-pointer bouncy-btn"
                                title="Tìm kiếm bằng giọng nói"
                              >
                                <Mic className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {(() => {
                            const q = settingsSearchQuery.trim().toLowerCase();
                            const matches = (text: string) =>
                              !q || text.toLowerCase().includes(q);

                            return (
                              <div className="space-y-6 pt-2">
                                {/* 1. GIAO DIỆN (APPEARANCE) */}
                                {(matches("giao diện") ||
                                  matches("header bar") ||
                                  matches("backdrop") ||
                                  matches("glow") ||
                                  matches("amoled") ||
                                  matches("dock") ||
                                  matches("sidebar")) && (
                                  <div className="bg-white/10 backdrop-blur-[15px] rounded-[20px] p-5 sm:p-6 border border-white/10 space-y-4 text-left">
                                    <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                                      <Palette className="w-5 h-5 text-indigo-400 shrink-0" />
                                      <div>
                                        <h3 className="text-base font-bold text-white">
                                          Giao diện
                                        </h3>
                                        <p className="text-xs text-white/60">
                                          Tùy biến thanh Header bar, màu sắc nền
                                          và thanh điều hướng
                                        </p>
                                      </div>
                                    </div>

                                    {/* TOGGLE: Header Bar */}
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                      <div className="space-y-1 pr-4">
                                        <div className="flex items-center gap-2">
                                          <h4 className="text-sm font-semibold text-white">
                                            Header bar
                                          </h4>
                                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                                            Mới
                                          </span>
                                        </div>
                                        <p className="text-xs text-white/60">
                                          Hiển thị thanh Header bar trắng cố
                                          định ở đỉnh màn hình (Always on top)
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          playPopSound();
                                          setShowHeaderBar(!showHeaderBar);
                                        }}
                                        className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 relative cursor-pointer flex items-center shrink-0 ${
                                          showHeaderBar
                                            ? "bg-[#34c759]"
                                            : "bg-[#3a3a3c]"
                                        }`}
                                      >
                                        <motion.div
                                          animate={{
                                            x: showHeaderBar ? 20 : 0,
                                          }}
                                          transition={{
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 30,
                                          }}
                                          className="w-5 h-5 rounded-full bg-white shadow-md"
                                        />
                                      </button>
                                    </div>

                                    {/* Backdrop Glow Options */}
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                                      <h4 className="text-sm font-semibold text-white">
                                        Màu sắc ánh sáng nền (Backdrop Glow)
                                      </h4>
                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                        {[
                                          {
                                            id: "cosmic",
                                            label: "Cosmic Glow",
                                          },
                                          { id: "deep", label: "Tối giản" },
                                          { id: "aurora", label: "Cực quang" },
                                          {
                                            id: "sunset",
                                            label: "Sunset View",
                                          },
                                        ].map((preset) => (
                                          <button
                                            key={preset.id}
                                            onClick={() => {
                                              playPopSound();
                                              setBgColor(preset.id as any);
                                            }}
                                            className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                                              bgColor === preset.id
                                                ? "bg-indigo-500/30 border-indigo-400 text-white"
                                                : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                                            }`}
                                          >
                                            {preset.label}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    {/* TOGGLE: AMOLED Dark */}
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                      <div className="space-y-1 pr-4">
                                        <h4 className="text-sm font-semibold text-white">
                                          Chế độ AMOLED Dark
                                        </h4>
                                        <p className="text-xs text-white/60">
                                          Sử dụng nền đen tuyệt đối giúp tiết
                                          kiệm pin cho màn hình OLED
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          playPopSound();
                                          setAmoledDark(!amoledDark);
                                        }}
                                        className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 relative cursor-pointer flex items-center shrink-0 ${
                                          amoledDark
                                            ? "bg-[#34c759]"
                                            : "bg-[#3a3a3c]"
                                        }`}
                                      >
                                        <motion.div
                                          animate={{ x: amoledDark ? 20 : 0 }}
                                          transition={{
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 30,
                                          }}
                                          className="w-5 h-5 rounded-full bg-white shadow-md"
                                        />
                                      </button>
                                    </div>

                                    {/* TOGGLE: Dock to Sidebar */}
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                      <div className="space-y-1 pr-4">
                                        <h4 className="text-sm font-semibold text-white">
                                          Chuyển Dock thành Sidebar bên trái
                                        </h4>
                                        <p className="text-xs text-white/60">
                                          Chuyển thanh điều hướng dưới cùng sang
                                          thanh Sidebar bên trái
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          playPopSound();
                                          setDockToSidebar(!dockToSidebar);
                                        }}
                                        className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 relative cursor-pointer flex items-center shrink-0 ${
                                          dockToSidebar
                                            ? "bg-[#34c759]"
                                            : "bg-[#3a3a3c]"
                                        }`}
                                      >
                                        <motion.div
                                          animate={{
                                            x: dockToSidebar ? 20 : 0,
                                          }}
                                          transition={{
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 30,
                                          }}
                                          className="w-5 h-5 rounded-full bg-white shadow-md"
                                        />
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* 2. TÌM KIẾM (SPOTLIGHT SEARCH SETTINGS) */}
                                {(matches("tìm kiếm") ||
                                  matches("search") ||
                                  matches("spotlight") ||
                                  matches("danh mục") ||
                                  matches("tin tức") ||
                                  matches("truyền hình") ||
                                  matches("số hiệu") ||
                                  matches("toolbox") ||
                                  matches("cài đặt")) && (
                                  <div className="bg-white/10 backdrop-blur-[15px] rounded-[20px] p-5 sm:p-6 border border-white/10 space-y-4 text-left">
                                    <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                                      <Search className="w-5 h-5 text-sky-400 shrink-0" />
                                      <div>
                                        <h3 className="text-base font-bold text-white">
                                          Tìm kiếm
                                        </h3>
                                        <p className="text-xs text-white/60">
                                          Tùy chỉnh các danh mục kết quả hiển
                                          thị trong Spotlight Search
                                        </p>
                                      </div>
                                    </div>

                                    <div className="space-y-3 pt-1">
                                      {/* 1. Danh mục */}
                                      <div
                                        onClick={() => {
                                          playPopSound();
                                          setSpotlightSearchSettings(
                                            (prev) => ({
                                              ...prev,
                                              categories: !prev.categories,
                                            }),
                                          );
                                        }}
                                        className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/10 transition-colors select-none"
                                      >
                                        <div className="space-y-0.5 pr-2">
                                          <h4 className="text-sm font-semibold text-white">
                                            Danh mục & Điều hướng
                                          </h4>
                                          <p className="text-xs text-white/60">
                                            Hiển thị các tab và điều hướng hệ
                                            thống (Home, V-Play, News, v.v.)
                                          </p>
                                        </div>
                                        <div
                                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 border ${
                                            spotlightSearchSettings.categories
                                              ? "bg-sky-500 border-sky-400 text-white shadow-[0_0_10px_rgba(56,189,248,0.4)]"
                                              : "bg-white/5 border-white/20 hover:border-white/40"
                                          }`}
                                        >
                                          {spotlightSearchSettings.categories && (
                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                          )}
                                        </div>
                                      </div>

                                      {/* 1.1 V-Apps & 5 Trò Chơi Ore UI */}
                                      <div
                                        onClick={() => {
                                          playPopSound();
                                          setSpotlightSearchSettings(
                                            (prev) => ({
                                              ...prev,
                                              vapps: !prev.vapps,
                                            }),
                                          );
                                        }}
                                        className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/10 transition-colors select-none"
                                      >
                                        <div className="space-y-0.5 pr-2">
                                          <h4 className="text-sm font-semibold text-white">
                                            V-Apps & 5 Trò chơi Ore UI
                                          </h4>
                                          <p className="text-xs text-white/60">
                                            Tìm kiếm V-Arcade 5 games (Caro XO, Kéo búa bao, Nối từ, Đếm số, Rắn), V-Files, Explore VN, V-Learn...
                                          </p>
                                        </div>
                                        <div
                                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 border ${
                                            spotlightSearchSettings.vapps
                                              ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                                              : "bg-white/5 border-white/20 hover:border-white/40"
                                          }`}
                                        >
                                          {spotlightSearchSettings.vapps && (
                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                          )}
                                        </div>
                                      </div>

                                      {/* 1.2 V-Premium & V-Cloud VIP */}
                                      <div
                                        onClick={() => {
                                          playPopSound();
                                          setSpotlightSearchSettings(
                                            (prev) => ({
                                              ...prev,
                                              vpremium: !prev.vpremium,
                                            }),
                                          );
                                        }}
                                        className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/10 transition-colors select-none"
                                      >
                                        <div className="space-y-0.5 pr-2">
                                          <h4 className="text-sm font-semibold text-white">
                                            V-Premium & V-Cloud VIP
                                          </h4>
                                          <p className="text-xs text-white/60">
                                            Tìm kiếm các gói V-Cloud Storage (50GB, 200GB, 2TB), Ngân hàng số V-Bank & Verified Tích Xanh
                                          </p>
                                        </div>
                                        <div
                                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 border ${
                                            spotlightSearchSettings.vpremium
                                              ? "bg-amber-500 border-amber-400 text-white shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                                              : "bg-white/5 border-white/20 hover:border-white/40"
                                          }`}
                                        >
                                          {spotlightSearchSettings.vpremium && (
                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                          )}
                                        </div>
                                      </div>

                                       {/* 2. Tin tức */}
                                       {(matches("tin tức") || matches("news")) && (
                                         <div
                                           onClick={() => {
                                             playPopSound();
                                             setSpotlightSearchSettings(
                                               (prev) => ({
                                                 ...prev,
                                                 news: !prev.news,
                                               }),
                                             );
                                           }}
                                           className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/10 transition-colors select-none"
                                         >
                                           <div className="space-y-1 pr-2">
                                             <h4 className="text-sm font-semibold text-white">
                                               Tin tức & Thông báo
                                             </h4>
                                             <p className="text-xs text-white/60">
                                               Tìm kiếm các bài viết tin tức, cập nhật và thông báo cộng đồng.
                                             </p>
                                           </div>
                                           <div
                                             className={`w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 border ${
                                               spotlightSearchSettings.news
                                                 ? "bg-amber-500 border-amber-400 text-white shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                                                 : "bg-white/5 border-white/20 hover:border-white/40"
                                             }`}
                                           >
                                             {spotlightSearchSettings.news && (
                                               <Check className="w-3.5 h-3.5 stroke-[3]" />
                                             )}
                                           </div>
                                         </div>
                                       )}

                                       {/* 3. Kênh truyền hình */}
                                       {(matches("kênh") || matches("truyền hình") || matches("tv") || matches("v-play")) && (
                                         <div
                                           onClick={() => {
                                             playPopSound();
                                             setSpotlightSearchSettings(
                                               (prev) => ({
                                                 ...prev,
                                                 channels: !prev.channels,
                                               }),
                                             );
                                           }}
                                           className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/10 transition-colors select-none"
                                         >
                                           <div className="space-y-1 pr-2">
                                             <h4 className="text-sm font-semibold text-white">
                                               Kênh truyền hình V-Play
                                             </h4>
                                             <p className="text-xs text-white/60">
                                               Tìm kiếm tên kênh truyền hình trực tuyến trong kho 120+ kênh sóng.
                                             </p>
                                           </div>
                                           <div
                                             className={`w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 border ${
                                               spotlightSearchSettings.channels
                                                 ? "bg-blue-500 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                                                 : "bg-white/5 border-white/20 hover:border-white/40"
                                             }`}
                                           >
                                             {spotlightSearchSettings.channels && (
                                               <Check className="w-3.5 h-3.5 stroke-[3]" />
                                             )}
                                           </div>
                                         </div>
                                       )}

                                       {/* 4. Tìm theo số hiệu kênh */}
                                       {(matches("số hiệu") || matches("channel number")) && (
                                         <div
                                           onClick={() => {
                                             playPopSound();
                                             setSpotlightSearchSettings(
                                               (prev) => ({
                                                 ...prev,
                                                 channelNumbers:
                                                   !prev.channelNumbers,
                                               }),
                                             );
                                           }}
                                           className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/10 transition-colors select-none"
                                         >
                                           <div className="space-y-1 pr-2">
                                             <h4 className="text-sm font-semibold text-white">
                                               Tìm kênh theo số hiệu
                                             </h4>
                                             <p className="text-xs text-white/60">
                                               Cho phép gõ số hiệu kênh (#1, #2, #55...) để chuyển kênh nhanh.
                                             </p>
                                           </div>
                                           <div
                                             className={`w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 border ${
                                               spotlightSearchSettings.channelNumbers
                                                 ? "bg-blue-500 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                                                 : "bg-white/5 border-white/20 hover:border-white/40"
                                             }`}
                                           >
                                             {spotlightSearchSettings.channelNumbers && (
                                               <Check className="w-3.5 h-3.5 stroke-[3]" />
                                             )}
                                           </div>
                                         </div>
                                       )}

                                       {/* 5. Toolbox */}
                                       {(matches("toolbox") || matches("tiện ích")) && (
                                         <div
                                           onClick={() => {
                                             playPopSound();
                                             setSpotlightSearchSettings(
                                               (prev) => ({
                                                 ...prev,
                                                 toolbox: !prev.toolbox,
                                               }),
                                             );
                                           }}
                                           className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/10 transition-colors select-none"
                                         >
                                           <div className="space-y-1 pr-2">
                                             <h4 className="text-sm font-semibold text-white">
                                               Toolbox & Tiện ích
                                             </h4>
                                             <p className="text-xs text-white/60">
                                               Tìm kiếm các tiện ích mở rộng (Multiview, Đồng hồ, Ghi chú, Thêm luồng m3u8...).
                                             </p>
                                           </div>
                                           <div
                                             className={`w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 border ${
                                               spotlightSearchSettings.toolbox
                                                 ? "bg-purple-500 border-purple-400 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                                                 : "bg-white/5 border-white/20 hover:border-white/40"
                                             }`}
                                           >
                                             {spotlightSearchSettings.toolbox && (
                                               <Check className="w-3.5 h-3.5 stroke-[3]" />
                                             )}
                                           </div>
                                         </div>
                                       )}

                                       {/* 6. Settings */}
                                       {(matches("cài đặt") || matches("settings")) && (
                                         <div
                                           onClick={() => {
                                             playPopSound();
                                             setSpotlightSearchSettings(
                                               (prev) => ({
                                                 ...prev,
                                                 settings: !prev.settings,
                                               }),
                                             );
                                           }}
                                           className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/10 transition-colors select-none"
                                         >
                                           <div className="space-y-1 pr-2">
                                             <h4 className="text-sm font-semibold text-white">
                                               Cài đặt hệ thống
                                             </h4>
                                             <p className="text-xs text-white/60">
                                               Tìm kiếm các mục cài đặt hệ thống (Giao diện, Spotlight, Trợ năng, Tài khoản...).
                                             </p>
                                           </div>
                                           <div
                                             className={`w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 border ${
                                               spotlightSearchSettings.settings
                                                 ? "bg-sky-500 border-sky-400 text-white shadow-[0_0_10px_rgba(56,189,248,0.4)]"
                                                 : "bg-white/5 border-white/20 hover:border-white/40"
                                             }`}
                                           >
                                             {spotlightSearchSettings.settings && (
                                               <Check className="w-3.5 h-3.5 stroke-[3]" />
                                             )}
                                           </div>
                                         </div>
                                       )}
                                     </div>
                                   </div>
                                 )}
                               </div>
                             );
                           })()}
                          </motion.div>
                        ) : null}
                     </AnimatePresence>
                   </div>
                 </motion.div>
               ) : activeTab === "vapps" ? (
                 <motion.div
                   key="vapps"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   transition={{ duration: 0.5, ease: "easeOut" }}
                   className="w-full max-w-7xl mx-auto px-4 pt-14 pb-8"
                 >
                   <VAppsView
                     triggerToast={triggerToast}
                     onNavigateToChannel={(chId) => {
                       const ch = processedChannels.find(
                         (c) => c.id === chId,
                       );
                       if (ch) {
                         handleSelectChannel(ch);
                         setActiveTab("live");
                       }
                     }}
                   />
                 </motion.div>
               ) : activeTab === "vpremium" ? (
                 <motion.div
                   key="vpremium"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   transition={{ duration: 0.5, ease: "easeOut" }}
                   className="w-full max-w-7xl mx-auto px-4 pt-14 pb-8"
                 >
                   <VPremiumView />
                 </motion.div>
               ) : activeTab === "news" ? (
                 <motion.div
                   key="news"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   transition={{ duration: 0.5, ease: "easeOut" }}
                   className="w-full max-w-7xl mx-auto px-4 pt-14 pb-8"
                 >
                   <NewsView
                     triggerToast={triggerToast}
                     onSelectChannel={(chId) => {
                       const ch = processedChannels.find(
                         (c) => c.id === chId,
                       );
                       if (ch) {
                         handleSelectChannel(ch);
                         setActiveTab("live");
                       }
                     }}
                   />
                 </motion.div>
               ) : null}
             </AnimatePresence>
           </motion.div>
         )}
       </main>

       {/* Unified Spotlight Search Modal */}
       <SpotlightSearchModal
         isOpen={isSpotlightOpen}
         onClose={() => setIsSpotlightOpen(false)}
         query={menubarSearchQuery}
         onQueryChange={setMenubarSearchQuery}
         results={spotlightSearchResults}
         isAllDisabled={isSpotlightAllDisabled}
         onOpenSettings={() => {
           setActiveTab("settings");
           setActiveSettingSection("search");
         }}
         triggerToast={triggerToast}
         onSelectNews={(id, title) => {
           setActiveTab("news");
           triggerToast("Mở tin tức: " + title);
         }}
         onSelectChannel={(ch) => {
           handleSelectChannel(ch);
           triggerToast("Đang phát: " + ch.name);
         }}
         selectedChannelId={selectedChannel?.id}
       />

       {/* Toast Notification Container */}
       {toastMessage && (
         <div className="fixed bottom-6 right-6 z-[9999] px-4 py-2.5 rounded-xl bg-[#1d1b24]/90 backdrop-blur-xl border border-white/20 text-white text-xs font-semibold shadow-2xl animate-fade-in flex items-center gap-2">
           <Sparkles className="w-4 h-4 text-sky-400" />
           <span>{toastMessage}</span>
         </div>
       )}

       {/* Disabled Spotlight Modal */}
       {showSpotlightDisabledModal && (
         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="w-full max-w-md p-6 rounded-2xl bg-[#1c1a24] border border-white/15 text-white shadow-2xl font-sans space-y-4">
             <div className="flex items-center gap-3 text-amber-400">
               <AlertCircle className="w-6 h-6 shrink-0" />
               <h3 className="text-base font-bold">Tìm kiếm đang tắt</h3>
             </div>
             <p className="text-xs text-white/70 leading-relaxed">
               Tất cả các nguồn dữ liệu trong Spotlight Search đã bị tắt trong Cài đặt. Vui lòng bật lại ít nhất một mục để sử dụng tính năng tìm kiếm.
             </p>
             <div className="flex justify-end gap-3 pt-2">
               <button
                 type="button"
                 onClick={() => setShowSpotlightDisabledModal(false)}
                 className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all cursor-pointer"
               >
                 Đóng
               </button>
               <button
                 type="button"
                 onClick={() => {
                   setShowSpotlightDisabledModal(false);
                   setActiveTab("settings");
                   setActiveSettingSection("search");
                 }}
                 className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-lg shadow-sky-500/25 transition-all cursor-pointer"
               >
                 Đi tới Cài đặt
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 }
