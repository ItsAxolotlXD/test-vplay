import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  Mic,
  MicOff,
  Newspaper, 
  Bot, 
  Music, 
  ShoppingBag, 
  Columns2, 
  LayoutGrid, 
  Radio, 
  MessageSquare, 
  Smartphone, 
  Waves, 
  Coins, 
  Users, 
  Info,
  Sparkles,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTabSearch } from '../context/TabSearchContext';

interface TabViewProps {
  currentRoute: string;
  navigate: (route: string, state?: any) => void;
  onOpenSearch: () => void;
  isSettingsOpen?: boolean;
}

// Reusable Tab Icon with URL and crisp SVG fallback, monochrome styling
interface TabIconProps {
  url: string;
  alt: string;
  active: boolean;
  fallbackSvg: React.ReactNode;
}

const TabIconWithFallback: React.FC<TabIconProps> = ({ url, alt, active, fallbackSvg }) => {
  const [loadError, setLoadError] = useState(false);

  if (loadError) {
    return <div className="w-6 h-6 sm:w-6.5 sm:h-6.5 flex items-center justify-center">{fallbackSvg}</div>;
  }

  return (
    <div className="w-6 h-6 sm:w-6.5 sm:h-6.5 flex items-center justify-center relative">
      <img
        src={url}
        alt={alt}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => setLoadError(true)}
        className={`w-full h-full object-contain transition-all select-none pointer-events-none ${
          active 
            ? 'brightness-0 invert' 
            : 'brightness-0 opacity-80'
        }`}
      />
    </div>
  );
};

// 1. Home Icon (Icons8 Home)
const TabHomeIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <TabIconWithFallback
    url="https://static.wikia.nocookie.net/ep-deo/images/e/ee/Icons8-home-64.png/revision/latest?cb=20260925115253"
    alt="Home"
    active={active}
    fallbackSvg={
      <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-6.5 sm:h-6.5" fill="currentColor">
        <path d="M19 9.3V4h-2.5v3.1L12 3 2 12h3v8h5v-5.5h4V20h5v-8h3l-3-2.7z" />
      </svg>
    }
  />
);

// 2. Watch / Apps Icon (Icons8 Apps)
const TabWatchIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <TabIconWithFallback
    url="https://static.wikia.nocookie.net/ep-deo/images/7/78/Icons8-apps-90.png/revision/latest?cb=20260925115254"
    alt="Watch"
    active={active}
    fallbackSvg={
      <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-6.5 sm:h-6.5" fill="currentColor">
        <rect x="3" y="3" width="4.8" height="4.8" rx="1.4" />
        <rect x="9.6" y="3" width="4.8" height="4.8" rx="1.4" />
        <rect x="16.2" y="3" width="4.8" height="4.8" rx="1.4" />
        <rect x="3" y="9.6" width="4.8" height="4.8" rx="1.4" />
        <rect x="9.6" y="9.6" width="4.8" height="4.8" rx="1.4" />
        <rect x="16.2" y="9.6" width="4.8" height="4.8" rx="1.4" />
        <rect x="3" y="16.2" width="4.8" height="4.8" rx="1.4" />
        <rect x="9.6" y="16.2" width="4.8" height="4.8" rx="1.4" />
        <rect x="16.2" y="16.2" width="4.8" height="4.8" rx="1.4" />
      </svg>
    }
  />
);

// 3. Event Icon (Icons8 Calendar / Event)
const TabEventIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <TabIconWithFallback
    url="https://static.wikia.nocookie.net/ep-deo/images/8/8c/Icons8-calendar-64.png/revision/latest?cb=20260925115255"
    alt="Event"
    active={active}
    fallbackSvg={
      <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 sm:w-6 sm:h-6" fill="currentColor">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
        <circle cx="12" cy="14" r="1.5" />
      </svg>
    }
  />
);

// 3. Search Icon (Monochrome)
const TabSearchIcon: React.FC = () => (
  <Search className="w-5.5 h-5.5 sm:w-6 sm:h-6 stroke-[2.4]" />
);

// 4. Hamburger Menu Icon for "More" Tab
const TabMoreIcon: React.FC = () => (
  <Menu className="w-5.5 h-5.5 sm:w-6 sm:h-6 stroke-[2.4]" />
);

// 5. Settings Icon with BIGGER center hole (lỗ bên trong icon settings to hơn)
const TabSettingsIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-6.5 sm:h-6.5" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 6.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z"
    />
  </svg>
);

