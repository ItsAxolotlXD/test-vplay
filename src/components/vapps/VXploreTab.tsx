import React, { useState, useEffect, useRef } from 'react';
import { playPopSound } from '../../utils/sound';
import { VplayPrimaryButton } from '../ui/VplayPrimaryButton';
import { VplaySecondaryButton } from '../ui/VplaySecondaryButton';
import {
  Folder,
  FileText,
  FileVideo,
  FileAudio,
  FileImage,
  FileCode,
  FileArchive,
  HardDrive,
  Cloud,
  Download,
  Trash2,
  Plus,
  Upload,
  Search,
  Grid,
  List,
  ChevronRight,
  ChevronLeft,
  ArrowUp,
  RotateCw,
  Eye,
  X,
  Check,
  FolderPlus,
  Tv,
  Music,
  Image as ImageIcon,
  Film,
  File,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'video' | 'audio' | 'image' | 'text' | 'playlist' | 'code' | 'archive';
  size: string; // e.g. "4.2 MB"
  sizeBytes: number;
  dateModified: string;
  path: string; // e.g. "C:\\Vplay\\Documents"
  isCloud?: boolean;
  content?: string; // Text or preview URL
  mimeType?: string;
}

const INITIAL_FILES: FileItem[] = [
  {
    id: 'f-1',
    name: 'M3U8 Playlists',
    type: 'folder',
    size: '4 Items',
    sizeBytes: 0,
    dateModified: '2026-08-05 14:20',
    path: 'C:\\Vplay\\Playlists',
  },
  {
    id: 'f-2',
    name: 'VTV1_HD_Live_Stream.m3u8',
    type: 'playlist',
    size: '1.2 KB',
    sizeBytes: 1200,
    dateModified: '2026-08-06 09:15',
    path: 'C:\\Vplay\\Playlists',
    content: 'https://vtv1-live.vtv.vn/manifest.m3u8',
  },
  {
    id: 'f-3',
    name: 'Vietnam_Travel_Guide_4K.mp4',
    type: 'video',
    size: '420 MB',
    sizeBytes: 440401920,
    dateModified: '2026-08-04 18:30',
    path: 'C:\\Vplay\\Videos',
    isCloud: true,
  },
  {
    id: 'f-4',
    name: 'CEFR_B2_Vocabulary_Notes.txt',
    type: 'text',
    size: '18 KB',
    sizeBytes: 18432,
    dateModified: '2026-08-06 08:00',
    path: 'C:\\Vplay\\Documents',
    content: 'Danh sách từ vựng CEFR B2 cho kì thi V-Learn:\n1. Sustainable - Bền vững\n2. Optimization - Tối ưu hóa\n3. Systemic - Có hệ thống\n4. Infrastructure - Hạ tầng\n5. Resilience - Khả năng phục hồi',
  },
  {
    id: 'f-5',
    name: 'Vplay_Banner_Wallpaper_OreUI.png',
    type: 'image',
    size: '2.8 MB',
    sizeBytes: 2936012,
    dateModified: '2026-08-03 11:45',
    path: 'C:\\Vplay\\Pictures',
    content: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'f-6',
    name: 'Background_Minecraft_Theme.mp3',
    type: 'audio',
    size: '8.4 MB',
    sizeBytes: 8808038,
    dateModified: '2026-08-02 20:10',
    path: 'C:\\Vplay\\Music',
  },
  {
    id: 'f-7',
    name: 'vplay_config_settings.json',
    type: 'code',
    size: '3.4 KB',
    sizeBytes: 3481,
    dateModified: '2026-08-06 10:00',
    path: 'C:\\Vplay\\Documents',
    content: '{\n  "version": "2.5.0",\n  "theme": "Ore UI Dark",\n  "playerQuality": "4K",\n  "vbankAccount": "888899996868",\n  "verifiedStatus": "VIP Purple"\n}',
  },
  {
    id: 'f-8',
    name: 'Backup_VNotes_2026.zip',
    type: 'archive',
    size: '14.2 MB',
    sizeBytes: 14889779,
    dateModified: '2026-08-01 16:00',
    path: 'C:\\Vplay\\Backup',
    isCloud: true,
  },
];

