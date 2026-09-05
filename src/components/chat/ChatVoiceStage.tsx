import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Headphones, 
  PhoneOff, 
  Monitor, 
  Volume2, 
  VolumeX, 
  Signal, 
  Sparkles,
  Users,
  Tv,
  Check,
  Settings2
} from 'lucide-react';
import { ChatChannel, VoiceParticipant } from './types';
import { playMuteToggleSound, playVoiceLeaveSound } from './chatSounds';

interface ChatVoiceStageProps {
  channel: ChatChannel;
  participants: VoiceParticipant[];
  isConnected: boolean;
  isMuted: boolean;
  isDeafened: boolean;
  isScreenSharing: boolean;
  onJoinVoice: () => void;
  onLeaveVoice: () => void;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  onToggleScreenShare: () => void;
}

export const ChatVoiceStage: React.FC<ChatVoiceStageProps> = ({
  channel,
  participants,
  isConnected,
  isMuted,
  isDeafened,
  isScreenSharing,
  onJoinVoice,
  onLeaveVoice,
  onToggleMute,
  onToggleDeafen,
  onToggleScreenShare
}) => {
  // Simulate speaking waves for participants
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected || participants.length === 0) return;
    const interval = setInterval(() => {
      const candidates = participants.filter((p) => !p.isMuted);
      if (candidates.length === 0) {
        setActiveSpeakerId(null);
        return;
      }
      const randomSpeaker = candidates[Math.floor(Math.random() * candidates.length)];
      setActiveSpeakerId(randomSpeaker.id);
    }, 2800);

    return () => clearInterval(interval);
  }, [isConnected, participants]);

  return (
    <div className="flex-1 flex flex-col bg-[#14131A] text-zinc-200 overflow-hidden relative select-none">
      {/* Voice Stage Header */}
      <div className="h-14 px-6 border-b border-[#262531] flex items-center justify-between bg-[#191822] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Volume2 className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              {channel.name}
              <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Kênh Thoại Voice
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400 truncate max-w-md">
              {channel.topic || 'Đàm thoại âm thanh đa kênh chất lượng cao'}
            </p>
          </div>
        </div>

        {isConnected && (
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
              <Signal className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>RTC 14ms • Opus 128k</span>
            </div>
            <span className="text-zinc-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {participants.length} đang nghe
            </span>
          </div>
        )}
      </div>

      {/* Center Voice Stage Area */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center">
        {!isConnected ? (
          /* Join Prompt Banner */
          <div className="max-w-md w-full text-center space-y-6 bg-[#1D1C27] border border-[#2F2E3E] rounded-3xl p-8 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-inner">
              <Volume2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                Tham gia {channel.name}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Đàm thoại trực tiếp với các thành viên trong cộng đồng Vplay. Hỗ trợ mic, tai nghe và chia sẻ màn hình mô phỏng chuẩn Discord.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onJoinVoice}
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Volume2 className="w-5 h-5" />
                Kết nối vào Kênh Thoại
              </button>
            </div>

            {participants.length > 0 && (
              <div className="pt-4 border-t border-white/5 text-xs text-zinc-400">
                <span>Hiện đang có trong phòng: </span>
                <span className="text-zinc-200 font-medium">
                  {participants.map((p) => p.name).join(', ')}
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Active Voice Room Grid */
          <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
            {/* Screen share area if active */}
            {isScreenSharing && (
              <div className="w-full max-w-3xl aspect-video rounded-2xl bg-[#0F0E14] border border-[#3A394D] overflow-hidden relative shadow-2xl flex flex-col">
                <div className="h-8 px-4 bg-[#1B1A24] border-b border-white/5 flex items-center justify-between text-xs text-zinc-300">
                  <span className="flex items-center gap-2 font-medium">
                    <Monitor className="w-3.5 h-3.5 text-rose-400" />
                    Chia sẻ màn hình trực tiếp • 1080p 60fps
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    LIVE
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#12111A] to-[#1A1926] p-6 text-center">
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                      <Tv className="w-8 h-8" />
                    </div>
                    <div className="text-sm font-semibold text-zinc-200">
                      Đang phát sóng luồng màn hình trực tiếp
                    </div>
                    <div className="text-xs text-zinc-500 max-w-sm">
                      Mọi người trong phòng thoại đang theo dõi nội dung của bạn với độ trễ siêu thấp.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Participants Avatar Cards Grid */}
            <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {participants.map((p) => {
                const isSpeakingNow = (activeSpeakerId === p.id && !p.isMuted) || (p.isSpeaking && !p.isMuted);

                return (
                  <div
                    key={p.id}
                    className={`relative rounded-2xl p-5 flex flex-col items-center justify-center transition-all ${
                      isSpeakingNow
                        ? 'bg-[#1F2429] border-2 border-emerald-500 shadow-xl shadow-emerald-500/20 scale-[1.02]'
                        : 'bg-[#1C1B26] border border-[#2D2C3C]'
                    }`}
                  >
                    {/* Speaking animated halo */}
                    <div className="relative mb-3">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className={`w-16 h-16 rounded-full bg-[#121118] border-2 transition-all object-cover ${
                          isSpeakingNow
                            ? 'border-emerald-400 ring-4 ring-emerald-500/30 animate-pulse'
                            : 'border-white/10'
                        }`}
                      />
                      {/* Speaking indicator dot */}
                      {isSpeakingNow && (
                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-[#1C1B26] rounded-full flex items-center justify-center shadow">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                        </span>
                      )}
                    </div>

                    {/* Name & Tag */}
                    <div className="text-center w-full">
                      <div className="text-xs font-bold text-white truncate px-1">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono truncate">
                        {p.role}
                      </div>
                    </div>

                    {/* Status icons: Muted / Deafened / Live */}
                    <div className="mt-3 flex items-center gap-1.5">
                      {p.isMuted && (
                        <span className="p-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30" title="Đã tắt mic">
                          <MicOff className="w-3 h-3" />
                        </span>
                      )}
                      {p.isDeafened && (
                        <span className="p-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30" title="Đã tắt tai nghe">
                          <VolumeX className="w-3 h-3" />
                        </span>
                      )}
                      {p.isScreenSharing && (
                        <span className="p-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30" title="Đang chia sẻ màn hình">
                          <Monitor className="w-3 h-3" />
                        </span>
                      )}
                      {!p.isMuted && !p.isDeafened && !p.isScreenSharing && (
                        <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
                          <Mic className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Voice Controls Bar at Bottom (Only when connected) */}
      {isConnected && (
        <div className="h-20 px-8 bg-[#181722] border-t border-[#272635] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              Đang kết nối: {channel.name}
            </div>
          </div>

          {/* Action buttons: Mic, Deafen, Screen share, Disconnect */}
          <div className="flex items-center gap-3">
            {/* Mic toggle */}
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Bật Mic (Unmute)' : 'Tắt Mic (Mute)'}
              className={`p-3.5 rounded-2xl transition-all font-medium text-sm flex items-center gap-2 cursor-pointer ${
                isMuted
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-[#2A2938] text-white hover:bg-[#353447] border border-white/10'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5 text-rose-400" /> : <Mic className="w-5 h-5 text-emerald-400" />}
              <span className="hidden sm:inline text-xs font-semibold">
                {isMuted ? 'Đã tắt Mic' : 'Mic Bật'}
              </span>
            </button>

            {/* Deafen toggle */}
            <button
              onClick={onToggleDeafen}
              title={isDeafened ? 'Bật Âm thanh (Undeafen)' : 'Tắt Âm thanh (Deafen)'}
              className={`p-3.5 rounded-2xl transition-all font-medium text-sm flex items-center gap-2 cursor-pointer ${
                isDeafened
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-[#2A2938] text-white hover:bg-[#353447] border border-white/10'
              }`}
            >
              {isDeafened ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Headphones className="w-5 h-5 text-cyan-400" />}
              <span className="hidden sm:inline text-xs font-semibold">
                {isDeafened ? 'Tắt Tai nghe' : 'Tai nghe Bật'}
              </span>
            </button>

            {/* Screen Share toggle */}
            <button
              onClick={onToggleScreenShare}
              title={isScreenSharing ? 'Dừng chia sẻ' : 'Chia sẻ màn hình'}
              className={`p-3.5 rounded-2xl transition-all font-medium text-sm flex items-center gap-2 cursor-pointer ${
                isScreenSharing
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-[#2A2938] text-white hover:bg-[#353447] border border-white/10'
              }`}
            >
              <Monitor className="w-5 h-5 text-purple-400" />
              <span className="hidden sm:inline text-xs font-semibold">
                {isScreenSharing ? 'Dừng Live' : 'Phát Màn hình'}
              </span>
            </button>

            {/* Disconnect button */}
            <button
              onClick={onLeaveVoice}
              title="Ngắt kết nối kênh thoại"
              className="p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all font-medium text-sm flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <PhoneOff className="w-5 h-5" />
              <span className="text-xs font-bold">Rời Kênh</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
