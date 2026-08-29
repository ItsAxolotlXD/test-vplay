import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface UnderConstructionModalProps {
  isOpen?: boolean;
  onUnlock: () => void;
  onCrash: (reason: string) => void;
}

export const UnderConstructionModal: React.FC<UnderConstructionModalProps> = ({
  isOpen = true,
  onUnlock,
  onCrash,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isShaking, setIsShaking] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric inputs
    const lastChar = value.replace(/[^0-9]/g, '').slice(-1);
    
    const newDigits = [...digits];
    newDigits[index] = lastChar;
    setDigits(newDigits);
    setErrorMessage('');

    // If a digit was entered, move to next box
    if (lastChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleVerifyPassword();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
    if (!pastedData) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      if (i < pastedData.length) {
        newDigits[i] = pastedData[i];
      }
    }
    setDigits(newDigits);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerifyPassword = () => {
    const enteredCode = digits.join('');

    if (enteredCode.length < 6) {
      setErrorMessage('Vui lòng nhập đủ 6 chữ số mã bảo mật.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      return;
    }

    if (enteredCode === '190926') {
      onUnlock();
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);

      // Clear input digits
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();

      if (newAttempts >= 3) {
        // Exceeded 3 attempts -> Crash web
        onCrash('EXCEEDED_MAX_PASSCODE_ATTEMPTS (Sai mật khẩu 3/3 lần)');
      } else {
        const remaining = 3 - newAttempts;
        setErrorMessage(
          `Mật khẩu không chính xác! Còn ${remaining} lần thử trước khi web bị crash.`
        );
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="under-construction-container"
          className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 selection:bg-[#E6005A] selection:text-white"
        >
          {/* 1. Backdrop / Lớp nền mờ */}
          <motion.div
            id="under-construction-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* 2. Dialog Modal Box */}
          <motion.div
            id="under-construction-dialog"
            initial={{ opacity: 0, scale: 1.10 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: {
                duration: 0.40,
                ease: [0.16, 1, 0.3, 1]
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 1.08,
              transition: {
                duration: 0.26,
                ease: [0.25, 0.1, 0.25, 1]
              }
            }}
            className={`relative z-10 w-full max-w-[500px] bg-[#1E1D22] rounded-[38px] p-8 sm:p-10 shadow-2xl select-none border border-white/5 ${
              isShaking ? 'animate-bounce' : ''
            }`}
          >
            {/* Title */}
            <h1
              id="under-construction-title"
              className="text-2xl sm:text-[28px] font-bold text-white tracking-tight mb-3 font-sans leading-tight"
            >
              Under construction
            </h1>

            {/* Subtitle */}
            <p
              id="under-construction-subtitle"
              className="text-sm sm:text-[15px] text-[#D1D5DB] leading-relaxed mb-6 font-normal"
            >
              Nothing interesting to see here... yet... Unless you are the one who got approved or a developer, please enter this 6 digits password.
            </p>

            {/* 6-Digit Passcode Input Section */}
            <div className="mb-6">
              <div
                className="flex items-center justify-between gap-2 sm:gap-2.5"
                onPaste={handlePaste}
              >
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    id={`passcode-digit-${index}`}
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-11 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-[#141318] border rounded-[20px] transition-all outline-none ${
                      digit
                        ? 'border-[#E6005A] text-white bg-[#222129]'
                        : 'border-[#2D2D36] text-[#E0E0E6] focus:border-[#E6005A] focus:bg-[#201F26]'
                    }`}
                    autoComplete="off"
                  />
                ))}
              </div>

              {/* Error and Attempt Counter */}
              {errorMessage && (
                <div className="mt-3.5 flex items-start gap-2 text-xs text-[#FF6B6B] bg-[#2C1417] border border-[#FF4D4D]/30 px-3.5 py-2.5 rounded-2xl animate-in fade-in">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {failedAttempts > 0 && failedAttempts < 3 && !errorMessage && (
                <p className="mt-2.5 text-xs text-[#FFB066] flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Cảnh báo: Còn {3 - failedAttempts} lần thử trước khi web dừng hoạt động.</span>
                </p>
              )}
            </div>

            {/* Action Buttons (Enter password only) */}
            <div className="flex flex-col gap-3.5">
              {/* Button colored: Enter password */}
              <button
                type="button"
                id="btn-enter-password"
                onClick={handleVerifyPassword}
                className="w-full py-4 px-6 rounded-full font-bold text-white bg-[#E6005A] hover:bg-[#FF267A] active:scale-[0.98] transition-all text-base sm:text-[17px] cursor-pointer flex items-center justify-center shadow-md tracking-tight"
              >
                Enter password
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
