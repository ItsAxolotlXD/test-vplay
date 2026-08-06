import React, { useState, useRef } from "react";
import { ArrowLeft, Compass, ZoomIn, ZoomOut, RotateCcw, Grab } from "lucide-react";
import { VplayPrimaryButton } from "./ui/VplayPrimaryButton";
import { VplaySecondaryButton } from "./ui/VplaySecondaryButton";

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
    <div className="space-y-4 select-none">
      {/* ORE UI HEADER BAR */}
      <div className="bg-[#2d2f32] border-2 border-[#141414] p-3 sm:p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="bg-[#c6c6c6] hover:bg-[#383b3e] hover:text-white text-[#141414] p-2 border-2 border-[#141414] shadow-[inset_2px_2px_0_#ffffff,inset_-2px_-2px_0_#898d91] active:translate-y-[1px]"
              title="Quay lại"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="w-10 h-10 bg-[#28960b] border-2 border-[#141414] flex items-center justify-center text-white shrink-0 shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider font-jura">
                EXPLORE VIETNAM (BẢN ĐỒ VIỆT NAM)
              </h2>
              <span className="bg-[#89dc69] text-[#141414] px-2 py-0.5 text-[10px] font-bold font-mono border border-[#141414]">
                Ore UI Map
              </span>
            </div>
            <p className="text-[11px] text-zinc-300 font-jura">
              Bản đồ hành chính các tỉnh thành Việt Nam. Cuộn chuột để phóng to/thu nhỏ hoặc nhấn giữ kéo bản đồ.
            </p>
          </div>
        </div>

        {/* Custom Toolbar */}
        <div className="flex items-center gap-2 bg-[#1f2022] p-1.5 border-2 border-[#141414] self-start md:self-center shadow-lg">
          <button
            onClick={handleZoomIn}
            disabled={scale >= 4}
            className="p-2 bg-[#383b3e] hover:bg-[#4a4d50] text-white disabled:opacity-40 border-2 border-[#141414] shadow active:translate-y-[1px]"
            title="Phóng to"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            className="p-2 bg-[#383b3e] hover:bg-[#4a4d50] text-white disabled:opacity-40 border-2 border-[#141414] shadow active:translate-y-[1px]"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="h-4 w-[2px] bg-[#141414] mx-1" />
          <VplayPrimaryButton
            onClick={handleReset}
            className="!py-1.5 !px-3 text-xs font-bold flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại ({Math.round(scale * 100)}%)</span>
          </VplayPrimaryButton>
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
        className={`w-full h-[65vh] md:h-[72vh] border-2 border-[#141414] shadow-2xl relative bg-[#1f2022] flex items-center justify-center select-none overflow-hidden ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {/* Floating guidance notice */}
        <div className="absolute top-3 left-3 z-10 bg-[#141414] border border-zinc-700 px-3 py-1.5 flex items-center gap-2 text-[10px] text-zinc-300 font-mono shadow-md">
          <Grab className="w-3.5 h-3.5 text-[#89dc69]" />
          <span>Kéo thả di chuyển • Cuộn chuột phóng to/thu nhỏ</span>
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
            className="max-w-full max-h-[60vh] md:max-h-[68vh] object-contain shadow-2xl pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}

