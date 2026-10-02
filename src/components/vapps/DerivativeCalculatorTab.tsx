import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ArrowRight,
  Calculator,
  Sliders,
  Play
} from 'lucide-react';
import { calculateDerivative, DerivativeResult } from '../../utils/derivativeEngine';
import { playPopSound } from '../../utils/sound';

const PRESET_EXPRESSIONS = [
  { name: 'Đa Thức Bậc 3', expr: 'x^3 - 3*x^2 + 4', desc: 'Đạo hàm đa thức thông dụng' },
  { name: 'Tích Lượng Giác', expr: 'sin(x) * cos(x)', desc: 'Áp dụng quy tắc tích (uv)\'' },
  { name: 'Phân Thức (Thương)', expr: '(x^2 - 1) / (x + 2)', desc: 'Áp dụng quy tắc thương (u/v)\'' },
  { name: 'Hàm Mũ & Logarit', expr: 'exp(2*x) * ln(x)', desc: 'Đạo hàm hàm e^u và ln(u)' },
  { name: 'Hàm Hợp Lũy Thừa', expr: '(3*x^2 - 5)^4', desc: 'Quy tắc chuỗi (Chain Rule)' },
  { name: 'Căn Thức Bậc Hai', expr: 'sqrt(x^2 + 1)', desc: 'Đạo hàm căn bậc hai u\'/(2√u)' }
];

