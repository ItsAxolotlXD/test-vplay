import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, MicOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTabSearch } from '../context/TabSearchContext';
import { useFeatureFlags } from '../hooks/useFeatureFlags';

interface FloatingTabSearchBarProps {
  isVisible?: boolean;
}

export const FloatingTabSearchBar: React.FC<FloatingTabSearchBarProps> = ({ isVisible = true }) => {
  const { searchQuery, setSearchQuery, clearSearch, placeholder, isSearchExpanded, setIsSearchExpanded } = useTabSearch();
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
    if (!isSearchExpanded) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't close if clicked inside search bar or on the status bar search button
      if (
        document.getElementById('floating-tab-search-bar')?.contains(target) ||
        document.getElementById('status-bar-search-toggle')?.contains(target)
      ) {
        return;
      }
      setIsSearchExpanded(false);
    };

    const timer = setTimeout(() => {
      window.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchExpanded, setIsSearchExpanded]);

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
      {isVisible && isSearchExpanded && (
        <div
          id="floating-tab-search-bar"
          className={`fixed inset-x-0 mx-auto w-full max-w-[540px] px-3 pointer-events-none select-none flex flex-col items-center gap-1.5 ${
            !isVBoardUp ? 'bottom-3 sm:bottom-5 z-[96]' : 'z-[100002]'
          }`}
          style={{
            bottom: isVBoardUp ? `${keyboardHeight + 12}px` : undefined,
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
              className="text-center pointer-events-none select-none px-2 space-y-0.5"
            >
              <p className="text-[11px] sm:text-xs font-medium tracking-tight text-zinc-300/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] leading-tight">
                VNRT Online v26.10_devb (26A3667c) - Pre-release build product
              </p>
              <p className="text-[10px] sm:text-[11px] font-normal text-zinc-300/75 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] leading-tight">
                Anything you've seen here are not finished and may change in future builds
              </p>
            </motion.div>
          )}

          {/* Morphing Floating Search Pill */}
          <motion.div
            layoutId="vplay-floating-search-pill"
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 28,
            }}
            style={{ fontFamily: "'Inter', 'Integer', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
            className={`pointer-events-auto relative w-full max-w-[320px] sm:max-w-[380px] h-[46px] sm:h-[48px] rounded-full flex items-center px-4 transition-all duration-300 backdrop-blur-2xl shadow-2xl shadow-black/35 overflow-hidden ${
              isFocused
                ? 'bg-white/35 dark:bg-white/25 shadow-black/40'
                : 'bg-white/30 dark:bg-white/20'
            }`}
          >
            {/* Top & Bottom white border with horizontal fade to left & right */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none rounded-full"
              viewBox="0 0 380 48"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <linearGradient id="search-bar-rim-grad" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="18%" stopColor="#ffffff" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="82%" stopColor="#ffffff" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <rect
                x="0.8"
                y="0.8"
                width="378.4"
                height="46.4"
                rx="23.2"
                stroke="url(#search-bar-rim-grad)"
                strokeWidth="1.4"
              />
            </svg>

            {/* Monochrome White Search Icon */}
            <div className="relative z-10 shrink-0 mr-3 w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] flex items-center justify-center pointer-events-none">
              <Search className="w-5 h-5 text-white stroke-[2.4] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
            </div>

            {/* Input Field - Monochrome White typography */}
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
                    setIsSearchExpanded(false);
                  }
                  inputRef.current?.blur();
                }
              }}
              placeholder={isListening ? 'Listening...' : placeholder}
              style={{ fontFamily: "'Inter', 'Integer', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
              className="relative z-10 w-full bg-transparent text-white placeholder:text-white/60 text-sm sm:text-[15px] font-semibold tracking-tight focus:outline-none truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
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
                  className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
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
                    ? 'text-[#FF267A] animate-pulse bg-[#FF267A]/20 scale-110'
                    : 'text-white hover:bg-white/15'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5 stroke-[2.2] text-red-500" />
                ) : (
                  <Mic className="w-4.5 h-4.5 stroke-[2.2] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
                )}
              </button>

              {/* Close/Collapse to Status Bar Button */}
              <button
                type="button"
                onClick={() => setIsSearchExpanded(false)}
                title="Thu gọn vào thanh trạng thái"
                className="w-6 h-6 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5 stroke-[2.2]" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FloatingTabSearchBar;
