import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gem,
  Sparkles,
  Trophy,
  Flame,
  ShieldCheck,
  Award,
  RefreshCw,
  Gift,
  Zap,
  TrendingUp,
  Volume2,
  VolumeX,
  Swords,
  Users,
  Coins,
  Search,
  ArrowRight,
  Clock,
  Play,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  BadgePercent,
  SlidersHorizontal,
  Dices,
  Layers,
  CircleDot
} from 'lucide-react';
import { useOrbs } from '../hooks/useOrbs';
import { CopilotBetArena, BetGameType } from '../components/CopilotBetArena';
import { playPopSound, playWinSound } from '../utils/sound';

interface BetArenaPageProps {
  navigate: (route: string, state?: any) => void;
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
    icon: <Dices className="w-10 h-10 text-amber-400" />,
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
    icon: <Coins className="w-10 h-10 text-yellow-300" />,
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
    icon: <Swords className="w-10 h-10 text-rose-400" />,
    themeGradient: 'from-rose-600/20 via-pink-900/10 to-transparent',
    accentColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
  },
  {
    id: 'xucxac',
    title: 'Xúc Xắc Tài Xỉu (Sicbo)',
    category: 'Xúc xắc High-Roller',
    badge: 'Bão x30 cược',
    multiplier: 'x1.98 đến x30',
    excerpt: 'Tổng 3 viên xúc xắc: Tài (11 - 17) hoặc Xỉu (4 - 10). Đặc biệt nổ Bão 3 mặt giống nhau rinh ngay thưởng khủng x30 lần!',
    playersOnline: 64,
    tags: ['Tài 11-17', 'Xỉu 4-10', 'Bão x30'],
    rulesHighlight: 'Cửa Tài / Xỉu x1.98; Nổ Bão (3 số trùng nhau) x30',
    icon: <Flame className="w-10 h-10 text-purple-400" />,
    themeGradient: 'from-purple-600/20 via-indigo-900/10 to-transparent',
    accentColor: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
  },
];

