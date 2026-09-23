import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  RotateCcw,
  Sparkles,
  FileText,
  X,
  Layers,
  Calendar,
  Flame,
  Zap,
  Award,
  BookOpen,
  BookOpenCheck,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Tag,
  Palette,
  ExternalLink,
  ChevronRight,
  Filter,
  Eye,
  SlidersHorizontal,
  Bookmark,
  Share2
} from 'lucide-react';
import { playPopSound, playWinSound } from '../utils/sound';

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  colorTag: 'rose' | 'emerald' | 'sky' | 'amber' | 'purple';
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  readTime?: string;
}

const COLOR_MAP: Record<
  NoteItem['colorTag'],
  {
    bg: string;
    border: string;
    text: string;
    dot: string;
    badge: string;
    label: string;
    accent: string;
  }
> = {
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    label: 'Hoàng Kim (Học tập)',
    accent: 'from-amber-500 to-yellow-500'
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    dot: 'bg-[#E6005A]',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    label: 'Hồng Đỏ (Quan trọng)',
    accent: 'from-rose-500 to-red-600'
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    label: 'Lục Bảo (Khoa học)',
    accent: 'from-emerald-500 to-teal-500'
  },
  sky: {
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    text: 'text-sky-400',
    dot: 'bg-sky-400',
    badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    label: 'Lam Ngọc (Công nghệ)',
    accent: 'from-sky-500 to-blue-600'
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    dot: 'bg-purple-400',
    badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    label: 'Thạch Anh (Ý tưởng)',
    accent: 'from-purple-500 to-indigo-600'
  }
};

const DEFAULT_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Công thức Toán THPT Quốc Gia & Mẹo tính nhanh Casio',
    content: `1. Đạo hàm hàm phân thức bậc 1 / bậc 1: y = (ax+b)/(cx+d) => y' = (ad - bc) / (cx+d)^2.\n2. Cực trị hàm bậc 3: Điều kiện có 2 điểm cực trị khi delta' > 0.\n3. Phương pháp đổi biến số & từng phần trong Tích phân: u.dv = uv - int(vdu).\n4. Mẹo giải nhanh hình không gian Oxyz: Viết phương trình mặt phẳng bằng tích có hướng 2 vecto chỉ phương.`,
    category: 'Toán Học',
    isPinned: true,
    colorTag: 'amber',
    createdAt: '12/09/2026',
    updatedAt: '13/09/2026',
    tags: ['Toán 12', 'Ôn Thi', 'Casio']
  },
  {
    id: 'note-2',
    title: 'Tổng hợp từ vựng Tiếng Anh CEFR B2 & Cấu trúc viết luận',
    content: `• In addition to / Moreover / Furthermore: Hơn nữa, ngoài ra\n• Consequently / As a result / Hence: Kết quả là\n• On the one hand / On the other hand: Một mặt thì / Mặt khác thì\n• Crucial / Vital / Imperative: Cực kỳ quan trọng\n• Substantial / Remarkable: Đáng kể, rõ rệt\n* Chú ý: Tránh dùng từ lặp lại trong phần Conclusion.`,
    category: 'Tiếng Anh',
    isPinned: true,
    colorTag: 'sky',
    createdAt: '10/09/2026',
    updatedAt: '13/09/2026',
    tags: ['IELTS', 'CEFR B2', 'Writing']
  },
  {
    id: 'note-3',
    title: 'Sơ đồ tư duy Lịch Sử & Địa Lý thi Tốt nghiệp 2026',
    content: `- Chiến dịch Điện Biên Phủ 1954: 56 ngày đêm khoét núi ngủ hầm mưa dầm cơm vắt.\n- Hiệp định Giơ-ne-vơ 1954 về Đông Dương: Công nhận độc lập chủ quyền của 3 nước.\n- Địa lý: Các vùng kinh tế trọng điểm Bắc Bộ, Trung Bộ và Nam Bộ.\n- Xu hướng chuyển dịch cơ cấu ngành kinh tế: Giảm Nông nghiệp, tăng Dịch vụ và Công nghiệp.`,
    category: 'Khoa Học Xã Hội',
    isPinned: false,
    colorTag: 'rose',
    createdAt: '08/09/2026',
    updatedAt: '11/09/2026',
    tags: ['Lịch Sử', 'Địa Lý', 'Mindmap']
  },
  {
    id: 'note-4',
    title: 'Danh sách luồng phát trực tuyến M3U8 & Tài liệu VNRT Online',
    content: `#EXTM3U\n#EXTINF:-1 group-title="VTV",VTV1 HD Tin Tức Thời Sự\nhttps://vtv1-hd.vtv.vn/index.m3u8\n#EXTINF:-1 group-title="V-STUDY",Kênh Bài Giảng Trực Tuyến Quốc Gia\nhttps://edu.vtv.vn/stream/live.m3u8\n#EXTINF:-1 group-title="VOV",VOV3 Music Live Stream\nhttps://live.vov.vn/vov3.m3u8`,
    category: 'Link M3U8',
    isPinned: false,
    colorTag: 'emerald',
    createdAt: '05/09/2026',
    updatedAt: '09/09/2026',
    tags: ['M3U8', 'VNRT Online', 'Streaming']
  },
  {
    id: 'note-5',
    title: 'Kế hoạch ôn luyện V-Study Pomodoro & Mục tiêu điểm số',
    content: `- Mỗi ngày hoàn thành tối thiểu 4 phiên Pomodoro 25 phút.\n- Giải 1 đề Siêu Tổng Hợp 100 câu vào tối thứ 7 hàng tuần.\n- Duy trì chuỗi Streak học liên tục để đạt huy hiệu Thủ Khoa V-Study.\n- Ghi lại các câu sai vào sổ tay này để ôn tập lại vào cuối tuần.`,
    category: 'Kế Hoạch Học',
    isPinned: false,
    colorTag: 'purple',
    createdAt: '01/09/2026',
    updatedAt: '05/09/2026',
    tags: ['Pomodoro', 'Mục Tiêu', 'Streak']
  }
];

