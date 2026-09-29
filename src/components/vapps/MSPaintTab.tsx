import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Palette,
  Paintbrush,
  Pencil,
  Eraser,
  PaintBucket,
  Pipette,
  Type,
  Square,
  Circle,
  Minus,
  Star,
  ArrowRight,
  Heart,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Upload,
  ZoomIn,
  ZoomOut,
  Grid,
  Maximize2,
  Minimize2,
  Sparkles,
  Check,
  RotateCcw
} from 'lucide-react';
import { playPopSound } from '../../utils/sound';

interface MSPaintTabProps {
  onBack?: () => void;
}

type ToolType =
  | 'brush'
  | 'pencil'
  | 'eraser'
  | 'bucket'
  | 'eyedropper'
  | 'text'
  | 'line'
  | 'rectangle'
  | 'circle'
  | 'triangle'
  | 'star'
  | 'arrow'
  | 'heart';

// Classic Windows 28-color MS Paint Palette
const CLASSIC_PALETTE = [
  '#000000', '#7F7F7F', '#880015', '#ED1C24', '#FF7F27', '#FFF200', '#22B14C', '#00A2E8', '#3F48CC', '#A349A4',
  '#FFFFFF', '#C3C3C3', '#B97A57', '#FFAEC9', '#FFC90E', '#EFE4B0', '#B5E61D', '#99D9EA', '#7092BE', '#C8BFE7',
  '#004080', '#008080', '#107C41', '#E81123', '#FF8C00', '#FF1493', '#8B008B', '#2F4F4F'
];

