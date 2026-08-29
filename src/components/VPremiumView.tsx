import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playPopSound } from '../utils/sound';
import { VBankTab } from './vapps';
import VerifiedTab from './VerifiedTab';
import {
  Waves,
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
  TrendingUp,
  Award,
  Layers,
  Flame,
  Star,
} from 'lucide-react';

export type VPremiumSubTab = 'vbank' | 'storage' | 'verified';

interface StoragePlan {
  id: string;
  name: string;
  size: string;
  priceMonth: string;
  priceYear: string;
  popular?: boolean;
  color: string;
  gradient: string;
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
    color: 'border-sky-400/30 shadow-sky-500/10',
    gradient: 'from-sky-500/15 via-blue-900/20 to-indigo-900/30',
    badge: 'Tiết kiệm',
    features: [
      'Lưu trữ hơn 50+ Playlist M3U8',
      'Đồng bộ ghi chú V-Notes không giới hạn',
      'Sao lưu cài đặt V-Play Channel cá nhân',
      'Badge Đồng Waves Cloud Member',
    ],
  },
  {
    id: 'pro_200gb',
    name: 'Gói Pro Cloud (Popular)',
    size: '200 GB',
    priceMonth: '69.000đ',
    priceYear: '690.000đ',
    popular: true,
    color: 'border-emerald-400/50 shadow-emerald-500/20 ring-2 ring-emerald-400/40',
    gradient: 'from-emerald-500/20 via-teal-900/30 to-cyan-900/30',
    badge: 'Khuyên Dùng ★',
    features: [
      'Dung lượng 200 GB siêu tốc độ',
      'Lưu trữ video offline V-Play HD',
      'Tặng kèm Badge V-Bank Gold & 500 Ore',
      'x2 Tốc độ phát truyền hình m3u8',
      'Hỗ trợ ưu tiên kỹ thuật 24/7',
    ],
  },
  {
    id: 'diamond_2tb',
    name: 'Gói Diamond VIP',
    size: '2.000 GB (2 TB)',
    priceMonth: '225.000đ',
    priceYear: '2.250.000đ',
    color: 'border-fuchsia-400/40 shadow-fuchsia-500/20',
    gradient: 'from-fuchsia-500/20 via-purple-900/30 to-pink-900/30',
    badge: 'Đẳng Cấp VIP',
    features: [
      '2.000 GB dung lượng đám mây Waves V-Cloud',
      'Tặng kèm Waves Verified (Tích Xanh) trọn đời',
      'Chia sẻ dung lượng cho tối đa 5 thành viên',
      'Tải trước phim và phát luồng 4K HDR',
      'Huy hiệu Vương miện Kim Cương độc quyền',
    ],
  },
];

interface VPremiumViewProps {
  initialSubTab?: VPremiumSubTab;
}

