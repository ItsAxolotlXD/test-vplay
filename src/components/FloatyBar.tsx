import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Settings as SettingsIcon,
  Search,
  Sparkles,
  Newspaper,
  Tv,
  Trophy,
  Users,
  Radio,
  MessageSquare,
  Smartphone,
  Music,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react';

// Custom Copilot Icon matching TopBar with remote SVG, pulsing dot, and vector fallback
export const CopilotCustomIcon: React.FC<{ active?: boolean; className?: string }> = ({
  active = false,
  className = 'w-6 h-6 sm:w-6.5 sm:h-6.5',
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative flex items-center justify-center">
      {!hasError ? (
        <img
          src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
          alt="Copilot"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className={`${className} object-contain transition-transform duration-300 group-hover:scale-110 ${
            active ? 'scale-105' : ''
          }`}
        />
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <defs>
            <linearGradient id="copilot-ribbon-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0078D4" />
              <stop offset="45%" stopColor="#8764B8" />
              <stop offset="100%" stopColor="#F7630C" />
            </linearGradient>
            <linearGradient id="copilot-ribbon-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#20DFB3" />
              <stop offset="55%" stopColor="#0078D4" />
              <stop offset="100%" stopColor="#E04355" />
            </linearGradient>
          </defs>
          <path
            d="M7 13.5C7 10 9.8 7 13.3 7H17.5C19.4 7 21 8.6 21 10.5V12C21 15.6 18.2 18.5 14.7 18.5H10.5C8.6 18.5 7 16.9 7 15V13.5Z"
            fill="url(#copilot-ribbon-1)"
          />
          <path
            d="M17 10.5C17 14 14.2 17 10.7 17H6.5C4.6 17 3 15.4 3 13.5V12C3 8.4 5.8 5.5 9.3 5.5H13.5C15.4 5.5 17 7.1 17 9V10.5Z"
            fill="url(#copilot-ribbon-2)"
          />
          <circle cx="10" cy="11.2" r="1.5" fill="#FFFFFF" />
          <circle cx="14" cy="12.8" r="1.5" fill="#FFFFFF" />
        </svg>
      )}
      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#E6005A] animate-pulse pointer-events-none" />
    </div>
  );
};

interface FloatyTabItem {
  id: string;
  title: string;
  route?: string;
  icon?: LucideIcon;
  customIcon?: React.FC<{ active?: boolean; className?: string }>;
  action?: () => void;
}

interface FloatyBarProps {
  currentRoute: string;
  navigate: (route: string, state?: any) => void;
  onOpenSearch: () => void;
  isSettingsOpen?: boolean;
}

