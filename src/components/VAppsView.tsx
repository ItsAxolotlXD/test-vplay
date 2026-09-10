import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playPopSound } from '../utils/sound';
import ExploreVietnamTab from './ExploreVietnamTab';
import VplayVBoxTab from './VplayVBoxTab';
import VStudyTab from './VStudyTab';
import { VArcadeTab, VCalcTab, VRemindersTab, VXploreTab, VFurnitureTab } from './vapps';
import { VNotesView } from './VNotesView';
import { MinecraftContainerEmulator } from './minecraft/MinecraftContainerEmulator';
import { VFlowTab } from './vflow/VFlowTab';
import { ChatRoomView } from './chat/ChatRoomView';
import {
  Compass,
  Sparkles,
  Gamepad2,
  Folder,
  MapPin,
  Tv,
  GraduationCap,
  Calculator,
  Bell,
  StickyNote,
  Armchair,
  Box,
  Radio,
  MessageSquare,
  Search,
  X,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Maximize2,
  LayoutGrid,
  Sparkle,
  Layers,
  ArrowUp,
  LucideIcon
} from 'lucide-react';

export type VAppId =
  | 'v_arcade'
  | 'v_xplore'
  | 'explore_vietnam'
  | 'v_box'
  | 'v_learn'
  | 'v_calc'
  | 'v_reminders'
  | 'v_notes'
  | 'v_furniture'
  | 'v_minecraft'
  | 'v_flow'
  | 'v_chat';

export interface VAppDefinition {
  id: VAppId;
  name: string;
  tagline: string;
  description: string;
  category: 'Trò chơi (Arcade)' | 'Tiện ích & Tệp tin' | 'Học tập & Văn hóa' | 'Giải trí & Media';
  badge: string;
  gradientBg: string;
  borderClass: string;
  glowClass: string;
  icon: LucideIcon;
  tags: string[];
}