export const MSPaintTab: React.FC<MSPaintTabProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Drawing state
  const [currentTool, setCurrentTool] = useState<ToolType>('brush');
  const [color1, setColor1] = useState<string>('#000000'); // Foreground
  const [color2, setColor2] = useState<string>('#FFFFFF'); // Background
  const [activeColorSlot, setActiveColorSlot] = useState<1 | 2>(1);
  const [lineWidth, setLineWidth] = useState<number>(4);
  const [fillShape, setFillShape] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Text tool state
  const [textInput, setTextInput] = useState<string>('Vplay');
  const [fontSize, setFontSize] = useState<number>(24);

  // Pointer position & status bar info
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({
    width: 900,
    height: 560
  });

  // History Stack for Undo / Redo
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Active Drawing Tracking
  const isDrawingRef = useRef<boolean>(false);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const snapshotRef = useRef<ImageData | null>(null);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Fill initial canvas with white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial state
    const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialData]);
    setHistoryIndex(0);
  }, []);

  const saveHistoryState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => {
      const nextHistory = prev.slice(0, historyIndex + 1);
      nextHistory.push(data);
      if (nextHistory.length > 30) nextHistory.shift();
      return nextHistory;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 29));
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return;
    playPopSound();
    const newIdx = historyIndex - 1;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.putImageData(history[newIdx], 0, 0);
    setHistoryIndex(newIdx);
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    playPopSound();
    const newIdx = historyIndex + 1;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.putImageData(history[newIdx], 0, 0);
    setHistoryIndex(newIdx);
  }, [history, historyIndex]);

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    playPopSound();
    ctx.fillStyle = color2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveHistoryState();
  };

  // Coordinates helper taking zoom and canvas offset into account
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: Math.round((e.clientX - rect.left) * scaleX),
      y: Math.round((e.clientY - rect.top) * scaleY)
    };
  };

  // Flood fill algorithm for paint bucket
  const floodFill = (startX: number, startY: number, fillColorHex: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Convert hex to RGBA
    const tempDiv = document.createElement('div');
    tempDiv.style.color = fillColorHex;
    document.body.appendChild(tempDiv);
    const compColor = window.getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);
    const match = compColor.match(/\d+/g);
    if (!match) return;

    const fillR = parseInt(match[0], 10);
    const fillG = parseInt(match[1], 10);
    const fillB = parseInt(match[2], 10);
    const fillA = 255;

    const startIndex = (startY * canvas.width + startX) * 4;
    const targetR = data[startIndex];
    const targetG = data[startIndex + 1];
    const targetB = data[startIndex + 2];
    const targetA = data[startIndex + 3];

    // If already the same color, skip
    if (
      Math.abs(targetR - fillR) < 5 &&
      Math.abs(targetG - fillG) < 5 &&
      Math.abs(targetB - fillB) < 5 &&
      Math.abs(targetA - fillA) < 5
    ) {
      return;
    }

    const colorMatch = (idx: number) => {
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];
      return (
        Math.abs(r - targetR) <= 18 &&
        Math.abs(g - targetG) <= 18 &&
        Math.abs(b - targetB) <= 18 &&
        Math.abs(a - targetA) <= 18
      );
    };

    const pixelStack: [number, number][] = [[startX, startY]];
    const width = canvas.width;
    const height = canvas.height;

    while (pixelStack.length > 0) {
      const [curX, curY] = pixelStack.pop()!;
      let y1 = curY;
      while (y1 >= 0 && colorMatch((y1 * width + curX) * 4)) {
        y1--;
      }
      y1++;
      let spanLeft = false;
      let spanRight = false;

      while (y1 < height && colorMatch((y1 * width + curX) * 4)) {
        const idx = (y1 * width + curX) * 4;
        data[idx] = fillR;
        data[idx + 1] = fillG;
        data[idx + 2] = fillB;
        data[idx + 3] = fillA;

        if (curX > 0) {
          const leftIdx = (y1 * width + (curX - 1)) * 4;
          if (colorMatch(leftIdx)) {
            if (!spanLeft) {
              pixelStack.push([curX - 1, y1]);
              spanLeft = true;
            }
          } else if (spanLeft) {
            spanLeft = false;
          }
        }

        if (curX < width - 1) {
          const rightIdx = (y1 * width + (curX + 1)) * 4;
          if (colorMatch(rightIdx)) {
            if (!spanRight) {
              pixelStack.push([curX + 1, y1]);
              spanRight = true;
            }
          } else if (spanRight) {
            spanRight = false;
          }
        }
        y1++;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    saveHistoryState();
  };

  // Pointer Down
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.setPointerCapture(e.pointerId);
    const coords = getCoordinates(e);
    isDrawingRef.current = true;
    startPosRef.current = coords;

    const strokeColor = e.button === 2 ? color2 : color1;

    // Eyedropper tool
    if (currentTool === 'eyedropper') {
      const pixel = ctx.getImageData(coords.x, coords.y, 1, 1).data;
      const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
      if (activeColorSlot === 1) setColor1(hex);
      else setColor2(hex);
      setCurrentTool('brush');
      isDrawingRef.current = false;
      return;
    }

    // Paint bucket tool
    if (currentTool === 'bucket') {
      floodFill(coords.x, coords.y, strokeColor);
      isDrawingRef.current = false;
      return;
    }

    // Text tool
    if (currentTool === 'text') {
      ctx.font = `${fontSize}px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;
      ctx.fillStyle = strokeColor;
      ctx.fillText(textInput, coords.x, coords.y);
      saveHistoryState();
      isDrawingRef.current = false;
      return;
    }

    // Save snapshot for shapes/lines
    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);

    if (currentTool === 'brush' || currentTool === 'pencil' || currentTool === 'eraser') {
      ctx.strokeStyle = currentTool === 'eraser' ? color2 : strokeColor;
      ctx.lineWidth = currentTool === 'pencil' ? 1 : lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const coords = getCoordinates(e);
    setCursorPos(coords);

    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const strokeColor = e.buttons === 2 ? color2 : color1;

    if (currentTool === 'brush' || currentTool === 'pencil' || currentTool === 'eraser') {
      ctx.strokeStyle = currentTool === 'eraser' ? color2 : strokeColor;
      ctx.lineWidth = currentTool === 'pencil' ? 1 : lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else {
      // Restore snapshot to redraw shapes live without leaving trails
      if (snapshotRef.current) {
        ctx.putImageData(snapshotRef.current, 0, 0);
      }
      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = color2;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const start = startPosRef.current;
      const width = coords.x - start.x;
      const height = coords.y - start.y;

      ctx.beginPath();
      if (currentTool === 'line') {
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      } else if (currentTool === 'rectangle') {
        if (fillShape) {
          ctx.fillRect(start.x, start.y, width, height);
        }
        ctx.strokeRect(start.x, start.y, width, height);
      } else if (currentTool === 'circle') {
        const radiusX = Math.abs(width) / 2;
        const radiusY = Math.abs(height) / 2;
        const centerX = start.x + width / 2;
        const centerY = start.y + height / 2;
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        if (fillShape) ctx.fill();
        ctx.stroke();
      } else if (currentTool === 'triangle') {
        ctx.moveTo(start.x + width / 2, start.y);
        ctx.lineTo(start.x, start.y + height);
        ctx.lineTo(start.x + width, start.y + height);
        ctx.closePath();
        if (fillShape) ctx.fill();
        ctx.stroke();
      } else if (currentTool === 'star') {
        drawStar(ctx, start.x + width / 2, start.y + height / 2, 5, Math.abs(width) / 2, Math.abs(width) / 4);
        if (fillShape) ctx.fill();
        ctx.stroke();
      } else if (currentTool === 'arrow') {
        drawArrow(ctx, start.x, start.y, coords.x, coords.y, lineWidth * 3);
        ctx.stroke();
      } else if (currentTool === 'heart') {
        drawHeart(ctx, start.x, start.y, width, height);
        if (fillShape) ctx.fill();
        ctx.stroke();
      }
    }
  };

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {}
    }
    saveHistoryState();
  };

  // Shape helpers
  const drawStar = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number
  ) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    headlen: number
  ) => {
    const angle = Math.atan2(toY - fromY, toX - fromX);
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
  };

  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.beginPath();
    const topCurveHeight = h * 0.3;
    ctx.moveTo(x + w / 2, y + h);
    ctx.bezierCurveTo(x, y + h * 0.7, x, y + topCurveHeight, x + w / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + w, y + topCurveHeight, x + w, y + h * 0.7, x + w / 2, y + h);
    ctx.closePath();
  };

  // Export / Save PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    playPopSound();
    const link = document.createElement('a');
    link.download = `Vplay_Paint_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Upload / Import Image
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        saveHistoryState();
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Load Preset Template
  const handleLoadTemplate = (type: 'tv' | 'vplay' | 'grid') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    playPopSound();

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (type === 'tv') {
      // Draw TV Color Bars (SMPTE color bars)
      const colors = ['#C0C0C0', '#C0C000', '#00C0C0', '#00C000', '#C000C0', '#C00000', '#0000C0'];
      const barWidth = canvas.width / colors.length;
      colors.forEach((c, idx) => {
        ctx.fillStyle = c;
        ctx.fillRect(idx * barWidth, 0, barWidth, canvas.height * 0.75);
      });
      // Bottom banner
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, canvas.height * 0.75, canvas.width, canvas.height * 0.25);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 28px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VPLAY TELEVISION - TEST PATTERN', canvas.width / 2, canvas.height * 0.88);
      ctx.textAlign = 'left';
    } else if (type === 'vplay') {
      // Draw Vplay Logo outline
      ctx.strokeStyle = '#388BFD';
      ctx.lineWidth = 12;
      ctx.strokeRect(canvas.width / 2 - 200, canvas.height / 2 - 120, 400, 240);
      ctx.fillStyle = '#388BFD';
      ctx.font = 'black 64px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VPLAY 360', canvas.width / 2, canvas.height / 2 + 20);
      ctx.textAlign = 'left';
    }
    saveHistoryState();
  };

  return (
    <div
      ref={containerRef}
      id="ms-paint-container"
      className="w-full max-w-6xl mx-auto flex flex-col rounded-xl overflow-hidden shadow-2xl border border-zinc-700/80 bg-[#ECE9D8] dark:bg-[#1E1E24] text-zinc-800 dark:text-zinc-200 select-none animate-in fade-in duration-300"
    >
      {/* 1. CLASSIC RETRO / FLUENT WINDOW TITLEBAR */}
      <div className="w-full h-9 bg-gradient-to-r from-[#0A246A] via-[#0D47A1] to-[#388BFD] dark:from-[#18181E] dark:to-[#2A2A38] text-white px-3 flex items-center justify-between text-xs font-semibold shadow-sm shrink-0 border-b border-black/20">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center p-0.5">
            <Palette className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <span className="font-bold tracking-tight">untitled.png - Paint (Space 360 Edition)</span>
        </div>

        <div className="flex items-center gap-1.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors cursor-pointer"
            >
              Đóng Space 360
            </button>
          )}
        </div>
      </div>

      {/* 2. MENU BAR (File, Edit, View, Image, Colors, Help) */}
      <div className="w-full px-3 py-1 bg-[#F5F6F7] dark:bg-[#25252E] border-b border-zinc-300 dark:border-zinc-700/80 flex items-center gap-4 text-xs font-medium text-zinc-700 dark:text-zinc-300 shrink-0">
        <button
          type="button"
          onClick={handleClearCanvas}
          className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
        >
          Tạo mới (New)
        </button>
        <label className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
          Mở tệp (Open)
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
        <button
          type="button"
          onClick={handleDownload}
          className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer font-bold text-blue-600 dark:text-blue-400"
        >
          Lưu ảnh (Save PNG)
        </button>
        <button
          type="button"
          onClick={handleUndo}
          disabled={historyIndex <= 0}
          className="disabled:opacity-40 hover:text-blue-600 cursor-pointer flex items-center gap-1"
        >
          <Undo2 className="w-3 h-3" /> Hoàn tác
        </button>
        <button
          type="button"
          onClick={handleRedo}
          disabled={historyIndex >= history.length - 1}
          className="disabled:opacity-40 hover:text-blue-600 cursor-pointer flex items-center gap-1"
        >
          <Redo2 className="w-3 h-3" /> Làm lại
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleLoadTemplate('tv')}
            className="px-2 py-0.5 rounded bg-blue-500/15 hover:bg-blue-500/25 text-blue-600 dark:text-blue-400 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            Mẫu TV SMPTE
          </button>
          <button
            type="button"
            onClick={() => handleLoadTemplate('vplay')}
            className="px-2 py-0.5 rounded bg-purple-500/15 hover:bg-purple-500/25 text-purple-600 dark:text-purple-400 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            Mẫu Vplay Logo
          </button>
        </div>
      </div>

      {/* 3. PAINT RIBBON & TOOLBAR */}
      <div className="w-full p-2.5 bg-[#F0F0F0] dark:bg-[#202028] border-b border-zinc-300 dark:border-zinc-700/80 flex flex-wrap items-center gap-3 sm:gap-4 shrink-0 overflow-x-auto no-scrollbar">
        {/* Tools Section */}
        <div className="flex flex-col gap-1 pr-3 border-r border-zinc-300 dark:border-zinc-700">
          <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
            Công Cụ (Tools)
          </span>
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setCurrentTool('brush');
              }}
              title="Bút cọ (Brush)"
              className={`p-1.5 rounded transition-all cursor-pointer ${
                currentTool === 'brush'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Paintbrush className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setCurrentTool('pencil');
              }}
              title="Bút chì nét mảnh (Pencil)"
              className={`p-1.5 rounded transition-all cursor-pointer ${
                currentTool === 'pencil'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setCurrentTool('eraser');
              }}
              title="Cục tẩy (Eraser)"
              className={`p-1.5 rounded transition-all cursor-pointer ${
                currentTool === 'eraser'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Eraser className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setCurrentTool('bucket');
              }}
              title="Đổ màu (Fill with color)"
              className={`p-1.5 rounded transition-all cursor-pointer ${
                currentTool === 'bucket'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <PaintBucket className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setCurrentTool('eyedropper');
              }}
              title="Hút màu (Color picker)"
              className={`p-1.5 rounded transition-all cursor-pointer ${
                currentTool === 'eyedropper'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Pipette className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setCurrentTool('text');
              }}
              title="Chèn chữ (Text)"
              className={`p-1.5 rounded transition-all cursor-pointer ${
                currentTool === 'text'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Type className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Shapes Section */}
        <div className="flex flex-col gap-1 pr-3 border-r border-zinc-300 dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
              Hình Dạng (Shapes)
            </span>
            <label className="flex items-center gap-1 text-[10px] text-zinc-600 dark:text-zinc-400 cursor-pointer ml-2">
              <input
                type="checkbox"
                checked={fillShape}
                onChange={(e) => setFillShape(e.target.checked)}
                className="rounded text-blue-600 w-3 h-3"
              />
              <span>Tô đặc</span>
            </label>
          </div>
          <div className="grid grid-cols-4 gap-1">
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setCurrentTool('line');
              }}
              title="Đường thẳng (Line)"
              className={`p-1.5 rounded transition-all cursor-pointer ${
                currentTool === 'line'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setCurrentTool('rectangle');
              }}
              title="Hình chữ nhật (Rectangle)"
              className={`p-1.5 rounded transition-all cursor-pointer ${
                currentTool === 'rectangle'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Square className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setCurrentTool('circle');
              }}
              title="Hình tròn / Elip (Circle)"
              className={`p-1.5 rounded transition-all cursor-pointer ${
                currentTool === 'circle'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Circle className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setCurrentTool('star');
              }}
              title="Ngôi sao (Star)"
              className={`p-1.5 rounded transition-all cursor-pointer ${
                currentTool === 'star'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Star className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setCurrentTool('arrow');
              }}
              title="Mũi tên (Arrow)"
              className={`p-1.5 rounded transition-all cursor-pointer ${
                currentTool === 'arrow'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setCurrentTool('heart');
              }}
              title="Trái tim (Heart)"
              className={`p-1.5 rounded transition-all cursor-pointer ${
                currentTool === 'heart'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Line Width / Stroke Size */}
        <div className="flex flex-col gap-1 pr-3 border-r border-zinc-300 dark:border-zinc-700">
          <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
            Nét Vẽ ({lineWidth}px)
          </span>
          <div className="flex items-center gap-1.5">
            {[1, 3, 6, 12, 24].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  playPopSound();
                  setLineWidth(size);
                }}
                className={`w-7 h-7 rounded flex items-center justify-center transition-all cursor-pointer ${
                  lineWidth === size
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600'
                }`}
              >
                <span
                  className="rounded-full bg-current"
                  style={{ width: `${Math.min(size + 2, 14)}px`, height: `${Math.min(size + 2, 14)}px` }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Color 1 & Color 2 Slots */}
        <div className="flex items-center gap-2 pr-3 border-r border-zinc-300 dark:border-zinc-700">
          <div
            onClick={() => setActiveColorSlot(1)}
            className={`flex flex-col items-center gap-0.5 cursor-pointer p-1 rounded ${
              activeColorSlot === 1 ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30' : ''
            }`}
          >
            <div
              className="w-7 h-7 rounded border-2 border-zinc-400 shadow-inner"
              style={{ backgroundColor: color1 }}
            />
            <span className="text-[10px] font-bold">Màu 1</span>
          </div>

          <div
            onClick={() => setActiveColorSlot(2)}
            className={`flex flex-col items-center gap-0.5 cursor-pointer p-1 rounded ${
              activeColorSlot === 2 ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30' : ''
            }`}
          >
            <div
              className="w-7 h-7 rounded border-2 border-zinc-400 shadow-inner"
              style={{ backgroundColor: color2 }}
            />
            <span className="text-[10px] font-bold">Màu 2</span>
          </div>
        </div>

        {/* Color Palette Grid */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
              Bảng Màu (Palette)
            </span>
            <label className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1 font-semibold">
              <span>Đổi màu...</span>
              <input
                type="color"
                value={activeColorSlot === 1 ? color1 : color2}
                onChange={(e) => {
                  if (activeColorSlot === 1) setColor1(e.target.value);
                  else setColor2(e.target.value);
                }}
                className="w-4 h-4 p-0 border-0 opacity-0 absolute cursor-pointer"
              />
            </label>
          </div>
          <div className="grid grid-rows-2 grid-flow-col gap-1">
            {CLASSIC_PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  playPopSound();
                  if (activeColorSlot === 1) setColor1(c);
                  else setColor2(c);
                }}
                className="w-5 h-5 rounded-[2px] border border-black/30 dark:border-white/20 shadow-xs hover:scale-115 active:scale-95 transition-transform cursor-pointer relative"
                style={{ backgroundColor: c }}
                title={c}
              >
                {((activeColorSlot === 1 && color1.toLowerCase() === c.toLowerCase()) ||
                  (activeColorSlot === 2 && color2.toLowerCase() === c.toLowerCase())) && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check className={`w-3 h-3 ${c === '#FFFFFF' || c === '#FFF200' ? 'text-black' : 'text-white'}`} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input (if Text tool active) */}
        {currentTool === 'text' && (
          <div className="flex items-center gap-2 pl-3 border-l border-zinc-300 dark:border-zinc-700 animate-in fade-in">
            <span className="text-xs font-semibold">Chữ:</span>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Nhập nội dung chữ..."
              className="px-2 py-1 text-xs rounded border border-zinc-400 dark:border-zinc-600 bg-white dark:bg-zinc-800"
            />
            <span className="text-xs font-semibold">Cỡ:</span>
            <input
              type="number"
              min="10"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value, 10) || 24)}
              className="w-14 px-1.5 py-1 text-xs rounded border border-zinc-400 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-center"
            />
          </div>
        )}
      </div>

      {/* 4. CANVAS WORKSPACE (Scrollable with zoom) */}
      <div className="w-full h-[540px] sm:h-[600px] overflow-auto bg-[#808080] dark:bg-[#121216] p-4 sm:p-8 flex items-center justify-center relative select-none">
        <div
          className="relative shadow-2xl transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
        >
          {/* Main Drawing Canvas */}
          <canvas
            ref={canvasRef}
            width={canvasDimensions.width}
            height={canvasDimensions.height}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onContextMenu={(e) => e.preventDefault()}
            className="bg-white rounded-xs border border-zinc-400 shadow-md cursor-crosshair touch-none"
          />

          {/* Grid lines overlay */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />
          )}
        </div>
      </div>

      {/* 5. STATUS BAR */}
      <div className="w-full h-7 bg-[#F0F0F0] dark:bg-[#1E1E24] border-t border-zinc-300 dark:border-zinc-700/80 px-3 flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400 shrink-0 font-sans">
        <div className="flex items-center gap-4">
          <span className="font-medium">
            {cursorPos ? `X: ${cursorPos.x}px, Y: ${cursorPos.y}px` : 'Sẵn sàng vẽ'}
          </span>
          <span className="hidden sm:inline border-l border-zinc-300 dark:border-zinc-700 pl-4">
            Kích thước: {canvasDimensions.width} × {canvasDimensions.height}px
          </span>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="rounded text-blue-600 w-3 h-3"
            />
            <span>Hiện lưới ô (Grid)</span>
          </label>
          <div className="flex items-center gap-1.5 border-l border-zinc-300 dark:border-zinc-700 pl-3">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(50, z - 25))}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded cursor-pointer"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-bold">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(200, z + 25))}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded cursor-pointer"
              title="Phóng to"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MSPaintTab;
