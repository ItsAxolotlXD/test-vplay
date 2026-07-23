import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Users, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Send, 
  Play, 
  RefreshCcw, 
  MessageSquare, 
  BookOpenCheck,
  ChevronRight,
  ChevronLeft,
  Flame,
  Zap,
  GraduationCap,
  Search,
  Sparkles,
  School,
  Flag,
  Grid,
  FileText,
  Check,
  RotateCcw,
  AlertTriangle,
  HelpCircle,
  User,
  Trash2,
  Edit,
  TrendingUp,
  X,
  Baby,
  Home,
  Languages,
  PenTool
} from "lucide-react";
import { 
  Question, 
  Subject, 
  EducationLevel, 
  subjectsData,
  getSuperExamSubject
} from "../data/vstudyData";
import EnglishCefrModule from "./vstudy/EnglishCefrModule";
import LiteratureWritingModule from "./vstudy/LiteratureWritingModule";

export interface ExamHistoryItem {
  id: string;
  date: string;
  subjectName: string;
  level: string;
  totalQuestions: number;
  correct: number;
  wrong: number;
  unanswered: number;
  scoreGained: number;
  timeSpent: number;
}

const defaultMockHistory: ExamHistoryItem[] = [
  {
    id: "hist-1",
    date: "21/07/2026 14:30",
    subjectName: "BÀI KIỂM TRA SIÊU TỔNG HỢP (100 CÂU)",
    level: "super_exam",
    totalQuestions: 100,
    correct: 88,
    wrong: 10,
    unanswered: 2,
    scoreGained: 880,
    timeSpent: 5400
  },
  {
    id: "hist-2",
    date: "20/07/2026 10:15",
    subjectName: "Toán Học Lớp 12 - Ôn Thi THPT Quốc Gia",
    level: "thpt",
    totalQuestions: 10,
    correct: 9,
    wrong: 1,
    unanswered: 0,
    scoreGained: 100,
    timeSpent: 280
  },
  {
    id: "hist-3",
    date: "19/07/2026 16:20",
    subjectName: "Vật Lý Lớp 9 - Điện Học & Quang Học",
    level: "thcs",
    totalQuestions: 10,
    correct: 10,
    wrong: 0,
    unanswered: 0,
    scoreGained: 200,
    timeSpent: 210
  },
  {
    id: "hist-4",
    date: "18/07/2026 08:45",
    subjectName: "Tiếng Việt Lớp 5 - Luyện Từ Và Câu",
    level: "tieu_hoc",
    totalQuestions: 10,
    correct: 9,
    wrong: 1,
    unanswered: 0,
    scoreGained: 100,
    timeSpent: 180
  }
];

// Web Audio API Sound Synthesizer for educational cues
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
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === "incorrect") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(147, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === "join") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(329.63, ctx.currentTime);
      osc.frequency.setValueAtTime(440.00, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === "tick") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === "complete") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(554, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.2);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    }
  } catch (err) {
    console.warn("Audio Context is blocked or unsupported", err);
  }
};

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
  "Đề thi Bài Kiểm Tra Siêu Tổng Hợp có khác, nhức não ghê",
  "Tớ vừa vượt qua câu khó nhất rồi, yeah!",
  "Anh em làm tới câu mấy rồi? Đợi tớ với!",
  "Cố lên các sĩ tử ơi! Quyết tâm đạt 100/100 điểm!",
  "Toán học làm mình tỉnh ngủ hẳn ra haha",
  "Mọi người chọn đáp án nào thế? Gợi ý chút đi"
];

const userQuickChats = [
  "Chào cả nhà nhé! Cùng làm bài thi tốt!",
  "Câu này hóc búa quá bà con ơi!",
  "Tớ vừa hoàn thành xong rồi, điểm cao lắm!",
  "Đề này trúng tủ tớ luôn rồi haha",
  "Cố lên các sĩ tử ơi, còn nhiều thời gian mà!"
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
  subFilter?: "all" | "tieu_hoc" | "thcs" | "thpt" | "super_exam" | "hoc_ba";
  onSelectSubFilter?: (filter: "all" | "tieu_hoc" | "thcs" | "thpt" | "super_exam" | "hoc_ba") => void;
}

