import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Radio } from 'lucide-react';
import { Channel } from '../types';

interface OnAirSliderProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
  navigate: (route: string) => void;
}

export const OnAirSlider: React.FC<OnAirSliderProps> = ({
  channels,
  onSelectChannel,
  navigate
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
      {/* Header with Title & Slider Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-5 bg-[#FF2020] rounded-full shrink-0" />
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Đang phát sóng</span>
            <span className="text-sm font-semibold text-[#8E8B99]">({vtvChannels.length})</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-[#222226] hover:bg-[#2F2F36] border border-[#34343C] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
            aria-label="Cuộn sang trái"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-[#222226] hover:bg-[#2F2F36] border border-[#34343C] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
            aria-label="Cuộn sang phải"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Cards Scroll - chỉ hiển thị các kênh VTV */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-2 no-scrollbar scroll-smooth"
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
              className="w-24 sm:w-28 h-13 sm:h-15 rounded-xl p-1.5 flex flex-col items-center justify-center cursor-pointer bg-[#2D1A25]/90 hover:bg-[#3A2231] relative group border-2 border-transparent hover:border-white active:border-white shrink-0 shadow-md"
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

              {/* Subtle Live pulse dot */}
              <span className="absolute top-1 right-1.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
