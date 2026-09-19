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
  Keyboard as KeyboardIcon,
  Palette,
  Check,
  CornerDownLeft,
  ArrowLeftRight,
  Languages,
  Sparkles
} from 'lucide-react';
import { playKeyboardClickSound, playPopSound, playWinSound } from '../../utils/sound';
import { 
  insertTextIntoElement, 
  deleteCharacterFromElement, 
  triggerSearchOrSubmit 
} from './vboardUtils';
import { useSettings, VBOARD_SKIN_OPTIONS, VBoardSkin } from '../../hooks/useSettings';

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
  const { settings, updateSetting } = useSettings();
  const currentSkin: VBoardSkin = settings.vboardSkin || 'default';

  const [mode, setMode] = useState<KeyboardMode>('alpha');
  const [isShift, setIsShift] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);
  const [isVietnamese, setIsVietnamese] = useState(true); // Tiếng Việt Telex default ON
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCopilotBar, setShowCopilotBar] = useState(false);
  const [showSkinPicker, setShowSkinPicker] = useState(false);
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
      setShowSkinPicker(false);
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
      playKeyboardClickSound(isDelete, currentSkin);
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

  // Web Speech API for voice search
  const toggleSpeechRecognition = () => {
    playClick(false);
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Trình duyệt không hỗ trợ nhận diện giọng nói Web Speech API.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = isVietnamese ? 'vi-VN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (targetInput && transcript) {
          targetInput.value = transcript;
          targetInput.dispatchEvent(new Event('input', { bubbles: true }));
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

  // KEY COMPONENT WITH AUTHENTIC POPUP PREVIEW AND SKIN-SPECIFIC STYLES
  const renderKey = (
    keyId: string,
    displayChar: string,
    actualChar: string,
    extraClasses: string = '',
    subText?: string
  ) => {
    const isKeyActive =
      pressedKey === keyId.toLowerCase() ||
      pressedKey === actualChar.toLowerCase();

    // Key button class based on current skin
    let buttonClasses = '';
    let balloonContent: React.ReactNode = null;

    if (currentSkin === 'ios') {
      // Skin 1: iOS (Hình 1) - White rounded keys with subtle bottom shadow and black text
      buttonClasses = isKeyActive
        ? 'bg-[#E5E5EA] scale-95 shadow-none ring-1 ring-black/10 text-black'
        : 'bg-[#FFFFFF] hover:bg-[#F6F6F6] text-black shadow-[0_1.5px_0_rgba(0,0,0,0.32)] active:bg-[#E5E5EA] active:scale-95';

      balloonContent = (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.6 }}
          animate={{ opacity: 1, y: -42, scale: 1.1 }}
          exit={{ opacity: 0, y: 4, scale: 0.8 }}
          transition={{ type: 'spring', damping: 22, stiffness: 500 }}
          className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center"
        >
          <div className="w-[clamp(42px,5.5vw,56px)] h-[clamp(48px,6.5vw,66px)] min-w-[42px] px-2 bg-white border border-black/10 text-black rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.25)] flex items-center justify-center font-normal text-[clamp(20px,2.6vw,30px)] tracking-normal">
            {displayChar}
          </div>
          <div className="w-2.5 h-2.5 bg-white border-r border-b border-black/10 rotate-45 -mt-1.5 shadow-sm" />
        </motion.div>
      );
    } else if (currentSkin === 'google') {
      // Skin 2: Google Gboard (Hình 2) - Soft rounded white keys with Material shadow and dark text
      buttonClasses = isKeyActive
        ? 'bg-[#E2E8F0] scale-95 shadow-none text-[#1F1F1F]'
        : 'bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#1F1F1F] shadow-[0_1px_2px_rgba(0,0,0,0.14)] active:bg-[#E2E8F0] active:scale-95';

      balloonContent = (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.6 }}
          animate={{ opacity: 1, y: -42, scale: 1.1 }}
          exit={{ opacity: 0, y: 4, scale: 0.8 }}
          transition={{ type: 'spring', damping: 22, stiffness: 500 }}
          className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center"
        >
          <div className="w-[clamp(42px,5.5vw,56px)] h-[clamp(48px,6.5vw,66px)] min-w-[42px] px-2 bg-white text-[#1F1F1F] rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.2)] border border-slate-200 flex items-center justify-center font-normal text-[clamp(20px,2.6vw,30px)] tracking-normal">
            {displayChar}
          </div>
          <div className="w-2.5 h-2.5 bg-white border-r border-b border-slate-200 rotate-45 -mt-1.5" />
        </motion.div>
      );
    } else if (currentSkin === 'butterfly') {
      // Skin 3: Butterfly keyboard (MacBook) - Ultra-thin chiclet black matte keys with fine backlight glow
      buttonClasses = isKeyActive
        ? 'bg-[#0A0A0D] translate-y-[1px] shadow-none ring-1 ring-white/20 text-white'
        : 'bg-[#121215] hover:bg-[#1A1A1E] text-white/95 border border-black/80 shadow-[0_1px_2px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.12)] active:bg-[#0A0A0D] active:translate-y-[1px]';

      balloonContent = (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.6 }}
          animate={{ opacity: 1, y: -42, scale: 1.1 }}
          exit={{ opacity: 0, y: 4, scale: 0.8 }}
          transition={{ type: 'spring', damping: 22, stiffness: 500 }}
          className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center"
        >
          <div className="w-[clamp(42px,5.5vw,56px)] h-[clamp(48px,6.5vw,66px)] min-w-[42px] px-2 bg-[#121215] text-white rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.9)] border border-white/20 flex items-center justify-center font-light text-[clamp(20px,2.6vw,30px)] tracking-normal">
            {displayChar}
          </div>
          <div className="w-2.5 h-2.5 bg-[#121215] border-r border-b border-white/20 rotate-45 -mt-1.5" />
        </motion.div>
      );
    } else if (currentSkin === 'physical') {
      // Skin 4: Physical keyboard (3D Mechanical) - Sculpted 3D keycaps with physical depth and depression
      buttonClasses = isKeyActive
        ? 'translate-y-[4px] shadow-[0_1px_0_#121317,0_2px_2px_rgba(0,0,0,0.5)] bg-[#23252E] text-white ring-1 ring-orange-500/40'
        : 'bg-gradient-to-b from-[#383B46] to-[#272932] text-white shadow-[0_5px_0_#121317,0_7px_5px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:from-[#40434F] hover:to-[#2C2E38] active:translate-y-[4px] active:shadow-[0_1px_0_#121317,0_2px_2px_rgba(0,0,0,0.5)]';

      balloonContent = (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.6 }}
          animate={{ opacity: 1, y: -42, scale: 1.1 }}
          exit={{ opacity: 0, y: 4, scale: 0.8 }}
          transition={{ type: 'spring', damping: 22, stiffness: 500 }}
          className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center"
        >
          <div className="w-[clamp(42px,5.5vw,56px)] h-[clamp(48px,6.5vw,66px)] min-w-[42px] px-2 bg-[#252831] border-2 border-orange-500/60 text-white rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.9),0_0_15px_rgba(249,115,22,0.3)] flex items-center justify-center font-bold text-[clamp(20px,2.6vw,30px)] tracking-normal">
            {displayChar}
          </div>
          <div className="w-2.5 h-2.5 bg-[#252831] border-r-2 border-b-2 border-orange-500/60 rotate-45 -mt-1.5" />
        </motion.div>
      );
    } else {
      // Default: Default V-Board (Kính tối Liquid Glass)
      buttonClasses = isKeyActive
        ? 'bg-[#7D7D83] scale-90 shadow-[inset_0_2px_6px_rgba(0,0,0,0.5),0_0_12px_rgba(255,255,255,0.4)] ring-1 ring-white/60 brightness-125 text-white'
        : 'bg-[#525257]/80 hover:bg-[#66666B] active:bg-[#7D7D83] active:scale-90 text-white shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10';

      balloonContent = (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.6 }}
          animate={{ opacity: 1, y: -42, scale: 1.1 }}
          exit={{ opacity: 0, y: 4, scale: 0.8 }}
          transition={{ type: 'spring', damping: 22, stiffness: 500 }}
          className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center"
        >
          <div className="w-[clamp(42px,5.5vw,56px)] h-[clamp(48px,6.5vw,66px)] min-w-[42px] px-2 bg-[#2D2D32] border border-cyan-400/40 text-white rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.85),0_0_12px_rgba(34,211,238,0.3)] flex items-center justify-center font-bold text-[clamp(20px,2.6vw,30px)] tracking-normal">
            {displayChar}
          </div>
          <div className="w-2.5 h-2.5 bg-[#2D2D32] border-r border-b border-cyan-400/40 rotate-45 -mt-1.5 shadow-sm" />
        </motion.div>
      );
    }

    // Keycap font size & radius based on skin
    const keyRounding = 
      currentSkin === 'ios' ? 'rounded-[6px]' :
      currentSkin === 'google' ? 'rounded-[8px]' :
      currentSkin === 'butterfly' ? 'rounded-[5px]' :
      currentSkin === 'physical' ? 'rounded-[7px]' :
      'rounded-[7px]';

    const fontStyle = 
      currentSkin === 'ios' ? 'text-[clamp(18px,2.2vw,26px)] font-normal tracking-normal' :
      currentSkin === 'google' ? 'text-[clamp(17px,2.1vw,25px)] font-normal' :
      currentSkin === 'butterfly' ? 'text-[clamp(15px,1.9vw,22px)] font-light drop-shadow-[0_0_2px_rgba(255,255,255,0.35)]' :
      currentSkin === 'physical' ? 'text-[clamp(16px,2vw,23px)] font-bold' :
      'text-[clamp(16px,2vw,23px)] font-normal';

    return (
      <div key={keyId} className={`flex-1 relative ${extraClasses}`}>
        {/* Keycap balloon preview when pressed */}
        <AnimatePresence>
          {isKeyActive && balloonContent}
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
          className={`w-full h-[clamp(42px,5.8vh,62px)] ${fontStyle} ${keyRounding} flex items-center justify-center select-none cursor-pointer transition-all duration-75 relative overflow-hidden ${buttonClasses}`}
        >
          {displayChar}

          {/* Gboard superscript number hint in upper right corner */}
          {subText && currentSkin === 'google' && (
            <span className="absolute top-0.5 right-1.5 text-[clamp(8px,1vw,11px)] font-medium text-zinc-500/80 pointer-events-none select-none">
              {subText}
            </span>
          )}

          {/* Subtle top glare reflection for default skin */}
          {currentSkin === 'default' && (
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-[7px]" />
          )}
        </button>
      </div>
    );
  };

  // KEYBOARD LAYOUT DEFINITIONS
  const renderRow1 = () => {
    const row1Numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    if (mode === 'alpha') {
      const letters = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
      return letters.map((l, idx) => {
        const char = (isShift || isCapsLock) ? l.toUpperCase() : l;
        return renderKey(l, char, char, '', currentSkin === 'google' ? row1Numbers[idx] : undefined);
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

    // Skin-specific styling for Shift and Backspace function keys
    let shiftClasses = '';
    let backspaceClasses = '';

    if (currentSkin === 'ios') {
      shiftClasses = isShiftActive
        ? 'bg-[#FFFFFF] text-black shadow-[0_1.5px_0_rgba(0,0,0,0.4)]'
        : 'bg-[#AAB0BA] hover:bg-[#B5BAC4] text-black shadow-[0_1.5px_0_rgba(0,0,0,0.32)] active:bg-[#9CA3AF]';
      backspaceClasses = isBackspaceActive
        ? 'bg-[#9CA3AF] text-black scale-95 shadow-none'
        : 'bg-[#AAB0BA] hover:bg-[#B5BAC4] text-black shadow-[0_1.5px_0_rgba(0,0,0,0.32)] active:bg-[#9CA3AF]';
    } else if (currentSkin === 'google') {
      shiftClasses = isShiftActive
        ? 'bg-[#B4D2FA] text-[#001D35] shadow-sm'
        : 'bg-[#D3E3FD] hover:bg-[#C2D8FC] text-[#001D35] shadow-[0_1px_2px_rgba(0,0,0,0.1)] active:bg-[#B4D2FA]';
      backspaceClasses = isBackspaceActive
        ? 'bg-[#B4D2FA] text-[#001D35] scale-95 shadow-none'
        : 'bg-[#D3E3FD] hover:bg-[#C2D8FC] text-[#001D35] shadow-[0_1px_2px_rgba(0,0,0,0.1)] active:bg-[#B4D2FA]';
    } else if (currentSkin === 'butterfly') {
      shiftClasses = isShiftActive
        ? 'bg-[#1A1A1E] text-white border border-white/30 shadow-none'
        : 'bg-[#121215] hover:bg-[#1A1A1E] text-white/90 border border-black/80 shadow-[0_1px_2px_rgba(0,0,0,0.85)]';
      backspaceClasses = isBackspaceActive
        ? 'bg-[#0A0A0C] text-white translate-y-[1px] shadow-none'
        : 'bg-[#121215] hover:bg-[#1A1A1E] text-white/90 border border-black/80 shadow-[0_1px_2px_rgba(0,0,0,0.85)] active:translate-y-[1px]';
    } else if (currentSkin === 'physical') {
      shiftClasses = isShiftActive
        ? 'translate-y-[4px] shadow-[0_1px_0_#101116,0_2px_2px_rgba(0,0,0,0.5)] bg-[#1A1C23] text-orange-400 font-bold'
        : 'bg-gradient-to-b from-[#2B2D37] to-[#1E2028] shadow-[0_5px_0_#101116,0_7px_5px_rgba(0,0,0,0.7)] text-white font-bold active:translate-y-[4px] active:shadow-[0_1px_0_#101116,0_2px_2px_rgba(0,0,0,0.5)]';
      backspaceClasses = isBackspaceActive
        ? 'translate-y-[4px] shadow-[0_1px_0_#101116,0_2px_2px_rgba(0,0,0,0.5)] bg-[#1A1C23] text-amber-400 font-bold'
        : 'bg-gradient-to-b from-[#2B2D37] to-[#1E2028] shadow-[0_5px_0_#101116,0_7px_5px_rgba(0,0,0,0.7)] text-white font-bold active:translate-y-[4px] active:shadow-[0_1px_0_#101116,0_2px_2px_rgba(0,0,0,0.5)]';
    } else {
      shiftClasses = isShiftActive
        ? 'bg-white text-black font-bold scale-95 shadow-[0_0_12px_rgba(255,255,255,0.7)]'
        : 'bg-[#3C3C41]/90 hover:bg-[#48484E] text-white shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10';
      backspaceClasses = isBackspaceActive
        ? 'bg-[#505057] scale-90 ring-1 ring-white/50 text-amber-300'
        : 'bg-[#3C3C41]/90 hover:bg-[#48484E] text-white shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 active:bg-[#505057] active:scale-90';
    }

    const keyRounding = 
      currentSkin === 'ios' ? 'rounded-[6px]' :
      currentSkin === 'google' ? 'rounded-[8px]' :
      currentSkin === 'butterfly' ? 'rounded-[5px]' :
      currentSkin === 'physical' ? 'rounded-[7px]' :
      'rounded-[7px]';

    return (
      <div className="flex items-center gap-[clamp(4px,0.7vw,10px)] w-full">
        {/* Left Function Key: Shift / #+= / 123 */}
        {mode === 'alpha' ? (
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              handleShiftToggle();
            }}
            className={`w-[clamp(42px,7.5vw,84px)] h-[clamp(42px,5.8vh,62px)] shrink-0 ${keyRounding} flex items-center justify-center transition-all select-none cursor-pointer ${shiftClasses}`}
            title="Shift (Nhấn đúp để giữ Caps Lock)"
          >
            {currentSkin === 'butterfly' && isCapsLock && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] shadow-[0_0_6px_#34C759] mr-1" />
            )}
            <ArrowUp className={`w-[clamp(18px,2.2vw,24px)] h-[clamp(18px,2.2vw,24px)] stroke-[2.2] ${isCapsLock ? 'stroke-[3.2]' : ''}`} />
          </button>
        ) : (
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              playClick(false);
              setMode(mode === 'numeric' ? 'symbol' : 'numeric');
            }}
            className={`w-[clamp(42px,7.5vw,84px)] h-[clamp(42px,5.8vh,62px)] shrink-0 ${keyRounding} text-[clamp(12px,1.4vw,16px)] font-bold flex items-center justify-center select-none transition-all cursor-pointer ${shiftClasses}`}
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
          className={`w-[clamp(42px,7.5vw,84px)] h-[clamp(42px,5.8vh,62px)] shrink-0 ${keyRounding} flex items-center justify-center select-none transition-all duration-75 cursor-pointer ${backspaceClasses}`}
          title="Xóa ký tự (Nhấn giữ để xóa liên tục)"
        >
          <Delete className="w-[clamp(18px,2.2vw,24px)] h-[clamp(18px,2.2vw,24px)] stroke-[1.8]" />
        </button>
      </div>
    );
  };

  const isSpaceActive = pressedKey === 'space';
  const isSearchActive = pressedKey === 'enter';
  const isCopilotActive = pressedKey === 'copilot';

  // Keyboard container styling based on current skin
  let containerClasses = '';
  if (currentSkin === 'ios') {
    containerClasses = 'bg-[#D0D3D9] text-black border-t border-[#B8BCC4] shadow-2xl';
  } else if (currentSkin === 'google') {
    containerClasses = 'bg-[#ECEFF4] text-[#1F1F1F] border-t border-[#DCE2EA] shadow-2xl';
  } else if (currentSkin === 'butterfly') {
    containerClasses = 'bg-[#202125] text-white border-t-2 border-white/15 shadow-2xl';
  } else if (currentSkin === 'physical') {
    containerClasses = 'bg-[#16171D] text-white border-t-2 border-[#2C2E38] shadow-[0_-8px_35px_rgba(0,0,0,0.9)]';
  } else {
    containerClasses = 'bg-[#161618]/95 backdrop-blur-2xl text-white border-t border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.85)]';
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="vboard-keyboard-container"
          id="vboard-keyboard-container"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          style={{
            WebkitBackdropFilter: 'blur(36px)',
            backdropFilter: 'blur(36px)',
          }}
          className={`fixed z-[100000] select-none transition-all duration-300 ${
            isCompact
              ? 'bottom-0 right-0 w-full sm:w-[540px] md:w-[620px] rounded-tl-2xl sm:rounded-tl-3xl border-t border-l border-b-0 border-r-0 shadow-2xl'
              : 'bottom-0 left-0 right-0 w-full rounded-t-2xl sm:rounded-t-3xl border-t border-x-0 border-b-0 shadow-2xl'
          } ${containerClasses}`}
        >
          {/* Quick Skin Picker Drawer Tray */}
          <AnimatePresence>
            {showSkinPicker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`overflow-hidden border-b transition-colors ${
                  currentSkin === 'ios' ? 'border-black/15 bg-[#C5C8CE]' :
                  currentSkin === 'google' ? 'border-slate-300 bg-[#DEE5EF]' :
                  'border-white/10 bg-[#1A1A1E]'
                }`}
              >
                <div className="p-3 w-full max-w-[100vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Chọn Skin Bàn Phím V-Board
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSkinPicker(false)}
                      className="p-1 rounded-md hover:bg-white/10 text-xs font-medium cursor-pointer"
                    >
                      Đóng ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {VBOARD_SKIN_OPTIONS.map((skinOpt) => {
                      const isSelected = currentSkin === skinOpt.id;
                      return (
                        <button
                          key={skinOpt.id}
                          type="button"
                          onClick={() => {
                            playClick(false);
                            updateSetting('vboardSkin', skinOpt.id);
                          }}
                          className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between relative group ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.3)] ring-1 ring-cyan-400'
                              : 'bg-black/25 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1 w-full">
                            <span className="text-xs font-semibold truncate leading-tight">
                              {skinOpt.name.split(' ')[0]}
                            </span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 stroke-[3]" />
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 truncate mt-0.5">
                            {skinOpt.badge}
                          </span>

                          {/* Mini key preview */}
                          <div 
                            className="mt-2 w-full h-6 rounded-md flex items-center justify-center gap-1 border border-white/10"
                            style={{ backgroundColor: skinOpt.previewBg }}
                          >
                            <div 
                              className="w-4 h-4 rounded-xs shadow-xs"
                              style={{ backgroundColor: skinOpt.previewKeyBg }}
                            />
                            <div 
                              className="w-4 h-4 rounded-xs shadow-xs"
                              style={{ backgroundColor: skinOpt.previewKeyBg }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Emoji Picker Drawer */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`overflow-hidden border-b ${
                  currentSkin === 'ios' ? 'border-black/15 bg-[#D8DBE0]' :
                  currentSkin === 'google' ? 'border-slate-300 bg-[#E2E8F0]' :
                  'border-white/10 bg-[#1A1A1E]'
                }`}
              >
                <div className="p-2.5 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full max-w-[100vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
                  {POPULAR_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onPointerDown={(e) => {
                        e.preventDefault();
                        handleKeyPress(emoji);
                      }}
                      className="w-10 h-10 shrink-0 text-xl flex items-center justify-center rounded-xl bg-black/10 hover:bg-black/20 active:scale-90 transition-all cursor-pointer"
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
                <div className="p-2.5 px-4 flex items-center justify-between gap-3 w-full max-w-[100vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
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

          {/* 1. TOP HEADER TOOLBAR */}
          {currentSkin === 'google' ? (
            /* Google Gboard Toolbar - Exact recreation of Image 2 */
            <div className="h-11 px-3 sm:px-5 border-b border-slate-300/80 flex items-center justify-between text-[#3C4043] w-full max-w-[100vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Vibrant blue circular 4-dots/menu button (opens skin picker & quick tools) */}
                <button
                  type="button"
                  onClick={() => {
                    playClick(false);
                    setShowSkinPicker(!showSkinPicker);
                  }}
                  className="w-8 h-8 rounded-full bg-[#38B6FF] hover:bg-[#28A6EF] text-white flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all"
                  title="Tùy chọn Skin & Tiện ích Gboard"
                >
                  <LayoutGrid className="w-4 h-4 stroke-[2.4]" />
                </button>

                {/* Smiley emoji icon */}
                <button
                  type="button"
                  onClick={() => {
                    playClick(false);
                    setShowEmojiPicker(!showEmojiPicker);
                  }}
                  className="p-1.5 rounded-full hover:bg-black/5 text-[#3C4043] cursor-pointer transition-colors"
                  title="Biểu tượng cảm xúc"
                >
                  <Smile className="w-5 h-5 stroke-[1.8]" />
                </button>

                {/* Resize / compact icon */}
                <button
                  type="button"
                  onClick={() => {
                    playClick(false);
                    setIsCompact(!isCompact);
                  }}
                  className="p-1.5 rounded-full hover:bg-black/5 text-[#3C4043] cursor-pointer transition-colors"
                  title={isCompact ? 'Phóng to' : 'Thu nhỏ'}
                >
                  <ArrowLeftRight className="w-4.5 h-4.5 stroke-[1.8]" />
                </button>

                {/* Keyboard icon (switch to device keyboard) */}
                <button
                  type="button"
                  onClick={() => {
                    playClick(false);
                    onSwitchToDeviceKeyboard();
                  }}
                  className="p-1.5 rounded-full hover:bg-black/5 text-[#3C4043] cursor-pointer transition-colors"
                  title="Chuyển sang bàn phím thiết bị"
                >
                  <KeyboardIcon className="w-4.5 h-4.5 stroke-[1.8]" />
                </button>

                {/* Copilot AI suggestions icon */}
                <button
                  type="button"
                  onClick={() => {
                    playClick(false);
                    setShowCopilotBar(!showCopilotBar);
                  }}
                  className="p-1.5 rounded-full hover:bg-black/5 text-[#3C4043] cursor-pointer transition-colors"
                  title="Gợi ý Copilot"
                >
                  <Sparkles className="w-4.5 h-4.5 stroke-[1.8]" />
                </button>

                {/* Translate / Languages icon */}
                <button
                  type="button"
                  onClick={() => {
                    playClick(false);
                    setIsVietnamese(!isVietnamese);
                  }}
                  className="p-1.5 rounded-full hover:bg-black/5 text-[#3C4043] cursor-pointer transition-colors"
                  title="Bộ gõ ngôn ngữ"
                >
                  <Languages className="w-4.5 h-4.5 stroke-[1.8]" />
                </button>
              </div>

              {/* Aux controls */}
              <div className="flex items-center gap-1.5">
                {/* Telex VIE/ENG switch */}
                <button
                  type="button"
                  onClick={() => {
                    playClick(false);
                    setIsVietnamese(!isVietnamese);
                  }}
                  className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-black/5 hover:bg-black/10 text-[#1F1F1F] border border-black/10 transition-all cursor-pointer"
                  title="Bật/Tắt gõ Telex"
                >
                  {isVietnamese ? 'VIE' : 'ENG'}
                </button>

                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1.5 rounded-lg hover:bg-black/5 text-[#3C4043] transition-colors cursor-pointer"
                  title={soundEnabled ? 'Tắt âm' : 'Bật âm'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    onClose();
                  }}
                  className="p-1.5 rounded-lg hover:bg-black/5 text-[#3C4043] transition-colors cursor-pointer"
                  title="Đóng bàn phím"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Standard / iOS / Butterfly / Physical Top Toolbar */
            <div className={`h-10 px-4 sm:px-6 border-b flex items-center justify-between w-full max-w-[100vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto ${
              currentSkin === 'ios' ? 'border-black/10 text-black/80' : 'border-white/10 text-white/80'
            }`}>
              <div className="flex items-center h-full w-full max-w-sm sm:max-w-md mx-auto justify-around">
                {/* Left: Smiley face */}
                <button
                  type="button"
                  onClick={() => {
                    playClick(false);
                    setShowEmojiPicker(!showEmojiPicker);
                  }}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    currentSkin === 'ios' ? 'hover:bg-black/10' : 'hover:bg-white/10 hover:text-white'
                  } ${showEmojiPicker ? 'text-[#FF267A]' : ''}`}
                  title="Biểu tượng cảm xúc (Emojis)"
                >
                  <Smile className="w-5 h-5 stroke-[1.8]" />
                </button>

                {/* Subtle Divider */}
                <div className={`w-[1px] h-4 ${currentSkin === 'ios' ? 'bg-black/15' : 'bg-white/15'}`} />

                {/* Center: Window / LayoutGrid icon */}
                <button
                  type="button"
                  onClick={() => {
                    playClick(false);
                    setIsCompact(!isCompact);
                  }}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    currentSkin === 'ios' ? 'hover:bg-black/10 text-black/80' : 'hover:bg-white/10 text-white/80 hover:text-white'
                  }`}
                  title={isCompact ? 'Mở rộng bàn phím đầy đủ' : 'Thu gọn bàn phím'}
                >
                  <LayoutGrid className="w-5 h-5 stroke-[1.8]" />
                </button>

                {/* Subtle Divider */}
                <div className={`w-[1px] h-4 ${currentSkin === 'ios' ? 'bg-black/15' : 'bg-white/15'}`} />

                {/* Skin Selector Button */}
                <button
                  type="button"
                  onClick={() => {
                    playClick(false);
                    setShowSkinPicker(!showSkinPicker);
                  }}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    currentSkin === 'ios' ? 'hover:bg-black/10 text-black/80' : 'hover:bg-white/10 text-white/80 hover:text-white'
                  }`}
                  title="Đổi giao diện bàn phím (Skins)"
                >
                  <Palette className="w-4.5 h-4.5 stroke-[1.8] text-cyan-400" />
                </button>

                {/* Subtle Divider */}
                <div className={`w-[1px] h-4 ${currentSkin === 'ios' ? 'bg-black/15' : 'bg-white/15'}`} />

                {/* Right: Globe icon -> Switches directly to device keyboard */}
                <button
                  type="button"
                  onClick={() => {
                    playClick(false);
                    onSwitchToDeviceKeyboard();
                  }}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    currentSkin === 'ios' ? 'hover:bg-black/10 text-black/80' : 'hover:bg-white/10 text-white/80 hover:text-white'
                  }`}
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
                    currentSkin === 'ios'
                      ? (isVietnamese ? 'bg-black/15 text-black border-black/20' : 'bg-transparent text-black/50 border-black/10')
                      : (isVietnamese ? 'bg-blue-600/30 text-blue-400 border-blue-500/40 hover:bg-blue-600/40' : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10')
                  }`}
                  title="Bật/Tắt gõ tiếng Việt Telex"
                >
                  {isVietnamese ? 'VIE' : 'ENG'}
                </button>

                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    currentSkin === 'ios' ? 'hover:bg-black/10 text-black/60' : 'text-white/50 hover:text-white hover:bg-white/10'
                  }`}
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
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    currentSkin === 'ios' ? 'hover:bg-black/10 text-black/60' : 'text-white/50 hover:text-white hover:bg-white/10'
                  }`}
                  title="Đóng bàn phím V-board"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 2. MAIN KEYBOARD KEYS MATRIX */}
          <div className="p-1.5 sm:p-2.5 md:p-3.5 lg:p-4 w-full max-w-[100vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto space-y-[clamp(5px,0.9vh,10px)]">
            {/* Row 1 */}
            <div className="flex items-center gap-[clamp(4px,0.7vw,10px)] w-full">
              {renderRow1()}
            </div>

            {/* Row 2 (Indented slightly on sides like iOS/Gboard) */}
            <div className="flex items-center gap-[clamp(4px,0.7vw,10px)] w-full px-[3.5%] sm:px-[4%]">
              {renderRow2()}
            </div>

            {/* Row 3 (Shift + Letters/Symbols + Backspace) */}
            {renderRow3()}

            {/* Row 4 (Bottom keyboard control row) */}
            {currentSkin === 'google' ? (
              /* Google Gboard Row 4 - Exact recreation of Image 2 */
              <div className="flex items-center gap-[clamp(4px,0.7vw,10px)] w-full">
                {/* ?123 Key */}
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    playClick(false);
                    setMode(mode === 'alpha' ? 'numeric' : 'alpha');
                  }}
                  className="w-[clamp(48px,8.5vw,94px)] h-[clamp(42px,5.8vh,62px)] bg-[#D3E3FD] hover:bg-[#C2D8FC] active:bg-[#B4D2FA] text-[#001D35] text-[clamp(13px,1.6vw,17px)] font-medium rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] flex items-center justify-center select-none active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  {mode === 'alpha' ? '?123' : 'ABC'}
                </button>

                {/* Comma ',' Key */}
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    handleKeyPress(',');
                  }}
                  className="w-[clamp(40px,6.8vw,74px)] h-[clamp(42px,5.8vh,62px)] bg-[#D3E3FD] hover:bg-[#C2D8FC] active:bg-[#B4D2FA] text-[#001D35] text-[clamp(16px,2vw,24px)] font-bold rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] flex items-center justify-center select-none active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  ,
                </button>

                {/* Clean Wide White Space Bar */}
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    setPressedKey('space');
                    handleKeyPress(' ');
                  }}
                  onPointerUp={() => setPressedKey(null)}
                  onPointerLeave={() => setPressedKey(null)}
                  className={`flex-1 h-[clamp(42px,5.8vh,62px)] rounded-[8px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.12)] flex items-center justify-center select-none transition-all duration-75 cursor-pointer ${
                    isSpaceActive ? 'bg-[#E2E8F0] scale-[0.98]' : 'hover:bg-[#F8FAFC]'
                  }`}
                  title="Phím cách (Space)"
                >
                  <span className="text-[clamp(11px,1.4vw,15px)] text-zinc-400/80 font-normal">
                    {isVietnamese ? 'tiếng việt' : ''}
                  </span>
                </button>

                {/* Period '.' Key */}
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    handleKeyPress('.');
                  }}
                  className="w-[clamp(40px,6.8vw,74px)] h-[clamp(42px,5.8vh,62px)] bg-[#D3E3FD] hover:bg-[#C2D8FC] active:bg-[#B4D2FA] text-[#001D35] text-[clamp(16px,2vw,24px)] font-bold rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] flex items-center justify-center select-none active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  .
                </button>

                {/* Distinctive Gboard Vibrant Light-Blue Pill Enter Button */}
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    setPressedKey('enter');
                    handleSearchSubmit();
                  }}
                  onPointerUp={() => setPressedKey(null)}
                  onPointerLeave={() => setPressedKey(null)}
                  className={`w-[clamp(56px,9.5vw,106px)] h-[clamp(42px,5.8vh,62px)] rounded-[22px] bg-[#38B6FF] hover:bg-[#28A6EF] active:bg-[#1E95DD] text-black shadow-md flex items-center justify-center select-none transition-all duration-75 cursor-pointer shrink-0 ${
                    isSearchActive ? 'scale-90 shadow-sm' : 'active:scale-95'
                  }`}
                  title="Enter / Tìm kiếm"
                >
                  <CornerDownLeft className="w-5 h-5 stroke-[2.5] text-black" />
                </button>
              </div>
            ) : currentSkin === 'ios' ? (
              /* iOS Row 4 - Exact recreation of Image 1 */
              <div className="flex items-center gap-[clamp(4px,0.7vw,10px)] w-full">
                {/* 123 Switcher */}
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    playClick(false);
                    setMode(mode === 'alpha' ? 'numeric' : 'alpha');
                  }}
                  className="w-[clamp(48px,8.5vw,92px)] h-[clamp(42px,5.8vh,62px)] bg-[#AAB0BA] hover:bg-[#B5BAC4] active:bg-[#9CA3AF] text-black text-[clamp(13px,1.6vw,17px)] font-normal rounded-[6px] shadow-[0_1.5px_0_rgba(0,0,0,0.32)] flex items-center justify-center select-none active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  {mode === 'alpha' ? '123' : 'ABC'}
                </button>

                {/* Copilot Key */}
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
                  className={`w-[clamp(40px,6.8vw,74px)] h-[clamp(42px,5.8vh,62px)] rounded-[6px] bg-[#AAB0BA] hover:bg-[#B5BAC4] text-black shadow-[0_1.5px_0_rgba(0,0,0,0.32)] flex items-center justify-center select-none transition-all duration-75 cursor-pointer shrink-0 ${
                    isCopilotActive || showCopilotBar ? 'bg-[#9CA3AF] scale-95' : 'active:scale-95'
                  }`}
                  title="Copilot AI Key"
                >
                  <CopilotMonochromeIcon className="w-5 h-5 text-black" />
                </button>

                {/* Pure White Space Bar with lowercase "space" or "tiếng việt" */}
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    setPressedKey('space');
                    handleKeyPress(' ');
                  }}
                  onPointerUp={() => setPressedKey(null)}
                  onPointerLeave={() => setPressedKey(null)}
                  className={`flex-1 h-[clamp(42px,5.8vh,62px)] rounded-[6px] bg-[#FFFFFF] shadow-[0_1.5px_0_rgba(0,0,0,0.32)] flex items-center justify-center select-none transition-all duration-75 cursor-pointer ${
                    isSpaceActive ? 'bg-[#E5E5EA] scale-[0.98]' : 'hover:bg-[#F6F6F6]'
                  }`}
                  title="Phím cách (Space)"
                >
                  <span className="text-[clamp(11px,1.4vw,15px)] text-black/60 font-normal tracking-wide">
                    {isVietnamese ? 'tiếng việt' : 'space'}
                  </span>
                </button>

                {/* iOS Search Key - Matching Image 1 with lowercase text "search" */}
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    setPressedKey('enter');
                    handleSearchSubmit();
                  }}
                  onPointerUp={() => setPressedKey(null)}
                  onPointerLeave={() => setPressedKey(null)}
                  className={`w-[clamp(64px,11vw,120px)] h-[clamp(42px,5.8vh,62px)] rounded-[6px] bg-[#AAB0BA] hover:bg-[#B5BAC4] active:bg-[#9CA3AF] text-[#33373E] text-[clamp(13px,1.6vw,17px)] font-normal shadow-[0_1.5px_0_rgba(0,0,0,0.32)] flex items-center justify-center select-none transition-all duration-75 cursor-pointer shrink-0 ${
                    isSearchActive ? 'scale-95 shadow-none' : 'active:scale-95'
                  }`}
                  title="Tìm kiếm (Search)"
                >
                  search
                </button>
              </div>
            ) : currentSkin === 'butterfly' ? (
              /* MacBook Butterfly Keyboard Row 4 */
              <div className="flex items-center gap-[clamp(4px,0.7vw,10px)] w-full">
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    playClick(false);
                    setMode(mode === 'alpha' ? 'numeric' : 'alpha');
                  }}
                  className="w-[clamp(46px,8vw,88px)] h-[clamp(42px,5.8vh,62px)] bg-[#121215] hover:bg-[#1A1A1E] text-white/80 text-[clamp(11px,1.3vw,14px)] font-normal rounded-[5px] border border-black/80 shadow-[0_1px_2px_rgba(0,0,0,0.85)] flex items-center justify-center select-none active:translate-y-[1px] transition-all cursor-pointer shrink-0"
                >
                  {mode === 'alpha' ? 'control' : 'abc'}
                </button>

                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    setShowCopilotBar((prev) => !prev);
                  }}
                  className="w-[clamp(40px,6.8vw,74px)] h-[clamp(42px,5.8vh,62px)] bg-[#121215] hover:bg-[#1A1A1E] text-white/80 text-[clamp(11px,1.3vw,14px)] font-normal rounded-[5px] border border-black/80 shadow-[0_1px_2px_rgba(0,0,0,0.85)] flex items-center justify-center select-none active:translate-y-[1px] transition-all cursor-pointer shrink-0"
                >
                  ⌥ opt
                </button>

                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    setPressedKey('space');
                    handleKeyPress(' ');
                  }}
                  onPointerUp={() => setPressedKey(null)}
                  onPointerLeave={() => setPressedKey(null)}
                  className={`flex-1 h-[clamp(42px,5.8vh,62px)] rounded-[5px] bg-[#121215] hover:bg-[#1A1A1E] border border-black/80 shadow-[0_1px_2px_rgba(0,0,0,0.85)] flex items-center justify-center select-none transition-all duration-75 cursor-pointer ${
                    isSpaceActive ? 'bg-[#0A0A0C] translate-y-[1px]' : 'active:translate-y-[1px]'
                  }`}
                >
                  <span className="text-[clamp(11px,1.3vw,14px)] text-white/35 font-light">
                    {isVietnamese ? 'tiếng việt' : ''}
                  </span>
                </button>

                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    setShowSkinPicker(true);
                  }}
                  className="w-[clamp(40px,6.8vw,74px)] h-[clamp(42px,5.8vh,62px)] bg-[#121215] hover:bg-[#1A1A1E] text-white/80 text-[clamp(11px,1.3vw,14px)] font-normal rounded-[5px] border border-black/80 shadow-[0_1px_2px_rgba(0,0,0,0.85)] flex items-center justify-center select-none active:translate-y-[1px] transition-all cursor-pointer shrink-0"
                >
                  ⌘ cmd
                </button>

                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    setPressedKey('enter');
                    handleSearchSubmit();
                  }}
                  onPointerUp={() => setPressedKey(null)}
                  onPointerLeave={() => setPressedKey(null)}
                  className={`w-[clamp(62px,10.5vw,118px)] h-[clamp(42px,5.8vh,62px)] rounded-[5px] bg-[#121215] hover:bg-[#1A1A1E] text-white/95 text-[clamp(12px,1.4vw,15px)] font-medium border border-black/80 shadow-[0_1px_2px_rgba(0,0,0,0.85)] flex items-center justify-center select-none transition-all duration-75 cursor-pointer shrink-0 ${
                    isSearchActive ? 'bg-[#0A0A0C] translate-y-[1px]' : 'active:translate-y-[1px]'
                  }`}
                >
                  return ↩
                </button>
              </div>
            ) : currentSkin === 'physical' ? (
              /* 3D Mechanical Physical Keyboard Row 4 */
              <div className="flex items-center gap-[clamp(4px,0.7vw,10px)] w-full">
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    playClick(false);
                    setMode(mode === 'alpha' ? 'numeric' : 'alpha');
                  }}
                  className="w-[clamp(48px,8.5vw,94px)] h-[clamp(42px,5.8vh,62px)] bg-gradient-to-b from-[#2B2D37] to-[#1E2028] shadow-[0_5px_0_#101116,0_7px_5px_rgba(0,0,0,0.7)] text-white text-[clamp(12px,1.5vw,16px)] font-bold rounded-[7px] flex items-center justify-center select-none active:translate-y-[4px] active:shadow-[0_1px_0_#101116,0_2px_2px_rgba(0,0,0,0.5)] transition-all cursor-pointer shrink-0"
                >
                  {mode === 'alpha' ? '123' : 'ABC'}
                </button>

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
                  className="w-[clamp(42px,7vw,76px)] h-[clamp(42px,5.8vh,62px)] bg-gradient-to-b from-[#2B2D37] to-[#1E2028] shadow-[0_5px_0_#101116,0_7px_5px_rgba(0,0,0,0.7)] text-white rounded-[7px] flex items-center justify-center select-none active:translate-y-[4px] active:shadow-[0_1px_0_#101116,0_2px_2px_rgba(0,0,0,0.5)] transition-all cursor-pointer shrink-0"
                >
                  <CopilotMonochromeIcon className="w-5 h-5 text-cyan-400" />
                </button>

                {/* 3D Sculpted Space Bar */}
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    setPressedKey('space');
                    handleKeyPress(' ');
                  }}
                  onPointerUp={() => setPressedKey(null)}
                  onPointerLeave={() => setPressedKey(null)}
                  className={`flex-1 h-[clamp(42px,5.8vh,62px)] rounded-[7px] bg-gradient-to-b from-[#383B46] to-[#272932] shadow-[0_5px_0_#121317,0_7px_5px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center select-none transition-all duration-75 cursor-pointer ${
                    isSpaceActive ? 'translate-y-[4px] shadow-[0_1px_0_#121317,0_2px_2px_rgba(0,0,0,0.5)] bg-[#23252E]' : 'active:translate-y-[4px] active:shadow-[0_1px_0_#121317,0_2px_2px_rgba(0,0,0,0.5)]'
                  }`}
                  title="Phím cách (Space)"
                >
                  <span className="text-[clamp(11px,1.4vw,15px)] text-white/50 font-medium">
                    {isVietnamese ? 'tiếng việt' : 'SPACE'}
                  </span>
                </button>

                {/* Tangerine Orange 3D Mechanical Search Key */}
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    setPressedKey('enter');
                    handleSearchSubmit();
                  }}
                  onPointerUp={() => setPressedKey(null)}
                  onPointerLeave={() => setPressedKey(null)}
                  className={`w-[clamp(62px,10.5vw,118px)] h-[clamp(42px,5.8vh,62px)] rounded-[7px] bg-gradient-to-b from-[#FF7A00] to-[#D95B00] shadow-[0_5px_0_#8F3800,0_7px_5px_rgba(0,0,0,0.7)] text-white font-bold flex items-center justify-center select-none transition-all duration-75 cursor-pointer shrink-0 ${
                    isSearchActive ? 'translate-y-[4px] shadow-[0_1px_0_#8F3800,0_2px_2px_rgba(0,0,0,0.5)]' : 'active:translate-y-[4px] active:shadow-[0_1px_0_#8F3800,0_2px_2px_rgba(0,0,0,0.5)]'
                  }`}
                  title="Tìm kiếm / Enter"
                >
                  <Search className="w-5 h-5 text-white stroke-[2.8]" />
                </button>
              </div>
            ) : (
              /* Default V-Board Row 4 */
              <div className="flex items-center gap-[clamp(4px,0.7vw,10px)] w-full">
                {/* 123 / ABC Switcher Key */}
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    playClick(false);
                    setMode(mode === 'alpha' ? 'numeric' : 'alpha');
                  }}
                  className="w-[clamp(48px,8.5vw,94px)] h-[clamp(42px,5.8vh,62px)] bg-[#3C3C41]/90 hover:bg-[#48484E] active:bg-[#505057] text-white text-[clamp(13px,1.6vw,17px)] font-medium rounded-[7px] shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 flex items-center justify-center select-none active:scale-90 transition-all cursor-pointer shrink-0"
                >
                  {mode === 'alpha' ? '123' : 'ABC'}
                </button>

                {/* Copilot Key */}
                <div className="relative shrink-0">
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
                    className={`w-[clamp(42px,7vw,76px)] h-[clamp(42px,5.8vh,62px)] rounded-[7px] shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 flex items-center justify-center select-none transition-all duration-75 cursor-pointer shrink-0 ${
                      isCopilotActive || showCopilotBar
                        ? 'bg-[#7D7D83] scale-90 ring-1 ring-white/60 shadow-[inset_0_2px_6px_rgba(0,0,0,0.5),0_0_12px_rgba(255,255,255,0.4)]'
                        : 'bg-[#3C3C41]/90 hover:bg-[#48484E] active:bg-[#505057] active:scale-90 text-white'
                    }`}
                    title="Copilot AI Key"
                  >
                    <CopilotMonochromeIcon className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Blank Wide Space Bar */}
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    setPressedKey('space');
                    handleKeyPress(' ');
                  }}
                  onPointerUp={() => setPressedKey(null)}
                  onPointerLeave={() => setPressedKey(null)}
                  className={`flex-1 h-[clamp(42px,5.8vh,62px)] rounded-[7px] shadow-[0_1.5px_0_rgba(0,0,0,0.55)] border-t border-white/10 flex items-center justify-center select-none transition-all duration-75 relative group cursor-pointer ${
                    isSpaceActive
                      ? 'bg-[#7D7D83] scale-[0.96] ring-1 ring-white/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_0_12px_rgba(255,255,255,0.3)]'
                      : 'bg-[#525257]/80 hover:bg-[#66666B] active:bg-[#7D7D83] active:scale-[0.96]'
                  }`}
                  title="Phím cách (Space)"
                >
                  <span className={`text-[clamp(11px,1.4vw,15px)] tracking-wide font-normal transition-colors ${
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
                  className={`w-[clamp(60px,10vw,114px)] h-[clamp(42px,5.8vh,62px)] rounded-[7px] flex items-center justify-center select-none transition-all duration-75 cursor-pointer shrink-0 ${
                    isSearchActive
                      ? 'bg-[#0051A8] scale-90 shadow-[0_0_20px_rgba(0,122,255,0.8)] ring-2 ring-white/70'
                      : 'bg-[#007AFF] hover:bg-[#0A84FF] active:bg-[#0062CC] active:scale-90 shadow-[0_1.5px_0_rgba(0,122,255,0.4)] text-white'
                  }`}
                  title="Tìm kiếm / Thực thi (Search)"
                >
                  <Search className="w-5 h-5 text-white stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>

          {/* 3. BOTTOM FOOTER (Globe icon + Home indicator bar + Microphone) */}
          <div className="pb-2.5 sm:pb-3 pt-1 px-4 sm:px-8 flex items-center justify-between w-full max-w-[100vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
            {/* Bottom Globe / Switch Icon */}
            <button
              type="button"
              onClick={() => {
                playClick(false);
                onSwitchToDeviceKeyboard();
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-all cursor-pointer ${
                currentSkin === 'ios' ? 'text-black/75 hover:bg-black/10' :
                currentSkin === 'google' ? 'text-[#3C4043] hover:bg-black/5' :
                'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              title="Chuyển sang bàn phím thiết bị (Device keyboard)"
            >
              {currentSkin === 'ios' ? (
                <Smile className="w-6 h-6 stroke-[1.6]" />
              ) : (
                <Globe className="w-6 h-6 stroke-[1.5]" />
              )}
            </button>

            {/* Center Home Indicator Bar */}
            <div
              onClick={() => {
                playPopSound();
                onClose();
              }}
              className="group py-2 px-6 cursor-pointer flex flex-col items-center gap-1"
              title="Nhấp để đóng bàn phím V-board"
            >
              <div className={`w-36 sm:w-40 h-1 sm:h-1.5 rounded-full transition-colors ${
                currentSkin === 'ios' ? 'bg-black/60 group-hover:bg-black/90' :
                currentSkin === 'google' ? 'bg-black/40 group-hover:bg-black/70' :
                'bg-white/40 group-hover:bg-white/80'
              }`} />
            </div>

            {/* Bottom Microphone Icon */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                  : currentSkin === 'ios'
                  ? 'text-black/75 hover:bg-black/10'
                  : currentSkin === 'google'
                  ? 'text-[#3C4043] hover:bg-black/5'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              title="Tìm kiếm bằng giọng nói"
            >
              {isListening ? (
                <MicOff className="w-6 h-6 stroke-[1.8]" />
              ) : (
                <Mic className="w-6 h-6 stroke-[1.6]" />
              )}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VBoardKeyboard;
