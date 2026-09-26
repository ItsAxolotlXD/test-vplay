import React, { useState, useEffect } from 'react';
import { DiscordEventSection } from '../components/DiscordEventSection';
import { Calendar, Users, MessageSquare, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

interface EventPageProps {
  navigate: (route: string, state?: any) => void;
}

export const EventPage: React.FC<EventPageProps> = ({ navigate }) => {
  // 1. Scroll listener for banner gradual fade out when scrolling down
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // When scrolling down, banner gradually fades out and disappears
  const fadeThreshold = 360;
  const bannerOpacity = Math.max(0, 1 - scrollY / fadeThreshold);
  const bannerScale = Math.max(0.92, 1 - (scrollY / fadeThreshold) * 0.08);
  const bannerTranslateY = Math.min(scrollY * 0.25, 60);

  // 2. Pure Clock Countdown to 00h00 1/1/2030 (chỉ nguyên clock ko có text linh tinh đi kèm)
  const [clockTime, setClockTime] = useState(() => {
    const target = new Date('2030-01-01T00:00:00').getTime();
    const diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, mins, secs };
  });

  useEffect(() => {
    const target = new Date('2030-01-01T00:00:00').getTime();
    const timer = setInterval(() => {
      const diff = Math.max(0, target - Date.now());
      setClockTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-screen pb-20 select-none space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Big Banner Đầu Trang: Chiếm 1 nửa trang (50vh) và dần dần biến mất khi kéo xuống */}
      <section 
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-2 sm:pt-4 transition-all duration-150 ease-out will-change-transform"
        style={{
          opacity: bannerOpacity,
          transform: `scale(${bannerScale}) translateY(-${bannerTranslateY}px)`,
          pointerEvents: bannerOpacity <= 0.05 ? 'none' : 'auto',
          visibility: bannerOpacity <= 0 ? 'hidden' : 'visible',
        }}
      >
        <div className="relative w-full h-[50vh] min-h-[320px] max-h-[580px] overflow-hidden rounded-2xl sm:rounded-[32px] border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.6)] bg-[#121217] group">
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/0/0a/Event_banner.png/revision/latest/scale-to-width-down/1000?cb=20260926173844"
            alt="VNRT Online Event Banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        </div>
      </section>

      {/* 2. Clock Countdown: Chỉ nguyên clock ko có text linh tinh đi kèm */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-1 sm:py-2">
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 md:gap-4 font-mono font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white select-none">
          <div className="px-3.5 sm:px-6 py-2 sm:py-4 rounded-2xl bg-white/[0.06] border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md tabular-nums min-w-[70px] sm:min-w-[110px] text-center">
            {clockTime.days}
          </div>
          <span className="text-red-500/80 font-bold animate-pulse">:</span>
          <div className="px-3 sm:px-5 py-2 sm:py-4 rounded-2xl bg-white/[0.06] border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md tabular-nums min-w-[54px] sm:min-w-[90px] text-center">
            {String(clockTime.hours).padStart(2, '0')}
          </div>
          <span className="text-red-500/80 font-bold animate-pulse">:</span>
          <div className="px-3 sm:px-5 py-2 sm:py-4 rounded-2xl bg-white/[0.06] border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md tabular-nums min-w-[54px] sm:min-w-[90px] text-center">
            {String(clockTime.mins).padStart(2, '0')}
          </div>
          <span className="text-red-500/80 font-bold animate-pulse">:</span>
          <div className="px-3 sm:px-5 py-2 sm:py-4 rounded-2xl bg-white/[0.06] border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md tabular-nums min-w-[54px] sm:min-w-[90px] text-center text-red-400">
            {String(clockTime.secs).padStart(2, '0')}
          </div>
        </div>
      </section>

      {/* 3. Logo Web & Nút Gathering Y Như ở Home Page (Bên dưới banner & countdown, không có nền) */}
      <section className="w-full">
        <DiscordEventSection navigate={navigate} />
      </section>

      {/* 4. Event Information & Discord Community Cards */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Về sự kiện Gathering */}
          <div className="rounded-2xl sm:rounded-3xl bg-white/[0.04] border border-white/10 p-5 sm:p-6 backdrop-blur-md hover:border-white/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
              VNRT Gathering 2030
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Sự kiện hội ngộ cộng đồng truyền hình trực tuyến VNRT Online quy mô lớn với nhiều hoạt động giao lưu, chia sẻ kho lưu trữ và giải thưởng hấp dẫn.
            </p>
          </div>

          {/* Card 2: Discord Waves */}
          <div className="rounded-2xl sm:rounded-3xl bg-white/[0.04] border border-white/10 p-5 sm:p-6 backdrop-blur-md hover:border-white/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#5865F2]/20 text-[#5865F2] flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
              Phòng Chat & Voice Discord
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Tham gia máy chủ Discord chính thức của Waves để nhận thông báo sớm nhất, thảo luận cùng các thành viên và tham gia các mini-game độc quyền.
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => window.open('https://discord.gg/wcdjaDDayK', '_blank', 'noopener,noreferrer')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              >
                <span>Mở máy chủ Discord</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Đặc quyền thành viên */}
          <div className="rounded-2xl sm:rounded-3xl bg-white/[0.04] border border-white/10 p-5 sm:p-6 backdrop-blur-md hover:border-white/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
              Phần thưởng & Kỷ niệm
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Tất cả các tài khoản tham dự sự kiện sẽ nhận huy hiệu vinh danh, điểm Orbs thưởng và quyền truy cập sớm các tính năng Spatial Glass thế hệ mới.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
