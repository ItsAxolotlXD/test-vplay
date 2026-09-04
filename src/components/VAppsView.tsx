import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playPopSound } from '../utils/sound';
import ExploreVietnamTab from './ExploreVietnamTab';
import VplayVBoxTab from './VplayVBoxTab';
import VStudyTab from './VStudyTab';
import { VArcadeTab, VCalcTab, VRemindersTab, VXploreTab, VFurnitureTab } from './vapps';
import { VNotesView } from './VNotesView';
import { MinecraftContainerEmulator } from './minecraft/MinecraftContainerEmulator';
import {
  Grid,
  MapPin,
  Tv,
  GraduationCap,
  Calculator,
  Bell,
  StickyNote,
  Folder,
  Armchair,
  Gamepad2,
  X,
  Sparkles,
  Search,
  LayoutGrid,
  Layers,
  ChevronRight,
  Zap,
  ArrowRight,
  TrendingUp,
  Compass,
  CheckCircle2,
  SlidersHorizontal,
  Maximize2,
  Box
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
  | 'v_minecraft';

interface VAppDefinition {
  id: VAppId;
  name: string;
  tagline: string;
  description: string;
  category: 'Trò chơi (Arcade)' | 'Tiện ích & Tệp tin' | 'Học tập & Văn hóa' | 'Giải trí & Media';
  badge: string;
  themeGradient: string;
  icon: React.ReactNode;
  tags: string[];
}

const VAPPS_LIST: VAppDefinition[] = [
  {
    id: 'v_arcade',
    name: 'V-Games & Arcade Zone',
    tagline: 'Vòng Quay May Mắn & Game Cổ Điển',
    description: 'Vòng Quay May Mắn Wheels of Fortune tùy biến tạo vòng quay, Caro XO, Oẳn Tù Tì đối kháng, Nối Từ TV & EN, Đếm Số 1->N và Rắn Săn Mồi.',
    category: 'Trò chơi (Arcade)',
    badge: 'Hot • Vòng Quay & Games',
    themeGradient: 'from-amber-500/20 via-emerald-600/20 to-transparent',
    icon: <Gamepad2 className="w-8 h-8 text-amber-400" />,
    tags: ['Wheels of Fortune', 'Vòng Quay May Mắn', 'Caro XO', 'Rắn Săn Mồi'],
  },
  {
    id: 'v_xplore',
    name: 'V-Files Explorer',
    tagline: 'Trình Quản Lý Tệp Ore UI',
    description: 'Quản lý tệp đa năng phong cách Windows Explorer, xem trước media, phát danh sách phát M3U8 và sao lưu dữ liệu đám mây V-Cloud.',
    category: 'Tiện ích & Tệp tin',
    badge: 'Tệp Tin',
    themeGradient: 'from-purple-600/20 via-indigo-900/10 to-transparent',
    icon: <Folder className="w-8 h-8 text-purple-400" />,
    tags: ['File Manager', 'M3U8 Playlists', 'V-Cloud Backup'],
  },
  {
    id: 'explore_vietnam',
    name: 'Explore Vietnam 360',
    tagline: 'Khám Phá 63 Tỉnh Thành',
    description: 'Bản đồ tương tác 63 tỉnh thành Việt Nam, tra cứu danh lam thắng cảnh, ẩm thực đặc sản, văn hóa truyền thống và thông tin địa lý.',
    category: 'Học tập & Văn hóa',
    badge: 'Bản Sắc VN',
    themeGradient: 'from-rose-600/20 via-pink-900/10 to-transparent',
    icon: <MapPin className="w-8 h-8 text-rose-400" />,
    tags: ['63 Tỉnh Thành', 'Ẩm Thực', 'Danh Lam Thắng Cảnh'],
  },
  {
    id: 'v_box',
    name: 'V-Box Media Player',
    tagline: 'Kho Video & Truyền Hình Đặc Sắc',
    description: 'Bộ sưu tập video giải trí đặc sắc, các clip phát lại chất lượng cao, luồng phát sóng chọn lọc và tin tức tổng hợp.',
    category: 'Giải trí & Media',
    badge: 'Giải Trí',
    themeGradient: 'from-amber-600/20 via-orange-900/10 to-transparent',
    icon: <Tv className="w-8 h-8 text-amber-400" />,
    tags: ['Video Clip', 'Phát Lại', 'Giải Trí HD'],
  },
  {
    id: 'v_learn',
    name: 'V-Study Pomodoro',
    tagline: 'Học Tập, Flashcard & Tập Trung',
    description: 'Công cụ hỗ trợ học tập đắc lực: Đồng hồ đếm ngược Pomodoro tập trung sâu, quản lý bộ thẻ Flashcard và theo dõi tiến độ mục tiêu.',
    category: 'Học tập & Văn hóa',
    badge: 'Học Tập',
    themeGradient: 'from-sky-600/20 via-blue-900/10 to-transparent',
    icon: <GraduationCap className="w-8 h-8 text-sky-400" />,
    tags: ['Pomodoro', 'Flashcards', 'Ghi Nhớ'],
  },
  {
    id: 'v_calc',
    name: 'V-Calc Express',
    tagline: 'Máy Tính Biểu Thức Khoa Học',
    description: 'Máy tính bỏ túi khoa học hỗ trợ tính toán biểu thức phức tạp, lưu lịch sử phép tính và quy đổi đơn vị đo lường linh hoạt.',
    category: 'Tiện ích & Tệp tin',
    badge: 'Toán Học',
    themeGradient: 'from-cyan-600/20 via-teal-900/10 to-transparent',
    icon: <Calculator className="w-8 h-8 text-cyan-400" />,
    tags: ['Khoa Học', 'Biểu Thức', 'Quy Đổi Đơn Vị'],
  },
  {
    id: 'v_reminders',
    name: 'V-Reminders Alarm',
    tagline: 'Hẹn Giờ & Nhắc Việc Thông Minh',
    description: 'Lên lịch nhắc nhở đón xem chương trình truyền hình yêu thích, các công việc quan trọng kèm chuông báo âm thanh cảnh báo sống động.',
    category: 'Tiện ích & Tệp tin',
    badge: 'Nhắc Việc',
    themeGradient: 'from-orange-600/20 via-amber-900/10 to-transparent',
    icon: <Bell className="w-8 h-8 text-orange-400" />,
    tags: ['Chuông Báo', 'Lịch Xem TV', 'Task Alert'],
  },
  {
    id: 'v_notes',
    name: 'V-Notes Smart',
    tagline: 'Ghi Chú Nhanh & Sticky Notes',
    description: 'Soạn thảo văn bản ghi chú với hệ thống dán nhãn màu sắc phong phú, quản lý dạng thẻ Sticky Notes và tìm kiếm thông minh.',
    category: 'Tiện ích & Tệp tin',
    badge: 'Ghi Chép',
    themeGradient: 'from-yellow-600/20 via-amber-900/10 to-transparent',
    icon: <StickyNote className="w-8 h-8 text-yellow-400" />,
    tags: ['Ghi Chú Nhanh', 'Sticky Notes', 'Đồng Bộ'],
  },
  {
    id: 'v_furniture',
    name: 'V-Furniture 3D',
    tagline: 'Thiết Kế & Bài Trí Phòng Khách TV',
    description: 'Trải nghiệm không gian nội thất phòng xem truyền hình, tùy biến ánh sáng, sofa thư giãn và bài trí rạp hát tại gia.',
    category: 'Tiện ích & Tệp tin',
    badge: 'Nội Thất',
    themeGradient: 'from-lime-600/20 via-emerald-900/10 to-transparent',
    icon: <Armchair className="w-8 h-8 text-lime-400" />,
    tags: ['Không Gian 3D', 'Phòng Khách TV', 'Thư Giãn'],
  },
  {
    id: 'v_minecraft',
    name: 'Minecraft Container GUI',
    tagline: 'Mô Phỏng Kho Đồ & Rương Minecraft Pixel Art',
    description: 'Trải nghiệm rương chứa đồ (Chest, Double Chest, Ender Chest, Shulker Box, Hopper, Lò Nung Furnace) với âm thanh Web Audio chân thực, kéo thả item, tách stack và bảng Creative item.',
    category: 'Tiện ích & Tệp tin',
    badge: 'Sandbox GUI',
    themeGradient: 'from-emerald-600/20 via-green-900/10 to-transparent',
    icon: <Box className="w-8 h-8 text-emerald-400" />,
    tags: ['Minecraft Chest', 'Container GUI', 'Pixel Art', 'Inventory'],
  },
];

interface VAppsViewProps {
  initialAppId?: VAppId;
  selectedGameId?: string | null;
  navigate?: (route: string, state?: any) => void;
}

const APP_ROUTES: Record<VAppId, string> = {
  v_arcade: '/v-arcade',
  v_xplore: '/v-files',
  explore_vietnam: '/explore-vietnam',
  v_box: '/v-box',
  v_learn: '/v-study',
  v_calc: '/v-calc',
  v_reminders: '/v-reminders',
  v_notes: '/v-notes',
  v_furniture: '/v-furniture',
  v_minecraft: '/minecraft',
};

export const VAppsView: React.FC<VAppsViewProps> = ({
  initialAppId = 'v_arcade',
  selectedGameId = null,
  navigate,
}) => {
  const [activeApp, setActiveApp] = useState<VAppId>(initialAppId);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync activeApp when initialAppId changes (e.g. user clicks direct sidebar tab)
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
    if (navigate && APP_ROUTES[appId]) {
      navigate(APP_ROUTES[appId]);
      return;
    }
    setActiveApp(appId);
    const container = document.getElementById('active-app-execution-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    <div id="waves-vapps-view" className="space-y-8 pb-16 text-left select-none animate-in fade-in duration-300">
      {/* 1. HEADER (News style UI) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
            <span>HỆ SINH THÁI ỨNG DỤNG • WAVES SPACE 360</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Space 360 & Kho Ứng Dụng Mini
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
            Hệ sinh thái mini-apps phong phú: Game Arcade Ore UI, Trình quản lý tệp V-Files, Khám phá 63 tỉnh thành Việt Nam, V-Study Pomodoro và các tiện ích sáng tạo.
          </p>
        </div>

        {/* Right Search Box & Total Apps Badge */}
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <div className="relative w-full sm:w-64 h-[42px] flex items-center px-4 rounded-full spotlight-bubble-box search-box-capsule text-xs transition-all border-0">
            <Search className="w-4 h-4 text-[#8E8E93] shrink-0 mr-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm ứng dụng trong Space 360..."
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

          <div className="px-3.5 py-1.5 rounded-full bg-[#1E1E22] border border-[#2D2D35] flex items-center gap-2 text-xs">
            <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-zinc-400 font-medium">Kho:</span>
            <span className="font-bold text-white">{VAPPS_LIST.length} Mini-Apps</span>
          </div>
        </div>
      </div>

      {/* 2. FEATURED BIG SHOWCASE CARD (Native Vector UI Stage - No Placeholder Images) */}
      {currentApp && (
        <div
          onClick={() => handleSelectApp(currentApp.id)}
          className="relative rounded-[30px] overflow-hidden bg-[#1E1E22] border border-[#2D2D35] hover:border-emerald-500/60 cursor-pointer group shadow-2xl transition-all"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[340px]">
            {/* Left Vector App Emblem Visual Stage */}
            <div className="md:col-span-6 relative p-8 flex flex-col justify-between overflow-hidden bg-[#131916] border-b md:border-b-0 md:border-r border-[#2D2D35]">
              {/* Glow backdrop */}
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-teal-600/10 blur-3xl pointer-events-none" />

              {/* Top status */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                  <TrendingUp className="w-3 h-3" />
                  <span>Tiêu điểm Ứng Dụng • ĐANG CHỌN</span>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1A2620] border border-[#283C33] text-[10px] font-mono text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Sẵn sàng chạy</span>
                </div>
              </div>

              {/* Center App Icon Emblem */}
              <div className="relative z-10 my-6 flex items-center gap-5">
                <div className="w-20 h-20 rounded-3xl bg-[#1A2621] border border-emerald-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)] group-hover:scale-105 transition-transform">
                  {currentApp.icon}
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono block">
                    {currentApp.category}
                  </span>
                  <h3 className="text-2xl font-black text-white group-hover:text-emerald-300 transition-colors">
                    {currentApp.name}
                  </h3>
                  <span className="text-xs font-semibold text-zinc-300">
                    {currentApp.tagline}
                  </span>
                </div>
              </div>

              {/* Bottom Tags */}
              <div className="relative z-10 flex items-center gap-2 flex-wrap">
                {currentApp.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-[#19241F] border border-[#293D33] text-[11px] font-medium text-emerald-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Content Details & Actions */}
            <div className="md:col-span-6 p-6 md:p-8 flex flex-col justify-between bg-[#191A20]">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                    TỔNG QUAN TÍNH NĂNG
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {currentApp.badge}
                  </span>
                </div>

                <p className="text-xs md:text-sm text-[#9CA3AF] mt-3 leading-relaxed">
                  {currentApp.description}
                </p>

                <div className="mt-4 p-3.5 rounded-2xl bg-[#14141A] border border-[#2D2D35] flex items-center gap-2.5 text-xs text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Tương thích hoàn toàn với chế độ đa nhiệm và phím tắt Vplay.</span>
                </div>
              </div>

              {/* Bottom Quick Launch Action */}
              <div className="pt-5 mt-4 border-t border-[#2A2A30] flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-zinc-400">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Trực tuyến</span>
                </div>

                <div className="flex items-center gap-2 text-emerald-300 font-bold group-hover:translate-x-1 transition-transform">
                  <span>Khởi chạy ứng dụng ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CATEGORY PILLS (News style) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                playPopSound();
                setSelectedCategory(cat);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-purple-active text-white shadow-md glow-purple-sm font-bold'
                  : 'bg-[#1E1E22] text-[#A1A1AA] hover:text-white border border-[#32323A]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 4. APP CARDS GRID (Clean Vector Headers - No Placeholder Images) */}
      {selectedCategory !== 'Đang mở' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => {
            const isCurrent = activeApp === app.id;
            return (
              <div
                key={app.id}
                onClick={() => handleSelectApp(app.id)}
                className={`group rounded-[28px] bg-[#1E1E22] border transition-all overflow-hidden flex flex-col justify-between cursor-pointer shadow-lg hover:scale-[1.01] ${
                  isCurrent
                    ? 'border-emerald-500/70 ring-2 ring-emerald-500/30 bg-[#1c2420]'
                    : 'border-[#2D2D35] hover:border-emerald-500/60 hover:bg-[#25252C]'
                }`}
              >
                {/* Styled Vector Header */}
                <div className={`p-6 pb-4 border-b border-[#2A2A32] bg-gradient-to-br ${app.themeGradient} relative overflow-hidden`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/40 border border-white/10 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                      {app.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono font-black text-emerald-300">
                      {app.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-[#141A17] border border-white/10 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      {app.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug line-clamp-1">
                        {app.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-emerald-400 line-clamp-1">
                        {app.tagline}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed">
                    {app.description}
                  </p>

                  {/* Metadata Footer */}
                  <div className="mt-5 pt-3 border-t border-[#2A2A30] flex items-center justify-between text-xs text-[#8E8E93]">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{app.tags[0]}</span>
                    </div>

                    <div className="flex items-center gap-1 font-bold text-white group-hover:text-emerald-300">
                      <span>Mở App</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. ACTIVE APP EXECUTION ENGINE */}
      <div 
        id="active-app-execution-container" 
        className={`overflow-hidden border border-[#2D2D35] shadow-2xl bg-[#18191C] ${
          activeApp === 'v_minecraft' ? 'rounded-none border-2 border-[#444]' : 'rounded-[30px]'
        }`}
      >
        {/* App Top Toolbar */}
        <div className={`px-6 py-4 border-b border-[#2D2D35] bg-[#1E1E22] flex items-center justify-between ${
          activeApp === 'v_minecraft' ? 'rounded-none' : ''
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 bg-[#2D2D35] flex items-center justify-center text-emerald-300 ${
              activeApp === 'v_minecraft' ? 'rounded-none' : 'rounded-xl'
            }`}>
              {currentApp.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{currentApp.name}</span>
                <span className={`text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 ${
                  activeApp === 'v_minecraft' ? 'rounded-none font-mono' : 'rounded-full'
                }`}>
                  {currentApp.badge}
                </span>
              </h3>
              <p className="text-[11px] text-[#9CA3AF]">{currentApp.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const el = document.getElementById('waves-vapps-view');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-3.5 py-1.5 bg-[#2A2A35] hover:bg-[#3A3A48] text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeApp === 'v_minecraft' ? 'rounded-none' : 'rounded-full'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
              <span>Xem Kho App</span>
            </button>
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
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
