import React, { useState } from 'react';
import { 
  Sliders, 
  Layers, 
  Copy, 
  Check, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles, 
  Eye, 
  Maximize2, 
  Palette,
  Image as ImageIcon,
  Tv,
  Box,
  Trees,
  Mountain,
  Sun,
  CloudSun,
  Compass
} from 'lucide-react';

interface SpatialDesignVisualizerProps {
  onBack?: () => void;
  navigate?: (route: string) => void;
}

export interface BackgroundPreset {
  id: string;
  name: string;
  category: 'nature' | 'abstract';
  locationTag: string;
  imageUrl?: string;
  bgClass?: string;
  extraDecor?: React.ReactNode;
}

// Preset themes for background testing - Defaults to scenic landscape & nature
const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: 'yosemite-valley',
    name: 'Hồ & Núi đá Alpine',
    category: 'nature',
    locationTag: 'Yosemite Valley • Dãy Alps',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'misty-forest',
    name: 'Rừng sương mù nhiệt đới',
    category: 'nature',
    locationTag: 'Rừng nguyên sinh • Sương mai',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'sunset-alps',
    name: 'Hoàng hôn đỉnh núi tuyết',
    category: 'nature',
    locationTag: 'Hoàng hôn ráng chiều • Đỉnh tuyết',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'aurora-fjord',
    name: 'Cực quang Bắc Cực',
    category: 'nature',
    locationTag: 'Cực quang đêm • Vịnh Na Uy',
    imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'misty-lake',
    name: 'Hồ nước & Rừng thông',
    category: 'nature',
    locationTag: 'Hồ sương mờ • Rừng thông',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'tropical-coast',
    name: 'Bờ biển nhiệt đới',
    category: 'nature',
    locationTag: 'Biển xanh ngọc • Hàng dừa',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'autumn-forest',
    name: 'Rừng thu lá phong',
    category: 'nature',
    locationTag: 'Mùa thu vàng • Rừng lá đỏ',
    imageUrl: 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'mesh-color',
    name: 'Mesh Gradient',
    category: 'abstract',
    locationTag: 'Hiệu ứng Gradient',
    bgClass: 'bg-gradient-to-tr from-[#6b21a8] via-[#1e1b4b] to-[#0f766e]',
    extraDecor: (
      <>
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-pink-500/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-cyan-500/30 blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/3 left-1/4 w-40 h-40 rounded-full bg-amber-400/25 blur-2xl" />
      </>
    )
  },
  {
    id: 'vplay-studio',
    name: 'Vplay Studio',
    category: 'abstract',
    locationTag: 'Phòng thu tối',
    bgClass: 'bg-[#121216]',
    extraDecor: (
      <>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(56,139,253,0.25),transparent_70%)]" />
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute bottom-8 left-8 text-white/20 text-4xl font-black select-none pointer-events-none tracking-widest uppercase">
          VPLAY BROADCAST
        </div>
      </>
    )
  }
];

// Glass tint color presets
const TINT_PRESETS = [
  { id: 'dark', name: 'Dark Obsidian', r: 18, g: 18, b: 24 },
  { id: 'frost', name: 'Frost Light', r: 255, g: 255, b: 255 },
  { id: 'vision-blue', name: 'Vision Blue', r: 56, g: 139, b: 253 },
  { id: 'cosmic-purple', name: 'Cosmic Purple', r: 124, g: 58, b: 237 },
  { id: 'amber-gold', name: 'Amber Gold', r: 245, g: 158, b: 11 },
];

