import React, { useRef } from 'react';
import { Play, Radio, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full">
      {/* Header with Title & Slider Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF2020] animate-ping" />
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Đang phát sóng
          </h2>
          <span className="text-xs text-[#8E8E93] font-medium hidden sm:inline-block">
            (Chương trình trực tiếp theo thời gian thực)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-[#222226] hover:bg-[#2F2F36] border border-[#34343C] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors"
            aria-label="Cuộn sang trái"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-[#222226] hover:bg-[#2F2F36] border border-[#34343C] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors"
            aria-label="Cuộn sang phải"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Cards Scroll */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
      >
        {channels.map((ch) => (
          <div
            key={ch.id}
            onClick={() => {
              onSelectChannel(ch);
              navigate(`/live-tv?channel=${ch.slug}`);
            }}
            className="min-w-[280px] sm:min-w-[320px] rounded-[26px] bg-[#1E1E22] border border-[#2D2D35] hover:border-[#C83DFF]/60 hover:bg-[#25252C] transition-all p-4 cursor-pointer group shadow-lg flex flex-col justify-between"
          >
            {/* Top row: Channel Logo + Live badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#141416] border border-white/10 flex items-center justify-center p-1 overflow-hidden">
                  <img
                    src={ch.logo}
                    alt={ch.name}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-[#C83DFF] transition-colors truncate block">
                    {ch.shortName || ch.name}
                  </span>
                  <span className="text-[10px] text-[#8E8E93]">{ch.category}</span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-[#FF2020]/20 text-[#FF4D4D] border border-[#FF2020]/40 text-[10px] font-extrabold flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                <span>LIVE</span>
              </span>
            </div>

            {/* Program Title & Description */}
            <div className="mb-3">
              <h4 className="text-sm font-bold text-white group-hover:text-[#C83DFF] transition-colors line-clamp-1">
                {ch.currentProgram?.title}
              </h4>
              <p className="text-xs text-[#9CA3AF] line-clamp-2 mt-1 leading-relaxed">
                {ch.currentProgram?.description}
              </p>
            </div>

            {/* Progress Bar & Time */}
            <div className="pt-2 border-t border-[#2A2A30]">
              <div className="flex items-center justify-between text-[10px] text-[#8E8E93] mb-1 font-mono">
                <span>{ch.currentProgram?.startTime}</span>
                <span className="text-white font-semibold">{ch.currentProgram?.progress}% đã phát</span>
                <span>{ch.currentProgram?.endTime}</span>
              </div>
              <div className="w-full bg-[#2A2A32] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#FF2020] to-[#C83DFF] h-full rounded-full"
                  style={{ width: `${ch.currentProgram?.progress || 50}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
