import React, { useState, useEffect, useRef } from 'react';
import { Play, ChevronLeft, ChevronRight, Clapperboard } from 'lucide-react';
import { HERO_SLIDES } from '../data/heroSlides';
import { HeroSlide, Channel } from '../types';
import { CHANNELS_DATA } from '../data/channels';
import { useSettings } from '../hooks/useSettings';

interface HeroCarouselProps {
  navigate: (route: string) => void;
  onSelectChannel: (channel: Channel) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  navigate,
  onSelectChannel
}) => {
  const { settings } = useSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentSlide: HeroSlide = HERO_SLIDES[currentIndex] || HERO_SLIDES[0];

  const nextSlide = () => {
    if (HERO_SLIDES.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }
  };

  const prevSlide = () => {
    if (HERO_SLIDES.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    }
  };

  useEffect(() => {
    if (settings.autoScrollBanner && !isHovered && HERO_SLIDES.length > 1) {
      timerRef.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, settings.autoScrollBanner]);

  const handleWatchNow = () => {
    const targetChannel = CHANNELS_DATA.find((c) => c.id === currentSlide.channelId) || CHANNELS_DATA[0];
    onSelectChannel(targetChannel);
    navigate(`/live-tv?channel=${targetChannel.slug}`);
  };

  // Helper function to render text with gradient highlighting for phrases wrapped in <gradient>...</gradient>
  const renderFormattedDescription = (text: string) => {
    if (!text) return null;

    const normalizedText = text.replace(/<gradient\s*text[^>]*:\s*([^>]+)>/gi, '<gradient>$1</gradient>');
    const parts = normalizedText.split(/(<gradient>.*?<\/gradient>)/g);
    return parts.map((part, index) => {
      if (part.startsWith('<gradient>') && part.endsWith('</gradient>')) {
        const highlightedText = part.replace('<gradient>', '').replace('</gradient>', '');
        return (
          <span
            key={index}
            className="font-extrabold bg-gradient-to-r from-[#FF2020] via-[#FF3366] to-[#F000FF] bg-clip-text text-transparent inline-block"
          >
            {highlightedText}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div 
      id="hero-carousel-container"
      className="relative w-full overflow-hidden bg-[#141416] min-h-[520px] md:min-h-[600px] lg:min-h-[660px] flex items-end group transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image with Cinematic Overlay */}
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'
          }`}
        >
          <img
            src={slide.backgroundImage}
            alt={slide.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000 group-hover:scale-100"
          />
          {/* Refined subtle cinematic gradient overlays for high background clarity */}
          <div className="absolute inset-0 hero-overlay-t bg-gradient-to-t from-[#141416] via-[#141416]/30 to-transparent" />
          <div className="absolute inset-0 hero-overlay-r bg-gradient-to-r from-[#141416]/75 via-[#141416]/20 to-transparent w-full md:w-3/5" />
        </div>
      ))}

      {/* Content Container (Bottom/Left aligned) */}
      <div className="relative z-10 w-full p-6 sm:p-10 md:p-14 lg:p-16 pb-12 md:pb-16 max-w-5xl flex flex-col justify-end">
        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase drop-shadow-md leading-tight">
          {currentSlide.title}
        </h1>

        {/* Subtitle with Red to Magenta gradient */}
        {currentSlide.subtitle && (
          <div className="mt-1 md:mt-2">
            <span className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF2020] via-[#FF3366] to-[#F000FF] bg-clip-text text-transparent drop-shadow">
              {currentSlide.subtitle}
            </span>
          </div>
        )}

        {/* Director credits */}
        {currentSlide.director && (
          <div className="flex items-center gap-2.5 mt-3.5">
            <div className="hero-director-badge flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#2A2A32]/90 border border-white/15 text-xs text-white">
              <Clapperboard className="w-3.5 h-3.5 text-[#FF3366]" />
              <span className="hero-director-label text-[#9CA3AF] uppercase text-[10px] font-bold tracking-wider">ĐẠO DIỄN:</span>
              <span className="hero-director-name font-extrabold text-white tracking-wide">{currentSlide.director}</span>
            </div>
          </div>
        )}

        {/* Rich Description with formatted gradient text */}
        <p className="mt-4 text-xs sm:text-sm md:text-base text-[#D1D5DB] leading-relaxed max-w-3xl font-normal">
          {renderFormattedDescription(currentSlide.description)}
        </p>

        {/* CTA Button Row + Channel Logo + Navigation Arrows */}
        <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 mt-6">
          {/* Main Colored CTA Button */}
          <button
            id="btn-hero-watch-now"
            onClick={handleWatchNow}
            className="flex items-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-[#2E1065] bg-[#CEBEFE] hover:bg-[#DBCFFF] active:scale-[0.98] transition-all text-sm sm:text-base cursor-pointer tracking-tight shadow-lg hover:shadow-xl group/btn select-none"
          >
            <Play className="w-4.5 h-4.5 fill-[#2E1065] text-[#2E1065] ml-0.5 group-hover/btn:scale-110 transition-transform" />
            <span>{currentSlide.ctaText || 'Xem'}</span>
          </button>

          {/* Pure Banner Logo placed directly next to the Watch button */}
          {currentSlide.channelLogo && (
            <div 
              onClick={handleWatchNow}
              className="flex items-center cursor-pointer transition-transform hover:scale-105 active:scale-95 select-none"
              title={currentSlide.channelName || 'Xem'}
            >
              <img
                src={currentSlide.channelLogo}
                alt={currentSlide.channelName || 'Logo banner'}
                referrerPolicy="no-referrer"
                className="hero-banner-channel-logo h-8 sm:h-9 w-auto object-contain brightness-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Previous & Next circular arrow buttons if multiple slides */}
          {HERO_SLIDES.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                id="btn-hero-prev"
                onClick={prevSlide}
                className="w-10 h-10 rounded-full bg-[#26262C]/80 hover:bg-[#34343E] border border-[#3E3E48] flex items-center justify-center text-[#D1D5DB] hover:text-white transition-colors cursor-pointer"
                aria-label="Slide trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                id="btn-hero-next"
                onClick={nextSlide}
                className="w-10 h-10 rounded-full bg-[#26262C]/80 hover:bg-[#34343E] border border-[#3E3E48] flex items-center justify-center text-[#D1D5DB] hover:text-white transition-colors cursor-pointer"
                aria-label="Slide tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Pagination indicator: dots if multiple slides */}
        {HERO_SLIDES.length > 1 && (
          <div className="flex items-center gap-2 mt-6">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full h-2 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-7 bg-[#FF2020] shadow-[0_0_8px_#FF2020]'
                    : 'w-2 bg-[#4B4B54] hover:bg-[#6B6B76]'
                }`}
                aria-label={`Đi tới slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