// All routes that belong to the "More" flyout menu (Sidebar tabs minus Home, Watch, Settings)
interface FlyoutMenuItem {
  id: string;
  label: string;
  route: string;
  subtext: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ReactNode;
  matchesRoute: (route: string) => boolean;
}

const FLYOUT_MENU_ITEMS: FlyoutMenuItem[] = [
  {
    id: 'more-news',
    label: 'Cổng thông tin',
    route: '/news',
    subtext: 'Bản tin truyền hình & sự kiện',
    badge: 'NEWS',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    icon: <Newspaper className="w-4.5 h-4.5 text-amber-400" />,
    matchesRoute: (r) => r.startsWith('/news') || r.startsWith('/article'),
  },
  {
    id: 'more-copilot',
    label: 'Copilot AI',
    route: '/copilot',
    subtext: 'Trợ lý thông minh cho VNRT Online',
    badge: 'AI',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-400/30',
    icon: <Bot className="w-4.5 h-4.5 text-pink-400" />,
    matchesRoute: (r) => r.startsWith('/copilot'),
  },
  {
    id: 'more-music',
    label: 'Music',
    route: '/music',
    subtext: 'Kho nhạc truyền hình VNRT Online',
    icon: <Music className="w-4.5 h-4.5 text-purple-400" />,
    matchesRoute: (r) => r.startsWith('/music'),
  },
  {
    id: 'more-shop',
    label: 'Shop',
    route: '/v-shop',
    subtext: 'Mua sắm tiện ích & quà lưu niệm',
    icon: <ShoppingBag className="w-4.5 h-4.5 text-emerald-400" />,
    matchesRoute: (r) => r.startsWith('/v-shop') || r.startsWith('/shop'),
  },
  {
    id: 'more-event',
    label: 'Event',
    route: '/event',
    subtext: 'Gathering Discord & Sự kiện đặc biệt',
    badge: 'HOT',
    badgeColor: 'bg-red-500/25 text-red-300 border-red-400/40',
    icon: <Sparkles className="w-4.5 h-4.5 text-red-400" />,
    matchesRoute: (r) => r.startsWith('/event') || r.startsWith('/events'),
  },
  {
    id: 'more-vduo',
    label: 'V-Duo',
    route: '/v-duo',
    subtext: 'Chia đôi 2 màn hình song song',
    badge: 'Mới',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
    icon: <Columns2 className="w-4.5 h-4.5 text-cyan-400" />,
    matchesRoute: (r) => r.startsWith('/v-duo') || r.startsWith('/duo'),
  },
  {
    id: 'more-space360',
    label: 'Space 360',
    route: '/space-360',
    subtext: 'Kho ứng dụng & mini games',
    badge: '21 Apps',
    badgeColor: 'bg-white/10 text-white border-white/20',
    icon: <LayoutGrid className="w-4.5 h-4.5 text-sky-400" />,
    matchesRoute: (r) => 
      r.startsWith('/space-360') || 
      r.startsWith('/v-space') || 
      r.startsWith('/v-apps') || 
      r.startsWith('/v-study') || 
      r.startsWith('/v-ride') || 
      r.startsWith('/driving') || 
      r.startsWith('/v-arcade') || 
      r.startsWith('/v-files') || 
      r.startsWith('/explore-vietnam') || 
      r.startsWith('/v-box') || 
      r.startsWith('/v-calc') || 
      r.startsWith('/v-clock') || 
      r.startsWith('/v-phone') || 
      r.startsWith('/v-browser') || 
      r.startsWith('/v-calendar') || 
      r.startsWith('/v-notes') || 
      r.startsWith('/v-furniture') || 
      r.startsWith('/minecraft') || 
      r.startsWith('/wheel-of-fortune'),
  },
  {
    id: 'more-vflow',
    label: 'V-Flow',
    route: '/v-flow',
    subtext: 'Bảng tin tương tác & bài viết',
    badge: 'FEED',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
    icon: <Radio className="w-4.5 h-4.5 text-rose-400" />,
    matchesRoute: (r) => r.startsWith('/v-flow') || r.startsWith('/flow'),
  },
  {
    id: 'more-chat',
    label: 'V-Chat',
    route: '/chat',
    subtext: 'Phòng chat cộng đồng & voice',
    badge: 'VOICE',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    icon: <MessageSquare className="w-4.5 h-4.5 text-blue-400" />,
    matchesRoute: (r) => r.startsWith('/chat') || r.startsWith('/discord'),
  },
  {
    id: 'more-vertical',
    label: 'Vertical',
    route: '/vertical',
    subtext: 'Video ngắn dọc phong cách mới',
    badge: 'SHORTS',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    icon: <Smartphone className="w-4.5 h-4.5 text-amber-400" />,
    matchesRoute: (r) => r.startsWith('/vertical') || r.startsWith('/shorts'),
  },
  {
    id: 'more-premium',
    label: 'Premium',
    route: '/v-premium',
    subtext: 'Đặc quyền hội viên cao cấp',
    badge: 'VIP',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
    icon: <Waves className="w-4.5 h-4.5 text-yellow-400" />,
    matchesRoute: (r) => r.startsWith('/v-premium'),
  },
  {
    id: 'more-loyalty',
    label: 'Loyalty',
    route: '/loyalty',
    subtext: 'Điểm thưởng & đấu trường dự đoán',
    badge: 'ARENA',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-400/30',
    icon: <Coins className="w-4.5 h-4.5 text-orange-400" />,
    matchesRoute: (r) => r.startsWith('/loyalty') || r.startsWith('/bet-arena'),
  },
  {
    id: 'more-people',
    label: 'People',
    route: '/friends',
    subtext: 'Bạn bè & cộng đồng người dùng',
    badge: '100+',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    icon: <Users className="w-4.5 h-4.5 text-emerald-400" />,
    matchesRoute: (r) => r.startsWith('/friends') || r.startsWith('/people'),
  },
  {
    id: 'more-about',
    label: 'About',
    route: '/about',
    subtext: 'Thông tin hệ thống & giới thiệu',
    icon: <Info className="w-4.5 h-4.5 text-sky-400" />,
    matchesRoute: (r) => r.startsWith('/about'),
  },
];

