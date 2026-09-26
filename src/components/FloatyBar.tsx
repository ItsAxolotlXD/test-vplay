import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'motion/react';

interface TabViewProps {
  currentRoute: string;
  navigate: (route: string, state?: any) => void;
  onOpenSearch: () => void;
  isSettingsOpen?: boolean;
}

// Reusable Tab Icon with URL and crisp SVG fallback, monochrome styling
interface TabIconProps {
  url: string;
  alt: string;
  active: boolean;
  fallbackSvg: React.ReactNode;
}

const TabIconWithFallback: React.FC<TabIconProps> = ({ url, alt, active, fallbackSvg }) => {
  const [loadError, setLoadError] = useState(false);

  if (loadError) {
    return <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 flex items-center justify-center">{fallbackSvg}</div>;
  }

  return (
    <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 flex items-center justify-center relative">
      <img
        src={url}
        alt={alt}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => setLoadError(true)}
        className={`w-full h-full object-contain transition-all select-none pointer-events-none ${
          active 
            ? 'brightness-0 invert' 
            : 'brightness-0 opacity-80'
        }`}
      />
    </div>
  );
};

// 1. Home Icon (Icons8 Home: https://static.wikia.nocookie.net/ep-deo/images/e/ee/Icons8-home-64.png/revision/latest?cb=20260925115253)
const TabHomeIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <TabIconWithFallback
    url="https://static.wikia.nocookie.net/ep-deo/images/e/ee/Icons8-home-64.png/revision/latest?cb=20260925115253"
    alt="Home"
    active={active}
    fallbackSvg={
      <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-7.5 sm:h-7.5" fill="currentColor">
        <path d="M19 9.3V4h-2.5v3.1L12 3 2 12h3v8h5v-5.5h4V20h5v-8h3l-3-2.7z" />
      </svg>
    }
  />
);

// 2. Watch / Apps Icon (Icons8 Apps: https://static.wikia.nocookie.net/ep-deo/images/7/78/Icons8-apps-90.png/revision/latest?cb=20260925115254)
const TabWatchIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <TabIconWithFallback
    url="https://static.wikia.nocookie.net/ep-deo/images/7/78/Icons8-apps-90.png/revision/latest?cb=20260925115254"
    alt="Watch"
    active={active}
    fallbackSvg={
      <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-7.5 sm:h-7.5" fill="currentColor">
        <rect x="3" y="3" width="4.8" height="4.8" rx="1.4" />
        <rect x="9.6" y="3" width="4.8" height="4.8" rx="1.4" />
        <rect x="16.2" y="3" width="4.8" height="4.8" rx="1.4" />
        <rect x="3" y="9.6" width="4.8" height="4.8" rx="1.4" />
        <rect x="9.6" y="9.6" width="4.8" height="4.8" rx="1.4" />
        <rect x="16.2" y="9.6" width="4.8" height="4.8" rx="1.4" />
        <rect x="3" y="16.2" width="4.8" height="4.8" rx="1.4" />
        <rect x="9.6" y="16.2" width="4.8" height="4.8" rx="1.4" />
        <rect x="16.2" y="16.2" width="4.8" height="4.8" rx="1.4" />
      </svg>
    }
  />
);

// 3. News / Megaphone Icon (Icons8 Megaphone: https://static.wikia.nocookie.net/ep-deo/images/f/f2/Icons8-megaphone-64.png/revision/latest?cb=20260925115252)
const TabNewsIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <TabIconWithFallback
    url="https://static.wikia.nocookie.net/ep-deo/images/f/f2/Icons8-megaphone-64.png/revision/latest?cb=20260925115252"
    alt="News"
    active={active}
    fallbackSvg={
      <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-7.5 sm:h-7.5" fill="currentColor">
        <path d="M4 10v4c0 .55.45 1 1 1h1.5l5.5 3.5V5.5L6.5 9H5c-.55 0-1 .45-1 1z" />
        <path d="M15.5 8c.55 0 1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V9c0-.55.45-1 1-1z" />
        <path d="M19 6.5c.55 0 1 .45 1 1v9c0 .55-.45 1-1 1s-1-.45-1-1v-9c0-.55.45-1 1-1z" />
        <path d="M8 15v3.2c0 .7-.55 1.3-1.25 1.3h-.5C5.55 19.5 5 18.9 5 18.2V15h3z" />
      </svg>
    }
  />
);

// 4. Settings Icon with BIGGER center hole (lỗ bên trong icon settings to hơn)
const TabSettingsIcon: React.FC<{ active?: boolean }> = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-7.5 sm:h-7.5" fill="currentColor">
    {/* Outer gear with a wide open center cutout (r=5.5) using evenodd fill rule */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 6.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z"
    />
  </svg>
);

