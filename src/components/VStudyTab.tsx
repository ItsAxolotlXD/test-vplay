import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Users, 
  User, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Send, 
  Play, 
  RefreshCcw, 
  MessageSquare, 
  BookOpenCheck,
  ChevronRight,
  Flame,
  Zap,
  GraduationCap
} from "lucide-react";

// Web Audio API Sound Synthesizer for immersive educational cues
const playSynthSound = (type: "correct" | "incorrect" | "join" | "tick" | "complete") => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "correct") {
      // Arpeggio up
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === "incorrect") {
      // Dull low slide down
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
      osc.frequency.setValueAtTime(147, ctx.currentTime + 0.2); // D3
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === "join") {
      // Friendly dual-tone chime
      osc.type = "triangle";
      osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
      osc.frequency.setValueAtTime(440.00, ctx.currentTime + 0.12); // A4
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === "tick") {
      // Subtle clock click
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === "complete") {
      // Grand celebratory sound
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc.frequency.setValueAtTime(554, ctx.currentTime + 0.1); // C#5
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.2); // E5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    }
  } catch (err) {
    console.warn("Audio Context is blocked or unsupported", err);
  }
};

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
  grade: string;
  questions: Question[];
}

const subjectsData: Subject[] = [
  {
    id: "math",
    name: "Môn Toán Học",
    color: "from-blue-600 to-cyan-500",
    icon: "📐",
    grade: "Lớp 12 - THPT",
    questions: [
      {
        id: 1,
        question: "Tìm tập xác định của hàm số y = log₂(x - 3).",
        options: [
          "D = (3; +∞)",
          "D = [3; +∞)",
          "D = ℝ \\ {3}",
          "D = (-∞; 3)"
        ],
        correctIndex: 0,
        explanation: "Điều kiện xác định của hàm số logarit log_a(u(x)) là u(x) > 0. Do đó, x - 3 > 0 ⇔ x > 3. Vậy tập xác định của hàm số là D = (3; +∞)."
      },
      {
        id: 2,
        question: "Cho khối chóp có diện tích đáy B = 6 và chiều cao h = 4. Thể tích khối chóp đã cho bằng bao nhiêu?",
        options: [
          "V = 24",
          "V = 8",
          "V = 12",
          "V = 16"
        ],
        correctIndex: 1,
        explanation: "Thể tích khối chóp được tính bằng công thức chuẩn: V = 1/3 * B * h = 1/3 * 6 * 4 = 8."
      },
      {
        id: 3,
        question: "Tìm họ nguyên hàm của hàm số f(x) = 3x² + 1.",
        options: [
          "F(x) = x³ + x + C",
          "F(x) = 6x + C",
          "F(x) = 3x³ + x + C",
          "F(x) = x³ + C"
        ],
        correctIndex: 0,
        explanation: "Nguyên hàm của 3x² là x³, nguyên hàm của 1 là x. Vậy ∫(3x² + 1)dx = x³ + x + C."
      }
    ]
  },
  {
    id: "literature",
    name: "Ngữ Văn",
    color: "from-amber-600 to-orange-500",
    icon: "✍️",
    grade: "Lớp 12 - THPT",
    questions: [
      {
        id: 1,
        question: "Tác phẩm 'Vợ chồng A Phủ' của nhà văn Tô Hoài viết về cuộc sống của người dân ở vùng nào?",
        options: [
          "Tây Bắc",
          "Tây Nguyên",
          "Đông Bắc",
          "Nam Bộ"
        ],
        correctIndex: 0,
        explanation: "Truyện ngắn 'Vợ chồng A Phủ' là kết quả của chuyến đi thực tế của Tô Hoài cùng bộ đội vào giải phóng Tây Bắc năm 1952. Tác phẩm khắc họa sâu sắc số phận đau khổ và sức sống mãnh liệt của đồng bào nghèo miền núi Tây Bắc dưới ách thống trị tàn bạo của phong kiến và thực dân."
      },
      {
        id: 2,
        question: "Nhân vật Huấn Cao trong truyện ngắn 'Chữ người tử tù' (Nguyễn Tuân) được xây dựng dựa trên nguyên mẫu lịch sử nào?",
        options: [
          "Cao Bá Quát",
          "Nguyễn Trãi",
          "Chu Văn An",
          "Phan Bội Châu"
        ],
        correctIndex: 0,
        explanation: "Nhân vật Huấn Cao được Nguyễn Tuân xây dựng lấy cảm hứng từ nguyên mẫu Cao Bá Quát - một danh sĩ kiệt xuất thời nhà Nguyễn nổi tiếng với tài viết chữ đẹp như rồng bay phượng múa cùng khí phách hiên ngang chống lại triều đình phong kiến mục nát."
      },
      {
        id: 3,
        question: "Ai là tác giả của bài thơ 'Tây Tiến' - một trong những thi phẩm xuất sắc nhất về người lính thời kỳ kháng chiến chống Pháp?",
        options: [
          "Quang Dũng",
          "Chính Hữu",
          "Tố Hữu",
          "Nguyễn Khoa Điềm"
        ],
        correctIndex: 0,
        explanation: "Bài thơ 'Tây Tiến' do nhà thơ chiến sĩ Quang Dũng sáng tác năm 1948 tại Phù Lưu Chanh, ghi lại những kỷ niệm hào hùng, lãng mạn nhưng cũng đầy bi tráng của đoàn quân Tây Tiến."
      }
    ]
  },
  {
    id: "english",
    name: "Tiếng Anh",
    color: "from-purple-600 to-indigo-500",
    icon: "🇬🇧",
    grade: "Đề ôn luyện quốc gia",
    questions: [
      {
        id: 1,
        question: "If I _______ you, I would study harder for the national high school graduation exam.",
        options: [
          "am",
          "was",
          "were",
          "had been"
        ],
        correctIndex: 2,
        explanation: "Đây là câu điều kiện loại 2 (giả thiết trái ngược với thực tế ở hiện tại). Cấu trúc: If + S + V2/ed (đối với động từ tobe, dùng 'were' cho tất cả các ngôi)."
      },
      {
        id: 2,
        question: "She has been working as a teacher of English in this high school _______ 2018.",
        options: [
          "for",
          "since",
          "in",
          "ago"
        ],
        correctIndex: 1,
        explanation: "Thì Hiện tại hoàn thành tiếp diễn (has been working) diễn tả hành động bắt đầu từ quá khứ và kéo dài liên tục đến hiện tại. Ta dùng 'since' đi kèm với một mốc thời gian cụ thể (2018)."
      },
      {
        id: 3,
        question: "The more books you read, the _______ knowledge you will gain.",
        options: [
          "more",
          "much",
          "most",
          "many"
        ],
        correctIndex: 0,
        explanation: "Cấu trúc so sánh kép (Double Comparative): The + comparative adj + S + V, the + comparative adj + S + V. 'More' là dạng so sánh hơn của 'much/many' để bổ nghĩa cho danh từ không đếm được 'knowledge'."
      }
    ]
  },
  {
    id: "physics",
    name: "Vật Lý",
    color: "from-rose-600 to-pink-500",
    icon: "⚡",
    grade: "Lớp 12 - THPT",
    questions: [
      {
        id: 1,
        question: "Khi vật dao động điều hòa tự do bằng con lắc lò xo, chu kì dao động T được tính bằng công thức nào dưới đây?",
        options: [
          "T = 2π √(m/k)",
          "T = 2π √(k/m)",
          "T = 2π √(g/l)",
          "T = 2π √(l/g)"
        ],
        correctIndex: 0,
        explanation: "Chu kì dao động điều hòa của con lắc lò xo lý tưởng là T = 2π √(m/k), phụ thuộc vào khối lượng vật nhỏ m và độ cứng lò xo k."
      },
      {
        id: 2,
        question: "Trong chân không, sóng vô tuyến có bước sóng nằm trong khoảng từ 10 m đến 100 m thuộc dải sóng nào?",
        options: [
          "Sóng dài",
          "Sóng trung",
          "Sóng ngắn",
          "Sóng cực ngắn"
        ],
        correctIndex: 2,
        explanation: "Quy ước bước sóng của sóng vô tuyến: Sóng ngắn có bước sóng từ 10m đến 100m. Có năng lượng cao, phản xạ rất tốt giữa tầng điện ly và mặt đất giúp truyền tin đi xa."
      },
      {
        id: 3,
        question: "Hiện tượng quang điện ngoài là hiện tượng ánh sáng làm bật các electron ra khỏi bề mặt của chất nào?",
        options: [
          "Chất bán dẫn",
          "Kim loại",
          "Chất điện phân",
          "Chất khí"
        ],
        correctIndex: 1,
        explanation: "Hiện tượng quang điện ngoài (quang điện thường) xảy ra khi chiếu chùm sáng có bước sóng thích hợp vào bề mặt kim loại, làm bứt các electron liên kết tự do ra khỏi bề mặt kim loại đó."
      }
    ]
  },
  {
    id: "chemistry",
    name: "Hóa Học",
    color: "from-emerald-600 to-teal-500",
    icon: "🧪",
    grade: "Lớp 12 - THPT",
    questions: [
      {
        id: 1,
        question: "Kim loại nào sau đây là kim loại dẻo nhất, có thể dát siêu mỏng đến mức ánh sáng có thể lọt qua?",
        options: [
          "Vàng (Au)",
          "Bạc (Ag)",
          "Đồng (Cu)",
          "Nhôm (Al)"
        ],
        correctIndex: 0,
        explanation: "Vàng là kim loại dẻo nhất trong tất cả các kim loại. Một lượng vàng nhỏ chỉ bằng hạt đậu có thể dát thành tấm mỏng diện tích hàng mét vuông."
      },
      {
        id: 2,
        question: "Sắt (III) oxit có công thức hóa học chính xác là gì?",
        options: [
          "FeO",
          "Fe₂O₃",
          "Fe₃O₄",
          "Fe(OH)₃"
        ],
        correctIndex: 1,
        explanation: "Sắt (III) oxit có công thức hóa học là Fe₂O₃, là chất rắn màu đỏ nâu không tan trong nước, thường xuất hiện dưới dạng quặng hematit."
      },
      {
        id: 3,
        question: "Chất khí nào sinh ra trong quá trình đốt nhiên liệu hóa thạch gây ra hiện tượng hiệu ứng nhà kính mạnh nhất?",
        options: [
          "CO₂ (Cacbon điôxit)",
          "O₂ (Oxi)",
          "N₂ (Nitơ)",
          "CO (Cacbon mônôxit)"
        ],
        correctIndex: 0,
        explanation: "Khí CO₂ sinh ra từ đốt than đá, dầu mỏ là nhân tố chính giữ bức xạ hồng ngoại của mặt trời lại khí quyển, tạo ra hiệu ứng nhà kính làm trái đất nóng lên toàn cầu."
      }
    ]
  },
  {
    id: "biology",
    name: "Sinh Học",
    color: "from-green-600 to-emerald-400",
    icon: "🍀",
    grade: "Lớp 12 - THPT",
    questions: [
      {
        id: 1,
        question: "Ở sinh vật nhân thực, phần lớn quá trình tự nhân đôi ADN diễn ra ở cấu trúc nào trong tế bào?",
        options: [
          "Nhân tế bào",
          "Tế bào chất",
          "Ribôxôm",
          "Màng sinh chất"
        ],
        correctIndex: 0,
        explanation: "Ở tế bào nhân thực, ADN chủ yếu cuộn xoắn nằm trên nhiễm sắc thể bên trong nhân. Do đó, quá trình nhân đôi ADN diễn ra chủ yếu ở nhân tế bào tại pha S của chu kỳ tế bào."
      },
      {
        id: 2,
        question: "Loại axit nucleic nào đảm nhận vai trò vận chuyển axit amin tương ứng tới ribôxôm trong quá trình dịch mã?",
        options: [
          "tARN (ARN vận chuyển)",
          "mARN (ARN thông tin)",
          "rARN (ARN ribôxôm)",
          "ADN"
        ],
        correctIndex: 0,
        explanation: "tARN (transfer RNA) có cấu trúc một đầu mang bộ ba đối mã (anticodon), một đầu liên kết axit amin đặc hiệu để đưa chúng tới khớp mã trên ribôxôm."
      }
    ]
  },
  {
    id: "history",
    name: "Lịch Sử",
    color: "from-red-600 to-rose-500",
    icon: "📜",
    grade: "Lớp 12 - THPT",
    questions: [
      {
        id: 1,
        question: "Sự kiện lịch sử lẫy lừng nào đã đánh dấu chấm dứt hoàn toàn ách đô hộ kéo dài hơn 80 năm của thực dân Pháp tại Việt Nam?",
        options: [
          "Chiến dịch Điện Biên Phủ năm 1954",
          "Cách mạng tháng Tám năm 1945",
          "Ký kết Hiệp định Giơ-ne-vơ năm 1954",
          "Chiến dịch Hồ Chí Minh lịch sử năm 1975"
        ],
        correctIndex: 2,
        explanation: "Việc ký kết thành công Hiệp định Giơ-ne-vơ năm 1954 về chấm dứt chiến tranh, lập lại hòa bình ở Đông Dương chính là văn bản pháp lý quốc tế buộc thực dân Pháp rút hết quân, chấm dứt hoàn toàn ách thống trị."
      },
      {
        id: 2,
        question: "Hội nghị thành lập Đảng Cộng sản Việt Nam đầu năm 1930 dưới sự chủ trì của lãnh tụ Nguyễn Ái Quốc đã diễn ra tại địa điểm nào?",
        options: [
          "Cửu Long, Hương Cảng (Trung Quốc)",
          "Quảng Châu (Trung Quốc)",
          "Cao Bằng (Việt Nam)",
          "Tuyên Quang (Việt Nam)"
        ],
        correctIndex: 0,
        explanation: "Hội nghị hợp nhất các tổ chức Cộng sản được tổ chức bí mật tại Cửu Long, Hương Cảng (nay là Hồng Kông, Trung Quốc) từ ngày 6/1/1930 đến ngày 7/2/1930."
      }
    ]
  },
  {
    id: "geography",
    name: "Địa Lý",
    color: "from-teal-600 to-sky-500",
    icon: "🗺️",
    grade: "Lớp 12 - THPT",
    questions: [
      {
        id: 1,
        question: "Đất feralit vùng đồi núi thấp là nhóm đất đặc trưng nổi bật nhất của đới cảnh quan và khí hậu nào nước ta?",
        options: [
          "Nhiệt đới ẩm gió mùa",
          "Ôn đới lục địa",
          "Cận nhiệt đới gió mùa",
          "Xích đạo nửa khô hạn"
        ],
        correctIndex: 0,
        explanation: "Trong điều kiện khí hậu nhiệt đới ẩm gió mùa nóng ẩm, quá trình phong hóa diễn ra rất mạnh tạo thành lớp đất feralit dồi dào oxit sắt Fe (màu đỏ) và nhôm Al (màu vàng)."
      },
      {
        id: 2,
        question: "Điểm cực Bắc phần đất liền của nước Việt Nam chúng ta nằm ở vĩ độ nào và thuộc địa phận tỉnh nào?",
        options: [
          "Lũng Cú, Đồng Văn (Hà Giang)",
          "Đất Mũi, Ngọc Hiển (Cà Mau)",
          "Sín Thầu, Mường Nhé (Điện Biên)",
          "Vạn Thạnh, Vạn Ninh (Khánh Hòa)"
        ],
        correctIndex: 0,
        explanation: "Điểm cực Bắc đất liền của Việt Nam nằm ở xã Lũng Cú, huyện Đồng Văn, tỉnh Hà Giang, tọa độ vĩ độ 23°23'B."
      }
    ]
  }
];

