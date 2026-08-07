import React, { useState, useEffect } from "react";
import {
  BadgeCheck,
  Coins,
  Sparkles,
  Check,
  Zap,
  Crown,
  Tv,
  Film,
  Gift,
  AlertCircle,
  CheckCircle2,
  X,
  HardDrive,
  Cloud,
  ChevronLeft
} from "lucide-react";
import { VplayPrimaryButton } from "./ui/VplayPrimaryButton";
import { VplaySecondaryButton } from "./ui/VplaySecondaryButton";
import { VplayTab } from "./ui/VplayTab";
import { playPopSound } from "../utils/sound";

export interface VerifiedSubState {
  plan: "none" | "verified_basic" | "verified_standard" | "verified" | "verified_plus";
  expiresAt: number | null;
}

interface VerifiedTabProps {
  onBack?: () => void;
  vCoins?: number;
  setVCoins?: React.Dispatch<React.SetStateAction<number>>;
  verifiedSub?: VerifiedSubState;
  setVerifiedSub?: React.Dispatch<React.SetStateAction<VerifiedSubState>>;
  onNavigateToTab?: (tab: string) => void;
  initialSection?: "plans" | "comparison" | "earning" | "storage";
}

export default function VerifiedTab({
  onBack,
  vCoins: externalVCoins,
  setVCoins: externalSetVCoins,
  verifiedSub: externalVerifiedSub,
  setVerifiedSub: externalSetVerifiedSub,
  onNavigateToTab,
  initialSection = "plans"
}: VerifiedTabProps) {
  const [internalVCoins, setInternalVCoins] = useState<number>(1000);
  const [internalVerifiedSub, setInternalVerifiedSub] = useState<VerifiedSubState>({
    plan: "none",
    expiresAt: null,
  });

  const vCoins = externalVCoins ?? internalVCoins;
  const setVCoins = externalSetVCoins ?? setInternalVCoins;
  const verifiedSub = externalVerifiedSub ?? internalVerifiedSub;
  const setVerifiedSub = externalSetVerifiedSub ?? setInternalVerifiedSub;
  const [confirmModal, setConfirmModal] = useState<"verified_basic" | "verified_standard" | "verified" | "verified_plus" | null>(null);
  const [errorModal, setErrorModal] = useState<{ required: number; current: number } | null>(null);
  const [successModal, setSuccessModal] = useState<"verified_basic" | "verified_standard" | "verified" | "verified_plus" | null>(null);
  const [storageSuccessModal, setStorageSuccessModal] = useState<{ name: string; gb: number } | null>(null);

  const [userStorageGb, setUserStorageGb] = useState<number>(() => {
    const saved = localStorage.getItem("vplay_user_cloud_storage");
    return saved ? parseInt(saved, 10) : 15;
  });

  const [dailyClaimed, setDailyClaimed] = useState<boolean>(() => {
    const today = new Date().toDateString();
    const lastClaim = localStorage.getItem("vplay_last_daily_claim");
    return lastClaim === today;
  });
  const [dailyBonusToast, setDailyBonusToast] = useState<boolean>(false);
  const [activeTabSection, setActiveTabSection] = useState<"plans" | "comparison" | "earning" | "storage">(initialSection);

  useEffect(() => {
    if (initialSection) {
      setActiveTabSection(initialSection);
    }
  }, [initialSection]);

  // Package Prices in Khoáng Thạch
  const PLAN_PRICES = {
    verified_basic: 10000,      // 10,000 Khoáng Thạch / 5 ngày
    verified_standard: 100000,   // 100,000 Khoáng Thạch / 10 ngày
    verified: 1000000,          // 1,000,000 Khoáng Thạch / 30 ngày
    verified_plus: 5000000,     // 5,000,000 Khoáng Thạch / 365 ngày
  };

  const PLAN_NAMES: Record<string, string> = {
    verified_basic: "Verified Basic (Dùng Thử 5 Ngày)",
    verified_standard: "Verified Standard (Dùng Thử 10 Ngày)",
    verified: "Verified (1 Tháng VIP)",
    verified_plus: "Verified PLUS (1 Năm VIP)",
  };

  const handleClaimDaily = () => {
    if (dailyClaimed) return;
    playPopSound();
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
    playPopSound();
    const price = PLAN_PRICES[plan];
    if (vCoins < price) {
      setErrorModal({ required: price, current: vCoins });
      return;
    }
    setConfirmModal(plan);
  };

  const handleBuyStorage = (gb: number, price: number, name: string) => {
    playPopSound();
    if (vCoins < price) {
      setErrorModal({ required: price, current: vCoins });
      return;
    }
    setVCoins((prev) => prev - price);
    setUserStorageGb((prev) => Math.max(prev, gb));
    localStorage.setItem("vplay_user_cloud_storage", Math.max(userStorageGb, gb).toString());
    setStorageSuccessModal({ name, gb });
  };

  const executePurchase = () => {
    if (!confirmModal) return;
    playPopSound();
    const plan = confirmModal;
    const price = PLAN_PRICES[plan];

    if (vCoins < price) {
      setConfirmModal(null);
      setErrorModal({ required: price, current: vCoins });
      return;
    }

    // Deduct Khoáng Thạch
    setVCoins((prev) => prev - price);

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
    if (!timestamp) return "Chưa kích hoạt";
    const date = new Date(timestamp);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#242628] text-white p-2 sm:p-4 md:p-6 font-jura select-none space-y-4">
      {/* Daily Claim Toast */}
      {dailyBonusToast && (
        <div className="fixed top-4 right-4 z-[9999] bg-[#28960b] text-white border-2 border-[#141414] px-4 py-2.5 shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] flex items-center gap-2.5 font-bold">
          <Coins className="w-5 h-5 shrink-0 text-amber-300" />
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider opacity-90">THÀNH CÔNG</div>
            <div className="text-xs">+50 Khoáng Thạch Điểm Danh Hàng Ngày!</div>
          </div>
        </div>
      )}

      {/* Top Header Bar - Authentic Minecraft Bedrock Ore UI Panel */}
      <div className="bg-[#2d2f32] border-2 border-[#141414] p-3 sm:p-4 shadow-[inset_2px_2px_0_#5a5d61,inset_-2px_-2px_0_#1e2022] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <VplaySecondaryButton
              onClick={() => {
                playPopSound();
                onBack();
              }}
              title="Quay lại"
              fullWidth={false}
              size="sm"
              className="!w-9 !h-9 !p-0 shrink-0"
            >
              <ChevronLeft className="w-5 h-5 text-[#141414]" />
            </VplaySecondaryButton>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#a855f7] text-white px-2 py-0.5 text-[10px] font-bold font-mono border border-[#141414]">
                VPLAY OFFICIAL VIP
              </span>
              <BadgeCheck className="w-5 h-5 text-purple-400 shrink-0" />
            </div>
            <h1 className="text-lg sm:text-2xl font-black uppercase text-white font-jura tracking-wider mt-0.5">
              VPLAY VERIFIED MEMBERSHIP
            </h1>
            <p className="text-xs text-zinc-300 font-jura mt-0.5">
              Gói dịch vụ đặc quyền cao cấp với huy hiệu Tích Tím chính chủ và nhiều ưu đãi VIP
            </p>
          </div>
        </div>

        {/* Current Balance & Daily Bonus Pill */}
        <div className="flex items-center gap-3 bg-[#1e2022] border-2 border-[#141414] px-3.5 py-2 shadow-[inset_2px_2px_0_#101112] w-full md:w-auto justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Coins className="w-5 h-5 text-purple-400 shrink-0 animate-pulse" />
            <div>
              <div className="text-[9px] uppercase font-mono text-zinc-400 font-bold">Số dư Khoáng Thạch</div>
              <div className="text-sm sm:text-base font-extrabold text-purple-300 font-mono">
                {vCoins.toLocaleString()} <span className="text-xs text-purple-400/80 font-jura">Khoáng Thạch</span>
              </div>
            </div>
          </div>
          <VplayPrimaryButton
            onClick={handleClaimDaily}
            disabled={dailyClaimed}
            className="!py-1.5 !px-3 text-xs font-bold shrink-0"
          >
            <Gift className="w-3.5 h-3.5 inline mr-1" />
            <span>{dailyClaimed ? "Đã nhận" : "+50 Free"}</span>
          </VplayPrimaryButton>
        </div>
      </div>

      {/* Main Container */}
      <div className="space-y-4">

        {/* 1. ORE UI VIP MEMBER CARD & HERO BANNER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* ORE UI VIP MEMBER CARD */}
          <div className="lg:col-span-5 relative">
            <div className="bg-[#2d2f32] border-4 border-purple-500 p-4 sm:p-5 shadow-[inset_2px_2px_0_#c084fc,inset_-2px_-2px_0_#581c87] flex flex-col justify-between min-h-[220px] h-full">
              
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-purple-600 border-2 border-[#141414] flex items-center justify-center font-black text-white text-xs font-mono shadow-[inset_1px_1px_0_#c084fc]">
                    VP
                  </div>
                  <span className="font-extrabold text-xs tracking-wider uppercase text-purple-300 font-jura">
                    VPLAY VIP PURPLE PASS
                  </span>
                </div>
                {verifiedSub.plan === "verified_plus" ? (
                  <span className="bg-[#a855f7] text-white font-black text-[10px] uppercase px-2 py-0.5 border border-[#141414] flex items-center gap-1 font-mono">
                    <Crown className="w-3 h-3 fill-white" />
                    <span>VERIFIED PLUS</span>
                  </span>
                ) : verifiedSub.plan !== "none" ? (
                  <span className="bg-purple-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 border border-[#141414] flex items-center gap-1 font-mono">
                    <BadgeCheck className="w-3 h-3" />
                    <span>VERIFIED MEMBER</span>
                  </span>
                ) : (
                  <span className="bg-[#383b3e] text-zinc-400 text-[10px] font-bold uppercase px-2 py-0.5 border border-[#141414] font-mono">
                    STANDARD MEMBER
                  </span>
                )}
              </div>

              {/* Card Chip & Hologram Icon */}
              <div className="my-4 flex items-center justify-between">
                <div className="w-11 h-8 bg-purple-500 border-2 border-[#141414] p-1 grid grid-cols-2 gap-0.5 shadow-[inset_1px_1px_0_#e9d5ff]">
                  <div className="border border-black/40 bg-purple-700/50" />
                  <div className="border border-black/40 bg-purple-700/50" />
                  <div className="border border-black/40 bg-purple-700/50" />
                  <div className="border border-black/40 bg-purple-700/50" />
                </div>

                <BadgeCheck className="w-9 h-9 text-purple-400" />
              </div>

              {/* Card Footer: User Info */}
              <div className="pt-2 border-t-2 border-[#141414] flex items-end justify-between">
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Chủ Thẻ VIP</div>
                  <div className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-0.5 font-jura">
                    <span>Vplay Member</span>
                    {verifiedSub.plan !== "none" && (
                      <BadgeCheck className="w-4 h-4 text-purple-400 inline shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-purple-300 mt-0.5">
                    ID: 888-VP-VERIFIED-VIP
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Hạn Thẻ</div>
                  <div className="text-xs font-mono font-bold text-purple-300 mt-0.5">
                    {formatDate(verifiedSub.expiresAt)}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE HERO DESCRIPTION */}
          <div className="lg:col-span-7 bg-[#2d2f32] border-4 border-[#141414] p-4 sm:p-5 shadow-[inset_2px_2px_0_#5a5d61,inset_-2px_-2px_0_#1e2022] flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#1e2022] border border-[#141414] text-purple-300 text-xs font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Thế Hệ Tài Khoản VIP Đỉnh Cao Vplay</span>
              </div>

              <h2 className="text-base sm:text-xl font-black text-white leading-snug uppercase font-jura">
                Tối Ưu Trải Nghiệm Giải Trí Với <span className="text-purple-400">Đặc Quyền Verified Tím</span>
              </h2>

              <p className="text-xs text-zinc-300 leading-relaxed font-jura">
                Trở thành hội viên chính chủ của hệ sinh thái truyền hình trực tuyến Vplay. Tự do sở hữu huy hiệu tích tím uy tín, thưởng thức Live TV Server 4K tốc độ cao không giật lag và nhân đôi tốc độ cày Khoáng Thạch mỗi ngày!
              </p>
            </div>

            {/* Quick stats pills */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="p-2 bg-[#1f2123] border-2 border-[#141414] text-center">
                <div className="text-sm font-extrabold text-amber-300 font-mono">0 VNĐ</div>
                <div className="text-[9px] text-zinc-400 font-bold uppercase mt-0.5 font-jura">Không Tốn Phí</div>
              </div>
              <div className="p-2 bg-[#1f2123] border-2 border-[#141414] text-center">
                <div className="text-sm font-extrabold text-amber-300 font-mono">4K Ultra</div>
                <div className="text-[9px] text-zinc-400 font-bold uppercase mt-0.5 font-jura">Server VIP</div>
              </div>
              <div className="p-2 bg-[#1f2123] border-2 border-[#141414] text-center">
                <div className="text-sm font-extrabold text-amber-300 font-mono">x2 Tốc Độ</div>
                <div className="text-[9px] text-zinc-400 font-bold uppercase mt-0.5 font-jura">Cày Khoáng Thạch</div>
              </div>
            </div>
          </div>

        </div>

        {/* TAB SWITCHER SECTIONS (Ore UI Horizontal Tabs) */}
        <div className="bg-[#2a2c2e] border-2 border-[#141414] p-1 shadow-lg flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar">
          <VplayTab
            active={activeTabSection === "plans"}
            onClick={() => {
              playPopSound();
              setActiveTabSection("plans");
            }}
            className="flex-1 !py-2 text-xs font-bold"
          >
            Các Gói Verified
          </VplayTab>

          <VplayTab
            active={activeTabSection === "comparison"}
            onClick={() => {
              playPopSound();
              setActiveTabSection("comparison");
            }}
            className="flex-1 !py-2 text-xs font-bold"
          >
            Bảng So Sánh
          </VplayTab>

          <VplayTab
            active={activeTabSection === "earning"}
            onClick={() => {
              playPopSound();
              setActiveTabSection("earning");
            }}
            className="flex-1 !py-2 text-xs font-bold"
          >
            Tích Khoáng Thạch
          </VplayTab>

          <VplayTab
            active={activeTabSection === "storage"}
            onClick={() => {
              playPopSound();
              setActiveTabSection("storage");
            }}
            className="flex-1 !py-2 text-xs font-bold"
          >
            <span className="flex items-center justify-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-sky-400" />
              <span>Mua Storage</span>
            </span>
          </VplayTab>
        </div>

        {/* SECTION 1: PLANS CARDS (4 PACKAGES) */}
        {activeTabSection === "plans" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* PLAN 1: VERIFIED BASIC - 5 DAYS TRIAL (10,000 KHOÁNG THẠCH) */}
            <div className="bg-[#2d2f32] border-4 border-[#141414] p-4 flex flex-col justify-between space-y-4 shadow-[inset_2px_2px_0_#5a5d61,inset_-2px_-2px_0_#1e2022]">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-[#1e2022] text-purple-300 border border-[#141414] text-[10px] font-bold uppercase px-2 py-0.5 font-mono">
                    Thử Nghiệm 5 Ngày
                  </span>
                  <BadgeCheck className="w-5 h-5 text-purple-400" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-white uppercase font-jura">Verified Basic</h3>
                  <p className="text-[11px] text-zinc-300 font-jura">Trải nghiệm nhanh đặc quyền Tích Tím 5 ngày</p>
                </div>

                <div className="py-2 border-y-2 border-[#141414]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-purple-300 font-mono">10.000</span>
                    <span className="text-xs font-bold text-zinc-300 font-jura">Khoáng Thạch / 5 ngày</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5 font-jura">Dễ tích lũy cho người mới bắt đầu</p>
                </div>

                {/* Features */}
                <div className="space-y-2 text-xs text-zinc-200 font-jura">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Huy hiệu <strong>Tích Tím Verified</strong> (5 ngày)</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Xem Live TV chất lượng <strong>Full HD 1080p</strong></span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Giảm thiểu quảng cáo che màn hình</span>
                  </div>
                </div>
              </div>

              <VplayPrimaryButton
                onClick={() => handlePurchase("verified_basic")}
                variant="purple"
                className="!py-2 text-xs font-bold w-full"
              >
                <Coins className="w-3.5 h-3.5 inline mr-1" /> Basic (10.000 ore)
              </VplayPrimaryButton>
            </div>

            {/* PLAN 2: VERIFIED STANDARD - 10 DAYS TRIAL (100,000 KHOÁNG THẠCH) */}
            <div className="bg-[#2d2f32] border-4 border-[#141414] p-4 flex flex-col justify-between space-y-4 shadow-[inset_2px_2px_0_#5a5d61,inset_-2px_-2px_0_#1e2022] relative">
              <div className="absolute -top-3 right-3 bg-purple-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 border border-[#141414] font-mono">
                HOT 10 Ngày
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-[#1e2022] text-purple-300 border border-[#141414] text-[10px] font-bold uppercase px-2 py-0.5 font-mono">
                    Thử Nghiệm 10 Ngày
                  </span>
                  <BadgeCheck className="w-5 h-5 text-purple-400" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-white uppercase font-jura">Verified Standard</h3>
                  <p className="text-[11px] text-zinc-300 font-jura">Trải nghiệm chuẩn mực 10 ngày với Tích Tím & Server 4K</p>
                </div>

                <div className="py-2 border-y-2 border-[#141414]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-purple-300 font-mono">100.000</span>
                    <span className="text-xs font-bold text-zinc-300 font-jura">Khoáng Thạch / 10 ngày</span>
                  </div>
                  <p className="text-[10px] text-purple-300 mt-0.5 font-jura">Tiết kiệm và đầy đủ đặc quyền 10 ngày</p>
                </div>

                {/* Features */}
                <div className="space-y-2 text-xs text-zinc-200 font-jura">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Huy hiệu <strong>Tích Tím VIP</strong> chính chủ</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Xem Live TV & Shorts <strong>Server 4K Ultra HD</strong></span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span><strong>Loại bỏ 100% quảng cáo</strong> gây phiền phức</span>
                  </div>
                </div>
              </div>

              <VplayPrimaryButton
                onClick={() => handlePurchase("verified_standard")}
                variant="purple"
                className="!py-2 text-xs font-bold w-full"
              >
                <Coins className="w-3.5 h-3.5 inline mr-1" /> Standard (100.000 ore)
              </VplayPrimaryButton>
            </div>

            {/* PLAN 3: VERIFIED 1 MONTH (1,000,000 KHOÁNG THẠCH) */}
            <div className="bg-[#2d2f32] border-4 border-purple-600 p-4 flex flex-col justify-between space-y-4 shadow-[inset_2px_2px_0_#c084fc,inset_-2px_-2px_0_#581c87]">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-purple-900/60 text-purple-200 border border-purple-500 text-[10px] font-bold uppercase px-2 py-0.5 font-mono">
                    Gói 1 Tháng VIP
                  </span>
                  <BadgeCheck className="w-5 h-5 text-purple-400" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-white uppercase font-jura">Verified 1 Tháng</h3>
                  <p className="text-[11px] text-zinc-300 font-jura">Trọn vẹn 30 ngày trải nghiệm chuẩn 4K Ultra HD</p>
                </div>

                <div className="py-2 border-y-2 border-[#141414]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-purple-300 font-mono">1.000.000</span>
                    <span className="text-xs font-bold text-zinc-300 font-jura">Khoáng Thạch / 30 ngày</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5 font-jura">Đầy đủ tính năng cao cấp không giới hạn</p>
                </div>

                {/* Features */}
                <div className="space-y-2 text-xs text-zinc-200 font-jura">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Huy hiệu <strong>Tích Tím Verified VIP</strong> chính chủ</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Xem Live TV & Shorts <strong>Server 4K Ultra HD Low-Latency</strong></span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span><strong>Loại bỏ 100% quảng cáo</strong> che mắt</span>
                  </div>
                </div>
              </div>

              <VplayPrimaryButton
                onClick={() => handlePurchase("verified")}
                variant="purple"
                className="!py-2 text-xs font-bold w-full"
              >
                <Coins className="w-3.5 h-3.5 inline mr-1" /> Verified (1.000.000 ore)
              </VplayPrimaryButton>
            </div>

            {/* PLAN 4: VERIFIED PLUS 1 YEAR (5,000,000 KHOÁNG THẠCH) */}
            <div className="bg-[#3b1d54] border-4 border-purple-400 p-4 flex flex-col justify-between space-y-4 shadow-[inset_2px_2px_0_#e9d5ff,inset_-2px_-2px_0_#581c87] relative">
              <div className="absolute -top-3 right-3 bg-purple-500 text-white text-[10px] font-black uppercase px-2 py-0.5 border border-[#141414] font-mono flex items-center gap-1">
                <Crown className="w-3 h-3 fill-white" />
                <span>Rẻ Hơn 58%</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-[#1e2022] text-purple-300 border border-[#141414] text-[10px] font-bold uppercase px-2 py-0.5 font-mono">
                    Hoàng Gia 1 Năm
                  </span>
                  <Crown className="w-6 h-6 text-purple-300" />
                </div>

                <div>
                  <h3 className="text-base font-black text-purple-200 uppercase font-jura">Verified PLUS (1 Năm)</h3>
                  <p className="text-[11px] text-purple-200/80 font-jura">Trọn bộ đặc quyền cao cấp nhất cùng Tích Tím VIP</p>
                </div>

                <div className="py-2 border-y-2 border-[#141414]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-purple-200 font-mono">5.000.000</span>
                    <span className="text-xs font-bold text-purple-200 font-jura">Khoáng Thạch / 365 ngày</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold mt-0.5 flex items-center gap-1 font-jura">
                    <Zap className="w-3 h-3 text-emerald-400" />
                    <span>Tiết kiệm 58% so với gia hạn hàng tháng!</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 text-xs text-purple-100 font-jura">
                  <div className="flex items-start gap-1.5 bg-[#1e2022]/60 p-1.5 border border-purple-400/30">
                    <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span><strong>x2 Tốc độ cày Khoáng Thạch</strong> (+20 Khoáng Thạch/phút)</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
                    <span><strong>Huy hiệu Tích Tím VIP Hoàng Gia</strong></span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
                    <span>Ưu tiên Server truyền hình riêng biệt tốc độ cực cao</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handlePurchase("verified_plus")}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs border-2 border-[#141414] shadow-[inset_2px_2px_0_#c084fc,inset_-2px_-2px_0_#3b0764] flex items-center justify-center gap-1.5 uppercase font-jura active:translate-y-[1px] cursor-default"
              >
                <Crown className="w-4 h-4 fill-white" />
                <span>Nâng Cấp PLUS (5.000.000 ore)</span>
              </button>
            </div>

          </div>
        )}

        {/* SECTION 2: COMPARISON MATRIX */}
        {activeTabSection === "comparison" && (
          <div className="bg-[#2d2f32] border-4 border-[#141414] p-4 sm:p-5 shadow-[inset_2px_2px_0_#5a5d61,inset_-2px_-2px_0_#1e2022] space-y-4">
            <h3 className="text-base font-extrabold text-white text-center uppercase font-jura">
              So Sánh Chi Tiết Quyền Lợi Hội Viên Vplay
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px] font-jura text-xs">
                <thead>
                  <tr className="bg-[#1f2022] border-2 border-[#141414] text-zinc-300 uppercase font-mono">
                    <th className="py-2.5 px-3 font-bold">Tính Năng / Đặc Quyền</th>
                    <th className="py-2.5 px-2 font-bold text-center">Standard</th>
                    <th className="py-2.5 px-2 font-bold text-center text-purple-200">Basic (5 ngày)</th>
                    <th className="py-2.5 px-2 font-bold text-center text-purple-300">Standard (10 ngày)</th>
                    <th className="py-2.5 px-2 font-bold text-center text-purple-400">Verified (1T)</th>
                    <th className="py-2.5 px-2 font-bold text-center text-purple-300 bg-[#3b1d54]">PLUS (1N)</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#141414] text-xs">
                  <tr className="bg-[#27292c]">
                    <td className="py-2.5 px-3 font-bold text-white">Huy hiệu Tích Tím / VIP</td>
                    <td className="py-2.5 px-2 text-center text-zinc-500">—</td>
                    <td className="py-2.5 px-2 text-center text-purple-300">Tích Tím</td>
                    <td className="py-2.5 px-2 text-center text-purple-300">Tích Tím</td>
                    <td className="py-2.5 px-2 text-center text-purple-400 font-bold">Tích Tím VIP</td>
                    <td className="py-2.5 px-2 text-center text-purple-300 font-black bg-[#3b1d54]">Tích Tím Hoàng Gia</td>
                  </tr>
                  <tr className="bg-[#2d2f32]">
                    <td className="py-2.5 px-3 font-bold text-white">Chất lượng phát Live TV & Shorts</td>
                    <td className="py-2.5 px-2 text-center text-zinc-400">720p HD</td>
                    <td className="py-2.5 px-2 text-center text-purple-200">1080p Full HD</td>
                    <td className="py-2.5 px-2 text-center text-purple-300">4K Ultra HD</td>
                    <td className="py-2.5 px-2 text-center text-purple-300 font-bold">4K Ultra HD</td>
                    <td className="py-2.5 px-2 text-center text-purple-300 font-black bg-[#3b1d54]">4K Ultra HD VIP</td>
                  </tr>
                  <tr className="bg-[#27292c]">
                    <td className="py-2.5 px-3 font-bold text-white">Trải nghiệm xem phim</td>
                    <td className="py-2.5 px-2 text-center text-zinc-400">Có quảng cáo</td>
                    <td className="py-2.5 px-2 text-center text-emerald-300">Giảm QC</td>
                    <td className="py-2.5 px-2 text-center text-emerald-400">Tắt Quảng Cáo</td>
                    <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">Tắt Quảng Cáo</td>
                    <td className="py-2.5 px-2 text-center text-emerald-400 font-black bg-[#3b1d54]">Tắt Quảng Cáo 100%</td>
                  </tr>
                  <tr className="bg-[#2d2f32]">
                    <td className="py-2.5 px-3 font-bold text-white">Tốc độ cày Khoáng Thạch khi giải trí</td>
                    <td className="py-2.5 px-2 text-center text-zinc-300">10 Khoáng Thạch / phút</td>
                    <td className="py-2.5 px-2 text-center text-purple-200">10 Khoáng Thạch / phút</td>
                    <td className="py-2.5 px-2 text-center text-purple-300">10 Khoáng Thạch / phút</td>
                    <td className="py-2.5 px-2 text-center text-purple-300 font-bold">10 Khoáng Thạch / phút</td>
                    <td className="py-2.5 px-2 text-center text-purple-400 font-black bg-[#3b1d54]">20 Khoáng Thạch / phút (x2)</td>
                  </tr>
                  <tr className="bg-[#27292c]">
                    <td className="py-2.5 px-3 font-bold text-white">Server đường truyền ưu tiên</td>
                    <td className="py-2.5 px-2 text-center text-zinc-500">Mặc định</td>
                    <td className="py-2.5 px-2 text-center text-zinc-300">Tiêu chuẩn</td>
                    <td className="py-2.5 px-2 text-center text-purple-200">Tốc Độ Cao</td>
                    <td className="py-2.5 px-2 text-center text-purple-300 font-bold">Tốc Độ Cao</td>
                    <td className="py-2.5 px-2 text-center text-purple-300 font-black bg-[#3b1d54]">Server VIP Độc Quyền</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 3: EARNING GUIDE */}
        {activeTabSection === "earning" && (
          <div className="bg-[#2d2f32] border-4 border-[#141414] p-4 sm:p-5 shadow-[inset_2px_2px_0_#5a5d61,inset_-2px_-2px_0_#1e2022] space-y-4">
            <div className="text-center max-w-xl mx-auto">
              <h3 className="text-base font-black text-white uppercase font-jura">
                Tích Khoáng Thạch Miễn Phí Rất Đơn Giản
              </h3>
              <p className="text-xs text-zinc-300 mt-1 font-jura">
                Không cần nạp tiền thật! Chỉ cần thưởng thức truyền hình và video ngắn trên Vplay để cày Khoáng Thạch
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              
              <div className="p-4 bg-[#1f2123] border-2 border-[#141414] flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-[#cc1827] border-2 border-[#141414] flex items-center justify-center text-white font-bold">
                    <Tv className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-extrabold text-white font-jura">Xem Truyền Hình Live TV</h4>
                  <p className="text-xs text-zinc-300 font-jura">
                    Mỗi phút xem trực tiếp các kênh VTV, HTV, Thể thao... sẽ tự động nhận Khoáng Thạch
                  </p>
                </div>
                <div>
                  <div className="text-sm font-extrabold text-amber-400 font-mono">+10 Khoáng Thạch / phút</div>
                  <VplaySecondaryButton
                    onClick={() => onNavigateToTab?.("live_tv")}
                    className="mt-2 w-full text-xs py-1.5"
                  >
                    Mở Live TV Ngay
                  </VplaySecondaryButton>
                </div>
              </div>

              <div className="p-4 bg-[#1f2123] border-2 border-[#141414] flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-purple-600 border-2 border-[#141414] flex items-center justify-center text-white font-bold">
                    <Film className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-extrabold text-white font-jura">Xem Video Vertical</h4>
                  <p className="text-xs text-zinc-300 font-jura">
                    Lướt video giải trí ngắn chuẩn Shorts/TikTok cực cuốn nhận Khoáng Thạch tự động
                  </p>
                </div>
                <div>
                  <div className="text-sm font-extrabold text-amber-400 font-mono">+10 Khoáng Thạch / phút</div>
                  <VplaySecondaryButton
                    onClick={() => onNavigateToTab?.("vertical")}
                    className="mt-2 w-full text-xs py-1.5"
                  >
                    Mở Vertical Shorts
                  </VplaySecondaryButton>
                </div>
              </div>

              <div className="p-4 bg-[#1f2123] border-2 border-[#141414] flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-amber-600 border-2 border-[#141414] flex items-center justify-center text-white font-bold">
                    <Gift className="w-5 h-5 text-amber-200" />
                  </div>
                  <h4 className="text-sm font-extrabold text-white font-jura">Điểm Danh Mỗi Ngày</h4>
                  <p className="text-xs text-zinc-300 font-jura">
                    Bấm nhận quà điểm danh hàng ngày hoàn toàn free chỉ với 1 click
                  </p>
                </div>
                <div>
                  <div className="text-sm font-extrabold text-amber-400 font-mono">+50 Khoáng Thạch / ngày</div>
                  <VplayPrimaryButton
                    onClick={handleClaimDaily}
                    disabled={dailyClaimed}
                    className="mt-2 w-full text-xs py-1.5"
                  >
                    {dailyClaimed ? "Đã Nhận Hôm Nay" : "Nhận 50 ore Free"}
                  </VplayPrimaryButton>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 4: MUA STORAGE CLOUD */}
        {activeTabSection === "storage" && (
          <div className="space-y-4">
            {/* Current Storage Usage Banner */}
            <div className="bg-[#2d2f32] border-4 border-[#141414] p-4 sm:p-5 shadow-[inset_2px_2px_0_#5a5d61,inset_-2px_-2px_0_#1e2022]">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-sky-400" />
                    <span className="text-xs font-bold text-sky-400 uppercase font-mono">
                      Dung Lượng Lưu Trữ Hiện Tại
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-black text-white font-jura mt-1">
                    {userStorageGb} GB Cloud Storage VIP
                  </h2>
                  <p className="text-xs text-zinc-300 mt-0.5 font-jura">
                    Lưu trữ video 4K, bản sao lưu truyền hình, tài liệu học tập V-Study và dữ liệu Mạng Xã Hội với tốc độ siêu nhanh.
                  </p>
                </div>

                <div className="bg-[#1f2022] border-2 border-[#141414] p-3 w-full md:w-64 shrink-0">
                  <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
                    <span className="text-zinc-400">Đã dùng: 2.8 GB</span>
                    <span className="text-sky-300">{userStorageGb} GB</span>
                  </div>
                  <div className="w-full h-4 bg-[#141414] border border-[#141414] p-0.5">
                    <div
                      className="h-full bg-sky-400"
                      style={{ width: `${Math.min(100, (2.8 / userStorageGb) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Storage Package Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Package 1: 100 GB */}
              <div className="bg-[#2d2f32] border-4 border-[#141414] p-4 flex flex-col justify-between space-y-4 shadow-[inset_2px_2px_0_#5a5d61,inset_-2px_-2px_0_#1e2022]">
                <div className="space-y-3">
                  <span className="bg-[#1e2022] text-sky-400 border border-[#141414] text-[10px] font-bold uppercase px-2 py-0.5 font-mono">
                    Lưu Trữ Cơ Bản
                  </span>
                  <h3 className="text-base font-extrabold text-white font-jura">Cloud Basic 100 GB</h3>
                  <div className="py-2 border-y-2 border-[#141414]">
                    <div className="text-lg font-extrabold text-sky-300 font-mono">5.000 Khoáng Thạch</div>
                    <div className="text-[10px] text-zinc-400 font-jura">Thanh toán theo tháng</div>
                  </div>
                  <div className="space-y-1.5 text-xs text-zinc-300 font-jura">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Dung lượng <strong>100 GB</strong> tốc độ cao</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Tự động đồng bộ V-Box</span>
                    </div>
                  </div>
                </div>

                <VplaySecondaryButton
                  onClick={() => handleBuyStorage(100, 5000, "Cloud Basic 100 GB")}
                  className="!py-2 text-xs font-bold w-full"
                >
                  <HardDrive className="w-3.5 h-3.5 inline mr-1" /> Mua 100 GB (5.000 ore)
                </VplaySecondaryButton>
              </div>

              {/* Package 2: 500 GB */}
              <div className="bg-[#2d2f32] border-4 border-[#141414] p-4 flex flex-col justify-between space-y-4 shadow-[inset_2px_2px_0_#5a5d61,inset_-2px_-2px_0_#1e2022] relative">
                <div className="absolute -top-3 right-3 bg-sky-400 text-black text-[10px] font-bold uppercase px-2 py-0.5 border border-[#141414] font-mono">
                  Phổ Biến
                </div>
                <div className="space-y-3">
                  <span className="bg-[#1e2022] text-sky-400 border border-[#141414] text-[10px] font-bold uppercase px-2 py-0.5 font-mono">
                    Lưu Trữ Chuẩn
                  </span>
                  <h3 className="text-base font-extrabold text-white font-jura">Cloud Standard 500 GB</h3>
                  <div className="py-2 border-y-2 border-[#141414]">
                    <div className="text-lg font-extrabold text-sky-300 font-mono">18.000 Khoáng Thạch</div>
                    <div className="text-[10px] text-zinc-400 font-jura">Thanh toán theo tháng</div>
                  </div>
                  <div className="space-y-1.5 text-xs text-zinc-300 font-jura">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Dung lượng <strong>500 GB</strong> tốc độ cao</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Lưu kho video Live TV & V-Box</span>
                    </div>
                  </div>
                </div>

                <VplayPrimaryButton
                  onClick={() => handleBuyStorage(500, 18000, "Cloud Standard 500 GB")}
                  className="!py-2 text-xs font-bold w-full"
                >
                  <HardDrive className="w-3.5 h-3.5 inline mr-1" /> Mua 500 GB (18.000 ore)
                </VplayPrimaryButton>
              </div>

              {/* Package 3: 1 TB */}
              <div className="bg-[#2d2f32] border-4 border-[#141414] p-4 flex flex-col justify-between space-y-4 shadow-[inset_2px_2px_0_#5a5d61,inset_-2px_-2px_0_#1e2022] relative">
                <div className="absolute -top-3 right-3 bg-amber-400 text-black text-[10px] font-bold uppercase px-2 py-0.5 border border-[#141414] font-mono">
                  BESTSELLER
                </div>
                <div className="space-y-3">
                  <span className="bg-[#1e2022] text-amber-300 border border-[#141414] text-[10px] font-bold uppercase px-2 py-0.5 font-mono">
                    Đẳng Cấp Pro
                  </span>
                  <h3 className="text-base font-extrabold text-white font-jura">Cloud Pro 1 TB</h3>
                  <div className="py-2 border-y-2 border-[#141414]">
                    <div className="text-lg font-extrabold text-amber-300 font-mono">35.000 Khoáng Thạch</div>
                    <div className="text-[10px] text-zinc-400 font-jura">Thanh toán theo tháng</div>
                  </div>
                  <div className="space-y-1.5 text-xs text-zinc-300 font-jura">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Dung lượng <strong>1.000 GB (1 TB)</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Lưu kho phim 4K không nén</span>
                    </div>
                  </div>
                </div>

                <VplayPrimaryButton
                  onClick={() => handleBuyStorage(1000, 35000, "Cloud Pro 1 TB")}
                  className="!py-2 text-xs font-bold w-full"
                >
                  <HardDrive className="w-3.5 h-3.5 inline mr-1" /> Mua 1 TB (35.000 ore)
                </VplayPrimaryButton>
              </div>

              {/* Package 4: 2 TB */}
              <div className="bg-[#2d2f32] border-4 border-[#141414] p-4 flex flex-col justify-between space-y-4 shadow-[inset_2px_2px_0_#5a5d61,inset_-2px_-2px_0_#1e2022]">
                <div className="space-y-3">
                  <span className="bg-[#1e2022] text-purple-400 border border-[#141414] text-[10px] font-bold uppercase px-2 py-0.5 font-mono">
                    Tối Thượng Ultimate
                  </span>
                  <h3 className="text-base font-extrabold text-white font-jura">Cloud Ultimate 2 TB</h3>
                  <div className="py-2 border-y-2 border-[#141414]">
                    <div className="text-lg font-extrabold text-purple-300 font-mono">60.000 Khoáng Thạch</div>
                    <div className="text-[10px] text-zinc-400 font-jura">Thanh toán theo tháng</div>
                  </div>
                  <div className="space-y-1.5 text-xs text-zinc-300 font-jura">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Dung lượng <strong>2.000 GB (2 TB)</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Máy chủ Dedicated Cloud</span>
                    </div>
                  </div>
                </div>

                <VplaySecondaryButton
                  onClick={() => handleBuyStorage(2000, 60000, "Cloud Ultimate 2 TB")}
                  className="!py-2 text-xs font-bold w-full"
                >
                  <HardDrive className="w-3.5 h-3.5 inline mr-1" /> Mua 2 TB (60.000 ore)
                </VplaySecondaryButton>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: CONFIRM PURCHASE (Minecraft Bedrock Ore UI Modal) */}
      {confirmModal && (
        <div className="fixed inset-0 z-[100000] bg-black/80 flex items-center justify-center p-3 font-jura select-none">
          <div className="w-full max-w-md bg-[#2d2f32] border-4 border-[#141414] p-5 sm:p-6 text-center space-y-4 shadow-[inset_2px_2px_0_#5a5d61,inset_-2px_-2px_0_#1e2022] relative">
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setConfirmModal(null);
              }}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-amber-500/20 border-2 border-[#141414] flex items-center justify-center mx-auto text-amber-400">
              <BadgeCheck className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-black text-white uppercase">XÁC NHẬN ĐĂNG KÝ VERIFIED</h3>
              <p className="text-xs text-zinc-300 mt-1">
                Bạn sắp nâng cấp tài khoản lên gói{" "}
                <strong className="text-amber-300">
                  {PLAN_NAMES[confirmModal]}
                </strong>
              </p>
            </div>

            <div className="p-3 bg-[#1e2022] border-2 border-[#141414] space-y-1.5 text-xs text-left font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-400">Giá nâng cấp:</span>
                <span className="font-bold text-amber-400">
                  {PLAN_PRICES[confirmModal].toLocaleString()} Khoáng Thạch
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Số dư hiện tại:</span>
                <span className="font-bold text-white">
                  {vCoins.toLocaleString()} Khoáng Thạch
                </span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-[#141414]">
                <span className="text-zinc-400">Còn lại sau nâng cấp:</span>
                <span className="font-bold text-emerald-400">
                  {(vCoins - PLAN_PRICES[confirmModal]).toLocaleString()} Khoáng Thạch
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <VplaySecondaryButton
                onClick={() => {
                  playPopSound();
                  setConfirmModal(null);
                }}
                className="flex-1 !py-2 text-xs"
              >
                Hủy bỏ
              </VplaySecondaryButton>
              <VplayPrimaryButton
                onClick={executePurchase}
                className="flex-1 !py-2 text-xs font-bold"
              >
                Xác Nhận Nâng Cấp
              </VplayPrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ERROR NOT ENOUGH KHOÁNG THẠCH */}
      {errorModal && (
        <div className="fixed inset-0 z-[100000] bg-black/80 flex items-center justify-center p-3 font-jura select-none">
          <div className="w-full max-w-md bg-[#2d2f32] border-4 border-[#141414] p-5 sm:p-6 text-center space-y-4 shadow-[inset_2px_2px_0_#5a5d61,inset_-2px_-2px_0_#1e2022] relative">
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setErrorModal(null);
              }}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-[#cc1827]/20 border-2 border-[#141414] flex items-center justify-center mx-auto text-rose-400">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-black text-white uppercase">KHÔNG ĐỦ KHOÁNG THẠCH</h3>
              <p className="text-xs text-zinc-300 mt-1">
                Bạn còn thiếu{" "}
                <strong className="text-amber-400 font-mono">
                  {(errorModal.required - errorModal.current).toLocaleString()} Khoáng Thạch
                </strong>{" "}
                để đăng ký gói này.
              </p>
            </div>

            <div className="p-3 bg-[#1e2022] border-2 border-[#141414] space-y-1.5 text-xs text-left font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-400">Chi phí gói:</span>
                <span className="font-bold text-purple-400">
                  {errorModal.required.toLocaleString()} Khoáng Thạch
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Số dư hiện tại:</span>
                <span className="font-bold text-rose-400">
                  {errorModal.current.toLocaleString()} Khoáng Thạch
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              {!dailyClaimed && (
                <VplayPrimaryButton
                  onClick={() => {
                    setErrorModal(null);
                    handleClaimDaily();
                  }}
                  className="w-full !py-2 text-xs font-bold"
                >
                  Nhận Ngay +50 Free Khoáng Thạch Điểm Danh
                </VplayPrimaryButton>
              )}
              <VplaySecondaryButton
                onClick={() => {
                  playPopSound();
                  setErrorModal(null);
                  onNavigateToTab?.("live_tv");
                }}
                className="w-full !py-2 text-xs"
              >
                Xem Live TV Để Tích Thêm Khoáng Thạch (+10 ore/phút)
              </VplaySecondaryButton>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SUCCESS */}
      {successModal && (
        <div className="fixed inset-0 z-[100000] bg-black/85 flex items-center justify-center p-3 font-jura select-none">
          <div className="w-full max-w-md bg-[#2d2f32] border-4 border-purple-500 p-5 sm:p-6 text-center space-y-4 shadow-[inset_2px_2px_0_#c084fc,inset_-2px_-2px_0_#581c87] relative">
            <div className="w-16 h-16 bg-purple-600/20 border-2 border-[#141414] flex items-center justify-center mx-auto text-purple-400">
              <Crown className="w-9 h-9 animate-bounce" />
            </div>

            <div>
              <span className="bg-[#a855f7] text-white text-[10px] font-bold uppercase px-2.5 py-0.5 border border-[#141414] font-mono">
                KÍCH HOẠT HỘI VIÊN VIP TÍM
              </span>
              <h3 className="text-lg font-black text-white uppercase mt-2">Đăng Ký Verified Thành Công!</h3>
              <p className="text-xs text-zinc-300 mt-1">
                Tài khoản Vplay của bạn đã được nâng cấp chính thức lên gói{" "}
                <strong className="text-purple-300">
                  {PLAN_NAMES[successModal]}
                </strong>
              </p>
            </div>

            <div className="p-3 bg-[#1e2022] border-2 border-[#141414] text-xs text-purple-200 text-left space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-purple-300">
                <BadgeCheck className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Đã kích hoạt Tích Tím & Server 4K Ultra HD!</span>
              </div>
              <p className="text-[11px] text-zinc-400 pl-5 font-jura">
                Tận hưởng trọn vẹn toàn bộ dịch vụ truyền hình và giải trí không giới hạn ngay bây giờ.
              </p>
            </div>

            <VplayPrimaryButton
              onClick={() => {
                playPopSound();
                setSuccessModal(null);
              }}
              className="w-full !py-2.5 text-xs font-bold"
            >
              Trải Nghiệm Ngay
            </VplayPrimaryButton>
          </div>
        </div>
      )}

      {/* MODAL: STORAGE SUCCESS */}
      {storageSuccessModal && (
        <div className="fixed inset-0 z-[100000] bg-black/85 flex items-center justify-center p-3 font-jura select-none">
          <div className="w-full max-w-md bg-[#2d2f32] border-4 border-sky-400 p-5 sm:p-6 text-center space-y-4 shadow-[inset_2px_2px_0_#7dd3fc,inset_-2px_-2px_0_#075985] relative">
            <div className="w-16 h-16 bg-sky-500/20 border-2 border-[#141414] flex items-center justify-center mx-auto text-sky-400">
              <HardDrive className="w-9 h-9 animate-pulse" />
            </div>

            <div>
              <span className="bg-sky-400 text-[#141414] text-[10px] font-bold uppercase px-2.5 py-0.5 border border-[#141414] font-mono">
                KÍCH HOẠT DUNG LƯỢNG CLOUD
              </span>
              <h3 className="text-lg font-black text-white uppercase mt-2">Mua Storage Thành Công!</h3>
              <p className="text-xs text-zinc-300 mt-1">
                Dung lượng lưu trữ của bạn đã được nâng lên{" "}
                <strong className="text-sky-300">{storageSuccessModal.gb} GB Cloud Storage VIP</strong>
              </p>
            </div>

            <VplayPrimaryButton
              onClick={() => {
                playPopSound();
                setStorageSuccessModal(null);
              }}
              className="w-full !py-2.5 text-xs font-bold"
            >
              Hoàn Tất & Sử Dụng
            </VplayPrimaryButton>
          </div>
        </div>
      )}

    </div>
  );
}
