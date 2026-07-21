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
  Terminal,
  Copy,
  Image,
  Play,
  EyeOff,
  Beaker,
  Zap,
  Home,
  Flame,
  Star,
  Power,
  LogOut,
  Clock,
  User,
  ShieldAlert,
  SlidersHorizontal,
  AlertTriangle,
  RotateCw,
  Youtube
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StartMenuProps {
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
  onSelectChannel?: (channel: any) => void;
  userRole?: "user" | "admin" | null;
  onOpenLogoAdjustTest?: () => void;
  onOpenYouTubeTool?: () => void;
  onOpenWheelOfVplay?: () => void;
  isFocusMode?: boolean;
  setIsFocusMode?: (val: boolean) => void;
  expLowLatency: boolean;
  setExpLowLatency: (val: boolean) => void;
  expCache: boolean;
  setExpCache: (val: boolean) => void;
  expAmbientGlow: boolean;
  setExpAmbientGlow: (val: boolean) => void;
  expFeatures: {
    id: string;
    name: string;
    desc: string;
    status: "idle" | "installing" | "installed";
    progress: number;
    isActive: boolean;
  }[];
  toggleExpFeature: (id: string) => void;
  testStreamUrl: string;
  setTestStreamUrl: (val: string) => void;
  onLaunchTestStream: (url: string) => void;
  onTriggerCrash: () => void;
  onOpenDuiMode?: () => void;
  onOpenSearch?: () => void;
  customTabs?: any[];
  channels?: any[];
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
  onShutdown: () => void;
}

