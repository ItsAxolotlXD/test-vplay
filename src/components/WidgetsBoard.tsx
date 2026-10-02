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
  Sparkles,
  Tv,
  Plus,
  Check,
  Search,
  Box,
  Calendar as CalendarIcon,
  CheckSquare,
  Square,
  Volume2,
  Compass,
  Coins
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useAuth } from '../context/AuthContext';
import { useOrbs } from '../hooks/useOrbs';
import { playPopSound } from '../utils/sound';
import { MinecraftCharacterAvatar, DEFAULT_MINECRAFT_SKIN } from './minecraft/MinecraftCharacterAvatar';
import { recordSpace360Launch } from '../utils/userHistory';

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
  const { user } = useAuth();
  const { orbs } = useOrbs();

  const [activeTab, setActiveTab] = useState<'widgets' | 'discover'>('widgets');
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCity, setSelectedCity] = useState<'hanoi' | 'hcm' | 'seattle'>('hanoi');

  // Widget visibility toggles
  const [visibleWidgets, setVisibleWidgets] = useState({
    weather: true,
    liveTv: true,
    stocks: true,
    sports: true,
    podcast: true,
    space360: true,
    todo: true,
    calendar: true,
  });

  // To-do tasks in widget
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Theo dõi Thời sự 19h trên VTV1 HD', done: true },
    { id: 2, text: 'Nhận thưởng Orbs hàng ngày', done: true },
    { id: 3, text: 'Trải nghiệm ứng dụng Space 360 mới', done: false },
    { id: 4, text: 'Tùy chỉnh skin Minecraft Aurora Cape', done: false },
  ]);

  // Greeting by hour of day (Vietnamese & Friendly)
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  }, []);

  const displayName = settings.userName || user?.displayName || 'Vplay Member';

  // Handle refresh action
  const handleRefresh = () => {
    setIsRefreshing(true);
    playPopSound();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  const toggleTask = (id: number) => {
    playPopSound();
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  // Lock background body scroll when board is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isAddWidgetModalOpen) {
          setIsAddWidgetModalOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isAddWidgetModalOpen, onClose]);

  // Weather data by city
  const weatherData = {
    hanoi: {
      city: 'Hà Nội',
      temp: '31°',
      condition: 'Nắng dịu, mây nhẹ',
      highLow: 'H 34°  L 25°',
      pop: '10%',
      icon: Sun,
      hourly: [
        { time: 'Bây giờ', temp: '31°', icon: Sun, color: 'text-amber-500' },
        { time: '14:00', temp: '33°', icon: CloudSun, color: 'text-amber-400' },
        { time: '16:00', temp: '32°', icon: CloudSun, color: 'text-sky-400' },
        { time: '18:00', temp: '29°', icon: CloudRain, color: 'text-blue-400' },
        { time: '20:00', temp: '27°', icon: Sun, color: 'text-indigo-400' },
      ],
    },
    hcm: {
      city: 'TP. Hồ Chí Minh',
      temp: '33°',
      condition: 'Mưa rào về chiều',
      highLow: 'H 35°  L 26°',
      pop: '65%',
      icon: CloudRain,
      hourly: [
        { time: 'Bây giờ', temp: '33°', icon: Sun, color: 'text-amber-500' },
        { time: '14:00', temp: '34°', icon: CloudRain, color: 'text-sky-500' },
        { time: '16:00', temp: '29°', icon: CloudRain, color: 'text-blue-500' },
        { time: '18:00', temp: '28°', icon: CloudSun, color: 'text-indigo-400' },
        { time: '20:00', temp: '27°', icon: Sun, color: 'text-indigo-400' },
      ],
    },
    seattle: {
      city: 'Seattle',
      temp: '78°',
      condition: 'Partly sunny',
      highLow: 'H 82°  L 56°',
      pop: '0%',
      icon: Sun,
      hourly: [
        { time: 'Now', temp: '78°', icon: Sun, color: 'text-amber-500' },
        { time: '10AM', temp: '75°', icon: CloudSun, color: 'text-amber-400' },
        { time: '12PM', temp: '79°', icon: Sun, color: 'text-amber-500' },
        { time: '2PM', temp: '81°', icon: Sun, color: 'text-amber-500' },
        { time: '4PM', temp: '77°', icon: Wind, color: 'text-sky-400' },
      ],
    },
  };

  const currentWeather = weatherData[selectedCity];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="vplay-widgets-board-root"
          className="fixed inset-0 z-[100060] select-none pointer-events-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Windows 11 Widgets Board"
        >
          {/* Dimmed frosted backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 cursor-pointer z-10"
            style={{
              backdropFilter: 'blur(20px) saturate(140%)',
              WebkitBackdropFilter: 'blur(20px) saturate(140%)',
            }}
          />

          {/* Left Sliding Widgets Board Container */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-0 top-0 bottom-0 z-20 w-full sm:w-[680px] md:w-[760px] lg:w-[840px] max-w-[94vw] h-full max-h-screen bg-[#F8FAFC] dark:bg-[#0E121A] text-zinc-900 dark:text-white shadow-[24px_0_70px_rgba(0,0,0,0.7)] flex border-r border-zinc-200 dark:border-zinc-800/80 overflow-hidden"
          >
            {/* 1. LEFT RAIL DOCK (Windows 11 Left Navigation) */}
            <div className="w-14 sm:w-16 md:w-20 shrink-0 bg-white dark:bg-[#131722] border-r border-zinc-200 dark:border-zinc-800/70 flex flex-col items-center justify-between py-4 sm:py-5 z-20">
              {/* Navigation Items */}
              <div className="flex flex-col items-center gap-5 sm:gap-6 w-full">
                {/* Widgets Tab Button */}
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setActiveTab('widgets');
                  }}
                  className={`w-full flex flex-col items-center gap-1.5 py-1.5 sm:py-2 relative transition-all group cursor-pointer ${
                    activeTab === 'widgets'
                      ? 'text-[#388BFD]'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                  title="Bảng tiện ích (Widgets)"
                >
                  {activeTab === 'widgets' && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#388BFD] rounded-r-full" />
                  )}
                  <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
                  <span className="text-[9.5px] sm:text-[10.5px] font-semibold tracking-tight">Widgets</span>
                </button>

                {/* Discover Tab Button */}
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setActiveTab('discover');
                  }}
                  className={`w-full flex flex-col items-center gap-1.5 py-1.5 sm:py-2 relative transition-all group cursor-pointer ${
                    activeTab === 'discover'
                      ? 'text-[#388BFD]'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                  title="Khám phá tin tức (Discover)"
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

            {/* 2. MAIN SCROLLABLE CONTENT */}
            <div className="flex-1 min-w-0 flex flex-col overflow-y-auto no-scrollbar overscroll-contain bg-[#F8FAFC] dark:bg-[#0E121A] overflow-x-hidden">
              {/* TOP HEADER GREETING BAR */}
              <div className="sticky top-0 z-20 px-4 sm:px-6 md:px-7 pt-4 sm:pt-5 pb-3 bg-[#F8FAFC]/95 dark:bg-[#0E121A]/95 backdrop-blur-md flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/70">
                {/* Greeting & Date */}
                <div className="min-w-0 flex-1 pr-3">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-800 dark:text-white tracking-tight truncate">
                    {greeting}, {displayName}
                  </h1>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                {/* Right Action Icons: Add Widget, Refresh, Profile Avatar, Close */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {/* Add Widgets Button */}
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setIsAddWidgetModalOpen(!isAddWidgetModalOpen);
                    }}
                    className="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Thêm hoặc tùy biến tiện ích"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Tiện ích</span>
                  </button>

                  {/* Refresh Button */}
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
                    title="Làm mới tiện ích"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>

                  {/* Minecraft Character Default Profile Avatar */}
                  <div
                    className="w-8 h-8 rounded-full overflow-hidden bg-zinc-900 border-2 border-emerald-400/90 shadow-sm shrink-0 cursor-pointer p-0.5 flex items-center justify-center hover:scale-105 transition-transform"
                    onClick={() => {
                      onClose();
                      navigate?.('/settings');
                    }}
                    title="Hồ sơ Minecraft & Cài đặt tài khoản"
                  >
                    <MinecraftCharacterAvatar
                      skinUrl={DEFAULT_MINECRAFT_SKIN}
                      size={28}
                      mode="head"
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

              {/* SEARCH & FILTER BAR */}
              <div className="px-4 sm:px-6 md:px-7 pt-3 pb-1">
                <div className="relative w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder={activeTab === 'widgets' ? 'Tìm tiện ích, ứng dụng space 360...' : 'Tìm tin tức, chủ đề khám phá...'}
                    className="w-full bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9.5 pr-4 py-2 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#388BFD]/50 shadow-sm"
                  />
                  {searchFilter && (
                    <button
                      onClick={() => setSearchFilter('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* TAB 1: PURE WIDGETS MODE */}
              {activeTab === 'widgets' && (
                <div className="p-4 sm:p-6 md:p-7 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 auto-rows-max overflow-x-hidden">
                  {/* WIDGET 1: WEATHER (Adaptive with City Picker) */}
                  {visibleWidgets.weather && (
                    <div className="col-span-1 rounded-[24px] p-4 bg-gradient-to-b from-[#87CEEB]/40 to-[#BAE6FD]/20 dark:from-[#1E3A8A]/50 dark:to-[#0369A1]/20 border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-3 text-zinc-800 dark:text-white">
                      <div>
                        <div className="flex items-center justify-between">
                          {/* City selector pills */}
                          <div className="flex items-center gap-1.5 bg-black/10 dark:bg-black/30 p-0.5 rounded-lg text-[11px]">
                            <button
                              onClick={() => setSelectedCity('hanoi')}
                              className={`px-2 py-0.5 rounded-md font-bold transition-all ${selectedCity === 'hanoi' ? 'bg-white dark:bg-zinc-800 shadow-xs' : 'opacity-70'}`}
                            >
                              Hà Nội
                            </button>
                            <button
                              onClick={() => setSelectedCity('hcm')}
                              className={`px-2 py-0.5 rounded-md font-bold transition-all ${selectedCity === 'hcm' ? 'bg-white dark:bg-zinc-800 shadow-xs' : 'opacity-70'}`}
                            >
                              TP.HCM
                            </button>
                            <button
                              onClick={() => setSelectedCity('seattle')}
                              className={`px-2 py-0.5 rounded-md font-bold transition-all ${selectedCity === 'seattle' ? 'bg-white dark:bg-zinc-800 shadow-xs' : 'opacity-70'}`}
                            >
                              Seattle
                            </button>
                          </div>

                          <div className="w-7 h-7 rounded-full bg-amber-400/80 blur-[2px] flex items-center justify-center">
                            <Sun className="w-4.5 h-4.5 text-amber-500 fill-amber-300" />
                          </div>
                        </div>

                        <div className="flex items-baseline justify-between mt-2">
                          <span className="text-4xl font-extrabold tracking-tight">{currentWeather.temp}</span>
                          <div className="text-right">
                            <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">{currentWeather.condition}</div>
                            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">{currentWeather.highLow}</div>
                          </div>
                        </div>
                      </div>

                      {/* Hourly Forecast */}
                      <div className="grid grid-cols-5 gap-1 pt-2.5 border-t border-black/5 dark:border-white/10 text-center">
                        {currentWeather.hourly.map((h, idx) => {
                          const Icon = h.icon;
                          return (
                            <div key={idx} className="flex flex-col items-center gap-1">
                              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">{h.time}</span>
                              <Icon className={`w-3.5 h-3.5 ${h.color}`} />
                              <span className="text-[11px] font-bold">{h.temp}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* WIDGET 2: LIVE TV ON-AIR QUICK PLAYER */}
                  {visibleWidgets.liveTv && (
                    <div className="col-span-1 rounded-[24px] p-4 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Trực tiếp VTV1</span>
                        </div>
                        <span className="text-[11px] font-mono text-zinc-400">CH 001</span>
                      </div>

                      <div className="flex items-center gap-3 py-1">
                        <div className="w-12 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center p-1 overflow-hidden shrink-0">
                          <img
                            src="https://static.wikia.nocookie.net/ep-deo/images/2/23/VTV1_2013_logo.png/revision/latest?cb=20240902120000"
                            alt="VTV1"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white truncate">
                            Thời sự 19h & Toàn cảnh trong nước
                          </h4>
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            Phát sóng trực tiếp • 1080p FHD
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          playPopSound();
                          onClose();
                          navigate?.('/live-tv');
                        }}
                        className="w-full py-2 bg-[#388BFD] hover:bg-[#2575FC] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Tv className="w-3.5 h-3.5" />
                        Xem truyền hình ngay
                      </button>
                    </div>
                  )}

                  {/* WIDGET 3: STOCK & ORBS MARKET */}
                  {visibleWidgets.stocks && (
                    <div className="col-span-1 rounded-[24px] p-4 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Microsoft Corp / Vplay</h4>
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">MSFT • ORBS</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[11px] font-bold font-mono">
                          <Coins className="w-3 h-3" />
                          {orbs.toLocaleString()} Orbs
                        </div>
                      </div>

                      <div className="flex items-baseline gap-2.5">
                        <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">488.25</span>
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                          +0.02%
                        </span>
                      </div>

                      {/* Smooth Sparkline */}
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
                  )}

                  {/* WIDGET 4: SPORTS MATCH (DAL vs DEN / VTV Cup) */}
                  {visibleWidgets.sports && (
                    <div className="col-span-1 rounded-[24px] p-4 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2">
                      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
                        <span className="text-blue-500 font-bold">NBA ALCS</span>
                        <span className="text-[11px]">Trực tiếp hiệp 4</span>
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold text-xs">
                            DAL
                          </div>
                          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">104</span>
                        </div>

                        <div className="text-center">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                            Đang đấu
                          </span>
                          <div className="text-[11px] text-zinc-400 font-mono mt-0.5">Q4 02:45</div>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-500 flex items-center justify-center font-bold text-xs">
                            DEN
                          </div>
                          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">101</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          onClick={() => {
                            onClose();
                            navigate?.('/live-tv');
                          }}
                          className="text-[11px] text-[#388BFD] hover:underline cursor-pointer font-medium"
                        >
                          Xem trực tiếp trên kênh thể thao →
                        </span>
                      </div>
                    </div>
                  )}

                  {/* WIDGET 5: COPILOT DAILY PODCAST */}
                  {visibleWidgets.podcast && (
                    <div className="col-span-1 rounded-[24px] p-4 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-sm text-zinc-900 dark:text-white">Copilot Daily Audio</div>
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Điểm tin công nghệ & TV</span>
                        </div>
                        <div className="w-14 h-7 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                          <img
                            src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=120&q=80"
                            alt="Flowers"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-1">
                        <p className="text-[11.5px] text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-tight">
                          Tổng hợp tin tức nổi bật trong ngày cùng AI Copilot for Vplay...
                        </p>

                        <button
                          type="button"
                          onClick={() => {
                            playPopSound();
                            setIsPlayingPodcast(!isPlayingPodcast);
                          }}
                          className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-md"
                          title={isPlayingPodcast ? 'Tạm dừng' : 'Phát Podcast'}
                        >
                          {isPlayingPodcast ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* WIDGET 6: SPACE 360 QUICK LAUNCHER */}
                  {visibleWidgets.space360 && (
                    <div className="col-span-1 rounded-[24px] p-4 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                          <Box className="w-4 h-4 text-purple-400" />
                          Space 360 Apps
                        </span>
                        <span
                          onClick={() => {
                            onClose();
                            navigate?.('/v-apps');
                          }}
                          className="text-[11px] text-[#388BFD] hover:underline cursor-pointer"
                        >
                          Tất cả
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                        {[
                          { id: 'driving', name: 'Lái xe', route: '/app/driving', icon: '🚗' },
                          { id: 'mspaint', name: 'Paint', route: '/app/mspaint', icon: '🎨' },
                          { id: 'calc', name: 'Máy tính', route: '/app/calculator', icon: '🔢' },
                          { id: 'notes', name: 'Ghi chú', route: '/v-notes', icon: '📝' },
                        ].map((app) => (
                          <button
                            key={app.id}
                            onClick={() => {
                              playPopSound();
                              recordSpace360Launch({
                                id: app.id,
                                name: app.name,
                                route: app.route,
                              });
                              onClose();
                              navigate?.(app.route);
                            }}
                            className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex flex-col items-center gap-1 cursor-pointer"
                          >
                            <span className="text-lg">{app.icon}</span>
                            <span className="text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 truncate w-full">
                              {app.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WIDGET 7: TO-DO TASKS */}
                  {visibleWidgets.todo && (
                    <div className="col-span-1 rounded-[24px] p-4 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                          <CheckSquare className="w-4 h-4 text-emerald-500" />
                          Việc cần làm
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          {tasks.filter(t => t.done).length}/{tasks.length}
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        {tasks.slice(0, 3).map((task) => (
                          <div
                            key={task.id}
                            onClick={() => toggleTask(task.id)}
                            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-xs"
                          >
                            {task.done ? (
                              <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-zinc-400 shrink-0" />
                            )}
                            <span className={`truncate ${task.done ? 'line-through text-zinc-400' : 'text-zinc-700 dark:text-zinc-200'}`}>
                              {task.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WIDGET 8: CALENDAR & SCHEDULE */}
                  {visibleWidgets.calendar && (
                    <div className="col-span-1 rounded-[24px] p-4 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                          <CalendarIcon className="w-4 h-4 text-sky-400" />
                          Lịch & Sự kiện TV
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400">2026</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs">
                        <div className="font-bold text-sky-400">Chung kết Gameshow VTV3</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">Hôm nay • 20:30 trên VTV3 HD</div>
                      </div>

                      <div className="text-right">
                        <span
                          onClick={() => {
                            onClose();
                            navigate?.('/event');
                          }}
                          className="text-[11px] text-[#388BFD] hover:underline cursor-pointer font-medium"
                        >
                          Xem tất cả sự kiện →
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: DISCOVER NEWS FEED MODE */}
              {activeTab === 'discover' && (
                <div className="p-4 sm:p-6 md:p-7 pt-3 space-y-4">
                  {/* Category Pills Filter */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {['Tất cả', 'Thời sự', 'Thể thao', 'Công nghệ', 'Du lịch', 'Ẩm thực'].map((cat, i) => (
                      <button
                        key={cat}
                        onClick={playPopSound}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          i === 0
                            ? 'bg-[#388BFD] text-white'
                            : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Discover Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    {/* Story 1: Mariners ALCS */}
                    <div
                      onClick={() => {
                        playPopSound();
                        onClose();
                        navigate?.('/news');
                      }}
                      className="rounded-[24px] p-3 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2.5 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="w-full h-36 rounded-[18px] overflow-hidden relative bg-zinc-200 dark:bg-zinc-800">
                        <img
                          src="https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=600&q=80"
                          alt="Sports"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="space-y-1.5 px-1 pb-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300">Thể thao • 5 nguồn</span>
                          <Info className="w-3 h-3 text-zinc-400" />
                        </div>
                        <h3 className="font-bold text-xs sm:text-[13px] text-zinc-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#388BFD] transition-colors">
                          Mariners dẫn trước 2-0 trong loạt trận chung kết ALCS khi trở về Seattle
                        </h3>
                      </div>
                    </div>

                    {/* Story 2: Fall Destinations */}
                    <div
                      onClick={() => {
                        playPopSound();
                        onClose();
                        navigate?.('/news');
                      }}
                      className="rounded-[24px] p-3 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2.5 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="w-full h-36 rounded-[18px] overflow-hidden relative bg-zinc-200 dark:bg-zinc-800">
                        <img
                          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                          alt="Destinations"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="space-y-1.5 px-1 pb-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300">Summit News • 1 ngày</span>
                        </div>
                        <h3 className="font-bold text-xs sm:text-[13px] text-zinc-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#388BFD] transition-colors">
                          20 Điểm đến mùa thu tuyệt đẹp trên thế giới bạn không nên bỏ lỡ
                        </h3>
                      </div>
                    </div>

                    {/* Story 3: Tokyo Neighborhoods */}
                    <div
                      onClick={() => {
                        playPopSound();
                        onClose();
                        navigate?.('/news');
                      }}
                      className="rounded-[24px] p-3 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2.5 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="w-full h-36 rounded-[18px] overflow-hidden relative bg-zinc-200 dark:bg-zinc-800">
                        <img
                          src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80"
                          alt="Tokyo"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="space-y-1 px-1 pb-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300">Quantis • 3 giờ</span>
                        </div>
                        <h3 className="font-bold text-xs sm:text-[13px] text-zinc-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#388BFD] transition-colors">
                          Tokyo vươn lên vị trí dẫn đầu trong bảng xếp hạng khu phố thời thượng nhất
                        </h3>
                      </div>
                    </div>

                    {/* Story 4: Photography */}
                    <div
                      onClick={() => {
                        playPopSound();
                        onClose();
                        navigate?.('/news');
                      }}
                      className="rounded-[24px] p-3 bg-white/90 dark:bg-white/[0.08] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-2.5 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="w-full h-36 rounded-[18px] overflow-hidden relative bg-zinc-200 dark:bg-zinc-800">
                        <img
                          src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80"
                          alt="Photography"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="space-y-1 px-1 pb-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300">Metro Post • 15 phút</span>
                        </div>
                        <h3 className="font-bold text-xs sm:text-[13px] text-zinc-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#388BFD] transition-colors">
                          Bí quyết bố cục chụp ảnh phong cảnh từ các nhiếp ảnh gia hàng đầu
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* ADD WIDGET CUSTOMIZATION MODAL */}
          <AnimatePresence>
            {isAddWidgetModalOpen && (
              <div className="fixed inset-0 z-[100070] flex items-center justify-center p-4">
                <div
                  className="fixed inset-0 bg-black/50"
                  onClick={() => setIsAddWidgetModalOpen(false)}
                />
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.92, opacity: 0 }}
                  className="relative z-10 w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      <LayoutGrid className="w-4.5 h-4.5 text-[#388BFD]" />
                      Tùy biến bảng Tiện ích
                    </h3>
                    <button
                      onClick={() => setIsAddWidgetModalOpen(false)}
                      className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-zinc-500">
                    Bật hoặc tắt các khối tiện ích hiển thị trên Widgets Board của bạn:
                  </p>

                  <div className="space-y-2 max-h-[50vh] overflow-y-auto no-scrollbar pr-1">
                    {[
                      { key: 'weather', name: 'Thời tiết thực tế', icon: Sun },
                      { key: 'liveTv', name: 'Truyền hình trực tiếp VTV', icon: Tv },
                      { key: 'stocks', name: 'Thị trường & Orbs', icon: TrendingUp },
                      { key: 'sports', name: 'Trận đấu Thể thao', icon: Sparkles },
                      { key: 'podcast', name: 'Copilot Daily Podcast', icon: Volume2 },
                      { key: 'space360', name: 'Lối tắt Space 360 Apps', icon: Box },
                      { key: 'todo', name: 'Việc cần làm (To-Do)', icon: CheckSquare },
                      { key: 'calendar', name: 'Lịch & Sự kiện', icon: CalendarIcon },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isEnabled = visibleWidgets[item.key as keyof typeof visibleWidgets];
                      return (
                        <div
                          key={item.key}
                          onClick={() => {
                            playPopSound();
                            setVisibleWidgets(prev => ({
                              ...prev,
                              [item.key]: !isEnabled,
                            }));
                          }}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                              {item.name}
                            </span>
                          </div>

                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                            isEnabled
                              ? 'bg-[#388BFD] border-[#388BFD] text-white'
                              : 'border-zinc-300 dark:border-zinc-600'
                          }`}>
                            {isEnabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setIsAddWidgetModalOpen(false)}
                      className="px-4 py-2 bg-[#388BFD] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                    >
                      Hoàn tất
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WidgetsBoard;
