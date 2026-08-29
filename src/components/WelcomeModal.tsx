import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Listen for Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="welcome-modal-container"
          className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 select-none"
        >
          {/* 1. Backdrop / Blurred overlay */}
          <motion.div
            id="welcome-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* 2. Dialog Modal Box */}
          <motion.div
            id="welcome-modal-dialog"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0,
              transition: {
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1]
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95,
              y: 10,
              transition: {
                duration: 0.22,
                ease: [0.25, 0.1, 0.25, 1]
              }
            }}
            className="relative z-10 w-full max-w-[480px] bg-[#1E1D22] rounded-[34px] p-7 sm:p-9 shadow-2xl border border-[#34343E]/70"
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6005A]/15 border border-[#E6005A]/30 text-[#E6005A] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Release Notes</span>
              </div>
              <button
                type="button"
                id="btn-welcome-close-icon"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#9CA3AF] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title */}
            <h1
              id="welcome-modal-title"
              className="text-xl sm:text-[24px] font-bold text-white tracking-tight mb-2.5 font-sans leading-tight"
            >
              Welcome to Vplay 26.9 - Developer Beta 3
            </h1>

            {/* Description */}
            <p
              id="welcome-modal-description"
              className="text-sm sm:text-[15px] text-[#A1A1AA] leading-relaxed mb-7 font-normal"
            >
              This update added and fixed some stuff.
            </p>

            {/* Action Buttons */}
            <div>
              {/* Button colored: Close */}
              <button
                type="button"
                id="btn-welcome-close"
                onClick={onClose}
                className="w-full py-3.5 px-6 rounded-full font-bold text-white bg-[#E6005A] hover:bg-[#FF267A] active:scale-[0.98] transition-all text-base sm:text-[16px] cursor-pointer flex items-center justify-center shadow-lg shadow-[#E6005A]/25 tracking-tight text-center"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