export default function VStudyTab({ onBack, subFilter = "all", onSelectSubFilter }: VStudyTabProps) {
  // Main Module Tab Mode
  const [modeTab, setModeTab] = useState<"quizzes" | "english_cefr" | "literature_writing" | "hoc_ba">(() => {
    if (subFilter === "hoc_ba") return "hoc_ba";
    return "quizzes";
  });

  useEffect(() => {
    if (subFilter === "hoc_ba") {
      setModeTab("hoc_ba");
    } else if (subFilter === "all" || subFilter === "tieu_hoc" || subFilter === "thcs" || subFilter === "thpt" || subFilter === "super_exam") {
      setModeTab("quizzes");
    }
  }, [subFilter]);

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

  // Cumulative scoring & Academic record (Học bạ) states
  const [totalScore, setTotalScore] = useState<number>(() => {
    return Number(localStorage.getItem("vstudy_total_score") || "1280");
  });

  const handleAddScoreAndXp = (scoreGained: number, xpGained: number) => {
    setTotalScore((prev) => {
      const next = prev + scoreGained;
      localStorage.setItem("vstudy_total_score", next.toString());
      return next;
    });

    setXp((prev) => {
      const nextXp = prev + xpGained;
      const targetXp = level * 100;
      if (nextXp >= targetXp) {
        setLevel((l) => {
          const nl = l + 1;
          localStorage.setItem("vstudy_level", nl.toString());
          return nl;
        });
        const rem = nextXp - targetXp;
        localStorage.setItem("vstudy_xp", rem.toString());
        return rem;
      }
      localStorage.setItem("vstudy_xp", nextXp.toString());
      return nextXp;
    });
  };
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState<number>(() => {
    return Number(localStorage.getItem("vstudy_total_questions") || "130");
  });
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState<number>(() => {
    return Number(localStorage.getItem("vstudy_total_correct") || "116");
  });
  const [totalWrongAnswers, setTotalWrongAnswers] = useState<number>(() => {
    return Number(localStorage.getItem("vstudy_total_wrong") || "14");
  });
  const [studentName, setStudentName] = useState<string>(() => {
    const saved = localStorage.getItem("vstudy_student_name");
    if (!saved || saved === "Nguyễn Văn Sĩ Tử") {
      return "Người học hành";
    }
    return saved;
  });
  const [isEditingStudentName, setIsEditingStudentName] = useState<boolean>(false);
  const [tempStudentName, setTempStudentName] = useState<string>("");
  const [historySearchQuery, setHistorySearchQuery] = useState<string>("");
  const [historyFilterLevel, setHistoryFilterLevel] = useState<string>("all");

  const [historyList, setHistoryList] = useState<ExamHistoryItem[]>(() => {
    const saved = localStorage.getItem("vstudy_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return defaultMockHistory;
  });

  // State
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [quizTimer, setQuizTimer] = useState<number>(180); // Default 3 mins or 7200 for 100 questions
  const [quizResults, setQuizResults] = useState<{ 
    correct: number; 
    wrong: number; 
    scoreGained: number;
    unanswered?: number;
    timeSpent?: number;
    tieuHocCorrect?: number;
    thcsCorrect?: number;
    thptCorrect?: number;
  } | null>(null);

  // Exam specific states for 100-question test
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState<boolean[]>([]);
  const [showQuestionGrid, setShowQuestionGrid] = useState<boolean>(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState<boolean>(false);
  const [reviewFilter, setReviewFilter] = useState<"all" | "wrong" | "flagged">("all");

  // Level & Search Filter State
  const [activeLevel, setActiveLevel] = useState<EducationLevel>("all");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // Sync subFilter prop with activeLevel state
  useEffect(() => {
    if (subFilter === "tieu_hoc" || subFilter === "thcs" || subFilter === "thpt") {
      setActiveLevel(subFilter);
    } else if (subFilter === "all" || subFilter === "super_exam") {
      setActiveLevel("all");
    }
  }, [subFilter]);

  // Filtered Subjects based on selected sub-category and search query
  const filteredSubjects = useMemo(() => {
    return subjectsData.filter((subj) => {
      const matchesLevel = activeLevel === "all" || subj.level === activeLevel;
      const matchesSearch =
        !searchKeyword.trim() ||
        subj.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        subj.grade.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        subj.description.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }, [activeLevel, searchKeyword]);

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
            handleConfirmSubmitExam();
            return 0;
          }
          if (prev % 30 === 0) playSynthSound("tick");
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isQuizActive, quizTimer, quizResults]);

  // Companion simulation loops
  useEffect(() => {
    if (isQuizActive && selectedSubject && !quizResults) {
      const initialJoinTimeout = setTimeout(() => {
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

        const firstPeer = randomizedPeers[0];
        setChatList((prev) => [
          ...prev,
          {
            id: `sys-${Date.now()}`,
            senderName: "Hệ thống V-Study",
            senderAvatar: "",
            message: `⚡ ${randomizedPeers.map(p => p.name).join(", ")} đã tham gia phòng thi cùng bạn!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false
          }
        ]);

        setTimeout(() => {
          const greetings = [
            "Hi cả nhà! Chúc mọi người thi tốt nhé!",
            "Chào bạn học cùng nha! Chiến hết 100 câu nào!",
            "100 câu 2 tiếng, chúc cả nhà đạt điểm tối đa!"
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

      companionActionRef.current = setInterval(() => {
        setCompanions((prevCompanions) => {
          if (prevCompanions.length === 0) return prevCompanions;

          return prevCompanions.map((comp) => {
            if (comp.status === "done") return comp;

            const rand = Math.random();
            const totalQuestions = selectedSubject.questions.length;

            if (rand > 0.65) {
              const currentQ = comp.currentQuestion;
              const nextQ = currentQ + 1;
              const isCorrect = Math.random() > 0.3;
              const nextScore = isCorrect ? comp.score + 1 : comp.score;

              if (nextQ > totalQuestions) {
                return {
                  ...comp,
                  status: "done",
                  score: nextScore
                };
              } else {
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
      }, 5000);

      return () => {
        clearTimeout(initialJoinTimeout);
        if (companionActionRef.current) clearInterval(companionActionRef.current);
      };
    }
  }, [isQuizActive, selectedSubject, quizResults]);

  // Start Standard Subject Quiz
  const handleStartQuiz = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsQuizActive(true);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserScore(0);
    const qCount = subject.questions.length;
    setUserAnswers(new Array(qCount).fill(null));
    setFlaggedQuestions(new Array(qCount).fill(false));
    setQuizTimer(qCount > 20 ? 3600 : 300); // 5 mins for short, 60 mins for medium
    setQuizResults(null);
    setShowQuestionGrid(false);
    setShowSubmitConfirm(false);
    setCompanions([]);
    setChatList([
      {
        id: "sys-welcome",
        senderName: "V-Study Bot",
        senderAvatar: "",
        message: `📚 Chào mừng bạn đến với phòng tự học ${subject.name}! Hãy trả lời chính xác các câu hỏi để tích lũy XP.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      }
    ]);
  };

  // Start "BÀI KIỂM TRA SIÊU TỔNG HỢP" (100 Questions - 2 Hours)
  const handleStartSuperExam = () => {
    const superSubject = getSuperExamSubject();
    setSelectedSubject(superSubject);
    setIsQuizActive(true);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserScore(0);
    const qCount = superSubject.questions.length;
    setUserAnswers(new Array(qCount).fill(null));
    setFlaggedQuestions(new Array(qCount).fill(false));
    setQuizTimer(7200); // 2 Hours = 120 Mins = 7,200 Seconds
    setQuizResults(null);
    setShowQuestionGrid(false);
    setShowSubmitConfirm(false);
    if (onSelectSubFilter) onSelectSubFilter("super_exam");
    setCompanions([]);
    setChatList([
      {
        id: "sys-super-exam",
        senderName: "V-Study Exam Bot",
        senderAvatar: "",
        message: `⚡ CHÍNH THỨC BẮT ĐẦU BÀI KIỂM TRA SIÊU TỔNG HỢP (100 CÂU HỎI - 2 TIẾNG)! Chúc bạn bình tĩnh, tự tin và đạt thành tích cao nhất!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      }
    ]);
  };

  // Option select handler
  const handleSelectOption = (optionIdx: number) => {
    setSelectedOption(optionIdx);
    const updated = [...userAnswers];
    updated[currentQuestionIndex] = optionIdx;
    setUserAnswers(updated);
    playSynthSound("tick");
  };

  // Toggle flag for current question
  const handleToggleFlag = (idx: number) => {
    const updated = [...flaggedQuestions];
    updated[idx] = !updated[idx];
    setFlaggedQuestions(updated);
  };

  // Submit Answer grading for single question mode or proceed
  const handleSubmitSingleAnswer = () => {
    if (selectedOption === null || !selectedSubject) return;
    setIsAnswerSubmitted(true);
    const correctIdx = selectedSubject.questions[currentQuestionIndex].correctIndex;

    if (selectedOption === correctIdx) {
      setUserScore((prev) => prev + 1);
      playSynthSound("correct");
    } else {
      playSynthSound("incorrect");
    }
  };

  // Final Submit Exam Handler
  const handleConfirmSubmitExam = () => {
    if (!selectedSubject) return;
    playSynthSound("complete");

    const questions = selectedSubject.questions;
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    let tieuHocCorrect = 0;
    let thcsCorrect = 0;
    let thptCorrect = 0;

    questions.forEach((q, idx) => {
      const userAns = userAnswers[idx];
      if (userAns === null) {
        unansweredCount++;
      } else if (userAns === q.correctIndex) {
        correctCount++;
        if (idx < 30) tieuHocCorrect++;
        else if (idx < 65) thcsCorrect++;
        else thptCorrect++;
      } else {
        wrongCount++;
      }
    });

    const isSuper = selectedSubject.id === "super_exam";
    const totalTimeAllowed = isSuper ? 7200 : 300;
    const timeSpent = Math.max(1, totalTimeAllowed - quizTimer);

    const scoreGained = correctCount * 10 + (correctCount === questions.length ? 100 : 0);

    setQuizResults({
      correct: correctCount,
      wrong: wrongCount,
      unanswered: unansweredCount,
      scoreGained: scoreGained,
      timeSpent: timeSpent,
      tieuHocCorrect,
      thcsCorrect,
      thptCorrect
    });

    // Update accumulated student record & history
    const newTotalScore = totalScore + scoreGained;
    const newTotalQuestions = totalQuestionsAnswered + questions.length;
    const newTotalCorrect = totalCorrectAnswers + correctCount;
    const newTotalWrong = totalWrongAnswers + wrongCount;

    setTotalScore(newTotalScore);
    setTotalQuestionsAnswered(newTotalQuestions);
    setTotalCorrectAnswers(newTotalCorrect);
    setTotalWrongAnswers(newTotalWrong);

    localStorage.setItem("vstudy_total_score", newTotalScore.toString());
    localStorage.setItem("vstudy_total_questions", newTotalQuestions.toString());
    localStorage.setItem("vstudy_total_correct", newTotalCorrect.toString());
    localStorage.setItem("vstudy_total_wrong", newTotalWrong.toString());

    const newHistoryItem: ExamHistoryItem = {
      id: `hist-${Date.now()}`,
      date: new Date().toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      subjectName: selectedSubject.name,
      level: selectedSubject.level || (selectedSubject.id === "super_exam" ? "super_exam" : "all"),
      totalQuestions: questions.length,
      correct: correctCount,
      wrong: wrongCount,
      unanswered: unansweredCount,
      scoreGained: scoreGained,
      timeSpent: timeSpent
    };

    const updatedHistory = [newHistoryItem, ...historyList];
    setHistoryList(updatedHistory);
    localStorage.setItem("vstudy_history", JSON.stringify(updatedHistory));

    setShowSubmitConfirm(false);
    setShowQuestionGrid(false);
    setCompletedQuizzes((prev) => prev + 1);

    setXp((prev) => {
      const nextXp = prev + scoreGained;
      const targetXp = level * 100;
      if (nextXp >= targetXp) {
        setLevel((l) => l + 1);
        return nextXp - targetXp;
      }
      return nextXp;
    });

    setChatList((prev) => [
      ...prev,
      {
        id: `sys-ended-${Date.now()}`,
        senderName: "Hệ thống V-Study",
        senderAvatar: "",
        message: `🏆 Bạn đã hoàn thành ${selectedSubject.name} đạt ${correctCount}/${questions.length} điểm!`,
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
      senderName: "Bạn (Sĩ tử)",
      senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      message: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setChatList((prev) => [...prev, newMsg]);
    setCustomChatMessage("");

    setTimeout(() => {
      if (companions.length > 0) {
        const reactor = companions[Math.floor(Math.random() * companions.length)];
        let reply = "Cố lên nha cả nhà! Làm hết bài nào!";
        if (msgText.includes("Chào") || msgText.includes("hi")) {
          reply = `Chào bạn ${reactor.name} nhé! Thi tốt nha!`;
        } else if (msgText.includes("khó") || msgText.includes("hóc búa")) {
          reply = "Câu hỏi thiết kế rất sát thực tế, tập trung đọc kỹ đề nhé.";
        } else if (msgText.includes("xong") || msgText.includes("hoàn thành")) {
          reply = "Bái phục bạn luôn! Phong độ tuyệt vời!";
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

  // Format timer HH:MM:SS
  const formatTimerDisplay = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Calculate total answered count
  const totalAnsweredCount = userAnswers.filter((a) => a !== null).length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 text-zinc-100 font-sans select-none pb-24">
      
      {/* 1. TOP ACADEMIC HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-[#cc1827] text-zinc-300 hover:text-white transition-all border border-white/5 cursor-pointer shadow-md"
            title="Trở về Trang chủ Vplay"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-[#cc1827] text-white font-black text-[10px] uppercase tracking-wider">
                V-STUDY 2026
              </span>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                Hệ Thống Luyện Thi & Học Tập Toàn Cấp
              </h1>
            </div>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              Tích hợp ngân hàng hơn 100+ bài tập trắc nghiệm Tiểu Học, THCS và THPT
            </p>
          </div>
        </div>

        {/* Global Student Stats Cards & Tra Cứu Học Bạ */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/60 p-2.5 rounded-2xl border border-white/5 shadow-md">
          <div className="flex flex-wrap items-center gap-3">
            {/* Level Progress */}
            <div className="px-3 py-1.5 bg-zinc-950 rounded-xl flex items-center gap-2 border border-white/5">
              <div className="w-7 h-7 rounded-lg bg-[#cc1827]/10 border border-[#cc1827]/30 flex items-center justify-center text-xs font-black text-[#cc1827]">
                Cấp {level}
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

            {/* Total Score / Điểm Tích Lũy */}
            <div className="px-3 py-1.5 bg-zinc-950 rounded-xl flex items-center gap-2.5 border border-white/5">
              <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400/20 animate-pulse" />
              <div className="text-left">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Tổng Điểm</p>
                <p className="text-xs font-black text-amber-400">{totalScore} Điểm</p>
              </div>
            </div>

            {/* Total Quizzes Done */}
            <div className="px-3 py-1.5 bg-zinc-950 rounded-xl flex items-center gap-2.5 border border-white/5">
              <Award className="w-5 h-5 text-emerald-400" />
              <div className="text-left">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Bài Đã Thi</p>
                <p className="text-xs font-black text-white">{completedQuizzes} Đề Luyện</p>
              </div>
            </div>
          </div>

          {/* TRA CỨU HỌC BẠ BUTTON */}
          <button
            onClick={() => {
              if (onSelectSubFilter) {
                onSelectSubFilter(subFilter === "hoc_ba" ? "all" : "hoc_ba");
              }
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-900/30 hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider ring-1 ring-amber-300/40"
          >
            <GraduationCap className="w-4 h-4 text-slate-950" />
            <span>{subFilter === "hoc_ba" ? "Quay Lại Danh Sách Môn" : "Tra Cứu Học Bạ"}</span>
          </button>
        </div>
      </div>

      {/* MODULE MODE SELECTION TABS */}
      {!isQuizActive && (
        <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-zinc-900/80 border border-white/10 shadow-lg">
          <button
            onClick={() => {
              setModeTab("quizzes");
              if (onSelectSubFilter && subFilter === "hoc_ba") onSelectSubFilter("all");
            }}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              modeTab === "quizzes"
                ? "bg-[#cc1827] text-white shadow-lg shadow-[#cc1827]/30 border border-red-500/30"
                : "bg-zinc-950/60 text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <BookOpen className="w-4 h-4 text-white" />
            <span>1. Trắc Nghiệm Tổng Hợp</span>
          </button>

          <button
            onClick={() => {
              setModeTab("english_cefr");
              if (onSelectSubFilter && subFilter === "hoc_ba") onSelectSubFilter("all");
            }}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              modeTab === "english_cefr"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/40 border border-blue-400/30"
                : "bg-zinc-950/60 text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <Languages className="w-4 h-4 text-blue-300" />
            <span>2. Tiếng Anh (A2, B1, B1+, B2)</span>
            <span className="px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px]">4 Kỹ Năng</span>
          </button>

          <button
            onClick={() => {
              setModeTab("literature_writing");
              if (onSelectSubFilter && subFilter === "hoc_ba") onSelectSubFilter("all");
            }}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              modeTab === "literature_writing"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40 border border-emerald-400/30"
                : "bg-zinc-950/60 text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <PenTool className="w-4 h-4 text-emerald-300" />
            <span>3. Luyện Viết Văn THCS/THPT</span>
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px]">AI Chấm Điểm</span>
          </button>

          <button
            onClick={() => {
              setModeTab("hoc_ba");
              if (onSelectSubFilter) onSelectSubFilter("hoc_ba");
            }}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              modeTab === "hoc_ba"
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-lg shadow-amber-900/40 border border-amber-300/40"
                : "bg-zinc-950/60 text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <GraduationCap className="w-4 h-4 text-slate-950" />
            <span>4. Tra Cứu Học Bạ</span>
          </button>
        </div>
      )}

      {/* 2. MAIN ACTIVE STUDY AREA */}
      {!isQuizActive ? (
        modeTab === "english_cefr" ? (
          <EnglishCefrModule onAddScoreAndXp={handleAddScoreAndXp} playSynthSound={playSynthSound} />
        ) : modeTab === "literature_writing" ? (
          <LiteratureWritingModule onAddScoreAndXp={handleAddScoreAndXp} playSynthSound={playSynthSound} />
        ) : modeTab === "hoc_ba" || subFilter === "hoc_ba" ? (
          /* TRANG TRA CỨU HỌC BẠ FULL VIEW */
          <div className="space-y-6 text-left">
            {/* Title Header Banner */}
            <div className="p-6 rounded-3xl bg-zinc-900/80 border border-amber-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                    HỌC BẠ ĐIỆN TỬ SĨ TỬ
                  </span>
                  <h2 className="text-2xl font-black text-white tracking-tight mt-1">
                    Tra Cứu Học Bạ & Lịch Sử Làm Bài Tập
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Theo dõi tiến độ, bảng điểm và toàn bộ lịch sử thi trực tuyến
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onSelectSubFilter) onSelectSubFilter("all");
                }}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl border border-white/10 transition-colors cursor-pointer flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại danh sách môn</span>
              </button>
            </div>

            {/* Student Personal Banner & Editable Name */}
            <div className="p-5 rounded-3xl bg-zinc-900/80 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-400 flex items-center justify-center text-white font-black text-2xl shadow-md border border-white/20 shrink-0">
                  {studentName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {isEditingStudentName ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tempStudentName}
                          onChange={(e) => setTempStudentName(e.target.value)}
                          className="px-3 py-1.5 bg-zinc-950 border border-amber-500/50 rounded-xl text-sm text-white focus:outline-none"
                          placeholder="Nhập tên của bạn..."
                        />
                        <button
                          onClick={() => {
                            if (tempStudentName.trim()) {
                              setStudentName(tempStudentName.trim());
                              localStorage.setItem("vstudy_student_name", tempStudentName.trim());
                            }
                            setIsEditingStudentName(false);
                          }}
                          className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                        >
                          Lưu
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-black text-white">{studentName}</h3>
                        <button
                          onClick={() => {
                            setTempStudentName(studentName);
                            setIsEditingStudentName(true);
                          }}
                          className="p-1 text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer"
                          title="Đổi tên sĩ tử"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
                    <span className="text-amber-400 font-bold">Cấp Độ {level}</span> • <span>Hệ Thống Luyện Thi Quốc Gia V-Study</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-zinc-950 px-4 py-2.5 rounded-2xl border border-white/5 text-xs text-zinc-300">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Chuỗi học tập: <strong className="text-white">{streak} ngày</strong></span>
              </div>
            </div>

            {/* Core KPI Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* 1. Tổng Điểm Tích Lũy */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-zinc-900 to-zinc-950 border border-amber-500/20">
                <div className="flex items-center justify-between text-amber-400 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Tổng Điểm Thưởng</span>
                  <Zap className="w-5 h-5" />
                </div>
                <p className="text-3xl font-black text-amber-400">{totalScore}</p>
                <p className="text-[11px] text-zinc-500 mt-1">+10 điểm/câu đúng</p>
              </div>

              {/* 2. Số Câu Đã Làm */}
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/10">
                <div className="flex items-center justify-between text-indigo-400 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Số Câu Đã Giải</span>
                  <FileText className="w-5 h-5" />
                </div>
                <p className="text-3xl font-black text-white">{totalQuestionsAnswered}</p>
                <p className="text-[11px] text-zinc-500 mt-1">{completedQuizzes} đề thi hoàn thành</p>
              </div>

              {/* 3. Số Câu Đúng */}
              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
                <div className="flex items-center justify-between text-emerald-400 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Số Câu Đúng</span>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-3xl font-black text-emerald-400">{totalCorrectAnswers}</p>
                <p className="text-[11px] text-emerald-500/80 mt-1">Đã tích lũy chính xác</p>
              </div>

              {/* 4. Số Câu Sai */}
              <div className="p-5 rounded-2xl bg-red-950/30 border border-red-500/20">
                <div className="flex items-center justify-between text-red-400 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Số Câu Sai</span>
                  <XCircle className="w-5 h-5" />
                </div>
                <p className="text-3xl font-black text-red-400">{totalWrongAnswers}</p>
                <p className="text-[11px] text-red-500/80 mt-1">Cần rèn luyện thêm</p>
              </div>
            </div>

            {/* Accuracy & Progress Bar */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-zinc-300 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Tỷ Lệ Giải Đề Chính Xác Chốt Hạ:
                </span>
                <span className="text-emerald-400 font-mono font-black text-base">
                  {totalQuestionsAnswered > 0 ? Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-3.5 bg-zinc-950 rounded-full overflow-hidden border border-white/5 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" 
                  style={{ width: `${totalQuestionsAnswered > 0 ? Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100) : 0}%` }} 
                />
              </div>
            </div>

            {/* EXAM HISTORY TABLE SECTION */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Lịch Sử Làm Bài Tập & Kỳ Thi
                </h3>

                {/* Clear History Button */}
                {historyList.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử làm bài tập?")) {
                        setHistoryList([]);
                        localStorage.removeItem("vstudy_history");
                      }
                    }}
                    className="px-3.5 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 rounded-xl text-xs font-bold text-red-400 hover:text-red-200 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa Lịch Sử</span>
                  </button>
                )}
              </div>

              {/* Filters & Search bar for history */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm môn học, bài kiểm tra..."
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Level dropdown filter */}
                <div className="flex items-center gap-1 w-full sm:w-auto bg-zinc-900 border border-white/10 rounded-xl p-1 shrink-0">
                  <button
                    onClick={() => setHistoryFilterLevel("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      historyFilterLevel === "all" ? "bg-amber-500 text-slate-950" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Tất Cả
                  </button>
                  <button
                    onClick={() => setHistoryFilterLevel("super_exam")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      historyFilterLevel === "super_exam" ? "bg-amber-500 text-slate-950" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Siêu Tổng Hợp
                  </button>
                  <button
                    onClick={() => setHistoryFilterLevel("thpt")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      historyFilterLevel === "thpt" ? "bg-amber-500 text-slate-950" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    THPT
                  </button>
                  <button
                    onClick={() => setHistoryFilterLevel("thcs")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      historyFilterLevel === "thcs" ? "bg-amber-500 text-slate-950" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    THCS
                  </button>
                  <button
                    onClick={() => setHistoryFilterLevel("tieu_hoc")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      historyFilterLevel === "tieu_hoc" ? "bg-amber-500 text-slate-950" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Tiểu Học
                  </button>
                </div>
              </div>

              {/* History List Table / Cards */}
              {historyList.length === 0 ? (
                <div className="p-12 text-center bg-zinc-900/40 rounded-3xl border border-white/5 space-y-3">
                  <FileText className="w-10 h-10 text-zinc-600 mx-auto" />
                  <p className="text-sm text-zinc-400 font-medium">Chưa có lịch sử làm bài tập nào.</p>
                  <p className="text-xs text-zinc-500">Hãy hoàn thành các bài thi để tích lũy điểm và học bạ!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {historyList
                    .filter((item) => {
                      const matchesLevel = historyFilterLevel === "all" || item.level === historyFilterLevel;
                      const matchesSearch =
                        !historySearchQuery.trim() ||
                        item.subjectName.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
                        item.date.includes(historySearchQuery);
                      return matchesLevel && matchesSearch;
                    })
                    .map((item) => {
                      const percent = Math.round((item.correct / item.totalQuestions) * 100);
                      return (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-900 border border-white/5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                                item.level === "super_exam" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                                item.level === "thpt" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                                item.level === "thcs" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                                "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              }`}>
                                {item.level === "super_exam" ? "Siêu Tổng Hợp" : item.level.toUpperCase()}
                              </span>
                              <h4 className="text-sm font-bold text-white">{item.subjectName}</h4>
                            </div>
                            <p className="text-xs text-zinc-400 flex items-center gap-3 font-mono">
                              <span>📅 {item.date}</span>
                              <span>⏱️ {Math.floor(item.timeSpent / 60)} phút {item.timeSpent % 60}s</span>
                            </p>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                            <div className="text-right">
                              <div className="text-sm font-black text-emerald-400">
                                {item.correct}/{item.totalQuestions} câu ({percent}%)
                              </div>
                              <div className="text-xs text-amber-400 font-bold">
                                +{item.scoreGained} điểm thưởng
                              </div>
                            </div>

                            <div className={`px-3 py-1.5 rounded-xl text-xs font-black ${
                              percent >= 80 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                              percent >= 50 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                              "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}>
                              {percent >= 80 ? "Xuất Sắc" : percent >= 50 ? "Đạt" : "Cần Ôn Lại"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        ) : (
        <div className="space-y-6 text-left">
          
          {/* HERO BANNER: BÀI KIỂM TRA SIÊU TỔNG HỢP 100 CÂU - 2 TIẾNG */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950/90 via-amber-950/60 to-zinc-950 border border-amber-500/30 p-6 md:p-8 shadow-2xl">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-red-600/15 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-900/40">
                  <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
                  <span>KỲ THI QUỐC GIA MÔ PHỎNG V-STUDY</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                  BÀI KIỂM TRA SIÊU TỔNG HỢP (100 CÂU HỎI • 2 TIẾNG)
                </h2>

                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-sans">
                  Bài thi tổng hợp toàn bộ câu hỏi trắc nghiệm của tất cả môn học từ <strong>Lớp 1 đến Lớp 12</strong> (Tiểu Học, THCS, THPT). Đánh giá toàn diện kiến thức, rèn luyện áp lực thời gian chuẩn 120 phút.
                </p>

                {/* Features Badges */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Thời gian: 120 phút (2 tiếng)</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-red-500/20 text-red-300 text-xs font-bold flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-red-400" />
                    <span>Ngân hàng 100 câu trắc nghiệm</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <Grid className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Bảng 100 câu & Đánh dấu review</span>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <div className="w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
                <button
                  onClick={handleStartSuperExam}
                  className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 hover:from-red-500 hover:to-yellow-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-red-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-3 uppercase tracking-wider ring-2 ring-amber-300/50"
                >
                  <Play className="w-5 h-5 fill-slate-950" />
                  <span>Vào Thi Siêu Tổng Hợp Ngay</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sub-Category Navigation & Search Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-zinc-900/40 p-2.5 rounded-2xl border border-white/5">
            {/* Level Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <button
                onClick={() => { setActiveLevel("all"); if (onSelectSubFilter) onSelectSubFilter("all"); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeLevel === "all" && subFilter !== "super_exam"
                    ? "bg-[#cc1827] text-white shadow-lg shadow-[#cc1827]/25"
                    : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Khóa học</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-black/30 rounded-full font-mono">
                  {subjectsData.length}
                </span>
              </button>

              <button
                onClick={() => { setActiveLevel("tieu_hoc"); if (onSelectSubFilter) onSelectSubFilter("tieu_hoc"); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeLevel === "tieu_hoc"
                    ? "bg-amber-600 text-white shadow-lg shadow-amber-600/25"
                    : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <Baby className="w-3.5 h-3.5 text-amber-400" />
                <span>V-Study Tiểu học</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-black/30 rounded-full font-mono">
                  {subjectsData.filter((s) => s.level === "tieu_hoc").length} môn
                </span>
              </button>

              <button
                onClick={() => { setActiveLevel("thcs"); if (onSelectSubFilter) onSelectSubFilter("thcs"); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeLevel === "thcs"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <School className="w-3.5 h-3.5 text-blue-400" />
                <span>V-Study THCS</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-black/30 rounded-full font-mono">
                  {subjectsData.filter((s) => s.level === "thcs").length} môn
                </span>
              </button>

              <button
                onClick={() => { setActiveLevel("thpt"); if (onSelectSubFilter) onSelectSubFilter("thpt"); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeLevel === "thpt"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
                    : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>V-Study THPT</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-black/30 rounded-full font-mono">
                  {subjectsData.filter((s) => s.level === "thpt").length} môn
                </span>
              </button>

              {/* Super Exam Quick Tab */}
              <button
                onClick={handleStartSuperExam}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md hover:brightness-110`}
              >
                <Zap className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                <span>⚡ Kiểm Tra Siêu Tổng Hợp (100 câu)</span>
              </button>
            </div>

            {/* Keyword Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm môn học hoặc lớp..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 text-white placeholder-zinc-500 text-xs rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-[#cc1827] transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <BookOpenCheck className="w-5 h-5 text-red-500" />
              <span>
                {activeLevel === "all" && "Tất Cả Danh Mục Môn Học (Hơn 100+ Câu Hỏi)"}
                {activeLevel === "tieu_hoc" && "Danh Mục V-Study Tiểu Học (Lớp 1 - 5)"}
                {activeLevel === "thcs" && "Danh Mục V-Study THCS (Lớp 6 - 9)"}
                {activeLevel === "thpt" && "Danh Mục V-Study THPT (Lớp 10 - 12)"}
              </span>
            </h2>
            <span className="text-xs text-zinc-500 font-mono">
              Hiển thị {filteredSubjects.length} môn học
            </span>
          </div>

          {/* Grid of Subjects */}
          {filteredSubjects.length === 0 ? (
            <div className="p-12 text-center bg-zinc-900/20 rounded-3xl border border-white/5 space-y-2">
              <p className="text-zinc-400 text-sm font-bold">Không tìm thấy môn học nào phù hợp với từ khóa "{searchKeyword}".</p>
              <button
                onClick={() => { setSearchKeyword(""); setActiveLevel("all"); }}
                className="text-xs text-[#cc1827] hover:underline cursor-pointer"
              >
                Xóa bộ lọc tìm kiếm
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredSubjects.map((subj) => (
                <div
                  key={subj.id}
                  onClick={() => handleStartQuiz(subj)}
                  className="group relative rounded-2xl border border-white/5 bg-zinc-900/30 overflow-hidden hover:border-[#cc1827]/40 hover:bg-zinc-900/60 p-5 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[190px] shadow-lg hover:shadow-[0_8px_30px_rgba(204,24,39,0.08)]"
                >
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${subj.color}`} />
                  
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl filter drop-shadow-md">{subj.icon}</span>
                      <span className="text-[10px] font-black uppercase bg-white/5 text-zinc-300 px-2.5 py-0.5 rounded-full border border-white/10">
                        {subj.grade}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white group-hover:text-[#cc1827] transition-colors">
                        {subj.name}
                      </h3>
                      <p className="text-xs text-zinc-400 font-medium font-sans mt-1 line-clamp-2">
                        {subj.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-zinc-500 group-hover:text-white transition-all mt-4 pt-2.5 border-t border-white/5">
                    <span className="text-emerald-400 font-mono text-[11px] bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-800/30">
                      {subj.questions.length} Câu Hỏi
                    </span>
                    <div className="flex items-center gap-1 text-[#cc1827] font-extrabold">
                      <span>Vào học</span>
                      <Play className="w-3.5 h-3.5 fill-[#cc1827] text-[#cc1827]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Educational Guidelines */}
          <div className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-3xl border border-white/5 space-y-3 mt-6">
            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>Chế độ Phòng Đồng Hành THPT & Kỳ Thi Mới</span>
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Khi bạn khởi động học ở bất cứ môn học nào hoặc tham gia <strong>Bài Kiểm Tra Siêu Tổng Hợp</strong>, hệ thống V-Study sẽ tự động ghép phòng đồng hành với các học sinh trực tuyến khắp cả nước. Mọi thao tác thi, đánh dấu câu hỏi và xem đáp án chi tiết đều được tối ưu hóa chuẩn mực cho kỳ thi quốc gia 2026.
            </p>
          </div>
        </div>
      )
    ) : (
        /* QUIZ LOBBY & CLASSROOM ACTIVE SYSTEM */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT AREA (COL-SPAN 8): QUIZ ENGINE & EXPLANATIONS */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Top Stats Bar of Active Room */}
            <div className="p-4 bg-zinc-900/80 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 bg-black/40 rounded-xl border border-white/5">{selectedSubject?.icon}</span>
                <div className="text-left">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>{selectedSubject?.name}</span>
                    {selectedSubject?.id === "super_exam" && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30">
                        100 CÂU • 2 TIẾNG
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                    {selectedSubject?.grade}
                  </p>
                </div>
              </div>

              {/* Timer Progress */}
              <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-black ${
                quizTimer < 600 
                  ? "bg-red-950/80 border-red-500/50 text-red-400 animate-pulse" 
                  : "bg-black/60 border-white/10 text-amber-300"
              }`}>
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-xs">
                  {formatTimerDisplay(quizTimer)}
                </span>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2">
                {selectedSubject?.questions && selectedSubject.questions.length > 5 && !quizResults && (
                  <button
                    onClick={() => setShowQuestionGrid(!showQuestionGrid)}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-amber-500/20"
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>Bảng câu ({totalAnsweredCount}/{selectedSubject.questions.length})</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    if (selectedSubject?.id === "super_exam") {
                      setShowSubmitConfirm(true);
                    } else {
                      setIsQuizActive(false);
                      setCompanions([]);
                    }
                  }}
                  className="px-3.5 py-1.5 bg-red-900/40 hover:bg-red-600 text-red-200 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-red-500/30"
                >
                  Nộp Bài Thi
                </button>
              </div>
            </div>

            {/* QUESTION GRID PALETTE MODAL / DRAWER */}
            {showQuestionGrid && selectedSubject && (
              <div className="p-4 bg-zinc-950/90 rounded-2xl border border-amber-500/30 space-y-3 text-left animate-fadeIn">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Grid className="w-4 h-4" /> Bảng Danh Sách {selectedSubject.questions.length} Câu Hỏi
                  </span>
                  <button
                    onClick={() => setShowQuestionGrid(false)}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    Đóng
                  </button>
                </div>

                {/* Grid legend */}
                <div className="flex flex-wrap items-center gap-3 text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Đã trả lời</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-400" /> Đánh dấu xem lại</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-500" /> Câu hiện tại</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-zinc-800" /> Chưa làm</span>
                </div>

                {/* Grid Buttons */}
                <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-20 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {selectedSubject.questions.map((q, idx) => {
                    const isAns = userAnswers[idx] !== null;
                    const isFlag = flaggedQuestions[idx];
                    const isCurrent = currentQuestionIndex === idx;

                    let bg = "bg-zinc-800 text-zinc-400 hover:bg-zinc-700";
                    if (isAns) bg = "bg-emerald-600 text-white font-bold";
                    if (isFlag) bg = "bg-amber-500 text-slate-950 font-black";
                    if (isCurrent) bg += " ring-2 ring-blue-400 font-extrabold scale-105";

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentQuestionIndex(idx);
                          setSelectedOption(userAnswers[idx]);
                          setShowQuestionGrid(false);
                        }}
                        className={`h-7 text-[10px] rounded-md transition-all cursor-pointer flex items-center justify-center ${bg}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CONFIRM SUBMIT MODAL */}
            {showSubmitConfirm && selectedSubject && (
              <div className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-3xl border border-red-500/40 text-center space-y-4 shadow-2xl animate-fadeIn">
                <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">Xác Nhận Nộp Bài Thi</h3>
                  <p className="text-xs text-zinc-300">
                    Bạn đã trả lời <strong className="text-emerald-400">{totalAnsweredCount}</strong> / <strong>{selectedSubject.questions.length}</strong> câu hỏi.
                    {selectedSubject.questions.length - totalAnsweredCount > 0 && (
                      <span className="text-amber-400 block font-bold mt-1">
                        Còn {selectedSubject.questions.length - totalAnsweredCount} câu chưa chọn đáp án!
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleConfirmSubmitExam}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl cursor-pointer"
                  >
                    Nộp Bài Ngay
                  </button>
                  <button
                    onClick={() => setShowSubmitConfirm(false)}
                    className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Tiếp Tục Làm Bài
                  </button>
                </div>
              </div>
            )}

            {/* QUIZ COMPLETION / RESULTS VIEW */}
            {quizResults ? (
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-2xl text-left">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="text-center space-y-2">
                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                    HOÀN THÀNH BÀI THI KẾT QUẢ RỰC RỠ!
                  </h2>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                    Bạn đã vượt qua bài thi {selectedSubject?.name}. Kết quả đã được lưu trữ vào hệ thống bảng vàng V-Study.
                  </p>
                </div>

                {/* Score breakdown metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto py-2">
                  <div className="bg-zinc-950 p-3.5 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Đúng</p>
                    <p className="text-2xl font-black text-emerald-400 mt-1">{quizResults.correct} Câu</p>
                  </div>
                  <div className="bg-zinc-950 p-3.5 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Sai</p>
                    <p className="text-2xl font-black text-red-400 mt-1">{quizResults.wrong} Câu</p>
                  </div>
                  <div className="bg-zinc-950 p-3.5 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Tỷ Lệ Đúng</p>
                    <p className="text-2xl font-black text-amber-300 mt-1">
                      {Math.round((quizResults.correct / (selectedSubject?.questions.length || 1)) * 100)}%
                    </p>
                  </div>
                  <div className="bg-zinc-950 p-3.5 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">XP Cộng</p>
                    <p className="text-2xl font-black text-purple-300 mt-1">+{quizResults.scoreGained} XP</p>
                  </div>
                </div>

                {/* Breakdown by level for Super Exam */}
                {selectedSubject?.id === "super_exam" && (
                  <div className="bg-zinc-950/60 p-4 rounded-2xl border border-amber-500/20 space-y-3">
                    <p className="text-xs font-black text-amber-300 uppercase tracking-wider text-center border-b border-white/5 pb-2">
                      ⚡ Phân Tích Kết Quả Theo Cấp Học
                    </p>
                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                      <div className="bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/20">
                        <p className="text-[10px] text-amber-400 font-bold uppercase">Tiểu học (Lớp 1-5)</p>
                        <p className="text-base font-black text-white mt-1">{quizResults.tieuHocCorrect} / 30 Câu</p>
                      </div>
                      <div className="bg-blue-950/20 p-2.5 rounded-xl border border-blue-500/20">
                        <p className="text-[10px] text-blue-400 font-bold uppercase">THCS (Lớp 6-9)</p>
                        <p className="text-base font-black text-white mt-1">{quizResults.thcsCorrect} / 35 Câu</p>
                      </div>
                      <div className="bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/20">
                        <p className="text-[10px] text-emerald-400 font-bold uppercase">THPT (Lớp 10-12)</p>
                        <p className="text-base font-black text-white mt-1">{quizResults.thptCorrect} / 35 Câu</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Answer Key Review Header */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-red-500" />
                      <span>Xem Lại Đáp Án & Giải Thích Chi Tiết</span>
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs">
                      <button
                        onClick={() => setReviewFilter("all")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          reviewFilter === "all" ? "bg-[#cc1827] text-white" : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        Tất cả ({selectedSubject?.questions.length})
                      </button>
                      <button
                        onClick={() => setReviewFilter("wrong")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          reviewFilter === "wrong" ? "bg-red-600 text-white" : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        Câu sai ({quizResults.wrong})
                      </button>
                    </div>
                  </div>

                  {/* Review Questions List */}
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {selectedSubject?.questions.map((q, idx) => {
                      const userChoice = userAnswers[idx];
                      const isCorrect = userChoice === q.correctIndex;

                      if (reviewFilter === "wrong" && isCorrect) return null;

                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border text-left space-y-2 text-xs ${
                            isCorrect 
                              ? "bg-emerald-950/20 border-emerald-500/30" 
                              : "bg-red-950/20 border-red-500/30"
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span className={isCorrect ? "text-emerald-400" : "text-red-400"}>
                              Câu {idx + 1}: {q.subjectTag || selectedSubject.name}
                            </span>
                            <span className="font-mono text-[10px]">
                              {isCorrect ? "✓ Chính xác" : "✗ Chưa đúng"}
                            </span>
                          </div>

                          <p className="font-bold text-white leading-relaxed">{q.question}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {q.options.map((opt, optIdx) => {
                              const isUserChoice = userChoice === optIdx;
                              const isCorrectAnswer = q.correctIndex === optIdx;

                              let style = "bg-zinc-900 border-white/5 text-zinc-400";
                              if (isCorrectAnswer) style = "bg-emerald-950 border-emerald-500 text-emerald-300 font-bold";
                              else if (isUserChoice && !isCorrectAnswer) style = "bg-red-950 border-red-500 text-red-300 font-bold";

                              return (
                                <div key={optIdx} className={`p-2.5 rounded-xl border flex items-center gap-2 ${style}`}>
                                  <span className="w-5 h-5 rounded bg-black/30 flex items-center justify-center font-bold text-[10px] shrink-0">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span>{opt}</span>
                                </div>
                              );
                            })}
                          </div>

                          <div className="p-2.5 bg-black/40 rounded-xl text-zinc-300 text-[11px] font-sans border border-white/5 mt-2">
                            <strong className="text-amber-400">Giải thích:</strong> {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-4">
                  <button
                    onClick={() => {
                      if (selectedSubject?.id === "super_exam") {
                        handleStartSuperExam();
                      } else if (selectedSubject) {
                        handleStartQuiz(selectedSubject);
                      }
                    }}
                    className="px-6 py-3 bg-[#cc1827] hover:bg-[#cc1827]/90 text-white font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                  >
                    <RefreshCcw className="w-4 h-4" /> Làm Bài Thi Khác
                  </button>
                  <button
                    onClick={() => {
                      setIsQuizActive(false);
                      setSelectedSubject(null);
                      setCompanions([]);
                    }}
                    className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Về Danh Mục V-Study
                  </button>
                </div>
              </div>
            ) : (
              /* QUIZ CORE COMPONENT */
              selectedSubject && (
                <div className="bg-zinc-900/40 rounded-3xl border border-white/5 p-6 space-y-6 shadow-xl text-left">
                  {/* Progress Indicators */}
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-black">
                        CÂU HỎI {currentQuestionIndex + 1}/{selectedSubject.questions.length}
                      </span>
                      {selectedSubject.questions[currentQuestionIndex].subjectTag && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                          {selectedSubject.questions[currentQuestionIndex].subjectTag}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleFlag(currentQuestionIndex)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                        flaggedQuestions[currentQuestionIndex]
                          ? "bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md"
                          : "bg-zinc-800 text-zinc-400 hover:text-white border-white/5"
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>{flaggedQuestions[currentQuestionIndex] ? "Đã đánh dấu" : "Đánh dấu xem lại"}</span>
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 transition-all duration-300"
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
                      let btnStyle = "bg-zinc-950/60 border-white/5 hover:bg-zinc-900/90 hover:border-white/15 text-zinc-300";

                      if (isSelected) {
                        btnStyle = "bg-amber-500/10 border-amber-500 text-amber-300 font-bold shadow-lg shadow-amber-950/20 ring-1 ring-amber-500/50";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full p-4 rounded-2xl border text-left text-xs md:text-sm font-semibold transition-all duration-150 flex items-center justify-between gap-4 cursor-pointer ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-xl border flex items-center justify-center font-black shrink-0 text-xs ${
                              isSelected ? "bg-amber-500 text-slate-950 border-amber-400" : "bg-white/5 border-white/10 text-zinc-400"
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{option}</span>
                          </div>

                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* NAV CONTROLS */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        if (currentQuestionIndex > 0) {
                          const prevIdx = currentQuestionIndex - 1;
                          setCurrentQuestionIndex(prevIdx);
                          setSelectedOption(userAnswers[prevIdx]);
                        }
                      }}
                      disabled={currentQuestionIndex === 0}
                      className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-200 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Câu Trước</span>
                    </button>

                    <button
                      onClick={() => {
                        if (currentQuestionIndex + 1 < selectedSubject.questions.length) {
                          const nextIdx = currentQuestionIndex + 1;
                          setCurrentQuestionIndex(nextIdx);
                          setSelectedOption(userAnswers[nextIdx]);
                        } else {
                          setShowSubmitConfirm(true);
                        }
                      }}
                      className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-red-900/20"
                    >
                      <span>{currentQuestionIndex + 1 === selectedSubject.questions.length ? "Xem Bảng Nộp Bài" : "Câu Tiếp Theo"}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
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
                  <span className="text-xs font-black text-white uppercase tracking-wider">Bạn thi cùng ({companions.length})</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {companions.length === 0 ? (
                <div className="py-6 text-center text-zinc-500 text-xs">
                  <span className="animate-spin inline-block mr-1.5">⏳</span> Đang ghép phòng học trực tuyến...
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
                            {comp.status === "done" && "Đã hoàn thành bài thi!"}
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
                <span className="text-xs font-black text-white uppercase tracking-wider">Hộp Trò Chuyện Phòng Thi</span>
              </div>

              {/* Message Feed container */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 py-1 text-left scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent custom-scrollbar max-h-[250px]">
                {chatList.map((chat) => {
                  if (chat.senderName === "Hệ thống V-Study" || chat.senderName === "V-Study Exam Bot") {
                    return (
                      <div key={chat.id} className="text-[10px] text-amber-300 bg-amber-950/30 border border-amber-500/20 px-2.5 py-1.5 rounded-lg text-center font-medium font-sans">
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
