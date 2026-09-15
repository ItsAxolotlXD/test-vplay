import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Coins,
  Sparkles,
  Trophy,
  Gift,
  ShieldCheck,
  Award,
  Flame,
  Users,
  Dices,
  Swords,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  Tv,
  MessageSquare,
  Zap,
  Crown,
  History,
  Info,
  Clock
} from 'lucide-react';
import { useOrbs } from '../hooks/useOrbs';
import { CopilotBetArena, BetGameType } from '../components/CopilotBetArena';
import { playPopSound, playWinSound } from '../utils/sound';

interface LoyaltyPageProps {
  navigate: (route: string, state?: any) => void;
  initialTab?: 'arena' | 'rewards' | 'tiers';
}

interface BetGameCardData {
  id: BetGameType;
  title: string;
  category: string;
  badge: string;
  multiplier: string;
  excerpt: string;
  playersOnline: number;
  tags: string[];
  rulesHighlight: string;
  icon: React.ReactNode;
  themeGradient: string;
  accentColor: string;
}

const CASINO_GAMES: BetGameCardData[] = [
  {
    id: 'baucua',
    title: 'Bầu Cua Tôm Cá 3D',
    category: 'Dân gian Việt Nam',
    badge: 'Hot • x3 Thưởng',
    multiplier: 'Lên tới x3 cược',
    excerpt: 'Cược 6 linh vật truyền thống Bầu, Cua, Tôm, Cá, Gà, Nai. Lắc 3 xúc xắc 3D ngẫu nhiên với tỷ lệ trả thưởng hấp dẫn.',
    playersOnline: 48,
    tags: ['6 Cửa cược', 'Xúc xắc 3D', 'Dễ trúng'],
    rulesHighlight: 'Trúng 1 con x1, 2 con x2, 3 con x3 tiền cược',
    icon: <Dices className="w-9 h-9 text-amber-400" />,
    themeGradient: 'from-amber-600/20 via-orange-900/10 to-transparent',
    accentColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
  },
  {
    id: 'latxu',
    title: 'Lật Xu Sấp Ngửa 3D',
    category: 'Xác suất 50/50',
    badge: 'Tốc độ 5 giây',
    multiplier: 'x1.98 Cược',
    excerpt: 'Dự đoán mặt Sấp (Head) hoặc Ngửa (Tail) của đồng xu vàng nguyên chất. Xoay tròn 3D tốc độ cao với thuật toán Provably Fair.',
    playersOnline: 36,
    tags: ['Xác suất 50:50', 'Lật siêu tốc', 'Fair RNG'],
    rulesHighlight: 'Tỷ lệ thắng 50%, nhận x1.98 Orbs ngay tức thì',
    icon: <Coins className="w-9 h-9 text-yellow-300" />,
    themeGradient: 'from-yellow-600/20 via-amber-900/10 to-transparent',
    accentColor: 'text-yellow-300 border-yellow-500/40 bg-yellow-500/10',
  },
  {
    id: 'danhbai',
    title: 'Bài Cào 3 Cây PvP',
    category: 'Game bài đối kháng',
    badge: 'PvP Cực căng',
    multiplier: 'Thắng trọn ván',
    excerpt: 'Chia mỗi bên 3 lá bài Tây. So điểm nút từ 1 đến 9 hoặc so sánh các bộ đặc biệt Ba Tây, Liêng, Sáp để phân định thắng thua.',
    playersOnline: 52,
    tags: ['3 Cây đếm nút', 'Sáp / Liêng', 'Đối đầu NPC'],
    rulesHighlight: 'Điểm cao hơn thắng toàn bộ; Sáp > Liêng > Ba Tây > Điểm',
    icon: <Swords className="w-9 h-9 text-rose-400" />,
    themeGradient: 'from-rose-600/20 via-pink-900/10 to-transparent',
    accentColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
  },
  {
    id: 'xucxac',
    title: 'Tài Xỉu Sicbo High-Low',
    category: 'Xúc xắc lắc bát',
    badge: 'Jackpot Bão x30',
    multiplier: 'x1.98 ~ x30',
    excerpt: 'Dự đoán tổng điểm 3 viên xúc xắc: Xỉu (4 - 10) hoặc Tài (11 - 17), cược bộ ba đồng nhất ăn bão x30 cực đã.',
    playersOnline: 64,
    tags: ['Tài Xỉu', 'Sicbo Live', 'Bão x30 Thưởng'],
    rulesHighlight: 'Xỉu 4-10, Tài 11-17; Bộ ba đồng nhất nổ bão x30 Orbs',
    icon: <Flame className="w-9 h-9 text-purple-400" />,
    themeGradient: 'from-purple-600/20 via-violet-900/10 to-transparent',
    accentColor: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
  },
];