export const VXploreTab: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(() => {
    const saved = localStorage.getItem('vplay_vxplore_files_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_FILES;
  });

  const [recycleBin, setRecycleBin] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('C:\\Vplay');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState<'all' | 'documents' | 'videos' | 'pictures' | 'music' | 'cloud' | 'trash'>('all');

  // Preview Modal state
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  // New Folder Modal state
  const [isNewFolderModal, setIsNewFolderModal] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');

  // New Text File Modal state
  const [isNewTextModal, setIsNewTextModal] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>('');
  const [newFileContent, setNewFileContent] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('vplay_vxplore_files_v1', JSON.stringify(files));
  }, [files]);

  const getFileIcon = (type: FileItem['type']) => {
    switch (type) {
      case 'folder':
        return <Folder className="w-8 h-8 text-amber-400 fill-amber-400/20" />;
      case 'video':
        return <FileVideo className="w-8 h-8 text-rose-400" />;
      case 'audio':
        return <FileAudio className="w-8 h-8 text-purple-400" />;
      case 'image':
        return <FileImage className="w-8 h-8 text-emerald-400" />;
      case 'text':
        return <FileText className="w-8 h-8 text-sky-400" />;
      case 'playlist':
        return <Tv className="w-8 h-8 text-amber-300" />;
      case 'code':
        return <FileCode className="w-8 h-8 text-cyan-400" />;
      case 'archive':
        return <FileArchive className="w-8 h-8 text-amber-500" />;
      default:
        return <File className="w-8 h-8 text-zinc-400" />;
    }
  };

  // Filtered files
  const displayedFiles = (activeCategory === 'trash' ? recycleBin : files).filter((file) => {
    if (activeCategory === 'trash') return true;
    if (searchQuery.trim()) {
      return file.name.toLowerCase().includes(searchQuery.toLowerCase());
    }

    if (activeCategory === 'documents') return file.type === 'text' || file.type === 'code';
    if (activeCategory === 'videos') return file.type === 'video' || file.type === 'playlist';
    if (activeCategory === 'pictures') return file.type === 'image';
    if (activeCategory === 'music') return file.type === 'audio';
    if (activeCategory === 'cloud') return file.isCloud;

    return true;
  });

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    playPopSound();
    const newFolder: FileItem = {
      id: `folder-${Date.now()}`,
      name: newFolderName.trim(),
      type: 'folder',
      size: '0 Items',
      sizeBytes: 0,
      dateModified: new Date().toISOString().slice(0, 16).replace('T', ' '),
      path: currentPath,
    };
    setFiles([newFolder, ...files]);
    setNewFolderName('');
    setIsNewFolderModal(false);
  };

  const handleCreateTextFile = () => {
    if (!newFileName.trim()) return;
    playPopSound();
    const filename = newFileName.endsWith('.txt') ? newFileName : `${newFileName}.txt`;
    const newFile: FileItem = {
      id: `file-${Date.now()}`,
      name: filename,
      type: 'text',
      size: `${(newFileContent.length / 1024).toFixed(1)} KB`,
      sizeBytes: newFileContent.length,
      dateModified: new Date().toISOString().slice(0, 16).replace('T', ' '),
      path: currentPath,
      content: newFileContent,
    };
    setFiles([newFile, ...files]);
    setNewFileName('');
    setNewFileContent('');
    setIsNewTextModal(false);
  };

  const handleDeleteSelected = () => {
    if (!selectedFileId) return;
    playPopSound();
    if (activeCategory === 'trash') {
      // Delete permanently
      setRecycleBin((prev) => prev.filter((f) => f.id !== selectedFileId));
    } else {
      const target = files.find((f) => f.id === selectedFileId);
      if (target) {
        setRecycleBin([target, ...recycleBin]);
        setFiles((prev) => prev.filter((f) => f.id !== selectedFileId));
      }
    }
    setSelectedFileId(null);
  };

  const handleRestoreFromTrash = () => {
    if (!selectedFileId || activeCategory !== 'trash') return;
    playPopSound();
    const target = recycleBin.find((f) => f.id === selectedFileId);
    if (target) {
      setFiles([target, ...files]);
      setRecycleBin((prev) => prev.filter((f) => f.id !== selectedFileId));
    }
    setSelectedFileId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;
    playPopSound();

    const newItems: FileItem[] = [];
    Array.from(uploadedFiles).forEach((f: File, idx) => {
      let type: FileItem['type'] = 'text';
      if (f.type.startsWith('image/')) type = 'image';
      else if (f.type.startsWith('video/')) type = 'video';
      else if (f.type.startsWith('audio/')) type = 'audio';
      else if (f.name.endsWith('.m3u8')) type = 'playlist';
      else if (f.name.endsWith('.zip') || f.name.endsWith('.rar')) type = 'archive';
      else if (f.name.endsWith('.json') || f.name.endsWith('.js') || f.name.endsWith('.ts')) type = 'code';

      const item: FileItem = {
        id: `upload-${Date.now()}-${idx}`,
        name: f.name,
        type,
        size: f.size > 1048576 ? `${(f.size / 1048576).toFixed(1)} MB` : `${(f.size / 1024).toFixed(1)} KB`,
        sizeBytes: f.size,
        dateModified: new Date().toISOString().slice(0, 16).replace('T', ' '),
        path: currentPath,
        content: URL.createObjectURL(f),
        mimeType: f.type,
      };
      newItems.push(item);
    });

    setFiles([...newItems, ...files]);
  };

  const selectedFile = (activeCategory === 'trash' ? recycleBin : files).find((f) => f.id === selectedFileId);

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 space-y-5 select-none pb-16 text-white">
      {/* 1. TOP HEADER - V-FLOW STYLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#2D2D38]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/25 shrink-0">
            <Folder className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                V-Files
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  QUẢN LÝ TỆP & CLOUD
                </span>
              </h1>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Quản lý tệp tin, sao lưu danh sách phát M3U8 & dữ liệu đám mây Vplay
            </p>
          </div>
        </div>

        {/* Quick Storage Status Pill */}
        <div className="flex items-center gap-2.5 bg-[#1F1E24] px-3.5 py-1.5 rounded-full border border-[#2D2D38] text-xs font-mono self-start sm:self-auto">
          <HardDrive className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-zinc-300">Ổ C: 4.2 GB / 15 GB</span>
          <span className="text-zinc-600">|</span>
          <Cloud className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-sky-300">V-Cloud: 1.2 GB / 100 GB</span>
        </div>
      </div>

      {/* 2. V-FLOW TOOLBAR RIBBON */}
      <div className="bg-[#1F1E24] rounded-2xl border border-[#2D2D38] p-3 flex flex-wrap items-center justify-between gap-2 shadow-md">
        {/* Left Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              playPopSound();
              setIsNewFolderModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-300" />
            <span>Thư Mục Mới</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-[#2A2933] hover:bg-[#34333F] text-zinc-200 border border-[#3E3D4D] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>Tải Tệp Lên</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            className="hidden"
          />

          <button
            onClick={() => {
              playPopSound();
              setIsNewTextModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-[#2A2933] hover:bg-[#34333F] text-zinc-200 border border-[#3E3D4D] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tạo Ghi Chú</span>
          </button>

          {activeCategory === 'trash' ? (
            <button
              onClick={handleRestoreFromTrash}
              disabled={!selectedFileId}
              className="px-3.5 py-2 rounded-xl bg-[#2A2933] hover:bg-[#34333F] disabled:opacity-40 text-emerald-300 border border-[#3E3D4D] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Khôi Phục</span>
            </button>
          ) : (
            <button
              onClick={handleDeleteSelected}
              disabled={!selectedFileId}
              className="px-3.5 py-2 rounded-xl bg-[#2A2933] hover:bg-rose-900/50 disabled:opacity-40 text-rose-300 border border-[#3E3D4D] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa Tệp</span>
            </button>
          )}
        </div>

        {/* Right Actions: View Toggle */}
        <div className="flex items-center gap-1 bg-[#18171E] p-1 rounded-xl border border-[#2D2D38]">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Chế độ lưới (Grid)"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Chế độ danh sách (List)"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. BREADCRUMB ADDRESS BAR & SEARCH */}
      <div className="bg-[#1F1E24] rounded-2xl border border-[#2D2D38] p-2.5 flex flex-col sm:flex-row items-center gap-2">
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setCurrentPath('C:\\Vplay')}
            className="p-1.5 rounded-xl bg-[#18171E] border border-[#2D2D38] text-zinc-300 hover:text-white transition-all cursor-pointer"
            title="Trở về thư mục gốc C:\\Vplay"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPath('C:\\Vplay')}
            className="p-1.5 rounded-xl bg-[#18171E] border border-[#2D2D38] text-zinc-300 hover:text-white transition-all cursor-pointer"
            title="Lên 1 cấp thư mục"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Path Address Bar */}
        <div className="flex-1 w-full bg-[#18171E] border border-[#2D2D38] rounded-xl px-3 py-1.5 flex items-center gap-2 font-mono text-xs text-purple-300">
          <HardDrive className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span className="truncate">{currentPath}</span>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm tệp V-Files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#18171E] border border-[#2D2D38] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 font-sans focus:outline-none focus:border-purple-500/60"
          />
        </div>
      </div>

      {/* 4. MAIN LAYOUT: SIDEBAR + FILE EXPLORER VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* LEFT SIDEBAR NAVIGATION */}
        <div className="md:col-span-3 rounded-2xl bg-[#1F1E24] border border-[#2D2D38] p-3 space-y-2 shadow-lg">
          <div className="text-[10px] font-bold uppercase font-mono text-zinc-400 tracking-wider px-2 pt-1">
            DANH MỤC LƯU TRỮ
          </div>

          <div className="space-y-1 text-xs font-semibold">
            {[
              { id: 'all', label: 'Tất cả tệp (Drive C:)', icon: HardDrive, color: 'text-purple-300' },
              { id: 'cloud', label: 'V-Cloud Storage (V:)', icon: Cloud, color: 'text-sky-400' },
              { id: 'documents', label: 'Tài Liệu & Notes', icon: FileText, color: 'text-amber-400' },
              { id: 'videos', label: 'Videos & M3U8 TV', icon: Film, color: 'text-rose-400' },
              { id: 'pictures', label: 'Hình Ảnh', icon: ImageIcon, color: 'text-emerald-400' },
              { id: 'music', label: 'Âm Nhạc (Audio)', icon: Music, color: 'text-purple-400' },
              { id: 'trash', label: `Thùng Rác (${recycleBin.length})`, icon: Trash2, color: 'text-rose-400' },
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    playPopSound();
                    setActiveCategory(cat.id as any);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-[#282733]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : cat.color}`} />
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Selected File Details Widget */}
          {selectedFile && (
            <div className="mt-4 p-3.5 rounded-xl bg-[#18171E] border border-[#2D2D38] space-y-2 text-xs">
              <div className="text-[10px] font-bold font-mono text-purple-300 uppercase flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-purple-400" />
                <span>Chi tiết tệp</span>
              </div>
              <div className="font-bold text-white break-all line-clamp-2">{selectedFile.name}</div>
              <div className="text-[11px] font-mono text-zinc-400 space-y-0.5">
                <div>Loại: <span className="text-zinc-200 uppercase">{selectedFile.type}</span></div>
                <div>Kích thước: <span className="text-amber-300">{selectedFile.size}</span></div>
                <div>Cập nhật: <span className="text-zinc-300">{selectedFile.dateModified}</span></div>
              </div>
              {selectedFile.content && (
                <button
                  onClick={() => setPreviewFile(selectedFile)}
                  className="w-full py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer mt-2"
                >
                  <Eye className="w-3.5 h-3.5" /> Mở Xem Tệp
                </button>
              )}
            </div>
          )}
        </div>

        {/* RIGHT FILE EXPLORER BROWSER AREA */}
        <div className="md:col-span-9 rounded-2xl bg-[#1F1E24] border border-[#2D2D38] p-4 min-h-[460px] shadow-lg">
          {displayedFiles.length === 0 ? (
            <div className="py-24 text-center space-y-3 text-zinc-400">
              <Folder className="w-12 h-12 mx-auto text-zinc-600" />
              <div className="font-bold text-sm text-zinc-300">Thư mục trống hoặc không tìm thấy tệp trùng khớp</div>
              <p className="text-xs text-zinc-500">Thêm tệp mới hoặc thay đổi từ khóa tìm kiếm</p>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {displayedFiles.map((file) => {
                const isSelected = selectedFileId === file.id;

                return (
                  <div
                    key={file.id}
                    onClick={() => {
                      playPopSound();
                      setSelectedFileId(file.id);
                    }}
                    onDoubleClick={() => {
                      if (file.content) setPreviewFile(file);
                    }}
                    className={`
                      p-3.5 rounded-2xl border cursor-pointer flex flex-col items-center text-center justify-between space-y-2 select-none relative transition-all active:scale-95
                      ${
                        isSelected
                          ? 'bg-[#282736] border-purple-500 shadow-lg text-white'
                          : 'bg-[#18171E] hover:bg-[#22212B] border-[#2D2D38] text-zinc-200'
                      }
                    `}
                  >
                    {/* Cloud Badge */}
                    {file.isCloud && (
                      <span className="absolute top-2 right-2 bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono">
                        CLOUD
                      </span>
                    )}

                    {/* Icon */}
                    <div className="my-2">{getFileIcon(file.type)}</div>

                    {/* File Name */}
                    <div className="w-full">
                      <div className="text-xs font-bold line-clamp-2 leading-snug break-all">
                        {file.name}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400 mt-1">{file.size}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* LIST VIEW */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#2D2D38] text-zinc-400 font-mono uppercase text-[10px]">
                    <th className="pb-3 font-bold">Tên Tệp</th>
                    <th className="pb-3 font-bold">Loại</th>
                    <th className="pb-3 font-bold">Kích Thước</th>
                    <th className="pb-3 font-bold">Ngày Chỉnh Sửa</th>
                    <th className="pb-3 font-bold text-right">Lưu Trữ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D2D38]/50">
                  {displayedFiles.map((file) => {
                    const isSelected = selectedFileId === file.id;

                    return (
                      <tr
                        key={file.id}
                        onClick={() => {
                          playPopSound();
                          setSelectedFileId(file.id);
                        }}
                        onDoubleClick={() => {
                          if (file.content) setPreviewFile(file);
                        }}
                        className={`
                          cursor-pointer transition-colors
                          ${
                            isSelected
                              ? 'bg-purple-900/30 text-white font-bold'
                              : 'hover:bg-white/5 text-zinc-300'
                          }
                        `}
                      >
                        <td className="py-2.5 flex items-center gap-2">
                          <span className="scale-75 shrink-0">{getFileIcon(file.type)}</span>
                          <span className="truncate font-medium">{file.name}</span>
                        </td>
                        <td className="py-2.5 uppercase font-mono text-[10px] text-zinc-400">{file.type}</td>
                        <td className="py-2.5 font-mono text-amber-300">{file.size}</td>
                        <td className="py-2.5 font-mono text-zinc-400">{file.dateModified}</td>
                        <td className="py-2.5 text-right">
                          {file.isCloud ? (
                            <span className="bg-sky-500/20 text-sky-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-sky-500/30 font-mono">
                              V-CLOUD
                            </span>
                          ) : (
                            <span className="bg-[#18171E] text-purple-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#2D2D38] font-mono">
                              DRIVE C:
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 5. FOOTER STATUS BAR */}
      <div className="p-3 rounded-2xl bg-[#1F1E24] border border-[#2D2D38] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-2">
        <div>
          Hiển thị: <b className="text-white">{displayedFiles.length}</b> tệp • Đã chọn:{' '}
          <b className="text-purple-300">{selectedFile ? selectedFile.name : 'Không có'}</b>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>V-Files • Không gian lưu trữ đám mây tốc độ cao</span>
        </div>
      </div>

      {/* MODAL: PREVIEW FILE CONTENT */}
      {previewFile && (
        <div className="fixed inset-0 z-[99990] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
          <div className="relative z-10 w-full max-w-2xl bg-[#1F1E24] border border-[#343440] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-[#2D2D38] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {getFileIcon(previewFile.type)}
                <div>
                  <h3 className="font-bold text-sm text-white">{previewFile.name}</h3>
                  <span className="text-[10px] text-purple-300 font-mono">{previewFile.size} • {previewFile.path}</span>
                </div>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#14131A] overflow-y-auto flex-1 font-mono text-xs text-zinc-200">
              {previewFile.type === 'image' && previewFile.content ? (
                <img src={previewFile.content} alt={previewFile.name} className="max-h-96 mx-auto object-contain rounded-xl" />
              ) : previewFile.type === 'text' || previewFile.type === 'code' ? (
                <pre className="whitespace-pre-wrap font-mono leading-relaxed p-3.5 bg-[#18171E] rounded-xl border border-[#2D2D38] text-emerald-400">
                  {previewFile.content || 'Không có nội dung bản xem trước.'}
                </pre>
              ) : previewFile.type === 'playlist' ? (
                <div className="space-y-3 p-3.5 bg-[#18171E] rounded-xl border border-[#2D2D38]">
                  <div className="text-amber-300 font-bold">#EXTM3U PLAYLIST CONTENT</div>
                  <div className="text-xs text-sky-400 font-mono">{previewFile.content}</div>
                </div>
              ) : (
                <div className="py-12 text-center text-zinc-400 space-y-2">
                  <File className="w-10 h-10 mx-auto text-zinc-600" />
                  <div>Tệp định dạng nhị phân ({previewFile.type.toUpperCase()})</div>
                  <div className="text-xs font-mono text-zinc-500">Kích thước: {previewFile.size}</div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-[#2D2D38] flex items-center justify-end">
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 rounded-xl bg-[#2A2933] hover:bg-[#34333F] text-zinc-200 text-xs font-semibold cursor-pointer"
              >
                Đóng Bản Xem Trước
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEW FOLDER */}
      {isNewFolderModal && (
        <div className="fixed inset-0 z-[99990] flex items-center justify-center p-3 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#1F1E24] border border-[#343440] rounded-2xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-white">TẠO THƯ MỤC MỚI</h3>
            <input
              type="text"
              placeholder="Nhập tên thư mục..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full bg-[#18171E] border border-[#2D2D38] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/60"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNewFolderModal(false)}
                className="px-4 py-2 rounded-xl bg-[#2A2933] hover:bg-[#34333F] text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold cursor-pointer"
              >
                Tạo Thư Mục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEW TEXT FILE / NOTE */}
      {isNewTextModal && (
        <div className="fixed inset-0 z-[99990] flex items-center justify-center p-3 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#1F1E24] border border-[#343440] rounded-2xl p-5 space-y-3.5 shadow-2xl">
            <h3 className="font-bold text-sm text-white">TẠO TỆP GHI CHÚ MỚI</h3>
            <input
              type="text"
              placeholder="Tên tệp (ví dụ: GhiChu_TV.txt)..."
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="w-full bg-[#18171E] border border-[#2D2D38] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/60"
            />
            <textarea
              rows={5}
              placeholder="Nội dung ghi chú..."
              value={newFileContent}
              onChange={(e) => setNewFileContent(e.target.value)}
              className="w-full bg-[#18171E] border border-[#2D2D38] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 resize-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNewTextModal(false)}
                className="px-4 py-2 rounded-xl bg-[#2A2933] hover:bg-[#34333F] text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateTextFile}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold cursor-pointer"
              >
                Lưu Tệp Ghi Chú
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
