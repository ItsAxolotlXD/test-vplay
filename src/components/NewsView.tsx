import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Megaphone, 
  ExternalLink, 
  Tv, 
  Calendar, 
  Share2, 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  Layers, 
  Compass, 
  Search, 
  ArrowUpRight,
  Type,
  Minus,
  Plus,
  Network,
  Play,
  Pause,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type NewsFontSize = 'small' | 'normal' | 'large' | 'huge';

interface NewsViewProps {
  onNavigateToLive: () => void;
  onNavigateToSettings: () => void;
  triggerToast: (msg: string) => void;
  newsFontSize?: NewsFontSize;
  onUpdateFontSize?: (size: NewsFontSize) => void;
  readingArticleId?: string | null;
  onReadingArticleChange?: (id: string | null) => void;
  externalSearchWord?: string;
  onClearExternalSearch?: () => void;
  isFindWordsOpen?: boolean;
  onToggleFindWords?: (open: boolean) => void;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  isFeatured?: boolean;
  image?: string;
  thumbnail?: string;
  gallery?: string[];
  fullContent?: string;
  formattedArticle?: {
    lead: string;
    sections: {
      id?: string;
      title?: string;
      subheading?: string;
      paragraphs?: string[];
      timeline?: { date: string; title: string; desc: string }[];
      bullets?: string[];
      highlightBox?: { title?: string; text: string };
      link?: { text: string; url: string };
    }[];
    closing?: string[];
  };
  actionText?: string;
  actionLink?: string;
  actionType?: 'discord' | 'live' | 'external';
}

const DiscordIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

export const WAVES_ANNIVERSARY_IMAGES: string[] = [
  "https://static.wikia.nocookie.net/ep-deo/images/2/26/Background.png/revision/latest?cb=20260825071832",
  "https://static.wikia.nocookie.net/ep-deo/images/a/a3/Page_1.png/revision/latest?cb=20260826063409",
  "https://static.wikia.nocookie.net/ep-deo/images/5/5a/Page2_.png/revision/latest?cb=20260826063443",
  "https://static.wikia.nocookie.net/ep-deo/images/3/32/Page_3.png/revision/latest?cb=20260826063545",
  "https://static.wikia.nocookie.net/ep-deo/images/6/6b/Page_5.png/revision/latest?cb=20260826063652",
  "https://static.wikia.nocookie.net/ep-deo/images/8/81/Page_7.png/revision/latest?cb=20260826063753",
  "https://static.wikia.nocookie.net/ep-deo/images/9/92/Xp.png/revision/latest?cb=20260826064323",
  "https://static.wikia.nocookie.net/ep-deo/images/f/f7/R.png/revision/latest?cb=20260826064424",
  "https://static.wikia.nocookie.net/ep-deo/images/f/f2/Imagecxvc.png/revision/latest?cb=20260826064632",
  "https://static.wikia.nocookie.net/ep-deo/images/0/0b/08.png/revision/latest?cb=20260826064807",
  "https://static.wikia.nocookie.net/ep-deo/images/1/12/09.png/revision/latest?cb=20260826064848",
  "https://static.wikia.nocookie.net/ep-deo/images/b/b0/Weves.png/revision/latest?cb=20260826065128"
];

