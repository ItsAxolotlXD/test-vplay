import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Coins, 
  Copy, 
  Check, 
  Clock, 
  Gift,
  Star,
  LogIn,
  ArrowLeft,
  Layers,
  HelpCircle
} from 'lucide-react';
import { useOrbs } from '../hooks/useOrbs';
import { useAuth } from '../context/AuthContext';

interface EventPageProps {
  navigate: (route: string, state?: any) => void;
  initialSection?: 'all' | 'redeem' | 'countdown';
}

interface GiftReward {
  id: string;
  code: string;
  title: string;
  description: string;
  orbs: number;
  vipDays?: number;
  badge?: string;
  items: string[];
}

interface RedemptionRecord {
  code: string;
  title: string;
  orbs: number;
  vipDays?: number;
  badge?: string;
  items: string[];
  redeemedAt: string;
}

const REDEEMED_STORAGE_KEY = 'vplay_redeemed_gift_codes';

// Official 5x5 promo codes matching the Minecraft Redemption style
const OFFICIAL_PROMO_CODES: GiftReward[] = [
  {
    id: 'vnrt_welcome_5x5',
    code: 'VNRT1-ONLINE-GIFTS-2026X-FREE1',
    title: 'Gói Quà Tân Thủ VNRT ONLINE',
    description: 'Quà chào mừng thành viên mới khám phá hệ sinh thái phát thanh truyền hình trực tuyến.',
    orbs: 50000,
    vipDays: 30,
    badge: 'Tân Thủ Hoàng Gia',
    items: ['+50.000 Orbs Khoáng Vật', '30 Ngày V-Premium VIP', 'Huy hiệu Tân Thủ Hoàng Gia'],
  },
  {
    id: 'vnrt_minecraft_100k',
    code: 'MINEC-RAFTX-VNRT2-026OR-BS100',
    title: 'Kho Báu Minecraft Orbs Hoàng Gia',
    description: 'Gói nạp thưởng khoáng vật Orbs độc quyền phong cách Minecraft từ VNRT Media.',
    orbs: 100000,
    badge: 'Đại Gia Orbs',
    items: ['+100.000 Orbs Vàng', 'Danh hiệu Đại Gia Khoáng Vật', 'Thẻ cược VIP Copilot Arena'],
  },
  {
    id: 'vnrt_vvip_pass',
    code: 'VPLAY-VIP36-5DAYS-PASS2-026VN',
    title: 'Thẻ V-Premium VVIP 365 Ngày',
    description: 'Đặc quyền xem toàn bộ kênh phát thanh truyền hình 4K HDR & âm thanh Dolby Atmos không giới hạn.',
    orbs: 75000,
    vipDays: 365,
    badge: 'VVIP Member',
    items: ['365 Ngày V-Premium VVIP Toàn Năng', '+75.000 Orbs', 'Ưu tiên kết nối máy chủ phát sóng riêng'],
  },
  {
    id: 'vnrt_oct16_anniversary',
    code: 'OCT16-2026L-IVEST-REAMV-NRT99',
    title: 'Quà Kỷ Niệm 16/10/2026',
    description: 'Quà tặng sự kiện đếm ngược lịch sử chuyển giao thương hiệu VNRT ONLINE.',
    orbs: 200000,
    vipDays: 60,
    badge: 'Kỷ Nguyên Mới 2026',
    items: ['+200.000 Orbs Vàng', '60 Ngày V-Premium VIP', 'Hình nền Spatial Glass Độc Bản 16/10'],
  },
  {
    id: 'vnrt_space360_suite',
    code: 'SPACE-360AP-PSVNR-TGIFT-2026X',
    title: 'Bộ Siêu Ứng Dụng Space 360',
    description: 'Mở khóa đặc quyền sáng tạo tranh vẽ MS Paint, Sổ tay V-Notes và Minecraft Container.',
    orbs: 40000,
    items: ['+40.000 Orbs', 'Bộ màu vẽ Gold Metallic cho MS Paint', 'Skin Thám Hiểm Không Gian'],
  },
  // Legacy 4x4 codes supported for backward compatibility
  {
    id: 'vnrt_welcome_legacy',
    code: 'VNRT-2026-GIFT-FREE',
    title: 'Gói Quà Tân Thủ Classic',
    description: 'Mã tân thủ phiên bản 4x4 truyền thống.',
    orbs: 50000,
    vipDays: 30,
    badge: 'Tân Thủ Classic',
    items: ['+50.000 Orbs Khoáng Vật', '30 Ngày V-Premium VIP'],
  },
];

// Play celebratory chime sound
function playChimeSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.6);
    });
  } catch {}
}

