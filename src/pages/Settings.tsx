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
  Compass,
  Monitor,
  Languages,
  Accessibility
} from 'lucide-react';
import { useSettings, FONT_SCALE_CONFIG, FONT_FAMILY_CONFIG } from '../hooks/useSettings';
import { useFeatureFlags } from '../hooks/useFeatureFlags';

interface SettingsProps {
  navigate?: (route: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ navigate }) => {
  const { settings, updateSetting } = useSettings();
  const { flags, setFlag } = useFeatureFlags();
  const [searchQuery, setSearchQuery] = useState('');
  const [inputUserName, setInputUserName] = useState(settings.userName || 'User');
  const [isNameSaved, setIsNameSaved] = useState(false);

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

  const matchesSearch = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase().trim());
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 pt-2 select-none">
      {/* 1. Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Cài đặt
        </h1>
        <p className="text-xs sm:text-sm text-[#9CA3AF]">
          Quản lý giao diện, trợ năng và tiện ích hệ thống
        </p>

        {/* Search Bar Capsule with Spotlight Search Styling */}
        <div className="pt-2">
          <div className="w-full h-[46px] flex items-center justify-between px-4 rounded-full spotlight-bubble-box text-sm transition-all">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-[18px] h-[18px] min-w-[18px] min-h-[18px] max-w-[18px] max-h-[18px] flex items-center justify-center shrink-0">
                <img
                  src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest?cb=20260717131751"
                  alt="Search"
                  referrerPolicy="no-referrer"
                  className="w-full h-full aspect-square object-contain brightness-0 invert opacity-75 topbar-search-icon"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <input
                id="settings-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm cài đặt..."
                className="w-full bg-transparent text-white placeholder-[#8E8E93] text-sm focus:outline-none font-medium truncate"
              />
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full text-[#8E8E93] hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
                title="Xóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Feature Flags Quick Entry Card */}
        {(matchesSearch('Feature Flags') || matchesSearch('Cờ tính năng') || matchesSearch('Thử nghiệm') || matchesSearch('Experimental')) && (
          <div 
            onClick={() => navigate ? navigate('/feature-flags') : window.location.assign('/feature-flags')}
            className="p-4 sm:p-5 rounded-[22px] bg-gradient-to-r from-cyan-950/40 via-[#1E1D24] to-[#1E1D24] border border-cyan-500/30 hover:border-cyan-500/60 shadow-lg flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Flag className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                    Feature Flags
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    EXPERIMENTAL
                  </span>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-0.5">
                  Bật/tắt các cờ tính năng thử nghiệm, AI Copilot, tối ưu luồng video và gỡ lỗi
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-cyan-500/20 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors shrink-0">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>

      {/* 2. Section 1: Giao diện */}
      {(matchesSearch('Giao diện') ||
        matchesSearch('Chế độ giao diện') ||
        matchesSearch('Floaty bar') ||
        matchesSearch('Floaty') ||
        matchesSearch('Navigation bar') ||
        matchesSearch('Navigation bar that floats on your screen') ||
        matchesSearch('floats') ||
        matchesSearch('Sáng') ||
        matchesSearch('Tối') ||
        matchesSearch('Theme') ||
        matchesSearch('Thanh điều hướng') ||
        matchesSearch('Sidebar') ||
        matchesSearch('Top bar') ||
        matchesSearch('Bố cục') ||
        matchesSearch('Dock sang Sidebar') ||
        matchesSearch('Phông chữ') ||
        matchesSearch('Font') ||
        matchesSearch('Integer') ||
        matchesSearch('Alata') ||
        matchesSearch('Google Sans') ||
        matchesSearch('Montserrat') ||
        matchesSearch('Cỡ chữ ứng dụng')) && (
        <section 
          id="settings-section-interface"
          className="p-5 sm:p-6 rounded-[28px] bg-[#1E1D22] shadow-xl space-y-4"
        >
          {/* Section Header without background container on icon */}
          <div className="flex items-start gap-3">
            <Palette className="w-5 h-5 text-[#E50914] dark:text-[#E50914] shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Giao diện
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
                Tùy biến thanh điều hướng (Sidebar, Top bar hoặc Floaty bar), thanh Dock và tỷ lệ cỡ chữ toàn hệ thống
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {/* Card: Floaty bar */}
            {(matchesSearch('Floaty bar') ||
              matchesSearch('Floaty') ||
              matchesSearch('Navigation bar') ||
              matchesSearch('Navigation bar that floats on your screen') ||
              matchesSearch('floats') ||
              matchesSearch('Thanh điều hướng') ||
              matchesSearch('Giao diện')) && (
              <div 
                id="settings-card-floaty-bar"
                className="p-4 sm:p-5 rounded-[20px] bg-[#28272E] flex items-center justify-between gap-4 transition-colors border border-cyan-500/20 shadow-md"
              >
                <div>
                  <div className="font-semibold text-white text-sm flex items-center gap-2">
                    <Compass className="w-4.5 h-4.5 text-cyan-400" />
                    <span>Floaty bar</span>
                    {settings.floatyBar && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        ĐANG BẬT
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                    Navigation bar that floats on your screen
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">
                    Khi bật, thanh Top bar và Sidebar sẽ trở thành thanh điều hướng lơ lửng dạng pill ở dưới màn hình (tối đa 4 tabs/trang, chuyển trang mũi tên 2 cực).
                  </div>
                </div>

                {/* Red/Cyan Toggle Switch */}
                <button
                  id="toggle-floaty-bar"
                  type="button"
                  role="switch"
                  aria-checked={settings.floatyBar}
                  onClick={() => updateSetting('floatyBar', !settings.floatyBar)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center ${
                    settings.floatyBar ? 'bg-[#E50914]' : 'bg-[#E4E4E7] dark:bg-[#3F3F46]'
                  }`}
                >
                  <span
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                      settings.floatyBar ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Card 0: Chế độ giao diện (Dark Mode mặc định) */}
            {(matchesSearch('Chế độ giao diện') || matchesSearch('Giao diện') || matchesSearch('Theme') || matchesSearch('Dark')) && (
              <div className="p-4 rounded-[20px] bg-[#28272E] flex items-center justify-between gap-4 transition-colors">
                <div>
                  <div className="font-semibold text-white text-sm flex items-center gap-2">
                    <Moon className="w-4 h-4 text-[#FF3366]" />
                    <span>Chế độ giao diện Dark Mode</span>
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                    Ứng dụng Vplay hoạt động ở chế độ nền tối chuyên biệt (#1B0912) tối ưu thị giác cho trải nghiệm truyền hình.
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18181B] text-xs font-bold text-[#FF6699] shrink-0 border-0">
                  <span className="w-2 h-2 rounded-full bg-[#FF3366]" />
                  <span>DARK ONLY</span>
                </div>
              </div>
            )}

            {/* Card 1: Bố cục thanh điều hướng (Sidebar hoặc Top bar) */}
            {(matchesSearch('Thanh điều hướng') ||
              matchesSearch('Sidebar') ||
              matchesSearch('Top bar') ||
              matchesSearch('Bố cục') ||
              matchesSearch('Giao diện')) && (
              <div className="p-4 sm:p-5 rounded-[20px] bg-[#28272E] space-y-3.5 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-white text-sm flex items-center gap-2">
                      <Layout className="w-4.5 h-4.5 text-[#E50914]" />
                      <span>Thanh điều hướng chính</span>
                    </div>
                    <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                      Lựa chọn giao diện điều hướng: thanh Sidebar bên cạnh hoặc thanh Top bar phía trên cùng.
                    </div>
                  </div>
                </div>

                {/* Grid 2 tùy chọn: Sidebar hoặc Top bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Tùy chọn 1: Sidebar */}
                  <button
                    id="setting-nav-sidebar"
                    type="button"
                    onClick={() => {
                      updateSetting('navigationMode', 'sidebar');
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer relative group ${
                      settings.navigationMode === 'sidebar'
                        ? 'bg-[#1E1D24] border-[#E50914] shadow-[0_0_16px_rgba(229,9,20,0.25)] ring-1 ring-[#E50914]'
                        : 'bg-[#1E1D24]/60 border-white/5 hover:border-white/20 hover:bg-[#1E1D24]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                          settings.navigationMode === 'sidebar'
                            ? 'bg-[#E50914]/20 text-[#E50914]'
                            : 'bg-white/5 text-gray-400 group-hover:text-white'
                        }`}>
                          <PanelLeft className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-white block">Sidebar</span>
                          <span className="text-[11px] text-gray-400">Thanh bên trái</span>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        settings.navigationMode === 'sidebar'
                          ? 'bg-[#E50914] text-white'
                          : 'border border-white/20 text-transparent'
                      }`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>

                    <p className="text-xs text-[#9CA3AF] mt-3 leading-relaxed">
                      Giao diện thanh menu dọc bên trái đầy đủ với đồng hồ số, ô tìm kiếm nhanh, các danh mục và nút thu gọn.
                    </p>
                  </button>

                  {/* Tùy chọn 2: Top bar */}
                  <button
                    id="setting-nav-topbar"
                    type="button"
                    onClick={() => {
                      updateSetting('navigationMode', 'topbar');
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer relative group ${
                      settings.navigationMode !== 'sidebar'
                        ? 'bg-[#1E1D24] border-[#E50914] shadow-[0_0_16px_rgba(229,9,20,0.25)] ring-1 ring-[#E50914]'
                        : 'bg-[#1E1D24]/60 border-white/5 hover:border-white/20 hover:bg-[#1E1D24]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                          settings.navigationMode !== 'sidebar'
                            ? 'bg-[#E50914]/20 text-[#E50914]'
                            : 'bg-white/5 text-gray-400 group-hover:text-white'
                        }`}>
                          <PanelTop className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-white block">Top bar</span>
                          <span className="text-[11px] text-gray-400">Thanh trên cùng</span>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        settings.navigationMode !== 'sidebar'
                          ? 'bg-[#E50914] text-white'
                          : 'border border-white/20 text-transparent'
                      }`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>

                    <p className="text-xs text-[#9CA3AF] mt-3 leading-relaxed">
                      Thanh điều hướng ngang hiện đại phong cách truyền hình với logo Vplay, danh mục Truyền Hình và menu Xem thêm.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Card 2: Dock sang Sidebar (No Border) */}
            {matchesSearch('Dock sang Sidebar') && (
              <div className="p-4 rounded-[20px] bg-[#28272E] flex items-center justify-between gap-4 transition-colors">
                <div>
                  <div className="font-semibold text-white text-sm">
                    Dock sang Sidebar
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                    Chuyển thanh điều hướng dưới cùng sang thanh Sidebar bên trái (khi sử dụng chế độ Sidebar)
                  </div>
                </div>

                {/* Red Toggle Switch */}
                <button
                  id="toggle-dock-to-sidebar"
                  type="button"
                  role="switch"
                  aria-checked={settings.dockToSidebar}
                  onClick={() => updateSetting('dockToSidebar', !settings.dockToSidebar)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center ${
                    settings.dockToSidebar ? 'bg-[#E50914]' : 'bg-[#E4E4E7] dark:bg-[#3F3F46]'
                  }`}
                >
                  <span
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                      settings.dockToSidebar ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Card 1.5: Phông chữ (Checkbox List: Integer, Alata, Google Sans, Montserrat) */}
            {(matchesSearch('Phông chữ') ||
              matchesSearch('Font') ||
              matchesSearch('Integer') ||
              matchesSearch('Alata') ||
              matchesSearch('Google Sans') ||
              matchesSearch('Montserrat') ||
              matchesSearch('Giao diện')) && (
              <div 
                id="settings-card-font-family"
                className="p-4 sm:p-5 rounded-[20px] bg-[#28272E] space-y-3.5 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-white text-sm flex items-center gap-2">
                      <Type className="w-4.5 h-4.5 text-[#E50914]" />
                      <span>Phông chữ</span>
                    </div>
                    <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                      Chọn phông chữ hiển thị cho ứng dụng. Tùy chọn sẽ được áp dụng ngay lập tức cho toàn bộ giao diện.
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white/90 border border-white/10 shrink-0">
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
                            ? 'bg-[#1E1D24] border-[#E50914] shadow-[0_0_16px_rgba(229,9,20,0.25)] ring-1 ring-[#E50914]'
                            : 'bg-[#1E1D24]/60 border-white/5 hover:border-white/20 hover:bg-[#1E1D24]'
                        }`}
                      >
                        {/* Checkbox Box Element */}
                        <div 
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-150 ${
                            isSelected
                              ? 'bg-[#E50914] border-[#E50914] text-white shadow-sm'
                              : 'border-[#4B4B58] bg-[#141419] text-transparent group-hover:border-[#71717A]'
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
                                isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'
                              }`}
                              style={{ fontFamily: font.cssFamily }}
                            >
                              {font.name}
                            </span>
                            {font.badge && (
                              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-[#E50914]/20 text-[#FF4D6D] border border-[#E50914]/30">
                                {font.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#9CA3AF] mt-1 leading-snug">
                            {font.subtext}
                          </p>
                          <div 
                            className="text-xs text-white/70 mt-2 px-2 py-1 rounded-lg bg-black/20 border border-white/5 truncate tracking-wide"
                            style={{ fontFamily: font.cssFamily }}
                          >
                            Vplay: Truyền hình trực tuyến 2026
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Card 2: Cỡ chữ ứng dụng (Liquid Glass Pill Slider Style) */}
            {matchesSearch('Cỡ chữ ứng dụng') && (
              <div className="p-4 sm:p-5 rounded-[20px] bg-[#28272E] space-y-4">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="w-4.5 h-4.5 text-[#9CA3AF]" />
                    <span className="font-semibold text-white text-sm">
                      Cỡ chữ ứng dụng
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white/90 border border-white/10">
                    Phông chữ: {FONT_FAMILY_CONFIG.find(f => f.id === settings.fontFamily)?.name || 'Integer'}
                  </span>
                </div>

                {/* Liquid Glass Capsule Slider Container */}
                <div className="pt-1">
                  <div className="group relative w-full h-16 rounded-[24px] bg-[#1E1D24] dark:bg-[#1E1D24] border border-[#34343E]/60 flex items-center px-6 transition-all settings-slider-capsule">
                    {/* Track Background */}
                    <div className="relative w-full h-2 rounded-full bg-[#383842] dark:bg-[#383842] overflow-visible">
                      {/* Active Red Track */}
                      <div 
                        className="absolute left-0 top-0 h-full rounded-full bg-[#E50914] transition-all duration-150 ease-out"
                        style={{ width: `${(settings.fontScale / 3) * 100}%` }}
                      />
                      
                      {/* White Pill Thumb Handle with Hover Scale-up */}
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-6 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.3)] transition-all duration-200 ease-out pointer-events-none flex items-center justify-center group-hover:scale-125 hover:scale-125"
                        style={{ left: `${(settings.fontScale / 3) * 100}%` }}
                      >
                        <div className="w-4 h-1 rounded-full bg-gray-300" />
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
                              ? 'text-[#E50914] font-bold text-xs'
                              : 'text-[#6B7280] hover:text-[#9CA3AF]'
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

            {/* Card 4: Màn hình khởi động (Splash Screen) */}
            {(matchesSearch('Splash Screen') || matchesSearch('Màn hình khởi động')) && (
              <div className="p-4 rounded-[20px] bg-[#28272E] flex items-center justify-between gap-4 transition-colors">
                <div>
                  <div className="font-semibold text-white text-sm flex items-center gap-2">
                    <span>Màn hình khởi động (Splash Screen)</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-[#E6005A]/20 text-[#E6005A] rounded-full">
                      Vplay OS
                    </span>
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                    Hiển thị logo tối giản và vòng tròn tải khi khởi chạy ứng dụng
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-settings-replay-splash"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('vplay:replay_splash'));
                  }}
                  className="px-4 py-2 rounded-full bg-[#E6005A] hover:bg-[#FF267A] text-white text-xs font-bold transition-all shadow-md shadow-[#E6005A]/25 cursor-pointer shrink-0"
                >
                  Xem lại
                </button>
              </div>
            )}

            {/* Card 5: Tải lại ứng dụng (Reload App) */}
            {(matchesSearch('Reload App') || matchesSearch('Tải lại') || matchesSearch('Làm mới') || matchesSearch('Reload')) && (
              <div className="p-4 rounded-[20px] bg-[#28272E] flex items-center justify-between gap-4 transition-colors">
                <div>
                  <div className="font-semibold text-white text-sm flex items-center gap-2">
                    <RotateCw className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Tải lại ứng dụng (Reload App)</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-500/20 text-cyan-300 rounded-full">
                      F5
                    </span>
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                    Làm mới toàn bộ dữ liệu, bộ nhớ tạm và tái khởi động ứng dụng mượt mà
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-settings-reload-app"
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="px-4 py-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/25 cursor-pointer shrink-0 flex items-center gap-1.5"
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
      {(matchesSearch('Trợ năng') ||
        matchesSearch('Tự động trượt hình Banner') ||
        matchesSearch('Tự động ẩn Sidebar')) && (
        <section 
          id="settings-section-accessibility"
          className="p-5 sm:p-6 rounded-[28px] bg-[#1E1D22] shadow-xl space-y-4"
        >
          {/* Section Header without background container on icon */}
          <div className="flex items-start gap-3">
            <Key className="w-5 h-5 text-[#E50914] dark:text-[#E50914] shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Trợ năng
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
                Điều chỉnh tự động trượt banner và tương tác menu
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {/* Card 1: Tự động trượt hình Banner (No Border) */}
            {matchesSearch('Tự động trượt hình Banner') && (
              <div className="p-4 rounded-[20px] bg-[#28272E] flex items-center justify-between gap-4 transition-colors">
                <div>
                  <div className="font-semibold text-white text-sm">
                    Tự động trượt hình Banner
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                    Banner hình ảnh ở trang chủ tự động trượt sau mỗi 5 giây
                  </div>
                </div>

                {/* Red Toggle Switch */}
                <button
                  id="toggle-autoscroll-banner"
                  type="button"
                  role="switch"
                  aria-checked={settings.autoScrollBanner}
                  onClick={() => updateSetting('autoScrollBanner', !settings.autoScrollBanner)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center ${
                    settings.autoScrollBanner ? 'bg-[#E50914]' : 'bg-[#E4E4E7] dark:bg-[#3F3F46]'
                  }`}
                >
                  <span
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                      settings.autoScrollBanner ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Card 2: Tự động ẩn Sidebar (No Border) */}
            {matchesSearch('Tự động ẩn Sidebar') && (
              <div className="p-4 rounded-[20px] bg-[#28272E] flex items-center justify-between gap-4 transition-colors">
                <div>
                  <div className="font-semibold text-white text-sm">
                    Tự động ẩn Sidebar
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                    Tự động thu gọn thanh menu khi không di chuột vào
                  </div>
                </div>

                {/* Red Toggle Switch */}
                <button
                  id="toggle-autohide-sidebar"
                  type="button"
                  role="switch"
                  aria-checked={settings.autoHideSidebar}
                  onClick={() => updateSetting('autoHideSidebar', !settings.autoHideSidebar)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center ${
                    settings.autoHideSidebar ? 'bg-[#E50914]' : 'bg-[#E4E4E7] dark:bg-[#3F3F46]'
                  }`}
                >
                  <span
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                      settings.autoHideSidebar ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. Section 3: Ngôn ngữ ứng dụng */}
      {(matchesSearch('Ngôn ngữ') || matchesSearch('Language') || matchesSearch('Tiếng Việt') || matchesSearch('English') || matchesSearch('Trợ năng')) && (
        <section id="settings-section-language" className="p-5 sm:p-6 rounded-[28px] bg-[#1E1D22] shadow-xl space-y-4">
          <div className="flex items-start gap-3">
            <Accessibility className="w-5 h-5 text-[#E50914] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h2 className="text-base font-bold text-white leading-tight">Trợ năng & ngôn ngữ</h2>
              <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">Tùy chỉnh cách Space 360 hiển thị và hỗ trợ bạn sử dụng hằng ngày.</p>
            </div>
          </div>
          <div className="p-4 rounded-[20px] bg-[#28272E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-white text-sm flex items-center gap-2"><Languages className="w-4 h-4 text-cyan-300" aria-hidden="true" /> Ngôn ngữ ứng dụng</div>
              <div className="text-xs text-[#9CA3AF] mt-1">Tiếng Việt là mặc định. Thay đổi sẽ áp dụng cho toàn bộ giao diện hỗ trợ.</div>
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-[#1E1D22] p-1" role="group" aria-label="Ngôn ngữ ứng dụng">
              {(['vi', 'en'] as const).map((language) => (
                <button
                  key={language}
                  type="button"
                  aria-pressed={settings.appLanguage === language}
                  onClick={() => updateSetting('appLanguage', language)}
                  className={`min-w-24 rounded-lg px-3 py-2 text-xs font-bold transition-all cursor-pointer ${settings.appLanguage === language ? 'bg-[#E50914] text-white shadow-md' : 'text-[#A1A1AA] hover:text-white'}`}
                >
                  {language === 'vi' ? 'Tiếng Việt' : 'English'}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Section 4: Copilot for Vplay */}
      {(matchesSearch('Copilot') ||
        matchesSearch('Trợ lý ảo') ||
        matchesSearch('Tên người dùng') ||
        matchesSearch('Username') ||
        matchesSearch('User') ||
        matchesSearch('Tên') ||
        matchesSearch('Hồ sơ') ||
        matchesSearch('Profile') ||
        matchesSearch('Merge Spotlight') ||
        matchesSearch('Hợp nhất') ||
        matchesSearch('Slash') ||
        matchesSearch('Lệnh')) && (
        <section 
          id="settings-section-copilot"
          className="p-5 sm:p-6 rounded-[28px] bg-[#1E1D22] shadow-xl space-y-4"
        >
          {/* Section Header with Monochrome Red Icon matching interface, accessibility & search */}
          <div className="flex items-start gap-3">
            <Bot className="w-5 h-5 text-[#E50914] dark:text-[#E50914] shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Copilot for Vplay
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
                Quản lý tên người dùng, trợ lý trí tuệ nhân tạo, tính năng hợp nhất tìm kiếm và gợi ý lệnh
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {/* Card 0: Tên người dùng (User Name) */}
            {(matchesSearch('Tên người dùng') || matchesSearch('Username') || matchesSearch('User') || matchesSearch('Tên') || matchesSearch('Hồ sơ') || matchesSearch('Profile') || matchesSearch('Copilot')) && (
              <div className="p-4 sm:p-5 rounded-[20px] bg-[#28272E] space-y-3.5 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold text-white text-sm flex items-center gap-2">
                      <User className="w-4 h-4 text-[#E50914]" />
                      <span>Tên người dùng (Username)</span>
                    </div>
                    <div className="text-xs text-[#9CA3AF] mt-0.5 leading-normal">
                      Tên gọi chào mừng trong Copilot AI và giao diện Standalone (Mặc định: <span className="text-white font-medium">User</span>)
                    </div>
                  </div>

                  {/* Live greeting preview tag */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18181B] text-xs text-zinc-300 border border-white/5 shrink-0 self-start sm:self-auto">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
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
                      className="w-full h-10 px-3.5 rounded-xl bg-[#1E1D22] border border-[#3E3E4A] text-white text-sm placeholder-[#71717A] focus:outline-none focus:border-[#E50914] transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="btn-save-username"
                      type="button"
                      onClick={() => handleSaveUserName()}
                      className={`h-10 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                        isNameSaved
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#E50914] hover:bg-[#c80812] text-white'
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
                      className="h-10 px-3 rounded-xl text-xs font-medium bg-[#1E1D22] hover:bg-[#34343E] text-[#9CA3AF] hover:text-white border border-[#3E3E4A] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Mặc định</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Card 0.5: Reset OOBE Setup Screen */}
            {(matchesSearch('OOBE') || matchesSearch('Reset OOBE') || matchesSearch('Thiết lập lần đầu') || matchesSearch('Setup') || matchesSearch('Windows') || matchesSearch("Who's going to use Vplay") || matchesSearch('Khởi động')) && (
              <div className="p-4 sm:p-5 rounded-[20px] bg-[#28272E] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                <div>
                  <div className="font-semibold text-white text-sm flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-[#0078D4]" />
                    <span>Màn hình thiết lập OOBE lần đầu</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0078D4]/20 text-[#38A6FF] border border-[#0078D4]/30">
                      Windows 11 OOBE
                    </span>
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                    Trải nghiệm lại màn hình chào mừng và thiết lập &ldquo;Who&apos;s going to use Vplay?&rdquo; phong cách Windows Out-of-Box Experience
                  </div>
                </div>

                <button
                  id="btn-reset-oobe"
                  type="button"
                  onClick={handleResetOobe}
                  className="h-10 px-4 rounded-xl text-xs font-semibold bg-[#0067C0] hover:bg-[#005FB8] active:bg-[#0054A4] text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm shrink-0 self-start sm:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{oobeResetTriggered ? 'Đang mở OOBE...' : 'Reset OOBE'}</span>
                </button>
              </div>
            )}

            {/* Card 1: Merge Spotlight Search to Copilot */}
            {(matchesSearch('Merge Spotlight Search to Copilot') || matchesSearch('Hợp nhất') || matchesSearch('Spotlight') || matchesSearch('Copilot') || matchesSearch('Tìm kiếm')) && (
              <div className="p-4 rounded-[20px] bg-[#28272E] flex items-center justify-between gap-4 transition-colors">
                <div>
                  <div className="font-semibold text-white text-sm">
                    Merge Spotlight Search to Copilot
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                    Hợp nhất tìm kiếm nhanh Spotlight Search vào trợ lý Copilot for Vplay để có trải nghiệm tìm kiếm thông minh hơn
                  </div>
                </div>

                {/* Red Toggle Switch */}
                <button
                  id="toggle-merge-spotlight-to-copilot"
                  type="button"
                  role="switch"
                  aria-checked={settings.mergeSpotlightToCopilot}
                  onClick={() => updateSetting('mergeSpotlightToCopilot', !settings.mergeSpotlightToCopilot)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center ${
                    settings.mergeSpotlightToCopilot ? 'bg-[#E50914]' : 'bg-[#E4E4E7] dark:bg-[#3F3F46]'
                  }`}
                >
                  <span
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                      settings.mergeSpotlightToCopilot ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Card 2: Gợi ý lệnh thông minh Slash Commands */}
            {(matchesSearch('Gợi ý lệnh') || matchesSearch('Slash') || matchesSearch('Copilot') || matchesSearch('Lệnh')) && (
              <div className="p-4 rounded-[20px] bg-[#28272E] flex items-center justify-between gap-4 transition-colors">
                <div>
                  <div className="font-semibold text-white text-sm">
                    Gợi ý lệnh Slash Commands
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                    Hiển thị các phím tắt lệnh nhanh (/search, /mode, /navigation, /subscribe) phía trên khung chat
                  </div>
                </div>

                {/* Red Toggle Switch */}
                <button
                  id="toggle-copilot-slash-suggestions"
                  type="button"
                  role="switch"
                  aria-checked={settings.copilotSlashSuggestions}
                  onClick={() => updateSetting('copilotSlashSuggestions', !settings.copilotSlashSuggestions)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center ${
                    settings.copilotSlashSuggestions ? 'bg-[#E50914]' : 'bg-[#E4E4E7] dark:bg-[#3F3F46]'
                  }`}
                >
                  <span
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                      settings.copilotSlashSuggestions ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. Section 4: Tìm kiếm */}
      {(matchesSearch('Tìm kiếm') ||
        matchesSearch('Danh mục') ||
        matchesSearch('Tin tức') ||
        matchesSearch('Truyền hình') ||
        matchesSearch('Toolbox') ||
        matchesSearch('Cài đặt')) && (
        <section 
          id="settings-section-search"
          className="p-5 sm:p-6 rounded-[28px] bg-[#1E1D22] shadow-xl space-y-4"
        >
          {/* Section Header without background container on icon */}
          <div className="flex items-start gap-3">
            <Search className="w-5 h-5 text-[#E50914] dark:text-[#E50914] shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Tìm kiếm
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
                Tùy chỉnh các danh mục kết quả trong tìm kiếm Spotlight
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">

            {/* 1. Danh mục */}
            {matchesSearch('Danh mục') && (
              <div 
                onClick={() => updateSetting('searchCategories', !settings.searchCategories)}
                className="p-4 rounded-[20px] bg-[#28272E] flex items-center justify-between gap-4 cursor-pointer hover:bg-[#313038] transition-colors"
              >
                <div>
                  <div className="font-semibold text-white text-sm">
                    Danh mục
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                    Hiển thị các tab và điều hướng hệ thống (Home, Live TV, News, v.v.)
                  </div>
                </div>

                <div 
                  className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    settings.searchCategories
                      ? 'bg-[#E50914] text-white shadow-sm'
                      : 'bg-[#24242A] border border-[#4B5563]'
                  }`}
                >
                  {settings.searchCategories && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            )}

            {/* 2. Tin tức */}
            {matchesSearch('Tin tức') && (
              <div 
                onClick={() => updateSetting('searchNews', !settings.searchNews)}
                className="p-4 rounded-[20px] bg-[#28272E] flex items-center justify-between gap-4 cursor-pointer hover:bg-[#313038] transition-colors"
              >
                <div>
                  <div className="font-semibold text-white text-sm">
                    Tin tức
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                    Hiển thị các bài viết tin tức, thông báo cộng đồng và sự kiện Discord
                  </div>
                </div>

                <div 
                  className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    settings.searchNews
                      ? 'bg-[#E50914] text-white shadow-sm'
                      : 'bg-[#24242A] border border-[#4B5563]'
                  }`}
                >
                  {settings.searchNews && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            )}

            {/* 3. Truyền hình & Tìm kênh theo số hiệu */}
            {(matchesSearch('Truyền hình') || matchesSearch('Tìm kênh theo số hiệu kênh')) && (
              <div className="p-4 rounded-[20px] bg-[#28272E] space-y-4">
                {/* 3.1 Truyền hình */}
                {matchesSearch('Truyền hình') && (
                  <div 
                    onClick={() => updateSetting('searchTv', !settings.searchTv)}
                    className="flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-white text-sm">
                        Truyền hình
                      </div>
                      <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                        Hiển thị danh sách kênh truyền hình trực tiếp theo tên hoặc nhóm kênh
                      </div>
                    </div>

                    <div 
                      className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        settings.searchTv
                          ? 'bg-[#E50914] text-white shadow-sm'
                          : 'bg-[#24242A] border border-[#4B5563]'
                      }`}
                    >
                      {settings.searchTv && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                )}

                {/* Divider */}
                <hr className="border-[#383742]" />

                {/* 3.2 Tìm kênh theo số hiệu kênh */}
                {matchesSearch('Tìm kênh theo số hiệu kênh') && (
                  <div 
                    onClick={() => updateSetting('searchChannelNumber', !settings.searchChannelNumber)}
                    className="flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#E50914] text-sm">
                          Tìm kênh theo số hiệu kênh
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-[#E50914]/20 text-[#E50914] tracking-wider">
                          CH #
                        </span>
                      </div>
                      <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                        Cho phép gõ số kênh (ví dụ: 1, 001, #12, kênh 5) để tìm nhanh
                      </div>
                    </div>

                    <div 
                      className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        settings.searchChannelNumber
                          ? 'bg-[#E50914] text-white shadow-sm'
                          : 'bg-[#24242A] border border-[#4B5563]'
                      }`}
                    >
                      {settings.searchChannelNumber && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. Toolbox */}
            {matchesSearch('Toolbox') && (
              <div 
                onClick={() => updateSetting('searchToolbox', !settings.searchToolbox)}
                className="p-4 rounded-[20px] bg-[#28272E] flex items-center justify-between gap-4 cursor-pointer hover:bg-[#313038] transition-colors"
              >
                <div>
                  <div className="font-semibold text-white text-sm">
                    Toolbox
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                    Hiển thị các công cụ tiện ích (Xem URL, Thêm kênh, Nhập/Xuất M3U, Multiview,...)
                  </div>
                </div>

                <div 
                  className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    settings.searchToolbox
                      ? 'bg-[#E50914] text-white shadow-sm'
                      : 'bg-[#24242A] border border-[#4B5563]'
                  }`}
                >
                  {settings.searchToolbox && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            )}

            {/* 5. Cài đặt */}
            {matchesSearch('Cài đặt') && (
              <div 
                onClick={() => updateSetting('searchSettings', !settings.searchSettings)}
                className="p-4 rounded-[20px] bg-[#28272E] flex items-center justify-between gap-4 cursor-pointer hover:bg-[#313038] transition-colors"
              >
                <div>
                  <div className="font-semibold text-white text-sm">
                    Cài đặt
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                    Quản lý và chuyển nhanh tới các mục tùy chọn hệ thống
                  </div>
                </div>

                <div 
                  className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    settings.searchSettings
                      ? 'bg-[#E50914] text-white shadow-sm'
                      : 'bg-[#24242A] border border-[#4B5563]'
                  }`}
                >
                  {settings.searchSettings && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
