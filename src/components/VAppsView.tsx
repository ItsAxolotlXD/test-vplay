import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playPopSound } from '../utils/sound';
import ExploreVietnamTab from './ExploreVietnamTab';
import VplayVBoxTab from './VplayVBoxTab';
import VStudyTab from './VStudyTab';
import { VArcadeTab, VCalcTab, VRemindersTab, VXploreTab, VFurnitureTab } from './vapps';
import { VNotesView } from './VNotesView';
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
  | 'v_furniture';

interface VAppDefinition {
  id: VAppId;
  name: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  badge: string;
  category: 'game' | 'utility' | 'learning' | 'media';
}

const VAPPS_LIST: VAppDefinition[] = [
  {
    id: 'v_arcade',
    name: 'V-Arcade',
    tagline: '5 Trò Chơi Ore UI',
    description: 'Caro XO, Oẳn Tù Tì, Nối Từ Tiếng Việt & Anh, Đếm Số 1->N và Rắn Săn Mồi đấu với NPC!',
    icon: <Gamepad2 className="w-6 h-6 text-emerald-400" />,
    color: 'border-emerald-500/30 shadow-emerald-500/10',
    gradient: 'from-emerald-500/20 via-teal-900/30 to-cyan-900/30',
    badge: 'Hot • 5 Trò',
    category: 'game',
  },
  {
    id: 'v_xplore',
    name: 'V-Files',
    tagline: 'File Explorer Ore UI',
    description: 'Quản lý tệp phong cách Windows Explorer, xem trước media, sao lưu M3U8 và V-Cloud.',
    icon: <Folder className="w-6 h-6 text-purple-400" />,
    color: 'border-purple-500/30 shadow-purple-500/10',
    gradient: 'from-purple-500/20 via-indigo-900/30 to-blue-900/30',
    badge: 'Tệp tin',
    category: 'utility',
  },
  {
    id: 'explore_vietnam',
    name: 'Explore VN',
    tagline: 'Khám phá 63 tỉnh thành',
    description: 'Bản đồ tương tác, ẩm thực, danh lam thắng cảnh và bản sắc văn hóa Việt Nam.',
    icon: <MapPin className="w-6 h-6 text-rose-400" />,
    color: 'border-rose-500/30 shadow-rose-500/10',
    gradient: 'from-rose-500/20 via-red-900/30 to-orange-900/30',
    badge: 'Du lịch',
    category: 'learning',
  },
  {
    id: 'v_box',
    name: 'V-Box',
    tagline: 'Kho Video & Truyền Hình',
    description: 'Bộ sưu tập video đặc sắc, các clip phát lại và nội dung giải trí chọn lọc.',
    icon: <Tv className="w-6 h-6 text-amber-400" />,
    color: 'border-amber-500/30 shadow-amber-500/10',
    gradient: 'from-amber-500/20 via-orange-900/30 to-yellow-900/30',
    badge: 'Giải trí',
    category: 'media',
  },
  {
    id: 'v_learn',
    name: 'V-Study',
    tagline: 'Học tập & Flashcard',
    description: 'Công cụ ôn tập bài học, đồng hồ Pomodoro, quản lý flashcard và mục tiêu học tập.',
    icon: <GraduationCap className="w-6 h-6 text-sky-400" />,
    color: 'border-sky-500/30 shadow-sky-500/10',
    gradient: 'from-sky-500/20 via-blue-900/30 to-indigo-900/30',
    badge: 'Học tập',
    category: 'learning',
  },
  {
    id: 'v_calc',
    name: 'V-Calc',
    tagline: 'Máy tính biểu thức',
    description: 'Máy tính bỏ túi khoa học hỗ trợ tính biểu thức phức tạp và chuyển đổi đơn vị.',
    icon: <Calculator className="w-6 h-6 text-cyan-400" />,
    color: 'border-cyan-500/30 shadow-cyan-500/10',
    gradient: 'from-cyan-500/20 via-teal-900/30 to-blue-900/30',
    badge: 'Tiện ích',
    category: 'utility',
  },
  {
    id: 'v_reminders',
    name: 'V-Reminders',
    tagline: 'Hẹn giờ & Nhắc việc',
    description: 'Lên lịch nhắc nhở xem chương trình TV, công việc quan trọng với chuông báo âm thanh.',
    icon: <Bell className="w-6 h-6 text-orange-400" />,
    color: 'border-orange-500/30 shadow-orange-500/10',
    gradient: 'from-orange-500/20 via-amber-900/30 to-red-900/30',
    badge: 'Nhắc nhở',
    category: 'utility',
  },
  {
    id: 'v_notes',
    name: 'V-Notes',
    tagline: 'Ghi chú nhanh',
    description: 'Soạn thảo văn bản ghi chú với định dạng màu sắc, sticky notes và tìm kiếm thông minh.',
    icon: <StickyNote className="w-6 h-6 text-yellow-400" />,
    color: 'border-yellow-500/30 shadow-yellow-500/10',
    gradient: 'from-yellow-500/20 via-amber-900/30 to-orange-900/30',
    badge: 'Ghi chép',
    category: 'utility',
  },
  {
    id: 'v_furniture',
    name: 'V-Furniture',
    tagline: 'Thiết kế không gian',
    description: 'Trải nghiệm không gian nội thất, bài trí phòng xem TV và thư giãn 3D.',
    icon: <Armchair className="w-6 h-6 text-lime-400" />,
    color: 'border-lime-500/30 shadow-lime-500/10',
    gradient: 'from-lime-500/20 via-emerald-900/30 to-teal-900/30',
    badge: 'Nội thất',
    category: 'utility',
  },
];

