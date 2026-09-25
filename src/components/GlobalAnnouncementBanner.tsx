import React from 'react';
import { Megaphone, Clock, Sparkles } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';

interface GlobalAnnouncementBannerProps {
  onExplore?: () => void;
}

export const GlobalAnnouncementBanner: React.FC<GlobalAnnouncementBannerProps> = React.memo(({ onExplore }) => {
  const countdown = useCountdown();

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div
      id="global-announcement-banner"
      data-testid="global-announcement-banner"
      className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 text-zinc-950 px-3 sm:px-4 py-2.5 sm:py-3 shadow-md shadow-amber-500/15 border-b border-amber-500/50 select-none relative z-30 transition-all"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-3 text-center md:text-left">
        {/* Left / Center Message */}
        <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-2.5 min-w-0">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black/15 text-zinc-950 shrink-0 shadow-inner">
            <Megaphone className="w-3.5 h-3.5 fill-current" />
          </span>
          <p className="text-xs sm:text-sm font-black tracking-tight text-zinc-950 leading-snug">
            The next chapters are here. Vplay is becoming VNRT Online starting October 16, 2026.
          </p>
        </div>

        {/* Right Countdown Clock Display */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950 text-amber-300 shadow-md border border-zinc-900/30 text-xs font-mono font-black tracking-wide">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
            <span className="text-[10px] text-zinc-300 uppercase font-sans font-extrabold mr-0.5 tracking-wider hidden sm:inline">
              Đếm ngược 00h00 16/10/2026:
            </span>
            <span className="text-[10px] text-zinc-300 uppercase font-sans font-extrabold mr-0.5 tracking-wider sm:hidden">
              Còn:
            </span>

            <span className="text-white font-bold">{countdown.days}</span>
            <span className="text-amber-400 text-[10px] font-sans font-black mr-1">ngày</span>

            <span className="text-white font-bold">{pad(countdown.hours)}</span>
            <span className="text-amber-400 text-[10px] font-sans font-black mr-1">giờ</span>

            <span className="text-white font-bold">{pad(countdown.minutes)}</span>
            <span className="text-amber-400 text-[10px] font-sans font-black mr-1">phút</span>

            <span className="text-white font-bold">{pad(countdown.seconds)}</span>
            <span className="text-amber-400 text-[10px] font-sans font-black">giây</span>
          </div>
        </div>
      </div>
    </div>
  );
});
