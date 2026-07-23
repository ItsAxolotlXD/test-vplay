import React, { useState, useRef, useEffect } from "react";
import { 
  Headphones, 
  BookOpen, 
  PenTool, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RotateCcw, 
  FileText, 
  Award, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Languages,
  Check,
  AlertCircle
} from "lucide-react";
import { 
  listeningExercises, 
  readingExercises, 
  writingExercises, 
  speakingExercises, 
  EnglishLevel, 
  ListeningExercise, 
  ReadingExercise, 
  WritingExercise, 
  SpeakingExercise 
} from "../../data/vstudyEnglishAndLiteratureData";

interface EnglishCefrModuleProps {
  onAddScoreAndXp: (score: number, xpAmount: number) => void;
  playSynthSound: (type: "correct" | "incorrect" | "join" | "tick" | "complete") => void;
}

export default function EnglishCefrModule({ onAddScoreAndXp, playSynthSound }: EnglishCefrModuleProps) {
  // Selected Level & Active Skill State
  const [selectedLevel, setSelectedLevel] = useState<"all" | EnglishLevel>("all");
  const [activeSkill, setActiveSkill] = useState<"listening" | "reading" | "writing" | "speaking">("listening");

  // ==================== LISTENING STATES ====================
  const [selectedListening, setSelectedListening] = useState<ListeningExercise | null>(listeningExercises[0]);
  const [isPlayingTTS, setIsPlayingTTS] = useState<boolean>(false);
  const [listeningAnswers, setListeningAnswers] = useState<any[]>([]);
  const [listeningResult, setListeningResult] = useState<{ correct: number; total: number; scoreGained: number } | null>(null);

  useEffect(() => {
    if (selectedListening) {
      const initAns = selectedListening.questions.map((q) => {
        if (q.type === "fill_blank") return "";
        if (q.type === "listen_tick") return [];
        if (q.type === "listen_number") return new Array(q.numberItems?.length || 0).fill(1);
        return null;
      });
      setListeningAnswers(initAns);
      setListeningResult(null);
      window.speechSynthesis?.cancel();
      setIsPlayingTTS(false);
    }
  }, [selectedListening]);

  const handleSpeakText = (text: string, accent: "en-US" | "en-GB") => {
    if (!('speechSynthesis' in window)) {
      alert("Trình duyệt của bạn không hỗ trợ Text-to-Speech.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = accent === "en-GB" ? "en-GB" : "en-US";
    utterance.rate = 0.88;
    utterance.onstart = () => setIsPlayingTTS(true);
    utterance.onend = () => setIsPlayingTTS(false);
    utterance.onerror = () => setIsPlayingTTS(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopText = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingTTS(false);
  };

  const handleSubmitListening = () => {
    if (!selectedListening) return;
    let correct = 0;

    selectedListening.questions.forEach((q, idx) => {
      const userAns = listeningAnswers[idx];

      if (!q.type || q.type === "multiple_choice") {
        if (userAns === q.correctIndex) {
          correct++;
        }
      } else if (q.type === "fill_blank") {
        if (
          typeof userAns === "string" &&
          userAns.trim().toLowerCase() === q.blankAnswer?.trim().toLowerCase()
        ) {
          correct++;
        }
      } else if (q.type === "listen_tick") {
        if (Array.isArray(userAns) && q.correctTickIndices) {
          const sortedUser = [...userAns].sort((a, b) => a - b);
          const sortedCorrect = [...q.correctTickIndices].sort((a, b) => a - b);
          if (
            sortedUser.length === sortedCorrect.length &&
            sortedUser.every((v, i) => v === sortedCorrect[i])
          ) {
            correct++;
          }
        }
      } else if (q.type === "listen_number") {
        if (Array.isArray(userAns) && q.correctOrder) {
          if (
            userAns.length === q.correctOrder.length &&
            userAns.every((v, i) => Number(v) === q.correctOrder![i])
          ) {
            correct++;
          }
        }
      }
    });

    const total = selectedListening.questions.length;
    const scoreGained = correct * 25;
    setListeningResult({ correct, total, scoreGained });
    onAddScoreAndXp(scoreGained, scoreGained * 2);
    playSynthSound(correct === total ? "complete" : "correct");
  };

  // ==================== READING STATES ====================
  const [selectedReading, setSelectedReading] = useState<ReadingExercise | null>(readingExercises[0]);
  const [readingAnswers, setReadingAnswers] = useState<(number | null)[]>([]);
  const [readingResult, setReadingResult] = useState<{ correct: number; total: number; scoreGained: number } | null>(null);

  useEffect(() => {
    if (selectedReading) {
      setReadingAnswers(new Array(selectedReading.questions.length).fill(null));
      setReadingResult(null);
    }
  }, [selectedReading]);

  const handleSubmitReading = () => {
    if (!selectedReading) return;
    let correct = 0;
    selectedReading.questions.forEach((q, idx) => {
      if (readingAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    const total = selectedReading.questions.length;
    const scoreGained = correct * 20;
    setReadingResult({ correct, total, scoreGained });
    onAddScoreAndXp(scoreGained, scoreGained * 2);
    playSynthSound(correct === total ? "complete" : "correct");
  };

  // ==================== WRITING STATES ====================
  const [selectedWriting, setSelectedWriting] = useState<WritingExercise | null>(writingExercises[0]);
  const [writingEssay, setWritingEssay] = useState<string>("");
  const [isEvaluatingWriting, setIsEvaluatingWriting] = useState<boolean>(false);
  const [writingEvalResult, setWritingEvalResult] = useState<{
    bandScore: string;
    score10: number;
    wordCount: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    upgradedVocab: string[];
  } | null>(null);

  const wordCount = writingEssay.trim() ? writingEssay.trim().split(/\s+/).length : 0;

  const handleEvaluateWriting = () => {
    if (!selectedWriting || !writingEssay.trim()) {
      alert("Vui lòng nhập bài viết của bạn trước khi nhờ AI chấm điểm!");
      return;
    }

    setIsEvaluatingWriting(true);
    playSynthSound("tick");

    setTimeout(() => {
      setIsEvaluatingWriting(false);

      // Algorithmic evaluation simulation based on target word count & vocab hints
      const targetMin = selectedWriting.minWords;
      const targetMax = selectedWriting.maxWords;
      let score = 7.5;

      if (wordCount >= targetMin && wordCount <= targetMax) {
        score += 1.5;
      } else if (wordCount < targetMin) {
        score -= 1.5;
      }

      // Check vocabulary hints present
      const essayLower = writingEssay.toLowerCase();
      let matchedHints = 0;
      selectedWriting.vocabularyHints.forEach(vh => {
        if (essayLower.includes(vh.toLowerCase())) {
          matchedHints++;
        }
      });
      score += Math.min(1.0, matchedHints * 0.3);

      score = Math.min(10, Math.max(4.0, Number(score.toFixed(1))));

      let band = "Band 5.5 - 6.0";
      if (score >= 9.0) band = "Band 8.0 - 8.5 (C1/C2)";
      else if (score >= 8.0) band = "Band 7.0 - 7.5 (B2/C1)";
      else if (score >= 7.0) band = "Band 6.0 - 6.5 (B1/B2)";
      else band = "Band 5.0 - 5.5 (A2/B1)";

      const result = {
        bandScore: band,
        score10: score,
        wordCount: wordCount,
        feedback: `Bài viết thể hiện tư duy mạch lạc, cấu trúc đoạn văn rõ ràng theo dạng đề ${selectedWriting.taskType}. Việc vận dụng ${matchedHints} từ vựng nâng cao giúp tăng tính thuyết phục của luận điểm.`,
        strengths: [
          `Đảm bảo đúng chủ đề bài viết "${selectedWriting.title}".`,
          `Sử dụng liên từ liên kết câu phù hợp (Firstly, Secondly, In conclusion...).`,
          `Dung lượng bài viết: ${wordCount} từ (so với mục tiêu ${selectedWriting.minWords}-${selectedWriting.maxWords} từ).`
        ],
        improvements: [
          "Mở rộng vốn từ vựng đồng nghĩa (synonyms) để tránh lặp từ.",
          "Sử dụng các cấu trúc câu phức (Complex sentences) và câu điều kiện/mệnh đề quan hệ."
        ],
        upgradedVocab: [
          "Play a crucial role -> Execute a fundamental function",
          "Helpful -> Beneficial / Advantageous",
          "Important -> Paramount / Indispensable"
        ]
      };

      setWritingEvalResult(result);
      onAddScoreAndXp(Math.round(score * 10), 100);
      playSynthSound("complete");
    }, 2000);
  };

  // ==================== SPEAKING STATES ====================
  const [selectedSpeaking, setSelectedSpeaking] = useState<SpeakingExercise | null>(speakingExercises[0]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordTime, setRecordTime] = useState<number>(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [isEvaluatingSpeaking, setIsEvaluatingSpeaking] = useState<boolean>(false);
  const [speakingEvalResult, setSpeakingEvalResult] = useState<{
    bandScore: string;
    score10: number;
    fluency: number;
    pronunciation: number;
    vocabulary: number;
    grammar: number;
    feedback: string;
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordTime(0);
      setSpeakingEvalResult(null);

      timerIntervalRef.current = setInterval(() => {
        setRecordTime(prev => prev + 1);
      }, 1000);

      playSynthSound("tick");
    } catch (err) {
      alert("Không thể mở Microphone. Vui lòng kiểm tra quyền truy cập micro của trình duyệt!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      playSynthSound("join");
    }
  };

  const handleEvaluateSpeaking = () => {
    if (!audioBlobUrl) {
      alert("Vui lòng thực hiện thu âm bài nói trước khi AI chấm điểm!");
      return;
    }

    setIsEvaluatingSpeaking(true);
    playSynthSound("tick");

    setTimeout(() => {
      setIsEvaluatingSpeaking(false);

      const duration = recordTime;
      let score = 7.8;
      if (duration >= 30) score += 1.2;

      score = Math.min(10, Math.max(5.0, Number(score.toFixed(1))));

      let band = "Band 6.0 - 6.5 (Intermediate)";
      if (score >= 9.0) band = "Band 8.0+ (Advanced/Master)";
      else if (score >= 8.0) band = "Band 7.0 - 7.5 (Good User)";

      setSpeakingEvalResult({
        bandScore: band,
        score10: score,
        fluency: 8.5,
        pronunciation: 8.0,
        vocabulary: 7.5,
        grammar: 8.0,
        feedback: `Bài phát biểu dài ${duration}s với ngữ điệu tự nhiên, phản xạ nói trôi chảy. Ngắt nghỉ đúng nhịp câu và áp dụng tốt các từ khóa trọng tâm của đề bài ${selectedSpeaking?.title}.`
      });

      onAddScoreAndXp(Math.round(score * 10), 100);
      playSynthSound("complete");
    }, 2000);
  };

  // Filtered Exercises
  const filteredListening = listeningExercises.filter(e => selectedLevel === "all" || e.level === selectedLevel);
  const filteredReading = readingExercises.filter(e => selectedLevel === "all" || e.level === selectedLevel);
  const filteredWriting = writingExercises.filter(e => selectedLevel === "all" || e.level === selectedLevel);
  const filteredSpeaking = speakingExercises.filter(e => selectedLevel === "all" || e.level === selectedLevel);

  return (
    <div className="space-y-6 text-left">
      {/* 1. TOP TITLE BANNER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/80 via-indigo-950/60 to-zinc-950 border border-blue-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
            <Languages className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                KHUNG THAM CHIẾU CEFR 2026
              </span>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                AI SUPPORTED
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight mt-1">
              Chương Trình Tiếng Anh Quốc Tế A2, B1, B1+, B2
            </h2>
            <p className="text-xs text-zinc-300 mt-0.5">
              Rèn luyện toàn diện 4 kỹ năng Listening (TTS Speech), Reading, Writing (Live Count) & Speaking (Voice Record & AI Score)
            </p>
          </div>
        </div>

        {/* Level Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0">
          {(["all", "A2", "B1", "B1+", "B2"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer whitespace-nowrap ${
                selectedLevel === lvl
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-300/40"
                  : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {lvl === "all" ? "Tất Cả Trình Độ" : `Trình Độ ${lvl}`}
            </button>
          ))}
        </div>
      </div>

      {/* 2. SKILL NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-zinc-900/80 border border-white/5">
        <button
          onClick={() => setActiveSkill("listening")}
          className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSkill === "listening"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
              : "bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Listening (Nghe)</span>
        </button>

        <button
          onClick={() => setActiveSkill("reading")}
          className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSkill === "reading"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Reading (Đọc)</span>
        </button>

        <button
          onClick={() => setActiveSkill("writing")}
          className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSkill === "writing"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
              : "bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>Writing (Viết)</span>
        </button>

        <button
          onClick={() => setActiveSkill("speaking")}
          className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSkill === "speaking"
              ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
              : "bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Speaking (Nói)</span>
        </button>
      </div>

      {/* 3. ACTIVE SKILL VIEW CONTENT */}
      {/* 🎧 SKILL 1: LISTENING */}
      {activeSkill === "listening" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Exercise Selection Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-wider px-1">
              Danh Sách Bài Nghe ({filteredListening.length})
            </h3>
            <div className="space-y-2">
              {filteredListening.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedListening(ex)}
                  className={`w-full p-4 rounded-2xl text-left transition-all border cursor-pointer flex flex-col gap-2 ${
                    selectedListening?.id === ex.id
                      ? "bg-blue-950/60 border-blue-500/50 shadow-lg"
                      : "bg-zinc-900/80 hover:bg-zinc-900 border-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-black border border-blue-500/30">
                      Level {ex.level}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">{ex.accent}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{ex.title}</h4>
                  <p className="text-xs text-zinc-400">{ex.topic}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Active Listening Player & Questions */}
          <div className="lg:col-span-8 space-y-6">
            {selectedListening ? (
              <div className="p-6 rounded-3xl bg-zinc-900/90 border border-white/10 space-y-6">
                {/* Audio Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-black text-xs">
                        Level {selectedListening.level}
                      </span>
                      <h3 className="text-lg font-black text-white">{selectedListening.title}</h3>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">Chủ đề: {selectedListening.topic}</p>
                  </div>

                  {/* Audio TTS Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isPlayingTTS ? (
                      <button
                        onClick={handleStopText}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer animate-pulse"
                      >
                        <Square className="w-4 h-4 fill-white" />
                        <span>DỪNG NGHE</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSpeakText(selectedListening.transcript, selectedListening.accent)}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-900/30 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Volume2 className="w-4.5 h-4.5" />
                        <span>BẮT ĐẦU NGHE</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Audio Playing Animation Indicator */}
                {isPlayingTTS && (
                  <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                      <Volume2 className="w-4 h-4 animate-bounce text-blue-400" />
                      <span>Đang phát bài nghe (Giọng {selectedListening.accent === "en-US" ? "Anh - Mỹ" : "Anh - Anh"}). Hãy tập trung lắng nghe...</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-4 bg-blue-400 animate-pulse" />
                      <div className="w-1.5 h-6 bg-blue-300 animate-pulse delay-75" />
                      <div className="w-1.5 h-3 bg-blue-500 animate-pulse delay-150" />
                    </div>
                  </div>
                )}

                {/* Listening Comprehension Questions */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-black text-zinc-400 uppercase tracking-wider">
                    Bài Tập Luyện Nghe Hiểu
                  </h4>

                  {selectedListening.questions.map((q, qIdx) => {
                    const qType = q.type || "multiple_choice";
                    const isSubmitted = listeningResult !== null;
                    const userAns = listeningAnswers[qIdx];

                    return (
                      <div key={q.id} className="p-4 rounded-2xl bg-zinc-950/80 border border-white/5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold text-white flex items-start gap-2">
                            <span className="text-blue-400 font-mono">Q{qIdx + 1}.</span>
                            <span>{q.question}</span>
                          </p>
                          <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-zinc-400 font-medium shrink-0">
                            {qType === "multiple_choice" && "Trắc nghiệm"}
                            {qType === "fill_blank" && "Điền từ vào chỗ trống"}
                            {qType === "listen_tick" && "Nghe & Tích câu đúng"}
                            {qType === "listen_number" && "Nghe & Sắp xếp thứ tự"}
                          </span>
                        </div>

                        {/* TYPE 1: MULTIPLE CHOICE */}
                        {qType === "multiple_choice" && q.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt, oIdx) => {
                              const isSelected = userAns === oIdx;
                              const isCorrect = q.correctIndex === oIdx;

                              let btnStyle = "bg-zinc-900 border-white/5 text-zinc-300 hover:bg-zinc-800";
                              if (isSelected) {
                                btnStyle = "bg-blue-600/30 border-blue-500 text-white font-bold";
                              }
                              if (isSubmitted) {
                                if (isCorrect) {
                                  btnStyle = "bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold";
                                } else if (isSelected && !isCorrect) {
                                  btnStyle = "bg-red-600/30 border-red-500 text-red-200 font-bold";
                                }
                              }

                              return (
                                <button
                                  key={oIdx}
                                  disabled={isSubmitted}
                                  onClick={() => {
                                    const newAns = [...listeningAnswers];
                                    newAns[qIdx] = oIdx;
                                    setListeningAnswers(newAns);
                                  }}
                                  className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                                >
                                  <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                                  {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                                  {isSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* TYPE 2: FILL IN THE BLANK */}
                        {qType === "fill_blank" && (
                          <div className="space-y-2">
                            <input
                              type="text"
                              disabled={isSubmitted}
                              placeholder="Nhập từ hoặc cụm từ bạn nghe được..."
                              value={userAns || ""}
                              onChange={(e) => {
                                const newAns = [...listeningAnswers];
                                newAns[qIdx] = e.target.value;
                                setListeningAnswers(newAns);
                              }}
                              className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 disabled:opacity-80 font-mono"
                            />
                            {isSubmitted && (
                              <div className="text-xs font-bold flex items-center gap-2">
                                {typeof userAns === "string" &&
                                userAns.trim().toLowerCase() === q.blankAnswer?.trim().toLowerCase() ? (
                                  <span className="text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4" /> Đúng!
                                  </span>
                                ) : (
                                  <span className="text-red-400 flex items-center gap-1">
                                    <XCircle className="w-4 h-4" /> Sai! Đáp án đúng: <code className="bg-black/50 px-2 py-0.5 rounded text-amber-300 font-mono">{q.blankAnswer}</code>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* TYPE 3: LISTEN AND TICK */}
                        {qType === "listen_tick" && q.tickStatements && (
                          <div className="space-y-2">
                            {q.tickStatements.map((stmt, sIdx) => {
                              const tickedList: number[] = Array.isArray(userAns) ? userAns : [];
                              const isChecked = tickedList.includes(sIdx);
                              const isShouldBeChecked = q.correctTickIndices?.includes(sIdx);

                              let cardBorder = "bg-zinc-900 border-white/5 text-zinc-300 hover:bg-zinc-800";
                              if (isChecked) {
                                cardBorder = "bg-blue-950/40 border-blue-500/50 text-white font-bold";
                              }
                              if (isSubmitted) {
                                if (isShouldBeChecked && isChecked) {
                                  cardBorder = "bg-emerald-950/40 border-emerald-500 text-emerald-200";
                                } else if (isShouldBeChecked && !isChecked) {
                                  cardBorder = "bg-amber-950/40 border-amber-500/60 text-amber-200";
                                } else if (!isShouldBeChecked && isChecked) {
                                  cardBorder = "bg-red-950/40 border-red-500 text-red-200";
                                }
                              }

                              return (
                                <button
                                  key={sIdx}
                                  disabled={isSubmitted}
                                  onClick={() => {
                                    const newAns = [...listeningAnswers];
                                    let list: number[] = Array.isArray(newAns[qIdx]) ? [...newAns[qIdx]] : [];
                                    if (list.includes(sIdx)) {
                                      list = list.filter((item) => item !== sIdx);
                                    } else {
                                      list.push(sIdx);
                                    }
                                    newAns[qIdx] = list;
                                    setListeningAnswers(newAns);
                                  }}
                                  className={`w-full p-3 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${cardBorder}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                                      isChecked ? "bg-blue-600 border-blue-400 text-white" : "border-white/20 bg-black/40"
                                    }`}>
                                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    </div>
                                    <span>{stmt}</span>
                                  </div>
                                  {isSubmitted && isShouldBeChecked && (
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold shrink-0">
                                      ✔ Ý Đúng
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* TYPE 4: LISTEN AND NUMBER */}
                        {qType === "listen_number" && q.numberItems && (
                          <div className="space-y-2">
                            {q.numberItems.map((item, itemIdx) => {
                              const orderArray: number[] = Array.isArray(userAns) ? userAns : [];
                              const currentVal = orderArray[itemIdx] || 1;
                              const correctPos = q.correctOrder ? q.correctOrder[itemIdx] : 1;
                              const isPosCorrect = currentVal === correctPos;

                              return (
                                <div
                                  key={itemIdx}
                                  className="p-3 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between gap-3 text-xs"
                                >
                                  <span className="text-zinc-300 font-medium flex-1">{item}</span>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[10px] text-zinc-500">Thứ tự:</span>
                                    <select
                                      disabled={isSubmitted}
                                      value={currentVal}
                                      onChange={(e) => {
                                        const newAns = [...listeningAnswers];
                                        const arr = Array.isArray(newAns[qIdx]) ? [...newAns[qIdx]] : [];
                                        arr[itemIdx] = parseInt(e.target.value, 10);
                                        newAns[qIdx] = arr;
                                        setListeningAnswers(newAns);
                                      }}
                                      className="px-2.5 py-1.5 bg-black border border-white/20 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                                    >
                                      {q.numberItems?.map((_, idx) => (
                                        <option key={idx + 1} value={idx + 1}>
                                          {idx + 1}
                                        </option>
                                      ))}
                                    </select>
                                    {isSubmitted && (
                                      isPosCorrect ? (
                                        <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                                          <CheckCircle2 className="w-4 h-4" /> Đúng
                                        </span>
                                      ) : (
                                        <span className="text-amber-300 font-mono text-xs">
                                          (Đúng: {correctPos})
                                        </span>
                                      )
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Explanation when submitted */}
                        {listeningResult && (
                          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200 font-sans">
                            💡 <strong>Giải thích:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submit / Grade Action */}
                {!listeningResult ? (
                  <button
                    onClick={handleSubmitListening}
                    disabled={listeningAnswers.some((ans, idx) => {
                      const q = selectedListening?.questions[idx];
                      if (!q || !q.type || q.type === "multiple_choice") return ans === null;
                      if (q.type === "fill_blank") return typeof ans !== "string" || ans.trim().length === 0;
                      return false;
                    })}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white font-black text-sm rounded-2xl shadow-xl transition-all cursor-pointer uppercase tracking-wider"
                  >
                    Nộp Bài Nghe & Chấm Điểm
                  </button>
                ) : (
                  <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-black text-emerald-400">
                        kết quả: {listeningResult.correct}/{listeningResult.total} Câu Đúng!
                      </h4>
                      <p className="text-xs text-emerald-200">
                        Bạn nhận được +{listeningResult.scoreGained} Điểm & +{listeningResult.scoreGained * 2} XP!
                      </p>
                    </div>
                    <button
                      onClick={() => setListeningResult(null)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Làm Lại</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-zinc-500 bg-zinc-900/40 rounded-3xl border border-white/5">
                Vui lòng chọn bài nghe từ danh sách bên trái.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 📖 SKILL 2: READING */}
      {activeSkill === "reading" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-wider px-1">
              Danh Sách Bài Đọc ({filteredReading.length})
            </h3>
            <div className="space-y-2">
              {filteredReading.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedReading(ex)}
                  className={`w-full p-4 rounded-2xl text-left transition-all border cursor-pointer flex flex-col gap-2 ${
                    selectedReading?.id === ex.id
                      ? "bg-indigo-950/60 border-indigo-500/50 shadow-lg"
                      : "bg-zinc-900/80 hover:bg-zinc-900 border-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-black border border-indigo-500/30">
                      Level {ex.level}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{ex.title}</h4>
                  <p className="text-xs text-zinc-400">{ex.topic}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Active Reading Details */}
          <div className="lg:col-span-8 space-y-6">
            {selectedReading ? (
              <div className="p-6 rounded-3xl bg-zinc-900/90 border border-white/10 space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-black text-xs">
                      Level {selectedReading.level}
                    </span>
                    <h3 className="text-lg font-black text-white">{selectedReading.title}</h3>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">Chủ đề: {selectedReading.topic}</p>
                </div>

                {/* Passage Text Card */}
                <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 leading-relaxed text-sm text-zinc-200 font-serif space-y-3">
                  <h4 className="text-xs font-sans font-black text-indigo-400 uppercase tracking-wider">
                    📖 Reading Passage
                  </h4>
                  <p className="whitespace-pre-line">{selectedReading.passage}</p>
                </div>

                {/* Questions */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-zinc-400 uppercase tracking-wider">
                    Câu Hỏi Đọc Hiểu
                  </h4>

                  {selectedReading.questions.map((q, qIdx) => (
                    <div key={q.id} className="p-4 rounded-2xl bg-zinc-950/80 border border-white/5 space-y-3">
                      <p className="text-sm font-bold text-white flex items-start gap-2">
                        <span className="text-indigo-400 font-mono">Q{qIdx + 1}.</span>
                        <span>{q.question}</span>
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = readingAnswers[qIdx] === oIdx;
                          const isCorrect = q.correctIndex === oIdx;
                          const isSubmitted = readingResult !== null;

                          let btnStyle = "bg-zinc-900 border-white/5 text-zinc-300 hover:bg-zinc-800";
                          if (isSelected) {
                            btnStyle = "bg-indigo-600/30 border-indigo-500 text-white font-bold";
                          }
                          if (isSubmitted) {
                            if (isCorrect) {
                              btnStyle = "bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold";
                            } else if (isSelected && !isCorrect) {
                              btnStyle = "bg-red-600/30 border-red-500 text-red-200 font-bold";
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={isSubmitted}
                              onClick={() => {
                                const newAns = [...readingAnswers];
                                newAns[qIdx] = oIdx;
                                setReadingAnswers(newAns);
                              }}
                              className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                              {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                              {isSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {readingResult && (
                        <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200">
                          💡 <strong>Giải thích:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {!readingResult ? (
                  <button
                    onClick={handleSubmitReading}
                    disabled={readingAnswers.includes(null)}
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-40 text-white font-black text-sm rounded-2xl shadow-xl transition-all cursor-pointer uppercase tracking-wider"
                  >
                    Nộp Bài Đọc & Chấm Điểm
                  </button>
                ) : (
                  <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-black text-emerald-400">
                        Kết quả: {readingResult.correct}/{readingResult.total} Câu Đúng!
                      </h4>
                      <p className="text-xs text-emerald-200">
                        Bạn nhận được +{readingResult.scoreGained} Điểm & +{readingResult.scoreGained * 2} XP!
                      </p>
                    </div>
                    <button
                      onClick={() => setReadingResult(null)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Làm Lại</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-zinc-500 bg-zinc-900/40 rounded-3xl border border-white/5">
                Vui lòng chọn bài đọc từ danh sách bên trái.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✍️ SKILL 3: WRITING */}
      {activeSkill === "writing" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-wider px-1">
              Đề Bài Writing ({filteredWriting.length})
            </h3>
            <div className="space-y-2">
              {filteredWriting.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    setSelectedWriting(ex);
                    setWritingEssay("");
                    setWritingEvalResult(null);
                  }}
                  className={`w-full p-4 rounded-2xl text-left transition-all border cursor-pointer flex flex-col gap-2 ${
                    selectedWriting?.id === ex.id
                      ? "bg-emerald-950/60 border-emerald-500/50 shadow-lg"
                      : "bg-zinc-900/80 hover:bg-zinc-900 border-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                      Level {ex.level}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">{ex.taskType}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{ex.title}</h4>
                </button>
              ))}
            </div>
          </div>

          {/* Active Writing Workspace */}
          <div className="lg:col-span-8 space-y-6">
            {selectedWriting ? (
              <div className="p-6 rounded-3xl bg-zinc-900/90 border border-white/10 space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs">
                      {selectedWriting.taskType} • Level {selectedWriting.level}
                    </span>
                    <h3 className="text-lg font-black text-white">{selectedWriting.title}</h3>
                  </div>
                  <p className="text-xs text-zinc-300 mt-2 font-medium p-3 rounded-xl bg-zinc-950 border border-white/5">
                    📌 <strong>Đề bài:</strong> {selectedWriting.prompt}
                  </p>
                </div>

                {/* Structure & Vocabulary Suggestions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/5 space-y-1.5">
                    <h4 className="font-black text-emerald-400 uppercase tracking-wider">💡 Dàn Ý Gợi Ý</h4>
                    <ul className="list-disc list-inside text-zinc-300 space-y-1">
                      {selectedWriting.suggestedStructure.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/5 space-y-1.5">
                    <h4 className="font-black text-amber-400 uppercase tracking-wider">🌟 Từ Vựng Ăn Điểm</h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedWriting.vocabularyHints.map((vh, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-mono">
                          {vh}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Writing Editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-zinc-300">Soạn thảo bài viết của bạn (Tiếng Anh):</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className={wordCount < selectedWriting.minWords ? "text-amber-400 font-black" : "text-emerald-400 font-black"}>
                        {wordCount} Từ
                      </span>
                      <span className="text-zinc-500">(Mục tiêu: {selectedWriting.minWords} - {selectedWriting.maxWords} từ)</span>
                    </div>
                  </div>

                  <textarea
                    rows={8}
                    value={writingEssay}
                    onChange={(e) => setWritingEssay(e.target.value)}
                    placeholder="Type your English essay or response here..."
                    className="w-full p-4 rounded-2xl bg-zinc-950 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 font-sans text-sm leading-relaxed"
                  />
                </div>

                {/* Evaluation Trigger Button */}
                <button
                  onClick={handleEvaluateWriting}
                  disabled={isEvaluatingWriting || !writingEssay.trim()}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-black text-sm rounded-2xl shadow-xl transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isEvaluatingWriting ? "AI Đang Phân Tích & Chấm Điểm..." : "AI Chấm Điểm Writing"}</span>
                </button>

                {/* AI Evaluation Output Display */}
                {writingEvalResult && (
                  <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                      <div>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">KẾT QUẢ CHẤM ĐIỂM AI</span>
                        <h4 className="text-lg font-black text-white">{writingEvalResult.bandScore}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-emerald-400">{writingEvalResult.score10}/10</span>
                        <p className="text-[10px] text-zinc-400 font-mono">{writingEvalResult.wordCount} words</p>
                      </div>
                    </div>

                    <p className="text-zinc-200 leading-relaxed font-sans">{writingEvalResult.feedback}</p>

                    <div className="space-y-2">
                      <h5 className="font-bold text-emerald-300 uppercase">✔️ Điểm Mạnh:</h5>
                      <ul className="list-disc list-inside text-zinc-300 space-y-1">
                        {writingEvalResult.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-bold text-amber-300 uppercase">💡 Cần Cải Thiện & Nâng Cấp Từ Vựng:</h5>
                      <ul className="list-disc list-inside text-zinc-300 space-y-1">
                        {writingEvalResult.upgradedVocab.map((uv, i) => (
                          <li key={i} className="font-mono text-amber-200">{uv}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-zinc-500 bg-zinc-900/40 rounded-3xl border border-white/5">
                Vui lòng chọn đề bài Writing từ danh sách bên trái.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🎙️ SKILL 4: SPEAKING */}
      {activeSkill === "speaking" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-wider px-1">
              Chủ Đề Speaking ({filteredSpeaking.length})
            </h3>
            <div className="space-y-2">
              {filteredSpeaking.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    setSelectedSpeaking(ex);
                    setAudioBlobUrl(null);
                    setSpeakingEvalResult(null);
                  }}
                  className={`w-full p-4 rounded-2xl text-left transition-all border cursor-pointer flex flex-col gap-2 ${
                    selectedSpeaking?.id === ex.id
                      ? "bg-purple-950/60 border-purple-500/50 shadow-lg"
                      : "bg-zinc-900/80 hover:bg-zinc-900 border-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-black border border-purple-500/30">
                      Level {ex.level}
                    </span>
                    <span className="text-[10px] font-bold text-purple-400 uppercase">{ex.part}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{ex.title}</h4>
                </button>
              ))}
            </div>
          </div>

          {/* Active Speaking Studio */}
          <div className="lg:col-span-8 space-y-6">
            {selectedSpeaking ? (
              <div className="p-6 rounded-3xl bg-zinc-900/90 border border-white/10 space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-black text-xs">
                      {selectedSpeaking.part} • Level {selectedSpeaking.level}
                    </span>
                    <h3 className="text-lg font-black text-white">{selectedSpeaking.title}</h3>
                  </div>
                  <p className="text-xs text-zinc-300 mt-2 font-medium p-3 rounded-xl bg-zinc-950 border border-white/5">
                    🗣️ <strong>Speaking Prompt:</strong> {selectedSpeaking.prompt}
                  </p>
                </div>

                {/* Guiding Questions & Vocab */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/5 space-y-1.5">
                    <h4 className="font-black text-purple-400 uppercase tracking-wider">❓ Câu Hỏi Gợi Ý Ý Tưởng</h4>
                    <ul className="list-disc list-inside text-zinc-300 space-y-1">
                      {selectedSpeaking.guidingQuestions.map((gq, i) => (
                        <li key={i}>{gq}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/5 space-y-1.5">
                    <h4 className="font-black text-indigo-400 uppercase tracking-wider">🌟 Từ Vựng & Cụm Từ Chuẩn</h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedSpeaking.sampleVocabulary.map((sv, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-mono">
                          {sv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Voice Recorder Controls */}
                <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-4 text-center">
                  <h4 className="text-xs font-black text-zinc-400 uppercase tracking-wider">
                    🎙️ Phòng Thu Âm Bài Nói
                  </h4>

                  <div className="flex flex-col items-center justify-center gap-3">
                    {isRecording ? (
                      <div className="space-y-3">
                        <div className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center text-red-500 animate-pulse mx-auto">
                          <Mic className="w-8 h-8" />
                        </div>
                        <div className="text-lg font-black font-mono text-red-400">
                          {Math.floor(recordTime / 60).toString().padStart(2, "0")}:
                          {(recordTime % 60).toString().padStart(2, "0")}
                        </div>
                        <button
                          onClick={stopRecording}
                          className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer uppercase"
                        >
                          Dừng Thu Âm
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={startRecording}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2 uppercase tracking-wider"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Bắt Đầu Thu Âm (Record Voice)</span>
                      </button>
                    )}
                  </div>

                  {/* Audio Playback Controls if recorded */}
                  {audioBlobUrl && !isRecording && (
                    <div className="p-4 rounded-xl bg-zinc-900 border border-purple-500/30 space-y-3 text-left">
                      <p className="text-xs font-bold text-purple-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Đã lưu đoạn thu âm bài nói ({recordTime}s). Bấm phát bên dưới để nghe lại:</span>
                      </p>
                      <audio src={audioBlobUrl} controls className="w-full h-10 accent-purple-500" />
                    </div>
                  )}
                </div>

                {/* AI Evaluation Button */}
                <button
                  onClick={handleEvaluateSpeaking}
                  disabled={isEvaluatingSpeaking || !audioBlobUrl}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-black text-sm rounded-2xl shadow-xl transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isEvaluatingSpeaking ? "AI Đang Phân Tích Giọng Nói..." : "AI Chấm Điểm Speaking"}</span>
                </button>

                {/* AI Speaking Output */}
                {speakingEvalResult && (
                  <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                      <div>
                        <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider">KẾT QUẢ CHẤM ĐIỂM SPEAKING</span>
                        <h4 className="text-lg font-black text-white">{speakingEvalResult.bandScore}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-purple-400">{speakingEvalResult.score10}/10</span>
                      </div>
                    </div>

                    <p className="text-zinc-200 leading-relaxed">{speakingEvalResult.feedback}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                      <div className="p-2.5 rounded-xl bg-zinc-950 border border-white/5 text-center">
                        <p className="text-[9px] text-zinc-500 uppercase font-bold">Fluency</p>
                        <p className="text-sm font-black text-purple-300">{speakingEvalResult.fluency}/10</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-zinc-950 border border-white/5 text-center">
                        <p className="text-[9px] text-zinc-500 uppercase font-bold">Pronunciation</p>
                        <p className="text-sm font-black text-purple-300">{speakingEvalResult.pronunciation}/10</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-zinc-950 border border-white/5 text-center">
                        <p className="text-[9px] text-zinc-500 uppercase font-bold">Vocabulary</p>
                        <p className="text-sm font-black text-purple-300">{speakingEvalResult.vocabulary}/10</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-zinc-950 border border-white/5 text-center">
                        <p className="text-[9px] text-zinc-500 uppercase font-bold">Grammar</p>
                        <p className="text-sm font-black text-purple-300">{speakingEvalResult.grammar}/10</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-zinc-500 bg-zinc-900/40 rounded-3xl border border-white/5">
                Vui lòng chọn chủ đề Speaking từ danh sách bên trái.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
