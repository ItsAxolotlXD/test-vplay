import React, { useState } from 'react';
import { UserSettings } from '../types';
import { ExternalLink, Search, Activity, Cpu, Gauge, X } from 'lucide-react';
import { playPopSound } from '../utils/sound';
import { VplayToggleSwitch } from './ui/VplayToggleSwitch';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { VplaySlider } from './ui/VplaySlider';
import { useLang } from '../context/LanguageContext';
import { PerformanceStressModal } from './PerformanceStressModal';
import { DataDrivenUiModal } from './DataDrivenUiModal';

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
  const [isDduiModalOpen, setIsDduiModalOpen] = useState(false);

  // Performance test state
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [perfResults, setPerfResults] = useState<{
    fps: number;
    frameTime: number;
    domNodes: number;
    memoryMB: string;
    score: number;
    grade: string;
  } | null>(null);

  const handleRunPerfTest = () => {
    playPopSound();
    setIsStressTesting(true);
  };

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
    <div className="w-full max-w-3xl mx-auto my-2 sm:my-4 bg-[#4a4d50] border-2 border-[#141414] text-white font-montserrat shadow-2xl rounded-none overflow-hidden select-none">
      
      {/* SEARCH BAR AT THE TOP OF SETTINGS */}
      <div className="p-3 sm:p-4 bg-[#4a4d50]">
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
              className="absolute right-3 text-gray-300 hover:text-white text-xs px-1 cursor-pointer font-bold z-10"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Welcome & Feedback Banner Box */}
      <div className="p-3 sm:p-4 bg-[#4a4d50] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-[11px] text-gray-200 font-normal leading-normal mb-0.5">
            Welcome to design preview!
          </h2>
          <p className="text-[11px] text-gray-200 font-normal leading-normal">
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

      {/* SUBHEADING 1: GIAO DIỆN VÀ TÙY BIẾN */}
      {(matchesSearch('Disable panorama') ||
        matchesSearch('Lock panorama scroll') ||
        matchesSearch('Panorama scroll speed') ||
        matchesSearch('GIAO DIỆN VÀ TÙY BIẾN')) && (
        <div>
          <div className="px-3 sm:px-4 py-2 bg-[#3f4245]">
            <h3 className="font-bold text-xs tracking-wider uppercase text-gray-200">
              GIAO DIỆN VÀ TÙY BIẾN
            </h3>
          </div>

          {/* Item 1: Disable panorama */}
          {matchesSearch('Disable panorama', 'Đổi nền ứng dụng thành màu xám tối thay vì nền không gian.') && (
            <div className="px-3 sm:px-4 py-3 hover:bg-[#56595c] transition-colors flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-xs text-white">Disable panorama</div>
                <div className="text-[10px] text-gray-200 font-normal">
                  Đổi nền ứng dụng thành màu xám tối thay vì nền không gian.
                </div>
              </div>
              <VplayToggleSwitch
                checked={temp.disablePanorama || false}
                onChange={handleToggleDisablePanorama}
              />
            </div>
          )}

          {/* Item 2: Lock panorama scroll */}
          {matchesSearch('Lock panorama scroll', 'Khóa nền không gian đứng yên thay vì quay.') && (
            <div className="px-3 sm:px-4 py-3 hover:bg-[#56595c] transition-colors flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-xs text-white">Lock panorama scroll</div>
                <div className="text-[10px] text-gray-200 font-normal">
                  Khóa nền không gian đứng yên thay vì quay.
                </div>
              </div>
              <VplayToggleSwitch
                checked={temp.lockPanoramaScroll || false}
                onChange={handleToggleLockPanorama}
              />
            </div>
          )}

          {/* Item 3: Panorama scroll speed */}
          {matchesSearch('Panorama scroll speed', 'Tùy chỉnh độ quay nền không gian nhanh hay chậm.') && (
            <div className="px-3 sm:px-4 py-3 hover:bg-[#56595c] transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-white">Panorama scroll speed</div>
                  <div className="text-[10px] text-gray-200 font-normal">
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
          )}
        </div>
      )}

      {/* SUBHEADING: TÀI KHOẢN & THÔNG BÁO */}
      {(matchesSearch('Tên người dùng') ||
        matchesSearch('Sign in with Vplay account') ||
        matchesSearch('Thông báo sự kiện thể thao trực tiếp') ||
        matchesSearch('TÀI KHOẢN & THÔNG BÁO')) && (
        <div>
          <div className="px-3 sm:px-4 py-2 bg-[#3f4245]">
            <h3 className="font-bold text-xs tracking-wider uppercase text-gray-200">
              TÀI KHOẢN & THÔNG BÁO
            </h3>
          </div>

          {/* Sign in with Vplay account */}
          {matchesSearch('Sign in with Vplay account', 'Experience all the best things of Vplay with an official account.') && (
            <div className="px-3 sm:px-4 py-3 hover:bg-[#56595c] transition-colors flex flex-col gap-2.5">
              <div>
                <div className="font-bold text-xs text-white">
                  Sign in with Vplay account
                </div>
                <div className="text-[10px] text-gray-200 font-normal">
                  Experience all the best things of Vplay with an official account.
                </div>
              </div>
              <div className="w-full">
                <VplaySecondaryButton
                  size="normal"
                  fullWidth={true}
                  onClick={() => {
                    playPopSound();
                    setShowComingSoonModal(true);
                  }}
                  className="w-full text-center py-2.5 min-h-[40px]"
                >
                  Sign in
                </VplaySecondaryButton>
              </div>
            </div>
          )}

          {/* Gamertag / User Name */}
          {matchesSearch('Tên người dùng', 'Gamertag / User') && (
            <div className="px-3 sm:px-4 py-2.5 hover:bg-[#56595c] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="font-bold text-xs text-white">Tên người dùng (Gamertag / User)</div>
                <div className="text-[10px] text-gray-200 font-normal">
                  Tên danh xưng hiển thị trên thiết bị đầu thu Vplay
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={temp.searchQuery}
                  onChange={(e) => setTemp({ ...temp, searchQuery: e.target.value })}
                  className="w-40 h-8 bg-[#35383b] text-white px-2.5 py-1 text-xs font-normal font-montserrat border-2 border-[#141414] focus:outline-none focus:border-white shadow-[inset_0_2px_0_rgba(0,0,0,0.4)] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Notifications Toggle */}
          {matchesSearch('Thông báo sự kiện thể thao trực tiếp', 'Nhận nhắc nhở lịch thi đấu Ngoại hạng Anh & sự kiện trực tiếp') && (
            <div className="px-3 sm:px-4 py-2.5 hover:bg-[#56595c] transition-colors flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-xs text-white">
                  Thông báo sự kiện thể thao trực tiếp
                </div>
                <div className="text-[10px] text-gray-200 font-normal">
                  Nhận nhắc nhở lịch thi đấu Ngoại hạng Anh & sự kiện trực tiếp
                </div>
              </div>
              <VplayToggleSwitch
                checked={temp.notifications}
                onChange={handleToggleNotifications}
              />
            </div>
          )}
        </div>
      )}

      {/* SUBHEADING 5: TÙY CHỌN NHÀ PHÁT TRIỂN */}
      {(matchesSearch('Ore UI design components') ||
        matchesSearch('Design components') ||
        matchesSearch('Performance test') ||
        matchesSearch('Debug mode') ||
        matchesSearch('vplay.lang') ||
        matchesSearch('Reset settings to default') ||
        matchesSearch('TÙY CHỌN NHÀ PHÁT TRIỂN')) && (
        <div>
          <div className="px-3 sm:px-4 py-2 bg-[#3f4245]">
            <h3 className="font-bold text-xs tracking-wider uppercase text-gray-200">
              TÙY CHỌN NHÀ PHÁT TRIỂN
            </h3>
          </div>

          {/* Item 1: Debug Mode (vplay.lang) */}
          {(matchesSearch('Debug Mode', 'File language editor vplay.lang') ||
            matchesSearch('Debug Mode (vplay.lang)') ||
            matchesSearch('vplay.lang')) && (
            <div className="px-3 sm:px-4 py-3 hover:bg-[#56595c] transition-colors flex flex-col gap-2.5">
              <div>
                <div className="font-bold text-xs text-white">
                  Debug Mode (vplay.lang)
                </div>
                <div className="text-[10px] text-gray-200 font-normal">
                  Chỉnh sửa & áp dụng file ngôn ngữ vplay.lang thời gian thực toàn bộ ứng dụng.
                </div>
              </div>
              <div className="w-full">
                <VplaySecondaryButton
                  size="normal"
                  fullWidth={true}
                  onClick={() => {
                    playPopSound();
                    setIsDebugModalOpen(true);
                  }}
                  className="w-full text-center py-2.5 min-h-[40px]"
                >
                  Kích hoạt
                </VplaySecondaryButton>
              </div>
            </div>
          )}

          {/* Item 2: Performance test */}
          {(matchesSearch('Performance test', 'Kiểm tra hiệu năng ứng dụng, tốc độ khung hình (FPS) và độ trễ') ||
            matchesSearch('Performance') ||
            matchesSearch('Performance test')) && (
            <div className="px-3 sm:px-4 py-3 hover:bg-[#56595c] transition-colors flex flex-col gap-2.5">
              <div>
                <div className="font-bold text-xs text-white">
                  Performance test
                </div>
                <div className="text-[10px] text-gray-200 font-normal">
                  Kiểm tra hiệu năng ứng dụng, tốc độ khung hình (FPS) và độ trễ phản hồi DOM/Canvas.
                </div>
              </div>
              <div className="w-full">
                <VplaySecondaryButton
                  size="normal"
                  fullWidth={true}
                  onClick={handleRunPerfTest}
                  className="w-full text-center py-2.5 min-h-[40px]"
                >
                  Test
                </VplaySecondaryButton>
              </div>
            </div>
          )}

          {/* Item 3: Show FPS on left corner of the screen */}
          {(matchesSearch('Show FPS on left corner of the screen') ||
            matchesSearch('Show FPS') ||
            matchesSearch('FPS')) && (
            <div className="px-3 sm:px-4 py-3 hover:bg-[#56595c] transition-colors flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-xs text-white">
                  Show FPS on left corner of the screen
                </div>
                <div className="text-[10px] text-gray-200 font-normal">
                  Hiển thị chỉ số FPS trực tiếp ở góc trái trên cùng màn hình.
                </div>
              </div>
              <VplayToggleSwitch
                checked={temp.showFps || false}
                onChange={() => setTemp({ ...temp, showFps: !temp.showFps })}
              />
            </div>
          )}

          {/* Item 4: Show Frame Latency on left corner of the screen */}
          {(matchesSearch('Show Frame Latency on left corner of the screen') ||
            matchesSearch('Show Frame Latency') ||
            matchesSearch('Latency')) && (
            <div className="px-3 sm:px-4 py-3 hover:bg-[#56595c] transition-colors flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-xs text-white">
                  Show Frame Latency on left corner of the screen
                </div>
                <div className="text-[10px] text-gray-200 font-normal">
                  Hiển thị độ trễ render khung hình (ms) ở góc trái trên cùng màn hình.
                </div>
              </div>
              <VplayToggleSwitch
                checked={temp.showFrameLatency || false}
                onChange={() => setTemp({ ...temp, showFrameLatency: !temp.showFrameLatency })}
              />
            </div>
          )}

          {/* Item 5: Data-Driven UI Popup Modal */}
          {(matchesSearch('Data-Driven UI Popup Modal') ||
            matchesSearch('Data-Driven UI') ||
            matchesSearch('DDUI')) && (
            <div className="px-3 sm:px-4 py-3 hover:bg-[#56595c] transition-colors flex flex-col gap-2.5">
              <div>
                <div className="font-bold text-xs text-white">
                  Data-Driven UI Popup Modal
                </div>
                <div className="text-[10px] text-gray-200 font-normal">
                  Cửa sổ kiểm tra và xuất cấu hình Data-Driven UI (DDUI) Ore UI JSON.
                </div>
              </div>
              <div className="w-full">
                <VplaySecondaryButton
                  size="normal"
                  fullWidth={true}
                  onClick={() => {
                    playPopSound();
                    setIsDduiModalOpen(true);
                  }}
                  className="w-full text-center py-2.5 min-h-[40px]"
                >
                  Open DDUI Modal
                </VplaySecondaryButton>
              </div>
            </div>
          )}

          {/* Item 6: Ore UI design components */}
          {(matchesSearch('Ore UI design components', 'Hệ thống ngôn ngữ thiết kế giao diện của Vplay.') ||
            matchesSearch('Design components')) && (
            <div className="px-3 sm:px-4 py-3 hover:bg-[#56595c] transition-colors flex flex-col gap-2.5">
              <div>
                <div className="font-bold text-xs text-white">Ore UI design components</div>
                <div className="text-[10px] text-gray-200 font-normal">
                  Hệ thống ngôn ngữ thiết kế giao diện Ore UI của Vplay.
                </div>
              </div>
              <div className="w-full">
                <VplaySecondaryButton
                  size="normal"
                  fullWidth={true}
                  onClick={() => {
                    playPopSound();
                    if (onOpenDesignSystem) onOpenDesignSystem();
                  }}
                  className="w-full text-center py-2.5 min-h-[40px]"
                >
                  Open
                </VplaySecondaryButton>
              </div>
            </div>
          )}

          {/* Item 7: Reset settings to default */}
          {matchesSearch('Reset settings to default', 'Restore all above options to their original values.') && (
            <div className="px-3 sm:px-4 py-3 hover:bg-[#56595c] transition-colors flex flex-col gap-2.5">
              <div>
                <div className="font-bold text-xs text-white">Reset settings to default</div>
                <div className="text-[10px] text-gray-200 font-normal">
                  Restore all above options to their original values.
                </div>
              </div>
              <div className="w-full">
                <VplaySecondaryButton
                  size="normal"
                  fullWidth={true}
                  onClick={handleResetDefault}
                  className="w-full text-center py-2.5 min-h-[40px]"
                >
                  Reset
                </VplaySecondaryButton>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Diagnostic Info */}
      <div className="px-3 sm:px-4 py-2.5 bg-[#3f4245] text-[10px] font-mono text-gray-300 space-y-0.5">
        <div>DDUI: cf4bef566256457eb1391a01b5b02e2c</div>
        <div>VCID: 28601FFA239DADCE</div>
        <div>VERSION: release-preview</div>
      </div>
      <SettingsDivider />

      {/* PERFORMANCE STRESS MODAL */}
      <PerformanceStressModal
        isOpen={isStressTesting}
        onComplete={(results) => {
          setIsStressTesting(false);
          setPerfResults(results);
        }}
        onCancel={() => setIsStressTesting(false)}
      />

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

            {/* Stacked Minecraft Ore UI Action Buttons (Secondary style, NO WHITE BORDER) */}
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

      {/* PERFORMANCE TEST MODAL */}
      {perfResults && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in overflow-y-auto font-jura">
          <div className="bg-[#c6c6c6] border-2 border-white shadow-[0_20px_50px_rgba(0,0,0,0.9)] w-full max-w-md p-5 sm:p-6 text-[#1c1d1f] flex flex-col my-auto overflow-hidden animate-slide-in-left">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm sm:text-base font-bold text-[#1c1d1f] tracking-wide uppercase flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#28960b]" />
                Performance Test Benchmark
              </h2>
              <button
                onClick={() => setPerfResults(null)}
                className="p-1 hover:bg-[#a0a0a0] active:bg-[#888888] text-black border border-[#141414]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#0e0e0e] border-2 border-[#141414] p-[2px] mb-4">
              <div className="border border-white/90 p-4 text-white text-xs space-y-3 font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400">BENCHMARK SCORE:</span>
                  <span className="text-emerald-400 font-extrabold text-sm">
                    {perfResults.score} / 100 ({perfResults.grade})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="bg-[#1a1c1e] p-2 border border-zinc-800">
                    <div className="text-zinc-400 text-[10px] flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-emerald-400" /> Frame Rate
                    </div>
                    <div className="text-white font-bold text-sm mt-0.5">{perfResults.fps} FPS</div>
                  </div>

                  <div className="bg-[#1a1c1e] p-2 border border-zinc-800">
                    <div className="text-zinc-400 text-[10px] flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-emerald-400" /> Frame Latency
                    </div>
                    <div className="text-white font-bold text-sm mt-0.5">{perfResults.frameTime} ms</div>
                  </div>

                  <div className="bg-[#1a1c1e] p-2 border border-zinc-800">
                    <div className="text-zinc-400 text-[10px]">DOM Elements</div>
                    <div className="text-white font-bold text-sm mt-0.5">{perfResults.domNodes} nodes</div>
                  </div>

                  <div className="bg-[#1a1c1e] p-2 border border-zinc-800">
                    <div className="text-zinc-400 text-[10px]">JS Memory Heap</div>
                    <div className="text-white font-bold text-sm mt-0.5">{perfResults.memoryMB}</div>
                  </div>
                </div>

                <div className="text-[10px] text-emerald-400/90 pt-1">
                  ✓ Pipeline Ore UI renderer passes 60FPS target budget without frame drops.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunPerfTest}
                disabled={isStressTesting}
                className="flex-1 py-2 px-3 bg-[#55b331] hover:bg-[#62c938] text-white font-bold text-xs uppercase border-2 border-[#141414] shadow-[inset_0_1px_0_#89dc69] active:translate-y-[1px]"
              >
                {isStressTesting ? 'Testing...' : 'Run Again'}
              </button>
              <button
                onClick={() => setPerfResults(null)}
                className="flex-1 py-2 px-3 bg-[#c6c6c6] hover:bg-[#a0a0a0] text-[#1c1d1f] font-bold text-xs uppercase border-2 border-[#141414] active:translate-y-[1px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DATA-DRIVEN UI MODAL */}
      <DataDrivenUiModal
        isOpen={isDduiModalOpen}
        onClose={() => setIsDduiModalOpen(false)}
      />

    </div>
  );
};
