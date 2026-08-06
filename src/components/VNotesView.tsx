import React, { useState, useEffect } from 'react';
import { playPopSound } from '../utils/sound';
import { VplayPrimaryButton } from './ui/VplayPrimaryButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { VplayInputBox } from './ui/VplayInputBox';
import { VplayTab } from './ui/VplayTab';
import {
  StickyNote,
  Plus,
  Search,
  Pin,
  Trash2,
  Edit3,
  Copy,
  Check,
  Download,
  Tag,
  Calendar,
  Sparkles,
  FileText,
  RotateCcw,
  ListFilter,
} from 'lucide-react';

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  colorTag: 'emerald' | 'redstone' | 'lapis' | 'gold' | 'diamond';
  createdAt: string;
  updatedAt: string;
}

const COLOR_MAP: Record<NoteItem['colorTag'], { bg: string; border: string; text: string; label: string }> = {
  emerald: { bg: 'bg-[#28960b]', border: 'border-[#89dc69]', text: 'text-[#89dc69]', label: 'Emerald' },
  redstone: { bg: 'bg-[#b91c1c]', border: 'border-[#f87171]', text: 'text-[#f87171]', label: 'Redstone' },
  lapis: { bg: 'bg-[#1d4ed8]', border: 'border-[#60a5fa]', text: 'text-[#60a5fa]', label: 'Lapis' },
  gold: { bg: 'bg-[#b45309]', border: 'border-[#fbbf24]', text: 'text-[#fbbf24]', label: 'Gold' },
  diamond: { bg: 'bg-[#0f766e]', border: 'border-[#2dd4bf]', text: 'text-[#2dd4bf]', label: 'Diamond' },
};

const DEFAULT_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: '📌 Mẹo xem Vplay TV mượt mà (Ore UI)',
    content: `1. Sử dụng trình duyệt Chrome/Edge để có hiệu suất tốt nhất.\n2. Bật chế độ Fullscreen (F11 hoặc nút Toàn màn hình) để trải nghiệm giao diện Minecraft Ore UI trọn vẹn.\n3. Nếu gặp lỗi đơ kênh, bạn có thể vào Cài Đặt -> Đổi chất lượng hoặc chọn lại kênh.\n4. Sử dụng phím tắt Mũi tên (Arrow keys) hoặc Bàn phím ảo để di chuyển con trỏ chuột.`,
    category: 'Vplay Guide',
    isPinned: true,
    colorTag: 'emerald',
    createdAt: new Date().toLocaleDateString('vi-VN'),
    updatedAt: new Date().toLocaleDateString('vi-VN'),
  },
  {
    id: 'note-2',
    title: '📺 Danh sách link M3U8 mẫu',
    content: `#EXTM3U\n#EXTINF:-1 group-title="VTV",VTV1 HD\nhttps://vtv1-hd.vtv.vn/index.m3u8\n#EXTINF:-1 group-title="THỂ THAO",VTV6 HD\nhttps://vtv6-hd.vtv.vn/index.m3u8`,
    category: 'M3U Links',
    isPinned: true,
    colorTag: 'diamond',
    createdAt: new Date().toLocaleDateString('vi-VN'),
    updatedAt: new Date().toLocaleDateString('vi-VN'),
  },
  {
    id: 'note-3',
    title: '🎮 Thiết kế Ore UI Theme Notes',
    content: `- Bảng màu chủ đạo: Dark Charcoal (#2a2c2e, #141414)\n- Màu viền Accent: Light Emerald (#89dc69)\n- Hiệu ứng nút bấm: Pixelated inset shadow [2px 2px]\n- Bàn phím ảo & chuột ảo di động hỗ trợ D-Pad`,
    category: 'Ore UI',
    isPinned: false,
    colorTag: 'gold',
    createdAt: new Date().toLocaleDateString('vi-VN'),
    updatedAt: new Date().toLocaleDateString('vi-VN'),
  },
];

