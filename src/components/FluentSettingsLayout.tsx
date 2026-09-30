import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Info,
  Box,
  Palette,
  Key,
  Wrench,
  FlaskConical,
  BookOpen,
  Gift,
  Search,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Sliders,
  Droplets,
  Droplet,
  Sparkles,
  Laptop,
  Check,
  X,
  ExternalLink,
  Moon,
  Sun,
  Type,
  MousePointer,
  Keyboard,
  Layers,
  ArrowRight,
  Volume2,
  Bell,
  HardDrive,
  User,
  Shield,
  Star,
  CheckCircle2,
  Mic,
  Copy
} from 'lucide-react';
import {
  SystemSettings,
  FONT_SCALE_CONFIG,
  FONT_FAMILY_CONFIG,
  WALLPAPER_PRESETS,
  VCURSOR_PRESETS
} from '../hooks/useSettings';
import { FEATURE_FLAGS_DEFINITIONS } from '../hooks/useFeatureFlags';
import { playPopSound } from '../utils/sound';
import { showIslandNotification } from '../utils/islandNotifications';

export type FluentCategory =
  | 'about'
  | 'spatial_glass'
  | 'appearance'
  | 'accessibility'
  | 'tools'
  | 'experimental'
  | 'feedback'
  | 'redeem_gift';

interface FluentSettingsLayoutProps {
  settings: SystemSettings;
  updateSetting: <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => void;
  flags: Record<string, boolean>;
  setFlag: (key: string, value: boolean) => void;
  toggleFlag: (key: string) => void;
  navigate?: (route: string) => void;
  isDrawer?: boolean;
  onClose?: () => void;
}

