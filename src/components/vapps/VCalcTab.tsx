import React, { useState } from "react";
import {
  Calculator,
  Binary,
  ArrowRightLeft,
  Delete,
  History,
  RotateCcw,
  Sparkles,
  Equal,
} from "lucide-react";
import { playPopSound } from "../../utils/sound";

export const VCalcTab: React.FC = () => {
  const [calcMode, setCalcMode] = useState<"basic" | "scientific" | "converter">("basic");

  // Basic & Scientific State
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [isRad, setIsRad] = useState(true);

  // Unit Converter State
  const [converterType, setConverterType] = useState<"length" | "weight" | "temp" | "currency" | "data">("length");
  const [fromVal, setFromVal] = useState("1");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("cm");

  // Basic Calc Button Handler
  const handleNumClick = (val: string) => {
    playPopSound();
    if (display === "0" || display === "Error") {
      setDisplay(val);
    } else {
      setDisplay((prev) => prev + val);
    }
  };

  const handleOpClick = (op: string) => {
    playPopSound();
    setEquation(`${display} ${op} `);
    setDisplay("0");
  };

  const handleClear = () => {
    playPopSound();
    setDisplay("0");
    setEquation("");
  };

  const handleBackspace = () => {
    playPopSound();
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const handleEquals = () => {
    playPopSound();
    try {
      const fullExpr = equation + display;
      const cleanExpr = fullExpr
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/π/g, `${Math.PI}`)
        .replace(/e/g, `${Math.E}`);

      // Safe evaluation with Function
      const evaluated = Function(`"use strict"; return (${cleanExpr})`)();
      const resStr = Number.isFinite(evaluated) ? `${evaluated}` : "Error";

      setHistory((prev) => [`${fullExpr} = ${resStr}`, ...prev.slice(0, 19)]);
      setDisplay(resStr);
      setEquation("");
    } catch {
      setDisplay("Error");
    }
  };

  const handleScientific = (fn: string) => {
    playPopSound();
    try {
      const num = parseFloat(display);
      if (isNaN(num)) return;
      let res = 0;
      switch (fn) {
        case "sin":
          res = isRad ? Math.sin(num) : Math.sin((num * Math.PI) / 180);
          break;
        case "cos":
          res = isRad ? Math.cos(num) : Math.cos((num * Math.PI) / 180);
          break;
        case "tan":
          res = isRad ? Math.tan(num) : Math.tan((num * Math.PI) / 180);
          break;
        case "sqrt":
          res = Math.sqrt(num);
          break;
        case "sqr":
          res = Math.pow(num, 2);
          break;
        case "log":
          res = Math.log10(num);
          break;
        case "ln":
          res = Math.log(num);
          break;
        case "1/x":
          res = 1 / num;
          break;
        case "+/-":
          res = -num;
          break;
      }
      const resStr = `${res}`;
      setHistory((prev) => [`${fn}(${display}) = ${resStr}`, ...prev.slice(0, 19)]);
      setDisplay(resStr);
    } catch {
      setDisplay("Error");
    }
  };

  const getConvertedResult = () => {
    const v = parseFloat(fromVal);
    if (isNaN(v)) return "0";

    if (converterType === "length") {
      const mFactors: Record<string, number> = {
        mm: 0.001,
        cm: 0.01,
        m: 1,
        km: 1000,
        inch: 0.0254,
        ft: 0.3048,
        mile: 1609.34,
      };
      const meters = v * (mFactors[fromUnit] || 1);
      return (meters / (mFactors[toUnit] || 1)).toFixed(4);
    }

    if (converterType === "weight") {
      const gFactors: Record<string, number> = {
        g: 1,
        kg: 1000,
        lb: 453.592,
        oz: 28.3495,
      };
      const grams = v * (gFactors[fromUnit] || 1);
      return (grams / (gFactors[toUnit] || 1)).toFixed(4);
    }

    if (converterType === "currency") {
      const usdRates: Record<string, number> = {
        USD: 1,
        VND: 25400,
        EUR: 0.92,
        JPY: 155,
        GBP: 0.79,
      };
      const inUSD = v / (usdRates[fromUnit] || 1);
      return (inUSD * (usdRates[toUnit] || 1)).toLocaleString("vi-VN", {
        maximumFractionDigits: 2,
      });
    }

    if (converterType === "data") {
      const byteFactors: Record<string, number> = {
        B: 1,
        KB: 1024,
        MB: 1024 * 1024,
        GB: 1024 * 1024 * 1024,
        TB: 1024 * 1024 * 1024 * 1024,
      };
      const bytes = v * (byteFactors[fromUnit] || 1);
      return (bytes / (byteFactors[toUnit] || 1)).toFixed(4);
    }

    return "0";
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left">
      {/* Mode Switcher Navigation */}
      <div className="flex items-center justify-between gap-3 p-2 rounded-2xl bg-white/[0.08] backdrop-blur-[20px] saturate-[180%] border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: "basic", name: "Cơ bản", icon: Calculator },
            { id: "scientific", name: "Khoa học", icon: Binary },
            { id: "converter", name: "Chuyển đổi đơn vị", icon: ArrowRightLeft },
          ].map((mode) => {
            const IconComponent = mode.icon;
            const isActive = calcMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  playPopSound();
                  setCalcMode(mode.id as any);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-white/25 text-white border border-white/30 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.6)]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{mode.name}</span>
              </button>
            );
          })}
        </div>

        {calcMode === "scientific" && (
          <button
            onClick={() => setIsRad(!isRad)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-sky-300 cursor-pointer shadow-sm"
          >
            {isRad ? "RAD" : "DEG"}
          </button>
        )}
      </div>

      {calcMode !== "converter" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Glassmorphism Calculator Body */}
          <div className="lg:col-span-8 rounded-3xl bg-white/[0.08] backdrop-blur-[24px] saturate-[180%] border border-white/20 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0.5px_0.5px_0px_rgba(255,255,255,0.4)] flex flex-col space-y-4">
            {/* Display screen */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/15 text-right space-y-1 shadow-inner">
              <div className="text-xs text-white/50 min-h-[16px] font-mono tracking-wider">
                {equation}
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight break-all">
                {display}
              </div>
            </div>

            {/* Scientific Function Row */}
            {calcMode === "scientific" && (
              <div className="grid grid-cols-5 gap-2 pt-1 border-t border-white/10">
                {["sin", "cos", "tan", "sqrt", "sqr", "log", "ln", "1/x", "+/-", "π"].map((fn) => (
                  <button
                    key={fn}
                    onClick={() => {
                      if (fn === "π") handleNumClick("π");
                      else handleScientific(fn);
                    }}
                    className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white/90 text-xs font-bold font-mono transition-all active:scale-95 shadow-sm"
                  >
                    {fn}
                  </button>
                ))}
              </div>
            )}

            {/* Main Keypad Grid */}
            <div className="grid grid-cols-4 gap-2.5 pt-2">
              <CalcGlassBtn text="C" onClick={handleClear} danger />
              <CalcGlassBtn text="⌫" onClick={handleBackspace} highlight />
              <CalcGlassBtn text="%" onClick={() => handleOpClick("%")} highlight />
              <CalcGlassBtn text="÷" onClick={() => handleOpClick("÷")} action />

              <CalcGlassBtn text="7" onClick={() => handleNumClick("7")} />
              <CalcGlassBtn text="8" onClick={() => handleNumClick("8")} />
              <CalcGlassBtn text="9" onClick={() => handleNumClick("9")} />
              <CalcGlassBtn text="×" onClick={() => handleOpClick("×")} action />

              <CalcGlassBtn text="4" onClick={() => handleNumClick("4")} />
              <CalcGlassBtn text="5" onClick={() => handleNumClick("5")} />
              <CalcGlassBtn text="6" onClick={() => handleNumClick("6")} />
              <CalcGlassBtn text="-" onClick={() => handleOpClick("-")} action />

              <CalcGlassBtn text="1" onClick={() => handleNumClick("1")} />
              <CalcGlassBtn text="2" onClick={() => handleNumClick("2")} />
              <CalcGlassBtn text="3" onClick={() => handleNumClick("3")} />
              <CalcGlassBtn text="+" onClick={() => handleOpClick("+")} action />

              <CalcGlassBtn text="0" onClick={() => handleNumClick("0")} />
              <CalcGlassBtn text="." onClick={() => handleNumClick(".")} />
              <CalcGlassBtn text=")" onClick={() => handleNumClick(")")} />
              <button
                onClick={handleEquals}
                className="py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-lg shadow-lg shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-white/20"
              >
                <Equal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calculation History Panel */}
          <div className="lg:col-span-4 rounded-3xl bg-white/[0.08] backdrop-blur-[24px] saturate-[180%] border border-white/20 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0.5px_0.5px_0px_rgba(255,255,255,0.4)] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" /> Lịch sử tính toán
              </span>
              {history.length > 0 && (
                <button
                  onClick={() => {
                    playPopSound();
                    setHistory([]);
                  }}
                  className="text-[11px] text-white/50 hover:text-white cursor-pointer"
                >
                  Xóa
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[380px] font-mono text-xs">
              {history.length === 0 ? (
                <div className="text-center py-16 text-white/40 text-xs">
                  Chưa có lịch sử tính toán nào.
                </div>
              ) : (
                history.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-right"
                  >
                    <span className="text-emerald-300 font-semibold">{item}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* CONVERTER INTERFACE */
        <div className="rounded-3xl bg-white/[0.08] backdrop-blur-[24px] saturate-[180%] border border-white/20 p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0.5px_0.5px_0px_rgba(255,255,255,0.4)] max-w-xl mx-auto space-y-6">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10">
            {[
              { id: "length", name: "Độ dài" },
              { id: "weight", name: "Khối lượng" },
              { id: "currency", name: "Tiền tệ" },
              { id: "data", name: "Dung lượng data" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  playPopSound();
                  setConverterType(t.id as any);
                  if (t.id === "length") {
                    setFromUnit("m");
                    setToUnit("cm");
                  } else if (t.id === "weight") {
                    setFromUnit("kg");
                    setToUnit("g");
                  } else if (t.id === "currency") {
                    setFromUnit("USD");
                    setToUnit("VND");
                  } else if (t.id === "data") {
                    setFromUnit("GB");
                    setToUnit("MB");
                  }
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  converterType === t.id
                    ? "bg-white/25 text-white border border-white/30 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.5)]"
                    : "bg-white/5 text-white/60 hover:text-white"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1 uppercase tracking-wider">
                Giá trị ban đầu
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={fromVal}
                  onChange={(e) => setFromVal(e.target.value)}
                  className="w-full bg-white/[0.08] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-sky-400 font-mono"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="bg-[#1a1426] border border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none cursor-pointer"
                >
                  {converterType === "length" &&
                    ["mm", "cm", "m", "km", "inch", "ft", "mile"].map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  {converterType === "weight" &&
                    ["g", "kg", "lb", "oz"].map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  {converterType === "currency" &&
                    ["VND", "USD", "EUR", "JPY", "GBP"].map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  {converterType === "data" &&
                    ["B", "KB", "MB", "GB", "TB"].map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center my-2">
              <div className="p-2.5 rounded-full bg-white/15 border border-white/20 text-white shadow-md">
                <ArrowRightLeft className="w-4 h-4 rotate-90" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 mb-1 uppercase tracking-wider">
                Kết quả chuyển đổi
              </label>
              <div className="flex gap-2">
                <div className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm font-bold text-emerald-300 font-mono flex items-center shadow-inner">
                  {getConvertedResult()}
                </div>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="bg-[#1a1426] border border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none cursor-pointer"
                >
                  {converterType === "length" &&
                    ["mm", "cm", "m", "km", "inch", "ft", "mile"].map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  {converterType === "weight" &&
                    ["g", "kg", "lb", "oz"].map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  {converterType === "currency" &&
                    ["VND", "USD", "EUR", "JPY", "GBP"].map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  {converterType === "data" &&
                    ["B", "KB", "MB", "GB", "TB"].map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CalcGlassBtn: React.FC<{
  text: string;
  onClick: () => void;
  action?: boolean;
  danger?: boolean;
  highlight?: boolean;
}> = ({ text, onClick, action, danger, highlight }) => (
  <button
    onClick={onClick}
    className={`py-3.5 rounded-2xl font-bold text-sm transition-all cursor-pointer border active:scale-95 shadow-sm ${
      danger
        ? "bg-rose-500/30 hover:bg-rose-500/40 text-rose-200 border-rose-400/40 shadow-rose-500/20"
        : action
        ? "bg-indigo-500/30 hover:bg-indigo-500/40 text-indigo-200 border-indigo-400/40 shadow-indigo-500/20"
        : highlight
        ? "bg-amber-500/30 hover:bg-amber-500/40 text-amber-200 border-amber-400/40 shadow-amber-500/20"
        : "bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.3)]"
    }`}
  >
    {text}
  </button>
);
