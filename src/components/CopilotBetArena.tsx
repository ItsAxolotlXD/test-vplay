import React, { useState, useEffect, useRef } from "react";
import {
  Coins,
  Sparkles,
  Trophy,
  Users,
  Bot,
  Play,
  RotateCcw,
  Zap,
  Flame,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Volume2,
  VolumeX,
  X,
  Plus,
  RefreshCw,
  Gift,
  ArrowRight,
  ShieldCheck,
  Award,
  Swords
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useOrbs } from "../hooks/useOrbs";
import {
  playPopSound,
  playWinSound,
  playLoseSound,
  playRollSound,
  playCoinSound,
  playCardSound
} from "../utils/sound";

export type BetGameType = "baucua" | "latxu" | "danhbai" | "xucxac";

interface CopilotBetArenaProps {
  initialGame?: BetGameType;
  initialAmount?: number;
  onClose?: () => void;
  isCompact?: boolean;
}

// Bầu cua mascot definitions
interface BauCuaMascot {
  id: "nai" | "bau" | "ga" | "ca" | "cua" | "tom";
  name: string;
  emoji: string;
  color: string;
  bg: string;
  border: string;
}

const BAU_CUA_MASCOTS: BauCuaMascot[] = [
  { id: "nai", name: "Nai Rừng", emoji: "🦌", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)", border: "#059669" },
  { id: "bau", name: "Bầu Tiên", emoji: "🎃", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)", border: "#d97706" },
  { id: "ga", name: "Gà Trống", emoji: "🐓", color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)", border: "#dc2626" },
  { id: "ca", name: "Cá Chép", emoji: "🐟", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.15)", border: "#0891b2" },
  { id: "cua", name: "Cua Biển", emoji: "🦀", color: "#f97316", bg: "rgba(249, 115, 22, 0.15)", border: "#ea580c" },
  { id: "tom", name: "Tôm Sông", emoji: "🦐", color: "#ec4899", bg: "rgba(236, 72, 153, 0.15)", border: "#db2777" }
];

// Playing card types for Bài Cào
interface Card {
  suit: "♠" | "♥" | "♣" | "♦";
  value: string;
  numVal: number;
  color: string;
}

const SUITS: ("♠" | "♥" | "♣" | "♦")[] = ["♠", "♣", "♦", "♥"];
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const generateDeck = (): Card[] => {
  const deck: Card[] = [];
  SUITS.forEach((suit) => {
    VALUES.forEach((val) => {
      let numVal = parseInt(val);
      if (isNaN(numVal)) {
        numVal = val === "A" ? 1 : 10;
      }
      deck.push({
        suit,
        value: val,
        numVal,
        color: suit === "♥" || suit === "♦" ? "#ef4444" : "#f4f4f5"
      });
    });
  });
  return deck;
};

// Online Opponent mock pool for PvP bets
interface OnlineUser {
  id: string;
  name: string;
  avatar: string;
  level: number;
  winRate: number;
  badge: string;
}

const ONLINE_USERS: OnlineUser[] = [
  { id: "u1", name: "DragonGamer_99", avatar: "🐲", level: 42, winRate: 68, badge: "VIP PLUS" },
  { id: "u2", name: "MinhKhoi_Pro", avatar: "⚡", level: 35, winRate: 61, badge: "Cao Thủ" },
  { id: "u3", name: "BảoNgọc_Vplay", avatar: "👑", level: 50, winRate: 74, badge: "Đại Gia" },
  { id: "u4", name: "HảiĐăng_HN", avatar: "🔥", level: 28, winRate: 55, badge: "Thần Bài" },
  { id: "u5", name: "ThùyTrang_SG", avatar: "🌸", level: 39, winRate: 63, badge: "Tích Xanh" },
  { id: "u6", name: "QuốcBảo_Gaming", avatar: "🎯", level: 31, winRate: 58, badge: "Thách Đấu" }
];

