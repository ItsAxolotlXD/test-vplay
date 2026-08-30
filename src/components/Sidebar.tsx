import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Tv, 
  Megaphone, 
  Heart, 
  Box, 
  BookOpen, 
  Info, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  X,
  Radio,
  Palette,
  Film,
  Layers,
  Waves,
  LayoutGrid
} from 'lucide-react';
import { useClock } from '../hooks/useClock';
import { useFavorites } from '../hooks/useFavorites';
import { useSettings } from '../hooks/useSettings';
import { CHANNELS_DATA } from '../data/channels';
import { Channel } from '../types';
import { DiscordWelcomeModal } from './DiscordWelcomeModal';

interface SidebarProps {
  currentRoute: string;
  navigate: (route: string, state?: any) => void;
  onOpenSearch: () => void;
  selectedChannel?: Channel | null;
  onSelectChannel?: (channel: Channel) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  navigate,
  onOpenSearch,
  onSelectChannel,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const { settings } = useSettings();
  const { timeString, dateString } = useClock();
  const { favoriteChannelIds } = useFavorites();

  const [isLiveTvExpanded, setIsLiveTvExpanded] = useState(false);
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(false);
  const [isToolboxExpanded, setIsToolboxExpanded] = useState(false);
  const [isHelpExpanded, setIsHelpExpanded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const favoriteChannels = CHANNELS_DATA.filter((ch) => favoriteChannelIds.includes(ch.id));

  // Determine actual collapsed state based on settings
  const effectiveCollapsed = settings.autoHideSidebar 
    ? !isHovered 
    : isCollapsed;

  const isActive = (route: string) => {
    if (route === '/' && currentRoute === '/') return true;
    if (route !== '/' && currentRoute.startsWith(route)) return true;
    return false;
  };

  const handleNavClick = (route: string, state?: any) => {
    navigate(route, state);
    if (onCloseMobile) onCloseMobile();
  };

  const handleSpotlightClick = () => {
    onOpenSearch();
    if (onCloseMobile) onCloseMobile();
  };

  // Shared Sidebar Inner Content (used for both desktop expanded & mobile drawer)
  const renderSidebarBody = (isMobile: boolean = false) => (
    <div className="flex flex-col h-full select-none">
      {/* Top Header: Clock + Monochrome Logo + Close/Collapse Button */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3.5 pl-1.5">
          {/* Brand Logo (Dark mode logo vs Light mode logo) */}
          <div 
            onClick={() => handleNavClick('/')} 
            className="cursor-pointer flex items-center justify-center p-0 hover:opacity-85 transition-opacity"
            title="Vplay"
          >
            {!logoError ? (
              <img 
                src={settings.theme === 'light'
                  ? "https://static.wikia.nocookie.net/ep-deo/images/f/f3/Vplay_light_mode.png/revision/latest/scale-to-width-down/1000?cb=20260829062448"
                  : "https://static.wikia.nocookie.net/ep-deo/images/f/f8/Vpla.png/revision/latest/scale-to-width-down/1000?cb=20260829062528"
                } 
                alt="Vplay Logo" 
                referrerPolicy="no-referrer"
                className="h-8 max-w-[125px] w-auto object-contain shrink-0"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-white dark:text-white light:text-[#111827] font-black text-2xl tracking-tighter">V</span>
            )}
          </div>

          {/* Real-time Clock display */}
          <div className="flex flex-col">
            <div className="text-white text-base font-bold tracking-tight font-mono leading-tight">
              {timeString || '20:16:35'}
            </div>
            <div className="text-[#A1A1AA] text-[11px] font-medium leading-none mt-0.5">
              {dateString || 'Th 5, 27/08/2026'}
            </div>
          </div>
        </div>

        {/* Action Button: Close on Mobile / Collapse on Desktop */}
        {isMobile ? (
          <button 
            id="btn-mobile-sidebar-close"
            onClick={onCloseMobile}
            className="w-8 h-8 rounded-full bg-[#2F2F36] border border-[#3E3E48] flex items-center justify-center text-[#A1A1AA] hover:text-white hover:bg-[#3C3C46] transition-all cursor-pointer shadow-sm"
            title="Đóng menu"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        ) : (
          <button 
            id="btn-sidebar-collapse"
            onClick={onToggleCollapse}
            className="w-8 h-8 rounded-full bg-[#2F2F36] border border-[#3E3E48] flex items-center justify-center text-[#A1A1AA] hover:text-white hover:bg-[#3C3C46] transition-all cursor-pointer shadow-sm"
            title="Thu gọn menu"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>
        )}
      </div>

      {/* Spotlight Search Box with generous breathing room */}
      <div className="px-4 pt-2 pb-5 shrink-0">
        <button
          id={isMobile ? 'btn-mobile-spotlight-search' : 'btn-spotlight-search'}
          onClick={handleSpotlightClick}
          className="w-full h-[46px] flex items-center justify-between px-4 rounded-full spotlight-bubble-box spotlight-input-container text-left text-sm text-[#8E8E93] hover:text-white transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0 truncate">
            <div className="w-[18px] h-[18px] min-w-[18px] min-h-[18px] max-w-[18px] max-h-[18px] flex items-center justify-center shrink-0">
              <img
                src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest?cb=20260717131751"
                alt="Search"
                referrerPolicy="no-referrer"
                className="w-full h-full aspect-square object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <span className="text-sm text-[#8E8E93] group-hover:text-white font-medium truncate">Spotlight Search...</span>
          </div>
          <div className="w-4 h-4 min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px] flex items-center justify-center shrink-0 ml-1">
            <img
              src="https://github.com/andrewtavis/sf-symbols-online/raw/master/glyphs/mic.png"
              alt="Mic"
              referrerPolicy="no-referrer"
              className="w-full h-full aspect-square object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </button>
      </div>

      {/* Scrollable Navigation Menu */}
      <div className="flex-1 overflow-y-auto pb-6 text-sm font-medium sidebar-scroller no-scrollbar px-4 pt-1 space-y-2.5">
        {/* 1. Home */}
        <button
          id={isMobile ? 'mobile-nav-item-home' : 'nav-item-home'}
          onClick={() => handleNavClick('/')}
          title="Home"
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] transition-all duration-200 cursor-pointer ${
            isActive('/') && currentRoute === '/'
              ? 'bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20'
              : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
          }`}
        >
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/6/6e/New_hom.png/revision/latest?cb=20260722124341"
            alt="Home"
            referrerPolicy="no-referrer"
            className={`w-5 h-5 object-contain shrink-0 ${
              isActive('/') && currentRoute === '/' ? 'brightness-0 invert' : 'sidebar-nav-home-icon'
            }`}
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span className="truncate">Home</span>
        </button>

        {/* 2. Live TV with Accordion */}
        <div className="w-full">
          <button
            id={isMobile ? 'mobile-nav-item-live-tv' : 'nav-item-live-tv'}
            onClick={() => handleNavClick('/live-tv')}
            title="Live TV"
            className={`w-full flex items-center justify-between px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
              isActive('/live-tv')
                ? 'bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20'
                : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
            }`}
          >
            <div className="flex items-center gap-3.5 truncate">
              <Tv className="w-5 h-5 shrink-0" />
              <span className="truncate">Live TV</span>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsLiveTvExpanded(!isLiveTvExpanded);
              }}
              className="p-1 hover:text-white"
            >
              {isLiveTvExpanded ? (
                <ChevronDown className="w-4 h-4 opacity-70" />
              ) : (
                <ChevronRight className="w-4 h-4 opacity-70" />
              )}
            </div>
          </button>

          {/* Expanded Channels list */}
          {isLiveTvExpanded && (
            <div className="mt-2 ml-4 pl-3 border-l border-[#3E3E48] space-y-1">
              {CHANNELS_DATA.slice(0, 5).map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    handleNavClick(`/live-tv?channel=${ch.slug}`);
                    if (onSelectChannel) onSelectChannel(ch);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-[12px] text-xs text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35] transition-colors cursor-pointer"
                >
                  <span className="truncate">{ch.shortName || ch.name}</span>
                  <span className="px-1.5 py-0.2 text-[9px] bg-[#E6005A]/20 text-[#FF4D8B] border border-[#E6005A]/40 rounded-full font-bold">
                    HD
                  </span>
                </button>
              ))}
              <button
                onClick={() => handleNavClick('/live-tv')}
                className="w-full text-left px-3 py-1.5 text-[11px] text-[#E6005A] hover:underline font-medium cursor-pointer"
              >
                + Xem tất cả kênh
              </button>
            </div>
          )}
        </div>

        {/* 3. News */}
        <button
          id={isMobile ? 'mobile-nav-item-news' : 'nav-item-news'}
          onClick={() => handleNavClick('/news')}
          title="News"
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
            isActive('/news')
              ? 'bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20'
              : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
          }`}
        >
          <Megaphone className="w-5 h-5 shrink-0" />
          <span className="truncate">News</span>
        </button>

        {/* 4. Copilot for Vplay (AI) */}
        <button
          id={isMobile ? 'mobile-nav-item-copilot' : 'nav-item-copilot'}
          onClick={() => handleNavClick('/copilot')}
          title="Copilot for Vplay"
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
            isActive('/copilot')
              ? 'bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20'
              : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
          }`}
        >
          <img
            src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
            alt="Copilot for Vplay"
            referrerPolicy="no-referrer"
            className="w-5 h-5 object-contain shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/microsoft-copilot.svg";
            }}
          />
          <span className="truncate">Copilot for Vplay</span>
        </button>

        {/* 5. Space 360 */}
        <button
          id={isMobile ? 'mobile-nav-item-space360' : 'nav-item-space360'}
          onClick={() => handleNavClick('/v-space')}
          title="Space 360"
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
            isActive('/v-space') || isActive('/space-360') || isActive('/v-apps')
              ? 'bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20'
              : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
          }`}
        >
          <LayoutGrid className="w-5 h-5 shrink-0" />
          <span className="truncate">Space 360</span>
        </button>