interface NavItemConfig {
  id: string;
  label: string;
  onClick: () => void;
  renderIcon: (active: boolean) => React.ReactNode;
  checkActive: (currentRoute: string, isSettingsOpen?: boolean, isMoreOpen?: boolean) => boolean;
}

export const FloatyBar: React.FC<TabViewProps> = React.memo(({
  currentRoute,
  navigate,
  onOpenSearch,
  isSettingsOpen,
}) => {
  const { searchQuery, setSearchQuery, clearSearch, placeholder, isTabViewSearchExpanded, setIsTabViewSearchExpanded } = useTabSearch();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [flyoutSearchQuery, setFlyoutSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [vboardState, setVboardState] = useState<{ isOpen: boolean; height: number }>({
    isOpen: false,
    height: 0,
  });

  const flyoutRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchBarContainerRef = useRef<HTMLElement>(null);
  const recognitionRef = useRef<any>(null);

  // Close flyout when navigating or route changes
  useEffect(() => {
    setIsMoreOpen(false);
  }, [currentRoute]);

  // Click outside to collapse search bar back to tab view bar
  useEffect(() => {
    if (!isTabViewSearchExpanded) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (searchBarContainerRef.current && !searchBarContainerRef.current.contains(target)) {
        setIsTabViewSearchExpanded(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isTabViewSearchExpanded, setIsTabViewSearchExpanded]);

  // Listen for V-board virtual keyboard slide-up / slide-down events
  useEffect(() => {
    const handleVBoardState = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setVboardState({
          isOpen: Boolean(detail.isOpen),
          height: Number(detail.height) || 320,
        });
      }
    };

    window.addEventListener('vplay:vboard_state', handleVBoardState);
    return () => {
      window.removeEventListener('vplay:vboard_state', handleVBoardState);
    };
  }, []);

  // Initialize Web Speech API for voice search
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSpeechSupported(true);
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'vi-VN';

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setSearchQuery(transcript);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      } catch (e) {
        setSpeechSupported(false);
      }
    }
  }, [setSearchQuery]);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      searchInputRef.current?.focus();
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  // Click outside to close More flyout
  useEffect(() => {
    if (!isMoreOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        flyoutRef.current && 
        !flyoutRef.current.contains(target) &&
        moreButtonRef.current && 
        !moreButtonRef.current.contains(target)
      ) {
        setIsMoreOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMoreOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMoreOpen]);

  // Check if current route matches any route inside "More" flyout
  const isAnyMoreRouteActive = (route: string) => {
    return FLYOUT_MENU_ITEMS.some((item) => item.matchesRoute(route));
  };

  // Main Tabs: Home, Watch, Event, Search, More, Settings
  const items: NavItemConfig[] = [
    {
      id: 'tab-home',
      label: 'Home',
      onClick: () => {
        setIsMoreOpen(false);
        navigate('/');
      },
      renderIcon: (active) => <TabHomeIcon active={active} />,
      checkActive: (route) => route === '/' || route === '/home',
    },
    {
      id: 'tab-watch',
      label: 'Watch',
      onClick: () => {
        setIsMoreOpen(false);
        navigate('/live-tv');
      },
      renderIcon: (active) => <TabWatchIcon active={active} />,
      checkActive: (route) => route.startsWith('/live-tv') || route.startsWith('/channels'),
    },
    {
      id: 'tab-event',
      label: 'Event',
      onClick: () => {
        setIsMoreOpen(false);
        navigate('/event');
      },
      renderIcon: (active) => <TabEventIcon active={active} />,
      checkActive: (route) => route.startsWith('/event') || route.startsWith('/events'),
    },
    {
      id: 'tab-search',
      label: 'Search',
      onClick: () => {
        setIsMoreOpen(false);
        setIsTabViewSearchExpanded(true);
      },
      renderIcon: () => <TabSearchIcon />,
      checkActive: (route) => route.startsWith('/search') || isTabViewSearchExpanded,
    },
    {
      id: 'tab-more',
      label: 'More',
      onClick: () => {
        setIsMoreOpen((prev) => !prev);
      },
      renderIcon: () => <TabMoreIcon />,
      checkActive: (route, _settingsOpen, moreOpen) => Boolean(moreOpen) || isAnyMoreRouteActive(route),
    },
    {
      id: 'tab-settings',
      label: 'Settings',
      onClick: () => {
        setIsMoreOpen(false);
        navigate('/settings');
      },
      renderIcon: () => <TabSettingsIcon />,
      checkActive: (route, settingsOpen) => route.startsWith('/settings') || Boolean(settingsOpen),
    },
  ];

  // Filtered items in the More flyout
  const filteredFlyoutItems = FLYOUT_MENU_ITEMS.filter((item) => {
    if (!flyoutSearchQuery.trim()) return true;
    const q = flyoutSearchQuery.toLowerCase();
    return item.label.toLowerCase().includes(q) || item.subtext.toLowerCase().includes(q);
  });

  return (
    <nav
      id="tab-view-container"
      aria-label="Tab View"
      ref={searchBarContainerRef}
      className={`fixed left-1/2 -translate-x-1/2 z-50 select-none pointer-events-auto flex flex-col items-center max-w-[96vw] transition-all duration-300 ${
        vboardState.isOpen ? 'z-[100002]' : ''
      } ${!vboardState.isOpen ? 'bottom-4 sm:bottom-6' : ''}`}
      style={{
        bottom: vboardState.isOpen ? `${vboardState.height + 12}px` : undefined,
      }}
    >
      {/* 1. Flyout Menu Anchored Above Tab Bar */}
      <AnimatePresence>
        {isMoreOpen && !isTabViewSearchExpanded && (
          <motion.div
            ref={flyoutRef}
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.94 }}
            transition={{ type: 'spring', damping: 28, stiffness: 420 }}
            style={{
              backgroundColor: 'rgba(252, 252, 254, 0.94)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
            className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-[94vw] sm:w-[580px] md:w-[640px] max-w-[660px] max-h-[75vh] rounded-[28px] border border-black/10 shadow-[0_24px_64px_rgba(0,0,0,0.18)] p-3.5 sm:p-4.5 flex flex-col z-50 text-zinc-900 overflow-hidden"
          >
            {/* Flyout Header */}
            <div className="flex items-center justify-between pb-3 border-b border-black/8 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#FF7A00]/15 border border-[#FF7A00]/30 flex items-center justify-center text-[#FF7A00]">
                  <Menu className="w-4 h-4 stroke-[2.4]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 leading-tight">
                    Tất cả chuyên mục
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Khám phá toàn bộ tính năng VNRT Online
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-colors cursor-pointer"
                title="Đóng menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Filter Input */}
            <div className="pt-3 pb-2 shrink-0">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={flyoutSearchQuery}
                  onChange={(e) => setFlyoutSearchQuery(e.target.value)}
                  placeholder="Lọc chuyên mục..."
                  className="w-full pl-8.5 pr-3 py-1.5 rounded-xl bg-black/[0.04] border border-black/10 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] transition-all font-sans"
                />
                {flyoutSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setFlyoutSearchQuery('')}
                    className="absolute right-2.5 text-zinc-400 hover:text-zinc-700 text-xs cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Items Grid (Scrollable, 4 items / row) */}
            <div className="overflow-y-auto space-y-1.5 pr-1 max-h-[50vh] [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.2)_transparent] pt-1">
              <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                {filteredFlyoutItems.map((item) => {
                  const isActive = item.matchesRoute(currentRoute);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setIsMoreOpen(false);
                        navigate(item.route);
                      }}
                      className={`p-2 sm:p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group active:scale-95 border ${
                        isActive
                          ? 'bg-[#FF7A00]/12 border-[#FF7A00]/50 shadow-sm ring-1 ring-[#FF7A00]/25'
                          : 'bg-black/[0.02] border-black/5 hover:bg-black/[0.06] hover:border-black/10 text-zinc-700'
                      }`}
                    >
                      <div className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105 shrink-0 ${
                        isActive 
                          ? 'bg-[#FF7A00] text-white shadow-md shadow-[#FF7A00]/30' 
                          : 'bg-white shadow-xs border border-black/5 text-zinc-800'
                      }`}>
                        {item.icon}
                        {item.badge && (
                          <span className={`absolute -top-1.5 -right-1.5 text-[8px] px-1 py-0.2 rounded-full font-bold leading-tight border shadow-xs ${
                            item.badgeColor || 'bg-black/10 text-zinc-700 border-black/15'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <span className={`text-[11px] sm:text-xs font-semibold leading-tight line-clamp-1 w-full ${
                        isActive ? 'text-[#FF7A00]' : 'text-zinc-800 group-hover:text-black'
                      }`}>
                        {item.label}
                      </span>
                      <span className="text-[9px] sm:text-[9.5px] text-zinc-400 group-hover:text-zinc-500 truncate w-full mt-0.5 leading-tight">
                        {item.subtext}
                      </span>
                    </button>
                  );
                })}
              </div>

              {filteredFlyoutItems.length === 0 && (
                <div className="text-center py-6 text-xs text-zinc-400">
                  Không tìm thấy chuyên mục phù hợp
                </div>
              )}
            </div>

            {/* Quick Tip Footer */}
            <div className="pt-2.5 mt-2 border-t border-black/8 flex items-center justify-between text-[10px] text-zinc-400 shrink-0">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FF7A00]" />
                <span>Toàn bộ menu trên sidebar</span>
              </span>
              <span>Phím tắt: ⌘K</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Frosted Glass Pill Bar: Morphs between Tab View and Float Search Bar */}
      <AnimatePresence mode="wait">
        {!isTabViewSearchExpanded ? (
          <motion.div
            key="tab-view-pill-normal"
            layoutId="vplay-tab-view-morph-pill"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{
              type: 'spring',
              stiffness: 420,
              damping: 32,
              mass: 0.75,
            }}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(2.5px)',
              WebkitBackdropFilter: 'blur(2.5px)',
            }}
            className="tab-view-pill flex items-center px-1 sm:px-1.5 py-1 sm:py-1 rounded-full border border-white/45 shadow-[0_10px_36px_rgba(0,0,0,0.25)] ring-1 ring-black/5"
          >
            {items.map((item) => {
              const active = item.checkActive(currentRoute, isSettingsOpen, isMoreOpen);
              const isMoreTab = item.id === 'tab-more';

              return (
                <button
                  key={item.id}
                  ref={isMoreTab ? moreButtonRef : undefined}
                  id={item.id}
                  type="button"
                  onClick={item.onClick}
                  aria-label={item.label}
                  title={item.label}
                  className="relative w-[50px] h-[48px] sm:w-[58px] sm:h-[52px] rounded-full flex flex-col items-center justify-center transition-all cursor-pointer outline-none select-none active:scale-95"
                >
                  {/* Smooth spring sliding active pill animation */}
                  {active && (
                    <motion.div
                      layoutId="tabViewActivePill"
                      className="absolute inset-0 rounded-full bg-[#FF7A00] shadow-[0_4px_16px_rgba(255,122,0,0.48)] z-0"
                      transition={{
                        type: 'spring',
                        stiffness: 480,
                        damping: 34,
                        mass: 0.75,
                      }}
                    />
                  )}

                  {/* Inactive Tab hover button subtle highlight */}
                  {!active && (
                    <div 
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0)',
                      }}
                      className="absolute inset-0 rounded-full hover:bg-white/20 transition-colors pointer-events-none"
                    />
                  )}

                  {/* Icon & Label (kept above sliding background) */}
                  <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
                    <div className={`flex items-center justify-center transition-colors duration-150 ${
                      active ? 'text-white' : 'text-[#222222]'
                    }`}>
                      {item.renderIcon(active)}
                    </div>
                    <span
                      className={`text-[9px] sm:text-[10px] leading-none mt-0.5 tracking-tight transition-colors duration-150 ${
                        active ? 'font-bold text-white' : 'font-semibold text-[#222222]'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </motion.div>
        ) : (
          /* Morphed Float Search Bar State */
          <motion.div
            key="tab-view-pill-search"
            layoutId="vplay-tab-view-morph-pill"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{
              type: 'spring',
              stiffness: 420,
              damping: 32,
              mass: 0.75,
            }}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(2.5px)',
              WebkitBackdropFilter: 'blur(2.5px)',
              fontFamily: "'Inter', 'Integer', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
            className={`pointer-events-auto relative w-[92vw] sm:w-[420px] max-w-[460px] h-[48px] sm:h-[52px] rounded-full flex items-center px-3.5 sm:px-4 transition-all duration-300 border border-white/45 shadow-[0_10px_36px_rgba(0,0,0,0.25)] ring-1 ring-black/5 overflow-hidden ${
              isSearchFocused ? 'ring-white/60' : ''
            }`}
          >
            {/* Top & Bottom specular rim */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none rounded-full"
              viewBox="0 0 460 52"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <linearGradient id="tab-float-search-rim-grad" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="18%" stopColor="#ffffff" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="82%" stopColor="#ffffff" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <rect
                x="0.8"
                y="0.8"
                width="458.4"
                height="50.4"
                rx="25.2"
                stroke="url(#tab-float-search-rim-grad)"
                strokeWidth="1.4"
              />
            </svg>

            {/* Black Search Icon */}
            <div className="relative z-10 shrink-0 mr-2.5 sm:mr-3 w-5 h-5 flex items-center justify-center pointer-events-none">
              <Search className="w-5 h-5 text-black stroke-[2.4]" />
            </div>

            {/* Input Field */}
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  if (searchQuery) {
                    clearSearch();
                  } else {
                    setIsTabViewSearchExpanded(false);
                  }
                  searchInputRef.current?.blur();
                }
              }}
              placeholder={isListening ? 'Listening...' : placeholder}
              className="relative z-10 w-full bg-transparent text-black placeholder:text-black/60 text-sm sm:text-[15px] font-semibold tracking-tight focus:outline-none truncate"
            />

            {/* Action buttons on right */}
            <div className="relative z-10 flex items-center gap-1.5 shrink-0 ml-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    clearSearch();
                    searchInputRef.current?.focus();
                  }}
                  title="Xóa tìm kiếm"
                  className="w-5 h-5 rounded-full bg-black/10 hover:bg-black/20 text-black flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5] text-black" />
                </button>
              )}

              {/* Microphone voice button */}
              <button
                type="button"
                onClick={toggleListening}
                title={isListening ? 'Dừng lắng nghe' : 'Tìm kiếm bằng giọng nói'}
                className={`w-[26px] h-[26px] flex items-center justify-center rounded-full transition-all cursor-pointer ${
                  isListening
                    ? 'text-[#FF267A] animate-pulse bg-[#FF267A]/20 scale-110'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-4.5 h-4.5 stroke-[2.2] text-red-500" />
                ) : (
                  <Mic className="w-4.5 h-4.5 stroke-[2.2] text-black" />
                )}
              </button>

              {/* Close / Collapse button to morph back to tab view bar */}
              <button
                type="button"
                onClick={() => setIsTabViewSearchExpanded(false)}
                title="Đóng tìm kiếm (quay lại thanh tab view)"
                className="w-6 h-6 rounded-full bg-black/10 hover:bg-black/20 text-black flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5 stroke-[2.2] text-black" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
});

// Also export with TabView alias
export const TabView = FloatyBar;
