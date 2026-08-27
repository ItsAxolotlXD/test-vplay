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
  User,
  Shuffle,
  HelpCircle,
  Timer,
  Send,
  AlertTriangle,
  X,
  Sparkles,
  Award,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Flame,
  Check
} from "lucide-react";
import { playPopSound } from "../../utils/sound";
import { MOCK_100_FRIENDS, VplayUser } from "../../data/mockFriendsData";

/* =========================================================================
   ORE UI V-ARCADE TYPES & STYLES (STRICTLY 5 GAMES)
   ========================================================================= */

interface GameItem {
  id: string;
  title: string;
  category: "classic" | "puzzle";
  categoryLabel: string;
  description: string;
  rating: number;
  plays: string;
  color: string;
  badge: string;
  difficulty: "Dễ" | "Trung bình" | "Khó";
}

export const ARCADE_5_GAMES: GameItem[] = [
  {
    id: "tic_tac_toe",
    title: "Cờ Caro XO (Tic-Tac-Toe)",
    category: "classic",
    categoryLabel: "Cổ Điển",
    description: "Đánh X/O đấu trí đỉnh cao cùng NPC ngẫu nhiên hoặc 2 người chơi pass & play.",
    rating: 4.95,
    plays: "280K",
    color: "from-purple-600 to-indigo-800",
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
    color: "from-rose-600 to-amber-700",
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
    color: "from-emerald-600 to-teal-800",
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
    color: "from-blue-600 to-cyan-800",
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
    color: "from-emerald-600 to-green-800",
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
    "tic_tac_toe",
    "rock_paper_scissors",
    "word_chain",
    "counting_game",
    "snake"
  ]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [highScores, setHighScores] = useState<Record<string, number>>({
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

  if (activeGame) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 text-white font-sans bg-[#232528] border-4 border-[#141414] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_2px_2px_0_#383b40,inset_-2px_-2px_0_#101112] my-2 select-none animate-fade-in">
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 p-3.5 sm:p-4 bg-[#1a1c1e] border-3 border-[#141414] shadow-[inset_2px_2px_0_#383b40,inset_-2px_-2px_0_#101112]">
          <button
            onClick={() => {
              setActiveGame(null);
              playPopSound();
            }}
            className="px-4 py-2.5 bg-[#2a2c30] hover:bg-[#383a3f] text-zinc-200 hover:text-white border-2 border-[#141414] shadow-[inset_2px_2px_0_#3f434a,inset_-2px_-2px_0_#18191b] active:translate-y-[1px] text-xs sm:text-sm font-jura font-bold uppercase transition-none cursor-pointer min-h-[46px] flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Quay Lại Danh Sách Games</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playPopSound();
              }}
              className="px-4 py-2.5 bg-[#313438] hover:bg-[#3d4147] text-white border-2 border-[#141414] font-jura font-bold text-xs uppercase shadow-[inset_2px_2px_0_#484c52,inset_-2px_-2px_0_#1a1b1d] active:translate-y-[1px] flex items-center gap-2 cursor-pointer min-h-[46px]"
              title="Bật/Tắt âm thanh"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#89dc69]" /> : <VolumeX className="w-4 h-4 text-[#fc8181]" />}
              <span className="hidden sm:inline">{soundEnabled ? "Âm Thanh Bật" : "Âm Thanh Tắt"}</span>
            </button>

            <button
              onClick={() => {
                setActiveGame(null);
                playPopSound();
              }}
              className="px-4 py-2.5 bg-[#c53030] hover:bg-[#e53e3e] border-2 border-[#141414] shadow-[inset_2px_2px_0_#fc8181,inset_-2px_-2px_0_#9b2c2c] active:translate-y-[1px] text-white text-xs sm:text-sm font-jura font-bold uppercase transition-none cursor-pointer min-h-[46px] flex items-center gap-2"
              title="Thoát Game về Lobby"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
              <span>Đóng Game (X)</span>
            </button>
          </div>
        </div>

        {/* Quick Switch Game Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none">
          {ARCADE_5_GAMES.map((g) => {
            const isCur = g.id === activeGame.id;
            return (
              <button
                key={g.id}
                onClick={() => {
                  setActiveGame(g);
                  playPopSound();
                }}
                className={`px-3 py-1.5 rounded-sm border-2 text-xs font-bold font-jura flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  isCur
                    ? "bg-[#28960b] border-[#141414] text-white shadow-[inset_1.5px_1.5px_0_#89dc69,inset_-1.5px_-1.5px_0_#1b5e20]"
                    : "bg-[#27292d] border-[#141414] text-white/70 hover:text-white shadow-[inset_1.5px_1.5px_0_#383b40,inset_-1.5px_-1.5px_0_#101112]"
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>{g.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Game Title Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-[#1e2023] border-3 border-[#141414] shadow-[inset_2px_2px_0_#383b40,inset_-2px_-2px_0_#101112] mb-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-[#28960b] border-2 border-[#141414] shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] text-white">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black font-jura text-[#89dc69] uppercase tracking-wider">
                {activeGame.title}
              </h2>
              <p className="text-xs font-mono text-zinc-400">
                {activeGame.categoryLabel} • Độ khó: {activeGame.difficulty} • Kỷ lục của bạn: <span className="text-amber-400 font-bold">{highScores[activeGame.id] || 0} pts</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => toggleFavorite(activeGame.id, e)}
              className="px-3.5 py-2 bg-[#18191b] border-2 border-[#141414] text-zinc-400 hover:text-amber-400 text-xs font-mono flex items-center gap-1.5 cursor-pointer min-h-[40px]"
            >
              <Star className={`w-4 h-4 ${favoriteGames.includes(activeGame.id) ? "fill-amber-400 text-amber-400" : ""}`} />
              <span>{favoriteGames.includes(activeGame.id) ? "Đã Lưu" : "Yêu Thích"}</span>
            </button>
          </div>
        </div>

        {/* The Game Arena Container */}
        <div className="w-full bg-[#18191b] border-3 border-[#141414] p-4 sm:p-6 min-h-[420px] flex flex-col items-center justify-center relative shadow-[inset_2px_2px_0_#0f1011,inset_-2px_-2px_0_#282a2d] mb-4">
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
        <div className="p-4 bg-[#1c1e20] border-2 border-[#141414] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-300 font-sans shadow-md">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4.5 h-4.5 text-[#89dc69] shrink-0" />
            <span>{activeGame.description}</span>
          </div>
          <button
            onClick={() => {
              setActiveGame(null);
              playPopSound();
            }}
            className="px-4 py-2 bg-[#2a2c30] hover:bg-[#383a3f] text-zinc-300 hover:text-white border border-[#141414] font-jura font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer min-h-[38px] shrink-0"
          >
            <ArrowLeft className="w-4 h-4" /> Quay Lại Kho Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 text-white font-sans bg-[#232528] border-4 border-[#141414] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_2px_2px_0_#383b40,inset_-2px_-2px_0_#101112] my-2 select-none">
      {/* Top Banner Header Ore UI Style */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 p-5 sm:p-6 bg-[#1a1c1e] border-3 border-[#141414] shadow-[inset_2px_2px_0_#383b40,inset_-2px_-2px_0_#101112]">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#28960b] border-2 border-[#141414] shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] text-white">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black font-jura tracking-wider text-white uppercase">
                V-ARCADE GAMING ZONE
              </h1>
              <span className="text-xs px-3 py-1 bg-[#f59e0b] text-[#141414] border-2 border-[#141414] font-bold font-mono uppercase tracking-wider shadow-[inset_1px_1px_0_#fde68a,inset_-1px_-1px_0_#b45309]">
                Ore UI • 5 Trò Chơi
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 font-sans mt-1.5 max-w-2xl leading-relaxed">
              Trải nghiệm 5 tựa game cổ điển & trí tuệ giao diện Ore UI pixel chuẩn nét: Caro XO, Oẳn Tù Tì, Nối Từ, Đếm Số & Rắn Săn Mồi!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playPopSound();
            }}
            className="px-5 py-3 bg-[#313438] hover:bg-[#3d4147] text-white border-2 border-[#141414] font-jura font-bold text-xs uppercase shadow-[inset_2px_2px_0_#484c52,inset_-2px_-2px_0_#1a1b1d] active:translate-y-[1px] flex items-center gap-2.5 cursor-pointer min-h-[48px]"
            title="Bật/Tắt âm thanh"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-[#89dc69]" /> : <VolumeX className="w-5 h-5 text-[#fc8181]" />}
            <span>{soundEnabled ? "ÂM THANH BẬT" : "ÂM THANH TẮT"}</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#2f3135] border-2 border-[#141414] p-3.5 shadow-md">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm 5 trò chơi V-Arcade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#18191b] border-2 border-[#141414] pl-10 pr-3.5 py-2.5 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#28960b] min-h-[44px]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 shrink-0">
            <span className="text-[#89dc69] font-bold text-sm">{filteredGames.length}</span> / 5 trò chơi Ore UI
          </div>
        </div>

        {/* Categories Bar with Taller Buttons */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "all", label: "Tất Cả 5 Trò Chơi" },
            { id: "favorites", label: `Yêu Thích (${favoriteGames.length})` },
            { id: "classic", label: "Cổ Điển" },
            { id: "puzzle", label: "Đố Vui & Trí Tuệ" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                playPopSound();
              }}
              className={`px-5 py-3 text-xs sm:text-sm font-bold font-jura uppercase tracking-wider whitespace-nowrap border-2 border-[#141414] flex items-center gap-2.5 cursor-pointer active:translate-y-[1px] min-h-[48px] transition-none ${
                selectedCategory === cat.id
                  ? "bg-[#28960b] text-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]"
                  : "bg-[#2a2c30] hover:bg-[#383a3f] text-zinc-300 shadow-[inset_1px_1px_0_#3f434a,inset_-1px_-1px_0_#18191b]"
              }`}
            >
              {cat.id === "favorites" && <Star className="w-4 h-4 fill-amber-400 text-amber-400" />}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Exactly 5 Games */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {filteredGames.map((game) => {
          const isFav = favoriteGames.includes(game.id);

          return (
            <div
              key={game.id}
              onClick={() => {
                setActiveGame(game);
                playPopSound();
              }}
              className="group bg-[#2a2c30] hover:bg-[#31343a] border-3 border-[#141414] p-5 flex flex-col justify-between shadow-[inset_2px_2px_0_#3f434a,inset_-2px_-2px_0_#18191b] transition-none cursor-pointer"
            >
              {/* Top Card Banner */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="p-3 bg-[#18191b] border-2 border-[#141414] text-[#89dc69] shadow-[inset_1px_1px_0_#28960b,inset_-1px_-1px_0_#000]">
                  <Gamepad2 className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 bg-[#f59e0b] text-[#141414] border border-[#141414] uppercase shadow-sm">
                    {game.badge}
                  </span>
                  <button
                    onClick={(e) => toggleFavorite(game.id, e)}
                    className="p-2 hover:bg-white/10 border border-[#141414] bg-[#18191b] text-zinc-400 hover:text-amber-400 min-h-[36px] min-w-[36px] flex items-center justify-center"
                    title="Yêu thích"
                  >
                    <Star className={`w-4.5 h-4.5 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Title & Info */}
              <div className="mb-4">
                <h3 className="text-lg font-bold font-jura text-white group-hover:text-[#89dc69] line-clamp-1 mb-2 transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs font-sans text-zinc-300 line-clamp-2 leading-relaxed">
                  {game.description}
                </p>
              </div>

              {/* Card Footer Info with Taller Play Button */}
              <div className="space-y-3.5 pt-3.5 border-t-2 border-[#141414]">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {game.rating}
                  </span>
                  <span className="text-[#89dc69] font-bold uppercase">{game.difficulty}</span>
                </div>

                <button className="w-full py-3.5 bg-[#28960b] hover:bg-[#32b312] text-white font-jura font-bold text-xs sm:text-sm uppercase tracking-wider border-2 border-[#141414] shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] active:translate-y-[1px] cursor-pointer flex items-center justify-center gap-2.5 transition-none min-h-[48px]">
                  <Play className="w-4.5 h-4.5 fill-current" /> CHƠI NGAY
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
   OPPONENT BAR COMPONENT (ORE UI STYLE WITH TALLER BUTTONS)
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
    const randomNpc = MOCK_100_FRIENDS[Math.floor(Math.random() * MOCK_100_FRIENDS.length)];
    setSelectedNpc(randomNpc);
    playPopSound();
  };

  return (
    <div className="w-full mb-4 p-4 bg-[#1c1e20] border-2 border-[#141414] flex flex-col gap-3 shadow-[inset_1px_1px_0_#2a2c30,inset_-1px_-1px_0_#101112]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Mode Buttons - Ore UI Taller */}
        <div className="flex items-center gap-2 bg-[#141414] p-1.5 border border-[#2a2c30]">
          <button
            type="button"
            onClick={() => {
              setGameMode("npc");
              playPopSound();
            }}
            className={`px-4 py-2.5 text-xs sm:text-sm font-jura font-bold uppercase border-2 border-[#141414] transition-none flex items-center gap-2 cursor-pointer min-h-[46px] ${
              gameMode === "npc"
                ? "bg-[#28960b] text-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]"
                : "bg-[#2a2c30] text-zinc-400 hover:text-white"
            }`}
          >
            <Bot className="w-4.5 h-4.5" /> Chơi Với NPC
          </button>
          <button
            type="button"
            onClick={() => {
              setGameMode("pvp");
              playPopSound();
            }}
            className={`px-4 py-2.5 text-xs sm:text-sm font-jura font-bold uppercase border-2 border-[#141414] transition-none flex items-center gap-2 cursor-pointer min-h-[46px] ${
              gameMode === "pvp"
                ? "bg-[#f59e0b] text-[#141414] shadow-[inset_2px_2px_0_#fde68a,inset_-2px_-2px_0_#b45309]"
                : "bg-[#2a2c30] text-zinc-400 hover:text-white"
            }`}
          >
            <Users className="w-4.5 h-4.5" /> 2 Người Chơi
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
              className="px-3.5 py-2.5 bg-[#2a2c30] hover:bg-[#34373d] text-white border-2 border-[#141414] text-xs font-mono flex items-center gap-2 cursor-pointer min-h-[46px] shadow-[inset_1px_1px_0_#3f434a,inset_-1px_-1px_0_#18191b]"
            >
              <img
                src={selectedNpc.avatar}
                alt={selectedNpc.name}
                className="w-6 h-6 border border-[#141414] object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <span className="font-bold text-[#89dc69] truncate max-w-[120px]">{selectedNpc.name}</span>
            </button>

            <button
              type="button"
              onClick={handleRandomize}
              className="p-2.5 bg-[#313438] hover:bg-[#3d4147] text-amber-400 border-2 border-[#141414] cursor-pointer min-h-[46px] min-w-[46px] flex items-center justify-center shadow-[inset_1px_1px_0_#484c52,inset_-1px_-1px_0_#1a1b1d]"
              title="Đổi đối thủ NPC ngẫu nhiên"
            >
              <Shuffle className="w-4.5 h-4.5" />
            </button>
          </div>
        )}
      </div>

      {/* NPC Picker Drawer Dropdown */}
      {showNpcPicker && gameMode === "npc" && (
        <div className="mt-2 p-3 bg-[#141414] border-2 border-[#28960b] shadow-xl space-y-3 animate-fade-in">
          <div className="flex items-center justify-between gap-2 border-b border-[#2a2c30] pb-2">
            <span className="text-xs font-jura font-bold text-[#89dc69] uppercase">
              Chọn NPC Đối Thủ (Search for People)
            </span>
            <button
              type="button"
              onClick={() => setShowNpcPicker(false)}
              className="text-zinc-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Tìm kiếm NPC theo tên..."
            value={pickerSearch}
            onChange={(e) => setPickerSearch(e.target.value)}
            className="w-full bg-[#1e2023] border border-[#2a2c30] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#28960b]"
          />

          <div className="max-h-48 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 pr-1">
            {filteredNpcs.slice(0, 18).map((npc) => (
              <button
                key={npc.id}
                type="button"
                onClick={() => {
                  setSelectedNpc(npc);
                  setShowNpcPicker(false);
                  playPopSound();
                }}
                className={`p-2 border text-left flex items-center gap-2 cursor-pointer transition-none ${
                  selectedNpc.id === npc.id
                    ? "bg-[#28960b]/30 border-[#89dc69] text-white"
                    : "bg-[#1e2023] border-[#141414] text-zinc-300 hover:bg-[#2a2c30]"
                }`}
              >
                <img src={npc.avatar} alt={npc.name} className="w-6 h-6 border border-[#141414] object-cover shrink-0" />
                <span className="text-xs font-mono truncate">{npc.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   GAME 1: TIC TAC TOE (ORE UI DESIGN STYLE & TALL BUTTONS)
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
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
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
          <div className="text-sm font-bold font-jura text-amber-400 bg-amber-400/10 border-2 border-[#141414] px-4 py-2.5 shadow-[inset_1px_1px_0_#fde68a,inset_-1px_-1px_0_#b45309]">
            {winner === "Tie"
              ? "🤝 Trận đấu Hòa nhau!"
              : winner === "X"
              ? "🎉 Bạn (X) Thắng Cuộc!"
              : gameMode === "npc"
              ? `🤖 ${selectedNpc.name} (O) Thắng!`
              : "🎉 Người chơi 2 (O) Thắng!"}
          </div>
        ) : (
          <div className="text-xs sm:text-sm font-bold font-jura text-zinc-300 flex items-center justify-center gap-2">
            <span>LƯỢT ĐÁNH:</span>
            <span
              className={`px-3.5 py-1.5 border-2 border-[#141414] font-mono font-bold ${
                turn === "X"
                  ? "bg-[#28960b] text-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]"
                  : "bg-[#f59e0b] text-[#141414] shadow-[inset_2px_2px_0_#fde68a,inset_-2px_-2px_0_#b45309]"
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

      {/* Grid Board Ore UI */}
      <div className="grid grid-cols-3 gap-2.5 p-3 bg-[#141414] border-3 border-[#141414] shadow-[inset_2px_2px_0_#0f1011,inset_-2px_-2px_0_#282a2d] mb-4">
        {board.map((cell, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleCellClick(idx)}
            disabled={cell !== null || winner !== null || (gameMode === "npc" && turn === "O")}
            className={`w-20 h-20 sm:w-24 sm:h-24 border-2 border-[#141414] font-black text-2xl sm:text-3xl font-jura flex items-center justify-center cursor-pointer transition-none ${
              cell === "X"
                ? "bg-[#28960b] text-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]"
                : cell === "O"
                ? "bg-[#f59e0b] text-[#141414] shadow-[inset_2px_2px_0_#fde68a,inset_-2px_-2px_0_#b45309]"
                : "bg-[#2a2c30] hover:bg-[#383b42] text-transparent shadow-[inset_2px_2px_0_#3f434a,inset_-2px_-2px_0_#18191b]"
            }`}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* Scores & Controls Bar with Taller Buttons */}
      <div className="w-full flex items-center justify-between gap-3 bg-[#1c1e20] p-3 border-2 border-[#141414]">
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#89dc69] font-bold">X: {scores.p1}</span>
          <span className="text-zinc-400">Hòa: {scores.ties}</span>
          <span className="text-[#f59e0b] font-bold">O: {scores.p2Npc}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetGame}
            className="px-4 py-2.5 bg-[#28960b] hover:bg-[#32b312] text-white border-2 border-[#141414] text-xs font-jura font-bold uppercase shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] flex items-center gap-2 cursor-pointer min-h-[46px]"
          >
            <RotateCcw className="w-4 h-4" /> Ván Mới
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2.5 bg-[#c53030] hover:bg-[#e53e3e] text-white border-2 border-[#141414] text-xs font-jura font-bold uppercase shadow-[inset_2px_2px_0_#fc8181,inset_-2px_-2px_0_#9b2c2c] flex items-center gap-1.5 cursor-pointer min-h-[46px]"
            title="Đóng game"
          >
            <X className="w-4 h-4" /> Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 2: ROCK PAPER SCISSORS (ORE UI DESIGN STYLE & TALL BUTTONS)
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

      {/* Result Display Ore UI */}
      <div className="w-full mb-5 text-center">
        {result ? (
          <div className="text-sm font-bold font-jura text-amber-400 bg-amber-400/10 border-2 border-[#141414] px-4 py-3 shadow-[inset_1px_1px_0_#fde68a,inset_-1px_-1px_0_#b45309]">
            {result}
          </div>
        ) : (
          <div className="text-xs sm:text-sm font-bold font-jura text-zinc-300">
            HÃY CHỌN NƯỚC ĐI CỦA BẠN:
          </div>
        )}
      </div>

      {/* Choices Battle Arena */}
      <div className="w-full grid grid-cols-2 gap-3 mb-5 p-4 bg-[#141414] border-2 border-[#141414]">
        <div className="flex flex-col items-center p-3 bg-[#1e2023] border border-[#2a2c30]">
          <span className="text-xs font-jura font-bold text-[#89dc69] uppercase mb-2">BẠN</span>
          <div className="text-4xl my-2">
            {p1Choice ? choices.find((c) => c.id === p1Choice)?.icon : "❓"}
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            {p1Choice ? choices.find((c) => c.id === p1Choice)?.label : "Đang chờ..."}
          </span>
        </div>

        <div className="flex flex-col items-center p-3 bg-[#1e2023] border border-[#2a2c30]">
          <span className="text-xs font-jura font-bold text-[#f59e0b] uppercase mb-2">
            {gameMode === "npc" ? selectedNpc.name : "ĐỐI THỦ"}
          </span>
          <div className="text-4xl my-2">
            {p2Choice ? choices.find((c) => c.id === p2Choice)?.icon : "❓"}
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            {p2Choice ? choices.find((c) => c.id === p2Choice)?.label : "Đang chờ..."}
          </span>
        </div>
      </div>

      {/* Choice Buttons - Taller Ore UI Buttons */}
      <div className="grid grid-cols-3 gap-3 w-full mb-5">
        {choices.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => handlePlay(c.id)}
            className="py-4 px-2 bg-[#28960b] hover:bg-[#32b312] text-white border-2 border-[#141414] font-jura font-bold text-xs uppercase shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] active:translate-y-[1px] flex flex-col items-center gap-1.5 cursor-pointer min-h-[58px]"
          >
            <span className="text-2xl">{c.icon}</span>
            <span>{c.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="w-full flex items-center justify-between gap-3 bg-[#1c1e20] p-3 border-2 border-[#141414]">
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#89dc69] font-bold">Thắng: {scores.p1}</span>
          <span className="text-zinc-400">Hòa: {scores.ties}</span>
          <span className="text-[#f59e0b] font-bold">Thua: {scores.p2Npc}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetRound}
            className="px-4 py-2.5 bg-[#313438] hover:bg-[#3d4147] text-white border-2 border-[#141414] text-xs font-jura font-bold uppercase shadow-[inset_1px_1px_0_#484c52,inset_-1px_-1px_0_#1a1b1d] flex items-center gap-1.5 cursor-pointer min-h-[46px]"
          >
            <RotateCcw className="w-4 h-4" /> Ván Mới
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2.5 bg-[#c53030] hover:bg-[#e53e3e] text-white border-2 border-[#141414] text-xs font-jura font-bold uppercase shadow-[inset_2px_2px_0_#fc8181,inset_-2px_-2px_0_#9b2c2c] flex items-center gap-1.5 cursor-pointer min-h-[46px]"
          >
            <X className="w-4 h-4" /> Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 3: WORD CHAIN (NỐI TỪ TIẾNG VIỆT & TIẾNG ANH - ORE UI STYLE)
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
  const [isGameOver, setIsGameOver] = useState(false);
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
      { sender: "user", text: inputWord.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
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
      const possibleReplies = MOCK_VI_WORDS[endWord] || [`${endWord} học`, `${endWord} hoa`, `${endWord} mây`];
      const npcReply = possibleReplies[Math.floor(Math.random() * possibleReplies.length)];

      setHistory((prev) => [
        ...prev,
        { sender: "npc", text: npcReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 600);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      {/* Top Language Bar */}
      <div className="w-full flex items-center justify-between mb-4 p-3 bg-[#1c1e20] border-2 border-[#141414]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setLanguage("vi");
              setHistory([{ sender: "npc", text: "Việt Nam", time: "10:00" }]);
              setStreak(1);
            }}
            className={`px-3 py-2 text-xs font-jura font-bold uppercase border border-[#141414] min-h-[42px] ${
              language === "vi" ? "bg-[#28960b] text-white" : "bg-[#2a2c30] text-zinc-400"
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
            className={`px-3 py-2 text-xs font-jura font-bold uppercase border border-[#141414] min-h-[42px] ${
              language === "en" ? "bg-[#28960b] text-white" : "bg-[#2a2c30] text-zinc-400"
            }`}
          >
            English
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-amber-400 font-bold bg-[#141414] px-3 py-1.5 border border-[#2a2c30]">
            Chuỗi: {streak} 🔥
          </span>
        </div>
      </div>

      {/* Chat / Chain History List */}
      <div className="w-full h-56 bg-[#141414] border-2 border-[#141414] p-3 overflow-y-auto space-y-2 mb-4 font-mono text-xs shadow-inner">
        {history.map((item, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${item.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] text-zinc-500 font-sans">
                {item.sender === "user" ? "Bạn" : selectedNpc.name}
              </span>
            </div>
            <div
              className={`px-3.5 py-2 border-2 border-[#141414] max-w-[80%] font-bold text-sm ${
                item.sender === "user"
                  ? "bg-[#28960b] text-white shadow-[inset_1px_1px_0_#89dc69,inset_-1px_-1px_0_#1b5e20]"
                  : "bg-[#2a2c30] text-amber-300 shadow-[inset_1px_1px_0_#3f434a,inset_-1px_-1px_0_#18191b]"
              }`}
            >
              {item.text}
            </div>
          </div>
        ))}
      </div>

      {feedback && (
        <div className="w-full mb-3 p-2 bg-rose-950/80 border border-rose-600 text-rose-300 text-xs font-mono text-center">
          {feedback}
        </div>
      )}

      {/* Input Word Form with Taller Height */}
      <form onSubmit={handleSendWord} className="w-full flex items-center gap-2 mb-3">
        <input
          type="text"
          placeholder={
            language === "vi"
              ? `Nối từ tiếp theo (Bắt đầu bằng "${history[history.length - 1]?.text.split(" ").slice(-1)[0]}")...`
              : `Type next word (starts with "${history[history.length - 1]?.text.slice(-1)}")...`
          }
          value={inputWord}
          onChange={(e) => setInputWord(e.target.value)}
          className="flex-1 bg-[#141414] border-2 border-[#141414] px-4 py-3 text-xs sm:text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#28960b] min-h-[48px]"
        />
        <button
          type="submit"
          disabled={!inputWord.trim()}
          className="px-5 py-3 bg-[#28960b] hover:bg-[#32b312] disabled:bg-[#313438] text-white border-2 border-[#141414] font-jura font-bold text-xs uppercase shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] active:translate-y-[1px] flex items-center gap-2 cursor-pointer min-h-[48px]"
        >
          <Send className="w-4 h-4" /> Gửi
        </button>
      </form>

      {/* Bottom Close Bar */}
      <div className="w-full flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-[#c53030] hover:bg-[#e53e3e] text-white border-2 border-[#141414] text-xs font-jura font-bold uppercase shadow-[inset_2px_2px_0_#fc8181,inset_-2px_-2px_0_#9b2c2c] flex items-center gap-1.5 cursor-pointer min-h-[42px]"
        >
          <X className="w-4 h-4" /> Đóng Game
        </button>
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 4: COUNTING GAME 1 -> N (ORE UI DESIGN STYLE & TALL BUTTONS)
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

    // NPC automatically counts after short delay
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
      {/* Big Counter Display Ore UI */}
      <div className="w-full mb-5 p-6 bg-[#141414] border-3 border-[#141414] shadow-[inset_2px_2px_0_#0f1011,inset_-2px_-2px_0_#282a2d] flex flex-col items-center justify-center">
        <span className="text-xs font-jura font-bold text-zinc-400 uppercase mb-1">
          SỐ HIỆN TẠI ĐANG ĐẾM
        </span>
        <div className="text-6xl sm:text-7xl font-black font-mono text-[#89dc69] my-2 tracking-wider">
          {currentCount}
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-300 mt-2">
          <span>Người đếm gần nhất:</span>
          <span className="font-bold bg-[#28960b]/20 px-2 py-0.5 border border-[#28960b]/50 text-white">
            {lastCounter}
          </span>
        </div>
      </div>

      {feedback && (
        <div className="w-full mb-4 p-2.5 bg-[#1c1e20] border-2 border-[#141414] text-xs font-mono text-zinc-300 text-center">
          {feedback}
        </div>
      )}

      {/* Main Count Button with Generous Height */}
      <div className="w-full flex flex-col gap-3 mb-5">
        <button
          type="button"
          onClick={handleCount}
          className="w-full py-4 bg-[#28960b] hover:bg-[#32b312] text-white border-3 border-[#141414] font-jura font-black text-base sm:text-lg uppercase tracking-wider shadow-[inset_3px_3px_0_#89dc69,inset_-3px_-3px_0_#1b5e20] active:translate-y-[1px] flex items-center justify-center gap-3 cursor-pointer min-h-[60px]"
        >
          <Sparkles className="w-6 h-6 fill-current" /> ĐẾM TIẾP SỐ {currentCount + 1}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="w-full py-3 bg-[#c53030] hover:bg-[#e53e3e] text-white border-2 border-[#141414] font-jura font-bold text-xs uppercase tracking-wider shadow-[inset_2px_2px_0_#fc8181,inset_-2px_-2px_0_#9b2c2c] active:translate-y-[1px] flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
        >
          <RotateCcw className="w-4 h-4" /> Phá Chuỗi & Reset Về 0
        </button>
      </div>

      {/* Bottom Close Bar */}
      <div className="w-full flex items-center justify-between gap-3 bg-[#1c1e20] p-3 border-2 border-[#141414]">
        <span className="text-xs font-mono text-amber-400 font-bold">
          Kỷ Lục Chuỗi: {highestChain}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-[#2a2c30] hover:bg-[#383a3f] text-white border border-[#141414] text-xs font-jura font-bold uppercase flex items-center gap-1.5 cursor-pointer min-h-[40px]"
        >
          <X className="w-4 h-4" /> Đóng Game
        </button>
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 5: RETRO SNAKE (RẮN SĂN MỒI - ORE UI DESIGN STYLE & TALL BUTTONS)
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
      {/* Snake Canvas Grid Ore UI */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-[#141414] border-3 border-[#141414] shadow-[inset_2px_2px_0_#0f1011,inset_-2px_-2px_0_#282a2d] grid grid-cols-15 grid-rows-15 p-1 mb-4">
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
          const x = idx % GRID_SIZE;
          const y = Math.floor(idx / GRID_SIZE);
          const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
          const isSnakeBody = snake.slice(1).some((seg) => seg.x === x && seg.y === y);
          const isFoodCell = food.x === x && food.y === y;

          return (
            <div
              key={idx}
              className={`w-full h-full ${
                isSnakeHead
                  ? "bg-[#89dc69] border border-[#141414]"
                  : isSnakeBody
                  ? "bg-[#28960b] border border-[#141414]"
                  : isFoodCell
                  ? "bg-[#f59e0b] border border-[#141414] animate-pulse"
                  : "bg-transparent"
              }`}
            />
          );
        })}

        {/* Overlay when game over / not started */}
        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-base sm:text-lg font-black font-jura text-white uppercase mb-2">
              {isGameOver ? "💀 GAME OVER!" : "RẮN SĂN MỒI"}
            </span>
            <span className="text-xs font-mono text-[#89dc69] mb-4">
              Điểm số: {score} điểm
            </span>
            <button
              type="button"
              onClick={resetGame}
              className="px-5 py-3 bg-[#28960b] hover:bg-[#32b312] text-white border-2 border-[#141414] font-jura font-bold text-xs uppercase shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] active:translate-y-[1px] flex items-center gap-2 cursor-pointer min-h-[46px]"
            >
              <Play className="w-4 h-4 fill-current" /> {isGameOver ? "Chơi Lại" : "Bắt Đầu"}
            </button>
          </div>
        )}
      </div>

      {/* D-Pad Arrow Controls for Touch / Mobile with Taller Buttons */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setDir("UP")}
          className="w-16 h-12 bg-[#2a2c30] hover:bg-[#383a3f] text-white border-2 border-[#141414] shadow-[inset_2px_2px_0_#3f434a,inset_-2px_-2px_0_#18191b] flex items-center justify-center cursor-pointer active:translate-y-[1px]"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setDir("LEFT")}
            className="w-16 h-12 bg-[#2a2c30] hover:bg-[#383a3f] text-white border-2 border-[#141414] shadow-[inset_2px_2px_0_#3f434a,inset_-2px_-2px_0_#18191b] flex items-center justify-center cursor-pointer active:translate-y-[1px]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setDir("DOWN")}
            className="w-16 h-12 bg-[#2a2c30] hover:bg-[#383a3f] text-white border-2 border-[#141414] shadow-[inset_2px_2px_0_#3f434a,inset_-2px_-2px_0_#18191b] flex items-center justify-center cursor-pointer active:translate-y-[1px]"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setDir("RIGHT")}
            className="w-16 h-12 bg-[#2a2c30] hover:bg-[#383a3f] text-white border-2 border-[#141414] shadow-[inset_2px_2px_0_#3f434a,inset_-2px_-2px_0_#18191b] flex items-center justify-center cursor-pointer active:translate-y-[1px]"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Exit Bar */}
      <div className="w-full flex items-center justify-between gap-3 bg-[#1c1e20] p-3 border-2 border-[#141414]">
        <span className="text-xs font-mono text-[#89dc69] font-bold">
          Điểm Hiện Tại: {score}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-[#c53030] hover:bg-[#e53e3e] text-white border-2 border-[#141414] text-xs font-jura font-bold uppercase shadow-[inset_2px_2px_0_#fc8181,inset_-2px_-2px_0_#9b2c2c] flex items-center gap-1.5 cursor-pointer min-h-[42px]"
        >
          <X className="w-4 h-4" /> Đóng Game
        </button>
      </div>
    </div>
  );
};
