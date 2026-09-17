import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, MicOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTabSearch } from '../context/TabSearchContext';

interface FloatingTabSearchBarProps {
  isVisible?: boolean;
}

export const FloatingTabSearchBar: React.FC<FloatingTabSearchBarProps> = ({ isVisible = true }) => {
  const { searchQuery, setSearchQuery, clearSearch, placeholder } = useTabSearch();
  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

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

  if (!isVisible) return null;

  return (
    <div
      id="floating-tab-search-bar"
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md sm:max-w-lg pointer-events-none select-none"
    >
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        className={`pointer-events-auto relative w-full h-[46px] sm:h-[48px] rounded-full flex items-center px-4 transition-all duration-300 backdrop-blur-2xl shadow-2xl ${
          isFocused
            ? 'bg-black/15 border border-white/25 shadow-black/80 ring-1 ring-white/10'
            : 'bg-black/15 hover:bg-black/20 border border-white/15 shadow-black/60'
        }`}
      >
        {/* Subtle glass reflection effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

        {/* Search Icon like in Sidebar */}
        <div className="relative z-10 shrink-0 mr-3 w-[18px] h-[18px] min-w-[18px] min-h-[18px] max-w-[18px] max-h-[18px] flex items-center justify-center">
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest?cb=20260717131751"
            alt="Search"
            referrerPolicy="no-referrer"
            className="w-full h-full aspect-square object-contain brightness-0 invert opacity-80 transition-opacity"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
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
              clearSearch();
              inputRef.current?.blur();
            }
          }}
          placeholder={isListening ? 'Đang lắng nghe giọng nói...' : placeholder}
          className="relative z-10 w-full bg-transparent text-white placeholder-[#8E8E93] text-sm sm:text-[15px] font-normal tracking-tight focus:outline-none truncate"
        />

        {/* Actions on right: Clear Button & Mic */}
        <div className="relative z-10 flex items-center gap-2 shrink-0 ml-2">
          {searchQuery && (
            <button
              onClick={() => {
                clearSearch();
                inputRef.current?.focus();
              }}
              title="Xóa tìm kiếm"
              className="w-4.5 h-4.5 rounded-full bg-[#8E8E93]/35 hover:bg-[#8E8E93]/60 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-3 h-3 stroke-[2.5]" />
            </button>
          )}

          {/* Microphone Button (iOS dictation style) */}
          <button
            onClick={toggleListening}
            title={isListening ? 'Dừng lắng nghe' : 'Tìm kiếm bằng giọng nói'}
            className={`p-1 rounded-full transition-all cursor-pointer ${
              isListening
                ? 'text-[#FF267A] animate-pulse bg-[#FF267A]/15'
                : 'text-[#8E8E93] hover:text-white hover:bg-white/10'
            }`}
          >
            {isListening ? (
              <MicOff className="w-4.5 h-4.5 stroke-[2.2]" />
            ) : (
              <Mic className="w-4.5 h-4.5 stroke-[2.2]" />
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