// Interactive Liquid Glass Carousel shown ONLY inside Article Detail view
export const ImageGallerySlider: React.FC<{
  images: string[];
  className?: string;
  aspectRatio?: string;
  autoPlay?: boolean;
}> = ({ images, className = "", aspectRatio = "aspect-[16/9]", autoPlay = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSlideshowActive, setIsSlideshowActive] = useState<boolean>(true);
  const [progressKey, setProgressKey] = useState<number>(0);

  const total = images.length;

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    setProgressKey((prev) => prev + 1);
  }, [total]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDirection(1);
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
    setProgressKey((prev) => prev + 1);
  }, [total]);

  useEffect(() => {
    if (!isSlideshowActive || total <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
      setProgressKey((prev) => prev + 1);
    }, 10000); // 10 seconds auto-slide
    return () => clearInterval(interval);
  }, [isSlideshowActive, total]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape' && isLightboxOpen) setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, isLightboxOpen]);

  if (!images || images.length === 0) return null;

  return (
    <div className={`relative w-full select-none space-y-3 ${className}`}>
      {/* Slideshow Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-rose-300 flex items-center gap-1.5 text-xs sm:text-sm">
            <Layers className="w-4 h-4 text-rose-400" />
            Bộ nhận diện & Tư liệu Waves ({total} ảnh)
          </span>
        </div>

        {/* Display as slideshow Toggle (ON by default, 10s auto-slide) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
            <span className="text-[11px] font-medium text-white/80 select-none">
              Display as slideshow
            </span>
            <button
              type="button"
              onClick={() => setIsSlideshowActive(!isSlideshowActive)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isSlideshowActive ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-white/20'
              }`}
              title={isSlideshowActive ? "Tắt tự động trượt (10s)" : "Bật tự động trượt (10s)"}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isSlideshowActive ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            {isSlideshowActive && (
              <span className="text-[10px] text-rose-300 font-mono font-bold bg-rose-500/20 px-1.5 py-0.5 rounded border border-rose-500/30">
                10s
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main image container with horizontal sliding animation */}
      <div 
        onClick={() => setIsLightboxOpen(true)}
        className={`relative ${aspectRatio} w-full rounded-[20px] overflow-hidden bg-black/50 border border-white/15 cursor-zoom-in group shadow-[0_12px_40px_0_rgba(0,0,0,0.4),inset_0_1px_1px_0_rgba(255,255,255,0.25)]`}
      >
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Anniversary Image ${currentIndex + 1}`}
            referrerPolicy="no-referrer"
            custom={direction}
            variants={{
              enter: (dir: number) => ({
                x: dir > 0 ? '100%' : '-100%',
                opacity: 0,
                scale: 0.98
              }),
              center: {
                x: 0,
                opacity: 1,
                scale: 1,
                transition: {
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.35 }
                }
              },
              exit: (dir: number) => ({
                x: dir > 0 ? '-100%' : '100%',
                opacity: 0,
                scale: 0.98,
                transition: {
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 }
                }
              })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full h-full object-cover select-none"
          />
        </AnimatePresence>

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges & Lightbox indicator */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white shadow-md flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isSlideshowActive ? 'bg-rose-400 animate-ping' : 'bg-white/40'}`} />
            <span>Ảnh {currentIndex + 1} / {total}</span>
          </div>

          <div className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white/80 group-hover:text-white group-hover:bg-black/70 transition-all shadow-md">
            <Maximize2 className="w-4 h-4" />
          </div>
        </div>

        {/* 10s Slideshow Progress Bar */}
        {isSlideshowActive && (
          <div className="absolute top-0 inset-x-0 h-1 bg-white/10 overflow-hidden">
            <motion.div
              key={progressKey}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 10, ease: "linear" }}
              className="h-full bg-gradient-to-r from-rose-500 via-pink-400 to-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.8)]"
            />
          </div>
        )}

        {/* Navigation Arrow Left */}
        {total > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 active:scale-90 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all opacity-85 group-hover:opacity-100 cursor-pointer shadow-lg bouncy-btn"
            title="Ảnh trước"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}

        {/* Navigation Arrow Right */}
        {total > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 active:scale-90 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all opacity-85 group-hover:opacity-100 cursor-pointer shadow-lg bouncy-btn"
            title="Ảnh tiếp theo"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Thumbnails Row */}
      {total > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none px-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
                setProgressKey((prev) => prev + 1);
              }}
              className={`relative shrink-0 w-14 h-10 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                currentIndex === idx
                  ? "border-rose-400 ring-2 ring-rose-400/50 scale-105 shadow-md shadow-rose-500/30"
                  : "border-white/20 opacity-50 hover:opacity-100 hover:border-white/40"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-[24px] select-none">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-5 right-5 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer shadow-2xl bouncy-btn"
              title="Đóng xem toàn màn hình"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Counter pill */}
            <div className="absolute top-5 left-5 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-xs font-bold text-white flex items-center gap-2">
              <span>{currentIndex + 1} / {total}</span>
              {isSlideshowActive && (
                <span className="text-[10px] text-rose-300 font-mono">(Slideshow 10s)</span>
              )}
            </div>

            {total > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/15 hover:bg-white/30 active:scale-90 backdrop-blur-2xl border border-white/25 flex items-center justify-center text-white transition-all cursor-pointer shadow-2xl bouncy-btn"
              >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
              </button>
            )}

            <div className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex]}
                  alt={`Anniversary Full ${currentIndex + 1}`}
                  referrerPolicy="no-referrer"
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
                />
              </AnimatePresence>
            </div>

            {total > 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/15 hover:bg-white/30 active:scale-90 backdrop-blur-2xl border border-white/25 flex items-center justify-center text-white transition-all cursor-pointer shadow-2xl bouncy-btn"
              >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
              </button>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const NEWS_LIST: NewsItem[] = [
  {
    id: 'waves-1-year-journey',
    title: 'Hành trình 1 năm "vượt sóng" của Waves',
    date: '19/09/2026',
    isFeatured: true,
    thumbnail: 'https://static.wikia.nocookie.net/ep-deo/images/2/26/Background.png/revision/latest?cb=20260825071832',
    gallery: WAVES_ANNIVERSARY_IMAGES,
    excerpt: 'Có những hành trình bắt đầu từ những điều rất đỗi bình thường. Không có một kế hoạch lớn, không có một cái tên được định sẵn, cũng chẳng ai biết rằng những cuộc trò chuyện tưởng chừng vô tình ấy rồi sẽ trở thành một cộng đồng tồn tại qua nhiều năm tháng. The Waves bắt đầu như thế.',
    formattedArticle: {
      lead: `Có những hành trình bắt đầu từ những điều rất đỗi bình thường. Không có một kế hoạch lớn, không có một cái tên được định sẵn, cũng chẳng ai biết rằng những cuộc trò chuyện tưởng chừng vô tình ấy rồi sẽ trở thành một cộng đồng tồn tại qua nhiều năm tháng.\n\nThe Waves bắt đầu như thế.\n\nTừ những người xa lạ tình cờ gặp nhau dưới phần bình luận YouTube, từ những câu chuyện xoay quanh truyền hình Việt Nam, những tư liệu cũ và những ký ức tưởng như đã nằm lại đâu đó trong quá khứ — một mối liên kết dần được hình thành.\n\nVà hôm nay, sau một chặng đường dài với không ít lần thay đổi, The Waves chính thức khoác lên mình một diện mạo mới: Waves\n\nĐây không chỉ là một lần đổi tên. Đây là một lần thay áo. Một lần nhìn lại. Và cũng là một lần bắt đầu lại.`,
      sections: [
        {
          id: 'part-1',
          title: 'I. MỘT HÀNH TRÌNH BẮT ĐẦU TỪ NHỮNG LÀN SÓNG NHỎ',
          subheading: 'Từ những người xa lạ...',
          paragraphs: [
            'Câu chuyện của The Waves bắt đầu từ khoảng 2023–2024 khi một nhóm người xa lạ VNTV, TV Archive Official (OTA), Quỳnh Anh, và NTTMA khi ấy đơn giản chỉ là những người có chung niềm yêu thích với truyền hình và tình cờ quen biết nhau qua phần bình luận trên YouTube.',
            'Ban đầu chỉ là vài lời trao đổi. Rồi những cuộc trò chuyện kéo dài hơn. Những câu chuyện về các kênh truyền hình, những chương trình cũ, những đoạn phát sóng đã thất lạc, những ký ức mà chỉ những người cùng “hệ” mới thực sự hiểu. Từ những cuộc gặp gỡ rất tình cờ, một tình bạn dần được hình thành.'
          ]
        },
        {
          id: 'part-2',
          title: 'II. NHỮNG CÁI TÊN ĐẦU TIÊN',
          timeline: [
            {
              date: '27/09/2024',
              title: 'Television Material',
              desc: 'Ngày 27/09/2024, Facebook Group Television Material được thành lập. Lần đầu tiên, những cuộc trò chuyện ấy có một nơi để tập hợp, không chỉ là trên những bình luận lẻ loi trên YouTube, nơi mà...\n• Tư liệu được chia sẻ.\n• Ký ức được nhắc lại.\n• Những câu chuyện về truyền hình được tiếp nối.\n\nTelevision Material khi ấy có thể chỉ là một nhóm nhỏ, nhưng nó đã đặt viên gạch đầu tiên cho một cộng đồng lớn hơn về sau.'
            },
            {
              date: '13/04/2025',
              title: 'Khi những cuộc trò chuyện trở nên gần gũi hơn',
              desc: 'Đến 13/04/2025, NTTMA thành lập thêm một nhóm Messenger riêng để cả nhóm có thể thoải mái trò chuyện và “tám” về truyền hình. Cũng từ đây, TMC xuất hiện và trở thành thành viên thứ sáu. Facebook Group và Messenger tiếp tục tồn tại song song, mỗi nơi mang một vai trò riêng. Đó là một nơi để chia sẻ, một nơi để trò chuyện, vui đùa sau những ngày giờ mệt mỏi.\n\nVà cả hai đều trở thành những mảnh ghép đầu tiên trong câu chuyện của Waves.'
            }
          ]
        },
        {
          id: 'part-3',
          title: 'III. BƯỚC SANG MỘT CHƯƠNG MỚI',
          paragraphs: [
            'Ngày 09/06/2025, năm thành viên nòng cốt chính thức rời Messenger để bước lên Discord, với VNTV là owner. Server khi ấy thậm chí chưa có một cái tên cố định, nhưng chính nơi đó lại trở thành tiền thân của The Waves ngày hôm nay. Và rồi, cái tên cứ thay đổi ngày qua ngày...'
          ],
          bullets: [
            '→ Television Material',
            '→ TV Material',
            '→ TV Warriors',
            '→ TVerse',
            '→ Retro Universe',
            '→ Retroverse',
            '→ Retroverse University (RSU)'
          ],
          highlightBox: {
            text: 'Mỗi cái tên là một ý tưởng chung. Mỗi cái tên là một giai đoạn. Và mỗi lần đổi tên lại phản ánh một lần cộng đồng thử tìm kiếm cho mình một bản sắc mới. Đến một lúc, RSU trở thành “ngôi trường truyền hình” của cả cộng đồng — một nơi mang trong mình rất nhiều câu chuyện, kỷ niệm và những ngày tháng không thể lặp lại.'
          }
        },
        {
          id: 'part-4',
          title: 'IV. 19/09/2025 — MỘT LẦN RẼ SANG CON ĐƯỜNG KHÁC',
          paragraphs: [
            'Ngày 19/09/2025, cả nhóm chuyển sang một server hoàn toàn mới do Johnny Phạm làm owner. Một lần nữa, hành trình mới lại bắt đầu tiếp tục với rất nhiều lần đổi tên tiếp theo.'
          ],
          bullets: [
            '→ Retro(New)verse / Retroverse II',
            '→ RetroStudios',
            '→ RetroCafe',
            '→ SVN - Network',
            '→ SVN - Archive',
            '→ V-Network Community',
            '→ V-Archive Community',
            '→ The Waves - Television Group',
            '→ The Waves - Television Community',
            '→ The Waves'
          ],
          highlightBox: {
            text: 'Và cuối cùng, cái tên The Waves được giữ lại. Có lẽ không ai khi ấy nghĩ rằng cái tên ấy sẽ trở thành dấu ấn gắn với cộng đồng trong suốt một năm tiếp theo.'
          }
        },
        {
          id: 'part-5',
          title: 'V. NHỮNG NƠI ĐÃ TỪNG LÀ NHÀ',
          highlightBox: {
            text: 'Ngày 03/07/2025, nhóm Messenger dần đi vào im lặng... Nó không bị xóa... Vẫn ở đó... Như một căn phòng cũ mà chẳng còn ai bước vào, nhưng cũng chẳng ai muốn khóa cửa. Bởi đôi khi, một nơi không còn được sử dụng vẫn có giá trị — vì nó lưu giữ những ngày tháng mà chúng ta từng ở đó.\n\n... Và đúng ngày 18/10/2025, server Retroverse University chính thức “rút máy thở”. Một chương khép lại. Nhưng câu chuyện chưa bao giờ thực sự kết thúc.'
          }
        },
        {
          id: 'part-6',
          title: 'VI. LÀN SÓNG MỚI',
          paragraphs: [
            'Từ 20/09/2026, The Waves chính thức bước sang tuổi thứ hai, đồng thời tiến vào một chương mới — một cuộc đại tu toàn diện, một cú lột xác mang tên gọi ngắn gọn hơn - Waves',
            'Ý tưởng thay đổi nhận diện đã được những thành viên nòng cốt âm thầm bàn luận từ cuối tháng 6 – đầu tháng 7/2026, trước khi chính thức triển khai nhân dịp kỷ niệm một năm thành lập server. Nhưng chúng tôi không muốn đây chỉ là chuyện thay một chiếc logo. Không phải chỉ đổi một vài màu sắc, cũng không đơn giản là bỏ đi hai chữ “The”. Chúng tôi muốn cùng thành viên nhìn lại một năm đầy tự hào. Một năm là đủ dài để nhìn lại những gì đã đi qua, nhưng cũng vừa đủ để bắt đầu một hành trình mới.',
            'Những thay đổi này không chỉ nằm ở cái tên, mà chúng tôi mong muốn đồng bộ và đại tu toàn bộ nhận diện của Waves. Logo, màu sắc, font chữ và phong cách đồ họa đều được xây dựng lại theo một hướng thống nhất hơn. Waves lựa chọn một diện mạo sáng hơn, trẻ hơn và giàu năng lượng hơn. Sự kết hợp giữa những gam màu sáng và hồng cánh sen — magenta tạo nên một dấu ấn thị giác mới: nổi bật nhưng không quá nặng nề, hiện đại nhưng vẫn giữ được chất riêng. Đó là một "làn sóng" mới. Nhưng không phải gì đó xa lạ bởi chúng tôi không muốn xóa đi quá khứ. Chúng tôi muốn mang quá khứ hòa mình vào "nhịp sóng" tương lai.'
          ]
        },
        {
          id: 'part-8',
          title: 'VIII. Ý NGHĨA LOGO WAVES',
          bullets: [
            'Ba ngọn sóng vươn lên: Ba làn sóng hướng lên trên tượng trưng cho sự phát triển, khát vọng vươn tới tương lai và tinh thần không ngừng chuyển động. Đồng thời, chúng gợi nhắc đến điều làm nên bản chất của Waves: sóng truyền hình, sóng phát thanh và những tín hiệu truyền thông.',
            'Những cơn sóng không bao giờ đứng yên: Font chữ Waves được cách điệu với những đường nét bo cong, mềm mại và uyển chuyển. Những đường cong ấy không chỉ tạo nên một diện mạo hiện đại. Chúng còn phản ánh chính bản chất của một làn sóng: luôn chuyển động, luôn biến đổi, nhưng chưa bao giờ ngừng tiến về phía trước.',
            'Chữ “S” — nơi những làn sóng gặp nhau: Được cách điệu thành hai làn sóng hòa quyện vào nhau. Hai đường đi riêng biệt nhưng cuối cùng lại giao nhau trong một chuyển động liên tục. Đó là hình ảnh của sự kết nối, giao thoa và đồng hành. Một cộng đồng cũng được tạo nên như thế, những con người khác nhau, những câu chuyện khác nhau, nhưng cùng gặp nhau ở một niềm đam mê.',
            'Chữ “V” — những tín hiệu được truyền đi: Hình dáng chữ V gợi liên tưởng tới hai chiếc ăng-ten hướng vào nhau như một điểm phát tín hiệu, như những luồng sóng được truyền đi và như cách những thông tin, ký ức và cảm hứng từ Waves tiếp tục được lan tỏa.',
            'Nút Play — biểu tượng của sự bắt đầu: Đại diện cho truyền hình, video và thế giới nội dung số. Nhưng hơn thế, nó còn là biểu tượng của một hành động: bắt đầu.\n• Bấm Play để một chương trình bắt đầu.\n• Bấm Play để một câu chuyện tiếp tục.\n• Và bấm Play để những nhịp sóng của Waves tiếp tục được truyền đi.'
          ]
        },
        {
          id: 'part-9',
          title: 'IX. WAVES — KHÔNG CHỈ LÀ CÁI TÊN',
          paragraphs: [
            'Waves trước hết là những làn sóng.\nSóng truyền hình.\nSóng phát thanh.\nNhững tín hiệu truyền thông đi qua không gian và thời gian.',
            'Nhưng với chúng tôi, Waves còn mang một ý nghĩa lớn hơn thế.'
          ],
          bullets: [
            'Sóng để kết nối: Một tín hiệu được phát đi luôn tìm kiếm một nơi để được tiếp nhận. Cũng giống như những con người trong cộng đồng. Từ một phần bình luận YouTube, những tín hiệu nhỏ bé ấy đã tìm thấy nhau. Và từ đó, một cộng đồng được hình thành.',
            'Mỗi làn sóng là một dấu ấn: Mỗi thời kỳ truyền hình đều có một câu chuyện. Mỗi kênh sóng đều có một ký ức. Mỗi chương trình, mỗi đoạn phát sóng, mỗi tư liệu cũ đều là một mảnh ghép của thời đại. Waves không chỉ nhìn chúng như những dữ liệu. Chúng tôi nhìn chúng như những dấu vết của thời gian.',
            'Mỗi chúng ta là một ngọn sóng: Không có hai làn sóng hoàn toàn giống nhau. Và cũng chẳng có hai con người hoàn toàn giống nhau. Mỗi thành viên đến với Waves bằng một câu chuyện riêng, một sở thích riêng và một góc nhìn riêng. Nhưng khi cùng chuyển động, tất cả tạo nên một thứ lớn hơn: một đại dương truyền thông không ngừng chuyển động.',
            'Sóng không bao giờ đứng yên: Đây có lẽ cũng chính là điều mà Waves muốn trở thành.\nKhông đứng yên.\nKhông ngừng thay đổi.\nKhông ngừng phát triển.'
          ],
          highlightBox: {
            text: 'Từ Television Material đến The Waves. Và hôm nay:\nWaves.\n\nCái tên có thể ngắn hơn. Logo có thể khác đi. Màu sắc có thể thay đổi... Nhưng những con người, những ký ức và niềm đam mê đã tạo nên cộng đồng này vẫn ở đó.'
          }
        }
      ],
      closing: [
        'Waves - Nhịp sóng lưu dấu thời đại',
        'Nơi mỗi nhịp sóng đi qua, một dấu ấn ở lại 🌊'
      ]
    },
    actionText: 'Ghé thăm Waves Community',
    actionLink: 'https://waves-community.vercel.app',
    actionType: 'external'
  },
  {
    id: 'merger-announcement',
    title: 'Tạm biệt Vplay - Chào mừng bạn đến với Waves Community!',
    date: '20/09/2026',
    thumbnail: 'https://static.wikia.nocookie.net/ep-deo/images/2/26/Background.png/revision/latest?cb=20260825071832',
    excerpt: 'Kể từ 20/09/2026, nền tảng xem truyền hình quen thuộc của bạn sẽ bước sang một hành trình hoàn toàn mới. Vplay được hợp nhất để trở thành Waves Community.',
    fullContent: 'Kể từ ngày 20/09/2026, nền tảng xem truyền hình quen thuộc của bạn sẽ bước sang một hành trình hoàn toàn mới. Vplay được hợp nhất để trở thành Waves Community. Ngoài việc cung cấp cho người dùng một hệ thống xem truyền hình đa dạng thể loại các kênh thì trang web mới sau sáp nhập sẽ tập trung thêm cả vào việc cập nhật những tin tức, thông báo mới của server Waves trong Discord. Toàn bộ tính năng đã được tối ưu hóa giao diện cinematic, độ trễ phát sóng cực thấp và tích hợp cộng đồng Discord.',
    actionText: 'Tham gia Server Discord Waves',
    actionLink: 'https://discord.gg/waves',
    actionType: 'discord'
  }
];

export const NewsView: React.FC<NewsViewProps> = ({
  onNavigateToLive,
  onNavigateToSettings,
  triggerToast,
  newsFontSize = 'huge',
  onUpdateFontSize,
  readingArticleId: externalReadingId,
  onReadingArticleChange,
  externalSearchWord = '',
  onClearExternalSearch,
  isFindWordsOpen: externalFindWordsOpen = false,
  onToggleFindWords
}) => {
  const [internalReadingId, setInternalReadingId] = useState<string | null>(null);
  const readingArticleId = externalReadingId !== undefined ? externalReadingId : internalReadingId;

  const setReadingArticleId = (id: string | null) => {
    if (onReadingArticleChange) {
      onReadingArticleChange(id);
    }
    setInternalReadingId(id);
  };

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentFontSize, setCurrentFontSize] = useState<NewsFontSize>(() => {
    return (localStorage.getItem('waves_news_font_size') as NewsFontSize) || newsFontSize || 'huge';
  });

  // Find Words state in article
  const [findWordsOpen, setFindWordsOpen] = useState<boolean>(externalFindWordsOpen);
  const [articleSearchWord, setArticleSearchWord] = useState<string>(externalSearchWord || '');
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number>(0);
  const articleContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (externalFindWordsOpen !== undefined) {
      setFindWordsOpen(externalFindWordsOpen);
    }
  }, [externalFindWordsOpen]);

  useEffect(() => {
    if (externalSearchWord) {
      setArticleSearchWord(externalSearchWord);
      setFindWordsOpen(true);
    }
  }, [externalSearchWord]);

  useEffect(() => {
    if (newsFontSize && newsFontSize !== currentFontSize) {
      setCurrentFontSize(newsFontSize);
    }
  }, [newsFontSize]);

  const changeFontSize = (size: NewsFontSize) => {
    setCurrentFontSize(size);
    localStorage.setItem('waves_news_font_size', size);
    if (onUpdateFontSize) onUpdateFontSize(size);
    const labels = { small: 'Nhỏ (14px)', normal: 'Tiêu chuẩn (16px)', large: 'Lớn (18px)', huge: 'Rất lớn (20px)' };
    triggerToast(`Đã đổi cỡ chữ: ${labels[size]}`);
  };

  const readingItem = useMemo(() => {
    if (!readingArticleId) return null;
    return NEWS_LIST.find(item => item.id === readingArticleId) || null;
  }, [readingArticleId]);

  const filteredNews = useMemo(() => {
    return NEWS_LIST.filter(item => {
      const matchQuery = !searchQuery.trim() || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchQuery;
    });
  }, [searchQuery]);

  // Calculate text matches for "Find words"
  const totalMatches = useMemo(() => {
    if (!articleSearchWord.trim() || !readingItem) return 0;
    const word = articleSearchWord.trim().toLowerCase();
    let count = 0;
    const checkText = (text: string) => {
      if (!text) return;
      const lower = text.toLowerCase();
      let pos = 0;
      while ((pos = lower.indexOf(word, pos)) !== -1) {
        count++;
        pos += word.length;
      }
    };

    if (readingItem.title) checkText(readingItem.title);
    if (readingItem.formattedArticle) {
      checkText(readingItem.formattedArticle.lead);
      readingItem.formattedArticle.sections.forEach(sec => {
        if (sec.title) checkText(sec.title);
        if (sec.subheading) checkText(sec.subheading);
        sec.paragraphs?.forEach(p => checkText(p));
        sec.bullets?.forEach(b => checkText(b));
        if (sec.highlightBox?.text) checkText(sec.highlightBox.text);
      });
      readingItem.formattedArticle.closing?.forEach(c => checkText(c));
    } else if (readingItem.fullContent) {
      checkText(readingItem.fullContent);
    }
    return count;
  }, [articleSearchWord, readingItem]);

  const scrollToNextMatch = (dir: 'next' | 'prev') => {
    if (totalMatches === 0) return;
    let nextIdx = dir === 'next' ? currentMatchIndex + 1 : currentMatchIndex - 1;
    if (nextIdx >= totalMatches) nextIdx = 0;
    if (nextIdx < 0) nextIdx = totalMatches - 1;
    setCurrentMatchIndex(nextIdx);

    // Scroll to the matching element
    setTimeout(() => {
      const marks = articleContentRef.current?.querySelectorAll('mark[data-highlight-match="true"]');
      if (marks && marks[nextIdx]) {
        marks[nextIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  const handleAction = (item: NewsItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (item.actionType === 'discord') {
      window.open(item.actionLink || "https://discord.gg/waves", "_blank");
      triggerToast("Đang mở Waves Community Discord");
    } else if (item.actionType === 'live') {
      onNavigateToLive();
      triggerToast("Chuyển đến màn hình V-Play");
    } else if (item.actionType === 'external') {
      window.open(item.actionLink || "https://waves-community.vercel.app", "_blank");
      triggerToast("Đang mở trang web Waves Community");
    }
  };

  // Helper to highlight matching words in text
  const highlightText = (text: string) => {
    if (!articleSearchWord.trim() || !text) return text;
    const query = articleSearchWord.trim();
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark
              key={i}
              data-highlight-match="true"
              className="bg-rose-500 text-white rounded px-1 font-bold shadow-[0_0_8px_rgba(244,63,94,0.7)]"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Font sizing style mapping
  const sizeStyles = useMemo(() => {
    switch (currentFontSize) {
      case 'small':
        return {
          title: 'text-xl sm:text-2xl lg:text-3xl',
          lead: 'text-xs sm:text-sm leading-relaxed',
          sectionTitle: 'text-sm sm:text-base font-bold',
          subheading: 'text-xs sm:text-sm font-semibold',
          paragraphs: 'text-xs sm:text-sm leading-relaxed',
          timelineDate: 'text-[10px]',
          timelineTitle: 'text-xs',
          timelineDesc: 'text-[11px] sm:text-xs leading-relaxed',
          highlightText: 'text-[11px] sm:text-xs leading-relaxed',
          bullets: 'text-xs sm:text-sm leading-relaxed',
          closing: 'text-xs leading-relaxed',
          closingBold: 'text-xs sm:text-sm font-bold',
          fallback: 'text-xs sm:text-sm leading-relaxed',
        };
      case 'large':
        return {
          title: 'text-3xl sm:text-4xl lg:text-5xl',
          lead: 'text-base sm:text-lg lg:text-xl leading-relaxed',
          sectionTitle: 'text-lg sm:text-2xl font-bold',
          subheading: 'text-base sm:text-lg font-semibold',
          paragraphs: 'text-base sm:text-lg leading-relaxed',
          timelineDate: 'text-xs',
          timelineTitle: 'text-sm sm:text-base',
          timelineDesc: 'text-sm sm:text-base leading-relaxed',
          highlightText: 'text-sm sm:text-base leading-relaxed',
          bullets: 'text-base sm:text-lg leading-relaxed',
          closing: 'text-sm sm:text-base leading-relaxed',
          closingBold: 'text-base sm:text-lg font-bold',
          fallback: 'text-base sm:text-lg leading-relaxed',
        };
      case 'huge':
        return {
          title: 'text-3xl sm:text-5xl lg:text-6xl',
          lead: 'text-lg sm:text-xl lg:text-2xl leading-relaxed',
          sectionTitle: 'text-xl sm:text-3xl font-bold',
          subheading: 'text-lg sm:text-xl font-semibold',
          paragraphs: 'text-lg sm:text-xl leading-relaxed',
          timelineDate: 'text-sm',
          timelineTitle: 'text-base sm:text-lg',
          timelineDesc: 'text-base sm:text-lg leading-relaxed',
          highlightText: 'text-base sm:text-lg leading-relaxed',
          bullets: 'text-lg sm:text-xl leading-relaxed',
          closing: 'text-base sm:text-lg leading-relaxed',
          closingBold: 'text-lg sm:text-xl font-bold',
          fallback: 'text-lg sm:text-xl leading-relaxed',
        };
      case 'normal':
      default:
        return {
          title: 'text-2xl sm:text-3xl lg:text-4xl',
          lead: 'text-sm sm:text-base leading-relaxed',
          sectionTitle: 'text-base sm:text-xl font-bold',
          subheading: 'text-sm sm:text-base font-semibold',
          paragraphs: 'text-sm sm:text-base leading-relaxed',
          timelineDate: 'text-[11px]',
          timelineTitle: 'text-xs sm:text-sm',
          timelineDesc: 'text-xs sm:text-sm leading-relaxed',
          highlightText: 'text-xs sm:text-sm leading-relaxed',
          bullets: 'text-xs sm:text-sm leading-relaxed',
          closing: 'text-xs sm:text-sm leading-relaxed',
          closingBold: 'text-sm sm:text-base font-bold',
          fallback: 'text-sm sm:text-base leading-relaxed',
        };
    }
  }, [currentFontSize]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-14 pb-32 font-sans text-white">
      <AnimatePresence mode="wait">
        {/* ========================================================================= */}
        {/* VIEW MODE 1: DEDICATED FULL ARTICLE PAGE (NO BACKGROUND CARD CONTAINER)    */}
        {/* ========================================================================= */}
        {readingItem ? (
          <motion.div
            key={`article-view-${readingItem.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full mx-auto font-sans space-y-6"
            ref={articleContentRef}
          >
            {/* Top Navigation & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  onClick={() => setReadingArticleId(null)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-[24px] saturate-150 cursor-pointer transition-all bouncy-btn shrink-0"
                  title="Quay lại danh sách tin tức"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-white/50 font-medium">
                    <button 
                      onClick={() => setReadingArticleId(null)}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Tin tức & Sự kiện
                    </button>
                    <span>/</span>
                    <span className="text-white/80 font-medium">Chi tiết bài viết</span>
                  </div>
                  <h2 className="text-sm font-semibold text-white/90 truncate mt-0.5 max-w-[240px] sm:max-w-md">
                    {readingItem.title}
                  </h2>
                </div>
              </div>

              {/* Action Buttons & Font Size Quick Adjuster Header */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {/* Find words in article button */}
                <button
                  type="button"
                  onClick={() => {
                    const nextState = !findWordsOpen;
                    setFindWordsOpen(nextState);
                    if (onToggleFindWords) onToggleFindWords(nextState);
                    if (nextState) {
                      triggerToast("Đã mở công cụ Tìm từ trong bài viết");
                    }
                  }}
                  className={`px-3.5 py-2 rounded-full border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] bouncy-btn ${
                    findWordsOpen || articleSearchWord
                      ? 'bg-rose-500/30 text-rose-200 border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                      : 'bg-white/10 hover:bg-white/20 border-white/15 text-white/90'
                  }`}
                  title="Tìm từ trong bài viết (Find words)"
                >
                  <Search className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Tìm từ</span>
                </button>

                {/* Font Size Quick Selector Pill */}
                <div className="flex items-center bg-white/10 border border-white/15 rounded-full p-0.5 backdrop-blur-[20px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
                  <button
                    onClick={() => {
                      const sizes: NewsFontSize[] = ['small', 'normal', 'large', 'huge'];
                      const currentIdx = sizes.indexOf(currentFontSize);
                      if (currentIdx > 0) changeFontSize(sizes[currentIdx - 1]);
                    }}
                    disabled={currentFontSize === 'small'}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      currentFontSize === 'small' ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/15 active:scale-90 cursor-pointer text-white'
                    }`}
                    title="Giảm cỡ chữ (A-)"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <div className="px-2 text-[11px] font-bold font-mono text-rose-300 flex items-center gap-1 select-none">
                    <Type className="w-3 h-3" />
                    <span>{currentFontSize === 'small' ? 'Nhỏ' : currentFontSize === 'normal' ? 'Chuẩn' : currentFontSize === 'large' ? 'Lớn' : 'Cực đại'}</span>
                  </div>

                  <button
                    onClick={() => {
                      const sizes: NewsFontSize[] = ['small', 'normal', 'large', 'huge'];
                      const currentIdx = sizes.indexOf(currentFontSize);
                      if (currentIdx < sizes.length - 1) changeFontSize(sizes[currentIdx + 1]);
                    }}
                    disabled={currentFontSize === 'huge'}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      currentFontSize === 'huge' ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/15 active:scale-90 cursor-pointer text-white'
                    }`}
                    title="Tăng cỡ chữ (A+)"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    triggerToast("Đã sao chép liên kết bài viết!");
                  }}
                  className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-[20px] text-xs text-white flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] bouncy-btn"
                  title="Chia sẻ bài viết"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Chia sẻ</span>
                </button>

                {readingItem.actionType && (
                  <button
                    onClick={() => handleAction(readingItem)}
                    className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-lg backdrop-blur-[20px] border border-white/20 bouncy-btn ${
                      readingItem.actionType === 'discord'
                        ? 'bg-[#5865F2]/90 hover:bg-[#5865F2] text-white shadow-[#5865F2]/30'
                        : readingItem.actionType === 'external'
                        ? 'bg-rose-600/90 hover:bg-rose-500 text-white shadow-rose-600/30'
                        : 'bg-red-600/90 hover:bg-red-500 text-white'
                    }`}
                  >
                    {readingItem.actionType === 'discord' && <DiscordIcon className="w-3.5 h-3.5" />}
                    {readingItem.actionType === 'live' && <Tv className="w-3.5 h-3.5" />}
                    {readingItem.actionType === 'external' && <Globe className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{readingItem.actionText || 'Mở liên kết'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
                  </button>
                )}
              </div>
            </div>

            {/* In-Article "Find words" Interactive Toolbar */}
            <AnimatePresence>
              {findWordsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="bg-black/60 backdrop-blur-[24px] saturate-150 border border-rose-500/40 rounded-[18px] p-3.5 shadow-[0_8px_32px_rgba(244,63,94,0.2),inset_0_1px_1px_rgba(255,255,255,0.25)] flex flex-wrap items-center justify-between gap-3 overflow-hidden"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-[220px]">
                    <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 shrink-0">
                      <Search className="w-4 h-4" />
                    </div>
                    <div className="flex-1 relative h-[38px] flex items-center px-3 rounded-full spotlight-bubble-box search-box-capsule float-search-style border-0">
                      <input
                        type="text"
                        value={articleSearchWord}
                        onChange={(e) => {
                          setArticleSearchWord(e.target.value);
                          setCurrentMatchIndex(0);
                        }}
                        placeholder="Nhập từ hoặc câu cần tìm trong bài viết..."
                        className="w-full bg-transparent text-xs text-white placeholder-white/60 focus:outline-none font-semibold truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] border-0"
                        autoFocus
                      />
                      {articleSearchWord && (
                        <button
                          type="button"
                          onClick={() => {
                            setArticleSearchWord('');
                            if (onClearExternalSearch) onClearExternalSearch();
                          }}
                          className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer shrink-0 ml-1"
                          title="Xóa tìm kiếm"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-rose-300 bg-rose-500/20 px-2.5 py-1 rounded-full border border-rose-500/30">
                      {articleSearchWord ? `${totalMatches > 0 ? currentMatchIndex + 1 : 0} / ${totalMatches} kết quả` : '0 kết quả'}
                    </span>

                    {totalMatches > 0 && (
                      <div className="flex items-center gap-1 bg-white/10 rounded-full p-0.5 border border-white/15">
                        <button
                          type="button"
                          onClick={() => scrollToNextMatch('prev')}
                          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/20 text-white active:scale-90"
                          title="Kết quả trước"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => scrollToNextMatch('next')}
                          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/20 text-white active:scale-90"
                          title="Kết quả tiếp theo"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setFindWordsOpen(false);
                        setArticleSearchWord('');
                        if (onToggleFindWords) onToggleFindWords(false);
                        if (onClearExternalSearch) onClearExternalSearch();
                      }}
                      className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
                      title="Đóng tìm từ"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Article Main Content (NO BACKGROUND CARD CONTAINER AS REQUESTED) */}
            <div className="w-full space-y-7 relative pt-2">
              {/* Date Header */}
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs text-rose-300/90 font-medium px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/25 backdrop-blur-md">
                  <Calendar className="w-3.5 h-3.5 text-rose-400" />
                  {readingItem.date}
                </span>
              </div>

              {/* Title */}
              <h1 className={`${sizeStyles.title} font-extrabold text-white tracking-tight leading-tight`}>
                {highlightText(readingItem.title)}
              </h1>

              {/* Sơ đồ cây bài viết (Table of Contents Tree Diagram) */}
              {readingItem.formattedArticle && readingItem.formattedArticle.sections && (
                <div className="bg-white/[0.05] backdrop-blur-[24px] saturate-[180%] rounded-[22px] p-5 sm:p-6 border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.25),inset_0_1px_1px_0_rgba(255,255,255,0.2)] space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                        <Network className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>Sơ đồ cây nội dung bài viết</span>
                          <span className="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                            {readingItem.formattedArticle.sections.length} mục chính
                          </span>
                        </h4>
                        <p className="text-[11px] text-white/50">Chạm hoặc nhấp vào từng nhánh để cuộn nhanh đến mục tương ứng</p>
                      </div>
                    </div>
                  </div>

                  {/* Visual Tree Nodes Structure */}
                  <div className="space-y-2 pt-1 font-sans">
                    {readingItem.formattedArticle.sections.map((sec, idx) => {
                      const isLast = idx === readingItem.formattedArticle!.sections.length - 1;
                      const hasGallery = sec.id === 'part-6' || (sec.title && sec.title.includes('VI. LÀN SÓNG MỚI'));

                      return (
                        <div key={sec.id || idx} className="relative pl-6 group">
                          {/* Tree trunk connecting line */}
                          <div className={`absolute left-2.5 top-0 w-px bg-white/15 group-hover:bg-rose-400/50 transition-colors ${isLast ? 'h-4' : 'h-full'}`} />
                          
                          {/* Tree branch horizontal hook */}
                          <div className="absolute left-2.5 top-3.5 w-3 h-px bg-white/20 group-hover:bg-rose-400/60 transition-colors" />

                          {/* Tree Node Dot */}
                          <div className="absolute left-[7px] top-[11px] w-2 h-2 rounded-full bg-rose-400/80 shadow-[0_0_6px_rgba(244,63,94,0.8)] group-hover:scale-125 transition-transform" />

                          <button
                            type="button"
                            onClick={() => {
                              if (sec.id) {
                                const el = document.getElementById(sec.id);
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                  triggerToast(`Đã cuộn đến: ${sec.title || 'Mục'}`);
                                }
                              }
                            }}
                            className="w-full text-left p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.1] border border-white/10 hover:border-rose-500/40 transition-all flex items-center justify-between gap-3 cursor-pointer group-hover:translate-x-1"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-[11px] font-mono font-bold text-rose-300 shrink-0 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                                #{idx + 1}
                              </span>
                              <span className="text-xs sm:text-sm font-semibold text-white/90 group-hover:text-white truncate">
                                {sec.title}
                              </span>
                            </div>

                            {hasGallery && (
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1 shrink-0">
                                <Layers className="w-3 h-3 text-amber-400" />
                                Slideshow 10s
                              </span>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Formatted Article Body */}
              {readingItem.formattedArticle ? (
                <div className="text-white/85 space-y-8 font-sans pt-2">
                  {/* Lead Callout */}
                  <div className={`border-l-4 border-rose-400 pl-5 sm:pl-6 py-2 ${sizeStyles.lead} text-white/90 italic whitespace-pre-line`}>
                    {highlightText(readingItem.formattedArticle.lead)}
                  </div>

                  {/* Dynamic Sections */}
                  {readingItem.formattedArticle.sections.map((sec, sIdx) => {
                    const isSectionVI = sec.id === 'part-6' || (sec.title && sec.title.includes('VI. LÀN SÓNG MỚI'));

                    return (
                      <div key={sIdx} id={sec.id} className="space-y-4 pt-4 scroll-mt-24">
                        {sec.title && (
                          <div className="flex items-center gap-3 border-b border-white/10 pb-2.5">
                            <h3 className={`${sizeStyles.sectionTitle} text-rose-300 tracking-tight flex items-center gap-2`}>
                              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 shrink-0" />
                              {highlightText(sec.title)}
                            </h3>
                          </div>
                        )}
                        
                        {sec.subheading && (
                          <h4 className={`${sizeStyles.subheading} text-white/95`}>
                            {highlightText(sec.subheading)}
                          </h4>
                        )}

                        {sec.paragraphs && sec.paragraphs.map((p, pIdx) => (
                          <p key={pIdx} className={`${sizeStyles.paragraphs} text-white/80 font-sans`}>
                            {highlightText(p)}
                          </p>
                        ))}

                        {/* Milestones / Timeline */}
                        {sec.timeline && (
                          <div className="space-y-4 my-6 pl-3 sm:pl-4 border-l-2 border-rose-500/40">
                            {sec.timeline.map((tItem, tIdx) => (
                              <div key={tIdx} className="relative pl-5 space-y-1.5 py-1">
                                <div className="absolute -left-[23px] sm:-left-[27px] top-2 w-3 h-3 rounded-full bg-rose-500 border-2 border-[#1c1b21] shadow-md shadow-rose-500/60" />
                                <div className="flex items-center gap-2.5 flex-wrap">
                                  <span className={`px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 ${sizeStyles.timelineDate} font-mono font-bold border border-rose-500/30`}>
                                    {tItem.date}
                                  </span>
                                  <strong className={`${sizeStyles.timelineTitle} text-white font-semibold`}>
                                    {highlightText(tItem.title)}
                                  </strong>
                                </div>
                                <p className={`${sizeStyles.timelineDesc} text-white/70`}>
                                  {highlightText(tItem.desc)}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Highlight Box */}
                        {sec.highlightBox && (
                          <div className="p-4 sm:p-5 rounded-2xl border-l-4 border-rose-400 bg-white/[0.04] border-y border-r border-white/10 space-y-2 my-4">
                            {sec.highlightBox.title && (
                              <h5 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                                {highlightText(sec.highlightBox.title)}
                              </h5>
                            )}
                            <p className={`${sizeStyles.highlightText} text-white/85 italic whitespace-pre-line`}>
                              {highlightText(sec.highlightBox.text)}
                            </p>
                          </div>
                        )}

                        {/* Bullet list */}
                        {sec.bullets && (
                          <ul className="space-y-3 my-4">
                            {sec.bullets.map((b, bIdx) => (
                              <li key={bIdx} className={`flex items-start gap-3 ${sizeStyles.bullets} text-white/80`}>
                                <span className="w-2 h-2 rounded-full bg-rose-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                                <span>{highlightText(b)}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Action Link in Section */}
                        {sec.link && (
                          <div className="pt-2">
                            <a
                              href={sec.link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 backdrop-blur-xl text-rose-300 text-xs font-bold transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] active:scale-95 bouncy-btn"
                            >
                              <span>{sec.link.text}</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}

                        {/* IMAGE GALLERY SLIDER LOCATED DIRECTLY UNDER SECTION VI. LÀN SÓNG MỚI */}
                        {isSectionVI && readingItem.gallery && readingItem.gallery.length > 0 && (
                          <div className="my-6 pt-2">
                            <ImageGallerySlider images={readingItem.gallery} aspectRatio="aspect-[16/9]" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Closing Words */}
                  {readingItem.formattedArticle.closing && (
                    <div className="pt-8 border-t border-white/10 space-y-3 text-center text-white/90">
                      {readingItem.formattedArticle.closing.map((cText, cIdx) => (
                        <p key={cIdx} className={cIdx === 3 ? `${sizeStyles.closingBold} text-rose-300 pt-3` : `${sizeStyles.closing} font-sans`}>
                          {highlightText(cText)}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Fallback standard fullContent text */
                <div className={`${sizeStyles.fallback} text-white/85 space-y-4 font-sans pt-2`}>
                  <p className="whitespace-pre-line">{highlightText(readingItem.fullContent || readingItem.excerpt)}</p>
                </div>
              )}
            </div>

            {/* Bottom Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
              <button
                onClick={() => setReadingArticleId(null)}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 backdrop-blur-xl text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.25)] bouncy-btn"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                <span>Quay lại danh sách tin tức</span>
              </button>

              {readingItem.actionType && (
                <button
                  onClick={() => handleAction(readingItem)}
                  className={`w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-xl backdrop-blur-xl border border-white/20 bouncy-btn ${
                    readingItem.actionType === 'discord'
                      ? 'bg-[#5865F2]/90 hover:bg-[#5865F2] text-white shadow-[#5865F2]/30'
                      : readingItem.actionType === 'external'
                      ? 'bg-rose-600/90 hover:bg-rose-500 text-white shadow-rose-600/30'
                      : 'bg-red-600/90 hover:bg-red-500 text-white'
                  }`}
                >
                  {readingItem.actionType === 'discord' && <DiscordIcon className="w-4 h-4" />}
                  {readingItem.actionType === 'live' && <Tv className="w-4 h-4" />}
                  {readingItem.actionType === 'external' && <Globe className="w-4 h-4" />}
                  <span>{readingItem.actionText || 'Mở liên kết'}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-80" />
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          /* ========================================================================= */
          /* VIEW MODE 2: MAIN NEWS LIST (VERTICAL STACK, NO BUTTONS, NO TAGS/AUTHOR)  */
          /* ========================================================================= */
          <motion.div
            key="news-list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full mx-auto font-sans space-y-6"
          >
            {/* Top Hub Banner - Liquid Glass styling */}
            <div className="bg-white/[0.09] backdrop-blur-[24px] saturate-[180%] rounded-[20px] p-5 sm:p-7 shadow-[0_8px_32px_0_rgba(0,0,0,0.2),inset_0_1px_1px_0_rgba(255,255,255,0.25)] border border-white/15 flex flex-col gap-3 relative overflow-hidden">
              {/* Specular highlight rim */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
              
              <div className="space-y-2.5 z-10 w-full">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 backdrop-blur-md flex items-center gap-1.5 shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.2)]">
                      <Megaphone className="w-3.5 h-3.5 text-rose-400" />
                      Waves News & Announcements
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        window.open("https://waves-community.vercel.app", "_blank");
                        triggerToast("Đang mở Waves Community");
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md text-xs text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.2)] active:scale-95 bouncy-btn"
                    >
                      <Globe className="w-3.5 h-3.5 text-rose-300" />
                      <span className="hidden sm:inline">waves-community.vercel.app</span>
                      <span className="sm:hidden">Web</span>
                    </button>
                    <button
                      onClick={() => {
                        window.open("https://discord.gg/waves", "_blank");
                        triggerToast("Đang mở Waves Community Discord");
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-[#5865F2]/90 hover:bg-[#5865F2] border border-[#5865F2]/40 backdrop-blur-md text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#5865F2]/25 active:scale-95 bouncy-btn"
                    >
                      <DiscordIcon className="w-3.5 h-3.5" />
                      <span>Discord</span>
                    </button>
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Tin tức & Thông báo
                </h1>
                
                <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed">
                  Cập nhật các thông tin chính thức về hành trình phát triển và thông báo của Waves Community.
                </p>
              </div>

              {/* Subtle liquid ambient behind */}
              <div className="absolute right-0 bottom-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Search Bar matching Float Search design */}
            <div className="relative w-full h-[44px] flex items-center px-4 rounded-full spotlight-bubble-box search-box-capsule float-search-style text-xs transition-all border-0">
              <Search className="w-4.5 h-4.5 text-white stroke-[2.4] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] shrink-0 mr-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="w-full bg-transparent text-sm text-white placeholder-white/60 focus:outline-none font-semibold truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] border-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer shrink-0 ml-1"
                  title="Xóa tìm kiếm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* News Articles Vertical Stack - Pure Liquid Glass, Entire Card Clickable, No Buttons / Tags / Author */}
            <div className="flex flex-col gap-4">
              {filteredNews.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setReadingArticleId(item.id)}
                  className="bg-white/[0.08] backdrop-blur-[24px] saturate-[180%] rounded-[22px] p-6 sm:p-7 shadow-[0_8px_32px_0_rgba(0,0,0,0.2),inset_0_1px_1px_0_rgba(255,255,255,0.25)] border border-white/15 hover:border-rose-400/40 hover:bg-white/[0.13] transition-all duration-300 cursor-pointer group relative overflow-hidden"
                >
                  {/* Subtle specular top highlight */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-white/50 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-rose-400/80" />
                        <span>{item.date}</span>
                      </div>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug group-hover:text-rose-200 transition-colors">
                      {item.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-sans">
                      {item.excerpt}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {filteredNews.length === 0 && (
              <div className="text-center py-16 bg-white/[0.06] backdrop-blur-[24px] rounded-[20px] border border-white/15 space-y-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.15)]">
                <p className="text-sm font-semibold text-white/70">Không tìm thấy bài viết phù hợp</p>
                <p className="text-xs text-white/40">Vui lòng thử từ khóa tìm kiếm khác.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsView;
