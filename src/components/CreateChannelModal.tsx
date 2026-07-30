import React, { useState } from 'react';
import { playPopSound } from '../utils/sound';
import { VplayPrimaryButton } from './ui/VplayPrimaryButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { VplayInputBox } from './ui/VplayInputBox';
import { VplayDropdown } from './ui/VplayDropdown';
import { TvChannel } from '../types';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChannel: (channel: TvChannel) => void;
  categories: string[];
}

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  isOpen,
  onClose,
  onAddChannel,
  categories,
}) => {
  const [channelName, setChannelName] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  
  const defaultCategory = categories[0] || 'Kênh tự chọn';
  const [category, setCategory] = useState(defaultCategory);

  if (!isOpen) return null;

  const dropdownOptions = categories.map((cat) => ({
    value: cat,
    label: cat,
  }));

  if (!dropdownOptions.some((opt) => opt.value === 'Kênh tự chọn')) {
    dropdownOptions.push({ value: 'Kênh tự chọn', label: 'Kênh tự chọn' });
  }

  const handleCreate = () => {
    if (!channelName.trim()) {
      alert('Vui lòng nhập tên kênh.');
      return;
    }
    if (!streamUrl.trim()) {
      alert('Vui lòng nhập URL luồng kênh.');
      return;
    }

    const newChannel: TvChannel = {
      id: `custom-${Date.now()}`,
      name: channelName.trim(),
      groupTitle: category || 'Kênh tự chọn',
      logo: '',
      streamUrl: streamUrl.trim(),
      badge: 'Custom',
      currentProgram: 'Luồng tự tạo',
      nextProgram: 'Đang phát sóng',
      viewers: '1',
      rating: '5.0',
      videoBg: '',
      isLive: true,
      resolution: 'HD 1080p',
      language: 'Tiếng Việt',
      summary: 'Luồng truyền hình tùy chỉnh được tạo bởi người dùng.',
    };

    onAddChannel(newChannel);
    setChannelName('');
    setStreamUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in overflow-y-auto">
      <div className="bg-[#383b3e] border-2 border-[#787b7f] w-full max-w-md shadow-2xl text-white font-montserrat select-none flex flex-col max-h-[85vh] my-auto overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-[#2d3033] border-b-2 border-[#787b7f] px-4 py-2.5 flex items-center justify-between flex-shrink-0">
          <button
            onMouseDown={() => playPopSound()}
            onClick={onClose}
            className="text-gray-300 hover:text-white font-bold text-sm px-1.5 py-0.5 cursor-pointer"
            title="Back"
          >
            ‹
          </button>
          
          <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-jura">
            Create custom channel
          </h2>

          <button
            onMouseDown={() => playPopSound()}
            onClick={onClose}
            className="text-gray-300 hover:text-white font-bold text-xs px-1.5 py-0.5 cursor-pointer"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Subtitle / Description Section */}
        <div className="p-4 bg-[#383b3e] border-b border-[#2d3033] flex-shrink-0">
          <p className="text-xs text-gray-200 leading-relaxed font-normal">
            Tự tạo và thêm một luồng kênh vào danh sách kênh Live TV
          </p>
        </div>

        {/* Form Body - Scrollable */}
        <div className="p-4 space-y-4 bg-[#383b3e] flex-1 overflow-y-auto custom-scrollbar">
          {/* Input 1: Tên kênh */}
          <VplayInputBox
            label="Tên kênh"
            description="Tên hiển thị của kênh truyền hình"
            placeholder="Nhập tên kênh..."
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="!max-w-none !p-2.5"
          />

          {/* Input 2: URL luồng kênh */}
          <VplayInputBox
            label="URL luồng kênh"
            description="Đường dẫn luồng HLS (.m3u8) hoặc nguồn video"
            placeholder="https://... hoặc URL stream M3U8"
            value={streamUrl}
            onChange={(e) => setStreamUrl(e.target.value)}
            className="!max-w-none !p-2.5"
          />

          {/* Dropdown: Thể loại kênh */}
          <VplayDropdown
            label="Thể loại kênh"
            options={dropdownOptions}
            value={category}
            onChange={(val) => setCategory(val)}
            className="!max-w-none !p-2.5"
          />
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="p-4 pt-3 bg-[#383b3e] border-t-2 border-[#2d3033] flex-shrink-0 space-y-2.5">
          <VplayPrimaryButton onClick={handleCreate}>
            Create
          </VplayPrimaryButton>

          <VplaySecondaryButton onClick={onClose}>
            Close
          </VplaySecondaryButton>
        </div>

      </div>
    </div>
  );
};
