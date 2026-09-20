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
  Box
} from 'lucide-react';

interface SpatialDesignVisualizerProps {
  onBack?: () => void;
  navigate?: (route: string) => void;
}

// Preset themes for background testing
const BACKGROUND_PRESETS = [
  {
    id: 'mesh-color',
    name: 'Mesh Gradient',
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
  },
  {
    id: 'tokyo-neon',
    name: 'Neon Cyber',
    bgClass: 'bg-gradient-to-b from-[#180828] via-[#0b0c1e] to-[#020208]',
    extraDecor: (
      <>
        <div className="absolute top-10 right-16 w-56 h-56 rounded-full bg-fuchsia-600/30 blur-3xl" />
        <div className="absolute bottom-10 left-16 w-64 h-64 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-fuchsia-950/40 to-transparent" />
      </>
    )
  },
  {
    id: 'channel-matrix',
    name: 'TV Grid Simulation',
    bgClass: 'bg-[#18181b]',
    extraDecor: (
      <div className="absolute inset-0 grid grid-cols-4 gap-3 p-4 opacity-35 pointer-events-none scale-95">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-zinc-800/80 border border-white/10 flex flex-col justify-end p-2.5">
            <span className="text-[10px] text-white/50 font-bold">KÊNH VTV {i} HD</span>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 'checkerboard',
    name: 'Alpha Checkerboard',
    bgClass: 'bg-[#222]',
    extraDecor: (
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(45deg, #444 25%, transparent 25%), linear-gradient(-45deg, #444 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #444 75%), linear-gradient(-45deg, transparent 75%, #444 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}
      />
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
  const [selectedBg, setSelectedBg] = useState<string>('mesh-color');
  const [squareSize, setSquareSize] = useState<number>(280); // 280px x 280px
  const [showContent, setShowContent] = useState<'card' | 'button' | 'blank'>('card');
  const [copied, setCopied] = useState<boolean>(false);

  // Active tint RGB
  const currentTint = TINT_PRESETS.find(t => t.id === selectedTint) || TINT_PRESETS[0];

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
    setSquareSize(280);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 select-none space-y-6">
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
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              Mô phỏng hình vuông kính không gian (Spatial Glass), góc bo 30px với độ trong suốt, mờ, nổi và viền tùy chỉnh
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
          
          {/* Background Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-zinc-400 font-medium shrink-0 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" />
              Nền hậu cảnh:
            </span>
            {BACKGROUND_PRESETS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setSelectedBg(bg.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer shrink-0 ${
                  selectedBg === bg.id
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                {bg.name}
              </button>
            ))}
          </div>

          {/* Interactive Canvas */}
          <div 
            className={`relative min-h-[440px] sm:min-h-[500px] w-full rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center p-6 shadow-2xl transition-all ${
              BACKGROUND_PRESETS.find(b => b.id === selectedBg)?.bgClass || 'bg-[#18181e]'
            }`}
          >
            {/* Background elements */}
            {BACKGROUND_PRESETS.find(b => b.id === selectedBg)?.extraDecor}

            {/* Specular Rim Indicator Overlay on Hover */}
            <div className="relative group cursor-pointer" style={{ width: `${squareSize}px`, height: `${squareSize}px` }}>
              
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
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-zinc-300 font-mono">
              Corner: <span className="text-white font-bold">30px</span> | Size: <span className="text-white font-bold">{squareSize}x{squareSize}px</span>
            </div>

            {/* Content Switcher floating pills */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 p-1 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-xs">
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
