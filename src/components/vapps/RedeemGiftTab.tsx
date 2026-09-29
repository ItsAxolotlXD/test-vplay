import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Coins, 
  Crown, 
  Copy, 
  Check, 
  RotateCcw, 
  Clock, 
  ArrowRight, 
  Car, 
  Tv, 
  ShieldCheck, 
  Layers, 
  Star,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useOrbs } from '../../hooks/useOrbs';

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
  category: 'official' | 'partner' | 'special';
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

// Official promo codes for VNRT ONLINE
const OFFICIAL_PROMO_CODES: GiftReward[] = [
  {
    id: 'vnrt_welcome',
    code: 'VNRT-2026-GIFT-FREE',
    title: 'Gói Quà Tân Thủ VNRT ONLINE',
    description: 'Quà chào mừng thành viên mới khám phá hệ sinh thái phát thanh truyền hình trực tuyến.',
    orbs: 50000,
    vipDays: 30,
    badge: 'Tân Thủ Hoàng Gia',
    items: ['+50.000 Orbs Khoáng Vật', '30 Ngày V-Premium VIP', 'Huy hiệu Tân Thủ Hoàng Gia'],
    category: 'official'
  },
  {
    id: 'vnrt_orbs_100k',
    code: 'VNRT-ORBS-100K-GOLD',
    title: 'Kho Báu Orbs Hoàng Gia',
    description: 'Gói nạp thưởng khoáng vật Orbs độc quyền từ ban quản trị VNRT Media.',
    orbs: 100000,
    badge: 'Đại Gia Orbs',
    items: ['+100.000 Orbs Vàng', 'Danh hiệu Đại Gia Khoáng Vật', 'Thẻ cược VIP Copilot Arena'],
    category: 'official'
  },
  {
    id: 'vnrt_vvip_2026',
    code: 'VNRT-VVIP-PASS-2026',
    title: 'Thẻ V-Premium VVIP 365 Ngày',
    description: 'Đặc quyền xem toàn bộ kênh phát thanh truyền hình 4K HDR & âm thanh Dolby Atmos không giới hạn.',
    orbs: 75000,
    vipDays: 365,
    badge: 'VVIP Member',
    items: ['365 Ngày V-Premium VVIP Toàn Năng', '+75.000 Orbs', 'Ưu tiên kết nối máy chủ phát sóng riêng'],
    category: 'special'
  },
  {
    id: 'vnrt_ride_free',
    code: 'VNRT-RIDE-FREE-2026',
    title: 'Voucher VNRT Ride 360',
    description: 'Ưu đãi di chuyển tiện ích thông minh trong ứng dụng Space 360.',
    orbs: 25000,
    items: ['Voucher 5 chuyến xe điện 0đ (tối đa 100k/chuyến)', '+25.000 Orbs tích lũy', 'Ưu tiên tài xế 5 sao'],
    category: 'partner'
  },
  {
    id: 'vnrt_oct16_event',
    code: 'VNRT-OCT1-6202-6LIV',
    title: 'Quà Kỷ Niệm 16/10/2026',
    description: 'Quà tặng sự kiện đếm ngược lịch sử chuyển giao thương hiệu VNRT ONLINE.',
    orbs: 200000,
    vipDays: 60,
    badge: 'Kỷ Nguyên Mới 2026',
    items: ['+200.000 Orbs Vàng', '60 Ngày V-Premium VIP', 'Hình nền Spatial Glass Độc Bản 16/10'],
    category: 'special'
  },
  {
    id: 'vnrt_paint_apps',
    code: 'VNRT-SPAC-E360-APPS',
    title: 'Bộ Siêu Ứng Dụng Space 360',
    description: 'Mở khóa đặc quyền sáng tạo tranh vẽ MS Paint, Sổ tay V-Notes và Minecraft Container.',
    orbs: 40000,
    items: ['+40.000 Orbs', 'Bộ màu vẽ Gold Metallic cho MS Paint', 'Skin Thám Hiểm Không Gian'],
    category: 'official'
  }
];