interface NavItemConfig {
  id: string;
  label: string;
  route: string;
  renderIcon: (active: boolean) => React.ReactNode;
  checkActive: (currentRoute: string, isSettingsOpen?: boolean) => boolean;
}

export const FloatyBar: React.FC<TabViewProps> = React.memo(({
  currentRoute,
  navigate,
  onOpenSearch,
  isSettingsOpen,
}) => {
  const items: NavItemConfig[] = [
    {
      id: 'tab-home',
      label: 'Home',
      route: '/',
      renderIcon: (active) => <TabHomeIcon active={active} />,
      checkActive: (route) => route === '/' || route === '/home',
    },
    {
      id: 'tab-watch',
      label: 'Watch',
      route: '/live-tv',
      renderIcon: (active) => <TabWatchIcon active={active} />,
      checkActive: (route) => route.startsWith('/live-tv') || route.startsWith('/channels'),
    },
    {
      id: 'tab-news',
      label: 'News',
      route: '/news',
      renderIcon: (active) => <TabNewsIcon active={active} />,
      checkActive: (route) => route.startsWith('/news'),
    },
    {
      id: 'tab-settings',
      label: 'Settings',
      route: '/settings',
      renderIcon: (active) => <TabSettingsIcon active={active} />,
      checkActive: (route, settingsOpen) => route.startsWith('/settings') || Boolean(settingsOpen),
    },
  ];

  return (
    <nav
      id="tab-view-container"
      aria-label="Tab View"
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 select-none pointer-events-auto flex items-center gap-2.5 sm:gap-3.5 max-w-[96vw]"
    >
      {/* 1. Main Frosted Glass Pill Bar - Transparent 45% opacity, backdrop-blur: 5% (~2.5px) */}
      <div 
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(2.5px)',
          WebkitBackdropFilter: 'blur(2.5px)',
        }}
        className="flex items-center px-1 sm:px-1.5 py-1 sm:py-1 rounded-full border border-white/45 shadow-[0_10px_36px_rgba(0,0,0,0.25)] ring-1 ring-black/5"
      >
        {items.map((item) => {
          const active = item.checkActive(currentRoute, isSettingsOpen);

          return (
            <button
              key={item.id}
              id={item.id}
              type="button"
              onClick={() => navigate(item.route)}
              aria-label={item.label}
              title={item.label}
              className="relative w-[60px] h-[50px] sm:w-[68px] sm:h-[54px] rounded-full flex flex-col items-center justify-center transition-all cursor-pointer outline-none select-none active:scale-95"
            >
              {/* Smooth spring sliding active pill animation */}
              {active && (
                <motion.div
                  layoutId="tabViewActivePill"
                  className="absolute inset-0 rounded-full bg-[#FF7A00] shadow-[0_4px_16px_rgba(255,122,0,0.48)] z-0"
                  transition={{
                    type: 'spring',
                    stiffness: 480,
                    damping: 34,
                    mass: 0.75,
                  }}
                />
              )}

              {/* Inactive Tab hover button subtle highlight */}
              {!active && (
                <div 
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                  }}
                  className="absolute inset-0 rounded-full hover:bg-white/20 transition-colors pointer-events-none"
                />
              )}

              {/* Icon & Label (kept above sliding background) */}
              <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
                <div className={`flex items-center justify-center transition-colors duration-150 ${
                  active ? 'text-white' : 'text-[#222222]'
                }`}>
                  {item.renderIcon(active)}
                </div>
                <span
                  className={`text-[10px] sm:text-[11px] leading-none mt-0.5 tracking-tight transition-colors duration-150 ${
                    active ? 'font-bold text-white' : 'font-semibold text-[#222222]'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Separate Frosted Glass Circular Search Button - Transparent 45% opacity, backdrop-blur: 5% (~2.5px) */}
      <button
        id="tab-view-search"
        type="button"
        onClick={onOpenSearch}
        aria-label="Tìm kiếm"
        title="Tìm kiếm"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(2.5px)',
          WebkitBackdropFilter: 'blur(2.5px)',
        }}
        className="w-[50px] h-[50px] sm:w-[54px] sm:h-[54px] rounded-full flex items-center justify-center border border-white/45 shadow-[0_10px_36px_rgba(0,0,0,0.25)] ring-1 ring-black/5 hover:bg-white/60 active:scale-95 transition-all cursor-pointer text-[#222222] outline-none shrink-0"
      >
        <Search className="w-5.5 h-5.5 sm:w-6 sm:h-6 stroke-[2.4] text-[#222222]" />
      </button>
    </nav>
  );
});

// Also export with TabView alias
export const TabView = FloatyBar;
