import React, { useState, useMemo } from 'react';
import { 
  Flag, 
  Search, 
  Sparkles, 
  Sliders, 
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
  XCircle, 
  RefreshCw, 
  FileJson,
  Filter,
  Flame,
  ShieldCheck
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

  // Filter definitions
  const filteredFlags = useMemo(() => {
    return FEATURE_FLAGS_DEFINITIONS.filter((item) => {
      const isEnabled = !!flags[item.key];

      // Status filter
      if (selectedStatus === 'enabled' && !isEnabled) return false;
      if (selectedStatus === 'disabled' && isEnabled) return false;

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchKey = item.key.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        return matchName || matchKey || matchDesc;
      }

      return true;
    });
  }, [flags, selectedCategory, selectedStatus, searchQuery]);

  // Statistics
  const totalCount = FEATURE_FLAGS_DEFINITIONS.length;
  const activeCount = Object.values(flags).filter(Boolean).length;
  const betaCount = FEATURE_FLAGS_DEFINITIONS.filter(f => f.badge === 'BETA' || f.badge === 'EXPERIMENTAL').length;

  const getCategoryIcon = (category: FlagCategory) => {
    switch (category) {
      case 'ai':
        return <Bot className="w-4 h-4 text-purple-400 shrink-0" />;
      case 'ui':
        return <Layers className="w-4 h-4 text-cyan-400 shrink-0" />;
      case 'features':
        return <Zap className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'player':
        return <Tv className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'developer':
        return <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />;
      default:
        return <Flag className="w-4 h-4 text-blue-400 shrink-0" />;
    }
  };

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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-4 pb-28 space-y-8 select-none text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1E1E24]/95 border border-white/20 backdrop-blur-xl shadow-2xl text-sm font-medium text-white animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#18181E] via-[#221B2B] to-[#18181E] border border-[#3E344A] p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-500/20 via-[#E6005A]/20 to-purple-500/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
              <Flag className="w-3.5 h-3.5 text-cyan-400" />
              <span>VPLAY SYSTEM EXPERIMENTS</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <span>Feature Flags</span>
              <span className="text-sm font-mono font-bold px-3 py-1 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                v2.6
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 max-w-2xl font-normal leading-relaxed">
              Kiểm soát bật/tắt các tính năng thử nghiệm, trải nghiệm AI thông minh, nâng cao hiệu năng trình phát và tùy biến sâu các module hệ thống.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-[#26252E]/80 border border-white/10 text-center">
              <div className="text-xs text-zinc-400 font-medium">Tổng số</div>
              <div className="text-xl font-extrabold text-white">{totalCount}</div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <div className="text-xs text-emerald-400 font-medium">Đang bật</div>
              <div className="text-xl font-extrabold text-emerald-300">{activeCount}</div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
              <div className="text-xs text-purple-400 font-medium">Thử nghiệm</div>
              <div className="text-xl font-extrabold text-purple-300">{betaCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Global Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-flags-reset"
            onClick={() => {
              resetToDefaults();
              showToast('Đã khôi phục tất cả cờ về mặc định!');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#282830] hover:bg-[#32323C] text-zinc-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục mặc định</span>
          </button>

          <button
            id="btn-flags-enable-all"
            onClick={() => {
              enableAll();
              showToast('Đã kích hoạt toàn bộ tính năng!');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors cursor-pointer"
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Tắt tất cả</span>
          </button>

          <button
            id="btn-flags-export"
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#282830] hover:bg-[#32323C] text-zinc-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>Xuất JSON</span>
          </button>
        </div>

        <button
          id="btn-flags-reload-app"
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E6005A] to-[#FF1E6B] text-white text-xs font-bold shadow-md shadow-[#E6005A]/20 hover:brightness-110 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Tải lại ứng dụng</span>
        </button>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="space-y-4">
        {/* Search Bar Capsule */}
        <div className="relative w-full">
          <div className="w-full h-[50px] flex items-center justify-between px-4 rounded-2xl bg-[#1E1D22] border border-white/10 shadow-lg text-sm transition-all focus-within:border-cyan-500/60 focus-within:ring-2 focus-within:ring-cyan-500/20">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Search className="w-4 h-4 text-zinc-400 shrink-0" />
              <input
                id="input-flags-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm tính năng theo tên, mã cờ (key) hoặc mô tả..."
                className="w-full bg-transparent text-white placeholder-zinc-500 text-sm focus:outline-none font-medium truncate"
              />
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
                title="Xóa tìm kiếm"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills & Status Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-[#25252D] text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              Tất cả ({totalCount})
            </button>
            <button
              onClick={() => setSelectedCategory('ai')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'ai'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-[#25252D] text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-purple-300" />
              <span>AI & Copilot</span>
            </button>
            <button
              onClick={() => setSelectedCategory('ui')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'ui'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-[#25252D] text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-300" />
              <span>Giao diện</span>
            </button>
            <button
              onClick={() => setSelectedCategory('features')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'features'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-[#25252D] text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Tính năng</span>
            </button>
            <button
              onClick={() => setSelectedCategory('player')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'player'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-[#25252D] text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              <Tv className="w-3.5 h-3.5 text-rose-300" />
              <span>Trình phát</span>
            </button>
            <button
              onClick={() => setSelectedCategory('developer')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'developer'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[#25252D] text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-300" />
              <span>Kỹ thuật</span>
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 shrink-0 bg-[#25252D] p-1 rounded-xl border border-white/5 text-xs">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                selectedStatus === 'all' ? 'bg-[#3A3A46] text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setSelectedStatus('enabled')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                selectedStatus === 'enabled' ? 'bg-emerald-600/60 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Đang bật ({activeCount})
            </button>
            <button
              onClick={() => setSelectedStatus('disabled')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                selectedStatus === 'disabled' ? 'bg-rose-600/60 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Đang tắt ({totalCount - activeCount})
            </button>
          </div>
        </div>
      </div>

      {/* 4. Flags Cards Grid */}
      {filteredFlags.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFlags.map((item) => {
            const isEnabled = !!flags[item.key];

            return (
              <div
                key={item.id}
                id={`card-flag-${item.key}`}
                className={`group relative flex flex-col justify-between p-5 sm:p-6 rounded-[24px] transition-all duration-200 border ${
                  isEnabled 
                    ? 'bg-[#1E1D24] border-white/15 shadow-xl hover:border-white/30' 
                    : 'bg-[#17171B]/80 border-white/5 opacity-80 hover:opacity-100 hover:border-white/20'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Top line: Badge & Category */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                        {getCategoryIcon(item.category)}
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider border uppercase ${getBadgeStyle(item.badge)}`}>
                        {item.badge}
                      </span>
                    </div>

                    {/* Switch Toggle */}
                    <label 
                      className="relative inline-flex items-center cursor-pointer select-none"
                      htmlFor={`toggle-flag-${item.key}`}
                    >
                      <input
                        id={`toggle-flag-${item.key}`}
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => {
                          const newState = toggleFlag(item.key);
                          showToast(`Đã ${newState ? 'bật' : 'tắt'}: ${item.name}`);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-[#32323A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E6005A] transition-colors shadow-inner" />
                    </label>
                  </div>

                  {/* Title & Key */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.name}
                    </h3>
                    
                    {/* Copyable Key identifier */}
                    <div 
                      onClick={(e) => handleCopyKey(item.key, e)}
                      title="Nhấp để sao chép key cờ"
                      className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors border border-white/5"
                    >
                      <span>key: {item.key}</span>
                      {copiedKey === item.key ? (
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-60 shrink-0" />
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Footer status row */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5 text-[11px]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-zinc-600'}`} />
                    <span className={isEnabled ? 'text-emerald-300' : 'text-zinc-500'}>
                      {isEnabled ? 'Đang hoạt động (Enabled)' : 'Đã vô hiệu hóa (Disabled)'}
                    </span>
                  </div>

                  <span className="text-zinc-500 font-mono">
                    Mặc định: {item.defaultValue ? 'BẬT' : 'TẮT'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-[28px] bg-[#1E1D22] border border-white/10 text-center space-y-3">
          <div className="p-4 rounded-full bg-white/5 text-zinc-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Không tìm thấy cờ tính năng</h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
            Không có cờ tính năng nào phù hợp với từ khóa &ldquo;{searchQuery}&rdquo; trong danh mục đã chọn.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedStatus('all');
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors cursor-pointer mt-2"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* 5. Safe Disclaimer Box */}
      <div className="p-5 rounded-[22px] bg-[#1B1B22] border border-white/10 flex items-start gap-4 text-xs text-zinc-400 leading-relaxed">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-zinc-200">Lưu ý về các tính năng thử nghiệm:</span>
          <p>
            Các cờ có nhãn <span className="text-amber-300 font-mono">EXPERIMENTAL</span> hoặc <span className="text-purple-300 font-mono">BETA</span> đang trong giai đoạn phát triển và có thể thay đổi trong các bản cập nhật tiếp theo. Mọi thiết lập được tự động lưu trữ an toàn trong bộ nhớ cục bộ của trình duyệt của bạn.
          </p>
        </div>
      </div>
    </div>
  );
};
