import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Tv, 
  Megaphone, 
  Newspaper,
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
  LayoutGrid,
  Sparkles,
  Coins,
  Users,
  Smartphone,
  RotateCw,
  RotateCcw,
  Flag,
  Gamepad2,
  Folder,
  MapPin,
  GraduationCap,
  Calculator,
  Bell,
  Clock,
  Phone,
  Globe,
  CalendarDays,
  Image as ImageIcon,
  Camera,
  Ticket,
  CloudSun,
  StickyNote,
  Armchair,
  MessageSquare,
  Music,
  ShoppingBag,
  UtensilsCrossed
} from 'lucide-react';
import { useClock } from '../hooks/useClock';
import { useFavorites } from '../hooks/useFavorites';
import { useSettings } from '../hooks/useSettings';
import { useOrbs } from '../hooks/useOrbs';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import { CHANNELS_DATA } from '../data/channels';
import { Channel } from '../types';
import { DiscordWelcomeModal } from './DiscordWelcomeModal';

interface SidebarProps {
  currentRoute: string;
  routeState?: any;
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
  routeState,
  navigate,
  onOpenSearch,
  onSelectChannel,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const { settings } = useSettings();
  const { flags } = useFeatureFlags();
  const isStatusBar = Boolean(flags.status_bar);
  const isTopBarMode = settings.navigationMode 
    ? settings.navigationMode === 'topbar' 
    : true;
  const { timeString, dateString } = useClock();
  const { favoriteChannelIds } = useFavorites();
  const { orbs, addOrbs } = useOrbs();

