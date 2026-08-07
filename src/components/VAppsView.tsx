import React, { useState, useEffect } from 'react';
import { playPopSound } from '../utils/sound';
import { VplayPrimaryButton } from './ui/VplayPrimaryButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { VplayTab } from './ui/VplayTab';
import ExploreVietnamTab from './ExploreVietnamTab';
import VplayVBoxTab from './VplayVBoxTab';
import VStudyTab from './VStudyTab';
import { VCalcTab, VRemindersTab, VXploreTab } from './vapps';
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
  X,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Compass,
} from 'lucide-react';

export type VAppId = 'v_xplore' | 'explore_vietnam' | 'v_box' | 'v_learn' | 'v_calc' | 'v_reminders' | 'v_notes';

interface VAppDefinition {
  id: VAppId;
  name: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  badge?: string;
}

const VAPPS_LIST: VAppDefinition[] = [
  {
    id: 'v_xplore',
    name: 'V-Xplore',
    tagline: 'File Explorer Ore UI',
    description: 'Quản lý tệp phong cách Windows Explorer, xem trước media, sao lưu M3U8 và V-Cloud.',
    icon: <Folder className="w-6 h-6 text-purple-400" />,
    color: 'border-purple-500 bg-purple-950/40',
    badge: 'Explorer',
  },
  {
    id: 'explore_vietnam',
    name: 'Explore Vietnam',
    tagline: 'Khám phá 63 tỉnh thành',
    description: 'Bản đồ tương tác, ẩm thực, danh lam thắng cảnh và bản sắc văn hóa Việt Nam.',
    icon: <MapPin className="w-6 h-6 text-emerald-400" />,
    color: 'border-emerald-500 bg-emerald-950/40',
    badge: 'Kham Pha',
  },
  {
    id: 'v_box',
    name: 'V-Box',
    tagline: 'Trung tâm giải trí & Vplay Hub',
    description: 'Tổng hợp kho video, phim ảnh, tiện ích truyền hình đa nền tảng.',
    icon: <Tv className="w-6 h-6 text-sky-400" />,
    color: 'border-sky-500 bg-sky-950/40',
    badge: 'Media Hub',
  },
  {
    id: 'v_learn',
    name: 'V-Learn (VStudy)',
    tagline: 'Nền tảng học tập & CEFR',
    description: 'Luyện thi Tiếng Anh CEFR, làm đề Ngữ Văn và kho tài liệu học tập toàn diện.',
    icon: <GraduationCap className="w-6 h-6 text-amber-400" />,
    color: 'border-amber-500 bg-amber-950/40',
    badge: 'Hoc Tap',
  },
  {
    id: 'v_calc',
    name: 'V-Calc',
    tagline: 'Máy tính Ore UI',
    description: 'Công cụ tính toán tài chính, khoa học, đổi đơn vị chuẩn giao diện Ore UI.',
    icon: <Calculator className="w-6 h-6 text-purple-400" />,
    color: 'border-purple-500 bg-purple-950/40',
    badge: 'Utility',
  },
  {
    id: 'v_reminders',
    name: 'V-Reminders',
    tagline: 'Nhắc lịch & Đếm ngược',
    description: 'Quản lý thời gian, lịch phát sóng TV, nhắc nhở công việc và sự kiện.',
    icon: <Bell className="w-6 h-6 text-rose-400" />,
    color: 'border-rose-500 bg-rose-950/40',
    badge: 'Lich Trinh',
  },
  {
    id: 'v_notes',
    name: 'V-Notes',
    tagline: 'Sổ tay ghi chú M3U8',
    description: 'Lưu lại danh sách kênh TV, ghi chú cá nhân và liên kết phát truyền hình.',
    icon: <StickyNote className="w-6 h-6 text-emerald-300" />,
    color: 'border-emerald-400 bg-emerald-900/40',
    badge: 'So Tay',
  },
];

interface VAppsViewProps {
  initialApp?: VAppId;
}

