import React, { useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, ChevronLeft, Trash2, ShoppingBag, Palette, User, Sliders, Cpu, Layers, HardDrive, RefreshCw, X, Check, Plus } from "lucide-react";
import { VplayToggleSwitch } from "./ui/VplayToggleSwitch";
import { VplaySecondaryButton } from "./ui/VplaySecondaryButton";

interface OreSettingsTabProps {
  onOpenFeedback: () => void;
  onBackToHome?: () => void;
  // Storage
  currentStorageUsed: number; // in MB
  maxStorageMB?: number;
  purchasedStorageMB?: number;
  setPurchasedStorageMB?: React.Dispatch<React.SetStateAction<number>>;
  vCoins?: number;
  setVCoins?: React.Dispatch<React.SetStateAction<number>>;
  handleCleanStorage: () => void;
  // Appearance & Theme state
  amoledDark: boolean;
  setAmoledDark: (val: boolean) => void;
  dynamicMotion: boolean;
  setDynamicMotion: (val: boolean) => void;
  isPanoramaActive: boolean;
  setIsPanoramaActive?: (val: boolean) => void;
  // Plugins
  plugins: Array<{
    id: string;
    name: string;
    desc: string;
    status: "idle" | "installing" | "installed";
    progress: number;
    isActive: boolean;
  }>;
  handleInstallPluginWithConflictCheck: (id: string) => void;
  handleTogglePluginWithConflictCheck: (id: string, currentActive: boolean) => void;
  setPlugins: React.Dispatch<React.SetStateAction<any[]>>;
  // Mappings/Controls
  activeSettingSection: string | null;
  setActiveSettingSection: (section: string | null) => void;
  // User Gamertag
  gamertag?: string;
  setGamertag?: (tag: string) => void;
  t?: (key: string) => string;
}

