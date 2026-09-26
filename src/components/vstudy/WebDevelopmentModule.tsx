import React, { useState } from "react";
import { 
  Code, 
  Layout, 
  Palette, 
  Terminal, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  BookOpen, 
  Copy, 
  Check, 
  Layers, 
  Smartphone, 
  ChevronRight,
  ExternalLink
} from "lucide-react";

interface WebDevelopmentModuleProps {
  onAddScoreAndXp?: (score: number, xpAmount: number) => void;
  playSynthSound?: (type: "correct" | "incorrect" | "join" | "tick" | "complete") => void;
}

interface Lesson {
  id: string;
  chapter: string;
  title: string;
  description: string;
  badge: string;
  content: string;
  initialHtml: string;
  initialCss: string;
  task: string;
}

const lessons: Lesson[] = [
  {
    id: "html-basics",
    chapter: "Chương 1: HTML5 Căn Bản",
    title: "1. Cấu Trúc Khung Trang Web & Thẻ Tiêu Đề",
    description: "Khám phá thẻ định dạng văn bản, tiêu đề heading h1-h6 và đoạn văn p.",
    badge: "HTML5 Core",
    content: `HTML (HyperText Markup Language) là ngôn ngữ đánh dấu dùng để xây dựng cấu trúc của trang web.
Mỗi trang web đều bắt đầu với thẻ tiêu đề (<h1> đến <h6>) và các đoạn văn (<p>).

• <h1> đến <h6>: Phân cấp tiêu đề từ quan trọng nhất đến nhỏ dần.
• <p>: Định dạng đoạn văn bản tiêu chuẩn.
• <strong> và <em>: Nhấn mạnh nội dung (in đậm / in nghiêng).
• <a>: Liên kết dẫn đến trang khác (href="...").`,
    initialHtml: `<div class="card">
  <h1>Xin chào Thế Giới!</h1>
  <p>Chào mừng bạn đến với khóa học <strong>Lập Trình Web</strong> tại V-Study.</p>
  <p>Hãy thử thay đổi tiêu đề hoặc đoạn văn bên dưới nhé!</p>
  <a href="#learn-more" class="btn">Bắt Đầu Học Ngay</a>
</div>`,
    initialCss: `.card {
  padding: 24px;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  color: #f8fafc;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-family: sans-serif;
  text-align: center;
}

h1 {
  font-size: 24px;
  color: #38bdf8;
  margin-bottom: 12px;
}

p {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.6;
}

.btn {
  display: inline-block;
  margin-top: 16px;
  padding: 10px 20px;
  background: #f97316;
  color: #ffffff;
  border-radius: 9999px;
  text-decoration: none;
  font-weight: bold;
  font-size: 13px;
  transition: transform 0.2s;
}

.btn:hover {
  transform: scale(1.05);
}`,
    task: "Thử đổi tiêu đề <h1> thành tên của bạn và sửa màu chữ của nút bấm .btn thành màu xanh lá (#22c55e)!"
  },
  {
    id: "css-flexbox",
    chapter: "Chương 2: Bố Cục CSS Hiện Đại",
    title: "2. Làm Chủ Bố Cục Flexbox",
    description: "Căn chỉnh hàng ngang, hàng dọc và phân bổ khoảng cách phần tử cực đỉnh.",
    badge: "CSS3 Flexbox",
    content: `Flexbox (Flexible Box Layout) là công nghệ căn chỉnh bố cục 1 chiều phổ biến và mạnh mẽ nhất của CSS:

• display: flex; -> Kích hoạt chế độ Flex container.
• justify-content: center | space-between | space-around; -> Căn các phần tử theo trục ngang.
• align-items: center | flex-start | flex-end; -> Căn các phần tử theo trục dọc.
• gap: 12px; -> Khoảng cách đều giữa các thẻ con mà không cần căn margin.`,
    initialHtml: `<div class="navbar">
  <div class="logo">⚡ VNRT Web</div>
  <div class="nav-links">
    <span>Trang chủ</span>
    <span>Khóa học</span>
    <span>Tin tức</span>
  </div>
  <button class="login-btn">Đăng nhập</button>
</div>`,
    initialCss: `.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-family: sans-serif;
  color: white;
}

.logo {
  font-weight: 800;
  color: #fbbf24;
  font-size: 16px;
}

.nav-links {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #cbd5e1;
}

.nav-links span {
  cursor: pointer;
}

.login-btn {
  padding: 8px 16px;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
}`,
    task: "Thử đổi justify-content thành center hoặc space-around để xem cách thanh điều hướng phản ứng!"
  },
  {
    id: "css-glassmorphism",
    chapter: "Chương 2: Bố Cục CSS Hiện Đại",
    title: "3. Hiệu Ứng Thủy Tinh Mờ Spatial Glassmorphism",
    description: "Tạo hiệu ứng kính trong suốt frosted glass xu hướng thiết kế tương lai.",
    badge: "Spatial Glass",
    content: `Glassmorphism là phong cách thiết kế giao diện hiện đại mô phỏng tấm kính mờ (như trên Apple Vision Pro hay Windows Mica):

1. Nền bán trong suốt: background: rgba(255, 255, 255, 0.15);
2. Hiệu ứng mờ hậu cảnh: backdrop-filter: blur(20px);
3. Đường viền phản chiếu ánh sáng mỏng: border: 1px solid rgba(255, 255, 255, 0.25);
4. Bóng đổ chiều sâu: box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);`,
    initialHtml: `<div class="glass-container">
  <div class="glass-pill">
    <span class="icon">✨</span>
    <div>
      <h3>Spatial Glass VPlay</h3>
      <p>Giao diện kính mờ xuyên thấu thế hệ mới.</p>
    </div>
  </div>
</div>`,
    initialCss: `.glass-container {
  padding: 40px;
  background: radial-gradient(circle at 20% 20%, #ff6b6b, #4ecdc4, #45b7d1);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: sans-serif;
}

.glass-pill {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 9999px;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.icon {
  font-size: 24px;
}

h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
}

p {
  margin: 2px 0 0 0;
  font-size: 12px;
  opacity: 0.9;
}`,
    task: "Tăng độ mờ backdrop-filter lên 30px hoặc đổi màu gradient nền để chiêm ngưỡng hiệu ứng phản chiếu!"
  },
  {
    id: "responsive-design",
    chapter: "Chương 3: Responsive & Animation",
    title: "4. Responsive Web Design & Media Queries",
    description: "Tối ưu hóa giao diện hiển thị mượt mà trên cả Mobile, Tablet và Desktop.",
    badge: "Responsive",
    content: `Responsive Web Design giúp website tự động co giãn thích ứng với kích thước màn hình thiết bị người dùng:

• @media (max-width: 600px): Kích hoạt luật CSS riêng cho điện thoại.
• Sử dụng đơn vị tương đối (%, rem, vw, vh, fr) thay vì pixel cố định.
• Thay đổi hướng Flexbox: flex-direction: column trên mobile và row trên máy tính.`,
    initialHtml: `<div class="grid-layout">
  <div class="box box1">📱 Thẻ 1</div>
  <div class="box box2">💻 Thẻ 2</div>
  <div class="box box3">🖥️ Thẻ 3</div>
</div>`,
    initialCss: `.grid-layout {
  display: flex;
  flex-direction: row;
  gap: 12px;
  padding: 16px;
  font-family: sans-serif;
}

.box {
  flex: 1;
  padding: 24px;
  background: #1e1e24;
  border: 1px solid #33333f;
  border-radius: 12px;
  text-align: center;
  color: white;
  font-weight: bold;
}

/* Khi màn hình nhỏ hơn 480px */
@media (max-width: 480px) {
  .grid-layout {
    flex-direction: column;
  }
}`,
    task: "Thử chỉnh sửa flex-direction và màu nền của từng thẻ box để tạo bố cục của riêng bạn!"
  }
];

