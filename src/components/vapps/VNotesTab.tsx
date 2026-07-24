import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Pin,
  Tag,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Highlighter,
  Copy,
  Check,
  Calendar,
  StickyNote,
  ExternalLink,
  Layers
} from "lucide-react";

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  color: string;
  updatedAt: string;
  tags: string[];
}

const DEFAULT_NOTES: Note[] = [
  {
    id: "note-1",
    title: "Kế hoạch phát triển Vplay System 2026",
    content: "<b>Nhiệm vụ trọng tâm:</b><br/>• Tích hợp hệ thống <u>V-Office</u> (Pages, Numbers, Keynotes).<br/>• Nâng cấp giao diện <i>Ore UI Design System</i> đồng bộ.<br/>• Tối ưu hóa hiệu năng phát trực tuyến Live TV & Vertical.",
    category: "Công việc",
    isPinned: true,
    color: "#cc1827",
    updatedAt: "2026-07-24 09:30",
    tags: ["Vplay", "Roadmap", "OreUI"]
  },
  {
    id: "note-2",
    title: "Danh sách tài liệu học tập V-Learn",
    content: "1. Ôn tập toán cao cấp môn Đại số Tuyến tính.<br/>2. Đọc sách <i>Đắc Nhân Tâm</i> trên ứng dụng V-Books.<br/>3. Thực hành bài thi thử IELTS trên V-Learn THPT.",
    category: "Học tập",
    isPinned: false,
    color: "#2563eb",
    updatedAt: "2026-07-23 18:15",
    tags: ["V-Learn", "Học tập"]
  }
];

