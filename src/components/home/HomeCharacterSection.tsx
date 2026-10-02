import React from 'react';
import { Sparkles, User, Gem, ArrowRight, ShieldCheck, Gamepad2, Gift } from 'lucide-react';
import { MinecraftCharacterAvatar, DEFAULT_MINECRAFT_SKIN } from '../minecraft/MinecraftCharacterAvatar';
import { useSettings } from '../../hooks/useSettings';
import { useAuth } from '../../context/AuthContext';
import { useOrbs } from '../../hooks/useOrbs';
import { playPopSound } from '../../utils/sound';

interface HomeCharacterSectionProps {
  navigate: (route: string, state?: any) => void;
}

export const HomeCharacterSection: React.FC<HomeCharacterSectionProps> = ({ navigate }) => {
  const { settings } = useSettings();
  const { user, isAuthenticated } = useAuth();
  const { orbs } = useOrbs();

  const handleOpenProfile = () => {
    playPopSound();
    navigate('/settings?tab=profile');
    window.dispatchEvent(new CustomEvent('vplay:open_profile_settings'));
  };

  const handleOpenRedeem = () => {
    playPopSound();
    navigate('/settings?tab=redeem_gift');
  };

  const handleOpenSpace360 = () => {
    playPopSound();
    navigate('/space-360');
  };

  const displayName = settings.userName || user?.displayName || 'VNRT Steve';

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 max-w-7xl mx-auto my-4 sm:my-6 select-none">
      <div 
        className="relative w-full rounded-3xl overflow-hidden border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(16,185,129,0.12)] p-6 sm:p-8 md:p-10 backdrop-blur-xl group"
        style={{
          background: 'linear-gradient(135deg, rgba(9,9,11,0.95) 0%, rgba(20,20,25,0.92) 50%, rgba(6,78,59,0.35) 100%)',
        }}
      >
        {/* Ambient atmospheric aura lights */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          {/* 1. Large 3D Character Skin Showcase with Floating Name Tag */}
          <div className="flex flex-col items-center shrink-0 w-full sm:w-auto">
            <div 
              onClick={handleOpenProfile}
              className="relative cursor-pointer group/skin transition-transform duration-300 hover:scale-[1.03] active:scale-95"
              title="Nhấn để mở Hồ sơ & Tùy biến nhân vật"
            >
              {/* Stand / Stage backdrop */}
              <div 
                className="w-56 h-72 sm:w-64 sm:h-84 rounded-3xl bg-gradient-to-b from-zinc-950/90 via-zinc-900/80 to-zinc-950/95 border-2 border-emerald-500/40 group-hover/skin:border-emerald-400 p-4 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden transition-colors"
                style={{
                  background: 'radial-gradient(circle at 50% 20%, rgba(16,185,129,0.25) 0%, rgba(9,9,11,0.95) 75%)'
                }}
              >
                {/* 3D Character with floating Name Tag */}
                <div className="flex-1 w-full flex flex-col items-center justify-center pt-2">
                  <MinecraftCharacterAvatar
                    skinUrl={DEFAULT_MINECRAFT_SKIN}
                    size={240}
                    mode="full"
                    nameTag="VNRT Steve"
                    showCape={true}
                    animated={true}
                    className="drop-shadow-[0_16px_28px_rgba(0,0,0,0.85)]"
                  />
                  {/* Subtle 3D Pedestal shadow under Steve's feet */}
                  <div className="w-36 h-3 rounded-full bg-emerald-500/35 blur-[4px] mt-1 shrink-0" />
                </div>

                {/* Classic 3D Badge */}
                <div className="z-20 mt-2 bg-emerald-500/90 group-hover/skin:bg-emerald-400 text-black text-[10px] font-extrabold px-3 py-1 rounded-full font-mono whitespace-nowrap shadow-md uppercase tracking-wider flex items-center gap-1.5 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                  VNRT Steve • Classic 3D
                </div>
              </div>

              {/* Head round preview floating badge */}
              <div 
                className="absolute -top-3 -right-3 w-11 h-11 rounded-full bg-zinc-900 border-2 border-emerald-400 p-0.5 shadow-xl flex items-center justify-center group-hover/skin:scale-110 transition-transform"
                title="Face Icon"
              >
                <MinecraftCharacterAvatar
                  skinUrl={DEFAULT_MINECRAFT_SKIN}
                  size={34}
                  mode="head"
                />
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 mt-2.5 font-mono flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Chạm để tùy chỉnh hồ sơ</span>
            </p>
          </div>

          {/* 2. Text & Player Companion Dashboard */}
          <div className="flex-1 text-center md:text-left space-y-4">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>MINECRAFT COMPANION • NHÂN VẬT ĐẠI DIỆN</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-1.5">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Xin chào, <span className="text-emerald-400 font-black">{displayName}</span>!
              </h3>
              <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Nhân vật <strong className="text-white font-bold">VNRT Steve</strong> luôn đồng hành cùng bạn trên toàn bộ hệ thống VNRT Online: từ các kênh truyền hình trực tiếp chất lượng cao đến vũ trụ ứng dụng Không gian 360 độ.
              </p>
            </div>

            {/* Quick Player Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              {/* Stat 1: Orbs */}
              <div 
                onClick={handleOpenRedeem}
                className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer group/stat flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover/stat:scale-105 transition-transform">
                  <Gem className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-sm font-extrabold text-white truncate">{orbs} Orbs</div>
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Khoáng vật</div>
                </div>
              </div>

              {/* Stat 2: Account Status */}
              <div 
                onClick={handleOpenProfile}
                className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer group/stat flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center shrink-0 group-hover/stat:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-sky-400" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-sm font-extrabold text-white truncate">
                    {isAuthenticated ? 'Đã liên kết' : 'Khách vplay'}
                  </div>
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Tài khoản</div>
                </div>
              </div>

              {/* Stat 3: Space 360 */}
              <div 
                onClick={handleOpenSpace360}
                className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-pink-500/40 transition-all cursor-pointer group/stat flex items-center gap-3 col-span-2 sm:col-span-1"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center shrink-0 group-hover/stat:scale-105 transition-transform">
                  <Gamepad2 className="w-5 h-5 text-pink-400" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-sm font-extrabold text-white truncate">Space 360</div>
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">15+ Ứng dụng</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                type="button"
                onClick={handleOpenProfile}
                className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <User className="w-4 h-4" />
                <span>Xem Hồ sơ người dùng</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleOpenRedeem}
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/15 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Gift className="w-4 h-4 text-emerald-400" />
                <span>Đổi mã Giftcode Orbs</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCharacterSection;
