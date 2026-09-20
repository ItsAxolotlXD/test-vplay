import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Wifi, ChevronLeft, Sparkles, X, BatteryCharging, Radio } from 'lucide-react';
import { useTabSearch } from '../context/TabSearchContext';
import { Channel } from '../types';
import { CHANNELS_DATA } from '../data/channels';

interface StatusBarProps {
  isDynamicIsland?: boolean;
  onBack?: () => void;
  navigate?: (route: string) => void;
  channels?: Channel[];
  currentChannel?: Channel;
  onSelectChannel?: (channel: Channel) => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  isDynamicIsland = true,
  onBack,
  navigate,
  channels = [],
  currentChannel,
  onSelectChannel,
}) => {
  const { isSearchExpanded, toggleSearchExpanded } = useTabSearch();
  const [timeStr, setTimeStr] = useState('9:41');
  const [fullDateStr, setFullDateStr] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHoveredIsland, setIsHoveredIsland] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(95);
  const [isCharging, setIsCharging] = useState(false);
  const [showStatusTooltip, setShowStatusTooltip] = useState(false);
  const [recentChannels, setRecentChannels] = useState<Channel[]>([]);
  const islandRef = useRef<HTMLDivElement>(null);

  // Update real-time clock and date
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);

      const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = daysOfWeek[now.getDay()];
      const day = now.getDate();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      setFullDateStr(`${dayName}, ${day}/${month}/${year}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Try reading battery from Battery Status API if available
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      }).catch(() => {});
    }
  }, []);

  // Track and load 4 recent channels
  useEffect(() => {
    const allChannels = (channels && channels.length > 0) ? channels : CHANNELS_DATA;
    try {
      const savedIds = JSON.parse(localStorage.getItem('vplay_recent_channel_ids') || '[]');
      let resolved: Channel[] = [];
      if (Array.isArray(savedIds) && savedIds.length > 0) {
        resolved = savedIds
          .map((id: string) => allChannels.find((c) => c.id === id || c.slug === id))
          .filter(Boolean) as Channel[];
      }
      // Top fallback channels: VTV1, VTV3, VTV6, ON TRENDING
      const defaults = ['vtv1', 'vtv3', 'vtv6', 'on_trending'];
      for (const defId of defaults) {
        if (resolved.length >= 4) break;
        const ch = allChannels.find((c) => c.id === defId || c.slug === defId);
        if (ch && !resolved.some((r) => r.id === ch.id)) {
          resolved.push(ch);
        }
      }
      for (const ch of allChannels) {
        if (resolved.length >= 4) break;
        if (!resolved.some((r) => r.id === ch.id)) {
          resolved.push(ch);
        }
      }
      setRecentChannels(resolved.slice(0, 4));
    } catch {
      setRecentChannels(allChannels.slice(0, 4));
    }
  }, [channels]);

  // When active channel changes, prepend to recent channels
  useEffect(() => {
    if (!currentChannel?.id) return;
    try {
      const savedIds: string[] = JSON.parse(localStorage.getItem('vplay_recent_channel_ids') || '[]');
      const nextIds = [currentChannel.id, ...savedIds.filter((id) => id !== currentChannel.id)].slice(0, 10);
      localStorage.setItem('vplay_recent_channel_ids', JSON.stringify(nextIds));

      const allChannels = (channels && channels.length > 0) ? channels : CHANNELS_DATA;
      const resolved = nextIds
        .map((id) => allChannels.find((c) => c.id === id || c.slug === id))
        .filter(Boolean) as Channel[];

      for (const ch of allChannels) {
        if (resolved.length >= 4) break;
        if (!resolved.some((r) => r.id === ch.id)) {
          resolved.push(ch);
        }
      }
      setRecentChannels(resolved.slice(0, 4));
    } catch {}
  }, [currentChannel, channels]);

  const handleSelectRecentChannel = (ch: Channel) => {
    if (onSelectChannel) {
      onSelectChannel(ch);
    }
    if (navigate) {
      navigate(`/live-tv?channel=${ch.slug}`);
    }
  };

  // Close expanded Dynamic Island when clicking outside
  useEffect(() => {
    if (!isExpanded) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (islandRef.current && !islandRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isExpanded]);

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else if (navigate) {
      navigate('/');
    }
  };

  // SVG Battery Arc calculations:
  // Radius = 17, Center = (22, 22). Arc from 135deg to 45deg (270deg sweep).
  // Total arc length = (270 / 360) * (2 * PI * 17) ≈ 80.1
  const totalArcLength = 80.1;
  const clampedBattery = Math.max(5, Math.min(100, batteryLevel));
  const activeArcLength = (clampedBattery / 100) * totalArcLength;

  return (
    <>
      {/* 0. PROGRESSIVE BLUR BACKGROUND LAYER ON RIGHT SIDE */}
      <div
        aria-hidden="true"
        id="status-bar-progressive-blur"
        className="pointer-events-none fixed top-0 right-0 h-screen w-28 sm:w-36 z-[90] overflow-hidden select-none"
      >
        {/* Step 1: Broad soft blur */}
        <div 
          className="absolute inset-0 backdrop-blur-sm"
          style={{
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 35%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 35%, rgba(0,0,0,0) 100%)',
          }}
        />
        {/* Step 2: Medium progressive blur */}
        <div 
          className="absolute inset-0 backdrop-blur-md"
          style={{
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0) 85%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0) 85%)',
          }}
        />
        {/* Step 3: Deep blur near right border */}
        <div 
          className="absolute inset-0 backdrop-blur-2xl"
          style={{
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0) 65%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0) 65%)',
          }}
        />
        {/* Step 4: Vertical top gradient vignette for top items */}
        <div 
          className="absolute top-0 right-0 w-full h-[360px] bg-gradient-to-b from-black/30 via-black/10 to-transparent pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0) 100%)',
          }}
        />
        {/* Step 5: Vertical bottom gradient vignette for foot buttons */}
        <div 
          className="absolute bottom-0 right-0 w-full h-[260px] bg-gradient-to-t from-black/35 via-black/10 to-transparent pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0) 100%)',
          }}
        />
      </div>

      {/* VERTICAL STATUS BAR ITEMS (Full height column: Top Cluster, Middle Recent Channels Dock, Bottom Search Button) */}
      <aside
        id="app-vertical-status-bar"
        aria-label="Thanh trạng thái và điều khiển nhanh bên phải"
        className="fixed top-4 sm:top-6 bottom-4 sm:bottom-6 right-3.5 sm:right-6 z-[95] flex flex-col justify-between items-center select-none pointer-events-none"
        style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {/* 1. TOP CLUSTER (Dynamic Island, Digital Clock, Gauge, Back Button) */}
        <div className="flex flex-col items-center gap-3.5 pointer-events-auto">
          {/* DYNAMIC ISLAND (Hover expands to vertical pill, Click expands to card) */}
          <div ref={islandRef} className="relative flex items-center justify-center">
            <motion.button
              type="button"
              onMouseEnter={() => setIsHoveredIsland(true)}
              onMouseLeave={() => setIsHoveredIsland(false)}
              onClick={() => isDynamicIsland && setIsExpanded(!isExpanded)}
              animate={
                isHoveredIsland && !isExpanded
                  ? { height: 48, width: 16, borderRadius: 9999 }
                  : { height: 16, width: 16, borderRadius: 9999 }
              }
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              title={isDynamicIsland ? "Dynamic Island (Hover: Xem trạng thái • Click: Mở rộng)" : "Dynamic Island"}
              aria-label="Dynamic Island"
              className="bg-black dark:bg-black shadow-[0_2px_8px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] border border-white/20 flex flex-col items-center justify-between py-1.5 cursor-pointer select-none overflow-hidden"
            >
              {isHoveredIsland && !isExpanded ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col items-center justify-between h-full w-full py-0.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <div className="flex flex-col items-center gap-0.5 my-auto">
                    <span className="w-0.5 h-2.5 rounded-full bg-white/90 animate-pulse" />
                    <span className="w-0.5 h-1.5 rounded-full bg-white/50" />
                  </div>
                  <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
                </motion.div>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse my-auto" />
              )}
            </motion.button>

            {/* EXPANDED DYNAMIC ISLAND CARD (Expands smoothly toward the left) */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.88, x: 20, y: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 15, y: -5 }}
                  transition={{ type: 'spring', damping: 26, stiffness: 360 }}
                  className="absolute right-full mr-3 top-0 w-72 sm:w-80 rounded-2xl p-4 bg-[#141418]/95 dark:bg-[#121216]/95 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)] text-white z-50 origin-top-right select-none"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-white flex items-center gap-1.5">
                          <span>VPlay Dynamic Island</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          Hệ thống đang hoạt động
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsExpanded(false)}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Đóng"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Status Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">Thời gian</span>
                      <span className="text-[16px] font-bold text-white font-mono leading-none">{timeStr}</span>
                      <span className="text-[10px] text-zinc-400 truncate">{fullDateStr || 'Hôm nay'}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">Pin thiết bị</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[16px] font-bold text-white font-mono leading-none">{batteryLevel}%</span>
                        {isCharging && <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />}
                      </div>
                      <span className="text-[10px] text-emerald-400">
                        {isCharging ? 'Đang sạc nhanh' : 'Mức pin tốt'}
                      </span>
                    </div>
                  </div>

                  {/* Network Status & Quick Info */}
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between mb-3 text-[11px]">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-cyan-400" />
                      <span className="text-zinc-200">Wi-Fi 6 Connected</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <Radio className="w-3.5 h-3.5 text-purple-400" />
                      <span>5G Full Bars</span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {navigate && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setIsExpanded(false);
                            navigate('/');
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 active:scale-95 text-[11px] font-semibold text-white transition-all text-center cursor-pointer"
                        >
                          Trang chủ
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsExpanded(false);
                            navigate('/settings');
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 active:scale-95 text-[11px] font-semibold text-white transition-all text-center cursor-pointer"
                        >
                          Cài đặt
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* COMPACT DIGITAL CLOCK */}
          <div
            className="cursor-default flex flex-col items-center justify-center leading-none text-center select-none"
            title={`Thời gian: ${timeStr} • ${fullDateStr}`}
          >
            <span className="text-[12px] sm:text-[13px] font-bold text-white tracking-tight leading-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] font-mono">
              {timeStr}
            </span>
          </div>

          {/* CIRCULAR STATUS GAUGE (Pure White Arc + Pure White Wi-Fi Icon + Cellular Dots) */}
          <div
            className="relative group cursor-pointer"
            onMouseEnter={() => setShowStatusTooltip(true)}
            onMouseLeave={() => setShowStatusTooltip(false)}
            onClick={() => setShowStatusTooltip(!showStatusTooltip)}
            title={`Wi-Fi: Đang kết nối • Pin: ${batteryLevel}% ${isCharging ? '(Đang sạc)' : ''} • Sóng di động: Tốt (5G)`}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 relative flex items-center justify-center">
              {/* Circular Battery Arc SVG - Pure White Ring */}
              <svg
                className="w-full h-full transform"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background Track Arc - Translucent White */}
                <path
                  d="M 10 34 A 17 17 0 1 1 34 34"
                  stroke="rgba(255, 255, 255, 0.35)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />

                {/* Active Battery Fill Arc - Crisp Pure White */}
                <path
                  d="M 10 34 A 17 17 0 1 1 34 34"
                  stroke="#ffffff"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeDasharray={`${activeArcLength} ${totalArcLength}`}
                  strokeDashoffset="0"
                  className="transition-all duration-500"
                  style={{ filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.6))' }}
                />
              </svg>

              {/* Center Wi-Fi Icon & Cellular Dots - Pure White */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 pointer-events-none">
                <Wifi className="w-3.5 h-3.5 text-white stroke-[2.4] mb-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                <div className="flex items-center gap-[2px] mt-0.5">
                  <span className="w-[3px] h-[3px] rounded-full bg-white shadow-sm" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white shadow-sm" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white shadow-sm" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white shadow-sm" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/40" />
                </div>
              </div>
            </div>

            {/* Hover / Tap Tooltip */}
            {showStatusTooltip && (
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-zinc-900/95 dark:bg-black/95 text-white text-xs whitespace-nowrap shadow-xl border border-white/15 backdrop-blur-md z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                <div className="font-semibold flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Wi-Fi 6 • 5G Cực mạnh</span>
                </div>
                <div className="text-[11px] text-zinc-300 mt-0.5">
                  Pin: {batteryLevel}% {isCharging ? '(Đang sạc)' : ''}
                </div>
              </div>
            )}
          </div>

          {/* CIRCULAR BACK BUTTON (<) - Specular White Top & Bottom Rim */}
          <motion.button
            type="button"
            onClick={handleBackClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Quay lại (Back)"
            aria-label="Quay lại"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full relative bg-white/30 dark:bg-white/20 backdrop-blur-2xl shadow-xl shadow-black/25 text-white flex items-center justify-center cursor-pointer transition-all group overflow-hidden"
          >
            <svg
              className="shiny-rim-svg absolute inset-0 w-full h-full pointer-events-none rounded-full"
              viewBox="0 0 44 44"
              fill="none"
            >
              <defs>
                <linearGradient id="back-btn-rim-grad" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="25%" stopColor="#ffffff" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="75%" stopColor="#ffffff" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <circle cx="22" cy="22" r="21.3" stroke="url(#back-btn-rim-grad)" strokeWidth="1.4" />
            </svg>

            <ChevronLeft className="w-5 h-5 stroke-[2.4] group-hover:-translate-x-0.5 transition-transform text-white relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
          </motion.button>
        </div>

        {/* 3. BOTTOM FOOT CLUSTER ("Dưới tít cùng chân status bar - Search Button Only") */}
        <div className="flex flex-col items-center pointer-events-auto">
          {/* CIRCULAR SEARCH BUTTON AT BOTTOM FOOT - Morphs to Center Float Search Bar */}
          {!isSearchExpanded ? (
            <motion.button
              layoutId="vplay-floating-search-pill"
              type="button"
              onClick={() => toggleSearchExpanded()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: 320,
                damping: 28,
              }}
              title="Mở thanh tìm kiếm"
              aria-label="Tìm kiếm nhanh"
              id="status-bar-search-toggle"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full relative flex items-center justify-center cursor-pointer backdrop-blur-2xl shadow-xl shadow-black/25 bg-white/30 dark:bg-white/20 text-white overflow-hidden group"
            >
              {/* Top & Bottom white border with horizontal fade to left & right */}
              <svg
                className="shiny-rim-svg absolute inset-0 w-full h-full pointer-events-none rounded-full"
                viewBox="0 0 44 44"
                fill="none"
              >
                <defs>
                  <linearGradient id="search-btn-rim-grad" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                    <stop offset="25%" stopColor="#ffffff" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="75%" stopColor="#ffffff" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <circle cx="22" cy="22" r="21.3" stroke="url(#search-btn-rim-grad)" strokeWidth="1.4" />
              </svg>

              {/* Monochrome White Search Icon */}
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white stroke-[2.4] relative z-10 transition-transform group-hover:scale-110 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
            </motion.button>
          ) : (
            /* Subtle anchor placeholder so bottom position remains aligned during morph */
            <div
              aria-hidden="true"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm pointer-events-none"
            />
          )}
        </div>
      </aside>
    </>
  );
};

export default StatusBar;