export default function WebDevelopmentModule({ onAddScoreAndXp, playSynthSound }: WebDevelopmentModuleProps) {
  const [activeTab, setActiveTab] = useState<"lessons" | "sandbox" | "cheatsheet">("lessons");
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);
  const currentLesson = lessons[selectedLessonIndex];

  // Sandbox state
  const [htmlCode, setHtmlCode] = useState<string>(currentLesson.initialHtml);
  const [cssCode, setCssCode] = useState<string>(currentLesson.initialCss);
  const [copied, setCopied] = useState<boolean>(false);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem("vstudy_web_completed") || "{}");
    } catch {
      return {};
    }
  });

  const handleSelectLesson = (idx: number) => {
    setSelectedLessonIndex(idx);
    setHtmlCode(lessons[idx].initialHtml);
    setCssCode(lessons[idx].initialCss);
  };

  const handleResetCode = () => {
    setHtmlCode(currentLesson.initialHtml);
    setCssCode(currentLesson.initialCss);
    if (playSynthSound) playSynthSound("tick");
  };

  const handleCompleteLesson = (lessonId: string) => {
    if (completedLessons[lessonId]) return;
    const next = { ...completedLessons, [lessonId]: true };
    setCompletedLessons(next);
    localStorage.setItem("vstudy_web_completed", JSON.stringify(next));

    if (onAddScoreAndXp) {
      onAddScoreAndXp(50, 100);
    }
    if (playSynthSound) {
      playSynthSound("complete");
    }
  };

  const handleCopyCode = () => {
    const fullSnippet = `<!-- HTML -->\n${htmlCode}\n\n/* CSS */\n${cssCode}`;
    navigator.clipboard.writeText(fullSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Safe preview srcDoc
  const previewDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { 
            background: #0d0d12; 
            padding: 16px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            min-height: 100vh;
            color: #ffffff;
            font-family: system-ui, -apple-system, sans-serif;
          }
          ${cssCode}
        </style>
      </head>
      <body>
        ${htmlCode}
      </body>
    </html>
  `;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-blue-700 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Khóa Học Chuyên Biệt V-Study</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Lập Trình Web (HTML5 & CSS3)
          </h2>
          <p className="text-xs sm:text-sm text-white/90 max-w-xl leading-relaxed">
            Học lập trình giao diện trực quan với trình biên tập Sandbox thời gian thực. Nắm vững HTML5, Flexbox, Glassmorphism và Responsive hiện đại.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="px-4 py-3 bg-black/35 backdrop-blur-md rounded-xl border border-white/20 text-center">
            <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">Tiến Độ</div>
            <div className="text-xl font-black text-white">
              {Object.keys(completedLessons).length}/{lessons.length}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#18171E] border border-[#2D2D38] rounded-xl">
        <button
          onClick={() => setActiveTab("lessons")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "lessons"
              ? "bg-[#FF7A00] text-white shadow-md"
              : "text-[#9CA3AF] hover:text-white"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Bài Học & Trình Thực Hành Trực Tiếp</span>
        </button>

        <button
          onClick={() => setActiveTab("cheatsheet")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "cheatsheet"
              ? "bg-[#FF7A00] text-white shadow-md"
              : "text-[#9CA3AF] hover:text-white"
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Sổ Tay Tra Cứu Thẻ & Thuộc Tính</span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === "lessons" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Lesson Directory */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider px-1">
              Danh Sách Bài Học ({lessons.length} Bài)
            </h3>
            <div className="space-y-2">
              {lessons.map((lesson, idx) => {
                const isSelected = selectedLessonIndex === idx;
                const isDone = Boolean(completedLessons[lesson.id]);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleSelectLesson(idx)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? "bg-[#25242D] border-[#FF7A00] shadow-md ring-1 ring-[#FF7A00]/50"
                        : "bg-[#18171E] border-[#2D2D38] hover:border-white/20 hover:bg-[#201F27]"
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-amber-300">
                          {lesson.badge}
                        </span>
                        {isDone && (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Đã hoàn thành
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white truncate">
                        {lesson.title}
                      </h4>
                      <p className="text-xs text-[#9CA3AF] line-clamp-1">
                        {lesson.description}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 mt-2 shrink-0 ${isSelected ? "text-[#FF7A00]" : "text-[#555]"}`} />
                  </button>
                );
              })}
            </div>

            {/* Complete button */}
            <div className="p-4 rounded-xl bg-[#18171E] border border-[#2D2D38] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Award className="w-4 h-4" />
                <span>Nhiệm Vụ Thực Hành</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                {currentLesson.task}
              </p>
              <button
                onClick={() => handleCompleteLesson(currentLesson.id)}
                disabled={Boolean(completedLessons[currentLesson.id])}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  completedLessons[currentLesson.id]
                    ? "bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 cursor-default"
                    : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md cursor-pointer"
                }`}
              >
                {completedLessons[currentLesson.id] ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Đã nhận thưởng +100 XP</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Xác Nhận Hoàn Thành (+100 XP)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Sandbox & Lesson Theory */}
          <div className="lg:col-span-8 space-y-4">
            {/* Theory Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#18171E] border border-[#2D2D38] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {currentLesson.chapter}
                </span>
                <span className="text-[11px] text-[#9CA3AF]">
                  Bài {selectedLessonIndex + 1}/{lessons.length}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {currentLesson.title}
              </h3>
              <div className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed whitespace-pre-line font-sans">
                {currentLesson.content}
              </div>
            </div>

            {/* Split Screen Live Editor */}
            <div className="rounded-xl border border-[#2D2D38] overflow-hidden bg-[#121116] shadow-xl">
              {/* Sandbox Top Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#1C1B23] border-b border-[#2D2D38]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">
                    Trình Biên Tập HTML/CSS Trực Tiếp
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetCode}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    title="Khôi phục mã ban đầu"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Đặt lại</span>
                  </button>
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    title="Sao chép toàn bộ mã"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{copied ? "Đã chép" : "Sao chép"}</span>
                  </button>
                </div>
              </div>

              {/* Code Inputs & Live Output */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#2D2D38]">
                {/* Left: Code editors */}
                <div className="flex flex-col h-[380px] divide-y divide-[#2D2D38]">
                  {/* HTML Input */}
                  <div className="flex-1 flex flex-col min-h-0 bg-[#0F0E14]">
                    <div className="px-3 py-1.5 bg-[#18171E] text-[11px] font-mono font-bold text-orange-400 flex items-center justify-between">
                      <span>HTML5</span>
                    </div>
                    <textarea
                      value={htmlCode}
                      onChange={(e) => setHtmlCode(e.target.value)}
                      className="w-full flex-1 p-3 bg-transparent font-mono text-xs text-orange-200 outline-none resize-none leading-relaxed"
                      spellCheck={false}
                    />
                  </div>

                  {/* CSS Input */}
                  <div className="flex-1 flex flex-col min-h-0 bg-[#0F0E14]">
                    <div className="px-3 py-1.5 bg-[#18171E] text-[11px] font-mono font-bold text-sky-400 flex items-center justify-between">
                      <span>CSS3</span>
                    </div>
                    <textarea
                      value={cssCode}
                      onChange={(e) => setCssCode(e.target.value)}
                      className="w-full flex-1 p-3 bg-transparent font-mono text-xs text-sky-200 outline-none resize-none leading-relaxed"
                      spellCheck={false}
                    />
                  </div>
                </div>

                {/* Right: Live Preview Box */}
                <div className="flex flex-col h-[380px] bg-[#0A0A0F]">
                  <div className="px-3 py-1.5 bg-[#18171E] text-[11px] font-bold text-emerald-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Kết Quả Hiển Thị Thời Gian Thực
                    </span>
                  </div>
                  <iframe
                    title="Live Web Preview"
                    srcDoc={previewDoc}
                    className="w-full flex-1 border-0 bg-[#0d0d12]"
                    sandbox="allow-scripts"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cheatsheet Tab */}
      {activeTab === "cheatsheet" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* HTML Core Tags */}
            <div className="p-5 rounded-xl bg-[#18171E] border border-[#2D2D38] space-y-3">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
                <Code className="w-4 h-4" />
                <span>Các Thẻ HTML5 Cốt Lõi Thường Dùng</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between">
                  <code className="text-orange-300 font-bold">&lt;div&gt; &lt;/div&gt;</code>
                  <span className="text-[#9CA3AF]">Khối container phân chia bố cục</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between">
                  <code className="text-orange-300 font-bold">&lt;h1&gt; ... &lt;h6&gt;</code>
                  <span className="text-[#9CA3AF]">Các cấp bậc tiêu đề văn bản</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between">
                  <code className="text-orange-300 font-bold">&lt;p&gt; &lt;/p&gt;</code>
                  <span className="text-[#9CA3AF]">Đoạn văn bản thông thường</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between">
                  <code className="text-orange-300 font-bold">&lt;a href="..."&gt;</code>
                  <span className="text-[#9CA3AF]">Siêu liên kết dẫn trang</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between">
                  <code className="text-orange-300 font-bold">&lt;img src="..." alt=""&gt;</code>
                  <span className="text-[#9CA3AF]">Chèn hình ảnh vào website</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between">
                  <code className="text-orange-300 font-bold">&lt;nav&gt;, &lt;header&gt;, &lt;footer&gt;</code>
                  <span className="text-[#9CA3AF]">Thẻ ngữ nghĩa Semantic HTML5</span>
                </div>
              </div>
            </div>

            {/* CSS Flexbox & Glassmorphism Properties */}
            <div className="p-5 rounded-xl bg-[#18171E] border border-[#2D2D38] space-y-3">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                <Palette className="w-4 h-4" />
                <span>Thuộc Tính CSS3 Đột Phá</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between">
                  <code className="text-sky-300 font-bold">display: flex;</code>
                  <span className="text-[#9CA3AF]">Kích hoạt dàn trang linh hoạt Flexbox</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between">
                  <code className="text-sky-300 font-bold">justify-content: center;</code>
                  <span className="text-[#9CA3AF]">Căn giữa theo trục chính ngang</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between">
                  <code className="text-sky-300 font-bold">align-items: center;</code>
                  <span className="text-[#9CA3AF]">Căn giữa theo trục dọc</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between">
                  <code className="text-sky-300 font-bold">backdrop-filter: blur(20px);</code>
                  <span className="text-[#9CA3AF]">Hiệu ứng làm mờ nền kính thủy tinh</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between">
                  <code className="text-sky-300 font-bold">border-radius: 9999px;</code>
                  <span className="text-[#9CA3AF]">Bo tròn tuyệt đối hình viên thuốc (Pill)</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between">
                  <code className="text-sky-300 font-bold">@media (max-width: 768px)</code>
                  <span className="text-[#9CA3AF]">Điều kiện thích ứng màn hình di động</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