export const FluentSettingsLayout: React.FC<FluentSettingsLayoutProps> = ({
  settings,
  updateSetting,
  flags,
  setFlag,
  toggleFlag,
  navigate,
  isDrawer,
  onClose
}) => {
  const [activeCategory, setActiveCategory] = useState<FluentCategory>('about');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRenamingDevice, setIsRenamingDevice] = useState(false);
  const [deviceName, setDeviceName] = useState(() => settings.userName || 'SurfaceLaptop');
  const [customWallpaperInput, setCustomWallpaperInput] = useState('');

  // Feedback form state
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [feedbackType, setFeedbackType] = useState<'Suggestion' | 'Issue' | 'Question'>('Suggestion');
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Redeem state
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  // System update state
  const [lastCheckUpdate, setLastCheckUpdate] = useState('1 hour ago');
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  // Spatial glass values
  const spatialBlur = typeof settings.spatialGlassBlur === 'number' && !isNaN(settings.spatialGlassBlur)
    ? settings.spatialGlassBlur
    : 20;
  const spatialOpacity = typeof settings.spatialGlassOpacity === 'number' && !isNaN(settings.spatialGlassOpacity)
    ? settings.spatialGlassOpacity
    : 65;

  // Categories matching standard Settings.tsx (ALL WHITE ICONS)
  const categories = useMemo(() => [
    { id: 'about', name: 'Giới thiệu', icon: Info, desc: 'Thông tin hệ thống, thiết bị và hồ sơ người dùng' },
    { id: 'spatial_glass', name: 'Spatial Glass', icon: Box, desc: 'Độ mờ hậu cảnh (Blur), độ trong suốt (Opacity) & Liquid Glass' },
    { id: 'appearance', name: 'Giao diện', icon: Palette, desc: 'Chủ đề sáng/tối, thanh điều hướng, hình nền, phông chữ' },
    { id: 'accessibility', name: 'Trợ năng', icon: Key, desc: 'Con trỏ chuột V-Cursor, cỡ chữ, âm thanh, gỡ lỗi giao diện' },
    { id: 'tools', name: 'Công cụ', icon: Wrench, desc: 'Speak For Me (TTS), bàn phím ảo V-board, tiện ích phát sóng' },
    { id: 'experimental', name: 'Thử nghiệm', icon: FlaskConical, desc: 'Trung tâm cờ tính năng VNRT Online Experimental Labs' },
    { id: 'feedback', name: 'Give Feedback', icon: BookOpen, desc: 'Đóng góp ý kiến và báo cáo lỗi cho đội ngũ kỹ sư' },
    { id: 'redeem_gift', name: 'Redeem Gift VNRT ONLINE', icon: Gift, desc: 'Kích hoạt mã quà tặng, nhận khoáng vật Orbs & VIP' },
  ], []);

  const handleSaveDeviceName = () => {
    const trimmed = deviceName.trim() || 'SurfaceLaptop';
    updateSetting('userName', trimmed);
    setDeviceName(trimmed);
    setIsRenamingDevice(false);
    showIslandNotification({ title: 'Cài đặt thiết bị', message: `Đã đổi tên thiết bị thành: ${trimmed}`, icon: 'info' });
  };

  const handleCheckUpdate = () => {
    setIsCheckingUpdate(true);
    setTimeout(() => {
      setIsCheckingUpdate(false);
      setLastCheckUpdate('Vừa xong');
      showIslandNotification({ title: 'Cập nhật hệ thống', message: "Hệ thống đã cập nhật bản mới nhất (v26.10_devb)", icon: 'info' });
    }, 1200);
  };

  const handleResetOobe = () => {
    try {
      localStorage.removeItem('vplay_oobe_completed');
    } catch {}
    window.dispatchEvent(new CustomEvent('vplay:open_oobe'));
    showIslandNotification({ title: 'Thiết lập ban đầu', message: 'Đã mở trình cài đặt OOBE Setup!', icon: 'info' });
  };

  // Filter categories by search
  const q = searchQuery.toLowerCase().trim();
  const filteredCategories = categories.filter(c =>
    !q || c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
  );

  return (
    <div className={`w-full text-white select-none ${isDrawer ? 'px-2 py-2' : 'max-w-7xl mx-auto px-3 sm:px-6 py-4'}`}>
      {/* Fluent Container Layout: Responsive 2 Columns on Desktop, Horizontal Sliding on Mobile */}
      <div className="flex flex-col md:flex-row items-stretch gap-6 lg:gap-8">
        {/* =========================================================================
            LEFT SIDEBAR (PC: Vertical Menu, Mobile: Horizontal Sliding Bar)
            ========================================================================= */}
        <aside className="w-full md:w-64 lg:w-72 shrink-0 flex flex-col gap-4">
          {/* User Profile Card (As shown at top left of screenshot) */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-zinc-700 via-zinc-800 to-zinc-900 p-0.5 shadow-md shrink-0 border border-white/20">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80"
                alt="User Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm sm:text-base text-white truncate">
                {settings.userName || 'Michael Muchmore'}
              </div>
              <div className="text-xs text-zinc-400 truncate font-mono">
                {settings.userName ? `${settings.userName.toLowerCase().replace(/\s+/g, '')}@vplay.vn` : 'msmpcmag@hotmail.com'}
              </div>
            </div>
          </div>

          {/* Search Box: "Find a setting" */}
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find a setting"
              className="w-full bg-[#1F1F24]/80 hover:bg-[#25252A] focus:bg-[#202025] text-white placeholder:text-zinc-500 text-xs sm:text-sm pl-9 pr-8 py-2 rounded-lg border border-white/10 focus:border-[#388BFD] focus:outline-none transition-colors shadow-inner"
            />
            {/* White search icon */}
            <Search className="w-4 h-4 text-white absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            )}
          </div>

          {/* MOBILE ONLY: Horizontal Sliding Category Bar (Dạng trượt ngang) */}
          <div className="md:hidden w-full overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-1 px-1">
            <div className="flex items-center gap-1.5 whitespace-nowrap min-w-max">
              {filteredCategories.map((cat) => {
                const IconComponent = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setActiveCategory(cat.id as FluentCategory);
                    }}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 ${
                      isActive
                        ? 'bg-[#388BFD] text-white shadow-[0_4px_12px_rgba(56,139,253,0.4)]'
                        : 'bg-[#202025] text-zinc-300 hover:text-white hover:bg-[#282830] border border-white/5'
                    }`}
                  >
                    {/* White Icon */}
                    <IconComponent className="w-3.5 h-3.5 text-white" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PC DESKTOP ONLY: Vertical Sidebar Category Menu */}
          <nav className="hidden md:flex flex-col gap-0.5 overflow-y-auto pr-1 max-h-[calc(100vh-220px)] no-scrollbar">
            {filteredCategories.map((cat) => {
              const IconComponent = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setActiveCategory(cat.id as FluentCategory);
                  }}
                  className={`relative w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs lg:text-[13.5px] font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-white/[0.08] text-white font-semibold shadow-xs'
                      : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Left Active Blue Indicator Line */}
                  {isActive && (
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#388BFD] rounded-full shadow-[0_0_8px_#388BFD]" />
                  )}
                  {/* Pure White Icon */}
                  <IconComponent className="w-4 h-4 shrink-0 text-white" />
                  <span className="truncate">{cat.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* =========================================================================
            RIGHT MAIN CONTENT AREA (Matching Standard Settings Sections)
            ========================================================================= */}
        <main className="flex-1 min-w-0 flex flex-col gap-5">
          {/* Active Category Header */}
          <div className="flex items-center justify-between pb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span>{categories.find(c => c.id === activeCategory)?.name || 'Cài đặt'}</span>
            </h1>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
                title="Đóng Cài đặt"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            )}
          </div>

          {/* =====================================================================
              TOP DEVICE BANNER (Present on Giới thiệu / General views, matching screenshot)
              ===================================================================== */}
          <div className="w-full bg-[#1C1C22]/90 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden">
            {/* Device preview thumbnail */}
            <div className="flex items-center gap-4 z-10">
              <div className="relative w-24 h-16 sm:w-28 sm:h-18 bg-gradient-to-tr from-zinc-800 via-zinc-900 to-black rounded-xl overflow-hidden border border-white/20 shadow-md flex items-center justify-center shrink-0">
                <Laptop className="w-8 h-8 text-white drop-shadow-md" />
              </div>

              <div className="space-y-0.5">
                {isRenamingDevice ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
                      className="bg-black/60 border border-white/30 px-2 py-0.5 rounded text-sm text-white focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSaveDeviceName}
                      className="p-1 text-white hover:bg-white/20 rounded"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>{settings.userName ? `${settings.userName}'s PC` : 'SurfaceLaptop'}</span>
                  </h2>
                )}

                <p className="text-xs text-zinc-400 font-mono">
                  Surface Laptop 3 • Vplay 4K HDR Edition
                </p>

                <button
                  type="button"
                  onClick={() => setIsRenamingDevice(!isRenamingDevice)}
                  className="text-xs text-white hover:underline font-semibold cursor-pointer block text-left"
                >
                  Rename
                </button>
              </div>
            </div>

            {/* Right Service Badges with WHITE icons */}
            <div className="flex flex-wrap items-center gap-3 z-10 w-full sm:w-auto">
              {/* V-Premium */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.04] border border-white/10 text-left text-xs min-w-[130px]">
                <div className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center font-bold">
                  <Gift className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white leading-tight">V-Premium</div>
                  <span className="text-[11px] text-white/80 hover:text-white hover:underline cursor-pointer" onClick={() => navigate?.('/v-premium')}>Manage</span>
                </div>
              </div>

              {/* V-Cloud */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.04] border border-white/10 text-left text-xs min-w-[130px]">
                <div className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center font-bold">
                  <HardDrive className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white leading-tight">V-Cloud</div>
                  <span className="text-[11px] text-white/80 hover:text-white hover:underline cursor-pointer" onClick={() => navigate?.('/v-files')}>Manage</span>
                </div>
              </div>

              {/* System Update */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.04] border border-white/10 text-left text-xs min-w-[140px]">
                <button
                  type="button"
                  onClick={handleCheckUpdate}
                  className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center font-bold hover:bg-white/20 cursor-pointer"
                  title="Kiểm tra bản cập nhật"
                >
                  <RotateCcw className={`w-3.5 h-3.5 text-white ${isCheckingUpdate ? 'animate-spin' : ''}`} />
                </button>
                <div>
                  <div className="font-semibold text-white leading-tight">System Update</div>
                  <div className="text-[10.5px] text-zinc-400 font-mono">{lastCheckUpdate}</div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              1. CATEGORY: GIỚI THIỆU (about)
              ===================================================================== */}
          {activeCategory === 'about' && (
            <div className="space-y-4">
              {/* User Profile Card */}
              <div className="bg-[#1C1C22]/80 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-white" />
                  <h3 className="text-base font-bold text-white">Hồ sơ người dùng</h3>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="Nhập tên người dùng hiển thị..."
                    className="flex-1 bg-black/40 border border-white/15 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:border-white"
                  />
                  <button
                    type="button"
                    onClick={handleSaveDeviceName}
                    className="px-5 py-2 rounded-lg bg-white text-black font-bold text-xs sm:text-sm hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    Lưu tên
                  </button>
                </div>
              </div>

              {/* Version & Build Product Watermark */}
              <div className="bg-[#1C1C22]/80 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3 text-xs">
                <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                  <Info className="w-5 h-5 text-white" />
                  <h3 className="text-base font-bold text-white">Thông tin phiên bản Vplay</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-300">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                    <span className="text-zinc-400 block text-[11px]">Bản dựng sản phẩm (Build):</span>
                    <strong className="text-white font-mono text-xs block">VNRT Online v26.10_devb (26A3667c)</strong>
                    <span className="text-[10px] text-zinc-400">Pre-release build product</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                    <span className="text-zinc-400 block text-[11px]">Kênh phân phối:</span>
                    <strong className="text-white font-mono text-xs block">Canary Experimental Channel</strong>
                    <span className="text-[10px] text-zinc-400">Waves Community Framework</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Khởi động lại OOBE Setup Wizard</div>
                    <div className="text-zinc-400 text-[11px]">Mở lại màn hình chào đón và thiết lập nhanh</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetOobe}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold text-xs border border-white/20 transition-colors"
                  >
                    Chạy lại OOBE
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              2. CATEGORY: SPATIAL GLASS (spatial_glass)
              ===================================================================== */}
          {activeCategory === 'spatial_glass' && (
            <div className="space-y-4">
              {/* Interactive Live Glass Preview Banner */}
              <div className="relative w-full h-32 sm:h-36 rounded-2xl overflow-hidden border border-white/20 shadow-inner flex items-center justify-center p-4">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 20% 30%, #FBBF24 0%, transparent 40%), radial-gradient(circle at 80% 40%, #E6007A 0%, transparent 45%), radial-gradient(circle at 50% 80%, #388BFD 0%, transparent 50%), linear-gradient(135deg, #111827 0%, #1e1b4b 50%, #0f172a 100%)'
                  }}
                />
                {/* Live Glass Element */}
                <div 
                  className="relative z-10 w-full max-w-sm rounded-xl p-3.5 text-center flex items-center justify-between gap-3 shadow-lg border border-white/30"
                  style={{
                    backdropFilter: `blur(${spatialBlur}px)`,
                    WebkitBackdropFilter: `blur(${spatialBlur}px)`,
                    backgroundColor: `rgba(28, 27, 36, ${spatialOpacity / 100})`,
                  }}
                >
                  <div className="flex items-center gap-3 text-left min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 text-white flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-white">Kính xem trước (Live Preview)</div>
                      <div className="text-[11px] text-white/80 font-mono">
                        Blur: {spatialBlur}px • Opacity: {spatialOpacity}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-xs font-semibold text-zinc-400 mr-1">Mẫu sẵn:</span>
                {[
                  { label: 'Mặc định', blur: 20, opacity: 65 },
                  { label: 'Kính siêu trong', blur: 12, opacity: 30 },
                  { label: 'Mờ sương đục', blur: 32, opacity: 80 },
                  { label: 'Tối mờ sâu', blur: 40, opacity: 85 },
                  { label: 'Màu phẳng', blur: 0, opacity: 95 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      updateSetting('spatialGlassBlur', preset.blur);
                      updateSetting('spatialGlassOpacity', preset.opacity);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      spatialBlur === preset.blur && spatialOpacity === preset.opacity
                        ? 'bg-white text-black font-bold'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Slider 1: Blur */}
              <div className="bg-[#1C1C22]/80 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-white" />
                    <span className="font-bold text-white text-sm">Độ mờ hậu cảnh (Blur)</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-white/10 text-white font-mono font-bold">{spatialBlur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={spatialBlur}
                  onChange={(e) => updateSetting('spatialGlassBlur', Number(e.target.value))}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              {/* Slider 2: Opacity */}
              <div className="bg-[#1C1C22]/80 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-white" />
                    <span className="font-bold text-white text-sm">Độ trong suốt / Đậm màu (Opacity)</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-white/10 text-white font-mono font-bold">{spatialOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={spatialOpacity}
                  onChange={(e) => updateSetting('spatialGlassOpacity', Number(e.target.value))}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              {/* Liquid Distortion Toggle */}
              <div className="bg-[#1C1C22]/80 border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-white" />
                    <span>Liquid Distortion (Biến dạng giọt nước)</span>
                  </div>
                  <div className="text-zinc-400 text-[11px] mt-0.5">Tạo hiệu ứng thấu kính giọt nước cho capsule search và tab bar</div>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(settings.liquidDistortion)}
                  onChange={(e) => updateSetting('liquidDistortion', e.target.checked)}
                  className="w-5 h-5 accent-white cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* =====================================================================
              3. CATEGORY: GIAO DIỆN (appearance)
              ===================================================================== */}
          {activeCategory === 'appearance' && (
            <div className="space-y-4">
              {/* Theme Mode */}
              <div className="bg-[#1C1C22]/80 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-white" />
                  <h3 className="text-sm font-bold text-white">Chủ đề giao diện (Theme Mode)</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updateSetting('theme', 'dark')}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer ${
                      settings.theme !== 'light'
                        ? 'border-white bg-white/15 text-white'
                        : 'border-white/10 bg-white/5 text-zinc-400'
                    }`}
                  >
                    <Moon className="w-5 h-5 text-white" />
                    <span className="font-semibold text-xs sm:text-sm">Dark Mode (Tối)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSetting('theme', 'light')}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer ${
                      settings.theme === 'light'
                        ? 'border-white bg-white/15 text-white'
                        : 'border-white/10 bg-white/5 text-zinc-400'
                    }`}
                  >
                    <Sun className="w-5 h-5 text-white" />
                    <span className="font-semibold text-xs sm:text-sm">Light Mode (Sáng)</span>
                  </button>
                </div>
              </div>

              {/* Navigation Bar Mode */}
              <div className="bg-[#1C1C22]/80 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-white" />
                  <h3 className="text-sm font-bold text-white">Kiểu thanh điều hướng (Navigation Mode)</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'sidebar', label: 'Sidebar (Dọc)' },
                    { id: 'topbar', label: 'Top Bar (Trên)' },
                    { id: 'floaty', label: 'Floaty Bar' },
                    { id: 'tabview', label: 'Tab View' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => {
                        if (mode.id === 'floaty') {
                          updateSetting('floatyBar', true);
                          updateSetting('navigationMode', 'sidebar');
                        } else {
                          updateSetting('floatyBar', false);
                          updateSetting('navigationMode', mode.id as any);
                        }
                      }}
                      className={`p-2.5 rounded-lg border text-center font-semibold transition-all cursor-pointer ${
                        (mode.id === 'floaty' && settings.floatyBar) ||
                        (!settings.floatyBar && settings.navigationMode === mode.id)
                          ? 'border-white bg-white/20 text-white'
                          : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wallpaper Presets */}
              <div className="bg-[#1C1C22]/80 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-white" />
                  <h3 className="text-sm font-bold text-white">Hình nền ứng dụng (Wallpapers)</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {WALLPAPER_PRESETS.map((wp) => (
                    <button
                      key={wp.id}
                      type="button"
                      onClick={() => updateSetting('appBackground', wp.id)}
                      className={`p-2 rounded-xl border text-left text-xs transition-all flex flex-col gap-1.5 cursor-pointer ${
                        settings.appBackground === wp.id
                          ? 'border-white bg-white/20 text-white font-bold'
                          : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/30'
                      }`}
                    >
                      <div className="w-full h-12 rounded-lg bg-cover bg-center border border-white/10" style={{ backgroundImage: `url(${wp.url})` }} />
                      <span className="truncate">{wp.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography (Font family & scale) */}
              <div className="bg-[#1C1C22]/80 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-white" />
                  <h3 className="text-sm font-bold text-white">Phông chữ & Cỡ chữ (Typography)</h3>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Phông chữ hệ thống</label>
                  <select
                    value={settings.fontFamily || 'integer'}
                    onChange={(e) => updateSetting('fontFamily', e.target.value as any)}
                    className="w-full bg-black/40 border border-white/15 text-white rounded-lg p-2 text-xs focus:border-white focus:outline-none"
                  >
                    {FONT_FAMILY_CONFIG.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Cỡ chữ hiển thị</span>
                    <span className="font-mono text-white font-bold">{settings.fontScale || 'M'}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {FONT_SCALE_CONFIG.map((scale) => (
                      <button
                        key={scale.value}
                        type="button"
                        onClick={() => updateSetting('fontScale', scale.value)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors ${
                          settings.fontScale === scale.value
                            ? 'border-white bg-white/20 text-white'
                            : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {scale.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              4. CATEGORY: TRỢ NĂNG (accessibility)
              ===================================================================== */}
          {activeCategory === 'accessibility' && (
            <div className="space-y-4">
              {/* V-Cursor */}
              <div className="bg-[#1C1C22]/80 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <MousePointer className="w-4 h-4 text-white" />
                  <h3 className="text-sm font-bold text-white">Con trỏ chuột tùy chỉnh (V-Cursor)</h3>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">Bật con trỏ chuột đồ họa V-Cursor</div>
                    <div className="text-zinc-400 text-[11px]">Thay thế con trỏ chuột mặc định của hệ điều hành</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(settings.vcursorEnabled)}
                    onChange={(e) => updateSetting('vcursorEnabled', e.target.checked)}
                    className="w-5 h-5 accent-white cursor-pointer"
                  />
                </div>

                {settings.vcursorEnabled && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    {VCURSOR_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          updateSetting('vcursorColor', preset.fill);
                          updateSetting('vcursorBorderColor', preset.border);
                        }}
                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.fill, border: `1px solid ${preset.border}` }} />
                        <span className="truncate text-white">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* System Sound Effects */}
              <div className="bg-[#1C1C22]/80 border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-white" />
                  <div>
                    <div className="font-bold text-white text-sm">Âm thanh phản hồi (Pop Sound Effects)</div>
                    <div className="text-zinc-400 text-[11px]">Âm thanh pop nhẹ khi click nút, chuyển tab và tương tác</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => playPopSound()}
                  className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 text-xs"
                >
                  Thử âm thanh
                </button>
              </div>

              {/* Inspect Elements Toggle */}
              <div className="bg-[#1C1C22]/80 border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-white" />
                  <div>
                    <div className="font-bold text-white text-sm">Bộ điều tra phần tử (Inspect Elements)</div>
                    <div className="text-zinc-400 text-[11px]">Bật overlay hover xem CSS, font và cấu trúc layout trực tiếp</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(settings.inspectElements)}
                  onChange={(e) => updateSetting('inspectElements', e.target.checked)}
                  className="w-5 h-5 accent-white cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* =====================================================================
              5. CATEGORY: CÔNG CỤ (tools)
              ===================================================================== */}
          {activeCategory === 'tools' && (
            <div className="space-y-4">
              {/* Speak For Me (Text to Speech) Card */}
              <div className="bg-[#1C1C22]/80 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Speak For Me (Text to Speech)</h3>
                    <p className="text-zinc-300 text-xs mt-0.5">
                      Công cụ chuyển văn bản thành giọng nói đa ngôn ngữ với quả cầu âm thanh trực quan và xuất file .mp3.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('vplay:open_speak_for_me'))}
                  className="px-5 py-2.5 rounded-lg bg-white text-black font-extrabold hover:bg-zinc-200 transition-all active:scale-95 shrink-0 flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Mic className="w-4 h-4 text-black" />
                  <span>Mở Speak For Me</span>
                </button>
              </div>

              {/* V-Board (Virtual Keyboard) Card */}
              <div className="bg-[#1C1C22]/80 border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Keyboard className="w-5 h-5 text-white" />
                  <div>
                    <div className="font-bold text-white text-sm">Bàn phím ảo V-board Telex</div>
                    <div className="text-zinc-400 text-[11px]">Bật bàn phím ảo khi nhấn vào ô tìm kiếm hoặc soạn thảo</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(flags.experimental_vboard)}
                  onChange={() => toggleFlag('experimental_vboard')}
                  className="w-5 h-5 accent-white cursor-pointer"
                />
              </div>

              {/* Toolbox broadcast shortcuts */}
              <div className="bg-[#1C1C22]/80 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-white" />
                  <h3 className="text-sm font-bold text-white">Tiện ích phát sóng truyền hình (Toolbox)</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { name: 'Khung Safe Area', route: '/toolbox' },
                    { name: 'Vạch màu SMPTE', route: '/toolbox' },
                    { name: 'Timecode Clock', route: '/toolbox' },
                    { name: 'Vòng quay may mắn', route: '/wheel-of-fortune' },
                  ].map((tool) => (
                    <button
                      key={tool.name}
                      type="button"
                      onClick={() => navigate?.(tool.route)}
                      className="p-3 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl text-center font-semibold text-white transition-colors cursor-pointer"
                    >
                      {tool.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              6. CATEGORY: THỬ NGHIỆM (experimental)
              ===================================================================== */}
          {activeCategory === 'experimental' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Trung tâm cờ tính năng (Feature Flags)</h3>
                  <p className="text-xs text-zinc-400">Các công nghệ thử nghiệm của VNRT Online Labs</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate?.('/feature-flags')}
                  className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>Mở trang Labs riêng</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              <div className="space-y-2">
                {FEATURE_FLAGS_DEFINITIONS.map((flag) => {
                  const isEnabled = Boolean(flags[flag.key]);
                  return (
                    <div
                      key={flag.id}
                      className="p-3.5 bg-[#1C1C22]/80 border border-white/10 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5 max-w-lg">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{flag.name}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-white border border-white/20">
                            {flag.badge}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-[11.5px] leading-relaxed line-clamp-2">
                          {flag.description}
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => toggleFlag(flag.key)}
                        className="w-5 h-5 accent-white cursor-pointer shrink-0"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =====================================================================
              7. CATEGORY: GIVE FEEDBACK (feedback)
              ===================================================================== */}
          {activeCategory === 'feedback' && (
            <div className="bg-[#1C1C22]/80 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4 text-xs">
              <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                <BookOpen className="w-5 h-5 text-white" />
                <div>
                  <h3 className="text-base font-bold text-white">Give Feedback to Vplay Team</h3>
                  <p className="text-zinc-400 text-xs">Đóng góp ý kiến hoặc phản hồi lỗi trải nghiệm</p>
                </div>
              </div>

              {feedbackSubmitted ? (
                <div className="p-5 rounded-xl bg-white/10 border border-white/20 text-white text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-white mx-auto" />
                  <div className="font-bold text-sm">Cảm ơn bạn đã gửi phản hồi!</div>
                  <p className="text-xs text-zinc-300">Đội ngũ kỹ sư sẽ xem xét và cập nhật trong các bản build tới.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!feedbackTitle.trim()) return;
                    setFeedbackSubmitted(true);
                    setTimeout(() => {
                      setFeedbackTitle('');
                      setFeedbackContent('');
                      setFeedbackSubmitted(false);
                    }, 2500);
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-zinc-300 font-semibold">Loại phản hồi</label>
                    <div className="flex gap-2">
                      {(['Suggestion', 'Issue', 'Question'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFeedbackType(type)}
                          className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                            feedbackType === type
                              ? 'bg-white text-black font-bold border-white'
                              : 'bg-white/5 border-white/15 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {type === 'Suggestion' ? 'Gợi ý' : type === 'Issue' ? 'Báo lỗi' : 'Hỏi đáp'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-300 font-semibold">Đánh giá trải nghiệm</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= feedbackRating
                                ? 'text-white fill-white'
                                : 'text-zinc-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-300 font-semibold">Tiêu đề phản hồi</label>
                    <input
                      type="text"
                      value={feedbackTitle}
                      onChange={(e) => setFeedbackTitle(e.target.value)}
                      placeholder="Tóm tắt ý kiến đóng góp của bạn..."
                      className="w-full p-2.5 rounded-lg bg-black/40 border border-white/15 text-white focus:outline-none focus:border-white text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-300 font-semibold">Nội dung chi tiết</label>
                    <textarea
                      rows={4}
                      value={feedbackContent}
                      onChange={(e) => setFeedbackContent(e.target.value)}
                      placeholder="Mô tả cụ thể trải nghiệm hoặc ý tưởng của bạn..."
                      className="w-full p-2.5 rounded-lg bg-black/40 border border-white/15 text-white focus:outline-none focus:border-white text-xs resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-white text-black font-extrabold rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    Gửi phản hồi
                  </button>
                </form>
              )}
            </div>
          )}

          {/* =====================================================================
              8. CATEGORY: REDEEM GIFT (redeem_gift)
              ===================================================================== */}
          {activeCategory === 'redeem_gift' && (
            <div className="space-y-4">
              <div className="bg-[#1C1C22]/80 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4 text-xs">
                <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                  <Gift className="w-5 h-5 text-white" />
                  <div>
                    <h3 className="text-base font-bold text-white">Redeem Gift VNRT ONLINE</h3>
                    <p className="text-zinc-400 text-xs">Nhập mã 25 ký tự (5x5) để nhận khoáng vật Orbs và gói VIP</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={redeemCode}
                      onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                      placeholder="VNRT1-ONLINE-GIFTS-2026X-FREE1"
                      className="flex-1 p-2.5 rounded-lg bg-black/40 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!redeemCode.trim()) return;
                        setRedeemSuccess(`Đã kích hoạt thành công mã ${redeemCode}!`);
                        setTimeout(() => setRedeemSuccess(null), 3000);
                      }}
                      className="px-6 py-2.5 bg-white text-black font-extrabold rounded-lg hover:bg-zinc-200 cursor-pointer"
                    >
                      Kích hoạt
                    </button>
                  </div>

                  {redeemSuccess && (
                    <div className="p-3 bg-white/10 border border-white/20 rounded-lg text-white font-bold text-center">
                      {redeemSuccess}
                    </div>
                  )}

                  <div className="pt-2">
                    <span className="text-zinc-400 block mb-2 font-semibold">Mã quà tặng mẫu:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { code: 'VNRT1-ONLINE-GIFTS-2026X-FREE1', desc: '+50.000 Orbs & 30 ngày VIP' },
                        { code: 'MINEC-RAFTX-VNRT2-026OR-BS100', desc: '+100.000 Orbs Hoàng Gia' },
                      ].map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => setRedeemCode(item.code)}
                          className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <span className="font-mono text-white block text-[11px]">{item.code}</span>
                            <span className="text-[10px] text-zinc-400">{item.desc}</span>
                          </div>
                          <Copy className="w-3.5 h-3.5 text-white shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate?.('/event')}
                    className="inline-flex items-center gap-1.5 text-xs text-white hover:underline font-semibold"
                  >
                    <span>Mở trang Sự kiện đầy đủ</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FluentSettingsLayout;