const LOCAL_STORAGE_KEY = 'vplay_vnotes_items_v1';

export const VNotesView: React.FC = () => {
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load notes from localStorage', e);
    }
    return DEFAULT_NOTES;
  });

  // V-Study style active tabs
  const [activeTab, setActiveTab] = useState<'all' | 'pinned' | 'stuck' | 'create'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedColorTag, setSelectedColorTag] = useState<string | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Floating screen stuck notes
  const [stuckIds, setStuckIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vnotes_stuck_ids');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Editor / Composer State
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [noteCategory, setNoteCategory] = useState<string>('Toán Học');
  const [noteColorTag, setNoteColorTag] = useState<NoteItem['colorTag']>('amber');
  const [noteIsPinned, setNoteIsPinned] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
      localStorage.setItem('vnotes_list', JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes to localStorage', e);
    }
  }, [notes]);

  // Sync stuck notes listener
  useEffect(() => {
    const syncStuck = () => {
      try {
        const saved = localStorage.getItem('vnotes_stuck_ids');
        if (saved) setStuckIds(JSON.parse(saved));
      } catch (e) {}
    };
    window.addEventListener('vnotes_stuck_updated', syncStuck);
    window.addEventListener('storage', syncStuck);
    return () => {
      window.removeEventListener('vnotes_stuck_updated', syncStuck);
      window.removeEventListener('storage', syncStuck);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const categories = useMemo(() => {
    return Array.from(new Set(notes.map((n) => n.category)));
  }, [notes]);

  // Filtering
  const filteredNotes = useMemo(() => {
    let list = [...notes];

    if (activeTab === 'pinned') {
      list = list.filter((n) => n.isPinned);
    } else if (activeTab === 'stuck') {
      list = list.filter((n) => stuckIds.includes(n.id));
    }

    if (selectedCategory !== 'all') {
      list = list.filter((n) => n.category === selectedCategory);
    }

    if (selectedColorTag) {
      list = list.filter((n) => n.colorTag === selectedColorTag);
    }

    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase().trim();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q)
      );
    }

    // Sort: pinned first
    return list.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [notes, activeTab, selectedCategory, selectedColorTag, searchKeyword, stuckIds]);

  const pinnedCount = useMemo(() => notes.filter((n) => n.isPinned).length, [notes]);

  // Handle Save (Create or Update)
  const handleSaveNote = () => {
    if (!noteTitle.trim() && !noteContent.trim()) {
      showToast('Vui lòng nhập tiêu đề hoặc nội dung ghi chú!');
      return;
    }

    playWinSound();

    if (editingNote) {
      // Update existing
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingNote.id
            ? {
                ...n,
                title: noteTitle.trim() || 'Ghi chú không tiêu đề',
                content: noteContent.trim(),
                category: noteCategory.trim() || 'Học tập',
                colorTag: noteColorTag,
                isPinned: noteIsPinned,
                updatedAt: new Date().toLocaleDateString('vi-VN')
              }
            : n
        )
      );
      showToast('Đã cập nhật ghi chú thành công!');
    } else {
      // Create new
      const created: NoteItem = {
        id: `note-${Date.now()}`,
        title: noteTitle.trim() || 'Ghi chú học tập mới',
        content: noteContent.trim(),
        category: noteCategory.trim() || 'Học tập',
        colorTag: noteColorTag,
        isPinned: noteIsPinned,
        createdAt: new Date().toLocaleDateString('vi-VN'),
        updatedAt: new Date().toLocaleDateString('vi-VN')
      };
      setNotes((prev) => [created, ...prev]);
      showToast('Đã thêm ghi chú mới vào V-Notes!');
    }

    // Reset Form
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteIsPinned(false);
    setActiveTab('all');
  };

  // Open Edit Form
  const openEditModal = (note: NoteItem) => {
    playPopSound();
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteCategory(note.category);
    setNoteColorTag(note.colorTag);
    setNoteIsPinned(note.isPinned);
    setActiveTab('create');
  };

  // Reset Create Form
  const openCreateForm = () => {
    playPopSound();
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteCategory(categories[0] || 'Toán Học');
    setNoteColorTag('amber');
    setNoteIsPinned(false);
    setActiveTab('create');
  };

  // Toggle Pin
  const handleTogglePin = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playPopSound();
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  // Toggle Stuck on Screen
  const handleToggleStuckOnScreen = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playPopSound();
    setStuckIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('vnotes_stuck_ids', JSON.stringify(next));
        window.dispatchEvent(new Event('vnotes_stuck_updated'));
      } catch (err) {}
      showToast(
        next.includes(id)
          ? '📌 Đã ghim ghi chú nổi trên màn hình!'
          : 'Đã gỡ ghi chú khỏi màn hình nổi'
      );
      return next;
    });
  };

  // Delete note
  const handleDeleteNote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playPopSound();
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setStuckIds((prev) => {
      const next = prev.filter((item) => item !== id);
      try {
        localStorage.setItem('vnotes_stuck_ids', JSON.stringify(next));
        window.dispatchEvent(new Event('vnotes_stuck_updated'));
      } catch (err) {}
      return next;
    });
    if (editingNote?.id === id) {
      setEditingNote(null);
      setActiveTab('all');
    }
    showToast('Đã xóa ghi chú');
  };

  // Copy content
  const handleCopy = (text: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    playPopSound();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('Đã sao chép nội dung vào clipboard!');
  };

  // Export TXT
  const handleExportTxt = () => {
    playPopSound();
    const txtContent = notes
      .map(
        (n, idx) =>
          `=========================================\n[${idx + 1}] ${n.title}\nDanh mục: ${n.category} | Ngày cập nhật: ${n.updatedAt}\n=========================================\n${n.content}\n\n`
      )
      .join('\n');

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VStudy_VNotes_Export_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Đã tải xuống toàn bộ ghi chú học tập dạng TXT!');
  };

  // Reset defaults
  const handleResetDefaults = () => {
    playPopSound();
    if (window.confirm('Khôi phục danh sách ghi chú học tập mẫu ban đầu?')) {
      setNotes(DEFAULT_NOTES);
      showToast('Đã khôi phục ghi chú mẫu!');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 md:p-6 text-white font-sans space-y-6">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#1F1E24]/95 border border-amber-500/40 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. TOP BANNER HEADER - EXACT V-STUDY HERO BANNER */}
      <div className="bg-[#1F1E24] border border-[#2D2D38] rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-rose-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-500/20">
            <StickyNote className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-xl font-bold text-white tracking-wide">
                V-Notes • Sổ Tay Học Tập & Ghi Chú
              </h1>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                Sổ tay kiến thức & M3U8
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Hệ thống ghi chép công thức ôn thi, đề cương môn học, từ vựng CEFR và ghim ghi chú nổi trên màn hình VNRT Online.
            </p>
          </div>
        </div>

        {/* Global Student Stats Badge (V-Study style) */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
          <div className="px-3.5 py-2 bg-[#18171E] border border-[#2D2D38] rounded-xl flex items-center gap-3 shadow-inner">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>{notes.length} Ghi Chú</span>
            </div>
            <div className="w-px h-4 bg-[#2D2D38]" />
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Pin className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
              <span>{pinnedCount} Đã Ghim</span>
            </div>
          </div>

          <button
            onClick={handleExportTxt}
            className="px-3 py-2 bg-[#2A2933] hover:bg-[#343340] border border-[#3E3D4D] rounded-xl text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            title="Tải toàn bộ ghi chú về máy"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Xuất TXT</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="p-2 bg-[#2A2933] hover:bg-[#343340] border border-[#3E3D4D] rounded-xl text-[#9CA3AF] hover:text-white transition-all cursor-pointer"
            title="Khôi phục mẫu mặc định"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. STATS CARDS ROW (EXACT V-STUDY 4-BOX STATS SYSTEM) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1F1E24] border border-[#2D2D38] rounded-2xl p-4 shadow-md">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Box 1: Tổng ghi chú */}
          <div className="px-3.5 py-2 bg-[#18171E] border border-[#2D2D38] rounded-xl flex items-center gap-2.5 flex-1 sm:flex-initial">
            <div className="w-8 h-8 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg flex items-center justify-center text-xs font-black">
              VN
            </div>
            <div className="text-left">
              <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider">Tổng Sổ Tay</p>
              <p className="text-xs font-bold text-amber-400 font-mono">{notes.length} Mục</p>
            </div>
          </div>

          {/* Box 2: Đang ghim */}
          <div className="px-3.5 py-2 bg-[#18171E] border border-[#2D2D38] rounded-xl flex items-center gap-2 flex-1 sm:flex-initial">
            <Pin className="w-4 h-4 text-rose-400 fill-rose-400/30" />
            <div className="text-left">
              <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider">Ghim Quan Trọng</p>
              <p className="text-xs font-bold text-white font-mono">{pinnedCount} Bài</p>
            </div>
          </div>

          {/* Box 3: Ghim nổi màn hình */}
          <div className="px-3.5 py-2 bg-[#18171E] border border-[#2D2D38] rounded-xl flex items-center gap-2 flex-1 sm:flex-initial">
            <Layers className="w-4 h-4 text-purple-400" />
            <div className="text-left">
              <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider">Ghim Nổi Màn Hình</p>
              <p className="text-xs font-bold text-purple-300 font-mono">{stuckIds.length} Sticky</p>
            </div>
          </div>

          {/* Box 4: Danh mục môn */}
          <div className="px-3.5 py-2 bg-[#18171E] border border-[#2D2D38] rounded-xl flex items-center gap-2 flex-1 sm:flex-initial">
            <Tag className="w-4 h-4 text-emerald-400" />
            <div className="text-left">
              <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider">Chủ Đề & Môn</p>
              <p className="text-xs font-bold text-emerald-400 font-mono">{categories.length} Nhóm</p>
            </div>
          </div>
        </div>

        {/* Action Button: Tạo ghi chú mới */}
        <button
          onClick={openCreateForm}
          className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 text-white font-bold text-xs tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Soạn Ghi Chú Mới</span>
        </button>
      </div>

      {/* 3. MODULE MODE SELECTION TABS (V-STUDY PILL BUTTON TABS) */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-[#1F1E24] border border-[#2D2D38] rounded-2xl shadow-lg">
        <button
          onClick={() => {
            playPopSound();
            setActiveTab('all');
            setEditingNote(null);
          }}
          className={`flex-1 sm:flex-initial px-4 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer rounded-xl border ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent shadow-md'
              : 'bg-[#2A2933] border-[#3E3D4D] text-[#9CA3AF] hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Tất Cả Ghi Chú ({notes.length})</span>
        </button>

        <button
          onClick={() => {
            playPopSound();
            setActiveTab('pinned');
            setEditingNote(null);
          }}
          className={`flex-1 sm:flex-initial px-4 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer rounded-xl border ${
            activeTab === 'pinned'
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent shadow-md'
              : 'bg-[#2A2933] border-[#3E3D4D] text-[#9CA3AF] hover:text-white'
          }`}
        >
          <Pin className="w-4 h-4 text-amber-300" />
          <span>2. Đã Ghim Quan Trọng</span>
          <span className="px-1.5 py-0.5 bg-[#18171E] text-amber-300 text-[10px] rounded-md border border-[#2D2D38]">
            {pinnedCount}
          </span>
        </button>

        <button
          onClick={() => {
            playPopSound();
            setActiveTab('stuck');
            setEditingNote(null);
          }}
          className={`flex-1 sm:flex-initial px-4 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer rounded-xl border ${
            activeTab === 'stuck'
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent shadow-md'
              : 'bg-[#2A2933] border-[#3E3D4D] text-[#9CA3AF] hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-400" />
          <span>3. Ghim Nổi Màn Hình (Sticky)</span>
          <span className="px-1.5 py-0.5 bg-[#18171E] text-purple-300 text-[10px] rounded-md border border-[#2D2D38]">
            {stuckIds.length}
          </span>
        </button>

        <button
          onClick={openCreateForm}
          className={`flex-1 sm:flex-initial px-4 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer rounded-xl border ${
            activeTab === 'create'
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent shadow-md'
              : 'bg-[#2A2933] border-[#3E3D4D] text-[#9CA3AF] hover:text-white'
          }`}
        >
          <Edit3 className="w-4 h-4 text-emerald-400" />
          <span>{editingNote ? '4. Chỉnh Sửa Ghi Chú' : '4. Soạn Thảo'}</span>
        </button>
      </div>

      {/* 4. MAIN CONTENT AREA */}
      {activeTab === 'create' ? (
        /* SOẠN THẢO / CHỈNH SỬA GHI CHÚ GIAO DIỆN V-STUDY FORM */
        <div className="bg-[#1F1E24] border border-[#2D2D38] rounded-2xl p-5 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#2D2D38] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {editingNote ? 'Chỉnh Sửa Ghi Chú Sổ Tay' : 'Soạn Ghi Chú Học Tập Mới'}
                </h2>
                <p className="text-xs text-[#9CA3AF]">
                  Hỗ trợ công thức ôn thi, danh sách link M3U8 và đồng bộ sang tiện ích màn hình
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveTab('all');
                setEditingNote(null);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#2A2933] hover:bg-[#343340] border border-[#3E3D4D] text-xs text-[#9CA3AF] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại danh sách</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Note Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpenCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Tiêu đề ghi chú</span>
              </label>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Ví dụ: Công thức Toán giải tích 12, Đề cương Sinh học..."
                className="w-full bg-[#18171E] border border-[#2D2D38] focus:border-amber-500/60 rounded-xl text-white text-sm px-4 py-2.5 focus:outline-none transition-colors"
              />
            </div>

            {/* Note Content */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Nội dung chi tiết</span>
              </label>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={8}
                placeholder="Nhập ghi chép, công thức, link stream M3U8 hoặc ghi chú ôn tập..."
                className="w-full bg-[#18171E] border border-[#2D2D38] focus:border-amber-500/60 rounded-xl text-zinc-200 text-xs sm:text-sm p-4 focus:outline-none leading-relaxed custom-scrollbar font-sans"
              />
            </div>

            {/* Options Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#9CA3AF] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-sky-400" />
                  <span>Danh mục môn / Chủ đề</span>
                </label>
                <input
                  type="text"
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value)}
                  placeholder="Ví dụ: Toán Học, Tiếng Anh, M3U8..."
                  className="w-full bg-[#18171E] border border-[#2D2D38] rounded-xl text-white text-xs px-3 py-2 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              {/* Color Tag */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#9CA3AF] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>Màu sắc nhận diện</span>
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {(['amber', 'rose', 'emerald', 'sky', 'purple'] as NoteItem['colorTag'][]).map(
                    (tag) => {
                      const c = COLOR_MAP[tag];
                      const isSelected = noteColorTag === tag;
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setNoteColorTag(tag)}
                          className={`w-6 h-6 rounded-lg ${c.dot} transition-all cursor-pointer ${
                            isSelected
                              ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#1F1E24]'
                              : 'opacity-70 hover:opacity-100'
                          }`}
                          title={c.label}
                        />
                      );
                    }
                  )}
                </div>
              </div>

              {/* Pin Switch */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#9CA3AF] flex items-center gap-1.5">
                  <Pin className="w-3.5 h-3.5 text-rose-400" />
                  <span>Ưu tiên ghim</span>
                </label>
                <button
                  type="button"
                  onClick={() => setNoteIsPinned(!noteIsPinned)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    noteIsPinned
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-[#18171E] text-[#9CA3AF] border-[#2D2D38] hover:text-white'
                  }`}
                >
                  <Pin className={`w-3.5 h-3.5 ${noteIsPinned ? 'fill-amber-300' : ''}`} />
                  <span>{noteIsPinned ? 'Đã ghim ưu tiên' : 'Chưa ghim'}</span>
                </button>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="pt-4 border-t border-[#2D2D38] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('all');
                  setEditingNote(null);
                }}
                className="px-4 py-2 bg-[#2A2933] hover:bg-[#343340] border border-[#3E3D4D] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{editingNote ? 'Lưu Thay Đổi' : 'Lưu Vào V-Notes'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* DANH SÁCH GHI CHÚ THEO PHONG CÁCH V-STUDY SUBJECTS GRID */
        <div className="space-y-5">
          {/* SEARCH & CATEGORY FILTER BAR (EXACT V-STUDY LEVEL SELECTOR) */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#1F1E24] border border-[#2D2D38] rounded-2xl p-3 shadow-md">
            {/* Categories scrollable pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              <button
                onClick={() => {
                  playPopSound();
                  setSelectedCategory('all');
                  setSelectedColorTag(null);
                }}
                className={`px-3.5 py-2 text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer rounded-xl border ${
                  selectedCategory === 'all' && !selectedColorTag
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent shadow-md'
                    : 'bg-[#2A2933] border-[#3E3D4D] text-[#9CA3AF] hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Tất cả môn</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-[#18171E] rounded-md font-mono border border-[#2D2D38]">
                  {notes.length}
                </span>
              </button>

              {categories.map((cat) => {
                const count = notes.filter((n) => n.category === cat).length;
                const isSelected = selectedCategory === cat && !selectedColorTag;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      playPopSound();
                      setSelectedCategory(cat);
                      setSelectedColorTag(null);
                    }}
                    className={`px-3.5 py-2 text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer rounded-xl border ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent shadow-md'
                        : 'bg-[#2A2933] border-[#3E3D4D] text-[#9CA3AF] hover:text-white'
                    }`}
                  >
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span>{cat}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-[#18171E] rounded-md font-mono border border-[#2D2D38]">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Keyword Search Input */}
            <div className="relative w-full sm:w-72 h-[42px] flex items-center px-4 rounded-full spotlight-bubble-box search-box-capsule float-search-style text-xs transition-all border-0 shrink-0">
              <Search className="w-4.5 h-4.5 text-white stroke-[2.4] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] shrink-0 mr-2.5" />
              <input
                type="text"
                placeholder="Tìm ghi chú, công thức, M3U8..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-white/60 focus:outline-none font-semibold truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] border-0"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer shrink-0 ml-1"
                  title="Xóa tìm kiếm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Section Header with count */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <BookOpenCheck className="w-4 h-4 text-amber-400" />
              <span>
                {activeTab === 'all' && 'Danh Sách Ghi Chú & Tài Liệu Sổ Tay'}
                {activeTab === 'pinned' && 'Ghi Chú Đã Ghim Quan Trọng'}
                {activeTab === 'stuck' && 'Ghi Chú Ghim Nổi Trên Màn Hình'}
              </span>
            </h2>
            <span className="text-xs text-[#9CA3AF] font-mono">
              {filteredNotes.length} ghi chú hiển thị
            </span>
          </div>

          {/* GRID OF NOTE CARDS (EXACT V-STUDY SUBJECT CARD LAYOUT) */}
          {filteredNotes.length === 0 ? (
            <div className="p-12 text-center bg-[#1F1E24] border border-[#2D2D38] rounded-2xl space-y-3 shadow-lg">
              <BookOpen className="w-10 h-10 text-[#9CA3AF] mx-auto opacity-50" />
              <p className="text-white text-sm font-bold">Không tìm thấy ghi chú nào</p>
              <p className="text-[#9CA3AF] text-xs max-w-sm mx-auto">
                Không có nội dung nào phù hợp với từ khóa hoặc bộ lọc hiện tại. Hãy tạo ghi chú mới hoặc làm sạch bộ lọc.
              </p>
              <button
                onClick={() => {
                  setSearchKeyword('');
                  setSelectedCategory('all');
                  setSelectedColorTag(null);
                  setActiveTab('all');
                }}
                className="text-xs text-amber-400 hover:underline cursor-pointer font-bold inline-block pt-1"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredNotes.map((note) => {
                const colorConfig = COLOR_MAP[note.colorTag] || COLOR_MAP.amber;
                const isStuck = stuckIds.includes(note.id);
                const isM3U8 =
                  note.content.includes('#EXTM3U') ||
                  note.content.includes('.m3u8') ||
                  note.title.toLowerCase().includes('m3u8');

                return (
                  <div
                    key={note.id}
                    onClick={() => openEditModal(note)}
                    className="group relative border border-[#2D2D38] bg-[#1F1E24] hover:bg-[#25242C] rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[200px] shadow-lg hover:border-amber-500/50 hover:shadow-amber-500/5"
                  >
                    <div className="space-y-2.5">
                      {/* Card Top Metadata */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2.5 py-1 bg-[#18171E] rounded-xl border border-[#2D2D38] flex items-center gap-1.5 font-bold text-zinc-300">
                          <span className={`w-2 h-2 rounded-full ${colorConfig.dot}`} />
                          <span className="truncate max-w-[100px]">{note.category}</span>
                        </span>

                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          {/* Pin Toggle */}
                          <button
                            onClick={(e) => handleTogglePin(note.id, e)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              note.isPinned
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                : 'bg-[#18171E] text-zinc-500 border-[#2D2D38] hover:text-amber-400'
                            }`}
                            title={note.isPinned ? 'Bỏ ghim' : 'Ghim ưu tiên'}
                          >
                            <Pin className={`w-3 h-3 ${note.isPinned ? 'fill-amber-400' : ''}`} />
                          </button>

                          {/* Stuck on Screen Toggle */}
                          <button
                            onClick={(e) => handleToggleStuckOnScreen(note.id, e)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isStuck
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                : 'bg-[#18171E] text-zinc-500 border-[#2D2D38] hover:text-purple-400'
                            }`}
                            title={isStuck ? 'Gỡ ghim nổi' : 'Ghim nổi trên màn hình'}
                          >
                            <Layers className="w-3 h-3" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={(e) => handleDeleteNote(note.id, e)}
                            className="p-1.5 rounded-lg bg-[#18171E] border border-[#2D2D38] text-zinc-500 hover:text-rose-400 hover:border-rose-500/30 transition-colors cursor-pointer"
                            title="Xóa ghi chú"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Card Title & Snippet */}
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                          {note.title}
                        </h3>
                        <p
                          className={`text-xs mt-1.5 line-clamp-3 leading-relaxed ${
                            isM3U8
                              ? 'font-mono text-emerald-400 text-[11px] bg-[#141318] p-1.5 rounded-lg border border-[#2D2D38]'
                              : 'text-[#9CA3AF]'
                          }`}
                        >
                          {note.content || 'Chưa có nội dung...'}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer (V-Study style) */}
                    <div className="flex items-center justify-between text-xs font-bold text-[#9CA3AF] transition-all mt-4 pt-2.5 border-t border-[#2D2D38]">
                      <span className="text-[11px] text-zinc-400 font-mono bg-[#18171E] px-2 py-0.5 rounded-md border border-[#2D2D38]">
                        {note.updatedAt}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleCopy(note.content, note.id, e)}
                          className="p-1 text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
                          title="Sao chép nội dung"
                        >
                          {copiedId === note.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <div className="flex items-center gap-1 text-white group-hover:text-amber-400">
                          <span className="text-[11px]">Mở</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* EDUCATIONAL / USAGE GUIDELINES (EXACT V-STUDY FOOTER GUIDE BANNER) */}
          <div className="p-5 sm:p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-white/5 space-y-2.5 mt-6 shadow-xl">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>Chế độ Đồng Bộ Sổ Tay V-Notes & Sticky Nổi</span>
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Khi bạn ghim nổi ghi chú bằng biểu tượng <strong>Ghim Nổi (Layers)</strong>, ghi chú sẽ tự động xuất hiện dạng thẻ lơ lửng trên màn hình VNRT Online. Bạn có thể vừa làm bài thi trắc nghiệm trên <strong>V-Study</strong>, vừa xem tivi trực tuyến mà không bị che khuất tài liệu ôn tập.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VNotesView;