export const VAPPS_LIST: VAppDefinition[] = [
  // Hàng 1 (4 ứng dụng)
  {
    id: 'v_arcade',
    name: 'V-Games Arcade',
    tagline: 'Vòng Quay & Mini Games',
    description: 'Vòng Quay May Mắn Wheels of Fortune, Cờ Caro XO, Oẳn Tù Tì đối kháng, Nối Từ TV & EN, Đếm Số và Rắn Săn Mồi cổ điển.',
    category: 'Trò chơi (Arcade)',
    badge: 'Hot',
    gradientBg: 'bg-gradient-to-br from-[#FF4500] via-[#FF007A] to-[#7B2CBF]',
    borderClass: 'border-[#FF5E7E]/50 group-hover:border-[#FF5E7E]',
    glowClass: 'shadow-[0_10px_30px_rgba(255,0,122,0.35)]',
    icon: Gamepad2,
    tags: ['Wheels of Fortune', 'Vòng Quay May Mắn', 'Caro XO', 'Rắn Săn Mồi'],
  },
  {
    id: 'v_xplore',
    name: 'V-Files Explorer',
    tagline: 'Quản Lý Tệp Ore UI',
    description: 'Quản lý tệp đa năng phong cách Windows Explorer, xem trước media, phát danh sách phát M3U8 và sao lưu dữ liệu đám mây V-Cloud.',
    category: 'Tiện ích & Tệp tin',
    badge: 'Tệp Tin',
    gradientBg: 'bg-gradient-to-br from-[#6A11CB] via-[#4338CA] to-[#2575FC]',
    borderClass: 'border-[#818CF8]/50 group-hover:border-[#818CF8]',
    glowClass: 'shadow-[0_10px_30px_rgba(67,56,202,0.35)]',
    icon: Folder,
    tags: ['File Manager', 'M3U8 Playlists', 'V-Cloud Backup'],
  },
  {
    id: 'explore_vietnam',
    name: 'Explore Vietnam 360',
    tagline: 'Khám Phá 63 Tỉnh Thành',
    description: 'Bản đồ tương tác 63 tỉnh thành Việt Nam, tra cứu danh lam thắng cảnh, ẩm thực đặc sản, văn hóa truyền thống và thông tin địa lý.',
    category: 'Học tập & Văn hóa',
    badge: 'Bản Sắc',
    gradientBg: 'bg-gradient-to-br from-[#DC2626] via-[#E11D48] to-[#991B1B]',
    borderClass: 'border-[#FB7185]/50 group-hover:border-[#FB7185]',
    glowClass: 'shadow-[0_10px_30px_rgba(225,29,72,0.35)]',
    icon: MapPin,
    tags: ['63 Tỉnh Thành', 'Ẩm Thực', 'Danh Lam Thắng Cảnh'],
  },
  {
    id: 'v_box',
    name: 'V-Box Media Player',
    tagline: 'Kho Video & Truyền Hình',
    description: 'Bộ sưu tập video giải trí đặc sắc, các clip phát lại chất lượng cao, luồng phát sóng chọn lọc và tin tức tổng hợp.',
    category: 'Giải trí & Media',
    badge: 'Media',
    gradientBg: 'bg-gradient-to-br from-[#F59E0B] via-[#EA580C] to-[#C2410C]',
    borderClass: 'border-[#FBBF24]/50 group-hover:border-[#FBBF24]',
    glowClass: 'shadow-[0_10px_30px_rgba(245,158,11,0.35)]',
    icon: Tv,
    tags: ['Video Clip', 'Phát Lại', 'Giải Trí HD'],
  },

  // Hàng 2 (4 ứng dụng)
  {
    id: 'v_learn',
    name: 'V-Study Pomodoro',
    tagline: 'Flashcard & Tập Trung',
    description: 'Công cụ hỗ trợ học tập đắc lực: Đồng hồ đếm ngược Pomodoro tập trung sâu, quản lý bộ thẻ Flashcard và theo dõi tiến độ mục tiêu.',
    category: 'Học tập & Văn hóa',
    badge: 'Học Tập',
    gradientBg: 'bg-gradient-to-br from-[#0284C7] via-[#2563EB] to-[#1D4ED8]',
    borderClass: 'border-[#38BDF8]/50 group-hover:border-[#38BDF8]',
    glowClass: 'shadow-[0_10px_30px_rgba(2,132,199,0.35)]',
    icon: GraduationCap,
    tags: ['Pomodoro', 'Flashcards', 'Ghi Nhớ'],
  },
  {
    id: 'v_calc',
    name: 'V-Calc Express',
    tagline: 'Máy Tính Biểu Thức',
    description: 'Máy tính bỏ túi khoa học hỗ trợ tính toán biểu thức phức tạp, lưu lịch sử phép tính và quy đổi đơn vị đo lường linh hoạt.',
    category: 'Tiện ích & Tệp tin',
    badge: 'Khoa Học',
    gradientBg: 'bg-gradient-to-br from-[#0D9488] via-[#0891B2] to-[#0369A1]',
    borderClass: 'border-[#2DD4BF]/50 group-hover:border-[#2DD4BF]',
    glowClass: 'shadow-[0_10px_30px_rgba(13,148,136,0.35)]',
    icon: Calculator,
    tags: ['Khoa Học', 'Biểu Thức', 'Quy Đổi Đơn Vị'],
  },
  {
    id: 'v_reminders',
    name: 'V-Reminders Alarm',
    tagline: 'Nhắc Việc & Hẹn Giờ',
    description: 'Lên lịch nhắc nhở đón xem chương trình truyền hình yêu thích, các công việc quan trọng kèm chuông báo âm thanh cảnh báo sống động.',
    category: 'Tiện ích & Tệp tin',
    badge: 'Báo Thức',
    gradientBg: 'bg-gradient-to-br from-[#EA580C] via-[#DC2626] to-[#991B1B]',
    borderClass: 'border-[#FB923C]/50 group-hover:border-[#FB923C]',
    glowClass: 'shadow-[0_10px_30px_rgba(234,88,12,0.35)]',
    icon: Bell,
    tags: ['Chuông Báo', 'Lịch Xem TV', 'Task Alert'],
  },
  {
    id: 'v_notes',
    name: 'V-Notes Smart',
    tagline: 'Sticky Notes Thông Minh',
    description: 'Soạn thảo văn bản ghi chú với hệ thống dán nhãn màu sắc phong phú, quản lý dạng thẻ Sticky Notes và tìm kiếm thông minh.',
    category: 'Tiện ích & Tệp tin',
    badge: 'Ghi Chép',
    gradientBg: 'bg-gradient-to-br from-[#EAB308] via-[#CA8A04] to-[#A16207]',
    borderClass: 'border-[#FDE047]/50 group-hover:border-[#FDE047]',
    glowClass: 'shadow-[0_10px_30px_rgba(234,179,8,0.35)]',
    icon: StickyNote,
    tags: ['Ghi Chú Nhanh', 'Sticky Notes', 'Đồng Bộ'],
  },

  // Hàng 3 (4 ứng dụng)
  {
    id: 'v_furniture',
    name: 'V-Furniture 3D',
    tagline: 'Bài Trí Phòng Khách TV',
    description: 'Trải nghiệm không gian nội thất phòng xem truyền hình, tùy biến ánh sáng, sofa thư giãn và bài trí rạp hát tại gia.',
    category: 'Tiện ích & Tệp tin',
    badge: '3D Room',
    gradientBg: 'bg-gradient-to-br from-[#65A30D] via-[#16A34A] to-[#15803D]',
    borderClass: 'border-[#A3E635]/50 group-hover:border-[#A3E635]',
    glowClass: 'shadow-[0_10px_30px_rgba(101,163,13,0.35)]',
    icon: Armchair,
    tags: ['Không Gian 3D', 'Phòng Khách TV', 'Thư Giãn'],
  },
  {
    id: 'v_minecraft',
    name: 'Minecraft Container',
    tagline: 'Mô Phỏng Rương Đồ Pixel Art',
    description: 'Trải nghiệm rương chứa đồ Chest, Double Chest, Ender Chest, Shulker Box, Hopper và Lò nung với âm thanh Web Audio chân thực.',
    category: 'Trò chơi (Arcade)',
    badge: 'Sandbox',
    gradientBg: 'bg-gradient-to-br from-[#059669] via-[#047857] to-[#064E3B]',
    borderClass: 'border-[#34D399]/50 group-hover:border-[#34D399]',
    glowClass: 'shadow-[0_10px_30px_rgba(5,150,105,0.35)]',
    icon: Box,
    tags: ['Minecraft Chest', 'Container GUI', 'Pixel Art', 'Inventory'],
  },
  {
    id: 'v_flow',
    name: 'Cổng kết nối V-Flow',
    tagline: 'Mạng Xã Hội & Radio Live',
    description: 'Không gian tương tác trực tiếp cộng đồng Vplay, phát thanh radio, chia sẻ cảm nghĩ và dòng thời gian cập nhật liên tục.',
    category: 'Giải trí & Media',
    badge: 'Kết Nối',
    gradientBg: 'bg-gradient-to-br from-[#3B82F6] via-[#1D4ED8] to-[#4338CA]',
    borderClass: 'border-[#60A5FA]/50 group-hover:border-[#60A5FA]',
    glowClass: 'shadow-[0_10px_30px_rgba(59,130,246,0.35)]',
    icon: Radio,
    tags: ['V-Flow', 'Mạng Xã Hội', 'Radio Live', 'Tương Tác'],
  },
  {
    id: 'v_chat',
    name: 'Cổng trò chuyện V-Chat',
    tagline: 'Phòng Chat Trực Tiếp',
    description: 'Phòng trò chuyện trực tuyến, giao lưu kết nối bạn bè xem truyền hình trên toàn quốc với biểu tượng cảm xúc phong phú.',
    category: 'Giải trí & Media',
    badge: 'Cộng Đồng',
    gradientBg: 'bg-gradient-to-br from-[#DB2777] via-[#9333EA] to-[#7C3AED]',
    borderClass: 'border-[#F472B6]/50 group-hover:border-[#F472B6]',
    glowClass: 'shadow-[0_10px_30px_rgba(219,39,119,0.35)]',
    icon: MessageSquare,
    tags: ['V-Chat', 'Phòng Chat', 'Cộng Đồng', 'Kết Nối'],
  },
];

