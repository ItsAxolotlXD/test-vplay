import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HERO_SLIDES } from '../data/heroSlides';
import { CHANNELS_DATA } from '../data/channels';
import { HeroSlide, Channel } from '../types';
import { BannerCardItem } from './BannerCardItem';

interface HeroCarouselProps {
  navigate?: (route: string, state?: any) => void;
  onSelectChannel?: (channel: Channel) => void;
  slides?: HeroSlide[];
  idPrefix?: string;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ 
  slides = HERO_SLIDES, 
  idPrefix = 'hero',
  navigate,
  onSelectChannel
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeSlides = slides && slides.length > 0 ? slides : HERO_SLIDES;

  // For lists with fewer than 5 items (e.g. Shop with 3 banners),
  // duplicate the items cyclically so there is a continuous buffer (at least 6 items).
  // This ensures identical, fluid horizontal sliding without cards flipping through the center!
  const displaySlides = useMemo(() => {
    if (activeSlides.length > 0 && activeSlides.length < 5) {
      const multiplier = Math.ceil(6 / activeSlides.length);
      const expanded: (HeroSlide & { cycleKey: string })[] = [];
      for (let m = 0; m < multiplier; m++) {
        activeSlides.forEach((s, idx) => {
          expanded.push({
            ...s,
            cycleKey: `${s.id}-cycle-${m}-${idx}`
          });
        });
      }
      return expanded;
    }
    return activeSlides.map((s) => ({ ...s, cycleKey: s.id }));
  }, [activeSlides]);

  const totalSlides = displaySlides.length;
  const currentSlide = displaySlides[currentIndex] || displaySlides[0];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (originalIndex: number) => {
    setCurrentIndex(originalIndex);
  };

  const handleSlideClick = (slide: HeroSlide) => {
    if (slide.channelId && onSelectChannel) {
      const matchedChannel = CHANNELS_DATA.find((c) => c.id === slide.channelId);
      if (matchedChannel) {
        onSelectChannel(matchedChannel);
        return;
      }
    }
    if (slide.isAd && navigate) {
      navigate('/v-shop');
    }
  };

  // Autoplay every 5 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalSlides, isPaused]);

  return (
    <section 
      id={`${idPrefix}-banner-cards-carousel`}
      className="relative w-full pt-3 sm:pt-5 pb-5 overflow-hidden select-none"
      aria-label="Thẻ banner nổi bật"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Background Ambient Backdrop Blur matching current active banner */}
      <div className="absolute inset-0 -top-12 -bottom-12 overflow-hidden pointer-events-none select-none z-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentSlide.cycleKey + '-bg'}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 0.6, scale: 1.08 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentSlide.backgroundImage}
              alt=""
              aria-hidden="true"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover blur-[60px] filter brightness-[0.55] saturate-[1.6] transform"
            />
          </motion.div>
        </AnimatePresence>

        {/* Backdrop-blur frosted glass layer */}
        <div className="absolute inset-0 backdrop-blur-2xl bg-[#181818]/60" />

        {/* Soft edge vignette gradients blending into app canvas */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-[#181818]/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#181818]/60 via-transparent to-[#181818]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#181818]/90 via-transparent to-[#181818]/90" />
      </div>

      {/* 2. Foreground Carousel Cards Container */}
      <div className="relative z-10 w-full flex items-center justify-center">
        {/* Navigation Chevron - Left */}
        <button
          id={`btn-${idPrefix}-banner-prev`}
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-2.5 rounded-full bg-[#181818]/80 hover:bg-[#181818] backdrop-blur-md border border-white/20 text-white/90 hover:text-white transition-all hover:scale-110 active:scale-95 shadow-2xl cursor-pointer"
          aria-label="Thẻ trước"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
        </button>

        {/* Navigation Chevron - Right */}
        <button
          id={`btn-${idPrefix}-banner-next`}
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-2.5 rounded-full bg-[#181818]/80 hover:bg-[#181818] backdrop-blur-md border border-white/20 text-white/90 hover:text-white transition-all hover:scale-110 active:scale-95 shadow-2xl cursor-pointer"
          aria-label="Thẻ kế tiếp"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
        </button>

        {/* Carousel Fixed 16:9 Aspect Ratio Center Stage (Enlarged size) */}
        <div className="relative w-[94vw] sm:w-[86vw] md:w-[78vw] lg:w-[70vw] xl:w-[64vw] max-w-[960px] aspect-[16/9] flex items-center justify-center">
          {displaySlides.map((slide, index) => {
            // Compute distance from current index with wrap-around
            let diff = (index - currentIndex) % totalSlides;
            if (diff < -Math.floor(totalSlides / 2)) diff += totalSlides;
            if (diff > Math.floor(totalSlides / 2)) diff -= totalSlides;

            const isCenter = diff === 0;
            const isLeft = diff === -1;
            const isRight = diff === 1;

            let xPosition = '0%';
            let scale = 1;
            let opacity = 1;
            let zIndex = 30;
            let brightness = 'brightness(1)';
            let isOffscreen = false;

            if (isCenter) {
              xPosition = '0%';
              scale = 1;
              opacity = 1;
              zIndex = 35;
              brightness = 'brightness(1)';
            } else if (isLeft) {
              // Positioned cleanly to the left, exact same size as center
              xPosition = '-104%';
              scale = 1;
              opacity = 0.85;
              zIndex = 15;
              brightness = 'brightness(0.7)';
            } else if (isRight) {
              // Positioned cleanly to the right, exact same size as center
              xPosition = '104%';
              scale = 1;
              opacity = 0.85;
              zIndex = 15;
              brightness = 'brightness(0.7)';
            } else {
              xPosition = diff > 0 ? '208%' : '-208%';
              scale = 1;
              opacity = 0;
              zIndex = 0;
              brightness = 'brightness(0.4)';
              isOffscreen = true;
            }

            return (
              <motion.div
                key={slide.cycleKey}
                initial={false}
                animate={{
                  x: xPosition,
                  scale: scale,
                  opacity: opacity,
                  filter: brightness
                }}
                transition={{
                  duration: isOffscreen ? 0.12 : 0.25,
                  ease: "linear"
                }}
                className="absolute inset-0 w-full h-full aspect-[16/9] select-none"
                style={{
                  zIndex,
                  visibility: opacity === 0 && isOffscreen ? 'hidden' : 'visible'
                }}
              >
                <BannerCardItem
                  slide={slide}
                  isActive={isCenter}
                  onClick={() => {
                    if (isCenter) {
                      handleSlideClick(slide);
                    } else if (isLeft) {
                      prevSlide();
                    } else if (isRight) {
                      nextSlide();
                    }
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Pagination Indicators matching dots */}
      <div className="relative z-10 mt-3.5 sm:mt-5 flex items-center justify-center gap-1.5 sm:gap-2">
        {activeSlides.map((slide, idx) => {
          const isActive = (currentIndex % activeSlides.length) === idx;
          return (
            <button
              key={slide.id}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-500 rounded-full cursor-pointer ${
                isActive
                  ? 'w-7 sm:w-8 h-1.5 bg-[#E50914] shadow-[0_0_12px_rgba(229,9,20,0.8)]'
                  : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Đi tới thẻ banner ${idx + 1}`}
              title={slide.title}
            />
          );
        })}
      </div>
    </section>
  );
};

