import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings as SettingsIcon, 
  X, 
  Maximize2, 
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { Settings } from '../pages/Settings';
import { useFeatureFlags } from '../hooks/useFeatureFlags';

export interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (route: string) => void;
  onOpenAsPage?: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  navigate,
  onOpenAsPage,
}) => {
  const { flags, setFlag } = useFeatureFlags();

  // Escape key handler to close drawer
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Drawer-internal navigation wrapper: if user clicks a link to another page (e.g., /feature-flags),
  // navigate to it and close the drawer cleanly
  const handleDrawerNavigate = (route: string) => {
    if (route === '/settings' || route.startsWith('/settings')) {
      // Already in settings drawer, no-op or scroll to top
      const drawerBody = document.getElementById('settings-drawer-scroll-body');
      if (drawerBody) {
        drawerBody.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    onClose();
    navigate(route);
  };

  // Handler to switch back to normal tab page mode
  const handleSwitchToPageMode = () => {
    if (onOpenAsPage) {
      onOpenAsPage();
    } else {
      setFlag('settings_drawer', false);
      onClose();
      navigate('/settings');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="vplay-settings-drawer-root"
          className="fixed inset-0 z-[9999] flex justify-end select-none"
          role="dialog"
          aria-modal="true"
          aria-label="Settings Drawer"
        >
          {/* 1. Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
          />

          {/* 2. Sliding Drawer Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0.95 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.95 }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="relative z-10 w-full sm:w-[580px] md:w-[680px] lg:w-[760px] h-full max-h-screen bg-[#141417]/95 text-[#E0E0E6] backdrop-blur-2xl border-l border-white/10 shadow-[-16px_0_48px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden"
          >
            {/* Top Bar / Header */}
            <div className="shrink-0 px-5 sm:px-6 py-4 bg-[#18181C]/90 border-b border-white/10 flex items-center justify-between gap-4 backdrop-blur-xl z-20">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E6007A] to-[#FF6699] flex items-center justify-center shadow-lg shadow-[#E6007A]/25 shrink-0">
                  <SettingsIcon className="w-5 h-5 text-white animate-[spin_12s_linear_infinite]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight truncate">
                      Cài đặt
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E6007A]/20 text-[#FF6699] border border-[#E6007A]/30 shrink-0">
                      DRAWER
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#9CA3AF] truncate">
                    Trượt từ bên phải • Tùy chỉnh hệ thống & giao diện
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Switch to Full Tab Page Button */}
                <button
                  type="button"
                  onClick={handleSwitchToPageMode}
                  title="Mở dưới dạng tab trang (Tắt Drawer)"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 hover:text-white border border-white/5 transition-all cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Dạng Tab</span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  title="Đóng cài đặt (Esc)"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-all cursor-pointer border border-white/5 group"
                >
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </div>
            </div>

            {/* Scrollable Drawer Body with Settings Content */}
            <div
              id="settings-drawer-scroll-body"
              className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 overscroll-contain"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#3F3F46 transparent' }}
            >
              <Settings 
                navigate={handleDrawerNavigate} 
                isDrawer={true} 
                onClose={onClose} 
              />
            </div>

            {/* Drawer Bottom Bar */}
            <div className="shrink-0 px-5 sm:px-6 py-2.5 bg-[#121215]/90 border-t border-white/5 flex items-center justify-between text-[11px] text-[#71717A] backdrop-blur-xl">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#E6007A]" />
                <span>Feature Flag: <strong>Settings drawer</strong> đang bật</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="hover:text-white transition-colors cursor-pointer font-medium"
              >
                Nhấn <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-mono text-[10px]">Esc</kbd> để đóng
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
