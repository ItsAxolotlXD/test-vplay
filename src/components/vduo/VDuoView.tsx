import React, { useState } from 'react';
import { 
  Columns2, 
  ArrowLeftRight, 
  Maximize2, 
  X, 
  Tv, 
  ShoppingBag, 
  Car, 
  Gauge, 
  Bot, 
  Newspaper, 
  FileText, 
  Gamepad2, 
  Calculator, 
  CloudSun, 
  Compass, 
  Globe, 
  ChevronDown,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { Channel } from '../../types';
import { LiveTV } from '../../pages/LiveTV';
import { VShopTab } from '../../pages/VShopTab';
import { VRideBookingTab } from '../vapps/VRideBookingTab';
import { DrivingSimulatorTab } from '../vapps/DrivingSimulatorTab';
import { CopilotTab } from '../CopilotTab';
import { NewsView } from '../NewsView';
import { VNotesView } from '../VNotesView';
import { VArcadeTab } from '../vapps/VArcadeTab';
import { VCalcTab } from '../vapps/VCalcTab';
import { VWeatherTab } from '../vapps/VWeatherTab';
import { VBrowserTab } from '../vapps/VBrowserTab';
import { VMapsTab } from '../vapps/VMapsTab';
import { playPopSound } from '../../utils/sound';

interface VDuoViewProps {
  channels?: Channel[];
  onSelectChannel?: (channel: Channel) => void;
  navigate?: (route: string) => void;
  onCloseVDuo?: () => void;
  initialLeftApp?: VDuoAppId;
  initialRightApp?: VDuoAppId;
}

export type VDuoAppId = 
  | 'tv' 
  | 'shop' 
  | 'ride' 
  | 'driving' 
  | 'copilot' 
  | 'news' 
  | 'notes' 
  | 'arcade' 
  | 'calc' 
  | 'weather' 
  | 'browser'
  | 'maps';

interface AppOption {
  id: VDuoAppId;
  label: string;
  icon: any;
  color: string;
}

const DUO_APPS: AppOption[] = [
  { id: 'tv', label: 'Truyền hình TV', icon: Tv, color: 'text-red-400' },
  { id: 'shop', label: 'V-Shop', icon: ShoppingBag, color: 'text-pink-400' },
  { id: 'ride', label: 'Đặt xe 360', icon: Car, color: 'text-cyan-400' },
  { id: 'driving', label: 'Driving Simulator', icon: Gauge, color: 'text-amber-400' },
  { id: 'copilot', label: 'Trợ lý Copilot', icon: Bot, color: 'text-purple-400' },
  { id: 'news', label: 'Tin tức', icon: Newspaper, color: 'text-emerald-400' },
  { id: 'notes', label: 'Ghi chú', icon: FileText, color: 'text-yellow-400' },
  { id: 'arcade', label: 'Games Arcade', icon: Gamepad2, color: 'text-orange-400' },
  { id: 'calc', label: 'Máy tính', icon: Calculator, color: 'text-blue-400' },
  { id: 'weather', label: 'Thời tiết', icon: CloudSun, color: 'text-sky-400' },
  { id: 'browser', label: 'Trình duyệt', icon: Globe, color: 'text-violet-400' },
  { id: 'maps', label: 'Bản đồ', icon: Compass, color: 'text-teal-400' },
];

export const VDuoView: React.FC<VDuoViewProps> = ({
  channels = [],
  onSelectChannel = () => {},
  navigate = () => {},
  onCloseVDuo,
  initialLeftApp = 'tv',
  initialRightApp = 'shop'
}) => {
  const [leftApp, setLeftApp] = useState<VDuoAppId>(initialLeftApp);
  const [rightApp, setRightApp] = useState<VDuoAppId>(initialRightApp);
  const [splitRatio, setSplitRatio] = useState<'50-50' | '70-30' | '30-70'>('50-50');
  const [fullscreenPane, setFullscreenPane] = useState<'left' | 'right' | null>(null);
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');

  const handleSwapPanes = () => {
    playPopSound();
    const temp = leftApp;
    setLeftApp(rightApp);
    setRightApp(temp);
  };

  const renderAppContent = (appId: VDuoAppId, pane: 'left' | 'right') => {
    switch (appId) {
      case 'tv':
        return (
          <div className="w-full h-full overflow-y-auto custom-scrollbar p-2 sm:p-4">
            <LiveTV 
              channels={channels}
              onSelectChannel={onSelectChannel}
            />
          </div>
        );
      case 'shop':
        return (
          <div className="w-full h-full overflow-y-auto custom-scrollbar p-2 sm:p-4">
            <VShopTab navigate={navigate} />
          </div>
        );
      case 'ride':
        return (
          <div className="w-full h-full overflow-y-auto custom-scrollbar p-2 sm:p-4">
            <VRideBookingTab navigate={navigate} />
          </div>
        );
      case 'driving':
        return (
          <div className="w-full h-full overflow-y-auto custom-scrollbar p-2 sm:p-4">
            <DrivingSimulatorTab navigate={navigate} />
          </div>
        );
      case 'copilot':
        return (
          <div className="w-full h-full overflow-y-auto custom-scrollbar p-2 sm:p-4">
            <CopilotTab />
          </div>
        );
      case 'news':
        return (
          <div className="w-full h-full overflow-y-auto custom-scrollbar p-2 sm:p-4">
            <NewsView
              onNavigateToLive={() => navigate?.('/live')}
              onNavigateToSettings={() => navigate?.('/settings')}
              triggerToast={() => {}}
            />
          </div>
        );
      case 'notes':
        return (
          <div className="w-full h-full overflow-y-auto custom-scrollbar p-2 sm:p-4">
            <VNotesView />
          </div>
        );
      case 'arcade':
        return (
          <div className="w-full h-full overflow-y-auto custom-scrollbar p-2 sm:p-4">
            <VArcadeTab />
          </div>
        );
      case 'calc':
        return (
          <div className="w-full h-full overflow-y-auto custom-scrollbar p-2 sm:p-4">
            <VCalcTab />
          </div>
        );
      case 'weather':
        return (
          <div className="w-full h-full overflow-y-auto custom-scrollbar p-2 sm:p-4">
            <VWeatherTab />
          </div>
        );
      case 'browser':
        return (
          <div className="w-full h-full overflow-y-auto custom-scrollbar p-2 sm:p-4">
            <VBrowserTab />
          </div>
        );
      case 'maps':
        return (
          <div className="w-full h-full overflow-y-auto custom-scrollbar p-2 sm:p-4">
            <VMapsTab />
          </div>
        );
      default:
        return null;
    }
  };

  const getLeftFlexClass = () => {
    if (fullscreenPane === 'left') return 'w-full h-full';
    if (fullscreenPane === 'right') return 'hidden';
    if (splitRatio === '70-30') return 'lg:w-[70%] w-full';
    if (splitRatio === '30-70') return 'lg:w-[30%] w-full';
    return 'lg:w-1/2 w-full';
  };

  const getRightFlexClass = () => {
    if (fullscreenPane === 'right') return 'w-full h-full';
    if (fullscreenPane === 'left') return 'hidden';
    if (splitRatio === '70-30') return 'lg:w-[30%] w-full';
    if (splitRatio === '30-70') return 'lg:w-[70%] w-full';
    return 'lg:w-1/2 w-full';
  };

  return (
    <div className="w-full min-h-[85vh] flex flex-col space-y-3 pb-16 select-none animate-in fade-in">
      {/* V-Duo Top Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-3xl bg-zinc-900/95 border border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Columns2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                V-Duo • Đa Nhiệm Chia Đôi Màn Hình
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                DUAL SCREEN
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Vừa xem TV vừa mua sắm, lái xe mô phỏng, ghi chú hoặc chat cùng lúc
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Preset Ratio Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-zinc-800/80 border border-white/10 text-xs font-bold text-zinc-300">
            <button
              onClick={() => {
                setSplitRatio('50-50');
                setFullscreenPane(null);
              }}
              className={`px-2.5 py-1 rounded-xl transition-colors cursor-pointer ${
                splitRatio === '50-50' && !fullscreenPane ? 'bg-white text-black shadow' : 'hover:text-white'
              }`}
            >
              50 : 50
            </button>
            <button
              onClick={() => {
                setSplitRatio('70-30');
                setFullscreenPane(null);
              }}
              className={`px-2.5 py-1 rounded-xl transition-colors cursor-pointer ${
                splitRatio === '70-30' && !fullscreenPane ? 'bg-white text-black shadow' : 'hover:text-white'
              }`}
            >
              70 : 30
            </button>
            <button
              onClick={() => {
                setSplitRatio('30-70');
                setFullscreenPane(null);
              }}
              className={`px-2.5 py-1 rounded-xl transition-colors cursor-pointer ${
                splitRatio === '30-70' && !fullscreenPane ? 'bg-white text-black shadow' : 'hover:text-white'
              }`}
            >
              30 : 70
            </button>
          </div>

          {/* Swap Sides Button */}
          <button
            onClick={handleSwapPanes}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-white transition-all cursor-pointer"
            title="Đổi chỗ 2 màn hình"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hoán đổi</span>
          </button>

          {/* Close V-Duo */}
          {onCloseVDuo && (
            <button
              onClick={onCloseVDuo}
              className="p-2 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-colors cursor-pointer"
              title="Đóng chế độ chia đôi"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Split Body */}
      <div className={`w-full flex-1 flex flex-col lg:flex-row gap-4 h-[78vh] min-h-[600px]`}>
        {/* LEFT PANE */}
        <div className={`${getLeftFlexClass()} flex flex-col rounded-3xl border border-white/15 bg-zinc-950/80 shadow-2xl overflow-hidden transition-all duration-300`}>
          {/* Pane Header: App Selector & Pane Controls */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-900/90 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                MÀN HÌNH 1
              </span>
              <select
                value={leftApp}
                onChange={(e) => {
                  playPopSound();
                  setLeftApp(e.target.value as VDuoAppId);
                }}
                className="bg-zinc-800 text-white font-bold text-xs px-2.5 py-1.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                {DUO_APPS.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFullscreenPane(fullscreenPane === 'left' ? null : 'left')}
                className={`p-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                  fullscreenPane === 'left' ? 'bg-cyan-500 text-black' : 'text-zinc-400 hover:text-white bg-white/5'
                }`}
                title="Phóng to màn hình này"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Pane Content */}
          <div className="flex-1 min-h-0 relative overflow-hidden">
            {renderAppContent(leftApp, 'left')}
          </div>
        </div>

        {/* RIGHT PANE */}
        <div className={`${getRightFlexClass()} flex flex-col rounded-3xl border border-white/15 bg-zinc-950/80 shadow-2xl overflow-hidden transition-all duration-300`}>
          {/* Pane Header: App Selector & Pane Controls */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-900/90 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-pink-500/20 text-pink-300 border border-pink-500/30">
                MÀN HÌNH 2
              </span>
              <select
                value={rightApp}
                onChange={(e) => {
                  playPopSound();
                  setRightApp(e.target.value as VDuoAppId);
                }}
                className="bg-zinc-800 text-white font-bold text-xs px-2.5 py-1.5 rounded-xl border border-white/10 focus:outline-none focus:border-pink-400 cursor-pointer"
              >
                {DUO_APPS.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFullscreenPane(fullscreenPane === 'right' ? null : 'right')}
                className={`p-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                  fullscreenPane === 'right' ? 'bg-pink-500 text-black' : 'text-zinc-400 hover:text-white bg-white/5'
                }`}
                title="Phóng to màn hình này"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Pane Content */}
          <div className="flex-1 min-h-0 relative overflow-hidden">
            {renderAppContent(rightApp, 'right')}
          </div>
        </div>
      </div>
    </div>
  );
};
