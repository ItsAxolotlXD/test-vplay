import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Sparkles,
  Send,
  Trash2,
  RefreshCw,
  Radio,
  Play,
  Bot,
  Search,
  Check,
  ChevronRight,
  Zap,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CopilotTabProps {
  onBack?: () => void;
  onSelectChannel?: (channel: any) => void;
  channels?: any[];
}

export const CopilotTab: React.FC<CopilotTabProps> = ({
  onBack,
  onSelectChannel,
  channels = []
}) => {
  const [vIntelQuery, setVIntelQuery] = useState("");
  const [vIntelHistory, setVIntelHistory] = useState<{ role: string; text: string }[]>(() => {
    const saved = localStorage.getItem("copilot_history");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });
  const [vIntelMode, setVIntelMode] = useState<"chat" | "search">("chat");
  const [isVIntelLoading, setIsVIntelLoading] = useState(false);
  const [spinCount, setSpinCount] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("copilot_history", JSON.stringify(vIntelHistory));
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [vIntelHistory]);

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || vIntelQuery;
    if (!promptToSend.trim() || isVIntelLoading) return;

    const userMsg = { role: "user", text: promptToSend };
    const updatedHistory = [...vIntelHistory, userMsg];
    setVIntelHistory(updatedHistory);
    setVIntelQuery("");
    setIsVIntelLoading(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToSend,
          history: vIntelHistory,
          channels: channels.map(c => ({ id: c.id, name: c.name, group: c.group || c.category })),
          mode: vIntelMode
        })
      });

      const data = await response.json();
      if (data.text) {
        const aiMsg = { role: "model", text: data.text };
        setVIntelHistory([...updatedHistory, aiMsg]);

        // Check if there is an auto-switch command in response
        const match = data.text.match(/\[COMMAND:\s*SWITCH_CHANNEL:\s*([a-zA-Z0-9_-]+)\]/);
        if (match && match[1] && onSelectChannel && channels.length > 0) {
          const targetChId = match[1].toLowerCase().trim();
          const found = channels.find(c => String(c.id).toLowerCase() === targetChId || String(c.name).toLowerCase().includes(targetChId));
          if (found) {
            console.log("Copilot auto-detected channel command:", found.name);
          }
        }
      } else if (data.error) {
        setVIntelHistory([
          ...updatedHistory,
          { role: "model", text: `⚠️ ${data.error}` }
        ]);
      }
    } catch (err: any) {
      setVIntelHistory([
        ...updatedHistory,
        { role: "model", text: "❌ Lỗi kết nối máy chủ AI. Vui lòng kiểm tra lại mạng hoặc thử lại sau." }
      ]);
    } finally {
      setIsVIntelLoading(false);
    }
  };

  const handleClear = () => {
    setVIntelHistory([]);
    localStorage.removeItem("copilot_history");
  };

  // Helper to extract channel command from AI message text
  const getCommandChannel = (text: string) => {
    const match = text.match(/\[COMMAND:\s*SWITCH_CHANNEL:\s*([a-zA-Z0-9_-]+)\]/);
    if (!match || !match[1] || !channels.length) return null;
    const targetId = match[1].toLowerCase().trim();
    return channels.find(c => String(c.id).toLowerCase() === targetId || String(c.name).toLowerCase().includes(targetId));
  };

  const cleanMessageText = (text: string) => {
    return text.replace(/\[COMMAND:\s*SWITCH_CHANNEL:\s*([a-zA-Z0-9_-]+)\]/g, "").trim();
  };

  return (
    <div id="waves-copilot-view" className="w-full max-w-6xl mx-auto p-3 sm:p-6 text-slate-900 dark:text-white font-sans min-h-[calc(100vh-80px)] flex flex-col bg-transparent">
      {/* Copilot Header - Seamless without background box */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-indigo-500/20 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-transparent">
        <div className="flex items-center gap-4 relative z-10">
          <div 
            onClick={() => setSpinCount(prev => prev + 1)} 
            className="relative cursor-pointer group"
            title="Nhấn để xoay biểu tượng Copilot"
          >
            <motion.img
              animate={{ rotate: spinCount * 360 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/microsoft-copilot.svg";
              }}
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain filter drop-shadow-[0_0_12px_rgba(99,102,241,0.6)] group-hover:scale-110 transition-transform"
              referrerPolicy="no-referrer"
              alt="Copilot"
            />
            {isVIntelLoading && (
              <span className="absolute -inset-1 border-2 border-indigo-400 animate-ping opacity-75" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
                Copilot
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 bg-indigo-50 dark:bg-white/10 text-indigo-700 dark:text-white border border-indigo-200 dark:border-white/20 font-mono font-bold uppercase tracking-wider">
                Gemini 3.5 AI
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300/80 mt-1 font-mono">
              Trợ lý Trí tuệ Nhân tạo thông minh • Điều khiển truyền hình Vplay bằng giọng nói & văn bản
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end relative z-10">
          {vIntelHistory.length > 0 && (
            <button
              onClick={handleClear}
              className="px-3.5 py-2 bg-slate-100 hover:bg-rose-50 dark:bg-white/5 dark:hover:bg-red-500/20 text-slate-700 hover:text-rose-600 dark:text-slate-300 dark:hover:text-red-400 border border-slate-200 hover:border-rose-300 dark:border-white/10 dark:hover:border-red-500/30 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 rounded-lg"
            >
              <Trash2 className="w-3.5 h-3.5" /> Xóa hội thoại
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col relative bg-transparent">
        {/* Mode Segmented Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
            <button
              onClick={() => setVIntelMode("chat")}
              className={`px-4 py-2 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 rounded-lg ${
                vIntelMode === "chat"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200 dark:bg-white/10 dark:text-white dark:border-white/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Trò chuyện Chat
            </button>
            <button
              onClick={() => setVIntelMode("search")}
              className={`px-4 py-2 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 rounded-lg ${
                vIntelMode === "search"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200 dark:bg-white/10 dark:text-white dark:border-white/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
              }`}
            >
              <Search className="w-3.5 h-3.5" /> Tìm kênh AI
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-3 py-1.5 border border-slate-200 dark:border-white/10 rounded-xl">
            <Zap className="w-3.5 h-3.5 text-indigo-500 dark:text-slate-300" />
            <span>Phản hồi phản xạ sinh tạo tức thì</span>
          </div>
        </div>

        {/* Message Feed Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[360px] max-h-[560px]">
          {vIntelHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center text-slate-500 dark:text-slate-400">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 border-2 border-indigo-200 dark:border-indigo-500/20 rounded-2xl flex items-center justify-center mb-4">
                <img
                  src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/microsoft-copilot.svg";
                  }}
                  className="w-10 h-10 object-contain filter drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                  referrerPolicy="no-referrer"
                  alt="Copilot"
                />
              </div>

              <h2 className="text-lg font-mono font-bold text-slate-900 dark:text-white mb-2">
                {vIntelMode === "chat" ? "Xin chào! Mình là Copilot" : "Tìm kiếm Kênh Truyền hình Thông minh"}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mb-6 font-sans">
                {vIntelMode === "chat"
                  ? "Hãy xưng 'mình' - 'bạn' cùng Copilot! Mình có thể giúp bạn chuyển kênh, gợi ý nội dung giải trí, giải đáp các thắc mắc nhanh chóng."
                  : "Nhập mong muốn hoặc thể loại bạn muốn xem. Mô hình sinh tạo sẽ tự động lọc danh sách kênh Vplay và đưa bạn đến kênh phù hợp!"}
              </p>

              {/* Suggestions */}
              <div className="w-full max-w-lg space-y-2 text-left">
                <p className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                  Gợi ý câu hỏi phổ biến:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(vIntelMode === "chat"
                    ? [
                        "Bật kênh VTV3 cho mình xem",
                        "Thời tiết hôm nay ở Hà Nội?",
                        "Kênh VTV1 đang phát sóng nội dung gì?",
                        "Kể cho mình nghe một câu chuyện vui"
                      ]
                    : [
                        "Mở kênh bóng đá thể thao",
                        "Gợi ý kênh phim truyện đặc sắc",
                        "Tìm các đài truyền hình địa phương",
                        "Bật đài nghe ca nhạc Radio"
                      ]
                  ).map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(sug)}
                      className="p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-400 text-xs font-mono text-slate-800 hover:text-indigo-600 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 text-left group shadow-xs dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:hover:border-indigo-500/50 dark:text-indigo-200 dark:hover:text-white"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0 group-hover:rotate-12 transition-transform" />
                      <span className="truncate">{sug}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {vIntelHistory.map((msg, idx) => {
                const targetChannel = msg.role === "model" ? getCommandChannel(msg.text) : null;
                const cleanedText = cleanMessageText(msg.text);

                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1 px-1 uppercase tracking-wider flex items-center gap-1.5">
                      {msg.role === "user" ? (
                        <span>Bạn</span>
                      ) : (
                        <>
                          <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold">Copilot AI</span>
                        </>
                      )}
                    </div>

                    <div
                      className={`p-4 text-xs sm:text-sm leading-relaxed max-w-[88%] whitespace-pre-wrap break-words rounded-2xl ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md"
                          : "bg-white text-slate-900 border border-slate-200 shadow-sm dark:bg-white/5 dark:border-white/10 dark:text-slate-100"
                      }`}
                    >
                      {cleanedText}

                      {/* Interactive Tune-In Button if Copilot generated a channel command */}
                      {targetChannel && onSelectChannel && (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                            <span>Kênh tìm thấy: {targetChannel.name}</span>
                          </div>
                          <button
                            onClick={() => onSelectChannel(targetChannel)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" /> Mở kênh ngay
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isVIntelLoading && (
                <div className="flex flex-col items-start animate-pulse">
                  <div className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-1 px-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                    <span>Copilot đang suy nghĩ...</span>
                  </div>
                  <div className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 shadow-sm">
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                    <span>Đang tổng hợp thông tin từ mô hình AI...</span>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          )}
        </div>

        {/* Text Input Area */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#2b2f42] flex items-center gap-2">
          <input
            type="text"
            value={vIntelQuery}
            onChange={(e) => setVIntelQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={vIntelMode === "chat" ? "Hỏi Copilot AI... (ví dụ: 'Mở VTV3', 'Thời tiết hôm nay')" : "Nhập kênh hoặc thể loại bạn muốn tìm..."}
            className="flex-1 bg-white dark:bg-white/5 text-slate-900 dark:text-white border border-slate-300 dark:border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
          />
          <button
            onClick={() => handleSend()}
            disabled={!vIntelQuery.trim() || isVIntelLoading}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md shadow-indigo-600/20"
          >
            <Send className="w-4 h-4" /> Gửi
          </button>
        </div>
      </div>
    </div>
  );

};