export const VAppsView: React.FC<VAppsViewProps> = ({ initialApp = 'v_xplore' }) => {
  const [activeApp, setActiveApp] = useState<VAppId>(initialApp);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const currentApp = VAPPS_LIST.find((a) => a.id === activeApp) || VAPPS_LIST[0];

  const handleSelectApp = (appId: VAppId) => {
    playPopSound();
    setActiveApp(appId);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 select-none">
      {/* TOP CONTROL BAR: APP HEADER BADGE */}
      <div className="bg-[#2d2f32] border-2 border-[#141414] p-3 shadow-xl flex items-center justify-between gap-3">
        {/* Left: Current Active App Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#28960b] border-2 border-[#141414] flex items-center justify-center text-white shrink-0 shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]">
            {currentApp.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider font-jura">
                V-APPS: {currentApp.name.toUpperCase()}
              </h2>
              <span className="bg-[#89dc69] text-[#141414] px-2 py-0.5 text-[10px] font-bold font-mono border border-[#141414]">
                {currentApp.badge}
              </span>
            </div>
            <p className="text-[11px] text-zinc-300 font-jura">{currentApp.tagline}</p>
          </div>
        </div>
      </div>

      {/* QUICK HORIZONTAL SUB-APP SELECTOR TABS */}
      <div className="bg-[#35383b] border-2 border-[#141414] p-2 shadow-md flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {VAPPS_LIST.map((app) => (
          <VplayTab
            key={app.id}
            active={activeApp === app.id}
            onClick={() => {
              playPopSound();
              setActiveApp(app.id);
            }}
            className="!py-1.5 !px-3 text-xs shrink-0 whitespace-nowrap"
          >
            <span className="flex items-center gap-1.5">
              <span className="scale-75 shrink-0">{app.icon}</span>
              <span>{app.name}</span>
            </span>
          </VplayTab>
        ))}
      </div>

      {/* MAIN RENDER AREA FOR SELECTED APP */}
      <div className="min-h-[500px]">
        {activeApp === 'v_xplore' && <VXploreTab />}
        {activeApp === 'explore_vietnam' && <ExploreVietnamTab />}
        {activeApp === 'v_box' && <VplayVBoxTab />}
        {activeApp === 'v_learn' && <VStudyTab />}
        {activeApp === 'v_calc' && <VCalcTab />}
        {activeApp === 'v_reminders' && <VRemindersTab />}
        {activeApp === 'v_notes' && <VNotesView />}
      </div>


      {/* ORE UI POPUP MODAL FOR SELECTING V-APPS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[99990] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />

          {/* Modal Content Box */}
          <div className="relative z-10 w-full max-w-3xl bg-[#2b2d30] border-4 border-[#141414] shadow-[0_12px_36px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header Bar */}
            <div className="bg-[#1f2022] border-b-2 border-[#141414] p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#28960b] border border-[#141414] flex items-center justify-center text-white shadow-[inset_1px_1px_0_#89dc69]">
                  <Grid className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-white uppercase tracking-wider font-jura">
                    DANH SÁCH ỨNG DỤNG V-APPS (ORE UI)
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-mono">Chọn ứng dụng để khởi chạy trong Vplay Suite</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 bg-[#c6c6c6] hover:bg-rose-600 hover:text-white text-[#141414] font-bold border-2 border-[#141414] flex items-center justify-center shadow-[inset_2px_2px_0_#ffffff,inset_-2px_-2px_0_#898d91] active:translate-y-[1px]"
                title="Đóng cửa sổ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Apps Grid */}
            <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {VAPPS_LIST.map((app) => {
                  const isSelected = activeApp === app.id;

                  return (
                    <div
                      key={app.id}
                      onClick={() => handleSelectApp(app.id)}
                      className={`
                        group relative border-2 p-4 cursor-pointer transition-none flex flex-col justify-between space-y-3 shadow-lg select-none active:translate-y-[1px]
                        ${
                          isSelected
                            ? 'bg-[#28960b] text-white border-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]'
                            : 'bg-[#35383b] hover:bg-[#414549] text-white border-[#141414] hover:border-emerald-400 shadow-[inset_2px_2px_0_#4a4e52,inset_-2px_-2px_0_#1e2022]'
                        }
                      `}
                    >
                      <div>
                        {/* App Icon & Badge */}
                        <div className="flex items-center justify-between mb-2">
                          <div
                            className={`p-2.5 border-2 border-[#141414] ${
                              isSelected ? 'bg-black/30' : 'bg-[#1f2022]'
                            }`}
                          >
                            {app.icon}
                          </div>
                          <span
                            className={`text-[9px] font-bold font-mono px-2 py-0.5 border border-[#141414] ${
                              isSelected
                                ? 'bg-black/40 text-white'
                                : 'bg-[#28960b] text-white'
                            }`}
                          >
                            {app.badge}
                          </span>
                        </div>

                        {/* Title & Tagline */}
                        <h4 className="font-bold text-sm font-jura tracking-wide group-hover:text-emerald-300">
                          {app.name}
                        </h4>
                        <p className="text-[11px] text-zinc-300 font-mono mt-0.5">{app.tagline}</p>

                        {/* Description */}
                        <p className="text-[10px] text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                          {app.description}
                        </p>
                      </div>

                      {/* Launch Action Footer */}
                      <div className="pt-2 border-t border-black/20 flex items-center justify-between text-[11px] font-bold font-mono text-emerald-400">
                        <span>{isSelected ? 'Đang mở ★' : 'Khởi chạy'}</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#1f2022] border-t-2 border-[#141414] p-3 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Vplay Ore UI System • 6 Apps khả dụng</span>
              </span>
              <VplaySecondaryButton
                onClick={() => setIsModalOpen(false)}
                fullWidth={false}
                className="!py-1 !px-3 text-xs"
              >
                Đóng
              </VplaySecondaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
