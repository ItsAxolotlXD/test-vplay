import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, MicOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTabSearch } from '../context/TabSearchContext';
import { useFeatureFlags } from '../hooks/useFeatureFlags';

interface FloatingTabSearchBarProps {
  isVisible?: boolean;
}

export const FloatingTabSearchBar: React.FC<FloatingTabSearchBarProps> = ({ isVisible = true }) => {
  const { searchQuery, setSearchQuery, clearSearch, placeholder, isStatusBarSearchExpanded, setIsStatusBarSearchExpanded } = useTabSearch();
  const { flags } = useFeatureFlags();
  const isStatusBar = Boolean(flags['status_bar']);
  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [vboardState, setVboardState] = useState<{ isOpen: boolean; height: number }>({
    isOpen: false,
    height: 0,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // NOTE: We deliberately DO NOT auto-focus on morph, respecting user directive:
  // "ko tự nhảy keyboard khi morph". Focus only occurs when user clicks/taps input.

  // Handle click outside to collapse search bar back into status bar button
  useEffect(() => {
    if (!isStatusBarSearchExpanded) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't close if clicked inside search bar or on the status bar search button
      if (
        document.getElementById('floating-tab-search-bar')?.contains(target) ||
        document.getElementById('status-bar-search-toggle')?.contains(target)
      ) {
        return;
      }
      setIsStatusBarSearchExpanded(false);
    };

    const timer = setTimeout(() => {
      window.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStatusBarSearchExpanded, setIsStatusBarSearchExpanded]);

  // Listen for V-board virtual keyboard slide-up / slide-down events
  useEffect(() => {
    const handleVBoardState = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setVboardState({
          isOpen: Boolean(detail.isOpen),
          height: Number(detail.height) || 320,
        });
      }
    };

    window.addEventListener('vplay:vboard_state', handleVBoardState);
    return () => {
      window.removeEventListener('vplay:vboard_state', handleVBoardState);
    };
  }, []);

  // Initialize Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSpeechSupported(true);
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'vi-VN';

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setSearchQuery(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (e) {
        setSpeechSupported(false);
      }
    }
  }, [setSearchQuery]);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      inputRef.current?.focus();
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const isVBoardUp = vboardState.isOpen;
  const keyboardHeight = vboardState.height || 320;

  return (
    <AnimatePresence>
      {isVisible && isStatusBarSearchExpanded && (
        <div
          id="floating-tab-search-bar"
          className={`fixed left-4 sm:left-6 z-[96] pointer-events-none select-none flex flex-col items-start gap-1.5 ${
            !isVBoardUp ? 'bottom-3 sm:bottom-5' : 'z-[100002]'
          }`}
          style={{
            bottom: isVBoardUp ? `${keyboardHeight + 12}px` : undefined,
            left: 'max(1rem, env(safe-area-inset-left, 1rem))',
          }}
        >
          {/* Pre-release build product watermark lines - only shown here when status bar is OFF */}
          {!isStatusBar && (
            <motion.div 
              id="floating-search-prerelease-watermark"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="text-left pointer-events-none select-none px-2 space-y-0.5"
            >
              <p className="text-[11px] sm:text-xs font-medium tracking-tight text-zinc-300/90 leading-tight">
                VNRT Online v26.10_devb (26A3667c) - Pre-release build product
              </p>
              <p className="text-[10px] sm:text-[11px] font-normal text-zinc-300/75 leading-tight">
                Anything you've seen here are not finished and may change in future builds
              </p>
            </motion.div>
          )}

          {/* Morphing Floating Search Pill - Modern Dark Pill with Full-Width Accent Line */}
          <motion.div
            layoutId="vplay-floating-search-pill"
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 28,
            }}
            style={{
              fontFamily: "'Inter', 'Integer', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              backgroundColor: isFocused ? 'rgba(56, 58, 66, 0.94)' : 'rgba(48, 50, 58, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
            className="pointer-events-auto relative w-full max-w-[320px] sm:max-w-[380px] h-[48px] sm:h-[52px] rounded-full flex items-center px-3.5 sm:px-4 transition-all duration-300 border-0 shadow-[0_10px_32px_rgba(0,0,0,0.4)] overflow-hidden"
          >
            {/* Search Icon */}
            <div className="relative z-10 shrink-0 mr-2.5 sm:mr-3 w-5 h-5 flex items-center justify-center pointer-events-none">
              <Search className={`w-5 h-5 transition-colors stroke-[2.2] ${isFocused ? 'text-white' : 'text-zinc-300'}`} />
            </div>

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  if (searchQuery) {
                    clearSearch();
                  } else {
                    setIsStatusBarSearchExpanded(false);
                  }
                  inputRef.current?.blur();
                }
              }}
              placeholder={isListening ? 'Listening...' : placeholder}
              style={{ fontFamily: "'Inter', 'Integer', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
              className="relative z-10 w-full bg-transparent text-white placeholder:text-zinc-300 text-sm sm:text-[15px] font-medium tracking-tight focus:outline-none truncate"
            />

            {/* Actions on right: Clear Button & Mic & Close/Collapse Button */}
            <div className="relative z-10 flex items-center gap-1.5 shrink-0 ml-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    clearSearch();
                    inputRef.current?.focus();
                  }}
                  title="Xóa tìm kiếm"
                  className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              )}

              {/* Microphone Button */}
              <button
                type="button"
                onClick={toggleListening}
                title={isListening ? 'Dừng lắng nghe' : 'Tìm kiếm bằng giọng nói'}
                className={`w-[26px] h-[26px] flex items-center justify-center rounded-full transition-all cursor-pointer ${
                  isListening
                    ? 'text-orange-400 animate-pulse bg-orange-500/20 scale-110'
                    : 'text-zinc-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-4.5 h-4.5 stroke-[2.2] text-orange-400" />
                ) : (
                  <Mic className="w-4.5 h-4.5 stroke-[2.2]" />
                )}
              </button>

              {/* Close/Collapse to Status Bar Button */}
              <button
                type="button"
                onClick={() => setIsStatusBarSearchExpanded(false)}
                title="Thu gọn vào thanh trạng thái"
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5 stroke-[2.2]" />
              </button>
            </div>

            {/* Bottom Accent Line: Runs across the full width of search bar, turns vibrant orange when focused */}
            <div
              className={`absolute bottom-0 inset-x-0 w-full h-[2.5px] pointer-events-none z-20 transition-all duration-300 ${
                isFocused
                  ? 'bg-[#ff6600] shadow-[0_0_10px_#ff6600,0_0_18px_rgba(255,102,0,0.6)]'
                  : 'bg-white/35'
              }`}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FloatingTabSearchBar;
