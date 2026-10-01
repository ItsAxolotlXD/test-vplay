import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Info,
  Box,
  Palette,
  Key,
  Wrench,
  FlaskConical,
  BookOpen,
  Gift,
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
  | 'home'
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
  const [activeCategory, setActiveCategory] = useState<FluentCategory>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRenamingDevice, setIsRenamingDevice] = useState(false);
  const [deviceName, setDeviceName] = useState(() => settings.userName || 'SurfaceLaptop');

  // Feedback form state
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [feedbackType, setFeedbackType] = useState<'Suggestion' | 'Issue' | 'Question'>('Suggestion');
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Redeem state
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  // Spatial glass values
  const spatialBlur = typeof settings.spatialGlassBlur === 'number' && !isNaN(settings.spatialGlassBlur)
    ? settings.spatialGlassBlur
    : 20;
  const spatialOpacity = typeof settings.spatialGlassOpacity === 'number' && !isNaN(settings.spatialGlassOpacity)
    ? settings.spatialGlassOpacity
    : 65;

  // Categories matching standard Settings.tsx + Home tab (ALL WHITE ICONS)
  const categories = useMemo(() => [
    { id: 'home', name: 'Home', icon: Home, desc: 'Tổng quan và các nhóm cài đặt đề xuất (Recommended)' },
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
      <div className="flex flex-col md:flex-row items-start gap-6 lg:gap-8">
        {/* =========================================================================
            LEFT SIDEBAR (PC: Vertical Menu, Mobile: Horizontal Sliding Bar)
            - md:sticky md:top-6 md:self-start: Giữ cố định sidebar khi cuộn trang
            - Phóng to icon & chữ, bo góc 20px, vạch chỉ thị phẳng không glow
            ========================================================================= */}
        <aside className="w-full md:w-68 lg:w-76 shrink-0 flex flex-col gap-4.5 md:sticky md:top-6 md:self-start md:max-h-[calc(100vh-3rem)] z-20">
          {/* User Profile Card (Phóng to avatar & chữ) */}
          <div className="flex items-center gap-3.5 px-2 py-1">
            <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gradient-to-tr from-zinc-700 via-zinc-800 to-zinc-900 p-0.5 shadow-lg shrink-0 border border-white/20">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=140&h=140&q=80"
                alt="User Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-base sm:text-lg text-white truncate">
                {settings.userName || 'Michael Muchmore'}
              </div>
              <div className="text-xs text-zinc-400 truncate font-mono mt-0.5">
                {settings.userName ? `${settings.userName.toLowerCase().replace(/\s+/g, '')}@vplay.vn` : 'msmpcmag@hotmail.com'}
              </div>
            </div>
          </div>

          {/* Search Box: Nền giảm opacity (bg-white/[0.04]), có line, bo góc 20px, icon từ URL mới */}
          <div className="relative w-full">
            <div className="relative w-full h-[46px] flex items-center justify-between px-4 rounded-[20px] bg-white/[0.04] hover:bg-white/[0.07] backdrop-blur-md transition-colors spotlight-bubble-box search-box-capsule float-search-style text-sm border-0 shadow-none overflow-hidden">
              <div className="flex items-center gap-3 flex-1 min-w-0 bg-transparent">
                <img
                  src="https://static.wikia.nocookie.net/ftv/images/9/95/Search.png/revision/latest?cb=20260427032951&path-prefix=vi"
                  alt="Search"
                  className="w-5 h-5 object-contain shrink-0 pointer-events-none select-none"
                />
                <input
                  id="fluent-settings-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm cài đặt..."
                  className="w-full bg-transparent text-white placeholder-white/60 text-sm focus:outline-none font-medium truncate border-0 shadow-none outline-none"
                />
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-white/70 hover:text-white transition-colors cursor-pointer shrink-0 ml-1.5"
                  title="Xóa tìm kiếm"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>

          {/* MOBILE ONLY: Horizontal Sliding Category Bar (Dạng trượt ngang với radius 20px, icon to rõ) */}
          <div className="md:hidden w-full overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-1 px-1">
            <div className="flex items-center gap-2 whitespace-nowrap min-w-max">
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
                    className={`inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-[20px] text-sm font-semibold transition-all cursor-pointer shadow-xs active:scale-95 ${
                      isActive
                        ? 'bg-[#388BFD] text-white shadow-md'
                        : 'bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.07]'
                    }`}
                  >
                    <IconComponent className="w-4.5 h-4.5 text-white stroke-[2.2]" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PC DESKTOP ONLY: Vertical Sidebar Category Menu (Phóng to icon & chữ, bo góc 20px, bỏ glow ở vạch xanh) */}
          <nav className="hidden md:flex flex-col gap-1 overflow-y-auto pr-1 max-h-[calc(100vh-210px)] no-scrollbar">
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
                  className={`relative w-full flex items-center gap-4 px-4.5 py-3 rounded-[20px] text-[15px] sm:text-base font-semibold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-white/[0.04] text-white shadow-xs'
                      : 'text-zinc-300 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Left Active Blue Indicator Line - Clean solid bar, NO glow */}
                  {isActive && (
                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#388BFD] rounded-full" />
                  )}
                  {/* Pure White Icon - Phóng to w-5 h-5 */}
                  <IconComponent className="w-5 h-5 shrink-0 text-white stroke-[2.2]" />
                  <span className="truncate">{cat.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* =========================================================================
            RIGHT MAIN CONTENT AREA (Các khối cài đặt có màu giống thanh search: bg-white/[0.04], giảm opacity)
            ========================================================================= */}
        <main className="flex-1 min-w-0 flex flex-col gap-6">
          {/* Active Category Header */}
          <div className="flex items-center justify-between pb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>{categories.find(c => c.id === activeCategory)?.name || 'Cài đặt'}</span>
            </h1>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 text-white transition-colors"
                title="Đóng Cài đặt"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            )}
          </div>

          {/* =====================================================================
              0. CATEGORY: HOME (Recommended Settings Groups - bg-white/[0.04], Bỏ viền, bo góc 20px)
              ===================================================================== */}
          {activeCategory === 'home' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Cài đặt được đề xuất (Recommended)</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Các tùy chỉnh nhanh phổ biến và quan trọng nhất cho hệ thống của bạn</p>
                </div>
              </div>

              {/* Grid Layout of Recommended Settings Groups (bg-white/[0.04], Không viền, bo góc 20px) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
                {/* 1. Giao diện & Chủ đề */}
                <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 flex flex-col justify-between gap-3.5 shadow-lg hover:bg-white/[0.07] transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-white font-bold text-base">
                        <Palette className="w-5 h-5 text-white stroke-[2.2]" />
                        <span>Chủ đề & Màu sắc</span>
                      </div>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-white font-semibold">Giao diện</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">Chuyển nhanh chế độ sáng/tối hoặc tùy biến màu chủ đạo.</p>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => updateSetting('theme', 'dark')}
                        className={`p-2.5 rounded-[14px] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          settings.theme !== 'light'
                            ? 'bg-white/20 text-white font-bold'
                            : 'bg-white/5 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Moon className="w-4 h-4 text-white" />
                        <span>Tối (Dark)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateSetting('theme', 'light')}
                        className={`p-2.5 rounded-[14px] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          settings.theme === 'light'
                            ? 'bg-white/20 text-white font-bold'
                            : 'bg-white/5 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Sun className="w-4 h-4 text-white" />
                        <span>Sáng (Light)</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setActiveCategory('appearance');
                    }}
                    className="text-xs text-white hover:underline font-semibold flex items-center justify-between pt-3 cursor-pointer"
                  >
                    <span>Xem thêm hình nền & phông chữ</span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* 2. Spatial Glass & Hiệu ứng */}
                <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 flex flex-col justify-between gap-3.5 shadow-lg hover:bg-white/[0.07] transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-white font-bold text-base">
                        <Box className="w-5 h-5 text-white stroke-[2.2]" />
                        <span>Spatial Glass</span>
                      </div>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-white font-semibold">{spatialBlur}px / {spatialOpacity}%</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">Điều chỉnh độ mờ hậu cảnh và độ trong suốt của bề mặt kính.</p>

                    <div className="space-y-2.5 pt-1">
                      <div className="flex items-center justify-between text-xs text-zinc-300">
                        <span>Độ mờ (Blur)</span>
                        <span className="font-mono text-white font-bold">{spatialBlur}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={spatialBlur}
                        onChange={(e) => updateSetting('spatialGlassBlur', Number(e.target.value))}
                        className="w-full accent-white cursor-pointer h-1.5"
                      />

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-zinc-300">Liquid Distortion</span>
                        <input
                          type="checkbox"
                          checked={Boolean(settings.liquidDistortion)}
                          onChange={(e) => updateSetting('liquidDistortion', e.target.checked)}
                          className="w-4.5 h-4.5 accent-white cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setActiveCategory('spatial_glass');
                    }}
                    className="text-xs text-white hover:underline font-semibold flex items-center justify-between pt-3 cursor-pointer"
                  >
                    <span>Mở bảng điều khiển Spatial Glass</span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* 3. Thanh điều hướng (Navigation Mode) */}
                <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 flex flex-col justify-between gap-3.5 shadow-lg hover:bg-white/[0.07] transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-white font-bold text-base">
                        <Layers className="w-5 h-5 text-white stroke-[2.2]" />
                        <span>Thanh điều hướng</span>
                      </div>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-white font-semibold">Bố cục</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">Chọn vị trí và phong cách hiển thị menu chuyển trang.</p>

                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-xs">
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
                          className={`p-2 rounded-[12px] text-center text-xs font-semibold transition-all cursor-pointer ${
                            (mode.id === 'floaty' && settings.floatyBar) ||
                            (!settings.floatyBar && settings.navigationMode === mode.id)
                              ? 'bg-white/20 text-white font-bold'
                              : 'bg-white/5 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 text-xs">
                    <span className="text-zinc-300">Tự động ẩn Sidebar</span>
                    <input
                      type="checkbox"
                      checked={Boolean(settings.autoHideSidebar)}
                      onChange={(e) => updateSetting('autoHideSidebar', e.target.checked)}
                      className="w-4.5 h-4.5 accent-white cursor-pointer"
                    />
                  </div>
                </div>

                {/* 4. Trợ năng & Con trỏ chuột */}
                <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 flex flex-col justify-between gap-3.5 shadow-lg hover:bg-white/[0.07] transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-white font-bold text-base">
                        <Key className="w-5 h-5 text-white stroke-[2.2]" />
                        <span>Trợ năng & Con trỏ</span>
                      </div>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-white font-semibold">Tương tác</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">Con trỏ chuột đồ họa và phản hồi tương tác âm thanh.</p>

                    <div className="space-y-2.5 pt-1 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white text-xs">V-Cursor</div>
                          <div className="text-[11px] text-zinc-400">Con trỏ đồ họa Vplay</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={Boolean(settings.vcursorEnabled)}
                          onChange={(e) => updateSetting('vcursorEnabled', e.target.checked)}
                          className="w-4.5 h-4.5 accent-white cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white text-xs">Pop Sounds</div>
                          <div className="text-[11px] text-zinc-400">Âm thanh click tương tác</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => playPopSound()}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-[10px] text-xs font-semibold text-white"
                        >
                          Thử âm
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setActiveCategory('accessibility');
                    }}
                    className="text-xs text-white hover:underline font-semibold flex items-center justify-between pt-3 cursor-pointer"
                  >
                    <span>Cấu hình Trợ năng chi tiết</span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* 5. Công cụ phát sóng & V-board */}
                <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 flex flex-col justify-between gap-3.5 shadow-lg hover:bg-white/[0.07] transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-white font-bold text-base">
                        <Wrench className="w-5 h-5 text-white stroke-[2.2]" />
                        <span>Công cụ nhanh</span>
                      </div>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-white font-semibold">Tiện ích</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">Bộ công cụ hỗ trợ phát sóng và gõ tiếng Việt Telex.</p>

                    <div className="space-y-2.5 pt-1 text-xs">
                      <button
                        type="button"
                        onClick={() => window.dispatchEvent(new CustomEvent('vplay:open_speak_for_me'))}
                        className="w-full py-2.5 px-3 rounded-[12px] bg-white text-black font-extrabold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-md cursor-pointer"
                      >
                        <Mic className="w-4 h-4 text-black" />
                        <span>Mở Speak For Me (TTS)</span>
                      </button>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-zinc-300">Bàn phím ảo V-board</span>
                        <input
                          type="checkbox"
                          checked={Boolean(flags.experimental_vboard)}
                          onChange={() => toggleFlag('experimental_vboard')}
                          className="w-4.5 h-4.5 accent-white cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setActiveCategory('tools');
                    }}
                    className="text-xs text-white hover:underline font-semibold flex items-center justify-between pt-3 cursor-pointer"
                  >
                    <span>Mở hộp công cụ Toolbox</span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* 6. Thử nghiệm VNRT Labs */}
                <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 flex flex-col justify-between gap-3.5 shadow-lg hover:bg-white/[0.07] transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-white font-bold text-base">
                        <FlaskConical className="w-5 h-5 text-white stroke-[2.2]" />
                        <span>Thử nghiệm Labs</span>
                      </div>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-white font-semibold">Mới</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">Các tính năng đang trong giai đoạn thử nghiệm sớm.</p>

                    <div className="space-y-2 pt-1 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-[12px] bg-white/5">
                        <span className="text-white text-xs font-medium">Dynamic Island</span>
                        <input
                          type="checkbox"
                          checked={Boolean(flags.dynamic_island)}
                          onChange={() => toggleFlag('dynamic_island')}
                          className="w-4.5 h-4.5 accent-white cursor-pointer"
                        />
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-[12px] bg-white/5">
                        <span className="text-white text-xs font-medium">Layout Settings mới</span>
                        <input
                          type="checkbox"
                          checked={Boolean(flags.experimental_settings_layout)}
                          onChange={() => toggleFlag('experimental_settings_layout')}
                          className="w-4.5 h-4.5 accent-white cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setActiveCategory('experimental');
                    }}
                    className="text-xs text-white hover:underline font-semibold flex items-center justify-between pt-3 cursor-pointer"
                  >
                    <span>Xem tất cả {FEATURE_FLAGS_DEFINITIONS.length} Feature Flags</span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              1. CATEGORY: GIỚI THIỆU (about) - bg-white/[0.04], Bỏ viền
              ===================================================================== */}
          {activeCategory === 'about' && (
            <div className="space-y-4">
              {/* User Profile Card */}
              <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 space-y-3.5 shadow-lg">
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
                    className="flex-1 bg-black/40 border-0 px-3.5 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSaveDeviceName}
                    className="px-6 py-2.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-colors cursor-pointer shadow-md"
                  >
                    Lưu tên
                  </button>
                </div>
              </div>

              {/* Version & Build Product Watermark */}
              <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 space-y-3.5 text-xs shadow-lg">
                <div className="flex items-center gap-3 pb-2">
                  <Info className="w-5 h-5 text-white" />
                  <h3 className="text-base font-bold text-white">Thông tin phiên bản Vplay</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-300">
                  <div className="p-3.5 bg-white/5 rounded-xl space-y-1">
                    <span className="text-zinc-400 block text-[11px]">Bản dựng sản phẩm (Build):</span>
                    <strong className="text-white font-mono text-xs block">VNRT Online v26.10_devb (26A3667c)</strong>
                    <span className="text-[10px] text-zinc-400">Pre-release build product</span>
                  </div>
                  <div className="p-3.5 bg-white/5 rounded-xl space-y-1">
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
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Chạy lại OOBE
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              2. CATEGORY: SPATIAL GLASS (spatial_glass) - bg-white/[0.04], Bỏ viền
              ===================================================================== */}
          {activeCategory === 'spatial_glass' && (
            <div className="space-y-4">
              {/* Interactive Live Glass Preview Banner */}
              <div className="relative w-full h-32 sm:h-36 rounded-[20px] overflow-hidden shadow-inner flex items-center justify-center p-4">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 20% 30%, #FBBF24 0%, transparent 40%), radial-gradient(circle at 80% 40%, #E6007A 0%, transparent 45%), radial-gradient(circle at 50% 80%, #388BFD 0%, transparent 50%), linear-gradient(135deg, #111827 0%, #1e1b4b 50%, #0f172a 100%)'
                  }}
                />
                {/* Live Glass Element */}
                <div 
                  className="relative z-10 w-full max-w-sm rounded-[16px] p-3.5 text-center flex items-center justify-between gap-3 shadow-2xl"
                  style={{
                    backdropFilter: `blur(${spatialBlur}px)`,
                    WebkitBackdropFilter: `blur(${spatialBlur}px)`,
                    backgroundColor: `rgba(28, 27, 36, ${spatialOpacity / 100})`,
                  }}
                >
                  <div className="flex items-center gap-3 text-left min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center shrink-0">
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
                    className={`px-3.5 py-1.5 rounded-[14px] text-xs font-semibold transition-all cursor-pointer ${
                      spatialBlur === preset.blur && spatialOpacity === preset.opacity
                        ? 'bg-white text-black font-bold shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Slider 1: Blur */}
              <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 space-y-3.5 shadow-lg">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Sliders className="w-4.5 h-4.5 text-white" />
                    <span className="font-bold text-white text-sm">Độ mờ hậu cảnh (Blur)</span>
                  </div>
                  <span className="px-3 py-0.5 rounded-full bg-white/10 text-white font-mono font-bold">{spatialBlur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={spatialBlur}
                  onChange={(e) => updateSetting('spatialGlassBlur', Number(e.target.value))}
                  className="w-full accent-white cursor-pointer h-2"
                />
              </div>

              {/* Slider 2: Opacity */}
              <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 space-y-3.5 shadow-lg">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Droplets className="w-4.5 h-4.5 text-white" />
                    <span className="font-bold text-white text-sm">Độ trong suốt / Đậm màu (Opacity)</span>
                  </div>
                  <span className="px-3 py-0.5 rounded-full bg-white/10 text-white font-mono font-bold">{spatialOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={spatialOpacity}
                  onChange={(e) => updateSetting('spatialGlassOpacity', Number(e.target.value))}
                  className="w-full accent-white cursor-pointer h-2"
                />
              </div>

              {/* Liquid Distortion Toggle */}
              <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 flex items-center justify-between text-xs shadow-lg">
                <div>
                  <div className="font-bold text-white text-sm flex items-center gap-2.5">
                    <Droplet className="w-4.5 h-4.5 text-white" />
                    <span>Liquid Distortion (Biến dạng giọt nước)</span>
                  </div>
                  <div className="text-zinc-400 text-[11px] mt-1">Tạo hiệu ứng thấu kính giọt nước cho capsule search và tab bar</div>
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
              3. CATEGORY: GIAO DIỆN (appearance) - bg-white/[0.04], Bỏ viền
              ===================================================================== */}
          {activeCategory === 'appearance' && (
            <div className="space-y-4">
              {/* Theme Mode */}
              <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 space-y-3.5 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <Palette className="w-5 h-5 text-white" />
                  <h3 className="text-sm font-bold text-white">Chủ đề giao diện (Theme Mode)</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updateSetting('theme', 'dark')}
                    className={`p-3.5 rounded-[14px] flex items-center gap-3 cursor-pointer transition-all ${
                      settings.theme !== 'light'
                        ? 'bg-white/20 text-white font-bold'
                        : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Moon className="w-5 h-5 text-white" />
                    <span className="font-semibold text-xs sm:text-sm">Dark Mode (Tối)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSetting('theme', 'light')}
                    className={`p-3.5 rounded-[14px] flex items-center gap-3 cursor-pointer transition-all ${
                      settings.theme === 'light'
                        ? 'bg-white/20 text-white font-bold'
                        : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Sun className="w-5 h-5 text-white" />
                    <span className="font-semibold text-xs sm:text-sm">Light Mode (Sáng)</span>
                  </button>
                </div>
              </div>

              {/* Navigation Bar Mode */}
              <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 space-y-3.5 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-5 h-5 text-white" />
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
                      className={`p-3 rounded-[12px] text-center font-semibold transition-all cursor-pointer ${
                        (mode.id === 'floaty' && settings.floatyBar) ||
                        (!settings.floatyBar && settings.navigationMode === mode.id)
                          ? 'bg-white/20 text-white font-bold'
                          : 'bg-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wallpaper Presets */}
              <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 space-y-3.5 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <Palette className="w-5 h-5 text-white" />
                  <h3 className="text-sm font-bold text-white">Hình nền ứng dụng (Wallpapers)</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {WALLPAPER_PRESETS.map((wp) => (
                    <button
                      key={wp.id}
                      type="button"
                      onClick={() => updateSetting('appBackground', wp.id)}
                      className={`p-2.5 rounded-[14px] text-left text-xs transition-all flex flex-col gap-2 cursor-pointer ${
                        settings.appBackground === wp.id
                          ? 'bg-white/20 text-white font-bold'
                          : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="w-full h-14 rounded-lg bg-cover bg-center shadow-inner" style={{ backgroundImage: `url(${wp.url})` }} />
                      <span className="truncate">{wp.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography (Font family & scale) */}
              <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 space-y-3.5 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <Type className="w-5 h-5 text-white" />
                  <h3 className="text-sm font-bold text-white">Phông chữ & Cỡ chữ (Typography)</h3>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Phông chữ hệ thống</label>
                  <select
                    value={settings.fontFamily || 'integer'}
                    onChange={(e) => updateSetting('fontFamily', e.target.value as any)}
                    className="w-full bg-black/40 border-0 text-white rounded-xl p-2.5 text-xs focus:outline-none"
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
                        className={`py-2 px-3 rounded-[12px] text-xs font-bold transition-colors cursor-pointer ${
                          settings.fontScale === scale.value
                            ? 'bg-white/20 text-white font-bold'
                            : 'bg-white/5 text-zinc-400 hover:text-white'
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
              4. CATEGORY: TRỢ NĂNG (accessibility) - bg-white/[0.04], Bỏ viền
              ===================================================================== */}
          {activeCategory === 'accessibility' && (
            <div className="space-y-4">
              {/* V-Cursor */}
              <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 space-y-3.5 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <MousePointer className="w-5 h-5 text-white" />
                  <h3 className="text-sm font-bold text-white">Con trỏ chuột tùy chỉnh (V-Cursor)</h3>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">Bật con trỏ chuột đồ họa V-Cursor</div>
                    <div className="text-zinc-400 text-[11px] mt-0.5">Thay thế con trỏ chuột mặc định của hệ điều hành</div>
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
                        className="p-2.5 bg-white/5 hover:bg-white/10 rounded-[12px] text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.fill, border: `1px solid ${preset.border}` }} />
                        <span className="truncate text-white">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* System Sound Effects */}
              <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 flex items-center justify-between text-xs shadow-lg">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-white" />
                  <div>
                    <div className="font-bold text-white text-sm">Âm thanh phản hồi (Pop Sound Effects)</div>
                    <div className="text-zinc-400 text-[11px] mt-0.5">Âm thanh pop nhẹ khi click nút, chuyển tab và tương tác</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => playPopSound()}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs cursor-pointer"
                >
                  Thử âm thanh
                </button>
              </div>

              {/* Inspect Elements Toggle */}
              <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 flex items-center justify-between text-xs shadow-lg">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-white" />
                  <div>
                    <div className="font-bold text-white text-sm">Bộ điều tra phần tử (Inspect Elements)</div>
                    <div className="text-zinc-400 text-[11px] mt-0.5">Bật overlay hover xem CSS, font và cấu trúc layout trực tiếp</div>
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
              5. CATEGORY: CÔNG CỤ (tools) - bg-white/[0.04], Bỏ viền
              ===================================================================== */}
          {activeCategory === 'tools' && (
            <div className="space-y-4">
              {/* Speak For Me (Text to Speech) Card */}
              <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Speak For Me (Text to Speech)</h3>
                    <p className="text-zinc-300 text-xs mt-1 leading-relaxed">
                      Công cụ chuyển văn bản thành giọng nói đa ngôn ngữ với quả cầu âm thanh trực quan và xuất file .mp3.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('vplay:open_speak_for_me'))}
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-extrabold hover:bg-zinc-200 transition-all active:scale-95 shrink-0 flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Mic className="w-4 h-4 text-black" />
                  <span>Mở Speak For Me</span>
                </button>
              </div>

              {/* V-Board (Virtual Keyboard) Card */}
              <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 flex items-center justify-between text-xs shadow-lg">
                <div className="flex items-center gap-3">
                  <Keyboard className="w-5 h-5 text-white" />
                  <div>
                    <div className="font-bold text-white text-sm">Bàn phím ảo V-board Telex</div>
                    <div className="text-zinc-400 text-[11px] mt-0.5">Bật bàn phím ảo khi nhấn vào ô tìm kiếm hoặc soạn thảo</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(flags.experimental_vboard)}
                  onChange={() => toggleFlag('experimental_vboard')}
                  className="w-4.5 h-4.5 accent-white cursor-pointer"
                />
              </div>

              {/* Toolbox broadcast shortcuts */}
              <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 space-y-3.5 text-xs shadow-lg">
                <div className="flex items-center gap-2.5">
                  <Wrench className="w-5 h-5 text-white" />
                  <h3 className="text-sm font-bold text-white">Tiện ích phát sóng truyền hình (Toolbox)</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
                      className="p-3.5 bg-white/5 hover:bg-white/15 rounded-xl text-center font-semibold text-white transition-colors cursor-pointer"
                    >
                      {tool.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              6. CATEGORY: THỬ NGHIỆM (experimental) - bg-white/[0.04], Bỏ viền
              ===================================================================== */}
          {activeCategory === 'experimental' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Trung tâm cờ tính năng (Feature Flags)</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Các công nghệ thử nghiệm của VNRT Online Labs</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate?.('/feature-flags')}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Mở trang Labs riêng</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              <div className="space-y-2.5">
                {FEATURE_FLAGS_DEFINITIONS.map((flag) => {
                  const isEnabled = Boolean(flags[flag.key]);
                  return (
                    <div
                      key={flag.id}
                      className="p-4 bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] flex items-center justify-between gap-3 text-xs shadow-lg hover:bg-white/[0.07] transition-all"
                    >
                      <div className="space-y-1 max-w-lg">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{flag.name}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-white">
                            {flag.badge}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">
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
              7. CATEGORY: GIVE FEEDBACK (feedback) - bg-white/[0.04], Bỏ viền
              ===================================================================== */}
          {activeCategory === 'feedback' && (
            <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 sm:p-6 space-y-4 text-xs shadow-lg">
              <div className="flex items-center gap-3 pb-2">
                <BookOpen className="w-5 h-5 text-white" />
                <div>
                  <h3 className="text-base font-bold text-white">Give Feedback to Vplay Team</h3>
                  <p className="text-zinc-400 text-xs">Đóng góp ý kiến hoặc phản hồi lỗi trải nghiệm</p>
                </div>
              </div>

              {feedbackSubmitted ? (
                <div className="p-6 rounded-[16px] bg-white/10 text-white text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-white mx-auto" />
                  <div className="font-bold text-base">Cảm ơn bạn đã gửi phản hồi!</div>
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
                          className={`px-4 py-2 rounded-[12px] text-xs font-semibold cursor-pointer transition-all ${
                            feedbackType === type
                              ? 'bg-white text-black font-bold'
                              : 'bg-white/5 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {type === 'Suggestion' ? 'Gợi ý' : type === 'Issue' ? 'Báo lỗi' : 'Hỏi đáp'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-300 font-semibold">Đánh giá trải nghiệm</label>
                    <div className="flex items-center gap-1.5">
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
                      className="w-full p-3 rounded-xl bg-black/40 border-0 text-white focus:outline-none text-xs"
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
                      className="w-full p-3 rounded-xl bg-black/40 border-0 text-white focus:outline-none text-xs resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-7 py-3 bg-white text-black font-extrabold rounded-xl hover:bg-zinc-200 transition-colors cursor-pointer shadow-md"
                  >
                    Gửi phản hồi
                  </button>
                </form>
              )}
            </div>
          )}

          {/* =====================================================================
              8. CATEGORY: REDEEM GIFT (redeem_gift) - bg-white/[0.04], Bỏ viền
              ===================================================================== */}
          {activeCategory === 'redeem_gift' && (
            <div className="space-y-4">
              <div className="bg-white/[0.04] backdrop-blur-xl border-0 rounded-[20px] p-5 sm:p-6 space-y-4 text-xs shadow-lg">
                <div className="flex items-center gap-3 pb-2">
                  <Gift className="w-5 h-5 text-white" />
                  <div>
                    <h3 className="text-base font-bold text-white">Redeem Gift VNRT ONLINE</h3>
                    <p className="text-zinc-400 text-xs mt-0.5">Nhập mã 25 ký tự (5x5) để nhận khoáng vật Orbs và gói VIP</p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={redeemCode}
                      onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                      placeholder="VNRT1-ONLINE-GIFTS-2026X-FREE1"
                      className="flex-1 p-3 rounded-xl bg-black/40 border-0 text-white font-mono text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!redeemCode.trim()) return;
                        setRedeemSuccess(`Đã kích hoạt thành công mã ${redeemCode}!`);
                        setTimeout(() => setRedeemSuccess(null), 3000);
                      }}
                      className="px-7 py-3 bg-white text-black font-extrabold rounded-xl hover:bg-zinc-200 cursor-pointer shadow-md"
                    >
                      Kích hoạt
                    </button>
                  </div>

                  {redeemSuccess && (
                    <div className="p-3.5 bg-white/10 rounded-xl text-white font-bold text-center">
                      {redeemSuccess}
                    </div>
                  )}

                  <div className="pt-2">
                    <span className="text-zinc-400 block mb-2 font-semibold">Mã quà tặng mẫu:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { code: 'VNRT1-ONLINE-GIFTS-2026X-FREE1', desc: '+50.000 Orbs & 30 ngày VIP' },
                        { code: 'MINEC-RAFTX-VNRT2-026OR-BS100', desc: '+100.000 Orbs Hoàng Gia' },
                      ].map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => setRedeemCode(item.code)}
                          className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left cursor-pointer flex items-center justify-between transition-colors"
                        >
                          <div>
                            <span className="font-mono text-white block text-xs">{item.code}</span>
                            <span className="text-[11px] text-zinc-400">{item.desc}</span>
                          </div>
                          <Copy className="w-4 h-4 text-white shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
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
