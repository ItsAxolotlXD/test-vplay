import React, { useState } from 'react';
import { HeroSlide } from '../types';

interface BannerCardItemProps {
  slide: HeroSlide;
  isActive?: boolean;
  onClick?: () => void;
}

// Fallback color extraction based on slide properties
const getSlideThemeColor = (slide: HeroSlide): string => {
  if (slide.themeColor) return slide.themeColor;
  if (slide.isAd) return '#F59E0B'; // Amber / Gold for Ads
  if (slide.category?.includes('THỜI SỰ')) return '#EF4444';
  if (slide.category?.includes('TRUYỀN HÌNH')) return '#0284C7';
  if (slide.category?.includes('VTV4')) return '#F59E0B';
  if (slide.category?.includes('CÔNG NGHỆ')) return '#3B82F6';
  if (slide.category?.includes('GIA DỤNG')) return '#10B981';
  return '#E50914'; // Signature default red
};

// Convert hex to rgb string for flexible rgba glows
const hexToRgb = (hex: string): string => {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  return '229, 9, 20';
};

export const BannerCardItem: React.FC<BannerCardItemProps> = ({
  slide,
  isActive = false,
  onClick
}) => {
  const [hasError, setHasError] = useState(false);
  const glowColor = getSlideThemeColor(slide);
  const rgb = hexToRgb(glowColor);

  return (
    <div 
      onClick={onClick}
      className={`w-full h-full relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#181818] select-none transition-all duration-700 cursor-pointer ${
        isActive 
          ? 'ring-1' 
          : 'shadow-xl ring-1 ring-white/10 hover:ring-white/20'
      }`}
      style={{
        backfaceVisibility: 'hidden',
        boxShadow: isActive
          ? `0 0 35px 2px rgba(${rgb}, 0.45), 0 16px 50px 0 rgba(${rgb}, 0.25), 0 20px 60px rgba(0, 0, 0, 0.9)`
          : undefined,
        borderColor: isActive ? `rgba(${rgb}, 0.6)` : undefined,
      }}
    >
      {/* Background Image - Edge to Edge */}
      {!hasError ? (
        <img
          src={slide.backgroundImage}
          alt={slide.title || 'Banner'}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover select-none pointer-events-none"
          style={{ imageRendering: '-webkit-optimize-contrast' }}
        />
      ) : (
        <div className="w-full h-full bg-[#181818] flex items-center justify-center text-white/50">
          <span className="text-sm font-medium">{slide.title}</span>
        </div>
      )}

      {/* Dim Overlay for Inactive Cards */}
      {!isActive && (
        <div className="absolute inset-0 bg-black/25 transition-opacity duration-300 pointer-events-none" />
      )}

      {/* Subtle vignette gradient */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

      {/* AD Badge on top-left: màu vàng chữ đen nhỏ */}
      {slide.isAd && (
        <span 
          className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 px-2 py-0.5 bg-[#FFD600] text-black text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-md shadow-md z-30 pointer-events-none select-none"
        >
          AD
        </span>
      )}
    </div>
  );
};

