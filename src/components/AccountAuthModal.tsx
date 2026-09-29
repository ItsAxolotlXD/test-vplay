import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  LogIn,
  UserPlus,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  LogOut,
  Award,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tv,
  ArrowRight,
  Globe,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { playPopSound } from '../utils/sound';

interface AccountAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountAuthModal: React.FC<AccountAuthModalProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, signIn, signUp, signInAsGuest, signOutUser, isLoading } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg('Vui lòng nhập địa chỉ email hoặc tên người dùng');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setErrorMsg('Mật khẩu phải chứa ít nhất 6 ký tự');
      return;
    }

    playPopSound();
    setIsSubmitting(true);
    try {
      if (mode === 'signin') {
        const res = await signIn(email, password);
        if (!res.success && res.error) {
          setErrorMsg(res.error);
        } else {
          onClose();
        }
      } else {
        const res = await signUp(email, password, displayName);
        if (!res.success && res.error) {
          setErrorMsg(res.error);
        } else {
          onClose();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    playPopSound();
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await signInAsGuest();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (type: 'vip' | 'standard') => {
    playPopSound();
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      if (type === 'vip') {
        await signIn('vip.member@vnrt.vn', 'password123');
      } else {
        await signIn('user.standard@vnrt.vn', 'password123');
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        id="vplay-account-auth-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 md:p-10 pt-16 sm:pt-20 select-none overflow-hidden bg-gradient-to-br from-[#CBD9EA] via-[#DEE7F2] to-[#CBD5E6]"
        onClick={onClose}
      >
        {/* Soft Ambient Windows 11 Bloom / Light Orbs matching OOBE */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-300/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-300/30 blur-3xl pointer-events-none" />

        {/* Windows 11 OOBE Main Card Window */}
        <motion.div
          id="vplay-account-auth-card"
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[940px] min-h-[530px] sm:min-h-[560px] md:min-h-[580px] bg-[#FDFDFE]/98 rounded-[16px] sm:rounded-[20px] shadow-[0_24px_70px_rgba(0,0,0,0.22),0_4px_16px_rgba(0,0,0,0.06)] border border-black/10 flex flex-col justify-between p-6 sm:p-10 md:p-12 overflow-hidden backdrop-blur-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle Top Close Button matching OOBE */}
          <button
            id="btn-auth-close"
            type="button"
            onClick={onClose}
            title="Đóng cửa sổ đăng nhập"
            aria-label="Đóng cửa sổ đăng nhập"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 rounded-full flex items-center justify-center text-[#707070] hover:text-[#1A1A1A] hover:bg-black/5 active:scale-95 transition-all cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Submitting "Just a moment..." Windows 11 Overlay matching OOBE */}
          {isSubmitting && (
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
          )}

          {/* MAIN OOBE 2-COLUMN GRID */}
          <div className="flex-1 flex flex-col justify-center my-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
              
              {/* LEFT COLUMN: Windows 11 Avatar Graphic & Features */}
              <div className="md:col-span-5 flex items-center justify-center py-2">
                <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#0067C0]/20 via-[#6E2CF4]/20 to-[#E6005A]/20 blur-2xl animate-pulse" />
                  
                  {/* Windows 11 Style Floating Avatar Card */}
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-3xl bg-gradient-to-br from-[#121118] via-[#1A1826] to-[#0A0910] shadow-[0_16px_40px_rgba(0,0,0,0.3)] border border-white/20 flex flex-col items-center justify-center p-5 text-center text-white">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0067C0] via-[#0080FF] to-[#388BFD] flex items-center justify-center shadow-lg shadow-[#0067C0]/40 mb-3">
                      {isAuthenticated && user ? (
                        <span className="text-2xl font-black">{user.displayName.charAt(0).toUpperCase()}</span>
                      ) : (
                        <User className="w-8 h-8 text-white stroke-[2]" />
                      )}
                    </div>
                    <span className="text-white font-black text-lg tracking-wider">VNRT ID</span>
                    <span className="text-white/60 text-[11px] mt-0.5 font-medium">Cloud Account</span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Windows 11 OOBE Content & Form */}
              <div className="md:col-span-7 flex flex-col justify-center max-w-md w-full mx-auto md:mx-0">
                <span className="text-xs font-semibold text-[#0067C0] uppercase tracking-wider mb-1 font-sans">
                  VNRT Online Account
                </span>

                {isAuthenticated && user ? (
                  /* ALREADY LOGGED IN VIEW */
                  <div className="space-y-4 font-sans">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] tracking-tight leading-tight font-sans">
                      Chào mừng trở lại!
                    </h1>
                    <p className="text-xs sm:text-sm text-[#5C5C5C] font-normal leading-relaxed font-sans">
                      Tài khoản của bạn đã được kết nối an toàn với VNRT Online Cloud.
                    </p>

                    <div className="p-4 rounded-xl bg-black/[0.03] border border-black/10 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0067C0] text-white flex items-center justify-center text-lg font-bold shadow-sm">
                        {user.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#1A1A1A] truncate">{user.displayName}</h4>
                          {user.isVIP ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-700 border border-amber-500/30 flex items-center gap-1">
                              <Award className="w-3 h-3" /> VIP
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-700">
                              Member
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#5C5C5C] truncate">{user.email || 'guest@vnrt.vn'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={signOutUser}
                        disabled={isLoading}
                        className="flex-1 py-2 px-4 rounded-[6px] border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-600 font-sans font-medium text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng xuất</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          signOutUser();
                          setMode('signin');
                        }}
                        className="flex-1 py-2 px-4 rounded-[6px] border border-black/15 bg-black/[0.04] hover:bg-black/[0.08] text-[#1A1A1A] font-sans font-medium text-xs transition-all cursor-pointer"
                      >
                        Đổi tài khoản
                      </button>
                    </div>
                  </div>
                ) : (
                  /* SIGN IN / SIGN UP OOBE FORM */
                  <div className="space-y-4 font-sans">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] tracking-tight leading-tight font-sans">
                      {mode === 'signin' ? 'Đăng nhập vào tài khoản' : 'Tạo tài khoản VNRT mới'}
                    </h1>
                    <p className="text-xs sm:text-sm text-[#5C5C5C] font-normal leading-relaxed font-sans">
                      {mode === 'signin'
                        ? 'Đăng nhập để đồng bộ danh sách kênh, cài đặt giao diện và các tiện ích Space 360.'
                        : 'Tham gia cộng đồng VNRT Online để trải nghiệm xem truyền hình tương tác thế hệ mới.'}
                    </p>

                    {/* Mode Switcher Tabs */}
                    <div className="flex items-center p-1 rounded-lg bg-black/[0.05] border border-black/10 w-fit">
                      <button
                        type="button"
                        onClick={() => {
                          playPopSound();
                          setMode('signin');
                          setErrorMsg(null);
                        }}
                        className={`px-4 py-1.5 text-xs font-medium rounded-[5px] transition-all cursor-pointer ${
                          mode === 'signin'
                            ? 'bg-white text-[#1A1A1A] shadow-sm font-semibold'
                            : 'text-[#5C5C5C] hover:text-[#1A1A1A]'
                        }`}
                      >
                        Đăng nhập
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          playPopSound();
                          setMode('signup');
                          setErrorMsg(null);
                        }}
                        className={`px-4 py-1.5 text-xs font-medium rounded-[5px] transition-all cursor-pointer ${
                          mode === 'signup'
                            ? 'bg-white text-[#1A1A1A] shadow-sm font-semibold'
                            : 'text-[#5C5C5C] hover:text-[#1A1A1A]'
                        }`}
                      >
                        Tạo tài khoản
                      </button>
                    </div>

                    {errorMsg && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                      {mode === 'signup' && (
                        <div>
                          <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Họ và tên hiển thị</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707070]" />
                            <input
                              type="text"
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              placeholder="Ví dụ: Nguyễn Văn A"
                              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-[6px] bg-white border border-black/20 focus:border-[#0067C0] focus:ring-1 focus:ring-[#0067C0] outline-none text-[#1A1A1A] transition-all font-sans"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                          Email hoặc Tên tài khoản
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707070]" />
                          <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            autoComplete="username"
                            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-[6px] bg-white border border-black/20 focus:border-[#0067C0] focus:ring-1 focus:ring-[#0067C0] outline-none text-[#1A1A1A] transition-all font-sans"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Mật khẩu</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707070]" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ít nhất 6 ký tự"
                            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                            className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm rounded-[6px] bg-white border border-black/20 focus:border-[#0067C0] focus:ring-1 focus:ring-[#0067C0] outline-none text-[#1A1A1A] transition-all font-sans"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707070] hover:text-[#1A1A1A]"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-[#5C5C5C]">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="rounded border-black/20 text-[#0067C0] focus:ring-[#0067C0]"
                          />
                          <span>Ghi nhớ phiên</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleGuestLogin}
                          className="text-[#0067C0] hover:underline font-medium"
                        >
                          Khách vãng lai
                        </button>
                      </div>

                      {/* Quick demo member pills */}
                      <div className="pt-2 flex items-center gap-2">
                        <span className="text-[11px] text-[#707070]">Thử nghiệm:</span>
                        <button
                          type="button"
                          onClick={() => handleQuickDemoLogin('vip')}
                          className="px-2.5 py-1 rounded-[5px] bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-700 text-[11px] font-semibold transition-all cursor-pointer"
                        >
                          VIP Demo
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickDemoLogin('standard')}
                          className="px-2.5 py-1 rounded-[5px] bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-[#0067C0] text-[11px] font-semibold transition-all cursor-pointer"
                        >
                          Member Demo
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BOTTOM WINDOWS 11 ACTION BAR */}
          <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between shrink-0 font-sans">
            <div className="flex items-center gap-2 text-xs text-[#5C5C5C]">
              <ShieldCheck className="w-4 h-4 text-[#0067C0]" />
              <span className="hidden sm:inline">Bảo mật Firebase Auth • VNRT Online System</span>
              <span className="sm:hidden">Firebase Auth</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-[4px] sm:rounded-[6px] border border-black/15 bg-black/[0.03] hover:bg-black/[0.08] active:bg-black/[0.12] text-[#1A1A1A] font-sans font-medium text-xs sm:text-sm transition-all cursor-pointer"
              >
                Đóng
              </button>

              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-7 py-2 rounded-[4px] sm:rounded-[6px] bg-[#0067C0] hover:bg-[#005DA6] active:bg-[#005294] text-white font-sans font-medium text-xs sm:text-sm shadow-[0_2px_4px_rgba(0,103,192,0.3)] transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>{mode === 'signin' ? 'Đăng nhập' : 'Tiếp tục'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AccountAuthModal;
