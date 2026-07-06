import React, { useState, useEffect, useRef } from "react";
import { 
  Tv, 
  Sparkles, 
  Check, 
  Download, 
  Plus, 
  Grid, 
  Layers, 
  Info, 
  Settings, 
  RefreshCw,
  HelpCircle,
  Volume2,
  VolumeX,
  Search,
  ExternalLink,
  Sliders,
  Bell,
  Database,
  Trash2,
  Cpu,
  Moon,
  Monitor,
  AlertCircle,
  Activity,
  Terminal
} from "lucide-react";

interface MacMenuBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeSettingSection: string | null;
  setActiveSettingSection: (section: string | null) => void;
  isVIntelligenceActive: boolean;
  reimaginedSearchOpen: boolean;
  setReimaginedSearchOpen: (open: boolean) => void;
  setShowAboutModal: (show: boolean) => void;
  setShowCustomModal: (show: boolean) => void;
  exportChannelsToM3u8: () => void;
  handleOpenMultiviewSelector: () => void;
  handleTogglePictureInPicture: () => void;
  isMaterialDesignActive: boolean;
  showClock: boolean;
  toggleShowClock: () => void;
  volume: number;
  setVolume: (vol: number) => void;
  muted: boolean;
  setMuted: (mute: boolean) => void;
  selectedChannel: any;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isDropdownIntelligenceActive?: boolean;
  vIntelQuery?: string;
  setVIntelQuery?: (val: string) => void;
  isVIntelLoading?: boolean;
  vIntelHistory?: { role: "user" | "model"; text: string }[];
  handleSendVIntelMsg?: (suggestion?: string) => void;
  isAutoHideMenuBarActive?: boolean;
}

