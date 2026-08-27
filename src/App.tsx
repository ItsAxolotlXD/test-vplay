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
    titleTop: "T·∫°m bi·ªát Vplay",
    titleMain: "Ch√†o m·ª´ng Waves Community!",
    titleSub: "",
    genreText: "TH√îNG B√ÅO QUAN TR·ªåNG",
    subSlogan: "H√ÄNH TR√åNH M·ªöI C·ª¶A TR·∫¢I NGHI·ªÜM TRUY·ªÄN H√åNH",
    thumbnail:
      "https://static.wikia.nocookie.net/ep-deo/images/2/26/Background.png/revision/latest/scale-to-width-down/1000?cb=20260825071832",
    channelId: "vtv1",
    channelPlayName: "VTV1 HD",
    ageRating: "Th√¥ng b√°o",
    ratingText: "S√°p nh·∫≠p & N√¢ng c·∫•p to√†n di·ªán | Discord: Waves",
    vignetteLeft: "from-black/90 via-black/55 to-transparent",
    vignetteBottom: "from-[#211f26] via-[#211f26]/85 to-transparent",
    vignetteTop: "from-black/45 via-transparent to-transparent",
    description:
      "K·ªÉ t·ª´ 20/09/2026, n·ªÅn t·∫£ng xem truy·ªÅn h√¨nh quen thu·ªôc c·ªßa b·∫°n s·∫Ω b∆∞·ªõc sang m·ªôt h√†nh tr√¨nh ho√†n to√†n m·ªõi. Vplay ƒë∆∞·ª£c h·ª£p nh·∫•t ƒë·ªÉ tr·ªü th√†nh Waves Community. Ngo√†i vi·ªác cung c·∫•p cho ng∆∞·ªùi d√πng m·ªôt h·ªá th·ªëng xem truy·ªÅn h√¨nh ƒëa d·∫°ng th·ªÉ lo·∫°i c√°c k√™nh th√¨ trang web m·ªõi sau s√°p nh·∫≠p s·∫Ω t·∫≠p trung th√™m c·∫£ v√†o vi·ªác c·∫≠p nh·∫≠t nh·ªØng tin t·ª©c, th√¥ng b√°o m·ªõi c·ªßa server Waves trong Discord. Tr√¢n tr·ªçng c·∫£m ∆°n!",
    descriptionNode: (
      <span>
        K·ªÉ t·ª´ 20/09/2026, n·ªÅn t·∫£ng xem truy·ªÅn h√¨nh quen thu·ªôc c·ªßa b·∫°n s·∫Ω b∆∞·ªõc
        sang m·ªôt h√†nh tr√¨nh ho√†n to√†n m·ªõi. Vplay ƒë∆∞·ª£c h·ª£p nh·∫•t ƒë·ªÉ tr·ªü th√†nh{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-fuchsia-500 font-bold">
          Waves Community
        </span>
        . Ngo√†i vi·ªác cung c·∫•p cho ng∆∞·ªùi d√πng m·ªôt h·ªá th·ªëng xem truy·ªÅn h√¨nh ƒëa
        d·∫°ng th·ªÉ lo·∫°i c√°c k√™nh th√¨ trang web m·ªõi sau s√°p nh·∫≠p s·∫Ω t·∫≠p trung th√™m
        c·∫£ v√†o vi·ªác c·∫≠p nh·∫≠t nh·ªØng tin t·ª©c, th√¥ng b√°o m·ªõi c·ªßa server Waves trong
        Discord. Tr√¢n tr·ªçng c·∫£m ∆°n!
      </span>
    ),
    showCountdown: false,
    logo: "https://static.wikia.nocookie.net/ep-deo/images/e/e9/Wave.png/revision/latest/scale-to-width-down/1000?cb=20260825072256",
    btnText: "Kh√°m ph√° ngay",
    btnIcon: "play",
  },
  {
    id: 1,
    titleTop: "ƒê√≥n ch√†o",
    titleMain: "Firesteel!",
    titleSub: "",
    genreText: "TR·ª¢ L√ù ·∫¢O TH√îNG MINH (AI)",
    subSlogan: "TR·∫¢I NGHI·ªÜM TRUY·ªÄN H√åNH THEO PHONG C√ÅCH T∆Ø∆†NG LAI",
    thumbnail:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop",
    channelId: "vintel-trigger",
    channelPlayName: "Firesteel Virtual Assistant",
    ageRating: "M·ªõi",
    ratingText: "Tr·ª£ l√Ω ƒë·∫Øc l·ª±c | ƒêi·ªÅu khi·ªÉn th√¥ng minh & T√¨m ki·∫øm",
    vignetteLeft: "from-black/90 via-black/55 to-transparent",
    vignetteBottom: "from-[#211f26] via-[#211f26]/85 to-transparent",
    vignetteTop: "from-black/45 via-transparent to-transparent",
    logo: "https://static.wikia.nocookie.net/logopedia/images/d/d5/Windows_Copilot_2023.svg/revision/latest/scale-to-width-down/200?cb=20230615034323",
    description:
      "Tr·ª£ l√Ω AI th·∫ø h·ªá m·ªõi t√≠ch h·ª£p s√¢u v√†o h·ªá th·ªëng Waves Community gi√∫p b·∫°n t√¨m ki·∫øm nhanh m·ªçi k√™nh truy·ªÅn h√¨nh, m·ªü tr·ª±c ti·∫øp c√°c m·ª•c c·∫•u h√¨nh c√†i ƒë·∫∑t v√† t·ª± ƒë·ªông h√≥a c√°c t√°c v·ª• gi·∫£i tr√≠ ch·ªâ b·∫±ng m·ªôt thao t√°c.",
    btnText: "Th·ª≠ ngay!",
    btnIcon: "compass",
  },
  {
    id: 2,
    titleTop: "VTV6",
    titleMain: "V√¨ m·ªôt Vi·ªát Nam kh·ªèe m·∫°nh!",
    titleSub: "",
    genreText: "TH·ªÇ THAO & S·ª®C KH·ªéE QU·ªêC GIA",
    subSlogan: "ƒê·ªíNG H√ÄNH KH√ÅT V·ªåNG, LAN T·ªéA S·ª®C TR·∫∫ VI·ªÜT NAM",
    thumbnail: "https://i.ytimg.com/vi/cXv_D6qIy0s/maxresdefault.jpg",
    channelId: "vtv3",
    channelPlayName: "VTV6 - V√¨ m·ªôt Vi·ªát Nam kh·ªèe m·∫°nh! (FHD)",
    ageRating: "T·∫•t c·∫£",
    ratingText: "Tr·ª±c ti·∫øp Th·ªÉ thao | B·∫£n quy·ªÅn",
    vignetteLeft: "from-black/90 via-black/55 to-transparent",
    vignetteBottom: "from-[#211f26] via-[#211f26]/85 to-transparent",
    vignetteTop: "from-black/45 via-transparent to-transparent",
    logo: "https://static.wikia.nocookie.net/logos/images/5/56/VTV6_logo_07.06.2026.png/revision/latest?cb=20260608073805&path-prefix=uk",
    description:
      "C√°c b·∫£n tin, chuy√™n m·ª•c, t∆∞·ªùng thu·∫≠t v·ªÅ th·ªÉ thao trong n∆∞·ªõc v√† qu·ªëc t·∫ø do Trung t√¢m Truy·ªÅn h√¨nh Th·ªÉ thao s·∫£n xu·∫•t, v·ªõi m·ª•c ti√™u th√∫c ƒë·∫©y phong tr√†o th·ªÉ thao qu·∫ßn ch√∫ng, th·ªÉ thao h·ªçc ƒë∆∞·ªùng, th·ªÉ thao chuy√™n nghi·ªáp ph√°t tri·ªÉn t·∫°i Vi·ªát Nam c≈©ng nh∆∞ h∆∞·ªõng ƒë·∫øn r√®n luy·ªán, n√¢ng cao s·ª©c kh·ªèe c·ªông ƒë·ªìng v√† ph√°t tri·ªÉn to√†n di·ªán.",
    btnText: "Xem ngay",
    btnIcon: "play",
  },
  {
    id: 3,
    titleTop: "VIETNAM TODAY",
    titleMain: "Your Window on Vietnam",
    titleSub: "",
    genreText: "ƒê·ªêI NGO·∫†I & QU·ªêC T·∫æ",
    subSlogan: "C·ª¨A S·ªî TH√îNG TIN RA TH·∫æ GI·ªöI",
    thumbnail:
      "https://vtv4.vtv.vn/upload/news/3HOPA0OIS_vntoday1-79180073137201066112112-72441177075135673357555.jpg",
    channelId: "vn_today",
    channelPlayName: "Vietnam Today HD",
    ageRating: "T·∫•t c·∫£",
    ratingText: "Ch·∫•t l∆∞·ª£ng HD | ƒê·ªëi ngo·∫°i qu·ªëc gia",
    vignetteLeft: "from-black/90 via-black/55 to-transparent",
    vignetteBottom: "from-[#211f26] via-[#211f26]/85 to-transparent",
    vignetteTop: "from-black/45 via-transparent to-transparent",
    logo: "https://static.wikia.nocookie.net/logos/images/0/06/Vietnam_Today_white%2C_vertical%2C_no_gradient.png/revision/latest/scale-to-width-down/1000?cb=20260527070551&path-prefix=uk",
    description:
      "C·ª≠a s·ªï th√¥ng tin c·ªßa Vi·ªát Nam ra th·∫ø gi·ªõi, ph·∫£n √°nh kh√°ch quan v√† sinh ƒë·ªông c√°c v·∫•n ƒë·ªÅ th·ªùi s·ª±, ch√≠nh tr·ªã, kinh t·∫ø, vƒÉn h√≥a, du l·ªãch, m√¥i tr∆∞·ªùng, ƒë·ªïi m·ªõi s√°ng t·∫°o, chuy·ªÉn ƒë·ªïi s·ªë v√† nh·ªØng gi√° tr·ªã ƒë·∫∑c tr∆∞ng, b·∫£n s·∫Øc, truy·ªÅn th·ªëng v√† hi·ªán ƒë·∫°i c·ªßa Vi·ªát Nam trong c√¥ng cu·ªôc ph√°t tri·ªÉn ƒë·∫•t n∆∞·ªõc h·ªôi nh·∫≠p qu·ªëc t·∫ø.",
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
        Th·ªùi gian c√≤n l·∫°i c·ªßa s·ª± ki·ªán
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
      export_stream: "Xu·∫•t lu·ªìng",
      multiview: "Multiview Grid",
      pip: "Picture in Picture",
      open_native: "M·ªü lu·ªìng g·ªëc",
      quick_switch: "Chuy·ªÉn k√™nh nhanh",
      add_custom: "Th√™m k√™nh m·ªõi",
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
        name: "VTV5 Qu·ªëc gia",
      },
      {
        ...(v5Tnb || {
          id: "vtv5_tnb",
          name: "VTV5 T√¢y Nam B·ªô",
          url: "",
          group: "VTV",
          logoText: "VTV5 TNB",
          logoBg: "bg-gradient-to-br from-emerald-600 to-emerald-800",
        }),
        name: "VTV5 T√¢y Nam B·ªô",
      },
      {
        ...(v5Tn || {
          id: "vtv5_tn",
          name: "VTV5 T√¢y Nguy√™n",
          url: "",
          group: "VTV",
          logoText: "VTV5 TN",
          logoBg: "bg-gradient-to-br from-emerald-600 to-emerald-800",
        }),
        name: "VTV5 T√¢y Nguy√™n",
      },
    ];
  }, []);
  const [isHeaderSearchExpanded, setIsHeaderSearchExpanded] =
    useState<boolean>(false);
  const headerSearchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus header search input when expanded
  useEffect(() => {
    if (isHeaderSearchExpanded && headerSearchInputRef.current) {
      setTimeout(() => {
        headerSearchInputRef.current?.focus();
      }, 50);
    }
  }, [isHeaderSearchExpanded]);

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
      small: "Nh·ªè (14px)",
      normal: "Ti√™u chu·∫©n (16px)",
      large: "L·ªõn (18px)",
      huge: "R·∫•t l·ªõn (20px)",
    };
    triggerToast(`ƒê√£ ch·ªçn c·ª° ch·ªØ tin t·ª©c: ${labels[size]}`);
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
      name = name.replace(/^Truy·ªÅn h√¨nh\s+/i, "").trim();
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
        return "TH√îNG B√ÅO";
      case "settings":
        if (activeSettingSection === "design_system")
          return "DESIGN COMPONENTS";
        if (activeSettingSection === "about") return "V·ªÄ WAVES COMMUNITY";
        return "C√ÄI ƒê·∫∂T";
      case "search":
        return "SPOTLIGHT SEARCH";
      case "plugin_store":
        return "C·ª¨A H√ÄNG TI·ªÜN √çCH";
      case "profile":
        return "T√ÄI KHO·∫¢N & D·ªÆ LI·ªÜU";
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
    useState<string>("Xu·∫•t lu·ªìng");
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
    categories: true, // Danh m·ª•c (Tabs & Navigation)
    vapps: true, // V-Apps & 5 Games V-Arcade, V-Files, V-Learn...
    vpremium: true, // V-Premium: G√≥i V-Cloud Storage, V-Bank, Verified
    news: true, // Tin t·ª©c (News & Announcements)
    channels: true, // Truy·ªÅn h√¨nh (TV Channels)
    channelNumbers: true, // T√¨m k√™nh theo s·ªë hi·ªáu k√™nh (m·ª•c nh·ªè c·ªßa Truy·ªÅn h√¨nh)
    toolbox: true, // Toolbox (C√¥ng c·ª• & Ti·ªán √≠ch)
    settings: true, // C√†i ƒë·∫∑t (C√†i ƒë·∫∑t h·ªá th·ªëng)
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
      { id: "remote", label: "Chuy·ªÉn k√™nh", enabled: true },
      { id: "profile", label: "H·ªì s∆°", enabled: false },
      { id: "plugin_store", label: "C·ª≠a h√†ng ti·ªán √≠ch", enabled: false },
      { id: "settings", label: "C√†i ƒë·∫∑t", enabled: true },
      { id: "about", label: "V·ªÅ ·ª©ng d·ª•ng n√†y", enabled: false },
      { id: "reload", label: "T·∫£i l·∫°i ·ª©ng d·ª•ng", enabled: false },
      { id: "pin", label: "Ghim k√™nh b·∫•t k·ª≥", enabled: false },
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
          label: "C√†i ƒë·∫∑t",
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
        alert("B·∫°n ph·∫£i gi·ªØ l·∫°i √≠t nh·∫•t m·ªôt m·ª•c hi·ªÉn th·ªã tr√™n thanh Dock!");
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
        triggerToast("Thanh dock ch·ªâ ch·ª©a ƒë∆∞·ª£c 5 m·ª•c");
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
        return { icon: Settings, label: "C√†i ƒë·∫∑t", isImg: false };
      case "search":
        return {
          icon: "https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest/scale-to-width-down/1000?cb=20260717131751",
          label: "Spotlight Search",
          isImg: true,
        };
      case "profile":
        return { icon: User, label: "H·ªì s∆°", isImg: false };
      case "remote":
        return {
          icon: "https://static.wikia.nocookie.net/ep-deo/images/a/a3/Remote.png/revision/latest?cb=20260629015905",
          label: "Chuy·ªÉn k√™nh",
          isImg: true,
        };
      case "plugin_store":
        return { icon: ShoppingBag, label: "C·ª≠a h√†ng ti·ªán √≠ch", isImg: false };
      case "about":
        return { icon: Info, label: "Gi·ªõi thi·ªáu", isImg: false };
      case "reload":
        return { icon: RefreshCw, label: "T·∫£i l·∫°i", isImg: false };
      case "pin":
        return { icon: Pin, label: "Ghim k√™nh", isImg: false };
      default:
        return { icon: HelpCircle, label: "Kh√°c", isImg: false };
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
          setRequiredPluginFeatureName("Chuy·ªÉn k√™nh nhanh");
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
                `C√†i ƒë·∫∑t th√†nh c√¥ng g√≥i ti·ªán √≠ch **${pluginTitle}**`,
              );
            } else if (status === "uninstalling") {
              triggerToast(
                `G·ª° c√†i ƒë·∫∑t th√†nh c√¥ng g√≥i ti·ªán √≠ch **${pluginTitle}**`,
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
    useState<string>("Nh√≥m K√™nh M·ªõi");
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
      setFandomError("Vui l√≤ng ƒëi·ªÅn t√™n trang ho·∫∑c ƒë∆∞·ªùng link.");
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
        throw new Error(data.error || "Kh√¥ng th·ªÉ t·∫£i logo.");
      }

      setFandomData(data);
      setActiveTab("fandom_logos");
      setShowFandomModal(false);
      triggerToast("ƒê√£ t·∫£i to√†n b·ªô logo th√†nh c√¥ng!");
    } catch (err: any) {
      setFandomError(err.message || "ƒê√£ x·∫£y ra l·ªói.");
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
        title: "Cu·ªôc tr√≤ chuy·ªán m·∫∑c ƒë·ªãnh",
        timestamp: new Date().toLocaleString("vi-VN"),
        messages: [
          {
            role: "model",
            content:
              "Xin ch√†o! T√¥i l√† Firesteel, tr·ª£ l√Ω AI th√¥ng minh c·ªßa b·∫°n t·∫°i Waves Community. T√¥i c√≥ th·ªÉ gi√∫p g√¨ cho b·∫°n h√¥m nay?",
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
          "Xin ch√†o! T√¥i l√† Firesteel, tr·ª£ l√Ω AI th√¥ng minh c·ªßa b·∫°n t·∫°i Waves Community. T√¥i c√≥ th·ªÉ gi√∫p g√¨ cho b·∫°n h√¥m nay?",
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
      name: "K√™nh T·ª± Th√™m (C√° Nh√¢n)",
      description: "Danh s√°ch lu·ªìng ph√°t m3u8 t·ª± li√™n k·∫øt",
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

    // If no search query and category is "all", return empty so they see "Nh·∫≠p t·ª´ kh√≥a..."
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
        triggerToast("ƒê√£ x√≥a kh·ªèi danh s√°ch y√™u th√≠ch");
      } else {
        updated = [...prev, channelId];
        triggerToast("ƒê√£ th√™m v√†o danh s√°ch y√™u th√≠ch");
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
      title: "Cu·ªôc tr√≤ chuy·ªán m·ªõi",
      timestamp: new Date().toLocaleString("vi-VN"),
      messages: [
        {
          role: "model",
          content: vIntelUserName
            ? `Xin ch√†o ${vIntelUserName}! T√¥i l√† Firesteel, tr·ª£ l√Ω AI th√¥ng minh c·ªßa b·∫°n t·∫°i Waves Community. T√¥i c√≥ th·ªÉ gi√∫p g√¨ cho b·∫°n h√¥m nay?`
            : "Xin ch√†o! T√¥i l√† Firesteel, tr·ª£ l√Ω AI th√¥ng minh c·ªßa b·∫°n t·∫°i Waves Community. T√¥i c√≥ th·ªÉ gi√∫p g√¨ cho b·∫°n h√¥m nay?",
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
    triggerVIntelToast("ƒê√£ t·∫°o cu·ªôc tr√≤ chuy·ªán m·ªõi!");
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
      triggerVIntelToast(`ƒê√£ chuy·ªÉn sang: ${sess.title}`);
    }
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (vIntelSessions.length <= 1) {
      triggerVIntelToast("Kh√¥ng th·ªÉ x√≥a cu·ªôc tr√≤ chuy·ªán duy nh·∫•t!");
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
    triggerVIntelToast("ƒê√£ x√≥a cu·ªôc tr√≤ chuy·ªán");
  };

  // V-Intelligence Message handler
  const handleSendVIntelMessage = async () => {
    if ((!vIntelInput.trim() && !vIntelAttachedFile) || vIntelLoading) return;

    let userText = vIntelInput.trim();
    if (vIntelAttachedFile) {
      const fileLabel = `üìé [T·ªáp ƒë√≠nh k√®m: ${vIntelAttachedFile.name}]`;
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
            s.title === "Cu·ªôc tr√≤ chuy·ªán m·∫∑c ƒë·ªãnh" ||
            s.title.startsWith("Cu·ªôc tr√≤ chuy·ªán");
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
        throw new Error("Kh√¥ng th·ªÉ k·∫øt n·ªëi v·ªõi tr·ª£ l√Ω ·∫£o Firesteel");
      }

      const data = await response.json();

      const nextMessages = [
        ...newMessages,
        {
          role: "model",
          content: data.reply || "T√¥i kh√¥ng nh·∫≠n ƒë∆∞·ª£c ph·∫£n h·ªìi ph√π h·ª£p.",
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
          content: `ƒê√£ x·∫£y ra l·ªói: ${err.message || "Kh√¥ng th·ªÉ t·∫£i ph·∫£n h·ªìi t·ª´ tr·ª£ l√Ω ·∫£o Firesteel."}`,
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
      if (filter === "Tin t·ª©c") {
        return (
          nameLower.includes("tin t·ª©c") ||
          nameLower.includes("th·ªùi s·ª±") ||
          nameLower.includes("news") ||
          nameLower.includes("vtv1") ||
          nameLower.includes("cnn") ||
          nameLower.includes("bbc") ||
          nameLower.includes("vov1") ||
          nameLower.includes("qu·ªëc h·ªôi") ||
          nameLower.includes("nh√¢n d√¢n") ||
          nameLower.includes("vnews")
        );
      }
      if (filter === "Ch√≠nh tr·ªã") {
        return (
          nameLower.includes("ch√≠nh tr·ªã") ||
          nameLower.includes("qu·ªëc h·ªôi") ||
          nameLower.includes("nh√¢n d√¢n") ||
          nameLower.includes("vnews") ||
          nameLower.includes("vtv1") ||
          nameLower.includes("vov1")
        );
      }
      if (filter === "VƒÉn h√≥a") {
        return (
          nameLower.includes("vƒÉn h√≥a") ||
          nameLower.includes("vtv4") ||
          nameLower.includes("vtv5") ||
          nameLower.includes("vov2") ||
          nameLower.includes("vov4") ||
          nameLower.includes("vov5")
        );
      }
      if (filter === "Gi·∫£i tr√≠") {
        return (
          nameLower.includes("gi·∫£i tr√≠") ||
          nameLower.includes("music") ||
          nameLower.includes("nh·∫°c") ||
          nameLower.includes("vtv3") ||
          nameLower.includes("vtv9") ||
          nameLower.includes("vtv6") ||
          nameLower.includes("vtv8") ||
          nameLower.includes("giaitri") ||
          nameLower.includes("h√†i") ||
          groupLower.includes("vtvcab")
        );
      }
      if (filter === "Phim truy·ªán") {
        return (
          nameLower.includes("phim") ||
          nameLower.includes("movie") ||
          nameLower.includes("cine") ||
          nameLower.includes("drama")
        );
      }
      if (filter === "Khoa h·ªçc") {
        return (
          nameLower.includes("khoa h·ªçc") ||
          nameLower.includes("khcn") ||
          nameLower.includes("discovery") ||
          nameLower.includes("nature") ||
          nameLower.includes("sctv8") ||
          nameLower.includes("vtv2")
        );
      }
      if (filter === "Gi√°o d·ª•c") {
        return (
          nameLower.includes("gi√°o d·ª•c") ||
          nameLower.includes("h·ªçc") ||
          nameLower.includes("edu") ||
          nameLower.includes("vtv7") ||
          nameLower.includes("vtv2")
        );
      }
      if (filter === "Ti·∫øng Anh") {
        return (
          nameLower.includes("english") ||
          nameLower.includes("ti·∫øng anh") ||
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
      triggerToast("Kh√¥ng t√¨m th·∫•y k√™nh n√†o ph√π h·ª£p v·ªõi b·ªô l·ªçc ƒë√£ ch·ªçn!");
      return;
    }

    const randomIndex = Math.floor(Math.random() * candidates.length);
    const selected = candidates[randomIndex];

    setSelectedChannel(selected);
    setActiveTab("live");
    setShowRandomSuggestModal(false);
    triggerToast(`ƒê·ªÅ xu·∫•t ng·∫´u nhi√™n: ƒêang m·ªü ${selected.name}`);
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
            s.title === "Cu·ªôc tr√≤ chuy·ªán m·∫∑c ƒë·ªãnh" ||
            s.title.startsWith("Cu·ªôc tr√≤ chuy·ªán");
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
        throw new Error("Kh√¥ng th·ªÉ k·∫øt n·ªëi v·ªõi tr·ª£ l√Ω ·∫£o Firesteel");
      }

      const data = await response.json();

      const nextMessages = [
        ...newMessages,
        {
          role: "model",
          content: data.reply || "T√¥i kh√¥ng nh·∫≠n ƒë∆∞·ª£c ph·∫£n h·ªìi ph√π h·ª£p.",
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
          content: `ƒê√£ x·∫£y ra l·ªói: ${err.message || "Kh√¥ng th·ªÉ t·∫£i ph·∫£n h·ªìi t·ª´ tr·ª£ l√Ω ·∫£o Firesteel."}`,
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
      let currentChannelGroup = "ƒê·ªãa ph∆∞∆°ng";

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
            currentChannelGroup = "ƒê·ªãa ph∆∞∆°ng";
          }
        }
      }

      if (importedChannels.length > 0) {
        setCustomChannels((prev) => [...importedChannels, ...prev]);
        triggerVIntelToast(
          `ƒê√£ nh·∫≠p th√†nh c√¥ng ${importedChannels.length} k√™nh t·ª´ file M3U!`,
        );
      } else {
        triggerVIntelToast("Kh√¥ng t√¨m th·∫•y k√™nh h·ª£p l·ªá trong file M3U!");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleM3uExport = () => {
    if (customChannels.length === 0) {
      triggerVIntelToast("B·∫°n ch∆∞a c√≥ k√™nh t·ª± th√™m n√†o ƒë·ªÉ xu·∫•t!");
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

    triggerVIntelToast("ƒê√£ xu·∫•t danh s√°ch k√™nh t·ª± th√™m th√†nh c√¥ng!");
  };

  // Add Custom Channel Handler
  const handleAddCustomChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customChannelName || !customChannelUrl) return;

    const finalGroup =
      customChannelGroup === "NEW_GROUP"
        ? customGroupInput.trim() || "K√™nh Ri√™ng"
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
    setCustomGroupInput("Nh√≥m K√™nh M·ªõi");
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
        description: "Xem c√°c ch∆∞∆°ng tr√¨nh v√† lu·ªìng ph√°t n·ªïi b·∫≠t",
        icon: Home,
        keywords: ["home", "trang chu", "trangchu", "main", "chinh", "noi bat"],
        action: () => {
          setActiveTab("home");
          triggerToast("Chuy·ªÉn ƒë·∫øn Home");
        },
      },
      {
        id: "live",
        title: "Live TV",
        category: "Sidebar",
        description: "Xem truy·ªÅn h√¨nh tr·ª±c ti·∫øp Live TV",
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
          triggerToast("Chuy·ªÉn ƒë·∫øn V-Play");
        },
      },
      {
        id: "vapps",
        title: "V-Apps",
        category: "Sidebar",
        description: "Kho ti·ªán √≠ch V-Apps, V-Arcade 5 tr√≤ ch∆°i, V-Files, V-Learn, V-Calc & V-Notes",
        icon: Grid,
        keywords: ["vapps", "v-apps", "apps", "arcade", "game", "tien ich", "v-arcade", "vstudy", "v-notes"],
        action: () => {
          setActiveTab("vapps");
          triggerToast("Chuy·ªÉn ƒë·∫øn V-Apps");
        },
      },
      {
        id: "vpremium",
        title: "V-Premium",
        category: "Sidebar",
        description: "Trung t√¢m V-Premium: G√≥i V-Cloud Storage, T√†i kho·∫£n V-Bank & Verified T√≠ch Xanh",
        icon: Crown,
        keywords: ["vpremium", "v-premium", "premium", "vip", "vbank", "storage", "verified", "cloud", "tich xanh"],
        action: () => {
          setActiveTab("vpremium");
          triggerToast("Chuy·ªÉn ƒë·∫øn V-Premium");
        },
      },
      {
        id: "news",
        title: "News",
        category: "Sidebar",
        description: "Th√¥ng b√°o s√°p nh·∫≠p Waves Community & tin m·ªõi Discord",
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
          triggerToast("Chuy·ªÉn ƒë·∫øn News");
        },
      },
      {
        id: "remote",
        title: "Chuy·ªÉn k√™nh",
        category: "Sidebar",
        description: "B√†n ƒëi·ªÅu khi·ªÉn k√™nh t·ª´ xa b·∫±ng b√†n ph√≠m s·ªë",
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
          triggerToast("M·ªü Chuy·ªÉn k√™nh");
        },
      },
      {
        id: "favorites",
        title: "Favorites",
        category: "Sidebar",
        description: "Danh s√°ch c√°c k√™nh b·∫°n ƒë√£ ƒë√°nh d·∫•u y√™u th√≠ch",
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
          triggerToast("M·ªü Favorites");
        },
      },
      {
        id: "multiview",
        title: "Multiview",
        category: "Sidebar",
        description: "Theo d√µi 2 ho·∫∑c nhi·ªÅu lu·ªìng c√πng m·ªôt l√∫c",
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
          triggerToast("M·ªü Multiview");
        },
      },
      {
        id: "toolbox",
        title: "Toolbox",
        category: "Sidebar",
        description: "B·ªô c√¥ng c·ª• m·ªü r·ªông v√† ti·ªán √≠ch k√™nh",
        icon: Package,
        keywords: ["toolbox", "cong cu", "tien ich", "mo rong", "file", "m3u"],
        action: () => {
          if (!sidebarExpanded && !isMobile) setSidebarExpanded(true);
          setSidebarFileOpen(true);
          triggerToast("M·ªü Toolbox");
        },
      },
      {
        id: "help",
        title: "Help",
        category: "Sidebar",
        description: "Tr·ª£ gi√∫p, h∆∞·ªõng d·∫´n s·ª≠ d·ª•ng v√† b√°o l·ªói",
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
          triggerToast("M·ªü Help");
        },
      },
      {
        id: "about",
        title: "About",
        category: "Sidebar",
        description: "Th√¥ng tin phi√™n b·∫£n, b·∫£n quy·ªÅn v√† Waves Community",
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
          triggerToast("M·ªü About");
        },
      },
      {
        id: "discord",
        title: "Join Waves on Discord",
        category: "Sidebar",
        description: "C·ªông ƒë·ªìng giao l∆∞u, watch party & h·ªó tr·ª£ k·ªπ thu·∫≠t",
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
          triggerToast("ƒêang m·ªü Waves Discord");
        },
      },
      {
        id: "settings",
        title: "C√†i ƒë·∫∑t",
        category: "Sidebar",
        description: "T√πy ch·ªânh giao di·ªán, t√¨m ki·∫øm, √¢m thanh v√† h·ªá th·ªëng",
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
          triggerToast("M·ªü C√†i ƒë·∫∑t");
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
        title: "V-Apps Hub (Kho ·ª©ng d·ª•ng & Ti·ªán √≠ch)",
        category: "V-Apps",
        subCategory: "Kho ·ª©ng d·ª•ng",
        badge: "V-Apps Hub",
        description: "Trung t√¢m ·ª©ng d·ª•ng V-Apps: 5 Games Ore UI, V-Files, Explore VN, V-Learn, V-Calc, V-Reminders, V-Notes, V-Furniture",
        icon: Grid,
        keywords: ["vapps", "v-apps", "kho ung dung", "tien ich", "app store", "he sinh thai vapps"],
        action: () => {
          navigateToVApp("v_arcade");
          triggerToast("M·ªü kho ·ª©ng d·ª•ng V-Apps");
        },
      },
      {
        id: "vapp-game-caro",
        title: "C·ªù Caro XO (Tic-Tac-Toe 3x3)",
        category: "V-Apps",
        subCategory: "V-Arcade Game",
        badge: "Game Caro XO",
        description: "ƒê√°nh X/O giao di·ªán Ore UI pixel art ƒë·∫•u NPC ng·∫´u nhi√™n ho·∫∑c 2 ng∆∞·ªùi ch∆°i",
        icon: Gamepad2,
        keywords: ["caro", "co caro", "tic tac toe", "xo", "game caro", "danh co", "varcade", "v-arcade", "game", "tro choi"],
        action: () => {
          navigateToVApp("v_arcade", "tic_tac_toe");
          triggerToast("Kh·ªüi ƒë·ªông C·ªù Caro XO (V-Arcade)");
        },
      },
      {
        id: "vapp-game-rps",
        title: "O·∫≥n T√π T√¨ (K√©o B√∫a Bao Ore UI)",
        category: "V-Apps",
        subCategory: "V-Arcade Game",
        badge: "Game O·∫≥n T√π T√¨",
        description: "Th·ª≠ v·∫≠n may v√† ph·∫£n x·∫° c√πng NPC v·ªõi 3 n∆∞·ªõc ƒëi K√©o, B√∫a, Bao kinh ƒëi·ªÉn",
        icon: Gamepad2,
        keywords: ["oan tu ti", "keo bua bao", "rock paper scissors", "bua keo bao", "game oan tu ti", "varcade", "v-arcade", "game"],
        action: () => {
          navigateToVApp("v_arcade", "rock_paper_scissors");
          triggerToast("Kh·ªüi ƒë·ªông O·∫≥n T√π T√¨ (V-Arcade)");
        },
      },
      {
        id: "vapp-game-wordchain",
        title: "N·ªëi T·ª´ Ti·∫øng Vi·ªát & Ti·∫øng Anh (Word Chain)",
        category: "V-Apps",
        subCategory: "V-Arcade Game",
        badge: "Game N·ªëi T·ª´",
        description: "Th·ª≠ th√°ch n·ªëi t·ª´ gh√©p Ti·∫øng Vi·ªát v√† k√Ω t·ª± Ti·∫øng Anh c√πng NPC b·∫°n b√®",
        icon: Gamepad2,
        keywords: ["noi tu", "word chain", "tieng viet", "tieng anh", "ghep tu", "game noi tu", "varcade", "v-arcade", "game"],
        action: () => {
          navigateToVApp("v_arcade", "word_chain");
          triggerToast("Kh·ªüi ƒë·ªông N·ªëi T·ª´ (V-Arcade)");
        },
      },
      {
        id: "vapp-game-counting",
        title: "ƒê·∫øm S·ªë 1 -> N (Ph√° Chu·ªói Reset)",
        category: "V-Apps",
        subCategory: "V-Arcade Game",
        badge: "Game ƒê·∫øm S·ªë",
        description: "ƒê·∫øm s·ªë ph·∫£n x·∫° li√™n t·ª•c t·ª´ 1 ƒë·∫øn N. Ai ƒë·∫øm sai s·∫Ω b·ªã ph√° chu·ªói v√† reset t·ª´ ƒë·∫ßu!",
        icon: Gamepad2,
        keywords: ["dem so", "counting game", "dem so 1 den n", "pha chuoi", "game dem so", "varcade", "v-arcade", "game"],
        action: () => {
          navigateToVApp("v_arcade", "counting_game");
          triggerToast("Kh·ªüi ƒë·ªông ƒê·∫øm S·ªë (V-Arcade)");
        },
      },
      {
        id: "vapp-game-snake",
        title: "R·∫Øn SƒÉn M·ªìi (Retro Snake Ore UI)",
        category: "V-Apps",
        subCategory: "V-Arcade Game",
        badge: "Game R·∫Øn SƒÉn M·ªìi",
        description: "ƒêi·ªÅu khi·ªÉn ch√∫ r·∫Øn ƒÉn m·ªìi n√¢ng ƒëi·ªÉm s·ªë v·ªõi b√†n ph√≠m ph√≠m b·∫•m D-Pad Ore UI",
        icon: Gamepad2,
        keywords: ["ran san moi", "snake", "retro snake", "game ran", "an moi", "ran", "varcade", "v-arcade", "game"],
        action: () => {
          navigateToVApp("v_arcade", "snake");
          triggerToast("Kh·ªüi ƒë·ªông R·∫Øn SƒÉn M·ªìi (V-Arcade)");
        },
      },
      {
        id: "vapp-files",
        title: "V-Files (Tr√¨nh qu·∫£n l√Ω t·ªáp tin V-Xplore)",
        category: "V-Apps",
        subCategory: "Ti·ªán √≠ch h·ªá th·ªëng",
        badge: "T·ªáp tin & M3U8",
        description: "Qu·∫£n l√Ω danh s√°ch k√™nh M3U8, xem tr∆∞·ªõc t·ªáp media v√† ƒë·ªìng b·ªô sao l∆∞u V-Cloud",
        icon: FolderOpen,
        keywords: ["v-files", "vfiles", "file explorer", "tep tin", "quan ly tep", "m3u8", "du lieu", "vxplore", "v-xplore"],
        action: () => {
          navigateToVApp("v_xplore");
          triggerToast("M·ªü tr√¨nh qu·∫£n l√Ω t·ªáp V-Files");
        },
      },
      {
        id: "vapp-explore-vn",
        title: "Explore Vietnam (B·∫£n ƒë·ªì 63 t·ªânh th√†nh & ·∫®m th·ª±c)",
        category: "V-Apps",
        subCategory: "Kh√°m ph√° vƒÉn h√≥a",
        badge: "63 T·ªânh Th√†nh VN",
        description: "B·∫£n ƒë·ªì t∆∞∆°ng t√°c 63 t·ªânh th√†nh, ƒë·ªãa danh du l·ªãch, ·∫©m th·ª±c ƒë·∫∑c s·∫Øc 3 mi·ªÅn B·∫Øc - Trung - Nam",
        icon: MapPin,
        keywords: ["explore vietnam", "viet nam", "63 tinh thanh", "am thuc", "ha noi", "da nang", "sai gon", "dia danh", "du lich", "kham pha"],
        action: () => {
          navigateToVApp("explore_vietnam");
          triggerToast("M·ªü Explore Vietnam (Kh√°m ph√° Vi·ªát Nam)");
        },
      },
      {
        id: "vapp-vlearn",
        title: "V-Learn / VStudy (Luy·ªán thi CEFR & Ng·ªØ VƒÉn)",
        category: "V-Apps",
        subCategory: "H·ªçc t·∫≠p & Gi√°o d·ª•c",
        badge: "CEFR & ƒê·ªÅ thi",
        description: "Kho t√†i li·ªáu h·ªçc t·∫≠p, luy·ªán thi Ti·∫øng Anh CEFR A1-C2 v√† ƒë·ªÅ thi Ng·ªØ VƒÉn THPT",
        icon: GraduationCap,
        keywords: ["v-learn", "vlearn", "vstudy", "hoc tap", "cefr", "tieng anh", "ngu van", "de thi", "trac nghiem", "tu vung"],
        action: () => {
          navigateToVApp("v_learn");
          triggerToast("M·ªü V-Learn / VStudy");
        },
      },
      {
        id: "vapp-vcalc",
        title: "V-Calc (M√°y t√≠nh & ƒê·ªïi ƒë∆°n v·ªã Ore UI)",
        category: "V-Apps",
        subCategory: "Ti·ªán √≠ch t√≠nh to√°n",
        badge: "M√°y t√≠nh Ore UI",
        description: "M√°y t√≠nh b·ªè t√∫i khoa h·ªçc, t√≠nh l√£i su·∫•t Ore V-Bank v√† ƒë·ªïi ƒë∆°n v·ªã ƒëo l∆∞·ªùng linh ho·∫°t",
        icon: Calculator,
        keywords: ["v-calc", "vcalc", "may tinh", "calculator", "tinh toan", "doi don vi", "khoa hoc", "lai suat"],
        action: () => {
          navigateToVApp("v_calc");
          triggerToast("M·ªü m√°y t√≠nh V-Calc");
        },
      },
      {
        id: "vapp-vreminders",
        title: "V-Reminders (Nh·∫Øc l·ªãch ph√°t s√≥ng TV & S·ª± ki·ªán)",
        category: "V-Apps",
        subCategory: "Qu·∫£n l√Ω th·ªùi gian",
        badge: "Nh·∫Øc vi·ªác & ƒê·∫øm ng∆∞·ª£c",
        description: "ƒê·∫∑t l·ªùi nh·∫Øc l·ªãch ph√°t s√≥ng ch∆∞∆°ng tr√¨nh TV y√™u th√≠ch, ƒë·∫øm ng∆∞·ª£c s·ª± ki·ªán quan tr·ªçng",
        icon: Bell,
        keywords: ["v-reminders", "vreminders", "nhac lich", "dem nguoc", "lich trinh", "su kien", "bao thuc", "hen gio"],
        action: () => {
          navigateToVApp("v_reminders");
          triggerToast("M·ªü V-Reminders");
        },
      },
      {
        id: "vapp-vnotes",
        title: "V-Notes (S·ªï tay ghi ch√∫ k√™nh TV & M3U8)",
        category: "V-Apps",
        subCategory: "Ghi ch√©p",
        badge: "S·ªï tay V-Notes",
        description: "L∆∞u tr·ªØ danh s√°ch k√™nh, ghi ch√©p c√° nh√¢n, ƒë√°nh d·∫•u lu·ªìng ph√°t TV ch·∫•t l∆∞·ª£ng cao",
        icon: StickyNote,
        keywords: ["v-notes", "vnotes", "ghi chu", "so tay", "notes", "luu kenh", "m3u8 notes", "ghi chep"],
        action: () => {
          navigateToVApp("v_notes");
          triggerToast("M·ªü s·ªï tay V-Notes");
        },
      },
      {
        id: "vapp-vfurniture",
        title: "V-Furniture (C·ª≠a h√†ng gia d·ª•ng & N·ªôi th·∫•t Ore)",
        category: "V-Apps",
        subCategory: "Mua s·∫Øm Ore",
        badge: "Gia d·ª•ng Ore",
        description: "Mua s·∫Øm b√†n gh·∫ø, thi·∫øt b·ªã gia d·ª•ng v√† ƒë·ªì d√πng trang tr√≠ online b·∫±ng Kho√°ng Th·∫°ch Ore",
        icon: Armchair,
        keywords: ["v-furniture", "vfurniture", "gia dung", "noi that", "mua sam", "ore", "ban ghe", "cua hang", "dien may"],
        action: () => {
          navigateToVApp("v_furniture");
          triggerToast("M·ªü c·ª≠a h√†ng gia d·ª•ng V-Furniture");
        },
      },
      {
        id: "vapp-vbox",
        title: "V-Box (Trung t√¢m gi·∫£i tr√≠ & Video Hub)",
        category: "V-Apps",
        subCategory: "Gi·∫£i tr√≠",
        badge: "Media Hub",
        description: "Trung t√¢m gi·∫£i tr√≠ t·ªïng h·ª£p video, phim ·∫£nh ƒëa n·ªÅn t·∫£ng cho Vplay",
        icon: Tv,
        keywords: ["v-box", "vbox", "giai tri", "video hub", "phim anh", "media", "clip"],
        action: () => {
          navigateToVApp("v_box");
          triggerToast("M·ªü V-Box Media Hub");
        },
      },
    ],
    [],
  );

  // Spotlight Items for V-Premium (V-Bank, V-Cloud Storage 50GB / 200GB / 2TB, Waves Verified T√≠ch Xanh)
  const spotlightVPremiumItems = useMemo(
    () => [
      {
        id: "vprem-suite",
        title: "V-Premium Suite (T·ªïng quan ƒë·∫∑c quy·ªÅn VIP)",
        category: "V-Premium",
        subCategory: "ƒê·∫∑c quy·ªÅn VIP",
        badge: "V-Premium VIP",
        description: "H·ªá sinh th√°i VIP: Ng√¢n h√†ng s·ªë V-Bank, V-Cloud Storage v√† Huy hi·ªáu Waves Verified",
        icon: Crown,
        keywords: ["vpremium", "v-premium", "premium", "vip", "dac quyen", "goi cuoc", "cao cap", "nang cap"],
        action: () => {
          navigateToVPremium("vbank");
          triggerToast("Chuy·ªÉn ƒë·∫øn V-Premium VIP Suite");
        },
      },
      {
        id: "vprem-vbank",
        title: "V-Bank (Ng√¢n h√†ng s·ªë & T√†i kho·∫£n Ore)",
        category: "V-Premium",
        subCategory: "Ng√¢n h√†ng s·ªë",
        badge: "Ng√¢n h√†ng V-Bank",
        description: "M·ªü t√†i kho·∫£n s·ªë ƒë·∫πp, chuy·ªÉn ti·ªÅn Kho√°ng Th·∫°ch Ore, g·ª≠i ti·∫øt ki·ªám nh·∫≠n l√£i su·∫•t",
        icon: Building2,
        keywords: ["v-bank", "vbank", "ngan hang", "tai khoan", "chuyen tien", "ore", "so dep", "tiet kiem", "lai suat", "sao ke"],
        action: () => {
          navigateToVPremium("vbank");
          triggerToast("M·ªü ng√¢n h√†ng s·ªë V-Bank");
        },
      },
      {
        id: "vprem-storage-hub",
        title: "V-Cloud Storage (Dung l∆∞·ª£ng ƒë√°m m√¢y Quota)",
        category: "V-Premium",
        subCategory: "ƒê√°m m√¢y l∆∞u tr·ªØ",
        badge: "V-Cloud Storage",
        description: "Qu·∫£n l√Ω dung l∆∞·ª£ng l∆∞u tr·ªØ Playlist M3U8, video offline v√† sao l∆∞u h·ªá th·ªëng",
        icon: Cloud,
        keywords: ["v-cloud", "storage", "dung luong", "dam may", "luu tru", "cloud", "quota", "sao luu", "bo nho"],
        action: () => {
          navigateToVPremium("storage");
          triggerToast("M·ªü qu·∫£n l√Ω dung l∆∞·ª£ng V-Cloud Storage");
        },
      },
      {
        id: "vprem-plan-50gb",
        title: "G√≥i V-Cloud Basic 50 GB (19.000ƒë / th√°ng)",
        category: "V-Premium",
        subCategory: "G√≥i c∆∞·ªõc Storage",
        badge: "G√≥i 50GB Basic",
        description: "50 GB ƒë√°m m√¢y l∆∞u tr·ªØ 50+ Playlist M3U8, ƒë·ªìng b·ªô ghi ch√∫ V-Notes v√† Badge ƒê·ªìng",
        icon: Cloud,
        keywords: ["50gb", "goi 50gb", "basic 50gb", "19k", "19.000", "storage basic", "goi tiet kiem", "cloud 50gb"],
        action: () => {
          navigateToVPremium("storage");
          triggerToast("Xem g√≥i V-Cloud Basic 50 GB");
        },
      },
      {
        id: "vprem-plan-200gb",
        title: "G√≥i V-Cloud Pro Ore 200 GB (69.000ƒë / th√°ng - Khuy√™n D√πng)",
        category: "V-Premium",
        subCategory: "G√≥i c∆∞·ªõc Storage",
        badge: "G√≥i 200GB Pro",
        description: "200 GB ƒë√°m m√¢y si√™u t·ªëc ƒë·ªô, l∆∞u video offline HD, Badge V-Bank Gold, x2 t·ªëc ƒë·ªô ph√°t",
        icon: Cloud,
        keywords: ["200gb", "goi 200gb", "pro 200gb", "69k", "69.000", "storage pro", "khuyen dung", "popular", "cloud 200gb"],
        action: () => {
          navigateToVPremium("storage");
          triggerToast("Xem g√≥i V-Cloud Pro Ore 200 GB");
        },
      },
      {
        id: "vprem-plan-2tb",
        title: "G√≥i V-Cloud Diamond 2.000 GB / 2 TB (225.000ƒë / th√°ng)",
        category: "V-Premium",
        subCategory: "G√≥i c∆∞·ªõc Storage",
        badge: "G√≥i 2TB Diamond",
        description: "2 TB VIP kh√¥ng gi·ªõi h·∫°n, t·∫∑ng k√®m Waves Verified T√≠ch Xanh tr·ªçn ƒë·ªùi, t·∫£i 4K HDR",
        icon: Crown,
        keywords: ["2tb", "2000gb", "diamond", "225k", "225.000", "storage 2tb", "vip diamond", "tich xanh tron doi", "cloud 2tb"],
        action: () => {
          navigateToVPremium("storage");
          triggerToast("Xem g√≥i V-Cloud Diamond 2 TB");
        },
      },
      {
        id: "vprem-verified",
        title: "Waves Verified (Huy hi·ªáu T√≠ch Xanh ch√≠nh ch·ªß)",
        category: "V-Premium",
        subCategory: "X√°c minh & Uy t√≠n",
        badge: "T√≠ch Xanh Verified",
        description: "X√°c th·ª±c t√†i kho·∫£n ch√≠nh ch·ªß, m·ªü kh√≥a bi·ªÉu t∆∞·ª£ng t√≠ch xanh danh gi√° v√† ph√≤ng ch·ªù VIP",
        icon: BadgeCheck,
        keywords: ["verified", "tich xanh", "xac minh", "chinh chu", "huy hieu", "badge check", "vip badge", "uy tin"],
        action: () => {
          navigateToVPremium("verified");
          triggerToast("M·ªü trung t√¢m x√°c minh Waves Verified");
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
        title: "Xem lu·ªìng qua URL",
        category: "Toolbox",
        description: "Ph√°t tr·ª±c ti·∫øp link HLS (.m3u8) b·∫•t k·ª≥",
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
          triggerToast("M·ªü Xem lu·ªìng qua URL");
        },
      },
      {
        id: "tb-custom-channel",
        title: "Th√™m lu·ªìng k√™nh",
        category: "Toolbox",
        description: "Th√™m k√™nh t√πy bi·∫øn c√° nh√¢n v√†o ·ª©ng d·ª•ng",
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
          triggerToast("M·ªü Th√™m lu·ªìng k√™nh");
        },
      },
      {
        id: "tb-import-m3u",
        title: "Nh·∫≠p file m3u/m3u8",
        category: "Toolbox",
        description: "T·∫£i danh s√°ch k√™nh t·ª´ file playlist M3U",
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
          triggerToast("Ch·ªçn file M3U");
        },
      },
      {
        id: "tb-export-m3u",
        title: "Xu·∫•t file m3u/m3u8",
        category: "Toolbox",
        description: "T·∫£i v·ªÅ danh s√°ch k√™nh ƒë·ªãnh d·∫°ng M3U",
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
          triggerToast("Xu·∫•t file M3U");
        },
      },
      {
        id: "tb-multiview",
        title: "Ch·∫ø ƒë·ªô Multiview",
        category: "Toolbox",
        description: "Xem ƒë·ªìng th·ªùi 2-4 k√™nh tr√™n c√πng m√†n h√¨nh",
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
          triggerToast("M·ªü Ch·∫ø ƒë·ªô Multiview");
        },
      },
      {
        id: "tb-pip",
        title: "Picture in Picture (PiP)",
        category: "Toolbox",
        description: "B·∫≠t ch·∫ø ƒë·ªô xem video trong c·ª≠a s·ªï n·ªïi thu nh·ªè",
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
            triggerToast("Tr√¨nh duy·ªát kh√¥ng h·ªó tr·ª£ PiP");
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
        title: "C√†i ƒë·∫∑t Giao di·ªán",
        category: "C√†i ƒë·∫∑t",
        description: "T√πy bi·∫øn Header bar, AMOLED Dark, m√†u n·ªÅn v√† thanh Dock",
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
          triggerToast("M·ªü C√†i ƒë·∫∑t Giao di·ªán");
        },
      },
      {
        id: "set-headerbar",
        title: "Header bar",
        category: "C√†i ƒë·∫∑t",
        description: "B·∫≠t/t·∫Øt thanh Header bar tr·∫Øng c·ªë ƒë·ªãnh ·ªü ƒë·ªânh m√†n h√¨nh",
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
          triggerToast("C√†i ƒë·∫∑t Header bar");
        },
      },
      {
        id: "set-glow",
        title: "M√†u s·∫Øc √°nh s√°ng n·ªÅn (Backdrop Glow)",
        category: "C√†i ƒë·∫∑t",
        description:
          "T√πy ch·ªçn hi·ªáu ·ª©ng Cosmic Glow, T·ªëi gi·∫£n, C·ª±c quang, Sunset",
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
          triggerToast("C√†i ƒë·∫∑t √Ånh s√°ng n·ªÅn");
        },
      },
      {
        id: "set-amoled",
        title: "Ch·∫ø ƒë·ªô AMOLED Dark",
        category: "C√†i ƒë·∫∑t",
        description:
          "S·ª≠ d·ª•ng n·ªÅn ƒëen tuy·ªát ƒë·ªëi gi√∫p ti·∫øt ki·ªám pin cho m√†n h√¨nh OLED",
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
          triggerToast("C√†i ƒë·∫∑t AMOLED Dark");
        },
      },
      {
        id: "set-dock-sidebar",
        title: "Chuy·ªÉn Dock th√†nh Sidebar",
        category: "C√†i ƒë·∫∑t",
        description:
          "Chuy·ªÉn thanh ƒëi·ªÅu h∆∞·ªõng d∆∞·ªõi c√πng sang thanh Sidebar b√™n tr√°i",
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
          triggerToast("C√†i ƒë·∫∑t V·ªã tr√≠ thanh ƒëi·ªÅu h∆∞·ªõng");
        },
      },
      {
        id: "set-dock-customizer",
        title: "T√πy bi·∫øn thanh ƒëi·ªÅu h∆∞·ªõng Dock",
        category: "C√†i ƒë·∫∑t",
        description: "S·∫Øp x·∫øp, ·∫©n hi·ªán c√°c n√∫t tr√™n thanh Dock",
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
          triggerToast("T√πy bi·∫øn thanh Dock");
        },
      },
      {
        id: "set-search-group",
        title: "C√†i ƒë·∫∑t T√¨m ki·∫øm",
        category: "C√†i ƒë·∫∑t",
        description:
          "T√πy ch·ªânh c√°c danh m·ª•c k·∫øt qu·∫£ hi·ªÉn th·ªã trong Spotlight Search",
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
          triggerToast("M·ªü C√†i ƒë·∫∑t T√¨m ki·∫øm");
        },
      },
      {
        id: "set-accessibility",
        title: "C√†i ƒë·∫∑t Tr·ª£ nƒÉng",
        category: "C√†i ƒë·∫∑t",
        description: "ƒêi·ªÅu ch·ªânh t·ª± ƒë·ªông tr∆∞·ª£t banner v√† t∆∞∆°ng t√°c menu",
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
          triggerToast("M·ªü C√†i ƒë·∫∑t Tr·ª£ nƒÉng");
        },
      },
      {
        id: "set-auto-slide",
        title: "T·ª± ƒë·ªông tr∆∞·ª£t h√¨nh Banner",
        category: "C√†i ƒë·∫∑t",
        description: "Banner h√¨nh ·∫£nh ·ªü trang ch·ªß t·ª± ƒë·ªông tr∆∞·ª£t sau m·ªói 5 gi√¢y",
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
          triggerToast("C√†i ƒë·∫∑t T·ª± ƒë·ªông tr∆∞·ª£t banner");
        },
      },
      {
        id: "set-auto-hide",
        title: "T·ª± ƒë·ªông ·∫©n Sidebar",
        category: "C√†i ƒë·∫∑t",
        description: "T·ª± ƒë·ªông thu g·ªçn thanh menu khi kh√¥ng di chu·ªôt v√†o",
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
          triggerToast("C√†i ƒë·∫∑t T·ª± ƒë·ªông ·∫©n Sidebar");
        },
      },
      {
        id: "set-plugins",
        title: "C·ª≠a h√†ng ti·ªán √≠ch (Plugin Store)",
        category: "C√†i ƒë·∫∑t",
        description: "C√†i ƒë·∫∑t v√† g·ª° b·ªè c√°c g√≥i ti·ªán √≠ch m·ªü r·ªông",
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
          triggerToast("M·ªü C·ª≠a h√†ng ti·ªán √≠ch");
        },
      },
      {
        id: "set-dev",
        title: "T√πy ch·ªçn nh√† ph√°t tri·ªÉn (Design Components)",
        category: "C√†i ƒë·∫∑t",
        description: "Ki·ªÉm tra h·ªá th·ªëng ng√¥n ng·ªØ thi·∫øt k·∫ø v√† th√†nh ph·∫ßn UI",
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
          triggerToast("M·ªü T√πy ch·ªçn nh√† ph√°t tri·ªÉn");
        },
      },
      {
        id: "set-about",
        title: "V·ªÅ Waves Community",
        category: "C√†i ƒë·∫∑t",
        description: "Th√¥ng tin phi√™n b·∫£n, b·∫£n quy·ªÅn v√† ƒë·ªôi ng≈© ph√°t tri·ªÉn",
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
          triggerToast("M·ªü V·ªÅ Waves Community");
        },
      },
      {
        id: "set-reload",
        title: "T·∫£i l·∫°i ·ª©ng d·ª•ng (Reload App)",
        category: "C√†i ƒë·∫∑t",
        description: "L√†m m·ªõi v√† n·∫°p l·∫°i to√†n b·ªô trang web",
        icon: RefreshCw,
        keywords: ["reload app", "tai lai", "lam moi", "refresh", "cai dat"],
        action: () => {
          window.location.reload();
        },
      },
      {
        id: "set-reset",
        title: "Kh√¥i ph·ª•c c√†i ƒë·∫∑t g·ªëc (Factory Reset)",
        category: "C√†i ƒë·∫∑t",
        description: "X√≥a to√†n b·ªô d·ªØ li·ªáu t·∫°m v√† ƒë∆∞a v·ªÅ c·∫•u h√¨nh ban ƒë·∫ßu",
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
        title: "G·ª≠i ph·∫£n h·ªìi / B√°o l·ªói",
        category: "C√†i ƒë·∫∑t",
        description: "ƒê√≥ng g√≥p √Ω ki·∫øn v√† ph·∫£n h·ªìi ch·∫•t l∆∞·ª£ng k√™nh",
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

    // 1. Matched Tabs & Navigation (Danh m·ª•c)
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

    // 3. Matched V-Premium (G√≥i V-Cloud Storage 50GB / 200GB / 2TB, V-Bank, Verified T√≠ch Xanh)
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

    // 5. Matched Settings (C√†i ƒë·∫∑t)
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

    // 6. Matched News (Tin t·ª©c)
    let news: typeof NEWS_LIST = [];
    if (spotlightSearchSettings.news) {
      news = NEWS_LIST.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q) ||
          (item.fullContent && item.fullContent.toLowerCase().includes(q)),
      );
    }

    // 7. Matched Channels (Truy·ªÅn h√¨nh & S·ªë hi·ªáu k√™nh)
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
      const numMatch = q.match(/(?:k√™nh|kenh|ch|#|s·ªë|so)?\s*(\d+)/i);
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
          Nh·∫≠p t·ª´ kh√≥a t√¨m ki·∫øm V-Apps, Games V-Arcade, V-Premium, Ti·ªán √≠ch ho·∫∑c K√™nh TV...
        </div>
      );
    }

    if (total === 0) {
      return (
        <div className="px-3 py-4 text-center text-xs text-white/50 font-sans">
          Kh√¥ng t√¨m th·∫•y k·∫øt qu·∫£ n√†o ph√π h·ª£p v·ªõi &quot;{q}&quot;
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1">
        {/* 1. TABS & NAVIGATION (DANH M·ª§C) */}
        {navTabs.length > 0 && (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between px-2.5 pt-1.5 pb-0.5 text-[10px] font-extrabold tracking-wider text-rose-400 uppercase font-montserrat select-none">
              <span className="flex items-center gap-1.5">
                <span>Danh m·ª•c & ƒêi·ªÅu h∆∞·ªõng</span>
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
                    ƒê·∫æN
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
                <span>V-Apps & 5 Tr√≤ Ch∆°i Ore UI</span>
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
                    {isGame ? "CH∆†I NGAY" : "M·ªû APP"}
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
                      ? "GIAO D·ªäCH"
                      : item.id === "vprem-verified"
                      ? "X√ÅC MINH"
                      : item.subCategory.includes("G√≥i c∆∞·ªõc")
                      ? "XEM G√ìI"
                      : "M·ªû VIP"}
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
                <span>Toolbox & Ti·ªán √≠ch</span>
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
                    M·ªû
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 5. C√ÄI ƒê·∫∂T (SETTINGS) */}
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
                <span>C√†i ƒë·∫∑t h·ªá th·ªëng</span>
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
                    C·∫§U H√åNH
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
                <span>Tin t·ª©c & Th√¥ng b√°o</span>
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
                  triggerToast(`M·ªü tin t·ª©c: ${item.title}`);
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
                <span>K√™nh truy·ªÅn h√¨nh</span>
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
                  PH√ÅT
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
              TH·ªúI GIAN C√íN L·∫†I
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
                      ? "ƒê√£ b·∫≠t: Chuy·ªÉn Dock th√†nh Sidebar b√™n tr√°i"
                      : "ƒê√£ t·∫Øt: Chuy·ªÉn Sidebar th√†nh Dock d∆∞·ªõi",
                  );
                }}
                className="w-3.5 h-3.5 rounded-full bg-[#27c93f] active:bg-[#1f9a30] border border-[#1aab29] flex items-center justify-center cursor-pointer active:scale-90 transition-all duration-150"
                aria-label="Chuy·ªÉn Dock th√†nh Sidebar b√™n tr√°i"
              >
                <PanelLeft className="w-2 h-2 text-[#003808] stroke-[3] opacity-0 group-hover/tl:opacity-100 transition-opacity" />
              </button>
              {/* Glassmorphism Tooltip (Larger, 100% Rounded, No Animation) */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 px-3.5 py-1.5 rounded-full bg-[#18161e]/90 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] text-xs font-semibold text-white whitespace-nowrap hidden group-hover/tl:block pointer-events-none z-50">
                {dockToSidebar
                  ? "T·∫Øt Sidebar (chuy·ªÉn v·ªÅ Dock)"
                  : "Chuy·ªÉn Dock th√†nh Sidebar"}
              </div>
            </div>
          </div>

          {/* Center: Title in Montserrat bold font */}
          <div className="font-extrabold text-[12px] sm:text-[13px] tracking-widest text-white/95 uppercase font-montserrat text-center px-2 truncate">
            {getHeaderTitle()}
          </div>

          {/* Right: Spotlight Search button & Dropdown */}
          <div className="relative flex items-center gap-1 group/search">
            <button
              type="button"
              onClick={() => {
                playPopSound();
                if (isSpotlightAllDisabled) {
                  setShowSpotlightDisabledModal(true);
                  return;
                }
                setIsHeaderSearchExpanded(!isHeaderSearchExpanded);
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

            {/* Glassmorphism Tooltip for Spotlight Search (Larger, 100% Rounded, No Animation) */}
            {!isHeaderSearchExpanded && (
              <div className="absolute top-full right-0 mt-2.5 px-3.5 py-1.5 rounded-full bg-[#18161e]/90 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] text-xs font-semibold text-white whitespace-nowrap hidden group-hover/search:block pointer-events-none z-50">
                Spotlight Search
              </div>
            )}

            {/* Spotlight Search Dropdown Menu */}
            {isHeaderSearchExpanded && (
              <>
                {/* Backdrop overlay */}
                <div
                  className="fixed inset-0 z-[105]"
                  onClick={() => setIsHeaderSearchExpanded(false)}
                />

                <div className="absolute right-0 top-10 z-[110] w-[300px] sm:w-[360px] rounded-2xl bg-[#141218]/95 backdrop-blur-2xl border border-white/15 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.6)] text-white font-sans animate-fade-in space-y-2.5">
                  {/* Search input field */}
                  <div className="relative flex items-center w-full">
                    <input
                      ref={headerSearchInputRef}
                      type="text"
                      placeholder="Spotlight Search..."
                      value={menubarSearchQuery}
                      onChange={(e) => setMenubarSearchQuery(e.target.value)}
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
                    {menubarSearchQuery ? (
                      <button
                        type="button"
                        onClick={() => setMenubarSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-none cursor-pointer bouncy-btn"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    ) : (
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
                            triggerToast("ƒêang l·∫Øng nghe...");
                            recognition.start();
                            recognition.onresult = (event: any) => {
                              const speechResult =
                                event.results[0][0].transcript;
                              setMenubarSearchQuery((prev) => {
                                const prefix = prev.trim() ? prev + " " : "";
                                return prefix + speechResult;
                              });
                              triggerToast("ƒê√£ nh·∫≠p: " + speechResult);
                            };
                            recognition.onerror = (event: any) => {
                              triggerToast("L·ªói: " + event.error);
                            };
                          } else {
                            triggerToast(
                              "Tr√¨nh duy·ªát kh√¥ng h·ªó tr·ª£ nh·∫≠n di·ªán gi·ªçng n√≥i",
                            );
                          }
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white hover:text-white/80 transition-none cursor-pointer bouncy-btn"
                        title="T√¨m ki·∫øm b·∫±ng gi·ªçng n√≥i"
                      >
                        <Mic className="w-3.5 h-3.5 text-white shrink-0" />
                      </button>
                    )}
                  </div>

                  {/* Search Results / Suggestions inside Dropdown Menu */}
                  <div className="max-h-64 overflow-y-auto flex flex-col gap-1 custom-scrollbar pr-1">
                    {renderSpotlightUnifiedResults(() =>
                      setIsHeaderSearchExpanded(false),
                    )}
                  </div>
                </div>
              </>
            )}
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
                      title="ƒê√≥ng Sidebar"
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
                        title="Thu nh·ªè Sidebar"
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
                        title="M·ªü r·ªông Sidebar"
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
                      <div key="sidebar-search-spotlight" className="space-y-1">
                        <div className="relative flex flex-col gap-2 w-full">
                          <div className="relative flex items-center w-full">
                            <input
                              ref={sidebarSearchRef}
                              type="text"
                              placeholder="Spotlight Search..."
                              value={menubarSearchQuery}
                              onChange={(e) => {
                                setMenubarSearchQuery(e.target.value);
                              }}
                              onFocus={() => {
                                if (isSpotlightAllDisabled) {
                                  setShowSpotlightDisabledModal(true);
                                  return;
                                }
                                setIsSpotlightFocused(true);
                              }}
                              onClick={() => {
                                if (isSpotlightAllDisabled) {
                                  setShowSpotlightDisabledModal(true);
                                }
                              }}
                              onBlur={() => {
                                setTimeout(() => {
                                  setIsSpotlightFocused(false);
                                }, 250);
                              }}
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
                            {menubarSearchQuery ? (
                              <button
                                type="button"
                                onClick={() => setMenubarSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-none cursor-pointer bouncy-btn"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            ) : (
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
                                    triggerToast("ƒêang l·∫Øng nghe...");
                                    recognition.start();
                                    recognition.onresult = (event: any) => {
                                      const speechResult =
                                        event.results[0][0].transcript;
                                      setMenubarSearchQuery((prev) => {
                                        const prefix = prev.trim()
                                          ? prev + " "
                                          : "";
                                        return prefix + speechResult;
                                      });
                                      triggerToast("ƒê√£ nh·∫≠p: " + speechResult);
                                    };
                                    recognition.onerror = (event: any) => {
                                      triggerToast("L·ªói: " + event.error);
                                    };
                                  } else {
                                    triggerToast(
                                      "Tr√¨nh duy·ªát kh√¥ng h·ªó tr·ª£ nh·∫≠n di·ªán gi·ªçng n√≥i",
                                    );
                                  }
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white hover:text-white/80 transition-none cursor-pointer bouncy-btn"
                                title="T√¨m ki·∫øm b·∫±ng gi·ªçng n√≥i"
                              >
                                <Mic className="w-3.5 h-3.5 text-white shrink-0" />
                              </button>
                            )}
                          </div>
                          {(isSpotlightFocused ||
                            menubarSearchQuery.trim() !== "") && (
                            <div className="max-h-64 overflow-y-auto flex flex-col gap-1 custom-scrollbar pr-1 mt-1 bg-black/40 p-1.5 rounded-xl border border-white/5">
                              {renderSpotlightUnifiedResults(
                                () => setIsSpotlightFocused(false),
                                true,
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div
                        key="sidebar-search-spotlight-collapsed"
                        className="space-y-1"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (isSpotlightAllDisabled) {
                              setShowSpotlightDisabledModal(true);
                              return;
                            }
                            setSidebarExpanded(true);
                            setIsSpotlightFocused(true);
                            setTimeout(() => {
                              sidebarSearchRef.current?.focus();
                            }, 150);
                          }}
                          className={`h-10 w-full relative flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer group/sidebar select-none box-border ${
                            isSpotlightFocused ||
                            menubarSearchQuery.trim() !== ""
                              ? "bg-[#d946ef] text-white font-bold shadow-lg shadow-fuchsia-500/25 border border-white/20"
                              : "border border-transparent text-white/75 hover:text-white hover:bg-[#d946ef]"
                          }`}
                        >
                          <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#121116] border border-white/10 text-white text-xs font-sans font-medium rounded-lg opacity-0 scale-95 pointer-events-none group-hover/sidebar:opacity-100 group-hover/sidebar:scale-100 transition-none shadow-xl whitespace-nowrap z-50">
                            Spotlight Search
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
                                      triggerToast("Vui l√≤ng ch·ªçn 1 k√™nh");
                                    }
                                  }}
                                  className="w-full text-left text-xs font-medium px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2.5 cursor-pointer"
                                >
                                  <ThumbsUp
                                    className={`w-3.5 h-3.5 ${selectedChannel && isFavorite(selectedChannel.id) ? "text-red-500 fill-red-500" : "text-white/70"}`}
                                  />
                                  <span>Th√™m v√†o y√™u th√≠ch</span>
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
                                        "ƒê√£ m·ªü lu·ªìng g·ªëc " +
                                          selectedChannel.name,
                                      );
                                    } else {
                                      triggerToast("Vui l√≤ng ch·ªçn 1 k√™nh");
                                    }
                                  }}
                                  className="w-full text-left text-xs font-medium px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2.5 cursor-pointer"
                                >
                                  <ExternalLink className="w-3.5 h-3.5 text-white/70" />
                                  <span>M·ªü lu·ªìng g·ªëc</span>
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
                                        "ƒê√£ sao ch√©p li√™n k·∫øt chia s·∫ª",
                                      );
                                    } else {
                                      triggerToast("Vui l√≤ng ch·ªçn 1 k√™nh");
                                    }
                                  }}
                                  className="w-full text-left text-xs font-medium px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2.5 cursor-pointer"
                                >
                                  <Share2 className="w-3.5 h-3.5 text-white/70" />
                                  <span>Chia s·∫ª</span>
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
                                  <span>Ch·∫ø ƒë·ªô Multiview</span>
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
                                      `Ph√°t k√™nh y√™u th√≠ch: ${ch.name}`,
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
                                    Ph√°t
                                  </span>
                                </button>
                              ))
                            ) : (
                              <span className="text-[11px] text-white/40 italic pl-5">
                                Ch∆∞a c√≥ k√™nh y√™u th√≠ch
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
                              triggerToast("M·ªü: Xem lu·ªìng k√™nh qua URL");
                            }}
                            className="w-full text-left text-xs font-medium pl-5 pr-2.5 py-1.5 border-l-2 transition-all flex items-center gap-2 border-transparent text-white/70 hover:text-red-400 hover:border-red-400 group cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 text-white group-hover:text-red-400 shrink-0" />
                            <span>Xem lu·ªìng qua URL</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowCustomModal(true);
                              triggerToast("M·ªü: Th√™m lu·ªìng k√™nh");
                            }}
                            className="w-full text-left text-xs font-medium pl-5 pr-2.5 py-1.5 border-l-2 transition-all flex items-center gap-2 border-transparent text-white/70 hover:text-red-400 hover:border-red-400 group cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-white group-hover:text-red-400 shrink-0" />
                            <span>Th√™m lu·ªìng k√™nh</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              fileInputRef.current?.click();
                              triggerToast("M·ªü: Ch·ªçn file M3U");
                            }}
                            className="w-full text-left text-xs font-medium pl-5 pr-2.5 py-1.5 border-l-2 transition-all flex items-center gap-2 border-transparent text-white/70 hover:text-red-400 hover:border-red-400 group cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5 text-white group-hover:text-red-400 shrink-0" />
                            <span>Nh·∫≠p file m3u/m3u8</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleM3uExport();
                              triggerToast("Xu·∫•t: Xu·∫•t file M3U");
                            }}
                            className="w-full text-left text-xs font-medium pl-5 pr-2.5 py-1.5 border-l-2 transition-all flex items-center gap-2 border-transparent text-white/70 hover:text-red-400 hover:border-red-400 group cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-white group-hover:text-red-400 shrink-0" />
                            <span>Xu·∫•t file m3u/m3u8</span>
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
                        triggerToast("M·ªü: V·ªÅ Waves Community");
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
                        triggerToast("ƒêang m·ªü Waves Community Discord");
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
                        triggerToast("M·ªü: C√†i ƒë·∫∑t");
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
                          C√†i ƒë·∫∑t
                        </div>
                      )}
                      <Settings className="w-4.5 h-4.5 text-white transition-none stroke-[1.8]" />
                      {(sidebarExpanded || isMobile) && (
                        <span className="text-xs font-semibold tracking-wide font-sans pl-3.5 flex-1 text-left">
                          C√†i ƒë·∫∑t
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
                  <span>C·ª≠a h√†ng ti·ªán √≠ch</span>
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
                  <span>C√†i ƒë·∫∑t</span>
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
                  <span>Xem lu·ªìng k√™nh qua URL</span>
                </button>
                <button
                  onClick={() => {
                    setShowCustomModal(true);
                    setActiveMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-[13px] hover:bg-white/10 font-sans font-normal transition-colors flex items-center gap-2.5 text-white/90"
                >
                  <Plus className="w-4 h-4 text-sky-300" />
                  <span>Th√™m lu·ªìng k√™nh</span>
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
                  <span>Nh·∫≠p file m3u/m3u8</span>
                </button>
                <button
                  onClick={() => {
                    handleM3uExport();
                    setActiveMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-[13px] hover:bg-white/10 font-sans font-normal transition-colors flex items-center gap-2.5 text-white/90"
                >
                  <Download className="w-4 h-4 text-teal-300" />
                  <span>Xu·∫•t file m3u/m3u8</span>
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
                  <span>M·ªü c·ª≠a h√†ng ti·ªán √≠ch</span>
                </button>
                <div className="border-t border-white/10 my-1.5" />
                <div className="px-4 py-1 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                  Ti·ªán √≠ch ƒë√£ c√†i ƒë·∫∑t
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
                            ? "Xu·∫•t lu·ªìng"
                            : id === "multiview"
                              ? "Multiview"
                              : id === "open_native"
                                ? "M·ªü lu·ªìng g·ªëc"
                                : id === "quick_switch"
                                  ? "Chuy·ªÉn nhanh"
                                  : id === "add_custom"
                                    ? "Th√™m k√™nh m·ªõi"
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
                    Ch∆∞a c√†i ƒë·∫∑t ti·ªán √≠ch n√†o
                  </div>
                )}
                <div className="border-t border-white/10 my-1.5" />
                <div className="px-4 py-1 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                  Ti·ªán √≠ch c√≥ s·∫µn
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
                          ? "Xu·∫•t lu·ªìng"
                          : id === "multiview"
                            ? "Multiview"
                            : id === "open_native"
                              ? "M·ªü lu·ªìng g·ªëc"
                              : id === "quick_switch"
                                ? "Chuy·ªÉn nhanh"
                                : id === "add_custom"
                                  ? "Th√™m k√™nh m·ªõi"
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
                  K√™nh y√™u th√≠ch
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
                          Ph√°t
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-2.5 text-[12.5px] text-white/45 italic font-sans font-normal leading-normal">
                    Th√™m m·ªôt v√†i k√™nh v√†o danh s√°ch y√™u th√≠ch ƒë·ªÉ hi·ªÉn th·ªã ·ªü ƒë√¢y.
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
                    <span>C√†i ƒë·∫∑t V-Intelligence</span>
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
                        title="Ph√≥ng to cu·ªôc tr√≤ chuy·ªán"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full pl-3.5 pr-1.5 py-1 focus-within:border-[2.5px] focus-within:border-[#38bdf8] focus-within:ring-[3px] focus-within:ring-[#38bdf8]/30 transition-none">
                      <input
                        type="text"
                        placeholder="H·ªèi V-Intelligence..."
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
                            triggerToast("ƒêang l·∫Øng nghe...");
                            recognition.start();
                            recognition.onresult = (event: any) => {
                              const speechResult =
                                event.results[0][0].transcript;
                              setQuickChatInput((prev) => {
                                const prefix = prev.trim() ? prev + " " : "";
                                return prefix + speechResult;
                              });
                              triggerToast("ƒê√£ nh·∫≠p: " + speechResult);
                            };
                            recognition.onerror = (event: any) => {
                              triggerToast("L·ªói: " + event.error);
                            };
                          } else {
                            triggerToast(
                              "Tr√¨nh duy·ªát kh√¥ng h·ªó tr·ª£ nh·∫≠n di·ªán gi·ªçng n√≥i",
                            );
                          }
                        }}
                        className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-teal-400 hover:text-teal-300 transition-all cursor-pointer shrink-0 bouncy-btn"
                        title="Nh·∫≠p b·∫±ng gi·ªçng n√≥i"
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
                <span>√Çm l∆∞·ª£ng</span>
                <span className="font-mono text-[10px] text-white/60">
                  {muted ? "T·∫Øt ti·∫øng" : `${Math.round(volume * 100)}%`}
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
                    <span>B·∫≠t √¢m thanh</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-rose-400" />
                    <span>T·∫Øt √¢m thanh</span>
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
                  title="Quay l·∫°i"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                </button>
                <span className="text-white font-semibold text-xs sm:text-sm tracking-tight">
                  {activeSettingSection === "appearance" && "Giao di·ªán"}
                  {activeSettingSection === "search" && "T√¨m ki·∫øm"}
                  {activeSettingSection === "profile" && "T√†i kho·∫£n & D·ªØ li·ªáu"}
                  {activeSettingSection === "accessibility" && "Tr·ª£ nƒÉng"}
                  {activeSettingSection === "broadcast" && "Ph√°t s√≥ng"}
                  {activeSettingSection === "experimental" &&
                    "Th·ª≠ nghi·ªám & T√≠nh nƒÉng m·ªõi"}
                  {activeSettingSection === "design_system" &&
                    "Design components"}
                  {activeSettingSection === "plugin_store" &&
                    "C·ª≠a h√†ng ti·ªán √≠ch"}
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
                                <span>Xem lu·ªìng k√™nh qua URL</span>
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
                                <span>Th√™m lu·ªìng k√™nh</span>
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
                                <span>Nh·∫≠p file m3u/m3u8</span>
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
                                <span>Xu·∫•t file m3u/m3u8</span>
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
                                <span>M·ªü c·ª≠a h√†ng ti·ªán √≠ch</span>
                              </button>
                              <div className="border-t border-white/10 mx-1.5 my-1.5" />
                              <div className="px-7 py-1 text-[10px] font-bold text-white/40 uppercase tracking-wider select-none">
                                Ti·ªán √≠ch ƒë√£ c√†i ƒë·∫∑t
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
                                          ? "Xu·∫•t lu·ªìng"
                                          : id === "multiview"
                                            ? "Multiview"
                                            : id === "open_native"
                                              ? "M·ªü lu·ªìng g·ªëc"
                                              : id === "quick_switch"
                                                ? "Chuy·ªÉn nhanh"
                                                : id === "add_custom"
                                                  ? "Th√™m k√™nh m·ªõi"
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
                                  Ch∆∞a c√†i ƒë·∫∑t ti·ªán √≠ch n√†o
                                </div>
                              )}
                              <div className="border-t border-white/10 mx-1.5 my-1.5" />
                              <div className="px-7 py-1 text-[10px] font-bold text-white/40 uppercase tracking-wider select-none">
                                Ti·ªán √≠ch c√≥ s·∫µn
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
                                          ? "Xu·∫•t lu·ªìng"
                                          : id === "multiview"
                                            ? "Multiview"
                                            : id === "open_native"
                                              ? "M·ªü lu·ªìng g·ªëc"
                                              : id === "quick_switch"
                                                ? "Chuy·ªÉn nhanh"
                                                : id === "add_custom"
                                                  ? "Th√™m k√™nh m·ªõi"
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
                                  Kh√¥ng c√≤n ti·ªán √≠ch n√†o c√≥ s·∫µn
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
                                K√™nh y√™u th√≠ch
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
                                        Ph√°t
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div className="px-7 py-3 text-[13px] text-white/40 font-google font-normal leading-normal select-none">
                                  Th√™m m·ªôt v√†i k√™nh v√†o danh s√°ch y√™u th√≠ch ƒë·ªÉ
                                  hi·ªÉn th·ªã ·ªü ƒë√¢y.
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
                title="H·ªá th·ªëng"
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
                        <span>Ch·∫ø ƒë·ªô ng·ªß (Sleep)</span>
                      </button>

                      <button
                        onClick={() => {
                          window.location.reload();
                        }}
                        className="mx-1.5 px-4 py-2.5 rounded-2xl text-xs hover:bg-white/10 active:bg-white/15 text-white/90 hover:text-white font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>Kh·ªüi ƒë·ªông l·∫°i (Reload)</span>
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
                        <span>Kh√¥i ph·ª•c c√†i ƒë·∫∑t g·ªëc</span>
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
                  if (isSpotlightAllDisabled) {
                    setShowSpotlightDisabledModal(true);
                    return;
                  }
                  setShowSearchDropdown(!showSearchDropdown);
                  setShowPowerDropdown(false);
                  setShowVIntel(false);
                }}
                className={`relative flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition-all active:scale-95 cursor-pointer ${showSearchDropdown ? "bg-white/10 text-[#38bdf8]" : ""}`}
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
                  className={`absolute bottom-0 inset-x-1.5 h-0.5 bg-white rounded-full transition-transform duration-200 origin-center ${showSearchDropdown ? "scale-x-100" : "scale-x-0 group-hover/menubartooltip:scale-x-100"}`}
                />
              </button>

              {/* Glassmorphism Tooltip (Larger, 100% Rounded, No Animation) */}
              {!showSearchDropdown && (
                <div className="absolute top-full right-0 mt-2.5 px-3.5 py-1.5 rounded-full bg-[#18161e]/90 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] text-xs font-semibold text-white whitespace-nowrap hidden group-hover/menubartooltip:block pointer-events-none z-50">
                  Spotlight Search
                </div>
              )}

              <AnimatePresence>
                {showSearchDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowSearchDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -16, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -16, scale: 0.95 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 top-full mt-2 w-72 rounded-[28px] bg-[#1d1b24]/95 backdrop-blur-md border border-white/10 shadow-[0_16px_36px_rgba(0,0,0,0.5)] z-50 p-3 flex flex-col gap-2 font-sans"
                    >
                      <div className="relative flex items-center w-full">
                        <input
                          type="text"
                          autoFocus
                          placeholder="T√¨m nhanh k√™nh..."
                          value={menubarSearchQuery}
                          onChange={(e) =>
                            setMenubarSearchQuery(e.target.value)
                          }
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
                        {menubarSearchQuery ? (
                          <button
                            type="button"
                            onClick={() => setMenubarSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all cursor-pointer bouncy-btn"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        ) : (
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
                                triggerToast("ƒêang l·∫Øng nghe...");
                                recognition.start();
                                recognition.onresult = (event: any) => {
                                  const speechResult =
                                    event.results[0][0].transcript;
                                  setMenubarSearchQuery((prev) => {
                                    const prefix = prev.trim()
                                      ? prev + " "
                                      : "";
                                    return prefix + speechResult;
                                  });
                                  triggerToast("ƒê√£ nh·∫≠p: " + speechResult);
                                };
                                recognition.onerror = (event: any) => {
                                  triggerToast("L·ªói: " + event.error);
                                };
                              } else {
                                triggerToast(
                                  "Tr√¨nh duy·ªát kh√¥ng h·ªó tr·ª£ nh·∫≠n di·ªán gi·ªçng n√≥i",
                                );
                              }
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white hover:text-white/80 transition-all cursor-pointer bouncy-btn"
                            title="T√¨m ki·∫øm b·∫±ng gi·ªçng n√≥i"
                          >
                            <Mic className="w-3.5 h-3.5 text-white shrink-0" />
                          </button>
                        )}
                      </div>

                      <div className="max-h-64 overflow-y-auto flex flex-col gap-1 custom-scrollbar pr-1">
                        {renderSpotlightUnifiedResults(() =>
                          setShowSearchDropdown(false),
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
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
              title="Quay l·∫°i"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <span className="text-white font-semibold text-base sm:text-lg tracking-tight">
              {activeSettingSection === "appearance" && "Giao di·ªán"}
              {activeSettingSection === "search" && "T√¨m ki·∫øm"}
              {activeSettingSection === "profile" && "T√†i kho·∫£n & D·ªØ li·ªáu"}
              {activeSettingSection === "accessibility" && "Tr·ª£ nƒÉng"}
              {activeSettingSection === "news" && "Tin t·ª©c (News)"}
              {activeSettingSection === "broadcast" && "Ph√°t s√≥ng"}
              {activeSettingSection === "experimental" &&
                "Th·ª≠ nghi·ªám & T√≠nh nƒÉng m·ªõi"}
              {activeSettingSection === "design_system" && "Design components"}
              {activeSettingSection === "plugin_store" && "C·ª≠a h√†ng ti·ªán √≠ch"}
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
                            ƒêang ph√°t ·ªü ch·∫ø ƒë·ªô Picture in Picture
                          </p>
                          <p className="text-xs text-white/50 mb-4 font-mono">
                            {selectedChannel.name}
                          </p>
                          <button
                            onClick={() => setIsPiPActive(false)}
                            className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all bouncy-btn shadow-lg cursor-pointer"
                          >
                            Quay l·∫°i tr√¨nh ph√°t ch√≠nh
                          </button>
                        </div>
                      ) : isMultiviewMode ? (
                        <div className="w-full max-w-5xl mx-auto aspect-video rounded-3xl bg-[#211f26]/40 border border-white/10 p-2 sm:p-4 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                          {/* Multiview top info and action bar */}
                          <div className="flex items-center justify-between mb-3 text-white">
                            <div className="flex items-center gap-2">
                              <Grid className="w-4 h-4 text-indigo-400" />
                              <span className="text-xs sm:text-sm font-medium">
                                Ch·∫ø ƒë·ªô xem Multiview ({multiviewCount} khung)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  setShowMultiviewSelectorPopup(true)
                                }
                                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-[11px] font-normal transition-colors cursor-pointer"
                              >
                                ƒê·ªïi s·ªë khung
                              </button>
                              <button
                                onClick={() => {
                                  setIsMultiviewMode(false);
                                  setMultiviewChannels([]);
                                }}
                                className="px-3 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[11px] font-normal border border-red-500/30 transition-colors cursor-pointer"
                              >
                                Tho√°t Multiview
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
                                            title="ƒê·ªïi k√™nh"
                                          >
                                            <RefreshCw className="w-3 h-3" />
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleRemoveChannelFromSlot(idx);
                                            }}
                                            className="p-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px]"
                                            title="X√≥a k√™nh"
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
                                          Khung {idx + 1} tr·ªëng
                                        </span>
                                        <span className="text-[10px] text-white/40">
                                          B·∫•m ƒë·ªÉ ch·ªçn k√™nh
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
                              setRequiredPluginFeatureName("M·ªü lu·ªìng g·ªëc");
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
                            {/* Hamburger menu button (3 g·∫°ch ngang) with dropdown opening BELOW */}
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
                              title="V·ªÅ Home"
                            >
                              <Home className="w-4 h-4 text-[#381e72]" />
                            </button>

                            {/* Add custom channel button */}
                            <button
                              onClick={() => {
                                if (
                                  installedPlugins.add_custom !== "installed"
                                ) {
                                  setRequiredPluginFeatureName("Th√™m k√™nh m·ªõi");
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

                            {/* T·∫•t c·∫£ filter button */}
                            <button
                              onClick={() => setSelectedCategory("all")}
                              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-normal whitespace-nowrap cursor-default bouncy-btn h-8 sm:h-9 flex items-center justify-center ${
                                selectedCategory === "all"
                                  ? "glass-pill-active"
                                  : "glass-pill text-white/60 hover:text-white"
                              }`}
                            >
                              T·∫•t c·∫£ ({flattenedChannels.length})
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
                                              ? "X√≥a kh·ªèi y√™u th√≠ch"
                                              : "Th√™m v√†o y√™u th√≠ch"}
                                          </span>
                                        </div>
                                        {isCurrentChannelFavorite && (
                                          <Check className="w-4 h-4 text-[#007aff] stroke-[3.5]" />
                                        )}
                                      </button>
                                    );
                                  })()}

                                {/* M·ªü lu·ªìng g·ªëc */}
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
                                          "M·ªü lu·ªìng g·ªëc",
                                        );
                                        setShowPluginRequiredModal(true);
                                      }
                                    }}
                                    className="relative w-full pl-7 pr-4 py-2.5 text-left text-[13px] hover:bg-white/[0.08] active:bg-white/[0.12] flex items-center text-white/90 hover:text-white font-sans font-medium group"
                                  >
                                    <div className="menu-vertical-pill" />
                                    <Tv className="w-4 h-4 mr-2 text-white/60 group-hover:text-white stroke-[2]" />
                                    M·ªü lu·ªìng g·ªëc
                                  </a>
                                )}

                                {/* Chia s·∫ª k√™nh */}
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
                                    Chia s·∫ª k√™nh
                                  </button>
                                )}

                                {/* Divider */}
                                <div className="border-t border-white/10 my-1.5" />

                                {/* Xu·∫•t lu·ªìng k√™nh (Only visible on Live tab) */}
                                <button
                                  onClick={() => {
                                    setShowDropdownMenu(false);
                                    if (
                                      installedPlugins.export_stream !==
                                      "installed"
                                    ) {
                                      setRequiredPluginFeatureName(
                                        "Xu·∫•t lu·ªìng",
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
                                  Xu·∫•t lu·ªìng k√™nh
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
                          Kh√¥ng t√¨m th·∫•y k√™nh ph√π h·ª£p
                        </p>
                        <p className="text-white/40 text-xs mt-1">
                          H√£y th·ª≠ t√¨m v·ªõi t·ª´ kho√° kh√°c ho·∫∑c th√™m li√™n k·∫øt m3u8
                          m·ªõi.
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
                              const isDacBiet = ch.group === "ƒê·∫∑c bi·ªát";

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
                            {homeSlides[currentSlide].btnText || "Th·ª≠ ngay"}
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
                      {/* ROW: "G·ª¢I √ù CHO B·∫†N" CAROUSEL SLIDER (ADDED ABOVE K√äNH Y√äU TH√çCH AS REQUESTED) */}
                      {recommendedChannels.length > 0 && (
                        <div className="space-y-4 relative group/reco-carousel animate-fade-in">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-5 rounded bg-blue-500" />
                              <h3 className="text-sm sm:text-base font-bold tracking-tight text-white/95 font-google">
                                G·ª£i √Ω cho b·∫°n
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
                                title="L√†m m·ªõi g·ª£i √Ω"
                              >
                                <RefreshCw className="w-3.5 h-3.5 group-hover/refresh-btn:rotate-180 transition-transform duration-500" />
                              </button>
                              <button
                                onClick={() => scrollRecommendations("left")}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer flex items-center justify-center border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] bouncy-btn"
                                title="Quay l·∫°i"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => scrollRecommendations("right")}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer flex items-center justify-center border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] bouncy-btn"
                                title="Xem ti·∫øp theo"
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
                                          ? "X√≥a kh·ªèi y√™u th√≠ch"
                                          : "Th√™m v√†o y√™u th√≠ch"
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

                      {/* ROW: "K√äNH Y√äU TH√çCH" CAROUSEL SLIDER (ADDED ABOVE XEM TI·∫æP SECTIONS EXACTLY AS REQUESTED) */}
                      {favoriteChannelsList.length > 0 && (
                        <div className="space-y-4 relative group/fav-carousel animate-fade-in">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-5 rounded bg-amber-400" />
                              <h3 className="text-sm sm:text-base font-bold tracking-tight text-white/95 font-google">
                                K√™nh y√™u th√≠ch
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
                                title="Quay l·∫°i"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => scrollFavorites("right")}
                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-120 shadow"
                                title="Xem ti·∫øp theo"
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
                                      title="X√≥a kh·ªèi y√™u th√≠ch"
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

                      {/* ROW 1: "XEM TI·∫æP" (CONTINUE WATCHING) EXACTLY AS REQUIRED BY THE MOCK */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-5 rounded bg-pink-500" />
                          <h3 className="text-sm sm:text-base font-bold tracking-tight text-white/95 font-google">
                            Xem ti·∫øp
                          </h3>
                          <span className="text-xs text-white/40 font-mono mt-1">
                            G·∫ßn ƒë√¢y
                          </span>
                        </div>

                        {/* Horizontal grid for 3 continue watching cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {[
                            {
                              title: "Th√°m T·ª≠ L·ª´ng Danh Conan (M√πa 1)",
                              desc: "Detective Conan (Season 1) - T·∫≠p 15",
                              progress: "24:55",
                              percent: 85,
                              image:
                                "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "B·∫°ch Nh·∫≠t ƒê·ªÅ ƒêƒÉng",
                              desc: "Love Beyond the Grave - T·∫≠p 1",
                              progress: "40:49",
                              percent: 60,
                              image:
                                "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "Gia ƒê√¨nh ƒêi·ªáp Vi√™n (M√πa 3)",
                              desc: "Spy x Family (Season 3) - T·∫≠p 2",
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
                                    name: `ƒêang xem ti·∫øp: ${item.title} - ${item.desc.split(" - ").pop()}`,
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

                      {/* ROW 2: "PHIM ƒê·ªÄ XU·∫§T" (RECOMMENDED MOVIES) PORTRAIT CARDS COHESION */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-5 rounded bg-teal-400" />
                          <h3 className="text-sm sm:text-base font-bold tracking-tight text-white/95 font-google">
                            Phim ƒë·ªÅ xu·∫•t
                          </h3>
                          <span className="text-xs text-teal-400/80 font-mono mt-1">
                            ƒê·∫∑c s·∫Øc nh·∫•t
                          </span>
                        </div>

                        {/* Horizontal grid layout for portrait suggestions */}
                        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
                          {[
                            {
                              title: "Li√™n Hoa L√¢u",
                              tag: "C·ªï trang ¬∑ Ki·∫øm hi·ªáp",
                              rating: "9.2",
                              img: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "Tr∆∞·ªùng Nguy·ªát T·∫´n Minh",
                              tag: "Ti√™n hi·ªáp ¬∑ T√¨nh duy√™n",
                              rating: "9.0",
                              img: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "Kh√°nh D∆∞ Ni√™n 2",
                              tag: "Cung ƒë·∫•u ¬∑ M∆∞u quy·ªÅn",
                              rating: "9.5",
                              img: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "ƒê·∫∑c Chi·∫øn Vinh Di·ªáu",
                              tag: "Qu√¢n nh√¢n ¬∑ H√†nh ƒë·ªông",
                              rating: "8.8",
                              img: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "T√¢y Du K√Ω 1986",
                              tag: "Kinh ƒëi·ªÉn ¬∑ Huy·ªÅn tho·∫°i",
                              rating: "9.9",
                              img: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "Th∆∞∆°ng Lan Quy·∫øt",
                              tag: "Huy·ªÅn huy·ªÖn ¬∑ Ng·ªçt s·ªßng",
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
                                    name: `Phim truy·ªán ƒë·ªÅ xu·∫•t: ${movie.title} (HD)`,
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
                                  ‚òÖ {movie.rating}
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

                      {/* ROW 3: PHIM ƒêI·ªÜN ·∫¢NH BOM T·∫§N (16:9 LANDSCAPE WIDESCREEN GRID) */}
                      <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-5 rounded bg-amber-400" />
                          <h3 className="text-sm sm:text-base font-bold tracking-tight text-white/95 font-google">
                            Phim ƒêi·ªán ·∫¢nh Bom T·∫•n
                          </h3>
                          <span className="text-xs text-amber-400/80 font-mono mt-1">
                            Ch·∫•t l∆∞·ª£ng 4K c·ª±c n√©t
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {[
                            {
                              title: "L·∫≠t M·∫∑t 7: M·ªôt ƒêi·ªÅu ∆Ø·ªõc",
                              tag: "Gia ƒë√¨nh ¬∑ T√¢m l√Ω",
                              year: "2024",
                              duration: "138 ph√∫t",
                              img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "Mai (Tr·∫•n Th√†nh)",
                              tag: "L√£ng m·∫°n ¬∑ Bi k·ªãch",
                              year: "2024",
                              duration: "131 ph√∫t",
                              img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "B·ªë Gi√† (The Godfather)",
                              tag: "Kinh ƒëi·ªÉn ¬∑ T·ªôi ph·∫°m",
                              year: "1972",
                              duration: "175 ph√∫t",
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
                                    name: `Phim truy·ªán ƒë·ªÅ xu·∫•t: ${movie.title} (HD)`,
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
                                  {movie.year} ¬∑ {movie.duration}
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

                      {/* ROW 4: TOP 10 PHIM HOT TH·ªäNH H√ÄNH (NETFLIX STYLE OUTLINE NUMBERS CAROUSEL) */}
                      <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-5 rounded bg-pink-500" />
                          <h3 className="text-sm sm:text-base font-bold tracking-tight text-white/95 font-google">
                            Top 10 Phim Th·ªãnh H√†nh
                          </h3>
                          <span className="text-xs text-pink-400/80 font-mono mt-1">
                            X·∫øp h·∫°ng tu·∫ßn n√†y
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
                              title: "D·ªØ Ph∆∞·ª£ng H√†nh",
                              tag: "Tri·ªáu L·ªá Dƒ©nh ¬∑ L√¢m Canh T√¢n",
                              img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              rank: 2,
                              title: "C√¢u Chuy·ªán Hoa H·ªìng",
                              tag: "L∆∞u Di·ªác Phi ¬∑ L√¢m Canh T√¢n",
                              img: "https://images.unsplash.com/photo-1513829096999-4978602297f7?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              rank: 3,
                              title: "Tr∆∞·ªùng T∆∞∆°ng T∆∞ 2",
                              tag: "D∆∞∆°ng T·ª≠ ¬∑ ƒê·∫∑ng Vi",
                              img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              rank: 4,
                              title: "Kh√°nh D∆∞ Ni√™n 2",
                              tag: "Tr∆∞∆°ng Nh∆∞·ª£c Qu√¢n ¬∑ L√Ω Th·∫•m",
                              img: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              rank: 5,
                              title: "Th·ª´a Hoan K√Ω",
                              tag: "D∆∞∆°ng T·ª≠ ¬∑ H·ª©a Kh·∫£i",
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
                                    name: `Phim truy·ªán ƒë·ªÅ xu·∫•t: ${movie.title} (HD)`,
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

                      {/* ROW 5: ANIME & HO·∫†T H√åNH (LAYOUT 3 - ASPECT 1.5/1 LANDSCAPE CARDS IN ROW) */}
                      <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-5 rounded bg-teal-400" />
                          <h3 className="text-sm sm:text-base font-bold tracking-tight text-white/95 font-google">
                            V≈© Tr·ª• Anime & Ho·∫°t H√¨nh
                          </h3>
                          <span className="text-xs text-teal-400/80 font-mono mt-1">
                            Phi√™u l∆∞u k·ª≥ th√∫
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
                              title: "One Piece (ƒê·∫£o H·∫£i T·∫∑c)",
                              tag: "Luffy ¬∑ H√†nh tr√¨nh m·ªõi",
                              img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "Doraemon: B·∫£n Giao H∆∞·ªüng",
                              tag: "Doraemon & Nobita",
                              img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "M·ªô ƒêom ƒê√≥m (Ghibli)",
                              tag: "Chi·∫øn tranh ¬∑ T√¨nh anh em",
                              img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&auto=format&fit=crop&q=80",
                            },
                            {
                              title: "Th√°m T·ª≠ L·ª´ng Danh Conan",
                              tag: "Kudo Shinichi ¬∑ Edogawa",
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
                                    name: `Anime ƒë·ªÅ xu·∫•t: ${movie.title} (HD)`,
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
                            label: "K√™nh Qu·ªëc Gia",
                            value: "13 VTV HD",
                            color: "text-cyan-400",
                          },
                          {
                            label: "Tin T·ª©c & Gi·∫£i Tr√≠",
                            value: "19 VTVCab",
                            color: "text-fuchsia-400",
                          },
                          {
                            label: "K√™nh TP.HCM & ƒê·ªôc Quy·ªÅn",
                            value: "15 HTV HD",
                            color: "text-orange-400",
                          },
                          {
                            label: "K√™nh ƒë·ªãa ph∆∞∆°ng & Radio",
                            value: "G·∫ßn 70+",
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
                          <Compass className="w-5 h-5 text-pink-400" /> H∆∞·ªõng
                          D·∫´n S·ª≠ D·ª•ng Linh Ho·∫°t
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-white/70">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-white">
                              1. Ch·ªçn k√™nh tr·ª±c ti·∫øp
                            </h4>
                            <p className="leading-relaxed text-xs text-white/60">
                              Nh·∫•p v√†o b·∫•t k·ª≥ th·∫ª k√™nh n√†o ho·∫∑c phim ·∫£nh ƒë·ªÅ xu·∫•t
                              ƒë·ªÉ t·∫£i ch∆∞∆°ng tr√¨nh ph√°t tr·ª±c ti·∫øp ·ªü m·ª•c 'Truy·ªÅn
                              h√¨nh'.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-semibold text-white">
                              2. Th∆∞ vi·ªán Y√™u Th√≠ch
                            </h4>
                            <p className="leading-relaxed text-xs text-white/60">
                              Nh·∫•p bi·ªÉu t∆∞·ª£ng h√¨nh ng√¥i sao tr√™n m·ªói √¥ k√™nh ƒë·ªÉ
                              l∆∞u k√™nh v√†o m·ª•c Y√™u Th√≠ch, hi·ªÉn th·ªã t·ª©c th√¨ tr√™n
                              Trang Ch·ªß n√†y.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-semibold text-white">
                              3. T√πy bi·∫øn ph√°t lu·ªìng m3u8
                            </h4>
                            <p className="leading-relaxed text-xs text-white/60">
                              Nh·∫•n n√∫t 'Th√™m k√™nh' ·ªü g√≥c ph·∫£i √¥ t√¨m ki·∫øm ƒë·ªÉ d√°n
                              lu·ªìng ngo√†i m3u8 c·ªßa ri√™ng b·∫°n c·ª±c k√¨ thu·∫≠n ti·ªán.
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
                                placeholder="T√¨m ki·∫øm c√†i ƒë·∫∑t..."
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
                                    triggerToast("ƒêang l·∫Øng nghe...");
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
                                      triggerToast("ƒê√£ nh·∫≠p: " + speechResult);
                                    };
                                    recognition.onerror = (event: any) => {
                                      triggerToast("L·ªói: " + event.error);
                                    };
                                  } else {
                                    triggerToast(
                                      "Tr√¨nh duy·ªát kh√¥ng h·ªó tr·ª£ nh·∫≠n di·ªán gi·ªçng n√≥i",
                                    );
                                  }
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white hover:text-white/80 transition-all cursor-pointer bouncy-btn"
                                title="T√¨m ki·∫øm b·∫±ng gi·ªçng n√≥i"
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
                                {/* 1. GIAO DI·ªÜN (APPEARANCE) */}
                                {(matches("giao di·ªán") ||
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
                                          Giao di·ªán
                                        </h3>
                                        <p className="text-xs text-white/60">
                                          T√πy bi·∫øn thanh Header bar, m√†u s·∫Øc n·ªÅn
                                          v√† thanh ƒëi·ªÅu h∆∞·ªõng
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
                                            M·ªõi
                                          </span>
                                        </div>
                                        <p className="text-xs text-white/60">
                                          Hi·ªÉn th·ªã thanh Header bar tr·∫Øng c·ªë
                                          ƒë·ªãnh ·ªü ƒë·ªânh m√†n h√¨nh (Always on top)
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
                                        M√†u s·∫Øc √°nh s√°ng n·ªÅn (Backdrop Glow)
                                      </h4>
                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                        {[
                                          {
                                            id: "cosmic",
                                            label: "Cosmic Glow",
                                          },
                                          { id: "deep", label: "T·ªëi gi·∫£n" },
                                          { id: "aurora", label: "C·ª±c quang" },
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
                                          Ch·∫ø ƒë·ªô AMOLED Dark
                                        </h4>
                                        <p className="text-xs text-white/60">
                                          S·ª≠ d·ª•ng n·ªÅn ƒëen tuy·ªát ƒë·ªëi gi√∫p ti·∫øt
                                          ki·ªám pin cho m√†n h√¨nh OLED
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
                                          Chuy·ªÉn Dock th√†nh Sidebar b√™n tr√°i
                                        </h4>
                                        <p className="text-xs text-white/60">
                                          Chuy·ªÉn thanh ƒëi·ªÅu h∆∞·ªõng d∆∞·ªõi c√πng sang
                                          thanh Sidebar b√™n tr√°i
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

                                {/* 2. T√åM KI·∫æM (SPOTLIGHT SEARCH SETTINGS) */}
                                {(matches("t√¨m ki·∫øm") ||
                                  matches("search") ||
                                  matches("spotlight") ||
                                  matches("danh m·ª•c") ||
                                  matches("tin t·ª©c") ||
                                  matches("truy·ªÅn h√¨nh") ||
                                  matches("s·ªë hi·ªáu") ||
                                  matches("toolbox") ||
                                  matches("c√†i ƒë·∫∑t")) && (
                                  <div className="bg-white/10 backdrop-blur-[15px] rounded-[20px] p-5 sm:p-6 border border-white/10 space-y-4 text-left">
                                    <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                                      <Search className="w-5 h-5 text-sky-400 shrink-0" />
                                      <div>
                                        <h3 className="text-base font-bold text-white">
                                          T√¨m ki·∫øm
                                        </h3>
                                        <p className="text-xs text-white/60">
                                          T√πy ch·ªânh c√°c danh m·ª•c k·∫øt qu·∫£ hi·ªÉn
                                          th·ªã trong Spotlight Search
                                        </p>
                                      </div>
                                    </div>

                                    <div className="space-y-3 pt-1">
                                      {/* 1. Danh m·ª•c */}
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
                                            Danh m·ª•c & ƒêi·ªÅu h∆∞·ªõng
                                          </h4>
                                          <p className="text-xs text-white/60">
                                            Hi·ªÉn th·ªã c√°c tab v√† ƒëi·ªÅu h∆∞·ªõng h·ªá
                                            th·ªëng (Home, V-Play, News, v.v.)
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

                                      {/* 1.1 V-Apps & 5 Tr√≤ Ch∆°i Ore UI */}
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
                                            V-Apps & 5 Tr√≤ ch∆°i Ore UI
                                          </h4>
                                          <p className="text-xs text-white/60">
                                            T√¨m ki·∫øm V-Arcade 5 games (Caro XO, K√©o b√∫a bao, N·ªëi t·ª´, ƒê·∫øm s·ªë, R·∫Øn), V-Files, Explore VN, V-Learn...
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
                                            T√¨m ki·∫øm c√°c g√≥i V-Cloud Storage (50GB, 200GB, 2TB), Ng√¢n h√†ng s·ªë V-Bank & Verified T√≠ch Xanh
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

                                      {/* 2. Tin t·ª©c */}
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
                                        className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/10 transition-colors select-none"
                                      >
                                        <div className="space-y-0.5 pr-2">
                                          <h4 className="text-sm font-semibold text-white">
                                            Tin t·ª©c
                                          </h4>
                                          <p className="text-xs text-white/60">
                                            Hi·ªÉn th·ªã c√°c b√†i vi·∫øt tin t·ª©c, th√¥ng
                                            b√°o c·ªông ƒë·ªìng v√† s·ª± ki·ªán Discord
                                          </p>
                                        </div>
                                        <div
                                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 border ${
                                            spotlightSearchSettings.news
                                              ? "bg-sky-500 border-sky-400 text-white shadow-[0_0_10px_rgba(56,189,248,0.4)]"
                                              : "bg-white/5 border-white/20 hover:border-white/40"
                                          }`}
                                        >
                                          {spotlightSearchSettings.news && (
                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                          )}
                                        </div>
                                      </div>

                                      {/* 3. Truy·ªÅn h√¨nh */}
                                      <div className="space-y-2">
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
                                          className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/10 transition-colors select-none"
                                        >
                                          <div className="space-y-0.5 pr-2">
                                            <h4 className="text-sm font-semibold text-white">
                                              Truy·ªÅn h√¨nh
                                            </h4>
                                            <p className="text-xs text-white/60">
                                              Hi·ªÉn th·ªã danh s√°ch k√™nh truy·ªÅn
                                              h√¨nh tr·ª±c ti·∫øp theo t√™n ho·∫∑c nh√≥m
                                              k√™nh
                                            </p>
                                          </div>
                                          <div
                                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 border ${
                                              spotlightSearchSettings.channels
                                                ? "bg-sky-500 border-sky-400 text-white shadow-[0_0_10px_rgba(56,189,248,0.4)]"
                                                : "bg-white/5 border-white/20 hover:border-white/40"
                                            }`}
                                          >
                                            {spotlightSearchSettings.channels && (
                                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                                            )}
                                          </div>
                                        </div>

                                        {/* 3.1. M·ª•c nh·ªè c·ªßa truy·ªÅn h√¨nh: T√¨m k√™nh theo s·ªë hi·ªáu k√™nh */}
                                        <div
                                          onClick={() => {
                                            if (
                                              !spotlightSearchSettings.channels
                                            )
                                              return;
                                            playPopSound();
                                            setSpotlightSearchSettings(
                                              (prev) => ({
                                                ...prev,
                                                channelNumbers:
                                                  !prev.channelNumbers,
                                              }),
                                            );
                                          }}
                                          className={`ml-5 pl-4 pr-3.5 py-3 rounded-xl bg-white/[0.03] border-l-2 border-y border-r border-white/10 flex items-center justify-between gap-3 transition-colors select-none ${
                                            spotlightSearchSettings.channels
                                              ? "cursor-pointer hover:bg-white/10 border-l-sky-400"
                                              : "opacity-40 cursor-not-allowed border-l-white/20"
                                          }`}
                                        >
                                          <div className="space-y-0.5 pr-2">
                                            <div className="flex items-center gap-2">
                                              <span className="text-xs font-semibold text-sky-300">
                                                ‚Ü≥ T√¨m k√™nh theo s·ªë hi·ªáu k√™nh
                                              </span>
                                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                                                CH #
                                              </span>
                                            </div>
                                            <p className="text-[11px] text-white/50">
                                              Cho ph√©p g√µ s·ªë k√™nh (v√≠ d·ª•: 1,
                                              001, #12, k√™nh 5) ƒë·ªÉ t√¨m nhanh
                                            </p>
                                          </div>
                                          <div
                                            className={`w-4.5 h-4.5 rounded flex items-center justify-center transition-all shrink-0 border ${
                                              spotlightSearchSettings.channels &&
                                              spotlightSearchSettings.channelNumbers
                                                ? "bg-sky-500 border-sky-400 text-white shadow-[0_0_8px_rgba(56,189,248,0.4)]"
                                                : "bg-white/5 border-white/20"
                                            }`}
                                          >
                                            {spotlightSearchSettings.channels &&
                                              spotlightSearchSettings.channelNumbers && (
                                                <Check className="w-3 h-3 stroke-[3]" />
                                              )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* 4. Toolbox */}
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
                                        className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/10 transition-colors select-none"
                                      >
                                        <div className="space-y-0.5 pr-2">
                                          <h4 className="text-sm font-semibold text-white">
                                            Toolbox
                                          </h4>
                                          <p className="text-xs text-white/60">
                                            Hi·ªÉn th·ªã c√°c c√¥ng c·ª• ti·ªán √≠ch (Xem
                                            URL, Th√™m k√™nh, Nh·∫≠p/Xu·∫•t M3U,
                                            Multiview,...)
                                          </p>
                                        </div>
                                        <div
                                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 border ${
                                            spotlightSearchSettings.toolbox
                                              ? "bg-sky-500 border-sky-400 text-white shadow-[0_0_10px_rgba(56,189,248,0.4)]"
                                              : "bg-white/5 border-white/20 hover:border-white/40"
                                          }`}
                                        >
                                          {spotlightSearchSettings.toolbox && (
                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                          )}
                                        </div>
                                      </div>

                                      {/* 5. C√†i ƒë·∫∑t */}
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
                                        className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/10 transition-colors select-none"
                                      >
                                        <div className="space-y-0.5 pr-2">
                                          <h4 className="text-sm font-semibold text-white">
                                            C√†i ƒë·∫∑t
                                          </h4>
                                          <p className="text-xs text-white/60">
                                            Hi·ªÉn th·ªã c√°c m·ª•c c·∫•u h√¨nh h·ªá th·ªëng,
                                            giao di·ªán, tr·ª£ nƒÉng v√† ti·ªán √≠ch
                                            trong C√†i ƒë·∫∑t
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
                                    </div>
                                  </div>
                                )}

                                {/* 3. TR·ª¢ NƒÇNG (ACCESSIBILITY) */}
                                {(matches("tr·ª£ nƒÉng") ||
                                  matches("slide") ||
                                  matches("sidebar") ||
                                  matches("auto")) && (
                                  <div className="bg-white/10 backdrop-blur-[15px] rounded-[20px] p-5 sm:p-6 border border-white/10 space-y-4 text-left">
                                    <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                                      <Key className="w-5 h-5 text-emerald-400 shrink-0" />
                                      <div>
                                        <h3 className="text-base font-bold text-white">
                                          Tr·ª£ nƒÉng
                                        </h3>
                                        <p className="text-xs text-white/60">
                                          ƒêi·ªÅu ch·ªânh t·ª± ƒë·ªông tr∆∞·ª£t banner v√†
                                          t∆∞∆°ng t√°c menu
                                        </p>
                                      </div>
                                    </div>

                                    {/* TOGGLE: Auto Slide */}
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                      <div className="space-y-1 pr-4">
                                        <h4 className="text-sm font-semibold text-white">
                                          T·ª± ƒë·ªông tr∆∞·ª£t h√¨nh Banner
                                        </h4>
                                        <p className="text-xs text-white/60">
                                          Banner h√¨nh ·∫£nh ·ªü trang ch·ªß t·ª± ƒë·ªông
                                          tr∆∞·ª£t sau m·ªói 5 gi√¢y
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          playPopSound();
                                          setAutoSlide(!autoSlide);
                                        }}
                                        className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 relative cursor-pointer flex items-center shrink-0 ${
                                          autoSlide
                                            ? "bg-[#34c759]"
                                            : "bg-[#3a3a3c]"
                                        }`}
                                      >
                                        <motion.div
                                          animate={{ x: autoSlide ? 20 : 0 }}
                                          transition={{
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 30,
                                          }}
                                          className="w-5 h-5 rounded-full bg-white shadow-md"
                                        />
                                      </button>
                                    </div>

                                    {/* TOGGLE: Auto Hide Sidebar */}
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                      <div className="space-y-1 pr-4">
                                        <h4 className="text-sm font-semibold text-white">
                                          T·ª± ƒë·ªông ·∫©n Sidebar
                                        </h4>
                                        <p className="text-xs text-white/60">
                                          T·ª± ƒë·ªông thu g·ªçn thanh menu khi kh√¥ng
                                          di chu·ªôt v√†o
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          playPopSound();
                                          setAutoHideSidebar(!autoHideSidebar);
                                        }}
                                        className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 relative cursor-pointer flex items-center shrink-0 ${
                                          autoHideSidebar
                                            ? "bg-[#34c759]"
                                            : "bg-[#3a3a3c]"
                                        }`}
                                      >
                                        <motion.div
                                          animate={{
                                            x: autoHideSidebar ? 20 : 0,
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

                                {/* 4. TIN T·ª®C (NEWS SETTINGS) */}
                                {(matches("news") ||
                                  matches("tin t·ª©c") ||
                                  matches("b·∫£n tin") ||
                                  matches("b√†i vi·∫øt") ||
                                  matches("c·ª° ch·ªØ") ||
                                  matches("font") ||
                                  matches("ch·ªØ to") ||
                                  matches("ch·ªØ nh·ªè") ||
                                  matches("size")) && (
                                  <div className="bg-white/10 backdrop-blur-[15px] rounded-[20px] p-5 sm:p-6 border border-white/10 space-y-4 text-left">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                      <div className="flex items-center gap-3">
                                        <Megaphone className="w-5 h-5 text-rose-400 shrink-0" />
                                        <div>
                                          <h3 className="text-base font-bold text-white">
                                            Tin t·ª©c (News)
                                          </h3>
                                          <p className="text-xs text-white/60">
                                            T√πy ch·ªânh c·ª° ch·ªØ ƒë·ªçc b√†i vi·∫øt v√†
                                            qu·∫£n l√Ω tr·∫£i nghi·ªám ƒë·ªçc b·∫£n tin
                                          </p>
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          playPopSound();
                                          setActiveSettingSection("news");
                                        }}
                                        className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold shrink-0 active:scale-95 transition-all cursor-pointer shadow-sm bouncy-btn flex items-center gap-1"
                                      >
                                        <span>Chi ti·∫øt</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    {/* C·ª° ch·ªØ b√†i vi·∫øt Selector */}
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <Type className="w-4 h-4 text-rose-300" />
                                          <h4 className="text-sm font-semibold text-white">
                                            K√≠ch th∆∞·ªõc c·ª° ch·ªØ ƒë·ªçc b√†i vi·∫øt
                                          </h4>
                                        </div>
                                        <span className="text-xs font-medium text-rose-300">
                                          {newsFontSize === "small"
                                            ? "Nh·ªè (14px)"
                                            : newsFontSize === "normal"
                                              ? "Ti√™u chu·∫©n (16px)"
                                              : newsFontSize === "large"
                                                ? "L·ªõn (18px)"
                                                : "R·∫•t l·ªõn (20px)"}
                                        </span>
                                      </div>

                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {[
                                          {
                                            id: "small",
                                            label: "Nh·ªè",
                                            size: "14px",
                                            sampleClass: "text-xs",
                                          },
                                          {
                                            id: "normal",
                                            label: "Chu·∫©n",
                                            size: "16px",
                                            sampleClass: "text-sm",
                                          },
                                          {
                                            id: "large",
                                            label: "L·ªõn",
                                            size: "18px",
                                            sampleClass: "text-base",
                                          },
                                          {
                                            id: "huge",
                                            label: "R·∫•t l·ªõn",
                                            size: "20px",
                                            sampleClass: "text-lg",
                                          },
                                        ].map((option) => (
                                          <button
                                            key={option.id}
                                            type="button"
                                            onClick={() =>
                                              handleUpdateNewsFontSize(
                                                option.id as NewsFontSize,
                                              )
                                            }
                                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 bouncy-btn ${
                                              newsFontSize === option.id
                                                ? "bg-rose-500/25 border-rose-400/80 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)] ring-1 ring-rose-400/50"
                                                : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                                            }`}
                                          >
                                            <span className="text-xs font-bold">
                                              {option.label}
                                            </span>
                                            <span className="text-[10px] text-white/50">
                                              {option.size}
                                            </span>
                                          </button>
                                        ))}
                                      </div>

                                      {/* Interactive Live Preview Box */}
                                      <div className="mt-2 p-3.5 rounded-xl bg-black/30 border border-white/10 flex flex-col gap-1.5">
                                        <div className="text-[10px] uppercase font-bold tracking-wider text-white/40">
                                          Xem tr∆∞·ªõc tr·ª±c ti·∫øp
                                        </div>
                                        <p
                                          className={`text-white/90 font-sans transition-all duration-200 ${
                                            newsFontSize === "small"
                                              ? "text-xs leading-relaxed"
                                              : newsFontSize === "normal"
                                                ? "text-sm leading-relaxed"
                                                : newsFontSize === "large"
                                                  ? "text-base leading-relaxed"
                                                  : "text-lg leading-relaxed"
                                          }`}
                                        >
                                          The Waves ‚Äî T·ª´ nh·ªØng ng∆∞·ªùi xa l·∫° t√¨nh
                                          c·ªù g·∫∑p nhau d∆∞·ªõi ph·∫ßn b√¨nh lu·∫≠n
                                          YouTube, m·ªôt c·ªông ƒë·ªìng ƒë∆∞·ª£c h√¨nh
                                          th√†nh.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* 5. C·ª¨A H√ÄNG TI·ªÜN √çCH (PLUGIN STORE) */}
                                {(matches("c·ª≠a h√†ng ti·ªán √≠ch") ||
                                  matches("plugin") ||
                                  matches("ti·ªán √≠ch")) && (
                                  <div className="bg-white/10 backdrop-blur-[15px] rounded-[20px] p-5 sm:p-6 border border-white/10 space-y-4 text-left">
                                    <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                                      <Puzzle className="w-5 h-5 text-amber-400 shrink-0" />
                                      <div>
                                        <h3 className="text-base font-bold text-white">
                                          C·ª≠a h√†ng ti·ªán √≠ch
                                        </h3>
                                        <p className="text-xs text-white/60">
                                          C√†i ƒë·∫∑t v√† g·ª° b·ªè c√°c g√≥i ti·ªán √≠ch m·ªü
                                          r·ªông c·ªßa Waves Community
                                        </p>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                                      {[
                                        {
                                          id: "export_stream",
                                          name: "Xu·∫•t lu·ªìng",
                                          desc: "Xu·∫•t l∆∞u danh s√°ch k√™nh t·ªáp .m3u8",
                                        },
                                        {
                                          id: "multiview",
                                          name: "Multiview Grid",
                                          desc: "Xem t·ªëi ƒëa 4 k√™nh c√πng l√∫c",
                                        },
                                        {
                                          id: "pip",
                                          name: "Picture in Picture",
                                          desc: "C·ª≠a s·ªï n·ªïi thu nh·ªè ti·ªán l·ª£i",
                                        },
                                        {
                                          id: "open_native",
                                          name: "M·ªü lu·ªìng g·ªëc",
                                          desc: "M·ªü tr·ª±c ti·∫øp lu·ªìng stream hls g·ªëc",
                                        },
                                      ].map((p) => {
                                        const status =
                                          installedPlugins[p.id] || "idle";
                                        return (
                                          <div
                                            key={p.id}
                                            className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3"
                                          >
                                            <div className="min-w-0">
                                              <h4 className="text-sm font-semibold text-white truncate">
                                                {p.name}
                                              </h4>
                                              <p className="text-[11px] text-white/50 truncate mt-0.5">
                                                {p.desc}
                                              </p>
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                playPopSound();
                                                if (status === "installed") {
                                                  setPluginToUninstall(p);
                                                } else {
                                                  startInstallPlugin(p.id);
                                                }
                                              }}
                                              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                                                status === "installed"
                                                  ? "bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20"
                                                  : "bg-white/10 text-white border border-white/15 hover:bg-white/20"
                                              }`}
                                            >
                                              {status === "installed"
                                                ? "G·ª° b·ªè"
                                                : status === "installing"
                                                  ? "ƒêang c√†i..."
                                                  : "C√†i ƒë·∫∑t"}
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* 4. T√ôY CH·ªåN NH√Ä PH√ÅT TRI·ªÇN (DEVELOPER OPTIONS / DESIGN COMPONENTS) */}
                                {(matches("design") ||
                                  matches("components") ||
                                  matches("nh√† ph√°t tri·ªÉn") ||
                                  matches("th√†nh ph·∫ßn")) && (
                                  <div className="bg-white/10 backdrop-blur-[15px] rounded-[20px] p-5 sm:p-6 border border-white/10 space-y-4 text-left">
                                    <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                                      <Cpu className="w-5 h-5 text-purple-400 shrink-0" />
                                      <div>
                                        <h3 className="text-base font-bold text-white">
                                          T√πy ch·ªçn nh√† ph√°t tri·ªÉn
                                        </h3>
                                        <p className="text-xs text-white/60">
                                          Ki·ªÉm tra c√°c th√†nh ph·∫ßn giao di·ªán v√†
                                          t√†i nguy√™n h·ªá th·ªëng
                                        </p>
                                      </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                                      <div className="space-y-1">
                                        <h4 className="text-sm font-semibold text-white">
                                          Waves Community Design components
                                        </h4>
                                        <p className="text-xs text-white/60">
                                          H·ªá th·ªëng ng√¥n ng·ªØ thi·∫øt k·∫ø, t∆∞∆°ng t√°c
                                          n√∫t b·∫•m, hi·ªáu ·ª©ng b√°m d√≠nh v√† xem th·ª≠
                                          th√†nh ph·∫ßn UI
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          playPopSound();
                                          setActiveSettingSection(
                                            "design_system",
                                          );
                                        }}
                                        className="px-4 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold shrink-0 active:scale-95 transition-all cursor-pointer shadow-md bouncy-btn flex items-center gap-1.5"
                                      >
                                        <span>Kh√°m ph√° UI</span>
                                        <ChevronRight className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="detail"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className={`mt-16 sm:mt-20 rounded-[15px] p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 text-white ${
                            activeSettingSection === "design_system"
                              ? "bg-[#211f26] backdrop-blur-[10px]"
                              : "bg-white/10 backdrop-blur-[10px]"
                          }`}
                        >
                          {activeSettingSection === "appearance" &&
                            (() => {
                              const isMatched = (text: string) => {
                                const q = settingDetailSearchQuery
                                  .trim()
                                  .toLowerCase();
                                if (!q) return true;
                                return text.toLowerCase().includes(q);
                              };

                              const matchGlow =
                                isMatched("M√†u S·∫Øc √Ånh S√°ng N·ªÅn") ||
                                isMatched("Backdrop Glow") ||
                                isMatched("cosmic") ||
                                isMatched("sunset") ||
                                isMatched("aurora") ||
                                isMatched("t·ªëi gi·∫£n") ||
                                isMatched("ch·ªß ƒë·ªÅ") ||
                                isMatched("m√†u");
                              const matchAmoled =
                                isMatched("AMOLED Dark") ||
                                isMatched("si√™u t·ªëi") ||
                                isMatched("b·∫£o v·ªá m·∫Øt") ||
                                isMatched("t·ªëi");
                              const matchDockToSidebar =
                                isMatched("Dock to Sidebar") ||
                                isMatched("sidebar") ||
                                isMatched("thanh dock th√†nh sidebar") ||
                                isMatched("thanh b√™n") ||
                                isMatched("giao di·ªán sidebar") ||
                                isMatched("expand") ||
                                isMatched("collapse");
                              const matchDock =
                                isMatched("T√πy bi·∫øn thanh ƒëi·ªÅu h∆∞·ªõng Dock") ||
                                isMatched("thanh Dock") ||
                                isMatched("Dock Customizer") ||
                                isMatched("rearrange") ||
                                isMatched("trang ch·ªß") ||
                                isMatched("tr·ª±c ti·∫øp") ||
                                isMatched("c√†i ƒë·∫∑t") ||
                                isMatched("t√¨m ki·∫øm") ||
                                isMatched("t·∫£i l·∫°i") ||
                                isMatched("ghim") ||
                                isMatched("h·ªì s∆°") ||
                                isMatched("c·ª≠a h√†ng") ||
                                isMatched("v·ªÅ ·ª©ng d·ª•ng");

                              const hasResults =
                                matchGlow ||
                                matchAmoled ||
                                matchDockToSidebar ||
                                matchDock;

                              return (
                                <div className="space-y-6">
                                  {/* Section Header with Search Bar */}
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-3 text-left">
                                      <div className="w-12 h-12 flex items-center justify-center shrink-0 text-white">
                                        <Palette className="w-6 h-6" />
                                      </div>
                                      <div>
                                        <h3 className="text-lg font-semibold text-white">
                                          Giao di·ªán
                                        </h3>
                                        <p className="text-xs text-white/60">
                                          T√πy bi·∫øn d·∫£i m√†u chuy·ªÉn s·∫Øc ph√≠a d∆∞·ªõi
                                          l·ªõp k√≠nh m·ªù theo ƒë√∫ng s·ªü th√≠ch c·ªßa
                                          b·∫°n.
                                        </p>
                                      </div>
                                    </div>
                                    <div className="relative w-full md:max-w-[280px]">
                                      <input
                                        type="text"
                                        value={settingDetailSearchQuery}
                                        onChange={(e) =>
                                          setSettingDetailSearchQuery(
                                            e.target.value,
                                          )
                                        }
                                        placeholder="T√¨m ki·∫øm c√†i ƒë·∫∑t..."
                                        className="w-full pl-10 pr-10 py-2 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-white placeholder-gray-400 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.3)] focus:outline-none focus:bg-white/15 focus:border-white/20 transition-none text-left"
                                      />
                                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                                        <img
                                          src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest/scale-to-width-down/1000?cb=20260717131751"
                                          className="w-4 h-4 brightness-0 invert opacity-60"
                                          referrerPolicy="no-referrer"
                                          alt="Search"
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const SpeechRecognition =
                                            (window as any).SpeechRecognition ||
                                            (window as any)
                                              .webkitSpeechRecognition;
                                          if (SpeechRecognition) {
                                            const recognition =
                                              new SpeechRecognition();
                                            recognition.lang = "vi-VN";
                                            recognition.interimResults = false;
                                            recognition.maxAlternatives = 1;
                                            triggerToast("ƒêang l·∫Øng nghe...");
                                            recognition.start();
                                            recognition.onresult = (
                                              event: any,
                                            ) => {
                                              const speechResult =
                                                event.results[0][0].transcript;
                                              setSettingDetailSearchQuery(
                                                (prev) => {
                                                  const prefix = prev.trim()
                                                    ? prev + " "
                                                    : "";
                                                  return prefix + speechResult;
                                                },
                                              );
                                              triggerToast(
                                                "ƒê√£ nh·∫≠p: " + speechResult,
                                              );
                                            };
                                            recognition.onerror = (
                                              event: any,
                                            ) => {
                                              triggerToast(
                                                "L·ªói: " + event.error,
                                              );
                                            };
                                          } else {
                                            triggerToast(
                                              "Tr√¨nh duy·ªát kh√¥ng h·ªó tr·ª£ nh·∫≠n di·ªán gi·ªçng n√≥i",
                                            );
                                          }
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-teal-400 hover:text-teal-300 transition-all cursor-pointer bouncy-btn"
                                        title="T√¨m ki·∫øm b·∫±ng gi·ªçng n√≥i"
                                      >
                                        <Mic className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>

                                  {!hasResults ? (
                                    <div className="py-12 text-center text-white/50 space-y-2">
                                      <AlertCircle className="w-10 h-10 mx-auto opacity-40 text-rose-400" />
                                      <p className="text-sm font-semibold">
                                        Kh√¥ng t√¨m th·∫•y k·∫øt qu·∫£ ph√π h·ª£p
                                      </p>
                                      <p className="text-xs opacity-60">
                                        H√£y th·ª≠ nh·∫≠p t·ª´ kh√≥a kh√°c ƒë·ªÉ t√¨m ki·∫øm
                                        l·∫°i.
                                      </p>
                                    </div>
                                  ) : (
                                    <>
                                      {/* Header bar toggle */}
                                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between mb-4">
                                        <div className="space-y-1 text-left">
                                          <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-semibold text-white">
                                              Header bar
                                            </h4>
                                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                                              M·ªõi
                                            </span>
                                          </div>
                                          <p className="text-xs text-white/60">
                                            Hi·ªÉn th·ªã thanh Header bar tr·∫Øng c·ªë
                                            ƒë·ªãnh ·ªü ƒë·ªânh m√†n h√¨nh (Always on top)
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

                                      {/* Backdrop Glow Toggle */}
                                      {matchGlow && (
                                        <div className="space-y-3">
                                          <label className="text-sm font-semibold block text-white/90 text-left">
                                            M√†u S·∫Øc √Ånh S√°ng N·ªÅn (Backdrop Glow)
                                          </label>
                                          <div className="grid grid-cols-2 gap-2.5">
                                            {[
                                              {
                                                id: "cosmic",
                                                name: "Cosmic Glow",
                                                color:
                                                  "from-pink-600 to-indigo-800",
                                              },
                                              {
                                                id: "deep",
                                                name: "T·ªëi gi·∫£n",
                                                color:
                                                  "from-neutral-800 to-slate-900",
                                              },
                                              {
                                                id: "aurora",
                                                name: "C·ª±c quang",
                                                color:
                                                  "from-teal-600 to-lime-900",
                                              },
                                              {
                                                id: "sunset",
                                                name: "Sunset View",
                                                color:
                                                  "from-rose-600 to-amber-900",
                                              },
                                            ].map((item) => (
                                              <button
                                                key={item.id}
                                                onClick={() =>
                                                  setBgColor(item.id as any)
                                                }
                                                className={`p-4 rounded-xl text-left text-xs font-bold relative overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-98 cursor-default border ${
                                                  bgColor === item.id
                                                    ? "border-white bg-white/15"
                                                    : "border-white/10 hover:border-white/20 bg-white/5"
                                                }`}
                                              >
                                                <div className="flex flex-col h-full justify-between">
                                                  <span className="text-white font-bold mb-2">
                                                    {item.name}
                                                  </span>
                                                  <div
                                                    className={`w-full h-2 rounded bg-gradient-to-r ${item.color} opacity-80`}
                                                  />
                                                </div>
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* AMOLED Dark Mode Toggle */}
                                      {matchAmoled && (
                                        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-left">
                                          <div className="flex-1 pr-4">
                                            <h4 className="text-sm font-semibold text-white">
                                              AMOLED Dark
                                            </h4>
                                            <p className="text-xs text-white/60 mt-0.5">
                                              Ch·∫ø ƒë·ªô si√™u t·ªëi gi√∫p b·∫£o v·ªá m·∫Øt
                                            </p>
                                          </div>
                                          <button
                                            onClick={() =>
                                              setAmoledDark(!amoledDark)
                                            }
                                            className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none relative cursor-pointer flex items-center ${
                                              amoledDark
                                                ? "bg-[#34c759]"
                                                : "bg-white/20"
                                            }`}
                                          >
                                            <motion.div
                                              animate={{
                                                x: amoledDark ? 20 : 0,
                                              }}
                                              transition={{
                                                type: "spring",
                                                stiffness: 500,
                                                damping: 30,
                                              }}
                                              className="relative w-6 h-5 flex items-center justify-center group"
                                            >
                                              <div className="absolute -inset-2 rounded-full bg-white/15 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 pointer-events-none" />
                                              <div className="w-full h-full rounded-full bg-white border border-transparent transition-all duration-300 shadow-md z-10 group-hover:scale-110 group-hover:bg-transparent group-hover:backdrop-blur-md group-hover:border-white/95" />
                                            </motion.div>
                                          </button>
                                        </div>
                                      )}

                                      {/* Dock to Sidebar Toggle */}
                                      {matchDockToSidebar && (
                                        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-left">
                                          <div className="flex-1 pr-4">
                                            <h4 className="text-sm font-semibold text-white">
                                              Dock to Sidebar
                                            </h4>
                                            <p className="text-xs text-white/60 mt-0.5">
                                              Chuy·ªÉn ƒë·ªïi thanh ƒëi·ªÅu h∆∞·ªõng ph√≠a
                                              d∆∞·ªõi th√†nh thanh Sidebar d·ªçc ·ªü
                                              c·∫°nh tr√°i m√†n h√¨nh
                                            </p>
                                          </div>
                                          <button
                                            onClick={() => {
                                              setDockToSidebar(!dockToSidebar);
                                              triggerToast(
                                                !dockToSidebar
                                                  ? "ƒê√£ chuy·ªÉn ƒë·ªïi sang Giao di·ªán Sidebar"
                                                  : "ƒê√£ chuy·ªÉn ƒë·ªïi sang Giao di·ªán Dock",
                                              );
                                            }}
                                            className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none relative cursor-pointer flex items-center ${
                                              dockToSidebar
                                                ? "bg-[#34c759]"
                                                : "bg-white/20"
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
                                              className="relative w-6 h-5 flex items-center justify-center group"
                                            >
                                              <div className="absolute -inset-2 rounded-full bg-white/15 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 pointer-events-none" />
                                              <div className="w-full h-full rounded-full bg-white border border-transparent transition-all duration-300 shadow-md z-10 group-hover:scale-110 group-hover:bg-transparent group-hover:backdrop-blur-md group-hover:border-white/95" />
                                            </motion.div>
                                          </button>
                                        </div>
                                      )}

                                      {/* Dock Customizer Section */}
                                      {matchDock && (
                                        <div className="pt-6 border-t border-white/10 space-y-4 text-left">
                                          <div className="flex flex-col gap-1">
                                            <h4 className="text-sm font-semibold text-white">
                                              T√πy bi·∫øn thanh ƒëi·ªÅu h∆∞·ªõng Dock
                                            </h4>
                                            <p className="text-xs text-white/60">
                                              B·∫≠t/t·∫Øt v√† thay ƒë·ªïi th·ª© t·ª± c√°c n√∫t
                                              ch·ª©c nƒÉng xu·∫•t hi·ªán tr√™n thanh
                                              Dock b√™n d∆∞·ªõi.
                                            </p>
                                          </div>

                                          {/* Miniature live dock preview */}
                                          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center">
                                            <div className="w-full max-w-[340px] h-12 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-around px-2 py-0.5 relative">
                                              {dockItems
                                                .filter((item) => item.enabled)
                                                .map((item) => {
                                                  const config =
                                                    getDockItemConfig(item.id);
                                                  return (
                                                    <div
                                                      key={`preview-${item.id}`}
                                                      className="flex flex-col items-center justify-center text-white/50 w-8 h-8 animate-fade-in"
                                                      title={config.label}
                                                    >
                                                      {config.isImg ? (
                                                        <img
                                                          src={config.icon}
                                                          className="w-4.5 h-4.5 object-contain opacity-70 filter brightness-0 invert"
                                                          alt={config.label}
                                                          referrerPolicy="no-referrer"
                                                        />
                                                      ) : (
                                                        (() => {
                                                          const IconComponent =
                                                            config.icon;
                                                          return (
                                                            <IconComponent className="w-4.5 h-4.5" />
                                                          );
                                                        })()
                                                      )}
                                                    </div>
                                                  );
                                                })}
                                            </div>
                                          </div>

                                          {/* List of dock items with toggle & reorder controls */}
                                          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                                            {dockItems.map((item, idx) => {
                                              const config = getDockItemConfig(
                                                item.id,
                                              );
                                              return (
                                                <div
                                                  key={item.id}
                                                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-200"
                                                >
                                                  <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/80 shrink-0">
                                                      {config.isImg ? (
                                                        <img
                                                          src={config.icon}
                                                          className="w-5 h-5 object-contain filter brightness-0 invert opacity-80"
                                                          alt={config.label}
                                                          referrerPolicy="no-referrer"
                                                        />
                                                      ) : (
                                                        (() => {
                                                          const IconComponent =
                                                            config.icon;
                                                          return (
                                                            <IconComponent className="w-5 h-5" />
                                                          );
                                                        })()
                                                      )}
                                                    </div>
                                                    <div>
                                                      <div className="text-xs font-bold text-white">
                                                        {config.label}
                                                      </div>
                                                      <div className="text-[9px] text-white/40">
                                                        ID: {item.id}
                                                      </div>
                                                    </div>
                                                  </div>

                                                  <div className="flex items-center gap-1.5">
                                                    {/* Up/Down buttons */}
                                                    <button
                                                      onClick={() =>
                                                        moveDockItem(idx, "up")
                                                      }
                                                      disabled={idx === 0}
                                                      className="p-1 rounded bg-white/5 border border-white/5 text-white/60 hover:text-white hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none transition-all duration-150"
                                                      title="Di chuy·ªÉn l√™n"
                                                    >
                                                      <ChevronUp className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                      onClick={() =>
                                                        moveDockItem(
                                                          idx,
                                                          "down",
                                                        )
                                                      }
                                                      disabled={
                                                        idx ===
                                                        dockItems.length - 1
                                                      }
                                                      className="p-1 rounded bg-white/5 border border-white/5 text-white/60 hover:text-white hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none transition-all duration-150"
                                                      title="Di chuy·ªÉn xu·ªëng"
                                                    >
                                                      <ChevronDown className="w-3.5 h-3.5" />
                                                    </button>

                                                    {/* Toggle active / inactive switch */}
                                                    <button
                                                      onClick={() =>
                                                        toggleDockItem(item.id)
                                                      }
                                                      className={`ml-1 px-2.5 py-1 text-[10px] font-semibold rounded-md border transition-all duration-200 cursor-pointer ${
                                                        item.enabled
                                                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                                                          : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white/60"
                                                      }`}
                                                    >
                                                      {item.enabled
                                                        ? "Hi·ªÉn th·ªã"
                                                        : "·∫®n"}
                                                    </button>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>

                                          {/* Toggle: Merge search into dock */}
                                          <div className="mt-4 flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all duration-300">
                                            <div className="space-y-0.5 text-left">
                                              <div className="text-xs font-bold text-white">
                                                Nh·∫≠p n√∫t t√¨m ki·∫øm v√†o thanh dock
                                              </div>
                                              <p className="text-[10px] text-white/50">
                                                T√≠ch h·ª£p tr·ª±c ti·∫øp n√∫t T√¨m ki·∫øm
                                                v√†o thanh dock thay v√¨ t√°ch
                                                ri√™ng ra ngo√†i.
                                              </p>
                                            </div>
                                            <button
                                              onClick={() => {
                                                const searchItem =
                                                  dockItems.find(
                                                    (it) => it.id === "search",
                                                  );
                                                const searchEnabled =
                                                  searchItem?.enabled ?? false;

                                                if (!mergeSearchToDock) {
                                                  // Turning ON. If search is enabled, the new rendered count will include the search item.
                                                  const otherEnabledCount =
                                                    dockItems.filter(
                                                      (it) =>
                                                        it.enabled &&
                                                        it.id !== "search",
                                                    ).length;
                                                  const newRenderedCount =
                                                    otherEnabledCount +
                                                    (searchEnabled ? 1 : 0);

                                                  if (newRenderedCount > 5) {
                                                    triggerToast(
                                                      "Thanh dock ch·ªâ ch·ª©a ƒë∆∞·ª£c 5 m·ª•c",
                                                    );
                                                    return;
                                                  }
                                                }
                                                setMergeSearchToDock(
                                                  !mergeSearchToDock,
                                                );
                                              }}
                                              className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none relative cursor-pointer flex items-center shrink-0 ${
                                                mergeSearchToDock
                                                  ? "bg-[#34c759]"
                                                  : "bg-white/20"
                                              }`}
                                            >
                                              <motion.div
                                                animate={{
                                                  x: mergeSearchToDock ? 20 : 0,
                                                }}
                                                transition={{
                                                  type: "spring",
                                                  stiffness: 500,
                                                  damping: 30,
                                                }}
                                                className="relative w-6 h-5 flex items-center justify-center group"
                                              >
                                                <div className="absolute -inset-2 rounded-full bg-white/15 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 pointer-events-none" />
                                                <div className="w-full h-full rounded-full bg-white border border-transparent transition-all duration-300 shadow-md z-10 group-hover:scale-110 group-hover:bg-transparent group-hover:backdrop-blur-md group-hover:border-white/95" />
                                              </motion.div>
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              );
                            })()}

                          {activeSettingSection === "search" &&
                            (() => {
                              const isMatched = (text: string) => {
                                const q = settingDetailSearchQuery
                                  .trim()
                                  .toLowerCase();
                                if (!q) return true;
                                return text.toLowerCase().includes(q);
                              };

                              const matchCat =
                                isMatched("Danh m·ª•c") ||
                                isMatched("ƒëi·ªÅu h∆∞·ªõng") ||
                                isMatched("tab") ||
                                isMatched("menu") ||
                                isMatched("home") ||
                                isMatched("live tv");
                              const matchVApps =
                                isMatched("V-Apps") ||
                                isMatched("vapps") ||
                                isMatched("tr√≤ ch∆°i") ||
                                isMatched("game") ||
                                isMatched("arcade") ||
                                isMatched("caro") ||
                                isMatched("files") ||
                                isMatched("learn") ||
                                isMatched("calc");
                              const matchVPremium =
                                isMatched("V-Premium") ||
                                isMatched("vpremium") ||
                                isMatched("premium") ||
                                isMatched("vip") ||
                                isMatched("vbank") ||
                                isMatched("storage") ||
                                isMatched("cloud") ||
                                isMatched("verified") ||
                                isMatched("t√≠ch xanh");
                              const matchNews =
                                isMatched("Tin t·ª©c") ||
                                isMatched("news") ||
                                isMatched("th√¥ng b√°o") ||
                                isMatched("discord");
                              const matchChannels =
                                isMatched("Truy·ªÅn h√¨nh") ||
                                isMatched("k√™nh") ||
                                isMatched("channels") ||
                                isMatched("live") ||
                                isMatched("tv");
                              const matchChannelNumbers =
                                isMatched("T√¨m k√™nh theo s·ªë hi·ªáu") ||
                                isMatched("s·ªë k√™nh") ||
                                isMatched("s·ªë hi·ªáu") ||
                                isMatched("channel number") ||
                                isMatched("ch");
                              const matchToolbox =
                                isMatched("Toolbox") ||
                                isMatched("c√¥ng c·ª•") ||
                                isMatched("ti·ªán √≠ch") ||
                                isMatched("multiview") ||
                                isMatched("m3u8");
                              const matchSettings =
                                isMatched("C√†i ƒë·∫∑t") ||
                                isMatched("settings") ||
                                isMatched("c·∫•u h√¨nh") ||
                                isMatched("giao di·ªán");

                              const hasResults =
                                matchCat ||
                                matchVApps ||
                                matchVPremium ||
                                matchNews ||
                                matchChannels ||
                                matchChannelNumbers ||
                                matchToolbox ||
                                matchSettings;

                              return (
                                <div className="space-y-6">
                                  {/* Section Header with Search Bar */}
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-3 text-left">
                                      <div className="w-12 h-12 flex items-center justify-center shrink-0 text-white">
                                        <Search className="w-6 h-6 text-sky-400" />
                                      </div>
                                      <div>
                                        <h3 className="text-lg font-semibold text-white">
                                          T√¨m ki·∫øm
                                        </h3>
                                        <p className="text-xs text-white/60">
                                          T√πy bi·∫øn c√°c danh m·ª•c k·∫øt qu·∫£ hi·ªÉn th·ªã
                                          trong thanh Spotlight Search (Cmd + K
                                          / Ctrl + K).
                                        </p>
                                      </div>
                                    </div>
                                    <div className="relative w-full md:max-w-[280px]">
                                      <input
                                        type="text"
                                        value={settingDetailSearchQuery}
                                        onChange={(e) =>
                                          setSettingDetailSearchQuery(
                                            e.target.value,
                                          )
                                        }
                                        placeholder="T√¨m ki·∫øm c√†i ƒë·∫∑t..."
                                        className="w-full pl-10 pr-10 py-2 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-white placeholder-gray-400 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.3)] focus:outline-none focus:bg-white/15 focus:border-white/20 transition-none text-left"
                                      />
                                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                                        <Search className="w-4 h-4 text-white/60" />
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const SpeechRecognition =
                                            (window as any).SpeechRecognition ||
                                            (window as any)
                                              .webkitSpeechRecognition;
                                          if (SpeechRecognition) {
                                            const recognition =
                                              new SpeechRecognition();
                                            recognition.lang = "vi-VN";
                                            recognition.interimResults = false;
                                            recognition.maxAlternatives = 1;
                                            triggerToast("ƒêang l·∫Øng nghe...");
                                            recognition.start();
                                            recognition.onresult = (
                                              event: any,
                                            ) => {
                                              const speechResult =
                                                event.results[0][0].transcript;
                                              setSettingDetailSearchQuery(
                                                (prev) => {
                                                  const prefix = prev.trim()
                                                    ? prev + " "
                                                    : "";
                                                  return prefix + speechResult;
                                                },
                                              );
                                              triggerToast(
                                                "ƒê√£ nh·∫≠p: " + speechResult,
                                              );
                                            };
                                            recognition.onerror = (
                                              event: any,
                                            ) => {
                                              triggerToast(
                                                "L·ªói: " + event.error,
                                              );
                                            };
                                          } else {
                                            triggerToast(
                                              "Tr√¨nh duy·ªát kh√¥ng h·ªó tr·ª£ nh·∫≠n di·ªán gi·ªçng n√≥i",
                                            );
                                          }
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-teal-400 hover:text-teal-300 transition-all cursor-pointer bouncy-btn"
                                        title="T√¨m ki·∫øm b·∫±ng gi·ªçng n√≥i"
                                      >
                                        <Mic className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>

                                  {!hasResults ? (
                                    <div className="py-12 text-center text-white/50 text-sm">
                                      Kh√¥ng t√¨m th·∫•y t√πy ch·ªçn t√¨m ki·∫øm n√†o ph√π
                                      h·ª£p v·ªõi "{settingDetailSearchQuery}".
                                    </div>
                                  ) : (
                                    <div className="space-y-3.5 text-left">
                                      {/* 1. Danh m·ª•c */}
                                      {matchCat && (
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
                                          className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/10 transition-colors select-none"
                                        >
                                          <div className="space-y-1 pr-2">
                                            <h4 className="text-sm font-semibold text-white">
                                              Danh m·ª•c & ƒêi·ªÅu h∆∞·ªõng
                                            </h4>
                                            <p className="text-xs text-white/60">
                                              Hi·ªÉn th·ªã c√°c tab v√† ƒëi·ªÅu h∆∞·ªõng h·ªá
                                              th·ªëng (Home, V-Play, News, v.v.)
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
                                      )}

                                      {/* 1.1 V-Apps & 5 Tr√≤ ch∆°i Ore UI */}
                                      {matchVApps && (
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
                                          className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/10 transition-colors select-none"
                                        >
                                          <div className="space-y-1 pr-2">
                                            <h4 className="text-sm font-semibold text-white">
                                              V-Apps & 5 Tr√≤ ch∆°i Ore UI
                                            </h4>
                                            <p className="text-xs text-white/60">
                                              T√¨m ki·∫øm V-Arcade 5 games (Caro XO, K√©o b√∫a bao, N·ªëi t·ª´, ƒê·∫øm s·ªë, R·∫Øn), V-Files, Explore VN, V-Learn...
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
                                      )}

                                      {/* 1.2 V-Premium & V-Cloud VIP */}
                                      {matchVPremium && (
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
                                          className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/10 transition-colors select-none"
                                        >
                                          <div className="space-y-1 pr-2">
                                            <h4 className="text-sm font-semibold text-white">
                                              V-Premium & V-Cloud VIP
                                            </h4>
                                            <p className="text-xs text-white/60">
                                              T√¨m ki·∫øm c√°c g√≥i V-Cloud Storage (50GB, 200GB, 2TB), Ng√¢n h√†ng s·ªë V-Bank & Verified T√≠ch Xanh
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
                                      )}

                                      {/* 2. Tin t·ª©c */}
                                      {matchNews && (
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
                                          className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:bgxúÏ}}o«’Ôˇ˜SLî∂†Zë‚ãh[™’¿ñì8àÌ∏ñ‚ˆÅ`$ÀÂàªèñªõ›•$>éÅ'(Ó.äã∆∏(ä¢∑h\#ËÌãëÈÉ¢ä¸A#ﬂÉ˝$œúô}%ó‰ú!%ÀÚNE§vfggfœ¸Œôs~ß|hò]≠UI‡i∂o¶cóu«r<ü¯‘¢zP∂õ.˝"Y~$}%!W€Ê—-Õ˜Ôh]∫π‰ªöNÀ˝rç∏^πæÑiä5f¨•€
ËQPˆªdœ±Ÿˇi◊l9Võo˘##['d«¥I0<˘£éÎ’™±Ü|wÏ1é¸T«W/U—}øiO~∆∫oO~NÙ¡ù¥üõ‰¿ê z≤d≥Å1¯õ›am=qà><˘5˚˝˘„·…ˇeˇ?|N¸·…Wdü›˙SŸ”◊ØçiµˆVŸ‚√.VTáíY|¯·aπIˆüÁÙÏ6móªm≤g—#¬Ê≥Îóuj‘#ˇﬁÛsØ}LΩêöeﬂL{ø\%-62ÏœﬂyàTﬂuÀÏ¡6’<›ÿ¶õ¯é_±È°èläê7»R´Sˆ˜˚Âf5Íˇ∏∆>&ãïıZk;áÂ›Í’jU˜ËØ”“JÕK+µ+Î+ıµ++’ ⁄ÚyÒï~ÒB4£˚ãèı*1úÍmdæ]´‚nÚË√GàÎq/‰√iSAæ˜=RBé«’-ÉÍ˚iπqXnT`…¡O?ú}Zﬁm<X"´∏û.c˘J°.gëºÚ·Í˜I£Bvº^xÚâMå¡_lÉ|UˆIvµ@7∂Õ∂©ÖúçIn/CK«ﬁ≤L}Ûaiôl˛à`Éki˝ªéª≤©¥¸C¨X°¡v˛r∆ÆbBJÆG¯3î∞•R©@ÿmäŒ˜yö®DüÒm=Z∆÷A˘#Ã;ôﬁÜñ‹ÚZºYdLÄfÂ(√Ñì˜®)µIGsÀ¢˜<ﬂÒ ÆcÚãBÒ€)/\bÌBÊÈCL2"µ∞›CcÕ”Aõ#x≥≠1˘Î3–iê˝¡üÿÔA¯êËfÖ(<Ü+uÜZxuŸ=®C÷.[u√„ø„–9€|›=Cè7
q*`NÖΩ‡¸·Œ…»3≤
Ú˙E„œ3@†XäéSp®ÆÑ~¢rjhâGUî<QQC¿ÕZÖ‹û|°3i2<˘(√–b9áÜ†º›4Ω”Î∂®ß0
‚cN0Iàπß∞fym·RbY°zûç≈¿ÛbË≈¢ËπqÙ\H:∆“·¢›PjÉdqxÿñJxç»—ò<ªIw-∂CªÁïÇàt˚SÁı›j•⁄xm6Vπ˝⁄è~Q«S!˙˘Ÿıg™Ò‡Ñh@qowò™`–B§›ÿN Ä»9§Ì‰&—Üﬁ∂ˆIöOñóäÓ3ﬁ‰¯¬ÇÖ§“2kõıœŒ”Drt+ò◊FUE-ÅÚØˇı5Ÿ¸•È"†>¯√ì«ƒ CuOI‡O∞
è∞êgwè 5!™ïz$ƒ≥ÔÆªGƒ†t€øÒ°I–0¿œÙ@ç(˜—U’‹∫I^?√RPöxµq≈v∑VÉ—K)∑Mµ1ÿ2‚É?∫§3¯/±zƒj*ûë6Ç§¶≤WU´µÚz≠æ∂◊\Ê*?c
.[±6ú¯•â÷Rá\jéÍ™k\IÄü—¢ ÍÏçã¡≈∑"•7REæ≤H]xÜ6åoª=‚7H9Ì˜‘ÊYM≥Üí´]Én=üf©]´¥∞Uù:≈•µ
Ÿq´Â°èí¢zËì$ƒ Õ•¥œ£ª.NoùKgU÷W19—±O¯€V«D2J∑ºHß=◊ïH¨≤·H§s ùa^8ë9˘‘&Ég:C¬?•]d€ÔﬂªµBvå¡üB›lÖ‹1Ü«œ‹’üˆÜ«_‰v„}Ï{yªgÊÅIWòÄ¿ôw¢eŒ	7î}¢s1=ä!J·TîÄÄÕ
ŸØI¶ëˇ=@√¿hJ
8ΩºËáΩçÄ`Ùπ@Ç<E$ò(v˘!∏ŒZ/<ıf˚Ÿ,¥˜ÿÓ¨êé©9§ÕQÂ
w˚yJÏÁ?ΩÀ«réMŸŒ≈⁄P˙N-ì†H$Rd8Z^2Ùïà(Ø4\hõÌIµ5/<Z.Mµ5ùiƒ4\€l+fÔ=Ÿ‹‹$KÆÁÏô]öeˆ.…aK›±˝Äò˛m ø¥M6I	ﬁ’XÏ÷í¯T¥Ú´Æ◊4–LK¨Â˜®◊ó¸
ªc∑$£ˇ3}ÈñsHΩ-Õß2|ù^˚h9tè/:ªRt1çÏ˝*¶≠[Ω6ıKÕº˜£Œ“]ƒ–q›„-ÌÄlŒ~òhÆJK;√ì_≤=ímæÀè"ˇmßXgÿ∫¥L>˛”ZÍjuè_kËJ{⁄Å„1IÏ/Õ«‘(m±}—È‚JN ën7]1.≈ø∑—ùNAW’yœ—’∫çﬁ≈	¡´ÂÙ⁄»Âó
, ßÌÉs˜S;ˆ˝Óıá«ﬂ‡áXteªoÎË™œûtIw˚æBUZmnÕT®-"*[√ì_„◊Tj`“§fÕ–¸{‘ÔYÅ/1k±|˘¯„Ã[Ñ!üy„P$Œ∆!ì¥ªKR òq¢=Ô&’ ﬁöÅAƒvBÆkû§Y'◊
~ÄöK∫Ì˛ªÁ¬Ô3ÈµT∂∆4q∑U^ì‘À‰¸≥1[t/ê÷˜F[>,◊ÍÎ±3ïãXõPRíØæÔ≥62wæƒn|	Å+Q®Ô*Pç1ù⁄Í,∆8∞ìñzﬂ#7Ü'_ã{®!Æ—@<ÃÇÌœ?Kƒ1ÿû∫4•∞ W„πŸ†Õ—∂¶ºû≤¶Dª¬ïÌ	}«Ó˝Û
bº§{ƒ¢¬\:Úöy‘“ ¨ì√Ú^œ‚b•´ïôÜ[ø¬‘€ÚÔØiª=y+G–w√% Ø∆hVèn>ú“Â’:«Üòák´DAG@,∞AO∏?N¡•ï@Û:4®ß¬tÂœÂGƒµÿg0YBΩÕ%·∫
À†fl¡™T*Úsïëß|eπVˆèˇÏócßSÒ◊qÔÍ±mjäªÆ∞Õ§¢‹Ò4aªâ6¶Õ¶ÓÉj•ÈE?#ÎMΩŸ\â˛´VÀ‡¸ –ÓÜ”,”¶¬9]|ït≥}3b™IY∫xΩd'î;˘]g‰U÷Zæcıÿ8¿›∏ë$p‹rmµN ºSÏEÁ6ÍUâ-5¥∂óÈ˚ÏK:BŒõ›ÊùÚÙÕ%#\cu’ò<“+áÊæ©UlGwú}ìVl¨R∑‹¶Œ™Ÿ’:‘_≠Ø÷k´‚Ì3åäkwV=z`˙l‹W·A˝`’◊5ãñß|h∂£ÃVÅÕñQµ˙Üﬁ⁄¨WÎó™ókókç⁄ÂfcIÀ,Ï5p%%-L_6ı}ÜAL˚Äzâ\˚/°Ãt›£ûGΩªéeÍ˝Õ%€)G_aö—¨`sIåç|µSB;≠^8Ú&t±/àJÚ}ü„HR®#€.•∫qèÍN«6Öπ
%ÕKá¶Õ—|¢Ÿ˝Â x{:’îë∂” !mÌõ¡X/0Å`vk`y‹+F◊SWBlz8>;ÿì„T*€˘…&Y:0À˜Ô,©∑√§ŸçµX≤ßYæÑenR{v]≥Xì6«c–`◊X¿ƒPáz;éÊL•ˇûì!÷/¡,–1(lﬂsìÀ^0œ∏;∂«á
å¥»5¿w°xêﬂ*¡•b…˙·í=FÁWƒ˚ª’Ïﬂ
ﬂÑuœt˙ìÖÄN(âÔÉJ‹Ç÷ƒûyƒfR8¥ Zæ«ÀºÚ≤DîcêÔ∞(°1(|êdÊﬂﬁ£S¶cyπ—˝c“Ä©±¬8»Fl‰yOõKfô¡∞è„ùwë1Á‰‹û¸ ”"‰ËÛ4+èe{r\Êï•è{v¥Å›‡”ÄÏcΩ¡F*r“Ä≈láû§√˛˜`£|m.ù¶wîºÓ-iû«U
0§NR·ÀóôÚq9´Eè;GÕˆÃ ˝4†ö≈µe—@ÚÑvé¯nå¯cµÿ˝ı~π ‡z`Õ⁄Z√„Øÿ¸eÊQ≤=Ñ^z€‘s8î•W®&∂À…SÇ<|-urÚÜ§Xµ∏}∞´ÛYNØÇ(^ï‡)ÂÆ^≥ò÷ªez∫EG¨¯U∞‚WI˜®¨ıá§bﬁ˘M=«ß<Ñ1	„f‰Q9Ñ±‚]!ZxÙk¿Ñ }≤œ-ªıÜ«O!˜ wû∫“KDﬁƒõkOô‰ü‚Ê‡iü;µ=∑y8/˛3»M∞ä` OE˘äóN∫q¶E<1eç‹“œ/Ô◊¬Pû⁄Bè≤ÏÒ{øJóÁciLª«÷•¸c£æsCﬁ¯Q…ï™¬!¬¯ÒL?Û2DÃÙ˘U°å•6òd^]WãƒüÍßÇÔÆ*EAÓcrÇ˛àÑ¸Ú˝:√◊-2˜®\l±„¶“`<å›^*µ;ÅÒHëÕBmîX∆˙L~D™ä¥cHsfRÊ¶ºÇ¢H{Ö)Ó{¶◊U≠Œ ˘u∂∞8¯:&‡¸ìÄß©Éœmq
ÀâÖávÍˆ$&OäöYk¶LäOÉ∑¢’R⁄}†¿≤„ŒÎ®Tu˛¢7∆é÷<ˆ;±‘™âä}1π¿Áq&ó¯™Ê=†M˜4∞ëÂH]¡ÖÇ∑Î®»•üÚu»c8uÄm©≈ß ö0 ?)h‚@$EÅÍ&üvô¬Ô˘F∆9&ÉRöHﬂkïgPÓ˜+âU&ªäû†b⁄m≥„úR´…˙KWr;^`Ö2≥${w€ys^*»≤ïY1nyâpã√Ù8{yº/xëo¯tÇÎSa3‰;é„Å/!_m£∆ú‘üjâ«¢Z€¥a%[⁄Qƒ∫^ZØ™⁄u∆Kºπ¶€á7•€*◊ê[™d∞¶ªÿ≠qgåΩ"6˜˘g©há¨s⁄'—˙Ûœ¢–Ú‹/∂ún∑gõAü$òˆk<S’∑û<’¡ä¸$Ä1fÆ§]≠CÔlTàˆqÓﬂ¿˙ˆØ=>_ÜæÑBﬁÜø˝∆ä9êÜˇqÉ { W∫ÂËöµ∞e‘°ÀáÁ" rZ@§¶Î‘˜Õñi±•VÑE^º∞»kΩ¿Ÿ∂Ã6EG~≈1+$º<˛ñÇÓ †5_uzèÆ’$S%ê-0z›ñÕ÷*˛F˘&ÎÊ6˚Ø•ysåı¯è6	õAwûWˆ+√ÒhŸPk’;v©›Sò @´-ÜSO1ÿ/yk¢S∏ë.¢˝äh?•høwiˇ’ˆK®m‡ÌEF˜Ì˛¡¶ä¡÷ˇÕ‰M»ôP£±›Âò;9<6	`_pt@4æoÄÂGh¡∑˝ˆ	wa˜‡¥?˚£	^”Ä≤ª‹}—∂˚lXƒ1Åôí∏.íÖAÅSK¯Ú&$U”/ÅÅE``XŒlØúXä¿¿"0pB)eJ([ä¿¿‹ãã¿@Qä¿¿ã+qEp`XN)/p†¬˘˚ΩÁÇË€ SéÍ—	\ísœ9ù‘z˛›Z2“  KÊ›:NÖqŒ≤`Lô%\?O#+∆®K >K_m±Ôû¸éoœ~Äˆ·P>=√ÜcÂk=àÏ˙ïIBﬂ‰∏©§¥òc!éÏÇTrõœ—êü)Ù±(Ω¶Eøbuh¨Kv6Ω?äøîê.è«Oµ”Óyˇ,‚9∆NH‚≥ƒt8?“(«„£†ÁãÑªØ7÷ÙÀÕu•åƒQ˚GG7ÅÕ?å>È:\WV…ô≠Ÿ&€èÿrP1m$3√∆π^e#U≈GS($ÎS≠Áp»¿f’w¡MR) T®=8ÒŸ Õ™¬C“÷∫.ª˚iúÕòÂ¸_‚)~f*â&$\Ï¬Wà)õt™YÊ'∏ìœçõ1`ÆäæñÖ"}[É√`~$∏ûΩ@|Y◊rcÅû˙y'¢*i±«›°Ñ÷.˛ó˚l#(é˜“’<÷èâ=n$'ﬂ›6˘Pºry‰[vøt€ô?i˙~€s‹rÀÍy–dÊèitπéçÂÉ≤ö0‰÷≠s~r@ÊÍi∑T%≠"Ì[Ëß®[§gÍhYΩ…Ëë‚∏õR·ûƒ»Ü[úEﬂ<Åÿ32‰∂M¶±Ùÿ›∏ÖÉ›GΩC+p¿S©TÇÚÓyP
ÂE¶Ñ KJ“®DÓr≠'’⁄Rn◊Bg )/ZgJÔ“ÖÊÑ,ÖÊ4^
Õ©–úP5œùÊ¥–6_Çà`z‰Ç˚ [2öU_ºÄ`vè[&ÿz•z{7‚2’ÂúW B˙¡ﬂÂ 0¿·4>Ò„˚Qe÷%ˆI)udÿt]KÒûú– n¸)>©a!∂j¨n¶Æ'›#VO–QÑßÔaD∫◊€ÅGµ.ÅŒ æ:À”a –µ<'¶º?J∏0p·ﬂ›ñ	{,jöü÷6;lV>±#3∫„7˙∂÷5uu„mÀ9ƒáã ¯QSπôx`ÖjmÍ®ÑÙèü¿JÇú◊˚Ô0êhYfáâ	,Åw¥ˇ$√„ßyÀÙ®Pj°{Ø^3œH¿¿ßÇÇ8«û‡áO3ÒkÇvM_M74¸˙k9jNÔZZø√Å9R™•MVå∆“ï”Î†{~Û÷6	k“)¸Ûè˜›Ü´~{•¸⁄]wﬂGAazäƒ)t$—Ω‘-{u$£eØœä ŸZ…z*à*
¢
%¢äÎT€USg§)¬≤"È*ﬁgL ^AWë¡=°ﬂQxG1ÊI¶«ˆ9:8)ÁßHS·q¢9.úQçä≥0A>7¬xWPW‘uE¶‘uÖt)®+“•†Æ(®+rDj‘ŸRPW‘≤•†ÆòV
ÍäºRPWL)u≈ÙRPWåóÇ∫¢†Æ(®+&îÇ∫¢†Æ»+uor˛º÷q`©mêî√:ò,uB{ˆqd3ì2.(yRi^\–⁄Èáõ…x"õ,ç9‚tüÛªˆ6OA˙¡aWèÏÛ∫¿‡iëtírä#7om#€•NÜû™ﬂöl«◊Ï8· 2î(©H3˜,"’ÀÊ
+ÛiÊëõù“k4˝∑Lq1Á!Œ+v"@|eÜ	≠¿ÕÍ5W†.Ã)xîCºÊ:⁄»Œárp:Liæ¿Æy√∫ÊÍö#§=RgŒ5oÇÍã •»ï…BﬂT5L
$uÍl§æAR1çÍE≠–Á7v Ä~v¿)âŸE6∆ã\,ø√Ω›t¿Óøûàúrf:ˆÀΩk∑√ÒCÔé°2êÒ$'˛‡Î0ΩÏWê˝â›ªó∞™n*¢• Ú»s9√1<ˇ≠ÄÔìJ4BrèÀ"ê{àƒ≈vÅUKóU®z∆-/™nldb:ÒƒkaÂWÁ7v ∏zbÑ/)Ö!ª»”ã·ÇÍp‰òPA’6hÌ·…ÇÂ-∑‚ä–Un;Ô>«“ºÒê·åa~ˇ*:∂c˙…¯õûò%t”".F∏Up‰^`lÜ±√U
ãî#Ì‘ÁoO*Ÿq*Pw\^†Ω<5!Ö¡\Æ–>)¥/†}∂§†}LÎÅıYFÄ⁄K5ñë/Ôà∑{ *!ìàc∞E~VáπùYGÂôˆ9p
Wäxº›uX-¸π˘3≥u„@¬Zf˚‹Ñ´¬Ø WeWSÍ⁄FïÙ\óz∫ÊSê[˙>®á∑cYá°‹û¸∆Dè<8V·…œT£Jå5¯úiNSB•XÅÓ¢âl∑kBÏ¬'SÑ‘◊∞ õåOôéh7·›-8¿‡~Iø√∂4ﬂ>Ù9“ΩÅ¡Ä˚®1}Û¯œÏ>ﬂ>±W`ê–ΩÊáAf™s‚ΩÖ¯Ó/ubq5SÙ?∫yãˆ‡¨√ ÙPŒøé©Mf”√˚öE6	®òô=Q!ÏÕë&J¢utHÁÄÎ*ƒÇAPö·äÆîx#∫8ç›/ΩéùôÂBÀéÀ‘≤≥x∂–≥•J°g'•–≥=;[@œﬁbÎ–I3+¢ÌT’ò±h—⁄Ù9;#õI´IJ¯‡à1VÕsxXÜ©ªÇ 3õ™«Ÿû|?B6]O¶*}ÓÑ«b˚±∫ò∆≥}⁄loË-ˆ‹ûåÂôáT,BHû6QTÿ⁄D	9€ÄèI¨Ò˜=ªùœA◊&
€Sw“(e…◊N;˝QÜ\Ìé |˛8vÃ‰:}VÇàÂ‘à◊Ÿw≈Ω& »b´‰Œ¿ºVIã˜jFºœ`_ÁYo§ŸŸ&Pßd–&ı¡¥€f«âljh¢4Q∞Paâæe–≥3/Åä∂Yzu·ï∞©µA¬_»¶RÉ¨gÌûC£›SJDDàÕñkÂV∏àÈùà‹Y≠Õû«.3djÌpÃ:óÂHUÏîÂtúûdiÁÕÌù9ZπﬁŸP™K∏BﬁÒÿ÷Ã@:∞€µ<≤Á9›Ëm∫ ﬂâ>≠W´JùDÚµà¬)ä,™¥ÆJï|v$ΩæU˙é∂@AÅ\|<≈Ãé÷*-YÏ,QÏ÷0èj;]ú'≤5!IØêDöÁ cÄÇìb†*ät<°^πûßV8©≈∂ØSV®8Obf‹3-+ƒ˙xeˆnB‚éƒÉÁ./BmV»˝·…íü\ªˇÊ6ŸzÔˆÌ˜Ôº≥Ûo§tÌ˙{ÔÔå~ΩåQTKÈÏ√ìO»!?,–£√9ö˝®å6v âîõ–Z∂(◊B˛S2MHNÆa¬ÈSíû™7¬^v`AU‡È ¿“ÚÚ|ÜÑ¨Ã§pÕ
±‹™sπÜøª·ñ/ùïïaÒ˝4í˝VÂz«ﬁs≤“©…më¸ÿp–ê®8ïhHã>ÿÕg£o¡yvr@>óS¿}xGŒÒv˙∞ŒÇ9ÍEŸâﬂlí~CWHÚ™‡qJ|˚¸1ûÎæv«»ÍŸæÛ)ﬁ‘œj=F€>ê∆‹Yû!˝E$2é¨Ö∏˛ús˙Í®ö*œƒ;'Yª√ì?r{˜YÁÔ&∫µ¯]&˜ËûG}„,ú|NÂùæõzëI˝RÂJ•AJ◊i†-ì˝ÁÔ…{≥—mrI∞AÓﬂπ∑√πì˜äOœOôWvÅpÓﬁiUÉä≈∑(sc $ﬁu‹mê$X6c(±ÆòMG™¢ÏÜòS!g;⁄Õb™ÊÿÒG/%ì3¢bÊgnà˝"Fï…Èdì…YaB;9Iˇ¨4OYÒƒ˚·A˘)wnÓÖ‡$ïN\›2ËÅÁÿ˜Äc4N◊8]S8É=wÔB€|	2!Y2[eõò-Úç)ÔimZ∏€ä	B•T≠ŸÍ’(˛ö7õô§B'Ö&Á.ãƒ^]†Œ)Ê◊¶0ø∫=œµÑîcﬂÕ¯AXŸ<n;#Ê	œ Kµ≥OôV]i>ê|ëÂ)jÂsMÂËòl¸Ú4Ãƒç: y$çÁÓzŒø≥7`TÇ¢–©ºûπH$:<˘ˇ	œq#ˆôüù≥ø√Ωéøël4G“ïˆ-óDäí´Dˆ2iËàÖãJQNÇÇ6√GRMH¡2)(KŒQf∞‚ØÍËl“1∞$¯<àLj%Ü¯Â€ñ‘·ã¿o?Ói}¡mL∂í|g≤∏J¯»ô?¿¸ˆBØÀ[»ñÊµ}Ú∂g ∏Éçn`®?‡«/◊ Ω_Ú±.m¸ÄN›feÚ=r≠é\ˆ”©ûeı*Œ≥LrübRIvùp∑n‰Óœøö„.?ã%8¡ƒ(èÌe-+ì∞_ù‰ÏgWd˜≥\&ıöÄÙÛ£!_™Ü†å»$ >H6‰ßvçu{&æå’Íz=GZ—ó`˛wb€=)	âvc(7ÛZ∑≈∆í»˜¨åÁ“_¿ºz›§,∂ü"ls ≤¯È•]ÍiV9¡7Ef‰(
∞%Ç!ç–oEN=NêB€=◊u<∂˘˙/7Æ‡YLÄ*nRÕÀ√µ¬õÖﬂEÑ-#qFÓëD)˝Â”G|d∏KÍ°ßπëV@‹@˙¸Ï·Æ‰Í_zkÁ>yooœ‘MÕí6≤/›º˝∂¸≈7n^ìø¯∫Ô¥◊◊◊Â+‹Ó˜©'˘ùèz¶≠ŸÜ|6@◊<›Ä)¸@›øÉﬂïÆÊñJ~¥‰VàŸ>‚Z∫Ï˘	_…“btüˆ7≤[(•‚b⁄v]	‘‘“UÔ÷j1Ì@ó∂Õ^7çı$ª$øg<åáUˆq1ƒ≤îM}ë6"yù˘¶Ÿ1,∞˙LC}ãjAœ£2{…ôÔ$r˚HÊ›JÆnªö∑oÅá›|6í‘!4±á'ø‰,œFôÕb¶˝¬ÔéŸ/yäÎe9†5>˘ç\ˇí›j•⁄xê;˚MÇı˛∏
÷y†ÊŒ√∫§e9˙æb≥ùT¯dË!<ådõÈπ=≤√ ∞úGõRﬁAYõ∏tÔ≤©RâòV -–W1“Ö<è&OÿÙEÃ3.yü≤‡–Óó"cëÕ˙Mƒ:i'à\Ä◊b„n…m¡ëD8ó∑{V`òÙêI‡ªÊ›ªÿÍêˆ‡øÃ0„‘Û«Y#˚É?C')±«zb≤,ù∞ò~ëâ$√ìﬂå÷ÅÏ3<Ω)ñ÷ñ÷∂Î|G'"’5ÏÎ1E–µw^ÏÚJe-eÏè∞Ñ…K`*\:#™…ÊØΩC:¨ÜIˇÑÕˆ◊¶Hﬂ¿≠UfHàT≤ÖÆ∂∑MÕâ	ﬂˆ•–¸rÕu-Jòö≥Ù-9ñ”Zt[úˇLê2ˇ“‰ÀÏKç‹ÄánÛ¥bµmõm⁄“ÿX3i'Ÿ4[ROLg˛Gü¥L~ÿ|ìj|¬XC:úE√M˛b€ÇUÖ∑@Ù˜»5~V´§% IGb»`p†)ˇ›s•]N.∆80@Ω•ÈÅ„ıÔQˆyÀ±˜LØ{€ikV)zrîPÿÉ(®ôi]"≤yT?˜ÿÔ`#KüàGﬂE‡ymåÎoÙ™±≥ÒÈá‡È| òÃÿ2oÃªil¨'á’∞_H‡{y'Ω¥4)mC—ã^èS¸3“{ÿc“9ZáoOûÒu»OOôäf› jE∂ˇ∏!ÔPrÃ^@H˜âπ.Qˆ¨lSﬂÏÿ¯}Ü>ª‡a9µ%πï-Ç˘„»;≤	[Œ‡$!ì{;D+±⁄æË¯h¶%0Ûè{‘ìÒ'Æ∞;vK2†ï¿πÂRoKÛ©Ãã»	?Z&zêNˆ$Ë£ãŸhdÔW1m›Í±Ÿ(}4Ûﬁè~8à°„‘I◊˘Ù…ÊÏJ"%E%π@ÀT5{p,eöM87–uS/ˇÃQKç…∂î∂∏!u–=ç3ΩÚ¸t¯¡¸æÁ∂CW>p¨^W"⁄?=2á&˚â^›ªª¶e1Ÿ∞„t:E◊÷ÖW–ª¢Îv@ˇA◊j”Æ#:ªhnXoxé€vm‹¿∆µnSªá_y¬îÛ¸Ò∑Oo≤
'æñAj• ?¿ç,Ëà∏QUy2Ò∑U™Nøº3‹b¯yp∫.ÉoËz&¿ ›Ä≈ÆµPS¡a(n.DÀ=¸S2pˆkó`È|b‚Wù„*‹S≥®áC ∫¢È¯<Ï]l@X4¯'∫™œ4ò˛ns`»Á	µÆkÌE¢éwX}"*‚°á1`xΩ»ºG’≥7«œíÓ‡«»…ñsÑû®ñ‚ã"àÒí»Tﬂ0r‹<¿c≤∞˛›g⁄›lNrÄ«-	¡›˛¯ ò¥Çª"∆ÊÆÁt<Í#ﬂ¶®ñ*d∆RÅ"–m9≤l5©Jñ√i9qÄ’f≤Lπ8»÷¬ã'0˜L]D0éÊ„7É|£5x‚‡Îä;"∆Á ≈Däa^Â-ìZmºæÚ7ûÑ‚ôK,NV™ «°6˛≠z˛≥ò]1:;éc¶ãü∞íÇPá']
 Ú@AŒE«j§lÑÅëCÛÔQøg2'ccêË]Zˇñæ\(•≤ó«jìt–!d/êUˆÍ…^ÈÆá€¶ÏıÒV"=ˆë|ï≠ §áÏ’·ª4seÜv≥Ÿéîì¢ÄÆ‰GÄKù¢r7Ó–h≤iDß˜◊5πê±i√pŒ÷m'ÁlÏ˜Ÿ‰>sáòOÏSoûïlr–˘Ã¿Òò@C)|ËÍ-≠˛ˆ9Ò„—"p{ñèaMD4‡hÀÚÇ…≠ŒbòíF£«ÖNúÑÆcC*˘^¢8ÀÕlt3ÏBÏPÏ'¯¡<i0Æ≥zﬂ∑<B«qƒYå¡Á‹ÒâkùîœÑHÖeïR»Ö‡4¬ƒ2Õˆ4ÓûK¬ºLFñµ^‡$ØkÙS[ﬁ?Ögà "Vró©öÏ&M ®7ØZZãZπ…Q&=Ç{áô}üÅuœ9Âúêz§Qùxæôúãéí qûaA/nîØ∞˛≈Ùâà˜ÔÆf— œgéMâN~([HÕ+"€â”+4+ò◊¸a;es⁄1hóÚÖQ	ú˜!-°8)ìw¿Ú]≈•\ é-åÏ»R Y>ıjƒÑ‚wï(Ñ}p÷¬¶I˚£»æ¡«Àœù?+f/Ef9b3>áŒ˙åÛ0’C˛0`»«Ê ˜‡”‡Fn∞ÏlŸ8Ç6LF	Ã»‰Âå)£™©ÃPŸÑKY¡)?°–«7ibO°'pù†%≠çlº©‹^…Nª[_9ãŸ‘ﬁl6îıò‰§qñ/»ˆÑ>\ÑW$ìl%Ì¶ùrñCfSœeÊZeP=˛SÕ<È$+OÎá—|W‹Â/˝’J”=ä~≤ˇºNK+’õÕïËøj•±¸`rFñ48øŸÖSêç◊ã’[∫NAöåøÊ±§É˚
\Ê∏Â⁄jùîy˜,–T˚¸ãôs^Ü;a°Ÿ≈q∞˙ûæπdÅÎo¨Æ˙ìWzÂ–‹7µäÌËé≥o“äMÉUÍñ€‘YeZwá˙´ı’zmUºóÜQqÌŒ™GL`ﬂYÖáıÉUAï8êu:0 `«cã™Z}Com÷´ıK’ÀµÀµFÌr≥Ü„øÃ	8oyÉôŸ÷b⁄‘Ò^s	ô◊¡£{‘Û®w◊±LΩøπd;ÂË+\Cöl.â¬Tƒ¨B$5%öWïw.ˆ[a∫ﬁv)’ç{Tw:∂)úëíøth⁄l—Õ'ö›«&–"§2ﬁD≤Çı·ê∂ˆÕ`¨'8b]okü‹ILå7«îH0=>µx~„T'*p‘ní•≥|ˇŒ“<-qπkv„#¬ìEœ”bW;∫f±Fm°…∂πÄ…∂ıv‡º∞¥Ù¸3xZkx¸%7üp¬\√«æÃ7éÌÒ!Ô`Ùä‡€‹ºXÇiEfm±å˝pä~£	˚]ÓÔV∞Z·nÕ ËûÈJ,ﬂã PJ.€ƒáäZ÷»ûyƒ¥&ÔµùWﬁ‡mêê%Çœ. YBQ§O™ÚK8?»,5•∂îíÖ=:æˆÈ§–K&–OCG6S#£uîÛÛ	>ÜÔÂê{sO’≠·…ØL1IB¯Òá?sÙàP∂m£GhæÒY
â-⁄ˇ˙i¿	"Drú_Ö°’|ë€—YT:˛ùZ9Ç€*CûÃU1ŒH4Q>,_fj€Â¨=bÙ,Fñî<†ö≈Ì¢Å‰ª∆x&˘âL¿òÕ%0ãfÌ691ıÚ-¢t˚€¶>o"lÑ”8°îO≥Ùµî”írv,∫ß„≥_m&‹Häœk‡>æez∫5r4«ä£{$NT#;ƒZ5≈æ,ãÎı¯¸h&ÑÖË›ê∆÷/∞µ—ÁgÓ˘®D£Æ1¯à≠ßÆÙ˙ê?ÏŒu&HYjÃìÉß˝(≈ΩpSÜ'±˚µ?üËa÷ı yO•Á<€≤«˝“œ/ü∆ÉÅVµÖ˚H°ŒÏkr˝˝ùù˜Ólc≤df¸ÁJ¡8Œe∂˚zM´]™∑Ú99jâëπ˙A≠Ó}∞õñ´+¸nTÜçq2∆πR0™%rúN§ñgPèSLöm:¡)IFïÎ¯XÿLh¯l{(.¯fË+ƒ»«áU~ó)¢ö◊«;•‰˜5Ig\œM·íâ0MÏ'8Íÿ5Ì≤-ÜôFU3àF˝≈÷ôÏí0DN`Öƒ6
IÓH<1JI⁄æ!Q-ïå§“©É¬è·˘6[±ÿÑ¨¸vbD‰RkÏææ∑∑ﬁ¨÷$Hæ“5ÌA*π∆ÓÎ¥zÖA„πœR˛KJáz!‹n”=¨lì|´Íú‹$Ü‚*KËmˆê§K_SX@¯¨`¢>!:ΩhÏ≥ÏÿÌBzÕ™Öî^q^cu·ïÃL!æFoá_’Íemo/#æ™’Kó⁄óN[T≠5Y5π
ZV˝∏ßÒØDXï∂5◊•Ï•sH√k◊Ò√#»BåÂ÷Bä±0ëﬂ|Ç,5mÖ$ΩNíµ´-}DíÈuÌ ﬁzàµ™ÎçΩµP∫Ìæﬁ∏R£óÎ≤nL∫rjB¥ú⁄°^`NêRkÅQH©YµêR*
öCF≈SVH®—€a$‘Ç≥0¶≈”Ñµ\H≠	U–RÎıØ«g©–ß÷BäßòfUY:•ß¶P£∑√®¥∏âêäølŒ≈ï[ ¨ÖV¡À69Ü2ÉÉ®.óc-uœëÂ‹ ó`≠∆°ı¡Ë) »aC=õ∏eM9X>ø?”®ÁÎ®Áï$ÂÙ†Œ—ÙN´kU“ÉàL]ÛGéü<ÖE˝¸3H≤—û¸ñîÆ[=ÈtïÒ,BíÕ
[Y]oíÆ|&∑t©~óî¬ÛÛ¡7Lç~©RÂ^Ä"CÈ=·Xp—a≠
Àˆ‡Ûûà”ó…«ÏKˆ]§+r‚Mœ|EÚy≤á'üÿL$∆—€ÁzM¶ “†9DI)Cx:…VjhËáﬂÑ°¨X¨ìnzÊãıæ…j»ôØsJñ)m¶›'◊˘√ù∑ïõJ\.ﬁ\¢A{ïìxÂBÚú}Zﬁm< 7æáKd	ßÇCŸ|#áU"@¸Ñy\O£˙›ÚZÛªÁQäcC1óOœ|ê.†.‘+d˚÷;7ﬁºáˆY9Î
óµ¸vŒèÀöò®óŸemm>ó5NOøAnÑ∂àÛhË3 ı+`ﬂ√ÔuJ«ÕÍÜDç$Z∞*YÂTlG
Ø lÊÉ≠Õ¥Ì?msS2_çﬁ0Ùÿ∏≤∆è>≈Mô∏cŸÉÏÕ0¡
ìoúDa&úzA‹n,‚$ı≈QÇ,ÇéF"Q›mÁæó1æ˚©PBgËc&ÑÕM0∏æ⁄¢&)öG‘q,MÛï4ÎVüƒæâ´C_J≠6µvëÖÕ]`0¶ÌW[‹òv€Ï8súp,_yëS/∞Õï
ÀÅS?≤"âS%$Œ-X/w-≠/∞ß r¬˜8<∏Œ ú‘ﬂÍÁM4Ê<|dÕ0€D{=ú©ZÄøS(ÖFy‹‘d¡ì=&Evy@º®∆ó“5ÌÕ%$cZ\W;⁄\BíπE≈®Àn\©*÷èâ]ªé∞›◊,ºI \ƒïI·Ø©Œ®≤»rß1v•,ëÂ2ûvC5&µ°'•Ñç:úÚÇø≠∆V´Ne|o¯≤.˚|DÀÆ…æIÛE™Æ;Ê§$tÃ‰CËä∆â0€&•¿d+$Ñ‰;ŸJægπèæªB‚®í¸®VÍÀìj,®6ˇ(vè®ú0ÄÆP∏&ΩrGõÖkíLã≥ı¬5i.◊$BÇë>I¸£¡ L±'ﬁ¥HzAI!(+]„Ó‰l¡¢õ»	&Æ+}‚Mw¶ŸÀ>ä`X¥+”®i(é.U2Q¸Îˇ˝RA'‡v5g)ÅlŒ·´u~¢≤Ûﬁ€oﬂzìlˇ‰ùù≠õxø(ëú≥ã oÁ¸¯EÌ8ùéEâòØ¬=*rèZ%Ô±Ì¸ï>J|Uú§`∆sò^ ìπÂj•)ƒVCcˇË∆7·Öú(¶é0¡©9ìÌVÈÆyèùNº5√˝Iı8S#ùˇƒ¬AÍ’rêzÖÃd'§≈Hüÿ±°,RN‰¶hF='ÒŒÀè•&ß∞“ëwƒ’<8HøôÒ€ _€s\‡ïÛ¿{¥§c%«˘ã·∂ÛIbQxÄM©uéeÍö~ππû#SïíZOÎJ‚S≠p;“ßpõ~'EJü—làjn*¬õH~¯ˆ©ÍOÙZ;€éöâäëäÎI2≥?ú&˜SëÁ˜¢X÷9Ÿec—=íf|}GÕ9hdúßÎ≤îﬁ”ÊHÇñV7TöyÙ!~ïˆùÆ√sk±[Èa5€Ï≤ÒV˜È:⁄X–‹¡Ï’´ ï7HıùºHÍR;?ekÕw=”Ó†”ZEˆdÛ› lßTm•≠u]÷ã“8€qúKˇT‚™ºûgÆüGY{™¢œeA‘}zª–‡◊≥LTÎ3Ãj/N«œ*Ù°^JÔü‘ÎFí˘ú)˛ˇ†r{‰€õBÊO£∂ÑÃ”jÏzS·'¢VËtô{^ûÁ¿„£ÚîÈo·rTxy.îÄÆXÄìnZxwæ ÔN°Íí“Œ¯À ºëCöç ¯YP,Ÿâ7-‹4/:Î\8‡ﬂ‹zÛªdxÚ;Äß>∫EÆíú«◊È¸∏fÆU»ç{Ô›ΩÒﬁOÓê€oﬁyÌöyÉiÇLµ¥ÁÃ	ÌúÁÃx™nSªwqù3ˇ  ˇˇÏ}ˇo‹∆µÔø2Ÿ&“´ˆ´¥≤¨Z0l9âÖ8∂j)nﬂÛ3Ó.µ‰ódIÆæDÒEpÒP˜≈EQ\çEøÕ}mQ\≈˝Aπ˘?ÙüºsfHÓêK.gÜ+i-Ô∂±Â9Œú9sŒôœ˘úâü◊Ñªé©òC3sÓJ€"«î∆àVm»≤I⁄qqÓ}◊9;#6≈ó]àG∑S%éòM,‹ëµm&™©qõ–Ò€∂@≈0°
[>óV¨„⁄/uæÊ†≈¢Â◊ÃZ¢9»Zå·ÆÔ¶∞,Ë√®rΩjt|äk^MìÎ$E:ÈÃºFöe⁄∑K’I◊ ¯W§óZôv¡çâv;8ºq¬ e º>`8~U∆ÿù92n“]yXU\>‰x©◊9ÿè\›.ÖÇ„z]`pz°ÿ®Ìô©ôoF∑*Yëyàf;.€k˜Ún§‡≥√⁄óÉ>Àìü™ΩZ∏ç4é:ﬁÖjãM„¸ÙÁ6	‡Ø_õ§oj∂™È™™ÄËù`øxé}ñYI0@3äó9˙„û„íp"∆¢∆ØwVzZ£’Êåı:©TTéäÏhtF˙÷Òëäs}»C~Q™ŸcÆ´≤√éº˙(,qﬁj6˜Z´Eac∏U…û?fØ›≈’Ñ›ß≠≤˚–x™®Ú+wÈÈR`⁄dÁÏe	t"◊–Æ˜›7⁄4⁄4Df8ï>ùü~n*6Ù¨6–‹ÖTwKƒÏ·V≠$]¯Q∑ÿg_?ﬁ8¡Æ®¡0Ò3£É}¶hz∞œûf˘äÿ{ˆQ„Òƒè˙pfõ!hÑp0µú(òMë≤O&ac##ÉSÙ<]hh@®b„’ÂÇÌ¥LF’˜Hˆ9ÅÂF666HCU£«Ω à-É
7Ëü©∞É≤ïÅüEUQR≈éÜèUzÆbN˙Ys|Îﬂ:«∑ŒÒ≠◊Z Ø7æµBû¥SS¸˜˝YE9Ω©Ç8«π“Oi£=ó”‹áŒ¡≠s“9ÈE]€5rÔ—ÊÚ¯Våâœ±≠ŸÌÃ∂¶IRîÁê÷‹ææˆËï◊“ZòéO„õScÆäè‡ìs8ôÆ¶â˝ZçäU,wﬂË…∏‡*%Tâ–cÕ⁄ö
~L’ ôaÁ@XëªÆ≈¢Am∞∆ökœ
é¨ÒÙˇBxÎZ/Ô9™Ù˙†J_ªE˛Ù{ÀkM˝F+U†<0Ò o¥üMÉV7∫¡8{Ã˘È5:]¨Vú ∏	]zzZ≈Œ©Ç„5MF"90◊Rıºû⁄9pv“]W∆l*e%ápˆû&∆D¨PO[m?÷¥P≈¨aÖ¨™ïw`§c93‹ëˇ≤p¨jÃ@\È"ÏÌ®zàÒ¿()6Eló*YùŸ['ô2Ï Ï:6∫e(è•ut∫q_Ω/‘n+5j¢ÔÀç¢@ÚÀUªO.sÏBî\†u(>Nm a¸Äò>+>G6áÅa™1.G˘aµbà€Ç™ôΩîxù-¯ãl∞Ü‡Gµ¶<‘ô}µ∞C6≥<ºìû‚r»CˆjØ/Ù‰ccù^‘å8Sâ‘HÔ¿Ó÷k)∞Ÿ7âÁQëò}¢%_joìJñ◊a™PHˆYèÇçcÿMıÊ’ ˆ¯)É¨åîlY`eIf‚ËﬁÇ3∂zÛ≥æ¡≤ﬁ6¡à,∑¥ß¿‡∑5&ﬂË√1˙.∑ï}£OÃÏ€jókJë·7˙‰˚‡h≥üPÌ»¯„%:tH^X∏ÈóËu2√ßMÅ ¯Á€£u;¶Ì ‰Î∞èÚXïÑ.´òD/fÁí„&“7H‹1á._ ‘uá.c0Ü,dEhÊpº‹áŒÒÀ¡œ€záF
√òÙßdµ˝ç∫ÃÂ0Ô°s¯ÚÃ¿óõ≠πæÃ}Ëæ|›πyŸò∆‹ºaA“jº3ãÀbv†«´5Ú·£{wêÌG€’è∂•!»:=Õ∫8Úl,ª⁄ÿÑlÉ)=t%Ö¯ÇéÔX∫ÄlöiœQåSßFıJÉ„™6¬€ºâ®Vx,aLØ2¢]àÙÜ*IÁ4êHcS6nI*“æ¸H;–}Ü6nát‚Tz¨∆ê˜™7ÒM¸¬hq`EJZiÆ®¯Ÿ‡Kìÿ}$á˘Áí89§á?€XwÂÙ“…HÏ”¯ÚÜNı∂qö…&e·»à"àÃ(∏ûu(6íAn∫Jîc∆¬/0?˝≥ï-∑◊‹#YÛ≠f*Ä˘x81ˆy≈Õ®¨„hN:t˜”tìÌDYﬁ,øîF!Á§rÆ
Éñ’óô_>€CœµtróûÕWèKá£<ù’´]?«îè“^)oEl∏¯yàÙ‹¯9ÿ‡!ÜFæb2P∂“^,ªæî˜≤9ƒ˙™ó’b-Ù§+&,ﬁ1úC ®˚fﬂﬁ9ˆ·%i`CàxCE∞Ò’í©ÀòÈ˜∫-mmÔÊ≥_∑dÜîÇ¸)È⁄Àa æœ<$Ó˝z‰˚m;Æd?ÛÕ©gŒÅ 3p§tÌÅ ç, HcôÙ–9‰¢
5w„3ÉOIªÒNÏSœe1Ô°s0»’lfGd·>,ML Á¸’Kì÷nn–ètãq‘≠=õÁÁo™ƒœa%â^\¨§9õÀbv`%7jdkÛ—Cr˜ŒΩ˜ﬂ›ëFï‹’z}›®Ì}˘ì„Bò–tU6Co4¿‰ÿ“IsùÖ;8ÛCã]¢Q›}r›©È4m
q»ŸŸ˘-QFπ"Rq?dò•·ˆvJ¢_,7»òM2NPÀ◊áú¢qíÒ∂áÙïåD-§‘ÀÕ6H√·-_µÍ¨ö(ãœeûç¢ñi≠ì]Ωk0•;◊2∞@9|·gøµIﬂ§@°Ö˚˜‰mπ◊LÎd)ïAèØ{ò3Î„∫ÆŸ µ§bI®%m“l¨5∂…˝{◊uU/ØìMœ9¥ë1nÄn„ø∞µAz¶º≤_˝ΩK~2<f°pPØ˝“ûlPL4'ÿpgûﬂè~’öhRƒ3VQÅŒ<]…˙[X}+-jB(◊OóÃq8èkéÓ`ÖuØXìƒÄÑë∫à!
cÆ4¿QV–DW‰7P
"Eù≥„jﬁæ•˚πj'~Eµ≥˚›7ﬂΩ¥˚$8{Ÿùy›#}√u@!Ã±üÎé=ò◊œì{Ëvp1ıÛ™¥jﬁCÙ`Ê¬ó˜–9Œ`fH'Ê5Û&<t6–3&•◊0¿6Êh ë˛k5≤yˇ›ÕÓ>˙±4ÄNj«9öÉ∏;fMœå¯»Ó‚ ÃKËî:ˇè >⁄€õÂp€ÍUV)Ykdêù¬µTBﬁóÄﬁúÈcÈX¯g:‘|1≤œEäã∫ë¢3V;f7ó)Fˇå≈Z˚z^∫g˙Z«öØVæ⁄õ zçÜ1T~≥ºj#7^ı"7ØË¯Øp˝FûÔ|˘Œ{Û∫9?ÏΩ6©¸ò∆9âîÈE5Öˇ≠^∫•◊&°?;∆ÖßÈ∏é›tö˝û”˙ÎŒ0†ÁÒÏàúC◊H˜EI—ˆÀµ§
S$6ã‚"ß|P´ë(5§\IhLÑ€°•Ñ&÷®◊#YßÌNÙC©©∆‹±yï¯ûøgE±BäZ≠5]q269e*M£ÍêiÉ(jVπ™@îácù4j+eäÓÑ6¥£ﬁJâ≤=!÷f*#—ú 8îh•ƒ8L´T‘Ù Dq%¢¿ï)”“®<‘U»òöŒ¿œª·CÍ#}¢÷ÜR≠(uﬁ’L:b˜aõ¬Zr√HûD€0ÿˆéÁ+R±nÁß?∑7ÙUóÿg_+Åä}M^üπ\ÓdÓfç‹€z≤uÔ›«“s˜Ã<ßûüÀqwÃŒπ\4;Ü„ôü óâE˛â¿:LÿÜÂ|†;Ækï;Æª?êhêﬁ¯`hâsªÒ·º∫  ÿ`^RûGˆîèi~`!Óù˝A>J£º;¶Üœ®∫GÑw%°Zı2Ü´˜›7Áßˇf^“Ä]bà˜I®¢Á i
Á™È¡úÂÿ.€’fP=Å^2HÛ T”!™&Ï9N=Õ§^¢„‘öèS¡áç”ÚÃkÓª·›πf£F∂?zˇÒª;Ú§K€û”˜tNªƒﬂ1;]4=Ø≥Î∂\Œuã%ÙÆ6∑ã 8mâÅ\∏—V¿Ø_¶e‰©%åÌê¥5É+‰%0«Ûã°–=¥ëaˆz0£ûni»ßÆÜV)àZ12Xﬂ˘ﬁ´Ï˘»@≤qrB@O∆:©ÄT‘¢˜◊f≥„ö∂Zú‹°Á^ÊºM)/l|8gY€®(s†RSŒ˜∫∞æÉ¿ı◊Îu?ÄëÈ÷Õ}S´ŸN◊qˆMΩfÎA]w´=›©√–ıuø~£~£Uˇ–Å+œ‘\ª_˜Ù”áQ≠É™“˝†ŒJ?Nï.Ó*ÿV6S£qª€Ÿh5Z´çµVªq£µ“l™(Õ
6*≠áGóÂp1á’5Ù5‚t˛¢[B ÌòŸ¡πQyÇßÔÈûß{€éevè7*∂Sçæíonñ°˜s8‡uÜ
D≥eŸ+≤ûu˘VQIhNi0JhÛ|¸6ÖÌX|¢Y˝Á∆ãw>VÉ?(B¶)ôúÑÉí4’1 1å§Ÿæ‘qº`ì˘≤¨‹…i‰…öπ|•¶8ﬂ_iIÓb™8+è˚´uµ¸hÿë>‘£FZµó±UDH	iÛŒ¨;1v√EÜ#õ5≤ÛŒÊwÔ»„Kvl≠ªﬂ—Ê ˛éŸ	G∆”≥∂Û=≥À¸‰]GÛÉ7^¬J*1ú]√®AâÂ˚\›ˆ¡˘´? 3ôLπzmã±≥Ød∞≤
<π2^‰πâÙÜ)ZòƒZïê’üê4Õ(´¶7–é™†µZkT—éXøÀ—≤éMw.oΩö'pWáÃAÓNÖˆı€ˇ{ˆ%Ÿ„&@ßœM28{yL∫∆˘ÈÔ.Ô†ˆ«πÙí·Aj{∂3¸ÁaÜÎfòÈ¨C¢ÊáyáëçÚƒÙÕé•úyX¢xTªøktg®vY=e3|˛á?{öÂ+é!~UoÖ≈©…Pö:•ÿE≤N√
´˚,UÚπ∞¶3œ∂úJ6•U^NbÈg_wBk±°∞œ|váƒ∏…æg9‡AŸ}ÚXGº",?€<ï√«[ÏòMﬂˆt_∑ª∫§”_˘*âòe¢º•/À•J¬}ÀJ7∆yû7ÂÔVP•Ç‡Â≤(UáV=ˇSa|Ù#3∏"˘Qãùè‰G!nÆ0@eœ ü9pÁÀm•1•¨^ŒòÒ¶≥yÑÏ7lBÉjkï`Ø⁄¨∑Hï,ûƒWèËüÄ—n<#ÒﬁûQ≠cÅæ≠ØµI≤¸9ñhç(¥2ºî¨àBÎ» ·\m%ÃÑ–>®ÍpÖOÉ	≤ÇÇ€0`Æ©ö©⁄ (gf”8˚¬¡ú÷?¬f˝ÌÁÙ‡‰ sQ»è¥…íòaãŒ`0¥ëI6
˚09o]^Ñb8b¶‰lîp4ÆÄf`Uõ$≈í«èë{»∞kµ$ù‘}I¥1ÈXWŒS§„RµÚU≥ı•Œo’ï-Ìã<tk’»÷√Ìèv…{[Ô>∏'}Ó∂eª√`~Ë∆›1;ánlnﬁ3uKérp∆éÿJ¶Dl©Û”µÚtÀæ÷îN÷`ÚY¨,„ÏÚÌ8Äï¨ôêYØ°‰Q◊C„¸’◊.û˝ $Ω°›Ø’j≥{$Û#Õ£àÍ:y◊Ûúy2LT€Za‚Ÿ ŒË:à
{ßVBT…;∑
xπµ‡¸Ùó&±Ÿä∞˛ àÃO''wÛç;ùå@∆X'Fâ∂√DkI1¥≈∆W)z†YC}ÉÜ—©π∂Ì®∏â‡Zö›á¶Ù≤Œu‹U∑ZØö◊◊É}ªŸˆØ]<ÇÓmTﬁ?˚Èü˝â|˚˘Ÿ_`G/ù∞¬Ú©∂∂@[ª^u-«t…‡)ØÎËõv”kÊV]~õ¢MÿGi’ëó$˝Í
{RÏU	<’„QSâHe,õJEEz’‰7!qZ«w¨!L´gˆ¥«M«ôèÈFZiO!å§ Ì8›Píz0IP˛Ü°ºókd˜—£ª[€“¡¶]«±”ùáõ∏;f'‹ŒŒÎj*âÊ~b˙CÕ";ò.?w≤Kƒõ¬Å‰–ÒW„lGpntµ±î=wkıÖ¿‹#dvNf÷ÕFÑ≈n∂Û∞ÿq%üƒ•T˘Ï∑«ƒ:˚Çtç≥W§oûø˙“TZ∑Y£htP{"ˇò;¶£ÍSälèˇIØs5ÀæGÖ⁄ì◊£1ü„†ßiPO÷}ÛB[M)°3ÙıwÒ·S8dCt∆é¿ÊÀÚ √7y†k˙ÙﬂÑ˚_¡~¨∆Mõ∫ÀÈÓ_“Q;sgƒ‡√˘AâbÄQ∆JœÜ˜ÿôí"Y¸„≥?¿&6<?˝U@bú˝UûﬂµåüW:}h$)†◊¢î…4äêPÑ§"3 ˚îJFü´ÆÖ2ç:&ÍH‹ËSæ"KâqTGËFüπ<‚gZ5i¢b[¯*™‹¯)Ò*YÆG±->ùË¸tJN]3È‘%∂;˙ŸŒ°ßπ‰0Àûú‚®ßlmrÓüaûü~fì¿8?˝l©*õ(˚H»„P£œÎËO∆}ø™ä?•Mê7ïòd™m
¥'‘VA·ã≈Ö…¡ˆÙÜÙ=¿‰∞ù˙∆dccÉT\kÿ7ÌÁ~‡xz•ÿ¿L/∆(≤Ω£È˜¥ûN<∆äõ≈¡“…úeÉﬁ:˝ŸsÒÁB˛Çïú»5ËfËéHh≥ÿógLÁHk∂¿˜á?
#æ·ôˆ~ï˜†¢[€√O>W!Ò‹UJÈÕê;7WçAXÚ3˘ß$Œ=nÀ„∑˜s√…¬ﬁ‚Ê˘È◊1Œæ¿b)åSIóΩ±,ÿ{∑†j⁄™xpkÛÏìfà¸ùz¥‰'Cÿûmbù˝Étœ^vIˇÏ/&ˇ*òTÚ¡∂=ìa ∫öC∫ÁØæÇ^üü˛Nc)(£Ñ1„≠∫;E	ºåÚÏÍöØç$‘ÙÑ•G,s_Of¡êC30Hô3 }úbvsbsE!éSÇ5EL7à√ädÅD!tà)v68?Íﬁ±ÿﬁ¶Úı`;˝¿Ö$ﬁG,∞&÷À:g˜ÏO≤èVÊÄ_¬@ùhéUΩâ<=^~≤ùPË}Óâ+˜
’æßS(ft¢l⁄0†œ»Ô˝ù-∑⁄Ì•Ë?v¬úÅˇ…	%k 7xòΩO
Á#∂c‰YÔ‘hß=yXî¬]2ï](ÅSï‡ZV‚Wn’[Õ:[
Ü°FØ|£y£π‹º—¶WŒa@ÍPÃf»Ç9a⁄Xº/äyToWtû2•|fc"vÀ4-°ÀƒéÙÚL`ÛÚdAúê¶ã‹Ñ©qˇÅ	?oêßB'¿1{Î§¢πéÄ‡È⁄@8;0åWU~÷»W±ÜÁßøê»‡ˆá÷Ç∞Wπ~˙K–WÁß_í#ˆ–5Ñzöm,!É∏∆ŸÀÄñák¬ÈÈ~ó{çÔæÇ>Î?˝ﬂˆ>-8x√„Û”ü⁄`A˛	˛˘ÌÁX@ÓÀ.XhFQ
n¸çô6°HÄ&'‹ªìÉá,©√≥øö§ÜΩ•î©ülS“;?˝
⁄Í–˛Ä9ˆ{∞Ù^—∫∑NM¯≠–∂Y'˜@ßXé÷ΩãVÈïòë=œ`äπ5É6„Œó„s¢–%ã.l5ﬂ„ÖÿeR“>Z`ªô˙°¥§›Iﬁ˜ÃﬁeI:òÆ•ú˚ˆsç¨ÑRÿ=˚îY9ÁöÓ¶ÜŸßˇ¬¸àp	≥G,—'£X‚W¸µ	¸ÉçΩ˘7ì‹Îâ¨p‚ ^®`2◊v$ôéáfmñdéÆºR—tMWZ(∑Õn0Ù‡òÑ?^í`v0∑’3j)©A{˝+&æ˝+x£∆êIñ¨x&hù&=b	~Î†æˇΩÀ‚À.
ÊW]x¥ÓêﬁŸﬂL∏‡ªoæ{…j¢¢Æﬁ}Béœ˛0DMå-çÆsóP€3uæo–uF%˙ã9@_¢KªÛ˜.Ó ˙9‘;≤≤˛@;÷=ˇB•ùV	ª>–=ÕÍeI{|Âï
ª„Íˆsõ!ä§51Œ]§Æ˙†≈’`9°gˆEÙd¸Óﬂªë¯uP9⁄}∞ÃJŸ«HïÍè?üÁü˝ûÜ°åÏ∞-!ÒË®CÃÑc#B®eQ7,QV\w.TT]åléD’s¸L≠_v•r˙ì°Ÿ›Óöx-≤Ç∫i†µ¯ônñ∂Ê‰EäÍ]Te 4_ò∆(IâÁÉM˘Ô &Ï–•üóRœ¡Ÿ◊¯Nﬂ~Ü÷ÍÿÉ#Â‹ÕÇ®#]jXá	¢ÿd¿˘ÍÎØ√Àû‹['çFs	˛h·ÀK‰†vP´’%eöE≈/VÆáûkÒ∂ﬁ∞k¯¶ñ)‹£kØTºµ^Ô9ãäJ˜ÆqˆáA8O4
/I	˜Œ^⁄ƒ2Q›2JÊH˝çºøÚz8JT∫Ã'ÑoˇÃªÉ‘dŒÙ	=ÏÏﬂ}É&…„Ó—éqª⁄ØÇpÄ≈¥√•¨¬ﬁ∂Ük]p∂3Ìë…úlÓ È
ˆ≥à@≠Îu≤„x—,◊–::-€mìÖ;’ˇ±H:«LxÖc/>4•˜¢–h.Û¨ÜøC„-hK§#L◊j¥ü5À¡ ·¶3@§¬Bá}ªD*fEàÀvQtÃﬁ3- ‚zL∆NÑkè∂◊hÏjÏ7ÇCÂJ6≥Gˇ;
œTÈ<˚‘œ,àCkÅÛ¿9‘ΩMÕ◊ÑI~Õ=≤ÌÏ"Òt÷l 
-z{xã8‘Â(—Ÿöiw≠!®ºÖ∞'ü~*—`§ª% …«À‹X™ß®‘'øπ((Dl~Ñ¥òÿäD9·óSÕ“Ì~`P¿FcQpqHJKÊÅ}tŒrå†Ö${NòQ(”˛¿8˚+nåxZ¿˛˙’q‚ÿ∂Ôˇ lænHÑàªßp„˚∆Ÿ_4÷6;	•›ë¿		ÇP“k87â9hÓ¬”`*ê)¿-<ÀéÙ_ç1ô∑π@Ü>Ÿ’bpÏ™zè¯˙O£«ˆû¡
%≥gÈôÁ¥#$™Ó@‘_Ñ/ÖùAˆXrõ,7»:i6d¿ìË{Å”Ÿ€FµØ˘óø};z°UÆ¥D≈Ñ~a †s‚ ¬ë
8˘x<%∫Ôi=î\z‰ÌË‘®|ëwÓV€$◊≈xa¡l¡xµ”‹‰S∆Fë©bìãéÄ∏>£…|(9u≤…∫ªeÔ9R˘|–fl@®çéUS1wª˘Æm!£G≈yËPä‡01,ò´ÀÚe¿€êf∑π"√1B∫Åte†rãpU6p$˘LM$¬8†(§yËUj3+!¥∫∂\¨ú@œ¬ƒÄ’÷ÕF≥}≥—ñGâ'Á¨Ås÷HWOﬁ=Ç	‡Åõ¬‡Å—áb ÿ€…ﬂ<≈äÃíÄÓEÿV§EÜn Yc-ç'ó‰ì-IÖ·öíkN:ãX*™œ0ÂA>ô8É÷¢∆}∫ZIä‘"@)V»(å‘uy‰˘[‰8,Ë3lΩ'ÄÀŒÏ@:Û⁄=b$Åç<b‘J£⁄¯_.á∂ˇ”õq˜h‹£ÀìMíãxdË∫∫◊ÖYS Ò§≈ÿ∫#P¨¸∞(%yKÁadM%5S/~.˘Ì‘Lé~5qc\∏¿,&qÂäs™—ÛÄ“y·$2Ã_¯ÚŸW1≈C˚r'9‚Èõbé¿3Ç#ÓœKúﬁ˛˘ÈKDG˝Àk8π‘ßΩÑIç2Ï'Åä3Á3fÏø ≠ªi|˜ç6˚jW%m<Wc,q≥æ"OFŸQƒTˆEÑ≤)&æF2Â‰FõX:xÔ6™K√¬3É@⁄»Ω∆W/Ùù‘˝§‹˜;,Ó1öá‰.c¬(„ø«ŒÏ(5‰∞⁄^U.}J†¯§:FÀEÌc9Á~
JJç'≥$C&ol±ì≈bó]vKê’ÏŸT¨yuôcÂõf=iñU9˙™%¿xR	K!Ám£JãÈ8X≤$£úG,ÌáEÿ‚å2K
È“|é[:üMR≈»”∂Hm1”≥Í’ñ]œÙµ∏Ñó ÚÌ‘âO∂<ÛÁD9"
¶Ì(ßŒ!Ï<IõÚBEuÃ∑ê-…pπ2U“çòK’eJUÏ“Ã∂Lï	$M√:P®øÁìÓ:E+":ï≠©,Õ%#'◊ëøÕõús.Pj£’HÇ®¢Ôsóá∞1—DPÆ⁄,m-Ïzöo¥¶c+ºáfŸRêr^¶éA∏äqÜîÓW·% ƒ$∂~Ëó!$)Ù£–º±–¡Á•ÚîHùÙ^cI§ÙZaE°¥ﬂL;*Òoñ™$iNË≠‚Âón}®√õî:råÏ‰"¯LÆòπÑÛëvMöà˜˚.YxÀDÃaæ˙í›≥ˇ8&ì∏›ß@Ø¿†ôT›4√ÿ˘ÈüóP±éŸ^_â2{c~ÿœªòÅ`R∏v‡Qˆ2ªè≠ˇÛÄ¶À∞Da–0Ç„tD&≈◊	€YåÑ].≤o+ŸbÆ•o;Ó.{QÄ+ÿlw®:ﬂ’:LãmW"€™Am§|8CøYÖo¬X£]∏Ÿûb†f≤ç2z–"‹q‰∆◊≠Ω‰â˛K¨4∂ê`ﬁuú˝GÆn´€[¨¨5Õ≥¥ŒH›à∆Eç+±≈Åı{0Gd«¸D'õéΩgˆCÃπãT…
˚7ÁèÚ[¬À¸¡:÷Ï»„xÌãv©MZc!à¨›7wAÅ‰ñGè7aQÀ\≤“à‹∆Åª¬ˇ¡<s4˙Èjz ))∫Ì	¡0ƒMÅ©ÌéõB?€æ˝Ã∑,çI_4∑L°GÙMLT¬ç1ı.Ì90Ëh‚ﬁ˚3∆ &‘4tÒ•-ˆ⁄PÖ˜…¢¬-∞|˘¬-Vü˚ÁäÑ-|r\+˛ v·‰.^nz(ïIÔÉé‹>Ç€ö+ÓëtoëŸhA˝î&ÃS‹>l∆w/ÒÿìÿXˆ⁄Häñ¢ƒz&Æò âÀ‚q˛≠ÒÀv5	Bìé÷Î”§C&©˚Ã∂Î1ﬂ?¿Á^a•Ìx0Ø≤”∫k"r’ø˙Ω≠0Ω´Ú”˚AJP^úöü°äe=”ÈÏ%ùæ¥%Z⁄úzÍ‚t‚◊ü3€€?ıg§™˘} ?≥Úùπ¬…§@iŸπ| „©2ákÚs¯d4¸!{£wˆ•πD0∑É7dKf"˘,Ë¨—|UnÎ$=¸9§∂<⁄˘ˆs∂ﬁ˜√à⁄KñÏ
ø9Ü;ÜÚSzÔ¸Ùáœø¬	5ÜÚÛ˘ò±A©Õ*&K»ŒÍÊ»æâÈ~ñPïF	…L%[åˆÅ^Åi…∏Ë¬	ˆŒ˛ˇQZSÃ:ﬁ«©˝2N≤?“‰ßÔ~Ê”ßö”Àíû–íïNy2˝J¶Æ˜»A_=Í `Ùõ¨ô=1øı¬”p¬ﬁàGèï¡Üf˜,˝#∑ß˙CnP‰Œ|¬˛Õ'|#2l˛‚µ‘$ó;à¡ê$s÷&◊≥¢∂_⁄?OyÔúì˛∂Ã©’H•F˙6©—‘Àªa…Tô®‹d„ykƒ∫≤≤¥∫ºtse©Qkµü!^MˆW‘ñ€ìÍÿ:©å¡Û°0|7Îkçı^_\@¢VÆÛ]kKW·´ÛJúlE)ö¬xÇW≠‡GG¶ÖpÉìEÌ…„6Èõ(∫¬Íá»fc_G(Â⁄UjÒ≤è‚fü‘B^·è4Z„ø™Àí}¯≈ô\{´“Ìâ/8ˆQ;f]¥‡…ß>â`Wi‡¨l2"Yº¨ZV¸öVeXÿ6Æ|í]<vjä.Ø ‰®*]Àç˙Ai‘©1+7Ï“R'[Rç◊tôı÷ãÛgìFã¥≤+°Ííä.√<Ù‰UZñB„íÅÂî”hí€¶°w˜ST€H¥ç‰{Œæ^}∫,[.Ë"ÎŸLX"\–¶:<’yå\îòD∂¢ö≠:π„f◊“Ò∑®u…6Ê@Îá‰Æs§T∞a‡yaµù1t,0p´.8ÍQ√N*Õâ·√úLe’‡ÚΩ"ïög1	k◊S˛…0Ñ»Gî0H@£Ø˛S`F\”Êæ¶ZEq.‹¬¯^œ^∫!Ûˆ˙IÖTD»-üÖŒ“ìµ–O∆·QÅÑπÜ¸%nYúD¡lY/ñÜ£%=ÃÒá≥‡´‰ˆq;§JﬁEÍÑÁ∫Œ&[P`ÖÖ[‹tÀÛc[¬~Ï-£-¯∂ºç¬T	*À¸‰˙ÿDˆÌa_∆ ôé‰«D W$˛! ÎÍV ”áíßãÄﬁŸøU‘º’~˜YaF“›DBŸ©–∫
!˜qÖ/K%zÊﬂÙÜnπ
+"Ìb^
X´πÃDH'_^Õ9ÚØrÖ¯É+^!≤*ÇuBvyO{âlû˝ÖÚÈˇLÉ_.zÃá†–ﬂŸπOtYxò'¯ èûw·I“/M∞È(ó‡ØÌ~-"ÓÎB/ÿ©?ÚÓ2ha–==K[BöædS›≥ó&	P◊Râ§˝ÛW≥ÖimˇÎ˜ÿÆq˛
…“5ìAN|3§öéÜ•ãï·Ò¿ÛÏˇâ6L	¨eÄ›˚{»È)#˚_ëpzJπΩÛ”_òÿÈ–C3—|aaòp4ÿân\wˇBÉ∆Ë'C-Fd†éo˛%Ã°†÷tEï¶x»#yh≥ÃqqYaOµF;ÆΩkçÇQÁ ıõ´4ÀÏ^ô^©N-”õ“±Â∫ƒÎ\’ñ¶≠É+ªºzµ˚T;ö‰H’ˆÍe®`˝˛öÙœ_˝Òzö®ˆÌQg⁄$.hØﬂŸ°˛µ!¯wÜª√éæ·≠Ë—?e?lúq§˜hÀ±äçp®zã$ä√#ß_ê≠‘%*	Ho·"–\W◊¿†ÎRRÖâù»oƒıú=”*”Ç÷ÌÍæovLÀéK¥ÂS)ﬁÆπ∫gt4oâfz¥*ÎsüVe-3Ære´¯çP‹á’&&¡ÈDÆZœøZ;‰Æm	‰LéhÆ `¢ò<7”≠WÛˆ-›Oæ»º«öP‰Zt}OHÉã%‰%ëX4∫È0Vº„‰–àeB	‡º	+¸_G≥¢rR∏ÀUR±œæ8cí±∂fÖ-/ÁRgó∆ZŒæhü⁄§>l1‚i!4ê≈-]É÷—àÚ£X-¨†%äóÆ-p™) `é!n’™â⁄ÑFrnøUø√ñ”∂ß˚:Ë˝¨˚sz7È±»™EâQÃ¿⁄”Ïû3xn9}á%π≤/ÓiÅñ…N{k‘zFüdñl2„"&»‘¨çììà¡uù4≤sØB≠í∏¥ô}©~d"Mé"#xuÅÀkÌ%¢√ «J§◊£aP…na<)ü-æ‡GD´èeÜ»AÏv@üç5ì9£È„¢±fGhu9Oq˘ƒ~∏U—™„HµL:ì…•¶ù^<¿∑œ±t¢IÂlãìSIá…‘@√ËïâGâBÁh·?G∆¢‘M≠âÈÄYßÅ≠ó»'ä údXSJ∏ç á⁄1u Ã¸ã'©B<è> UNy»+Ñ¡
¢SÈV≠=˘\∫8cØ(z:Ij¡!I√™%aX-7H.Ìb1ö¨pèÍ^Ú tØ´˜Ã…;gÒ—P·xÀhéçj˚∫\>≤ƒ--v~É\Ä±ı"¬ó|2⁄≤ä˘ë¡‚jNæ	Ô;˘|¨HçÎ°√9dÛı°””¨¨¿3AÒÁmŸYª$?y$Å#~«¥6eæg¬∞Ëä*–G#Ω5¶Û¬=«T˚Ó0OˇLòµlO"Æ<?Yﬂ–5∞ÎQc6¨Áç˝Ècà¯eA¢Òde5I`hÕÌÿƒ2˜ıp·ÆìMî®∂#u˘ö≥›¥c\qæí„Mh$¯,	"¸◊Ò∑zGTVÛ=Z˙`öYÄøê/Fè√ }–…..\xﬂ˚!‘Ü,æcô=xu[/Ä€î7$h+If†(®È≤,z˜ßﬂÎ5:›ΩΩgi-∆a÷£UŸLÖús∞>GÀM«ÑsU3ÿ®M4ÇÍk@∆0Ç26`€À,ªBKÚç'ùTn≤_6†+ˆ1Ú>2Üy«¥P∑§Â‰Çˆ˝s9+E∑àΩ'ûÍÓ∞Ñ?.´x˘å:]ËÆ“EÜMìÔÔ›T2J$ÇÀÏÿ„È˜ö›fß’|Ü»Ë!Ù<«ÖÌzË1™àq!MZL7©j7ë“∑˙·M£‘ë5˜Ë˘rò<≤pÛÊR≥—Zj≠4óµ&&èL™≠ìÿ/¬ÜôÏam fP0J≈—êX¸h95»_Ã≤´˘.ÆÎ0„úàïóá˛z#*à4PØùu±¥rx¡-˙n†q0ú tnT»ƒ'ùc^CêÜX∏.÷¢9¡Rzñÿ…÷ja∑t5óÓÜX›ã3u°S•À∂å˘Ê±˜o∞Sµk8éE6)…tÅV√•AÕ°¶X!Ò¯®ê§oÜ˚O§ßC◊-±iÔèJDâ$¿…ïë Lëh•R$÷∆·-£ò	Uhc  º c3&vT'Ë<|?ı•êälsî‡èË£Öó·‰pôq%¨Ã–ã≠—aAëq‹„¢h“X˜§8<ïπ;mÌ¿ÏkÅ„’∫ñÈvÕÎ’=xﬂ]êôT:˚égˆM[≥>Ú,ÒƒS	n– ⁄ÔÎﬁÆ£˘Rù´–4æÜUŒ±¬9_ä„Ë≤¬~ﬁ}K8ﬂZ¢◊¬L¶ºv@«‘=‚‰¨˛ÙãØ0û∫ôïÎô¥í:ßê1Këß<òÌ‰èªXK¬©t°)x∂©f≤„Y£4FÖÏ&ÏôË„e0ˆ±W-¨å(ÀÏ∏∂~Hâ¬Ñí√!X
°¬È—U å%ÿ®<sœﬁï4ÿ¡–Hq‡›@fmG∂∆‹µ]{åé‚d¥2ÂE˜Ót&˘Åiß≥¨fdÒE§x≤ 5âµW`ê¨[¢hh˛±›%≤&A‡Kë´n t[¶<ˇ!ãÂ2(Å——ˆcª_´âS†‡Gäfúqíx∫Ô¬:Ÿ ⁄°fdO∫Ü‹{®€>J]ÓXN'Ón‘ˇ~+^÷>ŸÙY∏ñ2˚|Ù¯A≠ÎÈZ†?¢é¸{[RËÄÖzCÓÈ=ß;D?<Ï¬ªÃ+_®hb‰•—ü\√Ì
F3˘ÓÉzíÏ}Z\§n&§Êªñ	/[´»›©πéª {”ÌËy∑+ãO¨\∏k˜´Ö≥Ë^§¸6»«oèùD’<›µ¥ÆæPˇü˛˜Î˝%Ry^Y|Ò¸Ìt‡6˜:å¯ëÔìÊã⁄€'0'/>ñÈ`,Pßw\C°›€4L´∑Ä]ó™.*`π’òÏÇß¿éPÏ.NO?pˆSãdM™ùÑfØÏÚö)Áæ†8˜ØÇ∑dV›“’@¡í∞œ•ˆôC$Ê∞Ü6ﬁÂ©gÿ§BKÙ¬îz©˝‹⁄Z7ÃãMz4)·3b}˜çúdˇEÌ˙πú\?\ÿa ˆxvôØY±≈Ÿ(úü˛ÙB›aëk/Ûæ8;U–¿ƒ_Áµú{”t‡ê∞K˙U‰#ª;„∑ôê«%ÇhF‰#Ω#ÁÜq¸#Ω∫ö˜Ä|dkÍ@H$2?™Æ" ≤EëÀ´Çà»'w`Dü ÁF8ÑÔçì¸v+˛È5˚¯EtÕ˚–•≠^Êuµûæ5˙ˆEñöêÃs8Póí®Åπ†LQP∂Ÿ†Ú≤≤3Ï¿¨ÅÑø€‚øûÜ(∞LE1†7øπ" 8ØH˚âsöπ8ˆCv“£Ô:`b≤Aæ¸êÚÂ[≥{¸¢Û¶dÎ~xWæª_üLö\ò$«≤‰ÕÍç˛_Ÿ◊Ûï	róºÒ`î≠£{Úà\≥ÓWXQ6àB≤©â…ŸÕ≈ìø÷Ã—π¬õ}£∫gˆtÃZ#ÆÁÙ=Ãb;–…ÿª⁄a=ä|q=6†GÓ:`pH(x{/Y›„‰-l˜Af†·éÊ%ÛæRÄûÉââG“⁄|µkÑ£zTEÿxkçÑ&xU? ˚‹ß0ÚIu•Aﬁ>Ii*”òË¡lÎ,@R¡Ñ’
üröΩÙy˝h4‚ßGõ‡¶1aUç'øæ≠ÒØoˆ6*·„M8"Èi‰é—*7F—VqXm6ÎÕå [›Î√∫“ºÆ±Î–9ÇÆ‡c∂–Ì©ÌÅwç¥Œt=õR	≥åkzGeÒvM∑iΩQJ∂'=]YCà7»Ëõ˝ÊÃEª¡“Ïí§iMOJ…¿È°æ‘Ã4B"˝º}2∂¢I≈î}ÃÓ≠¬4≤˘y˚dlP≥Ròπm
∂é6Ï ¸nB±,∏A‹lg©2n«b◊Û˚VxofûO¥s…?2πáaÈ*,É·"9qn∑xœÜ•∞NZk–XO∏¯WÊñ8n–d&_∆îÕ÷≥∂Ói´çßØ∏õÍ’ßÕµˆ;œ
R>û“µºQÉ{£?cˆÂv{)˙ØQ[m/.±ã´Ï∫ÍƒÀóóœ±Gœ€xEq5Ï∫∆˝_ÌÊ‚≥à5⁄ˆ;∫%ó∆û”˙UDñôvÑƒ$Êmg¸Ó{ÀkùﬁﬁZÍ∑îC˙ÈÚÿ]Ï˚Ë r¡ä°MÕ]∆ïç\CúZ≈◊_Ø◊±Ü≠Ÿ≠ö˚¶V≥ùÆ„ÏõzÕ÷É∫ÓV{∫Sß Aøﬁ™∑öu∂r£Ê⁄˝:2˙–ô:Ó-~Pg Ø¿¡|é¿®b¯∏ﬁl4∑ªùçV£µ⁄∏—º—\nﬁhgBìÂiˇÏxà9FÒ•{ ÅÓ—“@x˝'U°¨Ω%WXŸ¿II‹¬ı*l∆ùe"ò∂;Ã*°ƒÍÀax&Î14`n8HMÙ8“k≈÷≠Lª˙@≥Ü†qò∫˚·P˜é≥L«ﬁÑ6˙hJÍq¢∆ËñΩ∆ŒÚk¥πL´r@™ÄCFG´õNœc¨_wÜ≈´—´∏wEˆ1M⁄†1ƒ›ñ9∞[æá≠âL?2yyÏìél3\∏q´‰Y‡	¯`3Uì[Ñæ='˜‚«rë¬¸ [FøÛá°®$¢§ç¡Ì∏∫ﬁ5Î]ßoõ¨méÉ±¿¬0»bm¸ŒO?ºıPÔÏõ¡XŸ>äπG∆.Õ?˛àé¶π¢xù±&Úèò∏õkû≤c<∆¨>yò{p«ﬂA†9x¨˚C+·ﬁ=ÕÚuë;¡ºcQ@nqxk3Ô∂‰Ò√XÁØWã°„·ø–Î—Ù.±ëplèætkÅ™˜u:ôìl6¸pÏ√€È›5÷öˇ¥Ò˛_£ö´Îônê~íZÏ.l{Ö ÷∏~x6ﬁ3∞4n”ëÔì
a&Û§£õ∞jJÿ–˜Ôîﬂ§“‘YsàeÔæv°/©'‰6ÛBlÍ`áSfÊíΩ{ÄTi¨[lˆhÉ≤ΩzA`◊‘s*vöWŸedp=JTD(iÆxD;*ó÷7±Í RM¸≈Ã=…Àãèd|[x¢‰"2ŸŸ≈ËÈÉπ$Ω®$kXuzr™vt‘vˆß÷ƒzıü¥ê0≤…%FP,†ˆ°ŸMï‹§;„JŒŒòø/ÊoÇBõ‹∏}ê=—âhj¯;Û“í≥ﬂõ˝tAÒKÙ∆≤|≠|¡•™ßÔi®∆Â§Í˛˘ÈÔée'eSÂÚÕìö¸h ∆ÂcÌõG.#9Y‹†¯ò∆ƒ‹Ï/¢˛ﬂ»áËLblä‰∂MÀZÃDÖÊÊõ“«øq—îhÖkÙÕcûàfNl%üp‚Œ·¶„özÔ°É≠eOÂ~!Z•#]∞úqFé*CÒå|:sÃ∂ßıÙ™ôü•òU€Ç±à–gË∞ 5´WPöÂı≥ë ÅC‚L†I–ã\tAñzí∆pZ„≈Eˇ¬AmL†M?âÉŸπfWmœDﬂd *Æl8·ö∞⁄^/ ƒ[èº˙i\ØÔ->»ûè— Gm≤DÍ ∂z1/¬Ùôë Ü¥Èﬂáå}Ö≠@ü&¢øX#]Z–öËÎA‘+Ú.ﬁõãù‡ÿ¬æ∞k¶øUê{õúÑ∑bö8ú∑–X„yÕ≈J,mùúÄu_Ï(MÜ„â°ÚÈˆÀ•ó≤Ÿyb<ºRénQK¸!Q¨≈—n…›%e4}Çáﬂ\ÕE\cpÑV⁄äOF∏i
oó©p$®Öéhl9UKai∑ÆÛ∑÷W€“uãHkô)¿∏´kCˇ°E6a"úŸu+0]Åë¥R’:æc)+=§3àô√’fΩE∏‘ˇ#˙≈†S]N–n0û≠π⁄Í<´Éï%ƒs–lèEg£r64ùò˛4–{Êpê¥U¢–{Éƒ7Y—w.˜õäœzt_3ôŒ~eá#œ∆*ï÷∏⁄≤.—û2‚€9Ù4óùXÚ‡Rzò∆PÅYZGHvÀù∂ Ü∫`Œ™î˜)úÄï∏‹xÿ<HL• SÏxÔ ÆE¯ûÙ«¢D?[=ë»ïE£Xd%'åÅÎI⁄A∫ás"ñ¡;∫g‰h¥EnÇJg…;ˇ?Ê–\˛˙räk/\t}UQßèq°¸ÓK'¸6ükoÛüH|ƒH3büSl˛ÈföƒÄL`a3k∫∫”f√Ã	µ∆Lœ	† ´al¸:wüÿ]"◊»ØÆ∂,&⁄¢mÀFL€‘ú≤üD‚À-äìèﬂ>·ßÛi4â¢[`≤¿è∞Â¡˛@„Á¸a1Ω‚˚˝ç ã	ú%cº;oè¥$<rƒWÇèHqòÑ∑•Uƒà}4ù7N8;Z‰.J#∑Yï‰É)Vπ.#ˇYOdeÆ‡Mg‡ÇÜ≥Œ≈ËÊù“%?R%Êo%&∏ÓìEEs‰NEÃ8—O˙í)~—µÕ⁄⁄3A…"’J#z±XòêX∞©à‰|LËH^yÃ¸¯FFp.á>M˚l2KÜ∏ã	ôﬂŸΩå.®†ˆ2ö∏§¬cO÷Ñœ•üõ3¶˘›…ﬁﬂ ûù‚pE¸öìò™(∏ø@πˇ∫B˝P
&S¯ˇqóEÿOQ´‰U;xcBƒ„©ÇN˛D%À≈:‚£8®"”äf$„úÈ>yìWÍ˘◊Á+¯|™¢∏^¡	X,+œ^ø¯Ñ∞±7k1âÇhÑpB4°{êÒ≤‰‚rë·CÅÛuπqÖ	≥?aáìâ"à∆D#
¡˘∞ÄL@`ÚoÛÛ—ñó∆ù˜"·êÛ…≈‹õôq™Cw∫`rÙ#˜	ÀÏcÊâ»Ï„sˇ?   ˇˇÏ}Îo«ïÔøRfÏòº!áÛ‡P#Y†(ä‚E2‰à∂óWêõ3≠ô^Õtèª{¯0≠Å?A∞6ã`±X+Ü$éaÁ*ãàˆ√˛?¯ü‹s™™ﬂU’’√á(õG$g∫´´´NùWùÛ;Í6áZÍoö˝#¸™˝úc‰kô˜ß4Ï5M˙Ç∆¸i∆ÁJ”]i¥K˘∂⁄P™¡É“›)£‚ó
r#cﬂ¢FªÚû÷˘Y¢q•4bì,t1#$©”¶ìÕR	f}ﬁÎF†ã®ÙE
s=Óî`ïNf÷∞*¸DÌ¯* Í"ÒU†<÷b9ãO,’˛:-–ë.˝≤ãx≈≠©Y¨&ì∂ 8 q“
¿´)‰:∑Ôj¨íG<2GVÆ#¬bßÊg-¥A´µÎì≥s¯fxÉ!◊ SØ,˛£‰∂hπÕÆ)	5ç∆åâ,…⁄Å¬x¬4fã¯ï*Bì!π%J§·b@–>EljY.ºY˜ê<X’£1"ƒqæ—ÿì§ìDoÇ,œ≤1gG)
;}ﬂG_ŸÜ(CöY6aMú–®0´…≤ö#ñ gG>ﬁ˜ v &Kß8Åå®8@z€Ä/êÌÒÃÖ"zâf'ÒIÙ√ £tqrãß$Wg&#5hE?íÄˇ◊tÕ¸r∆Ãﬂ©TÇÙ…»ƒO›ÖE‚·w"?rƒçåùﬂÙ)Aßé$…ÊdÍÀ$•‹á[çıdÒﬁ¬⁄⁄“*Y]YªOÓ‹Y⁄$÷Ô,¨Í—-çÑ§nZ_ÈT§´E≥˘‘ZÄLÎ£”)≥gÀµ’”ï=vhF;Îÿ~F¨ù#%π& ·Å/eyÅî»%øà'(ü üÙ˝IóÉ⁄Ï‘ÍtrÉçøSJ∆Ì¸¨Z©<©Œ>¢µ<"È[ù¡;3óˆ £‡ç"S\ 9ê*6;#hUpw*s–3ít«KÖ<{–⁄∆…ÀÁy:¸≥›…πlï[≠jX◊ãßK:–‡<ÙÕâÜ—˛πáEÀèˇkx·p8n‡ﬁK‘7¯€>—œæ„ô4M˙KÚ‚oˇ>nùº¸&{Úpsï¶M=Á’√ôwœV|∏ÅKñÈ‘±∑ª=§evD≤–j1Ó≈≈∏R◊™mÖâóÅó®$≤≤a9ï9nPS[∞~q¡$ (Ñ3§0t%Ó›5∂>≈‘õT:·ÿd…‰h'< mØ%¸Rùkû 6øOWõQÄ?¸õ{ú'ú7„ãà”%Cﬁ…&û/¶o’I?q¶∞0†@!	
Åƒ6~<›<ÙáJ‘ñ≠œ¢‰Ø≥è(XC5˛G‡ˆ¡“è—L⁄.¢ô*◊‚≥ÍÀL·yLÊ…|‡J¸ˇ	*¿/Ã0yªf©ÈÙ¶ÿf⁄Û]”ËïzµÅ†∞16ÂK´%‰>‹˘ì£{Æ‹;∂Ûc‹ãL[i;|—â…3≥FõˆñÒ∞rDÍ£˜û˝Å6ÿ™µz\„Q€ëÅ†96yO©§‰æK+Xs≈Sº¡˘©ÇÃ≠ç∆Fõæ/-07O>é3>÷2|cû"ÂL{{Ì_Ù∫ølvf¸Ê¿257˘Nmæ ÖÌ›|˘∞ü˝˝˝“~≠‰∏mx!x+∏‚]≤gô˚∑ùÉõÔñ¡®™Œ¿Ô‚QC˜Êª¯JÔrøÒÕwÈ2ÃùõÔV√p:õFˇÊªt∞âèˇ¶#¯¸ù⁄≠Ôti-R:S0¿YrùT™Ë—®ÃëÎ¸™È‡2˛'~õ¯HvÄM÷Ü√Ãíy2FKH¬L0È¡jt;¢Ú¡≠xì∆’õ&PÅ◊”C¸]rìÙLí>Á∞:ilém7∂«‚õ"nI˜ôn∑äü0Õ°˚¸¶±{ä!4%’U
ç‚ﬁË≥pÔ,fakqÙ‡Ωß¡´œOékê~ÁáÔxn∑G‚æ«∫!?'~«¢U∑·ﬂ¡È«˘+D1o"¸ˇè:∆è£.N?ûM∞zùQG“Ôü˚0CÜP∏jéDÚ>æµ•˜/oÆ?‹êûJF.R∏ÿ™ï%ë≤ó˝iúˇ'¸π√
jÌóJ•¬Ø}cöÈ˙⁄ï@Õ`±°—‘H°¥r‚w$æ≥éâíAäÏ+ıü˜ç·iî4$"GQ‘Á©=&}±5ó,∏TçTöQ9ÜTæ« eMmøCÔ¯Îyæ?7±j`[vkBã•tµÇ#ïùBÀµÿË^=ˆGeEâgWÇˇ&«)éü´≈Ó–™9èπæ/©7´
∂ŒCíÓ%O<∆)æYæ±¬£aÖy`™.@hæ,®0Åô§cŒd∂ˇ™≠èßP©mY®Iµúát#ﬁ˚¯À≥˝ãê‰a˘´ÊQGÆx’äÃ˚ŒœZÂ›Êì'è¢âﬂ˘Y≥jÃ=π˛(ò˘0≈8ù§Ngıgµπäy≠˙(J◊ùÓ¬3ıâG˙≥/?-POø0|ˆ∆4z‘SßRí}™s…Õ•Îç•\rÎ˝ï∆‚ΩïµerÈ√çÖ;EO'7i˛ﬁ’È‰’È§Œ§ü—ÈdıN'ÉÙîÁì™0}‡å®Ω¬2üÜéÀ«ÿûS»Gm‹∏là∑¥LÑeŒœ‰Q&œDÛ¡<ŒΩMdâOñØÖj˛ÈNïπ™ÔÅY≠8[N}H´“Æ,Ø4ÄﬂYŸ⁄X]¯êl, «ŒÊı§	/∂≤¡äcÍ
aú¥Cˇ<˚¥v–M∆‡ }{dq	îHÃ[À%â‚DO√√]ád§ªîUÃﬁÀß˙ˇ6j˝íºÇÄIbàöP\Sºütgb≈2	Ø7UIÄ›iX≠iX=[uÄh≠∑	ï1dò,˙[\b.Pê«ﬁ{L‡22Al∞h€!çs≠cysÂée∑]´EDJÚ@Á§ˆIHy	rBôﬂG; s™ìÑŒÃ$yRË⁄$ôõ$◊1».{@q∆îT¶–ü)ùA“√ö|`QÜKù^›R◊¥€~á‹ 5UÅNõ©;ch∆îﬂQäØ´ÔC'g◊5Ô·6F¬è‘Ç9Â£ü∏º*Ω\;≤y&Ÿ,RKXKêJôY≠Ä`îôÉy‹0%GÇzôå°6T*®∫§ëxcqí£ì2öà]^‰Z†!ê´Kõ‰ˆ√Fc}Mûô∑õ≤˙OÜ¥%®¸È≤Uû1MjQd,˜`üU”d˚B/ˇ:cœRÈ»D∆±yA9d&	µª◊uˆW1*0ãõ)—ÚR§)$√Z⁄\?K*≥ﬁë9∂ø+K´¨	>ïì¯èhG¸òy¥h{îG$ˇı˚C¸o•©ÇßıI =ßßËï¶±X¡ °ƒrõaì¢S‹˜M,VüŸm}£µEKNÄn'ﬂ0¨#˙L≥µÿ¡]Ï“∆øXÌ5åJ≥£Ñ°mvJ¸=÷Ω]Xt<Mã∆-≠cB{N›™D∞Ìc‹…äÌgnõ$ïÚ>VqsÏˆÙ<“€%ê∑í≈DßT…Î∂ËÁ:vWnÒ…X)L≈µb…H5#†∑F,7DQ6‚>´·c}Ï˝Øy<5µ˙±≤Efñ%ù©^M§¸(.oX=”¯π	ºÈ◊ƒÇñrÎ ¨'–-Æ§QÅsé”	§»˝r‡•œDF:‚8K©$:ßôÖı é?6Zû
]+’È)tÈØ3''ÁrFrwa±±æ˘!Ÿ\⁄Zjê≈ıµª+õ+ Cè‹5öæ„nöxöçŸÓU&◊úïdp¯ØŒNí›\∂Ã.	º–Ñ/vS€q⁄]0äpãÙ;'«_7Is¯•Ö—z/ˇÀ'måá˙ÏSüÈÁÉ’3˘`=üÜ®x˚‰ÂsFˆTÃìóﬂ5ŸõÙ0`œ¶•™‰„øEŒKÉ~œUì√·ü≥á~g¯m≥3I∫'«ømRıÂ[Ã:Ktÿ>«ò•?ÿ<hóÃ;y˘Ï˛∑‰`¯¬ 1àèÛÒﬂl€=¯îEC˛ûñ~˙Ú0®¥ ”Òg¡Õ√ÁÕÙΩ¬d4Qıü¡aõåÉÎùºù&.%$≤S)ïkπ	Ï~^‰D†ƒ	QKPD¢úk˘≠¸íî‰B;1yÁ¿ˆ±î≠∏^aûbx∫8ò≥XÈ‚d¢n£(ë1I¡_hQFTc⁄È⁄sQÍﬂù•≠ïÂ5≤ı·VcÈ¸ı`ùl¨o<‹–W˚ÓÄ°v«Ù¨∂ΩuËÅ*s•Û]≈«ËL˙≠„ΩˆÏ˝*+vªÉ•9{ÑÌπ†∏Aˇ"¥7¡à^}>¸√!ÈÇ˙C˚}îT%ï,‘uváœ“;y˘Õ ﬁ‘aeFC5†/®&ƒ2Cû¬ø‰}cœÃñœZtzΩê¯!Ÿ4ü 'Ωç•‰~’§ ÚW™uP#€£˝ébÄ≤¯ÚÖ›û$=zS6äºCGÌKü˛µI>ÅŒÁG⁄‰…ÒühÒ◊v[K]ìà}±˛%d•RÂK˘})Er˝<BWã:Ú|¡UÓhﬂdP$ãœEÏÆ<x∞¥πµ≤ΩD∂Vóñ6–’≤D÷∑ó61ˆIKÙZﬁV◊4˚@"ßCy∫`a[—@¸Ã—àÅJV¢óó®æ…™ÀãÈù4 ;˚êÓÚˇƒJﬂœ≠∑“éÂ¢"E˚ıÎ◊(n&˜JûRÙGÿyÍ8Æÿ2Ú[≈ïZPÿq	ÑxlqïÇ;ÅÕ”ïf’Çî/p@¯nÄ≤çßfΩ]Ò67Òè¸™P¢ÔOÕî1Ä≤"¸Â©a"sZôñùQåæ™î™®—ƒÊµù:WuWÅ∂ìôo°]Õ˚å¯Ä≈Â9√+`(¢‰_•U='œ&L¡4ó3»≤[V€	¬:®^| H¯˘…GöıJv÷È|≥ô?É9ó‘&zsæ?U≈òÁj:ËY‡Ü¨' .î´Ç—l8˚»¥áC∏üxw”3˘ÿêÚ‡»EöGÿ≤<Ñ2’ÿ⁄a¬£h£ﬁ±⁄ñotYü{Ük∂∑X-s◊p)∫ª∂*
∫ëPß“˜ßÊDcÈÿïîé]+'√ê›‰&¸É~ﬂtõ@1¬‹4º˛ŸÄöÍTæˇãyMü”ÚÛ_£r}¸Ç™ ü!Ú’sªCµ°?•›Ω\ëNEÚ£ÛpG¨l.-6ÜÄﬂ^XºOÓnÆ?†¯]œ¢DÙ°€ΩÚE\˘"t&˝çˆEåvﬁ§J‡©ÛQùÎ¢g
Òùxï¡s~<gÈ]˙¿å ¡ZB|∂^•,F§rÉ¡b0óåèN¢~\öu-ä;H}G{ ?BaŒÒWÍıg».Öh;√/≥à6öÖvé.É(»CùS∏@fº…@î‡nπ–n9®nëÄ·eo—k%ên"0Ç;…€t∞~D8Èl11ò∆¥æÌÙ°•©+˘Æ’üêá≤O`t}e8âﬂTƒ¡Y≠yÚ{÷ê‡‘€Gw@¯ñlg|‚ô¸
v¨0X.´IÓ†®#ùœÒK…o¢Â™‡1I7∑‚)]ßÌ4`≠‡ıp¬€ÌyÈ˜Ñ`Ja€Órb w¶v]ÚƒuzÅ;KKf]/ó•{¶
‹LEÜ∆÷Ô,cC¬Wvwò±∫2‹mˆÍs¡r){µOéø∞B©¿‡ä`™K•“©£ıœÃë}v^ÎÔÃ=÷zJx(íäj	…èŒ¡6[^Z[⁄\h,ëªkw¿,[]_^ﬂ*$h∑ÆﬁØ‚_ßù6sò
oåùñpnWuåëÈ≥Ki—yT}>ˇø≤˝Çœuúè+¥±DáÙÈ€#7Æ⁄_O_üƒ™—∆)9v≠N&ﬂW(;¢SÂVﬂpüvMOê©S}H\≤ÛÜ§êÁ˘õ”ÿñMx[,¡Õ∂	Y=4‰ 6¨ÈÁ:Ód+¡P®F5p)…à.FøíÉ5ßi‰√…ÀØ¨x¥*ÀhuﬂlYÜp‰Ø±ˇIá¥Cõ_ChXÀN$Ø,E9,G‡'Ù87Ù¥ßùÛâ©ñ¡≈∑áC√…Òwdölˇ⁄rÃó_ÖåœÕ~Bett=∞lπ≠p7Ï)eÍ√#c{÷˘îåûéâ+Óù^¡Zƒ˛ÄÛ0˝ìú*a˙Û LIYP B3âãS&ÉSç…Ÿíl[¶èñ6ê‡8nBØƒ÷öz~ˆ¨iÒ:B´Ö’<Õ—Ltm™òÅ&?MñÏv◊Ú:Ç·kq`◊À…
ËyD]£8$œ´àD°r(¥Èvc{í‹±<€<|ÃΩì‰ﬁÌı`∏≠·sõ¿ÆzJ≥!˛xHOˇà&>[⁄0⁄fÅÚ)¨à„C4Èì}ñH˛rVsaÆGˇ)T@%KÒq˙M…Ô∫¶ÒîÍπQë
1Ωæ˙<Aù@∫1a^VlQÜüƒﬂu¶,€Ñ§H•D3º˜-ø3>∆À	åM»≥»sÓˆËÌROﬂ≠‘˝“Á…GAwÊˆvL3(i‰¸∑«Ùæı‘ö¶erŸoœﬁNΩ/º€AX‰«îK»KÊ ¿ß‰ Æ˚Id•I°Æ”SµÙä!¥H—X2:j ºí>˙âä∆7Ç∏'6~1Äè> pæÅÃòR†∫s%	I@ÙËñÂª]≥Íe}Õ”:<#ñø—÷
üVØ«>ïê<õ¥*-ˇh∑ùo““∂z6ur^%–x∞Æ2ns√Íµ•õ´ á\8âo5K∏mçíÌ4Á©eñl”ü6˚íŒ4≠ä‚M_õæVù~ µŸqÅ!ÙÌˆ¥kÓYÃﬂ4ı¸i6œæ√äôLa÷Ïör˘Vs˜fµ\ù-œUÎÂk’ôJE^“À¶èÒ◊ñ_ïı7§À⁄¶≥◊∑$’ÿF®∫.≠„M%√{Ï!!MP˘Tãì„ﬂ@üêÛ7‹“¢œÂï‹ÂÎ/v+ÑµÅÖŒÑ¯{Ñ6<ÚÄÜ,@§yÕ.˝≠á∑¨4»›••;4‹™®3ﬂ4[Ë«ærÁ_ÖYÈL˙Uò’πÖY%∂‚Uú’õg≈*»í`Ì2£∫ò´Âì„o)ò¬ÀØlLÀ˚W+Åu¿"Ü€÷eëæJπ º?≥¯°aÁÊÓ˘'«_¯§Û√Û4eü6 
•YvÇ¢ëMÿ”¬¸≈)@∆#ƒ
€ƒ≠òD˜Ñ◊]Í&íú√`{ı9ç¡Üâ}ûH+,Ë“:íç!ÃAÅ—êñ¢”á* Å±QX`ÏElÕbÀØóÇ-ÀÎÇΩ¬ñòU˛îÑ[!S=¨è1§êøGfO%¥≥¬Ã ÅÉG6b9Rﬁ$LÈ∑Òë}¥“´ˇèç¥Èt◊#oÀ∫∞·lê7…ìƒ$)oA?„#áf¡…)4™’Ì∆˛ñØkÛ$âòù·„”3 >d^lrï\QÚÖ·Ù
Ô∫™\í£«&§ﬂïn!¥K”M›@uÖ€i¨18fÈcíÚXdº>]üêOœ<t?£òM| Â≤„3 é%]◊îãùﬂ˛Ö¶éæ¬ÒZŒc$™Ê”Â˝·üzdºö€?%¡MLo©‡-ÁÏJªÅDb∏¶Ë,4·oÁ5Ïì„ﬂ[¿h‡ı€√}2¸G‡fOàﬁÓ…ÒøY¥@bˇp(q∑Œv>±¸®›{7vœh°Ω4Ÿ,±gºÉó;∏LYÎﬁÀ≈á˜∆◊+7∂7ΩVjÃîh¨ÁáäLÜú[@KO?tÏﬂå6*
6› Òˇ/bde6L|á\Öõûa∏iV˜øt>™∆ΩÖµ˚‰√ıáEΩS	bΩÚN	ΩSï+Ô‘õËùÏ:ˇî>ÇElzÅÜU4¨f8l€5M;g»>°vHe¢õCBà¶Pb Ã¶¢¶MÙÑ‰U·ÑŸœ/ np¯rè¸@Ω0√ØÚ¯¥†¥ñ¶«ËZˆT∂Á≥0“Yym_Plèø£∞v‰)¶Ê—QæÙ€∏â~Ä£ˇ£ç
Óø^•fg¯íBâˇ}N/ø’\K}wÏ4|÷yM¡Dd]I≈™IUG”°hv2biVeÅ–ÿYlíºî
Ñ.H!Æ›•ˇ¨h'i¨ì∆“VÉºø∞Ω¥E◊<x∏∂“¯TÄ’”Û∑n‚
≠˙ÍÎ«©(ºi«X¬-yuúıfg-v–±˘àjÉ⁄Ï49óäÌ$Óﬁ≠ÃÄOq“u(8È
C §–‚¡;êlÍéú+9«\%≤ÔÇb~7;?|o§NÀ0ÈÇÅŒ]Íø¥Ò´_ò0õYº;¸;≠ãëáØ·ª4É#¨™Vè‚_Çäı≠›!ˆ´œ0ÅÇc&nÕ<»Ôˇ‹C˝Ï€'áÎ∞WèüËQ4OˇáÔAKmìÆaçåbûMcB- /àlûw∞tÊ|Á4∞ÁiTMƒ‹I˝£ô›ö_^Êõ™“lÆbuPF@˘…;Æ˘$
ª√Äπ©=\ÖLT”Ïñå~_Xoèz¨oé=Ω≈~*∫FÆ9}Ÿ"∂£ä`”Õá\:Ë3áe◊j£6©ÚvP-∂|«5⁄f	+Å∂««Ëª=6˙è˜P^t«&…v"sijÁ≈∏Îÿ)# ¥_Ä≥skﬂÚõ¿ù}›ØÕ¿ŸXo¨Æ,ﬂk`ÌÎÖ€´Kwä⁄1[}«Ô¢Äæ√Øôsıxf-Ê'Sô√Ô\éÉõ}√Èo·æi‡åAºŒêö≈È+Îå\¥uˆI0Û3—ƒÇ1èT±çBÆÿÆ–2W^2ì/\RXcZﬂ‘Ú¬Ùì◊i‰E„⁄
«e;>Ÿw\|9‚Y Fâ	ãuåd+ËôûXö™G◊ﬂ¨DñÿW–∑èGÌ˘y€ˇe$√nÅ›ÑÖ=GêUFø⁄u¿àÇL;Ú£kd”)<±°¡~Ãl‚?úïŸtÒº çÂÒπWËŒÏjæH[foƒe QπŸZﬁÇ÷I ÷äwh”tŸ]`'»éÚÔ
'·.∞(Ôx≠ëØßËRQ≥îÌIæõÚ(b°æπõ„‘‘ÒZ}°(=C≈b◊Ò≤Ã˜ufm2‰¥≠áÀÀK[£Ym“»≠Aªmz˛ïôwûÁU∏^∑y˜0ÿﬂ§¿≈ëX-Pï:&qÿ ‰t∂¡òâAQHY‹±ﬁ7ÌE√œïm¡•∞ìa∂t/_æk∫9WgM—+[4A±∫%1£¥◊J†ﬁõ≤YµLT¥e©uäÏˇ	ÜΩc3™¶15a$h◊B+TKJ  ÚWb[ó‰ôáí˘ÀZç…Hô¥çwZR.⁄:ä¶•	:ÛA ßÉπïê„1‡q]ü#ËrpÑœÌ[ˆS˙ª.Z\W •Ñäã-—Ö†∆u€i’XdRKÚHÓÛ:y¨çÙ≤»ÅŸ#Ì·_»ﬂßèLŸê%Xq¬$k„ ÿàâH∆°2«?¢Aw¯
ôk–˜ u±ääc9ç‚-Àyìºﬂ]4ﬂ4ª¬ÁdAèÀzÇò®–ãê	q√Ë6ïÎ∂b≈∞ÆÛV4˛‡‡Ù‰¯◊òAè÷\aï¶Ì6-rh≥`ÊÜÀÿ:9˛kˆTÆ`Ù€ÒòπYÎ¸=≈M¿#⁄oí•åŒ´CûçI√Ê8¡Ñg¿ÙÊÏõ|Å€=<™Â%¥qL±˚=| µÏ—|÷Åö—]´ª”√î3PåÙÀıÃ‡¨ãÍÂ–Í/\m ïyx˚·ãüSY"ßHdj‚}≈≤;√,Œ,n Unß_å$ÜõÒq<ÈguøõÔÔÏ¿üÁ=uÇ/¸l|§5aˇ˛/ΩT£Â˘"¨#UÍ®"ã3?=SÀÊ*úo9…TI'E4–ƒMZz(kB„Yd>Àe’ÆÈÔõ¶≠°\,Ù âQñeX"5$ùZ û0#\P:¿ﬂëW≈`πÃ∂„Z¶WÍöv€Ô–æ≤‰^ûÑà¨£z1m<ÿ™D«è^}>¸* ˇ∑såıZ0æ[Ïò{Æcﬂ¬êå&ôçÀ¿tí≤DòE¸ˆQä¥q\«GÕ£2W¶X`Rå/1ÃõLè√ñyö–ã(0qƒUı“≥ê≤¿?ôR%Ùf5{±…)K˙ïß¸ é∏–<¡öÉTÔ/SúÉRùŸJ£2[›Õµï`;rEı◊OEm.X˜π»$:dï#˚¥wØÈ:›ÓÆ·N˘Àée s¿è@˘_ÿ3¨.˙Ù8AÆ„fi˜∞ï¨î.	≠ˆayA˝rì»∂âe7ªÉñÈ…í¯yáÜ_≤ZÚzÑH9-6◊ÙÆ-
`-.Ä5
¿Ü#OgM<Ä5M95Ã“å&Xûúo@„õ‚ePœL–dk¯ÑjYz}vãæ£’"owŒ_⁄®)j±ƒ.RQk9yüÒ¶ò≥≠1óJ%…ºÈΩ≥˛¸<“yÛú+$ZFl8˙FxºwÄé|P“ÓP!ñ÷mßUàz∆Ö√ò
—Ç59OcM)F≤/	U>ÿÄ=Ò§–Ó∑èbº≠›xíàîTˆ&∏µ,≈˙/Œ
qê ﬂ‘l-“„·$
b–≈◊«Û]Á©9µS{§¿•ãöÖ?TÏﬂH]$W)kFLÍg*›*zö
ùÉYæ©ûI_GÒP˜$‡®q¥
&hdøâh4z}3tbû4Põ¡xÔI≤H√ø≈¢{r¸€I≤˝
!†Ü/åI≤l±ÚÓ€IåÛ‘•@'ˆ$πﬂqL[¸]Ø>w(÷QSÃ{4ó∞MÑèæ,m (eFmÚ√\√V„&q√ïQõhß6jŸrçf“ÜªK◊¢ùœò¥¡„ˇŸ±Ïqåü(éˇ|Êlí®/¬§M=ÒRõµBÁ‘Oœ¥U©Ïc°HQfÑÀy∂äıï°ÿQ_IÍ‚J}i$ Úûä9ıÖ1qß∏êCÛ5πç‡'P™kbæzÇß^®'Ä=ÛÕwŸ≈,DQ7 HsÊÄ_ò+ÄıÙÊ¯ÇI—¿o◊ÙËOŒï#‡  k?G ÁÃ??@Îic±ÇÊπı&˙Xæªﬂ°’ò' ÕÉû õ˘4£µ1◊;„&> p\^c=e7S[=˘ŸôõÍE≠ØluQKÀlπF2’cT=æ0ıOJ¨]•¡å·r€ÎI¬æ s=ı¿Àl≠hó…XØ
¨uéI-ˆ˙l∆b◊1ŒÛc>”lD[œªTÖäÇ ßgÍE#É∂»<‘âmL¶»?…Kª©7 kJˆÚ)ÁÎpz∆Ï)‘¥Uƒ9æÛ(W…SUÍ∞≈‚òÒ#äRõ“™√ï<ùU¡Ö°“ Ç¶•- _=G≥MoÉ∂kµ˛É¬Ãõ∫Fç*1“a–é\◊8,a4Û¯ÿ¬Ì≈;KwóÔ≠¸œ˚´÷÷7~µπ’x∏˝˛˛”ÿı÷(ﬂuºKWSÀQ–õÉMH›°Cá?;œò’ÚÈ`”€
ÿ®oá=>èÜ±Ÿ=ÿ
ªx∞ç‚Ê¡&€üö∑K©ò≥€xóæló∫zÿ‹Íy>∞iy{ËÖ˘Ælº>ÿ§<N˚“ŒﬁÉ˛õ16ÍŒuaã+É‡R1∑Nﬁû	‹4œÛ£(¸&qSIz-Ê=Q!,$re4+:Æ`º∫,CGÑ`ÀY≈g à∏E–˙,Ñ¶>•a˙éÉ´|õŒâßß/…:h«©]B¥™LµâÉ”e.ß Œft%ö∫^ír~-Üñùy›”Á/k≠À^M,|Ÿ9›¸«Ωy^&û-dÿ”l§™Ú˛ì(´ì+ıG†v}rvˇ+ójè5îD¯-EV¶A—…>⁄´uQŸÊ€çÌ:Ÿ^⁄‹¬DÛ≠•’•Eöræ±æÒpC?Â|€ﬂ´o8˝Aˇ*”¸
9g“œ{kÓµ #èP)!œâ"L°Ωà∫ÃeBôîÄ-â“FãäÛê-Ë¢3_#qÌ5™+ˇPâº%‡¸1Ò,Óı◊÷%…ò¨
Ovéˆ`˛◊6q˙Ú∞ê¿Å∞8p]òºçÆqHÀ∞¡b2’ãÑŸf∑dµ®k˙Ç_E*≤“%†vP”üı,S†µÕw¶À0√Öè'`í(0Y±%1§∫xJßæZDÍ≤§Ê\“üØyî√è„é·àoqÚï„Ápäóiß!WlCˇ˝»©‹±Z-”VïôL”ê¬L∫≥+·1|àC5=#21Ωû∫b°⁄¯LÓÁ‡åblı$¶™Ù|
4,~ G¿ºuM·È0kzfûÙ,d`YÂŒÔÃ$∫í
ç8ÍRRÄ–eüä±Ã,KDπ'ut6pc”Ù Öm‹ôQDf∏Sé>s±OÁØCˇï£ü%ê ÄÍ\¥(ƒïÇñÑ† êM:›+vÀÇt‹SQHJ¸ÂI‘¯g˜à ÆÂÎŒMëEª•^3Q¿]¥ZpÆîzIÄ(Ñ„÷–˙O±˝”∫HËÇ´¬`i&¶1¯∏í<*·üäÜƒ_…}Y!îñ—S4zàï”◊?kú˝¬Z„kD5¨´ë ﬂË™J€çÌÂu≤¥Ω¥÷ wóñÓê≠∆¬⁄ù€u,Ì¡‘`!—+Å‹CPΩÚú±á`¶zyj'’œ√o@˙ªS’‡9ªÈÊ„rI"Ü≈!â9â”:#r‹RáÑê´†ü"…°Æúg‰¨wóÍ)ËnQ]IJ›‚ííD√jˇüEsÄÄbˆN^˛›&ïÚ-mÙ-≈”z˘ıÄ¬j˝od5Ã⁄f©>{√ø—/€Ïê]ZãÚ’√Áô˘à•Ö˜†+ˇÜGkΩwwÂÓyﬂqÅ⁄AñUÀ’Ÿ”¸;Ã!˙≥M<⁄%{"Hˆ/≥ı*4âË◊6πáµ)…6bÚ	LSâDÆyŒm6Ã„É≈X[?òÜÏ∏Ÿ,0∞0ú£ø6âè˘C˝Q†√S0’ ´@‰n⁄€Û˜™Ù?k¸Á,ˇyçˇºŒÇëÕÛï8"Ö‹'ÎtìÙ]ßiz^ËÜ¬ ª5>ﬁ§77Øt&rΩ`¯∆[ÕŒD‡õ≤a∑˛RdîMO√¬zæ”#]ßÌ¿9‘∂AÏ+ƒû’¢j{Ö„•¨‚˝Ûd”l¬ûD˙
ü$ÏÁ{Bbˇ	Œ‡<	À˙]«hïˆ≠ßVœlYF…q€”¯Wˇön:Ω<r∫5›™OÉæV}å£~\-Wjèazån…€kK2∆pçä?ifzfüT+ˆ§Ÿÿì<diì>…(ŸN”qûZf…6˝i:Â”†x¥Mo∫>]ßOöeOzß:áªm 6ﬂ©^ß¬œRﬂnOª&ë:ˆ4Zgû?Õîyﬂ¡»Aø3Öaú¿ÀÂ[Õ›õÿGy∂<WôÅk?ÔpAﬂ5Acªπg…«≠¯¯çi„:éˇy∂TÆñ`æfGsµR≠‘ ◊ÍïÚuÌ1_/>Ê⁄tç“—ıÿúWj|ŒGwπR≠ŒUjïÎ5˝qW Û;∏ËÎ ±^√◊©îS‰3ŸÃT´Â˙Ãµr]ÁUûâÿ„8∆ánx@åSÏX≠G‰”OÅŸï˚ï^[ﬁÅæìÙÁ‡°?'Ô|≥s>Œy°~w*Ω~Ù~Ã#Aqo≈n˘t≈ˆ¸ËÊñ-ì¥æ3µsçVIy≠ézÇ“n™¬~DW◊Q˘óÀÉü÷á:L—œ=°ëVΩ;∂z™˘ˆ‹ÊÕ#Œ(TmF¨n‡j∑:ÓxV‹p√ÅÌyàußTıÉw“ÙÇπ¿ºû´øÛà8ªˇ€w
≥˝À&,,ïPGÃÆF≥ZdUTBr«XÛ∏cï±Áä|iUŸ™êªÇß
 "ZUûÿQ%#ú4(ú√◊z/¿Ò;ö~yΩø±êX-C¸r÷#ypµ±≤Ω≤Ù>[ﬂ,Í ~ saÌYÊ>ìˆé{Â>◊⁄ìWé`]Gp•Z6´3è¶ØóﬂËh±”8vó—¡#+å`Ÿ-´Ì`&òD6]D†!ò=2ëãvãπ◊ïì¯<ùƒÇÍéª@ì)?±ÄZ¯)Çwr¸È“jXöapr¸Ø!ƒ!É4à6ágÔƒ8|Ÿ$„˛…Ò7§J…ˇmìÎôß–é&J‰BÎw®ó|‡öÀ`ÂaŸ˚ì„?ŸÌ3p¡ŒD’WfÖ^ÿÍ$93IÄ{œº6IÊ&…uÓlµˆG§ﬂ™jˆ√Õb=T”Íè€¸·∂Z˙ÙÈ∏p	πqT‘√Î£„}<¿‚ù˙f}™îM·rA	£5b≥®ƒˆ4ˇ"ïv[®>6]∏ö\—çeÙæGó\âT†JÚNñ§r:líFWj!ˇ&=T•nÀ-¢âçJ¡ÍõvKqrë¢åùz ÃqfïÖ%ki+GB‰Èt¶3¨‘xÔ‰¯èáXƒ‰_.±y¥xoammiïl¨,ﬁ_›H‚Œ– Û R∫¨!3’s∑îO8gKiÊ†ÀADvÊÍ{ùì©~:ì))je¡4)Ø∂⁄†¬Ì»ä,èîƒö	Æ«(qxM•Ãb·Øß2 {ó›$ãáÎÄ∫Îê˚ùÅ›>#cbïÎà	ûH‚uàÎÄ‡qºD∏E§w˛ÇT$7Q£◊f(f9∏Æµ®ÆEye-‚g‘A,Ñ5v˚t¢5ˆ<›≥!3Rm^Ò· húAõ}PÇú‡∫:]≠L≥Aw:£<_´\´‘*◊Íër/ô¢·Ú 7+”U2EØ“‚1ıªÙÃ¬6=DØeç¯at˚µrÍêG4<ÑcØ(˙∫–ŸìàF,ª?•«Hœ¢«ˆAÉ0;¿ÈL˜ÊXk·=≈0®T≈=ø3¸sØT*âzÿ3∫êÁåæÿ˚˝j`∫á¢}<°Éı1Å)òWÿHﬂ8nñ|√mõ~âv≠{∏—ù∫é8Æn≈7Zπ⁄$¢)àÉÊ¿ì|Í¸Æeõ!$ÌÈD¿àHl≤Éiª∆!ïR˘+¨ÿÎeKaë®r˘9·ñV4‘îıSï.Zê=9ãS[°Ú^Rt2x¯'†£6’œÜÿ1®ŸäÜ|L;J˘Uº0RÀ®4É0∑8öa*~-{∑:∞ß%^BKîJ*ÇÒêœ™RÉ“œO® Î1‚ÒzR]ezÆúVWBÃ8uˆYXúF>*eˆô“’å<YPvÜ{=zéÌhy=¬Å¶ñˇπ/uÜ∞ë´∞ÏÚs–Çµh∏-FŸSD´Œ Ì‹!]™æªƒÛe1¶ºó5“kÕßùôboäx>ÿÍh£€ﬂ1ö∑-”«`´Nâ≈Ã‡V{ı9≠•∫KÉo«.µæ£QæÆ0Hô û
∏*À8[˘xT⁄Jl^W∞Àè>J1≈Ågiíl+P`“ﬁŒ\µ,ÿŸæ-—öe[îŒML¢Q{ìÀXô∑*tΩ“‡îx$ N•TÆ*√´ÇaÓïAúï—€ë\GpJ§≥o–S\Kâıõ»Nà∫QEÕD-x•≠KdìºáÂA~Â!sQñ≈¬¥é€Wp§†Iwvÿ∫=FTsNiÃÙƒ;é“ò≠ËI:™z-Ò÷3⁄‘N•íí )O9∆czIù/–œÀÑScπ4Ûà2eb$ç«H]ñú*à≠¢xLt:ß®Ú¡~§fJÇÌÏªFüœ∆˝¬±ñ◊J◊P#j-g·–∫…Yµ)ÿñ tÁ–´˙∆|Ö%S0ì–˙Z∏˘HºÚKña;Vì"Äe38Eˆ-–ı–£Ç◊Îw-à¿µŒæ√∏hÄ∏πG {Œ:≤∆8õLïF∏Ç:åÔâ,v√p˝˘P≈X”∏hË;’πwËV¡_g·WÈk»!sÂƒæ;Ê„¡6ƒƒ‘Uò§h'Ò„⁄g∏Y5¶ÑQ=_K>ü~J∆¿ÿó¯Õ”°C]<w7††;÷û%vàjM7ù!ê†3ıwaZ«_„GJ‘∫“Iàèê°0“†ª!⁄£åïõxqrHQ@Ç:“Ñ◊6¥◊ë«ÈÁ‡ƒ∆¨˘ç7˛=Bõn4pºçoqç.?$$cú«àdñÜR>ª‰:åÅ⁄Í√õOÌ[]`Qò†›Uºêﬁ+u Tÿ/EÓüg#)y>ê¥˜>∞Òqê›y‹uÏˆò
á\6ñπ96¸Yd$|,1[gk±±]¨ápU>Üj—1dG±›ÿnªE{	Fr}ÜçÔcû≠n5X›j=#ïZƒ€ËÔ∫ΩÎ‡÷b”`à˘`%Q”*üƒö SJW^∆Ñﬂ—Ì6V¿˚˘!‘,ä≠@G¥l[ Nßb˜z\ÍÅ#…⁄5q%”Ç5'^gﬁ±Ô◊Ä«Ëı¨)â5*-iˆ•q—Î)£$˘Jí|PÃW
¡=mä0ÈWË$Õf„M»2:“ZZv’d2V¬ô«4âÜpø3¸õ›&>5`ˆ¯◊á,Jz⁄99˛˜>Ÿ£˘‰4¬iá÷<à
-•£S,fJ~tÒ.w6ñónØ.aúK„·Ê“‘ ⁄ˇïåoX‰ÓÍ˙Bcemôºø≤vg˝}ΩÀÉ{YjünºKÀ5⁄ô8=XπAÔÊuW=À\∞À∫ÒÕ£r©\O~≠é˙(óÊÍì>™Î’D¡ÙÆÃMä≈£Å7A»˛X¯cπÒ6,Yi&ÄTgB¥Zjjïπ}Ñx´’¿ÕÅØÚÿI40Qéc˙d)åÍ˚:7Ç∏Ã≥Ât‹»‹ƒ£¨G%≠∂'ÉH‚Z%˜∂]c7àyã}¥ãY^“P˝‰.B¢“$YBt§#zù6U≤ÈÇ◊£◊û-”Zå•∫Në.Y‹I“êïûaÎÉ	*†˚≤°<ß- ÙŒœhìù£T!*|lA*Ge6†B˛Aïí•ê√öÕì£t^¥ÿ2üàqÙı&6m÷‡Å„)#FW"©"äâ∑ºf¶≤É^hH“	/“í}ÀÔ¬sQZ§ﬂ¡∫∆(Ô~ç»($ﬂÔü#úñp÷$Y:ÄgŸFw»\Ç	X(Æ‰G:ÂBi~¥ ù—&S®sdèäÈµ˜éƒïì4X§yÓ:˚ÏFpòEêy=ÆEﬁL3ãÏZÔ9›ZSÏgˆ{«ﬁ¶ﬂ° @B€íK{x–Õ#˙C‘—ÉÔÁÅÏB|)îKÆÎ∏·yaÊnZ∏NÒN°n.˝Í· Ê“≤±˙pyeç<Xø≥∞™˚º—¥-{”¸x`Å°u?Æbû/_ÃÛè2;¥VøåÖŒno±Û√˜`wø¥hä€˘dy¯¬Bê∞„ﬂÿk g¯|6lV›m∂.L›√∫ó¢ÿÁWü#∏ôwr¸-iÅ˙@≠Èo—Ç~ıô,∫òC≥eF#»hÍâG.Á;å›5‡ök2=ëaΩeæô${t[lf©°øÔcêŒK|ühñGILZ<gêä$ˆ¥ÛhcVFÅ$—y‡/÷‹ì!ÙÑWo±∑@¯¬ﬁÎ”«>ˆ|«ï¿˚ÉLŒBÊëÉëå9ÿà*óqOˇÜ%åÍı…‡ˇ»	41{¡&"˝Wü[Aík3"—s“•’Ù§øû	+Z—≥Mzõ9œ§∑—÷ÍRÇD?\[Y€j,¨Æí≈ıµª+õh˝®
 €ÏÁ°ÙÓ„¨]©~W™üz“ØTøUøÂì„Á4èñ¥S*ﬂ≠◊¶Û›¶ÄÕ·ã %£-‰9iÄT¢nÖ˛'»Sz tãj±ﬂ Ñ3…·&ˆN^~√ﬁ—Ô†ÜWªpÖE<—z,≈oÜˆ»cØ[€õôZqÕ(™n§/«<ôˆàÅ·ïÏ÷q	¸ÔèZ]Aô¯`¯ºIÏEüì∂'Y +5/ge(“¡•”Ú∏éág∫?èT>¸scs}ysikã√–˚∆≥ÑÒ∂ååÄVêá¨”ê≤“SÛ–Á‘XÎﬁÉOLGœË8…;)‡.L‚ﬂÄ®#ü~™}€¿é›:H∞ ä<û|%9
9õ Ã,x‚ôg'˚yÙÀÃ≠ñ∑é	QÅyO©∑<ìÒi‹Öpõ`iÄﬂÓ[~≥C∆”ÔíòàE∆ÃÉæ„˙`¬ª¶—À:Û˚`pÚÚk?Äh ‰·∞ŒzARä¢£0qÖ ¢ô§£æ’Wt±a5—ı”N¯Øínúæi?∂©æß—…ÒÜÿS†”|—ît÷pÛÈc6øä˛;X6‡≥ ÈﬁÓvG“£—j=fÿ“ä˛ò˘$√bTJ¶3ŒÓ‰]§˝Ü©‚‹˛Ÿƒ¯ÑÄÓ@oXîË§{ã‘ ÏÇrñƒ}∏úÜï ≈ÜÎ¥ÅΩdvπu+Ë>€fbÙˇMÚ¿;%*e∆««É·LÖèô ”A/‰¿à …◊fá¥¥4ç+ì™àU¿t=≠ÒZ¡xÿF“iÕÑ¡à¡å=3Cˆ≤õ≤"çÊÕY) TdQ≤…òÿ*=˜Œd‘ø}î‚Fcq`å' Òêó±gQ–^ƒ‰£TÖ¡¿Q’ƒ¸*[”EÇ[r.Ê8ç≈Kºº$õ\h˙Ís#u¢g∆ÛnOiÃÛWàÙyX´Ï,áµRIéâ˜	^•Ò€9ÛT‘Ÿ¡;}CgI‰R…∫-x»óÎ‰∂ –éﬁ*ŒlãbÀ 29qUπΩô<√„H‚§Çãµ8[Íå∆Ñ‚#óF»«Eõô'Ω}ƒï°gÔ|$œﬁñ…∞J©∆ù"bà·f¬NÉ&Ü´íÖêkqD¢W;è'ÃNb∫ÇÏ<ˇ'rÜNd
≤7ëp>àò≤ÌíMÜY"é)≈cYÄtŒ˜¢ıU·fä1∞$»ß?^^IŸ∂„„}◊‹cÿ¥≤Ï/òºH\9àê¥0ü∂)∆¨V◊§≥Z÷í2Dœ&‰g÷	´∆≠Dh‡%¡˙XÒãæÄ∏2∂ñŸ5Å{7˚*;?ﬁ∏Ì—ÏK–o_É/Ù,üÁ‹Èüô˝«êE” 
•ˆUR>ãN§æ9±#N˛Mlπ–Z÷sÕ›µ‡Sﬂ4ªd¡Û,x5≥j1—ZÀgÙ∑W`raB⁄¯æbH˚TG±ì‰`û Ö^≤ƒÅfäÑ∏”§xB`0XAØÔRﬂA˘ŒÊIu˙h=T’·ØåΩ&±siÅeKî√2ÅæAs"`L,W:⁄&ïŸJ≠Z`CÏT©éŒUán∆€ôiÂ«uafD
=S33õŸ ¡À$FUèºFÚB‡®éöò B°“ê9g—5Åæ÷VŸCúΩQ`Û!fí«ıÁÀÏfy±a˙Ü`Ñ<≤ªqÚÚπwüˇæâqÙˇó4©76w⁄iÒΩwªÆqùƒ¯/ÁŒOû‘MLJu*?ûç«"]ü°§9ì[’©.´Íö⁄Â9´5Së9ßrI(™ßÆU≠8∆JQ`Ë€–Æ|¿ì¡ÔÆA%–A€Öqm ê£Kû∏N/6{˛a¯\‹ÏZ˝)ÏãMsè§ ºD»ˇÖJù6‹Èir]Œ%¸ê	†NÀî•EÔÖW∞ééÖÉácH9Õé·SÇ	>´y#*H£ãd≈„LÓGÜù®')¯Ü	;à‚◊»ôÃ*´ÜL„nE¨Fì…‹cì≠¡f( l∏Â≈k2 ∫kŒn˚ø“#a¥~˙”$N=.∆ÙÒH¡›≤ZÊÆ!HÉ#*ïi÷•∆ƒ≤Ωnr‰!¥å¯N(˝∆ã|Ω`‡i¡G›πaÏzúãÛ=‡∂-ê]F•>óì◊ßüJ•ôª@(ò≈)√ıHØîôhù·Iœ)Sc¸0viÚ$?ÍeH¿ﬁEÄ â$8é ÁÂG
I]`πL!õãô†Î°OKÜeúç“$P	KÎ~q±ùê◊B]PÊ˙ìøÄ¥jæ?ªk¬J≠¥né±çŒhdk∞õf≈nYM!C⁄QÄ4ñ÷_dåw(rW¬-ï`wΩˆº?U© ûópHOKRNÈu1gCmNÄF¥–	Qì^Tƒë.<[9©ﬂﬁQJœOwã¥Çs⁄‡q=»wOéø"›·?N∑π£—_ÌÓƒU?ö›-–`“–K¥pïiHœ≤-ÎÕ+êe’ñΩï!†Ùó*—ëÒ)kàÎ&2˝Ö*7≤HèQ5¬rò;^d\,u0úDÍÇäsUÎsÂÙ*sà°„ı‰ËÃÕ(ÅSL≥:'ZMù>ÀœnFJ^î=5ê∫N§Ï÷q<Åzµ ™EåY(`¿Ó7⁄Ê≠©a^FïVr§NV÷0_L>ï,q«iÍıMQ Od4‚Z§ûTy+ß\¢§ü(a¸Bgf≈r9[‘‰ÜTzùqrŸ∂9ò˘ü˚Z]{Az-ûs≈êR∫ä¨§∂+ñ6ÅñGgNº'á"æîEÆ∞âãRÂ©≈¨d=Â‘´¬VπhT‡èv8çS˙ûbûØD|U!∑˙X°x¸∆FW@;Ôß.5≠ê€NÎPis§]j:ÆPA≠Ø>˙=y`Ëaπ1S-/Ü8é±¯ˆ»”«ìL\H™Ñ≈*ÍÑ´f
bº™}^ -.)Ø∏5	5∏KAﬁ"÷•eµ	Û™*Íven]Iô¬∞P!€6¸4"ß^a∂b°Löj∂ﬂt9Ca‚á´™‚9≈õ_ÊPB0“ERHem1FfÏôïÇ%!©5wuÄ ,›‘I mÊ•3c“ø¬ ·–d§˚¡Ö!ûQV∫P∆â£†”ß1fÚrêi∂•'HDUF8·ñ'ÍuÉ∆"èÄurìõW|¿^â}3>Ó)„ói˛≤åfKækı∆'¬Ñfﬂò≤`e6úè√qàzsVù}”]4<s\
Uü[éœcË…ﬁJñ›ÏZ¶7˛ÒD6…;~sèywºíÁÙÃÒÒûÇ5bÎïPÅ5-û‹I,+"y˘g…‘”®·"ù**[◊‹iÜ…ôöá†á
°Ò5À!	†ÚÖ!é9øﬂ˛ùtNéøÍãsçËhUd”)ûL>3·|“äìPÖFúøÂq˚õÔJ”ÊéÓº	 äÊö(fïñó‰œUûHâ^:íÊüÛ1éÛ^îı+2ÖßÒ.Ç~˝X!G.´Û£Üi‹oOTNï†`-în§Pá‡zBËVB⁄ÂïÜâ;áv 	&ÂJπ}¢ŸG"≈E]DQU{FµÔÙ":´x.4µ?UÊ"*ß"ñÜC<j¢»´– ¬l-æÅrœVk2üw‘r*ÔHÅÉ◊œ≠v£üsAÍ–YË§AÓãº˝\˛€Î¿a‹BÇvïzWL‘ÃπDîê\N•#◊‚5ë{>:3tä	ÚÅÇtˆç^ˇ‘ÉÕ-®£ÆôLáÑ’PX ”&s
◊•Ù/.ßﬂ#πÍéF´º∞é)¥Hò1!¿ﬁ'%&â8“0ﬁˆ‹5ÿ’◊‚%§≤P¯E¢ìvœ”Ã…ØàÍ£∆<\T>%ä†™03ÀB?†{¥§„-wﬂ4\√ÎTã@Ú'n◊©¸$_¿ëT'qpr,k-”ø–z∫m4übyÒ≈é·´vQ&v¿ès’…¡Vm†¸m3j,Å$±R‰⁄PfU™3%Q¢ú≈Aﬂh∏√⁄«É¢©ï§-'ä¢€‚W„êÉ*ÊEJr5ìdÑG vÓÍzqwµƒA])ëá¨Ö˘¢éÀbÒŒÍªf7#¯≥Ò~Q‘†èÈàTï*Ù∑€uÄ‰ôêç·ü)HËÔ,b∑¯˛‰¯?,“˛] óâKFáw∆Æ€ÑøßT°ëˆ≤FÃ#∏/ÌE˜ìG9v4i¥;¸í¥áπïÎòﬂOyUπ)"q≠∆∫†z5HÑ•Í7zΩ8E∆∆¨tºä<¥ı‡”ÿ¯*è“¸KÈ;Ïut‘ôr-G;/ª$vÁáÔ©ó„ø©?„YÉ_ÎÁ3÷˘∫B:√ø‰tÏùº¸«ò%?|ˇ∂ÇKÏqAÅ6¨À’Y±Òÿê
=âC
8Hë’åò¨Í!ã•˚bÍÂå[	WL UÚñ.ˆ™¬…ÎÃË`»ÔR—vÖ%IQÙZR√("ä›CÚæ±gzd—Èı6(∂è∑ƒ ÌáêQGÜZl£Hµm∫^Ä	C∆oõæ!ˆoKEìﬁèqêóÄ˚¿ú#®È„?E¥√‰î"ÌˇF:¥hËﬂt˛ﬂ‡≈Ω◊≥(¸‚6Òiv6"È˛µG⁄÷•Ã! €¸ÂW(Ø:‘#fPL~mÛ≈
ÅRÆüåìx¯4‰øáGÔøî< ù®}“¢8”ùû€ìÙ5BﬁuKc»iP˘wM<j¸kì?9WñbK—ö¸I∏¿1fê’Jd´g∏8ëÔ¥€]ìåo†di0¸N8Ò÷ƒ˘1*=ÔÂåÿT»(dlAÃˆb"VàúóÔxèœ§d›ƒ¨NSj÷ãKM<	¿j∏/øÛ©åÌB.Ë3˝)˜W¨≈OíÌ0ú¥&Y#Tz∫dQ–ÇçCep7<ùÑ~¿J¿oˇèïÄ1˙íSÜbD}^']√V'áÀ≈> 5B—ÁZ©Ç5õ4@˚4¶(7)&£πÖ1,È€Ã~â˘x%Kïyõ0¬≥6”ºVøBû¡¸Ø)â—,í`ìüÍC´9òé±äHµ‡’†ù[˛IΩ|.˘'	+!\‡} ôŒîäûÙ∑;ßOs»0∫`äÅÔHQ˘Íb?_“≈`!`G≤nƒî{™∂$µ¨ÂŒ8)® +`)zÉËdâ|£ëv.«í
æœÒcÖÎLÈ4˛7â7‡≤˚ŸÙaZ∏.
D´T≤Æºpó◊'Åø\
£ã≥<YÏOc§Ã5G+ç≥«è—‘‹ü¬ÿRâï}[z™ÿR∫(oVÄ)√¸Oöüz±•Ïï∆nÅ∏“òÚö∏[œÔ˘SMŒô<°Á‹bDSãv*œÈ9Î5ê[,⁄l´oöÕŒ¶Ÿt⁄6ù#rSz!„˚ñ‹ñ5á•Ï›ä∏»ÏÌ˚ÊÓSÀœt"ãmcAäôÀÂä—k∫Ò$∂πü}qy∏(∂X•ÆA+„åÌYS€kôä'≤ª(ôYΩM”t},ÕCÒótÔÓL»J∆‡Ì’≠>lö∂È≤Ì◊pœÁp–†O}áŒåv«D~≠˝“¥Vö˛9∂K_KQ€gû.πö$±Ò˙E|ux¥áÎ—€)?ÇˇJt[7]´Ô´∆D§\(ãV(,˜r◊:¿í1pèZ^äë_ê1¬‡º‘c	„3ygøHº®˙^qºD‘ƒK>¸äiÎ√‡RèSˆ'Eòf/_hPF∑:ãÜªzr¸o([q⁄ı®„|FLÿ` a°ÙX√•~ˆ5D¸¿¡ÿÅqs«8´àGZÃ∑ÿÜø√›Ü∏œrGã4FÜæ∆)\/)ZS)∑…à+Êw8MÃUFOœÂE\E&ßàÖ#⁄∆4—›ìóEò˚¯Ts=∞ö∫êoÙ˙≥Ã¸†Í Vu@ä§}ÑË¨¬r‘K˘8ñÁ•ú¶ì/Ñ=MO£ß»∂aoíª4>^Ò¿ Ä~±ÉÔc…"vö`ã·Ö¨Î 3E•å4;9y0äN…Ü	-Ñw`µNu;u9ûeb»º`∂<PÕÒÚ$©‘'~âKÑ0ë0˚.¨A•√‡äÚ˛^œ¥[‘›‰ë˝éi≥◊˜≈ÎÕ≤cx1≈'Z’(Çµ¨»Ky+∫˝¸≤Q*iCBvjF1ΩíûÕäR·H∫¶Î/Zn≥õrä1∞Õÿ8™ /Âé*Ô1ÌZU:Ñ5A‚ÃS‡§∞ΩÙå,ô/Cˆ"ú¯'«ﬂ†∏{au†™ÿ ìß›®†«ÇÔœ:1GF$≤sVq	 ÷(åÁvƒ‘ñ)<â*é˚HºÚB∏ÂYÄÖ<1ZÊäùójëõøë>óÓÁÁoàèú˘˘ÓôG€ƒ€}Å#*o®“3Í®Ωıq~H=Ì,ç≈¿ﬁ¸z¯‚…z¡aCAåˆd[∆od¯ÊÜÀcŒc-'@?7›!KZm◊j¸ô§™?º»}«ƒ°…sLXÁöjQ›‚¿•X¯*wF–òÀ=îá∞≈o
ÚÙ®ƒœ≥5§U‘Ù7X£È{tyŸ¨i{ãíçß˚—‡Ôè+îˇ⁄¨ÅIŒíî@>åèu/E˚ﬁ¢&[º}DÌ·(ÑÉº}ƒ5ºgo}§2œ‚Ms§RÛ,Ÿíq=äGÃRµ§“IŒq Ã ÿZ‘≠ùì µpGiœ6Ω∞Ïñ’v¶Æ◊À»Ú©ë]>∑¨•ì$kèDYës≤‘…Ñ+_xúôm˘©rÿtò7∞7†∫Æ”vVzÚ⁄òŸñ†a8ïjæU·âƒ¢˝h…!>09ï®·°`lÙˆ	k“–àÄÈÇ3XØVTÆVüÓÿ©]»4
‹WÑJ‘rí∏¢¶!´É&?ãt;:¶œªv*µH5D¯÷àFìöQ§E¥ëJYÄ|Zl`-ùO?ç~o∞Î˘JÖÜq-7}1ú§sØ◊ßƒ˚£õa¨ÍFPäG+ó6Ï≥Si˚¶ôìIÃå“@c&º3û]//ÂY#ﬂ9j˙ì¿H®G §^ÄD£w‘2JbœIõ'˚4z®CˇMyõ=”5∫¥,IŒäí\ıyê6y⁄2˙Ÿ7!9i'àÌ(pªÈè?7Ø=∏P˚EoltqF∂I±Çßb[%æä·ñ≥ö•røÌrkŸ¶EX:y ¨Â™ÈœNkÔÊ\ Ì^q_ÒîË‹EÚ˝l¢◊ríEy0] ÖD≠¯û◊û$VÎ@jl÷;Õ1ΩI‡˙<éá„‡C·´“òV ﬁPkÜìí∆ÀD3|&3ÈÅxP¿w3l	:õ.L£k¬ÑÛT!z›¡%©Ød[EFdËz\ÿ3|	Z$ø(ôæk\Xı)˘ÍÛ–◊>
î{ñX{≥óòFó-∞‹Ä(R9'EÄf‘¡–;?´TÀfuÊëÜ5ã∞‘Hî„£°ìò=&å3ŸÎyÚ1áe®›JE]wıOrAî≈æÈ-üº^h–RuCir@^Õ–AÕ–⁄ƒ£LÌO–ì`gS∆ë‚D‹„>E*Ö
ÑM±¿ÍıìI∞mL£ÁovwÅŸ…˜≤º+>õ˝™ §B´›Ã©7ƒ“YW=„ åãùksÔ<ä9§‚5mSƒ8érÈôsHƒO$°Ù12xﬂe{8‚+	áª⁄ÆŒaOÑÍ√ﬁéû€ï√dMN@äc$≥e!‰'”NªH√jëÑMFßC}yû`ÿæ®·ö‚P∆®Ò@ﬁ‰Pxaûñßâ5œÙóD“ÇåçZ!ÿ°õF5çePc’¬@ﬁxÇá© “ú£≠Âöûı	,7w™¥,xûó¥	ÔÊ—√Ô`¨`æâXÕ˜wóπ‰ıªñ?>ˆøÏ±	ŒJÛz Q¥B¨Q¡»*”ni{-tœQä@`âbûó“y‹™“0Ü„…Q¨Xzà LïÕÑ:ÀÒ≤2v\^]¥dÀﬂ≠˜NéˇògØÍZo≤R:ÃÙ[†! ¸ÌN©TJjètNÉx;¿ÃXØ’*⁄_:˝EIm|„¸	ZgS±ÄX#Ö¬jÍ4˛ï!öjﬂÉ®∏b ”«IG¶ﬂõ$ºÓ|∏2˙~∑y‚ÈÙ)"´biŒ∑Ñ%Ë‹-ÎmbT/ã7ı	ÙN˝Œ~KÁ(U„pRÉ… «˛?   ˇˇ‰]KoEæÛ+&EKdÔÀ6∂#£(`EX%
HD ivgØ≤/ÌxõƒNàc~ Ñê‡Ä‚éâ¯˘'Tu˜ÃvœTıcvLêòÉ≠›ùwwWUWı}N 1ÕL]±U˙‚Ôﬂóç•µ≥AéeñJáV[∆p0ﬁ∂0|PÎ∏E]ﬁ|±Ârzœ%+ça,0	ì!~N¢éáô	ˆ]òôx∞S^-«§ß—&G¶ú‹£Ç8ı7ÊL+ƒõ<[¿≤q¢¶4+›%ÈlÕπV~Ü^‡ ï‘Oﬂ˛ı˝TäIƒö•Yì∞Ú~ZZóÿ∆¨u#LïÓÃ,?Éˇ ¢J°*´êÆ‡`
ÏËÎÏæk*„fÖâ‘ÊÍ
|∞ŒA ¬™•ô»≤◊π¸GSaŒ« ‡g\¿sÅ∆D«±`¿…¿„ö9ŸXæçŒóo_˝|v”i¯›lƒM⁄†Wpmß‡m«I`T:<E(5¯0K}ö¯-∂Ü‚ä√rÌ8i,Ë∞mÌ©‹<∆;>«‡‚È0sS¿∏cO\\md‹⁄ÿ∏ı–q¢æ‚ﬁç>ÿ¸Ëª3Q‡π≥	˙Äl∏H”iÊ}2lEY≥Ÿ¡É,æ∆z˚Ë0˙h«"¡<ñ»@§%*û…∑Õ<1wfpkdHœù•ﬂ˛}∫‹öaœÅ’BRœ∆s<Í∂ˆ=¡LÕbF|Ïsæ’√æQ˜≤&˛MºÃÊ@p‚√Äp∏≠Ü√Ì›‚p´ä√≠`n¿î@ƒIHNú˛ùÂ|zw-¥n%ƒ\hü]_'ﬁo`Û‡≤8Aè†WDÑ¿UÕéUCW⁄ÕÖz´—^°c””ƒ>±¨Å1b˛˜ƒ
æÒ0‰Y–Œe∫3µL‘[ã∂øRVü1#‘çÆY√]“Åô¡I&Ù´íÌÎ@ZﬂCÜBﬂ¶ìÊ€≈{Wü$™”¨¯îLπv©#c"ûÍí Ü`Å),™B-(ÁH∆é,ÇäÅD1¯üBªH§ãy?$ò•Ñ5a˘¯Ü-=wÇaøk AJhÜÇìõ±$}b>
˚flq-r∏ΩŒ^øsw{ú.fìzÏp˚˝›Ó^ß«™î+r6’ø˘Ωà/≈›˘k Ên5b`ûBî¨G5P	∏tÏSo∫"R~Û©É≤ÂÚΩ˘µ›Ê πmï¶<Õ1˝C≈ÚyÍÅﬂœbL‚G„ÙÌ)ƒÍY^pî§——"~Fò∑√€≤≈Ó√AÈtòñoKô>y*“Ÿ˘ÄEJ;S©9Bvùxåî¡*Î3Ç(˛ˆv7%-|—>ÿ•s„pqxOﬁ-éÓ—á¶Á£3Í≤]èÀÍ¥bm„Éä˚J‹Ê≈ã
Á¶¶”æ°‘Ïw$k≥¸–Ôn\J≤∆ùÇÓâvªbAR+7<(E£ÍP◊—‘H¥Dê
õt–úá{?¿ƒLÃµ„Âbkíx0r ¯VË8jÇä>æª‰£rçÉ+|?X’e∞Ü«j≠üÇxkÛ/S™ÀuyÃá÷§†ÿ
E»¿∞˚–ÕFíÀìCóûË∞S±ê|,»gOX±Øc ô)KJâ.∞´S–èEr§”Áxq?%I*aπnU<~_dg…èﬁ˙Ëﬁ]d≤FÄã¯ÊdÅq]ñó0Öp3–ˆR`*£iö8¢UŸ≥⁄TÀÇØœ}¬ÿÂAzBu¢
'™C≤Ñ§$~ŒnµuºíRN˘¨~—◊oüù≈√”4¡[ï«pS%∫ÚÊÂÎﬂ¶ß—ì◊øLêXÊ;ENá'y
ñ”Ö˙∂”A˛¨ÙLµ™¿ÑFŸ, ∞Ìƒ{Çô§aC?Ü–å<óâ,EéG≤ﬁÑˆπ√a:á®Q™ùõÒ|˝E$Ù·éŒ™ı≥≥ã±‘…(õècµí%û∏Já”@L„%∏°Â8 [πµ“Ë”xû-DπÍqzs˙Œ‰ê:“ ÊÀ'~Î"’êı†k∞‹Äüœ˝≥XòÚú'r3ßO:ØáÊ/ó∑©èm]4$Jœ´KNtí&£•mÇhFkÆœŒ√∞Ÿ∞À˜(Ïdππ÷Ûq{oé:Rˆwê3ÓŒË<MZΩ/£œ?·¿‹µÊWIilXA+æóò$6G≤H¢ÄÌ$ãvΩZ∂cƒvê?€´˙S\• ]·óÀ¡Á)VWò∂ï'?JO‚ÂòeØÕWÏßâ	î£´1Ìü-ùe∂!MMR≤é•æQ$ç¡ ‰°ø®ÿBfˇ—‘î6K˝G5ÌÈcÆó˘Ì˝Ì˝Ar≤_˙We∂mWéíﬂÁ«(+ù¥º⁄©HÆIpY˜«À,óÅò+„I˙k\’h‰nRQX{(ÎúoµE‰«uu‡JOV«Ω)≥fˆj€'Î™ÇB‰fmQKäŒΩ}ı™aâP0`‚":Ä7ÌÍ ¢P?6$√*Ê-°ä‚†pV{¨hê∞.ˆV§ÿp˛m˙œÈcåØ‹2g?å∂˘«&“„¢x *≤2∏AÙy;{AËO/pÃ?fwßü¢ÿx0NìèÕEÁQ5Ë0D∑ù«Ça@ô)N2A£Ê¨
≈nì¬˘˝hZ†Ç‡ê∏A*‹ñ÷)ÉW∆;Y¥Ã0Á¯t6æSNÎø©ˇöî˛¡Ñ˛ç–˘◊!Û_á ﬂI‰œ∆vW•¯7h±uyP’Ó`øg)4ºˆÆ)	–∞ @…n˚™ 4ßPW¿Œˇﬂ$˚ˇ•wÉ÷°˛«79ÉY†8∂ÂÀÛœ =<D;ÄUpÍ ´—`üåˆ¥ˇì Uä˙)0qiU@$zv>•ZQ™”˝gbVK?‡*Æ≤é9&ÉuŸπ‰´0π	ª~=∫VM‘–…òz…Ös*¬2ΩØï¿O≈>&Øïª˙√¨Y—√∫¢ä∂l”1¡•aí5ﬁR”“´<òOÒ·å“€ò^*v!÷Éå≥Çù∫|Ô   ˇˇ ÜQâÛ