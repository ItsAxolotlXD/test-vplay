import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Compass, ZoomIn, ZoomOut, RotateCcw, Grab } from "lucide-react";

interface ExploreVietnamTabProps {
  onBack: () => void;
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
    setScale((prev) => Math.min(prev + 0.25, 4));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
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
    <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white cursor-pointer transition-colors"
              title="Quay lại"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5">
              <Compass className="w-6 h-6 text-red-500 animate-pulse" />
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Explore Vietnam Map
              </h1>
            </div>
          </div>
          <p className="text-xs text-zinc-400 md:pl-12">
            Xem bản đồ hành chính các tỉnh thành Việt Nam sắc nét. Cuộn chuột để phóng to/thu nhỏ hoặc nhấn giữ để kéo bản đồ.
          </p>
        </div>

        {/* Custom Toolbar */}
        <div className="flex items-center gap-2 bg-zinc-900/80 p-1.5 rounded-2xl border border-white/5 self-start md:self-center shadow-lg">
          <button
            onClick={handleZoomIn}
            disabled={scale >= 4}
            className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 disabled:opacity-40 transition-all cursor-pointer"
            title="Phóng to"
          >
            <ZoomIn className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 disabled:opacity-40 transition-all cursor-pointer"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-4.5 h-4.5" />
          </button>
          <div className="h-4 w-[1px] bg-white/10 mx-1" />
          <button
            onClick={handleReset}
            className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Đặt lại bản đồ"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Đặt lại ({Math.round(scale * 100)}%)</span>
          </button>
        </div>
      </div>

      {/* Map Display Frame */}
      <div 
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`w-full h-[65vh] md:h-[75vh] rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative bg-zinc-950/40 backdrop-blur-md flex items-center justify-center select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {/* Floating guidance notice */}
        <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-xl pointer-events-none flex items-center gap-2 text-[11px] text-zinc-400 font-medium">
          <Grab className="w-3.5 h-3.5 text-red-500" />
          <span>Kéo thả để di chuyển bản đồ • Cuộn chuột để Zoom</span>
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
            className="max-w-full max-h-[60vh] md:max-h-[70vh] object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-lg pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
