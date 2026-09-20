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
  Search,
  Lock,
  Cpu,
  Server
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
  badge: string;
  category: string;
  themeGradient: string;
  icon: React.ReactNode;
  features: string[];
}

const STORAGE_PLANS: StoragePlan[] = [
  {
    id: 'basic_50gb',
    name: 'Gói Cơ Bản (Basic Cloud)',
    size: '50 GB',
    priceMonth: '19.000đ',
    priceYear: '190.000đ',
    color: 'border-[#2D2D35]',
    badge: 'Tiết kiệm',
    category: 'V-Cloud Storage',
    themeGradient: 'from-blue-600/20 via-sky-900/10 to-transparent',
    icon: <HardDrive className="w-8 h-8 text-sky-400" />,
    features: [
      'Lưu trữ hơn 50+ Playlist M3U8',
      'Đồng bộ ghi chú V-Notes không giới hạn',
      'Sao lưu cài đặt V-Play Channel cá nhân',
      'Huy hiệu Đồng Waves Cloud Member',
    ],
  },
  {
    id: 'pro_200gb',
    name: 'Gói Pro Cloud (Popular)',
    size: '200 GB',
    priceMonth: '69.000đ',
    priceYear: '690.000đ',
    popular: true,
    color: 'border-emerald-500/60 ring-2 ring-emerald-500/30',
    badge: 'Khuyên Dùng ★',
    category: 'V-Cloud Storage',
    themeGradient: 'from-emerald-600/20 via-teal-900/10 to-transparent',
    icon: <Cloud className="w-8 h-8 text-emerald-400" />,
    features: [
      'Dung lượng 200 GB siêu tốc độ cao NVMe',
      'Lưu trữ video offline V-Play HD mượt mà',
      'Tặng kèm Badge V-Bank Gold & 500 Ore',
      'x2 Tốc độ phát truyền hình trực tiếp',
      'Hỗ trợ ưu tiên kỹ thuật 24/7',
    ],
  },
  {
    id: 'diamond_2tb',
    name: 'Gói Diamond VIP (Ultimate)',
    size: '2.000 GB (2 TB)',
    priceMonth: '225.000đ',
    priceYear: '2.250.000đ',
    color: 'border-purple-500/60',
    badge: 'Đẳng Cấp VIP',
    category: 'V-Cloud Storage',
    themeGradient: 'from-purple-600/20 via-indigo-900/10 to-transparent',
    icon: <Crown className="w-8 h-8 text-purple-400" />,
    features: [
      '2.000 GB dung lượng đám mây Waves V-Cloud',
      'Tặng kèm Waves Verified (Tích Xanh) vĩnh viễn',
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
  const [searchQuery, setSearchQuery] = useState('');

  const subTabs = [
    {
      id: 'vbank' as VPremiumSubTab,
      name: 'V-Bank & Ví Ore',
      category: 'Tài chính & Quặng Ore',
      tagline: 'Giao dịch điểm Ore & Nạp thẻ',
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: 'storage' as VPremiumSubTab,
      name: 'V-Cloud Storage',
      category: 'Bộ nhớ đám mây',
      tagline: 'Mở rộng không gian lưu trữ',
      icon: <Cloud className="w-4 h-4" />,
    },
    {
      id: 'verified' as VPremiumSubTab,
      name: 'Waves Verified',
      category: 'Xác minh & Tích xanh',
      tagline: 'Huy hiệu chính chủ & Đặc quyền',
      icon: <BadgeCheck className="w-4 h-4" />,
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

  const featuredPlan = STORAGE_PLANS[1]; // Pro 200GB plan

  return (
    <div id="waves-vpremium-view" className="space-y-8 pb-16 text-left select-none animate-in fade-in duration-300">
      {/* 1. HEADER (News style UI) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>WAVES PREMIUM • DỊCH VỤ & ĐẶC QUYỀN VIP</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Waves Premium & Đám Mây V-Cloud
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
            Trải nghiệm các đặc quyền cao cấp: Ngân hàng ảo <strong>V-Bank</strong> (Giao dịch quặng Ore), Dung lượng đám mây <strong>V-Cloud Storage</strong> và Huy hiệu <strong>Waves Verified</strong> chính chủ.
          </p>
        </div>

        {/* Search & Status Box */}
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <div className="relative w-full sm:w-72 h-[44px] flex items-center px-4 rounded-full spotlight-bubble-box search-box-capsule float-search-style text-xs transition-all border-0">
            <Search className="w-4.5 h-4.5 text-white stroke-[2.4] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] shrink-0 mr-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm gói dịch vụ..."
              className="w-full bg-transparent text-sm text-white placeholder-white/60 focus:outline-none font-semibold truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] border-0"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer shrink-0 ml-1"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-[#1E1E22] border border-[#2D2D35] flex items-center gap-2 text-xs">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-400 font-medium">Hạng:</span>
            <span className="font-bold text-white">Waves Diamond VIP</span>
          </div>
        </div>
      </div>

      {/* 2. FEATURED BIG SHOWCASE CARD (Native Vector UI Stage - No Placeholder Images) */}
      {featuredPlan && (
        <div
          onClick={() => {
            setActiveSubTab('storage');
            handleOpenBuyPlan(featuredPlan);
          }}
          className="relative rounded-[30px] overflow-hidden bg-[#1E1E22] border border-[#2D2D35] hover:border-sky-500/60 cursor-pointer group shadow-2xl transition-all"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[340px]">
            {/* Left Cloud Storage Stage */}
            <div className="md:col-span-6 relative p-8 flex flex-col justify-between overflow-hidden bg-[#141720] border-b md:border-b-0 md:border-r border-[#2D2D35]">
              {/* Glow backdrop */}
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-sky-600/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

              {/* Top status */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                  <TrendingUp className="w-3 h-3" />
                  <span>Tiêu điểm Dịch Vụ • GÓI PRO CLOUD</span>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1C2230] border border-[#2E374A] text-[10px] font-mono text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>NVMe SSD Cloud Active</span>
                </div>
              </div>

              {/* Center Graphic */}
              <div className="relative z-10 my-6 flex items-center gap-5">
                <div className="w-20 h-20 rounded-3xl bg-[#162133] border border-sky-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.15)] group-hover:scale-105 transition-transform">
                  <Cloud className="w-10 h-10 text-sky-400" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 font-mono block">
                    {featuredPlan.category}
                  </span>
                  <h3 className="text-2xl font-black text-white group-hover:text-sky-300 transition-colors">
                    {featuredPlan.name}
                  </h3>
                  <span className="text-sm font-mono font-black text-amber-300">
                    {featuredPlan.size} Siêu Tốc Độ Cao
                  </span>
                </div>
              </div>

              {/* Storage Capacity Bar Graphic */}
              <div className="relative z-10 space-y-2 p-3.5 rounded-2xl bg-[#0F131D] border border-[#252E42]">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Băng thông: Không giới hạn</span>
                  <span className="text-emerald-400 font-bold">10 Gbps Uplink</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1C2333] overflow-hidden">
                  <div className="w-3/4 h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full" />
                </div>
              </div>
            </div>

            {/* Right Content Side */}
            <div className="md:col-span-6 p-6 md:p-8 flex flex-col justify-between bg-[#191A22]">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 font-mono">
                    ĐẶC QUYỀN GÓI PRO
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {featuredPlan.badge}
                  </span>
                </div>

                <p className="text-xs md:text-sm text-[#9CA3AF] mt-3 leading-relaxed">
                  Lưu trữ video offline V-Play HD, sao lưu playlist M3U8, đồng bộ ghi chú V-Notes và nhận ngay huy hiệu V-Bank Gold cùng 500 quặng Ore miễn phí.
                </p>

                <div className="mt-4 space-y-2">
                  {featuredPlan.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Action */}
              <div className="pt-5 mt-4 border-t border-[#2A2A30] flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-zinc-400 block text-[10px]">Chỉ từ</span>
                  <span className="font-mono font-black text-amber-300 text-base">{featuredPlan.priceMonth} / tháng</span>
                </div>

                <div className="flex items-center gap-2 text-sky-300 font-bold group-hover:translate-x-1 transition-transform">
                  <span>Nâng cấp ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CATEGORY PILLS (News style) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {subTabs.map((tab) => {
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playPopSound();
                setActiveSubTab(tab.id);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-purple-active text-white shadow-md glow-purple-sm font-bold'
                  : 'bg-[#1E1E22] text-[#A1A1AA] hover:text-white border border-[#32323A]'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* 4. SUB-TAB CONTENT ROUTER */}
      {/* 4.1: V-BANK TAB */}
      {activeSubTab === 'vbank' && (
        <div className="w-full rounded-[30px] overflow-hidden border border-[#2D2D35] bg-[#18191C]">
          <VBankTab />
        </div>
      )}

      {/* 4.2: V-CLOUD STORAGE WITH CLEAN VECTOR CARDS */}
      {activeSubTab === 'storage' && (
        <div className="space-y-6">
          {/* Storage Header & Billing Switch Bar */}
          <div className="p-6 rounded-[28px] bg-[#1E1E22] border border-[#2D2D35] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
                <Cloud className="w-4 h-4" />
                <span>BẢNG GIÁ DUNG LƯỢNG V-CLOUD</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">Các Gói Lưu Trữ Đám Mây Siêu Tốc Độ</h2>
              <p className="text-xs text-[#9CA3AF] mt-1">
                Lưu trữ playlist cá nhân, video clip, ghi chú V-Notes và sao lưu không giới hạn.
              </p>
            </div>

            {/* Monthly / Yearly Switch */}
            <div className="flex items-center gap-2 bg-[#121118] border border-[#2D2D35] p-1 rounded-full self-start md:self-auto">
              <button
                onClick={() => {
                  playPopSound();
                  setBillingCycle('month');
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  billingCycle === 'month'
                    ? 'bg-[#2E2E38] text-white font-bold shadow-md'
                    : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                Hàng Tháng
              </button>
              <button
                onClick={() => {
                  playPopSound();
                  setBillingCycle('year');
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'year'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold shadow-md'
                    : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                <span>Hàng Năm</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-400/30 text-emerald-300 rounded-full font-bold border border-emerald-400/40">
                  Tiết kiệm 20%
                </span>
              </button>
            </div>
          </div>

          {/* 3 Storage Plans Grid (Vector Plan Headers - No Placeholder Images) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STORAGE_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`group rounded-[28px] bg-[#1E1E22] border transition-all overflow-hidden flex flex-col justify-between cursor-pointer shadow-lg hover:scale-[1.01] ${
                  plan.popular
                    ? 'border-emerald-500/60 ring-2 ring-emerald-500/30'
                    : 'border-[#2D2D35] hover:border-sky-500/60 hover:bg-[#25252C]'
                }`}
              >
                {/* Styled Vector Header */}
                <div className={`p-6 pb-4 border-b border-[#2A2A32] bg-gradient-to-br ${plan.themeGradient} relative overflow-hidden`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/40 border border-white/10 text-[10px] font-bold text-sky-300 uppercase tracking-wider">
                      {plan.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono font-black text-emerald-300">
                      {plan.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-[#141720] border border-white/10 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      {plan.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors leading-snug">
                        {plan.name}
                      </h3>
                      <span className="text-2xl font-black text-amber-300 font-mono block">
                        {plan.size}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="mb-4 flex items-baseline gap-1.5">
                      <span className="text-xl font-bold text-white font-mono">
                        {billingCycle === 'month' ? plan.priceMonth : plan.priceYear}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">
                        / {billingCycle === 'month' ? 'tháng' : 'năm'}
                      </span>
                    </div>

                    <div className="space-y-2.5 border-t border-[#2A2A30] pt-4">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs text-zinc-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metadata Footer Action */}
                  <div className="mt-6 pt-4 border-t border-[#2A2A30]">
                    <button
                      onClick={() => handleOpenBuyPlan(plan)}
                      className={`w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md ${
                        plan.popular
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 text-black font-black'
                          : 'bg-[#2E2E38] hover:bg-[#3E3E4C] text-white border border-white/10'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Nâng Cấp Gói Này</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4.3: VERIFIED TAB */}
      {activeSubTab === 'verified' && (
        <div className="w-full rounded-[30px] overflow-hidden border border-[#2D2D35] bg-[#18191C]">
          <VerifiedTab />
        </div>
      )}

      {/* BUY STORAGE MODAL SIMULATION */}
      {isBuyModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="absolute inset-0" onClick={() => setIsBuyModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-[30px] bg-[#1A1A22] border border-[#2D2D35] shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-6 sm:p-8 text-white flex flex-col text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#2D2D35] pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Xác Nhận Nâng Cấp</h3>
                  <p className="text-xs text-[#9CA3AF]">{selectedPlan.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsBuyModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#2A2A35] hover:bg-[#3A3A48] flex items-center justify-center text-zinc-400 hover:text-white"
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
                <p className="text-xs text-[#9CA3AF] max-w-xs leading-relaxed">
                  Dung lượng lưu trữ V-Cloud đã được mở rộng lên {selectedPlan.size}. Các đặc quyền VIP đã được kích hoạt ngay!
                </p>
                <button
                  onClick={() => setIsBuyModalOpen(false)}
                  className="mt-4 px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer"
                >
                  Hoàn Tất
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#14141A] border border-[#2D2D35] space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Gói dung lượng:</span>
                    <span className="text-white font-semibold">
                      {selectedPlan.name} ({selectedPlan.size})
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Chu kỳ:</span>
                    <span className="text-white font-semibold">
                      {billingCycle === 'month' ? '1 Tháng' : '1 Năm (Ưu đãi)'}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400 pt-2 border-t border-[#2D2D35]">
                    <span className="text-sm font-bold text-white">Tổng thanh toán:</span>
                    <span className="text-sm font-black text-amber-300 font-mono">
                      {billingCycle === 'month' ? selectedPlan.priceMonth : selectedPlan.priceYear}
                    </span>
                  </div>
                </div>

                {/* Simulated QR Code / Bank Transfer */}
                <div className="p-4 rounded-2xl bg-[#14141A] border border-[#2D2D35] flex flex-col items-center justify-center text-center space-y-2">
                  <div className="p-3 bg-white rounded-2xl shadow-inner">
                    <QrCode className="w-28 h-28 text-black" />
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    Quét mã QR VietQR / MoMo hoặc dùng số dư Ore V-Bank
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsBuyModalOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-[#2A2A35] hover:bg-[#3A3A48] text-zinc-300 text-xs font-semibold cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleConfirmPayment}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 text-white text-xs font-bold shadow-lg shadow-sky-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
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
