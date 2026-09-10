import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { BottomDock } from './components/BottomDock';
import { SpotlightModal } from './components/SpotlightModal';
import { CustomStreamModal } from './components/CustomStreamModal';
import { WelcomeModal } from './components/WelcomeModal';
import { SplashScreen } from './components/SplashScreen';
import { CrashScreen } from './components/CrashScreen';
import { Home } from './pages/Home';
import { LiveTV } from './pages/LiveTV';
import { News } from './pages/News';
import { Article } from './pages/Article';
import { Channels } from './pages/Channels';
import { Favorites } from './pages/Favorites';
import { Toolbox } from './pages/Toolbox';
import { About } from './pages/About';
import { Settings } from './pages/Settings';
import { FeatureFlags } from './pages/FeatureFlags';
import { FriendsAndPeople } from './pages/FriendsAndPeople';
import { BetArenaPage } from './pages/BetArenaPage';
import { LoyaltyPage } from './pages/LoyaltyPage';
import { CopilotTab } from './components/CopilotTab';
import { CopilotStandaloneView } from './components/CopilotStandaloneView';
import { CopilotFloatingWindow } from './components/CopilotFloatingWindow';
import { VAppsView } from './components/VAppsView';
import {
  VArcadeTab,
  VXploreTab,
  VFurnitureTab,
  VCalcTab,
  VRemindersTab,
  VClockTab,
  VPhoneTab,
  VBrowserTab,
  VCalendarTab,
  VGalleryTab,
  VCameraTab,
  VTicketTab,
  VWeatherTab,
} from './components/vapps';
import ExploreVietnamTab from './components/ExploreVietnamTab';
import VplayVBoxTab from './components/VplayVBoxTab';
import VStudyTab from './components/VStudyTab';
import { VNotesView } from './components/VNotesView';
import { VPremiumView } from './components/VPremiumView';
import { MinecraftContainerEmulator } from './components/minecraft/MinecraftContainerEmulator';
import { SearchTab } from './components/SearchTab';
import { VFlowTab } from './components/vflow/VFlowTab';
import { ChatRoomView } from './components/chat/ChatRoomView';
import { VplayOSView } from './components/VplayOSView';
import VplayVertical from './components/VplayVertical';
import { CHANNELS_DATA } from './data/channels';
import { Channel } from './types';
import { useSettings } from './hooks/useSettings';
import { useFavorites } from './hooks/useFavorites';
import { useFeatureFlags } from './hooks/useFeatureFlags';

