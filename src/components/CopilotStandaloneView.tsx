import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  Plus,
  Mic,
  Image as ImageIcon,
  BookOpen,
  PenTool,
  Copy,
  CheckSquare,
  Folder,
  Compass,
  LayoutGrid,
  Settings as SettingsIcon,
  Moon,
  Sun,
  X,
  Volume2,
  VolumeX,
  RefreshCw,
  Trash2,
  Share2,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Minus,
  Video,
  History,
  Bot,
  ExternalLink,
  Tv,
  Newspaper,
  Gamepad2,
  Wrench,
  HelpCircle,
  Info,
  Maximize2,
  Minimize2,
  LogOut,
  Sliders,
  Check,
  Download,
  Flame,
  Lightbulb,
  Music,
  FileText,
  Clock,
  Search,
  MessageSquare,
  StickyNote,
  Calculator,
  GraduationCap,
  MapPin,
  Bell,
  Armchair,
  CreditCard,
  RotateCcw,
  Zap,
  Layers,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CopilotMarkdown } from "./CopilotMarkdown";
import { CopilotBetArena } from "./CopilotBetArena";
import { processCopilotCommand, SearchCategoryGroup, SearchItem } from "../utils/copilotCommands";
import { useSettings } from "../hooks/useSettings";

// Space 360 integrated subcomponents
import ExploreVietnamTab from "./ExploreVietnamTab";
import VplayVBoxTab from "./VplayVBoxTab";
import VStudyTab from "./VStudyTab";
import {
  VArcadeTab,
  VCalcTab,
  VRemindersTab,
  VXploreTab,
  VFurnitureTab,
  VBooksTab,
  VBankTab,
  VOfficeTab,
  VRecorderTab
} from "./vapps";
import { VNotesView } from "./VNotesView";
import { CopilotMusicGenerator } from "./copilot/CopilotMusicGenerator";
import { CopilotImageGenerator } from "./copilot/CopilotImageGenerator";
import { CopilotVideoGenerator } from "./copilot/CopilotVideoGenerator";

export interface CopilotMessage {
  role: "user" | "model";
  text: string;
  searchCategoryResults?: SearchCategoryGroup[];
  imageUrl?: string;
  isBetArena?: boolean;
  betGame?: 'baucua' | 'latxu' | 'danhbai' | 'xucxac';
  betAmount?: number;
  timestamp?: number;
}

export interface CopilotSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: CopilotMessage[];
}

interface CopilotStandaloneViewProps {
  onOptOut: () => void;
  channels?: any[];
  onSelectChannel?: (channel: any) => void;
  navigate?: (route: string, state?: any) => void;
}

export interface Space360AppItem {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  category: "games" | "utilities" | "learning" | "media" | "productivity";
  categoryLabel: string;
  badge: string;
  icon: any;
  accentColor: string;
  bgGradient: string;
  subGames?: string[];
}

export const SPACE360_APPS: Space360AppItem[] = [
  {
    id: "v_arcade",
    name: "V-Arcade",
    shortName: "5 Trò Chơi Ore UI",
    tagline: "Caro XO, Oẳn Tù Tì, Nối Từ, Đếm Số, Rắn Săn Mồi",
    description: "Kho 5 trò chơi kinh điển Ore UI rèn luyện trí tuệ, thi đấu cùng AI Copilot mượt mà.",
    category: "games",
    categoryLabel: "Trò chơi",
    badge: "Hot • 5 Trò",
    icon: Gamepad2,
    accentColor: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
    bgGradient: "from-emerald-500/20 via-teal-900/30 to-cyan-900/30",
    subGames: ["Caro XO", "Oẳn Tù Tì", "Nối Từ TV/EN", "Đếm Số 1->N", "Rắn Săn Mồi"]
  },
  {
    id: "v_notes",
    name: "V-Notes",
    shortName: "Sổ Tay & Sticky Notes",
    tagline: "Ghi chú nhanh, màu sắc & xuất tệp",
    description: "Soạn thảo văn bản ghi chú, ghi nhớ lịch phát sóng, gắn thẻ màu và tìm kiếm thông minh.",
    category: "productivity",
    categoryLabel: "Ghi chép",
    badge: "Ghi chú",
    icon: StickyNote,
    accentColor: "text-amber-500 border-amber-500/30 bg-amber-500/10",
    bgGradient: "from-amber-500/20 via-yellow-900/30 to-orange-900/30"
  },
  {
    id: "v_calc",
    name: "V-Calc",
    shortName: "Máy Tính Biểu Thức",
    tagline: "Máy tính khoa học & chuyển đổi đơn vị",
    description: "Tính toán biểu thức toán học phức tạp, lượng giác, lũy thừa và lịch sử kết quả chi tiết.",
    category: "utilities",
    categoryLabel: "Tiện ích",
    badge: "Máy tính",
    icon: Calculator,
    accentColor: "text-cyan-500 border-cyan-500/30 bg-cyan-500/10",
    bgGradient: "from-cyan-500/20 via-teal-900/30 to-blue-900/30"
  },
  {
    id: "v_learn",
    name: "V-Study",
    shortName: "Học Tập & Pomodoro",
    tagline: "Flashcard từ vựng & hẹn giờ Pomodoro",
    description: "Luyện từ vựng tiếng Anh, đồng hồ Pomodoro tập trung và thi thử trắc nghiệm kiến thức.",
    category: "learning",
    categoryLabel: "Học tập",
    badge: "Học tập",
    icon: GraduationCap,
    accentColor: "text-sky-500 border-sky-500/30 bg-sky-500/10",
    bgGradient: "from-sky-500/20 via-blue-900/30 to-indigo-900/30"
  },
  {
    id: "v_xplore",
    name: "V-Files",
    shortName: "File Explorer Ore UI",
    tagline: "Quản lý tệp, xem trước media & M3U8",
    description: "Trình duyệt tệp phong cách hệ điều hành, sao lưu playlist m3u8 và tài liệu.",
    category: "utilities",
    categoryLabel: "Tệp tin",
    badge: "Tệp tin",
    icon: Folder,
    accentColor: "text-purple-500 border-purple-500/30 bg-purple-500/10",
    bgGradient: "from-purple-500/20 via-indigo-900/30 to-blue-900/30"
  },
  {
    id: "explore_vietnam",
    name: "Explore VN",
    shortName: "Khám Phá 63 Tỉnh Thành",
    tagline: "Bản đồ tương tác di sản & ẩm thực",
    description: "Bản đồ tương tác 63 tỉnh thành Việt Nam, danh lam thắng cảnh và văn hóa ẩm thực đặc sắc.",
    category: "learning",
    categoryLabel: "Du lịch",
    badge: "Du lịch",
    icon: MapPin,
    accentColor: "text-rose-500 border-rose-500/30 bg-rose-500/10",
    bgGradient: "from-rose-500/20 via-red-900/30 to-orange-900/30"
  },
  {
    id: "v_box",
    name: "V-Box",
    shortName: "Kho Video Giải Trí",
    tagline: "Video chọn lọc & phát lại TV",
    description: "Bộ sưu tập video giải trí đặc sắc, clip ngắn hài hước và các highlight truyền hình.",
    category: "media",
    categoryLabel: "Giải trí",
    badge: "Video",
    icon: Tv,
    accentColor: "text-amber-500 border-amber-500/30 bg-amber-500/10",
    bgGradient: "from-amber-500/20 via-orange-900/30 to-yellow-900/30"
  },
  {
    id: "v_reminders",
    name: "V-Reminders",
    shortName: "Hẹn Giờ & Nhắc Việc",
    tagline: "Báo giờ phát sóng & nhắc việc có chuông",
    description: "Lên lịch nhắc nhở các chương trình truyền hình yêu thích với âm báo tự động.",
    category: "productivity",
    categoryLabel: "Nhắc việc",
    badge: "Nhắc việc",
    icon: Bell,
    accentColor: "text-orange-500 border-orange-500/30 bg-orange-500/10",
    bgGradient: "from-orange-500/20 via-amber-900/30 to-red-900/30"
  },
  {
    id: "v_furniture",
    name: "V-Furniture",
    shortName: "Thiết Kế Không Gian 3D",
    tagline: "Bài trí nội thất phòng khách thư giãn",
    description: "Trải nghiệm sắp xếp sofa, bàn trà, TV room và ngắm nhìn không gian nội thất 3D.",
    category: "utilities",
    categoryLabel: "Nội thất",
    badge: "Nội thất",
    icon: Armchair,
    accentColor: "text-lime-500 border-lime-500/30 bg-lime-500/10",
    bgGradient: "from-lime-500/20 via-emerald-900/30 to-teal-900/30"
  },
  {
    id: "v_books",
    name: "V-Books",
    shortName: "Kho Sách Điện Tử",
    tagline: "Đọc sách, giáo trình & tiểu thuyết",
    description: "Trình đọc sách trực tuyến với nhiều đầu sách hay, tùy chỉnh cỡ chữ và chế độ đọc.",
    category: "learning",
    categoryLabel: "Đọc sách",
    badge: "Sách",
    icon: BookOpen,
    accentColor: "text-blue-500 border-blue-500/30 bg-blue-500/10",
    bgGradient: "from-blue-500/20 via-sky-900/30 to-indigo-900/30"
  },
  {
    id: "v_bank",
    name: "V-Bank",
    shortName: "Ví Điểm Thưởng V-Coins",
    tagline: "Quản lý điểm thưởng & thanh toán",
    description: "Ví điện tử V-Coins tích lũy qua các hoạt động giải trí và đổi quà trên Waves.",
    category: "utilities",
    categoryLabel: "Ví điểm",
    badge: "Ví điểm",
    icon: CreditCard,
    accentColor: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
    bgGradient: "from-emerald-500/20 via-green-900/30 to-teal-900/30"
  },
  {
    id: "v_office",
    name: "V-Office",
    shortName: "Trình Soạn Thảo Văn Bản",
    tagline: "Soạn thảo văn bản & xuất tệp",
    description: "Biên tập tài liệu nhanh chóng với định dạng phong phú và xuất định dạng trực tiếp.",
    category: "productivity",
    categoryLabel: "Văn phòng",
    badge: "Văn phòng",
    icon: FileText,
    accentColor: "text-cyan-500 border-cyan-500/30 bg-cyan-500/10",
    bgGradient: "from-cyan-500/20 via-blue-900/30 to-slate-900/30"
  },
  {
    id: "v_recorder",
    name: "V-Recorder",
    shortName: "Máy Ghi Âm Trực Tuyến",
    tagline: "Thu âm giọng nói & phát lại",
    description: "Ghi âm giọng nói với sóng âm trực quan, lưu trữ cục bộ và nghe lại bất cứ lúc nào.",
    category: "utilities",
    categoryLabel: "Ghi âm",
    badge: "Ghi âm",
    icon: Mic,
    accentColor: "text-rose-500 border-rose-500/30 bg-rose-500/10",
    bgGradient: "from-rose-500/20 via-pink-900/30 to-red-900/30"
  },
  {
    id: "v_music_gen",
    name: "Copilot Music Studio",
    shortName: "Sáng Tác Nhạc AI",
    tagline: "Tạo giai điệu, hợp âm & bài hát theo phong cách",
    description: "Công cụ sáng tác nhạc bằng AI với bộ tổng hợp âm thanh Web Audio, mô phỏng synth & piano thực tế.",
    category: "media",
    categoryLabel: "Âm nhạc",
    badge: "AI Studio",
    icon: Music,
    accentColor: "text-pink-500 border-pink-500/30 bg-pink-500/10",
    bgGradient: "from-pink-500/20 via-purple-900/30 to-indigo-900/30"
  },
  {
    id: "v_image_gen",
    name: "Copilot Image Studio",
    shortName: "Tạo Ảnh Nghệ Thuật AI",
    tagline: "Biến mô tả chữ thành tác phẩm hình ảnh sắc nét",
    description: "Studio tạo ảnh AI chất lượng cao, đa dạng phong cách điện ảnh, anime, 3D render, cyberpunk.",
    category: "media",
    categoryLabel: "Đồ họa",
    badge: "AI Studio",
    icon: ImageIcon,
    accentColor: "text-purple-500 border-purple-500/30 bg-purple-500/10",
    bgGradient: "from-purple-500/20 via-pink-900/30 to-rose-900/30"
  },
  {
    id: "v_video_gen",
    name: "Copilot Video Studio",
    shortName: "Tạo Video Storyboard AI",
    tagline: "Lên kịch bản video nhiều phân cảnh & xuất WebM",
    description: "Bộ dựng video phân cảnh AI thông minh: vẽ khung hình động, chuyển động camera và xuất video trực tiếp.",
    category: "media",
    categoryLabel: "Phim ảnh",
    badge: "AI Studio",
    icon: Video,
    accentColor: "text-blue-500 border-blue-500/30 bg-blue-500/10",
    bgGradient: "from-blue-500/20 via-indigo-900/30 to-purple-900/30"
  }
];