  const [isSpace360Expanded, setIsSpace360Expanded] = useState(true);
  const [isLiveTvExpanded, setIsLiveTvExpanded] = useState(false);
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(false);
  const [isToolboxExpanded, setIsToolboxExpanded] = useState(false);
  const [isHelpExpanded, setIsHelpExpanded] = useState(false);
  const [isMoreExpanded, setIsMoreExpanded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [claimToast, setClaimToast] = useState<string | null>(null);

  const handleClaimQuickOrbs = () => {
    const bonus = 50;
    addOrbs(bonus);
    setClaimToast(`+${bonus} Orbs! ✨`);
    setTimeout(() => setClaimToast(null), 2500);
  };

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

  const isSpace360AppActive = (appId: string) => {
    if (appId === 'v_minecraft') {
      return (
        currentRoute.startsWith('/minecraft') ||
        currentRoute.startsWith('/mc-container') ||
        routeState?.appId === 'v_minecraft'
      );
    }
    if (appId === 'v_arcade') {
      return (
        currentRoute === '/v-arcade' ||
        currentRoute === '/v-games' ||
        ((currentRoute === '/v-space' || currentRoute === '/space-360' || currentRoute === '/v-apps') &&
          (!routeState?.appId || routeState?.appId === 'v_arcade'))
      );
    }
    if (appId === 'v_xplore') {
      return (
        currentRoute === '/v-files' ||
        currentRoute === '/v-xplore' ||
        ((currentRoute === '/v-space' || currentRoute === '/space-360' || currentRoute === '/v-apps') &&
          routeState?.appId === 'v_xplore')
      );
    }
    if (appId === 'explore_vietnam') {
      return (
        currentRoute === '/explore-vietnam' ||
        ((currentRoute === '/v-space' || currentRoute === '/space-360' || currentRoute === '/v-apps') &&
          routeState?.appId === 'explore_vietnam')
      );
    }
    if (appId === 'v_maps') {
      return (
        currentRoute === '/v-maps' ||
        currentRoute === '/space-360-maps' ||
        currentRoute === '/maps' ||
        ((currentRoute === '/v-space' || currentRoute === '/space-360' || currentRoute === '/v-apps') &&
          routeState?.appId === 'v_maps')
      );
    }
    if (appId === 'v_box') {
      return (
        currentRoute === '/v-box' ||
        ((currentRoute === '/v-space' || currentRoute === '/space-360' || currentRoute === '/v-apps') &&
          routeState?.appId === 'v_box')
      );
    }
    if (appId === 'v_learn') {
      return (
        currentRoute === '/v-study' ||
        currentRoute === '/v-learn' ||
        ((currentRoute === '/v-space' || currentRoute === '/space-360' || currentRoute === '/v-apps') &&
          routeState?.appId === 'v_learn')
      );
    }
    if (appId === 'v_calc') {
      return (
        currentRoute === '/v-calc' ||
        ((currentRoute === '/v-space' || currentRoute === '/space-360' || currentRoute === '/v-apps') &&
          routeState?.appId === 'v_calc')
      );
    }
    if (appId === 'v_clock') {
      return (
        currentRoute === '/v-clock' ||
        currentRoute === '/clock' ||
        ((currentRoute === '/v-space' || currentRoute === '/space-360' || currentRoute === '/v-apps') &&
          routeState?.appId === 'v_clock')
      );
    }
    if (appId === 'v_phone') {
      return (
        currentRoute === '/v-phone' ||
        currentRoute === '/phone' ||
        ((currentRoute === '/v-space' || currentRoute === '/space-360' || currentRoute === '/v-apps') &&
          routeState?.appId === 'v_phone')
      );
    }
    if (appId === 'v_browser') {
      return (
        currentRoute === '/v-browser' ||
        currentRoute === '/browser' ||
        ((currentRoute === '/v-space' || currentRoute === '/space-360' || currentRoute === '/v-apps') &&
          routeState?.appId === 'v_browser')
      );
    }
    if (appId === 'v_calendar') {
      return (
        currentRoute === '/v-calendar' ||
        currentRoute === '/calendar' ||
        ((currentRoute === '/v-space' || currentRoute === '/space-360' || currentRoute === '/v-apps') &&
          routeState?.appId === 'v_calendar')
      );
    }
    if (appId === 'v_gallery') {
      return (
        currentRoute === '/v-gallery' ||
        currentRoute === '/gallery' ||
        ((currentRoute === '/v-space' || currentRoute === '/space-360' || currentRoute === '/v-apps') &&
          routeState?.appId === 'v_gallery')
      );
    }
    if (appId === 'v_camera') {
      return (
        currentRoute === '/v-camera' ||
        currentRoute === '/camera' ||
        ((currentRoute === '/v-space' || currentRoute === '/space-360' || currentRoute === '/v-apps') &&
          routeState?.appId === 'v_camera')
      );
    }
    if (appId === 'v_ticket') {
      return (
        currentRoute === '/v-ticket' ||
        currentRoute === '/ticket' ||
        currentRoute === '/dat-ve' ||
        ((currentRoute === '/v-space' || currentRoute === '/space-360' || currentRoute === '/v-apps') &&
          routeState?.appId === 'v_ticket')
      );
    }
    if (appId === 'v_weather') {
      return (
        currentRoute === '/v-weather' ||
        currentRoute === '/weather' ||
        currentRoute === '/thoi-tiet' ||
        ((currentRoute === '/v-space' || currentRoute === '/space-360' || currentRoute === '/v-apps') &&
          routeState?.appId === 'v_weather')
      );
    }
    if (appId === 'v_reminders') {
      return (
        currentRoute === '/v-reminders' ||
        ((currentRoute === '/v-space' || currentRoute === '/space-360' || currentRoute === '/v-apps') &&
          routeState?.appId === 'v_reminders')
      );
    }
    if (appId === 'v_notes') {
      return (
        currentRoute === '/v-notes' ||
        ((currentRoute === '/v-space' || currentRoute === '/space-360' || currentRoute === '/v-apps') &&
          routeState?.appId === 'v_notes')
      );
    }
    if (appId === 'v_furniture') {
      return (
        currentRoute === '/v-furniture' ||
        ((currentRoute === '/v-space' || currentRoute === '/space-360' || currentRoute === '/v-apps') &&
          routeState?.appId === 'v_furniture')
      );
    }
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
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('/')} 
            className="cursor-pointer flex items-center p-0 hover:opacity-85 transition-opacity"
            title="VNRT Online"
          >
            <img
              src="https://static.wikia.nocookie.net/ep-deo/images/1/1d/New_logo.png/revision/latest?cb=20260924062053"
              alt="VNRT Online"
              referrerPolicy="no-referrer"
              className="h-8 sm:h-9 w-auto max-w-[140px] object-contain shrink-0"
            />
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
      <div className="px-4 pt-2 pb-2.5 shrink-0">
        <button
          id={isMobile ? 'btn-mobile-spotlight-search' : 'btn-spotlight-search'}
          onClick={handleSpotlightClick}
          className={`w-full h-[46px] flex items-center justify-start px-4 rounded-full spotlight-bubble-box spotlight-input-container text-sm transition-all group cursor-pointer border-0 ${
            currentRoute === '/search' || currentRoute === '/spotlight'
              ? 'bg-[#282834] text-white shadow-lg shadow-cyan-500/20'
              : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          <div className="flex items-center justify-start gap-2.5 min-w-0">
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
            <span className={`text-sm font-medium truncate ${
              currentRoute === '/search' || currentRoute === '/spotlight' ? 'text-white' : 'text-[#8E8E93] group-hover:text-white'
            }`}>Search</span>
          </div>
        </button>
      </div>

      {/* Orbs Balance Counter Widget (Under Spotlight Search) */}
      <div className="px-4 pb-3 shrink-0">
        <div 
          id={isMobile ? "mobile-sidebar-orbs-widget" : "sidebar-orbs-widget"}
          onClick={() => handleNavClick('/v-premium')}
          className="group relative overflow-hidden rounded-2xl p-2.5 bg-gradient-to-br from-[#2b1b3d]/90 via-[#231e33]/90 to-[#191921]/95 border border-purple-500/30 hover:border-purple-400/60 shadow-lg shadow-purple-950/30 transition-all duration-200 cursor-pointer"
          title="Xem khoáng vật Orbs & Gói đặc quyền VIP"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-purple-500/15 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/25 transition-all" />

          <div className="flex items-center justify-between gap-2 relative z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Glowing Orb Sphere Avatar */}
              <div className="relative w-8 h-8 rounded-xl bg-purple-950/70 border border-purple-400/40 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <Coins className="w-4 h-4 text-white" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-white/60 animate-ping opacity-75" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-white" />
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300/90 font-mono truncate">
                    Orbs
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full text-[8.5px] font-extrabold bg-purple-500/25 text-purple-200 border border-purple-400/30">
                    Khoáng vật
                  </span>
                </div>
                <div className="text-[13px] font-black text-white font-mono tracking-tight flex items-baseline gap-1 truncate">
                  <span className="text-purple-100 font-extrabold tracking-normal">
                    {orbs.toLocaleString()}
                  </span>
                  <span className="text-[9.5px] font-bold text-purple-400 font-sans">ORBS</span>
                </div>
              </div>
            </div>

            {/* Quick Claim Bonus / Action Button */}
            <div className="flex items-center gap-1 shrink-0">
              {claimToast && (
                <span className="text-[10px] font-bold text-emerald-400 font-mono animate-bounce mr-0.5">
                  {claimToast}
                </span>
              )}
              <button
                id={isMobile ? "btn-mobile-claim-orbs" : "btn-claim-orbs"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClaimQuickOrbs();
                }}
                className="px-2 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-[10.5px] font-bold shadow-xs transition-all flex items-center gap-1 border border-purple-400/40 cursor-pointer"
                title="Nhận thêm +50 Orbs điểm danh"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>+50</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Navigation Menu */}
      <div className="flex-1 overflow-y-auto pb-6 text-sm font-medium sidebar-scroller no-scrollbar px-4 pt-1 space-y-1.5">
        {/* 1. Home */}
        <button
          id={isMobile ? 'mobile-nav-item-home' : 'nav-item-home'}
          onClick={() => handleNavClick('/')}
          title="Home"
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
            isActive('/') && currentRoute === '/'
              ? 'bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20'
              : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
          }`}
        >
          <Home className="w-5 h-5 shrink-0" />
          <span className="truncate">Home</span>
        </button>

        {/* 2. Truyền hình with Accordion */}
        <div className="w-full">
          <button
            id={isMobile ? 'mobile-nav-item-live-tv' : 'nav-item-live-tv'}
            onClick={() => handleNavClick('/live-tv')}
            title="Truyền hình"
            className={`w-full flex items-center justify-between px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
              isActive('/live-tv')
                ? 'bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20'
                : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
            }`}
          >
            <div className="flex items-center gap-3.5 truncate">
              <Tv className="w-5 h-5 shrink-0" />
              <span className="truncate">Truyền hình</span>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsLiveTvExpanded(!isLiveTvExpanded);
              }}
              className="p-1 hover:text-white cursor-pointer"
              title="Danh sách kênh truyền hình"
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
            <div className="mt-1.5 ml-4 pl-3 border-l border-[#3E3E48] space-y-1">
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

        {/* 3. Cổng thông tin (đổi tên từ cổng tin tức) */}
        <button
          id={isMobile ? 'mobile-nav-item-news' : 'nav-item-news'}
          onClick={() => handleNavClick('/news')}
          title="Cổng thông tin"
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
            isActive('/news') || isActive('/article')
              ? 'bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20'
              : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
          }`}
        >
          <Newspaper className="w-5 h-5 shrink-0 text-amber-400" />
          <span className="truncate">Cổng thông tin</span>
        </button>

        {/* 4. Copilot for VNRT Online */}
        <button
          id={isMobile ? 'mobile-nav-item-copilot' : 'nav-item-copilot'}
          onClick={() => handleNavClick('/copilot')}
          title="Copilot for VNRT Online"
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
            isActive('/copilot')
              ? 'bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20'
              : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
          }`}
        >
          <img
            src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
            alt="Copilot for VNRT Online"
            referrerPolicy="no-referrer"
            className="w-5 h-5 object-contain shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/microsoft-copilot.svg";
            }}
          />
          <span className="truncate">Copilot for VNRT Online</span>
        </button>

        {/* Music (Kho nhạc truyền hình) */}
        <button
          id={isMobile ? 'mobile-nav-item-music' : 'nav-item-music'}
          onClick={() => handleNavClick('/music')}
          title="Kho nhạc truyền hình VNRT Online Music"
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
            isActive('/music')
              ? 'bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20'
              : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
          }`}
        >
          <Music className="w-5 h-5 shrink-0 text-white" />
          <span className="truncate">Music (Nhạc TV)</span>
        </button>

        {/* Shop (Mua sắm tiện ích) */}
        <button
          id={isMobile ? 'mobile-nav-item-shop' : 'nav-item-shop'}
          onClick={() => handleNavClick('/v-shop')}
          title="Shop Mua sắm tiện ích"
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
            isActive('/v-shop') || isActive('/shop')
              ? 'bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20'
              : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
          }`}
        >
          <ShoppingBag className="w-5 h-5 shrink-0 text-white" />
          <span className="truncate">Shop</span>
        </button>

        {/* Divider 1 */}
        <div className="py-1">
          <div className="border-t border-white/10" />
        </div>

        {/* ================= GROUP 2 ================= */}
        {/* 5. Space 360 */}
        <div className="w-full flex flex-col gap-1">
          <button
            id={isMobile ? "mobile-nav-item-space360" : "nav-item-space360"}
            onClick={() => handleNavClick("/space-360")}
            title="Space 360"
            className={`w-full flex items-center justify-between px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
              isActive("/v-space") ||
              isActive("/space-360") ||
              isActive("/v-apps") ||
              isActive("/v-arcade") ||
              isActive("/v-games") ||
              isActive("/v-files") ||
              isActive("/explore-vietnam") ||
              isActive("/v-box") ||
              isActive("/v-study") ||
              isActive("/v-calc") ||
              isActive("/v-reminders") ||
              isActive("/v-notes") ||
              isActive("/v-furniture") ||
              isActive("/minecraft") ||
              isActive("/spatial-design") ||
              isActive("/logo-switcher") ||
              isActive("/wheel-of-fortune") ||
              isActive("/wheels-of-fortune")
                ? "bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20"
                : "text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]"
            }`}
          >
            <div className="flex items-center gap-3.5 truncate">
              <LayoutGrid className="w-5 h-5 shrink-0 text-white" />
              <span className="truncate">Space 360</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-white/10 rounded-full">
                19 Apps
              </span>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSpace360Expanded((prev) => !prev);
                }}
                className="p-1 hover:text-white cursor-pointer"
                title="Mở rộng danh sách ứng dụng Space 360"
              >
                {isSpace360Expanded ? (
                  <ChevronDown className="w-4 h-4 opacity-80" />
                ) : (
                  <ChevronRight className="w-4 h-4 opacity-80" />
                )}
              </div>
            </div>
          </button>

          {/* Space 360 Apps Accordion */}
          <AnimatePresence initial={false}>
            {isSpace360Expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18 }}
                className="pl-3 pr-0.5 py-1 flex flex-col gap-1 border-l-2 border-emerald-500/30 ml-4 overflow-hidden"
              >
                <button
                  id={isMobile ? "mobile-space360-tab-all" : "space360-tab-all"}
                  onClick={() => handleNavClick("/space-360")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[11px] text-xs transition-colors cursor-pointer ${
                    (currentRoute === "/space-360" || currentRoute === "/v-space" || currentRoute === "/v-apps") && !routeState?.appId
                      ? "bg-white/10 text-white font-bold"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
                    <span className="truncate">Tất cả Space 360</span>
                  </div>
                </button>

                <button
                  id={isMobile ? "mobile-space360-tab-arcade" : "space360-tab-arcade"}
                  onClick={() => handleNavClick("/v-arcade", { appId: "v_arcade" })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[11px] text-xs transition-colors cursor-pointer ${
                    isSpace360AppActive("v_arcade")
                      ? "bg-white/10 text-white font-bold"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Gamepad2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="truncate">Games</span>
                  </div>
                </button>

                <button
                  id={isMobile ? "mobile-space360-tab-files" : "space360-tab-files"}
                  onClick={() => handleNavClick("/v-files", { appId: "v_xplore" })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[11px] text-xs transition-colors cursor-pointer ${
                    isSpace360AppActive("v_xplore")
                      ? "bg-white/10 text-white font-bold"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Folder className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="truncate">Files</span>
                  </div>
                </button>

                <button
                  id={isMobile ? "mobile-space360-tab-vn" : "space360-tab-vn"}
                  onClick={() => handleNavClick("/explore-vietnam", { appId: "explore_vietnam" })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[11px] text-xs transition-colors cursor-pointer ${
                    isSpace360AppActive("explore_vietnam")
                      ? "bg-white/10 text-white font-bold"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="truncate">Explore Vietnam</span>
                  </div>
                </button>

                <button
                  id={isMobile ? "mobile-space360-tab-maps" : "space360-tab-maps"}
                  onClick={() => handleNavClick("/v-maps", { appId: "v_maps" })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[11px] text-xs transition-colors cursor-pointer ${
                    isSpace360AppActive("v_maps")
                      ? "bg-white/10 text-white font-bold"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="truncate">Maps</span>
                  </div>
                </button>

                <button
                  id={isMobile ? "mobile-space360-tab-clock" : "space360-tab-clock"}
                  onClick={() => handleNavClick("/v-clock", { appId: "v_clock" })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[11px] text-xs transition-colors cursor-pointer ${
                    isSpace360AppActive("v_clock")
                      ? "bg-white/10 text-white font-bold"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="truncate">Clock</span>
                  </div>
                </button>

                <button
                  id={isMobile ? "mobile-space360-tab-phone" : "space360-tab-phone"}
                  onClick={() => handleNavClick("/v-phone", { appId: "v_phone" })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[11px] text-xs transition-colors cursor-pointer ${
                    isSpace360AppActive("v_phone")
                      ? "bg-white/10 text-white font-bold"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="truncate">Phone</span>
                  </div>
                </button>

                <button
                  id={isMobile ? "mobile-space360-tab-browser" : "space360-tab-browser"}
                  onClick={() => handleNavClick("/v-browser", { appId: "v_browser" })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[11px] text-xs transition-colors cursor-pointer ${
                    isSpace360AppActive("v_browser")
                      ? "bg-white/10 text-white font-bold"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Globe className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="truncate">Browser</span>
                  </div>
                </button>

                <button
                  id={isMobile ? "mobile-space360-tab-calendar" : "space360-tab-calendar"}
                  onClick={() => handleNavClick("/v-calendar", { appId: "v_calendar" })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[11px] text-xs transition-colors cursor-pointer ${
                    isSpace360AppActive("v_calendar")
                      ? "bg-white/10 text-white font-bold"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <CalendarDays className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">Lịch Vạn Niên</span>
                  </div>
                </button>

                <button
                  id={isMobile ? "mobile-space360-tab-gallery" : "space360-tab-gallery"}
                  onClick={() => handleNavClick("/v-gallery", { appId: "v_gallery" })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[11px] text-xs transition-colors cursor-pointer ${
                    isSpace360AppActive("v_gallery")
                      ? "bg-white/10 text-white font-bold"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <ImageIcon className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="truncate">Gallery</span>
                  </div>
                </button>

                <button
                  id={isMobile ? "mobile-space360-tab-camera" : "space360-tab-camera"}
                  onClick={() => handleNavClick("/v-camera", { appId: "v_camera" })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[11px] text-xs transition-colors cursor-pointer ${
                    isSpace360AppActive("v_camera")
                      ? "bg-white/10 text-white font-bold"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Camera className="w-4 h-4 text-pink-400 shrink-0" />
                    <span className="truncate">Camera</span>
                  </div>
                </button>

                <button
                  id={isMobile ? "mobile-space360-tab-ticket" : "space360-tab-ticket"}
                  onClick={() => handleNavClick("/v-ticket", { appId: "v_ticket" })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[11px] text-xs transition-colors cursor-pointer ${
                    isSpace360AppActive("v_ticket")
                      ? "bg-white/10 text-white font-bold"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Ticket className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="truncate">Ticket</span>
                  </div>
                </button>

                <button
                  id={isMobile ? "mobile-space360-tab-weather" : "space360-tab-weather"}
                  onClick={() => handleNavClick("/v-weather", { appId: "v_weather" })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[11px] text-xs transition-colors cursor-pointer ${
                    isSpace360AppActive("v_weather")
                      ? "bg-white/10 text-white font-bold"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <CloudSun className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="truncate">Weather</span>
                  </div>
                </button>

                <button
                  id={isMobile ? "mobile-space360-tab-cookbook" : "space360-tab-cookbook"}
                  onClick={() => handleNavClick("/cookbook", { appId: "cookbook" })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[11px] text-xs transition-colors cursor-pointer ${
                    isSpace360AppActive("cookbook")
                      ? "bg-white/10 text-white font-bold"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <UtensilsCrossed className="w-4 h-4 text-orange-400 shrink-0" />
                    <span className="truncate">Cookbook</span>
                  </div>
                </button>

                <button
                  id={isMobile ? "mobile-space360-tab-minecraft" : "space360-tab-minecraft"}
                  onClick={() => handleNavClick("/minecraft")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[11px] text-xs transition-colors cursor-pointer ${
                    isSpace360AppActive("v_minecraft")
                      ? "bg-white/10 text-white font-bold"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Box className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">Minecraft</span>
                  </div>
                  <span className="px-1.5 py-0.2 text-[8.5px] font-mono font-bold bg-emerald-500/20 text-emerald-300 rounded-md">
                    MC
                  </span>
                </button>

                <button
                  id={isMobile ? "mobile-space360-tab-spatial-design" : "space360-tab-spatial-design"}
                  onClick={() => handleNavClick("/spatial-design", { appId: "spatial_visualizer" })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[11px] text-xs transition-colors cursor-pointer ${
                    isActive("/spatial-design")
                      ? "bg-white/10 text-white font-bold"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Box className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="truncate">Spatial Design Visualizer</span>
                  </div>
                  <span className="px-1.5 py-0.2 text-[8.5px] font-mono font-bold bg-sky-500/20 text-sky-300 rounded-md">
                    30px
                  </span>
                </button>

                <button
                  id={isMobile ? "mobile-space360-tab-logo-switcher" : "space360-tab-logo-switcher"}
                  onClick={() => handleNavClick("/logo-switcher", { appId: "logo_switcher" })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[11px] text-xs transition-colors cursor-pointer ${
                    isActive("/logo-switcher")
                      ? "bg-white/10 text-white font-bold"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <RotateCw className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="truncate">Logo Switcher Visualizer</span>
                  </div>
                  <span className="px-1.5 py-0.2 text-[8.5px] font-mono font-bold bg-rose-500/20 text-rose-300 rounded-md">
                    LIVE
                  </span>
                </button>

                <button
                  id={isMobile ? "mobile-space360-tab-wheel-fortune" : "space360-tab-wheel-fortune"}
                  onClick={() => handleNavClick("/wheel-of-fortune", { appId: "wheel_fortune" })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[11px] text-xs transition-colors cursor-pointer ${
                    isActive("/wheel-of-fortune") || isActive("/wheels-of-fortune")
                      ? "bg-white/10 text-white font-bold"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="truncate">Wheels of Fortune</span>
                  </div>
                  <span className="px-1.5 py-0.2 text-[8.5px] font-mono font-bold bg-amber-500/20 text-amber-300 rounded-md">
                    SPIN
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 6. V-Flow */}
        <button
          id={isMobile ? "mobile-nav-item-vflow" : "nav-item-vflow"}
          onClick={() => handleNavClick("/v-flow")}
          title="V-Flow"
          className={`w-full flex items-center justify-between px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
            isActive("/v-flow") || isActive("/vflow") || isActive("/flow")
              ? "bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20"
              : "text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]"
          }`}
        >
          <div className="flex items-center gap-3.5 truncate">
            <Radio className="w-5 h-5 shrink-0 text-rose-400" />
            <span className="truncate">V-Flow</span>
          </div>
          <span className="px-2 py-0.5 text-[9.5px] font-mono font-black bg-rose-500/20 text-rose-300 border border-rose-400/40 rounded-full">
            FEED
          </span>
        </button>

        {/* 7. V-Chat */}
        <button
          id={isMobile ? "mobile-nav-item-chat" : "nav-item-chat"}
          onClick={() => handleNavClick("/chat")}
          title="V-Chat"
          className={`w-full flex items-center justify-between px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
            isActive("/chat") || isActive("/chat-room") || isActive("/phong-chat") || isActive("/discord")
              ? "bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20"
              : "text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]"
          }`}
        >
          <div className="flex items-center gap-3.5 truncate">
            <MessageSquare className="w-5 h-5 shrink-0 text-sky-400" />
            <span className="truncate">V-Chat</span>
          </div>
          <span className="px-2 py-0.5 text-[9.5px] font-mono font-bold bg-[#E6005A]/20 text-[#FF4D8D] border border-[#E6005A]/40 rounded-full">
            VOICE
          </span>
        </button>

        {/* 8. Vertical */}
        <button
          id={isMobile ? "mobile-nav-item-vertical" : "nav-item-vertical"}
          onClick={() => handleNavClick("/vertical")}
          title="Vertical"
          className={`w-full flex items-center justify-between px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
            isActive("/vertical") || isActive("/shorts") || isActive("/vplay-vertical")
              ? "bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20"
              : "text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]"
          }`}
        >
          <div className="flex items-center gap-3.5 truncate">
            <Smartphone className="w-5 h-5 shrink-0 text-amber-400" />
            <span className="truncate">Vertical</span>
          </div>
          <span className="px-1.5 py-0.2 text-[8.5px] font-mono font-black bg-gradient-to-r from-rose-500/20 to-orange-500/20 text-rose-300 border border-rose-400/40 rounded-full">
            SHORTS
          </span>
        </button>

        {/* ================= DIVIDER 2 ================= */}
        <div className="py-1">
          <div className="border-t border-white/10" />
        </div>

        {/* ================= GROUP 3 ================= */}
        {/* 9. Premium */}
        <button
          id={isMobile ? "mobile-nav-item-premium" : "nav-item-premium"}
          onClick={() => handleNavClick("/v-premium")}
          title="Premium"
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
            isActive("/v-premium")
              ? "bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20"
              : "text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]"
          }`}
        >
          <Waves className="w-5 h-5 shrink-0 text-amber-400" />
          <span className="truncate">Premium</span>
        </button>

        {/* 10. Loyalty */}
        <button
          id={isMobile ? "mobile-nav-item-loyalty" : "nav-item-loyalty"}
          onClick={() => handleNavClick("/loyalty")}
          title="Loyalty"
          className={`w-full flex items-center justify-between px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
            isActive("/loyalty") || isActive("/bet-arena") || isActive("/orbs-bet") || isActive("/casino")
              ? "bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20"
              : "text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]"
          }`}
        >
          <div className="flex items-center gap-3.5 truncate">
            <Coins className="w-5 h-5 shrink-0 text-white" />
            <span className="truncate">Loyalty</span>
          </div>
          <span className="px-2 py-0.5 text-[9.5px] font-mono font-black bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-400/40 rounded-full">
            VIP
          </span>
        </button>

        {/* 11. People */}
        <button
          id={isMobile ? "mobile-nav-item-people" : "nav-item-people"}
          onClick={() => handleNavClick("/friends")}
          title="People"
          className={`w-full flex items-center justify-between px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
            isActive("/friends") || isActive("/people")
              ? "bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20"
              : "text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]"
          }`}
        >
          <div className="flex items-center gap-3.5 truncate">
            <Users className="w-5 h-5 shrink-0 text-emerald-400" />
            <span className="truncate">People</span>
          </div>
          <span className="px-2 py-0.5 text-[9.5px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
            100+
          </span>
        </button>

        {/* ================= DIVIDER 3 ================= */}
        <div className="py-1">
          <div className="border-t border-white/10" />
        </div>

        {/* ================= GROUP 4 ================= */}
        {/* 12. Help */}
        <div className="w-full">
          <button
            id={isMobile ? "mobile-nav-item-help" : "nav-item-help"}
            onClick={() => setIsHelpExpanded(!isHelpExpanded)}
            title="Help"
            className="w-full flex items-center justify-between px-4 py-3 rounded-[14px] text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3.5 truncate">
              <BookOpen className="w-5 h-5 shrink-0 text-indigo-400" />
              <span className="truncate">Help</span>
            </div>
            {isHelpExpanded ? (
              <ChevronDown className="w-4 h-4 opacity-70" />
            ) : (
              <ChevronRight className="w-4 h-4 opacity-70" />
            )}
          </button>

          {isHelpExpanded && (
            <div className="mt-1.5 ml-4 pl-3 border-l border-[#3E3E48] space-y-1 text-xs text-[#A1A1AA] p-2">
              <p>• Phím tắt: ⌘K tìm kiếm nhanh Spotlight</p>
              <p>• Space để tạm dừng / tiếp tục phát sóng</p>
              <p>• Báo lỗi và thảo luận trên Waves Discord</p>
            </div>
          )}
        </div>

        {/* 13. About */}
        <button
          id={isMobile ? "mobile-nav-item-about" : "nav-item-about"}
          onClick={() => handleNavClick("/about")}
          title="About"
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
            isActive("/about")
              ? "bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20"
              : "text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]"
          }`}
        >
          <Info className="w-5 h-5 shrink-0 text-sky-400" />
          <span className="truncate">About</span>
        </button>

        {/* 14. Join Waves */}
        <button
          type="button"
          id={isMobile ? "mobile-nav-item-discord" : "nav-item-discord"}
          onClick={() => setIsDiscordModalOpen(true)}
          title="Join Waves"
          className="w-full flex items-center justify-between px-4 py-3 rounded-[14px] text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36] transition-all group cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5 truncate">
            <svg className="w-5 h-5 fill-current text-[#5865F2] shrink-0" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.078.078 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          <span className="truncate">Join Waves</span>
        </div>
        <span className="px-1.5 py-0.2 text-[9px] font-bold text-[#5865F2] bg-[#5865F2]/10 rounded-full">
          Discord
        </span>
      </button>

      {/* 15. Cài đặt */}
      <button
        id={isMobile ? "mobile-nav-item-settings" : "nav-item-settings"}
        onClick={() => handleNavClick("/settings")}
        title="Cài đặt"
        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] transition-all cursor-pointer ${
          isActive("/settings")
            ? "bg-[#E6005A] text-white font-bold shadow-md shadow-[#E6005A]/20"
            : "text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]"
        }`}
      >
        <Settings className="w-5 h-5 shrink-0 text-gray-400" />
        <span className="truncate">Cài đặt</span>
      </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Persistent Sidebar (Only when dockToSidebar is true and top_bar flag is false) */}
      {settings.dockToSidebar && !isTopBarMode && (
        <aside 
          id="waves-desktop-sidebar"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`hidden md:flex flex-col border-r border-white/5 select-none shrink-0 fixed top-0 h-screen left-0 z-40 overflow-hidden transition-all duration-300 ease-in-out ${
            effectiveCollapsed ? 'w-[80px]' : 'w-[290px]'
          }`}
        >
          {/* Progressive Blur Layer System (gradually decreasing opacity from top to bottom) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
            <div className="absolute inset-0 backdrop-blur-[32px] [mask-image:linear-gradient(to_bottom,black_0%,black_10%,transparent_35%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_10%,transparent_35%)]" />
            <div className="absolute inset-0 backdrop-blur-[20px] [mask-image:linear-gradient(to_bottom,black_0%,black_25%,transparent_60%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_25%,transparent_60%)]" />
            <div className="absolute inset-0 backdrop-blur-[12px] [mask-image:linear-gradient(to_bottom,black_0%,black_45%,transparent_80%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_45%,transparent_80%)]" />
            <div className="absolute inset-0 backdrop-blur-[6px] [mask-image:linear-gradient(to_bottom,black_0%,black_65%,transparent_95%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_65%,transparent_95%)]" />
            <div className="absolute inset-0 backdrop-blur-[2px] [mask-image:linear-gradient(to_bottom,black_0%,black_80%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_80%,transparent_100%)]" />
            {/* Background tint gradually decreasing opacity from top to bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#181818]/98 via-[#181818]/70 to-[#181818]/20" />
          </div>
          {!effectiveCollapsed ? (
            renderSidebarBody(false)
          ) : (
            <div className="flex flex-col h-full pt-4 pb-3 items-center">
              {/* Collapsed Icon Logo */}
              <div 
                onClick={() => handleNavClick('/')} 
                className="cursor-pointer flex items-center justify-center p-0 hover:opacity-80 transition-opacity"
                title="VNRT Online"
              >
                <img
                  src="https://static.wikia.nocookie.net/ep-deo/images/1/1d/New_logo.png/revision/latest?cb=20260924062053"
                  alt="VNRT Online"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 object-contain shrink-0"
                />
              </div>

              {/* Expand sidebar button */}
              <button 
                id="btn-sidebar-expand"
                onClick={onToggleCollapse}
                className="mt-3 w-7 h-7 rounded-full bg-[#2F2F36] border border-[#3E3E48] flex items-center justify-center text-[#A1A1AA] hover:text-white hover:bg-[#3C3C46] transition-all cursor-pointer shadow-sm shrink-0"
                title="Mở rộng menu"
              >
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>

              {/* Collapsed Search button */}
              <div className="px-2 pt-4 pb-1.5 flex justify-center shrink-0">
                <button
                  id="btn-spotlight-search-mini"
                  onClick={handleSpotlightClick}
                  title="Spotlight Search (⌘K)"
                  className={`w-11 h-11 min-w-[44px] min-h-[44px] shrink-0 rounded-full spotlight-bubble-box flex items-center justify-center transition-all cursor-pointer shadow-md border-0 ${
                    currentRoute === '/search' || currentRoute === '/spotlight'
                      ? 'bg-[#282834] text-white shadow-lg shadow-cyan-500/20'
                      : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  <div className="w-[18px] h-[18px] min-w-[18px] min-h-[18px] max-w-[18px] max-h-[18px] flex items-center justify-center shrink-0">
                    <img
                      src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest?cb=20260717131751"
                      alt="Search"
                      referrerPolicy="no-referrer"
                      className="w-full h-full aspect-square object-contain brightness-0 invert opacity-80 shrink-0"
                    />
                  </div>
                </button>
              </div>

              {/* Mini Orbs Counter */}
              <div className="px-2 pb-3 flex justify-center shrink-0">
                <button
                  id="btn-mini-orbs-indicator"
                  onClick={() => handleNavClick('/v-premium')}
                  title={`Số dư: ${orbs.toLocaleString()} Orbs (Khoáng vật)`}
                  className="w-11 min-w-[44px] shrink-0 py-1 px-0.5 rounded-xl bg-purple-950/50 border border-purple-500/30 flex flex-col items-center justify-center hover:border-purple-400 hover:bg-purple-900/40 hover:scale-105 transition-all shadow-md cursor-pointer group"
                >
                  <Coins className="w-3.5 h-3.5 text-amber-300 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)] shrink-0" />
                  <span className="text-[8px] font-mono font-extrabold text-purple-200 mt-0.5 tracking-tight truncate max-w-[38px]">
                    {orbs >= 1000000
                      ? `${(orbs / 1000000).toFixed(1)}M`
                      : orbs >= 1000
                      ? `${(orbs / 1000).toFixed(0)}k`
                      : orbs}
                  </span>
                </button>
              </div>

              {/* Mini nav icons matching reordered layout */}
              <div className="w-full flex-1 overflow-y-auto pb-4 space-y-2 flex flex-col items-center no-scrollbar">
                {/* 1. Home */}
                <button
                  id="mini-nav-item-home"
                  onClick={() => handleNavClick('/')}
                  title="Home"
                  className={`w-10 h-10 min-w-[40px] min-h-[40px] shrink-0 rounded-[12px] flex items-center justify-center p-0 transition-all cursor-pointer ${
                    isActive('/') && currentRoute === '/' ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <Home className="w-4 h-4 shrink-0" />
                </button>

                {/* 2. Truyền hình */}
                <button
                  id="mini-nav-item-live-tv"
                  onClick={() => handleNavClick('/live-tv')}
                  title="Truyền hình"
                  className={`w-10 h-10 min-w-[40px] min-h-[40px] shrink-0 rounded-[12px] flex items-center justify-center p-0 transition-all cursor-pointer ${
                    isActive('/live-tv') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <Tv className="w-4 h-4 shrink-0" />
                </button>

                {/* 3. Cổng thông tin */}
                <button
                  id="mini-nav-item-news"
                  onClick={() => handleNavClick('/news')}
                  title="Cổng thông tin"
                  className={`w-10 h-10 min-w-[40px] min-h-[40px] shrink-0 rounded-[12px] flex items-center justify-center p-0 transition-all cursor-pointer ${
                    isActive('/news') || isActive('/article') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <Newspaper className="w-4 h-4 text-amber-400 shrink-0" />
                </button>

                {/* 4. Copilot */}
                <button
                  id="mini-nav-item-copilot"
                  onClick={() => handleNavClick('/copilot')}
                  title="Copilot for VNRT Online"
                  className={`w-10 h-10 min-w-[40px] min-h-[40px] shrink-0 rounded-[12px] flex items-center justify-center p-0 transition-all cursor-pointer ${
                    isActive('/copilot') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <img
                    src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
                    alt="Copilot"
                    referrerPolicy="no-referrer"
                    className="w-4 h-4 object-contain shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/microsoft-copilot.svg";
                    }}
                  />
                </button>

                {/* Music mini */}
                <button
                  id="mini-nav-item-music"
                  onClick={() => handleNavClick('/music')}
                  title="Music"
                  className={`w-10 h-10 min-w-[40px] min-h-[40px] shrink-0 rounded-[12px] flex items-center justify-center p-0 transition-all cursor-pointer ${
                    isActive('/music') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <Music className="w-4 h-4 text-white shrink-0" />
                </button>

                {/* Shop mini */}
                <button
                  id="mini-nav-item-shop"
                  onClick={() => handleNavClick('/v-shop')}
                  title="Shop"
                  className={`w-10 h-10 min-w-[40px] min-h-[40px] shrink-0 rounded-[12px] flex items-center justify-center p-0 transition-all cursor-pointer ${
                    isActive('/v-shop') || isActive('/shop') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-white shrink-0" />
                </button>

                <div className="w-6 border-t border-white/10 my-0.5 shrink-0" />

                {/* 5. Space 360 */}
                <button
                  id="mini-nav-item-space360"
                  onClick={() => handleNavClick('/space-360')}
                  title="Space 360"
                  className={`w-10 h-10 min-w-[40px] min-h-[40px] shrink-0 rounded-[12px] flex items-center justify-center p-0 transition-all cursor-pointer ${
                    isActive('/space-360') || isActive('/v-space') || isActive('/v-apps') || isActive('/v-arcade') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4 text-white shrink-0" />
                </button>

                {/* 6. V-Flow */}
                <button
                  id="mini-nav-item-vflow"
                  onClick={() => handleNavClick('/v-flow')}
                  title="V-Flow"
                  className={`w-10 h-10 min-w-[40px] min-h-[40px] shrink-0 rounded-[12px] flex items-center justify-center p-0 transition-all cursor-pointer ${
                    isActive('/v-flow') || isActive('/flow') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <Radio className="w-4 h-4 text-rose-400 shrink-0" />
                </button>

                {/* 7. V-Chat */}
                <button
                  id="mini-nav-item-chat"
                  onClick={() => handleNavClick('/chat')}
                  title="V-Chat"
                  className={`w-10 h-10 min-w-[40px] min-h-[40px] shrink-0 rounded-[12px] flex items-center justify-center p-0 transition-all cursor-pointer ${
                    isActive('/chat') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-sky-400 shrink-0" />
                </button>

                {/* 8. Vertical */}
                <button
                  id="mini-nav-item-vertical"
                  onClick={() => handleNavClick('/vertical')}
                  title="Vertical"
                  className={`w-10 h-10 min-w-[40px] min-h-[40px] shrink-0 rounded-[12px] flex items-center justify-center p-0 transition-all cursor-pointer ${
                    isActive('/vertical') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
                </button>

                <div className="w-6 border-t border-white/10 my-0.5 shrink-0" />

                {/* 9. Premium */}
                <button
                  id="mini-nav-item-premium"
                  onClick={() => handleNavClick('/v-premium')}
                  title="Premium"
                  className={`w-10 h-10 min-w-[40px] min-h-[40px] shrink-0 rounded-[12px] flex items-center justify-center p-0 transition-all cursor-pointer ${
                    isActive('/v-premium') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <Waves className="w-4 h-4 text-amber-400 shrink-0" />
                </button>

                {/* 10. Loyalty */}
                <button
                  id="mini-nav-item-loyalty"
                  onClick={() => handleNavClick('/loyalty')}
                  title="Loyalty"
                  className={`w-10 h-10 min-w-[40px] min-h-[40px] shrink-0 rounded-[12px] flex items-center justify-center p-0 transition-all cursor-pointer ${
                    isActive('/loyalty') || isActive('/bet-arena') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <Coins className="w-4 h-4 text-white shrink-0" />
                </button>

                {/* 11. People */}
                <button
                  id="mini-nav-item-people"
                  onClick={() => handleNavClick('/friends')}
                  title="People"
                  className={`w-10 h-10 min-w-[40px] min-h-[40px] shrink-0 rounded-[12px] flex items-center justify-center p-0 transition-all cursor-pointer ${
                    isActive('/friends') || isActive('/people') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                </button>

                <div className="w-6 border-t border-white/10 my-0.5 shrink-0" />

                {/* 12. Settings */}
                <button
                  id="mini-nav-item-settings"
                  onClick={() => handleNavClick('/settings')}
                  title="Cài đặt"
                  className={`w-10 h-10 min-w-[40px] min-h-[40px] shrink-0 rounded-[12px] flex items-center justify-center p-0 transition-all cursor-pointer ${
                    isActive('/settings') ? 'bg-[#E6005A] text-white shadow-md' : 'text-[#D1D5DB] hover:bg-[#2F2F36]'
                  }`}
                >
                  <Settings className="w-4 h-4 text-gray-400 shrink-0" />
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

            {/* Mobile Drawer with smooth deceleration ease & Progressive Blur */}
            <motion.div
              id="waves-mobile-sidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[290px] sm:w-[320px] max-w-[85vw] h-full border-r border-white/5 flex flex-col shadow-2xl z-10 overflow-hidden"
            >
              {/* Progressive Blur Layer System on Mobile Sidebar */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
                <div className="absolute inset-0 backdrop-blur-[32px] [mask-image:linear-gradient(to_bottom,black_0%,black_10%,transparent_35%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_10%,transparent_35%)]" />
                <div className="absolute inset-0 backdrop-blur-[20px] [mask-image:linear-gradient(to_bottom,black_0%,black_25%,transparent_60%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_25%,transparent_60%)]" />
                <div className="absolute inset-0 backdrop-blur-[12px] [mask-image:linear-gradient(to_bottom,black_0%,black_45%,transparent_80%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_45%,transparent_80%)]" />
                <div className="absolute inset-0 backdrop-blur-[6px] [mask-image:linear-gradient(to_bottom,black_0%,black_65%,transparent_95%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_65%,transparent_95%)]" />
                <div className="absolute inset-0 backdrop-blur-[2px] [mask-image:linear-gradient(to_bottom,black_0%,black_80%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_80%,transparent_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#181818]/98 via-[#181818]/70 to-[#181818]/20" />
              </div>
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
