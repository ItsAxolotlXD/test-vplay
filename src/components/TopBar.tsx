import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown, 
  Tv, 
  LayoutGrid, 
  Ticket, 
  ShieldPlus, 
  Film, 
  PlaySquare, 
  Calendar, 
  ShoppingBag, 
  User, 
  X, 
  Check, 
  Sparkles, 
  Gift, 
  Clock, 
  ExternalLink,
  ChevronRight,
  CreditCard,
  Heart,
  Stethoscope,
  Activity,
  Award,
  Newspaper,
  Compass,
  Radio,
  MessageSquare,
  Users,
  Coins,
  Gamepad2,
  Folder,
  MapPin,
  Box,
  GraduationCap,
  Calculator,
  FileText,
  Layers,
  ArrowRight,
  StickyNote,
  Armchair,
  Music
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '../hooks/useSettings';
import { useFeatureFlags } from '../hooks/useFeatureFlags';

interface TopBarProps {
  currentRoute: string;
  navigate: (route: string, state?: any) => void;
  onOpenSearch: () => void;
  onOpenMobileMenu?: () => void;
  onOpenCopilotWindow?: () => void;
}

// Official Vplay Logo component with fallback (compact size)
const VplayLogo: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      id="topbar-vplay-logo"
      onClick={onClick}
      className="flex items-center gap-2 group cursor-pointer focus:outline-none shrink-0"
      title="Vplay - Về trang chủ"
    >
      {!imgError ? (
        <img
          src="https://static.wikia.nocookie.net/ep-deo/images/f/f8/Vpla.png/revision/latest/scale-to-width-down/1000?cb=20260829062528"
          alt="Vplay"
          referrerPolicy="no-referrer"
          className="h-6 md:h-7 w-auto max-w-[105px] object-contain transition-transform group-hover:scale-105 filter drop-shadow"
          style={{ imageRendering: '-webkit-optimize-contrast' }}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex items-center gap-1 font-bold tracking-tight text-white select-none">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF2020] to-[#E6005A] flex items-center justify-center shadow-md">
            <span className="text-white text-xs font-black">V</span>
          </div>
          <span className="text-base font-black bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
            play
          </span>
        </div>
      )}
    </button>
  );
};

