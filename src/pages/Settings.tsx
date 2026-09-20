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
  Keyboard as KeyboardIcon
} from 'lucide-react';
import { useSettings, FONT_SCALE_CONFIG, FONT_FAMILY_CONFIG, WALLPAPER_PRESETS, VBOARD_SKIN_OPTIONS, VBoardSkin } from '../hooks/useSettings';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import { useTabSearch } from '../context/TabSearchContext';

interface SettingsProps {
  navigate?: (route: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ navigate }) => {
  const { settings, updateSetting } = useSettings();
  const { flags, setFlag } = useFeatureFlags();
  const { searchQuery, setSearchQuery } = useTabSearch();
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

  const isSection1Visible = matchesSearch(
    'Giao diện', 'Chế độ giao diện', 'Floaty bar', 'Floaty', 'Navigation bar',
    'floating', 'floats', 'Sáng', 'Tối', 'Theme', 'Thanh điều hướng',
    'Sidebar', 'Top bar', 'topbar', 'Bố cục', 'Dock sang Sidebar', 'Dock',
    'Phông chữ', 'Font', 'Integer', 'Alata', 'Google Sans', 'Montserrat',
    'Cỡ chữ ứng dụng', 'Cỡ chữ', 'Cài đặt', 'Settings', 'UI', 'Display',
    'Appearance', 'Splash Screen', 'Reload App', 'Màn hình khởi động', 'Tải lại', 'Refresh',
    'Change your background', 'Background', 'Hình nền', 'Wallpaper', 'Liquid Glass', 'Duo Light', 'Duo Dark',
    'Shiny outline', 'Shiny', 'Outline', 'Viền', 'Viền sáng bóng', 'Specular', 'Rim'
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
    'AI Copilot', 'Gỡ lỗi', 'Labs', 'Flags'
  );

  const hasAnyResults = !normalizedQuery || isSection1Visible || isSection2Visible || isSection3Visible || isSection4Visible || isFeatureFlagsVisible;

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
          <div className="w-full h-[46px] sm:h-[48px] flex items-center justify-between px-4 rounded-full spotlight-bubble-box search-box-capsule float-search-style text-sm transition-all border-0">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-[20px] h-[20px] min-w-[20px] min-h-[20px] flex items-center justify-center shrink-0">
                <Search className="w-5 h-5 text-white stroke-[2.4] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
              </div>
              <input
                id="settings-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm cài đặt..."
                className="w-full bg-transparent text-white placeholder-white/60 text-sm focus:outline-none font-semibold truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] border-0"
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

        {/* Feature Flags Quick Entry Card */}
        {isFeatureFlagsVisible && (
          <div 
            onClick={() => navigate ? navigate('/feature-flags') : window.location.assign('/feature-flags')}
            className="p-4 sm:p-5 rounded-[22px] bg-gradient-to-r from-cyan-950/40 via-[#1E1D24] to-[#1E1D24] border-0 shadow-lg flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border-0 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Flag className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                    Feature Flags
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border-0">
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
      {isSection1Visible && (
        <section 
          id="settings-section-interface"
          className="settings-category-section p-5 sm:p-6 rounded-[28px] bg-transparent backdrop-blur-2xl border-0 shadow-xl space-y-4"
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
                className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent flex items-center justify-between gap-4 transition-colors border border-cyan-500/20 hover:border-cyan-500/40 hover:bg-white/[0.03]"
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
                className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent flex items-center justify-between gap-4 transition-colors border border-white/10 hover:border-white/25 hover:bg-white/[0.03]"
              >
                <div className="space-y-1">
                  <div className="font-semibold text-white text-sm flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-amber-300" />
                    <span>Shiny outline</span>
                    {settings.shinyOutline !== false && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-white/90 border border-white/20">
                        ĐANG BẬT
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#9CA3AF] leading-normal">
                    Viền 2 cạnh trên dưới phản chiếu kính mờ cho toàn bộ giao diện
                  </div>
                  <div className="text-[11px] text-gray-400 leading-relaxed">
                    Thêm viền phản chiếu ánh sáng trắng (Specular top & bottom rim highlight) ở 2 cạnh trên và dưới của các nút status bar vào toàn bộ elements trong ứng dụng (ô kênh, menus, buttons, toggles, nền danh mục, các khối thẻ, banner, search boxes và input boxes).
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  id="toggle-shiny-outline"
                  type="button"
                  role="switch"
                  aria-checked={settings.shinyOutline !== false}
                  onClick={() => updateSetting('shinyOutline', settings.shinyOutline === false ? true : false)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center ${
                    settings.shinyOutline !== false ? 'bg-[#E50914]' : 'bg-[#E4E4E7] dark:bg-[#3F3F46]'
                  }`}
                >
                  <span
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                      settings.shinyOutline !== false ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Card: Change your background */}
            {(matchesSearch('Change your background') ||
              matchesSearch('Background') ||
              matchesSearch('Hình nền') ||
              matchesSearch('Wallpaper') ||
              matchesSearch('Liquid Glass') ||
              matchesSearch('Duo Light') ||
              matchesSearch('Duo Dark') ||
              matchesSearch('Giao diện')) && (
              <div 
                id="settings-card-change-background"
                className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent space-y-3.5 transition-colors border border-purple-500/20 hover:border-purple-500/40 hover:bg-white/[0.03]"
              >
                <div>
                  <div className="font-semibold text-white text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4.5 h-4.5 text-purple-400" />
                      <span>Change your background</span>
                    </div>
                    {settings.appBackground && settings.appBackground !== 'default' && (
                      <button
                        type="button"
                        onClick={() => updateSetting('appBackground', 'default')}
                        className="text-[11px] text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        Khôi phục nền mặc định
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-purple-300 font-medium mt-1">
                    Changing your background to see how Liquid Glass on Vplay reacts!
                  </div>
                  <div className="text-[11px] text-[#9CA3AF] mt-1 leading-relaxed">
                    Người dùng chọn một mẫu nền cho sẵn và app background sẽ đổi theo hình đó thay vì là solid color mặc định. Các thành phần kính mờ Liquid Glass (Top bar, Sidebar, Floating Search Bar, V-board) sẽ phản chiếu và khúc xạ màu sắc chân thực.
                  </div>
                </div>

                {/* Wallpaper Previews Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {WALLPAPER_PRESETS.map((wp) => {
                    const isSelected = settings.appBackground === wp.id || (!settings.appBackground && wp.id === 'default');
                    return (
                      <button
                        key={wp.id}
                        id={`wallpaper-preset-${wp.id}`}
                        type="button"
                        onClick={() => updateSetting('appBackground', wp.id)}
                        className={`relative flex flex-col p-2.5 rounded-2xl border text-left transition-all group cursor-pointer ${
                          isSelected 
                            ? 'bg-purple-950/30 border-purple-500 ring-2 ring-purple-500/40 shadow-lg' 
                            : 'bg-[#1E1D24] border-white/5 hover:border-white/20 hover:bg-[#23222B]'
                        }`}
                      >
                        {/* Visual Preview Box */}
                        <div className="w-full h-24 rounded-xl overflow-hidden relative border border-white/10 mb-2.5 bg-[#121216] flex items-center justify-center">
                          {wp.type === 'image' ? (
                            <img
                              src={wp.previewUrl}
                              alt={wp.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#181818] flex flex-col items-center justify-center gap-1 text-zinc-400">
                              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                                <Moon className="w-4 h-4 text-zinc-300" />
                              </div>
                              <span className="text-[10px] font-mono text-zinc-400">Solid #181818</span>
                            </div>
                          )}

                          {/* Selected Badge */}
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-md">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}

                          {/* Liquid Glass reaction preview badge */}
                          <div className="absolute bottom-1.5 inset-x-2 py-0.5 px-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-between text-[9px] text-white pointer-events-none">
                            <span className="truncate">Liquid Glass</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                          </div>
                        </div>

                        {/* Name and description */}
                        <div className="space-y-0.5">
                          <div className="font-bold text-white text-xs flex items-center justify-between">
                            <span>{wp.name}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 line-clamp-2 leading-tight">
                            {wp.subtext}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Card 0: Chế độ giao diện (Dark Mode mặc định) */}
            {(matchesSearch('Chế độ giao diện') || matchesSearch('Giao diện') || matchesSearch('Theme') || matchesSearch('Dark')) && (
              <div className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.03] flex items-center justify-between gap-4 transition-colors">
                <div>
                  <div className="font-semibold text-white text-sm flex items-center gap-2">
                    <Moon className="w-4 h-4 text-[#FF3366]" />
                    <span>Chế độ giao diện Dark Mode</span>
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                    Ứng dụng Vplay hoạt động ở chế độ nền tối chuyên biệt (#181818) tối ưu thị giác cho trải nghiệm truyền hình.
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
              <div className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.03] space-y-3.5 transition-colors">
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
              <div className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.03] flex items-center justify-between gap-4 transition-colors">
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
                className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.03] space-y-3.5 transition-colors"
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
                className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.03] space-y-4 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-white text-sm flex items-center gap-2">
                      <KeyboardIcon className="w-4.5 h-4.5 text-cyan-400" />
                      <span>Giao diện bàn phím ảo (V-Board Skins)</span>
                    </div>
                    <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                      Tùy chọn phong cách hiển thị cho bàn phím ảo V-board. Mỗi giao diện được mô phỏng chuẩn xác từ bố cục, phím bấm đến âm thanh tương tác.
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shrink-0">
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
                            ? 'bg-[#1E1D24] border-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400'
                            : 'bg-[#1E1D24]/60 border-white/5 hover:border-white/20 hover:bg-[#1E1D24]'
                        }`}
                      >
                        {/* Header: Title + Checkbox */}
                        <div className="flex items-start justify-between gap-2 w-full">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-sm font-semibold transition-colors ${
                                isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'
                              }`}>
                                {skinOption.name}
                              </span>
                              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-md bg-white/10 text-gray-300 border border-white/10">
                                {skinOption.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#9CA3AF] mt-1.5 leading-snug">
                              {skinOption.description}
                            </p>
                          </div>

                          <div 
                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-150 ${
                              isSelected
                                ? 'bg-cyan-500 border-cyan-500 text-black shadow-sm'
                                : 'border-[#4B4B58] bg-[#141419] text-transparent group-hover:border-[#71717A]'
                            }`}
                            aria-checked={isSelected}
                            role="checkbox"
                          >
                            <Check className={`w-3.5 h-3.5 stroke-[3] transition-transform ${isSelected ? 'scale-100' : 'scale-50 opacity-0'}`} />
                          </div>
                        </div>

                        {/* Visual Keycap Preview Widget */}
                        <div 
                          className="w-full mt-3 p-2 rounded-xl border border-white/10 flex items-center justify-center gap-1.5 overflow-hidden"
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

            {/* Card 2: Cỡ chữ ứng dụng (Liquid Glass Pill Slider Style) */}
            {matchesSearch('Cỡ chữ ứng dụng') && (
              <div className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.03] space-y-4">
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
                  <div className="group relative w-full h-16 rounded-[24px] bg-white/[0.04] border border-white/10 flex items-center px-6 transition-all settings-slider-capsule">
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
              <div className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.03] flex items-center justify-between gap-4 transition-colors">
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
              <div className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.03] flex items-center justify-between gap-4 transition-colors">
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
      {isSection2Visible && (
        <section 
          id="settings-section-accessibility"
          className="settings-category-section p-5 sm:p-6 rounded-[28px] bg-transparent backdrop-blur-2xl border-0 shadow-xl space-y-4"
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
              <div className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.03] flex items-center justify-between gap-4 transition-colors">
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
              <div className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.03] flex items-center justify-between gap-4 transition-colors">
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

            {/* Card 3: Inspect Elements (Inspect web này) */}
            {(matchesSearch('Inspect elements', 'Inspect web này', 'Kiểm tra phần tử', 'DevTools', 'DOM', 'Elements', 'Soi phần tử')) && (
              <div className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.03] space-y-3 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold text-white text-sm flex items-center gap-2">
                      <span>Inspect Elements (Inspect web này)</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#007AFF]/20 text-[#007AFF] border border-[#007AFF]/30">
                        DevTools
                      </span>
                    </div>
                    <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                      Bật công cụ soi phần tử DOM, tra cứu mã nguồn HTML, xem thuộc tính CSS và mở bảng điều khiển DevTools trực tiếp trên web
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    id="toggle-inspect-elements"
                    type="button"
                    role="switch"
                    aria-checked={settings.inspectElements}
                    onClick={() => updateSetting('inspectElements', !settings.inspectElements)}
                    className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center ${
                      settings.inspectElements ? 'bg-[#007AFF]' : 'bg-[#E4E4E7] dark:bg-[#3F3F46]'
                    }`}
                  >
                    <span
                      className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                        settings.inspectElements ? 'translate-x-5.5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {settings.inspectElements && (
                  <div className="pt-2 border-t border-white/5 text-xs text-[#34C759] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
                    <span>Đã kích hoạt: Nút công cụ nổi &quot;Soi phần tử&quot; &amp; DevTools đã sẵn sàng ở góc màn hình.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. Section 3: Copilot for Vplay */}
      {isSection3Visible && (
        <section 
          id="settings-section-copilot"
          className="settings-category-section p-5 sm:p-6 rounded-[28px] bg-transparent backdrop-blur-2xl border-0 shadow-xl space-y-4"
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
              <div className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.03] space-y-3.5 transition-colors">
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
              <div className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.03] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
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
              <div className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.03] flex items-center justify-between gap-4 transition-colors">
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
              <div className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.03] flex items-center justify-between gap-4 transition-colors">
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
      {isSection4Visible && (
        <section 
          id="settings-section-search"
          className="settings-category-section p-5 sm:p-6 rounded-[28px] bg-transparent backdrop-blur-2xl border-0 shadow-xl space-y-4"
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
                className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.03] flex items-center justify-between gap-4 cursor-pointer transition-colors"
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
                className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.03] flex items-center justify-between gap-4 cursor-pointer transition-colors"
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
              <div className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.03] space-y-4">
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
                className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.03] flex items-center justify-between gap-4 cursor-pointer transition-colors"
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
                className="settings-item-card p-4 rounded-[20px] bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.03] flex items-center justify-between gap-4 cursor-pointer transition-colors"
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

      {/* Empty State when no settings match query */}
      {!hasAnyResults && (
        <div className="py-12 px-6 text-center rounded-[28px] bg-[#1E1D22] border border-white/10 space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-zinc-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">
            Không tìm thấy cài đặt nào
          </h3>
          <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto leading-relaxed">
            Không tìm thấy cài đặt khớp với từ khóa &quot;{searchQuery}&quot;. Thử tìm kiếm với từ khóa như giao diện, sidebar, font, trợ năng, copilot...
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Xóa tìm kiếm
          </button>
        </div>
      )}
    </div>
  );
};
