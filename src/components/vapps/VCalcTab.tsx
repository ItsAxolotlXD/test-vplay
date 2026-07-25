import React, { useState } from "react";
import {
  Calculator,
  Binary,
  ArrowRightLeft,
  Delete,
  History,
  RotateCcw,
  Sparkles
} from "lucide-react";

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
    if (display === "0" || display === "Error") {
      setDisplay(val);
    } else {
      setDisplay((prev) => prev + val);
    }
  };

  const handleOpClick = (op: string) => {
    setEquation(`${display} ${op} `);
    setDisplay("0");
  };

  const handleClear = () => {
    setDisplay("0");
    setEquation("");
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const handleEquals = () => {
    try {
      const fullExpr = equation + display;
      // Sanitize equation for safe math evaluation
      const sanitized = fullExpr
        ? fullExpr
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/π/g, "Math.PI")
            .replace(/e/g, "Math.E")
            .replace(/sin\(/g, isRad ? "Math.sin(" : "Math.sin(Math.PI/180*")
            .replace(/cos\(/g, isRad ? "Math.cos(" : "Math.cos(Math.PI/180*")
            .replace(/tan\(/g, isRad ? "Math.tan(" : "Math.tan(Math.PI/180*")
            .replace(/sqrt\(/g, "Math.sqrt(")
            .replace(/log\(/g, "Math.log10(")
            .replace(/ln\(/g, "Math.log(")
        : display;

      const evalResult = eval(sanitized);
      const formatted = Number(evalResult.toFixed(8)).toString();

      setHistory([`${fullExpr} = ${formatted}`, ...history]);
      setDisplay(formatted);
      setEquation("");
    } catch (err) {
      setDisplay("Error");
    }
  };

  // Scientific special functions
  const handleScientificFunc = (funcName: string) => {
    if (funcName === "sin") setDisplay("sin(" + (display === "0" ? "" : display));
    else if (funcName === "cos") setDisplay("cos(" + (display === "0" ? "" : display));
    else if (funcName === "tan") setDisplay("tan(" + (display === "0" ? "" : display));
    else if (funcName === "sqrt") setDisplay("sqrt(" + (display === "0" ? "" : display));
    else if (funcName === "log") setDisplay("log(" + (display === "0" ? "" : display));
    else if (funcName === "ln") setDisplay("ln(" + (display === "0" ? "" : display));
    else if (funcName === "pi") setDisplay(display === "0" ? "π" : display + "π");
    else if (funcName === "square") setDisplay(String(Math.pow(parseFloat(display) || 0, 2)));
  };

  // Unit Converter Calc
  const getConvertedResult = (): string => {
    const v = parseFloat(fromVal) || 0;
    if (converterType === "length") {
      // Base unit meters
      const ratesToMeter: Record<string, number> = {
        mm: 0.001,
        cm: 0.01,
        m: 1,
        km: 1000,
        inch: 0.0254,
        ft: 0.3048,
        mile: 1609.34
      };
      const meters = v * (ratesToMeter[fromUnit] || 1);
      const converted = meters / (ratesToMeter[toUnit] || 1);
      return converted.toFixed(4);
    } else if (converterType === "weight") {
      const ratesToKg: Record<string, number> = { g: 0.001, kg: 1, lb: 0.453592, oz: 0.0283495 };
      const kgs = v * (ratesToKg[fromUnit] || 1);
      return (kgs / (ratesToKg[toUnit] || 1)).toFixed(4);
    } else if (converterType === "currency") {
      const ratesToVND: Record<string, number> = { VND: 1, USD: 25400, EUR: 27500, JPY: 165, GBP: 32500 };
      const vnd = v * (ratesToVND[fromUnit] || 1);
      return (vnd / (ratesToVND[toUnit] || 1)).toLocaleString("vi-VN");
    } else if (converterType === "data") {
      const ratesToBytes: Record<string, number> = { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 };
      const bytes = v * (ratesToBytes[fromUnit] || 1);
      return (bytes / (ratesToBytes[toUnit] || 1)).toFixed(4);
    }
    return "0";
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 text-white font-sans">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-6 rounded-3xl bg-gradient-to-r from-purple-950/70 via-zinc-900 to-black border border-purple-500/30 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-lg shadow-purple-500/20 text-white font-black">
            <Calculator className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-purple-300 uppercase">
                V-Calc Calculator
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-black uppercase tracking-wider">
                Multi-Mode
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Máy tính cơ bản, máy tính khoa học chuyên sâu và bộ chuyển đổi đơn vị đo lường toàn diện.
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-white/10 rounded-2xl">
          <button
            onClick={() => setCalcMode("basic")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              calcMode === "basic" ? "bg-purple-600 text-white shadow-md" : "text-zinc-400 hover:text-white"
            }`}
          >
            Cơ bản
          </button>
          <button
            onClick={() => setCalcMode("scientific")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              calcMode === "scientific" ? "bg-purple-600 text-white shadow-md" : "text-zinc-400 hover:text-white"
            }`}
          >
            Khoa học
          </button>
          <button
            onClick={() => setCalcMode("converter")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              calcMode === "converter" ? "bg-purple-600 text-white shadow-md" : "text-zinc-400 hover:text-white"
            }`}
          >
            Đổi đơn vị
          </button>
        </div>
      </div>

      {/* CALCULATOR INTERFACE */}
      {calcMode !== "converter" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Calc Box */}
          <div className="lg:col-span-8 bg-[#18181c] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
            {/* Display Area */}
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 mb-6 text-right font-mono">
              <div className="text-xs text-zinc-500 h-5 overflow-hidden">{equation}</div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-wider truncate">
                {display}
              </div>
            </div>

            {/* Scientific Extra Row */}
            {calcMode === "scientific" && (
              <div className="grid grid-cols-5 gap-2 mb-3">
                <CalcBtn text={isRad ? "RAD" : "DEG"} onClick={() => setIsRad(!isRad)} highlight />
                <CalcBtn text="sin" onClick={() => handleScientificFunc("sin")} />
                <CalcBtn text="cos" onClick={() => handleScientificFunc("cos")} />
                <CalcBtn text="tan" onClick={() => handleScientificFunc("tan")} />
                <CalcBtn text="π" onClick={() => handleScientificFunc("pi")} />
                <CalcBtn text="√" onClick={() => handleScientificFunc("sqrt")} />
                <CalcBtn text="x²" onClick={() => handleScientificFunc("square")} />
                <CalcBtn text="log" onClick={() => handleScientificFunc("log")} />
                <CalcBtn text="ln" onClick={() => handleScientificFunc("ln")} />
                <CalcBtn text="(" onClick={() => handleNumClick("(")} />
              </div>
            )}

            {/* Standard Keypad */}
            <div className="grid grid-cols-4 gap-2.5">
              <CalcBtn text="C" onClick={handleClear} danger />
              <CalcBtn text="⌫" onClick={handleBackspace} action />
              <CalcBtn text="%" onClick={() => handleOpClick("%")} action />
              <CalcBtn text="÷" onClick={() => handleOpClick("÷")} action />

              <CalcBtn text="7" onClick={() => handleNumClick("7")} />
              <CalcBtn text="8" onClick={() => handleNumClick("8")} />
              <CalcBtn text="9" onClick={() => handleNumClick("9")} />
              <CalcBtn text="×" onClick={() => handleOpClick("×")} action />

              <CalcBtn text="4" onClick={() => handleNumClick("4")} />
              <CalcBtn text="5" onClick={() => handleNumClick("5")} />
              <CalcBtn text="6" onClick={() => handleNumClick("6")} />
              <CalcBtn text="-" onClick={() => handleOpClick("-")} action />

              <CalcBtn text="1" onClick={() => handleNumClick("1")} />
              <CalcBtn text="2" onClick={() => handleNumClick("2")} />
              <CalcBtn text="3" onClick={() => handleNumClick("3")} />
              <CalcBtn text="+" onClick={() => handleOpClick("+")} action />

              <CalcBtn text="0" onClick={() => handleNumClick("0")} />
              <CalcBtn text="." onClick={() => handleNumClick(".")} />
              <CalcBtn text=")" onClick={() => handleNumClick(")")} />
              <button
                onClick={handleEquals}
                className="py-4 bg-purple-600 hover:bg-purple-500 text-white font-black text-lg rounded-2xl shadow-lg transition-all cursor-pointer col-span-1"
              >
                =
              </button>
            </div>
          </div>

          {/* History Panel */}
          <div className="lg:col-span-4 bg-[#18181c] border border-white/10 rounded-3xl p-5 shadow-xl flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-purple-400" /> Lịch sử tính toán
              </span>
              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="text-[10px] text-zinc-500 hover:text-white"
                >
                  Xóa
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[360px] font-mono text-xs">
              {history.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs font-sans">
                  Chưa có lịch sử tính toán nào.
                </div>
              ) : (
                history.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 text-right">
                    <span className="text-zinc-300 font-bold">{item}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* CONVERTER INTERFACE */
        <div className="bg-[#18181c] border border-white/10 rounded-3xl p-6 shadow-2xl max-w-xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-white/10 scrollbar-none">
            {[
              { id: "length", name: "Độ dài" },
              { id: "weight", name: "Khối lượng" },
              { id: "currency", name: "Tiền tệ" },
              { id: "data", name: "Dung lượng data" }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setConverterType(t.id as any);
                  if (t.id === "length") { setFromUnit("m"); setToUnit("cm"); }
                  else if (t.id === "weight") { setFromUnit("kg"); setToUnit("g"); }
                  else if (t.id === "currency") { setFromUnit("USD"); setToUnit("VND"); }
                  else if (t.id === "data") { setFromUnit("GB"); setToUnit("MB"); }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  converterType === t.id ? "bg-purple-600 text-white shadow-md" : "bg-white/5 hover:bg-white/10 text-zinc-400"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Giá trị ban đầu</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={fromVal}
                  onChange={(e) => setFromVal(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 text-sm font-black text-white focus:outline-none focus:border-purple-500 font-mono"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="bg-zinc-900 border border-white/10 rounded-2xl px-3 py-3 text-xs font-bold text-purple-300 focus:outline-none cursor-pointer"
                >
                  {converterType === "length" && ["mm", "cm", "m", "km", "inch", "ft", "mile"].map((u) => <option key={u} value={u}>{u}</option>)}
                  {converterType === "weight" && ["g", "kg", "lb", "oz"].map((u) => <option key={u} value={u}>{u}</option>)}
                  {converterType === "currency" && ["VND", "USD", "EUR", "JPY", "GBP"].map((u) => <option key={u} value={u}>{u}</option>)}
                  {converterType === "data" && ["B", "KB", "MB", "GB", "TB"].map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-center my-2">
              <div className="p-2 bg-purple-600/20 text-purple-400 rounded-full border border-purple-500/30">
                <ArrowRightLeft className="w-4 h-4 rotate-90" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Kết quả chuyển đổi</label>
              <div className="flex gap-2">
                <div className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl px-4 py-3 text-sm font-black text-purple-400 font-mono flex items-center">
                  {getConvertedResult()}
                </div>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="bg-zinc-900 border border-white/10 rounded-2xl px-3 py-3 text-xs font-bold text-purple-300 focus:outline-none cursor-pointer"
                >
                  {converterType === "length" && ["mm", "cm", "m", "km", "inch", "ft", "mile"].map((u) => <option key={u} value={u}>{u}</option>)}
                  {converterType === "weight" && ["g", "kg", "lb", "oz"].map((u) => <option key={u} value={u}>{u}</option>)}
                  {converterType === "currency" && ["VND", "USD", "EUR", "JPY", "GBP"].map((u) => <option key={u} value={u}>{u}</option>)}
                  {converterType === "data" && ["B", "KB", "MB", "GB", "TB"].map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CalcBtn: React.FC<{
  text: string;
  onClick: () => void;
  action?: boolean;
  danger?: boolean;
  highlight?: boolean;
}> = ({ text, onClick, action, danger, highlight }) => (
  <button
    onClick={onClick}
    className={`py-3.5 rounded-2xl font-black text-sm transition-all cursor-pointer active:scale-95 ${
      danger
        ? "bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30"
        : action
        ? "bg-purple-900/40 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30"
        : highlight
        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
        : "bg-zinc-900 hover:bg-zinc-800 text-white border border-white/5"
    }`}
  >
    {text}
  </button>
);