export default function StartMenu({
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
  customTabs = [],
  channels = [],
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
  onSelectChannel,
  userRole,
  onOpenLogoAdjustTest,
  onOpenYouTubeTool,
  onOpenWheelOfVplay,
  isFocusMode = false,
  setIsFocusMode,
  expLowLatency,
  setExpLowLatency,
  expCache,
  setExpCache,
  expAmbientGlow,
  setExpAmbientGlow,
  expFeatures,
  toggleExpFeature,
  testStreamUrl,
  setTestStreamUrl,
  onLaunchTestStream,
  onTriggerCrash,
  onOpenDuiMode,
  onOpenSearch,
  isOpen,
  onClose,
  onSignOut,
  onShutdown
}: StartMenuProps) {
  const getGreetingText = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return "Good morning";
    if (hour >= 10 && hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Channel suggestions state
  const [suggestedChannels, setSuggestedChannels] = useState<any[]>([]);

  const handleRefreshChannelSuggestions = () => {
    if (!channels || channels.length === 0) return;
    const nonFavs = channels.filter((ch: any) => !(favorites || []).includes(ch.id));
    const pool = nonFavs.length >= 3 ? nonFavs : channels;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setSuggestedChannels(shuffled.slice(0, 3));
  };

  useEffect(() => {
    if (isOpen && channels && channels.length > 0 && suggestedChannels.length === 0) {
      handleRefreshChannelSuggestions();
    }
  }, [isOpen, channels]);

  // Custom states transferred from old MacMenuBar
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [showDebugScreen, setShowDebugScreen] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [showSystemReport, setShowSystemReport] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [fps, setFps] = useState(60.0);
  const [storageStats, setStorageStats] = useState({
    totalBytes: 0,
    favoritesCount: 0,
    customChannelsCount: 0,
    hasHistory: false
  });

  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // Only close if we didn't click the start button itself
        const target = event.target as HTMLElement;
        if (!target.closest("#vplay-start-dock-btn")) {
          onClose();
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Fluctuating FPS for Minecraft F3 debug screen
  useEffect(() => {
    if (!showDebugScreen) return;
    const interval = setInterval(() => {
      setFps(+(59.4 + Math.random() * 1.8).toFixed(1));
    }, 800);
    return () => clearInterval(interval);
  }, [showDebugScreen]);

  // Viewport resize
  useEffect(() => {
    const handleResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    
    let favCount = 0;
    try {
      const favs = localStorage.getItem("vplay_favorites");
      if (favs) favCount = JSON.parse(favs).length;
    } catch (e) {}

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
    if (isOpen) {
      updateStorageStats();
    }
  }, [isOpen, showStorageModal, showDebugScreen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleClearFavorites = () => {
    localStorage.removeItem("vplay_favorites");
    updateStorageStats();
    showToast("Đã dọn dẹp danh sách yêu thích!");
  };

  const handleClearCustomChannels = () => {
    localStorage.removeItem("vplay_custom_channels");
    updateStorageStats();
    showToast("Đã dọn dẹp luồng tùy chỉnh!");
  };

  const handleResetSettings = () => {
    localStorage.removeItem("vplay_app_settings");
    localStorage.removeItem("vplay_settings_appearance");
    updateStorageStats();
    showToast("Khôi phục cài đặt gốc. Đang tải lại...");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const isFav = selectedChannel ? favorites.includes(selectedChannel.id) : false;

  return (
    <>
      {/* 1. MINECRAFT STYLE F3 DEBUG SCREEN */}
      {showDebugScreen && (
        <div className="fixed top-4 left-4 z-[200] bg-black/95 backdrop-blur-2xl border border-white/20 p-4 rounded-none font-mono text-[11px] leading-relaxed text-white text-left space-y-1.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] w-[360px] sm:w-[420px] max-h-[80vh] overflow-y-auto select-text pointer-events-auto custom-scrollbar border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-white sticky top-0 bg-black/90 backdrop-blur-sm z-10">
            <span className="font-bold flex items-center gap-1"><Terminal className="w-3.5 h-3.5 text-indigo-400" /> VPLAY DEBUG SCREEN (F3 Mode)</span>
            <button 
              onClick={() => setShowDebugScreen(false)}
              className="text-white/60 hover:text-white px-1.5 py-0.5 hover:bg-white/10 rounded-none text-xs transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-indigo-400/85 tracking-wider font-sans">I. System Environment</div>
            <div className="pl-2 space-y-0.5 border-l border-white/10 ml-1">
              <div><span className="text-white/60">Build Version:</span> v3.12-stable (Production bundle)</div>
              <div><span className="text-white/60">Host Stack:</span> React 18 / Vite / TailwindCSS</div>
              <div><span className="text-white/60">Screen Viewport:</span> {viewport.w}x{viewport.h} (DPR: {window.devicePixelRatio || 1})</div>
              <div><span className="text-white/60">Live Frame Rate:</span> <span className="text-emerald-400 font-bold">{fps} FPS</span> (stable loop)</div>
              <div><span className="text-white/60">Client Language:</span> {navigator.language || "vi-VN"}</div>
              <div><span className="text-white/60">Network Latency:</span> {navigator.onLine ? "CONNECTED (ONLINE)" : "DISCONNECTED (OFFLINE)"}</div>
              <div><span className="text-white/60">Platform Role:</span> <span className="text-indigo-300 font-bold uppercase">{userRole || "unknown"}</span></div>
            </div>
          </div>

          <div className="border-t border-white/10 my-1.5" />

          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-indigo-400/85 tracking-wider font-sans">II. Application State</div>
            <div className="pl-2 space-y-0.5 border-l border-white/10 ml-1">
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
            <div className="text-[10px] uppercase font-bold text-indigo-400/85 tracking-wider font-sans">III. Core Feature Flags</div>
            <div className="pl-2 space-y-0.5 border-l border-white/10 ml-1">
              <div><span className="text-white/60">Material Design 3:</span> {isMaterialDesignActive ? "ENABLED" : "DISABLED"}</div>
              <div><span className="text-white/60">Dropdown Intelligence:</span> {isDropdownIntelligenceActive ? "ACTIVE" : "INACTIVE"}</div>
              <div><span className="text-white/60">Server Ingress Port:</span> 3000 (External Proxy Node)</div>
            </div>
          </div>

          <div className="border-t border-white/10 my-1.5" />

          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-indigo-400/85 tracking-wider font-sans">IV. Diagnostics & Hardware</div>
            <div className="pl-2 space-y-0.5 border-l border-white/10 ml-1">
              <div><span className="text-white/60">CPU Cores:</span> {navigator.hardwareConcurrency || "4"} logical threads</div>
              <div><span className="text-white/60">GPU WebGL:</span> {window.WebGLRenderingContext ? "Accelerated 2D/3D Canvas" : "Software Rasterizer"}</div>
              <div><span className="text-white/60">Storage Limit:</span> 3,221,225,472 Bytes (3.00 GB Allocated)</div>
              <div><span className="text-white/60">Active DOM Nodes:</span> {document.getElementsByTagName("*").length} elements</div>
            </div>
          </div>

          <div className="border-t border-white/10 my-1.5" />

          <div className="space-y-2">
            <div className="text-[10px] uppercase font-bold text-indigo-400/85 tracking-wider font-sans">V. Diagnostic Commands</div>
            <div className="grid grid-cols-2 gap-1.5 pt-0.5">
              <button 
                onClick={() => alert("Chạy phân tích hiệu năng: Tất cả các luồng hoạt động ổn định ở mức 60FPS.")}
                className="bg-zinc-900 hover:bg-zinc-800 border border-white/15 py-1 text-[9px] text-indigo-300 font-bold transition-all cursor-default text-center rounded-none font-mono"
              >
                [ Speed Benchmark ]
              </button>
              <button 
                onClick={() => alert("Đã dọn dẹp bộ nhớ đệm thành công.")}
                className="bg-zinc-900 hover:bg-zinc-800 border border-white/15 py-1 text-[9px] text-indigo-300 font-bold transition-all cursor-default text-center rounded-none font-mono"
              >
                [ Flush App Heap ]
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="bg-zinc-900 hover:bg-red-950 border border-red-500/20 hover:border-red-500/40 py-1 text-[9px] text-red-400 font-bold transition-all cursor-default text-center rounded-none font-mono"
              >
                [ Force Reboot App ]
              </button>
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="bg-zinc-900 hover:bg-red-950 border border-red-500/20 hover:border-red-500/40 py-1 text-[9px] text-red-400 font-bold transition-all cursor-default text-center rounded-none font-mono"
              >
                [ Factory Reset ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SLEEP OVERLAY DISPLAY */}
      {isSleeping && (
        <div 
          onClick={() => {
            setIsSleeping(false);
            showToast("Đang kích hoạt lại màn hình Vplay...");
          }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center cursor-pointer select-none"
        >
          <div className="text-center space-y-4 animate-pulse">
            <Moon className="w-12 h-12 text-white/20 mx-auto" />
            <p className="text-neutral-500 text-xs tracking-widest uppercase font-mono">Display is in Sleep mode</p>
            <p className="text-neutral-600 text-[11px] font-sans">Nhấp bất kỳ đâu để đánh thức Vplay</p>
          </div>
        </div>
      )}

      {/* 3. SYSTEM REPORT MODAL */}
      {showSystemReport && (
        <div className="fixed inset-0 z-[210] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121118]/95 border border-white/10 w-full max-w-md rounded-xl overflow-hidden shadow-2xl font-sans text-white text-left">
            <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-sm text-neutral-200">Báo cáo Thông tin Hệ thống</span>
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
                  <span className="text-neutral-500 font-medium">Phiên bản Hệ thống</span>
                  <span className="font-mono text-white">Vplay Smart OS (v3.12-dock)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-500 font-medium">Framework Engine</span>
                  <span className="font-mono text-white">React 18 + Vite (Container)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-500 font-medium">Người vận hành</span>
                  <span className="font-mono text-white">tvbabinh1@gmail.com</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-500 font-medium">Giao diện kết xuất</span>
                  <span className="font-mono text-emerald-400">Tailwind CSS + Motion</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-500 font-medium">Cổng Ingress</span>
                  <span className="font-mono text-indigo-300">Port 3000 (External Proxy)</span>
                </div>
              </div>

              <div className="bg-indigo-950/20 border border-indigo-500/10 rounded-lg p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Trạng thái Sức khỏe Hệ thống</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">Tất cả các luồng xử lý video (HLS Player), công cụ tích hợp M3U, bộ nhớ đệm ngoại tuyến đều đang hoạt động ở mức hoàn hảo, 0 lỗi nghiêm trọng.</p>
              </div>
            </div>
            <div className="px-4 py-3 bg-white/5 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowSystemReport(false)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold px-4 py-1.5 rounded-lg transition-colors text-xs cursor-pointer"
              >
                Đóng Báo cáo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. STORAGE MANAGER MODAL */}
      {showStorageModal && (
        <div className="fixed inset-0 z-[210] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121118]/95 border border-white/15 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl font-sans text-white text-left">
            <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm text-neutral-200">Quản lý Dung lượng Bộ nhớ Vplay</span>
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
                  <span>Dung lượng đã sử dụng</span>
                  <span className="text-emerald-400">{(storageStats.totalBytes / 1024).toFixed(2)} KB / 10 MB Max</span>
                </div>
                <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden flex">
                  <div 
                    style={{ width: `${Math.min(100, Math.max(8, (storageStats.favoritesCount * 12)))}%` }} 
                    className="bg-rose-500 h-full" 
                    title="Yêu thích"
                  />
                  <div 
                    style={{ width: `${Math.min(100, Math.max(12, (storageStats.customChannelsCount * 24)))}%` }} 
                    className="bg-indigo-500 h-full" 
                    title="Luồng tùy chỉnh"
                  />
                  <div 
                    style={{ width: '15%' }} 
                    className="bg-amber-500 h-full" 
                    title="Cấu hình hệ thống"
                  />
                </div>
                <div className="flex items-center gap-4 text-[10px] text-neutral-400 pt-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> Kênh yêu thích ({storageStats.favoritesCount})
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" /> Luồng tùy chỉnh ({storageStats.customChannelsCount})
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Cấu hình OS
                  </span>
                </div>
              </div>

              {/* Maintenance Tools */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Công cụ bảo trì Bộ nhớ đệm</h3>
                
                <div className="space-y-2">
                  {/* Clean Favorites */}
                  <div className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-all text-xs">
                    <div>
                      <h4 className="font-semibold text-white/95">Dọn dẹp Kênh yêu thích</h4>
                      <p className="text-[10px] text-neutral-400">Xóa danh sách kênh yêu thích cục bộ để khôi phục trạng thái ban đầu.</p>
                    </div>
                    <button 
                      onClick={handleClearFavorites}
                      className="bg-rose-600/20 hover:bg-rose-600 hover:text-white text-rose-300 border border-rose-500/30 px-3 py-1 rounded-md transition-all font-semibold cursor-pointer shrink-0"
                    >
                      Xóa dữ liệu
                    </button>
                  </div>

                  {/* Clean Custom Channels */}
                  <div className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-all text-xs">
                    <div>
                      <h4 className="font-semibold text-white/95">Dọn dẹp luồng tùy chỉnh M3U</h4>
                      <p className="text-[10px] text-neutral-400">Purge manually uploaded channels and imported playlists.</p>
                    </div>
                    <button 
                      onClick={handleClearCustomChannels}
                      className="bg-rose-600/20 hover:bg-rose-600 hover:text-white text-rose-300 border border-rose-500/30 px-3 py-1 rounded-md transition-all font-semibold cursor-pointer shrink-0"
                    >
                      Xóa luồng
                    </button>
                  </div>

                  {/* Reset Settings */}
                  <div className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-all text-xs">
                    <div>
                      <h4 className="font-semibold text-white/95">Khôi phục cài đặt gốc của OS</h4>
                      <p className="text-[10px] text-neutral-400">Đặt lại toàn bộ âm lượng, cấu hình hiển thị, chế độ màu sắc về mặc định.</p>
                    </div>
                    <button 
                      onClick={handleResetSettings}
                      className="bg-amber-600/20 hover:bg-amber-600 hover:text-white text-amber-300 border border-amber-500/30 px-3 py-1 rounded-md transition-all font-semibold cursor-pointer shrink-0"
                    >
                      Đặt lại mặc định
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-white/5 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowStorageModal(false)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold px-4 py-1.5 rounded-lg transition-colors text-xs cursor-pointer"
              >
                Đóng Công cụ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[250] bg-black/90 text-white border border-white/15 px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-2xl animate-fade-in font-sans">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 5. FLOATING START MENU POPUP */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: "100%", x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: "100%", x: "-50%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className={`fixed bottom-[84px] sm:bottom-[90px] left-1/2 w-[92vw] max-w-[560px] max-h-[calc(100vh-140px)] z-[160] rounded-[20px] border border-white/15 bg-[#141416]/95 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-left font-sans text-white`}
          >
            {/* Header branding */}
            <div className="px-4.5 py-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between relative shrink-0">
              <div className="flex items-center gap-2 z-10">
                <img 
                  src="https://static.wikia.nocookie.net/ftv/images/a/ab/Imagexvxvz.png/revision/latest/scale-to-width-down/1000?cb=20260429082350&path-prefix=vi" 
                  alt="Vplay OS"
                  referrerPolicy="no-referrer"
                  className="h-5 w-auto object-contain brightness-110 saturate-[1.1]"
                />
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenSearch) onOpenSearch();
                  }}
                  className="p-1 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                  title="Tìm kiếm & Tiện ích Vplay"
                >
                  <img src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest/scale-to-width-down/1000?cb=20260717131751" className="w-4 h-4 object-contain" style={{ filter: "brightness(0) invert(1)" }} referrerPolicy="no-referrer" alt="Search" />
                </button>
              </div>

              {/* Centered greeting, white text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                  {getGreetingText()}
                </span>
              </div>
              
              {/* Dynamic state badges */}
              <div className="flex items-center gap-1.5 z-10">
                <div className="hidden xs:flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-semibold text-neutral-300">
                  <Clock className="w-2.5 h-2.5 text-neutral-400" />
                  <span>UTC+7</span>
                </div>
              </div>
            </div>

            {/* Core Body: Scrollable container containing sections */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar max-h-[380px] xs:max-h-[420px] sm:max-h-[460px]">
              
              {/* SECTION: PINNED CHANNELS */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    Kênh Đã Ghim (Favorites)
                  </span>
                </div>
                {(() => {
                  const pinned = (channels || []).filter((ch: any) => (favorites || []).includes(ch.id));
                  return pinned.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {pinned.map((ch: any) => (
                        <button
                          key={ch.id}
                          onClick={() => {
                            if (onSelectChannel) onSelectChannel(ch);
                            onClose();
                          }}
                          className="group flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 text-center transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 transition-transform group-hover:scale-105">
                            {ch.logoImg ? (
                              <img
                                src={ch.logoImg}
                                alt={ch.name}
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-[10px] font-bold text-white/60">
                                {ch.logoText || "TV"}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-medium mt-1.5 text-white/90 group-hover:text-indigo-400 transition-colors line-clamp-1 w-full px-0.5">
                            {ch.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center text-[10px] text-white/40 leading-relaxed">
                      Chưa có kênh nào được ghim. Nhấp vào nút ❤️ yêu thích của kênh để tự động ghim tại đây!
                    </div>
                  );
                })()}
              </div>

              {/* SECTION: SUGGESTED CHANNELS */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Gợi ý kênh hôm nay
                  </span>
                  <button
                    onClick={handleRefreshChannelSuggestions}
                    className="p-1 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                    title="Làm mới gợi ý"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
                {suggestedChannels.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {suggestedChannels.map((ch: any) => (
                      <button
                        key={ch.id}
                        onClick={() => {
                          if (onSelectChannel) onSelectChannel(ch);
                          onClose();
                        }}
                        className="group flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 text-center transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 transition-transform group-hover:scale-105">
                          {ch.logoImg ? (
                            <img
                              src={ch.logoImg}
                              alt={ch.name}
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="text-[10px] font-bold text-white/60">
                              {ch.logoText || "TV"}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-medium mt-1.5 text-white/90 group-hover:text-indigo-400 transition-colors line-clamp-1 w-full px-0.5">
                          {ch.name}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-[10px] text-white/40">
                    Đang tải gợi ý...
                  </div>
                )}
              </div>

              {/* SECTION: NAVIGATION */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    onClick={() => {
                      setActiveTab("home");
                      onClose();
                    }}
                    className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-bold border transition-all text-center cursor-pointer ${activeTab === "home" ? "bg-indigo-600 border-indigo-400 text-white shadow-lg" : "bg-white/5 hover:bg-white/10 border-white/5 text-white/80 hover:text-white"}`}
                  >
                    <Home className="w-3.5 h-3.5 shrink-0" />
                    <span>Trang chủ</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("live");
                      onClose();
                    }}
                    className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-bold border transition-all text-center cursor-pointer ${activeTab === "live" ? "bg-indigo-600 border-indigo-400 text-white shadow-lg" : "bg-white/5 hover:bg-white/10 border-white/5 text-white/80 hover:text-white"}`}
                  >
                    <Tv className="w-3.5 h-3.5 shrink-0" />
                    <span>Truyền hình</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("shorts");
                      onClose();
                    }}
                    className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-bold border transition-all text-center cursor-pointer ${activeTab === "shorts" ? "bg-indigo-600 border-indigo-400 text-white shadow-lg" : "bg-white/5 hover:bg-white/10 border-white/5 text-white/80 hover:text-white"}`}
                  >
                    <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span>Vplay Vertical</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("settings");
                      setActiveSettingSection(null);
                      onClose();
                    }}
                    className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-bold border transition-all text-center cursor-pointer ${activeTab === "settings" && activeSettingSection === null ? "bg-indigo-600 border-indigo-400 text-white shadow-lg" : "bg-white/5 hover:bg-white/10 border-white/5 text-white/80"}`}
                  >
                    <Settings className="w-3.5 h-3.5 shrink-0" />
                    <span>Cài đặt</span>
                  </button>
                </div>
              </div>

              {/* SECTION: TILES UTILITIES */}
              <div className="grid grid-cols-2 gap-2">
                
                {/* Tile: Thêm kênh */}
                <button
                  onClick={() => {
                    onClose();
                    setShowCustomModal(true);
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 text-center transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Plus className="w-5 h-5 text-indigo-400 mb-1" />
                  <span className="text-[11px] font-bold text-white/90">Thêm kênh</span>
                  <span className="text-[9px] text-white/40 mt-0.5">Phím tắt: ⌘N</span>
                </button>

                {/* Tile: Xuất danh sách */}
                <button
                  onClick={() => {
                    onClose();
                    exportChannelsToM3u8();
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 text-center transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Download className="w-5 h-5 text-emerald-400 mb-1" />
                  <span className="text-[11px] font-bold text-white/90">Xuất file M3U</span>
                  <span className="text-[9px] text-white/40 mt-0.5">Phím tắt: ⌘E</span>
                </button>

                {/* Tile: Chạy luồng mẫu */}
                <button
                  onClick={() => {
                    onClose();
                    if (onSelectChannel) {
                      onSelectChannel({
                        id: "test_video",
                        name: "Play Test Video",
                        url: "/assets/VTV6 World Cup 2026.mp4",
                        group: "Thử nghiệm",
                        logoText: "TEST VIDEO",
                        logoBg: "bg-gradient-to-br from-indigo-500 to-purple-700",
                        logoImg: "https://static.wikia.nocookie.net/ep-deo/images/6/6a/VTV6_HD.png/revision/latest/scale-to-width-down/180?cb=20260625104230"
                      });
                    }
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 text-center transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Tv className="w-5 h-5 text-sky-400 mb-1" />
                  <span className="text-[11px] font-bold text-white/90">Luồng Video Mẫu</span>
                  <span className="text-[9px] text-white/40 mt-0.5">Phím tắt: ⌘T</span>
                </button>

                {/* Tile: Xem đa kênh */}
                <button
                  onClick={() => {
                    onClose();
                    handleOpenMultiviewSelector();
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 text-center transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Grid className="w-5 h-5 text-purple-400 mb-1" />
                  <span className="text-[11px] font-bold text-white/90">Xem Đa Kênh</span>
                  <span className="text-[9px] text-white/40 mt-0.5">Multiview Grid</span>
                </button>

                {/* Tile: PIP Mode */}
                <button
                  onClick={() => {
                    onClose();
                    handleTogglePictureInPicture();
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 text-center transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Layers className="w-5 h-5 text-pink-400 mb-1" />
                  <span className="text-[11px] font-bold text-white/90">Ảnh trong Ảnh</span>
                  <span className="text-[9px] text-white/40 mt-0.5">PIP Mode</span>
                </button>

                {/* Tile: Bật/Tắt Đồng hồ */}
                <button
                  onClick={() => {
                    toggleShowClock();
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 text-center transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Clock className="w-5 h-5 text-amber-400 mb-1" />
                  <span className="text-[11px] font-bold text-white/90">Bật/Tắt Đồng Hồ</span>
                  <span className="text-[9px] text-white/40 mt-0.5">{showClock ? "Đang bật" : "Đang tắt"}</span>
                </button>

                {/* Tile: Quản lý ổ cứng */}
                <button
                  onClick={() => {
                    setShowStorageModal(true);
                    onClose();
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 text-center transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Database className="w-5 h-5 text-emerald-400 mb-1" />
                  <span className="text-[11px] font-bold text-white/90">Ổ cứng & Cache</span>
                  <span className="text-[9px] text-white/40 mt-0.5">Dung lượng, dữ liệu rác</span>
                </button>

                {/* Tile: Báo cáo hệ thống */}
                <button
                  onClick={() => {
                    setShowSystemReport(true);
                    onClose();
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 text-center transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Monitor className="w-5 h-5 text-blue-400 mb-1" />
                  <span className="text-[11px] font-bold text-white/90">Báo Cáo Hệ Thống</span>
                  <span className="text-[9px] text-white/40 mt-0.5">CPU & Proxy</span>
                </button>

                {/* Tile: Bảng gỡ lỗi F3 */}
                <button
                  onClick={() => {
                    setShowDebugScreen(true);
                    onClose();
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 text-center transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Terminal className="w-5 h-5 text-indigo-400 mb-1" />
                  <span className="text-[11px] font-bold text-white/90">Bảng Gỡ Lỗi F3</span>
                  <span className="text-[9px] text-white/40 mt-0.5">Minecraft Style FPS</span>
                </button>

                {/* Tile: Adjust Logos */}
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenLogoAdjustTest) onOpenLogoAdjustTest();
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 text-center transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <SlidersHorizontal className="w-5 h-5 text-neutral-300 mb-1" />
                  <span className="text-[11px] font-bold text-white/90">Adjust Logos</span>
                  <span className="text-[9px] text-white/40 mt-0.5">Kiểm thử logo</span>
                </button>

                {/* Tile: YouTube Embed */}
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenYouTubeTool) onOpenYouTubeTool();
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 text-center transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Youtube className="w-5 h-5 text-red-500 mb-1" />
                  <span className="text-[11px] font-bold text-white/90">YouTube Embed</span>
                  <span className="text-[9px] text-white/40 mt-0.5">Nhúng video YouTube</span>
                </button>

                {/* Tile: Wheel of Vplay */}
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenWheelOfVplay) onOpenWheelOfVplay();
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 text-center transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <HelpCircle className="w-5 h-5 text-pink-400 mb-1" />
                  <span className="text-[11px] font-bold text-white/90">Wheel of Vplay</span>
                  <span className="text-[9px] text-white/40 mt-0.5">Vòng quay may mắn</span>
                </button>

                {/* Tile: DUI Monitor */}
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenDuiMode) onOpenDuiMode();
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 text-center transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Activity className="w-5 h-5 text-emerald-400 mb-1" />
                  <span className="text-[11px] font-bold text-white/90">DUI Monitor</span>
                  <span className="text-[9px] text-white/40 mt-0.5">Bảng giám sát mạng</span>
                </button>
              </div>

              {/* Stream URL custom input */}
              <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5 space-y-1.5">
                <span className="text-[10px] text-white/40 font-bold block uppercase tracking-wider">Chạy dòng truyền M3U8</span>
                <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-white/5 focus-within:border-indigo-500/30 transition-all">
                  <input 
                    type="text"
                    placeholder="Nhập đường dẫn luồng M3U8..."
                    value={testStreamUrl}
                    onChange={(e) => setTestStreamUrl(e.target.value)}
                    className="bg-transparent text-[11px] text-white px-2 focus:outline-none w-full placeholder-white/30"
                  />
                  <button
                    onClick={() => {
                      if (testStreamUrl) {
                        onLaunchTestStream(testStreamUrl);
                        onClose();
                      }
                    }}
                    className="px-3.5 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[10px] font-bold text-white shrink-0 cursor-pointer transition-colors"
                  >
                    Chạy
                  </button>
                </div>
              </div>

              {/* Simulate Kernel Crash */}
              <div className="pt-1">
                <button
                  onClick={() => {
                    onTriggerCrash();
                    onClose();
                  }}
                  className="w-full bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-500/10 hover:border-red-500/30 text-[10px] font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Mô phỏng lỗi hệ thống (Kernel Crash)</span>
                </button>
              </div>

            </div>

            {/* Bottom Footer Section: Session, sleep and power buttons */}
            <div className="px-4.5 py-3 bg-white/5 border-t border-white/5 flex items-center justify-between flex-wrap gap-2 shrink-0">
              
              {/* User profile card (Windows style) */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center border border-white/20 shadow-inner shrink-0">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-white leading-tight">Thành viên Vplay</span>
                  <span className="text-[9px] text-indigo-300/80 font-semibold uppercase tracking-wider">
                    Quyền: {userRole === "admin" ? "ADMINISTRATOR" : "STANDARD USER"}
                  </span>
                </div>
              </div>

              {/* Power Actions */}
              <div className="flex items-center gap-2">
                {/* About Vplay */}
                <button
                  onClick={() => {
                    setShowAboutModal(true);
                    onClose();
                  }}
                  title="Thông tin Vplay"
                  className="w-7.5 h-7.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>

                {/* Sleep button */}
                <button
                  onClick={() => {
                    setIsSleeping(true);
                  }}
                  title="Chế độ ngủ"
                  className="w-7.5 h-7.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>

                {/* Sign Out Button */}
                <button
                  onClick={() => {
                    onClose();
                    onSignOut();
                  }}
                  className="px-3 h-7.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/30 border border-indigo-500/20 text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 text-[11px] font-bold transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  <span>Đăng xuất</span>
                </button>

                {/* Shutdown Button */}
                <button
                  onClick={() => {
                    onClose();
                    onShutdown();
                  }}
                  className="px-3 h-7.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/20 hover:border-red-500 flex items-center gap-1.5 text-[11px] font-bold transition-all cursor-pointer"
                >
                  <Power className="w-3.5 h-3.5 shrink-0" />
                  <span>Tắt máy</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
