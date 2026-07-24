import React, { useState, useEffect, useRef } from "react";
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
  Coins
} from "lucide-react";

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

// 100 DISTINCT GAMES
const ALL_GAMES: GameItem[] = [
  // --- CỔ ĐIỂN & RETRO (1-18) ---
  { id: "snake", title: "Rắn Săn Mồi (Retro Snake)", category: "classic", categoryLabel: "Cổ điển", description: "Điều khiển chú rắn ăn mồi và tránh va chạm tường hay chính thân mình.", rating: 4.9, plays: "128K", color: "from-emerald-600 to-green-800", iconName: "snake", isInteractive: true, difficulty: "Trung bình" },
  { id: "tetris", title: "Xếp Hình Tetris Block", category: "classic", categoryLabel: "Cổ điển", description: "Xoay và xếp các khối gạch rơi xuống thành hàng ngang hoàn chỉnh.", rating: 4.95, plays: "210K", color: "from-blue-600 to-indigo-800", iconName: "tetris", isInteractive: true, difficulty: "Khó" },
  { id: "flappy", title: "Flappy V-Bird", category: "classic", categoryLabel: "Cổ điển", description: "Nhấn chèo lái chú chim vỗ cánh vượt qua hàng cột ống nước hiểm hóc.", rating: 4.8, plays: "180K", color: "from-amber-500 to-orange-700", iconName: "bird", isInteractive: true, difficulty: "Khó" },
  { id: "tic_tac_toe", title: "Cờ Caro XO (Tic-Tac-Toe)", category: "classic", categoryLabel: "Cổ điển", description: "Đánh X/O đấu trí cùng máy AI thông minh hoặc chơi với bạn bè.", rating: 4.7, plays: "95K", color: "from-purple-600 to-pink-800", iconName: "xo", isInteractive: true, difficulty: "Dễ" },
  { id: "pong", title: "Bóng Bàn Pong 1972", category: "classic", categoryLabel: "Cổ điển", description: "Game bóng bàn 2 thanh gạt huyền thoại khai sinh ngành game thế giới.", rating: 4.6, plays: "64K", color: "from-teal-600 to-cyan-800", iconName: "pong", isInteractive: true, difficulty: "Dễ" },
  { id: "brick_breaker", title: "Phá Gạch Brick Breaker", category: "classic", categoryLabel: "Cổ điển", description: "Bắn bóng nảy thanh đỡ để đập vỡ toàn bộ các viên gạch sắc màu.", rating: 4.85, plays: "142K", color: "from-rose-600 to-red-800", iconName: "brick", isInteractive: true, difficulty: "Trung bình" },
  { id: "dino", title: "Khủng Long Chạy Vượt Rào", category: "classic", categoryLabel: "Cổ điển", description: "Nhảy né cây xương rồng và chim bay giống game Offline Chrome.", rating: 4.9, plays: "175K", color: "from-yellow-600 to-amber-800", iconName: "dino", isInteractive: true, difficulty: "Dễ" },
  { id: "minesweeper", title: "Dò Mìn Minesweeper", category: "classic", categoryLabel: "Cổ điển", description: "Sử dụng tư duy logic suy đoán các con số để cắm cờ gỡ mìn an toàn.", rating: 4.75, plays: "88K", color: "from-slate-600 to-zinc-800", iconName: "mine", isInteractive: true, difficulty: "Khó" },
  { id: "simon", title: "Ghi Nhớ Chuỗi Màu Simon", category: "classic", categoryLabel: "Cổ điển", description: "Ghi nhớ và bấm lại đúng thứ tự đèn màu phát sáng tăng dần.", rating: 4.65, plays: "52K", color: "from-violet-600 to-purple-800", iconName: "simon", isInteractive: true, difficulty: "Trung bình" },
  { id: "pacman_mini", title: "Pac-Man V-Maze", category: "classic", categoryLabel: "Cổ điển", description: "Ăn hết hạt đậu thần và tránh né các chú ma ngộ nghĩnh.", rating: 4.9, plays: "160K", color: "from-amber-400 to-yellow-600", iconName: "pacman", isInteractive: false, difficulty: "Khó" },
  { id: "space_invaders", title: "Bắn Ruồi Vũ Trụ Retro", category: "classic", categoryLabel: "Cổ điển", description: "Trạm phi thuyền di chuyển ngang tiêu diệt làn sóng quái vật ngoài hành tinh.", rating: 4.8, plays: "115K", color: "from-indigo-600 to-purple-900", iconName: "invaders", isInteractive: true, difficulty: "Khó" },
  { id: "connect4", title: "Cờ 4 Hàng (Connect 4)", category: "classic", categoryLabel: "Cổ điển", description: "Thả các đồng xu màu sao cho nối đủ 4 xu liên tiếp theo hàng.", rating: 4.7, plays: "73K", color: "from-cyan-600 to-blue-700", iconName: "grid", isInteractive: false, difficulty: "Trung bình" },
  { id: "asteroids", title: "Bắn Thiên Thạch Asteroids", category: "classic", categoryLabel: "Cổ điển", description: "Xoay tàu vũ trụ bắn vỡ các tảng đá thiên thạch đang trôi dạt.", rating: 4.6, plays: "48K", color: "from-zinc-600 to-slate-900", iconName: "rock", isInteractive: false, difficulty: "Khó" },
  { id: "frogger", title: "Chú Ếch Băng Qua Đường", category: "classic", categoryLabel: "Cổ điển", description: "Giúp chú ếch nhỏ nhảy qua dòng xe đông đúc và dòng sông trôi.", rating: 4.75, plays: "82K", color: "from-emerald-500 to-green-700", iconName: "frog", isInteractive: false, difficulty: "Trung bình" },
  { id: "galaga", title: "Phi Đội Bắn Máy Bay 1942", category: "classic", categoryLabel: "Cổ điển", description: "Chữa cháy bầu trời chống lại lực lượng không quân địch.", rating: 4.8, plays: "91K", color: "from-blue-700 to-slate-900", iconName: "plane", isInteractive: false, difficulty: "Khó" },
  { id: "pinball", title: "Pinball 3D Bắn Bóng", category: "classic", categoryLabel: "Cổ điển", description: "Bắn bóng nảy tích điểm số kỷ lục trên bàn pinball cổ điển.", rating: 4.85, plays: "105K", color: "from-fuchsia-600 to-pink-800", iconName: "pinball", isInteractive: false, difficulty: "Dễ" },
  { id: "duck_hunt", title: "Bắn Vịt Duck Hunt", category: "classic", categoryLabel: "Cổ điển", description: "Thử tài ngắm bắn vịt bay ra từ bụi cỏ trước khi chúng tẩu thoát.", rating: 4.7, plays: "67K", color: "from-orange-600 to-red-800", iconName: "duck", isInteractive: false, difficulty: "Dễ" },
  { id: "breakout_advance", title: "Breakout Super 3D", category: "classic", categoryLabel: "Cổ điển", description: "Biến thể đập gạch với nhiều vật phẩm bổ trợ và gạch rơi đặc biệt.", rating: 4.75, plays: "59K", color: "from-teal-700 to-emerald-900", iconName: "brick2", isInteractive: false, difficulty: "Trung bình" },

  // --- ĐỐ VUI & PUZZLE (19-36) ---
  { id: "game_2048", title: "Trò Chơi 2048 Tile", category: "puzzle", categoryLabel: "Đố vui", description: "Vuốt trượt ghép các số trùng nhau để tạo nên viên gạch huyền thoại 2048.", rating: 4.9, plays: "195K", color: "from-amber-600 to-yellow-800", iconName: "2048", isInteractive: true, difficulty: "Trung bình" },
  { id: "memory_card", title: "Lật Hình Ghép Cặp (Memory)", category: "puzzle", categoryLabel: "Đố vui", description: "Thử thách trí nhớ tìm cặp hình giống nhau trong thời gian ngắn nhất.", rating: 4.8, plays: "110K", color: "from-emerald-600 to-teal-800", iconName: "cards", isInteractive: true, difficulty: "Dễ" },
  { id: "math_quiz", title: "Toán Siêu Tốc (Math Rush)", category: "puzzle", categoryLabel: "Đố vui", description: "Giải các phép tính cộng trừ nhân chia liên tục trong 3 giây mỗi câu.", rating: 4.75, plays: "85K", color: "from-blue-600 to-cyan-800", iconName: "math", isInteractive: true, difficulty: "Trung bình" },
  { id: "sudoku", title: "Điền Số Sudoku Express", category: "puzzle", categoryLabel: "Đố vui", description: "Điền các con số từ 1 đến 9 vào lưới mà không trùng hàng, cột hay ô 3x3.", rating: 4.85, plays: "130K", color: "from-violet-600 to-indigo-800", iconName: "sudoku", isInteractive: true, difficulty: "Khó" },
  { id: "wordle_vi", title: "Đoán Từ Đoán Chữ (Wordle VI)", category: "puzzle", categoryLabel: "Đố vui", description: "Thử tài đoán từ ngữ Tiếng Việt có 5 chữ cái trong 6 lượt thử.", rating: 4.9, plays: "140K", color: "from-green-600 to-emerald-800", iconName: "word", isInteractive: false, difficulty: "Trung bình" },
  { id: "maze_runner", title: "Mê Cung Kỳ Bí (Labyrinth)", category: "puzzle", categoryLabel: "Đố vui", description: "Điều khiển bóng thoát khỏi mê cung chật hẹp đầy bẫy ngầm.", rating: 4.65, plays: "61K", color: "from-zinc-700 to-slate-900", iconName: "maze", isInteractive: false, difficulty: "Khó" },
  { id: "water_sort", title: "Rót Nước Đổi Màu (Water Sort)", category: "puzzle", categoryLabel: "Đố vui", description: "Phân loại chất dịch màu sắc vào các ống nghiệm sao cho mỗi ống đồng màu.", rating: 4.85, plays: "155K", color: "from-sky-500 to-blue-700", iconName: "water", isInteractive: false, difficulty: "Trung bình" },
  { id: "pipe_connect", title: "Nối Ống Nước (Plumber)", category: "puzzle", categoryLabel: "Đố vui", description: "Xoay các đoạn ống nối liền dòng chảy từ nguồn đến điểm đích.", rating: 4.7, plays: "78K", color: "from-amber-700 to-orange-900", iconName: "pipe", isInteractive: false, difficulty: "Trung bình" },
  { id: "slide_puzzle", title: "Xếp Hình Trượt 15-Puzzle", category: "puzzle", categoryLabel: "Đố vui", description: "Trượt các ô vuông số từ 1 đến 15 theo đúng thứ tự tăng dần.", rating: 4.6, plays: "45K", color: "from-rose-600 to-pink-800", iconName: "slide", isInteractive: false, difficulty: "Khó" },
  { id: "nonogram", title: "Giải Mã Bức Tranh Nonogram", category: "puzzle", categoryLabel: "Đố vui", description: "Tô đen các ô vuông theo manh mối con số ở viền để hiện bức tranh.", rating: 4.8, plays: "69K", color: "from-purple-700 to-indigo-900", iconName: "grid2", isInteractive: false, difficulty: "Khó" },
  { id: "lights_out", title: "Tắt Đèn Lưới (Lights Out)", category: "puzzle", categoryLabel: "Đố vui", description: "Nhiệm vụ tắt toàn bộ hệ thống bóng đèn khi mỗi lần bấm đảo trạng thái ô xung quanh.", rating: 4.65, plays: "38K", color: "from-yellow-500 to-amber-700", iconName: "light", isInteractive: false, difficulty: "Cực khó" },
  { id: "tower_of_hanoi", title: "Tháp Hà Nội (Hanoi Tower)", category: "puzzle", categoryLabel: "Đố vui", description: "Chuyển đĩa từ cọc này sang cọc khác với quy tắc đĩa lớn luôn ở dưới.", rating: 4.75, plays: "56K", color: "from-orange-600 to-red-800", iconName: "hanoi", isInteractive: false, difficulty: "Khó" },
  { id: "tangram", title: "Xếp Hình Sáng Tạo Tangram", category: "puzzle", categoryLabel: "Đố vui", description: "Ghép 7 mảnh gỗ phẳng thành các hình dáng động vật và đồ vật.", rating: 4.7, plays: "49K", color: "from-teal-600 to-emerald-800", iconName: "shape", isInteractive: false, difficulty: "Trung bình" },
  { id: "geo_quiz", title: "Đố Vui Cờ & Quốc Gia", category: "puzzle", categoryLabel: "Đố vui", description: "Đoán tên quốc gia thông qua hình ảnh lá cờ và bản đồ thế giới.", rating: 4.8, plays: "102K", color: "from-blue-500 to-indigo-700", iconName: "flag", isInteractive: false, difficulty: "Dễ" },
  { id: "block_match3", title: "Kim Cương Match 3 Jewel", category: "puzzle", categoryLabel: "Đố vui", description: "Xếp ít nhất 3 viên kim cương cùng màu để ăn điểm nổ tung.", rating: 4.9, plays: "185K", color: "from-fuchsia-500 to-purple-800", iconName: "gem", isInteractive: false, difficulty: "Dễ" },
  { id: "crossword_vi", title: "Ô Chữ Tri Thức Tiếng Việt", category: "puzzle", categoryLabel: "Đố vui", description: "Giải đáp các gợi ý hàng ngang để tìm ra từ khóa hàng dọc bí ẩn.", rating: 4.85, plays: "92K", color: "from-amber-600 to-yellow-700", iconName: "crossword", isInteractive: false, difficulty: "Trung bình" },
  { id: "color_sort", title: "Xếp Hạt Cườm Màu", category: "puzzle", categoryLabel: "Đố vui", description: "Sắp xếp chuỗi hạt màu phân tách theo đúng quy luật phòng thí nghiệm.", rating: 4.75, plays: "64K", color: "from-cyan-500 to-teal-700", iconName: "dots", isInteractive: false, difficulty: "Dễ" },
  { id: "physics_drop", title: "Vẽ Đường Cho Bóng Trôi", category: "puzzle", categoryLabel: "Đố vui", description: "Dùng bút vẽ các thanh chắn vật lý dẫn bóng lăn vào chiếc cúp.", rating: 4.8, plays: "89K", color: "from-indigo-500 to-violet-800", iconName: "pencil", isInteractive: false, difficulty: "Khó" },

  // --- HÀNH ĐỘNG & ARCADE (37-55) ---
  { id: "whack_a_mole", title: "Đập Chuột Túi (Whack-A-Mole)", category: "action", categoryLabel: "Hành động", description: "Phản xạ nhanh tay đập các chú chuột nhô lên khỏi hang gạch.", rating: 4.85, plays: "125K", color: "from-amber-600 to-orange-800", iconName: "hammer", isInteractive: true, difficulty: "Dễ" },
  { id: "target_shoot", title: "Bắn Bia Tập Bắn (Target Archery)", category: "action", categoryLabel: "Hành động", description: "Căn góc gió và thời điểm thả cung tên trúng hồng tâm 10 điểm.", rating: 4.8, plays: "112K", color: "from-rose-600 to-red-800", iconName: "target", isInteractive: true, difficulty: "Trung bình" },
  { id: "knife_hit", title: "Phi Dao Ván Gỗ (Knife Hit)", category: "action", categoryLabel: "Hành động", description: "Cắm toàn bộ dao vào thớt gỗ đang xoay mà không cắm trúng dao khác.", rating: 4.85, plays: "148K", color: "from-zinc-600 to-neutral-900", iconName: "knife", isInteractive: false, difficulty: "Trung bình" },
  { id: "fruit_ninja", title: "Chém Hoa Quả Fruit Slice", category: "action", categoryLabel: "Hành động", description: "Lướt ngón tay chém ngọt các quả trái cây bay lên và tránh né bom.", rating: 4.95, plays: "230K", color: "from-green-500 to-emerald-700", iconName: "slice", isInteractive: false, difficulty: "Trung bình" },
  { id: "space_shooter_pro", title: "Chiến Cơ Vũ Trụ Galaxy", category: "action", categoryLabel: "Hành động", description: "Nâng cấp đạn pháo chiến hạm chống lại các Trùm trạm không gian.", rating: 4.9, plays: "170K", color: "from-purple-600 to-indigo-900", iconName: "rocket", isInteractive: false, difficulty: "Khó" },
  { id: "bullet_dodge", title: "Né Đạn Ma Trận (Bullet Dodge)", category: "action", categoryLabel: "Hành động", description: "Điều khiển nhân vật luồn lách né tránh cơn mưa đạn lao tới.", rating: 4.7, plays: "58K", color: "from-red-600 to-rose-900", iconName: "shield", isInteractive: false, difficulty: "Cực khó" },
  { id: "karate_chop", title: "Chặt Gỗ Ninja Fast Chop", category: "action", categoryLabel: "Hành động", description: "Chặt thân cây cổ thụ sang trái phải tránh cành cối nhanh thoắt ẩn.", rating: 4.75, plays: "81K", color: "from-amber-700 to-yellow-900", iconName: "axe", isInteractive: false, difficulty: "Trung bình" },
  { id: "dunk_shot", title: "Bóng Rổ Căn Lực Dunk Shot", category: "action", categoryLabel: "Hành động", description: "Bắn bóng rổ nảy lướt vào rổ tạo chuỗi Combo ngọn lửa.", rating: 4.85, plays: "135K", color: "from-orange-500 to-amber-700", iconName: "basketball", isInteractive: false, difficulty: "Dễ" },
  { id: "jetpack_run", title: "Phản Lực Bay Jetpack Dash", category: "action", categoryLabel: "Hành động", description: "Bay cao bằng động cơ phản lực thu thập tiền vàng và né tia laser.", rating: 4.8, plays: "98K", color: "from-blue-600 to-cyan-800", iconName: "fire", isInteractive: false, difficulty: "Khó" },
  { id: "bomb_defuser", title: "Gỡ Bom Siêu Tốc 10s", category: "action", categoryLabel: "Hành động", description: "Nhìn sơ đồ dây điện cắt đúng dây gỡ bom trước khi đồng hồ về 0.", rating: 4.65, plays: "42K", color: "from-stone-700 to-zinc-900", iconName: "bomb", isInteractive: false, difficulty: "Cực khó" },
  { id: "helix_jump", title: "Tháp Xoắn Helix Jump", category: "action", categoryLabel: "Hành động", description: "Xoay cột tháp dẫn quả bóng nảy rớt qua các khe hở an toàn.", rating: 4.85, plays: "162K", color: "from-pink-500 to-rose-700", iconName: "tower", isInteractive: false, difficulty: "Trung bình" },
  { id: "stack_tower", title: "Xếp Chồng Khối Băng Stack", category: "action", categoryLabel: "Hành động", description: "Căn nhịp thả các khối vuông xếp chồng cao vút tới tận mây xanh.", rating: 4.8, plays: "108K", color: "from-indigo-500 to-purple-800", iconName: "layers", isInteractive: false, difficulty: "Dễ" },
  { id: "air_hockey", title: "Khúc Côn Cầu Bàn Băng Air Hockey", category: "action", categoryLabel: "Hành động", description: "Đánh dĩa tròn bắn vào lưới đối phương trên mặt bàn đệm khí.", rating: 4.75, plays: "87K", color: "from-teal-500 to-cyan-700", iconName: "hockey", isInteractive: false, difficulty: "Trung bình" },
  { id: "subway_runner", title: "Chạy Trên Đường Săn Vàng", category: "action", categoryLabel: "Hành động", description: "Nhảy lên nóc tàu hỏa luồn lách né rào chắn cảnh sát đuổi theo.", rating: 4.95, plays: "240K", color: "from-yellow-500 to-orange-700", iconName: "train", isInteractive: false, difficulty: "Khó" },
  { id: "bubble_shooter", title: "Bắn Bóng Bong Bóng Match", category: "action", categoryLabel: "Hành động", description: "Ngắm bắn các bong bóng cùng màu để làm nổ chùm bóng rực rỡ.", rating: 4.9, plays: "190K", color: "from-purple-500 to-pink-700", iconName: "bubbles", isInteractive: false, difficulty: "Dễ" },
  { id: "paper_plane", title: "Máy Bay Giấy Lượn Gió", category: "action", categoryLabel: "Hành động", description: "Giữ thăng bằng cho chiếc máy bay giấy lướt qua các khe cửa.", rating: 4.6, plays: "39K", color: "from-blue-400 to-indigo-600", iconName: "paperplane", isInteractive: false, difficulty: "Dễ" },
  { id: "color_switch", title: "Nhảy Đổi Màu Color Switch", category: "action", categoryLabel: "Hành động", description: "Nhảy bóng qua các vòng xoay chỉ khi màu bóng trùng màu rào.", rating: 4.8, plays: "115K", color: "from-fuchsia-600 to-purple-900", iconName: "colorcircle", isInteractive: false, difficulty: "Khó" },
  { id: "pin_pull", title: "Kéo Chốt Cứu Công Chúa", category: "action", categoryLabel: "Hành động", description: "Suy tính thứ tự rút chốt sắt để lấy kho báu và diệt quái dung nham.", rating: 4.75, plays: "94K", color: "from-amber-600 to-red-700", iconName: "pin", isInteractive: false, difficulty: "Trung bình" },
  { id: "endless_stairs", title: "Leo Cầu Thang Vô Tận", category: "action", categoryLabel: "Hành động", description: "Bấm đổi hướng và nhảy liên tục lên các bậc thang không bao giờ dừng.", rating: 4.7, plays: "63K", color: "from-emerald-600 to-teal-800", iconName: "stairs", isInteractive: false, difficulty: "Khó" },

  // --- CHIẾN THUẬT & BÀI (56-72) ---
  { id: "chess_ai", title: "Cờ Vua Đấu Trí AI (Chess)", category: "strategy", categoryLabel: "Chiến thuật", description: "Thi đấu cờ vua quốc tế cùng máy tính nhiều cấp độ từ Dễ tới Đại sư.", rating: 4.9, plays: "165K", color: "from-slate-700 to-zinc-900", iconName: "king", isInteractive: false, difficulty: "Cực khó" },
  { id: "checkers", title: "Cờ Nhảy Checkers Classic", category: "strategy", categoryLabel: "Chiến thuật", description: "Ăn quân đối phương bằng các bước nhảy chéo phong Vua trên bàn 8x8.", rating: 4.7, plays: "72K", color: "from-stone-600 to-neutral-800", iconName: "crown", isInteractive: false, difficulty: "Trung bình" },
  { id: "solitaire", title: "Xếp Bài Solitaire Nhện", category: "strategy", categoryLabel: "Chiến thuật", description: "Sắp xếp bộ bài Tây 52 lá theo thứ tự từ K đến A đồng chất.", rating: 4.85, plays: "150K", color: "from-emerald-700 to-green-900", iconName: "spade", isInteractive: false, difficulty: "Trung bình" },
  { id: "blackjack_21", title: "Xì Dách Blackjack 21 Point", category: "strategy", categoryLabel: "Chiến thuật", description: "Rút bài tính toán tổng điểm sao cho sát nốt 21 mà không bị quắc.", rating: 4.8, plays: "128K", color: "from-red-700 to-rose-950", iconName: "heart2", isInteractive: false, difficulty: "Trung bình" },
  { id: "uno_card", title: "Bài Uno 4 Màu Vui Nhộn", category: "strategy", categoryLabel: "Chiến thuật", description: "Đánh bài trùng màu hoặc số, sử dụng lá +2, +4, Đổi chiều đè đối thủ.", rating: 4.95, plays: "220K", color: "from-yellow-500 to-red-600", iconName: "uno", isInteractive: false, difficulty: "Dễ" },
  { id: "reversi", title: "Cờ Lật Reversi Othello", category: "strategy", categoryLabel: "Chiến thuật", description: "Đặt quân cờ kẹp giữa hai quân đối phương để bao vây đổi màu toàn bộ.", rating: 4.75, plays: "61K", color: "from-zinc-800 to-black", iconName: "reversi", isInteractive: false, difficulty: "Khó" },
  { id: "tower_defense", title: "Tháp Phòng Thủ Tower Defense", category: "strategy", categoryLabel: "Chiến thuật", description: "Xây dựng các trụ pháo nỏ thần chặn đứng từng đợt tấn công quái quỷ.", rating: 4.85, plays: "140K", color: "from-amber-700 to-orange-900", iconName: "castle", isInteractive: false, difficulty: "Khó" },
  { id: "battleship", title: "Thủy Chiến Bắn Tàu Battleship", category: "strategy", categoryLabel: "Chiến thuật", description: "Bố trí hạm đội trên tọa độ biển bí mật và đoán điểm bắn chìm tàu địch.", rating: 4.8, plays: "99K", color: "from-blue-700 to-cyan-900", iconName: "ship", isInteractive: false, difficulty: "Trung bình" },
  { id: "mahjong", title: "Xếp Bài Mạt Chược Mahjong", category: "strategy", categoryLabel: "Chiến thuật", description: "Tìm các cặp quân bài mạt chược trống hai bên để dọn sạch bàn.", rating: 4.85, plays: "118K", color: "from-teal-700 to-emerald-900", iconName: "tile", isInteractive: false, difficulty: "Trung bình" },
  { id: "domino", title: "Xếp Xương Dominoes Deluxe", category: "strategy", categoryLabel: "Chiến thuật", description: "Nối các đầu quân bài domino có cùng số chấm tròn thắng tuyệt đối.", rating: 4.7, plays: "68K", color: "from-slate-600 to-zinc-800", iconName: "domino", isInteractive: false, difficulty: "Dễ" },
  { id: "co_ca_ngua", title: "Cờ Cá Ngựa Vui Nhộn (Ludo)", category: "strategy", categoryLabel: "Chiến thuật", description: "Xúc xắc xuất quân cá ngựa đá đối thủ về chuồng đua về đích.", rating: 4.9, plays: "180K", color: "from-rose-500 to-amber-600", iconName: "horse", isInteractive: false, difficulty: "Dễ" },
  { id: "risk_mini", title: "Chinh Phục Lãnh Thổ Mini", category: "strategy", categoryLabel: "Chiến thuật", description: "Điều quân chiếm đóng các vùng đất mở rộng đế chế toàn cầu.", rating: 4.75, plays: "54K", color: "from-red-800 to-zinc-900", iconName: "globe", isInteractive: false, difficulty: "Khó" },
  { id: "kingdom_tycoon", title: "Xây Vương Quốc Kingdom", category: "strategy", categoryLabel: "Chiến thuật", description: "Quản lý ngân sách tài nguyên nông trại và mở rộng bờ cõi.", rating: 4.8, plays: "83K", color: "from-yellow-600 to-amber-800", iconName: "coin", isInteractive: false, difficulty: "Trung bình" },
  { id: "poker_memory", title: "Poker Ghép Bộ Bài Tây", category: "strategy", categoryLabel: "Chiến thuật", description: "Tạo các bộ sảnh, thùng, cù lũ từ các lá bài trên lưới 5x5.", rating: 4.65, plays: "47K", color: "from-emerald-800 to-teal-950", iconName: "diamond", isInteractive: false, difficulty: "Khó" },
  { id: "co_tuong", title: "Cờ Tướng Việt Nam (Xiangqi)", category: "strategy", categoryLabel: "Chiến thuật", description: "Điều khiển Xe, Pháo, Mã, Tướng vượt sông đấu trí kỳ nghệ.", rating: 4.95, plays: "210K", color: "from-red-700 to-amber-900", iconName: "xiangqi", isInteractive: false, difficulty: "Cực khó" },
  { id: "goboard", title: "Cờ Thế Vây Cổ Điển (Go)", category: "strategy", categoryLabel: "Chiến thuật", description: "Đặt quân đen trắng chiếm đất tạo mắt vây bắt cờ đối thủ.", rating: 4.8, plays: "52K", color: "from-zinc-700 to-black", iconName: "goboard", isInteractive: false, difficulty: "Cực khó" },
  { id: "war_cards", title: "Chiến Tranh Lá Bài (War)", category: "strategy", categoryLabel: "Chiến thuật", description: "So sánh lá bài lớn nhỏ đoạt lấy toàn bộ bộ bài của đối phương.", rating: 4.6, plays: "35K", color: "from-indigo-700 to-purple-900", iconName: "swords", isInteractive: false, difficulty: "Dễ" },

  // --- THỂ THAO & TỐC ĐỘ (73-87) ---
  { id: "penalty_shoot", title: "Sút Penalty World Cup", category: "sports", categoryLabel: "Thể thao", description: "Căn lực và xoáy góc sút bóng đá hạ gục thủ môn đối phương.", rating: 4.9, plays: "195K", color: "from-green-600 to-teal-800", iconName: "football", isInteractive: false, difficulty: "Dễ" },
  { id: "retro_racer", title: "Đua Xe F1 Retro Racer", category: "sports", categoryLabel: "Thể thao", description: "Điều khiển siêu xe F1 vượt mặt các đối thủ trên đường đua rượt đuổi.", rating: 4.85, plays: "145K", color: "from-red-600 to-orange-700", iconName: "car", isInteractive: false, difficulty: "Trung bình" },
  { id: "billiards_8ball", title: "Bida 8 Lỗ (8-Ball Pool)", category: "sports", categoryLabel: "Thể thao", description: "Thao tác gậy cơ điều hướng bi cái ăn bi sọc/trơn vào lỗ mượt mà.", rating: 4.95, plays: "250K", color: "from-emerald-700 to-zinc-900", iconName: "pool", isInteractive: false, difficulty: "Khó" },
  { id: "mini_golf", title: "Sân Golf Mini 3D", category: "sports", categoryLabel: "Thể thao", description: "Đánh bóng golf vượt qua chướng ngại vật dốc nghiêng vào lỗ gôn.", rating: 4.8, plays: "92K", color: "from-teal-600 to-green-800", iconName: "flag2", isInteractive: false, difficulty: "Dễ" },
  { id: "bowling_strike", title: "Bowling Strike 10 Pin", category: "sports", categoryLabel: "Thể thao", description: "Ném bóng xoáy nảy đổ sạch 10 con ki bowling giành cú Strike hoàn hảo.", rating: 4.85, plays: "115K", color: "from-blue-600 to-indigo-800", iconName: "bowling", isInteractive: false, difficulty: "Dễ" },
  { id: "table_tennis", title: "Bóng Bàn Siêu Cúp Ping Pong", category: "sports", categoryLabel: "Thể thao", description: "Mặt vợt giao bóng và đập bóng xoáy nhanh trên bàn thi đấu.", rating: 4.75, plays: "88K", color: "from-amber-600 to-red-700", iconName: "paddle", isInteractive: false, difficulty: "Trung bình" },
  { id: "skate_jump", title: "Trượt Ván Street Skate", category: "sports", categoryLabel: "Thể thao", description: "Trượt ván phố nhảy qua tay vịn và làm các kỹ thuật Kickflip điểm cao.", rating: 4.7, plays: "74K", color: "from-purple-600 to-pink-800", iconName: "skate", isInteractive: false, difficulty: "Trung bình" },
  { id: "darts_master", title: "Bắn Phi Tiêu Darts 501", category: "sports", categoryLabel: "Thể thao", description: "Phi tiêu chính xác vào tâm Bullseye trừ dần điểm từ 501 về đúng 0.", rating: 4.8, plays: "81K", color: "from-zinc-600 to-neutral-800", iconName: "dart", isInteractive: false, difficulty: "Khó" },
  { id: "boxing_tap", title: "Đấu Võ Boxing Knockout", category: "sports", categoryLabel: "Thể thao", description: "Né đòn móc gạt và ra cú đấm thẳng đoạt đai vô địch hạng nặng.", rating: 4.75, plays: "66K", color: "from-rose-700 to-red-900", iconName: "glove", isInteractive: false, difficulty: "Trung bình" },
  { id: "track_sprint", title: "Chạy Điền Kinh 100m Dash", category: "sports", categoryLabel: "Thể thao", description: "Bấm nút chạy cực nhanh bứt phá cán đích đầu tiên trên đường chạy.", rating: 4.65, plays: "53K", color: "from-amber-500 to-orange-700", iconName: "runner", isInteractive: false, difficulty: "Dễ" },
  { id: "bike_stunt", title: "Mô Tô Địa Hình Stunt Bike", category: "sports", categoryLabel: "Thể thao", description: "Giữ thăng bằng xe cào cào bay qua đồi núi dốc đứng hiểm hóc.", rating: 4.8, plays: "104K", color: "from-slate-700 to-zinc-900", iconName: "bike", isInteractive: false, difficulty: "Khó" },
  { id: "high_jump", title: "Nhảy Cao Fosbury Flop", category: "sports", categoryLabel: "Thể thao", description: "Căn nhịp giậm nhảy và ưỡn lưng vượt xà cao kỷ lục thế giới.", rating: 4.6, plays: "37K", color: "from-cyan-600 to-blue-800", iconName: "jump", isInteractive: false, difficulty: "Khó" },
  { id: "drag_racing", title: "Đua Xe Tốc Độ Drag Race", category: "sports", categoryLabel: "Thể thao", description: "Nhấn ga và gạt cần số chuẩn xác để bứt tốc thắng chặng đua 400m.", rating: 4.85, plays: "122K", color: "from-red-600 to-amber-700", iconName: "gauge", isInteractive: false, difficulty: "Dễ" },
  { id: "badminton_pro", title: "Cầu Lông Đơn Badminton", category: "sports", categoryLabel: "Thể thao", description: "Nảy cầu, bỏ nhỏ và đập cầu uy lực vượt lưới sang sân đối phương.", rating: 4.75, plays: "79K", color: "from-emerald-600 to-teal-800", iconName: "shuttle", isInteractive: false, difficulty: "Trung bình" },
  { id: "swimming_rush", title: "Bơi Lội Tự Do 200m", category: "sports", categoryLabel: "Thể thao", description: "Quạt tay bơi đạp nước nhịp nhàng duy trì thể lực vượt qua làn bơi.", rating: 4.65, plays: "41K", color: "from-sky-600 to-blue-800", iconName: "swim", isInteractive: false, difficulty: "Dễ" },

  // --- NGHỆ THUẬT & GIẢI TRÍ (88-100) ---
  { id: "piano_tiles", title: "Bím Piano Tốc Độ (Piano Tiles)", category: "arcade", categoryLabel: "Giải trí", description: "Bấm các phím đàn màu đen rơi xuống theo giai điệu bản nhạc du dương.", rating: 4.95, plays: "260K", color: "from-slate-800 to-black", iconName: "piano", isInteractive: true, difficulty: "Trung bình" },
  { id: "cookie_clicker", title: "Đào Bánh Cookie / V-Coins Clicker", category: "arcade", categoryLabel: "Giải trí", description: "Chạm liên tục để sản xuất hàng triệu chiếc bánh ngọt và nâng cấp nhà máy.", rating: 4.85, plays: "180K", color: "from-amber-500 to-yellow-700", iconName: "cookie", isInteractive: true, difficulty: "Dễ" },
  { id: "slot_machine", title: "Vòng Quay Slot Machine V-Spin", category: "arcade", categoryLabel: "Giải trí", description: "Quay 3 hũ may mắn trúng độc đắc Jackpot tích lũy V-Coins cực khủng.", rating: 4.9, plays: "205K", color: "from-red-600 to-amber-600", iconName: "slot", isInteractive: true, difficulty: "Dễ" },
  { id: "plinko", title: "Thả Bóng Zic-Zac Plinko", category: "arcade", categoryLabel: "Giải trí", description: "Thả quả bóng rớt qua các cây đinh nảy ngẫu nhiên vào ô nhân thưởng x100.", rating: 4.8, plays: "138K", color: "from-purple-600 to-pink-700", iconName: "dots2", isInteractive: false, difficulty: "Dễ" },
  { id: "wheel_of_fortune", title: "Chiếc Nón Kỳ Diệu Wheel", category: "arcade", categoryLabel: "Giải trí", description: "Quay bánh xe nhận quà tặng phần thưởng bất ngờ mỗi ngày.", rating: 4.9, plays: "190K", color: "from-emerald-500 to-teal-700", iconName: "wheel", isInteractive: false, difficulty: "Dễ" },
  { id: "pop_balloon", title: "Bắn Bong Bóng Nổ Pop", category: "arcade", categoryLabel: "Giải trí", description: "Chạm nổ các quả bóng bay sắc màu trước khi chúng chạm trần nhà.", rating: 4.75, plays: "91K", color: "from-pink-500 to-rose-600", iconName: "balloon", isInteractive: false, difficulty: "Dễ" },
  { id: "idle_miner", title: "Thợ Mỏ Đào Vàng Idle Miner", category: "arcade", categoryLabel: "Giải trí", description: "Thả móc kéo kim cương, vàng ròng và rương kho báu dưới lòng đất.", rating: 4.85, plays: "150K", color: "from-yellow-600 to-amber-800", iconName: "shovel", isInteractive: false, difficulty: "Dễ" },
  { id: "rhythm_tap", title: "Vũ Điệu Nhịp Điệu Rhythm", category: "arcade", categoryLabel: "Giải trí", description: "Bấm chính xác các mũi tên rơi theo điệu nhạc EDM sôi động.", rating: 4.8, plays: "110K", color: "from-violet-600 to-fuchsia-800", iconName: "music", isInteractive: false, difficulty: "Khó" },
  { id: "pet_simulator", title: "Nuôi Thú Cưng Ngộ Nghĩnh", category: "arcade", categoryLabel: "Giải trí", description: "Chăm sóc, cho ăn và chơi đùa cùng chú mèo con đáng yêu.", rating: 4.85, plays: "130K", color: "from-sky-400 to-indigo-600", iconName: "paw", isInteractive: false, difficulty: "Dễ" },
  { id: "roller_splat", title: "Lăn Sơn Tô Màu Roller Splat", category: "arcade", categoryLabel: "Giải trí", description: "Lăn con lăn sơn phủ kín toàn bộ sàn nhà màu trắng tinh.", rating: 4.7, plays: "77K", color: "from-emerald-500 to-cyan-600", iconName: "paint", isInteractive: false, difficulty: "Dễ" },
  { id: "fireboy_watergirl", title: "Cậu Bé Lửa & Cô Bé Nước", category: "arcade", categoryLabel: "Giải trí", description: "Phối hợp 2 nhân vật Lửa và Nước thu thập kim cương vượt đền cấm.", rating: 4.95, plays: "215K", color: "from-blue-600 to-red-600", iconName: "firewater", isInteractive: false, difficulty: "Khó" },
  { id: "coin_catcher", title: "Hứng Tiền Mưa Vàng", category: "arcade", categoryLabel: "Giải trí", description: "Di chuyển hũ vàng hứng cơn mưa đồng xu từ trên trời rơi xuống.", rating: 4.8, plays: "105K", color: "from-amber-400 to-yellow-600", iconName: "bucket", isInteractive: false, difficulty: "Dễ" },
  { id: "portal_dash", title: "Thần Thoại Cổng Dịch Chuyển", category: "arcade", categoryLabel: "Giải trí", description: "Nhảy qua cổng không gian xoay chuyển trọng lực thách thức.", rating: 4.7, plays: "65K", color: "from-indigo-600 to-violet-900", iconName: "portal", isInteractive: false, difficulty: "Cực khó" }
];

