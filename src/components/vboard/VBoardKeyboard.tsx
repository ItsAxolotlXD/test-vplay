import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smile, 
  LayoutGrid, 
  Globe, 
  Search, 
  Delete, 
  Mic, 
  MicOff, 
  X, 
  ArrowUp, 
  Volume2, 
  VolumeX,
  Keyboard as KeyboardIcon
} from 'lucide-react';
import { playKeyboardClickSound, playPopSound, playWinSound } from '../../utils/sound';
import { 
  insertTextIntoElement, 
  deleteCharacterFromElement, 
  triggerSearchOrSubmit 
} from './vboardUtils';

// Custom Monochrome White Copilot Icon
export const CopilotMonochromeIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5 text-white',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Left ribbon loop */}
    <path
      d="M7 13.5C7 10 9.8 7 13.3 7H17.5C19.4 7 21 8.6 21 10.5V12C21 15.6 18.2 18.5 14.7 18.5H10.5C8.6 18.5 7 16.9 7 15V13.5Z"
      fill="currentColor"
      fillOpacity="0.95"
    />
    {/* Right ribbon loop */}
    <path
      d="M17 10.5C17 14 14.2 17 10.7 17H6.5C4.6 17 3 15.4 3 13.5V12C3 8.4 5.8 5.5 9.3 5.5H13.5C15.4 5.5 17 7.1 17 9V10.5Z"
      fill="currentColor"
      fillOpacity="0.55"
    />
    {/* Central AI node/sparkle */}
    <circle cx="12" cy="12" r="1.3" fill="currentColor" fillOpacity="0.95" />
  </svg>
);

interface VBoardKeyboardProps {
  targetInput: HTMLInputElement | HTMLTextAreaElement | null;
  isOpen: boolean;
  onClose: () => void;
  onSwitchToDeviceKeyboard: () => void;
  navigate?: (path: string) => void;
}

type KeyboardMode = 'alpha' | 'numeric' | 'symbol';

const POPULAR_EMOJIS = [
  '🔥', '⭐', '✨', '❤️', '👍', '🍿', '🎮', '🎬', 
  '📺', '⚽', '🚀', '💬', '🎵', '📱', '🎉', '💯',
  '🇻🇳', '👏', '😍', '👀', '💡', '🏆', '🍕', '☕'
];

