import React, { useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Coins,
  Sparkles,
  Check,
  Zap,
  Crown,
  Tv,
  Film,
  Gift,
  ShieldCheck,
  AlertCircle,
  Clock,
  Star,
  CheckCircle2,
  X,
  Lock,
  Flame,
  Award,
  ChevronRight,
  TrendingUp,
  Sliders,
  Shield,
  Layers,
  Sparkle
} from "lucide-react";

export interface VerifiedSubState {
  plan: "none" | "verified_basic" | "verified_standard" | "verified" | "verified_plus";
  expiresAt: number | null;
}

interface VerifiedTabProps {
  onBack: () => void;
  vCoins: number;
  setVCoins: React.Dispatch<React.SetStateAction<number>>;
  verifiedSub: VerifiedSubState;
  setVerifiedSub: React.Dispatch<React.SetStateAction<VerifiedSubState>>;
  onNavigateToTab: (tab: string) => void;
}

export default function VerifiedTab({
  onBack,
  vCoins,
  setVCoins,
  verifiedSub,
  setVerifiedSub,
  onNavigateToTab,
}: VerifiedTabProps) {
  const [confirmModal, setConfirmModal] = useState<"verified_basic" | "verified_standard" | "verified" | "verified_plus" | null>(null);
  const [errorModal, setErrorModal] = useState<{ required: number; current: number } | null>(null);
  const [successModal, setSuccessModal] = useState<"verified_basic" | "verified_standard" | "verified" | "verified_plus" | null>(null);
  const [dailyClaimed, setDailyClaimed] = useState<boolean>(() => {
    const today = new Date().toDateString();
    const lastClaim = localStorage.getItem("vplay_last_daily_claim");
    return lastClaim === today;
  });
  const [dailyBonusToast, setDailyBonusToast] = useState<boolean>(false);
  const [activeTabSection, setActiveTabSection] = useState<"plans" | "comparison" | "earning">("plans");

  // Package Prices
  const PLAN_PRICES = {
    verified_basic: 10000,      // 10,000 V-pearls / 5 ngày
    verified_standard: 100000,   // 100,000 V-pearls / 10 ngày
    verified: 1000000,          // 1,000,000 V-pearls / 30 ngày
    verified_plus: 5000000,     // 5,000,000 V-pearls / 365 ngày
  };

  const PLAN_NAMES: Record<string, string> = {
    verified_basic: "Verified Basic (Dùng Thử 5 Ngày)",
    verified_standard: "Verified Standard (Dùng Thử 10 Ngày)",
    verified: "Verified (1 Tháng VIP)",
    verified_plus: "Verified PLUS (1 Năm VIP)",
  };

  const handleClaimDaily = () => {
    if (dailyClaimed) return;
    const bonus = 50;
    setVCoins((prev) => prev + bonus);
    const today = new Date().toDateString();
    localStorage.setItem("vplay_last_daily_claim", today);
    setDailyClaimed(true);
    setDailyBonusToast(true);
    setTimeout(() => {
      setDailyBonusToast(false);
    }, 4000);
  };

  const handlePurchase = (plan: "verified_basic" | "verified_standard" | "verified" | "verified_plus") => {
    const price = PLAN_PRICES[plan];
    if (vCoins < price) {
      setErrorModal({ required: price, current: vCoins });
      return;
    }
    setConfirmModal(plan);
  };

  const executePurchase = () => {
    if (!confirmModal) return;
    const plan = confirmModal;
    const price = PLAN_PRICES[plan];

    if (vCoins < price) {
      setConfirmModal(null);
      setErrorModal({ required: price, current: vCoins });
      return;
    }

    // Deduct ngọc
    setVCoins((prev) => prev - price);

    // Calculate expiration: Basic=5 days, Standard=10 days, Verified=30 days, Plus=365 days
    const durationDays = plan === "verified_basic" ? 5 : plan === "verified_standard" ? 10 : plan === "verified" ? 30 : 365;
    const now = Date.now();
    const newExpiresAt =
      verifiedSub.expiresAt && verifiedSub.expiresAt > now
        ? verifiedSub.expiresAt + durationDays * 24 * 60 * 60 * 1000
        : now + durationDays * 24 * 60 * 60 * 1000;

    setVerifiedSub({
      plan: plan,
      expiresAt: newExpiresAt,
    });

    setConfirmModal(null);
    setSuccessModal(plan);
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#07080a] text-white p-4 sm:p-6 md:p-10 font-sans selection:bg-amber-400 selection:text-black relative overflow-x-hidden">
      {/* Ambient Royal Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-amber-500/15 via-yellow-600/5 to-transparent blur-[120px] pointer-events-none -z-0" />
      <div className="absolute top-[600px] right-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none -z-0" />

      {/* Daily Claim Toast */}
      {dailyBonusToast && (
        <div className="fixed top-6 right-6 z-[9999] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black px-6 py-3.5 rounded-2xl shadow-[0_10px_30px_rgba(245,158,11,0.5)] font-black flex items-center gap-3 animate-bounce">
          <Coins className="w-6 h-6 shrink-0 fill-black" />
          <div>
            <div className="text-[10px] uppercase tracking-wider opacity-80 font-bold">Thành Công</div>
            <div className="text-sm">+50 V-pearls Điểm Danh Hàng Ngày!</div>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/20 relative z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-400 flex items-center justify-center transition-all cursor-pointer group shadow-lg"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5 text-amber-300 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-[11px] font-black uppercase text-amber-300 tracking-wider">
                VPLAY OFFICIAL VIP
              </span>
              <BadgeCheck className="w-6 h-6 text-amber-400 fill-amber-400/20 shrink-0" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent mt-0.5">
              Vplay Verified Membership
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              Gói dịch vụ đặc quyền cao cấp sử dụng 100% V-pearls tích lũy hoàn toàn miễn phí
            </p>
          </div>
        </div>

        {/* Current Balance & Daily Bonus Pill */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-600/15 border border-amber-500/40 px-4 py-2.5 rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.2)] w-full sm:w-auto justify-between sm:justify-start backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-md shrink-0">
              <div className="w-full h-full rounded-[10px] bg-black flex items-center justify-center">
                <Coins className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-extrabold text-amber-300/80 tracking-wider">Số dư V-pearls</div>
              <div className="text-base sm:text-lg font-black text-amber-300 font-mono tracking-tight">
                {vCoins.toLocaleString()} <span className="text-xs text-amber-400/80 font-sans">V-pearls</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClaimDaily}
            disabled={dailyClaimed}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 shadow-lg ${
              dailyClaimed
                ? "bg-zinc-800/80 text-zinc-500 border border-zinc-700/60 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-black shadow-amber-500/30 cursor-pointer active:scale-95"
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>{dailyClaimed ? "Đã điểm danh" : "+50 Free"}</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto py-8 space-y-12 relative z-10">

        {/* 1. HOLOGRAPHIC VIP MEMBER CARD & STATUS BANNER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* HOLOGRAPHIC ROYAL CARD */}
          <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 opacity-70 blur-xl group-hover:opacity-100 transition duration-500" />
            
            <div className="relative rounded-[28px] bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950/80 border-2 border-amber-500/60 p-6 sm:p-7 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[260px] sm:min-h-[280px]">
              
              {/* Card Background Pattern */}
              <div className="absolute -right-12 -bottom-12 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

              {/* Card Top */}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center font-black text-black text-xs shadow-md">
                    VP
                  </div>
                  <span className="font-black text-sm tracking-wider uppercase text-amber-300">
                    VPLAY VIP PASS
                  </span>
                </div>
                {verifiedSub.plan === "verified_plus" ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-black text-[10px] uppercase shadow-md">
                    <Crown className="w-3.5 h-3.5 fill-black" />
                    <span>VERIFIED PLUS</span>
                  </div>
                ) : verifiedSub.plan === "verified" ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/30 border border-amber-400/50 text-amber-300 font-bold text-[10px] uppercase">
                    <BadgeCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>VERIFIED MEMBER</span>
                  </div>
                ) : verifiedSub.plan === "verified_standard" ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/30 border border-amber-400/50 text-amber-300 font-bold text-[10px] uppercase">
                    <BadgeCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>VERIFIED STANDARD</span>
                  </div>
                ) : verifiedSub.plan === "verified_basic" ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 font-bold text-[10px] uppercase">
                    <BadgeCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>VERIFIED BASIC</span>
                  </div>
                ) : (
                  <div className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px] font-bold uppercase">
                    STANDARD MEMBER
                  </div>
                )}
              </div>

              {/* Card Chip & Hologram Icon */}
              <div className="my-6 flex items-center justify-between relative z-10">
                {/* Metallic Gold Chip */}
                <div className="w-12 h-9 rounded-lg bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-600 p-0.5 shadow-md">
                  <div className="w-full h-full bg-zinc-950/80 rounded-[6px] border border-amber-300/40 grid grid-cols-2 gap-0.5 p-1">
                    <div className="border border-amber-400/30 rounded-xs" />
                    <div className="border border-amber-400/30 rounded-xs" />
                    <div className="border border-amber-400/30 rounded-xs" />
                    <div className="border border-amber-400/30 rounded-xs" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-10 h-10 text-amber-400 fill-amber-400/20 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
                </div>
              </div>

              {/* Card Bottom: User Info */}
              <div className="relative z-10 pt-2 border-t border-white/10 flex items-end justify-between">
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Tên Tài Khoản</div>
                  <div className="text-base font-black text-white flex items-center gap-2 mt-0.5">
                    <span>Vplay Member</span>
                    {verifiedSub.plan !== "none" && (
                      <BadgeCheck className="w-4 h-4 text-amber-400 inline shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-amber-400/80 mt-0.5">
                    ID: 888-VP-VERIFIED-VIP
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Hạn Thẻ</div>
                  <div className="text-xs font-mono font-bold text-amber-300 mt-0.5">
                    {verifiedSub.expiresAt ? formatDate(verifiedSub.expiresAt) : "Chưa kích hoạt"}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE HERO DESCRIPTION */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
              <span>Thế Hệ Tài Khoản VIP Đỉnh Cao Vplay</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Tối Ưu Trải Nghiệm Giải Trí Với <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Đặc Quyền Verified</span>
            </h2>

            <p className="text-sm text-zinc-300 leading-relaxed">
              Trở thành hội viên chính chủ của hệ sinh thái truyền hình trực tuyến Vplay. Tự do sở hữu huy hiệu tích vàng uy tín, thưởng thức Live TV Server 4K tốc độ cao không giật lag và nhân đôi tốc độ cày V-pearls mỗi ngày!
            </p>

            {/* Quick stats pills */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                <div className="text-lg font-black text-amber-400 font-mono">0 VNĐ</div>
                <div className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">Không Tốn Phí</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                <div className="text-lg font-black text-amber-400 font-mono">4K Ultra</div>
                <div className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">Server VIP</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                <div className="text-lg font-black text-amber-400 font-mono">X2 V-pearls</div>
                <div className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">Tốc Độ Cày</div>
              </div>
            </div>
          </div>

        </div>

        {/* TAB SWITCHER SECTIONS */}
        <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-zinc-900/90 border border-white/10 max-w-md mx-auto shadow-xl">
          <button
            onClick={() => setActiveTabSection("plans")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTabSection === "plans"
                ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Các Gói Verified
          </button>
          <button
            onClick={() => setActiveTabSection("comparison")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTabSection === "comparison"
                ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Bảng So Sánh Quyền Lợi
          </button>
          <button
            onClick={() => setActiveTabSection("earning")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTabSection === "earning"
                ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Cách Tích V-pearls
          </button>
        </div>

        {/* SECTION 1: PLANS CARDS (4 PACKAGES) */}
        {activeTabSection === "plans" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            
            {/* PLAN 1: VERIFIED BASIC - 5 DAYS TRIAL (10,000 V-PEARLS) */}
            <div className="relative rounded-3xl bg-zinc-950/90 border border-zinc-700/60 hover:border-amber-400/60 p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_10px_30px_rgba(245,158,11,0.15)] group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase">
                    Thử Nghiệm 5 Ngày
                  </div>
                  <BadgeCheck className="w-6 h-6 text-amber-400/80" />
                </div>

                <h3 className="text-xl font-black text-white">Verified Basic</h3>
                <p className="text-xs text-zinc-400 mt-1">Trải nghiệm nhanh đặc quyền Tích Xanh 5 ngày</p>

                <div className="my-4 pb-4 border-b border-white/10">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">10,000</span>
                    <span className="text-xs font-bold text-zinc-400">V-pearls / 5 ngày</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1">Cực kỳ dễ tích lũy cho người mới bắt đầu</p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2 text-xs text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Huy hiệu <strong>Tích Xanh Verified</strong> (5 ngày)</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Xem Live TV chất lượng <strong>Full HD 1080p</strong></span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Giảm thiểu quảng cáo che màn hình</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Trải nghiệm Mạng Xã Hội V-Flow</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handlePurchase("verified_basic")}
                className="w-full py-3 rounded-2xl bg-zinc-900 hover:bg-amber-400 hover:text-black text-white font-black text-xs border border-amber-500/30 hover:border-amber-300 transition-all cursor-pointer flex items-center justify-center gap-2 group-hover:bg-amber-400 group-hover:text-black shadow-md"
              >
                <Coins className="w-4 h-4" />
                <span>Basic (10.000 V-pearls)</span>
              </button>
            </div>

            {/* PLAN 2: VERIFIED STANDARD - 10 DAYS TRIAL (100,000 V-PEARLS) */}
            <div className="relative rounded-3xl bg-zinc-950/90 border border-amber-500/40 hover:border-amber-400/80 p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_10px_35px_rgba(245,158,11,0.2)] group">
              {/* Highlight Ribbon */}
              <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider shadow-md">
                HOT 10 Ngày
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase">
                    Thử Nghiệm 10 Ngày
                  </div>
                  <BadgeCheck className="w-6 h-6 text-amber-400" />
                </div>

                <h3 className="text-xl font-black text-white">Verified Standard</h3>
                <p className="text-xs text-zinc-400 mt-1">Trải nghiệm chuẩn mực 10 ngày với Tích Xanh & Server 4K</p>

                <div className="my-4 pb-4 border-b border-white/10">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">100,000</span>
                    <span className="text-xs font-bold text-zinc-400">V-pearls / 10 ngày</span>
                  </div>
                  <p className="text-[10px] text-amber-300/80 mt-1">Tiết kiệm và đầy đủ đặc quyền 10 ngày</p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2 text-xs text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Huy hiệu <strong>Tích Xanh VIP</strong> chính chủ (10 ngày)</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Xem Live TV & Shorts <strong>Server 4K Ultra HD</strong></span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Loại bỏ 100% quảng cáo</strong> gây phiền phức</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Tốc độ phát truyền hình mượt mà không delay</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handlePurchase("verified_standard")}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-400 hover:to-yellow-300 text-amber-300 hover:text-black font-black text-xs border border-amber-400/50 hover:border-amber-300 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <Coins className="w-4 h-4" />
                <span>Standard (100.000 V-pearls)</span>
              </button>
            </div>

            {/* PLAN 3: VERIFIED 1 MONTH (1,000,000 V-PEARLS) */}
            <div className="relative rounded-3xl bg-zinc-950/90 border border-amber-500/50 hover:border-amber-400 p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_10px_40px_rgba(245,158,11,0.25)] group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase">
                    Gói 1 Tháng Phổ Biến
                  </div>
                  <BadgeCheck className="w-7 h-7 text-amber-400" />
                </div>

                <h3 className="text-xl font-black text-white">Verified 1 Tháng</h3>
                <p className="text-xs text-zinc-400 mt-1">Trọn vẹn 30 ngày trải nghiệm chuẩn 4K Ultra HD</p>

                <div className="my-4 pb-4 border-b border-white/10">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">1,000,000</span>
                    <span className="text-xs font-bold text-zinc-400">V-pearls / 30 ngày</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1">Đầy đủ tính năng cao cấp không giới hạn</p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2 text-xs text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Huy hiệu <strong>Tích Xanh Verified VIP</strong> chính chủ</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Xem Live TV & Shorts <strong>Server 4K Ultra HD Low-Latency</strong></span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Loại bỏ 100% quảng cáo</strong> che mắt</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Đăng bài & chia sẻ trên Mạng Xã Hội V-Flow</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handlePurchase("verified")}
                className="w-full py-3 rounded-2xl bg-zinc-900 hover:bg-amber-400 hover:text-black text-white font-black text-xs border border-amber-500/40 hover:border-amber-300 transition-all cursor-pointer flex items-center justify-center gap-2 group-hover:bg-amber-400 group-hover:text-black group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
              >
                <Coins className="w-4 h-4" />
                <span>Verified (1.000.000 V-pearls)</span>
              </button>
            </div>

            {/* PLAN 4: VERIFIED PLUS 1 YEAR (5,000,000 V-PEARLS) */}
            <div className="relative rounded-3xl bg-gradient-to-b from-amber-950/40 via-zinc-950 to-zinc-950 border-2 border-amber-400 p-5 sm:p-6 flex flex-col justify-between shadow-[0_15px_50px_rgba(245,158,11,0.25)]">
              {/* Gold Crown Ribbon */}
              <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 animate-pulse">
                <Crown className="w-3.5 h-3.5 fill-black" />
                <span>Khuyên Dùng - Rẻ Hơn 58%</span>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black border border-amber-400/50">
                    Đặc Quyền Hoàng Gia 1 Năm
                  </div>
                  <Crown className="w-7 h-7 text-amber-400" />
                </div>

                <h3 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                  Verified PLUS (1 Năm)
                </h3>
                <p className="text-xs text-amber-200/80 mt-1">Trọn bộ đặc quyền cao cấp nhất cùng Tích Vàng Hoàng Gia</p>

                <div className="my-4 pb-4 border-b border-amber-500/30">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">5,000,000</span>
                    <span className="text-xs font-bold text-amber-200">V-pearls / 365 ngày</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-emerald-400" />
                    <span>Tiết kiệm 58% so với gia hạn hàng tháng!</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2 text-xs text-amber-100 font-bold bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 fill-amber-400" />
                    <span><strong>X2 Tốc độ cày V-pearls</strong> (+20 V-pearls/phút khi xem phim & live)</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-zinc-100">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Huy hiệu Tích Vàng VIP Hoàng Gia</strong></span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-zinc-100">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Ưu tiên Server truyền hình riêng biệt tốc độ cực cao</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-zinc-100">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Hỗ trợ kỹ thuật riêng & chăm sóc VIP 24/7</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handlePurchase("verified_plus")}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-black font-black text-xs shadow-[0_10px_25px_rgba(245,158,11,0.5)] transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4 fill-black" />
                <span>Nâng Cấp PLUS (5.000.000 V-pearls)</span>
              </button>
            </div>

          </div>
        )}

        {/* SECTION 2: COMPARISON MATRIX */}
        {activeTabSection === "comparison" && (
          <div className="rounded-3xl bg-zinc-950/80 border border-amber-500/30 overflow-hidden shadow-2xl p-6 sm:p-8">
            <h3 className="text-xl font-black text-white text-center mb-6">
              So Sánh Chi Tiết Quyền Lợi Hội Viên Vplay
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase text-zinc-400">
                    <th className="py-4 px-4 font-bold">Tính Năng / Đặc Quyền</th>
                    <th className="py-4 px-3 font-bold text-center">Standard (Free)</th>
                    <th className="py-4 px-3 font-bold text-center text-amber-200">Basic (5 ngày)</th>
                    <th className="py-4 px-3 font-bold text-center text-amber-300">Standard (10 ngày)</th>
                    <th className="py-4 px-3 font-bold text-center text-amber-400">Verified (1T)</th>
                    <th className="py-4 px-3 font-bold text-center text-amber-300 bg-amber-500/10 rounded-t-xl">PLUS (1N)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
                  <tr>
                    <td className="py-4 px-4 font-semibold text-white">Huy hiệu Tích xanh / Tích vàng</td>
                    <td className="py-4 px-3 text-center text-zinc-500">—</td>
                    <td className="py-4 px-3 text-center text-amber-300">Tích Xanh</td>
                    <td className="py-4 px-3 text-center text-amber-300">Tích Xanh</td>
                    <td className="py-4 px-3 text-center text-amber-400 font-bold">Tích Xanh VIP</td>
                    <td className="py-4 px-3 text-center text-amber-300 font-black bg-amber-500/10">Tích Vàng Hoàng Gia</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold text-white">Chất lượng phát Live TV & Shorts</td>
                    <td className="py-4 px-3 text-center text-zinc-400">720p HD</td>
                    <td className="py-4 px-3 text-center text-amber-200">1080p Full HD</td>
                    <td className="py-4 px-3 text-center text-amber-300">4K Ultra HD</td>
                    <td className="py-4 px-3 text-center text-amber-300 font-bold">4K Ultra HD</td>
                    <td className="py-4 px-3 text-center text-amber-300 font-black bg-amber-500/10">4K Ultra HD VIP</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold text-white">Trải nghiệm xem phim</td>
                    <td className="py-4 px-3 text-center text-zinc-400">Có quảng cáo</td>
                    <td className="py-4 px-3 text-center text-emerald-300">Giảm QC</td>
                    <td className="py-4 px-3 text-center text-emerald-400">Tắt Quảng Cáo</td>
                    <td className="py-4 px-3 text-center text-emerald-400 font-bold">Tắt Quảng Cáo</td>
                    <td className="py-4 px-3 text-center text-emerald-400 font-black bg-amber-500/10">Tắt Quảng Cáo 100%</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold text-white">Tốc độ cày V-pearls khi giải trí</td>
                    <td className="py-4 px-3 text-center text-zinc-300">10 V-pearls / phút</td>
                    <td className="py-4 px-3 text-center text-amber-200">10 V-pearls / phút</td>
                    <td className="py-4 px-3 text-center text-amber-300">10 V-pearls / phút</td>
                    <td className="py-4 px-3 text-center text-amber-300 font-bold">10 V-pearls / phút</td>
                    <td className="py-4 px-3 text-center text-amber-400 font-black bg-amber-500/10">20 V-pearls / phút (X2)</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold text-white">Server đường truyền ưu tiên</td>
                    <td className="py-4 px-3 text-center text-zinc-500">Mặc định</td>
                    <td className="py-4 px-3 text-center text-zinc-300">Tiêu chuẩn</td>
                    <td className="py-4 px-3 text-center text-amber-200">Tốc Độ Cao</td>
                    <td className="py-4 px-3 text-center text-amber-300 font-bold">Tốc Độ Cao</td>
                    <td className="py-4 px-3 text-center text-amber-300 font-black bg-amber-500/10">Server VIP Độc Quyền</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold text-white">Mạng xã hội V-Flow VIP</td>
                    <td className="py-4 px-3 text-center text-zinc-500">Chỉ xem</td>
                    <td className="py-4 px-3 text-center text-emerald-400">Đăng & Bình luận</td>
                    <td className="py-4 px-3 text-center text-emerald-400">Đăng & Bình luận</td>
                    <td className="py-4 px-3 text-center text-emerald-400 font-bold">Đăng & Bình luận</td>
                    <td className="py-4 px-3 text-center text-amber-300 font-black bg-amber-500/10">Ưu Tiên Hiển Thị</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 3: EARNING GUIDE */}
        {activeTabSection === "earning" && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <h3 className="text-2xl font-black text-white">
                Kiếm V-pearls Miễn Phí Rất Đơn Giản
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Không cần nạp tiền thật! Chỉ cần thưởng thức truyền hình và video ngắn trên Vplay để cày V-pearls
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-3xl bg-zinc-950/80 border border-white/10 hover:border-red-500/50 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                    <Tv className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-black text-white">Xem Truyền Hình Live TV</h4>
                  <p className="text-xs text-zinc-400">
                    Mỗi phút xem trực tiếp các kênh VTV, HTV, Thể thao... sẽ tự động nhận V-pearls
                  </p>
                </div>
                <div>
                  <div className="text-base font-black text-amber-400 font-mono">+10 V-pearls/phút</div>
                  <button
                    onClick={() => onNavigateToTab("live")}
                    className="mt-3 w-full py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs transition-all cursor-pointer"
                  >
                    Mở Live TV Ngay
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-zinc-950/80 border border-white/10 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                    <Film className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-black text-white">Xem Video Ngắn Vertical</h4>
                  <p className="text-xs text-zinc-400">
                    Lướt video giải trí ngắn chuẩn Shorts/TikTok cực cuốn nhận V-pearls tự động
                  </p>
                </div>
                <div>
                  <div className="text-base font-black text-amber-400 font-mono">+10 V-pearls/phút</div>
                  <button
                    onClick={() => onNavigateToTab("shorts")}
                    className="mt-3 w-full py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-xs transition-all cursor-pointer"
                  >
                    Mở Vertical Shorts
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-zinc-950/80 border border-white/10 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Gift className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-black text-white">Điểm Danh Mỗi Ngày</h4>
                  <p className="text-xs text-zinc-400">
                    Bấm nhận quà điểm danh hàng ngày hoàn toàn free chỉ với 1 click
                  </p>
                </div>
                <div>
                  <div className="text-base font-black text-amber-400 font-mono">+50 V-pearls/ngày</div>
                  <button
                    onClick={handleClaimDaily}
                    disabled={dailyClaimed}
                    className={`mt-3 w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                      dailyClaimed
                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                        : "bg-amber-500 text-black hover:bg-amber-400 cursor-pointer"
                    }`}
                  >
                    {dailyClaimed ? "Đã Nhận Hôm Nay" : "Nhận 50 V-pearls Free"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* MODAL: CONFIRM PURCHASE */}
      {confirmModal && (
        <div className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-zinc-950 border border-amber-500/50 p-6 sm:p-8 text-center space-y-6 shadow-2xl relative">
            <button
              onClick={() => setConfirmModal(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center mx-auto text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              <BadgeCheck className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Xác Nhận Đăng Ký Verified</h3>
              <p className="text-xs text-zinc-400 mt-2">
                Bạn sắp nâng cấp tài khoản lên gói{" "}
                <strong className="text-amber-300">
                  {PLAN_NAMES[confirmModal]}
                </strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2 text-xs text-left">
              <div className="flex justify-between">
                <span className="text-zinc-400">Giá gói nâng cấp:</span>
                <span className="font-mono font-bold text-amber-400">
                  {PLAN_PRICES[confirmModal].toLocaleString()} V-pearls
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Số dư hiện có:</span>
                <span className="font-mono font-bold text-white">
                  {vCoins.toLocaleString()} V-pearls
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="text-zinc-400">Số dư còn lại:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {(vCoins - PLAN_PRICES[confirmModal]).toLocaleString()} V-pearls
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={executePurchase}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-black font-extrabold text-xs shadow-lg cursor-pointer"
              >
                Xác Nhận Nâng Cấp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ERROR NOT ENOUGH NGỌC */}
      {errorModal && (
        <div className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-zinc-950 border border-red-500/50 p-6 sm:p-8 text-center space-y-6 shadow-2xl relative">
            <button
              onClick={() => setErrorModal(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center mx-auto text-red-400">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Không Đủ V-pearls</h3>
              <p className="text-xs text-zinc-400 mt-2">
                Bạn còn thiếu{" "}
                <strong className="text-amber-400 font-mono">
                  {(errorModal.required - errorModal.current).toLocaleString()} V-pearls
                </strong>{" "}
                để đăng ký gói này.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Chi phí gói:</span>
                <span className="font-mono font-bold text-amber-400">
                  {errorModal.required.toLocaleString()} V-pearls
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Số dư hiện tại:</span>
                <span className="font-mono font-bold text-red-400">
                  {errorModal.current.toLocaleString()} V-pearls
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {!dailyClaimed && (
                <button
                  onClick={() => {
                    setErrorModal(null);
                    handleClaimDaily();
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-extrabold text-xs shadow-md cursor-pointer"
                >
                  Nhận Ngay +50 Free V-pearls Điểm Danh
                </button>
              )}
              <button
                onClick={() => {
                  setErrorModal(null);
                  onNavigateToTab("live");
                }}
                className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs cursor-pointer"
              >
                Xem Live TV Để Tích Thêm V-pearls (+10 V-pearls/phút)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SUCCESS */}
      {successModal && (
        <div className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-zinc-950 via-zinc-950 to-amber-950/60 border-2 border-amber-400 p-6 sm:p-8 text-center space-y-6 shadow-[0_0_60px_rgba(245,158,11,0.4)] relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 p-0.5 mx-auto shadow-[0_0_35px_rgba(245,158,11,0.6)]">
              <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-amber-400">
                <Crown className="w-10 h-10 animate-bounce" />
              </div>
            </div>

            <div>
              <div className="inline-block px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
                KÍCH HOẠT HỘI VIÊN VIP
              </div>
              <h3 className="text-2xl font-black text-white">Đăng Ký Verified Thành Công!</h3>
              <p className="text-xs text-zinc-300 mt-2">
                Tài khoản Vplay của bạn đã được nâng cấp chính thức lên gói{" "}
                <strong className="text-amber-400">
                  {PLAN_NAMES[successModal]}
                </strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 text-left space-y-1.5">
              <div className="flex items-center gap-2 font-black text-amber-300">
                <BadgeCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Đã kích hoạt Tích vàng & Server 4K Ultra HD!</span>
              </div>
              <p className="text-[11px] text-zinc-400 pl-6">
                Tận hưởng trọn vẹn toàn bộ dịch vụ truyền hình và giải trí không giới hạn ngay bây giờ.
              </p>
            </div>

            <button
              onClick={() => setSuccessModal(null)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black font-black text-sm shadow-[0_10px_30px_rgba(245,158,11,0.4)] cursor-pointer"
            >
              Trải Nghiệm Ngay
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
