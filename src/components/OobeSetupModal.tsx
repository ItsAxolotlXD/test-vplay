import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  PanelLeft,
  PanelTop,
  Compass,
  Type,
  User,
  ArrowRight,
  Tv,
  Radio,
  Share2,
  ShoppingBag,
  Coins,
  BookOpen,
  Package,
} from 'lucide-react';
import { FontFamilyOption } from '../hooks/useSettings';

export interface OobeSetupConfig {
  userName: string;
  navStyle: 'sidebar' | 'topbar' | 'floaty';
  fontFamily: FontFamilyOption;
}

interface OobeSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (config: OobeSetupConfig) => void;
  initialName?: string;
  initialNavStyle?: 'sidebar' | 'topbar' | 'floaty';
  initialFontFamily?: FontFamilyOption;
}

// Steps enumeration with V-Shop and Space360 steps
type OobeStep = 1 | 2 | 2.1 | 3 | 4 | 5 | 5.1 | 5.2 | 6 | 7;

export const OobeSetupModal: React.FC<OobeSetupModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialName = '',
  initialNavStyle = 'topbar',
  initialFontFamily = 'alata',
}) => {
  const [currentStep, setCurrentStep] = useState<OobeStep>(1);
  const [userName, setUserName] = useState<string>(initialName || '');
  const [navStyle, setNavStyle] = useState<'sidebar' | 'topbar' | 'floaty'>(initialNavStyle);
  const [fontFamily, setFontFamily] = useState<FontFamilyOption>(initialFontFamily);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setUserName(initialName && initialName !== 'User' ? initialName : '');
      setNavStyle(initialNavStyle);
      setFontFamily(initialFontFamily);
      setTermsAccepted(true);
      setIsSubmitting(false);
    }
  }, [isOpen, initialName, initialNavStyle, initialFontFamily]);

  // Focus input when moving to step 2
  useEffect(() => {
    if (currentStep === 2) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleFinish = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const finalName = userName.trim() || 'User';

    // Windows 11 style smooth "Just a moment..." transition
    setTimeout(() => {
      onComplete({
        userName: finalName,
        navStyle,
        fontFamily,
      });
      setIsSubmitting(false);
    }, 1100);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setCurrentStep(3);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="vplay-oobe-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 md:p-10 select-none overflow-hidden bg-gradient-to-br from-[#CBD9EA] via-[#DEE7F2] to-[#CBD5E6]"
      >
        {/* Soft Ambient Windows 11 Bloom / Light Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-300/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-300/30 blur-3xl pointer-events-none" />

        {/* Windows 11 OOBE Main Card Window */}
        <motion.div
          id="vplay-oobe-card"
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[940px] min-h-[530px] sm:min-h-[560px] md:min-h-[580px] bg-[#FDFDFE]/98 rounded-[16px] sm:rounded-[20px] shadow-[0_24px_70px_rgba(0,0,0,0.22),0_4px_16px_rgba(0,0,0,0.06)] border border-black/10 flex flex-col justify-between p-6 sm:p-10 md:p-12 overflow-hidden backdrop-blur-2xl"
        >
          {/* Subtle Close Button */}
          <button
            id="btn-oobe-close"
            type="button"
            onClick={onClose}
            title="Đóng thiết lập OOBE"
            aria-label="Đóng thiết lập OOBE"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 rounded-full flex items-center justify-center text-[#707070] hover:text-[#1A1A1A] hover:bg-black/5 active:scale-95 transition-all cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Submitting "Just a moment..." Windows 11 Overlay */}
          {isSubmitting ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-40 bg-[#FDFDFE]/95 backdrop-blur-md flex flex-col items-center justify-center gap-5"
            >
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-transparent border-t-[#0067C0] border-r-[#0067C0] rounded-full animate-spin" />
              </div>
              <p className="text-base sm:text-lg font-normal text-[#1A1A1A] font-sans tracking-tight">
                Just a moment...
              </p>
            </motion.div>
          ) : null}

          {/* PAGE CONTENT CONTAINER */}
          <div className="flex-1 flex flex-col justify-center my-auto">
            <AnimatePresence mode="wait">
              {/* ========================================================
                  TRANG 1: WELCOME TO VPLAY
                 ======================================================== */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
                >
                  {/* Left Column Graphic: Vplay Sphere Logo & Media Glow */}
                  <div className="md:col-span-5 flex items-center justify-center py-4">
                    <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#E6005A]/20 via-[#0078D4]/20 to-[#6E2CF4]/25 blur-2xl animate-pulse" />
                      <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-3xl bg-gradient-to-br from-[#121118] via-[#1A1826] to-[#0A0910] shadow-[0_16px_40px_rgba(0,0,0,0.3)] border border-white/20 flex flex-col items-center justify-center p-5 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#E6005A] via-[#FF3366] to-[#FF8008] flex items-center justify-center shadow-lg shadow-[#E6005A]/40 mb-3">
                          <span className="text-white text-3xl font-black italic tracking-tighter">V</span>
                        </div>
                        <span className="text-white font-black text-xl tracking-wider">VPLAY</span>
                        <span className="text-white/60 text-[11px] mt-0.5 font-medium">Digital Hub</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Welcome Description */}
                  <div className="md:col-span-7 flex flex-col justify-center max-w-md w-full mx-auto md:mx-0">
                    <span className="text-xs font-semibold text-[#0067C0] uppercase tracking-wider mb-1">
                      Welcome to Vplay
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-[34px] font-semibold text-[#1A1A1A] tracking-tight leading-tight font-sans">
                      Khám phá thế giới giải trí thông minh
                    </h1>
                    <p className="text-xs sm:text-sm text-[#5C5C5C] mt-3 mb-6 font-normal leading-relaxed font-sans">
                      Vplay là nền tảng giải trí và truyền hình đa phương tiện thế hệ mới. Trải nghiệm hàng chục kênh truyền hình trực tiếp chất lượng cao, vũ trụ không gian 360°, mạng xã hội V-Flow và trợ lý thông minh Copilot AI được tích hợp liền mạch.
                    </p>

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-xs text-[#2A2A2A]">
                        <div className="w-6 h-6 rounded-md bg-[#0067C0]/10 flex items-center justify-center text-[#0067C0]">
                          <Tv className="w-3.5 h-3.5" />
                        </div>
                        <span>Truyền hình & Radio trực tuyến mượt mà, đa luồng phát</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#2A2A2A]">
                        <div className="w-6 h-6 rounded-md bg-[#E6005A]/10 flex items-center justify-center text-[#E6005A]">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <span>Tích hợp Microsoft Copilot AI sáng tạo nội dung & phân tích</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#2A2A2A]">
                        <div className="w-6 h-6 rounded-md bg-[#6E2CF4]/10 flex items-center justify-center text-[#6E2CF4]">
                          <Share2 className="w-3.5 h-3.5" />
                        </div>
                        <span>Cá nhân hóa giao diện và tùy chọn phông chữ theo sở thích</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ========================================================
                  TRANG 2: WHO'S GOING TO USE VPLAY?
                 ======================================================== */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
                >
                  {/* Left Column: Windows 11 Avatar Graphic */}
                  <div className="md:col-span-5 flex items-center justify-center py-4">
                    <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center">
                      <div className="absolute top-4 left-6 sm:top-6 sm:left-8 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E5E3DF]" />
                      <div className="absolute top-3 right-5 sm:top-4 sm:right-6 w-28 h-28 sm:w-34 sm:h-34 rounded-full bg-[#E6E4DF] flex flex-col items-center justify-end overflow-hidden pb-0 shadow-sm">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#D7D5D0] mb-1.5" />
                        <div className="w-20 h-9 sm:w-24 sm:h-11 rounded-t-full bg-[#D7D5D0]" />
                      </div>
                      <div className="relative z-10 w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full bg-gradient-to-b from-[#0078D4] via-[#005FB8] to-[#55278D] shadow-[0_12px_32px_rgba(0,95,184,0.35)] flex flex-col items-center justify-end overflow-hidden pb-0 transition-transform duration-300 hover:scale-102">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded-full bg-white/25 mb-2 backdrop-blur-xs" />
                        <div className="w-24 h-12 sm:w-28 sm:h-13 md:w-30 md:h-14 rounded-t-full bg-white/25 backdrop-blur-xs" />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Name Input + Sign In Option */}
                  <div className="md:col-span-7 flex flex-col justify-center max-w-md w-full mx-auto md:mx-0">
                    <h1 className="text-2xl sm:text-3xl md:text-[32px] font-semibold text-[#1A1A1A] tracking-normal leading-tight font-sans">
                      Who&apos;s going to use Vplay?
                    </h1>

                    <p className="text-xs sm:text-sm text-[#5C5C5C] mt-2 mb-6 sm:mb-8 font-normal leading-relaxed font-sans">
                      You&apos;ll use this name to sign in to your device.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="oobe-username-input"
                          className="block text-xs sm:text-sm font-normal text-[#1A1A1A] font-sans mb-1.5"
                        >
                          Enter your name
                        </label>
                        <input
                          ref={inputRef}
                          id="oobe-username-input"
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          onKeyDown={handleNameKeyDown}
                          placeholder="Name"
                          autoComplete="off"
                          spellCheck="false"
                          className="w-full h-9 sm:h-10 px-3 bg-white text-sm text-[#1A1A1A] border border-[#CCCCCC] border-b-2 border-b-[#0067C0] rounded-[4px] focus:outline-none focus:border-b-2 focus:border-b-[#0067C0] transition-all font-sans placeholder-[#767676] shadow-2xs"
                        />
                      </div>

                      {/* Sign in to Vplay Account link / button */}
                      <div className="pt-2">
                        <button
                          id="btn-oobe-signin"
                          type="button"
                          onClick={() => setCurrentStep(2.1)}
                          className="inline-flex items-center gap-1.5 text-xs text-[#0067C0] hover:text-[#005FB8] hover:underline font-medium cursor-pointer transition-colors"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Sign in to Vplay Account</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ========================================================
                  TRANG 2.1: NOTICE WHEN SELECTING SIGN IN
                 ======================================================== */}
              {currentStep === 2.1 && (
                <motion.div
                  key="step-2-1"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
                >
                  <div className="md:col-span-5 flex items-center justify-center py-4">
                    <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-amber-500/10 border border-amber-500/20 flex flex-col items-center justify-center text-amber-600 shadow-inner">
                      <AlertCircle className="w-16 h-16 sm:w-20 sm:h-20 stroke-[1.5]" />
                    </div>
                  </div>

                  <div className="md:col-span-7 flex flex-col justify-center max-w-md w-full mx-auto md:mx-0">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-semibold w-fit mb-3">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Service Notice</span>
                    </div>

                    <h1 className="text-xl sm:text-2xl md:text-[28px] font-semibold text-[#1A1A1A] tracking-normal leading-tight font-sans">
                      Account Sign-In Unavailable
                    </h1>

                    {/* Exact requested text */}
                    <div className="mt-4 p-4 rounded-lg bg-[#F3F3F3] border border-[#E5E5E5] text-sm text-[#1A1A1A] font-medium leading-relaxed font-sans">
                      This feature is currently under construction or not available in your country/region. Please use a local account.
                    </div>

                    <p className="text-xs text-[#5C5C5C] mt-4 mb-6 leading-relaxed font-sans">
                      Don&apos;t worry! All channels, Copilot AI, and multimedia tools are fully unlocked in local mode with your custom name.
                    </p>

                    <div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="px-5 py-2 rounded-[4px] bg-[#0067C0] hover:bg-[#005FB8] text-white text-xs sm:text-sm font-medium transition-all cursor-pointer inline-flex items-center gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Use a local account instead</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ========================================================
                  TRANG 3: HOW DO YOU WANT TO USE VPLAY? (NAVIGATION STYLE)
                 ======================================================== */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col max-w-2xl mx-auto w-full"
                >
                  <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] tracking-normal leading-tight font-sans text-center mb-1">
                    How do you want to use Vplay?
                  </h1>
                  <p className="text-xs sm:text-sm text-[#5C5C5C] text-center mb-6 font-normal font-sans">
                    Choose your preferred navigation style. You can customize this anytime in Settings.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {/* Option 1: Sidebar */}
                    <button
                      type="button"
                      onClick={() => setNavStyle('sidebar')}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        navStyle === 'sidebar'
                          ? 'border-[#0067C0] bg-[#0067C0]/8 shadow-sm ring-2 ring-[#0067C0]/40'
                          : 'border-[#E0E0E0] bg-white hover:border-[#B0B0B0] hover:bg-black/2'
                      }`}
                    >
                      <div>
                        <div className="w-10 h-10 rounded-lg bg-[#0067C0]/10 flex items-center justify-center text-[#0067C0] mb-3">
                          <PanelLeft className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-semibold text-[#1A1A1A] font-sans">Sidebar</h3>
                        <p className="text-xs text-[#5C5C5C] mt-1 leading-relaxed font-sans">
                          Thanh điều hướng bên trái toàn diện, trực quan cho màn hình máy tính để bàn.
                        </p>
                      </div>
                      <span className="mt-4 text-[11px] font-semibold text-[#0067C0]">Thanh bên cổ điển</span>
                    </button>

                    {/* Option 2: Topbar */}
                    <button
                      type="button"
                      onClick={() => setNavStyle('topbar')}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        navStyle === 'topbar'
                          ? 'border-[#0067C0] bg-[#0067C0]/8 shadow-sm ring-2 ring-[#0067C0]/40'
                          : 'border-[#E0E0E0] bg-white hover:border-[#B0B0B0] hover:bg-black/2'
                      }`}
                    >
                      <div>
                        <div className="w-10 h-10 rounded-lg bg-[#0067C0]/10 flex items-center justify-center text-[#0067C0] mb-3">
                          <PanelTop className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-semibold text-[#1A1A1A] font-sans">Topbar</h3>
                        <p className="text-xs text-[#5C5C5C] mt-1 leading-relaxed font-sans">
                          Thanh tiêu đề phía trên tinh gọn, tối đa hóa không gian xem video và truyền hình.
                        </p>
                      </div>
                      <span className="mt-4 text-[11px] font-semibold text-[#0067C0]">Thanh trên hiện đại</span>
                    </button>

                    {/* Option 3: Floaty Bar */}
                    <button
                      type="button"
                      onClick={() => setNavStyle('floaty')}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        navStyle === 'floaty'
                          ? 'border-[#0067C0] bg-[#0067C0]/8 shadow-sm ring-2 ring-[#0067C0]/40'
                          : 'border-[#E0E0E0] bg-white hover:border-[#B0B0B0] hover:bg-black/2'
                      }`}
                    >
                      <div>
                        <div className="w-10 h-10 rounded-lg bg-[#0067C0]/10 flex items-center justify-center text-[#0067C0] mb-3">
                          <Compass className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-semibold text-[#1A1A1A] font-sans">Floaty Bar</h3>
                        <p className="text-xs text-[#5C5C5C] mt-1 leading-relaxed font-sans">
                          Thanh điều hướng lơ lửng tối giản ở đáy màn hình với phân trang tab linh hoạt.
                        </p>
                      </div>
                      <span className="mt-4 text-[11px] font-semibold text-[#0067C0]">Lơ lửng tối giản</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ========================================================
                  TRANG 4: CHOOSE A FONT TO DISPLAY ON THE WEB
                 ======================================================== */}
              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col max-w-2xl mx-auto w-full"
                >
                  <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] tracking-normal leading-tight font-sans text-center mb-1">
                    Choose a font to display on the web
                  </h1>
                  <p className="text-xs sm:text-sm text-[#5C5C5C] text-center mb-6 font-normal font-sans">
                    Chọn phông chữ hiển thị phù hợp nhất với tầm nhìn và phong cách của bạn.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Alata */}
                    <button
                      type="button"
                      onClick={() => setFontFamily('alata')}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        fontFamily === 'alata'
                          ? 'border-[#0067C0] bg-[#0067C0]/8 ring-2 ring-[#0067C0]/40'
                          : 'border-[#E0E0E0] bg-white hover:border-[#B0B0B0]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#1A1A1A]">Alata</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#0067C0]/10 text-[#0067C0]">
                          Mặc định Vplay
                        </span>
                      </div>
                      <p className="text-xs text-[#5C5C5C] mt-1 font-sans">
                        Hình học độc đáo, dứt khoát và phong cách điện ảnh
                      </p>
                      <div className="mt-3 p-2 rounded bg-black/3 text-xs text-[#2A2A2A] font-['Alata']">
                        Vplay 26.9 - Trải nghiệm truyền hình tương lai
                      </div>
                    </button>

                    {/* Integer (Inter) */}
                    <button
                      type="button"
                      onClick={() => setFontFamily('integer')}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        fontFamily === 'integer'
                          ? 'border-[#0067C0] bg-[#0067C0]/8 ring-2 ring-[#0067C0]/40'
                          : 'border-[#E0E0E0] bg-white hover:border-[#B0B0B0]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#1A1A1A]">Integer (Inter)</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/5 text-[#5C5C5C]">
                          Số học sắc nét
                        </span>
                      </div>
                      <p className="text-xs text-[#5C5C5C] mt-1 font-sans">
                        Chuẩn giao diện ứng dụng số, hiển thị chi tiết rõ ràng
                      </p>
                      <div className="mt-3 p-2 rounded bg-black/3 text-xs text-[#2A2A2A] font-['Inter']">
                        Vplay 26.9 - Trải nghiệm truyền hình tương lai
                      </div>
                    </button>

                    {/* Google Sans */}
                    <button
                      type="button"
                      onClick={() => setFontFamily('google-sans')}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        fontFamily === 'google-sans'
                          ? 'border-[#0067C0] bg-[#0067C0]/8 ring-2 ring-[#0067C0]/40'
                          : 'border-[#E0E0E0] bg-white hover:border-[#B0B0B0]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#1A1A1A]">Google Sans</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/5 text-[#5C5C5C]">
                          Thân thiện
                        </span>
                      </div>
                      <p className="text-xs text-[#5C5C5C] mt-1 font-sans">
                        Đường nét mềm mại, thân thiện phong cách Google Material
                      </p>
                      <div className="mt-3 p-2 rounded bg-black/3 text-xs text-[#2A2A2A] font-['Google_Sans']">
                        Vplay 26.9 - Trải nghiệm truyền hình tương lai
                      </div>
                    </button>

                    {/* Montserrat */}
                    <button
                      type="button"
                      onClick={() => setFontFamily('montserrat')}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        fontFamily === 'montserrat'
                          ? 'border-[#0067C0] bg-[#0067C0]/8 ring-2 ring-[#0067C0]/40'
                          : 'border-[#E0E0E0] bg-white hover:border-[#B0B0B0]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#1A1A1A]">Montserrat</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/5 text-[#5C5C5C]">
                          Thanh lịch
                        </span>
                      </div>
                      <p className="text-xs text-[#5C5C5C] mt-1 font-sans">
                        Cân đối, thanh lịch, độ nét cao cho các tựa đề nổi bật
                      </p>
                      <div className="mt-3 p-2 rounded bg-black/3 text-xs text-[#2A2A2A] font-['Montserrat']">
                        Vplay 26.9 - Trải nghiệm truyền hình tương lai
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ========================================================
                  TRANG 5: NEW! - COPILOT IS NOW ON VPLAY!
                 ======================================================== */}
              {currentStep === 5 && (
                <motion.div
                  key="step-5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
                >
                  {/* Left Column: Copilot Ribbon & Glow */}
                  <div className="md:col-span-5 flex items-center justify-center py-4">
                    <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#0078D4]/30 via-[#8764B8]/30 to-[#F7630C]/30 blur-2xl animate-pulse" />
                      <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full bg-white/80 shadow-2xl border border-black/5 flex items-center justify-center p-6 backdrop-blur-md">
                        <img
                          src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
                          alt="Microsoft Copilot"
                          referrerPolicy="no-referrer"
                          className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-md"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Copilot Pitch */}
                  <div className="md:col-span-7 flex flex-col justify-center max-w-md w-full mx-auto md:mx-0">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#0078D4]/15 to-[#8764B8]/15 border border-[#0078D4]/20 text-[#0078D4] text-xs font-semibold w-fit mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#E6005A]" />
                      <span>Thông báo tính năng mới</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] tracking-normal leading-tight font-sans">
                      New! - Copilot is now on Vplay!
                    </h1>

                    <p className="text-xs sm:text-sm text-[#5C5C5C] mt-2 mb-6 font-normal leading-relaxed font-sans">
                      Trợ lý AI thông minh sẵn sàng đồng hành cùng bạn để tra cứu lịch phát sóng, tóm tắt tin tức và sáng tạo nội dung tức thì.
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-xs text-[#2A2A2A]">
                        <div className="w-5 h-5 rounded-full bg-[#0078D4]/15 text-[#0078D4] flex items-center justify-center shrink-0 mt-0.5">
                          ✓
                        </div>
                        <span>Tra cứu kênh truyền hình, giải đấu thể thao và chương trình nổi bật</span>
                      </div>
                      <div className="flex items-start gap-3 text-xs text-[#2A2A2A]">
                        <div className="w-5 h-5 rounded-full bg-[#8764B8]/15 text-[#8764B8] flex items-center justify-center shrink-0 mt-0.5">
                          ✓
                        </div>
                        <span>Hỏi đáp thông tin nhanh chóng ngay khi đang theo dõi buổi phát trực tiếp</span>
                      </div>
                      <div className="flex items-start gap-3 text-xs text-[#2A2A2A]">
                        <div className="w-5 h-5 rounded-full bg-[#F7630C]/15 text-[#F7630C] flex items-center justify-center shrink-0 mt-0.5">
                          ✓
                        </div>
                        <span>Sáng tác lời bài hát, tạo ảnh bìa và gợi ý danh sách xem theo tâm trạng</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ========================================================
                  TRANG 5.1: KHÁM PHÁ V-SHOP & TÍCH LŨY ORBS
                 ======================================================== */}
              {currentStep === 5.1 && (
                <motion.div
                  key="step-5-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
                >
                  {/* Left Graphic: Shopping & Orbs */}
                  <div className="md:col-span-5 flex items-center justify-center py-4">
                    <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF4C93]/25 via-[#FFA800]/25 to-[#FF3366]/30 blur-2xl animate-pulse" />
                      <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-3xl bg-gradient-to-br from-[#201018] via-[#1A121E] to-[#120E15] shadow-2xl border border-[#FF4C93]/30 flex flex-col items-center justify-center p-5 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF4C93] to-[#FF8008] flex items-center justify-center shadow-lg shadow-[#FF4C93]/40 mb-3">
                          <ShoppingBag className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
                          <Coins className="w-4 h-4 text-yellow-400" />
                          <span>10.000₫ = 10 Orbs</span>
                        </div>
                        <span className="text-white/60 text-[11px] mt-1 font-medium">V-Shop Official</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: V-Shop Details */}
                  <div className="md:col-span-7 flex flex-col justify-center max-w-md w-full mx-auto md:mx-0">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF4C93]/15 border border-[#FF4C93]/30 text-[#FF4C93] text-xs font-semibold w-fit mb-2">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>V-Shop • Cửa Hàng Tiện Ích</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] tracking-tight leading-tight font-sans">
                      Mua sắm tiện lợi & Tích lũy Orbs
                    </h1>

                    <p className="text-xs sm:text-sm text-[#5C5C5C] mt-2 mb-4 font-normal leading-relaxed font-sans">
                      Trải nghiệm trung tâm mua sắm V-Shop tích hợp sẵn trên nền tảng Vplay với 3 danh mục tuyển chọn: Thực phẩm, Đồ công nghệ - Điện tử và Đồ gia dụng.
                    </p>

                    <div className="space-y-2.5 mb-4">
                      <div className="flex items-start gap-2.5 text-xs text-[#2A2A2A]">
                        <Package className="w-4 h-4 text-[#FF4C93] shrink-0 mt-0.5" />
                        <span>Sản phẩm phong phú, cam kết chất lượng và giao hàng tận nơi.</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs text-[#2A2A2A]">
                        <Coins className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                        <span>Quy đổi Orbs thông minh: <strong className="text-yellow-600 font-bold">10.000 VNĐ = 10 ORBS</strong> cộng thưởng và trừ tương ứng khi thanh toán.</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[11px] leading-relaxed">
                      <strong>Lưu ý:</strong> Bạn vẫn thanh toán tiền mặt hoặc chuyển khoản khi đặt mua/nhận hàng, và số Orbs của bạn vẫn sẽ bị trừ đúng với giá trị tiền thật.
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ========================================================
                  TRANG 5.2: VŨ TRỤ TIỆN ÍCH SPACE 360
                 ======================================================== */}
              {currentStep === 5.2 && (
                <motion.div
                  key="step-5-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
                >
                  {/* Left Graphic: Space360 Apps Mosaic */}
                  <div className="md:col-span-5 flex items-center justify-center py-4">
                    <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00D2FF]/25 via-[#6E2CF4]/30 to-[#E6005A]/25 blur-2xl animate-pulse" />
                      <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-3xl bg-[#12111A] shadow-2xl border border-white/15 p-4 flex flex-col justify-between">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-xs font-bold">
                            📖
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-xs font-bold">
                            📝
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-xs font-bold">
                            ⏰
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-xs font-bold">
                            🌍
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-xs font-bold">
                            🎮
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-xs font-bold">
                            🧮
                          </div>
                        </div>
                        <div className="text-center pt-2 border-t border-white/10">
                          <div className="text-xs font-black text-white tracking-wide">SPACE 360</div>
                          <div className="text-[10px] text-cyan-400 font-semibold">24+ Apps • Cookbook Inside</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Space360 Details */}
                  <div className="md:col-span-7 flex flex-col justify-center max-w-md w-full mx-auto md:mx-0">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-700 text-xs font-semibold w-fit mb-2">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Space 360 • Cổng Không Gian Đa Tiện Ích</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] tracking-tight leading-tight font-sans">
                      Không gian làm việc & giải trí 360°
                    </h1>

                    <p className="text-xs sm:text-sm text-[#5C5C5C] mt-2 mb-4 font-normal leading-relaxed font-sans">
                      Truy cập nhanh vào hệ sinh thái hơn 24 ứng dụng độc lập ngay trong menu <strong className="text-black font-semibold">App</strong> trên thanh điều hướng với biểu tượng monochrome đồng bộ.
                    </p>

                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2.5 text-xs text-[#2A2A2A]">
                        <div className="w-5 h-5 rounded-full bg-cyan-500/15 text-cyan-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          ✓
                        </div>
                        <span><strong>Cookbook:</strong> Khám phá công thức nấu ăn 3 miền với hướng dẫn chi tiết từng bước.</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs text-[#2A2A2A]">
                        <div className="w-5 h-5 rounded-full bg-cyan-500/15 text-cyan-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          ✓
                        </div>
                        <span><strong>Bộ công cụ văn phòng:</strong> Notes, Clock, Calculator, Reminders, Files, Browser, Calendar.</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs text-[#2A2A2A]">
                        <div className="w-5 h-5 rounded-full bg-cyan-500/15 text-cyan-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          ✓
                        </div>
                        <span><strong>Khám phá không gian & minigame:</strong> Bản đồ Maps 360°, rương đồ Minecraft và kho Arcade phong phú.</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ========================================================
                  TRANG 6: READ AND ACCEPT OUR TERMS AND CONDITIONS
                 ======================================================== */}
              {currentStep === 6 && (
                <motion.div
                  key="step-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col max-w-2xl mx-auto w-full"
                >
                  <div className="flex items-center gap-2 mb-1 justify-center">
                    <ShieldCheck className="w-5 h-5 text-[#0067C0]" />
                    <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] tracking-normal leading-tight font-sans">
                      Read and accept our Terms and Conditions
                    </h1>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5C5C5C] text-center mb-4 font-normal font-sans">
                    Vui lòng đọc và chấp nhận các điều khoản dịch vụ và chính sách sử dụng nền tảng Vplay.
                  </p>

                  {/* Scrollable Terms Box */}
                  <div className="max-h-52 sm:max-h-56 bg-white border border-[#CCCCCC] rounded-lg p-4 text-xs text-[#333333] leading-relaxed overflow-y-auto space-y-3 font-sans shadow-inner">
                    <div>
                      <strong className="text-black font-semibold">1. Điều khoản sử dụng chung:</strong> Vplay cung cấp các tiện ích phát trực tuyến truyền hình, nội dung giải trí và công cụ trí tuệ nhân tạo. Bằng việc truy cập hoặc sử dụng ứng dụng, bạn đồng ý tuân thủ các quy định hiện hành về quyền sở hữu trí tuệ và an toàn số.
                    </div>
                    <div>
                      <strong className="text-black font-semibold">2. Quyền riêng tư & Lưu trữ cục bộ:</strong> Tất cả các cấu hình cá nhân hóa (tên người dùng, phông chữ, chế độ điều hướng) được lưu trữ an toàn trong trình duyệt của bạn (Local Storage) và không bị thu thập nhằm mục đích thương mại trái phép.
                    </div>
                    <div>
                      <strong className="text-black font-semibold">3. Bản quyền nội dung đa phương tiện:</strong> Các kênh truyền hình, luồng video HLS và đài phát thanh thuộc bản quyền hợp pháp của các đài truyền hình và nhà phát hành nội dung tương ứng. Vplay đóng vai trò cổng hiển thị và trình phát số.
                    </div>
                    <div>
                      <strong className="text-black font-semibold">4. Dịch vụ AI & Trợ lý Copilot:</strong> Nội dung do Copilot AI tạo ra mang tính chất hỗ trợ và tham khảo. Người dùng cam kết không sử dụng AI cho các mục đích vi phạm pháp luật hoặc phát tán thông tin sai lệch.
                    </div>
                  </div>

                  {/* Acceptance Checkbox */}
                  <label className="flex items-center gap-3 mt-4 text-xs sm:text-sm text-[#1A1A1A] cursor-pointer font-sans select-none">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-4 h-4 text-[#0067C0] rounded border-gray-300 focus:ring-[#0067C0] cursor-pointer accent-[#0067C0]"
                    />
                    <span>Tôi đã đọc và đồng ý với Điều khoản dịch vụ & Chính sách của Vplay</span>
                  </label>
                </motion.div>
              )}

              {/* ========================================================
                  TRANG 7: YOU'RE GOOD TO GO - WELCOME TO VPLAY!
                 ======================================================== */}
              {currentStep === 7 && (
                <motion.div
                  key="step-7"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center justify-center text-center max-w-xl mx-auto py-2"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0067C0]/10 text-[#0067C0] flex items-center justify-center mb-4 shadow-inner">
                    <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2]" />
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1A1A1A] tracking-tight leading-tight font-sans">
                    You&apos;re good to go - Welcome to Vplay!
                  </h1>

                  <p className="text-xs sm:text-sm text-[#5C5C5C] mt-2 mb-6 font-normal font-sans max-w-md">
                    Thiết lập ban đầu đã hoàn tất. Dưới đây là thông tin trải nghiệm cá nhân hóa của bạn:
                  </p>

                  <div className="w-full max-w-md bg-white border border-[#E0E0E0] rounded-xl p-4 text-left shadow-xs space-y-2.5 mb-2 font-sans text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-black/5">
                      <span className="text-[#5C5C5C]">Tên người dùng:</span>
                      <span className="font-semibold text-[#1A1A1A]">{userName.trim() || 'User'}</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-black/5">
                      <span className="text-[#5C5C5C]">Kiểu điều hướng:</span>
                      <span className="font-semibold text-[#0067C0] uppercase">
                        {navStyle === 'floaty' ? 'Floaty Bar' : navStyle === 'sidebar' ? 'Sidebar' : 'Topbar'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-black/5">
                      <span className="text-[#5C5C5C]">Phông chữ hiển thị:</span>
                      <span className="font-semibold text-[#1A1A1A] capitalize">{fontFamily}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#5C5C5C]">Trợ lý Copilot AI:</span>
                      <span className="font-semibold text-emerald-600">Sẵn sàng sử dụng</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BOTTOM BAR: NAVIGATION BUTTONS (BACK & NEXT) */}
          <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-black/5 mt-auto">
            {/* Left Action: Back Button or Brand info */}
            <div>
              {currentStep === 1 ? (
                <div className="flex items-center gap-2 text-xs text-[#707070]">
                  <Sparkles className="w-3.5 h-3.5 text-[#0067C0]" />
                  <span className="hidden sm:inline font-sans">Vplay Experience Setup</span>
                </div>
              ) : currentStep === 2.1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-1.5 rounded-[4px] border border-[#CCCCCC] bg-white hover:bg-[#F3F3F3] text-xs sm:text-sm font-medium text-[#1A1A1A] transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === 7) setCurrentStep(6);
                    else if (currentStep === 6) setCurrentStep(5.2);
                    else if (currentStep === 5.2) setCurrentStep(5.1);
                    else if (currentStep === 5.1) setCurrentStep(5);
                    else if (currentStep === 5) setCurrentStep(4);
                    else if (currentStep === 4) setCurrentStep(3);
                    else if (currentStep === 3) setCurrentStep(2);
                    else if (currentStep === 2) setCurrentStep(1);
                  }}
                  className="px-4 py-1.5 rounded-[4px] border border-[#CCCCCC] bg-white hover:bg-[#F3F3F3] text-xs sm:text-sm font-medium text-[#1A1A1A] transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}
            </div>

            {/* Right Action: Next / Get Started */}
            <div>
              {currentStep === 1 && (
                <button
                  id="btn-oobe-step1-next"
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-8 sm:px-10 py-1.5 sm:py-2 rounded-[4px] bg-[#0067C0] hover:bg-[#005FB8] active:bg-[#0054A4] text-white text-xs sm:text-sm font-medium shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === 2 && (
                <button
                  id="btn-oobe-step2-next"
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-8 sm:px-10 py-1.5 sm:py-2 rounded-[4px] bg-[#0067C0] hover:bg-[#005FB8] active:bg-[#0054A4] text-white text-xs sm:text-sm font-medium shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === 2.1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 sm:px-8 py-1.5 sm:py-2 rounded-[4px] bg-[#0067C0] hover:bg-[#005FB8] text-white text-xs sm:text-sm font-medium transition-all cursor-pointer"
                >
                  <span>Back to Name</span>
                </button>
              )}

              {currentStep === 3 && (
                <button
                  id="btn-oobe-step3-next"
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-8 sm:px-10 py-1.5 sm:py-2 rounded-[4px] bg-[#0067C0] hover:bg-[#005FB8] active:bg-[#0054A4] text-white text-xs sm:text-sm font-medium shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === 4 && (
                <button
                  id="btn-oobe-step4-next"
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="px-8 sm:px-10 py-1.5 sm:py-2 rounded-[4px] bg-[#0067C0] hover:bg-[#005FB8] active:bg-[#0054A4] text-white text-xs sm:text-sm font-medium shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === 5 && (
                <button
                  id="btn-oobe-step5-next"
                  type="button"
                  onClick={() => setCurrentStep(5.1)}
                  className="px-8 sm:px-10 py-1.5 sm:py-2 rounded-[4px] bg-[#0067C0] hover:bg-[#005FB8] active:bg-[#0054A4] text-white text-xs sm:text-sm font-medium shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === 5.1 && (
                <button
                  id="btn-oobe-step5-1-next"
                  type="button"
                  onClick={() => setCurrentStep(5.2)}
                  className="px-8 sm:px-10 py-1.5 sm:py-2 rounded-[4px] bg-[#0067C0] hover:bg-[#005FB8] active:bg-[#0054A4] text-white text-xs sm:text-sm font-medium shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === 5.2 && (
                <button
                  id="btn-oobe-step5-2-next"
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="px-8 sm:px-10 py-1.5 sm:py-2 rounded-[4px] bg-[#0067C0] hover:bg-[#005FB8] active:bg-[#0054A4] text-white text-xs sm:text-sm font-medium shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === 6 && (
                <button
                  id="btn-oobe-step6-accept"
                  type="button"
                  disabled={!termsAccepted}
                  onClick={() => setCurrentStep(7)}
                  className="px-8 sm:px-10 py-1.5 sm:py-2 rounded-[4px] bg-[#0067C0] hover:bg-[#005FB8] active:bg-[#0054A4] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-medium shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Accept</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === 7 && (
                <button
                  id="btn-oobe-step7-finish"
                  type="button"
                  onClick={handleFinish}
                  disabled={isSubmitting}
                  className="px-8 sm:px-12 py-1.5 sm:py-2 rounded-[4px] bg-[#0067C0] hover:bg-[#005FB8] active:bg-[#0054A4] disabled:opacity-50 text-white text-xs sm:text-sm font-medium shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