export const VPremiumView: React.FC<VPremiumViewProps> = ({ initialSubTab = 'vbank' }) => {
  const [activeSubTab, setActiveSubTab] = useState<VPremiumSubTab>(initialSubTab);
  const [billingCycle, setBillingCycle] = useState<'month' | 'year'>('month');
  const [selectedPlan, setSelectedPlan] = useState<StoragePlan | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const subTabs = [
    {
      id: 'vbank' as VPremiumSubTab,
      name: 'V-Bank',
      tagline: 'Ví Điện Tử & Điểm Ore',
      icon: <Building2 className="w-4 h-4" />,
      accent: 'from-amber-500 to-yellow-400',
    },
    {
      id: 'storage' as VPremiumSubTab,
      name: 'V-Cloud Storage',
      tagline: 'Mở Rộng Bộ Nhớ Đám Mây',
      icon: <Cloud className="w-4 h-4" />,
      accent: 'from-sky-500 to-blue-400',
    },
    {
      id: 'verified' as VPremiumSubTab,
      name: 'Waves Verified',
      tagline: 'Huy Hiệu Tích Xanh & Đặc Quyền',
      icon: <BadgeCheck className="w-4 h-4" />,
      accent: 'from-purple-500 to-indigo-400',
    },
  ];

  const handleOpenBuyPlan = (plan: StoragePlan) => {
    playPopSound();
    setSelectedPlan(plan);
    setPaymentSuccess(false);
    setIsBuyModalOpen(true);
  };

  const handleConfirmPayment = () => {
    playPopSound();
    setPaymentSuccess(true);
    try {
      if (selectedPlan) {
        const sizeNum = parseFloat(selectedPlan.size.replace(/[^0-9.]/g, ''));
        if (!isNaN(sizeNum)) {
          const current = parseFloat(localStorage.getItem('vplay_user_cloud_storage') || '105.51');
          localStorage.setItem('vplay_user_cloud_storage', (current + sizeNum).toFixed(2));
        }
      }
    } catch (e) {}
  };

  return (
    <div
      id="waves-vpremium-view"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 space-y-6 animate-fade-in relative text-left"
    >
      {/* Background dynamic decorative glass orbs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Glassmorphism Header Banner */}
      <div className="relative rounded-3xl bg-white/[0.08] backdrop-blur-[24px] saturate-[180%] border border-white/20 p-6 sm:p-8 shadow-[0_12px_40px_0_rgba(0,0,0,0.35),inset_0.5px_0.5px_0px_rgba(255,255,255,0.4)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
        {/* Glow corner */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-amber-400/20 to-purple-600/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-start gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-fuchsia-500 p-0.5 shadow-xl shadow-sky-500/20 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#181326]/90 backdrop-blur-md rounded-[14px] flex items-center justify-center">
              <Waves className="w-7 h-7 sm:w-8 sm:h-8 text-sky-300 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-indigo-200 tracking-tight">
                Waves Premium
              </h1>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-sky-500/20 border border-sky-500/40 text-sky-300 flex items-center gap-1 shadow-sm uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> VIP Services
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/75 mt-1.5 max-w-xl leading-relaxed">
              Trải nghiệm các đặc quyền cao cấp: Ngân hàng ảo <strong>V-Bank</strong> (Giao dịch quặng Ore),
              Dung lượng đám mây <strong>V-Cloud Storage</strong> và Huy hiệu <strong>Waves Verified</strong> chính chủ.
            </p>
          </div>
        </div>

        {/* Header Right Status Pill */}
        <div className="relative z-10 flex items-center gap-2 self-start md:self-center shrink-0">
          <div className="p-3 sm:p-4 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/15 flex items-center gap-3 shadow-inner">
            <Award className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] text-white/60 uppercase font-bold tracking-wider">Hạng Tài Khoản</div>
              <div className="text-xs sm:text-sm font-black text-white">Waves Diamond Member</div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Glassmorphism Navigation Bar */}
      <div className="relative rounded-2xl bg-white/[0.07] backdrop-blur-[20px] saturate-[180%] border border-white/15 p-2 shadow-[0_8px_30px_rgba(0,0,0,0.25),inset_0.5px_0.5px_0px_rgba(255,255,255,0.3)]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {subTabs.map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playPopSound();
                  setActiveSubTab(tab.id);
                }}
                className={`relative px-4 py-3 rounded-xl transition-all flex items-center gap-3 cursor-pointer text-left ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePremiumPill"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    className="absolute inset-0 bg-white/20 border border-white/30 rounded-xl shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.6),0_4px_20px_rgba(0,0,0,0.3)] -z-10"
                  />
                )}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                    isActive
                      ? 'bg-white/20 border-white/40 text-amber-300 shadow-inner'
                      : 'bg-white/10 border-white/10 text-white/70'
                  }`}
                >
                  {tab.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold truncate">{tab.name}</div>
                  <div className="text-[11px] text-white/55 truncate">{tab.tagline}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: V-BANK */}
      {activeSubTab === 'vbank' && (
        <div className="w-full">
          <VBankTab />
        </div>
      )}

      {/* SUB-TAB 2: V-CLOUD STORAGE WITH PURE GLASSMORPHISM CARDS */}
      {activeSubTab === 'storage' && (
        <div className="space-y-6">
          {/* Storage Header & Billing Toggle */}
          <div className="rounded-3xl bg-white/[0.08] backdrop-blur-[24px] saturate-[180%] border border-white/20 p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
            <div>
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-sky-400" />
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Gói Dung Lượng Waves V-Cloud
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-white/70 mt-1">
                Lưu trữ playlist cá nhân, video clip, ghi chú V-Notes và sao lưu không giới hạn.
              </p>
            </div>

            {/* Monthly / Yearly Switch */}
            <div className="flex items-center gap-2 bg-black/40 border border-white/15 p-1 rounded-2xl self-start md:self-auto shadow-inner">
              <button
                onClick={() => {
                  playPopSound();
                  setBillingCycle('month');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  billingCycle === 'month'
                    ? 'bg-white/25 text-white border border-white/30 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.5)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Hàng Tháng
              </button>
              <button
                onClick={() => {
                  playPopSound();
                  setBillingCycle('year');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'year'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <span>Hàng Năm</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-400/30 text-emerald-300 rounded-full font-bold border border-emerald-400/40">
                  Tiết kiệm 20%
                </span>
              </button>
            </div>
          </div>

          {/* Grid of Pure Glassmorphism Storage Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STORAGE_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-7 bg-gradient-to-b ${plan.gradient} backdrop-blur-[24px] saturate-[180%] border ${plan.color} flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0.5px_0.5px_0px_rgba(255,255,255,0.35)] transition-all duration-300 hover:scale-[1.02] hover:border-white/50 group`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-black font-black text-[11px] rounded-full shadow-lg shadow-emerald-500/40 uppercase tracking-wider flex items-center gap-1">
                    <Star className="w-3 h-3 fill-black" />
                    <span>{plan.badge}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <h3 className="font-bold text-lg text-white group-hover:text-amber-200 transition-colors">
                      {plan.name}
                    </h3>
                    {!plan.popular && (
                      <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white/90 shadow-sm">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <div className="mb-5">
                    <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-zinc-300">
                      {plan.size}
                    </span>
                    <div className="text-xs text-white/70 mt-1.5">
                      Giá:{' '}
                      <span className="font-bold text-white text-base">
                        {billingCycle === 'month' ? plan.priceMonth : plan.priceYear}
                      </span>{' '}
                      / {billingCycle === 'month' ? 'tháng' : 'năm'}
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10 mb-6">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-white/80 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenBuyPlan(plan)}
                  className={`w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-lg ${
                    plan.popular
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black shadow-emerald-500/30'
                      : 'bg-white/15 hover:bg-white/25 border border-white/25 text-white shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.4)]'
                  }`}
                >
                  <Sparkles className="w-4 h-4" /> Nâng Cấp Ngay
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: VERIFIED */}
      {activeSubTab === 'verified' && (
        <div className="w-full">
          <VerifiedTab />
        </div>
      )}

      {/* Buy Storage Modal Simulation */}
      {isBuyModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="absolute inset-0" onClick={() => setIsBuyModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#1a1426]/95 backdrop-blur-[30px] border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0.5px_0.5px_0px_rgba(255,255,255,0.4)] p-6 sm:p-8 text-white flex flex-col text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Xác Nhận Nâng Cấp</h3>
                  <p className="text-xs text-white/60">{selectedPlan.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsBuyModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {paymentSuccess ? (
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg text-white">Nâng Cấp Thành Công!</h4>
                <p className="text-xs text-white/70 max-w-xs leading-relaxed">
                  Dung lượng lưu trữ V-Cloud đã được mở rộng lên {selectedPlan.size}. Các đặc quyền VIP đã kích hoạt ngay bây giờ!
                </p>
                <button
                  onClick={() => setIsBuyModalOpen(false)}
                  className="mt-4 px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs"
                >
                  Hoàn Tất
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between text-white/70">
                    <span>Gói dung lượng:</span>
                    <span className="text-white font-semibold">
                      {selectedPlan.name} ({selectedPlan.size})
                    </span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Chu kỳ:</span>
                    <span className="text-white font-semibold">
                      {billingCycle === 'month' ? '1 Tháng' : '1 Năm (Ưu đãi)'}
                    </span>
                  </div>
                  <div className="flex justify-between text-white/70 pt-2 border-t border-white/10">
                    <span className="text-sm font-bold text-white">Tổng thanh toán:</span>
                    <span className="text-sm font-black text-amber-300">
                      {billingCycle === 'month' ? selectedPlan.priceMonth : selectedPlan.priceYear}
                    </span>
                  </div>
                </div>

                {/* Simulated QR Code / Bank Transfer */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="p-3 bg-white rounded-2xl shadow-inner">
                    <QrCode className="w-28 h-28 text-black" />
                  </div>
                  <span className="text-[11px] text-white/60">
                    Quét mã QR VietQR / MoMo hoặc dùng số dư Ore V-Bank
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsBuyModalOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-xs font-semibold cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleConfirmPayment}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" /> Xác Nhận Thanh Toán
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
