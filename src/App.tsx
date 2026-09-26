import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { BottomDock } from './components/BottomDock';
import { FloatyBar } from './components/FloatyBar';
import { SpotlightModal } from './components/SpotlightModal';
import { CustomStreamModal } from './components/CustomStreamModal';
import { WelcomeModal } from './components/WelcomeModal';
import { SplashScreen } from './components/SplashScreen';
import { StartupVideoIntro } from './components/StartupVideoIntro';
import { OobeSetupModal, OobeSetupConfig } from './components/OobeSetupModal';
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
import { SettingsDrawer } from './components/SettingsDrawer';
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
  VStockTab,
  VHealthTab,
  VMapsTab,
  CookbookTab,
  VRideBookingTab,
  DrivingSimulatorTab,
} from './components/vapps';
import { VDuoView } from './components/vduo/VDuoView';
import ExploreVietnamTab from './components/ExploreVietnamTab';
import VplayVBoxTab from './components/VplayVBoxTab';
import VStudyTab from './components/VStudyTab';
import { VNotesView } from './components/VNotesView';
import { VPremiumView } from './components/VPremiumView';
import { MinecraftContainerEmulator } from './components/minecraft/MinecraftContainerEmulator';
import { SpatialDesignVisualizer } from './components/tools/SpatialDesignVisualizer';
import { LogoSwitcherVisualizer } from './components/tools/LogoSwitcherVisualizer';
import { WheelOfFortuneTool } from './components/tools/WheelOfFortuneTool';
import { SearchTab } from './components/SearchTab';
import { VFlowTab } from './components/vflow/VFlowTab';
import { ChatRoomView } from './components/chat/ChatRoomView';
import VplayVertical from './components/VplayVertical';
import { MusicTab } from './pages/MusicTab';
import { VShopTab } from './pages/VShopTab';
import { TabSearchProvider } from './context/TabSearchContext';
import { FloatingTabSearchBar } from './components/FloatingTabSearchBar';
import { InspectElementsOverlay } from './components/InspectElementsOverlay';
import { StatusBar } from './components/StatusBar';
import { ArrowLeft } from 'lucide-react';
import { CHANNELS_DATA } from './data/channels';
import { Channel } from './types';
import { useSettings, WALLPAPER_PRESETS } from './hooks/useSettings';
import { useFavorites } from './hooks/useFavorites';
import { useFeatureFlags } from './hooks/useFeatureFlags';
import { motion, AnimatePresence } from 'motion/react';
import { MotionEffectsLayer } from './components/motion/MotionEffectsLayer';
import { VBoardOverlay } from './components/vboard/VBoardOverlay';
import { VCursor } from './components/VCursor';
import { GlobalAnnouncementBanner } from './components/GlobalAnnouncementBanner';
import { SpecialThemeEffectsLayer } from './components/themes/SpecialThemeEffectsLayer';

