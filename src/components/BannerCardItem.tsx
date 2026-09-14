import React, { useState } from 'react';
import { HeroSlide } from '../types';

interface BannerCardItemProps {
  slide: HeroSlide;
  isActive?: boolean;
}

export const BannerCardItem: React.FC<BannerCardItemProps> = ({
  slide,
  isActive = false
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div 
      className={`w-full h-full relative overflow-hidden rounded-2xl sm:rounded-3xl bg-black select-none border border-white/10 ${
        isActive ? 'shadow-[0_20px_50px_rgba(0,0,0,0.9)] ring-1 ring-white/15' : 'shadow-xl'
      }`}
      style={{
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Background Image - Edge to Edge, rectangular */}
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
        <div className="w-full h-full bg-gradient-to-br from-[#2D1B28] via-[#1E141D] to-[#120B11] flex items-center justify-center text-white/50">
          <span className="text-sm font-medium">{slide.title}</span>
        </div>
      )}

      {/* AD Badge on top-left: màu vàng chữ đen nhỏ, ko viền ở góc trái */}
      {slide.isAd && (
        <span 
          className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 px-1.5 sm:px-2 py-0.5 bg-[#FFD600] text-black text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-sm shadow-md z-30 pointer-events-none select-none"
        >
          AD
        </span>
      )}
    </div>
  );
};
