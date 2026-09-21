import React, { useState, useRef } from "react";
import { ArrowLeft, Compass, ZoomIn, ZoomOut, RotateCcw, Grab, MapPin, Sparkles } from "lucide-react";
import { playPopSound } from "../utils/sound";

interface ExploreVietnamTabProps {
  onBack?: () => void;
}

export default function ExploreVietnamTab({ onBack }: ExploreVietnamTabProps) {
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const mapImageUrl = "https://media-cdn-v2.laodong.vn/storage/newsportal/2025/6/12/1522524/Ban-Do-34-Tinh-2.jpg";

  // Handle Zoom buttons
  const handleZoomIn = () => {
    playPopSound();
    setScale((prev) => Math.min(prev + 0.25, 4));
  };

  const handleZoomOut = () => {
    playPopSound();
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    playPopSound();
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Drag and Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 0.1;
    const direction = e.deltaY < 0 ? 1 : -1;
    setScale((prev) => {
      const nextScale = prev + direction * zoomFactor;
      return Math.min(Math.max(nextScale, 0.5), 4);
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 space-y-5 select-none pb-12">
      {/* V-FLOW HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#2D2D38]">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-[#2A2933] hover:bg-[#34333F] text-zinc-300 border border-[#3E3D4D] transition-all cursor-pointer"
              title="Quay lại"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Explore Vietnam
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ĐỊA LÝ & DU LỊCH
                </span>
              </h1>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Bản đồ hành chính các tỉnh thành Việt Nam • Tương tác thu phóng & di chuyển trực quan
            </p>
          </div>
        </div>

        {/* Action Controls Toolbar - V-Flow Pills */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-[#1F1E24] p-1.5 rounded-2xl border border-[#2D2D38]">
          <button
            onClick={handleZoomIn}
            disabled={scale >= 4}
            className="p-2 rounded-xl bg-[#18171E] hover:bg-[#262530] text-zinc-200 hover:text-white disabled:opacity-40 border border-[#2D2D38] transition-all cursor-pointer"
            title="Phóng to"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            className="p-2 rounded-full bg-[#18171E] hover:bg-[#262530] text-zinc-200 hover:text-white disabled:opacity-40 border border-[#2D2D38] transition-all cursor-pointer"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại ({Math.round(scale * 100)}%)</span>
          </button>
        </div>
      </div>

      {/* Map Display Frame - Sleek V-Flow Card */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`w-full h-[65vh] md:h-[72vh] rounded-3xl border border-[#2D2D38] shadow-2xl relative bg-[#14131A] flex items-center justify-center select-none overflow-hidden ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {/* Floating guidance notice */}
        <div className="absolute top-4 left-4 z-10 bg-[#1F1E24]/90 backdrop-blur-md border border-[#343440] px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs text-zinc-300 font-medium shadow-lg">
          <Grab className="w-3.5 h-3.5 text-emerald-400" />
          <span>Kéo thả để di chuyển • Cuộn chuột để phóng to/thu nhỏ</span>
        </div>

        {/* Map Image container with CSS Transforms */}
        <div
          className="transition-transform duration-100 ease-out origin-center"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
        >
          <img
            src={mapImageUrl}
            alt="Bản đồ Việt Nam"
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[60vh] md:max-h-[68vh] object-contain rounded-xl shadow-2xl pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
