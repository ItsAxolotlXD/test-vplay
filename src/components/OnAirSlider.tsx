import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Channel } from '../types';

interface OnAirSliderProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
  navigate: (route: string) => void;
  title?: string;
}

export const OnAirSlider: React.FC<OnAirSliderProps> = ({
  channels,
  onSelectChannel,
  navigate,
  title = 'Đề xuất cho bạn'
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Chỉ hiển thị các kênh VTV trong chuyên mục Đang phát sóng
  const vtvChannels = channels.filter((ch) => {
    const isCategoryVtv = ch.category === 'Kênh VTV' || ch.category === 'VTV';
    const isVtvName = ch.name.toUpperCase().startsWith('VTV') && !ch.name.toUpperCase().includes('VTVCAB');
    const isVtvId = ch.id.toLowerCase().startsWith('vtv') && !ch.id.toLowerCase().includes('vtvcab');
    return isCategoryVtv || isVtvName || isVtvId;
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -360 : 360;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full">
      {/* Header with Title & Slider Controls matching image */}
      <div className="flex items-center justify-between mb-3.5 sm:mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#E6005A] shrink-0" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>{title}</span>
          </h2>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#353535] hover:bg-[#424242] border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Cuộn sang trái"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#353535] hover:bg-[#424242] border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Cuộn sang phải"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Cards Scroll - chỉ hiển thị các kênh VTV */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth"
      >
        {vtvChannels.map((ch) => {
          const isVtv2 = ch.id === 'vtv2' || ch.slug === 'vtv2' || ch.name.toLowerCase() === 'vtv2';

          return (
            <button
              key={ch.id}
              id={`onair-channel-${ch.id}`}
              onClick={() => {
                onSelectChannel(ch);
                navigate(`/live-tv?channel=${ch.slug || ch.id}`);
              }}
              className="w-24 sm:w-28 h-13 sm:h-15 rounded-xl sm:rounded-2xl p-2 flex flex-col items-center justify-center cursor-pointer bg-[#353535] hover:bg-[#424242] relative group border border-white/10 hover:border-white/30 active:border-white shrink-0 shadow-md transition-all"
              title={`${ch.name} - ${ch.currentProgram?.title || 'Đang phát sóng'}`}
            >
              {/* Channel Logo */}
              <img
                src={ch.logo}
                alt={ch.name}
                className={`object-contain select-none pointer-events-none ${
                  isVtv2
                    ? 'h-6 sm:h-7 w-auto max-w-[78%]'
                    : 'h-8 sm:h-9 w-auto max-w-[88%]'
                }`}
                referrerPolicy="no-referrer"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
};
