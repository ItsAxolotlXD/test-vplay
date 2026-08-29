import React from 'react';
import { 
  Tv, 
  Megaphone, 
  Heart, 
  Box, 
  Settings as SettingsIcon,
  Search
} from 'lucide-react';

interface BottomDockProps {
  currentRoute: string;
  navigate: (route: string) => void;
  onOpenSearch: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  currentRoute,
  navigate,
  onOpenSearch
}) => {
  const isActive = (path: string) => {
    if (path === '/') return currentRoute === '/' || currentRoute === '/home';
    return currentRoute.startsWith(path);
  };

  const navItems = [
    { id: 'dock-home', label: 'Trang chủ', isCustomHome: true, route: '/' },
    { id: 'dock-tv', label: 'Truyền hình', icon: Tv, route: '/live-tv' },
    { id: 'dock-news', label: 'Tin tức', icon: Megaphone, route: '/news' },
    { id: 'dock-settings', label: 'Cài đặt', icon: SettingsIcon, route: '/settings' },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 select-none">
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#1E1D24]/95 dark:bg-[#1E1D24]/95 backdrop-blur-xl border border-[#34343E] shadow-2xl">
        {/* Spotlight Search button */}
        <button
          id="dock-spotlight-btn"
          onClick={onOpenSearch}
          title="Spotlight Search (⌘K)"
          className="w-12 h-12 rounded-full flex items-center justify-center text-[#9CA3AF] hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
        >
          <Search className="w-5.5 h-5.5" />
        </button>

        <div className="w-[1px] h-6 bg-[#3E3E4A] my-auto mx-1" />

        {/* Navigation items - enlarged icons without labels */}
        {navItems.map((item) => {
          const active = isActive(item.route);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={item.id}
              onClick={() => navigate(item.route)}
              title={item.label}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                active 
                  ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/30' 
                  : 'text-[#9CA3AF] hover:text-white hover:bg-white/10'
              }`}
            >
              {item.isCustomHome ? (
                <img
                  src="https://static.wikia.nocookie.net/ep-deo/images/6/6e/New_hom.png/revision/latest?cb=20260722124341"
                  alt="Home"
                  referrerPolicy="no-referrer"
                  className={`w-6 h-6 object-contain shrink-0 ${
                    active ? 'brightness-0 invert' : 'sidebar-nav-home-icon'
                  }`}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : Icon ? (
                <Icon className="w-6 h-6 shrink-0" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};
