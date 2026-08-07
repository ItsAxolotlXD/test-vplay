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
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 text-white font-jura select-none">
      {/* Banner Header - Ore UI Style */}
      <div className="bg-[#2d2f32] border-2 border-[#141414] p-3 sm:p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#28960b] border-2 border-[#141414] flex items-center justify-center text-white shrink-0 shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-white uppercase tracking-wider font-jura">
                V-REMINDERS (NHẮC NHỞ & CÔNG VIỆC)
              </h1>
              <span className="bg-[#89dc69] text-[#141414] px-2 py-0.5 text-[10px] font-bold font-mono border border-[#141414]">
                Ore UI Task
              </span>
            </div>
            <p className="text-[11px] text-zinc-300 font-jura">
              Quản lý danh sách việc cần làm, đặt lịch thông báo và theo dõi tiến độ hoàn thành.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#28960b] hover:bg-[#32b312] border-2 border-[#141414] text-white font-bold text-xs uppercase font-jura tracking-wider shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] active:translate-y-[1px] cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Thêm Nhắc Nhở Mới
        </button>
      </div>

      {/* Add Reminder Modal/Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddReminder}
          className="bg-[#2d2f32] border-2 border-[#141414] p-5 mb-6 shadow-2xl space-y-4 font-jura"
        >
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b-2 border-[#141414] pb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#89dc69]" /> Tạo Nhắc Nhở Mới
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-zinc-300 mb-1 uppercase">Tiêu đề việc cần làm</label>
              <input
                type="text"
                required
                placeholder="Nhập công việc..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#1f2022] border-2 border-[#141414] px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-300 mb-1 uppercase">Danh mục</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-[#1f2022] border-2 border-[#141414] px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="Công việc">Công việc</option>
                <option value="Học tập">Học tập</option>
                <option value="Cá nhân">Cá nhân</option>
                <option value="Sức khỏe">Sức khỏe</option>
                <option value="Tài chính">Tài chính</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-300 mb-1 uppercase">Mức độ ưu tiên</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full bg-[#1f2022] border-2 border-[#141414] px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="High">Cao (Quan trọng)</option>
                <option value="Medium">Trung bình</option>
                <option value="Low">Thấp</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-300 mb-1 uppercase">Ngày nhắc</label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full bg-[#1f2022] border-2 border-[#141414] px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-300 mb-1 uppercase">Giờ nhắc</label>
              <input
                type="time"
                value={newDueTime}
                onChange={(e) => setNewDueTime(e.target.value)}
                className="w-full bg-[#1f2022] border-2 border-[#141414] px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t-2 border-[#141414]">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-1.5 bg-[#383b3e] hover:bg-[#4a4d50] border-2 border-[#141414] text-zinc-200 text-xs font-bold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#28960b] hover:bg-[#32b312] border-2 border-[#141414] text-white text-xs font-bold uppercase shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] cursor-pointer"
            >
              Lưu Nhắc Nhở
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar */}
      <div className="bg-[#2d2f32] border-2 border-[#141414] p-3 mb-6 shadow-xl flex flex-wrap items-center justify-between gap-3 font-jura">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm nhắc nhở..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1f2022] border-2 border-[#141414] pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
          {["all", "pending", "completed"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st as any)}
              className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer border-2 border-[#141414] ${
                filterStatus === st
                  ? "bg-[#28960b] text-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]"
                  : "bg-[#383b3e] text-zinc-300 hover:text-white"
              }`}
            >
              {st === "all" ? "Tất cả" : st === "pending" ? "Đang chờ" : "Đã hoàn thành"}
            </button>
          ))}
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3 font-jura">
        {filteredReminders.length === 0 ? (
          <div className="bg-[#2d2f32] border-2 border-[#141414] p-10 text-center text-zinc-400 text-xs">
            Không có nhắc nhở nào khớp với bộ lọc.
          </div>
        ) : (
          filteredReminders.map((item) => (
            <div
              key={item.id}
              className={`p-4 border-2 border-[#141414] transition-all flex items-start justify-between gap-4 shadow-lg ${
                item.isCompleted
                  ? "bg-[#232528] opacity-60"
                  : "bg-[#2d2f32]"
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <button
                  onClick={() => handleToggleComplete(item.id)}
                  className="mt-0.5 text-zinc-400 hover:text-[#89dc69] transition-colors cursor-pointer"
                >
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-[#89dc69]" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3
                      className={`text-xs sm:text-sm font-bold text-white ${
                        item.isCompleted ? "line-through text-zinc-500" : ""
                      }`}
                    >
                      {item.title}
                    </h3>

                    <span
                      className={`text-[9px] px-2 py-0.5 font-bold uppercase border border-[#141414] ${
                        item.priority === "High"
                          ? "bg-[#cc1827] text-white"
                          : item.priority === "Medium"
                          ? "bg-amber-600 text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                  </div>

                  {item.notes && <p className="text-xs text-zinc-300 mb-2 font-sans">{item.notes}</p>}

                  <div className="flex items-center gap-3 text-[11px] text-zinc-400 flex-wrap font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#89dc69]" /> {item.dueDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#89dc69]" /> {item.dueTime}
                    </span>
                    <span className="px-2 py-0.5 bg-[#1f2022] border border-[#141414] text-zinc-300 font-bold">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDeleteReminder(item.id)}
                className="p-1.5 border border-[#141414] bg-[#383b3e] hover:bg-[#cc1827] text-zinc-300 hover:text-white transition-all cursor-pointer"
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
