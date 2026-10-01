import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  Tv, 
  ArrowRight, 
  CornerDownLeft, 
  Bell, 
  CheckCircle2, 
  Music, 
  Flag, 
  Settings, 
  Sparkles, 
  Info,
  LayoutGrid
} from 'lucide-react';
import { Channel } from '../types';
import { IslandNotification } from '../utils/islandNotifications';
import { playPopSound } from '../utils/sound';
import { WIDGETS_ICON_DATA_URI, WIDGETS_ICON_URL } from '../utils/widgetsIcon';

interface DynamicIslandProps {
  currentRoute?: string;
  navigate?: (route: string) => void;
  channels?: Channel[];
  currentChannel?: Channel;
  onSelectChannel?: (channel: Channel) => void;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({
  currentRoute = '/',
  navigate,
  channels = [],
  currentChannel,
  onSelectChannel,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Scroll tracking to dock Home logo into Dynamic Island when scrolling down
  const [isScrolled, setIsScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 60);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 60;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomeTab = currentRoute === '/' || currentRoute === '/home' || !currentRoute;

  // App notification state on Dynamic Island
  const [activeNotification, setActiveNotification] = useState<IslandNotification | null>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Expanded search state: only when focused or actively typing query (hover no longer expands search bar)
  const isSearchExpanded = isFocused || searchQuery.trim().length > 0;

  // Notification state active when not actively typing search
  const isNotificationActive = Boolean(activeNotification) && !isFocused && !searchQuery.trim();

  // Listen to application notifications dispatched across the app
  useEffect(() => {
    const handleNotificationEvent = (e: Event) => {
      const customEvent = e as CustomEvent<IslandNotification>;
      if (customEvent.detail && customEvent.detail.title) {
        if (notificationTimeoutRef.current) {
          clearTimeout(notificationTimeoutRef.current);
        }
        setActiveNotification(customEvent.detail);

        const duration = customEvent.detail.duration || 3500;
        notificationTimeoutRef.current = setTimeout(() => {
          setActiveNotification(null);
        }, duration);
      }
    };

    window.addEventListener('vplay:island_notification', handleNotificationEvent);
    return () => {
      window.removeEventListener('vplay:island_notification', handleNotificationEvent);
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  // Filter channels based on search query
  const matchingChannels = searchQuery.trim()
    ? channels
        .filter((ch) => {
          const q = searchQuery.toLowerCase().trim();
          return (
            ch.name.toLowerCase().includes(q) ||
            ch.slug.toLowerCase().includes(q) ||
            (ch.group && ch.group.toLowerCase().includes(q))
          );
        })
        .slice(0, 4)
    : [];

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Click outside listener to collapse search
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
        setIsHovered(false);
        if (!searchQuery) {
          inputRef.current?.blur();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  // Global hotkey: Ctrl/Cmd + / to focus Dynamic Island search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsFocused(true);
      }
      if (e.key === 'Escape' && isSearchExpanded) {
        setIsFocused(false);
        setIsHovered(false);
        setSearchQuery('');
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchExpanded]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    // If an item in dropdown is selected
    if (matchingChannels.length > 0 && selectedIndex < matchingChannels.length) {
      const selectedCh = matchingChannels[selectedIndex];
      if (onSelectChannel) {
        onSelectChannel(selectedCh);
      } else if (navigate) {
        navigate(`/live-tv?channel=${selectedCh.slug}`);
      }
      setSearchQuery('');
      setIsFocused(false);
      setIsHovered(false);
      inputRef.current?.blur();
      return;
    }

    // Otherwise navigate to search tab
    if (navigate) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } else {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }

    setSearchQuery('');
    setIsFocused(false);
    setIsHovered(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (matchingChannels.length + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + matchingChannels.length + 1) % (matchingChannels.length + 1));
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      setIsHovered(false);
      setSearchQuery('');
      inputRef.current?.blur();
    }
  };

  const isHomeLogoDocked = isHomeTab && isScrolled && !isSearchExpanded && !isNotificationActive;

  const handlePillClick = (e: React.MouseEvent) => {
    // If clicking directly into the input during active search, don't trigger board
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.closest('button')) {
      return;
    }
    if (isHomeLogoDocked && !isHovered) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    playPopSound();
    // Bấm vào Dynamic Island để mở Widgets board ra phía bên trái
    window.dispatchEvent(new CustomEvent('vplay:open_widgets_board'));
  };

  const dismissNotification = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveNotification(null);
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
  };

