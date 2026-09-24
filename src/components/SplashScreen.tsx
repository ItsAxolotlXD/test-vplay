import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number; // Duration in milliseconds (default 2000ms = 2s)
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  duration = 2000,
}) => {
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFinished(true);
      if (onFinish) {
        onFinish();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  if (isFinished) return null;

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          id="spatial-glass-splash-screen"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.02,
            filter: 'blur(8px)',
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center select-none bg-white text-slate-900 overflow-hidden"
        >
          {/* Subtle Spatial Mesh / Radial Background Depth */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100/50 via-white to-slate-50/80" />

          {/* Ambient Slow-Moving Caustic Glow Aura 1 */}
          <motion.div
            animate={{
              x: [-40, 40, -20, 0],
              y: [-25, 20, -15, 0],
              scale: [1, 1.2, 0.95, 1],
              opacity: [0.45, 0.7, 0.5, 0.45],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-80 h-80 sm:w-[480px] sm:h-[480px] rounded-full pointer-events-none bg-gradient-to-tr from-sky-400/30 via-indigo-300/35 to-teal-300/30 blur-[80px]"
          />

          {/* Ambient Slow-Moving Caustic Glow Aura 2 (Opposite Phase) */}
          <motion.div
            animate={{
              x: [35, -35, 15, 0],
              y: [20, -25, 10, 0],
              scale: [0.95, 1.15, 1, 0.95],
              opacity: [0.35, 0.6, 0.4, 0.35],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-72 h-72 sm:w-[420px] sm:h-[420px] rounded-full pointer-events-none bg-gradient-to-br from-blue-300/30 via-violet-300/25 to-pink-300/20 blur-[75px]"
          />

          {/* Centered Spatial Glass Card & Typography */}
          <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">
            {/* Main Title: "Welcome to Spatial Glass" with Gentle, Slow Moving Glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative py-2 px-4"
            >
              {/* Dynamic Soft Animated Glow directly behind and around the text */}
              <motion.div
                animate={{
                  x: [-12, 12, -8, 0],
                  y: [-6, 8, -4, 0],
                  filter: [
                    'drop-shadow(0 0 16px rgba(56, 139, 253, 0.45)) drop-shadow(0 0 32px rgba(99, 102, 241, 0.25))',
                    'drop-shadow(0 0 28px rgba(14, 165, 233, 0.6)) drop-shadow(0 0 48px rgba(139, 92, 246, 0.35))',
                    'drop-shadow(0 0 16px rgba(56, 139, 253, 0.45)) drop-shadow(0 0 32px rgba(99, 102, 241, 0.25))',
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-transparent select-none pointer-events-none"
              >
                Welcome to Spatial Glass
              </motion.div>

              {/* Primary Visible Text */}
              <motion.h1
                animate={{
                  textShadow: [
                    '0 0 18px rgba(56, 189, 248, 0.45), 0 0 32px rgba(99, 102, 241, 0.25)',
                    '0 0 26px rgba(14, 165, 233, 0.65), 0 0 45px rgba(139, 92, 246, 0.35)',
                    '0 0 18px rgba(56, 189, 248, 0.45), 0 0 32px rgba(99, 102, 241, 0.25)',
                  ],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 selection:bg-sky-200"
              >
                Welcome to{' '}
                <span className="bg-gradient-to-r from-[#FBBF24] via-[#F97316] to-[#E6007A] bg-clip-text text-transparent">
                  Spatial Glass
                </span>
              </motion.h1>
            </motion.div>

            {/* Glass Progress Bar indicator across 2s */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-8 w-44 sm:w-56 h-1.5 rounded-full bg-slate-900/[0.08] p-[1px] overflow-hidden backdrop-blur-sm border border-slate-900/[0.06] shadow-sm"
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: duration / 1000, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-sky-500 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.75)]"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
