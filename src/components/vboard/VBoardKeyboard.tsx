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

interface VBoardKeyboardProps {
  targetInput: HTMLInputElement | HTMLTextAreaElement | null;
  isOpen: boolean;
  onClose: () => void;
  onSwitchToDeviceKeyboard: () => void;
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
}) => {
  const [mode, setMode] = useState<KeyboardMode>('alpha');
  const [isShift, setIsShift] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);
  const [isVietnamese, setIsVietnamese] = useState(true); // Tiếng Việt Telex default ON
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [lastShiftClickTime, setLastShiftClickTime] = useState(0);

  const backspaceIntervalRef = useRef<number | null>(null);
  const backspaceTimeoutRef = useRef<number | null>(null);

  // Reset shift & mode when keyboard opens
  useEffect(() => {
    if (isOpen) {
      setMode('alpha');
      setIsShift(false);
      setIsCapsLock(false);
      setShowEmojiPicker(false);
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

  // KEYBOARD LAYOUT DEFINITIONS
  const renderRow1 = () => {
    if (mode === 'alpha') {
      const letters = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
      return letters.map((l) => {
        const char = (isShift || isCapsLock) ? l.toUpperCase() : l;
        return (
          <button
            key={l}
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              handleKeyPress(char);
            }}
            className="flex-1 h-11 sm:h-12 bg-[#525257]/80 hover:bg-[#66666B] active:bg-[#7D7D83] text-white text-[19px] sm:text-[21px] font-normal rounded-[7px] shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 flex items-center justify-center select-none active:scale-95 transition-transform"
          >
            {char}
          </button>
        );
      });
    } else if (mode === 'numeric') {
      const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
      return numbers.map((n) => (
        <button
          key={n}
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            handleKeyPress(n);
          }}
          className="flex-1 h-11 sm:h-12 bg-[#525257]/80 hover:bg-[#66666B] active:bg-[#7D7D83] text-white text-[19px] sm:text-[21px] font-normal rounded-[7px] shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 flex items-center justify-center select-none active:scale-95 transition-transform"
        >
          {n}
        </button>
      ));
    } else {
      // Symbols layer
      const symbols = ['[', ']', '{', '}', '#', '%', '^', '*', '+', '='];
      return symbols.map((s) => (
        <button
          key={s}
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            handleKeyPress(s);
          }}
          className="flex-1 h-11 sm:h-12 bg-[#525257]/80 hover:bg-[#66666B] active:bg-[#7D7D83] text-white text-[19px] sm:text-[21px] font-normal rounded-[7px] shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 flex items-center justify-center select-none active:scale-95 transition-transform"
        >
          {s}
        </button>
      ));
    }
  };

  const renderRow2 = () => {
    if (mode === 'alpha') {
      const letters = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
      return letters.map((l) => {
        const char = (isShift || isCapsLock) ? l.toUpperCase() : l;
        return (
          <button
            key={l}
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              handleKeyPress(char);
            }}
            className="flex-1 h-11 sm:h-12 bg-[#525257]/80 hover:bg-[#66666B] active:bg-[#7D7D83] text-white text-[19px] sm:text-[21px] font-normal rounded-[7px] shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 flex items-center justify-center select-none active:scale-95 transition-transform"
          >
            {char}
          </button>
        );
      });
    } else if (mode === 'numeric') {
      const punctuation = ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'];
      return punctuation.map((p) => (
        <button
          key={p}
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            handleKeyPress(p);
          }}
          className="flex-1 h-11 sm:h-12 bg-[#525257]/80 hover:bg-[#66666B] active:bg-[#7D7D83] text-white text-[19px] sm:text-[21px] font-normal rounded-[7px] shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 flex items-center justify-center select-none active:scale-95 transition-transform"
        >
          {p}
        </button>
      ));
    } else {
      const syms = ['_', '\\', '|', '~', '<', '>', '€', '£', '¥', '•'];
      return syms.map((s) => (
        <button
          key={s}
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            handleKeyPress(s);
          }}
          className="flex-1 h-11 sm:h-12 bg-[#525257]/80 hover:bg-[#66666B] active:bg-[#7D7D83] text-white text-[19px] sm:text-[21px] font-normal rounded-[7px] shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 flex items-center justify-center select-none active:scale-95 transition-transform"
        >
          {s}
        </button>
      ));
    }
  };

  const renderRow3 = () => {
    let middleKeys: React.ReactNode = null;

    if (mode === 'alpha') {
      const letters = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
      middleKeys = letters.map((l) => {
        const char = (isShift || isCapsLock) ? l.toUpperCase() : l;
        return (
          <button
            key={l}
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              handleKeyPress(char);
            }}
            className="flex-1 h-11 sm:h-12 bg-[#525257]/80 hover:bg-[#66666B] active:bg-[#7D7D83] text-white text-[19px] sm:text-[21px] font-normal rounded-[7px] shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 flex items-center justify-center select-none active:scale-95 transition-transform"
          >
            {char}
          </button>
        );
      });
    } else {
      const extraPunctuation = ['.', ',', '?', '!', "'"];
      middleKeys = extraPunctuation.map((p) => (
        <button
          key={p}
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            handleKeyPress(p);
          }}
          className="flex-1 h-11 sm:h-12 bg-[#525257]/80 hover:bg-[#66666B] active:bg-[#7D7D83] text-white text-[19px] sm:text-[21px] font-normal rounded-[7px] shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 flex items-center justify-center select-none active:scale-95 transition-transform"
        >
          {p}
        </button>
      ));
    }

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
            className={`w-[46px] sm:w-[52px] h-11 sm:h-12 rounded-[7px] flex items-center justify-center shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 transition-colors select-none active:scale-95 ${
              isShift || isCapsLock
                ? 'bg-white text-black font-bold'
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
            className="w-[46px] sm:w-[52px] h-11 sm:h-12 bg-[#3C3C41]/90 hover:bg-[#48484E] text-white text-[13.5px] font-bold rounded-[7px] shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 flex items-center justify-center select-none active:scale-95"
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
            handleBackspaceStart();
          }}
          onPointerUp={handleBackspaceEnd}
          onPointerLeave={handleBackspaceEnd}
          onContextMenu={(e) => e.preventDefault()}
          className="w-[46px] sm:w-[52px] h-11 sm:h-12 bg-[#3C3C41]/90 hover:bg-[#48484E] active:bg-[#505057] text-white rounded-[7px] shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 flex items-center justify-center select-none active:scale-95 transition-transform"
          title="Xóa ký tự (Nhấn giữ để xóa liên tục)"
        >
          <Delete className="w-5 h-5 stroke-[1.8]" />
        </button>
      </div>
    );
  };

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
        className={`fixed z-[100000] bottom-0 left-0 right-0 bg-[#161618]/94 border-t border-white/10 shadow-[0_-12px_45px_rgba(0,0,0,0.7)] text-white select-none ${
          isCompact ? 'max-w-xl mx-auto rounded-t-3xl' : 'w-full'
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

          {/* Row 4 (123 + Wide Blank Space with Vietnamese label + Blue Search Button) */}
          <div className="flex items-center gap-1.5 w-full">
            {/* 123 / ABC Switcher Key */}
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                playClick(false);
                setMode(mode === 'alpha' ? 'numeric' : 'alpha');
              }}
              className="w-[68px] sm:w-[76px] h-11 sm:h-12 bg-[#3C3C41]/90 hover:bg-[#48484E] active:bg-[#505057] text-white text-[15px] font-medium rounded-[7px] shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 flex items-center justify-center select-none active:scale-95 transition-transform shrink-0"
            >
              {mode === 'alpha' ? '123' : 'ABC'}
            </button>

            {/* Blank Wide Space Bar with authentic iOS Vietnamese label */}
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                handleKeyPress(' ');
              }}
              className="flex-1 h-11 sm:h-12 bg-[#525257]/80 hover:bg-[#66666B] active:bg-[#7D7D83] text-white rounded-[7px] shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 flex items-center justify-center select-none active:scale-95 transition-transform relative group"
              title="Phím cách (Space)"
            >
              <span className="text-[13px] text-white/50 group-hover:text-white/80 transition-colors tracking-wide font-normal">
                {isVietnamese ? 'tiếng việt' : 'space'}
              </span>
            </button>

            {/* Bright iOS Blue Search Button */}
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                handleSearchSubmit();
              }}
              className="w-[68px] sm:w-[76px] h-11 sm:h-12 bg-[#007AFF] hover:bg-[#0A84FF] active:bg-[#0062CC] text-white rounded-[7px] shadow-[0_1.5px_0_rgba(0,122,255,0.4)] flex items-center justify-center select-none active:scale-95 transition-transform shrink-0"
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
