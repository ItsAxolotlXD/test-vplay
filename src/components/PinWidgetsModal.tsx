import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Pin, MoreHorizontal, ChevronDown, Check } from 'lucide-react';
import { playPopSound } from '../utils/sound';
import { showIslandNotification } from '../utils/islandNotifications';

export interface PinWidgetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  visibleWidgets: Record<string, boolean>;
  onToggleWidget: (key: string) => void;
  onOpenStore?: () => void;
}

export type WidgetCategoryKey =
  | 'entertainment'
  | 'esports'
  | 'family'
  | 'finance'
  | 'm365'
  | 'outlook'
  | 'onedrive'
  | 'sports'
  | 'spotify'
  | 'tips'
  | 'traffic'
  | 'todo';

interface WidgetDef {
  key: WidgetCategoryKey;
  label: string;
  category: string;
  icon: React.ReactNode;
}

export const PinWidgetsModal: React.FC<PinWidgetsModalProps> = ({
  isOpen,
  onClose,
  visibleWidgets,
  onToggleWidget,
  onOpenStore,
}) => {
  const [selectedWidgetKey, setSelectedWidgetKey] = useState<WidgetCategoryKey>('outlook');

  if (!isOpen) return null;

  const widgetDefinitions: WidgetDef[] = [
    {
      key: 'entertainment',
      label: 'Entertainment',
      category: 'Shows & Streaming',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="2" y="5" width="20" height="15" rx="3" fill="#0078D4" />
          <path d="M2 9.5H22" stroke="white" strokeWidth="1.5" />
          <path d="M5.5 5L4 9.5M10.5 5L9 9.5M15.5 5L14 9.5M20.5 5L19 9.5" stroke="white" strokeWidth="1.2" />
          <polygon points="10,12 16,15 10,18" fill="white" />
        </svg>
      ),
    },
    {
      key: 'esports',
      label: 'Esports',
      category: 'Tournaments & Matches',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="3" y="6" width="18" height="12" rx="6" fill="#7C3AED" />
          <path d="M7 12H11M9 10V14" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="15.5" cy="10.5" r="1.2" fill="white" />
          <circle cx="17.5" cy="12.5" r="1.2" fill="white" />
        </svg>
      ),
    },
    {
      key: 'family',
      label: 'Family',
      category: 'Safety & Screentime',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="#008272"
          />
          <path
            d="M9 11.5c.8 0 1.5-.7 1.5-1.5S9.8 8.5 9 8.5s-1.5.7-1.5 1.5.7 1.5 1.5 1.5zm6 0c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5z"
            fill="white"
          />
        </svg>
      ),
    },
    {
      key: 'finance',
      label: 'Finance',
      category: 'Markets & Watchlist',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="2" y="3" width="20" height="18" rx="3" fill="#107C41" />
          <path
            d="M5 15L9 11L13 14L19 8M19 8H15M19 8V12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: 'm365',
      label: 'M365',
      category: 'Microsoft 365 Feed',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="3" y="3" width="8" height="8" rx="2" fill="#0078D4" />
          <rect x="13" y="3" width="8" height="8" rx="2" fill="#00A4EF" />
          <rect x="3" y="13" width="8" height="8" rx="2" fill="#2886DE" />
          <rect x="13" y="13" width="8" height="8" rx="2" fill="#005A9E" />
        </svg>
      ),
    },
    {
      key: 'outlook',
      label: 'Outlook',
      category: 'Calendar',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="3" y="4" width="18" height="17" rx="3" fill="#0078D4" />
          <rect x="3" y="4" width="18" height="5" fill="#005A9E" rx="1" />
          <circle cx="7.5" cy="12.5" r="1.3" fill="white" />
          <circle cx="12" cy="12.5" r="1.3" fill="white" />
          <circle cx="16.5" cy="12.5" r="1.3" fill="white" />
          <circle cx="7.5" cy="16.5" r="1.3" fill="white" />
          <circle cx="12" cy="16.5" r="1.3" fill="white" />
          <circle cx="16.5" cy="16.5" r="1.3" fill="white" />
          <path d="M7 2.5V5M17 2.5V5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      key: 'onedrive',
      label: 'OneDrive',
      category: 'Memories & Photos',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <path
            d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
            fill="#0284C7"
          />
          <path
            d="M12 7c2.76 0 5.06 1.95 5.56 4.54.45-.04.91-.04 1.44.04 1.83.27 3 1.82 3 3.42 0 1.93-1.57 3.5-3.5 3.5H6.5C4.01 18.5 2 16.49 2 14c0-2.3 1.72-4.18 3.97-4.46C6.91 7.24 9.24 7 12 7z"
            fill="#38BDF8"
          />
        </svg>
      ),
    },
    {
      key: 'sports',
      label: 'Sports',
      category: 'Scores & Standings',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <path
            d="M6 3H18V6C18 9.31 15.31 12 12 12C8.69 12 6 9.31 6 6V3Z"
            fill="#F59E0B"
            stroke="#D97706"
            strokeWidth="1.5"
          />
          <path d="M12 12V17M8 21H16M9 17H15" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 5H3C3 7.5 4.5 9 6 9.5" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M18 5H21C21 7.5 19.5 9 18 9.5" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      key: 'spotify',
      label: 'Spotify',
      category: 'Music & Podcasts',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <circle cx="12" cy="12" r="10" fill="#1DB954" />
          <path
            d="M7 9C10.5 7.8 14.8 8.1 17.5 9.7M8 12.2C10.9 11.2 14.4 11.5 16.8 12.8M8.5 15.3C10.8 14.5 13.7 14.8 15.7 15.8"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      key: 'tips',
      label: 'Tips',
      category: 'Windows & Features',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <circle cx="12" cy="12" r="10" fill="#0078D4" />
          <path
            d="M12 6.5V11.5M12 15.5H12.01"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M8.5 8.5C9.5 7.5 10.7 7 12 7c2.2 0 4 1.8 4 4 0 1.5-.8 2.8-2 3.5v1"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      key: 'traffic',
      label: 'Traffic',
      category: 'Commute & Navigation',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="7" y="2" width="10" height="20" rx="5" fill="#2E2E38" stroke="#4B4B58" strokeWidth="1" />
          <circle cx="12" cy="6.5" r="2.2" fill="#EF4444" />
          <circle cx="12" cy="12" r="2.2" fill="#F59E0B" />
          <circle cx="12" cy="17.5" r="2.2" fill="#10B981" />
        </svg>
      ),
    },
    {
      key: 'todo',
      label: 'To Do',
      category: 'Tasks & Reminders',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="4" fill="#0078D4" />
          <path
            d="M7 12.5L10.5 16L17 8.5"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  const currentDef = widgetDefinitions.find((w) => w.key === selectedWidgetKey) || widgetDefinitions[5];
  const isPinned = Boolean(visibleWidgets[selectedWidgetKey]);

  const handleTogglePin = () => {
    playPopSound();
    onToggleWidget(selectedWidgetKey);
    const nextState = !isPinned;
    showIslandNotification({
      title: nextState ? 'Đã ghim tiện ích' : 'Đã bỏ ghim tiện ích',
      message: `${currentDef.label} (${currentDef.category})`,
      icon: 'check',
      duration: 2500,
    });
  };

  return (
    <div className="fixed inset-0 z-[100080] flex items-center justify-center p-3 sm:p-5 bg-black/45 backdrop-blur-xs select-none">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 10 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[760px] h-[580px] sm:h-[600px] max-h-[92vh] bg-white dark:bg-[#1C1C1C] rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,0.35)] border border-black/10 dark:border-white/10 flex overflow-hidden relative"
      >
        {/* Top-Right Window Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition-colors cursor-pointer"
          title="Đóng cửa sổ"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. LEFT SIDEBAR: PIN WIDGETS LIST */}
        <div className="w-[195px] sm:w-[220px] bg-[#F9F9F9] dark:bg-[#202020] border-r border-[#E5E5E5] dark:border-white/10 shrink-0 flex flex-col justify-between overflow-hidden">
          {/* Top Title & Scrollable List */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-4 pt-3.5 pb-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 tracking-tight">
              Pin widgets
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar py-1 space-y-0.5">
              {widgetDefinitions.map((item) => {
                const isSelected = selectedWidgetKey === item.key;
                return (
                  <div
                    key={item.key}
                    onClick={() => {
                      playPopSound();
                      setSelectedWidgetKey(item.key);
                    }}
                    className={`relative mx-2 px-3 py-1.5 rounded-md flex items-center gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#EAEAEA] dark:bg-white/10 text-zinc-900 dark:text-white font-medium'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {/* Active Accent Bar on Left Edge */}
                    {isSelected && (
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-[3.5px] bg-[#0078D4] rounded-full" />
                    )}

                    <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                      {item.icon}
                    </div>

                    <span className="text-xs sm:text-[13px] truncate">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Action: Find more widgets */}
          <div className="p-2 border-t border-[#E5E5E5] dark:border-white/10">
            <button
              onClick={() => {
                playPopSound();
                if (onOpenStore) {
                  onOpenStore();
                } else {
                  showIslandNotification({
                    title: 'Microsoft Store',
                    message: 'Khám phá thêm tiện ích cộng đồng Vplay & Windows 11',
                    icon: 'info',
                  });
                }
              }}
              className="w-full px-3 py-2 rounded-md flex items-center gap-3 text-xs sm:text-[13px] text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-left"
            >
              {/* Microsoft Store Shopping Bag with 4 Color Squares */}
              <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none">
                  <path
                    d="M6 6H18V20C18 20.55 17.55 21 17 21H7C6.45 21 6 20.55 6 20V6Z"
                    fill="#0078D4"
                  />
                  <path
                    d="M9 6V4.5C9 3.67 9.67 3 10.5 3H13.5C14.33 3 15 3.67 15 4.5V6"
                    stroke="#005A9E"
                    strokeWidth="1.5"
                  />
                  <rect x="8.5" y="9.5" width="3" height="3" fill="#F25022" />
                  <rect x="12.5" y="9.5" width="3" height="3" fill="#7FBA00" />
                  <rect x="8.5" y="13.5" width="3" height="3" fill="#00A4EF" />
                  <rect x="12.5" y="13.5" width="3" height="3" fill="#FFB900" />
                </svg>
              </div>
              <span className="truncate">Find more widgets</span>
            </button>
          </div>
        </div>

        {/* 2. RIGHT CONTENT: PREVIEW & PIN ACTION */}
        <div className="flex-1 bg-white dark:bg-[#1A1A1A] flex flex-col justify-between p-6 sm:p-8 overflow-y-auto no-scrollbar relative">
          {/* Top Title & Subtitle */}
          <div className="pt-2 text-center">
            <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight text-zinc-900 dark:text-white">
              {currentDef.label}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              {currentDef.category}
            </p>
          </div>

          {/* Centered Widget Preview Card */}
          <div className="my-auto py-2 flex items-center justify-center">
            <div className="w-full max-w-[340px] sm:max-w-[360px] bg-[#EAF4FB] dark:bg-[#152332] rounded-2xl p-3.5 border border-[#D5E7F6] dark:border-blue-900/30 shadow-[0_8px_24px_rgba(0,120,212,0.08)] space-y-2.5">
              {/* PREVIEW: OUTLOOK (Exactly matching the screenshot) */}
              {selectedWidgetKey === 'outlook' && (
                <>
                  {/* Top Bar of the Outlook Card */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                        <rect x="3" y="4" width="18" height="17" rx="3" fill="#0078D4" />
                        <rect x="3" y="4" width="18" height="5" fill="#005A9E" rx="1" />
                        <circle cx="7.5" cy="12.5" r="1.2" fill="white" />
                        <circle cx="12" cy="12.5" r="1.2" fill="white" />
                        <circle cx="16.5" cy="12.5" r="1.2" fill="white" />
                        <circle cx="7.5" cy="16.5" r="1.2" fill="white" />
                        <circle cx="12" cy="16.5" r="1.2" fill="white" />
                        <circle cx="16.5" cy="16.5" r="1.2" fill="white" />
                      </svg>
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                        Calendar
                      </span>
                    </div>

                    <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Date Subheader Row */}
                  <div className="flex items-center justify-between px-1 pt-0.5">
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      April
                    </span>

                    <div className="flex items-center gap-1.5">
                      <div className="w-5.5 h-5.5 rounded-full bg-[#0078D4] text-white flex items-center justify-center font-bold text-[11px] shadow-xs">
                        7
                      </div>
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium px-0.5">
                        8
                      </span>
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium px-0.5">
                        9
                      </span>
                      <ChevronDown className="w-3 h-3 text-zinc-400 ml-0.5" />
                    </div>
                  </div>

                  {/* 3 Event Rows as shown in the uploaded screenshot */}
                  <div className="space-y-1.5 pt-1">
                    {/* Event 1: Birthday */}
                    <div className="bg-white dark:bg-zinc-800/90 rounded-xl p-2.5 flex items-center gap-3 border border-black/[0.04] dark:border-white/[0.05] shadow-xs">
                      <div className="w-1 h-7 rounded-full bg-[#E3008C] shrink-0" />
                      <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 w-14 shrink-0">
                        All day
                      </div>
                      <div className="text-xs font-medium text-zinc-800 dark:text-zinc-100 truncate">
                        Angela's Birthday 🎂
                      </div>
                    </div>

                    {/* Event 2: Presentation with grip dots */}
                    <div className="bg-white dark:bg-zinc-800/90 rounded-xl p-2.5 flex items-center justify-between border border-black/[0.04] dark:border-white/[0.05] shadow-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-1 h-8 rounded-full bg-[#0078D4] shrink-0" />
                        <div className="w-14 shrink-0">
                          <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-100">
                            8:30 AM
                          </div>
                          <div className="text-[10px] text-zinc-400">30 min</div>
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-100 truncate">
                            Presentation
                          </div>
                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                            Alex Johnson
                          </div>
                        </div>
                      </div>

                      {/* 4 small dots vertical indicator */}
                      <div className="flex flex-col gap-0.5 pr-1">
                        <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                        <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                        <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                        <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                      </div>
                    </div>

                    {/* Event 3: Lunch Sync */}
                    <div className="bg-white dark:bg-zinc-800/90 rounded-xl p-2.5 flex items-center gap-3 border border-black/[0.04] dark:border-white/[0.05] shadow-xs">
                      <div className="w-1 h-7 rounded-full bg-[#0078D4] shrink-0" />
                      <div className="w-14 shrink-0">
                        <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-100">
                          12:30 AM
                        </div>
                        <div className="text-[10px] text-zinc-400">1h</div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-100 truncate">
                          Lunch Sync
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                          Teams Meeting
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* PREVIEW: ENTERTAINMENT */}
              {selectedWidgetKey === 'entertainment' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                      Vplay Live Broadcast
                    </span>
                    <span className="text-[10px] font-bold text-red-500 uppercase">Live</span>
                  </div>
                  <div className="bg-zinc-900 rounded-xl h-28 relative overflow-hidden flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&q=80"
                      alt="Entertainment"
                      className="w-full h-full object-cover opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                      <div className="text-white text-xs font-bold">VTV1 HD • Thời sự 19h</div>
                    </div>
                  </div>
                </div>
              )}

              {/* PREVIEW: ESPORTS */}
              {selectedWidgetKey === 'esports' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                      Chung Kết VCSA 2026
                    </span>
                    <span className="text-[10px] font-bold text-purple-500">LIVE MATCH</span>
                  </div>
                  <div className="bg-white dark:bg-zinc-800/90 rounded-xl p-3 flex items-center justify-between shadow-xs">
                    <div className="text-center font-bold text-xs">GAM Esports</div>
                    <div className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-400 font-extrabold text-xs">
                      2 - 1
                    </div>
                    <div className="text-center font-bold text-xs">Team Secret</div>
                  </div>
                </div>
              )}

              {/* PREVIEW: FAMILY */}
              {selectedWidgetKey === 'family' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                      Family Safety
                    </span>
                    <span className="text-[10px] text-emerald-500 font-semibold">Active</span>
                  </div>
                  <div className="bg-white dark:bg-zinc-800/90 rounded-xl p-3 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">Thời gian màn hình hôm nay</span>
                      <span className="font-bold text-teal-500">2h 15m</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-full w-[45%]" />
                    </div>
                  </div>
                </div>
              )}

              {/* PREVIEW: FINANCE */}
              {selectedWidgetKey === 'finance' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                      VN-Index & Thị trường
                    </span>
                    <span className="text-[10px] text-emerald-500 font-bold">+1.15%</span>
                  </div>
                  <div className="bg-white dark:bg-zinc-800/90 rounded-xl p-3 flex items-baseline justify-between shadow-xs">
                    <div>
                      <div className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                        1,288.45
                      </div>
                      <div className="text-[10px] text-zinc-400">Hose • Hanoi • Orbs</div>
                    </div>
                    <div className="text-emerald-500 font-bold text-xs bg-emerald-500/10 px-2 py-1 rounded-md">
                      +14.62
                    </div>
                  </div>
                </div>
              )}

              {/* PREVIEW: M365 */}
              {selectedWidgetKey === 'm365' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                      Recent Files
                    </span>
                    <span className="text-[10px] text-blue-500 font-medium">OneDrive</span>
                  </div>
                  <div className="bg-white dark:bg-zinc-800/90 rounded-xl p-2.5 flex items-center gap-2.5 shadow-xs">
                    <div className="w-7 h-7 rounded bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      W
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">Báo_Cáo_Vplay_2026.docx</div>
                      <div className="text-[10px] text-zinc-400">Đã chỉnh sửa 10 phút trước</div>
                    </div>
                  </div>
                </div>
              )}

              {/* PREVIEW: ONEDRIVE */}
              {selectedWidgetKey === 'onedrive' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                      Kỷ niệm hôm nay
                    </span>
                    <span className="text-[10px] text-sky-500 font-medium">1 năm trước</span>
                  </div>
                  <div className="rounded-xl h-28 overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80"
                      alt="Memories"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* PREVIEW: SPORTS */}
              {selectedWidgetKey === 'sports' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                      Premier League
                    </span>
                    <span className="text-[10px] text-amber-500 font-bold">78'</span>
                  </div>
                  <div className="bg-white dark:bg-zinc-800/90 rounded-xl p-3 flex items-center justify-between shadow-xs">
                    <div className="text-xs font-bold">Arsenal</div>
                    <div className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700 font-bold text-xs">
                      2 - 1
                    </div>
                    <div className="text-xs font-bold">Chelsea</div>
                  </div>
                </div>
              )}

              {/* PREVIEW: SPOTIFY */}
              {selectedWidgetKey === 'spotify' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                      Now Playing
                    </span>
                    <span className="text-[10px] text-[#1DB954] font-bold">Spotify</span>
                  </div>
                  <div className="bg-white dark:bg-zinc-800/90 rounded-xl p-2.5 flex items-center gap-3 shadow-xs">
                    <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                      🎵
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate">Ký Ức Mưa Đêm</div>
                      <div className="text-[10px] text-zinc-400 truncate">Lofi Chill • Vplay Audio</div>
                    </div>
                  </div>
                </div>
              )}

              {/* PREVIEW: TIPS */}
              {selectedWidgetKey === 'tips' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                      Mẹo Windows 11
                    </span>
                  </div>
                  <div className="bg-white dark:bg-zinc-800/90 rounded-xl p-3 shadow-xs text-xs space-y-1">
                    <div className="font-bold text-zinc-900 dark:text-white">
                      Nhấn Win + W để mở Widgets
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      Xem tin tức và kiểm tra thời tiết trong chớp mắt mà không làm gián đoạn công việc.
                    </div>
                  </div>
                </div>
              )}

              {/* PREVIEW: TRAFFIC */}
              {selectedWidgetKey === 'traffic' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                      Giao thông tuyến đường
                    </span>
                    <span className="text-[10px] text-emerald-500 font-bold">Thông thoáng</span>
                  </div>
                  <div className="bg-white dark:bg-zinc-800/90 rounded-xl p-3 shadow-xs flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold">Về Nhà (Cầu Giấy)</div>
                      <div className="text-[10px] text-zinc-400">Qua Vành Đai 3</div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-extrabold text-emerald-500">22 phút</div>
                      <div className="text-[10px] text-zinc-400">Không có kẹt xe</div>
                    </div>
                  </div>
                </div>
              )}

              {/* PREVIEW: TO DO */}
              {selectedWidgetKey === 'todo' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                      Việc cần làm hôm nay
                    </span>
                    <span className="text-[10px] text-blue-500 font-semibold">2/4 xong</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="bg-white dark:bg-zinc-800/90 rounded-lg p-2 flex items-center gap-2 text-xs shadow-xs">
                      <div className="w-3.5 h-3.5 rounded bg-blue-500 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </div>
                      <span className="line-through text-zinc-400">Theo dõi Thời sự 19h</span>
                    </div>
                    <div className="bg-white dark:bg-zinc-800/90 rounded-lg p-2 flex items-center gap-2 text-xs shadow-xs">
                      <div className="w-3.5 h-3.5 rounded border border-zinc-300" />
                      <span>Nhận thưởng Orbs hàng ngày</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action Button: Blue Pin / Unpin Button exactly like screenshot */}
          <div className="pb-1 flex justify-center">
            <button
              onClick={handleTogglePin}
              className={`px-7 py-2 rounded-md font-medium text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                isPinned
                  ? 'bg-[#0067C0] hover:bg-[#005A9E] active:bg-[#004E8C] text-white ring-2 ring-blue-300 dark:ring-blue-800'
                  : 'bg-[#0067C0] hover:bg-[#005A9E] active:bg-[#004E8C] text-white'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 -rotate-45 ${isPinned ? 'fill-white' : ''}`} />
              <span>{isPinned ? 'Unpin' : 'Pin'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PinWidgetsModal;
