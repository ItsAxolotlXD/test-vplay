import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { HERO_SLIDES } from '../data/heroSlides';
import { HeroSlide, Channel } from '../types';
import { CHANNELS_DATA } from '../data/channels';
import { BannerCardItem } from './BannerCardItem';

interface HeroCarouselProps {
  navigate?: (route: string) => void;
  onSelectChannel?: (channel: Channel) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = HERO_SLIDES.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Banner tự động trượt mỗi 5 giây
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalSlides]);

  return (
    <section 
      id="hero-banner-cards-carousel"
      className="relative w-full pt-1 sm:pt-3 pb-3 overflow-hidden select-none"
      aria-label="Thẻ banner nổi bật"
    >
      {/* 3D Stage Container with Perspective */}
      <div className="relative w-full flex items-center justify-center [perspective:1400px]">
        {/* Navigation Chevrons - Clickable */}
        <button
          id="btn-banner-prev"
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 md:left-8 lg:left-12 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-2.5 rounded-full bg-black/55 hover:bg-black/85 backdrop-blur-md border border-white/20 text-white/90 hover:text-white transition-all hover:scale-110 active:scale-95 shadow-2xl cursor-pointer"
          aria-label="Thẻ trước"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
        </button>

        <button
          id="btn-banner-next"
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 md:right-8 lg:right-12 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-2.5 rounded-full bg-black/55 hover:bg-black/85 backdrop-blur-md border border-white/20 text-white/90 hover:text-white transition-all hover:scale-110 active:scale-95 shadow-2xl cursor-pointer"
          aria-label="Thẻ kế tiếp"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
        </button>

        {/* Carousel Fixed 16:9 Aspect Ratio Frame */}
        <div className="relative w-[90vw] sm:w-[78vw] md:w-[68vw] lg:w-[60vw] max-w-[780px] aspect-[16/9] flex items-center justify-center [transform-style:preserve-3d]">
          {HERO_SLIDES.map((slide, index) => {
            // Compute distance from current index with wrap-around
            let diff = (index - currentIndex) % totalSlides;
            if (diff < -Math.floor(totalSlides / 2)) diff += totalSlides;
            if (diff > Math.floor(totalSlides / 2)) diff -= totalSlides;

            const isCenter = diff === 0;
            const isLeft = diff === -1;
            const isRight = diff === 1;

            let xPosition = '0%';
            let zPosition = 0;
            let scale = 1;
            let opacity = 1;
            let zIndex = 30;
            let rotateY = 0;
            let brightness = 'brightness(1)';

            if (isCenter) {
              xPosition = '0%';
              zPosition = 100; // Đưa hẳn ra đằng trước trong không gian 3D
              scale = 1;
              opacity = 1; // 100% opacity tuyệt đối cho banner chính
              zIndex = 35;
              rotateY = 0;
              brightness = 'brightness(1)';
            } else if (isLeft) {
              xPosition = '-72%';
              zPosition = -120; // Đưa lùi sâu về phía sau
              scale = 0.82;
              opacity = 0.75;
              zIndex = 10;
              rotateY = 16; // 2 banner đằng sau xoay nghiêng
              brightness = 'brightness(0.65)';
            } else if (isRight) {
              xPosition = '72%';
              zPosition = -120; // Đưa lùi sâu về phía sau
              scale = 0.82;
              opacity = 0.75;
              zIndex = 10;
              rotateY = -16; // 2 banner đằng sau xoay nghiêng
              brightness = 'brightness(0.65)';
            } else {
              xPosition = diff > 0 ? '140%' : '-140%';
              zPosition = -250;
              scale = 0.65;
              opacity = 0;
              zIndex = 0;
              rotateY = diff > 0 ? -28 : 28;
              brightness = 'brightness(0.4)';
            }

            return (
              <motion.div
                key={slide.id}
                initial={false}
                animate={{
                  x: xPosition,
                  z: zPosition,
                  scale: scale,
                  opacity: opacity,
                  rotateY: rotateY,
                  filter: brightness
                }}
                transition={{
                  duration: 0.85, // Animation trượt chậm hơn mượt mà
                  ease: [0.25, 1, 0.5, 1]
                }}
                className="absolute inset-0 w-full h-full aspect-[16/9] pointer-events-none select-none cursor-default"
                style={{
                  zIndex,
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'center center'
                }}
              >
                <BannerCardItem
                  slide={slide}
                  isActive={isCenter}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Pagination Indicators matching dots - Clickable */}
      <div className="mt-3 sm:mt-4 flex items-center justify-center gap-1.5 sm:gap-2">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={slide.id}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-500 rounded-full cursor-pointer ${
                isActive
                  ? 'w-7 sm:w-8 h-1.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]'
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