export const BetArenaPage: React.FC<BetArenaPageProps> = ({ navigate }) => {
  const { orbs, addOrbs } = useOrbs();
  const [selectedGame, setSelectedGame] = useState<BetGameType>('baucua');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả sảnh');
  const [searchQuery, setSearchQuery] = useState('');
  const [claimedBonus, setClaimedBonus] = useState(false);

  const categories = [
    'Tất cả sảnh',
    'Bầu Cua Tôm Cá',
    'Lật Xu 3D',
    'Bài Cào 3 Cây',
    'Xúc Xắc Tài Xỉu',
    'Bảng Cược Trực Tiếp'
  ];

  const handleClaimFreeDaily = () => {
    if (claimedBonus) return;
    addOrbs(1000);
    playWinSound();
    setClaimedBonus(true);
    setTimeout(() => setClaimedBonus(false), 8000);
  };

  const handleSelectGame = (gameId: BetGameType) => {
    playPopSound();
    setSelectedGame(gameId);
    const arenaElement = document.getElementById('live-bet-arena-table');
    if (arenaElement) {
      arenaElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredGames = useMemo(() => {
    return CASINO_GAMES.filter((game) => {
      const matchCat =
        selectedCategory === 'Tất cả sảnh' ||
        selectedCategory === 'Bảng Cược Trực Tiếp' ||
        game.title.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchSearch =
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredGame = CASINO_GAMES.find((g) => g.id === selectedGame) || CASINO_GAMES[0];

  return (
    <div className="space-y-8 pb-16 text-left select-none animate-in fade-in duration-300">
      {/* 1. HEADER (News style UI) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">
            <Gem className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>SÀN CƯỢC KHOÁNG VẬT • HIGH-ROLLER CASINO</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Sàn Cược Orbs VIP & Đấu Trường Minigame
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
            Đấu trí cá cược khoáng vật Orbs thời gian thực cùng cộng đồng Vplay! 4 sảnh cược Provably Fair: Bầu Cua Tôm Cá, Lật Xu 3D, Bài Cào 3 Cây và Xúc Xắc Tài Xỉu.
          </p>
        </div>

        {/* Right Action: Search Box & Balance Capsule */}
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          {/* Search Box */}
          <div className="relative w-full sm:w-64 search-box-capsule rounded-full transition-all">
            <div className="flex items-center px-3 py-1.5 w-full">
              <Search className="w-4 h-4 text-[#8E8E93] shrink-0 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm sảnh cược..."
                className="w-full bg-transparent text-xs text-white placeholder-[#8E8E93] focus:outline-none"
              />
            </div>
          </div>

          {/* User Orbs Badge Capsule */}
          <div className="px-3.5 py-1.5 rounded-full bg-[#1E1E22] border border-[#2D2D35] flex items-center gap-2 text-xs">
            <Gem className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-zinc-400 font-medium">Orbs:</span>
            <span className="font-mono font-black text-amber-300">{orbs.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 2. FEATURED BIG SHOWCASE CARD (High-End Native UI Vector Stage - No Placeholder Images) */}
      {featuredGame && (
        <div
          onClick={() => handleSelectGame(featuredGame.id)}
          className="relative rounded-[30px] overflow-hidden bg-[#1E1E22] border border-[#2D2D35] hover:border-purple-500/60 cursor-pointer group shadow-2xl transition-all"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[340px]">
            {/* Left Vector Arena Visual Stage */}
            <div className="md:col-span-6 relative p-8 flex flex-col justify-between overflow-hidden bg-[#15151B] border-b md:border-b-0 md:border-r border-[#2D2D35]">
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

              {/* Top status bar */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-[#E6005A] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                  <TrendingUp className="w-3 h-3" />
                  <span>Tiêu điểm Sảnh Cược • LIVE PvP</span>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#202028] border border-[#32323E] text-[10px] font-mono text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{featuredGame.playersOnline} Người chơi</span>
                </div>
              </div>

              {/* Center Game Graphic Emblem */}
              <div className="relative z-10 my-6 flex items-center gap-5">
                <div className="w-20 h-20 rounded-3xl bg-[#1D1B26] border border-purple-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.15)] group-hover:scale-105 transition-transform">
                  {featuredGame.icon}
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 font-mono block">
                    {featuredGame.category}
                  </span>
                  <h3 className="text-2xl font-black text-white group-hover:text-purple-300 transition-colors">
                    {featuredGame.title}
                  </h3>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    Tỷ lệ thưởng: {featuredGame.multiplier}
                  </span>
                </div>
              </div>

              {/* Bottom tag capsule */}
              <div className="relative z-10 flex items-center gap-2 flex-wrap">
                {featuredGame.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-[#1E1E28] border border-[#303040] text-[11px] font-medium text-zinc-300"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Content Details & Actions */}
            <div className="md:col-span-6 p-6 md:p-8 flex flex-col justify-between bg-[#191920]">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 font-mono">
                    THÔNG TIN & LUẬT CHƠI
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                    {featuredGame.badge}
                  </span>
                </div>

                <p className="text-xs md:text-sm text-[#9CA3AF] mt-3 leading-relaxed">
                  {featuredGame.excerpt}
                </p>

                <div className="mt-4 p-3.5 rounded-2xl bg-[#14141A] border border-[#2D2D35] flex items-center gap-2.5 text-xs text-zinc-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="line-clamp-1">{featuredGame.rulesHighlight}</span>
                </div>
              </div>

              {/* Bottom Action Controls */}
              <div className="pt-5 mt-4 border-t border-[#2A2A30] flex items-center justify-between gap-3 text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClaimFreeDaily();
                  }}
                  disabled={claimedBonus}
                  className={`px-3.5 py-2 rounded-xl font-bold font-mono text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                    claimedBonus
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white border border-purple-400/40'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{claimedBonus ? 'Đã nhận +1.000 Orbs' : 'Nhận +1.000 Orbs'}</span>
                </button>

                <div className="flex items-center gap-2 text-purple-300 font-bold group-hover:translate-x-1 transition-transform">
                  <span>Mở Bàn Cược Ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CATEGORY PILLS (News style) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                playPopSound();
                setSelectedCategory(cat);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-purple-active text-white shadow-md glow-purple-sm font-bold'
                  : 'bg-[#1E1E22] text-[#A1A1AA] hover:text-white border border-[#32323A]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 4. GAME CARDS GRID (Clean Vector Headers - No Placeholder Images) */}
      {selectedCategory !== 'Bảng Cược Trực Tiếp' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGames.map((game) => {
            const isCurrent = selectedGame === game.id;
            return (
              <div
                key={game.id}
                onClick={() => handleSelectGame(game.id)}
                className={`group rounded-[28px] bg-[#1E1E22] border transition-all overflow-hidden flex flex-col justify-between cursor-pointer shadow-lg hover:scale-[1.01] ${
                  isCurrent
                    ? 'border-[#E6005A] ring-2 ring-[#E6005A]/40 bg-[#231e2b]'
                    : 'border-[#2D2D35] hover:border-purple-500/60 hover:bg-[#25252C]'
                }`}
              >
                {/* Styled Vector Header */}
                <div className={`p-5 pb-4 border-b border-[#2A2A32] bg-gradient-to-br ${game.themeGradient} relative overflow-hidden`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/40 border border-white/10 text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                      {game.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-[10px] font-mono font-black text-amber-300">
                      {game.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#14141C] border border-white/10 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      {game.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors leading-snug line-clamp-1">
                        {game.title}
                      </h3>
                      <span className="text-[11px] font-mono text-amber-400 font-bold block">
                        {game.multiplier}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 pt-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed">
                    {game.excerpt}
                  </p>

                  {/* Metadata Footer */}
                  <div className="mt-4 pt-3 border-t border-[#2A2A30] flex items-center justify-between text-xs text-[#8E8E93]">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <Users className="w-3.5 h-3.5" />
                      <span>{game.playersOnline} online</span>
                    </div>

                    <div className="flex items-center gap-1 font-bold text-white group-hover:text-purple-300">
                      <span>Vào Cược</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. STATS SUMMARY BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-[22px] bg-[#1E1E22] border border-[#2D2D35] flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-2xl bg-purple-950/70 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
            <Gem className="w-5 h-5 text-purple-300" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">Đơn vị thanh toán</span>
            <span className="text-xs sm:text-sm font-black text-white font-mono truncate">100% Khoáng Vật Orbs</span>
          </div>
        </div>

        <div className="p-4 rounded-[22px] bg-[#1E1E22] border border-[#2D2D35] flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">Thuật toán bảo mật</span>
            <span className="text-xs sm:text-sm font-black text-white font-mono truncate">Provably Fair RNG</span>
          </div>
        </div>

        <div className="p-4 rounded-[22px] bg-[#1E1E22] border border-[#2D2D35] flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-2xl bg-rose-950/70 border border-rose-500/40 flex items-center justify-center text-rose-300 shrink-0">
            <Flame className="w-5 h-5 text-rose-300" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">Thưởng tối đa</span>
            <span className="text-xs sm:text-sm font-black text-rose-300 font-mono truncate">x30 Cược (Bão Tài Xỉu)</span>
          </div>
        </div>

        <div className="p-4 rounded-[22px] bg-[#1E1E22] border border-[#2D2D35] flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-2xl bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
            <Users className="w-5 h-5 text-cyan-300" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">Cộng đồng Vplay</span>
            <span className="text-xs sm:text-sm font-black text-cyan-300 font-mono truncate">200+ Người Đang Chơi</span>
          </div>
        </div>
      </div>

      {/* 6. MAIN LIVE BETTING ENGINE */}
      <div id="live-bet-arena-table" className="rounded-[30px] overflow-hidden border border-[#2D2D35] shadow-2xl bg-[#18191C]">
        <div className="px-6 py-4 border-b border-[#2D2D35] bg-[#1E1E22] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Sàn Cược Trực Tiếp:</span>
              <span className="text-purple-300 font-mono font-black">{featuredGame.title}</span>
            </h3>
          </div>
          <button
            onClick={() => navigate('/friends')}
            className="px-3.5 py-1.5 rounded-full bg-[#2A2A32] hover:bg-[#34343F] text-purple-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5 text-purple-300" />
            <span>Tặng Orbs cho bạn bè</span>
          </button>
        </div>

        <CopilotBetArena initialGame={selectedGame} initialAmount={500} />
      </div>
    </div>
  );
};
