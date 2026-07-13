import React, { useState } from "react";
import { 
  ArrowLeft, 
  Search, 
  Image as ImageIcon, 
  Sparkles, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle, 
  Calendar, 
  Info, 
  Layers, 
  Globe,
  Check
} from "lucide-react";

interface LogoItem {
  url: string;
  caption: string;
  title: string;
  date: string;
}

interface FandomSection {
  title: string;
  logos: LogoItem[];
}

interface FandomLogosTabProps {
  onBack: () => void;
}

export default function FandomLogosTab({ onBack }: FandomLogosTabProps) {
  const [fandomLang, setFandomLang] = useState<"vi" | "uk">("vi");
  const [fandomPage, setFandomPage] = useState("");
  const [sections, setSections] = useState<FandomSection[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fandomError, setFandomError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleGenerateLogos = async (customPage?: string, customLang?: "vi" | "uk") => {
    const targetPage = (customPage || fandomPage).trim();
    const targetLang = customLang || fandomLang;

    if (!targetPage) {
      setFandomError("Vui lòng nhập tên trang Fandom Logopedia cần tìm.");
      return;
    }

    setIsGenerating(true);
    setFandomError(null);
    setSections([]);

    try {
      const response = await fetch(`/api/fandom-logos?lang=${targetLang}&page=${encodeURIComponent(targetPage)}`);
      const data = await response.json();

      if (response.ok && data.success) {
        if (data.sections && data.sections.length > 0) {
          setSections(data.sections);
          showToast(`Tìm thấy ${data.sectionsCount} thời kỳ lịch sử logo!`);
        } else {
          setFandomError(
            `Không tìm thấy logo nào trên trang "${targetPage}". Bạn hãy kiểm tra lại chính tả (ví dụ: "HBO", "VTV", "Cartoon_Network", "Disney_Channel") hoặc chọn ngôn ngữ phù hợp.`
          );
        }
      } else {
        setFandomError(data.error || "Có lỗi xảy ra khi tải dữ liệu từ Fandom Logopedia.");
      }
    } catch (err: any) {
      console.error(err);
      setFandomError("Không thể kết nối đến máy chủ dịch vụ. Vui lòng thử lại sau.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectPreset = (name: string, lang: "vi" | "uk") => {
    setFandomPage(name);
    setFandomLang(lang);
    handleGenerateLogos(name, lang);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-6 animate-fade-in text-white/95 relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-8 right-8 z-[200] bg-indigo-600/90 backdrop-blur-xl border border-indigo-400/30 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-2xl flex items-center gap-2 transition-all">
          <Check className="w-4 h-4 text-lime-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all cursor-pointer active:scale-95"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Generate Fandom Logos</h2>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded-full border border-indigo-500/30 font-bold uppercase tracking-wider">
                Logopedia wiki
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/60">Trích xuất nhanh và trực quan hóa thư viện logo lịch sử từ Fandom Logopedia</p>
          </div>
        </div>

        {/* Info panel */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl max-w-sm">
          <Info className="w-5 h-5 text-indigo-400 shrink-0" />
          <p className="text-[11px] text-indigo-200/80 leading-snug">
            Fandom Logopedia lưu trữ hàng triệu logo lịch sử của các kênh truyền hình thế giới và Việt Nam. Nhập tên trang để khám phá.
          </p>
        </div>
      </div>

      {/* URL Builder Engine */}
      <div className="bg-[#0b081a]/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full filter blur-[80px] pointer-events-none" />
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/80">Bộ xây dựng liên kết trích xuất</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
            {/* Domain info & Language selector */}
            <div className="lg:col-span-5 flex items-center bg-white/5 border border-white/10 rounded-xl px-3 p-1.5 gap-2">
              <Globe className="w-4 h-4 text-white/40 shrink-0" />
              <span className="text-xs text-white/40 font-mono select-none">https://logos.fandom.com/</span>
              
              <select
                value={fandomLang}
                onChange={(e) => setFandomLang(e.target.value as "vi" | "uk")}
                className="ml-auto bg-[#130f2d] border border-white/10 text-white text-xs font-semibold rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-center cursor-pointer hover:bg-white/10 transition-colors"
              >
                <option value="vi">vi (Tiếng Việt)</option>
                <option value="uk">uk (Tiếng Anh)</option>
              </select>
              
              <span className="text-xs text-white/40 font-mono select-none">/wiki/</span>
            </div>

            {/* Input page title */}
            <div className="lg:col-span-5 relative flex items-center">
              <input
                type="text"
                value={fandomPage}
                onChange={(e) => setFandomPage(e.target.value)}
                placeholder="Ví dụ: VTV, HBO, Cartoon_Network, SCTV..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleGenerateLogos();
                  }
                }}
                className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 rounded-xl px-4 py-3 text-xs text-white font-medium placeholder-white/30 focus:outline-none transition-all"
              />
              <Search className="w-4 h-4 text-white/30 absolute right-4 pointer-events-none" />
            </div>

            {/* Submit button */}
            <div className="lg:col-span-2">
              <button
                onClick={() => handleGenerateLogos()}
                disabled={isGenerating}
                className="w-full h-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/40 text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 active:scale-[0.98] cursor-pointer"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                )}
                <span>{isGenerating ? "Đang trích xuất..." : "Generate Logo"}</span>
              </button>
            </div>
          </div>

          {/* Preset Recommendations */}
          <div className="pt-2">
            <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-2">Đề xuất trang Logopedia nổi bật</div>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "VTV", lang: "vi", label: "VTV Việt Nam" },
                { name: "SCTV", lang: "vi", label: "SCTV Cáp" },
                { name: "VTC", lang: "vi", label: "VTC Kỹ thuật số" },
                { name: "HTV", lang: "vi", label: "HTV TP.HCM" },
                { name: "HBO", lang: "uk", label: "HBO Network" },
                { name: "Disney_Channel", lang: "uk", label: "Disney Channel" },
                { name: "Cartoon_Network", lang: "uk", label: "Cartoon Network" },
                { name: "Universal_Pictures", lang: "uk", label: "Universal Pictures" },
                { name: "Warner_Bros._Pictures", lang: "uk", label: "Warner Bros" }
              ].map((sugg, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(sugg.name, sugg.lang as "vi" | "uk")}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 hover:border-indigo-500/30 border border-white/5 text-xs text-indigo-200 hover:text-white transition-all cursor-pointer flex items-center gap-2"
                >
                  <span className="text-[8px] px-1 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold uppercase">{sugg.lang}</span>
                  <span className="font-medium">{sugg.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {fandomError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex items-start gap-3 text-rose-200 text-xs sm:text-sm leading-relaxed animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-rose-300">Không tìm thấy hoặc có lỗi tải trang</p>
            <p className="opacity-80">{fandomError}</p>
          </div>
        </div>
      )}

      {/* Loading state spinner */}
      {isGenerating && (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <ImageIcon className="w-6 h-6 text-indigo-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div className="text-center space-y-1">
            <h4 className="font-bold text-sm">Đang tải và đồng bộ dữ liệu Fandom...</h4>
            <p className="text-xs text-white/40">Phân tích cú pháp MediaWiki và trích xuất cấu trúc niên đại logo</p>
          </div>
        </div>
      )}

      {/* Grouped results layout matching Fandom style */}
      {sections.length > 0 && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Kết quả trích xuất ({sections.reduce((acc, s) => acc + s.logos.length, 0)} logo trong {sections.length} thời kỳ)</span>
            </div>
            <button
              onClick={() => setSections([])}
              className="text-[10px] text-white/40 hover:text-rose-400 font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Xóa lịch sử tìm kiếm
            </button>
          </div>

          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-4 bg-white/[0.02] border border-white/5 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
              {/* Timeline segment tag */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/[0.02] rounded-full filter blur-xl pointer-events-none" />

              {/* Fandom layout header style */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    {section.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs font-mono font-semibold text-indigo-200 uppercase bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {section.title.match(/\b(19\d{2}|20\d{2})\b/g) ? "Era: " + section.title : "Giai đoạn lịch sử"}
                  </span>
                </div>
              </div>

              {/* Fandom-like grid of logos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {section.logos.map((logo, lIdx) => (
                  <div 
                    key={lIdx}
                    className="group border border-white/10 rounded-xl bg-[#090716]/90 p-3.5 flex flex-col justify-between hover:border-indigo-500/50 hover:bg-[#120f2e]/60 transition-all duration-300 hover:shadow-[0_10px_25px_rgba(99,102,241,0.15)] relative"
                  >
                    {/* Active era tag badge */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="text-[8.5px] font-mono bg-indigo-600/80 backdrop-blur-md text-white font-bold px-1.5 py-0.5 rounded shadow">
                        {logo.date}
                      </span>
                    </div>

                    {/* Fandom white card image backplate to fit various transparent logo colors */}
                    <div className="w-full h-32 bg-white flex items-center justify-center rounded-lg p-4 overflow-hidden mb-3 relative shadow-inner group-hover:scale-[1.01] transition-transform duration-300">
                      {/* Checkered pattern background for logo preview transparency */}
                      <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 20%, transparent 20%), radial-gradient(#000 20%, transparent 20%)", backgroundPosition: "0 0, 8px 8px", backgroundSize: "16px 16px" }} />
                      
                      <img 
                        src={logo.url} 
                        alt={`${section.title} logo - ${lIdx}`} 
                        className="max-w-full max-h-full object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.12)] group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    </div>

                    {/* Logo titles / Date notations / Captions */}
                    <div className="space-y-2 mt-1">
                      {/* Title: usually first phrase of the caption */}
                      <h4 className="text-xs font-bold text-white/90 line-clamp-1 group-hover:text-indigo-300 transition-colors" title={logo.title}>
                        {logo.title}
                      </h4>

                      {/* Full description caption */}
                      <p className="text-[10px] text-white/50 line-clamp-2 leading-normal" title={logo.caption}>
                        {logo.caption}
                      </p>

                      {/* Interactive Buttons */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[9px] font-mono text-white/40">
                        <span>#0{lIdx + 1}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(logo.url);
                              showToast("Đã sao chép liên kết ảnh gốc!");
                            }}
                            className="p-1.5 rounded bg-white/5 hover:bg-indigo-600 hover:text-white border border-white/10 text-white/70 transition-colors cursor-pointer"
                            title="Sao chép URL"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={logo.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded bg-white/5 hover:bg-indigo-600 hover:text-white border border-white/10 text-white/70 transition-colors cursor-pointer flex items-center justify-center"
                            title="Xem ảnh gốc độ phân giải cao"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Instructions for Empty State */}
      {sections.length === 0 && !isGenerating && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Globe className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/80">Chọn miền chuẩn</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Logopedia chạy song song hai phân mục lớn: <strong className="text-indigo-300">vi</strong> cho thị trường Việt Nam và <strong className="text-indigo-300">uk</strong> cho phiên bản quốc tế gốc.
            </p>
          </div>

          <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Search className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/80">Nhập đúng định dạng</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Nhập chính xác tên thương hiệu hoặc tên kênh như được lưu trữ trên wiki (ví dụ: <code className="bg-white/5 px-1 py-0.5 rounded font-mono text-indigo-200 text-[11px]">Warner_Bros._Pictures</code> thay vì chỉ viết thường không có dấu).
            </p>
          </div>

          <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/80">Tự động cấu trúc niên đại</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Công cụ này tự động giải mã các thời kỳ (eras), tự động ghép các hình ảnh của cùng giai đoạn để sắp xếp theo lịch sử phát triển.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