export const OreSettingsTab: React.FC<OreSettingsTabProps> = ({
  onOpenFeedback,
  onBackToHome,
  currentStorageUsed,
  maxStorageMB = 3072,
  purchasedStorageMB = 0,
  setPurchasedStorageMB,
  vCoins = 1500000,
  setVCoins,
  handleCleanStorage,
  amoledDark,
  setAmoledDark,
  dynamicMotion,
  setDynamicMotion,
  isPanoramaActive,
  setIsPanoramaActive,
  plugins,
  handleInstallPluginWithConflictCheck,
  handleTogglePluginWithConflictCheck,
  setPlugins,
  activeSettingSection,
  setActiveSettingSection,
}) => {
  // Local state for interactive toggles
  const [fullKeyboardMode, setFullKeyboardMode] = useState(false);
  const [remoteConnect, setRemoteConnect] = useState(false);
  const [debugOverlay, setDebugOverlay] = useState(false);

  // Buy storage modal state
  const [showBuyStorageModal, setShowBuyStorageModal] = useState(false);
  const [selectedPackageMB, setSelectedPackageMB] = useState<number>(102400); // 102,400 MB default
  const [customMBInput, setCustomMBInput] = useState<string>("");
  const [buySuccessMessage, setBuySuccessMessage] = useState<string | null>(null);
  const [buyError, setBuyError] = useState<string | null>(null);

  const getPackageVPPrice = (mb: number) => {
    if (mb === 10240) return 500;
    if (mb === 51200) return 2500;
    if (mb === 102400) return 5000;
    if (mb === 204800) return 10000;
    return Math.max(1, Math.ceil((mb / 1024) * 50));
  };

  const handleConfirmBuyStorage = () => {
    setBuyError(null);
    let addAmount = selectedPackageMB;
    if (customMBInput.trim()) {
      const parsed = parseInt(customMBInput.trim(), 10);
      if (!isNaN(parsed) && parsed > 0) {
        addAmount = parsed;
      }
    }

    const priceVP = getPackageVPPrice(addAmount);

    if (vCoins < priceVP) {
      setBuyError(`Không đủ V-pearls! Cần ${priceVP.toLocaleString()} VP, nhưng bạn hiện chỉ có ${vCoins.toLocaleString()} VP.`);
      return;
    }

    if (setVCoins) {
      setVCoins(prev => prev - priceVP);
    }

    if (setPurchasedStorageMB) {
      setPurchasedStorageMB(prev => prev + addAmount);
    }

    const msg = `Thành công! Đã trừ ${priceVP.toLocaleString()} V-pearls và cộng +${addAmount.toLocaleString()} MB Storage Vplay!`;
    setBuySuccessMessage(msg);

    setTimeout(() => {
      setBuySuccessMessage(null);
      setShowBuyStorageModal(false);
      setCustomMBInput("");
      setBuyError(null);
    }, 1800);
  };

  // Helper toggle component matching Minecraft / Ore UI style
  const OreToggle = ({ value, onChange, disabled = false }: { value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) => (
    <VplayToggleSwitch checked={value} onChange={onChange} disabled={disabled} />
  );

  // Helper slider component matching Minecraft / Ore UI style
  const OreSlider = ({ label, subtitle, value, onChange, min = 0, max = 100 }: { label: string; subtitle?: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) => (
    <div className="w-full py-2">
      <div className="flex items-center justify-between mb-1">
        <div>
          <span className="text-white font-semibold text-sm block">{label}</span>
          {subtitle && <p className="text-xs text-zinc-400 font-normal mt-0.5">{subtitle}</p>}
        </div>
        <span className="text-sm font-mono font-bold text-zinc-200 bg-black/40 px-2 py-0.5 border border-[#222222]">{value}</span>
      </div>
      <div className="relative w-full h-2.5 bg-[#181818] border border-[#101010] rounded-none my-1.5 flex items-center">
        <div
          className="h-full bg-[#388e3c]"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="w-4 h-6 bg-[#d9d9d9] border-2 border-[#101010] shadow absolute -top-1.5 -ml-2 pointer-events-none rounded-none"
          style={{ left: `${((value - min) / (max - min)) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto font-sans text-white select-none space-y-4 pb-12">
      
      {/* Top Header Navigation Bar (Minecraft Settings Bar style) */}
      <div className="w-full bg-[#3a3a3a] border-2 border-[#1e1e1e] px-4 py-3 flex items-center justify-between shadow-md rounded-none">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (activeSettingSection !== null) {
                setActiveSettingSection(null);
              } else if (onBackToHome) {
                onBackToHome();
              }
            }}
            className="w-9 h-9 bg-white text-black hover:bg-zinc-100 border-b-4 border-[#a1a1aa] active:border-b-0 active:translate-y-1 flex items-center justify-center cursor-pointer transition-none rounded-none"
            title="Back"
          >
            <ChevronLeft className="w-5 h-5 text-black stroke-[3]" />
          </button>
          <span className="font-mono font-bold text-lg sm:text-xl tracking-wider uppercase text-white">
            SETTINGS
          </span>
        </div>

        {/* Category Tabs in Header */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none max-w-xl">
          {[
            { id: null, label: "Tất cả" },
            { id: "appearance", label: "Giao diện" },
            { id: "plugin_store", label: "Plugin" },
            { id: "profile", label: "Tài khoản" },
            { id: "accessibility", label: "Trợ năng" },
            { id: "custom_tab", label: "Developer" },
          ].map((cat) => {
            const isActive = activeSettingSection === cat.id;
            return (
              <button
                key={cat.id ?? "all"}
                type="button"
                onClick={() => setActiveSettingSection(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider shrink-0 transition-none cursor-pointer rounded-none ${
                  isActive
                    ? "bg-white text-black border-b-4 border-[#a1a1aa]"
                    : "bg-[#282828] text-zinc-300 hover:bg-[#323232] border border-[#1e1e1e]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TOP BANNER BOX: Welcome to design preview! */}
      <div className="w-full bg-[#3a3a3a] border-2 border-[#1e1e1e] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg rounded-none">
        <div className="space-y-1 max-w-2xl">
          <h2 className="font-mono font-bold text-sm sm:text-base text-white">
            Welcome to design preview!
          </h2>
          <p className="text-xs text-zinc-300 leading-relaxed font-normal">
            We would love to hear what you think of this new design. Keep in mind that it's still work in progress and some functionality might be missing.
          </p>
        </div>

        <VplaySecondaryButton
          size="sm"
          fullWidth={false}
          onClick={onOpenFeedback}
          className="shrink-0"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          <span>Give feedback</span>
        </VplaySecondaryButton>
      </div>

      {/* MAIN SETTINGS PANEL - Stacked Sections */}
      <div className="space-y-4">

        {/* SECTION 1: ACCOUNT & PROFILE (Tài khoản) */}
        {(!activeSettingSection || activeSettingSection === "profile") && (
          <div className="bg-[#3a3a3a] border-2 border-[#1e1e1e] rounded-none shadow-xl overflow-hidden" style={{ borderRadius: "0px" }}>
            <div className="px-4 py-3 bg-[#2f2f2f] border-b border-[#1e1e1e] flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-mono font-bold text-xs uppercase tracking-wider text-white">ACCOUNT</span>
            </div>

            <div className="divide-y divide-[#282828]">
              {/* Manage Account */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-sm text-white block">Manage Account</span>
                  <p className="text-xs text-zinc-400 mt-0.5">Manage your user profile and security preferences</p>
                </div>
                <button
                  type="button"
                  style={{ borderRadius: "0px" }}
                  className="ore-btn-white px-5 py-2 text-xs font-semibold rounded-none cursor-pointer"
                >
                  Manage
                </button>
              </div>

              {/* Privacy & online safety */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-sm text-white block">Privacy & online safety</span>
                  <p className="text-xs text-zinc-400 mt-0.5">Control data collection and online safety guidelines</p>
                </div>
                <button
                  type="button"
                  style={{ borderRadius: "0px" }}
                  className="ore-btn-white px-5 py-2 text-xs font-semibold rounded-none cursor-pointer"
                >
                  View
                </button>
              </div>

              {/* Sign Out */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-sm text-white block">Sign out of account</span>
                  <p className="text-xs text-zinc-400 mt-0.5">Disconnect session from current browser instance</p>
                </div>
                <button
                  type="button"
                  style={{ borderRadius: "0px" }}
                  className="ore-btn-white px-5 py-2 text-xs font-semibold rounded-none cursor-pointer"
                >
                  Sign Out
                </button>
              </div>

              {/* Remote Connect */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-sm text-white block">Remote Connect</span>
                  <p className="text-xs text-zinc-400 mt-0.5">Use Remote Connect for account Sign In (requires restart)</p>
                </div>
                <OreToggle value={remoteConnect} onChange={setRemoteConnect} />
              </div>

              {/* DID & MCID Footer */}
              <div className="p-4 bg-[#282828] text-[11px] font-mono text-zinc-400 space-y-0.5">
                <div>DID: cf4bef566256457eb1391a01b5b02e2c</div>
                <div>MCID: 28601FFA239DADCE</div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: APPEARANCE & THEME (Giao diện) */}
        {(!activeSettingSection || activeSettingSection === "appearance") && (
          <div className="bg-[#3a3a3a] border-2 border-[#1e1e1e] rounded-none shadow-xl overflow-hidden" style={{ borderRadius: "0px" }}>
            <div className="px-4 py-3 bg-[#2f2f2f] border-b border-[#1e1e1e] flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-mono font-bold text-xs uppercase tracking-wider text-white">KEYBOARD, MOUSE & APPEARANCE</span>
            </div>

            <div className="p-4 divide-y divide-[#282828] space-y-4">
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-sm text-white block">Full keyboard mode</span>
                  <p className="text-xs text-zinc-400 mt-0.5">Maps mouse input onto the keyboard, for keyboard-only input while playing</p>
                </div>
                <OreToggle value={fullKeyboardMode} onChange={setFullKeyboardMode} />
              </div>

              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-sm text-white block">AMOLED Dark Mode</span>
                  <p className="text-xs text-zinc-400 mt-0.5">Enable deep true black background for AMOLED display screens</p>
                </div>
                <OreToggle
                  value={amoledDark}
                  disabled={isPanoramaActive}
                  onChange={setAmoledDark}
                />
              </div>

              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-sm text-white block">Dynamic Motion Transitions</span>
                  <p className="text-xs text-zinc-400 mt-0.5">Enable smooth fluid physics transitions across all application views</p>
                </div>
                <OreToggle value={dynamicMotion} onChange={setDynamicMotion} />
              </div>

              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-sm text-white block">Reset settings to default</span>
                  <p className="text-xs text-zinc-400 mt-0.5">Restore all the above options to their original values</p>
                </div>
                <button
                  type="button"
                  style={{ borderRadius: "0px" }}
                  onClick={() => {
                    setFullKeyboardMode(false);
                  }}
                  className="ore-btn-white px-5 py-2 text-xs font-semibold rounded-none cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: STORAGE & DISK INFO */}
        {(!activeSettingSection || activeSettingSection === "profile") && (
          <div className="bg-[#3a3a3a] border-2 border-[#1e1e1e] rounded-none shadow-xl overflow-hidden p-4 space-y-3" style={{ borderRadius: "0px" }}>
            <div className="flex flex-wrap items-center justify-between border-b border-[#282828] pb-2 gap-2">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="font-mono font-bold text-xs uppercase tracking-wider text-white">STORAGE & DISK SPACE</span>
              </div>
              <div className="text-right font-mono font-bold">
                <span className="text-xs text-zinc-300">
                  {Math.round(currentStorageUsed).toLocaleString()} MB / {maxStorageMB.toLocaleString()} MB
                </span>
                {purchasedStorageMB > 0 && (
                  <span className="text-[10px] text-emerald-400 block font-normal">
                    (+{purchasedStorageMB.toLocaleString()} MB / {(purchasedStorageMB / 1024).toFixed(0)} GB đã mua)
                  </span>
                )}
              </div>
            </div>

            {/* Storage Progress Bar (Green Ore UI style) */}
            <div className="w-full h-3 bg-[#1e1e1e] border border-black p-0.5 rounded-none relative" style={{ borderRadius: "0px" }}>
              <div
                className="h-full bg-[#388e3c] transition-all duration-300"
                style={{ width: `${Math.min(100, (currentStorageUsed / maxStorageMB) * 100)}%` }}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <p className="text-xs text-zinc-400 leading-normal">
                Clear cached application resources or purchase additional storage capacity for Vplay.
              </p>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowBuyStorageModal(true)}
                  style={{ borderRadius: "0px" }}
                  className="ore-btn-green px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Mua Storage</span>
                </button>

                <button
                  type="button"
                  onClick={handleCleanStorage}
                  style={{ borderRadius: "0px" }}
                  className="ore-btn-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer rounded-none"
                >
                  <Trash2 className="w-3.5 h-3.5 text-black shrink-0" />
                  <span>Dọn dẹp ổ cứng</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: PLUGIN STORE (Plugin) */}
        {(!activeSettingSection || activeSettingSection === "plugin_store") && (
          <div className="bg-[#3a3a3a] border-2 border-[#1e1e1e] rounded-none shadow-xl overflow-hidden">
            <div className="px-4 py-3 bg-[#2f2f2f] border-b border-[#1e1e1e] flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="font-mono font-bold text-xs uppercase tracking-wider text-white">VPLAY PLUGIN STORE</span>
            </div>

            <div className="divide-y divide-[#282828]">
              {plugins.map((plugin) => (
                <div key={plugin.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">{plugin.name}</span>
                      {plugin.status === "installed" && (
                        <span className="px-2 py-0.5 bg-[#1b5e20] text-emerald-300 border border-[#2e7d32] text-[10px] font-mono font-bold uppercase">
                          Installed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 font-normal">{plugin.desc}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    {plugin.status === "idle" && (
                      <button
                        type="button"
                        onClick={() => handleInstallPluginWithConflictCheck(plugin.id)}
                        className="ore-btn-green px-5 py-2 text-xs font-semibold cursor-pointer rounded-none"
                      >
                        Install
                      </button>
                    )}

                    {plugin.status === "installed" && (
                      <div className="flex items-center gap-3">
                        <OreToggle
                          value={plugin.isActive}
                          onChange={() => handleTogglePluginWithConflictCheck(plugin.id, plugin.isActive)}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPlugins(prev => prev.map(p => p.id === plugin.id ? { ...p, status: "idle", progress: 0, isActive: false } : p));
                          }}
                          className="ore-btn-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer rounded-none"
                          title="Uninstall"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: DEVELOPER & SYSTEM */}
        {(!activeSettingSection || activeSettingSection === "custom_tab") && (
          <div className="bg-[#3a3a3a] border-2 border-[#1e1e1e] rounded-none shadow-xl overflow-hidden p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-[#282828] pb-2">
              <Cpu className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="font-mono font-bold text-xs uppercase tracking-wider text-white">DEVELOPER OPTIONS</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div>
                <span className="font-semibold text-sm text-white block">Debug Performance Overlay</span>
                <p className="text-xs text-zinc-400 mt-0.5">Show live FPS, render latency, and memory stats overlay</p>
              </div>
              <OreToggle value={debugOverlay} onChange={setDebugOverlay} />
            </div>
          </div>
        )}

        {/* MUA STORAGE MODAL (Rendered via portal on document.body so topbar/sidebar cannot overlap) */}
        {showBuyStorageModal && createPortal(
          <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 select-none font-sans">
            <div 
              style={{ borderRadius: "0px" }}
              className="w-full max-w-lg bg-[#3a3a3a] border-2 border-[#1e1e1e] shadow-[0_20px_60px_rgba(0,0,0,0.95)] rounded-none overflow-hidden text-left text-white relative animate-in zoom-in-95 duration-150"
            >
              {/* Header */}
              <div className="bg-[#2d2d2d] border-b-2 border-[#1e1e1e] px-4 py-3 flex items-center justify-between relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowBuyStorageModal(false);
                    setBuyError(null);
                  }}
                  style={{ borderRadius: "0px" }}
                  className="text-zinc-300 hover:text-white p-1 cursor-pointer transition-none rounded-none active:translate-y-0.5"
                  title="Back"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide text-center font-mono uppercase flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-400" />
                  <span>Mua Storage Vplay (V-Pearls)</span>
                </h3>

                <button
                  type="button"
                  onClick={() => {
                    setShowBuyStorageModal(false);
                    setBuyError(null);
                  }}
                  style={{ borderRadius: "0px" }}
                  className="text-zinc-300 hover:text-white p-1 cursor-pointer transition-none rounded-none active:translate-y-0.5"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              {buySuccessMessage ? (
                <div className="p-8 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 bg-[#388e3c] border-2 border-[#1b5e20] flex items-center justify-center text-white" style={{ borderRadius: "0px" }}>
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="font-mono font-bold text-base text-white uppercase">Nâng Cấp Thành Công!</h4>
                  <p className="text-xs text-zinc-300">{buySuccessMessage}</p>
                </div>
              ) : (
                <div className="p-4 sm:p-5 space-y-4">
                  {/* Balance & Status info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-3 bg-[#242424] border border-[#181818] rounded-none space-y-1">
                      <div className="text-[11px] font-mono font-bold text-zinc-400 uppercase">Số dư V-pearls hiện tại</div>
                      <div className="text-sm font-mono font-black text-amber-400 flex items-center gap-1.5">
                        <span>🔮</span> {vCoins.toLocaleString()} VP
                      </div>
                    </div>
                    <div className="p-3 bg-[#242424] border border-[#181818] rounded-none space-y-1">
                      <div className="text-[11px] font-mono font-bold text-zinc-400 uppercase">Tổng dung lượng MB</div>
                      <div className="text-sm font-mono font-bold text-emerald-400">
                        {maxStorageMB.toLocaleString()} MB
                      </div>
                    </div>
                  </div>

                  {buyError && (
                    <div className="p-3 bg-red-900/40 border border-red-500/50 text-red-200 text-xs font-mono rounded-none">
                      ⚠️ {buyError}
                    </div>
                  )}

                  {/* Package Options */}
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold text-zinc-300 block uppercase tracking-wider">
                      Chọn gói dung lượng mở rộng:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Gói 10,240 MB", mb: 10240, badge: null },
                        { label: "Gói 51,200 MB", mb: 51200, badge: null },
                        { label: "Gói 102,400 MB", mb: 102400, badge: "HOT" },
                        { label: "Gói 204,800 MB", mb: 204800, badge: "VIP" },
                      ].map((pkg) => {
                        const isSelected = selectedPackageMB === pkg.mb && !customMBInput;
                        const priceVP = getPackageVPPrice(pkg.mb);
                        return (
                          <button
                            key={pkg.mb}
                            type="button"
                            onClick={() => {
                              setSelectedPackageMB(pkg.mb);
                              setCustomMBInput("");
                              setBuyError(null);
                            }}
                            style={{ borderRadius: "0px" }}
                            className={`p-3 border text-left cursor-pointer transition-none relative ${
                              isSelected
                                ? "bg-[#2d2d2d] border-[#388e3c] text-white"
                                : "bg-[#242424] border-[#181818] text-zinc-300 hover:border-zinc-500"
                            }`}
                          >
                            {pkg.badge && (
                              <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-[#b71c1c] text-white text-[9px] font-mono font-bold uppercase">
                                {pkg.badge}
                              </span>
                            )}
                            <div className="font-mono font-bold text-xs sm:text-sm text-white">{pkg.label}</div>
                            <div className="text-[11px] text-emerald-400 font-mono mt-0.5">+{pkg.mb.toLocaleString()} MB</div>
                            <div className="text-[11px] font-mono font-bold text-amber-300 mt-1 flex items-center gap-1">
                              <span>🔮</span> {priceVP.toLocaleString()} VP
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom MB Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                      Hoặc nhập số dung lượng MB tùy chỉnh:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        placeholder="Ví dụ: 50000"
                        value={customMBInput}
                        onChange={(e) => {
                          setCustomMBInput(e.target.value);
                          setBuyError(null);
                        }}
                        style={{ borderRadius: "0px" }}
                        className="flex-1 bg-[#242424] border-2 border-[#181818] px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 font-mono"
                      />
                      <span className="text-xs font-mono font-bold text-zinc-400">MB</span>
                    </div>
                    {customMBInput.trim() && !isNaN(parseInt(customMBInput.trim(), 10)) && parseInt(customMBInput.trim(), 10) > 0 && (
                      <div className="text-xs font-mono text-amber-300">
                        Chi phí: {getPackageVPPrice(parseInt(customMBInput.trim(), 10)).toLocaleString()} V-pearls
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowBuyStorageModal(false);
                        setBuyError(null);
                      }}
                      style={{ borderRadius: "0px" }}
                      className="bg-[#282828] text-zinc-200 hover:bg-[#323232] border-b-4 border-[#181818] active:border-b-0 active:translate-y-1 px-4 py-2.5 font-bold text-xs sm:text-sm cursor-pointer text-center"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmBuyStorage}
                      style={{ borderRadius: "0px" }}
                      className="ore-btn-green w-full px-4 py-2.5 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4 text-white shrink-0" />
                      <span>Xác Nhận Mua</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}

      </div>
    </div>
  );
};
