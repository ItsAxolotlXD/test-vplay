import React, { useState } from 'react';
import { PORTAL_CATEGORIES } from '../data/portalData';
import { Newspaper, Trophy, Utensils, Landmark, Sparkles, Film, Sparkle } from 'lucide-react';

interface PortalsCircularSectionProps {
  onSelectPortal: (portalId: string) => void;
  activePortalId?: string;
  showSectionHeader?: boolean;
  className?: string;
}

export const PortalsCircularSection: React.FC<PortalsCircularSectionProps> = ({
  onSelectPortal,
  activePortalId,
  showSectionHeader = true,
  className = ''
}) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

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

      {/* Grid: 3 circular portals per row */}
      {/* Row 1: Tin tức, Thể thao, Ẩm thực */}
      {/* Row 2: Chính trị, Văn hóa, Giải trí */}
      <div className="grid grid-cols-3 gap-y-12 sm:gap-y-16 md:gap-y-20 gap-x-8 sm:gap-x-14 md:gap-x-20 max-w-6xl mx-auto py-6 sm:py-10">
        {PORTAL_CATEGORIES.map((portal) => {
          const isActive = activePortalId === portal.id;
          const hasError = imageErrors[portal.id];
          const isLogo = portal.image.includes('vtv_') || portal.image.includes('.png') || portal.image.includes('wikia.nocookie.net');

          return (
            <button
              key={portal.id}
              id={`portal-circular-btn-${portal.id}`}
              onClick={() => onSelectPortal(portal.id)}
              className="flex flex-col items-center group cursor-pointer bg-transparent border-0 p-0 focus:outline-none"
            >
              {/* Enlarged Borderless Circular Banner */}
              <div className="w-36 h-36 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden bg-[#16151D] shadow-2xl relative transition-all duration-300 group-hover:scale-105 group-active:scale-95">
                {!hasError ? (
                  <img
                    src={portal.image}
                    alt={portal.title}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full ${
                      isLogo ? 'object-contain p-5 sm:p-7 md:p-9' : 'object-cover'
                    } group-hover:scale-110 transition-transform duration-300`}
                    onError={() => handleImageError(portal.id)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#241F2B] to-[#16141D]">
                    {getFallbackIcon(portal.id, 'w-16 h-16 text-white/80')}
                  </div>
                )}

                {/* Subtle inner hover glow */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Borderless Badge */}
                {portal.badge && (
                  <span className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 text-[10px] sm:text-xs md:text-sm font-bold px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-[#E6005A] text-white shadow-lg">
                    {portal.badge}
                  </span>
                )}
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
    </div>
  );
};
