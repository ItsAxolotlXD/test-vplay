import React from 'react';
import { motion } from 'motion/react';
import { 
  Tv, 
  Megaphone, 
  Heart, 
  Box, 
  Settings as SettingsIcon,
  Search,
  Users,
  Coins,
  Smartphone,
  Flag,
  Radio,
  Music,
  ShoppingBag,
  Columns2,
  Calendar
} from 'lucide-react';
import { useFeatureFlags } from '../hooks/useFeatureFlags';

interface BottomDockProps {
  currentRoute: string;
  navigate: (route: string) => void;
  onOpenSearch: () => void;
  isSettingsOpen?: boolean;
}

export const BottomDock: React.FC<BottomDockProps> = React.memo(({
  currentRoute,
  navigate,
  onOpenSearch,
  isSettingsOpen
}) => {
  const { flags } = useFeatureFlags();
  const isAnimationTest = flags.animation_test !== false;

  const isActive = (path: string) => {
    if (path === '/settings') return currentRoute.startsWith('/settings') || Boolean(isSettingsOpen);
    if (path === '/') return currentRoute === '/' || currentRoute === '/home';
    if (path === '/vertical') return currentRoute === '/vertical' || currentRoute === '/shorts' || currentRoute === '/vplay-vertical';
    return currentRoute.startsWith(path);
  };

  const navItems = [
    { id: 'dock-home', label: 'Trang chủ', isCustomHome: true, route: '/' },
    { id: 'dock-tv', label: 'Truyền hình', icon: Tv, route: '/live-tv' },
    { id: 'dock-event', label: 'Event', icon: Calendar, route: '/event' },
    { id: 'dock-music', label: 'Kho nhạc TV', icon: Music, route: '/music' },
    { id: 'dock-shop', label: 'Shop', icon: ShoppingBag, route: '/v-shop' },
    { id: 'dock-vduo', label: 'V-Duo (Chia đôi màn hình)', icon: Columns2, route: '/v-duo' },
    { id: 'dock-vertical', label: 'VNRT Online Vertical', icon: Smartphone, route: '/vertical' },
    { id: 'dock-news', label: 'Tin tức', icon: Megaphone, route: '/news' },
    { id: 'dock-vflow', label: 'Mạng xã hội V-Flow', icon: Radio, route: '/v-flow' },
    { id: 'dock-friends', label: 'Bạn bè & Người dùng', icon: Users, route: '/friends' },
    { id: 'dock-bet', label: 'Sàn cược Orbs VIP', icon: Coins, route: '/bet-arena' },
    { id: 'dock-flags', label: 'Feature Flags', icon: Flag, route: '/feature-flags' },
    { id: 'dock-settings', label: 'Cài đặt', icon: SettingsIcon, route: '/settings' },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 select-none">
      <motion.div 
        animate={isAnimationTest ? { y: [0, -2, 0] } : undefined}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#1E1D24]/95 dark:bg-[#1E1D24]/95 backdrop-blur-xl border border-[#34343E] shadow-2xl"
      >
        {/* Spotlight Search button */}
        <motion.button
          id="dock-spotlight-btn"
          onClick={onOpenSearch}
          title="Spotlight Search (⌘K)"
          whileHover={isAnimationTest ? { scale: 1.22, y: -6 } : undefined}
          whileTap={isAnimationTest ? { scale: 0.92 } : undefined}
          transition={{ type: 'spring', stiffness: 450, damping: 18 }}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
            currentRoute === '/search' || currentRoute === '/spotlight'
              ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/30'
              : 'text-[#9CA3AF] hover:text-white hover:bg-white/10'
          }`}
        >
          <Search className="w-5.5 h-5.5" />
        </motion.button>

        <div className="w-[1px] h-6 bg-[#3E3E4A] my-auto mx-1" />

        {/* Navigation items - enlarged icons without labels */}
        {navItems.map((item) => {
          const active = isActive(item.route);
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              id={item.id}
              onClick={() => navigate(item.route)}
              title={item.label}
              whileHover={isAnimationTest ? { scale: 1.24, y: -6 } : undefined}
              whileTap={isAnimationTest ? { scale: 0.9 } : undefined}
              transition={{ type: 'spring', stiffness: 450, damping: 18 }}
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
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
});
