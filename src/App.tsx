import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Search, 
  Heart, 
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
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CATEGORIES, Category, Channel, processedChannels } from "./data/channels";
import ChannelPlayer from "./components/ChannelPlayer";

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
    titleMain: "title:special_event.banner_bottom.name",
    titleSub: "",
    genreText: "SỰ KIỆN TRỰC TIẾP ĐẶC BIỆT",
    subSlogan: "BẢO TỒN ĐA DẠNG SINH HỌC QUỐC GIA",
    thumbnail: "https://cdn-images.vtv.vn/66349b6076cb4dee98746cf1/2026/06/20/cover-91667111629561629180275.png",
    channelId: "vietnam-wild-live",
    channelPlayName: "Vietnam Wild LIVE",
    ageRating: "Tất cả",
    ratingText: "Chất lượng HD | Trực tiếp VTVgo",
    vignetteLeft: "from-black/90 via-black/55 to-transparent",
    vignetteBottom: "from-[#07050f] via-[#07050f]/85 to-transparent",
    vignetteTop: "from-black/45 via-transparent to-transparent",
    description: "title:special_event.banner_desc.name",
    showCountdown: false,
    logo: "https://static.wikia.nocookie.net/ep-deo/images/6/64/Vtv_s%E1%BB%A7a.png/revision/latest?cb=20260625120702",
    btnText: "title:banner_button.name",
    btnIcon: "play"
  },
  {
    id: 1,
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
    vignetteBottom: "from-[#07050f] via-[#07050f]/85 to-transparent",
    vignetteTop: "from-black/45 via-transparent to-transparent",
    logo: "https://static.wikia.nocookie.net/logos/images/5/56/VTV6_logo_07.06.2026.png/revision/latest?cb=20260608073805&path-prefix=uk",
    description: "Các bản tin, chuyên mục, tường thuật về thể thao trong nước và quốc tế do Trung tâm Truyền hình Thể thao sản xuất, với mục tiêu thúc đẩy phong trào thể thao quần chúng, thể thao học đường, thể thao chuyên nghiệp phát triển tại Việt Nam cũng như hướng đến rèn luyện, nâng cao sức khỏe cộng đồng và phát triển toàn diện.",
    btnText: "Xem ngay",
    btnIcon: "play"
  },
  {
    id: 3,
    titleTop: "Chào mừng đến",
    titleMain: "Vplay Test Web!",
    titleSub: "",
    genreText: "ĐỐI NGOẠI & QUỐC TẾ",
    subSlogan: "CỬA SỔ THÔNG TIN RA THẾ GIỚI",
    thumbnail: "https://vtv4.vtv.vn/upload/news/3HOPA0OIS_vntoday1-79180073137201066112112-72441177075135673357555.jpg",
    channelId: "vn_today",
    channelPlayName: "Vietnam Today HD",
    ageRating: "Tất cả",
    ratingText: "Chất lượng HD | Đối ngoại quốc gia",
    vignetteLeft: "from-black/90 via-black/55 to-transparent",
    vignetteBottom: "from-[#07050f] via-[#07050f]/85 to-transparent",
    vignetteTop: "from-black/45 via-transparent to-transparent",
    logo: "https://static.wikia.nocookie.net/logos/images/c/c7/Vietnam_Today_vertical_v2.png/revision/latest?cb=20250813041048&path-prefix=vi",
    description: "Kể từ 28/06/2026, trang web xem truyền hình Vplay sẽ được chuyển đến tên miền mới **https://vplay-refresh.vercel.app**. Đối với miền trang web này sẽ trở thành **test-vplay.vercel.app**, là trang web thử nghiệm của Vplay để test trước, test sớm các tính năng mới cho web chính trong tương lai (app function, app features, luồng kênh, logo v.v). Chắc chắn web thử nghiệm sẽ nảy sinh cực kỳ nhiều lỗi, đội ngũ Vplay chỉ xin phép tiếp nhận các lỗi được báo cáo từ trang web chính, trang web thử nghiệm có thể không được sửa lỗi. Trân trọng.",
    btnText: "Xem ngay",
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
  const [activeTab, setActiveTab] = useState<"home" | "live" | "settings" | "search">("home");
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
    let dayStr = "";
    if (dayOfWeek === 0) {
      dayStr = "Chủ Nhật";
    } else {
      dayStr = `Thứ ${dayOfWeek + 1}`;
    }
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yy = String(date.getFullYear()).slice(-2);
    return `${dayStr} - ${dd}/${mm}/${yy}`;
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
      { ...(v5 || { id: "vtv5", name: "VTV5", url: "", group: "VTV", logoText: "VTV5", logoBg: "bg-gradient-to-br from-emerald-600 to-emerald-800" }), name: "VTV5 Quốc gia" },
      { ...(v5Tnb || { id: "vtv5_tnb", name: "VTV5 Tây Nam Bộ", url: "", group: "VTV", logoText: "VTV5 TNB", logoBg: "bg-gradient-to-br from-emerald-600 to-emerald-800" }), name: "VTV5 Tây Nam Bộ" },
      { ...(v5Tn || { id: "vtv5_tn", name: "VTV5 Tây Nguyên", url: "", group: "VTV", logoText: "VTV5 TN", logoBg: "bg-gradient-to-br from-emerald-600 to-emerald-800" }), name: "VTV5 Tây Nguyên" }
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
    }, 2000);
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
  const [customGroupInput, setCustomGroupInput] = useState<string>("Nhóm Kênh Mới");
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

  // Experimental states
  const [expLowLatency, setExpLowLatency] = useState<boolean>(() => localStorage.getItem("vplay_exp_lowlatency") === "true");
  const [expCache, setExpCache] = useState<boolean>(() => localStorage.getItem("vplay_exp_cache") === "true");
  const [expAmbientGlow, setExpAmbientGlow] = useState<boolean>(() => localStorage.getItem("vplay_exp_glow") === "true");
  const [testStreamUrl, setTestStreamUrl] = useState<string>("");

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

  // Tab Form States
  const [tabEditId, setTabEditId] = useState<string | null>(null);
  const [tabNameInput, setTabNameInput] = useState<string>("");
  const [tabIconInput, setTabIconInput] = useState<string>("Sparkles");
  const [tabCodeInput, setTabCodeInput] = useState<string>(
    "// Nhập mã xử lý JavaScript tại đây\n" +
    "setSelectedChannel({\n" +
    "  id: 'custom-live',\n" +
    "  name: 'My Custom Stream',\n" +
    "  url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',\n" +
    "  group: 'Cá nhân'\n" +
    "});\n" +
    "setActiveTab('live');"
  );
  const [tabHtmlInput, setTabHtmlInput] = useState<string>(
    "<div class='p-4 text-center'>\n" +
    "  <h3 class='text-sm font-bold text-indigo-400'>Kênh Truyền Hình Cá Nhân</h3>\n" +
    "  <p class='text-xs text-white/70 mt-1'>Chào mừng bạn đến với tab do bạn tự thiết kế!</p>\n" +
    "</div>"
  );

  // Modal Form States
  const [modalEditId, setModalEditId] = useState<string | null>(null);
  const [modalNameInput, setModalNameInput] = useState<string>("");
  const [modalIconInput, setModalIconInput] = useState<string>("Sparkles");
  const [modalCodeInput, setModalCodeInput] = useState<string>(
    "// Nhập mã xử lý khi click nút 'Chạy chức năng'\n" +
    "alert('Nút chức năng trong modal của bạn đã được nhấn!');"
  );
  const [modalHtmlInput, setModalHtmlInput] = useState<string>(
    "<div class='p-4 text-center space-y-2'>\n" +
    "  <h4 class='text-xs font-semibold text-amber-400'>CẢNH BÁO HỆ THỐNG</h4>\n" +
    "  <p class='text-xs text-white/70'>Đây là một hộp thoại pop-up thông báo tùy chỉnh.</p>\n" +
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
      name: "Kênh Tự Thêm (Cá Nhân)",
      description: "Danh sách luồng phát m3u8 tự liên kết",
      channels: customChannels
    };
    return [...CATEGORIES, customCategory];
  }, [customChannels]);

  // Flattened channel list for easy global lookup/search
  const flattenedChannels = useMemo(() => {
    return allAvailableCategoryList.flatMap(cat => cat.channels);
  }, [allAvailableCategoryList]);

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
      ? (customGroupInput.trim() || "Kênh Riêng") 
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
    setCustomGroupInput("Nhóm Kênh Mới");
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

  // Ambient backgrounds options config
  const getBgGradient = () => {
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

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[99999]">
        <svg className="animate-spin h-14 w-14 text-white" viewBox="0 0 50 50">
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
      </div>
    );
  }

  return (
    <div className={`min-h-screen text-white/95 pb-32 transition-colors duration-1000 overflow-x-clip ${getBgGradient()}`}>
      
      {/* Decorative ambient glowing circles */}
      {!amoledDark && (
        <>
          <div className="absolute top-24 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute top-1/2 right-10 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[130px] pointer-events-none"></div>
          <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        </>
      )}

      {/* TV360 STYLE CINEMATIC HEADER (Floating on Top - Displays on ALL tabs) */}
      {(activeTab !== "settings" || activeSettingSection === null) && (
        <header className="fixed top-0 inset-x-0 h-24 z-50 px-4 sm:px-8 md:px-12 flex items-center justify-between pointer-events-auto select-none transition-all duration-150">
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
              <div className="flex items-center gap-2 sm:gap-3 bg-white/5 border border-white/10 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-md shadow-inner select-none transition-all duration-300 hover:scale-105 font-google">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse animate-duration-1000" />
                <span className="text-xs sm:text-sm md:text-base font-bold tracking-wide text-white font-google drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                  {formatTime(time)}
                </span>
                <span className="hidden md:inline-block text-white text-xs sm:text-sm md:text-base font-bold pl-2.5 border-l border-white/10 font-google">
                  {formatDateVietnamese(time)}
                </span>
              </div>
            )}
          </div>

          {/* Right Side: notifications and profile card and Menu Dropdown */}
          <div className="relative z-10 flex items-center gap-3 sm:gap-4 md:gap-5">
            {/* Notification bell icon */}
            <button className="relative p-1.5 rounded-full hover:bg-white/10 text-white/85 hover:text-white transition-all cursor-pointer">
              <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 ring-2 ring-transparent animate-pulse" />
            </button>

            {/* User avatar displaying email info */}
            <div className="relative group/avatar flex items-center gap-2 cursor-pointer z-50">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-pink-500 via-indigo-600 to-teal-400 p-0.5 shadow-md">
                <div className="w-full h-full rounded-full bg-[#120e24] flex items-center justify-center select-none text-white">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90" />
                </div>
              </div>
              {/* Floating tooltip */}
              <div className="absolute right-0 top-10 pointer-events-none opacity-0 group-hover/avatar:opacity-100 group-hover/avatar:pointer-events-auto transition-all duration-300 bg-black/95 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 shadow-xl text-[10px] sm:text-xs text-white/90 whitespace-nowrap z-50">
                Tài khoản: <span className="font-extrabold text-pink-300">Thành viên Premium</span>
              </div>
            </div>

            {/* Top Menu Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setShowDropdownMenu(prev => !prev)}
                className="p-1.5 sm:p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-white/85 hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-95 duration-200"
                title="Menu"
              >
                <Menu className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </button>
              
              <AnimatePresence>
                {showDropdownMenu && (
                  <>
                    {/* Invisible Backdrop for click-away */}
                    <div className="fixed inset-0 z-40 cursor-default" onClick={() => setShowDropdownMenu(false)} />
                    
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
 
                      {/* Divider */}
                      <div className="border-t border-black/10 my-2" />
 
                      {/* About this version */}
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
 
                      {/* Reload app */}
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
 
                      {/* Thử nghiệm */}
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
 
                      {/* Xuất luồng kênh (Only visible on Live or VTVgo tab) */}
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
 
                      {/* Multiview & Picture-in-Picture (Only visible on Live tab) */}
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
 
                      {/* Open Settings */}
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
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>
      )}

      {/* SETTINGS DETAILS HEADER (Floating on Top - Exclusively inside settings sub-sections) */}
      {activeTab === "settings" && activeSettingSection !== null && (
        <header className="fixed top-0 inset-x-0 h-24 z-50 px-4 sm:px-8 md:px-12 flex items-center justify-between pointer-events-auto select-none">
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
              {activeSettingSection === "profile" && "Tài khoản & Dữ liệu"}
              {activeSettingSection === "accessibility" && "Trợ năng"}
              {activeSettingSection === "broadcast" && "Phát sóng"}
              {activeSettingSection === "experimental" && "Thử nghiệm & Tính năng mới"}
              {activeSettingSection === "design_system" && "Vplay Design System"}
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
                    <p className="text-sm font-semibold text-white/90 mb-1">Đang phát ở chế độ Picture in Picture</p>
                    <p className="text-xs text-white/50 mb-4 font-mono">{selectedChannel.name}</p>
                    <button
                      onClick={() => setIsPiPActive(false)}
                      className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all bouncy-btn shadow-lg cursor-pointer"
                    >
                      Quay lại trình phát chính
                    </button>
                  </div>
                ) : isMultiviewMode ? (
                  <div className="w-full max-w-5xl mx-auto aspect-video rounded-3xl bg-[#07050f]/40 border border-white/10 p-2 sm:p-4 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                    {/* Multiview top info and action bar */}
                    <div className="flex items-center justify-between mb-3 text-white">
                      <div className="flex items-center gap-2">
                        <Grid className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs sm:text-sm font-medium">Chế độ xem Multiview ({multiviewCount} khung)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowMultiviewSelectorPopup(true)}
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
                                  Khung {idx + 1}: {ch.name}
                                </div>
                                <div className="absolute top-2 right-2 z-30 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenChannelPickerForSlot(idx);
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
                                onClick={() => handleOpenChannelPickerForSlot(idx)}
                                className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/50 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] transition-all duration-200 cursor-pointer p-4 select-none"
                              >
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                  <Plus className="w-5 h-5 text-white/60 group-hover:text-white" />
                                </div>
                                <span className="text-xs font-normal">Khung {idx + 1} trống</span>
                                <span className="text-[10px] text-white/40">Bấm để chọn kênh</span>
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
                    title="Chia sẻ kênh này"
                  >
                    <img 
                      src="https://static.wikia.nocookie.net/ep-deo/images/1/10/Share.png/revision/latest?cb=20260625011333" 
                      className="w-3 sm:w-3.5 h-3 sm:h-3.5 brightness-0 invert opacity-90 object-contain" 
                      referrerPolicy="no-referrer"
                      alt="Share"
                    />
                    <span>Chia sẻ</span>
                  </button>

                  {/* TV button */}
                  <a
                    href={selectedChannel?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white flex items-center gap-1 sm:gap-1.5 shrink-0 shadow-lg cursor-default bouncy-btn animate-fade-in text-[10.5px] sm:text-xs font-normal"
                    title="Mở luồng phát gốc"
                  >
                    <Tv className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white opacity-90" />
                    <span>Mở luồng gốc</span>
                  </a>

                  {/* Add custom channel button */}
                  <button
                    onClick={() => setShowCustomModal(true)}
                    className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-[#ff9502] hover:bg-[#ffa31a] active:bg-[#e08300] text-white border-none text-[10.5px] sm:text-xs font-normal flex items-center gap-1 sm:gap-1.5 shrink-0 shadow-lg shadow-orange-500/15 cursor-default bouncy-btn"
                    title="Thêm link m3u8 của riêng bạn"
                  >
                    <Plus className="w-3 sm:w-3.5 h-3 sm:h-3.5 transition-transform duration-300 hover:rotate-90" />
                    <span>Thêm kênh</span>
                  </button>
                </div>

                {/* Glass Category Filter row - Nested inside sticky container so it stays hard locked on mobile */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 mt-3 mb-1 lg:mb-6 lg:pb-4 lg:mt-4 border-b lg:border-none border-white/5 scrollbar-none">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-normal whitespace-nowrap cursor-default bouncy-btn ${
                      selectedCategory === "all" ? "glass-pill-active" : "glass-pill text-white/60 hover:text-white"
                    }`}
                  >
                    Tất cả ({flattenedChannels.length})
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
              </div>
            </div>

            {/* CHANNELS ACCORDION LIST matching reference screenshot specs */}
            <div className="flex flex-col gap-10">
              {filteredCategories.length === 0 ? (
                <div className="py-20 text-center glass-panel rounded-2xl border border-white/10 max-w-xl mx-auto">
                  <HelpCircle className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/80 font-medium">Không tìm thấy kênh phù hợp</p>
                  <p className="text-white/40 text-xs mt-1">Hãy thử tìm với từ khoá khác hoặc thêm liên kết m3u8 mới.</p>
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
                        {category.channels.length} Kênh
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
                              isPlaying 
                                ? isDacBiet
                                  ? "bg-amber-400/10 backdrop-blur-lg border-[3.5px] border-amber-400"
                                  : "bg-white/20 backdrop-blur-lg border-[3.5px] border-white shadow-md shadow-pink-500/10" 
                                : isDacBiet
                                  ? "bg-amber-500/5 backdrop-blur-md border-2 border-white/10 hover:border-[3.5px] hover:border-amber-400"
                                  : "bg-white/5 backdrop-blur-md border-2 border-white/10 hover:border-[3.5px] hover:border-white"
                            }`}
                            title={ch.name}
                          >
                            {/* Logo Graphic Container - fills the box completely */}
                            <div className="w-full h-full flex justify-center items-center overflow-hidden rounded-lg">
                              {ch.logoImg ? (
                                <img
                                  src={ch.logoImg}
                                  alt={ch.name}
                                  referrerPolicy="no-referrer"
                                  className={`object-contain filter drop-shadow-md select-none pointer-events-none ${
                                    ch.id === "vietnam-wild-live" ? "w-[84%] h-[84%] p-0.5" : ch.id.startsWith("vinh_long") ? "w-[55%] h-[55%] p-1" : ch.group === "SCTV" ? "w-[60%] h-[60%] p-1" : ch.group === "VTVcab" ? "w-[82%] h-[82%] p-0.5" : "w-full h-full"
                                  }`}
                                />
                              ) : (
                                <div className={`w-full h-full flex items-center justify-center rounded-lg ${ch.logoBg} shadow-inner border border-white/10 font-bold text-white text-[9px] sm:text-xs tracking-wider text-center px-1`}>
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
                    <img 
                      src={homeSlides[currentSlide].thumbnail} 
                      alt={homeSlides[currentSlide].titleMain} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center md:object-right scale-102"
                    />
                    
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
                        <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Thời gian còn lại của sự kiện</span>
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
                     className="px-8 sm:px-10 py-3 sm:py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-normal shadow-xl hover:shadow-red-600/30 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer border border-red-500/10 bouncy-btn"
                  >
                    {homeSlides[currentSlide].btnIcon === "compass" ? (
                      <Compass className="w-4.5 h-4.5 text-white" />
                    ) : (
                      <Play className="w-4.5 h-4.5 fill-white text-white" />
                    )}
                    {homeSlides[currentSlide].btnText || "Thử ngay"}
                  </button>

                  {/* Slider indicator arrows and paging inside the banner */}
                  <div className="flex items-center gap-1.5 ml-2">
                    <button 
                      onClick={() => setCurrentSlide(prev => (prev - 1 + homeSlides.length) % homeSlides.length)}
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer flex items-center justify-center border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] bouncy-btn"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setCurrentSlide(prev => (prev + 1) % homeSlides.length)}
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
                            isPlaying 
                              ? "bg-white/20 backdrop-blur-lg border-[3.5px] border-white shadow-md shadow-pink-500/10" 
                              : "bg-white/5 backdrop-blur-md border-2 border-white/10 hover:border-[3.5px] hover:border-white"
                          }`}
                          title={ch.name}
                        >
                          {/* Logo Graphic Container - fills the box completely */}
                          <div className="w-full h-full flex justify-center items-center overflow-hidden rounded-lg">
                            {ch.logoImg ? (
                              <img
                                src={ch.logoImg}
                                alt={ch.name}
                                referrerPolicy="no-referrer"
                                className={`object-contain filter drop-shadow-md select-none pointer-events-none ${
                                  ch.id.startsWith("vinh_long") ? "w-[58%] h-[58%] p-1" : ch.group === "SCTV" ? "w-4/5 h-4/5 p-1.5" : ch.group === "VTVcab" ? "w-[82%] h-[82%] p-0.5" : "w-full h-full"
                                }`}
                              />
                            ) : (
                              <div className={`w-full h-full flex items-center justify-center rounded-lg ${ch.logoBg || "bg-emerald-600"} shadow-inner border border-white/10 font-bold text-white text-[9px] sm:text-xs tracking-wider text-center px-1`}>
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
                            <Heart className={`w-3.5 h-3.5 ${isFav ? "text-red-500 fill-red-500" : "text-white/70 hover:text-white"}`} />
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
                            isPlaying 
                              ? "bg-white/20 backdrop-blur-lg border-[3.5px] border-white shadow-md shadow-pink-500/10" 
                              : "bg-white/5 backdrop-blur-md border-2 border-white/10 hover:border-[3.5px] hover:border-white"
                          }`}
                          title={ch.name}
                        >
                          {/* Logo Graphic Container - fills the box completely */}
                          <div className="w-full h-full flex justify-center items-center overflow-hidden rounded-lg">
                            {ch.logoImg ? (
                              <img
                                src={ch.logoImg}
                                alt={ch.name}
                                referrerPolicy="no-referrer"
                                className={`object-contain filter drop-shadow-md select-none pointer-events-none ${
                                  ch.id.startsWith("vinh_long") ? "w-[58%] h-[58%] p-1" : ch.group === "SCTV" ? "w-4/5 h-4/5 p-1.5" : ch.group === "VTVcab" ? "w-[82%] h-[82%] p-0.5" : "w-full h-full"
                                }`}
                              />
                            ) : (
                              <div className={`w-full h-full flex items-center justify-center rounded-lg ${ch.logoBg || "bg-emerald-600"} shadow-inner border border-white/10 font-bold text-white text-[9px] sm:text-xs tracking-wider text-center px-1`}>
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
                            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
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
                { label: "Kênh Quốc Gia", value: "13 VTV HD", color: "text-cyan-400" },
                { label: "Tin Tức & Giải Trí", value: "19 VTVCab", color: "text-fuchsia-400" },
                { label: "Kênh TP.HCM & Độc Quyền", value: "15 HTV HD", color: "text-orange-400" },
                { label: "Kênh Địa Phương & Radio", value: "Gần 70+", color: "text-teal-400" },
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
                <Compass className="w-5 h-5 text-pink-400" /> Hướng Dẫn Sử Dụng Linh Hoạt
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-white/70">
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">1. Chọn kênh trực tiếp</h4>
                  <p className="leading-relaxed text-xs text-white/60">Nhấp vào bất kỳ thẻ kênh nào để tải chương trình phát trực tiếp ở mục 'Truyền hình'.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">2. Thư viện Yêu Thích</h4>
                  <p className="leading-relaxed text-xs text-white/60">Nhấp biểu tượng hình ngôi sao trên mỗi ô kênh để lưu kênh vào mục Yêu Thích, hiển thị tức thì trên Trang Chủ này.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">3. Tùy biến phát luồng m3u8</h4>
                  <p className="leading-relaxed text-xs text-white/60">Nhấn nút 'Thêm kênh' ở góc phải ô tìm kiếm để dán luồng ngoài m3u8 của riêng bạn cực kì thuận tiện.</p>
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
                        <p className="text-xs text-white/50">Giao diện hiển thị của Tab tự thiết kế</p>
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
                          alert(`Lỗi thực thi script: ${err.message}`);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs transition-colors shadow-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Chạy chức năng
                    </button>
                  </div>

                  {currentCustomTab.htmlContent ? (
                    <div 
                      className="p-4 rounded-2xl bg-black/30 border border-white/5 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: currentCustomTab.htmlContent }}
                    />
                  ) : (
                    <div className="p-6 rounded-2xl bg-black/20 border border-white/5 text-center text-sm text-white/40">
                      Chưa định nghĩa giao diện HTML. Nhấp nút 'Chạy chức năng' ở góc trên để khởi chạy script xử lý của bạn.
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <div className="text-[10px] text-white/40 font-mono font-bold tracking-wider uppercase">Script đã lưu</div>
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
                          <h3 className="text-base font-semibold text-white tracking-tight">{sec.title}</h3>
                          <p className="text-[11.5px] sm:text-xs text-white/60 mt-0.5 leading-relaxed truncate">{sec.subtitle}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/45 shrink-0" />
                      </button>
                    );
                  })}

                  {/* Developer Options Heading */}
                  <div className="pt-4 pb-1.5 px-2 flex items-center gap-2 text-white/50 text-[11px] font-bold tracking-wider uppercase select-none font-sans">
                    <Cpu className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>settings.section.developeroptions.title</span>
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
                      subtitle: "Tự tạo Tab cá nhân hóa với Icon, Tên, HTML và Script tùy chỉnh",
                      icon: Plus,
                    },
                    {
                      id: "custom_modal",
                      title: "Create custom modal",
                      subtitle: "Tự tạo hộp thoại Pop-up với Giao diện và Logic chức năng riêng",
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
                          <h3 className="text-base font-semibold text-white tracking-tight">{sec.title}</h3>
                          <p className="text-[11.5px] sm:text-xs text-white/60 mt-0.5 leading-relaxed truncate">{sec.subtitle}</p>
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
                            { id: "deep", name: "Tối giản", color: "from-neutral-800 to-slate-900" },
                            { id: "aurora", name: "Cực quang", color: "from-teal-600 to-lime-900" },
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
                            <span className="font-mono text-amber-300 font-bold bg-white/5 px-2 py-0.5 rounded">{favorites.length} kênh</span>
                          </div>
                          {favorites.length > 0 && (
                            <button 
                              onClick={() => {
                                if (confirm("Bạn có đồng ý xóa toàn bộ danh mục yêu thích?")) {
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
                            <span className="font-mono text-indigo-300 font-bold bg-white/5 px-2 py-0.5 rounded">{customChannels.length} kênh</span>
                          </div>
                          {customChannels.length > 0 && (
                            <button 
                              onClick={() => {
                                if (confirm("Bạn có đồng ý xóa tất cả các kênh tự thêm?")) {
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
                        {/* Option: Tự động trượt hình */}
                        <div className="p-5 rounded-[15px] bg-white/5 border border-white/10 space-y-4">
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-white">settings.accessibility.AutoSlide.title</h4>
                            <p className="text-xs text-white/60 leading-relaxed">settings.accessibility.AutoSlide.subtitle</p>
                          </div>
                          
                          <div className="flex items-center">
                            <button
                              onClick={() => setAutoSlide(!autoSlide)}
                              className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none relative cursor-pointer flex items-center ${
                                autoSlide ? "bg-[#34c759]" : "bg-[#3a3a3c]"
                              }`}
                            >
                              <motion.div
                                animate={{ x: autoSlide ? 20 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="relative w-6 h-5 flex items-center justify-center group"
                              >
                                {/* Outer hover halo/bubble (capsule-shaped matching the pill, expanding on hover) */}
                                <div className="absolute -inset-2 rounded-full bg-white/15 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 pointer-events-none" />
                                
                                {/* Knob - horizontal pill shape */}
                                <div className="w-full h-full rounded-full bg-white border border-transparent transition-all duration-300 shadow-md z-10 group-hover:scale-110 group-hover:bg-transparent group-hover:backdrop-blur-md group-hover:border-white/95" />
                              </motion.div>
                            </button>
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
                        {/* Option 1: Low Latency */}
                        <div className="p-5 rounded-[15px] bg-white/5 border border-white/10 flex items-center justify-between">
                          <div className="space-y-1 pr-4 text-left">
                            <h4 className="text-sm font-semibold text-white">settings.experimental.LowLatency.title</h4>
                            <p className="text-xs text-white/60 leading-relaxed">settings.experimental.LowLatency.subtitle</p>
                          </div>
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
                        </div>

                        {/* Option 2: Stream Cache */}
                        <div className="p-5 rounded-[15px] bg-white/5 border border-white/10 flex items-center justify-between">
                          <div className="space-y-1 pr-4 text-left">
                            <h4 className="text-sm font-semibold text-white">settings.experimental.StreamCache.title</h4>
                            <p className="text-xs text-white/60 leading-relaxed">settings.experimental.StreamCache.subtitle</p>
                          </div>
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
                        </div>

                        {/* Option 3: Ambient Glow */}
                        <div className="p-5 rounded-[15px] bg-white/5 border border-white/10 flex items-center justify-between">
                          <div className="space-y-1 pr-4 text-left">
                            <h4 className="text-sm font-semibold text-white">settings.experimental.AmbientGlow.title</h4>
                            <p className="text-xs text-white/60 leading-relaxed">settings.experimental.AmbientGlow.subtitle</p>
                          </div>
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
                          <p className="text-xs text-white/60">Tự tạo Tab cá nhân hóa với Icon, Tên, Giao diện HTML và Script xử lý JavaScript tùy chỉnh.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left: Saved Tabs List */}
                        <div className="lg:col-span-5 space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">Danh sách Tab đã tạo ({customTabs.length})</h4>
                          {customTabs.length === 0 ? (
                            <div className="p-6 rounded-[15px] bg-white/5 border border-dashed border-white/10 text-center text-xs text-white/40">
                              Chưa có tab tùy chỉnh nào được tạo. Sử dụng biểu mẫu bên phải để bắt đầu sáng tạo!
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
                                        title="Chỉnh sửa"
                                      >
                                        <Pen className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm(`Bạn có chắc chắn muốn xóa tab "${t.name}"?`)) {
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
                                        title="Xóa"
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
                            {tabEditId ? "Chỉnh sửa Tab tùy chỉnh" : "Thiết kế Tab mới"}
                          </h4>

                          {/* Tab Name */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-white/80 block">Tên Tab hiển thị</label>
                            <input
                              type="text"
                              value={tabNameInput}
                              onChange={(e) => setTabNameInput(e.target.value)}
                              placeholder="Ví dụ: My Live channels, TV Cá Nhân..."
                              className="w-full px-4 py-2.5 rounded-[12px] bg-white/10 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            />
                          </div>

                          {/* Icon Selection */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/80 block">Chọn biểu tượng (Icon)</label>
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
                              <label className="text-xs font-semibold text-white/80 block">Giao diện Tab (HTML Tùy chọn)</label>
                              <span className="text-[10px] text-white/40">Hỗ trợ các thẻ HTML cơ bản</span>
                            </div>
                            <textarea
                              value={tabHtmlInput}
                              onChange={(e) => setTabHtmlInput(e.target.value)}
                              placeholder="Nhập mã HTML tùy biến..."
                              className="w-full h-24 p-3 rounded-[12px] bg-white/10 border border-white/10 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
                            />
                          </div>

                          {/* Script Logic */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-semibold text-white/80 block">Mã Function xử lý (JavaScript)</label>
                              <span className="text-[10px] text-amber-300 font-semibold">Chạy khi mở Tab hoặc click nút kích hoạt</span>
                            </div>
                            <textarea
                              value={tabCodeInput}
                              onChange={(e) => setTabCodeInput(e.target.value)}
                              placeholder="Nhập mã JavaScript..."
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
                                setTabCodeInput("// Nhập mã xử lý JavaScript tại đây\n");
                                setTabHtmlInput("");
                              }}
                              className="px-4 py-2.5 rounded-[12px] bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
                            >
                              Làm mới
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!tabNameInput.trim()) {
                                  alert("Vui lòng nhập tên Tab hiển thị!");
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
                                setTabCodeInput("// Nhập mã xử lý JavaScript tại đây\n");
                                setTabHtmlInput("");
                              }}
                              className="px-5 py-2.5 rounded-[12px] bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-lg shadow-indigo-600/25 flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Lưu Tab
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
                          <p className="text-xs text-white/60">Tự tạo hộp thoại Pop-up với Giao diện, Biểu tượng và Logic chức năng JavaScript riêng biệt.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left: Saved Modals List */}
                        <div className="lg:col-span-5 space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">Danh sách Modal đã tạo ({customModals.length})</h4>
                          {customModals.length === 0 ? (
                            <div className="p-6 rounded-[15px] bg-white/5 border border-dashed border-white/10 text-center text-xs text-white/40">
                              Chưa có modal tùy chỉnh nào được tạo. Hãy thiết kế ngay ở biểu mẫu bên phải!
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
                                        title="Kích hoạt/Mở thử"
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
                                        title="Chỉnh sửa"
                                      >
                                        <Pen className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm(`Bạn có chắc chắn muốn xóa modal "${m.name}"?`)) {
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
                                        title="Xóa"
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
                            {modalEditId ? "Chỉnh sửa Modal tùy chỉnh" : "Thiết kế Modal mới"}
                          </h4>

                          {/* Modal Name */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-white/80 block">Tiêu đề Modal (Title)</label>
                            <input
                              type="text"
                              value={modalNameInput}
                              onChange={(e) => setModalNameInput(e.target.value)}
                              placeholder="Ví dụ: Lưu ý xem tivi, Thông báo chung..."
                              className="w-full px-4 py-2.5 rounded-[12px] bg-white/10 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            />
                          </div>

                          {/* Icon Selection */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/80 block">Chọn biểu tượng (Icon)</label>
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
                              <label className="text-xs font-semibold text-white/80 block">Giao diện bên trong Modal (HTML Tùy chọn)</label>
                              <span className="text-[10px] text-white/40">Giao diện nội dung hộp thoại</span>
                            </div>
                            <textarea
                              value={modalHtmlInput}
                              onChange={(e) => setModalHtmlInput(e.target.value)}
                              placeholder="Nhập mã HTML..."
                              className="w-full h-24 p-3 rounded-[12px] bg-white/10 border border-white/10 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
                            />
                          </div>

                          {/* Script Logic */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-semibold text-white/80 block">Script xử lý khi click nút chính (JavaScript)</label>
                              <span className="text-[10px] text-amber-300 font-semibold font-mono">Chạy khi click 'Chạy chức năng'</span>
                            </div>
                            <textarea
                              value={modalCodeInput}
                              onChange={(e) => setModalCodeInput(e.target.value)}
                              placeholder="Nhập mã JavaScript..."
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
                                setModalCodeInput("// Nhập mã xử lý JavaScript tại đây\n");
                                setModalHtmlInput("");
                              }}
                              className="px-4 py-2.5 rounded-[12px] bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
                            >
                              Làm mới
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!modalNameInput.trim()) {
                                  alert("Vui lòng nhập tên tiêu đề Modal!");
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
                                setModalCodeInput("// Nhập mã xử lý JavaScript tại đây\n");
                                setModalHtmlInput("");
                              }}
                              className="px-5 py-2.5 rounded-[12px] bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-lg shadow-indigo-600/25 flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Lưu Modal
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
                        <div className="relative rounded-[20px] p-[1.5px] bg-gradient-to-br from-white/35 via-white/5 to-white/25 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.4),0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                          <div className="rounded-[18.5px] bg-[#07050f]/60 p-6 space-y-4">
                            <div className="text-left">
                              <h4 className="text-sm font-semibold text-white tracking-wide border-b border-white/5 pb-2">Button</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                              {/* State: Default */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-white/50 text-left">Default</span>
                                  <div className="flex items-center justify-center h-full">
                                    <span className="px-5 py-2.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-white select-none shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)]">
                                      Placeholder
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* State: Hover */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-teal-400 text-left">Hover</span>
                                  <div className="flex items-center justify-center h-full">
                                    <span className="px-5 py-2.5 rounded-full bg-white/20 border border-white/20 text-xs font-semibold text-white select-none shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.85),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.4),0_8px_20px_rgba(255,255,255,0.15)] scale-[1.18] transition-all duration-300">
                                      Placeholder
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* State: Pressed */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-indigo-400 text-left">Pressed</span>
                                  <div className="flex items-center justify-center h-full">
                                    <span className="px-5 py-2.5 rounded-full bg-white/30 border border-white/30 text-xs font-semibold text-white select-none shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.9),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.5)] scale-[1.28] transition-all duration-300">
                                      Placeholder
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Live Playground */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-indigo-500/30 via-transparent to-indigo-500/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.2)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-indigo-500/10 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-indigo-300 text-left">Live interaction</span>
                                  <div className="flex items-center justify-center h-full">
                                    <button className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/15 text-xs font-semibold text-white shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] cursor-pointer bouncy-btn">
                                      Interact me
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 2. SLIDER */}
                        <div className="relative rounded-[20px] p-[1.5px] bg-gradient-to-br from-white/35 via-white/5 to-white/25 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.4),0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                          <div className="rounded-[18.5px] bg-[#07050f]/60 p-6 space-y-4">
                            <div className="text-left">
                              <h4 className="text-sm font-semibold text-white tracking-wide border-b border-white/5 pb-2">Slider</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                              {/* State: Default */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-white/50 text-left">Default</span>
                                  <div className="flex items-center justify-center h-full px-2">
                                    <div className="relative w-full h-1 bg-white/10 rounded-full">
                                      <div className="bg-[#0084ff] h-full w-[45%] rounded-full" />
                                      <div className="absolute top-1/2 left-[45%] -translate-y-1/2 -translate-x-1/2 w-6 h-2 rounded-full bg-white shadow-md border border-white/70" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* State: Hover */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-teal-400 text-left">Hover</span>
                                  <div className="flex items-center justify-center h-full px-2">
                                    <div className="relative w-full h-1 bg-white/15 rounded-full">
                                      <div className="bg-[#0084ff] h-full w-[45%] rounded-full" />
                                      <div className="absolute top-1/2 left-[45%] -translate-y-1/2 -translate-x-1/2 w-7 h-2.5 rounded-full bg-white shadow-lg scale-110 transition-all" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* State: Pressed */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-indigo-400 text-left">Pressed</span>
                                  <div className="flex items-center justify-center h-full px-2">
                                    <div className="relative w-full h-1 bg-white/20 rounded-full">
                                      <div className="bg-[#0084ff] h-full w-[45%] rounded-full" />
                                      <div className="absolute top-1/2 left-[45%] -translate-y-1/2 -translate-x-1/2 w-8 h-3 rounded-full bg-white shadow-2xl scale-120 transition-all" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Live Playground */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-indigo-500/30 via-transparent to-indigo-500/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.2)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-indigo-500/10 rounded-[11px] h-full flex flex-col justify-between">
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
                                          background: `linear-gradient(to right, #0084ff ${demoSliderVal * 100}%, rgba(255, 255, 255, 0.2) ${demoSliderVal * 100}%)`
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
                        <div className="relative rounded-[20px] p-[1.5px] bg-gradient-to-br from-white/35 via-white/5 to-white/25 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.4),0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                          <div className="rounded-[18.5px] bg-[#07050f]/60 p-6 space-y-4">
                            <div className="text-left">
                              <h4 className="text-sm font-semibold text-white tracking-wide border-b border-white/5 pb-2">Toggle Switch</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                              {/* State: Default / Off */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-white/50 text-left">Default</span>
                                  <div className="flex items-center justify-center h-full">
                                    <div className="w-12 h-6 rounded-full p-0.5 bg-[#3a3a3c] flex items-center">
                                      <div className="relative w-6 h-5 flex items-center justify-center">
                                        <div className="w-full h-full rounded-full bg-white shadow-md" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* State: Hover */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-teal-400 text-left">Hover</span>
                                  <div className="flex items-center justify-center h-full">
                                    <div className="w-12 h-6 rounded-full p-0.5 bg-[#3a3a3c] flex items-center">
                                      <div className="relative w-6 h-5 flex items-center justify-center scale-110 transition-all">
                                        <div className="absolute -inset-2 rounded-full bg-white/15 scale-100 transition-all pointer-events-none" />
                                        <div className="w-full h-full rounded-full bg-transparent border-white border backdrop-blur-md shadow-md" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* State: Pressed / On */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-indigo-400 text-left">Pressed</span>
                                  <div className="flex items-center justify-center h-full">
                                    <div className="w-12 h-6 rounded-full p-0.5 bg-[#34c759] flex items-center justify-end">
                                      <div className="relative w-6 h-5 flex items-center justify-center">
                                        <div className="w-full h-full rounded-full bg-white shadow-md" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Live Playground */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-indigo-500/30 via-transparent to-indigo-500/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.2)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-indigo-500/10 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-indigo-300 text-left">Live interaction</span>
                                  <div className="flex items-center justify-center h-full">
                                    <button
                                      onClick={() => setDemoToggleState(!demoToggleState)}
                                      className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none relative cursor-pointer flex items-center ${
                                        demoToggleState ? "bg-[#34c759]" : "bg-[#3a3a3c]"
                                      }`}
                                    >
                                      <motion.div
                                        animate={{ x: demoToggleState ? 20 : 0 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        className="relative w-6 h-5 flex items-center justify-center group"
                                      >
                                        <div className="absolute -inset-2 rounded-full bg-white/15 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 pointer-events-none" />
                                        <div className="w-full h-full rounded-full bg-white border border-transparent transition-all duration-300 shadow-md z-10 group-hover:scale-110 group-hover:bg-transparent group-hover:backdrop-blur-md group-hover:border-white/95" />
                                      </motion.div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 4. DROPDOWN MENU */}
                        <div className="relative rounded-[20px] p-[1.5px] bg-gradient-to-br from-white/35 via-white/5 to-white/25 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.4),0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                          <div className="rounded-[18.5px] bg-[#07050f]/60 p-6 space-y-4">
                            <div className="text-left">
                              <h4 className="text-sm font-semibold text-white tracking-wide border-b border-white/5 pb-2">Dropdown Menu</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                              {/* State: Default */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between min-h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-white/50 text-left">Default</span>
                                  <div className="py-2.5 px-4 rounded-xl bg-white/5 text-xs text-white/80 flex items-center gap-2.5 select-none text-left mt-2">
                                    <Clock className="w-4 h-4 text-white/60" />
                                    <span>Placeholder Item</span>
                                  </div>
                                </div>
                              </div>

                              {/* State: Hover */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between min-h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-teal-400 text-left">Hover</span>
                                  <div className="py-2.5 px-4 rounded-xl bg-white/15 text-xs text-white flex items-center justify-between gap-2.5 select-none shadow-sm text-left mt-2">
                                    <div className="flex items-center gap-2.5">
                                      <Clock className="w-4 h-4 text-white" />
                                      <span>Placeholder Item</span>
                                    </div>
                                    <Check className="w-4 h-4 text-teal-400 stroke-[3]" />
                                  </div>
                                </div>
                              </div>

                              {/* State: Pressed */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between min-h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-indigo-400 text-left">Pressed</span>
                                  <div className="py-2.5 px-4 rounded-xl bg-white/25 text-xs text-white/70 flex items-center gap-2.5 scale-97 select-none text-left mt-2">
                                    <Clock className="w-4 h-4 text-white/40" />
                                    <span>Placeholder Item</span>
                                  </div>
                                </div>
                              </div>

                              {/* Live Playground */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-indigo-500/30 via-transparent to-indigo-500/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.2)] flex flex-col justify-between min-h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-indigo-500/10 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-indigo-300 text-left">Live interaction</span>
                                  <div className="relative group mt-2">
                                    <button className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/15 active:bg-white/25 text-xs text-white/95 hover:text-white flex items-center justify-between gap-2.5 transition-all duration-150 active:scale-97 cursor-pointer text-left">
                                      <span className="flex items-center gap-2.5">
                                        <Clock className="w-4 h-4 text-indigo-300" />
                                        <span>Placeholder Item</span>
                                      </span>
                                      <Check className="w-4 h-4 text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 5. DOCK */}
                        <div className="relative rounded-[20px] p-[1.5px] bg-gradient-to-br from-white/35 via-white/5 to-white/25 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.4),0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                          <div className="rounded-[18.5px] bg-[#07050f]/60 p-6 space-y-4">
                            <div className="text-left">
                              <h4 className="text-sm font-semibold text-white tracking-wide border-b border-white/5 pb-2">Dock</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                              {/* State: Default */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between min-h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-white/50 text-left">Default</span>
                                  <div className="flex items-center justify-center py-2 h-full">
                                    <div className="relative flex flex-col items-center justify-center h-12 w-20 text-white/65">
                                      <Home className="w-6 h-6 stroke-[1.8]" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* State: Hover */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between min-h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-teal-400 text-left">Hover</span>
                                  <div className="flex items-center justify-center py-2 h-full">
                                    <div className="relative flex flex-col items-center justify-center h-12 w-20 text-white scale-[1.18] transition-transform duration-300">
                                      <Home className="w-6 h-6 stroke-[2]" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* State: Pressed */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between min-h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-indigo-400 text-left">Pressed</span>
                                  <div className="flex items-center justify-center py-2 h-full">
                                    <div className="relative flex flex-col items-center justify-center h-12 w-20 text-indigo-950 font-medium z-10 scale-[1.05] transition-all">
                                      <div className="absolute inset-0 bg-white/50 rounded-full shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.8),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.15)] -z-10" />
                                      <Home className="w-6 h-6 stroke-[2.2] text-indigo-950" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Live Playground */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-indigo-500/30 via-transparent to-indigo-500/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.2)] flex flex-col justify-between min-h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-indigo-500/10 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-indigo-300 text-left">Live interaction</span>
                                  <div className="flex items-center justify-center h-full">
                                    <div className="h-14 rounded-full bg-white/[0.12] backdrop-blur-[25px] saturate-[185%] border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3),0_10px_30px_rgba(0,0,0,0.3)] flex items-center justify-around px-2 py-1 relative w-full max-w-[200px]">
                                      {[
                                        { id: "home", icon: Home, label: "Home" },
                                        { id: "live", icon: Compass, label: "Trực tiếp" }
                                      ].map((tab) => {
                                        const isActive = activeDockDemoTab === tab.id;
                                        const Icon = tab.icon;
                                        return (
                                          <button
                                            key={tab.id}
                                            onClick={() => setActiveDockDemoTab(tab.id)}
                                            className={`relative flex flex-col items-center justify-center flex-1 h-full cursor-pointer z-10 bouncy-btn px-2 transition-all duration-300 ${
                                              isActive ? "text-indigo-950 font-normal" : "text-white/65 hover:text-white"
                                            }`}
                                          >
                                            {isActive && (
                                              <motion.div
                                                layoutId="demoActiveTabPill"
                                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                                className="absolute inset-y-1 inset-x-1 bg-white/50 rounded-full shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.8),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.15)] -z-10"
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
                        <div className="relative rounded-[20px] p-[1.5px] bg-gradient-to-br from-white/35 via-white/5 to-white/25 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.4),0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                          <div className="rounded-[18.5px] bg-[#07050f]/60 p-6 space-y-4">
                            <div className="text-left">
                              <h4 className="text-sm font-semibold text-white tracking-wide border-b border-white/5 pb-2">Checkbox</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                              {/* State: Default */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-white/50 text-left">Default</span>
                                  <div className="flex items-center justify-center h-full">
                                    <div className="relative w-5 h-5 rounded-md p-[1px] bg-gradient-to-br from-white/40 to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.2)]">
                                      <div className="w-full h-full rounded-[5px] bg-[#07050f]/40" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* State: Hover */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-teal-400 text-left">Hover</span>
                                  <div className="flex items-center justify-center h-full">
                                    <div className="relative w-5 h-5 rounded-md p-[1px] bg-gradient-to-br from-teal-400/50 to-white/25 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.4)] scale-110 transition-all">
                                      <div className="w-full h-full rounded-[5px] bg-[#07050f]/20" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* State: Pressed */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-white/5 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-indigo-400 text-left">Pressed</span>
                                  <div className="flex items-center justify-center h-full">
                                    <div className="relative w-5 h-5 rounded-md p-[1px] bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.4)]">
                                      <div className="w-full h-full rounded-[5px] bg-indigo-500 flex items-center justify-center">
                                        <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Live Playground */}
                              <div className="relative rounded-[12px] p-[1px] bg-gradient-to-br from-indigo-500/30 via-transparent to-indigo-500/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.2)] flex flex-col justify-between h-28 overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-indigo-500/10 rounded-[11px] h-full flex flex-col justify-between">
                                  <span className="text-[11px] font-semibold text-indigo-300 text-left">Live interaction</span>
                                  <div className="flex items-center justify-center h-full">
                                    <button 
                                      onClick={() => setExpCache(!expCache)}
                                      className="focus:outline-none transition-all flex items-center justify-center cursor-pointer relative"
                                    >
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

                  {activeSettingSection !== "appearance" && activeSettingSection !== "profile" && activeSettingSection !== "accessibility" && activeSettingSection !== "experimental" && activeSettingSection !== "design_system" && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Sparkles className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2">Coming Soon</h3>
                      <p className="text-xs text-white/60 max-w-xs mx-auto leading-relaxed">
                        Tính năng này đang được phát triển tích cực và sẽ sớm ra mắt trong phiên bản tiếp theo của Vplay.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      </main>

      {/* High-fidelity progressive vintage blur backplate for Bottom Navigation Dock */}
      <div className="fixed bottom-0 inset-x-0 h-28 pointer-events-none z-40">
        <div className="progressive-blur-dock" />
      </div>

      <nav id="bottom-dock-container" className="fixed bottom-6 inset-x-0 mx-auto w-11/12 max-w-[420px] z-50 h-16 transform-gpu">
        <AnimatePresence mode="wait">
          {activeTab === "search" ? (
            <motion.div
              key="search-bar-dock"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-16 rounded-full bg-white/[0.12] backdrop-blur-[25px] saturate-[185%] border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3),0_25px_50px_-12px_rgba(0,0,0,0.9)] flex items-center px-4 gap-2 relative transform-gpu"
            >
              <img 
                src="https://static.wikia.nocookie.net/ftv/images/d/dc/Ass_glass.svg/revision/latest?cb=20260612062405&path-prefix=vi" 
                className="w-5.5 h-5.5 brightness-0 invert opacity-95 z-20 pointer-events-none object-contain ml-1" 
                referrerPolicy="no-referrer"
                alt="Search"
              />
              <input
                type="text"
                placeholder="home.search.placeholder"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none placeholder-white/40 px-1 font-sans"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-white/40 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab(prevTab);
                }}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] flex items-center justify-center text-white cursor-default shrink-0 bouncy-btn"
                title="Hủy"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="main-bar-dock"
              initial={{ y: 0, opacity: 1 }}
              exit={{ y: 25, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2.5 w-full h-16 transform-gpu"
            >
              {/* Main Tab Dock (Pill) */}
              <div className="flex-1 h-full rounded-full bg-white/[0.12] backdrop-blur-[25px] saturate-[185%] border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3),0_25px_50px_-12px_rgba(0,0,0,0.9)] flex items-center justify-around px-2 py-1 relative transform-gpu">
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
                      { id: "live", icon: Compass, label: "Trực tiếp", isVtvGo: false },
                      ...customTabs.map((t: any) => ({
                        id: t.id,
                        icon: ICON_REGISTRY[t.iconName] || Sparkles,
                        label: t.name,
                        isVtvGo: false,
                        isCustom: true,
                        code: t.code
                      })),
                      { id: "settings", icon: Settings, label: "Cài đặt", isVtvGo: false },
                      { id: "vtvgo", icon: Star, label: "VTVgo", isVtvGo: true },
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
                              const now = new Date();
                              const timeVal = now.getHours() * 60 + now.getMinutes();
                              const startVal = 12 * 60 + 30;
                              const endVal = 14 * 60 + 30;
                              const isUnlocked = timeVal >= startVal && timeVal <= endVal;

                              if (isUnlocked) {
                                const wildChannel = flattenedChannels.find(ch => ch.id === "vietnam-wild-live");
                                if (wildChannel) {
                                  setSelectedChannel(wildChannel);
                                  setActiveTab("live");
                                }
                              } else {
                                setShowVtvGoLockedModal(true);
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
                          className={`relative flex flex-col items-center justify-center flex-1 h-full cursor-default z-10 bouncy-btn px-2 transition-all transform-gpu ${
                            isActive 
                              ? "text-indigo-950 font-normal" 
                              : "text-white/65 hover:text-white"
                          }`}
                          title={tab.label}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeTabPill"
                              transition={{ type: "spring", stiffness: 350, damping: 25 }}
                              className="absolute inset-y-1 inset-x-1 bg-white/50 rounded-full shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.8),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.15)] -z-10"
                            />
                          )}
                          <Icon className={`w-7 h-7 transition-transform duration-300 ${isActive ? "scale-105" : ""}`} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Separate Search Button */}
              <button
                onClick={() => {
                  setPrevTab(activeTab as any);
                  setActiveTab("search");
                }}
                className="w-16 h-16 rounded-full bg-white/[0.12] backdrop-blur-[25px] saturate-[185%] border border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3),0_25px_50px_-12px_rgba(0,0,0,0.9)] flex items-center justify-center text-white/70 hover:text-white bouncy-btn hover:border-white/40 group shrink-0 transform-gpu"
                title="Tìm kiếm"
              >
                <img 
                  src="https://static.wikia.nocookie.net/ftv/images/d/dc/Ass_glass.svg/revision/latest?cb=20260612062405&path-prefix=vi" 
                  className="w-6.5 h-6.5 brightness-0 invert opacity-95 transition-all duration-300 group-hover:scale-110 pointer-events-none object-contain" 
                  referrerPolicy="no-referrer"
                  alt="Search"
                />
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

      {/* CUSTOM CHANNEL LINK ADDER MODAL */}
      <AnimatePresence>
        {showCustomModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-black/25 backdrop-blur-[20px] z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[350px] rounded-[30px] bg-[#e5e5ea]/85 p-5 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.45),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.2),0_24px_48px_rgba(0,0,0,0.12)] relative border border-white/20 text-black text-left transform-gpu"
            >
              <h3 className="text-[18px] font-semibold text-black tracking-tight leading-snug">
                Tạo kênh
              </h3>
              <p className="text-[12px] text-black/60 mb-4 leading-relaxed px-1 mt-1">
                Thêm luồng kênh mới vào danh sách kênh bằng cách nhập đường dẫn URL của luồng kênh đó
              </p>

              <form onSubmit={handleAddCustomChannel} className="space-y-3.5 text-sm">
                <div className="space-y-1 text-left">
                  <label className="text-[11.5px] font-semibold text-black/60 block px-1">Nhập tên kênh</label>
                  <input
                    required
                    type="text"
                    placeholder="Kênh của tôi"
                    value={customChannelName}
                    onChange={(e) => setCustomChannelName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-white/75 text-black placeholder-black/40 border border-black/5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-normal"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[11.5px] font-semibold text-black/60 block px-1">Nhập đường dẫn</label>
                  <input
                    required
                    type="url"
                    placeholder="https://example.com/live/stream.m3u8"
                    value={customChannelUrl}
                    onChange={(e) => setCustomChannelUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-white/75 text-black placeholder-black/40 border border-black/5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-normal font-mono"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[11.5px] font-semibold text-black/60 block px-1">Chọn nhóm kênh</label>
                  <select
                    value={customChannelGroup}
                    onChange={(e) => setCustomChannelGroup(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-white/75 text-black border border-black/5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-normal appearance-none cursor-pointer pr-10 relative"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 14px center',
                      backgroundSize: '14px',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    <option value="VTV">Kênh VTV</option>
                    <option value="VTVcab">Kênh VTVcab</option>
                    <option value="HTV">Kênh HTV</option>
                    <option value="SCTV">Kênh SCTV</option>
                    <option value="Địa phương">Kênh địa phương & Thiết yếu</option>
                    <option value="Quốc tế">Kênh Quốc Tế & Đặc Sắc</option>
                    <option value="Radio">Kênh Phát Thanh (Radio)</option>
                    <option value="Thử nghiệm">Kênh Thử Nghiệm</option>
                    <option value="NEW_GROUP">+ Tự tạo nhóm mới...</option>
                  </select>
                </div>

                {customChannelGroup === "NEW_GROUP" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-1 text-left"
                  >
                    <label className="text-[11.5px] font-semibold text-black/60 block px-1">Nhập tên nhóm mới</label>
                    <input
                      required
                      type="text"
                      placeholder="Ví dụ: Kênh Riêng"
                      value={customGroupInput}
                      onChange={(e) => setCustomGroupInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-full bg-white/75 text-black placeholder-black/40 border border-black/5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-normal"
                    />
                  </motion.div>
                )}

                <div className="flex items-center gap-3.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCustomModal(false)}
                    className="flex-1 py-3 px-4 rounded-full bg-black/10 hover:bg-black/15 active:scale-95 transition-all text-[#ff3b30] font-semibold text-[15px] text-center cursor-default"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-full bg-[#007aff] hover:bg-[#0066d6] active:scale-95 transition-all text-white font-semibold text-[15px] text-center cursor-default shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.45),0_2px_6px_rgba(0,122,255,0.25)]"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
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
              transition={{ duration: 0.35 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-[20px] z-[120] flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="w-full max-w-lg rounded-3xl bg-[#120e24]/90 border border-white/10 p-6 shadow-2xl relative text-white text-left overflow-hidden flex flex-col gap-4 font-sans"
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
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Hộp thoại Pop-up tùy chỉnh</p>
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
                    Giao diện hộp thoại trống. Nhấp nút 'Chạy chức năng' để khởi chạy logic script đã thiết lập.
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
                    Đóng
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
                        alert(`Lỗi thực thi script: ${err.message}`);
                      }
                    }}
                    className="px-4.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white transition-colors flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-white" /> Chạy chức năng
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
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-black/25 backdrop-blur-[20px] z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[350px] rounded-[30px] bg-[#e5e5ea]/85 p-6 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.45),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.2),0_24px_48px_rgba(0,0,0,0.12)] relative border border-white/20 text-black text-left transform-gpu"
            >
              <h3 className="text-[18px] font-semibold text-black tracking-tight leading-snug">
                title.special_event.title.name
              </h3>
              <p className="text-[12px] text-black/60 mb-5 leading-relaxed mt-2">
                title.special_event.desc.name
              </p>
              
              <button
                onClick={() => setShowVtvGoLockedModal(false)}
                className="w-full py-3 px-4 rounded-full bg-[#007aff] hover:bg-[#0066d6] hover:scale-[1.03] active:scale-95 transition-all duration-300 text-white font-semibold text-[15px] text-center cursor-default shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.45),0_2px_6px_rgba(0,122,255,0.25)] transform-gpu"
              >
                modal.close_button.name
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ABOUT VPLAY360 MODAL */}
      <AnimatePresence>
        {showAboutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-black/50 backdrop-blur-[20px] z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[350px] rounded-[30px] bg-[#120e24]/90 p-6 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.05),0_24px_48px_rgba(0,0,0,0.5)] relative border border-white/10 text-white text-left transform-gpu"
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
              
              <h3 className="text-[17px] font-semibold text-white tracking-tight leading-snug">
                Vplay360 - Phiên bản 2.4.0
              </h3>
              <p className="text-[12px] text-white/60 mb-5 leading-relaxed mt-2">
                Trải nghiệm truyền hình trực tuyến chất lượng cao, độ trễ thấp với giao diện hiện đại, mượt mà và tối ưu hóa tối đa cho mọi thiết bị.
              </p>
              
              <button
                onClick={() => setShowAboutModal(false)}
                className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 hover:scale-[1.03] active:scale-95 transition-all duration-300 text-white font-semibold text-[14px] text-center cursor-default shadow-md transform-gpu"
              >
                Đóng
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
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-black/25 backdrop-blur-[20px] z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[380px] rounded-[30px] bg-[#e5e5ea]/85 p-6 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.45),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.2),0_24px_48px_rgba(0,0,0,0.12)] relative border border-white/20 text-black text-left transform-gpu"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px] font-semibold text-black tracking-tight leading-snug">
                  Chọn kênh
                </h3>
                <button
                  onClick={() => setShowVtv5Popup(false)}
                  className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/60 hover:text-black transition-colors bouncy-btn border border-black/5"
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
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left border cursor-pointer transition-colors duration-200 bouncy-btn relative group overflow-hidden ${
                        isCurrentPlaying
                          ? "bg-white border-blue-500/30 text-black shadow-sm"
                          : "bg-white/45 hover:bg-white/75 border-black/5 hover:border-black/10"
                      }`}
                    >
                      {/* Content Middle */}
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h4 className="font-semibold text-black text-[14px] tracking-tight group-hover:text-blue-600 transition-colors truncate">
                          {opt.name}
                        </h4>
                        {isCurrentPlaying && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
                        )}
                      </div>

                      {/* Right Indicator */}
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-black/5 group-hover:bg-black/10 border border-black/5 transition-colors shrink-0">
                        {isCurrentPlaying ? (
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                        ) : (
                          <Play className="w-3 h-3 fill-black text-black translate-x-0.5 opacity-60 group-hover:opacity-100 transition-opacity" />
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
                  className="w-full py-3 px-4 rounded-full bg-black/10 hover:bg-black/15 active:scale-95 transition-all text-[#ff3b30] font-semibold text-[15px] text-center cursor-default"
                >
                  Đóng
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
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-black/50 backdrop-blur-[20px] z-[110] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[420px] rounded-[30px] bg-[#120e24]/90 p-6 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.05),0_24px_48px_rgba(0,0,0,0.5)] relative border border-white/10 text-white text-left transform-gpu"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Grid className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-[18px] font-semibold text-white tracking-tight leading-snug">
                    Xem Multiview
                  </h3>
                </div>
                <button
                  onClick={() => setShowMultiviewSelectorPopup(false)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors bouncy-btn border border-white/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[12px] text-white/60 mb-5 leading-relaxed">
                Chọn số lượng luồng kênh bạn muốn xem cùng một lúc (từ 2 đến 9 kênh). Màn hình sẽ được chia đều tương ứng.
              </p>

              <div className="grid grid-cols-4 gap-3 mb-6">
                {[2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      handleSelectMultiviewCount(num);
                      setShowMultiviewSelectorPopup(false);
                    }}
                    className="aspect-square flex flex-col items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-400/50 hover:text-indigo-300 transition-all cursor-pointer bouncy-btn"
                  >
                    <span className="text-xl font-bold">{num}</span>
                    <span className="text-[10px] text-white/50 font-sans font-normal">ô kênh</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-2.5">
                <button
                  onClick={() => setShowMultiviewSelectorPopup(false)}
                  className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium text-[13px] text-center cursor-default transition-all"
                >
                  Hủy bỏ
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
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-black/55 backdrop-blur-[20px] z-[120] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 1.12 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-4xl max-h-[85vh] rounded-[30px] bg-[#120e24]/95 p-6 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.15),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.05),0_24px_48px_rgba(0,0,0,0.5)] relative border border-white/10 text-white flex flex-col text-left transform-gpu overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <Tv className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-[18px] font-semibold text-white tracking-tight leading-snug">
                    Chọn kênh cho Khung {activeMultiviewSlotIndex !== null ? activeMultiviewSlotIndex + 1 : ""}
                  </h3>
                </div>
                <button
                  onClick={() => setShowMultiviewChannelPickerPopup(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors bouncy-btn border border-white/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search bar inside picker */}
              <div className="mb-4 relative shrink-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Tìm kiếm kênh muốn thêm..."
                  value={pickerSearchQuery}
                  onChange={(e) => setPickerSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 focus:outline-none text-white text-xs transition-all placeholder:text-white/30"
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
                        <h4 className="text-xs sm:text-sm font-semibold text-white/80 tracking-tight uppercase">
                          {cat.name}
                        </h4>
                        <span className="text-[10px] sm:text-xs text-white/40 font-mono font-normal">
                          {cat.channels.length} Kênh
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
                                isDacBiet
                                  ? "bg-amber-500/5 border border-amber-400/30 hover:border-amber-400 hover:bg-amber-500/10"
                                  : "bg-white/5 border border-white/10 hover:border-white hover:bg-white/10"
                              }`}
                              title={ch.name}
                            >
                              <div className="w-full h-full flex justify-center items-center overflow-hidden rounded-lg">
                                {ch.logoImg ? (
                                  <img
                                    src={ch.logoImg}
                                    alt={ch.name}
                                    referrerPolicy="no-referrer"
                                    className={`object-contain filter drop-shadow-md select-none pointer-events-none ${
                                      ch.id === "vietnam-wild-live" ? "w-[84%] h-[84%] p-0.5" : ch.id.startsWith("vinh_long") ? "w-[55%] h-[55%] p-1" : ch.group === "SCTV" ? "w-[60%] h-[60%] p-1" : ch.group === "VTVcab" ? "w-[82%] h-[82%] p-0.5" : "w-full h-full"
                                    }`}
                                  />
                                ) : (
                                  <div className={`w-full h-full flex items-center justify-center rounded-lg ${ch.logoBg || "bg-indigo-600"} shadow-inner border border-white/10 font-bold text-white text-[9px] sm:text-[10px] tracking-wider text-center px-1`}>
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
                  <div className="py-12 text-center text-white/40 text-xs">
                    Không tìm thấy kênh nào khớp với từ khóa của bạn.
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

    </div>
  );
}
