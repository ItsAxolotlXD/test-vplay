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
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-[300px] sm:max-w-[360px] pointer-events-none select-none"
    >
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        className={`pointer-events-auto relative w-full h-[46px] sm:h-[48px] rounded-full flex items-center px-4 transition-all duration-300 backdrop-blur-2xl shadow-xl shadow-black/20 ${
          isFocused
            ? 'bg-white/30 border border-white/60 shadow-black/30 ring-1 ring-black/10'
            : 'bg-white/30 border border-white/40 shadow-black/20'
        }`}
      >
        {/* Enlarged Search Icon from SF Symbols */}
        <div className="relative z-10 shrink-0 mr-3 w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] min-w-[22px] min-h-[22px] flex items-center justify-center">
          <img
            src="https://github.com/andrewtavis/sf-symbols-online/blob/master/glyphs/magnifyingglass.png?raw=true"
            alt="Search"
            referrerPolicy="no-referrer"
            className="w-full h-full aspect-square object-contain opacity-85 transition-opacity"
            onError={(e) => {
              // Fallback to vector search if image fails
              const target = e.target as HTMLElement;
              target.style.display = 'none';
              if (target.parentElement) {
                target.parentElement.innerHTML = '<svg class="w-5 h-5 text-black stroke-[2.4]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.3-4.3"/></svg>';
              }
            }}
          />
        </div>

        {/* Input Field - Black text, bold & clean */}
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
          placeholder={isListening ? 'Listening...' : placeholder}
          className="relative z-10 w-full bg-transparent text-black placeholder:text-black/60 text-sm sm:text-[15px] font-semibold tracking-tight focus:outline-none truncate"
        />

        {/* Actions on right: Clear Button & Enlarged SF Symbols Mic */}
        <div className="relative z-10 flex items-center gap-2 shrink-0 ml-2">
          {searchQuery && (
            <button
              onClick={() => {
                clearSearch();
                inputRef.current?.focus();
              }}
              title="Xóa tìm kiếm"
              className="w-5 h-5 rounded-full bg-black/15 hover:bg-black/25 text-black flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}

          {/* Microphone Button with SF Symbols Mic glyph */}
          <button
            onClick={toggleListening}
            title={isListening ? 'Dừng lắng nghe' : 'Tìm kiếm bằng giọng nói'}
            className={`w-[26px] h-[26px] flex items-center justify-center rounded-full transition-all cursor-pointer ${
              isListening
                ? 'text-[#FF267A] animate-pulse bg-[#FF267A]/20 scale-110'
                : 'text-black hover:bg-black/10'
            }`}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 stroke-[2.2] text-red-600" />
            ) : (
              <div className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] flex items-center justify-center">
                <img
                  src="https://github.com/andrewtavis/sf-symbols-online/blob/master/glyphs/mic.png?raw=true"
                  alt="Voice Search"
                  referrerPolicy="no-referrer"
                  className="w-full h-full aspect-square object-contain opacity-85 hover:opacity-100 transition-opacity"
                  onError={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.innerHTML = '<svg class="w-5 h-5 text-black stroke-[2.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>';
                    }
                  }}
                />
              </div>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