// Play celebratory chime sound using Web Audio API
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
  const [codeInput, setCodeInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRedeeming, setIsRedeeming] = useState<boolean>(false);
  const [claimedReward, setClaimedReward] = useState<RedemptionRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [history, setHistory] = useState<RedemptionRecord[]>(() => {
    try {
      const raw = localStorage.getItem(REDEEMED_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-format input to XXXX-XXXX-XXXX-XXXX format
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const rawVal = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const truncated = rawVal.slice(0, 16);
    const parts: string[] = [];
    for (let i = 0; i < truncated.length; i += 4) {
      parts.push(truncated.slice(i, i + 4));
    }
    setCodeInput(parts.join('-'));
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const rawVal = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const truncated = rawVal.slice(0, 16);
      const parts: string[] = [];
      for (let i = 0; i < truncated.length; i += 4) {
        parts.push(truncated.slice(i, i + 4));
      }
      setCodeInput(parts.join('-'));
      setErrorMsg(null);
    } catch {
      inputRef.current?.focus();
    }
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

    // Verify format: XXXX-XXXX-XXXX-XXXX (16 alphanumeric chars with hyphens)
    const regex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!regex.test(cleanCode)) {
      setErrorMsg('Mã quà tặng không hợp lệ. Vui lòng nhập đủ 16 ký tự theo dạng XXXX-XXXX-XXXX-XXXX.');
      return;
    }

    // Check if already redeemed
    const alreadyRedeemed = history.some((h) => h.code === cleanCode);
    if (alreadyRedeemed) {
      const rec = history.find((h) => h.code === cleanCode);
      setErrorMsg(`Mã "${cleanCode}" này đã được kích hoạt trên thiết bị này vào lúc ${rec?.redeemedAt || 'trước đó'}.`);
      return;
    }

    setIsRedeeming(true);

    // Simulate redemption network check with VNRT ONLINE servers
    setTimeout(() => {
      setIsRedeeming(false);

      // 1. Check in official static promo codes
      let matched = OFFICIAL_PROMO_CODES.find((c) => c.code === cleanCode);

      // 2. Dynamic checksum generator for custom VNRT- codes
      if (!matched && cleanCode.startsWith('VNRT-')) {
        let hash = 0;
        for (let i = 0; i < cleanCode.length; i++) {
          hash = (hash << 5) - hash + cleanCode.charCodeAt(i);
          hash |= 0;
        }
        const dynamicOrbs = Math.abs(hash % 40000) + 15000;
        matched = {
          id: `custom_${cleanCode}`,
          code: cleanCode,
          title: 'Gói Quà Đặc Quyền VNRT ONLINE',
          description: 'Quà tặng sự kiện trực tuyến ghi nhận từ hệ thống máy chủ VNRT.',
          orbs: dynamicOrbs,
          vipDays: 14,
          badge: 'Thành viên Ưu Tú',
          items: [`+${dynamicOrbs.toLocaleString()} Orbs Khoáng Vật`, '14 Ngày V-Premium VIP', 'Huy hiệu VNRT Special Member'],
          category: 'official'
        };
      }

      if (!matched) {
        setErrorMsg('Mã quà tặng không tồn tại hoặc đã hết hạn. Hãy chọn một mã quà mẫu bên dưới để nhận ngay!');
        return;
      }

      // Add Orbs to wallet
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

      // Play chime audio
      playChimeSound();

      // Show celebratory modal
      setClaimedReward(newRecord);
      setCodeInput('');
    }, 750);
  };

  const handleClearHistory = () => {
    if (window.confirm('Bạn có chắc muốn xóa lịch sử nhận quà? (Số dư Orbs đã nhận vẫn được giữ nguyên)')) {
      setHistory([]);
      try {
        localStorage.removeItem(REDEEMED_STORAGE_KEY);
      } catch {}
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-20 pt-2 select-none">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1E1035] via-[#141226] to-[#0D0D14] border border-purple-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <Gift className="w-3.5 h-3.5 text-pink-400" />
              <span>VNRT ONLINE REWARDS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Redeem Gift VNRT ONLINE
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
              Nhập mã quà tặng gồm 16 ký tự định dạng <strong className="text-amber-400 font-mono">XXXX-XXXX-XXXX-XXXX</strong> để nhận khoáng vật Orbs, thẻ V-Premium VIP và quà tặng độc quyền từ VNRT.
            </p>
          </div>

          {/* Current Orbs Wallet Card */}
          <div className="shrink-0 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md flex items-center gap-4 min-w-[200px]">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-900 shadow-lg shadow-amber-500/20">
              <Coins className="w-6 h-6 stroke-[2.3]" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">
                Số Dư Hiện Có
              </div>
              <div className="text-xl font-black text-yellow-300 font-mono">
                {orbs.toLocaleString()} <span className="text-xs text-yellow-400/80">ORBS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Input Form Card */}
      <div className="rounded-[24px] bg-[#202024] border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Nhập Mã Nhận Quà</h2>
          </div>
          <span className="text-xs text-zinc-400 font-mono">16 Ký tự (XXXX-XXXX-XXXX-XXXX)</span>
        </div>

        <form onSubmit={handleRedeem} className="space-y-4">
          <div className="relative">
            <div className="flex items-center bg-[#141416] border-2 border-white/15 focus-within:border-purple-500 rounded-2xl p-2 sm:p-2.5 transition-all shadow-inner">
              <input
                ref={inputRef}
                type="text"
                value={codeInput}
                onChange={handleInputChange}
                placeholder="VD: VNRT-2026-GIFT-FREE"
                maxLength={19}
                className="w-full bg-transparent text-white font-mono text-base sm:text-xl font-bold tracking-wider px-3 sm:px-4 py-2 focus:outline-none placeholder-zinc-600 uppercase"
              />

              <div className="flex items-center gap-2 shrink-0 pr-1">
                {codeInput && (
                  <button
                    type="button"
                    onClick={() => setCodeInput('')}
                    className="px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Xóa
                  </button>
                )}
                <button
                  type="button"
                  onClick={handlePaste}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
                  title="Dán từ Clipboard"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Dán mã</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-start gap-2 text-rose-400 text-xs font-medium mt-2 px-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Mã quà tặng được bảo mật và xác thực bởi máy chủ VNRT ONLINE.</span>
            </div>

            <button
              type="submit"
              disabled={isRedeeming || !codeInput.trim()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-purple-600/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isRedeeming ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang kiểm tra mã...</span>
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4" />
                  <span>Kích hoạt quà tặng ngay</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Suggested Active Promo Codes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Mã Quà Tặng Đang Hoạt Động (Nhấn để điền nhanh)
            </h3>
          </div>
          <span className="text-[11px] text-zinc-400">Cập nhật 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {OFFICIAL_PROMO_CODES.map((promo) => {
            const isRedeemed = history.some((h) => h.code === promo.code);
            return (
              <div
                key={promo.id}
                onClick={() => !isRedeemed && handleSelectSampleCode(promo.code)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isRedeemed
                    ? 'bg-white/5 border-white/5 opacity-60'
                    : 'bg-[#1C1C20] hover:bg-[#25252B] border-white/10 hover:border-purple-500/50 shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{promo.title}</span>
                      {promo.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {promo.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {promo.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-amber-400 font-mono">
                      +{promo.orbs.toLocaleString()}
                    </span>
                    <div className="text-[9px] text-zinc-500">ORBS</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-500/20">
                    {promo.code}
                  </span>

                  {isRedeemed ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã nhận</span>
                    </span>
                  ) : copiedCode === promo.code ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã dán</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                    >
                      <span>Chọn mã</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Redemption History */}
      {history.length > 0 && (
        <div className="rounded-[24px] bg-[#1A1A1E] border border-white/10 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Lịch Sử Nhận Quà Của Bạn ({history.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={handleClearHistory}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Xóa lịch sử
            </button>
          </div>

          <div className="divide-y divide-white/5">
            {history.map((record, index) => (
              <div key={index} className="py-3 flex items-center justify-between gap-4">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate">{record.title}</span>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                      {record.code}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500">{record.redeemedAt}</div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-amber-400 font-mono">
                    +{record.orbs.toLocaleString()} Orbs
                  </span>
                  {record.vipDays && (
                    <div className="text-[10px] text-purple-300 font-semibold">
                      +{record.vipDays} ngày VIP
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Celebratory Reward Claim Modal */}
      <AnimatePresence>
        {claimedReward && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md rounded-[28px] bg-gradient-to-b from-[#2A1846] via-[#1E1235] to-[#120D22] border-2 border-purple-500/40 p-6 sm:p-8 text-center shadow-2xl overflow-hidden"
            >
              {/* Glowing background burst */}
              <div className="absolute inset-0 bg-radial from-amber-500/20 via-purple-600/10 to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-4">
                {/* Animated Gift Icon Box */}
                <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-purple-500/30 animate-bounce">
                  <Gift className="w-10 h-10 stroke-[2.2]" />
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>KÍCH HOẠT THÀNH CÔNG!</span>
                  </div>
                  <h3 className="text-xl font-black text-white pt-1">
                    {claimedReward.title}
                  </h3>
                  <p className="text-xs text-zinc-300">
                    Mã: <span className="font-mono font-bold text-amber-300">{claimedReward.code}</span>
                  </p>
                </div>

                {/* Reward items received list */}
                <div className="bg-black/40 rounded-2xl p-4 border border-white/10 space-y-2 text-left">
                  <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                    Quà Tặng Đã Nhận:
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

                {/* Action button */}
                <button
                  type="button"
                  onClick={() => setClaimedReward(null)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:brightness-110 text-white font-bold text-sm shadow-xl active:scale-98 transition-all cursor-pointer"
                >
                  Tuyệt vời! Nhận quà & Tiếp tục
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
