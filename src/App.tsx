import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Search, 
  Mic,
  Heart, 
  ThumbsUp,
  Sliders, 
  Sparkles, 
  Info, 
  Tv, 
  Grid, 
  HelpCircle, 
  Plus, 
  X, 
  Check, 
  RefreshCw, 
  Play, 
  Clock,
  Settings, 
  Package, 
  Flame, 
  Home, 
  Compass, 
  Radio, 
  Star,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  MapPin,
  Globe,
  Bell,
  Trash2,
  User,
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
  ShoppingBag,
  HardDrive,
  Send,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import { CATEGORIES, Category, Channel, processedChannels } from "./data/channels";
import ChannelPlayer from "./components/ChannelPlayer";
import VirtualRemoteControl from "./components/VirtualRemoteControl";
import MacMenuBar from "./components/MacMenuBar";
import FandomLogosTab from "./components/FandomLogosTab";
import IntelligenceThumbnailTab from "./components/IntelligenceThumbnailTab";

const TRANSLATIONS: Record<string, string> = {
  // Categories
  "home.categories.Special.name": "Special",
  "home.categories.VTV.name": "VTV Channels",
  "home.categories.VTVCab.name": "VTVCab Channels",
  "home.categories.HTV.name": "HTV & HTVC",
  "home.categories.SCTV.name": "SCTV Channels",
  "home.categories.Local.name": "Local Channels",
  "home.categories.International.name": "International Channels",
  "home.categories.Radio.name": "Radio Broadcasts",
  "home.categories.Experimental.name": "Experimental Channels",
  "home.categories.SuggestForYou.name": "Suggested for You",
  "home.categories.Favorited.name": "Favorites",

  // Search
  "home.search.placeholder": "Search channels...",

  // Special event / VTVGo Locked modal
  "title.special_event.banner_top.name": "Live Broadcast",
  "title.special_event.banner_bottom.name": "VTVgo Experimental Stream",
  "title.special_event.banner_desc.name": "Technical test stream. Only active during specified hours.",
  "title.special_event.title.name": "VTVgo Not Broadcasting Yet",
  "title.special_event.desc.name": "VTVgo channels are only live from 12:30 PM to 2:30 PM daily for special streams. Please try again later.",
  "modal.close_button.name": "Close",

  // Settings section titles & subtitles
  "settings.section.developeroptions.title": "Developer Options",
  "settings.sections.Profile.title": "User Profile",
  "settings.sections.Profile.subtitle": "Manage your favorite channels, custom URLs, and storage settings",
  "settings.sections.Profile.description": "Manage your favorite channels, custom URLs, and storage settings",
  "settings.sections.Appearance.title": "Appearance & Theme",
  "settings.sections.Appearance.subtitle": "Customize themes, Liquid Glass, and visual motion settings",
  "settings.sections.Appearance.description": "Customize themes, Liquid Glass, and visual motion settings",
  "settings.sections.Accessibility.title": "Accessibility & Motion",
  "settings.sections.Accessibility.subtitle": "Control slideshow auto-advance and transition animation speeds",
  "settings.sections.Accessibility.description": "Control slideshow auto-advance and transition animation speeds",
  "settings.sections.Broadcast.title": "Technical Streaming",
  "settings.sections.Broadcast.subtitle": "Configure latency modes, cache sizes, and video stream performance",
  "settings.sections.Experimental.title": "Experimental Features",
  "settings.sections.Experimental.subtitle": "Enable advanced, developer-only experimental system capabilities",
  "settings.sections.Experimental.description": "Enable advanced, developer-only experimental system capabilities",
  "settings.sections.PluginStore.title": "Plugin Marketplace",
  "settings.sections.PluginStore.subtitle": "Discover and install optional modules to extend your experience",

  // Profile keys
  "settings.profile.TotalFavorites.title": "My Saved Favorites",
  "settings.profile.DeleteAllFavorites.button": "Clear All Favorites",
  "settings.profile.CustomChannels.title": "Sourced Custom Channels",
  "settings.profile.DeleteCustomChannels.button": "Remove All Custom Channels",
  "settings.profile.OnlineAccountNotice.title": "Cloud-Native Storage",
  "settings.profile.OnlineAccountNotice.description": "Your current layout and configurations are persisted locally. Register for a cloud account to synchronize across multiple devices.",

  // Appearance keys
  "settings.appearance.BackdropGlow.label": "Ambient Backdrop Glow Strength",
  "settings.appearance.AmoledDark.title": "AMOLED Pitch Black Theme",
  "settings.appearance.AmoledDark.subtitle": "Switches the canvas to absolute dark background, saving energy on OLED displays",

  // Accessibility keys
  "settings.accessibility.AutoSlide.title": "Auto-Cycle Spotlight Banners",
  "settings.accessibility.AutoSlide.subtitle": "Enables automatic cycling of the curated featured slideshow on the home screen",

  // Experimental keys
  "settings.experimental.LowLatency.title": "Ultra Low Latency Mode",
  "settings.experimental.LowLatency.subtitle": "Optimizes network ingestion to prioritize real-time broadcast and reduce delay",
  "settings.experimental.StreamCache.title": "Enhanced Streaming Cache",
  "settings.experimental.StreamCache.subtitle": "Allocates extra buffer memory for smoother playback on intermittent connections",
  "settings.experimental.AmbientGlow.title": "Dynamic Ambient Glow Effects",
  "settings.experimental.AmbientGlow.subtitle": "Extracts real-time colors from the video element to paint the page background",
  "settings.experimental.StreamPlayground.title": "Direct Link Launcher (M3U8)",
  "settings.experimental.StreamPlayground.subtitle": "Launch any stream instantly by pasting its direct source address",
  "settings.experimental.StreamPlayground.placeholder": "E.g., https://example.com/stream.m3u8",

  // Menu keys
  "menu.ExportChannels.label": "Export Custom Channel List (M3U)",

  // Channel Creation Popup Keys
  "modal.ChannelCreate.title": "Add New Channel",
  "modal.ChannelCreate.desc": "Incorporate custom streaming nodes by assigning a name and entering a valid stream feed address",
  "modal.ChannelCreate.nameLabel": "Enter Channel Name",
  "modal.ChannelCreate.urlLabel": "Stream Feed Address",
  "modal.ChannelCreate.groupLabel": "Destination Category",
  "modal.ChannelCreate.cancel": "Cancel",
  "modal.ChannelCreate.create": "Add Channel",

  // V-Intelligence Banner translation keys
  "title.intelligence_banner_top.name": "V-Intelligence System Terminal",
  "title:intelligence_banner_bottom.name": "Neural High-Definition Stream Matrix",
  "title.intelligence_banner_bottom.name": "Neural High-Definition Stream Matrix",
  "title.intelligence_banner_desc.name": "Real-time intelligent thumbnail processor and low-latency channel feed monitoring board."
};

const t = (key: string): string => {
  if (!key) return "";
  if (TRANSLATIONS[key]) {
    return TRANSLATIONS[key];
  }
  if (key.startsWith("live_feed.") && key.endsWith(".name")) {
    const core = key.substring(10, key.length - 5);
    if (core.startsWith("VTV") && core !== "VTV6Test" && !core.startsWith("VTVgo")) {
      return core;
    }
    if (core === "VTV6Test") {
      return "VTV6 Test Stream";
    }
    if (core.startsWith("VTVgo")) {
      return "VTVgo " + core.substring(5);
    }
    if (core === "VietnamWildLive") {
      return "Vietnam Wild Live";
    }
    return core.replace(/([A-Z])/g, ' $1').trim();
  }
  return key;
};

const getLogoImgClass = (ch: any, layoutType?: "carousel" | "grid") => {
  const isVtv1to9 = ["vtv1", "vtv2", "vtv3", "vtv4", "vtv5", "vtv6", "vtv7", "vtv8", "vtv9", "vtv10", "vtv6_test", "vn_today"].includes(ch.id);
  const baseStretch = "scale-x-[1.35] transform";
  
  if (isVtv1to9) {
    return `w-[45%] h-[45%] ${baseStretch} object-contain filter drop-shadow-md select-none pointer-events-none`;
  }
  
  if (layoutType === "carousel") {
    if (ch.id.startsWith("vinh_long")) {
      return `w-[58%] h-[58%] p-1 ${baseStretch} object-contain filter drop-shadow-md select-none pointer-events-none`;
    }
    if (ch.group === "SCTV") {
      return `w-4/5 h-4/5 p-1.5 ${baseStretch} object-contain filter drop-shadow-md select-none pointer-events-none`;
    }
    if (ch.group === "VTVcab") {
      return `w-[82%] h-[82%] p-0.5 ${baseStretch} object-contain filter drop-shadow-md select-none pointer-events-none`;
    }
    return `w-full h-full ${baseStretch} object-contain filter drop-shadow-md select-none pointer-events-none`;
  } else {
    if (ch.id === "vietnam-wild-live") {
      return `w-[84%] h-[84%] p-0.5 ${baseStretch} object-contain filter drop-shadow-md select-none pointer-events-none`;
    }
    if (ch.id.startsWith("vinh_long")) {
      return `w-[55%] h-[55%] p-1 ${baseStretch} object-contain filter drop-shadow-md select-none pointer-events-none`;
    }
    if (ch.group === "SCTV") {
      return `w-[60%] h-[60%] p-1 ${baseStretch} object-contain filter drop-shadow-md select-none pointer-events-none`;
    }
    if (ch.group === "VTVcab") {
      return `w-[82%] h-[82%] p-0.5 ${baseStretch} object-contain filter drop-shadow-md select-none pointer-events-none`;
    }
    return `w-full h-full ${baseStretch} object-contain filter drop-shadow-md select-none pointer-events-none`;
  }
};

const getLogoTextClass = (ch: any) => {
  const isVtv1to9 = ["vtv1", "vtv2", "vtv3", "vtv4", "vtv5", "vtv6", "vtv7", "vtv8", "vtv9", "vtv10", "vtv6_test", "vn_today"].includes(ch.id);
  const baseStretch = "scale-x-[1.35] transform";
  const bg = ch.logoBg || "bg-indigo-600";
  
  if (isVtv1to9) {
    return `w-[55%] h-[55%] ${baseStretch} flex items-center justify-center rounded-lg ${bg} shadow-inner border border-white/10 font-bold text-white text-[7px] sm:text-[9px] tracking-wider text-center px-0.5`;
  }
  
  return `w-full h-full ${baseStretch} flex items-center justify-center rounded-lg ${bg} shadow-inner border border-white/10 font-bold text-white text-[9px] sm:text-xs tracking-wider text-center px-1`;
};

const ICON_REGISTRY: Record<string, React.ComponentType<any>> = {
  Sparkles,
  Info,
  Tv,
  Grid,
  HelpCircle,
  Plus,
  Check,
  Play,
  Clock,
  Settings,
  Flame,
  Home,
  Compass,
  Radio,
  Star,
  Bookmark,
  Cpu,
  Layers,
  Bell,
  User,
  Palette,
  Beaker,
  AlertCircle,
  Crown,
  Pizza,
};

const homeSlides = [
  {
    id: 0,
    titleTop: "title.special_event.banner_top.name",
    titleMain: "title.special_event.banner_bottom.name",
    titleSub: "",
    genreText: "SPECIAL LIVE EVENT",
    subSlogan: "NATIONAL BIODIVERSITY CONSERVATION",
    thumbnail: "https://cdn-images.vtv.vn/66349b6076cb4dee98746cf1/2026/06/20/cover-91667111629561629180275.png",
    channelId: "vietnam-wild-live",
    channelPlayName: "Vietnam Wild LIVE",
    ageRating: "G",
    ratingText: "HD Quality | Live on VTVgo",
    vignetteLeft: "from-black/90 via-black/55 to-transparent",
    vignetteBottom: "from-[#07050f] via-[#07050f]/85 to-transparent",
    vignetteTop: "from-black/45 via-transparent to-transparent",
    description: "title.special_event.banner_desc.name",
    showCountdown: false,
    logo: "https://static.wikia.nocookie.net/ep-deo/images/6/64/Vtv_s%E1%BB%A7a.png/revision/latest?cb=20260625120702",
    btnText: "Watch Now",
    btnIcon: "play"
  },
  {
    id: 1,
    titleTop: "VTV6",
    titleMain: "For a Healthy Vietnam!",
    titleSub: "",
    genreText: "NATIONAL SPORTS & HEALTH",
    subSlogan: "EMPOWERING ASPIRATION, SPREADING VIETNAMESE YOUTH ENERGY",
    thumbnail: "https://i.ytimg.com/vi/cXv_D6qIy0s/maxresdefault.jpg",
    channelId: "vtv3",
    channelPlayName: "VTV6 - For a Healthy Vietnam! (FHD)",
    ageRating: "G",
    ratingText: "Live Sports | Copyrighted",
    vignetteLeft: "from-black/90 via-black/55 to-transparent",
    vignetteBottom: "from-[#07050f] via-[#07050f]/85 to-transparent",
    vignetteTop: "from-black/45 via-transparent to-transparent",
    logo: "https://static.wikia.nocookie.net/logos/images/5/56/VTV6_logo_07.06.2026.png/revision/latest?cb=20260608073805&path-prefix=uk",
    description: "News, features, and reports on domestic and international sports produced by the Sports Television Center, aiming to promote mass sports, school sports, and professional sports development in Vietnam, as well as community health and comprehensive development.",
    btnText: "Watch Now",
    btnIcon: "play"
  },
  {
    id: 3,
    titleTop: "Welcome to",
    titleMain: "Vplay Test Web!",
    titleSub: "",
    genreText: "FOREIGN AFFAIRS & INTERNATIONAL",
    subSlogan: "WINDOW TO THE WORLD",
    thumbnail: "https://vtv4.vtv.vn/upload/news/3HOPA0OIS_vntoday1-79180073137201066112112-72441177075135673357555.jpg",
    channelId: "vn_today",
    channelPlayName: "Vietnam Today HD",
    ageRating: "G",
    ratingText: "HD Quality | National Foreign Affairs",
    vignetteLeft: "from-black/90 via-black/55 to-transparent",
    vignetteBottom: "from-[#07050f] via-[#07050f]/85 to-transparent",
    vignetteTop: "from-black/45 via-transparent to-transparent",
    logo: "https://static.wikia.nocookie.net/logos/images/f/f2/Logo_Vietnam_Today_07-2025_v2.png/revision/latest?cb=20260228060318&path-prefix=uk",
    description: "As of June 28, 2026, the Vplay television streaming website has moved to a new domain **https://vplay-refresh.vercel.app**. This website domain will become **test-vplay.vercel.app**, serving as an experimental staging environment to test new features (app functions, features, streams, logos, etc.) before they roll out to the main site. Staging environments will inevitably contain bugs, and the Vplay team will only accept bug reports from the official site. Staging bugs may remain unresolved. Sincerely.",
    btnText: "Watch Now",
    btnIcon: "play"
  }
];

