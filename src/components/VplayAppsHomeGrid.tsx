import React, { useMemo } from 'react';
import { 
  Compass, 
  ExternalLink
} from 'lucide-react';
import { playPopSound } from '../utils/sound';

export interface VplayAppItem {
  id: string;
  name: string;
  category: string;
  route: string;
  state?: any;
  renderIcon: () => React.ReactNode;
}

interface VplayAppsHomeGridProps {
  navigate: (route: string, state?: any) => void;
  className?: string;
}

export const VplayAppsHomeGrid: React.FC<VplayAppsHomeGridProps> = ({
  navigate,
  className = ''
}) => {
  // Dynamic date calculation for realistic Calendar icon
  const today = useMemo(() => {
    const d = new Date();
    const dayNames = ['CN', 'THỨ 2', 'THỨ 3', 'THỨ 4', 'THỨ 5', 'THỨ 6', 'THỨ 7'];
    return {
      dayName: dayNames[d.getDay()],
      dateNumber: d.getDate()
    };
  }, []);

  // TOÀN BỘ 28 ỨNG DỤNG SPACE 360 - SẮP XẾP THEO THỨ TỰ TỪ A - Z (7 DÒNG X 4 APPS)
  // Thiết kế chuẩn phong cách iOS/macOS icons:
  // - Màu sắc siêu saturate, tươi tắn, độ sâu 3D bóng bẩy
  // - 100% tự craft vector SVG không dùng preset iconography
  const apps: VplayAppItem[] = useMemo(() => [
    // 1. Browser (Màu tím, icon Sao Thổ)
    {
      id: 'browser',
      name: 'Browser',
      category: 'Trình duyệt',
      route: '/v-browser',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#A855F7] via-[#7C3AED] to-[#4C1D95] flex items-center justify-center relative overflow-hidden shadow-inner">
          {/* Subtle cosmic stardust */}
          <div className="absolute top-2.5 left-3.5 w-1.5 h-1.5 rounded-full bg-white/80" />
          <div className="absolute bottom-3 right-4 w-1 h-1 rounded-full bg-pink-200/90" />
          <div className="absolute top-3.5 right-3 w-1 h-1 rounded-full bg-amber-200/90" />

          {/* Self-crafted 3D Saturn (Sao Thổ) */}
          <svg className="w-[84%] h-[84%] drop-shadow-[0_4px_10px_rgba(0,0,0,0.55)]" viewBox="0 0 100 100" fill="none">
            <defs>
              <radialGradient id="saturn-body-purple" cx="36%" cy="30%" r="68%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="35%" stopColor="#FBBF24" />
                <stop offset="65%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#92400E" />
              </radialGradient>
              <linearGradient id="saturn-ring-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.95" />
                <stop offset="25%" stopColor="#FDE68A" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
                <stop offset="75%" stopColor="#D97706" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#FFFBEB" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            {/* Back Ring behind Planet */}
            <g transform="rotate(-25 50 50)">
              <ellipse cx="50" cy="50" rx="46" ry="12.5" fill="none" stroke="url(#saturn-ring-purple)" strokeWidth="6.5" opacity="0.65" />
              <ellipse cx="50" cy="50" rx="41" ry="10" fill="none" stroke="#FDE68A" strokeWidth="1.2" opacity="0.4" />
            </g>

            {/* Saturn Planet Sphere */}
            <circle cx="50" cy="50" r="23" fill="url(#saturn-body-purple)" />

            {/* Atmospheric Bands */}
            <clipPath id="saturn-clip-purple">
              <circle cx="50" cy="50" r="23" />
            </clipPath>
            <g clipPath="url(#saturn-clip-purple)">
              <path d="M 25 45 Q 50 52 75 45" stroke="#FEF08A" strokeWidth="2.5" fill="none" opacity="0.6" />
              <path d="M 25 51 Q 50 58 75 51" stroke="#92400E" strokeWidth="3" fill="none" opacity="0.6" />
              <path d="M 25 57 Q 50 64 75 57" stroke="#FBBF24" strokeWidth="2" fill="none" opacity="0.5" />
            </g>

            {/* Front Ring in front of Planet */}
            <g transform="rotate(-25 50 50)">
              <path d="M 4 50 A 46 12.5 0 0 0 96 50" fill="none" stroke="url(#saturn-ring-purple)" strokeWidth="6.5" />
              <path d="M 9 50 A 41 10 0 0 0 91 50" fill="none" stroke="#FFFBEB" strokeWidth="1.2" opacity="0.75" />
            </g>
          </svg>
        </div>
      )
    },

    // 2. Calculator
    {
      id: 'calc',
      name: 'Calculator',
      category: 'Tính toán',
      route: '/v-calc',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#2A2A2E] via-[#1C1C20] to-[#0A0A0C] flex items-center justify-center relative overflow-hidden shadow-inner">
          {/* 4 3D embossed mathematical buttons */}
          <div className="grid grid-cols-2 gap-1.5 w-[58%] h-[58%]">
            <div className="rounded-full bg-gradient-to-b from-[#64748B] to-[#475569] flex items-center justify-center text-white text-xs font-black shadow-[0_2px_4px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.4)]">+</div>
            <div className="rounded-full bg-gradient-to-b from-[#FB923C] to-[#EA580C] flex items-center justify-center text-white text-xs font-black shadow-[0_2px_4px_rgba(234,88,12,0.6),inset_0_1px_1px_rgba(255,255,255,0.5)]">−</div>
            <div className="rounded-full bg-gradient-to-b from-[#64748B] to-[#475569] flex items-center justify-center text-white text-xs font-black shadow-[0_2px_4px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.4)]">×</div>
            <div className="rounded-full bg-gradient-to-b from-[#FB923C] to-[#EA580C] flex items-center justify-center text-white text-xs font-black shadow-[0_2px_4px_rgba(234,88,12,0.6),inset_0_1px_1px_rgba(255,255,255,0.5)]">=</div>
          </div>
        </div>
      )
    },

    // 3. Calendar (Bỏ dải màu đỏ, phóng to text lên)
    {
      id: 'calendar',
      name: 'Calendar',
      category: 'Tiện ích',
      route: '/v-calendar',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#F1F5F9] flex flex-col items-center justify-center relative overflow-hidden shadow-inner select-none p-1">
          {/* Weekday name enlarged in saturated red */}
          <span className="text-[11px] sm:text-[12px] font-black text-[#EF4444] tracking-wider uppercase leading-none drop-shadow-xs">
            {today.dayName}
          </span>
          {/* Large embossed date number */}
          <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tighter leading-none mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
            {today.dateNumber}
          </span>
        </div>
      )
    },

    // 4. Camera
    {
      id: 'camera',
      name: 'Camera',
      category: 'Ảnh ảo',
      route: '/v-camera',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#64748B] via-[#334155] to-[#1E293B] flex items-center justify-center relative overflow-hidden shadow-inner">
          <div className="w-[74%] h-[74%] rounded-full bg-gradient-to-b from-[#0F172A] to-[#1E293B] flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.25)]">
            <div className="w-[66%] h-[66%] rounded-full bg-gradient-to-br from-[#0284C7] via-[#0F172A] to-[#06B6D4] flex items-center justify-center relative shadow-inner">
              <div className="absolute top-1 right-1.5 w-2.5 h-2.5 rounded-full bg-white/90 blur-[0.4px]" />
              <div className="w-3 h-3 rounded-full bg-[#06B6D4]/70 blur-[1px]" />
              <div className="absolute bottom-1.5 left-2 w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>
          </div>
        </div>
      )
    },

    // 5. Chat (Đổi tên từ Messages, chat bubble hình tròn)
    {
      id: 'chat',
      name: 'Chat',
      category: 'Giao tiếp',
      route: '/chat',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#34D399] via-[#10B981] to-[#047857] flex items-center justify-center relative overflow-hidden shadow-inner">
          {/* Circular chat bubble with small bottom-left tail */}
          <div className="relative w-[65%] h-[65%] flex items-center justify-center">
            {/* Main Round Bubble */}
            <div className="w-[88%] h-[88%] rounded-full bg-white shadow-[0_4px_8px_rgba(0,0,0,0.25)] flex items-center justify-center gap-1.5 z-10">
              <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-xs" />
              <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-xs" />
              <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-xs" />
            </div>
            {/* Speech bubble tail pointer */}
            <div className="absolute -bottom-0.5 left-1 w-3.5 h-3.5 bg-white rounded-bl-full rotate-12 shadow-xs" />
          </div>
        </div>
      )
    },

    // 6. Clock (Màu trắng tinh tế)
    {
      id: 'clock',
      name: 'Clock',
      category: 'Đồng hồ',
      route: '/v-clock',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#E2E8F0] flex items-center justify-center relative overflow-hidden shadow-inner">
          <div className="w-[86%] h-[86%] rounded-full relative flex items-center justify-center">
            {/* 12, 3, 6, 9 Hour tick marks in deep slate */}
            <div className="absolute top-1 w-1 h-2 bg-[#0F172A] rounded-full" />
            <div className="absolute bottom-1 w-1 h-2 bg-[#0F172A] rounded-full" />
            <div className="absolute left-1 w-2 h-1 bg-[#0F172A] rounded-full" />
            <div className="absolute right-1 w-2 h-1 bg-[#0F172A] rounded-full" />

            {/* Hour hand (Black) */}
            <div className="absolute top-3 w-1.5 h-4 bg-[#0F172A] rounded-full origin-bottom rotate-45 shadow-sm" />
            {/* Minute hand (Black) */}
            <div className="absolute top-2 w-1 h-5.5 bg-[#0F172A] rounded-full origin-bottom -rotate-45 shadow-sm" />
            {/* Second hand (Vibrant Neon Orange/Red) */}
            <div className="absolute top-1.5 w-0.5 h-6.5 bg-[#FF3B30] rounded-full origin-bottom rotate-120 shadow-[0_0_3px_#FF3B30]" />
            <div className="w-2 h-2 rounded-full bg-[#FF3B30] z-10 shadow-sm" />
          </div>
        </div>
      )
    },

    // 7. Cookbook
    {
      id: 'cookbook',
      name: 'Cookbook',
      category: 'Ẩm thực',
      route: '/cookbook',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FB923C] via-[#EA580C] to-[#C2410C] flex items-center justify-center relative overflow-hidden shadow-inner">
          <svg className="w-[60%] h-[60%] text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]" viewBox="0 0 100 100" fill="none">
            <path d="M 20 62 A 30 25 0 0 1 80 62 Z" fill="#FFFFFF" fillOpacity="0.95" />
            <ellipse cx="50" cy="37" rx="5" ry="3.5" fill="#FDE047" />
            <rect x="15" y="62" width="70" height="6" rx="3" fill="#FFFFFF" />
            <path d="M 38 30 Q 34 22 40 16" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" />
            <path d="M 50 28 Q 54 20 48 14" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" />
            <path d="M 62 30 Q 66 22 60 16" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="50" cy="72" rx="36" ry="4" fill="#7C2D12" fillOpacity="0.4" />
          </svg>
        </div>
      )
    },

    // 8. Explore VN
    {
      id: 'explore_vietnam',
      name: 'Explore VN',
      category: 'Du lịch',
      route: '/explore-vietnam',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#EF4444] via-[#DC2626] to-[#991B1B] flex items-center justify-center relative overflow-hidden shadow-inner">
          <svg className="w-[74%] h-[74%] drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="star-gold-vibrant" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#EAB308" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="38" stroke="#FCA5A5" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <polygon 
              points="50,15 61,38 86,38 66,54 74,78 50,63 26,78 34,54 14,38 39,38" 
              fill="url(#star-gold-vibrant)" 
            />
          </svg>
        </div>
      )
    },

    // 9. Feedback Box (Đổi từ Mail, Màu tím, chat bubble radius corner 30 có dấu chấm than !)
    {
      id: 'feedback_box',
      name: 'Feedback Box',
      category: 'Hỗ trợ',
      route: '/v-flow',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#C084FC] via-[#9333EA] to-[#6B21A8] flex items-center justify-center relative overflow-hidden shadow-inner">
          {/* Chat bubble with radius corner 30 (bo góc 30px) */}
          <div className="relative w-[66%] h-[66%] flex items-center justify-center">
            <div className="w-full h-[85%] rounded-[30px] bg-white shadow-[0_4px_10px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center relative">
              {/* Bold Exclamation Mark (!) */}
              <span className="text-xl sm:text-2xl font-black text-[#9333EA] leading-none drop-shadow-xs">
                !
              </span>
              {/* Subtle bubble corner tail */}
              <div className="absolute -bottom-1 left-3 w-3 h-3 bg-white rounded-bl-full rotate-45 shadow-xs" />
            </div>
          </div>
        </div>
      )
    },

    // 10. Files
    {
      id: 'files',
      name: 'Files',
      category: 'Tệp tin',
      route: '/v-files',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#38BDF8] via-[#0284C7] to-[#1D4ED8] flex items-center justify-center relative overflow-hidden shadow-inner">
          <svg className="w-[62%] h-[62%] drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]" viewBox="0 0 100 100" fill="none">
            <path d="M 18 34 L 40 34 L 48 42 L 82 42 A 6 6 0 0 1 88 48 L 88 74 A 6 6 0 0 1 82 80 L 18 80 A 6 6 0 0 1 12 74 L 12 40 A 6 6 0 0 1 18 34 Z" fill="#0369A1" />
            <rect x="22" y="32" width="56" height="36" rx="4" fill="#FFFFFF" fillOpacity="0.95" />
            <line x1="28" y1="40" x2="52" y2="40" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="28" y1="46" x2="68" y2="46" stroke="#BAE6FD" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 12 50 L 88 50 L 84 76 A 6 6 0 0 1 78 82 L 22 82 A 6 6 0 0 1 16 76 Z" fill="#38BDF8" />
          </svg>
        </div>
      )
    },

    // 11. Freeform
    {
      id: 'freeform',
      name: 'Freeform',
      category: 'Thiết kế',
      route: '/spatial-design',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative overflow-hidden shadow-inner">
          <div className="relative w-[70%] h-[70%] flex items-center justify-center">
            <div className="absolute w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF9500] to-[#FFCC00] -left-1 top-1 shadow-sm opacity-90" />
            <div className="absolute w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#00C7BE] to-[#34C759] right-0 top-0 rotate-12 shadow-sm opacity-90" />
            <div className="absolute w-7 h-7 rounded-full bg-gradient-to-tr from-[#AF52DE] to-[#FF2D55] bottom-0 left-2 shadow-sm opacity-85" />
            <svg className="w-full h-full relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" viewBox="0 0 40 40" fill="none">
              <path 
                d="M 8 26 C 11 16, 17 10, 22 22 C 26 30, 32 17, 36 24" 
                stroke="#0F172A" 
                strokeWidth="4.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>
        </div>
      )
    },

    // 12. Games
    {
      id: 'games',
      name: 'Games',
      category: 'Giải trí',
      route: '/v-arcade',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#D946EF] via-[#A855F7] to-[#7E22CE] flex items-center justify-center relative overflow-hidden shadow-inner">
          <svg className="w-[64%] h-[64%] drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]" viewBox="0 0 100 100" fill="none">
            <rect x="14" y="28" width="72" height="44" rx="22" fill="#FFFFFF" fillOpacity="0.95" />
            <rect x="30" y="42" width="6" height="16" rx="2" fill="#334155" />
            <rect x="25" y="47" width="16" height="6" rx="2" fill="#334155" />
            <circle cx="66" cy="45" r="4.5" fill="#06B6D4" filter="drop-shadow(0 1px 2px rgba(6,182,212,0.6))" />
            <circle cx="75" cy="55" r="4.5" fill="#F43F5E" filter="drop-shadow(0 1px 2px rgba(244,63,94,0.6))" />
            <rect x="44" y="52" width="5" height="2" rx="1" fill="#94A3B8" />
            <rect x="51" y="52" width="5" height="2" rx="1" fill="#94A3B8" />
          </svg>
        </div>
      )
    },

    // 13. Health
    {
      id: 'health',
      name: 'Health',
      category: 'Sức khỏe',
      route: '/health',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FFFFFF] to-[#FFE4E6] flex items-center justify-center relative overflow-hidden shadow-inner">
          <svg className="w-[64%] h-[64%] drop-shadow-[0_4px_8px_rgba(244,63,94,0.4)]" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="heart-vibrant-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF2D55" />
                <stop offset="50%" stopColor="#E11D48" />
                <stop offset="100%" stopColor="#BE123C" />
              </linearGradient>
            </defs>
            <path 
              d="M 50 82 L 44 76 C 24 57 14 47 14 34 C 14 22 23 14 34 14 C 41 14 47 17 50 22 C 53 17 59 14 66 14 C 77 14 86 22 86 34 C 86 47 76 57 56 76 Z" 
              fill="url(#heart-vibrant-grad)" 
            />
            <path 
              d="M 24 46 L 38 46 L 44 34 L 50 58 L 56 40 L 62 48 L 76 48" 
              stroke="#FFFFFF" 
              strokeWidth="3.4" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>
      )
    },

    // 14. Logo TV
    {
      id: 'logo_switcher',
      name: 'Logo TV',
      category: 'Truyền hình',
      route: '/logo-switcher',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#EF4444] via-[#E11D48] to-[#8B5CF6] flex items-center justify-center relative overflow-hidden shadow-inner">
          <svg className="w-[60%] h-[60%] text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)]" viewBox="0 0 100 100" fill="none">
            <path d="M 80 50 A 30 30 0 0 0 26 32 L 20 22" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
            <polygon points="16,36 34,36 28,18" fill="#FFFFFF" />
            <path d="M 20 50 A 30 30 0 0 0 74 68 L 80 78" stroke="#FDE047" strokeWidth="6" strokeLinecap="round" />
            <polygon points="84,64 66,64 72,82" fill="#FDE047" />
            <circle cx="50" cy="50" r="12" fill="#FFFFFF" />
            <circle cx="50" cy="50" r="7" fill="#E11D48" />
          </svg>
        </div>
      )
    },

    // 15. Maps
    {
      id: 'maps',
      name: 'Maps',
      category: 'Bản đồ',
      route: '/v-maps',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-[#E2E8F0] flex items-center justify-center relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-[#F1F5F9]">
            <div className="absolute top-0 right-0 w-10 h-10 rounded-bl-full bg-[#4ADE80]" />
            <div className="absolute bottom-0 left-0 w-9 h-9 rounded-tr-full bg-[#60A5FA]" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4.5 bg-[#FBBF24] rotate-45 transform scale-150" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2.5 bg-white rotate-45 transform scale-150" />
          </div>
          <div className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#DC2626] to-[#EF4444] shadow-[0_4px_10px_rgba(220,38,38,0.6)] flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
          </div>
        </div>
      )
    },

    // 16. Minecraft
    {
      id: 'minecraft',
      name: 'Minecraft',
      category: 'Trò chơi',
      route: '/minecraft',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#22C55E] via-[#16A34A] to-[#15803D] flex items-center justify-center relative overflow-hidden shadow-inner">
          <div className="w-[58%] h-[58%] rounded-sm bg-[#B45309] flex flex-col justify-between p-1 shadow-[0_4px_8px_rgba(0,0,0,0.55)]">
            <div className="h-2.5 w-full bg-[#22C55E] rounded-xs shadow-xs" />
            <div className="w-2.5 h-3.5 bg-[#18181B] mx-auto rounded-xs" />
            <div className="h-2 w-full bg-[#78350F]" />
          </div>
        </div>
      )
    },

    // 17. Music
    {
      id: 'music',
      name: 'Music',
      category: 'Âm nhạc',
      route: '/music',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FF2D55] via-[#F43F5E] to-[#E11D48] flex items-center justify-center relative overflow-hidden shadow-inner">
          <svg className="w-[58%] h-[58%] drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]" viewBox="0 0 100 100" fill="none">
            <path d="M 40 68 C 40 73 35 77 29 77 C 23 77 18 73 18 68 C 18 63 23 59 29 59 C 33 59 36 61 38 63 L 38 30 L 78 20 L 78 58 C 78 63 73 67 67 67 C 61 67 56 63 56 58 C 56 53 61 49 67 49 C 71 49 74 51 76 53 L 76 28 L 40 37 Z" fill="#FFFFFF" />
          </svg>
        </div>
      )
    },

    // 18. Notes
    {
      id: 'notes',
      name: 'Notes',
      category: 'Ghi chú',
      route: '/v-notes',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-[#FEF08A] flex items-center justify-center relative overflow-hidden shadow-inner">
          <div className="absolute top-0 inset-x-0 h-[30%] bg-gradient-to-b from-[#F59E0B] to-[#D97706] shadow-sm" />
          <div className="w-[58%] flex flex-col gap-1.5 mt-3">
            <div className="h-[2.5px] w-full bg-[#CBD5E1] rounded-full" />
            <div className="h-[2.5px] w-[80%] bg-[#CBD5E1] rounded-full" />
            <div className="h-[2.5px] w-[60%] bg-[#F59E0B] rounded-full" />
          </div>
        </div>
      )
    },

    // 19. Phone
    {
      id: 'phone',
      name: 'Phone',
      category: 'Tiện ích',
      route: '/v-phone',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#34D399] via-[#22C55E] to-[#15803D] flex items-center justify-center relative overflow-hidden shadow-inner">
          <svg className="w-[56%] h-[56%] drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]" viewBox="0 0 100 100" fill="none">
            <path 
              d="M 32 20 C 30 14 22 14 16 20 L 14 22 C 10 26 10 36 18 52 C 26 68 38 80 50 86 C 64 92 74 90 78 86 L 80 84 C 86 78 86 70 80 68 L 68 58 C 64 54 58 56 54 60 L 50 64 C 42 58 36 50 32 42 L 36 38 C 40 34 42 28 38 24 Z" 
              fill="#FFFFFF" 
            />
          </svg>
        </div>
      )
    },

    // 20. Photos
    {
      id: 'photos',
      name: 'Photos',
      category: 'Thư viện',
      route: '/v-gallery',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative overflow-hidden shadow-inner">
          <div className="relative w-[68%] h-[68%] flex items-center justify-center">
            <div className="absolute w-3.5 h-7 rounded-full bg-[#FF2D55] -top-0.5 opacity-90 shadow-sm" />
            <div className="absolute w-3.5 h-7 rounded-full bg-[#FF9500] rotate-45 top-0.5 right-1 opacity-90 shadow-sm" />
            <div className="absolute w-7 h-3.5 rounded-full bg-[#FFCC00] right-0 opacity-90 shadow-sm" />
            <div className="absolute w-3.5 h-7 rounded-full bg-[#34C759] rotate-135 bottom-0.5 right-1 opacity-90 shadow-sm" />
            <div className="absolute w-3.5 h-7 rounded-full bg-[#00C7BE] bottom-0 opacity-90 shadow-sm" />
            <div className="absolute w-3.5 h-7 rounded-full bg-[#007AFF] -rotate-135 bottom-0.5 left-1 opacity-90 shadow-sm" />
            <div className="absolute w-7 h-3.5 rounded-full bg-[#5856D6] left-0 opacity-90 shadow-sm" />
            <div className="absolute w-3.5 h-7 rounded-full bg-[#AF52DE] -rotate-45 top-0.5 left-1 opacity-90 shadow-sm" />
            <div className="w-4 h-4 rounded-full bg-white z-10 shadow-sm" />
          </div>
        </div>
      )
    },

    // 21. Reminders
    {
      id: 'reminders',
      name: 'Reminders',
      category: 'Lịch trình',
      route: '/v-reminders',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FFFFFF] to-[#F1F5F9] flex items-center justify-center relative overflow-hidden shadow-inner">
          <div className="w-[64%] flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#F97316] to-[#FBBF24] shadow-sm shrink-0" />
              <div className="h-2.5 w-full bg-[#E2E8F0] rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] shadow-sm shrink-0" />
              <div className="h-2.5 w-[75%] bg-[#E2E8F0] rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#E11D48] to-[#FB7185] shadow-sm shrink-0" />
              <div className="h-2.5 w-[55%] bg-[#E2E8F0] rounded-full" />
            </div>
          </div>
        </div>
      )
    },

    // 22. Settings (Fix lệch tâm - Căn chính giữa 100% tại cx=50, cy=50)
    {
      id: 'settings',
      name: 'Settings',
      category: 'Hệ thống',
      route: '/settings',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#64748B] via-[#475569] to-[#334155] flex items-center justify-center relative overflow-hidden shadow-inner">
          {/* Perfectly centered mechanical gear at center (50, 50) */}
          <svg className="w-[66%] h-[66%] text-slate-200 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] group-hover:rotate-45 transition-transform duration-500 ease-out" viewBox="0 0 100 100" fill="none">
            <defs>
              <radialGradient id="gear-metallic" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#F8FAFC" />
                <stop offset="50%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#64748B" />
              </radialGradient>
            </defs>
            <g transform="translate(50, 50)">
              {/* 8 Gear Teeth symmetrically rotated around (0,0) */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <rect 
                  key={angle} 
                  x="-7" 
                  y="-44" 
                  width="14" 
                  height="16" 
                  rx="3.5" 
                  fill="url(#gear-metallic)" 
                  transform={`rotate(${angle})`} 
                />
              ))}
              {/* Gear Main Hub Ring */}
              <circle cx="0" cy="0" r="34" fill="url(#gear-metallic)" />
              {/* Recessed Inner Rim */}
              <circle cx="0" cy="0" r="22" fill="#334155" />
              {/* Center Axle Hole */}
              <circle cx="0" cy="0" r="13" fill="#1E293B" />
            </g>
          </svg>
        </div>
      )
    },

    // 23. Shop (Màu vàng, icon Túi xách thời trang)
    {
      id: 'shop',
      name: 'Shop',
      category: 'Cửa hàng',
      route: '/v-shop',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FDE047] via-[#F59E0B] to-[#D97706] flex items-center justify-center relative overflow-hidden shadow-inner">
          {/* Self-crafted 3D Luxury Handbag on vibrant yellow/gold */}
          <svg className="w-[68%] h-[68%] drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="shop-bag-body" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#F1F5F9" />
              </linearGradient>
              <linearGradient id="shop-bag-leather-accent" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>

            {/* Arched Leather Handbag Handle */}
            <path 
              d="M 33 42 C 33 22 67 22 67 42" 
              fill="none" 
              stroke="url(#shop-bag-leather-accent)" 
              strokeWidth="5.5" 
              strokeLinecap="round" 
            />

            {/* Handbag Structured Body */}
            <path 
              d="M 23 42 L 77 42 L 85 82 C 85 86 81 88 77 88 L 23 88 C 19 88 15 86 15 82 Z" 
              fill="url(#shop-bag-body)" 
            />

            {/* Top flap fold line */}
            <path d="M 20 56 L 80 56" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 2" />

            {/* Luxury Metal Clasp / Buckle */}
            <rect x="43" y="52" width="14" height="11" rx="3" fill="url(#shop-bag-leather-accent)" />
            <circle cx="50" cy="57.5" r="2" fill="#FDE047" />
          </svg>
        </div>
      )
    },

    // 24. Stocks
    {
      id: 'stocks',
      name: 'Stocks',
      category: 'Tài chính',
      route: '/stock',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#18181B] to-[#000000] flex items-center justify-center relative overflow-hidden shadow-inner">
          <svg className="w-[62%] h-[62%] drop-shadow-[0_2px_8px_rgba(52,199,89,0.55)]" viewBox="0 0 100 100" fill="none">
            <rect x="22" y="58" width="8" height="20" rx="2" fill="#22C55E" opacity="0.8" />
            <line x1="26" y1="52" x2="26" y2="82" stroke="#22C55E" strokeWidth="2.2" />
            <rect x="42" y="44" width="8" height="24" rx="2" fill="#22C55E" opacity="0.9" />
            <line x1="46" y1="36" x2="46" y2="72" stroke="#22C55E" strokeWidth="2.2" />
            <path d="M 16 78 L 38 56 L 56 64 L 84 28" stroke="#34D399" strokeWidth="4.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="84" cy="28" r="5" fill="#FFFFFF" filter="drop-shadow(0 0 6px #34D399)" />
          </svg>
        </div>
      )
    },

    // 25. Study (Màu đỏ tươi, Mũ tốt nghiệp & Sách học)
    {
      id: 'study',
      name: 'Study',
      category: 'Học tập',
      route: '/v-study',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#EF4444] via-[#DC2626] to-[#991B1B] flex items-center justify-center relative overflow-hidden shadow-inner">
          <svg className="w-[65%] h-[65%] text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]" viewBox="0 0 100 100" fill="none">
            {/* White Mortarboard Diamond Cap */}
            <polygon points="50,22 86,38 50,54 14,38" fill="#FFFFFF" />
            {/* Cap under-rim */}
            <path d="M 28 46 L 28 62 C 28 70 72 70 72 62 L 72 46" fill="#FCA5A5" />
            {/* Hanging Golden Tassel */}
            <path d="M 50 38 L 20 48 L 18 64" stroke="#FDE047" strokeWidth="3.8" strokeLinecap="round" />
            <circle cx="18" cy="64" r="3.5" fill="#FDE047" />
          </svg>
        </div>
      )
    },

    // 26. Ticket
    {
      id: 'ticket',
      name: 'Ticket',
      category: 'Đặt vé',
      route: '/v-ticket',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#F59E0B] via-[#D97706] to-[#B45309] flex items-center justify-center relative overflow-hidden shadow-inner">
          <svg className="w-[62%] h-[62%] drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]" viewBox="0 0 100 100" fill="none">
            <path 
              d="M 18 30 C 18 26 22 22 26 22 L 74 22 C 78 22 82 26 82 30 L 82 44 C 76 44 72 47 72 52 C 72 57 76 60 82 60 L 82 74 C 82 78 78 82 74 82 L 26 82 C 22 82 18 78 18 74 L 18 60 C 24 60 28 57 28 52 C 28 47 24 44 18 44 Z" 
              fill="#FFFFFF" 
            />
            <line x1="48" y1="26" x2="48" y2="78" stroke="#D97706" strokeWidth="2.5" strokeDasharray="4 3" />
            <polygon points="65,40 68,48 76,48 70,54 72,62 65,57 58,62 60,54 54,48 62,48" fill="#F59E0B" />
          </svg>
        </div>
      )
    },

    // 27. TV
    {
      id: 'tv',
      name: 'TV',
      category: 'Truyền hình',
      route: '/v-box',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#27272A] via-[#18181B] to-[#09090B] flex items-center justify-center relative overflow-hidden shadow-inner">
          <svg className="w-[64%] h-[64%] drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" viewBox="0 0 100 100" fill="none">
            <rect x="14" y="22" width="72" height="48" rx="8" fill="#FFFFFF" fillOpacity="0.15" stroke="#94A3B8" strokeWidth="2.5" />
            <rect x="18" y="26" width="64" height="40" rx="5" fill="#09090B" />
            <path d="M 22 30 L 78 30 L 78 62 L 22 62 Z" fill="url(#tv-screen-vibrant)" />
            <rect x="46" y="70" width="8" height="8" fill="#94A3B8" />
            <path d="M 36 78 L 64 78" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
            <defs>
              <linearGradient id="tv-screen-vibrant" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#F43F5E" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )
    },

    // 28. Weather
    {
      id: 'weather',
      name: 'Weather',
      category: 'Thời tiết',
      route: '/v-weather',
      renderIcon: () => (
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#38BDF8] via-[#0284C7] to-[#0369A1] flex items-center justify-center relative overflow-hidden shadow-inner">
          <div className="relative w-[70%] h-[70%] flex items-center justify-center">
            <div className="absolute top-0 right-1 w-7.5 h-7.5 rounded-full bg-gradient-to-tr from-[#F59E0B] to-[#FEF08A] shadow-[0_0_16px_#F59E0B]" />
            <svg className="w-11 h-11 text-white relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
            </svg>
          </div>
        </div>
      )
    },
  ], [today]);

  const handleAppClick = (app: VplayAppItem) => {
    playPopSound();
    navigate(app.route, app.state);
  };

  return (
    <section 
      id="vplay-apps-home-grid-section" 
      className={`w-full max-w-4xl mx-auto py-2 ${className}`}
    >
      {/* Header section with Spatial Apps branding */}
      <div className="flex items-center justify-between px-2 sm:px-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#E6005A]/25 to-pink-500/15 border border-[#E6005A]/30 flex items-center justify-center text-[#FF4D8B] shadow-sm">
            <Compass className="w-5 h-5 text-[#FF4D8B]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Space 360 Apps</span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-pink-300 border border-white/10">
                A – Z ({apps.length} ứng dụng)
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Toàn bộ ứng dụng Space 360 xếp thứ tự A-Z theo lưới 4 apps/dòng phong cách iOS/macOS
            </p>
          </div>
        </div>

        <button
          id="btn-open-full-space-360"
          type="button"
          onClick={() => {
            playPopSound();
            navigate('/space-360');
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all cursor-pointer shadow-sm active:scale-95"
          title="Mở toàn cảnh không gian Space 360"
        >
          <span>Khám phá 360°</span>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-300" />
        </button>
      </div>

      {/* Grid: Toàn bộ ứng dụng của Space 360 hiển thị 4 apps/dòng (grid-cols-4), sắp xếp từ A-Z */}
      <div className="w-full px-2 sm:px-6">
        <div className="grid grid-cols-4 gap-y-7 sm:gap-y-9 gap-x-3 sm:gap-x-8 justify-items-center">
          {apps.map((app) => (
            <button
              key={app.id}
              type="button"
              id={`home-vplay-app-${app.id}`}
              onClick={() => handleAppClick(app)}
              className="vplay-app-item-btn group flex flex-col items-center cursor-pointer w-full max-w-[96px] sm:max-w-[110px] bg-transparent border-0 outline-none p-0 select-none"
              title={`Mở ứng dụng ${app.name} (${app.category})`}
            >
              {/* Circular visionOS / iOS Icon Container:
                  - Viền quanh circle icon giống viền các ô kênh và các nút: border border-white/15 group-hover:border-white/40
                  - Bỏ viền radius corner 30px bên ngoài
                  - Đồ họa bên trong tự craft 100%, 3D nổi bật, màu sắc tươi tắn và vibrant
              */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-full relative flex items-center justify-center border border-white/15 group-hover:border-white/40 shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out group-hover:scale-105 group-hover:shadow-[0_12px_28px_rgba(0,0,0,0.5)] group-active:scale-95 overflow-hidden">
                {/* Render the custom-crafted borderless vibrant 3D icon graphic */}
                {app.renderIcon()}

                {/* Subtle top glossy specular sheen reflection for glass depth */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 via-transparent to-black/20 pointer-events-none" />
              </div>

              {/* App Label beneath icon */}
              <span className="mt-2.5 text-xs sm:text-[13px] font-medium text-white/90 text-center truncate max-w-[85px] sm:max-w-[100px] leading-tight select-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] group-hover:text-white transition-colors">
                {app.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
