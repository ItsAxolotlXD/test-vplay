import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Gamepad2,
  Trophy,
  Star,
  Search,
  RotateCcw,
  Volume2,
  VolumeX,
  Play,
  Maximize2,
  Sparkles,
  Flame,
  ChevronLeft,
  Award,
  Zap,
  Grid,
  Heart,
  HelpCircle,
  BarChart2,
  Cpu,
  RefreshCw,
  Coins,
  Bot,
  Users,
  User,
  Shuffle,
  Check,
  X,
  Timer,
  Scissors,
  Globe,
  Swords,
  Send,
  ListOrdered,
  AlertTriangle
} from "lucide-react";
import { playPopSound } from "../../utils/sound";
import { MOCK_100_FRIENDS, VplayUser } from "../../data/mockFriendsData";

export interface GameItem {
  id: string;
  title: string;
  category: "classic" | "puzzle" | "action" | "strategy" | "sports" | "arcade";
  categoryLabel: string;
  description: string;
  rating: number;
  plays: string;
  color: string;
  iconName: string;
  isInteractive: boolean;
  difficulty: "Dễ" | "Trung bình" | "Khó" | "Cực khó";
}

// 100 DISTINCT GAMES WITH HIGHLIGHTED INTERACTIVE GAMES
const ALL_GAMES: GameItem[] = [
  // --- FEATURED INTERACTIVE GAMES (1-4) ---
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
    rating: 4.9,
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

  // --- CỔ ĐIỂN & RETRO ---
  { id: "snake", title: "Rắn Săn Mồi (Retro Snake)", category: "classic", categoryLabel: "Cổ điển", description: "Điều khiển chú rắn ăn mồi và tránh va chạm tường hay chính thân mình.", rating: 4.9, plays: "128K", color: "from-emerald-600 to-green-800", iconName: "snake", isInteractive: true, difficulty: "Trung bình" },
  { id: "tetris", title: "Xếp Hình Tetris Block", category: "classic", categoryLabel: "Cổ điển", description: "Xoay và xếp các khối gạch rơi xuống thành hàng ngang hoàn chỉnh.", rating: 4.95, plays: "210K", color: "from-blue-600 to-indigo-800", iconName: "tetris", isInteractive: true, difficulty: "Khó" },
  { id: "flappy", title: "Flappy V-Bird", category: "classic", categoryLabel: "Cổ điển", description: "Nhấn chèo lái chú chim vỗ cánh vượt qua hàng cột ống nước hiểm hóc.", rating: 4.8, plays: "180K", color: "from-amber-500 to-orange-700", iconName: "bird", isInteractive: true, difficulty: "Khó" },
  { id: "pong", title: "Bóng Bàn Pong 1972", category: "classic", categoryLabel: "Cổ điển", description: "Game bóng bàn 2 thanh gạt huyền thoại khai sinh ngành game thế giới.", rating: 4.6, plays: "64K", color: "from-teal-600 to-cyan-800", iconName: "pong", isInteractive: true, difficulty: "Dễ" },
  { id: "brick_breaker", title: "Phá Gạch Brick Breaker", category: "classic", categoryLabel: "Cổ điển", description: "Bắn bóng nảy thanh đỡ để đập vỡ toàn bộ các viên gạch sắc màu.", rating: 4.85, plays: "142K", color: "from-rose-600 to-red-800", iconName: "brick", isInteractive: true, difficulty: "Trung bình" },
  { id: "dino", title: "Khủng Long Chạy Vượt Rào", category: "classic", categoryLabel: "Cổ điển", description: "Nhảy né cây xương rồng và chim bay giống game Offline Chrome.", rating: 4.9, plays: "175K", color: "from-yellow-600 to-amber-800", iconName: "dino", isInteractive: true, difficulty: "Dễ" },
  { id: "minesweeper", title: "Dò Mìn Minesweeper", category: "classic", categoryLabel: "Cổ điển", description: "Sử dụng tư duy logic suy đoán các con số để cắm cờ gỡ mìn an toàn.", rating: 4.75, plays: "88K", color: "from-slate-600 to-zinc-800", iconName: "mine", isInteractive: true, difficulty: "Khó" },
  { id: "simon", title: "Ghi Nhớ Chuỗi Màu Simon", category: "classic", categoryLabel: "Cổ điển", description: "Ghi nhớ và bấm lại đúng thứ tự đèn màu phát sáng tăng dần.", rating: 4.65, plays: "52K", color: "from-violet-600 to-purple-800", iconName: "simon", isInteractive: true, difficulty: "Trung bình" },
  { id: "pacman_mini", title: "Pac-Man V-Maze", category: "classic", categoryLabel: "Cổ điển", description: "Ăn hết hạt đậu thần và tránh né các chú ma ngộ nghĩnh.", rating: 4.9, plays: "160K", color: "from-amber-400 to-yellow-600", iconName: "pacman", isInteractive: false, difficulty: "Khó" },
  { id: "space_invaders", title: "Bắn Ruồi Vũ Trụ Retro", category: "classic", categoryLabel: "Cổ điển", description: "Trạm phi thuyền di chuyển ngang tiêu diệt làn sóng quái vật ngoài hành tinh.", rating: 4.8, plays: "115K", color: "from-indigo-600 to-purple-900", iconName: "invaders", isInteractive: true, difficulty: "Khó" },

  // --- ĐỐ VUI & PUZZLE ---
  { id: "game_2048", title: "Trò Chơi 2048 Tile", category: "puzzle", categoryLabel: "Đố vui", description: "Vuốt trượt ghép các số trùng nhau để tạo nên viên gạch huyền thoại 2048.", rating: 4.9, plays: "195K", color: "from-amber-600 to-yellow-800", iconName: "2048", isInteractive: true, difficulty: "Trung bình" },
  { id: "memory_card", title: "Lật Hình Ghép Cặp (Memory)", category: "puzzle", categoryLabel: "Đố vui", description: "Thử thách trí nhớ tìm cặp hình giống nhau trong thời gian ngắn nhất.", rating: 4.8, plays: "110K", color: "from-emerald-600 to-teal-800", iconName: "cards", isInteractive: true, difficulty: "Dễ" },
  { id: "math_quiz", title: "Toán Siêu Tốc (Math Rush)", category: "puzzle", categoryLabel: "Đố vui", description: "Giải các phép tính cộng trừ nhân chia liên tục trong 3 giây mỗi câu.", rating: 4.75, plays: "85K", color: "from-blue-600 to-cyan-800", iconName: "math", isInteractive: true, difficulty: "Trung bình" },
  { id: "sudoku", title: "Điền Số Sudoku Express", category: "puzzle", categoryLabel: "Đố vui", description: "Điền các con số từ 1 đến 9 vào lưới mà không trùng hàng, cột hay ô 3x3.", rating: 4.85, plays: "130K", color: "from-violet-600 to-indigo-800", iconName: "sudoku", isInteractive: true, difficulty: "Khó" },

  // --- HÀNH ĐỘNG & ARCADE ---
  { id: "whack_a_mole", title: "Đập Chuột Túi (Whack-A-Mole)", category: "action", categoryLabel: "Hành động", description: "Phản xạ nhanh tay đập các chú chuột nhô lên khỏi hang gạch.", rating: 4.85, plays: "125K", color: "from-amber-600 to-orange-800", iconName: "hammer", isInteractive: true, difficulty: "Dễ" },
  { id: "target_shoot", title: "Bắn Bia Tập Bắn (Target Archery)", category: "action", categoryLabel: "Hành động", description: "Căn góc gió và thời điểm thả cung tên trúng hồng tâm 10 điểm.", rating: 4.8, plays: "112K", color: "from-rose-600 to-red-800", iconName: "target", isInteractive: true, difficulty: "Trung bình" },

  // --- GIẢI TRÍ & ÂM NHẠC ---
  { id: "piano_tiles", title: "Bím Piano Tốc Độ (Piano Tiles)", category: "arcade", categoryLabel: "Giải trí", description: "Bấm các phím đàn màu đen rơi xuống theo giai điệu bản nhạc du dương.", rating: 4.95, plays: "260K", color: "from-slate-800 to-black", iconName: "piano", isInteractive: true, difficulty: "Trung bình" },
  { id: "cookie_clicker", title: "Đào Bánh Cookie / V-Coins Clicker", category: "arcade", categoryLabel: "Giải trí", description: "Chạm liên tục để sản xuất hàng triệu chiếc bánh ngọt và nâng cấp nhà máy.", rating: 4.85, plays: "180K", color: "from-amber-500 to-yellow-700", iconName: "cookie", isInteractive: true, difficulty: "Dễ" },
  { id: "slot_machine", title: "Vòng Quay Slot Machine V-Spin", category: "arcade", categoryLabel: "Giải trí", description: "Quay 3 hũ may mắn trúng độc đắc Jackpot tích lũy V-Coins cực khủng.", rating: 4.9, plays: "205K", color: "from-red-600 to-amber-600", iconName: "slot", isInteractive: true, difficulty: "Dễ" }
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
    snake: 120,
    game_2048: 1024,
    slot_machine: 5000
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteGames((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const filteredGames = ALL_GAMES.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all"
        ? true
        : selectedCategory === "favorites"
        ? favoriteGames.includes(game.id)
        : game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 text-white font-sans">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 p-6 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-black border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl shadow-lg shadow-indigo-500/30 text-white font-black animate-pulse">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                V-Arcade Gaming Zone
              </h1>
              <span className="text-[10px] px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold uppercase tracking-widest shadow-md border border-white/20">
                Đấu NPC & 2 Người Chơi
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-1 max-w-xl">
              Thách đấu cùng NPC ngẫu nhiên trong danh sách <span className="text-indigo-300 font-bold">Search for people</span> hoặc chơi 2 người pass & play với Tic-Tac-Toe, Oẳn tù tì, Nối từ Tiếng Việt / Anh, Đếm số phá chuỗi!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10 self-end md:self-auto">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playPopSound();
            }}
            className="px-3 py-2 bg-[#2a2d36] hover:bg-[#383c48] border-2 border-[#484c5c] border-b-4 border-[#181a20] active:border-b-0 active:translate-y-1 text-white transition-all cursor-pointer flex items-center gap-2 text-xs font-bold rounded-none shadow-md"
            title="Bật/Tắt âm thanh"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
            <span className="hidden sm:inline">{soundEnabled ? "Âm thanh: Bật" : "Âm thanh: Tắt"}</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#16151c] border border-white/10 rounded-2xl p-3 shadow-xl">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm trò chơi V-Arcade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 shrink-0">
            <span className="text-indigo-400 font-bold">{filteredGames.length}</span> trò chơi tương tác
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "all", label: "Tất Cả Trò Chơi" },
            { id: "favorites", label: `Yêu Thích (${favoriteGames.length})` },
            { id: "classic", label: "Cổ Điển & Retro" },
            { id: "puzzle", label: "Đố Vui & Logic" },
            { id: "action", label: "Hành Động" },
            { id: "arcade", label: "Giải Trí" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                playPopSound();
              }}
              className={`px-4 py-2 text-xs font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 rounded-none ${
                selectedCategory === cat.id
                  ? "bg-[#208b3a] hover:bg-[#2dc653] text-white border-b-4 border-[#125322] active:border-b-0 active:translate-y-1 shadow-md"
                  : "bg-[#2a2d36] hover:bg-[#383c48] text-zinc-300 hover:text-white border-2 border-[#484c5c] border-b-4 border-[#181a20] active:border-b-0 active:translate-y-1 shadow-sm"
              }`}
            >
              {cat.id === "favorites" && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredGames.map((game) => {
          const isFav = favoriteGames.includes(game.id);

          return (
            <div
              key={game.id}
              onClick={() => {
                setActiveGame(game);
                playPopSound();
              }}
              className="group relative bg-[#181722] border border-white/10 hover:border-indigo-500/50 rounded-2xl p-4 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-200 cursor-pointer hover:-translate-y-1 overflow-hidden"
            >
              {/* Top Card Banner */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${game.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5">
                  {game.isInteractive && (
                    <span className="text-[9px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black uppercase tracking-wider">
                      NPC & 2P
                    </span>
                  )}
                  <button
                    onClick={(e) => toggleFavorite(game.id, e)}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-amber-400 transition-colors"
                  >
                    <Star className={`w-4 h-4 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Title & Info */}
              <div>
                <h3 className="text-sm font-black text-white group-hover:text-indigo-300 line-clamp-1 mb-1 transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
                  {game.description}
                </p>
              </div>

              {/* Card Footer Info */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {game.rating}
                  </span>
                  <span>{game.plays} lượt</span>
                  <span className="text-zinc-500 font-mono">{game.difficulty}</span>
                </div>

                <button className="w-full py-2 bg-[#208b3a] hover:bg-[#2dc653] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-none border-b-4 border-[#125322] active:border-b-0 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md">
                  <Play className="w-3.5 h-3.5 fill-current" /> CHƠI NGAY
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* GAME MODAL POPUP FOR PLAYING */}
      {activeGame && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-[#14131d] border border-indigo-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl relative text-white flex flex-col max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${activeGame.color} text-white`}>
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-indigo-300">{activeGame.title}</h2>
                  <span className="text-xs text-zinc-400">{activeGame.categoryLabel} • {activeGame.difficulty}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveGame(null);
                  playPopSound();
                }}
                className="px-3 py-1.5 bg-[#2a2d36] hover:bg-[#383c48] border-2 border-[#484c5c] border-b-4 border-[#181a20] active:border-b-0 active:translate-y-1 text-white text-xs font-bold rounded-none shadow-md transition-all cursor-pointer"
              >
                Đóng (ESC)
              </button>
            </div>

            {/* Game Container */}
            <div className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-4 min-h-[320px] flex flex-col items-center justify-center relative overflow-hidden">
              {/* 1. TIC TAC TOE */}
              {activeGame.id === "tic_tac_toe" && (
                <TicTacToeGame
                  soundEnabled={soundEnabled}
                  onScoreUpdate={(s) => setHighScores((prev) => ({ ...prev, tic_tac_toe: Math.max(prev.tic_tac_toe || 0, s) }))}
                />
              )}

              {/* 2. ROCK PAPER SCISSORS (OẲN TÙ TÌ) */}
              {activeGame.id === "rock_paper_scissors" && (
                <RockPaperScissorsGame
                  soundEnabled={soundEnabled}
                  onScoreUpdate={(s) => setHighScores((prev) => ({ ...prev, rock_paper_scissors: Math.max(prev.rock_paper_scissors || 0, s) }))}
                />
              )}

              {/* 3. WORD CHAIN (NỐI TỪ VN & EN) */}
              {activeGame.id === "word_chain" && (
                <WordChainGame
                  soundEnabled={soundEnabled}
                  onScoreUpdate={(s) => setHighScores((prev) => ({ ...prev, word_chain: Math.max(prev.word_chain || 0, s) }))}
                />
              )}

              {/* 4. COUNTING GAME (ĐẾM SỐ 1 -> N) */}
              {activeGame.id === "counting_game" && (
                <CountingGame
                  soundEnabled={soundEnabled}
                  onScoreUpdate={(s) => setHighScores((prev) => ({ ...prev, counting_game: Math.max(prev.counting_game || 0, s) }))}
                />
              )}

              {/* 5. SNAKE */}
              {activeGame.id === "snake" && (
                <SnakeGame
                  soundEnabled={soundEnabled}
                  onScoreUpdate={(s) => setHighScores((prev) => ({ ...prev, snake: Math.max(prev.snake || 0, s) }))}
                />
              )}

              {/* 6. MEMORY MATCH */}
              {activeGame.id === "memory_card" && <MemoryMatchGame />}

              {/* 7. MATH QUIZ */}
              {activeGame.id === "math_quiz" && <MathQuizGame />}

              {/* 8. COOKIE CLICKER */}
              {activeGame.id === "cookie_clicker" && <CookieClickerGame />}

              {/* 9. SLOT MACHINE */}
              {activeGame.id === "slot_machine" && <SlotMachineGame />}

              {/* GENERIC SIMULATOR FOR OTHERS */}
              {!["tic_tac_toe", "rock_paper_scissors", "word_chain", "counting_game", "snake", "memory_card", "math_quiz", "cookie_clicker", "slot_machine"].includes(activeGame.id) && (
                <GenericGameSimulator game={activeGame} />
              )}
            </div>

            {/* Game Instructions */}
            <div className="mt-4 p-3 bg-white/5 border border-white/5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{activeGame.description}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
                <span className="text-amber-400 font-bold">Kỷ Lục: {highScores[activeGame.id] || 0} pts</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   OPPONENT SELECTOR BAR (VS NPC from Search for people OR 2 Players)
   ========================================================================= */
interface OpponentBarProps {
  gameMode: "npc" | "pvp";
  setGameMode: (m: "npc" | "pvp") => void;
  selectedNpc: VplayUser;
  setSelectedNpc: (user: VplayUser) => void;
}

const OpponentBar: React.FC<OpponentBarProps> = ({
  gameMode,
  setGameMode,
  selectedNpc,
  setSelectedNpc
}) => {
  const [showNpcPicker, setShowNpcPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");

  const filteredNpcs = useMemo(() => {
    if (!pickerSearch.trim()) return MOCK_100_FRIENDS.slice(0, 16);
    return MOCK_100_FRIENDS.filter(
      (f) =>
        f.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
        f.tag.toLowerCase().includes(pickerSearch.toLowerCase())
    ).slice(0, 20);
  }, [pickerSearch]);

  const handleRandomize = () => {
    const random = MOCK_100_FRIENDS[Math.floor(Math.random() * MOCK_100_FRIENDS.length)];
    setSelectedNpc(random);
    playPopSound();
  };

  return (
    <div className="w-full mb-4 p-3 bg-zinc-900 border border-white/10 rounded-2xl flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Mode Buttons */}
        <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => {
              setGameMode("npc");
              playPopSound();
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              gameMode === "npc"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Bot className="w-3.5 h-3.5" /> Chơi Với NPC
          </button>
          <button
            type="button"
            onClick={() => {
              setGameMode("pvp");
              playPopSound();
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              gameMode === "pvp"
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> 2 Người Chơi
          </button>
        </div>

        {/* NPC Profile Tag */}
        {gameMode === "npc" && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-indigo-950/80 border border-indigo-500/40 px-3 py-1 rounded-xl">
              <img
                src={selectedNpc.avatar}
                alt={selectedNpc.name}
                className="w-6 h-6 rounded-full border border-indigo-400 object-cover shrink-0"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-indigo-200 leading-tight max-w-[130px] truncate">
                  {selectedNpc.name}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono">{selectedNpc.tag}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRandomize}
              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs text-indigo-300 font-bold rounded-xl border border-white/10 flex items-center gap-1 cursor-pointer"
              title="Chọn ngẫu nhiên 1 người trong Search for people"
            >
              <Shuffle className="w-3.5 h-3.5" /> 🎲
            </button>

            <button
              type="button"
              onClick={() => setShowNpcPicker(!showNpcPicker)}
              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-bold rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" /> Chọn NPC
            </button>
          </div>
        )}
      </div>

      {/* NPC Search Drawer Dropdown */}
      {showNpcPicker && gameMode === "npc" && (
        <div className="bg-zinc-950 border border-indigo-500/40 rounded-xl p-3 mt-1 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-300">
              Chọn NPC đấu cùng (Danh sách Search for people):
            </span>
            <button
              type="button"
              onClick={() => setShowNpcPicker(false)}
              className="text-zinc-400 hover:text-white text-xs px-2 py-0.5 rounded"
            >
              ✕
            </button>
          </div>
          <input
            type="text"
            placeholder="Gõ tên tìm người..."
            value={pickerSearch}
            onChange={(e) => setPickerSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white mb-2 focus:outline-none focus:border-indigo-500"
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
                className={`p-2 rounded-lg border text-left flex items-center gap-2 cursor-pointer transition-all ${
                  selectedNpc.id === npc.id
                    ? "bg-indigo-600/40 border-indigo-500 text-white"
                    : "bg-zinc-900 border-white/5 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                <img src={npc.avatar} alt={npc.name} className="w-6 h-6 rounded-full shrink-0" />
                <div className="truncate text-xs font-bold">{npc.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   1. GAME ENGINE: TIC TAC TOE (CỜ CARO XO)
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

    // Smart move check
    let targetIndex = -1;

    // 1. Can NPC win?
    for (const idx of emptyIndices) {
      const testBoard = [...board];
      testBoard[idx] = "O";
      if (checkWinner(testBoard) === "O") {
        targetIndex = idx;
        break;
      }
    }

    // 2. Can block Player X?
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

    // 3. Take center
    if (targetIndex === -1 && emptyIndices.includes(4)) {
      targetIndex = 4;
    }

    // 4. Take random
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
      <div className="mb-3 text-center">
        {winner ? (
          <div className="text-sm font-black text-amber-400 animate-bounce">
            {winner === "Tie"
              ? "🤝 Trận đấu Hòa nhau!"
              : winner === "X"
              ? "🎉 Bạn (X) Thắng Cuộc!"
              : gameMode === "npc"
              ? `🤖 ${selectedNpc.name} (O) Thắng!`
              : "🎉 Người chơi 2 (O) Thắng!"}
          </div>
        ) : (
          <div className="text-xs font-bold text-indigo-300 flex items-center justify-center gap-1.5">
            <span>Lượt của:</span>
            <span
              className={`px-2 py-0.5 rounded-md font-black ${
                turn === "X"
                  ? "bg-purple-600 text-white"
                  : "bg-amber-600 text-white"
              }`}
            >
              {turn === "X"
                ? "Bạn (X)"
                : gameMode === "npc"
                ? `${selectedNpc.name} (O)`
                : "Người chơi 2 (O)"}
            </span>
          </div>
        )}
      </div>

      {/* Grid Board */}
      <div className="grid grid-cols-3 gap-2.5 bg-zinc-900 p-3.5 rounded-2xl border border-indigo-500/30 shadow-xl w-56 h-56">
        {board.map((cell, i) => (
          <button
            type="button"
            key={i}
            onClick={() => handleCellClick(i)}
            disabled={!!cell || !!winner || (gameMode === "npc" && turn === "O")}
            className={`rounded-xl text-2xl font-black flex items-center justify-center transition-all cursor-pointer ${
              cell === "X"
                ? "bg-purple-600/30 text-purple-300 border border-purple-500"
                : cell === "O"
                ? "bg-amber-600/30 text-amber-300 border border-amber-500"
                : "bg-zinc-800 hover:bg-zinc-700 text-transparent border border-white/5 active:scale-95"
            }`}
          >
            {cell || ""}
          </button>
        ))}
      </div>

      {/* Scores & Reset */}
      <div className="flex items-center justify-between w-full mt-4 text-xs font-mono bg-zinc-900 p-2.5 rounded-xl border border-white/10">
        <div className="text-purple-300 font-bold">Bạn (X): {scores.p1}</div>
        <div className="text-zinc-400">Hòa: {scores.ties}</div>
        <div className="text-amber-400 font-bold">
          {gameMode === "npc" ? `${selectedNpc.name.split(" ")[0]} (O)` : "P2 (O)"}: {scores.p2Npc}
        </div>
      </div>

      <button
        type="button"
        onClick={resetGame}
        className="mt-3 px-5 py-2 bg-[#208b3a] hover:bg-[#2dc653] border-b-4 border-[#125322] active:border-b-0 active:translate-y-1 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-none cursor-pointer shadow-md flex items-center gap-1.5"
      >
        <RotateCcw className="w-3.5 h-3.5" /> Chơi Ván Mới
      </button>
    </div>
  );
};

/* =========================================================================
   2. GAME ENGINE: ROCK PAPER SCISSORS (OẲN TÙ TÌ)
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
    { id: "scissors", label: "Kéo", emoji: "✂️" },
    { id: "rock", label: "Búa", emoji: "🪨" },
    { id: "paper", label: "Bao", emoji: "📄" }
  ];

  const handleSelectChoice = (choiceId: string) => {
    if (soundEnabled) playPopSound();

    if (gameMode === "npc") {
      setP1Choice(choiceId);
      // NPC choice
      const npcChoiceObj = OPTIONS[Math.floor(Math.random() * OPTIONS.length)].id;
      setP2Choice(npcChoiceObj);
      evaluateWinner(choiceId, npcChoiceObj);
    } else {
      // 2 Players Mode
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
      setResultMsg("🎉 Người chơi 1 Thắng Ván Này!");
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
      <div className="flex items-center justify-around w-full bg-zinc-900 border border-indigo-500/30 p-4 rounded-2xl mb-3">
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-purple-300 mb-1">Bạn (P1)</span>
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 border-2 border-purple-500 flex items-center justify-center text-3xl shadow-lg">
            {p1Choice ? OPTIONS.find((o) => o.id === p1Choice)?.emoji : "❓"}
          </div>
        </div>

        <div className="text-xl font-black text-amber-400">VS</div>

        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-amber-300 mb-1">
            {gameMode === "npc" ? selectedNpc.name.split(" ")[0] : "Người chơi 2"}
          </span>
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 border-2 border-amber-500 flex items-center justify-center text-3xl shadow-lg">
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
      <div className="text-xs font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-4 py-2 rounded-xl mb-4 text-center w-full">
        {resultMsg}
      </div>

      {/* Options Selector Buttons */}
      <div className="grid grid-cols-3 gap-3 w-full mb-3">
        {OPTIONS.map((opt) => (
          <button
            type="button"
            key={opt.id}
            onClick={() => handleSelectChoice(opt.id)}
            disabled={gameMode === "pvp" && pvpPhase === "result"}
            className="py-3 px-2 bg-[#2a2d36] hover:bg-[#383c48] border-2 border-[#484c5c] border-b-4 border-[#181a20] active:border-b-0 active:translate-y-1 text-white font-black text-xs rounded-none shadow-md flex flex-col items-center gap-1 cursor-pointer"
          >
            <span className="text-2xl">{opt.emoji}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Score Stats */}
      <div className="flex items-center justify-between w-full text-xs font-mono bg-zinc-900 p-2.5 rounded-xl border border-white/10">
        <span className="text-purple-300 font-bold">Thắng: {scores.p1}</span>
        <span className="text-zinc-400">Hòa: {scores.ties}</span>
        <span className="text-amber-400 font-bold">Thua: {scores.p2Npc}</span>
        <span className="text-emerald-400 font-bold">Chuỗi: 🔥{streak}</span>
      </div>

      <button
        type="button"
        onClick={resetGame}
        className="mt-3 px-5 py-2 bg-[#208b3a] hover:bg-[#2dc653] border-b-4 border-[#125322] active:border-b-0 active:translate-y-1 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-none cursor-pointer shadow-md flex items-center gap-1.5"
      >
        <RotateCcw className="w-3.5 h-3.5" /> Chơi Lại Ván Mới
      </button>
    </div>
  );
};

/* =========================================================================
   3. GAME ENGINE: WORD CHAIN (NỐI TỪ TIẾNG VIỆT & TIẾNG ANH)
   ========================================================================= */

// Dictionary maps for NPC auto-play
const VN_WORD_DICT: Record<string, string[]> = {
  tập: ["tập viết", "tập gym", "tập học", "tập thể", "tập làm", "tập hát", "tập trung"],
  viết: ["viết bài", "viết thư", "viết lách", "viết chữ", "viết nhật ký"],
  bài: ["bài học", "bài ca", "bài thơ", "bài tập", "bài viết", "bài hát"],
  học: ["học sinh", "học tập", "học hỏi", "học hành", "học đường"],
  hành: ["hành động", "hành trình", "hành trang", "hành tỏi", "hành vi"],
  trình: ["trình bày", "trình chiếu", "trình độ", "trình làng"],
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
  const [turn, setTurn] = useState<1 | 2>(1); // 1 = P1, 2 = P2/NPC
  const [timer, setTimer] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [gameMsg, setGameMsg] = useState("");
  const [scoreCount, setScoreCount] = useState(0);

  const lastEntry = wordHistory[wordHistory.length - 1]?.word || "";

  // Get required target prefix/letter
  const targetRequirement = useMemo(() => {
    if (!lastEntry) return "";
    if (language === "vi") {
      const parts = lastEntry.trim().split(/\s+/);
      return parts[parts.length - 1].toLowerCase(); // last syllable
    } else {
      return lastEntry.trim().slice(-1).toLowerCase(); // last letter
    }
  }, [lastEntry, language]);

  // Turn Countdown Timer
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

  // Handle Player Input Submit
  const handleSubmitWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameOver) return;

    const trimmed = inputVal.trim().toLowerCase();
    if (!trimmed) return;

    // Check 1: Duplicate check
    if (usedWords.has(trimmed)) {
      setGameMsg(`❌ Từ "${trimmed}" đã được sử dụng rồi!`);
      return;
    }

    // Check 2: Matching requirement
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

    // Valid word accepted!
    const currentPlayerName = turn === 1 ? "Bạn" : "Người chơi 2";
    setWordHistory((prev) => [...prev, { word: trimmed, player: currentPlayerName }]);
    setUsedWords((prev) => new Set([...prev, trimmed]));
    setInputVal("");
    setGameMsg("");
    setTimer(15);

    const nextScore = scoreCount + 1;
    setScoreCount(nextScore);
    onScoreUpdate(nextScore * 10);

    // Switch turn
    if (gameMode === "npc") {
      setTurn(2);
    } else {
      setTurn(turn === 1 ? 2 : 1);
    }
  };

  // Trigger NPC Response
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
        // Fallback generator
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
      <div className="flex items-center gap-2 mb-3 bg-zinc-900 border border-white/10 p-1.5 rounded-xl w-full justify-between">
        <span className="text-xs font-bold text-zinc-300 pl-2">Ngôn ngữ nối từ:</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setLanguage("vi");
              restartGame();
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              language === "vi"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-zinc-400 hover:text-white"
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
            className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              language === "en"
                ? "bg-blue-600 text-white shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            🇬🇧 Tiếng Anh
          </button>
        </div>
      </div>

      {/* Required Target Badge */}
      <div className="w-full bg-gradient-to-r from-indigo-950 via-purple-950 to-zinc-900 border border-indigo-500/40 p-3 rounded-2xl mb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
            Từ nối tiếp phải bắt đầu bằng:
          </span>
          <span className="text-lg font-black text-amber-300 font-mono uppercase">
            "{targetRequirement}"
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono">
          <Timer className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-emerald-300 font-bold">{timer}s</span>
        </div>
      </div>

      {/* Chat Word Log */}
      <div className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-3 h-44 overflow-y-auto space-y-2 mb-3 flex flex-col-reverse">
        {[...wordHistory].reverse().map((item, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-xl text-xs flex items-center justify-between ${
              item.isNpc
                ? "bg-indigo-950/60 border border-indigo-500/30 text-indigo-200 self-start"
                : "bg-purple-950/60 border border-purple-500/30 text-purple-200 self-end"
            }`}
          >
            <span className="font-bold">{item.player}:</span>
            <span className="font-black text-white text-sm font-mono uppercase">{item.word}</span>
          </div>
        ))}
      </div>

      {/* Error / Status Msg */}
      {gameMsg && (
        <div className="w-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold p-2 rounded-xl mb-3 text-center">
          {gameMsg}
        </div>
      )}

      {/* Input Form */}
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
          className="flex-1 bg-zinc-900 border border-white/20 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={gameOver || (gameMode === "npc" && turn === 2)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" /> Gửi
        </button>
      </form>

      {/* Restart */}
      <div className="flex items-center justify-between w-full">
        <span className="text-xs font-mono text-emerald-400 font-bold">Chuỗi Nối Từ: {scoreCount}</span>
        <button
          type="button"
          onClick={restartGame}
          className="px-4 py-1.5 bg-[#208b3a] hover:bg-[#2dc653] text-white font-mono font-bold text-xs uppercase rounded-none border-b-4 border-[#125322] cursor-pointer shadow-md flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Chơi Lại
        </button>
      </div>
    </div>
  );
};

/* =========================================================================
   4. GAME ENGINE: COUNTING GAME (ĐẾM SỐ 1 -> N, PHÁ CHUỖI ĐẾM LẠI)
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
  const [turn, setTurn] = useState<1 | 2>(1); // 1 = P1, 2 = P2/NPC
  const [timer, setTimer] = useState(10);
  const [userInput, setUserInput] = useState("");
  const [maxStreak, setMaxStreak] = useState(0);
  const [alertMsg, setAlertMsg] = useState("");
  const [history, setHistory] = useState<{ num: number; player: string }[]>([]);

  // Timer per number
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

    // Correct entry!
    const pName = turn === 1 ? "Bạn" : "Người chơi 2";
    setHistory((prev) => [...prev.slice(-10), { num: val, player: pName }]);
    const nextVal = val + 1;
    setCurrentNum(nextVal);
    setMaxStreak((m) => Math.max(m, val));
    onScoreUpdate(val * 10);
    setUserInput("");
    setAlertMsg("");
    setTimer(10);

    // Switch turn
    setTurn(turn === 1 ? 2 : 1);
  };

  // NPC Turn Trigger
  useEffect(() => {
    if (gameMode === "npc" && turn === 2) {
      const npcTimer = setTimeout(() => {
        makeNpcCount();
      }, 750);
      return () => clearTimeout(npcTimer);
    }
  }, [turn, gameMode, currentNum]);

  const makeNpcCount = () => {
    // 5% chance NPC makes a mistake at higher numbers (>15) to break the chain for fun
    let choice = currentNum;
    if (currentNum > 15 && Math.random() < 0.08) {
      choice = currentNum + 1; // Intentional error
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
      <div className="w-full bg-gradient-to-r from-blue-950 via-indigo-950 to-zinc-900 border border-blue-500/40 p-4 rounded-2xl mb-3 flex items-center justify-between shadow-xl">
        <div>
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">
            Số tiếp theo cần đếm:
          </span>
          <span className="text-3xl font-black text-cyan-300 font-mono tracking-wider">
            {currentNum}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-xl border border-white/10 text-xs font-mono mb-1">
            <Timer className="w-4 h-4 text-emerald-400 animate-spin" />
            <span className="text-emerald-300 font-bold">{timer}s</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            Lượt: {turn === 1 ? "Bạn" : gameMode === "npc" ? selectedNpc.name : "Người chơi 2"}
          </span>
        </div>
      </div>

      {/* Alert Warning Box */}
      {alertMsg && (
        <div className="w-full bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-bold p-3 rounded-2xl mb-3 flex items-center gap-2 animate-bounce">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Recent Count Log */}
      <div className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-3 h-32 overflow-y-auto mb-3 flex flex-wrap gap-2 items-center">
        {history.length === 0 ? (
          <span className="text-xs text-zinc-500 italic mx-auto">Chưa có số nào được đếm...</span>
        ) : (
          history.map((h, i) => (
            <div
              key={i}
              className="px-2.5 py-1 bg-zinc-800 border border-white/10 rounded-xl text-xs flex items-center gap-1.5 font-mono"
            >
              <span className="text-zinc-400 text-[10px]">{h.player}:</span>
              <span className="font-bold text-cyan-300">{h.num}</span>
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
            className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl cursor-pointer shadow-lg active:scale-95 transition-all flex flex-col items-center"
          >
            <span className="text-[10px] font-normal uppercase opacity-80">Đúng số:</span>
            <span>{currentNum}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendNumber(undefined, currentNum + 1)}
            disabled={gameMode === "npc" && turn === 2}
            className="py-3 bg-rose-700/80 hover:bg-rose-600 text-rose-200 font-black text-sm rounded-xl cursor-pointer shadow-lg active:scale-95 transition-all flex flex-col items-center"
          >
            <span className="text-[10px] font-normal uppercase opacity-80">Gài bẫy sai:</span>
            <span>{currentNum + 1}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendNumber(undefined, Math.max(1, currentNum - 1))}
            disabled={gameMode === "npc" && turn === 2}
            className="py-3 bg-amber-700/80 hover:bg-amber-600 text-amber-200 font-black text-sm rounded-xl cursor-pointer shadow-lg active:scale-95 transition-all flex flex-col items-center"
          >
            <span className="text-[10px] font-normal uppercase opacity-80">Đếm lùi sai:</span>
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
            className="flex-1 bg-zinc-900 border border-white/20 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={gameMode === "npc" && turn === 2}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" /> Gửi
          </button>
        </form>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between w-full font-mono text-xs text-zinc-300">
        <span className="text-amber-400 font-bold">Kỷ lục đếm: 🔥 {maxStreak}</span>
        <button
          type="button"
          onClick={resetAll}
          className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg cursor-pointer"
        >
          Reset Trận
        </button>
      </div>
    </div>
  );
};

/* --- MINI GAME ENGINE 5: SNAKE --- */
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

        // Wall collision
        if (head[0] < 0 || head[0] >= 15 || head[1] < 0 || head[1] >= 15) {
          setGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some((segment) => segment[0] === head[0] && segment[1] === head[1])) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Eat food
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
    <div className="flex flex-col items-center gap-3">
      <div className="text-xs font-mono text-emerald-400 font-bold">
        {gameOver ? "Game Over! Kết quả: " + score + " pts" : "Điểm: " + score}
      </div>

      <div className="grid grid-cols-15 gap-0.5 bg-zinc-900 p-2 rounded-2xl border border-white/10 w-60 h-60">
        {Array.from({ length: 225 }).map((_, i) => {
          const r = Math.floor(i / 15);
          const c = i % 15;
          const isSnake = snake.some((s) => s[0] === r && s[1] === c);
          const isFood = food[0] === r && food[1] === c;

          return (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-sm ${
                isSnake ? "bg-emerald-400" : isFood ? "bg-rose-500 animate-ping" : "bg-zinc-800/40"
              }`}
            />
          );
        })}
      </div>

      {!isPlaying ? (
        <button
          type="button"
          onClick={startGame}
          className="px-6 py-2.5 bg-[#208b3a] hover:bg-[#2dc653] border-b-4 border-[#125322] active:border-b-0 active:translate-y-1 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-none shadow-md cursor-pointer"
        >
          {gameOver ? "Chơi Lại" : "Bắt Đầu Rắn Săn Mồi"}
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-2 w-36">
          <div />
          <button
            type="button"
            onClick={() => setDir([-1, 0])}
            className="p-2 bg-[#2a2d36] hover:bg-[#383c48] border-2 border-[#484c5c] text-white font-bold"
          >
            ▲
          </button>
          <div />
          <button
            type="button"
            onClick={() => setDir([0, -1])}
            className="p-2 bg-[#2a2d36] hover:bg-[#383c48] border-2 border-[#484c5c] text-white font-bold"
          >
            ◄
          </button>
          <button
            type="button"
            onClick={() => setDir([1, 0])}
            className="p-2 bg-[#2a2d36] hover:bg-[#383c48] border-2 border-[#484c5c] text-white font-bold"
          >
            ▼
          </button>
          <button
            type="button"
            onClick={() => setDir([0, 1])}
            className="p-2 bg-[#2a2d36] hover:bg-[#383c48] border-2 border-[#484c5c] text-white font-bold"
          >
            ►
          </button>
        </div>
      )}
    </div>
  );
};

/* --- MINI GAME ENGINE 6: MEMORY MATCH --- */
const MemoryMatchGame: React.FC = () => {
  const ICONS = ["🎮", "🚀", "💎", "⭐", "🔥", "⚽"];
  const [cards, setCards] = useState<
    { id: number; icon: string; flipped: boolean; matched: boolean }[]
  >([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  const initGame = () => {
    const deck = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, id) => ({ id, icon, flipped: false, matched: false }));
    setCards(deck);
    setFlippedCards([]);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (idx: number) => {
    if (cards[idx].flipped || cards[idx].matched || flippedCards.length >= 2) return;

    const newCards = [...cards];
    newCards[idx].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, idx];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].icon === cards[second].icon) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-4 gap-2 bg-zinc-900 p-3 rounded-2xl border border-white/10">
        {cards.map((c, i) => (
          <button
            type="button"
            key={i}
            onClick={() => handleCardClick(i)}
            className={`w-12 h-12 rounded-xl text-lg font-bold flex items-center justify-center cursor-pointer transition-all ${
              c.flipped || c.matched ? "bg-indigo-600 text-white" : "bg-zinc-800 text-transparent"
            }`}
          >
            {c.flipped || c.matched ? c.icon : "?"}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={initGame}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl cursor-pointer"
      >
        Chia Bài Lại
      </button>
    </div>
  );
};

/* --- MINI GAME ENGINE 7: MATH QUIZ --- */
const MathQuizGame: React.FC = () => {
  const [num1, setNum1] = useState(12);
  const [num2, setNum2] = useState(8);
  const [op, setOp] = useState("+");
  const [score, setScore] = useState(0);
  const [userAns, setUserAns] = useState("");

  const nextQuestion = () => {
    const ops = ["+", "-", "×"];
    const selectedOp = ops[Math.floor(Math.random() * ops.length)];
    setOp(selectedOp);
    setNum1(Math.floor(Math.random() * 20) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setUserAns("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let correct = 0;
    if (op === "+") correct = num1 + num2;
    if (op === "-") correct = num1 - num2;
    if (op === "×") correct = num1 * num2;

    if (parseInt(userAns, 10) === correct) {
      setScore((s) => s + 10);
      nextQuestion();
    } else {
      alert(`Chưa chính xác! Đáp án đúng là ${correct}`);
      setScore(0);
      nextQuestion();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <span className="text-xs font-mono text-emerald-400 font-bold">Điểm số: {score}</span>
      <div className="text-2xl font-black font-mono tracking-widest text-indigo-300">
        {num1} {op} {num2} = ?
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="number"
          value={userAns}
          onChange={(e) => setUserAns(e.target.value)}
          placeholder="Đáp án..."
          className="bg-zinc-800 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white w-28 text-center focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          Gửi
        </button>
      </form>
    </div>
  );
};

/* --- MINI GAME ENGINE 8: COOKIE CLICKER --- */
const CookieClickerGame: React.FC = () => {
  const [cookies, setCookies] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-sm font-bold text-amber-400">Tổng Số Bánh: {cookies}</div>
      <button
        type="button"
        onClick={() => setCookies((c) => c + 1)}
        className="w-24 h-24 rounded-full bg-amber-600 hover:bg-amber-500 text-4xl flex items-center justify-center shadow-2xl transition-transform active:scale-90 cursor-pointer border-4 border-amber-300"
      >
        🍪
      </button>
      <span className="text-[11px] text-zinc-400">Chạm liên tục để nướng bánh vàng!</span>
    </div>
  );
};

/* --- MINI GAME ENGINE 9: SLOT MACHINE --- */
const SlotMachineGame: React.FC = () => {
  const REELS = ["7️⃣", "💎", "🍒", "🔔", "🍋", "⭐"];
  const [r1, setR1] = useState("🎰");
  const [r2, setR2] = useState("🎰");
  const [r3, setR3] = useState("🎰");
  const [resultMsg, setResultMsg] = useState("Bấm QUAY HŨ để thử vận may!");

  const spin = () => {
    const s1 = REELS[Math.floor(Math.random() * REELS.length)];
    const s2 = REELS[Math.floor(Math.random() * REELS.length)];
    const s3 = REELS[Math.floor(Math.random() * REELS.length)];
    setR1(s1);
    setR2(s2);
    setR3(s3);

    if (s1 === s2 && s2 === s3) {
      setResultMsg("🎉 JACKPOT! Thưởng lớn 1,000 V-Coins!");
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
      setResultMsg("✨ Trúng 2 biểu tượng! Thưởng 100 V-Coins!");
    } else {
      setResultMsg("Chúc bạn may mắn lần sau!");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex items-center gap-2 bg-zinc-900 border border-amber-500/40 px-6 py-4 rounded-2xl text-3xl">
        <div className="w-12 h-12 flex items-center justify-center bg-black/50 rounded-xl">{r1}</div>
        <div className="w-12 h-12 flex items-center justify-center bg-black/50 rounded-xl">{r2}</div>
        <div className="w-12 h-12 flex items-center justify-center bg-black/50 rounded-xl">{r3}</div>
      </div>

      <div className="text-xs font-bold text-amber-300">{resultMsg}</div>

      <button
        type="button"
        onClick={spin}
        className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-red-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer"
      >
        QUAY HŨ NGAY
      </button>
    </div>
  );
};

/* --- GENERIC SIMULATOR FOR OTHER GAMES --- */
const GenericGameSimulator: React.FC<{ game: GameItem }> = ({ game }) => {
  const [simScore, setSimScore] = useState(100);
  const [simPlaying, setSimPlaying] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 p-6 text-center">
      <div className={`p-4 rounded-full bg-gradient-to-br ${game.color} text-white shadow-xl`}>
        <Gamepad2 className="w-10 h-10" />
      </div>

      <div>
        <h3 className="text-lg font-black text-indigo-300 mb-1">{game.title}</h3>
        <p className="text-xs text-zinc-400 max-w-md">{game.description}</p>
      </div>

      <div className="flex items-center gap-4 py-2 font-mono text-xs">
        <span className="text-emerald-400 font-bold">Điểm Trực Tuyến: {simScore} pts</span>
      </div>

      <button
        type="button"
        onClick={() => {
          setSimPlaying(true);
          setSimScore((s) => s + Math.floor(Math.random() * 50) + 10);
        }}
        className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xl cursor-pointer"
      >
        {simPlaying ? "Tiếp Tục Lượt Chơi (+Score)" : "Bắt Đầu Trải Nghiệm"}
      </button>
    </div>
  );
};
