import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VplayHeroButton } from './ui/VplayHeroButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { playPopSound } from '../utils/sound';
import { useLang } from '../context/LanguageContext';

interface HomeBannerSliderProps {
  onExploreDesignSystem: () => void;
  onWatchNow: () => void;
  onOpenFeedback?: () => void;
}

export const HomeBannerSlider: React.FC<HomeBannerSliderProps> = ({
  onExploreDesignSystem,
  onWatchNow,
  onOpenFeedback,
}) => {
  const { t } = useLang();
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 2;

  const handlePrev = () => {
    playPopSound();
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    playPopSound();
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-black/50 border-2 border-[#141414] p-4 sm:p-6 shadow-xl flex flex-col gap-4 relative overflow-hidden min-h-[320px] justify-between">
      {/* TOP HEADER / SLIDE CONTROLS OVERLAY */}
      <div className="flex items-center justify-between z-20 w-full border-b border-[#3d4043]/60 pb-2.5">
        <div className="inline-flex items-center gap-1.5 bg-[#1e2022]/80 text-[#89dc69] px-2.5 py-1 text-[11px] font-bold border border-[#383a3d] font-mono">
          {currentSlide + 1} / {totalSlides}
        </div>

        {/* ARROW NAVIGATION BUTTONS USING VPLAY SECONDARY BUTTON */}
        <div className="flex items-center gap-2">
          <VplaySecondaryButton
            fullWidth={false}
            onClick={handlePrev}
            aria-label="Previous Banner"
            title="Trang trước"
            className="!h-8 !py-1 !px-2.5 !min-w-0"
          >
            <img
              src="https://static.wikia.nocookie.net/ep-deo/images/a/ab/ArrowLeft.png/revision/latest?cb=20260728033445"
              alt="Back"
              referrerPolicy="no-referrer"
              className="w-3.5 h-3.5 object-contain [image-rendering:pixelated]"
              style={{ imageRendering: 'pixelated' }}
            />
          </VplaySecondaryButton>

          <VplaySecondaryButton
            fullWidth={false}
            onClick={handleNext}
            aria-label="Next Banner"
            title="Trang sau"
            className="!h-8 !py-1 !px-2.5 !min-w-0"
          >
            <img
              src="https://static.wikia.nocookie.net/ep-deo/images/a/a4/ArrowForward-03da527a1dfdbb6f55c5.png/revision/latest?cb=20260728071724"
              alt="Forward"
              referrerPolicy="no-referrer"
              className="w-3.5 h-3.5 object-contain [image-rendering:pixelated]"
              style={{ imageRendering: 'pixelated' }}
            />
          </VplaySecondaryButton>
        </div>
      </div>

      {/* SLIDE CONTENT AREA WITH ANIMATION */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-between py-1 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          {currentSlide === 0 ? (
            <motion.div
              key="slide-0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className="space-y-4 w-full"
            >
              {/* TITLE & SUBTITLE WITHOUT SIDE IMAGE */}
              <div className="space-y-2 text-left max-w-3xl mx-auto">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-wide font-jura text-center sm:text-left drop-shadow-md">
                  {t('home.tab.DesignPreview.name', 'WELCOME TO A DESIGN PREVIEW')}
                </h1>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed text-center sm:text-left drop-shadow">
                  {t('home.tab.DesignPreview.desc', 'Bạn đang được trải nghiệm hệ thống giao diện mới của Vplay, lấy cảm hứng từ Minecraft Ore UI, chúng tôi rất muốn nghe ý kiến của bạn. Hãy nhớ rằng là web nói chung và giao diện nói riêng vẫn đang trong quá trình phát triển, vì vậy một số tính năng có thể bị thiếu hoặc bạn sẽ gặp phải khá nhiều lỗi. Ore UI hứa hẹn sẽ đem đến cho bạn một trải nghiệm Vplay đẹp mắt, trực quan và mượt mà nhất.')}
                </p>
              </div>

              {/* 2 BUTTONS CENTERED */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <div className="w-auto">
                  <VplayHeroButton onClick={onExploreDesignSystem}>
                    {t('home.banner.exploreOreUI', 'KHÁM PHÁ JSON UI')}
                  </VplayHeroButton>
                </div>
                <div className="w-auto">
                  <VplaySecondaryButton
                    fullWidth={false}
                    onClick={() => {
                      playPopSound();
                      if (onOpenFeedback) onOpenFeedback();
                      else alert("Thank you for your feedback!");
                    }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <img
                        src="https://static.wikia.nocookie.net/ep-deo/images/5/5a/External-link-b22bbbc33f4f1f41e010vcvcv.png/revision/latest?cb=20260728071637"
                        alt="External link"
                        referrerPolicy="no-referrer"
                        className="w-3.5 h-3.5 object-contain"
                      />
                      <span>{t('home.banner.giveFeedback', 'Give Feedback')}</span>
                    </span>
                  </VplaySecondaryButton>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="slide-1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className="space-y-4 w-full relative p-4 sm:p-6 -mx-4 sm:-mx-6 -my-1 overflow-hidden min-h-[240px] flex flex-col justify-between border border-[#383a3d]"
            >
              {/* BACKGROUND IMAGE FOR BANNER 2 WITH DARK OVERLAY */}
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <img
                  src="https://static.wikia.nocookie.net/logos/images/b/b0/VTV6_ident_29.05-07.06.2026_b%E1%BA%A3n_3.png/revision/latest/scale-to-width-down/1000?cb=20260603150528&path-prefix=vi"
                  alt="VTV6 Background"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
              </div>

              {/* TEXT ONLY (NO IMAGE NEXT TO TEXT) */}
              <div className="space-y-2 text-left max-w-2xl mx-auto">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-wide font-jura drop-shadow-md">
                  Vì một Việt Nam khỏe mạnh
                </h1>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed drop-shadow">
                  VTV6 là kênh truyền hình chuyên biệt về thể thao của Đài Truyền hình Việt Nam. Nội dung chính của kênh bao gồm các bản tin, chuyên mục và chương trình tường thuật về thể thao trong nước và quốc tế do Trung tâm Truyền hình Thể thao sản xuất chính, với mục tiêu thúc đẩy phong trào thể thao quần chúng, thể thao học đường, thể thao chuyên nghiệp phát triển tại Việt Nam cũng như hướng đến rèn luyện, nâng cao sức khỏe cộng đồng và xây dựng con người phát triển toàn diện.
                </p>
              </div>

              {/* 2 BUTTONS CENTERED */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 z-10">
                <div className="w-auto">
                  <VplayHeroButton onClick={onWatchNow}>
                    Watch now
                  </VplayHeroButton>
                </div>
                <div className="w-auto">
                  <VplaySecondaryButton
                    fullWidth={false}
                    onClick={() => {
                      playPopSound();
                      window.open('https://vi.wikipedia.org/wiki/VTV6', '_blank');
                    }}
                  >
                    Learn more
                  </VplaySecondaryButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM DOT INDICATORS */}
      <div className="flex items-center justify-center gap-2 z-10 pt-1">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              playPopSound();
              setCurrentSlide(idx);
            }}
            className={`h-2 transition-all duration-150 cursor-pointer ${
              currentSlide === idx
                ? 'w-6 bg-[#89dc69] border border-[#141414]'
                : 'w-2 bg-[#52565a] hover:bg-[#888c91]'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