export const DerivativeCalculatorTab: React.FC = () => {
  const [expression, setExpression] = useState('x^3 - 3*x + 2');
  const [evalX, setEvalX] = useState<number>(1);
  const [result, setResult] = useState<DerivativeResult | null>(null);
  const [showSteps, setShowSteps] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute derivative automatically
  useEffect(() => {
    try {
      const res = calculateDerivative(expression, evalX);
      setResult(res);
    } catch {
      // Ignore intermediate typing errors
    }
  }, [expression, evalX]);

  // Render Dual Curve Graph: f(x), f'(x) and Tangent Line
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !result) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth || 400;
    const h = 260;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, w, h);

    const xMin = -5, xMax = 5;
    const yMin = -8, yMax = 8;

    const toScreenX = (x: number) => ((x - xMin) / (xMax - xMin)) * w;
    const toScreenY = (y: number) => h - ((y - yMin) / (yMax - yMin)) * h;

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      const sx = toScreenX(x);
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, h);
    }
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      const sy = toScreenY(y);
      ctx.moveTo(0, sy);
      ctx.lineTo(w, sy);
    }
    ctx.stroke();

    // Primary Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, toScreenY(0));
    ctx.lineTo(w, toScreenY(0));
    ctx.moveTo(toScreenX(0), 0);
    ctx.lineTo(toScreenX(0), h);
    ctx.stroke();

    // Evaluator helper
    const evalJs = (exprStr: string, xVal: number) => {
      try {
        const js = exprStr
          .replace(/\^/g, '**')
          .replace(/sin\(/g, 'Math.sin(')
          .replace(/cos\(/g, 'Math.cos(')
          .replace(/tan\(/g, 'Math.tan(')
          .replace(/sqrt\(/g, 'Math.sqrt(')
          .replace(/exp\(/g, 'Math.exp(')
          .replace(/ln\(/g, 'Math.log(');
        const fn = new Function('x', `return ${js};`);
        return Number(fn(xVal));
      } catch {
        return NaN;
      }
    };

    // Plot f(x) (Emerald)
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;
    for (let sx = 0; sx <= w; sx += 2) {
      const mx = xMin + (sx / w) * (xMax - xMin);
      const my = evalJs(result.expression, mx);
      if (isFinite(my) && my >= -50 && my <= 50) {
        const sy = toScreenY(my);
        if (!started) {
          ctx.moveTo(sx, sy);
          started = true;
        } else {
          ctx.lineTo(sx, sy);
        }
      } else {
        started = false;
      }
    }
    ctx.stroke();

    // Plot f'(x) (Sky Blue - Dashed)
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    started = false;
    for (let sx = 0; sx <= w; sx += 2) {
      const mx = xMin + (sx / w) * (xMax - xMin);
      const my = evalJs(result.firstDerivative, mx);
      if (isFinite(my) && my >= -50 && my <= 50) {
        const sy = toScreenY(my);
        if (!started) {
          ctx.moveTo(sx, sy);
          started = true;
        } else {
          ctx.lineTo(sx, sy);
        }
      } else {
        started = false;
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Plot Tangent Line at x0 (Pink/Amber)
    if (result.evalAt && isFinite(result.evalAt.fx0) && isFinite(result.evalAt.fPrimeX0)) {
      const x0 = result.evalAt.x0;
      const y0 = result.evalAt.fx0;
      const slope = result.evalAt.fPrimeX0;

      const tY = (x: number) => slope * (x - x0) + y0;

      ctx.strokeStyle = '#F43F5E';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(toScreenX(xMin), toScreenY(tY(xMin)));
      ctx.lineTo(toScreenX(xMax), toScreenY(tY(xMax)));
      ctx.stroke();

      // Point at (x0, f(x0))
      const px = toScreenX(x0);
      const py = toScreenY(y0);
      ctx.fillStyle = '#F43F5E';
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, [result]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12 select-none animate-in fade-in duration-200">
      {/* 1. Header Card */}
      <div 
        className="rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(24,24,27,0.95) 0%, rgba(13,148,136,0.3) 60%, rgba(56,189,248,0.2) 100%)'
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center shrink-0 shadow-lg">
              <TrendingUp className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Tính Đạo Hàm & Giải Chi Tiết</span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Step-by-Step
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 mt-0.5">
                Tính đạo hàm cấp 1, cấp 2, phương trình tiếp tuyến và phân tích chi tiết từng quy tắc giải tích.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Expression & Presets (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
            {/* Function Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>Nhập hàm số f(x):</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  placeholder="Ví dụ: x^3 - 3*x + 2, sin(x)*cos(x)..."
                  className="w-full bg-black/60 border border-white/15 focus:border-teal-400 rounded-2xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-teal-400/40 transition-all"
                />
              </div>
            </div>

            {/* Point x0 for evaluation */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-300">Tính tại điểm x₀ (Phương trình tiếp tuyến):</span>
                <span className="font-mono text-teal-400 font-bold">x₀ = {evalX}</span>
              </div>
              <input
                type="range"
                min="-4"
                max="4"
                step="0.5"
                value={evalX}
                onChange={(e) => setEvalX(parseFloat(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
            </div>

            {/* Presets */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Bài toán đạo hàm mẫu:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_EXPRESSIONS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      playPopSound();
                      setExpression(p.expr);
                    }}
                    className="p-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 border border-white/5 text-left transition-all cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                      {p.name}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">
                      {p.expr}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Derivative Results & Graph (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
            {/* Derivatives Box */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  Kết Quả Đạo Hàm
                </span>
              </div>

              {/* First Derivative */}
              <div className="p-4 rounded-2xl bg-black/60 border border-teal-500/40 relative group">
                <span className="text-[10px] font-mono text-teal-400 font-bold uppercase block mb-1">
                  Đạo hàm cấp 1: f'(x)
                </span>
                <div className="text-lg sm:text-xl font-black font-mono text-teal-300 tracking-wide">
                  {result?.firstDerivative || '...'}
                </div>
                <button
                  onClick={() => handleCopy(result?.firstDerivative || '', 'f1')}
                  className="absolute top-3 right-3 p-1.5 text-zinc-400 hover:text-white transition-colors"
                  title="Sao chép kết quả"
                >
                  {copiedKey === 'f1' ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Second Derivative */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 relative group">
                <span className="text-[10px] font-mono text-sky-400 font-bold uppercase block mb-1">
                  Đạo hàm cấp 2: f''(x)
                </span>
                <div className="text-sm sm:text-base font-bold font-mono text-sky-300">
                  {result?.secondDerivative || '...'}
                </div>
              </div>

              {/* Tangent Line & Evaluation at x0 */}
              {result?.evalAt && (
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
                    <span className="text-[10px] text-zinc-400 font-mono block">Hệ số góc tại x₀ = {result.evalAt.x0}</span>
                    <span className="text-base font-black font-mono text-amber-400">
                      k = f'({result.evalAt.x0}) = {result.evalAt.fPrimeX0.toFixed(3)}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/40 border border-rose-500/30 text-center">
                    <span className="text-[10px] text-zinc-400 font-mono block">Phương trình tiếp tuyến</span>
                    <span className="text-xs sm:text-sm font-bold font-mono text-rose-300">
                      {result.evalAt.tangentLine}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Visual Canvas Plot */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-bold text-white">Đồ thị minh họa tiếp tuyến:</span>
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <span className="text-emerald-400 flex items-center gap-1">• f(x)</span>
                  <span className="text-sky-400 flex items-center gap-1">• f'(x)</span>
                  <span className="text-rose-400 flex items-center gap-1">• Tiếp tuyến</span>
                </div>
              </div>
              <div className="w-full h-52 rounded-2xl bg-black/60 border border-white/10 overflow-hidden relative">
                <canvas ref={canvasRef} className="w-full h-full block" />
              </div>
            </div>

            {/* Step-by-Step Explanation Accordion */}
            {result && result.steps.length > 0 && (
              <div className="pt-2 border-t border-white/5">
                <button
                  onClick={() => setShowSteps(!showSteps)}
                  className="w-full flex items-center justify-between text-xs font-bold text-zinc-300 hover:text-white py-2 cursor-pointer"
                >
                  <span>Xem lời giải chi tiết từng bước ({result.steps.length} bước)</span>
                  {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showSteps && (
                  <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {result.steps.map((st, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            {st.title}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                            {st.ruleName}
                          </span>
                        </div>
                        <div className="text-xs font-mono font-bold text-white bg-black/40 p-2 rounded-xl border border-white/5">
                          {st.formula}
                        </div>
                        <p className="text-[11px] text-zinc-300 leading-relaxed">
                          {st.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DerivativeCalculatorTab;
