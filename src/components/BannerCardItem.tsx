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
  const isGradientBanner = !slide.backgroundImage || slide.id === 'banner-prototype-test-build';

  return (
    <div 
      onClick={onClick}
      className={`banner-card w-full h-full relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#181818] select-none transition-all duration-700 cursor-pointer ${
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
      {/* Background Banner Content - Edge to Edge */}
      {isGradientBanner ? (
        <div className="w-full h-full relative overflow-hidden bg-gradient-to-r from-[#0a0a0a] via-[#242426] to-[#0a0a0a] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center select-none">
          {/* Subtle radial sheen in center */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-500/20 via-transparent to-transparent pointer-events-none" />

          {/* Subtle grid mesh lines for prototype tech aesthetic */}
          <div 
            className="absolute inset-0 opacity-[0.06] pointer-events-none" 
            style={{
              backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Pill Badge */}
          <div className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-2 sm:mb-2.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold text-zinc-200 tracking-wider uppercase">
              Prototype Build
            </span>
          </div>

          {/* Main Headline */}
          <h2 className="relative z-10 text-white font-extrabold text-sm sm:text-base md:text-xl lg:text-2xl tracking-tight leading-snug max-w-xl">
            {slide.title || 'You are using a prototype test build of Vplay'}
          </h2>

          {/* Subtitle Warning / Disclaimer */}
          <p className="relative z-10 text-zinc-400 text-[11px] sm:text-xs md:text-sm font-normal max-w-md mt-1.5 sm:mt-2 leading-relaxed">
            {slide.description || slide.subtitle || 'Everything you see here may change or may remove in future builds'}
          </p>
        </div>
      ) : !hasError ? (
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

      {/* Subtle vignette gradient (for image cards) */}
      {!isGradientBanner && (
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      )}

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