  // Render matching notification icon
  const renderNotificationIcon = (icon?: IslandNotification['icon']) => {
    switch (icon) {
      case 'check':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'tv':
        return <Tv className="w-4 h-4 text-blue-400 shrink-0" />;
      case 'music':
        return <Music className="w-4 h-4 text-purple-400 shrink-0" />;
      case 'flag':
        return <Flag className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'settings':
        return <Settings className="w-4 h-4 text-zinc-300 shrink-0" />;
      case 'sparkles':
        return <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />;
      case 'info':
        return <Info className="w-4 h-4 text-sky-400 shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-amber-400 shrink-0" />;
    }
  };

  // Calculate dynamic width based on notification length
  const getNotificationWidth = () => {
    if (!activeNotification) return '118px';
    const totalChars = (activeNotification.title || '').length + (activeNotification.message || '').length;
    // Stretch proportionally to text length: min 270px, max 540px
    const computed = Math.min(540, Math.max(270, totalChars * 7.2 + 80));
    return `clamp(270px, 86vw, ${computed}px)`;
  };

  // Determine pill target width
  let targetWidth = '118px';
  if (isSearchExpanded) {
    targetWidth = 'clamp(320px, 86vw, 520px)';
  } else if (isNotificationActive) {
    targetWidth = getNotificationWidth();
  } else if (isHovered) {
    targetWidth = '148px';
  } else if (isHomeLogoDocked) {
    targetWidth = '148px';
  }

  // Determine pill target height
  const targetHeight = isSearchExpanded ? '44px' : isNotificationActive ? '40px' : isHovered ? '36px' : isHomeLogoDocked ? '36px' : '34px';

