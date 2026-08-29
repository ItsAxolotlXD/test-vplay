import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  Tv, 
  Megaphone, 
  Box, 
  Play, 
  Home, 
  Heart, 
  Info, 
  Settings as SettingsIcon,
  Layers,
  Palette,
  Radio,
  Film,
  Bot,
  Waves,
  LayoutGrid
} from 'lucide-react';
import { CHANNELS_DATA } from '../data/channels';
import { NEWS_DATA } from '../data/news';
import { Channel } from '../types';
import { useSettings } from '../hooks/useSettings';

interface SpotlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (route: string, state?: any) => void;
  onSelectChannel: (channel: Channel) => void;
}

const CATEGORY_ITEMS = [
  { id: 'cat-home', title: 'Trang chủ (Home)', route: '/', icon: Home, color: '#E6005A' },
  { id: 'cat-livetv', title: 'Truyền hình trực tiếp (Live TV)', route: '/live-tv', icon: Tv, color: '#E6005A' },
  { id: 'cat-news', title: 'Tin tức & Thông báo (News)', route: '/news', icon: Megaphone, color: '#FF4D8B' },
  { id: 'cat-copilot', title: 'AI Copilot Assistant', route: '/copilot', icon: Bot, color: '#0EA5E9' },
  { id: 'cat-vspace', title: 'Kho ứng dụng V-Space', route: '/v-space', icon: LayoutGrid, color: '#8B5CF6' },
  { id: 'cat-waves-premium', title: 'Waves Premium & V-Cloud', route: '/v-premium', icon: Waves, color: '#06B6D4' },
  { id: 'cat-fav', title: 'Kênh yêu thích (Favorites)', route: '/favorites', icon: Heart, color: '#E6005A' },
  { id: 'cat-toolbox', title: 'Công cụ kỹ thuật (Toolbox)', route: '/toolbox', icon: Box, color: '#38BDF8' },
  { id: 'cat-about', title: 'Giới thiệu Waves Community', route: '/about', icon: Info, color: '#E6005A' },
  { id: 'cat-settings', title: 'Cài đặt hệ thống (Settings)', route: '/settings', icon: SettingsIcon, color: '#E6005A' },
];

const TOOLBOX_ITEMS = [
  { id: 'tb-safe-area', title: 'Aspect Ratio & Safe Area', tab: 'safe-area', icon: Layers, color: '#FF6B6B' },
  { id: 'tb-color-bars', title: 'SMPTE Color Bars & Tone', tab: 'color-bars', icon: Palette, color: '#FF5555' },
  { id: 'tb-m3u', title: 'M3U Playlist Parser', tab: 'm3u-tester', icon: Radio, color: '#38BDF8' },
  { id: 'tb-timecode', title: 'Broadcast Timecode', tab: 'timecode', icon: Film, color: '#FBBF24' },
];

const SETTINGS_SHORTCUTS = [
  { id: 'set-ui', title: 'Cài đặt: Dock sang Sidebar / Giao diện', keyword: 'dock sidebar giao diện' },
  { id: 'set-font', title: 'Cài đặt: Tỷ lệ cỡ chữ ứng dụng', keyword: 'cỡ chữ font chữ zoom tỷ lệ' },
  { id: 'set-banner', title: 'Cài đặt: Tự động trượt banner', keyword: 'banner trượt auto scroll' },
  { id: 'set-autohide', title: 'Cài đặt: Tự động ẩn Sidebar', keyword: 'tự động ẩn sidebar collapse' },
  { id: 'set-search', title: 'Cài đặt: Tùy chỉnh danh mục tìm kiếm', keyword: 'tìm kiếm search spotlight' },
];

