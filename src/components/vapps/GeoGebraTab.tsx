import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Compass,
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Download,
  Share2,
  Table as TableIcon,
  HelpCircle,
  Check,
  ChevronRight,
  TrendingUp,
  Globe
} from 'lucide-react';
import { playPopSound } from '../../utils/sound';

interface FunctionItem {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
  name: string;
}

const PRESET_COLORS = [
  '#10B981', // Emerald
  '#38BDF8', // Sky
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#EF4444', // Red
];

const PRESET_FUNCTIONS = [
  { name: 'Parabol Chuẩn', expr: 'x^2', desc: 'Hàm số bậc hai y = x²' },
  { name: 'Đa Thức Bậc 3', expr: 'x^3 - 3*x', desc: 'Đồ thị có 2 điểm cực trị' },
  { name: 'Sóng Hình Sin', expr: '2*sin(x)', desc: 'Hàm lượng giác chu kỳ 2π' },
  { name: 'Chuông Gauss', expr: 'exp(-x^2)', desc: 'Phân phối chuẩn đối xứng' },
  { name: 'Hàm Phân Thức', expr: '1/x', desc: 'Hypebol vuông có 2 tiệm cận' },
  { name: 'Đồ Thị Trái Tim', expr: 'abs(x)^(2/3) + 0.7*sqrt(max(0, 4 - x^2))*sin(10*x)', desc: 'Hàm số hình trái tim đặc biệt' },
];

