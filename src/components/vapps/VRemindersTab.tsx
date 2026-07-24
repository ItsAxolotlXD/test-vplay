import React, { useState } from "react";
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
  Sparkles
} from "lucide-react";

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
    title: "Tham gia buổi họp Demo Vplay Ore UI Design System",
    category: "Công việc",
    dueDate: "2026-07-24",
    dueTime: "10:00",
    priority: "High",
    isCompleted: false,
    notes: "Chuẩn bị slide giới thiệu các thành phần V-Office và V-Bank."
  },
  {
    id: "rem-2",
    title: "Nộp bài tập ôn luyện V-Learn THPT môn Tiếng Anh",
    category: "Học tập",
    dueDate: "2026-07-24",
    dueTime: "16:30",
    priority: "Medium",
    isCompleted: true
  },
  {
    id: "rem-3",
    title: "Uống 2 lít nước và tập thể dục nhẹ buổi chiều",
    category: "Sức khỏe",
    dueDate: "2026-07-24",
    dueTime: "17:00",
    priority: "Low",
    isCompleted: false
  }
];

export const VRemindersTab: React.FC = () => {
  const [reminders, setReminders] = useState<ReminderItem[]>(INITIAL_REMINDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all");

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<ReminderItem["category"]>("Công việc");
  const [newDueDate, setNewDueDate] = useState("2026-07-24");
  const [newDueTime, setNewDueTime] = useState("09:00");
  const [newPriority, setNewPriority] = useState<ReminderItem["priority"]>("Medium");
  const [newNotes, setNewNotes] = useState("");

  const handleToggleComplete = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r))
    );
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ReminderItem = {
      id: `rem-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      dueDate: newDueDate,
      dueTime: newDueTime,
      priority: newPriority,
      isCompleted: false,
      notes: newNotes
    };

    setReminders([newItem, ...reminders]);
    setNewTitle("");
    setNewNotes("");
    setShowAddForm(false);
  };

  const filteredReminders = reminders.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === "all" || r.category === filterCategory;
    const matchesStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "pending"
        ? !r.isCompleted
        : r.isCompleted;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-6 text-white font-sans">
      {/* Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-6 rounded-3xl bg-gradient-to-r from-orange-950/70 via-zinc-900 to-black border border-orange-500/30 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg shadow-orange-500/20 text-white font-black">
            <Bell className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-orange-300 uppercase">
                V-Reminders
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-orange-500 text-white font-black uppercase tracking-wider">
                Nhắc Nhở & Công Việc
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Quản lý danh sách việc cần làm, đặt lịch thông báo và theo dõi tiến độ hoàn thành.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Thêm Nhắc Nhở Mới
        </button>
      </div>

      {/* Add Reminder Modal/Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddReminder}
          className="bg-[#18181c] border border-orange-500/40 rounded-3xl p-6 mb-6 shadow-2xl space-y-4"
        >
          <h3 className="text-sm font-black text-orange-300 uppercase tracking-wider border-b border-white/10 pb-3">
            Tạo Nhắc Nhở Mới
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase">Tiêu đề việc cần làm</label>
              <input
                type="text"
                required
                placeholder="Nhập công việc..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase">Danh mục</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="Công việc">Công việc</option>
                <option value="Học tập">Học tập</option>
                <option value="Cá nhân">Cá nhân</option>
                <option value="Sức khỏe">Sức khỏe</option>
                <option value="Tài chính">Tài chính</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase">Mức độ ưu tiên</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="High">Cao (Quan trọng)</option>
                <option value="Medium">Trung bình</option>
                <option value="Low">Thấp</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase">Ngày nhắc</label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase">Giờ nhắc</label>
              <input
                type="time"
                value={newDueTime}
                onChange={(e) => setNewDueTime(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs uppercase rounded-xl cursor-pointer"
            >
              Lưu Nhắc Nhở
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar */}
      <div className="bg-[#18181c] border border-white/10 rounded-3xl p-4 mb-6 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm nhắc nhở..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none">
          {["all", "pending", "completed"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === st
                  ? "bg-orange-500 text-black font-black"
                  : "bg-white/5 hover:bg-white/10 text-zinc-400"
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
          <div className="bg-[#18181c] border border-white/10 rounded-3xl p-12 text-center text-zinc-500 text-xs">
            Không có nhắc nhở nào khớp với bộ lọc.
          </div>
        ) : (
          filteredReminders.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-3xl border transition-all flex items-start justify-between gap-4 shadow-lg ${
                item.isCompleted
                  ? "bg-zinc-900/40 border-white/5 opacity-60"
                  : "bg-[#18181c] border-white/10 hover:border-orange-500/40"
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                <button
                  onClick={() => handleToggleComplete(item.id)}
                  className="mt-0.5 text-zinc-400 hover:text-orange-400 transition-colors cursor-pointer"
                >
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3
                      className={`text-sm font-bold text-white ${
                        item.isCompleted ? "line-through text-zinc-500" : ""
                      }`}
                    >
                      {item.title}
                    </h3>

                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                        item.priority === "High"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : item.priority === "Medium"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                  </div>

                  {item.notes && <p className="text-xs text-zinc-400 mb-2">{item.notes}</p>}

                  <div className="flex items-center gap-4 text-[11px] text-zinc-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-orange-400" /> {item.dueDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-orange-400" /> {item.dueTime}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 font-semibold">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDeleteReminder(item.id)}
                className="p-2 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 rounded-xl transition-all cursor-pointer"
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