export default function MacMenuBar({
  activeTab,
  setActiveTab,
  activeSettingSection,
  setActiveSettingSection,
  isVIntelligenceActive,
  reimaginedSearchOpen,
  setReimaginedSearchOpen,
  setShowAboutModal,
  setShowCustomModal,
  exportChannelsToM3u8,
  handleOpenMultiviewSelector,
  handleTogglePictureInPicture,
  isMaterialDesignActive,
  showClock,
  toggleShowClock,
  volume,
  setVolume,
  muted,
  setMuted,
  selectedChannel,
  favorites,
  toggleFavorite,
  isDropdownIntelligenceActive = false,
  vIntelQuery = "",
  setVIntelQuery,
  isVIntelLoading = false,
  vIntelHistory = [],
  handleSendVIntelMsg,
  isAutoHideMenuBarActive = false
}: MacMenuBarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [timeStr, setTimeStr] = useState("");
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
  // Custom macOS States
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [showDebugScreen, setShowDebugScreen] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [showSystemReport, setShowSystemReport] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic window resolution state for Minecraft F3 debug screen
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight });

  // Storage Stats (dynamically read from localStorage size)
  const [storageStats, setStorageStats] = useState({
    totalBytes: 0,
    favoritesCount: 0,
    customChannelsCount: 0,
    hasHistory: false
  });

  const menuRef = useRef<HTMLDivElement>(null);

  // States for Auto-hide and FPS
  const [isMenuBarVisible, setIsMenuBarVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [fps, setFps] = useState(60.0);

  // Fluctuating FPS for realistic debug screen
  useEffect(() => {
    if (!showDebugScreen) return;
    const interval = setInterval(() => {
      setFps(+(59.4 + Math.random() * 1.8).toFixed(1));
    }, 800);
    return () => clearInterval(interval);
  }, [showDebugScreen]);

  // MenuBar Auto-hide timer logic
  useEffect(() => {
    if (!isAutoHideMenuBarActive) {
      setIsMenuBarVisible(true);
      return;
    }

    let timer: any = null;

    if (isHovered || activeDropdown !== null) {
      setIsMenuBarVisible(true);
    } else {
      // Start 5 second timer to hide
      timer = setTimeout(() => {
        setIsMenuBarVisible(false);
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAutoHideMenuBarActive, isHovered, activeDropdown]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Window Resize Listener for Minecraft Debug
  useEffect(() => {
    const handleResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync Local Clock for macOS top-right corner
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };
      setTimeStr(now.toLocaleString('en-US', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Storage Stats
  const updateStorageStats = () => {
    let size = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        size += (localStorage.getItem(key) || '').length;
      }
    }
    
    // Favorites count
    let favCount = 0;
    try {
      const favs = localStorage.getItem("vplay_favorites");
      if (favs) favCount = JSON.parse(favs).length;
    } catch (e) {}

    // Custom channels count
    let customCount = 0;
    try {
      const customs = localStorage.getItem("vplay_custom_channels");
      if (customs) customCount = JSON.parse(customs).length;
    } catch (e) {}

    setStorageStats({
      totalBytes: size,
      favoritesCount: favCount,
      customChannelsCount: customCount,
      hasHistory: !!localStorage.getItem("vplay_search_history")
    });
  };

  useEffect(() => {
    updateStorageStats();
  }, [showStorageModal, showDebugScreen, activeDropdown]);

  const toggleDropdown = (menuName: string) => {
    if (activeDropdown === menuName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menuName);
    }
  };

  const handleMenuHover = (menuName: string) => {
    if (activeDropdown !== null) {
      setActiveDropdown(menuName);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Helper actions
  const handleClearFavorites = () => {
    localStorage.removeItem("vplay_favorites");
    updateStorageStats();
    showToast("Cleared favorites storage successfully!");
  };

  const handleClearCustomChannels = () => {
    localStorage.removeItem("vplay_custom_channels");
    updateStorageStats();
    showToast("Cleared custom channels successfully!");
  };

  const handleResetSettings = () => {
    localStorage.removeItem("vplay_app_settings");
    localStorage.removeItem("vplay_settings_appearance");
    updateStorageStats();
    showToast("Reset all system preferences. Reloading...");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  // Human friendly tab display name matching active tab
  const getTabDisplayName = () => {
    if (activeTab === "home") return "Home";
    if (activeTab === "live") return "Live TV";
    if (activeTab === "search") return "Search";
    if (activeTab === "settings") {
      if (activeSettingSection === "plugin_store") return "Plugin Store";
      if (activeSettingSection === "appearance") return "Appearance";
      if (activeSettingSection === "profile") return "Account";
      if (activeSettingSection === "accessibility") return "Accessibility";
      if (activeSettingSection === "experimental") return "Experimental";
      return "Settings";
    }
    return "Vplay";
  };

  const isFav = selectedChannel ? favorites.includes(selectedChannel.id) : false;

  // Visual storage helper variables
  const storagePercentage = Math.min(100, Math.max(3, (storageStats.totalBytes / (10 * 1024 * 1024)) * 100));

  return (
    <>
      {/* MINECRAFT F3 STYLE DEBUG SCREEN */}
      {showDebugScreen && (
        <div className="fixed top-[50px] left-4 z-[150] bg-black/90 backdrop-blur-xl border border-white/20 p-4 rounded-xl font-mono text-[11px] leading-relaxed text-white text-left space-y-1.5 shadow-2xl max-w-sm sm:max-w-md select-text pointer-events-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-white">
            <span className="font-bold flex items-center gap-1"><Terminal className="w-3.5 h-3.5 text-white" /> VPLAY HIGH-DENSITY DEBUG SCREEN (F3 Mode)</span>
            <button 
              onClick={() => setShowDebugScreen(false)}
              className="text-white/60 hover:text-white px-1.5 py-0.5 hover:bg-white/10 rounded text-xs transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-white/50 tracking-wider">I. System Environment</div>
            <div className="pl-2 space-y-0.5">
              <div><span className="text-white/60">Build Version:</span> v3.12-stable (Production bundle)</div>
              <div><span className="text-white/60">Host Stack:</span> React 18 / Vite / TailwindCSS</div>
              <div><span className="text-white/60">Screen Viewport:</span> {viewport.w}x{viewport.h} (DPR Scale: {window.devicePixelRatio || 1})</div>
              <div><span className="text-white/60">Live Frame Rate:</span> <span className="text-white font-bold">{fps} FPS</span> (stable loop)</div>
              <div><span className="text-white/60">Client Language:</span> {navigator.language || "vi-VN"}</div>
              <div><span className="text-white/60">Network Latency:</span> {navigator.onLine ? "CONNECTED (ONLINE)" : "DISCONNECTED (OFFLINE)"}</div>
              <div><span className="text-white/60">User Identity:</span> tvbabinh1@gmail.com</div>
            </div>
          </div>

          <div className="border-t border-white/10 my-1.5" />

          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-white/50 tracking-wider">II. Application State</div>
            <div className="pl-2 space-y-0.5">
              <div><span className="text-white/60">Active Router Tab:</span> {activeTab.toUpperCase()} {activeSettingSection ? `(${activeSettingSection.toUpperCase()})` : ""}</div>
              <div><span className="text-white/60">Stream Target:</span> {selectedChannel ? `${selectedChannel.name} [ID: ${selectedChannel.id}]` : "None (Idle)"}</div>
              {selectedChannel && (
                <>
                  <div className="truncate"><span className="text-white/60">M3U8 Stream URL:</span> {selectedChannel.url || "N/A"}</div>
                  <div><span className="text-white/60">Stream Category:</span> {selectedChannel.category || "General"}</div>
                </>
              )}
              <div><span className="text-white/60">Sound Volume:</span> {muted ? "MUTED" : `${Math.round(volume * 100)}%`}</div>
              <div><span className="text-white/60">Local Database:</span> Durable Store (Local Storage Sync)</div>
              <div><span className="text-white/60">Database Payload:</span> {storageStats.totalBytes.toLocaleString()} bytes ({(storageStats.totalBytes / 1024).toFixed(3)} KB)</div>
              <div><span className="text-white/60">Favorites Count:</span> {favorites.length} channels</div>
            </div>
          </div>

          <div className="border-t border-white/10 my-1.5" />

          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-white/50 tracking-wider">III. Core Feature Flags</div>
            <div className="pl-2 space-y-0.5">
              <div><span className="text-white/60">Material Design 3:</span> {isMaterialDesignActive ? "ENABLED" : "DISABLED"}</div>
              <div><span className="text-white/60">Dropdown Intelligence:</span> {isDropdownIntelligenceActive ? "ACTIVE" : "INACTIVE"}</div>
              <div><span className="text-white/60">MenuBar Auto-hide:</span> {isAutoHideMenuBarActive ? "ON (5s timeout)" : "OFF"}</div>
              <div><span className="text-white/60">Server Ingress Port:</span> 3000 (External Proxy Node)</div>
            </div>
          </div>

          <div className="text-[9px] text-white/40 pt-1 border-t border-white/5">
            Press ✕ or click "Debug screen" in Help menu to close debug panel.
          </div>
        </div>
      )}

      {/* Dynamic Toast feedback */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[200] bg-black/90 text-white border border-white/10 px-4 py-2 rounded-lg text-xs flex items-center gap-2 shadow-2xl">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mac OS SLEEP OVERLAY SCREEN */}
      {isSleeping && (
        <div 
          onClick={() => {
            setIsSleeping(false);
            showToast("Waking up Vplay display...");
          }}
          className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center cursor-pointer select-none"
        >
          <div className="text-center space-y-4 animate-pulse">
            <Moon className="w-12 h-12 text-white/20 mx-auto" />
            <p className="text-neutral-500 text-xs tracking-widest uppercase font-mono">Display is in Sleep mode</p>
            <p className="text-neutral-600 text-[11px]">Click anywhere to wake up Vplay</p>
          </div>
        </div>
      )}

      {/* SYSTEM REPORT DIALOG MODAL */}
      {showSystemReport && (
        <div className="fixed inset-0 z-[160] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121118]/95 border border-white/10 w-full max-w-md rounded-xl overflow-hidden shadow-2xl font-sans text-white text-left">
            <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-sm text-neutral-200">System Information Report</span>
              </div>
              <button 
                onClick={() => setShowSystemReport(false)}
                className="text-neutral-400 hover:text-white font-mono text-sm px-1.5 py-0.5 rounded hover:bg-white/10"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs text-neutral-300">
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-500 font-medium">Model Identity</span>
                  <span className="font-mono text-white">Vplay Premium (macOS Edition)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-500 font-medium">Framework Node</span>
                  <span className="font-mono text-white">React 18 + Vite (Sandboxed Container)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-500 font-medium">Session Operator</span>
                  <span className="font-mono text-white">tvbabinh1@gmail.com</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-500 font-medium">Render Engine</span>
                  <span className="font-mono text-emerald-400">Tailwind CSS + Motion React</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-500 font-medium">Memory Host Port</span>
                  <span className="font-mono text-indigo-300">Active Container reverse proxy :3000</span>
                </div>
              </div>

              <div className="bg-indigo-950/20 border border-indigo-500/10 rounded-lg p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Real-time Health Status</span>
                </div>
                <p className="text-[11px] text-neutral-400">All core modules (video player engine, custom m3u aggregator, cache controller) are functional with 0 critical alarms detected.</p>
              </div>
            </div>
            <div className="px-4 py-3 bg-white/5 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowSystemReport(false)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold px-4 py-1.5 rounded-lg transition-colors text-xs"
              >
                Dismiss Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STORAGE MANAGEMENT MODAL (Help Dropdown option) */}
      {showStorageModal && (
        <div className="fixed inset-0 z-[160] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121118]/95 border border-white/15 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl font-sans text-white text-left">
            <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm text-neutral-200">Vplay Storage Management</span>
              </div>
              <button 
                onClick={() => setShowStorageModal(false)}
                className="text-neutral-400 hover:text-white font-mono text-sm px-1.5 py-0.5 rounded hover:bg-white/10"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Storage distribution progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Local Cache Allocation</span>
                  <span className="text-emerald-400">{(storageStats.totalBytes / 1024).toFixed(2)} KB / 10 MB Max</span>
                </div>
                <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden flex">
                  <div 
                    style={{ width: `${Math.min(100, Math.max(8, (storageStats.favoritesCount * 12)))}%` }} 
                    className="bg-rose-500 h-full" 
                    title="Favorites Cache"
                  />
                  <div 
                    style={{ width: `${Math.min(100, Math.max(12, (storageStats.customChannelsCount * 24)))}%` }} 
                    className="bg-indigo-500 h-full" 
                    title="Custom Channels Cache"
                  />
                  <div 
                    style={{ width: '15%' }} 
                    className="bg-amber-500 h-full" 
                    title="System Prefs Cache"
                  />
                </div>
                <div className="flex items-center gap-4 text-[10px] text-neutral-400 pt-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> Favorites ({storageStats.favoritesCount})
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" /> Custom ({storageStats.customChannelsCount})
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> System Config
                  </span>
                </div>
              </div>

              {/* Maintenance Tools */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Database & Preferences Maintenance</h3>
                
                <div className="space-y-2">
                  {/* Clean Favorites */}
                  <div className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-all text-xs">
                    <div>
                      <h4 className="font-semibold text-white/95">Favorites Registry Cache</h4>
                      <p className="text-[10px] text-neutral-400">Delete favorite channel metadata to refresh custom live feeds.</p>
                    </div>
                    <button 
                      onClick={handleClearFavorites}
                      className="bg-rose-600/20 hover:bg-rose-600 hover:text-white text-rose-300 border border-rose-500/30 px-3 py-1 rounded-md transition-all font-semibold"
                    >
                      Clear Favorites
                    </button>
                  </div>

                  {/* Clean Custom Channels */}
                  <div className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-all text-xs">
                    <div>
                      <h4 className="font-semibold text-white/95">Custom Channels Aggregator</h4>
                      <p className="text-[10px] text-neutral-400">Purge manually uploaded channel streams, custom M3u8 lists.</p>
                    </div>
                    <button 
                      onClick={handleClearCustomChannels}
                      className="bg-rose-600/20 hover:bg-rose-600 hover:text-white text-rose-300 border border-rose-500/30 px-3 py-1 rounded-md transition-all font-semibold"
                    >
                      Clear Streams
                    </button>
                  </div>

                  {/* Reset Settings */}
                  <div className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-all text-xs">
                    <div>
                      <h4 className="font-semibold text-white/95">System Environment Defaults</h4>
                      <p className="text-[10px] text-neutral-400">Restore default audio volume, screen layout and color theme presets.</p>
                    </div>
                    <button 
                      onClick={handleResetSettings}
                      className="bg-amber-600/20 hover:bg-amber-600 hover:text-white text-amber-300 border border-amber-500/30 px-3 py-1 rounded-md transition-all font-semibold"
                    >
                      Reset Defaults
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-white/5 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowStorageModal(false)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold px-4 py-1.5 rounded-lg transition-colors text-xs"
              >
                Close Storage Utility
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invisible hover trigger bar at the very top of screen when menu is hidden */}
      {isAutoHideMenuBarActive && (
        <div 
          className="fixed top-0 inset-x-0 h-[6px] z-[99] bg-transparent cursor-default"
          onMouseEnter={() => setIsHovered(true)}
        />
      )}

      {/* CORE MENU BAR CONTAINER (Reverted back to: height 40px, translucent dark-glass style bg-white/10 with white text) */}
      <div 
        ref={menuRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`h-[40px] flex items-center justify-between text-[13px] bg-white/10 backdrop-blur-[50px] text-white px-4 select-none border-b border-white/10 fixed top-0 inset-x-0 z-[100] font-sans font-medium shadow-md transition-all duration-500 ease-in-out transform-gpu ${
          isAutoHideMenuBarActive 
            ? isMenuBarVisible 
              ? "translate-y-0 opacity-100" 
              : "-translate-y-full opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100"
        }`}
      >
        {/* Left side menus */}
        <div className="flex items-center gap-1.5">
          {/* Brand/Apple style Logo Menu */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("brand")}
              onMouseEnter={() => handleMenuHover("brand")}
              className={`px-2.5 py-1.5 rounded-[4px] hover:bg-white/10 flex items-center justify-center transition-colors cursor-default ${
                activeDropdown === "brand" ? "bg-white/15 text-white" : ""
              }`}
            >
              <img 
                src="https://static.wikia.nocookie.net/ftv/images/a/ab/Imagexvxvz.png/revision/latest/scale-to-width-down/1000?cb=20260429082350&path-prefix=vi" 
                alt="Vplay Brand Logo"
                referrerPolicy="no-referrer"
                className="h-[16px] w-auto object-contain brightness-110 saturate-[1.1] filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
              />
            </button>

            {activeDropdown === "brand" && (
              <div className="absolute left-0 mt-1 w-64 rounded-lg bg-[#121118]/95 backdrop-blur-[40px] border border-white/15 shadow-2xl z-[110] py-1.5 text-white overflow-hidden text-left">
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    setShowAboutModal(true);
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center gap-2 transition-colors cursor-default"
                >
                  <Info className="w-3.5 h-3.5 opacity-80 text-neutral-300" />
                  <span>About Vplay</span>
                </button>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    setShowSystemReport(true);
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center gap-2 transition-colors cursor-default"
                >
                  <Cpu className="w-3.5 h-3.5 opacity-80 text-neutral-300" />
                  <span>System Report...</span>
                </button>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    showToast("Checking for updates... All channels are currently running version v3.12 (Up to date).");
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center justify-between transition-colors cursor-default"
                >
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 opacity-80 text-neutral-300" />
                    <span>Software Update...</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-indigo-400 mr-1 animate-pulse" />
                </button>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    setActiveTab("settings");
                    setActiveSettingSection("plugin_store");
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center gap-2 transition-colors cursor-default"
                >
                  <Sparkles className="w-3.5 h-3.5 opacity-80 text-neutral-300" />
                  <span>Vplay App Store...</span>
                </button>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    setActiveTab("settings");
                    setActiveSettingSection(null);
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center gap-2 transition-colors cursor-default"
                >
                  <Settings className="w-3.5 h-3.5 opacity-80 text-neutral-300" />
                  <span>System Preferences...</span>
                </button>
                <div className="border-t border-white/10 my-1" />
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    exportChannelsToM3u8();
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center gap-2 transition-colors cursor-default"
                >
                  <Download className="w-3.5 h-3.5 opacity-80 text-neutral-300" />
                  <span>Export Channel List (M3U)</span>
                </button>
                <div className="border-t border-white/10 my-1" />
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    setIsSleeping(true);
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center gap-2 transition-colors cursor-default"
                >
                  <Moon className="w-3.5 h-3.5 opacity-80 text-neutral-300" />
                  <span>Sleep (Display Sleep)</span>
                </button>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    showToast("Force restarting player stream container processes...");
                    setTimeout(() => {
                      window.location.reload();
                    }, 800);
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-rose-600/85 flex items-center gap-2 transition-colors cursor-default text-rose-300 font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
                  <span>Force Restart</span>
                </button>
              </div>
            )}
          </div>

          {/* Tab / App Name Menu */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("tabname")}
              onMouseEnter={() => handleMenuHover("tabname")}
              className={`px-2.5 py-1 rounded-[4px] hover:bg-white/10 font-bold text-white transition-colors cursor-default ${
                activeDropdown === "tabname" ? "bg-white/15 text-white" : ""
              }`}
            >
              {getTabDisplayName()}
            </button>

            {activeDropdown === "tabname" && (
              <div className="absolute left-0 mt-1 w-52 rounded-lg bg-[#121118]/95 backdrop-blur-[40px] border border-white/15 shadow-2xl z-[110] py-1.5 text-white overflow-hidden text-left">
                <div className="px-4 py-1 text-[11px] text-neutral-400 font-bold uppercase tracking-wider">
                  Active Area
                </div>
                <div className="px-4 py-1.5 text-xs text-indigo-300 font-semibold truncate flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {activeTab === "settings" ? `Settings > ${activeSettingSection || "Index"}` : `Viewing ${getTabDisplayName()}`}
                </div>
                {selectedChannel && (
                  <>
                    <div className="border-t border-white/10 my-1" />
                    <div className="px-4 py-1 text-[11px] text-neutral-400 font-bold uppercase tracking-wider">
                      Current Stream
                    </div>
                    <div className="px-4 py-1.5 text-xs text-white/90 truncate font-mono">
                      {selectedChannel.name}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("file")}
              onMouseEnter={() => handleMenuHover("file")}
              className={`px-2.5 py-1 rounded-[4px] hover:bg-white/10 transition-colors cursor-default ${
                activeDropdown === "file" ? "bg-white/15 text-white" : ""
              }`}
            >
              File
            </button>

            {activeDropdown === "file" && (
              <div className="absolute left-0 mt-1 w-52 rounded-lg bg-[#121118]/95 backdrop-blur-[40px] border border-white/15 shadow-2xl z-[110] py-1.5 text-white overflow-hidden text-left">
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    setShowCustomModal(true);
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center justify-between transition-colors cursor-default text-white"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5 opacity-80 text-neutral-300" />
                    <span>Add Custom Channel</span>
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">⌘N</span>
                </button>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    exportChannelsToM3u8();
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center justify-between transition-colors cursor-default text-white"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 opacity-80 text-neutral-300" />
                    <span>Export Channels</span>
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">⌘E</span>
                </button>
                <div className="border-t border-white/10 my-1" />
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    setActiveTab("home");
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center gap-2 transition-colors cursor-default text-neutral-300 hover:text-white"
                >
                  <span>Close Window</span>
                </button>
              </div>
            )}
          </div>

          {/* Edit Menu */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("edit")}
              onMouseEnter={() => handleMenuHover("edit")}
              className={`px-2.5 py-1 rounded-[4px] hover:bg-white/10 transition-colors cursor-default ${
                activeDropdown === "edit" ? "bg-white/15 text-white" : ""
              }`}
            >
              Edit
            </button>

            {activeDropdown === "edit" && (
              <div className="absolute left-0 mt-1 w-52 rounded-lg bg-[#121118]/95 backdrop-blur-[40px] border border-white/15 shadow-2xl z-[110] py-1.5 text-white overflow-hidden text-left">
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    setActiveTab("search");
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center justify-between transition-colors cursor-default text-white"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 opacity-80 text-neutral-300" />
                    <span>Search Channels</span>
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">⌘F</span>
                </button>
                <div className="border-t border-white/10 my-1" />
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    toggleShowClock();
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center justify-between transition-colors cursor-default text-white"
                >
                  <span className="flex items-center gap-2">
                    {showClock ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <div className="w-3.5 h-3.5" />}
                    <span>Show Dock Clock</span>
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* View Menu */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("view")}
              onMouseEnter={() => handleMenuHover("view")}
              className={`px-2.5 py-1 rounded-[4px] hover:bg-white/10 transition-colors cursor-default ${
                activeDropdown === "view" ? "bg-white/15 text-white" : ""
              }`}
            >
              View
            </button>

            {activeDropdown === "view" && (
              <div className="absolute left-0 mt-1 w-56 rounded-lg bg-[#121118]/95 backdrop-blur-[40px] border border-white/15 shadow-2xl z-[110] py-1.5 text-white overflow-hidden text-left">
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    handleOpenMultiviewSelector();
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center gap-2 transition-colors cursor-default text-white"
                >
                  <Grid className="w-3.5 h-3.5 opacity-80 text-neutral-300" />
                  <span>Multiview Screen Grid...</span>
                </button>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    handleTogglePictureInPicture();
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center gap-2 transition-colors cursor-default text-white"
                >
                  <Layers className="w-3.5 h-3.5 opacity-80 text-neutral-300" />
                  <span>Picture-in-Picture Mode</span>
                </button>
                <div className="border-t border-white/10 my-1" />
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    if (selectedChannel) {
                      toggleFavorite(selectedChannel.id);
                    }
                  }}
                  disabled={!selectedChannel}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center justify-between disabled:opacity-40 transition-colors cursor-default text-white"
                >
                  <span className="flex items-center gap-2">
                    {isFav ? <Check className="w-3.5 h-3.5 text-rose-400" /> : <div className="w-3.5 h-3.5" />}
                    <span>Add to Favorites</span>
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">⌘D</span>
                </button>
                <div className="border-t border-white/10 my-1" />
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    setActiveTab("settings");
                    setActiveSettingSection("appearance");
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center gap-2 transition-colors cursor-default text-white"
                >
                  <Sliders className="w-3.5 h-3.5 opacity-80 text-neutral-300" />
                  <span>Theme & Appearance...</span>
                </button>
              </div>
            )}
          </div>

          {/* Go Menu */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("go")}
              onMouseEnter={() => handleMenuHover("go")}
              className={`px-2.5 py-1 rounded-[4px] hover:bg-white/10 transition-colors cursor-default ${
                activeDropdown === "go" ? "bg-white/15 text-white" : ""
              }`}
            >
              Go
            </button>

            {activeDropdown === "go" && (
              <div className="absolute left-0 mt-1 w-52 rounded-lg bg-[#121118]/95 backdrop-blur-[40px] border border-white/15 shadow-2xl z-[110] py-1.5 text-white overflow-hidden text-left">
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    setActiveTab("home");
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center justify-between transition-colors cursor-default text-white"
                >
                  <span>Go to Home</span>
                  <span className="text-[10px] text-neutral-400 font-mono">⌥H</span>
                </button>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    setActiveTab("live");
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center justify-between transition-colors cursor-default text-white"
                >
                  <span>Go to Live TV</span>
                  <span className="text-[10px] text-neutral-400 font-mono">⌥L</span>
                </button>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    setActiveTab("search");
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center justify-between transition-colors cursor-default text-white"
                >
                  <span>Go to Search</span>
                  <span className="text-[10px] text-neutral-400 font-mono">⌥S</span>
                </button>
                <div className="border-t border-white/10 my-1" />
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    setActiveTab("settings");
                    setActiveSettingSection("plugin_store");
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center justify-between transition-colors cursor-default text-white"
                >
                  <span>Go to Plugin Store</span>
                  <span className="text-[10px] text-neutral-400 font-mono">⌥P</span>
                </button>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    setActiveTab("settings");
                    setActiveSettingSection(null);
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center justify-between transition-colors cursor-default text-white"
                >
                  <span>Go to Settings</span>
                  <span className="text-[10px] text-neutral-400 font-mono">⌥,</span>
                </button>
              </div>
            )}
          </div>

          {/* Help Menu */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("help")}
              onMouseEnter={() => handleMenuHover("help")}
              className={`px-2.5 py-1 rounded-[4px] hover:bg-white/10 transition-colors cursor-default ${
                activeDropdown === "help" ? "bg-white/15 text-white" : ""
              }`}
            >
              Help
            </button>

            {activeDropdown === "help" && (
              <div className="absolute left-0 mt-1 w-64 rounded-lg bg-[#121118]/95 backdrop-blur-[40px] border border-white/15 shadow-2xl z-[110] py-2 text-white overflow-hidden text-left">
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    setShowAboutModal(true);
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center gap-2 transition-colors cursor-default"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-neutral-300" />
                  <span>Vplay Help Center</span>
                </button>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    setShowAboutModal(true);
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center gap-2 transition-colors cursor-default"
                >
                  <Info className="w-3.5 h-3.5 text-neutral-300" />
                  <span>Interactive Guide</span>
                </button>
                
                <div className="border-t border-white/10 my-1.5" />
                
                {/* ACTIVE LIVE STORAGE INDICATOR BAR (thanh storage trong dropdown help) */}
                <div className="px-4 py-1.5 space-y-1 bg-white/[0.02] border-y border-white/5 select-none">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400">
                    <span className="font-semibold flex items-center gap-1">
                      <Database className="w-2.5 h-2.5 text-emerald-400" />
                      Storage Footprint
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">{(storageStats.totalBytes / 1024).toFixed(1)} KB</span>
                  </div>
                  {/* Visual Bar */}
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${storagePercentage}%` }} 
                      className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-300" 
                    />
                  </div>
                  <div className="text-[8px] text-neutral-500 text-right">Limit: 10 MB</div>
                </div>

                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    setShowStorageModal(true);
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center gap-2 transition-colors cursor-default font-semibold text-emerald-300"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Manage Storage Cache...</span>
                </button>
                
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    setShowDebugScreen(!showDebugScreen);
                    showToast(showDebugScreen ? "Debug Screen Disabled" : "Debug Screen Enabled (Minecraft F3 Mode)");
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-indigo-600/85 flex items-center justify-between transition-colors cursor-default"
                >
                  <span className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-lime-400" />
                    <span>Debug screen (F3)</span>
                  </span>
                  {showDebugScreen && <Check className="w-3 h-3 text-lime-400 mr-1" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right side status indicators (V-Intelligence next to Volume icon, volume slider, and local clock) */}
        <div className="flex items-center gap-3 text-[13px] text-white/90 font-sans">
          
          {/* V-Intelligence Direct trigger placed elegantly on the right near the volume controls */}
          <div className="relative">
            <button
              onClick={() => {
                if (isVIntelligenceActive) {
                  if (isDropdownIntelligenceActive) {
                    toggleDropdown("v_intelligence");
                  } else {
                    setActiveDropdown(null);
                    setReimaginedSearchOpen(!reimaginedSearchOpen);
                  }
                } else {
                  setActiveDropdown(null);
                  setActiveTab("settings");
                  setActiveSettingSection("experimental");
                }
              }}
              className={`px-2.5 py-1.5 rounded-[4px] hover:bg-white/10 text-white transition-colors cursor-default flex items-center gap-1.5 relative ${
                activeDropdown === "v_intelligence" ? "bg-white/15" : ""
              }`}
              title="V-Intelligence AI Assistant"
            >
              <img 
                src="https://static.wikia.nocookie.net/logopedia/images/6/65/Windows_Copilot_2023_%28Preview%29.svg/revision/latest?cb=20230615034330" 
                alt="V-Intelligence" 
                className="w-3.5 h-3.5 object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-300 font-bold">
                V-Intelligence
              </span>
              {isVIntelligenceActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse absolute top-1 right-1 border border-black" />
              )}
            </button>

            {/* Dropdown Intelligence popup container */}
            {activeDropdown === "v_intelligence" && isDropdownIntelligenceActive && (
              <div className="absolute right-0 mt-1 w-[320px] rounded-2xl bg-[#0c0819]/95 backdrop-blur-[40px] saturate-[180%] border border-white/15 shadow-2xl z-[110] p-4 text-white overflow-hidden text-left flex flex-col gap-3">
                {/* Glowing Header Accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-indigo-500 via-purple-500 to-pink-500" />
                
                {/* Header */}
                <div className="flex items-center justify-between pt-1 border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <img 
                      src="https://static.wikia.nocookie.net/logopedia/images/6/65/Windows_Copilot_2023_%28Preview%29.svg/revision/latest?cb=20230615034330" 
                      alt="V-Intelligence" 
                      className="w-5 h-5 object-contain filter drop-shadow-[0_0_6px_rgba(99,102,241,0.5)]"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-bold flex items-center gap-1 text-white">
                        V-Intelligence
                        <span className="text-[8px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold px-1 rounded-full uppercase">AI</span>
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {/* Expand icon to open sidebar/drawer */}
                    <button
                      onClick={() => {
                        setActiveDropdown(null);
                        setReimaginedSearchOpen(true);
                      }}
                      className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                      title="Mở rộng thành Sidebar"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveDropdown(null)}
                      className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                      title="Đóng"
                    >
                      <span className="text-xs">✕</span>
                    </button>
                  </div>
                </div>

                {/* Mini Chat Messages */}
                <div className="max-h-[160px] overflow-y-auto custom-scrollbar space-y-2.5 text-xs pr-1">
                  {vIntelHistory && vIntelHistory.length === 0 ? (
                    <div className="py-4 text-center text-white/40 space-y-1">
                      <p className="font-semibold text-[11px]">Chào bạn! Mình có thể giúp gì?</p>
                      <p className="text-[10px] leading-relaxed px-2">Nhập câu hỏi nhanh hoặc bấm biểu tượng mở rộng để hiển thị dạng Sidebar.</p>
                      {/* Fast suggestions */}
                      <div className="flex flex-wrap gap-1 justify-center pt-2">
                        {["Bật kênh VTV3", "Tìm kênh bóng đá"].map((sugg, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              if (handleSendVIntelMsg) handleSendVIntelMsg(sugg);
                            }}
                            className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/20 text-[10px] text-indigo-200 hover:text-white transition-all cursor-pointer truncate max-w-[130px]"
                          >
                            {sugg}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {vIntelHistory && vIntelHistory.slice(-4).map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                          <div className={`text-[8px] text-white/30 mb-0.5 uppercase tracking-wider font-semibold ${msg.role === "user" ? "text-right" : "text-left"}`}>
                            {msg.role === "user" ? "Bạn" : "AI"}
                          </div>
                          <div className={`p-2 rounded-xl text-[11px] leading-relaxed max-w-[90%] whitespace-pre-wrap break-words border ${
                            msg.role === "user" 
                              ? "bg-indigo-600/30 border-indigo-500/20 text-white rounded-tr-none" 
                              : "bg-white/5 border-white/10 text-white/95 rounded-tl-none"
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      {isVIntelLoading && (
                        <div className="flex flex-col items-start animate-pulse">
                          <div className="text-[8px] text-white/30 mb-0.5 uppercase tracking-wider font-semibold">AI</div>
                          <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white/50 rounded-tl-none flex items-center gap-1.5">
                            <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
                            <span>Đang suy nghĩ...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Input Bar */}
                <div className="relative rounded-xl bg-white/5 border border-white/10 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all p-2 flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="Hỏi V-Intelligence..."
                    value={vIntelQuery}
                    onChange={(e) => setVIntelQuery && setVIntelQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (handleSendVIntelMsg) handleSendVIntelMsg();
                      }
                    }}
                    className="flex-1 bg-transparent border-0 text-white text-[11.5px] placeholder-white/30 focus:outline-none font-sans"
                  />
                  <button
                    onClick={() => {
                      if (handleSendVIntelMsg) handleSendVIntelMsg();
                    }}
                    disabled={isVIntelLoading || !vIntelQuery.trim()}
                    className={`p-1 rounded-lg transition-all flex items-center justify-center shrink-0 ${
                      vIntelQuery.trim() 
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white" 
                        : "bg-white/5 text-white/20 cursor-not-allowed"
                    }`}
                  >
                    {isVIntelLoading ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <svg className="w-3 h-3 fill-current rotate-45" viewBox="0 0 24 24">
                        <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Volume slider container with hover popover */}
          <div 
            className="relative flex items-center gap-2 py-1"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              onClick={() => setMuted(!muted)}
              className="text-neutral-200 hover:text-white transition-colors"
            >
              {muted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-neutral-300" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            
            {showVolumeSlider && (
              <div className="overflow-hidden flex items-center w-[60px] transition-all">
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (muted) setMuted(false);
                  }}
                  className="w-14 h-1 bg-white/25 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
            )}
          </div>

          {/* Mac OS Clock */}
          <div className="text-[13px] text-white font-medium pl-1 cursor-default font-sans">
            {timeStr}
          </div>
        </div>
      </div>
    </>
  );
}
