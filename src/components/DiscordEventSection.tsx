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
  // Countdown to 00h00 1/1/2030 for Discord Event
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
      {/* Khối banner gathering event có layout và style giống khối banner copilot is coming to VNRT Online */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#1A1A20] via-[#241C2B] to-[#1A1A20] border border-[#3E344A] p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-[#5865F2]/25 to-[#E6005A]/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8 justify-between">
          {/* Thumbnail Image */}
          <div className="relative w-full md:w-[320px] lg:w-[380px] h-[190px] sm:h-[220px] rounded-[20px] overflow-hidden shrink-0 border border-white/10 shadow-lg group">
            <img
              src="https://static.wikia.nocookie.net/ep-deo/images/0/0a/Event_banner.png/revision/latest/scale-to-width-down/1000?cb=20260926173844"
              alt="Gathering Discord Event - VNRT Online"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://static.wikia.nocookie.net/ep-deo/images/5/51/New_official_vnrt_logo.png/revision/latest?cb=20260926162432";
                target.className = "w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 bg-[#15151A]";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white">
                <svg className="w-4 h-4 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>Discord Gathering</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5865F2]/30 border border-[#5865F2]/50 text-[10px] font-mono font-bold text-[#A5B4FC]">
                01/01/2030
              </span>
            </div>
          </div>

          {/* Banner Content */}
          <div className="flex-1 space-y-3.5 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5865F2]/15 border border-[#5865F2]/30 text-xs font-semibold text-[#818CF8]">
                <Sparkles className="w-3.5 h-3.5 text-[#818CF8]" />
                <span>DISCORD COMMUNITY GATHERING</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-[11px] font-bold text-red-200">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>Starts in {eventCountdown.hours}h {eventCountdown.mins}m {eventCountdown.secs}s</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Gathering Discord Event
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl font-normal">
              Tham gia đại sự kiện hội ngộ cộng đồng truyền hình trực tuyến VNRT Online trên máy chủ Discord! Cùng đếm ngược tới thời khắc hội tụ 2030, giao lưu kết nối và nhận các đặc quyền lưu trữ độc quyền.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                id="btn-gathering-discord-join"
                onClick={handleJoinDiscord}
                className="flex items-center gap-2.5 px-6 py-3 rounded-[30px] bg-gradient-to-r from-[#5865F2] via-[#6366F1] to-[#4F46E5] hover:from-[#6366F1] hover:to-[#5865F2] text-white text-sm font-bold shadow-[0_4px_20px_rgba(88,101,242,0.4)] hover:shadow-[0_6px_25px_rgba(88,101,242,0.6)] transition-all cursor-pointer group"
              >
                <svg className="w-4 h-4 object-contain shrink-0 group-hover:scale-110 transition-transform duration-300 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>Gathering Discord Event</span>
              </button>

              {showOpenEventTab && navigate && (
                <button
                  type="button"
                  id="btn-gathering-open-event-tab"
                  onClick={() => navigate('/event')}
                  className="px-5 py-3 rounded-[30px] bg-[#2A2A33] hover:bg-[#34343F] text-zinc-200 text-sm font-semibold border border-white/10 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span>Mở Tab Event</span>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