interface RewardItem {
  id: string;
  title: string;
  costPoints: number;
  costType: 'V-Points' | 'Orbs';
  badge: string;
  description: string;
  icon: React.ReactNode;
}

const REWARD_ITEMS: RewardItem[] = [
  {
    id: 'vip_1m',
    title: '1 Tháng VIP Waves Premium',
    costPoints: 1000,
    costType: 'V-Points',
    badge: 'HOT NHẤT',
    description: 'Trải nghiệm không quảng cáo, mở khóa toàn bộ kênh truyền hình 4K HDR & âm thanh Dolby Atmos 5.1.',
    icon: <Crown className="w-6 h-6 text-amber-400" />,
  },
  {
    id: 'orbs_pack_1000',
    title: 'Gói 1.000 Khoáng Vật Orbs',
    costPoints: 400,
    costType: 'V-Points',
    badge: 'CƯỢC NGAY',
    description: 'Nhận ngay 1.000 Orbs trực tiếp vào ví để tham gia các sàn cược Bầu cua, Lật xu, Bài cào.',
    icon: <Coins className="w-6 h-6 text-yellow-400" />,
  },
  {
    id: 'voucher_shop_50k',
    title: 'Voucher Vplay Shop 50.000đ',
    costPoints: 500,
    costType: 'V-Points',
    badge: 'MUA SẮM',
    description: 'Áp dụng giảm trực tiếp khi mua sắm vật phẩm, merchandise và đồ chơi Minecraft trên shop Vplay.',
    icon: <ShoppingBag className="w-6 h-6 text-purple-400" />,
  },
  {
    id: 'badge_vip',
    title: 'Huy hiệu Avatar "Loyalty Gold"',
    costPoints: 300,
    costType: 'V-Points',
    badge: 'ĐẶC QUYỀN',
    description: 'Huy hiệu vương miện vàng phát sáng hiển thị bên cạnh tên bạn trong phòng chat V-Chat & V-Flow.',
    icon: <Award className="w-6 h-6 text-emerald-400" />,
  },
];

