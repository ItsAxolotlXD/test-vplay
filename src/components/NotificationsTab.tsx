import React, { useState, useMemo } from "react";
import {
  Bell,
  ArrowLeft,
  CheckCheck,
  Trash2,
  Crown,
  GraduationCap,
  Box,
  RefreshCw,
  Gift,
  AlertCircle,
  MessageSquare,
  Sparkles,
  Filter,
  Check,
  X
} from "lucide-react";

export interface AppNotification {
  id: string;
  type: "verified_buy" | "verified_expire" | "vpearls" | "vstudy" | "vbox" | "update_success" | "update_available";
  title: string;
  message: string;
  time: string;
  timestamp: number;
  isRead: boolean;
  linkTab?: string;
}

interface NotificationsTabProps {
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onMarkRead: (id: string) => void;
  onDeleteNotification: (id: string) => void;
  onBack: () => void;
  onNavigateToTab: (tab: string) => void;
}

export default function NotificationsTab({
  notifications,
  onMarkAllRead,
  onClearAll,
  onMarkRead,
  onDeleteNotification,
  onBack,
  onNavigateToTab
}: NotificationsTabProps) {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Type filter
      if (filterType === "unread" && item.isRead) return false;
      if (filterType === "verified" && !item.type.startsWith("verified")) return false;
      if (filterType === "vstudy" && item.type !== "vstudy") return false;
      if (filterType === "vbox" && item.type !== "vbox") return false;
      if (filterType === "system" && !item.type.startsWith("update")) return false;
      if (filterType === "vpearls" && item.type !== "vpearls") return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.message.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [notifications, filterType, searchQuery]);

  const getNotificationIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "verified_buy":
        return <Crown className="w-5 h-5 text-amber-400 shrink-0" />;
      case "verified_expire":
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      case "vpearls":
        return <Gift className="w-5 h-5 text-emerald-400 shrink-0" />;
      case "vstudy":
        return <GraduationCap className="w-5 h-5 text-sky-400 shrink-0" />;
      case "vbox":
        return <Box className="w-5 h-5 text-purple-400 shrink-0" />;
      case "update_success":
        return <CheckCheck className="w-5 h-5 text-teal-400 shrink-0" />;
      case "update_available":
        return <RefreshCw className="w-5 h-5 text-indigo-400 shrink-0" />;
      default:
        return <Bell className="w-5 h-5 text-zinc-400 shrink-0" />;
    }
  };

  const getNotificationBadge = (type: AppNotification["type"]) => {
    switch (type) {
      case "verified_buy":
        return (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Verified VIP
          </span>
        );
      case "verified_expire":
        return (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Hết hạn VIP
          </span>
        );
      case "vpearls":
        return (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            V-Pearls
          </span>
        );
      case "vstudy":
        return (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
            V-Study
          </span>
        );
      case "vbox":
        return (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            V-Box Feedback
          </span>
        );
      case "update_success":
        return (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
            Cập nhật thành công
          </span>
        );
      case "update_available":
        return (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Bản cập nhật mới
          </span>
        );
      default:
        return null;
    }
  };

  const handleItemClick = (item: AppNotification) => {
    if (!item.isRead) {
      onMarkRead(item.id);
    }
    if (item.linkTab) {
      onNavigateToTab(item.linkTab);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 font-google text-white animate-fade-in select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400">
                <Bell className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Trung tâm Thông báo
              </h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-black text-xs">
                  {unreadCount} chưa đọc
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Cập nhật thông tin tài khoản, Verified VIP, V-Study, V-Box và bản cập nhật ứng dụng
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onMarkAllRead}
            disabled={unreadCount === 0}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 hover:text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            title="Đánh dấu tất cả là đã đọc"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Đã đọc tất cả</span>
          </button>
          <button
            onClick={onClearAll}
            disabled={notifications.length === 0}
            className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold text-rose-300 hover:text-rose-200 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            title="Xóa tất cả thông báo"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Xóa sạch</span>
          </button>
        </div>
      </div>

      {/* Filter Category Chips & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "all", label: "Tất cả", count: notifications.length },
            { id: "unread", label: "Chưa đọc", count: unreadCount },
            { id: "verified", label: "Verified VIP" },
            { id: "vpearls", label: "V-Pearls" },
            { id: "vstudy", label: "V-Study" },
            { id: "vbox", label: "V-Box" },
            { id: "system", label: "Cập nhật hệ thống" }
          ].map((tab) => {
            const isActive = filterType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? "bg-[#cc1827] border-red-500 text-white font-bold shadow-md shadow-red-900/30"
                    : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? "bg-white text-red-600" : "bg-white/20 text-white"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notification Items List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="py-16 text-center bg-white/5 rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-center">
            <Bell className="w-12 h-12 text-zinc-600 mb-3 opacity-60" />
            <p className="text-sm font-semibold text-zinc-300">Không có thông báo nào</p>            <p className="text-xs text-zinc-500 mt-1">
              Các thông báo mới nhất sẽ tự động xuất hiện ở đây khi có sự kiện diễn ra.
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !item.isRead
                  ? "bg-gradient-to-r from-red-950/20 via-zinc-900/90 to-zinc-900/90 border-red-500/30 shadow-lg shadow-black/40 hover:border-red-500/50"
                  : "bg-zinc-900/60 border-white/10 hover:bg-zinc-900/90 hover:border-white/20"
              }`}
            >
              {/* Unread Indicator Dot */}
              {!item.isRead && (
                <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse" />
              )}

              {/* Category Icon */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                {getNotificationIcon(item.type)}
              </div>

              {/* Main Content */}
              <div className="flex-1 pr-6 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {getNotificationBadge(item.type)}
                  <span className="text-[11px] text-zinc-400 font-sans">
                    {item.time}
                  </span>
                </div>
                <h3
                  className={`text-sm font-bold tracking-tight mb-1 ${
                    !item.isRead ? "text-white" : "text-zinc-200"
                  }`}
                >
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {item.message}
                </p>
              </div>

              {/* Action item buttons */}
              <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                {!item.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkRead(item.id);
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-300 border border-white/10 transition-colors cursor-pointer"
                    title="Đánh dấu đã đọc"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNotification(item.id);
                  }}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-white/10 transition-colors cursor-pointer"
                  title="Xóa thông báo này"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