export const VBoardKeyboard: React.FC<VBoardKeyboardProps> = ({
  targetInput,
  isOpen,
  onClose,
  onSwitchToDeviceKeyboard,
  navigate,
}) => {
  const [mode, setMode] = useState<KeyboardMode>('alpha');
  const [isShift, setIsShift] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);
  const [isVietnamese, setIsVietnamese] = useState(true); // Tiếng Việt Telex default ON
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCopilotBar, setShowCopilotBar] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [lastShiftClickTime, setLastShiftClickTime] = useState(0);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const backspaceIntervalRef = useRef<number | null>(null);
  const backspaceTimeoutRef = useRef<number | null>(null);

  // Reset shift & mode when keyboard opens
  useEffect(() => {
    if (isOpen) {
      setMode('alpha');
      setIsShift(false);
      setIsCapsLock(false);
      setShowEmojiPicker(false);
      setShowCopilotBar(false);
      setPressedKey(null);
    }
  }, [isOpen]);

  // Clean up backspace repeat on unmount
  useEffect(() => {
    return () => {
      if (backspaceTimeoutRef.current) clearTimeout(backspaceTimeoutRef.current);
      if (backspaceIntervalRef.current) clearInterval(backspaceIntervalRef.current);
    };
  }, []);

  const playClick = (isDelete = false) => {
    if (soundEnabled) {
      playKeyboardClickSound(isDelete);
    }
    // Subtle mobile haptic feedback if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(8);
      } catch {}
    }
  };

  const handleKeyPress = (char: string) => {
    if (!targetInput) return;
    playClick(false);

    // Apply Vietnamese Telex typing engine when enabled
    insertTextIntoElement(targetInput, char, isVietnamese);

    // Auto-disable single-tap shift after typing a character
    if (isShift && !isCapsLock) {
      setIsShift(false);
    }
  };

  // Synchronize with desktop web physical keyboard so physical typing also animates virtual keys
  useEffect(() => {
    if (!isOpen) return;

    const handleWindowKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key;

      if (key === 'Backspace') {
        setPressedKey('backspace');
      } else if (key === 'Enter') {
        setPressedKey('enter');
      } else if (key === 'Shift') {
        setPressedKey('shift');
        setIsShift(true);
      } else if (key === ' ') {
        setPressedKey('space');
      } else if (key.length === 1) {
        setPressedKey(key.toLowerCase());
      }
    };

    const handleWindowKeyUp = (e: KeyboardEvent) => {
      const key = e.key;
      if (key === 'Shift' && !isCapsLock) {
        setIsShift(false);
      }
      setPressedKey(null);
    };

    window.addEventListener('keydown', handleWindowKeyDown);
    window.addEventListener('keyup', handleWindowKeyUp);

    return () => {
      window.removeEventListener('keydown', handleWindowKeyDown);
      window.removeEventListener('keyup', handleWindowKeyUp);
    };
  }, [isOpen, isCapsLock]);

  const handleShiftToggle = () => {
    playClick(false);
    const now = Date.now();
    if (now - lastShiftClickTime < 300) {
      // Double tap: Caps Lock toggle
      setIsCapsLock(!isCapsLock);
      setIsShift(!isCapsLock);
    } else {
      if (isCapsLock) {
        setIsCapsLock(false);
        setIsShift(false);
      } else {
        setIsShift(!isShift);
      }
    }
    setLastShiftClickTime(now);
  };

  const handleBackspaceStart = () => {
    if (!targetInput) return;
    playClick(true);
    deleteCharacterFromElement(targetInput);

    // Long press rapid delete
    backspaceTimeoutRef.current = window.setTimeout(() => {
      backspaceIntervalRef.current = window.setInterval(() => {
        if (!targetInput) return;
        playClick(true);
        deleteCharacterFromElement(targetInput);
      }, 70);
    }, 400);
  };

  const handleBackspaceEnd = () => {
    if (backspaceTimeoutRef.current) {
      clearTimeout(backspaceTimeoutRef.current);
      backspaceTimeoutRef.current = null;
    }
    if (backspaceIntervalRef.current) {
      clearInterval(backspaceIntervalRef.current);
      backspaceIntervalRef.current = null;
    }
  };

  const handleSearchSubmit = () => {
    if (!targetInput) {
      onClose();
      return;
    }
    playWinSound();
    triggerSearchOrSubmit(targetInput);
    onClose();
  };

  // Voice speech-to-text dictation
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      playPopSound();
      alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói Web Speech API.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        playPopSound();
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && targetInput) {
          insertTextIntoElement(targetInput, (targetInput.value ? ' ' : '') + transcript, false);
          playWinSound();
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  if (!isOpen) return null;

  // KEY COMPONENT WITH AUTHENTIC POPUP PREVIEW AND ANIMATION
  const renderKey = (
    keyId: string,
    displayChar: string,
    actualChar: string,
    extraClasses: string = ''
  ) => {
    const isKeyActive =
      pressedKey === keyId.toLowerCase() ||
      pressedKey === actualChar.toLowerCase();

    return (
      <div key={keyId} className={`flex-1 relative ${extraClasses}`}>
        {/* iOS keycap preview balloon when pressed */}
        <AnimatePresence>
          {isKeyActive && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.6 }}
              animate={{ opacity: 1, y: -42, scale: 1.1 }}
              exit={{ opacity: 0, y: 4, scale: 0.8 }}
              transition={{ type: 'spring', damping: 22, stiffness: 500 }}
              className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center"
            >
              <div className="w-11 h-13 min-w-[44px] px-2 bg-[#2D2D32] border border-cyan-400/40 text-white rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.85),0_0_12px_rgba(34,211,238,0.3)] flex items-center justify-center font-bold text-2xl tracking-normal">
                {displayChar}
              </div>
              <div className="w-2.5 h-2.5 bg-[#2D2D32] border-r border-b border-cyan-400/40 rotate-45 -mt-1.5 shadow-sm" />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            setPressedKey(keyId.toLowerCase());
            handleKeyPress(actualChar);
          }}
          onPointerUp={() => setPressedKey(null)}
          onPointerLeave={() => setPressedKey(null)}
          onPointerCancel={() => setPressedKey(null)}
          className={`w-full h-11 sm:h-12 text-white text-[19px] sm:text-[21px] font-normal rounded-[7px] shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 flex items-center justify-center select-none cursor-pointer transition-all duration-75 relative overflow-hidden ${
            isKeyActive
              ? 'bg-[#7D7D83] scale-90 shadow-[inset_0_2px_6px_rgba(0,0,0,0.5),0_0_12px_rgba(255,255,255,0.4)] ring-1 ring-white/60 brightness-125'
              : 'bg-[#525257]/80 hover:bg-[#66666B] active:bg-[#7D7D83] active:scale-90'
          }`}
        >
          {displayChar}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-[7px]" />
        </button>
      </div>
    );
  };

  // KEYBOARD LAYOUT DEFINITIONS
  const renderRow1 = () => {
    if (mode === 'alpha') {
      const letters = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
      return letters.map((l) => {
        const char = (isShift || isCapsLock) ? l.toUpperCase() : l;
        return renderKey(l, char, char);
      });
    } else if (mode === 'numeric') {
      const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
      return numbers.map((n) => renderKey(n, n, n));
    } else {
      // Symbols layer
      const symbols = ['[', ']', '{', '}', '#', '%', '^', '*', '+', '='];
      return symbols.map((s) => renderKey(s, s, s));
    }
  };

  const renderRow2 = () => {
    if (mode === 'alpha') {
      const letters = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
      return letters.map((l) => {
        const char = (isShift || isCapsLock) ? l.toUpperCase() : l;
        return renderKey(l, char, char);
      });
    } else if (mode === 'numeric') {
      const punctuation = ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'];
      return punctuation.map((p) => renderKey(p, p, p));
    } else {
      const syms = ['_', '\\', '|', '~', '<', '>', '€', '£', '¥', '•'];
      return syms.map((s) => renderKey(s, s, s));
    }
  };

  const renderRow3 = () => {
    let middleKeys: React.ReactNode = null;

    if (mode === 'alpha') {
      const letters = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
      middleKeys = letters.map((l) => {
        const char = (isShift || isCapsLock) ? l.toUpperCase() : l;
        return renderKey(l, char, char);
      });
    } else {
      const extraPunctuation = ['.', ',', '?', '!', "'"];
      middleKeys = extraPunctuation.map((p) => renderKey(p, p, p));
    }

    const isShiftActive = (isShift || isCapsLock) || pressedKey === 'shift';
    const isBackspaceActive = pressedKey === 'backspace';

    return (
      <div className="flex items-center gap-1.5 w-full">
        {/* Left Function Key: Shift / #+= / 123 */}
        {mode === 'alpha' ? (
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              handleShiftToggle();
            }}
            className={`w-[46px] sm:w-[52px] h-11 sm:h-12 rounded-[7px] flex items-center justify-center shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 transition-all select-none active:scale-90 cursor-pointer ${
              isShiftActive
                ? 'bg-white text-black font-bold scale-95 shadow-[0_0_12px_rgba(255,255,255,0.7)]'
                : 'bg-[#3C3C41]/90 hover:bg-[#48484E] text-white'
            }`}
            title="Shift (Nhấn đúp để giữ Caps Lock)"
          >
            <ArrowUp className={`w-5 h-5 stroke-[2.4] ${isCapsLock ? 'stroke-[3.2]' : ''}`} />
          </button>
        ) : (
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              playClick(false);
              setMode(mode === 'numeric' ? 'symbol' : 'numeric');
            }}
            className="w-[46px] sm:w-[52px] h-11 sm:h-12 bg-[#3C3C41]/90 hover:bg-[#48484E] text-white text-[13.5px] font-bold rounded-[7px] shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 flex items-center justify-center select-none active:scale-90 transition-transform cursor-pointer"
          >
            {mode === 'numeric' ? '#+=' : '123'}
          </button>
        )}

        {/* Middle character keys */}
        {middleKeys}

        {/* Right Function Key: Backspace */}
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            setPressedKey('backspace');
            handleBackspaceStart();
          }}
          onPointerUp={() => {
            setPressedKey(null);
            handleBackspaceEnd();
          }}
          onPointerLeave={() => {
            setPressedKey(null);
            handleBackspaceEnd();
          }}
          onContextMenu={(e) => e.preventDefault()}
          className={`w-[46px] sm:w-[52px] h-11 sm:h-12 rounded-[7px] shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 flex items-center justify-center select-none transition-all duration-75 cursor-pointer ${
            isBackspaceActive
              ? 'bg-[#505057] scale-90 ring-1 ring-white/50 text-amber-300'
              : 'bg-[#3C3C41]/90 hover:bg-[#48484E] active:bg-[#505057] active:scale-90 text-white'
          }`}
          title="Xóa ký tự (Nhấn giữ để xóa liên tục)"
        >
          <Delete className="w-5 h-5 stroke-[1.8]" />
        </button>
      </div>
    );
  };

  const isSpaceActive = pressedKey === 'space';
  const isSearchActive = pressedKey === 'enter';
  const isCopilotActive = pressedKey === 'copilot';

  return (
    <AnimatePresence>
      <motion.div
        id="vboard-keyboard-container"
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        style={{
          WebkitBackdropFilter: 'blur(36px)',
          backdropFilter: 'blur(36px)',
        }}
        className={`fixed z-[100000] text-white select-none transition-all duration-300 ${
          isCompact
            ? 'bottom-4 left-1/2 -translate-x-1/2 w-[92vw] max-w-lg rounded-3xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.85)] bg-[#161618]/95 backdrop-blur-2xl'
            : 'bottom-0 left-0 right-0 w-full md:bottom-5 md:left-1/2 md:-translate-x-1/2 md:w-[740px] lg:w-[800px] md:max-w-[calc(100vw-32px)] md:rounded-3xl md:border md:border-white/15 md:shadow-[0_25px_70px_rgba(0,0,0,0.85)] bg-[#161618]/95 backdrop-blur-2xl'
        }`}
      >
        {/* Quick Emoji Picker Drawer */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-white/10 bg-[#1A1A1E]"
            >
              <div className="p-2.5 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {POPULAR_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      handleKeyPress(emoji);
                    }}
                    className="w-10 h-10 shrink-0 text-xl flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 active:scale-90 transition-all cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Copilot AI Assistant Suggestions Drawer */}
        <AnimatePresence>
          {showCopilotBar && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-white/10 bg-[#1A1A1E]/95 backdrop-blur-xl"
            >
              <div className="p-2.5 px-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs font-semibold shrink-0">
                    <CopilotMonochromeIcon className="w-4 h-4 text-white" />
                    <span>Copilot</span>
                  </div>

                  <button
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      if (targetInput) {
                        insertTextIntoElement(targetInput, 'Hỏi Copilot: ', isVietnamese);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white text-xs font-medium border border-white/5 shrink-0 transition-colors cursor-pointer"
                  >
                    ✨ Hỏi Copilot
                  </button>

                  <button
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      if (targetInput) {
                        insertTextIntoElement(targetInput, 'Gợi ý phim hot hôm nay ', isVietnamese);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white text-xs font-medium border border-white/5 shrink-0 transition-colors cursor-pointer"
                  >
                    🎬 Gợi ý phim hot
                  </button>

                  <button
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      if (targetInput) {
                        insertTextIntoElement(targetInput, 'Lịch phát sóng VTV ', isVietnamese);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white text-xs font-medium border border-white/5 shrink-0 transition-colors cursor-pointer"
                  >
                    📺 Lịch phát sóng VTV
                  </button>
                </div>

                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    setShowCopilotBar(false);
                    onClose();
                    if (navigate) {
                      navigate('/copilot');
                    } else {
                      window.dispatchEvent(new CustomEvent('vplay:navigate', { detail: '/copilot' }));
                    }
                  }}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-red-600/30 to-[#C83DFF]/30 hover:from-red-600/50 hover:to-[#C83DFF]/50 border border-white/15 text-white text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Mở Copilot</span>
                  <span>→</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. TOP HEADER TOOLBAR (Exact layout from IMG_9437.jpeg)
            - Smiley icon (Smile)
            - Divider
            - LayoutGrid / Split icon
            - Divider
            - Globe icon -> Switches to device keyboard
        */}
        <div className="h-10 px-4 border-b border-white/10 flex items-center justify-between text-white/80">
          <div className="flex items-center h-full w-full max-w-sm mx-auto justify-around">
            {/* Left: Smiley face */}
            <button
              type="button"
              onClick={() => {
                playClick(false);
                setShowEmojiPicker(!showEmojiPicker);
              }}
              className={`p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors cursor-pointer ${
                showEmojiPicker ? 'text-[#FF267A] bg-white/10' : 'text-white/80'
              }`}
              title="Biểu tượng cảm xúc (Emojis)"
            >
              <Smile className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Subtle Divider */}
            <div className="w-[1px] h-4 bg-white/15" />

            {/* Center: Window / LayoutGrid icon */}
            <button
              type="button"
              onClick={() => {
                playClick(false);
                setIsCompact(!isCompact);
              }}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isCompact ? 'Mở rộng bàn phím đầy đủ' : 'Thu gọn bàn phím'}
            >
              <LayoutGrid className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Subtle Divider */}
            <div className="w-[1px] h-4 bg-white/15" />

            {/* Right: Globe icon -> Switches directly to device keyboard */}
            <button
              type="button"
              onClick={() => {
                playClick(false);
                onSwitchToDeviceKeyboard();
              }}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1"
              title="Chuyển sang bàn phím thiết bị (Device keyboard)"
            >
              <Globe className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>

          {/* Aux controls: Telex switch, Sound toggle, Dismiss */}
          <div className="flex items-center gap-2 absolute right-3 top-1.5">
            {/* Telex mode badge toggle */}
            <button
              type="button"
              onClick={() => {
                playClick(false);
                setIsVietnamese(!isVietnamese);
              }}
              className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all cursor-pointer border ${
                isVietnamese 
                  ? 'bg-blue-600/30 text-blue-400 border-blue-500/40 hover:bg-blue-600/40' 
                  : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10'
              }`}
              title="Bật/Tắt gõ tiếng Việt Telex"
            >
              {isVietnamese ? 'VIE' : 'ENG'}
            </button>

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title={soundEnabled ? 'Tắt âm bàn phím' : 'Bật âm bàn phím'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => {
                playPopSound();
                onClose();
              }}
              className="p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Đóng bàn phím V-board"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. MAIN KEYBOARD KEYS MATRIX */}
        <div className="p-2 sm:p-3 max-w-2xl mx-auto space-y-2">
          {/* Row 1 */}
          <div className="flex items-center gap-1.5 w-full">
            {renderRow1()}
          </div>

          {/* Row 2 (Indented slightly on sides like iOS) */}
          <div className="flex items-center gap-1.5 w-full px-[4.5%]">
            {renderRow2()}
          </div>

          {/* Row 3 (Shift + Letters/Symbols + Backspace) */}
          {renderRow3()}

          {/* Row 4 (123 + Copilot Key + Wide Blank Space + Blue Search Button) */}
          <div className="flex items-center gap-1.5 w-full">
            {/* 123 / ABC Switcher Key */}
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                playClick(false);
                setMode(mode === 'alpha' ? 'numeric' : 'alpha');
              }}
              className="w-[52px] sm:w-[60px] h-11 sm:h-12 bg-[#3C3C41]/90 hover:bg-[#48484E] active:bg-[#505057] text-white text-[15px] font-medium rounded-[7px] shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 flex items-center justify-center select-none active:scale-90 transition-all cursor-pointer shrink-0"
            >
              {mode === 'alpha' ? '123' : 'ABC'}
            </button>

            {/* Copilot Key (Icon custom, monochrome trắng) cạnh key 123 */}
            <div className="relative shrink-0">
              {/* iOS keycap preview balloon when pressed */}
              <AnimatePresence>
                {isCopilotActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.6 }}
                    animate={{ opacity: 1, y: -42, scale: 1.1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.8 }}
                    transition={{ type: 'spring', damping: 22, stiffness: 500 }}
                    className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center"
                  >
                    <div className="w-12 h-12 px-2 bg-[#2D2D32] border border-white/20 text-white rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.85),0_0_12px_rgba(255,255,255,0.3)] flex items-center justify-center">
                      <CopilotMonochromeIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-2.5 h-2.5 bg-[#2D2D32] border-r border-b border-white/20 rotate-45 -mt-1.5 shadow-sm" />
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  setPressedKey('copilot');
                  playClick(false);
                  setShowCopilotBar((prev) => !prev);
                }}
                onPointerUp={() => setPressedKey(null)}
                onPointerLeave={() => setPressedKey(null)}
                className={`w-[48px] sm:w-[54px] h-11 sm:h-12 rounded-[7px] shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 flex items-center justify-center select-none transition-all duration-75 cursor-pointer shrink-0 ${
                  isCopilotActive || showCopilotBar
                    ? 'bg-[#7D7D83] scale-90 ring-1 ring-white/60 shadow-[inset_0_2px_6px_rgba(0,0,0,0.5),0_0_12px_rgba(255,255,255,0.4)]'
                    : 'bg-[#3C3C41]/90 hover:bg-[#48484E] active:bg-[#505057] active:scale-90 text-white'
                }`}
                title="Copilot AI Key"
              >
                <CopilotMonochromeIcon className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Blank Wide Space Bar with authentic iOS Vietnamese label */}
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                setPressedKey('space');
                handleKeyPress(' ');
              }}
              onPointerUp={() => setPressedKey(null)}
              onPointerLeave={() => setPressedKey(null)}
              className={`flex-1 h-11 sm:h-12 rounded-[7px] shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 flex items-center justify-center select-none transition-all duration-75 relative group cursor-pointer ${
                isSpaceActive
                  ? 'bg-[#7D7D83] scale-[0.96] ring-1 ring-white/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_0_12px_rgba(255,255,255,0.3)]'
                  : 'bg-[#525257]/80 hover:bg-[#66666B] active:bg-[#7D7D83] active:scale-[0.96]'
              }`}
              title="Phím cách (Space)"
            >
              <span className={`text-[13px] tracking-wide font-normal transition-colors ${
                isSpaceActive ? 'text-white font-medium' : 'text-white/50 group-hover:text-white/80'
              }`}>
                {isVietnamese ? 'tiếng việt' : 'space'}
              </span>
            </button>

            {/* Bright iOS Blue Search Button */}
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                setPressedKey('enter');
                handleSearchSubmit();
              }}
              onPointerUp={() => setPressedKey(null)}
              onPointerLeave={() => setPressedKey(null)}
              className={`w-[64px] sm:w-[72px] h-11 sm:h-12 rounded-[7px] flex items-center justify-center select-none transition-all duration-75 cursor-pointer shrink-0 ${
                isSearchActive
                  ? 'bg-[#0051A8] scale-90 shadow-[0_0_20px_rgba(0,122,255,0.8)] ring-2 ring-white/70'
                  : 'bg-[#007AFF] hover:bg-[#0A84FF] active:bg-[#0062CC] active:scale-90 shadow-[0_1.5px_0_rgba(0,122,255,0.4)] text-white'
              }`}
              title="Tìm kiếm / Thực thi (Search)"
            >
              <Search className="w-5 h-5 text-white stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* 3. BOTTOM FOOTER (Exact layout from IMG_9437.jpeg)
            - Globe icon on left -> Switches directly to device keyboard
            - Rounded home bar in center (swipe/click to dismiss)
            - Microphone on right (voice dictation)
        */}
        <div className="pb-3 pt-1 px-6 flex items-center justify-between max-w-2xl mx-auto">
          {/* Bottom Globe Icon -> Chuyển sang bàn phím thiết bị */}
          <button
            type="button"
            onClick={() => {
              playClick(false);
              onSwitchToDeviceKeyboard();
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            title="Chuyển sang bàn phím thiết bị (Device keyboard)"
          >
            <Globe className="w-6 h-6 stroke-[1.5]" />
          </button>

          {/* Center iOS Home Indicator Bar */}
          <div
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="group py-2 px-6 cursor-pointer flex flex-col items-center gap-1"
            title="Nhấp để đóng bàn phím V-board"
          >
            <div className="w-36 sm:w-40 h-1 sm:h-1.5 bg-white/40 group-hover:bg-white/80 rounded-full transition-colors" />
          </div>

          {/* Bottom Microphone Icon (Voice Search Dictation) */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            title="Tìm kiếm bằng giọng nói"
          >
            {isListening ? (
              <MicOff className="w-6 h-6 stroke-[1.8]" />
            ) : (
              <Mic className="w-6 h-6 stroke-[1.5]" />
            )}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VBoardKeyboard;
