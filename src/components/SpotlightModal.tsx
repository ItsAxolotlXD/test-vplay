import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Bot } from 'lucide-react';
import { Channel } from '../types';

interface SpotlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (route: string, state?: any) => void;
  onSelectChannel?: (channel: Channel) => void;
}

export const SpotlightModal: React.FC<SpotlightModalProps> = ({
  isOpen,
  onClose,
  navigate,
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
          id="spotlight-modal-container"
          className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 select-none"
        >
          {/* 1. Backdrop / Blurred overlay */}
          <motion.div
            id="spotlight-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* 2. Dialog Modal Box matching WelcomeModal style */}
          <motion.div
            id="spotlight-modal-dialog"
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
            className="relative z-10 w-full max-w-[480px] bg-white dark:bg-[#1E1D22] text-slate-900 dark:text-white rounded-[34px] p-7 sm:p-9 shadow-2xl border border-slate-200 dark:border-[#34343E]/70"
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-[#6366F1]/15 border border-indigo-200 dark:border-[#6366F1]/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Feature Update</span>
              </div>
              <button
                type="button"
                id="btn-spotlight-close-icon"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-[#9CA3AF] dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title */}
            <h1
              id="spotlight-modal-title"
              className="text-xl sm:text-[24px] font-bold text-slate-900 dark:text-white tracking-tight mb-2.5 font-sans leading-tight"
            >
              Spotlight Search is moving
            </h1>

            {/* Description */}
            <p
              id="spotlight-modal-description"
              className="text-sm sm:text-[15px] text-slate-600 dark:text-[#A1A1AA] leading-relaxed mb-7 font-normal"
            >
              Spotlight Search is merging with <strong className="font-bold text-slate-900 dark:text-white">Copilot for Vplay</strong> for a better and smarter searching experience. Try Copilot for Vplay now!
            </p>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              {/* Primary Action Button */}
              <button
                type="button"
                id="btn-spotlight-open-copilot"
                onClick={() => {
                  onClose();
                  navigate('/copilot');
                }}
                className="w-full py-3.5 px-6 rounded-full font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all text-base sm:text-[16px] cursor-pointer flex items-center justify-center shadow-lg shadow-indigo-600/25 tracking-tight text-center gap-2"
              >
                <Bot className="w-5 h-5" />
                <span>Open Copilot</span>
              </button>

              {/* Secondary Close Button */}
              <button
                type="button"
                id="btn-spotlight-close"
                onClick={onClose}
                className="w-full py-3 px-6 rounded-full font-semibold text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 active:scale-[0.98] transition-all text-sm sm:text-[15px] cursor-pointer flex items-center justify-center text-center"
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
