import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface DiscordEventSectionProps {
  navigate?: (route: string, state?: any) => void;
  className?: string;
  showOpenEventTab?: boolean;
}

export const DiscordEventSection: React.FC<DiscordEventSectionProps> = ({
  navigate,
  className = '',
  showOpenEventTab = false
}) => {
  // Countdown to 00h00 1/1/2030 for Discord Event Chat Bubble
  const [eventCountdown, setEventCountdown] = useState(() => {
    const target = new Date('2030-01-01T00:00:00').getTime();
    const diff = Math.max(0, target - Date.now());
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      secs: Math.floor((diff % (1000 * 60)) / 1000),
    };
  });

  useEffect(() => {
    const target = new Date('2030-01-01T00:00:00').getTime();
    const timer = setInterval(() => {
      const diff = Math.max(0, target - Date.now());
      setEventCountdown({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleJoinDiscord = () => {
    window.open('https://discord.gg/wcdjaDDayK', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 select-none ${className}`}>
      {/* Side-by-side flex layout for Logo and Gathering Event Group (Nền đã được bỏ theo yêu cầu) */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-12 py-3 sm:py-5">
        {/* 1. Official VNRT Logo (Phóng to sắc nét) */}
        <div className="shrink-0 flex items-center justify-center">
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/5/51/New_official_vnrt_logo.png/revision/latest?cb=20260926162432"
            alt="VNRT Online"
            referrerPolicy="no-referrer"
            className="h-20 sm:h-28 md:h-36 lg:h-40 w-auto max-w-[85vw] sm:max-w-[420px] md:max-w-[480px] object-contain drop-shadow-[0_8px_32px_rgba(0,0,0,0.65)] transition-transform hover:scale-105 duration-300"
          />
        </div>

        {/* 2. Gathering Discord Event Group bên cạnh Logo */}
        <div className="flex flex-col items-center justify-center">
          {/* Chat Bubble màu đỏ: "Event starts in <a>h <b>mins <c> seconds" */}
          <div className="relative mb-2.5 sm:mb-3 flex items-center justify-center animate-bounce [animation-duration:2.5s]">
            <div className="bg-red-600 text-white font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-[0_4px_16px_rgba(220,38,38,0.45)] border border-red-300/40 flex items-center justify-center gap-1.5 tracking-tight whitespace-nowrap">
              <span>Event starts in {eventCountdown.hours}h {eventCountdown.mins}mins {eventCountdown.secs} seconds</span>
            </div>
            {/* Chat bubble tail pointing down */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-red-600 rotate-45 border-r border-b border-red-300/40" />
          </div>

          {/* Action buttons: Gathering Discord Event and Open Event Tab */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {/* Nút placeholder Gathering Discord Event (style, opacity & blur giống thanh top view) */}
            <button
              type="button"
              onClick={handleJoinDiscord}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
              className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-2.5 sm:px-8 sm:py-3 rounded-full border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/20 text-white font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:bg-white/30 active:scale-95 cursor-pointer select-none"
            >
              <span>Gathering Discord Event</span>
            </button>

            {/* Nút "Open Event Tab" */}
            {showOpenEventTab && navigate && (
              <button
                type="button"
                id="btn-open-event-tab"
                onClick={() => navigate('/event')}
                style={{
                  backgroundColor: 'rgba(230, 0, 90, 0.3)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
                className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3 rounded-full border border-pink-400/50 shadow-[0_8px_32px_rgba(230,0,90,0.35)] ring-1 ring-pink-400/30 text-white font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:bg-[#E6005A]/45 active:scale-95 cursor-pointer select-none"
              >
                <Sparkles className="w-4 h-4 text-pink-300 group-hover:rotate-12 transition-transform" />
                <span>Open Event Tab</span>
                <ArrowRight className="w-4 h-4 text-pink-200 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>

          {/* Dòng desc placeholder bên dưới nút */}
          <p className="mt-2 text-xs sm:text-sm text-white/70 tracking-wide font-normal select-none text-center">
            Test placeholder stuff nothing to see here.
          </p>
        </div>
      </div>
    </div>
  );
};
