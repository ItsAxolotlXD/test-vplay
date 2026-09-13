import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Flame, 
  Zap, 
  Sliders, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  RefreshCw, 
  Settings2, 
  Eye, 
  Activity,
  Play
} from 'lucide-react';
import { playPopSound, playWinSound } from '../../utils/sound';

interface MotionEffectsLayerProps {
  isEnabled: boolean;
  onToggle: () => void;
  navigate?: (route: string) => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
}

export const MotionEffectsLayer: React.FC<MotionEffectsLayerProps> = ({
  isEnabled,
  onToggle,
  navigate
}) => {
  const [isHudExpanded, setIsHudExpanded] = useState(false);
  const [motionIntensity, setMotionIntensity] = useState<'smooth' | 'bouncy' | 'extreme'>('bouncy');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [burstCount, setBurstCount] = useState(0);

  // Trigger floating particle burst
  const triggerParticleBurst = (originX?: number, originY?: number) => {
    playWinSound();
    const colors = ['#FF267A', '#C83DFF', '#00F0FF', '#FFB800', '#10B981', '#E6005A'];
    const count = 24;
    const startX = originX ?? (window.innerWidth / 2);
    const startY = originY ?? (window.innerHeight / 2);

    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      const speed = 4 + Math.random() * 8;
      return {
        id: Date.now() + i,
        x: startX,
        y: startY,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.floor(Math.random() * 10) + 6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      };
    });

    setParticles((prev) => [...prev.slice(-30), ...newParticles]);
    setBurstCount((prev) => prev + 1);

    // Auto cleanup particles after 1.5s
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 1500);
  };

  // Click on screen particle ripple (gentle effect)
  useEffect(() => {
    if (!isEnabled) return;

    const handleGlobalClick = (e: MouseEvent) => {
      // Don't trigger if clicked inside the HUD or buttons
      const target = e.target as HTMLElement;
      if (target.closest('#motion-hud-panel') || target.closest('button') || target.closest('input')) {
        return;
      }

      // Small gentle 4-particle sparkle on background click
      const colors = ['#FF267A', '#00F0FF', '#FFB800', '#C83DFF'];
      const microParticles: Particle[] = Array.from({ length: 4 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 4;
        return {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          color: colors[i % colors.length],
          size: 6,
          vx: Math.cos(angle) * 3,
          vy: Math.sin(angle) * 3,
        };
      });

      setParticles((prev) => [...prev.slice(-20), ...microParticles]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !microParticles.some((mp) => mp.id === p.id)));
      }, 800);
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [isEnabled]);

  return (
    <>
      {/* 1. FLOATING AMBIENT GLOWING ORBS (Active when animation_test is enabled) */}
      {isEnabled && (
        <div 
          className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
          aria-hidden="true"
        >
          {/* Top Left Rose Glow Orb */}
          <motion.div
            animate={{
              x: [0, 40, -30, 0],
              y: [0, -50, 30, 0],
              scale: [1, 1.25, 0.9, 1],
              opacity: [0.18, 0.28, 0.15, 0.18],
            }}
            transition={{
              duration: motionIntensity === 'extreme' ? 7 : 14,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#E6005A] via-[#FF267A] to-transparent blur-3xl"
          />

          {/* Top Right Cyan Glow Orb */}
          <motion.div
            animate={{
              x: [0, -50, 20, 0],
              y: [0, 40, -40, 0],
              scale: [1, 0.85, 1.2, 1],
              opacity: [0.12, 0.22, 0.14, 0.12],
            }}
            transition={{
              duration: motionIntensity === 'extreme' ? 9 : 18,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            className="absolute top-1/4 -right-28 w-96 h-96 rounded-full bg-gradient-to-bl from-cyan-500 via-blue-600 to-transparent blur-3xl"
          />

          {/* Bottom Left Purple Glow Orb */}
          <motion.div
            animate={{
              x: [0, 60, -40, 0],
              y: [0, -30, 50, 0],
              scale: [0.95, 1.15, 0.85, 0.95],
              opacity: [0.14, 0.24, 0.16, 0.14],
            }}
            transition={{
              duration: motionIntensity === 'extreme' ? 8 : 16,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
            className="absolute bottom-10 -left-20 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-transparent blur-3xl"
          />

          {/* Center Amber Accent Orb */}
          <motion.div
            animate={{
              x: [0, -30, 40, 0],
              y: [0, 60, -30, 0],
              scale: [0.8, 1.1, 0.9, 0.8],
              opacity: [0.08, 0.16, 0.1, 0.08],
            }}
            transition={{
              duration: motionIntensity === 'extreme' ? 10 : 20,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 3,
            }}
            className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-transparent blur-3xl"
          />
        </div>
      )}

      {/* 2. DYNAMIC PARTICLE BURST OVERLAY */}
      {isEnabled && particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                x: p.x,
                y: p.y,
                scale: 0.2,
                opacity: 1,
              }}
              animate={{
                x: p.x + p.vx * 15,
                y: p.y + p.vy * 15 + 40, // gravity fall
                scale: [0.2, 1.2, 0],
                opacity: [1, 0.8, 0],
                rotate: [0, Math.random() * 360],
              }}
              transition={{
                duration: 0.9,
                ease: 'easeOut',
              }}
              style={{
                backgroundColor: p.color,
                width: p.size,
                height: p.size,
                boxShadow: `0 0 12px ${p.color}`,
              }}
              className="absolute rounded-full"
            />
          ))}
        </div>
      )}

      {/* 3. FLOATING INTERACTIVE HUD FOR "ANIMATION TEST" */}
      <div 
        id="motion-hud-panel"
        className="fixed bottom-6 left-6 z-40 select-none font-sans"
      >
        <AnimatePresence>
          {isHudExpanded ? (
            /* EXPANDED MOTION CONTROLLER SANDBOX */
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.92 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="w-80 bg-[#1A1922]/95 border border-[#3E3D4D] rounded-3xl p-4 shadow-2xl backdrop-blur-2xl text-white space-y-3.5"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#2D2D38] pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#FF267A] to-purple-600 flex items-center justify-center shadow-md">
                    <Sparkles className="w-4 h-4 text-white animate-spin-slow" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                      <span>Animation Test</span>
                      <span className="px-1.5 py-0.2 rounded-md bg-[#FF267A]/20 text-[#FF267A] border border-[#FF267A]/30 text-[9px] font-black uppercase">
                        BETA
                      </span>
                    </h4>
                    <p className="text-[10px] text-zinc-400">Điều khiển hoạt ảnh toàn hệ thống</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsHudExpanded(false)}
                  className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  title="Thu gọn bảng điều khiển"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#131218] border border-[#2D2D38]">
                <div className="flex items-center gap-2">
                  <Activity className={`w-4 h-4 ${isEnabled ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
                  <div>
                    <p className="text-xs font-bold text-white">
                      Trạng thái Motion
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      {isEnabled ? 'Đang bật mọi hoạt ảnh & orbs' : 'Đã tạm tắt animation'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playPopSound();
                    onToggle();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                    isEnabled
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                      : 'bg-[#2A2933] text-zinc-400 hover:text-white border border-[#3E3D4D]'
                  }`}
                >
                  {isEnabled ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>BẬT</span>
                    </>
                  ) : (
                    <span>TẮT</span>
                  )}
                </button>
              </div>

              {/* Intensity Preset Modes */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-purple-400" />
                  <span>Độ đàn hồi & Năng lượng</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['smooth', 'bouncy', 'extreme'] as const).map((mode) => {
                    const isSel = motionIntensity === mode;
                    const labels = {
                      smooth: 'Êm dịu',
                      bouncy: 'Đàn hồi',
                      extreme: 'Cực đại',
                    };
                    return (
                      <button
                        key={mode}
                        onClick={() => {
                          playPopSound();
                          setMotionIntensity(mode);
                        }}
                        className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                          isSel
                            ? 'bg-[#E6005A] text-white border-transparent shadow-md shadow-[#E6005A]/30'
                            : 'bg-[#18171E] border-[#2D2D38] text-zinc-400 hover:text-white'
                        }`}
                      >
                        {labels[mode]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Test Action: Particle Burst */}
              <div className="pt-1 flex items-center gap-2">
                <button
                  onClick={() => triggerParticleBurst()}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#FF267A] to-purple-600 hover:opacity-90 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-[#FF267A]/20"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Bắn Pháo Hoa ({burstCount})</span>
                </button>

                {navigate && (
                  <button
                    onClick={() => {
                      playPopSound();
                      navigate('/feature-flags');
                    }}
                    className="p-2 rounded-xl bg-[#2A2933] hover:bg-[#343340] border border-[#3E3D4D] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="Mở cài đặt Feature Flags"
                  >
                    <Settings2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            /* COLLAPSED FLOATING PILL BUTTON */
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playPopSound();
                setIsHudExpanded(true);
              }}
              className={`group flex items-center gap-2 px-3.5 py-2 rounded-full border shadow-xl backdrop-blur-xl transition-all cursor-pointer ${
                isEnabled
                  ? 'bg-[#1F1E24]/90 border-[#FF267A]/40 text-white shadow-[#FF267A]/10 hover:border-[#FF267A]'
                  : 'bg-[#1F1E24]/80 border-zinc-700 text-zinc-400 hover:text-white'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-[#FF267A] animate-ping' : 'bg-zinc-500'}`} />
              <Sparkles className={`w-3.5 h-3.5 ${isEnabled ? 'text-[#FF267A] animate-spin-slow' : 'text-zinc-500'}`} />
              <span className="text-xs font-bold tracking-wide">
                Animation Test: {isEnabled ? 'BẬT' : 'TẮT'}
              </span>
              <ChevronUp className="w-3 h-3 text-zinc-400 group-hover:text-white transition-colors" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default MotionEffectsLayer;
