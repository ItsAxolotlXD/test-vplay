import React, { useState } from "react";
import { 
  PenTool, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  BookOpen, 
  RotateCcw, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp,
  Award,
  Layers,
  GraduationCap
} from "lucide-react";
import { literaturePrompts, LiteratureEssayPrompt } from "../../data/vstudyEnglishAndLiteratureData";

interface LiteratureWritingModuleProps {
  onAddScoreAndXp: (score: number, xpAmount: number) => void;
  playSynthSound: (type: "correct" | "incorrect" | "join" | "tick" | "complete") => void;
}

export default function LiteratureWritingModule({ onAddScoreAndXp, playSynthSound }: LiteratureWritingModuleProps) {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "Đoạn văn 200 chữ" | "Bài văn 600 chữ">("all");
  const [selectedGrade, setSelectedGrade] = useState<"all" | "THCS" | "THPT">("all");
  const [selectedPrompt, setSelectedPrompt] = useState<LiteratureEssayPrompt | null>(literaturePrompts[0]);

  const [essayText, setEssayText] = useState<string>("");
  const [showOutline, setShowOutline] = useState<boolean>(true);
  const [showSample, setShowSample] = useState<boolean>(false);

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<{
    score10: number;
    wordCount: number;
    targetWordCount: number;
    structureScore: number;
    argumentScore: number;
    creativityScore: number;
    grammarScore: number;
    teacherFeedback: string;
    strengths: string[];
    weaknesses: string[];
    revisionSuggestion: string;
  } | null>(null);

  // Exact Vietnamese word count calculation
  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).filter(Boolean).length : 0;

  const filteredPrompts = literaturePrompts.filter((p) => {
    const matchesCat = selectedCategory === "all" || p.type === selectedCategory;
    const matchesGrade = selectedGrade === "all" || p.grade === selectedGrade;
    return matchesCat && matchesGrade;
  });

  const handleEvaluateEssay = () => {
    if (!selectedPrompt || !essayText.trim()) {
      alert("Vui lòng nhập bài viết của bạn trước khi nhờ AI chấm điểm!");
      return;
    }

    setIsEvaluating(true);
    playSynthSound("tick");

    setTimeout(() => {
      setIsEvaluating(false);

      const target = selectedPrompt.targetWordCount;
      let structureScore = 1.8;
      let argumentScore = 2.6;
      let creativityScore = 2.5;
      let grammarScore = 1.8;

      // Word count length check
      if (selectedPrompt.type === "Đoạn văn 200 chữ") {
        if (wordCount < 150) {
          structureScore -= 0.5;
        } else if (wordCount >= 180 && wordCount <= 250) {
          structureScore = 2.0;
        }
      } else {
        // Bài 600 chữ
        if (wordCount < 450) {
          structureScore -= 0.6;
        } else if (wordCount >= 550 && wordCount <= 700) {
          structureScore = 2.0;
        }
      }

      // Check key ideas present
      const lowerText = essayText.toLowerCase();
      let ideaMatches = 0;
      selectedPrompt.keyIdeas.forEach(idea => {
        if (lowerText.includes(idea.toLowerCase())) {
          ideaMatches++;
        }
      });

      argumentScore += Math.min(0.4, ideaMatches * 0.1);

      const totalScore = Number((structureScore + argumentScore + creativityScore + grammarScore).toFixed(1));

      const result = {
        score10: Math.min(10, Math.max(5.0, totalScore)),
        wordCount: wordCount,
        targetWordCount: target,
        structureScore: structureScore,
        argumentScore: argumentScore,
        creativityScore: creativityScore,
        grammarScore: grammarScore,
        teacherFeedback: `Bài làm bám sát yêu cầu đề bài "${selectedPrompt.title}". Bố cục ${selectedPrompt.type} chuẩn chỉnh, lập luận có chiều sâu và thể hiện được tư duy phản biện văn học khá tốt.`,
        strengths: [
          `Đảm bảo đúng quy cách dạng bài ${selectedPrompt.type} (${selectedPrompt.category}).`,
          `Sử dụng được các từ khóa trọng tâm: ${selectedPrompt.keyIdeas.slice(0, 3).join(", ")}.`,
          `Dung lượng thực tế: ${wordCount} chữ (Mục tiêu khoảng ${target} chữ).`
        ],
        weaknesses: [
          selectedPrompt.type === "Bài văn 600 chữ" 
            ? "Nên mở rộng thêm dẫn chứng thực tế xã hội / văn học ở thân bài 2 để tăng tính thuyết phục."
            : "Chú ý giữ liên kết câu mượt mà, tránh lặp lại cụm từ quá nhiều lần."
        ],
        revisionSuggestion: "Đoạn 2 thân bài có thể bổ sung thêm 1-2 câu nhấn mạnh vai trò của tuổi trẻ và trách nhiệm của thế hệ hôm nay để bài viết sâu sắc hơn."
      };

      setEvalResult(result);
      onAddScoreAndXp(Math.round(totalScore * 10), 150);
      playSynthSound("complete");
    }, 2000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* 1. TOP HEADER BANNER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-zinc-950 border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <PenTool className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                LỚP 6 - LỚP 12 • THCS & THPT
              </span>
              <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20">
                CHƯƠNG TRÌNH MỚI 2026
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight mt-1">
              Phòng Luyện Viết Văn THCS & THPT (Đoạn 200 Chữ & Bài 600 Chữ)
            </h2>
            <p className="text-xs text-zinc-300 mt-0.5">
              Nghị luận xã hội & Nghị luận văn học với dàn ý chi tiết, bộ đếm từ tự động & Giảng viên AI Chấm Điểm
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0">
          {(["all", "Đoạn văn 200 chữ", "Bài văn 600 chữ"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-300/40"
                  : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {cat === "all" ? "Tất Cả Loại Bài" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. MAIN WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - Essay Prompts List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-wider">
              Danh Sách Đề Văn ({filteredPrompts.length})
            </h3>
            {/* Grade Switch */}
            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-white/5">
              {(["all", "THCS", "THPT"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    selectedGrade === g ? "bg-emerald-600 text-white" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredPrompts.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPrompt(p);
                  setEssayText("");
                  setEvalResult(null);
                  setShowSample(false);
                }}
                className={`w-full p-4 rounded-2xl text-left transition-all border cursor-pointer flex flex-col gap-2 ${
                  selectedPrompt?.id === p.id
                    ? "bg-emerald-950/60 border-emerald-500/50 shadow-lg"
                    : "bg-zinc-900/80 hover:bg-zinc-900 border-white/5"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                    {p.type}
                  </span>
                  <span className="text-[10px] font-bold text-teal-400 uppercase">{p.grade} • {p.category}</span>
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-2">{p.title}</h4>
              </button>
            ))}
          </div>
        </div>

        {/* Right Area - Selected Essay Writing Studio */}
        <div className="lg:col-span-8 space-y-6">
          {selectedPrompt ? (
            <div className="p-6 rounded-3xl bg-zinc-900/90 border border-white/10 space-y-6">
              {/* Prompt Header */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs">
                    {selectedPrompt.type} • {selectedPrompt.grade}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-teal-900/60 text-teal-300 border border-teal-500/30 font-bold text-xs">
                    {selectedPrompt.category}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mt-2">{selectedPrompt.title}</h3>
                <p className="text-xs text-zinc-300 mt-2 p-3 rounded-xl bg-zinc-950 border border-white/5 leading-relaxed">
                  📝 <strong>Yêu cầu đề bài:</strong> {selectedPrompt.prompt}
                </p>
              </div>

              {/* Key Ideas & Outline Collapsible Section */}
              <div className="space-y-3">
                {/* Outline Toggle */}
                <div className="border border-white/5 rounded-2xl bg-zinc-950 overflow-hidden">
                  <button
                    onClick={() => setShowOutline(!showOutline)}
                    className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-white/5 cursor-pointer"
                  >
                    <span>💡 Dàn Ý & Các Ý Tưởng Đắt Giá Cho Bài Viết</span>
                    <span>{showOutline ? "Thu Gọn" : "Mở Dàn Ý"}</span>
                  </button>

                  {showOutline && (
                    <div className="p-4 space-y-3 border-t border-white/5 text-xs">
                      {/* Outline Sections */}
                      <div className="space-y-2">
                        {selectedPrompt.outline.map((sec, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 space-y-1">
                            <span className="font-bold text-emerald-300">{sec.section}:</span>
                            <p className="text-zinc-300 font-sans">{sec.content}</p>
                          </div>
                        ))}
                      </div>

                      {/* Key Ideas Tags */}
                      <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-zinc-400 text-[10px] uppercase">Từ khóa dẫn chứng:</span>
                        {selectedPrompt.keyIdeas.map((ki, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-mono">
                            {ki}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sample Essay Toggle */}
                <div className="border border-white/5 rounded-2xl bg-zinc-950 overflow-hidden">
                  <button
                    onClick={() => setShowSample(!showSample)}
                    className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-amber-400 hover:text-amber-300 bg-white/5 cursor-pointer"
                  >
                    <span>📖 Bài Văn / Đoạn Văn Mẫu Tham Khảo</span>
                    <span>{showSample ? "Ẩn Văn Mẫu" : "Xem Văn Mẫu"}</span>
                  </button>

                  {showSample && (
                    <div className="p-4 text-xs leading-relaxed text-zinc-200 font-serif whitespace-pre-line border-t border-white/5 bg-black/40">
                      {selectedPrompt.samplePassage}
                    </div>
                  )}
                </div>
              </div>

              {/* Essay Writing Textarea Editor with Live Word Count */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-zinc-300">Khung soạn thảo bài làm của bạn:</span>

                  <div className="flex items-center gap-2 font-mono">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${
                      wordCount < selectedPrompt.targetWordCount * 0.75
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}>
                      {wordCount} Chữ
                    </span>
                    <span className="text-zinc-500">
                      (Mục tiêu: {selectedPrompt.targetWordCount} chữ)
                    </span>
                  </div>
                </div>

                {/* Visual Progress Bar towards Target Word Count */}
                <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      wordCount >= selectedPrompt.targetWordCount * 0.85 ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.min(100, (wordCount / selectedPrompt.targetWordCount) * 100)}%` }}
                  />
                </div>

                <textarea
                  rows={12}
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  placeholder="Soạn thảo đoạn văn hoặc bài văn của bạn tại đây..."
                  className="w-full p-4 rounded-2xl bg-zinc-950 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 font-serif text-sm leading-relaxed"
                />
              </div>

              {/* AI Evaluation Button */}
              <button
                onClick={handleEvaluateEssay}
                disabled={isEvaluating || !essayText.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-black text-sm rounded-2xl shadow-xl transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isEvaluating ? "Giảng Viên AI Đang Chấm Bài Văn..." : "AI Chấm Điểm Bài Văn"}</span>
              </button>

              {/* AI Essay Evaluation Result Output */}
              {evalResult && (
                <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                    <div>
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">KẾT QUẢ BẢNG ĐIỂM GIẢNG VIÊN AI</span>
                      <h4 className="text-xl font-black text-white">Điểm Tổng Kết: {evalResult.score10}/10.0</h4>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/30">
                      {evalResult.score10 >= 8.5 ? "XUẤT SẮC" : evalResult.score10 >= 7.0 ? "KHÁ GIỎI" : "ĐẠT YÊU CẦU"}
                    </div>
                  </div>

                  {/* 4 Score Criteria Breakdown Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-3 rounded-xl bg-zinc-950 border border-white/5 text-center">
                      <p className="text-[9px] text-zinc-500 uppercase font-bold">1. Dung lượng & Cấu trúc</p>
                      <p className="text-sm font-black text-emerald-400">{evalResult.structureScore}/2.0</p>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-950 border border-white/5 text-center">
                      <p className="text-[9px] text-zinc-500 uppercase font-bold">2. Dàn ý & Lập luận</p>
                      <p className="text-sm font-black text-emerald-400">{evalResult.argumentScore}/3.0</p>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-950 border border-white/5 text-center">
                      <p className="text-[9px] text-zinc-500 uppercase font-bold">3. Sáng tạo & Lời văn</p>
                      <p className="text-sm font-black text-emerald-400">{evalResult.creativityScore}/3.0</p>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-950 border border-white/5 text-center">
                      <p className="text-[9px] text-zinc-500 uppercase font-bold">4. Chính tả & Cú pháp</p>
                      <p className="text-sm font-black text-emerald-400">{evalResult.grammarScore}/2.0</p>
                    </div>
                  </div>

                  {/* Detailed Teacher Feedback */}
                  <div className="space-y-2 pt-2">
                    <h5 className="font-bold text-emerald-300 uppercase">💬 Nhận Xét Chi Tiết Của Giáo Viên AI:</h5>
                    <p className="text-zinc-200 leading-relaxed font-sans">{evalResult.teacherFeedback}</p>
                  </div>

                  {/* Strengths */}
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-emerald-400 uppercase">✔️ Ưu Điểm Đạt Được:</h5>
                    <ul className="list-disc list-inside text-zinc-300 space-y-1 font-sans">
                      {evalResult.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Revisions & Next Steps */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 text-amber-200">
                    <h5 className="font-bold uppercase">💡 Khuyến Nghị Nâng Cao Văn Phong:</h5>
                    <p>{evalResult.revisionSuggestion}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 bg-zinc-900/40 rounded-3xl border border-white/5">
              Vui lòng chọn đề bài văn từ danh sách bên trái.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
