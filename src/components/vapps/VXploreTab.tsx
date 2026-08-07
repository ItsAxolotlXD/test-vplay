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
    <div className="w-full bg-[#242628] border-4 border-[#141414] shadow-2xl font-jura select-none text-white space-y-0.5">
      {/* 1. TOP WINDOW TITLE BAR (WINDOWS FILE EXPLORER / ORE UI STYLE) */}
      <div className="bg-[#1f2022] border-b-2 border-[#141414] p-2 sm:p-3 flex items-center justify-between shadow-[inset_1px_1px_0_#3f4246]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-purple-600 border-2 border-[#141414] flex items-center justify-center text-white shadow-[inset_1px_1px_0_#c084fc]">
            <Folder className="w-4 h-4 fill-white" />
          </div>
          <div>
            <h2 className="font-black text-xs sm:text-sm text-white uppercase tracking-wider font-jura flex items-center gap-2">
              <span>V-FILES FILE MANAGER</span>
              <span className="bg-[#a855f7] text-white px-2 py-0.5 text-[9px] font-bold font-mono border border-[#141414]">
                WINDOWS EXPLORER ORE UI
              </span>
            </h2>
            <p className="text-[10px] text-zinc-400 font-mono">Quản lý tệp, sao lưu M3U8 & dữ liệu đám mây Vplay</p>
          </div>
        </div>

        {/* Quick Storage Status Pill */}
        <div className="hidden sm:flex items-center gap-2 bg-[#141414] px-3 py-1 border border-zinc-700 text-[11px] font-mono">
          <HardDrive className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-zinc-300">Ổ C: 4.2 GB / 15 GB</span>
          <span className="text-zinc-600">|</span>
          <Cloud className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-sky-300">V-Cloud: 1.2 GB / 100 GB</span>
        </div>
      </div>

      {/* 2. TOP ORE UI TOOLBAR RIBBON */}
      <div className="bg-[#2d2f32] border-b-2 border-[#141414] p-2 flex flex-wrap items-center justify-between gap-2 shadow-[inset_1px_1px_0_#5a5d61]">
        {/* Left Actions: New Folder, Upload, Create Text, Delete */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <VplayPrimaryButton
            onClick={() => {
              playPopSound();
              setIsNewFolderModal(true);
            }}
            className="!py-1.5 !px-2.5 text-xs font-bold"
          >
            <FolderPlus className="w-3.5 h-3.5 inline mr-1 text-amber-300" />
            <span>Thư Mục Mới</span>
          </VplayPrimaryButton>

          <VplaySecondaryButton
            onClick={() => fileInputRef.current?.click()}
            className="!py-1.5 !px-2.5 text-xs font-bold"
          >
            <Upload className="w-3.5 h-3.5 inline mr-1 text-sky-400" />
            <span>Tải Tệp Lên</span>
          </VplaySecondaryButton>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            className="hidden"
          />

          <VplaySecondaryButton
            onClick={() => {
              playPopSound();
              setIsNewTextModal(true);
            }}
            className="!py-1.5 !px-2.5 text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
            <span>Tạo Ghi Chú</span>
          </VplaySecondaryButton>

          {activeCategory === 'trash' ? (
            <VplaySecondaryButton
              onClick={handleRestoreFromTrash}
              disabled={!selectedFileId}
              className="!py-1.5 !px-2.5 text-xs font-bold"
            >
              <RotateCw className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
              <span>Khôi Phục</span>
            </VplaySecondaryButton>
          ) : (
            <VplaySecondaryButton
              onClick={handleDeleteSelected}
              disabled={!selectedFileId}
              className="!py-1.5 !px-2.5 text-xs font-bold hover:!bg-rose-700 hover:!text-white"
            >
              <Trash2 className="w-3.5 h-3.5 inline mr-1 text-rose-400" />
              <span>Xóa Tệp</span>
            </VplaySecondaryButton>
          )}
        </div>

        {/* Right Actions: View Toggle */}
        <div className="flex items-center gap-1 border-l-2 border-[#141414] pl-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 border border-[#141414] font-bold ${
              viewMode === 'grid'
                ? 'bg-purple-600 text-white shadow-[inset_1px_1px_0_#c084fc]'
                : 'bg-[#1f2022] text-zinc-400 hover:text-white'
            }`}
            title="Chế độ lưới (Grid)"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 border border-[#141414] font-bold ${
              viewMode === 'list'
                ? 'bg-purple-600 text-white shadow-[inset_1px_1px_0_#c084fc]'
                : 'bg-[#1f2022] text-zinc-400 hover:text-white'
            }`}
            title="Chế độ danh sách (List)"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. BREADCRUMB ADDRESS BAR & SEARCH */}
      <div className="bg-[#1e2022] border-b-2 border-[#141414] p-2 flex flex-col sm:flex-row items-center gap-2">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setCurrentPath('C:\\Vplay')}
            className="p-1.5 bg-[#2d2f32] border border-[#141414] text-zinc-300 hover:text-white"
            title="Trở về thư mục gốc C:\\Vplay"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPath('C:\\Vplay')}
            className="p-1.5 bg-[#2d2f32] border border-[#141414] text-zinc-300 hover:text-white"
            title="Lên 1 cấp thư mục"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Path Address Bar */}
        <div className="flex-1 w-full bg-[#141414] border-2 border-[#141414] px-3 py-1 flex items-center gap-2 font-mono text-xs text-purple-300 shadow-inner">
          <HardDrive className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span className="truncate">{currentPath}</span>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-60 shrink-0">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Tìm kiếm tệp V-Files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] border-2 border-[#141414] pl-8 pr-3 py-1 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* 4. MAIN LAYOUT: SIDEBAR + FILE EXPLORER VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#141414]">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <div className="md:col-span-3 bg-[#242628] p-3 space-y-3 font-jura">
          <div className="text-[10px] font-bold uppercase font-mono text-zinc-400 tracking-wider">
            QUICK ACCESS & DRIVES
          </div>

          <div className="space-y-1 text-xs font-bold">
            <button
              onClick={() => {
                playPopSound();
                setActiveCategory('all');
              }}
              className={`w-full text-left px-2.5 py-1.5 flex items-center gap-2 border ${
                activeCategory === 'all'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-[inset_1px_1px_0_#c084fc]'
                  : 'bg-[#2d2f32] text-zinc-300 hover:bg-[#35383b] border-[#141414]'
              }`}
            >
              <HardDrive className="w-4 h-4 text-purple-300" />
              <span>Tất cả tệp (Drive C:)</span>
            </button>

            <button
              onClick={() => {
                playPopSound();
                setActiveCategory('cloud');
              }}
              className={`w-full text-left px-2.5 py-1.5 flex items-center gap-2 border ${
                activeCategory === 'cloud'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-[inset_1px_1px_0_#c084fc]'
                  : 'bg-[#2d2f32] text-zinc-300 hover:bg-[#35383b] border-[#141414]'
              }`}
            >
              <Cloud className="w-4 h-4 text-sky-400" />
              <span>V-Cloud Storage (V:)</span>
            </button>

            <button
              onClick={() => {
                playPopSound();
                setActiveCategory('documents');
              }}
              className={`w-full text-left px-2.5 py-1.5 flex items-center gap-2 border ${
                activeCategory === 'documents'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-[inset_1px_1px_0_#c084fc]'
                  : 'bg-[#2d2f32] text-zinc-300 hover:bg-[#35383b] border-[#141414]'
              }`}
            >
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Tài Liệu & Notes</span>
            </button>

            <button
              onClick={() => {
                playPopSound();
                setActiveCategory('videos');
              }}
              className={`w-full text-left px-2.5 py-1.5 flex items-center gap-2 border ${
                activeCategory === 'videos'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-[inset_1px_1px_0_#c084fc]'
                  : 'bg-[#2d2f32] text-zinc-300 hover:bg-[#35383b] border-[#141414]'
              }`}
            >
              <Film className="w-4 h-4 text-rose-400" />
              <span>Videos & M3U8 TV</span>
            </button>

            <button
              onClick={() => {
                playPopSound();
                setActiveCategory('pictures');
              }}
              className={`w-full text-left px-2.5 py-1.5 flex items-center gap-2 border ${
                activeCategory === 'pictures'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-[inset_1px_1px_0_#c084fc]'
                  : 'bg-[#2d2f32] text-zinc-300 hover:bg-[#35383b] border-[#141414]'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span>Hình Ảnh</span>
            </button>

            <button
              onClick={() => {
                playPopSound();
                setActiveCategory('music');
              }}
              className={`w-full text-left px-2.5 py-1.5 flex items-center gap-2 border ${
                activeCategory === 'music'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-[inset_1px_1px_0_#c084fc]'
                  : 'bg-[#2d2f32] text-zinc-300 hover:bg-[#35383b] border-[#141414]'
              }`}
            >
              <Music className="w-4 h-4 text-purple-400" />
              <span>Âm Nhạc (Audio)</span>
            </button>

            <button
              onClick={() => {
                playPopSound();
                setActiveCategory('trash');
              }}
              className={`w-full text-left px-2.5 py-1.5 flex items-center gap-2 border ${
                activeCategory === 'trash'
                  ? 'bg-rose-700 text-white border-rose-400 shadow-[inset_1px_1px_0_#fda4af]'
                  : 'bg-[#2d2f32] text-zinc-300 hover:bg-[#35383b] border-[#141414]'
              }`}
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Thùng Rác ({recycleBin.length})</span>
            </button>
          </div>

          {/* Selected File Details Widget */}
          {selectedFile && (
            <div className="mt-4 p-3 bg-[#1e2022] border-2 border-[#141414] space-y-2 text-xs">
              <div className="text-[10px] font-bold font-mono text-purple-300 uppercase flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-purple-400" />
                <span>Chi tiết tệp được chọn</span>
              </div>
              <div className="font-bold text-white break-all line-clamp-2">{selectedFile.name}</div>
              <div className="text-[11px] font-mono text-zinc-400 space-y-0.5">
                <div>Loại: <span className="text-zinc-200 uppercase">{selectedFile.type}</span></div>
                <div>Kích thước: <span className="text-amber-300">{selectedFile.size}</span></div>
                <div>Cập nhật: <span className="text-zinc-300">{selectedFile.dateModified}</span></div>
              </div>
              {selectedFile.content && (
                <VplayPrimaryButton
                  onClick={() => setPreviewFile(selectedFile)}
                  className="!py-1 text-xs font-bold w-full mt-1"
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" /> Mở Xem Tệp
                </VplayPrimaryButton>
              )}
            </div>
          )}
        </div>

        {/* RIGHT FILE EXPLORER BROWSER AREA */}
        <div className="md:col-span-9 bg-[#2d2f32] p-3 sm:p-4 overflow-y-auto custom-scrollbar">
          {displayedFiles.length === 0 ? (
            <div className="py-20 text-center space-y-3 text-zinc-400">
              <Folder className="w-12 h-12 mx-auto text-zinc-600" />
              <div className="font-bold text-sm">Thư mục trống hoặc không tìm thấy tệp trùng khớp</div>
              <p className="text-xs font-mono text-zinc-500">Thêm tệp mới hoặc thay đổi từ khóa tìm kiếm</p>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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
                      p-3 border-2 cursor-pointer flex flex-col items-center text-center justify-between space-y-2 select-none relative transition-none active:translate-y-[1px]
                      ${
                        isSelected
                          ? 'bg-purple-900/60 border-purple-400 text-white shadow-[inset_2px_2px_0_#c084fc,inset_-2px_-2px_0_#581c87]'
                          : 'bg-[#242628] hover:bg-[#323538] border-[#141414] text-zinc-200 shadow-[inset_1px_1px_0_#414549]'
                      }
                    `}
                  >
                    {/* Cloud Badge */}
                    {file.isCloud && (
                      <span className="absolute top-1.5 right-1.5 bg-sky-500 text-black text-[9px] font-black px-1 font-mono">
                        CLOUD
                      </span>
                    )}

                    {/* Icon */}
                    <div className="my-2">{getFileIcon(file.type)}</div>

                    {/* File Name */}
                    <div className="w-full">
                      <div className="text-xs font-bold line-clamp-2 leading-tight break-all font-jura">
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
              <table className="w-full text-left border-collapse font-jura text-xs">
                <thead>
                  <tr className="bg-[#1f2022] border-2 border-[#141414] text-zinc-400 font-mono uppercase text-[10px]">
                    <th className="p-2 font-bold">Tên Tệp</th>
                    <th className="p-2 font-bold">Loại</th>
                    <th className="p-2 font-bold">Kích Thước</th>
                    <th className="p-2 font-bold">Ngày Chỉnh Sửa</th>
                    <th className="p-2 font-bold text-right">Lưu Trữ</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#141414]">
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
                          cursor-pointer select-none
                          ${
                            isSelected
                              ? 'bg-purple-900/60 text-white font-bold'
                              : 'bg-[#242628] hover:bg-[#323538] text-zinc-300'
                          }
                        `}
                      >
                        <td className="p-2 flex items-center gap-2">
                          <span className="scale-75 shrink-0">{getFileIcon(file.type)}</span>
                          <span className="truncate font-bold">{file.name}</span>
                        </td>
                        <td className="p-2 uppercase font-mono text-[10px] text-zinc-400">{file.type}</td>
                        <td className="p-2 font-mono text-amber-300">{file.size}</td>
                        <td className="p-2 font-mono text-zinc-400">{file.dateModified}</td>
                        <td className="p-2 text-right">
                          {file.isCloud ? (
                            <span className="bg-sky-500 text-black text-[9px] font-black px-1.5 py-0.5 font-mono">
                              V-CLOUD
                            </span>
                          ) : (
                            <span className="bg-[#141414] text-purple-300 text-[9px] font-bold px-1.5 py-0.5 border border-zinc-700 font-mono">
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
      <div className="bg-[#1f2022] border-t-2 border-[#141414] p-2 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-400 gap-1">
        <div>
          Hiển thị: <b className="text-white">{displayedFiles.length}</b> tệp • Đã chọn:{' '}
          <b className="text-purple-300">{selectedFile ? selectedFile.name : 'Không có'}</b>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>V-Files Ore UI v2.5 • Windows Explorer Experience</span>
        </div>
      </div>

      {/* MODAL: PREVIEW FILE CONTENT */}
      {previewFile && (
        <div className="fixed inset-0 z-[99990] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="absolute inset-0" onClick={() => setPreviewFile(null)} />
          <div className="relative z-10 w-full max-w-2xl bg-[#2b2d30] border-4 border-[#141414] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-[#1f2022] border-b-2 border-[#141414] p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getFileIcon(previewFile.type)}
                <div>
                  <h3 className="font-extrabold text-sm text-white font-jura">{previewFile.name}</h3>
                  <span className="text-[10px] text-purple-300 font-mono">{previewFile.size} • {previewFile.path}</span>
                </div>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="w-7 h-7 bg-[#c6c6c6] hover:bg-rose-600 hover:text-white text-black font-bold border-2 border-[#141414] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#141414] overflow-y-auto flex-1 font-mono text-xs text-zinc-200">
              {previewFile.type === 'image' && previewFile.content ? (
                <img src={previewFile.content} alt={previewFile.name} className="max-h-96 mx-auto object-contain" />
              ) : previewFile.type === 'text' || previewFile.type === 'code' ? (
                <pre className="whitespace-pre-wrap font-mono leading-relaxed p-3 bg-zinc-950 border border-zinc-800 text-emerald-400">
                  {previewFile.content || 'Không có nội dung bản xem trước.'}
                </pre>
              ) : previewFile.type === 'playlist' ? (
                <div className="space-y-3 p-3 bg-zinc-950 border border-zinc-800">
                  <div className="text-amber-300 font-bold">#EXTM3U PLAYLIST CONTENT</div>
                  <div className="text-xs text-sky-400 font-mono">{previewFile.content}</div>
                </div>
              ) : (
                <div className="py-10 text-center text-zinc-400 font-jura space-y-2">
                  <File className="w-10 h-10 mx-auto text-zinc-600" />
                  <div>Tệp định dạng nhị phân ({previewFile.type.toUpperCase()})</div>
                  <div className="text-xs font-mono text-zinc-500">Kích thước: {previewFile.size}</div>
                </div>
              )}
            </div>

            <div className="bg-[#1f2022] border-t-2 border-[#141414] p-3 flex items-center justify-end">
              <VplaySecondaryButton onClick={() => setPreviewFile(null)} fullWidth={false} className="!py-1.5 !px-4 text-xs">
                Đóng Bản Xem Trước
              </VplaySecondaryButton>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEW FOLDER */}
      {isNewFolderModal && (
        <div className="fixed inset-0 z-[99990] flex items-center justify-center p-3 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#2b2d30] border-4 border-[#141414] p-4 space-y-4">
            <h3 className="font-extrabold text-sm text-white uppercase font-jura">TẠO THƯ MỤC MỚI</h3>
            <input
              type="text"
              placeholder="Nhập tên thư mục..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full bg-[#141414] border-2 border-[#141414] p-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
            />
            <div className="flex justify-end gap-2">
              <VplaySecondaryButton onClick={() => setIsNewFolderModal(false)} fullWidth={false} className="!py-1.5 text-xs">
                Hủy
              </VplaySecondaryButton>
              <VplayPrimaryButton onClick={handleCreateFolder} fullWidth={false} className="!py-1.5 text-xs">
                Tạo Thư Mục
              </VplayPrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEW TEXT FILE / NOTE */}
      {isNewTextModal && (
        <div className="fixed inset-0 z-[99990] flex items-center justify-center p-3 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#2b2d30] border-4 border-[#141414] p-4 space-y-3">
            <h3 className="font-extrabold text-sm text-white uppercase font-jura">TẠO TỆP GHI CHÚ MỚI</h3>
            <input
              type="text"
              placeholder="Tên tệp (ví dụ: GhiChu_TV.txt)..."
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="w-full bg-[#141414] border-2 border-[#141414] p-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
            />
            <textarea
              rows={5}
              placeholder="Nội dung ghi chú..."
              value={newFileContent}
              onChange={(e) => setNewFileContent(e.target.value)}
              className="w-full bg-[#141414] border-2 border-[#141414] p-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
            />
            <div className="flex justify-end gap-2">
              <VplaySecondaryButton onClick={() => setIsNewTextModal(false)} fullWidth={false} className="!py-1.5 text-xs">
                Hủy
              </VplaySecondaryButton>
              <VplayPrimaryButton onClick={handleCreateTextFile} fullWidth={false} className="!py-1.5 text-xs">
                Lưu Tệp Ghi Chú
              </VplayPrimaryButton>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