export default function App() {
  const { settings } = useSettings();
  const { flags } = useFeatureFlags();
  const isTopBarMode = settings.navigationMode 
    ? settings.navigationMode === 'topbar' 
    : (flags.top_bar !== false);
  const { favoriteChannelIds, toggleFavoriteChannel } = useFavorites();
  // Security & Construction Gate State: saved in localStorage so the device only requires entering password once
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem('waves_device_unlocked') === 'true' || sessionStorage.getItem('waves_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [isCrashed, setIsCrashed] = useState<boolean>(false);
  const [crashReason, setCrashReason] = useState<string>('');

  // Floating Copilot Movable Window State
  const [isCopilotFloating, setIsCopilotFloating] = useState<boolean>(() => {
    try {
      return localStorage.getItem('waves_copilot_floating') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCopilotFloating = (forceState?: boolean) => {
    setIsCopilotFloating((prev) => {
      const next = typeof forceState === 'boolean' ? forceState : !prev;
      try {
        localStorage.setItem('waves_copilot_floating', String(next));
      } catch {}
      return next;
    });
  };

  // Navigation Route State (supports browser pathname or internal state)
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname === '/' ? '/' : window.location.pathname;
  });
  const [routeState, setRouteState] = useState<any>(null);

  // Channels State (base channels + imported channels from localStorage)
  const [channels, setChannels] = useState<Channel[]>(() => {
    const saved = localStorage.getItem('waves_custom_channels');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...CHANNELS_DATA, ...parsed];
      } catch {
        return CHANNELS_DATA;
      }
    }
    return CHANNELS_DATA;
  });

  // Current Active Channel for Live TV Player
  const [currentChannel, setCurrentChannel] = useState<Channel>(() => {
    // Check if URL has ?channel=slug
    const urlParams = new URLSearchParams(window.location.search);
    const channelSlug = urlParams.get('channel');
    if (channelSlug) {
      const matched = CHANNELS_DATA.find((c) => c.slug === channelSlug);
      if (matched) return matched;
    }
    return CHANNELS_DATA[0];
  });

  // Splash Screen State
  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(true);

  // Allow replaying splash screen from any menu / component via custom event
  useEffect(() => {
    const handleReplaySplash = () => {
      setShowSplashScreen(true);
    };
    window.addEventListener('vplay:replay_splash', handleReplaySplash);
    return () => window.removeEventListener('vplay:replay_splash', handleReplaySplash);
  }, []);

  // Modals state
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [isCustomStreamModalOpen, setIsCustomStreamModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('waves_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('waves_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Determine effective sidebar width for page adaptation
  const isEffectiveCollapsed = settings.autoHideSidebar || isSidebarCollapsed;

  // Search opener logic respecting settings.mergeSpotlightToCopilot:
  // When mergeSpotlightToCopilot is true -> navigates to Copilot
  // When mergeSpotlightToCopilot is false -> opens Search as a dedicated Tab (/search)
  const handleOpenSearch = () => {
    if (settings.mergeSpotlightToCopilot) {
      navigate('/copilot');
    } else {
      navigate('/search');
    }
  };

  // Global keyboard shortcut Ctrl/Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.mergeSpotlightToCopilot]);

  // Navigation handler
  const navigate = (path: string, state?: any) => {
    setRouteState(state);
    
    // Parse query params if any
    if (path.includes('?')) {
      const [baseRoute, query] = path.split('?');
      const params = new URLSearchParams(query);
      const chSlug = params.get('channel');
      if (chSlug) {
        const matched = channels.find((c) => c.slug === chSlug);
        if (matched) setCurrentChannel(matched);
      }
      window.history.pushState(null, '', path);
      setCurrentRoute(baseRoute);
    } else {
      window.history.pushState(null, '', path);
      setCurrentRoute(path);
    }

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const chSlug = params.get('channel');
      if (chSlug) {
        const matched = channels.find((c) => c.slug === chSlug);
        if (matched) setCurrentChannel(matched);
      }
      setCurrentRoute(path);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [channels]);

  // Handle playing a custom single channel
  const handlePlayCustomChannel = (newChannel: Channel) => {
    setChannels((prev) => {
      const exists = prev.some((c) => c.id === newChannel.id);
      if (exists) return prev;
      const updated = [newChannel, ...prev];
      return updated;
    });
    setCurrentChannel(newChannel);
    navigate(`/live-tv?channel=${newChannel.slug}`);
  };

  // Handle importing a list of M3U channels
  const handleImportPlaylist = (importedList: Channel[]) => {
    setChannels((prev) => {
      const updated = [...importedList, ...prev];
      try {
        localStorage.setItem('waves_custom_channels', JSON.stringify(importedList));
      } catch {}
      return updated;
    });
    if (importedList.length > 0) {
      setCurrentChannel(importedList[0]);
      navigate(`/live-tv?channel=${importedList[0].slug}`);
    }
  };

  // Render Page Content based on currentRoute
  const renderContent = () => {
    // Route matching for news detail: /news/:slug
    if (currentRoute.startsWith('/news/')) {
      const slug = currentRoute.replace('/news/', '');
      return <Article slug={slug} navigate={navigate} />;
    }

    switch (currentRoute) {
      case '/':
      case '/home':
        return (
          <Home
            navigate={navigate}
            onSelectChannel={setCurrentChannel}
            channels={channels}
          />
        );

      case '/live-tv':
        return (
          <LiveTV
            currentChannel={currentChannel}
            onSelectChannel={setCurrentChannel}
            channels={channels}
            onOpenCustomStreamModal={() => setIsCustomStreamModalOpen(true)}
          />
        );

      case '/vertical':
      case '/vplay-vertical':
      case '/shorts':
      case '/vertical-tv':
        return (
          <VplayVertical
            channels={channels}
            onBack={() => navigate('/')}
            setActiveTab={(tab) => {
              if (tab === 'live') navigate('/live-tv');
              else if (tab === 'home') navigate('/');
              else navigate(`/${tab}`);
            }}
          />
        );

      case '/news':
        return <News navigate={navigate} />;

      case '/search':
      case '/spotlight':
      case '/tim-kiem':
      case '/portal':
      case '/chuyen-trang':
        return (
          <SearchTab
            navigate={navigate}
            onSelectChannel={setCurrentChannel}
            channels={channels}
            routeState={routeState}
          />
        );

      case '/v-flow':
      case '/vflow':
      case '/flow':
      case '/social':
        return (
          <VFlowTab
            navigate={navigate}
            onSelectChannel={setCurrentChannel}
            routeState={routeState}
          />
        );

      case '/copilot':
      case '/copilot-standalone':
        return (
          <CopilotTab
            channels={channels}
            onSelectChannel={(ch) => {
              setCurrentChannel(ch);
              navigate(`/live-tv?channel=${ch.slug}`);
            }}
            onBack={() => navigate('/')}
            onDetachWindow={() => toggleCopilotFloating(true)}
            isDetached={isCopilotFloating}
            navigate={navigate}
          />
        );

      case '/v-arcade':
      case '/v-games':
        return <VArcadeTab initialGameId={routeState?.gameId || null} />;

      case '/v-files':
      case '/v-xplore':
        return <VXploreTab />;

      case '/explore-vietnam':
        return <ExploreVietnamTab />;

      case '/v-box':
        return <VplayVBoxTab />;

      case '/v-study':
      case '/v-learn':
        return <VStudyTab />;

      case '/v-calc':
        return <VCalcTab />;

      case '/v-clock':
      case '/clock':
        return <VClockTab />;

      case '/v-phone':
      case '/phone':
        return <VPhoneTab />;

      case '/v-browser':
      case '/browser':
        return <VBrowserTab />;

      case '/v-calendar':
      case '/calendar':
        return <VCalendarTab />;

      case '/v-gallery':
      case '/gallery':
        return <VGalleryTab />;

      case '/v-camera':
      case '/camera':
        return <VCameraTab />;

      case '/v-ticket':
      case '/ticket':
      case '/dat-ve':
        return <VTicketTab />;

      case '/v-weather':
      case '/weather':
      case '/thoi-tiet':
        return <VWeatherTab />;

      case '/v-reminders':
        return <VRemindersTab />;

      case '/v-notes':
        return <VNotesView />;

      case '/v-furniture':
        return <VFurnitureTab />;

      case '/v-space':
      case '/v-apps':
      case '/space-360':
        return (
          <VAppsView
            navigate={navigate}
            initialAppId={routeState?.appId || 'v_arcade'}
            selectedGameId={routeState?.gameId || null}
          />
        );

      case '/vplayos':
      case '/vplay-os':
      case '/ipados':
      case '/tablet':
        return (
          <VplayOSView
            navigate={navigate}
            onSelectChannel={setCurrentChannel}
            channels={channels}
          />
        );

      case '/v-premium':
        return (
          <VPremiumView
            initialSubTab={routeState?.subTab || 'vbank'}
          />
        );

      case '/channels':
        return (
          <Channels
            channels={channels}
            onSelectChannel={setCurrentChannel}
            navigate={navigate}
            onOpenCustomStreamModal={() => setIsCustomStreamModalOpen(true)}
          />
        );

      case '/favorites':
        return (
          <Favorites
            channels={channels}
            onSelectChannel={setCurrentChannel}
            navigate={navigate}
          />
        );

      case '/friends':
      case '/people':
      case '/friends-and-people':
        return (
          <FriendsAndPeople
            channels={channels}
            onSelectChannel={setCurrentChannel}
            navigate={navigate}
          />
        );

      case '/chat':
      case '/chat-room':
      case '/phong-chat':
      case '/discord':
        return <ChatRoomView />;

      case '/loyalty':
      case '/bet-arena':
      case '/orbs-bet':
      case '/sancuoc':
      case '/san-cuoc':
      case '/casino':
      case '/bet':
        return (
          <LoyaltyPage
            navigate={navigate}
            initialTab={routeState?.tab || (currentRoute === '/loyalty' ? 'rewards' : 'arena')}
          />
        );

      case '/toolbox':
        return (
          <Toolbox
            initialTab={routeState?.tab || 'safe-area'}
            onSelectChannel={setCurrentChannel}
            navigate={navigate}
          />
        );

      case '/minecraft':
      case '/minecraft-gui':
      case '/minecraft-container':
      case '/mc-container':
      case '/minecraft-chest':
        return (
          <VAppsView
            navigate={navigate}
            initialAppId="v_minecraft"
          />
        );

      case '/about':
        return <About />;

      case '/settings':
        return <Settings navigate={navigate} />;

      case '/feature-flags':
      case '/flags':
        return <FeatureFlags navigate={navigate} />;

      default:
        return (
          <Home
            navigate={navigate}
            onSelectChannel={setCurrentChannel}
            channels={channels}
          />
        );
    }
  };

  // Handle unlocking the website
  const handleUnlock = () => {
    setIsUnlocked(true);
    try {
      localStorage.setItem('waves_device_unlocked', 'true');
      sessionStorage.setItem('waves_unlocked', 'true');
    } catch {}
  };

  // Handle crashing the website
  const handleCrash = (reason: string) => {
    setIsCrashed(true);
    setCrashReason(reason);
    try {
      localStorage.removeItem('waves_device_unlocked');
      sessionStorage.removeItem('waves_unlocked');
    } catch {}
  };

  // If website is in crashed state, render fatal crash screen
  if (isCrashed) {
    return <CrashScreen reason={crashReason || 'FATAL_SYSTEM_SHUTDOWN'} />;
  }

  // If in Standalone Copilot Page Mode (takes over full-screen like a separate standalone app)
  if (currentRoute === '/copilot-standalone') {
    return (
      <CopilotStandaloneView
        onOptOut={() => navigate('/copilot')}
        channels={channels}
        onSelectChannel={(ch) => {
          setCurrentChannel(ch);
          navigate(`/live-tv?channel=${ch.slug}`);
        }}
        navigate={navigate}
      />
    );
  }

  // If in VplayOS Full Screen Mode (True full-screen OS experience without outer web chrome)
  if (
    currentRoute === '/vplayos' ||
    currentRoute === '/vplay-os' ||
    currentRoute === '/ipados' ||
    currentRoute === '/tablet'
  ) {
    return (
      <VplayOSView
        navigate={navigate}
        onSelectChannel={setCurrentChannel}
        channels={channels}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#1B0912] text-[#E0E0E6] flex font-sans selection:bg-[#C83DFF] selection:text-white relative">
      {/* Sidebar Navigation (Desktop + Mobile Drawer) */}
      <Sidebar
        currentRoute={currentRoute}
        routeState={routeState}
        navigate={navigate}
        onOpenSearch={handleOpenSearch}
        onSelectChannel={setCurrentChannel}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main App Container */}
      <div className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ${
        isTopBarMode
          ? 'pl-0'
          : !settings.dockToSidebar 
            ? 'md:pl-0 pb-20' 
            : isEffectiveCollapsed 
              ? 'md:pl-[80px]' 
              : 'md:pl-[290px]'
      }`}>
        {/* TopBar Header: In Top bar mode, visible on all screens; In Sidebar mode, visible on mobile as app bar */}
        <div className={!isTopBarMode ? 'md:hidden' : ''}>
          <TopBar
            currentRoute={currentRoute}
            navigate={navigate}
            onOpenSearch={handleOpenSearch}
            onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
            onOpenCopilotWindow={() => toggleCopilotFloating(true)}
          />
        </div>

        {/* Dynamic Page Content with smooth fade */}
        <main className={`flex-1 w-full mx-auto transition-opacity duration-300 ease-out ${
          currentRoute === '/' || currentRoute === '/home' 
            ? 'p-0 max-w-none' 
            : 'px-4 sm:px-6 md:px-8 py-5 max-w-7xl'
        }`}>
          {renderContent()}
        </main>
      </div>

      {/* Bottom Dock Navigation (When dockToSidebar is false) */}
      {!settings.dockToSidebar && (
        <BottomDock
          currentRoute={currentRoute}
          navigate={navigate}
          onOpenSearch={handleOpenSearch}
        />
      )}

      <CustomStreamModal
        isOpen={isCustomStreamModalOpen}
        onClose={() => setIsCustomStreamModalOpen(false)}
        onPlayCustomChannel={handlePlayCustomChannel}
        onImportPlaylist={handleImportPlaylist}
      />

      {/* Initial Startup / Replay Splash Screen */}
      {showSplashScreen && (
        <SplashScreen
          onFinish={() => {
            setShowSplashScreen(false);
          }}
        />
      )}

      {/* Startup / Refresh Welcome Modal */}
      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
      />

      {/* Detached Movable Copilot Window */}
      <CopilotFloatingWindow
        isOpen={isCopilotFloating}
        onClose={() => toggleCopilotFloating(false)}
        onDockBack={() => {
          toggleCopilotFloating(false);
          navigate('/copilot');
        }}
        onSelectChannel={(ch) => {
          setCurrentChannel(ch);
          navigate(`/live-tv?channel=${ch.slug}`);
        }}
        channels={channels}
        navigate={navigate}
      />
    </div>
  );
}