export const EventPage: React.FC<EventPageProps> = ({ 
  navigate,
  initialSection = 'all'
}) => {
  const { orbs, addOrbs } = useOrbs();
  const { isAuthenticated, openAuthModal } = useAuth();
  
  // Redeem state
  const [codeInput, setCodeInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRedeeming, setIsRedeeming] = useState<boolean>(false);
  const [claimedReward, setClaimedReward] = useState<RedemptionRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showPromoDrawer, setShowPromoDrawer] = useState<boolean>(false);
  const [history, setHistory] = useState<RedemptionRecord[]>(() => {
    try {
      const raw = localStorage.getItem(REDEEMED_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Pure Clock Countdown to 00h00 1/1/2030 (Event will start in)
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

  // Auto-format input to 5x5 code format: XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const rawVal = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const truncated = rawVal.slice(0, 25);
    const parts: string[] = [];
    for (let i = 0; i < truncated.length; i += 5) {
      parts.push(truncated.slice(i, i + 5));
    }
    setCodeInput(parts.join('-'));
  };

  const handleSelectSampleCode = (code: string) => {
    setCodeInput(code);
    setErrorMsg(null);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
    inputRef.current?.focus();
  };

  const handleRedeem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const cleanCode = codeInput.trim().toUpperCase();

    if (!cleanCode) {
      setErrorMsg('VUI LÒNG NHẬP MÃ QUÀ TẶNG CỦA BẠN (PLEASE ENTER YOUR CODE).');
      return;
    }

    const regex5x5 = /^[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/;
    const regex4x4 = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

    if (!regex5x5.test(cleanCode) && !regex4x4.test(cleanCode)) {
      setErrorMsg('MÃ KHÔNG ĐÚNG ĐỊNH DẠNG 5X5 (XXXXX-XXXXX-XXXXX-XXXXX-XXXXX). VUI LÒNG KIỂM TRA LẠI.');
      return;
    }

    const alreadyRedeemed = history.some((h) => h.code === cleanCode);
    if (alreadyRedeemed) {
      const rec = history.find((h) => h.code === cleanCode);
      setErrorMsg(`MÃ "${cleanCode}" ĐÃ ĐƯỢC KÍCH HOẠT VÀO LÚC ${rec?.redeemedAt || 'TRƯỚC ĐÓ'}.`);
      return;
    }

    setIsRedeeming(true);

    setTimeout(() => {
      setIsRedeeming(false);

      let matched = OFFICIAL_PROMO_CODES.find((c) => c.code === cleanCode);

      if (!matched && (regex5x5.test(cleanCode) || cleanCode.startsWith('VNRT-'))) {
        let hash = 0;
        for (let i = 0; i < cleanCode.length; i++) {
          hash = (hash << 5) - hash + cleanCode.charCodeAt(i);
          hash |= 0;
        }
        const dynamicOrbs = Math.abs(hash % 50000) + 25000;
        matched = {
          id: `custom_${cleanCode}`,
          code: cleanCode,
          title: 'Gói Quà Đặc Quyền VNRT ONLINE',
          description: 'Quà tặng quà code trực tuyến ghi nhận từ máy chủ sự kiện VNRT.',
          orbs: dynamicOrbs,
          vipDays: 14,
          badge: 'VNRT Member',
          items: [
            `+${dynamicOrbs.toLocaleString()} Orbs Khoáng Vật`,
            '14 Ngày V-Premium VIP',
            'Huy hiệu VNRT Special Member'
          ],
        };
      }

      if (!matched) {
        setErrorMsg('MÃ QUÀ TẶNG KHÔNG TỒN TẠI HOẶC ĐÃ HẾT HẠN. HÃY THỬ MỘT MÃ QUÀ MẪU CỦA VNRT!');
        return;
      }

      addOrbs(matched.orbs);

      const nowStr = new Date().toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      const newRecord: RedemptionRecord = {
        code: matched.code,
        title: matched.title,
        orbs: matched.orbs,
        vipDays: matched.vipDays,
        badge: matched.badge,
        items: matched.items,
        redeemedAt: nowStr
      };

      const updatedHistory = [newRecord, ...history];
      setHistory(updatedHistory);
      try {
        localStorage.setItem(REDEEMED_STORAGE_KEY, JSON.stringify(updatedHistory));
      } catch {}

      playChimeSound();
      setClaimedReward(newRecord);
      setCodeInput('');
    }, 700);
  };

  const scrollToSection = (id: string) => {
    try {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch {}
  };

  return (
    <div 
      style={{ borderRadius: 0 }}
      className="redeem-page-root event-page-root w-full min-h-screen bg-[#181818] text-white select-none overflow-x-hidden rounded-none border-none shadow-none pb-28 animate-in fade-in duration-200"
    >
      {/* =========================================================================
          TOP BREADCRUMB / STATUS BAR (FULL WIDTH, 0% RADIUS CORNERS)
          ========================================================================= */}
      <div 
        style={{ borderRadius: 0 }}
        className="w-full bg-[#200E05] border-b-2 border-black/80 px-4 sm:px-8 py-2.5 flex items-center justify-between z-20 relative select-none rounded-none"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{ borderRadius: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-black/60 hover:bg-black text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer border border-white/20 select-none shadow-sm active:translate-y-0.5"
            title="Quay lại Trang chủ"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-minecraft tracking-wider text-[11px] uppercase">TRANG CHỦ</span>
          </button>
          
          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
            <span 
              className="text-zinc-500 hover:text-amber-400 cursor-pointer transition-colors" 
              onClick={() => navigate('/')}
            >
              VNRT ONLINE
            </span>
            <span className="text-zinc-600">/</span>
            <span className="font-semibold text-white font-minecraft tracking-wide">EVENT & REDEEM GIFT</span>
          </div>
        </div>

        {/* Quick Orbs counter */}
        <div 
          style={{ borderRadius: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-black/60 border border-amber-400/40 text-amber-300 text-xs font-mono shadow-sm"
        >
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-zinc-300">Ví: <strong className="text-white font-bold">{orbs.toLocaleString()}</strong> Orbs</span>
        </div>
      </div>

      {/* =========================================================================
          TOP HERO SECTION: MINECRAFT ORANGE PIXEL BRICK WALL WITH RISING AMBER LIGHT BEAMS
          (LAYOUT VÀ STYLE TAB REDEEM - NỀN MÀU CAM THEO YÊU CẦU)
          ========================================================================= */}
      <div 
        style={{ borderRadius: 0 }}
        className="relative w-full overflow-hidden bg-[#B33E03] pt-12 sm:pt-16 pb-16 sm:pb-20 px-4 sm:px-6 flex flex-col items-center justify-center border-b-4 border-black rounded-none shadow-[inset_0_-10px_30px_rgba(0,0,0,0.5)]"
      >
        {/* SVG Minecraft Orange Brick Pattern Background (Fills full screen width) */}
        <div className="absolute inset-0 pointer-events-none opacity-95">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <defs>
              <pattern id="minecraft-orange-brick" width="64" height="32" patternUnits="userSpaceOnUse">
                {/* Background base deep burnt orange */}
                <rect width="64" height="32" fill="#993300" />

                {/* Top Brick 1: (0, 0, 62, 14) */}
                <rect x="0" y="0" width="62" height="14" fill="#C44405" />
                <rect x="2" y="2" width="28" height="10" fill="#DE5208" />
                <rect x="32" y="2" width="26" height="8" fill="#F16612" />
                <rect x="6" y="4" width="8" height="4" fill="#FA8028" />
                <rect x="42" y="4" width="10" height="4" fill="#FA8028" />

                {/* Staggered Row Bottom Brick: Left half (0, 16, 30, 14), Right half (32, 16, 30, 14) */}
                <rect x="0" y="16" width="30" height="14" fill="#C44405" />
                <rect x="2" y="18" width="26" height="10" fill="#DE5208" />
                <rect x="8" y="20" width="12" height="4" fill="#FA8028" />

                <rect x="32" y="16" width="30" height="14" fill="#C44405" />
                <rect x="34" y="18" width="26" height="10" fill="#F16612" />
                <rect x="44" y="20" width="10" height="4" fill="#FA8028" />

                {/* Mortar / Dark Burnt pixel lines between bricks */}
                <rect x="0" y="14" width="64" height="2" fill="#4A1400" />
                <rect x="0" y="30" width="64" height="2" fill="#4A1400" />
                <rect x="62" y="0" width="2" height="14" fill="#4A1400" />
                <rect x="30" y="16" width="2" height="14" fill="#4A1400" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#minecraft-orange-brick)" />
          </svg>
        </div>

        {/* Ambient vertical dark gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#3D1400]/60 via-transparent to-[#220B00]/85 pointer-events-none" />

        {/* Glowing Amber/Orange Rising Vertical Light Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-[3%] bottom-0 w-3.5 h-[62%] flex flex-col items-center justify-start">
            <div className="w-3.5 h-3.5 bg-[#FFB74D] shadow-[0_0_12px_#FF9100,0_0_24px_#FF6D00] shrink-0" />
            <div className="w-1.5 h-full bg-gradient-to-b from-[#FFA726]/70 via-[#FF9100]/25 to-transparent" />
          </div>
          <div className="absolute left-[7%] bottom-0 w-3 h-[25%] flex flex-col items-center justify-start">
            <div className="w-3 h-3 bg-[#FFB74D] shadow-[0_0_10px_#FF9100] shrink-0" />
            <div className="w-1 h-full bg-gradient-to-b from-[#FFA726]/60 to-transparent" />
          </div>
          <div className="absolute left-[13%] bottom-0 w-3.5 h-[42%] flex flex-col items-center justify-start">
            <div className="w-3.5 h-3.5 bg-[#FFB74D] shadow-[0_0_12px_#FF9100] shrink-0" />
            <div className="w-1.5 h-full bg-gradient-to-b from-[#FFA726]/70 to-transparent" />
          </div>
          <div className="absolute left-[21%] bottom-0 w-4 h-[55%] flex flex-col items-center justify-start">
            <div className="w-4 h-4 bg-[#FFE082] shadow-[0_0_14px_#FF9100,0_0_28px_#FF6D00] shrink-0" />
            <div className="w-2 h-full bg-gradient-to-b from-[#FFA726]/80 via-[#FF9100]/35 to-transparent" />
          </div>
          <div className="absolute left-[35%] bottom-0 w-3 h-[32%] flex flex-col items-center justify-start">
            <div className="w-3 h-3 bg-[#FFB74D] shadow-[0_0_10px_#FF9100] shrink-0" />
            <div className="w-1 h-full bg-gradient-to-b from-[#FFA726]/60 to-transparent" />
          </div>
          <div className="absolute right-[31%] bottom-0 w-3.5 h-[28%] flex flex-col items-center justify-start">
            <div className="w-3.5 h-3.5 bg-[#FFB74D] shadow-[0_0_12px_#FF9100] shrink-0" />
            <div className="w-1.5 h-full bg-gradient-to-b from-[#FFA726]/60 to-transparent" />
          </div>
          <div className="absolute right-[22%] bottom-0 w-3.5 h-[48%] flex flex-col items-center justify-start">
            <div className="w-3.5 h-3.5 bg-[#FFE082] shadow-[0_0_14px_#FF9100] shrink-0" />
            <div className="w-1.5 h-full bg-gradient-to-b from-[#FFA726]/70 to-transparent" />
          </div>
          <div className="absolute right-[14%] bottom-0 w-4 h-[60%] flex flex-col items-center justify-start">
            <div className="w-4 h-4 bg-[#FFE082] shadow-[0_0_14px_#FF9100,0_0_28px_#FF6D00] shrink-0" />
            <div className="w-2 h-full bg-gradient-to-b from-[#FFA726]/80 via-[#FF9100]/35 to-transparent" />
          </div>
          <div className="absolute right-[3%] bottom-0 w-3.5 h-[70%] flex flex-col items-center justify-start">
            <div className="w-3.5 h-3.5 bg-[#FFB74D] shadow-[0_0_12px_#FF9100,0_0_24px_#FF6D00] shrink-0" />
            <div className="w-1.5 h-full bg-gradient-to-b from-[#FFA726]/70 to-transparent" />
          </div>
          <div className="absolute right-[7%] bottom-0 w-3 h-[38%] flex flex-col items-center justify-start">
            <div className="w-3 h-3 bg-[#FFB74D] shadow-[0_0_10px_#FF9100] shrink-0" />
            <div className="w-1 h-full bg-gradient-to-b from-[#FFA726]/60 to-transparent" />
          </div>
        </div>

        {/* Content Container (Centered horizontally in full-bleed hero) */}
        <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center">
          {/* Section Navigation Quick Filters (0% RADIUS CORNERS) */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <div 
              style={{ borderRadius: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-black/60 border border-amber-400/40 text-amber-300 text-xs font-mono backdrop-blur-sm shadow-md"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Ví Orbs: <strong className="text-white font-bold">{orbs.toLocaleString()}</strong></span>
            </div>

            <button
              type="button"
              onClick={() => setShowPromoDrawer(!showPromoDrawer)}
              style={{ borderRadius: 0 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-none bg-black/60 hover:bg-black/90 border border-white/20 text-zinc-300 hover:text-white text-xs font-semibold backdrop-blur-sm transition-colors cursor-pointer select-none active:translate-y-0.5 shadow-md"
            >
              <Gift className="w-3.5 h-3.5 text-pink-400" />
              <span className="font-minecraft tracking-wider text-[11px] uppercase">{showPromoDrawer ? 'Ẩn mã mẫu' : 'Xem mã mẫu'}</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('section-event-clock')}
              style={{ borderRadius: 0 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-none bg-black/60 hover:bg-black/90 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-semibold backdrop-blur-sm transition-colors cursor-pointer select-none active:translate-y-0.5 shadow-md"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-minecraft tracking-wider text-[11px]">Event will start in</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('section-how-to-redeem')}
              style={{ borderRadius: 0 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-none bg-black/60 hover:bg-black/90 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-semibold backdrop-blur-sm transition-colors cursor-pointer select-none active:translate-y-0.5 shadow-md"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-minecraft tracking-wider text-[11px] uppercase">Hướng dẫn đổi quà</span>
            </button>
          </div>

          {/* BIG MINECRAFT TITLE: 3 LINES */}
          <h1 
            style={{
              textShadow: '0 4px 0 #000, 0 6px 12px rgba(0,0,0,0.85)',
            }}
            className="font-minecraft text-white text-2xl sm:text-4xl md:text-[44px] uppercase font-normal tracking-wider leading-[1.25] sm:leading-[1.2] mb-7 select-none"
          >
            <div>EVENT & REDEEM</div>
            <div>VNRT ONLINE</div>
            <div>PORTAL</div>
          </h1>

          {/* PROMPT LABEL */}
          <p className="text-[11px] sm:text-xs font-bold text-amber-100 uppercase tracking-[0.18em] mb-3 select-none font-mono drop-shadow">
            PLEASE ENTER YOUR REDEMPTION CODE OR DISCOVER EVENTS
          </p>

          {/* CODE INPUT & REDEEM BUTTON FORM (0% RADIUS, SQUARE FONT) */}
          <form onSubmit={handleRedeem} className="w-full flex flex-col items-center">
            {/* Input Box: Dark black pixel box with 5x5 code and square font digits */}
            <div className="w-full max-w-[580px] relative mb-5">
              <input
                ref={inputRef}
                type="text"
                value={codeInput}
                onChange={handleInputChange}
                placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                maxLength={29}
                autoComplete="off"
                spellCheck={false}
                style={{
                  borderRadius: 0,
                  fontFamily: "'Minecraft', 'Silkscreen', 'VT323', 'Chakra Petch', monospace",
                }}
                className="redeem-square-font w-full h-14 sm:h-16 bg-[#0B0D12] text-white font-minecraft rounded-none text-center text-lg sm:text-2xl md:text-3xl font-bold tracking-[0.24em] px-4 py-2 border-2 border-black ring-1 ring-zinc-700/80 focus:ring-2 focus:ring-orange-400 focus:outline-none placeholder-zinc-600 transition-all uppercase shadow-[inset_0_3px_10px_rgba(0,0,0,0.85)]"
              />

              {codeInput && (
                <button
                  type="button"
                  onClick={() => setCodeInput('')}
                  style={{ borderRadius: 0 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-white text-xs px-2.5 py-1 bg-black/80 hover:bg-black rounded-none border border-white/20 cursor-pointer font-minecraft tracking-wider uppercase select-none transition-colors"
                >
                  XÓA
                </button>
              )}
            </div>

            {/* Error Message if any (0% RADIUS) */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  style={{ borderRadius: 0 }}
                  className="flex items-center gap-2 text-rose-300 bg-rose-950/90 border border-rose-500/50 px-4 py-2.5 rounded-none text-xs font-semibold mb-4 max-w-[580px] shadow-lg"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MINECRAFT GREEN BLOCK BUTTON: REDEEM (0% RADIUS CORNER, CHỈ CÓ BORDER TRÊN DƯỚI, KO BORDER TRÁI PHẢI) */}
            <button
              type="submit"
              disabled={isRedeeming}
              style={{
                borderRadius: 0,
                borderLeft: '0px none transparent',
                borderRight: '0px none transparent',
                boxShadow: 'inset 0 2px 0px rgba(255,255,255,0.25), inset 0 -2px 0px rgba(0,0,0,0.4)',
                textShadow: '1px 1px 0px #1E4613',
              }}
              className="relative px-10 sm:px-14 py-2.5 sm:py-3.5 bg-[#4CA42F] hover:bg-[#57B736] active:bg-[#3E8B25] text-white font-minecraft text-sm sm:text-base font-normal tracking-wider uppercase border-t-2 border-t-[#78DF4F] border-b-4 border-b-[#1C4710] border-l-0 border-r-0 border-x-0 active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed shadow-xl rounded-none"
            >
              {isRedeeming ? 'REDEEMING...' : 'REDEEM CODE'}
            </button>
          </form>
        </div>
      </div>

      {/* =========================================================================
          SAMPLE CODES DRAWER (COLLAPSIBLE TEST HELPER, 0% RADIUS)
          ========================================================================= */}
      <AnimatePresence>
        {showPromoDrawer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ borderRadius: 0 }}
            className="w-full bg-[#121214] border-b-2 border-black p-4 sm:p-8 overflow-hidden rounded-none"
          >
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5 font-minecraft">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Mã quà tặng mẫu 5x5 (Nhấn để dán tự động)
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">Hệ sinh thái VNRT ONLINE 2026 - 2030</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {OFFICIAL_PROMO_CODES.map((promo) => {
                  const isRedeemed = history.some((h) => h.code === promo.code);
                  return (
                    <button
                      key={promo.id}
                      type="button"
                      onClick={() => !isRedeemed && handleSelectSampleCode(promo.code)}
                      disabled={isRedeemed}
                      style={{ borderRadius: 0 }}
                      className={`text-left p-3.5 rounded-none border transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-sm ${
                        isRedeemed
                          ? 'bg-zinc-900/60 border-zinc-800 opacity-50 cursor-not-allowed'
                          : 'bg-[#1D1D22] hover:bg-[#25252D] border-zinc-700/80 hover:border-cyan-400 text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white truncate">{promo.title}</span>
                        <span 
                          style={{ borderRadius: 0 }}
                          className="text-[10px] font-mono font-bold text-amber-400 shrink-0 bg-black/40 px-1.5 py-0.5 border border-amber-500/20"
                        >
                          +{promo.orbs.toLocaleString()} Orbs
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span 
                          style={{ 
                            fontFamily: "'Minecraft', 'Silkscreen', 'VT323', monospace",
                            borderRadius: 0 
                          }}
                          className="redeem-square-font text-[11px] text-cyan-300 truncate tracking-wide"
                        >
                          {promo.code}
                        </span>
                        {isRedeemed ? (
                          <span 
                            style={{ borderRadius: 0 }}
                            className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 font-minecraft uppercase"
                          >
                            <Check className="w-3 h-3" /> Đã nhận
                          </span>
                        ) : copiedCode === promo.code ? (
                          <span 
                            style={{ borderRadius: 0 }}
                            className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 font-minecraft uppercase"
                          >
                            <Check className="w-3 h-3" /> Đã dán
                          </span>
                        ) : (
                          <span 
                            style={{ borderRadius: 0 }}
                            className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-0.5 font-minecraft uppercase"
                          >
                            <Copy className="w-3 h-3" /> Chọn
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          SECTION 2: CLOCK COUNTDOWN - "Event will start in" (0% RADIUS, DIGITAL SQUARE)
          ========================================================================= */}
      <section 
        id="section-event-clock" 
        style={{ borderRadius: 0 }}
        className="w-full bg-[#121216] border-b-2 border-black py-12 sm:py-16 px-4 sm:px-8 text-center rounded-none"
      >
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-none bg-black/60 border border-orange-500/40 text-orange-300 text-xs font-mono tracking-wider mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-none bg-orange-500 animate-ping" />
            <span>Event will start in</span>
          </div>

          <h2 
            style={{ textShadow: '0 3px 0 #000' }}
            className="font-minecraft text-white text-2xl sm:text-4xl font-normal text-center tracking-wider mb-8 select-none"
          >
            Event will start in
          </h2>

          {/* Clock: 0% radius, sharp square blocks with Minecraft pixel font numbers */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-5 font-mono font-black text-3xl sm:text-5xl md:text-6xl text-white select-none">
            <div 
              style={{ borderRadius: 0 }}
              className="px-3.5 sm:px-6 py-3 sm:py-4 bg-[#242424] border-2 border-zinc-700 shadow-[0_8px_20px_rgba(0,0,0,0.5)] tabular-nums min-w-[75px] sm:min-w-[115px] text-center rounded-none"
            >
              <div className="font-minecraft">{clockTime.days}</div>
              <div className="text-[10px] sm:text-xs font-minecraft text-zinc-400 uppercase mt-1">NGÀY</div>
            </div>

            <span className="text-red-500 font-bold animate-pulse text-2xl sm:text-4xl font-minecraft">:</span>

            <div 
              style={{ borderRadius: 0 }}
              className="px-3 sm:px-5 py-3 sm:py-4 bg-[#242424] border-2 border-zinc-700 shadow-[0_8px_20px_rgba(0,0,0,0.5)] tabular-nums min-w-[65px] sm:min-w-[95px] text-center rounded-none"
            >
              <div className="font-minecraft">{String(clockTime.hours).padStart(2, '0')}</div>
              <div className="text-[10px] sm:text-xs font-minecraft text-zinc-400 uppercase mt-1">GIỜ</div>
            </div>

            <span className="text-red-500 font-bold animate-pulse text-2xl sm:text-4xl font-minecraft">:</span>

            <div 
              style={{ borderRadius: 0 }}
              className="px-3 sm:px-5 py-3 sm:py-4 bg-[#242424] border-2 border-zinc-700 shadow-[0_8px_20px_rgba(0,0,0,0.5)] tabular-nums min-w-[65px] sm:min-w-[95px] text-center rounded-none"
            >
              <div className="font-minecraft">{String(clockTime.mins).padStart(2, '0')}</div>
              <div className="text-[10px] sm:text-xs font-minecraft text-zinc-400 uppercase mt-1">PHÚT</div>
            </div>

            <span className="text-red-500 font-bold animate-pulse text-2xl sm:text-4xl font-minecraft">:</span>

            <div 
              style={{ borderRadius: 0 }}
              className="px-3 sm:px-5 py-3 sm:py-4 bg-[#242424] border-2 border-zinc-700 shadow-[0_8px_20px_rgba(0,0,0,0.5)] tabular-nums min-w-[65px] sm:min-w-[95px] text-center text-red-400 rounded-none"
            >
              <div className="font-minecraft">{String(clockTime.secs).padStart(2, '0')}</div>
              <div className="text-[10px] sm:text-xs font-minecraft text-red-400/80 uppercase mt-1">GIÂY</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: "HOW TO REDEEM" WITH 4 STEP CARDS (0% RADIUS)
          ========================================================================= */}
      <div 
        id="section-how-to-redeem"
        style={{ borderRadius: 0 }}
        className="w-full bg-[#181818] py-14 sm:py-16 px-4 sm:px-8 rounded-none"
      >
        <div className="max-w-6xl mx-auto">
          <h2 
            style={{
              textShadow: '0 3px 0 #000',
            }}
            className="font-minecraft text-white text-xl sm:text-3xl uppercase font-normal text-center tracking-wider mb-8 sm:mb-10 select-none"
          >
            HOW TO REDEEM EVENT CODES
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Step 1 */}
            <div 
              style={{ borderRadius: 0 }}
              className="bg-[#242424] border-2 border-zinc-800 p-5 sm:p-6 text-center flex flex-col justify-start items-center shadow-lg transition-transform hover:-translate-y-1 rounded-none"
            >
              <div 
                style={{ borderRadius: 0 }}
                className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center font-minecraft text-cyan-400 text-sm mb-3"
              >
                1
              </div>
              <h3 className="font-bold text-white text-sm sm:text-base leading-snug mb-2 font-minecraft">
                Step 1: Enter 5x5 Code
              </h3>
              <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                Nhập mã 25 ký tự từ sự kiện trực tiếp, livestream đếm ngược, hoặc thẻ mã quà tặng mẫu!
              </p>
            </div>

            {/* Step 2 */}
            <div 
              style={{ borderRadius: 0 }}
              className="bg-[#242424] border-2 border-zinc-800 p-5 sm:p-6 text-center flex flex-col justify-between items-center shadow-lg transition-transform hover:-translate-y-1 rounded-none"
            >
              <div className="flex flex-col items-center">
                <div 
                  style={{ borderRadius: 0 }}
                  className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center font-minecraft text-cyan-400 text-sm mb-3"
                >
                  2
                </div>
                <h3 className="font-bold text-white text-sm sm:text-base leading-snug mb-2 font-minecraft">
                  Step 2: Sign In
                </h3>
                <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                  Đăng nhập tài khoản VNRT Online để lưu trữ vĩnh viễn quyền lợi và số dư Orbs vào ví!
                </p>
              </div>

              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={openAuthModal}
                  style={{ borderRadius: 0 }}
                  className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-none bg-[#0078D4] hover:bg-[#106EBE] active:bg-[#005A9E] text-white text-xs font-bold transition-colors cursor-pointer select-none border border-[#005A9E] shadow-sm uppercase font-minecraft tracking-wider"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In Now</span>
                </button>
              )}
            </div>

            {/* Step 3 */}
            <div 
              style={{ borderRadius: 0 }}
              className="bg-[#242424] border-2 border-zinc-800 p-5 sm:p-6 text-center flex flex-col justify-start items-center shadow-lg transition-transform hover:-translate-y-1 rounded-none"
            >
              <div 
                style={{ borderRadius: 0 }}
                className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center font-minecraft text-cyan-400 text-sm mb-3"
              >
                3
              </div>
              <h3 className="font-bold text-white text-sm sm:text-base leading-snug mb-2 font-minecraft">
                Step 3: Confirm Content
              </h3>
              <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                Xác nhận áp dụng quà tặng, ngày VIP V-Premium và danh hiệu vào hồ sơ cá nhân.
              </p>
            </div>

            {/* Step 4 */}
            <div 
              style={{ borderRadius: 0 }}
              className="bg-[#242424] border-2 border-zinc-800 p-5 sm:p-6 text-center flex flex-col justify-start items-center shadow-lg transition-transform hover:-translate-y-1 rounded-none"
            >
              <div 
                style={{ borderRadius: 0 }}
                className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center font-minecraft text-emerald-400 text-sm mb-3"
              >
                4
              </div>
              <h3 className="font-bold text-white text-sm sm:text-base leading-snug mb-2 font-minecraft">
                Step 4: Success!
              </h3>
              <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                Tận hưởng tính năng 4K HDR, mở khóa app Space 360 và tham gia cộng đồng!
              </p>
            </div>
          </div>

          {/* Redemption History list */}
          {history.length > 0 && (
            <div 
              style={{ borderRadius: 0 }}
              className="mt-12 bg-[#1C1C22] border-2 border-zinc-800 p-5 sm:p-7 rounded-none shadow-md"
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
                <span className="font-minecraft text-white text-sm sm:text-base uppercase flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  LỊCH SỬ KÍCH HOẠT MÃ ({history.length})
                </span>
                <span className="text-xs text-zinc-500 font-mono">Đã lưu trữ trên thiết bị</span>
              </div>

              <div className="space-y-2.5">
                {history.map((rec, idx) => (
                  <div 
                    key={idx}
                    style={{ borderRadius: 0 }}
                    className="p-3 bg-[#141418] border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-none"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        style={{ borderRadius: 0 }}
                        className="w-7 h-7 bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0"
                      >
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{rec.title}</div>
                        <div 
                          style={{ fontFamily: "'Minecraft', 'Silkscreen', monospace" }}
                          className="redeem-square-font text-[11px] text-cyan-300 font-bold"
                        >
                          {rec.code}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <span 
                        style={{ borderRadius: 0 }}
                        className="text-[11px] font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5"
                      >
                        +{rec.orbs.toLocaleString()} Orbs
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">{rec.redeemedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          CELEBRATORY REWARD CLAIM MODAL (0% RADIUS CORNERS, 0% RADIUS)
          ========================================================================= */}
      <AnimatePresence>
        {claimedReward && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              style={{ borderRadius: 0 }}
              className="relative w-full max-w-md bg-[#1C1C22] border-4 border-[#4CA42F] p-6 sm:p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-none"
            >
              <div className="space-y-4">
                <div 
                  style={{ borderRadius: 0 }}
                  className="mx-auto w-16 h-16 bg-[#4CA42F] border-2 border-[#78DF4F] flex items-center justify-center text-white shadow-lg animate-bounce rounded-none"
                >
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <div 
                    style={{ borderRadius: 0 }}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 rounded-none font-minecraft uppercase"
                  >
                    <span>SUCCESS! KÍCH HOẠT THÀNH CÔNG</span>
                  </div>
                  <h3 className="font-minecraft text-xl sm:text-2xl text-white pt-2">
                    {claimedReward.title}
                  </h3>
                  <p 
                    style={{ fontFamily: "'Minecraft', 'Silkscreen', monospace" }}
                    className="redeem-square-font text-xs text-zinc-400 font-bold"
                  >
                    Code: <span className="font-bold text-cyan-300">{claimedReward.code}</span>
                  </p>
                </div>

                <div 
                  style={{ borderRadius: 0 }}
                  className="bg-[#121216] border border-zinc-800 p-4 text-left space-y-2 rounded-none"
                >
                  <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider font-minecraft">
                    Vật phẩm đã mở khóa:
                  </div>
                  <ul className="space-y-1.5">
                    {claimedReward.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-white">
                        <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => setClaimedReward(null)}
                  style={{
                    borderRadius: 0,
                    boxShadow: 'inset 2px 2px 0px rgba(255,255,255,0.25), inset -2px -2px 0px rgba(0,0,0,0.4)',
                    textShadow: '1px 1px 0px #1E4613',
                  }}
                  className="w-full py-3 bg-[#4CA42F] hover:bg-[#57B736] text-white font-minecraft text-sm font-normal tracking-wider uppercase border-t-2 border-t-[#78DF4F] border-x-2 border-x-[#2A651B] border-b-4 border-b-[#1C4710] active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer rounded-none select-none"
                >
                  OK - ENJOY!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventPage;
