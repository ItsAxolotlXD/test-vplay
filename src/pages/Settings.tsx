import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Key, 
  Search, 
  Type, 
  Check,
  X,
  Sun,
  Moon,
  Bot,
  User,
  RotateCcw,
  RotateCw,
  Sparkles,
  Flag,
  ChevronRight,
  Layout,
  PanelLeft,
  PanelTop,
  PanelRight,
  Compass,
  Monitor,
  Keyboard as KeyboardIcon,
  Sliders,
  Droplets,
  Droplet,
  MousePointer,
  MousePointerClick,
  Info,
  Box,
  Wrench,
  FlaskConical,
  ArrowLeft,
  Columns2
} from 'lucide-react';
import { useSettings, FONT_SCALE_CONFIG, FONT_FAMILY_CONFIG, VBOARD_SKIN_OPTIONS, VBoardSkin, VCURSOR_PRESETS } from '../hooks/useSettings';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import { useTabSearch } from '../context/TabSearchContext';

interface SettingsProps {
  navigate?: (route: string) => void;
  isDrawer?: boolean;
  onClose?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ navigate, isDrawer, onClose }) => {
  const { settings, updateSetting } = useSettings();
  const { flags, setFlag } = useFeatureFlags();
  const { searchQuery, setSearchQuery } = useTabSearch();
  const [activeCategory, setActiveCategory] = useState<'main' | 'about' | 'spatial_glass' | 'appearance' | 'accessibility' | 'tools' | 'experimental'>('main');
  const [inputUserName, setInputUserName] = useState(settings.userName || 'User');
  const [isNameSaved, setIsNameSaved] = useState(false);

  const spatialBlur = typeof settings.spatialGlassBlur === 'number' && !isNaN(settings.spatialGlassBlur)
    ? settings.spatialGlassBlur
    : 20;
  const spatialOpacity = typeof settings.spatialGlassOpacity === 'number' && !isNaN(settings.spatialGlassOpacity)
    ? settings.spatialGlassOpacity
    : 65;

  useEffect(() => {
    setInputUserName(settings.userName || 'User');
  }, [settings.userName]);

  const handleSaveUserName = (nameToSave?: string) => {
    const finalVal = (nameToSave !== undefined ? nameToSave : inputUserName).trim() || 'User';
    updateSetting('userName', finalVal);
    setInputUserName(finalVal);
    setIsNameSaved(true);
    setTimeout(() => setIsNameSaved(false), 2000);
  };

  const [oobeResetTriggered, setOobeResetTriggered] = useState(false);

  const handleResetOobe = () => {
    try {
      localStorage.removeItem('vplay_oobe_completed');
    } catch {}
    setOobeResetTriggered(true);
    window.dispatchEvent(new CustomEvent('vplay:open_oobe'));
    setTimeout(() => setOobeResetTriggered(false), 2000);
  };

  const normalizeSearch = (s: string) =>
    (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .trim();

  const normalizedQuery = normalizeSearch(searchQuery);

  const matchesSearch = (...terms: string[]) => {
    if (!normalizedQuery) return true;
    return terms.some((term) => {
      const normalizedTerm = normalizeSearch(term);
      return (
        normalizedTerm.includes(normalizedQuery) ||
        normalizedQuery.includes(normalizedTerm)
      );
    });
  };

  const isSpatialGlassVisible = matchesSearch(
    'Spatial Glass', 'Kính', 'Glass', 'Độ mờ', 'Độ trong', 'Blur', 'Opacity',
    'Transparency', 'Thành phần', 'Kính không gian', 'Hậu cảnh', 'Trong suốt',
    'Liquid UI', 'Slider', 'Thanh trượt', 'Liquid Distortion', 'Liquid', 'Distortion', 'Giọt nước', 'Thủy tinh'
  );

  const isSection1Visible = matchesSearch(
    'Giao diện', 'Tab View', 'Tabview', 'Tab view', 'Navigation bar',
    'Settings drawer', 'drawer', 'Ngăn kéo', 'Trượt bên phải',
    'floating', 'floats', 'Thanh điều hướng', 'Thanh điều hướng chính',
    'Sidebar', 'Top bar', 'topbar', 'Bố cục',
    'Phông chữ', 'Font', 'Integer', 'Alata',
    'Cỡ chữ ứng dụng', 'Cỡ chữ', 'Cài đặt', 'Settings', 'UI', 'Display',
    'Appearance', 'Splash Screen', 'Reload App', 'Màn hình khởi động', 'Tải lại', 'Refresh',
    'Shiny outline', 'Shiny', 'Outline', 'Viền', 'Viền sáng bóng', 'Specular', 'Rim',
    'V-Cursor', 'VCursor', 'Cursor', 'Con trỏ chuột', 'Con trỏ', 'Chuột', 'Mouse', 'Pointer', 'Bảng màu'
  );

  const isSection2Visible = matchesSearch(
    'Trợ năng', 'Tự động trượt hình Banner', 'Tự động ẩn Sidebar',
    'Accessibility', 'Banner', 'Carousel', 'Sidebar', 'Auto slide', 'Auto hide',
    'Inspect elements', 'Inspect web này', 'Kiểm tra phần tử', 'DevTools', 'DOM', 'Elements', 'Soi phần tử'
  );

  const isSection3Visible = matchesSearch(
    'Copilot', 'Trợ lý ảo', 'Tên người dùng', 'Username', 'User', 'Tên',
    'Hồ sơ', 'Profile', 'Merge Spotlight', 'Hợp nhất', 'Slash', 'Lệnh',
    'AI', 'Chatbot', 'Trợ lý', 'OOBE', 'Setup', 'Thiết lập lần đầu'
  );

  const isSection4Visible = matchesSearch(
    'Tìm kiếm', 'Danh mục', 'Tin tức', 'Truyền hình', 'Toolbox', 'Cài đặt',
    'Search', 'Kênh', 'Quick links', 'Lối tắt', 'Chuyên mục'
  );

  const isFeatureFlagsVisible = matchesSearch(
    'Feature Flags', 'Cờ tính năng', 'Thử nghiệm', 'Experimental',
    'AI Copilot', 'Gỡ lỗi', 'Labs', 'Flags', 'Minimalism', 'Minimal'
  );

  const isAboutVisible = matchesSearch(
    'Giới thiệu', 'Tên người dùng', 'Username', 'User', 'Tên', 'Hồ sơ', 'Profile', 'OOBE', 'About', 'Phiên bản', 'Version'
  );

  const isSearchActive = Boolean(normalizedQuery);
  const showCategoryMenu = !isSearchActive && activeCategory === 'main';
  const showSpatialGlass = isSearchActive ? isSpatialGlassVisible : (activeCategory === 'spatial_glass');
  const showAppearance = isSearchActive ? isSection1Visible : (activeCategory === 'appearance');
  const showAccessibility = isSearchActive ? isSection2Visible : (activeCategory === 'accessibility');
  const showTools = isSearchActive ? (isSection4Visible || matchesSearch('Copilot', 'Lệnh', 'Slash', 'V-Duo')) : (activeCategory === 'tools');
  const showAbout = isSearchActive ? isAboutVisible : (activeCategory === 'about');
  const showExperimental = isSearchActive ? isFeatureFlagsVisible : (activeCategory === 'experimental');

  const hasAnyResults = showCategoryMenu || (isSearchActive ? (isSpatialGlassVisible || isSection1Visible || isSection2Visible || isSection3Visible || isSection4Visible || isFeatureFlagsVisible || isAboutVisible) : true);

  return (
    <div className={isDrawer ? "w-full max-w-full space-y-5 pb-16 pt-1 select-none" : "max-w-2xl mx-auto space-y-6 pb-24 pt-2 select-none"}>
      {/* 1. Header */}
      <div className="space-y-2">
        {/* Back navigation pill if viewing a specific category */}
        {!isSearchActive && activeCategory !== 'main' && (
          <div className="flex items-center gap-2 pt-1 pb-1">
            <button
              type="button"
              onClick={() => setActiveCategory('main')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm border border-white/20"
              title="Quay lại danh mục Cài đặt"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-white" />
              <span>Quay lại Cài đặt</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            <span className="text-white font-bold text-xs uppercase tracking-wider">
              {activeCategory === 'about' && 'Giới thiệu'}
              {activeCategory === 'spatial_glass' && 'Spatial Glass'}
              {activeCategory === 'appearance' && 'Giao diện'}
              {activeCategory === 'accessibility' && 'Trợ năng'}
              {activeCategory === 'tools' && 'Công cụ'}
              {activeCategory === 'experimental' && 'Thử nghiệm'}
            </span>
          </div>
        )}

        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Cài đặt
        </h1>

        {/* Search Bar Capsule with Spotlight Search Styling */}
        <div className="pt-2">
          <div className="w-full h-[46px] sm:h-[48px] flex items-center justify-between px-4 rounded-full spotlight-bubble-box search-box-capsule float-search-style text-sm transition-all border-0 shadow-none">
            <div className="flex items-center gap-3 flex-1 min-w-0 bg-transparent">
              <Search className="w-5 h-5 text-white stroke-[2.4] shrink-0" />
              <input
                id="settings-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm cài đặt..."
                className="w-full bg-transparent text-white placeholder-white/60 text-sm focus:outline-none font-semibold truncate border-0 shadow-none outline-none"
              />
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full text-white/70 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
                title="Xóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* CATEGORY MENU - GRADIENT ICON BACKGROUNDS, WHITE ICONS & TEXT  */}
        {/* ============================================================== */}
        {showCategoryMenu && (
          <div className="space-y-4 pt-2 animate-in fade-in duration-200">
            {/* Group 1 Card: Giới thiệu, Spatial Glass, Giao diện, Trợ năng */}
            <div className="settings-category-menu-group rounded-[24px] bg-[#222225] border-0 overflow-hidden shadow-2xl">
              {/* Row 1: Giới thiệu */}
              <div 
                id="category-item-about"
                onClick={() => setActiveCategory('about')}
                className="p-4 sm:p-4.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.04] active:bg-white/[0.07] transition-colors group border-0"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#22c55e] to-[#16a34a] text-white flex items-center justify-center shrink-0 shadow-md border-0">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-white text-[15px] sm:text-base transition-colors">
                    Giới thiệu
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors shrink-0" />
              </div>

              {/* Divider: 1 thanh màu solid thường màu xám tối nhẹ */}
              <div className="h-[1px] bg-[#323236] ml-16" />

              {/* Row 2: Spatial Glass */}
              <div 
                id="category-item-spatial-glass"
                onClick={() => setActiveCategory('spatial_glass')}
                className="p-4 sm:p-4.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.04] active:bg-white/[0.07] transition-colors group border-0"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#ef4444] to-[#dc2626] text-white flex items-center justify-center shrink-0 shadow-md border-0">
                    <Box className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-white text-[15px] sm:text-base transition-colors">
                    Spatial Glass
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors shrink-0" />
              </div>

              {/* Divider: 1 thanh màu solid thường màu xám tối nhẹ */}
              <div className="h-[1px] bg-[#323236] ml-16" />

              {/* Row 3: Giao diện */}
              <div 
                id="category-item-appearance"
                onClick={() => setActiveCategory('appearance')}
                className="p-4 sm:p-4.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.04] active:bg-white/[0.07] transition-colors group border-0"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#ef4444] to-[#dc2626] text-white flex items-center justify-center shrink-0 shadow-md border-0">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-white text-[15px] sm:text-base transition-colors">
                    Giao diện
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors shrink-0" />
              </div>

              {/* Divider: 1 thanh màu solid thường màu xám tối nhẹ */}
              <div className="h-[1px] bg-[#323236] ml-16" />

              {/* Row 4: Trợ năng */}
              <div 
                id="category-item-accessibility"
                onClick={() => setActiveCategory('accessibility')}
                className="p-4 sm:p-4.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.04] active:bg-white/[0.07] transition-colors group border-0"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#f59e0b] to-[#d97706] text-white flex items-center justify-center shrink-0 shadow-md border-0">
                    <Key className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-white text-[15px] sm:text-base transition-colors">
                    Trợ năng
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors shrink-0" />
              </div>
            </div>

            {/* Group 2 Card: Công cụ, Thử nghiệm */}
            <div className="settings-category-menu-group rounded-[24px] bg-[#222225] border-0 overflow-hidden shadow-2xl mt-4">
              {/* Row 5: Công cụ */}
              <div 
                id="category-item-tools"
                onClick={() => setActiveCategory('tools')}
                className="p-4 sm:p-4.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.04] active:bg-white/[0.07] transition-colors group border-0"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#6b7280] to-[#4b5563] text-white flex items-center justify-center shrink-0 shadow-md border-0">
                    <Wrench className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-white text-[15px] sm:text-base transition-colors">
                    Công cụ
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors shrink-0" />
              </div>

              {/* Divider: 1 thanh màu solid thường màu xám tối nhẹ */}
              <div className="h-[1px] bg-[#323236] ml-16" />

              {/* Row 6: Thử nghiệm */}
              <div 
                id="category-item-experimental"
                onClick={() => setActiveCategory('experimental')}
                className="p-4 sm:p-4.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.04] active:bg-white/[0.07] transition-colors group border-0"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#6b7280] to-[#4b5563] text-white flex items-center justify-center shrink-0 shadow-md border-0">
                    <FlaskConical className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-white text-[15px] sm:text-base transition-colors">
                    Thử nghiệm
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors shrink-0" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 0. Section Spatial Glass: Tùy chỉnh độ mờ (Blur) & độ trong (Opacity) */}
      {showSpatialGlass && (
        <section 
          id="settings-section-spatial-glass"
          className="settings-category-section p-5 sm:p-6 rounded-[28px] bg-transparent backdrop-blur-2xl border-0 shadow-xl space-y-5"
        >
          {/* Section Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#ef4444] to-[#dc2626] text-white flex items-center justify-center shrink-0 shadow-md mt-0.5 border-0">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white leading-tight">
                    Spatial Glass
                  </h2>
                </div>
              </div>
            </div>

            {/* Reset to defaults button */}
            {(spatialBlur !== 20 || spatialOpacity !== 65) && (
              <button
                type="button"
                id="btn-reset-spatial-glass"
                onClick={() => {
                  updateSetting('spatialGlassBlur', 20);
                  updateSetting('spatialGlassOpacity', 65);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-semibold transition-all cursor-pointer shrink-0"
                title="Khôi phục mặc định (20px / 65%)"
              >
                <RotateCcw className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Mặc định</span>
              </button>
            )}
          </div>

          {/* Interactive Live Glass Preview Banner */}
          <div className="relative w-full h-32 sm:h-36 rounded-[22px] overflow-hidden border border-white/20 shadow-inner flex items-center justify-center p-4">
            {/* Colorful vibrant background mimicking wallpapers/content */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-300"
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 30%, #FBBF24 0%, transparent 40%), radial-gradient(circle at 80% 40%, #E6007A 0%, transparent 45%), radial-gradient(circle at 50% 80%, #388BFD 0%, transparent 50%), linear-gradient(135deg, #111827 0%, #1e1b4b 50%, #0f172a 100%)'
              }}
            >
              {/* Grid texture for depth */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:16px_16px]" />
            </div>

            {/* Live Spatial Glass Card Element inside preview */}
            <div 
              className={`relative z-10 w-full max-w-sm rounded-[18px] p-3.5 sm:p-4 text-center transition-all duration-300 flex items-center justify-between gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.36)] border border-white/25 spatial-liquid-card ${
                settings.liquidDistortion ? 'liquid-droplet-active' : ''
              }`}
              style={{
                backdropFilter: `blur(${spatialBlur}px) saturate(${settings.liquidDistortion ? 220 : 175}%) contrast(${settings.liquidDistortion ? 110 : 100}%)`,
                WebkitBackdropFilter: `blur(${spatialBlur}px) saturate(${settings.liquidDistortion ? 220 : 175}%) contrast(${settings.liquidDistortion ? 110 : 100}%)`,
                backgroundColor: `rgba(28, 27, 36, ${spatialOpacity / 100})`,
                ...(settings.liquidDistortion ? {
                  borderRadius: '34px 22px 30px 24px / 24px 32px 22px 34px',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.45), inset 0 2.5px 12px rgba(255,255,255,0.5), inset 0 -2.5px 10px rgba(0,0,0,0.35)',
                } : {})
              }}
            >
              <div className="flex items-center gap-3 text-left min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow transition-all ${
                  settings.liquidDistortion 
                    ? 'bg-sky-500/30 border border-sky-300/50 text-sky-200' 
                    : 'bg-white/20 border border-white/30 text-white'
                }`}>
                  {settings.liquidDistortion ? (
                    <Droplet className="w-4.5 h-4.5 text-sky-300 animate-pulse" />
                  ) : (
                    <Sparkles className="w-4.5 h-4.5 text-white" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-xs sm:text-sm text-white tracking-tight truncate drop-shadow flex items-center gap-1.5">
                    <span>Kính xem trước (Live Preview)</span>
                    {settings.liquidDistortion && (
                      <span className="text-[10px] text-sky-300 font-semibold px-1.5 py-0.2 rounded bg-sky-500/20 border border-sky-400/30">
                        💧 Liquid
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-white/90 font-mono">
                    Blur: {spatialBlur}px • Opacity: {spatialOpacity}% {settings.liquidDistortion && '• Liquid: ON'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Preset Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            <span className="text-[11px] font-semibold text-white/80 shrink-0 mr-1">
              Mẫu sẵn:
            </span>
            {[
              { label: 'Mặc định', blur: 20, opacity: 65 },
              { label: 'Kính siêu trong', blur: 12, opacity: 30 },
              { label: 'Mờ sương đục', blur: 32, opacity: 80 },
              { label: 'Tối mờ sâu', blur: 40, opacity: 85 },
              { label: 'Màu phẳng (Solid)', blur: 0, opacity: 95 },
            ].map((preset) => {
              const isActive = spatialBlur === preset.blur && spatialOpacity === preset.opacity;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    updateSetting('spatialGlassBlur', preset.blur);
                    updateSetting('spatialGlassOpacity', preset.opacity);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-white text-black font-bold shadow-md' 
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-4 pt-1">
            {/* Slider 1: Độ mờ (Blur) */}
            <div 
              id="settings-card-spatial-blur"
              className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4.5 h-4.5 text-white" />
                  <div>
                    <span className="font-semibold text-white text-sm block">
                      Độ mờ hậu cảnh (Blur)
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/20">
                  {spatialBlur}px
                </span>
              </div>

              {/* Slider Capsule */}
              <div className="pt-1">
                <div className="group relative w-full h-14 sm:h-16 rounded-[24px] bg-white/[0.04] border border-white/20 flex items-center px-6 transition-all settings-slider-capsule">
                  <div className="relative w-full h-2 rounded-full bg-white/20 overflow-visible">
                    {/* Active Track */}
                    <div 
                      className="absolute left-0 top-0 h-full rounded-full bg-white transition-all duration-75 ease-out shadow-[0_0_12px_rgba(255,255,255,0.5)]"
                      style={{ width: `${(spatialBlur / 50) * 100}%` }}
                    />
                    
                    {/* Handle Thumb */}
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-6 rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.5)] transition-all duration-75 ease-out pointer-events-none flex items-center justify-center group-hover:scale-125"
                      style={{ left: `${(spatialBlur / 50) * 100}%` }}
                    >
                      <div className="w-4 h-1 rounded-full bg-black/60" />
                    </div>
                  </div>

                  {/* Native Range Input */}
                  <input
                    id="slider-spatial-glass-blur"
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={spatialBlur}
                    onChange={(e) => updateSetting('spatialGlassBlur', parseInt(e.target.value, 10))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    aria-label="Độ mờ Spatial Glass (Blur)"
                  />
                </div>

                {/* Markers */}
                <div className="flex items-center justify-between text-[11px] pt-2 px-2 text-white/70 font-mono">
                  <span>0px (Rõ nét)</span>
                  <span>20px (Chuẩn)</span>
                  <span>35px (Mờ sâu)</span>
                  <span>50px (Tối đa)</span>
                </div>
              </div>
            </div>

            {/* Slider 2: Độ trong suốt (Opacity) */}
            <div 
              id="settings-card-spatial-opacity"
              className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Droplets className="w-4.5 h-4.5 text-white" />
                  <div>
                    <span className="font-semibold text-white text-sm block">
                      Độ trong suốt / Đậm màu (Opacity)
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/20">
                  {spatialOpacity}%
                </span>
              </div>

              {/* Slider Capsule */}
              <div className="pt-1">
                <div className="group relative w-full h-14 sm:h-16 rounded-[24px] bg-white/[0.04] border border-white/20 flex items-center px-6 transition-all settings-slider-capsule">
                  <div className="relative w-full h-2 rounded-full bg-white/20 overflow-visible">
                    {/* Active Track */}
                    <div 
                      className="absolute left-0 top-0 h-full rounded-full bg-white transition-all duration-75 ease-out shadow-[0_0_12px_rgba(255,255,255,0.5)]"
                      style={{ width: `${((spatialOpacity - 5) / 95) * 100}%` }}
                    />
                    
                    {/* Handle Thumb */}
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-6 rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.5)] transition-all duration-75 ease-out pointer-events-none flex items-center justify-center group-hover:scale-125"
                      style={{ left: `${((spatialOpacity - 5) / 95) * 100}%` }}
                    >
                      <div className="w-4 h-1 rounded-full bg-black/60" />
                    </div>
                  </div>

                  {/* Native Range Input */}
                  <input
                    id="slider-spatial-glass-opacity"
                    type="range"
                    min="5"
                    max="100"
                    step="1"
                    value={spatialOpacity}
                    onChange={(e) => updateSetting('spatialGlassOpacity', parseInt(e.target.value, 10))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    aria-label="Độ trong suốt Spatial Glass (Opacity)"
                  />
                </div>

                {/* Markers */}
                <div className="flex items-center justify-between text-[11px] pt-2 px-2 text-white/70 font-mono">
                  <span>5% (Siêu trong)</span>
                  <span>40% (Thoáng)</span>
                  <span>65% (Chuẩn)</span>
                  <span>100% (Đậm kín)</span>
                </div>
              </div>
            </div>

            {/* Option con: Liquid Distortion */}
            <div 
              id="settings-card-liquid-distortion"
              className={`settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] space-y-3 transition-all ${
                settings.liquidDistortion ? 'ring-1 ring-sky-400/40 bg-sky-500/[0.04]' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-semibold text-white text-sm flex items-center gap-2">
                    <Droplet className="w-4.5 h-4.5 text-sky-400" />
                    <span>Liquid Distortion</span>
                    {settings.liquidDistortion && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 animate-pulse">
                        Đang bật
                      </span>
                    )}
                  </div>
                </div>

                {/* Orange Toggle Switch */}
                <button
                  id="toggle-liquid-distortion"
                  type="button"
                  role="switch"
                  aria-checked={Boolean(settings.liquidDistortion)}
                  onClick={() => updateSetting('liquidDistortion', !settings.liquidDistortion)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center border border-white/20 ${
                    settings.liquidDistortion ? 'bg-[#FF6A00]' : 'bg-white/15'
                  }`}
                  aria-label="Bật hoặc tắt Liquid Distortion"
                >
                  <span
                    className={`w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      settings.liquidDistortion ? 'translate-x-5.5 bg-white' : 'translate-x-0 bg-white'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Section 1: Giao diện */}
      {showAppearance && (
        <section 
          id="settings-section-interface"
          className="settings-category-section p-5 sm:p-6 rounded-[28px] bg-transparent backdrop-blur-2xl border-0 shadow-xl space-y-4"
        >
          {/* Section Header */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#ef4444] to-[#dc2626] text-white flex items-center justify-center shrink-0 shadow-md mt-0.5 border-0">
              <Palette className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Giao diện
              </h2>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {/* Card 1: Thanh điều hướng chính (Top bar, Sidebar, hoặc Tab View) */}
            {(matchesSearch('Thanh điều hướng chính') ||
              matchesSearch('Thanh điều hướng') ||
              matchesSearch('Navigation') ||
              matchesSearch('Top bar') ||
              matchesSearch('Sidebar') ||
              matchesSearch('Tab View') ||
              matchesSearch('Tabview') ||
              matchesSearch('Bố cục') ||
              matchesSearch('Giao diện')) && (
              <div 
                id="settings-card-main-navigation"
                className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] space-y-3.5 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-white text-sm flex items-center gap-2">
                      <Layout className="w-4.5 h-4.5 text-white" />
                      <span>Thanh điều hướng chính</span>
                    </div>
                  </div>
                </div>

                {/* Grid 3 tùy chọn: Top bar, Sidebar, hoặc Tab View */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Tùy chọn 1: Top bar */}
                  <button
                    id="setting-nav-topbar"
                    type="button"
                    onClick={() => {
                      updateSetting('navigationMode', 'topbar');
                      updateSetting('floatyBar', false);
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer relative group ${
                      settings.navigationMode === 'topbar' && !settings.floatyBar
                        ? 'bg-white/10 border-white shadow-[0_0_16px_rgba(255,255,255,0.15)] ring-1 ring-white'
                        : 'bg-white/[0.03] border-white/15 hover:border-white/30 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                        settings.navigationMode === 'topbar' && !settings.floatyBar
                          ? 'bg-white text-black'
                          : 'bg-white/10 text-white/60 group-hover:text-white'
                      }`}>
                        <PanelTop className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-sm font-bold text-white block">Top bar</span>
                    </div>

                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      settings.navigationMode === 'topbar' && !settings.floatyBar
                        ? 'bg-white text-black'
                        : 'border border-white/20 text-transparent'
                    }`}>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </button>

                  {/* Tùy chọn 2: Sidebar */}
                  <button
                    id="setting-nav-sidebar"
                    type="button"
                    onClick={() => {
                      updateSetting('navigationMode', 'sidebar');
                      updateSetting('floatyBar', false);
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer relative group ${
                      settings.navigationMode === 'sidebar' && !settings.floatyBar
                        ? 'bg-white/10 border-white shadow-[0_0_16px_rgba(255,255,255,0.15)] ring-1 ring-white'
                        : 'bg-white/[0.03] border-white/15 hover:border-white/30 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                        settings.navigationMode === 'sidebar' && !settings.floatyBar
                          ? 'bg-white text-black'
                          : 'bg-white/10 text-white/60 group-hover:text-white'
                      }`}>
                        <PanelLeft className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-sm font-bold text-white block">Sidebar</span>
                    </div>

                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      settings.navigationMode === 'sidebar' && !settings.floatyBar
                        ? 'bg-white text-black'
                        : 'border border-white/20 text-transparent'
                    }`}>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </button>

                  {/* Tùy chọn 3: Tab View */}
                  <button
                    id="setting-nav-tabview"
                    type="button"
                    onClick={() => {
                      updateSetting('navigationMode', 'tabview');
                      updateSetting('floatyBar', true);
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer relative group ${
                      settings.navigationMode === 'tabview' || settings.floatyBar
                        ? 'bg-white/10 border-white shadow-[0_0_16px_rgba(255,255,255,0.15)] ring-1 ring-white'
                        : 'bg-white/[0.03] border-white/15 hover:border-white/30 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                        settings.navigationMode === 'tabview' || settings.floatyBar
                          ? 'bg-white text-black'
                          : 'bg-white/10 text-white/60 group-hover:text-white'
                      }`}>
                        <Compass className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-sm font-bold text-white block">Tab View</span>
                    </div>

                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      settings.navigationMode === 'tabview' || settings.floatyBar
                        ? 'bg-white text-black'
                        : 'border border-white/20 text-transparent'
                    }`}>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Card: Settings drawer (Feature Flag) */}
            {(matchesSearch('Settings drawer') ||
              matchesSearch('drawer') ||
              matchesSearch('Ngăn kéo') ||
              matchesSearch('Trượt bên phải') ||
              matchesSearch('Cài đặt') ||
              matchesSearch('Giao diện')) && (
              <div 
                id="settings-card-settings-drawer"
                className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent flex items-center justify-between gap-4 transition-colors border border-white/20 hover:border-white/40 hover:bg-white/[0.03]"
              >
                <div>
                  <div className="font-semibold text-white text-sm flex items-center gap-2">
                    <PanelRight className="w-4.5 h-4.5 text-white" />
                    <span>Settings drawer</span>
                  </div>
                </div>

                {/* Orange Switch Toggle */}
                <button
                  id="toggle-settings-drawer"
                  type="button"
                  role="switch"
                  aria-checked={Boolean(flags.settings_drawer)}
                  onClick={() => {
                    const next = !flags.settings_drawer;
                    setFlag('settings_drawer', next);
                  }}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center border border-white/20 ${
                    flags.settings_drawer ? 'bg-[#FF6A00]' : 'bg-white/15'
                  }`}
                >
                  <span
                    className={`w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      flags.settings_drawer ? 'translate-x-5.5 bg-white' : 'translate-x-0 bg-white'
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Card: Shiny outline */}
            {(matchesSearch('Shiny outline') ||
              matchesSearch('Shiny') ||
              matchesSearch('Outline') ||
              matchesSearch('Viền') ||
              matchesSearch('Viền sáng bóng') ||
              matchesSearch('Specular') ||
              matchesSearch('Giao diện')) && (
              <div 
                id="settings-card-shiny-outline"
                className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent flex items-center justify-between gap-4 transition-colors border border-white/20 hover:border-white/40 hover:bg-white/[0.03]"
              >
                <div className="space-y-1">
                  <div className="font-semibold text-white text-sm flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-white" />
                    <span>Shiny outline</span>
                  </div>
                </div>

                {/* Orange Toggle Switch */}
                <button
                  id="toggle-shiny-outline"
                  type="button"
                  role="switch"
                  aria-checked={settings.shinyOutline !== false}
                  onClick={() => updateSetting('shinyOutline', settings.shinyOutline === false ? true : false)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center border border-white/20 ${
                    settings.shinyOutline !== false ? 'bg-[#FF6A00]' : 'bg-white/15'
                  }`}
                >
                  <span
                    className={`w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      settings.shinyOutline !== false ? 'translate-x-5.5 bg-white' : 'translate-x-0 bg-white'
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Card: V-Cursor (Con trỏ chuột tùy biến VPlay) */}
            {(matchesSearch('V-Cursor') ||
              matchesSearch('VCursor') ||
              matchesSearch('Cursor') ||
              matchesSearch('Con trỏ chuột') ||
              matchesSearch('Con trỏ') ||
              matchesSearch('Chuột') ||
              matchesSearch('Mouse') ||
              matchesSearch('Pointer') ||
              matchesSearch('Bảng màu') ||
              matchesSearch('Giao diện')) && (
              <div 
                id="settings-card-vcursor"
                className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent space-y-4 transition-colors border border-white/20 hover:border-white/40 hover:bg-white/[0.03]"
              >
                {/* Header row with Title and Toggle */}
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-semibold text-white text-sm flex items-center gap-2">
                      <MousePointer className="w-4.5 h-4.5 text-white" />
                      <span>V-Cursor</span>
                    </div>
                  </div>

                  {/* Orange Toggle Switch */}
                  <button
                    id="toggle-vcursor-enabled"
                    type="button"
                    role="switch"
                    aria-checked={Boolean(settings.vcursorEnabled)}
                    onClick={() => updateSetting('vcursorEnabled', !settings.vcursorEnabled)}
                    className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center border border-white/20 ${
                      settings.vcursorEnabled ? 'bg-[#FF6A00]' : 'bg-white/15'
                    }`}
                  >
                    <span
                      className={`w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        settings.vcursorEnabled ? 'translate-x-5.5 bg-white' : 'translate-x-0 bg-white'
                      }`}
                    />
                  </button>
                </div>

                {/* Sub-controls when V-Cursor is enabled */}
                {Boolean(settings.vcursorEnabled) && (
                  <div className="space-y-4 pt-2 border-t border-white/15">
                    {/* 1. Interactive Preview Stage */}
                    <div className="p-4 rounded-xl bg-black/40 border border-white/15 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {/* Live Cursor Visualizer */}
                        <div className="w-14 h-14 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center relative overflow-hidden group shadow-inner">
                          <svg
                            width={Math.max(20, Math.min(32, settings.vcursorSize || 24))}
                            height={Math.max(20, Math.min(32, settings.vcursorSize || 24))}
                            viewBox="0 0 24 24"
                            className="select-none transition-transform group-hover:scale-110"
                            style={{
                              filter: settings.vcursorGlow
                                ? `drop-shadow(0 0 8px ${settings.vcursorColor || '#000000'}) drop-shadow(0 2px 4px rgba(0,0,0,0.5))`
                                : 'drop-shadow(0 2px 4px rgba(0,0,0,0.45))',
                            }}
                          >
                            <path
                              d="M 1.5 1.5 L 1.5 19.5 L 6.5 15.2 L 10.8 23.2 L 13.8 21.6 L 9.6 13.8 L 16 13.8 Z"
                              fill={settings.vcursorColor || '#000000'}
                              stroke={settings.vcursorBorderColor || '#FFFFFF'}
                              strokeWidth="1.5"
                              strokeLinejoin="round"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>

                        <div>
                          <div className="text-xs font-semibold text-white flex items-center gap-2">
                            <span>Bản xem trước trực tiếp</span>
                            <span className="text-[10px] text-white/60 font-normal">
                              ({settings.vcursorSize || 24}px)
                            </span>
                          </div>
                          <div className="text-[11px] text-white/70 mt-0.5">
                            Thân: <span className="font-mono text-white font-medium">{settings.vcursorColor || '#000000'}</span> • Viền: <span className="font-mono text-white font-medium">{settings.vcursorBorderColor || '#FFFFFF'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive sandbox buttons for immediate test */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 border border-white/15"
                        >
                          <MousePointerClick className="w-3.5 h-3.5 text-white" />
                          <span>Rê chuột thử</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateSetting('vcursorColor', '#000000');
                            updateSetting('vcursorBorderColor', '#FFFFFF');
                            updateSetting('vcursorSize', 24);
                            updateSetting('vcursorGlow', false);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/15 active:scale-95 text-white/80 hover:text-white text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 border border-white/10"
                          title="Đặt lại con trỏ macOS chuẩn (đen viền trắng 24px)"
                        >
                          <RotateCcw className="w-3 h-3 text-white" />
                          <span>Đặt lại macOS</span>
                        </button>
                      </div>
                    </div>

                    {/* 2. Presets Palette */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-white flex items-center justify-between">
                        <span>Mẫu con trỏ có sẵn</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {VCURSOR_PRESETS.map((preset) => {
                          const isSelected =
                            (settings.vcursorColor || '#000000').toLowerCase() === preset.fill.toLowerCase() &&
                            (settings.vcursorBorderColor || '#FFFFFF').toLowerCase() === preset.border.toLowerCase();

                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => {
                                updateSetting('vcursorColor', preset.fill);
                                updateSetting('vcursorBorderColor', preset.border);
                              }}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 relative ${
                                isSelected
                                  ? 'bg-white/15 border-white ring-1 ring-white/30 shadow-md'
                                  : 'bg-white/[0.03] border-white/15 hover:border-white/30 hover:bg-white/[0.06]'
                              }`}
                            >
                              {/* Mini Cursor Icon */}
                              <div className="w-7 h-7 rounded-lg bg-black/40 border border-white/15 flex items-center justify-center shrink-0">
                                <svg width="15" height="15" viewBox="0 0 24 24" className="select-none">
                                  <path
                                    d="M 1.5 1.5 L 1.5 19.5 L 6.5 15.2 L 10.8 23.2 L 13.8 21.6 L 9.6 13.8 L 16 13.8 Z"
                                    fill={preset.fill}
                                    stroke={preset.border}
                                    strokeWidth="2"
                                  />
                                </svg>
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-semibold text-white truncate flex items-center gap-1">
                                  <span>{preset.name}</span>
                                </div>
                              </div>

                              {isSelected && (
                                <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-white text-black flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. Custom Color Palette (Thân & Viền) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Thân con trỏ (Fill) */}
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/15 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                            <Droplets className="w-3.5 h-3.5 text-white" />
                            <span>Màu thân con trỏ</span>
                          </span>
                          <span className="text-[11px] font-mono font-medium text-white/80">
                            {settings.vcursorColor || '#000000'}
                          </span>
                        </div>

                        {/* Quick Color Chips */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {[
                            '#000000',
                            '#FFFFFF',
                            '#E6005A',
                            '#EF4444',
                            '#F97316',
                            '#F59E0B',
                            '#10B981',
                            '#00E5FF',
                            '#3B82F6',
                            '#8B5CF6',
                          ].map((hex) => {
                            const isPicked = (settings.vcursorColor || '#000000').toLowerCase() === hex.toLowerCase();
                            return (
                              <button
                                key={hex}
                                type="button"
                                onClick={() => updateSetting('vcursorColor', hex)}
                                className={`w-6 h-6 rounded-full border transition-all cursor-pointer relative ${
                                  isPicked ? 'scale-110 ring-2 ring-white shadow-md' : 'hover:scale-105'
                                }`}
                                style={{ backgroundColor: hex, borderColor: hex === '#000000' ? '#444' : '#fff' }}
                                title={hex}
                              />
                            );
                          })}

                          {/* Native Color Picker */}
                          <label className="w-6 h-6 rounded-full border border-dashed border-white/40 flex items-center justify-center cursor-pointer hover:border-white transition-colors overflow-hidden relative">
                            <input
                              type="color"
                              value={settings.vcursorColor || '#000000'}
                              onChange={(e) => updateSetting('vcursorColor', e.target.value)}
                              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                              title="Chọn màu tự do"
                            />
                            <Palette className="w-3 h-3 text-white pointer-events-none" />
                          </label>
                        </div>
                      </div>

                      {/* Viền con trỏ (Border / Stroke) */}
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/15 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                            <Sliders className="w-3.5 h-3.5 text-white" />
                            <span>Màu viền con trỏ</span>
                          </span>
                          <span className="text-[11px] font-mono font-medium text-white/80">
                            {settings.vcursorBorderColor || '#FFFFFF'}
                          </span>
                        </div>

                        {/* Quick Border Color Chips */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {[
                            '#FFFFFF',
                            '#000000',
                            '#00E5FF',
                            '#F59E0B',
                            '#E6005A',
                            '#10B981',
                            '#E4E4E7',
                            '#52525B',
                          ].map((hex) => {
                            const isPicked = (settings.vcursorBorderColor || '#FFFFFF').toLowerCase() === hex.toLowerCase();
                            return (
                              <button
                                key={hex}
                                type="button"
                                onClick={() => updateSetting('vcursorBorderColor', hex)}
                                className={`w-6 h-6 rounded-full border transition-all cursor-pointer relative ${
                                  isPicked ? 'scale-110 ring-2 ring-white shadow-md' : 'hover:scale-105'
                                }`}
                                style={{ backgroundColor: hex, borderColor: hex === '#000000' ? '#444' : '#fff' }}
                                title={hex}
                              />
                            );
                          })}

                          {/* Native Color Picker */}
                          <label className="w-6 h-6 rounded-full border border-dashed border-white/40 flex items-center justify-center cursor-pointer hover:border-white transition-colors overflow-hidden relative">
                            <input
                              type="color"
                              value={settings.vcursorBorderColor || '#FFFFFF'}
                              onChange={(e) => updateSetting('vcursorBorderColor', e.target.value)}
                              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                              title="Chọn màu viền tự do"
                            />
                            <Palette className="w-3 h-3 text-white pointer-events-none" />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* 4. Cursor Size & Glow Effect */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                      {/* Size Selector */}
                      <div className="space-y-1.5 w-full sm:w-auto">
                        <div className="text-xs font-semibold text-white">Kích thước con trỏ</div>
                        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/15">
                          {[
                            { label: 'Nhỏ (20px)', val: 20 },
                            { label: 'Chuẩn macOS (24px)', val: 24 },
                            { label: 'Lớn (28px)', val: 28 },
                            { label: 'Rất lớn (34px)', val: 34 },
                          ].map((sz) => {
                            const isSelected = (settings.vcursorSize || 24) === sz.val;
                            return (
                              <button
                                key={sz.val}
                                type="button"
                                onClick={() => updateSetting('vcursorSize', sz.val)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-white text-black shadow-md font-bold'
                                    : 'text-white/60 hover:text-white'
                                }`}
                              >
                                {sz.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Glow Toggle */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                        <div>
                          <div className="text-xs font-semibold text-white">Phát sáng Neon</div>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={Boolean(settings.vcursorGlow)}
                          onClick={() => updateSetting('vcursorGlow', !settings.vcursorGlow)}
                          className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer shrink-0 flex items-center border border-white/20 ${
                            settings.vcursorGlow ? 'bg-[#FF6A00]' : 'bg-white/15'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                              settings.vcursorGlow ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Card 1.5: Phông chữ (Checkbox List: Integer, Alata) */}
            {(matchesSearch('Phông chữ') ||
              matchesSearch('Font') ||
              matchesSearch('Integer') ||
              matchesSearch('Alata') ||
              matchesSearch('Giao diện')) && (
              <div 
                id="settings-card-font-family"
                className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] space-y-3.5 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-white text-sm flex items-center gap-2">
                      <Type className="w-4.5 h-4.5 text-white" />
                      <span>Phông chữ</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white border border-white/20 shrink-0">
                    {FONT_FAMILY_CONFIG.find(f => f.id === settings.fontFamily)?.name || 'Integer'}
                  </span>
                </div>

                {/* Checkbox Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {FONT_FAMILY_CONFIG.map((font) => {
                    const isSelected = settings.fontFamily === font.id;
                    return (
                      <button
                        key={font.id}
                        id={`setting-font-${font.id}`}
                        type="button"
                        onClick={() => updateSetting('fontFamily', font.id)}
                        className={`p-3.5 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer relative group ${
                          isSelected
                            ? 'bg-white/10 border-white shadow-[0_0_16px_rgba(255,255,255,0.15)] ring-1 ring-white'
                            : 'bg-white/[0.03] border-white/15 hover:border-white/30 hover:bg-white/[0.06]'
                        }`}
                      >
                        {/* Checkbox Box Element */}
                        <div 
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-150 ${
                            isSelected
                              ? 'bg-white border-white text-black shadow-sm'
                              : 'border-white/30 bg-transparent text-transparent group-hover:border-white/60'
                          }`}
                          aria-checked={isSelected}
                          role="checkbox"
                        >
                          <Check className={`w-3.5 h-3.5 stroke-[3] transition-transform ${isSelected ? 'scale-100' : 'scale-50 opacity-0'}`} />
                        </div>

                        {/* Font Title & Preview */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span 
                              className={`text-sm font-semibold transition-colors ${
                                isSelected ? 'text-white' : 'text-white/80 group-hover:text-white'
                              }`}
                              style={{ fontFamily: font.cssFamily }}
                            >
                              {font.name}
                            </span>
                          </div>
                          <div 
                            className="text-xs text-white/80 mt-2 px-2 py-1 rounded-lg bg-black/40 border border-white/15 truncate tracking-wide"
                            style={{ fontFamily: font.cssFamily }}
                          >
                            VNRT Online: Truyền hình trực tuyến 2026
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Card: Giao diện bàn phím ảo V-board */}
            {(matchesSearch('bàn phím') ||
              matchesSearch('keyboard') ||
              matchesSearch('vboard') ||
              matchesSearch('v-keyboard') ||
              matchesSearch('skin') ||
              matchesSearch('iOS') ||
              matchesSearch('Google') ||
              matchesSearch('Macbook') ||
              matchesSearch('Butterfly') ||
              matchesSearch('Physical') ||
              matchesSearch('3D') ||
              matchesSearch('Giao diện')) && (
              <div 
                id="settings-card-vboard-skin"
                className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] space-y-4 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-white text-sm flex items-center gap-2">
                      <KeyboardIcon className="w-4.5 h-4.5 text-white" />
                      <span>Giao diện bàn phím ảo (V-Board Skins)</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white border border-white/20 shrink-0">
                    {VBOARD_SKIN_OPTIONS.find(s => s.id === (settings.vboardSkin || 'default'))?.name.split(' ')[0] || 'Default'}
                  </span>
                </div>

                {/* Skin Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                  {VBOARD_SKIN_OPTIONS.map((skinOption) => {
                    const isSelected = (settings.vboardSkin || 'default') === skinOption.id;
                    return (
                      <button
                        key={skinOption.id}
                        id={`setting-vboard-skin-${skinOption.id}`}
                        type="button"
                        onClick={() => updateSetting('vboardSkin', skinOption.id)}
                        className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer relative group ${
                          isSelected
                            ? 'bg-white/10 border-white shadow-[0_0_18px_rgba(255,255,255,0.15)] ring-1 ring-white'
                            : 'bg-white/[0.03] border-white/15 hover:border-white/30 hover:bg-white/[0.06]'
                        }`}
                      >
                        {/* Header: Title + Checkbox */}
                        <div className="flex items-start justify-between gap-2 w-full">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-sm font-semibold transition-colors ${
                                isSelected ? 'text-white' : 'text-white/80 group-hover:text-white'
                              }`}>
                                {skinOption.name}
                              </span>
                            </div>
                          </div>

                          <div 
                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-150 ${
                              isSelected
                                ? 'bg-white border-white text-black shadow-sm'
                                : 'border-white/30 bg-transparent text-transparent group-hover:border-white/60'
                            }`}
                            aria-checked={isSelected}
                            role="checkbox"
                          >
                            <Check className={`w-3.5 h-3.5 stroke-[3] transition-transform ${isSelected ? 'scale-100' : 'scale-50 opacity-0'}`} />
                          </div>
                        </div>

                        {/* Visual Keycap Preview Widget */}
                        <div 
                          className="w-full mt-3 p-2 rounded-xl border border-white/15 flex items-center justify-center gap-1.5 overflow-hidden"
                          style={{ backgroundColor: skinOption.previewBg }}
                        >
                          {['Q', 'W', 'E', 'R', 'T'].map((char, i) => {
                            if (skinOption.id === 'ios') {
                              return (
                                <div 
                                  key={char} 
                                  className="w-7 h-8 bg-white text-black text-[13px] font-normal rounded-[4px] shadow-[0_1px_0_rgba(0,0,0,0.35)] flex items-center justify-center"
                                >
                                  {char.toLowerCase()}
                                </div>
                              );
                            } else if (skinOption.id === 'google') {
                              return (
                                <div 
                                  key={char} 
                                  className="w-7 h-8 bg-white text-[#1F1F1F] text-[12px] font-normal rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.12)] relative flex items-center justify-center"
                                >
                                  <span>{char.toLowerCase()}</span>
                                  <span className="absolute top-0.5 right-1 text-[7px] text-zinc-500 font-medium">{i + 1}</span>
                                </div>
                              );
                            } else if (skinOption.id === 'butterfly') {
                              return (
                                <div 
                                  key={char} 
                                  className="w-7 h-8 bg-[#121215] text-white/95 text-[12px] font-light rounded-[3px] border border-black shadow-[0_1px_1px_rgba(0,0,0,0.8)] flex items-center justify-center"
                                >
                                  {char}
                                </div>
                              );
                            } else if (skinOption.id === 'physical') {
                              return (
                                <div 
                                  key={char} 
                                  className="w-7 h-7 bg-gradient-to-b from-[#383B46] to-[#272932] text-white text-[12px] font-bold rounded-[5px] shadow-[0_3px_0_#121317,0_4px_3px_rgba(0,0,0,0.6)] flex items-center justify-center"
                                >
                                  {char}
                                </div>
                              );
                            } else {
                              return (
                                <div 
                                  key={char} 
                                  className="w-7 h-8 bg-[#525257]/90 text-white text-[12px] font-normal rounded-[5px] shadow-[0_1px_0_rgba(0,0,0,0.5)] border-t border-white/10 flex items-center justify-center"
                                >
                                  {char}
                                </div>
                              );
                            }
                          })}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Card 2: Cỡ chữ ứng dụng (Spatial Glass Pill Slider Style) */}
            {matchesSearch('Cỡ chữ ứng dụng') && (
              <div className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] space-y-4">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="w-4.5 h-4.5 text-white" />
                    <span className="font-semibold text-white text-sm">
                      Cỡ chữ ứng dụng
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white border border-white/20">
                    Phông chữ: {FONT_FAMILY_CONFIG.find(f => f.id === settings.fontFamily)?.name || 'Integer'}
                  </span>
                </div>

                {/* Spatial Glass Capsule Slider Container */}
                <div className="pt-1">
                  <div className="group relative w-full h-16 rounded-[24px] bg-white/[0.04] border border-white/20 flex items-center px-6 transition-all settings-slider-capsule">
                    {/* Track Background */}
                    <div className="relative w-full h-2 rounded-full bg-white/20 overflow-visible">
                      {/* Active White Track */}
                      <div 
                        className="absolute left-0 top-0 h-full rounded-full bg-white transition-all duration-150 ease-out"
                        style={{ width: `${(settings.fontScale / 3) * 100}%` }}
                      />
                      
                      {/* White Pill Thumb Handle with Hover Scale-up */}
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-6 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.4)] transition-all duration-200 ease-out pointer-events-none flex items-center justify-center group-hover:scale-125 hover:scale-125"
                        style={{ left: `${(settings.fontScale / 3) * 100}%` }}
                      >
                        <div className="w-4 h-1 rounded-full bg-black/40" />
                      </div>
                    </div>

                    {/* Native Range Input (Transparent Overlay for Smooth Drag & Touch) */}
                    <input
                      id="slider-font-scale"
                      type="range"
                      min="0"
                      max="3"
                      step="1"
                      value={settings.fontScale}
                      onChange={(e) => updateSetting('fontScale', parseInt(e.target.value, 10))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      aria-label="Cỡ chữ ứng dụng"
                    />
                  </div>

                  {/* Step Labels */}
                  <div className="flex items-center justify-between text-[11px] pt-3 px-2">
                    {FONT_SCALE_CONFIG.map((item, idx) => {
                      const isSelected = settings.fontScale === idx;
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => updateSetting('fontScale', idx)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'text-white font-bold text-xs underline underline-offset-4'
                              : 'text-white/50 hover:text-white/80'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Card 4: Màn hình khởi động & VNRT Ads */}
            {(matchesSearch('Splash Screen') || matchesSearch('Màn hình khởi động') || matchesSearch('VNRT Ads') || matchesSearch('Ads')) && (
              <div className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] flex items-center justify-between gap-4 transition-colors">
                <div>
                  <div className="font-semibold text-white text-sm flex items-center gap-2">
                    <span>Màn hình khởi động & VNRT Ads</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    id="btn-settings-replay-intro-video"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('vplay:replay_startup_video'));
                    }}
                    className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all shadow-md cursor-pointer shrink-0 border border-white/20"
                    title="Xem ngẫu nhiên VNRT Ads"
                  >
                    VNRT Ads
                  </button>
                  <button
                    type="button"
                    id="btn-settings-replay-splash"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('vplay:replay_splash'));
                    }}
                    className="px-4 py-2 rounded-full bg-white hover:bg-white/90 text-black text-xs font-bold transition-all shadow-md cursor-pointer shrink-0 border border-white"
                  >
                    Splash Screen
                  </button>
                </div>
              </div>
            )}

            {/* Card 5: Tải lại ứng dụng (Reload App) */}
            {(matchesSearch('Reload App') || matchesSearch('Tải lại') || matchesSearch('Làm mới') || matchesSearch('Reload')) && (
              <div className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] flex items-center justify-between gap-4 transition-colors">
                <div>
                  <div className="font-semibold text-white text-sm flex items-center gap-2">
                    <RotateCw className="w-4 h-4 text-white shrink-0" />
                    <span>Tải lại ứng dụng (Reload App)</span>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-settings-reload-app"
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="px-4 py-2 rounded-full bg-white hover:bg-white/90 text-black text-xs font-bold transition-all shadow-md cursor-pointer shrink-0 flex items-center gap-1.5 border border-white"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Reload App</span>
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. Section 2: Trợ năng */}
      {showAccessibility && (
        <section 
          id="settings-section-accessibility"
          className="settings-category-section p-5 sm:p-6 rounded-[28px] bg-transparent backdrop-blur-2xl border-0 shadow-xl space-y-4"
        >
          {/* Section Header */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#f59e0b] to-[#d97706] text-white flex items-center justify-center shrink-0 shadow-md mt-0.5 border-0">
              <Key className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Trợ năng
              </h2>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {/* Card 1: Tự động trượt hình Banner */}
            {matchesSearch('Tự động trượt hình Banner') && (
              <div className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] flex items-center justify-between gap-4 transition-colors">
                <div>
                  <div className="font-semibold text-white text-sm">
                    Tự động trượt hình Banner
                  </div>
                </div>

                {/* Orange Toggle Switch */}
                <button
                  id="toggle-autoscroll-banner"
                  type="button"
                  role="switch"
                  aria-checked={settings.autoScrollBanner}
                  onClick={() => updateSetting('autoScrollBanner', !settings.autoScrollBanner)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center border border-white/20 ${
                    settings.autoScrollBanner ? 'bg-[#FF6A00]' : 'bg-white/15'
                  }`}
                >
                  <span
                    className={`w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      settings.autoScrollBanner ? 'translate-x-5.5 bg-white' : 'translate-x-0 bg-white'
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Card 2: Tự động ẩn Sidebar */}
            {matchesSearch('Tự động ẩn Sidebar') && (
              <div className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] flex items-center justify-between gap-4 transition-colors">
                <div>
                  <div className="font-semibold text-white text-sm">
                    Tự động ẩn Sidebar
                  </div>
                </div>

                {/* Orange Toggle Switch */}
                <button
                  id="toggle-autohide-sidebar"
                  type="button"
                  role="switch"
                  aria-checked={settings.autoHideSidebar}
                  onClick={() => updateSetting('autoHideSidebar', !settings.autoHideSidebar)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center border border-white/20 ${
                    settings.autoHideSidebar ? 'bg-[#FF6A00]' : 'bg-white/15'
                  }`}
                >
                  <span
                    className={`w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      settings.autoHideSidebar ? 'translate-x-5.5 bg-white' : 'translate-x-0 bg-white'
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Card 3: Inspect Elements (Inspect web này) */}
            {(matchesSearch('Inspect elements', 'Inspect web này', 'Kiểm tra phần tử', 'DevTools', 'DOM', 'Elements', 'Soi phần tử')) && (
              <div className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] space-y-3 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold text-white text-sm flex items-center gap-2">
                      <span>Inspect Elements (Inspect web này)</span>
                    </div>
                  </div>

                  {/* Orange Toggle Switch */}
                  <button
                    id="toggle-inspect-elements"
                    type="button"
                    role="switch"
                    aria-checked={settings.inspectElements}
                    onClick={() => updateSetting('inspectElements', !settings.inspectElements)}
                    className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center border border-white/20 ${
                      settings.inspectElements ? 'bg-[#FF6A00]' : 'bg-white/15'
                    }`}
                  >
                    <span
                      className={`w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        settings.inspectElements ? 'translate-x-5.5 bg-white' : 'translate-x-0 bg-white'
                      }`}
                    />
                  </button>
                </div>

                {settings.inspectElements && (
                  <div className="pt-2 border-t border-white/15 text-xs text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>Đã kích hoạt: Nút công cụ nổi &quot;Soi phần tử&quot; &amp; DevTools đã sẵn sàng ở góc màn hình.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. Section: Giới thiệu (About & User Profile) */}
      {showAbout && (
        <section 
          id="settings-section-about"
          className="settings-category-section p-5 sm:p-6 rounded-[28px] bg-transparent backdrop-blur-2xl border-0 shadow-xl space-y-4"
        >
          {/* Section Header */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#22c55e] to-[#16a34a] text-white flex items-center justify-center shrink-0 shadow-md mt-0.5 border-0">
              <Info className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Giới thiệu
              </h2>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {/* System Info Card */}
            <div className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] space-y-3 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-black text-sm shadow">
                    VNRT
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Vplay by Waves</h3>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/20">
                  v3.4.0
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-center text-xs">
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-white/60 block text-[10px]">Trạng thái</span>
                  <span className="text-white font-bold">Online</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-white/60 block text-[10px]">Phiên bản</span>
                  <span className="text-white font-bold">2026.09</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-white/60 block text-[10px]">Đa nhiệm</span>
                  <span className="text-white font-bold">V-Duo Ready</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-white/60 block text-[10px]">Mô phỏng</span>
                  <span className="text-white font-bold">Driving Sim</span>
                </div>
              </div>
            </div>

            {/* Card 0: Tên người dùng (User Name) */}
            <div className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] space-y-3.5 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-semibold text-white text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-white" />
                    <span>Tên người dùng (Username)</span>
                  </div>
                </div>

                {/* Live greeting preview tag */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs text-white border border-white/20 shrink-0 self-start sm:self-auto">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>Hi <strong className="text-white">{settings.userName || 'User'}</strong>!</span>
                </div>
              </div>

              {/* Input & Action buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <div className="relative flex-1">
                  <input
                    id="settings-username-input"
                    type="text"
                    value={inputUserName}
                    onChange={(e) => setInputUserName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSaveUserName();
                      }
                    }}
                    placeholder="Nhập tên của bạn (vd: User, Alex, Minh...)"
                    maxLength={30}
                    className="w-full h-10 px-3.5 rounded-xl bg-[#1E1D22] border border-white/20 text-white text-sm placeholder-white/40 focus:outline-none focus:border-white transition-all"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-save-username"
                    type="button"
                    onClick={() => handleSaveUserName()}
                    className={`h-10 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm border ${
                      isNameSaved
                        ? 'bg-white text-black border-white'
                        : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                    }`}
                  >
                    {isNameSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã lưu</span>
                      </>
                    ) : (
                      <span>Lưu tên</span>
                    )}
                  </button>

                  <button
                    id="btn-reset-username"
                    type="button"
                    onClick={() => handleSaveUserName('User')}
                    title="Đặt lại về mặc định (User)"
                    className="h-10 px-3 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Mặc định</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 0.5: Reset OOBE Setup Screen */}
            <div className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
              <div>
                <div className="font-semibold text-white text-sm flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-white" />
                  <span>Màn hình thiết lập OOBE lần đầu</span>
                </div>
              </div>

              <button
                id="btn-reset-oobe"
                type="button"
                onClick={handleResetOobe}
                className="h-10 px-4 rounded-xl text-xs font-semibold bg-white hover:bg-white/90 active:scale-95 text-black border border-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm shrink-0 self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{oobeResetTriggered ? 'Đang mở OOBE...' : 'Reset OOBE'}</span>
              </button>
            </div>

            {/* Clear Local Cache */}
            <div className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] flex items-center justify-between gap-4 transition-colors">
              <div>
                <div className="font-semibold text-white text-sm">
                  Dọn dẹp bộ nhớ tạm (Cache)
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem('waves_custom_channels');
                    localStorage.removeItem('vshop_cart');
                    alert('Đã làm sạch dữ liệu bộ nhớ tạm!');
                  } catch {}
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold cursor-pointer transition-colors shrink-0"
              >
                Xóa Cache
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 5. Section: Công cụ (Tools & Search & V-Duo) */}
      {showTools && (
        <section 
          id="settings-section-tools"
          className="settings-category-section p-5 sm:p-6 rounded-[28px] bg-transparent backdrop-blur-2xl border-0 shadow-xl space-y-4"
        >
          {/* Section Header */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#6b7280] to-[#4b5563] text-white flex items-center justify-center shrink-0 shadow-md mt-0.5 border-0">
              <Wrench className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Công cụ
              </h2>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {/* V-Duo Split Screen Quick Tool Card */}
            <div 
              onClick={() => navigate ? navigate('/v-duo') : window.location.assign('/v-duo')}
              className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                  <Columns2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm transition-colors">
                      Mở tính năng V-Duo (Chia đôi màn hình)
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors shrink-0" />
            </div>

            {/* Merge Spotlight Search to Copilot */}
            <div className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] flex items-center justify-between gap-4 transition-colors">
              <div>
                <div className="font-semibold text-white text-sm">
                  Merge Spotlight Search to Copilot
                </div>
              </div>

              <button
                id="toggle-merge-spotlight-to-copilot"
                type="button"
                role="switch"
                aria-checked={settings.mergeSpotlightToCopilot}
                onClick={() => updateSetting('mergeSpotlightToCopilot', !settings.mergeSpotlightToCopilot)}
                className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center border border-white/20 ${
                  settings.mergeSpotlightToCopilot ? 'bg-[#FF6A00]' : 'bg-white/15'
                }`}
              >
                <span
                  className={`w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    settings.mergeSpotlightToCopilot ? 'translate-x-5.5 bg-white' : 'translate-x-0 bg-white'
                  }`}
                />
              </button>
            </div>

            {/* Gợi ý lệnh thông minh Slash Commands */}
            <div className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] flex items-center justify-between gap-4 transition-colors">
              <div>
                <div className="font-semibold text-white text-sm">
                  Gợi ý lệnh Slash Commands
                </div>
              </div>

              <button
                id="toggle-copilot-slash-suggestions"
                type="button"
                role="switch"
                aria-checked={settings.copilotSlashSuggestions}
                onClick={() => updateSetting('copilotSlashSuggestions', !settings.copilotSlashSuggestions)}
                className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center border border-white/20 ${
                  settings.copilotSlashSuggestions ? 'bg-[#FF6A00]' : 'bg-white/15'
                }`}
              >
                <span
                  className={`w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    settings.copilotSlashSuggestions ? 'translate-x-5.5 bg-white' : 'translate-x-0 bg-white'
                  }`}
                />
              </button>
            </div>

            {/* 1. Danh mục tìm kiếm */}
            <div 
              onClick={() => updateSetting('searchCategories', !settings.searchCategories)}
              className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] flex items-center justify-between gap-4 cursor-pointer transition-colors"
            >
              <div>
                <div className="font-semibold text-white text-sm">
                  Tìm kiếm: Danh mục hệ thống
                </div>
              </div>

              <div 
                className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center shrink-0 transition-colors border ${
                  settings.searchCategories
                    ? 'bg-white border-white text-black shadow-sm'
                    : 'bg-transparent border-white/30 text-transparent'
                }`}
              >
                {settings.searchCategories && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {/* 2. Tin tức */}
            <div 
              onClick={() => updateSetting('searchNews', !settings.searchNews)}
              className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] flex items-center justify-between gap-4 cursor-pointer transition-colors"
            >
              <div>
                <div className="font-semibold text-white text-sm">
                  Tìm kiếm: Tin tức & Cổng thông tin
                </div>
              </div>

              <div 
                className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center shrink-0 transition-colors border ${
                  settings.searchNews
                    ? 'bg-white border-white text-black shadow-sm'
                    : 'bg-transparent border-white/30 text-transparent'
                }`}
              >
                {settings.searchNews && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {/* 3. Truyền hình */}
            <div 
              onClick={() => updateSetting('searchTv', !settings.searchTv)}
              className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] flex items-center justify-between gap-4 cursor-pointer transition-colors"
            >
              <div>
                <div className="font-semibold text-white text-sm">
                  Tìm kiếm: Kênh truyền hình
                </div>
              </div>

              <div 
                className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center shrink-0 transition-colors border ${
                  settings.searchTv
                    ? 'bg-white border-white text-black shadow-sm'
                    : 'bg-transparent border-white/30 text-transparent'
                }`}
              >
                {settings.searchTv && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. Section: Thử nghiệm (Feature Flags & Labs) */}
      {showExperimental && (
        <section 
          id="settings-section-experimental"
          className="settings-category-section p-5 sm:p-6 rounded-[28px] bg-transparent backdrop-blur-2xl border-0 shadow-xl space-y-4"
        >
          {/* Section Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#6b7280] to-[#4b5563] text-white flex items-center justify-center shrink-0 shadow-md mt-0.5 border-0">
                <FlaskConical className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white leading-tight">
                  Thử nghiệm
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate ? navigate('/feature-flags') : window.location.assign('/feature-flags')}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border border-white/20"
            >
              <span>Trang Flags</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {/* Flag 1: Minimalism Home Page */}
            <div className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] flex items-center justify-between gap-4 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">Minimalism Home Page</span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={Boolean(flags.minimalism_home_page)}
                onClick={() => setFlag('minimalism_home_page', !flags.minimalism_home_page)}
                className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center border border-white/20 ${
                  flags.minimalism_home_page ? 'bg-[#FF6A00]' : 'bg-white/15'
                }`}
              >
                <span
                  className={`w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    flags.minimalism_home_page ? 'translate-x-5.5 bg-white' : 'translate-x-0 bg-white'
                  }`}
                />
              </button>
            </div>

            {/* Flag 2: Animation Test */}
            <div className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] flex items-center justify-between gap-4 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">Animation Test</span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={Boolean(flags.animation_test)}
                onClick={() => setFlag('animation_test', !flags.animation_test)}
                className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center border border-white/20 ${
                  flags.animation_test ? 'bg-[#FF6A00]' : 'bg-white/15'
                }`}
              >
                <span
                  className={`w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    flags.animation_test ? 'translate-x-5.5 bg-white' : 'translate-x-0 bg-white'
                  }`}
                />
              </button>
            </div>

            {/* Flag 3: Experimental V-board */}
            <div className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] flex items-center justify-between gap-4 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">Experimental V-board</span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={Boolean(flags.experimental_vboard)}
                onClick={() => setFlag('experimental_vboard', !flags.experimental_vboard)}
                className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center border border-white/20 ${
                  flags.experimental_vboard ? 'bg-[#FF6A00]' : 'bg-white/15'
                }`}
              >
                <span
                  className={`w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    flags.experimental_vboard ? 'translate-x-5.5 bg-white' : 'translate-x-0 bg-white'
                  }`}
                />
              </button>
            </div>

            {/* Flag 4: Vertical Status Bar */}
            <div className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/[0.03] flex items-center justify-between gap-4 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">Vertical Status Bar</span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={Boolean(flags.status_bar)}
                onClick={() => setFlag('status_bar', !flags.status_bar)}
                className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center border border-white/20 ${
                  flags.status_bar ? 'bg-[#FF6A00]' : 'bg-white/15'
                }`}
              >
                <span
                  className={`w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    flags.status_bar ? 'translate-x-5.5 bg-white' : 'translate-x-0 bg-white'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Empty State when no settings match query */}
      {!hasAnyResults && (
        <div className="py-12 px-6 text-center rounded-[28px] bg-[#1E1D22] border border-white/20 space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-white">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">
            Không tìm thấy cài đặt nào
          </h3>
          <p className="text-xs text-white/70 max-w-sm mx-auto leading-relaxed">
            Không tìm thấy cài đặt khớp với từ khóa &quot;{searchQuery}&quot;. Thử tìm kiếm với từ khóa như giao diện, sidebar, font, trợ năng, copilot...
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer border border-white/20"
          >
            Xóa tìm kiếm
          </button>
        </div>
      )}
    </div>
  );
};
