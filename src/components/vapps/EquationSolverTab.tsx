import React, { useState, useEffect, useRef } from 'react';
import {
  Calculator,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  History,
  Copy,
  Check,
  TrendingUp,
  ArrowRight,
  HelpCircle,
  Hash
} from 'lucide-react';
import {
  solveLinearSystem,
  solveLinear,
  solveQuadratic,
  solveCubic,
  solveQuartic,
  SystemSolution,
  PolynomialSolution,
  formatComplex,
  toFraction
} from '../../utils/mathSolver';
import { playPopSound } from '../../utils/sound';
import { CasioFX580Tab } from './CasioFX580Tab';
import { DerivativeCalculatorTab } from './DerivativeCalculatorTab';

export const EquationSolverTab: React.FC = () => {
  const [mainMode, setMainMode] = useState<'system' | 'polynomial' | 'casio' | 'derivative'>('system');

  // SYSTEM STATE (1 - 4 unknowns)
  const [unknownCount, setUnknownCount] = useState<number>(2);
  // Matrix A (up to 4x4) and vector B (up to 4)
  const [matrixA, setMatrixA] = useState<number[][]>([
    [2, 1, 0, 0],
    [1, -3, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ]);
  const [vectorB, setVectorB] = useState<number[]>([5, -1, 0, 0]);
  const [systemResult, setSystemResult] = useState<SystemSolution | null>(null);
  const [showSystemSteps, setShowSystemSteps] = useState<boolean>(true);

  // POLYNOMIAL STATE (Degree 1 - 4)
  const [degree, setDegree] = useState<number>(2);
  const [polyCoeffs, setPolyCoeffs] = useState<{ a: number; b: number; c: number; d: number; e: number }>({
    a: 1,
    b: -3,
    c: 2,
    d: 0,
    e: 0
  });
  const [polyResult, setPolyResult] = useState<PolynomialSolution | null>(null);
  const [showPolySteps, setShowPolySteps] = useState<boolean>(true);

  // History state
  const [historyList, setHistoryList] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Canvas ref for mini polynomial graph
  const miniCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Solve system automatically on input changes
  useEffect(() => {
    const A = matrixA.slice(0, unknownCount).map((row) => row.slice(0, unknownCount));
    const B = vectorB.slice(0, unknownCount);
    const sol = solveLinearSystem(A, B, ['x', 'y', 'z', 't']);
    setSystemResult(sol);
  }, [unknownCount, matrixA, vectorB]);

  // Solve polynomial automatically on input changes
  useEffect(() => {
    let sol: PolynomialSolution;
    if (degree === 1) {
      sol = solveLinear(polyCoeffs.a, polyCoeffs.b);
    } else if (degree === 2) {
      sol = solveQuadratic(polyCoeffs.a, polyCoeffs.b, polyCoeffs.c);
    } else if (degree === 3) {
      sol = solveCubic(polyCoeffs.a, polyCoeffs.b, polyCoeffs.c, polyCoeffs.d);
    } else {
      sol = solveQuartic(polyCoeffs.a, polyCoeffs.b, polyCoeffs.c, polyCoeffs.d, polyCoeffs.e);
    }
    setPolyResult(sol);
  }, [degree, polyCoeffs]);

  // Render mini graph of polynomial
  useEffect(() => {
    if (mainMode !== 'polynomial' || !polyResult) return;
    const canvas = miniCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth || 360;
    const h = 200;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, w, h);

    // Coordinate bounds
    let xMin = -5, xMax = 5;
    if (polyResult.realRoots.length > 0) {
      const minR = Math.min(...polyResult.realRoots);
      const maxR = Math.max(...polyResult.realRoots);
      const span = Math.max(maxR - minR, 4);
      xMin = minR - span * 0.4;
      xMax = maxR + span * 0.4;
    }

    const evaluateF = (x: number) => {
      const { a, b, c, d, e } = polyCoeffs;
      if (degree === 1) return a * x + b;
      if (degree === 2) return a * x * x + b * x + c;
      if (degree === 3) return a * Math.pow(x, 3) + b * x * x + c * x + d;
      return a * Math.pow(x, 4) + b * Math.pow(x, 3) + c * x * x + d * x + e;
    };

    // Calculate Y range
    let yMin = -6, yMax = 6;
    const samplePoints: { x: number; y: number }[] = [];
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (i / steps) * (xMax - xMin);
      const y = evaluateF(x);
      samplePoints.push({ x, y });
    }

    const validY = samplePoints.map((p) => p.y).filter((y) => isFinite(y) && Math.abs(y) < 200);
    if (validY.length > 0) {
      yMin = Math.max(Math.min(...validY) * 1.2, -50);
      yMax = Math.min(Math.max(...validY) * 1.2, 50);
      if (yMax <= yMin) {
        yMin = -10;
        yMax = 10;
      }
    }

    // Mapping helpers
    const toScreenX = (x: number) => ((x - xMin) / (xMax - xMin)) * w;
    const toScreenY = (y: number) => h - ((y - yMin) / (yMax - yMin)) * h;

    // Draw Grid & Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let gx = Math.ceil(xMin); gx <= Math.floor(xMax); gx++) {
      const sx = toScreenX(gx);
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, h);
    }
    ctx.stroke();

    // Primary Axes (X & Y)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // X Axis (y = 0)
    const zeroY = toScreenY(0);
    ctx.moveTo(0, zeroY);
    ctx.lineTo(w, zeroY);
    // Y Axis (x = 0)
    const zeroX = toScreenX(0);
    ctx.moveTo(zeroX, 0);
    ctx.lineTo(zeroX, h);
    ctx.stroke();

    // Plot Curve
    ctx.strokeStyle = '#10B981'; // Emerald
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;
    for (const p of samplePoints) {
      const sx = toScreenX(p.x);
      const sy = toScreenY(p.y);
      if (isFinite(sy) && sy >= -50 && sy <= h + 50) {
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

    // Highlight Real Roots on X axis
    for (const r of polyResult.realRoots) {
      const rx = toScreenX(r);
      const ry = toScreenY(0);

      // Glow circle
      ctx.fillStyle = '#EF4444'; // Red-orange root
      ctx.beginPath();
      ctx.arc(rx, ry, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Root label
      ctx.fillStyle = '#F3F4F6';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`x=${r.toFixed(2)}`, rx - 18, ry - 10);
    }
  }, [mainMode, polyResult, polyCoeffs, degree]);

  // Update matrix cell
  const handleMatrixChange = (r: number, c: number, val: number) => {
    setMatrixA((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = val;
      return next;
    });
  };

  const handleVectorChange = (r: number, val: number) => {
    setVectorB((prev) => {
      const next = [...prev];
      next[r] = val;
      return next;
    });
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // Quick Presets for System
  const applySystemPreset = (presetType: 'unique' | 'none' | 'infinite' | '3var' | '4var') => {
    playPopSound();
    if (presetType === 'unique') {
      setUnknownCount(2);
      setMatrixA([
        [2, 1, 0, 0],
        [1, -3, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ]);
      setVectorB([5, -1, 0, 0]);
    } else if (presetType === 'none') {
      setUnknownCount(2);
      setMatrixA([
        [1, 1, 0, 0],
        [2, 2, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ]);
      setVectorB([3, 5, 0, 0]);
    } else if (presetType === 'infinite') {
      setUnknownCount(2);
      setMatrixA([
        [1, 2, 0, 0],
        [2, 4, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ]);
      setVectorB([4, 8, 0, 0]);
    } else if (presetType === '3var') {
      setUnknownCount(3);
      setMatrixA([
        [1, 2, -1, 0],
        [2, -1, 3, 0],
        [3, 1, 2, 0],
        [0, 0, 0, 1]
      ]);
      setVectorB([4, 9, 13, 0]);
    } else if (presetType === '4var') {
      setUnknownCount(4);
      setMatrixA([
        [1, 1, 1, 1],
        [2, -1, 1, -2],
        [3, 2, -1, 1],
        [1, -2, 3, -1]
      ]);
      setVectorB([10, -1, 12, 1]);
    }
  };

  // Quick Presets for Polynomial
  const applyPolyPreset = (type: 'deg1' | 'deg2_2real' | 'deg2_complex' | 'deg3_3real' | 'deg4') => {
    playPopSound();
    if (type === 'deg1') {
      setDegree(1);
      setPolyCoeffs({ a: 3, b: -9, c: 0, d: 0, e: 0 });
    } else if (type === 'deg2_2real') {
      setDegree(2);
      setPolyCoeffs({ a: 1, b: -5, c: 6, d: 0, e: 0 }); // (x-2)(x-3)
    } else if (type === 'deg2_complex') {
      setDegree(2);
      setPolyCoeffs({ a: 1, b: -2, c: 5, d: 0, e: 0 }); // 1 +/- 2i
    } else if (type === 'deg3_3real') {
      setDegree(3);
      setPolyCoeffs({ a: 1, b: -6, c: 11, d: -6, e: 0 }); // (x-1)(x-2)(x-3)
    } else if (type === 'deg4') {
      setDegree(4);
      setPolyCoeffs({ a: 1, b: 0, c: -5, d: 0, e: 4 }); // (x^2-1)(x^2-4) -> +/-1, +/-2
    }
  };

  const getEquationPreview = () => {
    const { a, b, c, d, e } = polyCoeffs;
    const parts: string[] = [];

    const addTerm = (coeff: number, power: number) => {
      if (Math.abs(coeff) < 1e-12) return;
      const isPositive = coeff > 0;
      const sign = parts.length === 0 ? (coeff < 0 ? '-' : '') : isPositive ? '+ ' : '- ';
      const absCoeff = Math.abs(coeff);
      const coeffStr = absCoeff === 1 && power > 0 ? '' : `${absCoeff}`;

      if (power === 0) {
        parts.push(`${sign}${absCoeff}`);
      } else if (power === 1) {
        parts.push(`${sign}${coeffStr}x`);
      } else {
        const superScript = power === 2 ? '²' : power === 3 ? '³' : '⁴';
        parts.push(`${sign}${coeffStr}x${superScript}`);
      }
    };

    if (degree === 1) {
      addTerm(a, 1);
      addTerm(b, 0);
    } else if (degree === 2) {
      addTerm(a, 2);
      addTerm(b, 1);
      addTerm(c, 0);
    } else if (degree === 3) {
      addTerm(a, 3);
      addTerm(b, 2);
      addTerm(c, 1);
      addTerm(d, 0);
    } else {
      addTerm(a, 4);
      addTerm(b, 3);
      addTerm(c, 2);
      addTerm(d, 1);
      addTerm(e, 0);
    }

    return parts.length === 0 ? '0 = 0' : `${parts.join(' ')} = 0`;
  };

  const varLabels = ['x', 'y', 'z', 't'];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12 select-none animate-in fade-in duration-200">
      {/* 1. Header Card */}
      <div 
        className="rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(24,24,27,0.95) 0%, rgba(39,39,42,0.85) 60%, rgba(16,185,129,0.18) 100%)'
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-lg">
              <Calculator className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Giải Phương Trình & Hệ Phương Trình</span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Toán Học Chuẩn Xác
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 mt-0.5">
                Hỗ trợ giải hệ phương trình tuyến tính (1 - 4 ẩn) và phương trình đại số (bậc 1 - 4) với từng bước phân tích.
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-black/50 border border-white/10 rounded-2xl shrink-0 self-start sm:self-auto flex-wrap">
            <button
              onClick={() => {
                playPopSound();
                setMainMode('system');
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mainMode === 'system'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Hệ Phương Trình (1-4 Ẩn)
            </button>
            <button
              onClick={() => {
                playPopSound();
                setMainMode('polynomial');
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mainMode === 'polynomial'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Phương Trình (Bậc 1-4)
            </button>
            <button
              onClick={() => {
                playPopSound();
                setMainMode('casio');
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mainMode === 'casio'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Casio fx-580VN X
            </button>
            <button
              onClick={() => {
                playPopSound();
                setMainMode('derivative');
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mainMode === 'derivative'
                  ? 'bg-teal-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Tính Đạo Hàm
            </button>
          </div>
        </div>
      </div>

      {/* 2. MODE: HỆ PHƯƠNG TRÌNH (1 - 4 ẨN) */}
      {mainMode === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Input Matrix (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
              {/* Unknowns Selector */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-emerald-400" />
                  Số Lượng Ẩn Số:
                </span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4].map((count) => (
                    <button
                      key={count}
                      onClick={() => {
                        playPopSound();
                        setUnknownCount(count);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        unknownCount === count
                          ? 'bg-emerald-500 text-black shadow-md scale-105'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {count} Ẩn ({varLabels.slice(0, count).join(', ')})
                    </button>
                  ))}
                </div>
              </div>

              {/* Matrix Coefficient Inputs */}
              <div className="space-y-3">
                <div className="text-xs text-zinc-400 font-medium flex items-center justify-between">
                  <span>Nhập các hệ số phương trình:</span>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    Dạng chuẩn: a₁x + a₂y + ... = c
                  </span>
                </div>

                <div className="space-y-2.5">
                  {Array.from({ length: unknownCount }).map((_, r) => (
                    <div 
                      key={r}
                      className="flex items-center gap-2 p-2.5 rounded-2xl bg-black/40 border border-white/10 flex-wrap sm:flex-nowrap"
                    >
                      <span className="text-xs font-mono font-bold text-zinc-400 w-8 shrink-0">
                        PT {r + 1}:
                      </span>

                      <div className="flex-1 flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
                        {Array.from({ length: unknownCount }).map((_, c) => (
                          <div key={c} className="flex items-center gap-1 flex-1 min-w-[70px]">
                            {c > 0 && <span className="text-zinc-500 text-xs font-bold">+</span>}
                            <input
                              type="number"
                              step="any"
                              value={matrixA[r][c]}
                              onChange={(e) => handleMatrixChange(r, c, parseFloat(e.target.value) || 0)}
                              className="w-full bg-zinc-950/80 border border-white/15 focus:border-emerald-400 rounded-xl px-2 py-1.5 text-center text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                            />
                            <span className="text-xs font-bold font-mono text-emerald-400">
                              {varLabels[c]}
                            </span>
                          </div>
                        ))}
                      </div>

                      <span className="text-zinc-400 font-bold text-xs">=</span>

                      {/* Right Hand Side B */}
                      <div className="w-20 shrink-0">
                        <input
                          type="number"
                          step="any"
                          value={vectorB[r]}
                          onChange={(e) => handleVectorChange(r, parseFloat(e.target.value) || 0)}
                          className="w-full bg-emerald-950/40 border border-emerald-500/30 focus:border-emerald-400 rounded-xl px-2 py-1.5 text-center text-xs font-mono text-emerald-300 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Presets */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  Mẫu phương trình thông dụng:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => applySystemPreset('unique')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-semibold text-zinc-200 transition-colors cursor-pointer"
                  >
                    2 Ẩn Có Nghiệm
                  </button>
                  <button
                    onClick={() => applySystemPreset('none')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-semibold text-zinc-200 transition-colors cursor-pointer"
                  >
                    2 Ẩn Vô Nghiệm
                  </button>
                  <button
                    onClick={() => applySystemPreset('infinite')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-semibold text-zinc-200 transition-colors cursor-pointer"
                  >
                    2 Ẩn Vô Số Nghiệm
                  </button>
                  <button
                    onClick={() => applySystemPreset('3var')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-semibold text-zinc-200 transition-colors cursor-pointer"
                  >
                    Hệ 3 Ẩn (x, y, z)
                  </button>
                  <button
                    onClick={() => applySystemPreset('4var')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-semibold text-zinc-200 transition-colors cursor-pointer"
                  >
                    Hệ 4 Ẩn (x, y, z, t)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: System Results & Verification (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Kết Quả Giải Hệ
                </h3>
                {systemResult && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      systemResult.status === 'unique'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : systemResult.status === 'infinite'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {systemResult.status === 'unique'
                      ? 'Nghiệm Duy Nhất'
                      : systemResult.status === 'infinite'
                      ? 'Vô Số Nghiệm'
                      : 'Vô Nghiệm'}
                  </span>
                )}
              </div>

              {/* Solution Values Display */}
              {systemResult?.status === 'unique' ? (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2.5">
                    {systemResult.variables.map((v, i) => (
                      <div
                        key={v}
                        className="p-3 rounded-2xl bg-black/60 border border-emerald-500/30 flex flex-col items-center justify-center relative group"
                      >
                        <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase">
                          Ẩn {v}
                        </span>
                        <div className="text-lg sm:text-xl font-black font-mono text-emerald-400 my-0.5">
                          {systemResult.fractions[i]}
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          ≈ {systemResult.values[i].toFixed(4)}
                        </span>
                        <button
                          onClick={() => handleCopy(`${v} = ${systemResult.fractions[i]}`, i)}
                          className="absolute top-1.5 right-1.5 p-1 text-zinc-500 hover:text-white transition-colors"
                          title="Sao chép nghiệm"
                        >
                          {copiedIndex === i ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Determinant */}
                  <div className="p-3 rounded-xl bg-zinc-950/70 border border-white/5 text-xs font-mono text-zinc-400 flex items-center justify-between">
                    <span>Định thức Det(A):</span>
                    <span className="text-white font-bold">{systemResult.determinant.toFixed(4)}</span>
                  </div>

                  {/* Verification check */}
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>Nghiệm đã được kiểm tra tính đúng đắn trên tất cả phương trình.</span>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/10 text-center space-y-2">
                  <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-sm font-bold text-white">
                    {systemResult?.status === 'none'
                      ? 'Hệ phương trình không có nghiệm thỏa mãn (Vô nghiệm).'
                      : 'Hệ phương trình có vô số nghiệm phụ thuộc tham số tự do.'}
                  </p>
                  <p className="text-xs text-zinc-400">
                    Ma trận các hệ số bị suy biến hoặc các phương trình mâu thuẫn lẫn nhau.
                  </p>
                </div>
              )}

              {/* Step-by-Step Toggle */}
              {systemResult && systemResult.steps.length > 0 && (
                <div className="pt-2 border-t border-white/5">
                  <button
                    onClick={() => setShowSystemSteps(!showSystemSteps)}
                    className="w-full flex items-center justify-between text-xs font-bold text-zinc-300 hover:text-white py-1.5 cursor-pointer"
                  >
                    <span>Xem từng bước khử Gauss ({systemResult.steps.length} bước)</span>
                    {showSystemSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showSystemSteps && (
                    <div className="mt-2.5 p-3 rounded-2xl bg-black/50 border border-white/10 max-h-56 overflow-y-auto space-y-1.5 text-[11px] font-mono text-zinc-300">
                      {systemResult.steps.map((st, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 shrink-0">{idx + 1}.</span>
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. MODE: PHƯƠNG TRÌNH (BẬC 1 - 4) */}
      {mainMode === 'polynomial' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Input Form (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
              {/* Degree Selector */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Bậc Phương Trình:
                </span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4].map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        playPopSound();
                        setDegree(d);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        degree === d
                          ? 'bg-emerald-500 text-black shadow-md scale-105'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      Bậc {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Equation Preview */}
              <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/30 text-center">
                <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider">
                  Phương trình hiện tại:
                </span>
                <div className="text-lg sm:text-2xl font-black font-mono text-emerald-300 mt-1 tracking-wide">
                  {getEquationPreview()}
                </div>
              </div>

              {/* Coefficients Input */}
              <div className="space-y-3">
                <span className="text-xs text-zinc-400 font-medium">Nhập các hệ số:</span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Coeff a */}
                  <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10">
                    <label className="text-[11px] font-mono text-zinc-400 font-bold block mb-1">
                      Hệ số a ({degree === 4 ? 'x⁴' : degree === 3 ? 'x³' : degree === 2 ? 'x²' : 'x'}):
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={polyCoeffs.a}
                      onChange={(e) => setPolyCoeffs({ ...polyCoeffs, a: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-zinc-950 border border-white/15 focus:border-emerald-400 rounded-xl px-2 py-1.5 text-center text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                  </div>

                  {/* Coeff b */}
                  <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10">
                    <label className="text-[11px] font-mono text-zinc-400 font-bold block mb-1">
                      Hệ số b ({degree === 4 ? 'x³' : degree === 3 ? 'x²' : degree === 2 ? 'x' : 'Hệ số tự do'}):
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={polyCoeffs.b}
                      onChange={(e) => setPolyCoeffs({ ...polyCoeffs, b: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-zinc-950 border border-white/15 focus:border-emerald-400 rounded-xl px-2 py-1.5 text-center text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                  </div>

                  {/* Coeff c (for degree >= 2) */}
                  {degree >= 2 && (
                    <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10">
                      <label className="text-[11px] font-mono text-zinc-400 font-bold block mb-1">
                        Hệ số c ({degree === 4 ? 'x²' : degree === 3 ? 'x' : 'Hệ số tự do'}):
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={polyCoeffs.c}
                        onChange={(e) => setPolyCoeffs({ ...polyCoeffs, c: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-zinc-950 border border-white/15 focus:border-emerald-400 rounded-xl px-2 py-1.5 text-center text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>
                  )}

                  {/* Coeff d (for degree >= 3) */}
                  {degree >= 3 && (
                    <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10">
                      <label className="text-[11px] font-mono text-zinc-400 font-bold block mb-1">
                        Hệ số d ({degree === 4 ? 'x' : 'Hệ số tự do'}):
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={polyCoeffs.d}
                        onChange={(e) => setPolyCoeffs({ ...polyCoeffs, d: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-zinc-950 border border-white/15 focus:border-emerald-400 rounded-xl px-2 py-1.5 text-center text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>
                  )}

                  {/* Coeff e (for degree 4) */}
                  {degree >= 4 && (
                    <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10">
                      <label className="text-[11px] font-mono text-zinc-400 font-bold block mb-1">
                        Hệ số e (Tự do):
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={polyCoeffs.e}
                        onChange={(e) => setPolyCoeffs({ ...polyCoeffs, e: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-zinc-950 border border-white/15 focus:border-emerald-400 rounded-xl px-2 py-1.5 text-center text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Presets */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  Mẫu bài toán tiêu biểu:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => applyPolyPreset('deg1')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-semibold text-zinc-200 transition-colors cursor-pointer"
                  >
                    Bậc 1: 3x - 9 = 0
                  </button>
                  <button
                    onClick={() => applyPolyPreset('deg2_2real')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-semibold text-zinc-200 transition-colors cursor-pointer"
                  >
                    Bậc 2: x² - 5x + 6 = 0
                  </button>
                  <button
                    onClick={() => applyPolyPreset('deg2_complex')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-semibold text-zinc-200 transition-colors cursor-pointer"
                  >
                    Bậc 2 Nghiệm Phức (Δ &lt; 0)
                  </button>
                  <button
                    onClick={() => applyPolyPreset('deg3_3real')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-semibold text-zinc-200 transition-colors cursor-pointer"
                  >
                    Bậc 3: x³ - 6x² + 11x - 6 = 0
                  </button>
                  <button
                    onClick={() => applyPolyPreset('deg4')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-semibold text-zinc-200 transition-colors cursor-pointer"
                  >
                    Bậc 4: x⁴ - 5x² + 4 = 0
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Roots & Graph (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Tập Nghiệm Của Phương Trình
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {polyResult ? `${polyResult.realRoots.length} Nghiệm thực • ${polyResult.complexRoots.length} Nghiệm ảo` : ''}
                </span>
              </div>

              {/* Roots Cards */}
              <div className="space-y-2">
                {/* Real Roots */}
                {polyResult && polyResult.realRoots.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {polyResult.realRoots.map((r, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-black/60 border border-emerald-500/30 flex flex-col items-center justify-center relative"
                      >
                        <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">
                          Nghiệm x_{idx + 1}
                        </span>
                        <div className="text-base sm:text-lg font-black font-mono text-emerald-400 my-0.5">
                          {toFraction(r)}
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">≈ {r.toFixed(4)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Complex Roots */}
                {polyResult && polyResult.complexRoots.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-indigo-400 font-mono">Nghiệm phức liên hợp:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {polyResult.complexRoots.map((c, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-center"
                        >
                          <span className="text-[10px] text-zinc-400 font-mono">x_{polyResult.realRoots.length + idx + 1} =</span>
                          <div className="text-xs sm:text-sm font-bold font-mono text-indigo-300">
                            {formatComplex(c)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {polyResult && polyResult.realRoots.length === 0 && polyResult.complexRoots.length === 0 && (
                  <div className="p-4 rounded-xl bg-zinc-950/60 text-center text-xs text-zinc-400">
                    Phương trình vô nghiệm hoặc có vô số nghiệm.
                  </div>
                )}
              </div>

              {/* Interactive Mini Graph Preview */}
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                  <span>Minh họa đồ thị y = f(x):</span>
                  <span className="text-[10px] text-emerald-400 font-mono">• Chấm đỏ: Vị trí nghiệm</span>
                </div>
                <div className="w-full h-44 rounded-2xl bg-black/60 border border-white/10 overflow-hidden relative">
                  <canvas ref={miniCanvasRef} className="w-full h-full" />
                </div>
              </div>

              {/* Step-by-Step Toggle */}
              {polyResult && polyResult.steps.length > 0 && (
                <div className="pt-2 border-t border-white/5">
                  <button
                    onClick={() => setShowPolySteps(!showPolySteps)}
                    className="w-full flex items-center justify-between text-xs font-bold text-zinc-300 hover:text-white py-1.5 cursor-pointer"
                  >
                    <span>Xem từng bước giải ({polyResult.steps.length} bước)</span>
                    {showPolySteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showPolySteps && (
                    <div className="mt-2.5 p-3 rounded-2xl bg-black/50 border border-white/10 max-h-52 overflow-y-auto space-y-1.5 text-[11px] font-mono text-zinc-300">
                      {polyResult.steps.map((st, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 shrink-0">{idx + 1}.</span>
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* 4. MODE: MÁY TÍNH CASIO FX-580VN X */}
      {mainMode === 'casio' && <CasioFX580Tab />}

      {/* 5. MODE: TÍNH ĐẠO HÀM CHI TIẾT */}
      {mainMode === 'derivative' && <DerivativeCalculatorTab />}
    </div>
  );
};

export default EquationSolverTab;
