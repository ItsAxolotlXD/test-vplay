import React, { useState, useRef } from "react";
import {
  FileText,
  Table,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Palette,
  Type,
  Download,
  Save,
  Printer,
  Sparkles,
  RotateCcw,
  Sun,
  Moon,
  FileCode,
  Highlighter
} from "lucide-react";

export const VOfficeTab: React.FC = () => {
  const [activeOfficeApp, setActiveOfficeApp] = useState<"pages" | "numbers">("pages");

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 text-white font-sans">
      {/* Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-6 rounded-3xl bg-gradient-to-r from-blue-950/80 via-indigo-950 to-black border border-blue-500/30 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20 text-white font-black">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black tracking-tight text-blue-300 uppercase">
                V-Office Suite
              </h1>
              <span className="text-[10px] px-3 py-0.5 rounded-full bg-blue-600 text-white font-black uppercase tracking-wider">
                V-Pages (Word) • V-Numbers (Excel)
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Bộ ứng dụng văn phòng chuyên nghiệp: V-Pages (Soạn thảo văn bản đầy đủ công cụ định dạng, phông chữ, màu sắc) và V-Numbers (Bảng tính dữ liệu).
            </p>
          </div>
        </div>

        {/* Office App Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-white/10 rounded-none overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveOfficeApp("pages")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-none text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeOfficeApp === "pages"
                ? "bg-[#2563eb] hover:bg-[#3b82f6] text-white border-b-4 border-[#1d4ed8] active:border-b-0 active:translate-y-1 shadow-md font-black"
                : "bg-[#2a2d36] hover:bg-[#383c48] text-zinc-300 hover:text-white border-2 border-[#484c5c] border-b-4 border-[#181a20]"
            }`}
          >
            <FileText className="w-4 h-4 text-blue-300" /> V-Pages (Word Editor)
          </button>

          <button
            onClick={() => setActiveOfficeApp("numbers")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-none text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeOfficeApp === "numbers"
                ? "bg-[#208b3a] hover:bg-[#2dc653] text-white border-b-4 border-[#125322] active:border-b-0 active:translate-y-1 shadow-md font-black"
                : "bg-[#2a2d36] hover:bg-[#383c48] text-zinc-300 hover:text-white border-2 border-[#484c5c] border-b-4 border-[#181a20]"
            }`}
          >
            <Table className="w-4 h-4 text-emerald-300" /> V-Numbers (Excel Sheet)
          </button>
        </div>
      </div>

      {/* OFFICE APP 1: V-PAGES (WORD DOCUMENT EDITOR WITH FULL FORMATTING, COLORS, FONTS & SIZES) */}
      {activeOfficeApp === "pages" && <VPagesApp />}

      {/* OFFICE APP 2: V-NUMBERS (EXCEL SPREADSHEET) */}
      {activeOfficeApp === "numbers" && <VNumbersApp />}
    </div>
  );
};