const LOCAL_STORAGE_KEY = 'vplay_vnotes_items_v1';

export const VNotesView: React.FC = () => {
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load notes from localStorage', e);
    }
    return DEFAULT_NOTES;
  });

  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // Form state for current selected/edited note
  const [editTitle, setEditTitle] = useState<string>('');
  const [editContent, setEditContent] = useState<string>('');
  const [editCategory, setEditCategory] = useState<string>('Ghi chú');
  const [editColorTag, setEditColorTag] = useState<NoteItem['colorTag']>('emerald');

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes to localStorage', e);
    }
  }, [notes]);

  // Selected note object
  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  // Sync edit form with selected note
  useEffect(() => {
    if (selectedNote) {
      setEditTitle(selectedNote.title);
      setEditContent(selectedNote.content);
      setEditCategory(selectedNote.category);
      setEditColorTag(selectedNote.colorTag);
    }
  }, [selectedNoteId]);

  const categories = ['Tất cả', ...Array.from(new Set(notes.map((n) => n.category)))];

  const filteredNotes = notes.filter((n) => {
    const matchCat = activeCategory === 'Tất cả' || n.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  // Sort pinned notes first
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const handleCreateNewNote = () => {
    playPopSound();
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: 'Ghi chú mới',
      content: '',
      category: 'Ghi chú',
      isPinned: false,
      colorTag: 'emerald',
      createdAt: new Date().toLocaleDateString('vi-VN'),
      updatedAt: new Date().toLocaleDateString('vi-VN'),
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedNoteId) return;
    playPopSound();
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId
          ? {
              ...n,
              title: editTitle.trim() || 'Ghi chú không tiêu đề',
              content: editContent,
              category: editCategory.trim() || 'Ghi chú',
              colorTag: editColorTag,
              updatedAt: new Date().toLocaleDateString('vi-VN'),
            }
          : n
      )
    );
    setIsEditing(false);
  };

  const handleDeleteNote = (id: string) => {
    playPopSound();
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    if (selectedNoteId === id) {
      setSelectedNoteId(updated[0]?.id || null);
    }
  };

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playPopSound();
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const handleCopyNote = () => {
    if (!selectedNote) return;
    playPopSound();
    navigator.clipboard.writeText(`${selectedNote.title}\n\n${selectedNote.content}`);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleExportTxt = () => {
    playPopSound();
    const dataStr = notes
      .map((n) => `====================\nTITLE: ${n.title}\nCATEGORY: ${n.category}\nDATE: ${n.createdAt}\n====================\n${n.content}\n\n`)
      .join('\n');
    const blob = new Blob([dataStr], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Vplay_VNotes_Export_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleResetDefaults = () => {
    playPopSound();
    if (window.confirm('Khôi phục danh sách ghi chú mẫu ban đầu?')) {
      setNotes(DEFAULT_NOTES);
      setSelectedNoteId(DEFAULT_NOTES[0].id);
    }
  };

  return (
    <div className="space-y-4 select-none">
      {/* ORE UI TOP ACTION HEADER BAR */}
      <div className="bg-[#2d2f32] border-2 border-[#141414] p-3 sm:p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#28960b] border-2 border-[#141414] flex items-center justify-center text-white shrink-0 shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]">
            <StickyNote className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider font-jura">
                V-NOTES (SỔ TAY GHI CHÚ)
              </h2>
              <span className="bg-[#89dc69] text-[#141414] px-2 py-0.5 text-[10px] font-bold font-mono border border-[#141414]">
                {notes.length} ghi chú
              </span>
            </div>
            <p className="text-[11px] text-zinc-300 font-jura">
              Lưu trữ danh sách kênh, ghi chú cá nhân và liên kết M3U8 chuẩn giao diện Ore UI.
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <VplayPrimaryButton
            onClick={handleCreateNewNote}
            className="!py-2 !px-3 text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Ghi Chú</span>
          </VplayPrimaryButton>

          <VplaySecondaryButton
            onClick={handleExportTxt}
            fullWidth={false}
            className="!py-2 !px-3 text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất TXT</span>
          </VplaySecondaryButton>

          <VplaySecondaryButton
            onClick={handleResetDefaults}
            fullWidth={false}
            className="!py-2 !px-2.5 text-xs font-bold whitespace-nowrap shrink-0"
            title="Khôi phục ghi chú mẫu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </VplaySecondaryButton>
        </div>
      </div>

      {/* CATEGORY TABS & SEARCH BAR */}
      <div className="bg-[#35383b] border-2 border-[#141414] p-3 shadow-md space-y-3">
        {/* Search input */}
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3 w-4 h-4 text-zinc-400 pointer-events-none z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm trong V-Notes (tiêu đề, nội dung)..."
            className="w-full h-9 mc-input-box pl-9 pr-8 text-xs font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-gray-400 hover:text-white font-bold text-xs p-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Horizontal Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <ListFilter className="w-4 h-4 text-[#89dc69] shrink-0 mr-1" />
          {categories.map((cat) => (
            <VplayTab
              key={cat}
              active={activeCategory === cat}
              onClick={() => {
                playPopSound();
                setActiveCategory(cat);
              }}
              className="!py-1 !px-3 text-xs shrink-0"
            >
              {cat}
            </VplayTab>
          ))}
        </div>
      </div>

      {/* MAIN TWO-COLUMN CONTAINER: LEFT NOTE LIST, RIGHT NOTE EDITOR/VIEWER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: NOTES CARDS LIST (4 cols on lg) */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
          {sortedNotes.length === 0 ? (
            <div className="bg-[#2a2c2e] border-2 border-[#141414] p-6 text-center space-y-3">
              <FileText className="w-8 h-8 text-zinc-500 mx-auto" />
              <p className="text-xs text-zinc-300 font-bold">Chưa có ghi chú nào trong danh mục này.</p>
              <VplayPrimaryButton onClick={handleCreateNewNote} className="!py-1.5 !px-3 text-xs max-w-[160px] mx-auto">
                + Tạo ghi chú mới
              </VplayPrimaryButton>
            </div>
          ) : (
            sortedNotes.map((note) => {
              const isSelected = selectedNoteId === note.id;
              const colorConfig = COLOR_MAP[note.colorTag] || COLOR_MAP.emerald;

              return (
                <div
                  key={note.id}
                  onClick={() => {
                    playPopSound();
                    setSelectedNoteId(note.id);
                    setIsEditing(false);
                  }}
                  className={`
                    group relative border-2 cursor-pointer transition-none p-3 shadow-lg select-none active:translate-y-[1px]
                    ${
                      isSelected
                        ? 'bg-[#28960b] text-white border-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]'
                        : 'bg-[#c6c6c6] text-[#202020] border-[#141414] hover:bg-[#383b3e] hover:text-white hover:border-white shadow-[inset_2px_2px_0_#ffffff,inset_-2px_-2px_0_#898d91]'
                    }
                  `}
                >
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {/* Color Tag Pill */}
                      <span
                        className={`w-2.5 h-2.5 border border-black/40 ${colorConfig.bg} shadow-sm shrink-0`}
                        title={`Color: ${colorConfig.label}`}
                      />
                      <span
                        className={`text-[9px] font-bold font-mono px-1.5 py-0.5 border border-[#141414] ${
                          isSelected
                            ? 'bg-black/30 text-white'
                            : 'bg-[#242424] text-[#89dc69] group-hover:bg-black/40'
                        }`}
                      >
                        {note.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Pin button */}
                      <button
                        onClick={(e) => handleTogglePin(note.id, e)}
                        className={`p-1 rounded hover:bg-black/20 ${note.isPinned ? 'text-amber-300' : 'text-black/40 group-hover:text-white/60'}`}
                        title={note.isPinned ? 'Bỏ ghim' : 'Ghim lên đầu'}
                      >
                        <Pin className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Note Title */}
                  <h3
                    className={`font-bold text-xs sm:text-sm truncate font-jura ${
                      isSelected ? 'text-white' : 'text-[#141414] group-hover:text-white'
                    }`}
                  >
                    {note.title}
                  </h3>

                  {/* Content Preview */}
                  <p
                    className={`text-[11px] line-clamp-2 mt-1 font-jura ${
                      isSelected ? 'text-white/90' : 'text-[#404040] group-hover:text-zinc-300'
                    }`}
                  >
                    {note.content || '(Ghi chú trống...)'}
                  </p>

                  {/* Date Footer */}
                  <div className="mt-2.5 pt-1.5 border-t border-black/10 flex items-center justify-between text-[9px] font-mono opacity-80">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {note.updatedAt}
                    </span>
                    {note.isPinned && <span className="font-bold text-amber-300">[PINNED]</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: NOTE VIEW / EDIT PANEL (7 cols on lg) */}
        <div className="lg:col-span-7 bg-[#2d2f32] border-2 border-[#141414] p-4 sm:p-5 shadow-2xl flex flex-col justify-between min-h-[480px]">
          {selectedNote ? (
            isEditing ? (
              /* --- EDIT MODE --- */
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between border-b border-[#141414] pb-2">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-[#89dc69]" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-white font-jura">
                      CHỈNH SỬA GHI CHÚ
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">Ore UI Editor</span>
                </div>

                {/* Title Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">Tiêu đề ghi chú</label>
                  <VplayInputBox
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Nhập tiêu đề..."
                  />
                </div>

                {/* Category & Color Tag Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">Danh mục (Category)</label>
                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      placeholder="Ví dụ: Vplay, M3U, Cá nhân..."
                      className="w-full h-9 mc-input-box text-xs px-2.5"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">Màu khoáng thạch (Ore Tag)</label>
                    <div className="flex items-center gap-1.5 pt-1">
                      {(Object.keys(COLOR_MAP) as NoteItem['colorTag'][]).map((tag) => {
                        const cfg = COLOR_MAP[tag];
                        const isSel = editColorTag === tag;
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              playPopSound();
                              setEditColorTag(tag);
                            }}
                            className={`w-6 h-6 border-2 flex items-center justify-center transition-transform ${
                              cfg.bg
                            } ${isSel ? 'border-white scale-110 shadow-lg' : 'border-[#141414] opacity-70 hover:opacity-100'}`}
                            title={cfg.label}
                          >
                            {isSel && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Quick Toolbar */}
                <div className="flex items-center gap-2 pt-1 border-t border-[#141414]/60 overflow-x-auto">
                  <span className="text-[10px] text-zinc-400 font-mono">Chèn nhanh:</span>
                  <button
                    type="button"
                    onClick={() => setEditContent((prev) => `${prev}\n#EXTM3U\n#EXTINF:-1 group-title="Group",Channel Name\nhttp://`)}
                    className="bg-[#3a3d40] hover:bg-[#4a4d50] text-[#89dc69] text-[10px] font-bold px-2 py-1 border border-[#141414]"
                  >
                    + M3U Template
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditContent((prev) => `${prev}\n- [ ] `)}
                    className="bg-[#3a3d40] hover:bg-[#4a4d50] text-amber-300 text-[10px] font-bold px-2 py-1 border border-[#141414]"
                  >
                    + Checkbox
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditContent((prev) => `${prev}\n[${new Date().toLocaleTimeString('vi-VN')}] `)}
                    className="bg-[#3a3d40] hover:bg-[#4a4d50] text-sky-300 text-[10px] font-bold px-2 py-1 border border-[#141414]"
                  >
                    + Timestamp
                  </button>
                </div>

                {/* Textarea Content */}
                <div className="space-y-1 flex-1 flex flex-col min-h-[180px]">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">Nội dung ghi chú</label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Nhập nội dung ghi chú ở đây..."
                    className="w-full flex-1 min-h-[160px] mc-input-box p-3 text-xs font-mono leading-relaxed resize-y"
                  />
                </div>

                {/* Bottom Action Bar for Edit */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#141414]">
                  <span className="text-[10px] font-mono text-zinc-400">
                    {editContent.length} ký tự • {editContent.split(/\s+/).filter(Boolean).length} từ
                  </span>

                  <div className="flex items-center gap-2">
                    <VplaySecondaryButton
                      onClick={() => setIsEditing(false)}
                      fullWidth={false}
                      className="!py-1.5 !px-3 text-xs font-bold"
                    >
                      Hủy
                    </VplaySecondaryButton>

                    <VplayPrimaryButton onClick={handleSaveEdit} className="!py-1.5 !px-4 text-xs font-bold">
                      Lưu Ghi Chú
                    </VplayPrimaryButton>
                  </div>
                </div>
              </div>
            ) : (
              /* --- VIEW MODE --- */
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  {/* Top Bar inside View Panel */}
                  <div className="flex items-start justify-between gap-3 border-b border-[#141414] pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 border border-black ${COLOR_MAP[selectedNote.colorTag].bg}`}
                        />
                        <span className="bg-[#141414] text-[#89dc69] text-[10px] font-bold px-2 py-0.5 border border-zinc-700 font-mono">
                          {selectedNote.category}
                        </span>
                        {selectedNote.isPinned && (
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/50 text-[10px] font-bold px-1.5 py-0.5 font-mono">
                            ★ PINNED
                          </span>
                        )}
                      </div>
                      <h2 className="text-base sm:text-lg font-black text-white font-jura tracking-wide pt-1">
                        {selectedNote.title}
                      </h2>
                    </div>

                    {/* View Controls */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={handleCopyNote}
                        className="bg-[#3a3d40] hover:bg-[#4a4d50] text-zinc-200 hover:text-white p-2 border-2 border-[#141414] shadow active:translate-y-[1px]"
                        title="Sao chép nội dung"
                      >
                        {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <VplayPrimaryButton
                        onClick={() => {
                          playPopSound();
                          setIsEditing(true);
                        }}
                        className="!py-1.5 !px-3 text-xs font-bold flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Sửa</span>
                      </VplayPrimaryButton>

                      <button
                        onClick={() => handleDeleteNote(selectedNote.id)}
                        className="bg-[#991b1b] hover:bg-[#b91c1c] text-white p-2 border-2 border-[#141414] shadow active:translate-y-[1px]"
                        title="Xóa ghi chú này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Main Display Content Box */}
                  <div className="mt-4 bg-[#1f2022] border-2 border-[#141414] p-4 font-mono text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap min-h-[220px] shadow-inner select-text">
                    {selectedNote.content ? (
                      selectedNote.content
                    ) : (
                      <span className="text-zinc-500 italic">Ghi chú này chưa có nội dung. Bấm Sửa để thêm nội dung.</span>
                    )}
                  </div>
                </div>

                {/* Footer Meta Info */}
                <div className="pt-3 border-t border-[#141414] flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] font-mono text-zinc-400 gap-2">
                  <div className="flex items-center gap-3">
                    <span>Tạo lúc: {selectedNote.createdAt}</span>
                    <span>Cập nhật: {selectedNote.updatedAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {copiedId && <span className="text-emerald-400 font-bold">✓ Đã chép vào clipboard!</span>}
                    <span className="bg-[#141414] px-2 py-0.5 border border-zinc-700">Ore UI V-Notes</span>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center py-12 space-y-3 text-zinc-400">
              <StickyNote className="w-12 h-12 text-zinc-600 animate-bounce" />
              <p className="text-xs font-bold font-jura">Chọn một ghi chú ở danh sách bên trái hoặc tạo ghi chú mới.</p>
              <VplayPrimaryButton onClick={handleCreateNewNote} className="!py-2 !px-4 text-xs max-w-[180px]">
                + Tạo Ghi Chú Mới
              </VplayPrimaryButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
