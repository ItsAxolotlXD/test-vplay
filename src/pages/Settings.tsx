import React, { useState } from 'react';
import { 
  Palette, 
  Key, 
  Search, 
  Type, 
  Check,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useSettings, FONT_SCALE_CONFIG } from '../hooks/useSettings';

export const Settings: React.FC = () => {
  const { settings, updateSetting } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');

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
      </div>

      {/* 2. Section 1: Giao diện */}
      {(matchesSearch('Giao diện') ||
        matchesSearch('Chế độ giao diện') ||
        matchesSearch('Sáng') ||
        matchesSearch('Tối') ||
        matchesSearch('Theme') ||
        matchesSearch('Dock sang Sidebar') ||
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
                Tùy biến chế độ sáng/tối, thanh Dock, Sidebar và tỷ lệ cỡ chữ toàn hệ thống
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {/* Card 0: Chế độ giao diện (Light / Dark) - Placed at the very top of Interface section */}
            {(matchesSearch('Chế độ giao diện') || matchesSearch('Giao diện') || matchesSearch('Sáng') || matchesSearch('Tối') || matchesSearch('Theme') || matchesSearch('Light') || matchesSearch('Dark')) && (
              <div className="p-4 rounded-[20px] bg-[#28272E] flex items-center justify-between gap-4 transition-colors">
                <div>
                  <div className="font-semibold text-white text-sm">
                    Chế độ giao diện
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                    Chuyển đổi giao diện Sáng (Light mode) và Tối (Dark mode)
                  </div>
                </div>

                {/* Theme Selector Capsule */}
                <div className="flex items-center p-1 rounded-full bg-[#18181B] shrink-0 theme-segmented-box border border-transparent">
                  <button
                    id="btn-theme-light"
                    type="button"
                    onClick={() => updateSetting('theme', 'light')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      settings.theme === 'light'
                        ? 'bg-[#E50914] text-white shadow-md'
                        : 'text-[#9CA3AF] hover:text-white'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Sáng</span>
                  </button>
                  <button
                    id="btn-theme-dark"
                    type="button"
                    onClick={() => updateSetting('theme', 'dark')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      settings.theme === 'dark'
                        ? 'bg-[#E50914] text-white shadow-md'
                        : 'text-[#9CA3AF] hover:text-white'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Tối</span>
                  </button>
                </div>
              </div>
            )}

            {/* Card 1: Dock sang Sidebar (No Border) */}
            {matchesSearch('Dock sang Sidebar') && (
              <div className="p-4 rounded-[20px] bg-[#28272E] flex items-center justify-between gap-4 transition-colors">
                <div>
                  <div className="font-semibold text-white text-sm">
                    Dock sang Sidebar
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                    Chuyển thanh điều hướng dưới cùng sang thanh Sidebar bên trái
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

      {/* 4. Section 3: Tìm kiếm */}
      {(matchesSearch('Tìm kiếm') ||
        matchesSearch('Use search interface full page') ||
        matchesSearch('Giao diện tìm kiếm toàn trang') ||
        matchesSearch('Full page') ||
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
                Tùy chỉnh chế độ hiển thị và các danh mục kết quả trong Spotlight Search
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {/* Card 0: Use search interface full page */}
            {(matchesSearch('Use search interface full page') || matchesSearch('Giao diện tìm kiếm toàn trang') || matchesSearch('Full page') || matchesSearch('Tìm kiếm')) && (
              <div className="p-4 rounded-[20px] bg-[#28272E] flex items-center justify-between gap-4 transition-colors">
                <div>
                  <div className="font-semibold text-white text-sm">
                    Use search interface full page
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-1 leading-normal">
                    Mở giao diện tìm kiếm ở chế độ toàn trang thay vì mở dạng popup menu nhỏ
                  </div>
                </div>

                {/* Red Toggle Switch */}
                <button
                  id="toggle-full-page-search"
                  type="button"
                  role="switch"
                  aria-checked={settings.fullPageSearch}
                  onClick={() => updateSetting('fullPageSearch', !settings.fullPageSearch)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center ${
                    settings.fullPageSearch ? 'bg-[#E50914]' : 'bg-[#E4E4E7] dark:bg-[#3F3F46]'
                  }`}
                >
                  <span
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                      settings.fullPageSearch ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )}

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
