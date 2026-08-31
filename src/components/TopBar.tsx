import React, { useState } from 'react';
import { Menu, Bell, Sun, Moon, Users } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

interface TopBarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  onOpenSearch: () => void;
  onOpenMobileMenu?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentRoute: _currentRoute,
  navigate,
  onOpenSearch,
  onOpenMobileMenu
}) => {
  const { settings, updateSetting } = useSettings();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const isLightMode = settings.theme === 'light';

  const toggleTheme = () => {
    updateSetting('theme', isLightMode ? 'dark' : 'light');
  };

  const notifications = [
    { id: 1, title: 'Trực tiếp VIETNAM TODAY lúc 20:00 trên VTV4 HD', time: 'Vừa xong', unread: true },
    { id: 2, title: 'Thời sự 19h đã cập nhật tiêu điểm kinh tế số', time: '45 phút trước', unread: false },
    { id: 3, title: 'Bản tin số hóa truyền hình DVB-T2 các tỉnh thành', time: '2 giờ trước', unread: false }
  ];

  return (
    <header className="w-full h-16 bg-transparent border-0 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 pointer-events-none">
      {/* Left Side (Mobile Only Logo & Hamburger) */}
      <div className="flex items-center gap-3 md:hidden pointer-events-auto">
        <button
          id="btn-mobile-menu-toggle"
          onClick={onOpenMobileMenu}
          className="w-9 h-9 flex items-center justify-center text-[#18181B] dark:text-white bg-transparent hover:text-[#E6005A] transition-colors cursor-pointer"
          aria-label="Mở menu điều hướng"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="h-8 flex items-center justify-center overflow-hidden">
            {!logoError ? (
              <img 
                src={isLightMode 
                  ? "https://static.wikia.nocookie.net/ep-deo/images/f/f3/Vplay_light_mode.png/revision/latest/scale-to-width-down/1000?cb=20260829062448"
                  : "https://static.wikia.nocookie.net/ep-deo/images/f/f8/Vpla.png/revision/latest/scale-to-width-down/1000?cb=20260829062528"
                } 
                alt="Vplay Logo" 
                referrerPolicy="no-referrer"
                className="h-7 w-auto max-w-[120px] object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-[#E6005A] font-black text-sm">V</span>
            )}
          </div>
        </div>
      </div>

      {/* Empty placeholder on desktop left */}
      <div className="hidden md:flex items-center gap-3" />

      {/* Right Action Icons: Search, Notifications & Light Mode Toggle */}
      <div className="flex items-center gap-3 md:gap-4 pointer-events-auto ml-auto">
        {/* Quick Spotlight Search trigger */}
        <button
          id="btn-top-search"
          onClick={onOpenSearch}
          className="w-9 h-9 flex items-center justify-center text-[#18181B] dark:text-[#D1D5DB] dark:hover:text-white hover:opacity-80 bg-transparent transition-all drop-shadow-sm cursor-pointer"
          title="Spotlight Search (⌘K)"
        >
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest?cb=20260717131751"
            alt="Search"
            referrerPolicy="no-referrer"
            className="w-5 h-5 object-contain topbar-search-icon"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </button>

        {/* Notifications button */}
        <div className="relative">
          <button
            id="btn-top-notifications"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-9 h-9 flex items-center justify-center text-[#18181B] dark:text-[#D1D5DB] dark:hover:text-white hover:opacity-80 bg-transparent transition-all relative drop-shadow-sm cursor-pointer"
            title="Thông báo cộng đồng"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E6005A]" />
          </button>

          {/* Notification dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#FFFFFF] dark:bg-[#222226] border border-[#E5E7EB] dark:border-[#36363E] p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 topbar-notification-box">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F3F4F6] dark:border-[#303036] topbar-notification-header">
                <span className="text-xs font-bold text-[#111827] dark:text-white uppercase tracking-wider">Thông báo phát sóng</span>
                <span className="text-[10px] text-[#E6005A] font-medium cursor-pointer hover:underline">Đã đọc tất cả</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer topbar-notification-item ${
                      n.unread 
                        ? 'bg-[#F3F4F6] dark:bg-[#2E2E34] border border-[#E5E7EB] dark:border-[#40404A]' 
                        : 'bg-transparent hover:bg-[#F8FAFC] dark:hover:bg-[#28282E]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[#111827] dark:text-white font-medium leading-snug">{n.title}</p>
                      {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#E6005A] shrink-0 mt-1" />}
                    </div>
                    <span className="text-[10px] text-[#6B7280] dark:text-[#8E8E93] mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Friends & People button */}
        <button
          id="btn-top-friends"
          onClick={() => navigate('/friends')}
          className={`w-9 h-9 flex items-center justify-center text-[#18181B] dark:text-[#D1D5DB] dark:hover:text-white hover:opacity-80 bg-transparent transition-all drop-shadow-sm cursor-pointer hover:scale-105 active:scale-95 rounded-xl ${
            _currentRoute === '/friends' || _currentRoute === '/people' ? 'ring-2 ring-[#E6005A] bg-[#E6005A]/10 text-[#E6005A]' : ''
          }`}
          title="Bạn bè & Người dùng Vplay (100+ Cư dân)"
          aria-label="Mở Friends & People"
        >
          <Users className="w-5 h-5" />
        </button>

        {/* Light Mode / Dark Mode Toggle button */}
        <button
          id="btn-top-light-mode"
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center text-[#18181B] dark:text-[#D1D5DB] dark:hover:text-[#FBBF24] hover:opacity-80 bg-transparent transition-all drop-shadow-sm cursor-pointer"
          title={isLightMode ? 'Chuyển sang Dark Mode' : 'Chuyển sang Light Mode'}
          aria-label="Chuyển chế độ sáng/tối"
        >
          {isLightMode ? (
            <Moon className="w-5 h-5 text-[#18181B]" />
          ) : (
            <Sun className="w-5 h-5 text-white hover:rotate-45 transition-transform duration-300" />
          )}
        </button>

        {/* Copilot for Vplay button */}
        <button
          id="btn-top-copilot"
          onClick={() => navigate('/copilot')}
          className={`w-9 h-9 flex items-center justify-center text-[#18181B] dark:text-[#D1D5DB] dark:hover:text-white hover:opacity-80 bg-transparent transition-all drop-shadow-sm cursor-pointer hover:scale-105 active:scale-95 rounded-xl ${
            _currentRoute === '/copilot' ? 'ring-2 ring-indigo-500 bg-indigo-500/10' : ''
          }`}
          title="Copilot for Vplay"
          aria-label="Mở Copilot for Vplay"
        >
          <img
            src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
            alt="Copilot for Vplay"
            referrerPolicy="no-referrer"
            className="w-5 h-5 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/microsoft-copilot.svg";
            }}
          />
        </button>
      </div>
    </header>
  );
};