/* --- 1. V-PAGES (ADVANCED RICH TEXT DOCUMENT EDITOR) --- */
const VPagesApp: React.FC = () => {
  const [docTitle, setDocTitle] = useState("Văn bản mới - V-Pages Professional Document");
  const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
  const [fontSize, setFontSize] = useState("16px");
  const [textColor, setTextColor] = useState("#111827");
  const [highlightColor, setHighlightColor] = useState("transparent");
  const [editorTheme, setEditorTheme] = useState<"white" | "dark" | "sepia">("white");
  
  const editorRef = useRef<HTMLDivElement>(null);

  const applyCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleFontFamilyChange = (font: string) => {
    setFontFamily(font);
    applyCommand("fontName", font);
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    // Custom size application via CSS on selected text or wrapper
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.fontSize = size;
      range.surroundContents(span);
    }
  };

  const handleTextColorChange = (color: string) => {
    setTextColor(color);
    applyCommand("foreColor", color);
  };

  const handleHighlightColorChange = (color: string) => {
    setHighlightColor(color);
    applyCommand("hiliteColor", color);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportText = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${docTitle}.txt`;
    a.click();
  };

  const handleExportHTML = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${docTitle}.html`;
    a.click();
  };

  return (
    <div className="bg-[#18181c] border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col space-y-4">
      {/* Top Title & Export Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <FileText className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            type="text"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            className="bg-transparent text-lg font-black text-white focus:outline-none w-full border-b border-transparent focus:border-blue-500 transition-colors"
            placeholder="Tên tài liệu..."
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
          {/* Editor Canvas Theme */}
          <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-white/10 rounded-xl">
            <button
              onClick={() => setEditorTheme("white")}
              className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer ${
                editorTheme === "white" ? "bg-white text-black" : "text-zinc-400"
              }`}
            >
              Trắng
            </button>
            <button
              onClick={() => setEditorTheme("sepia")}
              className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer ${
                editorTheme === "sepia" ? "bg-[#f4ebd0] text-[#5f4b32]" : "text-zinc-400"
              }`}
            >
              Sepia
            </button>
            <button
              onClick={() => setEditorTheme("dark")}
              className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer ${
                editorTheme === "dark" ? "bg-zinc-800 text-white" : "text-zinc-400"
              }`}
            >
              Tối
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="p-2 bg-[#2a2d36] hover:bg-[#383c48] border-2 border-[#484c5c] border-b-4 border-[#181a20] active:border-b-0 active:translate-y-1 text-white rounded-none cursor-pointer shadow-md"
            title="In tài liệu"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportText}
            className="flex items-center gap-1 px-3 py-2 bg-[#2a2d36] hover:bg-[#383c48] border-2 border-[#484c5c] border-b-4 border-[#181a20] active:border-b-0 active:translate-y-1 text-white text-xs font-bold rounded-none cursor-pointer shadow-md"
          >
            <FileCode className="w-3.5 h-3.5" /> TXT
          </button>

          <button
            onClick={handleExportHTML}
            className="flex items-center gap-1 px-4 py-2 bg-[#208b3a] hover:bg-[#2dc653] border-b-4 border-[#125322] active:border-b-0 active:translate-y-1 text-white text-xs font-black uppercase rounded-none shadow-md cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Xuất HTML
          </button>
        </div>
      </div>

      {/* RICH TEXT FORMATTING TOOLBAR */}
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-3 flex flex-wrap items-center gap-2 shadow-inner">
        {/* 1. TEXT FORMATTING (Bold, Italic, Underline, Strikethrough, Code) */}
        <div className="flex items-center gap-1 border-r border-white/10 pr-2">
          <button
            onClick={() => applyCommand("bold")}
            className="p-2 hover:bg-white/10 active:bg-blue-600 rounded-lg text-zinc-200 hover:text-white transition-colors cursor-pointer"
            title="In đậm (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyCommand("italic")}
            className="p-2 hover:bg-white/10 active:bg-blue-600 rounded-lg text-zinc-200 hover:text-white transition-colors cursor-pointer"
            title="In nghiêng (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyCommand("underline")}
            className="p-2 hover:bg-white/10 active:bg-blue-600 rounded-lg text-zinc-200 hover:text-white transition-colors cursor-pointer"
            title="Gạch chân (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyCommand("strikeThrough")}
            className="p-2 hover:bg-white/10 active:bg-blue-600 rounded-lg text-zinc-200 hover:text-white transition-colors cursor-pointer"
            title="Gạch ngang chữ"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* 2. CHANGE FONT FAMILY */}
        <div className="flex items-center gap-1.5 border-r border-white/10 pr-2">
          <Type className="w-4 h-4 text-zinc-400" />
          <select
            value={fontFamily}
            onChange={(e) => handleFontFamilyChange(e.target.value)}
            className="bg-zinc-800 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="Inter, sans-serif">Inter (Hiện đại)</option>
            <option value="Arial, sans-serif">Arial</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
            <option value="'Courier New', monospace">Courier New</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="Impact, sans-serif">Impact</option>
            <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
            <option value="'Playfair Display', serif">Playfair Display</option>
          </select>
        </div>

        {/* 3. CHANGE FONT SIZE */}
        <div className="flex items-center gap-1.5 border-r border-white/10 pr-2">
          <span className="text-xs font-mono font-bold text-zinc-400">Size:</span>
          <select
            value={fontSize}
            onChange={(e) => handleFontSizeChange(e.target.value)}
            className="bg-zinc-800 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
          >
            {["10px", "12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px", "48px", "72px"].map((sz) => (
              <option key={sz} value={sz}>{sz}</option>
            ))}
          </select>
        </div>

        {/* 4. COLOR TEXT & HIGHLIGHT BACKGROUND COLOR */}
        <div className="flex items-center gap-2 border-r border-white/10 pr-2">
          {/* Text Color Picker */}
          <div className="flex items-center gap-1">
            <Palette className="w-4 h-4 text-blue-400" title="Màu chữ" />
            <input
              type="color"
              value={textColor}
              onChange={(e) => handleTextColorChange(e.target.value)}
              className="w-6 h-6 rounded border border-white/20 bg-transparent cursor-pointer p-0"
              title="Chọn màu chữ tùy chỉnh"
            />
          </div>

          {/* Highlight Color Picker */}
          <div className="flex items-center gap-1">
            <Highlighter className="w-4 h-4 text-amber-400" title="Màu nền highlight" />
            <input
              type="color"
              value={highlightColor === "transparent" ? "#ffff00" : highlightColor}
              onChange={(e) => handleHighlightColorChange(e.target.value)}
              className="w-6 h-6 rounded border border-white/20 bg-transparent cursor-pointer p-0"
              title="Chọn màu highlight"
            />
          </div>
        </div>

        {/* 5. TEXT ALIGNMENT */}
        <div className="flex items-center gap-1 border-r border-white/10 pr-2">
          <button
            onClick={() => applyCommand("justifyLeft")}
            className="p-2 hover:bg-white/10 rounded-lg text-zinc-200 hover:text-white transition-colors cursor-pointer"
            title="Căn trái"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyCommand("justifyCenter")}
            className="p-2 hover:bg-white/10 rounded-lg text-zinc-200 hover:text-white transition-colors cursor-pointer"
            title="Căn giữa"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyCommand("justifyRight")}
            className="p-2 hover:bg-white/10 rounded-lg text-zinc-200 hover:text-white transition-colors cursor-pointer"
            title="Căn phải"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyCommand("justifyFull")}
            className="p-2 hover:bg-white/10 rounded-lg text-zinc-200 hover:text-white transition-colors cursor-pointer"
            title="Căn đều"
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* 6. HEADINGS & LISTS */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => applyCommand("formatBlock", "<h1>")}
            className="p-2 hover:bg-white/10 rounded-lg text-zinc-200 hover:text-white font-bold text-xs cursor-pointer"
            title="Tiêu đề H1"
          >
            H1
          </button>
          <button
            onClick={() => applyCommand("formatBlock", "<h2>")}
            className="p-2 hover:bg-white/10 rounded-lg text-zinc-200 hover:text-white font-bold text-xs cursor-pointer"
            title="Tiêu đề H2"
          >
            H2
          </button>
          <button
            onClick={() => applyCommand("insertUnorderedList")}
            className="p-2 hover:bg-white/10 rounded-lg text-zinc-200 hover:text-white cursor-pointer"
            title="Danh sách gạch đầu dòng"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyCommand("insertOrderedList")}
            className="p-2 hover:bg-white/10 rounded-lg text-zinc-200 hover:text-white cursor-pointer"
            title="Danh sách số"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyCommand("removeFormat")}
            className="p-2 hover:bg-white/10 rounded-lg text-rose-400 cursor-pointer"
            title="Xóa định dạng"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DOCUMENT EDITOR CANVAS (A4 STYLE SHEET) */}
      <div
        className={`w-full max-w-4xl mx-auto rounded-2xl p-8 sm:p-12 min-h-[550px] shadow-2xl transition-all border ${
          editorTheme === "white"
            ? "bg-white text-zinc-900 border-zinc-200"
            : editorTheme === "sepia"
            ? "bg-[#fbf0d9] text-[#5f4b32] border-amber-900/20"
            : "bg-[#121215] text-zinc-100 border-white/10"
        }`}
      >
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          style={{ fontFamily, fontSize }}
          className="focus:outline-none min-h-[450px] leading-relaxed whitespace-pre-wrap font-sans"
        >
          <h1 className="text-2xl font-black text-blue-600 mb-3">Tài Liệu Văn Bản Chuyên Nghiệp V-Pages</h1>
          <p className="mb-3">
            Chào mừng bạn đến với ứng dụng soạn thảo <b>V-Pages</b> trong bộ công cụ văn phòng <b>V-Office Suite</b>!
          </p>
          <p className="mb-3">
            Hệ thống hỗ trợ đầy đủ các tính năng soạn thảo hiện đại:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li><b>Text Formatting</b>: In đậm, in nghiêng, gạch chân, gạch ngang chữ.</li>
            <li><b>Color Text & Highlight</b>: Thay đổi màu chữ tùy chỉnh và màu highlight nền văn bản.</li>
            <li><b>Change Font & Size</b>: Lựa chọn nhiều phông chữ (Arial, Times New Roman, Inter...) và cỡ chữ từ 10px tới 72px.</li>
            <li><b>Căn lề & Danh sách</b>: Căn trái, căn giữa, căn phải, căn đều, danh sách số và gạch đầu dòng.</li>
          </ul>
          <p className="text-sm opacity-80 italic">
            Bạn có thể bôi đen văn bản bất kỳ và thử nghiệm các thanh công cụ phía trên!
          </p>
        </div>
      </div>
    </div>
  );
};

/* --- 2. V-NUMBERS (SPREADSHEET GRID) --- */
const VNumbersApp: React.FC = () => {
  const [gridData, setGridData] = useState<string[][]>(() => {
    const rows = 15;
    const cols = 8;
    const arr: string[][] = Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(""));
    arr[0] = ["STT", "Tên Sản Phẩm", "Số Lượng", "Đơn Giá (₫)", "Thành Tiền (₫)", "Trạng Thái", "", ""];
    arr[1] = ["1", "Gói Vplay Premium VIP", "2", "1200000", "2400000", "Đã thanh toán", "", ""];
    arr[2] = ["2", "Thẻ V-Bank Platinum", "1", "500000", "500000", "Hoàn tất", "", ""];
    arr[3] = ["3", "Thư Viện V-Books Pro", "5", "150000", "750000", "Đã kích hoạt", "", ""];
    return arr;
  });

  const cols = ["A", "B", "C", "D", "E", "F", "G", "H"];

  const handleCellChange = (r: number, c: number, val: string) => {
    const nextGrid = [...gridData.map((row) => [...row])];
    nextGrid[r][c] = val;
    setGridData(nextGrid);
  };

  return (
    <div className="bg-[#18181c] border border-white/10 rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
        <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <Table className="w-4 h-4" /> V-Numbers Spreadsheet Grid
        </h3>
        <button
          onClick={() => {
            const csvContent = gridData.map((e) => e.join(",")).join("\n");
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "VNumbers_Sheet.csv";
            link.click();
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#208b3a] hover:bg-[#2dc653] border-b-4 border-[#125322] active:border-b-0 active:translate-y-1 text-white font-bold text-xs uppercase rounded-none shadow-md cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" /> Xuất File CSV
        </button>
      </div>

      <div className="overflow-x-auto border border-white/10 rounded-2xl">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="bg-zinc-900 border-b border-white/10 text-zinc-400">
              <th className="p-2 border-r border-white/10 w-10 text-center">#</th>
              {cols.map((col) => (
                <th key={col} className="p-2.5 border-r border-white/10 font-bold text-center">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gridData.map((row, r) => (
              <tr key={r} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-2 border-r border-white/10 bg-zinc-900/60 text-zinc-500 font-bold text-center">
                  {r + 1}
                </td>
                {row.map((cellVal, c) => (
                  <td key={c} className="p-1 border-r border-white/10">
                    <input
                      type="text"
                      value={cellVal}
                      onChange={(e) => handleCellChange(r, c, e.target.value)}
                      className="w-full bg-transparent px-2 py-1 text-xs text-white focus:outline-none focus:bg-emerald-950/40"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
