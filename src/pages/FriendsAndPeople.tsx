import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Tv, 
  MessageSquare, 
  Sparkles, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Check, 
  X, 
  ShieldCheck, 
  Award, 
  Trophy, 
  Flame, 
  Radio, 
  Clock, 
  Gift, 
  Send, 
  Eye, 
  Grid, 
  List, 
  ChevronRight, 
  Copy, 
  CheckCheck,
  Share2,
  Smile,
  Zap,
  Activity,
  Heart,
  Compass,
  Gem
} from 'lucide-react';
import { 
  VplayUser, 
  CURRENT_USER, 
  MOCK_100_FRIENDS, 
  MOCK_FRIEND_REQUESTS, 
  FriendRequest 
} from '../data/mockFriendsData';
import { useOrbs } from '../hooks/useOrbs';
import { playPopSound, playWinSound } from '../utils/sound';
import { Channel } from '../types';

interface FriendsAndPeopleProps {
  channels?: Channel[];
  onSelectChannel?: (channel: Channel) => void;
  navigate: (route: string, state?: any) => void;
}

export const FriendsAndPeople: React.FC<FriendsAndPeopleProps> = ({
  channels = [],
  onSelectChannel,
  navigate
}) => {
  const { orbs, spendOrbs, addOrbs } = useOrbs();

  // State
  const [friendsList, setFriendsList] = useState<VplayUser[]>(MOCK_100_FRIENDS);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(MOCK_FRIEND_REQUESTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'joinable' | 'online' | 'offline' | 'requests' | 'leaderboard'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'level' | 'orbs' | 'mutual' | 'name'>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals & Drawers
  const [selectedUser, setSelectedUser] = useState<VplayUser | null>(null);
  const [chatUser, setChatUser] = useState<VplayUser | null>(null);
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: 'me' | 'them'; text: string; time: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [giftUser, setGiftUser] = useState<VplayUser | null>(null);
  const [giftAmount, setGiftAmount] = useState<number>(100);
  const [giftMessage, setGiftMessage] = useState<string>('Tặng bạn ít Orbs xem phim vui vẻ nhé! 💎');
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [newFriendTag, setNewFriendTag] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedTag, setCopiedTag] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Filter & Search Logic
  const filteredUsers = useMemo(() => {
    let list = [...friendsList];

    // Status filter
    if (activeFilter === 'joinable') {
      list = list.filter((u) => u.status === 'joinable');
    } else if (activeFilter === 'online') {
      list = list.filter((u) => u.status === 'online');
    } else if (activeFilter === 'offline') {
      list = list.filter((u) => u.status === 'offline');
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.tag.toLowerCase().includes(q) ||
          u.activity.toLowerCase().includes(q) ||
          (u.badge && u.badge.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'level') {
      list.sort((a, b) => (b.level || 0) - (a.level || 0));
    } else if (sortBy === 'orbs') {
      list.sort((a, b) => (b.orbs || 0) - (a.orbs || 0));
    } else if (sortBy === 'mutual') {
      list.sort((a, b) => (b.mutualFriends || 0) - (a.mutualFriends || 0));
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [friendsList, searchQuery, activeFilter, sortBy]);

  // Statistics
  const totalUsersCount = friendsList.length + 1; // including you
  const joinableCount = useMemo(() => friendsList.filter((u) => u.status === 'joinable').length, [friendsList]);
  const onlineCount = useMemo(() => friendsList.filter((u) => u.status === 'online').length, [friendsList]);
  const offlineCount = useMemo(() => friendsList.filter((u) => u.status === 'offline').length, [friendsList]);

  // Leaderboard Top 10
  const leaderboardUsers = useMemo(() => {
    const combined = [CURRENT_USER, ...friendsList];
    return [...combined].sort((a, b) => (b.orbs || 0) - (a.orbs || 0)).slice(0, 10);
  }, [friendsList]);

  // Actions
  const handleAcceptRequest = (req: FriendRequest) => {
    playWinSound();
    setFriendRequests((prev) => prev.filter((r) => r.id !== req.id));
    setFriendsList((prev) => [req.user, ...prev]);
    showToast(`🎉 Đã kết bạn với ${req.user.name}!`);
  };

  const handleDeclineRequest = (reqId: string) => {
    playPopSound();
    setFriendRequests((prev) => prev.filter((r) => r.id !== reqId));
    showToast('Đã bỏ qua lời mời kết bạn.');
  };

  const handleTuneInUserChannel = (user: VplayUser) => {
    playPopSound();
    if (user.channelPlaying && channels.length > 0) {
      const matched = channels.find((c) => c.slug === user.channelPlaying);
      if (matched) {
        if (onSelectChannel) onSelectChannel(matched);
        navigate(`/live-tv?channel=${matched.slug}`);
        return;
      }
    }
    // Default fallback to live-tv
    navigate('/live-tv');
  };

  const handleOpenChat = (user: VplayUser) => {
    playPopSound();
    setChatUser(user);
    setChatMessages([
      {
        id: 'msg_1',
        sender: 'them',
        text: `Chào bạn! Mình là ${user.name} (${user.tag}). Rất vui được gặp bạn trên Vplay! ✨`,
        time: 'Vừa xong'
      }
    ]);
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim() || !chatUser) return;
    playPopSound();
    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'me' as const,
      text: chatInput.trim(),
      time: 'Vừa xong'
    };
    setChatMessages((prev) => [...prev, newMsg]);
    const userReplyName = chatUser.name;
    const sentText = chatInput.trim();
    setChatInput('');

    // Simulate smart auto reply
    setTimeout(() => {
      playWinSound();
      let reply = 'Hay quá! Chúng mình cùng hẹn xem phim hoặc đấu minigame trên Vplay nhé!';
      if (sentText.toLowerCase().includes('orbs') || sentText.toLowerCase().includes('cược')) {
        reply = 'Ồ bạn cũng thích săn Orbs à? Vào Copilot gõ /cược hoặc bấm tab Sàn cược Orbs để chơi Bầu Cua hoặc Lật Xu nha! 💎';
      } else if (sentText.toLowerCase().includes('vtv') || sentText.toLowerCase().includes('phim')) {
        reply = `Mình đang theo dõi ${chatUser.favoriteChannel || 'VTV3 HD'}, chất lượng sắc nét mượt mà lắm!`;
      }
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg_rep_${Date.now()}`,
          sender: 'them',
          text: reply,
          time: 'Vừa xong'
        }
      ]);
    }, 1200);
  };

  const handleSendGiftOrbs = () => {
    if (!giftUser) return;
    if (orbs < giftAmount) {
      playPopSound();
      showToast('❌ Bạn không đủ Orbs để thực hiện tặng quà!');
      return;
    }

    spendOrbs(giftAmount);
    playWinSound();
    setFriendsList((prev) =>
      prev.map((u) => (u.id === giftUser.id ? { ...u, orbs: (u.orbs || 0) + giftAmount } : u))
    );
    showToast(`🎁 Đã gửi tặng ${giftAmount.toLocaleString()} Orbs đến ${giftUser.name}!`);
    setGiftUser(null);
  };

  const handleAddNewFriend = () => {
    if (!newFriendTag.trim()) return;
    playWinSound();
    const tag = newFriendTag.trim();
    showToast(`📨 Đã gửi lời mời kết bạn đến "${tag}" thành công!`);
    setNewFriendTag('');
    setIsAddFriendModalOpen(false);
  };

  const handleCopyMyTag = () => {
    navigator.clipboard.writeText(`${CURRENT_USER.name} ${CURRENT_USER.tag}`);
    setCopiedTag(true);
    playPopSound();
    showToast('📋 Đã sao chép Vplay Tag của bạn vào bộ nhớ tạm!');
    setTimeout(() => setCopiedTag(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-7 pb-24 select-none animate-in fade-in duration-300">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-[#1E1D24]/95 text-white border border-purple-500/40 shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-sm font-semibold"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO HEADER BANNER: Community Overview & Your Profile Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1D24] via-[#25242D] to-[#17161C] border border-[#34343E] shadow-2xl p-6 sm:p-8">
        {/* Background glow ambient */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#E6005A]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Community Title & Meta */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold font-mono">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>VPLAY COMMUNITY • FRIENDS & PEOPLE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Bạn bè & Người dùng Vplay</span>
              <span className="text-sm font-mono font-bold px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {totalUsersCount} Cư dân
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
              Khám phá cộng đồng Vplay Media Hub, kết nối bạn bè, cùng xem truyền hình trực tuyến, thách đấu minigame và trao đổi khoáng vật Orbs!
            </p>

            {/* Live Stats Counters */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="px-3.5 py-2 rounded-xl bg-[#2C2B35]/80 border border-[#3E3D4A] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs text-zinc-300 font-medium">Trực tuyến:</span>
                <span className="text-xs font-bold text-white font-mono">{onlineCount + 1}</span>
              </div>

              <div className="px-3.5 py-2 rounded-xl bg-[#2C2B35]/80 border border-[#3E3D4A] flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span className="text-xs text-zinc-300 font-medium">Đang xem TV / Join:</span>
                <span className="text-xs font-bold text-rose-300 font-mono">{joinableCount}</span>
              </div>

              <div className="px-3.5 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center gap-2">
                <Gem className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs text-purple-200 font-medium">Orbs của bạn:</span>
                <span className="text-xs font-black text-purple-300 font-mono">{orbs.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Right: Your Profile Quick Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#18171F]/90 border border-[#34343E] flex items-center justify-between gap-4 lg:w-80 shrink-0 shadow-inner">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative">
                <img
                  src={CURRENT_USER.avatar}
                  alt={CURRENT_USER.name}
                  className="w-12 h-12 rounded-xl bg-[#25242D] border-2 border-emerald-400 object-cover [image-rendering:pixelated]"
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#18171F]" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white truncate">{CURRENT_USER.name}</span>
                  <span className="text-[10px] font-mono font-bold text-purple-400">{CURRENT_USER.tag}</span>
                </div>
                <div className="text-xs text-zinc-400 truncate mt-0.5">
                  Cấp {CURRENT_USER.level} • {CURRENT_USER.badge}
                </div>
              </div>
            </div>

            <button
              onClick={handleCopyMyTag}
              title="Sao chép Vplay Tag để bạn bè kết bạn"
              className="p-2.5 rounded-xl bg-[#2A2933] hover:bg-purple-600/30 text-zinc-300 hover:text-white border border-[#3E3D4A] hover:border-purple-400/50 transition-all cursor-pointer shrink-0"
            >
              {copiedTag ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. TOOLBAR: Search, Category Filter Tabs & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'Tất cả', icon: Users, count: totalUsersCount },
            { id: 'joinable', label: 'Đang xem TV & Join', icon: Tv, count: joinableCount, highlight: true },
            { id: 'online', label: 'Trực tuyến', icon: Activity, count: onlineCount },
            { id: 'offline', label: 'Ngoại tuyến', icon: Clock, count: offlineCount },
            { id: 'requests', label: 'Lời mời', icon: UserPlus, count: friendRequests.length, badge: friendRequests.length > 0 },
            { id: 'leaderboard', label: 'Bảng Xếp Hạng', icon: Trophy, count: null }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  playPopSound();
                  setActiveFilter(tab.id as any);
                }}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#E6005A] text-white shadow-lg shadow-[#E6005A]/25'
                    : 'bg-[#1E1D24] text-zinc-400 hover:text-white hover:bg-[#282730] border border-[#34343E]'
                }`}
              >
                <Icon className={`w-4 h-4 ${tab.highlight && !isActive ? 'text-rose-400' : ''}`} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? 'bg-black/25 text-white' : 'bg-[#2A2933] text-zinc-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Controls: Search, Sort, Add Friend & View Mode */}
        <div className="flex items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên, #tag, hoạt động..."
              className="w-full bg-[#1E1D24] text-xs text-white placeholder-zinc-500 pl-9 pr-8 py-2.5 rounded-xl border border-[#34343E] focus:outline-none focus:border-[#E6005A] transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Add Friend Button */}
          <button
            onClick={() => {
              playPopSound();
              setIsAddFriendModalOpen(true);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-purple-500/25 transition-all cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Kết bạn</span>
          </button>

          {/* View Mode Grid/List Toggle */}
          <div className="flex items-center bg-[#1E1D24] border border-[#34343E] rounded-xl p-0.5 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-[#2E2D38] text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Chế độ lưới"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-[#2E2D38] text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Chế độ danh sách"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT: Switch between Users List, Requests Tab, or Leaderboard Tab */}

      {/* VIEW A: FRIEND REQUESTS TAB */}
      {activeFilter === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-purple-400" />
              <span>Lời mời kết bạn đang chờ ({friendRequests.length})</span>
            </h2>
          </div>

          {friendRequests.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#1E1D24] border border-[#34343E] text-zinc-400 space-y-2">
              <UserCheck className="w-10 h-10 mx-auto text-zinc-500 opacity-60" />
              <p className="font-semibold text-white">Không có lời mời kết bạn nào</p>
              <p className="text-xs">Bạn đã xử lý hết tất cả lời mời. Hãy chia sẻ #Tag để kết nối thêm nhiều bạn bè!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friendRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-[#1E1D24] border border-[#34343E] flex items-center justify-between gap-4 shadow-lg hover:border-purple-500/40 transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={req.user.avatar}
                      alt={req.user.name}
                      className="w-12 h-12 rounded-xl bg-[#25242D] border border-purple-400/40 object-cover shrink-0 [image-rendering:pixelated]"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm truncate">{req.user.name}</span>
                        <span className="text-[10px] font-mono text-purple-300">{req.user.tag}</span>
                      </div>
                      <p className="text-xs text-zinc-400 truncate">{req.user.activity}</p>
                      <span className="text-[10px] text-zinc-500 mt-1 block">
                        {req.timestamp} • {req.user.mutualFriends} bạn chung
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleAcceptRequest(req)}
                      className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-md transition-all cursor-pointer"
                      title="Chấp nhận kết bạn"
                    >
                      <Check className="w-4 h-4" />
                      <span className="hidden sm:inline">Chấp nhận</span>
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      className="p-2.5 rounded-xl bg-[#2A2933] hover:bg-rose-900/40 text-zinc-400 hover:text-rose-300 text-xs font-bold transition-all cursor-pointer"
                      title="Từ chối"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW B: LEADERBOARD TAB */}
      {activeFilter === 'leaderboard' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Bảng Xếp Hạng Đại Gia Khoáng Vật Orbs Vplay</span>
            </h2>
            <span className="text-xs text-zinc-400 font-mono">Top 10 Cư Dân</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {leaderboardUsers.map((user, index) => {
              const isTop1 = index === 0;
              const isTop2 = index === 1;
              const isTop3 = index === 2;

              return (
                <div
                  key={user.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                    isTop1
                      ? 'bg-gradient-to-r from-amber-950/40 via-[#1E1D24] to-[#1E1D24] border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : isTop2
                      ? 'bg-gradient-to-r from-slate-800/40 via-[#1E1D24] to-[#1E1D24] border-slate-400/40'
                      : isTop3
                      ? 'bg-gradient-to-r from-amber-900/30 via-[#1E1D24] to-[#1E1D24] border-amber-700/40'
                      : 'bg-[#1E1D24] border-[#34343E]'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Rank Number / Trophy */}
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black font-mono text-sm shrink-0">
                      {isTop1 ? (
                        <span className="text-2xl drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">🥇</span>
                      ) : isTop2 ? (
                        <span className="text-2xl">🥈</span>
                      ) : isTop3 ? (
                        <span className="text-2xl">🥉</span>
                      ) : (
                        <span className="text-zinc-400">#{index + 1}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-11 h-11 rounded-xl bg-[#25242D] border border-zinc-700 object-cover [image-rendering:pixelated]"
                      />
                      {user.isYou && (
                        <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded bg-purple-600 text-[8px] font-bold text-white uppercase">
                          Bạn
                        </span>
                      )}
                    </div>

                    {/* User Meta */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm sm:text-base truncate">{user.name}</span>
                        <span className="text-xs font-mono text-purple-300">{user.tag}</span>
                        {user.badge && (
                          <span className={`hidden sm:inline px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r ${user.badgeColor || 'from-purple-500 to-indigo-600 text-white'}`}>
                            {user.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">
                        Cấp độ {user.level || 1} • {user.activity}
                      </p>
                    </div>
                  </div>

                  {/* Orbs Balance */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-black text-purple-300 font-mono tracking-tight flex items-center justify-end gap-1">
                        <span>{(user.orbs || 0).toLocaleString()}</span>
                        <span className="text-xs text-purple-400 font-bold">ORBS</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-medium">Khoáng vật tích lũy</span>
                    </div>

                    {!user.isYou && (
                      <button
                        onClick={() => {
                          playPopSound();
                          setGiftUser(user);
                        }}
                        className="p-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 transition-all cursor-pointer"
                        title="Tặng Orbs cho người này"
                      >
                        <Gift className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW C: STANDARD USERS GRID / LIST VIEW */}
      {activeFilter !== 'requests' && activeFilter !== 'leaderboard' && (
        <div>
          {filteredUsers.length === 0 ? (
            <div className="p-16 text-center rounded-2xl bg-[#1E1D24] border border-[#34343E] text-zinc-400 space-y-3">
              <Compass className="w-12 h-12 mx-auto text-zinc-600 opacity-70" />
              <p className="text-base font-bold text-white">Không tìm thấy người dùng phù hợp</p>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Thử thay đổi từ khóa tìm kiếm hoặc bấm vào bộ lọc "Tất cả" để xem toàn bộ 100+ cư dân Vplay.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-[#2A2933] hover:bg-white/10 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Bento Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredUsers.map((user) => {
                const isJoinable = user.status === 'joinable';
                const isOnline = user.status === 'online';

                return (
                  <div
                    key={user.id}
                    className="group relative overflow-hidden rounded-2xl bg-[#1E1D24] hover:bg-[#23222B] border border-[#34343E] hover:border-purple-500/50 p-4 transition-all duration-200 shadow-md flex flex-col justify-between"
                  >
                    {/* Top user row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar with Status Ring */}
                        <div className="relative shrink-0">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-xl bg-[#282730] border border-zinc-700 group-hover:border-purple-400/60 object-cover [image-rendering:pixelated] transition-transform group-hover:scale-105"
                          />
                          <span
                            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#1E1D24] ${
                              isJoinable
                                ? 'bg-cyan-400 ring-2 ring-cyan-400/40 animate-pulse'
                                : isOnline
                                ? 'bg-emerald-400'
                                : 'bg-zinc-600'
                            }`}
                          />
                        </div>

                        {/* Name & Tag */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-white text-sm truncate group-hover:text-purple-300 transition-colors">
                              {user.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                            <span>{user.tag}</span>
                            <span>•</span>
                            <span className="text-amber-400 font-bold">Lv.{user.level || 1}</span>
                          </div>
                        </div>
                      </div>

                      {/* Info Drawer Trigger */}
                      <button
                        onClick={() => {
                          playPopSound();
                          setSelectedUser(user);
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        title="Xem hồ sơ chi tiết"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Activity Pill */}
                    <div className="mt-3.5 pt-3 border-t border-[#2C2B36] space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs">
                        {isJoinable ? (
                          <Tv className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-bounce" />
                        ) : isOnline ? (
                          <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        )}
                        <span
                          className={`truncate font-medium ${
                            isJoinable
                              ? 'text-cyan-300 font-bold'
                              : isOnline
                              ? 'text-emerald-300'
                              : 'text-zinc-400'
                          }`}
                        >
                          {user.activity}
                        </span>
                      </div>

                      {/* Mutual friends & Badges */}
                      <div className="flex items-center justify-between text-[10px] text-zinc-500">
                        <span>{user.mutualFriends} bạn chung</span>
                        <span className="font-mono text-purple-300 font-bold">
                          {(user.orbs || 0).toLocaleString()} Orbs
                        </span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-3.5 grid grid-cols-3 gap-1.5 pt-2">
                      {isJoinable ? (
                        <button
                          onClick={() => handleTuneInUserChannel(user)}
                          className="col-span-1 py-1.5 px-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
                          title="Vào xem cùng kênh truyền hình"
                        >
                          <Tv className="w-3 h-3" />
                          <span>Xem</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            playPopSound();
                            setSelectedUser(user);
                          }}
                          className="col-span-1 py-1.5 px-2 rounded-lg bg-[#2A2933] hover:bg-[#343340] text-zinc-300 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                          title="Xem hồ sơ"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Hồ sơ</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenChat(user)}
                        className="col-span-1 py-1.5 px-2 rounded-lg bg-[#2A2933] hover:bg-[#343340] text-zinc-300 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                        title="Gửi tin nhắn trực tiếp"
                      >
                        <MessageSquare className="w-3 h-3 text-purple-400" />
                        <span>Chat</span>
                      </button>

                      <button
                        onClick={() => {
                          playPopSound();
                          setGiftUser(user);
                        }}
                        className="col-span-1 py-1.5 px-2 rounded-lg bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                        title="Tặng Orbs"
                      >
                        <Gift className="w-3 h-3 text-purple-300" />
                        <span>Tặng</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table / List View */
            <div className="rounded-2xl bg-[#1E1D24] border border-[#34343E] divide-y divide-[#2C2B36] overflow-hidden shadow-lg">
              {filteredUsers.map((user) => {
                const isJoinable = user.status === 'joinable';
                const isOnline = user.status === 'online';

                return (
                  <div
                    key={user.id}
                    className="p-3.5 sm:p-4 flex items-center justify-between gap-4 hover:bg-[#25242E] transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-xl bg-[#282730] border border-zinc-700 object-cover [image-rendering:pixelated]"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#1E1D24] ${
                            isJoinable
                              ? 'bg-cyan-400 ring-1 ring-cyan-400/50 animate-pulse'
                              : isOnline
                              ? 'bg-emerald-400'
                              : 'bg-zinc-600'
                          }`}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm truncate">{user.name}</span>
                          <span className="text-xs font-mono text-purple-300">{user.tag}</span>
                          <span className="text-xs text-amber-400 font-bold font-mono">Lv.{user.level || 1}</span>
                        </div>
                        <p className="text-xs text-zinc-400 truncate mt-0.5 flex items-center gap-1.5">
                          <span>{user.activity}</span>
                          <span className="text-zinc-600">•</span>
                          <span>{user.mutualFriends} bạn chung</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isJoinable && (
                        <button
                          onClick={() => handleTuneInUserChannel(user)}
                          className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                        >
                          <Tv className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Cùng xem</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenChat(user)}
                        className="p-2 rounded-xl bg-[#2A2933] hover:bg-[#343340] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        title="Nhắn tin"
                      >
                        <MessageSquare className="w-4 h-4 text-purple-400" />
                      </button>

                      <button
                        onClick={() => {
                          playPopSound();
                          setGiftUser(user);
                        }}
                        className="p-2 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 hover:text-white transition-colors cursor-pointer"
                        title="Tặng Orbs"
                      >
                        <Gift className="w-4 h-4 text-purple-300" />
                      </button>

                      <button
                        onClick={() => {
                          playPopSound();
                          setSelectedUser(user);
                        }}
                        className="p-2 rounded-xl bg-[#2A2933] hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Chi tiết hồ sơ"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. MODAL: USER PROFILE DETAILS */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-[#1E1D24] border border-[#34343E] rounded-3xl p-6 shadow-2xl z-10 overflow-hidden space-y-5"
            >
              {/* Header Profile Cover Glow */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-rose-900/40 border-b border-[#34343E]" />

              <div className="relative pt-6 flex items-start justify-between">
                <div className="relative">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-20 h-20 rounded-2xl bg-[#25242D] border-4 border-[#1E1D24] shadow-xl object-cover [image-rendering:pixelated]"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-[#1E1D24] ${
                      selectedUser.status === 'joinable'
                        ? 'bg-cyan-400 ring-2 ring-cyan-400/40'
                        : selectedUser.status === 'online'
                        ? 'bg-emerald-400'
                        : 'bg-zinc-600'
                    }`}
                  />
                </div>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 rounded-full bg-[#2A2933] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{selectedUser.name}</h2>
                  <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-md border border-purple-400/30">
                    {selectedUser.tag}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">Cấp độ {selectedUser.level || 1} • Tham gia từ {selectedUser.joinDate || '2026'}</p>
              </div>

              {/* Badges & Stats */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-[#282730] border border-[#3A3945]">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">Khoáng vật Orbs</span>
                  <span className="text-base font-black text-purple-300 font-mono mt-0.5 block">
                    {(selectedUser.orbs || 0).toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#282730] border border-[#3A3945]">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">Bạn chung</span>
                  <span className="text-base font-bold text-white font-mono mt-0.5 block">
                    {selectedUser.mutualFriends || 0} người
                  </span>
                </div>
              </div>

              {/* User Bio */}
              <div className="p-3.5 rounded-xl bg-[#24232C] border border-[#34343E] text-xs text-zinc-300 leading-relaxed italic">
                "{selectedUser.bio || 'Thành viên cộng đồng Vplay Media Hub.'}"
              </div>

              {/* Live Activity & Favorite Channel */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#282730]">
                  <span className="text-zinc-400">Hoạt động hiện tại:</span>
                  <span className="font-bold text-cyan-300">{selectedUser.activity}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#282730]">
                  <span className="text-zinc-400">Kênh yêu thích:</span>
                  <span className="font-bold text-white">{selectedUser.favoriteChannel || 'VTV3 HD'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    const u = selectedUser;
                    setSelectedUser(null);
                    handleOpenChat(u);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Nhắn tin</span>
                </button>

                <button
                  onClick={() => {
                    const u = selectedUser;
                    setSelectedUser(null);
                    setGiftUser(u);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-[#2A2933] hover:bg-[#383745] text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Gift className="w-4 h-4 text-purple-400" />
                  <span>Tặng Orbs</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. MODAL: DIRECT MESSAGES CHAT */}
      <AnimatePresence>
        {chatUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setChatUser(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-[#1E1D24] border border-[#34343E] rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col h-[520px]"
            >
              {/* Chat Header */}
              <div className="p-4 bg-[#26252F] border-b border-[#34343E] flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <img
                      src={chatUser.avatar}
                      alt={chatUser.name}
                      className="w-10 h-10 rounded-xl bg-[#1E1D24] border border-zinc-700 object-cover [image-rendering:pixelated]"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#26252F]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-sm truncate">{chatUser.name}</span>
                      <span className="text-[10px] font-mono text-purple-300">{chatUser.tag}</span>
                    </div>
                    <span className="text-[11px] text-zinc-400 truncate block">{chatUser.activity}</span>
                  </div>
                </div>

                <button
                  onClick={() => setChatUser(null)}
                  className="p-2 rounded-full bg-[#343340] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Message Flow */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 no-scrollbar bg-[#191820]">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                        msg.sender === 'me'
                          ? 'bg-[#E6005A] text-white rounded-tr-xs shadow-md'
                          : 'bg-[#2A2933] text-zinc-100 rounded-tl-xs border border-[#3E3D4A]'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-zinc-500 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-3 bg-[#26252F] border-t border-[#34343E] flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendChatMessage();
                  }}
                  placeholder={`Nhắn tin cho ${chatUser.name}...`}
                  className="flex-1 bg-[#1A1921] text-xs text-white placeholder-zinc-500 px-3.5 py-2.5 rounded-xl border border-[#34343E] focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleSendChatMessage}
                  disabled={!chatInput.trim()}
                  className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white transition-all cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. MODAL: GIFT ORBS */}
      <AnimatePresence>
        {giftUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setGiftUser(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-[#1E1D24] border border-[#34343E] rounded-3xl p-6 shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/70 border border-purple-500/40 flex items-center justify-center text-purple-300">
                    <Gem className="w-5 h-5 text-purple-300 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Tặng Khoáng Vật Orbs</h2>
                    <p className="text-xs text-zinc-400">Người nhận: <span className="text-white font-bold">{giftUser.name}</span></p>
                  </div>
                </div>
                <button
                  onClick={() => setGiftUser(null)}
                  className="p-2 rounded-full bg-[#2A2933] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Select Amount */}
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-2">Chọn mức Orbs tặng:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[50, 100, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => {
                        playPopSound();
                        setGiftAmount(amt);
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                        giftAmount === amt
                          ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                          : 'bg-[#282730] text-zinc-300 border-[#383744] hover:border-purple-400/40'
                      }`}
                    >
                      +{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">Lời nhắn đính kèm:</label>
                <input
                  type="text"
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  className="w-full bg-[#18171F] text-xs text-white px-3.5 py-2.5 rounded-xl border border-[#34343E] focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 bg-[#282730] p-3 rounded-xl">
                <span>Số dư Orbs hiện tại của bạn:</span>
                <span className="font-black text-purple-300 font-mono">{orbs.toLocaleString()} ORBS</span>
              </div>

              <button
                onClick={handleSendGiftOrbs}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Xác nhận gửi {giftAmount.toLocaleString()} Orbs</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. MODAL: ADD FRIEND BY TAG */}
      <AnimatePresence>
        {isAddFriendModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddFriendModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-[#1E1D24] border border-[#34343E] rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-purple-400" />
                  <span>Kết bạn mới trên Vplay</span>
                </h2>
                <button
                  onClick={() => setIsAddFriendModalOpen(false)}
                  className="p-2 rounded-full bg-[#2A2933] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Nhập chính xác Vplay Tag (ví dụ: <code className="bg-black/40 px-1.5 py-0.5 rounded text-purple-300 font-mono">#1024</code>) hoặc tên người dùng bạn muốn kết nối.
              </p>

              <div>
                <input
                  type="text"
                  value={newFriendTag}
                  onChange={(e) => setNewFriendTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddNewFriend();
                  }}
                  placeholder="Ví dụ: #1024 hoặc Nguyễn Văn A..."
                  className="w-full bg-[#18171F] text-xs text-white placeholder-zinc-500 px-3.5 py-2.5 rounded-xl border border-[#34343E] focus:outline-none focus:border-purple-500"
                  autoFocus
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsAddFriendModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#2A2933] text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddNewFriend}
                  disabled={!newFriendTag.trim()}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Gửi lời mời
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