export const CopilotBetArena: React.FC<CopilotBetArenaProps> = ({
  initialGame = "baucua",
  initialAmount = 500,
  onClose,
  isCompact = false
}) => {
  const { orbs, addOrbs, spendOrbs } = useOrbs();
  const [activeGame, setActiveGame] = useState<BetGameType>(initialGame);
  const [betAmount, setBetAmount] = useState<number>(initialAmount);
  const [mode, setMode] = useState<"pvp" | "bot">("pvp");
  const [opponent, setOpponent] = useState<OnlineUser>(ONLINE_USERS[0]);
  const [isMatching, setIsMatching] = useState(false);

  // Status & Logs
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastResult, setLastResult] = useState<{
    win: boolean;
    profit: number;
    title: string;
    description: string;
  } | null>(null);
  const [streak, setStreak] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem("vplay_bet_streak") || "0", 10);
    } catch {
      return 0;
    }
  });

  // 1. GAME STATE: BẦU CUA
  const [bauCuaBets, setBauCuaBets] = useState<Record<string, number>>({});
  const [bauCuaDice, setBauCuaDice] = useState<BauCuaMascot[]>([
    BAU_CUA_MASCOTS[0],
    BAU_CUA_MASCOTS[1],
    BAU_CUA_MASCOTS[2]
  ]);
  const [isBauCuaShaking, setIsBauCuaShaking] = useState(false);
  const [isBauCuaOpened, setIsBauCuaOpened] = useState(true);

  // 2. GAME STATE: LẬT XU
  const [coinChoice, setCoinChoice] = useState<"sap" | "ngua">("sap");
  const [coinResult, setCoinResult] = useState<"sap" | "ngua" | null>(null);
  const [isCoinFlipping, setIsCoinFlipping] = useState(false);

  // 3. GAME STATE: ĐÁNH BÀI (BÀI CÀO 3 CÂY)
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [opponentCards, setOpponentCards] = useState<Card[]>([]);
  const [cardsRevealed, setCardsRevealed] = useState<boolean[]>([false, false, false]);
  const [opponentCardsRevealed, setOpponentCardsRevealed] = useState(false);
  const [cardScores, setCardScores] = useState<{ player: string; opponent: string } | null>(null);

  // 4. GAME STATE: XÚC XẮC (TÀI XỈU)
  const [taiXiuChoice, setTaiXiuChoice] = useState<"tai" | "xiu" | "bao" | "chan" | "le">("tai");
  const [diceValues, setDiceValues] = useState<number[]>([3, 4, 5]);
  const [isDiceRolling, setIsDiceRolling] = useState(false);
  const [diceHistory, setDiceHistory] = useState<("T" | "X")[]>(["T", "X", "T", "T", "X", "T"]);

  // Quick Bet Amounts Preset
  const PRESET_AMOUNTS = [100, 500, 1000, 5000, 10000, 50000];

  // Quick Match Random PvP Opponent
  const handleRandomOpponent = () => {
    playPopSound();
    setIsMatching(true);
    setTimeout(() => {
      const randomUser = ONLINE_USERS[Math.floor(Math.random() * ONLINE_USERS.length)];
      setOpponent(randomUser);
      setIsMatching(false);
    }, 600);
  };

  // Sync streak to storage
  useEffect(() => {
    try {
      localStorage.setItem("vplay_bet_streak", streak.toString());
    } catch {}
  }, [streak]);

  // Update streak after round
  const registerGameOutcome = (win: boolean, profit: number, title: string, description: string) => {
    if (win) {
      playWinSound();
      setStreak((prev) => prev + 1);
    } else {
      playLoseSound();
      setStreak(0);
    }
    setLastResult({ win, profit, title, description });
  };

  // ==========================================
  // 1. PLAY BẦU CUA
  // ==========================================
  const handlePlaceBauCuaBet = (mascotId: string) => {
    if (isPlaying) return;
    playPopSound();
    setBauCuaBets((prev) => {
      const current = prev[mascotId] || 0;
      return {
        ...prev,
        [mascotId]: current + betAmount
      };
    });
  };

  const handleClearBauCuaBets = () => {
    if (isPlaying) return;
    playPopSound();
    setBauCuaBets({});
  };

  const handlePlayBauCua = () => {
    const totalBet = Object.values(bauCuaBets).reduce((a, b) => a + b, 0);
    if (totalBet <= 0) {
      alert("Vui lòng đặt cược vào ít nhất một con vật trước khi xóc đĩa!");
      return;
    }
    if (totalBet > orbs) {
      alert(`Số dư Orbs không đủ! Bạn cần ${totalBet.toLocaleString()} Orbs (Hiện có: ${orbs.toLocaleString()} Orbs).`);
      return;
    }

    // Deduct total bet
    if (!spendOrbs(totalBet)) return;

    setIsPlaying(true);
    setIsBauCuaShaking(true);
    setIsBauCuaOpened(false);
    setLastResult(null);
    playRollSound();

    // Roll animation
    const rollInterval = setInterval(() => {
      setBauCuaDice([
        BAU_CUA_MASCOTS[Math.floor(Math.random() * 6)],
        BAU_CUA_MASCOTS[Math.floor(Math.random() * 6)],
        BAU_CUA_MASCOTS[Math.floor(Math.random() * 6)]
      ]);
    }, 90);

    setTimeout(() => {
      clearInterval(rollInterval);
      const finalDice = [
        BAU_CUA_MASCOTS[Math.floor(Math.random() * 6)],
        BAU_CUA_MASCOTS[Math.floor(Math.random() * 6)],
        BAU_CUA_MASCOTS[Math.floor(Math.random() * 6)]
      ];
      setBauCuaDice(finalDice);
      setIsBauCuaShaking(false);
      setIsBauCuaOpened(true);

      // Count matches
      const counts: Record<string, number> = {};
      finalDice.forEach((d) => {
        counts[d.id] = (counts[d.id] || 0) + 1;
      });

      let totalReturned = 0;
      Object.entries(bauCuaBets).forEach(([mascotId, bet]) => {
        const hitCount = counts[mascotId] || 0;
        if (hitCount > 0) {
          // Return original bet + hitCount * bet
          totalReturned += bet + hitCount * bet;
        }
      });

      const netProfit = totalReturned - totalBet;
      if (totalReturned > 0) {
        addOrbs(totalReturned);
      }

      const win = netProfit > 0;
      const diceNames = finalDice.map((d) => `${d.emoji} ${d.name}`).join(" • ");
      registerGameOutcome(
        win,
        netProfit,
        win ? `🎉 THẮNG CƯỢC +${netProfit.toLocaleString()} ORBS!` : totalReturned === totalBet ? "HÒA VỐN" : `❌ THUA CƯỢC -${Math.abs(netProfit).toLocaleString()} ORBS`,
        `Kết quả mở bát: ${diceNames}`
      );

      setIsPlaying(false);
    }, 1800);
  };

  // ==========================================
  // 2. PLAY LẬT XU (COIN FLIP)
  // ==========================================
  const handlePlayCoinFlip = () => {
    if (betAmount <= 0) return;
    if (betAmount > orbs) {
      alert(`Số dư Orbs không đủ! Cần ${betAmount.toLocaleString()} Orbs (Hiện có: ${orbs.toLocaleString()} Orbs).`);
      return;
    }

    if (!spendOrbs(betAmount)) return;

    setIsPlaying(true);
    setIsCoinFlipping(true);
    setCoinResult(null);
    setLastResult(null);
    playCoinSound();

    setTimeout(() => {
      const outcome: "sap" | "ngua" = Math.random() < 0.5 ? "sap" : "ngua";
      setCoinResult(outcome);
      setIsCoinFlipping(false);

      const win = outcome === coinChoice;
      const profit = win ? Math.floor(betAmount * 1.98) - betAmount : -betAmount;

      if (win) {
        addOrbs(Math.floor(betAmount * 1.98));
      }

      registerGameOutcome(
        win,
        profit,
        win ? `🎉 ĐOÁN ĐÚNG! NHẬN +${(betAmount * 1.98).toLocaleString()} ORBS` : `❌ ĐOÁN SAI! MẤT -${betAmount.toLocaleString()} ORBS`,
        `Mặt đồng xu rơi vào: ${outcome === "sap" ? "🌕 Mặt Sấp (Kim Long)" : "🌑 Mặt Ngửa (Hỏa Phụng)"}`
      );

      setIsPlaying(false);
    }, 1600);
  };

  // ==========================================
  // 3. PLAY ĐÁNH BÀI (BÀI CÀO 3 CÂY)
  // ==========================================
  const evaluateThreeCards = (cards: Card[]): { scoreText: string; rankScore: number } => {
    if (cards.length < 3) return { scoreText: "0 nút", rankScore: 0 };
    const [c1, c2, c3] = cards;

    // Check Sáp (3 of a kind)
    if (c1.value === c2.value && c2.value === c3.value) {
      return { scoreText: `🔥 Sáp ${c1.value} (Tuyệt đỉnh)`, rankScore: 1000 + c1.numVal };
    }

    // Check Ba Tây (3 face cards: J, Q, K)
    const isFace = (c: Card) => ["J", "Q", "K"].includes(c.value);
    if (isFace(c1) && isFace(c2) && isFace(c3)) {
      return { scoreText: `👑 Ba Tây (3 Tiên)`, rankScore: 500 };
    }

    // Normal point sum % 10
    const sum = (c1.numVal + c2.numVal + c3.numVal) % 10;
    return { scoreText: `${sum === 0 ? "Bù (0 nút)" : `${sum} Nút`}`, rankScore: sum };
  };

  const handleStartCardGame = () => {
    if (betAmount <= 0) return;
    if (betAmount > orbs) {
      alert(`Số dư Orbs không đủ! Cần ${betAmount.toLocaleString()} Orbs (Hiện có: ${orbs.toLocaleString()} Orbs).`);
      return;
    }

    if (!spendOrbs(betAmount)) return;

    setIsPlaying(true);
    setCardsRevealed([false, false, false]);
    setOpponentCardsRevealed(false);
    setCardScores(null);
    setLastResult(null);
    playCardSound();

    const deck = generateDeck().sort(() => Math.random() - 0.5);
    const pCards = [deck[0], deck[1], deck[2]];
    const oCards = [deck[3], deck[4], deck[5]];

    setPlayerCards(pCards);
    setOpponentCards(oCards);

    // Auto flip animation
    setTimeout(() => {
      setCardsRevealed([true, true, true]);
      playCardSound();

      setTimeout(() => {
        setOpponentCardsRevealed(true);
        const pEval = evaluateThreeCards(pCards);
        const oEval = evaluateThreeCards(oCards);
        setCardScores({ player: pEval.scoreText, opponent: oEval.scoreText });

        const win = pEval.rankScore > oEval.rankScore;
        const tie = pEval.rankScore === oEval.rankScore;
        const profit = win ? betAmount : tie ? 0 : -betAmount;

        if (win) {
          addOrbs(betAmount * 2);
        } else if (tie) {
          addOrbs(betAmount);
        }

        registerGameOutcome(
          win,
          profit,
          win ? `🎉 BẠN THẮNG! (${pEval.scoreText} vs ${oEval.scoreText})` : tie ? "🤝 HÒA ĐIỂM (Hoàn cược)" : `❌ BẠN THUA! (${pEval.scoreText} vs ${oEval.scoreText})`,
          `Đối thủ ${opponent.name} ra: ${oCards.map((c) => `${c.value}${c.suit}`).join(" ")}`
        );

        setIsPlaying(false);
      }, 1000);
    }, 800);
  };

  // ==========================================
  // 4. PLAY XÚC XẮC (TÀI XỈU)
  // ==========================================
  const handlePlayTaiXiu = () => {
    if (betAmount <= 0) return;
    if (betAmount > orbs) {
      alert(`Số dư Orbs không đủ! Cần ${betAmount.toLocaleString()} Orbs (Hiện có: ${orbs.toLocaleString()} Orbs).`);
      return;
    }

    if (!spendOrbs(betAmount)) return;

    setIsPlaying(true);
    setIsDiceRolling(true);
    setLastResult(null);
    playRollSound();

    const rollInt = setInterval(() => {
      setDiceValues([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
    }, 80);

    setTimeout(() => {
      clearInterval(rollInt);
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const d3 = Math.floor(Math.random() * 6) + 1;
      const finalDice = [d1, d2, d3];
      setDiceValues(finalDice);
      setIsDiceRolling(false);

      const total = d1 + d2 + d3;
      const isBao = d1 === d2 && d2 === d3;
      const isTai = total >= 11 && total <= 17 && !isBao;
      const isXiu = total >= 4 && total <= 10 && !isBao;
      const isChan = total % 2 === 0;
      const isLe = total % 2 !== 0;

      // Update history
      setDiceHistory((prev) => [isTai ? "T" : "X", ...prev.slice(0, 7)]);

      let win = false;
      let multiplier = 2;

      if (taiXiuChoice === "tai" && isTai) {
        win = true;
        multiplier = 2;
      } else if (taiXiuChoice === "xiu" && isXiu) {
        win = true;
        multiplier = 2;
      } else if (taiXiuChoice === "bao" && isBao) {
        win = true;
        multiplier = 31; // 1:30 payout
      } else if (taiXiuChoice === "chan" && isChan) {
        win = true;
        multiplier = 1.95;
      } else if (taiXiuChoice === "le" && isLe) {
        win = true;
        multiplier = 1.95;
      }

      const returnAmount = win ? Math.floor(betAmount * multiplier) : 0;
      const netProfit = win ? returnAmount - betAmount : -betAmount;

      if (win) {
        addOrbs(returnAmount);
      }

      registerGameOutcome(
        win,
        netProfit,
        win ? `🎉 TRÚNG CƯỢC +${netProfit.toLocaleString()} ORBS!` : `❌ THUA CƯỢC -${betAmount.toLocaleString()} ORBS`,
        `Xúc xắc: [${d1}] + [${d2}] + [${d3}] = ${total} điểm (${isBao ? "BÃO" : isTai ? "TÀI" : "XỈU"})`
      );

      setIsPlaying(false);
    }, 1700);
  };

  return (
    <div
      id="copilot-bet-arena"
      className="w-full bg-[#18191c] border-2 border-[#2b2d31] text-white p-3 sm:p-4 font-sans select-none relative shadow-2xl rounded-none animate-in fade-in zoom-in-95 duration-200"
    >
      {/* ARENA HEADER: ORBS BALANCE & STATS */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b-2 border-[#2b2d31]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-600/30 border-2 border-purple-400 flex items-center justify-center text-purple-300">
            <Coins className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider font-mono text-purple-300">
                SỚI CƯỢC ORBS VIP
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] px-1.5 py-0.2 font-mono font-bold">
                PvP LIVE
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-zinc-400 font-mono">Số dư:</span>
              <span className="text-sm font-black text-amber-400 font-mono">
                {orbs.toLocaleString()} <span className="text-[10px] text-purple-300">ORBS</span>
              </span>
              {streak > 1 && (
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.2 font-mono font-bold flex items-center gap-0.5">
                  <Flame className="w-3 h-3 text-rose-400" />
                  {streak} Trận Thắng
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick +50 Orbs Claim */}
          <button
            onClick={() => {
              playPopSound();
              addOrbs(50);
            }}
            className="bg-[#28960b] hover:bg-[#32b312] text-white px-2.5 py-1 text-[11px] font-bold font-mono border-2 border-[#141414] shadow-[inset_1px_1px_0_#89dc69] flex items-center gap-1 active:translate-y-[1px]"
            title="Nhận ngay 50 Orbs miễn phí"
          >
            <Gift className="w-3.5 h-3.5 text-yellow-300" />
            <span>+50 Free</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* GAME TABS SELECTOR (4 GAMES) */}
      <div className="grid grid-cols-4 gap-1.5 mt-3">
        {[
          { id: "baucua", name: "Bầu Cua", icon: "🦀", sub: "Tôm Cá" },
          { id: "latxu", name: "Lật Xu", icon: "🪙", sub: "Sấp / Ngửa" },
          { id: "danhbai", name: "Đánh Bài", icon: "🎴", sub: "3 Cây PvP" },
          { id: "xucxac", name: "Xúc Xắc", icon: "🎲", sub: "Tài Xỉu" }
        ].map((game) => {
          const isSelected = activeGame === game.id;
          return (
            <button
              key={game.id}
              onClick={() => {
                playPopSound();
                setActiveGame(game.id as BetGameType);
                setLastResult(null);
              }}
              disabled={isPlaying}
              className={`p-2 border-2 transition-all flex flex-col items-center justify-center text-center font-mono ${
                isSelected
                  ? "bg-purple-900/60 border-purple-400 text-white shadow-[inset_1px_1px_0_#c084fc]"
                  : "bg-[#212327] border-[#2b2d31] text-zinc-400 hover:text-zinc-200 hover:bg-[#282a2e]"
              }`}
            >
              <span className="text-base sm:text-lg">{game.icon}</span>
              <span className="text-[11px] sm:text-xs font-black uppercase mt-0.5">{game.name}</span>
              <span className="text-[9px] opacity-70 hidden sm:inline">{game.sub}</span>
            </button>
          );
        })}
      </div>

      {/* OPPONENT BAR (PVP MATCHMAKING / COPILOT) */}
      <div className="mt-3 p-2 bg-[#212327] border-2 border-[#2b2d31] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-[10px] text-zinc-400 uppercase font-bold">Chế độ:</span>
          <div className="flex items-center gap-1 bg-[#141517] p-0.5 border border-[#37393e]">
            <button
              onClick={() => {
                playPopSound();
                setMode("pvp");
              }}
              className={`px-2 py-0.5 text-[10px] font-bold ${
                mode === "pvp" ? "bg-purple-600 text-white" : "text-zinc-400"
              }`}
            >
              <Users className="w-3 h-3 inline mr-1" />
              Đấu PvP
            </button>
            <button
              onClick={() => {
                playPopSound();
                setMode("bot");
              }}
              className={`px-2 py-0.5 text-[10px] font-bold ${
                mode === "bot" ? "bg-purple-600 text-white" : "text-zinc-400"
              }`}
            >
              <Bot className="w-3 h-3 inline mr-1" />
              Đấu Copilot
            </button>
          </div>
        </div>

        {mode === "pvp" && (
          <div className="flex items-center gap-2 font-mono">
            <span className="text-[10px] text-zinc-400">Đối thủ:</span>
            <div className="flex items-center gap-1.5 bg-[#141517] px-2 py-1 border border-[#37393e]">
              <span className="text-sm">{opponent.avatar}</span>
              <span className="text-xs font-bold text-white">{opponent.name}</span>
              <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1 border border-purple-500/30">
                {opponent.badge}
              </span>
              <button
                onClick={handleRandomOpponent}
                disabled={isMatching || isPlaying}
                title="Đổi đối thủ khác"
                className="text-zinc-400 hover:text-white p-0.5 ml-1"
              >
                <RefreshCw className={`w-3 h-3 ${isMatching ? "animate-spin text-purple-400" : ""}`} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BET STAKE SELECTOR */}
      <div className="mt-3 p-2.5 bg-[#212327] border-2 border-[#2b2d31] space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-300 font-bold">Mức Cược Orbs Mỗi Ván:</span>
          <span className="text-amber-400 font-black">{betAmount.toLocaleString()} ORBS</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => {
                playPopSound();
                setBetAmount(amt);
              }}
              disabled={isPlaying}
              className={`px-2.5 py-1 text-xs font-mono font-bold border-2 transition-all ${
                betAmount === amt
                  ? "bg-amber-500 text-[#141414] border-amber-300 font-black shadow-[inset_1px_1px_0_#fef08a]"
                  : "bg-[#18191c] border-[#37393e] text-zinc-300 hover:text-white hover:border-zinc-500"
              }`}
            >
              {amt >= 1000 ? `${amt / 1000}k` : amt}
            </button>
          ))}
          <button
            onClick={() => {
              playPopSound();
              setBetAmount(Math.max(100, Math.min(orbs, 100000)));
            }}
            disabled={isPlaying || orbs < 100}
            className="px-2.5 py-1 text-xs font-mono font-bold bg-rose-600/30 border-2 border-rose-500/60 text-rose-300 hover:bg-rose-600 hover:text-white"
          >
            Tất tay
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. VIEW: BẦU CUA                                         */}
      {/* ======================================================== */}
      {activeGame === "baucua" && (
        <div className="mt-3 space-y-3">
          {/* Shaking Bowl / Revealed Dices */}
          <div className="bg-[#141517] border-2 border-[#2b2d31] p-4 text-center relative overflow-hidden">
            <div className="text-[10px] text-zinc-400 font-mono uppercase font-bold mb-2">
              Bát Xóc Bầu Cua (3 Hột Xí Ngầu)
            </div>

            <div className="flex items-center justify-center gap-3 my-2">
              {bauCuaDice.map((dice, idx) => (
                <motion.div
                  key={idx}
                  animate={
                    isBauCuaShaking
                      ? { rotate: [0, 15, -15, 10, -10, 0], y: [0, -6, 6, -3, 0] }
                      : { scale: [1, 1.05, 1] }
                  }
                  transition={{ repeat: isBauCuaShaking ? Infinity : 0, duration: 0.3 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-[#212327] border-4 border-[#37393e] flex flex-col items-center justify-center p-1 shadow-inner"
                  style={{ borderColor: dice.border }}
                >
                  <span className="text-2xl sm:text-3xl">{dice.emoji}</span>
                  <span className="text-[10px] font-bold font-mono mt-0.5" style={{ color: dice.color }}>
                    {dice.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 6 Betting Mascots Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {BAU_CUA_MASCOTS.map((mascot) => {
              const currentBet = bauCuaBets[mascot.id] || 0;
              return (
                <button
                  key={mascot.id}
                  onClick={() => handlePlaceBauCuaBet(mascot.id)}
                  disabled={isPlaying}
                  className="p-2 border-2 text-center transition-all relative group active:scale-95 flex flex-col items-center justify-between"
                  style={{
                    backgroundColor: currentBet > 0 ? mascot.bg : "#212327",
                    borderColor: currentBet > 0 ? mascot.border : "#37393e"
                  }}
                >
                  <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
                    {mascot.emoji}
                  </span>
                  <span className="text-xs font-black font-mono mt-1 text-white">{mascot.name}</span>
                  <div className="mt-1 w-full bg-[#141517] px-1 py-0.5 border border-black/40 text-[10px] font-mono font-bold text-amber-400">
                    {currentBet > 0 ? `${currentBet.toLocaleString()}` : "+ Cược"}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Buttons for Bầu Cua */}
          <div className="flex gap-2">
            <button
              onClick={handleClearBauCuaBets}
              disabled={isPlaying || Object.keys(bauCuaBets).length === 0}
              className="px-3 py-2.5 bg-[#212327] hover:bg-[#282a2e] border-2 border-[#37393e] text-xs font-mono font-bold text-zinc-300"
            >
              Xóa cược
            </button>
            <button
              onClick={handlePlayBauCua}
              disabled={isPlaying}
              className="flex-1 py-2.5 bg-[#28960b] hover:bg-[#32b312] text-white font-mono font-black text-xs sm:text-sm uppercase border-2 border-[#141414] shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] flex items-center justify-center gap-2 active:translate-y-[1px]"
            >
              <Swords className="w-4 h-4 text-yellow-300" />
              <span>{isPlaying ? "ĐANG XÓC ĐĨA..." : "XÓC ĐĨA & MỞ BÁT"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. VIEW: LẬT XU (COIN FLIP)                               */}
      {/* ======================================================== */}
      {activeGame === "latxu" && (
        <div className="mt-3 space-y-3">
          {/* 3D Coin Animation Board */}
          <div className="bg-[#141517] border-2 border-[#2b2d31] p-6 text-center flex flex-col items-center justify-center min-h-[160px]">
            <motion.div
              animate={
                isCoinFlipping
                  ? { rotateY: [0, 720, 1440, 2160], scale: [1, 1.25, 1] }
                  : { scale: [1, 1.05, 1] }
              }
              transition={{ repeat: isCoinFlipping ? Infinity : 0, duration: 0.8 }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-amber-400 bg-gradient-to-b from-amber-300 to-amber-600 shadow-[0_0_25px_rgba(245,158,11,0.4)] flex flex-col items-center justify-center p-2 text-[#141414] font-mono font-black"
            >
              <span className="text-3xl sm:text-4xl">
                {coinResult === "ngua" ? "🦅" : "🐲"}
              </span>
              <span className="text-[10px] font-black uppercase mt-0.5">
                {coinResult === "ngua" ? "NGỬA" : "SẤP"}
              </span>
            </motion.div>
            <div className="text-xs text-zinc-400 font-mono mt-3">
              Tỷ lệ trả thưởng: <strong className="text-emerald-400">x1.98 Lần</strong>
            </div>
          </div>

          {/* Choice: Sấp vs Ngửa */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                playPopSound();
                setCoinChoice("sap");
              }}
              disabled={isPlaying}
              className={`p-3 border-2 font-mono text-center flex flex-col items-center gap-1 ${
                coinChoice === "sap"
                  ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-[inset_1px_1px_0_#fef08a]"
                  : "bg-[#212327] border-[#37393e] text-zinc-400 hover:text-white"
              }`}
            >
              <span className="text-2xl">🐲</span>
              <span className="text-xs sm:text-sm font-black uppercase">MẶT SẤP (KIM LONG)</span>
            </button>

            <button
              onClick={() => {
                playPopSound();
                setCoinChoice("ngua");
              }}
              disabled={isPlaying}
              className={`p-3 border-2 font-mono text-center flex flex-col items-center gap-1 ${
                coinChoice === "ngua"
                  ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-[inset_1px_1px_0_#fef08a]"
                  : "bg-[#212327] border-[#37393e] text-zinc-400 hover:text-white"
              }`}
            >
              <span className="text-2xl">🦅</span>
              <span className="text-xs sm:text-sm font-black uppercase">MẶT NGỬA (HỎA PHỤNG)</span>
            </button>
          </div>

          {/* Action Button */}
          <button
            onClick={handlePlayCoinFlip}
            disabled={isPlaying}
            className="w-full py-2.5 bg-[#28960b] hover:bg-[#32b312] text-white font-mono font-black text-xs sm:text-sm uppercase border-2 border-[#141414] shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] flex items-center justify-center gap-2 active:translate-y-[1px]"
          >
            <Coins className="w-4 h-4 text-yellow-300" />
            <span>{isPlaying ? "ĐANG TUNG ĐỒNG XU..." : `TUNG ĐỒNG XU CƯỢC ${betAmount.toLocaleString()} ORBS`}</span>
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. VIEW: ĐÁNH BÀI (BÀI CÀO 3 CÂY)                       */}
      {/* ======================================================== */}
      {activeGame === "danhbai" && (
        <div className="mt-3 space-y-3">
          {/* Card Table */}
          <div className="bg-[#141517] border-2 border-[#2b2d31] p-3 sm:p-4 space-y-4">
            {/* Opponent Cards */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono mb-1 text-zinc-400">
                <span>
                  {opponent.avatar} {opponent.name} ({mode === "pvp" ? "Người chơi" : "Copilot Master"}):
                </span>
                {cardScores && <span className="text-amber-400 font-bold">{cardScores.opponent}</span>}
              </div>
              <div className="flex gap-2">
                {(opponentCards.length ? opponentCards : [1, 2, 3]).map((c, i) => (
                  <div
                    key={i}
                    className="w-14 h-20 sm:w-16 sm:h-24 bg-[#212327] border-2 border-[#37393e] rounded flex items-center justify-center font-mono text-sm font-bold shadow"
                  >
                    {opponentCardsRevealed && typeof c === "object" ? (
                      <span style={{ color: c.color }} className="text-base sm:text-lg">
                        {c.value}
                        {c.suit}
                      </span>
                    ) : (
                      <span className="text-xs text-purple-400">🎴 VNRT Online</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#2b2d31]" />

            {/* Player Cards */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono mb-1 text-zinc-400">
                <span className="text-purple-300 font-bold">👤 Bộ bài của bạn:</span>
                {cardScores && <span className="text-emerald-400 font-bold">{cardScores.player}</span>}
              </div>
              <div className="flex gap-2">
                {(playerCards.length ? playerCards : [1, 2, 3]).map((c, i) => (
                  <div
                    key={i}
                    className="w-14 h-20 sm:w-16 sm:h-24 bg-[#282a2e] border-2 border-purple-500/50 rounded flex items-center justify-center font-mono font-bold shadow-lg"
                  >
                    {cardsRevealed[i] && typeof c === "object" ? (
                      <span style={{ color: c.color }} className="text-base sm:text-lg">
                        {c.value}
                        {c.suit}
                      </span>
                    ) : (
                      <span className="text-xs text-purple-300">🎴 Úp</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleStartCardGame}
            disabled={isPlaying}
            className="w-full py-2.5 bg-[#28960b] hover:bg-[#32b312] text-white font-mono font-black text-xs sm:text-sm uppercase border-2 border-[#141414] shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] flex items-center justify-center gap-2 active:translate-y-[1px]"
          >
            <Swords className="w-4 h-4 text-yellow-300" />
            <span>{isPlaying ? "ĐANG CHIA BÀI & SO NÚT..." : `CHIA BÀI ĐẤU ${opponent.name}`}</span>
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. VIEW: XÚC XẮC (TÀI XỈU)                              */}
      {/* ======================================================== */}
      {activeGame === "xucxac" && (
        <div className="mt-3 space-y-3">
          {/* Dice Result Plate */}
          <div className="bg-[#141517] border-2 border-[#2b2d31] p-4 text-center flex flex-col items-center justify-center">
            <div className="flex items-center gap-3 my-2">
              {diceValues.map((val, i) => (
                <motion.div
                  key={i}
                  animate={isDiceRolling ? { rotate: [0, 360], scale: [1, 1.2, 1] } : {}}
                  transition={{ repeat: isDiceRolling ? Infinity : 0, duration: 0.3 }}
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-white text-[#141414] border-4 border-zinc-400 rounded-lg flex items-center justify-center font-mono text-2xl font-black shadow-lg"
                >
                  {val}
                </motion.div>
              ))}
            </div>
            <div className="text-xs font-mono text-zinc-300 mt-1">
              Tổng điểm:{" "}
              <strong className="text-amber-400 text-sm">
                {diceValues.reduce((a, b) => a + b, 0)} Điểm
              </strong>
            </div>

            {/* Cầu Tài Xỉu History */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] text-zinc-400 font-mono">Lịch sử cầu:</span>
              <div className="flex gap-1">
                {diceHistory.map((item, idx) => (
                  <span
                    key={idx}
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                      item === "T"
                        ? "bg-rose-600 text-white"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bet Types: Tài / Xỉu / Bão / Chẵn / Lẻ */}
          <div className="grid grid-cols-3 gap-2 font-mono text-center">
            <button
              onClick={() => {
                playPopSound();
                setTaiXiuChoice("tai");
              }}
              disabled={isPlaying}
              className={`p-2.5 border-2 ${
                taiXiuChoice === "tai"
                  ? "bg-rose-600/30 border-rose-500 text-rose-300 shadow-[inset_1px_1px_0_#fda4af]"
                  : "bg-[#212327] border-[#37393e] text-zinc-400"
              }`}
            >
              <div className="text-xs sm:text-sm font-black uppercase text-rose-400">🔴 TÀI (11-17)</div>
              <div className="text-[10px] opacity-70">x2.0 Lần</div>
            </button>

            <button
              onClick={() => {
                playPopSound();
                setTaiXiuChoice("xiu");
              }}
              disabled={isPlaying}
              className={`p-2.5 border-2 ${
                taiXiuChoice === "xiu"
                  ? "bg-blue-600/30 border-blue-500 text-blue-300 shadow-[inset_1px_1px_0_#93c5fd]"
                  : "bg-[#212327] border-[#37393e] text-zinc-400"
              }`}
            >
              <div className="text-xs sm:text-sm font-black uppercase text-blue-400">🔵 XỈU (4-10)</div>
              <div className="text-[10px] opacity-70">x2.0 Lần</div>
            </button>

            <button
              onClick={() => {
                playPopSound();
                setTaiXiuChoice("bao");
              }}
              disabled={isPlaying}
              className={`p-2.5 border-2 ${
                taiXiuChoice === "bao"
                  ? "bg-amber-600/30 border-amber-500 text-amber-300 shadow-[inset_1px_1px_0_#fef08a]"
                  : "bg-[#212327] border-[#37393e] text-zinc-400"
              }`}
            >
              <div className="text-xs sm:text-sm font-black uppercase text-amber-400">🟡 BÃO (3 Hột)</div>
              <div className="text-[10px] opacity-70">x30 Lần</div>
            </button>
          </div>

          {/* Action Button */}
          <button
            onClick={handlePlayTaiXiu}
            disabled={isPlaying}
            className="w-full py-2.5 bg-[#28960b] hover:bg-[#32b312] text-white font-mono font-black text-xs sm:text-sm uppercase border-2 border-[#141414] shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] flex items-center justify-center gap-2 active:translate-y-[1px]"
          >
            <Zap className="w-4 h-4 text-yellow-300" />
            <span>{isPlaying ? "ĐANG LẮC XÚC XẮC..." : `LẮC XÚC XẮC CƯỢC ${betAmount.toLocaleString()} ORBS`}</span>
          </button>
        </div>
      )}

      {/* OUTCOME NOTIFICATION BANNER */}
      {lastResult && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-3 p-2.5 border-2 font-mono text-center ${
            lastResult.win
              ? "bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-[inset_1px_1px_0_#6ee7b7]"
              : "bg-rose-950/60 border-rose-500 text-rose-300 shadow-[inset_1px_1px_0_#fca5a5]"
          }`}
        >
          <div className="text-xs font-black uppercase">{lastResult.title}</div>
          <div className="text-[11px] opacity-90 mt-0.5">{lastResult.description}</div>
        </motion.div>
      )}
    </div>
  );
};
