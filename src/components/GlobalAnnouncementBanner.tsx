import React from 'react';
import { Megaphone } from 'lucide-react';

interface GlobalAnnouncementBannerProps {
  onExplore?: () => void;
}

export const GlobalAnnouncementBanner: React.FC<GlobalAnnouncementBannerProps> = React.memo(({ onExplore }) => {
  return (
    <div
      id="global-announcement-banner"
      data-testid="global-announcement-banner"
      className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 text-zinc-950 px-3 sm:px-4 py-2.5 sm:py-3 shadow-md shadow-amber-500/15 border-b border-amber-500/50 select-none relative z-30 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
        {/* Message */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 min-w-0">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black/15 text-zinc-950 shrink-0 shadow-inner">
            <Megaphone className="w-3.5 h-3.5 fill-current" />
          </span>
          <p className="text-xs sm:text-sm font-black tracking-tight text-zinc-950 leading-snug">
            The next chapters are here. Vplay is becoming VNRT Online starting October 16, 2026.
          </p>
        </div>
      </div>
    </div>
  );
});