interface VAppsViewProps {
  initialAppId?: VAppId;
  selectedGameId?: string | null;
  navigate?: (route: string, state?: any) => void;
}

export const VAppsView: React.FC<VAppsViewProps> = ({
  initialAppId = 'v_arcade',
  selectedGameId = null,
  navigate,
}) => {
  const [activeApp, setActiveApp] = useState<VAppId>(initialAppId);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync activeApp when initialAppId changes
  useEffect(() => {
    if (initialAppId) {
      setActiveApp(initialAppId);
    }
  }, [initialAppId]);

  const categories = [
    'Tất cả',
    'Trò chơi (Arcade)',
    'Tiện ích & Tệp tin',
    'Học tập & Văn hóa',
    'Giải trí & Media',
    'Đang mở'
  ];

  const handleSelectApp = (appId: VAppId) => {
    playPopSound();
    setActiveApp(appId);
    // Smooth scroll to execution container
    setTimeout(() => {
      const container = document.getElementById('active-app-execution-container');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleOpenDedicatedTab = (appId: VAppId) => {
    if (!navigate) return;
    switch (appId) {
      case 'v_arcade':
        navigate('/v-arcade');
        break;
      case 'v_xplore':
        navigate('/v-files');
        break;
      case 'explore_vietnam':
        navigate('/explore-vietnam');
        break;
      case 'v_box':
        navigate('/v-box');
        break;
      case 'v_learn':
        navigate('/v-study');
        break;
      case 'v_calc':
        navigate('/v-calc');
        break;
      case 'v_reminders':
        navigate('/v-reminders');
        break;
      case 'v_notes':
        navigate('/v-notes');
        break;
      case 'v_furniture':
        navigate('/v-furniture');
        break;
      case 'v_minecraft':
        navigate('/minecraft');
        break;
      case 'v_flow':
        navigate('/v-flow');
        break;
      case 'v_chat':
        navigate('/chat');
        break;
      default:
        navigate('/space-360');
    }
  };

  const filteredApps = useMemo(() => {
    return VAPPS_LIST.filter((app) => {
      let matchCat = true;
      if (selectedCategory === 'Đang mở') {
        matchCat = app.id === activeApp;
      } else if (selectedCategory !== 'Tất cả') {
        matchCat = app.category === selectedCategory;
      }

      const matchSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery, activeApp]);

  const currentApp = VAPPS_LIST.find((a) => a.id === activeApp) || VAPPS_LIST[0];

  return (
    <div id="waves-vapps-view" className="w-full max-w-5xl mx-auto pb-16 text-left select-none animate-in fade-in duration-300">
      
      {/* 1. CATEGORY PILLS (Phù hợp với ngôn ngữ thiết kế của Chuyên Trang) */}
      <div className="w-full overflow-x-auto no-scrollbar pb-2 mb-6">
        <div className="flex items-center gap-2 min-w-max">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  playPopSound();
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border-0 ${
                  isSelected
                    ? 'bg-[#E6005A] text-white shadow-md font-bold'
                    : 'bg-[#1E1E24] text-[#A1A1AA] hover:text-white hover:bg-[#2A2A34]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SECTION HEADER (Tương tự Chuyên Trang) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E6005A]/15 text-[#E6005A] flex items-center justify-center shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Cổng không gian (Space 360)</span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E6005A]/20 text-[#FF4D8B]">
                12 Ứng dụng
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#9CA3AF] mt-0.5">
              Hệ sinh thái mini-apps và công cụ tương tác: Game Arcade, Quản lý tệp, Bản đồ 63 tỉnh thành, Pomodoro, Minecraft...
            </p>
          </div>
        </div>

        {/* Search capsule input */}
        <div className="relative w-full sm:w-72 h-[42px] flex items-center px-4 rounded-full bg-[#16151D] text-xs transition-all border-0 shadow-inner shrink-0">
          <Search className="w-4 h-4 text-[#8E8E93] shrink-0 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm ứng dụng Space 360..."
            className="w-full bg-transparent text-xs text-white placeholder-[#8E8E93] focus:outline-none font-medium truncate"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-[#8E8E93] hover:text-white transition-colors cursor-pointer shrink-0 ml-1"
              title="Xóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. BẢNG BANNER TRÒN CỦA SPACE 360: MỖI DÒNG 4 ỨNG DỤNG (Banner tròn, có viền, màu gradient và iconography) */}
      <div className="py-2 mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-9 sm:gap-y-12 gap-x-4 sm:gap-x-8 max-w-5xl mx-auto">
          {filteredApps.map((app) => {
            const isActive = activeApp === app.id;
            const AppIcon = app.icon;

            return (
              <button
                key={app.id}
                id={`space-app-circular-${app.id}`}
                onClick={() => handleSelectApp(app.id)}
                className="flex flex-col items-center group cursor-pointer bg-transparent border-0 p-0 focus:outline-none"
              >
                {/* Circular Banner: tròn, có viền, màu gradient và iconography của ứng dụng */}
                <div
                  className={`w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full relative flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-108 group-active:scale-95 ${app.gradientBg} border-2 sm:border-[3px] ${
                    isActive
                      ? 'border-white ring-4 ring-[#FF4081]/70 shadow-[0_0_32px_rgba(255,64,129,0.65)] scale-105'
                      : `${app.borderClass} ${app.glowClass}`
                  }`}
                >
                  {/* Subtle glossy top sheen reflection */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-transparent to-black/35 pointer-events-none" />

                  {/* Concentric inner radial halo for depth */}
                  <div className="absolute w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-white/10 blur-sm pointer-events-none group-hover:scale-125 transition-transform duration-500" />

                  {/* Iconography of the application */}
                  <div className="relative z-10 flex items-center justify-center text-white drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                    <AppIcon className="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 stroke-[1.8]" />
                  </div>

                  {/* Subtle inner hover glow */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 pointer-events-none" />

                  {/* App Badge at top-right */}
                  {app.badge && (
                    <span className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 text-[10px] sm:text-xs font-black px-2 sm:px-2.5 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20 shadow-lg pointer-events-none z-20">
                      {app.badge}
                    </span>
                  )}

                  {/* Active Indicator Pulse Dot */}
                  {isActive && (
                    <div className="absolute bottom-2.5 inset-x-0 flex justify-center pointer-events-none z-20">
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Title underneath */}
                <span
                  className={`mt-3 sm:mt-4 text-sm sm:text-base font-bold transition-colors text-center tracking-tight ${
                    isActive ? 'text-[#FF4081]' : 'text-white/90 group-hover:text-[#FF4081]'
                  }`}
                >
                  {app.name}
                </span>

                {/* Tagline underneath */}
                <span className="text-[11px] text-zinc-400 text-center line-clamp-1 mt-0.5 font-medium max-w-[150px]">
                  {app.tagline}
                </span>
              </button>
            );
          })}
        </div>

        {filteredApps.length === 0 && (
          <div className="text-center py-12 text-zinc-400">
            <p className="text-sm">Không tìm thấy ứng dụng phù hợp với từ khóa "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Tất cả');
              }}
              className="mt-3 px-4 py-1.5 rounded-full bg-[#E6005A] text-white text-xs font-bold"
            >
              Xem tất cả ứng dụng
            </button>
          </div>
        )}
      </div>

      {/* 4. KHUNG TRẢI NGHIỆM ỨNG DỤNG ĐANG CHỌN (ACTIVE APP EXECUTION ENGINE) */}
      <div 
        id="active-app-execution-container" 
        className={`overflow-hidden shadow-2xl bg-[#18191C] border-0 transition-all ${
          activeApp === 'v_minecraft' ? 'rounded-none' : 'rounded-3xl'
        }`}
      >
        {/* App Top Toolbar */}
        <div className="px-6 py-4 bg-[#1E1E24] flex items-center justify-between border-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${currentApp.gradientBg} border border-white/25 shadow-md flex items-center justify-center text-white ${
              activeApp === 'v_minecraft' ? 'rounded-none' : 'rounded-2xl'
            }`}>
              <currentApp.icon className="w-5 h-5 text-white drop-shadow" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{currentApp.name}</span>
                <span className="text-[10px] font-bold text-emerald-400 px-2.5 py-0.5 bg-emerald-500/10 rounded-full">
                  {currentApp.badge}
                </span>
              </h3>
              <p className="text-xs text-[#9CA3AF]">{currentApp.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const el = document.getElementById('waves-vapps-view');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 bg-[#2A2A35] hover:bg-[#3A3A48] text-white text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5"
              title="Cuộn lên danh sách ứng dụng Space 360"
            >
              <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Danh sách</span>
            </button>

            {navigate && (
              <button
                onClick={() => handleOpenDedicatedTab(activeApp)}
                className="px-3.5 py-1.5 bg-[#E6005A] hover:bg-[#FF206E] text-white text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                title="Mở toàn màn hình / Tab riêng"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Toàn màn hình</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic App Renderer */}
        <div className="p-4 sm:p-6 min-h-[550px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeApp}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {activeApp === 'v_arcade' && <VArcadeTab initialGameId={selectedGameId} />}
              {activeApp === 'v_xplore' && <VXploreTab />}
              {activeApp === 'explore_vietnam' && <ExploreVietnamTab />}
              {activeApp === 'v_box' && <VplayVBoxTab />}
              {activeApp === 'v_learn' && <VStudyTab />}
              {activeApp === 'v_calc' && <VCalcTab />}
              {activeApp === 'v_reminders' && <VRemindersTab />}
              {activeApp === 'v_notes' && <VNotesView />}
              {activeApp === 'v_furniture' && <VFurnitureTab />}
              {activeApp === 'v_minecraft' && <MinecraftContainerEmulator />}
              {activeApp === 'v_flow' && <VFlowTab navigate={navigate || (() => {})} />}
              {activeApp === 'v_chat' && <ChatRoomView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
