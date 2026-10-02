import React, { useState, useEffect } from 'react';
import {
  User,
  LogIn,
  LogOut,
  Edit2,
  Check,
  Tv,
  Gift,
  Box,
  Clock,
  Trash2,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Coins,
  History,
  Play,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../hooks/useSettings';
import { useOrbs } from '../../hooks/useOrbs';
import {
  MinecraftCharacterAvatar,
  DEFAULT_MINECRAFT_SKIN
} from '../minecraft/MinecraftCharacterAvatar';
import {
  getTvWatchHistory,
  clearTvWatchHistory,
  TvWatchRecord,
  getSpace360History,
  clearSpace360History,
  Space360AppRecord,
  getRedeemHistory,
  clearRedeemHistory,
  RedeemHistoryRecord,
} from '../../utils/userHistory';
import { playPopSound } from '../../utils/sound';
import { showIslandNotification } from '../../utils/islandNotifications';

interface ProfileSettingsSectionProps {
  navigate?: (route: string) => void;
  isDrawer?: boolean;
}

export const ProfileSettingsSection: React.FC<ProfileSettingsSectionProps> = ({
  navigate,
  isDrawer = false,
}) => {
  const { user, isAuthenticated, signOutUser, openAuthModal } = useAuth();
  const { settings, updateSetting } = useSettings();
  const { orbs } = useOrbs();

  const [usernameInput, setUsernameInput] = useState(settings.userName || 'User');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

  // Active History Subtab
  const [activeHistoryTab, setActiveHistoryTab] = useState<'redeems' | 'tv' | 'space360'>('tv');

  // Histories data states
  const [tvHistory, setTvHistory] = useState<TvWatchRecord[]>([]);
  const [space360History, setSpace360History] = useState<Space360AppRecord[]>([]);
  const [redeemHistory, setRedeemHistory] = useState<RedeemHistoryRecord[]>([]);

  useEffect(() => {
    setUsernameInput(settings.userName || 'User');
  }, [settings.userName]);

  // Load histories and listen to real-time custom events
  useEffect(() => {
    setTvHistory(getTvWatchHistory());
    setSpace360History(getSpace360History());
    setRedeemHistory(getRedeemHistory());

    const handleTvUpdate = () => setTvHistory(getTvWatchHistory());
    const handleSpaceUpdate = () => setSpace360History(getSpace360History());
    const handleRedeemUpdate = () => setRedeemHistory(getRedeemHistory());

    window.addEventListener('vplay:tv_watch_updated', handleTvUpdate);
    window.addEventListener('vplay:space360_updated', handleSpaceUpdate);
    window.addEventListener('vplay:redeem_updated', handleRedeemUpdate);

    return () => {
      window.removeEventListener('vplay:tv_watch_updated', handleTvUpdate);
      window.removeEventListener('vplay:space360_updated', handleSpaceUpdate);
      window.removeEventListener('vplay:redeem_updated', handleRedeemUpdate);
    };
  }, []);

  const handleSaveUsername = () => {
    const trimmed = usernameInput.trim() || 'User';
    updateSetting('userName', trimmed);
    setIsEditingUsername(false);
    setIsSavedSuccessfully(true);
    playPopSound();
    showIslandNotification({
      title: 'Đổi tên thành công',
      message: `Tên người dùng mới: ${trimmed}`,
      icon: 'check',
    });
    setTimeout(() => setIsSavedSuccessfully(false), 2500);
  };

  const handleClearTv = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử xem truyền hình?')) {
      clearTvWatchHistory();
      setTvHistory([]);
      playPopSound();
      showIslandNotification({
        title: 'Đã xóa lịch sử TV',
        message: 'Lịch sử xem truyền hình đã được làm trống',
        icon: 'info',
      });
    }
  };

  const handleClearSpace360 = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch sử ứng dụng Space 360?')) {
      clearSpace360History();
      setSpace360History([]);
      playPopSound();
      showIslandNotification({
        title: 'Đã xóa lịch sử Space 360',
        message: 'Lịch sử ứng dụng không gian đã được làm trống',
        icon: 'info',
      });
    }
  };

  const handleClearRedeems = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch sử đổi quà?')) {
      clearRedeemHistory();
      setRedeemHistory([]);
      playPopSound();
      showIslandNotification({
        title: 'Đã xóa lịch sử đổi quà',
        message: 'Lịch sử mã quà tặng đã được làm trống',
        icon: 'info',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. HERO USER PROFILE & MINECRAFT AVATAR CARD */}
      <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950/90 border border-zinc-800/90 shadow-xl relative overflow-hidden backdrop-blur-md">
        {/* Glow ambient background aura */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
          {/* Minecraft Character Model Large Showcase Display */}
          <div className="flex flex-col items-center shrink-0 w-full sm:w-auto">
            <div className="relative group w-full flex justify-center">
              <div 
                className="w-60 h-[380px] sm:w-72 sm:h-[430px] rounded-3xl bg-gradient-to-b from-zinc-950/95 via-zinc-900/90 to-zinc-950/95 border-2 border-emerald-500/50 p-4 flex flex-col items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden"
                style={{
                  background: 'radial-gradient(circle at 50% 15%, rgba(16,185,129,0.22) 0%, rgba(9,9,11,0.98) 75%)'
                }}
              >
                {/* Minecraft Character Full Body in 3D Model with VNRT Steve Name Tag */}
                <div className="flex-1 w-full flex flex-col items-center justify-center pt-2">
                  <MinecraftCharacterAvatar
                    skinUrl={DEFAULT_MINECRAFT_SKIN}
                    size={280}
                    mode="full"
                    nameTag="VNRT Steve"
                    showCape={true}
                    animated={true}
                    className="drop-shadow-[0_16px_32px_rgba(0,0,0,0.9)]"
                  />
                  {/* Subtle 3D Pedestal Shadow under Steve's feet */}
                  <div className="w-36 h-3 rounded-full bg-emerald-500/30 blur-[4px] mt-1 shrink-0" />
                </div>

                {/* Skin Badge */}
                <div className="z-20 mt-2 bg-emerald-500/90 text-black text-[10.5px] font-extrabold px-3 py-1 rounded-full font-mono whitespace-nowrap shadow-md uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                  VNRT Steve • Classic 3D
                </div>
              </div>

              {/* Head round preview badge */}
              <div 
                className="absolute -top-3 -right-3 w-11 h-11 rounded-full bg-zinc-900 border-2 border-emerald-400 p-0.5 shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                title="VNRT Steve Skin Face Avatar"
              >
                <MinecraftCharacterAvatar
                  skinUrl={DEFAULT_MINECRAFT_SKIN}
                  size={34}
                  mode="head"
                />
              </div>
            </div>
            <span className="text-xs text-zinc-400 mt-2.5 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Mô hình 3D: VNRT Steve
            </span>
          </div>

          {/* User Details & In-Place Username Editing */}
          <div className="flex-1 text-center sm:text-left min-w-0 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Hồ sơ Vplay Member
                </span>

                {/* Username Input or Static with Edit Button */}
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                  {isEditingUsername ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                        className="bg-black/60 border border-emerald-500/70 rounded-lg px-3 py-1 text-base sm:text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 max-w-[220px]"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveUsername}
                        className="px-3 py-1 bg-emerald-500 text-black text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Lưu
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate">
                        {settings.userName || 'User'}
                      </h2>
                      <button
                        onClick={() => setIsEditingUsername(true)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                        title="Đổi tên người dùng"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Orbs Balance Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 self-center sm:self-auto">
                <Coins className="w-4 h-4 fill-amber-400" />
                <span className="text-xs font-extrabold font-mono">{orbs.toLocaleString()} Orbs</span>
              </div>
            </div>

            {/* Auth Account Details & Sign In / Sign Out */}
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isAuthenticated ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
                <div className="text-left">
                  {isAuthenticated && user ? (
                    <div>
                      <div className="font-semibold text-zinc-200">{user.displayName || user.email}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{user.email || `UID: ${user.uid.slice(0, 10)}...`}</div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-semibold text-zinc-300">Tài khoản Khách (Chưa đăng nhập)</div>
                      <div className="text-[11px] text-zinc-500">Đăng nhập để đồng bộ dữ liệu trên mọi thiết bị</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button: Sign In or Sign Out */}
              <div>
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      signOutUser();
                      playPopSound();
                      showIslandNotification({
                        title: 'Đã đăng xuất',
                        message: 'Hẹn gặp lại bạn!',
                        icon: 'info',
                      });
                    }}
                    className="px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Đăng xuất
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      playPopSound();
                      openAuthModal();
                    }}
                    className="px-4 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Đăng nhập ngay
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-400 block">Kênh đã xem</span>
                <span className="text-sm font-bold text-sky-400 font-mono">{tvHistory.length}</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-400 block">Space 360</span>
                <span className="text-sm font-bold text-purple-400 font-mono">{space360History.length} apps</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-400 block">Mã đã đổi</span>
                <span className="text-sm font-bold text-amber-400 font-mono">{redeemHistory.length} quà</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THREE HISTORY SUBTABS (Lịch sử xem TV, Lịch sử Space 360, Lịch sử Redeems) */}
      <div className="rounded-2xl p-5 sm:p-6 bg-zinc-900/80 border border-zinc-800/80 shadow-md">
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                playPopSound();
                setActiveHistoryTab('tv');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeHistoryTab === 'tv'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              Lịch sử xem TV ({tvHistory.length})
            </button>

            <button
              onClick={() => {
                playPopSound();
                setActiveHistoryTab('space360');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeHistoryTab === 'space360'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              Lịch sử Space 360 ({space360History.length})
            </button>

            <button
              onClick={() => {
                playPopSound();
                setActiveHistoryTab('redeems');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeHistoryTab === 'redeems'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              Lịch sử đổi quà ({redeemHistory.length})
            </button>
          </div>

          {/* Quick Clear Action Button for active subtab */}
          <div className="shrink-0 flex items-center gap-2">
            {activeHistoryTab === 'tv' && tvHistory.length > 0 && (
              <button
                onClick={handleClearTv}
                className="text-[11px] text-zinc-400 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                Xóa lịch sử TV
              </button>
            )}
            {activeHistoryTab === 'space360' && space360History.length > 0 && (
              <button
                onClick={handleClearSpace360}
                className="text-[11px] text-zinc-400 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                Xóa lịch sử Space 360
              </button>
            )}
            {activeHistoryTab === 'redeems' && redeemHistory.length > 0 && (
              <button
                onClick={handleClearRedeems}
                className="text-[11px] text-zinc-400 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                Xóa lịch sử đổi quà
              </button>
            )}
          </div>
        </div>

        {/* 3. CONTENT PER SUBTAB */}
        <div className="pt-4">
          {/* TAB 1: TV WATCH HISTORY */}
          {activeHistoryTab === 'tv' && (
            <div>
              {tvHistory.length === 0 ? (
                <div className="text-center py-10 space-y-2 text-zinc-500">
                  <Tv className="w-10 h-10 mx-auto opacity-40 text-sky-400" />
                  <p className="text-sm">Chưa có lịch sử xem truyền hình nào.</p>
                  <button
                    onClick={() => navigate?.('/live-tv')}
                    className="text-xs text-sky-400 hover:underline inline-flex items-center gap-1 mt-2 cursor-pointer"
                  >
                    Khám phá các kênh truyền hình ngay <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {tvHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-zinc-950/50 hover:bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between gap-3 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Channel Logo / Number */}
                        <div className="w-12 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                          {item.logoUrl ? (
                            <img
                              src={item.logoUrl}
                              alt={item.channelName}
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="font-minecraft text-xs font-bold text-sky-400">{item.channelNumber}</span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-sky-400 transition-colors">
                            {item.channelName}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                            <span className="font-mono text-sky-400">CH {item.channelNumber}</span>
                            <span>•</span>
                            <span className="truncate">{item.category}</span>
                            <span>•</span>
                            <span className="text-zinc-500">{item.watchedAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Watch Again Button */}
                      <button
                        onClick={() => {
                          playPopSound();
                          navigate?.('/live-tv');
                        }}
                        className="px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-black font-bold text-xs rounded-lg transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                        title="Xem lại kênh này"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline">Xem lại</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SPACE 360 APP USAGE HISTORY */}
          {activeHistoryTab === 'space360' && (
            <div>
              {space360History.length === 0 ? (
                <div className="text-center py-10 space-y-2 text-zinc-500">
                  <Box className="w-10 h-10 mx-auto opacity-40 text-purple-400" />
                  <p className="text-sm">Chưa có ứng dụng Space 360 nào được mở gần đây.</p>
                  <button
                    onClick={() => navigate?.('/v-apps')}
                    className="text-xs text-purple-400 hover:underline inline-flex items-center gap-1 mt-2 cursor-pointer"
                  >
                    Khám phá kho ứng dụng Space 360 <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {space360History.map((app) => (
                    <div
                      key={app.id}
                      className="p-3 rounded-xl bg-zinc-950/50 hover:bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between gap-3 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-400">
                          <Box className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-purple-400 transition-colors">
                            {app.appName}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                            <span className="text-purple-400">{app.category}</span>
                            <span>•</span>
                            <span>Đã mở {app.launchCount} lần</span>
                            <span>•</span>
                            <span className="text-zinc-500">{app.lastUsedAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Launch App Button */}
                      <button
                        onClick={() => {
                          playPopSound();
                          navigate?.(app.route);
                        }}
                        className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Khởi chạy</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REDEEM GIFTS HISTORY */}
          {activeHistoryTab === 'redeems' && (
            <div>
              {redeemHistory.length === 0 ? (
                <div className="text-center py-10 space-y-2 text-zinc-500">
                  <Gift className="w-10 h-10 mx-auto opacity-40 text-amber-400" />
                  <p className="text-sm">Bạn chưa kích hoạt mã đổi quà nào.</p>
                  <button
                    onClick={() => navigate?.('/redeem')}
                    className="text-xs text-amber-400 hover:underline inline-flex items-center gap-1 mt-2 cursor-pointer font-bold"
                  >
                    Đến trang Nhập mã đổi quà <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {redeemHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/80 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                          <Gift className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-minecraft text-xs font-bold text-amber-300 tracking-wider">
                              {item.code}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Đã nhận
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-zinc-200 mt-0.5 truncate">
                            {item.rewardName}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                            {item.orbs && item.orbs > 0 && (
                              <span className="text-amber-400 font-mono">+{item.orbs} Orbs</span>
                            )}
                            <span>•</span>
                            <span className="text-zinc-500">{item.redeemedAt}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate?.('/redeem')}
                        className="px-2.5 py-1 text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0 font-medium"
                      >
                        Đổi thêm
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsSection;
