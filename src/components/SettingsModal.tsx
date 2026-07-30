import React from 'react';
import { UserSettings } from '../types';
import { VplayHeroButton } from './ui/VplayHeroButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { VplayToggleSwitch } from './ui/VplayToggleSwitch';
import { VplaySlider } from './ui/VplaySlider';
import { VplayDropdown } from './ui/VplayDropdown';
import { VplayCheckbox } from './ui/VplayCheckbox';
import { VplayInputBox } from './ui/VplayInputBox';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [temp, setTemp] = React.useState<UserSettings>({ ...settings });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#292a2c] border-4 border-[#141414] w-full max-w-2xl p-6 shadow-2xl space-y-6 text-white font-montserrat">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#3e4145] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 bg-[#418a28] border border-[#141414]" />
            <h2 className="text-lg font-bold text-[#89dc69] uppercase tracking-wide">
              CÀI ĐẶT TRUYỀN HÌNH VPLAY
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white font-bold text-sm p-1 cursor-pointer"
          >
            [✕]
          </button>
        </div>

        {/* Content list */}
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Section 1: Audio & Volume */}
          <div className="space-y-3 bg-[#1f2123] p-4 border border-[#383a3d]">
            <h3 className="text-xs font-bold text-[#89dc69]">1. ÂM THANH & ÂM LƯỢNG</h3>
            <VplaySlider
              label="Âm lượng mặc định"
              value={temp.soundVolume}
              min={0}
              max={10}
              onChange={(val) => setTemp({ ...temp, soundVolume: val })}
            />
          </div>

          {/* Section 2: Quality & Subtitles */}
          <div className="space-y-4 bg-[#1f2123] p-4 border border-[#383a3d]">
            <h3 className="text-xs font-bold text-[#89dc69]">2. CHẤT LƯỢNG & PHỤ ĐỀ</h3>
            <VplayDropdown
              label="Độ phân giải ưu tiên"
              value={temp.qualityOption}
              onChange={(val) => setTemp({ ...temp, qualityOption: val })}
              options={[
                { value: '4K', label: '4K Ultra HD' },
                { value: '1080p', label: '1080p Full HD' },
                { value: '720p', label: '720p HD' },
                { value: '480p', label: '480p Tiết kiệm 3G/4G' },
              ]}
            />
            <div className="pt-2 flex flex-col gap-3">
              <VplayToggleSwitch
                checked={temp.subtitles}
                onChange={(b) => setTemp({ ...temp, subtitles: b })}
                label="Bật phụ đề tiếng Việt tự động"
              />
              <VplayToggleSwitch
                checked={temp.autoPlay}
                onChange={(b) => setTemp({ ...temp, autoPlay: b })}
                label="Tự động phát khi chuyển kênh"
              />
            </div>
          </div>

          {/* Section 3: User Preferences */}
          <div className="space-y-4 bg-[#1f2123] p-4 border border-[#383a3d]">
            <h3 className="text-xs font-bold text-[#89dc69]">3. TÙY CHỌN TÀI KHOẢN</h3>
            <VplayInputBox
              label="Tên tài khoản người dùng"
              description="Sử dụng hiển thị trên đầu thu TV"
              value={temp.searchQuery}
              onChange={(e) => setTemp({ ...temp, searchQuery: e.target.value })}
            />
            <VplayCheckbox
              checked={temp.notifications}
              onChange={(b) => setTemp({ ...temp, notifications: b })}
              label="Nhận thông báo sự kiện thể thao trực tiếp"
            />
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t-2 border-[#3e4145]">
          <div className="w-32">
            <VplaySecondaryButton onClick={onClose}>
              HỦY BỎ
            </VplaySecondaryButton>
          </div>
          <div className="w-44">
            <VplayHeroButton onClick={() => { onSave(temp); onClose(); }}>
              LƯU CÀI ĐẶT
            </VplayHeroButton>
          </div>
        </div>

      </div>
    </div>
  );
};
