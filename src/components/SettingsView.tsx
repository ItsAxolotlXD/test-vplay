import React, { useState } from 'react';
import { UserSettings } from '../types';
import { ExternalLink, Search } from 'lucide-react';
import { playPopSound } from '../utils/sound';
import { VplayToggleSwitch } from './ui/VplayToggleSwitch';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { VplaySlider } from './ui/VplaySlider';
import { useLang } from '../context/LanguageContext';

interface SettingsViewProps {
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
  onCancel: () => void;
  onChangeLiveSettings?: (newSettings: UserSettings) => void;
  onOpenFeedback?: () => void;
  onOpenDesignSystem?: () => void;
}

const SettingsDivider = () => null;

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSave,
  onCancel,
  onChangeLiveSettings,
  onOpenFeedback,
  onOpenDesignSystem,
}) => {
  const { t, setIsDebugModalOpen } = useLang();
  const [initialSettings] = useState<UserSettings>(settings);
  const [temp, setTemp] = useState<UserSettings>({
    disablePanorama: false,
    lockPanoramaScroll: false,
    panoramaScrollSpeed: 5,
    ...settings,
  });

  // Apply live settings preview to App as user adjusts options
  React.useEffect(() => {
    onChangeLiveSettings?.(temp);
  }, [temp, onChangeLiveSettings]);

  const [settingSearch, setSettingSearch] = useState('');
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  const handleToggleSubtitles = () => {
    playPopSound();
    setTemp((prev) => ({ ...prev, subtitles: !prev.subtitles }));
  };

  const handleToggleAutoPlay = () => {
    playPopSound();
    setTemp((prev) => ({ ...prev, autoPlay: !prev.autoPlay }));
  };

  const handleToggleNotifications = () => {
    playPopSound();
    setTemp((prev) => ({ ...prev, notifications: !prev.notifications }));
  };

  const handleToggleDisablePanorama = () => {
    playPopSound();
    setTemp((prev) => ({ ...prev, disablePanorama: !prev.disablePanorama }));
  };

  const handleToggleLockPanorama = () => {
    playPopSound();
    setTemp((prev) => ({ ...prev, lockPanoramaScroll: !prev.lockPanoramaScroll }));
  };

  const handleResetDefault = () => {
    playPopSound();
    setTemp({
      soundVolume: 7,
      qualityOption: '1080p',
      subtitles: true,
      autoPlay: true,
      searchQuery: 'Vplay Member',
      notifications: true,
      preferredCategory: 'all',
      themeMode: 'dark',
      hdQuality: true,
      disablePanorama: false,
      lockPanoramaScroll: false,
      panoramaScrollSpeed: 5,
    });
  };

  const handleSaveClick = () => {
    playPopSound();
    onSave(temp);
  };

  const handleCancelClick = () => {
    playPopSound();
    onChangeLiveSettings?.(initialSettings);
    onCancel();
  };

  // Helper filter function for search term
  const matchesSearch = (title: string, subtitle?: string) => {
    if (!settingSearch.trim()) return true;
    const term = settingSearch.toLowerCase();
    return (
      title.toLowerCase().includes(term) ||
      (subtitle && subtitle.toLowerCase().includes(term))
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-2 sm:my-4 bg-[#4c4f52] border-2 border-[#141414] text-white font-montserrat shadow-2xl rounded-none overflow-hidden select-none">
      
      {/* SEARCH BAR AT THE TOP OF SETTINGS */}
      <div className="p-3 sm:p-4 bg-[#35383b]">
        <div className="relative flex items-center w-full">
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/a/a4/MagnifyingGlass.png/revision/latest?cb=20260730091531"
            alt="Search Icon"
            referrerPolicy="no-referrer"
            className="absolute left-3 w-5 h-5 object-contain pointer-events-none z-10"
          />
          <input
            type="text"
            placeholder="Search for settings"
            value={settingSearch}
            onChange={(e) => setSettingSearch(e.target.value)}
            className="w-full h-9.5 mc-input-box pl-10 pr-8 text-xs font-medium cursor-default"
          />
          {settingSearch && (
            <button
              onClick={() => setSettingSearch('')}
              className="absolute right-3 text-gray-400 hover:text-white text-xs px-1 cursor-pointer font-bold z-10"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <SettingsDivider />

      {/* Welcome & Feedback Banner Box */}
      <div className="p-3 sm:p-4 bg-[#424548] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-[11px] text-gray-300 font-normal leading-normal mb-0.5">
            Welcome to design preview!
          </h2>
          <p className="text-[11px] text-gray-300 font-normal leading-normal">
            We would love to hear what you think of this new design. Keep in mind that it's still work in progress and some functionality might be missing
          </p>
        </div>
        <VplaySecondaryButton
          size="sm"
          fullWidth={false}
          onClick={() => {
            playPopSound();
            if (onOpenFeedback) onOpenFeedback();
            else alert('Cảm ơn bạn đã đóng góp ý kiến về giao diện Vplay!');
          }}
          className="flex-shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Give feedback
        </VplaySecondaryButton>
      </div>

      <SettingsDivider />

      {/* SUBHEADING 1: GIAO DIỆN VÀ TÙY BIẾN */}
      {(matchesSearch('Disable panorama') ||
        matchesSearch('Lock panorama scroll') ||
        matchesSearch('Panorama scroll speed') ||
        matchesSearch('GIAO DIỆN VÀ TÙY BIẾN')) && (
        <div>
          <div className="px-3 sm:px-4 py-2 bg-[#3d4043]">
            <h3 className="font-bold text-xs tracking-wider uppercase text-gray-200">
              GIAO DIỆN VÀ TÙY BIẾN
            </h3>
          </div>

          <SettingsDivider />

          {/* Item 1: Disable panorama */}
          {matchesSearch('Disable panorama', 'Đổi nền ứng dụng thành màu xám tối thay vì nền không gian.') && (
            <>
              <div className="px-3 sm:px-4 py-3 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-xs text-white">Disable panorama</div>
                  <div className="text-[10px] text-gray-300 font-normal">
                    Đổi nền ứng dụng thành màu xám tối thay vì nền không gian.
                  </div>
                </div>
                <VplayToggleSwitch
                  checked={temp.disablePanorama || false}
                  onChange={handleToggleDisablePanorama}
                />
              </div>
              <SettingsDivider />
            </>
          )}

          {/* Item 2: Lock panorama scroll */}
          {matchesSearch('Lock panorama scroll', 'Khóa nền không gian đứng yên thay vì quay.') && (
            <>
              <div className="px-3 sm:px-4 py-3 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-xs text-white">Lock panorama scroll</div>
                  <div className="text-[10px] text-gray-300 font-normal">
                    Khóa nền không gian đứng yên thay vì quay.
                  </div>
                </div>
                <VplayToggleSwitch
                  checked={temp.lockPanoramaScroll || false}
                  onChange={handleToggleLockPanorama}
                />
              </div>
              <SettingsDivider />
            </>
          )}

          {/* Item 3: Panorama scroll speed */}
          {matchesSearch('Panorama scroll speed', 'Tùy chỉnh độ quay nền không gian nhanh hay chậm.') && (
            <>
              <div className="px-3 sm:px-4 py-3 hover:bg-[#525559] transition-colors space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-white">Panorama scroll speed</div>
                    <div className="text-[10px] text-gray-300 font-normal">
                      Tùy chỉnh độ quay nền không gian nhanh hay chậm.
                    </div>
                  </div>
                  <span className="font-mono font-bold text-xs text-gray-200">
                    {temp.panoramaScrollSpeed || 5}
                  </span>
                </div>

                <VplaySlider
                  label=""
                  value={temp.panoramaScrollSpeed || 5}
                  min={1}
                  max={10}
                  onChange={(v) => setTemp({ ...temp, panoramaScrollSpeed: v })}
                  noBackground
                  className="!p-0"
                />
              </div>
              <SettingsDivider />
            </>
          )}
        </div>
      )}

      {/* SUBHEADING: TÀI KHOẢN & THÔNG BÁO */}
      {(matchesSearch('Tên người dùng') ||
        matchesSearch('Sign in with Vplay account') ||
        matchesSearch('Thông báo sự kiện thể thao trực tiếp') ||
        matchesSearch('TÀI KHOẢN & THÔNG BÁO')) && (
        <div>
          <div className="px-3 sm:px-4 py-2 bg-[#3d4043]">
            <h3 className="font-bold text-xs tracking-wider uppercase text-gray-200">
              TÀI KHOẢN & THÔNG BÁO
            </h3>
          </div>

          <SettingsDivider />

          {/* Sign in with Vplay account */}
          {matchesSearch('Sign in with Vplay account', 'Experience all the best things of Vplay with an official account.') && (
            <>
              <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-xs text-white">
                    Sign in with Vplay account
                  </div>
                  <div className="text-[10px] text-gray-300 font-normal">
                    Experience all the best things of Vplay with an official account.
                  </div>
                </div>
                <div className="w-24 flex-shrink-0">
                  <VplaySecondaryButton
                    size="sm"
                    onClick={() => {
                      playPopSound();
                      setShowComingSoonModal(true);
                    }}
                    className="w-full text-center"
                  >
                    Sign in
                  </VplaySecondaryButton>
                </div>
              </div>
              <SettingsDivider />
            </>
          )}

          {/* Gamertag / User Name */}
          {matchesSearch('Tên người dùng', 'Gamertag / User') && (
            <>
              <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-xs text-white">Tên người dùng (Gamertag / User)</div>
                  <div className="text-[10px] text-gray-300 font-normal">
                    Tên danh xưng hiển thị trên thiết bị đầu thu Vplay
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={temp.searchQuery}
                    onChange={(e) => setTemp({ ...temp, searchQuery: e.target.value })}
                    className="w-40 h-8 bg-[#222426] text-white px-2.5 py-1 text-xs font-normal font-montserrat border-2 border-[#141414] focus:outline-none focus:border-white shadow-[inset_0_2px_0_rgba(0,0,0,0.4)] cursor-pointer"
                  />
                </div>
              </div>
              <SettingsDivider />
            </>
          )}

          {/* Notifications Toggle */}
          {matchesSearch('Thông báo sự kiện thể thao trực tiếp', 'Nhận nhắc nhở lịch thi đấu Ngoại hạng Anh & sự kiện trực tiếp') && (
            <>
              <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-xs text-white">
                    Thông báo sự kiện thể thao trực tiếp
                  </div>
                  <div className="text-[10px] text-gray-300 font-normal">
                    Nhận nhắc nhở lịch thi đấu Ngoại hạng Anh & sự kiện trực tiếp
                  </div>
                </div>
                <VplayToggleSwitch
                  checked={temp.notifications}
                  onChange={handleToggleNotifications}
                />
              </div>
              <SettingsDivider />
            </>
          )}
        </div>
      )}

      {/* SUBHEADING 5: TÙY CHỌN NHÀ PHÁT TRIỂN */}
      {(matchesSearch('JSON UI design components') ||
        matchesSearch('Design components') ||
        matchesSearch('Debug mode') ||
        matchesSearch('vplay.lang') ||
        matchesSearch('Reset settings to default') ||
        matchesSearch('TÙY CHỌN NHÀ PHÁT TRIỂN')) && (
        <div>
          <div className="px-3 sm:px-4 py-2 bg-[#3d4043]">
            <h3 className="font-bold text-xs tracking-wider uppercase text-gray-200">
              TÙY CHỌN NHÀ PHÁT TRIỂN
            </h3>
          </div>

          <SettingsDivider />

          {/* Item 1: Debug Mode (vplay.lang) */}
          {(matchesSearch('Debug Mode', 'File language editor vplay.lang') ||
            matchesSearch('Debug Mode (vplay.lang)') ||
            matchesSearch('vplay.lang')) && (
            <>
              <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#d90429] animate-pulse" />
                    Debug Mode (vplay.lang)
                  </div>
                  <div className="text-[10px] text-gray-300 font-normal">
                    Chỉnh sửa & áp dụng file ngôn ngữ vplay.lang thời gian thực toàn bộ ứng dụng.
                  </div>
                </div>
                <div className="w-24 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setIsDebugModalOpen(true);
                    }}
                    className="w-full bg-[#d90429] hover:bg-[#ef233c] text-white font-bold text-xs py-1 px-2 border-2 border-[#141414] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_0_#141414] active:translate-y-[1px] cursor-pointer"
                  >
                    Kích hoạt
                  </button>
                </div>
              </div>
              <SettingsDivider />
            </>
          )}

          {/* Item 2: JSON UI design components */}
          {(matchesSearch('JSON UI design components', 'Hệ thống ngôn ngữ thiết kế giao diện của Vplay.') ||
            matchesSearch('Design components')) && (
            <>
              <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-xs text-white">JSON UI design components</div>
                  <div className="text-[10px] text-gray-300 font-normal">
                    Hệ thống ngôn ngữ thiết kế giao diện JSON UI của Vplay.
                  </div>
                </div>
                <div className="w-20 flex-shrink-0">
                  <VplaySecondaryButton
                    size="sm"
                    onClick={() => {
                      playPopSound();
                      if (onOpenDesignSystem) onOpenDesignSystem();
                    }}
                    className="w-full text-center"
                  >
                    Open
                  </VplaySecondaryButton>
                </div>
              </div>
              <SettingsDivider />
            </>
          )}

          {/* Item 2: Reset settings to default */}
          {matchesSearch('Reset settings to default', 'Restore all above options to their original values.') && (
            <>
              <div className="px-3 sm:px-4 py-2.5 hover:bg-[#525559] transition-colors flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-xs text-white">Reset settings to default</div>
                  <div className="text-[10px] text-gray-300 font-normal">
                    Restore all above options to their original values.
                  </div>
                </div>
                <div className="w-20 flex-shrink-0">
                  <VplaySecondaryButton
                    size="sm"
                    onClick={handleResetDefault}
                    className="w-full text-center"
                  >
                    Reset
                  </VplaySecondaryButton>
                </div>
              </div>
              <SettingsDivider />
            </>
          )}
        </div>
      )}

      {/* Save Action Bar */}
      <SettingsDivider />
      <div className="p-3 bg-[#3d4043] flex items-center justify-end gap-2.5">
        <button
          onClick={handleCancelClick}
          className="bg-[#323437] hover:bg-[#3d4043] text-gray-200 font-bold text-xs px-4 py-1.5 border-2 border-[#141414] cursor-pointer active:translate-y-[1px] btn-press-effect"
        >
          {t('settings.cancel', 'HỦY BỎ')}
        </button>
        <button
          onClick={handleSaveClick}
          className="bg-[#55b331] hover:bg-[#62c938] text-white font-extrabold text-xs px-5 py-1.5 border-2 border-[#141414] shadow-[inset_0_1px_0_#89dc69] cursor-pointer active:translate-y-[1px] btn-press-effect"
        >
          {t('settings.save', 'LƯU CÀI ĐẶT')}
        </button>
      </div>

      <SettingsDivider />

      {/* Footer Diagnostic Info */}
      <div className="px-3 sm:px-4 py-2.5 bg-[#383b3e] text-[10px] font-mono text-gray-400 space-y-0.5">
        <div>DID: cf4bef566256457eb1391a01b5b02e2c</div>
        <div>VCID: 28601FFA239DADCE</div>
        <div>VERSION: release-preview</div>
      </div>
      <SettingsDivider />

      {/* COMING SOON MODAL */}
      {showComingSoonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in overflow-y-auto">
          {/* Main Modal Box with WHITE OUTER BORDER & Slide-in left animation */}
          <div className="bg-[#c6c6c6] border-2 border-white shadow-[0_20px_50px_rgba(0,0,0,0.9)] w-full max-w-md p-5 sm:p-6 text-[#1c1d1f] font-sans select-none flex flex-col my-auto overflow-hidden animate-slide-in-left">
            
            {/* Header Title outside dark box */}
            <h2 className="text-sm sm:text-base font-bold text-[#1c1d1f] tracking-wide mb-3 font-jura uppercase">
              Coming soon
            </h2>

            {/* Dark Inset Box with Black Outer Border + Sharp WHITE INNER BORDER */}
            <div className="bg-[#0e0e0e] border-2 border-[#141414] p-[2px] mb-4">
              <div className="border border-white/90 p-4 sm:p-5 text-white font-sans text-xs sm:text-sm leading-relaxed space-y-3 font-normal">
                <p>
                  Tính năng Đăng nhập tài khoản Vplay & Đồng bộ hóa dữ liệu hiện đang trong quá trình phát triển và hoàn thiện.
                </p>
                <p>
                  Hãy quay lại trong các bản cập nhật tiếp theo để trải nghiệm đầy đủ các tiện ích tuyệt vời nhất từ Vplay!
                </p>
              </div>
            </div>

            {/* Stacked Minecraft JSON UI Action Buttons (Secondary style, NO WHITE BORDER) */}
            <div className="space-y-2.5">
              {/* Button 1: Secondary Style (like Close button, no white frame) */}
              <button
                onClick={() => {
                  playPopSound();
                  setShowComingSoonModal(false);
                }}
                className="w-full py-2.5 sm:py-3 px-4 bg-[#c6c6c6] hover:bg-[#28960b] active:bg-[#2b611a] text-[#404040] hover:text-white font-bold text-xs sm:text-sm uppercase tracking-wide font-jura border-2 border-[#141414] shadow-[inset_2px_2px_0_#ffffff,inset_-2px_-2px_0_#898d91] hover:shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] active:translate-y-[1px] cursor-default flex items-center justify-center gap-2 transition-none"
              >
                Đã hiểu (Understood)
              </button>

              {/* Button 2: Secondary Style (no white frame) */}
              <button
                onClick={() => {
                  playPopSound();
                  setShowComingSoonModal(false);
                }}
                className="w-full py-2.5 sm:py-3 px-4 bg-[#c6c6c6] hover:bg-[#28960b] active:bg-[#2b611a] text-[#404040] hover:text-white font-bold text-xs sm:text-sm uppercase tracking-wide font-jura border-2 border-[#141414] shadow-[inset_2px_2px_0_#ffffff,inset_-2px_-2px_0_#898d91] hover:shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] active:translate-y-[1px] cursor-default flex items-center justify-center gap-2 transition-none"
              >
                Đóng (Close)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
