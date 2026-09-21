import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  HardDrive,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Gamepad2,
  Sliders,
  Tv,
  FolderArchive,
  Layers,
  ChevronDown,
  ChevronUp,
  Eye,
  Copy,
  Check,
  X,
  Sparkles,
  Info,
} from "lucide-react";
import { playPopSound } from "../utils/sound";

// Maximum standard localStorage capacity in bytes (~5MB)
const TOTAL_STORAGE_BUDGET_BYTES = 5 * 1024 * 1024; // 5,242,880 bytes

export interface StorageKeyItem {
  key: string;
  sizeBytes: number;
  category: "settings" | "notes" | "games" | "media" | "files" | "other";
  valuePreview: string;
  rawValue: string;
}

export interface StorageCategoryMeta {
  id: "settings" | "notes" | "games" | "media" | "files" | "other";
  label: string;
  color: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  icon: any;
  bytes: number;
  keysCount: number;
}

interface LocalStorageBarProps {
  onNotify?: (message: string) => void;
  className?: string;
}

export const LocalStorageBar: React.FC<LocalStorageBarProps> = ({
  onNotify,
  className = "",
}) => {
  const [keysList, setKeysList] = useState<StorageKeyItem[]>([]);
  const [totalUsedBytes, setTotalUsedBytes] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  
  // Modals state
  const [previewItem, setPreviewItem] = useState<StorageKeyItem | null>(null);
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState<boolean>(false);
  const [clearTargetCategory, setClearTargetCategory] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // File input ref for restore
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scan localStorage
  const scanStorage = () => {
    try {
      setIsRefreshing(true);
      const items: StorageKeyItem[] = [];
      let total = 0;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        const val = localStorage.getItem(key) || "";
        // Size in bytes: key + value (roughly 2 bytes per char in UTF-16)
        const sizeBytes = (key.length + val.length) * 2;
        total += sizeBytes;

        // Categorize key
        let cat: StorageKeyItem["category"] = "other";
        const kLower = key.toLowerCase();

        if (
          kLower.includes("setting") ||
          kLower.includes("theme") ||
          kLower.includes("lang") ||
          kLower.includes("dock") ||
          kLower.includes("header") ||
          kLower.includes("volume") ||
          kLower.includes("config") ||
          kLower.includes("mode") ||
          kLower.includes("plugin") ||
          kLower.includes("spotlight")
        ) {
          cat = "settings";
        } else if (
          kLower.includes("note") ||
          kLower.includes("sticky") ||
          kLower.includes("todo") ||
          kLower.includes("memo") ||
          kLower.includes("text") ||
          kLower.includes("study")
        ) {
          cat = "notes";
        } else if (
          kLower.includes("arcade") ||
          kLower.includes("game") ||
          kLower.includes("caro") ||
          kLower.includes("snake") ||
          kLower.includes("rps") ||
          kLower.includes("word") ||
          kLower.includes("count") ||
          kLower.includes("score") ||
          kLower.includes("ore")
        ) {
          cat = "games";
        } else if (
          kLower.includes("channel") ||
          kLower.includes("favorite") ||
          kLower.includes("fav") ||
          kLower.includes("history") ||
          kLower.includes("recent") ||
          kLower.includes("playlist") ||
          kLower.includes("radio") ||
          kLower.includes("vplay")
        ) {
          cat = "media";
        } else if (
          kLower.includes("file") ||
          kLower.includes("cloud") ||
          kLower.includes("storage") ||
          kLower.includes("upload") ||
          kLower.includes("furniture")
        ) {
          cat = "files";
        }

        let preview = val;
        if (preview.length > 120) {
          preview = preview.substring(0, 120) + "...";
        }

        items.push({
          key,
          sizeBytes,
          category: cat,
          valuePreview: preview,
          rawValue: val,
        });
      }

      // Sort by size descending
      items.sort((a, b) => b.sizeBytes - a.sizeBytes);

      setKeysList(items);
      setTotalUsedBytes(total);
    } catch (err) {
      console.error("Failed to scan localStorage:", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  useEffect(() => {
    scanStorage();
    // Also listen to storage events if another window modifies it
    const handleStorageChange = () => scanStorage();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Format bytes helper
  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Usage percentage
  const usagePercentage = Math.min(
    100,
    (totalUsedBytes / TOTAL_STORAGE_BUDGET_BYTES) * 100
  );

  // Category breakdown calculation
  const categoriesMeta: StorageCategoryMeta[] = useMemo(() => {
    const cats: Record<StorageKeyItem["category"], { bytes: number; count: number }> = {
      settings: { bytes: 0, count: 0 },
      notes: { bytes: 0, count: 0 },
      games: { bytes: 0, count: 0 },
      media: { bytes: 0, count: 0 },
      files: { bytes: 0, count: 0 },
      other: { bytes: 0, count: 0 },
    };

    keysList.forEach((item) => {
      cats[item.category].bytes += item.sizeBytes;
      cats[item.category].count += 1;
    });

    return [
      {
        id: "settings",
        label: "Cài đặt & Giao diện",
        color: "#818cf8", // Indigo
        bgClass: "bg-indigo-500",
        textClass: "text-indigo-400",
        borderClass: "border-indigo-500/30",
        icon: Sliders,
        bytes: cats.settings.bytes,
        keysCount: cats.settings.count,
      },
      {
        id: "notes",
        label: "Ghi chú & Học tập",
        color: "#38bdf8", // Sky
        bgClass: "bg-sky-500",
        textClass: "text-sky-400",
        borderClass: "border-sky-500/30",
        icon: FileText,
        bytes: cats.notes.bytes,
        keysCount: cats.notes.count,
      },
      {
        id: "games",
        label: "V-Arcade & Game",
        color: "#34d399", // Emerald
        bgClass: "bg-emerald-500",
        textClass: "text-emerald-400",
        borderClass: "border-emerald-500/30",
        icon: Gamepad2,
        bytes: cats.games.bytes,
        keysCount: cats.games.count,
      },
      {
        id: "media",
        label: "Kênh & Lịch sử",
        color: "#fb923c", // Orange
        bgClass: "bg-orange-500",
        textClass: "text-orange-400",
        borderClass: "border-orange-500/30",
        icon: Tv,
        bytes: cats.media.bytes,
        keysCount: cats.media.count,
      },
      {
        id: "files",
        label: "V-Files & Bộ nhớ",
        color: "#f472b6", // Pink
        bgClass: "bg-pink-500",
        textClass: "text-pink-400",
        borderClass: "border-pink-500/30",
        icon: FolderArchive,
        bytes: cats.files.bytes,
        keysCount: cats.files.count,
      },
      {
        id: "other",
        label: "Dữ liệu khác",
        color: "#a1a1aa", // Gray
        bgClass: "bg-zinc-400",
        textClass: "text-zinc-400",
        borderClass: "border-zinc-500/30",
        icon: Layers,
        bytes: cats.other.bytes,
        keysCount: cats.other.count,
      },
    ];
  }, [keysList]);

  // Filtered keys
  const filteredKeys = useMemo(() => {
    return keysList.filter((item) => {
      const matchQuery =
        !searchQuery ||
        item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.rawValue.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat =
        selectedCategoryFilter === "all" || item.category === selectedCategoryFilter;
      return matchQuery && matchCat;
    });
  }, [keysList, searchQuery, selectedCategoryFilter]);

  // Actions
  const handleExportBackup = () => {
    playPopSound();
    try {
      const backupData: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k) {
          backupData[k] = localStorage.getItem(k) || "";
        }
      }

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `waves_localstorage_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const msg = `Đã xuất sao lưu ${Object.keys(backupData).length} mục Local Storage thành công!`;
      onNotify ? onNotify(msg) : alert(msg);
    } catch (e) {
      console.error("Export error:", e);
      onNotify?.("Không thể xuất sao lưu dữ liệu.");
    }
  };

  const handleTriggerRestore = () => {
    playPopSound();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (typeof parsed !== "object" || parsed === null) {
          throw new Error("Invalid JSON format");
        }

        let count = 0;
        Object.entries(parsed).forEach(([k, v]) => {
          if (typeof v === "string") {
            localStorage.setItem(k, v);
            count++;
          } else {
            localStorage.setItem(k, JSON.stringify(v));
            count++;
          }
        });

        scanStorage();
        playPopSound();
        const msg = `Đã khôi phục thành công ${count} mục vào Local Storage!`;
        onNotify ? onNotify(msg) : alert(msg);
      } catch (err) {
        console.error("Restore error:", err);
        onNotify?.("Lỗi khi đọc file sao lưu JSON. Vui lòng kiểm tra lại file.");
      } finally {
        if (e.target) e.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  const handleCleanTemporaryCache = () => {
    playPopSound();
    try {
      let cleanedCount = 0;
      let freedBytes = 0;

      // Identify temporary cache keys
      const tempKeys = [
        "vplay_temp_",
        "cache_",
        "vplay_search_cache",
        "spotlight_cache",
        "stream_preview_cache",
        "vstudy_temp_",
      ];

      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (!k) continue;
        const isTemp = tempKeys.some((prefix) => k.startsWith(prefix) || k.endsWith("_cache"));
        if (isTemp) {
          const val = localStorage.getItem(k) || "";
          freedBytes += (k.length + val.length) * 2;
          localStorage.removeItem(k);
          cleanedCount++;
        }
      }

      scanStorage();
      const msg =
        cleanedCount > 0
          ? `Đã dọn dẹp ${cleanedCount} mục bộ nhớ đệm tạm thời (giải phóng ${formatBytes(freedBytes)})!`
          : "Local Storage đang ở trạng thái tối ưu, không có bộ nhớ tạm dư thừa.";
      onNotify ? onNotify(msg) : alert(msg);
    } catch (e) {
      console.error("Clean error:", e);
      onNotify?.("Có lỗi xảy ra khi dọn dẹp bộ nhớ đệm.");
    }
  };

  const handleDeleteSingleKey = (key: string) => {
    playPopSound();
    try {
      localStorage.removeItem(key);
      scanStorage();
      if (previewItem?.key === key) {
        setPreviewItem(null);
      }
      onNotify?.(`Đã xóa key "${key}" khỏi Local Storage.`);
    } catch (e) {
      console.error("Delete error:", e);
      onNotify?.(`Không thể xóa key "${key}".`);
    }
  };

  const handleConfirmClear = () => {
    playPopSound();
    try {
      if (clearTargetCategory === "all") {
        localStorage.clear();
        scanStorage();
        setShowClearConfirmModal(false);
        setPreviewItem(null);
        const msg = "Đã dọn sạch toàn bộ Local Storage thành công!";
        onNotify ? onNotify(msg) : alert(msg);
      } else {
        const itemsToDelete = keysList.filter((item) => item.category === clearTargetCategory);
        itemsToDelete.forEach((item) => localStorage.removeItem(item.key));
        scanStorage();
        setShowClearConfirmModal(false);
        setPreviewItem(null);
        const msg = `Đã xóa ${itemsToDelete.length} mục thuộc nhóm này thành công!`;
        onNotify ? onNotify(msg) : alert(msg);
      }
    } catch (e) {
      console.error("Clear error:", e);
      onNotify?.("Không thể xóa dữ liệu.");
    }
  };

  const handleCopyValue = (val: string) => {
    playPopSound();
    navigator.clipboard.writeText(val);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Status color logic
  const statusConfig = useMemo(() => {
    if (usagePercentage < 60) {
      return {
        label: "Dung lượng tốt",
        badgeBg: "bg-emerald-500/20",
        badgeText: "text-emerald-300",
        badgeBorder: "border-emerald-500/30",
        barGradient: "from-emerald-500 to-teal-400",
      };
    } else if (usagePercentage < 85) {
      return {
        label: "Sử dụng trung bình",
        badgeBg: "bg-amber-500/20",
        badgeText: "text-amber-300",
        badgeBorder: "border-amber-500/30",
        barGradient: "from-amber-500 to-orange-400",
      };
    } else {
      return {
        label: "Cảnh báo sắp đầy",
        badgeBg: "bg-rose-500/20",
        badgeText: "text-rose-300",
        badgeBorder: "border-rose-500/30",
        barGradient: "from-rose-500 to-red-400",
      };
    }
  }, [usagePercentage]);

  return (
    <div
      id="waves-local-storage-bar"
      className={`bg-white/10 backdrop-blur-[20px] rounded-[15px] p-4 sm:p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] border border-white/10 relative overflow-hidden transition-all duration-300 text-left mb-4 ${className}`}
    >
      {/* Hidden File Input for Restore */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Decorative ambient glow in background */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Top Header Bar */}
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left info: Icon & Title & Stats */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)] shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  Bộ nhớ Local Storage
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusConfig.badgeBg} ${statusConfig.badgeText} ${statusConfig.badgeBorder}`}
                >
                  {statusConfig.label} ({usagePercentage.toFixed(1)}%)
                </span>
                <span className="text-[11px] text-white/50 font-medium">
                  {keysList.length} mục đã lưu
                </span>
              </div>
              <p className="text-xs text-white/70 flex items-center gap-1 mt-0.5">
                <span>Đã dùng:</span>
                <strong className="text-white font-semibold">
                  {formatBytes(totalUsedBytes)}
                </strong>
                <span className="text-white/40">/</span>
                <span className="text-white/60">~5.00 MB hạn mức</span>
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-center">
            {/* Quick Clean */}
            <button
              type="button"
              onClick={handleCleanTemporaryCache}
              title="Dọn dẹp bộ nhớ đệm tạm thời"
              className="px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Dọn đệm</span>
            </button>

            {/* Backup */}
            <button
              type="button"
              onClick={handleExportBackup}
              title="Sao lưu toàn bộ Local Storage thành file JSON"
              className="px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-sky-300" />
              <span className="hidden md:inline">Sao lưu</span>
            </button>

            {/* Restore */}
            <button
              type="button"
              onClick={handleTriggerRestore}
              title="Khôi phục dữ liệu từ file JSON"
              className="px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden md:inline">Khôi phục</span>
            </button>

            {/* Refresh */}
            <button
              type="button"
              onClick={() => {
                playPopSound();
                scanStorage();
              }}
              title="Quét lại dung lượng"
              className={`p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white text-xs transition-all cursor-pointer active:scale-95 shadow-sm ${
                isRefreshing ? "animate-spin text-indigo-400" : ""
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Toggle Detailed Drawer */}
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setIsExpanded(!isExpanded);
              }}
              className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              <span>{isExpanded ? "Thu gọn" : "Quản lý"}</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Visual Segmented Capacity Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10 flex gap-0.5">
            {categoriesMeta.map((cat) => {
              const catPercent = (cat.bytes / TOTAL_STORAGE_BUDGET_BYTES) * 100;
              if (catPercent <= 0) return null;
              return (
                <div
                  key={cat.id}
                  title={`${cat.label}: ${formatBytes(cat.bytes)} (${cat.keysCount} mục)`}
                  style={{
                    width: `${Math.max(1, (cat.bytes / (totalUsedBytes || 1)) * 100)}%`,
                    backgroundColor: cat.color,
                  }}
                  className="h-full rounded-full transition-all duration-500 hover:brightness-125 cursor-pointer"
                />
              );
            })}
          </div>

          {/* Category Legend & Mini stats */}
          <div className="flex items-center justify-between gap-2 flex-wrap text-[11px] pt-0.5">
            <div className="flex items-center gap-3 flex-wrap">
              {categoriesMeta.map((cat) => {
                if (cat.bytes === 0) return null;
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      playPopSound();
                      setIsExpanded(true);
                      setSelectedCategoryFilter(cat.id);
                    }}
                    className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-white/70 font-medium">{cat.label}:</span>
                    <span className="text-white font-semibold">
                      {formatBytes(cat.bytes)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="text-white/50 text-[10px]">
              Còn trống: {formatBytes(Math.max(0, TOTAL_STORAGE_BUDGET_BYTES - totalUsedBytes))}
            </div>
          </div>
        </div>

        {/* Expandable Key-Value Inspector Drawer */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden border-t border-white/10 pt-4 mt-2 space-y-3"
            >
              {/* Filter controls and Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                {/* Search in keys */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm key hoặc nội dung..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-xs font-semibold text-white placeholder-white/40 focus:outline-none focus:border-indigo-400 transition-colors"
                  />
                  <Search className="w-3.5 h-3.5 text-white/50 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Category tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setSelectedCategoryFilter("all");
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategoryFilter === "all"
                        ? "bg-white/20 text-white border border-white/30"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    Tất cả ({keysList.length})
                  </button>
                  {categoriesMeta.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        playPopSound();
                        setSelectedCategoryFilter(cat.id);
                      }}
                      className={`px-2 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                        selectedCategoryFilter === cat.id
                          ? `${cat.bgClass}/30 ${cat.textClass} border ${cat.borderClass}`
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.label}</span>
                      <span className="text-[10px] opacity-70">({cat.keysCount})</span>
                    </button>
                  ))}
                </div>

                {/* Clear All or Category */}
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setClearTargetCategory(selectedCategoryFilter);
                    setShowClearConfirmModal(true);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1 self-end sm:self-auto cursor-pointer transition-all active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>
                    {selectedCategoryFilter === "all"
                      ? "Xóa tất cả"
                      : "Xóa danh mục"}
                  </span>
                </button>
              </div>

              {/* Keys List Table/Grid */}
              <div className="max-h-64 overflow-y-auto rounded-xl bg-black/30 border border-white/10 divide-y divide-white/5 text-xs font-mono">
                {filteredKeys.length === 0 ? (
                  <div className="py-8 text-center text-white/50 text-xs font-sans">
                    Không tìm thấy key nào phù hợp với bộ lọc hiện tại.
                  </div>
                ) : (
                  filteredKeys.map((item) => {
                    const catMeta = categoriesMeta.find((c) => c.id === item.category);
                    return (
                      <div
                        key={item.key}
                        className="p-2.5 sm:px-3 hover:bg-white/5 flex items-center justify-between gap-3 transition-colors group"
                      >
                        {/* Left key name & category */}
                        <div className="min-w-0 flex-1 flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: catMeta?.color }}
                            title={catMeta?.label}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white truncate max-w-[200px] sm:max-w-[320px]">
                                {item.key}
                              </span>
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-sans uppercase font-bold border ${catMeta?.bgClass}/20 ${catMeta?.textClass} ${catMeta?.borderClass}`}
                              >
                                {catMeta?.label.split(" ")[0]}
                              </span>
                            </div>
                            <p className="text-[10px] text-white/40 truncate max-w-[350px] font-sans font-normal mt-0.5">
                              {item.valuePreview}
                            </p>
                          </div>
                        </div>

                        {/* Right: Size & Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-white/60 text-[11px] font-semibold">
                            {formatBytes(item.sizeBytes)}
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              playPopSound();
                              setPreviewItem(item);
                            }}
                            title="Xem chi tiết dữ liệu"
                            className="p-1 rounded bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteSingleKey(item.key)}
                            title="Xóa key này"
                            className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/30 text-rose-300 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom quick tips */}
              <div className="flex items-center gap-1.5 text-[11px] text-white/50 font-sans">
                <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>
                  Dữ liệu Local Storage được lưu trực tiếp và bảo mật trên trình duyệt của bạn. Bạn có thể sao lưu để chuyển sang máy khác.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MODAL 1: VIEW & INSPECT KEY DATA MODAL */}
      <AnimatePresence>
        {previewItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#18181b] border border-white/20 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-left"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate max-w-[300px]">
                      {previewItem.key}
                    </h4>
                    <p className="text-[11px] text-white/50 font-mono">
                      Kích thước: {formatBytes(previewItem.sizeBytes)} ({previewItem.sizeBytes} bytes)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-3">
                <div className="flex items-center justify-between text-xs text-white/70 font-sans">
                  <span>Giá trị lưu trữ (Stored Value):</span>
                  <button
                    type="button"
                    onClick={() => handleCopyValue(previewItem.rawValue)}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer text-[11px]"
                  >
                    {hasCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Đã sao chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-emerald-300/90 whitespace-pre-wrap break-all max-h-72 overflow-y-auto leading-relaxed select-all">
                  {(() => {
                    try {
                      const obj = JSON.parse(previewItem.rawValue);
                      return JSON.stringify(obj, null, 2);
                    } catch (e) {
                      return previewItem.rawValue;
                    }
                  })()}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDeleteSingleKey(previewItem.key)}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa key này</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: CONFIRM CLEAR STORAGE MODAL */}
      <AnimatePresence>
        {showClearConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#18181b] border border-rose-500/30 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl space-y-4 text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto sm:mx-0">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <h4 className="text-base font-bold text-white">
                  {clearTargetCategory === "all"
                    ? "Xác nhận xóa toàn bộ Local Storage?"
                    : `Xác nhận xóa nhóm dữ liệu "${
                        categoriesMeta.find((c) => c.id === clearTargetCategory)?.label
                      }"?`}
                </h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  {clearTargetCategory === "all"
                    ? "Hành động này sẽ xóa toàn bộ các cài đặt, điểm game V-Arcade, ghi chú và cấu hình đã lưu trên trình duyệt này. Hãy nhớ xuất file Sao lưu trước nếu bạn muốn giữ lại dữ liệu."
                    : "Hành động này sẽ xóa tất cả các mục thuộc danh mục đã chọn khỏi Local Storage."}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowClearConfirmModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClear}
                  className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-900/40 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xác nhận xóa</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
