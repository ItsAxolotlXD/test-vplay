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
      {/* Banner - Ore UI Header Bar */}
      <div className="bg-[#2d2f32] border-2 border-[#141414] p-3 sm:p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#28960b] border-2 border-[#141414] flex items-center justify-center text-white shrink-0 shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-white uppercase tracking-wider font-jura">
                V-CALC (MÁY TÍNH & ĐỔI ĐƠN VỊ)
              </h1>
              <span className="bg-[#89dc69] text-[#141414] px-2 py-0.5 text-[10px] font-bold font-mono border border-[#141414]">
                Ore UI Calc
              </span>
            </div>
            <p className="text-[11px] text-zinc-300 font-jura">
              Máy tính cơ bản, máy tính khoa học chuyên sâu và bộ chuyển đổi đơn vị đo lường toàn diện.
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#1f2022] border-2 border-[#141414] font-jura">
          <button
            onClick={() => setCalcMode("basic")}
            className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer border-2 border-[#141414] ${
              calcMode === "basic" 
                ? "bg-[#28960b] text-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]" 
                : "bg-[#383b3e] text-zinc-300 hover:text-white"
            }`}
          >
            Cơ bản
          </button>
          <button
            onClick={() => setCalcMode("scientific")}
            className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer border-2 border-[#141414] ${
              calcMode === "scientific" 
                ? "bg-[#28960b] text-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]" 
                : "bg-[#383b3e] text-zinc-300 hover:text-white"
            }`}
          >
            Khoa học
          </button>
          <button
            onClick={() => setCalcMode("converter")}
            className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer border-2 border-[#141414] ${
              calcMode === "converter" 
                ? "bg-[#28960b] text-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]" 
                : "bg-[#383b3e] text-zinc-300 hover:text-white"
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
          <div className="lg:col-span-8 bg-[#2d2f32] border-2 border-[#141414] p-5 shadow-2xl flex flex-col justify-between font-jura">
            {/* Display Area */}
            <div className="bg-[#1a1b1d] border-2 border-[#141414] p-4 mb-5 text-right font-mono">
              <div className="text-xs text-zinc-400 h-5 overflow-hidden font-mono">{equation}</div>
              <div className="text-3xl sm:text-4xl font-bold text-[#89dc69] tracking-wider truncate">
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
            <div className="grid grid-cols-4 gap-2">
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
                className="py-3 bg-[#28960b] hover:bg-[#32b312] border-2 border-[#141414] text-white font-black text-lg shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] active:translate-y-[1px] cursor-pointer col-span-1"
              >
                =
              </button>
            </div>
          </div>

          {/* History Panel */}
          <div className="lg:col-span-4 bg-[#2d2f32] border-2 border-[#141414] p-4 shadow-xl flex flex-col font-jura">
            <div className="flex items-center justify-between border-b-2 border-[#141414] pb-2 mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-[#89dc69]" /> Lịch sử tính toán
              </span>
              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="text-[10px] text-zinc-400 hover:text-white cursor-pointer font-mono"
                >
                  Xóa
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[360px] font-mono text-xs">
              {history.length === 0 ? (
                <div className="text-center py-12 text-zinc-400 text-xs font-jura">
                  Chưa có lịch sử tính toán nào.
                </div>
              ) : (
                history.map((item, idx) => (
                  <div key={idx} className="p-2 bg-[#1f2022] border border-[#141414] text-right">
                    <span className="text-[#89dc69] font-bold">{item}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* CONVERTER INTERFACE */
        <div className="bg-[#2d2f32] border-2 border-[#141414] p-5 shadow-2xl max-w-xl mx-auto font-jura">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-5 border-b-2 border-[#141414]">
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
                className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap border-2 border-[#141414] ${
                  converterType === t.id 
                    ? "bg-[#28960b] text-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]" 
                    : "bg-[#383b3e] text-zinc-300 hover:text-white"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">Giá trị ban đầu</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={fromVal}
                  onChange={(e) => setFromVal(e.target.value)}
                  className="w-full bg-[#1f2022] border-2 border-[#141414] px-3 py-2 text-sm font-bold text-white focus:outline-none font-mono"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="bg-[#383b3e] border-2 border-[#141414] px-3 py-2 text-xs font-bold text-white focus:outline-none cursor-pointer"
                >
                  {converterType === "length" && ["mm", "cm", "m", "km", "inch", "ft", "mile"].map((u) => <option key={u} value={u}>{u}</option>)}
                  {converterType === "weight" && ["g", "kg", "lb", "oz"].map((u) => <option key={u} value={u}>{u}</option>)}
                  {converterType === "currency" && ["VND", "USD", "EUR", "JPY", "GBP"].map((u) => <option key={u} value={u}>{u}</option>)}
                  {converterType === "data" && ["B", "KB", "MB", "GB", "TB"].map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-center my-2">
              <div className="p-2 bg-[#28960b] text-white border-2 border-[#141414] shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]">
                <ArrowRightLeft className="w-4 h-4 rotate-90" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">Kết quả chuyển đổi</label>
              <div className="flex gap-2">
                <div className="w-full bg-[#1a1b1d] border-2 border-[#141414] px-3 py-2 text-sm font-bold text-[#89dc69] font-mono flex items-center">
                  {getConvertedResult()}
                </div>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="bg-[#383b3e] border-2 border-[#141414] px-3 py-2 text-xs font-bold text-white focus:outline-none cursor-pointer"
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
    className={`py-3 font-bold text-sm transition-all cursor-pointer border-2 border-[#141414] active:translate-y-[1px] ${
      danger
        ? "bg-[#cc1827] hover:bg-[#e02030] text-white shadow-[inset_2px_2px_0_#ff6b6b,inset_-2px_-2px_0_#7a0000]"
        : action
        ? "bg-[#28960b] hover:bg-[#32b312] text-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]"
        : highlight
        ? "bg-[#d97706] hover:bg-[#f59e0b] text-white shadow-[inset_2px_2px_0_#fbbf24,inset_-2px_-2px_0_#78350f]"
        : "bg-[#c6c6c6] hover:bg-[#383b3e] hover:text-white text-[#141414] shadow-[inset_2px_2px_0_#ffffff,inset_-2px_-2px_0_#898d91]"
    }`}
  >
    {text}
  </button>
);
