import React, { useState, useEffect, useRef } from 'react';
import { 
  Tv, 
  RotateCw, 
  Play, 
  Pause, 
  ArrowLeft, 
  Upload, 
  Link as LinkIcon, 
  Sliders, 
  Sparkles, 
  Clock, 
  Check, 
  RefreshCw,
  Maximize2,
  Minimize2,
  Video,
  Monitor
} from 'lucide-react';

interface LogoSwitcherVisualizerProps {
  onBack?: () => void;
  navigate?: (route: string) => void;
}

export interface PresetLogo {
  id: string;
  name: string;
  category: string;
  url: string;
}

export const PRESET_LOGOS: PresetLogo[] = [
  {
    id: 'default',
    name: 'Default (VTV1)',
    category: 'VTV Presets',
    url: 'https://static.wikia.nocookie.net/logos/images/1/11/VTV1_2019%2C_2020_v%C3%A0_2022-2026.png/revision/latest/scale-to-width-down/1000?cb=20250110114239&path-prefix=vi'
  },
  {
    id: 'merged',
    name: 'Merged (VTV 2025-2026)',
    category: 'VTV Presets',
    url: 'https://static.wikia.nocookie.net/logos/images/4/48/VTV_logo_2025%2C_2026.png/revision/latest?cb=20250604141539&path-prefix=vi'
  },
  {
    id: 'live',
    name: 'LIVE (VTV Trực Tiếp 2025)',
    category: 'VTV Presets',
    url: 'https://static.wikia.nocookie.net/logos/images/6/65/VTV_logo_tr%E1%BB%B1c_ti%E1%BA%BFp_2025.png/revision/latest/scale-to-width-down/1000?cb=20250906021257&path-prefix=vi'
  },
  {
    id: 'vplay',
    name: 'Vplay Logo',
    category: 'Vplay Presets',
    url: 'https://static.wikia.nocookie.net/ep-deo/images/f/f8/Vpla.png/revision/latest/scale-to-width-down/1000?cb=20260829062528'
  }
];

export type AnimationMode = 
  | 'direct'       // Chuyển thẳng
  | 'cross_dissolve' // Cross dissolve
  | 'fade_1'       // Logo đầu biến mất thẳng xong logo sau xuất hiện fade
  | 'fade_2'       // Logo đầu fade biến mất 1s sau đó logo sau hiện thẳng
  | 'fade_3';      // Logo đầu fade biến mất sau đó logo sau fade hiện ra

