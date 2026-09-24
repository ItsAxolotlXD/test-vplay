import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Flame, 
  Snowflake, 
  Flower2, 
  Flag, 
  CheckCircle2, 
  Download,
  Eye,
  Sliders
} from 'lucide-react';
import { SPECIAL_THEMES, SpecialThemeId, SpecialTheme } from '../../data/specialThemesData';
import { useSpecialTheme } from '../../hooks/useSpecialTheme';
import { playWinSound, playPopSound } from '../../utils/sound';

interface ThemeStoreSectionProps {
  onThemeApplied?: (theme: SpecialTheme) => void;
}

export const ThemeStoreSection: React.FC<ThemeStoreSectionProps> = ({ onThemeApplied }) => {
  const { activeTheme, setSpecialTheme, resetToDefault } = useSpecialTheme();
  const [justAppliedId, setJustAppliedId] = useState<string | null>(null);

  const handleApply = (theme: SpecialTheme) => {
    playWinSound();
    setSpecialTheme(theme.id);
    setJustAppliedId(theme.id);
    if (onThemeApplied) {
      onThemeApplied(theme);
    }
    setTimeout(() => {
      setJustAppliedId(null);
    }, 2500);
  };

  const handleReset = () => {
    playPopSound();
    resetToDefault();
    setJustAppliedId('default');
    setTimeout(() => {
      setJustAppliedId(null);
    }, 2000);
  };

  // Helper icon for each theme
  const getThemeIcon = (id: SpecialThemeId) => {
    switch (id) {
      case 'new-year':
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
      case 'lunar-new-year':
        return <Flower2 className="w-5 h-5 text-amber-400" />;
      case 'christmas':
        return <Snowflake className="w-5 h-5 text-red-400" />;
      case 'patriotic':
        return <Flag className="w-5 h-5 text-yellow-300 fill-yellow-300" />;
      default:
        return <Palette className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div id="vplay-theme-store-section" className="space-y-6 select-none">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#181824] via-[#241B2F] to-[#1A1828] border border-pink-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -bottom-16 w-60 h-60 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E6005A] to-[#9333EA] flex items-center justify-center text-white shadow-lg shadow-pink-500/30 shrink-0">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Kho Giao Diện • Theme Store
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-pink-500/25 text-pink-300 border border-pink-500/40">
                Độc quyền Vplay
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1">
              Cài đặt và thay đổi các theme đặc biệt mừng các dịp lễ hội và tôn vinh tinh thần yêu nước
            </p>
          </div>
        </div>

        {/* Reset / Status action button */}
        <div className="flex items-center gap-2 relative z-10 shrink-0">
          {activeTheme !== 'default' ? (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer shadow-md"
              title="Đặt lại về giao diện mặc định ban đầu của Vplay"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-300" />
              <span>Giao diện mặc định</span>
            </button>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-xs text-zinc-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Đang dùng Vplay chuẩn</span>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Special Themes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {SPECIAL_THEMES.map((theme) => {
          const isActive = activeTheme === theme.id;
          const isJustApplied = justAppliedId === theme.id;

          return (
            <div
              key={theme.id}
              id={`theme-card-${theme.id}`}
              className={`relative rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between group ${
                isActive
                  ? 'bg-gradient-to-br from-[#1C1C28] via-[#201D2B] to-[#181822] border-amber-400/80 shadow-[0_10px_35px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/40'
                  : 'bg-[#151520]/90 hover:bg-[#1A1A28] border-white/10 hover:border-white/25 shadow-lg shadow-black/40'
              }`}
            >
              {/* Top Banner / Theme Showcase Preview Window */}
              <div
                className={`relative w-full h-44 sm:h-48 bg-gradient-to-br ${theme.previewBg} p-5 flex flex-col justify-between overflow-hidden border-b border-white/10`}
              >
                {/* Visual thematic elements in thumbnail preview */}
                {theme.id === 'new-year' && (
                  <div className="absolute inset-0 pointer-events-none opacity-60">
                    <div className="absolute top-4 right-10 w-2 h-2 bg-cyan-300 rounded-full shadow-[0_0_12px_#00F0FF] animate-ping" />
                    <div className="absolute top-8 left-12 w-2.5 h-2.5 bg-yellow-300 rounded-full shadow-[0_0_14px_#FFD700] animate-pulse" />
                    <div className="absolute bottom-6 right-20 w-3 h-3 bg-pink-400 rounded-full shadow-[0_0_15px_#FF007A]" />
                    {/* Simulated skyline & firework burst */}
                    <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>
                )}

                {theme.id === 'lunar-new-year' && (
                  <div className="absolute inset-0 pointer-events-none opacity-70">
                    {/* Corner mai & đào blossoms in thumbnail */}
                    <div className="absolute top-2 right-2 text-2xl filter drop-shadow">🌸🌼</div>
                    <div className="absolute top-2 left-2 text-xl filter drop-shadow">🏮</div>
                    <div className="absolute bottom-2 right-6 text-xl">✨</div>
                  </div>
                )}

                {theme.id === 'christmas' && (
                  <div className="absolute inset-0 pointer-events-none opacity-70">
                    {/* Snow and lights in thumbnail */}
                    <div className="absolute top-1 inset-x-0 flex justify-between px-3 text-xs">
                      🔴🟢🟡🔵🟣🔴🟢🟡
                    </div>
                    <div className="absolute top-10 right-8 text-2xl">❄️</div>
                    <div className="absolute bottom-4 left-6 text-2xl">🎄</div>
                  </div>
                )}

                {theme.id === 'patriotic' && (
                  <div className="absolute inset-0 pointer-events-none opacity-70">
                    {/* Vietnam flag & star in thumbnail */}
                    <div className="absolute top-3 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600 border border-yellow-400 shadow-md">
                      <span className="text-yellow-300 text-xs font-black">★ VN</span>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full border-4 border-yellow-400/20 opacity-40" />
                  </div>
                )}

                {/* Top Badge & Status Pill */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-sm">
                    {getThemeIcon(theme.id)}
                    <span>{theme.badge}</span>
                  </div>

                  {isActive ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-black shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>ĐANG ÁP DỤNG</span>
                    </div>
                  ) : (
                    <div className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-amber-300 text-[11px] font-bold border border-amber-400/30">
                      MIỄN PHÍ
                    </div>
                  )}
                </div>

                {/* Theme Name & Tagline on Preview Canvas */}
                <div className="relative z-10 space-y-1">
                  <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {theme.name}
                  </h3>
                  <p className="text-xs font-medium text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] line-clamp-1">
                    {theme.tagline}
                  </p>
                </div>
              </div>

              {/* Card Body & Features */}
              <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {theme.description}
                  </p>

                  {/* Dominant Color & Accent Swatches */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border border-white/30 shadow-md shrink-0"
                        style={{ backgroundColor: theme.dominantColor }}
                        title={`Màu chủ đạo: ${theme.dominantColor}`}
                      />
                      <div className="text-[11px] text-zinc-300 font-medium">
                        {theme.dominantColorName}
                      </div>
                    </div>
                    <div className="w-px h-4 bg-white/20" />
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border border-white/30 shadow-md shrink-0"
                        style={{ backgroundColor: theme.accentColor }}
                        title={`Màu nhấn: ${theme.accentColor}`}
                      />
                      <div className="text-[11px] text-zinc-300 font-medium">
                        {theme.accentColorName}
                      </div>
                    </div>
                  </div>

                  {/* Key Feature Bullets */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
                      Hiệu ứng đặc sắc:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {theme.keyFeatures.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-zinc-200">
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: theme.accentColor }}
                          />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase">Chi phí tải</span>
                    <span className="text-sm font-black text-amber-300">
                      0 ORBS (Tặng kèm)
                    </span>
                  </div>

                  {isActive ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Hủy kích hoạt</span>
                      </button>
                      <button
                        type="button"
                        disabled
                        className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 cursor-default"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Đang kích hoạt</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      id={`btn-apply-theme-${theme.id}`}
                      onClick={() => handleApply(theme)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E6005A] via-[#FF1A75] to-[#E6005A] hover:brightness-110 active:scale-95 text-white font-bold text-xs shadow-lg shadow-pink-600/30 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Cài đặt & Áp dụng</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