export const VArcadeTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGame, setActiveGame] = useState<GameItem | null>(null);
  const [favoriteGames, setFavoriteGames] = useState<string[]>(["snake", "tetris", "flappy", "game_2048", "slot_machine"]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Interactivity engine states for playable mini-games
  const [gameScore, setGameScore] = useState(0);
  const [highScores, setHighScores] = useState<Record<string, number>>({
    snake: 120,
    tetris: 2400,
    flappy: 18,
    tic_tac_toe: 5,
    game_2048: 1024,
    whack_a_mole: 42,
    target_shoot: 85,
    piano_tiles: 156,
    cookie_clicker: 850,
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
                V-Arcade Hub
              </h1>
              <span className="text-[10px] px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold uppercase tracking-widest shadow-md border border-white/20">
                100 Trò Chơi Giải Trí
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-1 max-w-xl">
              Trung tâm game Arcade thế hệ mới tích hợp 100 trò chơi cổ điển, câu đố logic, hành động tốc độ và thể thao tương tác mượt mà!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10 self-end md:self-auto">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 text-white transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
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
              placeholder="Tìm kiếm trong 100 game Arcade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Quick Count Badge */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 shrink-0">
            <span className="text-indigo-400 font-bold">{filteredGames.length}</span> / 100 trò chơi khả dụng
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "all", label: "Tất Cả (100)" },
            { id: "favorites", label: `Yêu Thích (${favoriteGames.length})` },
            { id: "classic", label: "Cổ Điển & Retro" },
            { id: "puzzle", label: "Đố Vui & Puzzle" },
            { id: "action", label: "Hành Động & Arcade" },
            { id: "strategy", label: "Chiến Thuật & Bài" },
            { id: "sports", label: "Thể Thao & Tốc Độ" },
            { id: "arcade", label: "Giải Trí & Âm Nhạc" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30 scale-105"
                  : "bg-[#1d1b26] hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              {cat.id === "favorites" && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 100 Game Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredGames.map((game) => {
          const isFav = favoriteGames.includes(game.id);
          const topScore = highScores[game.id] || 0;

          return (
            <div
              key={game.id}
              onClick={() => {
                setActiveGame(game);
                setGameScore(0);
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
                      Chơi Tương Tác
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
                  <span>{game.plays} lượt chơi</span>
                  <span className="text-zinc-500 font-mono">{game.difficulty}</span>
                </div>

                <button className="w-full py-2 bg-indigo-600/20 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 text-indigo-300 group-hover:text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-indigo-500/30 flex items-center justify-center gap-1.5">
                  <Play className="w-3.5 h-3.5 fill-current" /> CHƠI NGAY
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* GAME MODAL POPUP FOR PLAYING */}
      {activeGame && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-[#14131d] border border-indigo-500/40 rounded-3xl p-6 shadow-2xl relative text-white flex flex-col max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${activeGame.color} text-white`}>
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-indigo-300">{activeGame.title}</h2>
                  <span className="text-xs text-zinc-400">{activeGame.categoryLabel} • {activeGame.difficulty}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveGame(null)}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Đóng (ESC)
              </button>
            </div>

            {/* Game Canvas Container */}
            <div className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-4 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
              {/* PLAYABLE ENGINE 1: SNAKE */}
              {activeGame.id === "snake" && (
                <SnakeGame
                  soundEnabled={soundEnabled}
                  onScoreUpdate={(s) => {
                    setGameScore(s);
                    setHighScores((prev) => ({ ...prev, snake: Math.max(prev.snake || 0, s) }));
                  }}
                />
              )}

              {/* PLAYABLE ENGINE 2: TIC TAC TOE */}
              {activeGame.id === "tic_tac_toe" && (
                <TicTacToeGame />
              )}

              {/* PLAYABLE ENGINE 3: MEMORY MATCH */}
              {activeGame.id === "memory_card" && (
                <MemoryMatchGame />
              )}

              {/* PLAYABLE ENGINE 4: MATH QUIZ */}
              {activeGame.id === "math_quiz" && (
                <MathQuizGame />
              )}

              {/* PLAYABLE ENGINE 5: COOKIE CLICKER */}
              {activeGame.id === "cookie_clicker" && (
                <CookieClickerGame />
              )}

              {/* PLAYABLE ENGINE 6: SLOT MACHINE */}
              {activeGame.id === "slot_machine" && (
                <SlotMachineGame />
              )}

              {/* GENERIC INTERACTIVE GAME SIMULATOR FOR ALL OTHER GAMES */}
              {!["snake", "tic_tac_toe", "memory_card", "math_quiz", "cookie_clicker", "slot_machine"].includes(activeGame.id) && (
                <GenericGameSimulator game={activeGame} />
              )}
            </div>

            {/* Game Instructions & Controls */}
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

/* --- MINI GAME ENGINE 1: SNAKE --- */
const SnakeGame: React.FC<{ soundEnabled: boolean; onScoreUpdate: (s: number) => void }> = ({ onScoreUpdate }) => {
  const [snake, setSnake] = useState<[number, number][]>([[5, 5], [5, 4], [5, 3]]);
  const [food, setFood] = useState<[number, number]>([10, 10]);
  const [dir, setDir] = useState<[number, number]>([0, 1]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const startGame = () => {
    setSnake([[5, 5], [5, 4], [5, 3]]);
    setFood([Math.floor(Math.random() * 15), Math.floor(Math.random() * 15)]);
    setDir([0, 1]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = [prev[0][0] + dir[0], prev[0][1] + dir[1]] as [number, number];

        // Wall collision
        if (head[0] < 0 || head[0] >= 15 || head[1] < 0 || head[1] >= 15) {
          setGameOver(true);
          return prev;
        }

        // Self collision
        for (const part of prev) {
          if (part[0] === head[0] && part[1] === head[1]) {
            setGameOver(true);
            return prev;
          }
        }

        const newSnake = [head, ...prev];
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

    return () => clearInterval(interval);
  }, [isPlaying, gameOver, dir, food, score]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-between w-full px-2 text-xs font-mono">
        <span className="text-emerald-400 font-bold">Điểm số: {score}</span>
        <span className="text-zinc-400">Điều khiển: Nút bấm bên dưới</span>
      </div>

      <div className="grid grid-cols-15 gap-0.5 bg-zinc-900 p-2 rounded-xl border border-white/10 w-64 h-64">
        {Array.from({ length: 225 }).map((_, i) => {
          const r = Math.floor(i / 15);
          const c = i % 15;
          const isSnake = snake.some((p) => p[0] === r && p[1] === c);
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
          onClick={startGame}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg cursor-pointer uppercase"
        >
          {gameOver ? "Chơi Lại" : "Bắt Đầu Chơi"}
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-2 w-36">
          <div />
          <button onClick={() => setDir([-1, 0])} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold">▲</button>
          <div />
          <button onClick={() => setDir([0, -1])} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold">◄</button>
          <button onClick={() => setDir([1, 0])} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold">▼</button>
          <button onClick={() => setDir([0, 1])} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold">►</button>
        </div>
      )}
    </div>
  );
};

/* --- MINI GAME ENGINE 2: TIC TAC TOE --- */
const TicTacToeGame: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<string | null>(null);

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

  const handleClick = (idx: number) => {
    if (board[idx] || winner) return;
    const newBoard = [...board];
    newBoard[idx] = turn;
    setBoard(newBoard);

    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
    } else {
      setTurn(turn === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn("X");
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-xs font-bold text-indigo-300">
        {winner ? (winner === "Tie" ? "Hòa nhau!" : `Chiến thắng: Người chơi ${winner}`) : `Lượt chơi: ${turn}`}
      </div>

      <div className="grid grid-cols-3 gap-2 bg-zinc-900 p-3 rounded-2xl border border-white/10 w-48 h-48">
        {board.map((val, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="w-12 h-12 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xl font-black text-indigo-300 flex items-center justify-center cursor-pointer transition-all"
          >
            {val}
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer"
      >
        Làm Mới Bàn Cờ
      </button>
    </div>
  );
};

/* --- MINI GAME ENGINE 3: MEMORY MATCH --- */
const MemoryMatchGame: React.FC = () => {
  const ICONS = ["🎮", "🚀", "💎", "⭐", "🔥", "⚽"];
  const [cards, setCards] = useState<{ id: number; icon: string; flipped: boolean; matched: boolean }[]>([]);
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
        onClick={initGame}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl cursor-pointer"
      >
        Chia Bài Lại
      </button>
    </div>
  );
};

/* --- MINI GAME ENGINE 4: MATH QUIZ --- */
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

    if (parseInt(userAns) === correct) {
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
        <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl cursor-pointer">
          Gửi
        </button>
      </form>
    </div>
  );
};

/* --- MINI GAME ENGINE 5: COOKIE CLICKER --- */
const CookieClickerGame: React.FC = () => {
  const [cookies, setCookies] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-sm font-bold text-amber-400">Tổng Số Bánh Bánh Bánh: {cookies}</div>
      <button
        onClick={() => setCookies((c) => c + 1)}
        className="w-24 h-24 rounded-full bg-amber-600 hover:bg-amber-500 text-4xl flex items-center justify-center shadow-2xl transition-transform active:scale-90 cursor-pointer border-4 border-amber-300"
      >
        🍪
      </button>
      <span className="text-[11px] text-zinc-400">Chạm liên tục để nướng bánh vàng!</span>
    </div>
  );
};

/* --- MINI GAME ENGINE 6: SLOT MACHINE --- */
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
