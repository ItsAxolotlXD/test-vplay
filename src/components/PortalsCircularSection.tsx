import React, { useState, useRef } from 'react';
import { PORTAL_CATEGORIES } from '../data/portalData';
import { Newspaper, Trophy, Utensils, Landmark, Sparkles, Film, Sparkle, ChevronLeft, ChevronRight } from 'lucide-react';

interface PortalsCircularSectionProps {
  onSelectPortal: (portalId: string) => void;
  activePortalId?: string;
  showSectionHeader?: boolean;
  className?: string;
  variant?: 'grid' | 'scroll';
}

export const PortalsCircularSection: React.FC<PortalsCircularSectionProps> = ({
  onSelectPortal,
  activePortalId,
  showSectionHeader = true,
  className = '',
  variant = 'grid'
}) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const getFallbackIcon = (id: string, iconClass = 'w-6 h-6 text-white') => {
    switch (id) {
      case 'tin-tuc':
        return <Newspaper className={iconClass} />;
      case 'the-thao':
        return <Trophy className={iconClass} />;
      case 'am-thuc':
        return <Utensils className={iconClass} />;
      case 'chinh-tri':
        return <Landmark className={iconClass} />;
      case 'van-hoa':
        return <Sparkles className={iconClass} />;
      case 'giai-tri':
        return <Film className={iconClass} />;
      default:
        return <Sparkle className={iconClass} />;
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {showSectionHeader && (
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E6005A]/15 text-[#E6005A] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Chuyên trang</span>
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Khi variant = 'scroll': dạng cuộn ngang mượt mà tương tự như ô kênh */}
      {variant === 'scroll' ? (
        <div className="relative group/scroll">
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-3 no-scrollbar scroll-smooth"
          >
            {PORTAL_CATEGORIES.map((portal) => {
              const isActive = activePortalId === portal.id;
              const hasError = imageErrors[portal.id];

              return (
                <button
                  key={portal.id}
                  id={`portal-circular-btn-${portal.id}`}
                  onClick={() => onSelectPortal(portal.id)}
                  className="flex flex-col items-center group cursor-pointer bg-transparent border-0 p-0 focus:outline-none shrink-0"
                >
                  {/* Borderless Circular Banner - fit toàn bộ placeholder circle */}
                  <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full overflow-hidden bg-[#16151D] shadow-xl relative transition-all duration-300 group-hover:scale-105 group-active:scale-95 border-2 border-transparent group-hover:border-[#E6005A]/40">
                    {!hasError ? (
                      <img
                        src={portal.image}
                        alt={portal.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={() => handleImageError(portal.id)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#241F2B] to-[#16141D]">
                        {getFallbackIcon(portal.id, 'w-10 h-10 text-white/80')}
                      </div>
                    )}

                    {/* Subtle inner hover glow */}
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Title underneath */}
                  <span
                    className={`mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base font-bold transition-colors text-center tracking-tight ${
                      isActive ? 'text-[#FF4081]' : 'text-white/90 group-hover:text-[#FF4081]'
                    }`}
                  >
                    {portal.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Optional scroll arrow buttons */}
          <button
            onClick={() => scroll('left')}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-8 h-8 rounded-full bg-[#222226]/90 hover:bg-[#2F2F36] border border-[#34343C] items-center justify-center text-[#A1A1AA] hover:text-white transition-all shadow-lg opacity-0 group-hover/scroll:opacity-100 cursor-pointer z-10"
            aria-label="Cuộn sang trái"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-8 h-8 rounded-full bg-[#222226]/90 hover:bg-[#2F2F36] border border-[#34343C] items-center justify-center text-[#A1A1AA] hover:text-white transition-all shadow-lg opacity-0 group-hover/scroll:opacity-100 cursor-pointer z-10"
            aria-label="Cuộn sang phải"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Grid: 3 circular portals per row (dành cho SearchPortalsView / Overview) */
        <div className="grid grid-cols-3 gap-y-12 sm:gap-y-16 md:gap-y-20 gap-x-8 sm:gap-x-14 md:gap-x-20 max-w-6xl mx-auto py-6 sm:py-10">
          {PORTAL_CATEGORIES.map((portal) => {
            const isActive = activePortalId === portal.id;
            const hasError = imageErrors[portal.id];

            return (
              <button
                key={portal.id}
                id={`portal-circular-btn-${portal.id}`}
                onClick={() => onSelectPortal(portal.id)}
                className="flex flex-col items-center group cursor-pointer bg-transparent border-0 p-0 focus:outline-none"
              >
                {/* Enlarged Borderless Circular Banner - fit toàn bộ placeholder circle */}
                <div className="w-36 h-36 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden bg-[#16151D] shadow-2xl relative transition-all duration-300 group-hover:scale-105 group-active:scale-95">
                  {!hasError ? (
                    <img
                      src={portal.image}
                      alt={portal.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={() => handleImageError(portal.id)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#241F2B] to-[#16141D]">
                      {getFallbackIcon(portal.id, 'w-16 h-16 text-white/80')}
                    </div>
                  )}

                  {/* Subtle inner hover glow */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Title underneath (no description) */}
                <span
                  className={`mt-3.5 sm:mt-5 text-sm sm:text-lg md:text-xl font-bold transition-colors text-center tracking-tight ${
                    isActive ? 'text-[#FF4081]' : 'text-white/90 group-hover:text-[#FF4081]'
                  }`}
                >
                  {portal.title}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
