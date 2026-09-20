import React, { useState, useMemo } from 'react';
import { 
  Flag, 
  Search, 
  Sparkles, 
  RotateCcw, 
  Check, 
  Copy, 
  AlertTriangle, 
  Zap, 
  Tv, 
  Bot, 
  Layers, 
  Terminal, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  FileJson,
  Palette,
  ChevronRight,
  Wifi,
  Keyboard,
  Mic,
  Activity
} from 'lucide-react';
import { 
  useFeatureFlags, 
  FEATURE_FLAGS_DEFINITIONS, 
  FlagCategory, 
  FlagBadge, 
  FeatureFlagItem 
} from '../hooks/useFeatureFlags';

interface FeatureFlagsProps {
  navigate?: (route: string) => void;
}

export const FeatureFlags: React.FC<FeatureFlagsProps> = ({ navigate }) => {
  const { flags, toggleFlag, resetToDefaults, enableAll, disableAll } = useFeatureFlags();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FlagCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyKey = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    showToast(`Đã sao chép cờ: ${key}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(flags, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vplay-feature-flags-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Đã xuất file cấu hình JSON!');
  };

  const handleToggle = (key: string, item?: FeatureFlagItem) => {
    if (key === 'dynamic_island' && !flags.dynamic_island && !flags.status_bar) {
      toggleFlag('status_bar');
      toggleFlag('dynamic_island');
      showToast('Đã bật Dynamic Island (và tự động bật Status Bar)');
    } else {
      const newState = toggleFlag(key);
      showToast(`Đã ${newState ? 'bật' : 'tắt'}: ${item?.name || key}`);
    }
  };

  const normalizeSearch = (s: string) =>
    (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .trim();

  const normalizedQuery = normalizeSearch(searchQuery);

  const filteredFlags = useMemo(() => {
    return FEATURE_FLAGS_DEFINITIONS.filter((item) => {
      const isEnabled = !!flags[item.key];

      // Status filter
      if (selectedStatus === 'enabled' && !isEnabled) return false;
      if (selectedStatus === 'disabled' && isEnabled) return false;

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // Search filter
      if (normalizedQuery) {
        const matchName = normalizeSearch(item.name).includes(normalizedQuery);
        const matchKey = normalizeSearch(item.key).includes(normalizedQuery);
        const matchDesc = normalizeSearch(item.description).includes(normalizedQuery);
        return matchName || matchKey || matchDesc;
      }

      return true;
    });
  }, [flags, selectedCategory, selectedStatus, normalizedQuery]);

  const getBadgeStyle = (badge: FlagBadge) => {
    switch (badge) {
      case 'EXPERIMENTAL':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'BETA':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'PREVIEW':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'STABLE':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30';
    }
  };

  // Group filtered flags into sections
  const uiFlags = filteredFlags.filter(f => f.category === 'ui');
  const featureFlags = filteredFlags.filter(f => f.category === 'features');
  const otherFlags = filteredFlags.filter(f => f.category !== 'ui' && f.category !== 'features');

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 pt-2 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1E1E24]/95 border border-white/20 backdrop-blur-xl shadow-2xl text-sm font-medium text-white animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header matching Settings.tsx */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Cờ tính năng
        </h1>
        <p className="text-xs sm:text-sm text-[#9CA3AF]">
          Quản lý các tính năng thử nghiệm hệ thống, bàn phím V-board, Status Bar và hiệu ứng giao diện
        </p>

        {/* Search Bar Capsule with Spotlight Search Styling */}
        <div className="pt-2">
          <div className="w-full h-[46px] sm:h-[48px] flex items-center justify-between px-4 rounded-full spotlight-bubble-box search-box-capsule float-search-style text-sm transition-all border-0">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-[20px] h-[20px] min-w-[20px] min-h-[20px] flex items-center justify-center shrink-0">
                <Search className="w-5 h-5 text-white stroke-[2.4] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
              </div>
              <input
                id="feature-flags-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm cờ tính năng..."
                className="w-full bg-transparent text-white placeholder-white/60 text-sm focus:outline-none font-semibold truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] border-0"
              />
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full text-white/70 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
                title="Xóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Settings Quick Entry Card */}
        <div 
          onClick={() => navigate ? navigate('/settings') : window.location.assign('/settings')}
          className="settings-item-card p-4 sm:p-5 rounded-[22px] bg-transparent border-0 shadow-lg flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border-0 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Palette className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">
                  Cài đặt hệ thống
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Quay lại cài đặt giao diện, hình nền Liquid Glass, phông chữ và trợ năng
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-purple-500/20 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors shrink-0">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2. Global Actions & Filter Controls */}
      <div className="space-y-3">
        {/* Quick Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-flags-reset"
              onClick={() => {
                resetToDefaults();
                showToast('Đã khôi phục tất cả cờ về mặc định!');
              }}
              className="settings-item-card flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-transparent hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Mặc định</span>
            </button>

            <button
              id="btn-flags-enable-all"
              onClick={() => {
                enableAll();
                showToast('Đã kích hoạt toàn bộ tính năng!');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Bật tất cả</span>
            </button>

            <button
              id="btn-flags-disable-all"
              onClick={() => {
                disableAll();
                showToast('Đã tắt toàn bộ tính năng!');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Tắt tất cả</span>
            </button>

            <button
              id="btn-flags-export"
              onClick={handleExportJSON}
              className="settings-item-card flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-transparent hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>Xuất JSON</span>
            </button>
          </div>

          <button
            id="btn-flags-reload-app"
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E6005A] hover:bg-[#FF1E6B] text-white text-xs font-bold shadow-md shadow-[#E6005A]/20 transition-all cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tải lại</span>
          </button>
        </div>

        {/* Status Filter Pills */}
        <div className="settings-item-card flex items-center gap-1.5 bg-transparent p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`flex-1 py-1.5 rounded-lg font-medium text-center transition-all cursor-pointer ${
              selectedStatus === 'all' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Tất cả ({FEATURE_FLAGS_DEFINITIONS.length})
          </button>
          <button
            onClick={() => setSelectedStatus('enabled')}
            className={`flex-1 py-1.5 rounded-lg font-medium text-center transition-all cursor-pointer ${
              selectedStatus === 'enabled' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Đang bật ({Object.values(flags).filter(Boolean).length})
          </button>
          <button
            onClick={() => setSelectedStatus('disabled')}
            className={`flex-1 py-1.5 rounded-lg font-medium text-center transition-all cursor-pointer ${
              selectedStatus === 'disabled' ? 'bg-zinc-800/80 text-zinc-300' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Đang tắt ({FEATURE_FLAGS_DEFINITIONS.length - Object.values(flags).filter(Boolean).length})
          </button>
        </div>
      </div>

      {/* Render Function for Individual Flag Card matching Settings.tsx */}
      {(() => {
        const renderFlagCard = (item: FeatureFlagItem) => {
          const isEnabled = !!flags[item.key];
          return (
            <div 
              key={item.id}
              id={`flag-card-${item.key}`}
              className="settings-item-card p-4 sm:p-5 rounded-[20px] bg-transparent border-0 space-y-3.5 transition-colors shadow-md"
            >
              {/* Card Header with Name, Badge and Switch */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white text-sm">
                      {item.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider border uppercase ${getBadgeStyle(item.badge)}`}>
                      {item.badge}
                    </span>
                    {isEnabled && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ĐANG BẬT
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#9CA3AF] leading-relaxed">
                    {item.description}
                  </div>
                </div>

                {/* Switch Toggle matching Settings.tsx */}
                <button
                  id={`toggle-flag-${item.key}`}
                  type="button"
                  role="switch"
                  aria-checked={isEnabled}
                  onClick={() => handleToggle(item.key, item)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 flex items-center ${
                    isEnabled ? 'bg-[#E50914]' : 'bg-[#E4E4E7] dark:bg-[#3F3F46]'
                  }`}
                >
                  <span
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                      isEnabled ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* SPECIAL INTERACTIVE PREVIEW FOR V-BOARD */}
              {item.key === 'experimental_vboard' && (
                <div className="p-3.5 rounded-2xl bg-[#1D1C24] border border-cyan-500/20 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                      <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
                      Gõ thử V-board Telex
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
                      iOS Dark Keyboard
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Chạm vào ô bên dưới để mở bàn phím V-board. Đã tích hợp bộ gõ <strong>Tiếng Việt Telex</strong> (vd: <code className="text-cyan-300">truyeenf</code> ➔ <span className="text-white font-bold">truyền</span>).
                  </p>
                  <input
                    type="text"
                    placeholder="Chạm để gõ thử Tiếng Việt bằng V-board..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#121217] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-zinc-500"
                  />
                </div>
              )}

              {/* SPECIAL INTERACTIVE PREVIEW FOR STATUS BAR (VERTICAL RIGHT) */}
              {item.key === 'status_bar' && (
                <div className="p-3.5 rounded-2xl bg-[#121217] border border-white/10 space-y-2 select-none">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="font-semibold text-white">Xem trước Cột Dọc bên phải</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-cyan-300">
                      Right Vertical Mock
                    </span>
                  </div>
                  <div className="w-full py-3 px-4 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center shadow-inner">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-black border border-white/20 flex items-center justify-center shadow-md">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <span className="font-bold text-[12px] text-white tracking-tight font-mono">9:41</span>
                      <div className="w-8 h-8 relative flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 44 44" fill="none">
                          <path d="M 10 34 A 17 17 0 1 1 34 34" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" />
                          <path d="M 10 34 A 17 17 0 1 1 34 34" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeDasharray="65 80" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pt-0.5">
                          <Wifi className="w-3 h-3 text-white stroke-[2.2]" />
                          <div className="flex items-center gap-[2px] mt-0.5">
                            <span className="w-1 h-1 rounded-full bg-white" />
                            <span className="w-1 h-1 rounded-full bg-white" />
                            <span className="w-1 h-1 rounded-full bg-white" />
                            <span className="w-1 h-1 rounded-full bg-white" />
                            <span className="w-1 h-1 rounded-full bg-white/30" />
                          </div>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-full relative bg-white/30 flex items-center justify-center text-white text-xs font-bold shadow-sm overflow-hidden">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 44 44" fill="none">
                          <circle cx="22" cy="22" r="21" stroke="url(#back-btn-rim-grad)" strokeWidth="2" />
                        </svg>
                        &lt;
                      </div>
                      <div className="w-7 h-7 rounded-full relative bg-white/30 flex items-center justify-center text-white shadow-sm overflow-hidden">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 44 44" fill="none">
                          <circle cx="22" cy="22" r="21" stroke="url(#search-btn-rim-grad)" strokeWidth="2" />
                        </svg>
                        <Search className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SPECIAL INTERACTIVE PREVIEW FOR DYNAMIC ISLAND */}
              {item.key === 'dynamic_island' && (
                <div className="p-3.5 rounded-2xl bg-[#121217] border border-white/10 space-y-2 select-none">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="font-semibold text-white">Xem trước Dynamic Island</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Chấm đen tối giản
                    </span>
                  </div>
                  <div className="w-full py-2.5 px-3 rounded-xl bg-black/70 border border-white/10 flex items-center justify-center gap-3 shadow-inner">
                    <div className="w-4 h-4 rounded-full bg-black border border-white/20 flex items-center justify-center shadow-lg relative">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <span className="text-xs text-zinc-300 font-medium">Dấu chấm đen tối giản (Chạm để mở rộng Card)</span>
                  </div>
                </div>
              )}

              {/* Card Footer with Copy Key and Status */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-zinc-500">
                <button
                  type="button"
                  onClick={(e) => handleCopyKey(item.key, e)}
                  className="flex items-center gap-1 hover:text-zinc-300 transition-colors cursor-pointer"
                  title="Sao chép tên mã cờ"
                >
                  <Copy className="w-3 h-3" />
                  <span className="font-mono">{item.key}</span>
                  {copiedKey === item.key && (
                    <span className="text-emerald-400 text-[10px] font-bold">✓ Đã chép</span>
                  )}
                </button>
                <span>Mặc định: {item.defaultValue ? 'BẬT' : 'TẮT'}</span>
              </div>
            </div>
          );
        };

        return (
          <>
            {/* Section 1: Giao diện & Trải nghiệm (UI) */}
            {uiFlags.length > 0 && (
              <section 
                id="feature-flags-section-ui"
                className="settings-category-section p-5 sm:p-6 rounded-[28px] bg-[#1E1D22]/70 backdrop-blur-md border-0 shadow-xl space-y-4"
              >
                <div className="flex items-start gap-3">
                  <Layers className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-base font-bold text-white leading-tight">
                      Giao diện & Tương tác (UI & Controls)
                    </h2>
                    <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
                      Các cờ thử nghiệm liên quan đến bàn phím ảo V-board, Status Bar mô phỏng di động và Dynamic Island
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {uiFlags.map(renderFlagCard)}
                </div>
              </section>
            )}

            {/* Section 2: Tiện ích & Tìm kiếm (Features) */}
            {featureFlags.length > 0 && (
              <section 
                id="feature-flags-section-features"
                className="settings-category-section p-5 sm:p-6 rounded-[28px] bg-[#1E1D22]/70 backdrop-blur-md border-0 shadow-xl space-y-4"
              >
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-base font-bold text-white leading-tight">
                      Tiện ích & Tính năng (Features & Voice)
                    </h2>
                    <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
                      Các cờ thử nghiệm về tìm kiếm bằng giọng nói và tiện ích thông minh
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {featureFlags.map(renderFlagCard)}
                </div>
              </section>
            )}

            {/* Other Flags if any */}
            {otherFlags.length > 0 && (
              <section 
                id="feature-flags-section-other"
                className="settings-category-section p-5 sm:p-6 rounded-[28px] bg-[#1E1D22]/70 backdrop-blur-md border-0 shadow-xl space-y-4"
              >
                <div className="flex items-start gap-3">
                  <Flag className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-base font-bold text-white leading-tight">
                      Tính năng khác (Other Flags)
                    </h2>
                    <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
                      Các cờ cấu hình và thử nghiệm hệ thống khác
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {otherFlags.map(renderFlagCard)}
                </div>
              </section>
            )}

            {/* Empty State */}
            {filteredFlags.length === 0 && (
              <div className="settings-item-card flex flex-col items-center justify-center py-16 px-4 rounded-[28px] bg-transparent border border-white/10 text-center space-y-3">
                <div className="p-4 rounded-full bg-white/5 text-zinc-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Không tìm thấy cờ tính năng</h3>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
                  Không có cờ tính năng nào phù hợp với từ khóa &ldquo;{searchQuery}&rdquo;.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStatus('all');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors cursor-pointer mt-2"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </>
        );
      })()}

      {/* 4. Safe Disclaimer Box matching Settings.tsx */}
      <div className="settings-item-card p-5 rounded-[22px] bg-transparent border border-white/10 flex items-start gap-4 text-xs text-zinc-400 leading-relaxed shadow-lg">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-zinc-200">Lưu ý về các tính năng thử nghiệm:</span>
          <p>
            Các cờ có nhãn <span className="text-amber-300 font-mono font-bold">EXPERIMENTAL</span> hoặc <span className="text-purple-300 font-mono font-bold">BETA</span> đang trong giai đoạn phát triển và có thể thay đổi. Mọi thiết lập được tự động lưu trữ trong bộ nhớ cục bộ (Local Storage).
          </p>
        </div>
      </div>
    </div>
  );
};