  return (
    <>
      {/* Dynamic Island Viewport Safe Area with 100% opacity app background color */}
      <div
        id="dynamic-island-safe-area-bar"
        className="fixed top-0 left-0 right-0 h-11 sm:h-12 bg-[#181818] opacity-100 z-[100000] pointer-events-none transition-all duration-300 border-b border-white/[0.04]"
        aria-label="Dynamic Island Safe Area Bar"
      />

      <div
        ref={containerRef}
        id="dynamic-island-container"
        className="fixed top-2.5 sm:top-3 left-1/2 -translate-x-1/2 z-[100001] flex flex-col items-center pointer-events-none select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          if (!isFocused && !searchQuery) {
            inputRef.current?.blur();
          }
        }}
      >
      {/* Dynamic Island Main Pill (NO shadow, NO glow, pure matte black with bounce animation) */}
      <motion.div
        layout
        initial={false}
        animate={{
          width: targetWidth,
          height: targetHeight,
          borderRadius: '9999px',
          scale: isSearchExpanded || isNotificationActive ? [1, 1.035, 0.985, 1] : [1, 0.97, 1.015, 1],
        }}
        transition={{
          type: 'spring',
          stiffness: 480,
          damping: 22, // Lively elastic bounce
          mass: 0.75,
        }}
        whileHover={{ scale: isSearchExpanded ? 1 : 1.025 }}
        whileTap={{ scale: 0.97 }}
        className="relative pointer-events-auto bg-black text-white border border-zinc-800/80 shadow-none flex items-center justify-between px-3 cursor-pointer overflow-hidden"
        onClick={handlePillClick}
        title="Dynamic Island - Bấm để mở Widgets Board"
      >
        {/* 1A. HOVER VIEW: Khi hover qua dynamic island hiển thị icon Get.png, bấm vào mở widgets board */}
        {!isSearchExpanded && !isNotificationActive && isHovered && (
          <div 
            className="w-full h-full flex items-center justify-between pointer-events-auto select-none px-1 py-0.5 cursor-pointer"
            title="Bấm để mở Widgets Board"
          >
            {/* Left minimal sensor dot */}
            <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />

            {/* Hover Icon Get.png - Instant render via memory data URI */}
            <motion.img
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 450, damping: 24 }}
              src={WIDGETS_ICON_DATA_URI}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = WIDGETS_ICON_URL;
              }}
              alt="Widgets Board Icon"
              className="h-5 sm:h-5.5 w-auto max-w-[85px] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] shrink-0 select-none pointer-events-none"
            />

            {/* Right camera punch-hole dot */}
            <span className="w-2 h-2 rounded-full bg-[#18181b] flex items-center justify-center shrink-0">
              <span className="w-1 h-1 rounded-full bg-blue-900/60" />
            </span>
          </div>
        )}

        {/* 1B. LOGO DOCKED VIEW: Logo docked into Dynamic Island when scrolled down on Home (chỉ khi không hover) */}
        {!isSearchExpanded && !isNotificationActive && !isHovered && isHomeLogoDocked && (
          <div 
            className="w-full h-full flex items-center justify-between pointer-events-auto select-none px-1 py-0.5 cursor-pointer"
            title="VNRT Online - Bấm để cuộn lên đầu trang"
            onClick={(e) => {
              e.stopPropagation();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {/* Left minimal sensor dot */}
            <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />

            {/* Docked official brand logo with shared layoutId */}
            <motion.img
              layoutId="vnrt-official-brand-logo"
              src="https://static.wikia.nocookie.net/ep-deo/images/5/51/New_official_vnrt_logo.png/revision/latest?cb=20260926162432"
              alt="VNRT Online"
              referrerPolicy="no-referrer"
              className="h-5 sm:h-5.5 w-auto max-w-[85px] object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform shrink-0"
              transition={{
                type: 'spring',
                stiffness: 420,
                damping: 26,
              }}
            />

            {/* Right camera punch-hole dot */}
            <span className="w-2 h-2 rounded-full bg-[#18181b] flex items-center justify-center shrink-0">
              <span className="w-1 h-1 rounded-full bg-blue-900/60" />
            </span>
          </div>
        )}

        {/* 1C. DEFAULT COLLAPSED VIEW: Simple, pure black pill (chỉ khi không hover) */}
        {!isSearchExpanded && !isNotificationActive && !isHovered && !isHomeLogoDocked && (
          <div className="w-full flex items-center justify-between pointer-events-none select-none px-1">
            {/* Left minimal sensor dot */}
            <span className="w-2.5 h-2.5 rounded-full bg-[#161616]" />

            {/* Subtle center sensor */}
            <span className="w-1.5 h-1.5 rounded-full bg-[#161616]" />

            {/* Right camera punch-hole dot */}
            <span className="w-2.5 h-2.5 rounded-full bg-[#161616] flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-blue-900/50" />
            </span>
          </div>
        )}

        {/* 2. NOTIFICATION VIEW: Pill stretches to fit notification content */}
        {!isSearchExpanded && isNotificationActive && activeNotification && (
          <motion.div
            key={activeNotification.title}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="w-full flex items-center justify-between gap-2.5 px-1 py-0.5 overflow-hidden"
          >
            {/* Left Notification Icon */}
            <div className="flex items-center gap-2 min-w-0">
              {renderNotificationIcon(activeNotification.icon)}
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs font-bold text-white truncate">
                  {activeNotification.title}
                </span>
                {activeNotification.message && (
                  <span className="text-[11px] text-zinc-300 truncate hidden sm:inline">
                    • {activeNotification.message}
                  </span>
                )}
              </div>
            </div>

            {/* Right: dismiss button / camera dot */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={dismissNotification}
                className="w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                title="Đóng thông báo"
              >
                <X className="w-2.5 h-2.5" />
              </button>
              <span className="w-2 h-2 rounded-full bg-[#161616]" />
            </div>
          </motion.div>
        )}

        {/* 3. EXPANDED SEARCH VIEW: When hovered/focused, stretches and reveals white search icon and placeholder */}
        {isSearchExpanded && (
          <div className="w-full flex items-center gap-2.5 px-1 py-0.5">
            {/* White Search Icon */}
            <div className="shrink-0 flex items-center justify-center text-white">
              <Search className="w-4 h-4 text-white stroke-[2.5]" />
            </div>

            {/* Search Input Field with "Search for anything" placeholder */}
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center min-w-0">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  setTimeout(() => setIsFocused(false), 200);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search for anything"
                className="w-full bg-transparent text-white text-xs sm:text-sm font-medium placeholder:text-white/60 placeholder:font-normal focus:outline-none tracking-tight select-text"
                autoComplete="off"
                spellCheck="false"
              />
            </form>

            {/* Right controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              {searchQuery && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchQuery('');
                    inputRef.current?.focus();
                  }}
                  className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                  title="Xóa tìm kiếm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Enter badge */}
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white/90 hover:text-white text-[10px] font-semibold transition-colors cursor-pointer border border-white/15"
                title="Nhấn Enter để tìm kiếm"
              >
                <span>Enter</span>
                <CornerDownLeft className="w-2.5 h-2.5 text-white" />
              </button>

              {/* Hardware Punch-Hole Sensor Dot */}
              <span className="w-2.5 h-2.5 rounded-full bg-[#161616] shrink-0" />
            </div>
          </div>
        )}
      </motion.div>

      {/* QUICK SUGGESTIONS DROPDOWN WHEN USER TYPES (NO shadow, flat black border) */}
      <AnimatePresence>
        {isSearchExpanded && searchQuery.trim().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{
              type: 'spring',
              stiffness: 420,
              damping: 24,
            }}
            className="w-[clamp(320px,86vw,520px)] mt-2 rounded-2xl bg-black border border-zinc-800 shadow-none p-2 text-white overflow-hidden pointer-events-auto"
          >
            {/* Matching Channels */}
            {matchingChannels.length > 0 && (
              <div className="space-y-1 mb-2">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/40 flex items-center justify-between">
                  <span>Kênh truyền hình phù hợp</span>
                  <span className="text-[9px] text-[#FF7A00]">Trực tiếp</span>
                </div>
                {matchingChannels.map((ch, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => {
                        if (onSelectChannel) {
                          onSelectChannel(ch);
                        } else if (navigate) {
                          navigate(`/live-tv?channel=${ch.slug}`);
                        }
                        setSearchQuery('');
                        setIsFocused(false);
                        setIsHovered(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left cursor-pointer ${
                        isSelected ? 'bg-zinc-800/80 border border-zinc-700' : 'hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {ch.logo ? (
                          <img
                            src={ch.logo}
                            alt={ch.name}
                            className="w-6 h-6 object-contain rounded shrink-0 bg-white/5 p-0.5"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center shrink-0">
                            <Tv className="w-3.5 h-3.5 text-white/70" />
                          </div>
                        )}
                        <div className="truncate">
                          <p className="text-xs font-bold text-white truncate">{ch.name}</p>
                          <p className="text-[10px] text-white/50 truncate">
                            {ch.group || 'Kênh phát sóng'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#FF7A00] font-semibold shrink-0 flex items-center gap-1">
                        Xem ngay <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Global Search Option */}
            <button
              type="button"
              onClick={handleSearchSubmit}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer border-t border-zinc-800 pt-2 ${
                selectedIndex === matchingChannels.length
                  ? 'bg-white/15 text-white'
                  : 'hover:bg-zinc-900 text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-white/80" />
                <span className="text-xs font-semibold">
                  Tìm kiếm &quot;<span className="underline font-bold">{searchQuery}</span>&quot; trong toàn hệ thống
                </span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-white/90">
                ↵ Enter
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
};
