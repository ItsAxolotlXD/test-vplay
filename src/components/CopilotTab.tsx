import React, { useState, useEffect, useRef } from "react";
import {
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
  Terminal,
  Tv,
  Newspaper,
  Gamepad2,
  Crown,
  Wrench,
  Settings,
  X,
  Plus,
  History,
  MessageSquare,
  Heart,
  Info,
  SlidersHorizontal,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { processCopilotCommand, SearchCategoryGroup, SearchItem } from "../utils/copilotCommands";
import { CopilotMarkdown } from "./CopilotMarkdown";
import { useSettings } from "../hooks/useSettings";

export interface CopilotMessage {
  role: "user" | "model";
  text: string;
  searchCategoryResults?: SearchCategoryGroup[];
  timestamp?: number;
}

export interface CopilotSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: CopilotMessage[];
}

interface CopilotTabProps {
  onBack?: () => void;
  onSelectChannel?: (channel: any) => void;
  channels?: any[];
  onDetachWindow?: () => void;
  isDetached?: boolean;
  navigate?: (route: string, state?: any) => void;
}

const STORAGE_SESSIONS_KEY = "copilot_chat_sessions";
const STORAGE_ACTIVE_ID_KEY = "copilot_active_session_id";
const LEGACY_HISTORY_KEY = "copilot_history";

