import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Hash, 
  Volume2, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Smile, 
  Send, 
  Mic, 
  MicOff, 
  Headphones, 
  VolumeX, 
  Settings as SettingsIcon, 
  PhoneOff, 
  Users, 
  Search, 
  Pin, 
  Bell, 
  X, 
  Bot, 
  Sparkles, 
  Check, 
  Radio, 
  ShieldCheck, 
  Circle, 
  MessageSquare,
  Monitor,
  Dices,
  Coins,
  Tv
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChatChannel, 
  ChatMessage, 
  Member, 
  VoiceParticipant 
} from './types';
import { 
  CHAT_CHANNELS, 
  INITIAL_MEMBERS, 
  INITIAL_MESSAGES, 
  INITIAL_VOICE_PARTICIPANTS 
} from './mockChatData';
import { ChatMessagesList } from './ChatMessagesList';
import { ChatVoiceStage } from './ChatVoiceStage';
import { 
  playVoiceJoinSound, 
  playVoiceLeaveSound, 
  playMuteToggleSound, 
  playMessageReceivedSound 
} from './chatSounds';
import { playPopSound } from '../../utils/sound';
import { CURRENT_USER } from '../../data/mockFriendsData';

const POPULAR_EMOJIS = ['😀', '😂', '🔥', '❤️', '🎉', '👏', '🍿', '🚀', '👀', '✨', '🎮', '📺', '🐸', '👑', '⚡', '💯'];

