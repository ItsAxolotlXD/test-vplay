import React from 'react';
import { Clock, Calendar, Sparkles, Rocket, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useCountdown, TRANSITION_TARGET_DATE } from '../hooks/useCountdown';

interface HomeCountdownWidgetProps {
  navigate?: (path: string) => void;
}

export const HomeCountdownWidget: React.FC<HomeCountdownWidgetProps> = ({ navigate }) => {
  const countdown = useCountdown();

  const pad = (n: number) => String(n).padStart(2, '0');

  // Milestone target date formatted
  const targetDateLabel = '00:00:00 • Thứ Sáu, 16/10/2026';

  return (
    <div
      id="home-countdown-transition-widget"
      className="relative overflow-hidden rounded-[24px] sm:rounded-[30px] bg-gradient-to-br from-amber-500/10 via-[#18181B]/80 to-purple-900/15 border border-amber-500/30 p-5 sm:p-7 md:p-8 shadow-[0_10px_35px_rgba(245,158,11,0.12)] backdrop-blur-xl transition-all duration-300 group select-none"
    >
      {/* Decorative background ambient glows */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-gradient-to-tr from-rose-500/15 to-purple-600/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 lg:gap-8">
        {/* Left Side: Title & Description */}
        <div className="space-y-3 max-w-xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Kỷ Nguyên Mới • VNRT Online</span>
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white font-['Integer','Inter',sans-serif] leading-tight">
            Đếm Ngược Thời Khắc Chuyển Giao
          </h3>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <span className="font-semibold text-amber-300">Vplay</span> sẽ chính thức hoàn tất quá trình nâng cấp toàn diện và chuyển giao thương hiệu sang{' '}
            <span className="font-bold text-white">VNRT Online</span> vào lúc{' '}
            <span className="font-semibold text-amber-200 underline decoration-amber-400/50 underline-offset-2">00h00 ngày 16/10/2026</span>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-medium text-zinc-400">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{targetDateLabel}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10">
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span>Spatial Glass Architecture</span>
            </div>
          </div>
        </div>

        {/* Right Side: 4 Prominent Counter Blocks */}
        <div className="flex flex-col items-center lg:items-end gap-3 shrink-0">
          <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full sm:w-auto">
            {/* 1. NGÀY */}
            <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-black/60 border border-amber-400/30 shadow-inner min-w-[70px] sm:min-w-[84px] md:min-w-[92px] group/item hover:border-amber-400/60 transition-colors">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black font-mono text-white tracking-tight drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]">
                {countdown.days}
              </div>
              <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-400 mt-1">
                Ngày
              </div>
            </div>

            {/* 2. GIỜ */}
            <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-black/60 border border-amber-400/30 shadow-inner min-w-[70px] sm:min-w-[84px] md:min-w-[92px] group/item hover:border-amber-400/60 transition-colors">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black font-mono text-white tracking-tight drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]">
                {pad(countdown.hours)}
              </div>
              <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-400 mt-1">
                Giờ
              </div>
            </div>

            {/* 3. PHÚT */}
            <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-black/60 border border-amber-400/30 shadow-inner min-w-[70px] sm:min-w-[84px] md:min-w-[92px] group/item hover:border-amber-400/60 transition-colors">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black font-mono text-white tracking-tight drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]">
                {pad(countdown.minutes)}
              </div>
              <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-400 mt-1">
                Phút
              </div>
            </div>

            {/* 4. GIÂY */}
            <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-black/60 border border-amber-400/40 shadow-inner min-w-[70px] sm:min-w-[84px] md:min-w-[92px] group/item hover:border-amber-400/70 transition-colors relative overflow-hidden">
              <div className="absolute inset-0 bg-amber-400/5 animate-pulse pointer-events-none" />
              <div className="text-2xl sm:text-3xl md:text-4xl font-black font-mono text-amber-300 tracking-tight drop-shadow-[0_2px_10px_rgba(245,158,11,0.6)]">
                {pad(countdown.seconds)}
              </div>
              <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-400 mt-1">
                Giây
              </div>
            </div>
          </div>

          {/* Call to action & indicator */}
          {navigate && (
            <div className="flex items-center justify-between w-full pt-1 px-1">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Đồng hồ đếm thời gian thực</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/settings')}
                className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 transition-colors cursor-pointer group/btn"
              >
                <span>Xem thông tin</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