export const GeoGebraTab: React.FC = () => {
  const [activeEngine, setActiveEngine] = useState<'geogebra' | 'native'>('geogebra');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Native plotter state
  const [functions, setFunctions] = useState<FunctionItem[]>([
    { id: '1', expression: 'x^2 - 4', color: '#10B981', visible: true, name: 'f(x)' },
    { id: '2', expression: '2*sin(x)', color: '#38BDF8', visible: true, name: 'g(x)' }
  ]);

  // Viewport Coordinates: center (cx, cy) and scale (pixels per unit)
  const [view, setView] = useState({ cx: 0, cy: 0, scale: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  // Table of Values state
  const [showTable, setShowTable] = useState(false);
  const [tableConfig, setTableConfig] = useState({ start: -3, end: 3, step: 0.5 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Safe Math expression evaluator
  const compileExpression = useCallback((exprStr: string) => {
    try {
      // Normalize user input
      let js = exprStr
        .replace(/\s+/g, '')
        .replace(/\^/g, '**')
        .replace(/(\d)([a-zA-Z])/g, '$1*$2') // 2x -> 2*x
        .replace(/\)([a-zA-Z0-9])/g, ')*$1') // )x -> )*x
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/asin\(/g, 'Math.asin(')
        .replace(/acos\(/g, 'Math.acos(')
        .replace(/atan\(/g, 'Math.atan(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/abs\(/g, 'Math.abs(')
        .replace(/exp\(/g, 'Math.exp(')
        .replace(/log\(/g, 'Math.log(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/max\(/g, 'Math.max(')
        .replace(/min\(/g, 'Math.min(')
        .replace(/\bpi\b/gi, 'Math.PI')
        .replace(/\be\b/g, 'Math.E');

      // Create sandboxed function
      const fn = new Function('x', `try { return ${js}; } catch(e) { return NaN; }`);
      // Test run
      const test = fn(1);
      if (typeof test !== 'number') return null;
      return fn;
    } catch {
      return null;
    }
  }, []);

  // Redraw Native Canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    // Screen to Math coordinates
    const toScreenX = (x: number) => w / 2 + (x - view.cx) * view.scale;
    const toScreenY = (y: number) => h / 2 - (y - view.cy) * view.scale;

    // Math to Screen coordinates
    const toMathX = (sx: number) => (sx - w / 2) / view.scale + view.cx;
    const toMathY = (sy: number) => -(sy - h / 2) / view.scale + view.cy;

    const mathXMin = toMathX(0);
    const mathXMax = toMathX(w);
    const mathYMin = toMathY(h);
    const mathYMax = toMathY(0);

    // Determine grid step
    let gridStep = 1;
    if (view.scale > 100) gridStep = 0.5;
    if (view.scale > 250) gridStep = 0.2;
    if (view.scale < 30) gridStep = 2;
    if (view.scale < 15) gridStep = 5;
    if (view.scale < 5) gridStep = 10;

    // 1. Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    ctx.beginPath();

    const startX = Math.floor(mathXMin / gridStep) * gridStep;
    for (let x = startX; x <= mathXMax; x += gridStep) {
      const sx = toScreenX(x);
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, h);
    }

    const startY = Math.floor(mathYMin / gridStep) * gridStep;
    for (let y = startY; y <= mathYMax; y += gridStep) {
      const sy = toScreenY(y);
      ctx.moveTo(0, sy);
      ctx.lineTo(w, sy);
    }
    ctx.stroke();

    // 2. Draw Primary Axes (X = 0, Y = 0)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    const axisX = toScreenX(0);
    const axisY = toScreenY(0);

    // X Axis
    ctx.moveTo(0, axisY);
    ctx.lineTo(w, axisY);
    // Y Axis
    ctx.moveTo(axisX, 0);
    ctx.lineTo(axisX, h);
    ctx.stroke();

    // 3. Grid Numbers
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '10px monospace';

    for (let x = startX; x <= mathXMax; x += gridStep) {
      if (Math.abs(x) < 1e-6) continue;
      const sx = toScreenX(x);
      if (sx > 10 && sx < w - 20) {
        ctx.fillText(x.toFixed(gridStep < 1 ? 1 : 0), sx - 6, Math.min(Math.max(axisY + 14, 15), h - 5));
      }
    }

    for (let y = startY; y <= mathYMax; y += gridStep) {
      if (Math.abs(y) < 1e-6) continue;
      const sy = toScreenY(y);
      if (sy > 15 && sy < h - 10) {
        ctx.fillText(y.toFixed(gridStep < 1 ? 1 : 0), Math.min(Math.max(axisX + 6, 5), w - 30), sy + 3);
      }
    }

    // Origin (0,0) label
    ctx.fillText('0', axisX - 10, axisY + 12);

    // 4. Plot Functions
    for (const fnItem of functions) {
      if (!fnItem.visible || !fnItem.expression.trim()) continue;

      const evalFn = compileExpression(fnItem.expression);
      if (!evalFn) continue;

      ctx.strokeStyle = fnItem.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      let started = false;
      const stepPx = 1; // 1 pixel sample step for crisp high quality
      for (let sx = 0; sx <= w; sx += stepPx) {
        const mx = toMathX(sx);
        const my = evalFn(mx);

        if (typeof my === 'number' && isFinite(my)) {
          const sy = toScreenY(my);
          if (sy >= -200 && sy <= h + 200) {
            if (!started) {
              ctx.moveTo(sx, sy);
              started = true;
            } else {
              ctx.lineTo(sx, sy);
            }
          } else {
            started = false;
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    }

    // 5. Cursor Inspector Overlay
    if (cursorPos) {
      const cx = toScreenX(cursorPos.x);
      const cy = toScreenY(cursorPos.y);

      // Crosshair
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, h);
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point circle
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();

      // Tooltip coordinate pill
      const label = `(${cursorPos.x.toFixed(2)}, ${cursorPos.y.toFixed(2)})`;
      ctx.font = 'bold 11px monospace';
      const textW = ctx.measureText(label).width;

      const tagX = Math.min(Math.max(cx + 8, 10), w - textW - 20);
      const tagY = Math.min(Math.max(cy - 12, 20), h - 20);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(tagX - 4, tagY - 14, textW + 12, 20, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(label, tagX + 2, tagY);
    }

    ctx.restore();
  }, [view, functions, compileExpression, cursorPos]);

  useEffect(() => {
    if (activeEngine === 'native') {
      drawCanvas();
    }
  }, [activeEngine, drawCanvas]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (activeEngine === 'native') {
        drawCanvas();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeEngine, drawCanvas]);

  // Canvas Mouse Controls (Pan & Zoom)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const mx = (sx - rect.width / 2) / view.scale + view.cx;
    const my = -(sy - rect.height / 2) / view.scale + view.cy;

    if (isDragging) {
      const dx = (e.clientX - dragStart.x) / view.scale;
      const dy = (e.clientY - dragStart.y) / view.scale;
      setView((prev) => ({
        ...prev,
        cx: prev.cx - dx,
        cy: prev.cy + dy
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    } else {
      setCursorPos({ x: mx, y: my });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    setView((prev) => ({
      ...prev,
      scale: Math.max(Math.min(prev.scale * zoomFactor, 600), 4)
    }));
  };

  const zoomIn = () => {
    playPopSound();
    setView((prev) => ({ ...prev, scale: Math.min(prev.scale * 1.25, 600) }));
  };

  const zoomOut = () => {
    playPopSound();
    setView((prev) => ({ ...prev, scale: Math.max(prev.scale * 0.8, 4) }));
  };

  const resetView = () => {
    playPopSound();
    setView({ cx: 0, cy: 0, scale: 40 });
  };

  // Add / Delete Functions
  const handleAddFunction = () => {
    playPopSound();
    const nextIdx = functions.length + 1;
    const color = PRESET_COLORS[nextIdx % PRESET_COLORS.length];
    setFunctions((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        expression: '',
        color,
        visible: true,
        name: `f${nextIdx}(x)`
      }
    ]);
  };

  const handleUpdateExpr = (id: string, expr: string) => {
    setFunctions((prev) => prev.map((f) => (f.id === id ? { ...f, expression: expr } : f)));
  };

  const handleToggleVisible = (id: string) => {
    playPopSound();
    setFunctions((prev) => prev.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f)));
  };

  const handleDeleteFunction = (id: string) => {
    playPopSound();
    setFunctions((prev) => prev.filter((f) => f.id !== id));
  };

  const handleApplyPreset = (preset: { name: string; expr: string }) => {
    playPopSound();
    setFunctions((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        expression: preset.expr,
        color: PRESET_COLORS[prev.length % PRESET_COLORS.length],
        visible: true,
        name: `f${prev.length + 1}(x)`
      }
    ]);
  };

  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `do-thi-geogebra-${Date.now()}.png`;
    a.click();
  };

  return (
    <div ref={containerRef} className="w-full max-w-6xl mx-auto space-y-5 pb-12 select-none animate-in fade-in duration-200">
      {/* 1. Header Card */}
      <div 
        className="rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(24,24,27,0.95) 0%, rgba(30,27,75,0.7) 60%, rgba(16,185,129,0.18) 100%)'
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0 shadow-lg">
              <Compass className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>GeoGebra Vẽ Đồ Thị Hàm Số</span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Toán Học 360°
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 mt-0.5">
                Vẽ đồ thị đại số, lượng giác, phân thức và giải tích với GeoGebra Suite chính thức hoặc Bảng vẽ nội bộ tốc độ cao.
              </p>
            </div>
          </div>

          {/* Engine Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-black/50 border border-white/10 rounded-2xl shrink-0 self-start sm:self-auto">
            <button
              onClick={() => {
                playPopSound();
                setActiveEngine('geogebra');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeEngine === 'geogebra'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>GeoGebra Suite (Online)</span>
            </button>
            <button
              onClick={() => {
                playPopSound();
                setActiveEngine('native');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeEngine === 'native'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Bảng Vẽ Tích Hợp (Offline)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. ENGINE 1: GEOGEBRA OFFICIAL ONLINE SUITE (IFRAME) */}
      {activeEngine === 'geogebra' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>GeoGebra Math Suite Calculator • Đầy đủ tính năng vẽ hình, khảo sát hàm số, CAS</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIframeKey((k) => k + 1)}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1 cursor-pointer transition-colors"
                title="Tải lại bảng vẽ"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Tải lại</span>
              </button>
              <a
                href="https://www.geogebra.org/calculator"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 cursor-pointer transition-colors"
                title="Mở toàn màn hình ngoài tab"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Mở GeoGebra.org</span>
              </a>
            </div>
          </div>

          {/* Iframe wrapper */}
          <div className="w-full h-[650px] sm:h-[720px] rounded-3xl bg-zinc-950 border border-white/15 overflow-hidden shadow-2xl relative">
            <iframe
              key={iframeKey}
              src="https://www.geogebra.org/calculator?embed"
              title="GeoGebra Graphing Calculator Suite"
              className="w-full h-full border-0"
              allow="fullscreen; autoplay; clipboard-write; encrypted-media"
            />
          </div>
        </div>
      )}

      {/* 3. ENGINE 2: NATIVE HIGH-PERFORMANCE PLOTTER */}
      {activeEngine === 'native' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Function Editor & Presets (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Danh Sách Hàm Số
                </span>
                <button
                  onClick={handleAddFunction}
                  className="px-2.5 py-1 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 flex items-center gap-1 cursor-pointer transition-all shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Hàm</span>
                </button>
              </div>

              {/* Function Inputs */}
              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {functions.map((fnItem, idx) => (
                  <div
                    key={fnItem.id}
                    className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: fnItem.color }}
                        />
                        <span className="text-xs font-mono font-bold text-zinc-300">
                          {fnItem.name} =
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleVisible(fnItem.id)}
                          className={`p-1 rounded-md text-xs cursor-pointer ${
                            fnItem.visible ? 'text-emerald-400' : 'text-zinc-600'
                          }`}
                          title={fnItem.visible ? 'Ẩn hàm số' : 'Hiện hàm số'}
                        >
                          {fnItem.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        {functions.length > 1 && (
                          <button
                            onClick={() => handleDeleteFunction(fnItem.id)}
                            className="p-1 rounded-md text-zinc-500 hover:text-rose-400 cursor-pointer transition-colors"
                            title="Xóa hàm số"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <input
                      type="text"
                      value={fnItem.expression}
                      onChange={(e) => handleUpdateExpr(fnItem.id, e.target.value)}
                      placeholder="Ví dụ: x^2 - 4, sin(x), 1/x..."
                      className="w-full bg-zinc-950 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                  </div>
                ))}
              </div>

              {/* Presets List */}
              <div className="pt-3 border-t border-white/5 space-y-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Đồ thị mẫu phổ biến:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {PRESET_FUNCTIONS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplyPreset(p)}
                      className="px-2.5 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-[11px] text-zinc-300 text-left truncate transition-colors cursor-pointer"
                      title={p.desc}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Syntax Help Guide */}
            <div className="bg-zinc-900/60 border border-white/5 rounded-3xl p-4 text-[11px] text-zinc-400 space-y-1.5 font-mono">
              <span className="text-zinc-300 font-bold flex items-center gap-1 font-sans">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                Cú pháp toán học hỗ trợ:
              </span>
              <p>• Lũy thừa: <code className="text-emerald-400">x^2, x^3</code></p>
              <p>• Lượng giác: <code className="text-emerald-400">sin(x), cos(x), tan(x)</code></p>
              <p>• Căn bậc 2 & Trị tuyệt đối: <code className="text-emerald-400">sqrt(x), abs(x)</code></p>
              <p>• Số Euler & Logarit: <code className="text-emerald-400">exp(x), ln(x)</code></p>
            </div>
          </div>

          {/* Right Column: Interactive Graph Canvas (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
              {/* Canvas Toolbar Controls */}
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={zoomIn}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer transition-colors"
                    title="Phóng to (+)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={zoomOut}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer transition-colors"
                    title="Thu nhỏ (-)"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={resetView}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium cursor-pointer transition-colors flex items-center gap-1"
                    title="Về gốc tọa độ (0, 0)"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Gốc (0,0)</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowTable(!showTable)}
                    className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                      showTable ? 'bg-emerald-500 text-black' : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                    }`}
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                    <span>Bảng Giá Trị</span>
                  </button>
                  <button
                    onClick={handleExportPNG}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium cursor-pointer transition-colors flex items-center gap-1"
                    title="Tải ảnh đồ thị PNG"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất PNG</span>
                  </button>
                </div>
              </div>

              {/* Main Interactive Canvas */}
              <div className="w-full h-[460px] sm:h-[520px] rounded-2xl bg-zinc-950 border border-white/10 overflow-hidden relative cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={() => {
                    setIsDragging(false);
                    setCursorPos(null);
                  }}
                  onWheel={handleWheel}
                  className="w-full h-full block"
                />

                {/* Floating Navigation Instructions */}
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[10px] text-zinc-400 pointer-events-none select-none">
                  Kéo chuột để di chuyển • Cuộn chuột để phóng to/thu nhỏ
                </div>
              </div>

              {/* Table of Values Popover */}
              {showTable && functions.length > 0 && functions[0].expression && (
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Bảng Giá Trị Của {functions[0].name}:</span>
                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      <span>Từ:</span>
                      <input
                        type="number"
                        value={tableConfig.start}
                        onChange={(e) => setTableConfig({ ...tableConfig, start: parseFloat(e.target.value) || -3 })}
                        className="w-12 bg-zinc-900 border border-white/20 rounded px-1 text-center"
                      />
                      <span>Đến:</span>
                      <input
                        type="number"
                        value={tableConfig.end}
                        onChange={(e) => setTableConfig({ ...tableConfig, end: parseFloat(e.target.value) || 3 })}
                        className="w-12 bg-zinc-900 border border-white/20 rounded px-1 text-center"
                      />
                      <span>Bước:</span>
                      <input
                        type="number"
                        step="0.1"
                        value={tableConfig.step}
                        onChange={(e) => setTableConfig({ ...tableConfig, step: Math.max(parseFloat(e.target.value) || 0.5, 0.1) })}
                        className="w-12 bg-zinc-900 border border-white/20 rounded px-1 text-center"
                      />
                    </div>
                  </div>

                  <div className="max-h-40 overflow-y-auto pr-1">
                    <table className="w-full text-xs font-mono text-left">
                      <thead className="bg-zinc-800 text-zinc-400 sticky top-0">
                        <tr>
                          <th className="p-2">x</th>
                          <th className="p-2">{functions[0].name}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {(() => {
                          const rows: { x: number; y: number }[] = [];
                          const fn = compileExpression(functions[0].expression);
                          if (!fn) return null;
                          for (let x = tableConfig.start; x <= tableConfig.end + 1e-6; x += tableConfig.step) {
                            rows.push({ x: Number(x.toFixed(2)), y: fn(x) });
                          }
                          return rows.map((r, i) => (
                            <tr key={i} className="hover:bg-white/5">
                              <td className="p-2 text-zinc-300">{r.x}</td>
                              <td className="p-2 text-emerald-400 font-bold">{isFinite(r.y) ? r.y.toFixed(4) : 'Không xác định'}</td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeoGebraTab;
