import React, { useState, useEffect, useMemo } from "react";
import {
  Gamepad2,
  Star,
  Search,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Bot,
  Users,
  Shuffle,
  HelpCircle,
  Send,
  X,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Flame,
  CheckCircle2,
  Trophy
} from "lucide-react";
import { playPopSound } from "../../utils/sound";
import { MOCK_100_FRIENDS, VplayUser } from "../../data/mockFriendsData";
import { WheelOfFortuneGame } from "./WheelOfFortuneGame";

/* =========================================================================
   LIQUID GLASS V-GAMES & ARCADE ZONE
   Aesthetic matching NewsView.tsx (Frosted Glass, Specular Rim, Ambient Blur)
   ========================================================================= */

interface GameItem {
  id: string;
  title: string;
  category: "classic" | "puzzle";
  categoryLabel: string;
  description: string;
  rating: number;
  plays: string;
  gradient: string;
  badge: string;
  difficulty: "Dễ" | "Trung bình" | "Khó";
}

export const ARCADE_5_GAMES: GameItem[] = [
  {
    id: "wheel_of_fortune",
    title: "Vòng Quay May Mắn (Wheels of Fortune)",
    category: "classic",
    categoryLabel: "May Mắn",
    description: "Vòng quay ngẫu nhiên kỳ diệu: Tự tạo danh sách ô thưởng, tùy biến thời gian quay và âm thanh tích tắc sống động.",
    rating: 5.0,
    plays: "520K",
    gradient: "from-amber-500 via-rose-500 to-purple-600",
    badge: "HOT • Vòng Quay",
    difficulty: "Dễ"
  },
  {
    id: "tic_tac_toe",
    title: "Cờ Caro XO (Tic-Tac-Toe)",
    category: "classic",
    categoryLabel: "Cổ Điển",
    description: "Đánh X/O đấu trí đỉnh cao cùng NPC ngẫu nhiên hoặc 2 người chơi pass & play đối kháng.",
    rating: 4.95,
    plays: "280K",
    gradient: "from-purple-500 via-indigo-600 to-blue-600",
    badge: "Caro 3x3",
    difficulty: "Dễ"
  },
  {
    id: "rock_paper_scissors",
    title: "Oẳn Tù Tì (Kéo Búa Bao)",
    category: "classic",
    categoryLabel: "Cổ Điển",
    description: "Trò chơi Oẳn Tù Tì thử phản xạ và may mắn cùng NPC hoặc đối thủ 2 người.",
    rating: 4.90,
    plays: "250K",
    gradient: "from-rose-500 via-pink-600 to-amber-500",
    badge: "Kéo Búa Bao",
    difficulty: "Dễ"
  },
  {
    id: "word_chain",
    title: "Nối Từ Tiếng Việt & Tiếng Anh",
    category: "puzzle",
    categoryLabel: "Đố Vui",
    description: "Thử thách Nối Từ ghép Tiếng Việt & chữ cái Tiếng Anh cùng NPC và bạn bè.",
    rating: 4.98,
    plays: "310K",
    gradient: "from-emerald-500 via-teal-600 to-cyan-600",
    badge: "Từ Vựng",
    difficulty: "Trung bình"
  },
  {
    id: "counting_game",
    title: "Đếm Số 1 -> N (Phá Chuỗi Reset)",
    category: "puzzle",
    categoryLabel: "Đố Vui",
    description: "Đếm số nối tiếp từ 1 đến N. Ai đếm sai hay quá giờ sẽ phá chuỗi và bắt đầu lại!",
    rating: 4.92,
    plays: "240K",
    gradient: "from-blue-500 via-cyan-600 to-indigo-600",
    badge: "Phản Xạ",
    difficulty: "Dễ"
  },
  {
    id: "snake",
    title: "Rắn Săn Mồi (Retro Snake)",
    category: "classic",
    categoryLabel: "Cổ Điển",
    description: "Điều khiển chú rắn ăn mồi nâng điểm số, tránh va chạm vào tường hay thân mình.",
    rating: 4.96,
    plays: "350K",
    gradient: "from-emerald-500 via-green-600 to-teal-700",
    badge: "Retro Arcade",
    difficulty: "Trung bình"
  }
];

interface VArcadeTabProps {
  initialGameId?: string | null;
}

