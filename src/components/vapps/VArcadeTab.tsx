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
  X
} from "lucide-react";
import { playPopSound } from "../../utils/sound";
import { MOCK_100_FRIENDS, VplayUser } from "../../data/mockFriendsData";

/* =========================================================================
   ORE UI V-ARCADE TYPES & STYLES
   ========================================================================= */

interface GameItem {
  id: string;
  title: string;
  category: "classic" | "puzzle" | "action" | "arcade";
  categoryLabel: string;
  description: string;
  rating: number;
  plays: string;
  color: string;
  iconName: string;
  isInteractive: boolean;
  difficulty: "Dễ" | "Trung bình" | "Khó" | "Cực khó";
}

// STRICTLY 5 GAMES AS REQUESTED BY USER
const ALL_GAMES: GameItem[] = [
  {
    id: "tic_tac_toe",
    title: "Cờ Caro XO (Tic-Tac-Toe)",
    category: "classic",
    categoryLabel: "Cổ điển",
    description: "Đánh X/O đấu trí đỉnh cao cùng NPC ngẫu nhiên (Search for people) hoặc 2 người chơi.",
    rating: 4.95,
    plays: "280K",
    color: "from-purple-600 to-indigo-800",
    iconName: "xo",
    isInteractive: true,
    difficulty: "Dễ"
  },
  {
    id: "rock_paper_scissors",
    title: "Oẳn Tù Tì (Kéo Búa Bao)",
    category: "classic",
    categoryLabel: "Cổ điển",
    description: "Trò chơi Oẳn Tù Tì thử phản xạ và may mắn cùng đối thủ NPC hoặc chơi 2 người pass & play.",
    rating: 4.90,
    plays: "250K",
    color: "from-rose-600 to-amber-700",
    iconName: "scissors",
    isInteractive: true,
    difficulty: "Dễ"
  },
  {
    id: "word_chain",
    title: "Nối Từ Tiếng Việt & Tiếng Anh",
    category: "puzzle",
    categoryLabel: "Đố vui",
    description: "Thử thách Nối Từ ghép Tiếng Việt & chữ cái Tiếng Anh cùng NPC từ Search for people hoặc bạn bè.",
    rating: 4.98,
    plays: "310K",
    color: "from-emerald-600 to-teal-800",
    iconName: "word",
    isInteractive: true,
    difficulty: "Trung bình"
  },
  {
    id: "counting_game",
    title: "Đếm Số 1 -> N (Phá Chuỗi Reset)",
    category: "puzzle",
    categoryLabel: "Đố vui",
    description: "Đếm số nối tiếp từ 1 đến N. Nếu ai đếm sai hay quá giờ sẽ phá chuỗi và bắt đầu lại từ 1!",
    rating: 4.92,
    plays: "240K",
    color: "from-blue-600 to-cyan-800",
    iconName: "numbers",
    isInteractive: true,
    difficulty: "Dễ"
  },
  {
    id: "snake",
    title: "Rắn Săn Mồi (Retro Snake)",
    category: "classic",
    categoryLabel: "Cổ điển",
    description: "Điều khiển chú rắn ăn mồi và tránh va chạm tường hay chính thân mình.",
    rating: 4.90,
    plays: "128K",
    color: "from-emerald-600 to-green-800",
    iconName: "snake",
    isInteractive: true,
    difficulty: "Trung bình"
  }
];