export default function App() {
  const { settings, updateSetting } = useSettings();
  const currentWallpaperPreset = WALLPAPER_PRESETS.find(w => w.id === settings.appBackground);
  const customWallpaperUrl = currentWallpaperPreset 
    ? currentWallpaperPreset.url 
    : (settings.appBackground && settings.appBackground !== 'default' ? settings.appBackground : '');
  const hasCustomWallpaper = Boolean(customWallpaperUrl);
  const { flags, toggleFlag } = useFeatureFlags();
  const isAnimationTest = Boolean(flags.animation_test);
  const isVBoardEnabled = flags.experimental_vboard !== false;
  const isStatusBar = Boolean(flags.status_bar);
  const isDynamicIsland = Boolean(flags.status_bar && flags.dynamic_island);
  const isSettingsDrawer = Boolean(flags.settings_drawer);
  const isFloatyMode = Boolean(settings.floatyBar || settings.navigationMode === 'tabview');
  const isTopBarMode = settings.navigationMode === 'topbar' && !isFloatyMode;
  const { favoriteChannelIds, toggleFavoriteChannel } = useFavorites();

  // Settings Drawer State (Feature Flag: settings_drawer)
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState<boolean>(() => {
    try {
      const path = window.location.pathname || '/';
      return (path === '/settings' || path.startsWith('/settings')) && Boolean(flags.settings_drawer);
    } catch {
      return false;
    }
  });
  const lastNonSettingsRouteRef = React.useRef<string>('/');

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
    const path = window.location.pathname === '/' ? '/' : window.location.pathname;
    if ((path === '/settings' || path.startsWith('/settings')) && Boolean(flags.settings_drawer)) {
      return '/';
    }
    return path;
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

  // Startup Intro Video & Splash Screen State
  const [showStartupVideo, setShowStartupVideo] = useState<boolean>(true);
  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(false);

  // Allow replaying splash screen or startup intro video via custom events
  useEffect(() => {
    const handleReplaySplash = () => {
      setShowSplashScreen(true);
    };
    const handleReplayStartupVideo = () => {
      setShowStartupVideo(true);
      setShowSplashScreen(false);
    };
    window.addEventListener('vplay:replay_splash', handleReplaySplash);
    window.addEventListener('vplay:replay_startup_video', handleReplayStartupVideo);
    return () => {
      window.removeEventListener('vplay:replay_splash', handleReplaySplash);
      window.removeEventListener('vplay:replay_startup_video', handleReplayStartupVideo);
    };
  }, []);

  // OOBE First-time Setup Modal State
  const [isOobeOpen, setIsOobeOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vplay_oobe_completed') !== 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleOpenOobe = () => {
      setIsOobeOpen(true);
    };
    window.addEventListener('vplay:open_oobe', handleOpenOobe);
    return () => window.removeEventListener('vplay:open_oobe', handleOpenOobe);
  }, []);

  const handleCompleteOobe = (config: OobeSetupConfig) => {
    try {
      localStorage.setItem('vplay_oobe_completed', 'true');
    } catch {}
    if (config.userName) {
      updateSetting('userName', config.userName);
    }
    if (config.navStyle === 'floaty') {
      updateSetting('floatyBar', true);
    } else if (config.navStyle === 'sidebar') {
      updateSetting('navigationMode', 'sidebar');
      updateSetting('floatyBar', false);
    } else if (config.navStyle === 'topbar') {
      updateSetting('navigationMode', 'topbar');
      updateSetting('floatyBar', false);
    }
    if (config.fontFamily) {
      updateSetting('fontFamily', config.fontFamily);
    }
    setIsOobeOpen(false);
  };

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

    // Feature Flag: Settings Drawer
    // When enabled, accessing Settings opens the drawer sliding from the right instead of a tab page
    if (path === '/settings' || path.startsWith('/settings')) {
      if (isSettingsDrawer) {
        setIsSettingsDrawerOpen((prev) => !prev);
        return;
      }
    } else {
      // If navigating to any other route, close the drawer
      setIsSettingsDrawerOpen(false);
    }
    
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

  // Keep track of the last non-settings route
  useEffect(() => {
    if (currentRoute !== '/settings' && !currentRoute.startsWith('/settings')) {
      lastNonSettingsRouteRef.current = currentRoute;
    }
  }, [currentRoute]);

  // Seamless transition: If user turns ON settings_drawer while currently on /settings tab page,
  // open the drawer and restore the underlying tab!
  useEffect(() => {
    if (isSettingsDrawer && (currentRoute === '/settings' || currentRoute.startsWith('/settings'))) {
      setIsSettingsDrawerOpen(true);
      const fallback = lastNonSettingsRouteRef.current && lastNonSettingsRouteRef.current !== '/settings'
        ? lastNonSettingsRouteRef.current
        : '/';
      window.history.replaceState(null, '', fallback);
      setCurrentRoute(fallback);
    }
  }, [isSettingsDrawer, currentRoute]);

  // Global event listener to open Settings from any widget or copilot
  useEffect(() => {
    const handleOpenSettings = () => {
      if (isSettingsDrawer) {
        setIsSettingsDrawerOpen(true);
      } else {
        navigate('/settings');
      }
    };
    window.addEventListener('vplay:open_settings', handleOpenSettings);
    return () => window.removeEventListener('vplay:open_settings', handleOpenSettings);
  }, [isSettingsDrawer]);

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

    const renderSpace360App = (title: string, component: React.ReactNode) => (
      <div className="w-full max-w-6xl mx-auto space-y-4 pb-12 animate-in fade-in duration-200">
        <div className="flex items-center justify-between px-2 pt-1 pb-1">
          <button
            onClick={() => navigate('/space-360')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E1E24] hover:bg-[#2A2A34] text-xs font-semibold text-[#A1A1AA] hover:text-white transition-all cursor-pointer border border-white/5 shadow-sm"
            title="Quay lại Space 360"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-pink-400" />
            <span>Trở về Space 360</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="text-zinc-500 hover:text-zinc-300 cursor-pointer" onClick={() => navigate('/space-360')}>Space 360</span>
            <span className="text-zinc-600">/</span>
            <span className="font-semibold text-white">{title}</span>
          </div>
        </div>
        <div>{component}</div>
      </div>
    );

    const cleanRoute = currentRoute.split('?')[0].replace(/\/$/, '') || '/';

    if (cleanRoute === '/settings' || cleanRoute.startsWith('/settings')) {
      return <Settings navigate={navigate} />;
    }

    switch (cleanRoute) {
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

      case '/music':
      case '/v-music':
      case '/audio':
        return <MusicTab navigate={navigate} />;

      case '/v-shop':
      case '/shop':
      case '/vshop':
        return <VShopTab navigate={navigate} />;

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
        return renderSpace360App('Games', <VArcadeTab initialGameId={routeState?.gameId || null} />);

      case '/v-files':
      case '/v-xplore':
        return renderSpace360App('Files', <VXploreTab />);

      case '/explore-vietnam':
        return renderSpace360App('Explore Vietnam', <ExploreVietnamTab onBack={() => navigate('/space-360')} />);

      case '/v-maps':
      case '/space-360-maps':
      case '/maps':
        return renderSpace360App('Maps', <VMapsTab onBack={() => navigate('/space-360')} />);

      case '/v-box':
        return renderSpace360App('Box', <VplayVBoxTab onBack={() => navigate('/space-360')} />);

      case '/v-study':
      case '/v-learn':
        return renderSpace360App('Study', <VStudyTab onBack={() => navigate('/space-360')} />);

      case '/v-calc':
        return renderSpace360App('Calc', <VCalcTab />);

      case '/v-clock':
      case '/clock':
        return renderSpace360App('Clock', <VClockTab />);

      case '/v-phone':
      case '/phone':
        return renderSpace360App('Phone', <VPhoneTab />);

      case '/v-browser':
      case '/browser':
        return renderSpace360App('Browser', <VBrowserTab />);

      case '/v-calendar':
      case '/calendar':
        return renderSpace360App('Lịch Vạn Niên', <VCalendarTab />);

      case '/v-gallery':
      case '/gallery':
        return renderSpace360App('Gallery', <VGalleryTab />);

      case '/v-camera':
      case '/camera':
        return renderSpace360App('Camera', <VCameraTab />);

      case '/v-ticket':
      case '/ticket':
      case '/dat-ve':
        return renderSpace360App('Ticket', <VTicketTab />);

      case '/v-weather':
      case '/weather':
      case '/thoi-tiet':
        return renderSpace360App('Weather', <VWeatherTab />);

      case '/v-reminders':
        return renderSpace360App('Reminders', <VRemindersTab />);

      case '/v-notes':
        return renderSpace360App('Notes', <VNotesView />);

      case '/v-furniture':
        return renderSpace360App('Furniture', <VFurnitureTab />);

      case '/v-stock':
      case '/stock':
        return renderSpace360App('Stock', <VStockTab />);

      case '/v-health':
      case '/health':
        return renderSpace360App('Health', <VHealthTab />);

      case '/cookbook':
      case '/v-cookbook':
        return renderSpace360App('Cookbook', <CookbookTab onBack={() => navigate('/space-360')} />);

      case '/minecraft':
      case '/minecraft-gui':
      case '/minecraft-container':
      case '/mc-container':
      case '/minecraft-chest':
        return renderSpace360App('Minecraft', <MinecraftContainerEmulator />);

      case '/spatial-design':
      case '/spatial-design-visualizer':
      case '/spatial-visualizer':
        return renderSpace360App(
          'Spatial Design Visualizer',
          <SpatialDesignVisualizer onBack={() => navigate('/space-360')} navigate={navigate} />
        );

      case '/logo-switcher':
      case '/logo-switcher-visualizer':
        return renderSpace360App(
          'Logo Switcher Visualizer',
          <LogoSwitcherVisualizer onBack={() => navigate('/space-360')} navigate={navigate} />
        );

      case '/wheel-of-fortune':
      case '/wheels-of-fortune':
      case '/wheel-tool':
      case '/v-wheel':
        return renderSpace360App(
          'Wheels of Fortune',
          <WheelOfFortuneTool onBack={() => navigate('/toolbox')} navigate={navigate} />
        );

      case '/v-ride':
      case '/ride':
      case '/dat-xe':
        return renderSpace360App('Đặt xe', <VRideBookingTab onBack={() => navigate('/space-360')} navigate={navigate} />);

      case '/driving-simulator':
      case '/driving':
      case '/lai-xe':
        return renderSpace360App('Driving Simulator', <DrivingSimulatorTab onBack={() => navigate('/space-360')} navigate={navigate} />);

      case '/v-duo':
      case '/vduo':
      case '/duo':
      case '/split-screen':
        return (
          <div className="w-full h-[calc(100vh-80px)] min-h-[640px] pb-6">
            <VDuoView
              channels={channels}
              onSelectChannel={setCurrentChannel}
              navigate={navigate}
              onCloseVDuo={() => navigate('/')}
            />
          </div>
        );

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


  const isDedicatedSearchRoute = 
    currentRoute === '/search' || 
    currentRoute === '/spotlight' || 
    currentRoute === '/copilot' || 
    currentRoute === '/copilot-standalone';
  const isFloatingSearchVisible = (isStatusBar || (isTopBarMode && !isFloatyMode)) && !isDedicatedSearchRoute;

  return (
    <TabSearchProvider currentRoute={currentRoute}>
      <div className={`min-h-screen ${hasCustomWallpaper ? 'has-custom-wallpaper bg-transparent' : 'bg-[#181818]'} text-[#E0E0E6] flex font-sans selection:bg-[#C83DFF] selection:text-white relative transition-colors duration-500 ${isAnimationTest ? 'vplay-motion-active' : ''}`}>
        {/* Custom App Wallpaper Layer (Spatial Glass interactive background) */}
        {hasCustomWallpaper && (
          <div
            id="vplay-wallpaper-backdrop"
            className="fixed inset-0 -z-50 pointer-events-none bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out"
            style={{
              backgroundImage: `url("${customWallpaperUrl}")`,
              backgroundAttachment: 'fixed',
            }}
          >
            {/* Soft dark overlay for perfect text contrast while highlighting Spatial Glass blurs */}
            <div className="absolute inset-0 bg-black/30 pointer-events-none" />
          </div>
        )}

        {/* Vertical Right Status Bar & Dynamic Island (Feature Flag: status_bar & dynamic_island) */}
        {isStatusBar && (
          <StatusBar 
            isDynamicIsland={isDynamicIsland}
            navigate={navigate}
            channels={channels}
            currentChannel={currentChannel}
            onSelectChannel={(ch) => {
              setCurrentChannel(ch);
              navigate(`/live-tv?channel=${ch.slug}`);
            }}
            onBack={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                navigate('/');
              }
            }}
          />
        )}

        {/* Pre-release product watermark in bottom-left corner when status bar is active */}
        {isStatusBar && (
          <div
            id="screen-prerelease-watermark-left"
            className="fixed bottom-3 left-4 sm:bottom-4 sm:left-6 z-40 text-left pointer-events-none select-none space-y-0.5"
            style={{ fontFamily: "'Inter', 'Integer', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
          >
            <p className="text-[11px] sm:text-xs font-medium tracking-tight text-zinc-300/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] leading-tight">
              VNRT Online v26.10_devb (26A3667c) - Pre-release build product
            </p>
            <p className="text-[10px] sm:text-[11px] font-normal text-zinc-400/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] leading-tight">
              Anything you've seen here are not finished and may change in future builds
            </p>
          </div>
        )}

        {/* Background Ambient Motion Orbs & Floating Controller */}
        <MotionEffectsLayer
          isEnabled={isAnimationTest}
          onToggle={() => toggleFlag('animation_test')}
          navigate={navigate}
        />

        {/* Special App Themes Layer (Tết Dương Lịch, Tết Nguyên Đán, Christmas, Yêu Nước) */}
        <SpecialThemeEffectsLayer />

        {/* Experimental V-board iOS Virtual Keyboard System */}
        <VBoardOverlay isEnabled={isVBoardEnabled} navigate={navigate} />

        {/* Sidebar Navigation: Only rendered when Floaty bar is disabled */}
        {!isFloatyMode && (
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
            isSettingsOpen={isSettingsDrawer && isSettingsDrawerOpen}
          />
        )}

        {/* Main App Container */}
        <div className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 relative z-10 ${
          isFloatyMode
            ? 'pl-0 pb-28 sm:pb-32'
            : isTopBarMode
              ? 'pl-0 pb-24 sm:pb-28'
              : !settings.dockToSidebar 
                ? 'md:pl-0 pb-20' 
                : isEffectiveCollapsed 
                  ? 'md:pl-[80px]' 
                  : 'md:pl-[290px]'
        }`}>
          {/* TopBar Header: In Top bar mode, visible on all screens; In Sidebar mode, visible on mobile as app bar.
              When Floaty bar is active, topbar is completely replaced by Floaty bar. */}
          {!isFloatyMode && (
            <div className={`sticky top-0 z-50 w-full shrink-0 ${!isTopBarMode ? 'md:hidden' : ''}`}>
              <TopBar
                currentRoute={currentRoute}
                navigate={navigate}
                onOpenSearch={handleOpenSearch}
                onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
                onOpenCopilotWindow={() => toggleCopilotFloating(true)}
                isSettingsOpen={isSettingsDrawer && isSettingsDrawerOpen}
              />
            </div>
          )}

          {/* Dải thông báo vàng hiển thị ở bất cứ đâu với clock đếm ngược đến 00h00 16/10/2026 (Ẩn khi bật Minimalism Home Page) */}
          {(!flags.minimalism_home_page || (currentRoute !== '/' && currentRoute !== '/home')) && (
            <GlobalAnnouncementBanner onExplore={() => navigate('/')} />
          )}

          {/* Dynamic Page Content with smooth motion fade & spring transition */}
          <main className={`flex-1 w-full mx-auto transition-opacity duration-300 ease-out relative z-10 ${
            currentRoute === '/' || currentRoute === '/home' 
              ? 'p-0 max-w-none' 
              : 'px-4 sm:px-6 md:px-8 py-5 max-w-7xl'
          }`}>
            {isAnimationTest ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRoute}
                  initial={{ opacity: 0, y: 12, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.99 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full"
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            ) : (
              renderContent()
            )}
          </main>
        </div>

        {/* Floaty Bar Navigation: Active when floatyBar setting is enabled */}
        {isFloatyMode && (
          <FloatyBar
            currentRoute={currentRoute}
            navigate={navigate}
            onOpenSearch={handleOpenSearch}
            isSettingsOpen={isSettingsDrawer && isSettingsDrawerOpen}
          />
        )}

        {/* Bottom Dock Navigation (When dockToSidebar is false and not in floaty mode) */}
        {!settings.dockToSidebar && !isFloatyMode && (
          <BottomDock
            currentRoute={currentRoute}
            navigate={navigate}
            onOpenSearch={handleOpenSearch}
            isSettingsOpen={isSettingsDrawer && isSettingsDrawerOpen}
          />
        )}

        {/* Floating in-tab Search Bar (Active when Top Bar navigation is enabled) */}
        <FloatingTabSearchBar isVisible={isFloatingSearchVisible} />

        {/* In-App DOM & Elements Inspector */}
        <InspectElementsOverlay
          enabled={Boolean(settings.inspectElements)}
          onDisable={() => updateSetting('inspectElements', false)}
        />

        <CustomStreamModal
          isOpen={isCustomStreamModalOpen}
          onClose={() => setIsCustomStreamModalOpen(false)}
          onPlayCustomChannel={handlePlayCustomChannel}
          onImportPlaylist={handleImportPlaylist}
        />

        {/* Initial Startup Intro Video / VNRT Ads (Plays before splash screen) */}
        {showStartupVideo && (
          <StartupVideoIntro
            onFinish={() => {
              setShowStartupVideo(false);
              setShowSplashScreen(true);
            }}
          />
        )}

        {/* Initial Startup / Replay Splash Screen */}
        {showSplashScreen && (
          <SplashScreen
            duration={2000}
            onFinish={() => {
              setShowSplashScreen(false);
            }}
          />
        )}

        {/* Windows 11 Style OOBE First-Time Setup Modal */}
        <OobeSetupModal
          isOpen={isOobeOpen && !showSplashScreen && !showStartupVideo}
          onClose={() => setIsOobeOpen(false)}
          onComplete={handleCompleteOobe}
          initialName={settings.userName}
          initialNavStyle={settings.floatyBar ? 'floaty' : settings.navigationMode === 'sidebar' ? 'sidebar' : 'topbar'}
          initialFontFamily={settings.fontFamily}
        />

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

        {/* V-Cursor: Con trỏ chuột của VPlay thay vì device, hỗ trợ bảng màu tùy chỉnh */}
        <VCursor
          enabled={Boolean(settings.vcursorEnabled)}
          color={settings.vcursorColor || '#000000'}
          borderColor={settings.vcursorBorderColor || '#FFFFFF'}
          size={settings.vcursorSize || 24}
          glow={settings.vcursorGlow || false}
        />

        {/* Settings Drawer (Feature Flag: settings_drawer) */}
        <SettingsDrawer
          isOpen={isSettingsDrawer && isSettingsDrawerOpen}
          onClose={() => setIsSettingsDrawerOpen(false)}
          navigate={navigate}
          onOpenAsPage={() => {
            setIsSettingsDrawerOpen(false);
            toggleFlag('settings_drawer');
            navigate('/settings');
          }}
        />
      </div>
    </TabSearchProvider>
  );
}
