import React, { useState, useEffect, useRef } from 'react';
import { VBoardKeyboard } from './VBoardKeyboard';
import { disableDeviceKeyboard, restoreDeviceKeyboard } from './vboardUtils';
import { Keyboard as KeyboardIcon, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playPopSound } from '../../utils/sound';

interface VBoardOverlayProps {
  isEnabled: boolean;
  navigate?: (path: string) => void;
}

export const VBoardOverlay: React.FC<VBoardOverlayProps> = ({ isEnabled, navigate }) => {
  const [activeInput, setActiveInput] = useState<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeviceKeyboardActive, setIsDeviceKeyboardActive] = useState(false);

  const isEnabledRef = useRef(isEnabled);
  const isDeviceKeyboardActiveRef = useRef(isDeviceKeyboardActive);

  useEffect(() => {
    isEnabledRef.current = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    isDeviceKeyboardActiveRef.current = isDeviceKeyboardActive;
  }, [isDeviceKeyboardActive]);

  // Global listener for input focus and interaction
  useEffect(() => {
    if (!isEnabled) {
      setIsOpen(false);
      setActiveInput(null);
      setIsDeviceKeyboardActive(false);
      return;
    }

    // Helper to check if an element is a text input
    const isTextInput = (el: any): el is (HTMLInputElement | HTMLTextAreaElement) => {
      if (!el) return false;
      if (el instanceof HTMLTextAreaElement) return true;
      if (el instanceof HTMLInputElement) {
        const ignoredTypes = ['button', 'submit', 'checkbox', 'radio', 'file', 'hidden', 'image', 'reset', 'range'];
        return !ignoredTypes.includes(el.type.toLowerCase()) && !el.readOnly && !el.disabled;
      }
      return false;
    };

    // Prevent device keyboard by setting inputmode="none" BEFORE touch/focus
    const handlePointerDown = (e: PointerEvent) => {
      if (!isEnabledRef.current) return;
      if (isDeviceKeyboardActiveRef.current) return; // User chose native device keyboard

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const inputEl = target.closest('input, textarea');
      if (inputEl && isTextInput(inputEl)) {
        // Enforce inputmode="none" to prevent native OS virtual keyboard
        disableDeviceKeyboard(inputEl);
      }
    };

    // When an input receives focus or click, open V-board (unless in device keyboard mode)
    const handleFocusIn = (e: FocusEvent) => {
      if (!isEnabledRef.current) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (isTextInput(target)) {
        setActiveInput(target);
        if (isDeviceKeyboardActiveRef.current) {
          // Native device keyboard is active, ensure inputmode is clean
          restoreDeviceKeyboard(target);
        } else {
          // Enforce inputmode="none" and open V-board
          disableDeviceKeyboard(target);
          setIsOpen(true);
        }
      }
    };

    // Explicit click listener for desktop web browsers where focus might already be active
    const handleInputClick = (e: MouseEvent) => {
      if (!isEnabledRef.current) return;
      if (isDeviceKeyboardActiveRef.current) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const inputEl = target.closest('input, textarea');
      if (inputEl && isTextInput(inputEl)) {
        setActiveInput(inputEl);
        disableDeviceKeyboard(inputEl);
        setIsOpen(true);
      }
    };

    // Dismiss when clicking outside both the keyboard and input
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Don't close if clicked inside the keyboard or the switch badge
      if (target.closest('#vboard-keyboard-container') || target.closest('#vboard-dock-badge')) {
        return;
      }

      // Don't close if clicking on an input element
      if (target.closest('input, textarea')) {
        return;
      }

      // If clicked elsewhere, close V-board
      setIsOpen(false);
    };

    // Listen for Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, { capture: true });
    window.addEventListener('focusin', handleFocusIn, { capture: true });
    window.addEventListener('click', handleInputClick, { capture: true });
    window.addEventListener('click', handleDocumentClick);
    window.addEventListener('keydown', handleKeyDown);

    // If not in device keyboard mode, apply inputmode="none" to existing inputs
    if (!isDeviceKeyboardActiveRef.current) {
      document.querySelectorAll('input, textarea').forEach((el) => {
        if (isTextInput(el)) {
          disableDeviceKeyboard(el);
        }
      });
    }

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown, { capture: true });
      window.removeEventListener('focusin', handleFocusIn, { capture: true });
      window.removeEventListener('click', handleInputClick, { capture: true });
      window.removeEventListener('click', handleDocumentClick);
      window.removeEventListener('keydown', handleKeyDown);

      // Restore inputs if disabled
      document.querySelectorAll('input, textarea').forEach((el) => {
        if (isTextInput(el)) {
          restoreDeviceKeyboard(el);
        }
      });
    };
  }, [isEnabled]);

  // Handler when user taps Globe icon in V-board to switch to device keyboard
  const handleSwitchToDeviceKeyboard = () => {
    playPopSound();
    setIsDeviceKeyboardActive(true);
    setIsOpen(false);

    if (activeInput) {
      restoreDeviceKeyboard(activeInput);
      setTimeout(() => {
        activeInput.focus();
      }, 50);
    }
  };

  // Handler to switch back from device keyboard to V-board
  const handleSwitchBackToVBoard = () => {
    playPopSound();
    setIsDeviceKeyboardActive(false);

    if (activeInput) {
      disableDeviceKeyboard(activeInput);
      activeInput.focus();
    }
    setIsOpen(true);
  };

  // Broadcast V-board state to components (e.g. FloatingTabSearchBar)
  useEffect(() => {
    if (isOpen) {
      const broadcastHeight = () => {
        const el = document.getElementById('vboard-keyboard-container');
        const height = el ? el.getBoundingClientRect().height : 320;
        window.dispatchEvent(
          new CustomEvent('vplay:vboard_state', {
            detail: { isOpen: true, height: height > 100 ? height : 320 },
          })
        );
      };

      broadcastHeight();
      const timer = setTimeout(broadcastHeight, 60);

      // ResizeObserver in case emoji drawer or Copilot bar expands
      let ro: ResizeObserver | null = null;
      const el = document.getElementById('vboard-keyboard-container');
      if (el && typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const h = entry.contentRect.height;
            if (h > 100) {
              window.dispatchEvent(
                new CustomEvent('vplay:vboard_state', {
                  detail: { isOpen: true, height: h },
                })
              );
            }
          }
        });
        ro.observe(el);
      }

      return () => {
        clearTimeout(timer);
        if (ro) ro.disconnect();
      };
    } else {
      window.dispatchEvent(
        new CustomEvent('vplay:vboard_state', {
          detail: { isOpen: false, height: 0 },
        })
      );
    }
  }, [isOpen]);

  // Clean up if unmounted or disabled
  useEffect(() => {
    return () => {
      window.dispatchEvent(
        new CustomEvent('vplay:vboard_state', {
          detail: { isOpen: false, height: 0 },
        })
      );
    };
  }, []);

  // Automatically nudge / scroll the page up when keyboard opens to prevent covering inputs & content
  useEffect(() => {
    if (isOpen) {
      // 1. Add spacious bottom padding to body so the page can scroll past the bottom content
      const prevPadding = document.body.style.paddingBottom;
      const prevTransition = document.body.style.transition;
      document.body.style.transition = 'padding-bottom 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
      document.body.style.paddingBottom = '340px';

      // 2. Smoothly scroll active input or view up
      const timer = setTimeout(() => {
        if (activeInput) {
          const rect = activeInput.getBoundingClientRect();
          const keyboardHeight = 310;
          const safeBottom = window.innerHeight - keyboardHeight;

          // If the element is near or below the top of the virtual keyboard
          if (rect.bottom > safeBottom - 24) {
            const scrollDelta = (rect.bottom - safeBottom) + 70;
            window.scrollBy({
              top: scrollDelta,
              behavior: 'smooth',
            });
            activeInput.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
        }
      }, 70);

      return () => {
        clearTimeout(timer);
        document.body.style.paddingBottom = prevPadding;
        document.body.style.transition = prevTransition;
      };
    } else {
      document.body.style.paddingBottom = '';
    }
  }, [isOpen, activeInput]);

  // Clean up if disabled while open
  useEffect(() => {
    if (!isEnabled && isOpen) {
      setIsOpen(false);
      setActiveInput(null);
    }
  }, [isEnabled, isOpen]);

  if (!isEnabled) return null;

  return (
    <>
      {/* V-board Virtual Keyboard Container */}
      <VBoardKeyboard
        targetInput={activeInput}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        onSwitchToDeviceKeyboard={handleSwitchToDeviceKeyboard}
        navigate={navigate}
      />

      {/* Floating Re-open V-board Chip when user has switched to device keyboard */}
      <AnimatePresence>
        {isDeviceKeyboardActive && (
          <motion.button
            id="vboard-dock-badge"
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSwitchBackToVBoard}
            className="fixed bottom-5 right-5 z-[99999] px-3.5 py-2.5 rounded-full bg-[#1C1C20]/95 border border-cyan-500/50 text-white shadow-[0_8px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl flex items-center gap-2.5 cursor-pointer select-none group"
            title="Đang dùng bàn phím thiết bị. Nhấp vào đây để quay lại bàn phím V-board"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
            <KeyboardIcon className="w-4 h-4 text-cyan-300" />
            <span className="text-xs font-semibold text-cyan-200 group-hover:text-white transition-colors">
              Mở lại V-board
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400/80 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default VBoardOverlay;
