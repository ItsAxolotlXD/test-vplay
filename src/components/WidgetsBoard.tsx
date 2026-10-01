import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutGrid,
  Settings,
  RefreshCw,
  ExternalLink,
  X,
  Play,
  Pause,
  Sun,
  CloudRain,
  Wind,
  CloudSun,
  ChevronRight,
  TrendingUp,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { playPopSound } from '../utils/sound';

interface WidgetsBoardProps {
  isOpen: boolean;
  onClose: () => void;
  navigate?: (route: string) => void;
}

export const WidgetsBoard: React.FC<WidgetsBoardProps> = ({
  isOpen,
  onClose,
  navigate,
}) => {
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState<'widgets' | 'discover'>('widgets');
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('Vừa xong');

  // Greeting by hour of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const userName = settings.userName || 'Olivia';

  // Handle refresh action
  const handleRefresh = () => {
    setIsRefreshing(true);
    playPopSound();
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed('Vừa cập nhật');
    }, 800);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] overflow-hidden pointer-events-auto">
          {/* Dimmed backdrop with blur - click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-md"
          />

          {/* Left Sliding Widgets Board Container with High-Performance Acrylic Backdrop Blur */}
          <motion.div
            initial={{ x: '-100%', opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0.8 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute top-0 left-0 bottom-0 w-full sm:w-[620px] md:w-[700px] lg:w-[760px] xl:w-[840px] 2xl:w-[940px] max-w-full sm:max-w-[88vw] bg-[#F1F5F9]/80 dark:bg-[#141822]/80 shadow-[24px_0_70px_rgba(0,0,0,0.45)] flex border-r border-white/20 dark:border-white/10 select-none overflow-hidden"
            style={{
              backdropFilter: 'blur(36px) saturate(160%)',
              WebkitBackdropFilter: 'blur(36px) saturate(160%)',
            }}
          >
            {/* 1. LEFT RAIL DOCK (Windows 11 Widgets Left Navigation - Adaptive) */}
            <div className="w-13 sm:w-16 md:w-18 shrink-0 bg-white/35 dark:bg-black/25 backdrop-blur-xl border-r border-black/5 dark:border-white/10 flex flex-col items-center justify-between py-4 sm:py-5">
              {/* Top Navigation Items */}
              <div className="flex flex-col items-center gap-5 sm:gap-6 w-full">
                {/* Discover Tab Button */}
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setActiveTab('discover');
                  }}
                  className={`w-full flex flex-col items-center gap-1.5 py-1.5 sm:py-2 relative transition-all group cursor-pointer ${
                    activeTab === 'discover' ? 'text-[#388BFD]' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                  title="Discover"
                >
                  {activeTab === 'discover' && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#388BFD] rounded-r-full" />
                  )}
                  {/* Colorful Discover Flower / Butterfly Icon */}
                  <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill="none">
                      <path d="M12 3C10.5 5 10 7.5 12 9.5C14 7.5 13.5 5 12 3Z" fill="#00A4EF" />
                      <path d="M21 12C19 10.5 16.5 10 14.5 12C16.5 14 19 13.5 21 12Z" fill="#7FBA00" />
                      <path d="M12 21C13.5 19 14 16.5 12 14.5C10 16.5 10.5 19 12 21Z" fill="#F25022" />
                      <path d="M3 12C5 13.5 7.5 14 9.5 12C7.5 10 5 10.5 3 12Z" fill="#FFB900" />
                      <circle cx="12" cy="12" r="2.5" fill="#388BFD" />
                    </svg>
                  </div>
                  <span className="text-[9.5px] sm:text-[10.5px] font-semibold tracking-tight">Discover</span>
                </button>

                {/* Widgets Tab Button */}
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setActiveTab('widgets');
                  }}
                  className={`w-full flex flex-col items-center gap-1.5 py-1.5 sm:py-2 relative transition-all group cursor-pointer ${
                    activeTab === 'widgets' ? 'text-[#388BFD]' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                  title="Widgets"
                >
                  {activeTab === 'widgets' && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#388BFD] rounded-r-full" />
                  )}
                  <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
                  <span className="text-[9.5px] sm:text-[10.5px] font-semibold tracking-tight">Widgets</span>
                </button>
              </div>

              {/* Bottom Settings Button */}
              <div className="flex flex-col items-center gap-3 w-full">
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    onClose();
                    navigate?.('/settings');
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                  title="Cài đặt hệ thống"
                >
                  <Settings className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* 2. MAIN WIDGETS SCROLLABLE CONTENT */}
            <div className="flex-1 min-w-0 flex flex-col overflow-y-auto no-scrollbar overscroll-contain">
              {/* TOP HEADER GREETING BAR */}
              <div className="sticky top-0 z-20 px-4 sm:px-6 md:px-7 pt-4 sm:pt-5 pb-3 bg-[#F1F5F9]/70 dark:bg-[#141822]/70 backdrop-blur-2xl flex items-center justify-between border-b border-black/5 dark:border-white/5">
                {/* Greeting Title */}
                <div className="min-w-0 flex-1 pr-3">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-800 dark:text-white tracking-tight truncate">
                    {greeting}, {userName}
                  </h1>
                </div>

                {/* Right Action Icons: Refresh, Pin/Open, Profile Avatar, Close */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
                    title="Làm mới bảng tiện ích"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      onClose();
                      navigate?.('/news');
                    }}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
                    title="Mở tin tức đầy đủ"
                  >
                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {/* Profile Avatar */}
                  <div
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-gradient-to-tr from-sky-400 to-indigo-500 p-0.5 shadow-sm shrink-0 cursor-pointer"
                    onClick={() => {
                      onClose();
                      navigate?.('/settings');
                    }}
                    title="Hồ sơ tài khoản"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                      alt="User Avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  {/* Dismiss Close Button */}
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 sm:p-2 ml-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/15 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                    title="Đóng Widgets Board"
                  >
                    <X className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* GRID OF WIDGETS CARDS - Responsive 1 col on mobile, 2 cols on tablet, 3 cols on large screen */}
              <div className="p-4 sm:p-6 md:p-7 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 auto-rows-max">
                {/* -------------------------------------------------------------
                    WIDGET 1: WEATHER (Top Left - Soft Blue Tinted Card)
                    ------------------------------------------------------------- */}
                <div className="col-span-1 rounded-[26px] p-4.5 bg-gradient-to-b from-[#87CEEB]/40 to-[#BAE6FD]/20 dark:from-[#1E3A8A]/50 dark:to-[#0369A1]/20 border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-3 text-zinc-800 dark:text-white">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-zinc-800 dark:text-white">Seattle</span>
                      {/* Sun Icon with warm radial aura */}
                      <div className="w-8 h-8 rounded-full bg-amber-400/80 blur-[2px] flex items-center justify-center">
                        <Sun className="w-5 h-5 text-amber-500 fill-amber-300" />
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-4xl font-extrabold tracking-tight">78°</span>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">Partly sunny</div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">H 104°  L 48°</div>
                      </div>
                    </div>
                  </div>

                  {/* 5-Hour Forecast Row */}
                  <div className="grid grid-cols-5 gap-1 pt-3 border-t border-black/5 dark:border-white/10 text-center">
                    {[
                      { time: 'Now', temp: '78°', icon: Sun, color: 'text-amber-500', pop: '0%' },
                      { time: '10AM', temp: '75°', icon: CloudRain, color: 'text-sky-500', pop: '0%' },
                      { time: '11AM', temp: '75°', icon: Wind, color: 'text-indigo-400', pop: '0%' },
                      { time: '12PM', temp: '75°', icon: CloudRain, color: 'text-sky-500', pop: '0%' },
                      { time: '1PM', temp: '75°', icon: Sun, color: 'text-amber-500', pop: '0%' },
                    ].map((h, idx) => {
                      const Icon = h.icon;
                      return (
                        <div key={idx} className="flex flex-col items-center gap-1">
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">{h.time}</span>
                          <Icon className={`w-4 h-4 ${h.color}`} />
                          <span className="text-[11px] font-bold">{h.temp}</span>
                          <span className="text-[9px] text-zinc-400 dark:text-zinc-500">{h.pop}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    WIDGET 2: SPORTS HIGHLIGHT (Mariners ALCS News)
                    ------------------------------------------------------------- */}
                <div
                  onClick={() => {
                    playPopSound();
                    onClose();
                    navigate?.('/news');
                  }}
                  className="col-span-1 rounded-[26px] p-3 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2.5 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-full h-32 rounded-[20px] overflow-hidden relative bg-zinc-200 dark:bg-zinc-800">
                    <img
                      src="https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=600&q=80"
                      alt="Mariners Jersey"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="space-y-1.5 px-1 pb-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                      <div className="flex -space-x-1">
                        <div className="w-3.5 h-3.5 rounded-full bg-red-500 border border-white dark:border-zinc-800" />
                        <div className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-white dark:border-zinc-800" />
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white dark:border-zinc-800" />
                      </div>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">5 sources</span>
                      <Info className="w-3 h-3 text-zinc-400" />
                    </div>

                    <h3 className="font-bold text-xs sm:text-[13px] text-zinc-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#388BFD] transition-colors">
                      Mariners take 2-0 ALCS lead as series returns to Seattle
                    </h3>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    WIDGET 3: TRAVEL / SCENIC NEWS (Fall Destinations)
                    ------------------------------------------------------------- */}
                <div
                  onClick={() => {
                    playPopSound();
                    onClose();
                    navigate?.('/news');
                  }}
                  className="col-span-1 rounded-[26px] p-3 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2.5 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-full h-32 rounded-[20px] overflow-hidden relative bg-zinc-200 dark:bg-zinc-800">
                    <img
                      src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                      alt="Fall Mountain Valley"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="space-y-1.5 px-1 pb-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">Summit News • 1d</span>
                    </div>

                    <h3 className="font-bold text-xs sm:text-[13px] text-zinc-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#388BFD] transition-colors">
                      20 Stunning Fall Destinations in the USA You'll Love
                    </h3>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    WIDGET 4: STOCK MARKET (Microsoft Corp / MSFT)
                    ------------------------------------------------------------- */}
                <div className="col-span-1 rounded-[26px] p-4 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Microsoft Corp</h4>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">MSFT</span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">488.25</span>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                      +0.02%
                    </span>
                  </div>

                  {/* Clean Smooth Sparkline SVG */}
                  <div className="w-full h-8 pt-1">
                    <svg viewBox="0 0 100 24" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <path
                        d="M0,18 Q15,12 30,16 T60,8 T85,12 T100,6"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    WIDGET 5: NBA SPORTS MATCH (DAL vs DEN)
                    ------------------------------------------------------------- */}
                <div className="col-span-1 rounded-[26px] p-4 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
                    <span>NBA</span>
                    <span className="text-[11px]">Tue, Jul 1</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    {/* DAL Team */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold text-[10px]">
                        DAL
                      </div>
                      <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">DAL</span>
                    </div>

                    {/* Match Time */}
                    <div className="text-center">
                      <span className="text-base font-extrabold text-zinc-900 dark:text-white">9:30 PM</span>
                    </div>

                    {/* DEN Team */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-7 h-7 rounded-full bg-amber-600/20 text-amber-500 flex items-center justify-center font-bold text-[10px]">
                        DEN
                      </div>
                      <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">DEN</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 hover:underline cursor-pointer">
                      View injury report
                    </span>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    WIDGET 6: COPILOT DAILY PODCAST
                    ------------------------------------------------------------- */}
                <div className="col-span-1 rounded-[26px] p-4 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-zinc-900 dark:text-white">Copilot Daily</div>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Jul 1 • 5 min</span>
                    </div>
                    {/* Thumbnail Flowers Capsule */}
                    <div className="w-16 h-8 rounded-full overflow-hidden bg-zinc-200">
                      <img
                        src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=140&q=80"
                        alt="Flowers thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <p className="text-[11.5px] text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-tight">
                      Election result delays expected, Fed rate cut decision, Quincy Jones lea...
                    </p>

                    {/* Black Play Button */}
                    <button
                      type="button"
                      onClick={() => {
                        playPopSound();
                        setIsPlayingPodcast(!isPlayingPodcast);
                      }}
                      className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-md"
                      title={isPlayingPodcast ? 'Tạm dừng podcast' : 'Phát Copilot Daily'}
                    >
                      {isPlayingPodcast ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    WIDGET 7: TOKYO TRAVEL (Row 3, Left)
                    ------------------------------------------------------------- */}
                <div
                  onClick={() => {
                    playPopSound();
                    onClose();
                    navigate?.('/news');
                  }}
                  className="col-span-1 rounded-[26px] p-3 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-full h-32 rounded-[20px] overflow-hidden relative bg-zinc-200 dark:bg-zinc-800">
                    <img
                      src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80"
                      alt="Tokyo Pagoda"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-1 px-1 pb-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">Quantis • 1d</span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-[13px] text-zinc-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#388BFD] transition-colors">
                      Tokyo Takes the Top Spot in 'World's Coolest' Neighborhood Rankings
                    </h3>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    WIDGET 8: PHILIPPINES ISLAND (Row 3, Center)
                    ------------------------------------------------------------- */}
                <div
                  onClick={() => {
                    playPopSound();
                    onClose();
                    navigate?.('/news');
                  }}
                  className="col-span-1 rounded-[26px] p-3 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-full h-32 rounded-[20px] overflow-hidden relative bg-zinc-200 dark:bg-zinc-800">
                    <img
                      src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=600&q=80"
                      alt="Philippines Island"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-1 px-1 pb-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">Atlas Daily • 3h</span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-[13px] text-zinc-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#388BFD] transition-colors">
                      Explore Cities, Attractions, and Activities Throughout the Philippines
                    </h3>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    WIDGET 9: PHOTOGRAPHY TIPS (Row 3, Right)
                    ------------------------------------------------------------- */}
                <div
                  onClick={() => {
                    playPopSound();
                    onClose();
                    navigate?.('/news');
                  }}
                  className="col-span-1 rounded-[26px] p-3 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-full h-32 rounded-[20px] overflow-hidden relative bg-zinc-200 dark:bg-zinc-800">
                    <img
                      src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80"
                      alt="Polaroid Photos"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-1 px-1 pb-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">Metro Post • 15m</span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-[13px] text-zinc-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#388BFD] transition-colors">
                      Photography Composition Tips From a National Geographic Photo Story
                    </h3>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    WIDGET 10: SEAFOOD CULINARY (Row 4, Left)
                    ------------------------------------------------------------- */}
                <div
                  onClick={() => {
                    playPopSound();
                    onClose();
                    navigate?.('/news');
                  }}
                  className="col-span-1 rounded-[26px] p-3 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-full h-32 rounded-[20px] overflow-hidden relative bg-zinc-200 dark:bg-zinc-800">
                    <img
                      src="https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80"
                      alt="Seafood Dish"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-1 px-1 pb-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                      <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">Taste Atlas • 4h</span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-[13px] text-zinc-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#388BFD] transition-colors">
                      Traditional Culinary Masterpieces of Asian Seafood Cuisine
                    </h3>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    WIDGET 11: WILDFLOWERS (Row 4, Center)
                    ------------------------------------------------------------- */}
                <div
                  onClick={() => {
                    playPopSound();
                    onClose();
                    navigate?.('/news');
                  }}
                  className="col-span-1 rounded-[26px] p-3 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-full h-32 rounded-[20px] overflow-hidden relative bg-zinc-200 dark:bg-zinc-800">
                    <img
                      src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80"
                      alt="Wildflowers"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-1 px-1 pb-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                      <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">Nature Daily • 6h</span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-[13px] text-zinc-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#388BFD] transition-colors">
                      Spring Blooms and Biodiversity Across Protected Nature Reserves
                    </h3>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    WIDGET 12: CAMERA GEAR (Row 4, Right)
                    ------------------------------------------------------------- */}
                <div
                  onClick={() => {
                    playPopSound();
                    onClose();
                    navigate?.('/news');
                  }}
                  className="col-span-1 rounded-[26px] p-3 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-full h-32 rounded-[20px] overflow-hidden relative bg-zinc-200 dark:bg-zinc-800">
                    <img
                      src="https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&w=600&q=80"
                      alt="Camera on tripod"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-1 px-1 pb-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">Tech Lens • 8h</span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-[13px] text-zinc-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#388BFD] transition-colors">
                      The Best Mirrorless Cameras for Outdoor Field Work in 2026
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WidgetsBoard;
