import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Tag,
  AlertCircle,
  Search,
  Filter,
  Sparkles,
  Check,
} from "lucide-react";
import { playPopSound } from "../../utils/sound";

export interface ReminderItem {
  id: string;
  title: string;
  category: "Công việc" | "Học tập" | "Cá nhân" | "Sức khỏe" | "Tài chính";
  dueDate: string;
  dueTime: string;
  priority: "High" | "Medium" | "Low";
  isCompleted: boolean;
  notes?: string;
}

const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: "rem-1",
    title: "Tham gia buổi họp Demo Waves V-Play Design System",
    category: "Công việc",
    dueDate: "2026-07-24",
    dueTime: "10:00",
    priority: "High",
    isCompleted: false,
    notes: "Chuẩn bị slide giới thiệu các thành phần V-Apps và V-Bank.",
  },
  {
    id: "rem-2",
    title: "Nộp bài tập ôn luyện V-Learn THPT môn Tiếng Anh",
    category: "Học tập",
    dueDate: "2026-07-24",
    dueTime: "16:30",
    priority: "Medium",
    isCompleted: true,
  },
  {
    id: "rem-3",
    title: "Xem trận chung kết bóng đá trực tiếp trên V-Play K+ Sports",
    category: "Cá nhân",
    dueDate: "2026-07-25",
    dueTime: "20:00",
    priority: "High",
    isCompleted: false,
    notes: "Đặt báo thức trước 15 phút để chuẩn bị nước và đồ ăn vặt.",
  },
];

export const VRemindersTab: React.FC = () => {
  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    try {
      const saved = localStorage.getItem("vplay_reminders_list");
      return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
    } catch {
      return INITIAL_REMINDERS;
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<ReminderItem["category"]>("Công việc");
  const [newPriority, setNewPriority] = useState<ReminderItem["priority"]>("Medium");
  const [newDueDate, setNewDueDate] = useState("2026-07-24");
  const [newDueTime, setNewDueTime] = useState("12:00");
  const [newNotes, setNewNotes] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("vplay_reminders_list", JSON.stringify(reminders));
    } catch {}
  }, [reminders]);

  const handleToggleComplete = (id: string) => {
    playPopSound();
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r))
    );
  };

  const handleDeleteReminder = (id: string) => {
    playPopSound();
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    playPopSound();
    const item: ReminderItem = {
      id: `rem-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      dueDate: newDueDate,
      dueTime: newDueTime,
      isCompleted: false,
      notes: newNotes.trim() || undefined,
    };

    setReminders([item, ...reminders]);
    setNewTitle("");
    setNewNotes("");
    setShowAddForm(false);
  };

  const filteredReminders = reminders.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.notes && r.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCat = filterCategory === "all" || r.category === filterCategory;
    const matchStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "completed"
        ? r.isCompleted
        : !r.isCompleted;
    return matchSearch && matchCat && matchStatus;
  });

  const pendingCount = reminders.filter((r) => !r.isCompleted).length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left text-white">
      {/* Top Banner Stat Bar in V-Flow style */}
      <div className="bg-[#1F1E24] border border-[#2D2D38] rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-md flex items-center justify-center text-white shrink-0">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                V-Reminders • Lịch Nhắc Việc
              </h2>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Task Sync
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Đang có <strong className="text-amber-400 font-bold">{pendingCount}</strong> việc cần hoàn thành
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playPopSound();
            setShowAddForm(!showAddForm);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Nhắc Nhở</span>
        </button>
      </div>

      {/* Add New Reminder Form Modal / Collapse */}
      {showAddForm && (
        <form
          onSubmit={handleAddReminder}
          className="rounded-2xl bg-[#1F1E24] border border-[#2D2D38] p-5 shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[#2D2D38] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Tạo nhắc nhở mới
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-[#9CA3AF] hover:text-white"
            >
              Đóng
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-xs font-semibold text-[#9CA3AF] mb-1">
                Tiêu đề việc cần làm <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Nhập công việc..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#18171E] border border-[#2D2D38] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9CA3AF] mb-1">Danh mục</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-[#18171E] border border-[#2D2D38] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="Công việc">Công việc</option>
                <option value="Học tập">Học tập</option>
                <option value="Cá nhân">Cá nhân</option>
                <option value="Sức khỏe">Sức khỏe</option>
                <option value="Tài chính">Tài chính</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">Mức độ ưu tiên</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full bg-[#1e192d] border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="High">Cao (Quan trọng)</option>
                <option value="Medium">Trung bình</option>
                <option value="Low">Thấp</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">Ngày nhắc</label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full bg-[#1e192d] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">Giờ nhắc</label>
              <input
                type="time"
                value={newDueTime}
                onChange={(e) => setNewDueTime(e.target.value)}
                className="w-full bg-[#1e192d] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-white/80 mb-1">Ghi chú bổ sung</label>
              <input
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Ghi chú chi tiết thêm..."
                className="w-full bg-white/[0.08] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-orange-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-[#2A2933] hover:bg-[#32303D] text-[#9CA3AF] hover:text-white text-xs font-semibold cursor-pointer border border-[#3E3D4D]"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Lưu Nhắc Nhở
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar */}
      <div className="rounded-2xl bg-[#1F1E24] border border-[#2D2D38] p-3 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm nhắc nhở..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#18171E] border border-[#2D2D38] rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {["all", "pending", "completed"].map((st) => (
            <button
              key={st}
              onClick={() => {
                playPopSound();
                setFilterStatus(st as any);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === st
                  ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md font-bold"
                  : "bg-[#2A2933] border border-[#3E3D4D] text-[#9CA3AF] hover:text-white"
              }`}
            >
              {st === "all" ? "Tất cả" : st === "pending" ? "Đang chờ" : "Đã hoàn thành"}
            </button>
          ))}
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <div className="rounded-2xl bg-[#1F1E24] border border-[#2D2D38] p-12 text-center text-[#9CA3AF] text-xs">
            Không có nhắc nhở nào khớp với bộ lọc.
          </div>
        ) : (
          filteredReminders.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 shadow-xl ${
                item.isCompleted
                  ? "bg-[#18171E] border-[#2D2D38] opacity-60"
                  : "bg-[#1F1E24] border-[#2D2D38] hover:border-[#3E3D4D]"
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                <button
                  onClick={() => handleToggleComplete(item.id)}
                  className="mt-0.5 text-[#9CA3AF] hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3
                      className={`text-xs sm:text-sm font-bold text-white ${
                        item.isCompleted ? "line-through text-[#9CA3AF]" : ""
                      }`}
                    >
                      {item.title}
                    </h3>
                    <span
                      className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase border ${
                        item.priority === "High"
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                          : item.priority === "Medium"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                  </div>
                  {item.notes && <p className="text-xs text-[#9CA3AF] mb-2.5 font-sans">{item.notes}</p>}
                  <div className="flex items-center gap-3 text-[11px] text-[#9CA3AF] flex-wrap font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" /> {item.dueDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> {item.dueTime}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-[#18171E] border border-[#2D2D38] text-[#9CA3AF] font-bold">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDeleteReminder(item.id)}
                className="p-2 rounded-xl bg-[#2A2933] hover:bg-rose-500/30 text-[#9CA3AF] hover:text-rose-300 border border-[#3E3D4D] transition-all cursor-pointer"
                title="Xóa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