export const LogoSwitcherVisualizer: React.FC<LogoSwitcherVisualizerProps> = ({
  onBack,
  navigate
}) => {
  // Active Logos
  const [logoA, setLogoA] = useState<string>(PRESET_LOGOS[0].url);
  const [logoB, setLogoB] = useState<string>(PRESET_LOGOS[1].url);
  
  // Custom URL inputs
  const [customUrlA, setCustomUrlA] = useState<string>('');
  const [customUrlB, setCustomUrlB] = useState<string>('');

  // Selected animation mode
  const [animationMode, setAnimationMode] = useState<AnimationMode>('cross_dissolve');

  // Animation duration (in seconds)
  // Preset options: 0.3s, 0.5s (default), 1s, 1.5s
  const [fadeDuration, setFadeDuration] = useState<number>(0.5);

  // Active displayed slot: 'A' or 'B'
  const [currentSlot, setCurrentSlot] = useState<'A' | 'B'>('A');

  // Transition state tracking
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [opacityA, setOpacityA] = useState<number>(1);
  const [opacityB, setOpacityB] = useState<number>(0);
  const [transitionProgress, setTransitionProgress] = useState<string>('Logo A đang phát sóng');

  // Auto loop preview state
  const [isAutoLoop, setIsAutoLoop] = useState<boolean>(false);
  const autoLoopTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Corner Position for On-Air Bug Simulation
  const [position, setPosition] = useState<'top-right' | 'top-left' | 'bottom-right' | 'center'>('top-right');
  const [zoomLevel, setZoomLevel] = useState<number>(100); // 100%, 150%, 200%, 300%
  const [bgStyle, setBgStyle] = useState<'studio' | 'news' | 'dark' | 'checkerboard'>('studio');

  // File input refs for importing from device
  const fileInputRefA = useRef<HTMLInputElement | null>(null);
  const fileInputRefB = useRef<HTMLInputElement | null>(null);

  // Handle device file upload
  const handleDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>, slot: 'A' | 'B') => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      if (slot === 'A') {
        setLogoA(objectUrl);
      } else {
        setLogoB(objectUrl);
      }
    }
  };

  // EXECUTE LOGO TRANSITION
  const triggerSwitch = (targetSlot?: 'A' | 'B') => {
    if (isTransitioning) return;

    const next = targetSlot || (currentSlot === 'A' ? 'B' : 'A');
    setIsTransitioning(true);
    const ms = fadeDuration * 1000;

    if (animationMode === 'direct') {
      // 1. CHUYỂN THẲNG (Cut / Instant)
      setTransitionProgress(`Chuyển thẳng sang Logo ${next}`);
      if (next === 'A') {
        setOpacityA(1);
        setOpacityB(0);
      } else {
        setOpacityA(0);
        setOpacityB(1);
      }
      setCurrentSlot(next);
      setIsTransitioning(false);
      return;
    }

    if (animationMode === 'cross_dissolve') {
      // 2. CROSS DISSOLVE: Cả 2 cùng mờ/hiện đồng thời
      setTransitionProgress(`Cross dissolve (${fadeDuration}s)...`);
      if (next === 'B') {
        setOpacityA(0);
        setOpacityB(1);
      } else {
        setOpacityA(1);
        setOpacityB(0);
      }
      setCurrentSlot(next);

      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionProgress(`Đã chuyển hoàn tất sang Logo ${next}`);
      }, ms);
      return;
    }

    if (animationMode === 'fade_1') {
      // 3. FADE 1: Logo đầu biến mất thẳng (0ms), sau đó logo sau xuất hiện fade (fadeDuration)
      setTransitionProgress(`Logo ${currentSlot} biến mất thẳng... Logo ${next} fade in (${fadeDuration}s)`);
      if (next === 'B') {
        setOpacityA(0); // Cut A immediately
        setOpacityB(0);
        // Next frame trigger fade in for B
        requestAnimationFrame(() => {
          setOpacityB(1);
        });
      } else {
        setOpacityB(0); // Cut B immediately
        setOpacityA(0);
        requestAnimationFrame(() => {
          setOpacityA(1);
        });
      }
      setCurrentSlot(next);

      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionProgress(`Đã hoàn tất Fade 1 sang Logo ${next}`);
      }, ms);
      return;
    }

    if (animationMode === 'fade_2') {
      // 4. FADE 2: Logo đầu fade biến mất trong fadeDuration (hoặc 1s), sau đó logo sau hiện thẳng
      setTransitionProgress(`Logo ${currentSlot} fade biến mất (${fadeDuration}s)...`);
      if (next === 'B') {
        setOpacityA(0); // Fade out A
        setOpacityB(0);
        setTimeout(() => {
          setOpacityB(1); // Cut B in
          setCurrentSlot('B');
          setIsTransitioning(false);
          setTransitionProgress('Logo B đã hiện thẳng hoàn tất');
        }, ms);
      } else {
        setOpacityB(0); // Fade out B
        setOpacityA(0);
        setTimeout(() => {
          setOpacityA(1); // Cut A in
          setCurrentSlot('A');
          setIsTransitioning(false);
          setTransitionProgress('Logo A đã hiện thẳng hoàn tất');
        }, ms);
      }
      return;
    }

    if (animationMode === 'fade_3') {
      // 5. FADE 3: Logo đầu fade biến mất sau đó logo sau fade hiện ra (Sequential Fade)
      const halfMs = ms / 2;
      setTransitionProgress(`1/2: Logo ${currentSlot} fade out (${(fadeDuration / 2).toFixed(2)}s)...`);
      
      if (next === 'B') {
        setOpacityA(0);
        setTimeout(() => {
          setTransitionProgress(`2/2: Logo B fade in (${(fadeDuration / 2).toFixed(2)}s)...`);
          setOpacityB(1);
          setCurrentSlot('B');
          setTimeout(() => {
            setIsTransitioning(false);
            setTransitionProgress('Đã hoàn tất Fade 3 tuần tự');
          }, halfMs);
        }, halfMs);
      } else {
        setOpacityB(0);
        setTimeout(() => {
          setTransitionProgress(`2/2: Logo A fade in (${(fadeDuration / 2).toFixed(2)}s)...`);
          setOpacityA(1);
          setCurrentSlot('A');
          setTimeout(() => {
            setIsTransitioning(false);
            setTransitionProgress('Đã hoàn tất Fade 3 tuần tự');
          }, halfMs);
        }, halfMs);
      }
    }
  };

  // Auto loop logic
  useEffect(() => {
    if (isAutoLoop) {
      autoLoopTimerRef.current = setInterval(() => {
        triggerSwitch();
      }, (fadeDuration + 2.5) * 1000);
    } else {
      if (autoLoopTimerRef.current) {
        clearInterval(autoLoopTimerRef.current);
        autoLoopTimerRef.current = null;
      }
    }

    return () => {
      if (autoLoopTimerRef.current) {
        clearInterval(autoLoopTimerRef.current);
      }
    };
  }, [isAutoLoop, currentSlot, animationMode, fadeDuration]);

  // Swap Logos
  const handleSwap = () => {
    const temp = logoA;
    setLogoA(logoB);
    setLogoB(temp);
  };

  // Position class for on-air simulation
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-5 right-6';
      case 'top-left':
        return 'top-5 left-6';
      case 'bottom-right':
        return 'bottom-5 right-6';
      case 'center':
      default:
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 select-none space-y-6">
      {/* Hidden File Inputs */}
      <input 
        type="file" 
        ref={fileInputRefA} 
        onChange={(e) => handleDeviceUpload(e, 'A')} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={fileInputRefB} 
        onChange={(e) => handleDeviceUpload(e, 'B')} 
        accept="image/*" 
        className="hidden" 
      />

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
                <Tv className="w-6 h-6 text-[#388BFD]" />
                Logo Switcher Visualizer
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#388BFD]/20 text-[#388BFD] border border-[#388BFD]/40">
                On-Air Engine
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              Mô phỏng chuyển tiếp logo kênh truyền hình chuyên nghiệp (Chuyển thẳng, Cross dissolve, Fade 1/2/3)
            </p>
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAutoLoop(!isAutoLoop)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              isAutoLoop 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                : 'bg-white/10 hover:bg-white/15 text-white'
            }`}
          >
            {isAutoLoop ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoLoop ? 'Dừng lặp' : 'Tự động lặp'}</span>
          </button>
          <button
            onClick={handleSwap}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
            title="Đảo chiều Logo A và Logo B"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Đổi A ⇄ B</span>
          </button>
          <button
            onClick={() => triggerSwitch()}
            disabled={isTransitioning}
            className="btn-colored flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${isTransitioning ? 'animate-spin' : ''}`} />
            <span>Kích hoạt chuyển đổi</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Screen Stage on Left (Col 7), Config Options on Right (Col 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 1. TV SCREEN BROADCAST STAGE (COL 7) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Stage Header Info & Options */}
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white flex items-center gap-1">
                <Monitor className="w-3.5 h-3.5 text-[#388BFD]" />
                Màn hình phát sóng mô phỏng (16:9)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                LIVE
              </span>
            </div>

            {/* Position Picker */}
            <div className="flex items-center gap-1">
              <span className="text-[11px]">Vị trí:</span>
              {(['top-right', 'top-left', 'bottom-right', 'center'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setPosition(pos)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                    position === pos ? 'bg-[#388BFD] text-white font-bold' : 'bg-white/5 hover:bg-white/10 text-zinc-400'
                  }`}
                >
                  {pos === 'top-right' ? 'Góc Phải' : pos === 'top-left' ? 'Góc Trái' : pos === 'bottom-right' ? 'Dưới' : 'Giữa'}
                </button>
              ))}
            </div>
          </div>

          {/* SIMULATED BROADCAST SCREEN */}
          <div 
            className={`relative aspect-video w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center transition-all ${
              bgStyle === 'studio'
                ? 'bg-gradient-to-tr from-[#0a0a14] via-[#141428] to-[#1e1b4b]'
                : bgStyle === 'news'
                ? 'bg-gradient-to-r from-red-950/80 via-slate-900 to-zinc-950'
                : bgStyle === 'dark'
                ? 'bg-[#0a0a0c]'
                : 'bg-[#222]'
            }`}
          >
            {/* Background elements */}
            {bgStyle === 'checkerboard' ? (
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(45deg, #555 25%, transparent 25%), linear-gradient(-45deg, #555 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #555 75%), linear-gradient(-45deg, transparent 75%, #555 75%)',
                  backgroundSize: '24px 24px',
                  backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px'
                }}
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(56,139,253,0.15),transparent_60%)]" />
                {/* Simulated studio news ticker */}
                <div className="absolute inset-x-0 bottom-0 h-10 bg-black/70 backdrop-blur-md border-t border-white/10 flex items-center px-4 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[10px] uppercase tracking-wider">
                      THỜI SỰ
                    </span>
                    <span className="text-[11px] text-white/80 font-medium truncate max-w-[280px] sm:max-w-md">
                      Bản tin truyền hình mô phỏng Logo On-Air Switcher Vplay 2026
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white/50">19:00:00</span>
                </div>
              </>
            )}

            {/* ON-AIR LOGO OVERLAY CONTAINER */}
            <div 
              className={`absolute ${getPositionClasses()} pointer-events-none select-none z-20 flex items-center justify-center`}
              style={{
                transform: position === 'center' ? 'translate(-50%, -50%)' : 'none'
              }}
            >
              <div 
                className="relative flex items-center justify-center"
                style={{
                  width: `${(100 * zoomLevel) / 100}px`,
                  height: `${(50 * zoomLevel) / 100}px`
                }}
              >
                {/* LOGO A */}
                <img
                  src={logoA}
                  alt="Logo A"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                  style={{
                    opacity: opacityA,
                    transition: animationMode === 'direct' ? 'none' : `opacity ${fadeDuration}s ease-in-out`
                  }}
                />

                {/* LOGO B */}
                <img
                  src={logoB}
                  alt="Logo B"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                  style={{
                    opacity: opacityB,
                    transition: animationMode === 'direct' ? 'none' : `opacity ${fadeDuration}s ease-in-out`
                  }}
                />
              </div>
            </div>

            {/* Center Visual Helper info when in center mode */}
            {position === 'center' && (
              <div className="absolute bottom-14 px-3 py-1 rounded-full bg-black/60 text-[11px] text-zinc-300 backdrop-blur-md">
                Chế độ xem phóng to chính giữa
              </div>
            )}
          </div>

          {/* Status Bar & Timeline Indicator */}
          <div className="p-3.5 rounded-2xl bg-[#141418] border border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#388BFD] animate-ping" />
              <span className="text-zinc-300 font-medium">Trạng thái:</span>
              <span className="font-bold text-white">{transitionProgress}</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
              <span>Đang phát: <strong className="text-white">Slot {currentSlot}</strong></span>
              <span>Thời gian: <strong className="text-[#388BFD]">{fadeDuration}s</strong></span>
            </div>
          </div>

          {/* Background selector for stage */}
          <div className="flex items-center justify-between px-1 text-xs">
            <span className="text-zinc-400">Nền giả lập TV:</span>
            <div className="flex items-center gap-2">
              {[
                { id: 'studio', label: 'Phòng thu Studio' },
                { id: 'news', label: 'Thời sự Đỏ' },
                { id: 'dark', label: 'Nền đen tối' },
                { id: 'checkerboard', label: 'Checkerboard Alpha' }
              ].map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setBgStyle(bg.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors cursor-pointer ${
                    bgStyle === bg.id ? 'bg-[#388BFD] text-white font-bold' : 'bg-white/5 hover:bg-white/10 text-zinc-400'
                  }`}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* 2. CONFIGURATION & PRESETS PANEL (COL 5) */}
        <div className="lg:col-span-5 flex flex-col gap-4 p-5 rounded-3xl bg-[#18181E] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#388BFD]" />
              Thiết lập hiệu ứng & Nguồn Logo
            </span>
            <span className="text-xs text-zinc-400 font-mono">Transition Studio</span>
          </div>

          <div className="space-y-5">

            {/* 1. CHỌN HIỆU ỨNG CHUYỂN ĐỔI (ANIMATION MODE) */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-white">Chế độ hiệu ứng chuyển đổi (Animation):</span>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: 'direct',
                    name: 'Chuyển thẳng (Direct Cut)',
                    desc: 'Logo đầu biến mất ngay lập tức và logo sau xuất hiện ngay'
                  },
                  {
                    id: 'cross_dissolve',
                    name: 'Cross dissolve (Đồng thời)',
                    desc: 'Logo A mờ dần trong khi Logo B hiện dần lên cùng lúc'
                  },
                  {
                    id: 'fade_1',
                    name: 'Fade 1 (Cắt thẳng rồi Fade in)',
                    desc: 'Logo đầu biến mất thẳng xong logo sau xuất hiện fade'
                  },
                  {
                    id: 'fade_2',
                    name: 'Fade 2 (Fade out rồi Hiện thẳng)',
                    desc: 'Logo đầu fade biến mất sau đó logo sau hiện thẳng lập tức'
                  },
                  {
                    id: 'fade_3',
                    name: 'Fade 3 (Fade out rồi Fade in tuần tự)',
                    desc: 'Logo đầu fade biến mất hoàn toàn rồi logo sau mới fade hiện ra'
                  }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setAnimationMode(mode.id as AnimationMode)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      animationMode === mode.id
                        ? 'border-[#388BFD] bg-[#388BFD]/15 shadow-sm'
                        : 'border-white/5 bg-white/5 hover:bg-white/10 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${animationMode === mode.id ? 'text-[#388BFD]' : 'text-white'}`}>
                        {mode.name}
                      </span>
                      {animationMode === mode.id && <Check className="w-4 h-4 text-[#388BFD]" />}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{mode.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. THỜI GIAN FADE SLIDER (0.3s, 0.5s default, 1s, 1.5s) */}
            <div className="space-y-2.5 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#388BFD]" />
                  Thời gian hiệu ứng (Fade Duration)
                </span>
                <span className="font-mono text-[#388BFD] font-bold text-sm">{fadeDuration}s</span>
              </div>

              {/* Quick Presets: 0.3s, 0.5s, 1s, 1.5s */}
              <div className="grid grid-cols-4 gap-2">
                {[0.3, 0.5, 1.0, 1.5].map((val) => (
                  <button
                    key={val}
                    onClick={() => setFadeDuration(val)}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      fadeDuration === val
                        ? 'bg-[#388BFD] text-white font-bold'
                        : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                    }`}
                  >
                    {val}s {val === 0.5 && '(Mặc định)'}
                  </button>
                ))}
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={fadeDuration}
                onChange={(e) => setFadeDuration(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#388BFD]"
              />
            </div>

            {/* 3. CHỌN NGUỒN LOGO A */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Nguồn Logo A:</span>
                <button
                  onClick={() => fileInputRefA.current?.click()}
                  className="text-[11px] text-[#388BFD] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  Tải ảnh từ máy
                </button>
              </div>

              {/* Logo A Presets */}
              <div className="grid grid-cols-2 gap-2">
                {PRESET_LOGOS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setLogoA(p.url)}
                    className={`p-2 rounded-xl border flex items-center gap-2 text-xs transition-all cursor-pointer ${
                      logoA === p.url
                        ? 'border-[#388BFD] bg-[#388BFD]/15 text-white font-bold'
                        : 'border-white/5 bg-white/5 hover:bg-white/10 text-zinc-300'
                    }`}
                  >
                    <img 
                      src={p.url} 
                      alt={p.name} 
                      referrerPolicy="no-referrer" 
                      className="w-7 h-5 object-contain bg-black/40 rounded p-0.5" 
                    />
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
              </div>

              {/* Custom URL A */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Hoặc dán URL Logo A..."
                  value={customUrlA}
                  onChange={(e) => setCustomUrlA(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#388BFD]"
                />
                <button
                  onClick={() => customUrlA && setLogoA(customUrlA)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            {/* 4. CHỌN NGUỒN LOGO B */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Nguồn Logo B:</span>
                <button
                  onClick={() => fileInputRefB.current?.click()}
                  className="text-[11px] text-[#388BFD] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  Tải ảnh từ máy
                </button>
              </div>

              {/* Logo B Presets */}
              <div className="grid grid-cols-2 gap-2">
                {PRESET_LOGOS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setLogoB(p.url)}
                    className={`p-2 rounded-xl border flex items-center gap-2 text-xs transition-all cursor-pointer ${
                      logoB === p.url
                        ? 'border-[#388BFD] bg-[#388BFD]/15 text-white font-bold'
                        : 'border-white/5 bg-white/5 hover:bg-white/10 text-zinc-300'
                    }`}
                  >
                    <img 
                      src={p.url} 
                      alt={p.name} 
                      referrerPolicy="no-referrer" 
                      className="w-7 h-5 object-contain bg-black/40 rounded p-0.5" 
                    />
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
              </div>

              {/* Custom URL B */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Hoặc dán URL Logo B..."
                  value={customUrlB}
                  onChange={(e) => setCustomUrlB(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#388BFD]"
                />
                <button
                  onClick={() => customUrlB && setLogoB(customUrlB)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            {/* 5. Phóng to Logo (Zoom Level) */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-medium">Tỉ lệ kích thước Logo:</span>
                <span className="font-mono text-white font-bold">{zoomLevel}%</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[100, 150, 200, 300].map((z) => (
                  <button
                    key={z}
                    onClick={() => setZoomLevel(z)}
                    className={`py-1 rounded-lg text-xs font-medium cursor-pointer ${
                      zoomLevel === z ? 'bg-[#388BFD] text-white font-bold' : 'bg-white/5 hover:bg-white/10 text-zinc-400'
                    }`}
                  >
                    {z}%
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