// Mock database of companion high school students who can join the study room
interface Companion {
  id: string;
  name: string;
  avatar: string;
  status: "joined" | "solving" | "done" | "idle";
  currentQuestion: number;
  score: number;
  color: string;
}

const mockCompanions: Companion[] = [
  { id: "comp1", name: "Lâm Tiến Dũng", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80", status: "idle", currentQuestion: 0, score: 0, color: "border-blue-500 text-blue-400" },
  { id: "comp2", name: "Nguyễn Mai Chi", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", status: "idle", currentQuestion: 0, score: 0, color: "border-pink-500 text-pink-400" },
  { id: "comp3", name: "Đỗ Quốc Bảo", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", status: "idle", currentQuestion: 0, score: 0, color: "border-emerald-500 text-emerald-400" },
  { id: "comp4", name: "Trần Bảo Trâm", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", status: "idle", currentQuestion: 0, score: 0, color: "border-purple-500 text-purple-400" }
];

const mockChatMessages = [
  "Câu này lý thuyết lừa gớm nha cả nhà!",
  "Đề thi thử THPT Quốc gia có khác, nhức não ghê",
  "Tớ vừa vượt qua câu khó nhất rồi, yeah!",
  "Anh em làm tới câu mấy rồi? Đợi tớ với!",
  "Cố lên các sĩ tử ơi! 2k8, 2k9 quyết tâm đỗ nguyện vọng 1!",
  "Toán học làm mình tỉnh ngủ hẳn ra haha",
  "Năm nay đề minh họa cấu trúc mới khó phết",
  "Mọi người chọn đáp án nào thế? Gợi ý chút đi"
];

const userQuickChats = [
  "Chào cả nhà nhé! Cùng học tốt!",
  "Câu này hóc búa quá bà con ơi!",
  "Tớ vừa hoàn thành xong rồi, điểm cao lắm!",
  "Đề này trúng tủ tớ luôn rồi haha",
  "Cố lên các sĩ tử ơi, sắp về đích rồi!"
];

interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  message: string;
  timestamp: string;
  isMe: boolean;
}

interface VStudyTabProps {
  onBack: () => void;
}

export default function VStudyTab({ onBack }: VStudyTabProps) {
  // Global student profile stats stored in localStorage
  const [xp, setXp] = useState<number>(() => {
    return Number(localStorage.getItem("vstudy_xp") || "120");
  });
  const [level, setLevel] = useState<number>(() => {
    return Number(localStorage.getItem("vstudy_level") || "1");
  });
  const [streak, setStreak] = useState<number>(() => {
    return Number(localStorage.getItem("vstudy_streak") || "3");
  });
  const [completedQuizzes, setCompletedQuizzes] = useState<number>(() => {
    return Number(localStorage.getItem("vstudy_completed") || "4");
  });

  // State
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [quizTimer, setQuizTimer] = useState<number>(180); // 3 minutes per session
  const [quizResults, setQuizResults] = useState<{ correct: number; wrong: number; scoreGained: number } | null>(null);

  // Companion Collaboration lists
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [chatList, setChatList] = useState<ChatMessage[]>([]);
  const [customChatMessage, setCustomChatMessage] = useState<string>("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const companionActionRef = useRef<NodeJS.Timeout | null>(null);

  // Save profile stats on changes
  useEffect(() => {
    localStorage.setItem("vstudy_xp", xp.toString());
    localStorage.setItem("vstudy_level", level.toString());
    localStorage.setItem("vstudy_streak", streak.toString());
    localStorage.setItem("vstudy_completed", completedQuizzes.toString());
  }, [xp, level, streak, completedQuizzes]);

  // Handle active countdown timer
  useEffect(() => {
    if (isQuizActive && quizTimer > 0 && !quizResults) {
      timerRef.current = setTimeout(() => {
        setQuizTimer((prev) => {
          if (prev <= 1) {
            handleCompleteQuiz();
            return 0;
          }
          if (prev % 10 === 0) playSynthSound("tick");
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isQuizActive, quizTimer, quizResults]);

  // Handle companion simulation loops when Solo Study starts
  useEffect(() => {
    if (isQuizActive && selectedSubject && !quizResults) {
      // 1. Trigger initial peer joins
      const initialJoinTimeout = setTimeout(() => {
        // Pick 2 random peers from catalog
        const randomizedPeers = [...mockCompanions]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map((c) => ({
            ...c,
            status: "joined" as const,
            currentQuestion: 1,
            score: 0
          }));

        setCompanions(randomizedPeers);
        playSynthSound("join");

        // Add arrival system log
        const firstPeer = randomizedPeers[0];
        setChatList((prev) => [
          ...prev,
          {
            id: `sys-${Date.now()}`,
            senderName: "Hệ thống V-Study",
            senderAvatar: "",
            message: `⚡ ${randomizedPeers.map(p => p.name).join(", ")} đã tham gia phòng học cùng bạn!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false
          }
        ]);

        // Trigger greeting chat messages shortly
        setTimeout(() => {
          const greetings = [
            "Hi cả nhà! Chúc mọi người ôn thi tốt nhé!",
            "Chào bạn học cùng nha! Chiến thôi!",
            "Môn này là tủ của mình luôn, học chung cho vui nhé!"
          ];
          setChatList((prev) => [
            ...prev,
            {
              id: `greet-${Date.now()}`,
              senderName: firstPeer.name,
              senderAvatar: firstPeer.avatar,
              message: greetings[Math.floor(Math.random() * greetings.length)],
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isMe: false
            }
          ]);
        }, 1500);

      }, 1200);

      // 2. Continuous Companion solving progress simulation
      companionActionRef.current = setInterval(() => {
        setCompanions((prevCompanions) => {
          if (prevCompanions.length === 0) return prevCompanions;

          return prevCompanions.map((comp) => {
            if (comp.status === "done") return comp;

            // Random chance of progressing or changing status
            const rand = Math.random();
            const totalQuestions = selectedSubject.questions.length;

            if (rand > 0.65) {
              const currentQ = comp.currentQuestion;
              const nextQ = currentQ + 1;
              const isCorrect = Math.random() > 0.35; // 65% correct rate for peers
              const nextScore = isCorrect ? comp.score + 10 : comp.score;

              if (nextQ > totalQuestions) {
                // Done solving
                return {
                  ...comp,
                  status: "done",
                  score: nextScore
                };
              } else {
                // Notify via chat on milestone progress occasionally
                if (Math.random() > 0.7) {
                  const comments = [
                    `Vừa qua câu ${currentQ} rồi, may quá!`,
                    `Câu ${currentQ} đáp án lừa thật sự`,
                    `Xong câu ${currentQ} rồi, tăng tốc thôiii`
                  ];
                  setChatList((prev) => [
                    ...prev,
                    {
                      id: `progress-${Date.now()}-${comp.id}`,
                      senderName: comp.name,
                      senderAvatar: comp.avatar,
                      message: comments[Math.floor(Math.random() * comments.length)],
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      isMe: false
                    }
                  ]);
                }

                return {
                  ...comp,
                  currentQuestion: nextQ,
                  score: nextScore,
                  status: "solving"
                };
              }
            }
            return comp;
          });
        });

        // Occasional companion casual chatting
        if (Math.random() > 0.8) {
          setCompanions((activePeers) => {
            if (activePeers.length > 0) {
              const speaker = activePeers[Math.floor(Math.random() * activePeers.length)];
              const randomMsg = mockChatMessages[Math.floor(Math.random() * mockChatMessages.length)];
              setChatList((prev) => [
                ...prev,
                {
                  id: `chat-${Date.now()}`,
                  senderName: speaker.name,
                  senderAvatar: speaker.avatar,
                  message: randomMsg,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  isMe: false
                }
              ]);
            }
            return activePeers;
          });
        }

      }, 4000);

      return () => {
        clearTimeout(initialJoinTimeout);
        if (companionActionRef.current) clearInterval(companionActionRef.current);
      };
    }
  }, [isQuizActive, selectedSubject, quizResults]);

  // Start Study Room handler
  const handleStartQuiz = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsQuizActive(true);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserScore(0);
    setQuizTimer(180);
    setQuizResults(null);
    setCompanions([]);
    setChatList([
      {
        id: "sys-welcome",
        senderName: "V-Study Bot",
        senderAvatar: "",
        message: `📚 Chào mừng bạn đến với phòng tự học môn ${subject.name}! Chế độ đồng hành cùng các sĩ tử THPT khác đã được khởi động. Hãy trả lời chính xác các câu hỏi để ghi danh bảng vàng.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      }
    ]);
  };

  // Option select handler
  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  // Submit Answer grading
  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted || !selectedSubject) return;

    setIsAnswerSubmitted(true);
    const correctIdx = selectedSubject.questions[currentQuestionIndex].correctIndex;

    if (selectedOption === correctIdx) {
      setUserScore((prev) => prev + 10);
      playSynthSound("correct");
      
      // Update local storage XP and potentially levels
      setXp((prev) => {
        const nextXp = prev + 15;
        if (nextXp >= level * 100) {
          setLevel((l) => l + 1);
          return nextXp - (level * 100);
        }
        return nextXp;
      });
      setStreak((prev) => prev + 1);
    } else {
      playSynthSound("incorrect");
      setStreak(0);
    }
  };

  // Proceed to next question
  const handleNextQuestion = () => {
    if (!selectedSubject) return;

    if (currentQuestionIndex + 1 < selectedSubject.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      handleCompleteQuiz();
    }
  };

  // Complete Quiz handler
  const handleCompleteQuiz = () => {
    if (!selectedSubject) return;
    playSynthSound("complete");

    const totalQuestions = selectedSubject.questions.length;
    const correctAnswers = userScore / 10;
    const wrongAnswers = totalQuestions - correctAnswers;
    const totalXpAwarded = userScore * 2 + (correctAnswers === totalQuestions ? 50 : 0);

    setQuizResults({
      correct: correctAnswers,
      wrong: wrongAnswers,
      scoreGained: totalXpAwarded
    });

    setCompletedQuizzes((prev) => prev + 1);
    setXp((prev) => {
      const nextXp = prev + totalXpAwarded;
      const targetXp = level * 100;
      if (nextXp >= targetXp) {
        setLevel((l) => l + 1);
        return nextXp - targetXp;
      }
      return nextXp;
    });

    // Final chat celebration log
    setChatList((prev) => [
      ...prev,
      {
        id: `sys-ended-${Date.now()}`,
        senderName: "Hệ thống V-Study",
        senderAvatar: "",
        message: `🏆 Sĩ tử đã hoàn thành bài tập môn ${selectedSubject.name} đạt ${correctAnswers}/${totalQuestions} điểm tối đa!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      }
    ]);
  };

  // Send interactive chat messages
  const handleSendChat = (msgText: string) => {
    if (!msgText.trim()) return;

    const newMsg: ChatMessage = {
      id: `mychat-${Date.now()}`,
      senderName: "Bạn (Sĩ tử THPT)",
      senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      message: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setChatList((prev) => [...prev, newMsg]);
    setCustomChatMessage("");

    // Make a peer react dynamically to the user's chat message
    setTimeout(() => {
      if (companions.length > 0) {
        const reactor = companions[Math.floor(Math.random() * companions.length)];
        
        let reply = "Cố lên nha cả nhà!";
        if (msgText.includes("Chào") || msgText.includes("hi") || msgText.includes("hello")) {
          reply = `Chào bạn ${reactor.name} nhé! Chúc học tốt!`;
        } else if (msgText.includes("khó") || msgText.includes("hóc búa")) {
          reply = "Đúng vậy đó, câu hỏi thiết kế rất thông minh và thực tế bám sát THPT luôn.";
        } else if (msgText.includes("xong") || msgText.includes("hoàn thành")) {
          reply = "Bái phục bạn luôn! Đỉnh của chóp!";
        } else if (msgText.includes("tủ")) {
          reply = "Uầy sướng thế! Tớ thì đang toát mồ hôi hột đây.";
        }

        setChatList((prev) => [
          ...prev,
          {
            id: `reply-${Date.now()}`,
            senderName: reactor.name,
            senderAvatar: reactor.avatar,
            message: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false
          }
        ]);
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-6">
      
      {/* 1. Header & Stats Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white cursor-pointer transition-colors"
              title="Quay lại"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-6.5 h-6.5 text-[#cc1827] animate-bounce" />
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                V-Study THPT
              </h1>
            </div>
          </div>
          <p className="text-xs text-zinc-400 md:pl-12">
            Hệ thống giải bài tập, ôn luyện 8 môn THPT quốc gia cực đỉnh. Làm bài cá nhân nhưng luôn có cộng đồng học sinh học cùng trong thời gian thực!
          </p>
        </div>

        {/* Global User Stats Cards */}
        <div className="flex flex-wrap items-center gap-3 bg-zinc-900/60 p-2.5 rounded-2xl border border-white/5 shadow-md">
          {/* Level Progress */}
          <div className="px-3 py-1.5 bg-zinc-950 rounded-xl flex items-center gap-2 border border-white/5">
            <div className="w-7 h-7 rounded-lg bg-[#cc1827]/10 border border-[#cc1827]/30 flex items-center justify-center text-xs font-black text-[#cc1827]">
              Lvl {level}
            </div>
            <div className="text-left">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Kinh Nghiệm</p>
              <div className="flex items-center gap-1.5">
                <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#cc1827]" style={{ width: `${(xp / (level * 100)) * 100}%` }} />
                </div>
                <span className="text-[10px] text-white/90 font-mono font-bold">{xp}/{level * 100}</span>
              </div>
            </div>
          </div>

          {/* Daily Streak */}
          <div className="px-3 py-1.5 bg-zinc-950 rounded-xl flex items-center gap-2.5 border border-white/5">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
            <div className="text-left">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Chuỗi Ngày</p>
              <p className="text-xs font-black text-white">{streak} Ngày Liên Tiếp</p>
            </div>
          </div>

          {/* Total Quizzes Done */}
          <div className="px-3 py-1.5 bg-zinc-950 rounded-xl flex items-center gap-2.5 border border-white/5">
            <Award className="w-5 h-5 text-emerald-400" />
            <div className="text-left">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Bài Đã Học</p>
              <p className="text-xs font-black text-white">{completedQuizzes} Đề Luyện</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN ACTIVE STUDY AREA */}
      {!isQuizActive ? (
        <div className="space-y-6 text-left">
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-red-500" />
            <span>Chọn Môn Học Để Khởi Động Phòng Học</span>
          </h2>

          {/* Grid of Subjects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subjectsData.map((subj) => (
              <div
                key={subj.id}
                onClick={() => handleStartQuiz(subj)}
                className="group relative rounded-2xl border border-white/5 bg-zinc-900/30 overflow-hidden hover:border-[#cc1827]/40 hover:bg-zinc-900/60 p-5 transition-all duration-300 cursor-pointer flex flex-col justify-between h-44 shadow-lg hover:shadow-[0_8px_30px_rgba(204,24,39,0.08)]"
              >
                {/* Subject Gradient Highlight */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${subj.color}`} />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl filter drop-shadow-md">{subj.icon}</span>
                    <span className="text-[10px] font-black uppercase bg-white/5 text-zinc-400 px-2 py-0.5 rounded-full border border-white/5">
                      {subj.grade}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white group-hover:text-[#cc1827] transition-colors">
                    {subj.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium font-sans">
                    Làm bài trắc nghiệm mô phỏng, tích lũy điểm thi thử THPT cực chuẩn.
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-zinc-500 group-hover:text-white transition-all mt-4 pt-2 border-t border-white/5">
                  <span>{subj.questions.length} Câu Hỏi Khảo Sát</span>
                  <div className="flex items-center gap-1 text-[#cc1827]">
                    <span>Bắt đầu</span>
                    <Play className="w-3.5 h-3.5 fill-[#cc1827] text-[#cc1827]" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Educational Guidelines */}
          <div className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-3xl border border-white/5 space-y-3 mt-6">
            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>Chế độ Phòng Đồng Hành THPT (Solo-Collaborative Study)</span>
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Khi bạn khởi động học ở bất cứ môn học nào, hệ thống <strong>V-Study</strong> sẽ ngay lập tức ghép phòng ngẫu nhiên bạn với các học sinh THPT khác đang online ở khắp các tỉnh thành. Các học sinh đồng hành sẽ cùng bạn giải bài, hiện tiến trình làm bài ở thời gian thực và trò chuyện khích lệ nhau giải các câu hỏi học búa. Hãy cùng thi đua đạt kết quả cao nhất!
            </p>
          </div>
        </div>
      ) : (
        /* QUIZ LOBBY & CLASSROOM ACTIVE SYSTEM */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT AREA (COL-SPAN 8): QUIZ ENGINE & EXPLANATIONS */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Top Stats of Active Room */}
            <div className="p-4 bg-zinc-900/60 rounded-2xl border border-white/5 flex flex-wrap items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedSubject?.icon}</span>
                <div className="text-left">
                  <h3 className="text-sm font-black text-white">{selectedSubject?.name}</h3>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">{selectedSubject?.grade}</p>
                </div>
              </div>

              {/* Timer Progress */}
              <div className="flex items-center gap-2 bg-black/40 px-3.5 py-1.5 rounded-xl border border-white/5">
                <Clock className="w-4 h-4 text-red-500 animate-pulse" />
                <span className="text-xs font-mono font-black text-white">
                  {Math.floor(quizTimer / 60)}:{(quizTimer % 60).toString().padStart(2, "0")}
                </span>
              </div>

              {/* Back to lobby */}
              <button
                onClick={() => {
                  setIsQuizActive(false);
                  setCompanions([]);
                }}
                className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl text-[11px] font-bold transition-all cursor-pointer"
              >
                Hủy Học Nhóm
              </button>
            </div>

            {/* QUIZ COMPLETION / RESULTS VIEW */}
            {quizResults ? (
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/5 rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Cực Kỳ Xuất Sắc!</h2>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                    Bạn đã bền bỉ vượt qua tất cả bài tập thử thách môn {selectedSubject?.name}. Kết quả học nhóm đã được lưu trữ vào hệ thống Vplay.
                  </p>
                </div>

                {/* Score breakdown metrics */}
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto py-4">
                  <div className="bg-zinc-950 p-3.5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Đúng</p>
                    <p className="text-xl font-black text-white mt-1">{quizResults.correct} Câu</p>
                  </div>
                  <div className="bg-zinc-950 p-3.5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Sai</p>
                    <p className="text-xl font-black text-white mt-1">{quizResults.wrong} Câu</p>
                  </div>
                  <div className="bg-zinc-950 p-3.5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">XP Cộng</p>
                    <p className="text-xl font-black text-white mt-1">+{quizResults.scoreGained} XP</p>
                  </div>
                </div>

                {/* Companion scoreboard comparison */}
                <div className="bg-zinc-950/60 p-4 rounded-2xl border border-white/5 text-left space-y-3">
                  <p className="text-xs font-black text-white uppercase tracking-wider text-center border-b border-white/5 pb-2">
                    Bảng Điểm Phòng Học Chung
                  </p>
                  <div className="space-y-2.5">
                    {/* User */}
                    <div className="flex items-center justify-between text-xs bg-red-950/20 border border-red-950/40 p-2 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#cc1827] flex items-center justify-center font-bold text-white text-[10px]">TA</div>
                        <span className="font-bold text-white">Bạn (Sĩ tử THPT)</span>
                      </div>
                      <span className="font-mono font-black text-[#cc1827]">{userScore} Điểm</span>
                    </div>

                    {/* Companions */}
                    {companions.map((comp) => (
                      <div key={comp.id} className="flex items-center justify-between text-xs p-2 bg-zinc-900 rounded-xl">
                        <div className="flex items-center gap-2">
                          <img src={comp.avatar} alt={comp.name} className="w-6 h-6 rounded-full object-cover" />
                          <span className="font-medium text-zinc-300">{comp.name}</span>
                        </div>
                        <span className="font-mono font-black text-zinc-400">{comp.score} Điểm</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (selectedSubject) handleStartQuiz(selectedSubject);
                    }}
                    className="px-6 py-2.5 bg-[#cc1827] hover:bg-[#cc1827]/90 text-white font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2"
                  >
                    <RefreshCcw className="w-4 h-4" /> Làm đề mới
                  </button>
                  <button
                    onClick={() => {
                      setIsQuizActive(false);
                      setSelectedSubject(null);
                      setCompanions([]);
                    }}
                    className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Về Trang Chủ
                  </button>
                </div>
              </div>
            ) : (
              /* QUIZ CORE COMPONENT */
              selectedSubject && (
                <div className="bg-zinc-900/40 rounded-3xl border border-white/5 p-6 space-y-6 shadow-xl text-left">
                  {/* Progress Indicators */}
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
                    <span>CÂU HỎI {currentQuestionIndex + 1}/{selectedSubject.questions.length}</span>
                    <span className="text-[#cc1827] bg-[#cc1827]/10 px-2 py-0.5 rounded-full border border-[#cc1827]/20">
                      Đạt: {userScore} điểm
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / selectedSubject.questions.length) * 100}%` }}
                    />
                  </div>

                  {/* Question Body */}
                  <div className="py-2">
                    <h2 className="text-base md:text-lg font-black text-white leading-relaxed">
                      {selectedSubject.questions[currentQuestionIndex].question}
                    </h2>
                  </div>

                  {/* Options List */}
                  <div className="space-y-3">
                    {selectedSubject.questions[currentQuestionIndex].options.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrectAnswer = selectedSubject.questions[currentQuestionIndex].correctIndex === idx;

                      let btnStyle = "bg-zinc-950/40 border-white/5 hover:bg-zinc-900/80 hover:border-white/15 text-zinc-300";
                      
                      if (isSelected && !isAnswerSubmitted) {
                        btnStyle = "bg-zinc-800 border-red-500 text-white shadow-md shadow-red-950/10";
                      } else if (isAnswerSubmitted) {
                        if (isCorrectAnswer) {
                          btnStyle = "bg-emerald-950/30 border-emerald-500 text-emerald-400 font-bold shadow-sm shadow-emerald-950/20";
                        } else if (isSelected) {
                          btnStyle = "bg-red-950/30 border-red-500 text-red-400 font-bold shadow-sm shadow-red-950/20";
                        } else {
                          btnStyle = "bg-zinc-950/20 border-white/5 opacity-55 text-zinc-500";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          disabled={isAnswerSubmitted}
                          className={`w-full p-4 rounded-2xl border text-left text-xs md:text-sm font-semibold transition-all duration-150 flex items-center justify-between gap-4 cursor-pointer ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold text-zinc-400 shrink-0 text-xs">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{option}</span>
                          </div>

                          {/* Icon statuses */}
                          {isAnswerSubmitted && isCorrectAnswer && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          )}
                          {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                            <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* EXPLANATIONS AND CONTROL PANEL */}
                  <div className="pt-2 border-t border-white/5 flex flex-col gap-4">
                    {!isAnswerSubmitted ? (
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={selectedOption === null}
                        className="w-full py-3.5 bg-[#cc1827] hover:bg-[#b01420] disabled:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        Nộp Câu Trả Lời
                      </button>
                    ) : (
                      <div className="space-y-4">
                        {/* Explanation Box */}
                        <div className="p-4 bg-zinc-950 rounded-2xl border border-white/5 space-y-1.5">
                          <p className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Giải Thích Chi Tiết:</p>
                          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                            {selectedSubject.questions[currentQuestionIndex].explanation}
                          </p>
                        </div>

                        {/* Continue Button */}
                        <button
                          onClick={handleNextQuestion}
                          className="w-full py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          {currentQuestionIndex + 1 === selectedSubject.questions.length ? "Hoàn Thành Ôn Luyện" : "Câu Hỏi Tiếp Theo"}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          {/* RIGHT AREA (COL-SPAN 4): COMPANIONS PRESENCE & REALTIME CHAT */}
          <div className="lg:col-span-4 flex flex-col gap-4 max-h-[85vh]">
            
            {/* Peer Presence Lobby */}
            <div className="p-4 bg-zinc-900/60 rounded-2xl border border-white/5 flex flex-col gap-3.5 shadow-md">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#cc1827]" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">Bạn học đồng hành ({companions.length})</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {companions.length === 0 ? (
                <div className="py-6 text-center text-zinc-500 text-xs">
                  <span className="animate-spin inline-block mr-1.5">⏳</span> Đang tìm kiếm ghép cặp bạn đồng hành...
                </div>
              ) : (
                <div className="space-y-3">
                  {companions.map((comp) => (
                    <div key={comp.id} className="flex items-center justify-between bg-zinc-950/40 p-2.5 rounded-xl border border-white/5 text-left text-xs">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={comp.avatar} 
                          alt={comp.name} 
                          className="w-8 h-8 rounded-full object-cover border-2 border-zinc-800"
                        />
                        <div>
                          <p className="font-bold text-white text-[11px]">{comp.name}</p>
                          <p className="text-[9px] text-zinc-500 mt-0.5">
                            {comp.status === "joined" && "Vừa tham gia phòng"}
                            {comp.status === "solving" && `Đang làm câu ${comp.currentQuestion}`}
                            {comp.status === "done" && "Đã làm xong bài!"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right font-mono shrink-0">
                        <span className="font-black text-emerald-400">{comp.score}</span>
                        <span className="text-zinc-500 text-[10px]">đ</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Simulated Live Room Collaborative Chat */}
            <div className="p-4 bg-zinc-900/60 rounded-2xl border border-white/5 flex-1 flex flex-col justify-between min-h-[300px] shadow-md overflow-hidden">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 mb-2 shrink-0">
                <MessageSquare className="w-4 h-4 text-[#cc1827]" />
                <span className="text-xs font-black text-white uppercase tracking-wider">Hộp Trò Chuyện Học Nhóm</span>
              </div>

              {/* Message Feed container */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 py-1 text-left scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent custom-scrollbar max-h-[250px]">
                {chatList.map((chat) => {
                  if (chat.senderName === "Hệ thống V-Study" || chat.senderName === "V-Study Bot") {
                    return (
                      <div key={chat.id} className="text-[10px] text-zinc-400 bg-white/[0.02] border border-white/5 px-2.5 py-1.5 rounded-lg text-center font-medium font-sans italic">
                        {chat.message}
                      </div>
                    );
                  }

                  return (
                    <div key={chat.id} className={`flex items-start gap-2 max-w-[85%] ${chat.isMe ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                      {chat.senderAvatar && (
                        <img 
                          src={chat.senderAvatar} 
                          alt={chat.senderName} 
                          className="w-5 h-5 rounded-full object-cover mt-0.5"
                        />
                      )}
                      <div>
                        <div className={`flex items-center gap-1.5 ${chat.isMe ? "justify-end" : "justify-start"}`}>
                          <span className="text-[9px] font-black text-zinc-500">{chat.senderName}</span>
                          <span className="text-[8px] text-zinc-600 font-mono">{chat.timestamp}</span>
                        </div>
                        <div className={`p-2 rounded-xl mt-0.5 text-[11px] leading-relaxed font-sans ${
                          chat.isMe 
                            ? "bg-[#cc1827]/10 border border-[#cc1827]/20 text-white rounded-tr-none text-right" 
                            : "bg-zinc-950 border border-white/5 text-zinc-300 rounded-tl-none"
                        }`}>
                          {chat.message}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input controls */}
              <div className="space-y-2 mt-3 pt-2.5 border-t border-white/5 shrink-0">
                {/* Quick Chat suggestions */}
                <div className="flex flex-wrap gap-1">
                  {userQuickChats.map((qc, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendChat(qc)}
                      className="px-2 py-1 bg-zinc-950 hover:bg-zinc-800 border border-white/5 rounded-lg text-[9px] font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {qc}
                    </button>
                  ))}
                </div>

                {/* Free Text box */}
                <div className="flex items-center gap-2 bg-zinc-950 border border-white/5 rounded-xl px-2.5 py-1.5 focus-within:border-red-500/50">
                  <input
                    type="text"
                    placeholder="Gõ tin nhắn trò chuyện..."
                    value={customChatMessage}
                    onChange={(e) => setCustomChatMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendChat(customChatMessage);
                      }
                    }}
                    className="flex-1 bg-transparent border-none text-[11px] text-white placeholder-white/30 focus:outline-none h-6"
                  />
                  <button
                    onClick={() => handleSendChat(customChatMessage)}
                    disabled={!customChatMessage.trim()}
                    className="p-1 rounded-lg bg-[#cc1827]/10 hover:bg-[#cc1827] text-[#cc1827] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#cc1827] transition-all cursor-pointer flex items-center justify-center shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
