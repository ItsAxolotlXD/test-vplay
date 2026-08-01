import React from 'react';
import { playPopSound } from '../utils/sound';
import { useLang } from '../context/LanguageContext';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';

interface HeaderBarProps {
  title?: string;
  onBack?: () => void;
  onSearchClick?: () => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title = 'HOME',
  onBack,
  onSearchClick,
}) => {
  const { t } = useLang();

  const handleBack = () => {
    playPopSound();
    onBack?.();
  };

  const handleSearchClick = () => {
    playPopSound();
    onSearchClick?.();
  };

  // Map known titles to keys
  const displayTitle = () => {
    const uppercase = title.toUpperCase();
    if (uppercase === 'HOME') return t('header.home', 'HOME');
    if (uppercase === 'TRỰC TIẾP' || uppercase === 'LIVE TV') return t('header.live', 'TRỰC TIẾP');
    if (uppercase === 'SETTINGS' || uppercase === 'CÀI ĐẶT') return t('header.settings', 'CÀI ĐẶT');
    if (uppercase === 'SEARCH' || uppercase === 'TÌM KIẾM') return t('search.title', 'VPLAY CHANNELS');
    return title;
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-[#dedede] text-[#141414] border-b-4 border-[#2b2d30] px-3 py-1 flex items-center justify-between font-montserrat select-none shadow-sm">
      {/* Left controls: Chevron Left (<) */}
      <div className="flex items-center gap-0.5 sm:gap-1">
        <button
          onClick={handleBack}
          aria-label="Back"
          className="p-1 hover:bg-[#cecece] active:bg-[#bebebe] active:translate-y-[1px] btn-press-effect text-[#141414] cursor-pointer rounded-none flex items-center justify-center"
          title="Quay lại"
        >
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/a/ab/ArrowLeft.png/revision/latest?cb=20260728033445"
            alt="Back"
            referrerPolicy="no-referrer"
            className="w-[13px] h-[13px] sm:w-[14px] sm:h-[14px] object-contain [image-rendering:pixelated]"
            style={{ imageRendering: 'pixelated' }}
          />
        </button>
      </div>

      {/* Center: Always Title */}
      <div className="text-center font-bold font-montserrat text-xs sm:text-sm tracking-normal text-[#141414] uppercase">
        {displayTitle()}
      </div>

      {/* Right controls: Square Secondary Search Button */}
      <div className="flex items-center gap-1">
        <VplaySecondaryButton
          onClick={handleSearchClick}
          aria-label="Search"
          title="Tìm kiếm"
          fullWidth={false}
          size="sm"
          className="!w-7 !h-7 sm:!w-8 sm:!h-8 !p-0"
        >
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/a/a4/MagnifyingGlass.png/revision/latest?cb=20260730091531"
            alt="Search"
            referrerPolicy="no-referrer"
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain"
          />
        </VplaySecondaryButton>
      </div>
    </div>
  );
};