export const SpotlightModal: React.FC<SpotlightModalProps> = ({
  isOpen,
  onClose,
  navigate,
  onSelectChannel
}) => {
  const { settings } = useSettings();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
      setQuery('');
    }
  }, [isOpen]);

  // Global Cmd+K / Ctrl+K keyboard shortcut & ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const rawQuery = query.trim();
  const normalizedQuery = rawQuery.toLowerCase();

  // 1. Channel matching (Live TV search & Channel number search)
  const matchedChannels = settings.searchTv ? CHANNELS_DATA.filter((ch, index) => {
    if (!normalizedQuery) return false;
    
    // Check channel number search
    if (settings.searchChannelNumber) {
      const channelIndex = String(index + 1);
      const cleanNum = normalizedQuery.replace(/[^0-9]/g, '');
      if (cleanNum && (channelIndex === cleanNum || ch.slug.includes(cleanNum) || ch.id === cleanNum)) {
        return true;
      }
    }

    return (
      ch.name.toLowerCase().includes(normalizedQuery) ||
      ch.shortName?.toLowerCase().includes(normalizedQuery) ||
      ch.category.toLowerCase().includes(normalizedQuery) ||
      ch.tags?.some((t) => t.toLowerCase().includes(normalizedQuery)) ||
      ch.currentProgram?.title.toLowerCase().includes(normalizedQuery)
    );
  }) : [];

  // 2. Category matching
  const matchedCategories = settings.searchCategories ? CATEGORY_ITEMS.filter((item) => 
    normalizedQuery && item.title.toLowerCase().includes(normalizedQuery)
  ) : [];

  // 3. News matching
  const matchedNews = settings.searchNews ? NEWS_DATA.filter((n) =>
    normalizedQuery && (
      n.title.toLowerCase().includes(normalizedQuery) ||
      n.category.toLowerCase().includes(normalizedQuery) ||
      n.tags?.some((t) => t.toLowerCase().includes(normalizedQuery))
    )
  ) : [];

  // 4. Toolbox matching
  const matchedToolbox = settings.searchToolbox ? TOOLBOX_ITEMS.filter((tb) =>
    normalizedQuery && tb.title.toLowerCase().includes(normalizedQuery)
  ) : [];

  // 5. Settings shortcuts matching
  const matchedSettings = settings.searchSettings ? SETTINGS_SHORTCUTS.filter((s) =>
    normalizedQuery && (s.title.toLowerCase().includes(normalizedQuery) || s.keyword.toLowerCase().includes(normalizedQuery))
  ) : [];

  const hasAnyResults = matchedChannels.length > 0 || 
    matchedCategories.length > 0 || 
    matchedNews.length > 0 || 
    matchedToolbox.length > 0 || 
    matchedSettings.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="spotlight-container"
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 md:pt-24 px-4"
        >
          {/* 1. Backdrop */}
          <motion.div 
            id="spotlight-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* 2. Dialog Modal Box */}
          <motion.div 
            id="spotlight-popup-card"
            initial={{ opacity: 0, scale: 1.10 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: {
                duration: 0.38,
                ease: [0.16, 1, 0.3, 1]
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 1.08,
              transition: {
                duration: 0.25,
                ease: [0.25, 0.1, 0.25, 1]
              }
            }}
            className="relative w-full max-w-[380px] sm:max-w-[440px] bg-[#1A1A20] rounded-[28px] p-4 sm:p-5 shadow-2xl overflow-hidden z-10"
          >
            {/* Capsule Pill Search Input Bar */}
            <div className="w-full h-[46px] flex items-center justify-between px-4 rounded-full spotlight-bubble-box text-sm transition-all spotlight-input-container">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-[18px] h-[18px] min-w-[18px] min-h-[18px] max-w-[18px] max-h-[18px] flex items-center justify-center shrink-0">
                  <img
                    src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest?cb=20260717131751"
                    alt="Search"
                    referrerPolicy="no-referrer"
                    className="w-full h-full aspect-square object-contain brightness-0 invert opacity-80"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Spotlight Search..."
                  className="w-full bg-transparent text-white placeholder-[#8E8E93] text-sm focus:outline-none font-medium truncate"
                />
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {query ? (
                  <button 
                    onClick={() => setQuery('')}
                    className="p-1 rounded-full text-[#8E8E93] hover:text-white transition-colors cursor-pointer"
                    title="Xóa tìm kiếm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-4 h-4 min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px] flex items-center justify-center shrink-0">
                    <img
                      src="https://github.com/andrewtavis/sf-symbols-online/raw/master/glyphs/mic.png"
                      alt="Mic"
                      referrerPolicy="no-referrer"
                      className="w-full h-full aspect-square object-contain brightness-0 invert opacity-80"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Content Area */}
            {!query ? (
              <div className="py-7 sm:py-9 px-3 text-center">
                <p className="text-[13px] sm:text-sm text-[#8E8E93] leading-relaxed font-normal select-none max-w-[290px] mx-auto">
                  Nhập từ khóa hoặc số kênh để tìm kiếm trong Waves Community
                </p>
              </div>
            ) : (
              <div className="mt-3 max-h-[320px] overflow-y-auto space-y-2 pr-1 sidebar-scroller">
                {/* 1. Channels */}
                {matchedChannels.length > 0 && (
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#E6005A] flex items-center gap-1.5">
                      <Tv className="w-3 h-3" />
                      <span>Kênh truyền hình ({matchedChannels.length})</span>
                    </div>
                    {matchedChannels.slice(0, 5).map((ch) => (
                      <div
                        key={ch.id}
                        onClick={() => {
                          onSelectChannel(ch);
                          navigate(`/live-tv?channel=${ch.slug}`);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-[14px] bg-[#22222A] hover:bg-[#2C2C36] cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#141418] border border-[#34343E] flex items-center justify-center text-xs font-bold text-white shrink-0 p-1 overflow-hidden">
                            <img
                              src={ch.logo}
                              alt={ch.name}
                              referrerPolicy="no-referrer"
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white group-hover:text-[#E6005A] truncate">
                              {ch.name}
                            </div>
                            <div className="text-[10px] text-[#9CA3AF] truncate">
                              {ch.currentProgram?.title || ch.category}
                            </div>
                          </div>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-[#2F2F3A] group-hover:bg-[#E6005A] flex items-center justify-center text-white shrink-0 transition-colors">
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. Categories / Navigation */}
                {matchedCategories.length > 0 && (
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] flex items-center gap-1.5">
                      <Box className="w-3 h-3" />
                      <span>Danh mục ({matchedCategories.length})</span>
                    </div>
                    {matchedCategories.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            navigate(item.route);
                            onClose();
                          }}
                          className="flex items-center gap-2.5 p-2 rounded-[14px] bg-[#22222A] hover:bg-[#2C2C36] cursor-pointer transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#2E2E38] flex items-center justify-center shrink-0">
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs font-medium text-white truncate">{item.title}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 3. News */}
                {matchedNews.length > 0 && (
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FF4D4D] flex items-center gap-1.5">
                      <Megaphone className="w-3 h-3" />
                      <span>Tin tức ({matchedNews.length})</span>
                    </div>
                    {matchedNews.slice(0, 3).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          navigate(`/news/${n.slug}`);
                          onClose();
                        }}
                        className="flex items-center gap-2.5 p-2 rounded-[14px] bg-[#22222A] hover:bg-[#2C2C36] cursor-pointer transition-colors"
                      >
                        <div className="w-10 h-7 rounded bg-[#141418] overflow-hidden shrink-0">
                          <img src={n.coverImage} alt={n.title} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs text-white line-clamp-1 flex-1">{n.title}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. Toolbox */}
                {matchedToolbox.length > 0 && (
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FBBF24] flex items-center gap-1.5">
                      <Layers className="w-3 h-3" />
                      <span>Toolbox ({matchedToolbox.length})</span>
                    </div>
                    {matchedToolbox.map((tb) => {
                      const IconComponent = tb.icon;
                      return (
                        <div
                          key={tb.id}
                          onClick={() => {
                            navigate('/toolbox', { tab: tb.tab });
                            onClose();
                          }}
                          className="flex items-center gap-2.5 p-2 rounded-[14px] bg-[#22222A] hover:bg-[#2C2C36] cursor-pointer transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#2E2E38] flex items-center justify-center shrink-0">
                            <IconComponent className="w-4 h-4 text-[#FBBF24]" />
                          </div>
                          <span className="text-xs font-medium text-white truncate">{tb.title}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 5. Settings Shortcuts */}
                {matchedSettings.length > 0 && (
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FF4D4D] flex items-center gap-1.5">
                      <SettingsIcon className="w-3 h-3" />
                      <span>Cài đặt ({matchedSettings.length})</span>
                    </div>
                    {matchedSettings.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => {
                          navigate('/settings');
                          onClose();
                        }}
                        className="flex items-center gap-2.5 p-2 rounded-[14px] bg-[#22222A] hover:bg-[#2C2C36] cursor-pointer transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#2E2E38] flex items-center justify-center shrink-0">
                          <SettingsIcon className="w-4 h-4 text-[#FF4D4D]" />
                        </div>
                        <span className="text-xs font-medium text-white truncate">{st.title}</span>
                      </div>
                    ))}
                  </div>
                )}

                {!hasAnyResults && (
                  <div className="py-6 text-center text-xs text-[#8E8E93]">
                    Không tìm thấy kết quả phù hợp với "<span className="text-white font-medium">{query}</span>"
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