        {/* 6. Waves Premium */}
        <button
          id={isMobile ? 'mobile-nav-item-waves-premium' : 'nav-item-waves-premium'}
          onClick={() => handleNavClick('/v-premium')}
          title="Waves Premium"
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
            isActive('/v-premium')
              ? 'bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20'
              : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
          }`}
        >
          <Waves className="w-5 h-5 shrink-0" />
          <span className="truncate">Waves Premium</span>
        </button>

        {/* Divider */}
        <div className="py-1 w-full">
          <hr className="border-[#34343C]" />
        </div>

        {/* 5. Favorites Accordion */}
        <div className="w-full">
          <button
            id={isMobile ? 'mobile-nav-item-favorites' : 'nav-item-favorites'}
            onClick={() => handleNavClick('/favorites')}
            title="Favorites"
            className={`w-full flex items-center justify-between px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
              isActive('/favorites')
                ? 'bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20'
                : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
            }`}
          >
            <div className="flex items-center gap-3.5 truncate">
              <Heart className="w-5 h-5 shrink-0" />
              <span className="truncate">Favorites</span>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsFavoritesExpanded(!isFavoritesExpanded);
              }}
              className="p-1 hover:text-white"
            >
              {isFavoritesExpanded ? (
                <ChevronDown className="w-4 h-4 opacity-70" />
              ) : (
                <ChevronRight className="w-4 h-4 opacity-70" />
              )}
            </div>
          </button>

          {isFavoritesExpanded && (
            <div className="mt-2 ml-4 pl-3 border-l border-[#3E3E48] space-y-1">
              {favoriteChannels.length > 0 ? (
                favoriteChannels.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      handleNavClick(`/live-tv?channel=${ch.slug}`);
                      if (onSelectChannel) onSelectChannel(ch);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-[12px] text-xs text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35] transition-colors group cursor-pointer"
                  >
                    <span className="truncate">{ch.shortName || ch.name}</span>
                    <span className="px-2 py-0.5 text-[9px] bg-[#3E3E48] text-[#E0E0E6] group-hover:bg-[#E6005A] group-hover:text-white rounded-full font-semibold transition-colors">
                      Phát
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-1.5 text-[11px] text-[#8E8E93] italic">
                  Chưa có kênh yêu thích
                </div>
              )}
            </div>
          )}
        </div>

        {/* 6. Toolbox Accordion */}
        <div className="w-full">
          <button
            id={isMobile ? 'mobile-nav-item-toolbox' : 'nav-item-toolbox'}
            onClick={() => handleNavClick('/toolbox')}
            title="Toolbox"
            className={`w-full flex items-center justify-between px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
              isActive('/toolbox')
                ? 'bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20'
                : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
            }`}
          >
            <div className="flex items-center gap-3.5 truncate">
              <Box className="w-5 h-5 shrink-0" />
              <span className="truncate">Toolbox</span>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsToolboxExpanded(!isToolboxExpanded);
              }}
              className="p-1 hover:text-white"
            >
              {isToolboxExpanded ? (
                <ChevronDown className="w-4 h-4 opacity-70" />
              ) : (
                <ChevronRight className="w-4 h-4 opacity-70" />
              )}
            </div>
          </button>

          {isToolboxExpanded && (
            <div className="mt-2 ml-4 pl-3 border-l border-[#3E3E48] space-y-1">
              <button
                onClick={() => handleNavClick('/toolbox', { tab: 'safe-area' })}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-[12px] text-xs text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35] transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-[#FF6B6B]" />
                <span className="truncate">Aspect Ratio & Safe Area</span>
              </button>
              <button
                onClick={() => handleNavClick('/toolbox', { tab: 'color-bars' })}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-[12px] text-xs text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35] transition-colors cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5 text-[#FF5555]" />
                <span className="truncate">SMPTE Color Bars & Tone</span>
              </button>
              <button
                onClick={() => handleNavClick('/toolbox', { tab: 'm3u-tester' })}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-[12px] text-xs text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35] transition-colors cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="truncate">M3U Playlist Parser</span>
              </button>
              <button
                onClick={() => handleNavClick('/toolbox', { tab: 'timecode' })}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-[12px] text-xs text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35] transition-colors cursor-pointer"
              >
                <Film className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span className="truncate">Broadcast Timecode</span>
              </button>
              <button
                onClick={() => handleNavClick('/toolbox', { tab: 'mc-container' })}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-[12px] text-xs text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35] transition-colors cursor-pointer"
              >
                <Box className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="truncate">Minecraft Container GUI</span>
              </button>
            </div>
          )}
        </div>

        {/* 7. Help (Book Icon) */}
        <div className="w-full">
          <button
            id={isMobile ? 'mobile-nav-item-help' : 'nav-item-help'}
            onClick={() => setIsHelpExpanded(!isHelpExpanded)}
            title="Help"
            className="w-full flex items-center justify-between px-4 py-3 rounded-[14px] text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3.5 truncate">
              <BookOpen className="w-5 h-5 shrink-0" />
              <span className="truncate">Help</span>
            </div>
            {isHelpExpanded ? (
              <ChevronDown className="w-4 h-4 opacity-70" />
            ) : (
              <ChevronRight className="w-4 h-4 opacity-70" />
            )}
          </button>

          {isHelpExpanded && (
            <div className="mt-2 ml-4 pl-3 border-l border-[#3E3E48] space-y-1.5 text-xs text-[#A1A1AA] p-2">
              <p>• Phím tắt: ⌘K tìm kiếm, Space tạm dừng</p>
              <p>• Báo lỗi phát sóng trực tiếp qua Discord</p>
            </div>
          )}
        </div>

        {/* 8. About */}
        <button
          id={isMobile ? 'mobile-nav-item-about' : 'nav-item-about'}
          onClick={() => handleNavClick('/about')}
          title="About"
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
            isActive('/about')
              ? 'bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20'
              : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
          }`}
        >
          <Info className="w-5 h-5 shrink-0" />
          <span className="truncate">About</span>
        </button>

        {/* 9. Join Waves on Discord (Monochrome White Icon & Modal Trigger) */}
        <button
          type="button"
          id={isMobile ? 'mobile-nav-item-discord' : 'nav-item-discord'}
          onClick={() => setIsDiscordModalOpen(true)}
          title="Join Waves on Discord"
          className="w-full flex items-center justify-between px-4 py-3 rounded-[14px] text-[#D1D5DB] hover:text-white hover:bg-white/10 border border-transparent transition-all group cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5 truncate">
            <svg className="w-5 h-5 fill-current text-white shrink-0" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.078.078 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span className="truncate text-xs font-medium">Join Waves on Discord</span>
          </div>
        </button>

        {/* 10. Settings */}
        <button
          id={isMobile ? 'mobile-nav-item-settings' : 'nav-item-settings'}
          onClick={() => handleNavClick('/settings')}
          title="Cài đặt"
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
            isActive('/settings')
              ? 'bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20'
              : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
          }`}
        >
          <Settings className="w-5 h-5 shrink-0" />
          <span className="truncate">Cài đặt</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Persistent Sidebar (Only when dockToSidebar is true or desktop) */}
      {settings.dockToSidebar && (
        <aside 
          id="waves-desktop-sidebar"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`hidden md:flex flex-col h-screen bg-[#242429] border-r border-[#34343C] select-none shrink-0 fixed top-0 left-0 z-40 overflow-hidden transition-all duration-300 ease-in-out ${
            effectiveCollapsed ? 'w-[80px]' : 'w-[290px]'
          }`}
        >
          {!effectiveCollapsed ? (
            renderSidebarBody(false)
          ) : (
            <div className="flex flex-col h-full pt-4 pb-3 items-center">
              {/* Collapsed Icon Logo */}
              <div 
                onClick={() => handleNavClick('/')} 
                className="cursor-pointer flex items-center justify-center p-0 hover:opacity-80 transition-opacity"
                title="Vplay"
              >
                {!logoError ? (
                  <img 
                    src="https://static.wikia.nocookie.net/ep-deo/images/4/4b/Vplay_no_wordmark.png/revision/latest/scale-to-width-down/1000?cb=20260829062616" 
                    alt="Vplay Logo" 
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 object-contain shrink-0"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <span className="text-white dark:text-white light:text-[#111827] font-black text-xl tracking-tighter">V</span>
                )}
              </div>

              {/* Expand sidebar button */}
              <button 
                id="btn-sidebar-expand"
                onClick={onToggleCollapse}
                className="mt-3 w-7 h-7 rounded-full bg-[#2F2F36] border border-[#3E3E48] flex items-center justify-center text-[#A1A1AA] hover:text-white hover:bg-[#3C3C46] transition-all cursor-pointer shadow-sm"
                title="Mở rộng menu"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Collapsed Search button */}
              <div className="px-2 pt-4 pb-3 flex justify-center">
                <button
                  id="btn-spotlight-search-mini"
                  onClick={handleSpotlightClick}
                  title="Spotlight Search (⌘K)"
                  className="w-11 h-11 rounded-full spotlight-bubble-box flex items-center justify-center text-[#A1A1AA] hover:text-white transition-all cursor-pointer shadow-md hover:ring-1 hover:ring-white/40"
                >
                  <div className="w-[18px] h-[18px] min-w-[18px] min-h-[18px] max-w-[18px] max-h-[18px] flex items-center justify-center shrink-0">
                    <img
                      src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest?cb=20260717131751"
                      alt="Search"
                      referrerPolicy="no-referrer"
                      className="w-full h-full aspect-square object-contain brightness-0 invert opacity-80"
                    />
                  </div>
                </button>
              </div>

              {/* Mini nav icons */}
              <div className="flex-1 overflow-y-auto pb-4 space-y-3 flex flex-col items-center no-scrollbar">
                <button
                  onClick={() => handleNavClick('/')}
                  title="Home"
                  className={`w-11 h-11 rounded-[14px] flex items-center justify-center p-0 transition-all ${
                    isActive('/') && currentRoute === '/' ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <img
                    src="https://static.wikia.nocookie.net/ep-deo/images/6/6e/New_hom.png/revision/latest?cb=20260722124341"
                    alt="Home"
                    referrerPolicy="no-referrer"
                    className={`w-5 h-5 object-contain shrink-0 ${
                      isActive('/') && currentRoute === '/' ? 'brightness-0 invert' : 'sidebar-nav-home-icon'
                    }`}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </button>
                <button
                  onClick={() => handleNavClick('/live-tv')}
                  title="Live TV"
                  className={`w-11 h-11 rounded-[14px] flex items-center justify-center p-0 transition-all ${
                    isActive('/live-tv') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <Tv className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleNavClick('/news')}
                  title="News"
                  className={`w-11 h-11 rounded-[14px] flex items-center justify-center p-0 transition-all ${
                    isActive('/news') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <Megaphone className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleNavClick('/copilot')}
                  title="Copilot for Vplay"
                  className={`w-11 h-11 rounded-[14px] flex items-center justify-center p-0 transition-all ${
                    isActive('/copilot') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <img
                    src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
                    alt="Copilot for Vplay"
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 object-contain shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/microsoft-copilot.svg";
                    }}
                  />
                </button>
                <button
                  onClick={() => handleNavClick('/v-space')}
                  title="Space 360"
                  className={`w-11 h-11 rounded-[14px] flex items-center justify-center p-0 transition-all ${
                    isActive('/v-space') || isActive('/space-360') || isActive('/v-apps') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleNavClick('/v-premium')}
                  title="Waves Premium"
                  className={`w-11 h-11 rounded-[14px] flex items-center justify-center p-0 transition-all ${
                    isActive('/v-premium') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <Waves className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleNavClick('/favorites')}
                  title="Favorites"
                  className={`w-11 h-11 rounded-[14px] flex items-center justify-center p-0 transition-all ${
                    isActive('/favorites') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleNavClick('/toolbox')}
                  title="Toolbox"
                  className={`w-11 h-11 rounded-[14px] flex items-center justify-center p-0 transition-all ${
                    isActive('/toolbox') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <Box className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleNavClick('/about')}
                  title="About"
                  className={`w-11 h-11 rounded-[14px] flex items-center justify-center p-0 transition-all ${
                    isActive('/about') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <Info className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleNavClick('/settings')}
                  title="Cài đặt"
                  className={`w-11 h-11 rounded-[14px] flex items-center justify-center p-0 transition-all ${
                    isActive('/settings') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </aside>
      )}

      {/* 2. Mobile Responsive Drawer Sidebar with Smooth Slide-in & Identical Layout/Style */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop with smooth ease fade */}
            <motion.div 
              id="waves-mobile-sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={onCloseMobile}
            />

            {/* Mobile Drawer with smooth deceleration ease */}
            <motion.div
              id="waves-mobile-sidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[290px] sm:w-[320px] max-w-[85vw] h-full bg-[#242429] border-r border-[#34343C] flex flex-col shadow-2xl z-10 overflow-hidden"
            >
              {renderSidebarBody(true)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Discord Welcome Modal Dialog */}
      <DiscordWelcomeModal
        isOpen={isDiscordModalOpen}
        onClose={() => setIsDiscordModalOpen(false)}
      />
    </>
  );
};
