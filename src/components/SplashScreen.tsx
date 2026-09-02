import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tv } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number; // Duration in milliseconds
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  duration = 1800,
}) => {
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [logoError, setLogoError] = useState<boolean>(false);

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
          id="vplay-splash-screen"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.03,
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } 
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center select-none bg-[#0D0D11] text-white overflow-hidden"
        >
          {/* Centered Minimalist Content */}
          <div className="flex flex-col items-center justify-center gap-8">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center"
            >
              {!logoError ? (
                <img
                  src="https://static.wikia.nocookie.net/ep-deo/images/f/f8/Vpla.png/revision/latest/scale-to-width-down/1000?cb=20260829062528"
                  alt="Vplay"
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain filter drop-shadow-[0_8px_24px_rgba(230,0,90,0.25)]"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-white/[0.04] border border-white/10">
                  <Tv className="w-10 h-10 text-[#E6005A]" />
                  <span className="text-sm font-bold tracking-wider mt-1">VPLAY</span>
                </div>
              )}
            </motion.div>

            {/* Loading Progress Bar (Thanh chạy) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              className="w-56 sm:w-64 h-3 sm:h-3.5 rounded-full bg-white/[0.08] p-0.5 overflow-hidden border border-white/15 shadow-inner"
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: Math.max(0.5, (duration - 150) / 1000), ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-gradient-to-r from-[#E6005A] via-[#FF2E7E] to-[#E6005A] rounded-full shadow-[0_0_16px_rgba(230,0,90,0.85)]"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