const STORAGE_SESSIONS_KEY = "copilot_chat_sessions";
const STORAGE_ACTIVE_ID_KEY = "copilot_active_session_id";
const USERNAME_KEY = "copilot_username";
const COPILOT_THEME_KEY = "copilot_standalone_theme";

export const CopilotStandaloneView: React.FC<CopilotStandaloneViewProps> = ({
  onOptOut,
  channels = [],
  onSelectChannel,
  navigate
}) => {
  const { settings, updateSetting } = useSettings();

  // Space 360 Embedded Workspace States
  const [activeSpace360App, setActiveSpace360App] = useState<string | null>(null);
  const [selectedArcadeGameId, setSelectedArcadeGameId] = useState<string | undefined>(undefined);
  const [isSpace360Minimized, setIsSpace360Minimized] = useState<boolean>(false);
  const [isSpace360Maximized, setIsSpace360Maximized] = useState<boolean>(false);
  const [space360CategoryTab, setSpace360CategoryTab] = useState<string>("all");
  const [space360DrawerSearch, setSpace360DrawerSearch] = useState<string>("");

  // Username customizer synced with settings
  const [userName, setUserName] = useState<string>(() => {
    try {
      return settings.userName || localStorage.getItem(USERNAME_KEY) || "User";
    } catch {
      return "User";
    }
  });

  useEffect(() => {
    if (settings.userName) {
      setUserName(settings.userName);
    }
  }, [settings.userName]);

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  useEffect(() => {
    setTempName(userName);
  }, [userName]);

  // Theme mode: light (beige/cream as screenshot) or dark
  const [themeMode, setThemeMode] = useState<"light" | "dark">(() => {
    try {
      return (localStorage.getItem(COPILOT_THEME_KEY) as "light" | "dark") || "light";
    } catch {
      return "light";
    }
  });

  const toggleTheme = () => {
    setThemeMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      try {
        localStorage.setItem(COPILOT_THEME_KEY, next);
      } catch {}
      return next;
    });
  };

  // Temporary chat mode (does not persist session)
  const [isTemporaryChat, setIsTemporaryChat] = useState(false);

  // Smart Mode selector
  const [selectedSmartMode, setSelectedSmartMode] = useState<"Smart" | "Creative" | "Precise" | "VNRT Online Master">("Smart");
  const [isSmartMenuOpen, setIsSmartMenuOpen] = useState(false);

  // Plus menu open state
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);

  // Sidebar active drawer state: 'history' | 'drafts' | 'pages' | 'tasks' | 'explore' | 'image' | 'apps' | 'user' | null
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  // Input & Query
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);

  // Image generation prompt generator modal
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageStyle, setImageStyle] = useState("Cinematic 3D");
  const [generatedImagesList, setGeneratedImagesList] = useState<Array<{ prompt: string; url: string; timestamp: number }>>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Task list
  const [tasks, setTasks] = useState<Array<{ id: string; text: string; done: boolean }>>(() => {
    try {
      const saved = localStorage.getItem("copilot_standalone_tasks");
      return saved ? JSON.parse(saved) : [
        { id: "1", text: "Xem lịch phát sóng VTV3 hôm nay", done: true },
        { id: "2", text: "Tìm hiểu các lệnh tắt của Copilot (/search, /mode)", done: false },
        { id: "3", text: "Thử tạo hình ảnh AI với phong cách Cinematic", done: false }
      ];
    } catch {
      return [];
    }
  });

  const [newTaskInput, setNewTaskInput] = useState("");

  const toggleTask = (id: string) => {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      try {
        localStorage.setItem("copilot_standalone_tasks", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const addTask = () => {
    if (!newTaskInput.trim()) return;
    const newTask = { id: String(Date.now()), text: newTaskInput.trim(), done: false };
    setTasks((prev) => {
      const next = [newTask, ...prev];
      try {
        localStorage.setItem("copilot_standalone_tasks", JSON.stringify(next));
      } catch {}
      return next;
    });
    setNewTaskInput("");
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem("copilot_standalone_tasks", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Sessions state (syncs with CopilotTab)
  const [sessions, setSessions] = useState<CopilotSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SESSIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return [
      {
        id: `session-${Date.now()}`,
        title: "Cuộc trò chuyện mới",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: []
      }
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    try {
      const savedActive = localStorage.getItem(STORAGE_ACTIVE_ID_KEY);
      if (savedActive) return savedActive;
    } catch {}
    return sessions[0]?.id || `session-${Date.now()}`;
  });

  // Temporary messages container when isTemporaryChat is on
  const [tempMessages, setTempMessages] = useState<CopilotMessage[]>([]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const currentMessages = isTemporaryChat ? tempMessages : activeSession?.messages || [];

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync sessions
  useEffect(() => {
    if (isTemporaryChat) return;
    try {
      localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(sessions));
      localStorage.setItem(STORAGE_ACTIVE_ID_KEY, activeSessionId);
    } catch (e) {}
  }, [sessions, activeSessionId, isTemporaryChat]);

  // Auto scroll
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [currentMessages, isLoading]);

  // Speech Recognition (Web Speech API)
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Trình duyệt của bạn chưa hỗ trợ Web Speech API. Vui lòng sử dụng Google Chrome hoặc Edge!");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "vi-VN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Text to Speech
  const handleSpeak = (text: string, id: number) => {
    if (!window.speechSynthesis) return;

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\[COMMAND:.*?\]/g, "").replace(/[*_#`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "vi-VN";
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Save session messages
  const updateMessages = (newMessages: CopilotMessage[]) => {
    if (isTemporaryChat) {
      setTempMessages(newMessages);
      return;
    }

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          let title = s.title;
          if (s.title === "Cuộc trò chuyện mới" && newMessages.length > 0) {
            const firstUser = newMessages.find((m) => m.role === "user");
            if (firstUser) {
              title = firstUser.text.slice(0, 32);
              if (firstUser.text.length > 32) title += "...";
            }
          }
          return {
            ...s,
            title,
            updatedAt: Date.now(),
            messages: newMessages
          };
        }
        return s;
      })
    );
    window.dispatchEvent(new Event("copilot_history_updated"));
  };

  // Create new chat
  const handleNewChat = () => {
    if (isTemporaryChat) {
      setTempMessages([]);
      setInputQuery("");
      textareaRef.current?.focus();
      return;
    }

    if (activeSession && activeSession.messages.length === 0) {
      textareaRef.current?.focus();
      setActiveDrawer(null);
      return;
    }

    const newSession: CopilotSession = {
      id: `session-${Date.now()}`,
      title: "Cuộc trò chuyện mới",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: []
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setInputQuery("");
    setActiveDrawer(null);
    setTimeout(() => textareaRef.current?.focus(), 100);
    window.dispatchEvent(new Event("copilot_history_updated"));
  };

  // Send message
  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputQuery;
    if (!promptToSend.trim() || isLoading) return;

    // Stop speaking if active
    if (speakingMessageId !== null) {
      window.speechSynthesis?.cancel();
      setSpeakingMessageId(null);
    }

    const userMsg: CopilotMessage = {
      role: "user",
      text: promptToSend,
      timestamp: Date.now()
    };
    const updatedHistory = [...currentMessages, userMsg];
    updateMessages(updatedHistory);
    setInputQuery("");
    setIsPlusMenuOpen(false);
    setIsSmartMenuOpen(false);

    // If prompt is asking for image creation
    const isImageRequest =
      promptToSend.toLowerCase().startsWith("/image") ||
      promptToSend.toLowerCase().includes("create an image") ||
      promptToSend.toLowerCase().includes("tạo hình ảnh") ||
      promptToSend.toLowerCase().includes("vẽ hình");

    if (isImageRequest) {
      setIsLoading(true);
      const cleanPrompt = promptToSend
        .replace(/(\/image|create an image|tạo hình ảnh|vẽ hình|vẽ một bức tranh|hãy tạo ảnh)/gi, "")
        .trim() || "A futuristic smart TV broadcast studio in cyberpunk aesthetic, 8k render";

      const encoded = encodeURIComponent(cleanPrompt);
      const generatedUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=640&nologo=true&seed=${Date.now()}`;

      setTimeout(() => {
        const aiMsg: CopilotMessage = {
          role: "model",
          text: `🖼️ **Đã tạo hình ảnh theo yêu cầu:**\n*"${cleanPrompt}"*\n\nBạn có thể tải ảnh về máy hoặc yêu cầu thêm các hiệu ứng khác!`,
          imageUrl: generatedUrl,
          timestamp: Date.now()
        };
        updateMessages([...updatedHistory, aiMsg]);
        setIsLoading(false);
      }, 1200);
      return;
    }

    // Check if slash command
    const cmdResult = processCopilotCommand(promptToSend, channels);
    if (cmdResult.handled) {
      const aiMsg: CopilotMessage = {
        role: "model",
        text: cmdResult.replyText,
        searchCategoryResults: cmdResult.searchCategoryResults,
        isBetArena: cmdResult.isBetArena,
        betGame: cmdResult.betGame,
        betAmount: cmdResult.betAmount,
        timestamp: Date.now()
      };
      updateMessages([...updatedHistory, aiMsg]);

      // If user invoked a Space 360 app command, open it directly inside Standalone Copilot!
      if (cmdResult.action?.type === "navigate" && cmdResult.action?.payload === "/v-space") {
        const lower = promptToSend.toLowerCase();
        let targetId = "v_arcade";
        if (lower.includes("note")) targetId = "v_notes";
        else if (lower.includes("calc")) targetId = "v_calc";
        else if (lower.includes("file") || lower.includes("xplore")) targetId = "v_xplore";
        else if (lower.includes("vietnam") || lower.includes("bản đồ")) targetId = "explore_vietnam";
        else if (lower.includes("study") || lower.includes("learn") || lower.includes("pomodoro")) targetId = "v_learn";
        else if (lower.includes("video") || lower.includes("box")) targetId = "v_box";
        else if (lower.includes("remind") || lower.includes("nhắc")) targetId = "v_reminders";
        else if (lower.includes("furniture") || lower.includes("3d")) targetId = "v_furniture";
        else if (lower.includes("book") || lower.includes("sách")) targetId = "v_books";
        else if (lower.includes("bank") || lower.includes("coin")) targetId = "v_bank";
        else if (lower.includes("office") || lower.includes("văn phòng")) targetId = "v_office";
        else if (lower.includes("record") || lower.includes("ghi âm")) targetId = "v_recorder";
        
        setActiveSpace360App(targetId);
        setIsSpace360Minimized(false);
        return;
      }

      if (cmdResult.action?.type === "navigate" && navigate) {
        setTimeout(() => {
          onOptOut();
          navigate(cmdResult.action?.payload);
        }, 800);
      }
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToSend,
          history: updatedHistory.map((m) => ({ role: m.role, text: m.text })),
          channels: channels.map((c) => ({ id: c.id, name: c.name, group: c.group || c.category })),
          userName: settings.userName || userName || "User",
          mode: selectedSmartMode.toLowerCase()
        })
      });

      const data = await response.json();
      if (data.text) {
        const aiMsg: CopilotMessage = { role: "model", text: data.text, timestamp: Date.now() };
        updateMessages([...updatedHistory, aiMsg]);

        // Auto channel switch command handler
        const match = data.text.match(/\[COMMAND:\s*SWITCH_CHANNEL:\s*([a-zA-Z0-9_-]+)\]/);
        if (match && match[1] && onSelectChannel && channels.length > 0) {
          const targetChId = match[1].toLowerCase().trim();
          const found = channels.find(
            (c) => String(c.id).toLowerCase() === targetChId || String(c.name).toLowerCase().includes(targetChId)
          );
          if (found) {
            onSelectChannel(found);
          }
        }
      } else if (data.error) {
        updateMessages([
          ...updatedHistory,
          { role: "model", text: `⚠️ ${data.error}`, timestamp: Date.now() }
        ]);
      }
    } catch (err) {
      updateMessages([
        ...updatedHistory,
        {
          role: "model",
          text: "Xin lỗi bạn, kết nối đến Copilot AI gặp trục trặc tạm thời. Bạn có thể sử dụng các lệnh điều khiển như `/search`, `/mode`, `/navigation` trực tiếp.",
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Image Generator trigger
  const handleGenerateImageFromStudio = () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    const fullPrompt = `${imagePrompt}, style: ${imageStyle}, high resolution, ultra detailed, award winning`;
    const encoded = encodeURIComponent(fullPrompt);
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=640&nologo=true&seed=${Date.now()}`;

    setTimeout(() => {
      const newImg = { prompt: imagePrompt, url, timestamp: Date.now() };
      setGeneratedImagesList((prev) => [newImg, ...prev]);
      setIsGeneratingImage(false);
      setImagePrompt("");

      // Also append to conversation
      const userMsg: CopilotMessage = {
        role: "user",
        text: `Tạo hình ảnh: ${imagePrompt} (Phong cách ${imageStyle})`,
        timestamp: Date.now()
      };
      const aiMsg: CopilotMessage = {
        role: "model",
        text: `✨ **Đã tạo thành công hình ảnh AI:**\n*"${imagePrompt}"*`,
        imageUrl: url,
        timestamp: Date.now()
      };
      updateMessages([...currentMessages, userMsg, aiMsg]);
      setActiveDrawer(null);
    }, 1500);
  };

  // Preset pill click triggers matching the screenshot
  const handlePillClick = (pillText: string) => {
    if (pillText === "Create an image" || pillText === "🖼️ Create an image") {
      setActiveDrawer("image");
      return;
    }
    handleSend(pillText);
  };

  // Save Name
  const handleSaveName = () => {
    const trimmed = tempName.trim() || "User";
    setUserName(trimmed);
    setIsEditingName(false);
    try {
      updateSetting("userName", trimmed);
      localStorage.setItem(USERNAME_KEY, trimmed);
    } catch {}
  };

  const isDark = themeMode === "dark";

  return (
    <div
      id="copilot-standalone-page"
      className={`fixed inset-0 z-50 w-screen h-screen overflow-hidden flex font-sans select-none transition-colors duration-300 ${
        isDark ? "bg-[#141416] text-[#E4E4E7]" : "bg-[#FBF8F5] text-[#2D2D2D]"
      }`}
    >
      {/* 1. LEFT SLIM RAIL SIDEBAR (As in screenshot) */}
      <aside
        className={`w-14 sm:w-16 h-full shrink-0 flex flex-col items-center justify-between py-4 border-r transition-colors duration-300 z-30 ${
          isDark
            ? "bg-[#18181B]/80 border-white/10"
            : "bg-[#FAF7F3]/90 border-[#EFEBE4]"
        }`}
      >
        {/* Top: Copilot Icon */}
        <div className="flex flex-col items-center gap-5 w-full">
          <button
            onClick={handleNewChat}
            className="group relative flex items-center justify-center w-10 h-10 rounded-full hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="Cuộc trò chuyện mới (New Chat)"
          >
            <img
              src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/microsoft-copilot.svg";
              }}
              alt="Microsoft Copilot"
              className="w-7 h-7 object-contain drop-shadow-[0_2px_8px_rgba(99,102,241,0.4)] group-hover:rotate-12 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            {isLoading && (
              <span className="absolute -inset-1 rounded-full border-2 border-indigo-500 animate-ping opacity-60 pointer-events-none" />
            )}
          </button>

          {/* Navigation Icon Stack */}
          <div className="flex flex-col items-center gap-2.5 w-full">
            {/* 1. Notebooks / Chat History */}
            <button
              onClick={() => setActiveDrawer(activeDrawer === "history" ? null : "history")}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeDrawer === "history"
                  ? isDark
                    ? "bg-white/15 text-white"
                    : "bg-[#EFEAE2] text-slate-900 shadow-xs"
                  : isDark
                  ? "text-zinc-400 hover:text-white hover:bg-white/10"
                  : "text-zinc-600 hover:text-slate-900 hover:bg-[#EFEAE2]/60"
              }`}
              title="Lịch sử chat & Sổ tay (History & Notebooks)"
            >
              <BookOpen className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* 2. Draft & Edit */}
            <button
              onClick={() => setActiveDrawer(activeDrawer === "drafts" ? null : "drafts")}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeDrawer === "drafts"
                  ? isDark
                    ? "bg-white/15 text-white"
                    : "bg-[#EFEAE2] text-slate-900 shadow-xs"
                  : isDark
                  ? "text-zinc-400 hover:text-white hover:bg-white/10"
                  : "text-zinc-600 hover:text-slate-900 hover:bg-[#EFEAE2]/60"
              }`}
              title="Soạn thảo & Bài viết (Draft & Compose)"
            >
              <PenTool className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* 3. Pages / Canvas */}
            <button
              onClick={() => setActiveDrawer(activeDrawer === "pages" ? null : "pages")}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeDrawer === "pages"
                  ? isDark
                    ? "bg-white/15 text-white"
                    : "bg-[#EFEAE2] text-slate-900 shadow-xs"
                  : isDark
                  ? "text-zinc-400 hover:text-white hover:bg-white/10"
                  : "text-zinc-600 hover:text-slate-900 hover:bg-[#EFEAE2]/60"
              }`}
              title="Tài liệu & Bản vẽ (Pages & Canvas)"
            >
              <Copy className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* 4. Tasks & To-Do */}
            <button
              onClick={() => setActiveDrawer(activeDrawer === "tasks" ? null : "tasks")}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeDrawer === "tasks"
                  ? isDark
                    ? "bg-white/15 text-white"
                    : "bg-[#EFEAE2] text-slate-900 shadow-xs"
                  : isDark
                  ? "text-zinc-400 hover:text-white hover:bg-white/10"
                  : "text-zinc-600 hover:text-slate-900 hover:bg-[#EFEAE2]/60"
              }`}
              title="Danh sách nhiệm vụ (Tasks & To-do)"
            >
              <CheckSquare className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* 5. Projects / Folder */}
            <button
              onClick={() => setActiveDrawer(activeDrawer === "projects" ? null : "projects")}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeDrawer === "projects"
                  ? isDark
                    ? "bg-white/15 text-white"
                    : "bg-[#EFEAE2] text-slate-900 shadow-xs"
                  : isDark
                  ? "text-zinc-400 hover:text-white hover:bg-white/10"
                  : "text-zinc-600 hover:text-slate-900 hover:bg-[#EFEAE2]/60"
              }`}
              title="Dự án & Thư mục (Projects & Folders)"
            >
              <Folder className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Subtle separator */}
            <div
              className={`w-6 h-[1px] my-1 ${
                isDark ? "bg-white/10" : "bg-[#E5DFD6]"
              }`}
            />

            {/* 6. Explore / Compass */}
            <button
              onClick={() => setActiveDrawer(activeDrawer === "explore" ? null : "explore")}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeDrawer === "explore"
                  ? isDark
                    ? "bg-white/15 text-white"
                    : "bg-[#EFEAE2] text-slate-900 shadow-xs"
                  : isDark
                  ? "text-zinc-400 hover:text-white hover:bg-white/10"
                  : "text-zinc-600 hover:text-slate-900 hover:bg-[#EFEAE2]/60"
              }`}
              title="Khám phá kỹ năng & Mẫu lệnh (Explore Skills)"
            >
              <Compass className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* 7. Image Studio / Gallery */}
            <button
              onClick={() => setActiveDrawer(activeDrawer === "image" ? null : "image")}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeDrawer === "image"
                  ? isDark
                    ? "bg-white/15 text-white"
                    : "bg-[#EFEAE2] text-slate-900 shadow-xs"
                  : isDark
                  ? "text-zinc-400 hover:text-white hover:bg-white/10"
                  : "text-zinc-600 hover:text-slate-900 hover:bg-[#EFEAE2]/60"
              }`}
              title="Tạo hình ảnh AI (AI Image Studio)"
            >
              <ImageIcon className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* 8. Apps / Extensions */}
            <button
              onClick={() => setActiveDrawer(activeDrawer === "apps" ? null : "apps")}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeDrawer === "apps"
                  ? isDark
                    ? "bg-white/15 text-white"
                    : "bg-[#EFEAE2] text-slate-900 shadow-xs"
                  : isDark
                  ? "text-zinc-400 hover:text-white hover:bg-white/10"
                  : "text-zinc-600 hover:text-slate-900 hover:bg-[#EFEAE2]/60"
              }`}
              title="Ứng dụng VNRT Online & Công cụ mở rộng"
            >
              <LayoutGrid className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>
        </div>

        {/* Bottom: User Avatar with menu */}
        <div className="relative">
          <button
            onClick={() => setActiveDrawer(activeDrawer === "user" ? null : "user")}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-amber-300/80 shadow-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer relative"
            title={`Tài khoản: ${userName}`}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt={userName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName || "User")}`;
              }}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* TOP BAR: Controls & Opt-out button */}
        <header className="shrink-0 h-16 px-4 sm:px-8 flex items-center justify-between z-20">
          {/* Left Title / Indicator */}
          <div className="flex items-center gap-3">
            {isTemporaryChat && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1.5 animate-pulse">
                <Clock className="w-3.5 h-3.5" />
                <span>Temporary Chat Mode</span>
              </span>
            )}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Temporary Chat Toggle Button (As in screenshot) */}
            <button
              onClick={() => {
                setIsTemporaryChat(!isTemporaryChat);
                if (!isTemporaryChat) {
                  setTempMessages([]);
                }
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                isTemporaryChat
                  ? "bg-amber-500 text-white border-amber-600 shadow-amber-500/20"
                  : isDark
                  ? "bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10"
                  : "bg-white/80 hover:bg-white text-zinc-700 border-[#E9E4DC]"
              }`}
              title="Chế độ trò chuyện tạm thời (không lưu vào lịch sử)"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Temporary</span>
            </button>

            {/* Dark / Light Mode Switch */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all cursor-pointer border ${
                isDark
                  ? "bg-white/5 hover:bg-white/10 text-amber-300 border-white/10"
                  : "bg-white/80 hover:bg-white text-zinc-700 border-[#E9E4DC]"
              }`}
              title={isDark ? "Chuyển sang giao diện Sáng" : "Chuyển sang giao diện Tối"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* CRITICAL: OPT OUT BUTTON (Returns to VNRT Online) */}
            <button
              id="btn-copilot-opt-out"
              onClick={onOptOut}
              className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 border shadow-xs hover:shadow-md active:scale-95 ${
                isDark
                  ? "bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border-rose-500/40"
                  : "bg-white/90 hover:bg-white text-rose-600 hover:text-rose-700 border-[#E8E0D5] hover:border-rose-200"
              }`}
              title="Quay lại giao diện VNRT Online thông thường"
            >
              <LogOut className="w-4 h-4 rotate-180 text-rose-500" />
              <span>Opt out</span>
            </button>
          </div>
        </header>

        {/* 3. MAIN CANVAS / SCROLL AREA */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 flex flex-col justify-between"
        >
          {/* IF NO MESSAGES: Show Exact Hero Greeting as in screenshot */}
          {currentMessages.length === 0 ? (
            <div className="my-auto max-w-2xl w-full mx-auto flex flex-col items-center justify-center text-center py-6 sm:py-10">
              {/* Greeting Heading */}
              <div className="relative group mb-8 sm:mb-10">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                      className={`text-2xl sm:text-4xl font-semibold text-center rounded-xl px-3 py-1 border outline-none ${
                        isDark ? "bg-white/10 text-white border-white/20" : "bg-white text-zinc-900 border-[#E9E4DC]"
                      }`}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full"
                    >
                      Lưu
                    </button>
                  </div>
                ) : (
                  <h1
                    onClick={() => {
                      setTempName(userName);
                      setIsEditingName(true);
                    }}
                    className={`text-2xl sm:text-4xl font-semibold tracking-tight cursor-pointer ${
                      isDark ? "text-white" : "text-[#242426]"
                    }`}
                    title="Nhấn để đổi tên gọi"
                  >
                    Hi {userName}, what should we dive into today?
                  </h1>
                )}
              </div>

              {/* FLOATING CHAT INPUT BOX (Floating rounded card from screenshot) */}
              <div
                className={`w-full rounded-[28px] p-4 sm:p-5 transition-all duration-300 mb-8 border shadow-[0_12px_40px_rgba(0,0,0,0.06)] ${
                  isDark
                    ? "bg-[#1E1E22] border-white/10 focus-within:border-indigo-500/50"
                    : "bg-white border-[#E9E4DC] focus-within:border-[#D5CFC5]"
                }`}
              >
                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Message Copilot"
                  rows={2}
                  className={`w-full bg-transparent resize-none outline-none text-base sm:text-lg leading-relaxed placeholder:text-zinc-400 ${
                    isDark ? "text-white" : "text-[#2D2D2D]"
                  }`}
                />

                {/* Inner Bottom Action Bar */}
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-transparent">
                  {/* Left: Plus button & Smart mode selector */}
                  <div className="flex items-center gap-2 relative">
                    {/* (+) Add Button */}
                    <button
                      onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isDark
                          ? "bg-white/10 hover:bg-white/15 text-zinc-300"
                          : "bg-[#F4F0EB] hover:bg-[#EAE4DC] text-zinc-700"
                      }`}
                      title="Thêm tệp đính kèm hoặc mẫu câu hỏi"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    {/* Plus Menu Popup */}
                    <AnimatePresence>
                      {isPlusMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className={`absolute left-0 bottom-10 z-40 w-64 p-2 rounded-2xl border shadow-xl ${
                            isDark ? "bg-[#27272A] border-white/10" : "bg-white border-[#E9E4DC]"
                          }`}
                        >
                          <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                            🚀 Space 360 & Tiện ích VNRT Online
                          </div>

                          <button
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              setActiveSpace360App("v_arcade");
                              setIsSpace360Minimized(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                              isDark ? "hover:bg-white/10 text-white" : "hover:bg-[#FAF7F3] text-zinc-800"
                            }`}
                          >
                            <Gamepad2 className="w-4 h-4 text-emerald-500" />
                            <span>V-Arcade (5 Trò chơi Ore UI)</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              setActiveSpace360App("v_notes");
                              setIsSpace360Minimized(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                              isDark ? "hover:bg-white/10 text-white" : "hover:bg-[#FAF7F3] text-zinc-800"
                            }`}
                          >
                            <StickyNote className="w-4 h-4 text-amber-500" />
                            <span>V-Notes (Sổ tay & Sticky Notes)</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              setActiveSpace360App("v_calc");
                              setIsSpace360Minimized(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                              isDark ? "hover:bg-white/10 text-white" : "hover:bg-[#FAF7F3] text-zinc-800"
                            }`}
                          >
                            <Calculator className="w-4 h-4 text-cyan-500" />
                            <span>V-Calc (Máy tính biểu thức)</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              setActiveSpace360App("explore_vietnam");
                              setIsSpace360Minimized(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                              isDark ? "hover:bg-white/10 text-white" : "hover:bg-[#FAF7F3] text-zinc-800"
                            }`}
                          >
                            <MapPin className="w-4 h-4 text-rose-500" />
                            <span>Bản đồ 63 Tỉnh Thành VN</span>
                          </button>

                          <div className="my-1 border-t border-zinc-200 dark:border-white/10" />

                          <button
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              setActiveDrawer("apps");
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                              isDark ? "hover:bg-white/10 text-white" : "hover:bg-[#FAF7F3] text-zinc-800"
                            }`}
                          >
                            <LayoutGrid className="w-4 h-4 text-indigo-500" />
                            <span>Tất cả 13 Ứng dụng Space 360</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              setActiveDrawer("image");
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                              isDark ? "hover:bg-white/10 text-white" : "hover:bg-[#FAF7F3] text-zinc-800"
                            }`}
                          >
                            <ImageIcon className="w-4 h-4 text-purple-500" />
                            <span>Tạo ảnh AI (AI Image Studio)</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              handleSend("Hãy tóm tắt nhanh lịch phát sóng truyền hình hôm nay");
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                              isDark ? "hover:bg-white/10 text-white" : "hover:bg-[#FAF7F3] text-zinc-800"
                            }`}
                          >
                            <Tv className="w-4 h-4 text-rose-500" />
                            <span>Lịch phát sóng VNRT Online TV</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              setActiveDrawer("explore");
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                              isDark ? "hover:bg-white/10 text-white" : "hover:bg-[#FAF7F3] text-zinc-800"
                            }`}
                          >
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            <span>Khám phá kho Prompt</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Mode Selector Pill ("Smart ⌵") */}
                    <div className="relative">
                      <button
                        onClick={() => setIsSmartMenuOpen(!isSmartMenuOpen)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                          isDark
                            ? "bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10"
                            : "bg-[#F4F0EB] hover:bg-[#EAE4DC] text-zinc-800 border-[#E5DFD6]"
                        }`}
                      >
                        <span>{selectedSmartMode}</span>
                        <ChevronDown className="w-3 h-3 text-zinc-400" />
                      </button>

                      {/* Smart Mode Menu */}
                      <AnimatePresence>
                        {isSmartMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className={`absolute left-0 bottom-10 z-40 w-48 p-2 rounded-2xl border shadow-xl ${
                              isDark ? "bg-[#27272A] border-white/10" : "bg-white border-[#E9E4DC]"
                            }`}
                          >
                            {[
                              { key: "Smart", desc: "Thông minh và cân bằng", icon: Sparkles },
                              { key: "Creative", desc: "Sáng tạo, phong phú", icon: Flame },
                              { key: "Precise", desc: "Chính xác, code & dữ liệu", icon: CheckSquare },
                              { key: "VNRT Online Master", desc: "Điều khiển TV & VNRT Online", icon: Tv }
                            ].map((item) => (
                              <button
                                key={item.key}
                                onClick={() => {
                                  setSelectedSmartMode(item.key as any);
                                  setIsSmartMenuOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                                  selectedSmartMode === item.key
                                    ? isDark
                                      ? "bg-indigo-500/20 text-indigo-300 font-bold"
                                      : "bg-indigo-50 text-indigo-700 font-bold"
                                    : isDark
                                    ? "hover:bg-white/10 text-zinc-300"
                                    : "hover:bg-[#FAF7F3] text-zinc-800"
                                }`}
                              >
                                <div>
                                  <div className="font-semibold">{item.key}</div>
                                  <div className="text-[10px] text-zinc-400">{item.desc}</div>
                                </div>
                                {selectedSmartMode === item.key && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Right: Voice Wave Audio & Send Button */}
                  <div className="flex items-center gap-2">
                    {/* Voice audio wave icon (ılı.) */}
                    <button
                      onClick={handleToggleVoice}
                      className={`p-2 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                        isListening
                          ? "bg-red-500 text-white animate-pulse"
                          : isDark
                          ? "text-zinc-400 hover:text-white hover:bg-white/10"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-[#F4F0EB]"
                      }`}
                      title={isListening ? "Đang lắng nghe giọng nói..." : "Nhập bằng giọng nói (Voice Mic)"}
                    >
                      {isListening ? (
                        <span className="flex items-center gap-0.5 text-xs font-bold">
                          <span className="w-1 h-3 bg-white animate-bounce rounded-full" />
                          <span className="w-1 h-4 bg-white animate-bounce [animation-delay:0.2s] rounded-full" />
                          <span className="w-1 h-2 bg-white animate-bounce [animation-delay:0.4s] rounded-full" />
                        </span>
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </button>

                    {/* Send Button */}
                    <button
                      onClick={() => handleSend()}
                      disabled={!inputQuery.trim() || isLoading}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        inputQuery.trim()
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:scale-105 active:scale-95 shadow-xs"
                          : "opacity-30 cursor-not-allowed text-zinc-400"
                      }`}
                      title="Gửi câu hỏi"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* SUGGESTION PILLS (AI Studio Features + Quick Prompts) */}
              <div className="flex flex-col items-center gap-2.5 max-w-3xl w-full mb-8">
                {/* AI Studio Generative Features: Music, Image, Video */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-1">
                  <button
                    onClick={() => setActiveSpace360App("v_music_gen")}
                    className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer border shadow-xs hover:scale-105 active:scale-95 flex items-center gap-2 bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30 text-pink-600 dark:text-pink-400"
                  >
                    <Music className="w-3.5 h-3.5 text-pink-500" />
                    <span>🎵 Sáng tác Nhạc AI (Music Studio)</span>
                  </button>

                  <button
                    onClick={() => setActiveSpace360App("v_image_gen")}
                    className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer border shadow-xs hover:scale-105 active:scale-95 flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 text-purple-600 dark:text-purple-400"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
                    <span>🎨 Tạo Ảnh Nghệ Thuật (Image Studio)</span>
                  </button>

                  <button
                    onClick={() => setActiveSpace360App("v_video_gen")}
                    className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer border shadow-xs hover:scale-105 active:scale-95 flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-600 dark:text-blue-400"
                  >
                    <Video className="w-3.5 h-3.5 text-blue-500" />
                    <span>🎬 Tạo Video Storyboard (Video Studio)</span>
                  </button>
                </div>

                {/* Row 1 */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
                  <button
                    onClick={() => handlePillClick("Predict the future")}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer border shadow-2xs hover:scale-105 active:scale-95 ${
                      isDark
                        ? "bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10"
                        : "bg-white hover:bg-[#FAF7F3] text-zinc-800 border-[#E9E4DC]"
                    }`}
                  >
                    Predict the future
                  </button>

                  <button
                    onClick={() => setActiveSpace360App("v_image_gen")}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer border shadow-2xs hover:scale-105 active:scale-95 flex items-center gap-1.5 ${
                      isDark
                        ? "bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10"
                        : "bg-white hover:bg-[#FAF7F3] text-zinc-800 border-[#E9E4DC]"
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Create an image</span>
                  </button>

                  <button
                    onClick={() => handlePillClick("Break the ice")}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer border shadow-2xs hover:scale-105 active:scale-95 ${
                      isDark
                        ? "bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10"
                        : "bg-white hover:bg-[#FAF7F3] text-zinc-800 border-[#E9E4DC]"
                    }`}
                  >
                    Break the ice
                  </button>

                  <button
                    onClick={() => handlePillClick("Take a quiz")}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer border shadow-2xs hover:scale-105 active:scale-95 ${
                      isDark
                        ? "bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10"
                        : "bg-white hover:bg-[#FAF7F3] text-zinc-800 border-[#E9E4DC]"
                    }`}
                  >
                    Take a quiz
                  </button>
                </div>

                {/* Row 2 */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
                  <button
                    onClick={() => handlePillClick("Fix a clunky sentence")}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer border shadow-2xs hover:scale-105 active:scale-95 ${
                      isDark
                        ? "bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10"
                        : "bg-white hover:bg-[#FAF7F3] text-zinc-800 border-[#E9E4DC]"
                    }`}
                  >
                    Fix a clunky sentence
                  </button>

                  <button
                    onClick={() => handlePillClick("Write a first draft")}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer border shadow-2xs hover:scale-105 active:scale-95 ${
                      isDark
                        ? "bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10"
                        : "bg-white hover:bg-[#FAF7F3] text-zinc-800 border-[#E9E4DC]"
                    }`}
                  >
                    Write a first draft
                  </button>

                  <button
                    onClick={() => handlePillClick("Improve writing")}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer border shadow-2xs hover:scale-105 active:scale-95 ${
                      isDark
                        ? "bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10"
                        : "bg-white hover:bg-[#FAF7F3] text-zinc-800 border-[#E9E4DC]"
                    }`}
                  >
                    Improve writing
                  </button>

                  <button
                    onClick={() => handlePillClick("Build a playlist")}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer border shadow-2xs hover:scale-105 active:scale-95 ${
                      isDark
                        ? "bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10"
                        : "bg-white hover:bg-[#FAF7F3] text-zinc-800 border-[#E9E4DC]"
                    }`}
                  >
                    Build a playlist
                  </button>
                </div>
              </div>

              {/* SPACE 360 WORKSPACE & MINI-APPS SHOWCASE */}
              <div className="w-full max-w-4xl mt-2 mb-12">
                <div
                  className={`rounded-3xl p-4 sm:p-6 border transition-all ${
                    isDark
                      ? "bg-[#1A1A1E]/80 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
                      : "bg-white/90 border-[#E9E4DC] shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                  }`}
                >
                  {/* Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200/80 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm sm:text-base font-bold tracking-tight">
                            Space 360 Workspace
                          </h2>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            13 Apps Tích hợp
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">
                          Khởi chạy trò chơi Ore UI, ghi chú, máy tính và công cụ trực tiếp trong Copilot
                        </p>
                      </div>
                    </div>

                    {/* Category Filter Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                      {[
                        { id: "all", label: "Tất cả (13)" },
                        { id: "games", label: "🎮 Trò chơi" },
                        { id: "productivity", label: "📝 Ghi chép & Office" },
                        { id: "utilities", label: "⚡ Tiện ích" },
                        { id: "learning", label: "📚 Học tập" }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSpace360CategoryTab(tab.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                            space360CategoryTab === tab.id
                              ? "bg-indigo-600 text-white shadow-xs"
                              : isDark
                              ? "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                              : "bg-[#F4F0EB] hover:bg-[#EAE4DC] text-zinc-600 hover:text-zinc-900"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Apps Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-4">
                    {SPACE360_APPS.filter((app) => {
                      if (space360CategoryTab === "all") return true;
                      if (space360CategoryTab === "games") return app.category === "games";
                      if (space360CategoryTab === "productivity") return app.category === "productivity";
                      if (space360CategoryTab === "utilities") return app.category === "utilities";
                      if (space360CategoryTab === "learning") return app.category === "learning";
                      return true;
                    }).map((app) => {
                      const IconComp = app.icon;
                      return (
                        <div
                          key={app.id}
                          onClick={() => {
                            setActiveSpace360App(app.id);
                            setIsSpace360Minimized(false);
                          }}
                          className={`group p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:scale-[1.02] active:scale-[0.98] ${
                            isDark
                              ? "bg-[#222226]/80 hover:bg-[#2A2A30] border-white/5 hover:border-indigo-500/40 hover:shadow-lg"
                              : "bg-[#FAF7F3] hover:bg-white border-[#E9E4DC] hover:border-indigo-300 hover:shadow-md"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center border ${app.accentColor}`}
                              >
                                <IconComp className="w-5 h-5" />
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${app.accentColor}`}
                              >
                                {app.badge}
                              </span>
                            </div>

                            <h3 className="font-bold text-xs sm:text-sm group-hover:text-indigo-500 transition-colors">
                              {app.name}
                            </h3>
                            <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">
                              {app.tagline}
                            </p>
                          </div>

                          {/* App Action Sub-bar */}
                          <div className="mt-3 pt-2 border-t border-zinc-200/50 dark:border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
                            <span className="font-medium text-indigo-500/80 group-hover:text-indigo-500 flex items-center gap-1">
                              <span>Mở trong Copilot</span>
                              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                            <span className="text-[9px] uppercase tracking-wider opacity-70">
                              {app.categoryLabel}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* V-Arcade Quick Mini-Games Bar (5 Ore UI Games) */}
                  <div
                    className={`mt-4 p-3 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isDark
                        ? "bg-emerald-950/20 border-emerald-500/20"
                        : "bg-emerald-50/70 border-emerald-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <Gamepad2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          V-Games & Arcade Ore UI:
                        </span>
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 ml-1.5 hidden md:inline">
                          Vòng Quay May Mắn, Caro XO, Oẳn tù tì, Nối từ, Rắn săn mồi
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        { id: "wheel_of_fortune", label: "Vòng Quay 🎡" },
                        { id: "tic_tac_toe", label: "Caro XO" },
                        { id: "rock_paper_scissors", label: "Oẳn Tù Tì" },
                        { id: "word_chain", label: "Nối Từ" },
                        { id: "snake", label: "Rắn Săn Mồi" }
                      ].map((game) => (
                        <button
                          key={game.id}
                          onClick={() => {
                            setSelectedArcadeGameId(game.id);
                            setActiveSpace360App("v_arcade");
                            setIsSpace360Minimized(false);
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1"
                        >
                          <Play className="w-2.5 h-2.5 fill-white" />
                          <span>{game.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* CONVERSATION MESSAGE STREAM */
            <div className="max-w-3xl w-full mx-auto space-y-6 pb-28 pt-2">
              {currentMessages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {/* Model Avatar */}
                  {msg.role === "model" && (
                    <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center p-1 bg-white dark:bg-[#27272A] border border-[#E9E4DC] dark:border-white/10 shadow-2xs">
                      <img
                        src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
                        alt="Copilot"
                        className="w-5 h-5 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* Message Body */}
                  <div
                    className={`rounded-2xl p-4 sm:p-5 max-w-[88%] sm:max-w-[80%] leading-relaxed ${
                      msg.role === "user"
                        ? isDark
                          ? "bg-indigo-600 text-white rounded-br-xs"
                          : "bg-[#2D2D30] text-white rounded-br-xs shadow-xs"
                        : isDark
                        ? "bg-[#1E1E22] text-zinc-100 border border-white/10 rounded-tl-xs shadow-xs"
                        : "bg-white text-zinc-800 border border-[#E9E4DC] rounded-tl-xs shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
                    }`}
                  >
                    {/* If Image Result Attached */}
                    {msg.imageUrl && (
                      <div className="mb-4 rounded-xl overflow-hidden border border-[#E9E4DC] dark:border-white/10 shadow-md">
                        <img
                          src={msg.imageUrl}
                          alt="AI Generated Art"
                          className="w-full h-auto max-h-96 object-cover hover:scale-102 transition-transform duration-300"
                        />
                        <div className="p-2.5 bg-black/70 flex items-center justify-between text-xs text-white">
                          <span className="truncate">Tạo bởi AI Image Generator</span>
                          <a
                            href={msg.imageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-md font-semibold flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>Mở ảnh gốc</span>
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Text / Markdown */}
                    <CopilotMarkdown content={msg.text} isUser={msg.role === "user"} />

                    {/* Interactive Bet Arena (Bầu Cua, Lật Xu, Đánh Bài, Xúc Xắc) */}
                    {(msg.isBetArena || (msg.text && msg.text.includes("SỚI CƯỢC ORBS VIP"))) && (
                      <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                        <CopilotBetArena
                          initialGame={msg.betGame || "baucua"}
                          initialAmount={msg.betAmount || 500}
                        />
                      </div>
                    )}

                    {/* Search Category Group Results (if any) */}
                    {msg.searchCategoryResults && msg.searchCategoryResults.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700 space-y-2">
                        {msg.searchCategoryResults.map((cat, cIdx) => (
                          <div key={cIdx} className="space-y-1">
                            <div className="text-xs font-bold text-indigo-500 dark:text-indigo-400">
                              {cat.category}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {cat.items.map((item, iIdx) => (
                                <button
                                  key={iIdx}
                                  onClick={() => {
                                    const appId = item.actionState?.appId || (item.category === "vapp" ? item.id : null);
                                    if (appId && SPACE360_APPS.some((a) => a.id === appId)) {
                                      setActiveSpace360App(appId);
                                      setIsSpace360Minimized(false);
                                    } else if (item.channelData && onSelectChannel) {
                                      onSelectChannel(item.channelData);
                                    } else if (item.actionRoute && navigate) {
                                      onOptOut();
                                      navigate(item.actionRoute, item.actionState);
                                    }
                                  }}
                                  className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-left hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-xs cursor-pointer"
                                >
                                  <div className="font-semibold">{item.title}</div>
                                  {item.subtitle && (
                                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                                      {item.subtitle}
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* AI Model actions footer */}
                    {msg.role === "model" && (
                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-zinc-100 dark:border-white/5 text-zinc-400 text-xs">
                        <button
                          onClick={() => handleSpeak(msg.text, idx)}
                          className="hover:text-indigo-500 flex items-center gap-1 cursor-pointer"
                          title="Đọc câu trả lời bằng giọng nói (TTS)"
                        >
                          {speakingMessageId === idx ? (
                            <VolumeX className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                          <span>{speakingMessageId === idx ? "Dừng đọc" : "Đọc"}</span>
                        </button>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(msg.text);
                            alert("Đã sao chép nội dung câu trả lời!");
                          }}
                          className="hover:text-indigo-500 flex items-center gap-1 ml-2 cursor-pointer"
                          title="Sao chép câu trả lời"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full p-1 bg-white dark:bg-[#27272A] border border-[#E9E4DC] dark:border-white/10 flex items-center justify-center">
                    <img
                      src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
                      alt="Thinking"
                      className="w-5 h-5 animate-spin"
                    />
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2 ${
                      isDark ? "bg-[#1E1E22] text-zinc-300" : "bg-white text-zinc-700 border border-[#E9E4DC]"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span>Copilot đang suy nghĩ và chuẩn bị câu trả lời...</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PERSISTENT FLOATING BOTTOM INPUT (When active chat messages exist) */}
          {currentMessages.length > 0 && (
            <div className="sticky bottom-2 max-w-3xl w-full mx-auto shrink-0 z-20">
              <div
                className={`w-full rounded-[24px] p-3 transition-all border shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex items-center gap-2 ${
                  isDark ? "bg-[#1E1E22] border-white/10" : "bg-white border-[#E9E4DC]"
                }`}
              >
                <button
                  onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isDark ? "bg-white/10 text-zinc-300" : "bg-[#F4F0EB] text-zinc-700"
                  }`}
                  title="Thêm đính kèm"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  placeholder="Message Copilot"
                  className={`flex-1 bg-transparent outline-none text-sm px-2 ${
                    isDark ? "text-white" : "text-[#2D2D2D]"
                  }`}
                />

                <button
                  onClick={handleToggleVoice}
                  className={`p-2 rounded-full ${
                    isListening ? "bg-red-500 text-white" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleSend()}
                  disabled={!inputQuery.trim() || isLoading}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    inputQuery.trim()
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs"
                      : "opacity-30 cursor-not-allowed text-zinc-400"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* BOTTOM DISCLAIMER (Matching exact wording from screenshot) */}
          <footer className="shrink-0 text-center py-2 text-[11px] text-zinc-400 select-none">
            Copilot is an AI and may make mistakes. Using Copilot means you agree to the{" "}
            <span className="underline cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300">
              Terms of Use
            </span>
            . See our{" "}
            <span className="underline cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300">
              Privacy Statement
            </span>
            .
          </footer>
        </div>
      </div>

      {/* 4. SLIDE-OUT DRAWERS (History, Canvas, Tasks, Image Generator, User) */}
      <AnimatePresence>
        {activeDrawer && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className={`fixed left-14 sm:left-16 top-0 bottom-0 z-40 w-72 sm:w-80 border-r shadow-2xl p-4 flex flex-col justify-between ${
              isDark ? "bg-[#18181B] border-white/10 text-white" : "bg-[#FAF7F3] border-[#E9E4DC] text-zinc-800"
            }`}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-white/10">
              <h3 className="font-bold text-sm flex items-center gap-2">
                {activeDrawer === "history" && <BookOpen className="w-4 h-4 text-indigo-500" />}
                {activeDrawer === "drafts" && <PenTool className="w-4 h-4 text-amber-500" />}
                {activeDrawer === "pages" && <Copy className="w-4 h-4 text-cyan-500" />}
                {activeDrawer === "tasks" && <CheckSquare className="w-4 h-4 text-emerald-500" />}
                {activeDrawer === "explore" && <Compass className="w-4 h-4 text-rose-500" />}
                {activeDrawer === "image" && <ImageIcon className="w-4 h-4 text-purple-500" />}
                {activeDrawer === "apps" && <LayoutGrid className="w-4 h-4 text-orange-500" />}
                {activeDrawer === "user" && <SettingsIcon className="w-4 h-4 text-zinc-400" />}
                <span className="capitalize">
                  {activeDrawer === "history" && "Lịch sử trò chuyện"}
                  {activeDrawer === "drafts" && "Soạn thảo & Bản nháp"}
                  {activeDrawer === "pages" && "Tài liệu & VNRT Online Docs"}
                  {activeDrawer === "tasks" && "Nhiệm vụ AI (Tasks)"}
                  {activeDrawer === "explore" && "Khám phá Prompt"}
                  {activeDrawer === "image" && "AI Image Generator"}
                  {activeDrawer === "apps" && "Tiện ích VNRT Online"}
                  {activeDrawer === "user" && "Cài đặt & Tài khoản"}
                </span>
              </h3>
              <button
                onClick={() => setActiveDrawer(null)}
                className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {/* HISTORY DRAWER */}
              {activeDrawer === "history" && (
                <div className="space-y-2">
                  <button
                    onClick={handleNewChat}
                    className="w-full flex items-center justify-center gap-2 p-2.5 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-md cursor-pointer hover:bg-indigo-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Cuộc trò chuyện mới</span>
                  </button>

                  <div className="space-y-1 pt-2">
                    {sessions.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setActiveSessionId(s.id);
                          setIsTemporaryChat(false);
                          setActiveDrawer(null);
                        }}
                        className={`p-2.5 rounded-xl text-xs flex items-center justify-between group cursor-pointer transition-colors ${
                          activeSessionId === s.id && !isTemporaryChat
                            ? isDark
                              ? "bg-white/15 text-white font-bold"
                              : "bg-white text-indigo-700 font-bold shadow-2xs"
                            : isDark
                            ? "hover:bg-white/5 text-zinc-400"
                            : "hover:bg-white/60 text-zinc-700"
                        }`}
                      >
                        <div className="truncate pr-2">{s.title}</div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSessions((prev) => prev.filter((item) => item.id !== s.id));
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* IMAGE GENERATOR DRAWER */}
              {activeDrawer === "image" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Mô tả bức ảnh bạn muốn vẽ:</label>
                    <textarea
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="Ví dụ: Cyberpunk Vietnamese street with neon lights, 8k..."
                      rows={3}
                      className={`w-full p-2.5 text-xs rounded-xl border outline-none resize-none ${
                        isDark ? "bg-[#27272A] border-white/10" : "bg-white border-[#E9E4DC]"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Phong cách mỹ thuật:</label>
                    <select
                      value={imageStyle}
                      onChange={(e) => setImageStyle(e.target.value)}
                      className={`w-full p-2 text-xs rounded-xl border outline-none ${
                        isDark ? "bg-[#27272A] border-white/10" : "bg-white border-[#E9E4DC]"
                      }`}
                    >
                      <option value="Cinematic 3D">Cinematic 3D</option>
                      <option value="Photorealistic 8K">Photorealistic 8K</option>
                      <option value="Anime & Manga">Anime & Manga</option>
                      <option value="Cyberpunk Neon">Cyberpunk Neon</option>
                      <option value="Watercolor Art">Tranh màu nước</option>
                      <option value="Pixel Art 16-bit">Pixel Art 16-bit</option>
                    </select>
                  </div>

                  <button
                    onClick={handleGenerateImageFromStudio}
                    disabled={!imagePrompt.trim() || isGeneratingImage}
                    className="w-full py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isGeneratingImage ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>{isGeneratingImage ? "Đang render ảnh..." : "Bắt đầu vẽ ảnh AI"}</span>
                  </button>

                  {/* Recently generated list */}
                  {generatedImagesList.length > 0 && (
                    <div className="pt-3 border-t border-zinc-200 dark:border-white/10 space-y-2">
                      <div className="text-[11px] font-bold text-zinc-400">Ảnh đã tạo gần đây:</div>
                      <div className="grid grid-cols-2 gap-2">
                        {generatedImagesList.slice(0, 4).map((img, idx) => (
                          <a
                            key={idx}
                            href={img.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block rounded-lg overflow-hidden border border-zinc-300 dark:border-white/10 hover:opacity-80"
                          >
                            <img src={img.url} alt={img.prompt} className="w-full h-20 object-cover" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TASKS DRAWER */}
              {activeDrawer === "tasks" && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTaskInput}
                      onChange={(e) => setNewTaskInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTask()}
                      placeholder="Thêm nhiệm vụ mới..."
                      className={`flex-1 p-2 text-xs rounded-xl border outline-none ${
                        isDark ? "bg-[#27272A] border-white/10" : "bg-white border-[#E9E4DC]"
                      }`}
                    />
                    <button
                      onClick={addTask}
                      className="px-3 py-2 bg-emerald-600 text-white rounded-full text-xs font-bold"
                    >
                      Thêm
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {tasks.map((t) => (
                      <div
                        key={t.id}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                          isDark ? "bg-[#27272A] border-white/5" : "bg-white border-[#E9E4DC]"
                        }`}
                      >
                        <div
                          onClick={() => toggleTask(t.id)}
                          className={`flex items-center gap-2 cursor-pointer ${
                            t.done ? "line-through text-zinc-400" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={t.done}
                            onChange={() => {}}
                            className="rounded accent-emerald-500"
                          />
                          <span>{t.text}</span>
                        </div>
                        <button
                          onClick={() => deleteTask(t.id)}
                          className="text-zinc-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EXPLORE DRAWER */}
              {activeDrawer === "explore" && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-zinc-400">Gợi ý chủ đề thú vị:</div>
                  {[
                    "Kể cho tôi một câu chuyện viễn tưởng về tương lai năm 2050",
                    "Gợi ý 5 bộ phim truyền hình Việt Nam hay nhất",
                    "Viết email xin nghỉ phép bằng giọng văn chuyên nghiệp",
                    "Giải thích thuật ngữ AI Agents một cách dễ hiểu",
                    "Tạo danh sách nhạc acoustic thư giãn cho buổi tối",
                    "Tạo kịch bản video TikTok 30 giây quảng bá ẩm thực"
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handleSend(p);
                        setActiveDrawer(null);
                      }}
                      className={`w-full p-2.5 rounded-xl text-xs text-left transition-colors border ${
                        isDark
                          ? "bg-white/5 hover:bg-white/10 border-white/5"
                          : "bg-white hover:bg-[#FAF7F3] border-[#E9E4DC]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* USER / SETTINGS DRAWER */}
              {activeDrawer === "user" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Tên hiển thị:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className={`flex-1 p-2 text-xs rounded-xl border outline-none ${
                          isDark ? "bg-[#27272A] border-white/10" : "bg-white border-[#E9E4DC]"
                        }`}
                      />
                      <button
                        onClick={handleSaveName}
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-bold"
                      >
                        Lưu
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-200 dark:border-white/10 space-y-2">
                    <button
                      onClick={() => {
                        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
                          JSON.stringify(sessions, null, 2)
                        )}`;
                        const a = document.createElement("a");
                        a.href = jsonString;
                        a.download = `copilot-sessions-${Date.now()}.json`;
                        a.click();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-zinc-200 dark:bg-white/10 text-xs font-semibold flex items-center justify-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Xuất lịch sử chat (JSON)</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện?")) {
                          handleNewChat();
                          setSessions([]);
                          localStorage.removeItem(STORAGE_SESSIONS_KEY);
                        }
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-semibold flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa sạch tất cả lịch sử</span>
                    </button>
                  </div>
                </div>
              )}

              {/* APPS & SPACE 360 DRAWER */}
              {activeDrawer === "apps" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
                      Space 360 & Tiện ích ({SPACE360_APPS.length})
                    </span>
                    <span className="text-[10px] text-zinc-400">1-Click Launch</span>
                  </div>

                  {/* Search / Filter input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm ứng dụng..."
                      className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border outline-none ${
                        isDark ? "bg-[#27272A] border-white/10 text-white" : "bg-white border-[#E9E4DC]"
                      }`}
                      onChange={(e) => {
                        const val = e.target.value.toLowerCase();
                        // Filter directly or keep reactive
                      }}
                    />
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                    {["all", "games", "productivity", "utilities", "learning"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSpace360CategoryTab(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                          space360CategoryTab === cat
                            ? "bg-indigo-600 text-white"
                            : isDark
                            ? "bg-white/5 text-zinc-400 hover:text-white"
                            : "bg-[#F4F0EB] text-zinc-600 hover:text-zinc-900"
                        }`}
                      >
                        {cat === "all" ? "Tất cả" : cat}
                      </button>
                    ))}
                  </div>

                  {/* App List */}
                  <div className="space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                    {SPACE360_APPS.filter((app) => {
                      if (space360CategoryTab === "all") return true;
                      return app.category === space360CategoryTab;
                    }).map((app) => {
                      const IconComp = app.icon;
                      return (
                        <div
                          key={app.id}
                          onClick={() => {
                            setActiveSpace360App(app.id);
                            setIsSpace360Minimized(false);
                            setActiveDrawer(null);
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
                            isDark
                              ? "bg-white/5 hover:bg-white/10 border-white/5 hover:border-indigo-500/30"
                              : "bg-white hover:bg-[#FAF7F3] border-[#E9E4DC] hover:border-indigo-300"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${app.accentColor}`}
                            >
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <div className="text-xs font-bold truncate group-hover:text-indigo-500 transition-colors">
                                {app.name}
                              </div>
                              <div className="text-[10px] text-zinc-400 truncate">{app.tagline}</div>
                            </div>
                          </div>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 border ml-2 ${app.accentColor}`}
                          >
                            {app.badge}
                          </span>
                        </div>
                      );
                    })}

                    <div className="pt-2">
                      <div className="text-[11px] text-zinc-400 font-semibold mb-1">
                        Chuyển hướng toàn màn hình:
                      </div>
                      <button
                        onClick={() => {
                          onOptOut();
                          navigate?.("/v-space");
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                      >
                        <Gamepad2 className="w-3.5 h-3.5" />
                        <span>Mở Space 360 Full Screen</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="pt-3 border-t border-zinc-200 dark:border-white/10 text-center">
              <button
                onClick={onOptOut}
                className="w-full py-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 rotate-180" />
                <span>Opt out / Quay lại VNRT Online</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. EMBEDDED SPACE 360 WORKSPACE (MODAL / FLOATING / MINIMIZED DOCK) */}
      {activeSpace360App && (
        <>
          {/* Minimized Dock Bar (Bottom-Right) */}
          {isSpace360Minimized ? (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`fixed bottom-4 right-4 z-50 p-2 rounded-2xl border shadow-2xl flex items-center gap-3 backdrop-blur-xl ${
                isDark
                  ? "bg-[#18181B]/95 border-white/15 text-white"
                  : "bg-white/95 border-[#E9E4DC] text-zinc-800"
              }`}
            >
              {(() => {
                const currentApp = SPACE360_APPS.find((a) => a.id === activeSpace360App);
                const IconComp = currentApp?.icon || Gamepad2;
                return (
                  <>
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center border ${currentApp?.accentColor}`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold leading-tight">
                        {currentApp?.name || "Space 360 App"}
                      </span>
                      <span className="text-[10px] text-zinc-400">Đang chạy ở chế độ thu nhỏ</span>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => setIsSpace360Minimized(false)}
                        className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
                        title="Mở rộng ứng dụng"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setActiveSpace360App(null)}
                        className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Đóng ứng dụng"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          ) : (
            /* Open Embedded Workspace Window */
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                className={`w-full max-w-6xl h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
                  isDark
                    ? "bg-[#141417] border-white/15 text-white"
                    : "bg-[#FBF9F5] border-[#E9E4DC] text-zinc-900"
                }`}
              >
                {/* Workspace Header */}
                <div
                  className={`shrink-0 px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-3 ${
                    isDark ? "bg-[#1C1C21] border-white/10" : "bg-white border-[#E9E4DC]"
                  }`}
                >
                  {/* Left: Active App Identity & Switcher */}
                  <div className="flex items-center gap-3">
                    {(() => {
                      const currentApp = SPACE360_APPS.find((a) => a.id === activeSpace360App);
                      const IconComp = currentApp?.icon || Gamepad2;
                      return (
                        <>
                          <div
                            className={`w-9 h-9 rounded-2xl flex items-center justify-center border shadow-xs ${currentApp?.accentColor}`}
                          >
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-sm sm:text-base leading-tight">
                                {currentApp?.name}
                              </h3>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${currentApp?.accentColor}`}
                              >
                                {currentApp?.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 line-clamp-1">
                              {currentApp?.tagline}
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Middle: App Quick Switcher Pills */}
                  <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto max-w-md scrollbar-none px-2">
                    {SPACE360_APPS.map((app) => {
                      const isActive = app.id === activeSpace360App;
                      const IconComp = app.icon;
                      return (
                        <button
                          key={app.id}
                          onClick={() => setActiveSpace360App(app.id)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                            isActive
                              ? "bg-indigo-600 text-white shadow-xs"
                              : isDark
                              ? "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                              : "bg-[#F4F0EB] hover:bg-[#EAE4DC] text-zinc-600 hover:text-zinc-900"
                          }`}
                        >
                          <IconComp className="w-3.5 h-3.5" />
                          <span>{app.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right: Window Controls */}
                  <div className="flex items-center gap-2">
                    {/* Ask Copilot about this app */}
                    <button
                      onClick={() => {
                        const currentApp = SPACE360_APPS.find((a) => a.id === activeSpace360App);
                        setIsSpace360Minimized(true);
                        handleSend(`Hướng dẫn và phân tích các tính năng của ứng dụng ${currentApp?.name || "Space 360"}`);
                      }}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 border border-indigo-500/20 transition-colors cursor-pointer"
                      title="Hỏi AI Copilot về ứng dụng này"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Hỏi Copilot</span>
                    </button>

                    {/* Minimize */}
                    <button
                      onClick={() => setIsSpace360Minimized(true)}
                      className="p-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-400 hover:text-zinc-800 dark:hover:text-white transition-colors cursor-pointer"
                      title="Thu nhỏ cửa sổ"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    {/* Close */}
                    <button
                      onClick={() => setActiveSpace360App(null)}
                      className="p-2 rounded-xl hover:bg-rose-500/10 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Đóng ứng dụng"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Workspace Body (Render Selected App) */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-5">
                  {activeSpace360App === "v_arcade" && (
                    <div className="h-full">
                      <VArcadeTab initialGameId={selectedArcadeGameId} />
                    </div>
                  )}

                  {activeSpace360App === "v_notes" && (
                    <div className="h-full">
                      <VNotesView />
                    </div>
                  )}

                  {activeSpace360App === "explore_vietnam" && (
                    <div className="h-full">
                      <ExploreVietnamTab />
                    </div>
                  )}

                  {activeSpace360App === "v_learn" && (
                    <div className="h-full">
                      <VStudyTab />
                    </div>
                  )}

                  {activeSpace360App === "v_calc" && (
                    <div className="h-full">
                      <VCalcTab />
                    </div>
                  )}

                  {activeSpace360App === "v_xplore" && (
                    <div className="h-full">
                      <VXploreTab />
                    </div>
                  )}

                  {activeSpace360App === "v_box" && (
                    <div className="h-full">
                      <VplayVBoxTab />
                    </div>
                  )}

                  {activeSpace360App === "v_reminders" && (
                    <div className="h-full">
                      <VRemindersTab />
                    </div>
                  )}

                  {activeSpace360App === "v_furniture" && (
                    <div className="h-full">
                      <VFurnitureTab />
                    </div>
                  )}

                  {activeSpace360App === "v_books" && (
                    <div className="h-full">
                      <VBooksTab />
                    </div>
                  )}

                  {activeSpace360App === "v_bank" && (
                    <div className="h-full">
                      <VBankTab />
                    </div>
                  )}

                  {activeSpace360App === "v_office" && (
                    <div className="h-full">
                      <VOfficeTab />
                    </div>
                  )}

                  {activeSpace360App === "v_recorder" && (
                    <div className="h-full">
                      <VRecorderTab />
                    </div>
                  )}

                  {activeSpace360App === "v_music_gen" && (
                    <div className="h-full">
                      <CopilotMusicGenerator onBackToChat={() => setActiveSpace360App(null)} />
                    </div>
                  )}

                  {activeSpace360App === "v_image_gen" && (
                    <div className="h-full">
                      <CopilotImageGenerator onBackToChat={() => setActiveSpace360App(null)} />
                    </div>
                  )}

                  {activeSpace360App === "v_video_gen" && (
                    <div className="h-full">
                      <CopilotVideoGenerator onBackToChat={() => setActiveSpace360App(null)} />
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