export const VNotesTab: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("vnotes_list");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_NOTES;
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copied, setCopied] = useState(false);
  const [stuckIds, setStuckIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("vnotes_stuck_ids");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("vnotes_list", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("vnotes_stuck_ids", JSON.stringify(stuckIds));
    window.dispatchEvent(new Event("vnotes_stuck_updated"));
  }, [stuckIds]);

  const handleToggleStick = (id: string) => {
    setStuckIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  // Synchronize editor HTML only when activeNoteId changes to preserve focus & cursor position
  useEffect(() => {
    if (editorRef.current && activeNote) {
      if (editorRef.current.innerHTML !== activeNote.content) {
        editorRef.current.innerHTML = activeNote.content;
      }
    }
  }, [activeNoteId]);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: "Ghi chú mới",
      content: "Nhập nội dung ghi chú tại đây...",
      category: "Cá nhân",
      isPinned: false,
      color: "#16a34a",
      updatedAt: new Date().toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }),
      tags: ["Cá nhân"]
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleUpdateNote = (field: keyof Note, value: any) => {
    if (!activeNote) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeNote.id
          ? {
              ...n,
              [field]: value,
              updatedAt: new Date().toLocaleString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
              })
            }
          : n
      )
    );
  };

  const handleDeleteNote = (id: string) => {
    const filtered = notes.filter((n) => n.id !== id);
    setNotes(filtered);
    if (activeNoteId === id && filtered.length > 0) {
      setActiveNoteId(filtered[0].id);
    }
  };

  const handleTogglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  // Format Helper Injection
  const applyFormat = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      handleUpdateNote("content", editorRef.current.innerHTML);
    }
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const unpinnedNotes = filteredNotes.filter((n) => !n.isPinned);

  const copyContent = () => {
    if (!activeNote) return;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = activeNote.content;
    navigator.clipboard.writeText(tempDiv.innerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 text-white font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-6 rounded-3xl bg-gradient-to-r from-red-950/60 via-zinc-900/90 to-zinc-950 border border-red-500/30 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-lg shadow-red-600/30">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-white uppercase">
                V-Notes
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white font-black uppercase tracking-wider">
                Ore UI Rich Text
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Trình ghi chú thông minh hỗ trợ định dạng văn bản nâng cao, gắn thẻ và lưu trữ cục bộ.
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateNote}
          className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-red-600/30 transition-all cursor-pointer shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Tạo Ghi Chú Mới
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
        {/* Left Sidebar: Notes List */}
        <div className="lg:col-span-4 bg-[#18181c] border border-white/10 rounded-3xl p-4 flex flex-col gap-4 shadow-xl">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm ghi chú..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-all"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {["all", "Công việc", "Học tập", "Cá nhân", "Dự án"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-red-600 text-white shadow-md"
                    : "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                {cat === "all" ? "Tất cả" : cat}
              </button>
            ))}
          </div>

          {/* Notes List Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[500px]">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-xs">
                Chưa có ghi chú nào. Hãy nhấn "Tạo Ghi Chú Mới".
              </div>
            ) : (
              <>
                {/* Pinned Section */}
                {pinnedNotes.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <div className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider flex items-center gap-1 px-1">
                      <Pin className="w-3 h-3" /> Đã ghim ({pinnedNotes.length})
                    </div>
                    {pinnedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        isActive={note.id === activeNoteId}
                        isStuck={stuckIds.includes(note.id)}
                        onClick={() => setActiveNoteId(note.id)}
                        onTogglePin={() => handleTogglePin(note.id)}
                        onToggleStick={() => handleToggleStick(note.id)}
                        onDelete={() => handleDeleteNote(note.id)}
                      />
                    ))}
                  </div>
                )}

                {/* Unpinned Section */}
                {unpinnedNotes.length > 0 && (
                  <div className="space-y-2">
                    {pinnedNotes.length > 0 && (
                      <div className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider px-1">
                        Tất cả ghi chú ({unpinnedNotes.length})
                      </div>
                    )}
                    {unpinnedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        isActive={note.id === activeNoteId}
                        isStuck={stuckIds.includes(note.id)}
                        onClick={() => setActiveNoteId(note.id)}
                        onTogglePin={() => handleTogglePin(note.id)}
                        onToggleStick={() => handleToggleStick(note.id)}
                        onDelete={() => handleDeleteNote(note.id)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Editor Area */}
        {activeNote ? (
          <div className="lg:col-span-8 bg-[#18181c] border border-white/10 rounded-3xl p-5 sm:p-6 flex flex-col shadow-xl">
            {/* Editor Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-4">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => handleUpdateNote("title", e.target.value)}
                placeholder="Tiêu đề ghi chú..."
                className="bg-transparent text-xl font-bold text-white focus:outline-none w-full sm:w-auto flex-1 placeholder-zinc-600"
              />

              <div className="flex items-center gap-2">
                <select
                  value={activeNote.category}
                  onChange={(e) => handleUpdateNote("category", e.target.value)}
                  className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="Công việc">Công việc</option>
                  <option value="Học tập">Học tập</option>
                  <option value="Cá nhân">Cá nhân</option>
                  <option value="Dự án">Dự án</option>
                </select>

                <button
                  onClick={() => handleToggleStick(activeNote.id)}
                  title={stuckIds.includes(activeNote.id) ? "Bỏ ghim khỏi màn hình" : "Stick to screen (Ghim vào màn hình)"}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    stuckIds.includes(activeNote.id)
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                      : "bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10"
                  }`}
                >
                  <StickyNote className="w-3.5 h-3.5" />
                  <span>{stuckIds.includes(activeNote.id) ? "Đã ghim màn hình" : "Stick to screen"}</span>
                </button>

                <button
                  onClick={copyContent}
                  title="Sao chép văn bản"
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => handleTogglePin(activeNote.id)}
                  title={activeNote.isPinned ? "Bỏ ghim" : "Ghim lên đầu"}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    activeNote.isPinned
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      : "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Pin className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteNote(activeNote.id)}
                  title="Xóa ghi chú"
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all cursor-pointer border border-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rich Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-zinc-900/80 border border-white/10 rounded-2xl mb-4">
              <ToolbarButton icon={<Bold className="w-4 h-4" />} title="Bold" onClick={() => applyFormat("bold")} />
              <ToolbarButton icon={<Italic className="w-4 h-4" />} title="Italic" onClick={() => applyFormat("italic")} />
              <ToolbarButton icon={<Underline className="w-4 h-4" />} title="Underline" onClick={() => applyFormat("underline")} />
              <ToolbarButton icon={<Strikethrough className="w-4 h-4" />} title="Strikethrough" onClick={() => applyFormat("strikeThrough")} />
              <div className="h-4 w-px bg-white/10 mx-1" />
              <ToolbarButton icon={<Heading1 className="w-4 h-4" />} title="Heading 1" onClick={() => applyFormat("formatBlock", "<h1>")} />
              <ToolbarButton icon={<Heading2 className="w-4 h-4" />} title="Heading 2" onClick={() => applyFormat("formatBlock", "<h2>")} />
              <div className="h-4 w-px bg-white/10 mx-1" />
              <ToolbarButton icon={<List className="w-4 h-4" />} title="Bullet List" onClick={() => applyFormat("insertUnorderedList")} />
              <ToolbarButton icon={<ListOrdered className="w-4 h-4" />} title="Numbered List" onClick={() => applyFormat("insertOrderedList")} />
              <div className="h-4 w-px bg-white/10 mx-1" />
              <ToolbarButton icon={<Highlighter className="w-4 h-4 text-yellow-400" />} title="Highlight" onClick={() => applyFormat("backColor", "#fef08a")} />
            </div>

            {/* Content Editable Body using ref to maintain cursor position */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => handleUpdateNote("content", e.currentTarget.innerHTML)}
              className="flex-1 bg-zinc-900/40 border border-white/5 rounded-2xl p-4 text-sm text-zinc-200 focus:outline-none focus:border-red-500/50 min-h-[350px] overflow-y-auto leading-relaxed font-sans"
            />

            {/* Footer Metadata */}
            <div className="flex items-center justify-between mt-4 text-[11px] text-zinc-500 border-t border-white/5 pt-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Lần cuối cập nhật: {activeNote.updatedAt}
              </span>
              <span>V-Notes Ore UI Engine</span>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 bg-[#18181c] border border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center text-zinc-500 shadow-xl">
            <FileText className="w-16 h-16 mb-4 text-zinc-600" />
            <p className="text-sm font-semibold">Chọn hoặc tạo một ghi chú để bắt đầu chỉnh sửa</p>
          </div>
        )}
      </div>
    </div>
  );
};

const NoteCard: React.FC<{
  note: Note;
  isActive: boolean;
  isStuck?: boolean;
  onClick: () => void;
  onTogglePin: () => void;
  onToggleStick?: () => void;
  onDelete: () => void;
}> = ({ note, isActive, isStuck, onClick, onTogglePin, onToggleStick, onDelete }) => {
  const plainTextContent = note.content.replace(/<[^>]+>/g, "");

  return (
    <div
      onClick={onClick}
      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
        isActive
          ? "bg-red-950/40 border-red-500/60 shadow-lg shadow-red-900/20"
          : "bg-zinc-900/60 hover:bg-zinc-900 border-white/5 hover:border-white/20"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h4 className="text-xs font-bold text-white line-clamp-1 flex-1">
          {note.title || "Chưa có tiêu đề"}
        </h4>
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          {onToggleStick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStick();
              }}
              className={`p-1 rounded-md hover:bg-white/10 ${
                isStuck ? "text-emerald-400" : "text-zinc-500 hover:text-white"
              }`}
              title={isStuck ? "Đã ghim màn hình" : "Stick to screen"}
            >
              <StickyNote className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
            className={`p-1 rounded-md hover:bg-white/10 ${
              note.isPinned ? "text-amber-400" : "text-zinc-500 hover:text-white"
            }`}
            title={note.isPinned ? "Bỏ ghim" : "Ghim bài"}
          >
            <Pin className="w-3 h-3" />
          </button>
        </div>
      </div>

      <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2 leading-relaxed">
        {plainTextContent || "Chưa có nội dung..."}
      </p>

      <div className="flex items-center justify-between text-[10px]">
        <span className="px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 font-semibold">
          {note.category}
        </span>
        <span className="text-zinc-500">{note.updatedAt.split(" ")[1] || note.updatedAt}</span>
      </div>
    </div>
  );
};

const ToolbarButton: React.FC<{ icon: React.ReactNode; title: string; onClick: () => void }> = ({
  icon,
  title,
  onClick
}) => (
  <button
    onClick={onClick}
    title={title}
    className="p-1.5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-lg transition-all cursor-pointer"
  >
    {icon}
  </button>
);
