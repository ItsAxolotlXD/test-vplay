import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Sparkles,
  Send,
  Trash2,
  RefreshCw,
  Radio,
  Play,
  Search,
  Zap,
  Minimize2,
  Maximize2,
  X,
  GripHorizontal,
  ArrowUpRight,
  Bot,
  Terminal
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { processCopilotCommand } from "../utils/copilotCommands";
import { CopilotMarkdown } from "./CopilotMarkdown";

interface CopilotFloatingWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onDockBack: () => void;
  onSelectChannel?: (channel: any) => void;
  channels?: any[];
  navigate?: (route: string) => void;
}

export const CopilotFloatingWindow: React.FC<CopilotFloatingWindowProps> = ({
  isOpen,
  onClose,
  onDockBack,
  onSelectChannel,
  channels = [],
  navigate
}) => {
  const [vIntelQuery, setVIntelQuery] = useState("");
  const [vIntelHistory, setVIntelHistory] = useState<{ role: string; text: string }[]>(() => {
    const saved = localStorage.getItem("copilot_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });
  const [vIntelMode, setVIntelMode] = useState<"chat" | "search">("chat");
  const [isVIntelLoading, setIsVIntelLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [spinCount, setSpinCount] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync history updates with localStorage
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

        // Channel auto-switch command
        const match = data.text.match(/\[COMMAND:\s*SWITCH_CHANNEL:\s*([a-zA-Z0-9_-]+)\]/);
        if (match && match[1] && onSelectChannel && channels.length > 0) {
          const targetChId = match[1].toLowerCase().trim();
          const found = channels.find(
            c => String(c.id).toLowerCase() === targetChId || String(c.name).toLowerCase().includes(targetChId)
          );
          if (found) {
            console.log("Copilot Window auto-switch command:", found.name);
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
        { role: "model", text: "❌ Lỗi kết nối máy chủ AI. Bạn có thể sử dụng các phím lệnh `/spolight-search`, `/mode`, `/navigation`, `/subscribe premium` ngay lúc này." }
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

  const getCommandChannel = (text: string) => {
    const match = text.match(/\[COMMAND:\s*SWITCH_CHANNEL:\s*([a-zA-Z0-9_-]+)\]/);
    if (!match || !match[1] || !channels.length) return null;
    const targetId = match[1].toLowerCase().trim();
    return channels.find(
      c => String(c.id).toLowerCase() === targetId || String(c.name).toLowerCase().includes(targetId)
    );
  };

  const cleanMessageText = (text: string) => {
    let cleaned = text.replace(/\[COMMAND:\s*SWITCH_CHANNEL:\s*([a-zA-Z0-9_-]+)\]/g, "").trim();
    if (cleaned.includes('{"error"') || cleaned.includes('"status":"UNAVAILABLE"') || cleaned.includes('"code":503') || cleaned.includes('high demand')) {
      return "⚠️ Máy chủ AI đang trong lúc cao điểm hoặc có lưu lượng truy cập lớn. Bạn vui lòng thử lại sau giây lát, hoặc sử dụng trực tiếp các lệnh nhanh như /spolight-search, /mode, /navigation, /subscribe premium.";
    }
    return cleaned;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        <motion.div
          id="waves-copilot-floating-window"
          drag
          dragMomentum={false}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="pointer-events-auto absolute w-[92vw] sm:w-[420px] rounded-2xl bg-white/95 dark:bg-[#151720]/95 border border-slate-300 dark:border-indigo-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl flex flex-col text-slate-900 dark:text-white overflow-hidden transition-shadow duration-300"
          style={{
            top: "80px",
            right: "24px",
            maxHeight: isMinimized ? "auto" : "calc(100vh - 120px)"
          }}
        >
          {/* Header Drag Handle */}
          <div className="px-4 py-3 bg-slate-100/95 dark:bg-[#1c1f2b]/95 border-b border-slate-200 dark:border-indigo-500/20 flex items-center justify-between cursor-grab active:cursor-grabbing select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <GripHorizontal className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <div
                onClick={() => setSpinCount(prev => prev + 1)}
                className="cursor-pointer relative shrink-0"
                title="Nhấn để xoay Copilot for Vplay"
              >
                <motion.img
                  animate={{ rotate: spinCount * 360 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
                  alt="Copilot for Vplay"
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                {isVIntelLoading && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                )}
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-xs font-montserrat font-bold tracking-tight text-slate-900 dark:text-white truncate">
                  Copilot for Vplay
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 font-mono font-bold uppercase">
                  Window
                </span>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                onClick={onDockBack}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                title="Gắn lại vào trang Copilot (Dock back)"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                title={isMinimized ? "Phóng to cửa sổ" : "Thu nhỏ cửa sổ"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-500/20 text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 transition-all cursor-pointer"
                title="Đóng cửa sổ nổi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Window Body (When not minimized) */}
          {!isMinimized && (
            <div 
              onPointerDown={(e) => e.stopPropagation()} 
              className="flex flex-col h-[460px] bg-slate-50 dark:bg-[#12141c]/70 select-text"
            >
              {/* Mode Switch & Actions */}
              <div className="px-3 py-2 border-b border-slate-200 dark:border-white/5 flex items-center justify-between gap-2 bg-white dark:bg-black/20">
                <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg">
                  <button
                    onClick={() => setVIntelMode("chat")}
                    className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                      vIntelMode === "chat"
                        ? "bg-white text-slate-900 border border-slate-200 shadow-xs dark:bg-indigo-600 dark:text-white dark:border-transparent"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <MessageSquare className="w-3 h-3" /> Chat
                  </button>
                  <button
                    onClick={() => setVIntelMode("search")}
                    className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                      vIntelMode === "search"
                        ? "bg-white text-slate-900 border border-slate-200 shadow-xs dark:bg-indigo-600 dark:text-white dark:border-transparent"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Search className="w-3 h-3" /> Tìm kênh
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleSend("/subscribe premium")}
                    className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-500/30 transition-colors"
                  >
                    VIP
                  </button>
                  {vIntelHistory.length > 0 && (
                    <button
                      onClick={handleClear}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer rounded"
                      title="Xóa đoạn chat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {vIntelHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500 dark:text-slate-400">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center mb-2">
                      <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mb-1">
                      {vIntelMode === "chat" ? "Copilot for Vplay đang lắng nghe" : "Tìm kiếm truyền hình AI"}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 max-w-[260px]">
                      Hỏi về kênh, chương trình giải trí hoặc gửi lệnh nhanh /mode, /navigation, /spolight-search.
                    </p>
                    <div className="w-full space-y-1.5">
                      {[
                        "/spolight-search vtv3",
                        "/mode light",
                        "/navigation dock",
                        "/subscribe premium",
                        "Mở kênh VTV3"
                      ].map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          className="w-full text-left text-[11px] p-2 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-all truncate cursor-pointer shadow-2xs font-mono"
                        >
                          {sug.startsWith("/") ? "⚡ " : "✨ "}
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  vIntelHistory.map((msg, idx) => {
                    const cleaned = cleanMessageText(msg.text);
                    const cmdChannel = msg.role === "model" ? getCommandChannel(msg.text) : null;

                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`p-3 text-xs leading-relaxed max-w-[90%] break-words rounded-2xl ${
                            msg.role === "user"
                              ? "bg-indigo-600 text-white shadow-xs font-medium"
                              : "bg-[#F1F5F9] text-slate-900 border border-slate-200/90 shadow-xs dark:bg-[#1E2230] dark:border-white/10 dark:text-slate-100"
                          }`}
                        >
                          {/* Markdown Text Formatting */}
                          <CopilotMarkdown content={cleaned} isUser={msg.role === "user"} />

                          {/* Quick Tune In */}
                          {cmdChannel && onSelectChannel && (
                            <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2">
                              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold truncate">
                                📡 {cmdChannel.name}
                              </span>
                              <button
                                onClick={() => onSelectChannel(cmdChannel)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-transform active:scale-95 shadow-xs"
                              >
                                <Play className="w-2.5 h-2.5 fill-white" /> Mở kênh
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                {isVIntelLoading && (
                  <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 p-2 bg-[#F1F5F9] dark:bg-[#1E2230] border border-slate-200/80 dark:border-white/10 rounded-lg animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Copilot for Vplay đang suy nghĩ...</span>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>

              {/* Chat Input Bar (Locked at bottom of window) */}
              <div className="p-2.5 border-t border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#181a24] flex items-center gap-1.5 shrink-0">
                <input
                  type="text"
                  value={vIntelQuery}
                  onChange={(e) => setVIntelQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={vIntelMode === "chat" ? "Nhắn tin hoặc gõ /mode, /navigation..." : "Tìm kênh..."}
                  className="flex-1 bg-[#F1F5F9] dark:bg-[#1E2230] text-slate-900 dark:text-white border border-slate-300 dark:border-white/15 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-[#232736] transition-colors"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!vIntelQuery.trim() || isVIntelLoading}
                  className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg transition-all cursor-pointer shadow-xs"
                  title="Gửi tin nhắn"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

