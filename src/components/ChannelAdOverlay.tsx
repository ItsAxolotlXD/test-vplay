import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

interface ChannelAdOverlayProps {
  isOpen: boolean;
  channelName: string;
  onAdComplete: () => void;
}

const AD_SPONSORS = [
  {
    brand: 'Spatial Glass 2026',
    tagline: 'Kỷ nguyên hiển thị không gian ba chiều đa giác quan',
    description: 'Trải nghiệm giao diện Spatial Glass mượt mà với công nghệ khúc xạ ánh sáng tiên tiến nhất.',
    cta: 'Khám phá Spatial Glass',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#388BFD',
  },
  {
    brand: 'VinFast VF 3 - Năng lượng thế hệ mới',
    tagline: 'Xe điện đô thị thông minh dành riêng cho người Việt',
    description: 'Bứt phá mọi giới hạn đô thị với thiết kế cá tính, sạc siêu tốc và công nghệ trợ lái thông minh.',
    cta: 'Đăng ký lái thử ngay',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#22C55E',
  },
  {
    brand: 'Viettel 5G - Siêu tốc độ tương lai',
    tagline: 'Phủ sóng toàn quốc, tốc độ vượt trội không độ trễ',
    description: 'Xem truyền hình 4K HDR siêu mượt, livestream trực tiếp không gián đoạn mọi lúc mọi nơi.',
    cta: 'Nâng cấp gói cước 5G',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#EF4444',
  },
];

export const ChannelAdOverlay: React.FC<ChannelAdOverlayProps> = ({
  isOpen,
  channelName,
  onAdComplete,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [adMuted, setAdMuted] = useState(false);
  const [currentSponsor] = useState(() => {
    return AD_SPONSORS[Math.floor(Math.random() * AD_SPONSORS.length)];
  });

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(5);
      return;
    }

    setSecondsLeft(5);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const progressPercent = ((5 - secondsLeft) / 5) * 100;

  return (
    <AnimatePresence>
      <motion.div
        id="channel-ad-interstitial-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 z-40 bg-black/95 flex flex-col justify-between overflow-hidden select-none"
      >
        {/* Ad Background Poster / Image with Ken Burns zoom effect */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img
            src={currentSponsor.imageUrl}
            alt={currentSponsor.brand}
            className="w-full h-full object-cover opacity-35 scale-105 animate-pulse"
            style={{ animationDuration: '6s' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        </div>

        {/* Top Header Row */}
        <div className="p-4 sm:p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-yellow-400 text-black shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-black" />
              <span>Quảng cáo</span>
            </span>
            <div className="text-xs text-white/80 hidden sm:flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Tài trợ cho kênh {channelName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setAdMuted(!adMuted)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors cursor-pointer"
              title={adMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
            >
              {adMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Countdown Badge & User-Initiated Skip */}
            <div className="flex items-center gap-2">
              {secondsLeft > 0 ? (
                <div className="px-3.5 py-1.5 rounded-full bg-black/70 border border-white/20 backdrop-blur-md text-white font-mono text-xs font-bold flex items-center gap-1.5">
                  <span className="text-yellow-400 font-black">{secondsLeft}s</span>
                  <span className="text-white/60">• Có thể bỏ qua sau {secondsLeft}s</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onAdComplete}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 text-black font-black text-xs hover:brightness-110 transition-all shadow-[0_0_20px_rgba(250,204,21,0.6)] cursor-pointer flex items-center gap-2 animate-pulse"
                >
                  <span>Bỏ qua quảng cáo</span>
                  <span className="text-sm font-black">→</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Center Content: Brand Highlight */}
        <div className="px-6 sm:px-10 py-4 max-w-2xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold mb-3 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Đối tác chính thức VNRT Online</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-snug drop-shadow-md">
            {currentSponsor.brand}
          </h2>
          <p className="text-sm sm:text-base font-semibold text-yellow-300 mt-1 drop-shadow">
            {currentSponsor.tagline}
          </p>
          <p className="text-xs sm:text-sm text-zinc-300 mt-2 line-clamp-2 max-w-xl leading-relaxed">
            {currentSponsor.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {secondsLeft === 0 ? (
              <button
                type="button"
                onClick={onAdComplete}
                className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-black text-black bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/40 cursor-pointer"
              >
                <span>Bỏ qua quảng cáo và vào xem {channelName}</span>
                <span className="text-sm font-black">→</span>
              </button>
            ) : (
              <div className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-white/80 bg-white/10 border border-white/10 flex items-center gap-2">
                <span>Nút bỏ qua sẽ sẵn sàng sau {secondsLeft} giây</span>
              </div>
            )}
            <button
              type="button"
              onClick={onAdComplete}
              className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-blue-600/80 hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              <span>{currentSponsor.cta}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Progress Bar: 5s duration linear depletion */}
        <div className="w-full relative z-10">
          <div className="w-full h-1.5 bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 transition-all duration-300 ease-linear shadow-[0_0_8px_rgba(250,204,21,0.8)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="py-2 px-4 bg-black/80 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
            <span>
              {secondsLeft === 0 
                ? "SẴN SÀNG: BẤM NÚT 'BỎ QUA QUẢNG CÁO' ĐỂ TIẾP TỤC VÀO KÊNH" 
                : "QUẢNG CÁO TÀI TRỢ KÊNH (1 AD MỖI 5 KÊNH)"}
            </span>
            <span>00:0{secondsLeft} / 00:05</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