export const VArcadeTab: React.FC<VArcadeTabProps> = ({ initialGameId }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGame, setActiveGame] = useState<GameItem | null>(() => {
    if (initialGameId) {
      return ARCADE_5_GAMES.find((g) => g.id === initialGameId) || null;
    }
    return null;
  });

  useEffect(() => {
    if (initialGameId) {
      const found = ARCADE_5_GAMES.find((g) => g.id === initialGameId);
      if (found) {
        setActiveGame(found);
      }
    }
  }, [initialGameId]);

  const [favoriteGames, setFavoriteGames] = useState<string[]>([
    "wheel_of_fortune",
    "tic_tac_toe",
    "rock_paper_scissors",
    "word_chain",
    "counting_game",
    "snake"
  ]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [highScores, setHighScores] = useState<Record<string, number>>({
    wheel_of_fortune: 100,
    tic_tac_toe: 12,
    rock_paper_scissors: 8,
    word_chain: 15,
    counting_game: 32,
    snake: 140
  });

  const updateHighScore = (gameId: string, score: number) => {
    setHighScores((prev) => ({
      ...prev,
      [gameId]: Math.max(prev[gameId] || 0, score)
    }));
  };

  const toggleFavorite = (gameId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favoriteGames.includes(gameId)) {
      setFavoriteGames(favoriteGames.filter((id) => id !== gameId));
    } else {
      setFavoriteGames([...favoriteGames, gameId]);
    }
    if (soundEnabled) playPopSound();
  };

  const filteredGames = ARCADE_5_GAMES.filter((g) => {
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === "all") return matchesSearch;
    if (selectedCategory === "favorites") return favoriteGames.includes(g.id) && matchesSearch;
    return g.category === selectedCategory && matchesSearch;
  });

  /* =========================================================================
     VIEW: ACTIVE GAME STAGE (V-FLOW THEME)
     ========================================================================= */
  if (activeGame) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-5 select-none font-sans text-white animate-fade-in pb-16">
        {/* Navigation Breadcrumb & Sound Controls Bar */}
        <div className="bg-[#1F1E24] rounded-2xl p-4 sm:p-5 shadow-lg border border-[#2D2D38] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              setActiveGame(null);
              playPopSound();
            }}
            className="px-4 py-2 rounded-xl bg-[#2A2933] hover:bg-[#34333F] text-zinc-200 border border-[#3E3D4D] text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay Lại Sảnh Trò Chơi</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playPopSound();
              }}
              className="px-3.5 py-2 rounded-xl bg-[#2A2933] hover:bg-[#34333F] text-zinc-200 border border-[#3E3D4D] text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              title="Bật/Tắt âm thanh"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-rose-400" />
              )}
              <span className="hidden sm:inline">
                {soundEnabled ? "Âm Thanh Bật" : "Âm Thanh Tắt"}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveGame(null);
                playPopSound();
              }}
              className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              title="Thoát Game về Lobby"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
              <span>Đóng Game</span>
            </button>
          </div>
        </div>

        {/* Quick Switch Game Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {ARCADE_5_GAMES.map((g) => {
            const isCur = g.id === activeGame.id;
            return (
              <button
                key={g.id}
                onClick={() => {
                  setActiveGame(g);
                  playPopSound();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                  isCur
                    ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent shadow-md"
                    : "bg-[#1F1E24] hover:bg-[#2A2933] text-zinc-400 hover:text-white border-[#2D2D38]"
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>{g.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Game Title Bar Header */}
        <div className="bg-[#1F1E24] rounded-2xl p-4 sm:p-5 border border-[#2D2D38] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeGame.gradient} flex items-center justify-center text-white shadow-lg shrink-0`}
            >
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {activeGame.title}
              </h2>
              <p className="text-xs text-[#9CA3AF] font-sans mt-0.5">
                {activeGame.categoryLabel} • Độ khó: {activeGame.difficulty} • Kỷ lục:{" "}
                <span className="text-amber-400 font-bold">
                  {highScores[activeGame.id] || 0} pts
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => toggleFavorite(activeGame.id, e)}
              className="px-3.5 py-1.5 rounded-xl bg-[#2A2933] hover:bg-[#34333F] text-zinc-300 border border-[#3E3D4D] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Star
                className={`w-4 h-4 ${
                  favoriteGames.includes(activeGame.id)
                    ? "fill-amber-400 text-amber-400"
                    : ""
                }`}
              />
              <span>{favoriteGames.includes(activeGame.id) ? "Đã Lưu" : "Yêu Thích"}</span>
            </button>
          </div>
        </div>

        {/* The Game Arena Container */}
        <div className="w-full bg-[#1F1E24] rounded-2xl p-5 sm:p-8 min-h-[420px] flex flex-col items-center justify-center relative border border-[#2D2D38] shadow-xl overflow-hidden">
          {activeGame.id === "wheel_of_fortune" && (
            <WheelOfFortuneGame
              soundEnabled={soundEnabled}
              onScoreUpdate={(s) => updateHighScore("wheel_of_fortune", s)}
              onClose={() => setActiveGame(null)}
            />
          )}
          {activeGame.id === "tic_tac_toe" && (
            <TicTacToeGame
              soundEnabled={soundEnabled}
              onScoreUpdate={(s) => updateHighScore("tic_tac_toe", s)}
              onClose={() => setActiveGame(null)}
            />
          )}
          {activeGame.id === "rock_paper_scissors" && (
            <RockPaperScissorsGame
              soundEnabled={soundEnabled}
              onScoreUpdate={(s) => updateHighScore("rock_paper_scissors", s)}
              onClose={() => setActiveGame(null)}
            />
          )}
          {activeGame.id === "word_chain" && (
            <WordChainGame
              soundEnabled={soundEnabled}
              onScoreUpdate={(s) => updateHighScore("word_chain", s)}
              onClose={() => setActiveGame(null)}
            />
          )}
          {activeGame.id === "counting_game" && (
            <CountingGame
              soundEnabled={soundEnabled}
              onScoreUpdate={(s) => updateHighScore("counting_game", s)}
              onClose={() => setActiveGame(null)}
            />
          )}
          {activeGame.id === "snake" && (
            <SnakeGame
              soundEnabled={soundEnabled}
              onScoreUpdate={(s) => updateHighScore("snake", s)}
              onClose={() => setActiveGame(null)}
            />
          )}
        </div>

        {/* Footer Instructions & Rules */}
        <div className="bg-[#1F1E24] rounded-2xl p-4 border border-[#2D2D38] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9CA3AF] shadow-md">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4.5 h-4.5 text-amber-400 shrink-0" />
            <span>{activeGame.description}</span>
          </div>
          <button
            onClick={() => {
              setActiveGame(null);
              playPopSound();
            }}
            className="px-4 py-2 rounded-xl bg-[#2A2933] hover:bg-[#34333F] text-zinc-200 border border-[#3E3D4D] text-xs font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Quay Lại Kho Game
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
     VIEW: ARCADE LOBBY (V-FLOW THEME)
     ========================================================================= */
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 select-none font-sans text-white pb-16">
      {/* Top Banner Header (V-Flow) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#2D2D38]">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                V-Games
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  TRÒ CHƠI & ARCADE
                </span>
              </h1>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Vòng Quay May Mắn, Cờ Caro XO, Oẳn Tù Tì, Nối Từ, Đếm Số & Rắn Săn Mồi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playPopSound();
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#1F1E24] hover:bg-[#282733] text-zinc-300 border border-[#2D2D38] text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            title="Bật/Tắt âm thanh"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span>{soundEnabled ? "ÂM THANH BẬT" : "ÂM THANH TẮT"}</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1F1E24] rounded-2xl p-3 border border-[#2D2D38] shadow-md">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm trò chơi V-Games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-[#18171E] border border-[#2D2D38] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#9CA3AF] shrink-0">
            <span className="text-amber-400 font-bold text-sm">{filteredGames.length}</span> / {ARCADE_5_GAMES.length} trò chơi
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "all", label: `Tất Cả (${ARCADE_5_GAMES.length})` },
            { id: "favorites", label: `Yêu Thích (${favoriteGames.length})` },
            { id: "classic", label: "Cổ Điển & May Mắn" },
            { id: "puzzle", label: "Đố Vui & Trí Tuệ" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                playPopSound();
              }}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold border transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent shadow-md"
                  : "bg-[#1F1E24] hover:bg-[#282733] text-zinc-400 hover:text-white border-[#2D2D38]"
              }`}
            >
              {cat.id === "favorites" && (
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              )}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Games */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGames.map((game) => {
          const isFav = favoriteGames.includes(game.id);

          return (
            <div
              key={game.id}
              onClick={() => {
                setActiveGame(game);
                playPopSound();
              }}
              className="group bg-[#1F1E24] rounded-2xl p-5 border border-[#2D2D38] hover:border-amber-500/50 hover:bg-[#24232B] transition-all duration-200 flex flex-col justify-between cursor-pointer shadow-lg active:scale-[0.99]"
            >
              <div>
                {/* Top Card Banner */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${game.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}
                  >
                    <Gamepad2 className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#18171E] text-amber-300 border border-[#2D2D38]">
                      {game.badge}
                    </span>
                    <button
                      onClick={(e) => toggleFavorite(game.id, e)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer"
                      title="Yêu thích"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          isFav ? "fill-amber-400 text-amber-400" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Title & Info */}
                <div className="mb-4">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 mb-1.5">
                    {game.title}
                  </h3>
                  <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed">
                    {game.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="space-y-3 pt-3.5 border-t border-[#2D2D38]">
                <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {game.rating}
                  </span>
                  <span className="text-emerald-400 font-semibold">{game.difficulty}</span>
                </div>

                <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 transition-all">
                  <Play className="w-4 h-4 fill-current" /> CHƠI NGAY
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================================================
   OPPONENT BAR COMPONENT (LIQUID GLASS STYLE)
   ========================================================================= */
const OpponentBar: React.FC<{
  gameMode: "npc" | "pvp";
  setGameMode: (mode: "npc" | "pvp") => void;
  selectedNpc: VplayUser;
  setSelectedNpc: (npc: VplayUser) => void;
}> = ({ gameMode, setGameMode, selectedNpc, setSelectedNpc }) => {
  const [showNpcPicker, setShowNpcPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");

  const filteredNpcs = useMemo(() => {
    return MOCK_100_FRIENDS.filter((friend) =>
      friend.name.toLowerCase().includes(pickerSearch.toLowerCase())
    );
  }, [pickerSearch]);

  const handleRandomize = () => {
    const randomNpc =
      MOCK_100_FRIENDS[Math.floor(Math.random() * MOCK_100_FRIENDS.length)];
    setSelectedNpc(randomNpc);
    playPopSound();
  };

  return (
    <div className="w-full mb-5 p-4 rounded-2xl bg-[#18171E] border border-[#2D2D38] flex flex-col gap-3 shadow-md relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Mode Buttons */}
        <div className="flex items-center gap-1.5 bg-[#1F1E24] p-1 rounded-xl border border-[#2D2D38]">
          <button
            type="button"
            onClick={() => {
              setGameMode("npc");
              playPopSound();
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              gameMode === "npc"
                ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Bot className="w-4 h-4" /> Chơi Với NPC
          </button>
          <button
            type="button"
            onClick={() => {
              setGameMode("pvp");
              playPopSound();
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              gameMode === "pvp"
                ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" /> 2 Người Chơi
          </button>
        </div>

        {/* NPC Selector & Randomize Button */}
        {gameMode === "npc" && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setShowNpcPicker(!showNpcPicker);
                playPopSound();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#2A2933] hover:bg-[#34333F] text-white border border-[#3E3D4D] text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <img
                src={selectedNpc.avatar}
                alt={selectedNpc.name}
                className="w-5 h-5 rounded-full border border-white/30 object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <span className="text-amber-300 font-bold truncate max-w-[120px]">
                {selectedNpc.name}
              </span>
            </button>

            <button
              type="button"
              onClick={handleRandomize}
              className="p-2 rounded-xl bg-[#2A2933] hover:bg-[#34333F] text-amber-300 border border-[#3E3D4D] cursor-pointer flex items-center justify-center transition-all active:scale-95"
              title="Đổi đối thủ NPC ngẫu nhiên"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* NPC Picker Drawer Dropdown */}
      {showNpcPicker && gameMode === "npc" && (
        <div className="mt-2 p-3.5 rounded-2xl bg-[#1F1E24] border border-[#2D2D38] shadow-2xl space-y-3 animate-fade-in z-20">
          <div className="flex items-center justify-between gap-2 border-b border-[#2D2D38] pb-2">
            <span className="text-xs font-bold text-amber-300 uppercase">
              Chọn NPC Đối Thủ
            </span>
            <button
              type="button"
              onClick={() => setShowNpcPicker(false)}
              className="text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Tìm kiếm NPC bạn bè..."
            value={pickerSearch}
            onChange={(e) => setPickerSearch(e.target.value)}
            className="w-full bg-[#18171E] border border-[#2D2D38] rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
            {filteredNpcs.slice(0, 18).map((npc) => (
              <button
                key={npc.id}
                type="button"
                onClick={() => {
                  setSelectedNpc(npc);
                  setShowNpcPicker(false);
                  playPopSound();
                }}
                className={`p-2 rounded-xl border text-xs flex items-center gap-2 text-left cursor-pointer transition-all ${
                  selectedNpc.id === npc.id
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-200"
                    : "bg-[#18171E] border-[#2D2D38] text-zinc-300 hover:bg-[#25242E]"
                }`}
              >
                <img
                  src={npc.avatar}
                  alt={npc.name}
                  className="w-6 h-6 rounded-full object-cover border border-white/20 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <span className="truncate font-semibold">{npc.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   GAME 1: TIC TAC TOE (LIQUID GLASS STYLE)
   ========================================================================= */
const TicTacToeGame: React.FC<{
  soundEnabled: boolean;
  onScoreUpdate: (score: number) => void;
  onClose: () => void;
}> = ({ soundEnabled, onScoreUpdate, onClose }) => {
  const [gameMode, setGameMode] = useState<"npc" | "pvp">("npc");
  const [selectedNpc, setSelectedNpc] = useState<VplayUser>(
    () => MOCK_100_FRIENDS[Math.floor(Math.random() * MOCK_100_FRIENDS.length)]
  );
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<string | null>(null);
  const [scores, setScores] = useState({ p1: 0, p2Npc: 0, ties: 0 });

  const checkWinner = (b: (string | null)[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (const [a, bIdx, c] of lines) {
      if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) return b[a];
    }
    if (b.every((cell) => cell !== null)) return "Tie";
    return null;
  };

  const handleCellClick = (idx: number) => {
    if (board[idx] || winner) return;
    if (soundEnabled) playPopSound();

    const newBoard = [...board];
    newBoard[idx] = turn;
    setBoard(newBoard);

    const win = checkWinner(newBoard);
    if (win) {
      handleGameOver(win);
    } else {
      const nextTurn = turn === "X" ? "O" : "X";
      setTurn(nextTurn);
    }
  };

  useEffect(() => {
    if (gameMode === "npc" && turn === "O" && !winner) {
      const timer = setTimeout(() => {
        makeNpcMove();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [board, turn, winner, gameMode]);

  const makeNpcMove = () => {
    const emptyIndices = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((v): v is number => v !== null);

    if (emptyIndices.length === 0) return;

    let targetIndex = -1;
    for (const idx of emptyIndices) {
      const testBoard = [...board];
      testBoard[idx] = "O";
      if (checkWinner(testBoard) === "O") {
        targetIndex = idx;
        break;
      }
    }

    if (targetIndex === -1) {
      for (const idx of emptyIndices) {
        const testBoard = [...board];
        testBoard[idx] = "X";
        if (checkWinner(testBoard) === "X") {
          targetIndex = idx;
          break;
        }
      }
    }

    if (targetIndex === -1 && emptyIndices.includes(4)) targetIndex = 4;
    if (targetIndex === -1) {
      targetIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }

    const newBoard = [...board];
    newBoard[targetIndex] = "O";
    setBoard(newBoard);

    const win = checkWinner(newBoard);
    if (win) {
      handleGameOver(win);
    } else {
      setTurn("X");
    }
  };

  const handleGameOver = (winResult: string) => {
    setWinner(winResult);
    if (winResult === "X") {
      setScores((s) => {
        const updated = { ...s, p1: s.p1 + 1 };
        onScoreUpdate(updated.p1 * 10);
        return updated;
      });
    } else if (winResult === "O") {
      setScores((s) => ({ ...s, p2Npc: s.p2Npc + 1 }));
    } else {
      setScores((s) => ({ ...s, ties: s.ties + 1 }));
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn("X");
    setWinner(null);
    if (soundEnabled) playPopSound();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      <OpponentBar
        gameMode={gameMode}
        setGameMode={(m) => {
          setGameMode(m);
          resetGame();
        }}
        selectedNpc={selectedNpc}
        setSelectedNpc={setSelectedNpc}
      />

      {/* Turn Indicator */}
      <div className="mb-4 text-center w-full">
        {winner ? (
          <div className="rounded-2xl bg-amber-500/20 border border-amber-400/50 px-4 py-3 text-sm font-bold text-amber-300 shadow-md">
            {winner === "Tie"
              ? "🤝 Trận đấu Hòa nhau!"
              : winner === "X"
              ? "🎉 Bạn (X) Thắng Cuộc!"
              : gameMode === "npc"
              ? `🤖 ${selectedNpc.name} (O) Thắng!`
              : "🎉 Người chơi 2 (O) Thắng!"}
          </div>
        ) : (
          <div className="text-xs sm:text-sm font-semibold text-white/80 flex items-center justify-center gap-2">
            <span>LƯỢT ĐÁNH:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                turn === "X"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                  : "bg-amber-500 text-black shadow-md shadow-amber-500/25"
              }`}
            >
              {turn === "X"
                ? "BẠN (X)"
                : gameMode === "npc"
                ? `${selectedNpc.name.toUpperCase()} (O)`
                : "NGƯỜI CHƠI 2 (O)"}
            </span>
          </div>
        )}
      </div>

      {/* Grid Board (Liquid Glass) */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-3xl bg-white/[0.06] backdrop-blur-[20px] border border-white/15 shadow-xl mb-5">
        {board.map((cell, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleCellClick(idx)}
            disabled={cell !== null || winner !== null || (gameMode === "npc" && turn === "O")}
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border font-black text-3xl sm:text-4xl flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-md ${
              cell === "X"
                ? "bg-gradient-to-br from-emerald-400 to-teal-600 text-white border-emerald-300/50"
                : cell === "O"
                ? "bg-gradient-to-br from-amber-400 to-rose-500 text-white border-amber-300/50"
                : "bg-white/10 hover:bg-white/20 border-white/15 text-transparent"
            }`}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* Scores & Controls Bar */}
      <div className="w-full flex items-center justify-between gap-3 bg-white/[0.08] backdrop-blur-[20px] p-3.5 rounded-2xl border border-white/15">
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="text-emerald-400 font-bold">X: {scores.p1}</span>
          <span className="text-white/50">Hòa: {scores.ties}</span>
          <span className="text-amber-400 font-bold">O: {scores.p2Npc}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetGame}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-bold uppercase shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Ván Mới
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <X className="w-3.5 h-3.5" /> Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 2: ROCK PAPER SCISSORS (LIQUID GLASS STYLE)
   ========================================================================= */
const RockPaperScissorsGame: React.FC<{
  soundEnabled: boolean;
  onScoreUpdate: (score: number) => void;
  onClose: () => void;
}> = ({ soundEnabled, onScoreUpdate, onClose }) => {
  const [gameMode, setGameMode] = useState<"npc" | "pvp">("npc");
  const [selectedNpc, setSelectedNpc] = useState<VplayUser>(
    () => MOCK_100_FRIENDS[Math.floor(Math.random() * MOCK_100_FRIENDS.length)]
  );
  const [p1Choice, setP1Choice] = useState<"rock" | "paper" | "scissors" | null>(null);
  const [p2Choice, setP2Choice] = useState<"rock" | "paper" | "scissors" | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [scores, setScores] = useState({ p1: 0, p2Npc: 0, ties: 0 });

  const choices: { id: "rock" | "paper" | "scissors"; label: string; icon: string }[] = [
    { id: "rock", label: "BÚA (Rock)", icon: "✊" },
    { id: "paper", label: "BAO (Paper)", icon: "✋" },
    { id: "scissors", label: "KÉO (Scissors)", icon: "✌️" }
  ];

  const handlePlay = (choice: "rock" | "paper" | "scissors") => {
    if (soundEnabled) playPopSound();
    setP1Choice(choice);

    let opponentChoice: "rock" | "paper" | "scissors";
    if (gameMode === "npc") {
      const keys: ("rock" | "paper" | "scissors")[] = ["rock", "paper", "scissors"];
      opponentChoice = keys[Math.floor(Math.random() * keys.length)];
      setP2Choice(opponentChoice);
      evaluateRound(choice, opponentChoice);
    }
  };

  const evaluateRound = (c1: string, c2: string) => {
    if (c1 === c2) {
      setResult("Hòa nhau!");
      setScores((s) => ({ ...s, ties: s.ties + 1 }));
    } else if (
      (c1 === "rock" && c2 === "scissors") ||
      (c1 === "paper" && c2 === "rock") ||
      (c1 === "scissors" && c2 === "paper")
    ) {
      setResult("🎉 Bạn Thắng Vòng Này!");
      setScores((s) => {
        const updated = { ...s, p1: s.p1 + 1 };
        onScoreUpdate(updated.p1 * 10);
        return updated;
      });
    } else {
      setResult(gameMode === "npc" ? `🤖 ${selectedNpc.name} Thắng!` : "Người chơi 2 Thắng!");
      setScores((s) => ({ ...s, p2Npc: s.p2Npc + 1 }));
    }
  };

  const resetRound = () => {
    setP1Choice(null);
    setP2Choice(null);
    setResult(null);
    if (soundEnabled) playPopSound();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      <OpponentBar
        gameMode={gameMode}
        setGameMode={(m) => {
          setGameMode(m);
          resetRound();
        }}
        selectedNpc={selectedNpc}
        setSelectedNpc={setSelectedNpc}
      />

      {/* Result Display */}
      <div className="w-full mb-5 text-center">
        {result ? (
          <div className="rounded-2xl bg-amber-500/20 border border-amber-400/50 px-4 py-3 text-sm font-bold text-amber-300 shadow-md">
            {result}
          </div>
        ) : (
          <div className="text-xs sm:text-sm font-semibold text-white/80">
            HÃY CHỌN NƯỚC ĐI CỦA BẠN:
          </div>
        )}
      </div>

      {/* Choices Battle Arena */}
      <div className="w-full grid grid-cols-2 gap-3 mb-5 p-4 rounded-3xl bg-white/[0.06] backdrop-blur-[20px] border border-white/15 shadow-xl">
        <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-xs font-bold text-emerald-400 uppercase mb-2">BẠN</span>
          <div className="text-5xl my-2">
            {p1Choice ? choices.find((c) => c.id === p1Choice)?.icon : "❓"}
          </div>
          <span className="text-xs font-medium text-white/70">
            {p1Choice ? choices.find((c) => c.id === p1Choice)?.label : "Đang chờ..."}
          </span>
        </div>

        <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-xs font-bold text-amber-400 uppercase mb-2">
            {gameMode === "npc" ? selectedNpc.name : "ĐỐI THỦ"}
          </span>
          <div className="text-5xl my-2">
            {p2Choice ? choices.find((c) => c.id === p2Choice)?.icon : "❓"}
          </div>
          <span className="text-xs font-medium text-white/70">
            {p2Choice ? choices.find((c) => c.id === p2Choice)?.label : "Đang chờ..."}
          </span>
        </div>
      </div>

      {/* Choice Buttons */}
      <div className="grid grid-cols-3 gap-3 w-full mb-5">
        {choices.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => handlePlay(c.id)}
            className="py-4 px-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 font-bold text-xs uppercase shadow-md active:scale-95 flex flex-col items-center gap-1.5 cursor-pointer transition-all"
          >
            <span className="text-3xl">{c.icon}</span>
            <span>{c.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="w-full flex items-center justify-between gap-3 bg-white/[0.08] backdrop-blur-[20px] p-3.5 rounded-2xl border border-white/15">
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="text-emerald-400 font-bold">Thắng: {scores.p1}</span>
          <span className="text-white/50">Hòa: {scores.ties}</span>
          <span className="text-amber-400 font-bold">Thua: {scores.p2Npc}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetRound}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold uppercase shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Ván Mới
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <X className="w-3.5 h-3.5" /> Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 3: WORD CHAIN (LIQUID GLASS STYLE)
   ========================================================================= */
const WordChainGame: React.FC<{
  soundEnabled: boolean;
  onScoreUpdate: (score: number) => void;
  onClose: () => void;
}> = ({ soundEnabled, onScoreUpdate, onClose }) => {
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const [selectedNpc] = useState<VplayUser>(
    () => MOCK_100_FRIENDS[Math.floor(Math.random() * MOCK_100_FRIENDS.length)]
  );
  const [history, setHistory] = useState<
    { sender: "user" | "npc"; text: string; time: string }[]
  >([
    { sender: "npc", text: "Việt Nam", time: "10:00" }
  ]);
  const [inputWord, setInputWord] = useState("");
  const [streak, setStreak] = useState(1);
  const [isGameOver] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const MOCK_VI_WORDS: Record<string, string[]> = {
    nam: ["nam tiến", "nam cực", "nam tính", "nam giới"],
    tiến: ["tiến bộ", "tiến lên", "tiến sĩ", "tiến công"],
    bộ: ["bộ đội", "bộ ba", "bộ trưởng", "bộ máy"],
    đội: ["đội ngũ", "đội hình", "đội mũ", "đội viên"],
    ngũ: ["ngũ cốc", "ngũ giác", "ngũ hành", "ngũ quan"],
    cốc: ["cốc trà", "cốc nước", "cốc sứ"],
    nước: ["nước nhà", "nước mắt", "nước ngọt", "nước biển"],
    nhà: ["nhà cửa", "nhà báo", "nhà thơ", "nhà văn"],
    cửa: ["cửa sổ", "cửa ngõ", "cửa hiệu", "cửa chính"],
    sổ: ["sổ tay", "sổ sách", "sổ hộ khẩu"]
  };

  const handleSendWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputWord.trim() || isGameOver) return;

    const word = inputWord.trim().toLowerCase();
    const lastEntry = history[history.length - 1];

    if (language === "vi") {
      const lastWords = lastEntry.text.toLowerCase().split(" ");
      const requiredStart = lastWords[lastWords.length - 1];
      const userWords = word.split(" ");

      if (userWords[0] !== requiredStart) {
        setFeedback(`Từ phải bắt đầu bằng chữ "${requiredStart.toUpperCase()}"!`);
        return;
      }
    } else {
      const requiredLetter = lastEntry.text.slice(-1).toLowerCase();
      if (!word.startsWith(requiredLetter)) {
        setFeedback(`Từ phải bắt đầu bằng chữ cái "${requiredLetter.toUpperCase()}"!`);
        return;
      }
    }

    if (soundEnabled) playPopSound();
    setHistory((prev) => [
      ...prev,
      {
        sender: "user",
        text: inputWord.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
    setInputWord("");
    setFeedback(null);
    setStreak((s) => {
      const next = s + 1;
      onScoreUpdate(next * 10);
      return next;
    });

    // NPC Reply
    setTimeout(() => {
      const userWords = word.split(" ");
      const endWord = userWords[userWords.length - 1];
      const possibleReplies =
        MOCK_VI_WORDS[endWord] || [`${endWord} học`, `${endWord} hoa`, `${endWord} mây`];
      const npcReply =
        possibleReplies[Math.floor(Math.random() * possibleReplies.length)];

      setHistory((prev) => [
        ...prev,
        {
          sender: "npc",
          text: npcReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }, 600);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      {/* Top Language Bar */}
      <div className="w-full flex items-center justify-between mb-4 p-3 rounded-2xl bg-white/[0.08] backdrop-blur-[20px] border border-white/15">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setLanguage("vi");
              setHistory([{ sender: "npc", text: "Việt Nam", time: "10:00" }]);
              setStreak(1);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all active:scale-95 ${
              language === "vi"
                ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md"
                : "bg-white/10 text-white/70 hover:text-white"
            }`}
          >
            Tiếng Việt
          </button>
          <button
            type="button"
            onClick={() => {
              setLanguage("en");
              setHistory([{ sender: "npc", text: "Apple", time: "10:00" }]);
              setStreak(1);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all active:scale-95 ${
              language === "en"
                ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md"
                : "bg-white/10 text-white/70 hover:text-white"
            }`}
          >
            English
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30">
            Chuỗi: {streak} 🔥
          </span>
        </div>
      </div>

      {/* Chat / Chain History List */}
      <div className="w-full h-56 rounded-3xl bg-white/[0.06] backdrop-blur-[20px] border border-white/15 p-4 overflow-y-auto space-y-3 mb-4 font-sans text-xs shadow-inner">
        {history.map((item, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${item.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[11px] text-white/50 font-medium">
                {item.sender === "user" ? "Bạn" : selectedNpc.name}
              </span>
            </div>
            <div
              className={`px-4 py-2.5 rounded-2xl max-w-[80%] font-semibold text-sm shadow-md ${
                item.sender === "user"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-tr-none"
                  : "bg-white/15 text-amber-200 rounded-tl-none border border-white/10"
              }`}
            >
              {item.text}
            </div>
          </div>
        ))}
      </div>

      {feedback && (
        <div className="w-full mb-3 p-2.5 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs text-center font-medium">
          {feedback}
        </div>
      )}

      {/* Input Word Form */}
      <form onSubmit={handleSendWord} className="w-full flex items-center gap-2 mb-3">
        <input
          type="text"
          placeholder={
            language === "vi"
              ? `Nối từ tiếp theo (Bắt đầu bằng "${
                  history[history.length - 1]?.text.split(" ").slice(-1)[0]
                }")...`
              : `Type next word (starts with "${history[
                  history.length - 1
                ]?.text.slice(-1)}")...`
          }
          value={inputWord}
          onChange={(e) => setInputWord(e.target.value)}
          className="flex-1 bg-white/10 border border-white/15 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-white/50 focus:outline-none focus:border-amber-400 backdrop-blur-md"
        />
        <button
          type="submit"
          disabled={!inputWord.trim()}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 disabled:opacity-50 text-white font-bold text-xs uppercase shadow-md flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
        >
          <Send className="w-4 h-4" /> Gửi
        </button>
      </form>

      {/* Bottom Close Bar */}
      <div className="w-full flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
        >
          <X className="w-4 h-4" /> Đóng Game
        </button>
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 4: COUNTING GAME 1 -> N (LIQUID GLASS STYLE)
   ========================================================================= */
const CountingGame: React.FC<{
  soundEnabled: boolean;
  onScoreUpdate: (score: number) => void;
  onClose: () => void;
}> = ({ soundEnabled, onScoreUpdate, onClose }) => {
  const [currentCount, setCurrentCount] = useState(0);
  const [highestChain, setHighestChain] = useState(0);
  const [lastCounter, setLastCounter] = useState<string>("Bắt đầu");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleCount = () => {
    if (soundEnabled) playPopSound();
    const nextCount = currentCount + 1;
    setCurrentCount(nextCount);
    setLastCounter("Bạn");
    setFeedback(`Bạn đã đếm số: ${nextCount}!`);

    if (nextCount > highestChain) {
      setHighestChain(nextCount);
      onScoreUpdate(nextCount * 5);
    }

    setTimeout(() => {
      const npcNext = nextCount + 1;
      setCurrentCount(npcNext);
      setLastCounter("NPC Vplay");
      setFeedback(`NPC Vplay vừa đếm tiếp số: ${npcNext}!`);
      if (npcNext > highestChain) {
        setHighestChain(npcNext);
      }
    }, 650);
  };

  const handleReset = () => {
    setCurrentCount(0);
    setLastCounter("Đã reset");
    setFeedback("Chuỗi đã bị reset về 0!");
    if (soundEnabled) playPopSound();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      {/* Big Counter Display (Liquid Glass) */}
      <div className="w-full mb-5 p-7 rounded-3xl bg-white/[0.06] backdrop-blur-[20px] border border-white/15 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        <span className="text-xs font-semibold text-white/60 uppercase mb-1">
          SỐ HIỆN TẠI ĐANG ĐẾM
        </span>
        <div className="text-7xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400 my-2 tracking-wider drop-shadow-md">
          {currentCount}
        </div>
        <div className="flex items-center gap-2 text-xs text-white/70 mt-2">
          <span>Người đếm gần nhất:</span>
          <span className="font-bold bg-white/10 px-2.5 py-0.5 rounded-full text-amber-300 border border-white/15">
            {lastCounter}
          </span>
        </div>
      </div>

      {feedback && (
        <div className="w-full mb-4 p-3 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/15 text-xs text-white/80 text-center font-medium">
          {feedback}
        </div>
      )}

      {/* Main Count Button */}
      <div className="w-full flex flex-col gap-3 mb-5">
        <button
          type="button"
          onClick={handleCount}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-black text-base uppercase tracking-wider shadow-lg shadow-amber-500/25 active:scale-95 flex items-center justify-center gap-3 cursor-pointer transition-all"
        >
          <Sparkles className="w-5 h-5 fill-current" /> ĐẾM TIẾP SỐ {currentCount + 1}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white/80 border border-white/15 font-bold text-xs uppercase tracking-wider active:scale-95 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Phá Chuỗi & Reset Về 0
        </button>
      </div>

      {/* Bottom Close Bar */}
      <div className="w-full flex items-center justify-between gap-3 bg-white/[0.08] backdrop-blur-[20px] p-3.5 rounded-2xl border border-white/15">
        <span className="text-xs font-bold text-amber-400">
          Kỷ Lục Chuỗi: {highestChain}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-semibold uppercase flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
        >
          <X className="w-4 h-4" /> Đóng Game
        </button>
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 5: RETRO SNAKE (LIQUID GLASS STYLE)
   ========================================================================= */
const SnakeGame: React.FC<{
  soundEnabled: boolean;
  onScoreUpdate: (score: number) => void;
  onClose: () => void;
}> = ({ soundEnabled, onScoreUpdate, onClose }) => {
  const GRID_SIZE = 15;
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 7, y: 7 },
    { x: 7, y: 8 }
  ]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 3, y: 3 });
  const [dir, setDir] = useState<"UP" | "DOWN" | "LEFT" | "RIGHT">("UP");
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const resetGame = () => {
    setSnake([
      { x: 7, y: 7 },
      { x: 7, y: 8 }
    ]);
    setFood({ x: 4, y: 4 });
    setDir("UP");
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    if (soundEnabled) playPopSound();
  };

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        if (dir === "UP") head.y -= 1;
        if (dir === "DOWN") head.y += 1;
        if (dir === "LEFT") head.x -= 1;
        if (dir === "RIGHT") head.x += 1;

        // Collision Wall
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Collision Body
        if (prevSnake.some((seg) => seg.x === head.x && seg.y === head.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Eat Food
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => {
            const nextScore = s + 10;
            onScoreUpdate(nextScore);
            return nextScore;
          });
          if (soundEnabled) playPopSound();
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, dir, food, soundEnabled]);

  return (
    <div className="flex flex-col items-center w-full max-w-md select-none">
      {/* Snake Canvas Grid (Liquid Glass) */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/20 shadow-2xl grid grid-cols-15 grid-rows-15 p-1 mb-4 overflow-hidden">
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
          const x = idx % GRID_SIZE;
          const y = Math.floor(idx / GRID_SIZE);
          const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
          const isSnakeBody = snake.slice(1).some((seg) => seg.x === x && seg.y === y);
          const isFoodCell = food.x === x && food.y === y;

          return (
            <div
              key={idx}
              className={`w-full h-full rounded-[3px] ${
                isSnakeHead
                  ? "bg-amber-400 shadow-sm shadow-amber-400"
                  : isSnakeBody
                  ? "bg-emerald-400 shadow-sm shadow-emerald-400"
                  : isFoodCell
                  ? "bg-rose-500 animate-pulse shadow-sm shadow-rose-500"
                  : "bg-transparent"
              }`}
            />
          );
        })}

        {/* Overlay when game over / not started */}
        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <span className="text-base sm:text-lg font-bold text-white uppercase mb-2">
              {isGameOver ? "💀 GAME OVER!" : "RẮN SĂN MỒI"}
            </span>
            <span className="text-xs font-mono text-emerald-400 mb-4">
              Điểm số: {score} điểm
            </span>
            <button
              type="button"
              onClick={resetGame}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold text-xs uppercase shadow-md flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" /> {isGameOver ? "Chơi Lại" : "Bắt Đầu"}
            </button>
          </div>
        )}
      </div>

      {/* D-Pad Arrow Controls */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setDir("UP")}
          className="w-16 h-11 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center cursor-pointer active:scale-95 transition-all"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDir("LEFT")}
            className="w-16 h-11 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center cursor-pointer active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setDir("DOWN")}
            className="w-16 h-11 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center cursor-pointer active:scale-95 transition-all"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setDir("RIGHT")}
            className="w-16 h-11 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center cursor-pointer active:scale-95 transition-all"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Exit Bar */}
      <div className="w-full flex items-center justify-between gap-3 bg-white/[0.08] backdrop-blur-[20px] p-3.5 rounded-2xl border border-white/15">
        <span className="text-xs font-bold text-amber-400">
          Điểm Hiện Tại: {score}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
        >
          <X className="w-4 h-4" /> Đóng Game
        </button>
      </div>
    </div>
  );
};
