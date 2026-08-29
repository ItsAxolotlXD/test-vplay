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
  HelpCircle,
  AppWindow,
  ArrowUpRight,
  Maximize2,
  Terminal
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { processCopilotCommand } from "../utils/copilotCommands";
import { CopilotMarkdown } from "./CopilotMarkdown";

interface CopilotTabProps {
  onBack?: () => void;
  onSelectChannel?: (channel: any) => void;
  channels?: any[];
  onDetachWindow?: () => void;
  isDetached?: boolean;
  navigate?: (route: string) => void;
}

export const CopilotTab: React.FC<CopilotTabProps> = ({
  onBack,
  onSelectChannel,
  channels = [],
  onDetachWindow,
  isDetached = false,
  navigate
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
    const handleStorage = () => {
      const saved = localStorage.getItem("copilot_history");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const cleaned = parsed.map((m: any) => ({
              ...m,
              text: cleanMessageText(m.text || "")
            }));
            setVIntelHistory(cleaned);
          }
        } catch (e) {}
      }
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("copilot_history_updated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("copilot_history_updated", handleStorage);
    };
  }, []);

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

    // Check if input is a slash command
    const cmdResult = processCopilotCommand(promptToSend, channels);
    if (cmdResult.handled) {
      const aiMsg = { role: "model", text: cmdResult.replyText };
      const newHist = [...updatedHistory, aiMsg];
      setVIntelHistory(newHist);
      localStorage.setItem("copilot_history", JSON.stringify(newHist));
      window.dispatchEvent(new Event("copilot_history_updated"));

      if (cmdResult.action?.type === "navigate" && navigate) {
        setTimeout(() => navigate(cmdResult.action?.payload), 600);
      }
      return;
    }

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
        const newHist = [...updatedHistory, aiMsg];
        setVIntelHistory(newHist);
        localStorage.setItem("copilot_history", JSON.stringify(newHist));
        window.dispatchEvent(new Event("copilot_history_updated"));

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
        { role: "model", text: "❌ Lỗi kết nối máy chủ AI. Bạn có thể sử dụng các lệnh điều khiển nhanh như `/spolight-search`, `/mode`, `/navigation`, `/subscribe premium` ngay lập tức." }
      ]);
    } finally {
      setIsVIntelLoading(false);
    }
  };

  const handleClear = () => {
    setVIntelHistory([]);
    localStorage.removeItem("copilot_history");
    window.dispatchEvent(new Event("copilot_history_updated"));
  };

  // Helper to extract channel command from AI message text
  const getCommandChannel = (text: string) => {
    const match = text.match(/\[COMMAND:\s*SWITCH_CHANNEL:\s*([a-zA-Z0-9_-]+)\]/);
    if (!match || !match[1] || !channels.length) return null;
    const targetId = match[1].toLowerCase().trim();
    return channels.find(c => String(c.id).toLowerCase() === targetId || String(c.name).toLowerCase().includes(targetId));
  };

  const cleanMessageText = (text: string) => {
    let cleaned = text.replace(/\[COMMAND:\s*SWITCH_CHANNEL:\s*([a-zA-Z0-9_-]+)\]/g, "").trim();
    if (cleaned.includes('{"error"') || cleaned.includes('"status":"UNAVAILABLE"') || cleaned.includes('"code":503') || cleaned.includes('high demand')) {
      return "⚠️ Máy chủ AI đang trong lúc cao điểm hoặc có lưu lượng truy cập lớn. Bạn vui lòng thử lại sau giây lát, hoặc sử dụng trực tiếp các lệnh nhanh như /spolight-search, /mode, /navigation, /subscribe premium.";
    }
    return cleaned;
  };

  return (
    <div id="waves-copilot-view" className="w-full max-w-6xl mx-auto p-3 sm:p-5 text-slate-900 dark:text-white font-sans h-[calc(100vh-80px)] sm:h-[calc(100vh-90px)] flex flex-col overflow-hidden bg-transparent select-none">
      {/* Copilot Header (Locked / Fixed at Top) */}
      <div className="shrink-0 p-3 sm:p-4 border-b border-slate-200 dark:border-indigo-500/20 mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/70 dark:bg-transparent rounded-2xl shadow-xs dark:shadow-none">
        <div className="flex items-center gap-3.5 relative z-10">
          <div 
            onClick={() => setSpinCount(prev => prev + 1)} 
            className="relative cursor-pointer group"
            title="Nhấn để xoay biểu tượng Copilot for Vplay"
          >
            <motion.img
              animate={{ rotate: spinCount * 360 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/microsoft-copilot.svg";
              }}
              className="w-9 h-9 sm:w-11 sm:h-11 object-contain filter drop-shadow-[0_0_12px_rgba(99,102,241,0.6)] group-hover:scale-110 transition-transform"
              referrerPolicy="no-referrer"
              alt="Copilot for Vplay"
            />
            {isVIntelLoading && (
              <span className="absolute -inset-1 border-2 border-indigo-400 animate-ping opacity-75 rounded-full" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-montserrat">
                Copilot for Vplay
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 bg-indigo-50 dark:bg-white/10 text-indigo-700 dark:text-white border border-indigo-200 dark:border-white/20 font-mono font-bold uppercase tracking-wider rounded-md">
                Gemini AI
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300/80 mt-0.5 font-sans">
              Trợ lý Trí tuệ Nhân tạo thông minh • Điều khiển truyền hình Vplay bằng giọng nói, văn bản & phím lệnh
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end relative z-10">
          {/* Detach Copilot as window button */}
          {onDetachWindow && (
            <button
              id="btn-detach-copilot"
              onClick={onDetachWindow}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-600/20 dark:hover:bg-indigo-600/35 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/40 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 rounded-xl hover:shadow-xs active:scale-95"
              title="Tách Copilot thành cửa sổ nổi có thể di chuyển"
            >
              <AppWindow className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Detach Copilot as window</span>
            </button>
          )}

          {vIntelHistory.length > 0 && (
            <button
              onClick={handleClear}
              className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 dark:bg-white/5 dark:hover:bg-red-500/20 text-slate-700 hover:text-rose-600 dark:text-slate-300 dark:hover:text-red-400 border border-slate-200 hover:border-rose-300 dark:border-white/10 dark:hover:border-red-500/30 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 rounded-xl"
            >
              <Trash2 className="w-3.5 h-3.5" /> Xóa hội thoại
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace (Takes remaining height, holds scrollable feed + locked input) */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative bg-transparent">
        {/* Floating Window Notice if detached */}
        {isDetached && (
          <div className="shrink-0 mb-3 p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 rounded-xl flex items-center justify-between gap-3 text-xs font-sans">
            <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>Copilot for Vplay đang hoạt động dưới dạng <strong>cửa sổ nổi (Movable Window)</strong> trên màn hình.</span>
            </div>
            <button
              onClick={onDetachWindow}
              className="px-2.5 py-1 bg-white dark:bg-indigo-600 hover:bg-slate-100 dark:hover:bg-indigo-500 text-indigo-700 dark:text-white border border-indigo-200 dark:border-indigo-500/30 rounded-lg text-[11px] font-bold cursor-pointer transition-all shadow-xs"
            >
              Thu hồi vào Tab
            </button>
          </div>
        )}

        {/* Mode Segmented Tabs & Quick Commands Pill (Shrink-0 / Fixed) */}
        <div className="shrink-0 flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3 mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
            <button
              onClick={() => setVIntelMode("chat")}
              className={`px-3.5 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 rounded-lg ${
                vIntelMode === "chat"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200 dark:bg-white/10 dark:text-white dark:border-white/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Trò chuyện Chat
            </button>
            <button
              onClick={() => setVIntelMode("search")}
              className={`px-3.5 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 rounded-lg ${
                vIntelMode === "search"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200 dark:bg-white/10 dark:text-white dark:border-white/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
              }`}
            >
              <Search className="w-3.5 h-3.5" /> Tìm kênh AI
            </button>
          </div>

          {/* Quick slash command chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setVIntelQuery("/spolight-search ")}
              className="px-2.5 py-1 bg-[#F1F5F9] hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded-lg transition-colors cursor-pointer"
            >
              /spolight-search
            </button>
            <button
              onClick={() => setVIntelQuery("/mode ")}
              className="px-2.5 py-1 bg-[#F1F5F9] hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded-lg transition-colors cursor-pointer"
            >
              /mode
            </button>
            <button
              onClick={() => setVIntelQuery("/navigation ")}
              className="px-2.5 py-1 bg-[#F1F5F9] hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded-lg transition-colors cursor-pointer"
            >
              /navigation
            </button>
            <button
              onClick={() => handleSend("/subscribe premium")}
              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 rounded-lg transition-colors cursor-pointer font-bold"
            >
              /subscribe premium
            </button>
          </div>
        </div>

        {/* Message Feed Area (Scrollable Only) */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2 min-h-0">
          {vIntelHistory.length === 0 ? (
            <div className="h-full min-h-[280px] flex flex-col items-center justify-center py-8 text-center text-slate-500 dark:text-slate-400">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 border-2 border-indigo-200 dark:border-indigo-500/20 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <img
                  src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/microsoft-copilot.svg";
                  }}
                  className="w-10 h-10 object-contain filter drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                  referrerPolicy="no-referrer"
                  alt="Copilot for Vplay"
                />
              </div>

              <h2 className="text-xl font-bold font-montserrat text-slate-900 dark:text-white mb-2">
                {vIntelMode === "chat" ? "Xin chào! Mình là Copilot for Vplay" : "Tìm kiếm Kênh Truyền hình Thông minh"}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mb-6 font-sans">
                {vIntelMode === "chat"
                  ? "Hãy xưng 'mình' - 'bạn' cùng Copilot for Vplay! Mình có thể giúp bạn chuyển kênh, đổi giao diện, gợi ý nội dung giải trí và thực thi các lệnh nhanh."
                  : "Nhập mong muốn hoặc thể loại bạn muốn xem. Mô hình sinh tạo sẽ tự động lọc danh sách kênh Vplay và đưa bạn đến kênh phù hợp!"}
              </p>

              {/* Suggestions */}
              <div className="w-full max-w-xl space-y-2 text-left">
                <p className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                  Gợi ý câu hỏi & lệnh nhanh:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "/spolight-search vtv3",
                    "/mode light",
                    "/navigation dock",
                    "/subscribe premium",
                    "Bật kênh VTV3 cho mình xem",
                    "Gợi ý các kênh thể thao bóng đá"
                  ].map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(sug)}
                      className="p-3 bg-[#F1F5F9] hover:bg-white border border-slate-200 hover:border-indigo-400 text-xs font-mono text-slate-800 hover:text-indigo-600 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 text-left group shadow-xs dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:hover:border-indigo-500/50 dark:text-indigo-200 dark:hover:text-white"
                    >
                      {sug.startsWith("/") ? (
                        <Terminal className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0 group-hover:rotate-12 transition-transform" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0 group-hover:rotate-12 transition-transform" />
                      )}
                      <span className="truncate">{sug}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pb-2">
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
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold">Copilot for Vplay</span>
                        </>
                      )}
                    </div>

                    <div
                      className={`p-4 text-xs sm:text-sm leading-relaxed max-w-[88%] break-words rounded-2xl ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white shadow-md font-medium"
                          : "bg-[#F1F5F9] text-slate-900 border border-slate-200/90 shadow-xs dark:bg-[#1E2230] dark:border-white/10 dark:text-slate-100"
                      }`}
                    >
                      {/* Markdown Text Formatting */}
                      <CopilotMarkdown content={cleanedText} isUser={msg.role === "user"} />

                      {/* Interactive Tune-In Button if Copilot generated a channel command */}
                      {targetChannel && onSelectChannel && (
                        <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
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
                    <span>Copilot for Vplay đang suy nghĩ...</span>
                  </div>
                  <div className="p-4 bg-[#F1F5F9] dark:bg-[#1E2230] border border-slate-200 dark:border-white/10 rounded-2xl text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 shadow-xs">
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                    <span>Đang tổng hợp thông tin từ mô hình AI...</span>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          )}
        </div>

        {/* Text Input Area (Locked / Fixed at the Bottom of Copilot Page) */}
        <div className="shrink-0 mt-3 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center gap-2 bg-white/50 dark:bg-transparent backdrop-blur-xs">
          <input
            type="text"
            value={vIntelQuery}
            onChange={(e) => setVIntelQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={vIntelMode === "chat" ? "Nhắn tin cho Copilot for Vplay (hoặc gõ /spolight-search, /mode, /navigation, /subscribe)..." : "Nhập kênh hoặc thể loại bạn muốn tìm..."}
            className="flex-1 bg-[#F1F5F9] dark:bg-[#1E2230] text-slate-900 dark:text-white border border-slate-300 dark:border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xs focus:bg-white dark:focus:bg-[#232736] transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={!vIntelQuery.trim() || isVIntelLoading}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md shadow-indigo-600/20"
          >
            <Send className="w-4 h-4 text-white" />
            <span className="text-white">Gửi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