export const VArcadeTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGame, setActiveGame] = useState<GameItem | null>(null);
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
    snake: 120
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

  const filteredGames = ALL_GAMES.filter((g) => {
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === "all") return matchesSearch;
    if (selectedCategory === "favorites") return favoriteGames.includes(g.id) && matchesSearch;
    return g.category === selectedCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-5 text-white font-sans bg-[#232528] border-2 border-[#141414] shadow-2xl my-2">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5 p-4 sm:p-5 bg-[#1a1c1e] border-2 border-[#141414] shadow-[inset_1px_1px_0_#383b40,inset_-1px_-1px_0_#101112]">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#28960b] border-2 border-[#141414] shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] text-white">
            <Gamepad2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold font-jura tracking-wider text-white uppercase">
                V-ARCADE GAMING ZONE
              </h1>
              <span className="text-[10px] px-2.5 py-1 bg-[#f59e0b] text-[#141414] border border-[#141414] font-bold font-mono uppercase tracking-wider">
                Ore UI Arcade • 5 Trò Chơi Mới
              </span>
            </div>
            <p className="text-xs text-zinc-300 font-montserrat mt-1 max-w-xl">
              Thách đấu NPC ngẫu nhiên trong danh sách <span className="text-[#89dc69] font-bold">Search for people</span> hoặc chơi 2 người pass & play với Caro, Oẳn Tù Tì, Nối Từ, Đếm Số & Rắn Săn Mồi!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-auto">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playPopSound();
            }}
            className="px-4 py-2.5 bg-[#313438] hover:bg-[#3d4147] text-white border-2 border-[#141414] font-jura font-bold text-xs uppercase shadow-[inset_1px_1px_0_#484c52,inset_-1px_-1px_0_#1a1b1d] active:translate-y-[1px] flex items-center gap-2 cursor-pointer min-h-[42px]"
            title="Bật/Tắt âm thanh"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#89dc69]" /> : <VolumeX className="w-4 h-4 text-[#fc8181]" />}
            <span>{soundEnabled ? "ÂM THANH BẬT" : "ÂM THANH TẮT"}</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="space-y-3 mb-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#2f3135] border-2 border-[#141414] p-3 shadow-md">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm trò chơi V-Arcade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#18191b] border-2 border-[#141414] pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#28960b]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 shrink-0">
            <span className="text-[#89dc69] font-bold">{filteredGames.length}</span> / 5 trò chơi Ore UI
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
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
              className={`px-4 py-2.5 text-xs font-bold font-jura uppercase tracking-wider whitespace-nowrap border-2 border-[#141414] flex items-center gap-2 cursor-pointer active:translate-y-[1px] min-h-[42px] transition-none ${
                selectedCategory === cat.id
                  ? "bg-[#28960b] text-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]"
                  : "bg-[#2a2c30] hover:bg-[#383a3f] text-zinc-300 shadow-[inset_1px_1px_0_#3f434a,inset_-1px_-1px_0_#18191b]"
              }`}
            >
              {cat.id === "favorites" && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 5 Games */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredGames.map((game) => {
          const isFav = favoriteGames.includes(game.id);

          return (
            <div
              key={game.id}
              onClick={() => {
                setActiveGame(game);
                playPopSound();
              }}
              className="group bg-[#2a2c30] hover:bg-[#31343a] border-2 border-[#141414] p-4 flex flex-col justify-between shadow-[inset_1px_1px_0_#3f434a,inset_-1px_-1px_0_#18191b] transition-none cursor-pointer"
            >
              {/* Top Card Banner */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="p-3 bg-[#18191b] border-2 border-[#141414] text-[#89dc69]">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#f59e0b] text-[#141414] border border-[#141414] uppercase">
                    NPC & 2P
                  </span>
                  <button
                    onClick={(e) => toggleFavorite(game.id, e)}
                    className="p-1.5 hover:bg-white/10 border border-[#141414] bg-[#18191b] text-zinc-400 hover:text-amber-400"
                  >
                    <Star className={`w-4 h-4 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Title & Info */}
              <div className="mb-3">
                <h3 className="text-base font-bold font-jura text-white group-hover:text-[#89dc69] line-clamp-1 mb-1.5 transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs font-montserrat text-zinc-300 line-clamp-2 leading-relaxed">
                  {game.description}
                </p>
              </div>

              {/* Card Footer Info */}
              <div className="space-y-3 pt-3 border-t border-[#141414]">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {game.rating}
                  </span>
                  <span className="text-[#89dc69] font-bold">{game.difficulty}</span>
                </div>

                <button className="w-full py-3 bg-[#28960b] hover:bg-[#32b312] text-white font-jura font-bold text-xs uppercase tracking-wider border-2 border-[#141414] shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] active:translate-y-[1px] cursor-pointer flex items-center justify-center gap-2 transition-none min-h-[44px]">
                  <Play className="w-4 h-4 fill-current" /> CHƠI NGAY
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* GAME MODAL POPUP FOR PLAYING */}
      {activeGame && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-[#232528] border-4 border-[#141414] shadow-[inset_2px_2px_0_#3a3d42,inset_-2px_-2px_0_#121315,0_20px_25px_-5px_rgba(0,0,0,0.8)] p-4 sm:p-6 text-white flex flex-col max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-[#141414] pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#28960b] border-2 border-[#141414] shadow-[inset_1px_1px_0_#89dc69,inset_-1px_-1px_0_#1b5e20] text-white">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base sm:text-xl font-bold font-jura text-[#89dc69] uppercase tracking-wider">{activeGame.title}</h2>
                  <span className="text-xs font-mono text-zinc-400">{activeGame.categoryLabel} • {activeGame.difficulty}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveGame(null);
                    playPopSound();
                  }}
                  className="px-3 py-2 bg-[#c53030] hover:bg-[#e53e3e] border-2 border-[#141414] shadow-[inset_1px_1px_0_#fc8181,inset_-1px_-1px_0_#9b2c2c] active:translate-y-[1px] text-white text-xs font-jura font-bold uppercase transition-none cursor-pointer min-h-[42px] flex items-center gap-1.5"
                  title="Thoát trò chơi (ESC)"
                >
                  <X className="w-5 h-5" />
                  <span className="hidden sm:inline">Đóng (ESC)</span>
                </button>
              </div>
            </div>

            {/* Game Container */}
            <div className="w-full bg-[#18191b] border-2 border-[#141414] p-4 sm:p-6 min-h-[340px] flex flex-col items-center justify-center relative">
              {/* 1. TIC TAC TOE */}
              {activeGame.id === "tic_tac_toe" && (
                <TicTacToeGame
                  soundEnabled={soundEnabled}
                  onScoreUpdate={(s) => updateHighScore("tic_tac_toe", s)}
                />
              )}

              {/* 2. ROCK PAPER SCISSORS */}
              {activeGame.id === "rock_paper_scissors" && (
                <RockPaperScissorsGame
                  soundEnabled={soundEnabled}
                  onScoreUpdate={(s) => updateHighScore("rock_paper_scissors", s)}
                />
              )}

              {/* 3. WORD CHAIN */}
              {activeGame.id === "word_chain" && (
                <WordChainGame
                  soundEnabled={soundEnabled}
                  onScoreUpdate={(s) => updateHighScore("word_chain", s)}
                />
              )}

              {/* 4. COUNTING GAME */}
              {activeGame.id === "counting_game" && (
                <CountingGame
                  soundEnabled={soundEnabled}
                  onScoreUpdate={(s) => updateHighScore("counting_game", s)}
                />
              )}

              {/* 5. SNAKE */}
              {activeGame.id === "snake" && (
                <SnakeGame
                  soundEnabled={soundEnabled}
                  onScoreUpdate={(s) => updateHighScore("snake", s)}
                />
              )}
            </div>

            {/* Game Instructions */}
            <div className="mt-4 p-3 bg-[#1c1e20] border-2 border-[#141414] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-300 font-montserrat">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#89dc69] shrink-0" />
                <span>{activeGame.description}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                <span className="text-amber-400 font-bold bg-[#f59e0b]/10 border border-[#f59e0b]/40 px-2.5 py-1">
                  Kỷ Lục: {highScores[activeGame.id] || 0} pts
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
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
    <div className="w-full mb-4 p-3.5 bg-[#1c1e20] border-2 border-[#141414] flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Mode Buttons - Ore UI Taller */}
        <div className="flex items-center gap-2 bg-[#141414] p-1 border border-[#2a2c30]">
          <button
            type="button"
            onClick={() => {
              setGameMode("npc");
              playPopSound();
            }}
            className={`px-4 py-2.5 text-xs font-jura font-bold uppercase border-2 border-[#141414] transition-none flex items-center gap-2 cursor-pointer min-h-[42px] ${
              gameMode === "npc"
                ? "bg-[#28960b] text-white shadow-[inset_1px_1px_0_#89dc69,inset_-1px_-1px_0_#1b5e20]"
                : "bg-[#2a2c30] text-zinc-400 hover:text-white"
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
            className={`px-4 py-2.5 text-xs font-jura font-bold uppercase border-2 border-[#141414] transition-none flex items-center gap-2 cursor-pointer min-h-[42px] ${
              gameMode === "pvp"
                ? "bg-[#f59e0b] text-[#141414] shadow-[inset_1px_1px_0_#fde68a,inset_-1px_-1px_0_#b45309]"
                : "bg-[#2a2c30] text-zinc-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" /> 2 Người Chơi
          </button>
        </div>

        {/* NPC Profile Tag */}
        {gameMode === "npc" && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2.5 bg-[#282a2e] border-2 border-[#141414] px-3 py-1.5 min-h-[42px]">
              <img
                src={selectedNpc.avatar}
                alt={selectedNpc.name}
                className="w-7 h-7 border border-[#141414] object-cover shrink-0"
              />
              <div className="text-left">
                <div className="text-xs font-bold font-jura text-[#89dc69] leading-tight max-w-[130px] truncate">
                  {selectedNpc.name}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono">{selectedNpc.tag}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRandomize}
              className="px-3.5 py-2.5 bg-[#313438] hover:bg-[#3d4147] text-xs font-jura text-amber-300 font-bold border-2 border-[#141414] shadow-[inset_1px_1px_0_#484c52,inset_-1px_-1px_0_#1a1b1d] active:translate-y-[1px] flex items-center gap-1.5 cursor-pointer min-h-[42px]"
              title="Chọn ngẫu nhiên 1 người trong Search for people"
            >
              <Shuffle className="w-3.5 h-3.5" /> 🎲
            </button>
            <button
              type="button"
              onClick={() => setShowNpcPicker(!showNpcPicker)}
              className="px-3.5 py-2.5 bg-[#28960b] hover:bg-[#32b312] text-xs font-jura text-white font-bold border-2 border-[#141414] shadow-[inset_1px_1px_0_#89dc69,inset_-1px_-1px_0_#1b5e20] active:translate-y-[1px] flex items-center gap-1.5 cursor-pointer min-h-[42px]"
            >
              <User className="w-3.5 h-3.5" /> Chọn NPC
            </button>
          </div>
        )}
      </div>

      {/* NPC Search Drawer Dropdown */}
      {showNpcPicker && gameMode === "npc" && (
        <div className="bg-[#18191b] border-2 border-[#141414] p-3 mt-1 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold font-jura text-[#89dc69]">
              Chọn NPC đấu cùng (Danh sách Search for people):
            </span>
            <button
              type="button"
              onClick={() => setShowNpcPicker(false)}
              className="text-zinc-400 hover:text-white text-xs px-2.5 py-1 border border-[#141414] bg-[#2a2c30]"
            >
              ✕
            </button>
          </div>
          <input
            type="text"
            placeholder="Gõ tên tìm người..."
            value={pickerSearch}
            onChange={(e) => setPickerSearch(e.target.value)}
            className="w-full bg-[#232528] border-2 border-[#141414] px-3 py-2 text-xs font-mono text-white mb-2 focus:outline-none focus:border-[#28960b]"
          />
          <div className="max-h-40 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-1.5 pr-1">
            {filteredNpcs.map((npc) => (
              <button
                type="button"
                key={npc.id}
                onClick={() => {
                  setSelectedNpc(npc);
                  setShowNpcPicker(false);
                  playPopSound();
                }}
                className={`p-2 border-2 border-[#141414] text-left flex items-center gap-2 cursor-pointer transition-none ${
                  selectedNpc.id === npc.id
                    ? "bg-[#28960b] text-white shadow-[inset_1px_1px_0_#89dc69,inset_-1px_-1px_0_#1b5e20]"
                    : "bg-[#232528] text-zinc-300 hover:bg-[#313438]"
                }`}
              >
                <img src={npc.avatar} alt={npc.name} className="w-6 h-6 border border-[#141414] shrink-0" />
                <div className="truncate text-xs font-bold font-jura">{npc.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   1. GAME ENGINE: TIC TAC TOE (CỜ CARO XO) - ORE UI STYLE
   ========================================================================= */
const TicTacToeGame: React.FC<{
  soundEnabled: boolean;
  onScoreUpdate: (score: number) => void;
}> = ({ soundEnabled, onScoreUpdate }) => {
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

  // NPC Turn Trigger
  useEffect(() => {
    if (gameMode === "npc" && turn === "O" && !winner) {
      const timer = setTimeout(() => {
        makeNpcMove();
      }, 450);
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

    if (targetIndex === -1 && emptyIndices.includes(4)) {
      targetIndex = 4;
    }

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
      <div className="mb-4 text-center">
        {winner ? (
          <div className="text-sm font-bold font-jura text-amber-400 bg-amber-400/10 border-2 border-[#141414] px-4 py-2">
            {winner === "Tie"
              ? "🤝 Trận đấu Hòa nhau!"
              : winner === "X"
              ? "🎉 Bạn (X) Thắng Cuộc!"
              : gameMode === "npc"
              ? `🤖 ${selectedNpc.name} (O) Thắng!`
              : "🎉 Người chơi 2 (O) Thắng!"}
          </div>
        ) : (
          <div className="text-xs font-bold font-jura text-zinc-300 flex items-center justify-center gap-2">
            <span>LƯỢT BẮT ĐẦU:</span>
            <span
              className={`px-3 py-1 border border-[#141414] font-mono font-bold ${
                turn === "X"
                  ? "bg-[#28960b] text-white shadow-[inset_1px_1px_0_#89dc69,inset_-1px_-1px_0_#1b5e20]"
                  : "bg-[#f59e0b] text-[#141414] shadow-[inset_1px_1px_0_#fde68a,inset_-1px_-1px_0_#b45309]"
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

      {/* Grid Board */}
      <div className="grid grid-cols-3 gap-2.5 bg-[#18191b] p-4 border-2 border-[#141414] shadow-[inset_2px_2px_0_#101112,inset_-2px_-2px_0_#282a2e] mb-4">
        {board.map((cell, i) => (
          <button
            type="button"
            key={i}
            onClick={() => handleCellClick(i)}
            disabled={!!cell || !!winner || (gameMode === "npc" && turn === "O")}
            className={`w-20 h-20 sm:w-24 sm:h-24 border-2 border-[#141414] font-jura text-3xl font-bold flex items-center justify-center cursor-pointer transition-none active:translate-y-[1px] ${
              cell === "X"
                ? "bg-[#28960b] text-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]"
                : cell === "O"
                ? "bg-[#f59e0b] text-[#141414] shadow-[inset_2px_2px_0_#fde68a,inset_-2px_-2px_0_#b45309]"
                : "bg-[#2a2c30] hover:bg-[#383a3f] text-transparent shadow-[inset_1px_1px_0_#3f434a,inset_-1px_-1px_0_#18191b]"
            }`}
          >
            {cell || ""}
          </button>
        ))}
      </div>

      {/* Scores & Reset */}
      <div className="flex items-center justify-between w-full text-xs font-mono bg-[#1c1e20] p-3 border-2 border-[#141414] mb-4">
        <div className="text-[#89dc69] font-bold">Bạn (X): {scores.p1}</div>
        <div className="text-zinc-400">Hòa: {scores.ties}</div>
        <div className="text-amber-400 font-bold">
          {gameMode === "npc" ? `${selectedNpc.name.split(" ")[0]} (O)` : "P2 (O)"}: {scores.p2Npc}
        </div>
      </div>

      <button
        type="button"
        onClick={resetGame}
        className="w-full py-3 sm:py-3.5 px-6 bg-[#28960b] hover:bg-[#32b312] border-2 border-[#141414] text-white font-jura font-bold text-xs uppercase tracking-wider shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] active:translate-y-[1px] cursor-pointer flex items-center justify-center gap-2 min-h-[46px]"
      >
        <RotateCcw className="w-4 h-4" /> CHƠI VÁN MỚI
      </button>
    </div>
  );
};

/* =========================================================================
   2. GAME ENGINE: ROCK PAPER SCISSORS (OẲN TÙ TÌ) - ORE UI STYLE
   ========================================================================= */
const RockPaperScissorsGame: React.FC<{
  soundEnabled: boolean;
  onScoreUpdate: (score: number) => void;
}> = ({ soundEnabled, onScoreUpdate }) => {
  const [gameMode, setGameMode] = useState<"npc" | "pvp">("npc");
  const [selectedNpc, setSelectedNpc] = useState<VplayUser>(
    () => MOCK_100_FRIENDS[Math.floor(Math.random() * MOCK_100_FRIENDS.length)]
  );

  const [p1Choice, setP1Choice] = useState<string | null>(null);
  const [p2Choice, setP2Choice] = useState<string | null>(null);
  const [pvpPhase, setPvpPhase] = useState<"p1" | "p2" | "result">("p1");
  const [resultMsg, setResultMsg] = useState("Chọn Kéo, Búa hoặc Bao để đấu!");
  const [scores, setScores] = useState({ p1: 0, p2Npc: 0, ties: 0 });
  const [streak, setStreak] = useState(0);

  const OPTIONS = [
    { id: "scissors", label: "KÉO", emoji: "✂️" },
    { id: "rock", label: "BÚA", emoji: "🪨" },
    { id: "paper", label: "BAO", emoji: "📄" }
  ];

  const handleSelectChoice = (choiceId: string) => {
    if (soundEnabled) playPopSound();

    if (gameMode === "npc") {
      setP1Choice(choiceId);
      const npcChoiceObj = OPTIONS[Math.floor(Math.random() * OPTIONS.length)].id;
      setP2Choice(npcChoiceObj);
      evaluateWinner(choiceId, npcChoiceObj);
    } else {
      if (pvpPhase === "p1") {
        setP1Choice(choiceId);
        setPvpPhase("p2");
        setResultMsg("Đã ghi nhận P1. Mời Người chơi 2 chọn!");
      } else if (pvpPhase === "p2") {
        setP2Choice(choiceId);
        setPvpPhase("result");
        evaluateWinner(p1Choice!, choiceId);
      }
    }
  };

  const evaluateWinner = (c1: string, c2: string) => {
    if (c1 === c2) {
      setResultMsg("🤝 Hòa nhau!");
      setScores((s) => ({ ...s, ties: s.ties + 1 }));
    } else if (
      (c1 === "rock" && c2 === "scissors") ||
      (c1 === "scissors" && c2 === "paper") ||
      (c1 === "paper" && c2 === "rock")
    ) {
      setResultMsg("🎉 Bạn Thắng Ván Này!");
      setScores((s) => {
        const updated = { ...s, p1: s.p1 + 1 };
        onScoreUpdate(updated.p1 * 10);
        return updated;
      });
      setStreak((st) => st + 1);
    } else {
      setResultMsg(
        gameMode === "npc"
          ? `🤖 ${selectedNpc.name} Thắng Ván Này!`
          : "🎉 Người chơi 2 Thắng Ván Này!"
      );
      setScores((s) => ({ ...s, p2Npc: s.p2Npc + 1 }));
      setStreak(0);
    }
  };

  const resetGame = () => {
    setP1Choice(null);
    setP2Choice(null);
    setPvpPhase("p1");
    setResultMsg("Chọn Kéo, Búa hoặc Bao để đấu!");
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

      {/* Game Stage Area */}
      <div className="flex items-center justify-around w-full bg-[#1c1e20] border-2 border-[#141414] p-4 mb-4">
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold font-jura text-[#89dc69] mb-2 uppercase">BẠN (P1)</span>
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#18191b] border-2 border-[#141414] shadow-[inset_1px_1px_0_#3f434a,inset_-1px_-1px_0_#18191b] flex items-center justify-center text-4xl">
            {p1Choice ? OPTIONS.find((o) => o.id === p1Choice)?.emoji : "❓"}
          </div>
        </div>

        <div className="text-xl font-bold font-jura text-amber-400">VS</div>

        <div className="flex flex-col items-center">
          <span className="text-xs font-bold font-jura text-amber-400 mb-2 uppercase">
            {gameMode === "npc" ? selectedNpc.name.split(" ")[0] : "P2"}
          </span>
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#18191b] border-2 border-[#141414] shadow-[inset_1px_1px_0_#3f434a,inset_-1px_-1px_0_#18191b] flex items-center justify-center text-4xl">
            {gameMode === "pvp" && pvpPhase === "p2" ? (
              "🙈"
            ) : p2Choice ? (
              OPTIONS.find((o) => o.id === p2Choice)?.emoji
            ) : (
              "❓"
            )}
          </div>
        </div>
      </div>

      {/* Result Msg Banner */}
      <div className="text-xs font-bold font-jura text-[#89dc69] bg-[#18191b] border-2 border-[#141414] px-4 py-3 mb-4 text-center w-full">
        {resultMsg}
      </div>

      {/* Options Selector Buttons - Taller Ore UI Buttons */}
      <div className="grid grid-cols-3 gap-3 w-full mb-4">
        {OPTIONS.map((opt) => (
          <button
            type="button"
            key={opt.id}
            onClick={() => handleSelectChoice(opt.id)}
            disabled={gameMode === "pvp" && pvpPhase === "result"}
            className="py-3.5 sm:py-4 px-3 bg-[#2a2c30] hover:bg-[#383a3f] border-2 border-[#141414] text-white font-jura font-bold text-xs uppercase shadow-[inset_1px_1px_0_#3f434a,inset_-1px_-1px_0_#18191b] active:translate-y-[1px] flex flex-col items-center justify-center gap-1.5 cursor-pointer min-h-[64px]"
          >
            <span className="text-2xl">{opt.emoji}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Score Stats */}
      <div className="flex items-center justify-between w-full text-xs font-mono bg-[#1c1e20] p-3 border-2 border-[#141414] mb-4">
        <span className="text-[#89dc69] font-bold">Thắng: {scores.p1}</span>
        <span className="text-zinc-400">Hòa: {scores.ties}</span>
        <span className="text-amber-400 font-bold">Thua: {scores.p2Npc}</span>
        <span className="text-[#89dc69] font-bold">Chuỗi: 🔥{streak}</span>
      </div>

      <button
        type="button"
        onClick={resetGame}
        className="w-full py-3 sm:py-3.5 px-6 bg-[#28960b] hover:bg-[#32b312] border-2 border-[#141414] text-white font-jura font-bold text-xs uppercase tracking-wider shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] active:translate-y-[1px] cursor-pointer flex items-center justify-center gap-2 min-h-[46px]"
      >
        <RotateCcw className="w-4 h-4" /> CHƠI LẠI VÁN MỚI
      </button>
    </div>
  );
};

/* =========================================================================
   3. GAME ENGINE: WORD CHAIN (NỐI TỪ TIẾNG VIỆT & TIẾNG ANH) - ORE UI
   ========================================================================= */

const VN_WORD_DICT: Record<string, string[]> = {
  tập: ["tập viết", "tập gym", "tập học", "tập thể", "tập làm", "tập hát", "tập trung"],
  viết: ["viết bài", "viết thư", "viết lách", "viết chữ", "viết nhật ký"],
  bài: ["bài học", "bài ca", "bài thơ", "bài tập", "bài viết", "bài hát"],
  học: ["học sinh", "học tập", "học hỏi", "học hành", "học đường"],
  hành: ["hành động", "hành trình", "hành trang", "hành tỏi", "hành vi"],
  trình: ["trình trình", "trình bày", "trình chiếu", "trình độ", "trình làng"],
  trang: ["trang trí", "trang web", "trang phục", "trang điểm", "trang nhã"],
  điểm: ["điểm số", "điểm danh", "điểm tựa", "điểm nhấn", "điểm hẹn"],
  nhấn: ["nhấn mạnh", "nhấn nút", "nhấn ga"],
  mạnh: ["mạnh mẽ", "mạnh khỏe", "mạnh dạn", "mạnh tay"],
  khỏe: ["khỏe mạnh", "khỏe khoắn"],
  sinh: ["sinh hoạt", "sinh nhật", "sinh sống", "sinh thái", "sinh viên"],
  viên: ["viên đạn", "viên ngọc", "viên mãn", "viên chức"],
  vật: ["vật lý", "vật chất", "vật dụng", "vật kỷ niệm"],
  dụng: ["dụng cụ", "dụng ý", "dụng tâm"],
  cụ: ["cụ thể", "cụ già", "cụ ông"],
  thể: ["thể thao", "thể dục", "thể hiện", "thể chất"],
  thao: ["thao trường", "thao thức", "thao tác"],
  tác: ["tác phẩm", "tác giả", "tác phong", "tác động"],
  động: ["động lực", "động vật", "động viên", "động não"],
  lực: ["lực lượng", "lực sĩ", "lực hấp dẫn"],
  tâm: ["tâm hồn", "tâm trí", "tâm sự", "tâm trạng"],
  trạng: ["trạng thái", "trạng nguyên", "trạng từ"],
  thái: ["thái độ", "thái bình", "thái dương"]
};

const EN_WORD_DICT: Record<string, string[]> = {
  a: ["apple", "animal", "actor", "action", "anchor", "angel"],
  b: ["banana", "balloon", "butterfly", "basket", "bridge", "bottle"],
  c: ["cat", "castle", "camera", "cookie", "cactus", "cloud"],
  d: ["dog", "dolphin", "dragon", "diamond", "desert", "doctor"],
  e: ["elephant", "eagle", "engine", "earth", "energy", "emperor"],
  f: ["fish", "forest", "flower", "falcon", "feather", "fountain"],
  g: ["giraffe", "guitar", "galaxy", "garden", "gorilla", "gold"],
  h: ["horse", "house", "hero", "hammer", "island", "honey"],
  i: ["ice", "island", "iron", "igloo", "image", "insect"],
  j: ["jungle", "jaguar", "jellyfish", "journal", "journey", "juice"],
  k: ["kangaroo", "kingdom", "kite", "keyboard", "king", "koala"],
  l: ["lion", "lemon", "lantern", "leopard", "library"],
  m: ["monkey", "mountain", "moon", "mirror", "museum", "music"],
  n: ["night", "nature", "needle", "nest", "network", "ninja"],
  o: ["orange", "ocean", "owl", "orchid", "oxygen", "oasis"],
  p: ["panda", "parrot", "penguin", "planet", "pyramid", "puzzle"],
  q: ["queen", "quartz", "quiver", "quest"],
  r: ["rabbit", "rocket", "river", "robot", "rainbow", "ring"],
  s: ["sun", "star", "snake", "spider", "storm", "silver"],
  t: ["tiger", "tower", "turtle", "thunder", "temple", "treasure"],
  u: ["umbrella", "universe", "unicorn", "ukulele"],
  v: ["violin", "volcano", "village", "valley", "vessel"],
  w: ["water", "wolf", "window", "whisper", "wizard"],
  y: ["yellow", "yacht", "yak", "yeti", "yogurt"],
  z: ["zebra", "zucchini", "zipper", "zodiac"]
};

const WordChainGame: React.FC<{
  soundEnabled: boolean;
  onScoreUpdate: (score: number) => void;
}> = ({ soundEnabled, onScoreUpdate }) => {
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const [gameMode, setGameMode] = useState<"npc" | "pvp">("npc");
  const [selectedNpc, setSelectedNpc] = useState<VplayUser>(
    () => MOCK_100_FRIENDS[Math.floor(Math.random() * MOCK_100_FRIENDS.length)]
  );

  const [wordHistory, setWordHistory] = useState<
    { word: string; player: string; isNpc?: boolean }[]
  >([{ word: "học tập", player: "Hệ thống" }]);

  const [usedWords, setUsedWords] = useState<Set<string>>(new Set(["học tập"]));
  const [inputVal, setInputVal] = useState("");
  const [turn, setTurn] = useState<1 | 2>(1);
  const [timer, setTimer] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [gameMsg, setGameMsg] = useState("");
  const [scoreCount, setScoreCount] = useState(0);

  const lastEntry = wordHistory[wordHistory.length - 1]?.word || "";

  const targetRequirement = useMemo(() => {
    if (!lastEntry) return "";
    if (language === "vi") {
      const parts = lastEntry.trim().split(/\s+/);
      return parts[parts.length - 1].toLowerCase();
    } else {
      return lastEntry.trim().slice(-1).toLowerCase();
    }
  }, [lastEntry, language]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleTimeOut();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [turn, gameOver]);

  const handleTimeOut = () => {
    setGameOver(true);
    setGameMsg(
      turn === 1
        ? "⏰ Hết giờ! Bạn đã bị thua lượt nối từ!"
        : gameMode === "npc"
        ? `🎉 ${selectedNpc.name} bị hết giờ! Bạn đã giành chiến thắng!`
        : "⏰ Hết giờ! Người chơi 2 đã bị thua lượt!"
    );
  };

  const handleSubmitWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameOver) return;

    const trimmed = inputVal.trim().toLowerCase();
    if (!trimmed) return;

    if (usedWords.has(trimmed)) {
      setGameMsg(`❌ Từ "${trimmed}" đã được sử dụng rồi!`);
      return;
    }

    if (language === "vi") {
      const parts = trimmed.split(/\s+/);
      if (parts.length < 2) {
        setGameMsg("❌ Tiếng Việt cần từ ghép có ít nhất 2 tiếng (ví dụ: 'tập viết')!");
        return;
      }
      if (parts[0].toLowerCase() !== targetRequirement) {
        setGameMsg(`❌ Từ phải bắt đầu bằng chữ "${targetRequirement}"!`);
        return;
      }
    } else {
      if (trimmed[0].toLowerCase() !== targetRequirement) {
        setGameMsg(`❌ Từ Tiếng Anh phải bắt đầu bằng chữ cái '${targetRequirement.toUpperCase()}'!`);
        return;
      }
    }

    if (soundEnabled) playPopSound();

    const currentPlayerName = turn === 1 ? "Bạn" : "Người chơi 2";
    setWordHistory((prev) => [...prev, { word: trimmed, player: currentPlayerName }]);
    setUsedWords((prev) => new Set([...prev, trimmed]));
    setInputVal("");
    setGameMsg("");
    setTimer(15);

    const nextScore = scoreCount + 1;
    setScoreCount(nextScore);
    onScoreUpdate(nextScore * 10);

    if (gameMode === "npc") {
      setTurn(2);
    } else {
      setTurn(turn === 1 ? 2 : 1);
    }
  };

  useEffect(() => {
    if (gameMode === "npc" && turn === 2 && !gameOver) {
      const npcTimeout = setTimeout(() => {
        makeNpcWordResponse();
      }, 1000);
      return () => clearTimeout(npcTimeout);
    }
  }, [turn, gameMode, gameOver, targetRequirement]);

  const makeNpcWordResponse = () => {
    let npcWord = "";

    if (language === "vi") {
      const pool = VN_WORD_DICT[targetRequirement] || [];
      const validPool = pool.filter((w) => !usedWords.has(w));
      if (validPool.length > 0) {
        npcWord = validPool[Math.floor(Math.random() * validPool.length)];
      } else {
        const adjectives = ["vẻ", "mẽ", "đẽ", "mắn", "tràng", "sức", "lực", "thái", "độ"];
        for (const adj of adjectives) {
          const gen = `${targetRequirement} ${adj}`;
          if (!usedWords.has(gen)) {
            npcWord = gen;
            break;
          }
        }
      }
    } else {
      const pool = EN_WORD_DICT[targetRequirement] || [];
      const validPool = pool.filter((w) => !usedWords.has(w));
      if (validPool.length > 0) {
        npcWord = validPool[Math.floor(Math.random() * validPool.length)];
      }
    }

    if (npcWord) {
      setWordHistory((prev) => [
        ...prev,
        { word: npcWord, player: selectedNpc.name, isNpc: true }
      ]);
      setUsedWords((prev) => new Set([...prev, npcWord]));
      setTimer(15);
      setTurn(1);
    } else {
      setGameOver(true);
      setGameMsg(`🎉 ${selectedNpc.name} không nghĩ ra từ tiếp theo! Bạn chiến thắng!`);
    }
  };

  const restartGame = () => {
    const init = language === "vi" ? "học tập" : "apple";
    setWordHistory([{ word: init, player: "Hệ thống" }]);
    setUsedWords(new Set([init]));
    setInputVal("");
    setTurn(1);
    setTimer(15);
    setGameOver(false);
    setGameMsg("");
    setScoreCount(0);
    if (soundEnabled) playPopSound();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg">
      <OpponentBar
        gameMode={gameMode}
        setGameMode={(m) => {
          setGameMode(m);
          restartGame();
        }}
        selectedNpc={selectedNpc}
        setSelectedNpc={setSelectedNpc}
      />

      {/* Language Switcher Bar */}
      <div className="flex items-center gap-2 mb-3 bg-[#1c1e20] border-2 border-[#141414] p-2 w-full justify-between">
        <span className="text-xs font-bold font-jura text-zinc-300 pl-2 uppercase">NGÔN NGỮ NỐI TỪ:</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setLanguage("vi");
              restartGame();
            }}
            className={`px-3.5 py-2 text-xs font-jura font-bold uppercase border-2 border-[#141414] cursor-pointer min-h-[40px] ${
              language === "vi"
                ? "bg-[#28960b] text-white shadow-[inset_1px_1px_0_#89dc69,inset_-1px_-1px_0_#1b5e20]"
                : "bg-[#2a2c30] text-zinc-400 hover:text-white"
            }`}
          >
            🇻🇳 Tiếng Việt
          </button>
          <button
            type="button"
            onClick={() => {
              setLanguage("en");
              restartGame();
            }}
            className={`px-3.5 py-2 text-xs font-jura font-bold uppercase border-2 border-[#141414] cursor-pointer min-h-[40px] ${
              language === "en"
                ? "bg-[#28960b] text-white shadow-[inset_1px_1px_0_#89dc69,inset_-1px_-1px_0_#1b5e20]"
                : "bg-[#2a2c30] text-zinc-400 hover:text-white"
            }`}
          >
            🇬🇧 Tiếng Anh
          </button>
        </div>
      </div>

      {/* Required Target Badge */}
      <div className="w-full bg-[#18191b] border-2 border-[#141414] p-3.5 mb-3 flex items-center justify-between shadow-inner">
        <div>
          <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block">
            Từ nối tiếp phải bắt đầu bằng:
          </span>
          <span className="text-xl font-bold font-mono text-amber-300 uppercase">
            "{targetRequirement}"
          </span>
        </div>

        <div className="flex items-center gap-2 bg-[#232528] px-3.5 py-2 border-2 border-[#141414] text-xs font-mono">
          <Timer className="w-4 h-4 text-[#89dc69] animate-pulse" />
          <span className="text-[#89dc69] font-bold">{timer}s</span>
        </div>
      </div>

      {/* Chat Word Log */}
      <div className="w-full bg-[#18191b] border-2 border-[#141414] p-3 h-44 overflow-y-auto space-y-2 mb-3 flex flex-col-reverse">
        {[...wordHistory].reverse().map((item, idx) => (
          <div
            key={idx}
            className={`p-2.5 border-2 border-[#141414] text-xs flex items-center justify-between ${
              item.isNpc
                ? "bg-[#2a2c30] text-[#89dc69] self-start"
                : "bg-[#1f2226] text-white self-end"
            }`}
          >
            <span className="font-jura font-bold">{item.player}:</span>
            <span className="font-mono font-bold text-sm text-amber-300 uppercase pl-3">{item.word}</span>
          </div>
        ))}
      </div>

      {/* Error / Status Msg */}
      {gameMsg && (
        <div className="w-full bg-[#f59e0b]/20 border-2 border-[#141414] text-amber-300 text-xs font-bold font-jura p-3 mb-3 text-center">
          {gameMsg}
        </div>
      )}

      {/* Input Form with Taller Button */}
      <form onSubmit={handleSubmitWord} className="flex gap-2 w-full mb-3">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          disabled={gameOver || (gameMode === "npc" && turn === 2)}
          placeholder={
            language === "vi"
              ? `Nhập từ ghép bắt đầu bằng '${targetRequirement}'...`
              : `Nhập từ tiếng Anh bắt đầu bằng '${targetRequirement}'...`
          }
          className="flex-1 bg-[#18191b] border-2 border-[#141414] px-3.5 py-3 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#28960b]"
        />
        <button
          type="submit"
          disabled={gameOver || (gameMode === "npc" && turn === 2)}
          className="px-5 py-3 bg-[#28960b] hover:bg-[#32b312] disabled:opacity-50 text-white font-jura font-bold text-xs uppercase tracking-wider border-2 border-[#141414] shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] active:translate-y-[1px] flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[46px]"
        >
          <Send className="w-4 h-4" /> GỬI
        </button>
      </form>

      {/* Restart Button */}
      <div className="flex items-center justify-between w-full">
        <span className="text-xs font-mono text-[#89dc69] font-bold">Chuỗi Nối Từ: {scoreCount}</span>
        <button
          type="button"
          onClick={restartGame}
          className="px-5 py-3 bg-[#28960b] hover:bg-[#32b312] text-white font-jura font-bold text-xs uppercase tracking-wider border-2 border-[#141414] shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] active:translate-y-[1px] cursor-pointer flex items-center gap-1.5 min-h-[44px]"
        >
          <RotateCcw className="w-4 h-4" /> CHƠI LẠI
        </button>
      </div>
    </div>
  );
};

/* =========================================================================
   4. GAME ENGINE: COUNTING GAME (ĐẾM SỐ 1 -> N) - ORE UI
   ========================================================================= */
const CountingGame: React.FC<{
  soundEnabled: boolean;
  onScoreUpdate: (score: number) => void;
}> = ({ soundEnabled, onScoreUpdate }) => {
  const [gameMode, setGameMode] = useState<"npc" | "pvp">("npc");
  const [selectedNpc, setSelectedNpc] = useState<VplayUser>(
    () => MOCK_100_FRIENDS[Math.floor(Math.random() * MOCK_100_FRIENDS.length)]
  );

  const [currentNum, setCurrentNum] = useState(1);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [timer, setTimer] = useState(10);
  const [userInput, setUserInput] = useState("");
  const [maxStreak, setMaxStreak] = useState(0);
  const [alertMsg, setAlertMsg] = useState("");
  const [history, setHistory] = useState<{ num: number; player: string }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleBreakChain("⏰ Quá 10 giây không đếm số tiếp theo!");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentNum, turn]);

  const handleBreakChain = (reason: string) => {
    const brokenAt = currentNum;
    setAlertMsg(`💥 PHÁ CHUỖI! ${reason} Đã đếm sai ở mốc ${brokenAt}. Đếm lại từ 1!`);
    setMaxStreak((m) => Math.max(m, brokenAt - 1));
    setCurrentNum(1);
    setTimer(10);
    setTurn(1);
    setUserInput("");
    if (soundEnabled) playPopSound();
  };

  const handleSendNumber = (e?: React.FormEvent, directValue?: number) => {
    if (e) e.preventDefault();

    const val = directValue !== undefined ? directValue : parseInt(userInput, 10);
    if (isNaN(val)) return;

    if (soundEnabled) playPopSound();

    if (val !== currentNum) {
      handleBreakChain(`Đã nhập số ${val} trong khi số đúng là ${currentNum}.`);
      return;
    }

    const pName = turn === 1 ? "Bạn" : "Người chơi 2";
    setHistory((prev) => [...prev.slice(-10), { num: val, player: pName }]);
    const nextVal = val + 1;
    setCurrentNum(nextVal);
    setMaxStreak((m) => Math.max(m, val));
    onScoreUpdate(val * 10);
    setUserInput("");
    setAlertMsg("");
    setTimer(10);

    setTurn(turn === 1 ? 2 : 1);
  };

  useEffect(() => {
    if (gameMode === "npc" && turn === 2) {
      const npcTimer = setTimeout(() => {
        makeNpcCount();
      }, 750);
      return () => clearTimeout(npcTimer);
    }
  }, [turn, gameMode, currentNum]);

  const makeNpcCount = () => {
    let choice = currentNum;
    if (currentNum > 15 && Math.random() < 0.08) {
      choice = currentNum + 1;
    }

    if (choice !== currentNum) {
      handleBreakChain(`🤖 ${selectedNpc.name} đã lỡ tay đếm nhầm số ${choice}!`);
    } else {
      setHistory((prev) => [...prev.slice(-10), { num: choice, player: selectedNpc.name }]);
      const nextVal = choice + 1;
      setCurrentNum(nextVal);
      setMaxStreak((m) => Math.max(m, choice));
      onScoreUpdate(choice * 10);
      setTimer(10);
      setTurn(1);
    }
  };

  const resetAll = () => {
    setCurrentNum(1);
    setTurn(1);
    setTimer(10);
    setUserInput("");
    setAlertMsg("");
    setHistory([]);
    if (soundEnabled) playPopSound();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg">
      <OpponentBar
        gameMode={gameMode}
        setGameMode={(m) => {
          setGameMode(m);
          resetAll();
        }}
        selectedNpc={selectedNpc}
        setSelectedNpc={setSelectedNpc}
      />

      {/* Target Large Badge */}
      <div className="w-full bg-[#18191b] border-2 border-[#141414] p-4 mb-3 flex items-center justify-between shadow-inner">
        <div>
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-mono">
            SỐ TIẾP THEO CẦN ĐẾM:
          </span>
          <span className="text-3xl font-bold font-mono text-[#89dc69] tracking-wider">
            {currentNum}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 bg-[#232528] px-3.5 py-1.5 border-2 border-[#141414] text-xs font-mono mb-1">
            <Timer className="w-4 h-4 text-[#89dc69] animate-spin" />
            <span className="text-[#89dc69] font-bold">{timer}s</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            Lượt: {turn === 1 ? "Bạn" : gameMode === "npc" ? selectedNpc.name : "Người chơi 2"}
          </span>
        </div>
      </div>

      {/* Alert Warning Box */}
      {alertMsg && (
        <div className="w-full bg-[#c53030]/30 border-2 border-[#141414] text-red-200 text-xs font-bold font-jura p-3 mb-3 flex items-center gap-2 animate-bounce">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Recent Count Log */}
      <div className="w-full bg-[#18191b] border-2 border-[#141414] p-3 h-28 overflow-y-auto mb-3 flex flex-wrap gap-2 items-center">
        {history.length === 0 ? (
          <span className="text-xs text-zinc-500 italic mx-auto font-mono">Chưa có số nào được đếm...</span>
        ) : (
          history.map((h, i) => (
            <div
              key={i}
              className="px-2.5 py-1 bg-[#232528] border border-[#141414] text-xs flex items-center gap-1.5 font-mono"
            >
              <span className="text-zinc-400 text-[10px]">{h.player}:</span>
              <span className="font-bold text-[#89dc69]">{h.num}</span>
            </div>
          ))
        )}
      </div>

      {/* Quick Tap Buttons + Manual Input */}
      <div className="w-full space-y-3 mb-3">
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleSendNumber(undefined, currentNum)}
            disabled={gameMode === "npc" && turn === 2}
            className="py-3.5 sm:py-4 bg-[#28960b] hover:bg-[#32b312] text-white font-jura font-bold text-sm border-2 border-[#141414] shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] active:translate-y-[1px] cursor-pointer flex flex-col items-center justify-center min-h-[56px]"
          >
            <span className="text-[10px] uppercase opacity-80">Đúng số:</span>
            <span>{currentNum}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendNumber(undefined, currentNum + 1)}
            disabled={gameMode === "npc" && turn === 2}
            className="py-3.5 sm:py-4 bg-[#c53030] hover:bg-[#e53e3e] text-white font-jura font-bold text-sm border-2 border-[#141414] shadow-[inset_1px_1px_0_#fc8181,inset_-1px_-1px_0_#9b2c2c] active:translate-y-[1px] cursor-pointer flex flex-col items-center justify-center min-h-[56px]"
          >
            <span className="text-[10px] uppercase opacity-80">Gài sai:</span>
            <span>{currentNum + 1}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendNumber(undefined, Math.max(1, currentNum - 1))}
            disabled={gameMode === "npc" && turn === 2}
            className="py-3.5 sm:py-4 bg-[#f59e0b] hover:bg-[#d97706] text-[#141414] font-jura font-bold text-sm border-2 border-[#141414] shadow-[inset_1px_1px_0_#fde68a,inset_-1px_-1px_0_#b45309] active:translate-y-[1px] cursor-pointer flex flex-col items-center justify-center min-h-[56px]"
          >
            <span className="text-[10px] uppercase opacity-80">Đếm lùi:</span>
            <span>{Math.max(1, currentNum - 1)}</span>
          </button>
        </div>

        <form onSubmit={(e) => handleSendNumber(e)} className="flex gap-2">
          <input
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={gameMode === "npc" && turn === 2}
            placeholder={`Nhập số ${currentNum}...`}
            className="flex-1 bg-[#18191b] border-2 border-[#141414] px-3.5 py-3 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#28960b]"
          />
          <button
            type="submit"
            disabled={gameMode === "npc" && turn === 2}
            className="px-5 py-3 bg-[#28960b] hover:bg-[#32b312] text-white font-jura font-bold text-xs uppercase border-2 border-[#141414] shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] active:translate-y-[1px] flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[46px]"
          >
            <Send className="w-4 h-4" /> GỬI
          </button>
        </form>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between w-full font-mono text-xs text-zinc-300">
        <span className="text-amber-400 font-bold">Kỷ kỷ lục đếm: 🔥 {maxStreak}</span>
        <button
          type="button"
          onClick={resetAll}
          className="px-4 py-2.5 bg-[#313438] hover:bg-[#3d4147] text-white border-2 border-[#141414] font-jura font-bold text-xs uppercase cursor-pointer min-h-[40px]"
        >
          RESET TRẬN
        </button>
      </div>
    </div>
  );
};

/* =========================================================================
   5. GAME ENGINE: RETRO SNAKE - ORE UI
   ========================================================================= */
const SnakeGame: React.FC<{ soundEnabled: boolean; onScoreUpdate: (s: number) => void }> = ({
  soundEnabled,
  onScoreUpdate
}) => {
  const [snake, setSnake] = useState<[number, number][]>([
    [5, 5],
    [5, 4],
    [5, 3]
  ]);
  const [food, setFood] = useState<[number, number]>([10, 10]);
  const [dir, setDir] = useState<[number, number]>([0, 1]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const startGame = () => {
    setSnake([
      [5, 5],
      [5, 4],
      [5, 3]
    ]);
    setFood([Math.floor(Math.random() * 15), Math.floor(Math.random() * 15)]);
    setDir([0, 1]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    if (soundEnabled) playPopSound();
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const timer = setInterval(() => {
      setSnake((prevSnake) => {
        const head = [prevSnake[0][0] + dir[0], prevSnake[0][1] + dir[1]] as [number, number];

        if (head[0] < 0 || head[0] >= 15 || head[1] < 0 || head[1] >= 15) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some((segment) => segment[0] === head[0] && segment[1] === head[1])) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        if (head[0] === food[0] && head[1] === food[1]) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreUpdate(newScore);
          setFood([Math.floor(Math.random() * 15), Math.floor(Math.random() * 15)]);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [isPlaying, gameOver, dir, food, score]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-xs font-mono text-[#89dc69] font-bold uppercase tracking-wider bg-[#1c1e20] border-2 border-[#141414] px-4 py-2">
        {gameOver ? "GAME OVER! KẾT QUẢ: " + score + " PTS" : "ĐIỂM SỐ: " + score}
      </div>

      {/* Snake Grid Board */}
      <div className="grid grid-cols-15 gap-0.5 bg-[#18191b] p-3 border-2 border-[#141414] shadow-inner w-64 h-64">
        {Array.from({ length: 225 }).map((_, i) => {
          const r = Math.floor(i / 15);
          const c = i % 15;
          const isSnake = snake.some((s) => s[0] === r && s[1] === c);
          const isFood = food[0] === r && food[1] === c;

          return (
            <div
              key={i}
              className={`w-3.5 h-3.5 border border-[#141414] ${
                isSnake ? "bg-[#28960b]" : isFood ? "bg-[#f59e0b] animate-ping" : "bg-[#232528]"
              }`}
            />
          );
        })}
      </div>

      {!isPlaying ? (
        <button
          type="button"
          onClick={startGame}
          className="px-6 py-3.5 bg-[#28960b] hover:bg-[#32b312] border-2 border-[#141414] text-white font-jura font-bold text-xs uppercase tracking-wider shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] active:translate-y-[1px] cursor-pointer min-h-[46px]"
        >
          {gameOver ? "CHƠI LẠI RẮN SĂN MỒI" : "BẮT ĐẦU RẮN SĂN MỒI"}
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-2 w-44">
          <div />
          <button
            type="button"
            onClick={() => setDir([-1, 0])}
            className="p-3 bg-[#2a2c30] hover:bg-[#383a3f] border-2 border-[#141414] text-white font-bold text-base shadow-[inset_1px_1px_0_#3f434a,inset_-1px_-1px_0_#18191b] min-h-[48px] cursor-pointer"
          >
            ▲
          </button>
          <div />
          <button
            type="button"
            onClick={() => setDir([0, -1])}
            className="p-3 bg-[#2a2c30] hover:bg-[#383a3f] border-2 border-[#141414] text-white font-bold text-base shadow-[inset_1px_1px_0_#3f434a,inset_-1px_-1px_0_#18191b] min-h-[48px] cursor-pointer"
          >
            ◄
          </button>
          <button
            type="button"
            onClick={() => setDir([1, 0])}
            className="p-3 bg-[#2a2c30] hover:bg-[#383a3f] border-2 border-[#141414] text-white font-bold text-base shadow-[inset_1px_1px_0_#3f434a,inset_-1px_-1px_0_#18191b] min-h-[48px] cursor-pointer"
          >
            ▼
          </button>
          <button
            type="button"
            onClick={() => setDir([0, 1])}
            className="p-3 bg-[#2a2c30] hover:bg-[#383a3f] border-2 border-[#141414] text-white font-bold text-base shadow-[inset_1px_1px_0_#3f434a,inset_-1px_-1px_0_#18191b] min-h-[48px] cursor-pointer"
          >
            ►
          </button>
        </div>
      )}
    </div>
  );
};