export const SpatialDesignVisualizer: React.FC<SpatialDesignVisualizerProps> = ({
  onBack,
  navigate
}) => {
  // 1. Transparency (0% - 100%) - background opacity
  const [transparency, setTransparency] = useState<number>(35); // 35% opacity
  
  // 2. Blur (0px - 80px)
  const [blur, setBlur] = useState<number>(24);
  
  // 3. Elevation / Độ nổi (0 - 50px)
  const [elevation, setElevation] = useState<number>(25);

  // 4. Border Width (0px - 10px)
  const [borderWidth, setBorderWidth] = useState<number>(1.5);

  // Extra spatial parameters
  const [specularBrightness, setSpecularBrightness] = useState<number>(85); // 0% - 100%
  const [saturation, setSaturation] = useState<number>(180); // 100% - 250%
  const [selectedTint, setSelectedTint] = useState<string>('dark');
  const [selectedBg, setSelectedBg] = useState<string>('yosemite-valley');
  const [sceneDimming, setSceneDimming] = useState<number>(20); // 0% - 70%
  const [customBgUrl, setCustomBgUrl] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [squareSize, setSquareSize] = useState<number>(280); // 280px x 280px
  const [showContent, setShowContent] = useState<'card' | 'button' | 'blank'>('card');
  const [copied, setCopied] = useState<boolean>(false);

  // Active tint RGB
  const currentTint = TINT_PRESETS.find(t => t.id === selectedTint) || TINT_PRESETS[0];
  const activeBgPreset = BACKGROUND_PRESETS.find(b => b.id === selectedBg) || BACKGROUND_PRESETS[0];
  const effectiveImageUrl = selectedBg === 'custom' && customBgUrl ? customBgUrl : activeBgPreset.imageUrl;

  // Calculate CSS styles
  const alpha = transparency / 100;
  const borderAlpha = Math.min(1, 0.15 + (specularBrightness / 100) * 0.6);
  const shadowAlpha = Math.min(0.8, 0.15 + (elevation / 50) * 0.55);

  const calculatedStyle: React.CSSProperties = {
    width: `${squareSize}px`,
    height: `${squareSize}px`,
    borderRadius: '30px', // Exact 30px round corner as requested
    backgroundColor: `rgba(${currentTint.r}, ${currentTint.g}, ${currentTint.b}, ${alpha})`,
    backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
    borderWidth: `${borderWidth}px`,
    borderStyle: borderWidth > 0 ? 'solid' : 'none',
    borderColor: `rgba(255, 255, 255, ${borderAlpha})`,
    boxShadow: `
      0 ${elevation * 0.8}px ${elevation * 1.8}px rgba(0, 0, 0, ${shadowAlpha}),
      0 ${elevation * 0.2}px ${elevation * 0.5}px rgba(0, 0, 0, ${shadowAlpha * 0.5}),
      inset 0 1px ${Math.max(1, borderWidth)}px rgba(255, 255, 255, ${borderAlpha * 0.8}),
      inset 0 -1px 2px rgba(0, 0, 0, 0.3)
    `,
    transition: 'all 0.15s ease'
  };

  // Generate CSS code string
  const cssCode = `.spatial-square {
  width: ${squareSize}px;
  height: ${squareSize}px;
  border-radius: 30px; /* Round corner 30px */
  background: rgba(${currentTint.r}, ${currentTint.g}, ${currentTint.b}, ${alpha.toFixed(2)});
  backdrop-filter: blur(${blur}px) saturate(${saturation}%);
  -webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
  border: ${borderWidth}px solid rgba(255, 255, 255, ${borderAlpha.toFixed(2)});
  box-shadow: 
    0 ${Math.round(elevation * 0.8)}px ${Math.round(elevation * 1.8)}px rgba(0, 0, 0, ${shadowAlpha.toFixed(2)}),
    inset 0 1px 1.5px rgba(255, 255, 255, ${(borderAlpha * 0.8).toFixed(2)});
}`;

  const handleCopyCss = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTransparency(35);
    setBlur(24);
    setElevation(25);
    setBorderWidth(1.5);
    setSpecularBrightness(85);
    setSaturation(180);
    setSelectedTint('dark');
    setSelectedBg('yosemite-valley');
    setSceneDimming(20);
    setSquareSize(280);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-6 select-none space-y-6">
      {/* Subtle ambient nature atmosphere behind the whole stage */}
      {effectiveImageUrl && (
        <div 
          className="fixed inset-0 opacity-15 blur-3xl pointer-events-none -z-10 scale-110 overflow-hidden"
          style={{
            backgroundImage: `url(${effectiveImageUrl})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
              title="Quay lại"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Box className="w-6 h-6 text-[#388BFD]" />
                Spatial Design Visualizer
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#388BFD]/20 text-[#388BFD] border border-[#388BFD]/40">
                Corner 30px
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Trees className="w-3 h-3" />
                Nền thiên nhiên
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              Mô phỏng hình vuông kính không gian (Spatial Glass) góc bo 30px trên nền phong cảnh thiên nhiên hùng vĩ
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mặc định</span>
          </button>
          <button
            onClick={handleCopyCss}
            className="btn-colored flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Đã copy CSS!' : 'Copy CSS'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Visualizer Canvas Stage on Left, Controls Sliders on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 1. VISUALIZER STAGE (COL 7) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Nature Landscape & Background Selector */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-300 font-semibold flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nền phong cảnh, thiên nhiên ({BACKGROUND_PRESETS.filter(b => b.category === 'nature').length} cảnh):</span>
              </span>
              <button
                type="button"
                onClick={() => setShowCustomInput(prev => !prev)}
                className="text-[11px] text-[#388BFD] hover:underline font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>{showCustomInput ? 'Đóng ô link' : '+ Thêm URL phong cảnh'}</span>
              </button>
            </div>

            {/* Custom URL Input if opened */}
            {showCustomInput && (
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#141418] border border-white/15 shadow-md">
                <input
                  type="text"
                  value={customBgUrl}
                  onChange={(e) => setCustomBgUrl(e.target.value)}
                  placeholder="Dán URL ảnh phong cảnh, thiên nhiên (https://...)..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#388BFD]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customBgUrl.trim()) setSelectedBg('custom');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#388BFD] text-white text-xs font-bold hover:bg-[#388BFD]/80 cursor-pointer shrink-0"
                >
                  Áp dụng
                </button>
              </div>
            )}

            {/* Horizontal Scrollable Thumbnails */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 [scrollbar-width:thin] no-scrollbar text-xs">
              {BACKGROUND_PRESETS.map((bg) => {
                const isSelected = selectedBg === bg.id;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setSelectedBg(bg.id)}
                    className={`group relative flex items-center gap-2 px-2.5 py-1.5 rounded-2xl border transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-white/15 border-white/50 ring-2 ring-emerald-400/60 shadow-lg text-white font-bold'
                        : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                    title={bg.locationTag}
                  >
                    {bg.imageUrl ? (
                      <img
                        src={bg.imageUrl}
                        alt={bg.name}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-lg object-cover border border-white/20 shrink-0"
                      />
                    ) : (
                      <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-teal-500 border border-white/20 shrink-0" />
                    )}
                    <span className="truncate max-w-[140px] text-[11px]">{bg.name}</span>
                    {bg.category === 'nature' && (
                      <Trees className="w-3 h-3 text-emerald-400 shrink-0 opacity-70 group-hover:opacity-100" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Canvas Stage */}
          <div 
            className="relative min-h-[460px] sm:min-h-[520px] w-full rounded-3xl overflow-hidden border border-white/15 flex items-center justify-center p-6 shadow-2xl transition-all"
            style={{ backgroundColor: '#101014' }}
          >
            {/* Nature Landscape & Background Photo Layer */}
            {effectiveImageUrl ? (
              <div className="absolute inset-0 select-none overflow-hidden">
                <img
                  src={effectiveImageUrl}
                  alt={activeBgPreset.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 hover:scale-105"
                />
                {/* Scene Dimming & Natural Lighting Overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none transition-colors duration-300"
                  style={{ backgroundColor: `rgba(0, 0, 0, ${sceneDimming / 100})` }}
                />
              </div>
            ) : (
              <>
                <div className={`absolute inset-0 ${activeBgPreset.bgClass || 'bg-[#18181e]'}`} />
                {activeBgPreset.extraDecor}
              </>
            )}

            {/* Location & Nature Badge (Top-Left) */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-white/90 z-20 shadow-md">
              <Trees className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-semibold text-[11px] truncate max-w-[240px]">
                {selectedBg === 'custom' ? 'Ảnh thiên nhiên tự chọn' : activeBgPreset.locationTag}
              </span>
            </div>

            {/* Specular Rim Indicator Overlay on Hover */}
            <div className="relative group cursor-pointer z-10" style={{ width: `${squareSize}px`, height: `${squareSize}px` }}>
              
              {/* THE SPATIAL SQUARE WITH CORNER 30PX */}
              <div 
                id="spatial-square-target"
                style={calculatedStyle}
                className="relative overflow-hidden flex flex-col items-center justify-center p-5 select-none transition-all duration-200 group-hover:scale-[1.02]"
              >
                {/* Specular Rim Gradient on Edge */}
                {borderWidth > 0 && specularBrightness > 0 && (
                  <div 
                    className="absolute inset-0 rounded-[30px] pointer-events-none"
                    style={{
                      padding: `${Math.max(1, borderWidth)}px`,
                      background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,${(specularBrightness / 100) * 0.4}) 25%, rgba(255,255,255,${specularBrightness / 100}) 50%, rgba(255,255,255,${(specularBrightness / 100) * 0.4}) 75%, transparent 100%)`,
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      zIndex: 10
                    }}
                  />
                )}

                {/* Content Inside Square */}
                {showContent === 'card' && (
                  <div className="flex flex-col items-center text-center text-white space-y-3 pointer-events-none">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center shadow-md">
                      <Sparkles className="w-6 h-6 text-[#388BFD]" />
                    </div>
                    <div>
                      <div className="font-bold text-sm sm:text-base tracking-tight drop-shadow-md">
                        Spatial Glass
                      </div>
                      <div className="text-[11px] text-white/70 font-mono mt-0.5">
                        Radius: 30px
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[10px] font-semibold tracking-wider uppercase text-white/90">
                      Liquid UI 2026
                    </div>
                  </div>
                )}

                {showContent === 'button' && (
                  <div className="flex flex-col items-center text-center space-y-3 pointer-events-none">
                    <span className="text-xs text-white/80 font-medium">Mô phỏng Nút hành động</span>
                    <button 
                      type="button" 
                      className="btn-colored px-6 py-2.5 rounded-full text-xs font-bold tracking-tight text-white shadow-lg pointer-events-auto cursor-pointer"
                    >
                      Allow Access
                    </button>
                    <span className="text-[10px] text-white/50">Blue Button + Channel Border</span>
                  </div>
                )}

                {showContent === 'blank' && (
                  <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
                    Pure Spatial 30px
                  </div>
                )}
              </div>
            </div>

            {/* Corner Info Badge */}
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-zinc-300 font-mono z-20">
              Corner: <span className="text-white font-bold">30px</span> | Size: <span className="text-white font-bold">{squareSize}x{squareSize}px</span>
            </div>

            {/* Content Switcher floating pills */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 p-1 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-xs z-20">
              <button
                onClick={() => setShowContent('card')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer ${
                  showContent === 'card' ? 'bg-[#388BFD] text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Card UI
              </button>
              <button
                onClick={() => setShowContent('button')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer ${
                  showContent === 'button' ? 'bg-[#388BFD] text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Button UI
              </button>
              <button
                onClick={() => setShowContent('blank')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer ${
                  showContent === 'blank' ? 'bg-[#388BFD] text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Trống
              </button>
            </div>
          </div>

          {/* Quick CSS Snippet Box */}
          <div className="p-4 rounded-2xl bg-[#141418] border border-white/10 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                CSS Generated
              </span>
              <button
                onClick={handleCopyCss}
                className="text-xs text-[#388BFD] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copied ? 'Đã copy!' : 'Sao chép mã'}
              </button>
            </div>
            <pre className="text-[11px] font-mono text-zinc-300 overflow-x-auto whitespace-pre no-scrollbar leading-relaxed">
              {cssCode}
            </pre>
          </div>
        </div>

        {/* 2. CONTROLS PANEL (COL 5) */}
        <div className="lg:col-span-5 flex flex-col gap-4 p-5 rounded-3xl bg-[#18181E] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#388BFD]" />
              Bảng điều khiển thông số
            </span>
            <span className="text-xs text-zinc-400 font-mono">VisionOS Engine</span>
          </div>

          <div className="space-y-5">
            
            {/* 0. Ánh sáng tự nhiên (Scene Lighting) */}
            <div className="space-y-2 pb-3 border-b border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Ánh sáng tự nhiên (Scene Lighting)
                </span>
                <span className="font-mono text-[#388BFD] font-bold">{100 - sceneDimming}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="70"
                value={sceneDimming}
                onChange={(e) => setSceneDimming(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#388BFD]"
              />
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>Ban ngày rực rỡ (100%)</span>
                <span>Chiều tà (80%)</span>
                <span>Hoàng hôn / Tối (30%)</span>
              </div>
            </div>
            
            {/* 1. Độ trong suốt (Transparency) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Độ trong suốt (Transparency)</span>
                <span className="font-mono text-[#388BFD] font-bold">{transparency}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={transparency}
                onChange={(e) => setTransparency(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#388BFD]"
              />
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>0% (Trong suốt hoàn toàn)</span>
                <span>100% (Đục màu đục)</span>
              </div>
            </div>

            {/* 2. Độ mờ (Backdrop Blur) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Độ mờ hậu cảnh (Blur)</span>
                <span className="font-mono text-[#388BFD] font-bold">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#388BFD]"
              />
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>0px (Sắc nét)</span>
                <span>30px (Kính mờ chuẩn)</span>
                <span>60px (Siêu mờ)</span>
              </div>
            </div>

            {/* 3. Độ nổi (Elevation & Shadow Depth) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Độ nổi (Elevation / 3D Pop)</span>
                <span className="font-mono text-[#388BFD] font-bold">{elevation}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={elevation}
                onChange={(e) => setElevation(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#388BFD]"
              />
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>0px (Phẳng)</span>
                <span>25px (Trung bình)</span>
                <span>50px (Nổi khối sâu)</span>
              </div>
            </div>

            {/* 4. Độ dày viền (Border Width) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Độ dày viền (Border Width)</span>
                <span className="font-mono text-[#388BFD] font-bold">{borderWidth}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="0.5"
                value={borderWidth}
                onChange={(e) => setBorderWidth(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#388BFD]"
              />
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>0px (Không viền)</span>
                <span>1.5px (Chuẩn viền ô kênh)</span>
                <span>8px (Viền dày)</span>
              </div>
            </div>

            {/* 5. Độ sáng phản quang viền (Specular Highlight) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Độ sáng viền phản chiếu (Specular Rim)</span>
                <span className="font-mono text-[#388BFD] font-bold">{specularBrightness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={specularBrightness}
                onChange={(e) => setSpecularBrightness(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#388BFD]"
              />
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>Tắt phản quang</span>
                <span>Rực rỡ viền kính</span>
              </div>
            </div>

            {/* 6. Kích thước hình vuông */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Kích thước hình vuông (Size)</span>
                <span className="font-mono text-[#388BFD] font-bold">{squareSize} x {squareSize}px</span>
              </div>
              <input
                type="range"
                min="180"
                max="380"
                step="10"
                value={squareSize}
                onChange={(e) => setSquareSize(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#388BFD]"
              />
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>180px</span>
                <span>280px (Mặc định)</span>
                <span>380px</span>
              </div>
            </div>

            {/* 7. Màu kính (Glass Tint Preset) */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#388BFD]" />
                Màu sắc kính (Glass Tint)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {TINT_PRESETS.map((tint) => (
                  <button
                    key={tint.id}
                    onClick={() => setSelectedTint(tint.id)}
                    className={`px-3 py-2 rounded-xl text-xs flex items-center gap-2 border transition-all cursor-pointer ${
                      selectedTint === tint.id
                        ? 'border-[#388BFD] bg-[#388BFD]/15 text-white font-bold'
                        : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0"
                      style={{ backgroundColor: `rgb(${tint.r}, ${tint.g}, ${tint.b})` }}
                    />
                    <span className="truncate">{tint.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
