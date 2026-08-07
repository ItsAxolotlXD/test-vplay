import React, { useState, useMemo } from 'react';
import { Search, X, MoreVertical, MessageSquare, Tv, UserCheck, UserX, Check, Users, Radio, Bell, Coins } from 'lucide-react';
import { playPopSound } from '../utils/sound';
import {
  VplayUser,
  CURRENT_USER,
  MOCK_100_FRIENDS,
  MOCK_FRIEND_REQUESTS,
  FriendRequest
} from '../data/mockFriendsData';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { VplayPrimaryButton } from './ui/VplayPrimaryButton';

interface FriendsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUserChannel?: (channelName: string) => void;
}

export const FriendsDrawer: React.FC<FriendsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectUserChannel,
}) => {
  const [activeTab, setActiveTab] = useState<'people' | 'requests'>('people');
  const [searchQuery, setSearchQuery] = useState('');
  const [openGroupJoinable, setOpenGroupJoinable] = useState(true);
  const [openGroupOnline, setOpenGroupOnline] = useState(true);
  const [openGroupOffline, setOpenGroupOffline] = useState(true);
  const [selectedUser, setSelectedUser] = useState<VplayUser | null>(null);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(MOCK_FRIEND_REQUESTS);
  const [friendsList, setFriendsList] = useState<VplayUser[]>(MOCK_100_FRIENDS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleClose = () => {
    playPopSound();
    onClose();
  };

  // Filter 100 friends based on searchQuery
  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return friendsList;
    const q = searchQuery.toLowerCase().trim();
    return friendsList.filter(
      (f) => f.name.toLowerCase().includes(q) || f.tag.toLowerCase().includes(q) || f.activity.toLowerCase().includes(q)
    );
  }, [searchQuery, friendsList]);

  // Grouped friends
  const joinableFriends = useMemo(
    () => filteredFriends.filter((f) => f.status === 'joinable'),
    [filteredFriends]
  );
  const onlineFriends = useMemo(
    () => filteredFriends.filter((f) => f.status === 'online'),
    [filteredFriends]
  );
  const offlineFriends = useMemo(
    () => filteredFriends.filter((f) => f.status === 'offline'),
    [filteredFriends]
  );

  if (!isOpen) return null;

  const handleAcceptRequest = (reqId: string, user: VplayUser) => {
    playPopSound();
    setFriendRequests((prev) => prev.filter((r) => r.id !== reqId));
    setFriendsList((prev) => [user, ...prev]);
    showToast(`Đã chấp nhận lời mời kết bạn từ ${user.name}`);
  };

  const handleDeclineRequest = (reqId: string) => {
    playPopSound();
    setFriendRequests((prev) => prev.filter((r) => r.id !== reqId));
    showToast(`Đã từ chối lời mời kết bạn`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end select-none font-jura">
      {/* Semi-transparent Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[1px] transition-opacity duration-150"
        onClick={handleClose}
      />

      {/* Main Drawer Container - Authentic Minecraft Bedrock Ore UI Panel */}
      <div className="relative w-full max-w-[360px] sm:max-w-[400px] h-full bg-[#3c3e41] text-white border-l-4 border-[#141414] shadow-[inset_2px_2px_0_#5a5d61,inset_-2px_-2px_0_#222325] flex flex-col z-10 overflow-hidden">
        
        {/* TOP BAR: Search Input & Close Button */}
        <div className="p-2 sm:p-2.5 bg-[#2b2d30] border-b-2 border-[#141414] flex items-center gap-2 shrink-0">
          {/* Search Box in mc-input-box style */}
          <div className="flex-1 relative flex items-center bg-[#1e2022] border-2 border-[#141414] px-2 py-1 shadow-[inset_2px_2px_0_#101112]">
            <Search className="w-4 h-4 text-zinc-400 shrink-0 mr-1.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for people..."
              className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none font-jura font-semibold"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  playPopSound();
                  setSearchQuery('');
                }}
                className="text-zinc-400 hover:text-white p-0.5 ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Square Close Button */}
          <VplaySecondaryButton
            onClick={handleClose}
            aria-label="Close"
            size="sm"
            className="!w-8 !h-8 !p-0 shrink-0"
          >
            <X className="w-4 h-4 text-[#141414]" />
          </VplaySecondaryButton>
        </div>

        {/* SUB-NAVIGATION TABS (Minecraft Bedrock Ore UI Bracket Style) */}
        <div className="bg-[#242628] border-b-2 border-[#141414] px-1 flex items-center justify-between text-xs font-bold font-jura shrink-0">
          <div className="flex items-center gap-1 w-full">
            {/* People Tab */}
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setActiveTab('people');
              }}
              className={`flex-1 py-2 px-3 flex items-center justify-center gap-1.5 border-b-2 cursor-default btn-press-effect ${
                activeTab === 'people'
                  ? 'border-white text-white bg-[#3e4144] shadow-[inset_1px_1px_0_#585b5e]'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#2e3033]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="font-mono">[ 👥 ]</span>
            </button>

            {/* Requests Tab */}
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setActiveTab('requests');
              }}
              className={`flex-1 py-2 px-3 flex items-center justify-center gap-1.5 border-b-2 cursor-default btn-press-effect relative ${
                activeTab === 'requests'
                  ? 'border-white text-white bg-[#3e4144] shadow-[inset_1px_1px_0_#585b5e]'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#2e3033]'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span className="font-mono flex items-center gap-1">
                [ 📡 ]
                {friendRequests.length > 0 && (
                  <span className="bg-[#e63946] text-white text-[9px] font-bold px-1.5 py-0.2 border border-[#141414]">
                    {friendRequests.length}
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* HEADER SECTION TITLE: PEOPLE */}
        <div className="bg-[#2e3033] border-b-2 border-[#141414] py-1.5 px-3 flex items-center justify-between shrink-0">
          <h2 className="font-jura font-black text-sm tracking-widest text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {activeTab === 'people' ? 'PEOPLE' : 'FRIEND REQUESTS'}
          </h2>
          <div className="flex items-center gap-1.5 bg-[#18191b] border-2 border-[#141414] px-2 py-0.5 shadow-[inset_1px_1px_0_#101112]">
            <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-amber-300 font-bold font-mono text-[11px]">1.000 Khoáng Thạch</span>
          </div>
        </div>

        {/* CONTENT SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-3 custom-scrollbar">
          
          {/* TOAST NOTIFICATION */}
          {toastMessage && (
            <div className="bg-[#28960b] text-white text-xs font-bold px-3 py-2 border-2 border-[#141414] shadow-[inset_1px_1px_0_#89dc69] flex items-center justify-between">
              <span>{toastMessage}</span>
              <Check className="w-4 h-4" />
            </div>
          )}

          {activeTab === 'people' ? (
            <>
              {/* CARD FOR "YOU" (CURRENT USER) */}
              {!searchQuery && (
                <div className="bg-[#242628] border-2 border-[#141414] p-2 shadow-[inset_1px_1px_0_#383b3e] flex items-center justify-between group">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Avatar box */}
                    <div className="relative w-10 h-10 bg-black border-2 border-[#141414] shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={CURRENT_USER.avatar}
                        alt="You"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover [image-rendering:pixelated]"
                      />
                      <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-[#55ff55] border border-black" />
                    </div>

                    {/* Text Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white truncate font-jura">
                          {CURRENT_USER.name}
                        </span>
                        <span className="text-[11px] font-extrabold text-[#ffff55] font-jura">
                          (You)
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-jura truncate">
                        {CURRENT_USER.activity}
                      </p>
                    </div>
                  </div>

                  <span className="text-[9px] bg-[#1a1b1c] text-[#89dc69] border border-[#141414] px-1.5 py-0.5 font-bold font-jura">
                    Online
                  </span>
                </div>
              )}

              {/* SEARCH RESULTS FEEDBACK */}
              {searchQuery && filteredFriends.length === 0 && (
                <div className="text-center py-8 text-zinc-400 text-xs font-jura">
                  Không tìm thấy người dùng nào phù hợp với &quot;{searchQuery}&quot;
                </div>
              )}

              {/* GROUP 1: JOINABLE FRIENDS */}
              {joinableFriends.length > 0 && (
                <div className="space-y-1">
                  {/* Bedrock Tab Header Pill */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        playPopSound();
                        setOpenGroupJoinable(!openGroupJoinable);
                      }}
                      className="bg-[#28960b] hover:bg-[#31aa0e] text-white border-2 border-[#141414] shadow-[inset_1px_1px_0_#89dc69,inset_-1px_-1px_0_#1b5e20] px-3 py-1 flex items-center gap-2 text-xs font-bold font-jura cursor-default active:translate-y-[1px]"
                    >
                      <span className="text-[10px]">{openGroupJoinable ? '▼' : '►'}</span>
                      <span>Joinable friends ({joinableFriends.length})</span>
                    </button>
                    <span className="text-[9px] bg-[#28960b] text-white font-bold px-1.5 py-0.5 border border-[#141414]">
                      LIVE
                    </span>
                  </div>

                  {/* List Items Container */}
                  {openGroupJoinable && (
                    <div className="bg-[#2b2d30] border-2 border-[#141414] p-1.5 space-y-1">
                      {joinableFriends.map((user) => (
                        <div
                          key={user.id}
                          className="bg-[#212325] hover:bg-[#34373a] border-2 border-[#141414] hover:border-white p-1.5 flex items-center justify-between group transition-none"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {/* Avatar Box */}
                            <div className="relative w-9 h-9 bg-black border border-[#141414] shrink-0 flex items-center justify-center overflow-hidden">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover [image-rendering:pixelated]"
                              />
                              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#55ff55] border border-black" />
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-xs text-white truncate font-jura">
                                  {user.name}
                                </span>
                              </div>
                              <p className="text-[10px] text-[#89dc69] font-semibold font-jura truncate">
                                {user.activity}
                              </p>
                            </div>
                          </div>

                          {/* Options dots button */}
                          <button
                            type="button"
                            onClick={() => {
                              playPopSound();
                              setSelectedUser(user);
                            }}
                            className="w-7 h-7 bg-[#2d2f32] hover:bg-[#28960b] hover:text-white border-2 border-[#141414] hover:border-white flex items-center justify-center text-zinc-300 active:translate-y-[1px] ml-1 shrink-0"
                            title="Tùy chọn"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* GROUP 2: ONLINE FRIENDS */}
              {onlineFriends.length > 0 && (
                <div className="space-y-1">
                  {/* Bedrock Tab Header Pill */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        playPopSound();
                        setOpenGroupOnline(!openGroupOnline);
                      }}
                      className="bg-[#28960b] hover:bg-[#31aa0e] text-white border-2 border-[#141414] shadow-[inset_1px_1px_0_#89dc69,inset_-1px_-1px_0_#1b5e20] px-3 py-1 flex items-center gap-2 text-xs font-bold font-jura cursor-default active:translate-y-[1px]"
                    >
                      <span className="text-[10px]">{openGroupOnline ? '▼' : '►'}</span>
                      <span>Online ({onlineFriends.length})</span>
                    </button>
                  </div>

                  {/* List Items Container */}
                  {openGroupOnline && (
                    <div className="bg-[#2b2d30] border-2 border-[#141414] p-1.5 space-y-1">
                      {onlineFriends.map((user) => (
                        <div
                          key={user.id}
                          className="bg-[#212325] hover:bg-[#34373a] border-2 border-[#141414] hover:border-white p-1.5 flex items-center justify-between group transition-none"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {/* Avatar Box */}
                            <div className="relative w-9 h-9 bg-black border border-[#141414] shrink-0 flex items-center justify-center overflow-hidden">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover [image-rendering:pixelated]"
                              />
                              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#55ff55] border border-black" />
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                              <span className="font-bold text-xs text-white truncate font-jura block">
                                {user.name}
                              </span>
                              <p className="text-[10px] text-zinc-300 font-jura truncate">
                                {user.activity}
                              </p>
                            </div>
                          </div>

                          {/* Options dots button */}
                          <button
                            type="button"
                            onClick={() => {
                              playPopSound();
                              setSelectedUser(user);
                            }}
                            className="w-7 h-7 bg-[#2d2f32] hover:bg-[#28960b] hover:text-white border-2 border-[#141414] hover:border-white flex items-center justify-center text-zinc-300 active:translate-y-[1px] ml-1 shrink-0"
                            title="Tùy chọn"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* GROUP 3: OFFLINE FRIENDS */}
              {offlineFriends.length > 0 && (
                <div className="space-y-1">
                  {/* Bedrock Tab Header Pill */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        playPopSound();
                        setOpenGroupOffline(!openGroupOffline);
                      }}
                      className="bg-[#282a2d] hover:bg-[#36383b] text-zinc-300 border-2 border-[#141414] shadow-[inset_1px_1px_0_#404246,inset_-1px_-1px_0_#141516] px-3 py-1 flex items-center gap-2 text-xs font-bold font-jura cursor-default active:translate-y-[1px]"
                    >
                      <span className="text-[10px]">{openGroupOffline ? '▼' : '►'}</span>
                      <span>Offline ({offlineFriends.length})</span>
                    </button>
                  </div>

                  {/* List Items Container */}
                  {openGroupOffline && (
                    <div className="bg-[#242628] border-2 border-[#141414] p-1.5 space-y-1 opacity-90">
                      {offlineFriends.map((user) => (
                        <div
                          key={user.id}
                          className="bg-[#1f2123] hover:bg-[#2e3033] border-2 border-[#141414] hover:border-white p-1.5 flex items-center justify-between group transition-none"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {/* Avatar Box */}
                            <div className="relative w-9 h-9 bg-black border border-[#141414] shrink-0 flex items-center justify-center overflow-hidden grayscale">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover [image-rendering:pixelated]"
                              />
                              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-zinc-500 border border-black" />
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                              <span className="font-bold text-xs text-zinc-300 truncate font-jura block">
                                {user.name}
                              </span>
                              <p className="text-[10px] text-zinc-500 font-jura truncate">
                                {user.activity}
                              </p>
                            </div>
                          </div>

                          {/* Options dots button */}
                          <button
                            type="button"
                            onClick={() => {
                              playPopSound();
                              setSelectedUser(user);
                            }}
                            className="w-7 h-7 bg-[#2d2f32] hover:bg-[#28960b] hover:text-white border-2 border-[#141414] hover:border-white flex items-center justify-center text-zinc-400 active:translate-y-[1px] ml-1 shrink-0"
                            title="Tùy chọn"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* TAB 2: REQUESTS CONTENT */
            <div className="space-y-3">
              {friendRequests.length === 0 ? (
                <div className="text-center py-10 text-zinc-400 text-xs font-jura space-y-2">
                  <Bell className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
                  <p>Không có lời mời kết bạn nào mới.</p>
                </div>
              ) : (
                friendRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-[#282a2d] border-2 border-[#141414] p-3 space-y-2 shadow-[inset_1px_1px_0_#3d4044]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 bg-black border border-[#141414] shrink-0 overflow-hidden">
                        <img
                          src={req.user.avatar}
                          alt={req.user.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover [image-rendering:pixelated]"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-white font-jura">{req.user.name}</h4>
                        <p className="text-[10px] text-[#89dc69] font-jura">{req.user.activity}</p>
                        <span className="text-[9px] text-zinc-400 font-jura block mt-0.5">
                          {req.timestamp} • {req.user.mutualFriends} bạn chung
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <VplayPrimaryButton
                        onClick={() => handleAcceptRequest(req.id, req.user)}
                        className="flex-1 !py-1 text-xs"
                      >
                        <UserCheck className="w-3.5 h-3.5 inline mr-1" /> Chấp nhận
                      </VplayPrimaryButton>
                      <VplaySecondaryButton
                        onClick={() => handleDeclineRequest(req.id)}
                        className="flex-1 !py-1 text-xs"
                      >
                        <UserX className="w-3.5 h-3.5 inline mr-1" /> Từ chối
                      </VplaySecondaryButton>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* BOTTOM FOOTER COUNT */}
        <div className="p-2 bg-[#222426] border-t-2 border-[#141414] text-[10px] font-jura text-zinc-400 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold font-mono">
            <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>1.000 Khoáng Thạch</span>
          </div>
          <span>Online: {joinableFriends.length + onlineFriends.length + 1}/101</span>
        </div>
      </div>

      {/* USER DETAIL POPUP MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-jura select-none">
          <div className="bg-[#2d2f32] text-white border-4 border-[#141414] shadow-[inset_2px_2px_0_#4a4d52,inset_-2px_-2px_0_#1e2022] w-full max-w-sm p-4 space-y-4">
            
            {/* Header / Avatar */}
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 bg-black border-2 border-[#141414] shrink-0 overflow-hidden relative">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover [image-rendering:pixelated]"
                />
                <span
                  className={`absolute top-0.5 right-0.5 w-3 h-3 border border-black ${
                    selectedUser.status === 'offline' ? 'bg-zinc-500' : 'bg-[#55ff55]'
                  }`}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm sm:text-base text-white font-jura truncate">
                    {selectedUser.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setSelectedUser(null);
                    }}
                    className="text-zinc-400 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-zinc-400 font-jura">{selectedUser.tag}</p>
                <div className="mt-1 inline-block bg-[#1a1b1c] border border-[#141414] px-2 py-0.5 text-[10px] font-jura text-[#89dc69]">
                  {selectedUser.activity}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="bg-[#1f2123] border-2 border-[#141414] p-2.5 text-xs font-jura space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Bạn chung:</span>
                <span className="text-white font-bold">{selectedUser.mutualFriends} người</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Trạng thái kết nối:</span>
                <span className="text-emerald-400 font-bold">Bạn bè Vplay</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Hệ sinh thái:</span>
                <span className="text-zinc-200">Vplay HD Player</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              {selectedUser.status === 'joinable' && (
                <VplayPrimaryButton
                  onClick={() => {
                    playPopSound();
                    const channelName = selectedUser.activity.replace('Đang xem ', '').replace('Đang nghe ', '');
                    onSelectUserChannel?.(channelName);
                    showToast(`Đang mở kênh cùng ${selectedUser.name}...`);
                    setSelectedUser(null);
                  }}
                  className="w-full text-xs py-2"
                >
                  <Tv className="w-4 h-4 inline mr-1.5" /> Mời cùng xem TV ({selectedUser.activity})
                </VplayPrimaryButton>
              )}

              <div className="flex items-center gap-2">
                <VplaySecondaryButton
                  onClick={() => {
                    playPopSound();
                    showToast(`Đã mở khung chat với ${selectedUser.name}`);
                    setSelectedUser(null);
                  }}
                  className="flex-1 text-xs py-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 inline mr-1" /> Trò chuyện
                </VplaySecondaryButton>

                <VplaySecondaryButton
                  onClick={() => {
                    playPopSound();
                    setFriendsList((prev) => prev.filter((f) => f.id !== selectedUser.id));
                    showToast(`Đã xóa ${selectedUser.name} khỏi danh sách bạn bè`);
                    setSelectedUser(null);
                  }}
                  className="flex-1 text-xs py-1.5 !text-red-400"
                >
                  <UserX className="w-3.5 h-3.5 inline mr-1" /> Hủy kết bạn
                </VplaySecondaryButton>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