export const TopBar: React.FC<TopBarProps> = ({
  currentRoute,
  navigate,
  onOpenSearch,
  onOpenMobileMenu
}) => {
  const { settings } = useSettings();
  const { flags } = useFeatureFlags();

  const isLightMode = settings.theme === 'light';

  // Dropdowns & Modals State
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [isSpaceMenuOpen, setIsSpaceMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  
  // Interactive Modals
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);
  const [isBuyPackageModalOpen, setIsBuyPackageModalOpen] = useState(false);

  // Dynamic Scroll State for Progressive Blur elevation
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Form states inside modals
  const [activationCode, setActivationCode] = useState('');
  const [activationStatus, setActivationStatus] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState('vtv1');

  const moreMenuTimerRef = useRef<NodeJS.Timeout | null>(null);
  const moreMenuDropdownRef = useRef<HTMLDivElement | null>(null);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const handleMoreMouseEnter = () => {
    if (moreMenuTimerRef.current) clearTimeout(moreMenuTimerRef.current);
    setMoreMenuOpen(true);
  };

  const handleMoreMouseLeave = () => {
    moreMenuTimerRef.current = setTimeout(() => {
      setMoreMenuOpen(false);
      setIsSpaceMenuOpen(false);
    }, 250);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuDropdownRef.current && !moreMenuDropdownRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
        setIsSpaceMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setUserProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: 'Trực tiếp VIETNAM TODAY lúc 20:00 trên VTV4 HD', time: 'Vừa xong', unread: true },
    { id: 2, title: 'Thời sự 19h đã cập nhật tiêu điểm kinh tế số', time: '45 phút trước', unread: false },
    { id: 3, title: 'Bản tin số hóa truyền hình DVB-T2 các tỉnh thành', time: '2 giờ trước', unread: false }
  ];

  const handleActivateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activationCode.trim()) return;
    setActivationStatus('Đang xác thực...');
    setTimeout(() => {
      setActivationStatus('Kích hoạt mã thành công! Bạn đã nhận 1 tháng VIP VTVgo.');
    }, 1000);
  };

  const isLiveTVActive = currentRoute === '/live-tv' || currentRoute.startsWith('/live-tv');

  return (
    <>
      <header 
        id="vplay-topbar-header"
        className={`w-full sticky top-0 z-50 select-none transition-all duration-300 relative ${
          isScrolled 
            ? 'shadow-[0_6px_24px_rgba(0,0,0,0.3)]' 
            : 'shadow-none'
        }`}
      >
        {/* Progressive Blur Layer System with reduced tint opacity and no divider */}
        <div className="absolute inset-0 pointer-events-none overflow-visible -z-10" aria-hidden="true">
          {/* Multi-tier gradient blurred backdrops */}
          <div className="absolute inset-0 backdrop-blur-[36px] [mask-image:linear-gradient(to_bottom,black_0%,black_25%,transparent_55%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_25%,transparent_55%)]" />
          <div className="absolute inset-0 backdrop-blur-[24px] [mask-image:linear-gradient(to_bottom,black_0%,black_45%,transparent_75%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_45%,transparent_75%)]" />
          <div className="absolute inset-0 backdrop-blur-[14px] [mask-image:linear-gradient(to_bottom,black_0%,black_65%,transparent_90%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_65%,transparent_90%)]" />
          <div className="absolute inset-0 backdrop-blur-[6px] [mask-image:linear-gradient(to_bottom,black_0%,black_80%,transparent_98%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_80%,transparent_98%)]" />
          <div className="absolute inset-0 backdrop-blur-[2px] [mask-image:linear-gradient(to_bottom,black_0%,black_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_90%,transparent_100%)]" />
          
          {/* Soft progressive blur apron extending 14px beneath top bar for seamless background fade */}
          <div className="absolute -bottom-3.5 left-0 right-0 h-3.5 backdrop-blur-[8px] [mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)]" />

          {/* Background tint gradient with reduced opacity and no divider border */}
          <div className={`absolute inset-0 transition-opacity duration-300 ${
            isLightMode
              ? isScrolled 
                ? 'bg-gradient-to-b from-white/70 via-white/45 to-white/20' 
                : 'bg-gradient-to-b from-white/50 via-white/30 to-white/10'
              : isScrolled
                ? 'bg-gradient-to-b from-[#1B0912]/75 via-[#1B0912]/50 to-[#1B0912]/25'
                : 'bg-gradient-to-b from-[#1B0912]/55 via-[#1B0912]/35 to-[#1B0912]/15'
          }`} />
        </div>
        <div className="w-full max-w-[1780px] mx-auto px-4 md:px-6 lg:px-8 h-16 md:h-[68px] flex items-center justify-between gap-3 md:gap-4">
          
          {/* LEFT & CENTER NAV GROUP */}
          <div className="flex items-center gap-5 lg:gap-8 h-full">
            
            {/* Mobile menu drawer button */}
            <button
              id="btn-topbar-mobile-menu"
              onClick={onOpenMobileMenu}
              className="w-9 h-9 flex md:hidden items-center justify-center rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Mở danh mục điều hướng"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* 1. Official Vplay Logo */}
            <VplayLogo onClick={() => navigate('/')} />

            {/* 2. Navigation Items:
                - Truyền Hình
                - Xem thêm v (với Dropdown Menu có Loyalty bên trong)
            */}
            <nav className="hidden md:flex items-center gap-2 lg:gap-3 h-full text-white">
              
              {/* Item 1: Truyền hình */}
              <button
                id="topbar-nav-live-tv"
                onClick={() => navigate('/live-tv')}
                className={`relative px-4 py-2 rounded-full text-[14.5px] font-medium transition-all flex items-center gap-2 cursor-pointer group ${
                  isLiveTVActive
                    ? 'text-white bg-white/15 font-bold'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                title="Truyền hình Vplay"
              >
                <Tv className="w-5 h-5 shrink-0 text-white/90 group-hover:scale-105 transition-transform" />
                <span className="font-medium tracking-wide">Truyền hình</span>
              </button>

              {/* Item 2: Music / Kho nhạc truyền hình */}
              <button
                id="topbar-nav-music"
                onClick={() => navigate('/music')}
                className={`relative px-4 py-2 rounded-full text-[14.5px] font-medium transition-all flex items-center gap-2 cursor-pointer group ${
                  currentRoute === '/music' || currentRoute.startsWith('/music')
                    ? 'text-white bg-white/15 font-bold'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                title="Kho nhạc truyền hình Vplay Music"
              >
                <Music className="w-5 h-5 shrink-0 text-white/90 group-hover:scale-105 transition-transform" />
                <span className="font-medium tracking-wide">Music</span>
              </button>

              {/* Item 3: Xem thêm v with Dropdown Menu */}
              <div
                className="relative h-full flex items-center"
                ref={moreMenuDropdownRef}
                onMouseEnter={handleMoreMouseEnter}
                onMouseLeave={handleMoreMouseLeave}
              >
                <button
                  id="topbar-nav-more"
                  onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                  className={`relative px-4 py-2 rounded-full text-[14.5px] font-medium transition-all flex items-center gap-1.5 cursor-pointer group ${
                    moreMenuOpen
                      ? 'text-white bg-white/15 font-bold'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                  aria-expanded={moreMenuOpen}
                >
                  <span className="font-medium tracking-wide">Xem thêm</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 text-white/80 ${
                    moreMenuOpen ? 'rotate-180 text-white' : ''
                  }`} />
                </button>

                {/* "XEM THÊM" DROPDOWN MENU WITH ANIMATION EXPANDING FROM TOP-LEFT (MAX 5 ITEMS VISIBLE, SCROLLBAR, BORDERLESS) */}
                <AnimatePresence>
                  {moreMenuOpen && (
                    <motion.div
                      id="topbar-more-dropdown-menu"
                      initial={{ opacity: 0, scale: 0.75, originX: 0, originY: 0 }}
                      animate={{ opacity: 1, scale: 1, originX: 0, originY: 0 }}
                      exit={{ opacity: 0, scale: 0.75, originX: 0, originY: 0 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        WebkitBackdropFilter: 'blur(32px)',
                        backdropFilter: 'blur(32px)',
                        transformOrigin: 'top left'
                      }}
                      className="absolute left-0 top-full mt-2 w-[310px] max-h-[238px] overflow-y-auto rounded-2xl p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.85)] z-50 bg-[#1B0912]/95 backdrop-blur-2xl text-white [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.3)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-white/5 origin-top-left"
                    >
                      <div className="space-y-1 py-0.5 pr-1">
                        
                        {/* 1. Copilot for Vplay */}
                        <button
                          id="more-item-copilot"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            setIsSpaceMenuOpen(false);
                            navigate('/copilot');
                          }}
                          className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-left text-[14px] font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer group"
                        >
                          <img
                            src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
                            alt="Copilot"
                            referrerPolicy="no-referrer"
                            className="w-5 h-5 object-contain group-hover:scale-110 transition-transform shrink-0"
                          />
                          <span className="font-semibold">Copilot for Vplay</span>
                        </button>

                        {/* 2. Cổng nội dung */}
                        <button
                          id="more-item-content-portal"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            setIsSpaceMenuOpen(false);
                            navigate('/channels');
                          }}
                          className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-left text-[14px] font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer group"
                        >
                          <LayoutGrid className="w-5 h-5 shrink-0 text-white/90 group-hover:scale-105 transition-transform" />
                          <span>Cổng nội dung</span>
                        </button>

                        {/* 3. Cổng thông tin (News) */}
                        <button
                          id="more-item-news"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            setIsSpaceMenuOpen(false);
                            navigate('/news');
                          }}
                          className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-left text-[14px] font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer group"
                        >
                          <Newspaper className="w-5 h-5 shrink-0 text-white/90 group-hover:scale-105 transition-transform" />
                          <span>Cổng thông tin</span>
                        </button>

                        {/* Music - Kho nhạc truyền hình */}
                        <button
                          id="more-item-music"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            setIsSpaceMenuOpen(false);
                            navigate('/music');
                          }}
                          className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-left text-[14px] font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer group"
                        >
                          <Music className="w-5 h-5 shrink-0 text-[#FF4C93] group-hover:scale-105 transition-transform" />
                          <span>Kho nhạc truyền hình</span>
                        </button>

                        {/* 4. Cổng không gian (Space 360) - Dẫn trực tiếp đến tab Space 360 */}
                        <button
                          id="more-item-space-360"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            setIsSpaceMenuOpen(false);
                            navigate('/space-360');
                          }}
                          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-[14px] font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer group"
                          title="Chuyển đến Cổng không gian (Space 360)"
                        >
                          <div className="flex items-center gap-3.5">
                            <Compass className="w-5 h-5 shrink-0 text-emerald-400 group-hover:scale-105 transition-transform" />
                            <span>Cổng không gian</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 font-mono font-bold">
                              Space 360
                            </span>
                            <ChevronRight className="w-4 h-4 text-white/60 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </button>

                        {/* 5. Cổng kết nối (V-Flow) */}
                        <button
                          id="more-item-vflow"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            setIsSpaceMenuOpen(false);
                            navigate('/v-flow');
                          }}
                          className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-left text-[14px] font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer group"
                        >
                          <Radio className="w-5 h-5 shrink-0 text-white/90 group-hover:scale-105 transition-transform" />
                          <span>Cổng kết nối (V-Flow)</span>
                        </button>

                        {/* 6. Cổng trò chuyện (V-Chat) */}
                        <button
                          id="more-item-vchat"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            setIsSpaceMenuOpen(false);
                            navigate('/chat');
                          }}
                          className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-left text-[14px] font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer group"
                        >
                          <MessageSquare className="w-5 h-5 shrink-0 text-white/90 group-hover:scale-105 transition-transform" />
                          <span>Cổng trò chuyện (V-Chat)</span>
                        </button>

                        {/* Divider */}
                        <div className="my-1.5 h-[1px] bg-white/10" />

                        {/* 7. Mã kích hoạt */}
                        <button
                          id="more-item-activation-code"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            setIsSpaceMenuOpen(false);
                            setIsActivationModalOpen(true);
                          }}
                          className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-left text-[14px] font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer group"
                        >
                          <Ticket className="w-5 h-5 shrink-0 text-white/90 group-hover:scale-105 transition-transform" />
                          <span>Mã kích hoạt</span>
                        </button>

                        {/* 8. Loyalty (Hợp nhất Sàn cược Orbs & Loyalty Club) */}
                        <button
                          id="more-item-loyalty"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            setIsSpaceMenuOpen(false);
                            navigate('/loyalty');
                          }}
                          className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-left text-[14px] font-medium text-amber-300 hover:text-amber-200 hover:bg-white/10 transition-colors cursor-pointer group"
                        >
                          <div className="relative flex items-center justify-center">
                            <Coins className="w-5 h-5 shrink-0 text-amber-400 group-hover:scale-110 transition-transform" />
                            <Sparkles className="w-2.5 h-2.5 text-amber-300 absolute -top-1 -right-1" />
                          </div>
                          <span className="font-semibold">Loyalty</span>
                        </button>

                        {/* 9. Danh sách bạn bè */}
                        <button
                          id="more-item-friends"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            setIsSpaceMenuOpen(false);
                            navigate('/friends');
                          }}
                          className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-left text-[14px] font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer group"
                        >
                          <Users className="w-5 h-5 shrink-0 text-white/90 group-hover:scale-105 transition-transform" />
                          <span>Danh sách bạn bè</span>
                        </button>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </nav>
          </div>

          {/* RIGHT SIDE ACTIONS:
              - Search Icon
              - Notification Bell Icon
              - Copilot AI Icon
              - User Profile Icon (Fully rounded, no border, reduced spacing)
          */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Search, Notification, Copilot compact icon group */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* 1. Search Icon */}
              <button
                id="btn-topbar-search"
                onClick={onOpenSearch}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                title="Tìm kiếm chương trình (⌘K / Ctrl+K)"
                aria-label="Tìm kiếm"
              >
                <Search className="w-5 h-5 stroke-[1.4]" strokeWidth={1.4} />
              </button>

              {/* 2. Notification Bell Icon */}
              <div className="relative" ref={notificationsRef}>
                <button
                  id="btn-topbar-notifications"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all relative cursor-pointer ${
                    notificationsOpen
                      ? 'text-white bg-white/15'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                  title="Thông báo phát sóng"
                  aria-label="Thông báo phát sóng"
                >
                  <Bell className="w-5 h-5 stroke-[1.4]" strokeWidth={1.4} />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                </button>

                {/* Notification Flyout */}
                {notificationsOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-80 rounded-2xl p-3 shadow-2xl z-50 bg-[#1B0912]/95 backdrop-blur-2xl text-white animate-in fade-in zoom-in-95 duration-150"
                    style={{ WebkitBackdropFilter: 'blur(32px)', backdropFilter: 'blur(32px)' }}
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Thông báo phát sóng</span>
                      <span className="text-[11px] text-red-400 font-medium cursor-pointer hover:underline">Đã đọc tất cả</span>
                    </div>
                    <div className="space-y-1.5">
                      {notifications.map((n) => (
                        <div 
                          key={n.id} 
                          className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                            n.unread 
                              ? 'bg-white/10 border border-white/10'
                              : 'hover:bg-white/5 text-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium leading-snug">{n.title}</p>
                            {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1" />}
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1 block">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Copilot AI Icon */}
              <button
                id="btn-topbar-copilot"
                onClick={() => navigate('/copilot')}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-all cursor-pointer group relative"
                title="Trợ lý AI Copilot"
                aria-label="Trợ lý AI Copilot"
              >
                <img
                  src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
                  alt="Copilot"
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 object-contain group-hover:scale-110 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E6005A] animate-pulse" />
              </button>
            </div>

            {/* 4. User Profile Icon (Fully rounded, no border) */}
            <div className="relative" ref={profileRef}>
              <button
                id="btn-topbar-user-profile"
                onClick={() => setUserProfileOpen(!userProfileOpen)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#23242E] flex items-center justify-center text-white/90 hover:text-white hover:bg-white/15 transition-all cursor-pointer shadow-sm"
                title="Tài khoản Vplay"
                aria-label="Tài khoản cá nhân"
              >
                <User className="w-5 h-5" />
              </button>

              {/* User Account Flyout */}
              {userProfileOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 rounded-2xl p-3.5 shadow-2xl z-50 bg-[#1B0912]/95 backdrop-blur-2xl text-white animate-in fade-in zoom-in-95 duration-150"
                  style={{ WebkitBackdropFilter: 'blur(32px)', backdropFilter: 'blur(32px)' }}
                >
                  <div className="flex items-center gap-3 pb-3 mb-3 border-b border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center font-bold text-white">
                      V
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Vplay Member</h4>
                      <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Gói Miễn Phí (Standard)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs font-medium">
                    <button
                      onClick={() => {
                        setUserProfileOpen(false);
                        setIsBuyPackageModalOpen(true);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-red-600/20 to-orange-500/20 border border-red-500/30 text-white hover:brightness-110 transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-bold text-orange-300">
                        <Award className="w-4 h-4 text-amber-400" />
                        Nâng cấp Vplay VIP
                      </span>
                      <ChevronRight className="w-4 h-4 text-orange-300" />
                    </button>

                    <button
                      onClick={() => {
                        setUserProfileOpen(false);
                        setIsActivationModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-colors text-left"
                    >
                      <Ticket className="w-4 h-4 text-blue-400" />
                      <span>Nhập mã kích hoạt VIP</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserProfileOpen(false);
                        navigate('/favorites');
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-colors text-left"
                    >
                      <Heart className="w-4 h-4 text-rose-400" />
                      <span>Kênh & Video yêu thích</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserProfileOpen(false);
                        navigate('/settings');
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-colors text-left"
                    >
                      <CreditCard className="w-4 h-4 text-purple-400" />
                      <span>Cài đặt & Tài khoản</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* =========================================================================
          MODALS CHO CÁC MỤC TRÊN TOPBAR VÀ DROPDOWN MENU
         ========================================================================= */}

      {/* 1. Modal Mã kích hoạt */}
      <AnimatePresence>
        {isActivationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#181924] border border-white/10 rounded-2xl p-6 text-white shadow-2xl"
            >
              <button
                onClick={() => setIsActivationModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Mã kích hoạt Vplay</h3>
                  <p className="text-xs text-gray-400">Nhập mã ưu đãi, voucher đối tác hoặc gói cước VIP</p>
                </div>
              </div>

              <form onSubmit={handleActivateCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Mã kích hoạt (Voucher / Promo code)
                  </label>
                  <input
                    type="text"
                    value={activationCode}
                    onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                    placeholder="VD: VPLAYVIP, SPORT2026..."
                    className="w-full px-4 py-3 bg-[#10111A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 uppercase tracking-widest font-mono font-bold"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400">Mã mẫu:</span>
                  <button
                    type="button"
                    onClick={() => setActivationCode('VPLAYVIP')}
                    className="text-xs font-mono bg-white/5 hover:bg-white/10 px-2 py-1 rounded border border-white/10 text-amber-400"
                  >
                    VPLAYVIP
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivationCode('PLUS30DAY')}
                    className="text-xs font-mono bg-white/5 hover:bg-white/10 px-2 py-1 rounded border border-white/10 text-cyan-400"
                  >
                    PLUS30DAY
                  </button>
                </div>

                {activationStatus && (
                  <p className="text-xs text-emerald-400 font-medium bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                    {activationStatus}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsActivationModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 font-medium text-sm transition-colors"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-sm hover:brightness-110 transition-all shadow-md shadow-red-600/30"
                  >
                    Kích hoạt ngay
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Modal Cổng Y tế Sức khỏe */}
      <AnimatePresence>
        {isHealthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#181924] border border-white/10 rounded-2xl p-6 text-white shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsHealthModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Cổng Y tế & Sức khỏe VTV</h3>
                  <p className="text-xs text-gray-400">Chuyên trang thông tin y học, phòng dịch và tư vấn sức khỏe người dân</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <Stethoscope className="w-6 h-6 text-emerald-400 mb-2" />
                  <h4 className="font-bold text-sm">Bác sĩ gia đình 24/7</h4>
                  <p className="text-xs text-gray-400 mt-1">Hỏi đáp trực tuyến cùng chuyên gia bệnh viện tuyến đầu</p>
                  <button className="mt-3 text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
                    Đặt câu hỏi ngay <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <Activity className="w-6 h-6 text-cyan-400 mb-2" />
                  <h4 className="font-bold text-sm">Chương trình VTV2 Sức khỏe</h4>
                  <p className="text-xs text-gray-400 mt-1">Cẩm nang sống khỏe, dinh dưỡng học đường và y học thường thức</p>
                  <button 
                    onClick={() => {
                      setIsHealthModalOpen(false);
                      navigate('/live-tv?channel=vtv2-hd');
                    }}
                    className="mt-3 text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    Xem VTV2 HD <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Tin y tế tiêu điểm</h4>
              <div className="space-y-2">
                {[
                  { title: 'Bộ Y tế khuyến cáo các biện pháp phòng ngừa dịch bệnh mùa hè thu', time: 'Hôm nay' },
                  { title: 'Kỹ thuật mổ tim nội soi mới tại Bệnh viện Bạch Mai cứu sống bệnh nhân cao tuổi', time: 'Hôm qua' },
                  { title: 'Chế độ ăn giảm muối để phòng ngừa tăng huyết áp và tai biến', time: '2 ngày trước' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-colors flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <span className="text-[11px] text-gray-400">{item.time}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Modal Lịch phát sóng (EPG) */}
      <AnimatePresence>
        {isScheduleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#181924] border border-white/10 rounded-2xl p-6 text-white shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Lịch phát sóng hôm nay</h3>
                  <p className="text-xs text-gray-400">Lịch trình các chương trình truyền hình đài VTV</p>
                </div>
              </div>

              {/* Channel switcher */}
              <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
                {['vtv1', 'vtv2', 'vtv3', 'vtv4', 'vtv5', 'vtv7', 'vtv8', 'vtv9'].map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setSelectedChannel(ch)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors shrink-0 ${
                      selectedChannel === ch
                        ? 'bg-red-600 text-white'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>

              {/* Programs list 0h -> 23h */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {Array.from({ length: 24 }, (_, h) => {
                  const startHour = String(h).padStart(2, '0') + ':00';
                  const nextH = (h + 1) % 24;
                  const endHour = nextH === 0 ? '23:59' : String(nextH).padStart(2, '0') + ':00';
                  const isCurrent = h === new Date().getHours();

                  return (
                    <div
                      key={h}
                      id={`topbar-epg-slot-${h}`}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                        isCurrent
                          ? 'bg-red-600/15 border-red-500/40 text-white shadow-md'
                          : 'bg-white/5 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-xs font-bold px-2 py-1 rounded ${
                          isCurrent ? 'bg-red-600 text-white' : 'bg-black/30 text-amber-400'
                        }`}>
                          {startHour} - {endHour}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">Chưa có lịch phát sóng</p>
                            {isCurrent && (
                              <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-red-600 text-white uppercase animate-pulse">
                                Đang phát
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">
                            {isCurrent ? 'Khung giờ hiện tại' : 'Chưa có thông tin phát sóng'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIsScheduleModalOpen(false);
                          navigate('/live-tv');
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white shrink-0 cursor-pointer"
                      >
                        Xem kênh
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Modal VTV Shop */}
      <AnimatePresence>
        {isShopModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#181924] border border-white/10 rounded-2xl p-6 text-white shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsShopModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Vplay Shop - Quà tặng & Kỷ niệm</h3>
                  <p className="text-xs text-gray-400">Sản phẩm độc quyền kỷ niệm truyền hình & Vplay</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Áo thun thể thao Vplay 2026', price: '250.000đ', badge: 'Bán chạy', color: 'from-red-600 to-rose-600' },
                  { name: 'Bình giữ nhiệt Vplay Sport 800ml', price: '190.000đ', badge: 'Hot', color: 'from-blue-600 to-cyan-600' },
                  { name: 'Nón bảo hiểm Vplay Carbon', price: '320.000đ', badge: 'Chính hãng', color: 'from-amber-600 to-orange-600' },
                  { name: 'Gấu bông biểu tượng Ong Vplay', price: '150.000đ', badge: 'Quà tặng', color: 'from-purple-600 to-pink-600' }
                ].map((prod, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className={`w-full h-28 rounded-lg bg-gradient-to-tr ${prod.color} flex items-center justify-center mb-3 shadow-inner`}>
                        <ShoppingBag className="w-10 h-10 text-white/80" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-white uppercase">
                        {prod.badge}
                      </span>
                      <h4 className="font-bold text-sm mt-1">{prod.name}</h4>
                      <p className="text-amber-400 font-bold text-sm mt-0.5">{prod.price}</p>
                    </div>
                    <button className="mt-3 w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors">
                      Đặt mua
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Modal Loyalty */}
      <AnimatePresence>
        {isLoyaltyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#181924] border border-white/10 rounded-2xl p-6 text-white shadow-2xl"
            >
              <button
                onClick={() => setIsLoyaltyModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Vplay Loyalty Club</h3>
                  <p className="text-xs text-gray-400">Tích điểm xem truyền hình, đổi voucher hấp dẫn</p>
                </div>
              </div>

              {/* Points Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-600/30 via-orange-600/20 to-red-600/30 border border-amber-500/30 mb-4">
                <span className="text-xs text-amber-300 font-medium">Điểm tích lũy hiện tại</span>
                <div className="text-3xl font-extrabold text-white mt-1">1.450 <span className="text-xs font-normal text-amber-300">V-Points</span></div>
                <div className="flex items-center justify-between text-xs text-gray-300 mt-3 pt-3 border-t border-white/10">
                  <span>Hạng thành viên: <strong className="text-amber-400">VÀNG (Gold)</strong></span>
                  <span className="text-emerald-400">+50 điểm mỗi ngày</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Gift className="w-4 h-4 text-red-400" />
                    <div>
                      <p className="text-xs font-bold">Đổi 1 tháng VIP Vplay</p>
                      <p className="text-[10px] text-gray-400">Cần 1.000 V-Points</p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs">
                    Đổi quà
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-xs font-bold">Voucher Vplay Shop 50K</p>
                      <p className="text-[10px] text-gray-400">Cần 500 V-Points</p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs">
                    Đổi quà
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsLoyaltyModalOpen(false)}
                className="w-full py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 font-medium text-sm transition-colors"
              >
                Đóng
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Modal Mua gói (VIP Subscription Packages) */}
      <AnimatePresence>
        {isBuyPackageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#181924] border border-white/10 rounded-2xl p-6 text-white shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsBuyPackageModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-red-400">Gói cước truyền hình</span>
                <h3 className="text-2xl font-black mt-1">Đăng ký Gói Vplay Plus & Thể Thao</h3>
                <p className="text-xs text-gray-400 mt-1">Không quảng cáo, chất lượng Full HD 4K, trọn vẹn bóng đá & kho phim Vplay</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Package 1 */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 relative flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-lg">Gói Vplay Plus</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Xem truyền hình không quảng cáo gián đoạn</p>
                    <div className="mt-3">
                      <span className="text-2xl font-black text-white">49.000đ</span>
                      <span className="text-xs text-gray-400"> / tháng</span>
                    </div>

                    <ul className="mt-4 space-y-2 text-xs text-gray-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Xem lại chương trình 7 ngày</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Kho phim truyền hình độc quyền</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Đăng nhập tối đa 5 thiết bị</span>
                      </li>
                    </ul>
                  </div>

                  <button 
                    onClick={() => {
                      setIsBuyPackageModalOpen(false);
                      navigate('/v-premium');
                    }}
                    className="mt-5 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-sm text-white transition-colors"
                  >
                    Chọn gói này
                  </button>
                </div>

                {/* Package 2: Sport VIP */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-red-600/20 via-[#231828] to-[#1a1524] border-2 border-red-500/60 relative flex flex-col justify-between shadow-xl shadow-red-600/10">
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-[10px] font-black uppercase text-white shadow-md">
                    Phổ biến nhất
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-white">Gói VTV Sport & Cinema</h4>
                    <p className="text-xs text-orange-200 mt-0.5">Vũ trụ thể thao, bóng đá Châu Âu & bom tấn</p>
                    <div className="mt-3">
                      <span className="text-2xl font-black text-white">79.000đ</span>
                      <span className="text-xs text-gray-300"> / tháng</span>
                    </div>

                    <ul className="mt-4 space-y-2 text-xs text-gray-200">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-red-400 shrink-0" />
                        <span>Tất cả tính năng của gói Plus</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-red-400 shrink-0" />
                        <span>8 kênh thể thao chọn lọc & VTVcab</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-red-400 shrink-0" />
                        <span>Chất lượng hình ảnh 4K HDR siêu nét</span>
                      </li>
                    </ul>
                  </div>

                  <button 
                    onClick={() => {
                      setIsBuyPackageModalOpen(false);
                      navigate('/v-premium');
                    }}
                    className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:brightness-110 font-bold text-sm text-white transition-all shadow-lg shadow-red-600/40 cursor-pointer"
                  >
                    Đăng ký ngay
                  </button>
                </div>
              </div>

              <div className="text-center text-[11px] text-gray-400">
                Hỗ trợ thanh toán qua Ví MoMo, VNPay, ZaloPay, Thẻ ATM nội địa và Thẻ Quốc Tế Visa/Mastercard.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
