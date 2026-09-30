import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Coins, 
  Copy, 
  Check, 
  RotateCcw, 
  Clock, 
  Gift,
  Star,
  LogIn
} from 'lucide-react';
import { useOrbs } from '../../hooks/useOrbs';
import { useAuth } from '../../context/AuthContext';

interface RedeemGiftTabProps {
  onBack?: () => void;
  navigate?: (route: string) => void;
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

export const RedeemGiftTab: React.FC<RedeemGiftTabProps> = ({ onBack, navigate }) => {
  const { orbs, addOrbs } = useOrbs();
  const { isAuthenticated, openAuthModal } = useAuth();
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

  // Auto-format input to 5x5 code format: XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const rawVal = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Check if user is typing a 16-char code (4x4) or 25-char code (5x5)
    // Default formatting: 5 chars per block up to 25 chars
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

    // Verify format: 5x5 (25 alphanumeric chars with hyphens) or 4x4 (16 alphanumeric chars)
    const regex5x5 = /^[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/;
    const regex4x4 = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

    if (!regex5x5.test(cleanCode) && !regex4x4.test(cleanCode)) {
      setErrorMsg('MÃ KHÔNG ĐÚNG ĐỊNH DẠNG 5X5 (XXXXX-XXXXX-XXXXX-XXXXX-XXXXX). VUI LÒNG KIỂM TRA LẠI.');
      return;
    }

    // Check if already redeemed on this device
    const alreadyRedeemed = history.some((h) => h.code === cleanCode);
    if (alreadyRedeemed) {
      const rec = history.find((h) => h.code === cleanCode);
      setErrorMsg(`MÃ "${cleanCode}" ĐÃ ĐƯỢC KÍCH HOẠT VÀO LÚC ${rec?.redeemedAt || 'TRƯỚC ĐÓ'}.`);
      return;
    }

    setIsRedeeming(true);

    // Simulate redemption network check with VNRT ONLINE servers
    setTimeout(() => {
      setIsRedeeming(false);

      // 1. Check in official static promo codes
      let matched = OFFICIAL_PROMO_CODES.find((c) => c.code === cleanCode);

      // 2. Dynamic checksum generator for any 5x5 code or code starting with VNRT/MINEC/VPLAY
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
          description: 'Quà tặng quà code trực tuyến ghi nhận từ máy chủ VNRT.',
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

      // Add Orbs to user wallet
      addOrbs(matched.orbs);

      // Save to redemption history
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

      // Play chime sound
      playChimeSound();

      // Show celebratory modal
      setClaimedReward(newRecord);
      setCodeInput('');
    }, 700);
  };

  return (
    <div className="w-full min-h-[85vh] bg-[#181818] text-white select-none overflow-hidden rounded-2xl border border-black/30 shadow-2xl">
      {/* =========================================================================
          TOP HERO SECTION: MINECRAFT BLUE PIXEL BRICK WALL WITH RISING LIGHT BEAMS
          ========================================================================= */}
      <div className="relative w-full overflow-hidden bg-[#0A1B34] pt-14 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 flex flex-col items-center justify-center border-b-4 border-black">
        {/* SVG Minecraft Blue Brick Pattern Background */}
        <div className="absolute inset-0 pointer-events-none opacity-95">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <defs>
              {/* Individual 64x32 Minecraft Brick Unit */}
              <pattern id="minecraft-blue-brick" width="64" height="32" patternUnits="userSpaceOnUse">
                {/* Background base deep blue */}
                <rect width="64" height="32" fill="#0A1D38" />

                {/* Top Brick 1: (0, 0, 62, 14) */}
                <rect x="0" y="0" width="62" height="14" fill="#0D274A" />
                <rect x="2" y="2" width="28" height="10" fill="#11335F" />
                <rect x="32" y="2" width="26" height="8" fill="#143D72" />
                <rect x="6" y="4" width="8" height="4" fill="#184988" />
                <rect x="42" y="4" width="10" height="4" fill="#184988" />

                {/* Staggered Row Bottom Brick: Left half (0, 16, 30, 14), Right half (32, 16, 30, 14) */}
                <rect x="0" y="16" width="30" height="14" fill="#0D274A" />
                <rect x="2" y="18" width="26" height="10" fill="#11335F" />
                <rect x="8" y="20" width="12" height="4" fill="#184988" />

                <rect x="32" y="16" width="30" height="14" fill="#0D274A" />
                <rect x="34" y="18" width="26" height="10" fill="#143D72" />
                <rect x="44" y="20" width="10" height="4" fill="#184988" />

                {/* Mortar / Dark Blue pixel lines between bricks */}
                <rect x="0" y="14" width="64" height="2" fill="#051020" />
                <rect x="0" y="30" width="64" height="2" fill="#051020" />
                <rect x="62" y="0" width="2" height="14" fill="#051020" />
                <rect x="30" y="16" width="2" height="14" fill="#051020" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#minecraft-blue-brick)" />
          </svg>
        </div>

        {/* Ambient vertical dark gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#061224]/50 via-transparent to-[#040D1C]/80 pointer-events-none" />

        {/* Glowing Cyan Rising Vertical Light Particles (exact placement matching screenshot) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Particle 1 - Far Left */}
          <div className="absolute left-[3%] bottom-0 w-3.5 h-[62%] flex flex-col items-center justify-start">
            <div className="w-3.5 h-3.5 bg-[#40F2FE] shadow-[0_0_12px_#00E5FF,0_0_24px_#00E5FF] shrink-0" />
            <div className="w-1.5 h-full bg-gradient-to-b from-[#00E5FF]/60 via-[#00E5FF]/20 to-transparent" />
          </div>

          {/* Particle 2 */}
          <div className="absolute left-[7%] bottom-0 w-3 h-[25%] flex flex-col items-center justify-start">
            <div className="w-3 h-3 bg-[#40F2FE] shadow-[0_0_10px_#00E5FF] shrink-0" />
            <div className="w-1 h-full bg-gradient-to-b from-[#00E5FF]/50 to-transparent" />
          </div>

          {/* Particle 3 */}
          <div className="absolute left-[13%] bottom-0 w-3.5 h-[42%] flex flex-col items-center justify-start">
            <div className="w-3.5 h-3.5 bg-[#40F2FE] shadow-[0_0_12px_#00E5FF] shrink-0" />
            <div className="w-1.5 h-full bg-gradient-to-b from-[#00E5FF]/60 to-transparent" />
          </div>

          {/* Particle 4 - Left Mid */}
          <div className="absolute left-[21%] bottom-0 w-4 h-[55%] flex flex-col items-center justify-start">
            <div className="w-4 h-4 bg-[#7DF7FF] shadow-[0_0_14px_#00E5FF,0_0_28px_#00E5FF] shrink-0" />
            <div className="w-2 h-full bg-gradient-to-b from-[#00E5FF]/70 via-[#00E5FF]/30 to-transparent" />
          </div>

          {/* Particle 5 - Center Left */}
          <div className="absolute left-[35%] bottom-0 w-3 h-[32%] flex flex-col items-center justify-start">
            <div className="w-3 h-3 bg-[#40F2FE] shadow-[0_0_10px_#00E5FF] shrink-0" />
            <div className="w-1 h-full bg-gradient-to-b from-[#00E5FF]/50 to-transparent" />
          </div>

          {/* Particle 6 - Center Right */}
          <div className="absolute right-[31%] bottom-0 w-3.5 h-[28%] flex flex-col items-center justify-start">
            <div className="w-3.5 h-3.5 bg-[#40F2FE] shadow-[0_0_12px_#00E5FF] shrink-0" />
            <div className="w-1.5 h-full bg-gradient-to-b from-[#00E5FF]/50 to-transparent" />
          </div>

          {/* Particle 7 - Right Mid */}
          <div className="absolute right-[22%] bottom-0 w-3.5 h-[48%] flex flex-col items-center justify-start">
            <div className="w-3.5 h-3.5 bg-[#7DF7FF] shadow-[0_0_14px_#00E5FF] shrink-0" />
            <div className="w-1.5 h-full bg-gradient-to-b from-[#00E5FF]/60 to-transparent" />
          </div>

          {/* Particle 8 - Far Right Mid */}
          <div className="absolute right-[14%] bottom-0 w-4 h-[60%] flex flex-col items-center justify-start">
            <div className="w-4 h-4 bg-[#7DF7FF] shadow-[0_0_14px_#00E5FF,0_0_28px_#00E5FF] shrink-0" />
            <div className="w-2 h-full bg-gradient-to-b from-[#00E5FF]/70 via-[#00E5FF]/30 to-transparent" />
          </div>

          {/* Particle 9 - Far Right */}
          <div className="absolute right-[3%] bottom-0 w-3.5 h-[70%] flex flex-col items-center justify-start">
            <div className="w-3.5 h-3.5 bg-[#40F2FE] shadow-[0_0_12px_#00E5FF,0_0_24px_#00E5FF] shrink-0" />
            <div className="w-1.5 h-full bg-gradient-to-b from-[#00E5FF]/60 to-transparent" />
          </div>

          {/* Particle 10 */}
          <div className="absolute right-[7%] bottom-0 w-3 h-[38%] flex flex-col items-center justify-start">
            <div className="w-3 h-3 bg-[#40F2FE] shadow-[0_0_10px_#00E5FF] shrink-0" />
            <div className="w-1 h-full bg-gradient-to-b from-[#00E5FF]/50 to-transparent" />
          </div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
          {/* Top Quick Status Pill: Orbs & Sample Codes Toggle */}
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-cyan-400/30 text-cyan-300 text-xs font-mono backdrop-blur-sm">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Ví Orbs: <strong className="text-white font-bold">{orbs.toLocaleString()}</strong></span>
            </div>

            <button
              type="button"
              onClick={() => setShowPromoDrawer(!showPromoDrawer)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-zinc-300 hover:text-white text-xs font-semibold backdrop-blur-sm transition-colors cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-pink-400" />
              <span>{showPromoDrawer ? 'Ẩn mã mẫu' : 'Xem mã mẫu'}</span>
            </button>
          </div>

          {/* BIG MINECRAFT TITLE: 3 LINES */}
          <h1 
            style={{
              textShadow: '0 4px 0 #000, 0 6px 12px rgba(0,0,0,0.85)',
            }}
            className="font-minecraft text-white text-2xl sm:text-4xl md:text-[44px] uppercase font-normal tracking-wider leading-[1.25] sm:leading-[1.2] mb-7 select-none"
          >
            <div>REDEEM YOUR</div>
            <div>VNRT ONLINE GIFT</div>
            <div>CODE</div>
          </h1>

          {/* PROMPT LABEL */}
          <p className="text-[11px] sm:text-xs font-bold text-zinc-200 uppercase tracking-[0.16em] mb-2 select-none">
            PLEASE ENTER YOUR REDEMPTION CODE
          </p>

          {/* CODE INPUT & REDEEM BUTTON FORM */}
          <form onSubmit={handleRedeem} className="w-full flex flex-col items-center">
            {/* Input Box: Dark black pixel box with 5x5 code */}
            <div className="w-full max-w-[560px] relative mb-5">
              <input
                ref={inputRef}
                type="text"
                value={codeInput}
                onChange={handleInputChange}
                placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                maxLength={29}
                autoComplete="off"
                spellCheck={false}
                className="w-full h-12 sm:h-13 bg-[#0B0D12] text-white font-mono text-center text-base sm:text-lg md:text-xl font-bold tracking-[0.22em] px-4 py-2 border-2 border-black ring-1 ring-zinc-700/60 focus:ring-2 focus:ring-cyan-400 focus:outline-none placeholder-zinc-600 transition-all uppercase shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]"
              />

              {codeInput && (
                <button
                  type="button"
                  onClick={() => setCodeInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs px-2 py-1 bg-black/60 rounded cursor-pointer"
                >
                  XÓA
                </button>
              )}
            </div>

            {/* Error Message if any */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-2 text-rose-300 bg-rose-950/80 border border-rose-500/40 px-4 py-2 rounded-lg text-xs font-semibold mb-4 max-w-[560px]"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MINECRAFT GREEN BLOCK BUTTON: REDEEM */}
            <button
              type="submit"
              disabled={isRedeeming}
              style={{
                boxShadow: 'inset 2px 2px 0px rgba(255,255,255,0.25), inset -2px -2px 0px rgba(0,0,0,0.4)',
                textShadow: '1px 1px 0px #1E4613',
              }}
              className="relative px-8 sm:px-10 py-2 sm:py-2.5 bg-[#4CA42F] hover:bg-[#57B736] active:bg-[#3E8B25] text-white font-minecraft text-sm sm:text-base font-normal tracking-wider uppercase border-t-2 border-t-[#78DF4F] border-x-2 border-x-[#2A651B] border-b-4 border-b-[#1C4710] active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isRedeeming ? 'REDEEMING...' : 'REDEEM'}
            </button>
          </form>
        </div>
      </div>

      {/* =========================================================================
          SAMPLE CODES DRAWER (COLLAPSIBLE TEST HELPER)
          ========================================================================= */}
      <AnimatePresence>
        {showPromoDrawer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#121214] border-b border-zinc-800 p-4 sm:p-6 overflow-hidden"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Mã quà tặng mẫu 5x5 (Nhấn để dán tự động)
                </span>
                <span className="text-[11px] text-zinc-500">Cập nhật 2026</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {OFFICIAL_PROMO_CODES.map((promo) => {
                  const isRedeemed = history.some((h) => h.code === promo.code);
                  return (
                    <button
                      key={promo.id}
                      type="button"
                      onClick={() => !isRedeemed && handleSelectSampleCode(promo.code)}
                      disabled={isRedeemed}
                      className={`text-left p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                        isRedeemed
                          ? 'bg-zinc-900/60 border-zinc-800 opacity-50 cursor-not-allowed'
                          : 'bg-[#1D1D22] hover:bg-[#25252D] border-zinc-700/80 hover:border-cyan-400 text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white truncate">{promo.title}</span>
                        <span className="text-[10px] font-mono font-bold text-amber-400 shrink-0">
                          +{promo.orbs.toLocaleString()} Orbs
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-cyan-300 truncate tracking-wide">
                          {promo.code}
                        </span>
                        {isRedeemed ? (
                          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Đã nhận
                          </span>
                        ) : copiedCode === promo.code ? (
                          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Đã dán
                          </span>
                        ) : (
                          <span className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-0.5">
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
          LOWER SECTION: "HOW TO REDEEM" WITH 4 STEP CARDS
          ========================================================================= */}
      <div className="bg-[#181818] py-12 sm:py-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Section Heading: Minecraft Pixel Font */}
          <h2 
            style={{
              textShadow: '0 3px 0 #000',
            }}
            className="font-minecraft text-white text-xl sm:text-3xl uppercase font-normal text-center tracking-wider mb-8 sm:mb-12 select-none"
          >
            HOW TO REDEEM
          </h2>

          {/* 4 Step Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Step 1 */}
            <div className="bg-[#242424] border border-zinc-800 p-5 sm:p-6 text-center flex flex-col justify-start items-center shadow-lg transition-transform hover:-translate-y-1">
              <h3 className="font-bold text-white text-sm sm:text-base leading-snug mb-2">
                Step 1: Enter Your 5x5 Code
              </h3>
              <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                This 25-digit code can be found with proof of purchase: card, receipt, or email!
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#242424] border border-zinc-800 p-5 sm:p-6 text-center flex flex-col justify-between items-center shadow-lg transition-transform hover:-translate-y-1">
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base leading-snug mb-2">
                  Step 2: Sign In
                </h3>
                <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                  An active Microsoft Account is required to redeem. New customers can create a free account!
                </p>
              </div>

              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In Now</span>
                </button>
              )}
            </div>

            {/* Step 3 */}
            <div className="bg-[#242424] border border-zinc-800 p-5 sm:p-6 text-center flex flex-col justify-start items-center shadow-lg transition-transform hover:-translate-y-1">
              <h3 className="font-bold text-white text-sm sm:text-base leading-snug mb-2">
                Step 3: Confirm Your Content
              </h3>
              <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                Confirm to apply the item to your account!
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#242424] border border-zinc-800 p-5 sm:p-6 text-center flex flex-col justify-start items-center shadow-lg transition-transform hover:-translate-y-1">
              <h3 className="font-bold text-white text-sm sm:text-base leading-snug mb-2">
                Step 4: Success!
              </h3>
              <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                Enjoy your newest addition!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CELEBRATORY REWARD CLAIM MODAL (MINECRAFT STYLE)
          ========================================================================= */}
      <AnimatePresence>
        {claimedReward && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-[#1C1C22] border-4 border-[#4CA42F] p-6 sm:p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
            >
              <div className="space-y-4">
                {/* Celebratory Icon */}
                <div className="mx-auto w-16 h-16 bg-[#4CA42F] border-2 border-[#78DF4F] flex items-center justify-center text-white shadow-lg animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    <span>SUCCESS! KÍCH HOẠT THÀNH CÔNG</span>
                  </div>
                  <h3 className="font-minecraft text-xl sm:text-2xl text-white pt-2">
                    {claimedReward.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    Code: <span className="font-bold text-cyan-300">{claimedReward.code}</span>
                  </p>
                </div>

                {/* Rewards list */}
                <div className="bg-[#121216] border border-zinc-800 p-4 text-left space-y-2">
                  <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
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

                {/* Close Button: Minecraft green button */}
                <button
                  type="button"
                  onClick={() => setClaimedReward(null)}
                  style={{
                    boxShadow: 'inset 2px 2px 0px rgba(255,255,255,0.25), inset -2px -2px 0px rgba(0,0,0,0.4)',
                    textShadow: '1px 1px 0px #1E4613',
                  }}
                  className="w-full py-3 bg-[#4CA42F] hover:bg-[#57B736] text-white font-minecraft text-sm font-normal tracking-wider uppercase border-t-2 border-t-[#78DF4F] border-x-2 border-x-[#2A651B] border-b-4 border-b-[#1C4710] active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer"
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

export default RedeemGiftTab;
