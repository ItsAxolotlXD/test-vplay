import React, { useState, useEffect, useRef } from "react";
import {
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
  Terminal,
  ChevronRight,
  Tv,
  Newspaper,
  Gamepad2,
  Crown,
  Wrench,
  Settings,
  Plus,
  Heart,
  HelpCircle,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { processCopilotCommand, SearchCategoryGroup, SearchItem } from "../utils/copilotCommands";
import { CopilotMarkdown } from "./CopilotMarkdown";
import { CopilotBetArena } from "./CopilotBetArena";
import { CopilotMessage, CopilotSession } from "./CopilotTab";
import { useSettings } from "../hooks/useSettings";

interface CopilotFloatingWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onDockBack: () => void;
  onSelectChannel?: (channel: any) => void;
  channels?: any[];
  navigate?: (route: string, state?: any) => void;
}

const STORAGE_SESSIONS_KEY = "copilot_chat_sessions";
const STORAGE_ACTIVE_ID_KEY = "copilot_active_session_id";
const LEGACY_HISTORY_KEY = "copilot_history";

export const CopilotFloatingWindow: React.FC<CopilotFloatingWindowProps> = ({
  isOpen,
  onClose,
  onDockBack,
  onSelectChannel,
  channels = [],
  navigate
}) => {
  const { settings } = useSettings();
  const [vIntelQuery, setVIntelQuery] = useState("");
  const [isVIntelLoading, setIsVIntelLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [spinCount, setSpinCount] = useState(0);

  // Sessions state
  const [sessions, setSessions] = useState<CopilotSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SESSIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
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
      const saved = localStorage.getItem(STORAGE_ACTIVE_ID_KEY);
      if (saved) return saved;
    } catch {}
    return sessions[0]?.id || `session-${Date.now()}`;
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const currentMessages = activeSession?.messages || [];

  // Sync history updates with localStorage and storage events
  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem(STORAGE_SESSIONS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSessions(parsed);
          }
        }
        const savedActive = localStorage.getItem(STORAGE_ACTIVE_ID_KEY);
        if (savedActive) setActiveSessionId(savedActive);
      } catch (e) {}
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("copilot_history_updated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("copilot_history_updated", handleStorage);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(sessions));
      localStorage.setItem(STORAGE_ACTIVE_ID_KEY, activeSessionId);
      if (activeSession) {
        localStorage.setItem(LEGACY_HISTORY_KEY, JSON.stringify(activeSession.messages));
      }
    } catch {}
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions, activeSessionId, activeSession]);

  const updateSessionMessages = (newMessages: CopilotMessage[]) => {
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

  const handleCreateNewChat = () => {
    if (activeSession && activeSession.messages.length === 0) {
      inputRef.current?.focus();
      return;
    }
    const fresh: CopilotSession = {
      id: `session-${Date.now()}`,
      title: "Cuộc trò chuyện mới",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: []
    };
    setSessions((prev) => [fresh, ...prev]);
    setActiveSessionId(fresh.id);
    setVIntelQuery("");
    setTimeout(() => inputRef.current?.focus(), 100);
    window.dispatchEvent(new Event("copilot_history_updated"));
  };

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || vIntelQuery;
    if (!promptToSend.trim() || isVIntelLoading) return;

    const userMsg: CopilotMessage = { role: "user", text: promptToSend, timestamp: Date.now() };
    const updatedHistory = [...currentMessages, userMsg];
    updateSessionMessages(updatedHistory);
    setVIntelQuery("");

    // Check if input is a slash command
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
      const newHist = [...updatedHistory, aiMsg];
      updateSessionMessages(newHist);

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
          history: updatedHistory.map((m) => ({ role: m.role, text: m.text })),
          channels: channels.map((c) => ({ id: c.id, name: c.name, group: c.group || c.category })),
          userName: settings.userName || "User",
          mode: "chat"
        })
      });

      const data = await response.json();
      if (data.text) {
        const aiMsg: CopilotMessage = { role: "model", text: data.text, timestamp: Date.now() };
        const newHist = [...updatedHistory, aiMsg];
        updateSessionMessages(newHist);

        // Channel auto-switch command
        const match = data.text.match(/\[COMMAND:\s*SWITCH_CHANNEL:\s*([a-zA-Z0-9_-]+)\]/);
        if (match && match[1] && onSelectChannel && channels.length > 0) {
          const targetChId = match[1].toLowerCase().trim();
          const found = channels.find(
            (c) => String(c.id).toLowerCase() === targetChId || String(c.name).toLowerCase().includes(targetChId)
          );
          if (found) {
            console.log("Copilot Window auto-switch command:", found.name);
          }
        }
      } else if (data.error) {
        updateSessionMessages([
          ...updatedHistory,
          { role: "model", text: `⚠️ ${data.error}`, timestamp: Date.now() }
        ]);
      }
    } catch (err: any) {
      updateSessionMessages([
        ...updatedHistory,
        {
          role: "model",
          text: "❌ Lỗi kết nối máy chủ AI. Bạn có thể sử dụng các phím lệnh `/search`, `/mode`, `/navigation`, `/subscribe premium` ngay lúc này.",
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsVIntelLoading(false);
    }
  };

  const handleClear = () => {
    updateSessionMessages([]);
  };

  const getCommandChannel = (text: string) => {
    const match = text.match(/\[COMMAND:\s*SWITCH_CHANNEL:\s*([a-zA-Z0-9_-]+)\]/);
    if (!match || !match[1] || !channels.length) return null;
    const targetId = match[1].toLowerCase().trim();
    return channels.find(
      (c) => String(c.id).toLowerCase() === targetId || String(c.name).toLowerCase().includes(targetId)
    );
  };

  const cleanMessageText = (text: string) => {
    let cleaned = text.replace(/\[COMMAND:\s*SWITCH_CHANNEL:\s*([a-zA-Z0-9_-]+)\]/g, "").trim();
    if (
      cleaned.includes('{"error"') ||
      cleaned.includes('"status":"UNAVAILABLE"') ||
      cleaned.includes('"code":503') ||
      cleaned.includes("high demand")
    ) {
      return "⚠️ Máy chủ AI đang trong lúc cao điểm hoặc có lưu lượng truy cập lớn. Bạn vui lòng thử lại sau giây lát, hoặc sử dụng trực tiếp các lệnh nhanh như /search, /mode, /navigation, /subscribe premium.";
    }
    return cleaned;
  };

  const handleItemClick = (item: SearchItem) => {
    if (item.category === "channel" || item.category === "favorites") {
      if (item.channelData && onSelectChannel) {
        onSelectChannel(item.channelData);
      }
      if (navigate && item.actionRoute) {
        navigate(item.actionRoute);
      }
    } else if (item.category === "news") {
      if (navigate && item.actionRoute) {
        navigate(item.actionRoute);
      }
    } else if (item.category === "vapp") {
      if (navigate && item.actionRoute) {
        navigate(item.actionRoute, item.actionState);
      }
    } else if (item.category === "vpremium") {
      if (navigate && item.actionRoute) {
        navigate(item.actionRoute, item.actionState);
      }
    } else if (item.category === "toolbox" || item.category === "settings" || item.category === "help" || item.category === "about") {
      if (navigate && item.actionRoute) {
        navigate(item.actionRoute);
      }
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Tv":
        return <Tv className="w-3.5 h-3.5 text-[#E50914]" />;
      case "Newspaper":
        return <Newspaper className="w-3.5 h-3.5 text-[#FF2020]" />;
      case "Gamepad2":
        return <Gamepad2 className="w-3.5 h-3.5 text-[#C83DFF]" />;
      case "Crown":
        return <Crown className="w-3.5 h-3.5 text-[#F59E0B]" />;
      case "Wrench":
        return <Wrench className="w-3.5 h-3.5 text-[#00E5FF]" />;
      case "Settings":
        return <Settings className="w-3.5 h-3.5 text-[#9CA3AF]" />;
      case "HelpCircle":
        return <HelpCircle className="w-3.5 h-3.5 text-[#3B82F6]" />;
      case "Info":
        return <Info className="w-3.5 h-3.5 text-[#8B5CF6]" />;
      case "Heart":
        return <Heart className="w-3.5 h-3.5 text-[#EC4899]" />;
      case "Bot":
        return <Bot className="w-3.5 h-3.5 text-[#E50914]" />;
      default:
        return <Search className="w-3.5 h-3.5 text-[#E50914]" />;
    }
  };

  const isTypingSearch = vIntelQuery.trim().toLowerCase().startsWith("/search");

  if (!isOpen) return null;

  return (
    <div id="copilot-floating-container" className="fixed bottom-6 right-6 z-9999 font-sans select-none">
      <AnimatePresence>
        <motion.div
          drag
          dragMomentum={false}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2 }}
          className={`bg-white dark:bg-[#13141c] text-slate-900 dark:text-white rounded-2xl shadow-2xl border border-slate-300 dark:border-white/15 flex flex-col overflow-hidden backdrop-blur-xl ${
            isMinimized ? "w-72 h-14" : "w-[360px] sm:w-[420px] h-[520px] max-h-[85vh]"
          }`}
        >
          {/* Draggable Titlebar Header */}
          <div className="p-3 bg-slate-100 dark:bg-[#1A1921] border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-2 cursor-grab active:cursor-grabbing shrink-0">
            <div className="flex items-center gap-2">
              <GripHorizontal className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <div
                onClick={() => setSpinCount((p) => p + 1)}
                className="cursor-pointer group flex items-center gap-1.5"
                title="Nhấn để xoay biểu tượng"
              >
                <motion.img
                  animate={{ rotate: spinCount * 360 }}
                  transition={{ duration: 0.6 }}
                  src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/microsoft-copilot.svg";
                  }}
                  className="w-5 h-5 object-contain"
                  referrerPolicy="no-referrer"
                  alt="Copilot"
                />
                <span className="font-bold text-xs tracking-tight text-slate-800 dark:text-white truncate max-w-[140px]">
                  Copilot for Vplay
                </span>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleCreateNewChat}
                className="p-1 text-slate-500 hover:text-[#E50914] rounded-lg transition-colors cursor-pointer"
                title="Tạo cuộc trò chuyện mới"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onDockBack}
                className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Thu về dạng Tab"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                title={isMinimized ? "Phóng to" : "Thu nhỏ"}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={onClose}
                className="p-1 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                title="Đóng cửa sổ"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Window Body (hidden when minimized) */}
          {!isMinimized && (
            <div className="flex-1 flex flex-col min-h-0 bg-transparent">
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
                {currentMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 dark:text-slate-500">
                    <img
                      src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/microsoft-copilot.svg";
                      }}
                      className="w-8 h-8 mb-2 opacity-80"
                      referrerPolicy="no-referrer"
                      alt="Copilot"
                    />
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Sẵn sàng trò chuyện cùng bạn
                    </p>
                    <p className="text-[10px] text-slate-500 max-w-[240px] mt-1">
                      Nhập tin nhắn hoặc gõ <code className="text-[#E50914] font-bold">/search</code> để tra cứu kênh, Space 360, tin tức...
                    </p>
                  </div>
                ) : (
                  currentMessages.map((msg, idx) => {
                    const cmdChannel = msg.role === "model" ? getCommandChannel(msg.text) : null;
                    const cleaned = cleanMessageText(msg.text);

                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`p-3 text-xs leading-relaxed max-w-[90%] rounded-2xl break-words shadow-2xs ${
                            msg.role === "user"
                              ? "bg-[#E50914] text-white font-medium"
                              : "bg-slate-100 dark:bg-[#1E1D24] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-[#34343E]"
                          }`}
                        >
                          <CopilotMarkdown content={cleaned} isUser={msg.role === "user"} />

                          {/* Interactive Bet Arena */}
                          {(msg.isBetArena || (cleaned && cleaned.includes("SỚI CƯỢC ORBS VIP"))) && (
                            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-[#34343E]">
                              <CopilotBetArena
                                initialGame={msg.betGame || "baucua"}
                                initialAmount={msg.betAmount || 500}
                              />
                            </div>
                          )}

                          {/* Categorized results in floating window */}
                          {msg.searchCategoryResults && msg.searchCategoryResults.length > 0 && (
                            <div className="mt-3 space-y-3 pt-2 border-t border-slate-200 dark:border-[#34343E]">
                              {msg.searchCategoryResults.map((group, gIdx) => (
                                <div key={gIdx} className="space-y-1.5">
                                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-900 dark:text-white px-1">
                                    <div className="flex items-center gap-1.5">
                                      {getCategoryIcon(group.icon)}
                                      <span>{group.category}</span>
                                    </div>
                                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-white/10">
                                      {group.items.length}
                                    </span>
                                  </div>

                                  <div className="space-y-1">
                                    {group.items.map((item) => (
                                      <div
                                        key={item.id}
                                        onClick={() => handleItemClick(item)}
                                        className="p-2 rounded-xl bg-white dark:bg-[#28272E] hover:bg-slate-50 dark:hover:bg-[#34333D] border border-slate-200 dark:border-[#3E3D48] cursor-pointer flex items-center justify-between gap-2 group transition-all"
                                      >
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-1.5 truncate">
                                            <span className="font-semibold text-[11px] text-slate-900 dark:text-white truncate">
                                              {item.title}
                                            </span>
                                            {item.badge && (
                                              <span className="text-[9px] px-1 rounded bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 font-mono shrink-0">
                                                {item.badge}
                                              </span>
                                            )}
                                          </div>
                                          {item.subtitle && (
                                            <p className="text-[10px] text-slate-500 dark:text-[#9CA3AF] truncate mt-0.5">
                                              {item.subtitle}
                                            </p>
                                          )}
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-[#E50914] shrink-0" />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Single Channel Quick Tune In */}
                          {cmdChannel && onSelectChannel && !msg.searchCategoryResults && (
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
                  <div className="flex items-center gap-2 text-xs text-[#E50914] p-2 bg-[#F1F5F9] dark:bg-[#1E1D24] border border-slate-200/80 dark:border-[#34343E] rounded-lg animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Copilot for Vplay đang xử lý...</span>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>

              {/* Chat Input Bar (Conditional Magnifying glass only when /search) */}
              <div className="p-2.5 border-t border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#181a24] flex items-center gap-1.5 shrink-0">
                {isTypingSearch && (
                  <div className="w-4 h-4 flex items-center justify-center shrink-0 ml-1">
                    <Search className="w-3.5 h-3.5 text-[#E50914]" />
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={vIntelQuery}
                  onChange={(e) => setVIntelQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={isTypingSearch ? "Gõ từ khóa tìm kiếm..." : "Nhắn tin hoặc gõ /search, /mode..."}
                  className="flex-1 bg-[#F1F5F9] dark:bg-[#1E1D24] text-slate-900 dark:text-white border border-slate-300 dark:border-white/15 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#E50914] focus:bg-white dark:focus:bg-[#232736] transition-colors"
                />
                {vIntelQuery && (
                  <button
                    onClick={() => setVIntelQuery("")}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => handleSend()}
                  disabled={!vIntelQuery.trim() || isVIntelLoading}
                  className="p-2 bg-[#E50914] hover:bg-[#C20710] disabled:opacity-40 text-white rounded-lg transition-all cursor-pointer shadow-xs"
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