export const ChatRoomView: React.FC = () => {
  // Navigation & Active channel
  const [channels] = useState<ChatChannel[]>(CHAT_CHANNELS);
  const [selectedChannelId, setSelectedChannelId] = useState<string>('general');

  // Categories collapse states
  const [textCategoryOpen, setTextCategoryOpen] = useState(true);
  const [voiceCategoryOpen, setVoiceCategoryOpen] = useState(true);

  // Right Member List toggle
  const [showMemberList, setShowMemberList] = useState(true);

  // Voice connection state
  const [connectedVoiceChannelId, setConnectedVoiceChannelId] = useState<string | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Members & Voice participants state
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [voiceRooms, setVoiceRooms] = useState<Record<string, VoiceParticipant[]>>(INITIAL_VOICE_PARTICIPANTS);

  // Messages state (with localStorage caching)
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const saved = localStorage.getItem('vplay_chat_messages_cache');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_MESSAGES;
  });

  // Chat input state
  const [inputContent, setInputContent] = useState('');
  const [replyMessage, setReplyMessage] = useState<ChatMessage | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [showSearchBox, setShowSearchBox] = useState(false);

  // User Profile modal/popover
  const [selectedProfileMember, setSelectedProfileMember] = useState<Member | null>(null);
  const [myUserStatus, setMyUserStatus] = useState<'online' | 'idle' | 'dnd'>('online');
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  // Save messages to local storage on update
  useEffect(() => {
    try {
      localStorage.setItem('vplay_chat_messages_cache', JSON.stringify(messagesMap));
    } catch (e) {}
  }, [messagesMap]);

  // Active channel
  const currentChannel = useMemo(() => {
    return channels.find((c) => c.id === selectedChannelId) || channels[0];
  }, [channels, selectedChannelId]);

  // Current channel messages
  const activeMessages = useMemo(() => {
    const list = messagesMap[selectedChannelId] || [];
    if (!chatSearchQuery.trim()) return list;
    const q = chatSearchQuery.toLowerCase().trim();
    return list.filter(
      (m) => m.content.toLowerCase().includes(q) || m.author.name.toLowerCase().includes(q)
    );
  }, [messagesMap, selectedChannelId, chatSearchQuery]);

  // Handlers for Voice
  const handleJoinVoiceChannel = (voiceChannelId: string) => {
    if (connectedVoiceChannelId === voiceChannelId) return;

    playVoiceJoinSound();
    setConnectedVoiceChannelId(voiceChannelId);
    setSelectedChannelId(voiceChannelId);

    // Add current user to that voice room
    setVoiceRooms((prev) => {
      const currentList = prev[voiceChannelId] || [];
      if (currentList.some((p) => p.id === CURRENT_USER.id)) return prev;

      const newParticipant: VoiceParticipant = {
        id: CURRENT_USER.id,
        name: CURRENT_USER.name,
        tag: CURRENT_USER.tag,
        avatar: CURRENT_USER.avatar,
        role: CURRENT_USER.badge || 'Thành Viên',
        isMuted: isMicMuted,
        isDeafened: isDeafened,
        isSpeaking: false,
        isScreenSharing: false,
        joinedAt: 'Vừa xong'
      };

      // Remove from any other room first
      const updated: Record<string, VoiceParticipant[]> = {};
      Object.keys(prev).forEach((k) => {
        updated[k] = prev[k].filter((p) => p.id !== CURRENT_USER.id);
      });
      updated[voiceChannelId] = [...(updated[voiceChannelId] || []), newParticipant];
      return updated;
    });
  };

  const handleLeaveVoice = () => {
    if (!connectedVoiceChannelId) return;
    playVoiceLeaveSound();

    // Remove user from room
    setVoiceRooms((prev) => {
      const updated = { ...prev };
      if (updated[connectedVoiceChannelId]) {
        updated[connectedVoiceChannelId] = updated[connectedVoiceChannelId].filter(
          (p) => p.id !== CURRENT_USER.id
        );
      }
      return updated;
    });

    setConnectedVoiceChannelId(null);
    setIsScreenSharing(false);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMicMuted;
    setIsMicMuted(nextMuted);
    playMuteToggleSound(nextMuted);

    if (connectedVoiceChannelId) {
      setVoiceRooms((prev) => {
        const room = prev[connectedVoiceChannelId] || [];
        return {
          ...prev,
          [connectedVoiceChannelId]: room.map((p) =>
            p.id === CURRENT_USER.id ? { ...p, isMuted: nextMuted } : p
          )
        };
      });
    }
  };

  const handleToggleDeafen = () => {
    const nextDeafened = !isDeafened;
    setIsDeafened(nextDeafened);
    playMuteToggleSound(nextDeafened);

    if (connectedVoiceChannelId) {
      setVoiceRooms((prev) => {
        const room = prev[connectedVoiceChannelId] || [];
        return {
          ...prev,
          [connectedVoiceChannelId]: room.map((p) =>
            p.id === CURRENT_USER.id ? { ...p, isDeafened: nextDeafened } : p
          )
        };
      });
    }
  };

  const handleToggleScreenShare = () => {
    const nextShare = !isScreenSharing;
    setIsScreenSharing(nextShare);
    playPopSound();

    if (connectedVoiceChannelId) {
      setVoiceRooms((prev) => {
        const room = prev[connectedVoiceChannelId] || [];
        return {
          ...prev,
          [connectedVoiceChannelId]: room.map((p) =>
            p.id === CURRENT_USER.id ? { ...p, isScreenSharing: nextShare } : p
          )
        };
      });
    }
  };

  // Handlers for Messages
  const handleSendMessage = () => {
    const content = inputContent.trim();
    if (!content) return;

    playPopSound();

    // Check for Slash Commands
    if (content.startsWith('/')) {
      handleSlashCommand(content);
      setInputContent('');
      setReplyMessage(null);
      return;
    }

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      channelId: selectedChannelId,
      author: {
        id: CURRENT_USER.id,
        name: CURRENT_USER.name,
        tag: CURRENT_USER.tag,
        avatar: CURRENT_USER.avatar,
        role: 'owner',
        roleName: CURRENT_USER.badge || 'Bạn (Thành Viên)',
        roleColor: '#E6005A'
      },
      content,
      timestamp: 'Hôm nay lúc ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      replyTo: replyMessage
        ? { authorName: replyMessage.author.name, content: replyMessage.content }
        : undefined,
      reactions: []
    };

    setMessagesMap((prev) => ({
      ...prev,
      [selectedChannelId]: [...(prev[selectedChannelId] || []), newMessage]
    }));

    setInputContent('');
    setReplyMessage(null);
    setShowEmojiPicker(false);

    // Simulate smart bot response if in bot channel or mentioned @Copilot
    if (selectedChannelId === 'bot-commands' || content.toLowerCase().includes('@copilot') || content.toLowerCase().includes('bot')) {
      setTimeout(() => {
        simulateBotResponse(content);
      }, 1000);
    }
  };

  const handleSlashCommand = (cmdStr: string) => {
    const parts = cmdStr.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    let replyContent = '';

    if (cmd === '/copilot') {
      replyContent = `🤖 **Copilot AI trả lời:** "${arg || 'Tôi luôn sẵn sàng hỗ trợ bạn trên nền tảng Vplay!'}"\n*Gợi ý:* Bạn có thể vào tab Copilot hoặc xem trực tiếp các kênh TV chuẩn HD.`;
    } else if (cmd === '/roll') {
      const luckyNum = Math.floor(Math.random() * 100) + 1;
      replyContent = `🎲 **Kết quả tung xúc xắc:** Bạn đã tung được con số may mắn **${luckyNum}/100**!`;
    } else if (cmd === '/flip') {
      const side = Math.random() > 0.5 ? 'MẶT NGỬA (Head)' : 'MẶT SẤP (Tail)';
      replyContent = `🪙 **Tung đồng xu:** Đồng xu dừng lại ở **${side}**!`;
    } else if (cmd === '/tv') {
      replyContent = `📺 **Kênh truyền hình:** Kênh **${arg || 'VTV3 HD'}** đang phát sóng độ nét cao 1080p 60fps với độ trễ tối ưu.`;
    } else if (cmd === '/clear') {
      setMessagesMap((prev) => ({
        ...prev,
        [selectedChannelId]: []
      }));
      return;
    } else {
      replyContent = `❌ Không tìm thấy lệnh \`${cmd}\`. Thử dùng \`/copilot\`, \`/roll\`, \`/flip\`, \`/tv\`, \`/clear\`.`;
    }

    const botMessage: ChatMessage = {
      id: `msg_bot_${Date.now()}`,
      channelId: selectedChannelId,
      author: {
        id: 'mem_bot_copilot',
        name: 'Copilot AI Bot',
        tag: '#BOT',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=vplay-bot&backgroundColor=1e1b24',
        role: 'bot',
        roleColor: '#06B6D4',
        roleName: 'BOT HỖ TRỢ'
      },
      content: replyContent,
      timestamp: 'Hôm nay lúc ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessagesMap((prev) => ({
      ...prev,
      [selectedChannelId]: [...(prev[selectedChannelId] || []), botMessage]
    }));
    playMessageReceivedSound();
  };

  const simulateBotResponse = (userQuestion: string) => {
    const answers = [
      `Chào bạn! Rất vui được trò chuyện trong phòng chat Vplay Discord. Bạn cần hỗ trợ kênh nào không?`,
      `Tôi đã nhận được tin nhắn của bạn. Kênh thoại hiện đang có các phòng live watch party rất sôi nổi!`,
      `Bạn có thể tham gia vào kênh thoại bên trái để cùng xem phim và thể thao trực tiếp nhé!`
    ];
    const answer = answers[Math.floor(Math.random() * answers.length)];

    const botMessage: ChatMessage = {
      id: `msg_bot_${Date.now()}`,
      channelId: selectedChannelId,
      author: {
        id: 'mem_bot_copilot',
        name: 'Copilot AI Bot',
        tag: '#BOT',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=vplay-bot&backgroundColor=1e1b24',
        role: 'bot',
        roleColor: '#06B6D4',
        roleName: 'BOT HỖ TRỢ'
      },
      content: answer,
      timestamp: 'Hôm nay lúc ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessagesMap((prev) => ({
      ...prev,
      [selectedChannelId]: [...(prev[selectedChannelId] || []), botMessage]
    }));
    playMessageReceivedSound();
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessagesMap((prev) => {
      const list = prev[selectedChannelId] || [];
      const updated = list.map((msg) => {
        if (msg.id !== messageId) return msg;

        const reactions = [...(msg.reactions || [])];
        const existingIdx = reactions.findIndex((r) => r.emoji === emoji);

        if (existingIdx >= 0) {
          const r = reactions[existingIdx];
          const hasUser = r.users.includes(CURRENT_USER.id);
          if (hasUser) {
            // Remove user reaction
            const newUsers = r.users.filter((u) => u !== CURRENT_USER.id);
            if (newUsers.length === 0) {
              reactions.splice(existingIdx, 1);
            } else {
              reactions[existingIdx] = { ...r, count: newUsers.length, users: newUsers };
            }
          } else {
            // Add user reaction
            reactions[existingIdx] = {
              ...r,
              count: r.count + 1,
              users: [...r.users, CURRENT_USER.id]
            };
          }
        } else {
          // New reaction
          reactions.push({
            emoji,
            count: 1,
            users: [CURRENT_USER.id]
          });
        }

        return { ...msg, reactions };
      });

      return {
        ...prev,
        [selectedChannelId]: updated
      };
    });
  };

  return (
    <div className="w-full h-[calc(100vh-68px)] flex bg-[#18171E] text-white overflow-hidden font-sans border-t border-[#2D2D38] select-none">
      {/* 1. LEFT PANEL: Server Header & Channels List (Width: 260px) */}
      <div className="w-64 sm:w-72 bg-[#1F1E24] border-r border-[#2D2D38] flex flex-col shrink-0">
        {/* Server Header */}
        <div className="h-14 px-4 border-b border-[#2D2D38] flex items-center justify-between bg-[#18171E] shadow-sm">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-black text-sm shadow-md shrink-0">
              V
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1 truncate">
                <span>V-Chat • Cộng Đồng</span>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                142 trực tuyến
              </div>
            </div>
          </div>
        </div>

        {/* Channel Categories & Channel List */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-2 py-3 space-y-4">
          {/* CATEGORY 1: KÊNH VĂN BẢN (Text channels) */}
          <div className="space-y-1">
            <button
              onClick={() => setTextCategoryOpen(!textCategoryOpen)}
              className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider hover:text-white cursor-pointer group"
            >
              <span className="flex items-center gap-1">
                {textCategoryOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                Kênh Văn Bản
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 group-hover:bg-white/10 font-mono">
                {channels.filter((c) => c.category === 'text').length}
              </span>
            </button>

            {textCategoryOpen && (
              <div className="space-y-0.5">
                {channels
                  .filter((c) => c.category === 'text')
                  .map((ch) => {
                    const isSelected = selectedChannelId === ch.id;

                    return (
                      <button
                        key={ch.id}
                        onClick={() => {
                          playPopSound();
                          setSelectedChannelId(ch.id);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                            : 'text-[#9CA3AF] hover:text-white hover:bg-[#2A2933]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Hash className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-[#9CA3AF]'}`} />
                          <span className="truncate">{ch.name}</span>
                        </div>

                        {ch.unreadCount && ch.unreadCount > 0 && !isSelected ? (
                          <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-amber-500 text-black rounded-full">
                            {ch.unreadCount}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
              </div>
            )}
          </div>

          {/* CATEGORY 2: KÊNH THOẠI (Voice channels) */}
          <div className="space-y-1">
            <button
              onClick={() => setVoiceCategoryOpen(!voiceCategoryOpen)}
              className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider hover:text-white cursor-pointer group"
            >
              <span className="flex items-center gap-1">
                {voiceCategoryOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                Kênh Thoại (Voice)
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                {channels.filter((c) => c.category === 'voice').length}
              </span>
            </button>

            {voiceCategoryOpen && (
              <div className="space-y-1">
                {channels
                  .filter((c) => c.category === 'voice')
                  .map((vch) => {
                    const isConnectedHere = connectedVoiceChannelId === vch.id;
                    const isSelected = selectedChannelId === vch.id;
                    const participantsInRoom = voiceRooms[vch.id] || [];

                    return (
                      <div key={vch.id} className="space-y-1">
                        <button
                          onClick={() => {
                            playPopSound();
                            handleJoinVoiceChannel(vch.id);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isConnectedHere
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : isSelected
                              ? 'bg-[#2A2933] text-white'
                              : 'text-[#9CA3AF] hover:text-white hover:bg-[#2A2933]'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Volume2
                              className={`w-4 h-4 shrink-0 ${
                                isConnectedHere ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'
                              }`}
                            />
                            <span className="truncate">{vch.name}</span>
                          </div>

                          {isConnectedHere && (
                            <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-emerald-500 text-black rounded-full">
                              ĐÃ NỐI
                            </span>
                          )}
                        </button>

                        {/* Nested list of participants in this voice channel */}
                        {participantsInRoom.length > 0 && (
                          <div className="pl-6 space-y-1">
                            {participantsInRoom.map((p) => (
                              <div
                                key={p.id}
                                className="flex items-center justify-between py-1 px-2 rounded-lg bg-black/30 text-[11px] text-zinc-300"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <div className="relative">
                                    <img
                                      src={p.avatar}
                                      alt={p.name}
                                      className={`w-4 h-4 rounded-full ${
                                        p.isSpeaking && !p.isMuted
                                          ? 'ring-2 ring-emerald-400 animate-pulse'
                                          : ''
                                      }`}
                                    />
                                    {p.isSpeaking && !p.isMuted && (
                                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                    )}
                                  </div>
                                  <span className="truncate font-medium">{p.name}</span>
                                </div>

                                <div className="flex items-center gap-1 text-zinc-400">
                                  {p.isMuted && <MicOff className="w-3 h-3 text-rose-400" />}
                                  {p.isDeafened && <VolumeX className="w-3 h-3 text-rose-400" />}
                                  {p.isScreenSharing && (
                                    <Monitor className="w-3 h-3 text-purple-400 animate-pulse" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* VOICE CONNECTED STATUS BAR */}
        {connectedVoiceChannelId && (
          <div className="px-3 py-2 bg-[#18171E] border-t border-emerald-500/30 flex items-center justify-between text-xs">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>Đã kết nối thoại</span>
              </div>
              <div className="text-[10px] text-[#9CA3AF] truncate">
                {channels.find((c) => c.id === connectedVoiceChannelId)?.name}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleLeaveVoice}
                title="Ngắt kết nối"
                className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
              >
                <PhoneOff className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* USER PROFILE STATUS BAR AT BOTTOM OF CHANNELS */}
        <div className="h-15 px-3 bg-[#18171E] border-t border-[#2D2D38] flex items-center justify-between relative">
          {/* User info */}
          <div 
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="flex items-center gap-2.5 min-w-0 p-1 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="relative">
              <img
                src={CURRENT_USER.avatar}
                alt={CURRENT_USER.name}
                className="w-9 h-9 rounded-full bg-[#1F1E24] border border-white/10 object-cover"
              />
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#18171E] ${
                  myUserStatus === 'online'
                    ? 'bg-emerald-500'
                    : myUserStatus === 'idle'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              />
            </div>

            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {CURRENT_USER.name}
              </div>
              <div className="text-[10px] text-[#9CA3AF] font-mono truncate">
                {CURRENT_USER.tag}
              </div>
            </div>
          </div>

          {/* User Quick Audio Controls: Mic, Deafen, Settings */}
          <div className="flex items-center gap-0.5 text-[#9CA3AF]">
            <button
              onClick={handleToggleMute}
              title={isMicMuted ? 'Bật Mic' : 'Tắt Mic'}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isMicMuted
                  ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                  : 'hover:bg-white/10 hover:text-white'
              }`}
            >
              {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={handleToggleDeafen}
              title={isDeafened ? 'Bật Âm thanh' : 'Tắt Âm thanh'}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isDeafened
                  ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                  : 'hover:bg-white/10 hover:text-white'
              }`}
            >
              {isDeafened ? <VolumeX className="w-4 h-4" /> : <Headphones className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              title="Cài đặt trạng thái"
              className="p-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Status Changer Popup */}
          {showStatusMenu && (
            <div className="absolute bottom-16 left-3 w-48 bg-[#1F1E24] border border-[#2D2D38] rounded-2xl shadow-2xl p-2 z-50 space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] border-b border-white/5 mb-1">
                Trạng thái người dùng
              </div>
              <button
                onClick={() => {
                  setMyUserStatus('online');
                  setShowStatusMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs hover:bg-white/10 text-left cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-semibold text-white">Trực tuyến (Online)</span>
              </button>
              <button
                onClick={() => {
                  setMyUserStatus('idle');
                  setShowStatusMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs hover:bg-white/10 text-left cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-semibold text-white">Chờ (Idle)</span>
              </button>
              <button
                onClick={() => {
                  setMyUserStatus('dnd');
                  setShowStatusMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs hover:bg-white/10 text-left cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="font-semibold text-white">Không làm phiền</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. CENTER PANEL: Channel Content (Text Chat or Voice Stage) */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#18171E]">
        {/* Top Header Bar */}
        <div className="h-14 px-4 sm:px-6 border-b border-[#2D2D38] flex items-center justify-between bg-[#1F1E24] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {currentChannel.type === 'text' ? (
              <Hash className="w-5 h-5 text-zinc-400 shrink-0" />
            ) : (
              <Volume2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-white truncate">
                {currentChannel.name}
              </h1>
              {currentChannel.topic && (
                <p className="text-[11px] text-zinc-400 truncate hidden sm:block">
                  {currentChannel.topic}
                </p>
              )}
            </div>
          </div>

          {/* Quick Header Tools */}
          <div className="flex items-center gap-2 text-zinc-400">
            {/* Search in chat */}
            <div className="relative">
              {showSearchBox ? (
                <div className="flex items-center gap-1 bg-[#232230] px-2 py-1 rounded-xl border border-white/10">
                  <Search className="w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type="text"
                    value={chatSearchQuery}
                    onChange={(e) => setChatSearchQuery(e.target.value)}
                    placeholder="Tìm trong kênh..."
                    className="bg-transparent text-xs text-white placeholder-zinc-500 outline-none w-32 sm:w-44"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setChatSearchQuery('');
                      setShowSearchBox(false);
                    }}
                    className="text-zinc-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearchBox(true)}
                  title="Tìm tin nhắn"
                  className="p-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Toggle member list */}
            <button
              onClick={() => setShowMemberList(!showMemberList)}
              title={showMemberList ? 'Ẩn danh sách thành viên' : 'Hiện danh sách thành viên'}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                showMemberList
                  ? 'bg-white/10 text-white'
                  : 'hover:bg-white/10 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Body */}
        {currentChannel.type === 'voice' ? (
          /* Voice Stage */
          <ChatVoiceStage
            channel={currentChannel}
            participants={voiceRooms[currentChannel.id] || []}
            isConnected={connectedVoiceChannelId === currentChannel.id}
            isMuted={isMicMuted}
            isDeafened={isDeafened}
            isScreenSharing={isScreenSharing}
            onJoinVoice={() => handleJoinVoiceChannel(currentChannel.id)}
            onLeaveVoice={handleLeaveVoice}
            onToggleMute={handleToggleMute}
            onToggleDeafen={handleToggleDeafen}
            onToggleScreenShare={handleToggleScreenShare}
          />
        ) : (
          /* Text Chat Message History & Input */
          <div className="flex-1 flex flex-col min-h-0 relative">
            {/* Messages list */}
            <ChatMessagesList
              channel={currentChannel}
              messages={activeMessages}
              currentUserId={CURRENT_USER.id}
              onAddReaction={handleAddReaction}
              onReplyMessage={(msg) => setReplyMessage(msg)}
            />

            {/* Input Bar */}
            <div className="p-4 bg-[#18171E] shrink-0 border-t border-[#2D2D38]">
              {/* Reply preview bar */}
              {replyMessage && (
                <div className="mb-2 px-3 py-1.5 rounded-xl bg-[#1F1E24] border border-[#2D2D38] flex items-center justify-between text-xs text-zinc-300">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[#9CA3AF]">Đang trả lời</span>
                    <span className="font-bold text-amber-400">@{replyMessage.author.name}:</span>
                    <span className="truncate text-zinc-400 max-w-sm">{replyMessage.content}</span>
                  </div>
                  <button
                    onClick={() => setReplyMessage(null)}
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Chat Input Box */}
              <div className="relative rounded-2xl bg-[#1F1E24] border border-[#2D2D38] focus-within:border-amber-500/50 transition-all flex items-center px-4 py-2.5 shadow-inner">
                {/* Plus action (Commands / Upload) */}
                <button
                  onClick={() => {
                    setInputContent('/copilot ');
                  }}
                  title="Dùng lệnh AI / Lệnh Bot"
                  className="w-7 h-7 rounded-lg bg-[#2A2933] hover:bg-gradient-to-r hover:from-amber-500 hover:to-rose-500 hover:text-white text-[#9CA3AF] flex items-center justify-center transition-all mr-2 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* Input text */}
                <input
                  type="text"
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    currentChannel.isLocked
                      ? 'Kênh này chỉ dành cho thông báo chính thức...'
                      : `Nhắn tin tại #${currentChannel.name} (Gõ /copilot, /roll, /flip)...`
                  }
                  disabled={currentChannel.isLocked}
                  className="flex-1 bg-transparent text-sm text-white placeholder-[#9CA3AF] outline-none disabled:opacity-50"
                />

                {/* Emoji toggle */}
                <div className="relative">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    title="Biểu tượng cảm xúc"
                    className="p-2 text-[#9CA3AF] hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <Smile className="w-5 h-5" />
                  </button>

                  {/* Emoji Picker Popup */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-12 right-0 w-64 bg-[#1F1E24] border border-[#2D2D38] rounded-2xl shadow-2xl p-3 z-50">
                      <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">
                        Cảm xúc phổ biến
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {POPULAR_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => {
                              setInputContent((prev) => prev + emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="w-10 h-10 rounded-xl hover:bg-white/10 text-xl flex items-center justify-center transition-transform hover:scale-125 cursor-pointer"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Send Button */}
                <button
                  onClick={handleSendMessage}
                  disabled={!inputContent.trim() || currentChannel.isLocked}
                  className="ml-1 p-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white disabled:opacity-30 transition-all cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Slash Command Quick Chips */}
              <div className="mt-2 flex items-center gap-2 overflow-x-auto text-[11px] text-[#9CA3AF] py-1 no-scrollbar">
                <span className="text-[10px] uppercase font-bold text-zinc-500 shrink-0">Lệnh nhanh:</span>
                <button
                  onClick={() => setInputContent('/copilot ')}
                  className="px-2 py-0.5 rounded-md bg-[#2A2933] hover:bg-amber-500/20 hover:text-amber-300 border border-[#3E3D4D] transition-all shrink-0 cursor-pointer font-mono"
                >
                  /copilot [hỏi đáp]
                </button>
                <button
                  onClick={() => setInputContent('/roll')}
                  className="px-2 py-0.5 rounded-md bg-[#2A2933] hover:bg-amber-500/20 hover:text-amber-300 border border-[#3E3D4D] transition-all shrink-0 cursor-pointer font-mono"
                >
                  /roll (xúc xắc)
                </button>
                <button
                  onClick={() => setInputContent('/flip')}
                  className="px-2 py-0.5 rounded-md bg-[#2A2933] hover:bg-amber-500/20 hover:text-amber-300 border border-[#3E3D4D] transition-all shrink-0 cursor-pointer font-mono"
                >
                  /flip (tung xu)
                </button>
                <button
                  onClick={() => setInputContent('/tv VTV3 HD')}
                  className="px-2 py-0.5 rounded-md bg-[#2A2933] hover:bg-amber-500/20 hover:text-amber-300 border border-[#3E3D4D] transition-all shrink-0 cursor-pointer font-mono"
                >
                  /tv [kênh]
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. RIGHT PANEL: Members List (Width: 240px, Toggleable) */}
      {showMemberList && (
        <div className="w-60 bg-[#1F1E24] border-l border-[#2D2D38] flex flex-col shrink-0 overflow-y-auto no-scrollbar p-3 space-y-4 select-none hidden lg:block">
          {/* Group 1: Ban Quản Trị & Bot */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
              Quản Trị & Bot — 2
            </div>
            {members
              .filter((m) => m.role === 'owner' || m.role === 'bot')
              .map((mem) => (
                <div
                  key={mem.id}
                  onClick={() => setSelectedProfileMember(mem)}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="relative shrink-0">
                    <img
                      src={mem.avatar}
                      alt={mem.name}
                      className="w-8 h-8 rounded-full bg-black/40 border border-white/10 object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#1F1E24]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate group-hover:text-white" style={{ color: mem.roleColor }}>
                      {mem.name}
                    </div>
                    <div className="text-[10px] text-[#9CA3AF] truncate">
                      {mem.activity || mem.roleName}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Group 2: VIP Members */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
              Thành Viên VIP — {members.filter((m) => m.role === 'vip' || m.role === 'mod').length}
            </div>
            {members
              .filter((m) => m.role === 'vip' || m.role === 'mod')
              .map((mem) => (
                <div
                  key={mem.id}
                  onClick={() => setSelectedProfileMember(mem)}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="relative shrink-0">
                    <img
                      src={mem.avatar}
                      alt={mem.name}
                      className="w-8 h-8 rounded-full bg-black/40 border border-white/10 object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#1F1E24]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate group-hover:text-white" style={{ color: mem.roleColor }}>
                      {mem.name}
                    </div>
                    <div className="text-[10px] text-[#9CA3AF] truncate">
                      {mem.activity}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Group 3: Trực tuyến (Online) */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
              Trực tuyến — {members.filter((m) => m.status === 'online' && m.role === 'member').length + 1}
            </div>
            {/* You */}
            <div
              onClick={() => setSelectedProfileMember({
                id: CURRENT_USER.id,
                name: CURRENT_USER.name,
                tag: CURRENT_USER.tag,
                avatar: CURRENT_USER.avatar,
                role: 'owner',
                roleName: CURRENT_USER.badge || 'Bạn (Thành Viên)',
                roleColor: '#F59E0B',
                status: 'online',
                activity: CURRENT_USER.activity || 'Đang ở phòng chat Vplay',
                customStatus: CURRENT_USER.bio
              })}
              className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 transition-colors cursor-pointer group"
            >
              <div className="relative shrink-0">
                <img
                  src={CURRENT_USER.avatar}
                  alt={CURRENT_USER.name}
                  className="w-8 h-8 rounded-full bg-black/40 border border-amber-500 object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#1F1E24]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-amber-400 truncate">
                  {CURRENT_USER.name} (Bạn)
                </div>
                <div className="text-[10px] text-[#9CA3AF] truncate">
                  Trực tuyến
                </div>
              </div>
            </div>

            {members
              .filter((m) => (m.status === 'online' || m.status === 'idle') && m.role === 'member')
              .map((mem) => (
                <div
                  key={mem.id}
                  onClick={() => setSelectedProfileMember(mem)}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="relative shrink-0">
                    <img
                      src={mem.avatar}
                      alt={mem.name}
                      className="w-8 h-8 rounded-full bg-black/40 border border-white/10 object-cover"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#1F1E24] ${
                        mem.status === 'idle' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-zinc-300 truncate group-hover:text-white">
                      {mem.name}
                    </div>
                    <div className="text-[10px] text-[#9CA3AF] truncate">
                      {mem.activity || 'Trực tuyến'}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Group 4: Ngoại tuyến (Offline) */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
              Ngoại tuyến — {members.filter((m) => m.status === 'offline').length}
            </div>
            {members
              .filter((m) => m.status === 'offline')
              .map((mem) => (
                <div
                  key={mem.id}
                  onClick={() => setSelectedProfileMember(mem)}
                  className="flex items-center gap-2.5 p-2 rounded-xl opacity-60 hover:opacity-100 hover:bg-white/5 transition-all cursor-pointer group"
                >
                  <div className="relative shrink-0">
                    <img
                      src={mem.avatar}
                      alt={mem.name}
                      className="w-8 h-8 rounded-full grayscale bg-black/40 border border-white/5 object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-zinc-600 border-2 border-[#1F1E24]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-zinc-400 truncate group-hover:text-white">
                      {mem.name}
                    </div>
                    <div className="text-[10px] text-zinc-600 truncate">
                      Ngoại tuyến
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 4. MEMBER PROFILE MODAL POPUP */}
      <AnimatePresence>
        {selectedProfileMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl bg-[#1F1E24] border border-[#2D2D38] overflow-hidden shadow-2xl relative"
            >
              {/* Header Banner */}
              <div 
                className="h-24 relative"
                style={{
                  background: `linear-gradient(135deg, ${selectedProfileMember.roleColor}80, #18171E)`
                }}
              >
                <button
                  onClick={() => setSelectedProfileMember(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Avatar & Profile details */}
              <div className="px-6 pb-6 pt-0 relative">
                <div className="-mt-12 mb-3 relative inline-block">
                  <img
                    src={selectedProfileMember.avatar}
                    alt={selectedProfileMember.name}
                    className="w-20 h-20 rounded-full border-4 border-[#1F1E24] bg-[#18171E] object-cover shadow-lg"
                  />
                  <span
                    className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#1F1E24] ${
                      selectedProfileMember.status === 'online'
                        ? 'bg-emerald-500'
                        : selectedProfileMember.status === 'idle'
                        ? 'bg-amber-500'
                        : 'bg-zinc-500'
                    }`}
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-black text-white">
                      {selectedProfileMember.name}
                    </h3>
                    <p className="text-xs text-[#9CA3AF] font-mono">
                      {selectedProfileMember.tag}
                    </p>
                  </div>

                  {selectedProfileMember.customStatus && (
                    <div className="p-2.5 rounded-xl bg-white/5 text-xs text-zinc-300 italic border border-white/5">
                      "{selectedProfileMember.customStatus}"
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                      Vai trò
                    </div>
                    <span
                      className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{
                        backgroundColor: `${selectedProfileMember.roleColor}20`,
                        color: selectedProfileMember.roleColor,
                        border: `1px solid ${selectedProfileMember.roleColor}40`
                      }}
                    >
                      {selectedProfileMember.roleName}
                    </span>
                  </div>

                  {selectedProfileMember.activity && (
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                        Hoạt động
                      </div>
                      <div className="text-xs text-zinc-300 font-medium">
                        {selectedProfileMember.activity}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        setInputContent(`@${selectedProfileMember.name} `);
                        setSelectedProfileMember(null);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer text-center"
                    >
                      Nhắc đến (@Mention)
                    </button>
                    <button
                      onClick={() => setSelectedProfileMember(null)}
                      className="px-4 py-2.5 rounded-xl bg-[#2A2933] hover:bg-[#3E3D4D] text-[#9CA3AF] hover:text-white font-semibold text-xs transition-colors cursor-pointer border border-[#3E3D4D]"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
