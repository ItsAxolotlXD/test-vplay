import React, { useState } from 'react';
import { playPopSound } from '../utils/sound';
import { VplayPrimaryButton } from './ui/VplayPrimaryButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { VplayTab } from './ui/VplayTab';
import { VBankTab } from './vapps';
import VerifiedTab from './VerifiedTab';
import {
  Crown,
  HardDrive,
  Building2,
  BadgeCheck,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  QrCode,
  X,
  CreditCard,
  Cloud,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export type VPremiumSubTab = 'storage' | 'vbank' | 'verified';

interface StoragePlan {
  id: string;
  name: string;
  size: string;
  priceMonth: string;
  priceYear: string;
  popular?: boolean;
  color: string;
  badge: string;
  features: string[];
}

const STORAGE_PLANS: StoragePlan[] = [
  {
    id: 'basic_50gb',
    name: 'Gói Cơ Bản (Basic)',
    size: '50 GB',
    priceMonth: '19.000đ',
    priceYear: '190.000đ',
    color: 'border-sky-500 bg-sky-950/30',
    badge: 'Tiết kiệm',
    features: [
      'Lưu trữ hơn 50+ Playlist M3U8',
      'Đồng bộ ghi chú V-Notes không giới hạn',
      'Sao lưu cài đặt TV Channel cá nhân',
      'Badge Đồng Vplay Cloud Member',
    ],
  },
  {
    id: 'pro_200gb',
    name: 'Gói Pro Ore (Popular)',
    size: '200 GB',
    priceMonth: '69.000đ',
    priceYear: '690.000đ',
    popular: true,
    color: 'border-emerald-400 bg-[#28960b]/30',
    badge: 'Khuyên Dùng ★',
    features: [
      'Dung lượng 200 GB siêu tốc độ',
      'Lưu trữ video offline Vplay TV HD',
      'Tặng kèm Badge V-Bank Gold',
      'x2 Tốc độ phát truyền hình m3u8',
      'Hỗ trợ ưu tiên 24/7',
    ],
  },
  {
    id: 'diamond_2tb',
    name: 'Gói Diamond Cloud',
    size: '2.000 GB (2 TB)',
    priceMonth: '225.000đ',
    priceYear: '2.250.000đ',
    color: 'border-[#2dd4bf] bg-[#0f766e]/30',
    badge: 'Đẳng Cấp',
    features: [
      '2.000 GB dung lượng đám mây Vplay',
      'Tặng kèm Vplay Verified (Tích Xanh) miễn phí',
      'Chia sẻ dung lượng cho 5 thành viên',
      'Tải xuống video 4K HDR siêu tốc',
      'Miễn phí toàn bộ giao diện Ore UI Premium',
    ],
  },
];

export const VPremiumView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<VPremiumSubTab>('storage');
  const [currentUsageGb, setCurrentUsageGb] = useState<number>(8.4);
  const [maxCapacityGb, setMaxCapacityGb] = useState<number>(15);
  const [selectedPlan, setSelectedPlan] = useState<StoragePlan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'month' | 'year'>('month');
  const [isBuyModalOpen, setIsBuyModalOpen] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const usagePercent = Math.min(100, Math.round((currentUsageGb / maxCapacityGb) * 100));

  const handleOpenBuyPlan = (plan: StoragePlan) => {
    playPopSound();
    setSelectedPlan(plan);
    setPaymentSuccess(false);
    setIsBuyModalOpen(true);
  };

  const handleConfirmPayment = () => {
    playPopSound();
    setPaymentSuccess(true);

    // Increase storage capacity dynamically after payment
    setTimeout(() => {
      if (selectedPlan) {
        if (selectedPlan.id === 'basic_50gb') setMaxCapacityGb(50);
        if (selectedPlan.id === 'pro_200gb') setMaxCapacityGb(200);
        if (selectedPlan.id === 'diamond_2tb') setMaxCapacityGb(2000);
      }
    }, 1200);
  };

  return (
    <div className="space-y-4 select-none">
      {/* HEADER BAR FOR V-PREMIUM */}
      <div className="bg-[#2d2f32] border-2 border-[#141414] p-3 sm:p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-600 border-2 border-[#141414] flex items-center justify-center text-white shrink-0 shadow-[inset_2px_2px_0_#fbbf24,inset_-2px_-2px_0_#78350f]">
            <Crown className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider font-jura">
                VPLAY PREMIUM SUITE
              </h2>
              <span className="bg-amber-400 text-[#141414] px-2 py-0.5 text-[10px] font-bold font-mono border border-[#141414]">
                VIP MEMBER
              </span>
            </div>
            <p className="text-[11px] text-zinc-300 font-jura">
              Trọn bộ dịch vụ cao cấp: Nâng cấp Storage, Tài khoản V-Bank & Xác minh Vplay Verified.
            </p>
          </div>
        </div>

        {/* Sub-tab buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <VplayTab
            active={activeSubTab === 'storage'}
            onClick={() => {
              playPopSound();
              setActiveSubTab('storage');
            }}
            className="!py-2 !px-3 text-xs shrink-0"
          >
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-sky-400" />
              <span>Mua Storage</span>
            </span>
          </VplayTab>

          <VplayTab
            active={activeSubTab === 'vbank'}
            onClick={() => {
              playPopSound();
              setActiveSubTab('vbank');
            }}
            className="!py-2 !px-3 text-xs shrink-0"
          >
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>V-Bank</span>
            </span>
          </VplayTab>

          <VplayTab
            active={activeSubTab === 'verified'}
            onClick={() => {
              playPopSound();
              setActiveSubTab('verified');
            }}
            className="!py-2 !px-3 text-xs shrink-0"
          >
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified</span>
            </span>
          </VplayTab>
        </div>
      </div>

      {/* SUB-TAB 1: MUA STORAGE */}
      {activeSubTab === 'storage' && (
        <div className="space-y-4">
          {/* CURRENT STORAGE USAGE METER CARD */}
          <div className="bg-[#2d2f32] border-2 border-[#141414] p-4 sm:p-5 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Cloud className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-sm uppercase tracking-wide text-white font-jura">
                  DUNG LƯỢNG LƯU TRỮ HIỆN TẠI
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300">
                {currentUsageGb} GB / {maxCapacityGb} GB ({usagePercent}% Đã sử dụng)
              </span>
            </div>

            {/* Ore UI Progress Bar */}
            <div className="w-full h-5 bg-[#141414] border-2 border-[#141414] p-0.5 shadow-inner">
              <div
                className={`h-full transition-all duration-500 ${
                  usagePercent > 80 ? 'bg-rose-500' : usagePercent > 50 ? 'bg-amber-500' : 'bg-[#28960b]'
                } shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)]`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>

            <p className="text-[11px] text-zinc-300 font-mono">
              ★ Mẹo: Nâng cấp gói Pro 200GB hoặc Diamond 2TB để lưu trữ playlist M3U8 & video offline không lo hết dung lượng!
            </p>
          </div>

          {/* BILLING CYCLE SWITCHER */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="text-xs font-bold font-mono text-zinc-300">Chu kỳ thanh toán:</span>
            <button
              onClick={() => {
                playPopSound();
                setBillingCycle('month');
              }}
              className={`px-3 py-1 text-xs font-bold border-2 font-mono ${
                billingCycle === 'month'
                  ? 'bg-[#28960b] text-white border-white'
                  : 'bg-[#35383b] text-zinc-300 border-[#141414]'
              }`}
            >
              Theo tháng
            </button>
            <button
              onClick={() => {
                playPopSound();
                setBillingCycle('year');
              }}
              className={`px-3 py-1 text-xs font-bold border-2 font-mono flex items-center gap-1.5 ${
                billingCycle === 'year'
                  ? 'bg-[#28960b] text-white border-white'
                  : 'bg-[#35383b] text-zinc-300 border-[#141414]'
              }`}
            >
              <span>Theo năm</span>
              <span className="bg-amber-400 text-black px-1.5 py-0.2 text-[9px] font-black">GIẢM 20%</span>
            </button>
          </div>

          {/* STORAGE PLANS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STORAGE_PLANS.map((plan) => {
              const price = billingCycle === 'month' ? `${plan.priceMonth}/tháng` : `${plan.priceYear}/năm`;

              return (
                <div
                  key={plan.id}
                  className={`relative border-4 p-5 flex flex-col justify-between space-y-4 shadow-2xl ${
                    plan.popular
                      ? 'bg-[#2b332b] border-[#89dc69] shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]'
                      : 'bg-[#2d2f32] border-[#141414]'
                  }`}
                >
                  {/* Badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-[#141414] text-[10px] font-black uppercase tracking-wider px-3 py-0.5 border border-[#141414] shadow font-mono">
                      {plan.badge}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-sm text-white font-jura uppercase">{plan.name}</h4>
                      <span className="bg-[#141414] text-[#89dc69] font-mono text-xs px-2 py-0.5 border border-zinc-700 font-bold">
                        {plan.size}
                      </span>
                    </div>

                    <div className="pt-1">
                      <span className="text-2xl font-black text-white font-jura">{price}</span>
                      {billingCycle === 'year' && (
                        <p className="text-[10px] text-amber-300 font-mono">Tiết kiệm 2 tháng khi mua theo năm</p>
                      )}
                    </div>

                    <div className="border-t border-[#141414] pt-3 space-y-2">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-zinc-200 font-jura">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <VplayPrimaryButton
                    onClick={() => handleOpenBuyPlan(plan)}
                    className="!py-2.5 text-xs font-bold w-full uppercase tracking-wider"
                  >
                    MUA NGAY - {plan.size}
                  </VplayPrimaryButton>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: V-BANK */}
      {activeSubTab === 'vbank' && <VBankTab />}

      {/* SUB-TAB 3: VERIFIED */}
      {activeSubTab === 'verified' && <VerifiedTab />}

      {/* PAYMENT MODAL FOR STORAGE */}
      {isBuyModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-[99990] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="absolute inset-0" onClick={() => setIsBuyModalOpen(false)} />

          <div className="relative z-10 w-full max-w-lg bg-[#2b2d30] border-4 border-[#141414] shadow-2xl p-5 sm:p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-[#141414] pb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-sm sm:text-base text-white uppercase font-jura">
                  XÁC NHẬN MUA DUNG LƯỢNG VPLAY
                </h3>
              </div>
              <button
                onClick={() => setIsBuyModalOpen(false)}
                className="w-7 h-7 bg-[#c6c6c6] hover:bg-rose-600 hover:text-white text-black font-bold border-2 border-[#141414] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {paymentSuccess ? (
              <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-black text-lg text-white font-jura">THANH TOÁN THÀNH CÔNG!</h4>
                <p className="text-xs text-zinc-300 font-mono">
                  Dung lượng tài khoản Vplay của bạn đã được nâng cấp lên{' '}
                  <span className="text-emerald-400 font-bold">{selectedPlan.size}</span>.
                </p>
                <VplayPrimaryButton
                  onClick={() => setIsBuyModalOpen(false)}
                  className="!py-2 !px-6 text-xs max-w-[200px] mx-auto"
                >
                  Hoàn Tất
                </VplayPrimaryButton>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Plan Summary */}
                <div className="bg-[#1f2022] border-2 border-[#141414] p-3 space-y-1 font-mono text-xs">
                  <div className="flex justify-between text-zinc-300">
                    <span>Gói đã chọn:</span>
                    <span className="text-white font-bold">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>Dung lượng:</span>
                    <span className="text-emerald-400 font-bold">{selectedPlan.size}</span>
                  </div>
                  <div className="flex justify-between text-zinc-300 border-t border-zinc-700 pt-1 mt-1">
                    <span>Tổng tiền:</span>
                    <span className="text-amber-300 font-bold text-sm">
                      {billingCycle === 'month' ? selectedPlan.priceMonth : selectedPlan.priceYear}
                    </span>
                  </div>
                </div>

                {/* VietQR Simulation */}
                <div className="bg-white p-3 border-2 border-[#141414] flex flex-col items-center text-center text-black space-y-1">
                  <QrCode className="w-32 h-32 text-black" />
                  <p className="text-[10px] font-bold font-mono">Quét mã VietQR hoặc bấm Xác nhận dưới đây</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <VplaySecondaryButton
                    onClick={() => setIsBuyModalOpen(false)}
                    fullWidth={false}
                    className="!py-2 !px-4 text-xs"
                  >
                    Hủy
                  </VplaySecondaryButton>
                  <VplayPrimaryButton onClick={handleConfirmPayment} className="!py-2 text-xs font-bold flex-1">
                    Xác Nhận Thanh Toán (Mô Phỏng)
                  </VplayPrimaryButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