export const LoyaltyPage: React.FC<LoyaltyPageProps> = ({
  navigate,
  initialTab = 'arena',
}) => {
  const { orbs, addOrbs } = useOrbs();
  const [activeTab, setActiveTab] = useState<'arena' | 'rewards' | 'tiers'>(initialTab);
  const [vPoints, setVPoints] = useState<number>(1450);
  const [selectedGame, setSelectedGame] = useState<BetGameType>('baucua');
  const [claimToast, setClaimToast] = useState<string | null>(null);
  const [redeemedToast, setRedeemedToast] = useState<string | null>(null);

  const handleClaimDailyOrbs = () => {
    const bonus = 100;
    addOrbs(bonus);
    setVPoints((prev) => prev + 50);
    playWinSound();
    setClaimToast('+100 Orbs & +50 V-Points! ✨');
    setTimeout(() => setClaimToast(null), 3000);
  };

  const handleRedeemReward = (reward: RewardItem) => {
    if (vPoints >= reward.costPoints) {
      setVPoints((prev) => prev - reward.costPoints);
      if (reward.id === 'orbs_pack_1000') {
        addOrbs(1000);
      }
      playWinSound();
      setRedeemedToast(`Đổi thành công: ${reward.title}! 🎁`);
      setTimeout(() => setRedeemedToast(null), 3500);
    } else {
      playPopSound();
      alert(`Bạn cần thêm ${reward.costPoints - vPoints} V-Points để đổi phần thưởng này!`);
    }
  };

  const featuredGame = useMemo(() => {
    return CASINO_GAMES.find((g) => g.id === selectedGame) || CASINO_GAMES[0];
  }, [selectedGame]);

  return (
    <div id="waves-loyalty-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7">
      
      {/* 1. HERO HEADER: Vplay Loyalty & Sàn Cược Orbs */}
      <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#241220] via-[#1B0E1E] to-[#120814] border border-[#3E243B] p-6 sm:p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-[#E6005A]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Vplay Loyalty & Sàn Cược Orbs VIP</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PROVABLY FAIR
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              Trung Tâm <span className="bg-gradient-to-r from-amber-300 via-rose-400 to-purple-400 bg-clip-text text-transparent">Loyalty</span> & Sàn Cược <span className="text-yellow-400">Orbs</span>
            </h1>

            <p className="text-sm text-[#D1D5DB] leading-relaxed">
              Tích lũy điểm V-Points khi xem truyền hình, đổi quà VIP và trải nghiệm sàn cược khoáng vật <span className="text-yellow-400 font-bold">Orbs</span> 3D trực tiếp với tỷ lệ trả thưởng hấp dẫn.
            </p>
          </div>

          {/* Quick Stats & Balances Box */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            {/* V-Points Pill */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Trophy className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 block font-medium">Điểm tích lũy</span>
                  <div className="text-base font-extrabold text-white font-mono flex items-baseline gap-1">
                    <span>{vPoints.toLocaleString()}</span>
                    <span className="text-[10px] text-amber-300 font-sans">V-Points</span>
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                HẠNG VÀNG
              </span>
            </div>

            {/* Orbs Balance Pill */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/60 to-purple-900/40 border border-purple-500/30 backdrop-blur-md flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-yellow-500/20 border border-yellow-400/40 flex items-center justify-center text-yellow-300">
                  <Coins className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <span className="text-[11px] text-yellow-400/90 block font-medium">Khoáng vật <span className="text-yellow-400 font-bold">Orbs</span></span>
                  <div className="text-base font-extrabold text-yellow-400 font-mono flex items-baseline gap-1">
                    <span>{orbs.toLocaleString()}</span>
                    <span className="text-[10px] text-yellow-400 font-sans font-bold">ORBS</span>
                  </div>
                </div>
              </div>
              <button
                id="btn-claim-daily-loyalty"
                onClick={handleClaimDailyOrbs}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Điểm danh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Notification Toast */}
        {claimToast && (
          <div className="mt-4 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{claimToast}</span>
          </div>
        )}

        {redeemedToast && (
          <div className="mt-4 p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-2 animate-bounce">
            <Gift className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{redeemedToast}</span>
          </div>
        )}
      </div>

      {/* 2. TAB CONTROLS: Arena vs. Rewards vs. Tiers */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto no-scrollbar">
        <button
          id="tab-loyalty-arena"
          onClick={() => {
            playPopSound();
            setActiveTab('arena');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'arena'
              ? 'bg-[#E6005A] text-white shadow-lg shadow-[#E6005A]/30'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Coins className="w-4 h-4 text-amber-300" />
          <span>Sàn cược Orbs VIP</span>
          <span className="px-1.5 py-0.2 text-[10px] font-mono bg-black/30 rounded-full">
            4 Games
          </span>
        </button>

        <button
          id="tab-loyalty-rewards"
          onClick={() => {
            playPopSound();
            setActiveTab('rewards');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'rewards'
              ? 'bg-[#E6005A] text-white shadow-lg shadow-[#E6005A]/30'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Gift className="w-4 h-4 text-pink-300" />
          <span>Đổi quà & Điểm thưởng</span>
          <span className="px-1.5 py-0.2 text-[10px] font-mono bg-black/30 rounded-full">
            Rewards
          </span>
        </button>

        <button
          id="tab-loyalty-tiers"
          onClick={() => {
            playPopSound();
            setActiveTab('tiers');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'tiers'
              ? 'bg-[#E6005A] text-white shadow-lg shadow-[#E6005A]/30'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Hạng VIP & Đặc quyền</span>
        </button>
      </div>

      {/* 3. TAB 1: SÀN CƯỢC ORBS */}
      {activeTab === 'arena' && (
        <div className="space-y-6">
          {/* Game Selection Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CASINO_GAMES.map((game) => {
              const isSelected = selectedGame === game.id;
              return (
                <div
                  key={game.id}
                  id={`card-game-${game.id}`}
                  onClick={() => {
                    playPopSound();
                    setSelectedGame(game.id);
                    const el = document.getElementById('live-bet-arena-table');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`relative rounded-[24px] overflow-hidden border p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-[#251829] border-[#E6005A] shadow-xl shadow-[#E6005A]/20 ring-1 ring-[#E6005A]'
                      : 'bg-[#1D1722] border-white/5 hover:border-white/20 hover:bg-[#221B28]'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-black/30 border border-white/10">
                        {game.icon}
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono">
                        {game.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {game.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-mono font-bold">
                      {game.multiplier}
                    </span>
                    <div className="flex items-center gap-1 font-bold text-white group-hover:text-[#FF4D8B]">
                      <span>Vào cược</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Live Betting Engine */}
          <div id="live-bet-arena-table" className="rounded-[30px] overflow-hidden border border-[#2D2D35] shadow-2xl bg-[#18191C]">
            <div className="px-6 py-4 border-b border-[#2D2D35] bg-[#1E1E22] flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Sàn cược trực tiếp:</span>
                  <span className="text-amber-300 font-mono font-black">{featuredGame.title}</span>
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/friends')}
                  className="px-3.5 py-1.5 rounded-full bg-[#2A2A32] hover:bg-[#34343F] text-purple-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5 text-purple-300" />
                  <span>Tặng Orbs cho bạn bè</span>
                </button>
              </div>
            </div>

            <CopilotBetArena initialGame={selectedGame} initialAmount={500} />
          </div>
        </div>
      )}

      {/* 4. TAB 2: ĐỔI QUÀ & ĐIỂM THƯỞNG (LOYALTY REWARDS) */}
      {activeTab === 'rewards' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REWARD_ITEMS.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-[24px] bg-[#1E1925] border border-white/10 hover:border-white/20 transition-all flex items-start justify-between gap-4 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        {item.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-300">
                        {item.costPoints.toLocaleString()} {item.costType}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  id={`btn-redeem-${item.id}`}
                  onClick={() => handleRedeemReward(item)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shrink-0 transition-all cursor-pointer shadow-md active:scale-95"
                >
                  Đổi quà
                </button>
              </div>
            ))}
          </div>

          {/* Daily Missions Card */}
          <div className="p-6 rounded-[24px] bg-[#191522] border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Nhiệm vụ nhận thêm V-Points mỗi ngày</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Tv className="w-5 h-5 text-sky-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Xem truyền hình trực tiếp 30 phút</div>
                    <div className="text-[11px] text-gray-400">Theo dõi kênh bất kỳ để nhận thưởng</div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">+100 V-Points</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-pink-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Gửi 5 tin nhắn trong V-Chat hoặc V-Flow</div>
                    <div className="text-[11px] text-gray-400">Giao lưu sôi nổi cùng cộng đồng</div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">+50 V-Points</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Coins className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Tham gia 1 ván cược Orbs bất kỳ</div>
                    <div className="text-[11px] text-gray-400">Thử vận may tại Bầu cua hoặc Lật xu</div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">+50 V-Points</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: HẠNG VIP & ĐẶC QUYỀN (TIERS) */}
      {activeTab === 'tiers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Tier 1: Silver */}
          <div className="p-6 rounded-[24px] bg-[#1A1822] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-gray-400">Hạng 1</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-500/20 text-gray-300 border border-gray-400/30">
                BẠC (Silver)
              </span>
            </div>
            <h3 className="text-xl font-black text-white">Thành viên Tiêu chuẩn</h3>
            <p className="text-xs text-gray-400">Yêu cầu: 0 - 999 V-Points</p>
            <ul className="space-y-2 text-xs text-gray-300 pt-3 border-t border-white/10">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-400" />
                <span>Xem truyền hình độ phân giải 1080p Full HD</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-400" />
                <span>Điểm danh nhận +50 Orbs/ngày</span>
              </li>
            </ul>
          </div>

          {/* Tier 2: Gold */}
          <div className="p-6 rounded-[24px] bg-[#2A1D20] border border-amber-500/40 relative shadow-xl shadow-amber-950/20 space-y-4">
            <span className="absolute -top-3 right-5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-black">
              HẠNG CỦA BẠN
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-amber-300">Hạng 2</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                VÀNG (Gold)
              </span>
            </div>
            <h3 className="text-xl font-black text-white">Hội viên Thân thiết</h3>
            <p className="text-xs text-gray-400">Yêu cầu: 1.000 - 4.999 V-Points</p>
            <ul className="space-y-2 text-xs text-gray-200 pt-3 border-t border-white/10">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Tất cả đặc quyền Hạng Bạc</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Mở khóa kênh 4K HDR & âm thanh Dolby</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Nhân 1.5x điểm thưởng V-Points</span>
              </li>
            </ul>
          </div>

          {/* Tier 3: Diamond */}
          <div className="p-6 rounded-[24px] bg-[#22162A] border border-purple-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-purple-300">Hạng 3</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                KIM CƯƠNG (Diamond)
              </span>
            </div>
            <h3 className="text-xl font-black text-white">Thành viên Thượng lưu</h3>
            <p className="text-xs text-gray-400">Yêu cầu: 5.000+ V-Points</p>
            <ul className="space-y-2 text-xs text-purple-200 pt-3 border-t border-white/10">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Toàn bộ đặc quyền VIP không giới hạn</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Nhân 2x điểm thưởng V-Points & Orbs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Quyền tạo phòng đấu riêng trên Sàn cược</span>
              </li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};
export default LoyaltyPage;
