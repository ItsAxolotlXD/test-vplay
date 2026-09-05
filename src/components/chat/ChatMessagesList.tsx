import React, { useRef, useEffect } from 'react';
import { 
  Hash, 
  Smile, 
  Reply, 
  Pin, 
  MoreHorizontal, 
  Sparkles,
  Bot,
  Tv,
  Check
} from 'lucide-react';
import { ChatMessage, ChatChannel } from './types';
import { playPopSound } from '../../utils/sound';

interface ChatMessagesListProps {
  channel: ChatChannel;
  messages: ChatMessage[];
  currentUserId: string;
  onAddReaction: (messageId: string, emoji: string) => void;
  onReplyMessage?: (message: ChatMessage) => void;
}

const QUICK_EMOJIS = ['❤️', '😂', '🔥', '🎉', '👏', '🍿', '👍', '🚀'];

export const ChatMessagesList: React.FC<ChatMessagesListProps> = ({
  channel,
  messages,
  currentUserId,
  onAddReaction,
  onReplyMessage
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, channel.id]);

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 select-text">
      {/* Channel Header Welcome Card */}
      <div className="pt-4 pb-6 border-b border-[#252431] space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-[#E6005A]/10 border border-[#E6005A]/30 flex items-center justify-center text-[#E6005A]">
          <Hash className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">
            Chào mừng đến với #{channel.name}!
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {channel.topic || 'Đây là phần đầu của kênh này. Hãy bắt đầu cuộc trò chuyện cùng mọi người.'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4">
        {messages.map((msg, index) => {
          const isUser = msg.author.id === currentUserId;
          const isBot = msg.author.role === 'bot';

          return (
            <div
              key={msg.id}
              className="group relative flex items-start gap-3.5 p-2 rounded-xl hover:bg-[#1E1D29]/60 transition-colors"
            >
              {/* Avatar */}
              <div className="relative shrink-0 mt-0.5">
                <img
                  src={msg.author.avatar}
                  alt={msg.author.name}
                  className={`w-10 h-10 rounded-full bg-[#121118] border object-cover ${
                    isBot ? 'border-cyan-500/50' : 'border-white/10'
                  }`}
                />
                {isBot && (
                  <span className="absolute -bottom-1 -right-1 p-0.5 bg-cyan-600 rounded-full text-[8px] text-white">
                    <Bot className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>

              {/* Message Content Container */}
              <div className="flex-1 min-w-0">
                {/* Header: Name, Role Badge, Timestamp */}
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className="text-xs sm:text-sm font-bold text-white hover:underline cursor-pointer"
                    style={{ color: msg.author.roleColor || '#FFFFFF' }}
                  >
                    {msg.author.name}
                  </span>

                  {/* Role badge */}
                  {msg.author.roleName && (
                    <span
                      className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${msg.author.roleColor || '#E6005A'}20`,
                        color: msg.author.roleColor || '#E6005A',
                        border: `1px solid ${msg.author.roleColor || '#E6005A'}40`
                      }}
                    >
                      {msg.author.roleName}
                    </span>
                  )}

                  <span className="text-[10px] text-zinc-500 font-mono">
                    {msg.timestamp}
                  </span>
                </div>

                {/* Reply preview if any */}
                {msg.replyTo && (
                  <div className="mb-1 text-[11px] text-zinc-400 flex items-center gap-1.5 pl-2 border-l-2 border-[#E6005A]/50 bg-white/5 py-0.5 rounded-r">
                    <Reply className="w-3 h-3 text-[#E6005A] shrink-0 rotate-180" />
                    <span className="font-semibold text-zinc-300 truncate">
                      @{msg.replyTo.authorName}:
                    </span>
                    <span className="truncate max-w-xs">{msg.replyTo.content}</span>
                  </div>
                )}

                {/* Message body with simple markdown rendering */}
                <div className="text-xs sm:text-sm text-zinc-200 leading-relaxed break-words whitespace-pre-wrap selection:bg-[#E6005A]/30">
                  {msg.content}
                </div>

                {/* Reactions list */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    {msg.reactions.map((r, rIdx) => {
                      const hasReacted = r.users.includes(currentUserId);
                      return (
                        <button
                          key={rIdx}
                          onClick={() => {
                            playPopSound();
                            onAddReaction(msg.id, r.emoji);
                          }}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs transition-all cursor-pointer ${
                            hasReacted
                              ? 'bg-[#E6005A]/20 border border-[#E6005A]/50 text-white'
                              : 'bg-[#21202D] hover:bg-[#2B2A3B] border border-white/5 text-zinc-300'
                          }`}
                        >
                          <span>{r.emoji}</span>
                          <span className="text-[10px] font-bold font-mono">{r.count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Hover Quick Action Toolbar (Discord-like) */}
              <div className="absolute right-3 -top-3 hidden group-hover:flex items-center gap-1 p-1 rounded-xl bg-[#232230] border border-[#353448] shadow-lg text-zinc-300 z-10">
                {QUICK_EMOJIS.slice(0, 3).map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      playPopSound();
                      onAddReaction(msg.id, emoji);
                    }}
                    title={`Thả cảm xúc ${emoji}`}
                    className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-xs transition-transform hover:scale-125 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}

                {onReplyMessage && (
                  <button
                    onClick={() => onReplyMessage(msg)}
                    title="Trả lời tin nhắn"
                    className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Reply className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