export const CopilotTab: React.FC<CopilotTabProps> = ({
  onBack,
  onSelectChannel,
  channels = [],
  onDetachWindow,
  isDetached = false,
  navigate
}) => {
  const { settings } = useSettings();
  const [vIntelQuery, setVIntelQuery] = useState("");
  const [isVIntelLoading, setIsVIntelLoading] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  // Sessions state initialization
  const [sessions, setSessions] = useState<CopilotSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SESSIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      // Migrate legacy single history if exists
      const legacy = localStorage.getItem(LEGACY_HISTORY_KEY);
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
          const initialSession: CopilotSession = {
            id: `session-${Date.now()}`,
            title: parsedLegacy[0]?.text?.slice(0, 30) || "Đoạn chat trước",
            createdAt: Date.now() - 3600000,
            updatedAt: Date.now(),
            messages: parsedLegacy
          };
          return [initialSession];
        }
      }
    } catch (e) {
      console.error("Error loading chat sessions:", e);
    }
    // Default empty new session
    const defaultSession: CopilotSession = {
      id: `session-${Date.now()}`,
      title: "Cuộc trò chuyện mới",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: []
    };
    return [defaultSession];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    try {
      const savedActive = localStorage.getItem(STORAGE_ACTIVE_ID_KEY);
      if (savedActive) return savedActive;
    } catch {}
    return sessions[0]?.id || `session-${Date.now()}`;
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Current active session messages
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const currentMessages = activeSession?.messages || [];

  // Sync sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(sessions));
      localStorage.setItem(STORAGE_ACTIVE_ID_KEY, activeSessionId);
      // Keep legacy key updated for backwards compatibility
      if (activeSession) {
        localStorage.setItem(LEGACY_HISTORY_KEY, JSON.stringify(activeSession.messages));
      }
    } catch (e) {
      console.error("Failed to save sessions", e);
    }
  }, [sessions, activeSessionId, activeSession]);

  // Sync across tabs & windows
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
      } catch (e) {}
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("copilot_history_updated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("copilot_history_updated", handleStorage);
    };
  }, []);

  // Auto scroll when messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, isVIntelLoading]);

  // Create new chat handler
  const handleCreateNewChat = () => {
    // If active session is already empty, just focus input
    if (activeSession && activeSession.messages.length === 0) {
      inputRef.current?.focus();
      setIsHistoryDrawerOpen(false);
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
    setVIntelQuery("");
    setIsHistoryDrawerOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
    window.dispatchEvent(new Event("copilot_history_updated"));
  };

  // Delete a specific session
  const handleDeleteSession = (sessionId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== sessionId);
      if (filtered.length === 0) {
        const fresh: CopilotSession = {
          id: `session-${Date.now()}`,
          title: "Cuộc trò chuyện mới",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messages: []
        };
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (activeSessionId === sessionId) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
    window.dispatchEvent(new Event("copilot_history_updated"));
  };

  // Clear all sessions
  const handleClearAllHistory = () => {
    const fresh: CopilotSession = {
      id: `session-${Date.now()}`,
      title: "Cuộc trò chuyện mới",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: []
    };
    setSessions([fresh]);
    setActiveSessionId(fresh.id);
    localStorage.removeItem(LEGACY_HISTORY_KEY);
    window.dispatchEvent(new Event("copilot_history_updated"));
  };

  // Append message to active session
  const updateSessionMessages = (newMessages: CopilotMessage[]) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          // Generate title from first user query if still generic
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

        // Check if there is an auto-switch command in response
        const match = data.text.match(/\[COMMAND:\s*SWITCH_CHANNEL:\s*([a-zA-Z0-9_-]+)\]/);
        if (match && match[1] && onSelectChannel && channels.length > 0) {
          const targetChId = match[1].toLowerCase().trim();
          const found = channels.find(
            (c) => String(c.id).toLowerCase() === targetChId || String(c.name).toLowerCase().includes(targetChId)
          );
          if (found) {
            console.log("Copilot auto-detected channel command:", found.name);
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
          text: "❌ Lỗi kết nối máy chủ AI. Bạn có thể sử dụng các lệnh điều khiển nhanh như `/search`, `/mode`, `/navigation`, `/subscribe premium` ngay lập tức.",
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsVIntelLoading(false);
    }
  };

  // Helper to extract channel command from AI message text
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
        return <Tv className="w-4 h-4 text-[#E50914]" />;
      case "Newspaper":
        return <Newspaper className="w-4 h-4 text-[#FF2020]" />;
      case "Gamepad2":
        return <Gamepad2 className="w-4 h-4 text-[#C83DFF]" />;
      case "Crown":
        return <Crown className="w-4 h-4 text-[#F59E0B]" />;
      case "Wrench":
        return <Wrench className="w-4 h-4 text-[#00E5FF]" />;
      case "Settings":
        return <Settings className="w-4 h-4 text-[#9CA3AF]" />;
      case "HelpCircle":
        return <HelpCircle className="w-4 h-4 text-[#3B82F6]" />;
      case "Info":
        return <Info className="w-4 h-4 text-[#8B5CF6]" />;
      case "Heart":
        return <Heart className="w-4 h-4 text-[#EC4899]" />;
      case "Bot":
        return <Bot className="w-4 h-4 text-[#E50914]" />;
      default:
        return <Search className="w-4 h-4 text-[#E50914]" />;
    }
  };

  // Whether user is currently typing a /search command
  const isTypingSearch = vIntelQuery.trim().toLowerCase().startsWith("/search");

  // Search filter list for quick pill clicking
  const searchFilterPills = [
    { key: "tv", label: "Kênh TV", icon: <Tv className="w-3 h-3 text-[#E50914]" /> },
    { key: "news", label: "Tin tức", icon: <Newspaper className="w-3 h-3 text-[#FF2020]" /> },
    { key: "copilot", label: "Lịch sử chat", icon: <Bot className="w-3 h-3 text-[#E50914]" /> },
    { key: "space360", label: "Space 360", icon: <Gamepad2 className="w-3 h-3 text-[#C83DFF]" /> },
    { key: "premium", label: "Premium", icon: <Crown className="w-3 h-3 text-[#F59E0B]" /> },
    { key: "favorites", label: "Yêu thích", icon: <Heart className="w-3 h-3 text-[#EC4899]" /> },
    { key: "toolbox", label: "Toolbox", icon: <Wrench className="w-3 h-3 text-[#00E5FF]" /> },
    { key: "help", label: "Hướng dẫn", icon: <HelpCircle className="w-3 h-3 text-[#3B82F6]" /> },
    { key: "about", label: "Thông tin", icon: <Info className="w-3 h-3 text-[#8B5CF6]" /> },
    { key: "settings", label: "Cài đặt", icon: <Settings className="w-3 h-3 text-[#9CA3AF]" /> }
  ];

  return (
    <div
      id="waves-copilot-view"
      className="w-full max-w-6xl mx-auto p-3 sm:p-5 text-slate-900 dark:text-white font-sans h-[calc(100vh-80px)] sm:h-[calc(100vh-90px)] flex flex-col overflow-hidden bg-transparent select-none"
    >
      {/* Copilot Header */}
      <div className="shrink-0 p-3 sm:p-4 border-b border-slate-200 dark:border-white/10 mb-3 flex items-center justify-between gap-3 bg-white/70 dark:bg-transparent rounded-2xl shadow-xs dark:shadow-none">
        <div className="flex items-center gap-3.5 relative z-10">
          <div
            onClick={() => setSpinCount((prev) => prev + 1)}
            className="relative cursor-pointer group shrink-0"
            title="Nhấn để xoay biểu tượng Copilot for Vplay"
          >
            <motion.img
              animate={{ rotate: spinCount * 360 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/microsoft-copilot.svg";
              }}
              className="w-9 h-9 sm:w-11 sm:h-11 object-contain filter drop-shadow-[0_0_12px_rgba(99,102,241,0.6)] group-hover:scale-110 transition-transform"
              referrerPolicy="no-referrer"
              alt="Copilot for Vplay"
            />
            {isVIntelLoading && (
              <span className="absolute -inset-1 border-2 border-red-500 animate-ping opacity-75 rounded-full" />
            )}
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-montserrat">
              Copilot for Vplay
            </h1>
          </div>
        </div>

        {/* Right Actions: Create new chat, Standalone Mode, Chat History toggle, Detach, Clear */}
        <div className="flex items-center flex-wrap gap-2 justify-end relative z-10">
          {/* Open as standalone page button */}
          <button
            id="btn-open-copilot-standalone"
            onClick={() => navigate?.('/copilot-standalone')}
            className="px-3.5 py-1.5 bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 rounded-xl shadow-md shadow-[#5865F2]/25 active:scale-95"
            title="Mở giao diện độc lập toàn màn hình (Standalone Page)"
          >
            <Maximize2 className="w-3.5 h-3.5 text-white" />
            <span>Open as standalone page</span>
          </button>

          {/* Create new chat button */}
          <button
            id="btn-create-new-chat"
            onClick={handleCreateNewChat}
            className="px-3.5 py-1.5 bg-[#E50914] hover:bg-[#C20710] text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 rounded-xl shadow-md shadow-[#E50914]/25 active:scale-95"
            title="Tạo cuộc trò chuyện mới"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>Create new chat</span>
          </button>

          {/* History Drawer Toggle */}
          <button
            id="btn-toggle-chat-history"
            onClick={() => setIsHistoryDrawerOpen((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 border active:scale-95 ${
              isHistoryDrawerOpen
                ? "bg-slate-200 dark:bg-white/20 text-slate-900 dark:text-white border-slate-300 dark:border-white/30"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10"
            }`}
            title="Xem lịch sử trò chuyện"
          >
            <History className="w-3.5 h-3.5 text-[#E50914]" />
            <span className="hidden sm:inline">Lịch sử</span>
            {sessions.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-white/10 text-[10px]">
                {sessions.length}
              </span>
            )}
          </button>

          {/* Detach Window Button */}
          {onDetachWindow && (
            <button
              id="btn-detach-copilot"
              onClick={onDetachWindow}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-200 border border-slate-200 dark:border-white/10 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 rounded-xl active:scale-95"
              title="Tách Copilot thành cửa sổ nổi có thể di chuyển"
            >
              <AppWindow className="w-3.5 h-3.5 text-[#E50914]" />
              <span className="hidden md:inline">Detach Window</span>
            </button>
          )}

          {currentMessages.length > 0 && (
            <button
              onClick={() => handleDeleteSession(activeSessionId)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 dark:bg-white/5 dark:hover:bg-red-500/20 text-slate-700 hover:text-rose-600 dark:text-slate-300 dark:hover:text-red-400 border border-slate-200 hover:border-rose-300 dark:border-white/10 dark:hover:border-red-500/30 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 rounded-xl"
              title="Xóa đoạn chat hiện tại"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xóa đoạn này</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Layout Area (with collapsible Chat History Sidebar) */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative bg-transparent gap-3">
        {/* Chat History Panel (Desktop Drawer / Mobile Overlay) */}
        <AnimatePresence>
          {isHistoryDrawerOpen && (
            <motion.div
              id="copilot-history-panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="shrink-0 h-full flex flex-col bg-white dark:bg-[#1A1921] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-lg z-20"
            >
              {/* History Header */}
              <div className="p-3 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-2 bg-slate-50 dark:bg-[#201F29]">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-[#E50914]" />
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                    Lịch sử chat
                  </span>
                </div>
                <button
                  onClick={() => setIsHistoryDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* History Actions */}
              <div className="p-2.5 border-b border-slate-200 dark:border-white/10">
                <button
                  onClick={handleCreateNewChat}
                  className="w-full py-2 px-3 bg-[#E50914]/10 hover:bg-[#E50914] text-[#E50914] hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Tạo đoạn chat mới</span>
                </button>
              </div>

              {/* Sessions List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {sessions.map((session) => {
                  const isActive = session.id === activeSessionId;
                  const dateStr = new Date(session.updatedAt).toLocaleDateString("vi-VN", {
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  });

                  return (
                    <div
                      key={session.id}
                      onClick={() => {
                        setActiveSessionId(session.id);
                        if (window.innerWidth < 768) {
                          setIsHistoryDrawerOpen(false);
                        }
                      }}
                      className={`group p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-2 ${
                        isActive
                          ? "bg-[#E50914]/15 border border-[#E50914]/40 text-slate-900 dark:text-white font-semibold"
                          : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <MessageSquare
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isActive ? "text-[#E50914]" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs truncate">{session.title || "Cuộc trò chuyện mới"}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                            {dateStr} • {session.messages.length} tin
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 rounded transition-opacity cursor-pointer text-slate-400"
                        title="Xóa đoạn chat này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Clear All Footer */}
              {sessions.length > 1 && (
                <div className="p-2 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#201F29]">
                  <button
                    onClick={handleClearAllHistory}
                    className="w-full py-1.5 text-[11px] text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 font-mono font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Xóa toàn bộ lịch sử</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Conversation Workspace */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative bg-transparent">
          {/* Floating Window Notice if detached */}
          {isDetached && (
            <div className="shrink-0 mb-3 p-3 bg-red-50 dark:bg-[#1E1D24] border border-red-200 dark:border-[#E50914]/30 rounded-xl flex items-center justify-between gap-3 text-xs font-sans">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
                <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
                <span>
                  Copilot for Vplay đang hoạt động dưới dạng <strong>cửa sổ nổi</strong>.
                </span>
              </div>
              <button
                onClick={onDetachWindow}
                className="px-2.5 py-1 bg-white dark:bg-[#E50914] hover:bg-slate-100 dark:hover:bg-[#C20710] text-[#E50914] dark:text-white border border-red-200 dark:border-transparent rounded-lg text-[11px] font-bold cursor-pointer transition-all shadow-xs"
              >
                Thu hồi vào Tab
              </button>
            </div>
          )}

          {/* Quick Command Chips */}
          <div className="shrink-0 flex items-center justify-between pb-2 mb-1 flex-wrap gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono text-slate-600 dark:text-slate-300 no-scrollbar">
              <button
                onClick={() => {
                  setVIntelQuery("/search ");
                  inputRef.current?.focus();
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-[#E50914] dark:bg-[#202026] dark:hover:bg-[#2A2A32] dark:text-slate-300 border border-slate-200 dark:border-[#383842] rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-semibold"
              >
                <Search className="w-3 h-3 text-[#E50914]" />
                <span>/search</span>
              </button>
              <button
                onClick={() => {
                  setVIntelQuery("/mode ");
                  inputRef.current?.focus();
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-[#E50914] dark:bg-[#202026] dark:hover:bg-[#2A2A32] dark:text-slate-300 border border-slate-200 dark:border-[#383842] rounded-lg transition-colors cursor-pointer"
              >
                /mode
              </button>
              <button
                onClick={() => {
                  setVIntelQuery("/navigation ");
                  inputRef.current?.focus();
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-[#E50914] dark:bg-[#202026] dark:hover:bg-[#2A2A32] dark:text-slate-300 border border-slate-200 dark:border-[#383842] rounded-lg transition-colors cursor-pointer"
              >
                /navigation
              </button>
              <button
                onClick={() => handleSend("/subscribe premium")}
                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-[#E50914] dark:bg-[#E50914]/20 dark:hover:bg-[#E50914]/30 dark:text-red-400 border border-red-200 dark:border-[#E50914]/40 rounded-lg transition-colors cursor-pointer font-bold flex items-center gap-1"
              >
                <Crown className="w-3 h-3 text-[#E50914]" />
                <span>/subscribe premium</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Selection Bar if typing /search */}
          <AnimatePresence>
            {isTypingSearch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="shrink-0 mb-2 p-2 bg-slate-100/90 dark:bg-[#1E1D24] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden"
              >
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
                  <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 px-1">
                    Bộ lọc:
                  </span>
                  {searchFilterPills.map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => {
                        const currentVal = vIntelQuery.trim();
                        // If already has filter keyword, replace it or append
                        if (currentVal.includes(" filter ")) {
                          const base = currentVal.split(" filter ")[0];
                          setVIntelQuery(`${base} filter ${filter.key}`);
                        } else if (currentVal === "/search" || currentVal === "/search ") {
                          setVIntelQuery(`/search filter ${filter.key}`);
                        } else {
                          setVIntelQuery(`${currentVal} filter ${filter.key}`);
                        }
                        inputRef.current?.focus();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#2A2933] hover:bg-[#E50914]/10 hover:text-[#E50914] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      {filter.icon}
                      <span>{filter.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message Feed Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2 min-h-0">
            {currentMessages.length === 0 ? (
              <div className="h-full min-h-[280px] flex flex-col items-center justify-center py-8 text-center text-slate-500 dark:text-slate-400">
                <div className="w-16 h-16 bg-red-50 dark:bg-white/5 border border-red-100 dark:border-white/10 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <img
                    src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/microsoft-copilot.svg";
                    }}
                    className="w-10 h-10 object-contain"
                    referrerPolicy="no-referrer"
                    alt="Copilot for Vplay"
                  />
                </div>

                <h2 className="text-xl font-bold font-montserrat text-slate-900 dark:text-white mb-2">
                  Xin chào! Mình là Copilot for Vplay
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mb-4 font-sans">
                  Hãy xưng 'mình' - 'bạn' cùng Copilot for Vplay! Bạn có thể sử dụng lệnh{" "}
                  <code className="text-[#E50914] font-bold">/search &lt;từ khóa&gt; filter &lt;loại&gt;</code> để tra
                  cứu hoặc trò chuyện trực tiếp.
                </p>

                {/* Standalone Page Quick Launcher Banner */}
                {navigate && (
                  <div className="w-full max-w-xl mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-[#5865F2]/15 via-purple-500/10 to-[#E50914]/15 border border-[#5865F2]/30 flex items-center justify-between gap-3 text-left">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#5865F2] flex items-center justify-center text-white shrink-0 shadow-md">
                        <Maximize2 className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Standalone Copilot Page</h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                          Trải nghiệm giao diện ứng dụng AI độc lập toàn màn hình
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/copilot-standalone')}
                      className="px-3 py-1.5 bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold rounded-xl whitespace-nowrap shadow-sm active:scale-95 cursor-pointer shrink-0"
                    >
                      Open standalone
                    </button>
                  </div>
                )}

                {/* Suggestions */}
                <div className="w-full max-w-xl space-y-2 text-left">
                  <p className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                    Gợi ý câu hỏi & lệnh nhanh:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "/search vtv3",
                      "/search bóng đá filter tv",
                      "/search filter copilot",
                      "/search filter space360",
                      "/mode light",
                      "/navigation dock"
                    ].map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        className="p-3 bg-[#F1F5F9] hover:bg-white border border-slate-200 hover:border-[#E50914]/50 text-xs font-mono text-slate-800 hover:text-[#E50914] rounded-xl transition-all cursor-pointer flex items-center gap-2.5 text-left group shadow-xs dark:bg-[#1E1D24] dark:hover:bg-[#26252E] dark:border-[#34343E] dark:hover:border-[#E50914]/50 dark:text-slate-200 dark:hover:text-white"
                      >
                        {sug.startsWith("/search") ? (
                          <Search className="w-4 h-4 text-[#E50914] shrink-0 group-hover:scale-110 transition-transform" />
                        ) : sug.startsWith("/") ? (
                          <Terminal className="w-4 h-4 text-[#E50914] shrink-0 group-hover:rotate-12 transition-transform" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-[#E50914] shrink-0 group-hover:rotate-12 transition-transform" />
                        )}
                        <span className="truncate">{sug}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pb-2">
                {currentMessages.map((msg, idx) => {
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
                            <span className="w-2 h-2 bg-[#E50914] rounded-full" />
                            <span className="text-[#E50914] font-bold">Copilot for Vplay</span>
                          </>
                        )}
                      </div>

                      <div
                        className={`p-4 text-xs sm:text-sm leading-relaxed max-w-[92%] sm:max-w-[85%] break-words rounded-2xl ${
                          msg.role === "user"
                            ? "bg-[#E50914] text-white shadow-md font-medium"
                            : "bg-[#F1F5F9] text-slate-900 border border-slate-200/90 shadow-xs dark:bg-[#1E1D24] dark:border-[#34343E] dark:text-slate-100"
                        }`}
                      >
                        {/* Markdown Text Formatting */}
                        <CopilotMarkdown content={cleanedText} isUser={msg.role === "user"} />

                        {/* Rich Categorized Search Results List */}
                        {msg.searchCategoryResults && msg.searchCategoryResults.length > 0 && (
                          <div className="mt-4 space-y-4 pt-3 border-t border-slate-200 dark:border-[#34343E]">
                            {msg.searchCategoryResults.map((group, gIdx) => (
                              <div key={gIdx} className="space-y-2">
                                {/* Category Header */}
                                <div className="flex items-center justify-between px-1">
                                  <div className="flex items-center gap-2">
                                    {getCategoryIcon(group.icon)}
                                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                      {group.category}
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                                    {group.items.length}
                                  </span>
                                </div>

                                {/* Category List Items */}
                                <div className="grid grid-cols-1 gap-1.5">
                                  {group.items.map((item) => (
                                    <div
                                      key={item.id}
                                      onClick={() => handleItemClick(item)}
                                      className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-[#28272E] hover:bg-slate-100 dark:hover:bg-[#34333D] border border-slate-200 dark:border-[#3E3D48] transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-2xs hover:shadow-xs hover:border-[#E50914]/50"
                                    >
                                      <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#1E1D22] flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/5 group-hover:scale-105 transition-transform">
                                          {getCategoryIcon(group.icon)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-[#E50914] transition-colors truncate">
                                              {item.title}
                                            </span>
                                            {item.badge && (
                                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-mono font-medium shrink-0">
                                                {item.badge}
                                              </span>
                                            )}
                                          </div>
                                          {item.subtitle && (
                                            <p className="text-[11px] text-slate-500 dark:text-[#9CA3AF] truncate mt-0.5">
                                              {item.subtitle}
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                          type="button"
                                          className="px-2.5 py-1 rounded-lg bg-[#E50914]/10 hover:bg-[#E50914] text-[#E50914] hover:text-white text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                                        >
                                          <span>Mở</span>
                                          <ChevronRight className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Interactive Tune-In Button for Single Channel Match */}
                        {targetChannel && onSelectChannel && !msg.searchCategoryResults && (
                          <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-[#34343E] flex items-center justify-between gap-3">
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
                    <div className="text-[10px] font-mono font-bold text-[#E50914] mb-1 px-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-[#E50914] rounded-full animate-ping" />
                      <span>Copilot for Vplay đang xử lý...</span>
                    </div>
                    <div className="p-4 bg-[#F1F5F9] dark:bg-[#1E1D24] border border-slate-200 dark:border-[#34343E] rounded-2xl text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 shadow-xs">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#E50914]" />
                      <span>Đang tổng hợp thông tin và tìm kiếm dữ liệu...</span>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            )}
          </div>

          {/* Text Input Area with Spotlight Search Box Design Style */}
          {/* Requirement: No magnifying glass by default; only show magnifying glass when typing /search */}
          <div className="shrink-0 mt-3 pt-2">
            <div className="w-full h-[52px] sm:h-[56px] flex items-center justify-between px-3.5 sm:px-4 rounded-full spotlight-bubble-box search-box-capsule text-sm transition-all">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Conditionally rendered Magnifying Glass: Only visible when query starts with /search */}
                <AnimatePresence>
                  {isTypingSearch && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0, width: 0 }}
                      animate={{ scale: 1, opacity: 1, width: 20 }}
                      exit={{ scale: 0, opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-[20px] h-[20px] min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] flex items-center justify-center shrink-0 overflow-hidden"
                    >
                      <img
                        src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest?cb=20260717131751"
                        alt="Search"
                        referrerPolicy="no-referrer"
                        className="w-full h-full aspect-square object-contain brightness-0 invert opacity-85 topbar-search-icon"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <input
                  ref={inputRef}
                  id="copilot-query-input"
                  type="text"
                  value={vIntelQuery}
                  onChange={(e) => setVIntelQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={
                    isTypingSearch
                      ? "Gõ từ khóa tìm kiếm (Ví dụ: vtv3, thời sự, bóng đá filter tv)..."
                      : "Nhập tin nhắn hoặc gõ /search, /mode, /navigation, /subscribe..."
                  }
                  className="w-full bg-transparent text-slate-900 dark:text-white placeholder-[#8E8E93] text-sm focus:outline-none font-medium truncate"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                {vIntelQuery && (
                  <button
                    onClick={() => setVIntelQuery("")}
                    className="p-1.5 rounded-full text-[#8E8E93] hover:text-white transition-colors cursor-pointer"
                    title="Xóa nội dung"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => handleSend()}
                  disabled={!vIntelQuery.trim() || isVIntelLoading}
                  className="px-4 py-2 bg-[#E50914] hover:bg-[#C20710] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-full flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-md shadow-[#E50914]/20"
                  title="Gửi"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline">Gửi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