export const FloatyBar: React.FC<FloatyBarProps> = ({
  currentRoute,
  navigate,
  onOpenSearch,
  isSettingsOpen,
}) => {
  // Check active state for a given route
  const isActive = (route?: string, id?: string) => {
    if (id === 'floaty-search') {
      return (
        currentRoute.startsWith('/search') ||
        currentRoute.startsWith('/spotlight') ||
        currentRoute.startsWith('/tim-kiem')
      );
    }
    if (!route) return false;
    if (route === '/') return currentRoute === '/' || currentRoute === '/home';
    if (route === '/vertical') {
      return (
        currentRoute === '/vertical' ||
        currentRoute === '/shorts' ||
        currentRoute === '/vplay-vertical'
      );
    }
    if (route === '/space-360') {
      return (
        currentRoute.startsWith('/space-360') ||
        currentRoute.startsWith('/v-space') ||
        currentRoute.startsWith('/v-apps') ||
        currentRoute.startsWith('/v-files') ||
        currentRoute.startsWith('/v-xplore') ||
        currentRoute.startsWith('/v-arcade') ||
        currentRoute.startsWith('/v-games') ||
        currentRoute.startsWith('/explore-vietnam') ||
        currentRoute.startsWith('/minecraft')
      );
    }
    if (route === '/live-tv') {
      return currentRoute.startsWith('/live-tv') || currentRoute.startsWith('/channels');
    }
    if (route === '/loyalty') {
      return (
        currentRoute.startsWith('/loyalty') ||
        currentRoute.startsWith('/bet-arena') ||
        currentRoute.startsWith('/orbs-bet')
      );
    }
    if (route === '/friends') {
      return currentRoute.startsWith('/friends') || currentRoute.startsWith('/people');
    }
    if (route === '/v-flow') {
      return (
        currentRoute.startsWith('/v-flow') ||
        currentRoute.startsWith('/vflow') ||
        currentRoute.startsWith('/flow')
      );
    }
    if (route === '/chat') {
      return currentRoute.startsWith('/chat') || currentRoute.startsWith('/discord');
    }
    if (route === '/v-shop') {
      return currentRoute.startsWith('/v-shop') || currentRoute.startsWith('/shop');
    }
    if (route === '/settings') {
      return currentRoute.startsWith('/settings') || Boolean(isSettingsOpen);
    }
    return currentRoute.startsWith(route);
  };

  // Pages matching navigation:
  // Trang 1: Trang chủ, Copilot (custom icon), Settings, Search
  // Trang 2: Space360, News, Truyền hình, Music
  // Trang 3: Danh sách bạn bè, V-Flow, V-Chat, Vertical
  // Trang 4: V-Shop Mua sắm
  const pages: FloatyTabItem[][] = [
    // Trang 1: Trang chủ, Copilot, Settings, Search
    [
      { id: 'floaty-home', title: 'Trang chủ', route: '/', icon: Home },
      { id: 'floaty-copilot', title: 'VNRT Online Copilot', route: '/copilot', customIcon: CopilotCustomIcon },
      { id: 'floaty-settings', title: 'Cài đặt', route: '/settings', icon: SettingsIcon },
      { id: 'floaty-search', title: 'Tìm kiếm', action: onOpenSearch, icon: Search },
    ],
    // Trang 2: Space360, News, Truyền hình, Music
    [
      { id: 'floaty-space360', title: 'Space 360', route: '/space-360', icon: Sparkles },
      { id: 'floaty-music', title: 'Kho nhạc TV', route: '/music', icon: Music },
      { id: 'floaty-tv', title: 'Truyền hình trực tuyến', route: '/live-tv', icon: Tv },
      { id: 'floaty-news', title: 'Tin tức & Sự kiện', route: '/news', icon: Newspaper },
    ],
    // Trang 3: Danh sách bạn bè, V-Flow, V-Chat, Vertical
    [
      { id: 'floaty-friends', title: 'Danh sách bạn bè', route: '/friends', icon: Users },
      { id: 'floaty-vflow', title: 'Mạng xã hội V-Flow', route: '/v-flow', icon: Radio },
      { id: 'floaty-chat', title: 'Phòng Chat V-Chat', route: '/chat', icon: MessageSquare },
      { id: 'floaty-vertical', title: 'VNRT Online Vertical', route: '/vertical', icon: Smartphone },
    ],
    // Trang 4: Shop Mua sắm
    [
      { id: 'floaty-shop', title: 'Shop', route: '/v-shop', icon: ShoppingBag },
    ],
  ];

  const totalPages = pages.length;
  const [currentPage, setCurrentPage] = useState<number>(() => {
    // Automatically locate which page contains the current active route
    for (let p = 0; p < pages.length; p++) {
      if (pages[p].some((item) => isActive(item.route, item.id))) {
        return p;
      }
    }
    return 0;
  });
  const [direction, setDirection] = useState<number>(0);

  // Sync page if active route changes externally
  useEffect(() => {
    const pageIndex = pages.findIndex((page) =>
      page.some((item) => isActive(item.route, item.id))
    );
    if (pageIndex !== -1 && pageIndex !== currentPage) {
      setDirection(pageIndex > currentPage ? 1 : -1);
      setCurrentPage(pageIndex);
    }
  }, [currentRoute]);

  const handlePrevPage = () => {
    setDirection(-1);
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setDirection(1);
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handleTabClick = (item: FloatyTabItem) => {
    if (item.action) {
      item.action();
    } else if (item.route) {
      navigate(item.route);
    }
  };

  // Immediate slide animation with mode="popLayout" - no intermediate blank delay
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir >= 0 ? 80 : -80,
      opacity: 0,
      scale: 0.94,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 450, damping: 36, mass: 0.75 },
        opacity: { duration: 0.16 },
        scale: { duration: 0.16 },
      },
    },
    exit: (dir: number) => ({
      x: dir >= 0 ? -80 : 80,
      opacity: 0,
      scale: 0.94,
      transition: {
        x: { type: 'spring' as const, stiffness: 450, damping: 36, mass: 0.75 },
        opacity: { duration: 0.14 },
        scale: { duration: 0.14 },
      },
    }),
  };

  return (
    <div
      id="floaty-bar-container"
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 select-none pointer-events-auto flex flex-col items-center gap-1.5"
    >
      {/* Pre-release build product watermark lines */}
      <div 
        id="floaty-bar-prerelease-watermark"
        className="text-center pointer-events-none select-none px-2 space-y-0.5"
      >
        <p className="text-[11px] sm:text-xs font-medium tracking-tight text-zinc-400/90 dark:text-zinc-400/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] leading-tight">
          VNRT Online v26.10_devb (26A3667c) - Pre-release build product
        </p>
        <p className="text-[10px] sm:text-[11px] font-normal text-zinc-400/75 dark:text-zinc-400/75 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] leading-tight">
          Anything you've seen here are not finished and may change in future builds
        </p>
      </div>

      <div className="relative flex flex-col items-center">
        {/* Main Pill Bar with reduced backdrop blur opacity and no indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-full bg-[#121118]/25 backdrop-blur-md border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
          {/* Left Polar Arrow Button */}
          <button
            id="floaty-bar-prev-page"
            type="button"
            onClick={handlePrevPage}
            aria-label="Trang trước"
            title="Trang trước"
            className="w-10 h-10 sm:w-10.5 sm:h-10.5 rounded-full flex items-center justify-center text-white hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer shrink-0 border-0 shadow-none"
          >
            <ChevronLeft className="w-6.5 h-6.5 stroke-[2.5] text-white" />
          </button>

          {/* 4-Tab Viewport with Zero-Delay Simultaneous Slide Animation */}
          <div className="w-[244px] sm:w-[268px] overflow-hidden flex items-center justify-center relative min-h-[48px] sm:min-h-[50px]">
            <AnimatePresence custom={direction} mode="popLayout" initial={false}>
              <motion.div
                key={currentPage}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex items-center justify-between w-full px-1.5"
              >
                {pages[currentPage].map((item) => {
                  const active = isActive(item.route, item.id);
                  const Icon = item.icon;
                  const CustomIcon = item.customIcon;

                  return (
                    <button
                      key={item.id}
                      id={item.id}
                      type="button"
                      onClick={() => handleTabClick(item)}
                      title={item.title}
                      aria-label={item.title}
                      className={`group relative flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 border-0 shadow-none outline-none ${
                        active
                          ? 'w-14 sm:w-15 h-10 sm:h-10.5 rounded-full bg-white/20 text-white'
                          : 'w-10.5 h-10.5 sm:w-11 sm:h-11 rounded-full text-white hover:text-white hover:bg-white/10 active:scale-95'
                      }`}
                    >
                      {CustomIcon ? (
                        <CustomIcon active={active} className="w-6 h-6 sm:w-6.5 sm:h-6.5" />
                      ) : Icon ? (
                        <Icon className="w-6 h-6 sm:w-6.5 sm:h-6.5 stroke-[2] text-white" />
                      ) : null}
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Polar Arrow Button */}
          <button
            id="floaty-bar-next-page"
            type="button"
            onClick={handleNextPage}
            aria-label="Trang kế tiếp"
            title="Trang kế tiếp"
            className="w-10 h-10 sm:w-10.5 sm:h-10.5 rounded-full flex items-center justify-center text-white hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer shrink-0 border-0 shadow-none"
          >
            <ChevronRight className="w-6.5 h-6.5 stroke-[2.5] text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
