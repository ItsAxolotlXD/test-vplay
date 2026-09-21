import React from 'react';
import { RotateCcw, ArrowLeft, Sparkles, Clock, Plus, HelpCircle, Layers, Disc } from 'lucide-react';
import { WheelOfFortuneGame } from '../vapps/WheelOfFortuneGame';

interface WheelOfFortuneToolProps {
  onBack?: () => void;
  navigate?: (route: string) => void;
}

export const WheelOfFortuneTool: React.FC<WheelOfFortuneToolProps> = ({
  onBack,
  navigate
}) => {
  return (
    <div className="min-h-screen text-slate-100 flex flex-col pb-16 space-y-6">
      {/* Top Header / Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-[28px] bg-[#1A1A20] border border-white/10 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-all cursor-pointer flex items-center justify-center shrink-0"
              title="Quay lại"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
              <Disc className="w-3.5 h-3.5" />
              <span>Toolbox & Tiện Ích Tương Tác</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[9px]">
                CUSTOM SPINNER
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
              <span>Wheels of Fortune (Vòng Quay May Mắn)</span>
            </h1>
            <p className="text-xs text-white/60 mt-1 line-clamp-1">
              Tự tạo vòng quay ngẫu nhiên theo chủ đề riêng, thêm bớt ô thưởng, chọn màu sắc và tự do tùy chỉnh thời gian quay.
            </p>
          </div>
        </div>

        {/* Action pills */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {navigate && (
            <button
              onClick={() => navigate('/toolbox')}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Mở Trong Toolbox</span>
            </button>
          )}
        </div>
      </div>

      {/* Embedded Full Feature Wheel Of Fortune Component */}
      <div className="rounded-[30px] overflow-hidden border border-white/10 shadow-2xl bg-[#121216]">
        <WheelOfFortuneGame />
      </div>
    </div>
  );
};