interface VAppsViewProps {
  initialAppId?: VAppId;
  selectedGameId?: string | null;
}

export const VAppsView: React.FC<VAppsViewProps> = ({
  initialAppId = 'v_arcade',
  selectedGameId = null,
}) => {
  const [activeApp, setActiveApp] = useState<VAppId>(initialAppId);
  const [isGridModalOpen, setIsGridModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const currentApp = VAPPS_LIST.find((a) => a.id === activeApp) || VAPPS_LIST[0];

  const handleSelectApp = (appId: VAppId) => {
    playPopSound();
    setActiveApp(appId);
    setIsGridModalOpen(false);
  };

  const filteredApps = VAPPS_LIST.filter(
    (app) =>
      app.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      app.tagline.toLowerCase().includes(searchFilter.toLowerCase()) ||
      app.description.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div
      id="waves-vapps-view"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 space-y-6 animate-fade-in relative text-left"
    >
      {/* Dynamic ambient glass glow in background */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Glassmorphism Top Banner */}
      <div className="relative rounded-3xl bg-white/[0.08] backdrop-blur-[24px] saturate-[180%] border border-white/20 p-5 sm:p-7 shadow-[0_12px_40px_0_rgba(0,0,0,0.35),inset_0.5px_0.5px_0px_rgba(255,255,255,0.4)] flex flex-col md:flex-row md:items-center justify-between gap-5 overflow-hidden">
        {/* Glow corner accent */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Current Active App Meta Header */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-inner shrink-0 group">
            {currentApp.icon}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {currentApp.name}
              </h1>
              <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-white/15 border border-white/20 text-white/90 shadow-sm uppercase tracking-wider">
                {currentApp.badge}
              </span>
              <span className="text-xs text-indigo-300 font-semibold">
                • {currentApp.tagline}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-xl line-clamp-1 font-sans">
              {currentApp.description}
            </p>
          </div>
        </div>

        {/* Action Buttons: App Drawer button */}
        <div className="relative z-10 flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            onClick={() => {
              playPopSound();
              setIsGridModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600/80 to-purple-600/80 hover:from-indigo-500 hover:to-purple-500 border border-white/20 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-[0_4px_20px_rgba(99,102,241,0.3),inset_0.5px_0.5px_0px_rgba(255,255,255,0.4)] cursor-pointer active:scale-95"
            title="Mở toàn bộ kho ứng dụng"
          >
            <LayoutGrid className="w-4 h-4 text-sky-300" />
            <span>Kho V-Space ({VAPPS_LIST.length})</span>
          </button>
        </div>
      </div>

      {/* Horizontal Liquid Glass Tabs Bar */}
      <div className="relative rounded-2xl bg-white/[0.07] backdrop-blur-[20px] saturate-[180%] border border-white/15 p-2 shadow-[0_8px_30px_rgba(0,0,0,0.25),inset_0.5px_0.5px_0px_rgba(255,255,255,0.3)]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {VAPPS_LIST.map((app) => {
            const isActive = activeApp === app.id;
            return (
              <button
                key={app.id}
                onClick={() => handleSelectApp(app.id)}
                className={`relative px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeVAppPill"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    className="absolute inset-0 bg-white/20 border border-white/30 rounded-xl shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.6),0_4px_15px_rgba(0,0,0,0.3)] -z-10"
                  />
                )}
                <span className="shrink-0 scale-90">{app.icon}</span>
                <span>{app.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content View with Fluid Motion Transition */}
      <div className="min-h-[550px] w-full">
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
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pure Glassmorphism App Grid Drawer Modal */}
      {isGridModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setIsGridModalOpen(false)} />
          <div className="relative z-10 w-full max-w-4xl rounded-3xl bg-[#181424]/95 backdrop-blur-[30px] border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0.5px_0.5px_0px_rgba(255,255,255,0.4)] p-6 sm:p-8 text-white flex flex-col max-h-[88vh] overflow-hidden text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-inner">
                  <Grid className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-wide">Kho Tiện Ích & Ứng Dụng V-Space</h2>
                  <p className="text-xs text-white/60">Chọn ứng dụng để mở trực tiếp trong giao diện Waves</p>
                </div>
              </div>
              <button
                onClick={() => {
                  playPopSound();
                  setIsGridModalOpen(false);
                }}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
                title="Đóng (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search filter in modal */}
            <div className="relative mb-5">
              <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm ứng dụng, công cụ, trò chơi..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-white/[0.08] border border-white/15 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-indigo-400 focus:bg-white/[0.12] transition-all"
                autoFocus
              />
            </div>

            {/* Grid of Apps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-1">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => handleSelectApp(app.id)}
                  className={`group rounded-2xl p-5 bg-gradient-to-br ${app.gradient} backdrop-blur-[20px] border ${app.color} hover:border-white/40 hover:scale-[1.02] transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-lg relative overflow-hidden`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform">
                      {app.icon}
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-white/90 uppercase tracking-wider">
                      {app.badge}
                    </span>
                  </div>
                  <div className="mb-3">
                    <h3 className="font-bold text-sm text-white group-hover:text-indigo-200 transition-colors flex items-center gap-1.5">
                      {app.name}
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-300" />
                    </h3>
                    <p className="text-xs text-white/65 mt-1 line-clamp-2 leading-relaxed font-sans">
                      {app.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                    <span>{app.tagline}</span>
                    <span className="text-indigo-300 font-semibold group-hover:underline">Khởi chạy</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
