import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Calculator as CalcIcon,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { playPopSound } from '../../utils/sound';
import { toFraction } from '../../utils/mathSolver';

export const CasioFX580Tab: React.FC = () => {
  // Calculator Display state
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [ans, setAns] = useState('0');
  const [isShift, setIsShift] = useState(false);
  const [isAlpha, setIsAlpha] = useState(false);
  const [angleUnit, setAngleUnit] = useState<'deg' | 'rad'>('deg');
  const [displayMode, setDisplayMode] = useState<'decimal' | 'fraction'>('decimal');
  const [history, setHistory] = useState<{ expr: string; res: string }[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copied, setCopied] = useState(false);

  // Play button click sound
  const handleKeyClick = (val: string, action?: () => void) => {
    if (soundEnabled) {
      playPopSound();
    }
    if (action) {
      action();
      return;
    }

    if (val === 'AC') {
      setExpression('');
      setResult('0');
      setIsShift(false);
      setIsAlpha(false);
      return;
    }

    if (val === 'DEL') {
      setExpression((prev) => prev.slice(0, -1));
      return;
    }

    if (val === '=') {
      evaluateExpression();
      return;
    }

    if (val === 'Ans') {
      setExpression((prev) => prev + (ans !== '0' ? ans : ''));
      return;
    }

    if (val === 'S<=>D') {
      toggleFractionDecimal();
      return;
    }

    setExpression((prev) => prev + val);
    setIsShift(false);
    setIsAlpha(false);
  };

  // Safe evaluation
  const evaluateExpression = () => {
    if (!expression.trim()) return;
    try {
      let js = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/\^/g, '**')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/sin\(/g, angleUnit === 'deg' ? 'Math.sin((Math.PI/180)*' : 'Math.sin(')
        .replace(/cos\(/g, angleUnit === 'deg' ? 'Math.cos((Math.PI/180)*' : 'Math.cos(')
        .replace(/tan\(/g, angleUnit === 'deg' ? 'Math.tan((Math.PI/180)*' : 'Math.tan(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/log\(/g, 'Math.log10(');

      // Evaluate
      const fn = new Function(`return (${js});`);
      const val = fn();

      if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
        const rounded = Number(val.toFixed(10));
        const resStr = String(rounded);
        setResult(resStr);
        setAns(resStr);
        setHistory((prev) => [{ expr: expression, res: resStr }, ...prev.slice(0, 9)]);
      } else {
        setResult('Math ERROR');
      }
    } catch {
      setResult('Syntax ERROR');
    }
  };

  const toggleFractionDecimal = () => {
    const num = parseFloat(result);
    if (!isNaN(num) && isFinite(num)) {
      if (displayMode === 'decimal') {
        const frac = toFraction(num);
        setResult(frac);
        setDisplayMode('fraction');
      } else {
        setResult(String(num));
        setDisplayMode('decimal');
      }
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12 select-none animate-in fade-in duration-200">
      {/* 1. Header Card */}
      <div 
        className="rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(24,24,27,0.95) 0%, rgba(39,39,42,0.9) 60%, rgba(59,130,246,0.2) 100%)'
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0 shadow-lg">
              <CalcIcon className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Máy Tính Casio fx-580VN X</span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  ClassWiz Edition
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 mt-0.5">
                Mô phỏng máy tính khoa học quốc dân Casio fx-580VN X với màn hình Natural Textbook, đầy đủ phím chức năng.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-blue-600/30 border-blue-500/50 text-blue-300'
                  : 'bg-zinc-800 border-white/10 text-zinc-500'
              }`}
              title={soundEnabled ? 'Tắt âm thanh phím' : 'Bật âm thanh phím'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                setAngleUnit(angleUnit === 'deg' ? 'rad' : 'deg');
                playPopSound();
              }}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white border border-white/10 transition-colors cursor-pointer"
            >
              Đơn vị góc: <span className="text-blue-400 uppercase">{angleUnit}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Casio fx-580VN X Hardware Chassis */}
      <div className="flex justify-center">
        <div 
          className="w-full max-w-[390px] sm:max-w-[420px] rounded-[36px] p-5 sm:p-6 border-4 border-zinc-800 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden"
          style={{
            background: 'radial-gradient(circle at 50% 10%, #27272a 0%, #18181b 60%, #09090b 100%)',
          }}
        >
          {/* Brand header */}
          <div className="flex items-center justify-between px-2 pb-3 border-b border-white/10">
            <div className="text-left">
              <span className="font-black text-sm tracking-wider text-white">CASIO</span>
              <span className="text-[10px] text-zinc-400 ml-2 font-mono">fx-580VN X</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black tracking-widest text-zinc-400 uppercase">CLASSWIZ</span>
              <div className="w-8 h-3.5 rounded bg-zinc-800 border border-white/10 flex items-center justify-center">
                <span className="text-[7.5px] font-mono text-zinc-400">SOLAR</span>
              </div>
            </div>
          </div>

          {/* LCD Natural Textbook Screen */}
          <div 
            className="my-4 rounded-2xl p-4 border-2 border-zinc-700/80 shadow-inner relative flex flex-col justify-between min-h-[110px]"
            style={{
              backgroundColor: '#a3b899', // Classic retro Casio greenish-grey LCD
              color: '#1a2416'
            }}
          >
            {/* Top Status Bar Indicators */}
            <div className="flex items-center justify-between text-[9px] font-mono font-bold select-none opacity-85">
              <div className="flex items-center gap-2">
                <span className={isShift ? 'bg-black text-[#a3b899] px-1 rounded' : 'opacity-30'}>S</span>
                <span className={isAlpha ? 'bg-black text-[#a3b899] px-1 rounded' : 'opacity-30'}>A</span>
                <span className="opacity-30">M</span>
                <span className="px-1 rounded bg-black/20">{angleUnit === 'deg' ? 'D' : 'R'}</span>
                <span className="opacity-30">FIX</span>
                <span className="opacity-30">SCI</span>
              </div>
              <span className="text-[8.5px] opacity-75">Math▲▼</span>
            </div>

            {/* Input Expression Line */}
            <div className="text-right text-base sm:text-lg font-mono font-bold tracking-wider truncate py-1">
              {expression || '0'}
              <span className="inline-block w-2 h-4 bg-black/70 animate-pulse ml-0.5 align-middle" />
            </div>

            {/* Output Result Line */}
            <div className="flex items-center justify-between pt-1 border-t border-black/10">
              <span className="text-[10px] font-mono opacity-60">Ans</span>
              <div className="text-right text-xl sm:text-2xl font-black font-mono tracking-tight text-black">
                {result}
              </div>
            </div>
          </div>

          {/* Function & Directional Controls Row */}
          <div className="grid grid-cols-5 gap-2 pt-1 pb-3 items-center">
            {/* SHIFT */}
            <button
              onClick={() => {
                setIsShift(!isShift);
                playPopSound();
              }}
              className={`h-9 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md ${
                isShift
                  ? 'bg-amber-400 text-black scale-95'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-amber-400/40'
              }`}
            >
              SHIFT
            </button>

            {/* ALPHA */}
            <button
              onClick={() => {
                setIsAlpha(!isAlpha);
                playPopSound();
              }}
              className={`h-9 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md ${
                isAlpha
                  ? 'bg-rose-400 text-black scale-95'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-rose-400 border border-rose-400/40'
              }`}
            >
              ALPHA
            </button>

            {/* Directional Pad Center */}
            <div className="flex items-center justify-center">
              <div className="w-12 h-10 rounded-2xl bg-zinc-800 border border-zinc-600 flex items-center justify-center shadow-inner">
                <div className="grid grid-cols-3 gap-0.5 text-zinc-400">
                  <div />
                  <ChevronUp className="w-3.5 h-3.5 cursor-pointer hover:text-white" onClick={() => handleKeyClick('▲')} />
                  <div />
                  <ChevronLeft className="w-3.5 h-3.5 cursor-pointer hover:text-white" onClick={() => handleKeyClick('◀')} />
                  <div className="w-2 h-2 rounded-full bg-zinc-500 m-auto" />
                  <ChevronRight className="w-3.5 h-3.5 cursor-pointer hover:text-white" onClick={() => handleKeyClick('▶')} />
                  <div />
                  <ChevronDown className="w-3.5 h-3.5 cursor-pointer hover:text-white" onClick={() => handleKeyClick('▼')} />
                  <div />
                </div>
              </div>
            </div>

            {/* MENU / SETUP */}
            <button
              onClick={() => handleKeyClick('MENU')}
              className="h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-bold border border-white/10 cursor-pointer shadow-md"
            >
              MENU
            </button>

            {/* ON */}
            <button
              onClick={() => handleKeyClick('AC')}
              className="h-9 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black cursor-pointer shadow-md"
            >
              ON
            </button>
          </div>

          {/* Scientific Operations Grid (Top Section) */}
          <div className="grid grid-cols-6 gap-1.5 pb-2">
            {[
              { label: 'x/y', val: '/' },
              { label: '√', val: '√(' },
              { label: 'x²', val: '^2' },
              { label: 'xⁿ', val: '^' },
              { label: 'log', val: 'log(' },
              { label: 'ln', val: 'ln(' },
              { label: '(-)', val: '-' },
              { label: 'o\'\'\'', val: '°' },
              { label: 'hyp', val: '' },
              { label: 'sin', val: 'sin(' },
              { label: 'cos', val: 'cos(' },
              { label: 'tan', val: 'tan(' },
              { label: 'RCL', val: '' },
              { label: 'ENG', val: '' },
              { label: '(', val: '(' },
              { label: ')', val: ')' },
              { label: 'S<=>D', val: 'S<=>D' },
              { label: 'M+', val: '' },
            ].map((k, idx) => (
              <button
                key={idx}
                onClick={() => handleKeyClick(k.val)}
                className="h-8 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 text-[11px] font-bold text-zinc-200 border border-white/5 active:scale-95 transition-transform cursor-pointer"
              >
                {k.label}
              </button>
            ))}
          </div>

          {/* Numeric Keypad & Basic Operations (Bottom Section) */}
          <div className="grid grid-cols-5 gap-2 pt-2 border-t border-white/10">
            {/* Row 1 */}
            <button onClick={() => handleKeyClick('7')} className="h-11 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-lg font-bold text-white shadow-md active:scale-95 cursor-pointer">7</button>
            <button onClick={() => handleKeyClick('8')} className="h-11 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-lg font-bold text-white shadow-md active:scale-95 cursor-pointer">8</button>
            <button onClick={() => handleKeyClick('9')} className="h-11 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-lg font-bold text-white shadow-md active:scale-95 cursor-pointer">9</button>
            <button onClick={() => handleKeyClick('DEL')} className="h-11 rounded-2xl bg-amber-600 hover:bg-amber-500 text-black font-extrabold text-sm shadow-md active:scale-95 cursor-pointer">DEL</button>
            <button onClick={() => handleKeyClick('AC')} className="h-11 rounded-2xl bg-amber-600 hover:bg-amber-500 text-black font-extrabold text-sm shadow-md active:scale-95 cursor-pointer">AC</button>

            {/* Row 2 */}
            <button onClick={() => handleKeyClick('4')} className="h-11 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-lg font-bold text-white shadow-md active:scale-95 cursor-pointer">4</button>
            <button onClick={() => handleKeyClick('5')} className="h-11 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-lg font-bold text-white shadow-md active:scale-95 cursor-pointer">5</button>
            <button onClick={() => handleKeyClick('6')} className="h-11 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-lg font-bold text-white shadow-md active:scale-95 cursor-pointer">6</button>
            <button onClick={() => handleKeyClick('×')} className="h-11 rounded-2xl bg-zinc-700 hover:bg-zinc-600 text-lg font-bold text-white shadow-md active:scale-95 cursor-pointer">×</button>
            <button onClick={() => handleKeyClick('÷')} className="h-11 rounded-2xl bg-zinc-700 hover:bg-zinc-600 text-lg font-bold text-white shadow-md active:scale-95 cursor-pointer">÷</button>

            {/* Row 3 */}
            <button onClick={() => handleKeyClick('1')} className="h-11 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-lg font-bold text-white shadow-md active:scale-95 cursor-pointer">1</button>
            <button onClick={() => handleKeyClick('2')} className="h-11 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-lg font-bold text-white shadow-md active:scale-95 cursor-pointer">2</button>
            <button onClick={() => handleKeyClick('3')} className="h-11 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-lg font-bold text-white shadow-md active:scale-95 cursor-pointer">3</button>
            <button onClick={() => handleKeyClick('+')} className="h-11 rounded-2xl bg-zinc-700 hover:bg-zinc-600 text-lg font-bold text-white shadow-md active:scale-95 cursor-pointer">+</button>
            <button onClick={() => handleKeyClick('-')} className="h-11 rounded-2xl bg-zinc-700 hover:bg-zinc-600 text-lg font-bold text-white shadow-md active:scale-95 cursor-pointer">-</button>

            {/* Row 4 */}
            <button onClick={() => handleKeyClick('0')} className="h-11 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-lg font-bold text-white shadow-md active:scale-95 cursor-pointer">0</button>
            <button onClick={() => handleKeyClick('.')} className="h-11 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-lg font-bold text-white shadow-md active:scale-95 cursor-pointer">.</button>
            <button onClick={() => handleKeyClick('*10^')} className="h-11 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white shadow-md active:scale-95 cursor-pointer">x10ˣ</button>
            <button onClick={() => handleKeyClick('Ans')} className="h-11 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white shadow-md active:scale-95 cursor-pointer">Ans</button>
            <button onClick={() => handleKeyClick('=')} className="h-11 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xl font-black shadow-md active:scale-95 cursor-pointer">=</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasioFX580Tab;