const renderDescription = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-extrabold text-white">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export default function App() {
  // Local time state clock
  const [time, setTime] = useState(new Date());
  
  // Immersive Home Slideshow State
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const [autoSlide, setAutoSlide] = useState<boolean>(() => {
    const saved = localStorage.getItem("glass_tv_auto_slide");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("glass_tv_auto_slide", autoSlide ? "true" : "false");
  }, [autoSlide]);
  
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
        behavior: "smooth"
      });
    }
  };

  const scrollRecommendations = (direction: "left" | "right") => {
    if (recoScrollRef.current) {
      const scrollAmount = 300;
      recoScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Navigation State
  const [activeTab, setActiveTab] = useState<"home" | "live" | "settings" | "search" | "fandom_logos" | "intelligence_thumbnail">("home");
  const [prevTab, setPrevTab] = useState<"home" | "live" | "settings">("home");

  useEffect(() => {
    if (activeTab !== "search") {
      setPrevTab(activeTab as any);
    }
  }, [activeTab]);

  // Scroll Position Tracking for Floating Header
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY || document.documentElement.scrollTop;
      if (top > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
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
      setCurrentSlide(prev => (prev + 1) % homeSlides.length);
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
    const dayOfWeek = date.getDay(); // 0: Sunday, 1: Monday, ...
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayStr = days[dayOfWeek];
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yy = String(date.getFullYear());
    return `${dayStr}, ${mm}/${dd}/${yy}`;
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
    return saved ? JSON.parse(saved) : ["vtv1", "vtv3", "vl1", "cartoon-network"];
  });

  // Player configurations
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem("glass_tv_volume");
    return saved ? parseFloat(saved) : 0.8;
  });
  
  const [muted, setMuted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showVtv5Popup, setShowVtv5Popup] = useState<boolean>(false);
  const vtv5Options = useMemo(() => {
    const v5 = processedChannels.find(ch => ch.id === "vtv5");
    const v5Tnb = processedChannels.find(ch => ch.id === "vtv5_tnb");
    const v5Tn = processedChannels.find(ch => ch.id === "vtv5_tn");
    
    return [
      { ...(v5 || { id: "vtv5", name: "VTV5", url: "", group: "VTV", logoText: "VTV5", logoBg: "bg-gradient-to-br from-emerald-600 to-emerald-800" }), name: "VTV5 National" },
      { ...(v5Tnb || { id: "vtv5_tnb", name: "VTV5 Tây Nam Bộ", url: "", group: "VTV", logoText: "VTV5 TNB", logoBg: "bg-gradient-to-br from-emerald-600 to-emerald-800" }), name: "VTV5 South West" },
      { ...(v5Tn || { id: "vtv5_tn", name: "VTV5 Tây Nguyên", url: "", group: "VTV", logoText: "VTV5 TN", logoBg: "bg-gradient-to-br from-emerald-600 to-emerald-800" }), name: "VTV5 Central Highlands" }
    ];
  }, []);
  const [isHeaderSearchExpanded, setIsHeaderSearchExpanded] = useState<boolean>(false);
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
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [roleSelection, setRoleSelection] = useState<"user" | "admin" | null>(null);
  const [showAdminPassModal, setShowAdminPassModal] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>("");
  const [adminError, setAdminError] = useState<string>("");
  const [showDropdownMenu, setShowDropdownMenu] = useState<boolean>(false);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [showClock, setShowClock] = useState<boolean>(() => {
    const saved = localStorage.getItem("vplay360_show_clock");
    return saved !== null ? saved === "true" : true;
  });

  const toggleShowClock = () => {
    setShowClock(prev => {
      const next = !prev;
      localStorage.setItem("vplay360_show_clock", String(next));
      return next;
    });
  };

  const exportChannelsToM3u8 = () => {
    let m3u8Content = "#EXTM3U\n";
    allAvailableCategoryList.forEach(category => {
      category.channels.forEach(channel => {
        const tvgId = channel.id;
        const tvgName = channel.name;
        const groupTitle = category.name;
        const logo = channel.logoImg || "";
        m3u8Content += `#EXTINF:-1 tvg-id="${tvgId}" tvg-name="${tvgName}" tvg-logo="${logo}" group-title="${groupTitle}",${channel.name}\n`;
        m3u8Content += `${channel.url}\n`;
      });
    });

    const blob = new Blob([m3u8Content], { type: "application/x-mpegurl;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Vplay_channel.m3u8";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  
  // Custom M3U8 Url link adder
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [showVtvGoLockedModal, setShowVtvGoLockedModal] = useState<boolean>(false);
  const [showCopiedNotify, setShowCopiedNotify] = useState<boolean>(false);
  const [activeSettingSection, setActiveSettingSection] = useState<string | null>(null);
  const [playbackError, setPlaybackError] = useState<boolean>(false);
  const [playbackErrorType, setPlaybackErrorType] = useState<"standard" | "timeout" | null>(null);
  const notifyTimeoutRef = useRef<any>(null);

  // Multiview states
  const [isMultiviewMode, setIsMultiviewMode] = useState<boolean>(false);
  const [multiviewCount, setMultiviewCount] = useState<number>(4);
  const [multiviewChannels, setMultiviewChannels] = useState<(Channel | null)[]>([]);
  const [showMultiviewSelectorPopup, setShowMultiviewSelectorPopup] = useState<boolean>(false);
  const [showMultiviewChannelPickerPopup, setShowMultiviewChannelPickerPopup] = useState<boolean>(false);
  const [activeMultiviewSlotIndex, setActiveMultiviewSlotIndex] = useState<number | null>(null);
  const [pickerSearchQuery, setPickerSearchQuery] = useState<string>("");

  // Picture in Picture states
  const [isPiPActive, setIsPiPActive] = useState<boolean>(false);

  // Test Menu states
  const [showLogoAdjustModal, setShowLogoAdjustModal] = useState<boolean>(false);
  const [showYouTubeToolModal, setShowYouTubeToolModal] = useState<boolean>(false);
  const [showWheelOfVplayModal, setShowWheelOfVplayModal] = useState<boolean>(false);
  const [wheelInputText, setWheelInputText] = useState<string>("VTV1 HD\nVTV2 HD\nVTV3 HD\nVTV4 HD\nVTV5 HD\nVTV6 HD");
  const [wheelWeights, setWheelWeights] = useState<Record<string, number>>({});
  const [wheelSpinDuration, setWheelSpinDuration] = useState<number>(5); // default 5 seconds
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [wheelIsSpinning, setWheelIsSpinning] = useState<boolean>(false);
  const [wheelWinner, setWheelWinner] = useState<string | null>(null);
  const [showFocusChannelsModal, setShowFocusChannelsModal] = useState<boolean>(false);
  const [focusChannelsSearch, setFocusChannelsSearch] = useState<string>("");
  const [focusChannelsCategory, setFocusChannelsCategory] = useState<string>("all");
  const [logoSaturation, setLogoSaturation] = useState<number>(100);
  const [logoBrightness, setLogoBrightness] = useState<number>(100);
  const [logoOpacity, setLogoOpacity] = useState<number>(100);
  const [youtubeUrlInput, setYoutubeUrlInput] = useState<string>("");

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
    setMultiviewChannels(prev => {
      const copy = [...prev];
      copy[index] = null;
      return copy;
    });
  };

  const handleSelectChannelForSlot = (channel: Channel) => {
    if (activeMultiviewSlotIndex !== null) {
      setMultiviewChannels(prev => {
        const copy = [...prev];
        copy[activeMultiviewSlotIndex] = channel;
        return copy;
      });
    }
  };

  const handleTogglePictureInPicture = () => {
    setIsPiPActive(prev => !prev);
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
  const [customGroupInput, setCustomGroupInput] = useState<string>("New Channel Group");
  const [customChannels, setCustomChannels] = useState<Channel[]>(() => {
    const saved = localStorage.getItem("glass_tv_custom_list");
    return saved ? JSON.parse(saved) : [];
  });

  // Ambient lights themes configuration (default: sunset)
  const [bgColor, setBgColor] = useState<"cosmic" | "deep" | "aurora" | "sunset">("sunset");
  const [amoledDark, setAmoledDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("glass_tv_amoled_dark");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("glass_tv_amoled_dark", amoledDark ? "true" : "false");
  }, [amoledDark]);

  const [dynamicMotion, setDynamicMotion] = useState<boolean>(() => {
    const saved = localStorage.getItem("vplay_dynamic_motion");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("vplay_dynamic_motion", dynamicMotion ? "true" : "false");
  }, [dynamicMotion]);

  // Experimental states
  const [expLowLatency, setExpLowLatency] = useState<boolean>(() => localStorage.getItem("vplay_exp_lowlatency") === "true");
  const [expCache, setExpCache] = useState<boolean>(() => localStorage.getItem("vplay_exp_cache") === "true");
  const [expAmbientGlow, setExpAmbientGlow] = useState<boolean>(() => localStorage.getItem("vplay_exp_glow") === "true");
  const [testStreamUrl, setTestStreamUrl] = useState<string>("");

  // Reimagined Search state
  const [reimaginedSearchOpen, setReimaginedSearchOpen] = useState<boolean>(false);

  // Experimental Features list (installable like plugins)
  const [expFeatures, setExpFeatures] = useState<{
    id: string;
    name: string;
    desc: string;
    status: "idle" | "installing" | "installed";
    progress: number;
    isActive: boolean;
  }[]>(() => {
    const defaultFeatures = [
      {
        id: "reimagined_search",
        name: "Reimagined Search",
        desc: "Cách mạng hóa trải nghiệm tìm kiếm: Hiển thị kết quả tìm kiếm tức thì ngay trong một menu popup nổi tuyệt đẹp phía trên thanh Dock thay vì chuyển hướng sang tab khác.",
        status: "idle" as const,
        progress: 0,
        isActive: false
      },
      {
        id: "v_intelligence",
        name: "Trợ lý V-Intelligence (Thử nghiệm)",
        desc: "Mô hình trí tuệ nhân tạo (Gemini API) giúp trải nghiệm xem truyền hình trở nên sinh động và hấp dẫn, đóng vai trò trợ lý đắc lực. Khi kích hoạt, nút Tìm Kiếm trên Dock sẽ chuyển thành biểu tượng V-Intelligence.",
        status: "idle" as const,
        progress: 0,
        isActive: false
      },
      {
        id: "dropdown_intelligence",
        name: "Thử nghiệm \"Dropdown Intelligence\"",
        desc: "Khi bật, V-Intelligence sẽ hiển thị nhỏ gọn dưới dạng dropdown menu trên menubar thay vì mở rộng dạng sidebar/drawer. Chỉ khi bạn nhấn biểu tượng expand mới hiển thị dạng sidebar/drawer.",
        status: "idle" as const,
        progress: 0,
        isActive: false
      },
      {
        id: "auto_hide_menubar",
        name: "Thử nghiệm \"Auto-hide Menu bar\"",
        desc: "Khi bật, thanh menu bar sẽ tự động ẩn sau 5 giây không hoạt động và chỉ xuất hiện lại khi bạn di chuột lên mép trên cùng của màn hình.",
        status: "idle" as const,
        progress: 0,
        isActive: false
      }
    ];

    const saved = localStorage.getItem("vplay_exp_features");
    let loaded: any[] = [];
    if (saved) {
      try {
        loaded = JSON.parse(saved);
        loaded = loaded.map((p: any) => p.status === "installing" ? { ...p, status: "idle", progress: 0 } : p);
      } catch (e) {
        loaded = [];
      }
    }

    const merged = [...defaultFeatures];
    loaded.forEach((loadedFeat: any) => {
      const idx = merged.findIndex(d => d.id === loadedFeat.id);
      if (idx !== -1) {
        merged[idx] = { ...merged[idx], ...loadedFeat };
      } else {
        merged.push(loadedFeat);
      }
    });

    return merged;
  });

  useEffect(() => {
    const toSave = expFeatures.map(p => ({
      id: p.id,
      name: p.name,
      desc: p.desc,
      status: p.status === "installing" ? "idle" : p.status,
      progress: p.status === "installing" ? 0 : p.progress,
      isActive: p.isActive
    }));
    localStorage.setItem("vplay_exp_features", JSON.stringify(toSave));
  }, [expFeatures]);

  const installExpFeature = (id: string) => {
    setExpFeatures(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: "installing", progress: 0 };
      }
      return p;
    }));

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setExpFeatures(prev => prev.map(p => {
          if (p.id === id) {
            return { ...p, status: "installed", progress: 100, isActive: true };
          }
          return p;
        }));
      } else {
        setExpFeatures(prev => prev.map(p => {
          if (p.id === id) {
            return { ...p, progress: Math.min(Math.round(currentProgress), 100) };
          }
          return p;
        }));
      }
    }, 300);
  };

  const isReimaginedSearchActive = useMemo(() => {
    const feat = expFeatures.find(f => f.id === "reimagined_search");
    return feat ? feat.status === "installed" && feat.isActive : false;
  }, [expFeatures]);

  const isVIntelligenceActive = useMemo(() => {
    const feat = expFeatures.find(f => f.id === "v_intelligence");
    return feat ? feat.status === "installed" && feat.isActive : false;
  }, [expFeatures]);

  const isDropdownIntelligenceActive = useMemo(() => {
    const feat = expFeatures.find(f => f.id === "dropdown_intelligence");
    return feat ? feat.status === "installed" && feat.isActive : false;
  }, [expFeatures]);

  const isAutoHideMenuBarActive = useMemo(() => {
    const feat = expFeatures.find(f => f.id === "auto_hide_menubar");
    return feat ? feat.status === "installed" && feat.isActive : false;
  }, [expFeatures]);

  const [isFocusMode, setIsFocusMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem("vplay_focus_mode") === "true";
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("vplay_focus_mode", String(isFocusMode));
    } catch (e) {}
  }, [isFocusMode]);

  const [vIntelQuery, setVIntelQuery] = useState<string>("");
  const [isVIntelLoading, setIsVIntelLoading] = useState<boolean>(false);
  const [vIntelHistory, setVIntelHistory] = useState<{ role: "user" | "model"; text: string }[]>([]);
  const [vIntelMode, setVIntelMode] = useState<"chat" | "search">("chat");
  const [vIntelSpinCount, setVIntelSpinCount] = useState<number>(0);
  const vIntelScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (vIntelScrollRef.current) {
      vIntelScrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [vIntelHistory, isVIntelLoading]);

  const handleSendVIntelMsg = async (queryText?: string) => {
    const prompt = queryText || vIntelQuery;
    if (!prompt.trim()) return;

    const userMsg = { role: "user" as const, text: prompt };
    const updatedHistory = [...vIntelHistory, userMsg];
    setVIntelHistory(updatedHistory);
    setVIntelQuery("");
    setIsVIntelLoading(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          history: vIntelHistory,
          channels: flattenedChannels.map(ch => ({ id: ch.id, name: ch.name, group: ch.group })),
          mode: vIntelMode
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể kết nối đến máy chủ.");
      }

      const data = await response.json();
      const aiResponse = data.text || "Xin lỗi, em không thể nhận được câu trả lời từ máy chủ.";

      const commandRegex = /\[COMMAND:\s*SWITCH_CHANNEL:\s*([a-zA-Z0-9_-]+)\]/i;
      const match = aiResponse.match(commandRegex);
      const cleanedResponse = aiResponse.replace(commandRegex, "").trim();

      setVIntelHistory(prev => [...prev, { role: "model" as const, text: cleanedResponse }]);

      if (match && match[1]) {
        const targetChannelId = match[1].toLowerCase().trim();
        const foundCh = flattenedChannels.find(ch => ch.id.toLowerCase() === targetChannelId || ch.name.toLowerCase().includes(targetChannelId));
        if (foundCh) {
          handleSelectChannel(foundCh);
          setActiveTab("live");
          setToastMessage(`V-Intelligence đã chuyển kênh sang: ${foundCh.name}`);
          setTimeout(() => setToastMessage(""), 4000);
        }
      }
    } catch (err: any) {
      console.error("V-Intelligence message error:", err);
      setVIntelHistory(prev => [...prev, { role: "model" as const, text: `⚠️ Lỗi: ${err.message || "Đã xảy ra lỗi kết nối."}` }]);
    } finally {
      setIsVIntelLoading(false);
    }
  };

  // Close reimagined search popup when activeTab shifts to another non-search screen
  useEffect(() => {
    if (activeTab !== "search") {
      setReimaginedSearchOpen(false);
    }
  }, [activeTab]);

  // Plugin Store States
  const [plugins, setPlugins] = useState<{
    id: string;
    name: string;
    desc: string;
    status: "idle" | "installing" | "installed";
    progress: number;
    isActive: boolean;
  }[]>(() => {
    const defaultPlugins = [
      {
        id: "liquid_glass",
        name: "Liquid Glass UI Theme",
        desc: "Kích hoạt giao diện kính mờ Liquid Glass bóng bẩy phong cách Apple, mang lại hiệu ứng mờ sương, viền phản sáng lấp lánh và bo góc thanh thoát kiểu macOS.",
        status: "idle" as const,
        progress: 0,
        isActive: false
      },
      {
        id: "remove_shiny_border",
        name: "Minimalist Borderless Flat Mode",
        desc: "Completely strips all shiny reflections, glass highlights, and reflective outer borders surrounding cards and buttons to provide a pristine, ultra-minimalist flat interface.",
        status: "idle" as const,
        progress: 0,
        isActive: false
      },
      {
        id: "storage_feeder",
        name: "Storage feeder",
        desc: "Kích hoạt mô-đun giả lập nạp dữ liệu rác, kéo ngay lập tức dung lượng lưu trữ của ứng dụng Test Vplay lên mức tối đa 3.0GB để thử nghiệm phản ứng hệ thống.",
        status: "idle" as const,
        progress: 0,
        isActive: false
      },
      {
        id: "remote_control",
        name: "Use remote control",
        desc: "Kích hoạt giả lập điều khiển từ xa vật lý. Khi bật, toàn bộ cử chỉ chạm (touch) và nhấp chuột sẽ bị vô hiệu hóa, thay thế bằng bàn phím điều khiển nổi và bàn phím mũi tên vật lý để duyệt các mục.",
        status: "idle" as const,
        progress: 0,
        isActive: false
      }
    ];

    const saved = localStorage.getItem("vplay_plugins");
    let loaded: any[] = [];
    if (saved) {
      try {
        loaded = JSON.parse(saved);
        loaded = loaded.map((p: any) => p.status === "installing" ? { ...p, status: "idle", progress: 0 } : p);
      } catch (e) {
        loaded = [];
      }
    }

    // Merge loaded settings with default plugins to ensure new plugins are listed
    const merged = [...defaultPlugins];
    loaded.forEach((loadedPlugin: any) => {
      const idx = merged.findIndex(d => d.id === loadedPlugin.id);
      if (idx !== -1) {
        merged[idx] = { ...merged[idx], ...loadedPlugin };
      } else {
        merged.push(loadedPlugin);
      }
    });

    return merged;
  });

  useEffect(() => {
    const toSave = plugins.map(p => ({
      id: p.id,
      name: p.name,
      desc: p.desc,
      status: p.status === "installing" ? "idle" : p.status,
      progress: p.status === "installing" ? 0 : p.progress,
      isActive: p.isActive
    }));
    localStorage.setItem("vplay_plugins", JSON.stringify(toSave));
  }, [plugins]);

  const installPlugin = (id: string) => {
    setPlugins(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: "installing", progress: 0 };
      }
      return p;
    }));

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 100 / 30; // 30 seconds total
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setPlugins(prev => prev.map(p => {
          if (p.id === id) {
            return { ...p, status: "installed", progress: 100, isActive: true };
          }
          return p;
        }));
      } else {
        setPlugins(prev => prev.map(p => {
          if (p.id === id) {
            return { ...p, progress: Math.min(Math.round(currentProgress), 100) };
          }
          return p;
        }));
      }
    }, 1000);
  };

  // Derived theme state
  const liquidGlass = useMemo(() => {
    const lg = plugins.find(p => p.id === "liquid_glass");
    return lg ? (lg.status === "installed" && lg.isActive) : false;
  }, [plugins]);

  const isMaterialDesignActive = useMemo(() => {
    return !liquidGlass;
  }, [liquidGlass]);

  useEffect(() => {
    if (isMaterialDesignActive) {
      document.body.classList.add("material-design-active");
    } else {
      document.body.classList.remove("material-design-active");
    }
  }, [isMaterialDesignActive]);

  const isRemoveShinyBorderActive = useMemo(() => {
    const rsb = plugins.find(p => p.id === "remove_shiny_border");
    return rsb ? (rsb.status === "installed" && rsb.isActive) : false;
  }, [plugins]);

  const isRemoteControlActive = useMemo(() => {
    const rc = plugins.find(p => p.id === "remote_control");
    return rc ? (rc.status === "installed" && rc.isActive) : false;
  }, [plugins]);

  // Vplay Data Storage Capacity Logic
  const currentStorageUsed = useMemo(() => {
    // If Storage feeder is installed, immediately return 3.00 GB
    const sf = plugins.find(p => p.id === "storage_feeder");
    if (sf && sf.status === "installed") {
      return 3.00;
    }

    let used = 0.15; // base system usage
    if (dynamicMotion) used += 0.55;
    if (isMultiviewMode) used += 0.95;
    plugins.forEach(p => {
      if (p.status === "installed") {
        if (p.id === "liquid_glass") {
          used += 1.20;
        } else if (p.id === "remove_shiny_border") {
          used += 0.35;
        } else {
          used += 0.45;
        }
      }
    });
    return Math.min(used, 3.00);
  }, [dynamicMotion, isMultiviewMode, plugins]);

  // Custom Tab and Modal builder states
  const [customTabs, setCustomTabs] = useState<any[]>(() => {
    const saved = localStorage.getItem("vplay_custom_tabs");
    return saved ? JSON.parse(saved) : [];
  });
  const [customModals, setCustomModals] = useState<any[]>(() => {
    const saved = localStorage.getItem("vplay_custom_modals");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("vplay_custom_tabs", JSON.stringify(customTabs));
  }, [customTabs]);

  useEffect(() => {
    localStorage.setItem("vplay_custom_modals", JSON.stringify(customModals));
  }, [customModals]);

  const [showNearFullPopup, setShowNearFullPopup] = useState<boolean>(false);
  const [showFullPopup, setShowFullPopup] = useState<boolean>(false);
  const [hasDismissedNearFull, setHasDismissedNearFull] = useState<boolean>(false);

  // Storage Cleanup States
  const [showCleanModal, setShowCleanModal] = useState<boolean>(false);
  const [cleanPlugins, setCleanPlugins] = useState<boolean>(true);
  const [cleanMultiview, setCleanMultiview] = useState<boolean>(true);
  const [cleanMotion, setCleanMotion] = useState<boolean>(false);
  const [cleanCustomItems, setCleanCustomItems] = useState<boolean>(false);

  // 2-minute cleaning simulation states
  const [isCleaning, setIsCleaning] = useState<boolean>(false);
  const [cleanProgress, setCleanProgress] = useState<number>(0);
  const [cleanTimeRemaining, setCleanTimeRemaining] = useState<number>(120); // 120 seconds = 2 minutes
  const [pendingCleanType, setPendingCleanType] = useState<"quick" | "custom" | "all" | null>(null);

  // Dynamic estimated free space calculation
  const estimatedFreeSpace = useMemo(() => {
    let saved = 0;
    const isStorageFeederInstalled = plugins.some(p => p.id === "storage_feeder" && p.status === "installed");
    
    if (cleanPlugins) {
      if (isStorageFeederInstalled) {
        let remaining = 0.15;
        if (dynamicMotion && !cleanMotion) remaining += 0.55;
        if (isMultiviewMode && !cleanMultiview) remaining += 0.95;
        saved += Math.max(0, 3.00 - remaining);
      } else {
        plugins.forEach(p => {
          if (p.status === "installed") {
            if (p.id === "liquid_glass") saved += 1.20;
            else if (p.id === "remove_shiny_border") saved += 0.35;
            else saved += 0.45;
          }
        });
      }
    }

    if (!isStorageFeederInstalled || cleanPlugins) {
      if (cleanMultiview && isMultiviewMode) saved += 0.95;
      if (cleanMotion && dynamicMotion) saved += 0.55;
    }
    
    if (cleanCustomItems && (customTabs.length > 0 || customModals.length > 0)) {
      saved += 0.20;
    }

    return Math.min(saved, currentStorageUsed);
  }, [cleanPlugins, cleanMultiview, cleanMotion, cleanCustomItems, plugins, isMultiviewMode, dynamicMotion, customTabs, customModals, currentStorageUsed]);

  useEffect(() => {
    if (currentStorageUsed >= 3.00) {
      setShowFullPopup(true);
      setShowNearFullPopup(false);
    } else if (currentStorageUsed >= 2.00) {
      setShowFullPopup(false);
      if (!hasDismissedNearFull) {
        setShowNearFullPopup(true);
      }
    } else {
      setShowFullPopup(false);
      setShowNearFullPopup(false);
      setHasDismissedNearFull(false);
    }
  }, [currentStorageUsed, hasDismissedNearFull]);

  const handleCleanStorage = () => {
    setShowCleanModal(true);
  };

  const startCleaningProcess = (type: "quick" | "custom" | "all") => {
    setPendingCleanType(type);
    setCleanTimeRemaining(120);
    setCleanProgress(0);
    setIsCleaning(true);
    setShowCleanModal(false);
  };

  const applyPendingCleanup = (type: "quick" | "custom" | "all" | null) => {
    const activeType = type || pendingCleanType;
    if (activeType === "quick") {
      setPlugins(prev => prev.map(p => p.id === "storage_feeder" ? { ...p, status: "idle", progress: 0, isActive: false } : p));
      setIsMultiviewMode(false);
      setMultiviewChannels([]);
    } else if (activeType === "all") {
      setPlugins(prev => prev.map(p => ({
        ...p,
        status: "idle",
        progress: 0,
        isActive: false
      })));
      setDynamicMotion(false);
      setIsMultiviewMode(false);
      setMultiviewChannels([]);
      setCustomTabs([]);
      setCustomModals([]);
      localStorage.removeItem("vplay_custom_tabs");
      localStorage.removeItem("vplay_custom_modals");
    } else if (activeType === "custom") {
      if (cleanPlugins) {
        setPlugins(prev => prev.map(p => ({
          ...p,
          status: "idle",
          progress: 0,
          isActive: false
        })));
      }
      if (cleanMultiview) {
        setIsMultiviewMode(false);
        setMultiviewChannels([]);
      }
      if (cleanMotion) {
        setDynamicMotion(false);
      }
      if (cleanCustomItems) {
        setCustomTabs([]);
        setCustomModals([]);
        localStorage.removeItem("vplay_custom_tabs");
        localStorage.removeItem("vplay_custom_modals");
      }
    }

    setShowNearFullPopup(false);
    setShowFullPopup(false);
    setHasDismissedNearFull(false);
    setShowCleanModal(false);
    setIsCleaning(false);
    setPendingCleanType(null);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCleaning) {
      interval = setInterval(() => {
        setCleanTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            // Must pass correct state value or closure-bound state or use a dynamic function
            applyPendingCleanup(pendingCleanType);
            return 0;
          }
          const nextTime = prev - 1;
          setCleanProgress(Math.round(((120 - nextTime) / 120) * 100));
          return nextTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCleaning, pendingCleanType, cleanPlugins, cleanMultiview, cleanMotion, cleanCustomItems]);

  const handleQuickClean = () => {
    startCleaningProcess("quick");
  };

  const handleExecuteCustomClean = () => {
    startCleaningProcess("custom");
  };

  const handleCleanAllStorage = () => {
    startCleaningProcess("all");
  };



  // Tab Form States
  const [tabEditId, setTabEditId] = useState<string | null>(null);
  const [tabNameInput, setTabNameInput] = useState<string>("");
  const [tabIconInput, setTabIconInput] = useState<string>("Sparkles");
  const [tabCodeInput, setTabCodeInput] = useState<string>(
    "// Enter JavaScript handler code here\n" +
    "setSelectedChannel({\n" +
    "  id: 'custom-live',\n" +
    "  name: 'My Custom Stream',\n" +
    "  url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',\n" +
    "  group: 'Personal'\n" +
    "});\n" +
    "setActiveTab('live');"
  );
  const [tabHtmlInput, setTabHtmlInput] = useState<string>(
    "<div class='p-4 text-center'>\n" +
    "  <h3 class='text-sm font-bold text-indigo-400'>Personal TV Channels</h3>\n" +
    "  <p class='text-xs text-white/70 mt-1'>Welcome to your custom designed tab!</p>\n" +
    "</div>"
  );

  // Modal Form States
  const [modalEditId, setModalEditId] = useState<string | null>(null);
  const [modalNameInput, setModalNameInput] = useState<string>("");
  const [modalIconInput, setModalIconInput] = useState<string>("Sparkles");
  const [modalCodeInput, setModalCodeInput] = useState<string>(
    "// Code to execute when the 'Run Function' button is clicked\n" +
    "alert('Custom modal action button clicked!');"
  );
  const [modalHtmlInput, setModalHtmlInput] = useState<string>(
    "<div class='p-4 text-center space-y-2'>\n" +
    "  <h4 class='text-xs font-semibold text-amber-400'>SYSTEM WARNING</h4>\n" +
    "  <p class='text-xs text-white/70'>This is a custom pop-up notification modal.</p>\n" +
    "</div>"
  );

  // Design System Demo states
  const [demoToggleState, setDemoToggleState] = useState<boolean>(false);
  const [activeDockDemoTab, setActiveDockDemoTab] = useState<string>("home");
  const [demoSliderVal, setDemoSliderVal] = useState<number>(0.45);

  useEffect(() => {
    localStorage.setItem("vplay_exp_lowlatency", String(expLowLatency));
  }, [expLowLatency]);

  useEffect(() => {
    localStorage.setItem("vplay_exp_cache", String(expCache));
  }, [expCache]);

  useEffect(() => {
    localStorage.setItem("vplay_exp_glow", String(expAmbientGlow));
  }, [expAmbientGlow]);

  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00"
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
        days: String(days).padStart(2, '0'),
        hours: String(hours % 24).padStart(2, '0'),
        minutes: String(mins % 60).padStart(2, '0'),
        seconds: String(secs % 60).padStart(2, '0')
      });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter & Search logic
  // Join general channels and custom channels
  const allAvailableCategoryList = useMemo(() => {
    if (customChannels.length === 0) return CATEGORIES;
    
    // Add custom category dynamically if there are custom channels
    const customCategory: Category = {
      id: "custom",
      name: "Custom Channels (Personal)",
      description: "List of custom imported m3u8 stream links",
      channels: customChannels
    };
    return [...CATEGORIES, customCategory];
  }, [customChannels]);

  // Flattened channel list for easy global lookup/search
  const flattenedChannels = useMemo(() => {
    return allAvailableCategoryList.flatMap(cat => cat.channels);
  }, [allAvailableCategoryList]);

  // Create a stable numbered channels list where VTV channels are numbered 001, 002, ... and other channels follow consecutively.
  const numberedChannels = useMemo(() => {
    const vtvGroup = flattenedChannels.filter(c => c.group === "VTV");
    const otherChannels = flattenedChannels.filter(c => c.group !== "VTV");
    
    const vtvOrder = ["vtv1", "vtv2", "vtv3", "vtv4", "vtv5", "vtv6", "vtv7", "vtv8", "vtv9", "vtv10", "vtv6_test", "vtv5_tn", "vtv5_tnb"];
    const sortedVtv = [...vtvGroup].sort((a, b) => {
      const idxA = vtvOrder.indexOf(a.id);
      const idxB = vtvOrder.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.name.localeCompare(b.name);
    });

    const ordered = [...sortedVtv, ...otherChannels];
    
    return ordered.map((ch, index) => {
      const numStr = String(index + 1).padStart(3, '0');
      return {
        ...ch,
        channelNumber: numStr
      };
    });
  }, [flattenedChannels]);

  // Map to easily resolve channelNumber from channelId
  const channelNumberMap = useMemo(() => {
    const map: Record<string, string> = {};
    numberedChannels.forEach(ch => {
      map[ch.id] = ch.channelNumber;
    });
    return map;
  }, [numberedChannels]);

  const filteredCategoriesForPicker = useMemo(() => {
    if (!pickerSearchQuery.trim()) return allAvailableCategoryList;
    const query = pickerSearchQuery.toLowerCase();
    return allAvailableCategoryList.map((cat) => ({
      ...cat,
      channels: cat.channels.filter((ch) =>
        ch.name.toLowerCase().includes(query) || (ch.logoText && ch.logoText.toLowerCase().includes(query))
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
    localStorage.setItem("glass_tv_last_channel", JSON.stringify(selectedChannel));
  }, [selectedChannel]);

  useEffect(() => {
    localStorage.setItem("glass_tv_custom_list", JSON.stringify(customChannels));
  }, [customChannels]);

  // Toggle favorite helper
  const toggleFavorite = (channelId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      if (prev.includes(channelId)) {
        return prev.filter(id => id !== channelId);
      } else {
        return [...prev, channelId];
      }
    });
  };

  // Switch channel trigger
  const handleSelectChannel = (channel: Channel, bypassVtv5Check = false) => {
    if (channel.id === "vtv5" && !bypassVtv5Check) {
      setShowVtv5Popup(true);
      return;
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

  const handleNextChannel = () => {
    const currentIndex = flattenedChannels.findIndex(ch => ch.id === selectedChannel.id);
    if (currentIndex !== -1 && currentIndex < flattenedChannels.length - 1) {
      setSelectedChannel(flattenedChannels[currentIndex + 1]);
    } else {
      setSelectedChannel(flattenedChannels[0]);
    }
  };

  const handlePrevChannel = () => {
    const currentIndex = flattenedChannels.findIndex(ch => ch.id === selectedChannel.id);
    if (currentIndex !== -1 && currentIndex > 0) {
      setSelectedChannel(flattenedChannels[currentIndex - 1]);
    } else {
      setSelectedChannel(flattenedChannels[flattenedChannels.length - 1]);
    }
  };

  // Add Custom Channel Handler
  const handleAddCustomChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customChannelName || !customChannelUrl) return;

    const finalGroup = customChannelGroup === "NEW_GROUP" 
      ? (customGroupInput.trim() || "Private Channel") 
      : customChannelGroup;

    const newChannel: Channel = {
      id: `custom-${Date.now()}`,
      name: customChannelName,
      url: customChannelUrl.trim(),
      group: finalGroup,
      logoText: customChannelName.slice(0, 3).toUpperCase(),
      logoBg: "bg-gradient-to-br from-indigo-600 to-fuchsia-700"
    };

    setCustomChannels(prev => [newChannel, ...prev]);
    setSelectedChannel(newChannel);
    setCustomChannelName("");
    setCustomChannelUrl("");
    setCustomGroupInput("New Channel Group");
    setCustomChannelGroup("VTV");
    setShowCustomModal(false);
  };

  // Delete Custom Channel
  const handleDeleteCustomChannel = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomChannels(prev => prev.filter(ch => ch.id !== id));
    if (selectedChannel.id === id) {
      setSelectedChannel(defaultChannel);
    }
  };

  // Share stream link to clipboard
  const handleShareChannel = () => {
    if (!selectedChannel) return;
    
    navigator.clipboard.writeText(selectedChannel.url).then(() => {
      setShowCopiedNotify(true);
      if (notifyTimeoutRef.current) {
        clearTimeout(notifyTimeoutRef.current);
      }
      notifyTimeoutRef.current = setTimeout(() => {
        setShowCopiedNotify(false);
      }, 3000);
    }).catch((err) => {
      console.error("Could not copy stream link: ", err);
    });
  };

  // Filter channels based on search on selected category
  const filteredCategories = useMemo(() => {
    return allAvailableCategoryList.map(category => {
      // Filter channels inside
      const matchedChannels = category.channels.filter(ch => {
        // Search filter matches name, group name
        const matchesSearch = searchQuery 
          ? ch.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            ch.group.toLowerCase().includes(searchQuery.toLowerCase())
          : true;

        return matchesSearch;
      });

      return {
        ...category,
        channels: matchedChannels
      };
    }).filter(category => {
      // Filter final category selection
      if (selectedCategory !== "all" && category.id !== selectedCategory) {
        return false;
      }
      return category.channels.length > 0;
    });
  }, [allAvailableCategoryList, selectedCategory, searchQuery]);

  // Favorites channels filtered selection
  const favoriteChannelsList = useMemo(() => {
    return flattenedChannels.filter(ch => favorites.includes(ch.id));
  }, [flattenedChannels, favorites]);

  // Reimagined Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return flattenedChannels.filter(ch => 
      ch.name.toLowerCase().includes(query) || 
      ch.group.toLowerCase().includes(query)
    );
  }, [flattenedChannels, searchQuery]);

  // Ambient backgrounds options config
  const getBgGradient = () => {
    if (isMaterialDesignActive) {
      return "bg-[#1b0323]";
    }
    if (!liquidGlass) {
      return "bg-[#121214]";
    }
    if (amoledDark) {
      return "bg-black";
    }
    switch (bgColor) {
      case "cosmic":
        return "bg-gradient-to-tr from-[#12071a] via-[#1a0e36] to-[#011424]";
      case "deep":
        return "bg-gradient-to-br from-[#0c0517] via-[#090b17] to-[#04010a]";
      case "aurora":
        return "bg-gradient-to-tr from-[#150a24] via-[#0d2a23] to-[#240a24]";
      case "sunset":
        return "bg-gradient-to-tr from-[#1a0914] via-[#330c1e] to-[#2e1d0d]";
    }
  };

  const renderWheelOfVplayModal = () => {
    const parsedOptions = wheelInputText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((line, idx) => {
        const weight = wheelWeights[line] ?? 1;
        return { id: idx, name: line, weight };
      });

    const totalWeight = parsedOptions.reduce((acc, opt) => acc + opt.weight, 0);

    const getSectorPath = (x: number, y: number, r: number, startAngle: number, endAngle: number) => {
      if (endAngle - startAngle >= 359.99) {
        endAngle = 359.99;
      }
      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;
      const x1 = x + r * Math.cos(startRad);
      const y1 = y + r * Math.sin(startRad);
      const x2 = x + r * Math.cos(endRad);
      const y2 = y + r * Math.sin(endRad);
      
      const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
      
      return [
        "M", x, y,
        "L", x1, y1,
        "A", r, r, 0, largeArcFlag, 1, x2, y2,
        "Z"
      ].join(" ");
    };

    let currentAngle = 0;
    const sectorPaths = parsedOptions.map((opt, idx) => {
      const percentage = opt.weight / (totalWeight || 1);
      const angleSweep = percentage * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angleSweep;
      currentAngle = endAngle;

      const colors = [
        "#ff0055", // Red-pink
        "#00ffcc", // Neon Cyan
        "#9900ff", // Neon Purple
        "#ff9900", // Neon Orange
        "#0099ff", // Neon Blue
        "#33cc33", // Green
        "#ff00cc", // Hot Pink
        "#ffff00"  // Yellow
      ];
      const color = colors[idx % colors.length];

      const pathData = getSectorPath(150, 150, 140, startAngle, endAngle);

      const middleAngle = startAngle + angleSweep / 2;
      const textRad = (middleAngle - 90) * Math.PI / 180;
      const textX = 150 + 75 * Math.cos(textRad);
      const textY = 150 + 75 * Math.sin(textRad);

      return {
        ...opt,
        startAngle,
        endAngle,
        color,
        pathData,
        textX,
        textY,
        textRotation: middleAngle
      };
    });

    const handleSpin = () => {
      if (wheelIsSpinning || parsedOptions.length === 0) return;

      setWheelIsSpinning(true);
      setWheelWinner(null);

      const rand = Math.random() * totalWeight;
      let runningSum = 0;
      let winningOpt = parsedOptions[0];

      for (const opt of parsedOptions) {
        runningSum += opt.weight;
        if (rand <= runningSum) {
          winningOpt = opt;
          break;
        }
      }

      const winnerSector = sectorPaths.find(s => s.name === winningOpt.name);
      if (!winnerSector) return;

      const sectorCenter = winnerSector.startAngle + (winnerSector.endAngle - winnerSector.startAngle) / 2;
      const targetAngle = 360 - sectorCenter;

      // Ensure spin completes multiple full rotations
      const totalSpinsAngle = 360 * 6 + targetAngle;
      const nextRotation = wheelRotation + totalSpinsAngle - (wheelRotation % 360);
      setWheelRotation(nextRotation);

      setTimeout(() => {
        setWheelIsSpinning(false);
        setWheelWinner(winningOpt.name);
      }, wheelSpinDuration * 1000);
    };

    const handleCycleWeight = (name: string) => {
      const current = wheelWeights[name] ?? 1;
      let next = 1;
      if (current === 1) next = 2;
      else if (current === 2) next = 5;
      else if (current === 5) next = 10;
      else next = 1;

      setWheelWeights(prev => ({
        ...prev,
        [name]: next
      }));
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-[20px] z-[120] flex items-center justify-center p-4 font-google select-none overflow-y-auto"
        onClick={() => {
          if (!wheelIsSpinning) setShowWheelOfVplayModal(false);
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className={`w-full max-w-4xl p-6 md:p-8 shadow-2xl relative text-left overflow-hidden flex flex-col ${
            isMaterialDesignActive
              ? "rounded-[28px] bg-[#211f26] border border-white/5 text-[#e6e1e5]"
              : "rounded-[32px] bg-[#121118]/95 border border-white/10 text-white"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">WHEEL OF VPLAY</h3>
                <p className="text-xs text-white/40">Vòng quay may mắn tùy biến với tỉ lệ cơ hội</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (!wheelIsSpinning) setShowWheelOfVplayModal(false);
              }}
              disabled={wheelIsSpinning}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-white/60 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Column 1: Wheel Display */}
            <div className="flex flex-col items-center justify-center space-y-6 relative py-4">
              {/* Center Pointer */}
              <div className="absolute top-1 z-20 flex flex-col items-center">
                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-purple-500 filter drop-shadow-[0_4px_10px_rgba(168,85,247,0.6)]" />
                <div className="w-2.5 h-2.5 bg-white rounded-full -mt-4 shadow-sm" />
              </div>

              {/* Wheel Container */}
              <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full p-2 bg-gradient-to-b from-white/10 to-white/5 border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden">
                <div 
                  className="w-full h-full rounded-full transition-transform ease-out shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)]"
                  style={{
                    transform: `rotate(${wheelRotation}deg)`,
                    transitionDuration: wheelIsSpinning ? `${wheelSpinDuration}s` : '0s',
                    transitionTimingFunction: 'cubic-bezier(0.1, 0.8, 0.1, 1)'
                  }}
                >
                  {parsedOptions.length === 0 ? (
                    <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/20">
                      <p className="text-xs text-white/40 font-medium">Nhập lựa chọn của bạn</p>
                    </div>
                  ) : (
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 300 300">
                      <g>
                        {sectorPaths.map((sector) => (
                          <g key={sector.id}>
                            {/* Sector path */}
                            <path 
                              d={sector.pathData} 
                              fill={sector.color} 
                              className="opacity-85 hover:opacity-95 transition-opacity stroke-black/20 stroke-[1.5px]"
                            />
                            {/* Label text */}
                            <g transform={`translate(${sector.textX}, ${sector.textY}) rotate(${sector.textRotation})`}>
                              <text
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#ffffff"
                                className="text-[10px] font-bold tracking-wide drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)] uppercase pointer-events-none"
                                transform="rotate(90)"
                              >
                                {sector.name.length > 12 ? `${sector.name.substring(0, 10)}..` : sector.name}
                              </text>
                            </g>
                          </g>
                        ))}
                      </g>
                      {/* Center pin decoration */}
                      <circle cx="150" cy="150" r="18" fill="#121118" stroke="rgba(255,255,255,0.25)" strokeWidth="4" />
                      <circle cx="150" cy="150" r="6" fill="#a855f7" className="animate-pulse" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Action Spin Button */}
              <div className="w-full max-w-xs flex flex-col items-center space-y-3">
                <button
                  onClick={handleSpin}
                  disabled={wheelIsSpinning || parsedOptions.length === 0}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 disabled:opacity-30 py-3.5 px-6 rounded-2xl text-sm font-bold tracking-wide uppercase shadow-[0_4px_20px_rgba(168,85,247,0.4)] hover:shadow-[0_4px_24px_rgba(168,85,247,0.6)] transition-all cursor-default text-center flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${wheelIsSpinning ? 'animate-spin' : ''}`} />
                  {wheelIsSpinning ? "Đang quay..." : "BẮT ĐẦU QUAY"}
                </button>

                {/* Landed Outcome Winner */}
                <div className="h-12 flex items-center justify-center text-center">
                  <AnimatePresence mode="wait">
                    {wheelWinner && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        className="py-1 px-4 rounded-xl bg-purple-500/15 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                      >
                        <p className="text-[11px] text-purple-400 font-bold uppercase tracking-widest mb-0.5">KẾT QUẢ VÒNG QUAY</p>
                        <p className="text-sm font-black text-white uppercase tracking-wide">{wheelWinner}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Column 2: Controls and Options Configuration */}
            <div className="flex flex-col space-y-5 h-full justify-start">
              {/* Text area configuration */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Danh sách các lựa chọn</label>
                  <span className="text-[10px] text-white/30 tracking-wide font-medium">(Mỗi dòng là một lựa chọn)</span>
                </div>
                <textarea
                  value={wheelInputText}
                  onChange={(e) => setWheelInputText(e.target.value)}
                  disabled={wheelIsSpinning}
                  placeholder="Nhập các lựa chọn..."
                  className="w-full h-32 bg-black/40 border border-white/10 focus:border-purple-500/40 focus:outline-none p-3.5 rounded-2xl text-xs text-white placeholder-white/15 leading-relaxed font-sans resize-none disabled:opacity-40"
                />
              </div>

              {/* Speed Controller (1s -> 1m) */}
              <div className="space-y-2 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Thời gian quay</label>
                  <span className="text-xs text-purple-400 font-bold">{wheelSpinDuration}s</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={wheelSpinDuration}
                  onChange={(e) => setWheelSpinDuration(Number(e.target.value))}
                  disabled={wheelIsSpinning}
                  className="w-full accent-purple-500 h-1 bg-white/10 rounded-full cursor-pointer disabled:opacity-30"
                />
                {/* Speed presets */}
                <div className="flex gap-2 pt-1">
                  {[1, 5, 10, 30, 60].map((t) => (
                    <button
                      key={t}
                      onClick={() => setWheelSpinDuration(t)}
                      disabled={wheelIsSpinning}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                        wheelSpinDuration === t
                          ? 'bg-purple-500/25 border-purple-500/50 text-purple-300'
                          : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                      } disabled:opacity-30`}
                    >
                      {t === 60 ? "1m" : `${t}s`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Probability Weights and Multipliers */}
              <div className="space-y-2 flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Hệ số cơ hội (x)</label>
                  <span className="text-[10px] text-white/30 tracking-wide">(Nhấp để tăng hệ số trúng)</span>
                </div>
                <div className="bg-black/40 border border-white/10 rounded-2xl p-3 flex-1 overflow-y-auto max-h-[160px] space-y-1.5 custom-scrollbar">
                  {parsedOptions.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-[10px] text-white/30 font-medium">Chưa có lựa chọn nào được nhập</p>
                    </div>
                  ) : (
                    parsedOptions.map((opt) => (
                      <div 
                        key={opt.id}
                        onClick={() => {
                          if (!wheelIsSpinning) handleCycleWeight(opt.name);
                        }}
                        className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                          wheelIsSpinning ? 'opacity-50' : 'hover:bg-white/5 cursor-pointer active:scale-[0.98]'
                        }`}
                      >
                        <span className="text-[11px] font-medium text-white/80 truncate max-w-[200px]">{opt.name}</span>
                        <div className="flex items-center gap-2">
                          {/* Chance Percentage display */}
                          <span className="text-[10px] text-white/30 font-mono">
                            {((opt.weight / (totalWeight || 1)) * 100).toFixed(0)}%
                          </span>
                          {/* Multiplier Badge */}
                          <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded-lg ${
                            opt.weight === 1 ? 'bg-white/5 text-white/40' :
                            opt.weight === 2 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                            opt.weight === 5 ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                            'bg-amber-500/25 text-amber-300 border border-amber-500/40 animate-pulse'
                          }`}>
                            {opt.weight}x
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const renderFocusChannelsModal = () => {
    const cats = allAvailableCategoryList;
    const allChs = flattenedChannels;

    const filteredChs = allChs.filter(ch => {
      const matchesSearch = ch.name.toLowerCase().includes(focusChannelsSearch.toLowerCase());
      const matchesCat = focusChannelsCategory === "all" || ch.group === cats.find(c => c.id === focusChannelsCategory)?.name;
      return matchesSearch && matchesCat;
    });

    return (
      <AnimatePresence>
        {showFocusChannelsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[120] flex items-center justify-center p-4 font-sans"
            onClick={() => setShowFocusChannelsModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className={`w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden ${
                isMaterialDesignActive
                  ? "rounded-[28px] bg-[#211f26] border border-white/5 shadow-2xl text-[#e6e1e5]"
                  : "rounded-[30px] bg-[#121118]/90 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15),0_24px_48px_rgba(0,0,0,0.8)] border border-white/10 text-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <Tv className="w-5 h-5 text-indigo-400 animate-pulse" />
                  <h3 className="text-lg font-bold tracking-tight">Channels List</h3>
                </div>
                <button
                  onClick={() => setShowFocusChannelsModal(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search & Categories */}
              <div className="p-4 border-b border-white/5 space-y-3 shrink-0">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search channels..."
                    value={focusChannelsSearch}
                    onChange={(e) => setFocusChannelsSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-white font-sans"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                  <button
                    onClick={() => setFocusChannelsCategory("all")}
                    className={`px-3 py-1.5 rounded-full transition-all ${
                      focusChannelsCategory === "all"
                        ? "bg-indigo-600 text-white font-medium"
                        : "bg-white/5 hover:bg-white/10 text-white/60"
                    }`}
                  >
                    All
                  </button>
                  {cats.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setFocusChannelsCategory(c.id)}
                      className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                        focusChannelsCategory === c.id
                          ? "bg-indigo-600 text-white font-medium"
                          : "bg-white/5 hover:bg-white/10 text-white/60"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Channels Grid */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                {filteredChs.length === 0 ? (
                  <div className="py-12 text-center text-white/40 text-sm">
                    No channels found matching the criteria.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredChs.map((ch) => {
                      const isPlaying = selectedChannel.id === ch.id;
                      return (
                        <button
                          key={ch.id}
                          onClick={() => {
                            handleSelectChannel(ch);
                            setShowFocusChannelsModal(false);
                          }}
                          className={`p-3 rounded-2xl flex items-center gap-3 text-left transition-all group ${
                            isPlaying
                              ? "bg-indigo-600/30 border border-indigo-500/50 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                              : "bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-white/80"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-lg bg-black/40 overflow-hidden flex items-center justify-center shrink-0 border border-white/10">
                            {ch.logoImg ? (
                              <img src={ch.logoImg} alt={ch.name} className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="text-[10px] font-bold text-white/40">{ch.logoText}</div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-semibold truncate group-hover:text-white transition-colors">{ch.name}</div>
                            <div className="text-[10px] text-white/40 truncate mt-0.5">{ch.group}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const renderCleanupModal = () => {
    return (
      <AnimatePresence>
        {showCleanModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={isMaterialDesignActive ? { duration: 0.25 } : (dynamicMotion ? { duration: 0.35, ease: [0.16, 1, 0.3, 1] } : { duration: 0 })}
            className="fixed inset-0 bg-black/75 backdrop-blur-[20px] z-[200] flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={isMaterialDesignActive ? { opacity: 0, y: 15 } : { opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={isMaterialDesignActive ? { opacity: 0, y: 15 } : { opacity: 0, scale: 0.95, y: 15 }}
              transition={isMaterialDesignActive ? { duration: 0.25 } : (dynamicMotion ? { duration: 0.45, ease: [0.16, 1, 0.3, 1] } : { duration: 0 })}
              className={`w-full max-w-[430px] relative text-left transform-gpu ${
                isMaterialDesignActive
                  ? "rounded-[28px] bg-[#211f26] p-5 shadow-2xl border border-white/5 text-[#e6e1e5]"
                  : "rounded-[28px] bg-[#1c1c1e]/98 p-5 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15),0_24px_48px_rgba(0,0,0,0.6)] border border-white/10 text-white"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400">
                    <Trash2 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className={`text-[16px] font-bold tracking-tight leading-none ${isMaterialDesignActive ? "text-[#e6e1e5]" : "text-white"}`}>
                      Bộ dọn dẹp ổ cứng Vplay
                    </h3>
                    <span className="text-[10px] opacity-50 block mt-0.5">Giải phóng dung lượng nhanh chóng</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowCleanModal(false)}
                  className={`p-1 rounded-full transition-colors ${
                    isMaterialDesignActive ? "hover:bg-white/5 text-[#e6e1e5]" : "hover:bg-white/10 text-white/70"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Storage capacity indicator */}
              <div className={`p-3 rounded-xl mb-4 border ${
                isMaterialDesignActive ? "bg-white/5 border-white/10" : "bg-white/[0.03] border-white/5"
              }`}>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="opacity-70">Bộ nhớ đã sử dụng:</span>
                  <span className="font-mono font-bold">{currentStorageUsed.toFixed(2)} GB / 3.00 GB</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      currentStorageUsed >= 2.8 
                        ? "bg-red-500" 
                        : currentStorageUsed >= 2.0 
                          ? "bg-amber-500" 
                          : "bg-indigo-500"
                    }`}
                    style={{ width: `${(currentStorageUsed / 3.00) * 100}%` }}
                  />
                </div>
              </div>

              {/* Options selection in 2x2 grid */}
              <div className="mb-4">
                <span className="text-[11px] font-bold text-indigo-400 block mb-2 uppercase tracking-wider">Tùy chọn giải phóng:</span>
                <div className="grid grid-cols-2 gap-2">
                  {/* Option 1: Plugins */}
                  <label className={`p-2.5 rounded-xl border cursor-pointer select-none transition-all duration-200 flex items-start gap-2 ${
                    cleanPlugins 
                      ? "bg-indigo-500/10 border-indigo-500/40 text-white" 
                      : "bg-white/[0.02] border-white/5 text-white/50 hover:border-white/10"
                  }`}>
                    <input 
                      type="checkbox"
                      checked={cleanPlugins}
                      onChange={(e) => setCleanPlugins(e.target.checked)}
                      className="mt-0.5 accent-indigo-500 rounded cursor-pointer"
                    />
                    <div className="text-left">
                      <span className="font-bold text-[11px] block">Gỡ Plugins</span>
                      <span className="text-[9px] opacity-60 block mt-0.5 leading-snug">Gỡ Liquid Glass & Storage Feeder</span>
                    </div>
                  </label>

                  {/* Option 2: Multiview */}
                  <label className={`p-2.5 rounded-xl border cursor-pointer select-none transition-all duration-200 flex items-start gap-2 ${
                    cleanMultiview 
                      ? "bg-indigo-500/10 border-indigo-500/40 text-white" 
                      : "bg-white/[0.02] border-white/5 text-white/50 hover:border-white/10"
                  }`}>
                    <input 
                      type="checkbox"
                      checked={cleanMultiview}
                      onChange={(e) => setCleanMultiview(e.target.checked)}
                      className="mt-0.5 accent-indigo-500 rounded cursor-pointer"
                    />
                    <div className="text-left">
                      <span className="font-bold text-[11px] block">Xóa Multiview</span>
                      <span className="text-[9px] opacity-60 block mt-0.5 leading-snug">Đóng kênh phụ, giải phóng cache</span>
                    </div>
                  </label>

                  {/* Option 3: Motion */}
                  <label className={`p-2.5 rounded-xl border cursor-pointer select-none transition-all duration-200 flex items-start gap-2 ${
                    cleanMotion 
                      ? "bg-indigo-500/10 border-indigo-500/40 text-white" 
                      : "bg-white/[0.02] border-white/5 text-white/50 hover:border-white/10"
                  }`}>
                    <input 
                      type="checkbox"
                      checked={cleanMotion}
                      onChange={(e) => setCleanMotion(e.target.checked)}
                      className="mt-0.5 accent-indigo-500 rounded cursor-pointer"
                    />
                    <div className="text-left">
                      <span className="font-bold text-[11px] block">Tắt Motion</span>
                      <span className="text-[9px] opacity-60 block mt-0.5 leading-snug">Tắt hiệu ứng chuyển cảnh mượt</span>
                    </div>
                  </label>

                  {/* Option 4: Custom channels/tabs */}
                  <label className={`p-2.5 rounded-xl border cursor-pointer select-none transition-all duration-200 flex items-start gap-2 ${
                    cleanCustomItems 
                      ? "bg-indigo-500/10 border-indigo-500/40 text-white" 
                      : "bg-white/[0.02] border-white/5 text-white/50 hover:border-white/10"
                  }`}>
                    <input 
                      type="checkbox"
                      checked={cleanCustomItems}
                      onChange={(e) => setCleanCustomItems(e.target.checked)}
                      className="mt-0.5 accent-indigo-500 rounded cursor-pointer"
                    />
                    <div className="text-left">
                      <span className="font-bold text-[11px] block">Xóa Custom</span>
                      <span className="text-[9px] opacity-60 block mt-0.5 leading-snug">Xóa kênh/cửa sổ tự thiết kế</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Estimated space backplate */}
              <div className="flex items-center justify-between px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-4 text-xs">
                <span className="text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                  <span>🍃</span> Dung lượng ước tính giải phóng:
                </span>
                <span className="font-bold font-mono text-emerald-400">-{estimatedFreeSpace.toFixed(2)} GB</span>
              </div>

              {/* Combined Actions */}
              <div className="space-y-2">
                <button
                  onClick={handleExecuteCustomClean}
                  disabled={!cleanPlugins && !cleanMultiview && !cleanMotion && !cleanCustomItems}
                  className="w-full py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[12px] font-bold transition-all active:scale-95 shadow-md cursor-default text-center"
                >
                  Bắt đầu dọn dẹp đã chọn (2 phút)
                </button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleQuickClean}
                    className="py-1.5 px-3 rounded-full bg-white/5 hover:bg-white/10 text-white text-[11px] font-semibold text-center transition-all cursor-default"
                  >
                    ⚡ Dọn dẹp nhanh
                  </button>
                  <button
                    onClick={handleCleanAllStorage}
                    className="py-1.5 px-3 rounded-full bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/10 hover:border-red-500/20 text-[11px] font-bold text-center transition-all cursor-default"
                  >
                    🚨 Khôi phục cài đặt gốc
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  if (showSplash || roleSelection === null || currentStorageUsed >= 3.00 || isCleaning) {
    return (
      <div className="fixed inset-0 bg-[#06040a] flex flex-col items-center justify-center z-[99999] p-4 select-none font-google">
        {/* Background ambient light */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        {isCleaning ? (
          <div className="w-full max-w-md p-8 bg-[#121118]/85 backdrop-blur-2xl border border-white/10 text-center shadow-[0_24px_60px_rgba(0,0,0,0.8)] relative overflow-hidden rounded-[28px] animate-fade-in flex flex-col items-center justify-center text-white">
            {/* Ambient subtle glow background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Spinning vector ring */}
            <svg className="animate-spin h-14 w-14 text-indigo-500 mb-6" viewBox="0 0 50 50">
              <circle
                className="opacity-100"
                cx="25"
                cy="25"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="40 150"
                fill="none"
              />
            </svg>

            {/* Title / Description */}
            <h3 className="text-white text-base font-bold uppercase tracking-wider mb-2">
              Dọn dẹp hệ thống...
            </h3>
            <p className="text-white/40 text-xs tracking-wide mb-6">
              Vui lòng giữ ứng dụng mở, không tải lại trang.
            </p>

            {/* Custom thin terminal progress bar */}
            <div className="w-full space-y-2 mb-6">
              <div className="flex justify-between text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                <span>Tiến trình dọn dẹp</span>
                <span>{cleanProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-white/5 overflow-hidden border border-white/10 rounded-full p-[2px]">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-300 rounded-full" 
                  style={{ width: `${cleanProgress}%` }}
                />
              </div>
            </div>

            {/* Tech details live log */}
            <div className="text-[11px] bg-black/40 border border-white/5 rounded-none p-4 min-h-[56px] w-full flex items-center justify-center text-white/80 transition-all duration-300 leading-relaxed font-mono">
              {cleanProgress < 15 ? (
                <span className="animate-pulse">🔍 Đang phân tích hệ thống tệp và tệp tạm thời...</span>
              ) : cleanProgress < 35 ? (
                <span className="animate-pulse">🗑️ Đang dọn dẹp phân mảnh dữ liệu rác bộ đệm...</span>
              ) : cleanProgress < 55 ? (
                <span className="animate-pulse">📦 Đang tiến hành gỡ bỏ mô-đun rác Storage Feeder...</span>
              ) : cleanProgress < 75 ? (
                <span className="animate-pulse">⚡ Giải phóng bộ nhớ Multiview & tối ưu hóa băng thông...</span>
              ) : cleanProgress < 90 ? (
                <span className="animate-pulse">🛠️ Đang sắp xếp, tối ưu hóa lại bảng chỉ mục tệp tin...</span>
              ) : cleanProgress < 98 ? (
                <span className="animate-pulse">⚡ Đang kiểm tra tính toàn vẹn hệ thống...</span>
              ) : (
                <span className="text-emerald-400">✅ Dọn dẹp hoàn tất! Đang khởi động lại...</span>
              )}
            </div>

            {/* Countdown timer */}
            <div className="text-[10px] text-white/30 uppercase tracking-widest mt-4 font-mono">
              Thời gian ước tính: {Math.floor(cleanTimeRemaining / 60).toString().padStart(2, "0")}
              :
              {(cleanTimeRemaining % 60).toString().padStart(2, "0")}
            </div>
          </div>
        ) : showSplash ? (
          <div className="flex flex-col items-center justify-center">
            <svg className="animate-spin h-14 w-14 text-white mb-6" viewBox="0 0 50 50">
              <circle
                className="opacity-100"
                cx="25"
                cy="25"
                r="20"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="40 150"
                fill="none"
              />
            </svg>
            <div className="text-white/40 text-xs tracking-widest uppercase font-google font-medium animate-pulse">Connecting to services...</div>
          </div>
        ) : roleSelection === null ? (
          <div className="w-full max-w-md p-8 bg-[#121118]/85 backdrop-blur-2xl border border-white/10 text-center shadow-[0_24px_60px_rgba(0,0,0,0.8)] relative overflow-hidden rounded-[28px] animate-fade-in hover:border-white/15 transition-all text-white font-google">
            {/* Ambient subtle glow background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {!showAdminPassModal ? (
                <>
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-white tracking-wide uppercase">BẠN LÀ AI?</h2>
                    <p className="text-xs text-white/45 uppercase tracking-wider">Vui lòng chọn vai trò để tiếp tục</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 pt-2">
                    {/* User Option Button */}
                    <button
                      onClick={() => {
                        setRoleSelection("user");
                      }}
                      className="group flex items-center justify-between p-4 bg-white/[0.03] hover:bg-indigo-600/10 border border-white/10 hover:border-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all text-left rounded-2xl relative cursor-default"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-white uppercase tracking-wider">Người trải nghiệm</div>
                          <div className="text-[10px] text-white/40 group-hover:text-white/60 transition-colors">Khám phá Vplay lập tức</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-indigo-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">SELECT &rarr;</span>
                    </button>

                    {/* Admin Option Button */}
                    <button
                      onClick={() => {
                        setShowAdminPassModal(true);
                        setAdminError("");
                        setAdminPasswordInput("");
                      }}
                      className="group flex items-center justify-between p-4 bg-white/[0.03] hover:bg-purple-600/10 border border-white/10 hover:border-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all text-left rounded-2xl relative cursor-default"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors">
                          <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-white uppercase tracking-wider">Nhà phát triển</div>
                          <div className="text-[10px] text-white/40 group-hover:text-white/60 transition-colors font-medium">Yêu cầu mã khóa bảo mật</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-purple-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">AUTH &rarr;</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-5 animate-fade-in text-left">
                  <div className="text-center space-y-1">
                    <h3 className="text-sm font-bold uppercase text-purple-400 tracking-wide">XÁC THỰC ADMIN</h3>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Nhập mã khóa bảo mật để cấp quyền</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">MẬT MÃ TRUY CẬP</label>
                    <input
                      type="password"
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      placeholder="Mật khẩu của Admin..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (adminPasswordInput === "3667") {
                            setRoleSelection("admin");
                            setShowAdminPassModal(false);
                          } else {
                            setAdminError("Mật khẩu không chính xác!");
                          }
                        }
                      }}
                      className="w-full bg-black/40 border border-white/10 focus:border-purple-500/50 px-3 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none rounded-xl font-mono tracking-widest"
                      autoFocus
                    />
                  </div>

                  {adminError && (
                    <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider font-mono text-center">
                      ⚠ {adminError}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        if (adminPasswordInput === "3667") {
                          setRoleSelection("admin");
                          setShowAdminPassModal(false);
                        } else {
                          setAdminError("Mật khẩu không chính xác!");
                        }
                      }}
                      className="flex-1 bg-purple-600 hover:bg-purple-500 hover:shadow-[0_0_15px_rgba(147,51,234,0.3)] text-white font-bold py-2.5 text-xs uppercase tracking-wider rounded-xl transition-all cursor-default text-center"
                    >
                      Xác nhận
                    </button>
                    <button
                      onClick={() => {
                        setShowAdminPassModal(false);
                        setAdminError("");
                        setAdminPasswordInput("");
                      }}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white/60 font-bold py-2.5 text-xs uppercase tracking-wider rounded-xl transition-all cursor-default text-center"
                    >
                      Quay lại
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-white">Kiểm tra tính toàn vẹn...</div>
        )}

        {currentStorageUsed >= 3.00 && showFullPopup && !isCleaning && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-[25px] z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={isMaterialDesignActive ? { opacity: 0 } : { opacity: 0, scale: 1.15 }}
              animate={isMaterialDesignActive ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={isMaterialDesignActive ? { opacity: 0 } : { opacity: 0, scale: 1.15 }}
              transition={isMaterialDesignActive ? { duration: 0.25 } : (dynamicMotion ? { duration: 0.35, ease: [0.16, 1, 0.3, 1] } : { duration: 0 })}
              className={`w-full max-w-[420px] relative text-left transform-gpu ${
                isMaterialDesignActive
                  ? "rounded-[28px] bg-[#211f26] p-6 shadow-2xl border-0 text-[#e6e1e5]"
                  : "rounded-[30px] bg-[#1c1c1e]/95 p-6 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15),0_24px_48px_rgba(0,0,0,0.5)] border border-white/10 text-white"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-full bg-red-500/10 text-red-400 animate-pulse">
                  <HardDrive className="w-6 h-6" />
                </div>
                <h3 className={`text-[19px] font-bold tracking-tight leading-snug ${isMaterialDesignActive ? "text-[#e6e1e5]" : "text-white"}`}>
                  Ổ cứng đã đầy (3.00GB)
                </h3>
              </div>
              <p className={`text-[13px] mb-6 leading-relaxed ${isMaterialDesignActive ? "text-[#cac4d0]" : "text-white/70"}`}>
                Ứng dụng dùng thử nghiệm Vplay chỉ hỗ trợ lưu trữ tối đa 3GB dữ liệu rác. Do ổ cứng đã đầy hoàn toàn, Vplay sẽ bị khóa cho đến khi được giải phóng bộ nhớ.
              </p>
              
              <div className="space-y-2.5">
                <button
                  onClick={handleCleanStorage}
                  className={`w-full py-3 px-4 rounded-full font-bold text-[14px] text-center cursor-default transform-gpu active:scale-95 transition-all duration-300 ${
                    isMaterialDesignActive
                      ? "bg-[#d0bcff] hover:bg-[#bfa8eb] text-[#381e72]"
                      : "bg-[#007aff] hover:bg-[#0066d6] text-white shadow-lg"
                  }`}
                >
                  Dọn dẹp ổ cứng ngay (Mất 2 phút)
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className={`w-full py-3 px-4 rounded-full font-semibold text-[14px] text-center cursor-default transform-gpu active:scale-95 transition-all duration-300 ${
                    isMaterialDesignActive
                      ? "bg-white/5 hover:bg-white/10 text-[#e6e1e5] border border-white/10"
                      : "bg-white/10 hover:bg-white/15 text-white"
                  }`}
                >
                  Thử tải lại trang
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {renderCleanupModal()}
      {renderFocusChannelsModal()}
      </div>
    );
  }

  return (
    <MotionConfig transition={dynamicMotion ? undefined : { type: "tween", duration: 0 }}>
      <div className={`min-h-screen text-white/95 pb-32 pt-[40px] transition-colors duration-1000 overflow-x-clip ${getBgGradient()} ${!liquidGlass || isMaterialDesignActive ? "no-liquid-glass" : ""} ${isMaterialDesignActive ? "material-design-3" : ""} ${isRemoveShinyBorderActive ? "remove-shiny-border" : ""} ${!dynamicMotion ? "no-dynamic-motion" : ""}`}>
        
        <MacMenuBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeSettingSection={activeSettingSection}
          setActiveSettingSection={setActiveSettingSection}
          isVIntelligenceActive={isVIntelligenceActive}
          reimaginedSearchOpen={reimaginedSearchOpen}
          setReimaginedSearchOpen={setReimaginedSearchOpen}
          setShowAboutModal={setShowAboutModal}
          setShowCustomModal={setShowCustomModal}
          exportChannelsToM3u8={exportChannelsToM3u8}
          handleOpenMultiviewSelector={handleOpenMultiviewSelector}
          handleTogglePictureInPicture={handleTogglePictureInPicture}
          isMaterialDesignActive={isMaterialDesignActive}
          showClock={showClock}
          toggleShowClock={toggleShowClock}
          volume={volume}
          setVolume={setVolume}
          muted={muted}
          setMuted={setMuted}
          selectedChannel={selectedChannel}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          isDropdownIntelligenceActive={isDropdownIntelligenceActive}
          vIntelQuery={vIntelQuery}
          setVIntelQuery={setVIntelQuery}
          isVIntelLoading={isVIntelLoading}
          vIntelHistory={vIntelHistory}
          handleSendVIntelMsg={handleSendVIntelMsg}
          isAutoHideMenuBarActive={isAutoHideMenuBarActive}
          onSelectChannel={handleSelectChannel}
          userRole={roleSelection}
          onOpenLogoAdjustTest={() => setShowLogoAdjustModal(true)}
          onOpenYouTubeTool={() => setShowYouTubeToolModal(true)}
          onOpenWheelOfVplay={() => setShowWheelOfVplayModal(true)}
          isFocusMode={isFocusMode}
          setIsFocusMode={setIsFocusMode}
        />
      
      {/* Decorative ambient glowing circles */}
      {liquidGlass && !isMaterialDesignActive && !amoledDark && (
        <>
          <div className="absolute top-24 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute top-1/2 right-10 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[130px] pointer-events-none"></div>
          <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        </>
      )}

      {/* TV360 STYLE CINEMATIC HEADER (Floating on Top - Displays on ALL tabs) */}
      {(activeTab !== "settings" || activeSettingSection === null) && (
        <header className="fixed top-[40px] inset-x-0 h-24 z-50 px-4 sm:px-8 md:px-12 flex items-center justify-between pointer-events-auto select-none transition-all duration-150">
          {/* Progressive background blurs backplate - Only visible when scrolled down or when not on home tab */}
          <div className={`progressive-blur-header z-0 pointer-events-none border-b border-white/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.3)] ${
            isScrolled || activeTab !== "home" ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`} />

          <div className="relative z-10 flex items-center gap-6 sm:gap-8 lg:gap-12">
            {/* Brand Logo on the Left */}
            <div onClick={() => setActiveTab("home")} className="flex items-center gap-2 cursor-pointer group">
              <img 
                src="https://static.wikia.nocookie.net/ftv/images/a/ab/Imagexvxvz.png/revision/latest/scale-to-width-down/1000?cb=20260429082350&path-prefix=vi" 
                alt="Vplay Brand Logo"
                referrerPolicy="no-referrer"
                className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="hidden xs:inline-block font-sans font-black text-lg bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent uppercase tracking-wider select-none">360</span>
            </div>

            {/* Real-time Ticking Digital Clock */}
            {showClock && (
              <div className={`flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full select-none transition-all duration-300 font-google ${
                isMaterialDesignActive
                  ? "bg-[#ebdfff] text-[#21005d] shadow-md border-0"
                  : "bg-white/5 border border-white/10 backdrop-blur-md shadow-inner text-white hover:scale-105"
              }`}>
                <span className={`w-2 h-2 rounded-full animate-pulse animate-duration-1000 ${isMaterialDesignActive ? "bg-[#21005d]" : "bg-emerald-500"}`} />
                <span className={`text-xs sm:text-sm md:text-base font-bold tracking-wide font-google ${
                  isMaterialDesignActive ? "text-[#21005d]" : "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
                }`}>
                  {formatTime(time)}
                </span>
                <span className={`hidden md:inline-block text-xs sm:text-sm md:text-base font-bold pl-2.5 font-google ${
                  isMaterialDesignActive ? "text-[#21005d] border-l border-[#21005d]/20" : "text-white border-l border-white/10"
                }`}>
                  {formatDateVietnamese(time)}
                </span>
              </div>
            )}
          </div>

          {/* Right Side: notifications and profile card and Menu Dropdown */}
          <div className="relative z-10 flex items-center gap-3 sm:gap-4 md:gap-5">
            {/* Vplay Plugin Store ShoppingBag icon */}
            <button
              onClick={() => {
                setActiveTab("settings");
                setActiveSettingSection("plugin_store");
              }}
              className="relative group p-1.5 rounded-full hover:bg-white/10 text-white/85 hover:text-white transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-2 ring-transparent" />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-black/95 backdrop-blur-md border border-white/10 text-white text-[10px] sm:text-[11px] font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 whitespace-nowrap z-50 shadow-xl scale-95 group-hover:scale-100">
                Cửa hàng Plugin Vplay
              </div>
            </button>

            {/* Notification bell icon */}
            <button className="relative group p-1.5 rounded-full hover:bg-white/10 text-white/85 hover:text-white transition-all cursor-pointer">
              <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 ring-2 ring-transparent animate-pulse" />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-black/95 backdrop-blur-md border border-white/10 text-white text-[10px] sm:text-[11px] font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 whitespace-nowrap z-50 shadow-xl scale-95 group-hover:scale-100">
                Thông báo
              </div>
            </button>

            {/* User avatar displaying email info */}
            <div className="relative group/avatar flex items-center gap-2 cursor-pointer z-50">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-pink-500 via-indigo-600 to-teal-400 p-0.5 shadow-md">
                <div className="w-full h-full rounded-full bg-[#120e24] flex items-center justify-center select-none text-white">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90" />
                </div>
              </div>
              {/* Floating tooltip */}
              <div className="absolute top-full right-0 mt-2 pointer-events-none opacity-0 group-hover/avatar:opacity-100 transition-all duration-150 bg-black/95 backdrop-blur-md border border-white/10 rounded-lg px-2.5 py-1.5 shadow-xl text-[10px] sm:text-[11px] text-white/90 whitespace-nowrap z-50 scale-95 group-hover/avatar:scale-100">
                Tài khoản: <span className="font-extrabold text-pink-300">Premium Member</span>
              </div>
            </div>

            {/* Top Menu Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setShowDropdownMenu(prev => !prev)}
                className={`relative group transition-all cursor-pointer flex items-center justify-center active:scale-95 duration-200 ${
                  isMaterialDesignActive
                    ? "p-2 sm:p-2.5 rounded-[20px] bg-[#c9b2fa] hover:bg-[#dcd0ff] text-black border-0 shadow-lg"
                    : "p-1.5 sm:p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-white/85 hover:text-white"
                }`}
              >
                <Menu className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                <div className="absolute top-full right-0 mt-2 px-2.5 py-1.5 bg-black/95 backdrop-blur-md border border-white/10 text-white text-[10px] sm:text-[11px] font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 whitespace-nowrap z-50 shadow-xl scale-95 group-hover:scale-100">
                  Menu tùy chọn
                </div>
              </button>
              
              <AnimatePresence>
                {showDropdownMenu && (
                  <>
                    {/* Invisible Backdrop for click-away */}
                    <div className="fixed inset-0 z-40 cursor-default" onClick={() => setShowDropdownMenu(false)} />
                    
                    {isMaterialDesignActive ? (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        style={{ originX: 1, originY: 0 }}
                        transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                        className="absolute right-0 mt-3 w-64 rounded-[28px] bg-[#2b2930] border border-[#3d3a46] shadow-[0_8px_30px_rgb(0,0,0,0.5)] z-50 p-2 text-[#e6e1e5] overflow-hidden animate-fade-in"
                      >
                        {[
                          {
                            label: "Refresh & Reload",
                            icon: RefreshCw,
                            onClick: () => {
                              setShowDropdownMenu(false);
                              window.location.reload();
                            }
                          },
                          {
                            label: "Clock & Calendar",
                            icon: Clock,
                            active: showClock,
                            onClick: () => {
                              toggleShowClock();
                            }
                          },
                          {
                            label: "About Vplay",
                            icon: Info,
                            onClick: () => {
                              setShowDropdownMenu(false);
                              setShowAboutModal(true);
                            }
                          },
                          {
                            label: "Experimental Features",
                            icon: Pizza,
                            onClick: () => {
                              setShowDropdownMenu(false);
                              setActiveTab("settings");
                              setActiveSettingSection("experimental");
                            }
                          },
                          ...(activeTab === "live" || activeTab === "vtvgo" ? [
                            {
                              label: "Export Channels (M3U)",
                              icon: Download,
                              onClick: () => {
                                setShowDropdownMenu(false);
                                exportChannelsToM3u8();
                              }
                            }
                          ] : []),
                          ...(activeTab === "live" ? [
                            {
                              label: "Multiview Mode",
                              icon: Grid,
                              onClick: () => {
                                setShowDropdownMenu(false);
                                handleOpenMultiviewSelector();
                              }
                            },
                            {
                              label: "Picture in Picture",
                              icon: Layers,
                              onClick: () => {
                                setShowDropdownMenu(false);
                                handleTogglePictureInPicture();
                              }
                            }
                          ] : []),
                          {
                            label: "Settings",
                            icon: Settings,
                            onClick: () => {
                              setShowDropdownMenu(false);
                              setActiveTab("settings");
                              setActiveSettingSection(null);
                            }
                          }
                        ].map((item, idx) => {
                          const IconComp = item.icon;
                          const isToggledActive = "active" in item ? item.active : false;
                          return (
                            <button
                              key={idx}
                              onClick={item.onClick}
                              className="w-full px-4.5 py-3 text-left text-sm font-normal flex items-center gap-3.5 hover:bg-[#3d3a46]/80 active:bg-[#3d3a46] rounded-[18px] transition-colors cursor-pointer text-[#e6e1e5]"
                            >
                              <IconComp className="w-[18px] h-[18px] text-[#cac4d0] shrink-0" />
                              <span className="flex-1 text-[#e6e1e5] font-sans text-[14px]">{item.label}</span>
                              {isToggledActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#d0bcff] shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        style={{ originX: 1, originY: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 mt-3 w-56 rounded-[30px] bg-white/70 backdrop-blur-[15px] border border-white/40 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.35),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.1),0_12px_40px_rgba(0,0,0,0.1)] z-50 py-3.5 text-black overflow-hidden"
                      >
                        {/* Clock & Calendar toggle with checkmark */}
                        <button
                          onClick={() => {
                            toggleShowClock();
                          }}
                          className="w-full px-5 py-2.5 text-left text-[13px] hover:bg-black/5 flex items-center justify-between font-sans font-normal text-black"
                        >
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2.5 text-black/70 stroke-[2]" />
                            <span>menu.ClockAndCalendar.label</span>
                          </div>
                          {showClock && <Check className="w-4 h-4 text-black stroke-[3.5]" />}
                        </button>
                        
                        <div className="border-t border-black/10 my-2" />
                        
                        <button
                          onClick={() => {
                            setShowDropdownMenu(false);
                            setShowAboutModal(true);
                          }}
                          className="w-full px-5 py-2.5 text-left text-[13px] hover:bg-black/5 flex items-center text-black font-sans font-normal"
                        >
                          <Info className="w-4 h-4 mr-2.5 text-black/70 stroke-[2]" />
                          menu.AboutThisVersion.label
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowDropdownMenu(false);
                            window.location.reload();
                          }}
                          className="w-full px-5 py-2.5 text-left text-[13px] hover:bg-black/5 flex items-center text-black font-sans font-normal"
                        >
                          <RefreshCw className="w-4 h-4 mr-2.5 text-black/70 stroke-[2]" />
                          menu.ReloadApp.label
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowDropdownMenu(false);
                            setActiveTab("settings");
                            setActiveSettingSection("experimental");
                          }}
                          className="w-full px-5 py-2.5 text-left text-[13px] hover:bg-black/5 flex items-center text-black font-sans font-normal"
                        >
                          <Pizza className="w-4 h-4 mr-2.5 text-black/70 stroke-[2]" />
                          menu.Experimental.label
                        </button>
                        
                        {(activeTab === "live" || activeTab === "vtvgo") && (
                          <button
                            onClick={() => {
                              setShowDropdownMenu(false);
                              exportChannelsToM3u8();
                            }}
                            className="w-full px-5 py-2.5 text-left text-[13px] hover:bg-black/5 flex items-center text-black font-sans font-normal"
                          >
                            <Download className="w-4 h-4 mr-2.5 text-black/70 stroke-[2]" />
                            menu.ExportChannels.label
                          </button>
                        )}
                        
                        {activeTab === "live" && (
                          <>
                            <button
                              onClick={() => {
                                setShowDropdownMenu(false);
                                handleOpenMultiviewSelector();
                              }}
                              className="w-full px-5 py-2.5 text-left text-[13px] hover:bg-black/5 flex items-center text-black font-sans font-normal border-t border-black/5"
                            >
                              <Grid className="w-4 h-4 mr-2.5 text-black/70 stroke-[2]" />
                              menu.ViewMultiview.label
                            </button>
                            <button
                              onClick={() => {
                                setShowDropdownMenu(false);
                                handleTogglePictureInPicture();
                              }}
                              className="w-full px-5 py-2.5 text-left text-[13px] hover:bg-black/5 flex items-center text-black font-sans font-normal"
                            >
                              <Layers className="w-4 h-4 mr-2.5 text-black/70 stroke-[2]" />
                              menu.PictureInPicture.label
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => {
                            setShowDropdownMenu(false);
                            setActiveTab("settings");
                            setActiveSettingSection(null);
                          }}
                          className="w-full px-5 py-2.5 text-left text-[13px] hover:bg-black/5 flex items-center text-black font-sans font-normal"
                        >
                          <Settings className="w-4 h-4 mr-2.5 text-black/70 stroke-[2]" />
                          menu.OpenSettings.label
                        </button>
                      </motion.div>
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>
      )}

      {/* SETTINGS DETAILS HEADER (Floating on Top - Exclusively inside settings sub-sections) */}
      {activeTab === "settings" && activeSettingSection !== null && (
        <header className="fixed top-[40px] inset-x-0 h-24 z-50 px-4 sm:px-8 md:px-12 flex items-center justify-between pointer-events-auto select-none">
          {/* Progressive background blurs backplate */}
          <div className="progressive-blur-header z-0 pointer-events-none border-b border-white/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.3)] opacity-100 visible" />

          <div className="relative z-10 flex items-center gap-4">
            <button
              onClick={() => setActiveSettingSection(null)}
              className={`flex items-center justify-center w-10 h-10 bouncy-btn cursor-pointer transition-all ${
                isMaterialDesignActive
                  ? "rounded-[20px] bg-[#381e72] hover:bg-[#4f378b] text-[#d0bcff] border-0 shadow-lg"
                  : "rounded-full bg-white/10 hover:bg-white/20 text-white/95 hover:text-white border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)]"
              }`}
              title="Back"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <span className="text-white font-semibold text-base sm:text-lg tracking-tight">
              {activeSettingSection === "plugin_store" && "Vplay Plugin Store (PREVIEW)"}
              {activeSettingSection === "appearance" && "Appearance"}
              {activeSettingSection === "profile" && "Account & Data"}
              {activeSettingSection === "accessibility" && "Accessibility"}
              {activeSettingSection === "broadcast" && "Broadcast"}
              {activeSettingSection === "experimental" && "Experimental & New Features"}
              {activeSettingSection === "design_system" && "Vplay Design System"}
              {activeSettingSection === "custom_tab" && "Create Custom Tab"}
              {activeSettingSection === "custom_modal" && "Create Custom Modal"}
            </span>
          </div>
        </header>
      )}

      {/* Main Container */}
      <main id="player-anchor" className={activeTab === "home" ? "w-full pt-0 z-10 relative" : "w-full max-w-7xl mx-auto px-4 pt-24 lg:pt-28 pb-8 z-10 relative"}>

        {/* VIEW: LIVE TV BROADCASTING (PRIMARY GRAPHICS) */}
        {(activeTab === "live" || activeTab === "search") && (
          <>
            {/* Sticky Player, Action Buttons & Category Filters on Mobile */}
            <div className="sticky top-24 lg:relative lg:top-auto z-40 bg-[#07050f]/80 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none -mx-4 px-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 border-b lg:border-none border-white/5 shadow-[0_15px_30px_rgba(0,0,0,0.4)] lg:shadow-none pt-2 pb-2 lg:pb-0 animate-duration-300">
              {/* Progressive vintage blur backplate for high-fidelity glass appearance on mobile sticky */}
              <div className="absolute inset-0 progressive-blur-header opacity-100 lg:hidden pointer-events-none" />

              <div className="relative z-10">
                {/* Integrated Main Channel Video Player */}
                {isPiPActive ? (
                  <div className="w-full max-w-5xl mx-auto aspect-video rounded-3xl bg-[#120e24]/40 border border-white/10 flex flex-col items-center justify-center text-white/60 p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
                    <div className="absolute inset-0 bg-cover bg-center opacity-10 filter blur-xl" style={{ backgroundImage: `url(${selectedChannel.logoImg || ""})` }} />
                    <Tv className="w-12 h-12 mb-4 text-indigo-400 animate-pulse" />
                    <p className="text-sm font-semibold text-white/90 mb-1">Playing in Picture-in-Picture mode</p>
                    <p className="text-xs text-white/50 mb-4 font-mono">{selectedChannel.name}</p>
                    <button
                      onClick={() => setIsPiPActive(false)}
                      className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all bouncy-btn shadow-lg cursor-pointer"
                    >
                      Back to main player
                    </button>
                  </div>
                ) : isMultiviewMode ? (
                  <div className="w-full max-w-5xl mx-auto aspect-video rounded-3xl bg-[#07050f]/40 border border-white/10 p-2 sm:p-4 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                    {/* Multiview top info and action bar */}
                    <div className="flex items-center justify-between mb-3 text-white">
                      <div className="flex items-center gap-2">
                        <Grid className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs sm:text-sm font-medium">Multiview mode ({multiviewCount} screens)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowMultiviewSelectorPopup(true)}
                          className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-[11px] font-normal transition-colors cursor-pointer"
                        >
                          Change Layout
                        </button>
                        <button
                          onClick={() => {
                            setIsMultiviewMode(false);
                            setMultiviewChannels([]);
                          }}
                          className="px-3 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[11px] font-normal border border-red-500/30 transition-colors cursor-pointer"
                        >
                          Exit Multiview
                        </button>
                      </div>
                    </div>

                    {/* Multiview Grid */}
                    <div className={`grid ${getGridColsClass(multiviewCount)} gap-2 flex-1 h-full min-h-0`}>
                      {Array.from({ length: multiviewCount }).map((_, idx) => {
                        const ch = multiviewChannels[idx];
                        return (
                          <div
                            key={idx}
                            className="relative aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/5 flex flex-col items-center justify-center group"
                          >
                            {ch ? (
                              <div className="w-full h-full relative">
                                <div className="absolute top-2 left-2 z-30 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white/90 truncate max-w-[60%] font-mono">
                                  Frame {idx + 1}: {ch.name}
                                </div>
                                <div className="absolute top-2 right-2 z-30 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenChannelPickerForSlot(idx);
                                    }}
                                    className="p-1 bg-black/70 hover:bg-black/95 text-white rounded text-[10px]"
                                    title="Change Channel"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveChannelFromSlot(idx);
                                    }}
                                    className="p-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px]"
                                    title="Delete Channel"
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
                                onClick={() => handleOpenChannelPickerForSlot(idx)}
                                className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/50 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] transition-all duration-200 cursor-pointer p-4 select-none"
                              >
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                  <Plus className="w-5 h-5 text-white/60 group-hover:text-white" />
                                </div>
                                <span className="text-xs font-normal">Frame {idx + 1} empty</span>
                                <span className="text-[10px] text-white/40">Click to select channel</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
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
                    onToggleFavorite={() => toggleFavorite(selectedChannel.id)}
                    isMaterialDesignActive={isMaterialDesignActive}
                    onPlaybackError={(err, isTimeout) => {
                      setPlaybackError(err);
                      if (err) {
                        setPlaybackErrorType(isTimeout ? "timeout" : "standard");
                      } else {
                        setPlaybackErrorType(null);
                      }
                    }}
                  />
                )}

                {/* Live tab Actions Button Bar - Placed perfectly under the channel player exactly as requested */}
                <div className="w-full max-w-5xl mx-auto mt-3 sm:mt-5 flex items-center justify-center gap-2 sm:gap-3 z-10 relative px-2">
                  {/* Share button */}
                  <button
                    onClick={handleShareChannel}
                    className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white flex items-center gap-1 sm:gap-1.5 shrink-0 shadow-lg cursor-default bouncy-btn text-[10.5px] sm:text-xs font-normal"
                    title="Share this channel"
                  >
                    <img 
                      src="https://static.wikia.nocookie.net/ep-deo/images/1/10/Share.png/revision/latest?cb=20260625011333" 
                      className="w-3 sm:w-3.5 h-3 sm:h-3.5 brightness-0 invert opacity-90 object-contain" 
                      referrerPolicy="no-referrer"
                      alt="Share"
                    />
                    <span>Share</span>
                  </button>

                  {/* TV button */}
                  <a
                    href={selectedChannel?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white flex items-center gap-1 sm:gap-1.5 shrink-0 shadow-lg cursor-default bouncy-btn animate-fade-in text-[10.5px] sm:text-xs font-normal"
                    title="Open Original Stream"
                  >
                    <Tv className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white opacity-90" />
                    <span>Open Stream</span>
                  </a>

                  {/* Channels button (Focus Mode only) */}
                  {isFocusMode && (
                    <button
                      onClick={() => setShowFocusChannelsModal(true)}
                      className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 sm:gap-1.5 shrink-0 shadow-lg cursor-default bouncy-btn text-[10.5px] sm:text-xs font-semibold animate-pulse"
                      title="Open Channels List"
                    >
                      <Tv className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" />
                      <span>Channels</span>
                    </button>
                  )}

                  {/* Add custom channel button */}
                  <button
                    onClick={() => setShowCustomModal(true)}
                    className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-[#ff9502] hover:bg-[#ffa31a] active:bg-[#e08300] text-white border-none text-[10.5px] sm:text-xs font-normal flex items-center gap-1 sm:gap-1.5 shrink-0 shadow-lg shadow-orange-500/15 cursor-default bouncy-btn"
                    title="Add your own m3u8 link"
                  >
                    <Plus className="w-3 sm:w-3.5 h-3 sm:h-3.5 transition-transform duration-300 hover:rotate-90" />
                    <span>Add Channel</span>
                  </button>
                </div>

                {/* Glass Category Filter row - Nested inside sticky container so it stays hard locked on mobile */}
                {!isFocusMode && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 mt-3 mb-1 lg:mb-6 lg:pb-4 lg:mt-4 border-b lg:border-none border-white/5 scrollbar-none">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-normal whitespace-nowrap cursor-default bouncy-btn ${
                        selectedCategory === "all" ? "glass-pill-active" : "glass-pill text-white/60 hover:text-white"
                      }`}
                    >
                      All ({flattenedChannels.length})
                    </button>
                    
                    {allAvailableCategoryList.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-normal whitespace-nowrap cursor-default bouncy-btn ${
                          selectedCategory === cat.id ? "glass-pill-active" : "glass-pill text-white/60 hover:text-white"
                        }`}
                      >
                        {cat.name} ({cat.channels.length})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CHANNELS ACCORDION LIST matching reference screenshot specs */}
            {!isFocusMode && (
              <div className="flex flex-col gap-10">
              {filteredCategories.length === 0 ? (
                <div className="py-20 text-center glass-panel rounded-2xl border border-white/10 max-w-xl mx-auto">
                  <HelpCircle className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/80 font-medium">No matching channels found</p>
                  <p className="text-white/40 text-xs mt-1">Try searching with another keyword or add a new m3u8 stream link.</p>
                </div>
              ) : (
                filteredCategories.map((category) => (
                  <div key={category.id} className="relative animate-fade-in-up">
                    
                    {/* Category Title matching layout like VTV or VTVCAB with Thick vertical bar indicator */}
                    <div className="flex items-center justify-between mb-5 select-none">
                      <div className="flex items-center gap-3">
                        {/* Custom visual thick turquoise or fuchsia vertical colored sidebars */}
                        <div className={`w-1.5 h-7 rounded-full ${
                          category.id === 'dac-biet' ? 'bg-emerald-500 animate-pulse' :
                          category.id === 'vtv' ? 'bg-cyan-400' :
                          category.id === 'vtvcab' ? 'bg-fuchsia-500' :
                          category.id === 'sctv' ? 'bg-red-500' :
                          category.id === 'htv' ? 'bg-orange-500' :
                          category.id === 'quoc-te' ? 'bg-amber-400' : 'bg-pink-500'
                        }`} />
                        <h2 className="text-xl font-extrabold tracking-tight text-white/95 uppercase drop-shadow-sm font-sans">
                          {category.name}
                        </h2>
                      </div>
                      
                      {/* Count badge in gray glass pill like in image */}
                      <span className="text-xs bg-white/5 border border-white/10 text-white/50 px-3 py-1 rounded-full font-mono">
                        {category.channels.length} Channels
                      </span>
                    </div>

                    {/* Channels responsive grid aligned properly: exactly 3 columns on mobile and 5 columns on desktop */}
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
                      {category.channels.map((ch) => {
                        const isPlaying = selectedChannel.id === ch.id;
                        const isDacBiet = ch.group === "Đặc biệt";

                        return (
                          <div
                            key={ch.id}
                            id={`card-${ch.id}`}
                            onClick={() => handleSelectChannel(ch)}
                            className={`group relative rounded-xl p-0.5 sm:p-1 cursor-pointer flex items-center justify-center h-[72px] xs:h-[88px] sm:h-[112px] md:h-[128px] select-none ${
                              isMaterialDesignActive
                                ? isPlaying
                                  ? "bg-[#c9b2fa]/20 border-0 shadow-lg"
                                  : "bg-[#36343b] hover:bg-[#49454f] border-0"
                                : (isPlaying 
                                    ? isDacBiet
                                      ? "bg-amber-400/10 backdrop-blur-lg border-[3.5px] border-amber-400"
                                      : "bg-white/20 backdrop-blur-lg border-[3.5px] border-white shadow-md shadow-pink-500/10" 
                                    : isDacBiet
                                      ? "bg-amber-500/5 backdrop-blur-md border-2 border-white/10 hover:border-[3.5px] hover:border-amber-400"
                                      : "bg-white/5 backdrop-blur-md border-2 border-white/10 hover:border-[3.5px] hover:border-white"
                                  )
                            }`}
                          >
                            {/* Stable Channel Number Badge */}
                            {channelNumberMap[ch.id] && (
                              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/85 backdrop-blur-md text-[9px] font-mono font-bold text-[#d0bcff]/90 border border-white/10 z-20 select-none shadow-md">
                                {channelNumberMap[ch.id]}
                              </div>
                            )}
                            {/* Premium Custom Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-black/95 backdrop-blur-md border border-white/10 text-white text-[10px] sm:text-[11px] font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 whitespace-nowrap z-[60] shadow-xl scale-95 group-hover:scale-100">
                              {t(ch.name)}
                            </div>
                            {/* Logo Graphic Container - fills the box completely */}
                            <div className="w-full h-full flex justify-center items-center overflow-hidden rounded-lg">
                              {ch.logoImg ? (
                                <img
                                  src={ch.logoImg}
                                  alt={ch.name}
                                  referrerPolicy="no-referrer"
                                  className={getLogoImgClass(ch, "grid")}
                                />
                              ) : (
                                <div className={getLogoTextClass(ch)}>
                                   {ch.logoText}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
            )}
          </>
        )}

        {/* VIEW: HOME TRANSITION (TỔNG QUAN) */}
        {activeTab === "home" && (
          <div className="w-full animate-fade-in space-y-0 bg-[#07050f]/60 min-h-screen relative pt-0">
            
            {/* TRULY IMMERSIVE HERO BIG BANNER (TV360 STYLE - 100% SCREEN-WIDE BLEED WITH NO ROUNDED CORNERS) */}
            <div className="relative w-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-black min-h-[520px] sm:min-h-[640px] md:min-h-[720px] lg:min-h-[820px] flex items-end pb-6 sm:pb-8 md:pb-10 lg:pb-12 group/hero">
              
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
                    {!isFocusMode && (
                      <img 
                        src={homeSlides[currentSlide].thumbnail} 
                        alt={homeSlides[currentSlide].titleMain} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center md:object-right scale-102"
                      />
                    )}
                    
                    {/* Advanced Multi-Layer Vignette Overlays that match the thumbnail color dynamically */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${homeSlides[currentSlide].vignetteLeft} z-10`} />
                    <div className={`absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t ${homeSlides[currentSlide].vignetteBottom} z-10`} />
                    <div className={`absolute inset-x-0 top-0 h-44 bg-gradient-to-b ${homeSlides[currentSlide].vignetteTop} z-10`} />
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
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-start gap-1 w-full"
                  >
                    {/* Calligraphy logo and title text stylistics with Google Sans font */}
                    <div className="flex flex-col select-none mb-3 font-google gap-0.5">
                      <div className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-zinc-300 drop-shadow-[0_4px_15px_rgba(0,0,0,0.95)] font-google">
                        {homeSlides[currentSlide].titleTop}
                      </div>
                      <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide leading-none text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-400 drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)] -mt-1 font-google">
                        {homeSlides[currentSlide].titleMain}
                      </div>
                      {homeSlides[currentSlide].titleSub && (
                        <div className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-white drop-shadow tracking-wide mt-0.5 text-transparent bg-clip-text bg-gradient-to-r from-[#00ffcc] to-teal-300 font-google">
                          {homeSlides[currentSlide].titleSub}
                        </div>
                      )}
                    </div>

                    {/* Special Channel Logo instead of slogans */}
                    {homeSlides[currentSlide].logo && (
                      <div className="mt-1 mb-2 select-none pointer-events-none">
                        <img 
                          src={homeSlides[currentSlide].logo} 
                          alt="Channel Logo" 
                          referrerPolicy="no-referrer"
                          className="h-10 sm:h-14 md:h-16 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]"
                        />
                      </div>
                    )}

                    {homeSlides[currentSlide].description && (
                      <p className="text-white/80 text-xs sm:text-sm max-w-2xl mt-4 leading-relaxed drop-shadow select-none">
                        {renderDescription(homeSlides[currentSlide].description)}
                      </p>
                    )}

                    {homeSlides[currentSlide].showCountdown && (
                      <div className="flex flex-col gap-1.5 mt-4 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-3 rounded-2xl select-none max-w-xs shadow-lg">
                        <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Time remaining for the event</span>
                        <div className="flex items-center gap-1.5 font-mono text-base sm:text-lg font-extrabold text-teal-400">
                          <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-lg shadow-inner">{countdown.days}d</span>
                          <span className="text-white/40">:</span>
                          <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-lg shadow-inner">{countdown.hours}h</span>
                          <span className="text-white/40">:</span>
                          <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-lg shadow-inner">{countdown.minutes}m</span>
                          <span className="text-white/40">:</span>
                          <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-lg shadow-inner">{countdown.seconds}s</span>
                        </div>
                      </div>
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
                      const targetCh = CATEGORIES.flatMap(cat => cat.channels).find(ch => ch.id === slideObj.channelId) || CATEGORIES[0].channels[0];
                      if (targetCh) {
                        handleSelectChannel({
                          ...targetCh,
                          name: slideObj.channelPlayName,
                        });
                      }
                      setActiveTab("live");
                    }}
                     className={`px-8 sm:px-10 py-3 sm:py-4 rounded-full font-normal shadow-xl flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer border transition-all duration-200 ${
                       isMaterialDesignActive
                         ? "bg-[#d0bcff] hover:bg-[#ebdfff] border-0 shadow-lg text-black"
                         : "bg-red-600 hover:bg-red-700 border-red-500/10 shadow-red-600/30 text-white bouncy-btn"
                     }`}
                  >
                    {homeSlides[currentSlide].btnIcon === "compass" ? (
                      <Compass className={`w-4.5 h-4.5 ${isMaterialDesignActive ? "text-black" : "text-white"}`} />
                    ) : (
                      <Play className={`w-4.5 h-4.5 ${isMaterialDesignActive ? "fill-black text-black" : "fill-white text-white"}`} />
                    )}
                    {homeSlides[currentSlide].btnText || "Watch now"}
                  </button>

                  {/* Slider indicator arrows and paging inside the banner */}
                  <div className="flex items-center gap-1.5 ml-2">
                    <button 
                      onClick={() => setCurrentSlide(prev => (prev - 1 + homeSlides.length) % homeSlides.length)}
                      className={isMaterialDesignActive
                        ? "w-9 h-9 rounded-full bg-[#c9b2fa] hover:bg-[#dcd0ff] text-black flex items-center justify-center cursor-pointer bouncy-btn border-0 shadow-lg"
                        : "w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer flex items-center justify-center border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] bouncy-btn"
                      }
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setCurrentSlide(prev => (prev + 1) % homeSlides.length)}
                      className={isMaterialDesignActive
                        ? "w-9 h-9 rounded-full bg-[#c9b2fa] hover:bg-[#dcd0ff] text-black flex items-center justify-center cursor-pointer bouncy-btn border-0 shadow-lg"
                        : "w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer flex items-center justify-center border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] bouncy-btn"
                      }
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
                        currentSlide === idx ? "w-5 bg-red-500" : "w-1.5 bg-white/25 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>

              </div>
            </div>

            {/* LOWER CONTENT SECTIONS (NESTED SAFELY IN MAX-W-7XL MX-AUTO WITH SPACING FOR PERFECT DESIGN COHESION) */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-8 space-y-12">

            {/* ROW: "GỢI Ý CHO BẠN" CAROUSEL SLIDER (ADDED ABOVE KÊNH YÊU THÍCH AS REQUESTED) */}
            {recommendedChannels.length > 0 && (
              <div className="space-y-4 relative group/reco-carousel animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 rounded bg-blue-500" />
                    <h3 className="text-sm sm:text-base font-bold tracking-tight text-white/95 font-google">home.categories.SuggestForYou.name</h3>
                    <span className="text-xs text-blue-400/80 font-mono mt-1">({recommendedChannels.length})</span>
                  </div>

                  {/* Navigation Arrows for Carousel */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setRecoRefreshTrigger(prev => prev + 1)}
                      className={isMaterialDesignActive
                        ? "w-8 h-8 rounded-full bg-[#c9b2fa] hover:bg-[#dcd0ff] text-white flex items-center justify-center mr-1 group/refresh-btn bouncy-btn border-0 shadow-lg"
                        : "w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer flex items-center justify-center border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] mr-1 group/refresh-btn bouncy-btn"
                      }
                      title="Làm mới gợi ý"
                    >
                      <RefreshCw className="w-3.5 h-3.5 group-hover/refresh-btn:rotate-180 transition-transform duration-500" />
                    </button>
                    <button 
                      onClick={() => scrollRecommendations("left")}
                      className={isMaterialDesignActive
                        ? "w-8 h-8 rounded-full bg-[#c9b2fa] hover:bg-[#dcd0ff] text-white flex items-center justify-center cursor-pointer bouncy-btn border-0 shadow-lg"
                        : "w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer flex items-center justify-center border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] bouncy-btn"
                      }
                      title="Quay lại"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => scrollRecommendations("right")}
                      className={isMaterialDesignActive
                        ? "w-8 h-8 rounded-full bg-[#c9b2fa] hover:bg-[#dcd0ff] text-white flex items-center justify-center cursor-pointer bouncy-btn border-0 shadow-lg"
                        : "w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer flex items-center justify-center border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] bouncy-btn"
                      }
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
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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
                            isMaterialDesignActive
                              ? isPlaying
                                ? "bg-[#c9b2fa]/20 border-0 shadow-lg"
                                : "bg-[#36343b] hover:bg-[#49454f] border-0"
                              : (isPlaying 
                                  ? "bg-white/20 backdrop-blur-lg border-[3.5px] border-white shadow-md shadow-pink-500/10" 
                                  : "bg-white/5 backdrop-blur-md border-2 border-white/10 hover:border-[3.5px] hover:border-white"
                                )
                          }`}
                        >
                          {/* Stable Channel Number Badge */}
                          {channelNumberMap[ch.id] && (
                            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/85 backdrop-blur-md text-[8px] font-mono font-bold text-[#d0bcff]/90 border border-white/10 z-20 select-none shadow-md">
                              {channelNumberMap[ch.id]}
                            </div>
                          )}
                          {/* Premium Custom Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-black/95 backdrop-blur-md border border-white/10 text-white text-[10px] sm:text-[11px] font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 whitespace-nowrap z-[60] shadow-xl scale-95 group-hover:scale-100">
                            {t(ch.name)}
                          </div>
                          {/* Logo Graphic Container - fills the box completely */}
                          <div className="w-full h-full flex justify-center items-center overflow-hidden rounded-lg">
                            {ch.logoImg ? (
                              <img
                                src={ch.logoImg}
                                alt={ch.name}
                                referrerPolicy="no-referrer"
                                className={getLogoImgClass(ch, "carousel")}
                              />
                            ) : (
                              <div className={getLogoTextClass(ch)}>
                                {ch.logoText}
                              </div>
                            )}
                          </div>
                      
                          {/* Heart/Fav Button overlay (shown on top corner) */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(ch.id, e);
                            }}
                            className="absolute top-1 right-1 p-1 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/90 hover:scale-110 active:scale-120 duration-200"
                            title={isFav ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                          >
                            {isMaterialDesignActive ? (
                              <ThumbsUp className={`w-3.5 h-3.5 ${isFav ? "text-[#d0bcff] fill-[#d0bcff]" : "text-white/70 hover:text-white"}`} />
                            ) : (
                              <Heart className={`w-3.5 h-3.5 ${isFav ? "text-red-500 fill-red-500" : "text-white/70 hover:text-white"}`} />
                            )}
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
                    <h3 className="text-sm sm:text-base font-bold tracking-tight text-white/95 font-google">home.categories.Favorited.name</h3>
                    <span className="text-xs text-amber-400/80 font-mono mt-1">({favoriteChannelsList.length})</span>
                  </div>

                  {/* Navigation Arrows for Carousel */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => scrollFavorites("left")}
                      className={isMaterialDesignActive
                        ? "w-8 h-8 rounded-full bg-[#c9b2fa] hover:bg-[#dcd0ff] text-white flex items-center justify-center transition-all cursor-pointer border-0 shadow-lg"
                        : "w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-120 shadow"
                      }
                      title="Quay lại"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => scrollFavorites("right")}
                      className={isMaterialDesignActive
                        ? "w-8 h-8 rounded-full bg-[#c9b2fa] hover:bg-[#dcd0ff] text-white flex items-center justify-center transition-all cursor-pointer border-0 shadow-lg"
                        : "w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-120 shadow"
                      }
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
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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
                            isMaterialDesignActive
                              ? isPlaying
                                ? "bg-[#c9b2fa]/20 border-0 shadow-lg"
                                : "bg-[#36343b] hover:bg-[#49454f] border-0"
                              : (isPlaying 
                                  ? "bg-white/20 backdrop-blur-lg border-[3.5px] border-white shadow-md shadow-pink-500/10" 
                                  : "bg-white/5 backdrop-blur-md border-2 border-white/10 hover:border-[3.5px] hover:border-white"
                                )
                          }`}
                        >
                          {/* Stable Channel Number Badge */}
                          {channelNumberMap[ch.id] && (
                            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/85 backdrop-blur-md text-[8px] font-mono font-bold text-[#d0bcff]/90 border border-white/10 z-20 select-none shadow-md">
                              {channelNumberMap[ch.id]}
                            </div>
                          )}
                          {/* Premium Custom Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-black/95 backdrop-blur-md border border-white/10 text-white text-[10px] sm:text-[11px] font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 whitespace-nowrap z-[60] shadow-xl scale-95 group-hover:scale-100">
                            {t(ch.name)}
                          </div>
                          {/* Logo Graphic Container - fills the box completely */}
                          <div className="w-full h-full flex justify-center items-center overflow-hidden rounded-lg">
                            {ch.logoImg ? (
                              <img
                                src={ch.logoImg}
                                alt={ch.name}
                                referrerPolicy="no-referrer"
                                className={getLogoImgClass(ch, "carousel")}
                              />
                            ) : (
                              <div className={getLogoTextClass(ch)}>
                                {ch.logoText}
                              </div>
                            )}
                          </div>
                      
                          {/* Heart/Unfav Button overlay (shown on top corner or toggleable) */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(ch.id, e);
                            }}
                            className="absolute top-1 right-1 p-1 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/90 hover:scale-110 active:scale-120 duration-200"
                            title="Xóa khỏi yêu thích"
                          >
                            {isMaterialDesignActive ? (
                              <ThumbsUp className="w-3.5 h-3.5 text-[#d0bcff] fill-[#d0bcff]" />
                            ) : (
                              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}



            {/* Quick stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center pt-2">
              {[
                { label: "National Channels", value: "13 VTV HD", color: "text-cyan-400" },
                { label: "News & Entertainment", value: "19 VTVCab", color: "text-fuchsia-400" },
                { label: "HCM City & Premium", value: "15 HTV HD", color: "text-orange-400" },
                { label: "Local & Radio", value: "Almost 70+", color: "text-teal-400" },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col justify-center">
                  <span className="text-xs text-white/50">{stat.label}</span>
                  <span className={`text-lg font-extrabold mt-1.5 ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Feature guides */}
            <div className="p-6 rounded-2xl glass-panel border border-white/12">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-pink-400" /> User Guide & Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-white/70">
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">1. Select a live channel</h4>
                  <p className="leading-relaxed text-xs text-white/60">Click on any channel card to tune into its live stream under the 'Live' tab.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">2. Favorites Library</h4>
                  <p className="leading-relaxed text-xs text-white/60">Click the star icon on any channel card to save it to your Favorites, displaying instantly on this Home page.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">3. Custom m3u8 Playlist</h4>
                  <p className="leading-relaxed text-xs text-white/60">Click the 'Add Channel' button next to search to seamlessly import your own custom m3u8 playlists.</p>
                </div>
              </div>
            </div>

            </div>
          </div>
        )}

        {/* VIEW: CUSTOM TABS PAGE */}
        {customTabs.some(t => t.id === activeTab) && (
          <div className="space-y-6 text-white max-w-4xl mx-auto py-4 animate-fade-in text-left">
            {(() => {
              const currentCustomTab = customTabs.find(t => t.id === activeTab)!;
              if (!currentCustomTab) return null;
              const TabIcon = ICON_REGISTRY[currentCustomTab.iconName] || Sparkles;
              return (
                <div className="space-y-6 bg-white/10 backdrop-blur-[10px] rounded-[15px] p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 text-white">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 flex items-center justify-center bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
                        <TabIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{currentCustomTab.name}</h2>
                        <p className="text-xs text-white/50">Visual interface of your custom-designed Tab</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        try {
                          const runFn = new Function(
                            "setSelectedChannel",
                            "setActiveTab",
                            "favorites",
                            "setFavorites",
                            "playbackError",
                            "setPlaybackError",
                            currentCustomTab.code
                          );
                          runFn(
                            setSelectedChannel,
                            setActiveTab,
                            favorites,
                            setFavorites,
                            playbackError,
                            setPlaybackError
                          );
                        } catch (err: any) {
                          alert(`Script execution error: ${err.message}`);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs transition-colors shadow-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Run Function
                    </button>
                  </div>

                  {currentCustomTab.htmlContent ? (
                    <div 
                      className="p-4 rounded-2xl bg-black/30 border border-white/5 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: currentCustomTab.htmlContent }}
                    />
                  ) : (
                    <div className="p-6 rounded-2xl bg-black/20 border border-white/5 text-center text-sm text-white/40">
                      No HTML content defined. Click the 'Run Function' button above to initialize your logic script.
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <div className="text-[10px] text-white/40 font-mono font-bold tracking-wider uppercase">Saved Script</div>
                    <pre className="text-xs font-mono text-emerald-400 overflow-x-auto bg-black/40 p-3 rounded-lg max-h-48 scrollbar-thin">
                      {currentCustomTab.code}
                    </pre>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* VIEW: SETTINGS PAGE */}
        {activeTab === "settings" && (
          <div className="max-w-5xl mx-auto py-4 animate-fade-in font-sans">
            <AnimatePresence mode="wait">
              {!activeSettingSection ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-3"
                >
                  {/* Storage Info Bar */}
                  <div className={`p-5 rounded-[15px] border ${
                    isMaterialDesignActive 
                      ? "bg-[#211f26] border-[#49454f] text-[#e6e1e5]" 
                      : "bg-white/5 border-white/10 backdrop-blur-[20px] text-white"
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <HardDrive className={`w-5 h-5 ${currentStorageUsed >= 2.8 ? "text-red-400 animate-pulse" : currentStorageUsed >= 2.0 ? "text-amber-400" : "text-indigo-400"}`} />
                        <span className="font-semibold text-sm">Ổ cứng lưu trữ Vplay</span>
                      </div>
                      <span className="text-xs font-mono font-medium opacity-90">
                        {currentStorageUsed.toFixed(2)} GB / 3.00 GB
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden mb-4 relative">
                      <div 
                        className={`h-full transition-all duration-500 ease-out rounded-full ${
                          currentStorageUsed >= 2.8 
                            ? "bg-gradient-to-r from-red-500 to-rose-600" 
                            : currentStorageUsed >= 2.0 
                              ? "bg-gradient-to-r from-amber-500 to-orange-600" 
                              : "bg-gradient-to-r from-indigo-500 to-purple-600"
                        }`}
                        style={{ width: `${(currentStorageUsed / 3.00) * 100}%` }}
                      />
                    </div>

                    {/* Storage Breakdowns & Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/5">
                      <div className="text-[11px] opacity-70 space-y-0.5">
                        <span className="block font-medium">Chi tiết sử dụng:</span>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          <span>Hệ thống: 0.15GB</span>
                          {dynamicMotion && <span className="text-indigo-300">Dynamic Motion: 0.55GB</span>}
                          {isMultiviewMode && <span className="text-purple-300">Multiview: 0.95GB</span>}
                          {plugins.map(p => {
                            if (p.status === "installed") {
                              const weight = p.id === "liquid_glass" ? 1.20 : p.id === "remove_shiny_border" ? 0.35 : 0.45;
                              return <span key={p.id} className="text-emerald-300">{p.name}: {weight}GB</span>;
                            }
                            return null;
                          })}
                        </div>
                      </div>

                      <button
                        onClick={handleCleanStorage}
                        className={`px-4 py-2 rounded-full font-semibold text-xs transition-all active:scale-95 cursor-default flex items-center gap-1.5 shrink-0 ${
                          isMaterialDesignActive
                            ? "bg-[#d0bcff] hover:bg-[#bfa8eb] text-[#381e72]"
                            : "bg-[#007aff] hover:bg-[#0066d6] text-white shadow-md"
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Dọn dẹp ổ cứng
                      </button>
                    </div>
                  </div>

                  {/* Project Details Banner */}
                  <div className="bg-white/10 backdrop-blur-[20px] rounded-[15px] p-5 sm:p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] border border-white/10 flex flex-col gap-4 relative overflow-hidden mb-4">
                    <div className="space-y-3 z-10 w-full">
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none">
                        Project Vplay Refresh
                      </h2>
                      <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-white/80">
                        <div className="flex items-center gap-2">
                          <Pen className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2.5]" />
                          <span className="font-normal text-white/70">Version: <strong className="text-white font-semibold">26.8.1 (Beta)</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-amber-400 shrink-0 stroke-[2.5]" />
                          <span className="font-normal text-white/70">Author: <strong className="text-white font-semibold">VNRT</strong></span>
                        </div>
                        <div className="flex items-start gap-2 leading-relaxed">
                          <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 fill-rose-500/15 stroke-[2.5]" />
                          <span className="text-white/70">
                            Supporters: <strong className="text-white font-medium">FTV OFFICIAL, HMG, DHA, - Bsod999, Myyer, Nquinanh, TV Archive Official</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* A subtle absolute glowing visual behind */}
                    <div className="absolute right-0 bottom-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                  </div>

                  {[
                    {
                      id: "plugin_store",
                      title: "settings.sections.PluginStore.title",
                      subtitle: "settings.sections.PluginStore.subtitle",
                      icon: ShoppingBag,
                    },
                    {
                      id: "profile",
                      title: "settings.sections.Profile.title",
                      subtitle: "settings.sections.Profile.subtitle",
                      icon: User,
                    },
                    {
                      id: "appearance",
                      title: "settings.sections.Appearance.title",
                      subtitle: "settings.sections.Appearance.subtitle",
                      icon: Palette,
                    },
                    {
                      id: "accessibility",
                      title: "settings.sections.Accessibility.title",
                      subtitle: "settings.sections.Accessibility.subtitle",
                      icon: Sliders,
                    },
                    {
                      id: "broadcast",
                      title: "settings.sections.Broadcast.title",
                      subtitle: "settings.sections.Broadcast.subtitle",
                      icon: Tv,
                    }
                  ].map((sec) => {
                    const IconComp = sec.icon;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => setActiveSettingSection(sec.id)}
                        className="w-full text-left bg-white/10 backdrop-blur-[10px] rounded-[15px] py-4.5 px-5 sm:py-5.5 sm:px-6 flex items-center gap-3.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border-[3px] border-white/10 hover:border-white text-white cursor-default"
                      >
                        <div className="w-10 h-10 flex items-center justify-center shrink-0 text-white">
                          <IconComp className="w-6 h-6 stroke-[1.8]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-white tracking-tight">{t(sec.title)}</h3>
                          <p className="text-[11.5px] sm:text-xs text-white/60 mt-0.5 leading-relaxed truncate">{t(sec.subtitle)}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/45 shrink-0" />
                      </button>
                    );
                  })}

                  {/* Developer Options Heading */}
                  <div className="pt-4 pb-1.5 px-2 flex items-center gap-2 text-white/50 text-[11px] font-bold tracking-wider uppercase select-none font-sans">
                    <Cpu className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{t("settings.section.developeroptions.title")}</span>
                  </div>

                  {[
                    {
                      id: "experimental",
                      title: "settings.sections.Experimental.title",
                      subtitle: "settings.sections.Experimental.subtitle",
                      icon: Beaker,
                    },
                    {
                      id: "custom_tab",
                      title: "Create custom tab",
                      subtitle: "Design a custom personalized navigation tab with custom icons, layout, and logic",
                      icon: Plus,
                    },
                    {
                      id: "custom_modal",
                      title: "Create custom modal",
                      subtitle: "Build custom pop-up alert dialog boxes with tailored HTML structures and functional logic",
                      icon: Sparkles,
                    },
                    {
                      id: "design_system",
                      title: "settings.sections.DesignSystem.title",
                      subtitle: "settings.sections.DesignSystem.subtitle",
                      icon: Layers,
                    }
                  ].map((sec) => {
                    const IconComp = sec.icon;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => setActiveSettingSection(sec.id)}
                        className="w-full text-left bg-white/10 backdrop-blur-[10px] rounded-[15px] py-4.5 px-5 sm:py-5.5 sm:px-6 flex items-center gap-3.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border-[3px] border-white/10 hover:border-white text-white cursor-default"
                      >
                        <div className="w-10 h-10 flex items-center justify-center shrink-0 text-white">
                          <IconComp className="w-6 h-6 stroke-[1.8]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-white tracking-tight">{t(sec.title)}</h3>
                          <p className="text-[11.5px] sm:text-xs text-white/60 mt-0.5 leading-relaxed truncate">{t(sec.subtitle)}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/45 shrink-0" />
                      </button>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="mt-16 sm:mt-20 bg-white/10 backdrop-blur-[10px] rounded-[15px] p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 text-white"
                >
                  {activeSettingSection === "plugin_store" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <div className="w-12 h-12 flex items-center justify-center shrink-0 text-indigo-400">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{t("settings.sections.PluginStore.title")}</h3>
                          <p className="text-xs text-white/60">{t("settings.sections.PluginStore.subtitle")}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {plugins.map((plugin) => {
                          return (
                            <div
                              key={plugin.id}
                              className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-white/10"
                            >
                              <div className="flex-1 space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-base text-white">{plugin.name}</span>
                                  {plugin.status === "installed" && (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                                      Installed
                                    </span>
                                  )}
                                  {plugin.status === "installing" && (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-400 text-[10px] font-semibold uppercase tracking-wider animate-pulse">
                                      Installing... {plugin.progress}%
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-white/60 leading-relaxed max-w-xl font-normal">
                                  {plugin.desc}
                                </p>
                                {plugin.status === "installing" && (
                                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-3">
                                    <div
                                      className="h-full bg-indigo-500 transition-all duration-1000 ease-out"
                                      style={{ width: `${plugin.progress}%` }}
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="shrink-0 flex items-center gap-3 self-end sm:self-center">
                                {plugin.status === "idle" && (
                                  <button
                                    onClick={() => installPlugin(plugin.id)}
                                    className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                                  >
                                    Install (30s)
                                  </button>
                                )}

                                {plugin.status === "installed" && (
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-white/50 font-medium font-sans">Activate:</span>
                                      {isMaterialDesignActive ? (
                                        <button
                                          onClick={() => {
                                            setPlugins(prev => prev.map(p => p.id === plugin.id ? { ...p, isActive: !p.isActive } : p));
                                          }}
                                          className={`w-12 h-7 rounded-full p-[3px] transition-all duration-300 focus:outline-none relative cursor-pointer flex items-center shrink-0 border-2 ${
                                            plugin.isActive ? "bg-[#381e72] border-transparent" : "bg-[#1d1b20] border-[#938f99]"
                                          }`}
                                        >
                                          <motion.div
                                            animate={{ x: plugin.isActive ? 20 : 0 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            className={`rounded-full flex items-center justify-center transition-all duration-300 ${
                                              plugin.isActive ? "w-4.5 h-4.5 bg-[#d0bcff] text-[#381e72]" : "w-3.5 h-3.5 bg-[#938f99] text-transparent"
                                            }`}
                                          >
                                            {plugin.isActive && (
                                              <svg className="w-3 h-3 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                              </svg>
                                            )}
                                          </motion.div>
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            setPlugins(prev => prev.map(p => p.id === plugin.id ? { ...p, isActive: !p.isActive } : p));
                                          }}
                                          className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none relative cursor-pointer flex items-center ${
                                            plugin.isActive ? "bg-[#34c759]" : "bg-white/20"
                                          }`}
                                        >
                                          <motion.div
                                            animate={{ x: plugin.isActive ? 20 : 0 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            className="w-5 h-5 rounded-full bg-white shadow-md"
                                          />
                                        </button>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => {
                                        setPlugins(prev => prev.map(p => p.id === plugin.id ? { ...p, status: "idle", progress: 0, isActive: false } : p));
                                      }}
                                      className="p-2 rounded-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all duration-200 active:scale-90 cursor-pointer"
                                      title="Uninstall plugin"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeSettingSection === "appearance" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <div className="w-12 h-12 flex items-center justify-center shrink-0 text-white">
                          <Palette className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">settings.sections.Appearance.title</h3>
                          <p className="text-xs text-white/60">settings.sections.Appearance.description</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-semibold block text-white/90">settings.appearance.BackdropGlow.label</label>
                        <div className="grid grid-cols-2 gap-2.5">
                          {[
                            { id: "cosmic", name: "Cosmic Glow", color: "from-pink-600 to-indigo-800" },
                            { id: "deep", name: "Minimalist", color: "from-neutral-800 to-slate-900" },
                            { id: "aurora", name: "Aurora Borealis", color: "from-teal-600 to-lime-900" },
                            { id: "sunset", name: "Sunset View", color: "from-rose-600 to-amber-900" },
                          ].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => setBgColor(item.id as any)}
                              className={`p-4 rounded-xl text-left text-xs font-bold relative overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-98 cursor-default border ${
                                bgColor === item.id 
                                  ? "border-white bg-white/15" 
                                  : "border-white/10 hover:border-white/20 bg-white/5"
                              }`}
                            >
                              <div className="flex flex-col h-full justify-between">
                                <span className="text-white font-bold mb-2">{item.name}</span>
                                <div className={`w-full h-2 rounded bg-gradient-to-r ${item.color} opacity-80`} />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* AMOLED Dark Mode Toggle */}
                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <div className="flex-1 pr-4">
                          <h4 className="text-sm font-semibold text-white">settings.appearance.AmoledDark.title</h4>
                          <p className="text-xs text-white/60 mt-0.5">settings.appearance.AmoledDark.subtitle</p>
                        </div>
                        {isMaterialDesignActive ? (
                          <button
                            onClick={() => setAmoledDark(!amoledDark)}
                            className={`w-12 h-7 rounded-full p-[3px] transition-all duration-300 focus:outline-none relative cursor-pointer flex items-center shrink-0 border-2 ${
                              amoledDark ? "bg-[#381e72] border-transparent" : "bg-[#1d1b20] border-[#938f99]"
                            }`}
                          >
                            <motion.div
                              animate={{ x: amoledDark ? 20 : 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              className={`rounded-full flex items-center justify-center transition-all duration-300 ${
                                amoledDark ? "w-4.5 h-4.5 bg-[#d0bcff] text-[#381e72]" : "w-3.5 h-3.5 bg-[#938f99] text-transparent"
                              }`}
                            >
                              {amoledDark && (
                                <svg className="w-3 h-3 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </motion.div>
                          </button>
                        ) : (
                          <button
                            onClick={() => setAmoledDark(!amoledDark)}
                            className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none relative cursor-pointer flex items-center ${
                              amoledDark ? "bg-[#34c759]" : "bg-white/20"
                            }`}
                          >
                            <motion.div
                              animate={{ x: amoledDark ? 20 : 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              className="relative w-6 h-5 flex items-center justify-center group"
                            >
                              <div className="absolute -inset-2 rounded-full bg-white/15 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 pointer-events-none" />
                              <div className="w-full h-full rounded-full bg-white border border-transparent transition-all duration-300 shadow-md z-10 group-hover:scale-110 group-hover:bg-transparent group-hover:backdrop-blur-md group-hover:border-white/95" />
                            </motion.div>
                          </button>
                        )}
                      </div>

                    </div>
                  )}

                  {activeSettingSection === "profile" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <div className="w-12 h-12 flex items-center justify-center shrink-0 text-white">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">settings.sections.Profile.title</h3>
                          <p className="text-xs text-white/60">settings.sections.Profile.description</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3.5 text-xs text-white/80">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white/90">settings.profile.TotalFavorites.title</span>
                            <span className="font-mono text-amber-300 font-bold bg-white/5 px-2 py-0.5 rounded">{favorites.length} channels</span>
                          </div>
                          {favorites.length > 0 && (
                            <button 
                              onClick={() => {
                                if (confirm("Are you sure you want to clear your entire favorites list?")) {
                                  setFavorites([]);
                                }
                              }}
                              className="py-1.5 px-3 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/25 transition-all cursor-default font-semibold text-[11px]"
                            >
                              settings.profile.DeleteAllFavorites.button
                            </button>
                          )}

                          <hr className="border-white/5" />

                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white/90">settings.profile.CustomChannels.title</span>
                            <span className="font-mono text-indigo-300 font-bold bg-white/5 px-2 py-0.5 rounded">{customChannels.length} channels</span>
                          </div>
                          {customChannels.length > 0 && (
                            <button 
                              onClick={() => {
                                if (confirm("Are you sure you want to delete all custom channels?")) {
                                  setCustomChannels([]);
                                }
                              }}
                              className="py-1.5 px-3 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/25 transition-all cursor-default font-semibold text-[11px]"
                            >
                              settings.profile.DeleteCustomChannels.button
                            </button>
                          )}
                        </div>

                        <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/15 text-xs leading-relaxed text-orange-200">
                          <div className="font-bold text-orange-300 mb-1">
                            settings.profile.OnlineAccountNotice.title
                          </div>
                          settings.profile.OnlineAccountNotice.description
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSettingSection === "accessibility" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <div className="w-12 h-12 flex items-center justify-center shrink-0 text-white">
                          <Sliders className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">settings.sections.Accessibility.title</h3>
                          <p className="text-xs text-white/60">settings.sections.Accessibility.description</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Option: Auto slide banner */}
                        <div className="p-5 rounded-[15px] bg-white/5 border border-white/10 space-y-4">
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-white">settings.accessibility.AutoSlide.title</h4>
                            <p className="text-xs text-white/60 leading-relaxed">settings.accessibility.AutoSlide.subtitle</p>
                          </div>
                          
                          <div className="flex items-center">
                            {isMaterialDesignActive ? (
                              <button
                                onClick={() => setAutoSlide(!autoSlide)}
                                className={`w-12 h-7 rounded-full p-[3px] transition-all duration-300 focus:outline-none relative cursor-pointer flex items-center shrink-0 border-2 ${
                                  autoSlide ? "bg-[#381e72] border-transparent" : "bg-[#1d1b20] border-[#938f99]"
                                }`}
                              >
                                <motion.div
                                  animate={{ x: autoSlide ? 20 : 0 }}
                                  transition={dynamicMotion ? { type: "spring", stiffness: 500, damping: 30 } : { duration: 0 }}
                                  className={`rounded-full flex items-center justify-center transition-all duration-300 ${
                                    autoSlide ? "w-4.5 h-4.5 bg-[#d0bcff] text-[#381e72]" : "w-3.5 h-3.5 bg-[#938f99] text-transparent"
                                  }`}
                                >
                                  {autoSlide && (
                                    <svg className="w-3 h-3 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </motion.div>
                              </button>
                            ) : (
                              <button
                                onClick={() => setAutoSlide(!autoSlide)}
                                className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none relative cursor-pointer flex items-center ${
                                  autoSlide ? "bg-[#34c759]" : "bg-[#3a3a3c]"
                                }`}
                              >
                                <motion.div
                                  animate={{ x: autoSlide ? 20 : 0 }}
                                  transition={dynamicMotion ? { type: "spring", stiffness: 500, damping: 30 } : { duration: 0 }}
                                  className="relative w-6 h-5 flex items-center justify-center group"
                                >
                                  {/* Outer hover halo/bubble (capsule-shaped matching the pill, expanding on hover) */}
                                  <div className="absolute -inset-2 rounded-full bg-white/15 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 pointer-events-none" />
                                  
                                  {/* Knob - horizontal pill shape */}
                                  <div className="w-full h-full rounded-full bg-white border border-transparent transition-all duration-300 shadow-md z-10 group-hover:scale-110 group-hover:bg-transparent group-hover:backdrop-blur-md group-hover:border-white/95" />
                                </motion.div>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Option: Dynamic Motion */}
                        <div className="p-5 rounded-[15px] bg-white/5 border border-white/10 space-y-4">
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-white">Dynamic Motion</h4>
                            <p className="text-xs text-white/60 leading-relaxed">Disables all transitions, entry animations, translations, and scaling. Everything will use instant transitions.</p>
                          </div>
                          
                          <div className="flex items-center">
                            {isMaterialDesignActive ? (
                              <button
                                onClick={() => setDynamicMotion(!dynamicMotion)}
                                className={`w-12 h-7 rounded-full p-[3px] transition-all duration-300 focus:outline-none relative cursor-pointer flex items-center shrink-0 border-2 ${
                                  dynamicMotion ? "bg-[#381e72] border-transparent" : "bg-[#1d1b20] border-[#938f99]"
                                }`}
                              >
                                <motion.div
                                  animate={{ x: dynamicMotion ? 20 : 0 }}
                                  transition={dynamicMotion ? { type: "spring", stiffness: 500, damping: 30 } : { duration: 0 }}
                                  className={`rounded-full flex items-center justify-center transition-all duration-300 ${
                                    dynamicMotion ? "w-4.5 h-4.5 bg-[#d0bcff] text-[#381e72]" : "w-3.5 h-3.5 bg-[#938f99] text-transparent"
                                  }`}
                                >
                                  {dynamicMotion && (
                                    <svg className="w-3 h-3 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </motion.div>
                              </button>
                            ) : (
                              <button
                                onClick={() => setDynamicMotion(!dynamicMotion)}
                                className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none relative cursor-pointer flex items-center ${
                                  dynamicMotion ? "bg-[#34c759]" : "bg-[#3a3a3c]"
                                }`}
                              >
                                <motion.div
                                  animate={{ x: dynamicMotion ? 20 : 0 }}
                                  transition={dynamicMotion ? { type: "spring", stiffness: 500, damping: 30 } : { duration: 0 }}
                                  className="relative w-6 h-5 flex items-center justify-center group"
                                >
                                  <div className="absolute -inset-2 rounded-full bg-white/15 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 pointer-events-none" />
                                  <div className="w-full h-full rounded-full bg-white border border-transparent transition-all duration-300 shadow-md z-10 group-hover:scale-110 group-hover:bg-transparent group-hover:backdrop-blur-md group-hover:border-white/95" />
                                </motion.div>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSettingSection === "experimental" && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <div className="w-12 h-12 flex items-center justify-center shrink-0 text-white">
                          <Beaker className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">settings.sections.Experimental.title</h3>
                          <p className="text-xs text-white/60">settings.sections.Experimental.description</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Section: Installable Experimental Features */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 px-1 text-indigo-400 text-xs font-bold tracking-wider uppercase">
                            <Sparkles className="w-4 h-4 animate-pulse" />
                            <span>Cửa hàng Tính năng Thử nghiệm</span>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4">
                            {expFeatures.map((feat) => {
                              return (
                                <div
                                  key={feat.id}
                                  className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-white/10"
                                >
                                  <div className="flex-1 space-y-1.5">
                                    <div className="flex items-center gap-2 text-left">
                                      <span className="font-bold text-base text-white">{feat.name}</span>
                                      {feat.status === "installed" && (
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                                          Installed
                                        </span>
                                      )}
                                      {feat.status === "installing" && (
                                        <span className="px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-400 text-[10px] font-semibold uppercase tracking-wider animate-pulse">
                                          Installing... {feat.progress}%
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-white/60 leading-relaxed max-w-xl font-normal text-left">
                                      {feat.desc}
                                    </p>
                                    {feat.status === "installing" && (
                                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-3">
                                        <div
                                          className="h-full bg-indigo-500 transition-all duration-300 ease-out"
                                          style={{ width: `${feat.progress}%` }}
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <div className="shrink-0 flex items-center gap-3 self-end sm:self-center">
                                    {feat.status === "idle" && (
                                      <button
                                        onClick={() => installExpFeature(feat.id)}
                                        className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
                                      >
                                        Cài đặt (3s)
                                      </button>
                                    )}

                                    {feat.status === "installed" && (
                                      <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs text-white/50 font-medium font-sans">Kích hoạt:</span>
                                          {isMaterialDesignActive ? (
                                            <button
                                              onClick={() => {
                                                setExpFeatures(prev => prev.map(p => p.id === feat.id ? { ...p, isActive: !p.isActive } : p));
                                              }}
                                              className={`w-12 h-7 rounded-full p-[3px] transition-all duration-300 focus:outline-none relative cursor-pointer flex items-center shrink-0 border-2 ${
                                                feat.isActive ? "bg-[#381e72] border-transparent" : "bg-[#1d1b20] border-[#938f99]"
                                              }`}
                                            >
                                              <motion.div
                                                animate={{ x: feat.isActive ? 20 : 0 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                className={`rounded-full flex items-center justify-center transition-all duration-300 ${
                                                  feat.isActive ? "w-4.5 h-4.5 bg-[#d0bcff] text-[#381e72]" : "w-3.5 h-3.5 bg-[#938f99] text-transparent"
                                                }`}
                                              >
                                                {feat.isActive && (
                                                  <svg className="w-3 h-3 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                  </svg>
                                                )}
                                              </motion.div>
                                            </button>
                                          ) : (
                                            <button
                                              onClick={() => {
                                                setExpFeatures(prev => prev.map(p => p.id === feat.id ? { ...p, isActive: !p.isActive } : p));
                                              }}
                                              className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none relative cursor-pointer flex items-center ${
                                                feat.isActive ? "bg-[#34c759]" : "bg-white/20"
                                              }`}
                                            >
                                              <motion.div
                                                animate={{ x: feat.isActive ? 20 : 0 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                className="w-5 h-5 rounded-full bg-white shadow-md"
                                              />
                                            </button>
                                          )}
                                        </div>
                                        <button
                                          onClick={() => {
                                            setExpFeatures(prev => prev.map(p => p.id === feat.id ? { ...p, status: "idle", progress: 0, isActive: false } : p));
                                          }}
                                          className="p-2 rounded-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all duration-200 active:scale-90 cursor-pointer"
                                          title="Gỡ bỏ tính năng"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="h-4" />
                          <div className="flex items-center gap-2 px-1 text-white/40 text-xs font-bold tracking-wider uppercase">
                            <Beaker className="w-4 h-4" />
                            <span>Cài đặt Khác</span>
                          </div>
                        </div>

                        {/* Option 1: Low Latency */}
                        <div className="p-5 rounded-[15px] bg-white/5 border border-white/10 flex items-center justify-between">
                          <div className="space-y-1 pr-4 text-left">
                            <h4 className="text-sm font-semibold text-white">settings.experimental.LowLatency.title</h4>
                            <p className="text-xs text-white/60 leading-relaxed">settings.experimental.LowLatency.subtitle</p>
                          </div>
                          {isMaterialDesignActive ? (
                            <button
                              onClick={() => setExpLowLatency(!expLowLatency)}
                              className={`w-12 h-7 rounded-full p-[3px] transition-all duration-300 focus:outline-none relative cursor-pointer flex items-center shrink-0 border-2 ${
                                expLowLatency ? "bg-[#381e72] border-transparent" : "bg-[#1d1b20] border-[#938f99]"
                              }`}
                            >
                              <motion.div
                                animate={{ x: expLowLatency ? 20 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className={`rounded-full flex items-center justify-center transition-all duration-300 ${
                                  expLowLatency ? "w-4.5 h-4.5 bg-[#d0bcff] text-[#381e72]" : "w-3.5 h-3.5 bg-[#938f99] text-transparent"
                                }`}
                              >
                                {expLowLatency && (
                                  <svg className="w-3 h-3 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </motion.div>
                            </button>
                          ) : (
                            <button
                              onClick={() => setExpLowLatency(!expLowLatency)}
                              className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none relative cursor-pointer flex items-center shrink-0 ${
                                expLowLatency ? "bg-[#34c759]" : "bg-[#3a3a3c]"
                              }`}
                            >
                              <motion.div
                                animate={{ x: expLowLatency ? 20 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="relative w-6 h-5 flex items-center justify-center group"
                              >
                                <div className="absolute -inset-2 rounded-full bg-white/15 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 pointer-events-none" />
                                <div className="w-full h-full rounded-full bg-white shadow-md z-10" />
                              </motion.div>
                            </button>
                          )}
                        </div>

                        {/* Option 2: Stream Cache */}
                        <div className="p-5 rounded-[15px] bg-white/5 border border-white/10 flex items-center justify-between">
                          <div className="space-y-1 pr-4 text-left">
                            <h4 className="text-sm font-semibold text-white">settings.experimental.StreamCache.title</h4>
                            <p className="text-xs text-white/60 leading-relaxed">settings.experimental.StreamCache.subtitle</p>
                          </div>
                          {isMaterialDesignActive ? (
                            <button
                              onClick={() => setExpCache(!expCache)}
                              className={`w-12 h-7 rounded-full p-[3px] transition-all duration-300 focus:outline-none relative cursor-pointer flex items-center shrink-0 border-2 ${
                                expCache ? "bg-[#381e72] border-transparent" : "bg-[#1d1b20] border-[#938f99]"
                              }`}
                            >
                              <motion.div
                                animate={{ x: expCache ? 20 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className={`rounded-full flex items-center justify-center transition-all duration-300 ${
                                  expCache ? "w-4.5 h-4.5 bg-[#d0bcff] text-[#381e72]" : "w-3.5 h-3.5 bg-[#938f99] text-transparent"
                                }`}
                              >
                                {expCache && (
                                  <svg className="w-3 h-3 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </motion.div>
                            </button>
                          ) : (
                            <button
                              onClick={() => setExpCache(!expCache)}
                              className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none relative cursor-pointer flex items-center shrink-0 ${
                                expCache ? "bg-[#34c759]" : "bg-[#3a3a3c]"
                              }`}
                            >
                              <motion.div
                                animate={{ x: expCache ? 20 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="relative w-6 h-5 flex items-center justify-center group"
                              >
                                <div className="absolute -inset-2 rounded-full bg-white/15 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 pointer-events-none" />
                                <div className="w-full h-full rounded-full bg-white shadow-md z-10" />
                              </motion.div>
                            </button>
                          )}
                        </div>

                        {/* Option 3: Ambient Glow */}
                        <div className="p-5 rounded-[15px] bg-white/5 border border-white/10 flex items-center justify-between">
                          <div className="space-y-1 pr-4 text-left">
                            <h4 className="text-sm font-semibold text-white">settings.experimental.AmbientGlow.title</h4>
                            <p className="text-xs text-white/60 leading-relaxed">settings.experimental.AmbientGlow.subtitle</p>
                          </div>
                          {isMaterialDesignActive ? (
                            <button
                              onClick={() => setExpAmbientGlow(!expAmbientGlow)}
                              className={`w-12 h-7 rounded-full p-[3px] transition-all duration-300 focus:outline-none relative cursor-pointer flex items-center shrink-0 border-2 ${
                                expAmbientGlow ? "bg-[#381e72] border-transparent" : "bg-[#1d1b20] border-[#938f99]"
                              }`}
                            >
                              <motion.div
                                animate={{ x: expAmbientGlow ? 20 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className={`rounded-full flex items-center justify-center transition-all duration-300 ${
                                  expAmbientGlow ? "w-4.5 h-4.5 bg-[#d0bcff] text-[#381e72]" : "w-3.5 h-3.5 bg-[#938f99] text-transparent"
                                }`}
                              >
                                {expAmbientGlow && (
                                  <svg className="w-3 h-3 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </motion.div>
                            </button>
                          ) : (
                            <button
                              onClick={() => setExpAmbientGlow(!expAmbientGlow)}
                              className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none relative cursor-pointer flex items-center shrink-0 ${
                                expAmbientGlow ? "bg-[#34c759]" : "bg-[#3a3a3c]"
                              }`}
                            >
                              <motion.div
                                animate={{ x: expAmbientGlow ? 20 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="relative w-6 h-5 flex items-center justify-center group"
                              >
                                <div className="absolute -inset-2 rounded-full bg-white/15 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 pointer-events-none" />
                                <div className="w-full h-full rounded-full bg-white shadow-md z-10" />
                              </motion.div>
                            </button>
                          )}
                        </div>

                        {/* Custom Playground */}
                        <div className="p-5 rounded-[15px] bg-white/5 border border-white/10 space-y-4">
                          <div className="space-y-1 text-left">
                            <h4 className="text-sm font-semibold text-white">settings.experimental.StreamPlayground.title</h4>
                            <p className="text-xs text-white/60 leading-relaxed">settings.experimental.StreamPlayground.subtitle</p>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={testStreamUrl}
                              onChange={(e) => setTestStreamUrl(e.target.value)}
                              placeholder="settings.experimental.StreamPlayground.placeholder"
                              className="flex-1 px-4 py-2.5 rounded-[10px] bg-white/10 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            />
                            <button
                              onClick={() => {
                                if (testStreamUrl) {
                                  const tempChannel: Channel = {
                                    id: "exp-test",
                                    name: "Luồng Thử Nghiệm",
                                    url: testStreamUrl,
                                    group: "Thử nghiệm",
                                    logoText: "TEST",
                                    logoBg: "bg-gradient-to-br from-indigo-600 to-indigo-900"
                                  };
                                  setSelectedChannel(tempChannel);
                                  setActiveTab("live");
                                }
                              }}
                              className="px-4 py-2.5 rounded-[10px] bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs transition-colors duration-200 active:scale-95 flex items-center gap-1 shrink-0"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" />
                              settings.experimental.StreamPlayground.button
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSettingSection === "custom_tab" && (
                    <div className="space-y-6 text-left">
                      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <div className="w-12 h-12 flex items-center justify-center bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
                          <Plus className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Create custom tab</h3>
                          <p className="text-xs text-white/60">Create personalized tabs with custom Icons, Names, HTML interfaces, and JavaScript event handlers.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left: Saved Tabs List */}
                        <div className="lg:col-span-5 space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">Created Tabs List ({customTabs.length})</h4>
                          {customTabs.length === 0 ? (
                            <div className="p-6 rounded-[15px] bg-white/5 border border-dashed border-white/10 text-center text-xs text-white/40">
                              No custom tabs created yet. Use the form on the right to start creating!
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-[480px] overflow-y-auto scrollbar-thin">
                              {customTabs.map((t) => {
                                const TabIconComp = ICON_REGISTRY[t.iconName] || Sparkles;
                                return (
                                  <div key={t.id} className="p-4 rounded-[15px] bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-xl text-white">
                                        <TabIconComp className="w-5 h-5" />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="text-sm font-semibold text-white truncate">{t.name}</div>
                                        <div className="text-[10px] text-white/40 font-mono truncate">{t.id}</div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <button
                                        onClick={() => {
                                          setTabEditId(t.id);
                                          setTabNameInput(t.name);
                                          setTabIconInput(t.iconName);
                                          setTabCodeInput(t.code);
                                          setTabHtmlInput(t.htmlContent || "");
                                        }}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                                        title="Edit"
                                      >
                                        <Pen className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to delete the tab "${t.name}"?`)) {
                                            setCustomTabs(prev => prev.filter(item => item.id !== t.id));
                                            if (tabEditId === t.id) {
                                              setTabEditId(null);
                                              setTabNameInput("");
                                              setTabIconInput("Sparkles");
                                              setTabCodeInput("");
                                              setTabHtmlInput("");
                                            }
                                          }
                                        }}
                                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/15 transition-colors"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Right: Form Builder */}
                        <div className="lg:col-span-7 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">
                            {tabEditId ? "Edit Custom Tab" : "Design New Tab"}
                          </h4>

                          {/* Tab Name */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-white/80 block">Tab Display Name</label>
                            <input
                              type="text"
                              value={tabNameInput}
                              onChange={(e) => setTabNameInput(e.target.value)}
                              placeholder="e.g. My Live channels, Private TV..."
                              className="w-full px-4 py-2.5 rounded-[12px] bg-white/10 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            />
                          </div>

                          {/* Icon Selection */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/80 block">Select Icon</label>
                            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-2.5 rounded-xl bg-black/25 border border-white/5 max-h-36 overflow-y-auto scrollbar-thin">
                              {Object.keys(ICON_REGISTRY).map((iconKey) => {
                                const IconTemp = ICON_REGISTRY[iconKey];
                                const isSelected = tabIconInput === iconKey;
                                return (
                                  <button
                                    key={iconKey}
                                    type="button"
                                    onClick={() => setTabIconInput(iconKey)}
                                    className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                                      isSelected 
                                        ? "bg-indigo-600 text-white scale-110 shadow-md shadow-indigo-600/30 border border-white/20" 
                                        : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                                    }`}
                                    title={iconKey}
                                  >
                                    <IconTemp className="w-4 h-4" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* HTML View Content */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-semibold text-white/80 block">Tab UI Layout (Optional HTML)</label>
                              <span className="text-[10px] text-white/40">Supports basic HTML tags</span>
                            </div>
                            <textarea
                              value={tabHtmlInput}
                              onChange={(e) => setTabHtmlInput(e.target.value)}
                              placeholder="Enter custom HTML layout..."
                              className="w-full h-24 p-3 rounded-[12px] bg-white/10 border border-white/10 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
                            />
                          </div>

                          {/* Script Logic */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-semibold text-white/80 block">JavaScript Handler Code</label>
                              <span className="text-[10px] text-amber-300 font-semibold">Runs on opening Tab or on action trigger</span>
                            </div>
                            <textarea
                              value={tabCodeInput}
                              onChange={(e) => setTabCodeInput(e.target.value)}
                              placeholder="Enter JavaScript code..."
                              className="w-full h-36 p-3 rounded-[12px] bg-white/10 border border-white/10 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            />
                          </div>

                          {/* Form Buttons */}
                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                            <button
                              type="button"
                              onClick={() => {
                                setTabEditId(null);
                                setTabNameInput("");
                                setTabIconInput("Sparkles");
                                setTabCodeInput("// Enter JavaScript code logic here\n");
                                setTabHtmlInput("");
                              }}
                              className="px-4 py-2.5 rounded-[12px] bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
                            >
                              Reset
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!tabNameInput.trim()) {
                                  alert("Please enter a Tab display name!");
                                  return;
                                }
                                if (tabEditId) {
                                  // Update
                                  setCustomTabs(prev => prev.map(t => t.id === tabEditId ? {
                                    ...t,
                                    name: tabNameInput,
                                    iconName: tabIconInput,
                                    code: tabCodeInput,
                                    htmlContent: tabHtmlInput
                                  } : t));
                                } else {
                                  // Create
                                  const newId = `custom_tab_${Date.now()}`;
                                  setCustomTabs(prev => [...prev, {
                                    id: newId,
                                    name: tabNameInput,
                                    iconName: tabIconInput,
                                    code: tabCodeInput,
                                    htmlContent: tabHtmlInput
                                  }]);
                                }
                                // Reset form
                                setTabEditId(null);
                                setTabNameInput("");
                                setTabIconInput("Sparkles");
                                setTabCodeInput("// Enter JavaScript code logic here\n");
                                setTabHtmlInput("");
                              }}
                              className="px-5 py-2.5 rounded-[12px] bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-lg shadow-indigo-600/25 flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Save Tab
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSettingSection === "custom_modal" && (
                    <div className="space-y-6 text-left">
                      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <div className="w-12 h-12 flex items-center justify-center bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Create custom modal</h3>
                          <p className="text-xs text-white/60">Build custom pop-up alert dialog boxes with custom Icons, HTML layouts, and tailored JavaScript event logic.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left: Saved Modals List */}
                        <div className="lg:col-span-5 space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">Created Modals List ({customModals.length})</h4>
                          {customModals.length === 0 ? (
                            <div className="p-6 rounded-[15px] bg-white/5 border border-dashed border-white/10 text-center text-xs text-white/40">
                              No custom modals created yet. Design one using the form on the right!
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-[480px] overflow-y-auto scrollbar-thin">
                              {customModals.map((m) => {
                                const ModalIconComp = ICON_REGISTRY[m.iconName] || Sparkles;
                                return (
                                  <div key={m.id} className="p-4 rounded-[15px] bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-xl text-white">
                                        <ModalIconComp className="w-5 h-5" />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="text-sm font-semibold text-white truncate">{m.name}</div>
                                        <div className="text-[10px] text-white/40 font-mono truncate">{m.id}</div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <button
                                        onClick={() => {
                                          setCustomModals(prev => prev.map(item => item.id === m.id ? { ...item, isOpen: true } : item));
                                        }}
                                        className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/15 transition-colors"
                                        title="Trigger/Preview"
                                      >
                                        <Play className="w-3.5 h-3.5 fill-indigo-300" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setModalEditId(m.id);
                                          setModalNameInput(m.name);
                                          setModalIconInput(m.iconName);
                                          setModalCodeInput(m.code);
                                          setModalHtmlInput(m.htmlContent || "");
                                        }}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                                        title="Edit"
                                      >
                                        <Pen className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to delete the modal "${m.name}"?`)) {
                                            setCustomModals(prev => prev.filter(item => item.id !== m.id));
                                            if (modalEditId === m.id) {
                                              setModalEditId(null);
                                              setModalNameInput("");
                                              setModalIconInput("Sparkles");
                                              setModalCodeInput("");
                                              setModalHtmlInput("");
                                            }
                                          }
                                        }}
                                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/15 transition-colors"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Right: Form Builder */}
                        <div className="lg:col-span-7 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">
                            {modalEditId ? "Edit Custom Modal" : "Design New Modal"}
                          </h4>

                          {/* Modal Name */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-white/80 block">Modal Title</label>
                            <input
                              type="text"
                              value={modalNameInput}
                              onChange={(e) => setModalNameInput(e.target.value)}
                              placeholder="e.g. TV Notice, Public Announcement..."
                              className="w-full px-4 py-2.5 rounded-[12px] bg-white/10 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            />
                          </div>

                          {/* Icon Selection */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/80 block">Select Icon</label>
                            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-2.5 rounded-xl bg-black/25 border border-white/5 max-h-36 overflow-y-auto scrollbar-thin">
                              {Object.keys(ICON_REGISTRY).map((iconKey) => {
                                const IconTemp = ICON_REGISTRY[iconKey];
                                const isSelected = modalIconInput === iconKey;
                                return (
                                  <button
                                    key={iconKey}
                                    type="button"
                                    onClick={() => setModalIconInput(iconKey)}
                                    className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                                      isSelected 
                                        ? "bg-indigo-600 text-white scale-110 shadow-md shadow-indigo-600/30 border border-white/20" 
                                        : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                                    }`}
                                    title={iconKey}
                                  >
                                    <IconTemp className="w-4 h-4" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* HTML View Content */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-semibold text-white/80 block">Modal Inner UI (Optional HTML)</label>
                              <span className="text-[10px] text-white/40">Inner layout content</span>
                            </div>
                            <textarea
                              value={modalHtmlInput}
                              onChange={(e) => setModalHtmlInput(e.target.value)}
                              placeholder="Enter HTML layout..."
                              className="w-full h-24 p-3 rounded-[12px] bg-white/10 border border-white/10 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
                            />
                          </div>

                          {/* Script Logic */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-semibold text-white/80 block">JavaScript Main Button Event Handler</label>
                              <span className="text-[10px] text-amber-300 font-semibold font-mono">Runs on 'Run Function' click</span>
                            </div>
                            <textarea
                              value={modalCodeInput}
                              onChange={(e) => setModalCodeInput(e.target.value)}
                              placeholder="Enter JavaScript code..."
                              className="w-full h-36 p-3 rounded-[12px] bg-white/10 border border-white/10 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            />
                          </div>

                          {/* Form Buttons */}
                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                            <button
                              type="button"
                              onClick={() => {
                                setModalEditId(null);
                                setModalNameInput("");
                                setModalIconInput("Sparkles");
                                setModalCodeInput("// Enter JavaScript code logic here\n");
                                setModalHtmlInput("");
                              }}
                              className="px-4 py-2.5 rounded-[12px] bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
                            >
                              Reset
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!modalNameInput.trim()) {
                                  alert("Please enter a Modal title!");
                                  return;
                                }
                                if (modalEditId) {
                                  // Update
                                  setCustomModals(prev => prev.map(m => m.id === modalEditId ? {
                                    ...m,
                                    name: modalNameInput,
                                    iconName: modalIconInput,
                                    code: modalCodeInput,
                                    htmlContent: modalHtmlInput
                                  } : m));
                                } else {
                                  // Create
                                  const newId = `custom_modal_${Date.now()}`;
                                  setCustomModals(prev => [...prev, {
                                    id: newId,
                                    name: modalNameInput,
                                    iconName: modalIconInput,
                                    code: modalCodeInput,
                                    htmlContent: modalHtmlInput,
                                    isOpen: false
                                  }]);
                                }
                                // Reset form
                                setModalEditId(null);
                                setModalNameInput("");
                                setModalIconInput("Sparkles");
                                setModalCodeInput("// Enter JavaScript code logic here\n");
                                setModalHtmlInput("");
                              }}
                              className="px-5 py-2.5 rounded-[12px] bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-lg shadow-indigo-600/25 flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Save Modal
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSettingSection === "design_system" && (
                    <div className="space-y-8 animate-fade-in pb-12">
                      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <div className="w-12 h-12 flex items-center justify-center shrink-0 text-white">
                          <Layers className="w-6 h-6 animate-pulse" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-semibold text-white">Vplay Design System</h3>
                          <p className="text-xs text-white/60">Hệ thống ngôn ngữ thiết kế, tương tác và thành phần giao diện của Vplay.</p>
                        </div>
                      </div>

                      {/* Design System Elements Showcase */}
                      <div className="space-y-8">
                        
                        {/* 1. BUTTONS */}
                        <div className={isMaterialDesignActive
                          ? "rounded-[28px] bg-[#211f26] border border-[#313033] p-6 shadow-lg text-[#e6e1e5]"
                          : "relative rounded-[20px] p-[1.5px] bg-gradient-to-br from-white/35 via-white/5 to-white/25 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.4),0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl"
                        }>
                          <div className={isMaterialDesignActive
                            ? "space-y-4 text-[#e6e1e5]"
                            : "rounded-[18.5px] bg-[#07050f]/60 p-6 space-y-4"
                          }>
                            <div className="text-left">
                              <h4 className={isMaterialDesignActive
                                ? "text-sm font-semibold text-white tracking-wide border-b border-[#313033] pb-2"
                                : "text-sm font-semibold text-white tracking-wide border-b border-white/5 pb-2"
                              }>Button</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                              {/* State: Default */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between"
                                  : "p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-white/50 text-left">Default</span>
                                  <div className="flex items-center justify-center h-full">
                                    <span className={isMaterialDesignActive 
                                      ? "px-5 py-2.5 rounded-[20px] bg-[#381e72] border-0 text-xs font-semibold text-[#d0bcff] select-none shadow-md"
                                      : "px-5 py-2.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-white select-none shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)]"
                                    }>
                                      Placeholder
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* State: Hover */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between"
                                  : "p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-teal-400 text-left">Hover</span>
                                  <div className="flex items-center justify-center h-full">
                                    <span className={isMaterialDesignActive
                                      ? "px-5 py-2.5 rounded-[20px] bg-[#4f378b] border-0 text-xs font-semibold text-[#d0bcff] select-none shadow-lg scale-[1.18] transition-all duration-300"
                                      : "px-5 py-2.5 rounded-full bg-white/20 border border-white/20 text-xs font-semibold text-white select-none shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.85),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.4),0_8px_20px_rgba(255,255,255,0.15)] scale-[1.18] transition-all duration-300"
                                    }>
                                      Placeholder
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* State: Pressed */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between"
                                  : "p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-indigo-400 text-left">Pressed</span>
                                  <div className="flex items-center justify-center h-full">
                                    <span className={isMaterialDesignActive
                                      ? "px-5 py-2.5 rounded-[20px] bg-[#6750a4] border-0 text-xs font-semibold text-[#e6e1e5] select-none shadow-lg scale-[1.28] transition-all duration-300"
                                      : "px-5 py-2.5 rounded-full bg-white/30 border border-white/30 text-xs font-semibold text-white select-none shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.9),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.5)] scale-[1.28] transition-all duration-300"
                                    }>
                                      Placeholder
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Live Playground */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-indigo-500/30 via-transparent to-indigo-500/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.2)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between bg-[#381e72]/5"
                                  : "p-4 bg-indigo-500/10 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-indigo-300 text-left">Live interaction</span>
                                  <div className="flex items-center justify-center h-full">
                                    <button className={isMaterialDesignActive
                                      ? "px-5 py-2.5 rounded-[20px] bg-[#381e72] hover:bg-[#4f378b] active:bg-[#6750a4] border-0 text-xs font-semibold text-[#d0bcff] shadow-md cursor-pointer bouncy-btn transition-all duration-150"
                                      : "px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/15 text-xs font-semibold text-white shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] cursor-pointer bouncy-btn"
                                    }>
                                      Interact me
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 2. SLIDER */}
                        <div className={isMaterialDesignActive
                          ? "rounded-[28px] bg-[#211f26] border border-[#313033] p-6 shadow-lg text-[#e6e1e5]"
                          : "relative rounded-[20px] p-[1.5px] bg-gradient-to-br from-white/35 via-white/5 to-white/25 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.4),0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl"
                        }>
                          <div className={isMaterialDesignActive
                            ? "space-y-4 text-[#e6e1e5]"
                            : "rounded-[18.5px] bg-[#07050f]/60 p-6 space-y-4"
                          }>
                            <div className="text-left">
                              <h4 className={isMaterialDesignActive
                                ? "text-sm font-semibold text-white tracking-wide border-b border-[#313033] pb-2"
                                : "text-sm font-semibold text-white tracking-wide border-b border-white/5 pb-2"
                              }>Slider</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                              {/* State: Default */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between"
                                  : "p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-white/50 text-left">Default</span>
                                  <div className="flex items-center justify-center h-full px-2">
                                    <div className="relative w-full h-1 bg-white/10 rounded-full">
                                      <div className={isMaterialDesignActive ? "bg-[#d0bcff] h-full w-[45%] rounded-full" : "bg-[#0084ff] h-full w-[45%] rounded-full"} />
                                      <div className="absolute top-1/2 left-[45%] -translate-y-1/2 -translate-x-1/2 w-6 h-2 rounded-full bg-white shadow-md border border-white/70" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* State: Hover */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between"
                                  : "p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-teal-400 text-left">Hover</span>
                                  <div className="flex items-center justify-center h-full px-2">
                                    <div className="relative w-full h-1 bg-white/15 rounded-full">
                                      <div className={isMaterialDesignActive ? "bg-[#d0bcff] h-full w-[45%] rounded-full" : "bg-[#0084ff] h-full w-[45%] rounded-full"} />
                                      <div className="absolute top-1/2 left-[45%] -translate-y-1/2 -translate-x-1/2 w-7 h-2.5 rounded-full bg-white shadow-lg scale-110 transition-all" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* State: Pressed */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between"
                                  : "p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-indigo-400 text-left">Pressed</span>
                                  <div className="flex items-center justify-center h-full px-2">
                                    <div className="relative w-full h-1 bg-white/20 rounded-full">
                                      <div className={isMaterialDesignActive ? "bg-[#d0bcff] h-full w-[45%] rounded-full" : "bg-[#0084ff] h-full w-[45%] rounded-full"} />
                                      <div className="absolute top-1/2 left-[45%] -translate-y-1/2 -translate-x-1/2 w-8 h-3 rounded-full bg-white shadow-2xl scale-120 transition-all" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Live Playground */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-indigo-500/30 via-transparent to-indigo-500/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.2)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between bg-[#381e72]/5"
                                  : "p-4 bg-indigo-500/10 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-indigo-300 text-left">Live interaction</span>
                                  <div className="flex items-center justify-center h-full">
                                    <div className="flex items-center w-full justify-center px-2">
                                      <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={demoSliderVal}
                                        onChange={(e) => setDemoSliderVal(Number(e.target.value))}
                                        className="w-full h-1 rounded-lg appearance-none cursor-default transition-all range-slider-pill outline-none"
                                        style={{
                                          background: isMaterialDesignActive
                                            ? `linear-gradient(to right, #d0bcff ${demoSliderVal * 100}%, rgba(255, 255, 255, 0.2) ${demoSliderVal * 100}%)`
                                            : `linear-gradient(to right, #0084ff ${demoSliderVal * 100}%, rgba(255, 255, 255, 0.2) ${demoSliderVal * 100}%)`
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 3. TOGGLE SWITCH */}
                        <div className={isMaterialDesignActive
                          ? "rounded-[28px] bg-[#211f26] border border-[#313033] p-6 shadow-lg text-[#e6e1e5]"
                          : "relative rounded-[20px] p-[1.5px] bg-gradient-to-br from-white/35 via-white/5 to-white/25 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.4),0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl"
                        }>
                          <div className={isMaterialDesignActive
                            ? "space-y-4 text-[#e6e1e5]"
                            : "rounded-[18.5px] bg-[#07050f]/60 p-6 space-y-4"
                          }>
                            <div className="text-left">
                              <h4 className={isMaterialDesignActive
                                ? "text-sm font-semibold text-white tracking-wide border-b border-[#313033] pb-2"
                                : "text-sm font-semibold text-white tracking-wide border-b border-white/5 pb-2"
                              }>Toggle Switch</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                              {/* State: Default / Off */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between"
                                  : "p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-white/50 text-left">Default</span>
                                  <div className="flex items-center justify-center h-full">
                                    <div className={isMaterialDesignActive
                                      ? "w-12 h-7 rounded-full p-[3px] bg-[#1d1b20] border-2 border-[#938f99] flex items-center"
                                      : "w-12 h-6 rounded-full p-0.5 bg-[#3a3a3c] flex items-center"
                                    }>
                                      <div className={isMaterialDesignActive
                                        ? "w-3.5 h-3.5 rounded-full bg-[#938f99]"
                                        : "relative w-6 h-5 flex items-center justify-center"
                                      }>
                                        {!isMaterialDesignActive && <div className="w-full h-full rounded-full bg-white shadow-md" />}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* State: Hover */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between h-28 overflow-hidden"
                               : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between"
                                  : "p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-teal-400 text-left">Hover</span>
                                  <div className="flex items-center justify-center h-full">
                                    <div className={isMaterialDesignActive
                                      ? "w-12 h-7 rounded-full p-[3px] bg-[#2a2831] border-2 border-[#ccc8d3] flex items-center"
                                      : "w-12 h-6 rounded-full p-0.5 bg-[#3a3a3c] flex items-center"
                                    }>
                                      <div className={isMaterialDesignActive
                                        ? "w-3.5 h-3.5 rounded-full bg-[#ccc8d3] relative flex items-center justify-center"
                                        : "relative w-6 h-5 flex items-center justify-center scale-110 transition-all"
                                      }>
                                        {isMaterialDesignActive ? (
                                          <div className="absolute -inset-2 rounded-full bg-[#ccc8d3]/15 scale-110" />
                                        ) : (
                                          <>
                                            <div className="absolute -inset-2 rounded-full bg-white/15 scale-100 transition-all pointer-events-none" />
                                            <div className="w-full h-full rounded-full bg-transparent border-white border backdrop-blur-md shadow-md" />
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* State: Pressed / On */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between"
                                  : "p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-indigo-400 text-left">Pressed</span>
                                  <div className="flex items-center justify-center h-full">
                                    <div className={isMaterialDesignActive
                                      ? "w-12 h-7 rounded-full p-[3px] bg-[#381e72] flex items-center justify-end"
                                      : "w-12 h-6 rounded-full p-0.5 bg-[#34c759] flex items-center justify-end"
                                    }>
                                      <div className={isMaterialDesignActive
                                        ? "w-4.5 h-4.5 rounded-full bg-[#d0bcff] flex items-center justify-center text-[#381e72]"
                                        : "relative w-6 h-5 flex items-center justify-center"
                                      }>
                                        {isMaterialDesignActive ? (
                                          <svg className="w-3 h-3 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                          </svg>
                                        ) : (
                                          <div className="w-full h-full rounded-full bg-white shadow-md" />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Live Playground */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-indigo-500/30 via-transparent to-indigo-500/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.2)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between bg-[#381e72]/5"
                                  : "p-4 bg-indigo-500/10 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-indigo-300 text-left">Live interaction</span>
                                  <div className="flex items-center justify-center h-full">
                                    {isMaterialDesignActive ? (
                                      <button
                                        onClick={() => setDemoToggleState(!demoToggleState)}
                                        className={`w-12 h-7 rounded-full p-[3px] transition-all duration-300 focus:outline-none relative cursor-pointer flex items-center shrink-0 border-2 ${
                                          demoToggleState ? "bg-[#381e72] border-transparent" : "bg-[#1d1b20] border-[#938f99]"
                                        }`}
                                      >
                                        <motion.div
                                          animate={{ x: demoToggleState ? 20 : 0 }}
                                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                          className={`rounded-full flex items-center justify-center transition-all duration-300 ${
                                            demoToggleState ? "w-4.5 h-4.5 bg-[#d0bcff] text-[#381e72]" : "w-3.5 h-3.5 bg-[#938f99] text-transparent"
                                          }`}
                                        >
                                          {demoToggleState && (
                                            <svg className="w-3 h-3 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                          )}
                                        </motion.div>
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => setDemoToggleState(!demoToggleState)}
                                        className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none relative cursor-pointer flex items-center ${
                                          demoToggleState 
                                            ? "bg-[#34c759]"
                                            : "bg-[#3a3a3c]"
                                        }`}
                                      >
                                        <motion.div
                                          animate={{ x: demoToggleState ? 24 : 0 }}
                                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                          className="relative w-5 h-5 flex items-center justify-center group"
                                        >
                                          <div className="absolute -inset-2 rounded-full bg-white/15 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 pointer-events-none" />
                                          <div className="w-full h-full rounded-full bg-white border border-transparent transition-all duration-300 shadow-md z-10 group-hover:scale-110 group-hover:bg-transparent group-hover:backdrop-blur-md group-hover:border-white/95" />
                                        </motion.div>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 4. DROPDOWN MENU */}
                        <div className={isMaterialDesignActive
                          ? "rounded-[28px] bg-[#211f26] border border-[#313033] p-6 shadow-lg text-[#e6e1e5]"
                          : "relative rounded-[20px] p-[1.5px] bg-gradient-to-br from-white/35 via-white/5 to-white/25 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.4),0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl"
                        }>
                          <div className={isMaterialDesignActive
                            ? "space-y-4 text-[#e6e1e5]"
                            : "rounded-[18.5px] bg-[#07050f]/60 p-6 space-y-4"
                          }>
                            <div className="text-left">
                              <h4 className={isMaterialDesignActive
                                ? "text-sm font-semibold text-white tracking-wide border-b border-[#313033] pb-2"
                                : "text-sm font-semibold text-white tracking-wide border-b border-white/5 pb-2"
                              }>Dropdown Menu</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                              {/* State: Default */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between min-h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between min-h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between"
                                  : "p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-white/50 text-left">Default</span>
                                  <div className={isMaterialDesignActive
                                    ? "py-2.5 px-4 rounded-xl bg-[#313033]/40 text-xs text-[#e6e1e5] flex items-center gap-3.5 select-none text-left mt-2"
                                    : "py-2.5 px-4 rounded-xl bg-white/5 text-xs text-white/80 flex items-center gap-2.5 select-none text-left mt-2"
                                  }>
                                    <Clock className="w-4 h-4 text-[#cac4d0]" />
                                    <span>Placeholder Item</span>
                                  </div>
                                </div>
                              </div>

                              {/* State: Hover */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between min-h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between min-h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between"
                                  : "p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-teal-400 text-left">Hover</span>
                                  <div className={isMaterialDesignActive
                                    ? "py-2.5 px-4 rounded-xl bg-[#313033] text-xs text-[#e6e1e5] flex items-center justify-between gap-3.5 select-none text-left mt-2"
                                    : "py-2.5 px-4 rounded-xl bg-white/15 text-xs text-white flex items-center justify-between gap-2.5 select-none shadow-sm text-left mt-2"
                                  }>
                                    <div className="flex items-center gap-3.5">
                                      <Clock className="w-4 h-4 text-[#cac4d0]" />
                                      <span>Placeholder Item</span>
                                    </div>
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#d0bcff]" />
                                  </div>
                                </div>
                              </div>

                              {/* State: Pressed */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between min-h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between min-h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between"
                                  : "p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-indigo-400 text-left">Pressed</span>
                                  <div className={isMaterialDesignActive
                                    ? "py-2.5 px-4 rounded-xl bg-[#49454f]/60 text-xs text-[#e6e1e5]/70 flex items-center gap-3.5 select-none text-left mt-2"
                                    : "py-2.5 px-4 rounded-xl bg-white/25 text-xs text-white/70 flex items-center gap-2.5 scale-97 select-none text-left mt-2"
                                  }>
                                    <Clock className="w-4 h-4 text-[#cac4d0]/60" />
                                    <span>Placeholder Item</span>
                                  </div>
                                </div>
                              </div>

                              {/* Live Playground */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between min-h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-indigo-500/30 via-transparent to-indigo-500/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.2)] flex flex-col justify-between min-h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between bg-[#381e72]/5"
                                  : "p-4 bg-indigo-500/10 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-indigo-300 text-left">Live interaction</span>
                                  <div className="relative group mt-2">
                                    <button className={isMaterialDesignActive
                                      ? "w-full py-2.5 px-4 rounded-xl bg-[#313033]/60 hover:bg-[#313033] active:bg-[#49454f] text-xs text-[#e6e1e5] flex items-center justify-between gap-3.5 transition-all duration-150 active:scale-97 cursor-pointer text-left border-0"
                                      : "w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/15 active:bg-white/25 text-xs text-white/95 hover:text-white flex items-center justify-between gap-2.5 transition-all duration-150 active:scale-97 cursor-pointer text-left"
                                    }>
                                      <span className="flex items-center gap-3.5">
                                        <Clock className={isMaterialDesignActive ? "w-4 h-4 text-[#cac4d0]" : "w-4 h-4 text-indigo-300"} />
                                        <span>Placeholder Item</span>
                                      </span>
                                      <span className={isMaterialDesignActive
                                        ? "w-1.5 h-1.5 rounded-full bg-[#d0bcff] opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                        : "w-4 h-4 text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                      } />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 5. DOCK */}
                        <div className={isMaterialDesignActive
                          ? "rounded-[28px] bg-[#211f26] border border-[#313033] p-6 shadow-lg text-[#e6e1e5]"
                          : "relative rounded-[20px] p-[1.5px] bg-gradient-to-br from-white/35 via-white/5 to-white/25 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.4),0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl"
                        }>
                          <div className={isMaterialDesignActive
                            ? "space-y-4 text-[#e6e1e5]"
                            : "rounded-[18.5px] bg-[#07050f]/60 p-6 space-y-4"
                          }>
                            <div className="text-left">
                              <h4 className={isMaterialDesignActive
                                ? "text-sm font-semibold text-white tracking-wide border-b border-[#313033] pb-2"
                                : "text-sm font-semibold text-white tracking-wide border-b border-white/5 pb-2"
                              }>Dock</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                              {/* State: Default */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between min-h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between min-h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between"
                                  : "p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-white/50 text-left">Default</span>
                                  <div className="flex items-center justify-center py-2 h-full">
                                    <div className="relative flex flex-col items-center justify-center h-12 w-20 text-[#cac4d0]">
                                      <Home className="w-6 h-6 stroke-[1.8]" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* State: Hover */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between min-h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between min-h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between"
                                  : "p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-teal-400 text-left">Hover</span>
                                  <div className="flex items-center justify-center py-2 h-full">
                                    <div className="relative flex flex-col items-center justify-center h-12 w-20 text-white scale-[1.18] transition-transform duration-300">
                                      <Home className="w-6 h-6 stroke-[2]" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* State: Pressed */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between min-h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between min-h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between"
                                  : "p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-indigo-400 text-left">Pressed</span>
                                  <div className="flex items-center justify-center py-2 h-full">
                                    <div className={`relative flex flex-col items-center justify-center h-12 w-20 z-10 scale-[1.05] transition-all ${isMaterialDesignActive ? "text-[#d0bcff]" : "text-indigo-950 font-medium"}`}>
                                      <div className={isMaterialDesignActive
                                        ? "absolute w-14 h-8 bg-[#381e72] rounded-[20px] -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-none border-0"
                                        : "absolute inset-0 bg-white/50 rounded-full shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.8),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.15)] -z-10"
                                      } />
                                      <Home className="w-6 h-6 stroke-[2.2]" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Live Playground */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between min-h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-indigo-500/30 via-transparent to-indigo-500/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.2)] flex flex-col justify-between min-h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between bg-[#381e72]/5"
                                  : "p-4 bg-indigo-500/10 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-indigo-300 text-left">Live interaction</span>
                                  <div className="flex items-center justify-center h-full">
                                    <div className={`h-14 flex items-center justify-around px-2 py-1 relative w-full max-w-[200px] ${
                                      isMaterialDesignActive
                                        ? "rounded-[28px] bg-[#211f26] border border-[#313033] shadow-lg"
                                        : "rounded-full bg-white/[0.12] backdrop-blur-[25px] saturate-[185%] border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3),0_10px_30px_rgba(0,0,0,0.3)]"
                                    }`}>
                                      {[
                                        { id: "home", icon: Home, label: "Home" },
                                        { id: "live", icon: Radio, label: "Live" }
                                      ].map((tab) => {
                                        const isActive = activeDockDemoTab === tab.id;
                                        const Icon = tab.icon;
                                        return (
                                          <button
                                            key={tab.id}
                                            onClick={() => setActiveDockDemoTab(tab.id)}
                                            className={`relative flex flex-col items-center justify-center flex-1 h-full cursor-pointer z-10 bouncy-btn px-2 transition-all duration-300 ${
                                              isActive 
                                                ? (isMaterialDesignActive ? "text-[#e6e1e5] font-normal" : "text-indigo-950 font-normal") 
                                                : (isMaterialDesignActive ? "text-[#cac4d0]" : "text-white/65 hover:text-white")
                                            }`}
                                          >
                                            {isActive && (
                                              <motion.div
                                                layoutId="demoActiveTabPill"
                                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                                className={isMaterialDesignActive
                                                  ? "absolute w-14 h-8 bg-[#381e72] rounded-[20px] -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-none border-0"
                                                  : "absolute inset-y-1 inset-x-1 bg-white/50 rounded-full shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.8),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.15)] -z-10"
                                                }
                                              />
                                            )}
                                            <Icon className="w-5.5 h-5.5" />
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 6. CHECKBOX */}
                        <div className={isMaterialDesignActive
                          ? "rounded-[28px] bg-[#211f26] border border-[#313033] p-6 shadow-lg text-[#e6e1e5]"
                          : "relative rounded-[20px] p-[1.5px] bg-gradient-to-br from-white/35 via-white/5 to-white/25 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.4),0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl"
                        }>
                          <div className={isMaterialDesignActive
                            ? "space-y-4 text-[#e6e1e5]"
                            : "rounded-[18.5px] bg-[#07050f]/60 p-6 space-y-4"
                          }>
                            <div className="text-left">
                              <h4 className={isMaterialDesignActive
                                ? "text-sm font-semibold text-white tracking-wide border-b border-[#313033] pb-2"
                                : "text-sm font-semibold text-white tracking-wide border-b border-white/5 pb-2"
                              }>Checkbox</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                              {/* State: Default */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between"
                                  : "p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-white/50 text-left">Default</span>
                                  <div className="flex items-center justify-center h-full">
                                    {isMaterialDesignActive ? (
                                      <div className="relative w-[18px] h-[18px] rounded-[4px] border-2 border-[#c4c6cf]" />
                                    ) : (
                                      <div className="relative w-5 h-5 rounded-md p-[1px] bg-gradient-to-br from-white/40 to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.2)]">
                                        <div className="w-full h-full rounded-[5px] bg-[#07050f]/40" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* State: Hover */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between"
                                  : "p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-teal-400 text-left">Hover</span>
                                  <div className="flex items-center justify-center h-full">
                                    {isMaterialDesignActive ? (
                                      <div className="relative w-[18px] h-[18px] rounded-[4px] border-2 border-[#d0bcff] bg-[#d0bcff]/10 scale-110 transition-all" />
                                    ) : (
                                      <div className="relative w-5 h-5 rounded-md p-[1px] bg-gradient-to-br from-teal-400/50 to-white/25 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.4)] scale-110 transition-all">
                                        <div className="w-full h-full rounded-[5px] bg-[#07050f]/20" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* State: Pressed */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between"
                                  : "p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-indigo-400 text-left">Pressed</span>
                                  <div className="flex items-center justify-center h-full">
                                    {isMaterialDesignActive ? (
                                      <div className="relative w-[18px] h-[18px] rounded-[4px] bg-[#d0bcff] flex items-center justify-center border-0">
                                        <Check className="w-3 h-3 text-[#381e72] stroke-[4]" />
                                      </div>
                                    ) : (
                                      <div className="relative w-5 h-5 rounded-md p-[1px] bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.4)]">
                                        <div className="w-full h-full rounded-[5px] bg-indigo-500 flex items-center justify-center">
                                          <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Live Playground */}
                              <div className={isMaterialDesignActive
                                ? "rounded-2xl bg-[#1d1b20] border border-[#313033] flex flex-col justify-between h-28 overflow-hidden"
                                : "relative rounded-[12px] p-[1px] bg-gradient-to-br from-indigo-500/30 via-transparent to-indigo-500/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.2)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md"
                              }>
                                <div className={isMaterialDesignActive
                                  ? "p-4 h-full flex flex-col justify-between bg-[#381e72]/5"
                                  : "p-4 bg-indigo-500/10 rounded-[11px] h-full flex flex-col justify-between"
                                }>
                                  <span className="text-[11px] font-semibold text-indigo-300 text-left">Live interaction</span>
                                  <div className="flex items-center justify-center h-full">
                                    <button 
                                      onClick={() => setExpCache(!expCache)}
                                      className="focus:outline-none transition-all flex items-center justify-center cursor-pointer relative"
                                    >
                                      {isMaterialDesignActive ? (
                                        <div className={`relative w-[18px] h-[18px] rounded-[4px] border-2 transition-all flex items-center justify-center ${
                                          expCache ? "border-[#d0bcff] bg-[#d0bcff]" : "border-[#c4c6cf]"
                                        }`}>
                                          {expCache && (
                                            <motion.div
                                              initial={{ scale: 0.5, opacity: 0 }}
                                              animate={{ scale: 1, opacity: 1 }}
                                            >
                                              <Check className="w-3 h-3 text-[#381e72] stroke-[4]" />
                                            </motion.div>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="relative w-5 h-5 rounded-md p-[1px] bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.4)]">
                                          <div className="w-full h-full rounded-[5px] bg-[#07050f]/40 flex items-center justify-center">
                                            {expCache && (
                                              <motion.div
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="absolute inset-0 bg-indigo-500 rounded-[3px] flex items-center justify-center"
                                              >
                                                <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />
                                              </motion.div>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {activeSettingSection !== "appearance" && activeSettingSection !== "profile" && activeSettingSection !== "accessibility" && activeSettingSection !== "experimental" && activeSettingSection !== "design_system" && activeSettingSection !== "plugin_store" && activeSettingSection !== "custom_tab" && activeSettingSection !== "custom_modal" && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Sparkles className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2">Coming Soon</h3>
                      <p className="text-xs text-white/60 max-w-xs mx-auto leading-relaxed">
                        This feature is actively being developed and will be released in the upcoming version of Vplay.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* VIEW: FANDOM LOGOS GENERATOR PAGE */}
        {activeTab === "fandom_logos" && (
          <FandomLogosTab onBack={() => setActiveTab("home")} />
        )}

        {/* VIEW: INTELLIGENCE THUMBNAIL PAGE */}
        {activeTab === "intelligence_thumbnail" && (
          <IntelligenceThumbnailTab
            onBack={() => setActiveTab("home")}
            onSelectChannel={(channel) => {
              handleSelectChannel(channel);
              setActiveTab("home");
            }}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            t={t}
          />
        )}

      </main>

      {/* High-fidelity progressive vintage blur backplate for Bottom Navigation Dock */}
      <div className="fixed bottom-0 inset-x-0 h-28 pointer-events-none z-40">
        <div className="progressive-blur-dock" />
      </div>

      <nav id="bottom-dock-container" className="fixed bottom-6 inset-x-0 mx-auto w-11/12 max-w-[420px] z-50 h-16 transform-gpu">
        {/* Reimagined Search Popover */}
        <AnimatePresence>
          {isReimaginedSearchActive && reimaginedSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={dynamicMotion ? { duration: 0.25, ease: "easeOut" } : { duration: 0 }}
              className="absolute bottom-20 left-0 right-0 max-h-[380px] rounded-[24px] border border-white/10 bg-[#161224]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-[100] text-left text-white"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between text-[11px] text-white/50 font-semibold uppercase tracking-wider bg-white/[0.02]">
                <span>Kết quả tìm kiếm</span>
                {searchQuery && (
                  <span className="font-mono lowercase bg-indigo-500/25 text-indigo-400 px-2 py-0.5 rounded">
                    {searchResults.length} tìm thấy
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2 flex flex-col justify-between">
                {!searchQuery ? (
                  <div className="py-8 px-4 text-center flex flex-col items-center justify-center text-white/40 my-auto">
                    <Search className="w-8 h-8 mb-2 text-white/20" />
                    <p className="text-xs font-medium">Nhập từ khóa để tìm nhanh...</p>
                    <p className="text-[10px] text-white/30 mt-1 max-w-[250px]">
                      Tìm kiếm kênh truyền hình trực tiếp, đài phát thanh địa phương hoặc quốc tế.
                    </p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="py-8 px-4 text-center flex flex-col items-center justify-center text-white/40 my-auto">
                    <HelpCircle className="w-8 h-8 mb-2 text-white/20" />
                    <p className="text-xs font-medium">Không tìm thấy kênh phù hợp</p>
                    <p className="text-[10px] text-white/30 mt-1">
                      Hãy thử tìm bằng từ khóa khác hoặc kiểm tra chính tả.
                    </p>
                  </div>
                ) : (
                  searchResults.slice(0, 5).map((ch) => {
                    return (
                      <button
                        key={ch.id}
                        onClick={() => {
                          handleSelectChannel(ch);
                          setActiveTab("live");
                          setReimaginedSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white/10 text-left transition-all group/item duration-150 cursor-pointer"
                      >
                        {/* Channel Logo */}
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 transition-transform group-hover/item:scale-105">
                          {ch.logoImg ? (
                            <img
                              src={ch.logoImg}
                              alt={ch.name}
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="text-[10px] font-bold text-white/60">
                              {ch.logoText || "TV"}
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white/90 truncate group-hover/item:text-indigo-400 transition-colors">
                            {ch.name}
                          </h4>
                          <p className="text-[11px] text-white/50 truncate mt-0.5">
                            {ch.group}
                          </p>
                        </div>

                        {/* Play Icon */}
                        <div className="w-8 h-8 rounded-full bg-white/5 group-hover/item:bg-indigo-500 text-white/40 group-hover/item:text-white flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all duration-150 shrink-0 scale-90 group-hover/item:scale-100">
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </div>
                      </button>
                    );
                  })
                )}

                {searchQuery && searchResults.length > 5 && (
                  <button
                    onClick={() => {
                      setReimaginedSearchOpen(false);
                      setActiveTab("search");
                    }}
                    className="w-full text-center py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-all cursor-pointer block"
                  >
                    Xem thêm kết quả ({searchResults.length - 5})
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {(activeTab === "search" || (isReimaginedSearchActive && reimaginedSearchOpen)) ? (
            <motion.div
              key="search-bar-dock"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={dynamicMotion ? { duration: 0.35, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }}
              className={`w-full h-16 flex items-center px-4 gap-2 relative transform-gpu ${
                isMaterialDesignActive
                  ? "rounded-full bg-[#2b2930] border-0 text-[#e6e1e5] shadow-lg"
                  : "rounded-full bg-white/[0.12] backdrop-blur-[25px] saturate-[185%] border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3),0_25px_50px_-12px_rgba(0,0,0,0.9)]"
              }`}
            >
              {isVIntelligenceActive ? (
                <motion.img
                  animate={{ rotate: vIntelSpinCount * 360 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  src="https://static.wikia.nocookie.net/logopedia/images/6/65/Windows_Copilot_2023_%28Preview%29.svg/revision/latest?cb=20230615034330"
                  className="w-5.5 h-5.5 pointer-events-none object-contain ml-1"
                  referrerPolicy="no-referrer"
                  alt="V-Intelligence"
                />
              ) : isMaterialDesignActive ? (
                <img
                  src="https://static.wikia.nocookie.net/ep-deo/images/6/6a/Search_100dp_000000_FILL0_wght400_GRAD0_opsz48.png/revision/latest?cb=20260629081314"
                  className="w-5.5 h-5.5 transition-transform duration-300 pointer-events-none object-contain ml-1"
                  style={{ filter: "brightness(0) invert(1) opacity-80" }}
                  referrerPolicy="no-referrer"
                  alt="Search"
                />
              ) : (
                <img 
                  src="https://static.wikia.nocookie.net/ftv/images/d/dc/Ass_glass.svg/revision/latest?cb=20260612062405&path-prefix=vi" 
                  className="w-5.5 h-5.5 brightness-0 invert opacity-95 z-20 pointer-events-none object-contain ml-1" 
                  referrerPolicy="no-referrer"
                  alt="Search"
                />
              )}
              <input
                type="text"
                placeholder={isVIntelligenceActive ? "Hỏi Trợ lý V-Intelligence... (Nhấn Enter)" : "Search Vplay"}
                value={isVIntelligenceActive ? vIntelQuery : searchQuery}
                onChange={(e) => {
                  if (isVIntelligenceActive) {
                    setVIntelQuery(e.target.value);
                  } else {
                    setSearchQuery(e.target.value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isVIntelligenceActive) {
                    handleSendVIntelMsg();
                  }
                }}
                className={`flex-1 bg-transparent border-none text-white text-sm focus:outline-none placeholder-white/40 px-1 font-sans ${isMaterialDesignActive ? "text-[#e6e1e5] placeholder-[#cac4d0]/60 text-base font-normal" : ""}`}
                autoFocus
              />
              {isVIntelligenceActive && vIntelQuery.trim() && (
                <button
                  onClick={() => handleSendVIntelMsg()}
                  disabled={isVIntelLoading}
                  className="p-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all bouncy-btn mr-1 shrink-0 cursor-pointer shadow"
                  title="Gửi"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
              {isMaterialDesignActive && !isVIntelligenceActive && (
                <Mic className="w-5.5 h-5.5 text-[#cac4d0] z-20 mr-1 shrink-0 cursor-pointer hover:scale-110 transition-all duration-200" />
              )}
              {((isVIntelligenceActive && vIntelQuery) || (!isVIntelligenceActive && searchQuery)) && (
                <button
                  onClick={() => {
                    if (isVIntelligenceActive) {
                      setVIntelQuery("");
                    } else {
                      setSearchQuery("");
                    }
                  }}
                  className={`p-1 ${isMaterialDesignActive ? "text-[#cac4d0] hover:text-[#e6e1e5]" : "text-white/40 hover:text-white"}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => {
                  if (isVIntelligenceActive) {
                    setVIntelQuery("");
                    setVIntelHistory([]);
                    if (reimaginedSearchOpen) {
                      setReimaginedSearchOpen(false);
                    } else {
                      setActiveTab(prevTab);
                    }
                  } else {
                    setSearchQuery("");
                    if (isReimaginedSearchActive && reimaginedSearchOpen) {
                      setReimaginedSearchOpen(false);
                    } else {
                      setActiveTab(prevTab);
                    }
                  }
                }}
                className={`w-8 h-8 flex items-center justify-center text-white cursor-default shrink-0 ${
                  isMaterialDesignActive ? "duration-200" : "bouncy-btn"
                } ${
                  isMaterialDesignActive
                    ? "rounded-full bg-[#c9b2fa] hover:bg-[#dcd0ff] border-0 text-white shadow-md"
                    : "rounded-full bg-white/15 hover:bg-white/25 border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)]"
                }`}
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="main-bar-dock"
              initial={{ y: 0, opacity: 1 }}
              exit={{ y: 25, opacity: 0 }}
              transition={dynamicMotion ? { duration: 0.25 } : { duration: 0 }}
              className="flex items-center gap-2.5 w-full h-16 transform-gpu"
            >
              {/* Main Tab Dock (Pill) */}
              <div className={`flex-1 h-full flex items-center justify-around px-2 py-1 relative transform-gpu ${
                isMaterialDesignActive
                  ? "rounded-full bg-[#290a36] border border-white/5 shadow-[0_12px_32px_rgba(0,0,0,0.15)]"
                  : "rounded-full bg-white/[0.12] backdrop-blur-[25px] saturate-[185%] border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3),0_25px_50px_-12px_rgba(0,0,0,0.9)]"
              }`}>
                {showCopiedNotify ? (
                  <div
                    className="flex items-center justify-center gap-2.5 text-white font-normal text-sm tracking-wide select-none animate-fade-in"
                  >
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span>Copied to clipboard</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-around w-full h-full">
                    {[
                      { id: "home", icon: Home, label: "Home", isVtvGo: false },
                      { id: "live", icon: Tv, label: "Live", isVtvGo: false },
                      ...customTabs.map((t: any) => ({
                        id: t.id,
                        icon: ICON_REGISTRY[t.iconName] || Sparkles,
                        label: t.name,
                        isVtvGo: false,
                        isCustom: true,
                        code: t.code
                      })),
                      { id: "settings", icon: Settings, label: "Settings", isVtvGo: false },
                      ...(!isFocusMode ? [{ id: "vtvgo", icon: Star, label: "VTVgo", isVtvGo: true }] : []),
                    ].map((tab) => {
                      const isActive = tab.isVtvGo 
                        ? (activeTab === "live" && selectedChannel?.id === "vietnam-wild-live")
                        : (activeTab === tab.id && !(activeTab === "live" && selectedChannel?.id === "vietnam-wild-live"));
                      const Icon = tab.icon;
                      
                      return (
                        <button 
                          key={tab.id}
                          onClick={() => {
                            if (tab.isVtvGo) {
                              const wildChannel = flattenedChannels.find(ch => ch.id === "vietnam-wild-live");
                              if (wildChannel) {
                                setSelectedChannel(wildChannel);
                                setActiveTab("live");
                              }
                            } else {
                              setActiveTab(tab.id as any);
                              if (tab.isCustom && tab.code) {
                                try {
                                  const runFn = new Function(
                                    "setSelectedChannel",
                                    "setActiveTab",
                                    "favorites",
                                    "setFavorites",
                                    "playbackError",
                                    "setPlaybackError",
                                    tab.code
                                  );
                                  runFn(
                                    setSelectedChannel,
                                    setActiveTab,
                                    favorites,
                                    setFavorites,
                                    playbackError,
                                    setPlaybackError
                                  );
                                } catch (err: any) {
                                  console.error(`Lỗi thực thi script khi chọn Tab: ${err.message}`);
                                }
                              }
                            }
                          }}
                          className={`relative group flex flex-col items-center justify-center flex-1 h-full cursor-default z-10 px-2 transition-all transform-gpu ${
                            isMaterialDesignActive ? "duration-200" : "bouncy-btn"
                          }`}
                        >
                          {/* Premium Custom Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2.5 py-1.5 bg-black/95 backdrop-blur-md border border-white/10 text-white text-[10px] sm:text-[11px] font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 whitespace-nowrap z-50 shadow-xl scale-95 group-hover:scale-100">
                            {tab.label}
                          </div>

                          {isActive && (
                            <motion.div
                              layoutId="activeTabPill"
                              transition={isMaterialDesignActive
                                ? { type: "tween", duration: 0.18, ease: "easeInOut" }
                                : (dynamicMotion ? { type: "spring", stiffness: 350, damping: 25 } : { type: "tween", duration: 0 })
                              }
                              className={isMaterialDesignActive 
                                ? "absolute w-14 h-8 bg-[#c9b2fa] rounded-full -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-none border-0"
                                : "absolute inset-y-1 inset-x-1 bg-white/50 rounded-full shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.8),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.15)] -z-10"
                              }
                            />
                          )}

                          <Icon 
                            className={`w-6 h-6 transition-all duration-300 ${
                              isActive 
                                ? (isMaterialDesignActive ? "scale-105 text-[#290a36] opacity-100" : "scale-105 text-indigo-950 opacity-100") 
                                : "text-white opacity-85 group-hover:opacity-100 group-hover:scale-105"
                            }`} 
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Separate Search Button */}
              <button
                onClick={() => {
                  if (isVIntelligenceActive) {
                    setVIntelSpinCount(prev => prev + 1);
                  }
                  if (isReimaginedSearchActive || isVIntelligenceActive) {
                    setReimaginedSearchOpen(true);
                  } else {
                    setPrevTab(activeTab as any);
                    setActiveTab("search");
                  }
                }}
                className={`relative group w-16 h-16 flex items-center justify-center shrink-0 transform-gpu transition-all ${
                  isMaterialDesignActive
                    ? "bg-[#c9b2fa] hover:bg-[#dcd0ff] text-white shadow-lg border-0 rounded-[20px] duration-200"
                    : "rounded-full bg-white/[0.12] backdrop-blur-[25px] saturate-[185%] border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3),0_25px_50px_-12px_rgba(0,0,0,0.9)] hover:border-white/40 bouncy-btn"
                }`}
              >
                {/* Premium Custom Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2.5 py-1.5 bg-black/95 backdrop-blur-md border border-white/10 text-white text-[10px] sm:text-[11px] font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 whitespace-nowrap z-50 shadow-xl scale-95 group-hover:scale-100">
                  {isVIntelligenceActive ? "V-Intelligence" : "Tìm kiếm kênh"}
                </div>
                {isVIntelligenceActive ? (
                  <motion.img
                    animate={{ rotate: vIntelSpinCount * 360 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    src="https://static.wikia.nocookie.net/logopedia/images/6/65/Windows_Copilot_2023_%28Preview%29.svg/revision/latest?cb=20230615034330"
                    className="w-7.5 h-7.5 pointer-events-none object-contain group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    alt="V-Intelligence"
                  />
                ) : isMaterialDesignActive ? (
                  <img
                    src="https://static.wikia.nocookie.net/ep-deo/images/6/6a/Search_100dp_000000_FILL0_wght400_GRAD0_opsz48.png/revision/latest?cb=20260629081314"
                    className="w-6.5 h-6.5 transition-transform duration-300 pointer-events-none object-contain"
                    style={{ filter: "brightness(0)" }}
                    referrerPolicy="no-referrer"
                    alt="Search"
                  />
                ) : (
                  <img 
                    src="https://static.wikia.nocookie.net/ftv/images/d/dc/Ass_glass.svg/revision/latest?cb=20260612062405&path-prefix=vi" 
                    className="w-6.5 h-6.5 brightness-0 invert opacity-95 transition-all duration-300 group-hover:scale-110 pointer-events-none object-contain" 
                    referrerPolicy="no-referrer"
                    alt="Search"
                  />
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Playback Error Toast Alert */}
        <AnimatePresence>
          {playbackError && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="mt-3 mx-auto w-fit px-5 py-2.5 rounded-full bg-red-600/25 backdrop-blur-[12px] border border-red-500/35 text-red-200 text-xs font-normal flex items-center gap-2 shadow-[0_12px_32px_rgba(239,68,68,0.25)] select-none"
            >
              <AlertCircle className="w-4.5 h-4.5 text-red-400 animate-pulse" />
              <span className="flex items-center gap-1">
                Playback Error. Try to watch directly using <Tv className="w-3.5 h-3.5 text-red-300 inline" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Channel Change Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-26 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-white text-[11.5px] font-medium tracking-wide shadow-lg select-none pointer-events-none font-sans text-center whitespace-nowrap"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* V-Intelligence Copilot-style Sidebar Drawer */}
      <AnimatePresence>
        {isVIntelligenceActive && reimaginedSearchOpen && (
          <>
            {/* Soft backdrop on mobile only */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReimaginedSearchOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] md:hidden"
            />

            <motion.div
              initial={{ x: "100%", opacity: 0.95 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed top-[40px] right-0 h-[calc(100vh-40px)] w-full sm:w-[380px] md:w-[420px] bg-[#0c0819]/95 backdrop-blur-[40px] saturate-[180%] border-l border-white/10 shadow-[-10px_0_40px_rgba(0,0,0,0.6)] z-[90] flex flex-col text-left text-white"
            >
              {/* Copilot-style Glowing Header Accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-indigo-500 via-purple-500 to-pink-500" />

              {roleSelection === "user" ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative font-mono">
                  <button
                    onClick={() => setReimaginedSearchOpen(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-none text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                    title="Đóng"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="w-12 h-12 rounded-none bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="text-white/95 text-xs font-semibold uppercase tracking-wider mb-2">
                    Access Restricted
                  </div>
                  <div className="text-white/60 text-xs leading-relaxed max-w-[280px]">
                    V-Intelligence is not available in preview build of Vplay.
                  </div>
                </div>
              ) : (
                <>
                  {/* Drawer Header */}
              <div className="px-5 pt-6 pb-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <div className="relative cursor-pointer" onClick={() => setVIntelSpinCount(prev => prev + 1)}>
                    <motion.img
                      animate={{ rotate: vIntelSpinCount * 360 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      src="https://static.wikia.nocookie.net/logopedia/images/6/65/Windows_Copilot_2023_%28Preview%29.svg/revision/latest?cb=20230615034330"
                      className="w-8 h-8 object-contain filter drop-shadow-[0_0_8px_rgba(99,102,241,0.55)] hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                      alt="V-Intelligence"
                    />
                    {isVIntelLoading && (
                      <span className="absolute inset-0 rounded-full border border-indigo-500 animate-ping opacity-75" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                      V-Intelligence
                      <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                        AI
                      </span>
                    </h3>
                    <p className="text-[10px] text-white/50 font-medium">Trợ lý Trí tuệ Nhân tạo thông minh</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {vIntelHistory.length > 0 && (
                    <button
                      onClick={() => setVIntelHistory([])}
                      className="p-1.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer"
                      title="Xóa cuộc trò chuyện"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setReimaginedSearchOpen(false)}
                    className="p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                    title="Đóng"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* Segmented control for Copilot options: Chat và Search with AI */}
              <div className="px-5 py-3 border-b border-white/5 bg-white/[0.005]">
                <div className="p-0.5 rounded-xl bg-white/5 border border-white/5 flex gap-1">
                  <button
                    onClick={() => setVIntelMode("chat")}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      vIntelMode === "chat"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10 border border-indigo-500/20"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Chat
                  </button>
                  <button
                    onClick={() => setVIntelMode("search")}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      vIntelMode === "search"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10 border border-indigo-500/20"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Search className="w-3.5 h-3.5" />
                    Search with AI
                  </button>
                </div>
              </div>

              {/* Chat Content Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
                {vIntelHistory.length === 0 ? (
                  <div className="h-full flex flex-col justify-center py-6 text-center text-white/40">
                    <div className="relative mb-4 flex items-center justify-center">
                      <img
                        src="https://static.wikia.nocookie.net/logopedia/images/6/65/Windows_Copilot_2023_%28Preview%29.svg/revision/latest?cb=20230615034330"
                        className="w-14 h-14 animate-pulse object-contain filter drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                        referrerPolicy="no-referrer"
                        alt="V-Intelligence"
                      />
                    </div>
                    <p className="text-sm font-bold text-white mb-1.5">
                      {vIntelMode === "chat" ? "Chào mừng đến với Trợ lý V-Intelligence!" : "Tìm kiếm kênh thông minh bằng AI"}
                    </p>
                    <p className="text-[11.5px] text-white/50 leading-relaxed max-w-[320px] mx-auto mb-6">
                      {vIntelMode === "chat"
                        ? "Mình xưng hô là mình - bạn, luôn nhiệt tình và sẵn sàng hỗ trợ bạn điều khiển tivi, tìm kiếm thể loại, giải đáp các thắc mắc nhanh chóng."
                        : "Công nghệ AI sinh tạo giúp bạn quét toàn bộ hệ thống kênh truyền hình Vplay để tìm chính xác kênh bạn muốn. Hãy nhập mô tả bên dưới."}
                    </p>
                    
                    <div className="w-full space-y-2 text-left">
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">
                        Gợi ý cho bạn:
                      </p>
                      {(vIntelMode === "chat"
                        ? [
                            "Bật kênh VTV3",
                            "Thời tiết hôm nay thế nào?",
                            "Kênh VTV1 chiếu gì vậy?",
                            "Kể cho mình nghe một câu chuyện vui"
                          ]
                        : [
                            "Tìm các kênh thể thao, bóng đá",
                            "Gợi ý các kênh truyền hình địa phương",
                            "Kênh nào chiếu phim truyện?",
                            "Mở đài phát thanh Radio ca nhạc"
                          ]
                      ).map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setVIntelQuery(suggestion);
                            handleSendVIntelMsg(suggestion);
                          }}
                          className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/20 text-xs font-medium text-indigo-200 hover:text-white transition-all cursor-pointer flex items-center gap-2.5 group"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                          <span className="truncate">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vIntelHistory.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex flex-col ${
                          msg.role === "user" ? "items-end" : "items-start"
                        }`}
                      >
                        <div className={`text-[9px] text-white/40 mb-1 font-semibold uppercase tracking-wider px-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                          {msg.role === "user" ? "Bạn" : "V-Intelligence"}
                        </div>
                        <div
                          className={`p-3.5 rounded-2xl text-[12.5px] leading-relaxed max-w-[88%] whitespace-pre-wrap break-words shadow-md border ${
                            msg.role === "user"
                              ? "bg-gradient-to-br from-indigo-600/40 to-indigo-700/40 border-indigo-500/30 text-white rounded-tr-none"
                              : "bg-white/5 border-white/10 text-white/95 rounded-tl-none"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isVIntelLoading && (
                      <div className="flex flex-col items-start animate-pulse">
                        <div className="text-[9px] text-white/40 mb-1 font-semibold uppercase tracking-wider px-1">
                          V-Intelligence
                        </div>
                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-[12.5px] text-white/50 rounded-tl-none flex items-center gap-2">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                          <span>V-Intelligence đang suy nghĩ...</span>
                        </div>
                      </div>
                    )}
                    <div ref={vIntelScrollRef} />
                  </div>
                )}
              </div>

              {/* Copilot Prompt Input Area at the bottom */}
              <div className="p-4 border-t border-white/5 bg-white/[0.01] flex flex-col gap-2">
                <div className="relative rounded-2xl bg-white/5 border border-white/10 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all p-3 flex flex-col gap-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  <textarea
                    rows={3}
                    placeholder={vIntelMode === "chat" ? "Hỏi Trợ lý V-Intelligence... (Nhấn Enter)" : "Mô tả kênh bạn muốn tìm kiếm..."}
                    value={vIntelQuery}
                    onChange={(e) => setVIntelQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendVIntelMsg();
                      }
                    }}
                    className="w-full bg-transparent border-0 text-white text-[12.5px] placeholder-white/30 focus:outline-none resize-none font-sans px-1 pt-1 leading-relaxed"
                  />
                  
                  <div className="flex items-center justify-between px-1 pt-1 text-white/40">
                    <span className="text-[10px] text-white/30 font-mono">
                      {vIntelQuery.length}/2000
                    </span>
                    <div className="flex items-center gap-2">
                      {vIntelQuery.trim() && (
                        <button
                          onClick={() => setVIntelQuery("")}
                          className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all cursor-pointer"
                          title="Xóa"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleSendVIntelMsg()}
                        disabled={isVIntelLoading || !vIntelQuery.trim()}
                        className={`p-1.5 rounded-xl transition-all cursor-pointer shadow flex items-center justify-center ${
                          vIntelQuery.trim()
                            ? "bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-105"
                            : "bg-white/5 text-white/20 cursor-not-allowed"
                        }`}
                        title="Gửi"
                      >
                        {isVIntelLoading ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-[9.5px] text-center text-white/30 px-2 leading-relaxed">
                  Trợ lý AI sử dụng Gemini API. Câu trả lời có thể chứa thông tin chưa chính xác.
                </div>
              </div>
                </>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CUSTOM CHANNEL LINK ADDER MODAL */}
      <AnimatePresence>
        {showCustomModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={isMaterialDesignActive ? { duration: 0.25 } : (dynamicMotion ? { duration: 0.35, ease: [0.16, 1, 0.3, 1] } : { duration: 0 })}
            className="fixed inset-0 bg-black/25 backdrop-blur-[20px] z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={isMaterialDesignActive ? { opacity: 0 } : { opacity: 0, scale: 1.15 }}
              animate={isMaterialDesignActive ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={isMaterialDesignActive ? { opacity: 0 } : { opacity: 0, scale: 1.15 }}
              transition={isMaterialDesignActive ? { duration: 0.25 } : (dynamicMotion ? { duration: 0.45, ease: [0.16, 1, 0.3, 1] } : { duration: 0 })}
              className={`w-full max-w-[350px] relative text-left transform-gpu ${
                isMaterialDesignActive
                  ? "rounded-[28px] bg-[#211f26] p-6 shadow-2xl border-0 text-[#e6e1e5]"
                  : "rounded-[30px] bg-[#e5e5ea]/85 p-5 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.45),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.2),0_24px_48px_rgba(0,0,0,0.12)] relative border border-white/20 text-black"
              }`}
            >
              <h3 className={`text-[18px] font-semibold tracking-tight leading-snug ${isMaterialDesignActive ? "text-[#e6e1e5]" : "text-black"}`}>
                {t("modal.ChannelCreate.title")}
              </h3>
              <p className={`text-[12px] mb-4 leading-relaxed px-1 mt-1 ${isMaterialDesignActive ? "text-[#cac4d0]" : "text-black/60"}`}>
                {t("modal.ChannelCreate.desc")}
              </p>

              <form onSubmit={handleAddCustomChannel} className="space-y-3.5 text-sm">
                <div className="space-y-1 text-left">
                  <label className={`text-[11.5px] font-semibold block px-1 ${isMaterialDesignActive ? "text-[#d0bcff]" : "text-black/60"}`}>{t("modal.ChannelCreate.nameLabel")}</label>
                  <input
                    required
                    type="text"
                    placeholder="My Custom Channel"
                    value={customChannelName}
                    onChange={(e) => setCustomChannelName(e.target.value)}
                    className={`w-full px-4 text-xs font-normal ${
                      isMaterialDesignActive
                        ? "py-3 rounded-xl bg-[#36343b] text-white placeholder-white/30 border-b-2 border-[#79747e] focus:border-[#d0bcff] focus:outline-none transition-all"
                        : "py-2.5 rounded-full bg-white/75 text-black placeholder-black/40 border border-black/5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    }`}
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className={`text-[11.5px] font-semibold block px-1 ${isMaterialDesignActive ? "text-[#d0bcff]" : "text-black/60"}`}>{t("modal.ChannelCreate.urlLabel")}</label>
                  <input
                    required
                    type="url"
                    placeholder="https://example.com/live/stream.m3u8"
                    value={customChannelUrl}
                    onChange={(e) => setCustomChannelUrl(e.target.value)}
                    className={`w-full px-4 text-xs font-normal font-mono ${
                      isMaterialDesignActive
                        ? "py-3 rounded-xl bg-[#36343b] text-white placeholder-white/30 border-b-2 border-[#79747e] focus:border-[#d0bcff] focus:outline-none transition-all"
                        : "py-2.5 rounded-full bg-white/75 text-black placeholder-black/40 border border-black/5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    }`}
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className={`text-[11.5px] font-semibold block px-1 ${isMaterialDesignActive ? "text-[#d0bcff]" : "text-black/60"}`}>{t("modal.ChannelCreate.groupLabel")}</label>
                  <select
                    value={customChannelGroup}
                    onChange={(e) => setCustomChannelGroup(e.target.value)}
                    className={`w-full px-4 text-xs font-normal appearance-none cursor-pointer pr-10 relative ${
                      isMaterialDesignActive
                        ? "py-3 rounded-xl bg-[#36343b] text-white border-b-2 border-[#79747e] focus:border-[#d0bcff] focus:outline-none transition-all"
                        : "py-2.5 rounded-full bg-white/75 text-black border border-black/5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    }`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 14px center',
                      backgroundSize: '14px',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    <option value="VTV" className={isMaterialDesignActive ? "bg-[#36343b] text-white" : ""}>VTV Channels</option>
                    <option value="VTVcab" className={isMaterialDesignActive ? "bg-[#36343b] text-white" : ""}>VTVcab Channels</option>
                    <option value="HTV" className={isMaterialDesignActive ? "bg-[#36343b] text-white" : ""}>HTV Channels</option>
                    <option value="SCTV" className={isMaterialDesignActive ? "bg-[#36343b] text-white" : ""}>SCTV Channels</option>
                    <option value="Địa phương" className={isMaterialDesignActive ? "bg-[#36343b] text-white" : ""}>Local & Essential Channels</option>
                    <option value="Quốc tế" className={isMaterialDesignActive ? "bg-[#36343b] text-white" : ""}>International & Featured Channels</option>
                    <option value="Radio" className={isMaterialDesignActive ? "bg-[#36343b] text-white" : ""}>Radio Channels</option>
                    <option value="Thử nghiệm" className={isMaterialDesignActive ? "bg-[#36343b] text-white" : ""}>Staging/Experimental Channels</option>
                    <option value="NEW_GROUP" className={isMaterialDesignActive ? "bg-[#36343b] text-white" : ""}>+ Create custom group...</option>
                  </select>
                </div>

                {customChannelGroup === "NEW_GROUP" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-1 text-left"
                  >
                    <label className={`text-[11.5px] font-semibold block px-1 ${isMaterialDesignActive ? "text-[#d0bcff]" : "text-black/60"}`}>Enter new group name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. My Private Channels"
                      value={customGroupInput}
                      onChange={(e) => setCustomGroupInput(e.target.value)}
                      className={`w-full px-4 text-xs font-normal ${
                        isMaterialDesignActive
                          ? "py-3 rounded-xl bg-[#36343b] text-white placeholder-white/30 border-b-2 border-[#79747e] focus:border-[#d0bcff] focus:outline-none transition-all"
                          : "py-2.5 rounded-full bg-white/75 text-black placeholder-black/40 border border-black/5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      }`}
                    />
                  </motion.div>
                )}

                <div className="flex items-center gap-3.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCustomModal(false)}
                    className={`flex-1 py-3 px-4 rounded-full font-semibold text-[15px] text-center cursor-default ${
                      isMaterialDesignActive
                        ? "text-[#ffb4ab] bg-transparent hover:bg-white/5 active:scale-95 transition-all"
                        : "bg-black/10 hover:bg-black/15 active:scale-95 transition-all text-[#ff3b30]"
                    }`}
                  >
                    {t("modal.ChannelCreate.cancel")}
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-3 px-4 rounded-full font-semibold text-[15px] text-center cursor-default ${
                      isMaterialDesignActive
                        ? "bg-[#d0bcff] hover:bg-[#bfa8eb] active:scale-95 transition-all text-[#381e72]"
                        : "bg-[#007aff] hover:bg-[#0066d6] active:scale-95 transition-all text-white shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.45),0_2px_6px_rgba(0,122,255,0.25)]"
                    }`}
                  >
                    {t("modal.ChannelCreate.create")}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGO ADJUST TOOL TEST MODAL */}
      <AnimatePresence>
        {showLogoAdjustModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-[20px] z-[120] flex items-center justify-center p-4 font-google select-none"
            onClick={() => setShowLogoAdjustModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className={`w-full max-w-sm p-6 shadow-2xl relative text-left overflow-hidden flex flex-col ${
                isMaterialDesignActive
                  ? "rounded-[28px] bg-[#211f26] border border-white/5 text-[#e6e1e5]"
                  : "rounded-3xl bg-[#121118]/90 border border-white/10 text-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-1 mb-5">
                <h3 className="text-sm font-bold uppercase text-purple-400 tracking-wide">LOGO ADJUSTMENT TEST</h3>
                <p className="text-xs text-white/40 uppercase tracking-wider font-medium">Tinh chỉnh bộ lọc hình ảnh hiển thị logo</p>
              </div>

              {/* Logo Preview box */}
              <div className="w-full aspect-video bg-black/40 border border-white/10 flex items-center justify-center p-4 mb-5 relative overflow-hidden rounded-2xl">
                <img 
                  src="https://static.wikia.nocookie.net/logos/images/2/20/VTV2_21.11.2024-nay.png/revision/latest/scale-to-width-down/1000?cb=20250110115127&path-prefix=vi" 
                  alt="VTV2 Test Logo" 
                  className="max-h-24 max-w-full object-contain transition-all duration-75"
                  referrerPolicy="no-referrer"
                  style={{
                    filter: `saturate(${logoSaturation}%) brightness(${logoBrightness}%) opacity(${logoOpacity}%)`
                  }}
                />
              </div>

              {/* Sliders */}
              <div className="space-y-4 mb-6">
                {/* Saturation */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] uppercase text-neutral-400 font-semibold tracking-wider">
                    <span>Saturation</span>
                    <span className="text-white font-bold">{logoSaturation}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="200" 
                    value={logoSaturation}
                    onChange={(e) => setLogoSaturation(Number(e.target.value))}
                    className="w-full accent-purple-500 h-1 bg-white/10 rounded-full cursor-pointer"
                  />
                </div>

                {/* Brightness */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] uppercase text-neutral-400 font-semibold tracking-wider">
                    <span>Brightness</span>
                    <span className="text-white font-bold">{logoBrightness}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="200" 
                    value={logoBrightness}
                    onChange={(e) => setLogoBrightness(Number(e.target.value))}
                    className="w-full accent-purple-500 h-1 bg-white/10 rounded-full cursor-pointer"
                  />
                </div>

                {/* Opacity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] uppercase text-neutral-400 font-semibold tracking-wider">
                    <span>Opacity</span>
                    <span className="text-white font-bold">{logoOpacity}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={logoOpacity}
                    onChange={(e) => setLogoOpacity(Number(e.target.value))}
                    className="w-full accent-purple-500 h-1 bg-white/10 rounded-full cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setLogoSaturation(100);
                    setLogoBrightness(100);
                    setLogoOpacity(100);
                  }}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 text-xs uppercase tracking-wider transition-all cursor-default text-center rounded-xl text-white/80 font-semibold"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowLogoAdjustModal(false)}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 hover:shadow-[0_0_15px_rgba(147,51,234,0.3)] py-2.5 text-xs uppercase tracking-wider transition-all cursor-default text-center rounded-xl font-bold text-white"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* YOUTUBE TOOL MODAL */}
      <AnimatePresence>
        {showYouTubeToolModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-[20px] z-[120] flex items-center justify-center p-4 font-google select-none"
            onClick={() => setShowYouTubeToolModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className={`w-full max-w-sm p-6 shadow-2xl relative text-left overflow-hidden flex flex-col ${
                isMaterialDesignActive
                  ? "rounded-[28px] bg-[#211f26] border border-white/5 text-[#e6e1e5]"
                  : "rounded-3xl bg-[#121118]/90 border border-white/10 text-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-1 mb-5">
                <h3 className="text-sm font-bold uppercase text-emerald-400 tracking-wide">YOUTUBE PIPELINE</h3>
                <p className="text-xs text-white/40 uppercase tracking-wider font-medium">Nhập đường dẫn YouTube để phát trong channel player</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase tracking-wider block font-semibold">ĐƯỜNG DẪN VIDEO YOUTUBE</label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrlInput}
                    onChange={(e) => setYoutubeUrlInput(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-emerald-500/50 px-3 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none rounded-xl"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (!youtubeUrlInput.trim()) return;
                      const ytChannel: Channel = {
                        id: "youtube_custom_" + Date.now(),
                        name: "YouTube Stream",
                        url: youtubeUrlInput.trim(),
                        group: "YouTube Tool",
                        logoText: "YOUTUBE",
                        logoBg: "bg-red-600",
                        logoImg: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo_only.svg"
                      };
                      handleSelectChannel(ytChannel);
                      setShowYouTubeToolModal(false);
                      setActiveTab("live");
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] py-2.5 text-xs uppercase tracking-wider transition-all cursor-default text-center rounded-xl font-bold text-white"
                  >
                    Play
                  </button>
                  <button
                    onClick={() => setShowYouTubeToolModal(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 text-xs uppercase tracking-wider transition-all cursor-default text-center rounded-xl text-white/60 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WHEEL OF VPLAY MODAL */}
      <AnimatePresence>
        {showWheelOfVplayModal && renderWheelOfVplayModal()}
      </AnimatePresence>

      {/* CUSTOM MODALS RENDERING */}
      <AnimatePresence>
        {customModals.map((modal) => {
          if (!modal.isOpen) return null;
          const ModalIcon = ICON_REGISTRY[modal.iconName] || Sparkles;
          return (
            <motion.div
              key={modal.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={isMaterialDesignActive ? { duration: 0.25 } : { duration: 0.35 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-[20px] z-[120] flex items-center justify-center p-4"
            >
              <motion.div
                initial={isMaterialDesignActive ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
                animate={isMaterialDesignActive ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                exit={isMaterialDesignActive ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
                className={`w-full max-w-lg p-6 shadow-2xl relative text-left overflow-hidden flex flex-col gap-4 font-sans ${
                  isMaterialDesignActive
                    ? "rounded-[28px] bg-[#211f26] border-0 text-[#e6e1e5]"
                    : "rounded-3xl bg-[#120e24]/90 border border-white/10 text-white"
                }`}
              >
                {/* Close Button */}
                <button
                  onClick={() => {
                    setCustomModals(prev => prev.map(m => m.id === modal.id ? { ...m, isOpen: false } : m));
                  }}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-indigo-500/10 rounded-xl text-indigo-400">
                    <ModalIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">{modal.name}</h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Custom pop-up modal</p>
                  </div>
                </div>

                {/* HTML Custom Content */}
                {modal.htmlContent ? (
                  <div 
                    className="py-1 text-sm text-white/80 leading-relaxed overflow-y-auto max-h-64 scrollbar-thin"
                    dangerouslySetInnerHTML={{ __html: modal.htmlContent }}
                  />
                ) : (
                  <p className="py-2 text-sm text-white/60 text-center">
                    Prisline blank dialog. Click 'Run Function' to execute your custom script.
                  </p>
                )}

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/5">
                  <button
                    onClick={() => {
                      setCustomModals(prev => prev.map(m => m.id === modal.id ? { ...m, isOpen: false } : m));
                    }}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      try {
                        const runFn = new Function(
                          "setSelectedChannel",
                          "setActiveTab",
                          "favorites",
                          "setFavorites",
                          "playbackError",
                          "setPlaybackError",
                          modal.code
                        );
                        runFn(
                          setSelectedChannel,
                          setActiveTab,
                          favorites,
                          setFavorites,
                          playbackError,
                          setPlaybackError
                        );
                      } catch (err: any) {
                        alert(`Script execution error: ${err.message}`);
                      }
                    }}
                    className="px-4.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white transition-colors flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-white" /> Run Function
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* VTVGO LOCKED POPUP */}
      <AnimatePresence>
        {showVtvGoLockedModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={isMaterialDesignActive ? { duration: 0.25 } : (dynamicMotion ? { duration: 0.35, ease: [0.16, 1, 0.3, 1] } : { duration: 0 })}
            className="fixed inset-0 bg-black/25 backdrop-blur-[20px] z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={isMaterialDesignActive ? { opacity: 0 } : { opacity: 0, scale: 1.15 }}
              animate={isMaterialDesignActive ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={isMaterialDesignActive ? { opacity: 0 } : { opacity: 0, scale: 1.15 }}
              transition={isMaterialDesignActive ? { duration: 0.25 } : (dynamicMotion ? { duration: 0.45, ease: [0.16, 1, 0.3, 1] } : { duration: 0 })}
              className={`w-full max-w-[350px] relative text-left transform-gpu ${
                isMaterialDesignActive
                  ? "rounded-[28px] bg-[#211f26] p-6 shadow-2xl border-0 text-[#e6e1e5]"
                  : "rounded-[30px] bg-[#e5e5ea]/85 p-6 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.45),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.2),0_24px_48px_rgba(0,0,0,0.12)] border border-white/20 text-black"
              }`}
            >
              <h3 className={`text-[18px] font-semibold tracking-tight leading-snug ${isMaterialDesignActive ? "text-[#e6e1e5]" : "text-black"}`}>
                {t("title.special_event.title.name")}
              </h3>
              <p className={`text-[12px] mb-5 leading-relaxed mt-2 ${isMaterialDesignActive ? "text-[#cac4d0]" : "text-black/60"}`}>
                {t("title.special_event.desc.name")}
              </p>
              
              <button
                onClick={() => setShowVtvGoLockedModal(false)}
                className={`w-full py-3 px-4 rounded-full font-semibold text-[15px] text-center cursor-default transform-gpu ${
                  isMaterialDesignActive
                    ? "bg-[#d0bcff] hover:bg-[#bfa8eb] active:scale-95 transition-all text-[#381e72]"
                    : "bg-[#007aff] hover:bg-[#0066d6] hover:scale-[1.03] active:scale-95 transition-all duration-300 text-white shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.45),0_2px_6px_rgba(0,122,255,0.25)]"
                }`}
              >
                {t("modal.close_button.name")}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STORAGE WARNING / FULL POPUPS */}
      <AnimatePresence>
        {showNearFullPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={isMaterialDesignActive ? { duration: 0.25 } : (dynamicMotion ? { duration: 0.35, ease: [0.16, 1, 0.3, 1] } : { duration: 0 })}
            className="fixed inset-0 bg-black/60 backdrop-blur-[15px] z-[120] flex items-center justify-center p-4"
          >
            <motion.div
              initial={isMaterialDesignActive ? { opacity: 0 } : { opacity: 0, scale: 1.15 }}
              animate={isMaterialDesignActive ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={isMaterialDesignActive ? { opacity: 0 } : { opacity: 0, scale: 1.15 }}
              transition={isMaterialDesignActive ? { duration: 0.25 } : (dynamicMotion ? { duration: 0.45, ease: [0.16, 1, 0.3, 1] } : { duration: 0 })}
              className={`w-full max-w-[420px] relative text-left transform-gpu ${
                isMaterialDesignActive
                  ? "rounded-[28px] bg-[#211f26] p-6 shadow-2xl border-0 text-[#e6e1e5]"
                  : "rounded-[30px] bg-[#1c1c1e]/95 p-6 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15),0_24px_48px_rgba(0,0,0,0.4)] border border-white/10 text-white"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-full bg-amber-500/10 text-amber-400">
                  <HardDrive className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className={`text-[19px] font-bold tracking-tight leading-snug ${isMaterialDesignActive ? "text-[#e6e1e5]" : "text-white"}`}>
                  Ổ cứng sắp đầy
                </h3>
              </div>
              <p className={`text-[13px] mb-6 leading-relaxed ${isMaterialDesignActive ? "text-[#cac4d0]" : "text-white/70"}`}>
                Test Vplay là một ứng dụng dùng cho mục đích thử nghiệm và chỉ hỗ trợ sử dụng tối đa 3GB dữ liệu. Hãy dọn dẹp ổ cứng Vplay của bạn để sử dụng ứng dụng Test Vplay một cách mượt mà nhất
              </p>
              
              <div className="space-y-2.5">
                <button
                  onClick={handleCleanStorage}
                  className={`w-full py-3 px-4 rounded-full font-bold text-[14px] text-center cursor-default transform-gpu active:scale-95 transition-all duration-300 ${
                    isMaterialDesignActive
                      ? "bg-[#d0bcff] hover:bg-[#bfa8eb] text-[#381e72]"
                      : "bg-[#007aff] hover:bg-[#0066d6] text-white shadow-lg"
                  }`}
                >
                  Dọn dẹp ổ cứng
                </button>
                <button
                  onClick={() => setHasDismissedNearFull(true)}
                  className={`w-full py-3 px-4 rounded-full font-semibold text-[14px] text-center cursor-default transform-gpu active:scale-95 transition-all duration-300 ${
                    isMaterialDesignActive
                      ? "bg-white/5 hover:bg-white/10 text-[#e6e1e5] border border-white/10"
                      : "bg-white/10 hover:bg-white/15 text-white"
                  }`}
                >
                  Tiếp tục sử dụng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFullPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={isMaterialDesignActive ? { duration: 0.25 } : (dynamicMotion ? { duration: 0.35, ease: [0.16, 1, 0.3, 1] } : { duration: 0 })}
            className="fixed inset-0 bg-black/80 backdrop-blur-[25px] z-[150] flex items-center justify-center p-4"
          >
            <motion.div
              initial={isMaterialDesignActive ? { opacity: 0 } : { opacity: 0, scale: 1.15 }}
              animate={isMaterialDesignActive ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={isMaterialDesignActive ? { opacity: 0 } : { opacity: 0, scale: 1.15 }}
              transition={isMaterialDesignActive ? { duration: 0.25 } : (dynamicMotion ? { duration: 0.45, ease: [0.16, 1, 0.3, 1] } : { duration: 0 })}
              className={`w-full max-w-[420px] relative text-left transform-gpu ${
                isMaterialDesignActive
                  ? "rounded-[28px] bg-[#211f26] p-6 shadow-2xl border-0 text-[#e6e1e5]"
                  : "rounded-[30px] bg-[#1c1c1e]/95 p-6 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15),0_24px_48px_rgba(0,0,0,0.5)] border border-white/10 text-white"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-full bg-red-500/10 text-red-400">
                  <HardDrive className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className={`text-[19px] font-bold tracking-tight leading-snug ${isMaterialDesignActive ? "text-[#e6e1e5]" : "text-white"}`}>
                  Ổ cứng đã đầy
                </h3>
              </div>
              <p className={`text-[13px] mb-6 leading-relaxed ${isMaterialDesignActive ? "text-[#cac4d0]" : "text-white/70"}`}>
                Test Vplay là một ứng dụng dùng cho mục đích thử nghiệm và chỉ hỗ trợ sử dụng tối đa 3GB dữ liệu. Hãy dọn dẹp ổ cứng Vplay của bạn để tiếp tục sử dụng ứng dụng Test Vplay. Quyền sử dụng Vplay sẽ tạm thời bị khóa cho đến khi ổ cứng của bạn được dọn dẹp.
              </p>
              
              <div className="space-y-2.5">
                <button
                  onClick={handleCleanStorage}
                  className={`w-full py-3 px-4 rounded-full font-bold text-[14px] text-center cursor-default transform-gpu active:scale-95 transition-all duration-300 ${
                    isMaterialDesignActive
                      ? "bg-[#d0bcff] hover:bg-[#bfa8eb] text-[#381e72]"
                      : "bg-[#007aff] hover:bg-[#0066d6] text-white shadow-lg"
                  }`}
                >
                  Dọn dẹp ổ cứng
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className={`w-full py-3 px-4 rounded-full font-semibold text-[14px] text-center cursor-default transform-gpu active:scale-95 transition-all duration-300 ${
                    isMaterialDesignActive
                      ? "bg-white/5 hover:bg-white/10 text-[#e6e1e5] border border-white/10"
                      : "bg-white/10 hover:bg-white/15 text-white"
                  }`}
                >
                  Tải lại trang
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STORAGE CLEANUP MODAL WITH ADVANCED FEATURES */}
      {renderCleanupModal()}
      {renderFocusChannelsModal()}

      {/* ABOUT VPLAY360 MODAL */}
      <AnimatePresence>
        {showAboutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={isMaterialDesignActive ? { duration: 0.25 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-black/50 backdrop-blur-[20px] z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={isMaterialDesignActive ? { opacity: 0 } : { opacity: 0, scale: 1.15 }}
              animate={isMaterialDesignActive ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={isMaterialDesignActive ? { opacity: 0 } : { opacity: 0, scale: 1.15 }}
              transition={isMaterialDesignActive ? { duration: 0.25 } : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full max-w-[350px] p-6 text-left transform-gpu ${
                isMaterialDesignActive
                  ? "rounded-[28px] bg-[#211f26] border-0 shadow-2xl text-[#e6e1e5]"
                  : "rounded-[30px] bg-[#120e24]/90 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.05),0_24px_48px_rgba(0,0,0,0.5)] border border-white/10 text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <img 
                  src="https://static.wikia.nocookie.net/ftv/images/a/ab/Imagexvxvz.png/revision/latest/scale-to-width-down/1000?cb=20260429082350&path-prefix=vi" 
                  alt="Vplay Brand Logo"
                  referrerPolicy="no-referrer"
                  className="h-7 w-auto object-contain"
                />
                <span className="font-sans font-black text-base bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent uppercase tracking-wider select-none">360</span>
              </div>
              
              <h3 className={`text-[17px] font-semibold tracking-tight leading-snug ${isMaterialDesignActive ? "text-[#e6e1e5]" : "text-white"}`}>
                Vplay360 - Version 2.4.0
              </h3>
              <p className={`text-[12px] mb-5 leading-relaxed mt-2 ${isMaterialDesignActive ? "text-[#cac4d0]" : "text-white/60"}`}>
                High-quality, low-latency online television streaming experience featuring a sleek, modern UI optimized for all devices.
              </p>
              
              <button
                onClick={() => setShowAboutModal(false)}
                className={`w-full py-3 px-4 rounded-full font-semibold text-center cursor-default transform-gpu ${
                  isMaterialDesignActive
                    ? "bg-[#d0bcff] hover:bg-[#bfa8eb] active:scale-95 transition-all text-[#381e72] text-[15px]"
                    : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 hover:scale-[1.03] active:scale-95 transition-all duration-300 text-white text-[14px] shadow-md"
                }`}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VTV5 VERSION SELECTION POPUP */}
      <AnimatePresence>
        {showVtv5Popup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={isMaterialDesignActive ? { duration: 0.25 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-black/25 backdrop-blur-[20px] z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={isMaterialDesignActive ? { opacity: 0 } : { opacity: 0, scale: 1.15 }}
              animate={isMaterialDesignActive ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={isMaterialDesignActive ? { opacity: 0 } : { opacity: 0, scale: 1.15 }}
              transition={isMaterialDesignActive ? { duration: 0.25 } : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full max-w-[380px] relative text-left transform-gpu ${
                isMaterialDesignActive
                  ? "rounded-[28px] bg-[#211f26] p-6 shadow-2xl border-0 text-[#e6e1e5]"
                  : "rounded-[30px] bg-[#e5e5ea]/85 p-6 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.45),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.2),0_24px_48px_rgba(0,0,0,0.12)] border border-white/20 text-black"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-[18px] font-semibold tracking-tight leading-snug ${isMaterialDesignActive ? "text-[#e6e1e5]" : "text-black"}`}>
                  Select Channel
                </h3>
                <button
                  onClick={() => setShowVtv5Popup(false)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors bouncy-btn ${
                    isMaterialDesignActive
                      ? "bg-white/10 hover:bg-white/15 text-[#e6e1e5] border-0"
                      : "bg-black/5 hover:bg-black/10 text-black/60 hover:text-black border border-black/5"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                {vtv5Options.map((opt) => {
                  const isCurrentPlaying = selectedChannel.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        handleSelectChannel(opt, true);
                        setActiveTab("live");
                        setShowVtv5Popup(false);
                      }}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left cursor-pointer transition-colors duration-200 bouncy-btn relative group overflow-hidden ${
                        isCurrentPlaying
                          ? (isMaterialDesignActive
                              ? "bg-[#d0bcff] text-[#381e72] border-0"
                              : "bg-white border-blue-500/30 text-black shadow-sm")
                          : (isMaterialDesignActive
                              ? "bg-[#36343b] hover:bg-[#49454f] border-0 text-white"
                              : "bg-white/45 hover:bg-white/75 border-black/5 hover:border-black/10")
                      }`}
                    >
                      {/* Content Middle */}
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h4 className={`font-semibold text-[14px] tracking-tight transition-colors truncate ${
                          isCurrentPlaying
                            ? (isMaterialDesignActive ? "text-[#381e72]" : "text-black group-hover:text-blue-600")
                            : (isMaterialDesignActive ? "text-[#e6e1e5]" : "text-black group-hover:text-blue-600")
                        }`}>
                          {opt.name}
                        </h4>
                        {isCurrentPlaying && (
                          <span className={`w-1.5 h-1.5 rounded-full animate-pulse shrink-0 ${isMaterialDesignActive ? "bg-[#381e72]" : "bg-blue-600"}`} />
                        )}
                      </div>

                      {/* Right Indicator */}
                      <div className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors shrink-0 ${
                        isMaterialDesignActive ? "bg-white/10" : "bg-black/5 group-hover:bg-black/10 border border-black/5"
                      }`}>
                        {isCurrentPlaying ? (
                          <Check className={`w-3.5 h-3.5 ${isMaterialDesignActive ? "text-[#381e72]" : "text-blue-600"}`} />
                        ) : (
                          <Play className={`w-3 h-3 ${isMaterialDesignActive ? "fill-[#e6e1e5] text-[#e6e1e5]" : "fill-black text-black translate-x-0.5 opacity-60 group-hover:opacity-100"} transition-opacity`} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowVtv5Popup(false)}
                  className={`w-full py-3 px-4 rounded-full font-semibold text-[15px] text-center cursor-default ${
                    isMaterialDesignActive
                      ? "text-[#ffb4ab] bg-transparent hover:bg-white/5 active:scale-95 transition-all"
                      : "bg-black/10 hover:bg-black/15 active:scale-95 transition-all text-[#ff3b30]"
                  }`}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MULTIVIEW SELECTOR POPUP */}
      <AnimatePresence>
        {showMultiviewSelectorPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={isMaterialDesignActive ? { duration: 0.25 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-black/50 backdrop-blur-[20px] z-[110] flex items-center justify-center p-4"
          >
            <motion.div
              initial={isMaterialDesignActive ? { opacity: 0 } : { opacity: 0, scale: 1.15 }}
              animate={isMaterialDesignActive ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={isMaterialDesignActive ? { opacity: 0 } : { opacity: 0, scale: 1.15 }}
              transition={isMaterialDesignActive ? { duration: 0.25 } : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full max-w-[420px] p-6 text-left transform-gpu ${
                isMaterialDesignActive
                  ? "rounded-[28px] bg-[#211f26] border-0 shadow-2xl text-[#e6e1e5]"
                  : "rounded-[30px] bg-[#120e24]/90 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.05),0_24px_48px_rgba(0,0,0,0.5)] border border-white/10 text-white"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Grid className={`w-5 h-5 ${isMaterialDesignActive ? "text-[#d0bcff]" : "text-indigo-400"}`} />
                  <h3 className={`text-[18px] font-semibold tracking-tight leading-snug ${isMaterialDesignActive ? "text-[#e6e1e5]" : "text-white"}`}>
                    Xem Multiview
                  </h3>
                </div>
                <button
                  onClick={() => setShowMultiviewSelectorPopup(false)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors bouncy-btn ${
                    isMaterialDesignActive
                      ? "bg-white/10 hover:bg-white/15 text-[#e6e1e5] border-0"
                      : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className={`text-[12px] mb-5 leading-relaxed ${isMaterialDesignActive ? "text-[#cac4d0]" : "text-white/60"}`}>
                Select the number of channel streams to view simultaneously (from 2 to 9). The grid splits evenly.
              </p>

              <div className="grid grid-cols-4 gap-3 mb-6">
                {[2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      handleSelectMultiviewCount(num);
                      setShowMultiviewSelectorPopup(false);
                    }}
                    className={`aspect-square flex flex-col items-center justify-center rounded-2xl transition-all cursor-pointer bouncy-btn ${
                      isMaterialDesignActive
                        ? "bg-[#36343b] hover:bg-[#49454f] text-white border-0"
                        : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-400/50 hover:text-indigo-300"
                    }`}
                  >
                    <span className={`text-xl font-bold ${isMaterialDesignActive ? "text-[#d0bcff]" : ""}`}>{num}</span>
                    <span className={`text-[10px] font-sans font-normal ${isMaterialDesignActive ? "text-[#cac4d0]" : "text-white/50"}`}>screens</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-2.5">
                <button
                  onClick={() => setShowMultiviewSelectorPopup(false)}
                  className={`px-5 py-2.5 rounded-full font-medium text-[13px] text-center cursor-default transition-all ${
                    isMaterialDesignActive
                      ? "text-[#ffb4ab] bg-transparent hover:bg-white/5"
                      : "bg-white/5 hover:bg-white/10 text-white"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MULTIVIEW CHANNEL PICKER POPUP */}
      <AnimatePresence>
        {showMultiviewChannelPickerPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={isMaterialDesignActive ? { duration: 0.25 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-black/55 backdrop-blur-[20px] z-[120] flex items-center justify-center p-4"
          >
            <motion.div
              initial={isMaterialDesignActive ? { opacity: 0 } : { opacity: 0, scale: 1.12 }}
              animate={isMaterialDesignActive ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={isMaterialDesignActive ? { opacity: 0 } : { opacity: 0, scale: 1.12 }}
              transition={isMaterialDesignActive ? { duration: 0.25 } : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full max-w-4xl max-h-[85vh] p-6 flex flex-col text-left transform-gpu overflow-hidden ${
                isMaterialDesignActive
                  ? "rounded-[28px] bg-[#211f26] border-0 shadow-2xl text-[#e6e1e5]"
                  : "rounded-[30px] bg-[#120e24]/95 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.05),0_24px_48px_rgba(0,0,0,0.5)] border border-white/10 text-white"
              }`}
            >
              {/* Header */}
              <div className={`flex items-center justify-between pb-4 mb-4 shrink-0 border-b ${
                isMaterialDesignActive ? "border-white/10" : "border-white/10"
              }`}>
                <div className="flex items-center gap-2">
                  <Tv className={`w-5 h-5 ${isMaterialDesignActive ? "text-[#d0bcff]" : "text-indigo-400"}`} />
                  <h3 className={`text-[18px] font-semibold tracking-tight leading-snug ${isMaterialDesignActive ? "text-[#e6e1e5]" : "text-white"}`}>
                    Select channel for Frame {activeMultiviewSlotIndex !== null ? activeMultiviewSlotIndex + 1 : ""}
                  </h3>
                </div>
                <button
                  onClick={() => setShowMultiviewChannelPickerPopup(false)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors bouncy-btn ${
                    isMaterialDesignActive
                      ? "bg-white/10 hover:bg-white/15 text-[#e6e1e5] border-0"
                      : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search bar inside picker */}
              <div className="mb-4 relative shrink-0">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isMaterialDesignActive ? "text-[#cac4d0]" : "text-white/40"}`} />
                <input
                  type="text"
                  placeholder="Search channels to add..."
                  value={pickerSearchQuery}
                  onChange={(e) => setPickerSearchQuery(e.target.value)}
                  className={`w-full pl-11 pr-4 py-2.5 text-xs transition-all ${
                    isMaterialDesignActive
                      ? "rounded-xl bg-[#36343b] text-white placeholder-white/30 border-b-2 border-[#79747e] focus:border-[#d0bcff] focus:outline-none"
                      : "rounded-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 focus:outline-none text-white placeholder:text-white/30"
                  }`}
                />
              </div>

              {/* Scrollable Categories & Channel list */}
              <div className="flex-1 overflow-y-auto space-y-6 pr-1 pb-4">
                {/* Categorized channel list */}
                {filteredCategoriesForPicker.map((cat) => {
                  if (cat.channels.length === 0) return null;
                  return (
                    <div key={cat.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs sm:text-sm font-semibold tracking-tight uppercase ${isMaterialDesignActive ? "text-[#cac4d0]" : "text-white/80"}`}>
                          {cat.name}
                        </h4>
                        <span className={`text-[10px] sm:text-xs font-mono font-normal ${isMaterialDesignActive ? "text-[#cac4d0]/60" : "text-white/40"}`}>
                          {cat.channels.length} Channels
                        </span>
                      </div>

                      {/* Channel Card list - identical to live tab style */}
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                        {cat.channels.map((ch) => {
                          const isDacBiet = ch.group === "Đặc biệt";
                          return (
                            <button
                              key={ch.id}
                              onClick={() => {
                                handleSelectChannelForSlot(ch);
                                setShowMultiviewChannelPickerPopup(false);
                              }}
                              className={`group relative rounded-xl p-0.5 sm:p-1 cursor-pointer flex items-center justify-center h-[64px] sm:h-[80px] select-none text-left w-full transition-all duration-300 transform hover:scale-[1.02] ${
                                isMaterialDesignActive
                                  ? "bg-[#36343b] hover:bg-[#49454f] border-0 text-[#e6e1e5]"
                                  : (isDacBiet
                                      ? "bg-amber-500/5 border border-amber-400/30 hover:border-amber-400 hover:bg-amber-500/10"
                                      : "bg-white/5 border border-white/10 hover:border-white hover:bg-white/10")
                              }`}
                            >
                              {/* Premium Custom Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-black/95 backdrop-blur-md border border-white/10 text-white text-[10px] sm:text-[11px] font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 whitespace-nowrap z-[60] shadow-xl scale-95 group-hover:scale-100">
                                {t(ch.name)}
                              </div>
                              <div className="w-full h-full flex justify-center items-center overflow-hidden rounded-lg">
                                {ch.logoImg ? (
                                  <img
                                    src={ch.logoImg}
                                    alt={ch.name}
                                    referrerPolicy="no-referrer"
                                    className={getLogoImgClass(ch, "grid")}
                                  />
                                ) : (
                                  <div className={getLogoTextClass(ch)}>
                                     {ch.logoText}
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {filteredCategoriesForPicker.every(c => c.channels.length === 0) && (
                  <div className={`py-12 text-center text-xs ${isMaterialDesignActive ? "text-[#cac4d0]/40" : "text-white/40"}`}>
                    No channels matched your search keyword.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DRAGGABLE PICTURE-IN-PICTURE (PiP) FLOATING WINDOW */}
      <AnimatePresence>
        {isPiPActive && (
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0.05}
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed right-4 bottom-24 z-[100] w-[280px] xs:w-[320px] sm:w-[380px] aspect-video rounded-2xl border border-white/20 bg-black/95 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden flex flex-col select-none cursor-grab active:cursor-grabbing transform-gpu"
          >
            {/* PiP header with drag bar */}
            <div className="h-9 bg-black/60 px-3.5 flex items-center justify-between border-b border-white/10 text-white/80 shrink-0">
              <div className="flex items-center gap-1.5 truncate">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[11px] font-semibold truncate max-w-[160px] sm:max-w-[220px]">PiP: {selectedChannel.name}</span>
              </div>
              <div className="flex items-center gap-1 pointer-events-auto">
                <button
                  onClick={() => setIsPiPActive(false)}
                  className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                  title="Khôi phục về trình phát chính"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsPiPActive(false)}
                  className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                  title="Đóng PiP"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* PiP Player */}
            <div className="flex-1 w-full h-full relative overflow-hidden pointer-events-auto">
              <ChannelPlayer
                channel={selectedChannel}
                volume={volume}
                onVolumeChange={setVolume}
                muted={muted}
                onMutedChange={setMuted}
                onPlaybackError={() => {}}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isRemoteControlActive && (
        <VirtualRemoteControl
          isActive={isRemoteControlActive}
          onDisable={() => {
            setPlugins(prev => prev.map(p => p.id === "remote_control" ? { ...p, isActive: false } : p));
          }}
          channels={numberedChannels}
          onSelectChannel={(ch) => {
            handleSelectChannel(ch);
            setActiveTab("live");
          }}
        />
      )}

    </div>
    </MotionConfig>
  );
}
