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
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
        transition={{ duration: 0.28 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 md:p-10 select-none overflow-hidden bg-black/10 backdrop-blur-md"
        onClick={onClose}
      >
        {/* Soft Ambient Light Orbs with reduced intensity */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        {/* Flyout Window Card (OOBE-style smooth glass rounded card) */}
        <motion.div
          id="vplay-account-auth-card"
          initial={{ scale: 0.94, opacity: 0, y: 14 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 14 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[840px] min-h-[480px] sm:min-h-[520px] bg-[#FFFFFF]/98 dark:bg-[#181820]/98 text-slate-800 dark:text-zinc-100 rounded-[20px] sm:rounded-[24px] shadow-[0_24px_70px_rgba(0,0,0,0.25),0_4px_16px_rgba(0,0,0,0.06)] border border-black/10 dark:border-white/10 flex flex-col justify-between p-6 sm:p-9 md:p-10 overflow-hidden backdrop-blur-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle Top Badge */}
          <div className="flex items-center justify-between pb-4 border-b border-black/8 dark:border-white/8 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#0067C0] text-white flex items-center justify-center shadow-sm">
                <LogIn className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                  <span>VNRT Online Account</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    Spatial Cloud
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Đăng nhập để đồng bộ kênh yêu thích, lịch xem và tiện ích Space 360
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              id="btn-close-auth-modal"
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              title="Đóng cửa sổ"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Card Content */}
          <div className="flex-1 py-5 flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
            
            {/* LEFT COLUMN: Visual Brand Illustration & Features */}
            <div className="w-full md:w-[320px] shrink-0 flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent border border-blue-500/15">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md text-white">
                    <Tv className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">VNRT Portal</h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Hệ sinh thái truyền hình</p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 text-xs text-slate-600 dark:text-zinc-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Lưu danh sách kênh trực tiếp yêu thích không giới hạn</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Tích lũy khoáng vật Orbs và đổi vé VIP VTVgo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Đồng bộ ghi chú V-Notes và ứng dụng Space 360</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Trải nghiệm bảo mật và mã hóa đa nền tảng</span>
                  </div>
                </div>
              </div>

              {/* Quick Demo Pill */}
              <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                  Thử nghiệm nhanh:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('vip')}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-[11px] font-bold transition-all text-center cursor-pointer"
                  >
                    VIP Member
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('standard')}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-[11px] font-bold transition-all text-center cursor-pointer"
                  >
                    User Thường
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Auth Form or Logged-in Profile */}
            <div className="flex-1 flex flex-col justify-center">
              {isAuthenticated && user ? (
                /* LOGGED IN VIEW */
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/8 dark:border-white/8 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#388BFD] to-[#E6005A] text-white flex items-center justify-center text-xl font-bold shadow-md shrink-0">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
                          {user.displayName}
                        </h4>
                        {user.isVIP ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Award className="w-3 h-3" /> VIP
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-500/15 text-slate-600 dark:text-zinc-400">
                            Member
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                        {user.email || 'guest@vnrt.vn'}
                      </p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Đang hoạt động trên hệ thống
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={signOutUser}
                      disabled={isLoading}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        signOutUser();
                        setMode('signin');
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-slate-700 dark:text-zinc-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>Đổi tài khoản</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* AUTH FORM (SIGN IN / SIGN UP) */
                <div className="space-y-4">
                  {/* Mode Switcher Tabs */}
                  <div className="flex items-center p-1 rounded-xl bg-black/5 dark:bg-white/10 w-full max-w-[260px]">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setErrorMsg(null);
                      }}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        mode === 'signin'
                          ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      Đăng nhập
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setErrorMsg(null);
                      }}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        mode === 'signup'
                          ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      Đăng ký
                    </button>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-3">
                    {mode === 'signup' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                          Họ và tên hiển thị
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Ví dụ: Nguyễn Văn A"
                            className="w-full pl-9.5 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-black/[0.04] dark:bg-white/[0.07] border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                        Email hoặc Tên tài khoản
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          autoComplete="username"
                          className="w-full pl-9.5 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-black/[0.04] dark:bg-white/[0.07] border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                        Mật khẩu
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Ít nhất 6 ký tự"
                          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                          className="w-full pl-9.5 pr-10 py-2 text-xs sm:text-sm rounded-xl bg-black/[0.04] dark:bg-white/[0.07] border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-zinc-300">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Ghi nhớ đăng nhập</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleGuestLogin}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                      >
                        Đăng nhập Khách
                      </button>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#0067C0] hover:bg-[#005ba8] active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <LogIn className="w-4 h-4 stroke-[2.2]" />
                        )}
                        <span>{mode === 'signin' ? 'Đăng nhập ngay' : 'Tạo tài khoản'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

          </div>

          {/* Bottom Footer Information */}
          <div className="pt-3 border-t border-black/8 dark:border-white/8 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 shrink-0">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              Bảo mật tài khoản bởi Firebase Authentication
            </span>
            <span>VNRT Online Platform</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AccountAuthModal;
